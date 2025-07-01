import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    dob: "",
    gender: "",
    role: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:8080/signUp", formData)
      .then((response) => {
        console.log("Response:", response.data);
        alert("signup successful", response.data);
        navigate("/sign_in_page");
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("signup failed");
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Username:</label>
      <input
        type="text"
        name="username"
        value={formData.username}
        onChange={handleChange}
      />
      <br />
      <br />
      <label>Email:</label>
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
      />
      <br />
      <br />
      <label>Password:</label>
      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
      />
      <br />
      <br />
      <label>Date of Birth:</label>
      <input
        type="date"
        name="dob"
        value={formData.dob}
        onChange={handleChange}
      />
      <br />
      <br />
      <label>Gender:</label>
      <select name="gender" value={formData.gender} onChange={handleChange}>
        <option value="">Select</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
      </select>
      <br />
      <br />
      <label>Role:</label>
      <div>
        <label>
          <input
            type="radio"
            name="role"
            value="admin"
            checked={formData.role === "admin"}
            onChange={handleChange}
          />
          Admin
        </label>
        <label>
          <input
            type="radio"
            name="role"
            value="customer"
            checked={formData.role === "customer"}
            onChange={handleChange}
          />
          Customer
        </label>
      </div>
      <br />
      <br />
      <button type="submit">Send Request</button>
    </form>
  );
}
