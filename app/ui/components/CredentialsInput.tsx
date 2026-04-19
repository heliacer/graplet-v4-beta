import clsx from 'clsx'

export function CredentialsInput({
  value,
  name,
  type = 'text',
  placeholder,
  setValue,
  disabled = false
}: {
  value?: string
  name?: string
  type?: string
  placeholder?: string
  setValue?: (value: string) => void
  disabled?: boolean
}) {
  const inputProps: React.InputHTMLAttributes<HTMLInputElement> = {
    name: name || type,
    className: clsx(
      'w-full pr-12 border h-9 pl-3 rounded-lg truncate',
      'focus:outline-none'
    ),
    placeholder: placeholder || type,
    type,
    inputMode: 'email',
    autoComplete: 'off',
    disabled,
    autoFocus: true
  }

  if (value !== undefined) {
    inputProps.value = value
  }

  if (setValue) {
    inputProps.onChange = e => setValue(e.target.value)
  }

  return <input id='credentialsInput' {...inputProps} />
}
