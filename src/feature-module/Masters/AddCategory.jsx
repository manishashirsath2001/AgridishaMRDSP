import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Swal from "sweetalert2";
import { ArrowLeft } from "feather-icons-react/build/IconComponents";
import withReactContent from "sweetalert2-react-content";
import axios from "axios";
import { ACSPLGUID, baseUrl } from "../../core/json/custom";
import { getUserData } from '../../Context/UserData';
const AddCategory = ({ CTAID }) => {
    console.log(CTAID);
    const { userdetail } = getUserData();
    const [formData, setFormData] = useState({
        CTAID: "",
        CTID: "",
        CTNAME: "",
        CSTATUS: false,
    });
    const MySwal = withReactContent(Swal);
    const GUID = ACSPLGUID.getNew();
    const CTNAMERef = useRef(null);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        const updatedValue = value.replace(/^\s+/, "");

        setFormData({
            ...formData,
            [name]: updatedValue,
        });
    };


    const handleCheckboxChange = (event) => {
        setFormData({
            ...formData,
            CSTATUS: event.target.checked,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        showConfirmationAlert(e);
        console.log("Form Data Submitted: ", formData);
    };



    const showConfirmationAlert = (event) => {
        MySwal.fire({
            title: "आपल्या खात्री आहे का?",
            text: "आपण हे डेटा जतन करू इच्छिता का?",
            showCancelButton: true,
            confirmButtonColor: "#00ff00",
            confirmButtonText: "जतन करा",
            cancelButtonColor: "#092C4C",
            cancelButtonText: "रद्द करा",
            allowOutsideClick: false,
            allowEscapeKey: false,

        })
            .then((result) => {
                if (result.isConfirmed) {
                    handleFormSubmission(event); // Proceed with form submission
                }
            });
    };

    const handleFormSubmission = async () => {
        try {
            const payload1 = {
                "ctaid": CTAID ? CTAID : GUID,
                "ctname": formData.CTNAME,
                "ctid": CTAID ? CTAID : GUID,
                "ctsubcatgoryid": "",
                "cttype": "1",
                "cstatus": formData.CSTATUS,
                companyid: userdetail?.companyID || "",
                deptid: userdetail?.departmentID || "",

            }
            console.log(payload1);
            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            const response1 = await axios.post(baseUrl.Url + "/backend/api/SP_AddUpdCategoryMaster", payload1, { headers });

            if (response1.status === 200) {
                Swal.fire({
                    icon: "success",
                    title: "जतन केले!",
                    text: "डेटा यशस्वीरित्या जतन झाला आहे.",
                    confirmButtonText: "ठीक आहे",
                    allowOutsideClick: false,
                    allowEscapeKey: false,

                }).then((result) => {
                    if (result.isConfirmed) {
                        const modal = document.getElementById("add-category");
                        if (modal) {
                            modal.classList.remove("show");
                            modal.style.display = "none";
                            modal.setAttribute("aria-hidden", "true");
                        }
                        const backdrop = document.querySelector(".modal-backdrop");
                        if (backdrop) {
                            backdrop.remove();
                        }
                        document.body.classList.remove("modal-open");
                        document.body.style.overflow = "auto";

                        setFormData({
                            CTID: "",
                            CTNAME: "",
                            CSTATUS: false,

                        })

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

    };

    useEffect(() => {
        if (CTAID) {
            try {
                const payload1 = {
                    "ctaid": CTAID,
                    "cttype": "1",
                    companyid: userdetail?.companyID || "",
                    deptid: userdetail?.departmentID || "",
                }
                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };

                axios({
                    method: "POST",
                    url: baseUrl.Url + "/backend/api/GET_CategoryMasterData",
                    data: JSON.stringify(payload1),
                    headers: headers,
                })
                    .then((response) => {
                        if (response.status != 200) throw new Error("Failed to Fetching Data");
                        let apiData = response.data[0];


                        setFormData(prev => ({
                            ...prev,
                            CTAID: apiData.ctaid,
                            CTNAME: apiData.categoryname,
                            CSTATUS: apiData.cstatus,

                        }));

                        console.log("sale Bill  master data", apiData)


                    })

            } catch (error) {
                console.error("Error fetching Access Right Data:", error);
            }



        }
    }, [CTAID]);


    const showExitAlert = () => {
        MySwal.fire({
            title: "आपल्या खात्री आहे का?",
            text: "आपण बाहेर पडू इच्छिता का?",
            showCancelButton: true,
            confirmButtonColor: "#00ff00",
            confirmButtonText: "होय",
            cancelButtonColor: "#092C4C",
            cancelButtonText: "नाही",
            allowOutsideClick: false,
            allowEscapeKey: false,

        }).then((result) => {
            if (result.isConfirmed) {
                // Reset formData
                setFormData({
                    CTNAME: "",
                    CSTATUS: false,

                });

                const modal = document.getElementById("add-category");
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

    useEffect(() => {
        const handleShortcut = (e) => {
            if (e.ctrlKey && (e.key === 'e' || e.key === 'E')) {
                e.preventDefault();
                showExitAlert();
            }
            if (e.ctrlKey && (e.key === 's' || e.key === 'S')) {
                e.preventDefault();
                checkFormValidity(e);
            }
        };
        window.addEventListener('keydown', handleShortcut);

        return () => {
            window.removeEventListener('keydown', handleShortcut);
        };
    }, [formData]);

    const checkFormValidity = (e) => {
        const { CTNAME } = formData;

        if (!CTNAME) {
            Swal.fire({
                icon: "error",
                title: "वैधता त्रुटी",
                text: "कृपया वैध श्रेणी प्रविष्ट करा.",
                allowOutsideClick: false,
                allowEscapeKey: false,

            }).then(() => {
                setTimeout(() => {
                    CTNAMERef.current?.focus();
                }, 100);
            });
            return;
        }

        handleSubmit(e);
    };



    return (
        <div>
            {/* Add Category */}
            <div className="modal fade" id="add-category">
                <div className="modal-dialog modal-dialog-centered custom-modal-two">
                    <div className="modal-content">
                        <div className="page-wrapper-new p-0">
                            <div className="content">
                                <div className="modal-header border-0 custom-modal-header">
                                    <div className="page-title">
                                        <h4>नवीन कॅटेगरी </h4>
                                    </div>
                                    <div className="page-btn">
                                        <Link className="btn btn-secondary" onClick={showExitAlert} >
                                            <ArrowLeft className="" />
                                            मागे
                                        </Link>
                                    </div>
                                </div>
                                <div className="modal-body custom-modal-body">
                                    <form onSubmit={handleSubmit}>
                                        <div className="mb-3">
                                            <label className="form-label">कॅटेगरी नाव </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="CTNAME"
                                                ref={CTNAMERef}
                                                value={formData.CTNAME}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="mb-0">
                                            <div className="status-toggle modal-status d-flex justify-content-between align-items-center">
                                                <span className="status-label">स्थिती </span>
                                                <input
                                                    type="checkbox"
                                                    id="user2"
                                                    className="check"
                                                    name="CSTATUS"
                                                    checked={formData.CSTATUS}
                                                    onChange={handleCheckboxChange}

                                                />
                                                <label htmlFor="user2" className="checktoggle" />
                                            </div>
                                        </div>
                                        <div className="modal-footer-btn">
                                            <button
                                                type="button"
                                                className="btn btn-cancel me-2"
                                                onClick={showExitAlert}
                                            >
                                                मागे
                                            </button>
                                            <button type="submit" className="btn btn-submit">
                                                सेव्ह
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* /Add Category */}
        </div>
    );
};

export default AddCategory;
