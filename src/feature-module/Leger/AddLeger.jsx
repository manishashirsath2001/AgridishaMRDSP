import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import { all_routes } from "../../Router/all_routes";
// import { setToogleHeader } from "../../core/redux/action";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { setToogleHeader } from "../../core/redux/action";
import { baseUrl, ACSPLGUID, convertToISODate } from "../../core/json/custom";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axios from 'axios';
import {
    ArrowLeft,
    ChevronUp,
} from "feather-icons-react/build/IconComponents";
import { getUserData } from "../../Context/UserData";
const Leger = () => {
    const { userdetail } = getUserData();
    const location = useLocation();
    const { accaid } = location.state || {};
    console.log('accaid  ', accaid)
    const navigate = useNavigate();
    const route = all_routes;
    const dispatch = useDispatch();
    const GUID = ACSPLGUID.getNew()
    const accgidRef = useRef(null);
    const MainRef = useRef(null);
    const trnModeIDRef = useRef(null);
    const relidRef = useRef(null);
    const SubmainRef = useRef(null);
    const GeneralRef = useRef(null);
    const acctmRef = useRef(null);
    const accteRef = useRef(null);
    const data = useSelector((state) => state.toggle_header);

    const [Dropdown, setDropdown] = useState([]);
    const [Dropdown1, setDropdown1] = useState([]);
    const [Dropdown2, setDropdown2] = useState([]);
    const [Vyavhar, setVyavhar] = useState([]);
    const [Account, setAccount] = useState([]);

    const renderCollapseTooltip = (props) => (
        <Tooltip id="refresh-tooltip" {...props}>
            Collapse
        </Tooltip>
    );
    const nameInputRef = useRef(null);
    useEffect(() => {
        if (accaid == "" || accaid == null || accaid == undefined) {
            if (MainRef.current) {
                MainRef.current.focus();
            }
        }
    }, []);

    const MySwal = withReactContent(Swal);
    const [formData, setFormData] = useState({
        accaid: "",
        mgrpid: "",
        Main: "",
        Submain: "",
        General: "",
        acctm: "",
        accte: "",
        Transaction: "",
        Accounttype: "",
        levelID: "",
        sglrpid: "",
        trnModeID: "",
        relid: "",
        accgid: "",
    });
    const fetchDropdown1 = async () => {
        if (!formData.Main) return;
        try {
            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            const payload = {
                "mgrpid": formData.Main
            };

            const response = await axios.post(
                `${baseUrl.Url}/backend/api/GET_Subgroup`,
                payload,
                { headers }
            );

            if (response.status !== 200)
                throw new Error("Failed to fetch subgroup data");

            const data = response.data;
            const subgroupData = data.map(({ acctm, sgrpid }) => ({
                label: acctm,
                value: sgrpid,
            }));

            setDropdown1(subgroupData);
            setFormData(prevState => ({
                ...prevState,
                Submain: subgroupData.find(item => item.value === formData.Submain)?.value || '',
                General: Dropdown2.find(item => item.value === formData.General)?.value || '',
            }));
        } catch (error) {
            console.error("Error fetching subgroup data:", error);
        }
    };
    // const fetchDropdown2 = async () => {
    //     if (!formData.Submain) return;

    //     try {
    //         const headers = {
    //             "Content-Type": "application/json",
    //             Accept: "*/*",
    //         };

    //         const payload = {
    //             "sgrpid": formData.Submain
    //         };

    //         const response = await axios.post(
    //             `${baseUrl.Url}/backend/api/GET_GeneralGruop`,
    //             payload,
    //             { headers }
    //         );

    //         if (response.status !== 200)
    //             throw new Error("Failed to fetch general group data");

    //         const data = response.data;
    //         const generalGroupData = data.map(({ acctm, glrpid }) => ({
    //             label: acctm,
    //             value: glrpid,
    //         }));

    //         setDropdown2(generalGroupData);
    //         setFormData(prevState => ({
    //             ...prevState,
    //             General: generalGroupData.find(item => item.value === formData.General)?.value || '',
    //         }));
    //     } catch (error) {
    //         console.error("Error fetching general group data:", error);
    //     }
    // };

    useEffect(() => {

        fetchDropdown1();
    }, [formData.Main]);


    // useEffect(() => {
    //     fetchDropdown2();
    // }, [formData.Submain]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    // const handleSelectChange = (selectedOption, field) => {
    //     console.log('selecteddropdown', selectedOption.value)
    //     setFormData(prevData => ({
    //         ...prevData,
    //         [field]: selectedOption ? selectedOption.value : '',
    //     }));
    // };

    const handleSubmit = (e, event) => {
        e.preventDefault();
        console.log('Form Data:', formData);
        showConfirmationAlert(event);
    };

    const showConfirmationAlert = (event) => {
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
                handleFormSubmission(event);
            }
        });
    };

    const handleFormSubmission = async () => {
        try {
            const payload = {
                "accaid": accaid ? accaid : GUID,
                "accgid": formData.accgid.toString(),
                "mgrpid": formData.Main,
                "sgrpid": formData.Submain,
                "glrpid": accaid ? accaid : GUID,
                "sglrpid": "",
                "levelID": "3",
                "acctm": formData.acctm,
                "accte": formData.accte,
                "trnModeID": formData.trnModeID,
                "relid": formData.relid,
                "uaid": userdetail?.uaid || "",
                "companyid": userdetail?.companyID || ""
                , "date": userdetail.APPDT,
            };

            console.log("payload", payload);
            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            await axios({
                method: "POST",
                url: baseUrl.Url + "/backend/api/SP_AddUpdAccounts",
                data: JSON.stringify(payload),
                headers: headers,
            });

            Swal.fire({
                icon: "success",
                title: "जतन झाले!",
                text: "डेटा यशस्वीरित्या जतन झाला आहे.",
                confirmButtonText: "ठीक आहे",
                allowOutsideClick: false,
                allowEscapeKey: false,

            }).then((result) => {
                if (result.isConfirmed) {
                    navigate(route.Leger)
                }
            });

            setFormData({

                Main: "",
                Submain: "",
                General: "",
                acctm: "",
                accte: "",
                Transaction: "",
                Accounttype: "",
                levelID: "",
                sglrpid: "",
                trnModeID: "",
                relid: "",
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


    const fetchAccount = async () => {
        try {
            const response = await axios.get(
                baseUrl.Url + "/backend/api/Implications/RELID",

            );

            if (response.status !== 200) throw new Error("Failed to fetch implications data");

            const data = response.data;
            const implicationsDropdown = data.map(({ iTitle, iValue }) => ({
                label: iTitle,
                value: iValue,
            }));

            setAccount(implicationsDropdown);

        } catch (error) {
            console.error("Error fetching implications:", error);
        }
    };

    const fetchServiceTypes = async () => {
        try {
            const response = await axios.get(
                baseUrl.Url + "/backend/api/Implications/CBSTATEID",
            );

            if (response.status !== 200) throw new Error("Failed to fetch implications data");

            const data = response.data;
            const implicationsDropdown = data.map(({ iTitle, iValue }) => ({
                label: iTitle,
                value: iValue,
            }));

            setVyavhar(implicationsDropdown);
            setFormData(prevState => ({
                ...prevState,
                relid: Vyavhar.find(item => item.value === formData.relid)?.value || '',
            }));
        } catch (error) {
            console.error("Error fetching implications:", error);
        }
    };

    useEffect(() => {

        fetchAccount();
        fetchServiceTypes();
    }, []);

    useEffect(() => {
        if (accaid) {
            const fetchData = async () => {
                try {
                    const payload = {
                        "accaid": accaid,
                        "keyword": '%'
                    }
                    const headers = {
                        "Content-Type": "application/json",
                        Accept: "*/*",
                    };

                    // Make the API request with async/await
                    const response = await axios({
                        method: "POST",
                        url: baseUrl.Url + "/backend/api/GET_ACCOUNT",
                        data: JSON.stringify(payload),
                        headers: headers,
                    });

                    if (response.status !== 200) {
                        throw new Error("Failed to Fetch Gate Entry Data");
                    }

                    let apiData = response.data[0];
                    if (apiData) {
                        setFormData((prev) => ({
                            ...prev,
                            accgid: apiData.accgid,
                            Main: apiData.mgrpid,
                            Submain: apiData.sgrpid,
                            General: apiData.glrpid,
                            sglrpid: apiData.accaid,
                            levelID: apiData.levelID,
                            acctm: apiData.acctm,
                            accte: apiData.accte,
                            trnModeID: apiData.trnModeID,
                            relid: apiData.relid,
                        }));
                    }
                    if (apiData.mgrpid) fetchDropdown1();
                    // if (apiData.relid) fetchAccount();
                } catch (error) {
                    console.error("Error fetching Access Right Data:", error);
                }
            };
            fetchData();
        }

    }, [accaid]);

    useEffect(() => {
        // MainRef.current.focus();
        const fetchDropdown = async () => {
            try {
                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };

                // const payload = {
                //     "accaid": "%"
                // };

                const response = await axios.post(
                    `${baseUrl.Url}/backend/api/GET_MainGroup`,
                    // payload,
                    { headers }
                );

                if (response.status !== 200)
                    throw new Error("Failed to fetch main group data");

                const data = response.data;
                const mainGroupData = data.map(({ acctm, mgrpid }) => ({
                    label: acctm,
                    value: mgrpid,
                }));

                setDropdown(mainGroupData);
            } catch (error) {
                console.error("Error fetching main group data:", error);
            }
        };
        fetchDropdown();
    }, []);


    useEffect(() => {
        if (formData.Main != '') {
            fetchDropdown1();
        }
    }, [formData.Main]);

    useEffect(() => {
        if (formData.relid != '') {
            fetchServiceTypes();
        }
    }, [formData.relid]);



    const checkFormValidity = (e) => {
        const {
            accgid,
            trnModeID,
            relid,
            Main,
            Submain,
            General,
            acctm,
            accte,
        } = formData;

        if (!accgid) {
            Swal.fire({
                icon: "error",
                title: "त्रुटी ",
                text: "खाते क्रमांक आवश्यक आहे",
                allowOutsideClick: false,
                allowEscapeKey: false,
            }).then(() => {
                accgidRef.current.focus();
            });
            return;
        }

        if (!Main) {
            Swal.fire({
                icon: "error",
                title: "त्रुटी",
                text: "मुख्य गट आवश्यक आहे",
                allowOutsideClick: false,
                allowEscapeKey: false,
            }).then(() => {
                MainRef.current.focus();
            });
            return;
        }

        if (!Submain) {
            Swal.fire({
                icon: "error",
                title: "त्रुटी",
                text: "उप गट आवश्यक आहे",
                allowOutsideClick: false,
                allowEscapeKey: false,
            }).then(() => {
                SubmainRef.current.focus();
            });
            return;
        }

        if (!General) {
            Swal.fire({
                icon: "error",
                title: "त्रुटी",
                text: "जनरल लेजर आवश्यक आहे",
                allowOutsideClick: false,
                allowEscapeKey: false,
            }).then(() => {
                GeneralRef.current.focus();
            });
            return;
        }

        if (!acctm) {
            Swal.fire({
                icon: "error",
                title: "त्रुटी",
                text: "मराठी नाव आवश्यक आहे",
                allowOutsideClick: false,
                allowEscapeKey: false,
            }).then(() => {
                acctmRef.current.focus();
            });
            return;
        }

        if (!accte) {
            Swal.fire({
                icon: "error",
                title: "त्रुटी",
                text: "इंग्रजी नाव आवश्यक आहे",
                allowOutsideClick: false,
                allowEscapeKey: false,
            }).then(() => {
                accteRef.current.focus();
            });
            return;
        }

        if (!relid) {
            Swal.fire({
                icon: "error",
                title: "त्रुटी",
                text: "व्यवहार आवश्यक आहे",
                allowOutsideClick: false,
                allowEscapeKey: false,
            }).then(() => {
                relidRef.current.focus();
            });
            return;
        }

        if (!trnModeID) {
            Swal.fire({
                icon: "error",
                title: "त्रुटी",
                text: "खाते प्रकार आवश्यक आहे",
                allowOutsideClick: false,
                allowEscapeKey: false,
            }).then(() => {
                trnModeIDRef.current.focus();
            });
            return;
        }
        handleSubmit(e);
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
            text: "तुम्हाला बाहेर पडायचे आहे का?",
            showCancelButton: true,
            confirmButtonColor: "#00ff00",
            confirmButtonText: "हो",
            cancelButtonColor: "#092C4C",
            cancelButtonText: "नाही",
            allowOutsideClick: false,
            allowEscapeKey: false,
        }).then((result) => {
            if (result.isConfirmed) {
                navigate(route.Leger)
            }
        });
    };

    const handleKeyDown = (e, nextRef) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (nextRef && nextRef.current) {
                nextRef.current.focus();
            }
        }
    };

    useEffect(() => {
        if (accaid == "" || accaid == undefined || accaid == null) {
            const fetchaccno = async () => {
                try {
                    const headers = {
                        "Content-Type": "application/json",
                        Accept: "*/*",
                    };
                    // const payload = {
                    //     "accaid": "%"
                    // };
                    const response = await axios.post(
                        `${baseUrl.Url}/backend/api/GET_GenrateACCNO`,
                        // payload,
                        { headers }
                    );
                    if (response.status !== 200)
                        throw new Error("Failed to fetch main group data");

                    const data = response.data[0].cnt;
                    setFormData({
                        ...formData,
                        accgid: data
                    });
                } catch (error) {
                    console.error("Error fetching main group data:", error);
                }
            };
            fetchaccno();
        }
    }, []);

    return (
        <>
            <div className="page-wrapper">
                <div className="content">
                    <div className="page-header">
                        <div className="add-item d-flex">
                            <div className="page-title">

                                <h3>नवीन लेजर </h3>
                                <h6>नवीन लेजर बनवा </h6>
                            </div>
                        </div>
                        <ul className="table-top-head">
                            <li>
                                <div className="page-btn">
                                    <Link onClick={() => { showExitAlert() }} className="btn btn-secondary">
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
                            <div className="card-body p-4">
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3 row">
                                        <div className="col-md-3">
                                            <label htmlFor="serviceName" className="form-label required">
                                                खाते क्रमांक
                                            </label>
                                            <input
                                                type="text"
                                                name="accgid"
                                                className="form-control"
                                                value={formData.accgid}
                                                onChange={handleChange}
                                                ref={accgidRef}
                                                style={{ fontWeight: 'bolder' }}
                                                required
                                                pattern="^[0-9]+$"
                                                title="कृपया संख्यात्मक खाते क्रमांक भरा"
                                                readOnly
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-3 row">
                                        <div className="col-lg-6 mb-3">
                                            <label className="form-label required">मुख्य गट</label>
                                            {/* <Select
                                                name="Main"
                                                autoFocus
                                                classNamePrefix="react-select"
                                                options={Dropdown}
                                                placeholder="Select"
                                                value={Dropdown.find((option) => option.value === formData.Main) || null}
                                                onChange={(selectedOption) =>
                                                    setFormData((prevState) => ({
                                                        ...prevState,
                                                        Main: selectedOption ? selectedOption.value : null,
                                                    }))
                                                }
                                                onKeyDown={(e) => handleKeyDown(e, SubmainRef)}
                                                ref={MainRef}
                                                required
                                                openMenuOnFocus={true}
                                            /> */}
                                            <Select
                                                ref={MainRef}
                                                placeholder="Select Counter"
                                                classNamePrefix="react-select"
                                                options={Dropdown}
                                                value={Dropdown.find((option) => option.value === formData.Main) || null}
                                                onChange={(selectedOption) => {
                                                    setFormData((prevState) => ({
                                                        ...prevState,
                                                        Main: selectedOption ? selectedOption.value : null,
                                                    }))
                                                    if (SubmainRef.current) {
                                                        SubmainRef.current.focus();
                                                    }
                                                }}
                                                // onKeyDown={(e) => handleKeyDown(e, SubmainRef)}
                                                openMenuOnFocus={true}
                                            />
                                        </div>

                                        <div className="col-lg-6 mb-3">
                                            <label className="form-label required">उप गट</label>
                                            <Select
                                                name="Submain"
                                                classNamePrefix="react-select"
                                                options={Dropdown1}
                                                placeholder="Select"
                                                value={Dropdown1.find((option) => option.value === formData.Submain) || null}
                                                onChange={(selectedOption) => {
                                                    setFormData((prevState) => ({
                                                        ...prevState,
                                                        Submain: selectedOption ? selectedOption.value : null,
                                                    }))
                                                    if (acctmRef.current) {
                                                        acctmRef.current.focus();
                                                    }
                                                }}
                                                required
                                                ref={SubmainRef}
                                                openMenuOnFocus={true}
                                            // onKeyDown={(e) => handleKeyDown(e, GeneralRef)}
                                            />
                                        </div>

                                        {/* <div className="col-md-4 mb-3">
                                            <label className="form-label required">जनरल लेजर </label>
                                            <Select
                                                name="General"
                                                classNamePrefix="react-select"
                                                options={Dropdown2}
                                                placeholder="Select"
                                                value={Dropdown2.find((option) => option.value === formData.General) || null}
                                                onChange={(selectedOption) => {
                                                    setFormData((prevState) => ({
                                                        ...prevState,
                                                        General: selectedOption ? selectedOption.value : null,
                                                    }))
                                                    if (acctmRef.current) {
                                                        acctmRef.current.focus();
                                                    }
                                                }}
                                                // onKeyDown={(e) => handleKeyDown(e, acctmRef)}
                                                ref={GeneralRef}
                                                openMenuOnFocus={true}
                                                required
                                            />
                                        </div> */}

                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="serviceName" className="form-label required">
                                                जनरल लेजर मराठी
                                            </label>
                                            <input
                                                type="text"
                                                name="acctm"
                                                className="form-control"
                                                value={formData.acctm}
                                                onChange={handleChange}
                                                ref={acctmRef}
                                                onKeyDown={(e) => handleKeyDown(e, accteRef)}
                                                required
                                            />
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="serviceName" className="form-label required">
                                                जनरल लेजर इंग्रजी
                                            </label>
                                            <input
                                                type="text"
                                                name="accte"
                                                className="form-control"
                                                value={formData.accte}
                                                onChange={handleChange}
                                                ref={accteRef}
                                                onKeyDown={(e) => handleKeyDown(e, relidRef)}
                                                required
                                            />
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label className="form-label required">व्यवहार </label>
                                            <Select
                                                name="relid"
                                                classNamePrefix="react-select"
                                                options={Vyavhar}
                                                placeholder="Select"
                                                ref={relidRef}
                                                value={Vyavhar.find((option) => option.value === formData.relid) || null}
                                                onChange={(selectedOption) => {
                                                    setFormData((prevState) => ({
                                                        ...prevState,
                                                        relid: selectedOption ? selectedOption.value : null,
                                                    }))
                                                    if (trnModeIDRef.current) {
                                                        trnModeIDRef.current.focus();
                                                    }
                                                }}
                                                openMenuOnFocus={true}
                                                // onKeyDown={(e) => handleKeyDown(e, trnModeIDRef)}
                                                required
                                            />
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label className="form-label required">खाते प्रकार</label>
                                            <Select
                                                name="trnModeID"
                                                classNamePrefix="react-select"
                                                options={Account}
                                                placeholder="Select"
                                                title="Please select a valid type of service."
                                                value={Account.find((option) => option.value === formData.trnModeID) || null}
                                                onChange={(selectedOption) =>
                                                    setFormData((prevState) => ({
                                                        ...prevState,
                                                        trnModeID: selectedOption ? selectedOption.value : null,
                                                    }))
                                                }
                                                ref={trnModeIDRef}
                                                openMenuOnFocus={true}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="col-lg-12">
                                        <div className="btn-addproduct mb-4">
                                            <button type="button" onClick={() => { showExitAlert() }} className="btn btn-cancel me-2">
                                                मागे
                                            </button>
                                            <button type="submit" className="btn btn-submit"> सेव्ह</button>
                                        </div>
                                    </div>
                                </form>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
export default Leger;


