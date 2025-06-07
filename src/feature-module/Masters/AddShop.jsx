import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import { ChevronDown, ChevronUp, Info, ArrowLeft } from "feather-icons-react/build/IconComponents";
import { useDispatch, useSelector } from "react-redux";
import { setToogleHeader } from "../../core/redux/action";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { all_routes } from "../../Router/all_routes";
import withReactContent from "sweetalert2-react-content";
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { baseUrl, ACSPLGUID, convertToISODate } from "../../core/json/custom";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { getUserData } from '../../Context/UserData'
import AddCategory from "../../core/modals/inventory/addcategory";

import {

    Edit,
    Eye,
    RefreshCcw,
    PlusCircle,
    RotateCcw,


    Trash2,
} from "feather-icons-react/build/IconComponents";
import AddShopLocation from "./AddShopLocation";
// import AddShoploc from "../../core/modals/inventory/AddShoploc";
const AddShop = () => {
    const [ShopLocation, setShopLocation] = useState([]);
    const GUID = ACSPLGUID.getNew();
    const GUID1 = ACSPLGUID.getNew();
    const route = all_routes;
    const MySwal = withReactContent(Swal)
    const navigate = useNavigate();
    const location = useLocation();
    const userdetail = getUserData();
    const { storid, storeid } = location.state || {};

    console.log("Received storid:", storid);
    console.log("Received storeidstoreidstoreid:", storeid);



    const [formData, setFormData] = useState({
        Sid: "",
        SName: "",
        Slocation: "",
        SRent: "",
        SDeposit: "",
        SCapacity: "",
        ststus: "",
    });


    const [storeID, setStoreID] = useState("");

    useEffect(() => {
        setStoreID(generateUniqueStoreID());
    }, []);
    //for text data
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // for dropdown data 
    const handleSelectChange = (selectedOption, field) => {
        setFormData(prevData => ({
            ...prevData,
            [field]: selectedOption ? selectedOption.value : "", // Shop only the 'value' of the selected option
        }));
    };



    const handleSubmit = (e) => {
        e.preventDefault();
        showConfirmationAlert(e);
        validateinput(e);

    };



    const showConfirmationAlert = () => {
        MySwal.fire({
            // title: "Are you sure?",
            text: "तुम्हाला ही माहिती  जतन करायची आहे का?",
            showCancelButton: true,
            confirmButtonColor: "#00ff00",
            confirmButtonText: 'जतन करा',
            cancelButtonColor: "#092C4C",
            cancelButtonText: 'रद्द करा',
            allowOutsideClick: false,
            allowEscapeKey: false
        }).then((result) => {
            if (result.isConfirmed) {
                // handleModalConfirm(event);
                handleSave();
                Swal.fire({
                    icon: "success",
                    title: "साठवले!",
                    text: "माहिती यशस्वीरित्या सेव झाली",
                    confirmButtonText: "OK",
                    allowOutsideClick: false,
                    allowEscapeKey: false
                });
            }
        });
    };

    useEffect(() => {
        const ShopLocation = async () => {
            try {
                const response = await axios.get(
                    baseUrl.Url + "/backend/api/Implications/SHOPLOC",

                );

                if (response.status !== 200) throw new Error("Failed to fetch implications data");

                const data = response.data;
                const implicationsDropdown = data.map(({ iTitle, iValue }) => ({
                    label: iTitle,
                    value: iValue,
                }));

                setShopLocation(implicationsDropdown);
            } catch (error) {
                console.error("Error fetching implications:", error);
            }
        };


        ShopLocation();


    }, []);

    useEffect(() => {
        const listener = () => {
            handleReload();
        };

        window.addEventListener("handleReload", listener);

        return () => {
            window.removeEventListener("handleReload", listener);
        };
    }, []);



    const handleReload = async () => {
        try {
            const response = await axios.get(
                baseUrl.Url + "/backend/api/Implications/SHOPLOC",

            );

            if (response.status !== 200) throw new Error("Failed to fetch implications data");

            const data = response.data;
            const implicationsDropdown = data.map(({ iTitle, iValue }) => ({
                label: iTitle,
                value: iValue,
            }));

            setShopLocation(implicationsDropdown);
        } catch (error) {
            console.error("Error fetching implications:", error);
        }
    };



    // const handleReload = async () => {
    //     try {
    //         const response = await axios.get(
    //             baseUrl.Url + "/backend/api/Implications/SHOPLOC"
    //         );

    //         if (response.status !== 200) throw new Error("Failed to fetch implications data");

    //         const data = response.data;
    //         const implicationsDropdown = data.map(({ iTitle, iValue }) => ({
    //             label: iTitle,
    //             value: iValue,
    //         }));

    //         setShopLocation(implicationsDropdown);
    //     } catch (error) {
    //         console.error("Error fetching implications:", error);
    //     }
    // };



    const validateinput = (e) => {
        const { SDate, SName, Slocation, SRent, SDeposit, SCapacity, ststus } = formData;


        if (!SDate || !/^\d{4}-\d{2}-\d{2}$/.test(SDate)) {
            Swal.fire({
                icon: "error",
                title: "त्रुटी",
                text: "कृपया वैध तारीख प्रविष्ट करा (YYYY-MM-DD फॉरमॅटमध्ये).",
                allowOutsideClick: false,
                allowEscapeKey: false
            }).then(() => {
                setTimeout(() => document.getElementById('SDate').focus(), 100);
            });
            return;
        }


        if (!SName || !/^(?!\s*$)[a-zA-Z\s]{3,50}$/.test(SName)) {
            Swal.fire({
                icon: "error",
                title: "त्रुटी",
                text: "शॉप   नाव 3 ते 50 अक्षरांचे असावे आणि फक्त अक्षरे असावीत.",
                allowOutsideClick: false,
                allowEscapeKey: false
            }).then(() => {
                setTimeout(() => document.getElementById('SName').focus(), 100);
            });
            return;
        }






        if (!Slocation || Slocation === "Select Status") {
            Swal.fire({
                icon: "error",
                title: "त्रुटी",
                text: "कृपया योग्य ठिकाण  प्रकार निवडा.",
                allowOutsideClick: false,
                allowEscapeKey: false
            }).then(() => {
                setTimeout(() => document.getElementById('Slocation').focus(), 100);
            });
            return;
        }




        if (!SRent || !/^\d+$/.test(SRent)) {
            Swal.fire({
                icon: "error",
                title: "त्रुटी",
                text: "भाडे फक्त संख्यात्मक असावे. रिकाम्या जागा, अक्षरे किंवा चिन्हे असू नयेत.",
                allowOutsideClick: false,
                allowEscapeKey: false
            }).then(() => {
                setTimeout(() => document.getElementById('SRent').focus(), 100);
            });
            return;
        }

        // Validate SDeposit (number input)
        if (!SDeposit || !/^\d+$/.test(SDeposit)) {
            Swal.fire({
                icon: "error",
                title: "त्रुटी",
                text: "डिपॉझिट फक्त संख्यात्मक असावे. रिकाम्या जागा, अक्षरे किंवा चिन्हे असू नयेत.",
                allowOutsideClick: false,
                allowEscapeKey: false
            }).then(() => {
                setTimeout(() => document.getElementById('SDeposit').focus(), 100);
            });
            return;
        }

        // Validate SCapacity (number input)
        if (!SCapacity || !/^\d+$/.test(SCapacity)) {
            Swal.fire({
                icon: "error",
                title: "त्रुटी",
                text: "क्षमता फक्त संख्यात्मक असावी. रिकाम्या जागा, अक्षरे किंवा चिन्हे असू नयेत.",
                allowOutsideClick: false,
                allowEscapeKey: false
            }).then(() => {
                setTimeout(() => document.getElementById('SCapacity').focus(), 100);
            });
            return;
        }

        // Validate Status (select input)
        if (!ststus || ststus === "Select Status") {
            Swal.fire({
                icon: "error",
                title: "त्रुटी",
                text: "कृपया योग्य स्थिती प्रकार निवडा.",
                allowOutsideClick: false,
                allowEscapeKey: false
            }).then(() => {
                setTimeout(() => document.getElementById('ststus').focus(), 100);
            });
            return;
        }

        // Proceed if all validations pass
        showConfirmationAlert(e);
    };


    const generateUniqueStoreID = () => {
        const timestamp = Date.now().toString().slice(-6); // Last 6 digits of current timestamp
        const randomPart = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit random number
        return timestamp + randomPart; // Concatenating both for uniqueness
    };

    const handleSave = async () => {

        try {
            const payload = {
                "storid": storid ? storid : GUID,
                "storeid": storeid ? storeid : generateUniqueStoreID(),
                "storename": formData.SName,
                "storerent": formData.SRent,
                "storelocation": formData.Slocation,
                "status": formData.ststus,
                "storecapacity": formData.SCapacity,
                "storedeposit": formData.SDeposit,
                "sdate": formData.SDate,
                "companyid": userdetail?.companyID ? userdetail.companyID : "",
                "deptid": userdetail?.departmentID ? userdetail.departmentID : "",
                "uaid": userdetail?.uaid ? userdetail.uaid : "",
            };



            console.log("Data payload:", payload);

            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };
            const response = await axios.post(
                `${baseUrl.Url}/backend/api/SP_AddUpdMarketStore`,
                JSON.stringify(payload),
                { headers }
            );
            Swal.fire({
                icon: "success",
                title: "साठवले!",
                text: "माहिती यशस्वीरित्या सेव झाली",
                allowOutsideClick: false,
                allowEscapeKey: false,
                confirmButtonText: "OK",
            }).then(() => {
                setFormData({
                    Sid: "",
                    SName: "",
                    Slocation: "",
                    SRent: "",
                    SDeposit: "",
                    SCapacity: "",
                    ststus: null,
                    SDate: ""
                });
                const newStoreID = generateUniqueStoreID();
                setStoreID(newStoreID);
                navigator(route.Shop);
            });


            console.log("API Response:", response.data);


        } catch (error) {
            console.error("Submission Error:", error);
            Swal.fire({
                icon: "error",
                title: "त्रुटी",
                text: "माहिती जतन करताना काहीतरी चूक झाली.",
                confirmButtonText: "OK",
                allowOutsideClick: false,
                allowEscapeKey: false
            });

        }
    };



    useEffect(() => {
        const fetchData = async () => {
            try {
                const payload1 = {
                    "storid": storid,
                    "keyword": "%",
                    "companyid": userdetail?.companyID ? userdetail.companyID : "",
                    "deptid": userdetail?.departmentID ? userdetail.departmentID : "",
                };
                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };

                const response1 = await axios.post(
                    `${baseUrl.Url}/backend/api/GET_MarketStore`,
                    payload1,
                    { headers }
                );
                if (response1.status !== 200)
                    throw new Error("Failed to fetch vendor data");

                console.log("SHOP", response1.data);
                if (response1.data.length > 0) {
                    setFormData(prevState => ({
                        ...prevState,
                        SName: response1.data[0].storename,
                        SDate: convertToISODate(response1.data[0].sdate),
                        SRent: response1.data[0].storerent,
                        Slocation: response1.data[0].storelocation,
                        SStatus: response1.data[0].status,
                        SCapacity: response1.data[0].storecapacity,
                        SDeposit: response1.data[0].storedeposit,
                        ststus: response1.data[0].status,
                    }));
                    setStoreID(response1.data[0].storeid);
                    console.log("Master data:", response1);
                    console.log('SHOP', response1.data)
                }



            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [storid]);


    const [SStatus, setSStatus] = useState([]);
    useEffect(() => {
        const fetchServiceTypes = async () => {
            try {
                const response = await axios.get(
                    baseUrl.Url + "/backend/api/Implications/VSTATUS",

                );

                if (response.status !== 200) throw new Error("Failed to fetch implications data");

                const data = response.data;
                const implicationsDropdown = data.map(({ iTitle, iValue }) => ({
                    label: iTitle,
                    value: iValue,
                }));

                setSStatus(implicationsDropdown);
            } catch (error) {
                console.error("Error fetching implications:", error);
            }
        };


        fetchServiceTypes();


    }, []);
    // const handleExit = () => {

    //     navigate("/StoreMaster")

    // };

    const handleExit = () => {
        MySwal.fire({
            text: "तुम्हाला फॉर्ममधून बाहेर पडून मास्टर फॉर्ममध्ये जायचे आहे का?",
            showCancelButton: true,
            confirmButtonColor: "#00ff00",
            confirmButtonText: "होय, बाहेर पडा!",
            cancelButtonColor: "#ff0000",
            cancelButtonText: "रद्द करा",
            allowOutsideClick: false,
            allowEscapeKey: false
        }).then((result) => {
            if (result.isConfirmed) {

                navigate(route.Shop)
            }
        }); // ✅ Missing closing bracket added
    };



    const ShopNameref = useRef(null);
    const ShopDateRef = useRef(null);
    const ShopLocationRef = useRef(null);
    const ShopRentRef = useRef(null);
    const ShopDepositRef = useRef(null);
    const ShopCapacityRef = useRef(null);
    const StatusRef = useRef(null);
    const AddRef = useRef(null);


    useEffect(() => {
        if (ShopDateRef.current) {
            ShopDateRef.current.focus();
        }
    }, []);

    // const handleKeyDown = (e, nextRef, isLastField = false) => {
    //     if (e.key === "Enter") {
    //         e.preventDefault();
    //         if (isLastField) {
    //             AddRef.current?.click(); // **Trigger Save Button Click**
    //         } else {
    //             nextRef?.current?.focus();
    //         }
    //         validateinput(e);
    //     }
    // };


    const handleKeyDown = (e, nextRef, isLastField = false) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (isLastField) {
                AddRef.current?.click(); // Save
            } else {
                nextRef?.current?.focus();
            }
            validateinput(e); // Optional: your validation logic
        }
    };

    useEffect(() => {
        const handleShortcut = (e) => {

            if (e.ctrlKey && e.key === 'e' || e.ctrlKey && e.key === 'E') {
                e.preventDefault();
                navigate(route.StoreMaster);
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
    return (
        <div className="page-wrapper">
            <div className="content ">
                <div className="page-header">
                    <div className="add-item d-flex">
                        <div className="page-title">
                            <h5 className="mb-1">शॉप  मास्टर </h5>
                            <h6>सेव  शॉप  मास्टर</h6>
                        </div>
                    </div>

                    <div className="page-btn">
                        <a
                            onClick={handleExit}
                            className="btn btn-secondary">
                            <ArrowLeft className="me-2" />
                            मागे
                        </a>
                    </div>
                </div>

                {/* success massage */}
                <form onSubmit={handleSubmit}>
                    <div className="card">
                        <div className="card-body add-product mbgcolor">
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
                                                    <span>शॉप  मास्टर</span>
                                                </h5>
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
                                                <div className="col-lg-2 col-md-6 mb-3">
                                                    <label htmlFor="shopId" className="form-label ">शॉप  क्र </label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Auto Genrated"
                                                        name="Sid"
                                                        value={storeID}

                                                        required
                                                        readOnly

                                                    />
                                                </div>

                                                <div className="col-lg-2 col-md-6 mb-3">
                                                    <label htmlFor="shopDate" className="form-label  required">शॉप  तारीख</label>
                                                    <input
                                                        ref={ShopDateRef}
                                                        type="date"
                                                        id="shopDate"
                                                        className="form-control"
                                                        name="SDate"
                                                        value={formData.SDate || ""}
                                                        onChange={handleChange}
                                                        onKeyDown={(e) => handleKeyDown(e, ShopNameref)}

                                                        required
                                                    />
                                                </div>
                                                <div className="col-lg-8 col-md-6 mb-3">
                                                    <label htmlFor="shopName" className="form-label  required">शॉप  नाव </label>
                                                    <input
                                                        type="text"
                                                        ref={ShopNameref}
                                                        className="form-control"
                                                        placeholder="दुकानाचे नाव प्रविष्ट करा"
                                                        name="SName"
                                                        value={formData.SName}
                                                        onChange={handleChange}
                                                        required

                                                        onKeyDown={(e) => handleKeyDown(e, ShopLocationRef)}

                                                    />
                                                </div>


                                            </div>

                                            <div className="row">


                                                <div className="col-lg-6 col-md-6 mb-3">
                                                    <div className="mb-0 add-product form-label">
                                                        <div className="d-flex justify-content-between align-items-center">
                                                            <label htmlFor="shopLocation" className="form-label required">शॉप ठिकाण</label>
                                                            <Link
                                                                to="#"
                                                                data-bs-toggle="modal"
                                                                data-bs-target="#add-units-category"
                                                                className="ms-2" // Adds spacing
                                                                openMenuOnFocus={true}

                                                            >

                                                                <PlusCircle className="plus-down-add" />
                                                                <span >नविन जोडा</span>

                                                            </Link>

                                                        </div>

                                                        <div className="position-relative">
                                                            <Select
                                                                ref={ShopLocationRef}
                                                                classNamePrefix="react-select"
                                                                options={ShopLocation} // Replace with your options array
                                                                placeholder="ठिकाण निवडा"
                                                                name="Slocation"
                                                                value={ShopLocation.find(option => option.value === formData.Slocation) || null}
                                                                onChange={(selectedOption) => {
                                                                    setFormData(prevState => ({
                                                                        ...prevState,
                                                                        Slocation: selectedOption ? selectedOption.value : "",
                                                                    }));

                                                                    if (ShopRentRef.current) {
                                                                        ShopRentRef.current.focus();
                                                                    }

                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>


                                                <div className="col-lg-2 col-md-6 mb-3">
                                                    <label htmlFor="shopRent" className="form-label required">शॉप  भाडे  </label>
                                                    <input
                                                        type="text"
                                                        ref={ShopRentRef}
                                                        className="form-control"
                                                        placeholder=" भाड प्रविष्ट करा"
                                                        name="SRent"
                                                        value={formData.SRent}
                                                        onChange={handleChange}

                                                        required
                                                        onKeyDown={(e) => handleKeyDown(e, ShopDepositRef)}


                                                    />

                                                </div>

                                                <div className="col-lg-2 col-md-6 mb-3">
                                                    <label htmlFor="shopDeposit" className="form-label required">शॉप  डिपॉजिट </label>
                                                    <input
                                                        ref={ShopDepositRef}
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="डिपॉजिट प्रविष्ट करा"
                                                        name="SDeposit"
                                                        value={formData.SDeposit}
                                                        onChange={handleChange}
                                                        pattern="^\d+$"  // Only digits
                                                        title="must contain only numbers. do not accept spaces and characters and symbols"
                                                        required
                                                        onKeyDown={(e) => handleKeyDown(e, ShopCapacityRef)}


                                                    />
                                                </div>
                                                <div className="col-lg-2 col-md-6 mb-3">
                                                    <label htmlFor="shopCapacity" className="form-label required">शॉप  क्षमता</label>
                                                    <input
                                                        ref={ShopCapacityRef}
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="  क्षमता प्रविष्ट करा"
                                                        name="SCapacity"
                                                        value={formData.SCapacity}
                                                        onChange={handleChange}
                                                        required

                                                        onKeyDown={(e) => handleKeyDown(e, StatusRef)}

                                                    />
                                                </div>
                                            </div>

                                            <div className="row justify-content-end">
                                                <div className="col-lg-4 col-md-6 mb-3 ">
                                                    <label htmlFor="Status" className="form-label required">स्थिती</label>
                                                    <Select
                                                        ref={StatusRef}
                                                        classNamePrefix="react-select"
                                                        options={SStatus}
                                                        name="ststus"
                                                        openMenuOnFocus={true}
                                                        value={SStatus.find(option => option.value === formData.ststus)} // Find the full object based on the value stored in formData
                                                        placeholder="निवडा"
                                                        onChange={(selectedOption) => {
                                                            handleSelectChange(selectedOption, 'ststus'); // Call function properly
                                                            if (AddRef.current) {
                                                                AddRef.current.focus(); // Move focus to save button
                                                            }

                                                        }}
                                                        required
                                                    />

                                                </div>
                                            </div>



                                            {/* save and cancel button */}
                                            <div className="col-lg-12">
                                                <div className="btn-addproduct mb-4">
                                                    <button type="button" className="btn btn-cancel me-2" onClick={handleExit}>
                                                        मागे
                                                    </button>
                                                    <button type="submit"
                                                        className="btn btn-submit"
                                                        ref={AddRef}>
                                                        सेव्ह
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* <AddShoploc /> */}
                                <AddShopLocation />
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>

    );
};

export default AddShop;
