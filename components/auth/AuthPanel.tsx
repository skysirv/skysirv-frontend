'use client'

import { useState } from 'react'
import CreateAccountForm from './CreateAccountForm'
import SignInForm from './SignInForm'

type AuthMode = 'signin' | 'signup'

export default function AuthPanel() {
    const [mode, setMode] = useState<AuthMode>('signin')

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-900">
                    {mode === 'signin' ? 'Sign in to Skysirv' : 'Create your Skysirv™ account'}
                </h2>

                <p className="mt-2 text-sm text-slate-600">
                    {mode === 'signin'
                        ? 'Access your flight intelligence dashboard'
                        : 'Start monitoring airfare with real travel intelligence'}
                </p>
            </div>

            {mode === 'signin' ? <SignInForm /> : <CreateAccountForm />}

            <div className="mt-6 text-center text-sm text-slate-600">
                {mode === 'signin' ? (
                    <>
                        Don&apos;t have an account?{' '}
                        <button
                            type="button"
                            onClick={() => setMode('signup')}
                            className="font-semibold text-slate-900 transition hover:underline"
                        >
                            Create account
                        </button>
                    </>
                ) : (
                    <>
                        Already have an account?{' '}
                        <button
                            type="button"
                            onClick={() => setMode('signin')}
                            className="font-semibold text-slate-900 transition hover:underline"
                        >
                            Sign in
                        </button>
                    </>
                )}
            </div>
        </div>
    )
}