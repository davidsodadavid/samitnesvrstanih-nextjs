import { login } from './actions'

export const metadata = { title: 'Log in — Samit dashboard' }

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-zinc-100 text-zinc-900">
      <form
        action={login}
        className="flex w-90 flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-8"
      >
        <h1 className="text-xl font-bold">Samit dashboard</h1>
        {error && (
          <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            Wrong password, try again.
          </p>
        )}
        <label className="flex flex-col gap-1.5 text-sm font-semibold">
          Password
          <input
            type="password"
            name="password"
            required
            autoFocus
            className="rounded-lg border border-zinc-300 px-3 py-2 font-normal outline-offset-[-1px] focus:outline-2 focus:outline-zinc-900"
          />
        </label>
        <button
          type="submit"
          className="cursor-pointer rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-700"
        >
          Log in
        </button>
      </form>
    </div>
  )
}
