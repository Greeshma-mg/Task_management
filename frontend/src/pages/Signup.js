import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Signup(){
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/signup", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/tasks"); 
    } catch (err) {
      alert(err.response?.data?.error || "Signup failed");
    }
  };

  return (
    <div style={{textAlign:"center", marginTop:40}}>
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" value={form.name} onChange={handleChange} placeholder="Name" required /><br/><br/>
        <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" required /><br/><br/>
        <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Password" required /><br/><br/>
        <button type="submit">Signup</button>
      </form>
    </div>
  );
}
