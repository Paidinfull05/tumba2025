import React, { useState } from "react";
import axios from "axios";

const API_URL = "https://your-vercel-backend.vercel.app/api"; // Change this

const Admin = () => {
    const [username, setUsername] = useState("");
    const [action, setAction] = useState("grant");
    const [message, setMessage] = useState("");

    const manageAccess = async () => {
        const token = localStorage.getItem("adminToken");

        try {
            const res = await axios.post(
                `${API_URL}/admin/manage`,
                { username, action },
                { headers: { Authorization: token } }
            );
            setMessage(res.data.message);
        } catch (error) {
            setMessage("Action failed.");
        }
    };

    return (
        <div>
            <h2>Admin Panel</h2>
            {message && <p>{message}</p>}
            <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
            <select onChange={(e) => setAction(e.target.value)}>
                <option value="grant">Grant</option>
                <option value="revoke">Revoke</option>
            </select>
            <button onClick={manageAccess}>Submit</button>
        </div>
    );
};

export default Admin;
