import React, { useState } from 'react';
import '../../global.css'
import styles from './Register.module.css'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        photos: null,
    });
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleFileChange = (e) => {
        if (e.target.files) {
            setFormData({
                ...formData,
                photos: e.target.files,
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true)
            console.log('Form Data:', formData);

            const response = await axios.post('http://localhost:5000/auth/register', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true
            });

            setFormData({
                name: '',
                email: '',
                password: '',
                photos: null,
            });
            navigate('/login')
        } catch (error) {
            console.error('Error during registration:', error);
        } finally {
            setLoading(false)
        }
    };

    return (
        <div className={styles.base}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <h2 className="big-title text-center">REGISTER NEW USER</h2>
                <div className={styles.input_set}>
                    <label className={styles.label} htmlFor="name">Name</label>
                    <input
                    className={styles.input_box}
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    />
                </div>

                <div className={styles.input_set}>
                    <label className={styles.label} htmlFor="email">Email</label>
                    <input
                    className={styles.input_box}
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    />
                </div>

                <div className={styles.input_set}>
                    <label className={styles.label} htmlFor="password">Password</label>
                    <input
                    className={styles.input_box}
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    />
                </div>

                <div className={styles.input_set}>
                    <label className={styles.label} htmlFor="photos">Your Photos</label>
                    <input
                    className={styles.input_box}
                    type="file"
                    id="photos"
                    name="photos[]"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    />
                </div>

                {(formData.photos != null) &&
                <div className={styles.img_container}>
                    {Array.from(formData.photos).map((photo, index) => (
                    <img key={index} src={URL.createObjectURL(photo)} alt={`photo-${index}`} className={styles.photo}/>
                    ))}
                </div>}

                <button type="submit" disabled={loading}>
                    {loading ? 'Submitting...' : 'Register'}
                </button>

                <p className={styles.link}>
                    Already have an account? <Link to="/login">Login Here!</Link>
                </p>
            </form>
        </div>
    );
};

export default Register;