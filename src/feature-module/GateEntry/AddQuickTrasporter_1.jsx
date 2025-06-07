import React, { useEffect, useRef, useState } from 'react'
import { ACSPLGUID, baseUrl } from '../../core/json/custom';
// import AddGateEntry from './AddGateEntry';
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import axios from 'axios';
import { getUserData } from '../../Context/UserData';
function AddQuickTrasporter_1({ TAID, NAME, CONTACT, VEHNO }) {
    // const [formData, setFormData] = useState({
    //     TNAME: NAME || "",
    //     TCANTACTNO: CONTACT || "",
    //     VEHICALNO: VEHNO || 'MH ',
    // });

    const [transporterExists, setTransporterExists] = useState(false);
    const { userdetail } = getUserData();
    const [formData, setFormData] = useState({
        MAID: "",
        fdaid: "",
        TAID: "",
        TNAME: NAME || "",
        TADDRESS: "",
        TCITY: "",
        TPINCODE: "",
        TCANTACTNO: CONTACT || "",
        TGSTIN: "",
        TSTATE: "",
        TPAN: "",
        TBIRTHDATE: "",
        VEHICALNO: VEHNO || 'MH ',
        VEHICALTYPE: "",
        VEHICALCAPACITY: "",
        TDATE: "",
    });
    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            TAID: "",
            TNAME: "",
            TADDRESS: "",
            TCITY: "",
            TPINCODE: "",
            TCANTACTNO: "",
            TGSTIN: "",
            TSTATE: "",
            TPAN: "",
            TBIRTHDATE: "",
            VEHICALNO: "",
            VEHICALTYPE: "",
            VEHICALCAPACITY: "",
            TDATE: "",
        }));
    }, []);

    // useEffect(() => {
    //     const modal = document.getElementById("Tranporterfrom_1");
    //     const handleModalShow = () => {
    //         const vehNo = localStorage.getItem("vehNo");
    //         if (vehNo) {
    //             setFormData(prev => ({
    //                 ...prev,
    //                 VEHICALNO: vehNo
    //             }));
    //         }
    //     };

    //     modal?.addEventListener("show.bs.modal", handleModalShow);

    //     return () => {
    //         modal?.removeEventListener("show.bs.modal", handleModalShow);
    //     };
    // }, []);

    useEffect(() => {
        const modal = document.getElementById("Tranporterfrom_1");

        const handleModalShow = () => {
            // Clear name & mobile when modal opens
            setFormData(prev => ({
                ...prev,
                TCANTACTNO: "",
                TNAME: "",
                TAID: ""
            }));
            setTransporterExists(false);

            const vehNo = localStorage.getItem("vehNo");
            if (vehNo) {
                setFormData(prev => ({
                    ...prev,
                    VEHICALNO: vehNo
                }));
            }
        };

        modal?.addEventListener("show.bs.modal", handleModalShow);

        return () => {
            modal?.removeEventListener("show.bs.modal", handleModalShow);
        };
    }, []);


    // useEffect(() => {
    //     const modal = document.getElementById("Tranporterfrom_1");
    //     const handleModalShow = () => {
    //         const vehNo = localStorage.getItem("vehNo");

    //         // const mobile = localStorage.getItem("mobile");
    //         // const name = localStorage.getItem("name");
    //         if (vehNo) {

    //             if (vehNo !== prevVehNo) {
    //                 localStorage.removeItem("mobile");
    //                 localStorage.removeItem("name");
    //             }
    //             setFormData(prev => ({
    //                 ...prev,
    //                 VEHICALNO: vehNo,
    //                 // TCANTACTNO: mobile,
    //                 // TNAME: name,
    //             }));
    //         }
    //     };

    //     modal?.addEventListener("show.bs.modal", handleModalShow);

    //     return () => {
    //         modal?.removeEventListener("show.bs.modal", handleModalShow);
    //     };
    // }, []);

    useEffect(() => {
        const vehNo = localStorage.getItem("vehNo");
        // const mobile = localStorage.getItem("mobile");
        // const name = localStorage.getItem("name");
        if (vehNo) {
            setFormData((prev) => ({
                ...prev,
                TAID: "",
                TNAME: "",
                TADDRESS: "",
                TCITY: "",
                TPINCODE: "",
                TCANTACTNO: "",
                TGSTIN: "",
                TSTATE: "",
                TPAN: "",
                TBIRTHDATE: "",
                VEHICALNO: vehNo || "",
                VEHICALTYPE: "",
                VEHICALCAPACITY: "",
                TDATE: "",
            }));
        }

    }, []);


    useEffect(() => {
        const fetchData = async () => {
            if (TAID) {
                try {
                    const payload = {
                        "taid": TAID,
                        "keyword": "%",
                        "companyid": "",
                        "deptid": ""
                    }

                    const headers = {
                        "Content-Type": "application/json",
                        Accept: "*/*",
                    };

                    // Make the API request with async/await
                    const response = await axios({
                        method: "POST",
                        url: baseUrl.Url + "/backend/api/GET_Transporters",
                        data: JSON.stringify(payload),
                        headers: headers,
                    });

                    if (response.status !== 200) {
                        throw new Error("Failed to Fetch Gate Entry Data");
                    }

                    let apiData = response.data[0];
                    setFormData((prev) => ({
                        ...prev,
                        TAID: apiData.taid,
                        TNAME: apiData.tname,
                        TADDRESS: apiData.taddress,
                        TCITY: apiData.tcity,
                        TPINCODE: apiData.tpincode,
                        TCANTACTNO: apiData.tcantactno,
                        TGSTIN: apiData.tgstin,
                        TSTATE: apiData.ttstate,
                        TPAN: apiData.tpan,
                        TBIRTHDATE: apiData.tbirthdate,
                        VEHICALNO: apiData.vehicalno,
                        VEHICALTYPE: apiData.vehicaltype,
                        VEHICALCAPACITY: apiData.vehicalcapacity,
                        TDATE: "",
                    }));


                } catch (error) {
                    console.error("Error fetching Access Right Data:", error);
                }
            }
        };

        fetchData();
    }, [TAID]);

    const TNAMERef = useRef(null);
    const VEHICALNORef = useRef(null);
    const TCANTACTNORef = useRef(null);


    const isValidVehicleNumber = (vehicalno) => {
        const regex = /^MH\d{2}[A-Z]{2}\d{4}$/;
        return regex.test(vehicalno);
    };

    // const handleChange = (e) => {
    //     const { name, value } = e.target;

    //     setFormData(prev => ({
    //         ...prev,
    //         [name]: value
    //     }));

    //     if (name === 'VEHICALNO') {
    //         let inputValue = value.toUpperCase().replace(/\s+/g, "").replace(/\//g, "");
    //         if (!inputValue.startsWith("MH")) {
    //             inputValue = "MH" + inputValue;
    //         }

    //         setFormData(prev => ({
    //             ...prev,
    //             VEHICALNO: inputValue,
    //         }));

    //         if (inputValue.length === 10) {
    //             if (!isValidVehicleNumber(inputValue)) {
    //                 Swal.fire({
    //                     icon: "warning",
    //                     title: "अवैध वाहन क्रमांक",
    //                     text: "कृपया MH15DI2345 सारखा वैध MH वाहन क्रमांक प्रविष्ट करा.",
    //                     confirmButtonText: "ठीक आहे"
    //                 });
    //                 return;
    //             }

    //             const payload = { vehicalno: inputValue };

    //             axios.post(`${baseUrl.Url}/backend/api/SP_CheckVehicalNo`, payload, {
    //                 headers: {
    //                     "Content-Type": "application/json",
    //                     Accept: "*/*",
    //                 },
    //             }).then((response) => {
    //                 if (response.status === 200 && response.data[0].isSuccessful === 1) {
    //                     Swal.fire({
    //                         icon: "success",
    //                         title: "Saved!",
    //                         text: response.data[0].responseMessage,
    //                         confirmButtonText: "OK",
    //                         allowOutsideClick: false,
    //                         allowEscapeKey: false,
    //                     }).then((result) => {
    //                         if (result.isConfirmed) {
    //                             localStorage.removeItem("aadhar");
    //                             localStorage.removeItem("mobile");
    //                             document.querySelector('[data-bs-target="#AddGateEntry"]').click();
    //                             localStorage.setItem("selectedID", e.target.value);
    //                             setFormData((prev) => ({
    //                                 ...prev,
    //                                 TAID: "",
    //                                 TNAME: "",
    //                                 TADDRESS: "",
    //                                 TCITY: "",
    //                                 TPINCODE: "",
    //                                 TCANTACTNO: "",
    //                                 TGSTIN: "",
    //                                 TSTATE: "",
    //                                 TPAN: "",
    //                                 TBIRTHDATE: "",
    //                                 VEHICALNO: "",
    //                                 VEHICALTYPE: "",
    //                                 VEHICALCAPACITY: "",
    //                                 TDATE: "",
    //                             }));

    //                         }
    //                     });
    //                 }
    //             }).catch((error) => {
    //                 console.error("API Error:", error);
    //             });
    //         }
    //     }
    // };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'VEHICALNO') {
            let inputValue = value.toUpperCase().replace(/\s+/g, "").replace(/\//g, "");

            // Avoid double MH
            if (inputValue.startsWith("MHMH")) {
                inputValue = inputValue.replace(/^MHMH/, "MH");
            } else if (!inputValue.startsWith("MH")) {
                inputValue = "MH" + inputValue;
            }

            // Update formatted value
            setFormData(prev => ({
                ...prev,
                [name]: inputValue
            }));

            if (inputValue.length === 10) {
                if (!isValidVehicleNumber(inputValue)) {
                    Swal.fire({
                        icon: "warning",
                        title: "अवैध वाहन क्रमांक",
                        text: "कृपया MH15DI2345 सारखा वैध MH वाहन क्रमांक प्रविष्ट करा.",
                        confirmButtonText: "ठीक आहे"
                    });
                    return;
                }

                const payload = { vehicalno: inputValue };

                axios.post(`${baseUrl.Url}/backend/api/SP_CheckVehicalNo`, payload, {
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "*/*",
                    },
                }).then((response) => {
                    if (response.status === 200 && response.data[0].isSuccessful === 1) {
                        Swal.fire({
                            icon: "success",
                            title: "जतन केले!",
                            text: response.data[0].responseMessage || "माहिती यशस्वीपणे जतन केली गेली.",
                            confirmButtonText: "ठीक आहे",
                            allowOutsideClick: false,
                            allowEscapeKey: false,
                        }).then((result) => {
                            if (result.isConfirmed) {

                                setFormData({
                                    TAID: "",
                                    TNAME: "",
                                    TADDRESS: "",
                                    TCITY: "",
                                    TPINCODE: "",
                                    TCANTACTNO: "",
                                    TGSTIN: "",
                                    TSTATE: "",
                                    TPAN: "",
                                    TBIRTHDATE: "",
                                    VEHICALNO: "",
                                    VEHICALTYPE: "",
                                    VEHICALCAPACITY: "",
                                    TDATE: "",
                                });

                                localStorage.removeItem("aadhar");
                                localStorage.removeItem("mobile");
                                localStorage.setItem("selectedID", inputValue);

                                document.querySelector('[data-bs-target="#AddGateEntry"]').click();
                            }
                        });
                    }
                }).catch((error) => {
                    console.error("API Error:", error);
                });

            }

        } else {
            // Other fields
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    // useEffect(() => {
    //     if (formData.TCANTACTNO && formData.TCANTACTNO.length === 10) {
    //         handleCheckTransporterMobile(formData.TCANTACTNO);
    //     }
    // }, [formData.TCANTACTNO]);
    useEffect(() => {
        const mobile = formData.TCANTACTNO;

        if (mobile && mobile.length === 10) {
            handleCheckTransporterMobile(mobile);
        } else if (!mobile) {

            setFormData((prev) => ({
                ...prev,
                TNAME: "",
                TAID: ""
            }));
            setTransporterExists(false);
        }
    }, [formData.TCANTACTNO]);


    const handleCheckTransporterMobile = async (mobileNo) => {
        const cleanedMobileNo = mobileNo.replace(/\D/g, '');

        if (!cleanedMobileNo || cleanedMobileNo.length !== 10) {
            console.log("❌ Invalid mobile:", cleanedMobileNo);
            return;
        }

        const payload = {
            tcantactno: cleanedMobileNo,
        };

        try {
            const response = await axios.post(
                `${baseUrl.Url}/backend/api/GET_CheckMobileApp`,
                payload,
                {
                    headers: { 'Content-Type': 'application/json' }
                }
            );

            const data = response.data;
            console.log("📲 Transporter Check:", data);

            if (data?.length > 0) {
                const t = data[0];
                setFormData((prev) => ({
                    ...prev,
                    TNAME: t.tname,
                    TCANTACTNO: cleanedMobileNo,
                    TAID: t.taid,
                }));
                setTransporterExists(true);
            } else {
                setFormData((prev) => ({
                    ...prev,
                    TNAME: '',
                    TCANTACTNO: cleanedMobileNo,
                    TAID: '',
                }));
                setTransporterExists(false);
            }

        } catch (error) {
            console.error("❌ Error checking mobile:", error);
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        const headers = {
            "Content-Type": "application/json",
            Accept: "*/*",
        };

        const { TCANTACTNO, TNAME, TAID, VEHICALNO, VEHICALTYPE, VEHICALCAPACITY } = formData;

        if (!TCANTACTNO || TCANTACTNO.length !== 10) {
            setVehicleErrors(prev => ({ ...prev, transporterMobile: "कृपया वैध मोबाईल नंबर टाका." }));
            return;
        }

        if (!TNAME) {
            setVehicleErrors(prev => ({ ...prev, transporterName: "कृपया ट्रान्सपोर्टरचे नाव टाका." }));
            return;
        }

        if (!VEHICALNO) {
            setVehicleErrors(prev => ({ ...prev, vehicleNumber: "कृपया वाहन क्रमांक टाका." }));
            return;
        }

        try {
            const checkPayload = { vehicalno: VEHICALNO };
            const response = await axios.post(baseUrl.Url + "/backend/api/SP_CheckVehicalNo", checkPayload, { headers });

            if (response.status === 200 && response.data[0]?.isSuccessful == 1) {
                Swal.fire({
                    icon: "error",
                    title: "त्रुटी",
                    text: response.data[0].responseMessage || "कृपया पुन्हा प्रयत्न करा.",
                    confirmButtonText: "ठीक आहे",
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                }).then((result) => {
                    // if (result.isConfirmed) {
                    //     const modalEl = document.getElementById("Tranporterfrom_1");
                    //     const nextModalEl = document.getElementById("AddGateEntry");
                    //     const modalInstance = bootstrap.Modal.getOrCreateInstance(modalEl);
                    //     modalInstance.hide();
                    //     const nextModal = new bootstrap.Modal(nextModalEl);
                    //     nextModal.show();
                    //     document.body.classList.remove("modal-open");
                    //     document.querySelector(".modal-backdrop")?.remove();
                    if (result.isConfirmed) {
                        localStorage.removeItem("vehNo");
                        localStorage.removeItem("mobile");
                        localStorage.removeItem("name");
                        document.querySelector('[data-bs-target="#AddGateEntry"]').click();

                        // Clear form
                        setFormData(prev => ({
                            ...prev,
                            TAID: "",
                            TNAME: "",
                            TADDRESS: "",
                            TCITY: "",
                            TPINCODE: "",
                            TCANTACTNO: "",
                            TGSTIN: "",
                            TSTATE: "",
                            TPAN: "",
                            TBIRTHDATE: "",
                            VEHICALNO: "",
                            VEHICALTYPE: "",
                            VEHICALCAPACITY: "",
                            TDATE: "",
                        }));
                    }
                });

                return;
            }

            const taid = TAID || ACSPLGUID.getNew();

            const transporterPayload = {
                taid,
                tname: TNAME,
                taddress: formData.TADDRESS,
                tcity: formData.TCITY,
                tpincode: formData.TPINCODE,
                tcantactno: TCANTACTNO,
                tgstin: formData.TGSTIN,
                tstate: formData.TSTATE,
                tpan: formData.TPAN,
                tbirthdate: formData.TBIRTHDATE,
                vehicalno: VEHICALNO,
                vehicaltype: VEHICALTYPE,
                vehicalcapacity: VEHICALCAPACITY,
                companyid: "",
                deptid: "",
                tdate: "",
                tuid: "",
                uaid: userdetail?.uaid || "",
                tprofile: "",
                fcmtoken: ""
            };

            await axios.post(baseUrl.Url + "/backend/api/SP_AddUpdTransporters", transporterPayload, { headers });

            const vehicleDetailsPayload = [{
                vdaid: ACSPLGUID.getNew(),
                taid,
                vno: VEHICALNO,
                vtype: VEHICALTYPE,
                vcapacity: VEHICALCAPACITY,
                companyid: "",
                deptid: "",
                isdeleted: false
            }];

            await axios.post(baseUrl.Url + "/backend/api/SP_AddVehicalDetails", vehicleDetailsPayload, { headers });

            localStorage.setItem("vehNo", VEHICALNO);
            localStorage.setItem("vehNoReady", "true");

            Swal.fire({
                icon: "success",
                title: "सेव्ह झाले!",
                text: "माहिती यशस्वीरित्या जतन करण्यात आली आहे.",
                confirmButtonText: "ठीक आहे",
                allowOutsideClick: false,
                allowEscapeKey: false,
            }).then((result) => {
                // if (result.isConfirmed) {
                //     const modalEl = document.getElementById("Tranporterfrom_1");
                //     const nextModalEl = document.getElementById("AddGateEntry");
                //     const modalInstance = bootstrap.Modal.getOrCreateInstance(modalEl);
                //     modalInstance.hide();
                //     const nextModal = new bootstrap.Modal(nextModalEl);
                //     nextModal.show();
                //     document.body.classList.remove("modal-open");
                //     document.querySelector(".modal-backdrop")?.remove();
                if (result.isConfirmed) {
                    localStorage.removeItem("vehNo");
                    localStorage.removeItem("mobile");
                    localStorage.removeItem("name");
                    document.querySelector('[data-bs-target="#AddGateEntry"]').click();
                    localStorage.setItem("selectedID", formData.VEHICALNO);


                    setFormData(prev => ({
                        ...prev,
                        TAID: "",
                        TNAME: "",
                        TADDRESS: "",
                        TCITY: "",
                        TPINCODE: "",
                        TCANTACTNO: "",
                        TGSTIN: "",
                        TSTATE: "",
                        TPAN: "",
                        TBIRTHDATE: "",
                        VEHICALNO: "",
                        VEHICALTYPE: "",
                        VEHICALCAPACITY: "",
                        TDATE: "",
                    }));
                }
            });

        } catch (error) {
            console.error("❌ सेव्ह करताना त्रुटी:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to save data. Please try again.",
            });
        }
    };

    return (
        <div>
            <div
                className="modal fade"
                id="Tranporterfrom_1"
                tabIndex={-1}
                aria-hidden="true"
            // data-bs-backdrop="static"
            // data-bs-keyboard="false"
            >
                <div className="modal-dialog modal-fullscreen-lg-down">
                    <div className="modal-content bg-light rounded-4 shadow">
                        <div className="modal-header bg-primary text-white">
                            <h4 className="modal-title" id="exampleModalFullscreenLgLabel">
                                वाहन चालक माहिती
                            </h4>
                            {/* <button
                                type="button"
                                className="btn-close btn-close-white"
                                aria-label="Close"
                                onClick={() => {
                                    const currentModalEl = document.getElementById("Tranporterfrom_1");
                                    const nextModalEl = document.getElementById("AddGateEntry");

                                    // Close current modal safely
                                    const currentModal = bootstrap.Modal.getInstance(currentModalEl);
                                    currentModal.hide();

                                    // Optional: manually cleanup backdrop and class
                                    document.body.classList.remove("modal-open");
                                    document.querySelector(".modal-backdrop")?.remove();

                                    // Show next modal
                                    const nextModal = new bootstrap.Modal(nextModalEl);
                                    nextModal.show();
                                }}
                            /> */}
                            <button
                                type="button"
                                className="btn-close btn-close-white"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                                onClick={() => {
                                    const currentModalEl = document.getElementById("Tranporterfrom_1");
                                    const nextModalEl = document.getElementById("AddGateEntry");

                                    // Close current modal
                                    const currentModal = bootstrap.Modal.getInstance(currentModalEl);
                                    currentModal?.hide();

                                    localStorage.removeItem("vehNo");
                                    localStorage.removeItem("mobile");
                                    localStorage.removeItem("name");
                                    // Remove backdrop manually (optional fix)
                                    document.body.classList.remove("modal-open");
                                    document.querySelector(".modal-backdrop")?.remove();

                                    // Open next modal
                                    const nextModal = new bootstrap.Modal(nextModalEl);
                                    nextModal.show();
                                }}
                            />


                        </div>

                        <div className="modal-body">
                            <div className="p-3 border rounded mbgcolor shadow-sm">
                                <form onSubmit={handleSubmit}>
                                    <div className="row mb-3">
                                        <div className="col-12">
                                            <label className="form-label required">वाहन क्रमांक</label>

                                            <input
                                                id='VEHICALNO'
                                                type="text"
                                                className="form-control"
                                                name="VEHICALNO"
                                                value={formData.VEHICALNO || ""}
                                                onChange={(e) => {
                                                    let inputValue = e.target.value.toUpperCase();
                                                    if (!inputValue.startsWith("MH")) {
                                                        inputValue = "MH" + inputValue.replace(/^MH\s*/, "");
                                                    }
                                                    inputValue = inputValue.replace(/\s+/g, "").replace(/\//g, "");

                                                    setFormData(prev => ({
                                                        ...prev,
                                                        VEHICALNO: inputValue,
                                                    }));

                                                    handleChange({
                                                        target: {
                                                            name: "VEHICALNO",
                                                            value: inputValue
                                                        }
                                                    });
                                                }}
                                                pattern="^MH\d{2}[A-Z]{2}\d{4}$"
                                                title="कृपया MH15DI2345 सारखा वैध MH वाहन क्रमांक प्रविष्ट करा."
                                                style={{
                                                    fontWeight: "900",
                                                    border: "2px solid #ff9800",
                                                    fontSize: "1rem"
                                                }}
                                                required
                                            />

                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-12">
                                            <label className="form-label required">मोबाईल क्रमांक</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="TCANTACTNO"
                                                value={formData.TCANTACTNO || ""}
                                                onChange={handleChange}
                                                ref={TCANTACTNORef}
                                                required
                                                title="कृपया वैध १० अंकी मोबाईल नंबर प्रविष्ट करा."
                                                pattern="^[0-9]{10}$"
                                            />
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-12">
                                            <label className="form-label required">पूर्ण नाव</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="TNAME"
                                                value={formData.TNAME || ""}
                                                onChange={handleChange}
                                                ref={TNAMERef}
                                                required
                                                title="फक्त अक्षरे आणि जागा अनुमत आहेत"
                                                pattern="[A-Za-z ]+"
                                            />
                                        </div>
                                    </div>



                                    <div className="row mt-4">

                                        <div className="col-6">
                                            <button
                                                type="button"
                                                className="btn btn-secondary w-100"
                                                onClick={() => {
                                                    const currentModalEl = document.getElementById("Tranporterfrom_1");
                                                    const nextModalEl = document.getElementById("AddGateEntry");

                                                    const currentModal = bootstrap.Modal.getInstance(currentModalEl);
                                                    currentModal?.hide();

                                                    document.body.classList.remove("modal-open");
                                                    document.querySelector(".modal-backdrop")?.remove();

                                                    const nextModal = new bootstrap.Modal(nextModalEl);
                                                    nextModal.show();
                                                }}

                                            >
                                                मागे
                                            </button>

                                        </div>
                                        <div className="col-6">
                                            <button
                                                type="submit"
                                                className="btn w-100"
                                                style={{
                                                    background: "blue",
                                                    color: "white",
                                                    border: "none",
                                                    padding: "10px",
                                                }}
                                            >
                                                सेव्ह
                                            </button>
                                        </div>
                                    </div>

                                    {/* <div className="row mt-4">
                                        <div className="col-lg-6 col-sm-12 mb-2 mb-lg-0">
                                            <button
                                                type="button"
                                                className="btn btn-secondary w-100"
                                                data-bs-dismiss="modal"
                                                aria-label="Close"
                                                data-bs-target="#AddGateEntry"
                                                data-bs-toggle="modal"
                                            >
                                                मागे
                                            </button>
                                        </div>
                                        <div className="col-lg-6 col-sm-12">
                                            <button
                                                type="submit"
                                                className="btn w-100"
                                                style={{
                                                    background: "blue",
                                                    color: "white",
                                                    border: "none",
                                                    padding: "10px",
                                                    fontWeight: "bold"
                                                }}
                                            >
                                                सेव्ह
                                            </button>
                                        </div>
                                    </div> */}
                                </form>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>

    )
}

export default AddQuickTrasporter_1


// <input
// type="text"
// className="form-control"
// name="VEHICALNO"
// value={formData.VEHICALNO || ""}
// onChange={(e) => {
//     let inputValue = e.target.value.toUpperCase();

//     if (!inputValue.startsWith("MH")) {
//         inputValue = "MH" + inputValue.replace(/^MH\s*/, "");
//     }

//     inputValue = inputValue.replace(/\s+/g, "").replace(/\//g, "");
//     handleChange({ ...e, target: { ...e.target, value: inputValue } });
// }}
// required
// style={{ fontWeight: "900" }}
// />