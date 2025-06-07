import React, { useState, useEffect } from 'react';
import Select from 'react-select'
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useNavigate } from 'react-router-dom';
import { ACSPLGUID, baseUrl } from "../../core/json/custom";
import axios from "axios";
import { all_routes } from '../../Router/all_routes';
// import { useLocation } from 'react-router-dom';
import { getUserData } from '../../Context/UserData';
const Addshift = ({ SHID }) => {
    // const { } = location.state || {}
    // const Location = useLocation();
    const MySwal = withReactContent(Swal);
    const navigate = useNavigate();
    const route = all_routes;
    const GUID = ACSPLGUID.getNew();
    const { userdetail } = getUserData();
    const [weekoff, setWeekoff] = useState([]);
    const [formData, setFormData] = useState({
        SHID: '',
        SHNAME: '',
        SHFROMTIME: '',
        SHTOTIME: '',
        WEEKOFF: '',
        SHDESCRIPTION: '',
        SHSTATUS: false,
        MORNINGBREAKFROM: '',
        MORNINGBREAKTO: '',
        LUNCHFROM: '',
        LUNCHTO: '',
        EVENINGBREAKFROM: '',
        EVENINGBREAKTO: ''
    });
    // //Edit
    useEffect(() => {
        const fetchData = async () => {
            if (SHID)

                try {
                    const payload = {
                        shid: SHID,
                        companyid: userdetail?.companyID || "",
                        deptid: userdetail?.departmentID || "",
                    };

                    const headers = {
                        "Content-Type": "application/json",
                        Accept: "*/*",
                    };

                    // API request
                    const response = await axios.post(
                        `${baseUrl.Url}/backend/api/GET_HRMShiftInfo`,
                        payload,
                        { headers }
                    );

                    if (response.status !== 200) {
                        throw new Error("Failed to Fetch Shift Data");
                    }

                    let apiData = response.data[0] || {};

                    setFormData((prev) => ({
                        ...prev,
                        SHNAME: apiData.shname || '',
                        SHFROMTIME: apiData.shfromtime,
                        SHTOTIME: apiData.shtotime,
                        WEEKOFF: weekoff.filter((w) => (apiData.weekoff || '').split(",").includes(w.value.toString())),
                        SHDESCRIPTION: apiData.shdescription || '',
                        SHSTATUS: apiData.shstatus || false,
                        MORNINGBREAKFROM: apiData.morningbreakfrom,
                        MORNINGBREAKTO: apiData.morningbreakto,
                        LUNCHFROM: apiData.lunchfrom,
                        LUNCHTO: apiData.lunchto,
                        EVENINGBREAKFROM: apiData.eveningbreakfrom,
                        EVENINGBREAKTO: apiData.eveningbreakto,
                    }));


                } catch (error) {
                    console.error("Error fetching Shift Data:", error);
                }
        };

        fetchData();
    }, [SHID]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const form = e.target.closest("form");
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        showConfirmationAlert();
    };

    const showConfirmationAlert = () => {
        MySwal.fire({
            title: 'Are you sure?',
            text: 'Do you want to save this data?',
            showCancelButton: true,
            confirmButtonColor: '#00ff00',
            confirmButtonText: 'SAVE',
            cancelButtonColor: '#092C4C',
            cancelButtonText: 'CANCEL',
        }).then((result) => {
            if (result.isConfirmed) {
                handleFormSubmission();
            }
        });
    };

    const handleFormSubmission = async () => {
        try {
            const payload = {
                "shid": SHID ? SHID : GUID,
                "shname": formData.SHNAME,
                "shfromtime": formData.SHFROMTIME,
                "shtotime": formData.SHTOTIME,
                "weekoff": formData.WEEKOFF.map((w) => w.value).join(","),
                "shdescription": formData.SHDESCRIPTION,
                "shstatus": formData.SHSTATUS,
                "morningbreakfrom": formData.MORNINGBREAKFROM,
                "morningbreakto": formData.MORNINGBREAKTO,
                "lunchfrom": formData.LUNCHFROM,
                "lunchto": formData.LUNCHTO,
                "eveningbreakfrom": formData.EVENINGBREAKFROM,
                "eveningbreakto": formData.EVENINGBREAKTO,
                "companyid": userdetail?.companyID || "",
                "deptid": userdetail?.departmentID || "",

            };


            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            const response = await axios.post(baseUrl.Url + "/backend/api/SP_AddUpdHRMShiftInfo",
                JSON.stringify(payload), { headers });

            console.log("payload", payload);

            if (response.status === 200) {
                Swal.fire({
                    icon: "success",
                    title: "Saved!",
                    text: "Data saved successfully.",
                    confirmButtonText: "OK",
                }).then((result) => {
                    if (result.isConfirmed) {
                        // Reset formData
                        setFormData({
                            SHID: '',
                            SHNAME: '',
                            SHFROMTIME: '',
                            SHTOTIME: '',
                            WEEKOFF: '',
                            SHDESCRIPTION: '',
                            SHSTATUS: false,
                            MORNINGBREAKFROM: '',
                            MORNINGBREAKTO: '',
                            LUNCHFROM: '',
                            LUNCHTO: '',
                            EVENINGBREAKFROM: '',
                            EVENINGBREAKTO: ''
                        });

                        // Close Modal
                        const modal = document.getElementById("Addshift");
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
            } else {
                throw new Error("Failed to save master data.");
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
    useEffect(() => {
        const handleShortcut = (e) => {
            if (e.ctrlKey && e.key === "s" || e.ctrlKey && e.key === 'S') {
                e.preventDefault();
                checkFormValidity(e);
            }

            if (e.ctrlKey && e.key === "e") {
                e.preventDefault();
                showExitAlert();
            }
        };

        window.addEventListener("keydown", handleShortcut);

        return () => {
            window.removeEventListener("keydown", handleShortcut);
        };
    }, [formData, navigate, route.shift, handleSubmit]);

    const showExitAlert = () => {
        MySwal.fire({
            title: "Are you sure?",
            text: "Do you want to Exit?",
            showCancelButton: true,
            confirmButtonColor: "#00ff00",
            confirmButtonText: "YES",
            cancelButtonColor: "#092C4C",
            cancelButtonText: "NO",
        }).then((result) => {
            if (result.isConfirmed) {
                // Reset formData
                setFormData({
                    SHID: '',
                    SHNAME: '',
                    SHFROMTIME: '',
                    SHTOTIME: '',
                    WEEKOFF: '',
                    SHDESCRIPTION: '',
                    SHSTATUS: false,
                    MORNINGBREAKFROM: '',
                    MORNINGBREAKTO: '',
                    LUNCHFROM: '',
                    LUNCHTO: '',
                    EVENINGBREAKFROM: '',
                    EVENINGBREAKTO: ''
                });

                // Close Modal
                const modal = document.getElementById("Addshift");
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


    const checkFormValidity = (e) => {
        const { SHNAME, SHFROMTIME, SHTOTIME, WEEKOFF, SHDESCRIPTION,
            MORNINGBREAKFROM, MORNINGBREAKTO,
            LUNCHFROM, LUNCHTO,
            EVENINGBREAKFROM, EVENINGBREAKTO } = formData;

        // 1. Validate Shift Name
        if (!SHNAME.trim()) {
            Swal.fire({
                icon: "error",
                title: "Validation Error",
                text: "Please enter Shift Name",
            }).then(() => {
                document.getElementsByName("SHNAME")[0].focus();
            });
            return;
        }

        // 2. Validate Shift Timings
        if (!SHFROMTIME) {
            Swal.fire({
                icon: "error",
                title: "Validation Error",
                text: "Please select 'From Time'",
            }).then(() => {
                document.getElementsByName("SHFROMTIME")[0].focus();
            });
            return;
        }

        if (!SHTOTIME) {
            Swal.fire({
                icon: "error",
                title: "Validation Error",
                text: "Please select 'To Time'",
            }).then(() => {
                document.getElementsByName("SHTOTIME")[0].focus();
            });
            return;
        }

        if (SHFROMTIME >= SHTOTIME) {
            Swal.fire({
                icon: "error",
                title: "Validation Error",
                text: "'To Time' must be greater than 'From Time'",
            }).then(() => {
                document.getElementsByName("SHTOTIME")[0].focus();
            });
            return;
        }

        // 3. Validate WeekOFF (Must select at least one)
        if (!WEEKOFF || WEEKOFF.length === 0) {
            Swal.fire({
                icon: "error",
                title: "Validation Error",
                text: "Please select at least one WeekOff",
            });
            return;
        }

        // 4. Validate Description
        if (!SHDESCRIPTION.trim()) {
            Swal.fire({
                icon: "error",
                title: "Validation Error",
                text: "Please enter a description",
            }).then(() => {
                document.getElementsByName("SHDESCRIPTION")[0].focus();
            });
            return;
        }

        // 5. Ensure at least one Break Time is filled
        const isBreakTimeFilled = MORNINGBREAKFROM && MORNINGBREAKTO &&
            LUNCHFROM && LUNCHTO && EVENINGBREAKFROM && EVENINGBREAKTO;

        if (!isBreakTimeFilled) {
            Swal.fire({
                icon: "error",
                title: "Validation Error",
                text: "Please enter all break time (Morning, Lunch, or Evening).",
            });
            return;
        }

        // 6. Validate Morning Break
        if (MORNINGBREAKFROM && MORNINGBREAKTO && MORNINGBREAKFROM >= MORNINGBREAKTO) {
            Swal.fire({
                icon: "error",
                title: "Validation Error",
                text: "Morning Break 'To Time' must be greater than 'From Time'",
            }).then(() => {
                document.getElementsByName("MORNINGBREAKTO")[0].focus();
            });
            return;
        }

        // 7. Validate Lunch Break
        if (LUNCHFROM && LUNCHTO && LUNCHFROM >= LUNCHTO) {
            Swal.fire({
                icon: "error",
                title: "Validation Error",
                text: "Lunch 'To Time' must be greater than 'From Time'",
            }).then(() => {
                document.getElementsByName("LUNCHTO")[0].focus();
            });
            return;
        }

        // 8. Validate Evening Break
        if (EVENINGBREAKFROM && EVENINGBREAKTO && EVENINGBREAKFROM >= EVENINGBREAKTO) {
            Swal.fire({
                icon: "error",
                title: "Validation Error",
                text: "Evening Break 'To Time' must be greater than 'From Time'",
            }).then(() => {
                document.getElementsByName("EVENINGBREAKTO")[0].focus();
            });
            return;
        }

        // If all validations pass, submit the form
        handleSubmit(e);
    };


    useEffect(() => {

        const fetchImplications = async () => {
            try {
                const response = await axios.get(
                    baseUrl.Url + "/backend/api/Implications/WEEKOFF",
                    // "http://adsvr:78/api/Implications/SOLID|LIQUID|GAS"
                );

                if (response.status !== 200) throw new Error("Failed to fetch implications data");

                const data = response.data;

                // Combine all implications into one array
                const implicationsDropdown = data.map(({ iTitle, iValue }) => ({
                    label: iTitle,
                    value: iValue,
                }));

                setWeekoff(implicationsDropdown);
            } catch (error) {
                console.error("Error fetching implications:", error);
            }
        };

        fetchImplications();
    }, []);

    const handleInputChange = (e) => {
        const { name, value, type } = e.target;

        let formattedValue = value;
        if (type === "time") {
            formattedValue = value ? value : "";
        }

        setFormData((prev) => ({
            ...prev,
            [name]: formattedValue,
        }));
    };



    // Handle multi-select changes
    const handleMultiSelectChange = (selectedOptions) => {
        setFormData((prevData) => ({
            ...prevData,
            WEEKOFF: selectedOptions || [], // Store as an array of selected objects
        }));
    };
    const handleCheckboxChange = () => {
        setFormData({ ...formData, SHSTATUS: !formData.SHSTATUS });
    };


    // const handleTimeChange = (time, timeString) => {
    //     setFormData((prev) => ({ ...prev, SHFROMTIME: timeString }));
    // };

    const handleTimeChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value
        }));
    };

    return (
        <div>
            {/* Add Shift */}
            <div className="modal fade" id="Addshift">
                <div className="modal-dialog modal-dialog-centered custom-modal-two">
                    <div className="modal-content">
                        <div className="page-wrapper-new p-0">
                            <div className="content">
                                <div className="modal-header border-0 custom-modal-header">
                                    <div className="page-title">
                                        <h4>Add New Shift</h4>
                                    </div>
                                    <button
                                        type="button"
                                        className="close"
                                        // data-bs-dismiss="modal"
                                        aria-label="Close"
                                        onClick={showExitAlert}
                                    >
                                        <span aria-hidden="true">×</span>
                                    </button>
                                </div>
                                <div className="modal-body custom-modal-body">
                                    <form onSubmit={handleSubmit}>
                                        <ul
                                            className="nav nav-pills modal-table-tab"
                                            id="pills-tab"
                                            role="tablist"
                                        >
                                            <li className="nav-item" role="presentation">
                                                <button
                                                    className="nav-link active"
                                                    id="pills-add-shift-info-tab"
                                                    data-bs-toggle="pill"
                                                    data-bs-target="#pills-add-shift-info"
                                                    type="button"
                                                    role="tab"
                                                    aria-controls="pills-add-shift-info"
                                                    aria-selected="true"
                                                >
                                                    Shift Info
                                                </button>
                                            </li>
                                            <li className="nav-item" role="presentation">
                                                <button
                                                    className="nav-link"
                                                    id="pills-add-break-tab"
                                                    data-bs-toggle="pill"
                                                    data-bs-target="#pills-add-break"
                                                    type="button"
                                                    role="tab"
                                                    aria-controls="pills-add-break"
                                                    aria-selected="false"
                                                >
                                                    Break Timings
                                                </button>
                                            </li>
                                        </ul>
                                        <div className="tab-content" id="pills-tabContent">
                                            <div
                                                className="tab-pane fade show active"
                                                id="pills-add-shift-info"
                                                role="tabpanel"
                                                aria-labelledby="pills-add-shift-info-tab"
                                            >
                                                <div className="row">
                                                    <div className="col-lg-12">
                                                        <div className="input-blocks">
                                                            <label>Shift Name</label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                name="SHNAME"
                                                                id="SHNAME"
                                                                value={formData.SHNAME}
                                                                onChange={handleInputChange}
                                                                required
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-6">
                                                        <div className="input-blocks">
                                                            <label>From</label>
                                                            <input
                                                                type="time"
                                                                name="SHFROMTIME"
                                                                id="SHFROMTIME"
                                                                value={formData.SHFROMTIME || ""}
                                                                onChange={handleInputChange}
                                                                required
                                                            />

                                                        </div>
                                                    </div>
                                                    <div className="col-lg-6">
                                                        <div className="input-blocks">
                                                            <label>To</label>
                                                            <input
                                                                type="time"
                                                                name="SHTOTIME"
                                                                id="SHTOTIME"
                                                                value={formData.SHTOTIME}
                                                                onChange={(e) => handleTimeChange("SHTOTIME", e.target.value)}
                                                                required
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-12">
                                                        <div className="input-blocks">
                                                            <label>WeekOFF</label>
                                                            <Select
                                                                classNamePrefix="react-select"
                                                                placeholder="Select WeekOff"
                                                                options={weekoff}
                                                                isMulti
                                                                getOptionLabel={(option) => option.label}
                                                                value={formData.WEEKOFF} // Now properly handled as an array
                                                                onChange={handleMultiSelectChange}
                                                                styles={{
                                                                    menu: (base) => ({
                                                                        ...base,
                                                                        zIndex: 1050,
                                                                    }),
                                                                }}
                                                                required
                                                            />

                                                        </div>
                                                    </div>
                                                    <div className="col-lg-12">
                                                        <div className="input-blocks summer-description-box">
                                                            <label>Description</label>
                                                            <textarea
                                                                className="form-control"
                                                                name="SHDESCRIPTION"
                                                                rows="4"
                                                                placeholder="Enter description here..."
                                                                value={formData.SHDESCRIPTION}
                                                                onChange={handleInputChange}
                                                                required
                                                            />
                                                        </div>
                                                        <div className="input-blocks m-0">
                                                            <div className="status-toggle modal-status d-flex justify-content-between align-items-center">
                                                                <span className="status-label">Status</span>
                                                                <input
                                                                    type="checkbox"
                                                                    id="status"
                                                                    className="check"
                                                                    checked={formData.SHSTATUS}
                                                                    onChange={handleCheckboxChange}
                                                                    required
                                                                />
                                                                <label htmlFor="status" className="checktoggle mb-0" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div
                                                className="tab-pane fade"
                                                id="pills-add-break"
                                                role="tabpanel"
                                                aria-labelledby="pills-add-break-tab"
                                            >
                                                <div className="break-title">
                                                    <h4>Morning Break</h4>
                                                </div>
                                                <div className="row">
                                                    <div className="col-lg-6">
                                                        <div className="input-blocks">
                                                            <label>From</label>
                                                            <input
                                                                type="time"
                                                                value={formData.MORNINGBREAKFROM}
                                                                onChange={(e) => handleTimeChange("MORNINGBREAKFROM", e.target.value)}
                                                                required
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-6">
                                                        <div className="input-blocks">
                                                            <label>To</label>
                                                            <input
                                                                type="time"
                                                                value={formData.MORNINGBREAKTO}
                                                                onChange={(e) => handleTimeChange("MORNINGBREAKTO", e.target.value)}
                                                                required
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="break-title">
                                                    <h4>Lunch</h4>
                                                </div>
                                                <div className="row">
                                                    <div className="col-lg-6">
                                                        <div className="input-blocks">
                                                            <label>From</label>
                                                            <input
                                                                type="time"
                                                                value={formData.LUNCHFROM}
                                                                onChange={(e) => handleTimeChange("LUNCHFROM", e.target.value)}
                                                                required
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-6">
                                                        <div className="input-blocks">
                                                            <label>To</label>
                                                            <input
                                                                type="time"
                                                                value={formData.LUNCHTO}
                                                                onChange={(e) => handleTimeChange("LUNCHTO", e.target.value)}
                                                                required
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="break-title">
                                                    <h4>Evening Break</h4>
                                                </div>
                                                <div className="row">
                                                    <div className="col-lg-6">
                                                        <div className="input-blocks">
                                                            <label>From</label>
                                                            <input
                                                                type="time"
                                                                value={formData.EVENINGBREAKFROM}
                                                                onChange={(e) => handleTimeChange("EVENINGBREAKFROM", e.target.value)}
                                                                required
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-6">
                                                        <div className="input-blocks">
                                                            <label>To</label>
                                                            <input
                                                                type="time"
                                                                value={formData.EVENINGBREAKTO}
                                                                onChange={(e) => handleTimeChange("EVENINGBREAKTO", e.target.value)}
                                                                required
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="modal-footer-btn">
                                            <button
                                                type="button"
                                                className="btn btn-cancel me-2"
                                                // data-bs-dismiss="modal"
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
                        </div >
                    </div >
                </div >
            </div >
            {/* /Add Shift */}
        </div >
    )
}
export default Addshift
