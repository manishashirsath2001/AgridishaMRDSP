
import React, { useState, useEffect, useRef } from 'react';
import moment from 'moment';
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { ACSPLGUID, baseUrl, convertToISODate } from "../../core/json/custom";
import axios from "axios";
import { all_routes } from '../../Router/all_routes';
import { useNavigate } from 'react-router-dom';
import { getUserData } from '../../Context/UserData';
const AddHolidays = ({ HAID }) => {
    const { userdetail } = getUserData();
    const route = all_routes;
    const GUID = ACSPLGUID.getNew();
    const MySwal = withReactContent(Swal);
    const navigate = useNavigate();

    const SDATERef = useRef();
    const EDATERef = useRef();
    const NODAYSRef = useRef();
    const statusRef = useRef();
    const submitRef = useRef();


    const [formData, setFormData] = useState({
        HAID: '',
        ADDHOLIDAY: '',
        SDATE: '',
        EDATE: '',
        NODAYS: '',
        HASTATUS: false,
    });

    //Edit
    useEffect(() => {
        const fetchData = async () => {
            if (HAID) {
                try {
                    const payload = {
                        haid: HAID,
                        companyid: userdetail?.companyID || "",
                        deptid: userdetail?.departmentID || "",
                    };

                    const headers = {
                        "Content-Type": "application/json",
                        Accept: "*/*",
                    };

                    // Make the API request with async/await
                    const response = await axios({
                        method: "POST",
                        url: baseUrl.Url + "/backend/api/GET_HRM_Holiday",
                        data: JSON.stringify(payload),
                        headers: headers,
                    });

                    if (response.status !== 200) {
                        throw new Error("Failed to Fetch Holiday Data");
                    }

                    let apiData = response.data[0];

                    setFormData((prev) => ({
                        ...prev,
                        HAID: apiData.haid,
                        ADDHOLIDAY: apiData.addholiday,
                        SDATE: convertToISODate(apiData.sdate),
                        EDATE: convertToISODate(apiData.edate),
                        NODAYS: apiData.nodays,
                        HASTATUS: apiData.hastatus,

                    }));


                } catch (error) {
                    console.error("Error fetching Access Right Data:", error);
                }
            }
        };

        fetchData();
    }, [HAID]);


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
                // Reset formData
                setFormData({
                    HAID: '',
                    ADDHOLIDAY: '',
                    SDATE: '',
                    EDATE: '',
                    NODAYS: '',
                    HASTATUS: false,
                });


                // Close Modal
                const modal = document.getElementById("AddHolidays");
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
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        const form = e.target.closest("form");
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
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
            const payload = {
                "haid": HAID ? HAID : GUID,
                "addholiday": formData.ADDHOLIDAY,
                "sdate": formData.SDATE || "",
                "edate": formData.EDATE || "",
                "nodays": formData.NODAYS,
                "hastatus": formData.HASTATUS,
                "companyid": userdetail?.companyID || "",
                "deptid": userdetail?.departmentID || "",
            };

            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            const response = await axios({
                method: "POST",
                url: baseUrl.Url + "/backend/api/SP_AddUpdHRMHoliday",
                data: JSON.stringify(payload),
                headers: headers,
            });

            console.log("Response Received:", response.data);
            Swal.fire({
                icon: "success",
                title: "Saved!",
                text: "Data saved successfully.",
                confirmButtonText: "OK",
            });

            setFormData({
                ADDHOLIDAY: '',
                SDATE: '',
                EDATE: '',
                NODAYS: '',
                HASTATUS: false,
            });
            navigate(route.holidays);
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
    }, [formData, navigate, route.holidays, handleSubmit]);


    const checkFormValidity = () => {
        // Basic validation for all fields
        if (!formData.ADDHOLIDAY) {
            Swal.fire({
                icon: "error",
                title: "Validation Error",
                text: "Holiday name is required.",
            });
            return false;
        }

        if (!formData.SDATE || !formData.EDATE) {
            Swal.fire({
                icon: "error",
                title: "Validation Error",
                text: "Both start and end dates are required.",
            });
            return false;
        }

        if (moment(formData.SDATE).isAfter(formData.EDATE)) {
            Swal.fire({
                icon: "error",
                title: "Validation Error",
                text: "Start date cannot be after end date.",
            });
            return false;
        }

        if (!formData.NODAYS || formData.NODAYS <= 0) {
            Swal.fire({
                icon: "error",
                title: "Validation Error",
                text: "Number of days should be greater than zero.",
            });
            return false;
        }

        return true;
    };

    const calculateDays = (startDate, endDate) => {
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            const diffTime = end.getTime() - start.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
            return diffDays >= 0 ? diffDays : 0;
        }
        return "";
    };

    const handleDateChange = (key, value) => {
        const updatedFormData = { ...formData, [key]: value };
        updatedFormData.NODAYS = calculateDays(updatedFormData.SDATE, updatedFormData.EDATE);
        setFormData(updatedFormData);
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setFormData((prevData) => {
            if (prevData[name] === value) return prevData;
            return { ...prevData, [name]: value };
        });
    };

    const handleStatusChange = () => {
        setFormData({ ...formData, HASTATUS: !formData.HASTATUS });
    };

    const handleEnterKey = (e, nextRef) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (nextRef && nextRef.current) {
                nextRef.current.focus();
            }
        }
    };

    return (
        <div>
            <div className="modal fade" id="AddHolidays">
                <div className="modal-dialog modal-dialog-centered custom-modal-two">
                    <div className="modal-content">
                        <div className="page-wrapper-new p-0">
                            <div className="content">
                                <div className="modal-header border-0 custom-modal-header">
                                    <div className="page-title">
                                        <h4>Add Holiday</h4>
                                    </div>
                                    <button
                                        type="button"
                                        className="close"
                                        // data-bs-dismiss="modal"
                                        aria-label="Close"
                                        onClick={showExitAlert}
                                    >
                                        <span aria-hidden="true">×</span>
                                    </button>
                                </div>
                                <div className="modal-body custom-modal-body">
                                    <form onSubmit={handleSubmit}>
                                        <div className="row">
                                            <div className="col-lg-12">
                                                <div className="mb-3">
                                                    <label>अवकाश जोडा</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="ADDHOLIDAY"
                                                        value={formData.ADDHOLIDAY}
                                                        onChange={handleInputChange}
                                                        onKeyDown={(e) => handleEnterKey(e, SDATERef)}
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-lg-6">
                                                <div className="input-blocks">
                                                    <label>प्रारंभ तारीख</label>
                                                    <div className="input-groupicon calender-input">
                                                        <div>
                                                            <input
                                                                type="date"
                                                                ref={SDATERef}
                                                                className="form-control"
                                                                value={formData.SDATE}
                                                                onChange={(e) => handleDateChange("SDATE", e.target.value)}
                                                                onKeyDown={(e) => handleEnterKey(e, EDATERef)}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-lg-6">
                                                <div className="input-blocks">
                                                    <label>समाप्त तारीख</label>
                                                    <div className="input-groupicon calender-input">
                                                        <div>
                                                            <input
                                                                type="date"
                                                                className="form-control"
                                                                value={formData.EDATE}
                                                                ref={EDATERef}
                                                                onChange={(e) => handleDateChange("EDATE", e.target.value)}
                                                                onKeyDown={(e) => handleEnterKey(e, NODAYSRef)}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-lg-12">
                                                <div className="input-blocks">
                                                    <label>दिवसांची संख्या</label>
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        name="NODAYS"
                                                        value={formData.NODAYS}
                                                        ref={NODAYSRef}
                                                        onKeyDown={(e) => handleEnterKey(e, submitRef)}
                                                        readOnly // To prevent manual editing
                                                    />
                                                </div>
                                            </div>

                                            <div className="input-blocks m-0">
                                                <div className="status-toggle modal-status d-flex justify-content-between align-items-center">
                                                    <span className="status-label">स्थिती</span>
                                                    <input
                                                        type="checkbox"
                                                        id="user5"
                                                        className="check"
                                                        checked={formData.HASTATUS}
                                                        onChange={handleStatusChange}
                                                    />
                                                    <label htmlFor="user5" className="checktoggle"></label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="modal-footer-btn">
                                            <button
                                                type="button"
                                                className="btn btn-cancel me-2"
                                                onClick={showExitAlert}
                                            >
                                                रद्द करा
                                            </button>
                                            <button type="submit" className="btn btn-submit" ref={submitRef}>
                                                सबमिट करा
                                            </button>
                                        </div>
                                    </form>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddHolidays;
