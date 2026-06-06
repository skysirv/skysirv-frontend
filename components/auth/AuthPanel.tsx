'use client'

import { useEffect, useState } from 'react'
import CreateAccountForm from './CreateAccountForm'
import SignInForm from './SignInForm'

type AuthMode = 'signin' | 'signup'

type AuthSuccessPayload = {
  token: string
  user: {
    is_admin?: boolean
    [key: string]: any
  }
}

type AuthPanelProps = {
  onSignupComplete?: () => void
  onSigninComplete?: (payload: AuthSuccessPayload) => void
}

export default function AuthPanel({ onSignupComplete, onSigninComplete }: AuthPanelProps) {
  const [mode, setMode] = useState<AuthMode>('signin')
  const [signupSuccess, setSignupSuccess] = useState(false)

  useEffect(() => {
    if (!signupSuccess) return

    const timer = window.setTimeout(() => {
      onSignupComplete?.()
      setMode('signin')
      setSignupSuccess(false)
    }, 8000)

    return () => window.clearTimeout(timer)
  }, [signupSuccess, onSignupComplete])

  return (
    <div>
      {mode === 'signin' ? (
        <>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-orange-500">
              Sign in to Skysirv
            </h2>

            <p className="mt-2 text-sm text-slate-600">
              Access your Skysirv travel network
            </p>
          </div>

          <SignInForm
            onSuccess={(payload) => {
              onSigninComplete?.(payload)
            }}
          />

          <div className="mt-5 text-center text-sm text-slate-600">
            Don&apos;t have an account?{' '}
            <button
              type="button"
              onClick={() => setMode('signup')}
              className="font-semibold text-blue-700 transition hover:underline"
            >
              Create account
            </button>
          </div>
        </>
      ) : signupSuccess ? (
        <div className="flex flex-col items-center justify-center py-7 text-center">
          <img
            src="/branding/icon/skysirv-icon-512.png"
            alt="Skysirv"
            className="mb-5 h-14 w-14 rounded-2xl"
          />

          <h2 className="text-2xl font-bold text-orange-500">
            Account Created
          </h2>

          <p className="mt-3 max-w-sm text-sm leading-6 text-slate-600">
            Your Skysirv account is almost ready.
          </p>

          <div className="mt-5 w-full rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4 text-left">
            <div className="flex gap-3">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-700">
                1
              </span>

              <div>
                <p className="text-sm font-bold text-slate-800">
                  Check your inbox
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  We sent you an activation email. Open it and click the activation
                  link to continue.
                </p>
              </div>
            </div>

            <div className="mt-4 flex gap-3">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-50 text-xs font-bold text-orange-600">
                2
              </span>

              <div>
                <p className="text-sm font-bold text-slate-800">
                  Choose your plan
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  After activation, you’ll continue into the Skysirv plan flow and
                  unlock the right dashboard for your account.
                </p>
              </div>
            </div>
          </div>

          <p className="mt-5 max-w-sm text-xs leading-5 text-slate-500">
            Don’t see the email? Check your spam folder or try again with the correct
            email address.
          </p>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-orange-500">
              Create your Skysirv account
            </h2>

            <p className="mt-2 text-sm text-slate-600">
              Start planning smarter with real travel intelligence
            </p>
          </div>

          <CreateAccountForm
            onSuccess={() => {
              setSignupSuccess(true)
            }}
          />

          <div className="mt-3 text-center text-sm text-slate-600">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => setMode('signin')}
              className="font-semibold text-blue-700 transition hover:underline"
            >
              Sign in
            </button>
          </div>
        </>
      )}
    </div>
  )
}