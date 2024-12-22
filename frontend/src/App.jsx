import React from 'react';
import { BrowserRouter as Router, Link, Route, Routes } from 'react-router-dom';
import About from './pages/About/About'
import Home from './pages/Home/Home'
import Create from './pages/Create/Create'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import Profile from './pages/Profile/Profile'
import ErrorPage from './pages/ErrorPage/ErrorPage'
import styles from './App.module.css'
import Layout from './components/Layout/Layout'
import './global.css'

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/home" element={<Layout><Home /></Layout>} />
                <Route path="/about" element={<Layout><About /></Layout>} />
                <Route path="/create" element={<Layout><Create /></Layout>} />
                <Route path="/profile" element={<Layout><Profile /></Layout>} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="*" element={<ErrorPage 
                statusNumber={404} 
                statusMsg={'NotFound'} 
                addMsg={'Oops, looks like you lost somewhere...'}
                route={'/login'}
                routePage={'Login'}/>} />
            </Routes>
        </Router>
    );
}

export default App;
