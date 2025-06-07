import { ChevronUp, Info } from "feather-icons-react/build/IconComponents";
import {
  ArrowLeft,

} from "feather-icons-react/build/IconComponents";
import React, { useState, useEffect, useRef } from "react";
import { PlusCircle } from "react-feather";
import { Link } from "react-router-dom";
import Select from "react-select";
import { all_routes } from "../../Router/all_routes";
import { useDispatch, useSelector } from "react-redux";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { setToogleHeader } from "../../core/redux/action";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import axios from 'axios';
// import { ACSPLGUID } from "../../core/json/custom";
// import { ACSPLGUID, baseUrl, convertToISODate } from "../../core/json/custom";
import { ACSPLGUID, baseUrl } from "../../core/json/custom";
import { convertToISODate } from "../../core/json/custom";

const AddEmployee = () => {


  const route = all_routes;
  const dispatch = useDispatch();
  const data = useSelector((state) => state.toggle_header);

  const location = useLocation();
  const navigate = useNavigate();
  const { EMPID } = location.state || {};

  const GUID = ACSPLGUID.getNew()

  const renderCollapseTooltip = (props) => (
    <Tooltip id="refresh-tooltip" {...props}>
      Collapse
    </Tooltip>
  );
  console.log("DATA", EMPID);


  const nameRef = useRef();
  const emailRef = useRef();
  const contactRef = useRef();
  const codeRef = useRef();
  const dobRef = useRef();
  const genderRef = useRef();
  const bloodGroupRef = useRef();
  const joinDateRef = useRef();
  const shiftRef = useRef();
  const departmentRef = useRef();
  const designationRef = useRef();
  const pincodeRef = useRef();
  const addressRef = useRef();
  const areaRef = useRef();
  const landmarkRef = useRef();
  const cityRef = useRef();
  const stateRef = useRef();


  const [formData, setFormData] = useState({
    EMPID: '',
    EMPNAME: '',
    EMPEMAIL: '',
    EMPCONTACT: '',
    EMPCODE: '',
    EMPDOB: '',
    EMPGENDER: '',
    EMPNATIONALITY: '',
    EMPJOINDATE: '',
    EMPSHIFT: '',
    EMPDEPARTMENT: '',
    EMPDESIGNATION: '',
    EMPBLOODGROUP: '',
    EMPPINCODE: '',
    EMPLANDMARK: '',
    EMPCITY: '',
    EMPSTATE: '',
    EMPADDRESS: '',
    EMPAREA: '',
    EMPPHOTO: '',
    EMPDEPARTMENTid: '',
    EMPDESIGNATIONid: ''
  });

  const handleSelectChange = (selectedOption, fieldName) => {
    setFormData({
      ...formData,
      [fieldName]: selectedOption ? selectedOption.value : '',
    });
  };

  

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Form Data:', formData);
    showConfirmationAlert(event);
  };


  const handleFormSubmission = async () => {
    try {

      const payload1 = {
        "empid": EMPID ? EMPID : GUID,
        "empname": formData.EMPNAME,
        "empemail": formData.EMPEMAIL,
        "empcontact": formData.EMPCONTACT,
        "empcode": formData.EMPCODE,
        "empdob": formData.EMPDOB,
        "empgender": formData.EMPGENDER,
        "empnationality": "",
        "empjoindate": formData.EMPJOINDATE,
        "empshift": formData.EMPSHIFT,
        "empdepartment": formData.EMPDEPARTMENT,
        "empdesignation": formData.EMPDESIGNATION,
        "empbloodgroup": formData.EMPBLOODGROUP,
        "emppincode": formData.EMPPINCODE,
        "emplandmark": formData.EMPLANDMARK,
        "empcity": formData.EMPCITY,
        "empstate": formData.EMPSTATE,
        "empaddress": formData.EMPADDRESS,
        "emparea": formData.EMPAREA,
        "empphoto": formData.EMPPHOTO,
        "companyid": "",
        "deptid": ""
      }
      const headers = {
        "Content-Type": "application/json",
        Accept: "*/*",
      };

      axios({
        method: "POST",
        // url: "http://adsvr:78/api/SP_AddUpdHRMEmployees",
        url: baseUrl.Url + "/backend/api/SP_AddUpdHRMEmployees",
        data: JSON.stringify(payload1),
        headers: headers,
      })
      console.log("payload1", payload1);

      Swal.fire({
        icon: "success",
        title: "Saved!",
        text: "Data saved successfully.",
        confirmButtonText: "OK",
      });


      setFormData({
        EMPNAME: '',
        EMPEMAIL: '',
        EMPCONTACT: '',
        EMPCODE: '',
        EMPDOB: '',
        EMPGENDER: '',
        EMPJOINDATE: '',
        EMPSHIFT: '',
        EMPDEPARTMENT: '',
        EMPDESIGNATION: '',
        EMPBLOODGROUP: '',
        EMPPINCODE: '',
        EMPLANDMARK: '',
        EMPCITY: '',
        EMPSTATE: '',
        EMPADDRESS: '',
        EMPAREA: '',
        EMPPHOTO: ''
      });

    } catch (error) {
      console.error("Submission Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to save data. Please try again.",
      });
    }
  };

  const handleEnterKey = (e, nextRef) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (nextRef && nextRef.current) {
        nextRef.current.focus();
      }
    }
  };


  const MySwal = withReactContent(Swal);

  const showConfirmationAlert = (event) => {
    MySwal.fire({
      title: "Are you sure?",
      text: "Do you want to save this data?",
      showCancelButton: true,
      confirmButtonColor: "#00ff00",
      confirmButtonText: "SAVE",
      cancelButtonColor: "#092C4C",
      cancelButtonText: "CANCLE",
    }).then((result) => {
      if (result.isConfirmed) {
        handleFormSubmission(event);
      }
    });
  };
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
        navigate(route.employeegrid)
      }
    });
  };


  const [gender, setgender] = useState([]);
  const [bloodgroup, setbloodgroup] = useState([]);

  const fetchgenders = async () => {
    try {
      const response = await axios.get(
        baseUrl.Url + "/backend/api/Implications/GNID",

      );

      if (response.status !== 200) throw new Error("Failed to fetch implications data");

      const data = response.data;
      const implicationsDropdown = data.map(({ iTitle, iValue }) => ({
        label: iTitle,
        value: iValue,
      }));

      setgender(implicationsDropdown);
    } catch (error) {
      console.error("Error fetching implications:", error);
    }
  };


  const fetchbloodgroups = async () => {
    try {
      const response = await axios.get(
        baseUrl.Url + "/backend/api/Implications/BLOODG",

      );

      if (response.status !== 200) throw new Error("Failed to fetch implications data");

      const data = response.data;
      const implicationDropdown = data.map(({ iTitle, iValue }) => ({
        label: iTitle,
        value: iValue,
      }));

      setbloodgroup(implicationDropdown);
    } catch (error) {
      console.error("Error fetching implications:", error);
    }
  };


  useEffect(() => {
    fetchgenders();
    fetchbloodgroups();
  }, []);


  const [sellingtype, setsellingtype] = useState([]);
  const [statetype, setstatetype] = useState([]);

  useEffect(() => {
    const fetchLocationData = async () => {
      try {
        const headers = {
          "Content-Type": "application/json",
          Accept: "*/*",
        };

        const payload = { spincode: "%" };


        const response = await axios({
          method: "POST",
          url: baseUrl.Url + "/backend/api/StatePincode",
          data: JSON.stringify(payload),
          headers: headers,
        });

        if (response.status === 200) {
          const data = response.data;
          const districtdata = data
            .map(({ sdistrict, said }) => ({
              label: sdistrict,
              value: said,
            }));
          setsellingtype(districtdata)
          const Statedata = data
            .map(({
              sstatename, said }) => ({
                label: sstatename,
                value: said,
              }));
          setstatetype(Statedata);
        } else {
          console.error("Failed to fetch district and state for the pincode");
        }
      } catch (error) {
        console.error("Error fetching district and state data:", error);
      }
    }
    fetchLocationData();
  }, []);



  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === "EMPPINCODE" && value.length === 6) {
      try {
        const headers = {
          "Content-Type": "application/json",
          Accept: "*/*",
        };

        const payload = { spincode: value };


        const response = await axios({
          method: "POST",
          url: baseUrl.Url + "/backend/api/StatePincode",
          data: JSON.stringify(payload),
          headers: headers,
        });

        if (response.status === 200) {
          const data = response.data;
          const districtdata = data
            .map(({ sdistrict, said }) => ({
              label: sdistrict,
              value: said,
            }));
          setsellingtype(districtdata)
          const Statedata = data
            .map(({ sstatename, said }) => ({
              label: sstatename,
              value: said,
            }));
          setstatetype(Statedata)
          setFormData((prevData) => ({
            ...prevData,
            EMPSTATE: response.data[0].said || '',
            EMPCITY: response.data[0].said || '',
          }));
        } else {
          console.error("Failed to fetch district and state for the pincode");
        }
      } catch (error) {
        console.error("Error fetching district and state data:", error);
      }
    }
  };


  const [designations, setDesignations] = useState([]);

  useEffect(() => {
    const fetchDesignations = async () => {
      try {
        const headers = {
          "Content-Type": "application/json",
          Accept: "*/*",
        };

        const payload = {
          companyid: "",
          deptid: "",
        };

        const response = await axios.post(
          `${baseUrl.Url}/backend/api/GET_HRMDesignationName`,
          payload,
          { headers }
        );
        if (response.status !== 200)
          throw new Error("Failed to fetch vendor data");
        console.log("requisition setails", response.data)
        const data = response.data;
        const designationsData = data
          .map(({ dname, daid }) => ({
            label: dname,
            value: daid,
          }));
        setDesignations(designationsData);
      } catch (error) {
        console.error("Error fetching vendor data:", error);
      }
    };

    fetchDesignations();
  }, []);


  const [shifts, setShifts] = useState([]);

  useEffect(() => {
    const fetchShifts = async () => {
      try {
        const headers = {
          "Content-Type": "application/json",
          Accept: "*/*",
        };

        const payload = {
          companyid: "",
          deptid: "",
        };

        const response = await axios.post(
          `${baseUrl.Url}/backend/api/GET_HRMShiftInfoName`,
          payload,
          { headers }
        );
        if (response.status !== 200)
          throw new Error("Failed to fetch vendor data");
        console.log("requisition setails", response.data)
        const data = response.data;
        const shiftsData = data
          .map(({ shname, shid }) => ({
            label: shname,
            value: shid,
          }));
        setShifts(shiftsData);
      } catch (error) {
        console.error("Error fetching vendor data:", error);
      }
    };

    fetchShifts();
  }, []);



  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const headers = {
          "Content-Type": "application/json",
          Accept: "*/*",
        };

        const payload = {
          companyid: "",
        };

        const response = await axios.post(
          `${baseUrl.Url}/backend/api/GET_DepartmentName`,
          payload,
          { headers }
        );
        if (response.status !== 200)
          throw new Error("Failed to fetch vendor data");
        console.log("requisition setails", response.data)
        const data = response.data;
        const departmentsData = data
          .map(({ dname, deptaid }) => ({
            label: dname,
            value: deptaid,
          }));
        setDepartments(departmentsData);
      } catch (error) {
        console.error("Error fetching vendor data:", error);
      }
    };

    fetchDepartments();
  }, []);




  const [selectedFile, setSelectedFile] = useState(null);


  const handleFileChange = (event) => {
    const file = event.target.files[0]; // Get the first selected file
    if (file) {
      setSelectedFile(file);
      setFormData({ ...formData, EMPPHOTO: file.name }); // Update formData with the selected file
    }
  };


  useEffect(() => {
    const fetchData = async () => {
      if (EMPID) {
        try {
          const payload = {
            "empid": EMPID,
            "keyword": "%",
            "companyid": "",
            "deptid": "",
          };

          const headers = {
            "Content-Type": "application/json",
            Accept: "*/*",
          };

          // Make the API request with async/await
          const response = await axios({
            method: "POST",
            url: baseUrl.Url + "/backend/api/GET_HRMEmployees",
            data: JSON.stringify(payload),
            headers: headers,
          });

          if (response.status !== 200) {
            throw new Error("Failed to Fetch Data");
          }

          let apiData = response.data[0];

          console.log("API Data:", apiData);
          setFormData((prev) => ({
            ...prev,
            EMPID: apiData.empid,
            EMPNAME: apiData.empname,
            EMPEMAIL: apiData.empemail,
            EMPCONTACT: apiData.empcontact,
            EMPCODE: apiData.empcode,
            EMPDOB: convertToISODate(apiData.empdob),
            EMPGENDER: apiData.empgender,
            EMPNATIONALITY: "",
            EMPJOINDATE: convertToISODate(apiData.empjoindate),
            EMPSHIFT: apiData.empshift,
            EMPDEPARTMENTid: apiData.dname,
            EMPDESIGNATIONid: apiData.dsname,
            EMPDESIGNATION: apiData.empdesignation,
            EMPDEPARTMENT: apiData.empdepartment,
            EMPBLOODGROUP: apiData.empbloodgroup,
            EMPPINCODE: apiData.emppincode,
            EMPLANDMARK: apiData.emplandmark,
            EMPCITY: apiData.empcity,
            EMPSTATE: apiData.empstate,
            // EMPCITY: sellingtype.find((city) => city.value == apiData.empcity)?.label || "",
            // EMPSTATE: statetype.find((state) => state.value == apiData.empstate)?.value || "",
            EMPADDRESS: apiData.empaddress,
            EMPAREA: apiData.emparea,
            EMPPHOTO: apiData.empphoto
          }));


        } catch (error) {
          console.error("Error fetching Access Right Data:", error);
        }
      }
    };

    fetchData();
  }, [EMPID]);



  return (
    <div>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="add-item d-flex">
              <div className="page-title">
                <h4>New Employee</h4>
                <h6>Create new Employee</h6>
              </div>
            </div>
            <ul className="table-top-head">
              <li>
                <div className="page-btn">
                  <Link to={route.employeegrid} className="btn btn-secondary">
                    <ArrowLeft className="me-2" />
                    Back to Employee List
                  </Link>
                </div>
              </li>
              <li>
                <OverlayTrigger placement="top" overlay={renderCollapseTooltip}>
                  <Link
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    id="collapse-header"
                    className={data ? "active" : ""}
                    onClick={() => {
                      dispatch(setToogleHeader(!data));
                    }}
                  >
                    <ChevronUp />
                  </Link>
                </OverlayTrigger>
              </li>
            </ul>
          </div>
          {/* /product list */}
          <form onSubmit={handleSubmit}>
            <div className="card">
              <div className="card-body">
                <div className="new-employee-field">
                  <div className="card-title-head">
                    <h6>
                      <span>
                        <Info className="feather-edit" />
                      </span>
                      Employee Information
                    </h6>
                  </div>
                  {/* <div className="profile-pic-upload">
                    <div className="profile-pic">
                      <span>
                        <PlusCircle className="plus-down-add" />
                        Profile Photo
                      </span>
                      <div>
                        {renderImagePreview()}
                      </div>
                    </div>
                    <div className="input-blocks mb-0">
                      <div className="image-upload mb-0">
                        <input
                          type="file"
                          onChange={handleFileChange} // Handle file change
                          accept="image/*"             // Accepts only image files
                          multiple={false}             // Ensures only one file can be selected
                        />
                        <div className="image-uploads">
                          <h4>Change Image</h4>
                        </div>
                      </div>
                    </div>
                  </div> */}
                  <div className="profile-pic-upload">
                    <div className="profile-pic">
                      {!selectedFile && (
                        <span>
                          <PlusCircle className="plus-down-add" />
                          Profile Photo
                        </span>
                      )}
                      <div>
                        {/* Display the image preview */}
                        {selectedFile && (
                          <img
                            src={URL.createObjectURL(selectedFile)}
                            alt="Profile Preview"
                            width="100"
                            height="100"
                            style={{ borderRadius: '5%' }}
                          />
                        )}
                      </div>
                    </div>

                    <div className="input-blocks mb-0">
                      <div className="image-upload mb-0">
                        <input
                          type="file"
                          onChange={handleFileChange} // Handle file change
                          accept="image/*"             // Accepts only image files
                          multiple={false}             // Ensures only one file can be selected
                        />
                        <div className="image-uploads">
                          <h4>Change Image</h4>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-4 col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Name</label>
                        <input type="text"
                          className="form-control"
                          name="EMPNAME"
                          value={formData.EMPNAME}
                          onChange={handleChange}
                          onKeyDown={(e) => handleEnterKey(e, emailRef)}
                          ref={nameRef}
                          required
                          autoFocus
                        />
                      </div>
                    </div>

                    <div className="col-lg-4 col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input type="email"
                          className="form-control"
                          name="EMPEMAIL"
                          value={formData.EMPEMAIL}
                          onChange={handleChange}
                          onKeyDown={(e) => handleEnterKey(e, contactRef)}
                          ref={emailRef}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Contact Number</label>
                        <input type="text"
                          className="form-control"
                          name="EMPCONTACT"
                          value={formData.EMPCONTACT}
                          onChange={handleChange}
                          onKeyDown={(e) => handleEnterKey(e, codeRef)}
                          ref={contactRef}
                          required
                        />
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-lg-3 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Emp Code</label>
                          <input
                            type="text"
                            className="form-control"
                            name="EMPCODE"
                            value={formData.EMPCODE}
                            onKeyDown={(e) => handleEnterKey(e, dobRef)}
                            ref={codeRef}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      <div className="col-lg-3 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Date of Birth</label>
                          <div className="input-groupicon calender-input">
                            <input
                              type="date"
                              className="form-control"
                              name="EMPDOB"
                              value={formData.EMPDOB}
                              onKeyDown={(e) => handleEnterKey(e, genderRef)}
                              ref={dobRef}
                              onChange={(e) => {
                                setFormData((prevData) => ({
                                  ...prevData,
                                  EMPDOB: e.target.value,
                                }));
                              }}
                              placeholder="Choose Date"
                              max={new Date().toISOString().split("T")[0]}
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <div className="col-lg-3 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Gender</label>
                          <Select
                            classNamePrefix="react-select"
                            name="EMPGENDER"
                            options={gender}
                            value={gender.find((option) => option.value === formData.EMPGENDER) || null}
                            placeholder="Choose"
                            // onChange={handleSelectChange}
                            onChange={(selectedOption) => {
                              setFormData((prevData) => ({
                                ...prevData,
                                EMPGENDER: selectedOption ? selectedOption.value : "",
                              }));
                            }}
                            onKeyDown={(e) => handleEnterKey(e, bloodGroupRef)}
                            ref={genderRef}
                          // required
                          />
                        </div>
                      </div>

                      <div className="col-lg-3 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Blood Group</label>
                          <Select
                            classNamePrefix="react-select"
                            name="EMPBLOODGROUP"
                            options={bloodgroup}
                            placeholder="Choose"
                            value={bloodgroup.find((option) => option.value === formData.EMPBLOODGROUP) || null}
                            // onChange={handleSelectChange}
                            onChange={(selectedOption) => {
                              setFormData((prevData) => ({
                                ...prevData,
                                EMPBLOODGROUP: selectedOption ? selectedOption.value : "",
                              }));
                            }}
                            onKeyDown={(e) => handleEnterKey(e, joinDateRef)}
                            ref={bloodGroupRef}
                          // required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-lg-3 col-md-6">
                        <div className="input-blocks">
                          <label className="form-label">Joining Date</label>
                          <div className="input-groupicon calender-input">
                            <input
                              type="date"
                              className="form-control"
                              name="EMPJOINDATE"
                              value={formData.EMPJOINDATE}
                              onChange={(e) => {
                                setFormData((prevData) => ({
                                  ...prevData,
                                  EMPJOINDATE: e.target.value,
                                }));
                              }}
                              onKeyDown={(e) => handleEnterKey(e, shiftRef)}
                              ref={joinDateRef}
                              max={new Date().toISOString().split("T")[0]}
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <div className="col-lg-3 col-md-6">
                        <div className="mb-3">
                          <div className="add-newplus">
                            <label className="form-label">Shift</label>
                            <Link to="#">
                              <span>
                                <PlusCircle className="plus-down-add" />
                                Add new
                              </span>
                            </Link>
                          </div>

                          <Select
                            classNamePrefix="react-select"
                            name="EMPSHIFT"
                            options={shifts}
                            value={shifts.find((option) => option.value === formData.EMPSHIFT) || null}
                            onChange={(selectedOption) =>
                              handleSelectChange(selectedOption, 'EMPSHIFT')
                            }
                            onKeyDown={(e) => handleEnterKey(e, departmentRef)}
                            ref={shiftRef}
                            placeholder="Choose"
                          />
                        </div>
                      </div>

                      <div className="col-lg-3 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Department</label>

                          <Select
                            classNamePrefix="react-select"
                            name="EMPDEPARTMENT"
                            options={departments}
                            value={departments.find((option) => option.value === formData.EMPDEPARTMENT) || null}
                            onChange={(selectedOption) =>
                              handleSelectChange(selectedOption, 'EMPDEPARTMENT')
                            }
                            onKeyDown={(e) => handleEnterKey(e, designationRef)}
                            ref={departmentRef}
                            placeholder="Choose"
                          />
                        </div>
                      </div>

                      <div className="col-lg-3 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Designation</label>
                          <Select
                            classNamePrefix="react-select"
                            name="EMPDESIGNATION"
                            options={designations}
                            value={designations.find((option) => option.value === formData.EMPDESIGNATION) || null}
                            onChange={(selectedOption) =>
                              handleSelectChange(selectedOption, 'EMPDESIGNATION')
                            }
                            onKeyDown={(e) => handleEnterKey(e, pincodeRef)}
                            ref={designationRef}
                            placeholder="Choose"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Address */}
                  <div
                    className="accordion-card-one accordion mt-2"
                    id="accordionExample2"
                  >
                    <div className="accordion-item">
                      <div className="accordion-header" id="headingTwo">
                        <div
                          className="accordion-button"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapseTwo"
                          aria-controls="collapseTwo"
                        >
                          <div className="text-editor add-list">
                            <div className="card-title-head">
                              <h6>
                                <span>
                                  <Info className="feather-edit" />
                                </span>
                                Address
                              </h6>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        id="collapseTwo"
                        className="accordion-collapse collapse show"
                        aria-labelledby="headingTwo"
                        data-bs-parent="#accordionExample2"
                      >


                        <div className="addservice-info">
                          <div className="row">
                            <div className="col-lg-4 col-sm-6 col-12">
                              <div className="mb-3 add-product">
                                <label className="form-label">Pincode</label>
                                <input type="text"
                                  className="form-control"
                                  name="EMPPINCODE"
                                  value={formData.EMPPINCODE}
                                  onChange={handleChange}
                                  pattern="^\d{6}$"
                                  title="Countain only six digit number ."
                                  onKeyDown={(e) => handleEnterKey(e, addressRef)}
                                  ref={pincodeRef}
                                  required
                                />
                              </div>
                            </div>
                            <div className="col-lg-4 col-sm-6 col-12">
                              <div className="mb-3 add-product">
                                <label className="form-label">Flat, House No, Building</label>
                                <input type="text"
                                  className="form-control"
                                  name="EMPADDRESS"
                                  value={formData.EMPADDRESS}
                                  onChange={handleChange}
                                  onKeyDown={(e) => handleEnterKey(e, areaRef)}
                                  ref={addressRef}
                                  required
                                />
                              </div>
                            </div>
                            <div className="col-lg-4 col-sm-6 col-12">
                              <div className="mb-3 add-product">
                                <label className="form-label">Area, Sector, Village</label>
                                <input type="text"
                                  className="form-control"
                                  name="EMPAREA"
                                  value={formData.EMPAREA}
                                  onKeyDown={(e) => handleEnterKey(e, landmarkRef)}
                                  ref={areaRef}
                                  onChange={handleChange}
                                  required />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="add-product-new">
                          <div className="row">
                            <div className="col-lg-4 col-sm-6 col-12">
                              <div className="mb-3 add-product">
                                <label className="form-label">Landmark</label>
                                <input type="text" className="form-control"
                                  name="EMPLANDMARK"
                                  value={formData.EMPLANDMARK}
                                  onChange={handleChange}
                                  onKeyDown={(e) => handleEnterKey(e, cityRef)}
                                  ref={landmarkRef}
                                />
                              </div>
                            </div>
                            <div className="col-lg-4 col-sm-6 col-12">
                              <div className="mb-3 add-product">
                                <label className="form-label">City</label>
                                <Select
                                  classNamePrefix="react-select"
                                  name="EMPCITY"
                                  options={sellingtype}
                                  value={sellingtype.find((option) => option.value === formData.EMPCITY) || null}
                                  onChange={(selectedOption) => handleSelectChange(selectedOption, 'EMPCITY')}
                                  onKeyDown={(e) => handleEnterKey(e, stateRef)}
                                  ref={cityRef}
                                  placeholder="Choose"
                                />

                              </div>
                            </div>
                            <div className="col-lg-4 col-sm-6 col-12">
                              <div className="mb-3 add-product">
                                <label className="form-label">State</label>
                                <Select
                                  classNamePrefix="react-select"
                                  name="EMPSTATE"
                                  options={statetype}
                                  value={statetype.find((option) => option.value === formData.EMPSTATE) || null}
                                  onChange={(selectedOption) => handleSelectChange(selectedOption, 'EMPSTATE')}
                                  onKeyDown={(e) => handleEnterKey(e, stateRef)}
                                  ref={stateRef}
                                  placeholder="Choose"
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>


                </div>
              </div>
            </div>
            {/* /product list */}
            <div className="text-end mb-3">
              <button
                type="button"
                className="btn btn-cancel me-2"
                data-bs-dismiss="modal"
                onClick={showExitAlert}
              >
                Exit
              </button>
              <button type="submit" className="btn btn-submit">
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEmployee;
