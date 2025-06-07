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
import Swal from 'sweetalert2';
import withReactContent from "sweetalert2-react-content";
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

const AddVendor = () => {

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
    const BankNameRef = useRef();
    const AccountNumberRef = useRef();
    const IFSCCodeRef = useRef();
    const BranchNameRef = useRef();
    const AccountantnameRef = useRef();
    const CStateRef = useRef();
    const BuildingRef = useRef();
    const AreaRef = useRef();
    const LandmarkRef = useRef();
    const CityRef = useRef();
    const StateRef = useRef();
    const WebsiteRef = useRef();
    const TradeBuildingRef = useRef();
    const TradeAreaRef = useRef();
    const TradeLandmarkRef = useRef();
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

    const [sellingtype, setsellingtype] = useState([]);
    const [statetype, setstatetype] = useState([]);

    // const sellingtype = [
    //     { value: "choose", label: "Choose" },
    //     { value: "transactionalSelling", label: "Transactional selling" },
    //     { value: "solutionSelling", label: "Solution selling" },
    // ];

    const [BusinessType, setBusinessType] = useState([]);
    //     { value: "importer", label: "importer" },
    //     { value: "Job Worker", label: "Job Worker " },
    //     { value: "Packing", label: "Packing " },
    //     { value: "other", label: "other " },
    // ];

    const [isChecked, setIsChecked] = useState(false);
    // const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        Business: '',
        selectedType: "3",
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
        BankName: '',
        AccountNumber: '',
        IFSCCode: '',
        BranchName: '',
        Accountantname: ''
    });

    useEffect(() => {
        const fetchImplications = async () => {
            try {
                const response = await axios.get(
                    baseUrl.Url + "/backend/api/Implications/BSTYPE",
                );

                if (response.status !== 200) throw new Error("Failed to fetch implications data");

                const data = response.data;

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
        fetchLocationData();
        fetchImplications();
    }, []);

    useEffect(() => {
        if (CAID) {
            const fetchData = async () => {
                try {
                    const payload = {
                        "pkid": CAID
                        , "ctype": "3"
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

        if (BusinessRef.current) {
            BusinessRef.current.focus();
        }

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
            "cifsc": formData?.IFSCCode || "",
            "caccountname": formData?.Accountantname || "",
            "caccountnumber": formData?.AccountNumber || "",
            "cbankname": formData?.BankName || "",
            "cbranchname": formData?.BranchName || "",
            "ctradearea": formData?.Area || "",
            "ctradelandmark": formData?.Landmark || "",
            "companyid": userdetail?.companyID || "",
            "deptid": userdetail?.departmentID || "",
            "carea": formData?.Area || "",
            "clandmark": formData?.Landmark || "",
            "ccategory": "",
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
                        title: "साठवले!",
                        text: "माहिती यशस्वीरित्या सेव झाली.",
                        confirmButtonText: "OK",
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                    }).then(() => {
                        navigate(route.VendorMaster);
                    });


                } else {
                    Swal.fire({
                        icon: "error",
                        title: "त्रुटी ",
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
                    title: "त्रुटी ",
                    text: "काहीतरी चूक झाली. कृपया पुन्हा प्रयत्न करा..",
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                });
            });


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
            allowEscapeKey: false,
        }).then((result) => {
            if (result.isConfirmed) {
                handleFormSubmission(event);
            }
        });
    };
    const showExitAlert = () => {
        MySwal.fire({
            title: "आपण बाहेर पडू इच्छिता का?",
            showCancelButton: true,
            confirmButtonColor: "#00ff00",
            confirmButtonText: "होय ",
            cancelButtonColor: "#092C4C",
            cancelButtonText: "नाही",
            allowOutsideClick: false,
            allowEscapeKey: false,
        }).then((result) => {
            if (result.isConfirmed) {
                navigate(route.VendorMaster)
            }
        });
    };



    const validateinput = (e) => {

        const { Business } = formData;
        const { BusinessType } = formData;
        const { phone, name, TradeName, Pincode, Teliphone, Email, GSTIN, TradePincode, PAN, BankName, AccountNumber, IFSCCode, BranchName, Accountantname } = formData;

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
            (BankName && !/^[A-Za-z]+( [A-Za-z]+)*$/.test(BankName)) ||
            (AccountNumber && !/^\d{9,18}$/.test(AccountNumber)) ||
            (IFSCCode && !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(IFSCCode)) ||
            (BranchName && !/^[a-zA-Z\s]{3,50}$/.test(BranchName)) ||
            (Accountantname && !/^[a-zA-Z\s]$/.test(Accountantname)) ||
            (PAN && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(PAN))) {
            Swal.fire({
                icon: "error",
                title: "त्रुटी ",
                text: "कृपया सर्व आवश्यक माहिती  भरा",
                allowOutsideClick: false,
                allowEscapeKey: false,
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
                BankNameRef.current.focus();
                AccountNumberRef.current.focus();
                IFSCCodeRef.current.focus();
                BranchNameRef.current.focus();
                PANRef.current.focus();
                AccountantnameRef.current.focus();
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

        if (name === "Pincode" && value.length === 6) {
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
                    setstatetype(Statedata)
                    setFormData((prevData) => ({
                        ...prevData,
                        selectedstate: response.data[0].said || '',
                        selectedcity: response.data[0].said || '',
                    }));
                } else {
                    console.error("Failed to fetch district and state for the pincode");
                }
            } catch (error) {
                console.error("Error fetching district and state data:", error);
            }
        }
    };
    // const [showModal, setShowModal] = useState(false);
    // const [name, setName] = useState("");
    // const openModal = () => setShowModal(true);
    // const closeModal = () => setShowModal(false);
    // const saveType = () => {
    //     console.log("Submitted Name:", name);
    //     setShowModal(false);
    // };

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
                            <h4>विक्रेते व्यवस्थापन </h4>
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
                        <Link to={route.VendorMaster} className="btn btn-secondary">
                            <ArrowLeft className="me-2" />
                            मागे
                        </Link>
                    </div>
                </div>
                {/* /add */}
                <form onSubmit={handleSubmit}>
                    <div className="card mbgcolor">
                        <div className="card-body add-product pb-0">

                            <div
                                className="accordion-card-one accordion"
                                id="accordionExample"
                            >
                                <div className="accordion-item mbgcolor">
                                    <div className="accordion-header" id="headingOne">
                                        <div
                                            className=""
                                            data-bs-toggle="collapse"
                                            data-bs-target="#collapseOne"
                                            aria-controls="collapseOne"
                                        >
                                            <div className="addproduct-icon">
                                                <h5 >
                                                    <Info className="add-info" />

                                                    <span>विक्रेता माहिती</span>
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
                                                <div className="col-lg-8 col-sm-6 col-12">
                                                    <div className="form-label add-product">
                                                        <label className="form-label required">व्यवसायाचे नाव</label>
                                                        <input type="text" className="form-control" name="Business"
                                                            value={formData.Business}
                                                            pattern="^[A-Za-z]+( [A-Za-z]+)*$"
                                                            title="नावामध्ये फक्त अक्षरे आणि स्पेस असू शकतात."
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
                                                            <label className="form-label required">व्यवसायाचा प्रकार </label>
                                                            {/* <Link
                                                                to="#"
                                                                data-bs-toggle="modal"
                                                                data-bs-target="#add-units-category"
                                                            >
                                                                <button className="btn btn-primary d-flex align-items-center" onClick={openModal}>
                                                                    <div className="me-2" />
                                                                    <span>Add New</span>
                                                                </button>

                                                                {showModal && (
                                                                    <div className="modal-overlay">
                                                                        <div className="modal-dialog modal-dialog-centered">
                                                                            <div className="modal-content">
                                                                                <div className="modal-header">
                                                                                    <h5 className="modal-title">Add New</h5>
                                                                                    <button
                                                                                        type="button"
                                                                                        className="btn-close"
                                                                                        aria-label="Close"
                                                                                        onClick={closeModal}
                                                                                    ></button>
                                                                                </div>
                                                                                <div className="modal-body">
                                                                                    <div className="mb-3">
                                                                                        <label htmlFor="nameInput" className="form-label">
                                                                                            Name
                                                                                        </label>
                                                                                        <input
                                                                                            type="text"
                                                                                            className="form-control"
                                                                                            id="nameInput"
                                                                                            placeholder="Enter name"
                                                                                            value={name}
                                                                                            onChange={(e) => setName(e.target.value)}
                                                                                        />
                                                                                    </div>
                                                                                </div>
                                                                                <div className="modal-footer">
                                                                                    <button className="btn btn-secondary" onClick={closeModal}>
                                                                                        Cancel
                                                                                    </button>
                                                                                    <button className="btn btn-primary" onClick={saveType}>
                                                                                        Submit
                                                                                    </button>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </Link> */}
                                                        </div>
                                                        <Select
                                                            classNamePrefix="react-select"
                                                            options={BusinessType}
                                                            ref={BusinesstypeRef}
                                                            required
                                                            value={BusinessType.find(option => option.value === formData.BusinessType)}
                                                            // onChange={(selectedOption) => handleSelectChange(selectedOption, 'BusinessType')}
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
                                                        <label className="form-label required">पिनकोड </label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            onChange={handleChange}
                                                            ref={PincodeRef}
                                                            value={formData.Pincode}
                                                            name="Pincode"
                                                            pattern="^\d{6}$"
                                                            title="Contains only six digit numbers."
                                                            onKeyDown={(e) => handleEnterKey(e, BuildingRef)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-4 col-sm-6 col-12">
                                                    <div className="mb-3 add-product">
                                                        <label className="form-label">फ्लॅट, इमारत, घर क्रमांक</label>
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
                                                        <label className="form-label">परिसर, विभाग, गाव</label>
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
                                                        <label className="form-label">जवळचे महत्वाचे ठिकाण </label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            value={formData.Landmark}
                                                            name="Landmark"
                                                            onChange={handleChange}
                                                            ref={LandmarkRef}
                                                            onKeyDown={(e) => handleEnterKey(e, CityRef)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-4 col-sm-6 col-12">
                                                    <div className="mb-3 add-product">
                                                        <label className="form-label">जिल्हा </label>
                                                        <Select
                                                            classNamePrefix="react-select"
                                                            options={sellingtype}
                                                            ref={CityRef}
                                                            value={sellingtype.find(option => option.value === formData.selectedcity)}
                                                            // onChange={(selectedOption) => handleSelectChange(selectedOption, 'selectedcity')}
                                                            onChange={(selectedOption) => {
                                                                setFormData((prevData) => ({
                                                                    ...prevData,
                                                                    selectedcity: selectedOption ? selectedOption.value : "",
                                                                }));
                                                                if (StateRef.current) {
                                                                    StateRef.current.focus();
                                                                }

                                                            }}
                                                            placeholder="निवडा"
                                                            openMenuOnFocus={true}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-4 col-sm-6 col-12">
                                                    <div className="mb-3 add-product">
                                                        <label className="form-label">राज्य </label>
                                                        <Select
                                                            classNamePrefix="react-select"
                                                            options={statetype}
                                                            value={statetype.find(option => option.value === formData.selectedstate)}
                                                            // onChange={(selectedOption) => handleSelectChange(selectedOption, 'selectedstate')}
                                                            onChange={(selectedOption) => {
                                                                setFormData((prevData) => ({
                                                                    ...prevData,
                                                                    BusinessType: selectedOption ? selectedOption.value : "",
                                                                }));
                                                                if (TeliphoneRef.current) {
                                                                    TeliphoneRef.current.focus();
                                                                }

                                                            }}

                                                            ref={StateRef}
                                                            placeholder="निवडा"
                                                            openMenuOnFocus={true}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">

                                                <div className="col-lg-4 col-sm-6 col-12">
                                                    <div className="mb-3 add-product">
                                                        <label className="form-label">टेलिफोन नंबर </label>
                                                        <input type="text" className="form-control" pattern="^\d{10}$"
                                                            title="टेलिफोन नंबर दहा अंकी असावा"
                                                            value={formData.Teliphone} name="Teliphone"
                                                            ref={TeliphoneRef}
                                                            onChange={handleChange}
                                                            onKeyDown={(e) => handleEnterKey(e, EmailRef)} />
                                                    </div>
                                                </div>
                                                <div className="col-lg-4 col-sm-6 col-12">
                                                    <div className="mb-3 add-product">
                                                        <label className="form-label">ई-मेल </label>
                                                        <input type="text" className="form-control"
                                                            pattern="/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/"
                                                            value={formData.Email} name="Email"
                                                            ref={EmailRef}
                                                            onKeyDown={(e) => handleEnterKey(e, phoneRef)}
                                                            onChange={handleChange} />
                                                    </div>
                                                </div>

                                                <div className="col-lg-4 col-sm-6 col-12">
                                                    <div className="form-label add-product">
                                                        <label className="form-label required">फोन नंबर </label>
                                                        <input type="text" className="form-control" pattern="[789][0-9]{9}" required
                                                            value={formData.phone} name="phone"
                                                            title="फोन नंबर दहा अंकी असावा "
                                                            ref={phoneRef}
                                                            onChange={handleChange}
                                                            onKeyDown={(e) => handleEnterKey(e, nameRef)} />
                                                    </div>
                                                </div>
                                                <div />
                                                <div className="row"></div>
                                                <div className="col-lg-6 col-sm-6 col-12">
                                                    <div className="form-label add-product">
                                                        <label className="form-label required">व्यक्तीचे नाव </label>
                                                        <input type="text" className="form-control" required name="name"
                                                            value={formData.name}
                                                            ref={nameRef}
                                                            pattern="^[A-Za-z]+( [A-Za-z]+)*$" title="नावामध्ये फक्त अक्षरे आणि स्पेस असू शकतात."
                                                            onChange={handleChange}
                                                            onKeyDown={(e) => handleEnterKey(e, WebsiteRef)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-6 col-sm-6 col-12">
                                                    <div className="form-label add-product">
                                                        <label className="form-label ">वेबसाइट URL</label>
                                                        <input type="text" className="form-control" name="Website"
                                                            value={formData.Website}
                                                            title="वेबसाइटमध्ये फक्त अक्षरे असू शकतात."
                                                            ref={WebsiteRef}
                                                            onChange={handleChange}
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
                            <div
                                className="accordion-card-one accordion"
                                id="accordionExample4"
                            >
                                <div className="accordion-item mbgcolor">
                                    <div className="accordion-header" id="headingFour">
                                        <div
                                            className=""
                                            data-bs-toggle="collapse"
                                            data-bs-target="#collapseFour"
                                            aria-controls="collapseFour"
                                        >
                                            <div className="text-editor add-list">
                                                <div className="addproduct-icon list">
                                                    <h5>
                                                        <List className="add-info" />
                                                        <span>व्यापार </span>
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
                                        <label label className="form-label">वरील माहिती सारखीच आहे</label>

                                    </div>

                                    <div
                                        id="collapseFour"
                                        className="accordion-collapse collapse show"
                                        aria-labelledby="headingFour"
                                        data-bs-parent="#accordionExample4"
                                    >


                                        <div className="add-product-new">
                                            <div className="row">
                                                <div className="col-lg-8 col-sm-6 col-12">
                                                    <div className="mb-3 add-product">
                                                        <label className="form-label required">व्यापाराचे नाव </label>
                                                        <input type="text" className="form-control" required
                                                            onChange={handleChange}
                                                            value={formData.TradeName} name="TradeName"
                                                            ref={TradeNameRef}
                                                            pattern="^[A-Za-z]+( [A-Za-z]+)*$" title="Name can only contain letters and spaces."
                                                            onKeyDown={(e) => handleEnterKey(e, GSTINRef)} />
                                                    </div>
                                                </div>
                                                <div className="col-lg-4 col-sm-6 col-12">
                                                    <div className="mb-3 add-product">
                                                        <label className="form-label">GSTIN</label>
                                                        <input type="text" className="form-control"
                                                            onChange={handleChange}
                                                            ref={GSTINRef}
                                                            value={formData.GSTIN} name="GSTIN"
                                                            pattern="^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9]{1}[A-Z]{1}[0-9]{1}$"
                                                            title="फक्त अक्षरे आणि अंकच स्वीकारले जातात."
                                                            onKeyDown={(e) => handleEnterKey(e, TradePincodeRef)} />
                                                    </div>
                                                </div>

                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-lg-4 col-sm-6 col-12">
                                                <div className="mb-3 add-product">
                                                    <label className="form-label ">पिनकोड </label>
                                                    <input type="text" className="form-control"
                                                        value={formData.TradePincode} name="TradePincode"
                                                        onChange={handleChange}
                                                        disabled={isChecked}
                                                        ref={TradePincodeRef}
                                                        pattern="^\d{6}$" title="पिनकोड फक्त सहा अंकी संख्या असावी."
                                                        onKeyDown={(e) => handleEnterKey(e, TradeBuildingRef)} />
                                                </div>
                                            </div>
                                            <div className="col-lg-4 col-sm-6 col-12">
                                                <div className="mb-3 add-product">
                                                    <label className="form-label ">Flat, House No, Building</label>
                                                    <input type="text" className="form-control"
                                                        value={formData.TradeBuilding} name="TradeBuilding"
                                                        disabled={isChecked}
                                                        onChange={handleChange}
                                                        ref={TradeBuildingRef}

                                                        onKeyDown={(e) => handleEnterKey(e, TradeAreaRef)} />
                                                </div>
                                            </div>
                                            <div className="col-lg-4 col-sm-6 col-12">
                                                <div className="mb-3 add-product">
                                                    <label className="form-label ">फ्लॅट, इमारत, घर क्रमांक</label>
                                                    <input type="text" className="form-control"
                                                        value={formData.TradeArea} name="TradeArea"
                                                        disabled={isChecked}
                                                        onChange={handleChange}
                                                        ref={TradeAreaRef}
                                                        onKeyDown={(e) => handleEnterKey(e, TradeLandmarkRef)} />
                                                </div>
                                            </div>


                                            <div className="col-lg-4 col-sm-6 col-12">
                                                <div className="mb-3 add-product">
                                                    <label className="form-label ">जवळचे महत्वाचे ठिकाण </label>
                                                    <input type="text" className="form-control"
                                                        value={formData.TradeLandmark} name="TradeLandmark"
                                                        disabled={isChecked}
                                                        onChange={handleChange}
                                                        ref={TradeLandmarkRef}
                                                        onKeyDown={(e) => handleEnterKey(e, CStateRef)} />
                                                </div>
                                            </div>
                                            <div className="col-lg-4 col-sm-6 col-12">
                                                <div className="mb-3 add-product">
                                                    <label className="form-label ">जिल्हा </label>
                                                    <Select
                                                        classNamePrefix="react-select"
                                                        options={sellingtype}
                                                        value={sellingtype.find(option => option.value === formData.selectedTradecity)}
                                                        // onChange={(selectedOption) => handleSelectChange(selectedOption, 'selectedTradecity')}
                                                        onChange={(selectedOption) => {
                                                            setFormData((prevData) => ({
                                                                ...prevData,
                                                                selectedTradecity: selectedOption ? selectedOption.value : "",
                                                            }));
                                                            if (PANRef.current) {
                                                                PANRef.current.focus();
                                                            }

                                                        }}
                                                        ref={CStateRef}
                                                        disabled={isChecked}
                                                        placeholder="Choose"
                                                        openMenuOnFocus={true}
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-lg-4 col-sm-6 col-12">
                                                <div className="mb-3 add-product">
                                                    <label className="form-label">पॅन नंबर </label>
                                                    <input type="text" className="form-control" pattern="^[A-Z]{5}[0-9]{4}[A-Z]{1}$"
                                                        onChange={handleChange}
                                                        value={formData.PAN} name="PAN"
                                                        ref={PANRef}
                                                        title="पॅन नंबर मध्ये  काही अक्षरे आणि अंक आवश्यक आहेत."
                                                        onKeyDown={(e) => handleEnterKey(e, BankNameRef)} />
                                                </div>
                                            </div>

                                        </div>
                                    </div>

                                </div>
                            </div>

                            {/* BankDetails */}
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

                                                    <span>बँकेची माहिती </span>
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
                                                        <label className="form-label">बँकेचे नाव </label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            ref={BankNameRef}
                                                            name="BankName"
                                                            value={formData.BankName}
                                                            onChange={handleChange}
                                                            pattern="^[A-Za-z]+( [A-Za-z]+)*$"
                                                            title=" बँकेच्या नावात फक्त अक्षरे आणि स्पेस असू शकतात."
                                                            onKeyDown={(e) => handleEnterKey(e, AccountNumberRef)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-6 col-sm-6 col-12">
                                                    <div className="mb-3 add-product">
                                                        <label className="form-label">बँक खाते क्रमांक</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            ref={AccountNumberRef}
                                                            name="AccountNumber"
                                                            value={formData.AccountNumber}
                                                            onChange={handleChange}
                                                            pattern="^\d{9,18}$"
                                                            title="बँक खात्याचा क्रमांक ९ ते १८ अंकांच्या दरम्यान असावा.."
                                                            onKeyDown={(e) => handleEnterKey(e, IFSCCodeRef)}
                                                        />

                                                    </div>
                                                </div>
                                            </div>

                                            <div className="row">
                                                <div className="col-lg-6 col-sm-6 col-12">
                                                    <div className="mb-3 add-product">
                                                        <label className="form-label">IFSC कोड </label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            ref={IFSCCodeRef}
                                                            name="IFSCCode"
                                                            value={formData.IFSCCode}
                                                            onChange={handleChange}
                                                            pattern="^[A-Z]{4}0[A-Z0-9]{6}$"
                                                            title="IFSC कोड हा ११ अक्षरांचा असावा, ज्याची सुरुवात ४ मोठ्या (Capital) अक्षरांनी होईल, त्यानंतर 0 (शून्य) आणि शेवटी ६ अल्फान्यूमेरिक (अक्षरे आणि अंक) वर्ण असावेत."
                                                            onKeyDown={(e) => handleEnterKey(e, BranchNameRef)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-6 col-sm-6 col-12">
                                                    <div className="mb-3 add-product">
                                                        <label className="form-label">शाखेचे नाव</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            ref={BranchNameRef}
                                                            name="BranchName"
                                                            value={formData.BranchName}
                                                            onChange={handleChange}
                                                            pattern="^[a-zA-Z\s]{3,50}$"
                                                            title="शाखेच्या नावामध्ये फक्त अक्षरे आणि शब्दांमधील स्पेस असाव्यात, आणि ते ३ ते ५० अक्षरांपर्यंत लांब असावे."
                                                            onKeyDown={(e) => handleEnterKey(e, AccountantnameRef)} />
                                                    </div>
                                                </div>
                                                <div className="col-lg-6 col-sm-6 col-12">
                                                    <div className="mb-3 add-product">
                                                        <label className="form-label">खातेधारकाचे नाव </label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            ref={AccountantnameRef}
                                                            name="Accountantname"
                                                            value={formData.Accountantname}
                                                            onChange={handleChange}
                                                            //pattern="^[a-zA-Z\s]$"
                                                            title="खातेधारकाच्या नावामध्ये फक्त अक्षरे आणि स्पेस असाव्यात"
                                                            onKeyDown={(e) => handleEnterKey(e, submitRef)}
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
                                    <button className="btn btn-submit"
                                        ref={submitRef}>
                                        सेव्ह
                                    </button>
                                </div>
                            </div>



                        </div>
                    </div>
                </form>

            </div>
            <Addunits />
            <AddCategory />
            <AddBrand />
        </div>

    );
};

export default AddVendor;
