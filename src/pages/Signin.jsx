import React, { useState } from "react";
import axios from "axios";

export default function Signin() {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:8080/signIn", credentials)
      .then((response) => {
        console.log("Login successful:", response.data);
        alert("Sign in successful");
        // Redirect or perform further actions here
      })
      .catch((error) => {
        console.error("Login failed:", error);
        alert("Invalid username or password");
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Sign In</h2>
      <label>Username:</label>
      <input
        type="text"
        name="username"
        value={credentials.username}
        onChange={handleChange}
      />
      <br />
      <br />
      <label>Password:</label>
      <input
        type="password"
        name="password"
        value={credentials.password}
        onChange={handleChange}
      />
      <br />
      <br />
      <button type="submit">Login</button>
    </form>
  );
}
