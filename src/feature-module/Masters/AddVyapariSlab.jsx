import React, { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import Select from "react-select";
import "bootstrap/dist/css/bootstrap.min.css";
import {
    ArrowLeft
} from "feather-icons-react/build/IconComponents";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axios from 'axios';
import { all_routes } from "../../Router/all_routes"
import { ACSPLGUID, baseUrl, convertToISODate } from "../../core/json/custom";

import {
    PlusCircle,
    Trash2,
    Edit
} from "feather-icons-react/build/IconComponents";
import { getUserData } from "../../Context/UserData"


const AddVyapariSlab = ({ VSAID, onRefresh }) => {

    console.log(VSAID, "VSAID on model**********************************************************************");

    const MySwal = withReactContent(Swal);
    const userdetail = getUserData();
    const navigate = useNavigate();
    const route = all_routes;
    const GUID = ACSPLGUID.getNew();




    const schemedateRef = useRef(null);
    const schemenameRef = useRef(null);
    const descriptionRef = useRef(null);
    const statusRef = useRef(null);
    const saveRef = useRef(null);

    const startdateRef = useRef(null);
    const enddateRef = useRef(null);
    const duedateRef = useRef(null);
    const kalavadhiRef = useRef(null);
    const percentRef = useRef(null);
    const addRef = useRef(null);



    const [status, setStatus] = useState([]);

    const [kalavadhi, setKalavadhi] = useState([]);

    const [tableData, setTableData] = useState([]);


    console.log(setTableData);


    const [masterData, setMasterData] = useState({
        schemeno: "",
        schemedate: "",
        schemename: "",
        description: "",
        status: "",


    });

    const handleMasterInputChange = (e) => {
        const { name, value } = e.target;
        setMasterData({
            ...masterData,
            [name]: value
        });

    };


    const [formData, setFormData] = useState({
        startdate: "",
        enddate: "",
        duedate: "",
        kalavadhi: "",
        percent: "",
        IsDeleted: 0,
    });

    useEffect(() => {
        console.log("Updated tableData: ", tableData);
    }, [tableData]);



    const handleDetailInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,

        });
    }


    // imlication fetch for dropdown
    useEffect(() => {

        const status = async () => {
            try {
                const response = await axios.get(
                    baseUrl.Url + "/backend/api/Implications/STATUS"
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
        const kalavadhi = async () => {
            try {
                const response = await axios.get(
                    baseUrl.Url + "/backend/api/Implications/KALAVADHI"
                );

                if (response.status !== 200) throw new Error("Failed to fetch implications data");

                const data = response.data;
                const implicationsDropdown = data.map(({ iTitle, iValue }) => ({
                    label: iTitle,
                    value: iValue,
                }));

                setKalavadhi(implicationsDropdown);
            } catch (error) {
                console.error("Error fetching implications:", error);
            }
        };

        status();
        kalavadhi();
    }, []);

    // To fetch and Set VyapariSlabMasterData
    useEffect(() => {

        if (!VSAID) return;
        const fetchVyapariSlabMasterData = async () => {
            try {
                const payload1 = {
                    "companyid": userdetail?.companyID ? userdetail.companyID : "",
                    "deptid": userdetail?.departmentID ? userdetail.departmentID : "",
                    "vsaid": VSAID,

                };

                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*"
                };

                const response = await axios.post(
                    baseUrl.Url + "/backend/api/GET_VyapariSlabMasterData",
                    payload1,
                    { headers }
                );

                console.log(response, "111111111111111111111111111");

                if (response.status !== 200) throw new Error("Failed to fetch data");
                let apiData = response.data[0];
                setMasterData((prev) => ({
                    ...prev,

                    schemeno: apiData.schemeno,
                    schemedate: convertToISODate(apiData.schemedate),
                    schemename: apiData.schemename,
                    description: apiData.description,
                    status: apiData.status,

                }));

                if (response.data.length > 0) {
                    const mappedProducts = response.data.map((item) => ({

                        vsdaid: item.vsdaid,
                        startdate: item.startdate,
                        enddate: item.enddate,
                        duedate: item.duedate,
                        kalavadhi: item.kalavadhi,
                        percent: item.percents,
                        IsDeleted: item.isdeleted,

                    }));

                    console.log("Mapped Table Data:", mappedProducts);


                    setTableData(mappedProducts);
                    console.log('fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff', mappedProducts)
                }


                console.log("GET_VyapariSlabMasterData  Data:", masterData);
            } catch (error) {
                console.error("Error in GET_VyapariSlabMasterData API Call:", error);
            }
        };

        fetchVyapariSlabMasterData();

    }, [VSAID]);

    // Add row in details
    const addRecord = (e) => {
        e.preventDefault(); // Prevent form submission

        //validation of details Inputs
        if (!formData.startdate || !/^\d+$/.test(formData.startdate)) {
            Swal.fire({
                icon: "error",
                title: "सुरुवातीच्या तारखेची चूक",
                text: "कृपया सुरुवातीची तारीख टाका, फक्त अंक वापरा, आणि सुरुवात व शेवटच्या जागा काढा.",
                allowOutsideClick: false,
                allowEscapeKey: false,
            });
            return;
        }
        if (!formData.enddate || !/^\d+$/.test(formData.enddate)) {
            Swal.fire({
                icon: "error",
                title: "शेवटच्या तारखेची चूक",
                text: "कृपया शेवटची तारीख टाका, फक्त अंक वापरा, आणि सुरुवात व शेवटच्या जागा काढा.",
                allowOutsideClick: false,
                allowEscapeKey: false,
            });
            return;
        }
        if (!formData.duedate || !/^\d+$/.test(formData.duedate)) {
            Swal.fire({
                icon: "error",
                title: "शेवटची तारीख (duedate) चूक",
                text: "कृपया duedate टाका, फक्त अंक वापरा, आणि सुरुवात व शेवटच्या जागा काढा.",
                allowOutsideClick: false,
                allowEscapeKey: false,
            });
            return;
        }
        if (!formData.kalavadhi) {
            Swal.fire({
                icon: "error",
                title: "कालावधी निवडीची चूक",
                text: "कृपया कालावधी निवडा.",
                allowOutsideClick: false,
                allowEscapeKey: false,
            });
            return;
        }
        if (!formData.percent || !/^\d+$/.test(formData.percent)) {
            Swal.fire({
                icon: "error",
                title: "टक्केवारीची चूक",
                text: "कृपया टक्केवारी टाका, फक्त अंक वापरा, आणि सुरुवात व शेवटच्या जागा काढा.",
                allowOutsideClick: false,
                allowEscapeKey: false,
            });
            return;
        }

        // Validate SameDate dropdown condition
        if (formData.kalavadhi === "2") {
            if (formData.startdate !== formData.enddate || formData.enddate !== formData.duedate) {
                Swal.fire({
                    icon: "error",
                    title: "चूक",
                    text: "कालावधी २ असल्यास सुरुवात, शेवट आणि duedate सारखे असणे आवश्यक आहे.",
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                });
                return;
            }
        }

        // Add the record if all fields are valid
        let updatedTableData;
        if (formData.vsdaid) {
            updatedTableData = tableData.map((item) =>
                item.vsdaid === formData.vsdaid ? { ...item, ...formData, IsDeleted: 0 } : item
            );
        } else {
            updatedTableData = [...tableData, { ...formData, vsdaid: ACSPLGUID.getNew(), IsDeleted: 0 }];
        }

        setTableData(updatedTableData);


        console.log(tableData, "tableData**********************************************")

        // If all fields are valid, add a success message
        Swal.fire({
            icon: "success",
            title: "साठवले!",
            text: "डेटा टेबलमध्ये यशस्वीपणे जोडला गेला आहे!",
            confirmButtonText: "ठीक आहे",
            allowOutsideClick: false,
            allowEscapeKey: false,
        })
        // Reset formData to clear the form, including dropdowns
        setFormData({
            startdate: "",
            enddate: "",
            duedate: "",
            kalavadhi: "",
            percent: "",
            IsDeleted: 0,

        });

    };


    const TraceDayDifference = () => {
        // Step 1: Filter and collect startdate and enddate, converting them to integers
        let dateRanges = tableData
            .filter((data) => !data.IsDeleted && data.startdate && data.enddate)
            .map((data) => ({
                startdate: parseInt(data.startdate),
                enddate: parseInt(data.enddate),
            }));

        // Step 2: Get the total days in the current month dynamically
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();  // Get current month (0-indexed)
        const currentYear = currentDate.getFullYear();
        const totalDaysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();  // Get number of days in the current month

        // Step 3: Use a Set to track covered days
        let coveredDays = new Set();
        dateRanges.forEach(range => {
            for (let day = range.startdate; day <= range.enddate; day++) {
                coveredDays.add(day);
            }
        });

        // Step 4: Check for missing days in the current month
        let missingDays = [];
        for (let day = 1; day <= totalDaysInMonth; day++) {
            if (!coveredDays.has(day)) {
                missingDays.push(day);
            }
        }

        // Step 5: Return or log the missing days
        if (missingDays.length > 0) {
            console.log("Validation Error: The following dates are missing:", missingDays);
        } else {
            console.log("All dates are covered.");
        }

        return missingDays;
    };






    const handleSubmit = (e) => {
        e.preventDefault(e);

        // Check if there are No records in the details table

        // if (tableData.length === 0)
        if (
            tableData.filter(
                (data) =>
                    !data.IsDeleted &&
                    (data.startdate || data.enddate || data.duedate || data.kalavadhi)
            ).length === 0
        ) {
            Swal.fire({
                icon: "error",
                title: "तपशील तक्त्याची सत्यता त्रुटी",
                text: "साठवण्यापूर्वी तपशील तक्त्यामध्ये किमान एक नोंद जोडा",
                allowOutsideClick: false,
                allowEscapeKey: false,
            })
            return;

        }

        // Check if the date ranges are properly covered
        const missingDays = TraceDayDifference();

        if (missingDays.length > 0) {
            Swal.fire({
                icon: "error",
                title: "दिनांक गहाळ आहेत",
                html: `खालील दिनांकांचा समावेश नाही: <b>${missingDays.join(", ")}</b><br>कृपया 1 ते 31 पर्यंत सर्व दिनांकांचा समावेश असल्याची खात्री करा.`,
                allowOutsideClick: false,
                allowEscapeKey: false,
            });
            return;
        }



        showConfirmationAlert(e);

        console.log("table Data Submitted:", tableData);
        console.log("Master part Submitted:", masterData);

    };



    //confirmation Box for save
    const showConfirmationAlert = (event) => {
        MySwal.fire({
            title: "आपली खात्री आहे का?",
            text: "आपण हे डेटा जतन करू इच्छिता का?",
            showCancelButton: true,
            confirmButtonColor: "#00ff00",
            confirmButtonText: "जतन करा",
            cancelButtonColor: "#092C4C",
            cancelButtonText: "रद्द करा",
            allowOutsideClick: false,
            allowEscapeKey: false,
        }).then((result) => {
            if (result.isConfirmed) {
                handlePayloadSubmition(event); // Proceed with form submission
            }
        });
    };

    const handlePayloadSubmition = async () => {
        console.log("table Data Submitted from  handlePayloadSubmition:", tableData);
        console.log("Master part Submitted from handlePayloadSubmition:", masterData);
        try {

            // Prepare payload1 for master data save
            const payload1 = {
                "vsaid": VSAID ? VSAID : GUID,
                "schemeno": masterData.schemeno,
                "schemedate": masterData.schemedate,
                "schemename": masterData.schemename,
                "description": masterData.description,
                "status": masterData.status,
                "uaid": userdetail?.uaid ? userdetail.uaid : "",
                "companyid": userdetail?.companyID ? userdetail.companyID : "",
                "deptid": userdetail?.departmentID ? userdetail.departmentID : "",

            };

            console.log("Payload1 after processing arrays:", payload1);

            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            // First API call to save the quotation master
            await axios({
                method: "POST",
                url: baseUrl.Url + "/backend/api/SP_AddUpdVyapariSlabMaster",
                data: JSON.stringify(payload1),
                headers: headers,
            });

            // Prepare payload for detail data
            const Payload2 = tableData.map((detail) => ({

                "vsdaid": detail.vsdaid ? detail.vsdaid : ACSPLGUID.getNew(),
                "vsaid": VSAID ? VSAID : GUID,
                "startdate": detail.startdate,
                "enddate": detail.enddate,
                "duedate": detail.duedate,
                "kalavadhi": detail.kalavadhi,
                "percents": detail.percent,

                "isdeleted": detail.IsDeleted === 1 || detail.IsDeleted === true ? true : false,
                "uaid": userdetail?.uaid ? userdetail.uaid : "",
                "companyid": userdetail?.companyID ? userdetail.companyID : "",
                "deptid": userdetail?.departmentID ? userdetail.departmentID : "",

            }));
            console.log("Payload2:", Payload2);


            await axios({
                method: "POST",
                url: baseUrl.Url + "/backend/api/SP_AddUpdVyapariSlabDetail",
                data: JSON.stringify(Payload2),
                headers: headers,
            });


            Swal.fire({
                icon: "success",
                title: "जतन झाले!",
                text: "डेटा यशस्वीरित्या जतन केला गेला आहे.",
                confirmButtonText: "ठीक आहे",
                allowOutsideClick: false,
                allowEscapeKey: false,
            }).then(() => {

                setMasterData({
                    ...masterData, // Keep existing token number if needed
                    schemeno: "",
                    schemedate: "",
                    schemename: "",
                    description: "",
                    status: "",

                });

                setFormData({
                    ...formData,

                    startdate: "",
                    enddate: "",
                    duedate: "",
                    kalavadhi: "",
                    percent: "",

                    IsDeleted: "",
                });

                setTableData([]);
            });


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


    };


    // Edit Detail Record 
    const handleEdit = (vsdaid) => {
        const filteredProducts = tableData.filter((data) => data.vsdaid == vsdaid);
        setFormData({
            vsdaid: filteredProducts[0].vsdaid,
            startdate: filteredProducts[0].startdate,
            enddate: filteredProducts[0].enddate,
            duedate: filteredProducts[0].duedate,
            kalavadhi: filteredProducts[0].kalavadhi,
            percent: filteredProducts[0].percent,

            IsDeleted: 0,
        });

    }
    // delete Detail Record 
    const handleDelete = (vsdaid) => {
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
                setTableData((prevData) => {

                    const updatedData = prevData.map((data) =>
                        data.vsdaid === vsdaid
                            ? { ...data, IsDeleted: 1 } : data // Otherwise, keep the data unchanged
                    );


                    console.log("Updated Table Data:", updatedData);
                    return [...updatedData];  // Ensure state updates properly
                });

                Swal.fire({
                    icon: "success",
                    title: "हटवले!",
                    text: "रेकॉर्ड हटवले...!",
                    confirmButtonText: "OK",
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                });
            }

        });
    };



    const showExitAlert = () => {
        MySwal.fire({
            title: "तुम्हाला खात्री आहे का?",
            text: "तुम्हाला मागे जायचं आहे का?",
            showCancelButton: true,
            confirmButtonColor: "#00ff00",
            confirmButtonText: "हो",
            cancelButtonColor: "#092C4C",
            cancelButtonText: "नाही",
            allowOutsideClick: false,
            allowEscapeKey: false,
        }).then((result) => {
            if (result.isConfirmed) {
                setMasterData({
                    ...masterData, // Keep existing token number if needed
                    schemeno: "",
                    schemedate: "",
                    schemename: "",
                    description: "",
                    status: "",
                });
                setFormData({
                    ...formData,

                    startdate: "",
                    enddate: "",
                    duedate: "",
                    kalavadhi: "",
                    percent: "",
                });

                setTableData([]);

                const modal = document.getElementById("AddVyaparislab");

                if (modal) {
                    // Hide modal
                    modal.classList.remove("show");
                    modal.style.display = "none";
                    modal.setAttribute("aria-hidden", "true");

                    // Remove backdrop if exists
                    const modalBackdrop = document.querySelector(".modal-backdrop");
                    if (modalBackdrop) {
                        modalBackdrop.remove();
                    }

                    // Clear modal-related attributes (important for fresh open)
                    modal.removeAttribute("aria-modal");
                    modal.removeAttribute("role");

                    // Clean up body classes and styles
                    document.body.classList.remove("modal-open");
                    document.body.style.overflow = "";
                    document.body.style.paddingRight = "";
                }
                // ✅ Refresh data after exit on Bill.jsx Onproceed State
                if (onRefresh) {
                    onRefresh(); // refreshReceiptData from Bills.jsx
                }



            }
        });
    };


    // Handle keyboard shortcuts with validation
    useEffect(() => {
        const handleShortcut = (e) => {
            if (e.ctrlKey && (e.key === 'e' || e.key === 'E')) {
                e.preventDefault();
                showExitAlert();
            }
            if (e.ctrlKey && (e.key === 's' || e.key === 'S')) {
                e.preventDefault();
                validateinput();
            }
        };

        window.addEventListener('keydown', handleShortcut);

        return () => {
            window.removeEventListener('keydown', handleShortcut);
        };
    }, [masterData, handleSubmit]);

    // validation on C+S only for master inputs
    const validateinput = (e) => {
        const { schemedate, schemename, description, status } = masterData;


        // if (!schemedate || !/^\d{12}$/.test(schemedate))
        if (!schemedate) {
            Swal.fire({
                icon: "error",
                title: "वैधता त्रुटी",
                text: "कृपया तारीख निवडा.",
                allowOutsideClick: false,
                allowEscapeKey: false,
            }).then(() => {
                schemedateRef.current.focus();
            });
            return;
        }
        if (!schemename || !/^(?!\s*$)[A-Za-z ]+$/.test(schemename)) {
            Swal.fire({
                icon: "error",
                title: "वैधता त्रुटी",
                text: "कृपया योजना नाव प्रविष्ट करा.",
                allowOutsideClick: false,
                allowEscapeKey: false,
            }).then(() => {
                schemenameRef.current.focus();
            });
            return;
        }
        if (!description || !/^(?!\s*$)[A-Za-z0-9 .,!?()'\-]+$/.test(description)) {
            Swal.fire({
                icon: "error",
                title: "वैधता त्रुटी",
                text: "कृपया वर्णन प्रविष्ट करा.",
                allowOutsideClick: false,
                allowEscapeKey: false,
            }).then(() => {
                descriptionRef.current.focus();
            });
            return;
        }
        if (!status) {
            Swal.fire({
                icon: "error",
                title: "वैधता त्रुटी",
                text: "कृपया स्थिती निवडा.",
                allowOutsideClick: false,
                allowEscapeKey: false,
            }).then(() => {
                statusRef.current.focus();
            });
            return;
        }

        // Check if there are records in the details table
        if (tableData.length === 0) {
            Swal.fire({
                icon: "error",
                title: "तपशील तालिकेची वैधता त्रुटी",
                text: "कृपया सेव्ह करण्यापूर्वी किमान एक उत्पादन जोडा.",
                allowOutsideClick: false,
                allowEscapeKey: false,
            });
            return;
        }


        handleSubmit(event);
    };

    //on enter form will save.function
    const handleKeyDown = (e, nextRef, isLast = false) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (isLast) {
                addRecord();
            } else if (nextRef && nextRef.current) {
                nextRef.current.focus();
            }
        }
    };


    //////////////////////////////////////////////////////////////



    return (
        <div>
            {/* master inputs */}
            <div className="modal fade" id="AddVyaparislab">

                <div className="modal-dialog modal-dialog-centered modal-fullscreen">
                    <div className="modal-content">
                        <div className="page-wrapper-new p-0">
                            <div className="content">
                                <div className="modal-header border-0 custom-modal-header">
                                    <div className="page-title">
                                        <h4>व्यापारी स्लॅब</h4>
                                    </div>

                                    <div className="page-btn">

                                        <Link className="btn btn-secondary"
                                            onClick={showExitAlert}
                                        >
                                            <ArrowLeft className="me-2" />
                                            मागे
                                        </Link>
                                    </div>
                                </div>
                                <div className="modal-body custom-modal-body" style={{
                                    overflow: "hidden",
                                }}>
                                    <form onSubmit={handleSubmit}>

                                        <div className="row">

                                            <div className="col-lg-2 col-sm-6 col-12">

                                                <div className="mb-0">
                                                    <label className="form-label required">स्कीम नंबर</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="schemeno"
                                                        name="schemeno"
                                                        value={masterData.schemeno}
                                                        onChange={handleMasterInputChange}
                                                        readOnly
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-lg-2 col-sm-6 col-12">
                                                <div className="mb-0">
                                                    <label className="form-label required">स्कीम दिनांक </label>
                                                    <input
                                                        autoFocus
                                                        type="Date"
                                                        className="form-control"
                                                        id="schemedate"
                                                        name="schemedate"
                                                        value={masterData.schemedate}
                                                        onChange={handleMasterInputChange}
                                                        required
                                                        ref={schemedateRef}
                                                        onKeyDown={(e) => handleKeyDown(e, schemenameRef)}

                                                    />
                                                </div>
                                            </div>
                                            <div className="col-lg-8 col-sm-6 col-12">
                                                <div className="mb-0">
                                                    <label className="form-label required">स्कीम नाव</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="schemename"
                                                        name="schemename"
                                                        value={masterData.schemename}
                                                        onChange={handleMasterInputChange}
                                                        pattern="^(?!\s*$)[A-Za-z ]+$"
                                                        title="Only letters and spaces are allowed. Field cannot be empty or just spaces."
                                                        required
                                                        ref={schemenameRef}
                                                        onKeyDown={(e) => handleKeyDown(e, descriptionRef)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-lg-12 col-sm-6 col-12">
                                                <div className="mb-0">
                                                    <label className="form-label required">संदर्भ </label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="description"
                                                        name="description"
                                                        value={masterData.description}
                                                        onChange={handleMasterInputChange}
                                                        pattern="^(?!\s*$)[A-Za-z0-9 .,!?()'\-]+$"
                                                        title="Only letters and spaces are allowed. Field cannot be empty or just spaces."
                                                        required
                                                        ref={descriptionRef}
                                                        onKeyDown={(e) => handleKeyDown(e, startdateRef)}
                                                    />
                                                </div>
                                            </div>



                                        </div>




                                        {/* start (Detail) */}
                                        <div className="border p-3 rounded shadow-sm mb-4 mt-3">

                                            <div className="addservice-info">

                                                <div className="row">

                                                    <div className="col-lg-2 col-sm-6 col-12">
                                                        <div className="mb-0">
                                                            <label className="form-label required">सुरूवातीची दिनांक </label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                id="startdate"
                                                                name="startdate"
                                                                value={formData.startdate}
                                                                onChange={handleDetailInputChange}
                                                                ref={startdateRef}
                                                                onKeyDown={(e) => handleKeyDown(e, enddateRef)}
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* <div className="col-auto">
                                                        <span className="mt-4 fs-4 text-dark text-bold d-inline-block">To</span>
                                                    </div> */}

                                                    <div className="col-lg-2 col-sm-6 col-12">
                                                        <div className="mb-0">
                                                            <label className="form-label required">शेवटची दिनांक</label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                id="enddate"
                                                                name="enddate"
                                                                value={formData.enddate}
                                                                onChange={handleDetailInputChange}
                                                                ref={enddateRef}
                                                                onKeyDown={(e) => handleKeyDown(e, duedateRef)}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-lg-2 col-sm-6 col-12">
                                                        <div className="mb-0">
                                                            <label className="form-label required">अंतिम दिनांक</label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                id="duedate"
                                                                name="duedate"
                                                                value={formData.duedate}
                                                                onChange={handleDetailInputChange}
                                                                ref={duedateRef}
                                                                onKeyDown={(e) => handleKeyDown(e, kalavadhiRef)}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-lg-2 col-sm-6 col-12">
                                                        <div className="mb-0">
                                                            <label className='required'>कालावधी (Month)</label>
                                                            <Select
                                                                ref={kalavadhiRef}
                                                                placeholder="Select"
                                                                classNamePrefix="react-select"
                                                                options={kalavadhi}  // Your options for kalavadhi
                                                                value={kalavadhi.find(option => option.value === formData.kalavadhi) || null}
                                                                openMenuOnFocus={true}
                                                                onChange={(selectedOption) => {
                                                                    // Update the kalavadhi in the detailData state
                                                                    setFormData(prevState => ({
                                                                        ...prevState,
                                                                        kalavadhi: selectedOption ? selectedOption.value : '',
                                                                    }));
                                                                    // if (caretsRef.current) {
                                                                    //     caretsRef.current.focus();
                                                                    // }

                                                                }}
                                                                onKeyDown={(e) => handleKeyDown(e, percentRef)}
                                                                styles={{
                                                                    menu: (provided) => ({
                                                                        ...provided,
                                                                        zIndex: 9999, // 👈 High z-index to appear above sticky header
                                                                        position: 'absolute',
                                                                    }),
                                                                }}

                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-lg-2 col-sm-6 col-12">
                                                        <div className="mb-0">
                                                            <label className="form-label required">टक्के(%) </label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                id="percent"
                                                                name="percent"
                                                                value={formData.percent}
                                                                onChange={handleDetailInputChange}
                                                                ref={percentRef}
                                                                onKeyDown={(e) => handleKeyDown(e, addRef)} // 👈 directly call addRecord
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-lg-2 col-sm-6 col-12">
                                                        <div className="mt-3">
                                                            <button
                                                                ref={addRef}
                                                                type="button"
                                                                className="btn btn-primary w-100 mt-2"
                                                                onClick={addRecord}
                                                                onKeyDown={(e) => handleKeyDown(e, statusRef)}

                                                            >
                                                                जोडा
                                                            </button>
                                                        </div>

                                                    </div>

                                                </div>

                                            </div>


                                            <div className="col-lg-12">

                                                <div className="modal-body-table overflow-auto max-vh-100" >
                                                    <div className="table-responsive" style={{ height: "calc(40vh - 120px)" }}>
                                                        <table className="table table-bordered table-sm">
                                                            {/* <thead className="thead-dark" style={{ tableLayout: "fixed" }}> */}
                                                            <thead className="thead-dark bg-white" style={{ position: "sticky", top: 0, zIndex: 2 }}>


                                                                <tr>
                                                                    {/* <th className="col-2">पीक प्रकार </th> */}
                                                                    <th className="col-2">सुरूवातीची दिनांक</th>
                                                                    <th className="col-1">शेवटची दिनांक</th>
                                                                    <th className="col-1">अंतिम दिनांक</th>
                                                                    <th className="col-1">कालावधी</th>
                                                                    <th className="col-1">टक्के(%)</th>
                                                                    <th className="col-1 text-center" >कृती </th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>

                                                                {/* {tableData.filter((data) => !data.IsDeleted).length > 0 ? (
                                                                    tableData

                                                                        .filter((data) => !data.IsDeleted) */}
                                                                {tableData.filter(
                                                                    (data) =>
                                                                        !data.IsDeleted &&
                                                                        (data.startdate || data.enddate || data.duedate || data.kalavadhi)
                                                                ).length > 0 ? (
                                                                    tableData
                                                                        .filter(
                                                                            (data) =>
                                                                                !data.IsDeleted &&
                                                                                (data.startdate || data.enddate || data.duedate || data.kalavadhi)
                                                                        )
                                                                        .map((data, index) => (
                                                                            <tr key={data.vsdaid || index}>
                                                                                {/* <tr key={data || index}> */}

                                                                                {/* <td className="col-3">
                                                                                    {cropType.find((option) => option.value === data.croptype)?.label || "Not Found"}
                                                                                </td> */}

                                                                                <td className="col-1" >{data.startdate}</td>
                                                                                <td className="col-1" >{data.enddate}</td>
                                                                                <td className="col-1" >{data.duedate}</td>
                                                                                {/* <td className="col-1" >{data.kalavadhi}</td> */}

                                                                                <td className="col-1">
                                                                                    {Number(data.kalavadhi) === 0
                                                                                        ? 'Current Month'
                                                                                        : Number(data.kalavadhi) === 1
                                                                                            ? 'Next Month'
                                                                                            : Number(data.kalavadhi) === 2
                                                                                                ? 'Same Date'
                                                                                                : ''}
                                                                                </td>


                                                                                <td className="col-1" >{data.percent}</td>


                                                                                <td className="col-1 text-center">
                                                                                    <Link
                                                                                        to="#"
                                                                                        onClick={() => handleEdit(data.vsdaid)}
                                                                                        className="me-2 p-1"
                                                                                        style={{ color: 'lightblue' }}
                                                                                    >
                                                                                        <Edit className="feather-edit" />
                                                                                    </Link>

                                                                                    <Link
                                                                                        to="#"
                                                                                        className="confirm-text p-2"
                                                                                        onClick={() => handleDelete(data.vsdaid)}
                                                                                    >
                                                                                        <Trash2 className="feather-trash-2 text-danger" />
                                                                                    </Link>


                                                                                </td>
                                                                            </tr>
                                                                        ))
                                                                ) : (
                                                                    <tr>
                                                                        <td colSpan="8" className="text-center">No records found</td>
                                                                    </tr>
                                                                )
                                                                }
                                                            </tbody>


                                                        </table>
                                                    </div>
                                                </div>
                                            </div>




                                        </div>
                                        {/* end (Detail) */}

                                        {/* sum imputs of(Master) */}



                                        <div className="col-lg-6 offset-lg-6">
                                            <div className="mb-0">
                                                <label className='required'>स्थिती </label>
                                                <Select
                                                    ref={statusRef}
                                                    placeholder="Select Counter"
                                                    classNamePrefix="react-select"
                                                    options={status}
                                                    value={status.find(option => option.value == masterData.status) || null}
                                                    openMenuOnFocus={true}
                                                    onChange={(selectedOption) => {
                                                        setMasterData(prevState => ({
                                                            ...prevState,
                                                            status: selectedOption ? selectedOption.value : '',
                                                        }));
                                                    }}
                                                    onKeyDown={(e) => handleKeyDown(e, saveRef)}
                                                    styles={{
                                                        menu: (provided) => ({
                                                            ...provided,
                                                            zIndex: 9999, // 👈 High z-index to appear above sticky header
                                                            position: 'absolute',
                                                        }),
                                                    }}
                                                    required
                                                    title="Please Select Status "
                                                />
                                            </div>
                                        </div>


                                        <div className="col-lg-12 d-flex justify-content-end mt-2">

                                            <Link className="btn btn-secondary me-2"
                                                onClick={showExitAlert}
                                            >
                                                मागे
                                            </Link>

                                            <button
                                                ref={saveRef}
                                                type="submit"
                                                className="btn btn-submit"
                                            // onClick={handleSubmit}  

                                            >
                                                सेव्ह
                                            </button>
                                        </div>



                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >

        </div >

    );
};

export default AddVyapariSlab;

