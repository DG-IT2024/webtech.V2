/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import '../assets/styles/App.css'
// import Alert from './components/Alert'
// import Dashboard from './Pages/Dashboard'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import {GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import {jwtDecode} from "jwt-decode"


function App() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const googleLogin = async (credentialResponse: CredentialResponse) =>{
    const decoded: any = jwtDecode(credentialResponse.credential);
    try{
      const response = await axios.post("http://localhost:8080/aims/login/AOuth", {
        email: decoded.email
      })
      if(response.data.success){
        alert(response.data.message);
        navigate("/Dashboard");
      };
    }catch(error: any){
      alert(error.response?.data?.message || "Login failed");
    }
  }
  const handleLogin = async () =>{
    try{
      const response = await axios.post("http://localhost:8080/aims/login/credential", {
        username: username,
        password: password
      });
      if(response.data.success){
        alert(response.data.message);
        navigate("/Dashboard");
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }catch(error: any){
      // Axios throws an error for 401/500 status codes
      alert(error.response?.data?.message || "Login failed");
    }
  }

  return (
    <>
      
        <div className='signUp'>
        <form className='loginForm'>
          <h1>Login</h1>
          <h2>Login to your account</h2>
          <div className='inputGroup'>
            <label htmlFor="username">Username</label>
            <input 
              type='text' 
              id='username' 
              autoComplete='off'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              />

            <label htmlFor="password">Password</label>
            <input 
              type='password' 
              id='password' 
              autoComplete='off'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              />
            <button type="button" className="btn btn-primary" onClick={handleLogin}>Login</button>
          </div>
          <div className="mt-3">
            <GoogleLogin 
              onSuccess={googleLogin}
              onError={() => console.log("Login Failed")}
            />
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