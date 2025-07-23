export default function CredentialsInput({
  value = '',
  name,
  type = 'text',
  setValue = () => {},
  setIsFocussed = () => {},
  disabled = false
}: {
  value?: string
  name?: string
  type?: string
  setValue?: (value: string) => void
  setIsFocussed?: (isFocussed: boolean) => void
  disabled?: boolean
}){
  return (
    <input
      name={name || type}
      className='w-full pr-12 border py-1.5 pl-3 rounded-full border-zinc-700 truncate focus:outline-none focus:bg-zinc-800 focus:border-zinc-600'
      placeholder={type === 'email' ? 'Enter granted Email' : 'Enter Password'}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onFocus={() => setIsFocussed(true)}
      onBlur={() => setIsFocussed(false)}
      type={type}
      inputMode='email'
      autoComplete='off'
      disabled={disabled}
      autoFocus
    />
  )
}