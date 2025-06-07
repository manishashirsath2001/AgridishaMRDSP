import React, { useState, useEffect, useRef } from 'react';
import { Link } from "react-router-dom";
import { ChevronUp, ArrowLeft } from "feather-icons-react/build/IconComponents";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { all_routes } from "../../Router/all_routes";
import {
    ChevronDown,
    Trash2,
    Edit,
    Info,
    LifeBuoy,
    List,
} from 'feather-icons-react/build/IconComponents';
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import axios from 'axios';
// import { ACSPLGUID, baseUrl } from "../../core/json/custom";
import { ACSPLGUID, baseUrl } from "../../core/json/custom";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import Select from "react-select";
import { convertToISODate, formatDate } from "../../core/json/custom";
import { getUserData } from '../../Context/UserData';
const AddFarmers = () => {
    const route = all_routes;
    const { userdetail } = getUserData();

    const location = useLocation();
    const navigate = useNavigate();
    const { FAID, ID } = location.state || {};
    const GUID = ACSPLGUID.getNew()

    const renderCollapseTooltip = (props) => (
        <Tooltip id="refresh-tooltip" {...props}>
            Collapse
        </Tooltip>
    );


    const [status, setstatus] = useState([]);
    const [relation, setrelation] = useState([]);
    // const [selectedRelation, setSelectedRelation] = useState([]);


    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        FAID: '',
        FNAME: '',
        FCONTACTNO: '',
        FBIRTHDATE: '',
        FPANNO: '',
        FADDHARNO: '',
        FBANKNAME: '',
        FACCONAME: '',
        FBRANCHNAME: '',
        FACCOUNTNO: '',
        FIFSCCODE: '',
        FPINCODE: '',
        FSTATE: '',
        FCITY: '',
        FAddress: '',
        FCROPAREA: '',
        FCROPTYPE: '',
        FSTATUS: '',
    });

    const [rows, setRows] = useState([]);
    const [detailData, setDetailData] = useState({
        fdaid: '',
        FAID: '',
        // maid: FAID,
        FDNAME: '',
        FDBIRTHDATE: '',
        FDAADHARNO: '',
        FDRELATION: '',
        FDCONTACT: '',
        isdeleted: 0,

    });

    // const [tableData, setTableData] = useState([]);
    // const [croptype, setCroptype] = useState([]);


    const FNAMERef = useRef(null);
    const FCONTACTNORef = useRef(null);
    const FBIRTHDATERef = useRef(null);
    const FPANNORef = useRef(null);
    const FADDHARNORef = useRef(null);
    const FBANKNAMERef = useRef(null);
    const FACCONAMERef = useRef(null);
    const FBRANCHNAMERef = useRef(null);
    const FACCOUNTNORef = useRef(null);
    const FIFSCCODERef = useRef(null);
    const FPINCODERef = useRef(null);
    const FSTATERef = useRef(null);
    const FCITYRef = useRef(null);
    const FAddressRef = useRef(null);
    const FCROPAREARef = useRef(null);
    const FDAADHARNORef = useRef(null);
    const FDCONTACTRef = useRef(null);
    const FDRELATIONRef = useRef(null);
    const FDBIRTHDATERef = useRef(null);
    // const FCROPTYPERef = useRef(null);
    // const FDNAMERef = useRef(null);
    const STATUSRef = useRef(null);
    const submitRef = useRef();


    const validateinput = (e) => {
        const { FNAME, FCONTACTNO, FBIRTHDATE, FBANKNAME, FBRANCHNAME, FACCOUNTNO, FIFSCCODE } = formData;

        // Common pattern for names (Marathi + English letters, digits, spaces) — 3 to 50 chars, no leading/trailing spaces
        const nameRegex = /^(?!\s)([A-Za-z0-9\u0900-\u097F\s]{3,50})(?<!\s)$/;

        // Validate Full Name
        if (!FNAME || !nameRegex.test(FNAME)) {
            Swal.fire({
                icon: "error",
                title: "वैधता त्रुटी",
                text: "पूर्ण नाव वैध असावे. 3 ते 50 अक्षरे. सुरुवातीला व शेवटी रिकामी जागा नसावी (मराठी/इंग्रजी अक्षरे व जागा).",
                allowOutsideClick: false,
                allowEscapeKey: false,
            }).then(() => {
                FNAMERef.current.focus();
            });
            return;
        }

        // Validate Contact Number (exactly 10 digits — English or Marathi)
        if (!FCONTACTNO || !/^([0-9\u0966-\u096F]{10})$/.test(FCONTACTNO)) {
            Swal.fire({
                icon: "error",
                title: "वैधता त्रुटी",
                text: "मोबाईल नंबर 10 अंकी असावा (०-९ किंवा 0-9).",
                allowOutsideClick: false,
                allowEscapeKey: false,
            }).then(() => {
                FCONTACTNORef.current.focus();
            });
            return;
        }

        // Validate Birthdate (just check if selected)
        if (!FBIRTHDATE) {
            Swal.fire({
                icon: "error",
                title: "वैधता त्रुटी",
                text: "जन्मतारीख निवडली जावी.",
                allowOutsideClick: false,
                allowEscapeKey: false,
            }).then(() => {
                FBIRTHDATERef.current.focus();
            });
            return;
        }

        // Validate Bank Name
        if (!FBANKNAME || !nameRegex.test(FBANKNAME)) {
            Swal.fire({
                icon: "error",
                title: "वैधता त्रुटी",
                text: "बँक नाव वैध असावे. 3 ते 50 अक्षरे, सुरुवातीला किंवा शेवटी स्पेस नसावी. मराठी व इंग्रजी अक्षरे व अंक चालतील.",
                allowOutsideClick: false,
                allowEscapeKey: false,
            }).then(() => {
                FBANKNAMERef.current.focus();
            });
            return;
        }

        // Validate Branch Name
        if (!FBRANCHNAME || !nameRegex.test(FBRANCHNAME)) {
            Swal.fire({
                icon: "error",
                title: "वैधता त्रुटी",
                text: "शाखेचे नाव वैध असावे. 3 ते 50 अक्षरे. सुरुवातीला किंवा शेवटी रिकामी जागा नसावी. मराठी व इंग्रजी अक्षरे चालतील.",
                allowOutsideClick: false,
                allowEscapeKey: false,
            }).then(() => {
                FBRANCHNAMERef.current.focus();
            });
            return;
        }

        // Validate Account Number (10–20 digits, English or Marathi)
        if (!FACCOUNTNO || !/^([0-9\u0966-\u096F]{10,20})$/.test(FACCOUNTNO)) {
            Swal.fire({
                icon: "error",
                title: "वैधता त्रुटी",
                text: "खाते क्रमांक वैध असावा, ज्यामध्ये 10 ते 20 अंक (०-९ किंवा 0-9) असावेत.",
                allowOutsideClick: false,
                allowEscapeKey: false,
            }).then(() => {
                FACCOUNTNORef.current.focus();
            });
            return;
        }

        // Validate IFSC Code (exact format: ABCD0123456)
        if (!FIFSCCODE || !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(FIFSCCODE)) {
            Swal.fire({
                icon: "error",
                title: "वैधता त्रुटी",
                text: "IFSC कोड खालील स्वरूपात असावा: ABCD0123456 (फक्त इंग्रजी अक्षरे आणि अंक).",
                allowOutsideClick: false,
                allowEscapeKey: false,
            }).then(() => {
                FIFSCCODERef.current.focus();
            });
            return;
        }

        // ✅ All validations passed
        handleSubmit(e);
    };



    useEffect(() => {
        const handleShortcut = (e) => {

            if (e.ctrlKey && e.key === 'e' || e.ctrlKey && e.key === 'E') {
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



    const handleSelectChange = (selectedOption, fieldName) => {
        setFormData({
            ...formData,
            [fieldName]: selectedOption ? selectedOption.value : '',
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('Form Data:', formData);
        showConfirmationAlert(event);
    };



    const fetchStatus = async () => {
        try {
            const response = await axios.get(
                baseUrl.Url + "/backend/api/Implications/STATUS",

            );

            if (response.status !== 200) throw new Error("Failed to fetch implications data");

            const data = response.data;
            const implicationDropdown = data.map(({ iTitle, iValue }) => ({
                label: iTitle,
                value: iValue,
            }));

            setstatus(implicationDropdown);
        } catch (error) {
            console.error("Error fetching implications:", error);
        }
    };


    const fetchRelations = async () => {
        try {
            const response = await axios.get(
                baseUrl.Url + "/backend/api/Implications/RETYPE",

            );

            if (response.status !== 200) throw new Error("Failed to fetch implications data");

            const data = response.data;
            const implicationDropdown = data.map(({ iTitle, iValue }) => ({
                label: iTitle,
                value: iValue,
            }));

            setrelation(implicationDropdown);
        } catch (error) {
            console.error("Error fetching implications:", error);
        }
    };





    useEffect(() => {
        fetchStatus();
        fetchRelations();
        // fetchCroptype();
    }, []);





    // const handleFormSubmission = async () => {
    //     try {
    //         // Check if FAID is not empty
    //         if (FAID != '') {
    //             const payload1 = {
    //                 "faid": FAID ? FAID : GUID,
    //                 "uid": "",
    //                 "fcmtoken": "",
    //                 "refid": "",
    //                 "fname": formData.FNAME,
    //                 "fcontactno": formData.FCONTACTNO,
    //                 "fbirthdate": formData.FBIRTHDATE,
    //                 "fpanno": formData.FPANNO,
    //                 "faddharno": formData.FADDHARNO,
    //                 "fbankname": formData.FBANKNAME,
    //                 "facconame": formData.FACCONAME,
    //                 "fbranchname": formData.FBRANCHNAME,
    //                 "faccountno": formData.FACCOUNTNO,
    //                 "fifsccode": formData.FIFSCCODE,
    //                 "fpincode": formData.FPINCODE,
    //                 "fstate": formData.FSTATE,
    //                 "fcity": formData.FCITY,
    //                 "faddress": formData.FAddress,
    //                 "fcroparea": "",
    //                 "fcroptype": "",
    //                 "fstatus": formData.FSTATUS,
    //                 "fprofile": "",
    //                 "companyid": "",
    //                 "deptid": "",
    //                 "uaid": userdetail?.uaid ? userdetail.uaid : "",
    //             };

    //             const headers = {
    //                 "Content-Type": "application/json",
    //                 Accept: "*/*",
    //             };

    //             // First API Call
    //             const response1 = await axios.post(baseUrl.Url + "/backend/api/SP_AddUpdFarmer", payload1, { headers });

    //             if (response1.status === 200) {


    //                 // Second API Call
    //                 const payload2 = rows.map((data) => ({
    //                     "fdaid": data.fdaid ? data.fdaid : ACSPLGUID.getNew(),
    //                     "maid": FAID ? FAID : GUID,
    //                     "fdname": data.FDNAME,
    //                     "fdbirthdate": data.FDBIRTHDATE,
    //                     "fdaadharno": data.FDAADHARNO,
    //                     "fdrelation": data.FDRELATION,
    //                     "fdcontact": data.FDCONTACT,
    //                     "companyid": "",
    //                     "deptid": "",
    //                     "isdeleted": data.isdeleted === 1 || data.isdeleted === true ? true : false,
    //                 }));

    //                 const response2 = await axios.post(baseUrl.Url + "/backend/api/SP_AddFamilyDetails", payload2, { headers });

    //                 if (response2.status === 200) {
    //                     // Third API Payload
    //                     const payload3 = rows.map((data) => ({
    //                         "fdaid": ACSPLGUID.getNew(),
    //                         "faid": FAID ? FAID : GUID,
    //                         "fdname": data.FDNAME,
    //                         "fdbirthdate": data.FDBIRTHDATE,
    //                         "fdaadharno": data.FDAADHARNO,
    //                         "companyid": "",
    //                         "deptid": "",
    //                     }));

    //                     const response3 = await axios.post(baseUrl.Url + "/backend/api/SP_AddUpdFarmerFamily", payload3, { headers });

    //                     if (response3.status === 200) {
    //                         // Additional API for Aadhaar check
    //                         const payload4 = {
    //                             aadhaar: formData.FADDHARNO,
    //                         };

    //                         const response4 = await axios.post(baseUrl.Url + "/backend/api/SP_CheckAadhaar", payload4, { headers });

    //                         if (response4.status === 200) {
    //                             console.log(response4.data);

    //                             if (response4.data[0].isSuccessful == 1) {
    //                                 Swal.fire({
    //                                     icon: "success",
    //                                     title: "success message",
    //                                     text: response4.data[0].responseMessage,
    //                                     confirmButtonText: "OK",
    //                                 }).then((result) => {
    //                                     if (result.isConfirmed) {
    //                                         console.log("Data save success");
    //                                     }
    //                                 });
    //                             } else {
    //                                 Swal.fire({
    //                                     icon: "success",
    //                                     title: "Saved!",
    //                                     text: "Data saved successfully.",
    //                                     confirmButtonText: "OK",
    //                                 }).then((result) => {
    //                                     if (result.isConfirmed) {
    //                                         setFormData({
    //                                             FNAME: '',
    //                                             FCONTACTNO: '',
    //                                             FBIRTHDATE: '',
    //                                             FPANNO: '',
    //                                             FADDHARNO: '',
    //                                             FBANKNAME: '',
    //                                             FACCONAME: '',
    //                                             FBRANCHNAME: '',
    //                                             FACCOUNTNO: '',
    //                                             FIFSCCODE: '',
    //                                             FPINCODE: '',
    //                                             FSTATE: '',
    //                                             FCITY: '',
    //                                             FAddress: '',
    //                                             FCROPAREA: '',
    //                                             FCROPTYPE: '',
    //                                             FSTATUS: ''
    //                                         });
    //                                         setRows([]);
    //                                         if (ID == '101') {
    //                                             navigate(route.QuickFarmer)
    //                                         } else {
    //                                             navigate(route.Farmers)
    //                                         }
    //                                     }
    //                                 });
    //                             }
    //                         }
    //                     } else {
    //                         throw new Error("Failed to save family details.");
    //                     }
    //                 } else {
    //                     throw new Error("Failed to save additional details.");
    //                 }
    //             } else {
    //                 throw new Error("Failed to save master data.");
    //             }
    //         }
    //     } catch (error) {
    //         console.error("Submission Error:", error);
    //         Swal.fire({
    //             icon: "error",
    //             title: "Error",
    //             text: "Failed to save data. Please try again.",
    //         });
    //     }
    // };

    const handleFormSubmission = async () => {
        try {
            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            // Step 1: Check if farmer already exists
            const aadhaarCheckPayload = {
                aadhaar: formData.FADDHARNO,
            };

            const aadhaarCheckResponse = await axios.post(
                baseUrl.Url + "/backend/api/SP_CheckAadhaar",
                aadhaarCheckPayload,
                { headers }
            );

            let isFarmerExists = false;

            if (
                aadhaarCheckResponse.status === 200 &&
                aadhaarCheckResponse.data.length > 0 &&
                aadhaarCheckResponse.data[0].isSuccessful === 1
            ) {
                console.log("👤 Farmer already exists.");
                isFarmerExists = true;
            }

            // Step 2: Save master farmer only if not already exists
            if (!isFarmerExists) {
                const payload1 = {
                    faid: FAID ? FAID : GUID,
                    uid: "",
                    fcmtoken: "",
                    refid: "",
                    fname: formData.FNAME,
                    fcontactno: formData.FCONTACTNO,
                    fbirthdate: formData.FBIRTHDATE,
                    fpanno: formData.FPANNO,
                    faddharno: formData.FADDHARNO,
                    fbankname: formData.FBANKNAME,
                    facconame: formData.FACCONAME,
                    fbranchname: formData.FBRANCHNAME,
                    faccountno: formData.FACCOUNTNO,
                    fifsccode: formData.FIFSCCODE,
                    fpincode: formData.FPINCODE,
                    fstate: formData.FSTATE,
                    fcity: formData.FCITY,
                    faddress: formData.FAddress,
                    fcroparea: "",
                    fcroptype: "",
                    fstatus: formData.FSTATUS,
                    fprofile: "",
                    companyid: "",
                    deptid: "",
                    uaid: userdetail?.uaid ? userdetail.uaid : "",
                    date: formatDate(userdetail.APPDT)
                };

                const response1 = await axios.post(
                    baseUrl.Url + "/backend/api/SP_AddUpdFarmer",
                    payload1,
                    { headers }
                );

                if (response1.status !== 200) {
                    throw new Error("❌ Failed to save farmer data.");
                }
            }

            // Step 3: Check duplicate Aadhaar in family rows
            // for (const member of rows) {
            //     if (member.FDAADHARNO) {
            //         // Check in family table
            //         const familyCheckPayload = { aadhaar: member.FDAADHARNO };
            //         const familyCheckResponse = await axios.post(
            //             baseUrl.Url + "/backend/api/SP_CheckAadhaardetail",
            //             familyCheckPayload,
            //             { headers }
            //         );

            //         if (
            //             familyCheckResponse.status === 200 &&
            //             familyCheckResponse.data[0].isSuccessful == 1
            //         ) {
            //             Swal.fire({
            //                 icon: "warning",
            //                 title: "Duplicate Aadhaar Found",
            //                 text: `Aadhaar number ${member.FDAADHARNO} is already registered in family details.`,
            //             });
            //             return;
            //         }
            //     }
            // }



            // Step 4: Save family details
            const payload2 = rows.map((data) => ({
                fdaid: data.fdaid ? data.fdaid : ACSPLGUID.getNew(),
                maid: FAID ? FAID : GUID,
                fdname: data.FDNAME,
                fdbirthdate: data.FDBIRTHDATE,
                fdaadharno: data.FDAADHARNO,
                fdrelation: data.FDRELATION,
                fdcontact: data.FDCONTACT,
                companyid: userdetail?.companyID || "",
                deptid: userdetail?.departmentID || "",
                isdeleted: data.isdeleted === 1 || data.isdeleted === true,
            }));

            const response2 = await axios.post(
                baseUrl.Url + "/backend/api/SP_AddFamilyDetails",
                payload2,
                { headers }
            );

            if (response2.status !== 200) {
                throw new Error("❌ Failed to save family details.");
            }

            // Step 5: Save extended family info
            const payload3 = rows.map((data) => ({
                fdaid: ACSPLGUID.getNew(),
                faid: FAID ? FAID : GUID,
                fdname: data.FDNAME,
                fdbirthdate: data.FDBIRTHDATE,
                fdaadharno: data.FDAADHARNO,
                companyid: "",
                deptid: "",
            }));

            const response3 = await axios.post(
                baseUrl.Url + "/backend/api/SP_AddUpdFarmerFamily",
                payload3,
                { headers }
            );

            if (response3.status !== 200) {
                throw new Error("❌ Failed to save extended family info.");
            }

            // Step 6: Final success message
            Swal.fire({
                icon: "success",
                title: "यशस्वी!",
                text: "शेतकऱ्याचा डेटा यशस्वीरीत्या जतन झाला.",
                confirmButtonText: "ठीक आहे",
                allowOutsideClick: false,
                allowEscapeKey: false,

            }).then(() => {
                setFormData({
                    FNAME: '',
                    FCONTACTNO: '',
                    FBIRTHDATE: '',
                    FPANNO: '',
                    FADDHARNO: '',
                    FBANKNAME: '',
                    FACCONAME: '',
                    FBRANCHNAME: '',
                    FACCOUNTNO: '',
                    FIFSCCODE: '',
                    FPINCODE: '',
                    FSTATE: '',
                    FCITY: '',
                    FAddress: '',
                    FCROPAREA: '',
                    FCROPTYPE: '',
                    FSTATUS: ''
                });
                setRows([]);
            });

        } catch (error) {
            console.error("❌ Submission Error:", error);
            Swal.fire({
                icon: "error",
                title: "त्रुटी",
                text: "डेटा जतन करण्यात अयशस्वी. कृपया पुन्हा प्रयत्न करा.",
                allowOutsideClick: false,
                allowEscapeKey: false,
            });
        }
    };


    useEffect(() => {
        if (!FAID) return;
        const fetchMasterData = async () => {
            try {
                const payload1 = {
                    "faid": FAID,
                    "keyword": "%",
                    "companyid": "",
                    "deptid": "",
                };

                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*"
                };

                const response = await axios.post(
                    baseUrl.Url + "/backend/api/GET_GateFarmer",
                    payload1,
                    { headers }
                );

                if (response.status !== 200) throw new Error("Failed to fetch data");
                let apiData = response.data[0] || [];
                setFormData((prev) => ({
                    ...prev,
                    FAID: apiData.faid || "",
                    FNAME: apiData.fname || "",
                    FCONTACTNO: apiData.fcontactno || "",
                    FBIRTHDATE: convertToISODate(apiData.fbirthdate) || "",
                    FPANNO: apiData.fpanno || "",
                    FADDHARNO: apiData.faddharno || "",
                    FBANKNAME: apiData.fbankname || "",
                    FACCONAME: apiData.facconame || "",
                    FBRANCHNAME: apiData.fbranchname || "",
                    FACCOUNTNO: apiData.faccountno || "",
                    FIFSCCODE: apiData.fifsccode || "",
                    FPINCODE: apiData.fpincode || "",
                    // FSTATE: apiData.fstate,
                    // FCITY: apiData.fcity,
                    FAddress: apiData.fAddress || "",
                    FCROPAREA: '',
                    FCROPTYPE: '',
                    FCITY: sellingtype.find((city) => city.value == apiData.fcity)?.value || "",
                    FSTATE: statetype.find((state) => state.value == apiData.fstate)?.value || "",
                    FSTATUS: apiData.fstatus || "",
                }));
                console.log(" Master Data:", apiData);
            } catch (error) {
                console.error("Error in Master API Call:", error);
            }
        };


        const fetchDetailsData = async () => {
            try {

                const payload = {
                    maid: FAID,
                    "companyid": "",
                    "deptid": "",
                };

                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*"
                };

                const response = await axios.post(
                    baseUrl.Url + "/backend/api/GET_FamilyDetailsById",
                    payload,
                    { headers }
                );

                if (response.status !== 200) throw new Error("Failed to fetch details data");

                console.log(" Detail Data:", response.data);

                if (response.data.length > 0) {
                    const mappedProducts = response.data.map((item) => ({
                        fdaid: item.fdaid,
                        FAID: item.maid,
                        FDNAME: item.fdname,
                        FDBIRTHDATE: item.fdbirthdate,
                        FDAADHARNO: item.fdaadharno,
                        FDCONTACT: item.fdcontact,
                        FDRELATION: item.fdrelation,
                        isdeleted: item.isdeleted,
                    }));

                    setRows(mappedProducts);
                }
            } catch (error) {
                console.error("Error fetching details data:", error);
            }
        };

        fetchMasterData();
        fetchDetailsData();
    }, [FAID]);



    const [sellingtype, setsellingtype] = useState([]);
    const [statetype, setstatetype] = useState([]);

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



    // const handleChange = async (e) => {
    //     const { name, value } = e.target;
    //     setFormData((prevData) => ({
    //         ...prevData,
    //         [name]: value,
    //     }));

    //     if (name === "FPINCODE" && value.length === 6) {
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
    //                     .map(({ sstatename, said }) => ({
    //                         label: sstatename,
    //                         value: said,
    //                     }));
    //                 setstatetype(Statedata)
    //                 setFormData((prevData) => ({
    //                     ...prevData,
    //                     FSTATE: response.data[0].said || '',
    //                     FCITY: response.data[0].said || '',
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

        if (name === "FPINCODE") {
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
                            FSTATE: data[0]?.said || "",
                            FCITY: data[0]?.said || "",
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

    const handleEnterKey = (e, nextRef) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (nextRef && nextRef.current) {
                nextRef.current.focus();
            }
        }
    };

    const MySwal = withReactContent(Swal);
    const showConfirmationAlert = (event) => {
        MySwal.fire({
            title: "तुम्हाला खात्री आहे का?",
            text: "तुम्हाला हा डेटा जतन करायचा आहे का?",
            showCancelButton: true,
            confirmButtonColor: "#00ff00",
            confirmButtonText: "जतन करा",
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
            title: "Are you sure?",
            text: "Do you want to Exit?",
            showCancelButton: true,
            confirmButtonColor: "#00ff00",
            confirmButtonText: "YES",
            cancelButtonColor: "#092C4C",
            cancelButtonText: "NO",
        }).then((result) => {
            if (result.isConfirmed) {
                if (ID == '101') {
                    navigate(route.QuickFarmer)
                } else {
                    navigate(route.Farmers)
                }
            }
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name in formData) {
            setFormData({
                ...formData,
                [name]: value,
            });
        } else {
            setDetailData({
                ...detailData,
                [name]: value,
            });
        }
    };




    const handleAddDetail = () => {
        console.log(detailData);

        if (!detailData.FDNAME || !detailData.FDBIRTHDATE || !detailData.FDRELATION || !detailData.FDCONTACT) {
            Swal.fire({
                icon: "error",
                title: "चूक",
                text: "कृपया सर्व फील्ड नीट भरावेत.",
                allowOutsideClick: false,
                allowEscapeKey: false,
            });
            return;
        }


        if (detailData.fdaid) {
            const updatedRows = rows.map(row =>
                row.fdaid === detailData.fdaid
                    ? { ...row, ...detailData }
                    : row
            );
            setRows(updatedRows);
        } else {

            setRows([...rows, { ...detailData, fdaid: ACSPLGUID.getNew() }]);
        }

        console.log(rows, "deatil rows");


        setDetailData({
            fdaid: '',
            FDNAME: '',
            FDBIRTHDATE: '',
            FDRELATION: '',
            FDCONTACT: '',
            isdeleted: 0,

        });
    };



    const handleEdit = (fdaid) => {
        console.log("Editing row with fdaid:", fdaid);

        const filteredProduct = rows.find((row) => row.fdaid === fdaid);

        if (filteredProduct) {
            setDetailData({
                fdaid: filteredProduct.fdaid,
                FDNAME: filteredProduct.FDNAME,
                FDBIRTHDATE: convertToISODate(filteredProduct.FDBIRTHDATE),
                FDRELATION: filteredProduct.FDRELATION,
                FDAADHARNO: filteredProduct.FDAADHARNO,
                FDCONTACT: filteredProduct.FDCONTACT,
            });
        }
    };



    const handleDelete = (fdaid) => {
        Swal.fire({
            title: "तुम्हाला खात्री आहे का?",
            text: "तुम्ही हे बदलू शकणार नाही!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "हो, ते हटवा!",
            cancelButtonText: "रद्द करा",
        }).then((result) => {
            if (result.isConfirmed) {
                setRows((prevRows) => {
                    const updatedRows = prevRows.map((row) =>
                        row.fdaid === fdaid ? { ...row, isdeleted: 1 } : row
                    );
                    console.log("Updated Rows:", updatedRows);
                    return updatedRows;
                });

                Swal.fire({
                    icon: "success",
                    title: "हटवले!",
                    text: "रेकॉर्ड यशस्वीपणे हटवला गेला आहे.",
                    confirmButtonText: "ठीक आहे",
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                });
            }
        });
    };




    const handleAddharChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (e.target.name == 'FADDHARNO') {
            try {

                const payload = {
                    "aadhaar": e.target.value,
                };

                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };

                axios({
                    method: "POST",
                    url: baseUrl.Url + "/backend/api/SP_CheckAadhaar",
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
                                    confirmButtonText: "ठीक आहे",
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
        }

    };



    const handleDetailAddharChange = (e) => {
        setDetailData({ ...detailData, [e.target.name]: e.target.value });
        if (e.target.name == 'FDAADHARNO') {
            try {

                const payload = {
                    "aadhaar": e.target.value,
                };

                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };

                axios({
                    method: "POST",
                    url: baseUrl.Url + "/backend/api/SP_CheckAadhaardetail",
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
                                    confirmButtonText: "ठीक आहे",
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
        }

    };




    return (
        <div className="page-wrapper">
            <div className="content">
                <div className="page-header">
                    <div className="add-item d-flex">
                        <div className="page-title">
                            <h4>शेतकरी माहिती</h4>
                            <h6>शेतकरी माहिती भरा</h6>
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
                                >
                                    <ChevronUp className="feather-chevron-up" />
                                </Link>
                            </OverlayTrigger>
                        </li>
                    </ul>
                    <div className="page-btn">
                        <Link onClick={showExitAlert} className="btn btn-secondary">
                            <ArrowLeft className="me-2" />
                            मागे
                        </Link>
                    </div>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="card mbgcolor">
                        <div className="card-body add-product mbgcolor">
                            <div className="accordion-card-one accordion" id="accordionExample">
                                <div className="accordion-item mbgcolor">
                                    <div className="accordion-header" id="headingOne">
                                        <div className="" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-controls="collapseOne">
                                            <div className="addproduct-icon">
                                                <h5 >
                                                    <Info className="add-info" />

                                                    <span>शेतकरी माहिती</span>
                                                </h5>
                                                <Link to="#">
                                                    <ChevronDown className="chevron-down-add" />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                    <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                                        <div className="accordion-body">
                                            {/* Farmer Details Section */}
                                            <div className="row">
                                                <div className="col-lg-4 col-sm-6 col-12">
                                                    <div className=" add-product">
                                                        <label className='required form-label'>पूर्ण नाव</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            placeholder="पूर्ण नाव प्रविष्ट करा"
                                                            name="FNAME"
                                                            value={formData.FNAME}
                                                            onChange={handleChange}
                                                            pattern="^(?!\s)([A-Za-z0-9\u0900-\u097F\s]{3,50})(?<!\s)$"
                                                            title="पूर्ण नाव वैध असावे, ज्यात सुरुवातीला रिकाम्या जागा नकोत."
                                                            ref={FNAMERef}
                                                            onKeyDown={(e) => handleEnterKey(e, FCONTACTNORef)}
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-lg-2 col-sm-4 col-12">
                                                    <div className=" add-product">
                                                        <label className='required form-label'>मोबाईल नंबर</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            placeholder="मोबाईल नंबर प्रविष्ट करा"
                                                            name="FCONTACTNO"
                                                            value={formData.FCONTACTNO}
                                                            onChange={handleChange}
                                                            pattern="^[0-9\u0966-\u096F]{10}$"
                                                            title="मोबाईल नंबर वैध 10 अंकी नंबर असावा."
                                                            ref={FCONTACTNORef}
                                                            onKeyDown={(e) => handleEnterKey(e, FBIRTHDATERef)}
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-lg-2 col-sm-4 col-12">
                                                    <div className=" add-product">
                                                        <label className='required form-label'>जन्मतारीख</label>
                                                        <input
                                                            type="date"
                                                            className="form-control"
                                                            name="FBIRTHDATE"
                                                            value={formData.FBIRTHDATE}
                                                            onChange={handleChange}
                                                            title="जन्मतारीख निवडली जावी."
                                                            ref={FBIRTHDATERef}
                                                            onKeyDown={(e) => handleEnterKey(e, FPANNORef)}
                                                            max={formatDate(userdetail.APPDT)}
                                                            required
                                                        />
                                                    </div>
                                                </div>



                                                <div className="col-lg-2 col-sm-4 col-12">
                                                    <div className=" add-product">
                                                        <label >पॅन क्रमांक</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            placeholder="पॅन नंबर प्रविष्ट करा"
                                                            name="FPANNO"
                                                            value={formData.FPANNO}
                                                            onChange={handleChange}
                                                            pattern="^[A-Z]{5}[0-9]{4}[A-Z]{1}$" // PAN Number format: 5 letters, 4 digits, 1 letter
                                                            title="PAN नंबर योग्य फॉर्मॅटमध्ये असावा (उदा. ABCDE1234F)."
                                                            ref={FPANNORef}
                                                            onKeyDown={(e) => handleEnterKey(e, FADDHARNORef)}

                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-lg-2 col-sm-4 col-12">
                                                    <div className=" add-product">
                                                        <label>आधार क्रमांक</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            placeholder="आधार नंबर प्रविष्ट करा"
                                                            name="FADDHARNO"
                                                            value={formData.FADDHARNO}
                                                            onChange={handleAddharChange}
                                                            pattern="^([0-9\u0966-\u096F]{12})$"
                                                            title="आधार नंबर वैध 12 अंकी नंबर असावा."
                                                            ref={FADDHARNORef}
                                                            onKeyDown={(e) => handleEnterKey(e, FACCONAMERef)} // You can replace FBANKNAMERef with your next input ref
                                                        // required
                                                        />

                                                    </div>
                                                </div>

                                            </div>

                                            {/* Account Details Section */}
                                            <div
                                                className="accordion-card-one accordion"
                                                id="accordionExample2"
                                            >
                                                <div className="accordion-item mbgcolor">
                                                    <div className="accordion-header" id="headingTwo">
                                                        <div
                                                            className=""
                                                            data-bs-toggle="collapse"
                                                            data-bs-target="#collapseTwo"
                                                            aria-controls="collapseTwo"
                                                        >
                                                            <div className="text-editor add-list">
                                                                <div className="addproduct-icon list icon">
                                                                    <h5>
                                                                        <LifeBuoy className="add-info" />
                                                                        <span>बँक तपशील</span>
                                                                    </h5>
                                                                    <Link to="#">
                                                                        <ChevronDown className="chevron-down-add" />
                                                                    </Link>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div
                                                        id="collapseTwo"
                                                        className="accordion-collapse collapse show"
                                                        aria-labelledby="headingTwo"
                                                        data-bs-parent="#accordionExample2"
                                                    >
                                                        <div className="row">


                                                            <div className="col-lg-4 col-sm-6 col-12">
                                                                <div className=" add-product">
                                                                    <label className='required form-label'>खातेदार नाव</label>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        placeholder="खातेदार नाव प्रविष्ट करा"
                                                                        name="FACCONAME"
                                                                        value={formData.FACCONAME}
                                                                        onChange={handleChange}
                                                                        ref={FACCONAMERef}
                                                                        pattern="^(?!\s)([A-Za-z0-9\u0900-\u097F\s]{3,50})(?<!\s)$" // Allow letters, numbers, and spaces
                                                                        title="बँक नाव वैध असावे, ज्यात सुरुवातीला रिकाम्या जागा नकोत."
                                                                        onKeyDown={(e) => handleEnterKey(e, FBANKNAMERef)}
                                                                        required
                                                                    />
                                                                </div>
                                                            </div>


                                                            <div className="col-lg-2 col-sm-6 col-12">
                                                                <div className=" add-product">
                                                                    <label className='required form-label'> बँकेचे नाव</label>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        placeholder="बँक नाव प्रविष्ट करा"
                                                                        name="FBANKNAME"
                                                                        value={formData.FBANKNAME}
                                                                        onChange={handleChange}
                                                                        ref={FBANKNAMERef}
                                                                        pattern="^(?!\s)([A-Za-z0-9\u0900-\u097F\s]{3,50})(?<!\s)$" // Allow letters, numbers, and spaces
                                                                        title="बँक नाव वैध असावे, ज्यात सुरुवातीला रिकाम्या जागा नकोत."
                                                                        onKeyDown={(e) => handleEnterKey(e, FBRANCHNAMERef)}
                                                                        required
                                                                    />
                                                                </div>
                                                            </div>



                                                            <div className="col-lg-2 col-sm-6 col-12">
                                                                <div className=" add-product">
                                                                    <label className='required form-label'>शाखेचे नाव</label>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        placeholder="शाखेचे नाव प्रविष्ट करा"
                                                                        name="FBRANCHNAME"
                                                                        value={formData.FBRANCHNAME}
                                                                        onChange={handleChange}
                                                                        ref={FBRANCHNAMERef}
                                                                        pattern="^(?!\s)([A-Za-z0-9\u0900-\u097F\s]{3,50})(?<!\s)$" // Allow letters, numbers, and spaces
                                                                        title="शाखेचे नाव वैध असावे, ज्यात सुरुवातीला रिकाम्या जागा नकोत."
                                                                        onKeyDown={(e) => handleEnterKey(e, FACCOUNTNORef)}
                                                                        required
                                                                    />
                                                                </div>
                                                            </div>


                                                            <div className="col-lg-2 col-sm-4 col-12">
                                                                <div className=" add-product">
                                                                    <label className='required form-label'>खाते क्रमांक</label>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        placeholder="खाते क्रमांक प्रविष्ट करा"
                                                                        name="FACCOUNTNO"
                                                                        value={formData.FACCOUNTNO}
                                                                        onChange={handleChange}
                                                                        ref={FACCOUNTNORef}
                                                                        pattern="^[0-9\u0966-\u096F]{9,18}$" // Account Number pattern with 10-20 digits
                                                                        title="खाते नंबर वैध असावा, ज्यात 10-20 अंक असावेत."
                                                                        onKeyDown={(e) => handleEnterKey(e, FIFSCCODERef)}
                                                                        required
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="col-lg-2 col-sm-4 col-12">
                                                                <div className=" add-product">
                                                                    <label className='required form-label'>IFSC कोड</label>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        placeholder="IFSC कोड प्रविष्ट करा"
                                                                        name="FIFSCCODE"
                                                                        value={formData.FIFSCCODE}
                                                                        onChange={handleChange}
                                                                        ref={FIFSCCODERef}
                                                                        pattern="^[A-Za-z]{4}0[A-Z0-9]{6}$" // Validate the IFSC code format
                                                                        title="IFSC कोड खालील फॉर्मॅटमध्ये असावा: ABCD0123456."
                                                                        onKeyDown={(e) => handleEnterKey(e, FPINCODERef)}
                                                                        required
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Address Details Section */}
                                            <div
                                                className="accordion-card-one accordion"
                                                id="accordionExample2"
                                            >
                                                <div className="accordion-item mbgcolor">
                                                    <div className="accordion-header" id="headingTwo">
                                                        <div
                                                            className=""
                                                            data-bs-toggle="collapse"
                                                            data-bs-target="#collapseTwo"
                                                            aria-controls="collapseTwo"
                                                        >
                                                            <div className="text-editor add-list">
                                                                <div className="addproduct-icon list icon">
                                                                    <h5>
                                                                        <LifeBuoy className="add-info" />
                                                                        <span>राहिवासी पत्ता</span>
                                                                    </h5>
                                                                    <Link to="#">
                                                                        <ChevronDown className="chevron-down-add" />
                                                                    </Link>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div
                                                        id="collapseTwo"
                                                        className="accordion-collapse collapse show"
                                                        aria-labelledby="headingTwo"
                                                        data-bs-parent="#accordionExample2"
                                                    >

                                                        <div className="row">
                                                            <div className="col-lg-2 col-sm-4 col-12">
                                                                <div className=" add-product">
                                                                    <label className='required form-label'>पिनकोड</label>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        placeholder="पिन कोड प्रविष्ट करा"
                                                                        name="FPINCODE"
                                                                        value={formData.FPINCODE}
                                                                        onChange={handleChange}
                                                                        pattern="^([0-9\u0966-\u096F]{6})$"
                                                                        title="कृपया वैध 6-अंकी पिन कोड टाका"
                                                                        ref={FPINCODERef}
                                                                        onKeyDown={(e) => handleEnterKey(e, FSTATERef)}
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="col-lg-2 col-sm-4 col-12">
                                                                <div className=" add-product">
                                                                    <label className='required form-label'>राज्य</label>
                                                                    <Select
                                                                        classNamePrefix="react-select"
                                                                        name="FSTATE"
                                                                        options={statetype}
                                                                        value={statetype.find((option) => option.value === formData.FSTATE) || null}
                                                                        onChange={(selectedOption) => handleSelectChange(selectedOption, 'FSTATE')}
                                                                        placeholder="निवडा"
                                                                        ref={FSTATERef}
                                                                        onKeyDown={(e) => handleEnterKey(e, FCITYRef)}
                                                                    // onChange={(selectedOption) => {

                                                                    //     setFormData(prevState => ({
                                                                    //         ...prevState,
                                                                    //         FSTATE: selectedOption ? selectedOption.value : '',
                                                                    //     }));
                                                                    // }}
                                                                    />

                                                                </div>
                                                            </div>

                                                            <div className="col-lg-2 col-sm-4 col-12">
                                                                <div className=" add-product">
                                                                    <label className='required form-label'>शहर</label>
                                                                    <Select
                                                                        classNamePrefix="react-select"
                                                                        name="FCITY"
                                                                        options={sellingtype}
                                                                        value={sellingtype.find((option) => option.value === formData.FCITY) || null}
                                                                        onChange={(selectedOption) => handleSelectChange(selectedOption, 'FCITY')}
                                                                        placeholder="निवडा"
                                                                        ref={FCITYRef}
                                                                        onKeyDown={(e) => handleEnterKey(e, FAddressRef)}
                                                                    />
                                                                </div>
                                                            </div>


                                                            <div className=" col-sm-6 col-12">
                                                                <div className=" add-product">
                                                                    <label>पत्ता</label>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        placeholder="पत्ता प्रविष्ट करा"
                                                                        name="FAddress"
                                                                        value={formData.FAddress}
                                                                        onChange={handleChange}
                                                                        ref={FAddressRef}
                                                                        onKeyDown={(e) => handleEnterKey(e, FNAMERef)}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>
                                            </div>
                                            <div
                                                className="accordion-card-one accordion"
                                                id="accordionExample2"
                                            >
                                                <div className="accordion-item mbgcolor">
                                                    <div className="accordion-header" id="headingTwo">
                                                        <div
                                                            className=""
                                                            data-bs-toggle="collapse"
                                                            data-bs-target="#collapseTwo"
                                                            aria-controls="collapseTwo"
                                                        >
                                                            <div className="text-editor add-list">
                                                                <div className="addproduct-icon list icon">
                                                                    <h5>
                                                                        <LifeBuoy className="add-info" />
                                                                        <span>कुटुंबाची माहिती</span>
                                                                    </h5>
                                                                    <Link to="#">
                                                                        <ChevronDown className="chevron-down-add" />
                                                                    </Link>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div
                                                        id="collapseTwo"
                                                        className="accordion-collapse collapse show"
                                                        aria-labelledby="headingTwo"
                                                        data-bs-parent="#accordionExample2"
                                                    >
                                                        <div className="border p-3 rounded shadow-sm mb-0">
                                                            <div className="row mt-0">
                                                                <div className="row">
                                                                    <div className="col-lg-3 col-md-6 col-sm-12">
                                                                        <div className=" add-product">
                                                                            <label>पूर्ण नाव</label>
                                                                            <input
                                                                                type="text"
                                                                                className="form-control"
                                                                                name="FDNAME"
                                                                                value={detailData.FDNAME}
                                                                                onChange={handleInputChange}
                                                                                ref={FNAMERef}
                                                                                onKeyDown={(e) => handleEnterKey(e, FDBIRTHDATERef)}
                                                                            />
                                                                        </div>
                                                                    </div>

                                                                    <div className="col-lg-2 col-md-4 col-sm-12">
                                                                        <div className=" add-product">
                                                                            <label>जन्मदिनांक</label>
                                                                            <input
                                                                                type="date"
                                                                                className="form-control"
                                                                                name="FDBIRTHDATE"
                                                                                value={detailData.FDBIRTHDATE}
                                                                                onChange={handleInputChange}
                                                                                max={new Date().toISOString().split("T")[0]}
                                                                                ref={FDBIRTHDATERef}
                                                                                onKeyDown={(e) => handleEnterKey(e, FDRELATIONRef)}
                                                                            />
                                                                        </div>
                                                                    </div>

                                                                    <div className="col-lg-2 col-md-4 col-sm-12">
                                                                        <div className=" add-product">
                                                                            <label >नातेसंबंध</label>
                                                                            <Select
                                                                                classNamePrefix="react-select"
                                                                                name="FDRELATION"
                                                                                options={relation}
                                                                                placeholder="निवडा"
                                                                                value={relation.find((option) => option.value === detailData.FDRELATION) || null}
                                                                                // onChange={handleSelectChange}
                                                                                onChange={(selectedOption) => {
                                                                                    setDetailData((prevData) => ({
                                                                                        ...prevData,
                                                                                        FDRELATION: selectedOption ? selectedOption.value : "",
                                                                                    }));
                                                                                    if (FDAADHARNORef.current) {
                                                                                        FDAADHARNORef.current.focus();
                                                                                    }
                                                                                }}
                                                                                ref={FDRELATIONRef}
                                                                            // onKeyDown={(e) => handleEnterKey(e, FDAADHARNORef)}
                                                                            />
                                                                        </div>
                                                                    </div>

                                                                    <div className="col-lg-2 col-md-4 col-sm-12">
                                                                        <div className=" add-product">
                                                                            <label >आधार नंबर</label>
                                                                            <input
                                                                                type="text"
                                                                                className="form-control"
                                                                                name="FDAADHARNO"
                                                                                value={detailData.FDAADHARNO}
                                                                                onChange={handleDetailAddharChange}
                                                                                ref={FDAADHARNORef}
                                                                                pattern="^([0-9\u0966-\u096F]{12})$"
                                                                                onKeyDown={(e) => handleEnterKey(e, FDCONTACTRef)}
                                                                            />
                                                                        </div>
                                                                    </div>

                                                                    <div className="col-lg-2 col-md-4 col-sm-12">
                                                                        <div className=" add-product">
                                                                            <label >मोबाईल नंबर</label>
                                                                            <input
                                                                                type="text"
                                                                                className="form-control"
                                                                                name="FDCONTACT"
                                                                                value={detailData.FDCONTACT}
                                                                                onChange={handleInputChange}
                                                                                ref={FDCONTACTRef}
                                                                                pattern="^[A-Z]{5}[0-9]{4}[A-Z]{1}$"
                                                                                onKeyDown={(e) => handleEnterKey(e, submitRef)}
                                                                            />
                                                                        </div>
                                                                    </div>

                                                                    <div className="col-lg-1 col-md-4 col-sm-12 mt-4">
                                                                        <button
                                                                            type="button"
                                                                            className="btn btn-submit"
                                                                            onClick={handleAddDetail}
                                                                            ref={submitRef}
                                                                        >
                                                                            Add
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="row">
                                                            <div className="col-lg-12">
                                                                <div className="modal-body-table">
                                                                    <div
                                                                        className="table-responsive"
                                                                        style={{
                                                                            height: 'calc(62vh - 120px)',
                                                                            overflowY: 'auto',
                                                                            overflowX: 'auto',
                                                                        }}
                                                                    >
                                                                        <table className="table table-bordered">
                                                                            <thead className="thead-dark">
                                                                                <tr>
                                                                                    <th className="col-2" style={{ position: 'sticky', top: 0 }}>पूर्ण नाव</th>
                                                                                    <th className="col-1" style={{ position: 'sticky', top: 0 }}>जन्मदिनांक</th>
                                                                                    <th className="col-2" style={{ position: 'sticky', top: 0 }}>नातेसंबंध</th>
                                                                                    <th className="col-2" style={{ position: 'sticky', top: 0 }}>आधार नंबर</th>
                                                                                    <th className="col-2" style={{ position: 'sticky', top: 0 }}>मोबाईल नंबर</th>
                                                                                    <th className="col-1">Actions</th>
                                                                                </tr>
                                                                            </thead>

                                                                            <tbody>
                                                                                {rows.filter((row) => row.isdeleted == 0 || row.isdeleted == false).length > 0 ? (
                                                                                    rows
                                                                                        .filter((row) => row.isdeleted == 0)
                                                                                        .map((row, index) => (
                                                                                            <tr key={row.fdaid || index}>
                                                                                                <td>{row.FDNAME}</td>
                                                                                                <td>{row.FDBIRTHDATE}</td>
                                                                                                <td>{row.FDRELATION}</td>
                                                                                                <td>{row.FDAADHARNO}</td>
                                                                                                <td>{row.FDCONTACT}</td>
                                                                                                <td>
                                                                                                    <Link
                                                                                                        to="#"
                                                                                                        onClick={() => handleEdit(row.fdaid)}
                                                                                                        className="me-2 p-1"
                                                                                                        style={{ color: 'lightblue' }}
                                                                                                    >
                                                                                                        <Edit className="feather-edit" />
                                                                                                    </Link>
                                                                                                    <Link
                                                                                                        className="confirm-text p-2"
                                                                                                        to="#"
                                                                                                        onClick={() => handleDelete(row.fdaid)}
                                                                                                    >
                                                                                                        <Trash2 className="feather-trash-2 text-danger" />
                                                                                                    </Link>
                                                                                                </td>
                                                                                            </tr>
                                                                                        ))
                                                                                ) : (
                                                                                    <tr>

                                                                                    </tr>
                                                                                )}
                                                                            </tbody>



                                                                        </table>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                        <div>

                                            {/* Status Section */}
                                            {/* Status Section */}
                                            <div className="mt-2 me-2">
                                                <div className="row justify-content-end">
                                                    <div className="col-lg-6 col-sm-12 col-12">
                                                        <h5>स्टेटस</h5>
                                                        <div className=" add-product">
                                                            <Select
                                                                classNamePrefix="react-select"
                                                                name="FSTATUS"
                                                                options={status}
                                                                placeholder="निवडा"
                                                                ref={STATUSRef}
                                                                value={status.find((option) => option.value === formData.FSTATUS) || null}
                                                                // onChange={handleSelectChange}
                                                                onChange={(selectedOption) => {
                                                                    setFormData((prevData) => ({
                                                                        ...prevData,
                                                                        FSTATUS: selectedOption ? selectedOption.value : "",
                                                                    }));
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>


                                            {/* Submit and Cancel Buttons */}
                                            <div className="text-end mb-3">
                                                <button
                                                    type="button"
                                                    className="btn btn-cancel me-2"
                                                    data-bs-dismiss="modal"
                                                    onClick={showExitAlert}
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
                        </div>
                    </div>
                </form>
            </div >
        </div >
    );
};

export default AddFarmers;



