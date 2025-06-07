import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from "react-router-dom";
import Select from "react-select";
import { all_routes } from "../../Router/all_routes";
import Addunits from "../../core/modals/inventory/addunits";
import AddCategory from "../../core/modals/inventory/addcategory";
import AddBrand from "../../core/modals/addbrand";
import axios from "axios";
import { ACSPLGUID, baseUrl } from "../../core/json/custom";

import { useNavigate } from 'react-router-dom';
import withReactContent from "sweetalert2-react-content";
import Swal from 'sweetalert2';
import {
    ArrowLeft,
    ChevronDown,
    ChevronUp,
    Info,
    // LifeBuoy,
    List,

} from "feather-icons-react/build/IconComponents";
import { useDispatch, useSelector } from "react-redux";
import { setToogleHeader } from "../../core/redux/action";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { getUserData } from "../../Context/UserData";

const AddTransporter = () => {

    const location = useLocation();
    const { CAID } = location.state || {};
    console.log('CAID', CAID);
    const { isAuthenticated, userdetail } = getUserData();

    if (isAuthenticated == true) {
        console.log("user", userdetail);
        console.log("getUserData", getUserData);
    }

    const BusinessRef = useRef();
    const BusinesstypeRef = useRef();
    const phoneRef = useRef();
    const nameRef = useRef();
    const TradeNameRef = useRef();
    const PincodeRef = useRef();
    const TeliphoneRef = useRef();
    const EmailRef = useRef();
    const GSTINRef = useRef();
    const TradePincodeRef = useRef();
    const PANRef = useRef();
    const BuildingRef = useRef();
    const AreaRef = useRef();
    const LandmarkRef = useRef();
    const CityRef = useRef();
    const StateRef = useRef();
    const websiteRef = useRef();
    const TradeBuildingRef = useRef();
    const TradeAreaRef = useRef();
    const TradeLandmarkRef = useRef();
    const TradeLandcityRef = useRef();
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


    const [BusinessType, setBusinessType] = useState([]);
    //     { value: "importer", label: "importer" },
    //     { value: "Job Worker", label: "Job Worker " },
    //     { value: "Packing", label: "Packing " },
    //     { value: "other", label: "other " },
    // ];

    const [isChecked, setIsChecked] = useState(false);
    const [sellingtype, setsellingtype] = useState([]);
    const [statetype, setstatetype] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        Business: '',
        selectedType: '0',
        BusinessType: '',
        phone: '',
        Teliphone: '',
        Email: '',
        Pincode: '',
        PAN: '',
        Building: '',
        Area: '',
        Landmark: '',
        TradeName: '',
        TradePincode: '',
        TradeBuilding: '',
        TradeArea: '',
        TradeLandmark: '',
        GSTIN: '',
        company: '',
        selectedTradecity: '',
        selectedcity: '',
        selectedstate: '',
        Website: '',
    });
    useEffect(() => {
        const fetchImplications = async () => {
            try {
                const response = await axios.get(
                    baseUrl.Url + "/backend/api/Implications/BSTYPE",
                    // "http://adsvr:78/api/Implications/SOLID|LIQUID|GAS"
                );

                if (response.status !== 200) throw new Error("Failed to fetch implications data");

                const data = response.data;

                // Combine all implications into one array
                const implicationsDropdown = data.map(({ iTitle, iValue }) => ({
                    label: iTitle,
                    value: iValue,
                }));

                setBusinessType(implicationsDropdown);
            } catch (error) {
                console.error("Error fetching implications:", error);
            }
        };
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
        fetchImplications();
        fetchLocationData();
    }, []);


    // const nameInputRef = useRef(''); // Create a ref for the name input
    useEffect(() => {
        if (CAID) {
            const fetchData = async () => {
                try {
                    const payload = {
                        "pkid": CAID
                        , "ctype": "0"
                        , "keyword": "%"
                        , "companyid": userdetail?.companyID ? userdetail.companyID : "",
                        "deptid": userdetail?.departmentID ? userdetail.departmentID : "",
                    }
                    const headers = {
                        "Content-Type": "application/json",
                        Accept: "*/*",
                    };

                    axios({
                        method: "POST",
                        url: baseUrl.Url + "/backend/api/_GET_CustomersPartners_/getByID",
                        data: JSON.stringify(payload),
                        headers: headers,
                    })
                        .then((response) => {
                            if (response.status != 200) throw new Error("Failed to Fetching Data");
                            const DATA = response.data[0];
                            setFormData({
                                name: DATA.ccontactpersonname || '',
                                selectedType: DATA.ctype || '2',
                                BusinessType: DATA.cbusinesstype || '',
                                phone: DATA.ccontactpersonmobile || '',
                                Teliphone: DATA.ctelephonenumber || '',
                                Email: DATA.cemail || '',
                                Pincode: DATA.cpincode || '',
                                PAN: DATA.cpan || '',
                                Building: DATA.caddress || '',
                                Area: DATA.carea || '',
                                Landmark: DATA.clandmark || '',
                                TradeName: DATA.ctradename || '',
                                TradePincode: DATA.ctradepincode || '',
                                TradeBuilding: DATA.ctradeaddress || '',
                                TradeArea: DATA.carea || '',
                                TradeLandmark: DATA.clandmark || '',
                                GSTIN: DATA.cgstin || '',
                                selectedTradecity: DATA.ctradecity || '',
                                selectedcity: DATA.ccity || '',
                                selectedstate: DATA.cstate || '',
                                Business: DATA.ccompanyname || '',
                                Website: DATA.cwebsiteurl || '',
                            });
                            if (DATA.cpincode) {
                                setsellingtype(DATA.cpincode);
                                handleChange(DATA.cpincode, true);
                            }
                        })


                } catch (error) {
                    console.error("Error fetching Access Right Data:", error);
                }

            };
            fetchData();
        }
    }, [CAID]);
    // const handleChange = async (e) => {
    //     const { name, value } = e.target;
    //     setFormData((prevData) => ({
    //         ...prevData,
    //         [name]: value,
    //     }));

    //     if (name === "Pincode" && value.length === 6) {
    //         try {
    //             const headers = {
    //                 "Content-Type": "application/json",
    //                 Accept: "*/*",
    //             };

    //             const payload = { spincode: value };


    //             const response = await axios({
    //                 method: "POST",
    //                 url: baseUrl.Url + "/backend/api/StatePincode",
    //                 data: JSON.stringify(payload),
    //                 headers: headers,
    //             });

    //             if (response.status === 200) {
    //                 const data = response.data;
    //                 const districtdata = data
    //                     .map(({ sdistrict, said }) => ({
    //                         label: sdistrict,
    //                         value: said,
    //                     }));
    //                 setsellingtype(districtdata)
    //                 const Statedata = data
    //                     .map(({ sstatename, sstatecode }) => ({
    //                         label: sstatename,
    //                         value: sstatecode,
    //                     }));
    //                 setstatetype(Statedata)
    //                 setFormData((prevData) => ({
    //                     ...prevData,
    //                     selectedstate: response.data[0].said || '',
    //                     selectedcity: response.data[0].said || '',
    //                 }));
    //             } else {
    //                 console.error("Failed to fetch district and state for the pincode");
    //             }
    //         } catch (error) {
    //             console.error("Error fetching district and state data:", error);
    //         }
    //     }
    //     if (name === "TradePincode" && value.length === 6) {
    //         try {
    //             const headers = {
    //                 "Content-Type": "application/json",
    //                 Accept: "*/*",
    //             };

    //             const payload = { spincode: value };


    //             const response = await axios({
    //                 method: "POST",
    //                 url: baseUrl.Url + "/backend/api/StatePincode",
    //                 data: JSON.stringify(payload),
    //                 headers: headers,
    //             });

    //             if (response.status === 200) {
    //                 const data = response.data;
    //                 const districtdata = data
    //                     .map(({ sdistrict, said }) => ({
    //                         label: sdistrict,
    //                         value: said,
    //                     }));
    //                 setsellingtype(districtdata)

    //                 setFormData((prevData) => ({
    //                     ...prevData,
    //                     selectedTradecity: response.data[0].said || '',

    //                 }));
    //             } else {
    //                 console.error("Failed to fetch district and state for the pincode");
    //             }
    //         } catch (error) {
    //             console.error("Error fetching district and state data:", error);
    //         }
    //     }
    // };

    const handleChange = async (e) => {
        const { name, value } = e.target;

        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));

        if (name === "TPINCODE") {
            // Validate pincode (only proceed if it's exactly 6 digits)
            if (/^\d{6}$/.test(value)) {
                try {
                    const headers = {
                        "Content-Type": "application/json",
                        Accept: "*/*",
                    };
                    const payload = { spincode: value };
                    const response = await axios.post(
                        baseUrl.Url + "/backend/api/StatePincode",
                        JSON.stringify(payload),
                        { headers }
                    );

                    if (response.status === 200) {
                        const data = response.data;
                        const districtdata = data.map(({ sdistrict, said }) => ({
                            label: sdistrict,
                            value: said,
                        }));
                        setsellingtype(districtdata);

                        const Statedata = data.map(({ sstatename, said }) => ({
                            label: sstatename,
                            value: said,
                        }));
                        setstatetype(Statedata);

                        setFormData((prevData) => ({
                            ...prevData,
                            TSTATE: response.data[0]?.said || '',
                            TCITY: response.data[0]?.said || '',
                        }));

                    } else {
                        console.error("Failed to fetch district and state for the pincode");
                    }
                } catch (error) {
                    console.error("Error fetching district and state data:", error);
                }
            } else {
                console.log("Invalid pincode entered. It must be 6 digits.");
            }
        }
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
    }, [formData, navigate]);


    useEffect(() => {

        if (BusinessRef.current) {
            BusinessRef.current.focus();
        }
        // else if(PincodeRef.current) {
        //     PincodeRef.current.focus();
        //   }
        //   else if(phoneRef.current) {
        //     phoneRef.current.focus();
        //   }
        //   else if(TradeNameRef.current) {
        //     TradeNameRef.current.focus();
        //   }
    }, []);


    const handleCheckboxChange = () => {
        setIsChecked(!isChecked);

        if (!isChecked) {
            setFormData((prevState) => ({
                ...prevState,
                TradePincode: prevState.Pincode,
                TradeBuilding: prevState.Building,
                TradeArea: prevState.Area,
                TradeLandmark: prevState.Landmark,
                selectedTradecity: prevState.selectedcity,

            }));
        } else {

            setFormData((prevState) => ({
                ...prevState,
                TradePincode: '',
                TradeBuilding: '',
                TradeArea: '',
                TradeLandmark: '',
                selectedTradecity: '',
            }));
        }
    };


    const handleSelectChange = (selectedOption, field) => {
        console.log('selectedcity', selectedOption.value)
        setFormData(prevData => ({
            ...prevData,
            [field]: selectedOption ? selectedOption.value : '',
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        showConfirmationAlert(event);
    };

    const handleFormSubmission = async () => {
        const payload = {
            "caid": CAID ? CAID : GUID,
            "ccompanyname": formData?.Business || "",
            "ctype": formData?.selectedType || "",
            "caddress": formData?.Building || "",
            "ccity": formData?.selectedcity || "",
            "cpincode": formData?.Pincode || "",
            "ctelephonenumber": formData?.Teliphone || "",
            "cemail": formData?.Email || "",
            "cwebsiteurl": formData?.Website || "",
            "ccontactpersonname": formData?.name || "",
            "ccontactpersonmobile": formData?.phone || "",
            "cdesignation": "",
            "cgstin": formData?.GSTIN || "",
            "ctradename": formData?.TradeName || "",
            "ctradeaddress": formData?.TradeBuilding || "",
            "ctradecity": formData?.selectedTradecity || "",
            "ctradepincode": formData?.TradePincode || "",
            "cstate": formData?.selectedstate || "",
            "cdistance": "",
            "cpan": formData?.PAN || "",
            "cbusinesstype": formData?.BusinessType || "",
            "cstatus": "",
            "cifsc": "",
            "caccountname": "",
            "caccountnumber": '',
            "cbankname": "",
            "cbranchname": "",
            "ctradearea": formData?.Area || "",
            "ctradelandmark": formData?.Landmark || "",
            "carea": formData?.Area || "",
            "clandmark": formData?.Landmark || "",
            "ccategory": "",
            "companyid": userdetail?.companyID || "",
            "deptid": userdetail?.departmentID || "",
        };

        console.log("Payload:", payload);

        const headers = {
            "Content-Type": "application/json",
            Accept: "*/*",
        };

        axios.post(baseUrl.Url + "/backend/api/CustomersPartners", payload, { headers })
            .then(response => {
                if (response.status === 200) {
                    Swal.fire({
                        icon: "success",
                        title: "जतन झाले!",
                        text: "माहिती यशस्वीरित्या जतन झाली.",
                        confirmButtonText: "ठीक आहे",
                        allowOutsideClick: false,
                        allowEscapeKey: false

                    }).then(() => {
                        navigate(route.TransporterMaster);
                    });

                } else {
                    Swal.fire({
                        icon: "error",
                        title: "त्रुटी",
                        text: "माहिती जतन करण्यात अयशस्वी. कृपया पुन्हा प्रयत्न करा.",
                        allowOutsideClick: false,
                        allowEscapeKey: false

                    });
                }
            })
            .catch(error => {
                console.error("Submission Error:", error);
                Swal.fire({
                    icon: "error",
                    title: "त्रुटी",
                    text: "माहिती जतन करण्यात अयशस्वी. कृपया पुन्हा प्रयत्न करा.",
                    allowOutsideClick: false,
                    allowEscapeKey: false

                });
            });


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
                handleFormSubmission(event);
            }
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
                navigate(route.TransporterMaster)
            }
        });
    };

    const validateinput = (e) => {

        const { Business } = formData;
        const { BusinessType } = formData;
        const { phone, name, TradeName, Pincode, Teliphone, Email, GSTIN, TradePincode, PAN } = formData;

        if ((!Business || !/^[A-Za-z]+( [A-Za-z]+)*$/.test(Business)) ||
            (!BusinessType || BusinessType === '') ||
            (!phone || !/[789][0-9]{9}/.test(phone)) ||
            (!name || !/^[A-Za-z]+( [A-Za-z]+)*$/.test(name)) ||
            (!TradeName || !/^[A-Za-z]+( [A-Za-z]+)*$/.test(TradeName)) ||
            (Pincode && !/^\d{6}$/.test(Pincode)) ||
            (Teliphone && !/^\d{10}$/.test(Teliphone)) ||
            (Email && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(Email)) ||
            (GSTIN && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9]{1}[A-Z]{1}[0-9]{1}$/.test(GSTIN)) ||
            (TradePincode && !/^\d{6}$/.test(TradePincode)) ||
            (PAN && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(PAN))) {
            Swal.fire({
                icon: "error",
                title: "चूक",
                text: "कृपया सर्व आवश्यक माहिती भरा",
                allowOutsideClick: false,
                allowEscapeKey: false

            }).then(() => {
                BusinessRef.current.focus();
                BusinesstypeRef.current.focus();
                phoneRef.current.focus();
                nameRef.current.focus();
                TradeNameRef.current.focus();
                PincodeRef.current.focus();
                TeliphoneRef.current.focus();
                EmailRef.current.focus();
                GSTINRef.current.focus();
                TradePincodeRef.current.focus();
                PANRef.current.focus();
            })
            return;
        }
        handleSubmit(e);
    }

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
                            <h4>परिवहनकर्ता माहिती</h4>
                            {/* <h6>Create new Transporter</h6> */}
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
                        <Link to={route.TransporterMaster} className="btn btn-secondary">
                            <ArrowLeft className="me-2" />
                            मागे
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
                                        <div className="" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-controls="collapseOne">
                                            <div className="addproduct-icon">
                                                <h5>
                                                    <Info className="add-info" />
                                                    <span>परिवहनकर्ता माहिती</span>
                                                </h5>
                                                <Link to="#">
                                                    <ChevronDown className="chevron-down-add" />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                    <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                                        <div className="accordion-body">
                                            <div className="row">
                                                <div className="col-lg-8 col-sm-6 col-12">
                                                    <div className="form-label add-product">
                                                        <label className="form-label required">व्यवसायाचे नाव</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            name="Business"
                                                            value={formData.Business}
                                                            pattern="^[A-Za-z]+( [A-Za-z]+)*$"
                                                            title="नावात फक्त अक्षरे आणि स्पेस असू शकतात."
                                                            onChange={handleChange}
                                                            required
                                                            ref={BusinessRef}
                                                            onKeyDown={(e) => handleEnterKey(e, BusinesstypeRef)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-4 col-sm-6 col-12">
                                                    <div className="mb-3 add-product">
                                                        <div className="add-newplus">
                                                            <label className="form-label required">व्यवसाय प्रकार</label>
                                                        </div>
                                                        <Select
                                                            classNamePrefix="react-select"
                                                            options={BusinessType}
                                                            required
                                                            ref={BusinesstypeRef}
                                                            value={BusinessType.find(option => option.value === formData.BusinessType)}
                                                            onChange={(selectedOption) => {
                                                                setFormData((prevData) => ({
                                                                    ...prevData,
                                                                    BusinessType: selectedOption ? selectedOption.value : "",
                                                                }));
                                                                if (PincodeRef.current) {
                                                                    PincodeRef.current.focus();
                                                                }
                                                            }}
                                                            placeholder="निवडा"
                                                            openMenuOnFocus={true}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="row">
                                                <div className="col-lg-4 col-sm-6 col-12">
                                                    <div className="mb-3 add-product">
                                                        <label className="form-label">पिनकोड</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            onChange={handleChange}
                                                            value={formData.Pincode}
                                                            name="Pincode"
                                                            ref={PincodeRef}
                                                            pattern="^\d{6}$"
                                                            title="फक्त सहा अंक असू शकतात."
                                                            onKeyDown={(e) => handleEnterKey(e, BuildingRef)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-4 col-sm-6 col-12">
                                                    <div className="mb-3 add-product">
                                                        <label className="form-label">फ्लॅट, घर क्र. किंवा इमारत</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            value={formData.Building}
                                                            name="Building"
                                                            onChange={handleChange}
                                                            ref={BuildingRef}
                                                            onKeyDown={(e) => handleEnterKey(e, AreaRef)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-4 col-sm-6 col-12">
                                                    <div className="mb-3 add-product">
                                                        <label className="form-label">क्षेत्र, सेक्टर, गावे</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            value={formData.Area}
                                                            name="Area"
                                                            onChange={handleChange}
                                                            ref={AreaRef}
                                                            onKeyDown={(e) => handleEnterKey(e, LandmarkRef)}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-lg-4 col-sm-6 col-12">
                                                    <div className="mb-3 add-product">
                                                        <label className="form-label">लँडमार्क</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            value={formData.Landmark}
                                                            name="Landmark"
                                                            ref={LandmarkRef}
                                                            onKeyDown={(e) => handleEnterKey(e, CityRef)}
                                                            onChange={handleChange}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-4 col-sm-6 col-12">
                                                    <div className="mb-3 add-product">
                                                        <label className="form-label">शहर</label>
                                                        <Select
                                                            classNamePrefix="react-select"
                                                            options={sellingtype}
                                                            ref={CityRef}
                                                            value={sellingtype.find(option => option.value === formData.selectedcity)}
                                                            onChange={(selectedOption) => handleSelectChange(selectedOption, 'selectedcity')}
                                                            placeholder="निवडा"
                                                            onKeyDown={(e) => handleEnterKey(e, StateRef)}
                                                            openMenuOnFocus={true}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-4 col-sm-6 col-12">
                                                    <div className="mb-3 add-product">
                                                        <label className="form-label">राज्य</label>
                                                        <Select
                                                            classNamePrefix="react-select"
                                                            options={statetype}
                                                            value={statetype.find(option => option.value === formData.selectedstate)}
                                                            onChange={(selectedOption) => handleSelectChange(selectedOption, 'selectedstate')}
                                                            openMenuOnFocus={true}
                                                            ref={StateRef}
                                                            onKeyDown={(e) => handleEnterKey(e, TeliphoneRef)}
                                                            placeholder="चुनाव करा"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-lg-4 col-sm-6 col-12">
                                                    <div className="mb-3 add-product">
                                                        <label className="form-label">दूरध्वनी</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            pattern="^\d{10}$"
                                                            title="दूरध्वनी नोंदवलेली दहा अंकांची असावं."
                                                            value={formData.Teliphone}
                                                            name="Teliphone"
                                                            ref={TeliphoneRef}
                                                            onChange={handleChange}
                                                            onKeyDown={(e) => handleEnterKey(e, EmailRef)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-4 col-sm-6 col-12">
                                                    <div className="mb-3 add-product">
                                                        <label className="form-label">ईमेल</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            pattern="/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/"
                                                            value={formData.Email}
                                                            name="Email"
                                                            ref={EmailRef}
                                                            onChange={handleChange}
                                                            onKeyDown={(e) => handleEnterKey(e, phoneRef)}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-lg-4 col-sm-6 col-12">
                                                    <div className="form-label add-product">
                                                        <label className="form-label required">फोन</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            pattern="[789][0-9]{9}"
                                                            required
                                                            value={formData.phone}
                                                            name="phone"
                                                            title="फोन नोंदवलेली दहा अंकांची असावं."
                                                            ref={phoneRef}
                                                            onChange={handleChange}
                                                            onKeyDown={(e) => handleEnterKey(e, nameRef)}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-lg-6 col-sm-6 col-12">
                                                    <div className="form-label add-product">
                                                        <label className="form-label required">व्यक्तीचे नाव</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            required
                                                            name="name"
                                                            value={formData.name}
                                                            ref={nameRef}
                                                            pattern="^[A-Za-z]+( [A-Za-z]+)*$"
                                                            title="नावात फक्त अक्षरे आणि स्पेस असू शकतात."
                                                            onChange={handleChange}
                                                            onKeyDown={(e) => handleEnterKey(e, websiteRef)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-6 col-sm-6 col-12">
                                                    <div className="form-label add-product">
                                                        <label className="form-label">वेबसाइट URL</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            name="Website"
                                                            value={formData.Website}
                                                            title="वेबसाइटमध्ये फक्त अक्षरे असू शकतात."
                                                            onChange={handleChange}
                                                            ref={websiteRef}
                                                            onKeyDown={(e) => handleEnterKey(e, TradeNameRef)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Trade */}
                            <div className="accordion-card-one accordion" id="accordionExample4">
                                <div className="accordion-item mbgcolor">
                                    <div className="accordion-header" id="headingFour">
                                        <div className="" data-bs-toggle="collapse" data-bs-target="#collapseFour" aria-controls="collapseFour">
                                            <div className="text-editor add-list">
                                                <div className="addproduct-icon list">
                                                    <h5>
                                                        <List className="add-info" />
                                                        <span>व्यापार</span>
                                                    </h5>
                                                    <Link to="#">
                                                        <ChevronDown className="chevron-down-add" />
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>

                                        <input
                                            type="checkbox"
                                            checked={isChecked}
                                            onChange={handleCheckboxChange}
                                        />
                                        <label className="form-label">वरील पत्तासारखा</label>

                                    </div>
                                    <div id="collapseFour" className="accordion-collapse collapse show" aria-labelledby="headingFour" data-bs-parent="#accordionExample4">
                                        <div className="add-product-new">
                                            <div className="row">
                                                <div className="col-lg-8 col-sm-6 col-12">
                                                    <div className="mb-3 add-product">
                                                        <label className="form-label required">व्यापाराचे नाव</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            required
                                                            onChange={handleChange}
                                                            value={formData.TradeName}
                                                            name="TradeName"
                                                            ref={TradeNameRef}
                                                            pattern="^[A-Za-z]+( [A-Za-z]+)*$"
                                                            title="नावात फक्त अक्षरे आणि स्पेस असू शकतात."
                                                            onKeyDown={(e) => handleEnterKey(e, GSTINRef)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-4 col-sm-6 col-12">
                                                    <div className="mb-3 add-product">
                                                        <label className="form-label">GSTIN</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            onChange={handleChange}
                                                            ref={GSTINRef}
                                                            value={formData.GSTIN}
                                                            name="GSTIN"
                                                            pattern="^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9]{1}[A-Z]{1}[0-9]{1}$"
                                                            title="फक्त अलाईफानोमरीक कॅरेक्टरला अनुमती आहे."
                                                            onKeyDown={(e) => handleEnterKey(e, TradePincodeRef)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-lg-4 col-sm-6 col-12">
                                                <div className="mb-3 add-product">
                                                    <label className="form-label">व्यापार पिनकोड</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={formData.TradePincode}
                                                        name="TradePincode"
                                                        onChange={handleChange}
                                                        disabled={isChecked}
                                                        ref={TradePincodeRef}
                                                        pattern="^\d{6}$"
                                                        title="फक्त सहा अंक असू शकतात."
                                                        onKeyDown={(e) => handleEnterKey(e, TradeBuildingRef)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-lg-4 col-sm-6 col-12">
                                                <div className="mb-3 add-product">
                                                    <label className="form-label">फ्लॅट, घर क्र., इमारत</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={formData.TradeBuilding}
                                                        name="TradeBuilding"
                                                        disabled={isChecked}
                                                        onChange={handleChange}
                                                        ref={TradeBuildingRef}
                                                        onKeyDown={(e) => handleEnterKey(e, TradeAreaRef)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-lg-4 col-sm-6 col-12">
                                                <div className="mb-3 add-product">
                                                    <label className="form-label">व्यापार क्षेत्र, सेक्टर, गावे</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={formData.TradeArea}
                                                        name="TradeArea"
                                                        disabled={isChecked}
                                                        onChange={handleChange}
                                                        ref={TradeAreaRef}
                                                        onKeyDown={(e) => handleEnterKey(e, TradeLandmarkRef)}
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-lg-4 col-sm-6 col-12">
                                                <div className="mb-3 add-product">
                                                    <label className="form-label">व्यापार लँडमार्क</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={formData.TradeLandmark}
                                                        name="TradeLandmark"
                                                        disabled={isChecked}
                                                        onChange={handleChange}
                                                        ref={TradeLandmarkRef}
                                                        onKeyDown={(e) => handleEnterKey(e, TradeLandcityRef)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-lg-4 col-sm-6 col-12">
                                                <div className="mb-3 add-product">
                                                    <label className="form-label">व्यापार शहर</label>
                                                    <Select
                                                        classNamePrefix="react-select"
                                                        options={sellingtype}
                                                        value={sellingtype.find(option => option.value === formData.selectedTradecity)}
                                                        onChange={(selectedOption) => {
                                                            setFormData((prevData) => ({
                                                                ...prevData,
                                                                selectedTradecity: selectedOption ? selectedOption.value : "",
                                                            }));
                                                            if (PANRef.current) {
                                                                PANRef.current.focus();
                                                            }
                                                        }}
                                                        ref={TradeLandcityRef}
                                                        disabled={isChecked}
                                                        placeholder="निवडा"
                                                        openMenuOnFocus={true}
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-lg-4 col-sm-6 col-12">
                                                <div className="mb-3 add-product">
                                                    <label className="form-label">PAN क्रमांक</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        pattern="^[A-Z]{5}[0-9]{4}[A-Z]{1}$"
                                                        onChange={handleChange}
                                                        ref={PANRef}
                                                        value={formData.PAN}
                                                        name="PAN"
                                                        title="PANमध्ये काही वर्ण आणि अंक असू शकतात."
                                                        onKeyDown={(e) => handleEnterKey(e, submitRef)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-12">
                                <div className="btn-addproduct mb-4">
                                    <button type="button" onClick={showExitAlert} className="btn btn-cancel">मागे </button>
                                    <button type="submit" className="btn btn-save"
                                        ref={submitRef}>सेव्ह </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>




                {/* /add */}
            </div>
            <Addunits />
            <AddCategory />
            <AddBrand />
        </div>
    );
};

export default AddTransporter;
