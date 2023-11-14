import React, { useState } from 'react';
import { useAuth } from '../components/AuthProvider';
import { useNavigate } from 'react-router-dom';

const Login = () => {

  const { login } = useAuth();
  const navigate = useNavigate();
  const [loginFormData, setLoginFormData] = useState({
    username: '',
    password: '',
  });
  const [loginErrors, setLoginErrors] = useState(null);

  const handleChangeLoginForm = (e) => {
    const { name, value } = e.target;
    setLoginFormData({ ...loginFormData, [name]: value });
  };


  const handleSubmitLogin = async (e) => {
    e.preventDefault();

    try {
      // Send a POST request to your API's login endpoint
      const response = await fetch('https://trivia-backend.fly.dev/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginFormData),
      });

      if (response.ok) {
        // Handle successful login (e.g., store JWT, redirect)
        console.log('Login successful');
        const data = await response.json();
        login(data.token);
        navigate('/dashboard'); // Redirect to dashboard
      } else {
        // Handle login failure (e.g., show error message)
        console.error('Login failed');
        const data = await response.json();
        setLoginErrors(data.message);
      }
    } catch (error) {
      console.error('An error occurred', error);
    }
  };



  return(
    <div>
      <h1>Host login</h1>
        <div className='container'>
          <div className="row justify-content-center">
            <div className="col-md-6">
            <form onSubmit={handleSubmitLogin}>
            <div className="form-floating mb-3">
                <input type="text" className="form-control" name='username' id="floatingInput" placeholder="name@example.com" onChange={handleChangeLoginForm} required/>
                <label htmlFor="floatingInput">Username</label>
            </div>
            <div className="form-floating">
                <input type="password" className="form-control" name='password' id="floatingPassword" placeholder="Password" onChange={handleChangeLoginForm} required/>
                <label htmlFor="floatingPassword">Password</label>
            </div>
              {loginErrors && <p>Error: {loginErrors}</p>}
            <button type="submit" className="btn btn-primary">Login</button>
          </form>
            </div>
          </div>
        </div>
  </div>
  );
}

export default Login;





