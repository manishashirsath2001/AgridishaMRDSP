import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from "react-router-dom";
import Select from "react-select";
import { all_routes } from "../../Router/all_routes";
import axios from "axios";
import { ACSPLGUID, baseUrl, convertToISODate } from "../../core/json/custom";

import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from "sweetalert2-react-content";
import {
    ArrowLeft,
    ChevronDown,
    ChevronUp,
    Info,
} from "feather-icons-react/build/IconComponents";
import { useDispatch, useSelector } from "react-redux";
import { setToogleHeader } from "../../core/redux/action";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { getUserData } from "../../Context/UserData";

const AddCounter = () => {

    const location = useLocation();
    const { CAID } = location.state || {};
    console.log('CAID', CAID);
    const { isAuthenticated, userdetail } = getUserData();
    if (isAuthenticated == true) {
        console.log("user", userdetail);
        console.log("getUserData", getUserData);
    }

    const ccodeRef = useRef();
    const cnameRef = useRef();
    const cdateRef = useRef();
    const cinchargeRef = useRef();
    const cintercomRef = useRef();
    const warehouseRef = useRef();
    const departmentRef = useRef();
    const submitRef = useRef();

    const navigate = useNavigate();
    const GUID = ACSPLGUID.getNew()
    const route = all_routes;
    const dispatch = useDispatch();
    const data = useSelector((state) => state.toggle_header);
    const renderCollapseTooltip = (props) => (
        <Tooltip id="refresh-tooltip" {...props}>
            Collapse
        </Tooltip>
    );


    const [formData, setFormData] = useState({
        cname: '',
        cdate: '',
        cincharge: '',
        cintercom: '',
        ccode: '',
        daid: '',
        waid: '',

    });

    useEffect(() => {
        if (CAID) {
            const fetchData = async () => {
                try {
                    const payload = {
                        "pkid": CAID,
                        "companyid": userdetail?.companyID ? userdetail.companyID : "",
                        "deptid": userdetail?.departmentID ? userdetail.departmentID : "",
                    }
                    const headers = {
                        "Content-Type": "application/json",
                        Accept: "*/*",
                    };

                    axios({
                        method: "POST",
                        url: baseUrl.Url + "/backend/api/_GET_CounterMaster_",
                        data: JSON.stringify(payload),
                        headers: headers,
                    })
                        .then((response) => {
                            if (response.status != 200) throw new Error("Failed to Fetching Data");
                            const DATA = response.data[0];
                            setFormData({
                                cname: DATA.cname || '',
                                ccode: DATA.ccode || '',
                                cincharge: DATA.cincharge || '',
                                cintercom: DATA.cintercom || '',
                                daid: DATA.daid || '',
                                waid: DATA.waid || '',
                                cdate: convertToISODate(DATA.cdate) || '',

                            });
                        })

                } catch (error) {
                    console.error("Error fetching Access Right Data:", error);
                }

            };
            fetchData();
        }
    }, [CAID]);

    useEffect(() => {
        const handleShortcut = (e) => {
            if (e.ctrlKey && e.key === 'e') {
                e.preventDefault();
                showExitAlert();
            }
            if (e.ctrlKey && e.key === 's' || e.ctrlKey && e.key === 'S') {
                e.preventDefault();
                validateinput(e);

            }
        };

        window.addEventListener('keydown', handleShortcut);

        return () => {
            window.removeEventListener('keydown', handleShortcut);
        };
    }, [formData, navigate]);


    useEffect(() => {

        if (ccodeRef.current) {
            ccodeRef.current.focus();
        }

    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        showConfirmationAlert(event);
    };

    const handleFormSubmission = async () => {

        try {

            const payload = {
                "caid": CAID ? CAID : GUID,
                "cname": formData.cname,
                "cdate": formData.cdate,
                "cincharge": formData.cincharge,
                "cintercom": formData.cintercom,
                "ccode": formData.ccode,
                "daid": formData.daid,
                "waid": formData.waid,
                "companyid": userdetail?.companyID ? userdetail.companyID : "",
                "deptid": userdetail?.departmentID ? userdetail.departmentID : "",

            };

            console.log('payload', payload)
            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            axios({
                method: "POST",
                url: baseUrl.Url + "/backend/api/CounterMaster",
                data: JSON.stringify(payload),
                headers: headers,
            })
            // console.log("API Response:", response.data);

            Swal.fire({
                icon: "success",
                title: "जतन झाले!",
                text: "माहिती यशस्वीरित्या जतन झाली आहे.",
                confirmButtonText: "ठीक आहे",
                allowOutsideClick: false,
                allowEscapeKey: false,

            });


            navigate(route.Counter);
        } catch (error) {
            console.error("Submission Error:", error);
            Swal.fire({
                icon: "error",
                title: "त्रुटी",
                text: "माहिती जतन करण्यात अयशस्वी. कृपया पुन्हा प्रयत्न करा.",
                allowOutsideClick: false,
                allowEscapeKey: false,

            });
        }

    };

    const MySwal = withReactContent(Swal);

    const showConfirmationAlert = (event) => {
        MySwal.fire({
            title: "आपल्याला खात्री आहे का?",
            text: "आपण ही माहिती जतन करू इच्छिता का?",
            showCancelButton: true,
            confirmButtonColor: "#00ff00",
            confirmButtonText: "जतन करा",
            cancelButtonColor: "#092C4C",
            cancelButtonText: "रद्द करा",
            allowOutsideClick: false,
            allowEscapeKey: false,

        }).then((result) => {
            if (result.isConfirmed) {
                handleFormSubmission(event); // Proceed with form submission
            }
        });
    };
    const showExitAlert = () => {
        MySwal.fire({
            title: "आपल्याला खात्री आहे का?",
            text: "आपण बाहेर पडू इच्छिता का?",
            showCancelButton: true,
            confirmButtonColor: "#00ff00",
            confirmButtonText: "होय",
            cancelButtonColor: "#092C4C",
            cancelButtonText: "नाही",
            allowOutsideClick: false,
            allowEscapeKey: false,

        }).then((result) => {
            if (result.isConfirmed) {
                navigate(route.Counter)
            }
        });
    };



    const validateinput = (e) => {

        const { ccode, cname, cintercom, cdate, cincharge, cregno, companyid } = formData;

        if (
            (!cname || cname.trim() === '') ||
            (!ccode || companyid.trim() === '') ||
            (!cintercom || !/^[789]\d{9}$/.test(cintercom)) ||
            (!cdate || cregno.trim() === '') ||
            (!cincharge || cincharge.trim() === '')) {
            Swal.fire({
                icon: "error",
                title: "वैधता त्रुटी",
                text: "कृपया सर्व आवश्यक फील्ड भरा.",
                allowOutsideClick: false,
                allowEscapeKey: false,

            }).then(() => {
                cnameRef.current.focus();
                cdateRef.current.focus();
                ccodeRef.current.focus();
                cinchargeRef.current.focus();
                cintercomRef.current.focus();
            })
            return;
        }
        handleSubmit(e);
    }
    const handleChange = async (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };


    const [department, setdepartment] = useState([]);
    const [warehouse, setwarehouse] = useState([]);
    const [employee, setemployee] = useState([]);

    useEffect(() => {
        const fetchDepartment = async () => {
            try {
                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };

                const payload = {
                    "companyid": userdetail?.companyID ? userdetail.companyID : ""
                }

                const response = await axios.post(
                    `${baseUrl.Url}/backend/api/GET_DepartmentName`,
                    payload,
                    { headers }
                );
                if (response.status !== 200)
                    throw new Error("Failed to fetch vendor data");
                console.log("requisition setails", response.data)
                const data = response.data;
                const departmentData = data
                    .map(({ dname, deptaid }) => ({
                        label: dname,
                        value: deptaid,
                    }));
                setdepartment(departmentData);
            } catch (error) {
                console.error("Error fetching vendor data:", error);
            }
        };
        const fetchWarehouse = async () => {
            try {
                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };

                const payload = {
                    "companyid": userdetail?.companyID ? userdetail.companyID : "",
                    "deptid": userdetail?.departmentID ? userdetail.departmentID : "",
                };

                const response = await axios.post(
                    `${baseUrl.Url}/backend/api/WAREHOUSENAME`,
                    payload,
                    { headers }
                );
                if (response.status !== 200)
                    throw new Error("Failed to fetch vendor data");
                console.log("requisition setails", response.data)
                const data = response.data;
                const warehouseData = data
                    .map(({ wname, waid }) => ({
                        label: wname,
                        value: waid,
                    }));
                setwarehouse(warehouseData);
            } catch (error) {
                console.error("Error fetching vendor data:", error);
            }
        };
        const fetchEmployee = async () => {
            try {
                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };

                const payload = {
                    "companyid": userdetail?.companyID ? userdetail.companyID : "",
                    "deptid": userdetail?.departmentID ? userdetail.departmentID : "",
                };

                const response = await axios.post(
                    `${baseUrl.Url}/backend/api/GET_EMPLOYEE`,
                    payload,
                    { headers }
                );
                if (response.status !== 200)
                    throw new Error("Failed to fetch vendor data");
                console.log("requisition setails", response.data)
                const data = response.data;
                const employeeData = data
                    .map(({ empname, empid }) => ({
                        label: empname,
                        value: empid,
                    }));
                setemployee(employeeData);
            } catch (error) {
                console.error("Error fetching vendor data:", error);
            }
        };

        fetchDepartment();
        fetchWarehouse();
        fetchEmployee();
    }, []);



    const handleEnterKey = (e, nextRef) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (nextRef && nextRef.current) {
                nextRef.current.focus();
            }
        }
    };

    return (
        <div className="page-wrapper">
            <div className="content">
                <div className="page-header">
                    <div className="add-item d-flex">
                        <div className="page-title">
                            <h4>Manage Company</h4>
                        </div>
                    </div>
                    <ul className="table-top-head">
                        <li>
                            <OverlayTrigger placement="top" overlay={renderCollapseTooltip}>
                                <Link
                                    data-bs-toggle="tooltip"
                                    data-bs-placement="top"
                                    title="Collapse"
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
                        <Link to={route.Counter} className="btn btn-secondary">
                            <ArrowLeft className="me-2" />
                            Back to Vendor
                        </Link>
                    </div>
                </div>
                {/* /add */}
                <form onSubmit={handleSubmit}>
                    <div className="card mbgcolor">
                        <div className="card-body add-product pb-0">
                            <div className="accordion-card-one accordion" id="accordionExample">
                                <div className="accordion-item mbgcolor">
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
                                                    <span>कंपनीचे तपशील</span>
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
                                                <div className="col-lg-3 col-sm-6 col-12">
                                                    <div className="mb-3 add-product">
                                                        <label className="form-label required">काउंटर आयडी</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            title="नोंदणी आयडी आवश्यक आहे"
                                                            value={formData.ccode}
                                                            name="ccode"
                                                            ref={ccodeRef}
                                                            onChange={handleChange}
                                                            onKeyDown={(e) => handleEnterKey(e, cdateRef)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-3 col-sm-6 col-12">
                                                    <div className="mb-3 add-product">
                                                        <label className="form-label required">नोंदणी दिनांक</label>
                                                        <input
                                                            type="date"
                                                            className="form-control"
                                                            title="दिनांक आवश्यक आहे"
                                                            value={formData.cdate}
                                                            name="cdate"
                                                            ref={cdateRef}
                                                            onChange={handleChange}
                                                            onKeyDown={(e) => handleEnterKey(e, cnameRef)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-lg-6 col-sm-6 col-12">
                                                    <div className="form-label add-product">
                                                        <label className="form-label required">काउंटरचे नाव</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            name="cname"
                                                            value={formData.cname}
                                                            title="नावामध्ये फक्त अक्षरे व स्पेस असाव्यात"
                                                            onChange={handleChange}
                                                            required
                                                            ref={cnameRef}
                                                            onKeyDown={(e) => handleEnterKey(e, cintercomRef)}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-lg-3 col-sm-6 col-12">
                                                    <div className="mb-3 add-product">
                                                        <label className="form-label">इंटरकॉम क्रमांक</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            title="दहा अंकी टेलिफोन नंबर आवश्यक आहे"
                                                            value={formData.cintercom}
                                                            name="cintercom"
                                                            onChange={handleChange}
                                                            ref={cintercomRef}
                                                            onKeyDown={(e) => handleEnterKey(e, cinchargeRef)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-lg-4 col-md-6">
                                                    <div className="mb-4">
                                                        <label className="form-label required">इनचार्ज</label>
                                                        <Select
                                                            classNamePrefix="react-select"
                                                            options={employee}
                                                            value={employee.find((option) => option.value === formData.cincharge) || null}
                                                            placeholder="निवडा"
                                                            onChange={(selectedOption) => {
                                                                setFormData((prevData) => ({
                                                                    ...prevData,
                                                                    cincharge: selectedOption ? selectedOption.value : "",
                                                                }));
                                                                if (departmentRef.current) {
                                                                    departmentRef.current.focus();
                                                                }
                                                            }}
                                                            required
                                                            ref={cinchargeRef}
                                                            openMenuOnFocus={true}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-4 col-md-6">
                                                    <div className="mb-3">
                                                        <label className="form-label required">विभाग</label>
                                                        <Select
                                                            classNamePrefix="react-select"
                                                            options={department}
                                                            value={department.find((option) => option.value === formData.daid) || null}
                                                            placeholder="निवडा"
                                                            onChange={(selectedOption) => {
                                                                setFormData((prevData) => ({
                                                                    ...prevData,
                                                                    daid: selectedOption ? selectedOption.value : "",
                                                                }));
                                                                if (warehouseRef.current) {
                                                                    warehouseRef.current.focus();
                                                                }
                                                            }}
                                                            ref={departmentRef}
                                                            required
                                                            openMenuOnFocus={true}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-4 col-md-6">
                                                    <div className="mb-3">
                                                        <label className="form-label required">वेअरहाऊस</label>
                                                        <Select
                                                            classNamePrefix="react-select"
                                                            options={warehouse}
                                                            value={warehouse.find((option) => option.value === formData.waid) || null}
                                                            placeholder="निवडा"
                                                            onChange={(selectedOption) => {
                                                                setFormData((prevData) => ({
                                                                    ...prevData,
                                                                    waid: selectedOption ? selectedOption.value : "",
                                                                }));
                                                                if (submitRef.current) {
                                                                    submitRef.current.focus();
                                                                }
                                                            }}
                                                            required
                                                            ref={warehouseRef}
                                                            openMenuOnFocus={true}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-12">
                                <div className="btn-addproduct mb-4">
                                    <button
                                        type="button"
                                        onClick={showExitAlert}
                                        className="btn btn-cancel me-2">
                                        मागे
                                    </button>
                                    <button className="btn btn-submit" ref={submitRef}>
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

export default AddCounter;
