import Link from 'next/link'

export function PageHeader({
  title,
  newHref,
  newLabel,
}: {
  title: string
  newHref?: string
  newLabel?: string
}) {
  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
      <h1 className="text-2xl font-bold">{title}</h1>
      {newHref && (
        <Link
          href={newHref}
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-700"
        >
          {newLabel ?? 'New'}
        </Link>
      )}
    </div>
  )
}

export function ErrorNote({ message }: { message?: string }) {
  if (!message) return null
  return (
    <p className="mb-4 max-w-2xl rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
      {message}
    </p>
  )
}

export function DeleteButton({
  action,
  id,
}: {
  action: (formData: FormData) => Promise<void>
  id: number
}) {
  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="cursor-pointer text-sm font-medium text-red-600 hover:underline"
      >
        Delete
      </button>
    </form>
  )
}

export function EditLink({ href }: { href: string }) {
  return (
    <Link href={href} className="text-sm font-medium text-zinc-600 hover:underline">
      Edit
    </Link>
  )
}

export function Table({
  headers,
  children,
}: {
  headers: string[]
  children: React.ReactNode
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-zinc-200 text-left text-xs tracking-wide text-zinc-500 uppercase">
            {headers.map((header, i) => (
              <th key={i} className="px-3 py-2.5">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  )
}

export function Empty({ children }: { children: React.ReactNode }) {
  return <p className="py-5 text-sm text-zinc-500">{children}</p>
}
