import React, { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { Link } from "react-router-dom";
import ImageWithBasePath from "../../core/img/imagewithbasebath";
import Brand from "../../core/modals/inventory/brand";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { all_routes } from "../../Router/all_routes";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import Table from "../../core/pagination/datatable";
import { setToogleHeader } from "../../core/redux/action";
import axios from 'axios';
import { baseUrl } from "../../core/json/custom";
// import AddCustomer from "./AddCustomer";
import { Link, useNavigate } from "react-router-dom";
import marathiFontBase64 from "../../style/fonts/NotoSansDevanagari";
import { saveAs } from 'file-saver';
import ExcelJS from "exceljs";
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

import {
    ArrowLeft,
    ChevronUp,
    Edit,
    Eye,

    PlusCircle,
    RotateCcw,


    Trash2,
} from "feather-icons-react/build/IconComponents";

const CropPlot = () => {
    const dispatch = useDispatch();
    const data = useSelector((state) => state.toggle_header);
    const route = all_routes;
    const [PlotDetails, setPlotDetails] = useState([]);
    const navigate = useNavigate();
    const onEditClick = (pltaid) => {
        navigate(route.AddCropPlot, { state: { pltaid: pltaid } });
    };
    const [plotList, setPlotList] = useState([]);
    const columns = [
        {
            title: "शेतकरी",
            dataIndex: "farmername",

            // render: (text, record) => (
            //   <span className="productimgname">
            //     <Link to="/profile" className="product-img stock-img">
            //       <ImageWithBasePath alt="" src={record.productImage} />
            //     </Link>
            //     <Link to="/profile">{text}</Link>
            //   </span>
            // ),
            sorter: (a, b) => a.farmername.length - b.farmername.length,
        },

        {
            title: "नोंदणी तारीख",
            dataIndex: "regdate",
            sorter: (a, b) => a.regdate.length - b.regdate.length,
        },
        // {
        //   title: "Brand",
        //   dataIndex: "brand",
        //   sorter: (a, b) => a.brand.length - b.brand.length,
        // },
        // {
        //   title: "Price",
        //   dataIndex: "price",
        //   sorter: (a, b) => a.price.length - b.price.length,
        // },
        // {
        //   title: "Unit",
        //   dataIndex: "unit",
        //   sorter: (a, b) => a.unit.length - b.unit.length,
        // },
        // {
        //   title: "Qty",
        //   dataIndex: "qty",
        //   sorter: (a, b) => a.qty.length - b.qty.length,
        // },
        // {
        //   title: "Created By",
        //   dataIndex: "createdby",
        //   render: (text, record) => (
        //     <span className="userimgname">
        //       <Link to="/profile" className="product-img">
        //         <ImageWithBasePath alt="" src={record.img} />
        //       </Link>
        //       <Link to="/profile">{text}</Link>
        //     </span>
        //   ),
        //   sorter: (a, b) => a.createdby.length - b.createdby.length,
        // },
        {
            title: "कृती",
            dataIndex: "action",
            render: (_, record) => (
                <div className="action-table-data">
                    <div className="edit-delete-action">
                        <OverlayTrigger placement="top" overlay={<Tooltip id="edit-tooltip">Edit</Tooltip>}>
                            <a className="me-2 p-2" onClick={() => { onEditClick(record.pltaid) }}>
                                <Edit className="feather-edit" />
                            </a>
                        </OverlayTrigger>
                        <OverlayTrigger placement="top" overlay={<Tooltip id="delete-tooltip">Delete</Tooltip>}>
                            <Link
                                className="confirm-text p-2"
                                to="#"
                                onClick={() => showConfirmationAlert(record.pltaid)}
                            >
                                <Trash2 className="feather-trash-2" />
                            </Link>
                        </OverlayTrigger>
                        {/* <OverlayTrigger
                placement="top"
                overlay={<Tooltip id="approve-tooltip">Proceed </Tooltip>}
            >
                <Link className="me-2 p-2" to="#" data-bs-toggle="modal" data-bs-target="#AddSaleQuotation" style={{ color: 'green' }}>
                    <i data-feather="arrow-right-circle" className="feather-arrow-right-circle"></i>
                </Link>
            </OverlayTrigger> */}
                    </div>
                </div>
            ),
            sorter: (a, b) => a.createdby.length - b.createdby.length,
        },
    ];

    const MySwal = withReactContent(Swal);

    const showConfirmationAlert = (pltaid) => {
        MySwal.fire({
            title: "तुम्हाला खात्री आहे का?",
            text: "तुम्ही हे बदलू शकणार नाही!",
            showCancelButton: true,
            confirmButtonColor: "#00ff00",
            confirmButtonText: "हो, ते हटवा!",
            cancelButtonColor: "#ff0000",
            cancelButtonText: "रद्द करा",
        }).then((result) => {
            if (result.isConfirmed) {
                OndeletePlotDetails(pltaid);
            } else {
                MySwal.close();
            }
        });
    };


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
    //get data
    useEffect(() => {
        try {
            const payload = {
                "pltaid": "%",
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
                url: baseUrl.Url + "/backend/api/GET_PlotMaster",
                data: JSON.stringify(payload),
                headers: headers,
            })
                .then((response) => {
                    if (response.status != 200) throw new Error("Failed to Fetching Data");
                    const DATA = response.data;
                    setPlotList(DATA);
                })

        } catch (error) {
            console.error("Error fetching Access Right Data:", error);
        }
    }, []);
    //delete
    const OndeletePlotDetails = async (pltaid) => {
        try {
            const payload = {
                "pltaid": pltaid,
                "companyid": "",
                "deptid": "",

            }
            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            axios({
                method: "POST",
                url: baseUrl.Url + "/backend/api/SP_DeletePlotMaster",
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
                            "pltaid": "%",
                            "keyword": "%",
                            "companyid": "",
                            "deptid": "",

                        }
                        const headers = {
                            "Content-Type": "application/json",
                            Accept: "*/*",
                        };

                        axios({
                            method: "POST",
                            url: baseUrl.Url + "/backend/api/GET_PlotMaster",
                            data: JSON.stringify(payload),
                            headers: headers,
                        })
                            .then((response) => {
                                if (response.status != 200) throw new Error("Failed to Fetching Data");
                                const DATA = response.data;
                                setPlotDetails(DATA);
                            })

                    } catch (error) {
                        console.error("Error fetching Access Right Data:", error);
                    }
                })

        } catch (error) {
            console.error("Error fetching Access Right Data:", error);
        }

    }
    useEffect(() => {
        const handleShortcut = (e) => {
            if (e.ctrlKey && e.key.toLowerCase() === "a") {
                e.preventDefault();
                navigate(route.AddCropPlot); // Navigate to the AdCustomer page
            }
            if (e.ctrlKey && e.key === 'e') {
                e.preventDefault();
                navigate(route.MasterIndex);
            }

        };

        window.addEventListener("keydown", handleShortcut);

        return () => {
            window.removeEventListener("keydown", handleShortcut);
        };
    }, [navigate]);

    // const generatePDF = (PlotDetails) => {
    //     const doc = new jsPDF();
    //     const pageWidth = doc.internal.pageSize.getWidth();

    //     const cleanBase64 = marathiFontBase64.replace(/^data:font\/ttf;base64,/, "");

    //     doc.addFileToVFS("NotoSansDevanagari.ttf", cleanBase64);
    //     doc.addFont("NotoSansDevanagari.ttf", "NotoSansDevanagari", "normal");
    //     doc.setFont("NotoSansDevanagari", "normal");
    //     doc.setFontSize(16);

    //     console.log(doc.getFontList());

    //     const title = " प्लॉट तपशील अहवाल";
    //     doc.text(title, (pageWidth - doc.getTextWidth(title)) / 2, 20);

    //     const tableColumn = [["शेतकरी", "नोंदणी तारीख"]];

    //     const tableRows = PlotDetails.map((item) => [
    //         item.farmername,
    //         item.regdate

    //     ]);

    //     autoTable(doc, {
    //         startY: 30,
    //         head: tableColumn,
    //         body: tableRows,
    //         styles: { font: "NotoSansDevanagari", fontStyle: "normal", fontSize: 12 },
    //         headStyles: { fontStyle: "normal", fillColor: [0, 102, 204], textColor: 255, fontSize: 14 },
    //         alternateRowStyles: { fillColor: [240, 240, 240] },
    //     });

    //     window.open(doc.output("bloburl"), "_blank");
    // };
    useEffect(() => {
        setPlotDetails(plotList);
    }, [plotList]);
    const generatePDF = (PlotDetails) => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();

        const cleanBase64 = marathiFontBase64.replace(/^data:font\/ttf;base64,/, "");

        doc.addFileToVFS("NotoSansDevanagari.ttf", cleanBase64);
        doc.addFont("NotoSansDevanagari.ttf", "NotoSansDevanagari", "normal");
        doc.setFont("NotoSansDevanagari", "normal");
        doc.setFontSize(16);

        console.log(doc.getFontList());

        const title = " प्लॉट तपशील अहवाल";
        doc.text(title, (pageWidth - doc.getTextWidth(title)) / 2, 20);

        const tableColumn = [["शेतकरी", "नोंदणी तारीख"]];

        const tableRows = PlotDetails.map((item) => [
            item.farmername,
            item.regdate

        ]);

        autoTable(doc, {
            startY: 30,
            head: tableColumn,
            body: tableRows,
            styles: { font: "NotoSansDevanagari", fontStyle: "normal", fontSize: 12 },
            headStyles: { fontStyle: "normal", fillColor: [0, 102, 204], textColor: 255, fontSize: 14 },
            alternateRowStyles: { fillColor: [240, 240, 240] },
            columnStyles: {
                0: {
                    font: "normal", // Marathi font for "नाव"
                    fontSize: 12
                },
                1: {
                    font: "normal", // Marathi font for "तारीख"
                    fontSize: 12
                },
                2: {
                    font: "normal", // Marathi font for "तक्रारीचे शीर्षक"
                    fontSize: 12
                }
            }
        });

        window.open(doc.output("bloburl"), "_blank");
    };

    const exportToExcel = async () => {
        try {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("Plot Details Report");

            const headingRow = worksheet.addRow(["Plot Details Report"]);
            headingRow.getCell(1).font = { bold: true, size: 16 };
            headingRow.getCell(1).alignment = { horizontal: "center", vertical: "middle" };

            worksheet.mergeCells("A1:B1");

            const headers = ["शेतकरी", "नोंदणी तारीख"];
            const headerRow = worksheet.addRow(headers);

            headerRow.eachCell((cell) => {
                cell.font = { bold: true, color: { argb: "FFFFFF" } };
                cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "808080" } };
                cell.alignment = { horizontal: "center", vertical: "middle" };
            });

            const columnWidths = [15, 20, 25,];
            columnWidths.forEach((width, index) => {
                worksheet.getColumn(index + 1).width = width;
            });

            PlotDetails.forEach(({ farmername, regdate }) => {
                const row = worksheet.addRow([farmername, regdate]);
                row.eachCell((cell) => {
                    cell.alignment = { horizontal: "center", vertical: "middle" };
                });
            });

            const buffer = await workbook.xlsx.writeBuffer();
            const data = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
            saveAs(data, "PlotDetails Report.xlsx");
            console.log(marathiFontBase64);

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
                            <h3>पीक माहिती</h3>
                            <h6>पीक माहिती</h6>
                        </div>
                    </div>
                    <ul className="table-top-head">
                        <li>
                            <OverlayTrigger placement="top" overlay={renderTooltip}>
                                <Link to="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        generatePDF(PlotDetails);
                                    }}>
                                    <ImageWithBasePath src="assets/img/icons/pdf.svg" alt="img" />
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
                        <Link to={route.AddCropPlot} className="btn btn-added">
                            <PlusCircle className="me-2 iconsize" />पीक नोंदवा
                        </Link>
                    </div>
                    <div className="page-btn">
                        <Link to={route.FarmerIndex} className="btn btn-secondary">
                            <ArrowLeft className="me-2" />
                            मागे
                        </Link>
                    </div>
                </div>

                <div className="card table-list-card">
                    <div className="card-body">
                        <div className="table-responsive">
                            <Table columns={columns} dataSource={PlotDetails} />
                        </div>
                    </div>
                </div>

                <Brand />
            </div>

        </div>
    );
};

export default CropPlot;

