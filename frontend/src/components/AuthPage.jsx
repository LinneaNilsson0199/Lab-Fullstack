import { useState } from "react";

function AuthPage({ API_URL, setUser }) {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginMessage, setLoginMessage] = useState("");

  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerAge, setRegisterAge] = useState("");
  const [registerWeight, setRegisterWeight] = useState("");
  const [registerMessage, setRegisterMessage] = useState("");

  async function login(e) {
    e.preventDefault();
    setLoginMessage("");

    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setLoginMessage(data.message || "Login failed");
        return;
      }

      localStorage.setItem("loggedInUser", JSON.stringify(data));
      setUser(data);
    } catch (error) {
      console.error(error);
      setLoginMessage("Could not connect to server.");
    }
  }

  async function register(e) {
    e.preventDefault();
    setRegisterMessage("");

    try {
      const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: registerName,
          email: registerEmail,
          password: registerPassword,
          age: Number(registerAge),
          weight: Number(registerWeight)
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setRegisterMessage(data.message || "Register failed");
        return;
      }

      setRegisterMessage("Account created successfully. You can now log in.");
      setRegisterName("");
      setRegisterEmail("");
      setRegisterPassword("");
      setRegisterAge("");
      setRegisterWeight("");
    } catch (error) {
      console.error(error);
      setRegisterMessage("Could not connect to server.");
    }
  }

  return (
    <div className="page">
      <div className="login-container">
        <div className="card">
          <h1>Gym Tracker</h1>

          <form onSubmit={login}>
            <label>Email</label>
            <input
              type="email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              required
            />

            <label>Password</label>
            <input
              type="password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              required
            />

            <button type="submit">Log In</button>
          </form>

          <p>{loginMessage}</p>
        </div>

        <div className="card">
          <h2>Create Account</h2>

          <form onSubmit={register}>
            <label>Name</label>
            <input
              value={registerName}
              onChange={(e) => setRegisterName(e.target.value)}
              required
            />

            <label>Email</label>
            <input
              type="email"
              value={registerEmail}
              onChange={(e) => setRegisterEmail(e.target.value)}
              required
            />

            <label>Password</label>
            <input
              type="password"
              value={registerPassword}
              onChange={(e) => setRegisterPassword(e.target.value)}
              required
            />

            <label>Age</label>
            <input
              type="number"
              value={registerAge}
              onChange={(e) => setRegisterAge(e.target.value)}
              required
            />

            <label>Weight</label>
            <input
              type="number"
              value={registerWeight}
              onChange={(e) => setRegisterWeight(e.target.value)}
              required
            />

            <button type="submit">Register</button>
          </form>

          <p>{registerMessage}</p>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;