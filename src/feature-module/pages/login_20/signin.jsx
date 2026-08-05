
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ImageWithBasePath from "../../../core/img/imagewithbasebath";
import { all_routes } from "../../../Router/all_routes";
import { baseUrl } from "../../../core/json/custom";
import { updateUserData } from "../../../Context/UserData";
import axios from 'axios';
import FeatherIcon from "feather-icons-react";
const convertToCustomDate = (dateString, daysToSubtract = 0) => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const date = new Date(dateString);
  if (!isNaN(date)) {
    date.setDate(date.getDate() - daysToSubtract);
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  }
  return "";
};

const SigninTwo = () => {
  const route = all_routes;
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isPasswordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible((prevState) => !prevState);
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const payload = { email, password };
      const response = await axios.post(
        `${baseUrl.Url}/backend/api/GET_UserLogin`,
        JSON.stringify(payload),
        {
          headers: { "Content-Type": "application/json", Accept: "*/*" },
        }
      );

      if (response.status !== 200 || response.data.length === 0) {
        throw new Error("Invalid credentials");
      }
      if (response.data[0].status === 1) {
        setError("कोणीतरी आधीच लॉग इन केलेले आहे. तुम्ही आता लॉग इन करू शकत नाही.");
      } else {
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
          APPDT: convertToCustomDate(user.registrationdate, 0),
          ROLEID: user.uroleid,
        };

        localStorage.setItem('uaid', user.uaid);
        await axios.post(
          `${baseUrl.Url}/backend/api/SP_UpadateUserLogin`,
          { uaid: user.uaid, islogin: true },
          { headers: { "Content-Type": "application/json", Accept: "*/*" } }
        );

        updateUserData({ isAuthenticated: true, userdetail: userdata });

        const userAccess = userdata.accessPolicy.find((policy) =>
          [
            "DASHBOARD", "SALEDASH", "AUCTION", "PURCHASES", "LEDGER", "HRM",
            "VYAPARI", "GATEENTRY", "BILL", "VAPDASH", "PRECOOLING", "MASTERS",
            "DAYEND"
          ].includes(policy)
        );

        switch (userAccess) {
          case "DASHBOARD": navigate("/admin-dashboard"); break;
          case "SALEDASH": navigate("/sales-dashboard"); break;
          case "AUCTION": navigate("/AuctionIndex"); break;
          case "PURCHASES": navigate("/purchaseindex"); break;
          case "LEDGER": navigate("/LedgerIndex"); break;
          case "HRM": navigate("/HrmIndex"); break;
          case "VYAPARI": navigate("/VyapariIndex"); break;
          case "GATEENTRY": navigate("/GateEntryIndex"); break;
          case "BILL": navigate("/MarketBillIndex"); break;
          case "VAPDASH": navigate("/VyapariDashboardIndex"); break;
          case "PRECOOLING": navigate("/CoolingIndex"); break;
          case "MASTERS": navigate("/MasterIndex"); break;
          case "DAYEND": navigate("/DayEndIndex"); break;
          default: navigate("/no-access");
        }
        setError("");
      }
    } catch (error) {
      setError("Unable to sign in. Please check your credentials.");
      console.error("❌ Sign-in error:", error);
    }
  };

  return (
    <div className="main-wrapper">
      <div className="account-content">
        <div className="login-wrapper">
          <div className="login-content">
            <form onSubmit={handleSignIn}>
              <div className="login-userset">
                <div className="login-logo logo-normal">
                  <ImageWithBasePath src="assets/img/logo.png" alt="img" />
                </div>
                <Link to={route.dashboard} className="login-logo logo-white">
                  <ImageWithBasePath src="assets/img/logo-white.png" alt="" />
                </Link>
                <div className="login-userheading">
                  <h3>Sign In</h3>
                  <h4>Access the Dreamspos panel using your email and passcode.</h4>
                </div>
                <div className="form-login">
                  <label>Email Address</label>
                  <div className="form-addons">
                    <input
                      type="text"
                      className="form-control"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <ImageWithBasePath src="assets/img/icons/mail.svg" alt="img" />
                  </div>
                </div>
                <div className="form-login">
                  <label>Password</label>
                  <div className="pass-group">
                    <input
                      type={isPasswordVisible ? "text" : "password"}
                      className="pass-input form-control"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <span
                      className={`fas toggle-password ${isPasswordVisible ? "fa-eye" : "fa-eye-slash"}`}
                      onClick={togglePasswordVisibility}
                    ></span>
                  </div>
                </div>
                {error && <div className="alert alert-danger">{error}</div>}
                <div className="form-login">
                  <button type="submit" className="btn btn-login">
                    Sign In
                  </button>
                </div>
              </div>
            </form>
          </div>
          <div className="login-img">
            <ImageWithBasePath src="assets/img/authentication/login02.png" alt="img" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SigninTwo;
