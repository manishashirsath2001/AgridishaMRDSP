// import React, { useState } from "react";
// import axios from "axios";
// import ImageWithBasePath from "../../../core/img/imagewithbasebath";
// import { Link, useNavigate } from "react-router-dom";
// import { all_routes } from "../../../Router/all_routes";
// import { baseUrl } from "../../../core/json/custom";
// import { updateUserData } from "../../../Context/UserData";
// // import Password from "antd/es/input/Password";

// const Signin = () => {
//   const [isPasswordVisible, setPasswordVisible] = useState(false);
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [rememberMe, setRememberMe] = useState(false);
//   const [error, setError] = useState("");
//   const route = all_routes;
//   const navigate = useNavigate();

//   const togglePasswordVisibility = () => {
//     setPasswordVisible((prevState) => !prevState);
//   };

//   const handleSignIn = async (e) => {
//     e.preventDefault();
//     setError("");
//     navigate(route.dashboard);
//     try {
//       const payload = { email, password };
//       const headers = { "Content-Type": "application/json", Accept: "*/*" };

//       const response = await axios.post(
//         `${baseUrl.Url}/backend/api/GET_UserLogin`,
//         JSON.stringify(payload),
//         { headers }
//       );

//       if (response.status !== 200 || response.data.length === 0) {
//         throw new Error("Invalid credentials");
//       }

//       const user = response.data[0];

//       const userdata = {
//         username: user.username,
//         email: user.email,
//         accessPolicy: user.accessPolicy.split(","),
//         companyID: user.companyID,
//         departmentID: user.departmentID,
//         Password: user.password,
//         uaid: user.uaid,
//         departmentname: user.departmentname,
//         componyname: user.componyname
//       };

//       updateUserData({ isAuthenticated: true, userdetail: userdata });
//       navigate(route.dashboard);
//     } catch (error) {
//       console.error("Error during sign-in:", error);
//       setError("Unable to sign in. Please check your credentials.");
//     }
//   };

//   const styles = {
//     wrapper: {
//       display: "flex",
//       justifyContent: "center",
//       alignItems: "center",
//       minHeight: "100vh",
//       background: "linear-gradient(to right, #4facfe, #00f2fe)",
//       fontFamily: "'Poppins', sans-serif",
//     },
//     content: {
//       background: "#fff",
//       padding: "40px",
//       borderRadius: "15px",
//       boxShadow: "0 8px 30px rgba(0, 0, 0, 0.2)",
//       maxWidth: "450px",
//       width: "100%",
//       textAlign: "center",
//     },
//     logo: {
//       marginBottom: "20px",
//     },
//     heading: {
//       color: "#333",
//       marginBottom: "15px",
//     },
//     subheading: {
//       color: "#666",
//       marginBottom: "30px",
//     },
//     inputGroup: {
//       marginBottom: "20px",
//     },
//     input: {
//       width: "100%",
//       padding: "12px",
//       border: "1px solid #ddd",
//       borderRadius: "8px",
//       outline: "none",
//       fontSize: "14px",
//     },
//     passwordToggle: {
//       position: "absolute",
//       right: "10px",
//       top: "50%",
//       transform: "translateY(-50%)",
//       cursor: "pointer",
//     },
//     button: {
//       background: "linear-gradient(to right, #4facfe, #00f2fe)",
//       color: "#fff",
//       padding: "12px",
//       width: "100%",
//       border: "none",
//       borderRadius: "8px",
//       cursor: "pointer",
//       fontWeight: "bold",
//       fontSize: "16px",
//       transition: "background 0.3s",
//     },
//     buttonHover: {
//       background: "linear-gradient(to right, #00f2fe, #4facfe)",
//     },
//     link: {
//       color: "#00f2fe",
//       fontSize: "14px",
//       textDecoration: "none",
//     },
//     footerText: {
//       marginTop: "20px",
//       fontSize: "12px",
//       color: "#aaa",
//     },
//   };

