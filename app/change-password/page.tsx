export default function ChangePassword() {
  /** @todo (#91) Password change links (resend) -> change/reset password */
  return (
    <main className='w-full mt-20 flex flex-col gap-4 items-center'>
      <h1 className='text-xl'>Change your password</h1>
      <div className='text-sm text-center'>
        <p>
          Enter your email address and we&apos;ll send you a password change
          link.
        </p>
      </div>
    </main>
  )
}
