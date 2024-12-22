import React, { useState } from 'react';
import '../../global.css'
import styles from './Login.module.css'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

const Login = () => {

    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [loading, setLoading] = useState(false);
    const [loginError, setLoginError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            setLoginError('');
            setLoading(true);

            const response = await axios.post('http://localhost:5000/auth/login', formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true
            })
            localStorage.setItem('token', response.data.token)
            localStorage.setItem('user', JSON.stringify(response.data.user));

            navigate('/home')
        } catch (error) {
            setLoginError('Login failed. Please check your credentials.')
        } finally {
            setLoading(false)
        }
    };

    return (
        <div className={styles.base}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <h1 className="big-title text-center">LOGIN FACETTENDENCE</h1>
                <div className={styles.input_set}>
                    <label htmlFor="email" className={styles.label}>Email</label>
                    <input
                        type="text"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={styles.input_box}
                        placeholder="Enter your email"
                    />
                </div>
                <div className={styles.input_set}>
                    <label htmlFor="password" className={styles.label}>Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={styles.input_box}
                        placeholder="Enter your password"
                    />
                </div>

                {loginError && <div className="error-message">{loginError}</div>}

                <button
                type="submit"
                disabled={loading}
                className={styles.btn}>
                {loading ? 'Logging in...' : 'Login'}
                </button>

                <p className={styles.link}>
                    Don't have an account yet? <Link to="/register">Register Here!</Link>
                </p>
            </form>
        </div>
    );
};

export default Login;
