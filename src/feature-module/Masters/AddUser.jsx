import React, { useRef, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Select from "react-select";
import { all_routes } from "../../Router/all_routes";
import Addunits from "../../core/modals/inventory/addunits";
import AddCategory from "../../core/modals/inventory/addcategory";
import AddBrand from "../../core/modals/addbrand";
import { ACSPLGUID, baseUrl } from "../../core/json/custom";
import axios from 'axios';
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
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
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';
const AddUser = () => {
    const navigate = useNavigate();
    const route = all_routes;
    const dispatch = useDispatch();
    const GUID = ACSPLGUID.getNew()
    const location = useLocation();
    const { UAID } = location.state || {};

    const data = useSelector((state) => state.toggle_header);
    const [implications, setImplications] = useState([]);
    const [company, setcompany] = useState([]);
    const [departmentdata, setdepartmentdata] = useState([]);
    const [warehousedata, setwarehousedata] = useState([]);
    const [Users, setUsers] = useState([]);
    const [Userrole, setUserrole] = useState([]);
    const [Accsessrights, setAccsessrights] = useState([]);
    const companyRef = useRef(null);
    const storeRef = useRef(null);
    const warehouseRef = useRef(null);
    const roleRef = useRef(null);
    const mobileNumberRef = useRef(null);
    const emailAddressRef = useRef(null);
    const passwordRef = useRef(null);
    const accessPolicyRef = useRef(null);
    const registrationDateRef = useRef(null);
    const forenameRef = useRef(null);
    const statusIdRef = useRef(null);

    const renderCollapseTooltip = (props) => (
        <Tooltip id="refresh-tooltip" {...props}>
            Collapse
        </Tooltip>
    );
    const { userdetail } = getUserData();
    const [formData, setFormData] = useState({
        storeId: "",
        companyId: "",
        warehouseId: "",
        roleId: "",
        forename: "",
        description: "",
        emailAddress: "",
        mobileNumber: "",
        password: "",
        accessPolicy: [],
        accessDays: [],
        accessTimeStart: '00:00 AM',
        accessTimeEnd: '00:00 AM',
        expiryDate: "",
        lastLoginDateTime: "",
        registrationDate: "",
        loginCount: "",
        statusId: "",
    });

    useEffect(() => {
        const handleShortcut = (e) => {
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                handleSubmit(e)
            }
            if (e.ctrlKey && e.key === 'e') {
                e.preventDefault();
                showExitAlert();
            }
        };

        window.addEventListener('keydown', handleShortcut);

        return () => {
            window.removeEventListener('keydown', handleShortcut);
        };
    }, [navigate]);


    useEffect(() => {
        const fetchImplications = async () => {
            try {
                const response = await axios.get(baseUrl.Url + "/backend/api/implications");
                if (response.status !== 200) throw new Error("Failed to fetch implications data");
                const data = response.data;
                const USTATUSData = data
                    .filter((item) => item.iGroup === "USTATUS")
                    .map(({ iTitle, iValue }) => ({
                        label: iTitle,
                        value: iValue,
                    }));

                // const USTATUSData = data.filter(item => item.iGroup === "USTATUS");
                // .map(({ iTitle, iValue }) => ({
                //     label: iTitle,
                //     value: iValue,
                // }));
                setImplications(USTATUSData);
                console.log("Filtered USTATUSData Data:", USTATUSData);
                setFormData(prev => ({
                    ...prev,
                    statusId: USTATUSData.find(item => item.value === formData.statusId)?.value || '',
                }));
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        const fetchcompany = async () => {
            try {
                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };

                const response = await axios({
                    method: "POST",
                    url: baseUrl.Url + "/backend/api/GET_CompanyDropdown",
                    headers: headers,
                });

                if (response.status === 200) {
                    const data = response.data;
                    const districtdata = data
                        .map(({ cname, companyid }) => ({
                            label: cname,
                            value: companyid,
                        }));
                    setcompany(districtdata)
                    setFormData(prev => ({
                        ...prev,
                        companyId: districtdata.find(item => item.value === formData.companyId)?.value || '',
                    }));
                } else {
                    console.error("Failed to fetch district and state for the pincode");
                }
            } catch (error) {
                console.error("Error fetching district and state data:", error);
            }
        }
        const fetchACCSESSRIGHT = async () => {
            try {
                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };


                const response = await axios({
                    method: "POST",
                    url: baseUrl.Url + "/backend/api/GET_ACCSESSRIGHTDropdown",
                    headers: headers,
                });

                if (response.status === 200) {
                    const data = response.data;
                    const districtdata = data
                        .map(({ accessRightTitle, accessRightID }) => ({
                            label: accessRightID,
                            value: accessRightID,
                            title: accessRightTitle
                        }));
                    setAccsessrights(districtdata)
                    setFormData(prev => ({
                        ...prev,
                        accessPolicy: districtdata.find(item => item.value === formData.accessPolicy)?.value || '',
                    }));

                } else {
                    console.error("Failed to fetch district and state for the pincode");
                }
            } catch (error) {
                console.error("Error fetching district and state data:", error);
            }
        }
        const fetchdepartment = async () => {
            try {
                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };
                const payload = {
                    "companyid": userdetail?.companyID ? userdetail.companyID : ""
                };

                const response = await axios({
                    method: "POST",
                    url: baseUrl.Url + "/backend/api/GET_DepartmentName",
                    headers: headers,
                    data: JSON.stringify(payload),
                });

                if (response.status === 200) {
                    const data = response.data;
                    const departmentdata = data
                        .map(({ dname, deptaid }) => ({
                            label: dname,
                            value: deptaid,
                        }));
                    setdepartmentdata(departmentdata);
                    setFormData(prev => ({
                        ...prev,
                        storeId: departmentdata.find(item => item.value === formData.storeId)?.value || '',
                    }));
                } else {
                    console.error("Failed to fetch district and state for the pincode");
                }
            } catch (error) {
                console.error("Error fetching district and state data:", error);
            }
        }
        const fetchdwarehouse = async () => {
            try {
                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };
                const payload = {
                    "companyid": userdetail?.companyID ? userdetail.companyID : "",
                    "deptid": userdetail?.departmentID ? userdetail.departmentID : "",
                };
                const response = await axios({
                    method: "POST",
                    url: baseUrl.Url + "/backend/api/WAREHOUSENAME",
                    headers: headers,
                    data: JSON.stringify(payload),
                });

                if (response.status === 200) {
                    const data = response.data;
                    const warehousedata = data
                        .map(({ wname, waid }) => ({
                            label: wname,
                            value: waid,
                        }));
                    setwarehousedata(warehousedata);
                    setFormData(prev => ({
                        ...prev,
                        warehouseId: warehousedata.find(item => item.value === formData.warehouseId)?.value || '',
                    }));
                } else {
                    console.error("Failed to fetch district and state for the pincode");
                }
            } catch (error) {
                console.error("Error fetching district and state data:", error);
            }
        }
        const fetchdusers = async () => {
            try {
                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };
                const payload = {
                    "companyid": userdetail?.companyID ? userdetail.companyID : "",
                    "deptid": userdetail?.departmentID ? userdetail.departmentID : "",
                };
                const response = await axios({
                    method: "POST",
                    url: baseUrl.Url + "/backend/api/GET_EMPLOYEE",
                    headers: headers,
                    data: JSON.stringify(payload),
                });

                if (response.status === 200) {
                    const data = response.data;
                    const warehousedata = data
                        .map(({ empname, empid }) => ({
                            label: empname,
                            value: empid,
                        }));
                    setUsers(warehousedata);
                    setFormData(prev => ({
                        ...prev,
                        forename: warehousedata.find(item => item.value === formData.forename)?.value || '',
                    }));
                } else {
                    console.error("Failed to fetch district and state for the pincode");
                }
            } catch (error) {
                console.error("Error fetching district and state data:", error);
            }
        }
        const fetchdesignation = async () => {
            try {
                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };
                const payload = {
                    "companyid": userdetail?.companyID ? userdetail.companyID : "",
                    "deptid": userdetail?.departmentID ? userdetail.departmentID : "",
                };
                const response = await axios({
                    method: "POST",
                    url: baseUrl.Url + "/backend/api/GET_DesignationDropdown",
                    headers: headers,
                    data: JSON.stringify(payload),
                });

                if (response.status === 200) {
                    const data = response.data;
                    const warehousedata = data
                        .map(({ dname, daid }) => ({
                            label: dname,
                            value: daid,
                        }));
                    setUserrole(warehousedata);
                    setFormData(prev => ({
                        ...prev,
                        roleId: warehousedata.find(item => item.value === formData.roleId)?.value || '',
                    }));

                } else {
                    console.error("Failed to fetch district and state for the pincode");
                }
            } catch (error) {
                console.error("Error fetching district and state data:", error);
            }
        }

        fetchACCSESSRIGHT();
        fetchdesignation();
        fetchdusers();
        fetchdwarehouse();
        fetchdepartment();
        fetchcompany();
        fetchImplications();
    }, []);


    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const payload = {
    //                 "uaid": UAID || GUID,
    //                 // "companyid": userdetail?.companyID || "",
    //                 // "deptid": userdetail?.departmentID || "",
    //             };

    //             const headers = {
    //                 "Content-Type": "application/json",
    //                 Accept: "*/*",
    //             };

    //             const response = await axios.post(
    //                 baseUrl.Url + "/backend/api/_GET_UserMasters_/getByID",
    //                 JSON.stringify(payload),
    //                 { headers }
    //             );

    //             if (response.status !== 200) throw new Error("Failed to fetch data");

    //             const UAIDdata = response.data[0];

    //             setFormData(prev => ({
    //                 ...prev,
    //                 companyId: company.find(item => item.value === UAIDdata.ucompanyid)?.value || '',
    //                 storeId: departmentdata.find(item => item.value === UAIDdata.ustoreid)?.value || '',
    //                 warehouseId: warehousedata.find(item => item.value === UAIDdata.uwarehouseid)?.value || '',
    //                 roleId: Userrole.find(item => item.value === UAIDdata.uroleid)?.value || '',
    //                 forename: Users.find(item => item.value === UAIDdata.uforename)?.value || '',
    //                 description: UAIDdata.udescription,
    //                 emailAddress: UAIDdata.uemailaddress,
    //                 mobileNumber: UAIDdata.umobilenumber,
    //                 password: UAIDdata.upassword,
    //                 accessPolicy: Accsessrights.find(item => item.value === UAIDdata.uaccesspolicy?.split(",") || [])?.value || '',
    //                 accessDays: UAIDdata.uaccessdays?.split(",") || [],
    //                 accessTimeStart: UAIDdata.uaccesstimestart,
    //                 accessTimeEnd: UAIDdata.uaccesstimeend,
    //                 expiryDate: UAIDdata.uexpirydate,
    //                 lastLoginDateTime: UAIDdata.ulastlogindatetime,
    //                 registrationDate: UAIDdata.uregistrationdate,
    //                 loginCount: UAIDdata.ulogincount,
    //                 statusId: implications.find(item => item.value === UAIDdata.ustatusid)?.value || '',
    //             }));
    //         } catch (error) {
    //             console.error("Error fetching User data:", error);
    //         }
    //     };

    //     if (UAID) fetchData();
    // }, [UAID]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Adding padding for month
        const day = String(date.getDate()).padStart(2, '0'); // Adding padding for day
        return `${year}-${month}-${day}`;
    };


    useEffect(() => {
        if (!UAID) return;

        const fetchMasterData = async () => {
            try {
                // Make sure dropdown options are already loaded
                if (!company || !Userrole || !warehousedata || !Users || !implications || !departmentdata) {
                    console.warn("Dropdown options not yet loaded");
                    return;
                }

                const payload1 = {
                    uaid: UAID || GUID,
                    keyword: "%",
                };

                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };

                const response = await axios.post(
                    `${baseUrl.Url}/backend/api/_GET_UserMasters_/getByID`,
                    payload1,
                    { headers }
                );

                if (response.status !== 200) throw new Error("Failed to fetch data");

                let apiData = response.data[0];

                setFormData((prev) => ({
                    ...prev,
                    companyId: apiData.ucompanyid,
                    storeId: apiData.ustoreid,
                    warehouseId: apiData.uwarehouseid,
                    roleId: apiData.uroleid,
                    forename: apiData.uforename,
                    description: apiData.udescription,
                    emailAddress: apiData.uemailaddress,
                    mobileNumber: apiData.umobilenumber,
                    password: apiData.upassword,
                    accessDays: apiData.uaccessdays?.split(",") || [],
                    accessPolicy: apiData.uaccesspolicy?.split(",") || [],
                    accessTimeStart: apiData.uaccesstimestart,
                    accessTimeEnd: apiData.uaccesstimeend,
                    expiryDate: formatDate(apiData.uexpirydate),
                    lastLoginDateTime: formatDate(apiData.ulastlogindatetime),
                    registrationDate: formatDate(apiData.uregistrationdate),
                    loginCount: apiData.ulogincount,
                    statusId: apiData.ustatusid,
                }));

                console.log("Master Data:", apiData);
            } catch (error) {
                console.error("Error in Master API Call:", error);
            }
        };

        fetchMasterData();
    }, [UAID, company, Userrole, warehousedata, Users, implications, departmentdata]);



    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };
    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);
        handleInputChange("password", value);
    };

    const handleConfirmPasswordChange = (e) => {
        const confirmPass = e.target.value;
        setConfirmPassword(confirmPass);
        if (confirmPass !== password) {
            setError('Passwords do not match');
        } else {
            setError('');
        }
    };

    const handleInputChange = (field, value) => {
        setFormData(prevState => {
            let updatedValue;

            if (Array.isArray(value)) {
                // If value is an array, map its items to extract 'value' property
                updatedValue = value.map(item => item.value);
            } else if (value?.value !== undefined) {
                updatedValue = value.value;
            } else if (value?.target?.value !== undefined) {
                updatedValue = value.target.value;
            } else {
                updatedValue = value;
            }

            return {
                ...prevState,
                [field]: updatedValue
            };
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        showConfirmationAlert(event);
    };

    const handleFormSubmission = async () => {
        try {

            const payload = {
                "uaid": UAID ? UAID : GUID,
                "ucompanyid": formData.companyId,
                "ubranchid": "",
                "upacsid": "",
                "ustoreid": formData.storeId,
                "uwarehouseid": formData.warehouseId,
                "uroleid": formData.roleId,
                "utitle": "",
                "uforename": formData.forename,
                "udescription": formData.description,
                "uemailaddress": formData.emailAddress,
                "umobilenumber": formData.mobileNumber,
                "upassword": password,
                "ugroup": "",
                "uaccesspolicy": formData.accessPolicy.join(","),
                "uaccessdays": formData.accessDays.join(","),
                "uaccesstimestart": formData.accessTimeStart,
                "uaccesstimeend": formData.accessTimeEnd,
                "uregistrationdate": formData.registrationDate,
                "uexpirydate": formData.expiryDate,
                "ureferencekey": "",
                "uloginkey": "",
                "ulogintype": "",
                "ulastlogindatetime": formData.lastLoginDateTime,
                "ulogincount": formData.loginCount,
                "ustatusid": String(formData.statusId || ""),
                "ugoogleclientid": "",
                "ufacebookclientid": "",
                "uapplicationkey": "",
                "uapplicationdate": "",
                "uapplicationhome": "",
                "ulanguageid": ""
            };

            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            axios({
                method: "POST",
                url: baseUrl.Url + "/backend/api/UserMasters",
                data: JSON.stringify(payload),
                headers: headers,
            })
            Swal.fire({
                icon: "success",
                title: "संचित झाले!",
                text: "माहिती यशस्वीरित्या जतन झाली.",
                confirmButtonText: "ठीक आहे",
                allowOutsideClick: false,
                allowEscapeKey: false,
            });
            navigate(route.UserMaster);
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


    const [days, setdays] = useState([]);

    useEffect(() => {
        const fetchDays = async () => {
            try {
                const response = await axios.get(
                    baseUrl.Url + "/backend/api/Implications/WEEKOFF",

                );

                if (response.status !== 200) throw new Error("Failed to fetch implications data");

                const data = response.data;
                const implicationsDropdown = data.map(({ iTitle, iValue }) => ({
                    label: iTitle,
                    value: iValue,
                }));

                setdays(implicationsDropdown);
            } catch (error) {
                console.error("Error fetching implications:", error);
            }
        };


        fetchDays()

    }, []);


    const MySwal = withReactContent(Swal);

    const showConfirmationAlert = (event) => {
        MySwal.fire({
            title: "तुम्हाला खात्री आहे का?",
            text: "तुम्हाला डेटाला सेव्ह करायचं आहे का?",
            showCancelButton: true,
            confirmButtonColor: "#00ff00",
            confirmButtonText: "सेव्ह करा",
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
            title: "आपण खात्रीने?",
            text: "आपण बाहेर पडू इच्छिता?",
            showCancelButton: true,
            confirmButtonColor: "#00ff00",
            confirmButtonText: "होय",
            cancelButtonColor: "#092C4C",
            cancelButtonText: "नाही",
            allowOutsideClick: false,
            allowEscapeKey: false,
        }).then((result) => {
            if (result.isConfirmed) {
                navigate(route.UserMaster)
            }
        });
    };

    const customStyles = {
        control: (provided) => ({
            ...provided,
            maxHeight: "50px",
            overflowY: "auto",
        }),
        multiValue: (provided) => ({
            ...provided,
            maxWidth: "100%",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
        }),
        menu: (provided) => ({
            ...provided,
            zIndex: 1050,
        }),
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


    const checkFormValidity = (e) => {
        const {
            companyId,
            storeId,
            warehouseId,
            roleId,
            forename,
            mobileNumber,
            emailAddress,
            password,
            accessPolicy,
            registrationDate,
            statusId


        } = formData;

        if (!companyId) {
            Swal.fire({
                icon: "error",
                title: "त्रुटी ",
                text: "कंपनी आवश्यक आहे",
                allowOutsideClick: false,
                allowEscapeKey: false,
            }).then(() => {
                companyRef.current.focus();
            });
            return;
        }


        if (!storeId) {
            Swal.fire({
                icon: "error",
                title: "त्रुटी ",
                text: " विभाग आवश्यक आहे",
                allowOutsideClick: false,
                allowEscapeKey: false,
            }).then(() => {
                storeRef.current.focus();
            });
            return;
        }
        if (!warehouseId) {
            Swal.fire({
                icon: "error",
                title: "त्रुटी ",
                text: " गोदाम आवश्यक आहे",
                allowOutsideClick: false,
                allowEscapeKey: false,
            }).then(() => {
                warehouseRef.current.focus();
            });
            return;
        }

        if (!roleId) {
            Swal.fire({
                icon: "error",
                title: "त्रुटी ",
                text: "वापरकर्ता भूमिका आवश्यक आहे",
                allowOutsideClick: false,
                allowEscapeKey: false,
            }).then(() => {
                roleRef.current.focus();
            });
            return;
        }

        if (!forename) {
            Swal.fire({
                icon: "error",
                title: "त्रुटी ",
                text: "वापरकर्त्याचे नाव आवश्यक आहे",
                allowOutsideClick: false,
                allowEscapeKey: false,
            }).then(() => {
                forenameRef.current.focus();
            });
            return;
        }

        if (!mobileNumber) {
            Swal.fire({
                icon: "error",
                title: "त्रुटी ",
                text: "फोन नंबर आवश्यक आहे",
                allowOutsideClick: false,
                allowEscapeKey: false,
            }).then(() => {
                mobileNumberRef.current.focus();
            });
            return;
        }
        if (formData.emailAddress.includes(" ")) {
            Swal.fire({
                icon: "error",
                title: "Validation Error",
                text: "यूजरनेम मध्ये  रिकाम्या जागा (space) असू शकत नाहीत",
                allowOutsideClick: false,
                allowEscapeKey: false,
            }).then(() => {
                emailAddressRef.current.focus();
            });
        }

        if (!emailAddress) {
            Swal.fire({
                icon: "error",
                title: "त्रुटी ",
                text: "ईमेल आवश्यक आहे",
                allowOutsideClick: false,
                allowEscapeKey: false,
            }).then(() => {
                emailAddressRef.current.focus();
            });
            return;
        }


        if (!password) {
            Swal.fire({
                icon: "error",
                title: "त्रुटी",
                text: "पासवर्ड आवश्यक आहे",
                allowOutsideClick: false,
                allowEscapeKey: false,
            }).then(() => {
                passwordRef.current.focus();
            });
            return;
        }

        if (!accessPolicy) {
            Swal.fire({
                icon: "error",
                title: "त्रुटी ",
                text: "प्रवेश नियम आवश्यक आहे",
                allowOutsideClick: false,
                allowEscapeKey: false,
            }).then(() => {
                accessPolicyRef.current.focus();
            });
            return;
        }

        if (!registrationDate) {
            Swal.fire({
                icon: "error",
                title: "त्रुटी ",
                text: "नोंदणी तारीख आवश्यक आहे",
                allowOutsideClick: false,
                allowEscapeKey: false,
            }).then(() => {
                registrationDateRef.current.focus();
            });
            return;
        }


        if (!statusId) {
            Swal.fire({
                icon: "error",
                title: "त्रुटी",
                text: "स्थिती आवश्यक आहे",
                allowOutsideClick: false,
                allowEscapeKey: false,
            }).then(() => {
                statusIdRef.current.focus();
            });
            return;
        }



        handleSubmit(e);
    };


    return (
        <div className="page-wrapper">
            <div className="content">
                <div className="page-header">
                    <div className="add-item d-flex">
                        <div className="page-title">
                            <h4> नवीन वापरकर्ता</h4>
                            <h6>नवीन वापरकर्त्याची नोंद करा</h6>
                        </div>
                    </div>
                    <ul className="table-top-head">
                        <li>
                            <div className="page-btn">
                                <Link to={route.UserMaster} className="btn btn-secondary">
                                    <ArrowLeft className="me-2" />
                                    वापरकर्त्याकडे परत जा
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

                                                    <span>वापरकर्त्याची माहिती</span>
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
                                                <div className="col-lg-6 col-sm-6 col-12">
                                                    <div className="mb-3 add-User">
                                                        <label className="form-label required">कंपनी</label>
                                                        <Select
                                                            classNamePrefix="react-select"
                                                            value={company.find(option => option.value === formData.companyId)}
                                                            options={company}
                                                            placeholder="Choose"
                                                            onChange={(value) => handleInputChange("companyId", value)}
                                                            required
                                                            openMenuOnFocus={true}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-6 col-sm-6 col-12">
                                                    <div className="mb-3 add-User">
                                                        <label className="form-label required">विभाग</label>
                                                        <Select
                                                            classNamePrefix="react-select"
                                                            value={departmentdata.find(option => option.value === formData.storeId)}
                                                            options={departmentdata}
                                                            placeholder="Choose"
                                                            onChange={(value) => handleInputChange("storeId", value)}
                                                            required
                                                            openMenuOnFocus={true}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                {/* <div className="col-lg-6 col-sm-6 col-12">
                                                    <div className="mb-3 add-User">
                                                        <label className="form-label required">Department</label>
                                                        <Select
                                                            classNamePrefix="react-select"
                                                            value={Store.find(option => option.value === formData.storeId)}
                                                            options={Store}
                                                            placeholder="Choose"
                                                            onChange={(value) => handleInputChange("storeId", value)}
                                                            required
                                                        />
                                                    </div>
                                                </div> */}
                                                <div className="col-lg-6 col-sm-6 col-12">
                                                    <div className="mb-3 add-User">
                                                        <label className="form-label">गोदाम</label>
                                                        <Select
                                                            classNamePrefix="react-select"
                                                            options={warehousedata}
                                                            value={warehousedata.find(option => option.value === formData.warehouseId)}
                                                            placeholder="Choose"
                                                            openMenuOnFocus={true}
                                                            onChange={(value) => handleInputChange("warehouseId", value)}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-lg-6 col-sm-6 col-12">
                                                    <div className="mb-3 add-User">
                                                        <label className="form-label">वापरकर्ता भूमिका</label>
                                                        {/* <Select
                                                            classNamePrefix="react-select"
                                                            value={Role.find(option => option.value === formData.roleId)}
                                                            options={Role}
                                                            placeholder="Choose"
                                                            onChange={(value) => handleInputChange("roleId", value)}
                                                        /> */}
                                                        <Select
                                                            classNamePrefix="react-select"
                                                            value={Userrole.find(option => option.value === formData.roleId)}
                                                            options={Userrole}
                                                            placeholder="Choose"
                                                            openMenuOnFocus={true}
                                                            onChange={(value) => handleInputChange("roleId", value)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-lg-12 col-sm-12 col-12">
                                                    <div className="mb-3 add-User">
                                                        <label className="form-label required">वापरकर्त्याचे नाव</label>
                                                        {/* <input
                                                            type="text"
                                                            className="form-control"
                                                            value={formData.forename || ""}
                                                            required
                                                            pattern="^[a-zA-Z\s]+$"
                                                            onChange={(value) => handleInputChange("forename", value)}
                                                        /> */}
                                                        <Select
                                                            classNamePrefix="react-select"
                                                            value={Users.find(option => option.value === formData.forename) || null}
                                                            options={Users}
                                                            openMenuOnFocus={true}
                                                            placeholder="Choose"
                                                            onChange={(value) => handleInputChange("forename", value)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-lg-6 col-sm-6 col-12">
                                                    <div className="mb-3 add-User">
                                                        <label className="form-label required">फोन नंबर</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            value={formData.mobileNumber || ""}
                                                            required
                                                            pattern="^\d{10}$"
                                                            onChange={(value) => handleInputChange("mobileNumber", value)}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-lg-6 col-sm-6 col-12">
                                                    <div className="mb-3 add-User">
                                                        <label className="form-label required">यूजरनेम</label>
                                                        <input
                                                            type="input"
                                                            required
                                                            value={formData.emailAddress || ""}
                                                            className="form-control"
                                                            onChange={(e) => {
                                                                const value = e.target.value;
                                                                // Prevent spaces from being entered
                                                                if (!value.includes(" ")) {
                                                                    handleInputChange("emailAddress", value);
                                                                }
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-lg-6 col-sm-6 col-12">
                                                    <div className="mb-3 add-User">
                                                        {/* Password Input with Eye Icon */}
                                                        <label className="form-label required">पासवर्ड</label>
                                                        <div className="input-group">
                                                            <input
                                                                type={showPassword ? 'text' : 'password'}
                                                                className="form-control"
                                                                value={formData.password || ""}
                                                                required
                                                                // pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$"
                                                                onChange={(e) => {
                                                                    handlePasswordChange(e);
                                                                    handleInputChange("password", e.target.value);
                                                                }}
                                                                placeholder="Enter your password"
                                                            />
                                                            <span
                                                                className="input-group-text toggle-password"
                                                                onClick={handleTogglePassword}
                                                                style={{ cursor: 'pointer' }}
                                                            >
                                                                <i className={`fas ${showPassword ? 'fa-eye' : 'fa-eye-slash'}`} />
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="col-lg-6 col-sm-6 col-12">
                                                    <div className="mb-3 add-User">
                                                        <label className="form-label required">पासवर्ड खात्री करा</label>
                                                        <div className="input-group">
                                                            <input
                                                                type={showPassword ? 'text' : 'password'}
                                                                className="form-control"
                                                                value={formData.password || password}
                                                                required
                                                                onChange={handleConfirmPasswordChange}
                                                                pattern={formData.password}
                                                                placeholder="Confirm your password"
                                                            />
                                                            <span
                                                                className="input-group-text toggle-password"
                                                                onClick={handleTogglePassword}
                                                                style={{ cursor: 'pointer' }}
                                                            >
                                                                <i className={`fas ${showPassword ? 'fa-eye' : 'fa-eye-slash'}`} />
                                                            </span>
                                                        </div>
                                                        {/* Show error message if passwords don't match */}
                                                        {error && <div className="text-danger mt-2">{error}</div>}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-lg-12">
                                                <div className="">
                                                    <label className="form-label">वर्णन</label>
                                                    <textarea
                                                        className="form-control h-100"
                                                        rows={5}
                                                        value={formData.description || confirmPassword}
                                                        onChange={(value) => handleInputChange("description", value)}
                                                    />
                                                    <p className="mt-1">कमाल 60 शब्द</p>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-lg-6 col-sm-6 col-12">
                                                    <div className="mb-3 add-User">
                                                        <label className="form-label">वापरकर्ता दिवस</label>
                                                        <Select
                                                            classNamePrefix="react-select"
                                                            options={days}
                                                            value={days.filter(option => formData.accessDays?.includes(option.value))}
                                                            placeholder="Choose"
                                                            isMulti
                                                            openMenuOnFocus={true}
                                                            onChange={(selectedOptions) => handleInputChange("accessDays", selectedOptions)}
                                                            styles={customStyles}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-6 col-sm-6 col-12">
                                                    <div className="mb-3 add-User">
                                                        <label className="form-label required">प्रवेश नियम</label>
                                                        <Select
                                                            classNamePrefix="react-select"
                                                            options={Accsessrights}
                                                            value={
                                                                formData.accessPolicy && formData.accessPolicy.length > 0
                                                                    ? Accsessrights.filter(option => formData.accessPolicy.includes(option.value))
                                                                    : null
                                                            }
                                                            placeholder="Choose"
                                                            isMulti
                                                            openMenuOnFocus={true}
                                                            required
                                                            onChange={(selectedOptions) => handleInputChange("accessPolicy", selectedOptions)}
                                                            styles={customStyles}
                                                        />

                                                    </div>
                                                </div>

                                            </div>

                                            <div className="row">
                                                <div className="col-lg-3 col-sm-6 col-12">
                                                    <div className="mb-3 add-User">
                                                        <label className="form-label">लॉगिन सुरू वेळ</label>
                                                        <div className="input-group">
                                                            <TimePicker
                                                                onChange={(value) => handleInputChange('accessTimeStart', value)}
                                                                value={formData.accessTimeStart}
                                                                format="hh:mm a"
                                                                disableClock={true}
                                                                clearIcon={null}
                                                                className="form-control border-1"
                                                                clockIcon={null}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="col-lg-3 col-sm-6 col-12">
                                                    <div className="mb-3 add-User">
                                                        <label className="form-label">लॉगिन समाप्त वेळ</label>
                                                        <div className="input-group">
                                                            <TimePicker
                                                                onChange={(value) => handleInputChange('accessTimeEnd', value)}
                                                                value={formData.accessTimeEnd}
                                                                format="hh:mm a"
                                                                disableClock={true}
                                                                clearIcon={null}
                                                                className="form-control border-1"
                                                                clockIcon={null}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="col-lg-3 col-sm-6 col-12">
                                                    <div className="mb-3 add-User">
                                                        <label className="form-label required">नोंदणी तारीख</label>
                                                        <input
                                                            type="date"
                                                            required
                                                            value={formData.registrationDate || ""}
                                                            className="form-control"
                                                            onChange={(value) => handleInputChange("registrationDate", value)} />
                                                    </div>

                                                </div>

                                                <div className="col-lg-3 col-sm-6 col-12">
                                                    <div className="mb-3 add-User">
                                                        <label className="form-label">समाप्ती तारीख</label>
                                                        <input
                                                            type="date"
                                                            value={formData.expiryDate || ""}
                                                            className="form-control"
                                                            onChange={(value) => handleInputChange("expiryDate", value)} />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="row">
                                                <div className="col-lg-3 col-sm-6 col-12">
                                                    <div className="mb-3 add-User">
                                                        <label className="form-label">पूर्वीची लॉगिन तारीख</label>
                                                        <input
                                                            type="date"
                                                            className="form-control"
                                                            value={formData.lastLoginDateTime || ""}
                                                            onChange={(value) => handleInputChange("lastLoginDateTime", value)} />
                                                    </div>
                                                </div>

                                                <div className="col-lg-3 col-sm-6 col-12">
                                                    <div className="mb-3 add-User">
                                                        <label className="form-label">एकूण लॉगिन्स</label>
                                                        <input type="number" value={formData.loginCount || ""} className="form-control" onChange={(value) => handleInputChange("loginCount", value)} />
                                                    </div>
                                                </div>

                                                <div className="col-lg-6 col-sm-6 col-12">
                                                    <div className="mb-3 add-User">
                                                        <label className="form-label required">स्थिती</label>
                                                        <Select
                                                            id="statusId"
                                                            name="statusId"
                                                            classNamePrefix="react-select"
                                                            options={implications}
                                                            value={implications.find(option => option.value === formData.statusId)}
                                                            placeholder="Choose"
                                                            required
                                                            openMenuOnFocus={true}
                                                            onChange={(value) => handleInputChange("statusId", value)}
                                                        />
                                                        {/* <select
                                                            className="form-select"
                                                            id="statusId"
                                                            name="statusId"
                                                            value={formData.statusId || ""}
                                                            onChange={(e) => handleInputChange("statusId", e.target.value)}
                                                            required
                                                        >
                                                            <option value="">Select Status</option>
                                                            {implications.map((option) => (
                                                                <option key={option.value} value={option.value}>
                                                                    {option.label}
                                                                </option>
                                                            ))}
                                                        </select> */}


                                                        {/* <Select
                                                            classNamePrefix="react-select"
                                                            options={Status}
                                                            placeholder="Choose"
                                                            onChange={(value) => handleInputChange("statusId", value)}
                                                        /> */}
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
                                        बाहेर जा
                                    </button>
                                    <button type="submit" className="btn btn-submit" >
                                        जतन करा
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

export default AddUser;


