import React, { useState, useEffect, useRef } from 'react';
// import { Link } from 'react-router-dom';
import Swal from "sweetalert2";
// import { ArrowLeft } from "feather-icons-react/build/IconComponents";
import withReactContent from "sweetalert2-react-content";
import axios from "axios";
import Select from 'react-select'
import { ACSPLGUID, baseUrl } from "../../json/custom";

const AddWarranty = ({ WARTID }) => {
    const MySwal = withReactContent(Swal);
    const GUID = ACSPLGUID.getNew();
    const [product, setproduct] = useState([]);
    const [period, setperiod] = useState([]);
    const [formData, setFormData] = useState({
        WARTID: '',
        WARTNAME: '',
        WARTDURATION: '',
        WARTPERIODS: '',
        WARTDESCRIPTION: '',
        WARTSTATUS: false
    });
    const WARTNAMERef = useRef(null);
    const WARTDURATIONRef = useRef(null);
    const WARTPERIODSRef = useRef(null);

    useEffect(() => {
        const fetchProductData = async () => {
            try {
                const payload = {
                    "ctaid": "%",
                    "companyid": "COMP123456789",
                    "deptid": "D001"
                }
                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };

                axios({
                    method: "POST",
                    url: baseUrl.Url + "/backend/api/GET_CategoryProduct",
                    data: JSON.stringify(payload),
                    headers: headers,
                })
                    .then((response) => {
                        if (response.status != 200) throw new Error("Failed to Fetching Data");
                        const DATA = response.data;
                        const formofproductData = DATA
                            .map(({ pname, paid }) => ({
                                label: pname,
                                value: paid,
                            }));
                        setproduct(formofproductData);


                    })

            } catch (error) {
                console.error("Error fetching Access Right Data:", error);
            }

        };



        const fetchperiods = async () => {
            try {
                const response = await axios.get(
                    baseUrl.Url + "/backend/api/Implications/PTYPES",

                );

                if (response.status !== 200) throw new Error("Failed to fetch implications data");

                const data = response.data;
                const implicationsDropdown = data.map(({ iTitle, iValue }) => ({
                    label: iTitle,
                    value: iValue,
                }));

                setperiod(implicationsDropdown);
            } catch (error) {
                console.error("Error fetching implications:", error);
            }
        };

        fetchperiods();
        fetchProductData();


    }, []);
    useEffect(() => {
        if (WARTID) {
            try {
                const payload1 = {
                    "wartid": WARTID,
                    "keyword": "%",
                    "companyid": "",
                    "deptid": ""
                }
                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };
                axios({
                    method: "POST",
                    url: baseUrl.Url + "/backend/api/GET_Warranty",
                    data: JSON.stringify(payload1),
                    headers: headers,
                })
                    .then((response) => {
                        if (response.status != 200) throw new Error("Failed to Fetching Data");
                        let apiData = response.data[0];
                        setFormData(prev => ({
                            ...prev,
                            WARTID: apiData.wartid,
                            WARTPERIODS: period.find((Periods) => Periods.value == response.data[0].wartperiods)?.value || "",
                            WARTNAME: apiData.pname,
                            WARTDURATION: apiData.wartduration,
                            WARTDESCRIPTION: apiData.wartdescription,
                            WARTSTATUS: apiData.wartstatus === 'true' || apiData.wartstatus === true

                        }));
                        console.log("Expense data", apiData);
                    })

            } catch (error) {
                console.error("Error fetching Access Right Data:", error);
            }
        }
    }, [WARTID]);



    const handleSubmit = (e) => {
        e.preventDefault();
        showConfirmationAlert(e);
        console.log("Form Data Submitted: ", formData);
    };



    const showConfirmationAlert = (event) => {
        MySwal.fire({
            title: "तुम्हाला खात्री आहे का?",
            text: "तुम्हाला ही माहिती जतन करायची आहे का?",
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
                "wartid": WARTID ? WARTID : GUID,
                "pname": formData.WARTNAME,
                "wartduration": formData.WARTDURATION,
                "wartperiods": formData.WARTPERIODS,
                "wartdescription": formData.WARTDESCRIPTION,
                "wartstatus": formData.WARTSTATUS.toString(),
                "companyid": "",
                "deptid": ""

            }
            console.log(payload1);
            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            const response1 = await axios.post(baseUrl.Url + "/backend/api/SP_AddUpdWarrranty", payload1, { headers });

            if (response1.status === 200) {
                Swal.fire({
                    icon: "success",
                    title: "Saved!",
                    text: "Data saved successfully.",
                    confirmButtonText: "OK",
                }).then((result) => {
                    if (result.isConfirmed) {
                        const modal = document.getElementById("add-units");
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
                            WARTNAME: '',
                            WARTDURATION: '',
                            WARTPERIODS: '',
                            WARTDESCRIPTION: '',
                            WARTSTATUS: false

                        })

                    }
                });

            }
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


    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        const updatedValue = value.replace(/^\s+/, "");
        if (type === 'checkbox') {
            setFormData({ ...formData, [name]: checked });
        } else {
            setFormData({ ...formData, [name]: updatedValue });
        }
    };


    const handleSelectChange = (selectedOption) => {
        setFormData({ ...formData, WARTPERIODS: selectedOption.value });
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
        const { WARTNAME, WARTDURATION, WARTPERIODS } = formData;

        if (!WARTNAME) {
            Swal.fire({
                icon: "error",
                title: " त्रुटी",
                text: "कृपया वैध वॉरंटी नाव टाका.",
                allowOutsideClick: false,
                allowEscapeKey: false,
            }).then(() => {
                setTimeout(() => {
                    WARTNAMERef.current?.focus();
                }, 500);
            });
            return;
        }

        if (!WARTDURATION) {
            Swal.fire({
                icon: "error",
                title: " त्रुटी",
                text: "कृपया कालावधी टाका.",
                allowOutsideClick: false,
                allowEscapeKey: false,
            }).then(() => {
                setTimeout(() => {
                    WARTDURATIONRef.current?.focus();
                }, 500);
            });
            return;
        }

        if (!WARTPERIODS) {
            Swal.fire({
                icon: "error",
                title: " त्रुटी",
                text: "कृपया कालावधी निवडा.",
                allowOutsideClick: false,
                allowEscapeKey: false,
            }).then(() => {
                setTimeout(() => {
                    WARTPERIODSRef.current?.focus();
                }, 500);
            });
            return;
        }


        handleSubmit(e);
    };

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
            allowEscapeKey: false,
        }).then((result) => {
            if (result.isConfirmed) {
                // Reset formData
                setFormData({
                    WARTNAME: '',
                    WARTDURATION: '',
                    WARTPERIODS: '',
                    WARTDESCRIPTION: '',
                    WARTSTATUS: false

                });
                const modal = document.getElementById("add-units");
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
        <>
            {/* Add Warranty */}
            <div className="modal fade" id="add-units">
                <div className="modal-dialog modal-dialog-centered custom-modal-two">
                    <div className="modal-content">
                        <div className="page-wrapper-new p-0">
                            <div className="content">
                                <div className="modal-header border-0 custom-modal-header">
                                    <div className="page-title">
                                        <h4>वॉरंटी जोडा</h4>
                                    </div>
                                    <button
                                        type="button"
                                        className="close"
                                        onClick={showExitAlert}
                                    >
                                        <span aria-hidden="true">×</span>
                                    </button>
                                </div>
                                <div className="modal-body custom-modal-body">
                                    <form onSubmit={handleSubmit}>
                                        <div className="mb-3">
                                            <label className='form-label required'>उत्पादन</label>
                                            <Select
                                                classNamePrefix="react-select"
                                                options={product}
                                                value={product.find((option) => option.value === formData.WARTNAME) || null}
                                                onChange={(selectedOption) => {
                                                    setFormData((prevData) => ({
                                                        ...prevData,
                                                        WARTNAME: selectedOption ? selectedOption.value : '',
                                                    }));
                                                }}
                                                openMenuOnFocus={true}
                                            />
                                        </div>
                                        <div className="row">
                                            <div className="col-lg-6">
                                                <div className="mb-3 ">
                                                    <label className="form-label required">कालावधी</label>
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        name="WARTDURATION"
                                                        ref={WARTDURATIONRef}
                                                        value={formData.WARTDURATION}
                                                        onChange={handleInputChange}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-lg-6">
                                                <div className="">
                                                    <label className="form-label required">कालावधीची मुदत</label>
                                                    <Select
                                                        classNamePrefix="react-select"
                                                        options={period}
                                                        ref={WARTPERIODSRef}
                                                        value={period.find(option => option.value === formData.WARTPERIODS)}
                                                        onChange={handleSelectChange}
                                                        placeholder="कालावधी निवडा"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-lg-12">
                                                <div className="mb-3 ">
                                                    <label className="form-label">वर्णन</label>
                                                    <textarea
                                                        className="form-control"
                                                        name="WARTDESCRIPTION"
                                                        value={formData.WARTDESCRIPTION}
                                                        onChange={handleInputChange}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mb-0">
                                            <div className="">
                                                <span className="form-label">स्थिती</span>
                                                <input
                                                    type="checkbox"
                                                    id="user2"
                                                    className="check"
                                                    name="WARTSTATUS"
                                                    checked={formData.WARTSTATUS}
                                                    onChange={handleInputChange}
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

            {/* /Add Warranty */}
        </>
    )
}

export default AddWarranty;

