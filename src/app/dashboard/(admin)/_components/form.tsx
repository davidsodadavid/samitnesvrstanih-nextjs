// Shared server-renderable form building blocks for the dashboard.

const inputClass =
  'rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-normal outline-offset-[-1px] focus:outline-2 focus:outline-zinc-900'

export function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <label className="flex flex-col gap-1.5 text-sm font-semibold">
      {label}
      {children}
    </label>
  )
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={inputClass} />
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${inputClass} min-h-30 resize-y`} />
}

export function Select({
  options,
  emptyLabel,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  options: { value: string | number; label: string }[]
  emptyLabel?: string
}) {
  return (
    <select {...props} className={inputClass}>
      {emptyLabel !== undefined && <option value="">{emptyLabel}</option>}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}

export function SubmitButton({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="submit"
      className="cursor-pointer self-start rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-700"
    >
      {children}
    </button>
  )
}

export function FormCard({
  action,
  children,
}: {
  action: (formData: FormData) => Promise<void>
  children: React.ReactNode
}) {
  return (
    <form
      action={action}
      className="flex max-w-5xl flex-col gap-3.5 rounded-xl border border-zinc-200 bg-white p-5"
    >
      {children}
    </form>
  )
}
