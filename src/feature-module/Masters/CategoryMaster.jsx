import React, { useState, useEffect } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import ImageWithBasePath from "../../core/img/imagewithbasebath";
import { Link } from "react-router-dom";
import {
    ChevronUp,
    PlusCircle,
    RotateCcw,
    Trash2,
    Edit,
    ArrowLeft
} from "feather-icons-react/build/IconComponents";
import AddCategoryList from "../../core/modals/inventory/addcategorylist";
import { baseUrl } from "../../core/json/custom";
import { getUserData } from "../../Context/UserData";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import Table from "../../core/pagination/datatable";
import axios from "axios";
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { all_routes } from "../../Router/all_routes";

const CategoryMaster = () => {
    const { userdetail } = getUserData();
    const [categories, setCategory] = useState([]);
    const [selectedData, setSelectedData] = useState({ ctaid: null });
    const MySwal = withReactContent(Swal);
    const route = all_routes;
    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const payload = {
                    "ctaid": "%",
                    "cttype": "1",
                    companyid: userdetail?.companyID || "",
                    deptid: userdetail?.departmentID || "",

                }
                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };

                axios({
                    method: "POST",
                    url: baseUrl.Url + "/backend/api/GET_CategoryMasterData",
                    data: JSON.stringify(payload),
                    headers: headers,
                })
                    .then((response) => {
                        if (response.status != 200) throw new Error("Failed to Fetching Data");
                        const DATA = response.data;
                        setCategory(DATA);
                    })

            } catch (error) {
                console.error("Error fetching Access Right Data:", error);
            }
        }

        fetchCategory();

    }, []);

    const showConfirmationAlert = (ctaid) => {
        MySwal.fire({
            title: "आपल्याला खात्री आहे का?",
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
                OndeleteCategories(ctaid);
            } else {
                MySwal.close();
            }
        });
    };


    const OndeleteCategories = async (ctaid) => {
        try {
            const payload = {
                "ctaid": ctaid,
                companyid: userdetail?.companyID || "",
                deptid: userdetail?.departmentID || "",

            }
            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            axios({
                method: "POST",
                url: baseUrl.Url + "/backend/api/SP_DeleteCategoryMaster",
                data: JSON.stringify(payload),
                headers: headers,
            })
                .then((response) => {
                    if (response.status != 200) throw new Error("Failed to Fetching Data");
                    MySwal.fire({
                        title: response.data[0].responseCode === "ERROR"
                            ? "हटवणे परवानगी नाही"
                            : "रेकॉर्ड हटवले गेले!",

                        text: response.data[0].responseMessage,

                        icon: response.data[0].responseCode === "ERROR" ? "error" : "success",

                        confirmButtonText: "ठीक आहे",

                        customClass: {
                            confirmButton: response.data[0].responseCode === "ERROR"
                                ? "btn btn-danger"
                                : "btn btn-success",
                        },

                        allowOutsideClick: false,
                        allowEscapeKey: false,
                    });
                    try {
                        const payload = {
                            "ctaid": "%",
                            "cttype": "1",
                            companyid: userdetail?.companyID || "",
                            deptid: userdetail?.departmentID || "",
                        }
                        const headers = {
                            "Content-Type": "application/json",
                            Accept: "*/*",
                        };

                        axios({
                            method: "POST",
                            url: baseUrl.Url + "/backend/api/GET_CategoryMasterData",
                            data: JSON.stringify(payload),
                            headers: headers,
                        })
                            .then((response) => {
                                if (response.status != 200) throw new Error("Failed to Fetching Data");
                                const DATA = response.data;
                                setCategory(DATA);
                            })

                    } catch (error) {
                        console.error("Error fetching Access Right Data:", error);
                    }
                })

        } catch (error) {
            console.error("Error fetching Access Right Data:", error);
        }

    }



    const openModal = (ctaid) => {
        setSelectedData({ ctaid })
    }

    const generatePDF = (categories) => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();


        doc.setFontSize(12);
        doc.setFont("Helvetica", "bold");
        const title = "  Category Report";
        const titleWidth = doc.getTextWidth(title);

        const borderMargin = 10;
        doc.rect(borderMargin, borderMargin, pageWidth - borderMargin * 2, pageHeight - borderMargin * 2);
        const drawBorder = () => {
            doc.setDrawColor(100, 100, 100);
            doc.rect(borderMargin, borderMargin, pageWidth - borderMargin * 2, pageHeight - borderMargin * 2);
        };
        drawBorder();
        doc.text(title, (pageWidth - titleWidth) / 2, 20);
        doc.setLineWidth(0.5);
        doc.line((pageWidth - titleWidth) / 2, 22, (pageWidth + titleWidth) / 2, 22);

        doc.setFontSize(13);
        doc.setFont("Helvetica", "normal");
        let yPosition = 15;

        const tableColumn = ["Category", "Status"];
        const tableRows = categories.map((item) => [
            item.categoryname,
            item.cstatus ? "Active" : "Inactive",
        ]);

        autoTable(doc, {
            startY: yPosition + 10,
            head: [tableColumn],
            body: [...tableRows],
            theme: 'grid',
            styles: { fontSize: 10, halign: "center", lineColor: [0, 0, 0], lineWidth: 0.20 }, // Dark border lines
            headStyles: { fillColor: [169, 169, 169], textColor: 0, fontStyle: "bold" }, // Gray header
            bodyStyles: { textColor: 0 }, // Black text in table
            didDrawPage: () => {
                drawBorder();
            },

        });
        doc.save("CategoryReport.pdf");
    };


    const exportToExcel = async () => {
        try {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet(" Category");


            const headingRow = worksheet.addRow(["Category"]);
            headingRow.getCell(1).font = { bold: true, size: 16 };
            headingRow.getCell(1).alignment = { horizontal: "center", vertical: "middle" };


            worksheet.mergeCells("A1:B1");


            const headers = ["Category", "Status"];
            const headerRow = worksheet.addRow(headers);

            headerRow.eachCell((cell) => {
                cell.font = { bold: true, color: { argb: "FFFFFF" } };
                cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "808080" } };
                cell.alignment = { horizontal: "center", vertical: "middle" };
            });


            const columnWidths = [15, 20, 25, 30, 18];
            columnWidths.forEach((width, index) => {
                worksheet.getColumn(index + 1).width = width;
            });


            categories.forEach(({ categoryname, cstatus }) => {
                const row = worksheet.addRow([categoryname, cstatus ? "Active" : "Inactive"]);
                row.eachCell((cell) => {
                    cell.alignment = { horizontal: "center", vertical: "middle" };
                });
            });


            const buffer = await workbook.xlsx.writeBuffer();
            const data = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
            saveAs(data, "CategoryReport.xlsx");

        } catch (error) {
            console.error("Error generating the Excel file:", error);
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

    const columns = [
        {
            title: "कॅटेगरी ",
            dataIndex: "categoryname",
            sorter: (a, b) => a.categoryname.length - b.categoryname.length,
        },


        // {
        //   title: "Status",
        //   dataIndex: "cstatus",
        //   render: (text) => (
        //     <span className="badge badge-linesuccess">
        //       <Link to="#"> {text}</Link>
        //     </span>
        //   ),
        //   sorter: (a, b) => a.cstatus.length - b.cstatus.length,
        // },
        {
            title: (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id="types-status">स्टेटस </Tooltip>}
                >
                    <div>Status</div>
                </OverlayTrigger>
            ),
            dataIndex: "cstatus",
            render: (text) => (
                <span className={`badge ${text == true
                    ? "badge-linesuccess" : text == false
                        ? "badge-linedanger" : "badge-warning"}`}>
                    <Link to="#"> {text == true ? "Active" : text == false
                        ? "Inactive" : "Unknown"}
                    </Link>
                </span>

            ),
            sorter: (a, b) => a.cstatus.length - b.cstatus.length,
            width: 200,
        },

        {
            title: "स्थिती ",
            dataIndex: "actions",
            key: "actions",
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
                                data-bs-target="#add-category"
                                onClick={() => openModal(record.ctaid)}
                            >
                                <Edit className="feather-edit" />
                            </Link>

                        </OverlayTrigger>
                        <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip id="delete-tooltip">Delete</Tooltip>}
                        >
                            <Link
                                className="confirm-text me-2 p-2"
                                to="#"
                                onClick={() => showConfirmationAlert(record.ctaid)}

                            >
                                <Trash2 className="feather-trash-2" />
                            </Link>
                        </OverlayTrigger>
                        {/* <Link className="me-2 p-2" to="#" data-bs-toggle="modal" data-bs-target="#AddSaleInvoice" style={{ color: 'green' }}>
                <i data-feather="arrow-right-circle" className="feather-arrow-right-circle"></i>
            </Link> */}
                    </div>
                </div>
            ),
        },
    ];


    return (
        <div>
            <div className="page-wrapper">
                <div className="content">
                    <div className="page-header">
                        <div className="add-item d-flex">
                            <div className="page-title">
                                <h4>कॅटेगरी </h4>
                                <h6>आपल्या कॅटेगरी व्यवस्थापित करा</h6>

                            </div>
                        </div>
                        <ul className="table-top-head">
                            <li>
                                <OverlayTrigger placement="top" overlay={renderTooltip}>
                                    <Link onClick={() => generatePDF(categories)}>
                                        <ImageWithBasePath
                                            src="assets/img/icons/pdf.svg"
                                            alt="img"
                                        />
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
                                    // className={data ? "active" : ""}
                                    // onClick={() => {
                                    //   dispatch(setToogleHeader(!data));
                                    // }}
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
                                data-bs-target="#add-category"
                            >
                                <PlusCircle className="me-2" />
                                नवीन
                            </Link>
                        </div>
                        <div className="page-btn">
                            <Link to={route.MasterIndex} className="btn btn-secondary">
                                <ArrowLeft className="me-2" />
                                मागे
                            </Link>
                        </div>
                    </div>
                    {/* /product list */}
                    <div className="card table-list-card">
                        <div className="card-body">
                            <div className="table-responsive">
                                <Table columns={columns} dataSource={categories} />
                            </div>
                        </div>
                    </div>
                    {/* /product list */}
                </div>
            </div>
            <AddCategoryList CTAID={selectedData.ctaid} />

        </div>
    );
};

export default CategoryMaster;

