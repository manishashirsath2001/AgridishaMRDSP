import React, { useRef, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Select from "react-select";
import { all_routes } from "../../Router/all_routes";
// import { setToogleHeader } from "../../core/redux/action";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { setToogleHeader } from "../../core/redux/action";
import { ACSPLGUID, baseUrl } from "../../core/json/custom";
import axios from 'axios';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useLocation } from 'react-router-dom';
import { getUserData } from "../../Context/UserData";

import {
    ArrowLeft,
    ChevronUp,
    Info,

} from "feather-icons-react/build/IconComponents";
// import AddProduct from "./AddItem";
const Service = () => {
    const { isAuthenticated, userdetail } = getUserData();
    const location = useLocation();
    const { SAID } = location.state || {};
    const route = all_routes;
    const dispatch = useDispatch();
    const GUID = ACSPLGUID.getNew()
    const navigate = useNavigate();
    const [hsnType, sethsnType] = useState([]);
    const [hsnInput, sethsnInput] = useState("");
    const [serviceOptions, setserviceOptions] = useState([]);
    const [categories, setcategorydata] = useState([]);
    const [subcategory, setsubcategorydata] = useState([]);
    const data = useSelector((state) => state.toggle_header);
    const renderCollapseTooltip = (props) => (
        <Tooltip id="refresh-tooltip" {...props}>
            Collapse
        </Tooltip>
    );

    if (isAuthenticated == true) {
        console.log("user", userdetail);
        console.log("getUserData", getUserData);
    }

    // useEffect(() => {
    //     const fetchHsnCode = async () => {


    //     };

    //     fetchHsnCode();
    // }, []);
    // const serviceOptions = [

    //     { value: "Service1", label: "Service 1" },
    //     { value: "Service2", label: "Service 2" },
    //     { value: "Service3", label: "Service 3" },
    // ];

    // const [showModal, setShowModal] = useState(false);// Default to save data
    // const [showModalsub, setShowModalsub] = useState(false);//  Add category
    const [formData, setFormData] = useState({
        serviceName: "",
        service: "",
        category: "",
        subcategory: "",
        description: "",
        hsnCode: "",
        productName1: "",
        category1: "",
        importantField1: "",
        productName2: "",
        category2: "",
        importantField2: "",
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchImplications = async () => {
            try {
                const response = await axios.get(
                    baseUrl.Url + "/backend/api/Implications/SRTYPE",
                    // "http://adsvr:78/api/Implications/SOLID|LIQUID|GAS"
                );

                if (response.status !== 200) throw new Error("Failed to fetch implications data");

                const data = response.data;

                // Combine all implications into one array
                const implicationsDropdown = data.map(({ iTitle, iValue }) => ({
                    label: iTitle,
                    value: iValue,
                }));

                setserviceOptions(implicationsDropdown);
            } catch (error) {
                console.error("Error fetching implications:", error);
            }
        };
        const fetchcategory = async () => {
            try {
                const payload = {
                    "companyid": userdetail?.companyID ? userdetail.companyID : "",
                    "deptid": userdetail?.departmentID ? userdetail.departmentID : "",
                };
                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };

                axios.post(baseUrl.Url + "/backend/api/GET_CategoryDropdown", payload, { headers })
                    .then((response) => {
                        if (response.status !== 200) throw new Error("Failed fetching Service Data");
                        const data = response.data;

                        // Combine all implications into one array
                        const implicationsDropdown = data.map(({ ctid, categoryname }) => ({
                            label: categoryname,
                            value: ctid,
                        }));

                        setcategorydata(implicationsDropdown);
                    });
            } catch (error) {
                console.error("Error fetching Service Data:", error);
            }
        };
        const fetchsubcategory = async () => {
            try {
                const payload = {
                    "ctid": '%',
                    "companyid": userdetail?.companyID ? userdetail.companyID : "",
                    "deptid": userdetail?.departmentID ? userdetail.departmentID : "",
                };
                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };

                axios.post(baseUrl.Url + "/backend/api/GET_SubCategoryDropdown", payload, { headers })
                    .then((response) => {
                        if (response.status !== 200) throw new Error("Failed fetching Service Data");
                        const data = response.data;

                        // Combine all implications into one array
                        const implicationsDropdown = data.map(({ ctid, categoryname }) => ({
                            label: categoryname,
                            value: ctid,
                        }));

                        setsubcategorydata(implicationsDropdown);
                    });
            } catch (error) {
                console.error("Error fetching Service Data:", error);
            }
        };
        fetchsubcategory();
        fetchcategory();
        fetchImplications();
    }, []);

    useEffect(() => {
        if (SAID) {
            const fetchData = async () => {
                try {
                    const payload = {
                        "pkid": SAID,
                        "keyword": "%",
                        "companyid": userdetail?.companyID ? userdetail.companyID : "",
                        "deptid": userdetail?.departmentID ? userdetail.departmentID : "",
                    };
                    const headers = {
                        "Content-Type": "application/json",
                        Accept: "*/*",
                    };

                    axios.post(baseUrl.Url + "/backend/api/_GET_ServicesMaster_/getByID", payload, { headers })
                        .then((response) => {
                            if (response.status !== 200) throw new Error("Failed fetching Service Data");
                            const DATA = response.data[0];

                            setFormData({
                                serviceName: DATA.sname,
                                service: DATA.stype,
                                category: DATA.scategory,
                                subcategory: DATA.ssubcategory,
                                description: DATA.sdescription,
                                hsnCode: DATA.shsn, // Set HSN Code in formData
                                productName1: "",
                                category1: "",
                                importantField1: "",
                                productName2: "",
                                category2: "",
                                importantField2: "",
                            });

                            // Set HSN Code in input field and fetch dropdown options
                            if (DATA.shsn) {
                                sethsnInput(DATA.shsn);
                                HSNhandleChange(DATA.shsn, true); // Fetch HSN options & pre-select in dropdown
                            }
                        });
                } catch (error) {
                    console.error("Error fetching Service Data:", error);
                }
            };
            fetchData();
        }
    }, [SAID]);




    // const categories = {
    //     Technology: ["Software", "Hardware", "Networking"],
    //     Healthcare: ["Hospital", "Pharmacy", "Diagnostic Services"],
    //     Education: ["School", "University", "Online Courses"],
    // };
    const firstInputRef = useRef(null); // Reference to the first input
    useEffect(() => {
        if (firstInputRef.current) {
            firstInputRef.current.focus();
        }
    }, []);

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();

            const form = e.target.form;

            if (!form) {
                console.warn("Form not found.");
                return;
            }


            const focusableElements = Array.from(form.querySelectorAll("input, select, textarea, button:not([disabled]):not([readonly])"));


            const currentIndex = focusableElements.indexOf(e.target);


            if (currentIndex !== -1 && currentIndex + 1 < focusableElements.length) {
                focusableElements[currentIndex + 1].focus();
            } else {
                focusableElements[0].focus();
            }
        }
    };

    const handleChange = (input) => {
        if (input?.value) {
            // If it's a react-select input (dropdown)
            setFormData((prev) => ({
                ...prev,
                hsnCode: input.value,
            }));
        } else if (input.target) {
            // If it's a regular input (e.target)
            const { name, value } = input.target;

            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));

            // Remove error for the field if it exists
            if (value && errors[name]) {
                const updatedErrors = { ...errors };
                delete updatedErrors[name];
                setErrors(updatedErrors);
            }

            // Handle specific logic for the 'category' field
            if (name === "category") {
                setFormData((prev) => ({
                    ...prev,
                    category: value,
                    subcategory: "", // Reset subcategory when category changes
                }));
            }
        }
    };
    const HSNhandleChange = (HSNCODE, isEdit = false) => {
        if (HSNCODE === "") {
            sethsnType([]); // Clear the dropdown if input is empty
        } else {
            try {
                const payload = { "keyword": HSNCODE };
                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };

                axios.post(baseUrl.Url + "/backend/api/GET_HSNCode", payload, { headers })
                    .then((response) => {
                        const data = response.data;
                        const hsnTypeOptions = data.map(({ hcode, haid }) => ({
                            label: hcode,
                            value: haid,
                        }));
                        sethsnType(hsnTypeOptions);

                        // Pre-select HSN Code in dropdown when editing
                        if (isEdit) {
                            const selectedOption = hsnTypeOptions.find(option => option.label === HSNCODE);
                            setFormData(prevData => ({
                                ...prevData,
                                hsnCode: selectedOption ? selectedOption.value : "",
                            }));
                        }

                        console.log('HSN Response Data:', response.data);
                    })
                    .catch((error) => {
                        console.error('Error fetching HSN Code:', error);
                    });

            } catch (error) {
                console.error('API call error:', error);
            }
        }
    };



    const handleSubmitsave = (event) => {
        event.preventDefault();
        showConfirmationAlert(event);
    };

    const handleFormSubmission = async () => {
        // try {
        //     const payload = {
        //         "said": SAID ? SAID : GUID,
        //         "scode": "",
        //         "sname": formData.serviceName,
        //         "stype": formData.service,
        //         "sdescription": formData.description,
        //         "scategory": formData.category,
        //         "ssubcategory": formData.subcategory,
        //         "shsn": formData.hsnCode,
        //         "companyid": userdetail?.companyID ? userdetail.companyID : "",
        //         "deptid": userdetail?.departmentID ? userdetail.departmentID : "",
        //     };
        //     console.log("data payload", payload);

        //     const headers = {
        //         "Content-Type": "application/json",
        //         Accept: "*/*",
        //     };

        //     axios({
        //         method: "POST",
        //         url: baseUrl.Url + "/backend/api/ServiceMaster",
        //         data: JSON.stringify(payload),
        //         headers: headers,
        //     })
        //     // console.log("API Response:", response.data);

        //     Swal.fire({
        //         icon: "success",
        //         title: "Saved!",
        //         text: "Data saved successfully.",
        //         confirmButtonText: "OK",
        //     });


        //     navigate(route.ServicesMaster);
        // } catch (error) {
        //     console.error("Submission Error:", error);
        //     Swal.fire({
        //         icon: "error",
        //         title: "Error",
        //         text: "Failed to save data. Please try again.",
        //     });
        // }
        try {
            const payload = {
                "said": SAID ? SAID : GUID,
                "scode": "",
                "sname": formData.serviceName,
                "stype": formData.service,
                "sdescription": formData.description,
                "scategory": formData.category,
                "ssubcategory": formData.subcategory,
                "shsn": formData.hsnCode,
                "companyid": userdetail?.companyID ? userdetail.companyID : "",
                "deptid": userdetail?.departmentID ? userdetail.departmentID : "",
            };
            console.log("data payload", payload);

            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            axios.post(baseUrl.Url + "/backend/api/ServiceMaster", payload, { headers })
                .then(response => {
                    if (response.status === 200) {
                        Swal.fire({
                            icon: "success",
                            title: "साठवले!",
                            text: "माहिती यशस्वीरित्या सेव झाली.",
                            confirmButtonText: "ठीक आहे",
                            allowOutsideClick: false,
                            allowEscapeKey: false,
                        });

                        navigate(route.ServicesMaster);
                    }
                })
                .catch(error => {
                    console.error("Submission Error:", error);
                    Swal.fire({
                        icon: "error",
                        title: "त्रुटी",
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
                text: "काहीतरी चुकीचे झाले आहे. कृपया पुन्हा प्रयत्न करा.",
                allowOutsideClick: false,
                allowEscapeKey: false,
            });
        }


    };


    // const handleExit = () => {
    //     setFormData({
    //         serviceName: "",
    //         service: "",
    //         category: "",
    //         subcategory: "",
    //         description: "",
    //         hsnCode: "",
    //     });

    //     setErrors({}); // Clear errors

    //     console.log("Exit clicked, form reset.");
    // };

    // const handleInputChange = (e) => {
    //     const { name, value } = e.target;
    //     setFormData({
    //         ...formData,
    //         [name]: value,
    //     });
    // };
    // const handleSavemodal = () => {
    //     console.log("New Category Details:", formData);
    //     alert("New Category added!");
    //     setShowModal(false); // This line closes the modal correctly.

    //     setFormData({
    //         productName1: "",
    //         category1: "",
    //         importantField1: "",
    //     }); // Resetting the form data to its initial state.
    // };


    // const handleExitmodal = () => {
    //     setShowModal(false); // Close modal on exit
    // };


    // const handleSavemodalsub = () => {
    //     console.log("New Sub-Category Details:", formData);
    //     alert("New Sub-Category added!");
    //     // setShowModalsub(false); // Close modal after saving

    //     // Update only specific fields while preserving the rest
    //     setFormData((prevFormData) => ({
    //         ...prevFormData, // Spread previous form data
    //         productName2: "",
    //         category2: "",
    //         importantField2: "",
    //     }));
    // };

    // const handleExitmodalsub = () => {
    //     setShowModalsub(false); // Close modal on exit
    // };

    const validateinput = (e) => {
        const { serviceName, service, category, subcategory, hsnCode } = formData;

        // Validate serviceName (text input)
        if (!serviceName || !/^(?!\s*$)[a-zA-Z\s]{3,50}$/.test(serviceName)) {
            Swal.fire({
                icon: "error",
                title: "वैधता त्रुटी",
                text: "सेवा नाव 3-50 अक्षरे लांब आणि फक्त अक्षरे असावी.",
                allowOutsideClick: false,
                allowEscapeKey: false,
            }).then(() => {
                setTimeout(() => document.getElementById('serviceName').focus(), 100);
            });
            return;
        }

        // सेवा निवडा (select input)
        if (!service || service === "Select service") {
            Swal.fire({
                icon: "error",
                title: "वैधता त्रुटी",
                text: "कृपया सेवा निवडा",
                allowOutsideClick: false,
                allowEscapeKey: false,
            }).then(() => {
                setTimeout(() => document.getElementById('service').focus(), 100);
            });
            return;
        }

        // श्रेणी निवडा (select input)
        if (!category || category === "Select category") {
            Swal.fire({
                icon: "error",
                title: "वैधता त्रुटी",
                text: "कृपया श्रेणी निवडा",
                allowOutsideClick: false,
                allowEscapeKey: false,
            }).then(() => {
                setTimeout(() => document.getElementById('category').focus(), 100);
            });
            return;
        }

        // उपश्रेणी निवडा (select input)
        if (!subcategory || subcategory === "Select subcategory") {
            Swal.fire({
                icon: "error",
                title: "वैधता त्रुटी",
                text: "कृपया उपश्रेणी निवडा",
                allowOutsideClick: false,
                allowEscapeKey: false,
            }).then(() => {
                setTimeout(() => document.getElementById('subcategory').focus(), 100);
            });
            return;
        }

        // HSN कोड निवडा (select input)
        if (!hsnCode || hsnCode === "Select hsnCode") {
            Swal.fire({
                icon: "error",
                title: "वैधता त्रुटी",
                text: "कृपया HSN कोड निवडा",
                allowOutsideClick: false,
                allowEscapeKey: false,
            }).then(() => {
                setTimeout(() => document.getElementById('hsnCode').focus(), 100);
            });
            return;
        }


        handleSubmitsave(e); // Submit the form if all inputs are valid
    };



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
    }, [navigate, formData]);


    const MySwal = withReactContent(Swal);

    const showConfirmationAlert = (event) => {
        MySwal.fire({
            title: "आपण नक्कीच?",
            text: "ही माहिती जतन करू इच्छिता का?",
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
            title: "आपण नक्कीच?",
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
                navigate(route.ServicesMaster)
            }
        });
    };

    const OnCategoryChange = (selectedOption) => {
        try {
            const payload = {
                "ctid": selectedOption.value,
                "companyid": userdetail?.companyID ? userdetail.companyID : "",
                "deptid": userdetail?.departmentID ? userdetail.departmentID : "",
            };
            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            axios.post(baseUrl.Url + "/backend/api/GET_SubCategoryDropdown", payload, { headers })
                .then((response) => {
                    if (response.status !== 200) throw new Error("Failed fetching Service Data");
                    const data = response.data;

                    // Combine all implications into one array
                    const implicationsDropdown = data.map(({ ctid, categoryname }) => ({
                        label: categoryname,
                        value: ctid,
                    }));

                    setsubcategorydata(implicationsDropdown);
                });
        } catch (error) {
            console.error("Error fetching Service Data:", error);
        }
    }


    return (
        <>
            <div className="page-wrapper">
                <div className="content">
                    <div className="page-header">
                        <div className="add-item d-flex">
                            <div className="page-title">

                                <h3>सेवा व्यवस्थापन</h3>
                                {/* <h6>Create new Service</h6> */}
                            </div>
                        </div>
                        <ul className="table-top-head">
                            <li>
                                <div className="page-btn">
                                    <Link to={route.ServicesMaster} className="btn btn-secondary">
                                        <ArrowLeft className="me-2" />
                                        मागे
                                    </Link>
                                </div>
                            </li>
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
                    </div>

                    <div className="card table-list-card mbgcolor">
                        <div className="card-body ">
                            <div className="card-body p-4">
                                <form onSubmit={handleSubmitsave}>
                                    <div className="card-body add-product pb-0">
                                        <div className="accordion-card-one accordion" id="accordionExample">
                                            <div className="accordion-item mbgcolor">
                                                <div className="accordion-header " id="headingOne">
                                                    <div className="" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-controls="collapseOne">
                                                        <div className="addproduct-icon ">
                                                            <h5>
                                                                <Info className="add-info" />
                                                                <span>सेवा जोडा</span>
                                                            </h5>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div id="collapseOne" className="accordion-collapse collapse show " aria-labelledby="headingOne" data-bs-parent="#accordionExample"></div>

                                                <div className="mb-3 row ">
                                                    <div className="col-md-6">
                                                        <label htmlFor="serviceName" className="form-label required">
                                                            सेवा नाव
                                                        </label>
                                                        <input
                                                            type="text"
                                                            id="SNAME"
                                                            name="serviceName"
                                                            value={formData.serviceName}
                                                            onChange={handleChange}
                                                            onKeyDown={handleKeyDown}
                                                            className="form-control"
                                                            placeholder="सेवेचे नाव टाका"
                                                            ref={firstInputRef}
                                                            pattern="^(?!\s*$)[a-zA-Z\s]{3,50}$"
                                                            title="सेवा नाव 3 ते 50 अक्षरांचे असावे आणि फक्त अक्षरे असावीत."
                                                            required
                                                        />
                                                    </div>

                                                    <div className="col-md-6">
                                                        <label className="form-label required">सेवेचा प्रकार</label>
                                                        <Select
                                                            id="STYPE"
                                                            value={serviceOptions?.find((option) => option.value === formData.service) || null}
                                                            name="service"
                                                            classNamePrefix="react-select"
                                                            options={serviceOptions}
                                                            placeholder="निवडा"
                                                            title="कृपया सेवेचा वैध प्रकार निवडा."
                                                            onChange={(selectedOption) =>
                                                                handleChange({ target: { name: "service", value: selectedOption?.value } })
                                                            }
                                                            required
                                                            openMenuOnFocus={true}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="mb-3 row">
                                                    <div className="col-md-6">
                                                        <div className="d-flex justify-content-between align-items-center">
                                                            <label htmlFor="category" className="form-label required">
                                                                श्रेणी
                                                            </label>
                                                        </div>
                                                        <Select
                                                            id="SCATEGORY"
                                                            name="category"
                                                            value={categories.find(option => option.value === formData.category) || null}
                                                            onChange={(selectedOption) => {
                                                                handleChange({ target: { name: "category", value: selectedOption.value } });
                                                                OnCategoryChange(selectedOption);
                                                            }}
                                                            classNamePrefix="react-select"
                                                            options={categories}
                                                            title="कृपया वैध श्रेणी निवडा."
                                                            required
                                                            openMenuOnFocus={true}
                                                        />
                                                    </div>

                                                    <div className="col-md-6">
                                                        <div className="d-flex justify-content-between align-items-center">
                                                            <label htmlFor="subcategory" className="form-label required">
                                                                उपश्रेणी
                                                            </label>
                                                        </div>
                                                        <Select
                                                            id="SSUBCATEGORY"
                                                            name="subcategory"
                                                            value={subcategory.find(option => option.value === formData.subcategory) || null}
                                                            onChange={(selectedOption) =>
                                                                handleChange({ target: { name: "subcategory", value: selectedOption.value } })
                                                            }
                                                            options={subcategory}
                                                            classNamePrefix="react-select"
                                                            title="कृपया वैध उपश्रेणी निवडा."
                                                            disabled={!formData.category}
                                                            required
                                                            openMenuOnFocus={true}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="mb-3 row">
                                                    <div className="col-md-6">
                                                        <label htmlFor="hsnCode" className="form-label">
                                                            एचएसएन कोड
                                                        </label>
                                                        <div className="d-flex">
                                                            <div className="position-relative" style={{ width: "150px", marginRight: "10px" }}>
                                                                <input
                                                                    type="text"
                                                                    id="hsnInput"
                                                                    name="hsnInput"
                                                                    value={hsnInput}
                                                                    onBlur={(e) => HSNhandleChange(e.target.value)}
                                                                    onChange={(e) => sethsnInput(e.target.value)}
                                                                    className={`form-control ${errors.hsnInput ? "is-invalid" : ""}`}
                                                                    placeholder="एचएसएन कोड"
                                                                    required
                                                                    style={{ paddingLeft: "30px" }}
                                                                />
                                                                <i
                                                                    className="bi bi-search position-absolute"
                                                                    style={{
                                                                        top: "50%",
                                                                        left: "8px",
                                                                        transform: "translateY(-50%)",
                                                                        color: "#6c757d",
                                                                    }}
                                                                ></i>
                                                            </div>

                                                            <Select
                                                                id="SHSN"
                                                                name="hsnCode"
                                                                value={hsnType.find(option => option.value === formData.hsnCode) || null}
                                                                onChange={(selectedOption) => {
                                                                    setFormData(prevData => ({
                                                                        ...prevData,
                                                                        hsnCode: selectedOption ? selectedOption.value : "",
                                                                    }));
                                                                    sethsnInput(selectedOption ? selectedOption.label : "");
                                                                }}
                                                                options={hsnType}
                                                                classNamePrefix="react-select"
                                                                title="कृपया वैध एचएसएन कोड निवडा."
                                                                required
                                                                className="flex-grow-1"
                                                                openMenuOnFocus={true}
                                                            />
                                                        </div>
                                                        {errors.hsnCode && <div className="text-danger mt-1">{errors.hsnCode}</div>}
                                                    </div>
                                                </div>

                                                <div className="mb-3 row">
                                                    <div className="col-md-12">
                                                        <label htmlFor="description" className="form-label">
                                                            वर्णन
                                                        </label>
                                                        <textarea
                                                            id="SDESCRIPTION"
                                                            name="description"
                                                            value={formData.description}
                                                            onChange={handleChange}
                                                            onKeyDown={handleKeyDown}
                                                            className="form-control"
                                                            rows="3"
                                                            placeholder="सेवेचे वर्णन लिहा"
                                                            title="वर्णन वैकल्पिक आहे"
                                                        ></textarea>
                                                        {errors.description && <div className="text-danger">{errors.description}</div>}
                                                    </div>
                                                </div>

                                                <div className="col-lg-12">
                                                    <div className="btn-addproduct mb-4">
                                                        <button
                                                            type="button"
                                                            onClick={showExitAlert}
                                                            className="btn btn-cancel me-2"
                                                        >
                                                            मागे
                                                        </button>
                                                        <button type="submit" className="btn btn-submit">
                                                            सेव्ह
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                </div>
            </div>


        </>
    );
};
export default Service;


