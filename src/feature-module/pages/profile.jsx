import React, { useState } from "react";
import ImageWithBasePath from "../../core/img/imagewithbasebath";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { getUserData } from "../../Context/UserData";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { all_routes } from "../../Router/all_routes";
const Profile = () => {
  const route = all_routes;
  const navigate = useNavigate();
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const { userdetail } = getUserData();
  const togglePasswordVisibility = () => {
    setPasswordVisible((prevState) => !prevState);
  };
  const MySwal = withReactContent(Swal);
  const showExitAlert = () => {
    MySwal.fire({
      title: "Are you sure?",
      text: "Do you want to Exit?",
      showCancelButton: true,
      confirmButtonColor: "#00ff00",
      confirmButtonText: "YES",
      cancelButtonColor: "#092C4C",
      cancelButtonText: "NO",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate(route.ItemMaster)
      }
    });
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="page-title">
            <h4>Profile</h4>
            <h6>User Profile</h6>
          </div>
        </div>
        {/* /product list */}
        <div className="card">
          <div className="card-body mbgcolor">
            <div className="profile-set">
              <div className="profile-head"></div>
              <div className="profile-top">
                <div className="profile-content">
                  <div className="profile-contentimg">
                    <ImageWithBasePath
                      src="assets/img/customer/customer5.jpg"
                      alt="img"
                      id="blah"
                    />
                    <div className="profileupload">
                      <input type="file" id="imgInp" />
                      <Link to="#">
                        <ImageWithBasePath
                          src="assets/img/icons/edit-set.svg"
                          alt="img"
                        />
                      </Link>
                    </div>
                  </div>
                  <div className="profile-contentname">
                    <h2>{userdetail?.username || ''}</h2>
                    <h4> Your Photo and Personal Details.</h4>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-6 col-sm-12">
                <div className="input-blocks">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    value={userdetail?.username || ''}
                    className="form-control"
                    defaultValue="William"
                    readOnly
                  />
                </div>
              </div>

              <div className="col-lg-6 col-sm-12">
                <div className="input-blocks">
                  <label>Email</label>
                  <input
                    type="email"
                    value={userdetail?.email || ''}
                    className="form-control"
                    defaultValue="william@example.com"
                    readOnly
                  />
                </div>
              </div>
              <div className="col-lg-6 col-sm-12">
                <div className="input-blocks">
                  <label className="form-label">Department</label>
                  <input
                    type="text"
                    value={userdetail?.departmentname || ''}
                    className="form-control"
                    defaultValue="Castilo"
                    readOnly
                  />
                </div>
              </div>
              <div className="col-lg-6 col-sm-12">
                <div className="input-blocks">
                  <label className="form-label">Compony</label>
                  <input
                    type="text"
                    value={userdetail?.componyname || ''}
                    className="form-control"
                    defaultValue="Castilo"
                    readOnly
                  />
                </div>
              </div>
              {/* <div className="col-lg-6 col-sm-12">
                <div className="input-blocks">
                  <label className="form-label">Phone</label>
                  <input type="text"    value={userdetail?.email || ''} defaultValue="+1452 876 5432" />
                </div> */}
              {/* </div> */}
              <div className="col-lg-6 col-sm-12">
                <div className="input-blocks">
                  <label className="form-label">User Name</label>
                  <input
                    type="text"
                    value={userdetail?.username || ''}
                    className="form-control"
                    defaultValue="William Castilo"
                    readOnly
                  />
                </div>
              </div>
              <div className="col-lg-6 col-sm-12">
                <div className="input-blocks">
                  <label className="form-label">Password</label>
                  <div className="pass-group">
                    <input
                      type={isPasswordVisible ? "text" : "password"}
                      className="pass-input form-control"
                      value={userdetail?.Password || ''}
                    />
                    <span
                      className={`fas toggle-password ${isPasswordVisible ? "fa-eye" : "fa-eye-slash"
                        }`}
                      onClick={togglePasswordVisibility}
                    ></span>
                  </div>
                </div>
              </div>
              <div className="col-12">
                {/* <Link to="#" className="btn btn-submit me-2">
                  Submit
                </Link> */}
                <Link to="#" className="btn btn-cancel"
                  onClick={showExitAlert}>
                  Back
                </Link>
              </div>
            </div>
          </div>
        </div>
        {/* /product list */}
      </div>
    </div >
  );
};

export default Profile;
