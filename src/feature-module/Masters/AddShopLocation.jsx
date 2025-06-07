import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import axios from 'axios';
import { all_routes } from "../../Router/all_routes";

import { baseUrl, ACSPLGUID } from "../../core/json/custom";
const AddShopLocation = () => {
    const route = all_routes;
    const MySwal = withReactContent(Swal);
    const [formData, setformData] = useState({
        TITLE: "",
    });
    const [ImplicationCNT, setImplicationCNT] = useState('');
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setformData(prevState => ({
            ...prevState,
            [name]: type === "checkbox" ? checked : value
        }));
    };


    const handleSubmit = async () => {

        if (!formData.TITLE) {
            MySwal.fire({
                title: "योग्य माहिती भरा",
                text: "कृपया पुढे जाण्यापूर्वी सर्व आवश्यक माहिती भरा!",
                icon: "error",
                confirmButtonColor: "#ff0000",
                confirmButtonText: "ठीक आहे",
                allowOutsideClick: false,
                allowEscapeKey: false
            });
            return;
        }



        MySwal.fire({
            title: 'तुम्हाला खात्री आहे का?',
            text: 'तुम्हाला ही माहिती सेव  करायची आहे का?',
            showCancelButton: true,
            confirmButtonColor: '#00ff00',
            confirmButtonText: 'SAVE',
            cancelButtonColor: '#092C4C',
            cancelButtonText: 'रद्द करा',
            allowOutsideClick: false,
            allowEscapeKey: false
        })
            .then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        const payload1 = {
                            "implicationAutoID": ACSPLGUID.getNew(),
                            "implicationTitle": formData.TITLE,
                            "implicationValue": String(ImplicationCNT + 1),
                            "implicationGroup": "SHOPLOC",
                            "implicationOrder": ImplicationCNT + 1,
                            "isSystemDefined": true,
                            "isIgnored": false

                        };



                        const headers = {
                            "Content-Type": "application/json",
                            Accept: "*/*",
                        };

                        // API Call
                        const response1 = await axios.post(baseUrl.Url + "/backend/api/SP_AddUpdST_Implication", payload1, { headers });

                        if (response1.status === 200) {


                            MySwal.fire({
                                icon: "success",
                                title: "साठवले!",
                                text: "माहिती यशस्वीरित्या सेव  केली",
                                confirmButtonText: "OK",
                                allowOutsideClick: false,
                                allowEscapeKey: false
                            }).then(() => {
                                window.dispatchEvent(new Event("handleReload"));


                                setformData({ TITLE: "" });


                                const modalElement = document.getElementById("add-units-category");
                                const modalInstance = bootstrap.Modal.getInstance(modalElement);
                                if (modalInstance) {
                                    modalInstance.hide();
                                }

                                MySwal.close();
                            });
                        } else {
                            throw new Error("Failed to save master data.");
                        }
                    } catch (error) {
                        console.error("Submission Error:", error);
                        MySwal.fire({
                            icon: "error",
                            title: "त्रुटी",
                            text: "माहिती सेव  करण्यास अपयश. कृपया पुन्हा प्रयत्न करा",
                            allowOutsideClick: false,
                            allowEscapeKey: false
                        });
                    }
                } else {
                    MySwal.close(); // Close Swal if Cancel is clicked
                }
            });
    };


    useEffect(() => {

        const fetchImplication = async () => {
            try {
                const payload =
                {
                    "cnt": 0
                }


                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };
                const response = await axios.post(
                    `${baseUrl.Url}/backend/api/GET_ST_Implication_ShopLOC`,

                    payload,
                    { headers }
                );
                if (response.status !== 200)
                    throw new Error("Failed to fetch vendor data");
                console.log("Implication", response.data)
                console.log("Implication", response.data[0].cnt)
                setImplicationCNT(response.data[0].cnt);
            } catch (error) {
                console.error("Error fetching Implication data:", error);
            }
        };

        fetchImplication();

    }, []);
    return (

        <>
            {/* Add Category */}
            <div className="modal fade" id="add-units-category">
                <div className="modal-dialog modal-dialog-centered custom-modal-two">
                    <div className="modal-content">
                        <div className="page-wrapper-new p-0">
                            <div className="content">
                                <div className="modal-header border-0 custom-modal-header">
                                    <div className="page-title">
                                        <h4>नविन शॉप ठिकाण </h4>
                                    </div>
                                    <button
                                        type="button"
                                        className="close"
                                        data-bs-dismiss="modal"
                                        aria-label="Close"
                                        onClick={() => window.dispatchEvent(new Event("handleReload"))}
                                    >
                                        <span aria-hidden="true">×</span>
                                    </button>
                                </div>
                                <div className="modal-body custom-modal-body">
                                    <div className="mb-3">
                                        <label className="form-label">सेवा नाव</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="TITLE"  // ✅ Add this
                                            value={formData.TITLE}
                                            onChange={handleChange}
                                        />

                                    </div>
                                    <div className="modal-footer-btn">
                                        <Link
                                            to="#"
                                            className="btn btn-cancel me-2"
                                            data-bs-dismiss="modal"
                                            onClick={() => window.dispatchEvent(new Event("handleReload"))}
                                        >
                                            मागे
                                        </Link>
                                        <Link

                                            className="btn btn-submit"
                                            onClick={handleSubmit}
                                        >
                                            सेव्ह
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* /Add Category */}
        </>
    );
};

export default AddShopLocation;
