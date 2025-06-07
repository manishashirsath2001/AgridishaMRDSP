import React, { useState, useEffect, useRef } from 'react';
import Select from 'react-select';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useNavigate } from "react-router-dom";
import {
    ArrowLeft,
} from "feather-icons-react/build/IconComponents";
import { ACSPLGUID, baseUrl } from '../../core/json/custom';
import axios from 'axios';
import { getUserData } from '../../Context/UserData';

const AddSubcategory = ({ CTAID }) => {
    const { userdetail } = getUserData();
    console.log(CTAID);
    const GUID = ACSPLGUID.getNew();
    const navigate = useNavigate();

    const [categories, setcategories] = useState([]);
    // const [SubCategories, setSubCategories] = useState([]);
    const [formData, setFormData] = useState({
        CTAID: '',
        CTID: '',
        CTNAME: '',
        CSTATUS: false
    });
    useEffect(() => {
        const fetchExpenseCategory = async () => {
            try {
                const payload = {
                    companyid: userdetail?.companyID || "",
                    deptid: userdetail?.departmentID || "",
                }
                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };

                axios({
                    method: "POST",
                    url: baseUrl.Url + "/backend/api/GET_CategoryDropdown",
                    data: JSON.stringify(payload),
                    headers: headers,
                })
                    .then((response) => {
                        if (response.status != 200) throw new Error("Failed to Fetching Data");
                        const DATA = response.data;
                        const formExpenseData = DATA
                            .map(({ categoryname, ctid }) => ({
                                label: categoryname,
                                value: ctid,
                            }));
                        setcategories(formExpenseData);
                    })

            } catch (error) {
                console.error("Error fetching vendor data:", error);
            }
        };

        fetchExpenseCategory();

    }, []);

    const handleFormSubmission = async () => {
        try {
            const payload = {
                "ctaid": GUID,
                "ctname": formData.CTNAME,
                "ctid": formData.CTID,
                "ctsubcatgoryid": GUID,
                "cttype": "2",
                "cstatus": formData.CSTATUS,
                companyid: userdetail?.companyID || "",
                deptid: userdetail?.departmentID || "",

            };

            console.log("payload", payload);
            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            await axios({
                method: "POST",
                url: baseUrl.Url + "/backend/api/SP_AddUpdCategoryMaster",
                data: JSON.stringify(payload),
                headers: headers,
            });

            Swal.fire({
                icon: "success",
                title: "जतन झाले!",
                text: "माहिती यशस्वीरित्या सेव केली गेली आहे.",
                confirmButtonText: "ठीक आहे",
                allowOutsideClick: false,
                allowEscapeKey: false
            });

            setFormData({
                CTID: '',
                CTNAME: '',
                CSTATUS: ''

            });


        } catch (error) {
            console.error("Submission Error:", error);
            Swal.fire({
                icon: "error",
                title: "त्रुटी",
                text: "माहिती सेव करण्यात अयशस्वी. कृपया पुन्हा प्रयत्न करा.",
                allowOutsideClick: false,
                allowEscapeKey: false
            });
        }
    };


    useEffect(() => {
        const fetchSubcategoryForEdit = async () => {
            if (CTAID) {
                try {

                    const payload = {
                        ctaid: CTAID,
                        ctid: formData.CTID,
                        companyid: userdetail?.companyID || "",
                        deptid: userdetail?.departmentID || "",
                    };

                    const response = await axios({
                        method: "POST",
                        url: baseUrl.Url + "/backend/api/GET_SubCategoryMaster",
                        data: JSON.stringify(payload),
                        headers: {
                            "Content-Type": "application/json",
                            Accept: "*/*",
                        },
                    });

                    if (response.status !== 200) throw new Error("Failed to Fetch Subcategory");
                    console.log(response.data);

                    const subcategory = response.data.find(subCategory => subCategory.ctaid === CTAID);
                    if (subcategory) {
                        setFormData({
                            // CTID: subcategory.ctid,
                            CTAID: subcategory.ctaid,
                            CTID: subcategory.find((categories) => categories.value == response.data[0].categories)?.value || "",
                            CTNAME: subcategory.subcategoryname,
                            CSTATUS: subcategory.cstatus,
                        });
                    }

                } catch (error) {
                    console.error("Error fetching subcategory data:", error);
                }
            }
        };

        fetchSubcategoryForEdit();
    }, [CTAID]);


    const MySwal = withReactContent(Swal);


    const handleSubmit = (e, event) => {
        e.preventDefault();
        console.log('Form Data:', formData);
        showConfirmationAlert(event);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleStatusChange = () => {
        setFormData({ ...formData, CSTATUS: !formData.CSTATUS });
    };

    // const handleCategoryChange = (selectedOption) => {
    //     setFormData({
    //         ...formData,
    //         CTID: selectedOption ? selectedOption.value : ''
    //     });
    // };

    const showConfirmationAlert = (event) => {
        MySwal.fire({
            title: "तुम्हाला खात्री आहे का?",
            text: "तुम्हाला ही माहिती सेव्ह करायची आहे का?",
            showCancelButton: true,
            confirmButtonColor: "#00ff00",
            confirmButtonText: "सेव्ह करा",
            cancelButtonColor: "#092C4C",
            cancelButtonText: "रद्द करा",
            allowOutsideClick: false,
            allowEscapeKey: false
        }).then((result) => {
            if (result.isConfirmed) {
                handleFormSubmission(event);
            }
        });
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
            confirmButtonText: "होय",
            cancelButtonColor: "#092C4C",
            cancelButtonText: "नाही",
            allowOutsideClick: false,
            allowEscapeKey: false
        }).then((result) => {
            if (result.isConfirmed) {
                // Reset formData
                setFormData({
                    CTAID: '',
                    CTID: '',
                    CTNAME: '',
                    CSTATUS: false

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
    }

    const CSTATUSRef = useRef(null);
    const CTIDRef = useRef(null);
    const CTNAMERef = useRef(null);
    const checkFormValidity = (e) => {
        const {
            CTID,
            CTNAME,
        } = formData;


        if (!CTID) {
            Swal.fire({
                icon: "error",
                title: "चूक आहे",
                text: "कृपया श्रेणी निवडा",
                allowOutsideClick: false,
                allowEscapeKey: false
            }).then(() => {
                CTIDRef.current.focus();
            });
            return;
        }

        if (!CTNAME) {
            Swal.fire({
                icon: "error",
                title: "चूक आहे",
                text: "कृपया उपश्रेणी भरा",
                allowOutsideClick: false,
                allowEscapeKey: false
            }).then(() => {
                CTNAMERef.current.focus();
            });
            return;
        }

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
                                        <h4>उपश्रेणी तयार करा</h4>
                                    </div>
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
                                <div className="modal-body custom-modal-body">
                                    <form onSubmit={handleSubmit}>
                                        <div className="mb-3">
                                            <label className="form-label required">श्रेणी</label>
                                            <Select
                                                classNamePrefix="react-select"
                                                options={categories}
                                                placeholder="निवडा"
                                                value={categories.find((option) => option.value === formData.CTID) || null}
                                                ref={CTIDRef}
                                                onChange={(selectedOption) => {
                                                    setFormData((prevData) => ({
                                                        ...prevData,
                                                        CTID: selectedOption ? selectedOption.value : '',
                                                    }));
                                                }}
                                                openMenuOnFocus
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label required">उपश्रेणी</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="CTNAME"
                                                value={formData.CTNAME}
                                                onChange={handleInputChange}
                                                onKeyDown={(e) => handleKeyDown(e, CSTATUSRef)}
                                                ref={CTNAMERef}
                                                required
                                            />
                                        </div>

                                        <div className="mb-0">
                                            <div className="status-toggle modal-status d-flex justify-content-between align-items-center">
                                                <span className="form-label required">स्थिती</span>
                                                <input
                                                    type="checkbox"
                                                    id="user2"
                                                    className="check"
                                                    checked={formData.CSTATUS}
                                                    onChange={handleStatusChange}
                                                    ref={CSTATUSRef}
                                                />
                                                <label htmlFor="user2" className="checktoggle" />
                                            </div>
                                        </div>
                                        <div className="modal-footer-btn">
                                            <button type="button" className="btn btn-cancel me-2" onClick={showExitAlert}>
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
        </div>

    );
};

export default AddSubcategory;
