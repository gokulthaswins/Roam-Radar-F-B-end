import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './newcss.css';

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const validateForm = () => {
    let valid = true;
    let errors = {
      username: "",
      password: "",
    };

    if (!username.trim()) {
      errors.username = "Username is required.";
      valid = false;
    }

    if (!password.trim()) {
      errors.password = "Password is required.";
      valid = false;
    }

    setErrors(errors);
    return valid;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  
    if (validateForm()) {
      const user = { username, password };
      fetch('http://localhost:8080/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Invalid credentials');
          }
        })
        .then((data) => {
          console.log('Success:', data);
  
          // Assuming data contains a user ID field (e.g., data.userId)
          // if (data.id) {
            localStorage.setItem('userId', data.id);
            console.log(data.id);
          // }
  
          if (rememberMe) {
            localStorage.setItem('isLoggedIn', 'true'); // Set login flag
          }
  
          navigate("/");
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  };
  

  return (
    <div id="login-tab-content" className="tabcontent">
      <form className="login-form" onSubmit={handleSubmit}>
        <input
          type="text"
          className={`input ${errors.username && "input-error"}`}
          id="user_login"
          autoComplete="off"
          placeholder="Username"
          value={username}
          onChange={handleUsernameChange}
        />
        {errors.username && <p className="error">{errors.username}</p>}

        <input
          type="password"
          className={`input ${errors.password && "input-error"}`}
          id="user_pass"
          autoComplete="off"
          placeholder="Password"
          value={password}
          onChange={handlePasswordChange}
        />
        {errors.password && <p className="error">{errors.password}</p>}

        <input
          type="checkbox"
          className="checkbox"
          id="remember_me"
          checked={rememberMe}
          onChange={(event) => setRememberMe(event.target.checked)}
        />
        <label htmlFor="remember_me">Remember me</label>

        <input type="submit" className="button" value="Login" />
      </form>
      <div className="help-text">
        <p>
          <a href="#">Forget your password?</a>
        </p>
      </div>
    </div>
  );
}

export default Login;
