
import { Link } from "react-router-dom";
import Select from "react-select";
import { ChevronUp, Info, LifeBuoy, ArrowLeft } from "feather-icons-react/build/IconComponents";
import { useDispatch, useSelector } from "react-redux";
import { setToogleHeader } from "../../core/redux/action";

import { all_routes } from "../../Router/all_routes";
import { ACSPLGUID, baseUrl } from "../../core/json/custom";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import React, { useRef, useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { getUserData } from "../../Context/UserData";
const AddWarehouseForm = () => {
    const route = all_routes;
    const navigate = useNavigate();
    const GUID = ACSPLGUID.getNew()
    const dispatch = useDispatch();
    const [sellingtype, setsellingtype] = useState([]);
    const [statetype, setstatetype] = useState([]);
    const data = useSelector((state) => state.toggle_header);
    const { isAuthenticated, userdetail } = getUserData();
    if (isAuthenticated == true) {
        console.log("user", userdetail);
        console.log("getUserData", getUserData);
    }
    const location = useLocation();
    const { WAID } = location.state || {};
    // const [successMessage, setSuccessMessage] = useState("");  // State for success message
    // const [showModal, setShowModal] = useState(false);


    console.log('primaryKey', WAID)

    const renderCollapseTooltip = (props) => (
        <Tooltip id="refresh-tooltip" {...props}>
            Collapse
        </Tooltip>
    );

    // const city = [
    //     { value: "choose", label: "Choose" },
    //     { value: "nashik", label: "nashik" },
    //     { value: "satara", label: "satara" },
    // ];

    // const state = [
    //     { value: "choose", label: "Choose" },
    //     { value: "Maharastra", label: "Maharastra" },
    //     { value: "Gujrat", label: "Gujrat" },
    // ];

    const WSTOREIDRef = useRef(null);
    const WNAMERef = useRef(null);
    const WAVAILABLECAPCITYRef = useRef(null);
    const WINTERCOMEXTENSIONRef = useRef(null);
    const WPINCODERef = useRef(null);
    const WADDRESSRef = useRef(null);
    const WLANDMARKRef = useRef(null);
    const WAREARef = useRef(null);
    const CITYRef = useRef(null);
    const STATERef = useRef(null);
    const WDESCRIPTIONRef = useRef(null);
    const submitRef = useRef();

    const [formData, setFormData] = useState({

        WSTOREID: "",
        WNAME: "",
        WAVAILABLECAPCITY: "",
        WINTERCOMEXTENSION: "",
        WPINCODE: "",
        WADDRESS: "",
        WLANDMARK: "",
        WAREA: "",
        WCITY: "",
        WSTATE: "",
        WDESCRIPTION: ""

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
        if (WAID) {
            const fetchData = async () => {
                try {
                    const payload = {
                        "pkid": WAID
                        , "keyword": "%"
                        , "companyid": userdetail?.companyID ? userdetail.companyID : "",
                        "deptid": userdetail?.departmentID ? userdetail.departmentID : ""
                    }
                    const headers = {
                        "Content-Type": "application/json",
                        Accept: "*/*",
                    };

                    axios({
                        method: "POST",
                        url: baseUrl.Url + "/backend/api/_GET_WarehouseMaster_/getByID",
                        data: JSON.stringify(payload),
                        headers: headers,
                    })
                        .then((response) => {
                            if (response.status != 200) throw new Error("Failed fetching Service Data");
                            const DATA = response.data[0];
                            setFormData({
                                WSTOREID: "",
                                WNAME: DATA.wname,
                                WAVAILABLECAPCITY: DATA.wavailablecapcity,
                                WINTERCOMEXTENSION: DATA.wintercomextension,
                                WPINCODE: DATA.wpincode,
                                WADDRESS: DATA.waddress,
                                WLANDMARK: DATA.wlandmark,
                                WAREA: DATA.warea,
                                WCITY: DATA.wcity,
                                WSTATE: DATA.wstate,
                                WDESCRIPTION: DATA.wdescription,
                            });
                        })

                } catch (error) {
                    console.error("Error fetching Service Data:", error);
                }

            };
            fetchData();
        }
    }, [WAID]);


    const handleChange = async (e) => {
        const { name, value } = e.target;
        const trimmedValue = value.trimStart();
        setFormData((prevData) => ({
            ...prevData,
            [name]: trimmedValue,
        }));

        if (name == 'WPINCODE' && value.length === 6) {
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


    const handleSubmit = (event) => {
        event.preventDefault();

        const form = event.target.closest("form");
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        showConfirmationAlert(event);
    };
    // const handleModalClose = () => {
    //     setShowModal(false); // Close the modal without submitting
    // };

    const MySwal = withReactContent(Swal);

    const showConfirmationAlert = (event) => {
        MySwal.fire({
            title: "आपण खात्री आहात का?",
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
                handleModalConfirm(event); // Proceed with form submission
            }
        });
    };

    const warehouseIdRef = useRef(null); // Input field reference

    useEffect(() => {
        // Focus on the Warehouse ID input field
        if (warehouseIdRef.current) {
            warehouseIdRef.current.focus();
        }
    }, []); // Runs only on the initial render


    useEffect(() => {
        const handleShortcut = (e) => {
            if (e.ctrlKey && e.key === "s") {
                e.preventDefault();
                checkFormValidity(e);
            }

            if (e.ctrlKey && e.key === "e") {
                e.preventDefault();
                showExitAlert();

            }

        };

        window.addEventListener("keydown", handleShortcut);

        return () => {
            window.removeEventListener("keydown", handleShortcut);
        };
    }, [formData, navigate, route.WareHousesMaster, handleSubmit]);


    // const checkFormValidity = (e) => {
    //     const { WSTOREID, WNAME, WAVAILABLECAPCITY, WINTERCOMEXTENSION } = formData;

    //     if (!WSTOREID || !/^[0-9]+$/.test(WSTOREID)) {
    //         Swal.fire({
    //             icon: "error",
    //             title: "Validation Error",
    //             text: "Warehouse ID can only contain numbers",
    //         }).then(() => {
    //             WSTOREIDRef.current.focus();
    //         })
    //         return;

    //     }


    //     if (!WNAME) {
    //         Swal.fire({
    //             icon: "error",
    //             title: "Validation Error",
    //             text: "Warehouse name is required",
    //         }).then(() => {
    //             WNAMERef.current.focus();
    //         });
    //         return;
    //     }

    //     if (!WINTERCOMEXTENSION || !/^\d{10}$/.test(WINTERCOMEXTENSION)) {
    //         Swal.fire({
    //             icon: "error",
    //             title: "Validation Error",
    //             text: "INTERCOMEXTENSION can only contain numbers",
    //         }).then(() => {
    //             WINTERCOMEXTENSIONRef.current.focus();
    //         })
    //         return;

    //     }
    //     if (!WAVAILABLECAPCITY || !/^[0-9]+$/.test(WAVAILABLECAPCITY)) {
    //         Swal.fire({
    //             icon: "error",
    //             title: "Validation Error",
    //             text: "Capacity only contain numbers",
    //         }).then(() => {
    //             WAVAILABLECAPCITYRef.current.focus();
    //         })
    //         return;

    //     }


    //     handleSubmit(e);

    // };


    const checkFormValidity = (e) => {
        const devanagariRegex = /^[\u0900-\u097F\u0020A-Za-z0-9]+$/; // Marathi + English + space
        const noLeadingWhitespaceRegex = /^(?![\s\t\n\r])/;

        const { WSTOREID, WNAME, WAVAILABLECAPCITY, WINTERCOMEXTENSION } = formData;

        if (!WSTOREID || !/^[0-9]+$/.test(WSTOREID)) {
            Swal.fire({
                icon: "error",
                title: "त्रुटी ",
                text: "वेअरहाऊस आयडी फक्त अंक असावा..",
                allowOutsideClick: false,
                allowEscapeKey: false,
            }).then(() => {
                WSTOREIDRef.current.focus();
            });
            return;
        }

        if (!WNAME || !noLeadingWhitespaceRegex.test(WNAME) || !devanagariRegex.test(WNAME)) {
            Swal.fire({
                icon: "error",
                title: "त्रुटी",
                text: "वेअरहाऊसचे नाव आवश्यक आहे आणि केवळ इंग्रजी/मराठी अक्षरे असावीत. ",
                allowOutsideClick: false,
                allowEscapeKey: false,
            }).then(() => {
                WNAMERef.current.focus();
            });
            return;
        }

        if (!WINTERCOMEXTENSION || !/^\d{10}$/.test(WINTERCOMEXTENSION)) {
            Swal.fire({
                icon: "error",
                title: "त्रुटी",
                text: "इंटरकॉम एक्सटेन्शन 10 अंकी असावा. ",
                allowOutsideClick: false,
                allowEscapeKey: false,
            }).then(() => {
                WINTERCOMEXTENSIONRef.current.focus();
            });
            return;
        }

        if (!WAVAILABLECAPCITY || !/^[0-9]+$/.test(WAVAILABLECAPCITY)) {
            Swal.fire({
                icon: "error",
                title: "त्रुटी",
                text: "उपलब्ध क्षमता फक्त अंक असावी. ",
                allowOutsideClick: false,
                allowEscapeKey: false,
            }).then(() => {
                WAVAILABLECAPCITYRef.current.focus();
            });
            return;
        }

        handleSubmit(e);
    };


    const handleModalConfirm = async () => {
        // setShowModal(false); // Close the modal
        try {
            const payload = {
                "waid": WAID ? WAID : GUID,
                "wstoreid": formData.WSTOREID,
                "wname": formData.WNAME,
                "wavailablecapcity": formData.WAVAILABLECAPCITY,
                "wintercomextension": formData.WINTERCOMEXTENSION,
                "warea": formData.WAREA,
                "wlandmark": formData.WLANDMARK,
                "waddress": formData.WADDRESS,
                "wcity": formData.WCITY,
                "wstate": formData.WSTATE,
                "wpincode": formData.WPINCODE,
                "wdescription": formData.WDESCRIPTION
                , "companyid": userdetail?.companyID ? userdetail.companyID : "",
                "deptid": userdetail?.departmentID ? userdetail.departmentID : ""

            };
            console.log("payload", payload);
            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            axios({
                method: "POST",
                url: baseUrl.Url + "/backend/api/WareHouse",
                data: JSON.stringify(payload),
                headers: headers,
            })
            Swal.fire({
                icon: "success",
                title: "जतन केले!",
                text: "डेटा यशस्वीरित्या जतन झाला.",
                confirmButtonText: "ठीक आहे",
                allowOutsideClick: false,
                allowEscapeKey: false,
            });
            navigate(route.WareHousesMaster);
        } catch (error) {
            console.error("Submission Error:", error);
            Swal.fire({
                icon: "error",
                title: "त्रुटी",
                text: "डेटा जतन करण्यात अयशस्वी. कृपया पुन्हा प्रयत्न करा.",
                allowOutsideClick: false,
                allowEscapeKey: false,
            });
        }
    };
    // const MySwal = withReactContent(Swal);

    // const showConfirmationAlert = (event) => {
    //     MySwal.fire({
    //         title: "Are you sure?",
    //         text: "Do you want to save this data?",
    //         showCancelButton: true,
    //         confirmButtonColor: "#00ff00",
    //         confirmButtonText: "SAVE",
    //         cancelButtonColor: "#092C4C",
    //         cancelButtonText: "CANCLE",
    //     }).then((result) => {
    //         if (result.isConfirmed) {
    //             handleFormSubmission(event);
    //         }
    //     });
    // };
    const showExitAlert = () => {
        MySwal.fire({
            title: "तुम्हाला खात्री आहे का?",
            text: "तुम्हाला बाहेर पडायचंय का?",
            showCancelButton: true,
            confirmButtonColor: "#00ff00",
            confirmButtonText: "होय",
            cancelButtonColor: "#092C4C",
            cancelButtonText: "नाही",
            allowOutsideClick: false,
            allowEscapeKey: false,
        }).then((result) => {
            if (result.isConfirmed) {
                navigate(route.WareHousesMaster)
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
                            <h4>गोदाम व्यवस्थापन </h4>
                            <h6>नवीन गोदाम तयार करा</h6>
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
                        <Link to={route.WareHousesMaster} className="btn btn-secondary">
                            <ArrowLeft className="me-2" />
                            मागे
                        </Link>
                    </div>
                </div>

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
                                            <div className="addproduct-icon input-block">
                                                <h5>
                                                    <Info className="add-info" />
                                                    <span className="fw-bold">गोदाम माहिती  व्यवस्थापन</span>
                                                </h5>
                                                <Link to="#">
                                                    <ChevronUp className="chevron-down-add" />
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
                                                    <div className="mb-3 add-product form-label text-dark">
                                                        <label className="form-label required">गोदाम आयडी</label>
                                                        <input
                                                            ref={warehouseIdRef}
                                                            type="text"
                                                            className="form-control border"
                                                            name="WSTOREID"
                                                            value={formData.WSTOREID}
                                                            onChange={handleChange}
                                                            pattern="^[0-9\u0966-\u096F]+$"
                                                            title="वेअरहाऊस आयडी फक्त अंक असावा"
                                                            required
                                                            onKeyDown={(e) => handleEnterKey(e, WNAMERef)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-8 col-sm-6 col-12">
                                                    <div className="form-label">

                                                        <label className="form-label required">गोदामचे नाव</label>

                                                        <input
                                                            ref={WNAMERef}
                                                            type="text"
                                                            className="form-control border text-secondary"
                                                            name="WNAME"
                                                            value={formData.WNAME}
                                                            onChange={handleChange}
                                                            required
                                                            onKeyDown={(e) => handleEnterKey(e, WINTERCOMEXTENSIONRef)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="row">
                                                <div className="col-lg-4 col-sm-6 col-12">
                                                    <div className="mb-3 add-product form-label">
                                                        <label className="form-label required">इंटरकॉम विस्तार</label>
                                                        <input
                                                            ref={WINTERCOMEXTENSIONRef}
                                                            type="text"
                                                            className="form-control border"
                                                            name="WINTERCOMEXTENSION"
                                                            value={formData.WINTERCOMEXTENSION}
                                                            onChange={handleChange}
                                                            pattern="^[0-9\u0966-\u096F]{10}$"
                                                            title="इंटरकॉम एक्सटेन्शन 10 अंकी असावा"
                                                            required
                                                            onKeyDown={(e) => handleEnterKey(e, WAVAILABLECAPCITYRef)}
                                                        />
                                                    </div>


                                                </div>
                                                <div className="col-lg-4 col-sm-6 col-12">
                                                    <div className="form-label">
                                                        <label className="form-label required">उपलब्ध क्षमता</label>

                                                        <input
                                                            type="text"
                                                            ref={WAVAILABLECAPCITYRef}
                                                            className="form-control border text-secondary"
                                                            name="WAVAILABLECAPCITY"
                                                            value={formData.WAVAILABLECAPCITY}
                                                            onChange={handleChange}
                                                            pattern="^[0-9\u0966-\u096F]+$"
                                                            title="क्षमता फक्त अंक असावी"
                                                            required
                                                            onKeyDown={(e) => handleEnterKey(e, WPINCODERef)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="accordion-card-one accordion" id="accordionExample2">
                                <div className="accordion-item mbgcolor">
                                    <div className="accordion-header" id="headingTwo">
                                        <div
                                            className=""
                                            data-bs-toggle="collapse"
                                            data-bs-target="#collapseTwo"
                                            aria-controls="collapseTwo"
                                        >
                                            <div className="text-editor add-list">
                                                <div className="addproduct-icon list icon form-label">
                                                    <h5>
                                                        <LifeBuoy className="add-info" />
                                                        <span className="fw-bold">गोदामाचा पत्ता</span>
                                                    </h5>
                                                    <Link to="#">
                                                        <ChevronUp className="chevron-down-add" />
                                                    </Link>
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
                                                    <div className="mb-3 add-product form-label">
                                                        <label className="form-label">पिनकोड </label>
                                                        <input
                                                            ref={WPINCODERef}
                                                            type="text"
                                                            className="form-control border"
                                                            name="WPINCODE"
                                                            value={formData.WPINCODE}
                                                            onChange={handleChange}
                                                            pattern="^[0-9\u0966-\u096F]{6}$"
                                                            title="अचूक 6 अंक असणे आवश्यक आहे"
                                                            onKeyDown={(e) => handleEnterKey(e, WADDRESSRef)}

                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-4 col-sm-6 col-12">
                                                    <div className="mb-3 add-product form-label">
                                                        <label className="form-label">फ्लॅट, इमारत, घर क्रमांक</label>
                                                        <input
                                                            type="text"
                                                            ref={WADDRESSRef}
                                                            className="form-control border"
                                                            name="WADDRESS"
                                                            value={formData.WADDRESS}
                                                            onChange={handleChange}
                                                            onKeyDown={(e) => handleEnterKey(e, WAREARef)}

                                                        />
                                                    </div>
                                                </div>
                                                {/* <div className="col-lg-4 col-sm-6 col-12">
                                                    <div className="mb-3 add-product form-label">
                                                        <label className="form-label text-dark">Area, Sector, Village</label>
                                                        <input
                                                            type="text"
                                                            className="form-control border"
                                                            name="WAREA"
                                                            value={formData.WAREA}
                                                            onChange={handleChange}
                                                            required
                                                        />
                                                    </div>
                                                </div> */}
                                                <div className="col-lg-4 col-sm-6 col-12">
                                                    <div className="mb-3 add-product form-label">
                                                        <label className="form-label">परिसर, विभाग, गाव</label>
                                                        <input
                                                            ref={WAREARef}
                                                            type="textE"
                                                            className="form-control border"
                                                            name="WAREA"
                                                            value={formData.WAREA}
                                                            onChange={handleChange}
                                                            onKeyDown={(e) => handleEnterKey(e, WLANDMARKRef)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="add-product-new">
                                            <div className="row">
                                                <div className="col-lg-4 col-sm-6 col-12">
                                                    <div className="mb-3 add-product form-label">
                                                        <label className="form-label">जवळचे महत्वाचे ठिकाण</label>
                                                        <input
                                                            ref={WLANDMARKRef}
                                                            type="text"
                                                            className="form-control border"
                                                            name="WLANDMARK"
                                                            value={formData.WLANDMARK}
                                                            onChange={handleChange}
                                                            onKeyDown={(e) => handleEnterKey(e, CITYRef)}

                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-4 col-sm-6 col-12">
                                                    <div className="mb-3 add-product">
                                                        <label className="form-label">जिल्हा</label>
                                                        {/* <Select
                                                            classNamePrefix="react-select"

                                                            options={city}
                                                            placeholder="Choose"
                                                            value={city.find((option) => option.value === formData.WCITY) || null}
                                                            onChange={(selectedOption) => {
                                                                setFormData((prevData) => ({
                                                                    ...prevData,
                                                                    WCITY: selectedOption ? selectedOption.value : "",
                                                                }));
                                                            }}

                                                        /> */}

                                                        <Select
                                                            classNamePrefix="react-select"
                                                            options={sellingtype}
                                                            id="WCITY"
                                                            value={sellingtype.find(option => option.value === formData.WCITY) || null}
                                                            onChange={(selectedOption) => {
                                                                setFormData((prevData) => ({
                                                                    ...prevData,
                                                                    WCITY: selectedOption ? selectedOption.value : "",
                                                                }));
                                                                if (STATERef.current) {
                                                                    STATERef.current.focus();
                                                                }

                                                            }}
                                                            placeholder="निवडा"
                                                            openMenuOnFocus={true}
                                                            ref={CITYRef}

                                                        />
                                                    </div>

                                                </div>
                                                <div className="col-lg-4 col-sm-6 col-12">
                                                    <div className="mb-3 add-product">
                                                        <label className="form-label">राज्य</label>
                                                        {/* <Select
                                                            classNamePrefix="react-select"
                                                            options={state}
                                                            placeholder="Choose"
                                                            value={state.find((option) => option.value === formData.WSTATE) || null}
                                                            onChange={(selectedOption) => {
                                                                setFormData((prevData) => ({
                                                                    ...prevData,
                                                                    WSTATE: selectedOption ? selectedOption.value : "",
                                                                }));
                                                            }}
                                                        /> */}

                                                        <Select
                                                            classNamePrefix="react-select"
                                                            options={statetype}
                                                            id="WSTATE"
                                                            value={statetype.find(option => option.value === formData.WSTATE) || null}

                                                            onChange={(selectedOption) => {
                                                                setFormData((prevData) => ({
                                                                    ...prevData,
                                                                    WSTATE: selectedOption ? selectedOption.value : "",
                                                                }));
                                                                if (WDESCRIPTIONRef.current) {
                                                                    WDESCRIPTIONRef.current.focus();
                                                                }

                                                            }}
                                                            placeholder="निवडा"
                                                            openMenuOnFocus={true}
                                                            ref={STATERef}

                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-12">
                                            <div className="form-label add-product form-label">
                                                <label className="form-label">माहिती</label>
                                                <textarea
                                                    ref={WDESCRIPTIONRef}
                                                    rows={5}
                                                    cols={5}
                                                    className="form-control border text-secondary"
                                                    // placeholder="Enter text here"
                                                    name="WDESCRIPTION"
                                                    value={formData.WDESCRIPTION}
                                                    onChange={handleChange}
                                                    style={{ fontWeight: '400' }}
                                                    onKeyDown={(e) => handleEnterKey(e, submitRef)}
                                                />
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

                                    <button type="submit" className="btn btn-submit"
                                        ref={submitRef}
                                    >
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

export default AddWarehouseForm;




