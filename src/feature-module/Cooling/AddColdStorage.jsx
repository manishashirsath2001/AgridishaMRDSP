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


import {

    Edit,
    Eye,
    RefreshCcw,
    PlusCircle,
    RotateCcw,


    Trash2,
} from "feather-icons-react/build/IconComponents";
import Item from "antd/es/list/Item";

const AddColdStorage = () => {
    const [ShopLocation, setShopLocation] = useState([]);
    const GUID = ACSPLGUID.getNew();
    const GUID1 = ACSPLGUID.getNew();
    const route = all_routes;
    const MySwal = withReactContent(Swal)
    const navigate = useNavigate();
    const location = useLocation();
    const { userdetail } = getUserData();
    const [Customerdata, setCustomerdata] = useState([]);
    const { csid } = location.state || {};
    const [ColdStoreID, setColdStoreID] = useState("");
    console.log("Received csid:", csid);
    const [formData, setFormData] = useState({
        ColdStoreID: "",
        Date: "",
        LotNo: "",
        CustomerName: "",
        ThirdPartyName: "",
        Item: "",
        GrossWeight: "",
        NetWeight: "",
        WeightUnit: "",
        WeightInkg: "",
        CaretWeight: "",
        TypeofVariety: "",
        RackPosition: ""
    });



    const DateRef = useRef(null);
    const LotRef = useRef(null);
    const CustomerRef = useRef(null);
    const ThirdPartyRef = useRef(null);
    const ItemRef = useRef(null);
    const TypeofVarietyRef = useRef(null);
    const WeightUnitRef = useRef(null);
    const NetWeightRef = useRef(null);
    const RackPositionRef = useRef(null);
    const SaveRef = useRef(null);
    const GrossWeightRef = useRef(null);
    const CaretLottRef = useRef(null);



    useEffect(() => {
        if (DateRef.current) {
            DateRef.current.focus();
        }
    }, []);

    const generateUniqueStoreID = () => {
        const timestamp = Date.now().toString().slice(-6); // Last 6 digits of current timestamp
        const randomPart = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit random number
        return timestamp + randomPart; // Concatenating both for uniqueness
    };

    useEffect(() => {
        setColdStoreID(generateUniqueStoreID());
    }, []);

    const [WeightType, setWeightType] = useState([]);
    const [Itemdata, setItem] = useState([]);

    const handleKeyDown = (e, nextRef, isLastField = false) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (isLastField) {
                SaveRef.current?.click(); // Save
            } else {
                nextRef?.current?.focus();
            }

        }
    };

    useEffect(() => {
        const handleShortcut = (e) => {

            if (e.ctrlKey && e.key === 'e' || e.ctrlKey && e.key === 'E') {
                e.preventDefault();
                navigate(route.ColdStorage);
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

    useEffect(() => {
        const FetchItemdata = async () => {
            try {
                const response = await axios.get(
                    baseUrl.Url + "/backend/api/Implications/CROP_TYPE|",

                );

                if (response.status !== 200) throw new Error("Failed to fetch implications data");

                const data = response.data;
                const implicationsDropdown = data.map(({ iTitle, iValue }) => ({
                    label: iTitle,
                    value: iValue,
                }));

                setItem(implicationsDropdown);
            } catch (error) {
                console.error("Error fetching implications:", error);
            }
        };


        const WeightType = async () => {
            try {
                const response = await axios.get(
                    baseUrl.Url + "/backend/api/Implications/SOLID|",

                );

                if (response.status !== 200) throw new Error("Failed to fetch implications data");

                const data = response.data;
                const implicationsDropdown = data.map(({ iTitle, iValue }) => ({
                    label: iTitle,
                    value: iValue,
                }));

                setWeightType(implicationsDropdown);
            } catch (error) {
                console.error("Error fetching implications:", error);
            }
        };


        const fetchCustomerName = async () => {
            try {
                const payload = {
                    "ctaid": "%",
                    "companyid": "COMP123456789",
                    "deptid": "D001",
                    "ctype": '2'
                }
                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };

                axios({
                    method: "POST",
                    url: baseUrl.Url + "/backend/api/GET_CategoryCustomer",
                    data: JSON.stringify(payload),
                    headers: headers,
                })
                    .then((response) => {
                        if (response.status != 200) throw new Error("Failed to Fetching Data");
                        const DATA = response.data;
                        const formofvendorData = DATA
                            .map(({ ccompanyname, caid }) => ({
                                label: ccompanyname,
                                value: caid,
                            }));
                        setCustomerdata(formofvendorData);
                    })

            } catch (error) {
                console.error("Error fetching Access Right Data:", error);
            }

        };


        WeightType();
        FetchItemdata();
        fetchCustomerName();

    }, []);

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
        }).then((result) => {
            if (result.isConfirmed) {
                // handleModalConfirm(event);
                handleSave();

            }
        });
    };


    // const handleChange = (e) => {
    //     const { name, value } = e.target;
    //     setFormData(prev => ({
    //         ...prev,
    //         [name]: value
    //     }));
    // };

    const handleChange = (e) => {
        const { name, value } = e.target;
        const updated = { ...formData, [name]: value };

        // Recalculate on change of weight fields
        if (name === "GrossWeight" || name === "NetWeight") {
            const newFormData = updateNetWeightToKg(updated);
            setFormData(newFormData);
        } else {
            setFormData(updated);
        }
    };



    const handleWeightTypeChange = (selectedOption) => {
        const unit = selectedOption ? selectedOption.value : '';
        const updated = { ...formData, WeightUnit: unit };
        const newFormData = updateNetWeightToKg(updated);
        setFormData(newFormData);
    };

    // Convert NetWeight based on unit
    const convertToKg = (value, unit) => {
        const num = parseFloat(value);
        if (isNaN(num)) return '';

        switch (unit) {
            case '0': // Quintal
                return (num * 100).toFixed(2);
            case '2': // Gram
                return (num / 1000).toFixed(2);
            case '3': // Ton
                return (num * 1000).toFixed(2);
            default: // Kilogram or default
                return num.toFixed(2);
        }
    };

    const updateNetWeightToKg = (updatedFormData) => {
        const { NetWeight, GrossWeight, WeightUnit } = updatedFormData;

        const net = parseFloat(NetWeight);
        const gross = parseFloat(GrossWeight);

        let convertedNet = '0.00';
        let caretLotSize = '0.00';

        // Convert NetWeight to KG (and prevent negative)
        if (!isNaN(net)) {
            const converted = parseFloat(convertToKg(net, WeightUnit));
            convertedNet = converted >= 0 ? converted.toFixed(2) : '0.00';
        }

        // Convert (Gross - Net) to KG (and prevent negative)
        if (!isNaN(gross) && !isNaN(net)) {
            const diff = gross - net;
            const convertedDiff = parseFloat(convertToKg(diff, WeightUnit));
            caretLotSize = convertedDiff >= 0 ? convertedDiff.toFixed(2) : '0.00';
        }

        return {
            ...updatedFormData,
            WeightInkg: convertedNet,
            CaretWeight: caretLotSize
        };
    };



    const handleExit = () => {
        MySwal.fire({
            text: "तुम्हाला फॉर्ममधून बाहेर पडून मास्टर फॉर्ममध्ये जायचे आहे का?",
            showCancelButton: true,
            confirmButtonColor: "#00ff00",
            confirmButtonText: "होय, बाहेर पडा!",
            cancelButtonColor: "#ff0000",
            cancelButtonText: "रद्द करा",
        }).then((result) => {
            if (result.isConfirmed) {

                navigate("/ColdStorage")
            }
        });
    };
    const selectedDate = new Date(formData.Date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);  // normalize time for comparison


    const validateinput = (e) => {
        const {
            Date,
            LotNo,
            CustomerName,
            ThirdPartyName,
            Item,
            WeightUnit,
            Caret,
            TypeofVariety,
            RackPosition
        } = formData;

        if (!Date || !/^\d{4}-\d{2}-\d{2}$/.test(Date)) {
            Swal.fire({
                icon: "error",
                title: "त्रुटी",
                text: "कृपया वैध तारीख प्रविष्ट करा (YYYY-MM-DD फॉरमॅटमध्ये).",
            }).then(() => {
                setTimeout(() => document.getElementById('Date')?.focus(), 100);
            });
            return;
        }

        if (selectedDate > today) {
            Swal.fire({
                icon: "error",
                title: "त्रुटी",
                text: "भविष्यातील तारीख निवडू नका. आज किंवा त्यापूर्वीची तारीख निवडा.",
            }).then(() => {
                setTimeout(() => document.getElementById('Date')?.focus(), 100);
            });
            return;
        }

        if (!LotNo || !/^[a-zA-Z0-9\s]{3,50}$/.test(LotNo)) {
            Swal.fire({
                icon: "error",
                title: "त्रुटी",
                text: "लॉट क्रमांक 3 ते 50 अक्षरे व अंक असले पाहिजेत.",
            }).then(() => {
                setTimeout(() => document.getElementById('LotNo')?.focus(), 100);
            });
            return;
        }

        if (!CustomerName || CustomerName === "Select Status") {
            Swal.fire({
                icon: "error",
                title: "त्रुटी",
                text: "कृपया योग्य Customer निवडा.",
            }).then(() => {
                setTimeout(() => CustomerRef.current?.focus(), 100);
            });
            return;
        }



        if (!Item || Item === "Select Status") {
            Swal.fire({
                icon: "error",
                title: "त्रुटी",
                text: "कृपया योग्य Item निवडा.",
            }).then(() => {
                setTimeout(() => ItemRef.current?.focus(), 100);
            });
            return;
        }

        if (!WeightUnit || WeightUnit === "Select Status") {
            Swal.fire({
                icon: "error",
                title: "त्रुटी",
                text: "कृपया योग्य Weight Unit निवडा.",
            }).then(() => {
                setTimeout(() => WeightUnit.current?.focus(), 100);
            });
            return;
        }

        // if (!Caret || !/^\d{3,50}$/.test(Caret)) {
        //     Swal.fire({
        //         icon: "error",
        //         title: "त्रुटी",
        //         text: "Caret 3 ते 50 अंक असले पाहिजेत.",
        //     }).then(() => {
        //         setTimeout(() => CaretRef.current?.focus(), 100);
        //     });
        //     return;
        // }


        if (!TypeofVariety || !/^(?!\s*$)[a-zA-Z0-9\s]{3,50}$/.test(TypeofVariety)) {
            Swal.fire({
                icon: "error",
                title: "त्रुटी",
                text: "Type of Variety 3 ते 50 वर्णांचे असावे (अक्षरे किंवा संख्या).",
            }).then(() => {
                setTimeout(() => TypeofVarietyRef.current?.focus(), 100);
            });
            return;
        }



        // if (!RackPosition || !/^(?!\s*$)[a-zA-Z0-9\s]{1,50}$/.test(RackPosition)) {
        //     Swal.fire({
        //         icon: "error",
        //         title: "त्रुटी",
        //         text: "Rack Position 1 ते 50 वर्णांचे असावे आणि फक्त अक्षरे किंवा संख्या असावीत.",
        //     }).then(() => {
        //         setTimeout(() => RackPositionRef.current?.focus(), 100);
        //     });
        //     return;
        // }


        // All validations passed
        showConfirmationAlert(e);
    };



    useEffect(() => {
        const fetchData = async () => {

            try {

                const payload1 = {

                    "csid": csid,
                    "keyword": "%",
                    "companyid": userdetail?.companyID ? userdetail.companyID : "",
                    "deptid": userdetail?.departmentID ? userdetail.departmentID : "",
                };
                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };

                const response1 = await axios.post(
                    `${baseUrl.Url}/backend/api/GET_ColdStorageInward`,
                    payload1,
                    { headers }
                );
                if (response1.status !== 200)
                    throw new Error("Failed to fetch vendor data");

                console.log("ColdStorage", response1.data);
                if (response1.data.length > 0) {
                    setFormData(prevState => ({
                        ...prevState,


                        // ColdStoreID: response1.data[0].coldstorageid,

                        // ColdStoreID: response1.data[0].coldstorageid,
                        Date: convertToISODate(response1.data[0].date),
                        LotNo: response1.data[0].lotno,
                        CustomerName: response1.data[0].customername,
                        ThirdPartyName: response1.data[0].thirdpartyname,
                        Item: response1.data[0].item,
                        NetWeight: response1.data[0].netweight,
                        GrossWeight: response1.data[0].grossweight,
                        WeightUnit: response1.data[0].weightunit,
                        WeightInkg: response1.data[0].weightinkg,
                        CaretWeight: response1.data[0].caretweight,
                        TypeofVariety: response1.data[0].typeofvarity,
                        RackPosition: response1.data[0].rackposition,

                    }));
                    setColdStoreID(response1.data[0].coldstorageid);
                    console.log("Get:", response1);
                    console.log('set', response1.data)
                }



            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [csid]);


    const handleSave = async () => {


        try {
            const payload = {

                "csid": csid ? csid : GUID,
                "coldstorageid": ColdStoreID,
                "lotno": formData.LotNo,
                "date": formData.Date,
                "customername": formData.CustomerName,
                "thirdpartyname": formData.ThirdPartyName,
                "item": formData.Item,
                "grossweight": formData.GrossWeight,
                "netweight": formData.NetWeight,
                "weightunit": formData.WeightUnit,
                "weightinkg": formData.WeightInkg,
                "caretweight": formData.CaretWeight,
                "typeofvarity": formData.TypeofVariety,
                "rackposition": formData.RackPosition,
                "status": false,
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
                `${baseUrl.Url}/backend/api/SP_AddUpdColdStorageInward`,
                JSON.stringify(payload),
                { headers }
            );

            Swal.fire({
                icon: "success",
                title: "साठवले!",
                text: "माहिती यशस्वीरित्या सेव झाली",
                confirmButtonText: "OK",
            }).then(() => {

                setFormData({
                    ColdStoreID: "",
                    Date: "",
                    LotNo: "",
                    CustomerName: "",
                    ThirdPartyName: "",
                    Item: "",
                    GrossWeight: "",
                    NetWeight: "",
                    WeightUnit: "",
                    WeightInkg: "",
                    CaretWeight: "",
                    TypeofVariety: "",
                    RackPosition: ""
                });
                const newStoreID = generateUniqueStoreID();
                setColdStoreID(newStoreID);
            });


            console.log("API Response:", response.data);

        } catch (error) {
            console.error("Submission Error:", error);
            Swal.fire({
                icon: "error",
                title: "त्रुटी",
                text: "माहिती जतन करताना काहीतरी चूक झाली.",
                confirmButtonText: "OK",
            });

        }
    };






    return (
        <div className="page-wrapper">
            <div className="content">
                <div className="page-header">
                    <div className="add-item d-flex">
                        <div className="page-title">
                            <h5 className="mb-1">Cold Storage</h5>
                            <h6>Manage Cold Storage</h6>
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
                    <div className="card mbgcolor">
                        <div className="card-body mbgcolor">
                            <div className="accordion-card-one accordion" id="accordionExample">
                                <div className="accordion-item mbgcolor" >
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
                                                    <span>Cold Storage</span>
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
                                        <div className="accordion-body">
                                            <div className="row">
                                                <div className="col-lg-2 col-md-6 mb-3">
                                                    <label htmlFor="shopId" className="form-label ">Cold Storage Id </label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Auto Genrated"
                                                        name="ColdStoreID"
                                                        value={ColdStoreID}
                                                        required
                                                        readOnly

                                                    />
                                                </div>

                                                <div className="col-lg-2 col-md-6 mb-3">
                                                    <label htmlFor="shopDate" className="form-label  required"> Date </label>
                                                    <input
                                                        ref={DateRef}
                                                        type="date"
                                                        id="shopDate"
                                                        className="form-control"
                                                        name="Date"
                                                        onChange={(e) =>
                                                            setFormData((prev) => ({ ...prev, Date: e.target.value }))
                                                        }
                                                        value={formData.Date}
                                                        onKeyDown={(e) => handleKeyDown(e, LotRef)}

                                                    />
                                                </div>
                                                <div className="col-lg-2 col-md-6 mb-3">
                                                    <label htmlFor="shopDate" className="form-label  required"> Lot No</label>
                                                    <input
                                                        ref={LotRef}
                                                        type="text"
                                                        id="LotNo"
                                                        className="form-control"
                                                        placeholder="लॉट क्रमांक प्रविष्ट करा"
                                                        name="LotNo"
                                                        onChange={(e) =>
                                                            setFormData((prev) => ({ ...prev, LotNo: e.target.value }))
                                                        }
                                                        value={formData.LotNo}
                                                        onKeyDown={(e) => handleKeyDown(e, CustomerRef)}

                                                    />
                                                </div>
                                                <div className="col-lg-6 col-md-6 mb-3">
                                                    <label htmlFor="shopName" className="form-label  required">Customer Name </label>
                                                    <Select
                                                        ref={CustomerRef}
                                                        classNamePrefix="react-select"
                                                        options={Customerdata}
                                                        name="CustomerName"
                                                        value={Customerdata.find(option => option.value === formData.CustomerName) || null}
                                                        onChange={(selectedOption) => {
                                                            setFormData((prev) => ({ ...prev, CustomerName: selectedOption.value }));
                                                            if (ThirdPartyRef.current) {
                                                                ThirdPartyRef.current.focus(); // Move focus to save button
                                                            }
                                                        }}
                                                        placeholder="निवडा"
                                                    />


                                                </div>
                                            </div>

                                            <div className="row">
                                                <div className="col-lg-3 col-md-6 mb-3">
                                                    <div className="mb-0 add-product form-label">
                                                        <div className="d-flex justify-content-between align-items-center">
                                                            <label htmlFor="shopLocation" className="form-label ">Third Party Name</label>
                                                            <Link
                                                                to="#"
                                                                data-bs-toggle="modal"
                                                                data-bs-target="#add-units-category"
                                                                className="ms-2"
                                                            >
                                                            </Link>
                                                        </div>

                                                        <div className="position-relative">
                                                            <input
                                                                id="ThirdPartyName"
                                                                ref={ThirdPartyRef}
                                                                type="text"
                                                                className="form-control"
                                                                placeholder=" तीसरा पक्ष नाव प्रविष्ट करा"
                                                                name="ThirdPartyName"
                                                                onChange={handleChange}
                                                                value={formData.ThirdPartyName}
                                                                onKeyDown={(e) => handleKeyDown(e, ItemRef)}

                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="col-lg-3 col-md-6 mb-3">
                                                    <label htmlFor="shopRent" className="form-label required">Item </label>


                                                    <Select
                                                        ref={ItemRef}
                                                        classNamePrefix="react-select"
                                                        name="RackPItemosition"
                                                        placeholder="निवडा"
                                                        options={Itemdata}
                                                        value={Itemdata.find(option => option.value === formData.Item) || null}
                                                        onChange={(selectedOption) => {
                                                            setFormData((prev) => ({ ...prev, Item: selectedOption.value }));
                                                            if (TypeofVarietyRef.current) {
                                                                TypeofVarietyRef.current.focus(); // Move focus to next field
                                                            }
                                                        }}
                                                    />



                                                </div>

                                                <div className="col-lg-3 col-md-6 mb-3">
                                                    <label htmlFor="shopCapacity" className="form-label required">Type of Variety</label>



                                                    <input
                                                        ref={TypeofVarietyRef}
                                                        id="TypeofVariety"
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="  प्रकार  प्रविष्ट करा"
                                                        name="TypeofVariety"
                                                        onChange={handleChange}
                                                        value={formData.TypeofVariety}
                                                        onKeyDown={(e) => handleKeyDown(e, RackPositionRef)}
                                                    />
                                                </div>

                                                <div className="col-lg-3 col-md-6 mb-3 ">
                                                    <label htmlFor="Status" className="form-label ">Rack Position</label>


                                                    <input
                                                        id="RackPosition"
                                                        ref={RackPositionRef}
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Rack Position नाव प्रविष्ट करा"
                                                        name="RackPosition"
                                                        onChange={handleChange}
                                                        value={formData.RackPosition}
                                                        onKeyDown={(e) => handleKeyDown(e, GrossWeightRef)}

                                                    />


                                                </div>
                                            </div>

                                            <div className="row">

                                                <div className="col-lg-2 col-md-6 mb-3">
                                                    <label htmlFor="GrossWeight" className="form-label required">Gross Weight</label>
                                                    <input
                                                        ref={GrossWeightRef}
                                                        id="GrossWeight"
                                                        type="number"
                                                        className="form-control"
                                                        placeholder="Gross प्रविष्ट करा"
                                                        name="GrossWeight"
                                                        onChange={handleChange}
                                                        value={formData.GrossWeight}
                                                        onKeyDown={(e) => handleKeyDown(e, NetWeightRef)}
                                                    />
                                                </div>


                                                <div className="col-lg-2 col-md-6 mb-3">
                                                    <label htmlFor="NetWeight" className="form-label required">Net Weight</label>
                                                    <input
                                                        ref={NetWeightRef}
                                                        id="NetWeight"
                                                        type="number"
                                                        className="form-control"
                                                        placeholder="Net प्रविष्ट करा"
                                                        name="NetWeight"
                                                        onChange={handleChange}
                                                        value={formData.NetWeight}
                                                        onKeyDown={(e) => handleKeyDown(e, WeightUnitRef)}
                                                    />
                                                </div>

                                                <div className="col-lg-2 col-md-6 mb-3">
                                                    <label htmlFor="Weight" className="form-label required">Weight Unit</label>
                                                    <Select
                                                        ref={WeightUnitRef}
                                                        placeholder="वजन प्रकार निवडा"
                                                        classNamePrefix="react-select"
                                                        options={WeightType}
                                                        value={WeightType.find(option => option.value === formData.WeightUnit) || null}
                                                        onChange={(selectedOption) => {
                                                            handleWeightTypeChange(selectedOption);
                                                            if (SaveRef.current) {
                                                                SaveRef.current.focus(); // Move focus after selection
                                                            }
                                                        }}
                                                    />

                                                </div>

                                                <div className="col-lg-2 col-md-6 mb-3">
                                                    <label htmlFor="WeightInkg" className="form-label required">Weight in (kg)</label>
                                                    <input
                                                        id="WeightInkg"
                                                        type="text"
                                                        className="form-control"
                                                        name="WeightInkg"
                                                        value={formData.WeightInkg}
                                                        readOnly
                                                    />
                                                </div>


                                                <div className="col-lg-4 col-md-6 mb-3">
                                                    <label htmlFor="shopCapacity" className="form-label required">Caret Weight</label>
                                                    <input
                                                        ref={CaretLottRef}
                                                        id="Caret"
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="  कॅरेट प्रविष्ट करा"
                                                        name="Caret"
                                                        onChange={handleChange}
                                                        value={formData.CaretWeight}
                                                        onKeyDown={(e) => handleKeyDown(e, RackPositionRef)}
                                                        readOnly
                                                    />
                                                </div>

                                            </div>




                                            <div className="col-lg-12">
                                                <div className="btn-addproduct mb-4">
                                                    <button type="button"
                                                        className="btn btn-cancel me-2"
                                                        onClick={handleExit}
                                                    >
                                                        मागे
                                                    </button>
                                                    <button type="submit"
                                                        className="btn btn-submit"
                                                        ref={SaveRef}
                                                    >
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

export default AddColdStorage;


