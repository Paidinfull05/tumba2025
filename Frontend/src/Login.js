import React, { useState } from "react";
import axios from "axios";

const API_URL = "https://your-vercel-backend.vercel.app/api"; // Change this

const Login = ({ setToken }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async () => {
        try {
            const res = await axios.post(`${API_URL}/login`, {
                username,
                password,
                device: navigator.userAgent, // Capture device info
                ip: await fetch("https://api64.ipify.org?format=json").then(res => res.json()).then(data => data.ip)
            });

            setToken(res.data.token);
            localStorage.setItem("token", res.data.token);
            window.location.href = res.data.streamUrl;
        } catch (error) {
            setError("Login failed. Check your credentials.");
        }
    };

    return (
        <div>
            <h2>Login</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
            <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
            <button onClick={handleLogin}>Login</button>
        </div>
    );
};

export default Login;
