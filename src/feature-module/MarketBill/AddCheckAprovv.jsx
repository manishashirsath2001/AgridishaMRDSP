import React, { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axios from "axios";
import ImageWithBasePath from "../../core/img/imagewithbasebath";
import { baseUrl, ACSPLGUID } from "../../core/json/custom";
import { getUserData } from "../../Context/UserData";

const AddCheckAprovv = ({ pkid }) => {
    console.log("Received pkid:", pkid);

    const navigate = useNavigate();
    const MySwal = withReactContent(Swal);
    const amountRef = useRef(null);
    const chequenoRef = useRef(null);
    const chequedateRef = useRef(null);
    const farmerRef = useRef(null);
    const GUID = ACSPLGUID.getNew();
    console.log("Received pkid:", pkid);
    const { userdetail } = getUserData();
    const [formData, setFormData] = useState({
        pkid: "",
        farmerName: "",
        chequedate: "",
        chequeno: "",
        fifsccode: "",
        chequeamount: "",
        faccountno: "",
        facconame: "",
        chequeapproved: ""


    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const convertDateToInputFormat = (dateStr) => {
        if (!dateStr) return "";

        if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;

        const parsedDate = new Date(dateStr);
        if (isNaN(parsedDate)) return "";


        const year = parsedDate.getFullYear();
        const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
        const day = String(parsedDate.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    };


    const handleFormSubmission = async () => {
        try {

            const payload = {
                pkid: formData.pkid || GUID,
                baid: "NA",
                faid: "NA",
                tokenno: "NA",
                billno: "NA",
                tarikh: new Date().toLocaleDateString("en-GB", {
                    day: 'numeric', month: 'long', year: 'numeric'
                }),
                fullname: formData.farmerName || "",
                vehicleno: "NA",
                amount: 0,
                billamount: 0,
                cashamount: 0,
                hamali: 0,
                chequeamount: Number(formData.chequeamount || 0),
                onlineamount: 0,
                remainingamount: 0,
                status: 0,
                ischecked: true,
                companyid: userdetail?.companyID || "",
                deptid: userdetail?.departmentID || "",
                chequeno: formData.chequeno || "",
                chequeapproved: formData.farmerName || "",
                chequedate: formData.chequedate


            };


            console.log("Payload before post:", payload);
            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*"
            };

            await axios.post(`${baseUrl.Url}/backend/api/SP_AddUpdCashCounterName`, payload, { headers });

            MySwal.fire({
                title: "सेव्ह झाले!",
                text: "डेटा यशस्वीरित्या सेव्ह झाला आहे.",
                icon: "success",
                confirmButtonText: "ठीक आहे",
                allowOutsideClick: false,
                allowEscapeKey: false
            });

            setFormData({
                pkid: "",
                farmerName: "",
                chequedate: "",
                chequeno: "",
                fifsccode: "",
                chequeamount: "",
                faccountno: "",
                facconame: "",
                chequeapproved: ""



            });
            const modal = document.getElementById("AddCheckAprovv");
            if (modal) {
                modal.classList.remove("show");
                modal.style.display = "none";
                modal.setAttribute("aria-hidden", "true");

                const backdrop = document.querySelector(".modal-backdrop");
                if (backdrop) backdrop.remove();

                document.body.classList.remove("modal-open");
                document.body.style.overflow = "auto";
            }


            navigate("/CheckApproved")
        } catch (error) {
            console.error("Submission Error:", error);
            MySwal.fire("Error", "डेटा सेव्ह करताना त्रुटी आली.", "error");
        }
    };

    const showConfirmationAlert = () => {
        MySwal.fire({
            title: 'तुम्हाला खात्री आहे का?',
            text: 'डेटा सेव्ह करायचा आहे का?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#00ff00',
            cancelButtonColor: '#092C4C',
            confirmButtonText: 'सेव्ह करा',
            cancelButtonText: 'रद्द करा',
            allowOutsideClick: false,
            allowEscapeKey: false
        }).then(result => {
            if (result.isConfirmed) {
                handleFormSubmission();
            }
        });
    };

    const showExitAlert = () => {
        MySwal.fire({
            title: "मागे जायचं आहे का?",
            text: "unsaved changes हरवतील.",
            showCancelButton: true,
            confirmButtonText: "हो",
            cancelButtonText: "नाही",
            confirmButtonColor: "#00ff00",
            cancelButtonColor: "#092C4C"
        }).then((result) => {
            if (result.isConfirmed) {
                const modal = document.getElementById("AddCheckAprovv");
                if (modal) {
                    modal.classList.remove("show");
                    modal.style.display = "none";
                    modal.setAttribute("aria-hidden", "true");

                    const backdrop = document.querySelector(".modal-backdrop");
                    if (backdrop) backdrop.remove();

                    document.body.classList.remove("modal-open");
                    document.body.style.overflow = "auto";
                }

            }

        });
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        showConfirmationAlert();
    };

    useEffect(() => {
        setTimeout(() => {
            amountRef.current?.focus();
        }, 200);
    }, []);

    useEffect(() => {
        if (pkid) {
            const fetchData = async () => {
                try {
                    const payload = {
                        pkid: pkid,
                        keyword: "%",
                        companyid: userdetail?.companyID || "",
                        deptid: userdetail?.departmentID || "",
                    };

                    const response = await axios.post(`${baseUrl.Url}/backend/api/GET_CashCounterMatchData`, payload);
                    if (response.data && response.data.length > 0) {
                        const item = response.data[0];
                        setFormData({
                            pkid: pkid,
                            farmerName: item.chequeapproved || item.fullname,
                            chequedate: convertDateToInputFormat(item.chequedate || ""),
                            chequeno: item.chequeno || "",
                            fifsccode: item.fifsccode,
                            chequeamount: item.chequeamount,
                            faccountno: item.faccountno,
                            facconame: item.facconame,
                            chequeapproved: item.chequeapproved
                        });
                    }
                } catch (error) {
                    console.error("Error fetching data:", error);
                }
            };

            fetchData();
        } else {
            console.error("pkid is not provided.");
        }
    }, [pkid]);
    //model close on browser back arrow
    useEffect(() => {
        const handlePopState = () => {
            const modal = document.getElementById("AddCheckAprovv");
            if (modal) {
                modal.classList.remove("show");
                modal.style.display = "none";
                modal.setAttribute("aria-hidden", "true");

                const backdrop = document.querySelector(".modal-backdrop");
                if (backdrop) backdrop.remove();

                document.body.classList.remove("modal-open");
                document.body.style.overflow = "auto";
            }
            navigate("/CheckApproved");
        };

        window.onpopstate = handlePopState;


        return () => {
            window.onpopstate = null;
        };
    }, [navigate]);
    const handleKeyDown = (e, nextInputRef) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (nextInputRef && nextInputRef.current) {
                nextInputRef.current.focus();
            }
        }
    };
    return (
        <div
            className="modal fade"
            id="AddCheckAprovv"
            aria-labelledby="AddCheckAprovvLabel"
            tabIndex={-1}
        >
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content rounded-4 shadow-lg border-0">

                    {/* Close Button */}
                    <div className="d-flex justify-content-end p-3 mbgcolor">
                        <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                        ></button>
                    </div>

                    {/* Modal Body */}
                    <div className="modal-body px-4 pt-0 pb-4 mbgcolor" id="printableArea" >

                        {/* Heading */}
                        <h5 className="text-center fw-bold mb-4 text-primary">चेक मंजूरी फॉर्म</h5>

                        <form onSubmit={handleSubmit}>
                            <div className="row g-3">

                                <div className="col-md-4">
                                    <label className="form-label fw-semibold">चेक क्रमांक <span className="text-danger">*</span></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="chequeno"
                                        value={formData.chequeno}
                                        onChange={handleInputChange}
                                        ref={chequenoRef}
                                        onKeyDown={(e) => handleKeyDown(e, chequedateRef)}
                                    />
                                </div>

                                <div className="col-md-4">
                                    <label className="form-label fw-semibold">चेक तारीख <span className="text-danger">*</span></label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        name="chequedate"
                                        value={formData.chequedate}
                                        onChange={handleInputChange}
                                        ref={chequedateRef}
                                        onKeyDown={(e) => handleKeyDown(e, farmerRef)}
                                    />
                                </div>

                                <div className="col-md-4">
                                    <label className="form-label fw-semibold">चेक रक्कम <span className="text-danger">*</span></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="chequeamount"
                                        value={formData.chequeamount}
                                        onChange={handleInputChange}
                                        ref={amountRef}
                                        readOnly
                                    />
                                </div>

                                <div className="col-12">
                                    <label className="form-label fw-semibold">शेतकरी <span className="text-danger">*</span></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="farmerName"
                                        value={formData.farmerName}
                                        onChange={handleInputChange}
                                        ref={farmerRef}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                showConfirmationAlert(e);
                                            }
                                        }}
                                    />
                                </div>

                                <div className="col-12">
                                    <label className="form-label fw-semibold">खाते नाव</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="facconame"
                                        value={formData.facconame}
                                        onChange={handleInputChange}
                                        ref={amountRef}
                                        readOnly
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label fw-semibold">खाते क्रमांक</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="faccountno"
                                        value={formData.faccountno}
                                        onChange={handleInputChange}
                                        ref={amountRef}
                                        readOnly
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label fw-semibold">आयएफएससी कोड</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="fifsccode"
                                        value={formData.fifsccode}
                                        onChange={handleInputChange}
                                        ref={amountRef}
                                        readOnly
                                    />
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="text-end mt-4">
                                <button
                                    type="button"
                                    className="btn btn-light border me-2"
                                    data-bs-dismiss="modal"
                                >
                                    मागे
                                </button>
                                <button type="submit" className="btn btn-primary px-4">
                                    सेव्ह
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>


    );
};

export default AddCheckAprovv;
