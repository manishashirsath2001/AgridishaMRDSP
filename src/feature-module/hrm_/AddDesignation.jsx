import React, { useState, useEffect, useRef } from 'react';
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { ACSPLGUID, baseUrl, convertToISODate } from "../../core/json/custom";
import axios from "axios";
import { all_routes } from '../../Router/all_routes';
import { useNavigate } from 'react-router-dom';
import { getUserData } from '../../Context/UserData';
const AddDesignation = ({ DAID }) => {
    const route = all_routes;
    const { userdetail } = getUserData();
    const GUID = ACSPLGUID.getNew();
    const MySwal = withReactContent(Swal);
    const navigate = useNavigate();
    const DNAMERef = useRef(null);
    const DDATERef = useRef(null);

    const [formData, setFormData] = useState({
        DAID: '',
        DNAME: '',
        DDATE: '',
        DSTATUS: false,
    });

    //Edit
    useEffect(() => {
        const fetchData = async () => {
            if (DAID) {
                try {
                    const payload = {
                        daid: DAID,
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
                        url: baseUrl.Url + "/backend/api/GET_HRMDesignation",
                        data: JSON.stringify(payload),
                        headers: headers,
                    });

                    if (response.status !== 200) {
                        throw new Error("Failed to Fetch Holiday Data");
                    }

                    let apiData = response.data[0];

                    setFormData((prev) => ({
                        ...prev,
                        DAID: apiData.daid,
                        DNAME: apiData.dname,
                        DDATE: convertToISODate(apiData.ddate),
                        DSTATUS: apiData.dstatus,

                    }));

                } catch (error) {
                    console.error("Error fetching Access Right Data:", error);
                }
            }
        };

        fetchData();
    }, [DAID]);


    const handleSubmit = (e) => {
        e.preventDefault();
        const form = e.target.closest("form");
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        showConfirmationAlert();
    };
    const checkFormValidity = (e) => {
        const { DNAME, DDATE } = formData;

        if (!DNAME.trim()) {
            Swal.fire({
                icon: "error",
                title: "Validation Error",
                text: "Please enter Designation Name",
            }).then(() => {
                DNAMERef.current.focus();
            });
            return;
        }

        if (!DDATE) {
            Swal.fire({
                icon: "error",
                title: "Validation Error",
                text: "Please select a Date",
            }).then(() => {
                DDATERef.current.focus();
            });
            return;
        }

        handleSubmit(e);
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

                "daid": DAID ? DAID : GUID,
                "dname": formData.DNAME,
                "ddate": convertToISODate(formData.DDATE),
                "dstatus": formData.DSTATUS,
                "companyid": userdetail?.companyID || "",
                "deptid": userdetail?.departmentID || "",

            };

            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            const response = await axios({
                method: "POST",
                url: baseUrl.Url + "/backend/api/SP_AddUpdHRMDesignation",
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
                DNAME: '',
                DDATE: '',
                DSTATUS: false,
            });
            navigate(route.designation);
        } catch (error) {
            console.error("Submission Error:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to save data. Please try again.",
            });
        }
    };
    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });

    };


    const handleStatusChange = () => {
        setFormData({ ...formData, DSTATUS: !formData.DSTATUS });
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
    }, [formData, navigate, route.designation, handleSubmit]);


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
                    DAID: '',
                    DNAME: '',
                    DDATE: '',
                    DSTATUS: false,
                });



                // Close Modal
                const modal = document.getElementById("Adddesignation");
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
    return (
        <div>
            {/* Add Department */}
            <div className="modal fade" id="Adddesignation">
                <div className="modal-dialog modal-dialog-centered custom-modal-two">
                    <div className="modal-content">
                        <div className="page-wrapper-new p-0">
                            <div className="content">
                                <div className="modal-header border-0 custom-modal-header">
                                    <div className="page-title">
                                        <h4>Add Designation</h4>
                                    </div>
                                    <button
                                        type="button"
                                        className="close"
                                        data-bs-dismiss="modal"
                                        aria-label="Close"
                                    >
                                        <span aria-hidden="true">×</span>
                                    </button>
                                </div>
                                <div className="modal-body custom-modal-body">
                                    <form onSubmit={handleSubmit}>
                                        <div className="row">
                                            <div className="col-lg-12">
                                                <div className="mb-3">
                                                    <label>Designation Name</label>
                                                    <input
                                                        ref={DNAMERef}
                                                        type="text"
                                                        className="form-control"
                                                        name="DNAME"
                                                        value={formData.DNAME}
                                                        onChange={handleInputChange}
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-lg-6">
                                                <div className="input-blocks">
                                                    <label>Date</label>
                                                    <div className="input-groupicon calender-input">
                                                        <div >
                                                            <input
                                                                // ref={SCDATERef}
                                                                type="date"
                                                                className="form-control"
                                                                value={formData.DDATE}
                                                                placeholder="Choose Date"
                                                                onChange={(e) =>
                                                                    setFormData({
                                                                        ...formData,
                                                                        DDATE: e.target.value,
                                                                    })
                                                                }
                                                            // onKeyDown={(e) => handleKeyDown(e, SCVNORef)}

                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="input-blocks m-0">
                                                <div className="status-toggle modal-status d-flex justify-content-between align-items-center">
                                                    <span >Status</span>
                                                    <input
                                                        type="checkbox"
                                                        id="user5"
                                                        className="check"
                                                        checked={formData.DSTATUS}
                                                        onChange={handleStatusChange}
                                                    />
                                                    <label htmlFor="user5" className="checktoggle"> </label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="modal-footer-btn">
                                            <button
                                                type="button"
                                                className="btn btn-cancel me-2"
                                                // data-bs-dismiss="modal"
                                                onClick={showExitAlert}
                                            >
                                                Cancel
                                            </button>
                                            <button type="submit" className="btn btn-submit" onClick={checkFormValidity}>
                                                Submit
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* /Add Department */}
        </div>
    )
}

export default AddDesignation