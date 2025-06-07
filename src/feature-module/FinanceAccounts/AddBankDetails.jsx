import React, { useState, useRef, useEffect } from 'react';
import Select from "react-select";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronUp, ArrowLeft, Info } from "feather-icons-react/build/IconComponents";
import withReactContent from "sweetalert2-react-content";
import { useDispatch, useSelector } from "react-redux";
import { setToogleHeader } from "../../core/redux/action";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { all_routes } from "../../Router/all_routes";
import { ACSPLGUID, baseUrl } from "../../core/json/custom";
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import Swal from "sweetalert2";
import axios from 'axios';

import { getUserData } from '../../Context/UserData';
const AddBankDetails = () => {
    const route = all_routes;
    const dispatch = useDispatch();
    const data = useSelector((state) => state.toggle_header);
    const { userdetail } = getUserData();
    const location = useLocation();
    const navigate = useNavigate();
    const { BANKID } = location.state || {};
    const GUID = ACSPLGUID.getNew()



    const renderCollapseTooltip = (props) => (
        <Tooltip id="refresh-tooltip" {...props}>
            Collapse
        </Tooltip>
    );

    const BANKNAMERef = useRef();
    const BACCOUTNORef = useRef();
    const BIFSCCODERef = useRef();
    const BBRANCHNAMERef = useRef();
    const BACOUNTANTNAMERef = useRef();
    const BLAZARRef = useRef();
    const StatusRef = useRef();
    const SubmitRef = useRef();

    const [formData, setFormData] = useState({
        BANKID: '',
        BANKNAME: '',
        BACCOUTNO: '',
        BIFSCCODE: '',
        BBRANCHNAME: '',
        BACOUNTANTNAME: '',
        BSTATUS: '',
        BDSTATUS: '',
        BLAZAR: '',
        DATE: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        showConfirmationAlert(e);
    };


    const [status, setstatus] = useState([]);
    const fetchStatus = async () => {
        try {
            const response = await axios.get(
                baseUrl.Url + "/backend/api/Implications/STATUS",

            );

            if (response.status !== 200) throw new Error("Failed to fetch implications data");

            const data = response.data;
            const implicationDropdown = data.map(({ iTitle, iValue }) => ({
                label: iTitle,
                value: iValue,
            }));

            setstatus(implicationDropdown);
        } catch (error) {
            console.error("Error fetching implications:", error);
        }
    };

    useEffect(() => {
        fetchStatus();
    }, []);


    useEffect(() => {
        const handleShortcut = (e) => {

            if (e.ctrlKey && e.key === 'e' || e.ctrlKey && e.key === 'E') {
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
    }, [navigate, formData]);


    const validateinput = (e) => {
        const { BANKNAME, BACCOUTNO, BIFSCCODE, BBRANCHNAME, BACOUNTANTNAME } = formData;

        // Regex for Marathi + English letters, numbers, and spaces (no leading/trailing spaces, 3 to 50 chars)
        const nameRegex = /^(?!\s)([A-Za-z0-9\u0900-\u097F\s]{3,50})(?<!\s)$/;

        // Validate Bank Name
        if (!BANKNAME || !nameRegex.test(BANKNAME)) {
            Swal.fire({
                icon: "error",
                title: "वैधता त्रुटी",
                text: "बँक नाव वैध असावे (फक्त अक्षरे आणि रिकाम्या जागा, 3 ते 50 अक्षरे, सुरुवातीला किंवा शेवटी रिकामी जागा नसावी).",
                allowOutsideClick: false,
                allowEscapeKey: false,
            }).then(() => {
                BANKNAMERef.current.focus();
            });
            return;
        }

        // Validate Account Number (9 to 18 digits, including Devanagari digits)
        if (!BACCOUTNO || !/^([0-9\u0966-\u096F]{9,18})$/.test(BACCOUTNO)) {
            Swal.fire({
                icon: "error",
                title: "वैधता त्रुटी",
                text: "खाते क्रमांक 9 ते 18 अंकांचा असावा (इंग्रजी किंवा मराठी अंक).",
                allowOutsideClick: false,
                allowEscapeKey: false,
            }).then(() => {
                BACCOUTNORef.current.focus();
            });
            return;
        }

        // Validate IFSC Code (Format: ABCD0123456)
        if (!BIFSCCODE || !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(BIFSCCODE)) {
            Swal.fire({
                icon: "error",
                title: "वैधता त्रुटी",
                text: "IFSC कोड हा ABCD0123456 अशा स्वरूपात असावा.",
                allowOutsideClick: false,
                allowEscapeKey: false,
            }).then(() => {
                BIFSCCODERef.current.focus();
            });
            return;
        }

        // Validate Branch Name
        if (!BBRANCHNAME || !nameRegex.test(BBRANCHNAME)) {
            Swal.fire({
                icon: "error",
                title: "वैधता त्रुटी",
                text: "शाखेचे नाव 3 ते 50 अक्षरांचे असावे, फक्त अक्षरे आणि रिकाम्या जागा असाव्यात.",
                allowOutsideClick: false,
                allowEscapeKey: false,
            }).then(() => {
                BBRANCHNAMERef.current.focus();
            });
            return;
        }

        // Validate Accountant Name
        if (!BACOUNTANTNAME || !nameRegex.test(BACOUNTANTNAME)) {
            Swal.fire({
                icon: "error",
                title: "वैधता त्रुटी",
                text: "खातेदार नाव वैध असावे (फक्त अक्षरे आणि रिकाम्या जागा, 3 ते 50 अक्षरांत).",
                allowOutsideClick: false,
                allowEscapeKey: false,
            }).then(() => {
                BACOUNTANTNAMERef.current.focus();
            });
            return;
        }

        // ✅ All validations passed
        handleSubmit(e);
    };

    const MySwal = withReactContent(Swal);
    const showConfirmationAlert = (e) => {
        MySwal.fire({
            title: "तुम्हाला खात्री आहे का?",
            text: "ही माहिती सेव्ह करायची आहे का?",
            showCancelButton: true,
            confirmButtonColor: "#00ff00",
            confirmButtonText: "सेव्ह करा",
            cancelButtonColor: "#092C4C",
            cancelButtonText: "रद्द करा",
            allowOutsideClick: false,
            allowEscapeKey: false,

        }).then((result) => {
            if (result.isConfirmed) {
                handleFormSubmission(e);
            }
        });
    };

    const showExitAlert = () => {
        MySwal.fire({
            title: "तुम्हाला खात्री आहे का?",
            text: "तुम्हाला नक्की बाहेर पडायचे आहे का?",
            showCancelButton: true,
            confirmButtonColor: "#00ff00",
            confirmButtonText: "हो",
            cancelButtonColor: "#092C4C",
            cancelButtonText: "नाही",
            allowOutsideClick: false,
            allowEscapeKey: false,

        }).then((result) => {
            if (result.isConfirmed) {
                navigate(route.BankDetails)
            }
        });
    };

    const handleFormSubmission = async () => {
        try {
            const payload = {
                "bankid": BANKID ? BANKID : GUID,
                "bankname": formData.BANKNAME,
                "baccoutno": formData.BACCOUTNO,
                "bifsccode": formData.BIFSCCODE,
                "bbranchname": formData.BBRANCHNAME,
                "bacountantname": formData.BACOUNTANTNAME,
                "bstatus": formData.BSTATUS,
                "blazar": formData.BLAZAR,
                "date": "",
                "companyid": userdetail?.companyID ? userdetail.companyID : "",
                "deptid": userdetail?.departmentID ? userdetail.departmentID : "",
                uaid: userdetail?.uaid || "",
            };

            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            const response = await axios({
                method: "POST",
                url: baseUrl.Url + "/backend/api/SP_AddUpdBankDetails",
                data: JSON.stringify(payload),
                headers: headers,
            });

            console.log("Response Received:", response.data);
            Swal.fire({
                icon: "success",
                title: "सेव झाले!",
                text: "डेटा यशस्वीरीत्या सेव्ह केला गेला आहे.",
                confirmButtonText: "ठीक आहे",
                allowOutsideClick: false,
                allowEscapeKey: false,

            });

            setFormData({
                BANKID: '',
                BANKNAME: '',
                BACCOUTNO: '',
                BIFSCCODE: '',
                BBRANCHNAME: '',
                BACOUNTANTNAME: '',
                BSTATUS: '',
                BLAZAR: ''
            });
            navigate(route.BankDetails);
        } catch (error) {
            console.error("Submission Error:", error);
            Swal.fire({
                icon: "error",
                title: "त्रुटी",
                text: "डेटा सेव्ह करण्यात अयशस्वी. कृपया पुन्हा प्रयत्न करा.",
                confirmButtonText: "ठीक आहे",
                allowOutsideClick: false,
                allowEscapeKey: false,

            });
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            if (BANKID) {
                try {
                    const payload = {
                        bankid: BANKID,
                        keyword: "%",
                        companyid: "",
                        deptid: "",
                    };

                    const headers = {
                        "Content-Type": "application/json",
                        Accept: "*/*",
                    };

                    // Make the API request with async/await
                    const response = await axios({
                        method: "POST",
                        url: baseUrl.Url + "/backend/api/GET_GateBankDetails",
                        data: JSON.stringify(payload),
                        headers: headers,
                    });

                    if (response.status !== 200) {
                        throw new Error("Failed to Fetch bank Data");
                    }

                    let apiData = response.data[0];

                    setFormData((prev) => ({
                        ...prev,
                        BANKID: apiData.bankid,
                        BANKNAME: apiData.bankname,
                        BACCOUTNO: apiData.baccoutname,
                        BIFSCCODE: apiData.bifsccode,
                        BBRANCHNAME: apiData.bbranchname,
                        BACOUNTANTNAME: apiData.bacountantname,
                        // BSTATUS: status.find((status) => status.value == apiData.bstatus)?.label || "",
                        BSTATUS: apiData.bstatus,
                        BDSTATUS: apiData.status,
                        BLAZAR: apiData.blazar

                    }));


                } catch (error) {
                    console.error("Error fetching Access Right Data:", error);
                }
            }
        };

        fetchData();
    }, [BANKID]);


    const handleEnterKey = (e, nextRef) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (nextRef && nextRef.current) {
                nextRef.current.focus();
            }
        }
    };

    const [relid, setSelectedRelid] = useState([]);

    const [jamaname, setIamaame] = useState([]);
    useEffect(() => {
        const fetchLazar = async () => {
            try {
                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };

                const payload = {

                };

                const response = await axios.post(
                    `${baseUrl.Url}/backend/api/GET_AccountACCTM`,
                    payload,
                    { headers }
                );
                if (response.status !== 200)
                    throw new Error("Failed to fetch vendor data");
                console.log("requisition setails", response.data)
                const data = response.data;
                const lazarData = data
                    .map(({ acctm, sglrpid, relid }) => ({
                        label: acctm,
                        value: sglrpid,
                        name: relid
                    }));

                setIamaame(lazarData);
            } catch (error) {
                console.error("Error fetching vendor data:", error);
            }
        };
        fetchLazar();
    }, []);







    return (
        <div className="page-wrapper">
            <div className="content">
                <div className="page-header">
                    <div className="add-item d-flex">
                        <div className="page-title">
                            <h4>बँक तपशील</h4>
                            <h6>बँक माहिती भरा</h6>
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
                        <Link to={route.BankDetails} className="btn btn-secondary">
                            <ArrowLeft className="me-2" />
                            मागे
                        </Link>
                    </div>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="card">
                        <div className="card-body add-product mbgcolor">
                            <div className="accordion-card-one accordion" id="accordionExample">
                                <div className="accordion-item">

                                    <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                                        <div className="accordion-body mbgcolor">
                                            <div
                                                className="accordion-card-one accordion"
                                                id="accordionExample2"
                                            >
                                                <div
                                                    className="accordion-card-one accordion"
                                                    id="accordionExample"
                                                >
                                                    <div className="accordion-item mbgcolor">
                                                        <div className="accordion-header" id="headingTwo">
                                                            <div
                                                                className=""
                                                                data-bs-toggle="collapse"
                                                                data-bs-target="#collapseOne"
                                                                aria-controls="collapseOne"
                                                            >
                                                                <div className="addproduct-icon">
                                                                    <h5 >
                                                                        <Info className="add-info" />

                                                                        <span>बँक माहिती </span>
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
                                                            aria-labelledby="headingTwo"
                                                            data-bs-parent="#accordionExample"
                                                        >
                                                            <div className="accordion-body">

                                                                <div className="row">
                                                                    <div className="col-lg-6 col-sm-6 col-12">
                                                                        <div className="mb-3 add-product">
                                                                            <label className="form-label required">बँकेचे नाव</label>
                                                                            <input
                                                                                type="text"
                                                                                className="form-control"
                                                                                ref={BANKNAMERef}
                                                                                name="BANKNAME"
                                                                                value={formData.BANKNAME}
                                                                                onChange={handleChange}
                                                                                pattern="^(?!\s)([A-Za-z0-9\u0900-\u097F\s]{3,50})(?<!\s)$"
                                                                                title=" बँकेचे नाव फक्त अक्षरे असू शकतात."
                                                                                onKeyDown={(e) => handleEnterKey(e, BACCOUTNORef)}
                                                                                required
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-lg-6 col-sm-6 col-12">
                                                                        <div className="mb-3 add-product">
                                                                            <label className="form-label required">खाते क्रमांक</label>
                                                                            <input
                                                                                type="text"
                                                                                className="form-control"
                                                                                ref={BACCOUTNORef}
                                                                                name="BACCOUTNO"
                                                                                value={formData.BACCOUTNO}
                                                                                onChange={handleChange}
                                                                                pattern="^[0-9\u0966-\u096F]{9,18}$"
                                                                                title="बँक खात्याचा क्रमांक ९ ते १८ अंकांच्या दरम्यान असावा."
                                                                                onKeyDown={(e) => handleEnterKey(e, BIFSCCODERef)}
                                                                                required
                                                                            />

                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="row">
                                                                    <div className="col-lg-6 col-sm-6 col-12">
                                                                        <div className="mb-3 add-product">
                                                                            <label className="form-label required">IFSC कोड</label>
                                                                            <input
                                                                                type="text"
                                                                                className="form-control"
                                                                                ref={BIFSCCODERef}
                                                                                name="BIFSCCODE"
                                                                                value={formData.BIFSCCODE}
                                                                                onChange={handleChange}
                                                                                pattern="^[A-Z]{4}0[A-Z0-9]{6}$"
                                                                                title="IFSC कोड ११ अक्षरांचा असावा, ज्याची सुरुवात ४ मोठ्या अक्षरांपासून होईल, त्यानंतर ० असेल आणि शेवटी ६ अल्फान्यूमेरिक अक्षरे असावीत."
                                                                                onKeyDown={(e) => handleEnterKey(e, BBRANCHNAMERef)}
                                                                                required
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-lg-6 col-sm-6 col-12">
                                                                        <div className="mb-3 add-product">
                                                                            <label className="form-label required">शाखेचे नाव</label>
                                                                            <input
                                                                                type="text"
                                                                                className="form-control"
                                                                                ref={BBRANCHNAMERef}
                                                                                name="BBRANCHNAME"
                                                                                value={formData.BBRANCHNAME}
                                                                                onChange={handleChange}
                                                                                pattern="^(?!\s)([A-Za-z0-9\u0900-\u097F\s]{3,50})(?<!\s)$"
                                                                                title="शाखेचे नाव फक्त अक्षरे असावीत, आणि त्याची लांबी ३ ते ५० अक्षरे असावी."
                                                                                onKeyDown={(e) => handleEnterKey(e, BACOUNTANTNAMERef)}
                                                                                required
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-lg-6 col-sm-6 col-12">
                                                                        <div className="mb-3 add-product">
                                                                            <label className="form-label required">खातेदार नाव</label>
                                                                            <input
                                                                                type="text"
                                                                                className="form-control"
                                                                                ref={BACOUNTANTNAMERef}
                                                                                name="BACOUNTANTNAME"
                                                                                value={formData.BACOUNTANTNAME}
                                                                                onChange={handleChange}
                                                                                pattern="^(?!\s)([A-Za-z0-9\u0900-\u097F\s]{3,50})(?<!\s)$"
                                                                                title="नाव फक्त अक्षरे असू शकतात."
                                                                                onKeyDown={(e) => handleEnterKey(e, BLAZARRef)}
                                                                                required
                                                                            />
                                                                        </div>
                                                                    </div>

                                                                    <div className="col-lg-6 col-sm-6 col-12">
                                                                        <div className=" add-product">
                                                                            <label className="form-label">लेजर</label>
                                                                            <Select
                                                                                classNamePrefix="react-select"
                                                                                options={jamaname}
                                                                                placeholder="निवडा"
                                                                                name="BLAZAR"
                                                                                ref={BLAZARRef}
                                                                                value={jamaname.find(option => option.value === formData.BLAZAR) || null}
                                                                                onChange={(selectedOption) => {
                                                                                    setSelectedRelid(selectedOption?.name || "")
                                                                                    setFormData(prevState => ({
                                                                                        ...prevState,
                                                                                        BLAZAR: selectedOption ? selectedOption.value : '',
                                                                                    }));
                                                                                    if (StatusRef.current) {
                                                                                        StatusRef.current.focus();
                                                                                    }
                                                                                }}
                                                                            />
                                                                        </div>
                                                                    </div>


                                                                </div>

                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="row justify-content-end ">
                                                    <div className="col-lg-6 col-sm-6 col-12">
                                                        <label className="form-label required">स्टेटस</label>
                                                        <div className="add-product">
                                                            <Select
                                                                classNamePrefix="react-select"
                                                                name="BSTATUS"
                                                                options={status}
                                                                ref={StatusRef}
                                                                placeholder="Choose"
                                                                value={status.find((option) => option.value === formData.BSTATUS) || null}
                                                                // onChange={handleSelectChange}
                                                                onChange={(selectedOption) => {
                                                                    setFormData((prevData) => ({
                                                                        ...prevData,
                                                                        BSTATUS: selectedOption ? selectedOption.value : "",
                                                                    }));
                                                                    if (SubmitRef.current) {
                                                                        SubmitRef.current.focus();
                                                                    }

                                                                }}
                                                                required
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>

                                            {/* Buttons */}
                                            <div className="col-lg-12 mt-2">
                                                <div className="btn-addproduct mb-4">
                                                    <button type="button" className="btn btn-cancel me-2"
                                                        onClick={showExitAlert}>
                                                        रद्द करा
                                                    </button>
                                                    <button type="submit" className="btn btn-submit"
                                                        ref={SubmitRef}>
                                                        जतन करा
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
            </div>
        </div>
    );
};

export default AddBankDetails;

