import React, { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import Select from "react-select";
import "bootstrap/dist/css/bootstrap.min.css";
import {
    ArrowLeft
} from "feather-icons-react/build/IconComponents";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axios from 'axios';
import { all_routes } from "../../Router/all_routes"
import { ACSPLGUID, baseUrl, convertToISODate } from "../../core/json/custom";

import {
    PlusCircle,
    Trash2,
    Edit
} from "feather-icons-react/build/IconComponents";
import { getUserData } from "../../Context/UserData"


const AddVVapasiSlabDetail = ({ VSAID, onRefresh, vpid }) => {

    console.log(VSAID, "VSAID on model**********************************************************************");
    // const { vpid } = location.state || {};
    // console.log('vpid  ', vpid)
    const MySwal = withReactContent(Swal);
    const userdetail = getUserData();
    const navigate = useNavigate();
    const route = all_routes;
    const GUID = ACSPLGUID.getNew();




    const schemedateRef = useRef(null);
    const schemenameRef = useRef(null);
    const descriptionRef = useRef(null);
    const statusRef = useRef(null);
    const saveRef = useRef(null);

    const startdateRef = useRef(null);
    const enddateRef = useRef(null);
    const duedateRef = useRef(null);
    const kalavadhiRef = useRef(null);
    const percentRef = useRef(null);
    const addRef = useRef(null);



    const [status, setStatus] = useState([]);

    const [kalavadhi, setKalavadhi] = useState([]);

    const [tableData, setTableData] = useState([]);

    const [RowsData, setRowsData] = useState([]);
    const [showSecondTable, setShowSecondTable] = useState(false);

    console.log(setTableData);


    const [masterData, setMasterData] = useState({
        schemeno: "",
        schemedate: "",
        schemename: "",
        description: "",
        status: "",


    });


    const handleMasterInputChange = (selectedOption) => {
        if (selectedOption) {
            console.log("Dropdown selected vsaid:", selectedOption.value); // ✅ DEBUG
            setVsaid(selectedOption.value);
        }
    };

    const [formData, setFormData] = useState({
        vsdaid: "",
        startdate: "",
        enddate: "",
        duedate: "",
        kalavadhi: "",
        percent: "",
        IsDeleted: 0,
    });


    const [TableRowData, setTableRowData] = useState({
        vpid: "",
        vsaid: "",
        vsdaid: "",
        duE_DAY: "",
        tO_DAY: "",
        VVapasi: "",
        Vkalavadhi: "",
        Vpercent: "",
        IsDeleted: 0,
    });


    useEffect(() => {
        console.log("Updated tableData: ", tableData);
    }, [tableData]);



    const handleDetailInputChange = (e) => {
        const { name, value } = e.target;


        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value,
        }));

        setTableRowData(prevTableRowData => ({
            ...prevTableRowData,
            [name]: value,
        }));
    };



    // imlication fetch for dropdown
    useEffect(() => {

        const status = async () => {
            try {
                const response = await axios.get(
                    baseUrl.Url + "/backend/api/Implications/STATUS"
                );

                if (response.status !== 200) throw new Error("Failed to fetch implications data");

                const data = response.data;
                const implicationsDropdown = data.map(({ iTitle, iValue }) => ({
                    label: iTitle,
                    value: iValue,
                }));

                setStatus(implicationsDropdown);
            } catch (error) {
                console.error("Error fetching implications:", error);
            }
        };
        const kalavadhi = async () => {
            try {
                const response = await axios.get(
                    baseUrl.Url + "/backend/api/Implications/KALAVADHI"
                );

                if (response.status !== 200) throw new Error("Failed to fetch implications data");

                const data = response.data;
                const implicationsDropdown = data.map(({ iTitle, iValue }) => ({
                    label: iTitle,
                    value: iValue,
                }));

                setKalavadhi(implicationsDropdown);
            } catch (error) {
                console.error("Error fetching implications:", error);
            }
        };

        status();
        kalavadhi();
    }, []);

    // To fetch and Set VyapariSlabMasterData

    // Add row in details
    const addRecord = (e) => {
        if (e) e.preventDefault(); // Only if triggered by form

        // Validation
        if (!TableRowData.duE_DAY || !/^\d+$/.test(TableRowData.duE_DAY.trim())) {
            Swal.fire({
                icon: "error",
                title: "Validation Error of startdate",
                text: "Please enter the startdate, Only digits, and remove space from start and end.",
            });
            return;
        }

        if (!TableRowData.tO_DAY || !/^\d+$/.test(TableRowData.tO_DAY.trim())) {
            Swal.fire({
                icon: "error",
                title: "Validation Error of enddate",
                text: "Please enter the enddate, Only digits, and remove space from start and end.",
            });
            return;
        }

        if (!TableRowData.VVapasi || !/^\d+$/.test(TableRowData.VVapasi.trim())) {
            Swal.fire({
                icon: "error",
                title: "Validation Error of duedate",
                text: "Please enter the duedate, Only digits, and remove space from start and end.",
            });
            return;
        }



        // Debugging: Check if TableRowData is being populated correctly
        console.log("TableRowData:", TableRowData);

        // Add new record to table data
        const newRecord = {
            vsaid: vsaid,                                // Identify which vsaid to add for this row
            vsdaid: TableRowData.vsdaid || formData.vsdaid,
            duE_DAY: TableRowData.duE_DAY.trim(),
            tO_DAY: TableRowData.tO_DAY.trim(),
            VVapasi: TableRowData.VVapasi.trim(),
            Vkalavadhi: TableRowData.Vkalavadhi,
            IsDeleted: false,
        };

        // Debugging: Check if the new record is created correctly
        console.log("New Record to be added:", newRecord);

        // Add the new record to the existing rows data
        setRowsData(prev => {
            console.log("Previous Rows Data:", prev);  // Debugging the existing rows data
            return [...prev, newRecord];
        });

        // Clear the input fields after adding the record
        setTableRowData({
            vsaid: "",
            vsdaid: "",
            duE_DAY: '',
            tO_DAY: '',
            VVapasi: '',
            Vkalavadhi: '',
        });
    };


    const handleSubmit = (e) => {
        e.preventDefault(e);


        showConfirmationAlert(e);

        console.log("table Data Submitted:", tableData);
        console.log("Master part Submitted:", masterData);

    };






    // Edit Detail Record 
    const handleEdit = (vsdaid) => {
        const filteredProducts = tableData.filter((data) => data.vsdaid == vsdaid);

        if (filteredProducts.length > 0) {
            const selectedData = filteredProducts[0];

            setFormData({
                vsdaid: selectedData.vsdaid,
                startdate: selectedData.startdate,
                enddate: selectedData.enddate,
                duedate: selectedData.duedate,
                kalavadhi: selectedData.kalavadhi,
                IsDeleted: 0,
            });

            // फक्त एकच row दुसऱ्या table मध्ये दाखवण्यासाठी selectedRow सेट करा
            setSelectedRow(selectedData); // <-- हे नवीन

            setShowSecondTable(true);
        }
    };

    const [selectedRow, setSelectedRow] = useState(null);

    const handleInputEdit = (vpid) => {
        const selectedRow = RowsData.find(item => item.vpid === vpid);
        if (selectedRow) {
            setTableRowData({
                duE_DAY: selectedRow.duE_DAY || '',
                tO_DAY: selectedRow.tO_DAY || '',
                VVapasi: selectedRow.VVapasi || '',
                Vkalavadhi: selectedRow.Vkalavadhi || '',
                vpid: selectedRow.vpid || '',
                vsdaid: selectedRow.vsdaid || '',
                IsDeleted: 0,
            });


            if (startdateRef && startdateRef.current) {
                startdateRef.current.focus();
            }
        }
    };
    // delete Detail Record 
    const handleDelete = (vpid) => {
        Swal.fire({
            title: "तुम्हाला खात्री आहे का?",
            text: "तुम्ही हे बदलू शकणार नाही!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "हो, ते हटवा!",
            cancelButtonText: "रद्द करा",
        }).then((result) => {
            if (result.isConfirmed) {
                // Make sure prevData is an array
                setTableRowData((prevData) => {
                    if (Array.isArray(prevData)) {
                        return prevData.map((data) =>
                            data.vpid === vpid ? { ...data, IsDeleted: 1 } : data
                        );
                    }
                    return []; // Return empty array if prevData is not an array
                });

                Swal.fire({
                    icon: "success",
                    title: "Deleted!",
                    text: "रेकॉर्ड हटवले...!",
                    confirmButtonText: "OK",
                });
            }
        });
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
        }).then((result) => {
            if (result.isConfirmed) {


                setFormData({
                    ...formData,
                    startdate: "",
                    enddate: "",
                    duedate: "",
                    kalavadhi: "",
                    percent: "",
                });

                setTableRowData({
                    vsaid: "",
                    vsdaid: "",
                    duE_DAY: "",
                    tO_DAY: "",
                    VVapasi: "",
                    Vkalavadhi: "",
                    Vpercent: "",
                    IsDeleted: 0,
                });

                setTableData([]);

                const modal = document.getElementById("AddVyapariSlab");

                if (modal) {
                    modal.classList.remove("show");
                    modal.style.display = "none";
                    modal.setAttribute("aria-hidden", "true");

                    const modalBackdrop = document.querySelector(".modal-backdrop");
                    if (modalBackdrop) {
                        modalBackdrop.remove();
                    }

                    modal.removeAttribute("aria-modal");
                    modal.removeAttribute("role");

                    document.body.classList.remove("modal-open");
                    document.body.style.overflow = "";
                    document.body.style.paddingRight = "";
                }

                // Refresh data after exit (if onRefresh is passed as prop)
                if (onRefresh) {
                    onRefresh(); // Call the onRefresh callback passed from parent component (e.g., Bill.jsx)
                }
            }
        });
    };



    // Handle keyboard shortcuts with validation
    useEffect(() => {
        const handleShortcut = (e) => {
            if (e.ctrlKey && (e.key === 'e' || e.key === 'E')) {
                e.preventDefault();
                showExitAlert();
            }
            if (e.ctrlKey && (e.key === 's' || e.key === 'S')) {
                e.preventDefault();
                validateinput();
            }
        };

        window.addEventListener('keydown', handleShortcut);

        return () => {
            window.removeEventListener('keydown', handleShortcut);
        };
    }, [masterData, handleSubmit]);

    // validation on C+S only for master inputs
    const validateinput = (e) => {
        const { Vsaid } = vsaid;


        // if (!schemedate || !/^\d{12}$/.test(schemedate))
        if (!Vsaid) {
            Swal.fire({
                icon: "error",
                title: "Validation Error",
                text: "कृपया स्कीम निवडा  .",
            }).then(() => {
                schemedateRef.current.focus();
            });
            return;
        }


        handleSubmit(e);
    };

    //on enter form will save.function
    const handleKeyDown = (e, nextRef, isLast = false) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (isLast) {
                addRecord();
            } else if (nextRef && nextRef.current) {
                nextRef.current.focus();
            }
        }
    };


    //////////////////////////////////////////////////////////////

    const [vyapari, setvyapari] = useState([]);
    const [vsaid, setVsaid] = useState("");
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
                    `${baseUrl.Url}/backend/api/GET_SCHEMENAME`,
                    payload,
                    { headers }
                );
                if (response.status !== 200)
                    throw new Error("Failed to fetch vendor data");
                console.log("requisition setails", response.data)
                const data = response.data;
                const conuterData = data
                    .map(({ schemename, vsaid }) => ({
                        label: schemename,
                        value: vsaid
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
                    vsaid: vsaid,
                    companyid: userdetail?.companyID ? userdetail.companyID : "",
                    deptid: userdetail?.departmentID ? userdetail.departmentID : "",
                };

                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };

                const response = await axios.post(
                    `${baseUrl.Url}/backend/api/GET_VyapariSchemeDetails`,
                    payload1,
                    { headers }
                );

                if (response.status !== 200) throw new Error("Failed to fetch data");

                const apiData = response.data.filter(item => item.vsaid === vsaid);

                if (apiData.length === 0) {
                    console.warn("No data found for selected vsaid");
                    return;
                }


                const firstItem = apiData[0];
                setFormData((prev) => ({
                    ...prev,
                    vsaid: firstItem.vsaid,
                    vsdaid: firstItem.vsdaid,  // Set the correct vsdaid
                    startdate: firstItem.startdate,
                    enddate: firstItem.enddate,
                    duedate: firstItem.duedate,
                    kalavadhi: firstItem.kalavadhi,
                }));


                setTableData(
                    apiData.map(item => ({
                        vsdaid: item.vsdaid,
                        startdate: item.startdate || "",
                        enddate: item.enddate || "",
                        duedate: item.duedate || "",
                        kalavadhi: item.kalavadhi || "",
                        percent: item.percent || "",
                        IsDeleted: item.IsDeleted || 0,
                    }))
                );

                console.log("Fetched & set data for table:", apiData);
            } catch (error) {
                console.error("Error in Master API Call:", error);
            }
        };

        fetchMasterData();
    }, [vsaid]);


    const handleFormSubmission = async () => {
        try {

            // Ensure table data is not empty and has valid rows
            const filteredRows = RowsData.filter(row =>
                !row.IsDeleted &&
                (row.duE_DAY || row.tO_DAY || row.VVapasi || row.Vkalavadhi)
            );

            const payload = filteredRows.map(row => ({
                // vpid: vpid || GUID,
                vpid: row.vpid ? row.vpid : ACSPLGUID.getNew(),
                vsaid: vsaid,
                vsdaid: row.vsdaid,
                duE_DAY: row.duE_DAY,
                tO_DAY: row.tO_DAY,
                vapasi: row.VVapasi,
                isactive: row.isactive,
                companyid: userdetail?.companyID ? userdetail.companyID : "",
                deptid: userdetail?.departmentID ? userdetail.departmentID : "",
                uaid: userdetail?.uaid ? userdetail.uaid : "",
            }));

            console.log("Payload to submit:", JSON.stringify(payload, null, 2));

            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            // API call for saving data
            await axios.post(`${baseUrl.Url}/backend/api/SP_AddVyapariVapasi`, payload, { headers });

            Swal.fire({
                icon: "success",
                title: "Saved!",
                text: "Data saved successfully.",
                confirmButtonText: "OK",
            }).then((result) => {
                if (result.isConfirmed) {
                    setTableData([]);  // Clear table after user confirms
                    setFormData({});
                    navigate(route.VyapariSlab);
                }
            });

            // Clear form state
            setTableData([]);
            setRowsData([]);
            setFormData({});

        } catch (error) {
            console.error("Submission Error:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to save data. Please try again.",
            });
        }
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
        }).then((result) => {
            if (result.isConfirmed) {
                handleFormSubmission();

            }
        });
    };

    const customSelectStyles = {
        menu: (provided) => ({
            ...provided,
            zIndex: 5,
        }),
    };



    useEffect(() => {
        const fetchData = async () => {
            if (vpid) {
                try {
                    const payload = {
                        vpid: vpid,
                        companyid: userdetail?.companyID ? userdetail.companyID : "",
                        deptid: userdetail?.departmentID ? userdetail.departmentID : "",
                    };

                    const headers = {
                        "Content-Type": "application/json",
                        Accept: "*/*",
                    };

                    const response = await axios.post(
                        baseUrl.Url + "/backend/api/GET_VyapariVapasiDetails",
                        JSON.stringify(payload),
                        { headers }
                    );

                    if (response.status !== 200) {
                        throw new Error("Failed to fetch Vyapari data");
                    }

                    const apiData = response.data[0];
                    setTableRowData({
                        vpid: apiData.vpid,
                        vsaid: apiData.vsaid,
                        vsdaid: apiData.vsdaid,
                        startdate: apiData.duE_DAY,
                        enddate: apiData.tO_DAY,
                        vapasi: apiData.VVapasi,

                    });

                } catch (error) {
                    console.error("Error fetching Vyapari data:", error);
                }
            }
        };

        fetchData();
    }, [vpid]);

    return (
        <div>
            {/* master inputs */}
            <div className="modal fade" id="AddVyapariSlab">

                <div className="modal-dialog modal-dialog-centered modal-fullscreen">
                    <div className="modal-content">
                        <div className="page-wrapper-new p-0">
                            <div className="content">
                                <div className="modal-header border-0 custom-modal-header">
                                    <div className="page-title">
                                        <h4>व्यापारी स्लॅब</h4>
                                    </div>

                                    <div className="page-btn">

                                        <Link className="btn btn-secondary"
                                            onClick={showExitAlert}
                                        >
                                            <ArrowLeft className="me-2" />
                                            मागे
                                        </Link>
                                    </div>
                                </div>
                                <div className="modal-body custom-modal-body" style={{
                                    overflow: "hidden",
                                }}>
                                    <form onSubmit={handleSubmit}>




                                        <div className="col-lg-4 col-sm-6 col-12">
                                            <div className="mb-0">
                                                <label className="form-label required">स्कीम नाव</label>

                                                <Select
                                                    placeholder="Select"
                                                    classNamePrefix="react-select"
                                                    options={vyapari}
                                                    value={vyapari.find((option) => option.value === vsaid) || null}
                                                    onChange={(selectedOption) => {
                                                        if (selectedOption) {
                                                            setVsaid(selectedOption.value);
                                                        }
                                                    }}
                                                    autoFocus
                                                    styles={customSelectStyles}
                                                    required
                                                />

                                            </div>
                                        </div>



                                        {/* start (Detail) */}
                                        <div className="border p-3 rounded shadow-sm mb-4 mt-3">

                                            <div className="col-lg-12">

                                                <div className="modal-body-table overflow-auto max-vh-100" >
                                                    <div className="table-responsive" style={{ height: "calc(40vh - 120px)" }}>
                                                        <table className="table table-bordered table-sm">
                                                            {/* <thead className="thead-dark" style={{ tableLayout: "fixed" }}> */}
                                                            <thead className="thead-dark bg-white" style={{ position: "sticky", top: 0, zIndex: 2 }}>


                                                                <tr>
                                                                    {/* <th className="col-2">पीक प्रकार </th> */}
                                                                    <th className="col-2">सुरूवातीची दिनांक</th>
                                                                    <th className="col-1">शेवटची दिनांक</th>
                                                                    <th className="col-1">अंतिम दिनांक</th>
                                                                    <th className="col-1">कालावधी</th>

                                                                    <th className="col-1 text-center" >कृती </th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>


                                                                {tableData.filter(
                                                                    (data) =>
                                                                        !data.IsDeleted &&
                                                                        (data.startdate || data.enddate || data.duedate || data.kalavadhi)
                                                                ).length > 0 ? (
                                                                    tableData
                                                                        .filter(
                                                                            (data) =>
                                                                                !data.IsDeleted &&
                                                                                (data.startdate || data.enddate || data.duedate || data.kalavadhi)
                                                                        )
                                                                        .map((data, index) => (
                                                                            <tr key={data.vsdaid || index}>


                                                                                <td className="col-1" >{data.startdate}</td>
                                                                                <td className="col-1" >{data.enddate}</td>
                                                                                <td className="col-1" >{data.duedate}</td>
                                                                                {/* <td className="col-1" >{data.kalavadhi}</td> */}

                                                                                <td className="col-1">
                                                                                    {Number(data.kalavadhi) === 0
                                                                                        ? 'Current Month'
                                                                                        : Number(data.kalavadhi) === 1
                                                                                            ? 'Next Month'
                                                                                            : Number(data.kalavadhi) === 2
                                                                                                ? 'Same Date'
                                                                                                : ''}
                                                                                </td>


                                                                                {/* <td className="col-1" >{data.percent}</td> */}


                                                                                <td className="col-1 text-center">
                                                                                    <Link
                                                                                        to="#"
                                                                                        onClick={() => handleEdit(data.vsdaid)}
                                                                                        className="me-2 p-1"
                                                                                        style={{ color: 'lightblue' }}
                                                                                    >
                                                                                        <Edit className="feather-edit" />
                                                                                    </Link>




                                                                                </td>
                                                                            </tr>
                                                                        ))
                                                                ) : (
                                                                    <tr>
                                                                        <td colSpan="8" className="text-center">No records found</td>
                                                                    </tr>
                                                                )
                                                                }
                                                            </tbody>


                                                        </table>
                                                    </div>
                                                </div>
                                            </div>


                                        </div>

                                        {showSecondTable && (

                                            <div className="border p-3 rounded shadow-sm mb-4 mt-3">

                                                <div className="col-lg-12">
                                                    <table className="table table-bordered table-sm">
                                                        {/* <thead className="thead-dark" style={{ tableLayout: "fixed" }}> */}
                                                        <thead className="thead-dark bg-white" style={{ position: "sticky", top: 0, zIndex: 2 }}>


                                                            <tr>
                                                                {/* <th className="col-2">पीक प्रकार </th> */}
                                                                <th className="col-2">सुरूवातीची दिनांक</th>
                                                                <th className="col-1">शेवटची दिनांक</th>
                                                                <th className="col-1">अंतिम दिनांक</th>
                                                                <th className="col-1">कालावधी</th>

                                                                {/* <th className="col-1 text-center" >कृती </th> */}
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {selectedRow ? (
                                                                <tr key={selectedRow.vsdaid}>
                                                                    <td className="col-1">{selectedRow.startdate}</td>
                                                                    <td className="col-1">{selectedRow.enddate}</td>
                                                                    <td className="col-1">{selectedRow.duedate}</td>
                                                                    <td className="col-1">
                                                                        {Number(selectedRow.kalavadhi) === 0
                                                                            ? 'Current Month'
                                                                            : Number(selectedRow.kalavadhi) === 1
                                                                                ? 'Next Month'
                                                                                : Number(selectedRow.kalavadhi) === 2
                                                                                    ? 'Same Date'
                                                                                    : ''}
                                                                    </td>
                                                                    {/* <td className="col-1 text-center">
                                                                        <Link
                                                                            to="#"
                                                                            onClick={() => handleEdit(selectedRow.vsdaid)}
                                                                            className="me-2 p-1"
                                                                            style={{ color: 'lightblue' }}
                                                                        >
                                                                            <Edit className="feather-edit" />
                                                                        </Link>
                                                                    </td> */}
                                                                </tr>
                                                            ) : (
                                                                <tr>
                                                                    <td colSpan="8" className="text-center">No records found</td>
                                                                </tr>
                                                            )}
                                                        </tbody>


                                                    </table>
                                                    <div className="modal-body-table overflow-auto max-vh-100" >

                                                        <div className="table-responsive" style={{ height: "calc(40vh - 120px)" }}>

                                                            <table className="table table-bordered table-sm">
                                                                {/* <thead className="thead-dark" style={{ tableLayout: "fixed" }}> */}
                                                                <thead className="thead-dark bg-white" style={{ position: "sticky", top: 0, zIndex: 2 }}>


                                                                    <tr>
                                                                        {/* <th className="col-2">पीक प्रकार </th> */}
                                                                        <th className="col-2">थकबाकीपासून दिवस</th>
                                                                        <th className="col-1">पर्यंत दिवस</th>
                                                                        <th className="col-1">वापसी(%)</th>
                                                                        {/* <th className="col-1">कालावधी</th> */}

                                                                        <th className="col-1 text-center" >कृती </th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>

                                                                    {/* {tableData.filter((data) => !data.IsDeleted).length > 0 ? (
                                                                                                         tableData
                                     
                                                                                                             .filter((data) => !data.IsDeleted) */}
                                                                    {RowsData.filter(
                                                                        (data) =>
                                                                            !data.IsDeleted &&
                                                                            (data.duE_DAY || data.tO_DAY || data.VVapasi || data.Vkalavadhi)
                                                                    ).length > 0 ? (
                                                                        RowsData
                                                                            .filter(
                                                                                (data) =>
                                                                                    !data.IsDeleted &&
                                                                                    (data.duE_DAY || data.tO_DAY || data.VVapasi || data.Vkalavadhi)
                                                                            )
                                                                            .map((data, index) => (
                                                                                <tr key={data.vsdaid || index}>
                                                                                    {/* <tr key={data || index}> */}

                                                                                    {/* <td className="col-3">
                                                                                                                         {cropType.find((option) => option.value === data.croptype)?.label || "Not Found"}
                                                                                                                     </td> */}

                                                                                    <td className="col-1" >{data.duE_DAY}</td>
                                                                                    <td className="col-1" >{data.tO_DAY}</td>
                                                                                    <td className="col-1" >{data.VVapasi}</td>
                                                                                    {/* <td className="col-1" >{data.kalavadhi}</td> */}




                                                                                    <td className="col-1 text-center">
                                                                                        <Link
                                                                                            to="#"
                                                                                            onClick={() => handleInputEdit(data.vpid)}
                                                                                            className="me-2 p-1"
                                                                                            style={{ color: 'lightblue' }}
                                                                                        >
                                                                                            <Edit className="feather-edit" />
                                                                                        </Link>

                                                                                        <Link
                                                                                            to="#"
                                                                                            className="confirm-text p-2"
                                                                                            onClick={() => handleDelete(data.vpid)}
                                                                                        >
                                                                                            <Trash2 className="feather-trash-2 text-danger" />
                                                                                        </Link>


                                                                                    </td>
                                                                                </tr>
                                                                            ))
                                                                    ) : (
                                                                        <tr>
                                                                            <td colSpan="8" className="text-center">No records found</td>
                                                                        </tr>
                                                                    )
                                                                    }
                                                                </tbody>


                                                            </table>

                                                        </div>
                                                    </div>


                                                    <div className="addservice-info">

                                                        <div className="row">

                                                            <div className="col-lg-2 col-sm-6 col-12">
                                                                <div className="mb-0">
                                                                    <label className="form-label required">थकबाकीपासून दिवस</label>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        id="duE_DAY"
                                                                        name="duE_DAY"
                                                                        value={TableRowData.duE_DAY}
                                                                        onChange={handleDetailInputChange}
                                                                        ref={startdateRef}
                                                                        onKeyDown={(e) => handleKeyDown(e, enddateRef)}
                                                                    />
                                                                </div>
                                                            </div>


                                                            <div className="col-lg-2 col-sm-6 col-12">
                                                                <div className="mb-0">
                                                                    <label className="form-label required">पर्यंत दिवस</label>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        id="tO_DAY"
                                                                        name="tO_DAY"
                                                                        value={TableRowData.tO_DAY}
                                                                        onChange={handleDetailInputChange}
                                                                        ref={enddateRef}
                                                                        onKeyDown={(e) => handleKeyDown(e, duedateRef)}
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="col-lg-2 col-sm-6 col-12">
                                                                <div className="mb-0">
                                                                    <label className="form-label required">वापसी(%)</label>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        id="duedate"
                                                                        name="VVapasi"
                                                                        value={TableRowData.VVapasi}
                                                                        onChange={handleDetailInputChange}
                                                                        ref={duedateRef}
                                                                        onKeyDown={(e) => handleKeyDown(e, kalavadhiRef)}
                                                                    />
                                                                </div>
                                                            </div>



                                                            <div className="col-lg-2 col-sm-6 col-12">
                                                                <div className="mt-3">
                                                                    <button
                                                                        ref={addRef}
                                                                        type="button"
                                                                        className="btn btn-primary w-100 mt-2"
                                                                        onClick={addRecord}
                                                                        onKeyDown={(e) => handleKeyDown(e, statusRef)}

                                                                    >
                                                                        जोडा
                                                                    </button>
                                                                </div>

                                                            </div>

                                                        </div>

                                                    </div>
                                                </div>


                                            </div>
                                        )}



                                        <div className="col-lg-12 d-flex justify-content-end mt-2">

                                            <Link className="btn btn-secondary me-2"
                                                onClick={showExitAlert}
                                            >
                                                मागे
                                            </Link>

                                            <button
                                                ref={saveRef}
                                                type="submit"
                                                className="btn btn-submit"
                                            // onClick={handleSubmit}  

                                            >
                                                सेव्ह
                                            </button>
                                        </div>

                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >

        </div >

    );
};

export default AddVVapasiSlabDetail;


