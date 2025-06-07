import React, { useEffect, useRef, useState } from 'react'
import { ACSPLGUID, baseUrl, formatDate } from '../../core/json/custom';
// import AddGateEntry from './AddGateEntry';
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import axios from 'axios';
import { getUserData } from '../../Context/UserData';
function AddQuickFarmer({ FAID, FNAME, FADHAR, FCONTACT }) {
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
    });

    useEffect(() => {
        setFormData({
            FAID: '',
            FNAME: FNAME || "",
            FCONTACTNO: FCONTACT || "",
            FADDHARNO: FADHAR || "",
        });
    }, [FAID, FNAME, FCONTACT, FADHAR]);



    const FNAMERef = useRef(null);
    const FCONTACTNORef = useRef(null);
    const FBIRTHDATERef = useRef(null);
    const FADDHARNORef = useRef(null);


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
        if (e.target.name == 'FADDHARNO' && FAID == '') {
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
        if (FAID != '') {
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
                fcmtoken: "",
                refid: "",
                uaid: userdetail?.uaid || "",
                uid: "",
                fprofile: "",
                date: formatDate(userdetail.APPDT)
            };
            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };
            try {
                const response1 = await axios.post(baseUrl.Url + "/backend/api/SP_AddUpdFarmer", payload1, { headers });

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
    };

    return (
        <div>
            <div
                className="modal fade"
                id="Farmerfrom"
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
                                शेतकरी माहिती
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
                                    <div className="row mb-3">
                                        <div className="col-12">
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
                                    </div>

                                    <div className="col-12">
                                        <label className='required form-label'>पूर्ण नाव</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter Full Name"
                                            name="FNAME"
                                            value={formData.FNAME || ""}
                                            onChange={handleChange}
                                            pattern="^[A-Za-z\s]+$"
                                            title="पूर्ण नाव वैध असावे, ज्यात सुरुवातीला रिकाम्या जागा नकोत."
                                            ref={FNAMERef}

                                        />
                                    </div>
                                </div>

                                <div className="row mb-3">
                                    <div className="col-12">
                                        <label className='required form-label'>मोबाईल नंबर</label>
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

export default AddQuickFarmer
