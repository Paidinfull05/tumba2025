import React, { useState } from "react";
import axios from "axios";

const Admin = () => {
    const [username, setUsername] = useState("");
    const [action, setAction] = useState("grant");

    const manageAccess = async () => {
        const token = localStorage.getItem("adminToken");
        try {
            await axios.post(
                "http://localhost:5000/admin/manage",
                { username, action },
                { headers: { Authorization: token } }
            );
            alert(`Access ${action}ed`);
        } catch (error) {
            alert("Action failed");
        }
    };

    return (
        <div>
            <h2>Admin Panel</h2>
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
