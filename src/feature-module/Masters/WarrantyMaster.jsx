import React, { useState, useEffect } from 'react';
import ImageWithBasePath from "../../core/img/imagewithbasebath";
import { Link, useNavigate } from "react-router-dom";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

import {
    ChevronUp,
    PlusCircle,
    Edit,
    Trash2,
    RotateCcw,
} from "feather-icons-react/build/IconComponents";

import { useDispatch, useSelector } from "react-redux";
import { setToogleHeader } from "../../core/redux/action";
import AddWarrenty from "../../core/modals/inventory/AddWarrenty";
// import EditWarrenty from "../../core/modals/inventory/EditWarrenty";
// import Select from "react-select";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import Table from "../../core/pagination/datatable";
import { baseUrl } from "../../core/json/custom";
import axios from 'axios';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
// import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import ExcelJS from "exceljs";




const WarrantyMaster = () => {
    const [selectedData, setSelectedData] = useState({ wartid: null });
    const openModal = (wartid) => {
        setSelectedData({ wartid })
    }

    const navigate = useNavigate();
    // const dataSource = useSelector((state) => state.warranty_data);
    const dispatch = useDispatch();
    const data = useSelector((state) => state.toggle_header);


    const [Warranty, setWarranty] = useState([]);


    useEffect(() => {
        try {
            const payload = {
                "wartid": "%",
                "keyword": "%",
                "companyid": "",
                "deptid": ""
            }
            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            axios({
                method: "POST",
                url: baseUrl.Url + "/backend/api/GET_Warranty",
                data: JSON.stringify(payload),
                headers: headers,
            })
                .then((response) => {
                    if (response.status != 200) throw new Error("Failed to Fetching Data");
                    const DATA = response.data;
                    setWarranty(DATA);
                })

        } catch (error) {
            console.error("Error fetching Access Right Data:", error);
        }
    }, []);



    const [searchQuery, setSearchQuery] = useState("");
    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
        try {
            const payload = {
                "wartid": "%",
                "keyword": event.target.value,
                "companyid": "",
                "deptid": ""
            }
            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            axios({
                method: "POST",
                url: baseUrl.Url + "/backend/api/GET_Warranty/_Search",
                data: JSON.stringify(payload),
                headers: headers,
            })

                .then((response) => {
                    if (response.status != 200) throw new Error("Failed to send otp"); console.log("response", response.data);
                    setWarranty(response.data);
                })
        } catch (error) {
            console.error("Error while searching WareHouse data:", error);
        }
    };

    const OndeleteWarranty = async (wartid) => {
        try {
            const payload = {
                "wartid": wartid,
                "companyid": "",
                "deptid": "",

            }
            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            axios({
                method: "POST",
                url: baseUrl.Url + "/backend/api/SP_DeleteWarranty",
                data: JSON.stringify(payload),
                headers: headers,
            })
                .then((response) => {
                    if (response.status != 200) throw new Error("Failed to Fetching Data");
                    MySwal.fire({
                        title: response.data[0].responseCode === "FAILURE" ? "हटवणे अनुमत नाही" : "हटवले गेले!",
                        text: response.data[0].responseMessage, // Keep message dynamic as-is
                        icon: response.data[0].responseCode === "FAILURE" ? "error" : "success",
                        confirmButtonText: "ठीक आहे",
                        customClass: {
                            confirmButton: response.data[0].responseCode === "FAILURE" ? "btn btn-danger" : "btn btn-success",
                        },
                        allowOutsideClick: false,
                        allowEscapeKey: false,

                    });
                    try {
                        const payload = {
                            "wartid": "%",
                            "keyword": "%",
                            "companyid": "",
                            "deptid": ""

                        }
                        const headers = {
                            "Content-Type": "application/json",
                            Accept: "*/*",
                        };

                        axios({
                            method: "POST",
                            url: baseUrl.Url + "/backend/api/GET_Warranty",
                            data: JSON.stringify(payload),
                            headers: headers,
                        })
                            .then((response) => {
                                if (response.status != 200) throw new Error("Failed to Fetching Data");
                                const DATA = response.data;
                                setWarranty(DATA);
                            })

                    } catch (error) {
                        console.error("Error fetching Access Right Data:", error);
                    }
                })

        } catch (error) {
            console.error("Error fetching Access Right Data:", error);
        }


    }


    // const [isFilterVisible, setIsFilterVisible] = useState(false);
    // const toggleFilterVisibility = () => {
    //     setIsFilterVisible((prevVisibility) => !prevVisibility);
    // };
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

    const columns = [
        {
            title: "नाव",
            dataIndex: "productname",
            // sorter: (a, b) => a.name.length - b.name.length,
        },
        {
            title: "वर्णन",
            dataIndex: "wartdescription",
            // sorter: (a, b) => a.description.length - b.description.length,
        },
        {
            title: "कालावधी",
            dataIndex: "wartduration",
            // sorter: (a, b) => a.duration.length - b.duration.length,
        },
        {
            title: "स्थिती",
            dataIndex: "wartstatus",
            render: (text) => (
                <span className="badge badge-linesuccess">
                    <Link to="#"> {text}</Link>
                </span>
            ),
            // sorter: (a, b) => a.status.length - b.status.length,
        },
        {
            title: "क्रिया",
            dataIndex: "actions",
            key: "actions",
            render: (_, record) => (
                <div className="action-table-data">
                    <div className="edit-delete-action">
                        <Link
                            className="me-2 p-2"
                            to="#"
                            data-bs-toggle="modal"
                            onClick={() => openModal(record.wartid)}
                            data-bs-target="#add-units"
                        >
                            <Edit className="feather-edit" />
                        </Link>
                        <Link
                            className="confirm-text p-2"
                            to="#"
                            onClick={() => showConfirmationAlert(record.wartid)}
                        >
                            <Trash2 className="feather-trash-2" />
                        </Link>
                    </div>
                </div>
            ),
        },
    ];

    const MySwal = withReactContent(Swal);


    const generatePDF = (Warranty) => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        doc.setFontSize(12);
        doc.setFont("Helvetica", "bold");
        const title = "Warranty Report";
        const titleWidth = doc.getTextWidth(title);

        const borderMargin = 10;
        doc.rect(borderMargin, borderMargin, pageWidth - borderMargin * 2, pageHeight - borderMargin * 2);

        doc.text(title, (pageWidth - titleWidth) / 2, 20);
        doc.setLineWidth(0.5);
        doc.line((pageWidth - titleWidth) / 2, 22, (pageWidth + titleWidth) / 2, 22);

        doc.setFontSize(13);
        doc.setFont("Helvetica", "normal");
        let yPosition = 15;

        const tableColumn = ["Name", "Description", "Duration", "Status"];
        const tableRows = Warranty.map((item) => [
            item.pname,
            item.wartdescription,
            item.wartduration,
            item.wartstatus,


        ]);

        let totalsqmnamt = Warranty.reduce((sum, item) => sum + parseFloat(item.sqmnamt || 0), 0);

        const totalRow = [
            { content: "", colSpan: 3 },
            { content: "Total", styles: { fontStyle: "bold" } },
            { content: totalsqmnamt.toFixed(2), styles: { fontStyle: "bold" } },

        ];

        autoTable(doc, {
            startY: yPosition + 10,
            head: [tableColumn],
            body: [...tableRows, totalRow],
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
            const worksheet = workbook.addWorksheet("Warranty Report");


            const headingRow = worksheet.addRow(["Warranty Report"]);
            headingRow.getCell(1).font = { bold: true, size: 16 };
            headingRow.getCell(1).alignment = { horizontal: "center", vertical: "middle" };

            worksheet.mergeCells("A1:D1");

            const headers = ["Name", "Description", "Duration", "Status"];
            const headerRow = worksheet.addRow(headers);

            headerRow.eachCell((cell) => {
                cell.font = { bold: true, color: { argb: "FFFFFF" } };
                cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "808080" } };
                cell.alignment = { horizontal: "center", vertical: "middle" };
            });

            const columnWidths = [40, 40, 40];
            columnWidths.forEach((width, index) => {
                worksheet.getColumn(index + 1).width = width;
            });

            Warranty.forEach(({ pname, wartdescription, wartduration, wartstatus }) => {
                const row = worksheet.addRow([pname, wartdescription, wartduration, wartstatus]);
                row.eachCell((cell) => {
                    cell.alignment = { horizontal: "center", vertical: "middle" };
                });
            });

            const buffer = await workbook.xlsx.writeBuffer();
            const data = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
            saveAs(data, "Warranty.xlsx");

        } catch (error) {
            console.error("Error generating the Excel file:", error);
        }
    };


    const showConfirmationAlert = (wartid) => {
        MySwal.fire({
            title: "तुम्हाला खात्री आहे का?",
            text: "तुम्ही हे पूर्ववत करू शकणार नाही!",
            showCancelButton: true,
            confirmButtonColor: "#00ff00",
            confirmButtonText: "होय, हटवा!",
            cancelButtonColor: "#ff0000",
            cancelButtonText: "रद्द करा",
            allowOutsideClick: false,
            allowEscapeKey: false,

        }).then((result) => {
            if (result.isConfirmed) {
                OndeleteWarranty(wartid);
            } else {
                MySwal.close();
            }
        });
    };

    useEffect(() => {
        const handleShortcut = (e) => {

            if (e.ctrlKey && (e.key === "a" || e.key === "A")) {
                e.preventDefault();
                const modalTrigger = document.querySelector('[data-bs-target="#add-units"]');
                if (modalTrigger) {
                    modalTrigger.click();
                }
            }
            if (e.ctrlKey && (e.key === 'e' || e.key === 'E')) {
                e.preventDefault();
                navigate("/Test");
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
                            <h4>वॉरंटी</h4>
                            <h6>तुमच्या वॉरंटीचे व्यवस्थापन करा</h6>

                        </div>
                    </div>
                    <ul className="table-top-head">
                        <li>
                            <OverlayTrigger placement="top" overlay={renderTooltip}>
                                <Link onClick={() => generatePDF(Warranty)}>
                                    <ImageWithBasePath src="assets/img/icons/pdf.svg" alt="Download PDF" />
                                </Link>
                            </OverlayTrigger>
                        </li>
                        <li>
                            <OverlayTrigger placement="top" overlay={renderExcelTooltip}>
                                <Link onClick={() => exportToExcel(Warranty)}>
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
                                    onClick={() => {
                                        dispatch(setToogleHeader(!data));
                                    }}
                                >
                                    <ChevronUp />
                                </Link>
                            </OverlayTrigger>
                        </li>
                    </ul>
                    <div className="page-btn">
                        <a
                            to="#"
                            className="btn btn-added"
                            data-bs-toggle="modal"
                            data-bs-target="#add-units"
                        >
                            <PlusCircle className="me-2" />
                            वॉरंटी नोंदवा
                        </a>
                    </div>
                </div>

                {/* /product list */}
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


                        {/* /Filter */}
                        <div className="table-responsive">
                            <Table columns={columns} dataSource={Warranty} />
                        </div>
                    </div>
                </div>
                {/* /product list */}
            </div>
            <AddWarrenty WARTID={selectedData.wartid} />

        </div>
    );
};

export default WarrantyMaster;

