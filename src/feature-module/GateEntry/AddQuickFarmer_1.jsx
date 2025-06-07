import React, { useEffect, useRef, useState } from 'react'
import { ACSPLGUID, baseUrl } from '../../core/json/custom';
// import AddGateEntry from './AddGateEntry';
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import axios from 'axios';
import { getUserData } from '../../Context/UserData';
import { formatDate } from '../../core/json/custom';

function AddQuickFarmer_1({ FAID, FNAME, FADHAR, FCONTACT }) {
    // const [formData, setFormData] = useState({
    //     FAID: '',
    //     FNAME: FNAME || "",
    //     FCONTACTNO: FCONTACT || "",
    //     FADDHARNO: FADHAR || "",
    // });
    const { userdetail } = getUserData();
    const [formData, setFormData] = useState({
        FAID: '',
        FNAME: FNAME || "",
        FCONTACTNO: FCONTACT || "",
        FBIRTHDATE: '',
        FPANNO: '',
        FADDHARNO: FADHAR || "",
        FBANKNAME: '',
        FBRANCHNAME: '',
        FACCOUNTNO: '',
        FIFSCCODE: '',
        FPINCODE: '',
        FSTATE: '',
        FCITY: '',
        FLANDMARK: '',
        FLANDAREA: '',
        FLANDTYPE: '',
        FSTATUS: '',
        FACCONAME: "",
        FAddress: "",
        FCROPAREA: "",
        FCROPTYPE: "",
    });

    const FNAMERef = useRef(null);
    const FCONTACTNORef = useRef(null);
    const FBIRTHDATERef = useRef(null);
    const FADDHARNORef = useRef(null);

    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            FAID: "",
            FNAME: "",
            FCONTACTNO: "",
            FBIRTHDATE: "",
            FPANNO: "",
            FADDHARNO: "",
            FBANKNAME: "",
            FBRANCHNAME: "",
            FACCOUNTNO: "",
            FIFSCCODE: "",
            FPINCODE: "",
            FLANDMARK: "",
            FLANDAREA: "",
            FLANDTYPE: "",
            FCITY: "",
            FSTATE: "",
            FSTATUS: "",
            FACCONAME: "",
            FAddress: "",
            FCROPAREA: "",
            FCROPTYPE: "",
        }));
    }, []);

    useEffect(() => {
        const aadhar = localStorage.getItem("aadhar");
        const mobile = localStorage.getItem("mobile");
        if (aadhar || mobile) {
            setFormData((prev) => ({
                ...prev,
                FAID: "",
                FNAME: "",
                FCONTACTNO: mobile || "",
                FBIRTHDATE: "",
                FPANNO: "",
                FADDHARNO: aadhar || "",
                FBANKNAME: "",
                FBRANCHNAME: "",
                FACCOUNTNO: "",
                FIFSCCODE: "",
                FPINCODE: "",
                FLANDMARK: "",
                FLANDAREA: "",
                FLANDTYPE: "",
                FCITY: "",
                FSTATE: "",
                FSTATUS: "",
                FACCONAME: "",
                FAddress: "",
                FCROPAREA: "",
                FCROPTYPE: "",
            }));
        }

    }, []);

    useEffect(() => {
        const modal = document.getElementById("Farmerfrom_1");

        const handleModalShow = () => {
            const aadhar = localStorage.getItem("aadhar") || "";
            const mobile = localStorage.getItem("mobile") || "";

            setFormData(prev => ({
                ...prev,
                FADDHARNO: aadhar,
                FCONTACTNO: mobile,
            }));
        };

        modal?.addEventListener("show.bs.modal", handleModalShow);

        return () => {
            modal?.removeEventListener("show.bs.modal", handleModalShow);
        };
    }, []);

    useEffect(() => {
        if (!FAID) return;
        const fetchMasterData = async () => {
            try {
                const payload1 = {
                    "faid": FAID,
                    "keyword": "%",
                    "companyid": "",
                    "deptid": "",
                };

                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*"
                };

                const response = await axios.post(
                    baseUrl.Url + "/backend/api/GET_GateFarmer",
                    payload1,
                    { headers }
                );

                if (response.status !== 200) throw new Error("Failed to fetch data");
                let apiData = response.data[0];
                setFormData((prev) => ({
                    ...prev,
                    FAID: apiData.faid,
                    FNAME: apiData.fname,
                    FCONTACTNO: apiData.fcontactno,
                    FBIRTHDATE: apiData.fbirthdate,
                    FPANNO: apiData.fpanno,
                    FADDHARNO: apiData.faddharno,
                    FBANKNAME: apiData.fbankname,
                    FBRANCHNAME: apiData.fbranchname,
                    FACCOUNTNO: apiData.faccountno,
                    FIFSCCODE: apiData.fifsccode,
                    FPINCODE: apiData.fpincode,
                    // FSTATE: apiData.fstate,
                    // FCITY: apiData.fcity,
                    FLANDMARK: apiData.flandmark,
                    FLANDAREA: apiData.flandarea,
                    FLANDTYPE: apiData.flandtype,
                    FCITY: apiData.fcity,
                    FSTATE: apiData.fstate,
                    FSTATUS: apiData.fstatus,
                    FACCONAME: apiData.facconame,
                    FAddress: apiData.faddress,
                    FCROPAREA: apiData.fcroparea,
                    FCROPTYPE: apiData.fcroptype,
                }));
                console.log(" Master Data:", apiData);
            } catch (error) {
                console.error("Error in Master API Call:", error);
            }
        };

        fetchMasterData();
    }, [FAID]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (e.target.name == 'FADDHARNO') {
            try {

                const payload = {
                    "aadhaar": e.target.value,
                };

                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };

                axios({
                    method: "POST",
                    url: baseUrl.Url + "/backend/api/SP_CheckAadhaar",
                    data: JSON.stringify(payload),
                    headers: headers,
                })
                    .then((response) => {
                        if (response.status === 200) {
                            console.log(response.data)
                            if (response.data[0].isSuccessful == 1) {

                                Swal.fire({
                                    icon: "success",
                                    title: "Saved!",
                                    text: response.data[0].responseMessage,
                                    confirmButtonText: "OK",
                                    allowOutsideClick: false,
                                    allowEscapeKey: false,
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                        localStorage.removeItem("aadhar");
                                        localStorage.removeItem("mobile");
                                        document.querySelector('[data-bs-target="#AddGateEntry"]').click();
                                        localStorage.setItem("selectedID", e.target.value);
                                        setFormData((prev) => ({
                                            ...prev,
                                            FAID: "",
                                            FNAME: "",
                                            FCONTACTNO: "",
                                            FBIRTHDATE: "",
                                            FPANNO: "",
                                            FADDHARNO: "",
                                            FBANKNAME: "",
                                            FBRANCHNAME: "",
                                            FACCOUNTNO: "",
                                            FIFSCCODE: "",
                                            FPINCODE: "",
                                            // FSTATE: apiData.fstate,
                                            // FCITY: apiData.fcity,
                                            FLANDMARK: "",
                                            FLANDAREA: "",
                                            FLANDTYPE: "",
                                            FCITY: "",
                                            FSTATE: "",
                                            FSTATUS: "",
                                            FACCONAME: "",
                                            FAddress: "",
                                            FCROPAREA: "",
                                            FCROPTYPE: "",
                                        }));
                                        // // const modalEl = document.getElementById("Farmerfrom_1");
                                        // // const modal = bootstrap.Modal.getInstance(modalEl);
                                        // // if (modal) {
                                        // //     modal.hide();
                                        // // }
                                        // const modal = document.getElementById("Farmerfrom_1");
                                        // if (modal) {
                                        //     modal.classList.remove("show");
                                        //     modal.style.display = "none";
                                        //     document.body.classList.remove("modal-open");
                                        //     // document.body.style.overflow = "auto";

                                        //     const backdrop = document.querySelector(".modal-backdrop");
                                        //     if (backdrop) {
                                        //         backdrop.remove();
                                        //         document.querySelector('[data-bs-target="#AddGateEntry"]').click();
                                        //         setFormData((prev) => ({
                                        //             ...prev,
                                        //             FAID: "",
                                        //             FNAME: "",
                                        //             FCONTACTNO: "",
                                        //             FBIRTHDATE: "",
                                        //             FPANNO: "",
                                        //             FADDHARNO: "",
                                        //             FBANKNAME: "",
                                        //             FBRANCHNAME: "",
                                        //             FACCOUNTNO: "",
                                        //             FIFSCCODE: "",
                                        //             FPINCODE: "",
                                        //             // FSTATE: apiData.fstate,
                                        //             // FCITY: apiData.fcity,
                                        //             FLANDMARK: "",
                                        //             FLANDAREA: "",
                                        //             FLANDTYPE: "",
                                        //             FCITY: "",
                                        //             FSTATE: "",
                                        //             FSTATUS: "",
                                        //             FACCONAME: "",
                                        //             FAddress: "",
                                        //             FCROPAREA: "",
                                        //             FCROPTYPE: "",
                                        //         }));
                                        //     }
                                        // }
                                        // const backdrop = document.querySelector(".modal-backdrop");
                                        // if (backdrop) {
                                        //     backdrop.remove();
                                        //     document.querySelector('[data-bs-target="#AddGateEntry"]').click();
                                        //     setFormData((prev) => ({
                                        //         ...prev,
                                        //         FAID: "",
                                        //         FNAME: "",
                                        //         FCONTACTNO: "",
                                        //         FBIRTHDATE: "",
                                        //         FPANNO: "",
                                        //         FADDHARNO: "",
                                        //         FBANKNAME: "",
                                        //         FBRANCHNAME: "",
                                        //         FACCOUNTNO: "",
                                        //         FIFSCCODE: "",
                                        //         FPINCODE: "",
                                        //         // FSTATE: apiData.fstate,
                                        //         // FCITY: apiData.fcity,
                                        //         FLANDMARK: "",
                                        //         FLANDAREA: "",
                                        //         FLANDTYPE: "",
                                        //         FCITY: "",
                                        //         FSTATE: "",
                                        //         FSTATUS: "",
                                        //         FACCONAME: "",
                                        //         FAddress: "",
                                        //         FCROPAREA: "",
                                        //         FCROPTYPE: "",
                                        //     }));
                                        // }
                                    }
                                });

                            }

                        }
                    });

            } catch (error) {
                console.error('get data Error:', error);
            }
        }

    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Form Data:", formData);
        localStorage.setItem("selectedID", formData.FADDHARNO);
        const today = new Date().toISOString().split('T')[0];

        try {
            const payload = {
                aadhaar: formData.FADDHARNO,
            };

            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            const response = await axios.post(baseUrl.Url + "/backend/api/SP_CheckAadhaar", payload, { headers });

            if (response.status === 200) {
                console.log(response.data);

                if (response.data[0].isSuccessful == 1) {
                    Swal.fire({
                        icon: "success",
                        title: "यशस्वी!",
                        text: response.data[0].responseMessage,
                        confirmButtonText: "ठीक आहे",
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                    }).then((result) => {
                        if (result.isConfirmed) {
                            localStorage.removeItem("aadhar");
                            localStorage.removeItem("mobile");
                            document.querySelector('[data-bs-target="#AddGateEntry"]').click();
                            setFormData((prev) => ({
                                ...prev,
                                FAID: "",
                                FNAME: "",
                                FCONTACTNO: "",
                                FBIRTHDATE: "",
                                FPANNO: "",
                                FADDHARNO: "",
                                FBANKNAME: "",
                                FBRANCHNAME: "",
                                FACCOUNTNO: "",
                                FIFSCCODE: "",
                                FPINCODE: "",
                                // FSTATE: apiData.fstate,
                                // FCITY: apiData.fcity,
                                FLANDMARK: "",
                                FLANDAREA: "",
                                FLANDTYPE: "",
                                FCITY: "",
                                FSTATE: "",
                                FSTATUS: "",
                                FACCONAME: "",
                                FAddress: "",
                                FCROPAREA: "",
                                FCROPTYPE: "",
                            }));
                            // const modal = document.getElementById("Farmerfrom_1");
                            // if (modal) {
                            //     modal.classList.remove("show");
                            //     modal.style.display = "none";
                            //     document.body.classList.remove("modal-open");
                            //     // document.body.style.overflow = "auto";

                            //     const backdrop = document.querySelector(".modal-backdrop");
                            //     if (backdrop) {
                            //         backdrop.remove();
                            //         document.querySelector('[data-bs-target="#AddGateEntry"]').click();
                            //         setFormData((prev) => ({
                            //             ...prev,
                            //             FAID: "",
                            //             FNAME: "",
                            //             FCONTACTNO: "",
                            //             FBIRTHDATE: "",
                            //             FPANNO: "",
                            //             FADDHARNO: "",
                            //             FBANKNAME: "",
                            //             FBRANCHNAME: "",
                            //             FACCOUNTNO: "",
                            //             FIFSCCODE: "",
                            //             FPINCODE: "",
                            //             // FSTATE: apiData.fstate,
                            //             // FCITY: apiData.fcity,
                            //             FLANDMARK: "",
                            //             FLANDAREA: "",
                            //             FLANDTYPE: "",
                            //             FCITY: "",
                            //             FSTATE: "",
                            //             FSTATUS: "",
                            //             FACCONAME: "",
                            //             FAddress: "",
                            //             FCROPAREA: "",
                            //             FCROPTYPE: "",
                            //         }));
                            //     }
                            // }
                            // const backdrop = document.querySelector(".modal-backdrop");
                            // if (backdrop) {
                            //     backdrop.remove();
                            //     document.querySelector('[data-bs-target="#AddGateEntry"]').click();
                            //     setFormData((prev) => ({
                            //         ...prev,
                            //         FAID: "",
                            //         FNAME: "",
                            //         FCONTACTNO: "",
                            //         FBIRTHDATE: "",
                            //         FPANNO: "",
                            //         FADDHARNO: "",
                            //         FBANKNAME: "",
                            //         FBRANCHNAME: "",
                            //         FACCOUNTNO: "",
                            //         FIFSCCODE: "",
                            //         FPINCODE: "",
                            //         // FSTATE: apiData.fstate,
                            //         // FCITY: apiData.fcity,
                            //         FLANDMARK: "",
                            //         FLANDAREA: "",
                            //         FLANDTYPE: "",
                            //         FCITY: "",
                            //         FSTATE: "",
                            //         FSTATUS: "",
                            //         FACCONAME: "",
                            //         FAddress: "",
                            //         FCROPAREA: "",
                            //         FCROPTYPE: "",
                            //     }));
                            // }
                        }
                    });
                } else {
                    localStorage.setItem("selectedID", formData.FADDHARNO);
                    const payload1 = {
                        // faid: FAID ? FAID : ACSPLGUID.getNew(),
                        // fname: formData.FNAME,
                        // fcontactno: formData.FCONTACTNO,
                        // fbirthdate: today,
                        // fpanno: "",
                        // faddharno: formData.FADDHARNO,
                        // fbankname: "",
                        // fbranchname: "",
                        // faccountno: "",
                        // fifsccode: "",
                        // fpincode: "",
                        // fstate: "",
                        // fcity: "",
                        // flandmark: "",
                        // flandarea: "",
                        // flandtype: "",
                        // fstatus: "",
                        // companyid: "",
                        // deptid: "",
                        // faddress: "",
                        // fcroparea: "",
                        // fcroptype: "",

                        "faid": FAID ? FAID : ACSPLGUID.getNew(),
                        "fname": formData.FNAME,
                        "fcontactno": formData.FCONTACTNO,
                        "fbirthdate": formData.FBIRTHDATE,
                        "fpanno": formData.FPANNO,
                        "faddharno": formData.FADDHARNO,
                        "fbankname": formData.FBANKNAME,
                        "fbranchname": formData.FBRANCHNAME,
                        "faccountno": formData.FACCOUNTNO,
                        "fifsccode": formData.FIFSCCODE,
                        "fpincode": formData.FPINCODE,
                        "fstate": formData.FSTATE,
                        "fcity": formData.FCITY,
                        "flandmark": formData.FLANDMARK,
                        "flandarea": formData.FLANDAREA,
                        "flandtype": formData.FLANDTYPE,
                        "fstatus": formData.FSTATUS,
                        "companyid": "",
                        "deptid": "",
                        facconame: formData.FACCONAME,
                        faddress: formData.FAddress,
                        fcroparea: formData.FCROPAREA,
                        fcroptype: formData.FCROPTYPE,
                        fcmtoken: "",
                        refid: "",
                        uaid: userdetail?.uaid || "",
                        uid: "",
                        fprofile: "",
                        date: formatDate(userdetail.APPDT)

                    };

                    try {
                        const response1 = await axios.post(baseUrl.Url + "/backend/api/SP_AddUpdFarmer", payload1, { headers });

                        if (response1.status === 200) {
                            setFormData((prev) => ({
                                ...prev,
                                FAID: "",
                                FNAME: "",
                                FCONTACTNO: "",
                                FBIRTHDATE: "",
                                FPANNO: "",
                                FADDHARNO: "",
                                FBANKNAME: "",
                                FBRANCHNAME: "",
                                FACCOUNTNO: "",
                                FIFSCCODE: "",
                                FPINCODE: "",
                                // FSTATE: apiData.fstate,
                                // FCITY: apiData.fcity,
                                FLANDMARK: "",
                                FLANDAREA: "",
                                FLANDTYPE: "",
                                FCITY: "",
                                FSTATE: "",
                                FSTATUS: "",
                                FACCONAME: "",
                                FAddress: "",
                                FCROPAREA: "",
                                FCROPTYPE: "",
                            }));
                            Swal.fire({
                                icon: "success",
                                title: "यशस्वी!",
                                text: "डेटा यशस्वरित्या जतन केला गेला आहे.",
                                confirmButtonText: "ठीक आहे",
                                allowOutsideClick: false,
                                allowEscapeKey: false,
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    localStorage.removeItem("aadhar");
                                    localStorage.removeItem("mobile");
                                    document.querySelector('[data-bs-target="#AddGateEntry"]').click();
                                    localStorage.setItem("selectedID", formData.FADDHARNO);
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
                }
            }
        } catch (error) {
            console.error("Get data Error:", error);
        }
    };


    return (
        <div>
            <div
                className="modal fade"
                id="Farmerfrom_1"
                tabIndex={-1}
                aria-hidden="true"
                data-bs-backdrop="static"
                data-bs-keyboard="false"
            >
                <div className="modal-dialog modal-fullscreen-lg-down">
                    <div className="modal-content border-0 rounded-4 shadow">
                        <div
                            className="modal-header bg-primary text-white rounded-top-4 px-4 py-3"
                        >
                            <h4 className="modal-title m-0" id="exampleModalFullscreenLgLabel">
                                <i className="bi bi-person-lines-fill me-2"></i> शेतकरी माहिती
                            </h4>
                            <button
                                type="button"
                                className="btn-close btn-close-white"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                                onClick={() => {
                                    const currentModalEl = document.getElementById("Farmerfrom_1");
                                    const nextModalEl = document.getElementById("AddGateEntry");

                                    // Close current modal
                                    const currentModal = bootstrap.Modal.getInstance(currentModalEl);
                                    currentModal?.hide();

                                    // Remove backdrop manually (optional fix)
                                    document.body.classList.remove("modal-open");
                                    document.querySelector(".modal-backdrop")?.remove();

                                    // Open next modal
                                    const nextModal = new bootstrap.Modal(nextModalEl);
                                    nextModal.show();
                                }}
                            />
                        </div>

                        <div className="modal-body px-4 pb-4 ">
                            <form onSubmit={handleSubmit} className=" p-4 rounded-4 shadow-sm mbgcolor">
                                <div className="row mb-3">
                                    <div className="col-12 mb-3">
                                        <label className='form-label required'>आधार क्रमांक</label>
                                        <input
                                            type="tel"
                                            inputMode="numeric"
                                            className="form-control"
                                            placeholder="Enter Aadhar Number"
                                            name="FADDHARNO"
                                            value={formData.FADDHARNO || ""}
                                            onChange={handleChange}
                                            pattern="^[0-9]{12}$"
                                            title="आधार नंबर वैध 12 अंकी नंबर असावा."
                                            ref={FADDHARNORef}
                                            required
                                        />
                                    </div>

                                    <div className="col-12 mb-3">
                                        <label className='form-label required'>पूर्ण नाव</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter Full Name"
                                            name="FNAME"
                                            value={formData.FNAME || ""}
                                            onChange={handleChange}
                                            // pattern="^[A-Za-z\s]+$"
                                            pattern="[A-Za-z\u0900-\u097F\s]+"
                                            title="पूर्ण नाव वैध असावे, ज्यात सुरुवातीला रिकाम्या जागा नकोत."
                                            ref={FNAMERef}
                                            required
                                        />

                                    </div>

                                    <div className="col-12 mb-3">
                                        <label className='form-label required'>मोबाईल नंबर</label>
                                        <input
                                            type="tel"
                                            inputMode="numeric"
                                            className="form-control"
                                            placeholder="Enter Mobile Number"
                                            name="FCONTACTNO"
                                            value={formData.FCONTACTNO || ""}
                                            onChange={handleChange}
                                            pattern="^[0-9]{10}$"
                                            title="मोबाईल नंबर वैध 10 अंकी नंबर असावा."
                                            ref={FCONTACTNORef}
                                        />
                                    </div>
                                </div>

                                <div className="row mt-4">
                                    <div className="col-6">
                                        <button
                                            type="button"
                                            className="btn btn-secondary w-100"
                                            data-bs-dismiss="modal"
                                            aria-label="Close"
                                            onClick={() => {
                                                const currentModalEl = document.getElementById("Farmerfrom_1");
                                                const nextModalEl = document.getElementById("AddGateEntry");

                                                // Close current modal
                                                const currentModal = bootstrap.Modal.getInstance(currentModalEl);
                                                currentModal?.hide();

                                                // Remove backdrop manually (optional fix)
                                                document.body.classList.remove("modal-open");
                                                document.querySelector(".modal-backdrop")?.remove();

                                                // Open next modal
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
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>


    )
}

export default AddQuickFarmer_1

