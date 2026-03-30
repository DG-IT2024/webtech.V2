/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import '../assets/styles/App.css'
import { useNavigate } from 'react-router-dom'
import api from '../shared/api';
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode"

function App() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{username?: string; password?: string}>({});
  const [loading, setLoading] = useState(false);

  // GOOGLE LOGIN
  const googleLogin = async (credentialResponse: CredentialResponse) => {
    const decoded: any = jwtDecode(credentialResponse.credential || "");
    try {
      // const confirmed = window.confirm("Login using Google account?");
      // if(!confirmed) return;
      const response = await api.post("/aims/login/AOuth", {
        email: decoded.email
      })
      if(response.data.success){
        alert(response.data.message);
        const {userID, role} = response.data.user;
        localStorage.setItem("userID", userID); //Local storage for userID to be used in the system transaction
        localStorage.setItem("role", role); //Local storage for role
        if(response.data.user.role === "Admin"){
          // Redirect user to dashboard after successful login
          navigate("/AdminDashboard");
        }else{
          navigate("/EmployeeDashboard")
        }
        
      };
    }catch(error: any){
      alert(error.response?.data?.message || "Login failed");
    }
  }
  
  // LOGIN VALIDATION + CONFIRMATION
  const handleLogin = async () => {
    const newErrors: {username?: string; password?: string} = {};
    // Validation
    if(!username.trim()){
      newErrors.username = "Username is required";
    }

    if(!password.trim()){
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);

    // Stop if errors exist
    if(Object.keys(newErrors).length > 0){
      return;
    }

    try{
      setLoading(true);
      const response = await api.post("/aims/login/credential", {
        username: username,
        password: password
      });

      if(response.data.success){
        alert(response.data.message);
        const {userID, role} = response.data.user;
        localStorage.setItem("userID", userID); //Local storage for userID to be used in the system transaction
        localStorage.setItem("role", role); //Local storage for role
        if(response.data.user.role === "Admin"){
          navigate("/AdminDashboard");
        }else{
          navigate("/EmployeeDashboard");
        }  
      }

    }catch(error: any){
      alert(error.response?.data?.message || "Login failed");
    }finally{
      setLoading(false);
    }

  }

  return (
    <>
      <div className='signUp'>
        <form className='loginForm'>
          <h1>Login</h1>
          <h2>Login to your account</h2>
          <div className='inputGroup'>

            {/* USERNAME */}

            <label htmlFor="username">Username</label>

            <input
              type='text'
              id='username'
              autoComplete='off'
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setErrors({...errors, username: ""});
              }}
              className={errors.username ? "input-error" : ""}
            />

            {errors.username && (
              <small className="error-text">{errors.username}</small>
            )}

            {/* PASSWORD */}
            <label htmlFor="password">Password</label>
            <input
              type='password'
              id='password'
              autoComplete='off'
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors({...errors, password: ""});
              }}
              className={errors.password ? "input-error" : ""}
            />

            {errors.password && (
              <small className="error-text">{errors.password}</small>
            )}

            {/* LOGIN BUTTON */}

            <button
              type="button"
              className="btn-primary text-center btn-login"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <div className="d-flex align-items-center my-3">
              <hr className="flex-grow-1" />
              <span className="mx-2 text-muted">OR</span>
              <hr className="flex-grow-1" />
            </div>

            <div className="w-full d-flex justify-content-center border-0">
              <GoogleLogin
                onSuccess={googleLogin}
                onError={() => console.log("Login Failed")}
              />

            </div>
          </div>
                {/* <div>
              <button type="button" className="btn mt-2 btn-light">
                <img src="../public/google.png" className='google-image' onClick={() => login()}/>
              </button>
            </div> */}
        </form>

      </div>

    </>
  )
}

export default App