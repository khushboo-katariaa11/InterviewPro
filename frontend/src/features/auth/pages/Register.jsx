import React from "react";
import "../auth.form.scss";

import { useNavigate,Link } from "react-router";




const Register = () => {
    const navigate = useNavigate();
     const handleSubmit = (e) => {
        e.preventDefault();
        // Handle login logic here
    }
  return (
    <main>
      <div className="form_container">
        <h1>Create Your Account</h1>
        <p className="subtitle">Join SkillGap to identify and close your skill gaps</p>
        <form onSubmit={handleSubmit}>
          <div className="input_group">
            <label htmlFor="name">Full Name</label>
            <input type="text" id="name" placeholder="John Doe"/>
          </div>
          <div className="input_group">
            <label htmlFor="email">Email Address</label>
            <input type="email" id="email" placeholder="you@example.com"/>
          </div>
          <div className="input_group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" placeholder="Create a password"/>
          </div>
          <button type="submit">Sign Up</button>
        </form>
        <div className="auth_link">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </main>
  );
}   
export default Register;  