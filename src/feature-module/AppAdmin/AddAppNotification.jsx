import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import { all_routes } from "../../Router/all_routes";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { setToogleHeader } from "../../core/redux/action";
import { baseUrl, ACSPLGUID, convertToISODate } from "../../core/json/custom";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axios from 'axios';
import { getUserData } from '../../Context/UserData';
import { ArrowLeft, ChevronUp, } from "feather-icons-react/build/IconComponents";
const AddAppNotification = () => {
    const location = useLocation();
    const { notiID } = location.state || {};
    console.log('notiID  ', notiID)
    const navigate = useNavigate();
    const route = all_routes;
    const dispatch = useDispatch();
    const GUID = ACSPLGUID.getNew()
    // const LOGTYPERef = useRef(null);
    const notiTitleRef = useRef(null);
    const notiDescriptionRef = useRef(null);
    const StatusRef = useRef(null);
    const notiSDateRef = useRef(null);
    const notiEDateRef = getUserData();
    const isactiveRef = useRef(null);
    const userdetail = getUserData();
    const data = useSelector((state) => state.toggle_header);
    const renderCollapseTooltip = (props) => (
        <Tooltip id="refresh-tooltip" {...props}>
            Collapse
        </Tooltip>
    );
    const nameInputRef = useRef(null);
    useEffect(() => {
        if (nameInputRef.current) {
            nameInputRef.current.focus();
        }
    }, []);
    const MySwal = withReactContent(Swal);
    const [formData, setFormData] = useState({
        notiID: "",
        notiTitle: "",
        notiDescription: "",
        notiSDate: "",
        notiEDate: "",
        logtype: "",
        isactive: "",
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };
    const handleSelectChange = (selectedOption, field) => {
        console.log('selecteddropdown', selectedOption.value)
        setFormData(prevData => ({
            ...prevData,
            [field]: selectedOption ? selectedOption.value : '',
        }));
    };
    const handleSubmit = (e, event) => {
        e.preventDefault();
        console.log('Form Data:', formData);
        showConfirmationAlert(event);
    };
    const showConfirmationAlert = () => {
        MySwal.fire({
            title: 'तुम्हाला खात्री आहे का?',
            text: 'तुम्हाला डेटाला सेव्ह करायचं आहे का?',
            showCancelButton: true,
            confirmButtonColor: '#00ff00',
            confirmButtonText: 'सेव्ह करा',
            cancelButtonColor: '#092C4C',
            cancelButtonText: 'रद्द करा',
        }).then((result) => {
            if (result.isConfirmed) {
                handleFormSubmission();

            }
        });
    };
    const handleFormSubmission = async () => {
        try {
            const payload = {
                notiID: notiID ? notiID : GUID,
                notiTitle: formData.notiTitle,
                notiDescription: formData.notiDescription,
                notiSDate: formData.notiSDate ? new Date(formData.notiSDate).toISOString() : "",
                notiEDate: formData.notiEDate ? new Date(formData.notiEDate).toISOString() : "",
                logtype: 0,
                isactive: formData.isactive,
                companyid: "",
                deptid: "",
                uaid: userdetail?.uaid ? userdetail.uaid : "",
                date: "",
            };
            console.log("payload", payload);
            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };
            await axios({
                method: "POST",
                url: baseUrl.Url + "/api/SP_AddUpdNotification",
                data: JSON.stringify(payload),
                headers: headers,
            });
            Swal.fire({
                icon: "success",
                title: "Saved!",
                text: "Data saved successfully.",
                confirmButtonText: "OK",
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate(route.AppNotification);
                }
            });
            setFormData({
                notiID: "",
                notiTitle: "",
                notiDescription: "",
                notiSDate: "",
                notiEDate: "",
                logtype: "",
                isactive: "",
            });
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
        if (!notiID) return;
        const fetchMasterData = async () => {
            try {
                const payload1 = {
                    "notiID": notiID,
                    "keyword": "%",
                    "companyid": "",
                    "deptid": "",
                }
                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*"
                };
                const response = await axios.post(
                    baseUrl.Url + "/api/GET_Notification",
                    payload1,
                    { headers }
                );
                if (response.status !== 200) throw new Error("Failed to fetch data");
                let apiData = response.data[0];
                setFormData((prev) => ({
                    ...prev,
                    // notiID: apiData.notiID,
                    notiTitle: apiData.notiTitle,
                    notiDescription: apiData.notiDescription,
                    notiSDate: convertToISODate(apiData.notiSDate),
                    notiEDate: convertToISODate(apiData.notiEDate),
                    logtype: "",
                    isactive: apiData.isactive,
                }));
                // const formatDate = (dateString) => {
                //     if (dateString) {
                //         const date = new Date(dateString);
                //         return date.toISOString().split("T")[0];
                //     }
                //     return "";
                // };
                console.log(" Master Data:", apiData);
            } catch (error) {
                console.error("Error in Master API Call:", error);
            }
        };
        fetchMasterData();
    }, [notiID]);
    // const [status, setstatus] = useState([]);
    const [LOGTYPE, setLOGTYPE] = useState([]);


    const [status, setstatus] = useState([]);

    console.log("status status statusstatus status ", status)
    useEffect(() => {
        const fetchVariety = async () => {
            try {
                const payload = {
                    implicationGroup: "STATUS",
                };

                const varietyRes = await axios.post(
                    baseUrl.Url + "/api/getImplications",
                    payload,
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );

                console.log("API Response:", varietyRes.data);

                setstatus(
                    varietyRes.data.map(({ iTitle, iValue }) => ({
                        label: iTitle,
                        value: iValue,
                    }))
                );
            } catch (err) {
                console.error("Error fetching variety:", err);
            }
        };

        fetchVariety();
    }, []);


    const checkFormValidity = (e) => {
        const {
            notiTitle,
            notiSDate,
            notiEDate,
            isactive,
        } = formData;

        if (!notiTitle) {
            Swal.fire({
                icon: "error",
                title: "Validation Error",
                text: "शीर्षक आवश्यक आहे",
            }).then(() => {
                notiTitleRef.current.focus();
            });
            return;
        }
        if (!notiSDate) {
            Swal.fire({
                icon: "error",
                title: "Validation Error",
                text: " तारीख आवश्यक आहे",
            }).then(() => {
                notiSDateRef.current.focus();
            });
            return;
        }
        if (!notiEDate) {
            Swal.fire({
                icon: "error",
                title: "Validation Error",
                text: "समाप्ती तारीख आवश्यक आहे",
            }).then(() => {
                notiEDateRef.current.focus();
            });
            return;
        }
        if (!isactive) {
            Swal.fire({
                icon: "error",
                title: "Validation Error",
                text: "स्थिती आवश्यक आहे",
            }).then(() => {
                isactiveRef.current.focus();
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
            text: "तुम्हाला मागे जायचं आहे का?",
            showCancelButton: true,
            confirmButtonColor: "#00ff00",
            confirmButtonText: "हो",
            cancelButtonColor: "#092C4C",
            cancelButtonText: "नाही",
        }).then((result) => {
            if (result.isConfirmed) {
                navigate(route.AppNotification)
            }
        });
    };
    const handleKeyDown = (e, nextInputRef) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (nextInputRef && nextInputRef.current) {
                nextInputRef.current.focus();
            }
        }
    };
    return (
        <>
            <div className="page-wrapper ">
                <div className="content">
                    <div className="page-header">
                        <div className="add-item d-flex">
                            <div className="page-title">
                                <h3>नवीन सूचना </h3>
                                <h6>नवीन सूचना बनवा </h6>
                            </div>
                        </div>
                        <ul className="table-top-head">
                            <li>
                                <div className="page-btn">
                                    <Link to={route.AppNotification} className="btn btn-secondary">
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
                            <div className="card-body">
                                <form onSubmit={handleSubmit} >
                                    <div className="mb-3 row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label required">
                                                शीर्षक
                                            </label>
                                            <input
                                                type="text"
                                                name="notiTitle"
                                                className="form-control"
                                                value={formData.notiTitle}
                                                onChange={handleChange}
                                                ref={notiTitleRef}
                                                onKeyDown={(e) => handleKeyDown(e, notiDescriptionRef)}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-3 mb-3">
                                            <label className="form-label required">
                                                सुरुवातीची तारीख
                                            </label>
                                            <input
                                                type="date"
                                                name="notiSDate"
                                                className="form-control"
                                                value={formData.notiSDate}
                                                onChange={handleChange}
                                                ref={notiSDateRef}
                                                onKeyDown={(e) => handleKeyDown(e, notiEDateRef)}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-3 mb-3">
                                            <label className="form-label required">
                                                समाप्ती तारीख
                                            </label>
                                            <input
                                                type="date"
                                                name="notiEDate"
                                                className="form-control"
                                                value={formData.notiEDate}
                                                onChange={handleChange}
                                                ref={notiEDateRef}
                                                onKeyDown={(e) => handleKeyDown(e, StatusRef)}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label ">
                                                वर्णन
                                            </label>
                                            <textarea
                                                name="notiDescription"
                                                className="form-control"
                                                value={formData.notiDescription}
                                                onChange={handleChange}
                                                rows={3}
                                                ref={notiDescriptionRef}
                                                onKeyDown={(e) => handleKeyDown(e, notiSDateRef)}
                                            />
                                        </div>
                                        <div className="col-lg-3">
                                            <label className="form-label required">
                                                स्थिती
                                            </label>
                                            <Select
                                                name="isactive"
                                                classNamePrefix="react-select"
                                                options={status}
                                                placeholder="Select"
                                                value={
                                                    status.find((option) => option.value === formData.isactive) ||
                                                    null
                                                }
                                                onChange={(opt) => handleSelectChange(opt, "isactive")}
                                                ref={StatusRef}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-lg-8">
                                        <div className="btn-addproduct mb-4">
                                            <button type="button" onClick={showExitAlert} className="btn btn-cancel me-2">
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
export default AddAppNotification;


