// import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { ACSPLGUID, baseUrl } from "../../core/json/custom";
import axios from 'axios';
import Swal from "sweetalert2";
import { all_routes } from "../../Router/all_routes";
import { getUserData } from '../../Context/UserData';
// import { all_routes } from "../../../Router/all_routes";
const AddLeaveType = ({ LTID }) => {
    const route = all_routes;
    console.log("LTID", LTID)
    const GUID = ACSPLGUID.getNew()
    // const route = all_routes;
    const { userdetail } = getUserData();



    // const navigate = useNavigate();
    // const location = useLocation();
    // const { LTID } = location.state || {};
    // console.log('primaryKey', LTID)
    const [formData, setFormData] = useState({
        Name: "",
        LeaveQuota: "",
        Status: true, // Default status to true (checked)
        Createddate: ""
    });
    const showExitAlert = () => {
        Swal.fire({
            title: "Are you sure?",
            text: "Do you want to Exit?",
            showCancelButton: true,
            confirmButtonColor: "#00ff00",
            confirmButtonText: "YES",
            cancelButtonColor: "#092C4C",
            cancelButtonText: "NO",
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = route.leavestype;
            }
        });
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                // First API call to fetch vendor data
                const payload1 = {
                    "ltid": LTID,
                    "companyid": userdetail?.companyID || "",
                    "deptid": userdetail?.departmentID || "",
                };
                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };

                const response1 = await axios.post(
                    `${baseUrl.Url}/backend/api/GET_LeaveType`,
                    payload1,
                    { headers }
                );
                if (response1.status !== 200)
                    throw new Error("Failed to fetch vendor data");

                console.log("master", response1.data);
                if (response1.data.length > 0) {
                    setFormData(prevState => ({
                        ...prevState,
                        Name: response1.data[0].lname,
                        LeaveQuota: response1.data[0].lleavequota,
                        Status: response1.data[0].lstatus

                    }));
                }



            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [LTID]);


    // Set the current date automatically on component mount
    useEffect(() => {
        const currentDate = new Date().toISOString().slice(0, 10); // Format: YYYY-MM-DD
        setFormData((prevState) => ({ ...prevState, Createddate: currentDate }));
    }, []);
    // Handle input change
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        {
            if (!formData.Name || !formData.LeaveQuota) {
                Swal.fire({
                    icon: "error",
                    title: "Validation Error",
                    text: "Please fill all fields .",
                }).then(() => {
                    document.getElementById("LeaveDate")?.focus();
                });
                return;
            }
        }
        try {
            // Prepare payload
            const payload = {
                ltid: LTID ? LTID : GUID,
                lname: formData.Name || "",
                lleavequota: formData.LeaveQuota || "",
                lstatus: formData.Status, // Send as boolean (true/false)
                lcreateddate: formData.Createddate,
                companyid: userdetail?.companyID || "",
                deptid: userdetail?.departmentID || "",


            };

            console.log("Payload after processing arrays:", payload);

            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            // API call to save the leave type
            await axios.post(baseUrl.Url + "/backend/api/SP_AddUpdHRMLeaveType", payload, { headers });

            Swal.fire({
                icon: "success",
                title: "Saved!",
                text: "Data saved successfully.",
                confirmButtonText: "OK",
            }).then((result) => {

                // Clear the masterData state
                setFormData({

                    Name: "",
                    LeaveQuota: "",
                    Status: true,

                });

                if (result.isConfirmed) {
                    // Navigate to SalesEnquiry after user clicks OK
                    window.location.href = route.leavestype;
                }
            });
            try {
                const payload = {
                    "ltid": "%",
                    "companyid": userdetail?.companyID || "",
                    "deptid": userdetail?.departmentID || "",
                };
                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };

                axios({
                    method: "POST",
                    url: baseUrl.Url + "/backend/api/GET_LeaveType",
                    data: JSON.stringify(payload),
                    headers: headers,
                })
                    .then((response) => {
                        if (response.status != 200) throw new Error("Failed to Fetching Data");
                        // const DATA = response.data;
                        // setCustomer(DATA);
                    })

            } catch (error) {
                console.error("Error fetching Access Right Data:", error);
            }


        } catch (error) {
            console.error("Submission Error:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to save data. Please try again.",
            });
        }
    };

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     try {
    //         // Prepare payload
    //         const payload = {
    //             ltid: GUID,
    //             lname: formData.Name || "",
    //             lleavequota: formData.LeaveQuota || "",
    //             lstatus: formData.Status ? "1" : "0", // Convert true/false to "1"/"0"
    //             companyid: "defaultCompanyID", // Replace with actual values
    //             deptid: "defaultDeptID", // Replace with actual values
    //             asid: GUID,
    //         };

    //         console.log("Payload after processing arrays:", payload);

    //         const headers = {
    //             "Content-Type": "application/json",
    //             Accept: "*/*",
    //         };

    //         // First API call to save the quotation master

    //         await axios({
    //             method: "POST",
    //             url: baseUrl.Url + "/backend/api/SP_AddUpdHRMLeaveType",
    //             data: JSON.stringify(payload),
    //             headers: headers,
    //         });


    //         Swal.fire({
    //             icon: "success",
    //             title: "Saved!",
    //             text: "Data saved successfully.",
    //             confirmButtonText: "OK",
    //         });

    //         navigate(route.RequisitionMaster);
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
            {/* Add Leave Type Modal */}
            <div className="modal fade" id="add-units">
                <div className="modal-dialog modal-dialog-centered custom-modal-two">
                    <div className="modal-content">
                        <div className="page-wrapper-new p-0">
                            <div className="content">
                                <div className="modal-header border-0 custom-modal-header">
                                    <div className="page-title">
                                        <h4>Add New Leave Type</h4>
                                    </div>
                                    <button
                                        type="button"
                                        className="close"
                                        data-bs-dismiss="modal"
                                        aria-label="Close"
                                    >
                                        <span aria-hidden="true">×</span>
                                    </button>
                                </div>
                                <div className="modal-body custom-modal-body">
                                    <form onSubmit={handleSubmit}>
                                        <div className="row">
                                            <div className="col-lg-12">
                                                <div className="mb-3">
                                                    <label className="form-label">Name</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="Name"
                                                        value={formData.Name}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-lg-12">
                                                <div className="mb-3">
                                                    <label className="form-label">Leave Quota</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="LeaveQuota"
                                                        value={formData.LeaveQuota}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                            </div>
                                            <div className="input-blocks m-0">
                                                <div className="status-toggle modal-status d-flex justify-content-between align-items-center">
                                                    <span className="status-label">Status</span>
                                                    <input
                                                        type="checkbox"
                                                        id="user3"
                                                        className="check"
                                                        name="Status"
                                                        checked={formData.Status}
                                                        onChange={handleChange}
                                                    />
                                                    <label htmlFor="user3" className="checktoggle"></label>
                                                </div>
                                            </div>
                                            <div className="col-lg-6">
                                                <div className="mb-3">
                                                    <label className="form-label">Created date</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="Createddate"
                                                        value={formData.Createddate}
                                                        readOnly

                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="modal-footer-btn">
                                            <button
                                                type="button"
                                                className="btn btn-cancel me-2"

                                                onClick={showExitAlert}
                                            >

                                                Cancel
                                            </button>
                                            <button type="submit" className="btn btn-submit">
                                                Submit
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* /Add Leave Type Modal */}
        </div>
    );
};

export default AddLeaveType;
