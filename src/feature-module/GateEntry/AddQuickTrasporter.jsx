import React, { useEffect, useRef, useState } from 'react'
import { ACSPLGUID, baseUrl } from '../../core/json/custom';
// import AddGateEntry from './AddGateEntry';
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import axios from 'axios';
import { getUserData } from '../../Context/UserData';
function AddQuickTrasporter({ TAID, NAME, CONTACT, VEHNO }) {
    // const [formData, setFormData] = useState({
    //     TNAME: NAME || "",
    //     TCANTACTNO: CONTACT || "",
    //     VEHICALNO: VEHNO || 'MH ',
    // });
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

    });

    useEffect(() => {
        setFormData({
            TNAME: NAME || "",
            TCANTACTNO: CONTACT || "",
            VEHICALNO: VEHNO || "MH ",
        });
    }, [NAME, CONTACT, VEHNO]);
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

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (e.target.name == 'VEHICALNO' && VEHNO == "") {
            try {

                const payload = {
                    "vehicalno": e.target.value,
                };

                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };

                axios({
                    method: "POST",
                    url: baseUrl.Url + "/backend/api/SP_CheckVehicalNo",
                    data: JSON.stringify(payload),
                    headers: headers,
                })
                    .then((response) => {
                        if (response.status === 200) {
                            console.log(response.data)
                            if (response.data[0].isSuccessful == 1) {
                                Swal.fire({
                                    icon: "error",
                                    title: "Error",
                                    text: response.data[0].responseMessage,
                                    confirmButtonText: "OK",
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                        console.log("data save succsess")
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

        const today = new Date().toISOString().split('T')[0];
        if (VEHNO != "") {
            const payload = {
                "taid": TAID ? TAID : ACSPLGUID.getNew(),
                "tname": formData.TNAME,
                "taddress": formData.TADDRESS,
                "tcity": formData.TCITY,
                "tpincode": formData.TPINCODE,
                "tcantactno": formData.TCANTACTNO,
                "tgstin": formData.TGSTIN,
                "tstate": formData.TSTATE,
                "tpan": formData.TPAN,
                "tbirthdate": formData.TBIRTHDATE,
                "vehicalno": formData.VEHICALNO,
                "vehicaltype": formData.VEHICALTYPE,
                "vehicalcapacity": formData.VEHICALCAPACITY,
                "companyid": "",
                "deptid": "",
                tuid: "",
                uaid: userdetail?.uaid || "",
                fcmtoken: ""
                // "taid": TAID ? TAID : ACSPLGUID.getNew(),
                // "tname": formData.TNAME,
                // "taddress": "",
                // "tcity": "",
                // "tpincode": "",
                // "tcantactno": formData.TCANTACTNO,
                // "tgstin": "",
                // "tstate": "",
                // "tpan": "",
                // "tbirthdate": "",
                // "vehicalno": formData.VEHICALNO,
                // "vehicaltype": "",
                // "vehicalcapacity": "",
                // "companyid": "",
                // "deptid": ""
            };
            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            try {
                const response1 = await axios.post(baseUrl.Url + "/backend/api/SP_AddUpdTransporters", payload, { headers });

                if (response1.status === 200) {
                    Swal.fire({
                        icon: "success",
                        title: "Saved!",
                        text: "Data saved successfully.",
                        confirmButtonText: "OK",
                    }).then((result) => {
                        if (result.isConfirmed) {
                            console.log("Data save success");
                        }
                    });
                }
            } catch (error) {
                console.error("Submission Error:", error);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Failed to save data. Please try again.",
                });
            }
        } else {
            try {
                const payload = {
                    vehicalno: formData.VEHICALNO,
                };

                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };

                const response = await axios.post(baseUrl.Url + "/backend/api/SP_CheckVehicalNo", payload, { headers });

                if (response.status === 200) {
                    console.log(response.data);

                    if (response.data[0].isSuccessful == 1) {
                        Swal.fire({
                            icon: "error",
                            title: "Error",
                            text: response.data[0].responseMessage,
                            confirmButtonText: "OK",
                        }).then((result) => {
                            if (result.isConfirmed) {
                                console.log("Data save success");
                            }
                        });

                    } else {
                        const payload = {
                            "taid": TAID ? TAID : ACSPLGUID.getNew(),
                            "tname": formData.TNAME,
                            "taddress": formData.TADDRESS,
                            "tcity": formData.TCITY,
                            "tpincode": formData.TPINCODE,
                            "tcantactno": formData.TCANTACTNO,
                            "tgstin": formData.TGSTIN,
                            "tstate": formData.TSTATE,
                            "tpan": formData.TPAN,
                            "tbirthdate": formData.TBIRTHDATE,
                            "vehicalno": formData.VEHICALNO,
                            "vehicaltype": formData.VEHICALTYPE,
                            "vehicalcapacity": formData.VEHICALCAPACITY,
                            "companyid": "",
                            "deptid": "",
                            tuid: "",
                            uaid: userdetail?.uaid || "",
                            fcmtoken: ""

                        };

                        try {
                            const response1 = await axios.post(baseUrl.Url + "/backend/api/SP_AddUpdTransporters", payload, { headers });

                            if (response1.status === 200) {
                                Swal.fire({
                                    icon: "success",
                                    title: "Saved!",
                                    text: "Data saved successfully.",
                                    confirmButtonText: "OK",
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                        console.log("Data save success");
                                    }
                                });
                            }
                        } catch (error) {
                            console.error("Submission Error:", error);
                            Swal.fire({
                                icon: "error",
                                title: "Error",
                                text: "Failed to save data. Please try again.",
                            });
                        }
                    }
                }
            } catch (error) {
                console.error("Get data Error:", error);
            }
        }
    };

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     console.log("Form Data:", formData);
    //     const today = new Date().toISOString().split('T')[0];
    //     try {
    //         const payload = {
    //             "taid": ACSPLGUID.getNew(),
    //             "tname": formData.TNAME,
    //             "taddress": "",
    //             "tcity": "",
    //             "tpincode": "",
    //             "tcantactno": formData.TCANTACTNO,
    //             "tgstin": "",
    //             "tstate": "",
    //             "tpan": "",
    //             "tbirthdate": "",
    //             "vehicalno": formData.VEHICALNO,
    //             "vehicaltype": "",
    //             "vehicalcapacity": "",
    //             "companyid": "",
    //             "deptid": ""


    //         };
    //         const headers = {
    //             "Content-Type": "application/json",
    //             Accept: "*/*",
    //         };

    //         // First API Call
    //         const response1 = await axios.post(baseUrl.Url + "/backend/api/SP_AddUpdTransporters", payload1, { headers });

    //         if (response1.status === 200) {
    //             Swal.fire({
    //                 icon: "success",
    //                 title: "Saved!",
    //                 text: "Data saved successfully.",
    //                 confirmButtonText: "OK",
    //             }).then((result) => {
    //                 if (result.isConfirmed) {
    //                     console.log("data save succsess")
    //                 }
    //             });
    //         }
    //     } catch (error) {
    //         console.error("Submission Error:", error);
    //         Swal.fire({
    //             icon: "error",
    //             title: "Error",
    //             text: "Failed to save data. Please try again.",
    //         });
    //     }
    // };
    return (
        <div>
            <div
                className="modal fade"
                id="Tranporterfrom"
                tabIndex={-1}
                aria-labelledby="exampleModalFullscreenLgLabel"
                aria-hidden="true"
                style={{ display: "none" }}
            >
                <div className="modal-dialog modal-fullscreen-lg-down">
                    <div className="modal-content mbgcolor">
                        <div className="modal-header">
                            <h4
                                className="modal-title"
                                id="exampleModalFullscreenLgLabel"
                            >
                                वाहन चालक माहिती
                            </h4>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            />
                        </div>

                        <div className="modal-body">
                            <form onSubmit={handleSubmit}>
                                <div className="row mb-3">
                                    <div className="col-12">
                                        <label className="form-label required">वाहन क्रमांक</label>
                                        {/* <input
                                            type="text"
                                            className="form-control"
                                            name="VEHICALNO"
                                            value={formData.VEHICALNO}
                                            onChange={handleChange}
                                            // onKeyDown={(e) => handleKeyDown(e, VEHICALTYPERef)}
                                            ref={VEHICALNORef}
                                            required
                                        /> */}
                                        <input
                                            type="text"
                                            className="form-control "
                                            name="VEHICALNO"
                                            value={formData.VEHICALNO || ""}
                                            onChange={(e) => {
                                                let inputValue = e.target.value.toUpperCase();

                                                if (!inputValue.startsWith("MH")) {
                                                    inputValue = "MH" + inputValue.replace(/^MH\s*/, "");
                                                }

                                                inputValue = inputValue.replace(/\s+/g, "").replace(/\//g, "");

                                                handleChange(e);
                                            }}
                                            // onKeyDown={(e) => handleKeyDown(e, TOKANNORef)}
                                            required
                                            style={{ fontWeight: "900" }}
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
                                            // onKeyDown={(e) => handleKeyDown(e, TCANTACTNORef)}
                                            required
                                            title="फक्त अक्षरे आणि जागा अनुमत आहेत"
                                            pattern="[A-Za-z ]+"
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
                                            // onKeyDown={(e) => handleKeyDown(e, TBIRTHDATERef)}
                                            required
                                            title="कृपया वैध १० अंकी मोबाईल नंबर प्रविष्ट करा."
                                            pattern="^[0-9]{10}$"
                                        />
                                    </div>
                                </div>

                                <div className="row mt-4">
                                    <div className="col-lg-6 col-sm-12">
                                        <button
                                            type="button"
                                            className="btn btn-secondary w-100"
                                            data-bs-dismiss="modal"
                                        >
                                            Close
                                        </button>
                                    </div>
                                    <div className="col-lg-6 col-sm-12">
                                        <button
                                            type="submit"
                                            className="btn w-100"
                                            style={{ background: "blue", color: "white", border: "none", padding: "10px" }}
                                        >
                                            Submit
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                        {/* <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                data-bs-dismiss="modal"
                            >
                                Close
                            </button>
                        </div> */}
                    </div>
                </div>
            </div >
            {/* <AddGateEntry /> */}
        </div >
    )
}

export default AddQuickTrasporter
