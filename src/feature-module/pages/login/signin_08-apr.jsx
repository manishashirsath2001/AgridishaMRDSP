
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ImageWithBasePath from "../../../core/img/imagewithbasebath";
import "./Signin.css"; // Import CSS file
import { all_routes } from "../../../Router/all_routes";
import { baseUrl } from "../../../core/json/custom";
import { updateUserData } from "../../../Context/UserData";
import axios from 'axios';
const Signin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const route = all_routes;
    const [isPasswordVisible, setPasswordVisible] = useState(false);
    const togglePasswordVisibility = () => {
        setPasswordVisible((prevState) => !prevState);
    };
    const navigate = useNavigate();
    const handleSignIn = async (e) => {
        e.preventDefault();
        setError("");
        // navigate(route.dashboard);
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
            if (response.data.length > 0) {
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
                    companystate: user.companystate,
                    registrtiondate: user.registrtiondate
                };
                updateUserData({ isAuthenticated: true, userdetail: userdata });
                navigate(route.dashboard);
            } else {
                setError("Unable to sign in. Please check your credentials.");
            }
        } catch (error) {
            setError("Unable to sign in. Please check your credentials.");
        }
    };

    return (
        <div className="signin-container">
            <div className="signin-box">
                <div className="signin-left">
                    <div className="content-box">
                        <h2 style={{ color: "green" }} className="mb-3">Perfect Market</h2>
                        <h2 style={{ color: "green" }} className="mb-3">Committee</h2>
                        <div className="image-box">
                            <img src="assets/img/avatar/SideImage.png" alt="" />
                        </div>
                    </div>
                </div>

                <div className="signin-right">
                    <div className="login-box">
                        <div className="logo">
                            <img src="assets/img/avatar/Logo1.png" alt="Logo" />
                        </div>
                        <h3>Welcome Back</h3>
                        <p>Please login to your account</p>
                        {error && <div style={{ color: "red", marginBottom: "15px" }}>{error}</div>}
                        <form onSubmit={handleSignIn}>
                            <div className="form-group1 position-relative">
                                <input type="email"
                                    className="form-control1 pe-5"
                                    placeholder="Username"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required />
                                <span className="position-absolute top-50 end-0 translate-middle-y me-3">
                                    <i className="bi bi-person"></i>
                                </span>
                            </div>

                            <div className="form-group1 password-group position-relative">
                                <input
                                    // type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    type={isPasswordVisible ? "text" : "password"}
                                    className="form-control1"
                                    required
                                />
                                <span
                                    className="position-absolute top-50 end-0 translate-middle-y me-3"
                                    onClick={togglePasswordVisibility}
                                    style={{ cursor: "pointer" }}
                                >
                                    <i className={`bi ${isPasswordVisible ? "bi-eye" : "bi-eye-slash"}`}></i>
                                </span>
                            </div>

                            <div className="forgot-password text-end">
                                <Link to="/forgot-password">Forgot password?</Link>
                            </div>

                            {/* <button className="btn btn-login">Login</button> */}
                            {/* <Link to={route.dashboard} className="btn btn-login">
                            Login
                        </Link> */}
                            <button type="submit" className="btn btn-login">Sign In</button>
                        </form>

                        <div className="or-divider">Or Login with</div>

                        <div className="form-sociallink">
                            <ul className="social-icons d-flex">
                                <li>
                                    <Link to="#" className="social-icon facebook-logo">
                                        <ImageWithBasePath src="assets/img/icons/facebook.png" alt="Facebook" />
                                    </Link>
                                </li>
                                <li>
                                    <Link to="#" className="social-icon google-logo">
                                        <ImageWithBasePath src="assets/img/icons/google.png" alt="Google" />
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div className="signup-text mt-2">
                            <span>Dont have an account? </span>
                            <Link to="/signup" className="bold-link">Sign up</Link>

                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signin;
