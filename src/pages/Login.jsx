

import { Link, useNavigate } from "react-router-dom"
import supabase from "../supabase-client"
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
  
    useEffect(() => {
      if (localStorage.getItem('QTTY')) {
        navigate('/tasks')
      }
    }, [])
    

    const handleLogin = async (e) => {
        e.preventDefault()
      if (!email || !password) {
        toast.warn('Please enter both email and password');
        return;
      }
  
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      if (error) {
        toast.error('Login failed: ' + error.message);
        console.error('Login Error:', error);
      } else {
        localStorage.setItem('QTTY', JSON.stringify(data.user));
        toast.success('Login successful!');
        console.log('User Data:', data.user);
        navigate('/tasks');
      }
    };
    return (
        <div className="container-fluid">
            <div className="card border-0 shadow mb-4" style={{ marginTop: '150px' }}>
                <div className="card-body">
                    <h1 className="h4 text-center mb-4">Login</h1>
                    <form onSubmit={handleLogin}>
                        <div className="mb-3">
                            <label htmlFor="loginEmail" className="form-label">Email address</label>
                            <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email" className="form-control" id="loginEmail" placeholder="Enter your email" required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="loginPassword" className="form-label">Password</label>
                            <input 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type="password" className="form-control" id="loginPassword" placeholder="Enter your password" required />
                        </div>
                        <button type="submit" className="btn btn-success w-100">Login</button>
                        <p className="text-center mt-3">
                            Don't have an account? <Link to={"/register"}>Register</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>


    )
}

export default Login
