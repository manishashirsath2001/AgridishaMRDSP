import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Select from "react-select";
import { ChevronDown, ChevronUp, Info, ArrowLeft } from "feather-icons-react/build/IconComponents";
import { useDispatch, useSelector } from "react-redux";
import { setToogleHeader } from "../../core/redux/action";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { all_routes } from "../../Router/all_routes";
import { ACSPLGUID, baseUrl } from "../../core/json/custom";
import axios from 'axios';
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { use } from "react";

const AddHSNMaster = () => {
    const GUID = ACSPLGUID.getNew()
    const navigate = useNavigate();
    const location = useLocation();
    const { HAID } = location.state || {};
    console.log("HAID", HAID)
    const route = all_routes;
    const dispatch = useDispatch();
    const data = useSelector((state) => state.toggle_header);
    const HTYPEref = useRef(null);
    const HCODERef = useRef(null);
    const IGSTRef = useRef(null);
    const SGSTRef = useRef(null);
    const CGSTRef = useRef(null);
    const CESSRef = useRef(null);
    // const HRATERef = useRef(null);
    const HDESCRIPTIONRef = useRef(null);
    const [implications, setImplications] = useState({
        hsnTypes: [],

    });
    const [formData, setFormData] = useState({
        HTYPE: "",
        HCODE: "",
        HDESCRIPTION: "",
        IGST: "",
        SGST: "",
        CGST: "",
        CESS: "",
    });




    useEffect(() => {
        HTYPEref.current?.focus();
        const fetchImplications = async () => {
            try {

                const response = await axios.get(
                    baseUrl.Url + "/backend/api/Implications/HSNTYPE",
                );

                if (response.status != 200)
                    throw new Error("Failed to fetch social media data");

                const data = await response.data;

                const hsnTypes = data
                    .filter((item) => item.iGroup === "HSNTYPE")
                    .map(({ iTitle, iValue }) => ({
                        label: iTitle,
                        value: iValue,
                    }));

                setImplications({
                    hsnTypes,

                });
            } catch (error) {
                console.error("Error fetching implications:", error);
            }
        };

        fetchImplications();
    }, []);


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
    }, [formData, navigate, route.HSNMaster]);

    const checkFormValidity = (e) => {
        const { HCODE, HTYPE, HDESCRIPTION } = formData;

        if (!HTYPE || HTYPE === "choose") {
            Swal.fire({
                icon: "error",
                title: "चुकिचे मूल्य",
                text: "कृपया वैध प्रकार निवडा.",
                allowOutsideClick: false,
                allowEscapeKey: false,
            }).then(() => {
                HTYPEref.current?.focus();
            });
            return;
        }

        if (!HCODE || !/^\d{4,8}$/.test(HCODE)) {
            Swal.fire({
                icon: "error",
                title: "चुकिचे मूल्य",
                text: "HSN कोड हा 4, 6 किंवा 8 अंकी संख्या असावी.",
                allowOutsideClick: false,
                allowEscapeKey: false,
            }).then(() => {
                HCODERef.current?.focus();
            });
            return;
        }

        // if (!/^([0-9]{1,2}(\.\d{1,2})?|100(\.00)?)$/.test(HRATE)) {
        //     Swal.fire({
        //         icon: "error",
        //         title: "Validation Error",
        //         text: "GST Rate must be a number between 0 and 100 with up to two decimal places.",
        //     }).then(() => {
        //         HRATERef.current?.focus();
        //     });
        //     return;
        // }

        // if (!/^([0-9]{1,2}(\.\d{1,2})?|100(\.00)?)$/.test(HRATE)) {
        //     Swal.fire({
        //         icon: "error",
        //         title: "Validation Error",
        //         text: "GST Rate must be a number between 0 and 100 with up to two decimal places.",
        //     }).then(() => {
        //         HRATERef.current?.focus();
        //     });
        //     return;
        // }

        // if (!/^([0-9]{1,2}(\.\d{1,2})?|100(\.00)?)$/.test(HRATE)) {
        //     Swal.fire({
        //         icon: "error",
        //         title: "Validation Error",
        //         text: "GST Rate must be a number between 0 and 100 with up to two decimal places.",
        //     }).then(() => {
        //         HRATERef.current?.focus();
        //     });
        //     return;
        // }

        // if (!/^([0-9]{1,2}(\.\d{1,2})?|100(\.00)?)$/.test(HRATE)) {
        //     Swal.fire({
        //         icon: "error",
        //         title: "Validation Error",
        //         text: "GST Rate must be a number between 0 and 100 with up to two decimal places.",
        //     }).then(() => {
        //         HRATERef.current?.focus();
        //     });
        //     return;
        // }

        if (!HDESCRIPTION) {
            Swal.fire({
                icon: "error",
                title: "चुकिचे मूल्य",
                text: "वर्णन 60 अक्षरांपेक्षा जास्त नसावे.",
                allowOutsideClick: false,
                allowEscapeKey: false,
            }).then(() => {
                HDESCRIPTIONRef.current?.focus();
            });
            return;
        }

        handleSubmit(e);

    };



    useEffect(() => {
        if (HAID) {
            const fetchData = async () => {
                try {
                    const payload = {
                        "pkid": HAID
                        , "keyword": "%"
                    }
                    const headers = {
                        "Content-Type": "application/json",
                        Accept: "*/*",
                    };

                    axios({
                        method: "POST",
                        url: baseUrl.Url + "/backend/api/_GET_HSNMasters_/getByID",
                        data: JSON.stringify(payload),
                        headers: headers,
                    })
                        .then((response) => {
                            if (response.status != 200) throw new Error("Failed to send otp");
                            const Hdata = response.data[0];
                            setFormData({
                                HCODE: Hdata.hcode,
                                HTYPE: Hdata.htype,
                                HDESCRIPTION: Hdata.hdescription,
                                IGST: Hdata.higst,
                                SGST: Hdata.hsgst,
                                CGST: Hdata.hcgst,
                                CESS: Hdata.hcess,
                            });
                        })

                } catch (error) {
                    console.error("Error fetching HSN data:", error);
                }

            };
            fetchData();
        }
    }, [HAID]);

    // const types = [
    //     { value: "choose", label: "Choose" },
    //     { value: "Goods", label: "Goods" },
    //     { value: "Service", label: "Service" },
    // ];

    // const handleSelectChange = (selectedOption) => {
    //     setFormData({ ...formData, HTYPE: selectedOption });
    // };

    const handleSelectChange = (selectedOption) => {
        setFormData((prevData) => ({
            ...prevData,
            HTYPE: selectedOption ? selectedOption.value : "",
        }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value.trimStart() });
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



    const handleFormSubmission = async () => {
        try {
            const payload = {
                "haid": HAID ? HAID : GUID,
                "hcode": formData?.HCODE || "",
                "htype": formData?.HTYPE || "",
                "hdescription": formData?.HDESCRIPTION || "",
                "higst": formData?.IGST || "",
                "hsgst": formData?.SGST || "",
                "hcgst": formData?.CGST || "",
                "hcess": formData?.CESS || ""
            };

            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            axios.post(baseUrl.Url + "/backend/api/HSNMaster", payload, { headers })
                .then(response => {
                    if (response.status === 200) {
                        Swal.fire({
                            icon: "success",
                            title: "यशस्वी!",
                            text: "डेटा यशस्वीरीत्या जतन करण्यात आला आहे",
                            confirmButtonText: "OK",
                            allowOutsideClick: false,
                            allowEscapeKey: false,
                        }).then(() => {
                            navigate(route.HSNMaster);
                        });
                    } else {
                        Swal.fire({
                            icon: "error",
                            title: "त्रुटी",
                            text: `अनपेक्षित प्रतिसाद स्थिती: ${response.status}`,
                            allowOutsideClick: false,
                            allowEscapeKey: false,

                        });
                    }
                })
                .catch(error => {
                    console.error("Submission Error:", error);
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: "डेटा जतन करण्यात अयशस्वी. कृपया पुन्हा प्रयत्न करा.",
                        allowOutsideClick: false,
                        allowEscapeKey: false,

                    });
                });

        } catch (error) {
            console.error("Unexpected Error:", error);
            Swal.fire({
                icon: "error",
                title: "त्रुटी",
                text: "काहीतरी चूक झाली. कृपया पुन्हा प्रयत्न करा.",
                allowOutsideClick: false,
                allowEscapeKey: false,

            });
        }


    };
    const MySwal = withReactContent(Swal);

    const showConfirmationAlert = (event) => {
        MySwal.fire({
            title: "आपणास खात्री आहे का?",
            text: "आपण ही माहिती जतन करू इच्छिता?",
            showCancelButton: true,
            confirmButtonColor: "#00ff00",
            confirmButtonText: "जतन करा",
            cancelButtonColor: "#092C4C",
            cancelButtonText: "रद्द करा",
            allowOutsideClick: false,
            allowEscapeKey: false,
        }).then((result) => {
            if (result.isConfirmed) {
                handleFormSubmission(event); // माहिती साठवा
            }
        });
    };

    const showExitAlert = () => {
        MySwal.fire({
            title: "आपणास खात्री आहे का?",
            text: "आपण प्रणालीमधून बाहेर पडू इच्छिता?",
            showCancelButton: true,
            confirmButtonColor: "#00ff00",
            confirmButtonText: "होय",
            cancelButtonColor: "#092C4C",
            cancelButtonText: "नाही",
            allowOutsideClick: false,
            allowEscapeKey: false,
        }).then((result) => {
            if (result.isConfirmed) {
                navigate(route.HSNMaster);
            }
        });
    };

    const handleKeyDown = (e, nextInputRef) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (nextInputRef && nextInputRef.current) {
                nextInputRef.current.focus();
            }
        }
    };
    return (
        <div className="page-wrapper">
            <div className="content">
                <div className="page-header">
                    <div className="add-item d-flex">
                        <div className="page-title">
                            <h4 className="mb-1">HSN मास्टर व्यवस्थापित करा</h4>
                            {/* <h6>Create HSN Master</h6> */}
                        </div>
                    </div>
                    <ul className="table-top-head">
                        <li>
                            <OverlayTrigger placement="top" overlay={<Tooltip>कोलॅप्स करा</Tooltip>}>
                                <Link
                                    data-bs-toggle="tooltip"
                                    data-bs-placement="top"
                                    title="कोलॅप्स करा"
                                    id="collapse-header"
                                    className={data ? "active" : ""}
                                    onClick={() => dispatch(setToogleHeader(!data))}
                                >
                                    <ChevronUp className="feather-chevron-up" />
                                </Link>
                            </OverlayTrigger>
                        </li>
                    </ul>
                    <div className="page-btn">
                        <Link to={route.HSNMaster} className="btn btn-secondary">
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
                                                    <span>HSN मास्टर</span>
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
                                                <div className="col-lg-3 col-sm-6 col-12 mb-3">
                                                    <div className="mb-3 add-hsn">
                                                        <label className="form-label required">प्रकार</label>
                                                        <Select
                                                            classNamePrefix="react-select"
                                                            options={implications.hsnTypes}
                                                            name="HTYPE"
                                                            ref={HTYPEref}
                                                            onKeyDown={(e) => handleKeyDown(e, HCODERef)}
                                                            placeholder="निवडा "
                                                            value={implications.hsnTypes.find((option) => option.value === formData.HTYPE)}
                                                            onChange={handleSelectChange}
                                                            required
                                                            openMenuOnFocus={true}
                                                        />
                                                    </div>
                                                </div>
                                                {/* HSN Code */}
                                                <div className="col-lg-3 col-sm-6 col-12 mb-3">
                                                    <div className="mb-3 add-product">
                                                        <label className="form-label required">HSN कोड</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            placeholder="Enter HSN Code"
                                                            name="HCODE"
                                                            ref={HCODERef}
                                                            onKeyDown={(e) => handleKeyDown(e, IGSTRef)}
                                                            value={formData.HCODE}
                                                            onChange={handleInputChange}
                                                            pattern="^\d{4,8}$"
                                                            title="HSN कोड ४, ६ किंवा ८ अंकांचा असावा."
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            {/* GST Rate */}
                                            {/* <div className="row">
                                                <div className="col-form-label col-md-12">
                                                    <label className="form-label required">GST Rate (%)</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Enter GST Rate (e.g., 18.00)"
                                                        name="HRATE"
                                                        ref={HRATERef}
                                                        value={formData.HRATE}
                                                        onChange={handleInputChange}
                                                        pattern="^([0-9]{1,2}(\.\d{1,2})?|100(\.00)?)$"
                                                        title="GST Rate must be a number between 0 and 100 with up to two decimal places."
                                                        required
                                                    />
                                                </div>
                                            </div> */}
                                            <div className="row">
                                                <div className="col-lg-3 col-md-3 col-sm-6 col-12">
                                                    <label className="form-label">IGST</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="IGST"
                                                        placeholder="IGST प्रविष्ट करा"
                                                        ref={IGSTRef}
                                                        onKeyDown={(e) => handleKeyDown(e, SGSTRef)}
                                                        value={formData.IGST}
                                                        onChange={handleInputChange}
                                                        pattern="^(100(\.00)?|([1-9]?\d)(\.\d{1,2})?)$"
                                                        title="IGST दर ० ते १०० दरम्यान असावा, दोन दशांश स्थानांसह."

                                                    />
                                                </div>

                                                <div className="col-lg-3 col-md-3 col-sm-6 col-12">
                                                    <div className="mb-3 add-product form-label ">
                                                        <label className="form-label">SGST</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            name="SGST"
                                                            placeholder="SGST दर प्रविष्ट करा"
                                                            value={formData.SGST}
                                                            ref={SGSTRef}
                                                            onKeyDown={(e) => handleKeyDown(e, CGSTRef)}
                                                            onChange={handleInputChange}
                                                            pattern="^(100(\.00)?|([1-9]?\d)(\.\d{1,2})?)$"
                                                            title="SGST दर ० ते १०० दरम्यान असावा, दोन दशांश स्थानांसह."

                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-lg-3 col-md-3 col-sm-6 col-12">
                                                    <div className="mb-3 add-product form-label">
                                                        <label className="form-label">CGST</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            name="CGST"
                                                            placeholder="CGST दर प्रविष्ट करा"
                                                            ref={CGSTRef}

                                                            onKeyDown={(e) => handleKeyDown(e, CESSRef)}
                                                            value={formData.CGST}
                                                            onChange={handleInputChange}
                                                            pattern="^(100(\.00)?|([1-9]?\d)(\.\d{1,2})?)$"
                                                            title="CGST दर ० ते १०० दरम्यान असावा, दोन दशांश स्थानांसह."

                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-lg-3 col-md-3 col-sm-6 col-12">
                                                    <div className="mb-3 add-product form-label">
                                                        <label className="form-label">CESS</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            name="CESS"
                                                            placeholder="CESS दर प्रविष्ट करा"
                                                            ref={CESSRef}
                                                            onKeyDown={(e) => handleKeyDown(e, HDESCRIPTIONRef)}
                                                            value={formData.CESS}
                                                            onChange={handleInputChange}
                                                            pattern="^(100(\.00)?|([1-9]?\d)(\.\d{1,2})?)$"
                                                            title="CESS दर ० ते १०० दरम्यान असावा, दोन दशांश स्थानांसह."

                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mb-3 row">
                                                <div className="col-form-label col-md-12">
                                                    <label htmlFor="description" className="form-label required">वर्णन </label>
                                                    <textarea
                                                        id="description"
                                                        className="form-control h-90"
                                                        rows={4}
                                                        placeholder="वर्णन प्रविष्ट करा (कमाल ६० अक्षरे)"
                                                        name="HDESCRIPTION"
                                                        ref={HDESCRIPTIONRef}
                                                        value={formData.HDESCRIPTION}
                                                        onChange={handleInputChange}
                                                        maxLength="60"
                                                        required
                                                        title="वर्णन ६० अक्षरे पार न करण्याची आवश्यकता आहे."
                                                        onKeyDown={(e) => {
                                                            const isDropdownOpen = document.activeElement.getAttribute('aria-expanded') === 'true';
                                                            if (e.key === 'Enter' && !isDropdownOpen) {
                                                                e.preventDefault();

                                                                showConfirmationAlert(e);
                                                            }
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-12">
                                <div className="btn-addproduct mb-4">
                                    <button type="button"
                                        onClick={showExitAlert}
                                        className="btn btn-cancel me-2">
                                        मागे
                                    </button>
                                    <button type="submit" className="btn btn-submit">
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

export default AddHSNMaster;
