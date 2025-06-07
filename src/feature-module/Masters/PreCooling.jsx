import React, { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ImageWithBasePath from "../../core/img/imagewithbasebath";
import Brand from "../../core/modals/inventory/brand";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { baseUrl, ACSPLGUID } from "../../core/json/custom";
import { all_routes } from "../../Router/all_routes";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import Table from "../../core/pagination/datatable";
import { setToogleHeader } from "../../core/redux/action";
import Select from "react-select";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useNavigate, useLocation } from "react-router-dom";
import marathiFontBase64 from "../../style/fonts/NotoSansDevanagari";
import axios from 'axios';


import {
    ArrowLeft,
    ChevronUp,
    Edit,
    Eye,
    RefreshCcw,
    PlusCircle,
    RotateCcw,


    Trash2,
} from "feather-icons-react/build/IconComponents";


import { getUserData } from '../../Context/UserData'
const PreCooling = () => {
    const { userdetail } = getUserData();
    const GUID = ACSPLGUID.getNew();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const data = useSelector((state) => state.toggle_header);
    const route = all_routes;
    const [formData, setFormData] = useState({
        pcid: "",
        date: "",
        daysfrom: "",
        daysto: "",
        rate: "",
        status: "",

    });



    const renderDeleteTooltip = (props) => (
        <Tooltip id="Edit-tooltip" {...props}>
            Delete
        </Tooltip>
    );


    const renderEditTooltip = (props) => (
        <Tooltip id="Edit-tooltip" {...props}>
            Edit
        </Tooltip>
    );


    const downloadPDF = () => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();

        const cleanBase64 = marathiFontBase64.replace(/^data:font\/ttf;base64,/, "");

        doc.addFileToVFS("NotoSansDevanagari.ttf", cleanBase64);
        doc.addFont("NotoSansDevanagari.ttf", "NotoSansDevanagari", "normal");

        // Title: Marathi font
        doc.setFont("NotoSansDevanagari", "normal");
        doc.setFontSize(16);
        const title = "पूर्व थंडीकरण";
        doc.text(title, (pageWidth - doc.getTextWidth(title)) / 2, 20);

        // Table headings in Marathi
        const tableColumn = [["तारीख", "दिवस पासून", "दिवस पर्यंत", "दर", "स्थिती"]];

        // Table body data in English
        const tableRows = precooling.map((item) => {



            return [
                item.date,
                item.daysfrom,
                item.daysto,
                item.rate,
                item.status,

            ];
        });

        const sanitizedTableRows = tableRows.map(row =>
            row.map(cell => (cell ? cell.toString() : ""))
        );

        // Table generation
        autoTable(doc, {
            startY: 30,
            head: tableColumn,
            body: sanitizedTableRows,

            // Heading in Marathi
            headStyles: {
                font: "NotoSansDevanagari",
                fontSize: 14,
                fontStyle: "normal",
                fillColor: [0, 102, 204],
                textColor: 255,
            },

            // Body data in English
            styles: {
                font: "helvetica", // English font
                fontSize: 12,
            },

            alternateRowStyles: { fillColor: [240, 240, 240] },
        });

        window.open(doc.output("bloburl"), "_blank");
    };


    const downloadExcel = async () => {
        try {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("पूर्व थंडीकरण(Report)");

            // **Main Heading Row**
            const headingRow = worksheet.addRow(["पूर्व थंडीकरण(Report)"]);
            headingRow.getCell(1).font = { bold: true, size: 16 };
            headingRow.getCell(1).alignment = { horizontal: "center", vertical: "middle" };

            // Merge heading across all columns
            worksheet.mergeCells("A1:E1");

            // **Header Row**
            const headers = ["तारीख", "दिवस पासून", "दिवस पर्यंत", "दर", "स्थिती"];
            const headerRow = worksheet.addRow(headers);

            headerRow.eachCell((cell) => {
                cell.font = { bold: true, color: { argb: "FFFFFF" } };
                cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "808080" } };
                cell.alignment = { horizontal: "center", vertical: "middle" };
            });

            // **Setting Column Widths**
            const columnWidths = [25, 25, 25, 25, 20]; // Adjust widths as needed
            columnWidths.forEach((width, index) => {
                worksheet.getColumn(index + 1).width = width;
            });

            // **Adding Data Rows**
            precooling.forEach(({ date, daysfrom, daysto, rate, status }) => {
                const row = worksheet.addRow([date, daysfrom, daysto, rate, status]);
                row.eachCell((cell) => {
                    cell.alignment = { horizontal: "center", vertical: "middle" };
                });

            });

            // **Generate and Save Excel File**
            const buffer = await workbook.xlsx.writeBuffer();
            const data = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
            saveAs(data, "पूर्व थंडीकरण (Report).xlsx");

        } catch (error) {
            console.error("Error generating the Excel file:", error);
        }
    };


    const columns = [



        {
            title: (
                <OverlayTrigger placement="top" overlay={<Tooltip >तारीख </Tooltip>}>
                    <div className="text-center">तारीख</div>
                </OverlayTrigger>
            ),
            dataIndex: "date",

            render: (text) => <div style={{ textAlign: "center" }}>{text}</div>,
            width: "200px",
        },
        {
            title: (
                <OverlayTrigger placement="top" overlay={<Tooltip >दिवस पासून</Tooltip>}>
                    <div className="text-center">दिवस पासून</div>
                </OverlayTrigger>
            ),
            dataIndex: "daysfrom",

            render: (text) => <div style={{ textAlign: "right" }}>{text}</div>,
            width: "200px",
        },
        {
            title: (
                <OverlayTrigger placement="top" overlay={<Tooltip >दिवस पर्यंत</Tooltip>}>
                    <div className="text-center">दिवस पर्यंत</div>
                </OverlayTrigger>
            ),
            dataIndex: "daysto",

            render: (text) => <div style={{ textAlign: "right" }}>{text}</div>,
            width: "200px",
        },




        {
            title: (
                <OverlayTrigger placement="top" overlay={<Tooltip >दर </Tooltip>}>
                    <div className="text-center">दर </div>
                </OverlayTrigger>
            ),
            dataIndex: "rate",

            render: (text) => <div style={{ textAlign: "right" }}>{text}</div>,
            width: "200px",
        },


        {
            title: (
                <OverlayTrigger placement="top" overlay={<Tooltip >स्थिती </Tooltip>}>
                    <div className="text-center">स्थिती </div>
                </OverlayTrigger>
            ),
            dataIndex: "status",

            render: (text) => <div style={{ textAlign: "right" }}>{text}</div>,
            width: "200px",
        },




        {
            title: (
                <div className="text-center">कृती</div>
            ),

            dataIndex: "actions",
            key: "actions",
            width: "100px",
            render: (_, record) => (
                <div className="action-table-data">
                    <div className="edit-delete-action">

                        <OverlayTrigger
                            placement="top"
                            overlay={renderEditTooltip}
                        >
                            <Link
                                className="me-2 p-2"
                                to="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleEdit(record); // Pass the full record instead of just pcid
                                }}
                            >
                                <i data-feather="edit" className="feather-edit"></i>
                            </Link>
                        </OverlayTrigger>
                        <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip id="delete-tooltip me-2">Delete</Tooltip>}
                        >
                            <Link
                                className="confirm-text p-2 me-2"
                                to="#"
                                onClick={() => showConfirAlert(record.pcid)}
                            >
                                <Trash2 className="feather-trash-2" />
                            </Link>
                        </OverlayTrigger>

                    </div>
                </div>
            ),
        },
    ];



    // Empty data source
    const dataSource = [];
    const renderTooltip = (props) => (
        <Tooltip id="pdf-tooltip" {...props}>
            Pdf
        </Tooltip>
    );
    const renderExcelTooltip = (props) => (
        <Tooltip id="excel-tooltip" {...props}>
            Excel
        </Tooltip>
    );
    const renderPrinterTooltip = (props) => (
        <Tooltip id="printer-tooltip" {...props}>
            Printer
        </Tooltip>
    );
    const renderRefreshTooltip = (props) => (
        <Tooltip id="refresh-tooltip" {...props}>
            Refresh
        </Tooltip>
    );
    const renderCollapseTooltip = (props) => (
        <Tooltip id="refresh-tooltip" {...props}>
            Collapse
        </Tooltip>
    );

    const handleSubmit = (e, event) => {
        e.preventDefault();
        console.log('Form Data:', formData);
        showConfirmationAlert(event);
    };


    const MySwal = withReactContent(Swal);

    const dateRef = useRef(null);
    const daysfromRef = useRef(null);
    const daystoRef = useRef(null);
    const rateRef = useRef(null);
    const statusRef = useRef(null);
    const saveButtonRef = useRef(null);





    const handleKeyDown = (e, nextRef, isLastField = false) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (isLastField) {
                saveButtonRef.current?.click(); // **Trigger Save Button Click**
            } else {
                nextRef?.current?.focus();
            }
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
            allowOutsideClick: false,
            allowEscapeKey: false,
        }).then((result) => {
            if (result.isConfirmed) {
                handleFormSubmission();

            }
        });
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleFormSubmission = async () => {
        try {
            const payload = {
                pcid: pcid ? pcid : GUID,
                date: formData.date,
                daysfrom: formData.daysfrom,
                daysto: formData.daysto,
                rate: formData.rate,
                status: formData.status,
                companyid: userdetail?.companyID ? userdetail.companyID : "",
                deptid: userdetail?.departmentID ? userdetail.departmentID : "",
                uaid: userdetail?.uaid ? userdetail.uaid : "",
            };

            console.log("payload", payload);
            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            await axios({
                method: "POST",
                url: baseUrl.Url + "/backend/api/SP_AddUpdPreCooling",
                data: JSON.stringify(payload),
                headers: headers,
            });

            Swal.fire({
                icon: "success",
                title: "जतन झाले!",
                text: "डेटा यशस्वीपणे जतन झाला.",
                confirmButtonText: "ठीक आहे",
                allowOutsideClick: false,
                allowEscapeKey: false,

            }).then((result) => {
                if (result.isConfirmed) {
                    navigate(route.PreCooling);
                }
            });

            // Reset the form data after submission
            setFormData({
                pcid: "",
                date: "",
                daysfrom: "",
                daysto: "",
                rate: "",
                status: "",
            });

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
    };





    const [productList, setProductList] = useState([]);
    const [pcid, setpcid] = useState(null);

    const handleEdit = (record) => {
        MySwal.fire({
            text: "तुम्हाला या माहितीत बदल  करायचा आहे का?",
            showCancelButton: true,
            confirmButtonColor: "#00ff00",
            confirmButtonText: "होय, बदल करा!",
            cancelButtonColor: "#ff0000",
            cancelButtonText: "रद्द करा",
            allowOutsideClick: false,
            allowEscapeKey: false,
        }).then((result) => {
            if (result.isConfirmed) {
                if (!record) {
                    console.error("Record is undefined!");
                    MySwal.fire({
                        icon: "error",
                        title: "त्रुटी!",
                        text: "निवडलेला रेकॉर्ड सापडला नाही!",
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                    });
                    return;
                }

                const formattedDate = record.date
                    ? new Date(record.date).toISOString().split("T")[0]
                    : "";

                // 💡 Find the matching status option
                const matchedStatusOption = status.find(option => option.value === record.status);

                console.log("Record status:", record.status);
                console.log("Matched status option:", matchedStatusOption);

                setFormData({
                    ...record,
                    date: formattedDate,
                    daysfrom: record.daysfrom || "",
                    daysto: record.daysto || "",
                    rate: record.rate || "",
                    status: matchedStatusOption ? matchedStatusOption.value : "", // safe fallback
                });

                setpcid(record.pcid);
            }
        });
    };


    const [precooling, setprecooling] = useState([]);
    useEffect(() => {
        try {
            const payload = {
                pcid: "%",
                keyword: '%',
                companyid: "",
                deptid: "",
            }
            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            axios({
                method: "POST",
                url: baseUrl.Url + "/backend/api/GET_PreCooling",
                data: JSON.stringify(payload),
                headers: headers,
            })
                .then((response) => {
                    if (response.status != 200) throw new Error("Failed to Fetching Data");
                    const DATA = response.data;
                    setprecooling(DATA);
                })

        } catch (error) {
            console.error("Error fetching Access Right Data:", error);
        }
    }, []);


    const [status, setstatus] = useState([]);
    const [days, setdays] = useState([]);

    useEffect(() => {

        const fetchStatus = async () => {
            try {
                const response = await axios.get(
                    baseUrl.Url + "/backend/api/Implications/STATUS",

                );

                if (response.status !== 200) throw new Error("Failed to fetch implications data");

                const data = response.data;
                const implicationDropdown = data.map(({ iTitle, iValue }) => ({
                    label: iTitle,
                    value: iValue,
                }));

                setstatus(implicationDropdown);
            } catch (error) {
                console.error("Error fetching implications:", error);
            }
        };

        fetchStatus();

    }, []);





    const showConfirAlert = (pcid) => {
        MySwal.fire({
            // title: 'तुम्हाला खात्री आहे का?',
            text: 'तुम्हाला हि  माहिती  हटवाची आहे का ?',
            showCancelButton: true,
            confirmButtonColor: '#00ff00',
            confirmButtonText: 'होय, हे हटवा!',
            cancelButtonColor: '#ff0000',
            cancelButtonText: 'रद्द करा',
            allowOutsideClick: false,
            allowEscapeKey: false,
        }).then((result) => {
            if (result.isConfirmed) {

                OndeleteAccounts(pcid);
            } else {
                MySwal.close();
            }

        });
    };
    const OndeleteAccounts = async (pcid) => {
        try {
            const payload = {
                pcid: pcid,
                companyid: "",
                deptid: "",
            };
            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            // Perform the delete API call
            axios({
                method: "POST",
                url: baseUrl.Url + "/backend/api/SP_DeletePreCooling",
                data: JSON.stringify(payload),
                headers: headers,
            })
                .then((response) => {
                    if (response.status !== 200) throw new Error("Failed to Delete Data");

                    // Display success or failure message
                    MySwal.fire({
                        title: response.data[0].responseCode === "FAILURE" ? "हटवणे शक्य नाही" : "हटवले!",
                        text: response.data[0].responseMessage,
                        icon: response.data[0].responseCode === "FAILURE" ? "error" : "success",
                        confirmButtonText: "ठीक आहे",
                        customClass: {
                            confirmButton: response.data[0].responseCode === "FAILURE" ? "btn btn-danger" : "btn btn-success",
                        },
                        allowOutsideClick: false,
                        allowEscapeKey: false,

                    });

                    // After deletion, filter out the deleted account from the current state
                    setprecooling((prevState) => prevState.filter((Advertisement) => Advertisement.pcid !== pcid));
                })
                .catch((error) => {
                    console.error("Error deleting account:", error);
                });
        } catch (error) {
            console.error("Error deleting account:", error);
        }
    };

    useEffect(() => {
        const handleShortcut = (e) => {
            if (e.ctrlKey && e.key === "e") {
                e.preventDefault();
                showExitAlert();
            }

            if (e.ctrlKey && (e.key === "s" || e.key === "S")) {
                e.preventDefault();
                checkFormValidity(e);
            }
        };

        window.addEventListener("keydown", handleShortcut);
        return () => {
            window.removeEventListener("keydown", handleShortcut);
        };
    }, [formData, navigate]);

    const showExitAlert = () => {
        MySwal.fire({
            title: "तुम्हाला खात्री आहे का?",
            text: "तुम्हाला मागे जायचं आहे का?",
            showCancelButton: true,
            confirmButtonColor: "#00ff00",
            confirmButtonText: "हो",
            cancelButtonColor: "#092C4C",
            cancelButtonText: "नाही",
            allowOutsideClick: false,
            allowEscapeKey: false,
        }).then((result) => {
            if (result.isConfirmed) {
                navigate(route.MasterIndex)
            }
        });
    };
    const checkFormValidity = (e) => {
        const {
            date,
            daysfrom,
            daysto,
            rate,
            status,

        } = formData;

        if (!date) {
            Swal.fire({
                icon: "error",
                title: "त्रुटी",
                text: "दिनांक आवश्यक आहे",
                allowOutsideClick: false,
                allowEscapeKey: false,
            }).then(() => {
                dateRef.current.focus();
            });
            return;
        }


        if (!daysfrom) {
            Swal.fire({
                icon: "error",
                title: "त्रुटी",
                text: " दिवस आवश्यक आहे",
                allowOutsideClick: false,
                allowEscapeKey: false,
            }).then(() => {
                daysfromRef.current.focus();
            });
            return;
        }
        if (!daysto) {
            Swal.fire({
                icon: "error",
                title: "त्रुटी",
                text: " दिवस आवश्यक आहे",
                allowOutsideClick: false,
                allowEscapeKey: false,
            }).then(() => {
                daystoRef.current.focus();
            });
            return;
        }

        if (!rate) {
            Swal.fire({
                icon: "error",
                title: "त्रुटी",
                text: "दर आवश्यक आहे",
                allowOutsideClick: false,
                allowEscapeKey: false,
            }).then(() => {
                rateRef.current.focus();
            });
            return;
        }

        if (!status) {
            Swal.fire({
                icon: "error",
                title: "त्रुटी",
                text: "स्थिती आवश्यक आहे",
                allowOutsideClick: false,
                allowEscapeKey: false,
            }).then(() => {
                statusRef.current.focus();
            });
            return;
        }
        handleSubmit(e);
    };



    return (
        <div className="page-wrapper">
            <div className="content">
                <div className="page-header">
                    <div className="add-item d-flex">
                        <div className="page-title">
                            <h3>पूर्व थंडीकरण </h3>
                            <h6></h6>
                        </div>
                    </div>
                    <ul className="table-top-head">
                        <li>
                            <OverlayTrigger placement="top" overlay={renderTooltip}>
                                <Link onClick={downloadPDF}>
                                    <ImageWithBasePath src="assets/img/icons/pdf.svg" alt="img" />
                                </Link>
                            </OverlayTrigger>
                        </li>
                        <li>
                            <OverlayTrigger placement="top" overlay={renderExcelTooltip}>
                                <Link onClick={downloadExcel}>
                                    <ImageWithBasePath src="assets/img/icons/excel.svg" alt="img" />
                                </Link>
                            </OverlayTrigger>
                        </li>;
                        <li>
                            <OverlayTrigger placement="top" overlay={renderPrinterTooltip}>
                                <Link data-bs-toggle="tooltip" data-bs-placement="top">
                                    <i data-feather="printer" className="feather-printer" />
                                </Link>
                            </OverlayTrigger>
                        </li>
                        <li>
                            <OverlayTrigger placement="top" overlay={renderRefreshTooltip}>
                                <Link data-bs-toggle="tooltip" data-bs-placement="top">
                                    <RotateCcw />
                                </Link>
                            </OverlayTrigger>
                        </li>
                        <li>
                            <OverlayTrigger placement="top" overlay={renderCollapseTooltip}>
                                <Link
                                    data-bs-toggle="tooltip"
                                    data-bs-placement="top"
                                    id="collapse-header"
                                    className={data ? "active" : ""}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        dispatch(setToogleHeader(!data));
                                    }}
                                >
                                    <ChevronUp />
                                </Link>
                            </OverlayTrigger>
                        </li>
                    </ul>
                    {/* <div className="page-btn">
                            <Link to={route.AddService} className="btn btn-added">
                            <PlusCircle className="me-2 iconsize" /> Add Services
                            </Link>
                        </div> */}
                    <div className="page-btn">
                        <Link to={route.MasterIndex} className="btn btn-secondary">
                            <ArrowLeft className="me-2" />
                            मागे
                        </Link>
                    </div>
                </div>

                <form onSubmit={handleSubmit} >
                    <div className="card mx-auto" >
                        <div className="card-body mbgcolor">
                            <div className="row">
                                <div className="col-lg-2 col-sm-6 col-12">
                                    <div className="mb-3 add-product input-blocks">
                                        <label className="form-label required">तारीख</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            name="date"
                                            value={formData.date}
                                            onChange={handleChange}
                                            onKeyDown={(e) => handleKeyDown(e, daysfromRef)}
                                            required
                                            ref={dateRef}
                                        />
                                    </div>
                                </div>

                                {/* <div className="col-lg-3 col-md-4 col-sm-12">
                                    <div className="mb-3 add-product input-blocks">
                                        <div className="d-flex align-items-center mb-1">
                                            <label className="form-label required mb-0 me-2">दिवस</label>
                                            <Link
                                                to="#"
                                                data-bs-toggle="modal"
                                                data-bs-target="#AddDays"
                                                className="d-flex align-items-center"
                                                style={{ fontSize: '14px' }}
                                            >
                                                <PlusCircle className="plus-down-add me-1" size={16} />
                                                <span>नविन जोडा</span>
                                            </Link>
                                        </div>

                                        <Select
                                            name="day"
                                            classNamePrefix="react-select"
                                            options={days}
                                            placeholder="Select"
                                            title="Please select a valid type of Status."
                                            value={days.find(option => option.value === formData.day) || null}
                                            onChange={(selectedOption) =>
                                                setFormData(prevState => ({
                                                    ...prevState,
                                                    day: selectedOption ? selectedOption.value : null
                                                }))
                                            }
                                            required
                                            ref={dayRef}
                                        />
                                    </div>
                                </div> */}

                                <div className="col-lg-2 col-sm-4 col-12 mt-1">
                                    <div className="mb-3 add-product input-blocks">
                                        <label className="form-label required">दिवस पासून</label>
                                        <input

                                            name="daysfrom"
                                            className="form-control"
                                            value={formData.daysfrom}
                                            onChange={handleChange}
                                            onKeyDown={(e) => handleKeyDown(e, daystoRef)}
                                            required
                                            pattern="^\d*$"
                                            title="कृपया फक्त अंक प्रविष्ट करा"
                                            ref={daysfromRef}
                                        />
                                    </div>
                                </div>


                                <div className="col-lg-2 col-sm-4 col-12 mt-1">
                                    <div className="mb-3 add-product input-blocks">
                                        <label className="form-label required">दिवस पर्यंत</label>
                                        <input
                                            name="daysto"
                                            className="form-control"
                                            value={formData.daysto}
                                            onChange={handleChange}
                                            onKeyDown={(e) => handleKeyDown(e, rateRef)}
                                            required
                                            pattern="^\d*$"
                                            title="कृपया फक्त अंक प्रविष्ट करा"
                                            ref={daystoRef}
                                        />
                                    </div>
                                </div>

                                <div className="col-lg-2 col-sm-4 col-12 mt-1">
                                    <div className="mb-3 add-product input-blocks">
                                        <label className="form-label required">दर</label>
                                        <input
                                            name="rate"
                                            className="form-control"
                                            value={formData.rate}
                                            onChange={handleChange}
                                            onKeyDown={(e) => handleKeyDown(e, statusRef)}
                                            required
                                            pattern="^\d+(\.\d{1,2})?$"
                                            title="कृपया फक्त वैध दर भरा (उदा. 12, 12.50)"
                                            ref={rateRef}
                                        />

                                    </div>
                                </div>

                                <div className="col-lg-3 col-sm-6 col-12">
                                    <label className="form-label required">स्थिती</label>

                                    <div className="mb-3 add-product input-blocks">
                                        <Select
                                            name="status"
                                            classNamePrefix="react-select"
                                            options={status}
                                            placeholder="Select"
                                            title="Please select a valid type of Status."
                                            value={status.find(option => option.value === formData.status) || null}
                                            onChange={(selectedOption) =>
                                                setFormData(prevState => ({
                                                    ...prevState,
                                                    status: selectedOption ? selectedOption.value : null
                                                }))
                                            }
                                            required
                                            openMenuOnFocus={true}
                                            ref={statusRef}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="col-12 d-flex justify-content-end mb-3">
                                <button type="submit" className="btn btn-submit ">डेटा जतन करा</button>
                            </div>

                        </div>
                    </div>

                </form>
                <div className="card table-list-card mbgcolor">

                    <div className="card-body">

                        <div className="table-responsive">
                            <Table columns={columns} dataSource={precooling} />
                        </div>
                    </div>
                </div>


            </div>
        </div>
    );
};

export default PreCooling;

