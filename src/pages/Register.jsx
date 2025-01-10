

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"
import supabase from "../supabase-client";
import { toast } from "react-toastify";

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userError, setUserError] = useState('');
    const [confirm_password, setConfirmPassword] = useState('');
    const navigate = useNavigate()
    
    useEffect(() => {
        if (localStorage.getItem('QTTY')) {
            navigate('/tasks')
        }
    }, [])
    const handleRegister = async (e) => {
        e.preventDefault()
        if (password !== confirm_password) {
            toast.warn('Credential mismatch..., try again');
            return;
        }

        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
        });

        if (error) {
            console.log(error);
            setUserError(error.message);
            toast.error('Registration failed: ' + error.message);
        } else {
            toast.success('Successfully registered');
            console.log(data);
            navigate('/');
        }
    };


    return (
        <div>
            {userError && <h1>An error occur</h1>}
            <div className="card border-0 shadow mb-4" style={{ marginTop: '150px' }}>
                <div className="card-body">
                    <h1 className="h4 text-center mb-4">Register</h1>
                    <form onSubmit={handleRegister}>
                        <div className="mb-3">
                            <label htmlFor="registerEmail" className="form-label">Email address</label>
                            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="form-control" id="registerEmail" placeholder="Enter your email" required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="registerPassword" className="form-label">Password</label>
                            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="form-control" id="registerPassword" placeholder="Enter your password" required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="registerPassword" className="form-label">Password</label>
                            <input value={confirm_password} onChange={(e) => setConfirmPassword(e.target.value)} type="password" className="form-control" placeholder="Confirm your password" required />
                        </div>
                        <button type="submit" className="btn btn-success w-100">Register</button>
                        <p className="text-center mt-3">
                            Already have an account? <Link to={'/'}>Login</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>

    )
}

export default Register
