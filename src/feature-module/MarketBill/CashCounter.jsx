
import React, { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ImageWithBasePath from "../../core/img/imagewithbasebath";
import Brand from "../../core/modals/inventory/brand";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { all_routes } from "../../Router/all_routes";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import Table from "../../core/pagination/datatable";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import marathiFontBase64 from "../../style/fonts/NotoSansDevanagari";
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
// import AddBill from "./AddBill";
import AddCashCounter from "./AddCashCounter";

const CashCounter = () => {
    const navigate = useNavigate();
    const [refreshFlag, setRefreshFlag] = useState(false);
    const dispatch = useDispatch();
    const data = useSelector((state) => state.toggle_header);
    const { isAuthenticated, userdetail } = getUserData();
    if (isAuthenticated == true) {
        console.log("user", userdetail);
        console.log("getUserData", getUserData);
    }
    const route = all_routes;
    const [Bill, setBill] = useState([]);

    // const handleProceedClick = () => {
    //   navigate("/AddBill");
    // };

    const [searchQuery, setSearchQuery] = useState("");


    const generatePDF = (Bill) => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();

        const cleanBase64 = marathiFontBase64.replace(/^data:font\/ttf;base64,/, "");

        doc.addFileToVFS("NotoSansDevanagari.ttf", cleanBase64);
        doc.addFont("NotoSansDevanagari.ttf", "NotoSansDevanagari", "normal");

        // Title: Marathi font
        doc.setFont("NotoSansDevanagari", "normal");
        doc.setFontSize(16);
        const title = "पावती अहवाल";
        doc.text(title, (pageWidth - doc.getTextWidth(title)) / 2, 20);

        // Table headings in Marathi
        const tableColumn = [["टोकन नं.", "शेतकरी नाव", "तारीख", "वाहन नं.", "पेमेंटचे अपडेट"]];

        // Table body data in English
        const tableRows = Bill.map((item) => {
            const formattedDate = item.date
                ? new Date(item.date).toLocaleDateString("en-GB")
                : "N/A";

            const formattedVehNo = (item.vehno && item.vehno.trim())
                ? item.vehno.trim().replace(/([A-Za-z]{2})(\d{2})([A-Za-z]{1,2})(\d{4})/, "$1 $2 $3 $4")
                : "N/A";

            return [
                item.btokanno || "",
                item.fname || "",
                formattedDate,
                formattedVehNo,
                item.status === false ? "Complete" : "Pending"

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

    const exportToExcel = async () => {
        try {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("पावती अहवाल");

            const headingRow = worksheet.addRow(["पावती अहवाल"]);
            headingRow.getCell(1).font = { bold: true, size: 16 };
            headingRow.getCell(1).alignment = { horizontal: "center", vertical: "middle" };

            worksheet.mergeCells("A1:E1");

            const headers = ["टोकन क्रमांक", "शेतकऱ्याचे नाव", "दिनांक", "वाहन क्रमांक", "पेमेंटचे अपडेट"];
            const headerRow = worksheet.addRow(headers);

            headerRow.eachCell((cell) => {
                cell.font = { bold: true, color: { argb: "FFFFFF" } };
                cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "808080" } };
                cell.alignment = { horizontal: "center", vertical: "middle" };
            });

            const columnWidths = [15, 20, 25, 25, 25]; // Adjust widths as needed
            columnWidths.forEach((width, index) => {
                worksheet.getColumn(index + 1).width = width;
            });

            Bill.forEach(({ btokanno, fname, date, vehno, status }) => {
                const paymentStatus = status ? "Pending" : "Complete";
                const row = worksheet.addRow([btokanno, fname, date, vehno, paymentStatus]);
                row.eachCell((cell) => {
                    cell.alignment = { horizontal: "center", vertical: "middle" };
                });
            });

            const buffer = await workbook.xlsx.writeBuffer();
            const data = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
            saveAs(data, "Bill Report.xlsx");


        } catch (error) {
            console.error("Error generating the Excel file:", error);
        }
    };

    const handlePrintCheck = () => {
        const content = `
          <html>
            <head><title>Print Check</title></head>
            <body onload="window.print(); window.close();">
              <div style="padding: 20px; font-family: Arial;">
                <h2>Cheque</h2>
                <p><strong>Payee:</strong> John Doe</p>
                <p><strong>Amount:</strong> ₹10,000.00</p>
                <p><strong>Date:</strong> 14-May-2025</p>
                <p><strong>Cheque No:</strong> 123456</p>
              </div>
            </body>
          </html>
        `;

        const printWindow = window.open('', '', 'height=600,width=800');
        printWindow.document.write(content);
        printWindow.document.close();
    };



    // const handleSearch = (event) => {
    //     setSearchQuery(event.target.value);
    //     try {
    //         const today = new Date().toISOString().split('T')[0];
    //         const payload = {
    //             "baid": "%",
    //             "date": userdetail.APPDT,
    //             "keyword": event.target.value,
    //             companyid: userdetail?.companyID ? userdetail.companyID : "",
    //             deptid: userdetail?.departmentID ? userdetail.departmentID : ""
    //         }
    //         const headers = {
    //             "Content-Type": "application/json",
    //             Accept: "*/*",
    //         };

    //         axios({
    //             method: "POST",
    //             url: baseUrl.Url + "/backend/api/GET_RECEIPTMasterDataMatch/_Search",
    //             data: JSON.stringify(payload),
    //             headers: headers,
    //         })

    //             .then((response) => {
    //                 if (response.status != 200) throw new Error("Failed to send otp");
    //                 console.log("response cashstatus", response.data);
    //                 setBill(response.data);
    //             })
    //     } catch (error) {
    //         console.error("Error while searching Gate Entry data:", error);
    //     }
    // };

    const handleSearch = (event) => {
        const value = event.target.value;
        setSearchQuery(value);

        const payload = {
            baid: "%",
            date: userdetail.APPDT,
            keyword: value || "%",
            companyid: userdetail?.companyID || "",
            deptid: userdetail?.departmentID || ""
        };

        axios.post(baseUrl.Url + "/backend/api/GET_RECEIPTMasterDataMatch/_Search", payload, {
            headers: {
                "Content-Type": "application/json",
                Accept: "*/*",
            },
        }).then((response) => {
            if (response.status !== 200) throw new Error("Failed to fetch data");
            setBill(response.data);
        }).catch((error) => {
            console.error("Error while searching Gate Entry data:", error);
            setBill([]);
        });
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

    const fetchCashCounter = async () => {
        try {
            const payload = {
                baid: "%",
                keyword: "%",
                date: userdetail.APPDT,
                companyid: userdetail?.companyID || "",
                deptid: userdetail?.departmentID || ""
            };

            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            const response = await axios.post(
                baseUrl.Url + "/backend/api/GET_RECEIPTMasterDataMatch",
                JSON.stringify(payload),
                { headers }
            );

            if (response.status !== 200) {
                throw new Error("Failed to fetch data");
            }

            const DATA = response.data;
            setBill(DATA);
        } catch (error) {
            console.error("Error fetching Access Right Data:", error);
        }
    };


    const [selectedData, setSelectedData] = useState({ baid: null, isclose: null });

    const openModal = (baid, isclose) => {
        setSelectedData({ baid, isclose })
        setTimeout(() => {
            setSelectedData(baid);
            // setShowModal(true);
        }, 10);

    }


    //Refresh

    useEffect(() => {
        fetchCashCounter();
    }, []);

    useEffect(() => {
        fetchCashCounter();
        setSelectedData({ baid: null, });
    }, [refreshFlag]);


    const refreshData = () => {
        setRefreshFlag(prev => !prev);
    };
    const columns = [
        {
            title: (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id="types-tooltip">बिल क्रमांक</Tooltip>}
                >
                    <div>बिल क्रमांक</div>
                </OverlayTrigger>
            ),
            dataIndex: "billno",
            sorter: (a, b) => a.billno.localeCompare(b.billno),
            width: 50, // Adjusted width
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
                    overlay={<Tooltip id="types-tooltip">शेतकऱ्याचे नाव</Tooltip>}
                >
                    <div>शेतकऱ्याचे नाव</div>
                </OverlayTrigger>
            ),
            dataIndex: "fname",
            width: 100,
            // sorter: (a, b) => a.fullname.localeCompare(b.fullname),
            render: (text) => (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id={`tooltip-${text}`}>{text}</Tooltip>}
                >
                    <div style={{ textAlign: "left" }}>{text}</div>
                </OverlayTrigger>
            ),
        },
        {
            title: (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id="types-tooltip">दिनांक</Tooltip>}
                >
                    <div className="text-center">दिनांक</div>
                </OverlayTrigger>
            ),
            dataIndex: "date",
            width: 130, // Adjusted width
            sorter: (a, b) => a.date.localeCompare(b.date),
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
                    overlay={<Tooltip id="types-tooltip">वाहन क्रमांक</Tooltip>}
                >
                    <div>वाहन क्रमांक</div>
                </OverlayTrigger>
            ),
            dataIndex: "vehno",
            // sorter: (a, b) => a.vehno.localeCompare(b.vehno),
            width: 120, // Adjusted width
            render: (text) => (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id={`tooltip-${text}`}>{text}</Tooltip>}
                >
                    <div style={{ textAlign: "left" }}>{text}</div>
                </OverlayTrigger>
            ),
        },

        {
            title: (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id="types-tooltip">पेमेंटचे अपडेट</Tooltip>}
                >
                    <div className="text-center w-75">पेमेंटचे अपडेट</div>
                </OverlayTrigger>
            ),
            dataIndex: "cashstatus",
            width: "3%",
            render: (cashstatus) => {

                const badgeClass = cashstatus == true || cashstatus == 1
                    ? "bg-success text-white"
                    : "bg-warning text-dark";

                const label = cashstatus == true || cashstatus == 1 ? "Complete" : "Pending";

                return (
                    <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip id={`tooltip-${label}`}>{label}</Tooltip>}
                    >
                        <span
                            className={`badge ${badgeClass} d-flex justify-content-center`}
                            style={{ padding: "7px 12px", fontSize: "0.875rem" }}
                        >
                            {label}
                        </span>
                    </OverlayTrigger>
                );
            }

        },

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
            width: 80, // Adjusted width
            render: (_, record) => (
                <div className="action-table-data">
                    <div className="edit-delete-action">

                        <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip id="delete-tooltip me-2">Next to Proceed</Tooltip>}
                            container={document.body}
                        >
                            <Link className="me-2 p-2"
                                to="#"

                                onClick={async (e) => {
                                    e.preventDefault();

                                    await openModal(record.baid);
                                    const modal = document.getElementById("AddCash");

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
                            >
                                <i data-feather="arrow-right-circle" className="feather-arrow-right-circle"></i>
                            </Link>
                        </OverlayTrigger>

                    </div>
                </div>
            ),
        },
    ];


    useEffect(() => {
        const handleShortcut = (e) => {
            if (e.ctrlKey && (e.key === "a" || e.key === "A")) {
                e.preventDefault();
                const modalTrigger = document.querySelector('[data-bs-target="#AddCash"]');
                if (modalTrigger) {
                    modalTrigger.click();
                }
            }
            if (e.ctrlKey && e.key === "e" || e.ctrlKey && e.key === 'E') {
                e.preventDefault();
                navigate("/test");
            }
        };

        window.addEventListener("keydown", handleShortcut);

        return () => {
            window.removeEventListener("keydown", handleShortcut);
        };
    }, [navigate]);

    // const refreshData = () => {
    //     const fetchRECEIPTMaster = async () => {
    //         try {
    //             const payload = {
    //                 "baid": "%",
    //                 "keyword": "%",
    //                 // "date": today,
    //                 "date": userdetail.APPDT,
    //                 companyid: userdetail?.companyID ? userdetail.companyID : "",
    //                 deptid: userdetail?.departmentID ? userdetail.departmentID : ""
    //             }

    //             const headers = {
    //                 "Content-Type": "application/json",
    //                 Accept: "*/*",
    //             };

    //             axios({
    //                 method: "POST",
    //                 url: baseUrl.Url + "/backend/api/GET_RECEIPTMasterDataMatch",
    //                 data: JSON.stringify(payload),
    //                 headers: headers,
    //             })
    //                 .then((response) => {
    //                     if (response.status != 200) throw new Error("Failed to Fetching Data");
    //                     const DATA = response.data;
    //                     setBill(DATA);
    //                 })

    //         } catch (error) {
    //             console.error("Error fetching Access Right Data:", error);
    //         }
    //     };

    //     fetchRECEIPTMaster();
    //     setRefreshFlag(prev => !prev);
    // };

    // // for Refresh
    // useEffect(() => {
    //     setSelectedData({ baid: null, date: null, billno: null }); // 👈 Clear after refresh
    // }, [refreshFlag]);

    return (
        <div className="page-wrapper">
            <div className="content">
                <div className="page-header">
                    <div className="add-item d-flex">
                        <div className="page-title">
                            <h3 className="mb-2">कॅश काऊंटर</h3>
                            <h6>कॅश काऊंटर</h6>
                        </div>
                    </div>
                    <ul className="table-top-head">
                        <li>
                            <li>
                                <OverlayTrigger placement="top" overlay={renderTooltip}>
                                    <Link
                                        to="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            generatePDF(Bill);
                                        }}
                                    >
                                        <ImageWithBasePath src="assets/img/icons/pdf.svg" alt="Download PDF" />
                                    </Link>
                                </OverlayTrigger>
                            </li>

                        </li>
                        <li>
                            <OverlayTrigger placement="top" overlay={renderExcelTooltip}>
                                <Link data-bs-toggle="tooltip"
                                    data-bs-placement="top"
                                    onClick={() => exportToExcel(Bill)}
                                >
                                    <ImageWithBasePath
                                        src="assets/img/icons/excel.svg"
                                        alt="img"
                                    />
                                </Link>
                            </OverlayTrigger>
                        </li>
                        <li>
                            <OverlayTrigger placement="top" overlay={renderPrinterTooltip}>
                                <Link data-bs-toggle="tooltip" data-bs-placement="top" onClick={handlePrintCheck}>
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
                    <div className="page-btn">
                        <Link
                            to="#"
                            className="btn btn-added"
                            data-bs-toggle="modal"
                            data-bs-target="#AddCash"
                        >
                            <PlusCircle className="me-2" />
                            नवीन
                        </Link>
                    </div>

                    <div className="page-btn">
                        <Link to={route.MarketBillIndex} className="btn btn-secondary">
                            <ArrowLeft className="me-2" />
                            मागे
                        </Link>

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
                                {/* {searchQuery && (
                                    <span className="input-group-text" style={{ cursor: 'pointer', height: '35px', padding: '5px' }}
                                        onClick={() => {
                                            setSearchQuery('');
                                            setBill([]); // Clear the displayed data when input is cleared
                                        }}
                                    >
                                        <i className="fa fa-times"></i>
                                    </span>
                                )} */}
                                {searchQuery && Bill.length > 0 ? (
                                    <AddCashCounter data={Bill} baid={selectedData.baid} />
                                ) : null}

                                <span className="input-group-text" style={{ height: '35px', padding: '5px' }}>
                                    <i className="fa fa-search"></i>
                                </span>

                            </div>
                        </div>
                    </div>
                </div>
                <div className="card table-list-card">
                    <div className="card-body">
                        <div className="table-responsive">
                            <Table columns={columns} dataSource={Bill} />
                        </div>
                    </div>
                </div>
                <Brand />
            </div>
            <AddCashCounter baid={selectedData.baid} onRefresh={refreshData} isclose={selectedData.isclose} />
        </div>
    );
};
export default CashCounter;



