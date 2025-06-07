import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import ImageWithBasePath from "../../core/img/imagewithbasebath";
import Brand from "../../core/modals/inventory/brand";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
// import { all_routes } from "../../Router/all_routes";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import AddPickupQuotation from "./AddPickupQuotation";
import Table from "../../core/pagination/datatable";
import axios from 'axios';
// import AddPurchases from "../../core/modals/purchases/addpurchases";
import { setToogleHeader } from "../../core/redux/action";
import EditPurchases from "../../core/modals/purchases/editpurchases";
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { saveAs } from 'file-saver';
import ExcelJS from "exceljs";
import { all_routes } from "../../Router/all_routes";

import {
    ChevronUp,
    Edit,
    RotateCcw,
    Trash2,
} from "feather-icons-react/build/IconComponents";


// import { baseUrl } from "../../core/json/custom";
import AddChallanSale from "./AddDirectSaleChallan";

import { getUserData } from "../../Context/UserData";
import { baseUrl } from "../../core/json/custom";
const PickupQuotationmaster = () => {
    const { userdetail } = getUserData();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const data = useSelector((state) => state.toggle_header);
    const route = all_routes;

    useEffect(() => {
        const handleShortcut = (e) => {
            if (e.ctrlKey && e.key === 'a') {
                e.preventDefault();
                navigate(route.addPurchases);
            }
        };

        window.addEventListener('keydown', handleShortcut);

        return () => {
            window.removeEventListener('keydown', handleShortcut);
        };
    }, [navigate]);


    // const dataSource = [];
    const [quotationList, setquotationList] = useState([]);
    useEffect(() => {

        const fetchCustomerData = async () => {
            try {
                const payload = {
                    "pkid": "%",
                    "keyword": "%",
                    "companyid": userdetail?.companyID || "",
                    "deptid": userdetail?.departmentID || "",
                }
                console.log("Fetching with payload:", payload);
                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };
                const response = await axios.post(
                    `${baseUrl.Url}/backend/api/GET_SQuatationMaster`,
                    payload,
                    { headers }
                );
                console.log("API Response:", response);
                if (response.status !== 200)
                    throw new Error("Failed to fetch vendor data");
                console.log("Quotation master", response.data)
                setquotationList(response.data);
            } catch (error) {
                console.error("Error fetching vendor data:", error);
            }
        };

        fetchCustomerData();

    }, []);

    const [selectedData, setSelectedData] = useState({ sqamaid: null });
    const openModal = (sqamaid) => {
        setSelectedData({ sqamaid })
    }

    const columns = [
        {
            title: (
                <OverlayTrigger placement="top" overlay={<Tooltip id="quotation_no-tooltip">Quotation No</Tooltip>}>
                    <span>Quotation No</span>
                </OverlayTrigger>
            ),
            dataIndex: "sqno",
            sorter: (a, b) => a.product.length - b.product.length,
            render: (text) => (
                <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-qno">{`Quotation No: ${text}`}</Tooltip>}>
                    <div style={{ textAlign: "left" }}>{text}</div>
                </OverlayTrigger>
            ),
        },
        {
            title: (
                <OverlayTrigger placement="top" overlay={<Tooltip id="quotation_date-tooltip">Quotation Date</Tooltip>}>
                    <span style={{ display: 'block', textAlign: 'center', width: '100%' }}>Quotation Date</span>
                </OverlayTrigger>
            ),
            dataIndex: "sqdate",
            render: (text) => (
                <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-qdate">{`Quotation Date: ${text}`}</Tooltip>}>
                    <div style={{ textAlign: "center" }}>{text}</div>
                </OverlayTrigger>
            ),
        },
        {
            title: (
                <OverlayTrigger placement="top" overlay={<Tooltip id="quotation_name-tooltip">Customer Name</Tooltip>}>
                    <span>Customer Name</span>
                </OverlayTrigger>
            ),
            dataIndex: "vendorname",
            render: (text) => (
                <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-vendorname">{`Vendor Name: ${text}`}</Tooltip>}>
                    <div style={{ textAlign: "left" }}>{text}</div>
                </OverlayTrigger>
            ),
        },

        {
            title: (
                <OverlayTrigger placement="top" overlay={<Tooltip id="quotation_due_date-tooltip">Quotation Due Date</Tooltip>}>
                    <span style={{ display: 'block', textAlign: 'center', width: '100%' }}>Quotation Due Date</span>
                </OverlayTrigger>
            ),
            dataIndex: "sqduedate",
            render: (text) => (
                <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-quoduedate">{`Quotation Due Date: ${text}`}</Tooltip>}>
                    <div style={{ textAlign: "center" }}>{text}</div>
                </OverlayTrigger>
            ),
        },
        {
            title: (
                <OverlayTrigger placement="top" overlay={<Tooltip id="quotation_name-tooltip">Total</Tooltip>}>
                    <span>Total</span>
                </OverlayTrigger>
            ),
            dataIndex: "sqmnamt",
            render: (text) => (
                <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-vendorname">{`Vendor Name: ${text}`}</Tooltip>}>
                    <div style={{ textAlign: "left" }}>{text}</div>
                </OverlayTrigger>
            ),
        },
        {
            title: (
                <div className="d-flex justify-content-center">
                    <OverlayTrigger placement="top" overlay={<Tooltip id="action-tooltip">Action</Tooltip>}>
                        <span>Action</span>
                    </OverlayTrigger>
                </div>
            ),
            dataIndex: "action",
            render: (_, record) => (
                <div className="action-table-data">
                    <div className="edit-delete-action">

                        <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip id="edit-tooltip">Edit </Tooltip>}
                        >
                            <Link className="me-2 p-2"
                                to="#"
                                data-bs-toggle="modal"
                                data-bs-target="#AddPickupQuotation"
                                onClick={() => openModal(record.sqamaid)}
                            >
                                <Edit className="feather-edit" />
                            </Link>
                        </OverlayTrigger>

                        <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip id="delete-tooltip">Delete </Tooltip>}
                        >
                            <Link
                                className="confirm-text p-2 me-2"
                                to="#"
                                onClick={() => showConfirmationAlert(record.sqamaid)}
                            >
                                <Trash2 className="feather-trash-2" />
                            </Link>
                        </OverlayTrigger>
                        <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip id="delete-tooltip me-2">Next to Proceed</Tooltip>}
                        >
                            <Link className="me-2 p-2" to="#" data-bs-toggle="modal" data-bs-target="#AddDirectsalechallan" onClick={() => openModal(record.sqamaid)} style={{ color: 'green' }}>
                                <i data-feather="arrow-right-circle" className="feather-arrow-right-circle"></i>
                            </Link>
                        </OverlayTrigger>

                        {/* <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip id="approve-tooltip">Proceed </Tooltip>}
                        >
                            <Link className="me-2 p-2" to="#" data-bs-toggle="modal" data-bs-target="#AddPickupQuotation" style={{ color: 'green' }}>
                                <i data-feather="arrow-right-circle" className="feather-arrow-right-circle"></i>
                            </Link>
                        </OverlayTrigger> */}
                    </div>
                </div>
            ),
        },
    ];

    const MySwal = withReactContent(Swal);

    const showConfirmationAlert = (sqamaid) => {
        MySwal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            showCancelButton: true,
            confirmButtonColor: "#00ff00",
            confirmButtonText: "Yes, delete it!",
            cancelButtonColor: "#ff0000",
            cancelButtonText: "Cancel",
        }).then((result) => {
            if (result.isConfirmed) {
                OndeleteQuotation(sqamaid);
            } else {
                MySwal.close();
            }
        });
    };
    const OndeleteQuotation = async (sqamaid) => {
        try {
            const payload = {
                "sqamaid": sqamaid,
                "companyid": userdetail?.companyID || "",
                "deptid": userdetail?.departmentID || "",

            }
            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            axios({
                method: "POST",
                url: baseUrl.Url + "/backend/api/SP_DeleteSQuatation",
                data: JSON.stringify(payload),
                headers: headers,
            })
                .then((response) => {
                    if (response.status != 200) throw new Error("Failed to Fetching Data");
                    MySwal.fire({
                        title: response.data[0].responseCode === "FAILURE" ? "Deletion Not Allowed" : "Deleted!",
                        text: response.data[0].responseCode === "FAILURE"
                            ? response.data[0].responseMessage
                            : response.data[0].responseMessage,
                        icon: response.data[0].responseCode === "FAILURE" ? "error" : "success",
                        confirmButtonText: "OK",
                        customClass: {
                            confirmButton: response.data[0].responseCode === "FAILURE" ? "btn btn-danger" : "btn btn-success",
                        },
                    });
                    try {
                        const payload = {
                            "sqamaid": "%",
                            "companyid": userdetail?.companyID || "",
                            "deptid": userdetail?.departmentID || "",

                        }
                        const headers = {
                            "Content-Type": "application/json",
                            Accept: "*/*",
                        };

                        axios({
                            method: "POST",
                            url: baseUrl.Url + "/backend/api/GET_SQuatationMaster",
                            data: JSON.stringify(payload),
                            headers: headers,
                        })
                            .then((response) => {
                                if (response.status != 200) throw new Error("Failed to Fetching Data");
                                const DATA = response.data;
                                setquotationList(DATA);
                            })

                    } catch (error) {
                        console.error("Error fetching Access Right Data:", error);
                    }
                })

        } catch (error) {
            console.error("Error fetching Access Right Data:", error);
        }

    }
    const [searchQuery, setSearchQuery] = useState("");
    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
        try {
            const payload = {
                "pkid": "%",
                "keyword": event.target.value,
                "companyid": userdetail?.companyID || "",
                "deptid": userdetail?.departmentID || "",
            }
            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            axios({
                method: "POST",
                url: baseUrl.Url + "/backend/api/GET_SQuatationMaster/Keyword",
                data: JSON.stringify(payload),
                headers: headers,
            })

                .then((response) => {
                    if (response.status != 200) throw new Error("Failed to send otp"); console.log("response", response.data);
                    setquotationList(response.data);
                })
        } catch (error) {
            console.error("Error while searching WareHouse data:", error);
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

    const generatePDF = (quotationList) => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        doc.setFontSize(12);
        doc.setFont("Helvetica", "bold");
        const title = "Quotation Report";
        const titleWidth = doc.getTextWidth(title);

        const borderMargin = 10;
        doc.rect(borderMargin, borderMargin, pageWidth - borderMargin * 2, pageHeight - borderMargin * 2);

        doc.text(title, (pageWidth - titleWidth) / 2, 20);
        doc.setLineWidth(0.5);
        doc.line((pageWidth - titleWidth) / 2, 22, (pageWidth + titleWidth) / 2, 22);

        doc.setFontSize(13);
        doc.setFont("Helvetica", "normal");
        let yPosition = 15;

        const tableColumn = ["Quotation No", "Quotation Date", "Customer Name", "Quotation Due Date", "Total"];
        const tableRows = quotationList.map((item) => [
            item.sqno,
            item.sqdate,
            item.sqcaid,
            item.sqduedate,
            item.sqmnamt,

        ]);

        let totalsqmnamt = quotationList.reduce((sum, item) => sum + parseFloat(item.sqmnamt || 0), 0);

        const totalRow = [
            { content: "", colSpan: 3 }, // Merge first three columns
            { content: "Total", styles: { fontStyle: "bold" } },
            { content: totalsqmnamt.toFixed(2), styles: { fontStyle: "bold" } },

        ];

        autoTable(doc, {
            startY: yPosition + 10,
            head: [tableColumn],
            body: [...tableRows, totalRow],
            theme: 'grid',
            styles: { fontSize: 10, halign: "center", lineColor: [0, 0, 0], lineWidth: 0.20 }, // Dark border lines
            headStyles: { fillColor: [169, 169, 169], textColor: 0, fontStyle: "bold" }, // Gray header
            bodyStyles: { textColor: 0 }, // Black text in table
        });
        doc.save("Report.pdf");
    };

    const exportToExcel = async () => {
        try {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("Quotation Report");

            // **Main Heading Row**
            const headingRow = worksheet.addRow(["Quotation Report"]);
            headingRow.getCell(1).font = { bold: true, size: 16 };
            headingRow.getCell(1).alignment = { horizontal: "center", vertical: "middle" };

            // Merge heading across all columns
            worksheet.mergeCells("A1:E1");

            // **Header Row**
            const headers = ["Quotation No", "Quotation Date", "Customer Name", "Quotation Due Date", "Total"];
            const headerRow = worksheet.addRow(headers);

            headerRow.eachCell((cell) => {
                cell.font = { bold: true, color: { argb: "FFFFFF" } };
                cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "808080" } };
                cell.alignment = { horizontal: "center", vertical: "middle" };
            });

            // **Setting Column Widths**
            const columnWidths = [15, 20, 25, 30, 18]; // Adjust widths as needed
            columnWidths.forEach((width, index) => {
                worksheet.getColumn(index + 1).width = width;
            });

            // **Adding Data Rows**
            quotationList.forEach(({ sqno, sqdate, vendorname, sqduedate, sqmnamt }) => {
                const row = worksheet.addRow([sqno, sqdate, vendorname, sqduedate, sqmnamt]);
                row.eachCell((cell) => {
                    cell.alignment = { horizontal: "center", vertical: "middle" };
                });
            });

            // **Generate and Save Excel File**
            const buffer = await workbook.xlsx.writeBuffer();
            const data = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
            saveAs(data, "QuotationReport.xlsx");

        } catch (error) {
            console.error("Error generating the Excel file:", error);
        }
    };
    return (
        <div className="page-wrapper">
            <div className="content">
                <div className="page-header">
                    <div className="add-item d-flex">
                        <div className="page-title">
                            <h3>Quotation Details</h3>
                        </div>
                    </div>
                    <ul className="table-top-head">
                        <li>
                            <OverlayTrigger placement="top" overlay={renderTooltip}>
                                <Link onClick={() => generatePDF(quotationList)}>
                                    <ImageWithBasePath src="assets/img/icons/pdf.svg" alt="Download PDF" />
                                </Link>
                            </OverlayTrigger>
                        </li>
                        <li>
                            <OverlayTrigger placement="top" overlay={renderExcelTooltip}>
                                <Link onClick={() => exportToExcel(quotationList)}>
                                    <ImageWithBasePath src="assets/img/icons/excel.svg" alt="img" />
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
                    <div className="d-flex purchase-pg-btn">
                        <div className="page-btn">
                            <Link
                                to="#"
                                className="btn btn-added"
                                data-bs-toggle="modal"
                                data-bs-target="#AddPickupQuotation"
                            >
                                Add Sale Quotation
                            </Link>
                        </div>
                    </div>
                    {/* <div className="page-btn">
                        <Link to={route.test} className="btn btn-secondary">
                            <ArrowLeft className="me-2" />
                            Back to Index
                        </Link>
                    </div> */}
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
                            <Table columns={columns} dataSource={quotationList} />
                        </div>
                    </div>
                </div>
                <Brand />
            </div>

            <AddPickupQuotation SQAMAID={selectedData.sqamaid} />
            <EditPurchases />
            <AddChallanSale sqamaid={selectedData.sqamaid} />


        </div>
    );
};

export default PickupQuotationmaster;
