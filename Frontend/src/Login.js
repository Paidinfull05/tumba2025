import React, { useState } from "react";
import axios from "axios";

const Login = ({ setToken }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        try {
            const res = await axios.post("http://localhost:5000/login", { username, password });
            setToken(res.data.token);
            window.location.href = res.data.streamUrl;
        } catch (error) {
            alert("Login failed");
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
            <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
            <button onClick={handleLogin}>Login</button>
        </div>
    );
};

export default Login;
