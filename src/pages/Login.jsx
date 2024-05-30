import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase"

const Login = () => {
  
  const [err,setErr] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e) =>{

    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");

      } catch (err) {
        console.error("Login error:", err);
      setErr(true);
    }
  };
  return (
    <div className='container-out'>
      <div className='wrapper-out'>
        <span className='logo'>Chatzap</span>
        <span className='title'>Log in</span>
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder='Email' />
          <input type="password" placeholder='Password' />
          <div className='remember-me-container'>
            <input type="checkbox" id="remember-me" name="remember-me" />
            <label htmlFor="remember-me" className="remember-me-label">Remember Me</label>
          </div>
          <button>Log in</button>
          {err && <span style={{textAlign:"center"}}>Something went wrong.</span>}
        </form>
        <p>Not member yet? <Link to="/register" style={{textDecoration: "none", color:"#7269d5"}}>Create an account</Link></p>
      </div>
    </div>
  )
}
export default Login