import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronUp, Info, ArrowLeft, Trash2, Edit } from "feather-icons-react/build/IconComponents";
import { useDispatch, useSelector } from "react-redux";
import { setToogleHeader } from "../../core/redux/action";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { all_routes } from "../../Router/all_routes";
import axios from 'axios';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
// import { ACSPLGUID, baseUrl, convertToISODate } from '../../json/custom';
import { ACSPLGUID, baseUrl, convertToISODate } from "../../core/json/custom";
import { useNavigate, useLocation } from "react-router-dom";
import { getUserData } from '../../Context/UserData';
import Select from "react-select";

const AddTransporter = () => {
    const MySwal = withReactContent(Swal);
    const location = useLocation();
    const { TAID, ID } = location.state || {};
    console.log("ID", ID)
    const userdetail = getUserData();
    const GUID = ACSPLGUID.getNew();
    const route = all_routes;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const TNAMERef = useRef(null);
    const VEHICALNORef = useRef(null);
    const TCANTACTNORef = useRef(null);
    const TBIRTHDATERef = useRef(null);
    const TDATERef = useRef(null);
    // const TPANRef = useRef(null);
    // const TGSTINRef = useRef(null);
    const VEHICALTYPERef = useRef(null);
    const VEHICALCAPACITYRef = useRef(null);
    const TPINCODERef = useRef(null);
    const TADDRESSRef = useRef(null);


    const data = useSelector((state) => state.toggle_header);

    const renderCollapseTooltip = (props) => (
        <Tooltip id="refresh-tooltip" {...props}>
            Collapse
        </Tooltip>
    );

    const [rows, setRows] = useState([]);
    const [detailData, setDetailData] = useState({
        MAID: '',
        TAID: '',
        fdaid: '',
        FDNAME: '',
        FDBIRTHDATE: '',
        FDRELATION: '',
        FDCONTACT: '',
        isdeleted: 0,


    });

    const [Vdata, setVdata] = useState([]);
    const [VehicalDetails, setVehicalDetails] = useState({
        vdaid: '',
        TAID: '',
        VNO: 'MH',
        VTYPE: '',
        VCAPACITY: '',
        isdeleted: 0,

    });




    const [formData, setFormData] = useState({
        MAID: "",
        fdaid: "",
        TAID: "",
        TNAME: "",
        TADDRESS: "",
        TCITY: "",
        TPINCODE: "",
        TCANTACTNO: "",
        TGSTIN: "",
        TSTATE: "",
        TPAN: "",
        TDATE: "",
        TBIRTHDATE: "",
        VEHICALNO: "",
        VEHICALTYPE: "",
        VEHICALCAPACITY: "",

    });

    const [alertMessage, setAlertMessage] = useState(false);

    const handleSubmit = (e, event) => {
        e.preventDefault();
        console.log('Form Data:', formData);
        showConfirmationAlert(event);
    };

    const handleFormSubmission = async () => {

        try {
            const payload = {
                "taid": TAID ? TAID : GUID,
                "tname": formData.TNAME,
                "taddress": formData.TADDRESS,
                "tcity": formData.TCITY,
                "tpincode": formData.TPINCODE,
                "tcantactno": formData.TCANTACTNO,
                "tgstin": formData.TGSTIN,
                "tstate": formData.TSTATE,
                "tpan": formData.TPAN,
                "tdate": formData.TDATE,
                "tbirthdate": formData.TBIRTHDATE,
                "vehicalno": formData.VEHICALNO,
                "vehicaltype": formData.VEHICALTYPE,
                "vehicalcapacity": formData.VEHICALCAPACITY,
                "companyid": userdetail?.companyID ? userdetail.companyID : "",
                "deptid": userdetail?.departmentID ? userdetail.departmentID : "",
                tuid: "",
                uaid: userdetail?.uaid || "",
                "tprofile": '',
                fcmtoken: ""
            };

            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            // First API Call
            const response1 = await axios.post(baseUrl.Url + "/backend/api/SP_AddUpdTransporters", payload, { headers });

            if (response1.status === 200) {
                const payload2 = rows.map((data) => ({
                    "fdaid": data.fdaid ? data.fdaid : ACSPLGUID.getNew(),
                    "maid": TAID ? TAID : GUID,
                    "fdname": data.FDNAME,
                    "fdbirthdate": data.FDBIRTHDATE,
                    "fdaadharno": "",
                    "fdcontact": data.FDCONTACT,
                    "fdrelation": data.FDRELATION,
                    "companyid": userdetail?.companyID ? userdetail.companyID : "",
                    "deptid": userdetail?.departmentID ? userdetail.departmentID : "",
                    "isdeleted": data.isdeleted === 1 || data.isdeleted === true ? true : false,
                }));

                // Second API Call
                const response2 = await axios.post(baseUrl.Url + "/backend/api/SP_AddFamilyDetails", payload2, { headers });

                if (response2.status === 200) {

                    const vehiclePayload = Vdata.map((vehical) => ({
                        "vdaid": vehical.vdaid ? vehical.vdaid : ACSPLGUID.getNew(),
                        "taid": TAID ? TAID : GUID,
                        "vno": vehical.VNO,
                        "vtype": vehical.VTYPE,
                        "vcapacity": vehical.VCAPACITY,
                        "companyid": userdetail?.companyID ? userdetail.companyID : "",
                        "deptid": userdetail?.departmentID ? userdetail.departmentID : "",
                        "isdeleted": vehical.isdeleted === 1 || vehical.isdeleted === true ? true : false,
                    }));

                    const response3 = await axios.post(baseUrl.Url + "/backend/api/SP_AddVehicalDetails", vehiclePayload, { headers });

                    if (response3.status === 200) {
                        Swal.fire({
                            icon: "success",
                            title: "जतन केले!",
                            text: "माहिती यशस्वीरीत्या जतन झाली आहे.",
                            confirmButtonText: "ठीक आहे",
                            allowOutsideClick: false,
                            allowEscapeKey: false
                        }).then((result) => {
                            if (result.isConfirmed) {
                                setFormData({
                                    TAID: "",
                                    TNAME: "",
                                    TADDRESS: "",
                                    TCITY: "",
                                    TPINCODE: "",
                                    TCANTACTNO: "",
                                    TGSTIN: "",
                                    TSTATE: "",
                                    TPAN: "",
                                    TDATE: "",
                                    TBIRTHDATE: "",
                                    VEHICALNO: "",
                                    VEHICALTYPE: "",
                                    VEHICALCAPACITY: "",
                                });

                                setRows([]);
                                if (ID == '102') {
                                    navigate(route.QuickTransporter)
                                } else {
                                    navigate(route.Transporter)
                                }
                            }
                        });
                    } else {
                        throw new Error("Failed to save vehicle details.");
                    }
                } else {
                    throw new Error("Failed to save family details.");
                }
            } else {
                throw new Error("Failed to save master data.");
            }



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


    useEffect(() => {
        const fetchData = async () => {
            if (TAID) {
                try {
                    const payload = {
                        "taid": TAID,
                        "keyword": "%",
                        "companyid": userdetail?.companyID ? userdetail.companyID : "",
                        "deptid": userdetail?.departmentID ? userdetail.departmentID : "",

                    }

                    const headers = {
                        "Content-Type": "application/json",
                        Accept: "*/*",
                    };

                    // Make the API request with async/await
                    const response = await axios({
                        method: "POST",
                        url: baseUrl.Url + "/backend/api/GET_Transporters",
                        data: JSON.stringify(payload),
                        headers: headers,
                    });

                    if (response.status !== 200) {
                        throw new Error("Failed to Fetch Gate Entry Data");
                    }

                    let apiData = response.data[0];
                    setFormData((prev) => ({
                        ...prev,
                        TAID: apiData.taid,
                        TNAME: apiData.tname,
                        TADDRESS: apiData.taddress,

                        TCITY: sellingtype.find((state) => state.value == apiData.tcity)?.value || '',
                        TPINCODE: apiData.tpincode,
                        TCANTACTNO: apiData.tcantactno,
                        TGSTIN: apiData.tgstin,
                        TSTATE: statetype.find((state) => state.value == apiData.tstate)?.value || "",
                        TPAN: apiData.tpan,
                        TDATE: convertToISODate(apiData.tdate),
                        TBIRTHDATE: convertToISODate(apiData.tbirthdate),
                        VEHICALNO: apiData.vehicalno,
                        VEHICALTYPE: apiData.vehicaltype,
                        VEHICALCAPACITY: apiData.vehicalcapacity,

                    }));


                } catch (error) {
                    console.error("Error fetching Access Right Data:", error);
                }
            }
        };

        fetchData();
    }, [TAID]);



    const [relation, setrelation] = useState([]);

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

        fetchRelations();
    }, []);



    const showConfirmationAlert = () => {
        MySwal.fire({
            title: 'तुम्हाला खात्री आहे का?',
            text: 'तुम्हाला डेटाला सेव्ह करायचं आहे का?',
            showCancelButton: true,
            confirmButtonColor: '#00ff00',
            confirmButtonText: 'सेव्ह करा',
            cancelButtonColor: '#092C4C',
            cancelButtonText: 'रद्द करा',
            allowOutsideClick: false,
            allowEscapeKey: false
        }).then((result) => {
            if (result.isConfirmed) {
                handleFormSubmission();

            }
        });
    };

    const checkFormValidity = (e) => {
        const {
            TNAME,
            TADDRESS,
            TCITY,
            TPINCODE,
            TCANTACTNO,
            TGSTIN,
            TSTATE,
            TPAN,
            TBIRTHDATE,
            VEHICALNO,
            VEHICALTYPE,
            VEHICALCAPACITY
        } = formData;


        if (!TNAME) {
            Swal.fire({
                icon: "error",
                title: "त्रुटी",
                text: " नाव आवश्यक आहे ",
                allowOutsideClick: false,
                allowEscapeKey: false
            }).then(() => {
                TNAMERef.current.focus();
            });
            return;
        }

        // if (!SQDUEDATE || !isValidDate(SQDUEDATE)) {
        //     Swal.fire({
        //         icon: "error",
        //         title: "Validation Error",
        //         text: "Quotation validity Date is required and must be a valid date.",
        //     }).then(() => {
        //         SQDUEDATERef.current.focus();
        //     });
        //     return;
        // }

        if (!TCANTACTNO || !/^[0-9]{10}$/.test(TCANTACTNO)) {
            Swal.fire({
                icon: "error",
                title: "त्रुटी",
                text: "कृपया वैध १० अंकी मोबाईल नंबर प्रविष्ट करा",
                allowOutsideClick: false,
                allowEscapeKey: false
            }).then(() => {
                TCANTACTNORef.current.focus();
            });
            return;
        }

        if (!VEHICALNO) {
            Swal.fire({
                icon: "error",
                title: "त्रुटी",
                text: "वाहन क्र. आवश्यक आहे",
                allowOutsideClick: false,
                allowEscapeKey: false
            }).then(() => {
                VEHICALNORef.current.focus();
            });
            return;
        }



        if (!TPINCODE || !/^\d{6}$/.test(TPINCODE)) {
            Swal.fire({
                icon: "error",
                title: "त्रुटी",
                text: "कृपया वैध ६ अंकी पिन कोड प्रविष्ट करा",
                allowOutsideClick: false,
                allowEscapeKey: false
            }).then(() => {
                TPINCODERef.current.focus();
            });
            return;
        }

        // if (!SCCONSIGNER) {
        //     Swal.fire({
        //         icon: "error",
        //         title: "Validation Error",
        //         text: "Consigner is required",
        //     }).then(() => {
        //         SCCONSIGNERRef.current.focus();      
        //     });
        //     return;
        // }

        // if (!SQTRANSPORTTERMS) {
        //     Swal.fire({
        //         icon: "error",
        //         title: "Validation Error",
        //         text: "Transport Terms is required",
        //     }).then(() => {
        //         SQTRANSPORTTERMSRef.current.focus();
        //     });
        //     return;
        // }

        // if (rows.length === 0) {
        //     Swal.fire({
        //         icon: "error",
        //         title: "Validation Error",
        //         text: "Please add at least one product before saving.",
        //     });
        //     return;
        // }
        handleSubmit(e);
    };

    const handleKeyDown = (e, nextInputRef) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (nextInputRef && nextInputRef.current) {
                nextInputRef.current.focus();
            }
        }
    };

    useEffect(() => {
        const handleShortcut = (e) => {
            if (e.ctrlKey && e.key === "e") {
                e.preventDefault();
                showExitAlert();
            }

            if (e.ctrlKey && (e.key === "s" || e.key === "S")) {
                e.preventDefault();
                checkFormValidity(e);
            }
        };

        window.addEventListener("keydown", handleShortcut);
        return () => {
            window.removeEventListener("keydown", handleShortcut);
        };
    }, [formData, navigate]);


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
                if (ID == '102') {
                    navigate(route.QuickTransporter)
                } else {
                    navigate(route.Transporter)
                }
            }
        });
    };


    // const handleChange = async (e) => {
    //     const { name, value } = e.target;
    //     setFormData((prevData) => ({
    //         ...prevData,
    //         [name]: value,
    //     }));

    //     if (name === "TPINCODE" && value.length === 6) {
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
    //                     TSTATE: response.data[0].said || '',
    //                     TCITY: response.data[0].said || '',
    //                 }));
    //             } else {
    //                 console.error("Failed to fetch district and state for the pincode");
    //             }
    //         } catch (error) {
    //             console.error("Error fetching district and state data:", error);
    //         }
    //     }
    // };

    // const handleSelectChange = (selectedOption) => {
    //     setFormData({
    //         ...formData,
    //         SCNAME: selectedOption ? selectedOption.value : ""
    //     });
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




    useEffect(() => {
        if (!TAID) return;
        const fetchMasterData = async () => {
            try {
                const payload1 = {
                    "taid": TAID,
                    "keyword": "%",
                    "companyid": userdetail?.companyID ? userdetail.companyID : "",
                    "deptid": userdetail?.departmentID ? userdetail.departmentID : "",

                }

                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*"
                };

                const response = await axios.post(
                    baseUrl.Url + "/backend/api/GET_Transporters",
                    payload1,
                    { headers }
                );

                if (response.status !== 200) throw new Error("Failed to fetch data");
                let apiData = response.data[0];
                setFormData((prev) => ({
                    ...prev,
                    TAID: apiData.taid,
                    TNAME: apiData.tname,
                    TADDRESS: apiData.taddress,
                    TCITY: sellingtype.find((state) => state.value == apiData.tcity)?.value || '',
                    TPINCODE: apiData.tpincode,
                    TCANTACTNO: apiData.tcantactno,
                    TGSTIN: apiData.tgstin,
                    TSTATE: statetype.find((state) => state.value == apiData.tstate)?.value || "",
                    TPAN: apiData.tpan,
                    TDATE: convertToISODate(apiData.tdate),
                    TBIRTHDATE: convertToISODate(apiData.tbirthdate),
                    VEHICALNO: apiData.vehicalno,
                    VEHICALTYPE: apiData.vehicaltype,
                    VEHICALCAPACITY: apiData.vehicalcapacity,

                }));

                console.log(" Master Data:", apiData);
            } catch (error) {
                console.error("Error in Master API Call:", error);
            }
        };




        const fetchDetailsData = async () => {
            try {

                const payload = {
                    maid: TAID,
                    "companyid": userdetail?.companyID ? userdetail.companyID : "",
                    "deptid": userdetail?.departmentID ? userdetail.departmentID : "",

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
                        TAID: item.maid,
                        FDNAME: item.fdname,
                        FDBIRTHDATE: item.fdbirthdate,
                        FDAADHARNO: item.fdaadharno,
                        FDCONTACT: item.fdcontact,
                        FDRELATION: item.fdrelation,
                        isdeleted: 0,
                    }));


                    setRows(mappedProducts);
                }
            } catch (error) {
                console.error("Error fetching details data:", error);
            }
        };



        const fetchVehicalData = async () => {
            try {

                const payload = {
                    taid: TAID,
                    "companyid": userdetail?.companyID ? userdetail.companyID : "",
                    "deptid": userdetail?.departmentID ? userdetail.departmentID : "",

                };

                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*"
                };

                const response = await axios.post(
                    baseUrl.Url + "/backend/api/GET_VehicalDetailsById",
                    payload,
                    { headers }
                );

                if (response.status !== 200) throw new Error("Failed to fetch details data");

                console.log(" Detail Data:", response.data);

                if (response.data.length > 0) {
                    const mappedProducts = response.data.map((item) => ({
                        vdaid: item.vdaid,
                        TAID: item.taid,
                        VNO: item.vno,
                        VTYPE: item.vtype,
                        VCAPACITY: item.vcapacity,
                        isdeleted: 0,
                    }));

                    setVdata(mappedProducts);
                }
            } catch (error) {
                console.error("Error fetching details data:", error);
            }
        };




        fetchMasterData();
        fetchDetailsData();
        fetchVehicalData();
    }, [TAID]);



    const handleSelectChange = (selectedOption, fieldName) => {
        setFormData({
            ...formData,
            [fieldName]: selectedOption ? selectedOption.value : '',
        });
    };


    const handleInputChange = (e) => {
        const { name, value } = e.target;


        if (name in formData) {
            setFormData({
                ...formData,
                [name]: value,
            });
        } else if (name in VehicalDetails) {

            setVehicalDetails((prevDetails) => ({
                ...prevDetails,
                [name]: value,
            }));
        } else {

            setDetailData({
                ...detailData,
                [name]: value,
            });


            // handleBlur();
        }
    };


    const updateRelation = (selectedOption) => {
        setDetailData((prevData) => ({
            ...prevData,
            FDRELATION: selectedOption ? selectedOption.value : "",
        }));
    };


    const handleAddDetail = () => {
        console.log(detailData);


        if (!detailData.FDNAME || !detailData.FDBIRTHDATE || !detailData.FDRELATION || !detailData.FDCONTACT) {
            Swal.fire({
                icon: "error",
                title: "चुकिची माहिती",
                text: "कृपया सर्व फील्ड भरावेत.",
                allowOutsideClick: false,
                allowEscapeKey: false
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



    const handleAddVehical = () => {
        if (!VehicalDetails.VNO || !VehicalDetails.VTYPE || !VehicalDetails.VCAPACITY) {
            Swal.fire({
                icon: "error",
                title: "Validation Error",
                text: "कृपया सर्व फील्ड भरावेत.",
            });
            return;
        }

        if (VehicalDetails.vdaid) {
            const updatedRows = Vdata.map(row =>
                row.vdaid === VehicalDetails.vdaid
                    ? { ...row, ...VehicalDetails }
                    : row
            );
            setVdata(updatedRows);
        } else {

            setVdata([...Vdata, { ...VehicalDetails, vdaid: ACSPLGUID.getNew() }]);
        }

        console.log(Vdata, "deatil rows");

        // Reset vehicle details
        setVehicalDetails({
            fdaid: '',
            VNO: '',
            VTYPE: '',
            VCAPACITY: '',
            isdeleted: 0,
        });
    };

    //FamilyDetails
    const handleEdit = (fdaid) => {
        console.log("Editing row with fdaid:", fdaid);


        const filteredProduct = rows.find((row) => row.fdaid === fdaid);

        if (filteredProduct) {
            setDetailData({
                fdaid: filteredProduct.fdaid,
                FDNAME: filteredProduct.FDNAME,
                FDBIRTHDATE: filteredProduct.FDBIRTHDATE,
                FDRELATION: filteredProduct.FDRELATION,
                FDCONTACT: filteredProduct.FDCONTACT,
                isdeleted: 0,
            });
        }
    };

    //VehicalDetails
    const handleVehicalEdit = (vdaid) => {
        console.log("Editing row with vdaid:", vdaid);

        const filteredProduct = Vdata.find((row) => row.vdaid === vdaid);

        if (filteredProduct) {
            setVehicalDetails({
                vdaid: filteredProduct.vdaid,
                VNO: filteredProduct.VNO,
                VTYPE: filteredProduct.VTYPE,
                VCAPACITY: filteredProduct.VCAPACITY,
                isdeleted: 0,
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
            allowOutsideClick: false,
            allowEscapeKey: false
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
                    text: "रेकॉर्ड हटवले...!",
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    confirmButtonText: "OK",
                });
            }
        });
    };



    const handleVehicalDelete = (vdaid) => {
        Swal.fire({
            title: "तुम्हाला खात्री आहे का?",
            text: "तुम्ही हे बदलू शकणार नाही!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "हो, ते हटवा!",
            cancelButtonText: "रद्द करा",
            allowOutsideClick: false,
            allowEscapeKey: false,
        }).then((result) => {
            if (result.isConfirmed) {
                setVdata((prevRows) => {
                    const updatedRows = prevRows.map((row) =>
                        row.vdaid === vdaid ? { ...row, isdeleted: 1 } : row
                    );
                    console.log("Updated Rows:", updatedRows);
                    return updatedRows;
                });

                Swal.fire({
                    icon: "success",
                    title: "हटवले!",
                    text: "रेकॉर्ड हटवले...!",
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    confirmButtonText: "OK",
                });
            }
        });
    };


    const handleVehicalChange = (e) => {
        setVehicalDetails({ ...VehicalDetails, [e.target.name]: e.target.value });
        if (e.target.name == 'VNO') {
            try {

                const payload = {
                    "vehicalno": e.target.value,
                };

                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };

                axios({
                    method: "POST",
                    url: baseUrl.Url + "/backend/api/SP_CheckVehicalNo",
                    data: JSON.stringify(payload),
                    headers: headers,
                })
                    .then((response) => {
                        if (response.status === 200) {
                            console.log(response.data)
                            if (response.data[0].isSuccessful == 1) {
                                Swal.fire({
                                    icon: "error",
                                    title: "त्रुटी ",
                                    text: response.data[0].responseMessage,
                                    allowOutsideClick: false,
                                    allowEscapeKey: false,
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
        }

    };



    return (
        <div className="page-wrapper">
            <div className="content">
                <div className="page-header">
                    <div className="add-item d-flex">
                        <div className="page-title">
                            <h4> वाहक </h4>
                            <h6>नवीन वाहक तयार करा.</h6>
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
                        <button
                            className="btn btn-secondary"
                            aria-label="Close"
                            onClick={showExitAlert}
                        >
                            <ArrowLeft className="me-2" />
                            मागे
                        </button>
                    </div>
                </div>

                {alertMessage && (
                    <div className="alert alert-success" role="alert">
                        Success
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="card">
                        <div className="card-body add-product mbgcolor">
                            <div className="accordion-card-one accordion" id="accordionExample">
                                {/* Transporters Information Section */}
                                <div className="accordion-item mbgcolor mb-3">
                                    <div className="accordion-header" id="headingOne">
                                        <div
                                            className=""
                                            data-bs-toggle="collapse"
                                            data-bs-target="#collapseOne, #collapseTwo, #collapseThree"
                                            aria-controls="collapseOne, collapseTwo, collapseThree"
                                        >
                                            <div className="addproduct-icon">
                                                <h5>
                                                    <Info className="add-info" />
                                                    <span>वाहकांची माहिती</span>
                                                </h5>
                                                <Link to="#">
                                                    <ChevronDown className="chevron-down-add" />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        id="collapseOne"
                                        className="accordion-collapse collapse show "
                                        aria-labelledby="headingOne"
                                        data-bs-parent="#accordionExample"
                                    >
                                        <div className="accordion-body ">
                                            <div className="row">
                                                <div className="col-lg-6 col-sm-6 col-12">
                                                    <div className="">
                                                        <label className="form-label required">पूर्ण नाव</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            name="TNAME"
                                                            value={formData.TNAME}
                                                            onChange={handleChange}
                                                            ref={TNAMERef}
                                                            onKeyDown={(e) => handleKeyDown(e, TCANTACTNORef)}
                                                            required
                                                            title="फक्त अक्षरे आणि जागा अनुमत आहेत"
                                                            pattern="[A-Za-z ]+"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-lg-2 col-sm-6 col-12">
                                                    <div className="mb-3 ">
                                                        <label className="form-label required">मोबाईल क्रमांक</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            name="TCANTACTNO"
                                                            value={formData.TCANTACTNO}
                                                            onChange={handleChange}
                                                            ref={TCANTACTNORef}
                                                            onKeyDown={(e) => handleKeyDown(e, TDATERef)}
                                                            required
                                                            title="कृपया वैध १० अंकी मोबाईल नंबर प्रविष्ट करा."
                                                            pattern="^[0-9]{10}$"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-lg-2 col-sm-6 col-12">
                                                    <div className="mb-3 ">
                                                        <label className="form-label "> दिनांक</label>
                                                        <input
                                                            type="date"
                                                            className="form-control"
                                                            name="TDATE"
                                                            value={formData.TDATE}
                                                            onChange={handleChange}
                                                            onKeyDown={(e) => handleKeyDown(e, TBIRTHDATERef)}
                                                            ref={TDATERef}

                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-lg-2 col-sm-6 col-12">
                                                    <div className="mb-3 ">
                                                        <label className="form-label ">जन्म दिनांक</label>
                                                        <input
                                                            type="date"
                                                            className="form-control"
                                                            name="TBIRTHDATE"
                                                            value={formData.TBIRTHDATE}
                                                            onChange={handleChange}
                                                            onKeyDown={(e) => handleKeyDown(e, TPANRef)}
                                                            ref={TBIRTHDATERef}

                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Address Information Section */}
                                <div className="accordion-item mbgcolor">
                                    <div className="accordion-header" id="headingThree">
                                        <div
                                            className=""
                                            data-bs-toggle="collapse"
                                            data-bs-target="#collapseThree"
                                            aria-controls="collapseThree"
                                        >
                                            <div className="addproduct-icon">
                                                <h5>
                                                    <Info className="add-info" />
                                                    <span>पत्त्याची माहिती</span>
                                                </h5>
                                                <Link to="#">
                                                    <ChevronDown className="chevron-down-add" />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        id="collapseThree"
                                        className="accordion-collapse collapse show"
                                        aria-labelledby="headingThree"
                                        data-bs-parent="#accordionExample"
                                    >
                                        <div className="accordion-body mbgcolor">
                                            <div className="row">
                                                <div className="col-lg-2 col-sm-6 col-12">
                                                    <div className="">
                                                        <label className="form-label required">पिनकोड</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            placeholder="Enter Pin Code"
                                                            name="TPINCODE"
                                                            value={formData.TPINCODE}
                                                            onChange={handleChange}
                                                            ref={TPINCODERef}
                                                            pattern="^\d{6}$"
                                                            title="कृपया वैध ६ अंकी पिन कोड प्रविष्ट करा"
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-lg-2 col-sm-6 col-12">
                                                    <div className="input-blocks add-product">
                                                        <label className="form-label">राज्य</label>
                                                        <Select
                                                            classNamePrefix="react-select"
                                                            name="TSTATE"
                                                            options={statetype}
                                                            onChange={handleSelectChange}
                                                            value={statetype.find((option) => option.value === formData.TSTATE) || null}
                                                            placeholder="Choose"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-lg-2 col-sm-6 col-12">
                                                    <div className="input-blocks add-product">
                                                        <label className="form-label">शहर</label>
                                                        <Select
                                                            classNamePrefix="react-select"
                                                            name="TCITY"
                                                            options={sellingtype}
                                                            onChange={handleSelectChange}
                                                            value={sellingtype.find((option) => option.value === formData.TCITY) || null}
                                                            placeholder="Choose"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-lg-6 col-sm-6 col-12">
                                                    <div className="mb-3 ">
                                                        <label className="form-label">पत्ता</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            name="TADDRESS"
                                                            value={formData.TADDRESS}
                                                            onChange={handleChange}
                                                            ref={TADDRESSRef}
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            </div>


                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="accordion-header" id="headingThree">
                                <div
                                    className=""
                                    data-bs-toggle="collapse"
                                    data-bs-target="#collapseThree"
                                    aria-controls="collapseThree"
                                >
                                    <div className="addproduct-icon">
                                        <h5>
                                            <Info className="add-info" />
                                            <span>कुटुंबाची माहिती</span>
                                        </h5>
                                        <Link to="#">
                                            <ChevronDown className="chevron-down-add" />
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            <div className="border p-3 rounded shadow-sm mb-2">
                                <div className="row mt-0 mb-2 ">
                                    <div className="row">
                                        <div className="col-lg-5 col-md-6 col-sm-12">
                                            <div className="mb-0 add-product form-label">
                                                <label className="form-label">पूर्ण नाव</label>
                                                <input
                                                    type="text"
                                                    className="form-control no-arrows"
                                                    name="FDNAME"
                                                    value={detailData.FDNAME}
                                                    onChange={handleInputChange}

                                                />
                                            </div>
                                        </div>
                                        <div className="col-lg-2 col-sm-6 col-12">
                                            <div className="mb-0 add-product form-label">
                                                <label className="form-label"> मोबाईल क्रमांक</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="FDCONTACT"
                                                    value={detailData.FDCONTACT}
                                                    onChange={handleInputChange}

                                                />
                                            </div>
                                        </div>
                                        <div className="col-lg-2 col-sm-6 col-12">
                                            <div className="mb-0 add-product form-label">
                                                <label className="form-label">जन्मदिनांक</label>
                                                <input
                                                    type="date"
                                                    className="form-control"
                                                    name="FDBIRTHDATE"
                                                    value={detailData.FDBIRTHDATE}
                                                    onChange={handleInputChange}

                                                />
                                            </div>
                                        </div>


                                        <div className="col-lg-2 col-md-4 col-sm-12">
                                            <div className="mb-0 add-product form-label">
                                                <label className="form-label">नातेसंबंध</label>
                                                <Select
                                                    classNamePrefix="react-select"
                                                    name="FDRELATION"
                                                    options={relation}
                                                    placeholder="Choose"
                                                    value={relation.find((option) => option.value === detailData.FDRELATION) || null}
                                                    onChange={updateRelation}

                                                />
                                            </div>
                                        </div>



                                        <div className="col-lg-1 col-md-6 col-sm-12 d-flex align-items-center mt-4">
                                            <button
                                                type="button"
                                                className="btn btn-submit"
                                                onClick={handleAddDetail}
                                            >
                                                Add
                                            </button>
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
                                                            <th className="col-3" style={{ position: 'sticky', top: 0 }}>पूर्ण नाव</th>
                                                            <th className="col-1" style={{ position: 'sticky', top: 0 }}>जन्मदिनांक</th>
                                                            <th className="col-1" style={{ position: 'sticky', top: 0 }}>नातेसंबंध</th>
                                                            <th className="col-1" style={{ position: 'sticky', top: 0 }}>मोबाईल क्रमांक

                                                            </th>
                                                            <th className="col-1" style={{ position: 'sticky', top: 0 }}>Actions</th>
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
                                                                <td colSpan="12">No data available</td>
                                                            </tr>
                                                        )}


                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="accordion-header" id="headingThree">
                                <div
                                    className=""
                                    data-bs-toggle="collapse"
                                    data-bs-target="#collapseThree"
                                    aria-controls="collapseThree"
                                >
                                    <div className="addproduct-icon">
                                        <h5>
                                            <Info className="add-info" />
                                            <span>वाहनाची माहिती</span>
                                        </h5>
                                        <Link to="#">
                                            <ChevronDown className="chevron-down-add" />
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            <div className="border p-3 rounded shadow-sm mb-2">
                                <div className="row mt-0 ">
                                    <div className="row">
                                        <div className="col-lg-3 col-sm-6 col-12">
                                            <div className="mb-3 ">
                                                <label className="form-label required">वाहन क्रमांक</label>
                                                <input
                                                    type="text"
                                                    className="form-control "
                                                    name="VNO"
                                                    value={VehicalDetails.VNO}
                                                    onChange={(e) => {
                                                        let inputValue = e.target.value.toUpperCase();

                                                        if (!inputValue.startsWith("MH")) {
                                                            inputValue = "MH" + inputValue.replace(/^MH\s*/, "");
                                                        }

                                                        inputValue = inputValue.replace(/\s+/g, "").replace(/\//g, "");

                                                        handleVehicalChange({ target: { name: "VNO", value: inputValue } });
                                                    }}
                                                    onKeyDown={(e) => handleKeyDown(e, VEHICALTYPERef)}


                                                />
                                            </div>
                                        </div>

                                        <div className="col-lg-3 col-sm-6 col-12">
                                            <div className="mb-3 ">
                                                <label className="form-label">वाहन प्रकार</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="VTYPE"
                                                    value={VehicalDetails.VTYPE}
                                                    onChange={handleInputChange}
                                                    // onKeyDown={(e) => handleKeyDown(e, VEHICALCAPACITYRef)}
                                                    ref={VEHICALTYPERef}
                                                />
                                            </div>
                                        </div>



                                        <div className="col-lg-2 col-sm-6 col-12">
                                            <div className="mb-3 ">
                                                <label className="form-label">वाहन क्षमता (जाळी)</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="VCAPACITY"
                                                    value={VehicalDetails.VCAPACITY}
                                                    onChange={handleInputChange}

                                                    pattern="^[0-9]+$"
                                                    title="कृपया फक्त संख्या भरा"
                                                />
                                            </div>
                                        </div>




                                        <div className="col-lg-1 col-md-6 col-sm-12 d-flex align-items-center">
                                            <button
                                                type="button"
                                                className="btn btn-submit"
                                                onClick={handleAddVehical}
                                            >
                                                Add
                                            </button>
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
                                                            <th className="col-3" style={{ position: 'sticky', top: 0 }}>वाहन क्रमांक</th>
                                                            <th className="col-1" style={{ position: 'sticky', top: 0 }}>वाहन प्रकार</th>
                                                            <th className="col-1" style={{ position: 'sticky', top: 0 }}>वाहन क्षमता (जाळी)</th>
                                                            <th className="col-1" style={{ position: 'sticky', top: 0 }}>Actions</th>
                                                        </tr>
                                                    </thead>

                                                    <tbody>
                                                        {Vdata.filter((row) => row.isdeleted == 0 || row.isdeleted == false).length > 0 ? (
                                                            Vdata
                                                                .filter((row) => row.isdeleted == 0)
                                                                .map((row, index) => (
                                                                    <tr key={row.vdaid || index}>
                                                                        <td>{row.VNO}</td>
                                                                        <td>{row.VTYPE}</td>
                                                                        <td>{row.VCAPACITY}</td>

                                                                        <td>
                                                                            <Link
                                                                                to="#"
                                                                                onClick={() => handleVehicalEdit(row.vdaid)}
                                                                                className="me-2 p-1"
                                                                                style={{ color: 'lightblue' }}
                                                                            >
                                                                                <Edit className="feather-edit" />
                                                                            </Link>
                                                                            <Link
                                                                                className="confirm-text p-2"
                                                                                to="#"
                                                                                onClick={() => handleVehicalDelete(row.vdaid)}
                                                                            >
                                                                                <Trash2 className="feather-trash-2 text-danger" />
                                                                            </Link>
                                                                        </td>
                                                                    </tr>
                                                                ))
                                                        ) : (
                                                            <tr>
                                                                <td colSpan="4">No data available</td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Action buttons */}
                            <div className="col-lg-12">
                                <div className="btn-addproduct mb-4">
                                    <button type="button" onClick={showExitAlert} className="btn btn-cancel me-2">
                                        मागे
                                    </button>
                                    <button type="submit" className="btn btn-submit">
                                        सेव्ह
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>


            </div>
        </div>
    );
};

export default AddTransporter;
