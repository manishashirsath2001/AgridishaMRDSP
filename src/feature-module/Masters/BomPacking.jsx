import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import ImageWithBasePath from "../../core/img/imagewithbasebath";
import Brand from "../../core/modals/inventory/brand";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { all_routes } from "../../Router/all_routes";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import Table from "../../core/pagination/datatable";
import { setToogleHeader } from "../../core/redux/action";
import { baseUrl } from "../../core/json/custom";
import axios from "axios";
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";


import {
    ArrowLeft,
    ChevronUp,
    Edit,
    PlusCircle,
    RotateCcw,
    Trash2,
} from "feather-icons-react/build/IconComponents";
import AddBOMPacking from "./AddBOMPacking";
import { getUserData } from "../../Context/UserData";
const BomPacking = () => {
    const { userdetail } = getUserData();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const data = useSelector((state) => state.toggle_header);
    const route = all_routes;
    const [bompacking, setbompacking] = useState([]);

    const [selectedData, setSelectedData] = useState({ baid: null });

    const generatePDF = (BOMPackingList) => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        doc.setFontSize(12);
        doc.setFont("Helvetica", "bold");
        const title = "BOM Packing Report";
        const titleWidth = doc.getTextWidth(title);

        const borderMargin = 10;
        doc.rect(borderMargin, borderMargin, pageWidth - borderMargin * 2, pageHeight - borderMargin * 2);

        doc.text(title, (pageWidth - titleWidth) / 2, 20);
        doc.setLineWidth(0.5);
        doc.line((pageWidth - titleWidth) / 2, 22, (pageWidth + titleWidth) / 2, 22);

        doc.setFontSize(13);
        doc.setFont("Helvetica", "normal");
        let yPosition = 15;

        const tableColumn = ["Product", "Quantity",];
        const tableRows = BOMPackingList.map((item) => [
            item.productname,
            item.brawproductquantity,


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
            const worksheet = workbook.addWorksheet("BOM Packing Report");

            const headingRow = worksheet.addRow(["BOM Packing Report"]);
            headingRow.getCell(1).font = { bold: true, size: 16 };
            headingRow.getCell(1).alignment = { horizontal: "center", vertical: "middle" };

            worksheet.mergeCells("A1:B1");

            const headers = ["Product", "Quantity",];
            const headerRow = worksheet.addRow(headers);

            headerRow.eachCell((cell) => {
                cell.font = { bold: true, color: { argb: "FFFFFF" } };
                cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "808080" } };
                cell.alignment = { horizontal: "center", vertical: "middle" };
            });

            const columnWidths = [15, 20,]; // Adjust widths as needed
            columnWidths.forEach((width, index) => {
                worksheet.getColumn(index + 1).width = width;
            });

            bompacking.forEach(({ productname, brawproductquantity, }) => {
                const row = worksheet.addRow([productname, brawproductquantity,]);
                row.eachCell((cell) => {
                    cell.alignment = { horizontal: "center", vertical: "middle" };
                });
            });

            const buffer = await workbook.xlsx.writeBuffer();
            const data = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
            saveAs(data, "BOMPackingReport.xlsx");

        } catch (error) {
            console.error("Error generating the Excel file:", error);
        }
    };

    const handleDelete = async (baid) => {
        try {
            const payload = {
                "baid": baid,
                "companyid": userdetail?.companyID || "",
                "deptid": userdetail?.departmentID || "",
            }
            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            axios({
                method: "POST",
                url: baseUrl.Url + "/backend/api/SP_DeleteBOMPacking",
                data: JSON.stringify(payload),
                headers: headers,
            })

            Swal.fire({
                icon: "success",
                title: "Deleted!",
                text: "BOM Packing has been deleted.",
                confirmButtonText: "OK",
            });
            try {

                const payload = {
                    "pkid": "%",
                    "companyid": userdetail?.companyID || "",
                    "deptid": userdetail?.departmentID || "",
                };

                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };

                axios({
                    method: "POST",
                    url: baseUrl.Url + "/backend/api/GET_BOMPacking/getByID",
                    data: JSON.stringify(payload),
                    headers: headers,
                })
                    .then((response) => {
                        const DATA = response.data;
                        setbompacking(DATA);
                    });

            } catch (error) {
                console.error('get data Error:', error);
            }


        } catch (error) {
            console.error("Submission Error:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to save data. Please try again.",
            });
        }

    };
    useEffect(() => {
        try {
            const payload = {
                "pkid": "%",
                "companyid": userdetail?.companyID || "",
                "deptid": userdetail?.departmentID || "",
            }
            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            axios({
                method: "POST",
                url: baseUrl.Url + "/backend/api/GET_BOMPacking",
                data: JSON.stringify(payload),
                headers: headers,
            })
                .then((response) => {
                    if (response.status != 200) throw new Error("Failed to Fetching Data");
                    const DATA = response.data;
                    setbompacking(DATA);
                })

        } catch (error) {
            console.error("Error fetching Access Right Data:", error);
        }
    }, []);

    const OnReloadData = () => {
        try {
            const payload = {
                "pkid": "%",
                "companyid": userdetail?.companyID || "",
                "deptid": userdetail?.departmentID || "",
            }
            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            axios({
                method: "POST",
                url: baseUrl.Url + "/backend/api/GET_BOMPacking",
                data: JSON.stringify(payload),
                headers: headers,
            })
                .then((response) => {
                    if (response.status != 200) throw new Error("Failed to Fetching Data");
                    const DATA = response.data;
                    setbompacking(DATA);
                })

        } catch (error) {
            console.error("Error fetching Access Right Data:", error);
        }
    }

    useEffect(() => {
        const handleShortcut = (e) => {
            if (e.ctrlKey && e.key === 'a') {
                e.preventDefault();
                navigate(route.AddBOMPacking);
            }
            if (e.ctrlKey && e.key === 'e') {
                e.preventDefault();
                navigate(route.MasterIndex);
            }
        };

        window.addEventListener('keydown', handleShortcut);

        return () => {
            window.removeEventListener('keydown', handleShortcut);
        };
    }, [navigate]);


    const columns = [
        {
            title: "Product",
            dataIndex: "productname",
            sorter: (a, b) => a.productname.length - b.productname.length,
            width: 50,
        },
        // {
        //   title: "UOM",
        //   dataIndex: "BRAWPRODUCTQUANTITYUOM",
        //   sorter: (a, b) => a.BRAWPRODUCTQUANTITYUOM.length - b.BRAWPRODUCTQUANTITYUOM.length,
        // },
        // {
        //   title: "Packing",
        //   dataIndex: "BOMPACKING",
        //   sorter: (a, b) => a.BOMPACKING.length - b.BOMPACKING.length,
        // },
        {
            title: "Quantity",
            dataIndex: "brawproductquantity",
            sorter: (a, b) => a.brawproductquantity.length - b.brawproductquantity.length,
            width: 80,
            render: (text) => (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id={`tooltip-${text}`}>{text}</Tooltip>}
                >
                    <div style={{ textAlign: "right" }}>{text}</div>
                </OverlayTrigger>
            ),
        },

        {
            title: (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id="types-tooltip">Action</Tooltip>}
                >
                    <div className="text-center">Action</div>
                </OverlayTrigger>
            ),
            dataIndex: "action",
            width: 50, // Adjusted width
            render: (_, record) => (
                <div className="action-table-data">
                    <div className="edit-delete-action">
                        <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip id="edit-tooltip">Edit</Tooltip>}
                        >
                            {/* <a
                                className="me-2 p-2"
                                onClick={() => { onEditClick(record.baid) }}
                            >
                                <Edit className="feather-edit" />
                            </a> */}
                            <Link className="me-2 p-2"
                                to="#"
                                data-bs-toggle="modal"
                                data-bs-target="#AddBOMPacking"
                                onClick={() => openModal(record.baid)}
                            >
                                <Edit className="feather-edit" />
                            </Link>
                        </OverlayTrigger>
                        <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip id="delete-tooltip me-2">Delete</Tooltip>}
                        >
                            <Link
                                className="confirm-text p-2 me-2"
                                to="#"

                                onClick={() => showConfirmationAlert(record.baid)}
                            >
                                <Trash2 className="feather-trash-2" />
                            </Link>
                        </OverlayTrigger>
                        <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip id="delete-tooltip me-2">Next to Proceed</Tooltip>}
                        >
                            <Link className="me-2 p-2" to="#" data-bs-toggle="modal" data-bs-target="#AddBOMPacking" style={{ color: 'green' }}>
                                <i data-feather="arrow-right-circle" className="feather-arrow-right-circle"></i>
                            </Link>
                        </OverlayTrigger>
                    </div>
                </div>
            ),
        },
    ];

    const openModal = (baid) => {
        setSelectedData({ baid });
        // setModalShow(true);
    };

    const MySwal = withReactContent(Swal);
    const showConfirmationAlert = (baid) => {
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
                handleDelete(baid)
            } else {
                MySwal.close();
            }
        });
    };


    // Empty data source
    // const dataSource = [];
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

    return (
        <div className="page-wrapper">
            <div className="content">
                <div className="page-header">
                    <div className="add-item d-flex">
                        <div className="page-title">
                            <h3>Add BOM Packing</h3>
                            <h6>Manage Bom Packing</h6>
                        </div>
                    </div>
                    <ul className="table-top-head">
                        <li>
                            <OverlayTrigger placement="top" overlay={renderTooltip}>
                                <li>
                                    <OverlayTrigger placement="top" overlay={renderTooltip}>
                                        <Link onClick={() => generatePDF(bompacking)}>
                                            <ImageWithBasePath src="assets/img/icons/pdf.svg" alt="Download PDF" />
                                        </Link>
                                    </OverlayTrigger>
                                </li>

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
                                <Link data-bs-toggle="tooltip" data-bs-placement="top" onClick={OnReloadData}>
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
                            className="btn btn-added"
                            data-bs-toggle="modal"
                            data-bs-target="#AddBOMPacking"
                        >
                            <PlusCircle className="me-2 iconsize" /> Add BOM Packing
                        </button>
                    </div>
                    <div className="page-btn">
                        <Link to={route.MasterIndex} className="btn btn-secondary">
                            <ArrowLeft className="me-2" />
                            Back to Index
                        </Link>
                    </div>
                </div>
                <div className="card table-list-card">
                    <div className="card-body">
                        <div className="table-responsive">
                            <Table columns={columns} dataSource={bompacking} />
                        </div>
                    </div>
                </div>
                <Brand />
            </div>

            <AddBOMPacking
                BAID={selectedData.baid} />
        </div>
    );
};

export default BomPacking;
