import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import { all_routes } from "../../Router/all_routes";
import { DatePicker } from "antd";
import Addunits from "../../core/modals/inventory/addunits";
import AddCategory from "../../core/modals/inventory/addcategory";
import AddBrand from "../../core/modals/addbrand";
import axios from 'axios';
import { getUserData } from '../../Context/UserData'
import { baseUrl, ACSPLGUID, convertToISODate } from "../../core/json/custom";
import {
    ArrowLeft,
    Calendar,
    ChevronDown,
    ChevronUp,
    Info,
    LifeBuoy,
    List,
    PlusCircle,
    Trash2,
    X,
} from "feather-icons-react/build/IconComponents";

import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
const AddGalaAlot = () => {
    const location = useLocation();

    const { shid } = location.state || {};

    console.log("Received shid:", shid);
    const route = all_routes;
    const userdetail = getUserData();
    const navigate = useNavigate();
    const MySwal = withReactContent(Swal)
    const GUID = ACSPLGUID.getNew();
    const [formData, setformData] = useState({
        VyapariName: "",
        ShopName: "",
        ShopId: "",
        SDate: "",
        EDate: "",
        Deposit: "",
        Rent: "",

    });
    const [ShopData, setShopData] = useState([]);
    const handleExit = () => {
        MySwal.fire({
            text: "तुम्हाला फॉर्ममधून बाहेर पडून मास्टर फॉर्ममध्ये जायचे आहे का?",
            showCancelButton: true,
            confirmButtonColor: "#00ff00",
            confirmButtonText: "होय, बाहेर पडा!",
            cancelButtonColor: "#ff0000",
            cancelButtonText: "रद्द करा",
            allowOutsideClick: false,
            allowEscapeKey: false,

        }).then((result) => {
            if (result.isConfirmed) {

                navigate(route.GalaAlotMaster)
            }
        });
    };



    const validateinput = (e) => {
        const { VyapariName, ShopName, SDate, EDate, Deposit, Rent } = formData;



        if (!VyapariName || VyapariName === "Select Vyapari") {
            Swal.fire({
                icon: "error",
                title: "त्रुटी",
                text: "कृपया योग्य व्यापारी नाव   निवडा.",
                allowOutsideClick: false,
                allowEscapeKey: false,

            }).then(() => {
                setTimeout(() => document.getElementById('VyapariName').focus(), 100);
            });
            return;
        }

        if (!ShopName || ShopName === "Select Shop Name") {
            Swal.fire({
                icon: "error",
                title: "त्रुटी",
                text: "कृपया योग्य शॉपचे नाव निवडा.",
                allowOutsideClick: false,
                allowEscapeKey: false,

            }).then(() => {
                setTimeout(() => document.getElementById('ShopName').focus(), 100);
            });
            return;
        }

        if (!SDate || !/^\d{4}-\d{2}-\d{2}$/.test(SDate)) {
            Swal.fire({
                icon: "error",
                title: "त्रुटी",
                text: "कृपया वैध तारीख प्रविष्ट करा (YYYY-MM-DD फॉरमॅटमध्ये).",
                allowOutsideClick: false,
                allowEscapeKey: false,

            }).then(() => {
                setTimeout(() => document.getElementById('SDate').focus(), 100);
            });
            return;
        }
        if (!EDate || !/^\d{4}-\d{2}-\d{2}$/.test(EDate)) {
            Swal.fire({
                icon: "error",
                title: "त्रुटी",
                text: "कृपया वैध तारीख प्रविष्ट करा (YYYY-MM-DD फॉरमॅटमध्ये).",
                allowOutsideClick: false,
                allowEscapeKey: false,

            }).then(() => {
                setTimeout(() => document.getElementById('EDate').focus(), 100);
            });
            return;
        }

        if (!SDate || !/^\d{4}-\d{2}-\d{2}$/.test(SDate)) {
            Swal.fire({
                icon: "error",
                title: "त्रुटी",
                text: "कृपया वैध प्रारंभ तारीख प्रविष्ट करा (YYYY-MM-DD फॉरमॅटमध्ये).",
                allowOutsideClick: false,
                allowEscapeKey: false,

            }).then(() => {
                setTimeout(() => document.getElementById('SDate').focus(), 100);
            });
            return;
        }

        if (!EDate || !/^\d{4}-\d{2}-\d{2}$/.test(EDate)) {
            Swal.fire({
                icon: "error",
                title: "त्रुटी",
                text: "कृपया वैध समाप्ती तारीख प्रविष्ट करा (YYYY-MM-DD फॉरमॅटमध्ये).",
                allowOutsideClick: false,
                allowEscapeKey: false,

            }).then(() => {
                setTimeout(() => document.getElementById('EDate').focus(), 100);
            });
            return;
        }

        // Now check if Start Date is greater than End Date
        if (new Date(SDate) > new Date(EDate)) {
            Swal.fire({
                icon: "error",
                title: "त्रुटी",
                text: "प्रारंभ तारीख समाप्ती तारखेपेक्षा लहान असावी.",
                allowOutsideClick: false,
                allowEscapeKey: false,

            }).then(() => {
                setTimeout(() => document.getElementById('SDate').focus(), 100);
            });
            return;
        }






        // Validate Slocation (text input)



        // Validate SDeposit (number input)
        if (!Deposit || !/^\d+$/.test(Deposit)) {
            Swal.fire({
                icon: "error",
                title: "त्रुटी",
                text: "डिपॉझिट फक्त संख्यात्मक असावे. रिकाम्या जागा, अक्षरे किंवा चिन्हे असू नयेत.",
                allowOutsideClick: false,
                allowEscapeKey: false,

            }).then(() => {
                setTimeout(() => document.getElementById('SDeposit').focus(), 100);
            });
            return;
        }

        // Validate SRent (number input)
        if (!Rent || !/^\d+$/.test(Rent)) {
            Swal.fire({
                icon: "error",
                title: "त्रुटी",
                text: "भाडे फक्त संख्यात्मक असावे. रिकाम्या जागा, अक्षरे किंवा चिन्हे असू नयेत.",
                allowOutsideClick: false,
                allowEscapeKey: false,

            }).then(() => {
                setTimeout(() => document.getElementById('Rent').focus(), 100);
            });
            return;
        }



        showConfirmationAlert(e);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

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
            allowEscapeKey: false,

        }).then((result) => {
            if (result.isConfirmed) {

                handleSave();

            }
        });
    };


    const handleSave = async () => {
        // e.preventDefault();
        // showConfirmationAlert(e);
        try {
            const payload = {

                "shid": shid ? shid : GUID,
                "vyapariname": formData.VyapariName,
                "shopname": formData.ShopName,
                "shopid": formData.ShopId,
                "sdate": formData.SDate,
                "edate": formData.EDate,
                "deposit": formData.Deposit ? parseFloat(formData.Deposit) : 0,  // Ensure it's a number
                "rent": formData.Rent ? parseFloat(formData.Rent) : 0,  // Ensure it's a number
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
                `${baseUrl.Url}/backend/api/SP_AddUpdShopAlot`,
                JSON.stringify(payload),
                { headers }
            );

            Swal.fire({
                icon: "success",
                title: "साठवले!",
                text: "माहिती यशस्वीरित्या सेव झाली",
                confirmButtonText: "OK",
                allowOutsideClick: false,
                allowEscapeKey: false,

            }).then(() => {

                setformData({

                    VyapariName: "",
                    ShopName: "",
                    ShopId: "",
                    SDate: "",
                    EDate: "",
                    Deposit: "",
                    Rent: "",
                });
                navigate(route.GalaAlotMaster);
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
                allowEscapeKey: false,

            });

        }
    };

    const [vyapari, setvyapari] = useState([]);
    useEffect(() => {
        const fetchVyapari = async () => {
            try {
                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };

                const payload = {
                    companyid: "",
                    deptid: "",
                };

                const response = await axios.post(
                    `${baseUrl.Url}/backend/api/GET_VaypariName`,
                    payload,
                    { headers }
                );
                if (response.status !== 200)
                    throw new Error("Failed to fetch vendor data");
                console.log("requisition setails", response.data)
                const data = response.data;
                const conuterData = data
                    .map(({ vname, vpaid }) => ({
                        label: vname,
                        value: vpaid
                    }));

                setvyapari(conuterData);
            } catch (error) {
                console.error("Error fetching vendor data:", error);
            }
        };
        fetchVyapari();
    }, []);

    // for dropdown data 
    const handleSelectChange = (selectedOption, field) => {
        setformData(prevData => ({
            ...prevData,
            [field]: selectedOption ? selectedOption.value : "", // Shop only the 'value' of the selected option
        }));
    };



    const [Shop, setShop] = useState([]);
    useEffect(() => {

        const fetchShopName = async () => {
            try {
                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };

                const payload = {
                    companyid: "",
                    deptid: "",
                };

                const response = await axios.post(
                    `${baseUrl.Url}/backend/api/GET_ShopName`,
                    payload,
                    { headers }
                );
                if (response.status !== 200)
                    throw new Error("Failed to fetch vendor data");
                console.log("requisition setails", response.data)
                const data = response.data;
                const ShopData = data
                    .map(({ storename, storid }) => ({
                        label: storename,
                        value: storid,
                    }));



                setShop(ShopData);
                console.log(response.data, "ShopData")
                setShopData(response.data);
            } catch (error) {
                console.error("Error fetching vendor data:", error);
            }
        };
        fetchShopName();


    }, []);

    const Vyapariref = useRef(null);
    const ShopRef = useRef(null);
    const SdateRef = useRef(null);
    const EdateRef = useRef(null);
    const DepositRef = useRef(null);
    const RentRef = useRef(null);
    const SaveRef = useRef(null);


    useEffect(() => {
        if (Vyapariref.current) {
            Vyapariref.current.focus();
        }
    }, []);

    const handleKeyDown = (e, nextRef, isLastField = false) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (isLastField) {
                SaveRef.current?.click(); // **Trigger Save Button Click**
            } else {
                nextRef?.current?.focus();
            }
            validateinput(e);
        }
    };

    useEffect(() => {
        const handleShortcut = (e) => {

            if (e.ctrlKey && e.key === 'e' || e.ctrlKey && e.key === 'E') {
                e.preventDefault();
                navigate(route.GalaAlot);
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

    // useEffect(() => {
    //     const fetchData = async () => {

    //         try {

    //             const payload1 = {


    //                 "shid": shid,
    //                 "keyword": "%",
    //                 "companyid": userdetail?.companyID ? userdetail.companyID : "",
    //                 "deptid": userdetail?.departmentID ? userdetail.departmentID : "",
    //             };
    //             const headers = {
    //                 "Content-Type": "application/json",
    //                 Accept: "*/*",
    //             };

    //             const response1 = await axios.post(
    //                 `${baseUrl.Url}/backend/api/GET_ShopAlot`,
    //                 payload1,
    //                 { headers }
    //             );
    //             if (response1.status !== 200)
    //                 throw new Error("Failed to fetch vendor data");

    //             console.log("SHOP", response1.data);
    //             if (response1.data.length > 0) {
    //                 setformData(prevState => ({
    //                     ...prevState,

    //                     VyapariName: response1.data[0].vyapariname,
    //                     ShopName: response1.data[0].storename,
    //                     ShopId: response1.data[0].shopid,
    //                     SDate: convertToISODate(response1.data[0].sdate),
    //                     EDate: convertToISODate(response1.data[0].edate),
    //                     Deposit: response1.data[0].deposit,
    //                     Rent: response1.data[0].rent,



    //                 }));
    //                 console.log("Master data:", response1);
    //                 console.log('SHOP', response1.data)
    //             }



    //         } catch (error) {
    //             console.error("Error fetching data:", error);
    //         }
    //     };

    //     fetchData();
    // }, [shid]);


    // useEffect(() => {
    //     const fetchData = async () => {

    //         try {

    //             const payload1 = {

    //                 "shid": shid,
    //                 "keyword": "%",
    //                 "companyid": userdetail?.companyID ? userdetail.companyID : "",
    //                 "deptid": userdetail?.departmentID ? userdetail.departmentID : "",
    //             };
    //             const headers = {
    //                 "Content-Type": "application/json",
    //                 Accept: "*/*",
    //             };

    //             const response1 = await axios.post(
    //                 `${baseUrl.Url}/backend/api/GET_ShopAlot`,
    //                 payload1,
    //                 { headers }
    //             );
    //             if (response1.status !== 200)
    //                 throw new Error("Failed to fetch vendor data");

    //             console.log("SHOP", response1.data);
    //             if (response1.data.length > 0) {
    //                 setformData(prevState => ({
    //                     ...prevState,


    //                     VyapariName: response1.data[0].vyapariname,
    //                     ShopName: response1.data[0].storename,
    //                     ShopId: response1.data[0].shopid,
    //                     SDate: convertToISODate(response1.data[0].sdate),
    //                     EDate: convertToISODate(response1.data[0].edate),
    //                     Deposit: response1.data[0].deposit,
    //                     Rent: response1.data[0].rent,


    //                 }));
    //                 console.log("Get:", response1);
    //                 console.log('set', response1.data)
    //             }



    //         } catch (error) {
    //             console.error("Error fetching data:", error);
    //         }
    //     };

    //     fetchData();
    // }, [shid]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const payload1 = {
                    "shid": shid,
                    "keyword": "%",
                    "companyid": userdetail?.companyID || "",
                    "deptid": userdetail?.departmentID || "",
                };
                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };

                const response1 = await axios.post(
                    `${baseUrl.Url}/backend/api/GET_ShopAlot`,
                    payload1,
                    { headers }
                );
                if (response1.status !== 200)
                    throw new Error("Failed to fetch vendor data");

                console.log("SHOP", response1.data);

                if (response1.data.length > 0) {
                    // FIND the matching shid
                    const matchingShop = response1.data.find(item => item.shid === shid);

                    if (matchingShop) {
                        setformData(prevState => ({
                            ...prevState,
                            VyapariName: matchingShop.vyapariname,
                            ShopName: matchingShop.storename,
                            ShopId: matchingShop.shopid,
                            SDate: convertToISODate(matchingShop.sdate),
                            EDate: convertToISODate(matchingShop.edate),
                            Deposit: matchingShop.deposit,
                            Rent: matchingShop.rent,
                        }));
                        setStoreID(matchingShop.shid);
                        console.log("Matched Shop:", matchingShop);
                    } else {
                        console.warn("No matching shop found for shid:", shid);
                    }
                }

            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [shid]);

    return (
        <div className="page-wrapper">
            <div className="content">
                <div className="page-header">
                    <div className="add-item d-flex">
                        <div className="page-title">
                            <h4> शॉप  वाटप</h4>
                            <h6>नविन शॉप  वाटप करा</h6>
                        </div>
                    </div>
                    <ul className="table-top-head">
                        <li>
                            <div className="page-btn">
                                <a
                                    onClick={handleExit}
                                    className="btn btn-secondary">
                                    <ArrowLeft className="me-2" />
                                    मागे
                                </a>
                            </div>
                        </li>

                    </ul>
                </div>
                {/* /add */}
                <form onSubmit={handleSubmit}>
                    <div className="card">
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
                                                <h5>
                                                    <Info className="add-info" />

                                                    <span>शॉपची  माहिती</span>
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
                                                <div className="col-lg-4 col-sm-6 col-12">
                                                    <div className="mb-3 add-product">
                                                        <label className="form-label">व्यापारी नाव</label>

                                                        <Select
                                                            ref={Vyapariref}
                                                            placeholder="निवडा"
                                                            classNamePrefix="react-select"
                                                            options={vyapari}  // Your options for vyapari
                                                            value={vyapari.find(option => option.value === formData.VyapariName) || null}
                                                            onChange={(selectedOption) => {
                                                                // Update the VyapariName in the detailData state
                                                                setformData(prevState => ({
                                                                    ...prevState,
                                                                    VyapariName: selectedOption ? selectedOption.value : '',
                                                                }));

                                                                if (ShopRef.current) {
                                                                    ShopRef.current.focus(); // Move focus after selection
                                                                }
                                                            }}

                                                        />

                                                    </div>
                                                </div>
                                                <div className="col-lg-4 col-sm-6 col-12">
                                                    <div className="mb-3 add-product">
                                                        <label className="form-label">शॉपचे  नाव</label>

                                                        <Select
                                                            ref={ShopRef}
                                                            placeholder="निवडा"
                                                            classNamePrefix="react-select"
                                                            options={Shop}  // Your options for Shop
                                                            value={Shop.find(option => option.value === formData.ShopName) || null}
                                                            onChange={(selectedOption) => {
                                                                // Update the ShopName in the detailData state
                                                                setformData(prevState => ({
                                                                    ...prevState,
                                                                    ShopName: selectedOption ? selectedOption.value : '',
                                                                }));

                                                                if (SdateRef.current) {
                                                                    SdateRef.current.focus(); // Move focus after selection
                                                                }

                                                                const data = ShopData.find((row) => (row.storid == selectedOption.value)).storeid;
                                                                setformData(prevState => ({
                                                                    ...prevState,
                                                                    ShopId: data,
                                                                }));

                                                            }}

                                                        />

                                                    </div>
                                                </div>




                                                <div className="col-lg-2 col-sm-6 col-12">
                                                    <div className="mb-3 add-product">
                                                        <label className="form-label">शॉप  आयडी </label>
                                                        <input

                                                            type="text"
                                                            className="form-control list"
                                                            placeholder="गळ्याची  आयडी प्रविष्ट करा"
                                                            value={formData.ShopId}
                                                            readOnly
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-lg-2 col-md-6 mb-3">
                                                    <label htmlFor="shopDate" className="form-label required">शॉप सुरू तारीख</label>
                                                    <input
                                                        ref={SdateRef}
                                                        type="date"
                                                        id="shopDate"
                                                        className="form-control"
                                                        name="SDate"
                                                        value={formData.SDate || ""}  // Ensure it's not undefined
                                                        onChange={(e) => setformData(prevState => ({
                                                            ...prevState,
                                                            SDate: e.target.value
                                                        }))}
                                                        placeholder="गळ्याची सुरू करण्याची तारीख प्रविष्ट करा"
                                                        onKeyDown={(e) => handleKeyDown(e, EdateRef, true)}
                                                    />
                                                </div>

                                                <div className="col-lg-2 col-md-6 mb-3">
                                                    <label htmlFor="shopDate" className="form-label required">शॉप समाप्ती तारीख</label>
                                                    <input
                                                        ref={EdateRef}
                                                        type="date"
                                                        id="shopDate"
                                                        className="form-control"
                                                        name="EDate"

                                                        value={formData.EDate || ""}  // Ensure it's not undefined
                                                        onChange={(e) => setformData(prevState => ({
                                                            ...prevState,
                                                            EDate: e.target.value
                                                        }))}
                                                        onKeyDown={(e) => handleKeyDown(e, DepositRef, true)}
                                                    />
                                                </div>


                                                <div className="col-lg-2 col-md-6 mb-3">
                                                    <div className="mb-3 add-product">
                                                        <label className="form-label">डिपॉजिट</label>
                                                        <input
                                                            ref={DepositRef}
                                                            type="text"
                                                            value={formData.Deposit || ""}  // Ensures it's not undefined
                                                            className="form-control"
                                                            onChange={(e) => setformData(prevState => ({
                                                                ...prevState,
                                                                Deposit: e.target.value
                                                            }))}
                                                            onKeyDown={(e) => handleKeyDown(e, RentRef, true)}
                                                        />
                                                    </div>
                                                </div>


                                                <div className="col-lg-2 col-md-6 mb-3">
                                                    <div className="mb-3 add-product">
                                                        <label className="form-label">भाडे</label>
                                                        <input
                                                            ref={RentRef}
                                                            type="number"
                                                            value={formData.Rent || ""}  // Ensures it's not undefined
                                                            className="form-control"
                                                            onChange={(e) => setformData(prevState => ({
                                                                ...prevState,
                                                                Rent: e.target.value
                                                            }))}
                                                            onKeyDown={(e) => handleKeyDown(e, SaveRef, true)}
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
                                    <button type="button" className="btn btn-cancel me-2" onClick={handleExit}>
                                        मागे
                                    </button>
                                    <button type="submit"
                                        className="btn btn-submit"
                                        ref={SaveRef}
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

export default AddGalaAlot;

