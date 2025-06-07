
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { Link } from "react-router-dom";
import ImageWithBasePath from "../../core/img/imagewithbasebath";
import Brand from "../../core/modals/inventory/brand";
// import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { all_routes } from "../../Router/all_routes";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import Table from "../../core/pagination/datatable";
import { setToogleHeader } from "../../core/redux/action";
import { useEffect } from "react";

import axios from "axios";
import { baseUrl } from "../../core/json/custom";
import {
    ArrowLeft, ChevronUp, PlusCircle, RotateCcw, CheckCircle, Edit,
} from "feather-icons-react/build/IconComponents";

// import BillPopup from "../../feature-module/FinanceAccounts/BillPopup";
// import BillPopup from "../../feature-module/FinanceAccounts/BillPopup";

import { useNavigate } from "react-router-dom";
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import marathiFontBase64 from "../../style/fonts/NotoSansDevanagari";
import AddFarmerBill from "./AddFarmerBill";
// import QuickFarmerBill from "./QuickFarmerBill";
import { getUserData } from "../../Context/UserData";
import { convertToCustomDate } from "../../core/json/custom";
const FarmerBillMaster = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const data = useSelector((state) => state.toggle_header);
    const route = all_routes;
    const { userdetail } = getUserData();
    const [receiptmaster, setReceiptMaster] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [refreshFlag, setRefreshFlag] = useState(false);
    // fetch RECEIPTMaster Data 
    useEffect(() => {

        const fetchRECEIPTMaster = async () => {
            try {
                const payload = {
                    "baid": "%",
                    "date": userdetail.APPDT,
                    "keyword": "%",
                    "companyid": userdetail?.companyID ? userdetail.companyID : "",
                    "deptid": userdetail?.departmentID ? userdetail.departmentID : "",
                };
                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };
                const response = await axios.post(
                    `${baseUrl.Url}/backend/api/GET_RECEIPTMaster`,
                    payload,
                    { headers }
                );
                if (response.status !== 200)
                    throw new Error("Failed to fetch ");
                console.log("receipt master", response.data)
                setReceiptMaster(response.data);
            } catch (error) {
                console.error("Error fetching Receipt Master data:", error);
            }
        };

        fetchRECEIPTMaster();

    }, []);

    // fetch by Search  RECEIPTMasetr Data
    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
        try {
            const payload = {
                "baid": "%",
                "date": convertToCustomDate(userdetail.APPDT, 0),
                "keyword": event.target.value,
                "companyid": userdetail?.companyID ? userdetail.companyID : "",
                "deptid": userdetail?.departmentID ? userdetail.departmentID : "",
            }
            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            axios({
                method: "POST",
                url: baseUrl.Url + "/backend/api/GET_RECEIPTMaster/_Search",
                data: JSON.stringify(payload),
                headers: headers,
            })

                .then((response) => {
                    if (response.status != 200) throw new Error("Failed to send otp");
                    console.log("response", response.data);
                    setReceiptMaster(response.data);
                })
        } catch (error) {
            console.error("Error while searching Service data:", error);
        }
    };

    const [selectedData, setSelectedData] = useState({ baid: null, date: null, billno: null });
    const OnProceed = (baid, date, billno) => {
        setSelectedData({ baid: baid, date: date, billno: billno });

    };

    // for Refresh
    const refreshData = () => {
        const fetchRECEIPTMaster = async () => {
            // alert(searchQuery)
            try {
                const payload = {
                    "baid": "%",
                    "date": userdetail.APPDT,
                    "keyword": searchQuery || "%",
                    "companyid": userdetail?.companyID ? userdetail.companyID : "",
                    "deptid": userdetail?.departmentID ? userdetail.departmentID : "",
                };
                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };
                const response = await axios.post(
                    `${baseUrl.Url}/backend/api/GET_RECEIPTMaster/_Search`,
                    payload,
                    { headers }
                );
                if (response.status !== 200)
                    throw new Error("Failed to fetch ");
                console.log("receipt master", response.data)
                setReceiptMaster(response.data);
            } catch (error) {
                console.error("Error fetching Receipt Master data:", error);
            }
        };

        fetchRECEIPTMaster();
        setRefreshFlag(prev => !prev);
    };

    // for Refresh
    useEffect(() => {
        setSelectedData({ baid: null, date: null, billno: null }); // 👈 Clear after refresh
    }, [refreshFlag]);

    //dowload excel function

    const exportToExcel = async () => {
        try {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("Billing Report");

            const headingRow = worksheet.addRow(["Billing Report"]);
            headingRow.getCell(1).font = { bold: true, size: 16 };
            headingRow.getCell(1).alignment = { horizontal: "center", vertical: "middle" };

            worksheet.mergeCells("A1:C1");

            const headers = ["टोकन नंबर ", "बिल नंबर ", "तारीख ", "शेतकरी नाव ", "आधार नंबर", "मोबाइल नंबर", "गाडी नंबर"];
            const headerRow = worksheet.addRow(headers);

            headerRow.eachCell((cell) => {
                cell.font = { bold: true, color: { argb: "FFFFFF" } };
                cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "808080" } };
                cell.alignment = { horizontal: "center", vertical: "middle" };
            });

            const columnWidths = [20, 20, 20, 20, 20, 20, 20]; // Adjust widths as needed
            columnWidths.forEach((width, index) => {
                worksheet.getColumn(index + 1).width = width;
            });

            receiptmaster.forEach(({ btokanno, billno, date, fname, faddharno, fcontactno, vehno }) => {
                const row = worksheet.addRow([btokanno, billno, date, fname, faddharno, fcontactno, vehno]);
                row.eachCell((cell) => {
                    cell.alignment = { horizontal: "center", vertical: "middle" };
                });
            });



            const buffer = await workbook.xlsx.writeBuffer();
            const data = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
            saveAs(data, "Billing Report.xlsx");
            // console.log(marathiFontBase64);

        } catch (error) {
            console.error("Error generating the Excel file:", error);
        }
    };


    // dowload pdf function
    const generatePDF = (receiptmaster) => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();

        const cleanBase64 = marathiFontBase64.replace(/^data:font\/ttf;base64,/, "");

        doc.addFileToVFS("NotoSansDevanagari.ttf", cleanBase64);
        doc.addFont("NotoSansDevanagari.ttf", "NotoSansDevanagari", "normal");

        // Title: Marathi font
        doc.setFont("NotoSansDevanagari", "normal");
        doc.setFontSize(16);
        const title = "बिलिंग अहवाल";
        doc.text(title, (pageWidth - doc.getTextWidth(title)) / 2, 20);

        // Table headings in Marathi
        const tableColumn = [["टोकन नंबर", "बिल नंबर", "तारीख", "शेतकरी नाव", "आधार नंबर", "मोबाइल नंबर", "गाडी नंबर"]];

        // Table body data in English
        const tableRows = receiptmaster.map((item) => {
            const formattedDate = item.tarikh
                ? new Date(item.tarikh).toLocaleDateString("en-GB")
                : "N/A";

            const formattedVehNo = (item.vehicleno && item.vehicleno.trim())
                ? item.vehicleno.trim().replace(/([A-Za-z]{2})(\d{2})([A-Za-z]{1,2})(\d{4})/, "$1 $2 $3 $4")
                : "N/A";

            return [
                item.btokanno || "",
                item.billno || "",
                item.date || "",
                item.fname || "",
                item.faddharno || "",
                item.fcontactno || "",
                item.vehno || "",
                formattedDate,
                formattedVehNo
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
        <Tooltip id="collapse-tooltip" {...props}>
            Collapse
        </Tooltip>
    );




    const renderProceedTooltip = (props) => (
        <Tooltip id="Edit-tooltip" {...props}>
            Proceed
        </Tooltip>
    );


    const renderActionTooltip = (props) => (
        <Tooltip id="action-tooltip" {...props}>
            Action
        </Tooltip>
    );

    // const [datad, setdata] = useState({ baid: null });
    // const openModal = ({ baid }) => {
    //     setdata({ baid: baid });
    // }


    const columns = [
        {

            title: (
                <div className="d-flex justify-content-center">
                    <OverlayTrigger placement="top" overlay={<Tooltip id="tokanno-tooltip">टो.नं</Tooltip>}>
                        <span style={{ cursor: "pointer" }}>टो.नं</span>
                    </OverlayTrigger>
                </div>
            ),
            dataIndex: "btokanno",
            // sorter: (a, b) => a.btokanno.length - b.btokanno.length,
            render: (text) => (
                <OverlayTrigger placement="top" overlay={<Tooltip id="tokanno-tooltip">{text}</Tooltip>}>
                    <div style={{ textAlign: "left" }}>{text}</div>
                </OverlayTrigger>
            ),
        },

        {
            title: (
                <div className="d-flex justify-content-center">
                    <OverlayTrigger placement="top" overlay={<Tooltip id="billno-tooltip">बि.नं</Tooltip>}>
                        <span style={{ cursor: "pointer" }}>बि.नं</span>
                    </OverlayTrigger>
                </div>
            ),
            dataIndex: "billno",
            // sorter: (a, b) => a.billno.length - b.billno.length,
            render: (text) => (
                <OverlayTrigger placement="top" overlay={<Tooltip id="billno-tooltip">{text}</Tooltip>}>
                    <div style={{ textAlign: "left" }}>{text}</div>
                </OverlayTrigger>
            ),
        },

        {
            title: (
                <div className="d-flex justify-content-center">
                    <OverlayTrigger placement="top" overlay={<Tooltip id="date-tooltip">तारीख</Tooltip>}>
                        <span style={{ cursor: "pointer" }}>तारीख</span>
                    </OverlayTrigger>
                </div>
            ),
            dataIndex: "date",
            render: (text) => (
                <OverlayTrigger placement="top" overlay={<Tooltip id="date-tooltip">{text}</Tooltip>}>
                    <div style={{ textAlign: "center" }}>{text}</div>
                </OverlayTrigger>
            ),
        },

        {
            title: (
                <div className="d-flex justify-content-center">
                    <OverlayTrigger placement="top" overlay={<Tooltip id="fname-tooltip">शेतकरी नाव</Tooltip>}>
                        <span style={{ cursor: "pointer" }}>शेतकरी नाव</span>
                    </OverlayTrigger>
                </div>
            ),
            dataIndex: "fname",
            // sorter: (a, b) => a.fname.length - b.fname.length,
            render: (text) => (
                <OverlayTrigger placement="top" overlay={<Tooltip id="fname-tooltip">{text}</Tooltip>}>
                    <div style={{ textAlign: "left" }}>{text}</div>
                </OverlayTrigger>
            ),
        },

        {
            title: (
                <div className="d-flex justify-content-center">
                    <OverlayTrigger placement="top" overlay={<Tooltip id="faddharno-tooltip">आधार नंबर</Tooltip>}>
                        <span style={{ cursor: "pointer" }}>आधार नंबर</span>
                    </OverlayTrigger>
                </div>
            ),
            dataIndex: "faddharno",
            // sorter: (a, b) => a.faddharno.length - b.faddharno.length,
            render: (text) => (
                <OverlayTrigger placement="top" overlay={<Tooltip id="faddharno-tooltip">{text}</Tooltip>}>
                    <div style={{ textAlign: "left" }}>{text}</div>
                </OverlayTrigger>
            ),
        },
        {
            title: (
                <div className="d-flex justify-content-center">
                    <OverlayTrigger placement="top" overlay={<Tooltip id="fcontactno-tooltip">मोबाइल नंबर</Tooltip>}>
                        <span style={{ cursor: "pointer" }}>मोबाइल नंबर</span>
                    </OverlayTrigger>
                </div>
            ),
            dataIndex: "fcontactno",
            // sorter: (a, b) => a.fcontactno.length - b.fcontactno.length,
            render: (text) => (
                <OverlayTrigger placement="top" overlay={<Tooltip id="fcontactno-tooltip">{text}</Tooltip>}>
                    <div style={{ textAlign: "left" }}>{text}</div>
                </OverlayTrigger>
            ),
        },
        {
            title: (
                <div className="d-flex justify-content-center">
                    <OverlayTrigger placement="top" overlay={<Tooltip id="vehno-tooltip">गाडी नंबर</Tooltip>}>
                        <span style={{ cursor: "pointer" }}>गाडी नंबर</span>
                    </OverlayTrigger>
                </div>
            ),
            dataIndex: "vehno",
            // sorter: (a, b) => a.vehno.length - b.vehno.length,
            render: (text) => (
                <OverlayTrigger placement="top" overlay={<Tooltip id="vehno-tooltip">{text}</Tooltip>}>
                    <div style={{ textAlign: "left" }}>{text}</div>
                </OverlayTrigger>
            ),
        },

        {
            title: (
                <div className="d-flex justify-content-center">
                    <OverlayTrigger placement="top" overlay={<Tooltip id="status-tooltip">स्टेटस</Tooltip>}>
                        <span style={{ cursor: "pointer" }}>स्टेटस</span>
                    </OverlayTrigger>
                </div>
            ),
            dataIndex: "status",
            align: "center",
            render: (text) => (
                <span className={`badge ${text == 1 ? "badge-success" : "badge-danger"}`} style={{ cursor: "pointer" }}>
                    <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip id="status-tooltip">{text == 1 ? "Completed" : "Pending"}</Tooltip>}
                    >
                        <Link to="#" style={{ color: "white", textDecoration: "none" }}>
                            {text == 1 ? "Completed" : "Pending"}
                        </Link>
                    </OverlayTrigger>
                </span>
            )

        },

        {
            title: (
                <OverlayTrigger placement="top" overlay={renderActionTooltip}>
                    < div className="d-flex justify-content-center" >
                        Action
                    </div >
                </OverlayTrigger>

            ),
            dataIndex: "action",
            render: (_, record) => (
                <div className="action-table-data">
                    <div className="edit-delete-action">
                        {/* Proceed */}
                        <OverlayTrigger
                            placement="top"
                            overlay={renderProceedTooltip}

                        >
                            <Link
                                className="me-2 p-2"
                                to="#"
                                onClick={async (e) => {
                                    e.preventDefault(); // Always prevent default

                                    if (record.isvyapariverified) {
                                        // First run your logic
                                        OnProceed(record.baid, record.date, record.billno);

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
                            </Link>


                        </OverlayTrigger>
                        {/* <OverlayTrigger
                            placement="top"
                            overlay={renderProceedTooltip}

                        >


                            <Link className="me-2 p-2"
                                to="#"
                                data-bs-toggle="modal"
                                data-bs-target="#QuickFarmerBill"
                                onClick={() => openModal(record.baid)}
                            >
                                <Edit className="feather-edit" />
                            </Link>
                        </OverlayTrigger> */}


                    </div>
                </div >
            ),
        },
    ];

    // Empty data source
    // const dataSource = [];

    return (
        <div className="page-wrapper">
            <div className="content">
                <div className="page-header">
                    <div className="add-item d-flex">
                        <div className="page-title">
                            <h3>Completed & Pending Bills </h3>
                            <h6>Manage Bills</h6>
                        </div>
                    </div>
                    <ul className="table-top-head">

                        <li>
                            <OverlayTrigger placement="top" overlay={renderTooltip}>
                                <Link
                                    to="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        generatePDF(receiptmaster);
                                    }}
                                >
                                    <ImageWithBasePath src="assets/img/icons/pdf.svg" alt="Download PDF" />
                                </Link>
                            </OverlayTrigger>
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
                        <Link
                            to="#"
                            className="btn btn-added"
                            data-bs-toggle="modal"
                            data-bs-target="#AddSalesEnquiry"
                        >
                            <PlusCircle className="me-2" />
                            Add New Bills
                        </Link>
                    </div> */}

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
                                />
                                <span className="input-group-text">
                                    <i className="fa fa-search"></i>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card table-list-card">
                    <div className="card-body">
                        <div className="table-responsive">
                            <Table columns={columns} dataSource={receiptmaster} />
                        </div>
                    </div>
                </div>

                <Brand />
            </div>

            <AddFarmerBill
                BAID={selectedData.baid}
                DATE={selectedData.date}
                billno={selectedData.billno}
                onRefresh={refreshData}// for refresh
            />
            {/* <QuickFarmerBill
                BAID={datad.baid}
            /> */}

        </div>
    );
};

export default FarmerBillMaster;

