import React, { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
// import ImageWithBasePath from "../../../core/img/imagewithbasebath";
import ImageWithBasePath from "../../core/img/imagewithbasebath";
// import Brand from "../../../core/modals/inventory/brand";
import Brand from "../../core/modals/inventory/brand";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { all_routes } from "../../Router/all_routes";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
// import Table from "../../../core/pagination/datatable";
import Table from "../../core/pagination/datatable";
// import { setToogleHeader } from "../../../core/redux/action";
// import AddService from "./AddService";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import marathiFontBase64 from "../../style/fonts/NotoSansDevanagari";

// import { baseUrl } from "../../../core/json/custom";
import { baseUrl } from "../../core/json/custom";
import {
    ArrowLeft,
    ChevronUp,
    Edit,
    PlusCircle,
    RotateCcw,
    Trash2,
} from "feather-icons-react/build/IconComponents";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";
import { getUserData } from "../../Context/UserData";
import AddGateEntry from "../GateEntry/AddGateEntry";
import { convertToCustomDate } from "../../core/json/custom";

const GateEntryAuction = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const data = useSelector((state) => state.toggle_header);
    const { isAuthenticated, userdetail } = getUserData();
    if (isAuthenticated == true) {
        console.log("user", userdetail);
        console.log("getUserData", getUserData);
    }
    const route = all_routes;
    const [GateEntry, setGateEntry] = useState([]);
    const [refreshFlag, setRefreshFlag] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const generatePDF = (GateEntry) => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();

        const cleanBase64 = marathiFontBase64.replace(/^data:font\/ttf;base64,/, "");

        doc.addFileToVFS("NotoSansDevanagari.ttf", cleanBase64);
        doc.addFont("NotoSansDevanagari.ttf", "NotoSansDevanagari", "normal");
        doc.setFont("NotoSansDevanagari", "normal");
        doc.setFontSize(16);

        console.log(doc.getFontList());

        const title = "गेट नोंदणी  अहवाल";
        doc.text(title, (pageWidth - doc.getTextWidth(title)) / 2, 20);

        const tableColumn = [["टोकन क्रमांक", "आधार नं.", "तारीख", "वाहन नं."]];

        const tableRows = GateEntry.map((item) => {
            console.log("Full Item Data:", item);
            console.log("Original Vehicle No:", `"${item.vehno}"`);

            const formattedDate = item.date
                ? new Date(item.date).toLocaleDateString("en-GB")
                : "N/A";

            // const formattedVehNo = item.vehno?.trim()
            //     ? item.vehno.trim().replace(/([A-Za-z]+)(\d+)/, "$1 $2")
            //     : "N/A";

            const formattedVehNo = (item.vehno && item.vehno.trim())
                ? item.vehno.trim().replace(/([A-Za-z]{2})(\d{2})([A-Za-z]{1,2})(\d{4})/, "$1 $2 $3 $4")
                : "N/A";

            console.log("Formatted Vehicle No:", formattedVehNo);

            return [
                item.toknno,
                item.aadharno || "N/A",
                formattedDate,
                formattedVehNo
            ];
        });


        console.log("Final Table Rows:", tableRows);
        const sanitizedTableRows = tableRows.map(row =>
            row.map(cell => (cell ? cell.toString() : ""))
        );
        autoTable(doc, {
            startY: 30,
            head: tableColumn,
            body: sanitizedTableRows,
            styles: { font: "NotoSansDevanagari", fontStyle: "normal", fontSize: 12 },
            headStyles: { fontStyle: "normal", fillColor: [0, 102, 204], textColor: 255, fontSize: 14 },
            alternateRowStyles: { fillColor: [240, 240, 240] },
        });

        window.open(doc.output("bloburl"), "_blank");
    };

    // for Refresh
    const refreshData = () => {
        setRefreshFlag(prev => !prev);
        try {
            const payload = {
                "dpkid": "%",
                "keyword": "%",
                "companyid": "",
                "deptid": "",
                "date": userdetail.APPDT
            }

            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            axios({
                method: "POST",
                url: baseUrl.Url + "/backend/api/GET_GateEntryDetail",
                data: JSON.stringify(payload),
                headers: headers,
            })
                .then((response) => {
                    if (response.status != 200) throw new Error("Failed to Fetching Data");
                    const DATA = response.data;
                    setGateEntry(DATA);
                })

        } catch (error) {
            console.error("Error fetching Access Right Data:", error);
        }
    };

    // for Refresh
    useEffect(() => {
        setSelectedData({ baid: null, date: null, billno: null }); // 👈 Clear after refresh
        try {
            const payload = {
                "dpkid": "%",
                "keyword": "%",
                "companyid": "",
                "deptid": "",
                "date": userdetail.APPDT
            }

            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            axios({
                method: "POST",
                url: baseUrl.Url + "/backend/api/GET_GateEntryDetail",
                data: JSON.stringify(payload),
                headers: headers,
            })
                .then((response) => {
                    if (response.status != 200) throw new Error("Failed to Fetching Data");
                    const DATA = response.data;
                    setGateEntry(DATA);
                })

        } catch (error) {
            console.error("Error fetching Access Right Data:", error);
        }

    }, [refreshFlag]);

    const exportToExcel = async () => {
        try {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("Gate Entry Report");

            const headingRow = worksheet.addRow(["Gate Entry Report"]);
            headingRow.getCell(1).font = { bold: true, size: 16 };
            headingRow.getCell(1).alignment = { horizontal: "center", vertical: "middle" };

            worksheet.mergeCells("A1:C1");

            const headers = ["आधार क्रमांक", "दिनांक", "वाहन क्रमांक"];
            const headerRow = worksheet.addRow(headers);

            headerRow.eachCell((cell) => {
                cell.font = { bold: true, color: { argb: "FFFFFF" } };
                cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "808080" } };
                cell.alignment = { horizontal: "center", vertical: "middle" };
            });

            const columnWidths = [15, 20, 25,]; // Adjust widths as needed
            columnWidths.forEach((width, index) => {
                worksheet.getColumn(index + 1).width = width;
            });

            GateEntry.forEach(({ aadharno, date, vehno, }) => {
                const row = worksheet.addRow([aadharno, date, vehno,]);
                row.eachCell((cell) => {
                    cell.alignment = { horizontal: "center", vertical: "middle" };
                });
            });

            const buffer = await workbook.xlsx.writeBuffer();
            const data = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
            saveAs(data, "GateEntry Report.xlsx");


        } catch (error) {
            console.error("Error generating the Excel file:", error);
        }
    };


    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
        try {
            const payload = {
                "dpkid": "%",
                "keyword": event.target.value.trim(),
                "companyid": "",
                "deptid": "",
                date: userdetail.APPDT
            }
            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            axios({
                method: "POST",
                url: baseUrl.Url + "/backend/api/GET_GateEntryDetail/_Search",
                data: JSON.stringify(payload),
                headers: headers,
            })

                .then((response) => {
                    if (response.status != 200) throw new Error("Failed to send otp");
                    console.log("response", response.data);
                    setGateEntry(response.data);
                })
        } catch (error) {
            console.error("Error while searching Gate Entry data:", error);
        }
    };

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
    useEffect(() => {
        const fetchGateEntry = async () => {
            try {
                const payload = {
                    dpkid: "%",
                    keyword: "%",
                    companyid: "",
                    deptid: "",
                    date: userdetail.APPDT
                };

                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };

                const response = await axios.post(baseUrl.Url + "/backend/api/GET_GateEntryDetail", payload, { headers });

                if (response.status !== 200) throw new Error("Failed to Fetching Data");
                const DATA = response.data;
                setGateEntry(DATA);
            } catch (error) {
                console.error("Error fetching Access Right Data:", error);
            }
        };

        fetchGateEntry();

        const intervalId = setInterval(fetchGateEntry, 60000);

        return () => clearInterval(intervalId);
    }, []);

    const [selectedData, setSelectedData] = useState({ dpkid: null, uid: null, vehno: null, iscompleted: null });

    const openModal = (dpkid, uid, vehno, iscompleted) => {
        setSelectedData({ dpkid, uid, vehno, iscompleted })
        // console.log(dpkid, uid, vehno, "dpkid, uid, vehno")

    }
    const MySwal = withReactContent(Swal);

    const showConfirmationAlert = (dpkid) => {
        MySwal.fire({
            title: "तुम्हाला खात्री आहे का?",
            text: "हे कृती पूर्ववत करता येणार नाही!",
            showCancelButton: true,
            confirmButtonColor: "#00ff00",
            confirmButtonText: "होय, हटवा!",
            cancelButtonColor: "#ff0000",
            cancelButtonText: "रद्द करा",
            allowOutsideClick: false,
            allowEscapeKey: false,
        }).then((result) => {
            if (result.isConfirmed) {
                handleDelete(dpkid)
            } else {
                MySwal.close();
            }
        });
    };
    const handleDelete = async (dpkid) => {
        try {
            const payload = {
                dpkid: dpkid,
                companyid: "",
                deptid: ""
            };

            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            const response = await axios.post(
                `${baseUrl.Url}/backend/api/SP_DeleteGateEntryDetail`,
                JSON.stringify(payload),
                { headers }
            );

            if (response.status !== 200) {
                throw new Error("Failed to fetch data");
            }

            MySwal.fire({
                title: response.data[0].responseCode === "FAILURE" ? "Deletion Not Allowed" : "Deleted!",
                text: response.data[0].responseMessage,
                icon: response.data[0].responseCode === "FAILURE" ? "error" : "success",
                confirmButtonText: "OK",
                customClass: {
                    confirmButton: response.data[0].responseCode === "FAILURE" ? "btn btn-danger" : "btn btn-success",
                },
            });

            try {
                const payload = {
                    "dpkid": "%",
                    "keyword": "%",
                    "companyid": "",
                    "deptid": "",
                    "date": userdetail.APPDT
                }

                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };

                axios({
                    method: "POST",
                    url: baseUrl.Url + "/backend/api/GET_GateEntryDetail",
                    data: JSON.stringify(payload),
                    headers: headers,
                })
                    .then((response) => {
                        if (response.status != 200) throw new Error("Failed to Fetching Data");
                        const DATA = response.data;
                        setGateEntry(DATA);
                    })

            } catch (error) {
                console.error("Error fetching Access Right Data:", error);
            }
        } catch (error) {
            console.error("Error deleting GateEntry:", error);
        }
    };

    const columns = [
        {
            title: (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id="types-tooltip">ट.क्र.</Tooltip>}
                >
                    <div>ट.क्र.</div>
                </OverlayTrigger>
            ),
            dataIndex: "toknno",
            sorter: (a, b) => a.toknno.localeCompare(b.toknno),
            // Adjusted width
            render: (text) => (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id={`tooltip-${text}`}>{text}</Tooltip>}
                >
                    <div style={{ textAlign: "center" }}>{text}</div>
                </OverlayTrigger>
            ),
        },
        // {
        //     title: (
        //         <OverlayTrigger
        //             placement="top"
        //             overlay={<Tooltip id="types-tooltip">आधार क्र.</Tooltip>}
        //         >
        //             <div>आधार क्र.</div>
        //         </OverlayTrigger>
        //     ),
        //     dataIndex: "aadharno",
        //     width: 100,
        //     sorter: (a, b) => a.aadharno.localeCompare(b.aadharno),
        //     render: (text) => (
        //         <OverlayTrigger
        //             placement="top"
        //             overlay={<Tooltip id={`tooltip-${text}`}>{text}</Tooltip>}
        //         >
        //             <div style={{ textAlign: "left" }}>{text}</div>
        //         </OverlayTrigger>
        //     ),
        // },
        {
            title: (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id="types-tooltip">दि.</Tooltip>}
                >
                    <div className="text-center">दि.</div>
                </OverlayTrigger>
            ),
            dataIndex: "date",
            // Adjusted width
            render: (text) => (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id={`tooltip-${text}`}>{text}</Tooltip>}
                >
                    <div style={{ textAlign: "center" }}>{text}</div>
                </OverlayTrigger>
            ),
        },
        {
            title: (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id="types-tooltip">वा.क्र.</Tooltip>}
                >
                    <div>वा.क्र.</div>
                </OverlayTrigger>
            ),
            dataIndex: "vehno",
            sorter: (a, b) => a.vehno.localeCompare(b.vehno),
            // Adjusted width
            render: (text) => (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id={`tooltip-${text}`}>{text}</Tooltip>}
                >
                    <div style={{ textAlign: "center" }}>{text}</div>
                </OverlayTrigger>
            ),
        },
        {
            title: (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id="types-tooltip">स्थिती</Tooltip>}
                >
                    <div className="text-center w-100">स्थिती</div>
                </OverlayTrigger>
            ),
            dataIndex: "isverified",
            sorter: (a, b) => a.isverified.localeCompare(b.isverified),

            render: (text) => {
                const isverified = text === true || text === "true";
                return (
                    <OverlayTrigger
                        placement="top"
                        overlay={
                            <Tooltip id={`tooltip-${text}`}>
                                {isverified ? "Complete" : "Pending"}
                            </Tooltip>
                        }
                    >
                        <div style={{ textAlign: "center" }}>
                            <button
                                className={`btn btn-sm ${isverified ? "btn-success" : "btn-warning"} text-dark`}
                                style={{ color: "#000" }} // ensures text is black
                                disabled
                            >
                                {isverified ? "Completed" : "Pending"}
                            </button>
                        </div>
                    </OverlayTrigger>
                );

            },
        },


        // {
        //     title: (
        //         <OverlayTrigger
        //             placement="top"
        //             overlay={<Tooltip id="types-tooltip">गावाचे नाव</Tooltip>}
        //         >
        //             <div>गावाचे नाव</div>
        //         </OverlayTrigger>
        //     ),
        //     dataIndex: "village",
        //     width: 140,
        //     render: (text) => (
        //         <OverlayTrigger
        //             placement="top"
        //             overlay={<Tooltip id={`tooltip-${text}`}>{text}</Tooltip>}
        //         >
        //             <div style={{ textAlign: "left" }}>{text}</div>
        //         </OverlayTrigger>
        //     ),
        // },
        // {
        //   title: (
        //     <OverlayTrigger
        //       placement="top"
        //       overlay={<Tooltip id="types-tooltip">Taxable Amount</Tooltip>}
        //     >
        //       <div className="text-center">Taxable Amount</div>
        //     </OverlayTrigger>
        //   ),
        //   dataIndex: "scgamt",
        //   width: 110,
        //   render: (text) => (
        //     <OverlayTrigger
        //       placement="top"
        //       overlay={<Tooltip id={`tooltip-${text}`}>{text}</Tooltip>}
        //     >
        //       <div style={{ textAlign: "right" }}>{text}</div>
        //     </OverlayTrigger>
        //   ),
        // },
        // {
        //     title: (
        //         <OverlayTrigger
        //             placement="top"
        //             overlay={<Tooltip id="types-tooltip">स्थिती</Tooltip>}
        //         >
        //             <div className="text-center">स्थिती</div>
        //         </OverlayTrigger>
        //     ),
        //     dataIndex: "iscompleted",
        //     width: 110, // Adjusted width
        //     render: (text) => (
        //         <OverlayTrigger
        //             placement="top"
        //             overlay={<Tooltip id={`tooltip-${text}`}>{text}</Tooltip>}
        //         >
        //             <div style={{ textAlign: "right" }}>{text}</div>
        //         </OverlayTrigger>
        //     ),
        // },
        {
            title: (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id="types-tooltip">कृती </Tooltip>}
                >
                    <div className="text-center">कृती </div>
                </OverlayTrigger>
            ),
            dataIndex: "action",
            // Adjusted width
            render: (_, record) => (
                <div className="action-table-data">
                    <div className="edit-delete-action">
                        <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip id="edit-tooltip">Edit</Tooltip>}
                        >
                            <Link className="me-2 p-2"
                                to="#"
                                data-bs-toggle="modal"
                                // data-bs-target="#AddGateEntry"
                                onClick={async (e) => {

                                    openModal(record.dpkid, record.uid, record.vehno, record.iscompleted)

                                    const modal = document.getElementById("AddGateEntry");

                                    if (modal) {
                                        modal.classList.add("show");
                                        modal.style.display = "block";
                                        modal.setAttribute("aria-modal", "true");
                                        modal.setAttribute("role", "dialog");
                                        modal.removeAttribute("aria-hidden");

                                        const backdrop = document.createElement("div");
                                        backdrop.className = "modal-backdrop fade show";
                                        document.body.appendChild(backdrop);

                                        document.body.classList.add("modal-open");
                                        document.body.style.overflow = "hidden";
                                        document.body.style.paddingRight = "0px";
                                    }

                                }}
                            // onClick={() => openModal(record.dpkid, record.uid, record.vehno, record.iscompleted)}
                            >
                                <Edit className="feather-edit" />
                            </Link>
                            {/* <Link
                                className="me-2 p-2"
                                to="#"
                                onClick={async (e) => {
                                    e.preventDefault(); // Always prevent default

                                    if (record.isvyapariverified) {
                                        // First run your logic
                                        await OnProceed(record.baid, record.date, record.billno);

                                        // Then manually open the modal
                                        const modal = document.getElementById("AddSalesEnquiry");

                                        if (modal) {
                                            modal.classList.add("show");
                                            modal.style.display = "block";
                                            modal.setAttribute("aria-modal", "true");
                                            modal.setAttribute("role", "dialog");
                                            modal.removeAttribute("aria-hidden");

                                            const backdrop = document.createElement("div");
                                            backdrop.className = "modal-backdrop fade show";
                                            document.body.appendChild(backdrop);

                                            document.body.classList.add("modal-open");
                                            document.body.style.overflow = "hidden";
                                            document.body.style.paddingRight = "0px";
                                        }
                                    } else {
                                        Swal.fire({
                                            icon: "error",
                                            title: "Approval Required",
                                            text: "Please get approval from Vyapari.",
                                        });
                                    }
                                }}
                                style={{ color: "green" }}
                            >
                                <i data-feather="arrow-right-circle" className="feather-arrow-right-circle"></i>
                            </Link> */}

                        </OverlayTrigger>
                        <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip id="delete-tooltip me-2">Delete</Tooltip>}
                        >
                            {/* <Link className="confirm-text p-2" to="#">
                                <i
                                    data-feather="trash-2"
                                    className="feather-trash-2"
                                    onClick={() => showConfirmationAlert(record.dpkid)}
                                ></i>
                            </Link> */}
                            <Link
                                className="confirm-text p-2 me-2"
                                to="#"
                                onClick={() => showConfirmationAlert(record.dpkid)}
                            >
                                <Trash2 className="feather-trash-2" />
                            </Link>
                        </OverlayTrigger>
                        {/* <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip id="delete-tooltip me-2">Next to Proceed</Tooltip>}
                        >
                            <Link className="me-2 p-2" to="#" data-bs-toggle="modal" data-bs-target="#AddGateEntry" style={{ color: 'green' }}>
                                <i data-feather="arrow-right-circle" className="feather-arrow-right-circle"></i>
                            </Link>
                        </OverlayTrigger> */}
                    </div>
                </div>
            ),
        },
    ];

    // const MySwal = withReactContent(Swal);

    // const showConfirmationAlert = (dpkid) => {
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
    //             handleDelete(dpkid);


    //         } else {
    //             MySwal.close();
    //         }
    //     });
    // };


    useEffect(() => {
        const handleShortcut = (e) => {
            if (e.ctrlKey && (e.key === "a" || e.key === "A")) {
                e.preventDefault();
                const modalTrigger = document.querySelector('[data-bs-target="#AddGateEntry"]');
                if (modalTrigger) {
                    modalTrigger.click();
                }
            }
            if (e.ctrlKey && (e.key === 'e' || e.key === 'E')) {
                e.preventDefault();
                navigate(route.GateEntryIndex);
            }
        };

        window.addEventListener("keydown", handleShortcut);

        return () => {
            window.removeEventListener("keydown", handleShortcut);
        };
    }, [navigate]);
    return (
        <div className="page-wrapper">
            <div className="content">
                <div className="page-header">
                    <div className="add-item d-flex">
                        <div className="page-title">
                            <h3 className="mb-2">जनरेट टोकन</h3>
                            <h6>गेट प्रवेश व्यवस्थापन</h6>
                        </div>
                    </div>
                    <ul className="table-top-head  justify-content-end">
                        <li>
                            {/* <OverlayTrigger placement="top" overlay={renderTooltip}>
                                <Link>
                                    <ImageWithBasePath src="assets/img/icons/pdf.svg" alt="img" />
                                </Link>
                            </OverlayTrigger> */}
                            <li>
                                <OverlayTrigger placement="top" overlay={renderTooltip}>
                                    <Link
                                        to="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            generatePDF(GateEntry);
                                        }}
                                    >
                                        <ImageWithBasePath src="assets/img/icons/pdf.svg" alt="Download PDF" />
                                    </Link>
                                </OverlayTrigger>
                            </li>

                        </li>
                        <li>
                            <OverlayTrigger placement="top" overlay={renderExcelTooltip}>
                                <Link data-bs-toggle="tooltip" data-bs-placement="top" onClick={exportToExcel}>
                                    <ImageWithBasePath
                                        src="assets/img/icons/excel.svg"
                                        alt="img"
                                    />
                                </Link>
                            </OverlayTrigger>
                        </li>
                        <li>
                            <OverlayTrigger placement="top" overlay={renderPrinterTooltip}>
                                <Link data-bs-toggle="tooltip" data-bs-placement="top">
                                    <i data-feather="printer" className="feather-printer" />
                                </Link>
                            </OverlayTrigger>
                        </li>
                        <li>
                            <OverlayTrigger placement="top" overlay={renderRefreshTooltip}>
                                <Link data-bs-toggle="tooltip" data-bs-placement="top" onClick={refreshData}>
                                    <RotateCcw />
                                </Link>
                            </OverlayTrigger>
                        </li>
                        {/* <li>
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
                        </li> */}
                    </ul>
                    {/* <div className="page-btn">
                        <Link
                            to="#"
                            className="btn btn-added w-100"
                            data-bs-toggle="modal"
                            data-bs-target="#AddGateEntry"
                        >
                            <PlusCircle className="me-2" />
                            नवीन
                        </Link>
                    </div>
                    <div className="page-btn">
                        <Link to={route.GateEntryIndex} className="btn btn-secondary  w-100">
                            <ArrowLeft className="me-2" />
                            मागे
                        </Link>

                    </div> */}

                    <div className="col-12 col-md-6">
                        <div className="row g-2 justify-content-md-end mt-2 mt-md-auto">
                            <div className="col-12 col-md-5">
                                <button
                                    type="button"
                                    className="btn btn-primary w-100"
                                    onClick={() => {
                                        const modalEl = document.getElementById("AddGateEntry");
                                        const modal = new bootstrap.Modal(modalEl);
                                        modal.show();
                                    }}
                                >
                                    नवीन
                                </button>
                            </div>
                            <div className="col-12 col-md-5">
                                <button
                                    type="button"
                                    className="btn btn-secondary w-100"
                                    onClick={() => navigate(route.AuctionIndex)}
                                >
                                    मागे
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
                <div className="search-container mb-3">
                    <div className="row">
                        <div className="col-lg-6 col-12 ms-auto">
                            <div className="input-group">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search"
                                    value={searchQuery}
                                    onChange={handleSearch}
                                    style={{ height: '35px', padding: '5px' }}
                                />
                                {searchQuery && (
                                    <span className="input-group-text" style={{ cursor: 'pointer', height: '35px', padding: '5px' }}
                                        onClick={() => setSearchQuery('')}>
                                        <i className="fa fa-times"></i>
                                    </span>
                                )}
                                <span className="input-group-text" style={{ height: '35px', padding: '5px' }}>
                                    <i className="fa fa-search"></i>
                                </span>

                            </div>
                        </div>
                    </div>
                </div>
                {/* <div className="card table-list-card">
                    <div className="card-body">
                        <div className="table-responsive">
                            <Table columns={columns} dataSource={GateEntry} />
                        </div>
                    </div>
                </div> */}
                <div className="card table-list-card">
                    <div className="card-body p-2">
                        <div className="table-responsive responsive-no-scroll">
                            <Table
                                columns={columns}
                                dataSource={GateEntry}
                                pagination={false}
                                scroll={false} // ensure ant-table doesn't enforce horizontal scroll
                            />
                        </div>
                    </div>
                </div>


                <Brand />
            </div>

            <AddGateEntry dpkid={selectedData.dpkid} uniqueid={selectedData.uid} VEHICLENO={selectedData.vehno} iscompleted={selectedData.iscompleted} onRefresh={refreshData} />



        </div>
    );
};
export default GateEntryAuction;

