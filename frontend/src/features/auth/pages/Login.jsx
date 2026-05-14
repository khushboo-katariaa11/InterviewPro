import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import "../auth.form.scss"
import { useAuth } from '../hooks/useAuth'

const Login = () => {

    const { loading, handleLogin } = useAuth()
    const navigate = useNavigate()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()
        await handleLogin({ email, password })
        navigate('/')
    }

    if (loading) {
        return (
            <main className="auth-page">
                <div className="auth-container">
                    <div className="skeleton-auth-header" />
                    <div className="skeleton-auth-input" />
                    <div className="skeleton-auth-input" />
                    <div className="skeleton-auth-button" />
                    <div className="skeleton-auth-text" />
                </div>
            </main>
        )
    }

    return (
        <main className="auth-page">
            <div className="auth-container">
                <div className="auth-header">
                    <h1>Login</h1>
                    <p>Access your interview preparation dashboard</p>
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            id="email"
                            name='email'
                            placeholder='you@example.com'
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            id="password"
                            name='password'
                            placeholder='Enter your password'
                            required
                        />
                    </div>

                    <button type="submit" className='button primary-button'>
                        Login to Dashboard
                    </button>
                </form>

                <div className="auth-footer">
                    <p>Don't have an account? <Link to="/register">Create one</Link></p>
                </div>
            </div>
        </main>
    )
}

export default Login