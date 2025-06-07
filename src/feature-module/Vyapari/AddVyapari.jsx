import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import { all_routes } from "../../Router/all_routes";
// import { setToogleHeader } from "../../core/redux/action";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { setToogleHeader } from "../../core/redux/action";
import { baseUrl, ACSPLGUID, convertToISODate } from "../../core/json/custom";
import { useLocation } from 'react-router-dom';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axios from 'axios';
import { getUserData } from "../../Context/UserData";
import { useNavigate } from 'react-router-dom';
import { PlusCircle } from "react-feather";

import {
    ArrowLeft,
    // ChevronDown,
    Info,
    ChevronUp,

} from "feather-icons-react/build/IconComponents";
// import Verification from "./Verification";
import { Modal, Button } from 'react-bootstrap';
// import VyapariVerification from "./VyapariVerification";
// import Verification from "../../core/modals/inventory/verification";

import VyapariVerification from './VyapariVerification';


const AddVyapari = () => {

    const location = useLocation();
    const { vpaid } = location.state || {};
    console.log('vpaid  ', vpaid)
    const otp = location.state?.OTP;
    const vid = location.state?.PKID;
    console.log('OTP OTP OTP ', otp, vid)
    const { userdetail } = getUserData();


    const [GUID, setGUID] = useState(ACSPLGUID.getNew());

    useEffect(() => {
        const checkOTP = async () => {
            console.log("OTP OTP OTP", otp, vid);

            try {
                const payload = {
                    PKOID: vid,
                    otp: otp
                };

                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };

                const response = await axios.post(
                    baseUrl.Url + "/backend/api/SP_CheckOTP",
                    payload,
                    { headers }
                );

                if (response.status === 200) {
                    const result = response.data[0];

                    if (result.isSuccessful === 1) {
                        console.log("Valid OTP, saving...");
                        handleSave();




                        const modal = document.getElementById("add-verification");
                        if (modal) {
                            modal.classList.remove("show");
                            modal.style.display = "none";
                            modal.setAttribute("aria-hidden", "true");


                            document.querySelectorAll(".modal-backdrop").forEach(backdrop => {
                                backdrop.remove();
                            });


                            document.body.classList.remove("modal-open");
                            document.body.style.overflow = "";
                            document.body.style.paddingRight = "";
                        }

                    } else {
                        console.log("Invalid OTP:", otp);
                        Swal.fire({
                            icon: "error",
                            title: "अवैध OTP",
                            text: "तुम्ही दिलेला OTP चुकीचा आहे. कृपया योग्य OTP टाका आणि पुन्हा प्रयत्न करा.",
                            confirmButtonText: "पुन्हा प्रयत्न करा",
                            allowOutsideClick: false,
                            allowEscapeKey: false,

                        });
                    }
                }
            } catch (error) {
                console.error("Get data Error:", error);
            }
        };

        if (otp && vid) {
            checkOTP();
        }

    }, [otp, vid]);



    const route = all_routes;
    const dispatch = useDispatch();
    const generatedID = ACSPLGUID?.getNew();
    // const GUID = ACSPLGUID.getNew()
    const navigate = useNavigate();
    const data = useSelector((state) => state.toggle_header);
    const renderCollapseTooltip = (props) => (
        <Tooltip id="refresh-tooltip" {...props}>
            Collapse
        </Tooltip>
    );

    const nameInputRef = useRef(null);
    const StatusRef = useRef(null);
    const MobileRef = useRef(null);
    const AadharRef = useRef(null);
    const ShortnameRef = useRef(null);
    const PANRef = useRef(null);
    const BirthdayRef = useRef(null);
    const AnniversaryRef = useRef(null);
    const PincodeRef = useRef(null);
    const StateRef = useRef(null);
    const CityRef = useRef(null);
    const AreaRef = useRef(null);
    const AddressRef = useRef(null);
    const CAreaRef = useRef(null);
    const CCityRef = useRef(null);
    const CPincodeRef = useRef(null);
    const CompanyRef = useRef(null);
    const GSTINRef = useRef(null);
    const CPANRef = useRef(null);
    const CEmailRef = useRef(null);
    const CStateRef = useRef(null);
    const CAddressRef = useRef(null);
    const BankNameRef = useRef(null);
    const BranchNameRef = useRef(null);
    const AccountNameRef = useRef(null);
    const IFSCRef = useRef(null);
    const AccountNumberRef = useRef(null);
    const TypeRef = useRef(null);
    const SubmitRef = useRef(null);
    const SchemeRef = useRef(null);

    useEffect(() => {
        if (TypeRef.current) {
            TypeRef.current.focus(); // Focus the input element
        }
    }, []);


    useEffect(() => {
        const handleShortcut = (e) => {
            if (e.ctrlKey && e.key === 'e' || e.ctrlKey && e.key === 'E') {
                e.preventDefault();
                navigate(route.Vyapari);
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
    },);


    const [fetchedImageURL, setFetchedImageURL] = useState(null);
    // const [isCaptureMode, setIsCaptureMode] = useState(false);
    const [sellingtype, setsellingtype] = useState([]);
    const [statetype, setstatetype] = useState([]);
    const [csellingtype, setcsellingtype] = useState([]);
    const [cstatetype, setcstatetype] = useState([]);
    // const [isSameAddress, setIsSameAddress] = useState(false);
    const [formData, setFormData] = useState({
        Name: "",
        VPPHOTO: "",
        VPAADHAR: "",
        VPPAN: "",
        Type: "",
        Birthday: "",
        Anniversary: "",
        Mobile: "",
        Aadhar: "",
        PAN: "",
        Designation: "",
        Address: "",
        Area: "",
        Pincode: "",
        City: "",
        State: "",
        GSTIN: "",
        CEmail: "",
        CPAN: "",
        CAddress: "",
        CArea: "",
        CPincode: "",
        CCity: "",
        CState: "",
        Status: "",
        SameAddress: false,
        IFSC: "",
        AccountNumber: "",
        AccountName: "",
        BankName: "",
        BranchName: "",
        Company: "",
        Registration: "",
        Shortname: "",
        VPAID: "",

    });
    // console.log('isSameAddress', isSameAddress)
    console.log('formDataisSameAddress', formData.SameAddress)
    console.log('StatusStatusStatusStatus', formData.Status)


    useEffect(() => {
        const today = new Date().toISOString().split("T")[0];  // Get today's date in YYYY-MM-DD format
        setFormData(prevState => ({
            ...prevState,
            Registration: today,  // Set today's date as the default value
        }));
    }, []);





    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('formDataformDataformData', formData)
        showConfirmationAlert(e);
    };


    const MySwal = withReactContent(Swal);
    const showConfirmationAlert = () => {
        MySwal.fire({

            title: "तुम्हाला खात्री आहे का?",
            text: "तुम्ही हा डेटा जतन करू इच्छिता का?",
            showCancelButton: true,
            confirmButtonColor: "#00ff00",
            confirmButtonText: "जतन करा",
            cancelButtonColor: "#092C4C",
            cancelButtonText: "रद्द करा",
            allowOutsideClick: false,
            allowEscapeKey: false,

        }).then((result) => {
            if (result.isConfirmed) {
                // handleModalConfirm(event);
                handleSave();
                // Swal.fire({
                //     icon: "success",
                //     title: "जतन झाले!",
                //     text: "डेटा यशस्वीरित्या जतन झाला आहे.",
                //     confirmButtonText: "ठीक आहे",
                //     allowOutsideClick: false,
                //     allowEscapeKey: false,

                // });
            }
        });
    };



    const handleSave = async () => {
        // e.preventDefault();
        // showConfirmationAlert(e);
        console.log('Runnnnnnnnnnn')

        if (formData.VPAID != '') {
            const payload = {
                "vpaid": formData.VPAID ? formData.VPAID : GUID,
                "vname": formData.Name,
                "otp": formData.Type == 0 ? otp : 0,
                "vpphoto": formData.VPPHOTO,
                "vpaadhar": formData.VPAADHAR,
                "vppan": formData.VPPAN,
                "vshortname": formData.Shortname,
                "vregistration": formData.Registration,
                "vtype": formData.Type,
                "vmoblie": formData.Mobile,
                "vemail": formData.CEmail,
                "vaadhar": formData.Aadhar,
                "vpan": formData.PAN,
                "vbirthdaydate": formData.Birthday,
                "vaniversarydate": formData.Anniversary,
                "vstatus": formData.Status,
                "vaddress": formData.Address,
                "varea": formData.Area,
                "vpincode": formData.Pincode || 0,
                "vcity": formData.City,
                "vstate": formData.State,
                "vsameaddress": formData.SameAddress,
                "vgstin": formData.GSTIN,
                "vcompname": formData.Company,
                "vcomppan": formData.CPAN,
                "vcompaddress": formData.CAddress,
                "vcomparea": formData.CArea,
                "vcomppincode": formData.CPincode || 0,
                "vcompcity": formData.CCity,
                "vcompstate": formData.CState,
                "vifsccode": formData.IFSC,
                "vaccountnumber": formData.AccountNumber,
                "vaccountname": formData.AccountName,
                "vbankname": formData.BankName,
                "vbranchname": formData.BranchName,
                "companyid": userdetail?.companyID ? userdetail.companyID : "",
                "deptid": userdetail?.departmentID ? userdetail.departmentID : "",
                "uaid": "",
                "vpscheme": formData.VPSCHEME,

            };

            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };
            try {
                const response1 = await axios.post(baseUrl.Url + "/backend/api/SP_AddUpdVyapariMaster", payload, { headers });

                if (response1.status === 200) {
                    Swal.fire({
                        icon: "success",
                        title: "जतन झाले!",
                        text: "डेटा यशस्वीपणे जतन झाला आहे.",
                        confirmButtonText: "ठीक आहे",
                        allowOutsideClick: false,
                        allowEscapeKey: false,

                    }).then((result) => {
                        if (result.isConfirmed) {
                            console.log("Data save success");
                        }
                    });
                }
            } catch (error) {
                console.error("Submission Error:", error);
                Swal.fire({
                    icon: "error",
                    title: "त्रुटी",
                    text: "डेटा जतन करण्यात अयशस्वी. कृपया पुन्हा प्रयत्न करा.",
                    allowOutsideClick: false,
                    allowEscapeKey: false,

                });
            }

            const payload2 = {
                "uaid": GUID,
                "ucompanyid": userdetail?.companyID ? userdetail.companyID : "",
                "ubranchid": userdetail?.departmentID ? userdetail.departmentID : "",
                "upacsid": "",
                "ustoreid": "",
                "uwarehouseid": "",
                "uroleid": "",
                "utitle": formData.Shortname,
                "uforename": formData.Name,
                "udescription": "",
                "uemailaddress": formData.CEmail,
                "ulogintype": "",
                "umobilenumber": formData.Mobile,
                "upassword": formData.Mobile,
                "ugroup": "",
                "uaccesspolicy": "VAPDASH",
                "uaccessdays": "",
                "uaccesstimestart": "",
                "uaccesstimeend": "",
                "uregistrationdate": userdetail.APPDT,
                "uexpirydate": "",
                "ureferencekey": "",
                "uloginkey": "",
                "ulastlogindatetime": "",
                "ulogincount": "",
                "ustatusid": "",
                "ugoogleclientid": "",
                "ufacebookclientid": "",
                "uapplicationkey": "",
                "uapplicationdate": "",
                "uapplicationhome": "",
                "ulanguageid": ""
            };

            try {
                const response1 = await axios.post(baseUrl.Url + "/backend/api/SP_AddUpdUserMasters", payload2, { headers });

                if (response1.status === 200) {
                    Swal.fire({
                        icon: "success",
                        title: "जतन झाले!",
                        text: "डेटा यशस्वीरित्या जतन झाला आहे.",
                        confirmButtonText: "ठीक आहे",
                        allowOutsideClick: false,
                        allowEscapeKey: false,

                    }).then((result) => {
                        if (result.isConfirmed) {
                            console.log("Data save success");
                        }
                    });
                }
            } catch (error) {
                console.error("Submission Error:", error);
                Swal.fire({
                    icon: "error",
                    title: "त्रुटी",
                    text: "डेटा जतन करण्यात अयशस्वी. कृपया पुन्हा प्रयत्न करा.",
                    allowOutsideClick: false,
                    allowEscapeKey: false,

                });
            }
        }


        if (formData.VPAID == '') {

            try {


                const payload1 = {
                    "vemail": formData.CEmail,
                };

                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };

                const response1 = await axios.post(baseUrl.Url + "/backend/api/SP_VyapariEmailCheak", payload1, { headers });


                const payload = {
                    "vaadhar": formData.Aadhar,
                };

                const response = await axios.post(baseUrl.Url + "/backend/api/SP_CheckVyapariAadhaar", payload, { headers });

                if ((response.status === 200) && (response1.status === 200)) {
                    console.log(response.data);

                    if (response.data[0].isSuccessful == 1) {
                        Swal.fire({
                            icon: "error",
                            title: "त्रुटी ",
                            text: response.data[0].responseMessage,
                            confirmButtonText: "OK",
                            allowOutsideClick: false,
                            allowEscapeKey: false,
                        }).then((result) => {
                            if (result.isConfirmed) {
                                console.log("Data save success");
                            }
                        });

                    } else if ((formData.Type == 0) && (response1.data[0].isSuccessful == 1)) {
                        Swal.fire({
                            icon: "error",
                            title: "त्रुटी ",
                            text: response1.data[0].responseMessage,
                            confirmButtonText: "OK",
                            allowOutsideClick: false,
                            allowEscapeKey: false,
                        }).then((result) => {
                            if (result.isConfirmed) {
                                console.log("Data save success");
                            }
                        });

                    } else {
                        const payload = {
                            "vpaid": formData.VPAID ? formData.VPAID : GUID,
                            "vname": formData.Name,
                            "otp": formData.Type == 0 ? otp : 0,
                            "vpphoto": formData.VPPHOTO,
                            "vpaadhar": formData.VPAADHAR,
                            "vppan": formData.VPPAN,
                            "vshortname": formData.Shortname,
                            "vregistration": formData.Registration,
                            "vtype": formData.Type,
                            "vmoblie": formData.Mobile,
                            "vemail": formData.CEmail,
                            "vaadhar": formData.Aadhar,
                            "vpan": formData.PAN,
                            "vbirthdaydate": formData.Birthday,
                            "vaniversarydate": formData.Anniversary,
                            "vstatus": formData.Status,
                            "vaddress": formData.Address,
                            "varea": formData.Area,
                            "vpincode": formData.Pincode || 0,
                            "vcity": formData.City,
                            "vstate": formData.State,
                            "vsameaddress": formData.SameAddress,
                            "vgstin": formData.GSTIN,
                            "vcompname": formData.Company,
                            "vcomppan": formData.CPAN,
                            "vcompaddress": formData.CAddress,
                            "vcomparea": formData.CArea,
                            "vcomppincode": formData.CPincode || 0,
                            "vcompcity": formData.CCity,
                            "vcompstate": formData.CState,
                            "vifsccode": formData.IFSC,
                            "vaccountnumber": formData.AccountNumber,
                            "vaccountname": formData.AccountName,
                            "vbankname": formData.BankName,
                            "vbranchname": formData.BranchName,
                            "companyid": userdetail?.companyID ? userdetail.companyID : "",
                            "deptid": userdetail?.departmentID ? userdetail.departmentID : "",
                            "uaid": "",
                            "vpscheme": formData.VPSCHEME,

                        };

                        try {
                            const response1 = await axios.post(baseUrl.Url + "/backend/api/SP_AddUpdVyapariMaster", payload, { headers });

                            if (response1.status === 200) {
                                Swal.fire({
                                    icon: "success",
                                    title: "जतन झाले!",
                                    text: "डेटा यशस्वीरित्या जतन झाला.",
                                    confirmButtonText: "ठीक आहे",
                                    allowOutsideClick: false,
                                    allowEscapeKey: false,

                                }).then((result) => {
                                    if (result.isConfirmed) {
                                        console.log("Data save success");
                                    }
                                });
                            }
                        } catch (error) {
                            console.error("Submission Error:", error);
                            Swal.fire({
                                icon: "error",
                                title: "त्रुटी",
                                text: "डेटा जतन करण्यात अयशस्वी. कृपया पुन्हा प्रयत्न करा.",
                                allowOutsideClick: false,
                                allowEscapeKey: false,

                            });
                        }
                        const payload2 = {
                            "uaid": GUID,
                            "ucompanyid": userdetail?.companyID ? userdetail.companyID : "",
                            "ubranchid": userdetail?.departmentID ? userdetail.departmentID : "",
                            "upacsid": "",
                            "ustoreid": "",
                            "uwarehouseid": "",
                            "uroleid": "",
                            "utitle": formData.Shortname,
                            "uforename": formData.Name,
                            "udescription": "",
                            "uemailaddress": formData.CEmail,
                            "ulogintype": "",
                            "umobilenumber": formData.Mobile,
                            "upassword": "Welcome",
                            "ugroup": "",
                            "uaccesspolicy": "VAPDASH",
                            "uaccessdays": "",
                            "uaccesstimestart": "",
                            "uaccesstimeend": "",
                            "uregistrationdate": userdetail.APPDT,
                            "uexpirydate": "",
                            "ureferencekey": "",
                            "uloginkey": "",
                            "ulastlogindatetime": "",
                            "ulogincount": "",
                            "ustatusid": "",
                            "ugoogleclientid": "",
                            "ufacebookclientid": "",
                            "uapplicationkey": "",
                            "uapplicationdate": "",
                            "uapplicationhome": "",
                            "ulanguageid": ""
                        };

                        try {
                            const response1 = await axios.post(baseUrl.Url + "/backend/api/SP_AddUpdUserMasters", payload2, { headers });

                            if (response1.status === 200) {
                                Swal.fire({
                                    icon: "success",
                                    title: "जतन झाले!",
                                    text: "डेटा यशस्वीरित्या जतन झाला.",
                                    confirmButtonText: "ठीक आहे",
                                    allowOutsideClick: false,
                                    allowEscapeKey: false,
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                        console.log("Data save success");
                                    }
                                });
                            }
                        } catch (error) {
                            console.error("Submission Error:", error);
                            Swal.fire({
                                icon: "error",
                                title: "त्रुटी",
                                text: "डेटा जतन करण्यात अयशस्वी. कृपया पुन्हा प्रयत्न करा.",
                                allowOutsideClick: false,
                                allowEscapeKey: false,
                            });
                        }
                    }
                }
            } catch (error) {
                console.error("Get data Error:", error);
            }
        }
        // if (formData.VPAID == '') {
        //     if (formData.Type === 0) {
        //         try {
        //             const payload = {
        //                 "vemail": formData.CEmail,
        //             };

        //             const headers = {
        //                 "Content-Type": "application/json",
        //                 Accept: "*/*",
        //             };

        //             const response = await axios.post(baseUrl.Url + "/backend/api/SP_VyapariEmailCheak", payload, { headers });

        //             if (response.status === 200) {
        //                 console.log(response.data);

        //                 if (response.data[0].isSuccessful == 1) {
        //                     Swal.fire({
        //                         icon: "error",
        //                         title: "Error",
        //                         text: response.data[0].responseMessage,
        //                         confirmButtonText: "OK",
        //                     }).then((result) => {
        //                         if (result.isConfirmed) {
        //                             console.log("Data save success");
        //                         }
        //                     });

        //                 } else {
        //                     const payload = {
        //                         "vpaid": formData.VPAID ? formData.VPAID : GUID,
        //                         "vname": formData.Name,
        //                         "otp" : otp,
        //                         "vpphoto": formData.VPPHOTO,
        //                         "vpaadhar": formData.VPAADHAR,
        //                         "vppan": formData.VPPAN,
        //                         "vshortname": formData.Shortname,
        //                         "vregistration": formData.Registration,
        //                         "vtype": formData.Type,
        //                         "vmoblie": formData.Mobile,
        //                         "vemail": formData.CEmail,
        //                         "vaadhar": formData.Aadhar,
        //                         "vpan": formData.PAN,
        //                         "vbirthdaydate": formData.Birthday,
        //                         "vaniversarydate": formData.Anniversary,
        //                         "vstatus": formData.Status,
        //                         "vaddress": formData.Address,
        //                         "varea": formData.Area,
        //                         "vpincode": formData.Pincode || 0,
        //                         "vcity": formData.City,
        //                         "vstate": formData.State,
        //                         "vsameaddress": formData.SameAddress,
        //                         "vgstin": formData.GSTIN,
        //                         "vcompname": formData.Company,
        //                         "vcomppan": formData.CPAN,
        //                         "vcompaddress": formData.CAddress,
        //                         "vcomparea": formData.CArea,
        //                         "vcomppincode": formData.CPincode || 0,
        //                         "vcompcity": formData.CCity,
        //                         "vcompstate": formData.CState,
        //                         "vifsccode": formData.IFSC,
        //                         "vaccountnumber": formData.AccountNumber,
        //                         "vaccountname": formData.AccountName,
        //                         "vbankname": formData.BankName,
        //                         "vbranchname": formData.BranchName,
        //                         "companyid": userdetail?.companyID ? userdetail.companyID : "",
        //                         "deptid": userdetail?.departmentID ? userdetail.departmentID : "",
        //                         "uaid": userdetail?.uaid ? userdetail.uaid : ""
        //                     };

        //                     try {
        //                         const response1 = await axios.post(baseUrl.Url + "/backend/api/SP_AddUpdVyapariMaster", payload, { headers });

        //                         if (response1.status === 200) {
        //                             Swal.fire({
        //                                 icon: "success",
        //                                 title: "Saved!",
        //                                 text: "Data saved successfully.",
        //                                 confirmButtonText: "OK",
        //                             }).then((result) => {
        //                                 if (result.isConfirmed) {
        //                                     console.log("Data save success");
        //                                 }
        //                             });
        //                         }
        //                     } catch (error) {
        //                         console.error("Submission Error:", error);
        //                         Swal.fire({
        //                             icon: "error",
        //                             title: "Error",
        //                             text: "Failed to save data. Please try again.",
        //                         });
        //                     }
        //                     const payload2 = {
        //                         "uaid": GUID,
        //                         "ucompanyid": userdetail?.companyID ? userdetail.companyID : "",
        //                         "ubranchid": userdetail?.departmentID ? userdetail.departmentID : "",
        //                         "upacsid": "",
        //                         "ustoreid": "",
        //                         "uwarehouseid": "",
        //                         "uroleid": "",
        //                         "utitle": formData.Shortname,
        //                         "uforename": formData.Name,
        //                         "udescription": "",
        //                         "uemailaddress": formData.CEmail,
        //                         "ulogintype": "",
        //                         "umobilenumber": formData.Mobile,
        //                         "upassword": "Welcome",
        //                         "ugroup": "",
        //                         "uaccesspolicy": "",
        //                         "uaccessdays": "",
        //                         "uaccesstimestart": "",
        //                         "uaccesstimeend": "",
        //                         "uregistrationdate": "9 april 2025",
        //                         "uexpirydate": "",
        //                         "ureferencekey": "",
        //                         "uloginkey": "",
        //                         "ulastlogindatetime": "",
        //                         "ulogincount": "",
        //                         "ustatusid": "",
        //                         "ugoogleclientid": "",
        //                         "ufacebookclientid": "",
        //                         "uapplicationkey": "",
        //                         "uapplicationdate": "",
        //                         "uapplicationhome": "",
        //                         "ulanguageid": ""
        //                     };

        //                     try {
        //                         const response1 = await axios.post(baseUrl.Url + "/backend/api/SP_AddUpdUserMasters", payload2, { headers });

        //                         if (response1.status === 200) {
        //                             Swal.fire({
        //                                 icon: "success",
        //                                 title: "Saved!",
        //                                 text: "Data saved successfully.",
        //                                 confirmButtonText: "OK",
        //                             }).then((result) => {
        //                                 if (result.isConfirmed) {
        //                                     console.log("Data save success");
        //                                 }
        //                             });
        //                         }
        //                     } catch (error) {
        //                         console.error("Submission Error:", error);
        //                         Swal.fire({
        //                             icon: "error",
        //                             title: "Error",
        //                             text: "Failed to save data. Please try again.",
        //                         });
        //                     }
        //                 }
        //             }
        //         } catch (error) {
        //             console.error("Get data Error:", error);
        //         }
        //     }
        // }



    };

    const [ServiceType, setServiceType] = useState([]);
    const [StatusType, setStatusType] = useState([]);


    useEffect(() => {
        const fetchServiceTypes = async () => {
            try {
                const response = await axios.get(
                    baseUrl.Url + "/backend/api/Implications/VTYPE",
                );
                if (response.status !== 200) throw new Error("Failed to fetch implications data");
                const data = response.data;
                const implicationsDropdown = data.map(({ iTitle, iValue }) => ({
                    label: iTitle,
                    value: iValue,
                }));
                setServiceType(implicationsDropdown);
            } catch (error) {
                console.error("Error fetching implications:", error);
            }
        };
        fetchServiceTypes();
    }, []);


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
                setStatusType(implicationsDropdown);
            } catch (error) {
                console.error("Error fetching implications:", error);
            }
        };
        fetchServiceTypes();
    }, []);


    useEffect(() => {
        const fetchData = async () => {
            try {
                // First API call to fetch vendor data
                const payload1 = {
                    "vpaid": vpaid,
                    "keyword": "%",
                    "companyid": "COMP123456789",
                    "deptid": "D001",
                    // "companyid": userdetail?.companyID ? userdetail.companyID : "",
                    // "deptid": userdetail?.departmentID ? userdetail.departmentID : "",

                };
                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };
                const response1 = await axios.post(
                    `${baseUrl.Url}/backend/api/GET_VyapariMaster`,
                    payload1,
                    { headers }
                );
                if (response1.status !== 200)
                    throw new Error("Failed to fetch vendor data");
                console.log("master", response1.data);
                if (response1.data.length > 0) {
                    setFormData(prevState => ({
                        ...prevState,
                        VPAID: response1.data[0].vpaid,
                        Name: response1.data[0].vname,
                        VPPHOTO: response1.data[0].vpphoto,
                        VPAADHAR: response1.data[0].vpaadhar,
                        VPPAN: response1.data[0].vppan,
                        Shortname: response1.data[0].vshortname,
                        Registration: convertToISODate(response1.data[0].vregistration),
                        Type: response1.data[0].vtype,
                        Birthday: convertToISODate(response1.data[0].vbirthdaydate),
                        Anniversary: convertToISODate(response1.data[0].vaniversarydate),
                        Mobile: response1.data[0].vmoblie,
                        Aadhar: response1.data[0].vaadhar,
                        PAN: response1.data[0].vpan,
                        Address: response1.data[0].vaddress,
                        Area: response1.data[0].varea,
                        Pincode: response1.data[0].vpincode,
                        City: response1.data[0].vcity,
                        State: response1.data[0].vstate,
                        GSTIN: response1.data[0].vgstin,
                        CEmail: response1.data[0].vemail,
                        CPAN: response1.data[0].vcomppan,
                        CAddress: response1.data[0].vcompaddress,
                        CArea: response1.data[0].vcomparea,
                        CPincode: response1.data[0].vcomppincode,
                        CCity: response1.data[0].vcompcity,
                        CState: response1.data[0].vcompstate,
                        Status: response1.data[0].vstatus,
                        SameAddress: response1.data[0].vsameaddress,
                        IFSC: response1.data[0].vifsccode,
                        AccountNumber: response1.data[0].vaccountnumber,
                        AccountName: response1.data[0].vaccountname,
                        BankName: response1.data[0].vbankname,
                        BranchName: response1.data[0].vbranchname,
                        Company: response1.data[0].vcompname,
                        VPSCHEME: response1.data[0].vpscheme,
                    }));

                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, [vpaid]);



    const handleSelectChange = (selectedOption, field) => {
        console.log('selecteddropdown', selectedOption.value)
        setFormData(prevData => ({
            ...prevData,
            [field]: selectedOption ? selectedOption.value : '',
        }));
    };


    const handleCheckboxChange = (e) => {
        setFormData({
            ...formData,
            SameAddress: e.target.checked ? true : false,
        });
        const isChecked = e.target.checked;
        // setIsSameAddress(isChecked);

        if (isChecked) {
            setFormData((prevFormData) => ({
                ...prevFormData,
                CAddress: prevFormData.Address,
                CArea: prevFormData.Area,
                CPincode: prevFormData.Pincode,
                CCity: prevFormData.City,
                CState: prevFormData.State,
            }));

        } else {
            setFormData((prevFormData) => ({
                ...prevFormData,
                CAddress: '',
                CArea: '',
                CPincode: '',
                CCity: '',
                CState: '',
            }));
        }
    };


    const validateinput = (e) => {
        const { Name, Status, Mobile, Aadhar, PAN, Pincode, State, City, GSTIN, CPAN, CPincode,
            CState, CCity, IFSC, AccountNumber } = formData;

        if ((!Name || !/^[A-Za-zअ-हअ-ॣं-ः\s]*$/.test(Name)) ||
            (!Status || Status === '') ||
            (!Mobile || !/(^[7-9][0-9]{9}$)|(^[७-९][०-९]{9}$)/.test(Mobile)) ||
            (!Aadhar || !/(^\d{12}$)|(^[०-९]{12}$)/.test(Aadhar)) ||
            (!PAN || !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(PAN)) ||
            (!Pincode || !/^[1-9][0-9]{5}$/.test(Pincode)) ||
            (!State || State === '') ||
            (!City || City === '') ||
            (!GSTIN || !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9]{1}[A-Z]{1}[0-9]{1}$/.test(GSTIN)) ||
            (!CPAN || !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(CPAN)) ||
            (!CPincode || !/^[1-9][0-9]{5}$/.test(CPincode)) ||
            (!CState || CState === '') ||
            (!CCity || CCity === '') ||
            (!IFSC || !/^[1-9][0-9]{5}$/.test(IFSC)) ||
            (!AccountNumber || !/(^\d{9,18}$)|(^[०-९]{9,18}$)/.test(AccountNumber))
        ) {
            Swal.fire({
                icon: "error",
                title: "सत्यापन त्रुटी",
                text: "कृपया सर्व आवश्यक फील्ड भरा",
                confirmButtonText: "ठीक आहे",
                allowOutsideClick: false,
                allowEscapeKey: false,
            }).then(() => {
                nameInputRef.current.focus();
                StatusRef.current.focus();
                MobileRef.current.focus();
                AadharRef.current.focus();
                PANRef.current.focus();
                PincodeRef.current.focus();
                StateRef.current.focus();
                CityRef.current.focus();
                GSTINRef.current.focus();
                CPANRef.current.focus();
                CPincodeRef.current.focus();
                CStateRef.current.focus();
                CCityRef.current.focus();
                IFSCRef.current.focus();
                AccountNumberRef.current.focus();
            })
            return;
        }
        handleSubmit(e);
    }


    const handleBlur = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));

        if (name === 'Aadhar' && formData.VPAID == '') {
            try {
                const payload = {
                    "vaadhar": value,
                };
                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };
                axios({
                    method: "POST",
                    url: baseUrl.Url + "/backend/api/SP_CheckVyapariAadhaar",
                    data: JSON.stringify(payload),
                    headers: headers,
                })
                    .then((response) => {
                        if (response.status === 200) {
                            console.log(response.data)
                            if (response.data[0].isSuccessful == 1) {
                                Swal.fire({
                                    icon: "error",
                                    title: "Error",
                                    text: response.data[0].responseMessage,
                                    confirmButtonText: "OK",
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                        console.log("data save succsess")
                                    }
                                });
                            }
                        }
                    });
            } catch (error) {
                console.error('get data Error:', error);
            }
        } else {

            console.log("Condition not met. Either name is not 'Aadhar' or vpaid is not empty.");

        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));

        if (name === 'CEmail' && formData.VPAID == '' && value.trim() !== '') {
            try {
                const payload = {
                    "vemail": value,
                };
                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };
                axios({
                    method: "POST",
                    url: baseUrl.Url + "/backend/api/SP_VyapariEmailCheak",

                    data: JSON.stringify(payload),
                    headers: headers,
                })
                    .then((response) => {
                        if (response.status === 200) {
                            console.log(response.data)
                            if (response.data[0].isSuccessful == 1) {
                                Swal.fire({
                                    icon: "error",
                                    title: "त्रुटी",
                                    text: response.data[0].responseMessage,
                                    confirmButtonText: "OK",
                                    allowOutsideClick: false,
                                    allowEscapeKey: false,
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                        console.log("data save succsess")
                                    }
                                });
                            }
                        }
                    });
            } catch (error) {
                console.error('get data Error:', error);
            }
        } else {

            console.log("Condition not met. Either name is not 'Aadhar' or vpaid is not empty.");

        }
    };
    const handleChange = async (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
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
                        .map(({ sstatename, said }) => ({
                            label: sstatename,
                            value: said,
                        }));
                    setstatetype(Statedata)
                    const said = response.data[0]?.said || '';
                    setFormData((prevData) => ({
                        ...prevData,
                        State: said,
                        City: said,
                    }));
                } else {
                    console.error("Failed to fetch district and state for the pincode");
                }
            } catch (error) {
                console.error("Error fetching district and state data:", error);
            }
        }


        if (name === "CPincode" && value.length === 6) {
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
                    setcsellingtype(districtdata)
                    const Statedata = data
                        .map(({ sstatename, said }) => ({
                            label: sstatename,
                            value: said,
                        }));
                    setcstatetype(Statedata)
                    const said = response.data[0]?.said || '';
                    setFormData((prevData) => ({
                        ...prevData,
                        CState: said,
                        CCity: said,
                    }));
                } else {
                    console.error("Failed to fetch district and state for the pincode");
                }
            } catch (error) {
                console.error("Error fetching district and state data:", error);
            }
        }
    };


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

    // Company Pincode
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
                    setcsellingtype(districtdata)
                    const Statedata = data
                        .map(({
                            sstatename, said }) => ({
                                label: sstatename,
                                value: said,
                            }));
                    setcstatetype(Statedata);
                } else {
                    console.error("Failed to fetch district and state for the pincode");
                }
            } catch (error) {
                console.error("Error fetching district and state data:", error);
            }
        }
        fetchLocationData();
    }, []);


    const [selectedData, setSelectedData] = useState({ Name: null, Mobile: null });
    const openModal = (Name, Mobile, GUID) => {
        setSelectedData({ Name, Mobile, GUID })
    }


    const isFormValid = () => {
        const isRequiredFieldsFilled = formData.Name && formData.Shortname && formData.Mobile
            && formData.Aadhar && formData.PAN && formData.Pincode
            && formData.State && formData.City
            && formData.Area && formData.Address && formData.Company && formData.GSTIN
            && formData.CPAN && formData.CPincode
            && formData.CState && formData.CCity && formData.CArea && formData.CAddress && formData.CPincode
            && formData.BankName && formData.BranchName && formData.AccountName
            && formData.IFSC && formData.AccountNumber && formData.Status;

        const isIFSCValid = /^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.IFSC);
        const isAccountNumberValid = /(^\d{9,18}$)|(^[०-९]{9,18}$)/.test(formData.AccountNumber);
        const isMobileValid = /(^[7-9][0-9]{9}$)|(^[७-९][०-९]{9}$)/.test(formData.Mobile);
        const isAadharValid = /(^\d{12}$)|(^[०-९]{12}$)/.test(formData.Aadhar);
        const isPANValid = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.PAN);
        const isNameValid = /^[A-Za-zअ-हअ-ॣं-ः\s]*$/.test(formData.Name);
        const isPincodeValid = /^[1-9][0-9]{5}$/.test(formData.Pincode);
        const isCPincodeValid = /^[1-9][0-9]{5}$/.test(formData.Pincode);
        const isGSTINValid = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9]{1}[A-Z]{1}[0-9]{1}$/.test(formData.GSTIN);
        const isCPANValid = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.CPAN);

        return isRequiredFieldsFilled && isIFSCValid && isAccountNumberValid
            && isMobileValid && isAadharValid && isPANValid && isNameValid && isCPincodeValid
            && isPincodeValid && isGSTINValid && isCPANValid;
    };


    const handleKeyDown = (e, nextRef) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (nextRef && nextRef.current) {
                nextRef.current.focus();
            }
        }
    };


    const [selectedPhotoFile, setSelectedPhotoFile] = useState(null);
    const [uploadMessage, setUploadMessage] = useState("");
    const [messageColor, setMessageColor] = useState("black");

    const uploadProfile = async (fileData, uniqueFileName) => {
        const formDataToSend = new FormData();
        formDataToSend.append("Files", fileData);
        formDataToSend.append("FileNames", uniqueFileName);
        formDataToSend.append("FileSizeInBytes", fileData.size);
        formDataToSend.append("FilePath", `/Images/${uniqueFileName}`);
        formDataToSend.append("FileDescription", "Profile Image");

        try {
            const response = await axios.post(
                `${baseUrl.Url}/backend/api/ProfileUpload/Upload`,
                formDataToSend,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            console.log("✅ Upload Success:", response.data);
            setUploadMessage("फोटो यशस्वीरित्या अपलोड झाला!");
            setMessageColor("green");
        } catch (error) {
            console.error("❌ Upload Error:", error.message);
            setUploadMessage("फोटो अपलोड होताना त्रुटी आली.");
            setMessageColor("red");
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            let GUID = "";

            // Check if it's 'Add' or 'Edit' mode based on presence of VPID
            if (!formData?.VPAID) {
                // Add mode - use generatedID
                if (!generatedID) {
                    console.error("Error: Failed to generate GUID.");
                    setUploadMessage("युनिक ID मिळालेली नाही (GUID).");
                    setMessageColor("red");
                    return;
                }
                GUID = generatedID;
            } else {
                // Edit mode - use VPID
                GUID = formData.VPAID;
            }

            const finalFileName = `${GUID}_${file.name}`;
            setSelectedPhotoFile(file);
            setFormData({ ...formData, VPPHOTO: finalFileName });
            uploadProfile(file, finalFileName);
        }
    };





    const [AModalOpen, setAModalOpen] = useState(false);
    const [AfileUrl, setAFileUrl] = useState(null);
    const [AfileType, setAFileType] = useState(null);
    const [AfileName, setAFileName] = useState(null);
    console.log(AfileName)

    const handleAddharChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            let GUID = "";

            // Check if it's 'Add' or 'Edit' mode based on presence of VPID
            if (!formData?.VPAID) {
                // Add mode - use generatedID
                if (!generatedID) {
                    console.error("Error: Failed to generate GUID.");
                    setUploadMessage("युनिक ID मिळालेली नाही (GUID).");
                    setMessageColor("red");
                    return;
                }
                GUID = generatedID;
            } else {
                // Edit mode - use VPID
                GUID = formData.VPAID;
            }
            let finalFileName = `${GUID}_${file.name}`;
            setFormData({ ...formData, VPAADHAR: finalFileName });
            setAFileName(finalFileName); // ✅ use setAFileName

            // Check if file is an image or PDF
            if (file.type.startsWith("image/")) {
                setAFileType("image"); // ✅ use setAFileType
                const AfileUrl = URL.createObjectURL(file);
                setAFileUrl(AfileUrl); // ✅ use setAFileUrl
            } else if (file.type === "application/pdf") {
                setAFileType("pdf"); // ✅ use setAFileType
                const AfileUrl = URL.createObjectURL(file);
                setAFileUrl(AfileUrl); // ✅ use setAFileUrl
            } else {
                alert("Please upload a valid image or PDF file.");
                return;
            }

            // Upload the file using the appropriate API
            await uploadAddharProfile(file, finalFileName, file.type.startsWith("image/") ? "image" : "pdf");
        }
    };


    const uploadAddharProfile = async (fileData, uniqueFileName, fileType) => {
        const formData = new FormData();
        const messageContainer = document.getElementById("messageContainer");

        try {
            let response;

            if (fileType === "image") {
                // Image upload API expects 'Files', 'FileNames'
                formData.append("Files", fileData);
                formData.append("FileNames", uniqueFileName);
                formData.append("FileSizeInBytes", fileData.size);
                formData.append("FilePath", `/Images/${uniqueFileName}`);
                formData.append("FileDescription", "Profile Image");

                response = await axios.post(
                    `${baseUrl.Url}/backend/api/ProfileUpload/Upload`,
                    formData,
                    {
                        headers: { "Content-Type": "multipart/form-data" },
                    }
                );
            } else if (fileType === "pdf") {
                // PDF upload API expects 'File', 'FileName'
                formData.append("Files", fileData);
                formData.append("FileNames", uniqueFileName);
                formData.append("FileSizeInBytes", fileData.size);
                formData.append("FilePath", `/Images/${uniqueFileName}`);
                formData.append("FileDescription", "Profile PDF");

                response = await axios.post(
                    `${baseUrl.Url}/backend/api/PdfUpload/Upload`,
                    formData,
                    {
                        headers: { "Content-Type": "multipart/form-data" },
                    }
                );
            }

            console.log("✅ Upload Success:", response.data);
            messageContainer.innerHTML = "फोटो/PDF यशस्वीरित्या अपलोड झाला!";
            messageContainer.style.color = "green";
        } catch (error) {
            console.error("❌ Upload Error:", error.response?.data || error.message);
            messageContainer.innerHTML = "फोटो/PDF अपलोड होताना त्रुटी आली.";
            messageContainer.style.color = "red";
        }
    };


    const openAFilePreview = () => {
        // if (AfileUrl) {
        //     setAModalOpen(true);
        // } else {
        //     alert("No file available for preview.");
        // }
        setAModalOpen(true);
    };




    const closeAFilePreview = () => {
        setAModalOpen(false);
    };







    const [ModalOpen, setModalOpen] = useState(false);
    const [fileUrl, setFileUrl] = useState(null);
    const [fileType, setFileType] = useState(null);
    const [fileName, setFileName] = useState(null);
    console.log(fileName)
    const handlePanChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            let GUID = "";

            // Check if it's 'Add' or 'Edit' mode based on presence of VPID
            if (!formData?.VPAID) {
                // Add mode - use generatedID
                if (!generatedID) {
                    console.error("Error: Failed to generate GUID.");
                    setUploadMessage("युनिक ID मिळालेली नाही (GUID).");
                    setMessageColor("red");
                    return;
                }
                GUID = generatedID;
            } else {
                // Edit mode - use VPID
                GUID = formData.VPAID;
            }

            let finalFileName = `${GUID}_${file.name}`;
            setFormData({ ...formData, VPPAN: finalFileName });
            setFileName(finalFileName);


            if (file.type.startsWith("image/")) {
                setFileType("image");
                const fileUrl = URL.createObjectURL(file);
                setFileUrl(fileUrl); // Set image preview URL
            } else if (file.type === "application/pdf") {
                setFileType("pdf");
                const fileUrl = URL.createObjectURL(file);
                setFileUrl(fileUrl); // Set PDF preview URL
            } else {
                alert("Please upload a valid image or PDF file.");
                return;
            }

            // Upload the file to the appropriate API (image or pdf)
            await uploadPanProfile(file, finalFileName, file.type.startsWith("image/") ? "image" : "pdf");
        }
    };

    const uploadPanProfile = async (fileData, uniqueFileName, fileType) => {
        const formData = new FormData();
        const messageContainer = document.getElementById("messageContainer");

        try {
            let response;

            if (fileType === "image") {
                // Image upload API expects 'Files' and 'FileNames'
                formData.append("Files", fileData);
                formData.append("FileNames", uniqueFileName);
                formData.append("FileSizeInBytes", fileData.size);
                formData.append("FilePath", `/Images/${uniqueFileName}`);
                formData.append("FileDescription", "Profile Image");

                response = await axios.post(
                    `${baseUrl.Url}/backend/api/ProfileUpload/Upload`,

                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );
            } else if (fileType === "pdf") {
                // PDF upload API expects 'File' and 'FileName'
                formData.append("Files", fileData);
                formData.append("FileNames", uniqueFileName);
                formData.append("FileSizeInBytes", fileData.size);
                formData.append("FilePath", `/Images/${uniqueFileName}`);
                formData.append("FileDescription", "Profile PDF");

                response = await axios.post(
                    `${baseUrl.Url}/backend/api/PdfUpload/Upload`,
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );
            }

            console.log("✅ Upload Success:", response.data);
            messageContainer.innerHTML = "फोटो/PDF यशस्वीरित्या अपलोड झाला!";
            messageContainer.style.color = "green";
        } catch (error) {
            console.error("❌ Upload Error:", error.response?.data || error.message);
            messageContainer.innerHTML = "फोटो/PDF अपलोड होताना त्रुटी आली.";
            messageContainer.style.color = "red";
        }
    };



    const openFilePreview = () => {
        // if (fileUrl) {
        //     setModalOpen(true);
        // } else {
        //     alert("No file available for preview.");
        // }
        setModalOpen(true);
    };


    const closeFilePreview = () => {
        setModalOpen(false);
    };



    const [showModal, setShowModal] = useState(false);
    const [showCapturedImage, setShowCapturedImage] = useState(false);
    const [capturedImage, setCapturedImage] = useState(null);


    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);

    // Open camera modal
    const openimageModal = async () => {
        setShowCapturedImage(false);
        setCapturedImage(null);
        setShowModal(true);

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            streamRef.current = stream;

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
            }
        } catch (err) {
            console.error("Camera access denied or error:", err);
        }
    };

    // Stop camera stream
    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
    };

    // Close modal
    const closeimageModal = () => {
        stopCamera();
        setShowModal(false);
    };

    // Upload to backend API
    const uploadIProfile = async (fileData, uniqueFileName) => {
        const formDataToSend = new FormData();
        formDataToSend.append("Files", fileData);
        formDataToSend.append("FileNames", uniqueFileName);
        formDataToSend.append("FileSizeInBytes", fileData.size);
        formDataToSend.append("FilePath", `/Images/${uniqueFileName}`);
        formDataToSend.append("FileDescription", "Profile Image");

        try {
            const response = await axios.post(
                `${baseUrl.Url}/backend/api/ProfileUpload/Upload`,
                formDataToSend,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            console.log("✅ Upload Success:", response.data);
            setUploadMessage("फोटो यशस्वीरित्या अपलोड झाला!");
            setMessageColor("green");
        } catch (error) {
            console.error("❌ Upload Error:", error.message);
            setUploadMessage("फोटो अपलोड होताना त्रुटी आली.");
            setMessageColor("red");
        }
    };

    // Capture photo
    const captureImage = async () => {
        console.log("📸 Capture button clicked");

        const video = videoRef.current;
        const canvas = canvasRef.current;

        if (video && canvas) {
            const context = canvas.getContext("2d");
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            // Draw the current video frame onto the canvas
            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            // Convert the canvas image to a data URL
            const dataURL = canvas.toDataURL("image/png");

            let uniqueFileName = "";

            // Create filename based on formData or generated ID
            if (!formData?.VPAID) {
                if (!generatedID) {
                    console.error("Error: Failed to generate unique ID (GUID).");
                    return;
                }
                uniqueFileName = `${generatedID}_captured_photo.png`;
            } else {
                uniqueFileName = `${formData.VPAID}_captured_photo.png`;
            }

            // Convert data URL to File object
            const file = dataURLtoFile(dataURL, uniqueFileName);
            console.log("📁 File created", file);

            // Set preview in the modal
            setCapturedImage(URL.createObjectURL(file));

            // ✅ Set the photo in the upload box preview
            setSelectedPhotoFile(file);

            // Upload the file
            await uploadIProfile(file, file.name);

            // Update form data with photo filename
            setFormData({ ...formData, VPPHOTO: file.name });

            // Show captured image briefly before closing modal
            setShowCapturedImage(true);
            setTimeout(() => {
                setShowCapturedImage(false);
                closeimageModal();
            }, 500);
        } else {
            console.error("❌ Video or canvas not found");
        }
    };

    // Helper function: Convert dataURL to File object
    const dataURLtoFile = (dataurl, filename) => {
        const arr = dataurl.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);

        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }

        return new File([u8arr], filename, { type: mime });
    };



    const handlePlusCircleClick = () => {
        openimageModal();
    };

    const handlePhotoChange = () => {
        // Using SweetAlert2 for custom confirmation message
        // Using SweetAlert2 for custom confirmation message
        Swal.fire({
            title: "तुम्हाला नवीन फोटो घ्यायचा आहे का?",
            text: "OK क्लिक करा फोटो कॅप्चर करण्यासाठी, किंवा 'Cancel' गॅलरीतून फोटो निवडा.",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "फोटो कॅप्चर करा",
            cancelButtonText: "गॅलरीतून फोटो निवडा",
            reverseButtons: true,
            allowOutsideClick: false,
            allowEscapeKey: false,
        }).then((result) => {
            if (result.isConfirmed) {
                // If user chooses "Take Photo"
                openimageModal(); // Open Camera for Photo Capture
            } else if (result.isDismissed) {
                // If user chooses "Change Photo"
                document.getElementById("imageUpload").click(); // Open file input for Uploading Photo
            }
        });
    };

    useEffect(() => {
        const fetchImage = async () => {
            if (formData?.VPPHOTO) {
                const imageUrl = `${baseUrl.Url}/Images/${formData.VPPHOTO}`;
                try {
                    const response = await fetch(imageUrl, { credentials: 'include' }); // if auth is needed
                    const blob = await response.blob();
                    const objectURL = URL.createObjectURL(blob);
                    setFetchedImageURL(objectURL);
                } catch (error) {
                    console.error("Error fetching image:", error);
                }
            }
        };
        fetchImage();
    }, [formData?.VPPHOTO]);


    // useEffect(() => {
    //     const fetchAadhaarFile = async () => {
    //         if (formData?.VPAADHAR) {
    //             const url = `${baseUrl.Url}/Images/${formData.VPAADHAR}`;
    //             try {
    //                 const res = await fetch(url, { credentials: 'include' });
    //                 const blob = await res.blob();
    //                 const objectURL = URL.createObjectURL(blob);
    //                 const type = blob.type.includes('pdf') ? 'pdf' : 'image';
    //                 setAFileUrl(objectURL);
    //                 setAFileType(type);
    //             } catch (err) {
    //                 console.error("Failed to fetch Aadhaar file:", err);
    //             }
    //         }
    //     };
    //     fetchAadhaarFile();
    // }, [formData?.VPAADHAR]);


    useEffect(() => {
        if (formData?.VPAID && formData?.VPAADHAR) {
            const fileName = formData.VPAADHAR;
            const fileExtension = fileName.split('.').pop().toLowerCase();
            const filePath = `${baseUrl.Url}/Images/${fileName}`;

            setAFileUrl(filePath);
            setAFileType(fileExtension === 'pdf' ? 'pdf' : 'image');
            setAFileName(fileName);
        }
    }, [formData?.VPAID, formData?.VPAADHAR]);







    // useEffect(() => {
    //     const fetchPanFile = async () => {
    //         if (formData?.VPPAN) {
    //             const url = `${baseUrl.Url}/Images/${formData.VPPAN}`;
    //             try {
    //                 const res = await fetch(url, { credentials: 'include' });
    //                 const blob = await res.blob();
    //                 const objectURL = URL.createObjectURL(blob);
    //                 const type = blob.type.includes('pdf') ? 'pdf' : 'image';

    //                 setFileUrl(objectURL);
    //                 setFileType(type);
    //             } catch (err) {
    //                 console.error("Failed to fetch Aadhaar file:", err);
    //             }
    //         }
    //     };
    //     fetchPanFile();
    // }, [formData?.VPPAN]);




    useEffect(() => {
        const fetchPanFile = async () => {
            if (formData?.VPAID && formData?.VPPAN) {
                const fileName = formData.VPPAN;
                const fileExtension = fileName.split('.').pop().toLowerCase();

                // Always fetch from /Images/
                const filePath = `${baseUrl.Url}/Images/${fileName}`;


                console.log("Fetching PAN file from:", filePath);

                setFileUrl(filePath);
                setFileType(fileExtension === 'pdf' ? 'pdf' : 'image');
                setFileName(fileName);
            }
        };

        fetchPanFile();
    }, [formData?.VPAID, formData?.VPPAN]);




    const [schemename, setSchemename] = useState([]);
    const fetchSchemeName = async () => {
        try {
            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            const payload = {
                "companyid": "",
                "deptid": ""
            };

            const response = await axios.post(
                `${baseUrl.Url}/backend/api/GET_VyapariSchemeName`,
                payload,
                { headers }
            );
            if (response.status !== 200)
                throw new Error("Failed to fetch data");

            const data = response.data;
            const SchemeData = data
                .map(({ schemename, vsaid }) => ({
                    label: schemename,
                    value: vsaid,
                }));

            setSchemename(SchemeData);
        } catch (error) {
            console.error("Error fetching bank data:", error);
        }
    };

    useEffect(() => {
        fetchSchemeName();
    }, []);



    const [rokdaschemename, setRokdaSchemename] = useState([]);
    const fetchRokadaSchemeName = async () => {
        try {
            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            const payload = {
                "companyid": "",
                "deptid": ""
            };

            const response = await axios.post(
                `${baseUrl.Url}/backend/api/GET_RokadVyapariSchemeName`,
                payload,
                { headers }
            );
            if (response.status !== 200)
                throw new Error("Failed to fetch data");

            const data = response.data;
            const SchemeData = data
                .map(({ schemename, vsaid }) => ({
                    label: schemename,
                    value: vsaid,
                }));

            setRokdaSchemename(SchemeData);
        } catch (error) {
            console.error("Error fetching bank data:", error);
        }
    };

    useEffect(() => {
        fetchRokadaSchemeName();
    }, []);





    return (
        <>
            <div className="page-wrapper">
                <div className="content">
                    <div className="page-header">
                        <div className="add-item d-flex">
                            <div className="page-title">

                                <h3>नवीन व्यापारी</h3>
                                <h6>नवीन व्यापारी जोडा</h6>
                            </div>
                        </div>
                        <ul className="table-top-head">
                            <li>
                                <div className="page-btn">
                                    <Link to={route.Vyapari} className="btn btn-secondary">
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

                    <div className="card table-list-card">
                        <div className="card-body mbgcolor">
                            <div className="card-body p-4 mbgcolor">
                                <form onSubmit={handleSubmit}>
                                    <div className="" id="headingOne">
                                        <div
                                            className=""
                                            data-bs-toggle="collapse"
                                            data-bs-target="#collapseOne"
                                            aria-controls="collapseOne"
                                        >
                                            <div
                                                className="addproduct-icon mb-3 mt-2 d-flex align-items-center justify-content-between"
                                                style={{ borderBottom: '1px solid rgba(145, 158, 171, 0.3)' }}
                                            >
                                                <h5 className="d-flex align-items-center mb-0">
                                                    <Info className="add-info me-3" style={{ color: '#FF9F43' }} />
                                                    <span>व्यापारी माहिती</span>
                                                </h5>




                                                <div className="col-md-6">
                                                    <label className="form-label mt-2 required">व्यापारी प्रकार</label>
                                                    <Select

                                                        name="Type"
                                                        classNamePrefix="react-select"
                                                        options={ServiceType}
                                                        placeholder="Select"
                                                        required
                                                        ref={TypeRef}
                                                        title="Please select a valid type of service."
                                                        // onChange={handleSelectChange} 
                                                        // onChange={(selectedOption) => handleSelectChange(selectedOption, 'Type')}
                                                        // value={selectedOption}
                                                        value={ServiceType.find((option) => option.value === formData.Type)}

                                                        onChange={(selectedOption) => {

                                                            setFormData(prevState => ({
                                                                ...prevState,
                                                                Type: selectedOption ? selectedOption.value : '',
                                                            }));

                                                            // Move focus to the next field (SCDQUANTITYRef)
                                                            if (nameInputRef.current) {
                                                                nameInputRef.current.focus();
                                                            }
                                                        }}
                                                    />


                                                </div>
                                                <div className="col-md-3">
                                                    <label className="form-label mt-2 required">नोंदणी तारीख</label>
                                                    <input
                                                        type="date"
                                                        name="Registration"
                                                        className="form-control"
                                                        value={formData.Registration}
                                                        onChange={handleChange}
                                                        required
                                                        readOnly
                                                    />
                                                </div>
                                            </div>

                                        </div>
                                    </div>


                                    {formData.Type === '0' && (
                                        //   {selectedType === 'Vyapari' && (
                                        <div className="form-container">

                                            <div className="mb-3 row d-flex justify-content-end">
                                                <div className="container">
                                                    {/* Take Photo Button (Always visible)
                                                    <button className="btn btn-primary" onClick={openimageModal}>
                                                        Take Photo
                                                    </button> */}

                                                    {/* Modal for Camera */}
                                                    <Modal show={showModal} onHide={closeimageModal} centered>
                                                        <Modal.Header closeButton>
                                                            <Modal.Title>Take a Photo</Modal.Title>
                                                        </Modal.Header>
                                                        <Modal.Body className="text-center">
                                                            {!showCapturedImage ? (
                                                                <video
                                                                    ref={videoRef}
                                                                    autoPlay
                                                                    playsInline
                                                                    style={{ width: "100%", borderRadius: "10px" }}
                                                                />
                                                            ) : (
                                                                <img
                                                                    src={capturedImage}
                                                                    alt="Captured"
                                                                    className="img-fluid rounded"
                                                                    style={{ maxHeight: "400px" }}
                                                                />
                                                            )}
                                                            <canvas ref={canvasRef} style={{ display: "none" }} />
                                                        </Modal.Body>
                                                        {!showCapturedImage && (
                                                            <Modal.Footer>
                                                                <Button variant="secondary" onClick={closeimageModal}>
                                                                    Close
                                                                </Button>
                                                                <Button variant="primary" onClick={captureImage}>
                                                                    Capture
                                                                </Button>
                                                            </Modal.Footer>
                                                        )}
                                                    </Modal>
                                                </div>

                                                <div className="col-sm-3">

                                                    <label className="form-label">फोटो काढा:</label>

                                                    <div className="d-flex align-items-start mb-1">
                                                        <div
                                                            className="border rounded p-1 d-flex justify-content-center align-items-center"
                                                            style={{
                                                                width: "100px",
                                                                height: "100px",
                                                                backgroundColor: "#f8f9fa",
                                                            }}
                                                        >
                                                            {/* {selectedPhotoFile ? (
                                                                <img
                                                                    src={URL.createObjectURL(selectedPhotoFile)}
                                                                    alt="Upload Preview"
                                                                    className="img-fluid img-thumbnail rounded"
                                                                    style={{ maxHeight: "100%", maxWidth: "100%" }}
                                                                />
                                                            ) : (
                                                                <div className="text-muted text-center" onClick={handlePlusCircleClick}>
                                                                    <PlusCircle className="mb-1" />
                                                                    <div>फोटो अपलोड करा:</div>
                                                                </div>
                                                            )} */}
                                                            {selectedPhotoFile ? (
                                                                <img
                                                                    src={URL.createObjectURL(selectedPhotoFile)}
                                                                    alt="Upload Preview"
                                                                    className="img-fluid img-thumbnail rounded"
                                                                    style={{ maxHeight: "100%", maxWidth: "100%" }}
                                                                />
                                                            ) : fetchedImageURL ? (
                                                                <img
                                                                    src={fetchedImageURL}
                                                                    alt="Fetched from server"
                                                                    className="img-fluid img-thumbnail rounded"
                                                                    style={{ maxHeight: "100%", maxWidth: "100%" }}
                                                                />
                                                            ) : (
                                                                <div className="text-muted text-center" onClick={handlePlusCircleClick}>
                                                                    <PlusCircle className="mb-1" />
                                                                    <div>फोटो अपलोड करा:</div>
                                                                </div>
                                                            )}

                                                        </div>
                                                        <button
                                                            type="button"
                                                            className="btn btn-sm btn-primary ms-2 mt-4"
                                                            onClick={handlePhotoChange}
                                                        >
                                                            फोटो बदला
                                                        </button>

                                                        {/* Hidden file input */}
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={handleFileChange}
                                                            className="d-none"
                                                            id="imageUpload"
                                                        />


                                                    </div>

                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleFileChange}
                                                        className="d-none"
                                                        id="imageUpload"
                                                    />

                                                    {uploadMessage && (
                                                        <div className="mt-2" style={{ color: messageColor }}>
                                                            {uploadMessage}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>


                                            <div className="mb-3 row">
                                                <div className="col-md-8">
                                                    <label htmlFor="serviceName" className="form-label mt-2 required">
                                                        व्यापऱ्याचे नाव
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="Name"
                                                        className="form-control"
                                                        value={formData.Name}
                                                        onChange={handleChange}
                                                        ref={nameInputRef}
                                                        required
                                                        onKeyDown={(e) => handleKeyDown(e, ShortnameRef)}
                                                        pattern="^[A-Za-zअ-हअ-ॣं-ः\s]*$"
                                                        title="Title should only contain alphabetic characters and spaces."

                                                    />
                                                </div>


                                                <div className="col-md-4">
                                                    <label className="form-label mt-2 required"> उप नाव</label>
                                                    <input
                                                        type="text"
                                                        name="Shortname"
                                                        className="form-control"
                                                        value={formData.Shortname}
                                                        onChange={handleChange}
                                                        ref={ShortnameRef}
                                                        onKeyDown={(e) => handleKeyDown(e, MobileRef)}
                                                        required

                                                    />
                                                </div>



                                                <div className="col-md-2">
                                                    <label htmlFor="serviceName" className="form-label mt-2 required">
                                                        मोबाईल नंबर
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="Mobile"
                                                        className="form-control"
                                                        value={formData.Mobile}
                                                        onChange={handleChange}
                                                        required
                                                        ref={MobileRef}
                                                        onKeyDown={(e) => handleKeyDown(e, AadharRef)}
                                                        pattern="(^[7-9][0-9]{9}$)|(^[७-९][०-९]{9}$)"
                                                        title="Mobile number should start with a digit between 7-9 and contain exactly 10 digits."


                                                    />
                                                </div>

                                                <div className="col-md-3">
                                                    <label htmlFor="serviceName" className="form-label mt-2 required">
                                                        आधार नंबर
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="Aadhar"
                                                        className="form-control"
                                                        value={formData.Aadhar}
                                                        onChange={handleChange}
                                                        required
                                                        onBlur={handleBlur}
                                                        ref={AadharRef}
                                                        onKeyDown={(e) => handleKeyDown(e, PANRef)}
                                                        pattern="(^\d{12}$)|(^[०-९]{12}$)"
                                                        title="Aadhar number should be exactly 12 digits."


                                                    />
                                                </div>

                                                <div className="col-md-3">
                                                    <label htmlFor="serviceName" className="form-label mt-2 required">
                                                        पॅन नंबर
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="PAN"
                                                        className="form-control"
                                                        value={formData.PAN}
                                                        onChange={handleChange}
                                                        required
                                                        ref={PANRef}
                                                        onKeyDown={(e) => handleKeyDown(e, BirthdayRef)}
                                                        pattern="^[A-Z]{5}[0-9]{4}[A-Z]{1}$"
                                                        title="PAN number must be in the format: XXXXX1234X"


                                                    />
                                                </div>

                                                <div className="col-md-2">
                                                    <label htmlFor="serviceName" className="form-label mt-2 ">
                                                        जन्मतारीख
                                                    </label>
                                                    <input
                                                        type="date"
                                                        name="Birthday"
                                                        className="form-control"
                                                        ref={BirthdayRef}
                                                        onKeyDown={(e) => handleKeyDown(e, AnniversaryRef)}
                                                        value={formData.Birthday}
                                                        onChange={handleChange}
                                                    />
                                                </div>

                                                <div className="col-md-2">
                                                    <label htmlFor="serviceName" className="form-label mt-2 ">
                                                        विवाहाची तारीख
                                                    </label>
                                                    <input
                                                        type="date"
                                                        name="Anniversary"
                                                        className="form-control"
                                                        ref={AnniversaryRef}
                                                        onKeyDown={(e) => handleKeyDown(e, PincodeRef)}
                                                        value={formData.Anniversary}
                                                        onChange={handleChange}
                                                    />
                                                </div>

                                                <div className="col-md-2">
                                                    <label htmlFor="serviceName" className="form-label mt-2 required">
                                                        पिनकोड
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="Pincode"
                                                        className="form-control"
                                                        ref={PincodeRef}
                                                        onKeyDown={(e) => handleKeyDown(e, StateRef)}
                                                        value={formData.Pincode}
                                                        onChange={handleChange}
                                                        // ref={PincodeRef}
                                                        pattern="^[1-9][0-9]{5}$"
                                                        required
                                                        title="PIN code should be 6 digits long and should not start with 0."


                                                    />
                                                </div>

                                                <div className="col-md-3">
                                                    <label htmlFor="serviceName" className="form-label mt-2 required">
                                                        राज्य
                                                    </label>
                                                    <Select
                                                        classNamePrefix="react-select"
                                                        name="State"
                                                        required
                                                        options={statetype}
                                                        ref={StateRef}

                                                        // onChange={(selectedOption) => handleSelectChange(selectedOption, 'State')}
                                                        value={statetype.find((option) => option.value === formData.State) || null}
                                                        placeholder="Choose"

                                                        onChange={(selectedOption) => {

                                                            setFormData(prevState => ({
                                                                ...prevState,
                                                                State: selectedOption ? selectedOption.value : '',
                                                            }));

                                                            // Move focus to the next field (SCDQUANTITYRef)
                                                            if (CityRef.current) {
                                                                CityRef.current.focus();
                                                            }
                                                        }}


                                                    />
                                                </div>

                                                <div className="col-md-3">
                                                    <label htmlFor="serviceName" className="form-label mt-2 required">
                                                        शहर
                                                    </label>
                                                    <Select
                                                        classNamePrefix="react-select"
                                                        name="City"
                                                        options={sellingtype}
                                                        required
                                                        ref={CityRef}
                                                        // onChange={handleSelectChange}
                                                        // onChange={(selectedOption) => handleSelectChange(selectedOption, 'City')}
                                                        value={sellingtype.find((option) => option.value === formData.City) || null}
                                                        placeholder="Choose"


                                                        onChange={(selectedOption) => {

                                                            setFormData(prevState => ({
                                                                ...prevState,
                                                                City: selectedOption ? selectedOption.value : '',
                                                            }));

                                                            // Move focus to the next field (SCDQUANTITYRef)
                                                            if (AreaRef.current) {
                                                                AreaRef.current.focus();
                                                            }
                                                        }}
                                                    />
                                                </div>



                                                <div className="col-md-4">
                                                    <label htmlFor="serviceName" className="form-label mt-2 required">
                                                        ठिकाण
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="Area"
                                                        required
                                                        className="form-control"
                                                        value={formData.Area}
                                                        onChange={handleChange}
                                                        ref={AreaRef}
                                                        onKeyDown={(e) => handleKeyDown(e, AddressRef)}
                                                    />
                                                </div>

                                                <div className="col-md-12">
                                                    <label htmlFor="serviceName" className="form-label mt-2 required">
                                                        पत्ता
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="Address"
                                                        required
                                                        className="form-control"
                                                        value={formData.Address}
                                                        onChange={handleChange}
                                                        ref={AddressRef}
                                                        onKeyDown={(e) => handleKeyDown(e, CompanyRef)}
                                                    />
                                                </div>

                                                <div className="col-lg-6 col-sm-6 col-12">
                                                    <label className="form-label mt-2">योजनेचे नाव</label>
                                                    <Select
                                                        placeholder="Select SchemeName"
                                                        classNamePrefix="react-select"
                                                        options={schemename}
                                                        value={schemename.find(option => option.value === formData.VPSCHEME) || null}
                                                        onChange={(selectedOption) =>
                                                            setFormData(prevState => ({
                                                                ...prevState,
                                                                VPSCHEME: selectedOption ? selectedOption.value : ""
                                                            }))
                                                        }
                                                        ref={SchemeRef}

                                                    />
                                                </div>
                                            </div>

                                            <div className="" id="headingOne">
                                                <div
                                                    className=""
                                                    data-bs-toggle="collapse"
                                                    data-bs-target="#collapseOne"
                                                    aria-controls="collapseOne"
                                                >
                                                    <div className="addproduct-icon mb-3 mt-2" style={{ borderBottom: '1px solid rgba(145, 158, 171, 0.3)' }}>
                                                        <h5 >
                                                            <Info className="add-info me-3" style={{ color: '#FF9F43' }} />

                                                            <span>कंपनीची माहिती</span>
                                                        </h5>

                                                    </div>
                                                </div>
                                            </div>







                                            {/* <h5 className="mb-2 mt-2">कंपनीची माहिती :</h5> */}

                                            <div className="mb-1 row">
                                                <div className="col-md-4">
                                                    <div>
                                                        <input
                                                            type="checkbox"
                                                            name="SameAddress"
                                                            // value="true"
                                                            // value={formData.isSameAddress}
                                                            checked={formData.SameAddress}
                                                            onChange={handleCheckboxChange}
                                                        />
                                                        <label className="form-label mt-2 ms-2">
                                                            वरील पत्ता समान आहे का ?
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>


                                            <div className="row">

                                                <div className="col-md-7">
                                                    <label htmlFor="serviceName" className="form-label mt-2 required">
                                                        कंपनीचे नाव
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="Company"
                                                        className="form-control"
                                                        value={formData.Company}
                                                        onChange={handleChange}
                                                        required
                                                        ref={CompanyRef}
                                                        onKeyDown={(e) => handleKeyDown(e, GSTINRef)}
                                                    />
                                                </div>

                                                <div className="col-md-3">
                                                    <label htmlFor="serviceName" className="form-label mt-2 required">
                                                        जी एस टी आय एन
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="GSTIN"
                                                        className="form-control"
                                                        value={formData.GSTIN}
                                                        onChange={handleChange}
                                                        required
                                                        ref={GSTINRef}
                                                        onKeyDown={(e) => handleKeyDown(e, CPANRef)}
                                                        pattern="^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9]{1}[A-Z]{1}[0-9]{1}$"
                                                        title="GSTIN should be in the format: 27AAEPC1234B1ZP"

                                                    />
                                                </div>


                                                <div className="col-md-2">
                                                    <label htmlFor="serviceName" className="form-label mt-2 required">
                                                        पॅन नंबर
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="CPAN"
                                                        required
                                                        className="form-control"
                                                        value={formData.CPAN}
                                                        onChange={handleChange}
                                                        ref={CPANRef}
                                                        pattern="^[A-Z]{5}[0-9]{4}[A-Z]{1}$"
                                                        onKeyDown={(e) => handleKeyDown(e, CEmailRef)}
                                                    />
                                                </div>

                                                <div className="col-md-4">
                                                    <label htmlFor="serviceName" className="form-label mt-2 required">
                                                        ईमेल
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="CEmail"
                                                        className="form-control"
                                                        value={formData.CEmail}
                                                        required
                                                        onChange={handleInputChange}
                                                        ref={CEmailRef}
                                                        onKeyDown={(e) => handleKeyDown(e, CPincodeRef)}
                                                    />
                                                </div>

                                                <div className="col-md-2">
                                                    <label htmlFor="serviceName" className="form-label mt-2 required">
                                                        पिनकोड
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="CPincode"
                                                        className="form-control"
                                                        value={formData.CPincode}
                                                        onChange={handleChange}
                                                        ref={CPincodeRef}
                                                        onKeyDown={(e) => handleKeyDown(e, CStateRef)}
                                                        required
                                                        pattern="^[1-9][0-9]{5}$"
                                                        title="PIN code should be 6 digits long and should not start with 0."
                                                    />
                                                </div>

                                                <div className="col-md-3">
                                                    <label htmlFor="serviceName" className="form-label mt-2 required">
                                                        राज्य
                                                    </label>
                                                    <Select
                                                        classNamePrefix="react-select"
                                                        name="CState"
                                                        options={cstatetype}
                                                        required
                                                        ref={CStateRef}
                                                        // onChange={(selectedOption) => handleSelectChange(selectedOption, 'CState')}
                                                        value={cstatetype.find((option) => option.value === formData.CState) || null}
                                                        placeholder="Choose"

                                                        onChange={(selectedOption) => {

                                                            setFormData(prevState => ({
                                                                ...prevState,
                                                                CState: selectedOption ? selectedOption.value : '',
                                                            }));

                                                            // Move focus to the next field (SCDQUANTITYRef)
                                                            if (CCityRef.current) {
                                                                CCityRef.current.focus();
                                                            }
                                                        }}
                                                    />
                                                </div>
                                                <div className="col-md-3">
                                                    <label htmlFor="serviceName" className="form-label mt-2 required">
                                                        शहर
                                                    </label>
                                                    <Select
                                                        classNamePrefix="react-select"
                                                        name="CCity"
                                                        options={csellingtype}
                                                        required
                                                        ref={CCityRef}
                                                        // onChange={(selectedOption) => handleSelectChange(selectedOption, 'CCity')}
                                                        value={csellingtype.find((option) => option.value === formData.CCity) || null}
                                                        placeholder="Choose"

                                                        onChange={(selectedOption) => {

                                                            setFormData(prevState => ({
                                                                ...prevState,
                                                                CCity: selectedOption ? selectedOption.value : '',
                                                            }));

                                                            // Move focus to the next field (SCDQUANTITYRef)
                                                            if (CAreaRef.current) {
                                                                CAreaRef.current.focus();
                                                            }
                                                        }}
                                                    />
                                                </div>

                                                <div className="col-md-3">
                                                    <label htmlFor="serviceName" className="form-label mt-2 required">
                                                        ठिकाण
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="CArea"
                                                        required
                                                        className="form-control"
                                                        ref={CAreaRef}
                                                        onKeyDown={(e) => handleKeyDown(e, CAddressRef)}
                                                        value={formData.CArea}
                                                        onChange={handleChange}
                                                    />
                                                </div>


                                                <div className="col-md-9">
                                                    <label htmlFor="serviceName" className="form-label mt-2 required">
                                                        पत्ता
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="CAddress"
                                                        required
                                                        className="form-control"
                                                        ref={CAddressRef}
                                                        onKeyDown={(e) => handleKeyDown(e, BankNameRef)}
                                                        value={formData.CAddress}
                                                        onChange={handleChange}

                                                    />
                                                </div>





                                            </div>
                                            <div className="" id="headingOne">
                                                <div
                                                    className=""
                                                    data-bs-toggle="collapse"
                                                    data-bs-target="#collapseOne"
                                                    aria-controls="collapseOne"
                                                >
                                                    <div className="addproduct-icon mb-3 mt-2" style={{ borderBottom: '1px solid rgba(145, 158, 171, 0.3)' }}>
                                                        <h5 >
                                                            <Info className="add-info me-3" style={{ color: '#FF9F43' }} />

                                                            <span>बँकेची माहिती</span>
                                                        </h5>

                                                    </div>
                                                </div>
                                            </div>
                                            {/* <h5 className="mb-2 mt-3">बँकेची माहिती :</h5> */}

                                            <div className="row">

                                                <div className="col-md-8">
                                                    <label htmlFor="serviceName" className="form-label mt-2 required">
                                                        बँकेचे नाव
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="BankName"
                                                        className="form-control"
                                                        value={formData.BankName}
                                                        onChange={handleChange}
                                                        ref={BankNameRef}
                                                        onKeyDown={(e) => handleKeyDown(e, BranchNameRef)}
                                                        required
                                                    />
                                                </div>
                                                <div className="col-md-4">
                                                    <label htmlFor="serviceName" className="form-label mt-2 required">
                                                        शाखेचे नाव
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="BranchName"
                                                        className="form-control"
                                                        value={formData.BranchName}
                                                        onChange={handleChange}
                                                        ref={BranchNameRef}
                                                        onKeyDown={(e) => handleKeyDown(e, AccountNameRef)}
                                                        required
                                                    />
                                                </div>

                                                <div className="col-md-5">
                                                    <label htmlFor="serviceName" className="form-label mt-2 required">
                                                        खातेचे नाव
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="AccountName"
                                                        className="form-control"
                                                        value={formData.AccountName}
                                                        onChange={handleChange}
                                                        ref={AccountNameRef}
                                                        onKeyDown={(e) => handleKeyDown(e, IFSCRef)}
                                                        required
                                                    />
                                                </div>

                                                <div className="col-md-3">
                                                    <label htmlFor="serviceName" className="form-label mt-2 required">
                                                        आय एफ एस सी कोड
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="IFSC"
                                                        className="form-control"
                                                        value={formData.IFSC}
                                                        onChange={handleChange}
                                                        ref={IFSCRef}
                                                        onKeyDown={(e) => handleKeyDown(e, AccountNumberRef)}
                                                        pattern="^[A-Z]{4}0[A-Z0-9]{6}$"
                                                        title="IFSC Code should be in the format: SBIN0001234"
                                                        required

                                                    />
                                                </div>

                                                <div className="col-md-3">
                                                    <label htmlFor="serviceName" className="form-label mt-2 required">
                                                        खाते क्रमांक
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="AccountNumber"
                                                        className="form-control"
                                                        value={formData.AccountNumber}
                                                        onChange={handleChange}
                                                        ref={AccountNumberRef}
                                                        onKeyDown={(e) => handleKeyDown(e, StatusRef)}
                                                        pattern="(^\d{9,18}$)|(^[०-९]{9,18}$)"
                                                        title="Account number must be between 9 and 18 digits."
                                                        required

                                                    />
                                                </div>



                                                <div className="" id="headingOne">
                                                    <div
                                                        className=""
                                                        data-bs-toggle="collapse"
                                                        data-bs-target="#collapseOne"
                                                        aria-controls="collapseOne"
                                                    >
                                                        <div className="addproduct-icon mb-3 mt-2" style={{ borderBottom: '1px solid rgba(145, 158, 171, 0.3)' }}>
                                                            <h5 >
                                                                <Info className="add-info me-3" style={{ color: '#FF9F43' }} />

                                                                <span>दस्तऐवज अपलोड करा</span>
                                                            </h5>

                                                        </div>
                                                    </div>
                                                </div>


                                                <div className="col-md-4 mb-3">
                                                    <div className="mb-0 form-label position-relative">
                                                        <label className="form-label">
                                                            आधार कार्ड अपलोड करा :
                                                            {formData.VPAADHAR && (
                                                                <span style={{ color: 'green', fontSize: '14px', fontWeight: 'bold', marginLeft: '5px' }}>
                                                                    ✔
                                                                </span>
                                                            )}
                                                            {formData.VPAADHAR && (
                                                                <span
                                                                    className="ms-2"
                                                                    style={{ color: 'green', fontWeight: 'bold', cursor: 'pointer' }}
                                                                    onClick={openFilePreview}

                                                                >
                                                                    {formData.VPAADHAR.split('\\').pop().split('_').pop()}
                                                                </span>
                                                            )}
                                                        </label>
                                                        <input
                                                            className="form-control pe-5"
                                                            type="file"
                                                            accept="image/*,application/pdf.pdf"
                                                            multiple
                                                            name="VPAADHAR"
                                                            onChange={handleAddharChange}
                                                        />
                                                        <i
                                                            className="fas fa-eye position-absolute"
                                                            style={{
                                                                right: '10px',
                                                                top: '70%',
                                                                transform: 'translateY(-50%)',
                                                                cursor: 'pointer',
                                                            }}
                                                            onClick={openAFilePreview}
                                                        ></i>
                                                    </div>

                                                    {/* Modal for previewing file (image or PDF) */}
                                                    {AModalOpen && AfileUrl && (
                                                        <div
                                                            className="modal fade show"
                                                            tabIndex="-1"
                                                            style={{
                                                                display: 'block',
                                                                backdropFilter: 'blur(5px)',
                                                                backgroundColor: 'rgba(0,0,0,0.5)',
                                                            }}
                                                        >
                                                            <div className="modal-dialog modal-dialog-centered modal-lg">
                                                                <div className="modal-content shadow-lg rounded-3">
                                                                    <div className="modal-header bg-primary text-white border-0">
                                                                        <h5 className="modal-title">File Preview</h5>
                                                                        <button
                                                                            type="button"
                                                                            className="btn-close text-white"
                                                                            onClick={closeAFilePreview}
                                                                        ></button>
                                                                    </div>
                                                                    <div className="modal-body p-4">
                                                                        {AfileType === "image" && (
                                                                            <div>
                                                                                <h5>Image Preview:</h5>
                                                                                <img
                                                                                    src={AfileUrl}
                                                                                    alt="Preview"
                                                                                    className="img-fluid rounded-3 shadow-sm"
                                                                                />
                                                                            </div>
                                                                        )}


                                                                        {AfileType === "pdf" && (
                                                                            <div>
                                                                                <h5>PDF Preview:</h5>
                                                                                <iframe
                                                                                    src={AfileUrl}
                                                                                    title="PDF Preview"
                                                                                    width="100%"
                                                                                    height="500px"
                                                                                    style={{ border: "none" }}
                                                                                    allow="autoplay"
                                                                                ></iframe>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <div className="modal-footer border-0 bg-light">
                                                                        <button
                                                                            type="button"
                                                                            className="btn btn-secondary"
                                                                            onClick={closeAFilePreview}
                                                                        >
                                                                            मागे
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>



                                                <div className="col-md-4 mb-3">
                                                    <div className="mb-0 form-label position-relative">
                                                        <label className="form-label">
                                                            पॅन कार्ड अपलोड करा :
                                                            {formData.VPPAN && (
                                                                <span style={{ color: 'green', fontSize: '14px', fontWeight: 'bold', marginLeft: '5px' }}>
                                                                    ✔
                                                                </span>
                                                            )}
                                                            {formData.VPPAN && (
                                                                <span
                                                                    className="ms-2"
                                                                    style={{ color: 'green', fontWeight: 'bold', cursor: 'pointer' }}
                                                                    onClick={openFilePreview} // Trigger modal on filename click
                                                                >
                                                                    {formData.VPPAN.split('\\').pop().split('_').pop()}
                                                                </span>
                                                            )}
                                                        </label>
                                                        <input
                                                            className="form-control pe-5"
                                                            type="file"
                                                            accept="image/*,application/pdf"
                                                            multiple
                                                            name="VPPAN"
                                                            onChange={handlePanChange}
                                                        />
                                                        <i
                                                            className="fas fa-eye position-absolute"
                                                            style={{
                                                                right: '10px',
                                                                top: '70%',
                                                                transform: 'translateY(-50%)',
                                                                cursor: 'pointer',
                                                            }}
                                                            onClick={openFilePreview}
                                                        ></i>
                                                    </div>

                                                    {/* Modal for previewing file (image or PDF) */}
                                                    {ModalOpen && fileUrl && (
                                                        <div
                                                            className="modal fade show"
                                                            tabIndex="-1"
                                                            style={{
                                                                display: 'block',
                                                                backdropFilter: 'blur(5px)',
                                                                backgroundColor: 'rgba(0,0,0,0.5)',
                                                            }}
                                                        >
                                                            <div className="modal-dialog modal-dialog-centered modal-lg">
                                                                <div className="modal-content shadow-lg rounded-3">
                                                                    <div className="modal-header bg-primary text-white border-0">
                                                                        <h5 className="modal-title">File Preview</h5>
                                                                        <button
                                                                            type="button"
                                                                            className="btn-close text-white"
                                                                            onClick={closeFilePreview}
                                                                        ></button>
                                                                    </div>
                                                                    <div className="modal-body p-4">
                                                                        {fileType === "image" && (
                                                                            <div>
                                                                                <h5>Image Preview:</h5>
                                                                                <img
                                                                                    src={fileUrl}
                                                                                    alt="Preview"
                                                                                    className="img-fluid rounded-3 shadow-sm"
                                                                                />
                                                                            </div>
                                                                        )}

                                                                        {fileType === "pdf" && (
                                                                            <div>
                                                                                <h5>PDF Preview:</h5>
                                                                                {/* <iframe
                                                                                    src={fileUrl}
                                                                                    title="PDF Preview"
                                                                                    width="100%"
                                                                                    height="500px"
                                                                                ></iframe> */}

                                                                                {fileType === 'pdf' && (
                                                                                    <iframe
                                                                                        src={fileUrl}
                                                                                        title="PAN PDF"
                                                                                        width="100%"
                                                                                        height="600px"
                                                                                        style={{ border: 'none' }}
                                                                                    />
                                                                                )}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <div className="modal-footer border-0 bg-light">
                                                                        <button
                                                                            type="button"
                                                                            className="btn btn-secondary"
                                                                            onClick={closeFilePreview}
                                                                        >
                                                                            Close
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>




                                                <div className="col-md-8"></div>

                                                <div className="col-md-4 mb-3">
                                                    <label htmlFor="serviceName" className="form-label mt-2 required">
                                                        स्थिती
                                                    </label>
                                                    <Select
                                                        name="Status"
                                                        classNamePrefix="react-select"
                                                        options={StatusType}
                                                        placeholder="Select"
                                                        required
                                                        openMenuOnFocus={true}
                                                        ref={StatusRef}
                                                        title="Please select a valid type of service."
                                                        // onChange={handleSelectChange} 
                                                        onKeyDown={(e) => handleKeyDown(e, SubmitRef)}
                                                        onChange={(selectedOption) => handleSelectChange(selectedOption, 'Status')}
                                                        // value={selectedOption}
                                                        value={StatusType.find((option) => option.value === formData.Status)}

                                                    />

                                                </div>



                                            </div>


                                            <div className="col-lg-12">
                                                <div className="btn-addproduct mb-4">

                                                    <Link to={route.Vyapari} className="btn btn-cancel me-2"
                                                    // onClick={handleExit}
                                                    >
                                                        रद्द करा
                                                    </Link>

                                                    {/* <button type="button"  className="btn btn-submit"
                                            data-bs-toggle="modal"
                                            data-bs-target="#add-verification"

                                            onClick={() => openModal(formData.Name, formData.Mobile)}
                                            disabled={!isFormValid()} 
                                            >  पुष्टीकरण</button> */}

                                                    {!isFormValid() && (
                                                        <button
                                                            type="submit"
                                                            className="btn btn-submit"
                                                            ref={SubmitRef}
                                                        >
                                                            पुष्टीकरण
                                                        </button>
                                                    )}


                                                    {isFormValid() && (
                                                        <button
                                                            ref={SubmitRef}
                                                            type="button"
                                                            className="btn btn-submit"
                                                            data-bs-toggle="modal"
                                                            data-bs-target="#add-verification"
                                                            onClick={() => openModal(formData.Name, formData.Mobile, GUID)}

                                                        >
                                                            पुष्टीकरण
                                                        </button>
                                                    )}
                                                </div>
                                            </div>

                                        </div>


                                    )}
                                    {formData.Type === '1' && (
                                        //   {/* {selectedType === 'RokdaVyapari' && ( */}
                                        <div className="mb-3 row">
                                            <div className="col-md-8">
                                                <label htmlFor="serviceName" className="form-label mt-2 required">
                                                    व्यापऱ्याचे नाव
                                                </label>
                                                <input
                                                    type="text"
                                                    name="Name"
                                                    className="form-control"
                                                    value={formData.Name}
                                                    onChange={handleChange}
                                                    ref={nameInputRef}
                                                    required
                                                    onKeyDown={(e) => handleKeyDown(e, MobileRef)}
                                                    pattern="^[A-Za-zअ-हअ-ॣं-ः\s]*$"
                                                    title="Title should only contain alphabetic characters and spaces."

                                                />
                                            </div>

                                            <div className="col-md-4">
                                                <label className="form-label mt-2 required"> उप नाव</label>
                                                <input
                                                    type="text"
                                                    name="Shortname"
                                                    className="form-control"
                                                    value={formData.Shortname}
                                                    onChange={handleChange}
                                                    ref={ShortnameRef}
                                                    onKeyDown={(e) => handleKeyDown(e, MobileRef)}
                                                    required

                                                />
                                            </div>

                                            <div className="col-md-2">
                                                <label htmlFor="serviceName" className="form-label mt-2 required">
                                                    मोबाईल नंबर
                                                </label>
                                                <input
                                                    type="text"
                                                    name="Mobile"
                                                    className="form-control"
                                                    value={formData.Mobile}
                                                    onChange={handleChange}
                                                    onKeyDown={(e) => handleKeyDown(e, AadharRef)}
                                                    ref={MobileRef}
                                                    required
                                                    pattern="(^[7-9][0-9]{9}$)|(^[७-९][०-९]{9}$)"
                                                    title="Mobile number should start with a digit between 7-9 and contain exactly 10 digits."


                                                />
                                            </div>

                                            <div className="col-md-2">
                                                <label htmlFor="serviceName" className="form-label mt-2 required">
                                                    आधार नंबर
                                                </label>
                                                <input
                                                    type="text"
                                                    name="Aadhar"
                                                    className="form-control"
                                                    value={formData.Aadhar}
                                                    onChange={handleChange}
                                                    required
                                                    onBlur={handleBlur}
                                                    onKeyDown={(e) => handleKeyDown(e, PincodeRef)}
                                                    ref={AadharRef}
                                                    pattern="(^\d{12}$)|(^[०-९]{12}$)"
                                                    title="Aadhar number should be exactly 12 digits."


                                                />
                                            </div>




                                            <div className="col-md-2">
                                                <label htmlFor="serviceName" className="form-label mt-2 required">
                                                    पिनकोड
                                                </label>
                                                <input
                                                    type="text"
                                                    name="Pincode"
                                                    className="form-control"
                                                    value={formData.Pincode}
                                                    onChange={handleChange}
                                                    // ref={PincodeRef}
                                                    ref={PincodeRef}
                                                    onKeyDown={(e) => handleKeyDown(e, StateRef)}
                                                    pattern="^[1-9][0-9]{5}$"
                                                    required
                                                    title="PIN code should be 6 digits long and should not start with 0."


                                                />
                                            </div>

                                            <div className="col-md-3">
                                                <label htmlFor="serviceName" className="form-label mt-2 required">
                                                    राज्य
                                                </label>
                                                <Select
                                                    classNamePrefix="react-select"
                                                    name="State"
                                                    ref={StateRef}
                                                    options={statetype}
                                                    required
                                                    // onChange={handleSelectChange}
                                                    // onChange={(selectedOption) => handleSelectChange(selectedOption, 'State')}
                                                    value={statetype.find((option) => option.value === formData.State) || null}
                                                    placeholder="Choose"

                                                    onChange={(selectedOption) => {

                                                        setFormData(prevState => ({
                                                            ...prevState,
                                                            State: selectedOption ? selectedOption.value : '',
                                                        }));

                                                        // Move focus to the next field (SCDQUANTITYRef)
                                                        if (CityRef.current) {
                                                            CityRef.current.focus();
                                                        }
                                                    }}
                                                />
                                            </div>

                                            <div className="col-md-3">
                                                <label htmlFor="serviceName" className="form-label mt-2 required">
                                                    शहर
                                                </label>
                                                <Select
                                                    classNamePrefix="react-select"
                                                    name="City"
                                                    options={sellingtype}
                                                    ref={CityRef}
                                                    required
                                                    // onChange={handleSelectChange}
                                                    // onChange={(selectedOption) => handleSelectChange(selectedOption, 'City')}
                                                    value={sellingtype.find((option) => option.value === formData.City) || null}
                                                    placeholder="Choose"

                                                    onChange={(selectedOption) => {

                                                        setFormData(prevState => ({
                                                            ...prevState,
                                                            City: selectedOption ? selectedOption.value : '',
                                                        }));

                                                        // Move focus to the next field (SCDQUANTITYRef)
                                                        if (AreaRef.current) {
                                                            AreaRef.current.focus();
                                                        }
                                                    }}
                                                />
                                            </div>



                                            <div className="col-md-4">
                                                <label htmlFor="serviceName" className="form-label mt-2 required">
                                                    ठिकाण
                                                </label>
                                                <input
                                                    type="text"
                                                    name="Area"
                                                    required
                                                    className="form-control"
                                                    ref={AreaRef}
                                                    onKeyDown={(e) => handleKeyDown(e, AddressRef)}
                                                    value={formData.Area}
                                                    onChange={handleChange}
                                                />
                                            </div>

                                            <div className="col-md-8">
                                                <label htmlFor="serviceName" className="form-label mt-2 required">
                                                    पत्ता
                                                </label>
                                                <input
                                                    type="text"
                                                    name="Address"
                                                    required
                                                    className="form-control"
                                                    value={formData.Address}
                                                    onChange={handleChange}
                                                    ref={AddressRef}

                                                />
                                            </div>


                                            <div className="col-lg-6 col-sm-6 col-12">
                                                <label className="form-label mt-2">योजनेचे नाव</label>
                                                <Select
                                                    placeholder="Select SchemeName"
                                                    classNamePrefix="react-select"
                                                    options={rokdaschemename}
                                                    value={rokdaschemename.find(option => option.value === formData.VPSCHEME) || null}
                                                    onChange={(selectedOption) =>
                                                        setFormData(prevState => ({
                                                            ...prevState,
                                                            VPSCHEME: selectedOption ? selectedOption.value : ""
                                                        }))
                                                    }
                                                    ref={SchemeRef}

                                                />
                                            </div>


                                            <div className="col-lg-12 mt-3">
                                                <div className="btn-addproduct mb-4">


                                                    <Link to={route.Vyapari} className="btn btn-cancel me-2"
                                                    // onClick={handleExit}
                                                    >
                                                        रद्द करा
                                                    </Link>

                                                    <button type="submit"

                                                        className="btn btn-submit"

                                                    >  जतन करा</button>
                                                </div>
                                            </div>
                                        </div>
                                    )}


                                </form>

                            </div>
                        </div>
                    </div>
                </div>
                <VyapariVerification NAME={selectedData.Name} MOBILE={selectedData.Mobile} ID={GUID} />
            </div>


        </>
    );
};
export default AddVyapari;


