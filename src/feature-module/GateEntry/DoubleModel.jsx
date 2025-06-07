
import React, { useState, useEffect, useRef } from "react";
import Select from "react-select";
import { Link } from "react-router-dom";
import { MinusCircle, PlusCircle } from "react-feather";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { ACSPLGUID, baseUrl, convertToISODate } from "../../core/json/custom";
// import { ACSPLGUID, baseUrl, convertToISODate } from "../../core/json/custom";
import axios from "axios";
// import { all_routes } from '../../../Router/all_routes';
import { all_routes } from '../../Router/all_routes';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Trash2,
    Edit
} from "feather-icons-react/build/IconComponents";
import { v4 as uuidv4 } from 'uuid';
import { getUserData } from "../../Context/UserData";
import AddQuickFarmer from "./AddQuickFarmer";
import AddQuickTrasporter from "./AddQuickTrasporter";
function DoubleModel({ PKID }, { FAID, FNAME, FADHAR, FCONTACT }) {
    const userdetail = getUserData();
    const route = all_routes;
    const GUID = ACSPLGUID.getNew();
    const MySwal = withReactContent(Swal);
    const location = useLocation();
    const { DPKID } = location.state || {};
    const navigate = useNavigate();
    const [Crop_TYPE, setCrop_TYPE] = useState([]);

    const TOKANNORef = useRef(null);
    const DATERef = useRef(null);
    const VEHNORef = useRef(null);
    const FULLNAMERef = useRef(null);
    const MOBILENORef = useRef(null);
    const AADHARNORef = useRef(null);
    const VILLAGERef = useRef(null);
    const CROP_TYPERef = useRef(null);
    const CARETS_COUNTRef = useRef(null);
    const AddRef = useRef(null);
    const [latestToken, setLatestToken] = useState(0);
    const [rows, setRows] = useState([]);



    useEffect(() => {
        if (VEHNORef.current) {
            VEHNORef.current.focus();
        }
    }, []);

    const [formData, setFormData] = useState({
        PKID: '',
        DPKID: '',
        DATE: new Date().toISOString().split('T')[0],
        VEHNO: 'MH ',
        MOBILENO: '',
        AADHARNO: '',
        CROP_TYPE: '',

    });

    const [detailData, setDetailData] = useState({
        DPKID: '',
        PKID: '',
        MAID: '',
        TOKNNO: '',
        FULLNAME: '',
        CARETS_COUNT: '',
        VILLAGE: '',
        isdeleted: 0,

    });


    //Edit code
    useEffect(() => {
        if (!PKID) return;
        const fetchMasterData = async () => {
            try {
                const payload1 = {
                    pkid: PKID,
                    keyword: '%',
                    "companyid": userdetail?.companyID ? userdetail.companyID : "",
                    "deptid": userdetail?.departmentID ? userdetail.departmentID : ""
                };

                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*"
                };

                const response = await axios.post(
                    baseUrl.Url + "/backend/api/GET_GateEntry",
                    payload1,
                    { headers }
                );

                if (response.status !== 200) throw new Error("Failed to fetch data");
                let apiData = response.data[0];
                setFormData((prev) => ({
                    ...prev,
                    PKID: apiData.pkid,
                    DATE: convertToISODate(apiData.date),
                    VEHNO: apiData.vehno,
                    MOBILENO: apiData.mobileno,
                    AADHARNO: apiData.aadharno,
                    CROP_TYPE: Crop_TYPE.find((croP_TYPE) => croP_TYPE.value == apiData.croP_TYPE)?.value || "",

                }));

                console.log("Sale Bill Master Data:", apiData);
            } catch (error) {
                console.error("Error in Master API Call:", error);
            }
        };
        const fetchDetailsData = async () => {
            try {
                console.log("Fetching details for PKID:", PKID);

                const payload = {
                    pkid: PKID,
                    "companyid": userdetail?.companyID ? userdetail.companyID : "",
                    "deptid": userdetail?.departmentID ? userdetail.departmentID : ""
                };

                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*"
                };

                const response = await axios.post(
                    baseUrl.Url + "/backend/api/GET_GateEntryDetailById",
                    payload,
                    { headers }
                );

                if (response.status !== 200) throw new Error("Failed to fetch details data");

                console.log("Gate Entry Detail Data:", response.data);

                if (response.data.length > 0) {
                    const mappedProducts = response.data.map((item) => ({
                        dpkid: item.dpkid || "",
                        pkid: item.pkid || "",
                        maid: item.maid || "",
                        toknno: item.toknno || "",
                        fullname: item.fullname || "",
                        caretS_COUNT: item.caretS_COUNT || "",
                        isdeleted: item.isdeleted || 0
                    }));


                    console.log("Mapped Products:", mappedProducts);
                    setRows(mappedProducts);
                } else {
                    setRows([]); // Reset if no data
                }
            } catch (error) {
                console.error("Error fetching details data:", error);
            }
        };

        fetchMasterData();
        fetchDetailsData();
    }, [PKID]);


    const handleAddProduct = () => {
        if (!detailData.TOKNNO || !detailData.FULLNAME || !detailData.CARETS_COUNT || !detailData.VILLAGE) {
            Swal.fire({
                icon: "error",
                title: "Validation Error",
                text: "कृपया सर्व फील्ड भरावेत.",
            });
            return;
        }

        // Ensure CARETS_COUNT is a valid number
        if (isNaN(detailData.CARETS_COUNT) || detailData.CARETS_COUNT <= 0) {
            Swal.fire({
                icon: "error",
                title: "Validation Error",
                text: "जाळी संख्या वैध असावी.",
            });
            return;
        }


        setRows((prevRows) => [
            ...prevRows,
            {
                TOKNNO: latestToken + 1,
                FULLNAME: detailData.FULLNAME,
                CARETS_COUNT: detailData.CARETS_COUNT,
                VILLAGE: detailData.VILLAGE
            }
        ]);

        // Increment token for the next entry
        setLatestToken((prev) => prev + 1);

        // Reset detailData
        setDetailData({
            TOKNNO: latestToken + 2,
            FULLNAME: '',
            CARETS_COUNT: '',
            VILLAGE: ''
        });

        console.log("Updated Rows (Hidden VILLAGE):", rows);
    };

    const handleEdit = (dpkid) => {
        console.log("Editing DPKID:", dpkid);
        console.log("Current Rows State:", rows);

        const filteredProducts = rows.find((row) => String(row.dpkid) === String(dpkid));
        console.log("Filtered Product:", filteredProducts);

        if (!filteredProducts) {
            console.error("No product found with this DPKID");
            return;
        }

        setDetailData({
            dpkid: filteredProducts.dpkid || "",
            pkid: filteredProducts.pkid || "",
            maid: filteredProducts.maid || "",
            toknno: filteredProducts.toknno || "",
            fullname: filteredProducts.fullname || "",
            caretS_COUNT: filteredProducts.caretS_COUNT || "",
            village: filteredProducts.village || "",
            isdeleted: 0,
        });
    };

    const handleDelete = (dpkid) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel",
        }).then((result) => {
            if (result.isConfirmed) {
                setRows((prevRows) => {
                    const updatedRows = prevRows.map((row) =>
                        row.dpkid === dpkid ? { ...row, isdeleted: 1 } : row
                    );
                    console.log("Updated Rows:", updatedRows);
                    return updatedRows;
                });
                Swal.fire({
                    icon: "success",
                    title: "Deleted!",
                    text: "Record marked as deleted",
                    confirmButtonText: "OK",
                });
            }
        });
    };

    useEffect(() => {

        const fetchImplications = async () => {
            try {
                const response = await axios.get(
                    baseUrl.Url + "/backend/api/Implications/CROP_TYPE",
                    // "http://adsvr:78/api/Implications/SOLID|LIQUID|GAS"
                );

                if (response.status !== 200) throw new Error("Failed to fetch implications data");

                const data = response.data;

                // Combine all implications into one array
                const implicationsDropdown = data.map(({ iTitle, iValue }) => ({
                    label: iTitle,
                    value: iValue,
                }));

                setCrop_TYPE(implicationsDropdown);
            } catch (error) {
                console.error("Error fetching implications:", error);
            }
        };

        fetchImplications();
    }, []);

    // const handleSelectChange = (selectedOption) => {
    //     setFormData({ ...formData, CROP_TYPE: selectedOption });
    // };
    const handleSelectChange = (selectedOption) => {
        setFormData({ ...formData, CROP_TYPE: selectedOption ? selectedOption.value : "" });
    };

    const checkFormValidity = () => {
        if (!formData.VEHNO) {
            Swal.fire({
                icon: "error",
                title: "Validation Error",
                text: "वाहन क्रमांक आवश्यक आहे.",
            });
            return false;
        }


        if (!detailData.TOKNNO) {
            Swal.fire({
                icon: "error",
                title: "Validation Error",
                text: "टोकन नंबर आवश्यक आहे.",
            });
            return false;
        }

        if (!formData.DATE) {
            Swal.fire({
                icon: "error",
                title: "Validation Error",
                text: "दिनांक आवश्यक आहे.",
            });
            return false;
        }
        if (!formData.AADHARNO || formData.AADHARNO.length !== 12) {
            Swal.fire({
                icon: "error",
                title: "Validation Error",
                text: "वैध आधार क्रमांक आवश्यक आहे.",
            });
            return false;
        }
        if (!formData.MOBILENO || formData.MOBILENO.length !== 10) {
            Swal.fire({
                icon: "error",
                title: "Validation Error",
                text: "वैध मोबाईल क्रमांक आवश्यक आहे.",
            });
            return false;
        }

        if (!detailData.FULLNAME) {
            Swal.fire({
                icon: "error",
                title: "Validation Error",
                text: "शेतकऱ्याचे नाव आवश्यक आहे.",
            });
            return false;
        }

        if (!detailData.VILLAGE) {
            Swal.fire({
                icon: "error",
                title: "Validation Error",
                text: "गावाचे नाव आवश्यक आहे.",
            });
            return false;
        }

        if (!formData.CROP_TYPE) {
            Swal.fire({
                icon: "error",
                title: "Validation Error",
                text: "पिकाचा प्रकार निवडा.",
            });
            return false;
        }

        if (!detailData.CARETS_COUNT || isNaN(detailData.CARETS_COUNT) || detailData.CARETS_COUNT <= 0) {
            Swal.fire({
                icon: "error",
                title: "Validation Error",
                text: "पेट्यांची संख्या शून्याहून मोठी असावी.",
            });
            return false;
        }
        showConfirmationAlert();
        return true;
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



    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form Data:", formData);
        console.log('Detail Data:', rows);
        showConfirmationAlert();

    };

    const showConfirmationAlert = () => {
        MySwal.fire({
            title: 'Are you sure?',
            text: 'Do you want to save this data?',
            showCancelButton: true,
            confirmButtonColor: '#00ff00',
            confirmButtonText: 'SAVE',
            cancelButtonColor: '#092C4C',
            cancelButtonText: 'CANCEL',
        }).then((result) => {
            if (result.isConfirmed) {
                handleFormSubmission();
            }
        });
    };
    const handleFormSubmission = async () => {
        try {
            const payload1 = {
                "pkid": PKID ? PKID : GUID,
                "date": formData.DATE || "",
                "vehno": formData.VEHNO,
                "mobileno": formData.MOBILENO,
                "aadharno": formData.AADHARNO,
                "croP_TYPE": String(formData.CROP_TYPE || ""),
                "companyid": userdetail?.companyID ? userdetail.companyID : "",
                "deptid": userdetail?.departmentID ? userdetail.departmentID : ""
            };

            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            const response1 = await axios.post(baseUrl.Url + "/backend/api/SP_AddUpdGateEntry", payload1, { headers });
            if (response1.status === 200) {
                const payload2 = rows.map((row) => ({
                    "dpkid": row.DPKID ? row.DPKID : ACSPLGUID.getNew(),
                    "pkid": PKID ? PKID : GUID,
                    "maid": "",
                    "toknno": row.TOKNNO ? String(row.TOKNNO) : "",
                    "fullname": row.FULLNAME,
                    "caretS_COUNT": row.CARETS_COUNT ? String(parseInt(row.CARETS_COUNT, 10)) : "0",
                    "village": row.VILLAGE,
                    "companyid": userdetail?.companyID ? userdetail.companyID : "",
                    "deptid": userdetail?.departmentID ? userdetail.departmentID : ""

                }));

                const response2 = await axios.post(baseUrl.Url + "/backend/api/SP_AddUpdGateEntryDetail", payload2, { headers });
                if (response2.status === 200) {
                    Swal.fire({
                        icon: "success",
                        title: "Saved!",
                        text: "Data saved successfully.",
                        confirmButtonText: "OK",
                    }).then((result) => {
                        if (result.isConfirmed) {
                            setFormData({
                                PKID: GUID,
                                DATE: new Date().toISOString().split('T')[0],
                                VEHNO: 'MH ',
                                MOBILENO: '',
                                AADHARNO: '',
                                CROP_TYPE: '',
                            });

                            setRows([]);
                            const modal = document.getElementById("Model1");
                            if (modal) {
                                modal.classList.remove("show");
                                modal.style.display = "none";
                                modal.setAttribute("aria-hidden", "true");

                                const modalBackdrop = document.querySelector(".modal-backdrop");
                                if (modalBackdrop) {
                                    modalBackdrop.remove();
                                }
                                document.body.classList.remove("modal-open");
                                document.body.style.overflow = "auto";
                            }
                        }
                    });

                } else {
                    throw new Error("Failed to save product details.");
                }
            } else {
                throw new Error("Failed to save master data.");
            }
        } catch (error) {
            console.error("Submission Error:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to save data. Please try again.",
            });
        }


    };




    useEffect(() => {
        const handleShortcut = (e) => {
            if (e.ctrlKey && e.key === "s" || e.ctrlKey && e.key === 'S') {
                e.preventDefault();
                checkFormValidity(e);
            }

            if (e.ctrlKey && e.key === "e") {
                e.preventDefault();
                showExitAlert();
            }
        };

        window.addEventListener("keydown", handleShortcut);

        return () => {
            window.removeEventListener("keydown", handleShortcut);
        };
    }, [formData, navigate, route.ServicesMaster, handleSubmit]);

    const handleKeyDown = (e, nextRef) => {
        if (e.key === 'Enter' && nextRef.current) {
            nextRef.current.focus();
            e.preventDefault();
        }
    };

    useEffect(() => {
        const today = new Date().toISOString().split("T")[0];
        setFormData((prev) => ({ ...prev, DATE: today }));
    }, []);




    const handleNewEntry = () => {
        setFormData({
            VEHNO: "",
            DATE: new Date().toISOString().split('T')[0],
            AADHARNO: "",
            MOBILENO: "",
            CROP_TYPE: null,
        });

        setRows([]);
    };

    useEffect(() => {
        if (!detailData.TOKNNO) {
            setDetailData((prevData) => ({
                ...prevData,
                TOKNNO: uuidv4().slice(0)
            }));
        }
    }, []);

    useEffect(() => {
        if (!detailData.TOKNNO) {
            const generateToken = () => {
                return `${Date.now().toString().slice(-1)}`;
            };

            setDetailData((prevData) => ({
                ...prevData,
                TOKNNO: generateToken()
            }));
        }
    }, []);

    const [formData1, setformData1] = useState({
        FAID: '',
        FNAME: FNAME || "",
        FCONTACTNO: FCONTACT || "",
        FBIRTHDATE: '',
        FPANNO: '',
        FADDHARNO: FADHAR || "",
        FBANKNAME: '',
        FBRANCHNAME: '',
        FACCOUNTNO: '',
        FIFSCCODE: '',
        FPINCODE: '',
        FSTATE: '',
        FCITY: '',
        FLANDMARK: '',
        FLANDAREA: '',
        FLANDTYPE: '',
        FSTATUS: '',
    });

    useEffect(() => {
        setformData1({
            FAID: '',
            FNAME: FNAME || "",
            FCONTACTNO: FCONTACT || "",
            FADDHARNO: FADHAR || "",
        });
    }, [FAID, FNAME, FCONTACT, FADHAR]);



    const FNAMERef = useRef(null);
    const FCONTACTNORef = useRef(null);
    const FBIRTHDATERef = useRef(null);
    const FADDHARNORef = useRef(null);


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
                let apiData = response.data[0];
                setformData1((prev) => ({
                    ...prev,
                    FAID: apiData.faid,
                    FNAME: apiData.fname,
                    FCONTACTNO: apiData.fcontactno,
                    FBIRTHDATE: apiData.fbirthdate,
                    FPANNO: apiData.fpanno,
                    FADDHARNO: apiData.faddharno,
                    FBANKNAME: apiData.fbankname,
                    FBRANCHNAME: apiData.fbranchname,
                    FACCOUNTNO: apiData.faccountno,
                    FIFSCCODE: apiData.fifsccode,
                    FPINCODE: apiData.fpincode,
                    // FSTATE: apiData.fstate,
                    // FCITY: apiData.fcity,
                    FLANDMARK: apiData.flandmark,
                    FLANDAREA: apiData.flandarea,
                    FLANDTYPE: apiData.flandtype,
                    FCITY: apiData.fcity,
                    FSTATE: apiData.fstate,
                    FSTATUS: apiData.fstatus,
                }));
                console.log(" Master Data:", apiData);
            } catch (error) {
                console.error("Error in Master API Call:", error);
            }
        };

        fetchMasterData();
    }, [FAID]);

    const handleChange1 = (e) => {
        setformData1({ ...formData1, [e.target.name]: e.target.value });
        if (e.target.name == 'FADDHARNO' && FAID == '') {
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
        }

    };
    const handleSubmit1 = async (e) => {
        e.preventDefault();
        console.log("Form Data:", formData1);

        const today = new Date().toISOString().split('T')[0];
        if (FAID != '') {
            const payload1 = {
                // faid: FAID ? FAID : ACSPLGUID.getNew(),
                // fname: formData1.FNAME,
                // fcontactno: formData1.FCONTACTNO,
                // fbirthdate: today,
                // fpanno: "",
                // faddharno: formData1.FADDHARNO,
                // fbankname: "",
                // fbranchname: "",
                // faccountno: "",
                // fifsccode: "",
                // fpincode: "",
                // fstate: "",
                // fcity: "",
                // flandmark: "",
                // flandarea: "",
                // flandtype: "",
                // fstatus: "",
                // companyid: "",
                // deptid: "",
                // faddress: "",
                // fcroparea: "",
                // fcroptype: "",

                "faid": FAID ? FAID : ACSPLGUID.getNew(),
                "fname": formData1.FNAME,
                "fcontactno": formData1.FCONTACTNO,
                "fbirthdate": formData1.FBIRTHDATE,
                "fpanno": formData1.FPANNO,
                "faddharno": formData1.FADDHARNO,
                "fbankname": formData1.FBANKNAME,
                "fbranchname": formData1.FBRANCHNAME,
                "faccountno": formData1.FACCOUNTNO,
                "fifsccode": formData1.FIFSCCODE,
                "fpincode": formData1.FPINCODE,
                "fstate": formData1.FSTATE,
                "fcity": formData1.FCITY,
                "flandmark": formData1.FLANDMARK,
                "flandarea": formData1.FLANDAREA,
                "flandtype": formData1.FLANDTYPE,
                "fstatus": formData1.FSTATUS,
                "companyid": "",
                "deptid": "",
            };
            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };
            try {
                const response1 = await axios.post(baseUrl.Url + "/backend/api/SP_AddUpdFarmer", payload1, { headers });

                if (response1.status === 200) {
                    Swal.fire({
                        icon: "success",
                        title: "Saved!",
                        text: "Data saved successfully.",
                        confirmButtonText: "OK",
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
                    title: "Error",
                    text: "Failed to save data. Please try again.",
                });
            }
        }
        try {
            const payload = {
                aadhaar: formData1.FADDHARNO,
            };

            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            const response = await axios.post(baseUrl.Url + "/backend/api/SP_CheckAadhaar", payload, { headers });

            if (response.status === 200) {
                console.log(response.data);

                if (response.data[0].isSuccessful == 1) {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: response.data[0].responseMessage,
                        confirmButtonText: "OK",
                    }).then((result) => {
                        if (result.isConfirmed) {
                            console.log("Data save success");
                        }
                    });

                } else {
                    const payload1 = {
                        // faid: FAID ? FAID : ACSPLGUID.getNew(),
                        // fname: formData1.FNAME,
                        // fcontactno: formData1.FCONTACTNO,
                        // fbirthdate: today,
                        // fpanno: "",
                        // faddharno: formData1.FADDHARNO,
                        // fbankname: "",
                        // fbranchname: "",
                        // faccountno: "",
                        // fifsccode: "",
                        // fpincode: "",
                        // fstate: "",
                        // fcity: "",
                        // flandmark: "",
                        // flandarea: "",
                        // flandtype: "",
                        // fstatus: "",
                        // companyid: "",
                        // deptid: "",
                        // faddress: "",
                        // fcroparea: "",
                        // fcroptype: "",

                        "faid": FAID ? FAID : ACSPLGUID.getNew(),
                        "fname": formData1.FNAME,
                        "fcontactno": formData1.FCONTACTNO,
                        "fbirthdate": formData1.FBIRTHDATE,
                        "fpanno": formData1.FPANNO,
                        "faddharno": formData1.FADDHARNO,
                        "fbankname": formData1.FBANKNAME,
                        "fbranchname": formData1.FBRANCHNAME,
                        "faccountno": formData1.FACCOUNTNO,
                        "fifsccode": formData1.FIFSCCODE,
                        "fpincode": formData1.FPINCODE,
                        "fstate": formData1.FSTATE,
                        "fcity": formData1.FCITY,
                        "flandmark": formData1.FLANDMARK,
                        "flandarea": formData1.FLANDAREA,
                        "flandtype": formData1.FLANDTYPE,
                        "fstatus": formData1.FSTATUS,
                        "companyid": "",
                        "deptid": "",
                    };

                    try {
                        const response1 = await axios.post(baseUrl.Url + "/backend/api/SP_AddUpdFarmer", payload1, { headers });

                        if (response1.status === 200) {
                            Swal.fire({
                                icon: "success",
                                title: "Saved!",
                                text: "Data saved successfully.",
                                confirmButtonText: "OK",
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
                            title: "Error",
                            text: "Failed to save data. Please try again.",
                        });
                    }
                }
            }
        } catch (error) {
            console.error("Get data Error:", error);
        }
    };

    return (
        <div>
            <div className="col-xl-4">
                <div className="card">
                    <div className="card-header">
                        <h5 className="card-title">Toggle Between Modals</h5>
                    </div>
                    <div className="card-body">
                        {/* Modal */}
                        <div
                            className="modal fade"
                            id="exampleModalToggle"
                            aria-hidden="true"
                            aria-labelledby="exampleModalToggleLabel"
                            tabIndex={-1}
                        >
                            <div className="modal-dialog modal-dialog-centered">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h4
                                            className="modal-title"
                                            id="exampleModalToggleLabel"
                                        >
                                            जनरेट टोकन
                                        </h4>
                                        <button
                                            type="button"
                                            className="btn-close"
                                            data-bs-dismiss="modal"
                                            aria-label="Close"
                                        />
                                    </div>
                                    <div className="modal-body">
                                        {/* <div className="modal-body custom-modal-body"> */}
                                        <form onSubmit={handleSubmit}>
                                            <div className="container-fluid">
                                                <div className="row d-flex justify-content-md-end mb-2">
                                                    <div className="col-12 col-md-6 col-lg-2 mb-2 mb-md-0">
                                                        <button
                                                            type="button"
                                                            className="btn btn-secondary w-100"
                                                            data-bs-toggle="modal"
                                                            data-bs-target="#Farmerfrom"
                                                        >
                                                            शेतकरी नोंदणी
                                                        </button>
                                                    </div>
                                                    <div className="col-12 col-md-6 col-lg-2">
                                                        <button
                                                            type="button"
                                                            className="btn btn-secondary w-100"
                                                            data-bs-toggle="modal"
                                                            data-bs-target="#Tranporterfrom"
                                                        >
                                                            वाहन चालक नोंदणी
                                                        </button>
                                                    </div>
                                                </div>


                                                <div className="col-md-4 col-lg-2 mb-3">
                                                    <label className="form-label required">वाहन क्रमांक</label>
                                                    <input
                                                        ref={VEHNORef}
                                                        type="text"
                                                        className="form-control "
                                                        name="VEHNO"
                                                        value={formData.VEHNO}
                                                        onChange={(e) => {
                                                            let inputValue = e.target.value.toUpperCase();

                                                            if (!inputValue.startsWith("MH")) {
                                                                inputValue = "MH" + inputValue.replace(/^MH\s*/, "");
                                                            }

                                                            inputValue = inputValue.replace(/\s+/g, "").replace(/\//g, "");

                                                            handleInputChange({ target: { name: "VEHNO", value: inputValue } });
                                                        }}
                                                        onKeyDown={(e) => handleKeyDown(e, TOKANNORef)}
                                                        disabled={rows.length > 0}
                                                        required
                                                        style={{ fontWeight: "900" }}
                                                    />
                                                </div>
                                                <div className="row">

                                                    <div className="col-6 col-md-6 col-lg-2 mb-2">
                                                        <label className="form-label required">टोकन नंबर</label>
                                                        {/* <input
                                                        ref={TOKANNORef}
                                                        type="text"
                                                        className="form-control"
                                                        name="TOKNNO"
                                                        value={detailData.TOKNNO}
                                                        onChange={handleInputChange}
                                                        onKeyDown={(e) => handleKeyDown(e, DATERef)}

                                                    /> */}
                                                        <input
                                                            ref={TOKANNORef}
                                                            type="text"
                                                            className="form-control text-center"
                                                            name="TOKNNO"
                                                            value={detailData.TOKNNO}
                                                            onChange={handleInputChange}
                                                            onKeyDown={(e) => handleKeyDown(e, DATERef)}
                                                            readOnly
                                                            style={{
                                                                fontWeight: "900",
                                                                backgroundColor: "#ffeb3b",
                                                                border: "2px solid #ff9800"
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="col-6 col-md-6 col-lg-2 mb-2">
                                                        <label className="form-label required">दिनांक</label>
                                                        <input
                                                            ref={DATERef}
                                                            type="date"
                                                            className="form-control"
                                                            name="DATE"
                                                            value={formData.DATE}
                                                            onChange={handleInputChange}
                                                            onKeyDown={(e) => handleKeyDown(e, AADHARNORef)}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="col-6 col-md-6 col-lg-2 mb-2">
                                                        <label className="form-label">आधार क्रमांक</label>
                                                        <input
                                                            ref={AADHARNORef}
                                                            type="tel"
                                                            className="form-control"
                                                            name="AADHARNO"
                                                            value={formData.AADHARNO}
                                                            onChange={handleInputChange}
                                                            onKeyDown={(e) => handleKeyDown(e, MOBILENORef)}
                                                            inputMode="numeric"
                                                            pattern="[0-9]{12}"
                                                        />


                                                    </div>

                                                    <div className="col-6 col-md-6 col-lg-2 mb-2">
                                                        <label className="form-label required">मोबाईल क्रमांक</label>
                                                        <input
                                                            ref={MOBILENORef}
                                                            type="tel"  // Use "tel" to open the numeric keypad
                                                            className="form-control"
                                                            name="MOBILENO"
                                                            value={formData.MOBILENO}
                                                            onChange={handleInputChange}
                                                            onKeyDown={(e) => handleKeyDown(e, FULLNAMERef)}
                                                            inputMode="numeric"  // Ensures numeric keypad on all devices
                                                            pattern="[0-9]*" // Restricts input to digits only (useful for some browsers)
                                                        />


                                                    </div>
                                                    <div className="col-12 col-md-6 col-lg-4 mb-2">
                                                        <label className="form-label required">पिकाचा प्रकार</label>

                                                        <Select
                                                            ref={CROP_TYPERef}
                                                            classNamePrefix="react-select"
                                                            options={Crop_TYPE} // Options from API
                                                            value={Crop_TYPE.find(option => option.value === formData.CROP_TYPE) || null}
                                                            onChange={handleSelectChange}
                                                            styles={{ menu: (base) => ({ ...base, zIndex: 1050 }) }}
                                                            onKeyDown={(e) => handleKeyDown(e, CARETS_COUNTRef)}
                                                        />

                                                    </div>
                                                </div>
                                                <div className="row mb-2">
                                                    <div className="col-12 col-md-6 col-lg-5 mb-2">
                                                        <label className="form-label required">शेतकऱ्याचे नाव</label>
                                                        <input
                                                            ref={FULLNAMERef}
                                                            type="text"
                                                            className="form-control"
                                                            name="FULLNAME"
                                                            value={detailData.FULLNAME}
                                                            onChange={handleInputChange}
                                                            onKeyDown={(e) => handleKeyDown(e, VILLAGERef)}

                                                        />
                                                    </div>

                                                    <div className="col-6 col-md-6 col-lg-3 mb-2">
                                                        <label className="form-label">गावाचे नाव</label>
                                                        <input
                                                            ref={VILLAGERef}
                                                            type="text"
                                                            className="form-control"
                                                            name="VILLAGE"
                                                            value={detailData.VILLAGE}
                                                            onChange={handleInputChange}
                                                            onKeyDown={(e) => handleKeyDown(e, CROP_TYPERef)}
                                                        />
                                                    </div>



                                                    <div className="col-6 col-md-6 col-lg-2 mb-2">
                                                        <label className="form-label required">जाळी संख्या</label>
                                                        <input
                                                            ref={CARETS_COUNTRef}
                                                            type="tel"
                                                            className="form-control"
                                                            name="CARETS_COUNT"
                                                            value={detailData.CARETS_COUNT}
                                                            onChange={handleInputChange}
                                                            onKeyDown={(e) => handleKeyDown(e, AddRef)}
                                                            inputMode="numeric"
                                                            pattern="[0-9]*"
                                                        />
                                                    </div>

                                                    <div className="col-12 col-md-6 col-lg-2 mt-3">
                                                        <button
                                                            ref={AddRef}
                                                            type="button"
                                                            className="btn btn-primary mt-2 w-100"
                                                            onClick={handleAddProduct}
                                                        >
                                                            टोकन जोडा
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="modal-body-table">
                                                    <div
                                                        className={`table-responsive ${rows.length > 1 ? "overflow-auto" : ""}`}
                                                        style={{
                                                            maxHeight: rows.length > 1 ? "40vh" : "auto",
                                                            overflowX: "hidden" // Prevent horizontal scrolling
                                                        }}
                                                    >
                                                        <table
                                                            className="table table-bordered datanew table-striped w-100"
                                                            style={{
                                                                tableLayout: "fixed", // Prevents columns from stretching
                                                                width: "100%",
                                                                minWidth: "100%" // Ensures it adapts to screen size
                                                            }}
                                                        >
                                                            <thead className="thead-dark bg-dark text-white">
                                                                <tr>
                                                                    <th style={{ width: "10%" }}>नं.</th>
                                                                    <th style={{ width: "48%", whiteSpace: "normal", wordWrap: "break-word" }}>नाव</th>
                                                                    <th style={{ width: "22%" }}>जा.सं.</th>
                                                                    <th style={{ width: "20%" }}>कृती</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {rows.length > 0 ? (
                                                                    rows.map((row, index) => (
                                                                        <tr key={row.dpkid || index}>
                                                                            <td>{row.TOKNNO}</td>
                                                                            <td>{row.FULLNAME}</td>
                                                                            <td>{row.CARETS_COUNT}</td>
                                                                            <td>
                                                                                <Link
                                                                                    to="#"
                                                                                    onClick={() => handleEdit(row.dpkid)}
                                                                                    className="me-1"
                                                                                >
                                                                                    <Edit className="feather-edit" />
                                                                                </Link>
                                                                                <Link
                                                                                    className="confirm-text p-1"
                                                                                    to="#"
                                                                                    onClick={() => handleDelete(row.dpkid)}
                                                                                >
                                                                                    <Trash2 className="feather-trash-2 text-danger" />
                                                                                </Link>
                                                                            </td>
                                                                        </tr>
                                                                    ))
                                                                ) : (
                                                                    <tr>
                                                                        <td colSpan="4" className="text-center">No Data Available</td>
                                                                    </tr>
                                                                )}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>


                                                <div className="text-end mt-2 col-sm-12">
                                                    <button type="button" className="btn btn-secondary me-2"
                                                        data-bs-dismiss="modal"
                                                    // onClick={showExitAlert}
                                                    >
                                                        मागे
                                                    </button>
                                                    <button type="submit" className="btn btn-success me-2">सेव्ह</button>
                                                    <button
                                                        type="button"
                                                        className="btn btn-primary me-2 mb-2"
                                                        onClick={handleNewEntry}
                                                        disabled={!rows.length}  // Enable only if there are added rows
                                                    >
                                                        नवीन नोंदवा
                                                    </button>

                                                </div>

                                            </div>
                                        </form>
                                        {/* </div> */}
                                    </div>
                                    <div className="modal-footer">
                                        <button
                                            className="btn btn-primary"
                                            data-bs-target="#exampleModalToggle2"
                                            data-bs-toggle="modal"
                                            data-bs-dismiss="modal"
                                        >
                                            Open second modal
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* /Modal */}
                        {/* Modal */}
                        <div
                            className="modal fade"
                            id="exampleModalToggle2"
                            aria-hidden="true"
                            aria-labelledby="exampleModalToggleLabel2"
                            tabIndex={-1}
                        >
                            <div className="modal-dialog modal-dialog-centered">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h4
                                            className="modal-title"
                                            id="exampleModalToggleLabel2"
                                        >
                                            शेतकरी माहिती
                                        </h4>
                                        <button
                                            type="button"
                                            className="btn-close"
                                            data-bs-dismiss="modal"
                                            aria-label="Close"
                                        />
                                    </div>
                                    <div className="modal-body">
                                        <form onSubmit={handleSubmit1}>
                                            <div className="row mb-3">
                                                <div className="row mb-3">
                                                    <div className="col-12">
                                                        <label className='form-label required'>आधार क्रमांक</label>
                                                        <input
                                                            type="tel"
                                                            inputMode="numeric"
                                                            className="form-control"
                                                            placeholder="Enter Aadhar Number"
                                                            name="FADDHARNO"
                                                            value={formData1.FADDHARNO || ""}
                                                            onChange={handleChange1}
                                                            pattern="^[0-9]{12}$"
                                                            title="आधार नंबर वैध 12 अंकी नंबर असावा."
                                                            ref={FADDHARNORef}
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-12">
                                                    <label className='required form-label'>पूर्ण नाव</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Enter Full Name"
                                                        name="FNAME"
                                                        value={formData1.FNAME || ""}
                                                        onChange={handleChange1}
                                                        pattern="^[A-Za-z\s]+$"
                                                        title="पूर्ण नाव वैध असावे, ज्यात सुरुवातीला रिकाम्या जागा नकोत."
                                                        ref={FNAMERef}

                                                    />
                                                </div>
                                            </div>

                                            <div className="row mb-3">
                                                <div className="col-12">
                                                    <label className='required form-label'>मोबाईल नंबर</label>
                                                    <input
                                                        type="tel"
                                                        inputMode="numeric"
                                                        className="form-control"
                                                        placeholder="Enter Mobile Number"
                                                        name="FCONTACTNO"
                                                        value={formData1.FCONTACTNO || ""}
                                                        onChange={handleChange1}
                                                        pattern="^[0-9]{10}$"
                                                        title="मोबाईल नंबर वैध 10 अंकी नंबर असावा."
                                                        ref={FCONTACTNORef}
                                                    />
                                                </div>
                                            </div>



                                            <div className="row mt-4">
                                                <div className="col-lg-6 col-sm-12">
                                                    <button
                                                        type="button"
                                                        className="btn btn-secondary w-100"
                                                        data-bs-dismiss="modal"
                                                    >
                                                        Close
                                                    </button>
                                                </div>
                                                <div className="col-lg-6 col-sm-12">
                                                    <button
                                                        type="submit"
                                                        className="btn w-100"
                                                        style={{ background: "blue", color: "white", border: "none", padding: "10px" }}
                                                    >
                                                        Submit
                                                    </button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                    <div className="modal-footer">
                                        <button
                                            className="btn btn-primary"
                                            data-bs-target="#exampleModalToggle"
                                            data-bs-toggle="modal"
                                            data-bs-dismiss="modal"
                                        >
                                            Back to first
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* /Modal */}
                        <Link
                            className="btn btn-primary"
                            data-bs-toggle="modal"
                            to="#exampleModalToggle"
                            role="button"
                        >
                            Open first modal
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DoubleModel
