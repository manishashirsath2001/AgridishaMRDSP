import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from "react-router-dom";
import Select from "react-select";
import { all_routes } from "../../Router/all_routes";
import Addunits from "../../core/modals/inventory/addunits";
import AddCategory from "../../core/modals/inventory/addcategory";
import AddBrand from "../../core/modals/addbrand";
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

const AddCompany = () => {

    const location = useLocation();
    const { CPAID } = location.state || {};
    console.log('CPAID', CPAID);
    const { isAuthenticated, userdetail } = getUserData();
    if (isAuthenticated == true) {
        console.log("user", userdetail);
        console.log("getUserData", getUserData);
    }

    const companyidRef = useRef();
    const cnameRef = useRef();
    const ccontactRef = useRef();
    const cemailRef = useRef();
    const cpincodeRef = useRef();
    const cregnoRef = useRef();
    const cregdateRef = useRef();
    const cpanRef = useRef();
    const cgstnoRef = useRef();
    const cifscRef = useRef();
    const caccountnameRef = useRef();
    const cbranchnameRef = useRef();
    const caccountnumberRef = useRef();
    const cbanknameRef = useRef();
    const openingdtRef = useRef();
    const telephoneRef = useRef();
    const statusRef = useRef();
    const addressRef = useRef();
    const areaRef = useRef();
    const LandmarkRef = useRef();
    const DistrictRef = useRef();
    const StateRef = useRef();
    const OpeningDateRef = useRef();
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

    const [formData, setFormData] = useState({
        companyid: '',
        cname: '',
        ctelephone: '',
        ccontact: '',
        cemail: '',
        caddress: '',
        carea: '',
        clandmark: '',
        ccity: '',
        cstate: '',
        cpincode: '',
        cregno: '',
        cregdate: '',
        openingdt: '',
        ctype: '',
        cpan: '',
        cgstno: '',
        cstatus: '',
        cifsc: '',
        caccountname: '',
        caccountnumber: '',
        cbankname: '',
        cbranchname: ''
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
                            sstatename, said }) => ({
                                label: sstatename,
                                value: said,
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
        if (CPAID) {
            const fetchData = async () => {
                try {
                    const payload = {
                        "cpaid": CPAID
                    }
                    const headers = {
                        "Content-Type": "application/json",
                        Accept: "*/*",
                    };

                    axios({
                        method: "POST",
                        url: baseUrl.Url + "/backend/api/GET_CompanyMaster",
                        data: JSON.stringify(payload),
                        headers: headers,
                    })
                        .then((response) => {
                            if (response.status != 200) throw new Error("Failed to Fetching Data");
                            const DATA = response.data[0];
                            setFormData({
                                companyid: DATA.companyid || '',
                                cname: DATA.cname || '',
                                ccontact: DATA.ccontact || '',
                                ctelephone: DATA.ctelephone || '',
                                cemail: DATA.cemail || '',
                                caddress: DATA.caddress || '',
                                carea: DATA.carea || '',
                                clandmark: DATA.clandmark || '',
                                ccity: sellingtype.find((state) => state.value == DATA.ccity)?.value || '',
                                cstate: statetype.find((state) => state.value == DATA.cstate)?.value || '',
                                cpincode: DATA.cpincode || '',
                                cregno: DATA.cregno || '',
                                cregdate: convertToISODate(DATA.cregdate) || '',
                                openingdt: convertToISODate(DATA.openingdt) || '',
                                ctype: DATA.ctype || '',
                                cpan: DATA.cpan || '',
                                cgstno: DATA.cgstno || '',
                                cstatus: DATA.cstatus || '',
                                cifsc: DATA.cifsc || '',
                                caccountname: DATA.caccountname || '',
                                caccountnumber: DATA.caccountnumber || '',
                                cbankname: DATA.cbankname || '',
                                cbranchname: DATA.cbranchname || '',

                            });
                        })

                } catch (error) {
                    console.error("Error fetching Access Right Data:", error);
                }

            };
            fetchData();
        }
    }, [CPAID]);


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

        if (cregnoRef.current) {
            cregnoRef.current.focus();
        }

    }, []);



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

        try {

            const payload = {
                "cpaid": CPAID ? CPAID : GUID,
                "companyid": formData.companyid,
                "cname": formData.cname,
                "ctelephone": formData.ctelephone,
                "ccontact": formData.ccontact,
                "cemail": formData.cemail,
                "caddress": formData.caddress,
                "carea": formData.carea,
                "clandmark": formData.clandmark,
                "ccity": formData.ccity,
                "cstate": formData.cstate,
                "cpincode": formData.cpincode,
                "cregno": formData.cregno,
                "cregdate": formData.cregdate,
                "openingdt": formData.openingdt,
                "ctype": formData.ctype,
                "cpan": formData.cpan,
                "cgstno": formData.cgstno,
                "cstatus": formData.cstatus,
                "cifsc": formData.cifsc,
                "caccountname": formData.caccountname,
                "caccountnumber": formData.caccountnumber,
                "cbankname": formData.cbankname,
                "cbranchname": formData.cbranchname,
            };

            console.log('payload', payload)
            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            axios({
                method: "POST",
                url: baseUrl.Url + "/backend/api/AddUpdCompany",
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


            navigate(route.CompanyMaster);
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
                navigate(route.CompanyMaster)
            }
        });
    };



    const validateinput = (e) => {

        const { companyid, cname, ccontact, cemail, cpincode, cregno, cregdate, cpan, cgstno, cifsc, caccountname,
            caccountnumber, cbankname, cbranchname, openingdt } = formData;

        if (
            (!cname || !/^[A-Za-z]+( [A-Za-z]+)*$/.test(cname)) ||
            (!companyid || companyid.trim() === '') ||
            (!ccontact || !/^[789]\d{9}$/.test(ccontact)) ||
            (!cregno || cregno.trim() === '') ||
            (!cregdate || cregdate.trim() === '') ||
            (!openingdt || openingdt.trim() === '') ||
            (cpincode && !/^\d{6}$/.test(cpincode)) ||
            (cemail && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(cemail)) ||
            (cgstno && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9]{1}[A-Z]{1}[0-9]{1}$/.test(cgstno)) ||
            (cbankname && !/^[A-Za-z]+( [A-Za-z]+)*$/.test(cbankname)) ||
            (caccountnumber && !/^\d{9,18}$/.test(caccountnumber)) ||
            (cifsc && !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(cifsc)) ||
            (cbranchname && !/^[a-zA-Z\s]{3,50}$/.test(cbranchname)) ||
            (caccountname && !/^[a-zA-Z\s]$/.test(caccountname)) ||
            (cpan && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(cpan))) {
            Swal.fire({
                icon: "error",
                title: "वैधता त्रुटी",
                text: "कृपया सर्व आवश्यक फील्ड भराः",
                allowOutsideClick: false,
                allowEscapeKey: false,

            }).then(() => {
                cnameRef.current.focus();
                companyidRef.current.focus();
                ccontactRef.current.focus();
                cpincodeRef.current.focus();
                cregnoRef.current.focus();
                cregdateRef.current.focus();
                cemailRef.current.focus();
                cgstnoRef.current.focus();
                cbanknameRef.current.focus();
                caccountnumberRef.current.focus();
                cifscRef.current.focus();
                cbranchnameRef.current.focus();
                caccountnameRef.current.focus();
                cpanRef.current.focus();
                openingdtRef.current.focus();

            })
            return;
        }
        handleSubmit(e);
    }
    // const handleChange = async (e) => {
    //     const { name, value } = e.target;
    //     setFormData((prevData) => ({
    //         ...prevData,
    //         [name]: value,
    //     }));

    //     if (name === "cpincode" && value.length === 6) {
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
    //                     cstate: response.data[0].said || '',
    //                     ccity: response.data[0].said || '',
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

        if (name === "cpincode") {
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
                            cstate: response.data[0]?.said || '',
                            ccity: response.data[0]?.said || '',
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
    const [status, setStatus] = useState([]);


    const fetchstatus = async () => {
        try {
            const response = await axios.get(
                baseUrl.Url + "/backend/api/Implications/STATUS",

            );

            if (response.status !== 200) throw new Error("Failed to fetch implications data");

            const data = response.data;
            const implicationsDropdown = data.map(({ iTitle, iValue }) => ({
                label: iTitle,
                value: iValue,
            }));

            setStatus(implicationsDropdown);
        } catch (error) {
            console.error("Error fetching implications:", error);
        }
    };
    useEffect(() => {
        fetchstatus();

    }, []);
    const [companytype, setcompanytype] = useState([]);
    const fetchcompanytype = async () => {
        try {
            const response = await axios.get(
                baseUrl.Url + "/backend/api/Implications/COMPANYT",

            );

            if (response.status !== 200) throw new Error("Failed to fetch implications data");

            const data = response.data;
            const implicationsDropdown = data.map(({ iTitle, iValue }) => ({
                label: iTitle,
                value: iValue,
            }));

            setcompanytype(implicationsDropdown);
        } catch (error) {
            console.error("Error fetching implications:", error);
        }
    };
    useEffect(() => {
        fetchcompanytype();

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
        <div className="page-wrapper ">
            <div className="content">
                <div className="page-header">
                    <div className="add-item d-flex">
                        <div className="page-title">
                            <h4>कंपनी माहिती व्यवस्थापन</h4>
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
                        <Link to={route.CompanyMaster} className="btn btn-secondary">
                            <ArrowLeft className="me-2" />
                            मागे
                        </Link>
                    </div>
                </div>
                {/* /add */}
                <form onSubmit={handleSubmit}>
                    <div className="card mbgcolor">
                        <div className="card-body add-product pb-0 mbgcolor">

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

                                                    <span>कंपनी माहिती</span>
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
                                        <div className="accordion-body mbgcolor">
                                            <div className="row">
                                                <div className="col-lg-2 col-sm-6 col-12">
                                                    <div className="mb-3 add-product">
                                                        <label className="form-label required">कंपनी नोंदणी क्रमांक</label>
                                                        <input type="text" className="form-control"
                                                            title="नोंदणी आयडी आवश्यक आहे"
                                                            value={formData.cregno}
                                                            name="cregno"
                                                            ref={cregnoRef}
                                                            onChange={handleChange}
                                                            onKeyDown={(e) => handleEnterKey(e, cregdateRef)} />
                                                    </div>
                                                </div>
                                                <div className="col-lg-2 col-sm-6 col-12">
                                                    <div className="mb-3 add-product">
                                                        <label className="form-label required">कंपनी नोंदणी तारीख</label>
                                                        <input
                                                            type="date"
                                                            className="form-control"
                                                            title="कंपनी नोंदणी तारीख आवश्यक आहे"
                                                            value={formData.cregdate}
                                                            name="cregdate"
                                                            ref={cregdateRef}
                                                            onChange={handleChange}
                                                            onKeyDown={(e) => handleEnterKey(e, openingdtRef)} />
                                                    </div>
                                                </div>
                                                <div className="col-lg-2 col-sm-6 col-12">
                                                    <div className="mb-3 add-product">
                                                        <label className="form-label required">कंपनी सुरुवात तारीख</label>
                                                        <input
                                                            type="date"
                                                            className="form-control"
                                                            title="कंपनी सुरुवात तारीख आवश्यक आहे"
                                                            value={formData.openingdt}
                                                            name="openingdt"
                                                            ref={openingdtRef}
                                                            onChange={handleChange}
                                                            onKeyDown={(e) => handleEnterKey(e, OpeningDateRef)} />
                                                    </div>
                                                </div>
                                                <div className="col-lg-6 col-sm-6 col-12">
                                                    <div className="mb-3 add-product">
                                                        <label className="form-label required">कंपनी प्रकार</label>
                                                        <Select
                                                            classNamePrefix="react-select"
                                                            options={companytype}
                                                            value={companytype.find((option) => option.value === formData.ctype) || null}
                                                            placeholder="निवडा"
                                                            onChange={(selectedOption) => {
                                                                setFormData((prevData) => ({
                                                                    ...prevData,
                                                                    ctype: selectedOption ? selectedOption.value : "",
                                                                }));
                                                                if (companyidRef.current) {
                                                                    companyidRef.current.focus();
                                                                }
                                                            }}
                                                            required
                                                            ref={OpeningDateRef}

                                                            openMenuOnFocus={true}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-lg-3 col-sm-6 col-12">
                                                    <div className="mb-3 add-product">
                                                        <label className="form-label required">कंपनी आयडी</label>
                                                        <input type="text" className="form-control"
                                                            title="कंपनी आयडी आवश्यक आहे"
                                                            value={formData.companyid} name="companyid"
                                                            ref={companyidRef}
                                                            onChange={handleChange}
                                                            onKeyDown={(e) => handleEnterKey(e, cnameRef)} />
                                                    </div>
                                                </div>
                                                <div className="col-lg-6 col-sm-6 col-12">
                                                    <div className="form-label add-product">
                                                        <label className="form-label required">कंपनी नाव</label>
                                                        <input type="text" className="form-control"
                                                            name="cname"
                                                            value={formData.cname}
                                                            pattern="^[A-Za-z]+( [A-Za-z]+)*$"
                                                            title="नावामध्ये फक्त अक्षरे असू शकतात"
                                                            onChange={handleChange}
                                                            required
                                                            onKeyDown={(e) => handleEnterKey(e, telephoneRef)}
                                                            ref={cnameRef}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-3 col-sm-6 col-12">
                                                    <div className="mb-3 add-product">
                                                        <label className="form-label">टेलिफोन नंबर</label>
                                                        <input type="text" className="form-control"
                                                            title="टेलिफोन नंबर दहा अंकी असावा"
                                                            value={formData.ctelephone} name="ctelephone"
                                                            onChange={handleChange}
                                                            onKeyDown={(e) => handleEnterKey(e, cemailRef)}
                                                            ref={telephoneRef} />
                                                    </div>
                                                </div>



                                            </div>
                                            <div className="row">
                                                <div className="col-lg-3 col-sm-6 col-12">
                                                    <div className="mb-3 add-product">
                                                        <label className="form-label">ई-मेल</label>
                                                        <input type="text" className="form-control"
                                                            pattern="/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/"
                                                            value={formData.cemail} name="cemail"
                                                            ref={cemailRef}
                                                            onChange={handleChange}
                                                            onKeyDown={(e) => handleEnterKey(e, ccontactRef)} />
                                                    </div>
                                                </div>

                                                <div className="col-lg-3 col-sm-6 col-12">
                                                    <div className="form-label add-product">
                                                        <label className="form-label required">फोन नंबर </label>
                                                        <input type="text" className="form-control"
                                                            value={formData.ccontact} name="ccontact"
                                                            title="फोन नंबर नंबर दहा अंकी असावा "
                                                            ref={ccontactRef}
                                                            onChange={handleChange}
                                                            onKeyDown={(e) => handleEnterKey(e, cpanRef)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-3 col-sm-6 col-12">
                                                    <div className="mb-3 add-product">
                                                        <label className="form-label required">पॅन नंबर</label>
                                                        <input type="text" className="form-control"
                                                            onChange={handleChange}
                                                            value={formData.cpan} name="cpan"
                                                            ref={cpanRef}
                                                            title="पॅन नंबर मध्ये  काही अक्षरे आणि अंक आवश्यक आहेत."
                                                            onKeyDown={(e) => handleEnterKey(e, cgstnoRef)} />
                                                    </div>
                                                </div>
                                                <div className="col-lg-3 col-sm-6 col-12">
                                                    <div className="form-label add-product">
                                                        <label className="form-label required">जीएसटी नंबर</label>
                                                        <input type="text" className="form-control" name="cgstno"
                                                            value={formData.cgstno}
                                                            title="GST नंबर मध्ये  अक्षरे असू शकत नाहीत."
                                                            onChange={handleChange}
                                                            ref={cgstnoRef}
                                                            onKeyDown={(e) => handleEnterKey(e, cpincodeRef)}
                                                        />
                                                    </div>
                                                </div>
                                                <div />
                                            </div>

                                            <div className="row">
                                                <div className="col-lg-3 col-sm-6 col-12">
                                                    <div className="mb-3 add-product required">
                                                        <label className="form-label">पिनकोड</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            onChange={handleChange}
                                                            ref={cpincodeRef}
                                                            value={formData.cpincode}
                                                            name="cpincode"
                                                            title="फक्त सहा अंकी संख्या असावी."
                                                            onKeyDown={(e) => handleEnterKey(e, addressRef)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-3 col-sm-6 col-12">
                                                    <div className="mb-3 add-product">
                                                        <label className="form-label">फ्लॅट,इमारत,घर क्रमांक</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            value={formData.caddress}
                                                            name="caddress"
                                                            onChange={handleChange}
                                                            onKeyDown={(e) => handleEnterKey(e, areaRef)}
                                                            ref={addressRef}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-3 col-sm-6 col-12">
                                                    <div className="mb-3 add-product">
                                                        <label className="form-label">परिसर, विभाग, गाव</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            value={formData.carea}
                                                            name="carea"
                                                            onChange={handleChange}
                                                            onKeyDown={(e) => handleEnterKey(e, LandmarkRef)}
                                                            ref={areaRef}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-3 col-sm-6 col-12">
                                                    <div className="mb-3 add-product">
                                                        <label className="form-label">जवळचे महत्वाचे ठिकाण</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            value={formData.clandmark}
                                                            name="clandmark"
                                                            onChange={handleChange}
                                                            ref={LandmarkRef}
                                                            onKeyDown={(e) => handleEnterKey(e, DistrictRef)}

                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-3 col-sm-6 col-12">
                                                    <div className="mb-3 add-product">
                                                        <label className="form-label">जिल्हा</label>
                                                        <Select
                                                            classNamePrefix="react-select"
                                                            options={sellingtype}
                                                            value={sellingtype.find(option => option.value === formData.ccity)}
                                                            onChange={(selectedOption) => handleSelectChange(selectedOption, 'ccity')}
                                                            placeholder="निवडा"
                                                            openMenuOnFocus={true}
                                                            ref={DistrictRef}
                                                            onKeyDown={(e) => handleEnterKey(e, StateRef)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-3 col-sm-6 col-12">
                                                    <div className="mb-3 add-product">
                                                        <label className="form-label">राज्य</label>
                                                        <Select
                                                            classNamePrefix="react-select"
                                                            options={statetype}
                                                            value={statetype.find(option => option.value === formData.cstate)}
                                                            onChange={(selectedOption) => handleSelectChange(selectedOption, 'cstate')}
                                                            placeholder="निवडा"
                                                            openMenuOnFocus={true}
                                                            ref={StateRef}
                                                            onKeyDown={(e) => handleEnterKey(e, cbanknameRef)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>


                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div
                                className="accordion-card-one accordion"
                                id="accordionExample">
                                <div className="accordion-item mbgcolor">
                                    <div className="accordion-header" id="headingTwo">
                                        <div
                                            className=""
                                            data-bs-toggle="collapse"
                                            data-bs-target="#collapseTwo"
                                            aria-controls="collapseTwo"
                                        >
                                            <div className="addproduct-icon">
                                                <h5 >
                                                    <Info className="add-info" />

                                                    <span>बँकेची माहिती</span>
                                                </h5>
                                                <Link to="#">
                                                    <ChevronDown className="chevron-down-add" />
                                                </Link>
                                            </div>

                                        </div>
                                    </div>
                                    <div
                                        id="collapseTwo"
                                        className="accordion-collapse collapse show"
                                        aria-labelledby="headingTwo"
                                        data-bs-parent="#accordionExample"
                                    >
                                        <div className="accordion-body">

                                            <div className="row">
                                                <div className="col-lg-6 col-sm-6 col-12">
                                                    <div className="mb-3 add-product">
                                                        <label className="form-label">बँकेचे नाव</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            ref={cbanknameRef}
                                                            name="cbankname"
                                                            value={formData.cbankname}
                                                            onChange={handleChange}
                                                            onKeyDown={(e) => handleEnterKey(e, cbranchnameRef)}
                                                            pattern="^[A-Za-z]+( [A-Za-z]+)*$"
                                                            title=" बँकेच्या नावामध्ये फक्त अक्षरे आणि शब्दांमधील स्पेस असू शकतात."
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-6 col-sm-6 col-12">
                                                    <div className="mb-3 add-product">
                                                        <label className="form-label">बँकेच्या शाखेचे नाव</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            ref={cbranchnameRef}
                                                            name="cbranchname"
                                                            value={formData.cbranchname}
                                                            onChange={handleChange}
                                                            onKeyDown={(e) => handleEnterKey(e, caccountnumberRef)}
                                                            pattern="^[a-zA-Z\s]{3,50}$"
                                                            title="शाखेच्या नावामध्ये फक्त अक्षरे आणि शब्दांमधील स्पेस असाव्यात, आणि ते ३ ते ५० अक्षरांपर्यंत लांब असावे."
                                                        />
                                                    </div>
                                                </div>

                                            </div>

                                            <div className="row">
                                                <div className="col-lg-4 col-sm-6 col-12">
                                                    <div className="mb-3 add-product">
                                                        <label className="form-label">बँक खाते नंबर</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            ref={caccountnumberRef}
                                                            name="caccountnumber"
                                                            value={formData.caccountnumber}
                                                            onChange={handleChange}
                                                            onKeyDown={(e) => handleEnterKey(e, cifscRef)}
                                                            pattern="^\d{9,18}$"
                                                            title="बँक खात्याचा क्रमांक ९ ते १८ अंकांच्या दरम्यान असावा."
                                                        />

                                                    </div>
                                                </div>
                                                <div className="col-lg-4 col-sm-6 col-12">
                                                    <div className="mb-3 add-product">
                                                        <label className="form-label">आयएफएससी कोड</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            ref={cifscRef}
                                                            name="cifsc"
                                                            value={formData.cifsc}
                                                            onChange={handleChange}
                                                            onKeyDown={(e) => handleEnterKey(e, caccountnameRef)}
                                                            title="IFSC कोड हा ११ अक्षरांचा असावा, त्याची सुरुवात ४ मोठ्या अक्षरांनी (Capital Letters) व्हावी, त्यानंतर 0 (शून्य) असावा आणि शेवटी ६ अल्फान्यूमेरिक (अक्षरे व अंक) वर्ण "

                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-lg-4 col-sm-6 col-12">
                                                    <div className="mb-3 add-product">
                                                        <label className="form-label">खातेधारकाचे नाव</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            ref={caccountnameRef}
                                                            name="caccountname"
                                                            value={formData.caccountname}
                                                            onChange={handleChange}
                                                            onKeyDown={(e) => handleEnterKey(e, statusRef)}
                                                            title="खातेधारकाचे नाव फक्त अक्षरे आणि शब्दांमधील स्पेस असलेले असावे.."
                                                        />
                                                    </div>
                                                </div>

                                            </div>
                                            <div className='row'>
                                                <div className="col-lg-4 col-md-6 ms-auto">
                                                    <div className="mb-3">
                                                        <label className="form-label required">स्थिती</label>
                                                        <Select
                                                            classNamePrefix="react-select"
                                                            options={status}
                                                            value={status.find((option) => option.value === formData.cstatus) || null}
                                                            placeholder="निवडा"
                                                            onChange={(selectedOption) => {
                                                                setFormData((prevData) => ({
                                                                    ...prevData,
                                                                    cstatus: selectedOption ? selectedOption.value : "",
                                                                }));
                                                                if (submitRef.current) {
                                                                    submitRef.current.focus();
                                                                }
                                                            }}
                                                            required
                                                            openMenuOnFocus={true}
                                                            ref={statusRef}

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
            <Addunits />
            <AddCategory />
            <AddBrand />
        </div>

    );
};

export default AddCompany;