//   return (
//     <div style={styles.wrapper}>
//       <div style={styles.content}>
//         <div style={styles.logo}>
//           <ImageWithBasePath
//             src="assets/img/arthalogo.png"
//             alt="Logo"
//             style={{ maxWidth: "100px" }}
//           />
//         </div>
//         <h3 style={styles.heading}>Sign In</h3>
//         <p style={styles.subheading}>Access the panel using your email and passcode.</p>
//         {error && (
//           <div
//             style={{
//               background: "#fdecea",
//               color: "#d9534f",
//               padding: "10px",
//               borderRadius: "8px",
//               marginBottom: "20px",
//             }}
//           >
//             {error}
//           </div>
//         )}
//         <form onSubmit={handleSignIn}>
//           <div style={styles.inputGroup}>
//             <input
//               type="email"
//               placeholder="Email Address"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               style={styles.input}
//               required
//             />
//           </div>
//           <div style={{ ...styles.inputGroup, position: "relative" }}>
//             <input
//               type={isPasswordVisible ? "text" : "password"}
//               placeholder="Password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               style={styles.input}
//               required
//             />
//             <i
//               className={`fas ${isPasswordVisible ? "fa-eye" : "fa-eye-slash"}`}
//               style={styles.passwordToggle}
//               onClick={togglePasswordVisibility}
//             ></i>
//           </div>
//           <div style={{ marginBottom: "20px", textAlign: "left" }}>
//             <label>
//               <input
//                 type="checkbox"
//                 checked={rememberMe}
//                 onChange={(e) => setRememberMe(e.target.checked)}
//               />{" "}
//               Remember me
//             </label>
//             <Link to={route.forgotPassword} style={{ float: "right", ...styles.link }}>
//               Forgot Password?
//             </Link>
//           </div>
//           <button
//             type="submit"
//             style={styles.button}
//             onMouseOver={(e) => (e.target.style.background = styles.buttonHover.background)}
//             onMouseOut={(e) => (e.target.style.background = styles.button.background)}
//           >
//             Sign In
//           </button>
//         </form>
//         <p style={styles.footerText}>Copyright © 2023 DreamsPOS. All rights reserved</p>
//       </div>
//     </div>
//   );
// };

// export default Signin;
import React, { useState } from "react";
import axios from "axios";
import ImageWithBasePath from "../../../core/img/imagewithbasebath";
import { Link, useNavigate } from "react-router-dom";
import { all_routes } from "../../../Router/all_routes";
import { baseUrl } from "../../../core/json/custom";
import { updateUserData } from "../../../Context/UserData";

const Signin = () => {
  // const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // const togglePasswordVisibility = () => {
  //   setPasswordVisible((prevState) => !prevState);
  // };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError("");
    navigate(all_routes.dashboard);
    try {
      const payload = { email, password };
      const response = await axios.post(
        `${baseUrl.Url}/backend/api/GET_UserLogin`,
        JSON.stringify(payload),
        { headers: { "Content-Type": "application/json", Accept: "*/*" } }
      );
      if (response.status !== 200 || response.data.length === 0) {
        throw new Error("Invalid credentials");
      }
      const user = response.data[0];
      const userdata = {
        username: user.username,
        email: user.email,
        accessPolicy: user.accessPolicy.split(","),
        companyID: user.companyID,
        departmentID: user.departmentID,
        Password: user.password,
        uaid: user.uaid,
        departmentname: user.departmentname,
        companyname: user.companyname,
        companystate: user.companystate
      };
      updateUserData({ isAuthenticated: true, userdetail: userdata });
      navigate(all_routes.dashboard);
    } catch (error) {
      setError("Unable to sign in. Please check your credentials.");
    }
  };

  const styles = {
    container: {
      display: "flex",
      height: "100vh",
    },
    leftPanel: {
      width: "50%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#fff",
      padding: "40px",
      textAlign: "center",
    },
    rightPanel: {
      width: "50%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "linear-gradient(to right, #4facfe, #00f2fe)",
    },
    formContainer: {
      width: "100%",
      maxWidth: "400px",
      textAlign: "center",
    },
    input: {
      width: "100%",
      padding: "12px",
      borderRadius: "8px",
      marginBottom: "15px",
      border: "1px solid #ddd",
      fontSize: "14px",
    },
    button: {
      width: "100%",
      padding: "12px",
      borderRadius: "8px",
      background: "linear-gradient(to right, #4facfe, #00f2fe)",
      color: "#fff",
      border: "none",
      fontSize: "16px",
      cursor: "pointer",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.leftPanel}>
        <div style={styles.formContainer}>
          <h3>Sign In</h3>
          <p>Access the panel using your email and passcode.</p>
          {error && <div style={{ color: "red", marginBottom: "15px" }}>{error}</div>}
          <form onSubmit={handleSignIn}>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              required
            />
            {/* <i
              className={`fas ${isPasswordVisible ? "fa-eye" : "fa-eye-slash"}`}
              style={styles.passwordToggle}
              onClick={togglePasswordVisibility}
            ></i> */}
            <button type="submit" style={styles.button}>Sign In</button>
          </form>
          <p>
            <Link to={all_routes.forgotPassword}>Forgot Password?</Link>
          </p>
        </div>
      </div>
      <div style={styles.rightPanel}>
        <ImageWithBasePath src="assets/img/arthadishalogo.png" alt="Logo" style={{ maxWidth: "800px" }} />
      </div>
    </div>
  );
};

export default Signin;
