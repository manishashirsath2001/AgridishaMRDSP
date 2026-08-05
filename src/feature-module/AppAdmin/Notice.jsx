import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import ImageWithBasePath from "../../core/img/imagewithbasebath";
import Brand from "../../core/modals/inventory/brand";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { all_routes } from "../../Router/all_routes";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import Table from "../../core/pagination/datatable";
import { setToogleHeader } from "../../core/redux/action";
import axios from "axios";
import { baseUrl } from "../../core/json/custom";
import { Link, useNavigate } from "react-router-dom";
import ExcelJS from "exceljs";
import marathiFontBase64 from "../../style/fonts/NotoSansDevanagari";
import { saveAs } from "file-saver";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import {
    ArrowLeft,
    ChevronUp,
    Edit,
    Eye,
    PlusCircle,
    RotateCcw,
    Trash2,
} from "feather-icons-react/build/IconComponents";

const Notice = () => {
    const dispatch = useDispatch();
    const data = useSelector((state) => state.toggle_header);
    const MySwal = withReactContent(Swal);
    const route = all_routes;
    const navigate = useNavigate();
    const [Notice, setNotice] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [previewFileUrl, setPreviewFileUrl] = useState(null);

    const onEditClick = (nid) => {
        navigate(route.AddNotice, { state: { nid: nid } });
    };

    const columns = [
        {
            title: "फोटो",
            dataIndex: "noticeimage",
            render: (fileName) => {
                if (!fileName) {
                    return <span>No File</span>;
                }
                const fileExtension = fileName.split(".").pop().toLowerCase();
                const isImage = ["jpg", "jpeg", "png", "gif"].includes(fileExtension);
                const fileUrl = isImage
                    ? `${baseUrl.Url}/Images/${fileName}`
                    : `${baseUrl.Url}/Assets/${fileName}`;
                return (
                    <div>
                        {isImage ? (
                            <img
                                src={fileUrl}
                                alt={fileName}
                                style={{ width: 70, height: 70, objectFit: "cover", cursor: "pointer" }}
                                onClick={() => openPreviewModal(fileUrl, fileExtension)}
                            />
                        ) : (
                            <OverlayTrigger
                                placement="top"
                                overlay={<Tooltip id="pdf-tooltip">View PDF</Tooltip>}
                            >
                                <a
                                    href={fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ display: "inline-flex", alignItems: "center" }}
                                    onClick={() => openPreviewModal(fileUrl, fileExtension)}
                                >
                                    <ImageWithBasePath
                                        src="assets/img/icons/pdf.svg"
                                        alt="PDF"
                                        style={{ width: 50, height: 50 }}
                                    />
                                    <span style={{ marginLeft: 5 }}>{fileName.split("_").pop()}</span>
                                </a>
                            </OverlayTrigger>
                        )}
                    </div>
                );
            },
        },
        {
            title: "शीर्षक",
            dataIndex: "noticetitle",
        },
        {
            title: "स्थिती",
            dataIndex: "isactive",
            width: "5px",
            render: (status) => {
                const isActive = status === 0 || status === "0"; // Active when status is 0
                const badgeClass = isActive ? "bg-success text-white" : "bg-warning text-white"; // Green for Active, Orange for Inactive
                const label = isActive ? "Active" : "Inactive";
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
            },
        },
        {
            title: "Action",
            dataIndex: "action",
            align: "center",
            render: (_, record) => (
                <div className="action-table-data">
                    <div className="edit-delete-action">
                        <OverlayTrigger placement="top" overlay={<Tooltip id="edit-tooltip">Edit</Tooltip>}>
                            <a className="me-2 p-2" onClick={() => onEditClick(record.nid)}>
                                <Edit className="feather-edit" />
                            </a>
                        </OverlayTrigger>
                        <OverlayTrigger placement="top" overlay={<Tooltip id="delete-tooltip">Delete</Tooltip>}>
                            <Link
                                className="confirm-text p-2"
                                to="#"
                                onClick={() => showConfirmationAlert(record.nid)}
                            >
                                <Trash2 className="feather-trash-2" />
                            </Link>
                        </OverlayTrigger>
                    </div>
                </div>
            ),
        },
    ];

    useEffect(() => {
        const fetchRateList = async () => {
            try {
                const payload = {
                    nid: "%",
                    keyword: "%",
                    companyid: "COMP123",
                };
                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };
                const response = await axios.post(
                    `${baseUrl.Url}/api/GET_Notice`,
                    payload,
                    { headers }
                );
                if (response.status !== 200) throw new Error("Failed to fetch data");
                setNotice(response.data);
                console.log("Fetched RateList Data:", response.data); // Debugging
            } catch (error) {
                console.error("Error fetching RateList data:", error.message);
                MySwal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Failed to fetch rate list data. Please try again.",
                });
            }
        };
        fetchRateList();
    }, []);

    const OndeleteAccounts = async (nid) => {
        try {
            const payload = {
                nid: nid,
                companyid: "",
                deptid: "",
            };
            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };
            const response = await axios.post(
                `${baseUrl.Url}/api/SP_DeleteNotice`,
                payload,
                { headers }
            );
            if (response.status !== 200) throw new Error("Failed to delete data");
            MySwal.fire({
                icon: "success",
                title: "Deleted!",
                text: "Advertisement deleted successfully.",
                confirmButtonText: "OK",
            });
            setNotice((prevState) => prevState.filter((item) => item.nid !== nid));
        } catch (error) {
            console.error("Error deleting account:", error.message);
            MySwal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to delete data. Please try again.",
            });
        }
    };

    const showConfirmationAlert = (nid) => {
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
                OndeleteAccounts(nid);
            }
        });
    };

    const openPreviewModal = (fileUrl, fileExtension) => {
        setPreviewFileUrl(fileUrl);
        setIsModalOpen(true);
    };

    const closePreviewModal = () => {
        setIsModalOpen(false);
        setPreviewFileUrl(null);
    };

    useEffect(() => {
        const handleShortcut = (e) => {
            if (e.ctrlKey && e.key === "a") {
                e.preventDefault();
                navigate(route.AddRateList);
            }
            if (e.ctrlKey && e.key === "e") {
                e.preventDefault();
                navigate(route.AppAdminIndex);
            }
        };
        window.addEventListener("keydown", handleShortcut);
        return () => {
            window.removeEventListener("keydown", handleShortcut);
        };
    }, [navigate]);

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

    const generatePDF = (data) => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const cleanBase64 = marathiFontBase64.replace(/^data:font\/ttf;base64,/, "");
        doc.addFileToVFS("NotoSansDevanagari.ttf", cleanBase64);
        doc.addFont("NotoSansDevanagari.ttf", "NotoSansDevanagari", "normal");
        doc.setFont("NotoSansDevanagari", "normal");
        doc.setFontSize(16);
        const title = "भाव सूची अहवाल";
        doc.text(title, (pageWidth - doc.getTextWidth(title)) / 2, 20);
        const tableColumn = ["शीर्षक", "फाइल", "स्थिती"];
        const tableRows = data.map((item) => [
            item.ratetitle,
            item.rLimage.split("_").pop(),
            item.isactive === "A" || item.isactive === 1 || item.isactive === true ? "Active" : "Inactive",
        ]);
        autoTable(doc, {
            startY: 30,
            head: [tableColumn],
            body: tableRows,
            styles: { font: "NotoSansDevanagari", fontStyle: "normal", fontSize: 12 },
            headStyles: { fontStyle: "normal", fillColor: [0, 102, 204], textColor: 255, fontSize: 14 },
            alternateRowStyles: { fillColor: [240, 240, 240] },
        });
        window.open(doc.output("bloburl"), "_blank");
    };

    const exportToExcel = async (data) => {
        try {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("RateList Report");
            const headingRow = worksheet.addRow(["RateList Report"]);
            headingRow.getCell(1).font = { bold: true, size: 16 };
            headingRow.getCell(1).alignment = { horizontal: "center", vertical: "middle" };
            worksheet.mergeCells("A1:D1");
            const headers = ["शीर्षक", "फाइल", "स्थिती"];
            const headerRow = worksheet.addRow(headers);
            headerRow.eachCell((cell) => {
                cell.font = { bold: true, color: { argb: "FFFFFF" } };
                cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "808080" } };
                cell.alignment = { horizontal: "center", vertical: "middle" };
            });
            const columnWidths = [40, 40, 20];
            columnWidths.forEach((width, index) => {
                worksheet.getColumn(index + 1).width = width;
            });
            data.forEach(({ ratetitle, rLimage, isactive }) => {
                const row = worksheet.addRow([
                    ratetitle,
                    rLimage.split("_").pop(),
                    isactive === "A" || isactive === 1 || isactive === true ? "Active" : "Inactive",
                ]);
                row.eachCell((cell) => {
                    cell.alignment = { horizontal: "center", vertical: "middle" };
                });
            });
            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            saveAs(blob, "RateList.xlsx");
        } catch (error) {
            console.error("Error generating the Excel file:", error);
            MySwal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to generate Excel file. Please try again.",
            });
        }
    };

    return (
        <div className="page-wrapper">
            <div className="content">
                <div className="page-header">
                    <div className="add-item d-flex">
                        <div className="page-title">
                            <h3>नोटिस मास्टर</h3>
                        </div>
                    </div>
                    <ul className="table-top-head">
                        <li>
                            <OverlayTrigger placement="top" overlay={renderTooltip}>
                                <Link onClick={() => generatePDF(GrapeList)}>
                                    <ImageWithBasePath src="assets/img/icons/pdf.svg" alt="Download PDF" />
                                </Link>
                            </OverlayTrigger>
                        </li>
                        <li>
                            <OverlayTrigger placement="top" overlay={renderExcelTooltip}>
                                <Link onClick={() => exportToExcel(GrapeList)}>
                                    <ImageWithBasePath src="assets/img/icons/excel.svg" alt="Excel" />
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
                                <Link
                                    data-bs-toggle="tooltip"
                                    data-bs-placement="top"
                                    onClick={() => window.location.reload()}
                                >
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
                                    onClick={() => dispatch(setToogleHeader(!data))}
                                >
                                    <ChevronUp />
                                </Link>
                            </OverlayTrigger>
                        </li>
                    </ul>
                    <div className="page-btn">
                        <Link to={route.AddNotice} className="btn btn-added">
                            <PlusCircle className="me-2 iconsize" /> नवीन नोटिस
                        </Link>
                    </div>
                    <div className="page-btn">
                        <Link to={route.AppAdminIndex} className="btn btn-secondary">
                            <ArrowLeft className="me-2" />
                            परत जा
                        </Link>
                    </div>
                </div>
                <div className="card table-list-card">
                    <div className="card-body">
                        <div className="table-responsive">
                            <Table columns={columns} dataSource={Notice} />
                        </div>
                    </div>
                </div>
                {isModalOpen && previewFileUrl && (
                    <div
                        className="modal fade show"
                        tabIndex="-1"
                        style={{
                            display: "block",
                            backdropFilter: "blur(5px)",
                            backgroundColor: "rgba(0,0,0,0.5)",
                        }}
                    >
                        <div className="modal-dialog modal-dialog-centered modal-lg">
                            <div className="modal-content shadow-lg rounded-3">
                                <div className="modal-header bg-primary text-white border-0">
                                    <h5 className="modal-title">File Preview</h5>
                                    <button
                                        type="button"
                                        className="btn-close text-white"
                                        onClick={closePreviewModal}
                                    ></button>
                                </div>
                                <div className="modal-body p-4">
                                    {previewFileUrl.endsWith(".pdf") ? (
                                        <iframe
                                            src={previewFileUrl}
                                            title="PDF Preview"
                                            className="img-fluid rounded-3 shadow-sm"
                                            style={{ width: "100%", height: "500px" }}
                                        />
                                    ) : (
                                        <img
                                            src={previewFileUrl}
                                            alt="Preview"
                                            className="img-fluid rounded-3 shadow-sm"
                                        />
                                    )}
                                </div>
                                <div className="modal-footer border-0 bg-light">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={closePreviewModal}
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <Brand />
            </div>
        </div>
    );
};

export default Notice;