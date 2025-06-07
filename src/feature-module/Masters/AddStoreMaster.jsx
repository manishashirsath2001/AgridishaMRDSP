import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Select from "react-select";
import { ChevronDown, ChevronUp, Info, ArrowLeft } from "feather-icons-react/build/IconComponents";
import { useDispatch, useSelector } from "react-redux";
import { setToogleHeader } from "../../core/redux/action";
import withReactContent from "sweetalert2-react-content";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { all_routes } from "../../Router/all_routes";
import { ACSPLGUID, baseUrl } from "../../core/json/custom";
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { useEffect } from "react";
import Swal from "sweetalert2";
import { useRef } from "react";

import { getUserData } from "../../Context/UserData";

const AddStoreMaster = () => {
    const location = useLocation();
    const { DAID } = location.state || {};
    console.log('primaryKey', DAID)
    const route = all_routes;
    const dispatch = useDispatch();
    const data = useSelector((state) => state.toggle_header);
    const GUID = ACSPLGUID.getNew();
    const navigate = useNavigate();
    const { isAuthenticated, userdetail } = getUserData();
    const [sellingtype, setsellingtype] = useState([]);
    const [statetype, setstatetype] = useState([]);
    if (isAuthenticated == true) {
        console.log("user", userdetail);
        console.log("getUserData", getUserData);
    }
    // const [message, setMessage] = useState("");

    const [waidOptions, setWaidOptions] = useState([]); // Initialize with "Choose"


    const STOREIDRef = useRef();
    const DNAMERef = useRef();
    const DINTERCOMEXTENSIONRef = useRef();
    const DCODERef = useRef();
    const DPINCODERef = useRef();
    const DADDRESSRef = useRef();
    const DAREARef = useRef();
    const DLANDMARKRef = useRef();
    const WAIDRef = useRef();
    const DCITYRef = useRef();
    const DSTATERef = useRef();
    const submitRef = useRef();

    const renderCollapseTooltip = (props) => (
        <Tooltip id="refresh-tooltip" {...props}>
            Collapse
        </Tooltip>
    );


    const [formData, setFormData] = useState({
        STOREID: "",
        DNAME: "",
        DINTERCOMEXTENSION: "",
        DCODE: "",
        DPINCODE: "",
        DADDRESS: "", // flatstorenobuilding as address
        DAREA: "",
        DLANDMARK: "",
        WAID: "",
        DCITY: "",
        DSTATE: "",
    });

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
                            sstatename, sstatecode }) => ({
                                label: sstatename,
                                value: sstatecode,
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

    useEffect(() => {
        if (DAID) {
            const fetchData = async () => {
                try {
                    const payload = {
                        "pkid": DAID
                        , "keyword": "%",
                        "companyid": userdetail?.companyID ? userdetail.companyID : "",
                        "deptid": userdetail?.departmentID ? userdetail.departmentID : "",
                    }
                    const headers = {
                        "Content-Type": "application/json",
                        Accept: "*/*",
                    };

                    axios({
                        method: "POST",
                        url: baseUrl.Url + "/backend/api/_GET_DepartmentMaster_/getByID",
                        data: JSON.stringify(payload),
                        headers: headers,
                    })
                        .then((response) => {
                            if (response.status != 200) throw new Error("Failed fetching Service Data");
                            const DATA = response.data[0];
                            setFormData({
                                STOREID: DATA.storeid || "",
                                DNAME: DATA.dname || "",
                                DINTERCOMEXTENSION: DATA.dintercomextension || "",
                                DCODE: DATA.dcode || "",
                                DPINCODE: DATA.dpincode || "",
                                DADDRESS: DATA.daddress || "",
                                DAREA: DATA.darea || "",
                                DLANDMARK: DATA.dlandmark || "",
                                WAID: DATA.waid || "",
                                DCITY: DATA.dcity || "",
                                DSTATE: DATA.dstate || "",
                            });
                        })

                } catch (error) {
                    console.error("Error fetching Service Data:", error);
                }

            };
            fetchData();
        }
    }, [DAID]);



    //for text data
    const handleChange = async (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        if (name == 'DPINCODE' && value.length === 6) {
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
                        .map(({ sstatename, sstatecode }) => ({
                            label: sstatename,
                            value: sstatecode,
                        }));
                    setstatetype(Statedata);
                } else {
                    console.error("Failed to fetch district and state for the pincode");
                }
            } catch (error) {
                console.error("Error fetching district and state data:", error);
            }
        }
    };

    // // for dropdown data 
    // const handleSelectChange = (selectedOption, field) => {
    //     setFormData(prevData => ({
    //         ...prevData,
    //         [field]: selectedOption ? selectedOption.value : "", // Store only the 'value' of the selected option
    //     }));
    // };

    const handleSubmit = (event) => {
        event.preventDefault();
        showConfirmationAlert(event);
    };

    const handleFormSubmission = async () => {
        try {
            const payload = {
                "deptaid": DAID ? DAID : GUID,
                "storeid": formData.STOREID,
                "waid": formData.WAID,
                "dname": formData.DNAME,
                "dintercomextension": formData.DINTERCOMEXTENSION,
                "dcode": formData.DCODE,
                "daddress": formData.DADDRESS,
                "dcity": formData.DCITY,
                "darea": formData.DAREA,
                "dstate": formData.DSTATE,
                "dlandmark": formData.DLANDMARK,
                "dpincode": formData.DPINCODE,
                "companyid": userdetail?.companyID || "",
                "deptid": userdetail?.departmentID || "",
            };

            console.log("Payload:", payload);

            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            axios.post(baseUrl.Url + "/backend/api/DepartmentMaster", payload, { headers })
                .then(response => {
                    if (response.status === 200) {
                        console.log("Data saved successfully:", response.data);

                        Swal.fire({
                            icon: "success",
                            title: "साठवले!",
                            text: "माहिती यशस्वीरित्या सेव झाली",
                            allowOutsideClick: false,
                            allowEscapeKey: false,
                            confirmButtonText: "OK",
                        }).then(() => {
                            navigate(route.StoreMaster);
                        });
                    } else {
                        throw new Error(`Unexpected response status: ${response.status}`);
                    }
                })
                .catch(error => {
                    console.error("Submission Error:", error);
                    Swal.fire({
                        icon: "error",
                        title: "त्रुटी ",
                        text: "माहिती जतन करण्यात अयशस्वी. कृपया पुन्हा प्रयत्न करा.",
                        allowOutsideClick: false,
                        allowEscapeKey: false
                    });
                });

        } catch (error) {
            console.error("Unexpected Error:", error);
            Swal.fire({
                icon: "error",
                title: "त्रुटी ",
                text: "काहीतरी चूक झाली. कृपया पुन्हा प्रयत्न करा.",
                allowOutsideClick: false,
                allowEscapeKey: false
            });
        }

    };
    const MySwal = withReactContent(Swal);

    const showConfirmationAlert = (event) => {
        MySwal.fire({
            title: "तुम्हाला खात्री आहे का?",
            text: "तुम्हाला ही माहिती  सेव्ह करायची आहे",
            showCancelButton: true,
            confirmButtonColor: "#00ff00",
            confirmButtonText: "सेव्ह",
            cancelButtonColor: "#092C4C",
            cancelButtonText: "रद्द करा",
            allowOutsideClick: false,
            allowEscapeKey: false
        }).then((result) => {
            if (result.isConfirmed) {
                handleFormSubmission(event);
            }
        });
    };

    // Keyboard shortcut handling
    useEffect(() => {
        const handleShortcut = (e) => {
            if (e.ctrlKey && e.key === "e") {
                e.preventDefault();
                showExitAlert();
            }
            if (e.ctrlKey && e.key === "s" || e.ctrlKey && e.key === "S") {
                e.preventDefault();
                checkvalidation();
            }
        };

        window.addEventListener("keydown", handleShortcut);

        return () => {
            window.removeEventListener("keydown", handleShortcut);
        };
    }, [formData, navigate, route.StoreMaster, handleSubmit]);



    // validation on C+S  
    // const checkvalidation = () => {

    //     const STOREID = document.getElementById("STOREID").value;
    //     if (!STOREID || !/^\d+$/.test(STOREID)) {
    //         Swal.fire({
    //             icon: "error",
    //             title: "विक्री केंद्र आयडीची पडताळणी त्रुटी",
    //             text: "विक्री केंद्र आयडीमध्ये फक्त संख्या असाव्यात. स्पेस, अक्षरे किंवा चिन्हे अनुमत नाहीत.",
    //         })
    //         return;
    //     }

    //     const DNAME = document.getElementById("DNAME").value;
    //     if (!DNAME || !/^[A-Za-z]+(?: [A-Za-z]+)*$/.test(DNAME)) {
    //         Swal.fire({
    //             icon: "error",
    //             title: "विक्री केंद्र नावाची पडताळणी त्रुटी",
    //             text: "विक्री केंद्र नाव फक्त अक्षरे आणि शब्दांमधील स्पेस असले पाहिजे (शुरुवातीला किंवा शेवटी स्पेस नसावी)",
    //         })
    //         return;
    //     }
    //     const { WAID } = formData;
    //     if (!WAID || WAID === "") {
    //         Swal.fire({
    //             icon: "error",
    //             title: "गोदाम आयडीची पडताळणी त्रुटी",
    //             text: "कृपया गोदाम आयडी निवडा.",
    //         })
    //         return;
    //     }


    //     const DINTERCOMEXTENSION = document.getElementById("DINTERCOMEXTENSION").value;
    //     if (DINTERCOMEXTENSION && !/^\d{10}$/.test(DINTERCOMEXTENSION)) {
    //         Swal.fire({
    //             icon: "error",
    //             title: "इंटरकॉम एक्स्टेंशनची पडताळणी त्रुटी",
    //             text: "इंटरकॉम एक्स्टेंशनमध्ये अचूक 10 आकडे असावेत. कोणतेही स्पेस किंवा विशेष चिन्ह नसावे.",
    //         })
    //         return;
    //     }

    //     const DCODE = document.getElementById("DCODE").value;
    //     if (DCODE && !/^[a-zA-Z0-9]+$/.test(DCODE)) {
    //         Swal.fire({
    //             icon: "error",
    //             title: "विक्री केंद्र कोडची पडताळणी त्रुटी",
    //             text: "विक्री केंद्र कोडमध्ये फक्त अक्षरे आणि अंक असावेत. स्पेस किंवा विशेष चिन्हे अनुमत नाहीत.",
    //         })
    //         return;
    //     }

    //     const DPINCODE = document.getElementById("DPINCODE").value;
    //     if (DPINCODE && !/^\d{6}$/.test(DPINCODE)) {
    //         Swal.fire({
    //             icon: "error",
    //             title: "पिनकोडची पडताळणी त्रुटी",
    //             text: "पिनकोड अचूक 6 अंकांचा असावा. सुरुवातीस स्पेस असू नये.",
    //         })
    //         return;
    //     }

    //     const DADDRESS = document.getElementById("DADDRESS").value;
    //     if (DADDRESS && !/^(?!\s*$)[A-Za-z0-9,.]+(?: [A-Za-z0-9,.]+)*$/.test(DADDRESS)) {
    //         Swal.fire({
    //             icon: "error",
    //             title: "फ्लॅट/विक्री केंद्र नं/इमारत यांची पडताळणी त्रुटी",
    //             text: "कृपया सुरुवातीचा व शेवटचा स्पेस काढा.",
    //         })
    //         return;
    //     }

    //     const DAREA = document.getElementById("DAREA").value;
    //     if (DAREA && !/^(?!\s*$)[A-Za-z0-9,.]+(?: [A-Za-z0-9,.]+)*$/.test(DAREA)) {
    //         Swal.fire({
    //             icon: "error",
    //             title: "विक्री केंद्र क्षेत्र/सेक्टर/गाव यांची पडताळणी त्रुटी",
    //             text: "कृपया सुरुवातीचा व शेवटचा स्पेस काढा.",
    //         })
    //         return;
    //     }

    //     const DLANDMARK = document.getElementById("DLANDMARK").value;
    //     if (DLANDMARK && !/^(?!\s*$)[A-Za-z0-9,.]+(?: [A-Za-z0-9,.]+)*$/.test(DLANDMARK)) {
    //         Swal.fire({
    //             icon: "error",
    //             title: "विक्री केंद्राच्या जवळचे महत्वाचे ठिकाण  पडताळणी त्रुटी",
    //             text: "कृपया सुरुवातीचा व शेवटचा स्पेस काढा.",
    //         })
    //         return;
    //     }


    //     const { DCITY } = formData;
    //     if (DCITY && DCITY === "") {
    //         Swal.fire({
    //             icon: "error",
    //             title: "शहर निवडण्याची पडताळणी त्रुटी ",
    //             text: "कृपया शहर निवडा.",
    //         })
    //         return;
    //     }

    //     const { DSTATE } = formData;
    //     if (DSTATE && DSTATE === "") {
    //         Swal.fire({
    //             icon: "error",
    //             title: "राज्य निवडण्याची पडताळणी त्रुटी",
    //             text: "कृपया राज्य निवडा.",
    //         })
    //         return;
    //     }

    //     handleSubmit(event);
    // }

    const checkvalidation = (e) => {
        const devanagariRegex = /^[\u0900-\u097F\u0020A-Za-z0-9]+$/; // Marathi + English + space
        const noLeadingWhitespaceRegex = /^(?![\s\t\n\r])/;

        const {
            STOREID, DNAME, DINTERCOMEXTENSION, DCODE,
            DPINCODE, DADDRESS, DAREA, DLANDMARK,
            WAID, DCITY, DSTATE
        } = formData;

        if (!STOREID || !/^[0-9]+$/.test(STOREID)) {
            Swal.fire({
                icon: "error",
                title: "चूक तपासणी",
                text: "विक्री केंद्र आयडी फक्त अंक असावा.",
                allowOutsideClick: false,
                allowEscapeKey: false
            });
            STOREIDRef.current?.focus();
            return;
        }

        if (!DNAME || !noLeadingWhitespaceRegex.test(DNAME) || !devanagariRegex.test(DNAME)) {
            Swal.fire({
                icon: "error",
                title: "चूक तपासणी",
                text: "विक्री केंद्र नाव आवश्यक आहे आणि मराठी/इंग्रजी अक्षरे असावीत. सुरुवातीस स्पेस नसावा.",
                allowOutsideClick: false,
                allowEscapeKey: false
            });
            DNAMERef.current?.focus();
            return;
        }

        if (!WAID || WAID === "") {
            Swal.fire({
                icon: "error",
                title: "चूक तपासणी",
                text: "कृपया गोदाम आयडी निवडा.",
                allowOutsideClick: false,
                allowEscapeKey: false
            });
            WAIDRef.current?.focus();
            return;
        }

        if (DINTERCOMEXTENSION && !/^\d{10}$/.test(DINTERCOMEXTENSION)) {
            Swal.fire({
                icon: "error",
                title: "चूक तपासणी",
                text: "इंटरकॉम एक्सटेन्शन 10 अंकी असावा.",
                allowOutsideClick: false,
                allowEscapeKey: false
            });
            DINTERCOMEXTENSIONRef.current?.focus();
            return;
        }

        if (DCODE && !/^[a-zA-Z0-9]+$/.test(DCODE)) {
            Swal.fire({
                icon: "error",
                title: "चूक तपासणी",
                text: "विक्री केंद्र कोडमध्ये फक्त इंग्रजी अक्षरे व अंक असावेत.",
                allowOutsideClick: false,
                allowEscapeKey: false
            });
            DCODERef.current?.focus();
            return;
        }

        if (DPINCODE && !/^\d{6}$/.test(DPINCODE)) {
            Swal.fire({
                icon: "error",
                title: "चूक तपासणी",
                text: "पिनकोड अचूक 6 अंकांचा असावा.",
                allowOutsideClick: false,
                allowEscapeKey: false
            });
            DPINCODERef.current?.focus();
            return;
        }

        if (DADDRESS && (!noLeadingWhitespaceRegex.test(DADDRESS) || !devanagariRegex.test(DADDRESS))) {
            Swal.fire({
                icon: "error",
                title: "चूक तपासणी",
                text: "पत्ता आवश्यक आहे आणि मराठी/इंग्रजी अक्षरे, स्पेस वापरून असावा. सुरुवातीस स्पेस नसावा.",
                allowOutsideClick: false,
                allowEscapeKey: false
            });
            DADDRESSRef.current?.focus();
            return;
        }

        if (DAREA && (!noLeadingWhitespaceRegex.test(DAREA) || !devanagariRegex.test(DAREA))) {
            Swal.fire({
                icon: "error",
                title: "चूक तपासणी",
                text: "क्षेत्र/सेक्टर/गाव हे मराठी/इंग्रजी अक्षरे वापरून द्या. सुरुवातीस स्पेस नसावा.",
                allowOutsideClick: false,
                allowEscapeKey: false
            });
            DAREARef.current?.focus();
            return;
        }

        if (DLANDMARK && (!noLeadingWhitespaceRegex.test(DLANDMARK) || !devanagariRegex.test(DLANDMARK))) {
            Swal.fire({
                icon: "error",
                title: "चूक तपासणी",
                text: "ठिकाणाचे नाव मराठी/इंग्रजीमध्ये असावे. सुरुवातीस स्पेस नसावा.",
                allowOutsideClick: false,
                allowEscapeKey: false
            });
            DLANDMARKRef.current?.focus();
            return;
        }

        if (!DCITY || DCITY === "") {
            Swal.fire({
                icon: "error",
                title: "चूक तपासणी",
                text: "कृपया शहर निवडा.",
                allowOutsideClick: false,
                allowEscapeKey: false
            });
            DCITYRef.current?.focus();
            return;
        }

        if (!DSTATE || DSTATE === "") {
            Swal.fire({
                icon: "error",
                title: "चूक तपासणी",
                text: "कृपया राज्य निवडा.",
                allowOutsideClick: false,
                allowEscapeKey: false
            });
            DSTATERef.current?.focus();
            return;
        }

        handleSubmit(e);
    };



    // const DCITY = [
    //     { value: "choose", label: "Choose" },
    //     { value: "nasik", label: "nasik" },
    //     { value: "dhule", label: "dhule" },
    //     { value: "thane", label: "thane" },
    // ];
    // const DSTATE = [
    //     { value: "choose", label: "Choose" },
    //     { value: "maharashtra", label: "maharashtra" },
    //     { value: "gujrat", label: "gujrat" },
    //     { value: "goa", label: "goa" },
    // ];

    //API  Fetch WAID options dynamically  
    useEffect(() => {
        const fetchWaidOptions = async () => {
            try {

                const payload = {
                    "pkid": "%",
                    "keyword": "%",
                    "companyid": userdetail?.companyID ? userdetail.companyID : "",
                    "deptid": userdetail?.departmentID ? userdetail.departmentID : "",
                };

                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };

                axios({
                    method: "POST",
                    // url: baseUrl.Url + "/backend/api/_GET_ServicesMaster_",
                    url: baseUrl.Url + "/backend/api/_GET_WarehouseMaster_/Serch",
                    data: JSON.stringify(payload),
                    headers: headers,
                })
                    .then((response) => {
                        const data = response.data;
                        const options = data.map(item => ({
                            value: item.waid,
                            label: item.wname,
                        }));

                        setWaidOptions(options);
                        console.log('Response Data:', response.data);
                    });



            } catch (error) {
                console.error('get data Error:', error);
            }

        };

        fetchWaidOptions();
    }, []);
    const showExitAlert = () => {
        MySwal.fire({
            title: "आपण बाहेर पडू इच्छिता का?",
            showCancelButton: true,
            confirmButtonColor: "#00ff00",
            confirmButtonText: "होय",
            cancelButtonColor: "#092C4C",
            cancelButtonText: "नाही",
            allowOutsideClick: false,
            allowEscapeKey: false
        }).then((result) => {
            if (result.isConfirmed) {
                navigate(route.StoreMaster)
            }
        });
    };

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
                            <h5 className="mb-1">विभागाचे व्यवस्थापन</h5>
                            <h6>विभाग जोडा </h6>
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
                        <Link to={route.StoreMaster} className="btn btn-secondary">
                            <ArrowLeft className="me-2" />
                            मागे
                        </Link>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="card mbgcolor">
                        <div className="card-body add-product">
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
                                                    <span>विभाग </span>
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
                                                <div className="col-lg-4 col-sm-6 col-12">
                                                    <div className="mb-3">
                                                        <label className="form-label required">विभाग आयडी</label>
                                                        <input
                                                            // id="SroreId"
                                                            ref={STOREIDRef}
                                                            id="STOREID"
                                                            type="text"
                                                            className="form-control"
                                                            placeholder="विभाग आयडी"
                                                            name="STOREID"
                                                            value={formData.STOREID}
                                                            onChange={handleChange}
                                                            required
                                                            autoFocus
                                                            pattern="^[0-9\u0966-\u096F]+$"
                                                            title="विभाग आयडीमध्ये फक्त अंक असावेत. स्पेस, अक्षरे आणि चिन्हे स्वीकारले जाणार नाहीत"
                                                            onKeyDown={(e) => handleEnterKey(e, DNAMERef)}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-lg-8 col-sm-6 col-12">
                                                    <div className="mb-3">
                                                        <label className="form-label required">विभागाचे नाव </label>
                                                        <input
                                                            ref={DNAMERef}
                                                            id="DNAME"
                                                            type="text"
                                                            className="form-control"
                                                            placeholder="विभागाचे नाव"
                                                            name="DNAME"
                                                            value={formData.DNAME}
                                                            onChange={handleChange}
                                                            required
                                                            // pattern="^[A-Za-z]+(?: [A-Za-z]+)*$"  // Only characters and spaces between them, no space at start or end
                                                            title="विभागाच्या नावामध्ये फक्त अक्षरे आणि शब्दांमध्ये स्पेस असाव्यात (सुरुवातीला किंवा शेवटी स्पेस नसावा)."
                                                            onKeyDown={(e) => handleEnterKey(e, WAIDRef)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="accordion-body">
                                            <div className="row">
                                                <div className="col-lg-4 col-sm-6 col-12">
                                                    <div className="mb-3">
                                                        <div className="add-newplus">
                                                            <label className="form-label required">गोदाम आयडी </label>
                                                            {/* <a

                                                                onClick={() => { navigate(route.AddWarehouseForm, { state: { id: '1' } }) }}
                                                                data-bs-target="#add-warehouse"
                                                            >
                                                                <PlusCircle className="plus-down-add" />
                                                                <span>Add New</span>
                                                            </a> */}
                                                        </div>
                                                        <Select
                                                            classNamePrefix="react-select"
                                                            ref={WAIDRef}

                                                            options={waidOptions}
                                                            // value={WAID.find(option => option.value === formData.WAID) || null} // Find the full object based on the value stored in formData
                                                            value={waidOptions.find(option => option.value === formData.WAID) || null}
                                                            placeholder="निवडा"
                                                            // onChange={(selectedOption) => handleSelectChange(selectedOption, 'WAID')}
                                                            onChange={(selectedOption) => {
                                                                setFormData((prevData) => ({
                                                                    ...prevData,
                                                                    WAID: selectedOption ? selectedOption.value : "",
                                                                }));
                                                                if (DINTERCOMEXTENSIONRef.current) {
                                                                    DINTERCOMEXTENSIONRef.current.focus();
                                                                }

                                                            }}
                                                            required
                                                            openMenuOnFocus={true}

                                                        />

                                                    </div>
                                                </div>
                                                <div className="col-lg-4 col-sm-6 col-12">
                                                    <div className="mb-3">
                                                        <label className="form-label">विभाग इंटरकॉम विस्तार </label>
                                                        <input
                                                            ref={DINTERCOMEXTENSIONRef}
                                                            id="DINTERCOMEXTENSION"
                                                            type="text"
                                                            className="form-control"
                                                            placeholder="विभाग इंटरकॉम विस्तार"
                                                            name="DINTERCOMEXTENSION"
                                                            value={formData.DINTERCOMEXTENSION}
                                                            onChange={handleChange}
                                                            pattern="^[0-9\u0966-\u096F]{10}$"
                                                            title="इंटरकॉम विस्तार  अचूक 10 अंक असावेत, स्पेस किंवा विशेष चिन्ह नसावेत."
                                                            onKeyDown={(e) => handleEnterKey(e, DCODERef)}
                                                        />
                                                    </div>
                                                </div>


                                                <div className="col-lg-4 col-sm-6 col-12">
                                                    <div className="mb-3">
                                                        <label className="form-label">विभाग कोड </label>
                                                        <input
                                                            ref={DCODERef}
                                                            id="DCODE"
                                                            type="text"
                                                            className="form-control"
                                                            placeholder="विभाग कोड"
                                                            name="DCODE"
                                                            value={formData.DCODE}
                                                            onChange={handleChange}
                                                            // pattern="^[a-zA-Z0-9]+$"
                                                            title="विभाग कोडमध्ये फक्त अक्षरे आणि अंक असावेत. स्पेस आणि विशेष चिन्हे अनुमत नाहीत."
                                                            onKeyDown={(e) => handleEnterKey(e, DPINCODERef)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="accordion-body">
                                            <div className="row">
                                                <div className="col-lg-4 col-sm-6 col-12">
                                                    <div className="mb-3">
                                                        <label className="form-label">पिनकोड </label>
                                                        <input
                                                            ref={DPINCODERef}
                                                            id="DPINCODE"
                                                            type="text"
                                                            className="form-control"
                                                            placeholder="पिनकोड"
                                                            name="DPINCODE"
                                                            value={formData.DPINCODE}
                                                            onChange={handleChange}
                                                            pattern="^[0-9\u0966-\u096F]{6}$"
                                                            title="पिनकोड अचूक 6 अंकांचा असावा. सुरुवातीला स्पेस असू नये."
                                                            onKeyDown={(e) => handleEnterKey(e, DADDRESSRef)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-4 col-sm-6 col-12">
                                                    <div className="mb-3">
                                                        <label className="form-label">फ्लॅट/विक्री केंद्र नं/इमारत </label>
                                                        <input
                                                            ref={DADDRESSRef}
                                                            id="DADDRESS"
                                                            type="text"
                                                            className="form-control"
                                                            placeholder="फ्लॅट/विक्री केंद्र नं/इमारत"
                                                            name="DADDRESS"
                                                            value={formData.DADDRESS}
                                                            onChange={handleChange}
                                                            // pattern="^(?!\s*$)[A-Za-z0-9,.]+(?: [A-Za-z0-9,.]+)*$"
                                                            title="कृपया, सुरुवातीचा आणि शेवटचा स्पेस काढा."
                                                            onKeyDown={(e) => handleEnterKey(e, DAREARef)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-4 col-sm-6 col-12">
                                                    <div className="mb-3">
                                                        <label className="form-label">विभाग क्षेत्र/सेक्टर/गाव</label>
                                                        <input
                                                            ref={DAREARef}
                                                            id="DAREA"
                                                            type="text"
                                                            className="form-control"
                                                            placeholder="विभाग क्षेत्र/सेक्टर/गाव"
                                                            name="DAREA"
                                                            value={formData.DAREA}
                                                            onChange={handleChange}
                                                            // pattern="^(?!\s*$)[A-Za-z0-9,.]+(?: [A-Za-z0-9,.]+)*$"
                                                            title="please, remove space at start and end."
                                                            onKeyDown={(e) => handleEnterKey(e, DLANDMARKRef)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="accordion-body">
                                            <div className="row">
                                                <div className="col-lg-4 col-sm-6 col-12">
                                                    <div className="mb-3">
                                                        <label className="form-label">विभागाच्या जवळचे महत्वाचे ठिकाण</label>
                                                        <input
                                                            ref={DLANDMARKRef}
                                                            id="DLANDMARK"
                                                            type="text"
                                                            className="form-control"
                                                            placeholder="विभागाच्या जवळचे महत्वाचे ठिकाण"
                                                            name="DLANDMARK"
                                                            value={formData.DLANDMARK}
                                                            onChange={handleChange}
                                                            // pattern="^(?!\s*$)[A-Za-z0-9,.]+(?: [A-Za-z0-9,.]+)*$"
                                                            title="please, remove space at start and end."
                                                            onKeyDown={(e) => handleEnterKey(e, DCITYRef)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-4 col-sm-6 col-12">
                                                    <div className="mb-3">
                                                        <label className="form-label">जिल्हा </label>
                                                        {/* <Select
                                                            classNamePrefix="react-select"
                                                            ref={DCITYRef}
                                                            id="DCITY"
                                                            options={DCITY}
                                                            placeholder="Choose"
                                                            value={DCITY.find(option => option.value === formData.DCITY) || null} // Find the full object based on the value stored in formData
                                                            onChange={(selectedOption) => handleSelectChange(selectedOption, 'DCITY')}
                                                        /> */}
                                                        <Select
                                                            classNamePrefix="react-select"
                                                            options={sellingtype}
                                                            ref={DCITYRef}
                                                            id="DCITY"
                                                            value={sellingtype.find(option => option.value === formData.DCITY) || null}
                                                            // onChange={(selectedOption) => handleSelectChange(selectedOption, 'DCITY')}
                                                            onChange={(selectedOption) => {
                                                                setFormData((prevData) => ({
                                                                    ...prevData,
                                                                    DCITY: selectedOption ? selectedOption.value : "",
                                                                }));
                                                                if (DSTATERef.current) {
                                                                    DSTATERef.current.focus();
                                                                }

                                                            }}
                                                            placeholder="निवडा"
                                                            openMenuOnFocus={true}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-4 col-sm-6 col-12">
                                                    <div className="mb-3">
                                                        <label className="form-label">राज्य </label>
                                                        {/* <Select
                                                            classNamePrefix="react-select"
                                                            ref={DSTATERef}
                                                            id="DSTATE"
                                                            options={DSTATE}
                                                            placeholder="Choose"
                                                            value={DSTATE.find(option => option.value === formData.DSTATE) || null}
                                                            onChange={(selectedOption) => handleSelectChange(selectedOption, 'DSTATE')}
                                                        /> */}
                                                        <Select
                                                            classNamePrefix="react-select"
                                                            options={statetype}
                                                            ref={DSTATERef}
                                                            id="DSTATE"
                                                            value={statetype.find(option => option.value === formData.DSTATE) || null}
                                                            // onChange={(selectedOption) => handleSelectChange(selectedOption, 'DSTATE')}
                                                            onChange={(selectedOption) => {
                                                                setFormData((prevData) => ({
                                                                    ...prevData,
                                                                    DSTATE: selectedOption ? selectedOption.value : "",
                                                                }));
                                                                if (submitRef.current) {
                                                                    submitRef.current.focus();
                                                                }

                                                            }}

                                                            placeholder="निवडा"
                                                            openMenuOnFocus={true}
                                                        />
                                                    </div>
                                                </div>
                                            </div>


                                            {/* save and cancel button */}
                                            <div className="col-lg-12">
                                                <div className="btn-addproduct mb-4">
                                                    <button
                                                        type="button"
                                                        onClick={showExitAlert}
                                                        className="btn btn-cancel me-2">
                                                        मागे
                                                    </button>

                                                    <button type="submit" className="btn btn-submit"
                                                        ref={submitRef}>
                                                        सेव्ह
                                                    </button>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>


                </form>

            </div >
        </div >

    );
};

export default AddStoreMaster;