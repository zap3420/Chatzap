import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import Add from "../img/addAvatar.png";
import { auth, storage, db } from "../firebase";
import { useEffect, useState, useCallback } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [err, setErr] = useState(false);
  const [fileSelected, setFileSelected] = useState(null); // State to track if file is selected
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isFormValid, setIsFormValid] = useState(false); // State to track form validity
  const navigate = useNavigate();
  const [passwordError, setPasswordError] = useState("");

  // Function to handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "username") setUsername(value);
    else if (name === "email") setEmail(value);
    else if (name === "password") setPassword(value);
  };

  // Function to handle form validation
  const validateForm = useCallback(() => {
    setIsFormValid(username && email && password && fileSelected);
  }, [username, email, password, fileSelected]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // Create user
      const res = await createUserWithEmailAndPassword(auth, email, password);
  
      // Upload avatar if file is selected
      if (fileSelected) {
        const date = new Date().getTime();
        const storageRef = ref(storage, `${res.user.uid}/${username + date}`);
  
        await uploadBytesResumable(storageRef, fileSelected);
        const downloadURL = await getDownloadURL(storageRef);
  
        // Update profile with display name and avatar URL
        await updateProfile(res.user, {
          displayName: username,
          photoURL: downloadURL,
        });
  
        // Create user document in Firestore
        await setDoc(doc(db, "users", res.user.uid), {
          uid: res.user.uid,
          displayName: username,
          email,
          photoURL: downloadURL,
        });
      }
  
      // Log success message
      console.log("Registration successful");
  
      // Navigate to home page
      navigate("/");
    } catch (error) {
      console.error("Registration Error:", error);
      if (error.code === "auth/weak-password") {
        setPasswordError("Password should be at least 6 characters.");
      } else {
        setErr(true);
      }
    }
  };
  
  // Function to handle file selection
  const handleFileSelect = (e) => {
    setFileSelected(e.target.files[0]); // Set fileSelected to the selected file object
    validateForm(); // Validate form after file selection
  };

  // Validate form on input change
  useEffect(() => {
    validateForm();
  }, [username, email, password, fileSelected, validateForm]);

  return (
    <div className='container-out'>
      <div className='wrapper-out'>
        <span className='logo'>Chatzap</span>
        <span className='title'>Create an account</span>
        <form onSubmit={handleSubmit}>
          <input type="text" name="username" placeholder='Display Name' autoComplete="off" value={username} onChange={handleInputChange} required />
          <input type="email" name="email" placeholder='Email' autoComplete="off" value={email} onChange={handleInputChange} required />
          <input type="password" name="password" placeholder='Password' autoComplete="off" value={password} onChange={handleInputChange} required />
          <input type="file" id="file" style={{ display: "none" }} onChange={handleFileSelect} required />
          <label htmlFor="file">
            <img src={Add} alt="" />
            <span>Add an avatar</span>
          </label>
          <button className="signup-btn" disabled={!isFormValid}>Sign up</button>
          {passwordError && <div className="error-message">{passwordError}</div>}
          {err && <div className="error-message">Something went wrong. Please try again later.</div>}
        </form>
        <p>Already have an account? <Link to="/login" style={{ textDecoration: "none", color: "#7269d5" }}>Log in</Link></p>
      </div>
    </div>
  );
};

export default Register;