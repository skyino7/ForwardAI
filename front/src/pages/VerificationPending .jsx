import React from 'react'

const VerificationPending  = () => {
  return (
    <div className="verification-pending">
      <h1>Verification Pending</h1>
      <p>
        Thank you for signing up! An email has been sent to your email address with instructions
        on how to verify your account. Please check your inbox and follow the provided link to complete
        the verification process.
      </p>
      <p>
        If you haven't received the email, please check your spam folder. If you still encounter issues,
        contact support for assistance.
      </p>
    </div>
  )
}

export default VerificationPending