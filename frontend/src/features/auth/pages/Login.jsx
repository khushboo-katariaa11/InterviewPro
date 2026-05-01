import React from "react";
import "../auth.form.scss";
import { useNavigate,Link } from "react-router";

const Login = () => {

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle login logic here
    }
  return (
    <main>
      <div className="form_container">
        <h1>Welcome Back</h1>
        <p className="subtitle">Sign in to continue to SkillGap</p>
        <form onSubmit={handleSubmit}>
          <div className="input_group">
            <label htmlFor="email">Email Address</label>
            <input type="email" id="email" placeholder="you@example.com"/>
          </div>
          <div className="input_group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" placeholder="Enter your password"/>
          </div>
          <button type="submit">Sign In</button>
        </form>
        <div className="auth_link">
          Don't have an account? <Link to="/register">Sign up</Link>
        </div>
      </div>
    </main>
  );
}   
export default Login;