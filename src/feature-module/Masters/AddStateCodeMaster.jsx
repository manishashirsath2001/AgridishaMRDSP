import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Select from "react-select";
import { ChevronDown, ChevronUp, Info, ArrowLeft } from "feather-icons-react/build/IconComponents";
import { useDispatch, useSelector } from "react-redux";
import { setToogleHeader } from "../../core/redux/action";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { all_routes } from "../../Router/all_routes";
import { ACSPLGUID, baseUrl } from "../../core/json/custom";
import { useNavigate } from "react-router-dom";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import axios from 'axios';
import { getUserData } from "../../Context/UserData";
import { useRef } from "react";
const AddStateCodeMaster = () => {
    const { isAuthenticated, userdetail } = getUserData();
    const route = all_routes;
    const navigate = useNavigate();
    const GUID = ACSPLGUID.getNew();
    const dispatch = useDispatch();
    const data = useSelector((state) => state.toggle_header);
    const location = useLocation();
    const { SCAID } = location.state || {};
    const stateRef = useRef(null);
    const renderCollapseTooltip = (props) => (
        <Tooltip id="refresh-tooltip" {...props}>
            Collapse
        </Tooltip>
    );

    if (isAuthenticated == true) {
        console.log("user", userdetail);
        console.log("getUserData", getUserData);
    }
    useEffect(() => {
        stateRef?.current.focus();
        const handleShortcut = (e) => {
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                handleSubmit(e)
            }
            if (e.ctrlKey && e.key === 'e') {
                e.preventDefault();
                showExitAlert();

            }
        };

        window.addEventListener('keydown', handleShortcut);

        return () => {
            window.removeEventListener('keydown', handleShortcut);
        };
    }, [navigate]);


    const [formData, setFormData] = useState({

        SCAID: "",
        SCNAME: "",
        SCCODE: "",
        SCUTSTATE: false,
    });
    //   const [alertMessage, setAlertMessage] = useState(false);

    useEffect(() => {
        if (SCAID) {
            const fetchData = async () => {
                try {
                    const payload = {
                        "pkid": SCAID
                        , "keyword": "%"
                    }
                    const headers = {
                        "Content-Type": "application/json",
                        Accept: "*/*",
                    };

                    axios({
                        method: "POST",
                        url: baseUrl.Url + "/backend/api/_GET_StateCodeMasters_/getByID",
                        data: JSON.stringify(payload),
                        headers: headers,
                    })
                        .then((response) => {
                            if (response.status != 200) throw new Error("Failed to fetching State Data");
                            const DATA = response.data[0];
                            setFormData({
                                SCAID: DATA.scaid,
                                SCNAME: DATA.scname,
                                SCCODE: DATA.sccode,
                                SCUTSTATE: DATA.scutstate,
                            });
                        })

                } catch (error) {
                    console.error("Error fetching State Data:", error);
                }

            };
            fetchData();
        }
    }, [SCAID]);

    const statesList = [

        { value: "Andhra Pradesh", label: "Andhra Pradesh" },
        { value: "Arunachal Pradesh", label: "Arunachal Pradesh" },
        { value: "Assam", label: "Assam" },
        { value: "Bihar", label: "Bihar" },
        { value: "Chhattisgarh", label: "Chhattisgarh" },
        { value: "Goa", label: "Goa" },
        { value: "Gujarat", label: "Gujarat" },
        { value: "Haryana", label: "Haryana" },
        { value: "Himachal Pradesh", label: "Himachal Pradesh" },
        { value: "Jharkhand", label: "Jharkhand" },
        { value: "Karnataka", label: "Karnataka" },
        { value: "Kerala", label: "Kerala" },
        { value: "Madhya Pradesh", label: "Madhya Pradesh" },
        { value: "Maharashtra", label: "Maharashtra" },
        { value: "Manipur", label: "Manipur" },
        { value: "Meghalaya", label: "Meghalaya" },
        { value: "Mizoram", label: "Mizoram" },
        { value: "Nagaland", label: "Nagaland" },
        { value: "Odisha", label: "Odisha" },
        { value: "Punjab", label: "Punjab" },
        { value: "Rajasthan", label: "Rajasthan" },
        { value: "Sikkim", label: "Sikkim" },
        { value: "Tamil Nadu", label: "Tamil Nadu" },
        { value: "Telangana", label: "Telangana" },
        { value: "Tripura", label: "Tripura" },
        { value: "Uttar Pradesh", label: "Uttar Pradesh" },
        { value: "Uttarakhand", label: "Uttarakhand" },
        { value: "West Bengal", label: "West Bengal" },
        { value: "Andaman and Nicobar Islands", label: "Andaman and Nicobar Islands" },
        { value: "Chandigarh", label: "Chandigarh" },
        { value: "Dadra and Nagar Haveli and Daman and Diu", label: "Dadra and Nagar Haveli and Daman and Diu" },
        { value: "Delhi", label: "Delhi" },
        { value: "Jammu and Kashmir", label: "Jammu and Kashmir" },
        { value: "Ladakh", label: "Ladakh" },
        { value: "Lakshadweep", label: "Lakshadweep" },
        { value: "Puducherry", label: "Puducherry" },
    ];
    const handleSubmit = (event) => {
        event.preventDefault();
        showConfirmationAlert(event);
    };

    const handleFormSubmission = async () => {
        try {
            const payload = {
                "scaid": SCAID ? SCAID : GUID,
                "sccode": formData.SCCODE,
                "scname": formData.SCNAME,
                "scutstate": formData.SCUTSTATE
            }
            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            axios({
                method: "POST",
                url: baseUrl.Url + "/backend/api/Statecode",
                data: JSON.stringify(payload),
                headers: headers,
            })
            Swal.fire({
                icon: "success",
                title: "सेव्ह झाले!",
                text: "माहिती यशस्वीरित्या सेव्ह झाली.",
                confirmButtonText: "ठीक आहे",
                allowOutsideClick: false,
                allowEscapeKey: false
            });
            navigate(route.SateCodeMaster);
        } catch (error) {
            console.error("Submission Error:", error);
            Swal.fire({
                icon: "error",
                title: "चूक",
                text: "माहिती सेव्ह करण्यात अयशस्वी. कृपया पुन्हा प्रयत्न करा.",
                allowOutsideClick: false,
                allowEscapeKey: false
            });
        }
    };
    const MySwal = withReactContent(Swal);

    const showConfirmationAlert = (event) => {
        MySwal.fire({
            title: "तुम्हाला खात्री आहे का?",
            text: "तुम्हाला ही माहिती जतन करायची आहे का?",
            showCancelButton: true,
            confirmButtonColor: "#00ff00",
            confirmButtonText: "जतन करा",
            cancelButtonColor: "#092C4C",
            cancelButtonText: "रद्द करा",
            allowOutsideClick: false,
            allowEscapeKey: false
        }).then((result) => {
            if (result.isConfirmed) {
                handleFormSubmission(event); // Proceed with form submission
            }
        });
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSelectChange = (selectedOption) => {
        setFormData({
            ...formData,
            SCNAME: selectedOption ? selectedOption.value : "",
        });
    };

    const showExitAlert = () => {
        MySwal.fire({
            title: "तुम्हाला खात्री आहे का?",
            text: "तुम्हाला बाहेर पडायचं आहे का?",
            showCancelButton: true,
            confirmButtonColor: "#00ff00",
            confirmButtonText: "होय",
            cancelButtonColor: "#092C4C",
            cancelButtonText: "नाही",
            allowOutsideClick: false,
            allowEscapeKey: false
        }).then((result) => {
            if (result.isConfirmed) {
                navigate(route.SateCodeMaster)
            }
        });
    };

    return (
        <div className="page-wrapper">
            <div className="content">
                <div className="page-header">
                    <div className="add-item d-flex">
                        <div className="page-title">
                            <h4>राज्य कोड</h4>
                            <h6>नवीन राज्य कोड तयार करा</h6>
                        </div>
                    </div>
                    <ul className="table-top-head">
                        <li>
                            <OverlayTrigger placement="top" overlay={renderCollapseTooltip}>
                                <Link
                                    data-bs-toggle="tooltip"
                                    data-bs-placement="top"
                                    title="आकुंचन करा"
                                    id="collapse-header"
                                    className={data ? "active" : ""}
                                    onClick={() => {
                                        dispatch(setToogleHeader(!data));
                                    }}
                                >
                                    <ChevronUp className="feather-chevron-up" />
                                </Link>
                            </OverlayTrigger>
                        </li>
                    </ul>
                    <div className="page-btn">
                        <Link to={route.SateCodeMaster} className="btn btn-secondary">
                            <ArrowLeft className="me-2" />
                            राज्य कोडवर परत जा
                        </Link>
                    </div>
                </div>
                {/* {alertMessage && (
                    <div className="alert alert-success" role="alert">
                        Success
                    </div>
                )}  */}
                <form onSubmit={handleSubmit}>
                    <div className="card mbgcolor">
                        <div className="card-body add-product">
                            <div className="accordion-card-one accordion" id="accordionExample">
                                <div className="accordion-item mbgcolor" >
                                    <div className="accordion-header" id="headingOne">
                                        <div
                                            className=""
                                            data-bs-toggle="collapse"
                                            data-bs-target="#collapseOne"
                                            aria-controls="collapseOne"
                                        >
                                            <div className="addproduct-icon">
                                                <h5>
                                                    <Info className="add-info" />
                                                    <span>राज्य कोड मास्टर</span>
                                                </h5>
                                                <Link to="#">
                                                    <ChevronDown className="chevron-down-add" />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        id="collapseOne"
                                        className="accordion-collapse collapse show"
                                        aria-labelledby="headingOne"
                                        data-bs-parent="#accordionExample"
                                    >
                                        <div className="accordion-body">
                                            <div className="row">
                                                {/* Types */}
                                                <div className="col-lg-6 col-sm-6 col-12">
                                                    <div className="mb-3 add-product ">
                                                        <label className="form-label required"> राज्य</label>
                                                        <Select
                                                            ref={stateRef}
                                                            classNamePrefix="react-select"
                                                            options={statesList}
                                                            placeholder="राज्य निवडा"
                                                            value={statesList.find((option) => option.value === formData.SCNAME) || null}
                                                            onChange={handleSelectChange}
                                                            required
                                                            openMenuOnFocus={true}
                                                        />
                                                    </div>
                                                </div>

                                                {/* HSN Code */}
                                                <div className="col-lg-6 col-sm-6 col-12">
                                                    <div className="mb-3 add-product">
                                                        <label className="form-label required"> राज्य कोड </label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            placeholder="राज्य कोड प्रविष्ट करा"
                                                            name="SCCODE"
                                                            value={formData.SCCODE}
                                                            onChange={handleInputChange}
                                                            pattern="^\d+$"
                                                            title="फक्त अंक असावेत"
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-lg-6 col-sm-6 col-12"></div>
                                                <div className="col-lg-6 col-sm-6 col-12">
                                                    <div className="form-check form-check-md  mb-3 ">
                                                        <input
                                                            className="form-check-input "
                                                            type="checkbox"
                                                            name="SCUTSTATE"
                                                            defaultValue=""
                                                            id="SCUTSTATE"
                                                            checked={formData.SCUTSTATE}
                                                            onChange={handleInputChange}
                                                        />
                                                        <label className="form-label" htmlFor="checkebox-md">
                                                            केंद्रशासित प्रदेश आहे का?
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-12">
                                <div className="btn-addproduct mb-4">
                                    {/* <button type="button" className="btn btn-cancel me-2">
                                        Cancel
                                    </button> */}
                                    <button type="button"
                                        onClick={showExitAlert}
                                        className="btn btn-cancel me-2">
                                        मागे
                                    </button>
                                    <button type="submit" className="btn btn-submit" >
                                        सेव्ह
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddStateCodeMaster;
