import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import "../auth.form.scss"
import { useAuth } from '../hooks/useAuth'

const Register = () => {

    const navigate = useNavigate()
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const { loading, handleRegister } = useAuth()

    const handleSubmit = async (e) => {
        e.preventDefault()
        await handleRegister({ username, email, password })
        navigate("/")
    }

    if (loading) {
        return (
            <main className="auth-page">
                <div className="auth-container">
                    <div className="skeleton-auth-header" />
                    <div className="skeleton-auth-input" />
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
                    <h1>Create Account</h1>
                    <p>Start your interview preparation journey</p>
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>

                    <div className="input-group">
                        <label htmlFor="username">Username</label>
                        <input
                            onChange={(e) => setUsername(e.target.value)}
                            type="text"
                            id="username"
                            name='username'
                            placeholder='Choose a username'
                            required
                        />
                    </div>

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
                            placeholder='Create a strong password'
                            required
                        />
                    </div>

                    <button type="submit" className='button primary-button'>
                        Create Account
                    </button>

                </form>

                <div className="auth-footer">
                    <p>Already have an account? <Link to="/login">Sign in</Link></p>
                </div>
            </div>
        </main>
    )
}

export default Register