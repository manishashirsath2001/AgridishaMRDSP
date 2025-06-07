import React, { useState, useEffect } from "react";
// import { OverlayTrigger, Tooltip } from "react-bootstrap";
// import ImageWithBasePath from "../../core/img/imagewithbasebath";
// import { Link } from "react-router-dom";
import axios from 'axios';
import { baseUrl, ACSPLGUID } from "../../core/json/custom";
// import { setToogleHeader } from "../../core/redux/action";
// import { useDispatch, useSelector } from "react-redux";
import {
    ArrowLeft,

} from "react-feather";
// import Table from "../../core/pagination/datatable";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import Select from "react-select";


const AddPayRoll = ({ PAID }) => {
    const [payStructure, setPayStructure] = useState([]);
    const [payStructure1, setPayStructure1] = useState([]);

    // const [Customer, setCustomer] = useState([]);
    const GUID = ACSPLGUID.getNew()

    const [Employee, setEmployee] = useState();
    const [formData, setFormData] = useState({
        otherallowance: 0,
        bonus: '',
        medical: '',
        conveyance: '',
        HRA: '',
        totalallowances: '',
        basic: '',
        otherdeduction: 0,
        loan: '',
        TDS: '',
        professionaltax: '',
        totaldeduction: '',
        PF: '',
        salaryallowances: '',
        statustab: false,
        PAID: '',
        Emp: '',

    });


    // //Edit
    useEffect(() => {
        const fetchData = async () => {
            if (!PAID) return;
            try {
                const payload = {
                    paid: PAID,
                    companyid: "",
                    deptid: "",
                };

                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };

                // API request
                const response = await axios.post(
                    `${baseUrl.Url}/backend/api/GET_HRMPayroll`,
                    payload,
                    { headers }
                );

                if (response.status !== 200) {
                    throw new Error("Failed to Fetch Payroll Data");
                }

                let apiData = response.data[0] || {};

                setFormData((prev) => ({
                    ...prev,
                    basic: apiData.pbasicsalary || "",
                    allowance_0: apiData.phraallowance,
                    allowance_1: apiData.pmedicalallowance,
                    allowance_2: apiData.pbonus,
                    allowance_3: apiData.pconveyance,
                    allowance_4: apiData.pallowancesother,
                    deduction_0: apiData.ppf,
                    deduction_1: apiData.ploanandother,
                    deduction_2: apiData.pprofessionaltax,
                    deduction_4: apiData.ptds,
                    deduction_5: apiData.pdeductionother,
                    statustab: apiData.pstatus || false,
                    salaryallowances: apiData.pnetsalarey,
                    totaldeduction: apiData.ptotaldeduction,
                    totalallowances: apiData.ptotalallowance,
                    Emp: apiData.pemployee,

                }));

            } catch (error) {
                console.error("Error fetching Payroll Data:", error);
            }
        };

        fetchData();
    }, [PAID]);

    useEffect(() => {

        const fetchVendors = async () => {
            try {
                const payload = {
                    "paid": "%",
                    "companyid": "",
                    "deptid": ""
                };
                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };
                const response = await axios.post(
                    `${baseUrl.Url}/backend/api/GET_HRMPayroll `,
                    payload,
                    { headers }
                );
                if (response.status !== 200)
                    throw new Error("Failed to fetch vendor data");
                console.log("quatation master", response.data)
                // setCustomer(response.data);
            } catch (error) {
                console.error("Error fetching vendor data:", error);
            }
        };

        fetchVendors();

    }, []);


    useEffect(() => {
        //transpoter api dropdown
        const fetchtranspoter = async () => {
            try {
                const payload = {
                    "keyword": "%",
                    "empid": "%",
                    "companyid": "COMP123456789",
                    "deptid": "D001"
                }
                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };

                axios({
                    method: "POST",
                    url: baseUrl.Url + "/backend/api/GET_HRMEmployeesName",
                    data: JSON.stringify(payload),
                    headers: headers,
                })
                    .then((response) => {
                        if (response.status != 200) throw new Error("Failed to Fetching Data");
                        const DATA = response.data;
                        const formoftranspoterData = DATA
                            .map(({ empname, empid }) => ({
                                label: empname,
                                value: empid,
                            }));
                        setEmployee(formoftranspoterData);
                    })

            } catch (error) {
                console.error("Error fetching vendor data:", error);
            }
        };

        fetchtranspoter();

    }, []);

    ////Basic sallary
    useEffect(() => {
        const fetchPayStructure = async () => {
            try {
                const payload = {
                    paid: "%", // Assuming percentage is specified here
                    companyid: "",
                    deptid: "",
                };

                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };

                const response = await axios.post(`${baseUrl.Url}/backend/api/GET_PayStructure`,
                    payload, { headers });

                if (response.status !== 200) throw new Error("Failed to Fetch Pay Structure");

                const data = response.data;


                setPayStructure(data);
                setPayStructure1(data);
            } catch (error) {
                console.error("Error fetching pay structure data:", error);
            }
        };

        fetchPayStructure();
    }, []);


    const handleChange = (e) => {
        const { name, value } = e.target;
        const newValue = parseFloat(value) || 0;

        console.log(`Field Name: ${name}, New Value: ${newValue}`); // Log the updated field

        setFormData((prevData) => {
            const updatedData = { ...prevData, [name]: newValue };
            if (name === 'basic') {
                let totalAllowances = 0;
                let totalDeductions = 0;
                let totalSalary = newValue;

                // Update allowance values
                payStructure.forEach((row, index) => {
                    if (row.ptype === '0') {  // Allowance logic
                        const allowanceValue = (newValue * row.ptpvalue) / 100;
                        updatedData[`allowance_${index}`] = allowanceValue;
                        totalAllowances += allowanceValue;
                        console.log(`Allowance ${row.pname} (${row.ptpvalue}%): ${allowanceValue}`);
                    }
                });

                // Update deduction values
                payStructure1.forEach((row, index) => {
                    if (row.ptype === '1') {  // Deduction logic
                        const deductionValue = (newValue * row.ptpvalue) / 100;
                        updatedData[`deduction_${index}`] = deductionValue;
                        totalDeductions += deductionValue;
                        console.log(`Deduction ${row.pname} (${row.ptpvalue}%): ${deductionValue}`);
                    }
                });

                // Set the total allowances, total deductions, and net salary
                updatedData.totalallowances = totalAllowances;
                updatedData.totaldeduction = totalDeductions;
                updatedData.salaryallowances = totalSalary + totalAllowances - totalDeductions;

                // Log the totals
                console.log(`Total Allowances: ${totalAllowances}`);
                console.log(`Total Deductions: ${totalDeductions}`);
                console.log(`Net Salary (Basic + Allowances - Deductions): ${updatedData.salaryallowances}`);
            }
            console.log(updatedData, "updatedData")
            return updatedData;
        });
    };


    const handleChangeStatus = (newStatus) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            statustab: newStatus,
        }));
        console.log('newStatus', newStatus)

    };


    const handleSubmit = (e) => {
        e.preventDefault();
        showConfirmationAlertS(e)
        console.log('formData', formData)
    };



    const handleSave = async () => {
        try {
            const payload = {
                "paid": PAID ? PAID : GUID,
                "pemployee": formData.Emp,
                "pbasicsalary": formData.basic,
                "pstatus": formData.statustab,
                "phraallowance": formData.allowance_0 || 0,
                "pmedicalallowance": formData.allowance_1 || 0,
                "pbonus": formData.allowance_2 || 0,
                "pconveyance": formData.allowance_3 || 0,
                "pallowancesother": formData.allowance_4 || 0,
                "ppf": formData.deduction_PK16C1AAD27FA796382023 || 0, // Deduction based on 'paid'
                "ploanandother": formData.deduction_PK16C1AB22597494332021 || 0,
                "pprofessionaltax": formData.deduction_PK16C1AB22597494332022 || 0,
                "ptds": formData.deduction_PK16C1AB22597494332021 || 0,
                "pdeductionother": formData.deduction_34 || 0,
                "ptotalallowance": formData.totalallowances,
                "ptotaldeduction": formData.totaldeduction,
                "pnetsalarey": formData.salaryallowances,
                "companyid": "",
                "deptid": ""
            };

            console.log("Payload for Save:", payload);  // Log the payload

            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            const response = await axios.post(baseUrl.Url + "/backend/api/SP_AddUpdHRMPayroll",
                JSON.stringify(payload), { headers });

            if (response.status === 200) {
                Swal.fire({
                    icon: "success",
                    title: "Saved!",
                    text: "Data saved successfully.",
                    confirmButtonText: "OK",
                }).then(() => {
                    setFormData({
                        otherallowance: 0,
                        allowance_2: '',
                        allowance_3: '',
                        allowance_4: '',
                        allowance_1: '',
                        conveyance: '',
                        allowance_0: '',
                        totalallowances: '',
                        basic: '',
                        otherdeduction: 0,
                        loan: '',
                        TDS: '',
                        professionaltax: '',
                        totaldeduction: '',
                        PF: '',
                        salaryallowances: '',
                        statustab: false,
                        PAID: '',
                        Emp: '',
                    });

                    // Close Modal
                    const modal = document.getElementById("payroll-list");
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
                    otherallowance: 0,
                    bonus: '',
                    medical: '',
                    conveyance: '',
                    HRA: '',
                    totalallowances: '',
                    basic: '',
                    otherdeduction: 0,
                    loan: '',
                    TDS: '',
                    professionaltax: '',
                    totaldeduction: '',
                    PF: '',
                    salaryallowances: '',
                    statustab: false,
                    PAID: '',
                    Emp: '',
                });

                const offcanvas = document.querySelector(".offcanvas.show");
                if (offcanvas) {
                    offcanvas.classList.remove("show");
                    offcanvas.style.visibility = "hidden";
                    offcanvas.setAttribute("aria-hidden", "true");

                    const backdrop = document.querySelector(".offcanvas-backdrop");
                    if (backdrop) {
                        backdrop.remove();
                    }

                    document.body.classList.remove("offcanvas-open");
                    document.body.style.overflow = "auto";

                    setTimeout(() => {
                        offcanvas.style.visibility = "";
                        offcanvas.removeAttribute("aria-hidden");
                    }, 300);
                }
            }
        });
    };

    const MySwal = withReactContent(Swal);

    // const showConfirmationAlert = () => {
    //     MySwal.fire({
    //         title: "Are you sure?",
    //         text: "You won't be able to revert this!",
    //         showCancelButton: true,
    //         confirmButtonColor: "#00ff00",
    //         confirmButtonText: "Yes, delete it!",
    //         cancelButtonColor: "#ff0000",
    //         cancelButtonText: "Cancel",
    //     }).then((result) => {
    //         if (result.isConfirmed) {
    //             MySwal.fire({
    //                 title: "Deleted!",
    //                 text: "Your file has been deleted.",
    //                 className: "btn btn-success",
    //                 confirmButtonText: "OK",
    //                 customClass: {
    //                     confirmButton: "btn btn-success",
    //                 },
    //             });
    //         } else {
    //             MySwal.close();
    //         }
    //     });
    // };


    const showConfirmationAlertS = () => {
        MySwal.fire({
            title: "Are you sure?",
            text: "Do you want to save this data?",
            showCancelButton: true,
            confirmButtonColor: "#00ff00",
            confirmButtonText: "SAVE",
            cancelButtonColor: "#092C4C",
            cancelButtonText: "CANCEL",
        }).then((result) => {
            if (result.isConfirmed) {
                handleSave();
            }
        });
    };


    return (
        <>

            {/* Add Payroll */}
            <div
                className="offcanvas offcanvas-end em-payrol-add"
                tabIndex={-1}
                id="AddPayroll"
            >
                <div className="offcanvas-body p-0">
                    <div className="page-wrapper-new">
                        <div className="content">
                            <div className="page-header justify-content-between">
                                <div className="page-title">
                                    <h4>Add New Payroll</h4>
                                </div>
                                <div className="page-btn">
                                    <a
                                        href="#"
                                        className="btn btn-added"
                                        onClick={showExitAlert}
                                    >
                                        <ArrowLeft className="me-2" />
                                        Back To List
                                    </a>
                                </div>
                            </div>
                            {/* /add */}
                            <div className="card">
                                <div className="card-body">
                                    <form onSubmit={handleSubmit}>
                                        <div className="row">
                                            <div className="col-lg-3 col-sm-6 col-12">
                                                <div className="mb-3">
                                                    <label className="form-label">
                                                        Select Employee <span>*</span>
                                                    </label>
                                                    <Select
                                                        classNamePrefix="react-select"
                                                        options={Employee}
                                                        // value={Employee.find((option) => option.value === formData.Emp) || null}
                                                        value={Array.isArray(Employee) && Employee.find((option) => option.value === formData.Emp) || null}
                                                        onChange={(selectedOption) => {
                                                            setFormData((prevData) => ({
                                                                ...prevData,
                                                                Emp: selectedOption ? selectedOption.value : '',
                                                            }));
                                                        }}

                                                        placeholder="Choose"
                                                    />
                                                </div>
                                            </div>
                                            <div className="text-title">
                                                <p>Salary Information</p>
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">
                                                    Basic Salary <span>*</span>
                                                </label>
                                                <input
                                                    type="number"
                                                    className="text-form form-control"
                                                    name="basic"
                                                    min="0"
                                                    step="any"
                                                    onChange={handleChange}
                                                    value={formData.basic || ''}
                                                    required
                                                />
                                            </div>
                                            <div className="payroll-info d-flex">
                                                <label className="form-label">Status</label>
                                                {/* <p>Status</p> */}
                                                <div className="status-updates">
                                                    <ul
                                                        className="nav nav-pills list mb-3"
                                                        name="statustab"
                                                        role="tablist"
                                                        required
                                                        value={formData.statustab || ""}
                                                    >
                                                        <li className="nav-item" role="presentation">
                                                            <button
                                                                className={`nav-link ${formData.statustab === true ? 'active' : ''}`}
                                                                id="pills-home-tab"
                                                                data-bs-toggle="pill"
                                                                data-bs-target="#pills-home"
                                                                type="button"
                                                                role="tab"
                                                                onClick={() => handleChangeStatus(true)}
                                                            >
                                                                <span className="form-check form-check-inline ">
                                                                    <span className="form-check-label">Paid</span>
                                                                </span>
                                                            </button>
                                                        </li>
                                                        <li className="nav-item" role="presentation">
                                                            <button
                                                                className={`nav-link ${formData.statustab === false ? 'active' : ''}`}
                                                                id="pills-profile-tab"
                                                                data-bs-toggle="pill"
                                                                data-bs-target="#pills-profile"
                                                                type="button"
                                                                role="tab"
                                                                onClick={() => handleChangeStatus(false)}
                                                            >
                                                                <span className="form-check form-check-inline">
                                                                    <span className="form-check-label">
                                                                        Unpaid
                                                                    </span>
                                                                </span>
                                                            </button>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>

                                            <div className="payroll-title">
                                                <p>Allowances</p>
                                            </div>
                                            <div className="row">
                                                {payStructure.length > 0
                                                    ? payStructure
                                                        .filter((row) => row.ptype === '0') // Filtering Allowances (ptype == '0')
                                                        .map((row, index) => (
                                                            <div key={index} className="col-lg-3 col-sm-6 col-12 mb-3">
                                                                <label className="form-label">
                                                                    {row.pname} ({row.ptpvalue}%)
                                                                </label>
                                                                <input
                                                                    type="number"
                                                                    className="form-control"
                                                                    name={`allowance_${index}`}
                                                                    value={formData[`allowance_${index}`] || 0}
                                                                    onChange={handleChange}
                                                                    required
                                                                    min={0}
                                                                    step="any"
                                                                    title="Only Positive Numbers Allowed"
                                                                    readOnly
                                                                />
                                                            </div>
                                                        ))
                                                    : null}
                                            </div>

                                            <div className="payroll-title">
                                                <p>Deductions</p>
                                            </div>

                                            <div className="row">
                                                {payStructure1.length > 0
                                                    ? payStructure1
                                                        .filter((row) => row.ptype === '1') // Filtering Deductions (ptype == '1')
                                                        .map((row, index) => (
                                                            <div key={index} className="col-lg-3 col-sm-6 col-12 mb-3">
                                                                <label className="form-label">
                                                                    {row.pname} ({row.ptpvalue}%)
                                                                </label>
                                                                <input
                                                                    type="number"
                                                                    className="form-control"
                                                                    name={`deduction_${index}`}
                                                                    value={formData[`deduction_${index}`] || 0}
                                                                    onChange={handleChange}
                                                                    required
                                                                    min={0}
                                                                    step="any"
                                                                    readOnly
                                                                />
                                                            </div>
                                                        ))
                                                    : null}
                                            </div>

                                            <div className="payroll-title">
                                                <p>Deductions</p>
                                            </div>
                                            <div className="row">
                                                <div className="col-lg-4 col-sm-6 col-12">
                                                    <div className="mb-3">
                                                        <label className="form-label">Total Allowance</label>
                                                        <input
                                                            type="number"
                                                            className="form-control"
                                                            name="totalallowances"
                                                            value={formData.totalallowances || ''}
                                                            readOnly
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-4 col-sm-6 col-12">
                                                    <div className="mb-3">
                                                        <label className="form-label">Total Deduction</label>
                                                        <input
                                                            type="number"
                                                            className="form-control"
                                                            name="totaldeduction"
                                                            value={formData.totaldeduction || ''}
                                                            readOnly
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-4 col-sm-6 col-12">
                                                    <div className="mb-3">
                                                        <label className="form-label">Net Salary</label>
                                                        <input
                                                            type="number"
                                                            className="form-control"
                                                            name="salaryallowances"
                                                            value={formData.salaryallowances || ''}
                                                            readOnly
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-lg-12">
                                                <div className="view-btn">
                                                    {/* <button type="button" className="btn btn-previw me-2">
                                                     Preview
                                                    </button> */}
                                                    <button type="button" className="btn btn-reset me-2"
                                                        onClick={showExitAlert}>
                                                        Exit
                                                    </button>
                                                    <button className="btn btn-save">
                                                        Save
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                            {/* /add */}
                        </div>
                    </div>
                </div>
            </div>

            {/* /Add Payroll */}
            {/* Edit Payroll */}

            {/* Edit Payroll */}
        </>
    );
};

export default AddPayRoll;

