import { useNavigate } from 'react-router-dom';
import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { useLocation } from 'react-router-dom';
import { ArrowLeft, Trash2, Edit } from "feather-icons-react/build/IconComponents";
import axios from "axios";
import { ACSPLGUID, baseUrl, convertToISODate } from "../../core/json/custom";
import { getUserData } from '../../Context/UserData';

function AddVyapariLimit({ vsaid, onRefresh }) {

    console.log(vsaid, "vsaid")
    const location = useLocation();
    // const { vsaid } = location.state || {};
    const GUID = ACSPLGUID.getNew();
    const { userdetail } = getUserData();
    const MySwal = withReactContent(Swal);
    const VyapariRef = useRef(null);
    const vehicleCapacityRef = useRef(null);
    const amountRef = useRef(null);

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        vsaid: '',
        VNAME: '',


        AMOUNT: '',


    });


    const handleFormSubmission = async () => {
        try {
            const payload = {
                "vsaid": vsaid ? vsaid : GUID,
                "vname": formData.VNAME,
                "amount": formData.AMOUNT,
                "companyid": userdetail?.companyID ? userdetail.companyID : "",
                "deptid": userdetail?.departmentID ? userdetail.departmentID : "",
                "uaid": userdetail?.uaid ? userdetail.uaid : "",
                "date": userdetail.APPDT
            };

            console.log("payload", payload);
            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            // await axios({
            //     method: "POST",
            //     url: baseUrl.Url + "/backend/api/SP_AddUpdVyapariSanction",
            //     data: JSON.stringify(payload),
            //     headers: headers,
            // });
            const response = await axios.post(
                baseUrl.Url + "/backend/api/SP_AddUpdVyapariSanction",
                payload,
                { headers }
            );

            if (response.status !== 200) throw new Error("Failed to fetch details data");
            Swal.fire({
                icon: "success",
                title: "जतन झाले!",
                text: "डेटा यशस्वीरीत्या जतन झाला आहे.",
                confirmButtonText: "ठीक आहे",
                allowOutsideClick: false,
                allowEscapeKey: false,

            });

            setFormData({
                vsaid: '',
                VNAME: '',

                AMOUNT: '',

            });

            setFormData([]);
            const modal = document.getElementById("AddVyapariSanction");

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
            if (onRefresh) {
                onRefresh(); // refreshReceiptData from Bills.jsx
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


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
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
            allowOutsideClick: false,
            allowEscapeKey: false,
        }).then((result) => {
            if (result.isConfirmed) {
                handleFormSubmission();

            }
        });
    };



    const handleFarmerChange = async (selectedOption) => {
        if (selectedOption) {
            console.log("Selected Vyapari:", selectedOption.label, "ID:", selectedOption.value);

            try {
                const payload = {
                    vpaid: selectedOption.value,
                    "companyid": userdetail?.companyID ? userdetail.companyID : "",
                    "deptid": userdetail?.departmentID ? userdetail.departmentID : "",
                };

                const headers = {
                    'Content-Type': 'application/json',
                    Accept: '*/*',
                };

                const response = await axios.post(
                    `${baseUrl.Url}/backend/api/GET_VyapariDropdown`,
                    payload,
                    { headers }
                );

                if (response.status === 200 && response.data.length > 0) {
                    const farmerData = response.data[0];

                    console.log("Fetched Farmer Data:", farmerData);

                    setFormData((prevState) => ({
                        ...prevState,
                        VNAME: selectedOption.value,
                        AMOUNT: farmerData.rate || '',
                    }));
                } else {
                    console.log("No data found for farmer.");
                    setFormData((prevState) => ({
                        ...prevState,
                        VNAME: selectedOption.value,
                        AMOUNT: '',
                    }));
                }
            } catch (error) {
                console.error('Error fetching farmer data:', error);
            }
        }
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
                setFormData({
                    vsaid: '',
                    VNAME: '',

                    AMOUNT: '',

                });

                setFormData([]);
                const modal = document.getElementById("AddVyapariSanction");

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
                if (onRefresh) {
                    onRefresh(); // refreshReceiptData from Bills.jsx
                }
            }
        });
    };




    const [vyapari, setvyapari] = useState([]);
    useEffect(() => {
        const fetchCounter = async () => {
            try {
                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };

                const payload = {
                    "companyid": userdetail?.companyID ? userdetail.companyID : "",
                    "deptid": userdetail?.departmentID ? userdetail.departmentID : "",
                };

                const response = await axios.post(
                    `${baseUrl.Url}/backend/api/GET_VaypariName`,
                    payload,
                    { headers }
                );
                if (response.status !== 200)
                    throw new Error("Failed to fetch vendor data");
                console.log("requisition setails", response.data)
                const data = response.data;
                const conuterData = data
                    .map(({ vname, vpaid }) => ({
                        label: vname,
                        value: vpaid
                    }));

                setvyapari(conuterData);
            } catch (error) {
                console.error("Error fetching vendor data:", error);
            }
        };
        fetchCounter();
    }, []);


    useEffect(() => {
        if (!vsaid) return;
        const fetchMasterData = async () => {
            try {
                const payload1 = {
                    "vsaid": vsaid,
                    "keyword": "%",
                    "companyid": userdetail?.companyID ? userdetail.companyID : "",
                    "deptid": userdetail?.departmentID ? userdetail.departmentID : "",
                }

                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*"
                };

                const response = await axios.post(
                    baseUrl.Url + "/backend/api/GET_VyapariSanction",
                    payload1,
                    { headers }
                );

                if (response.status !== 200) throw new Error("Failed to fetch data");
                let apiData = response.data[0];
                setFormData((prev) => ({
                    ...prev,
                    vsaid: apiData.vsaid,
                    VNAME: apiData.vname,
                    AMOUNT: apiData.amount,

                }));

                console.log(" Master Data:", apiData);
            } catch (error) {
                console.error("Error in Master API Call:", error);
            }
        };
        fetchMasterData();
    }, [vsaid]);

    const handleKeyDown = (e, nextRef) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (nextRef && nextRef.current) {
                nextRef.current.focus();
            }
        }
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
        const { VNAME, FARMERNAME } = formData;
        if (!VNAME) {
            Swal.fire({
                icon: "error",
                title: "त्रुटी ",
                text: "व्यापारी आवश्यक आहे.",
                allowOutsideClick: false,
                allowEscapeKey: false,
            }).then(() => {
                // TOKENRef.current.focus();
            });
            return;
        }

        // if (!BILLNO) {
        //     Swal.fire({
        //         icon: "error",
        //         title: "Validation Error",
        //         text: "बिल आवश्यक आहे",
        //     }).then(() => {
        //         BillRef.current.focus();
        //     });
        //     return;
        // }

        // if (!FARMERNAME) {
        //     Swal.fire({
        //         icon: "error",
        //         title: "Validation Error",
        //         text: "शेतकऱ्याचे नाव आवश्यक आहे.",
        //     }).then(() => {
        //         FARMERNAMERef.current.focus();
        //     });
        //     return;
        // }


        handleSubmit(e);
    };

    return (
        <div
            className="modal fade"
            id="AddVyapariSanction"
            tabIndex={-1}
            aria-labelledby="exampleModalFullscreenLabel"
            aria-hidden="true"
            data-bs-backdrop="static"
            data-bs-keyboard="false"
        >
            <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content shadow rounded-4">
                    <div className="modal-header bg-primary text-white rounded-top-4 px-4">
                        <h5 className="modal-title fw-semibold" id="exampleModalFullscreenLabel">
                            व्यापारी मान्यता
                        </h5>
                        <button
                            type="button"
                            className="btn btn-sm btn-light d-flex align-items-center"
                            data-bs-dismiss="modal"
                            onClick={showExitAlert}
                        >
                            <ArrowLeft className="me-1" />
                            मागे
                        </button>
                    </div>

                    <div className="modal-body px-4 py-3">
                        <form>
                            <div className="row g-3">
                                <div className="col-lg-6 col-md-6">
                                    <label className="form-label fw-semibold required">व्यापारी</label>
                                    <Select
                                        placeholder="Select Vyapari"
                                        classNamePrefix="react-select"
                                        options={vyapari}
                                        value={vyapari.find((option) => option.value === formData.VNAME) || null}
                                        onChange={handleFarmerChange}
                                        autoFocus
                                    />
                                </div>

                                <div className="col-lg-6 col-md-6">
                                    <label className="form-label fw-semibold">रक्कम</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="AMOUNT"
                                        value={formData.AMOUNT}
                                        onChange={handleInputChange}
                                        ref={amountRef}
                                    />
                                </div>
                            </div>

                            <div className="d-flex justify-content-end mt-4">
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary me-2"
                                    onClick={showExitAlert}
                                >
                                    मागे
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={handleSubmit}
                                >
                                    सेव्ह
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default AddVyapariLimit;

