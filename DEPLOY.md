# Deploying samit

Production runs on a Debian 13 VPS (2 GB RAM, 4 cores): Node 22 + pm2 serve the
standalone Next.js build, Caddy terminates HTTPS, PostgreSQL 17 runs locally, media
lives in Cloudflare R2. GitHub Actions (`.github/workflows/deploy.yml`) builds on every
push to `master` and deploys over SSH — the VPS never runs `next build`.

```
push to master ──▶ GitHub Actions: pnpm build (standalone)
                        │ rsync ──▶ /srv/samit/releases/<sha>/
                        │ ssh tunnel ──▶ prisma migrate deploy
                        └ ssh ──▶ ln -sfn releases/<sha> current && pm2 reload
```

## One-time server setup

All commands as root unless noted. Replace `yourdomain.com` and passwords throughout.

### 1. Swap (2 GB RAM needs headroom)

```bash
fallocate -l 2G /swapfile && chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab
```

### 2. Packages

```bash
apt update && apt install -y curl ufw rsync postgresql

# Node 22 (NodeSource)
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt install -y nodejs
npm install -g pm2

# Caddy (official repo)
apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | tee /etc/apt/sources.list.d/caddy-stable.list
apt update && apt install -y caddy
```

### 3. Firewall

```bash
ufw allow 22/tcp && ufw allow 80/tcp && ufw allow 443/tcp && ufw enable
```

### 4. PostgreSQL

```bash
sudo -u postgres psql -c "CREATE USER samit WITH PASSWORD 'CHANGE-ME-STRONG';"
sudo -u postgres psql -c "CREATE DATABASE samit OWNER samit;"
```

Postgres listens on localhost only by default — leave it that way; migrations reach it
through an SSH tunnel.

### 5. Deploy user

```bash
adduser --disabled-password --gecos '' deploy
mkdir -p /srv/samit/releases /srv/samit/shared
chown -R deploy:deploy /srv/samit
```

On your **local machine**, generate a key pair for GitHub Actions:

```
ssh-keygen -t ed25519 -f samit_deploy -N ""
```

Put the **public** key (`samit_deploy.pub`) into `/home/deploy/.ssh/authorized_keys`
on the server (create the dir `chmod 700`, file `chmod 600`, owner `deploy`). The
**private** key becomes the `SSH_PRIVATE_KEY` GitHub secret (step 9).

Once key login works, harden sshd in `/etc/ssh/sshd_config`:
`PermitRootLogin prohibit-password` (or `no`) and `PasswordAuthentication no`,
then `systemctl reload ssh`.

### 6. Environment file

Create `/srv/samit/shared/.env` (owner `deploy`, `chmod 600`) — use **new** secrets,
not the dev values:

```env
DATABASE_URL="postgresql://samit:CHANGE-ME-STRONG@localhost:5432/samit?schema=public"

# Dashboard auth — generate SESSION_SECRET with: openssl rand -hex 32
ADMIN_PASSWORD="CHANGE-ME"
SESSION_SECRET="CHANGE-ME"

# Cloudflare R2 (same values as dev unless you use a separate prod bucket)
R2_ACCOUNT_ID="..."
R2_ACCESS_KEY_ID="..."
R2_SECRET_ACCESS_KEY="..."
R2_BUCKET="samit"
R2_PUBLIC_URL="https://pub-....r2.dev"
```

Build-time variables live in the deploy workflow, not here: anything prefixed
`NEXT_PUBLIC_` is inlined into the browser bundle during `pnpm build`, so setting
it on the server has no effect. Currently that is `NEXT_PUBLIC_CARTO_API_KEY`
(CARTO basemap tiles), supplied by the `CARTO_API_KEY` GitHub secret.

### 7. pm2

Create `/srv/samit/ecosystem.config.js` (owner `deploy`):

```js
module.exports = {
  apps: [
    {
      name: 'samit',
      script: '/srv/samit/current/server.js',
      cwd: '/srv/samit/current',
      // standalone server.js doesn't load .env itself; Node 22 injects it
      node_args: '--env-file=/srv/samit/shared/.env',
      env: { NODE_ENV: 'production', PORT: '3000', HOSTNAME: '127.0.0.1' },
    },
  ],
}
```

Make pm2 (running as `deploy`) survive reboots:

```bash
pm2 startup systemd -u deploy --hp /home/deploy
```

`pm2 save` runs on every deploy, so the app list stays current automatically.

### 8. Caddy

Replace `/etc/caddy/Caddyfile` with:

```
yourdomain.com {
    reverse_proxy 127.0.0.1:3000
}
```

Point your domain's A record at the VPS IP **before** reloading, then:

```bash
systemctl reload caddy
```

Caddy obtains and renews the Let's Encrypt certificate automatically. No body-size
config needed — 25 MB photo uploads pass through by default.

### 9. GitHub repository secrets

Settings → Secrets and variables → Actions:

| Secret | Value |
| --- | --- |
| `SSH_HOST` | the VPS IP or hostname |
| `SSH_USER` | `deploy` |
| `SSH_PRIVATE_KEY` | full contents of the `samit_deploy` private key file |
| `PROD_DATABASE_URL` | `postgresql://samit:CHANGE-ME-STRONG@localhost:5433/samit?schema=public` — **port 5433** (the CI-side tunnel), not 5432 |

## First deploy

Push to `master` (or run the workflow manually from the Actions tab). The first run
creates the schema via `prisma migrate deploy` and starts the app. Then check:

- `https://yourdomain.com` loads with a valid certificate
- `/dashboard` login works with the new `ADMIN_PASSWORD`
- photo upload works and images render from R2

## Copying local data to production (optional)

To bring your local database content (posts, events, galleries…) to the server:

```bash
# locally
pg_dump --no-owner --format=custom "postgresql://postgres:...@localhost:5432/samit" -f samit.dump
scp samit.dump deploy@<vps>:/tmp/
# on the server
pg_restore --no-owner --role=samit -d "postgresql://samit:...@localhost:5432/samit" /tmp/samit.dump
```

Do this after the first deploy (so migrations created the schema) but before adding
content on the server, or use `--clean` knowingly.

## Operations

- **Logs**: `pm2 logs samit` (as `deploy`); Caddy: `journalctl -u caddy`
- **Rollback**: `ln -sfn /srv/samit/releases/<previous-sha> /srv/samit/current && pm2 reload samit`
  (the last 3 releases are kept in `/srv/samit/releases`)
- **Restart**: `pm2 reload samit`; memory check: `free -h`
- **Backups** (recommended): nightly `pg_dump` cron as `postgres`, e.g.
  `pg_dump samit | gzip > /var/backups/samit-$(date +%F).sql.gz` plus rotation
