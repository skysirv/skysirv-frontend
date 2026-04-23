'use client'

import { useEffect, useState } from 'react'
import CreateAccountForm from './CreateAccountForm'
import SignInForm from './SignInForm'

type AuthMode = 'signin' | 'signup'

type AuthPanelProps = {
  onSignupComplete?: () => void
}

export default function AuthPanel({ onSignupComplete }: AuthPanelProps) {
  const [mode, setMode] = useState<AuthMode>('signin')
  const [signupSuccess, setSignupSuccess] = useState(false)

  useEffect(() => {
    if (!signupSuccess) return

    const timer = window.setTimeout(() => {
      onSignupComplete?.()
      setMode('signin')
      setSignupSuccess(false)
    }, 3600)

    return () => window.clearTimeout(timer)
  }, [signupSuccess, onSignupComplete])

  return (
    <div>
      {mode === 'signin' ? (
        <>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900">
              Sign in to Skysirv
            </h2>

            <p className="mt-2 text-sm text-slate-600">
              Access your flight intelligence dashboard
            </p>
          </div>

          <SignInForm />

          <div className="mt-6 text-center text-sm text-slate-600">
            Don&apos;t have an account?{' '}
            <button
              type="button"
              onClick={() => setMode('signup')}
              className="font-semibold text-slate-900 transition hover:underline"
            >
              Create account
            </button>
          </div>
        </>
      ) : signupSuccess ? (
        <>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900">
              Account Created
            </h2>

            <p className="mt-2 text-sm text-slate-600">
              Thank you for creating your Skysirv account.
            </p>

            <p className="mt-2 text-sm text-slate-600">
              You should receive an activation email shortly.
            </p>
          </div>

          <div className="text-sm leading-6 text-slate-600">
            <p>Please check your inbox and click the activation link to continue.</p>
            <p className="mt-3">If you don’t see the email, check your spam folder.</p>
          </div>
        </>
      ) : (
        <>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900">
              Create your Skysirv™ account
            </h2>

            <p className="mt-2 text-sm text-slate-600">
              Start monitoring airfare with real travel intelligence
            </p>
          </div>

          <CreateAccountForm
            onSuccess={() => {
              console.log('AUTH PANEL SIGNUP SUCCESS FIRED')
              setSignupSuccess(true)
            }}
          />

          <div className="mt-6 text-center text-sm text-slate-600">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => setMode('signin')}
              className="font-semibold text-slate-900 transition hover:underline"
            >
              Sign in
            </button>
          </div>
        </>
      )}
    </div>
  )
}