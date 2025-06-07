import React, { useState, useEffect } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import ImageWithBasePath from "../../core/img/imagewithbasebath";
import { Link } from "react-router-dom";
import axios from 'axios';
import { baseUrl } from "../../core/json/custom";
import { setToogleHeader } from "../../core/redux/action";
import { useDispatch, useSelector } from "react-redux";
import {
    ChevronUp,
    PlusCircle,
    RotateCcw,

} from "react-feather";
import { Trash2 } from "feather-icons-react/build/IconComponents";
import Table from "../../core/pagination/datatable";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import AddPayroll from "./AddPayRoll";
// import { all_routes } from "../../Router/all_routes";
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";

const PayrollMaster = () => {

    const [Payroll, setPayroll] = useState([]);
    const MySwal = withReactContent(Swal);
    // const GUID = ACSPLGUID.getNew()
    // const route = all_routes;
    const dispatch = useDispatch();
    const data = useSelector((state) => state.toggle_header);

    useEffect(() => {
        try {
            const payload = {
                "paid": "%",
                "companyid": "",
                "deptid": ""

            }

            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            axios({
                method: "POST",
                url: baseUrl.Url + "/backend/api/GET_HRMPayroll",
                data: JSON.stringify(payload),
                headers: headers,
            })
                .then((response) => {
                    if (response.status != 200) throw new Error("Failed to Fetching Data");
                    const DATA = response.data;
                    setPayroll(DATA);
                })

        } catch (error) {
            console.error("Error fetching Access Right Data:", error);
        }
    }, []);

    //Deletet challanMaster Code
    const Ondeletechallan = async (paid) => {
        try {
            const payload = {
                "paid": paid,
                "companyid": "",
                "deptid": ""
            }
            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            axios({
                method: "POST",
                url: baseUrl.Url + "/backend/api/SP_DeleteHRMPayroll",
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
                            "paid": "%",
                            "companyid": "",
                            "deptid": ""
                        }
                        const headers = {
                            "Content-Type": "application/json",
                            Accept: "*/*",
                        };

                        axios({
                            method: "POST",
                            url: baseUrl.Url + "/backend/api/GET_HRMPayroll",
                            data: JSON.stringify(payload),
                            headers: headers,
                        })
                            .then((response) => {
                                if (response.status != 200) throw new Error("Failed to Fetching Data");
                                const DATA = response.data;
                                setPayroll(DATA);
                            })

                    } catch (error) {
                        console.error("Error fetching Access Right Data:", error);
                    }
                })
        } catch (error) {
            console.error("Error fetching Access Right Data:", error);
        }
    }


    const generatePDF = (Payroll) => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        doc.setFontSize(12);
        doc.setFont("Helvetica", "bold");
        const title = "Payroll Report";
        const titleWidth = doc.getTextWidth(title);

        const borderMargin = 10;
        doc.rect(borderMargin, borderMargin, pageWidth - borderMargin * 2, pageHeight - borderMargin * 2);

        doc.text(title, (pageWidth - titleWidth) / 2, 20);
        doc.setLineWidth(0.5);
        doc.line((pageWidth - titleWidth) / 2, 22, (pageWidth + titleWidth) / 2, 22);

        doc.setFontSize(13);
        doc.setFont("Helvetica", "normal");
        let yPosition = 15;

        const tableColumn = ["Employee Name", "Salary", "Allowances", "Deductions", "Net Salery", "Status"];
        const tableRows = Payroll.map((item) => [
            item.empname,
            item.pbasicsalary,
            item.ptotalallowance,
            item.ptotaldeduction,
            item.pnetsalarey,
            item.pstatus ? "Active" : "Inactive",

        ]);

        autoTable(doc, {
            startY: yPosition + 10,
            head: [tableColumn],
            body: tableRows,
            theme: 'grid',
            styles: { fontSize: 10, halign: "center", lineColor: [0, 0, 0], lineWidth: 0.20 },
            headStyles: { fillColor: [169, 169, 169], textColor: 0, fontStyle: "bold" },
            bodyStyles: { textColor: 0 },
        });
        doc.save("Report.pdf");

    };

    const exportToExcel = async () => {
        try {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("HRM PayRoll Report");

            const headingRow = worksheet.addRow(["HRM PayRoll Report"]);
            headingRow.getCell(1).font = { bold: true, size: 16 };
            headingRow.getCell(1).alignment = { horizontal: "center", vertical: "middle" };

            worksheet.mergeCells("A1:F1");

            const headers = ["Employee Name", "Salary", "Allowances", "Deductions", "Net Salery", "Status"];
            const headerRow = worksheet.addRow(headers);

            headerRow.eachCell((cell) => {
                cell.font = { bold: true, color: { argb: "FFFFFF" } };
                cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "808080" } };
                cell.alignment = { horizontal: "center", vertical: "middle" };
            });

            const columnWidths = [15, 20, 25, 30, 30, 30,]; // Adjust widths as needed
            columnWidths.forEach((width, index) => {
                worksheet.getColumn(index + 1).width = width;
            });

            Payroll.forEach(({ empname, pbasicsalary, ptotalallowance, ptotaldeduction, pnetsalarey, pstatus, }) => {
                const statusText = pstatus ? "Active" : "Inactive";
                const row = worksheet.addRow([empname, pbasicsalary, ptotalallowance, ptotaldeduction, pnetsalarey, statusText,]);
                row.eachCell((cell) => {
                    cell.alignment = { horizontal: "center", vertical: "middle" };
                });
            });

            const buffer = await workbook.xlsx.writeBuffer();
            const data = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
            saveAs(data, "HRMPayrollReport.xlsx");

        } catch (error) {
            console.error("Error generating the Excel file:", error);
        }
    };

    const columns = [
        {
            title: () => (<OverlayTrigger plcement="top"
                overlay={renderSellerTooltip}>
                <div style={{ textAlign: "center" }}>
                    <span>Employee Name</span>
                </div>
            </OverlayTrigger>),
            dataIndex: "empname",

            render: (text) => (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id={'tooltip-${text}'}>{text}</Tooltip>}>
                    <div style={{ textAlign: "center" }}>{text}</div>
                </OverlayTrigger>
            ),
            sorter: (a, b) => a.empname.localeCompare(b.empname),
        },
        {
            title: () => (<OverlayTrigger plcement="top"
                overlay={renderSalleryTooltip}>
                <div style={{ textAlign: "center" }}>
                    <span>Salary</span>
                </div>
            </OverlayTrigger>),
            dataIndex: "pbasicsalary",

            render: (text) => (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id={'tooltip-${text}'}>{text}</Tooltip>}>
                    <div style={{ textAlign: "center" }}>{text}</div>
                </OverlayTrigger>
            ),
            // sorter: (a, b) => a.pbasicsalary.localeCompare(b.pbasicsalary),
        },
        {
            title: () => (<OverlayTrigger plcement="top"
                overlay={renderAllowancesTooltip}>
                <div style={{ textAlign: "center" }}>
                    <span>Allowances</span>
                </div>
            </OverlayTrigger>),
            dataIndex: "ptotalallowance",

            render: (text) => (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id={'tooltip-${text}'}>{text}</Tooltip>}>
                    <div style={{ textAlign: "center" }}>{text}</div>
                </OverlayTrigger>
            ),
            // sorter: (a, b) => a.ptotalallowance.length - b.ptotalallowance.length,
        },
        {
            title: () => (<OverlayTrigger plcement="top"
                overlay={renderDeductionsTooltip}>
                <div style={{ textAlign: "center" }}>
                    <span>Deductions</span>
                </div>
            </OverlayTrigger>),
            dataIndex: "ptotaldeduction",

            render: (text) => (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id={'tooltip-${text}'}>{text}</Tooltip>}>
                    <div style={{ textAlign: "center" }}>{text}</div>
                </OverlayTrigger>
            ),
            // sorter: (a, b) => a.ptotaldeduction.length - b.ptotaldeduction.length,
        },
        {
            title: () => (<OverlayTrigger plcement="top"
                overlay={renderNetsaleryTooltip}>
                <div style={{ textAlign: "center" }}>
                    <span>Net Salery</span>
                </div>
            </OverlayTrigger>),
            dataIndex: "pnetsalarey",

            render: (text) => (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id={'tooltip-${text}'}>{text}</Tooltip>}>
                    <div style={{ textAlign: "center" }}>{text}</div>
                </OverlayTrigger>
            ),
            // sorter: (a, b) => a.pnetsalarey.localeCompare(b.pnetsalarey),
        },

        {
            title: () => (<OverlayTrigger plcement="top"
                overlay={renderStatusTooltip}>
                <div style={{ textAlign: "center" }}>
                    <span>Status</span>
                </div>
            </OverlayTrigger>),
            dataIndex: "pstatus",
            sorter: (a, b) => a.pstatus.length - b.pstatus.length,
            render: (text) => (
                <span className={`badge ${text == true
                    ? "badge-linesuccess" : text == false
                        ? "badge-linedanger" : "badge-warning"}`}>
                    <Link to="#"> {text == true ? "Active" : text == false
                        ? "Inactive" : "Unknown"}
                    </Link>
                </span>

            ),
        },
        {
            title: () => (<OverlayTrigger placement="top"
                overlay={renderActionTooltip}>
                <div style={{ textAlign: "center" }}>
                    <span>Action</span>
                </div>
            </OverlayTrigger>),
            render: (_, record) => (
                <div className="action-table-data">
                    <div className="edit-delete-action">
                        <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip id="edit-tooltip">Edit</Tooltip>}
                        >
                            {/* <Link className="me-2 p-2"
                to="#"
                data-bs-toggle="modal"
                data-bs-target="#AddPayroll"
                onClick={() => openModal(record.paid)}
              >
                <Edit className="feather-edit" />
              </Link> */}
                            <Link
                                className="me-2 "
                                data-bs-toggle="offcanvas"
                                data-bs-target="#AddPayroll"
                                onClick={() => openModal(record.paid)} >
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
                                onClick={() => showConfirmationAlert(record.paid)}
                            >
                                <Trash2 className="feather-trash-2" />
                            </Link>
                        </OverlayTrigger>
                    </div>
                </div>
            ),
        },
    ];

    const showConfirmationAlert = (paid) => {
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
                Ondeletechallan(paid);

            } else {
                MySwal.close();
            }
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
    const renderSellerTooltip = (props) => (
        <Tooltip id="Seller-tooltip" {...props}>
            Employee Name
        </Tooltip>
    );
    const renderSalleryTooltip = (props) => (
        <Tooltip id="Sallery-tooltip" {...props}>
            Basic Salary
        </Tooltip>
    );
    const renderAllowancesTooltip = (props) => (
        <Tooltip id="Allowances-tooltip" {...props}>
            Total Allowances
        </Tooltip>
    );
    const renderDeductionsTooltip = (props) => (
        <Tooltip id="Deductions-tooltip" {...props}>
            Total Deductions
        </Tooltip>
    );
    const renderNetsaleryTooltip = (props) => (
        <Tooltip id="Netsalery-tooltip" {...props}>
            Net Salery
        </Tooltip>
    );
    const renderStatusTooltip = (props) => (
        <Tooltip id="Netsalery-tooltip" {...props}>
            Status
        </Tooltip>
    );
    const renderActionTooltip = (props) => (
        <Tooltip id="Action-tooltip" {...props}>
            Action
        </Tooltip>
    );
    // const renderEditTooltip = (props) => (
    //     <Tooltip id="Edit-tooltip" {...props}>
    //         Edit
    //     </Tooltip>
    // );



    const [selectedData, setSelectedData] = useState({ paid: null });

    const openModal = (paid) => {
        setSelectedData({ paid })
    }

    return (
        <>
            <div className="page-wrapper">
                <div className="content">
                    <div className="page-header">
                        <div className="add-item d-flex">
                            <div className="page-title">
                                <h4>Payroll</h4>
                                <h6>Manage Your Employees</h6>
                            </div>
                        </div>
                        <ul className="table-top-head">
                            <li>
                                <OverlayTrigger placement="top" overlay={renderTooltip}>
                                    <Link onClick={() => generatePDF(Payroll)}>
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
                        <div className="page-btn">
                            <button
                                className="btn btn-primary add-em-payroll"
                                type="button"
                                data-bs-toggle="offcanvas"
                                data-bs-target="#AddPayroll"
                                aria-controls="#AddPayroll"
                            >
                                <PlusCircle className="me-2" />
                                Add New Payoll
                            </button>
                        </div>
                    </div>
                    {/* /product list */}
                    <div className="card table-list-card">
                        <div className="card-body">
                            {/* /Filter */}
                            <div className="table-responsive">
                                <Table columns={columns} dataSource={Payroll} />
                            </div>
                        </div>
                    </div>
                    {/* /product list */}
                </div>
            </div>
            <AddPayroll PAID={selectedData.paid} />

        </>
    );
};

export default PayrollMaster;
