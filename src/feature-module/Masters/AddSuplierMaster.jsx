import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from "react-router-dom";
import Select from "react-select";
import { all_routes } from "../../Router/all_routes";
import Addunits from "../../core/modals/inventory/addunits";
import AddCategory from "../../core/modals/inventory/addcategory";
import AddBrand from "../../core/modals/addbrand";
import axios from "axios";
import { ACSPLGUID, baseUrl } from "../../core/json/custom";
import { getUserData } from "../../Context/UserData";
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
    PlusCircle,

} from "feather-icons-react/build/IconComponents";
import { useDispatch, useSelector } from "react-redux";
import { setToogleHeader } from "../../core/redux/action";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

const AddSupplier = () => {

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

    const sellingtype = [
        { value: "choose", label: "Choose" },
        { value: "transactionalSelling", label: "Transactional selling" },
        { value: "solutionSelling", label: "Solution selling" },
    ];

    const BusinessType = [
        { value: "importer", label: "importer" },
        { value: "Job Worker", label: "Job Worker " },
        { value: "Packing", label: "Packing " },
        { value: "other", label: "other " },
    ];

    const [isChecked, setIsChecked] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        Business: '',
        selectedType: "1",
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


    // const nameInputRef = useRef(''); // Create a ref for the name input
    useEffect(() => {
        if (CAID) {
            const fetchData = async () => {
                try {
                    const payload = {
                        "pkid": CAID
                        , "ctype": "1"
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



    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value,

        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        showConfirmationAlert(event);
    };

    const handleFormSubmission = async () => {

        try {

            const payload = {
                "caid": CAID ? CAID : GUID,
                "ccompanyname": formData.Business,
                "ctype": formData.selectedType,
                "caddress": formData.Building,
                "ccity": formData.selectedcity,
                "cpincode": formData.Pincode,
                "ctelephonenumber": formData.Teliphone,
                "cemail": formData.Email,
                "cwebsiteurl": formData.Website,
                "ccontactpersonname": formData.name,
                "ccontactpersonmobile": formData.phone,
                "cdesignation": "",
                "cgstin": formData.GSTIN,
                "ctradename": formData.TradeName,
                "ctradeaddress": formData.TradeBuilding,
                "ctradecity": formData.selectedTradecity,
                "ctradepincode": formData.TradePincode,
                "cstate": formData.selectedstate,
                "cdistance": "",
                "cpan": formData.PAN,
                "cbusinesstype": formData.BusinessType,
                "cstatus": "",
                "cifsc": "",
                "caccountname": "",
                "caccountnumber": 0,
                "cbankname": "",
                "cbranchname": "",
                "carea": formData.Area,
                "clandmark": formData.Landmark,
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
                url: baseUrl.Url + "/backend/api/CustomersPartners",
                data: JSON.stringify(payload),
                headers: headers,
            })
            // console.log("API Response:", response.data);

            Swal.fire({
                icon: "success",
                title: "संचित केले!",
                text: "माहिती यशस्वीरीत्या संचित झाली आहे.",
                confirmButtonText: "ठीक आहे",
                allowOutsideClick: false,
                allowEscapeKey: false

            });


            navigate(route.SupplierMaster);
        } catch (error) {
            console.error("Submission Error:", error);
            Swal.fire({
                icon: "error",
                title: "त्रुटी",
                text: "माहिती जतन करण्यात अयशस्वी. कृपया पुन्हा प्रयत्न करा.",
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
    const showExitAlert = () => {
        MySwal.fire({
            title: "तुम्हाला खात्री आहे का?",
            text: "तुम्हाला बाहेर पडायचे आहे का?",
            showCancelButton: true,
            confirmButtonColor: "#00ff00",
            confirmButtonText: "होय",
            cancelButtonColor: "#092C4C",
            cancelButtonText: "नाही",
            allowOutsideClick: false,
            allowEscapeKey: false

        }).then((result) => {
            if (result.isConfirmed) {
                navigate(route.SupplierMaster)
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
                title: "चुकिची माहिती",
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




    return (
        <div className="page-wrapper">
            <div className="content">
                <div className="page-header">
                    <div className="add-item d-flex">
                        <div className="page-title">
                            <h4>पुरवठादार व्यवस्थापित करा</h4>
                            <h6>नवीन पुरवठादार तयार करा</h6>

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
                        <Link to={route.SupplierMaster} className="btn btn-secondary">
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
                                                <h5>
                                                    <Info className="add-info" />
                                                    <span>पुरवठादार माहिती</span>
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
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            name="Business"
                                                            value={formData.Business}
                                                            pattern="^[A-Za-z]+( [A-Za-z]+)*$"
                                                            title="नाव मध्ये फक्त अक्षरे आणि स्पेस असू शकतात."
                                                            onChange={handleChange}
                                                            required
                                                            ref={BusinessRef}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-4 col-sm-6 col-12">
                                                    <div className="mb-3 add-product">
                                                        <div className="add-newplus">
                                                            <label className="form-label required">व्यवसाय प्रकार</label>
                                                            <Link
                                                                to="#"
                                                                data-bs-toggle="modal"
                                                                data-bs-target="#add-units-category"
                                                            >
                                                                <PlusCircle className="plus-down-add" />
                                                                <span>नवीन जोडा</span>
                                                            </Link>
                                                        </div>
                                                        <Select
                                                            classNamePrefix="react-select"
                                                            options={BusinessType}
                                                            ref={BusinesstypeRef}
                                                            required
                                                            value={BusinessType.find(option => option.value === formData.BusinessType)}
                                                            onChange={(selectedOption) => handleSelectChange(selectedOption, 'BusinessType')}
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
                                                            ref={PincodeRef}
                                                            value={formData.Pincode}
                                                            name="Pincode"
                                                            pattern="^\d{6}$"
                                                            title="फक्त सहा अंकांचे पिनकोड असावे."
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-4 col-sm-6 col-12">
                                                    <div className="mb-3 add-product">
                                                        <label className="form-label">फ्लॅट, घर क्रमांक, इमारत</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            value={formData.Building}
                                                            name="Building"
                                                            onChange={handleChange}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-4 col-sm-6 col-12">
                                                    <div className="mb-3 add-product">
                                                        <label className="form-label">एरिया, सेक्टर, गाव</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            value={formData.Area}
                                                            name="Area"
                                                            onChange={handleChange}
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
                                                            value={sellingtype.find(option => option.value === formData.selectedcity)}
                                                            onChange={(selectedOption) => handleSelectChange(selectedOption, 'selectedcity')}
                                                            placeholder="निवडा"
                                                            openMenuOnFocus={true}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-4 col-sm-6 col-12">
                                                    <div className="mb-3 add-product">
                                                        <label className="form-label">राज्य</label>
                                                        <Select
                                                            classNamePrefix="react-select"
                                                            options={sellingtype}
                                                            value={sellingtype.find(option => option.value === formData.selectedstate)}
                                                            onChange={(selectedOption) => handleSelectChange(selectedOption, 'selectedstate')}
                                                            placeholder="निवडा"
                                                            openMenuOnFocus={true}
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
                                                            title="दूरध्वनी नंबर १० अंकांचा असावा."
                                                            value={formData.Teliphone}
                                                            name="Teliphone"
                                                            ref={TeliphoneRef}
                                                            onChange={handleChange}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-4 col-sm-6 col-12">
                                                    <div className="mb-3 add-product">
                                                        <label className="form-label">ई-मेल</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            pattern="/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/"
                                                            value={formData.Email}
                                                            name="Email"
                                                            ref={EmailRef}
                                                            onChange={handleChange}
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
                                                            title="फोन नंबर १० अंकांचा असावा."
                                                            ref={phoneRef}
                                                            onChange={handleChange}
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
                                                            pattern="^[A-Za-z]+( [A-Za-z]+)*$"
                                                            title="नाव मध्ये फक्त अक्षरे आणि स्पेस असू शकतात."
                                                            ref={nameRef}
                                                            onChange={handleChange}
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
                                        <label className="form-label">वर दिलेल्या पत्त्यासारखे</label>

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
                                                        <label className="form-label required">व्यापार नाव</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            required
                                                            onChange={handleChange}
                                                            ref={TradeNameRef}
                                                            value={formData.TradeName}
                                                            name="TradeName"
                                                            pattern="^[A-Za-z]+( [A-Za-z]+)*$"
                                                            title="नावात फक्त अक्षरे आणि स्पेस असू शकतात."
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-lg-4 col-sm-6 col-12">
                                                    <div className="mb-3 add-product">
                                                        <label className="form-label">जीएसटीआयएन</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            onChange={handleChange}
                                                            ref={GSTINRef}
                                                            value={formData.GSTIN}
                                                            name="GSTIN"
                                                            pattern="^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9]{1}[A-Z]{1}[0-9]{1}$"
                                                            title="फक्त अल्फान्यूमेरिक अक्षरे वापरू शकता."
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
                                                        ref={TradePincodeRef}
                                                        onChange={handleChange}
                                                        disabled={isChecked}
                                                        pattern="^\d{6}$"
                                                        title="फक्त सहा अंकी संख्या असावी."
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
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-lg-4 col-sm-6 col-12">
                                                <div className="mb-3 add-product">
                                                    <label className="form-label">व्यापार क्षेत्र, सेक्टर, गाव</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={formData.TradeArea}
                                                        name="TradeArea"
                                                        disabled={isChecked}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-lg-4 col-sm-6 col-12">
                                                <div className="mb-3 add-product">
                                                    <label className="form-label">व्यापार ठिकाण</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={formData.TradeLandmark}
                                                        name="TradeLandmark"
                                                        disabled={isChecked}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-lg-4 col-sm-6 col-12">
                                                <div className="mb-3 add-product">
                                                    <label className="form-label">व्यापार शहर</label>
                                                    <Select
                                                        classNamePrefix="react-select"
                                                        options={sellingtype}
                                                        value={sellingtype.find((option) => option.value === formData.selectedTradecity)}
                                                        onChange={(selectedOption) => handleSelectChange(selectedOption, 'selectedTradecity')}
                                                        disabled={isChecked}
                                                        placeholder="निवडा"
                                                        openMenuOnFocus={true}
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-lg-4 col-sm-6 col-12">
                                                <div className="mb-3 add-product">
                                                    <label className="form-label">पॅन नंबर</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        pattern="^[A-Z]{5}[0-9]{4}[A-Z]{1}$"
                                                        onChange={handleChange}
                                                        value={formData.PAN}
                                                        name="PAN"
                                                        ref={PANRef}
                                                        title="पॅन नंबर मध्ये अक्षरे आणि अंक असावेत."
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
                                    <button className="btn btn-submit">
                                        सेव्ह
                                    </button>
                                </div>
                            </div>


                        </div>
                    </div>

                </form>

            </div >
            <Addunits />
            <AddCategory />
            <AddBrand />
        </div >
    );
};

export default AddSupplier;
