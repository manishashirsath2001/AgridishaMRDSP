
import React, { useState, useEffect } from 'react';
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
import axios from 'axios';
import { baseUrl } from "../../core/json/custom";
import {
    ArrowLeft,
    ChevronUp,
    Edit,
    PlusCircle,
    RotateCcw,
    Trash2,
} from "feather-icons-react/build/IconComponents";
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import marathiFontBase64 from "../../style/fonts/NotoSansDevanagari";
import { saveAs } from 'file-saver';
import ExcelJS from "exceljs";
import AddCashInvertModel from "../FinanceAccounts/AddCashInvertModel";
import { getUserData } from '../../Context/UserData';
const CashInvert = () => {
    const dispatch = useDispatch();
    const data = useSelector((state) => state.toggle_header);
    const route = all_routes;
    const navigate = useNavigate();
    const { userdetail } = getUserData();
    const [selectdata, setselectdata] = useState({ CASID: null });
    const onEditClick = (casid) => {
        setselectdata({ CASID: casid });
    };
    const columns = [
        // {
        //   title: "Product",
        //   dataIndex: "product",
        //   render: (text, record) => (
        //     <span className="productimgname">
        //       <Link to="/profile" className="product-img stock-img">
        //         <ImageWithBasePath alt="" src={record.productImage} />
        //       </Link>
        //       <Link to="/profile">{text}</Link>
        //     </span>
        //   ),
        //   sorter: (a, b) => a.product.length - b.product.length,
        // },
        // {
        //   title: "SKU",
        //   dataIndex: "sku",
        //   sorter: (a, b) => a.sku.length - b.sku.length,
        // },
        {
            title: "तारीख",
            dataIndex: "casdate",

            // sorter: (a, b) => a.category.length - b.category.length,
        },
        // {
        //     title: "खाते क्रमांक",
        //     dataIndex: "baccoutname",

        //     // sorter: (a, b) => a.brand.length - b.brand.length,
        // },

        // {
        //     title: "IFSC कोड",
        //     dataIndex: "bifsccode",

        //     // sorter: (a, b) => a.brand.length - b.brand.length,
        // },

        {
            title: "बँकेचे नाव",
            dataIndex: "cbankname",

            // sorter: (a, b) => a.price.length - b.price.length,
        },
        {
            title: "नोटांची रक्कम",
            dataIndex: "casinvertcash",

            // sorter: (a, b) => a.unit.length - b.unit.length,
        },


        {
            title: (
                <div className="d-flex justify-content-center">
                    <OverlayTrigger placement="top" overlay={<Tooltip id="action-tooltip">कृती</Tooltip>}>
                        <span>कृती</span>
                    </OverlayTrigger>
                </div>
            ),
            dataIndex: "action",
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
                                data-bs-target="#AddCashInvert"
                                onClick={() => { onEditClick(record.casid) }}
                            >
                                <Edit className="feather-edit" />
                            </Link>

                        </OverlayTrigger>

                        {/* <OverlayTrigger placement="top" overlay={<Tooltip id="edit-tooltip">Edit</Tooltip>}>
                            <a className="me-2 p-2" onClick={() => { onEditClick(record.casid) }}>
                                <Edit className="feather-edit" />
                            </a>
                        </OverlayTrigger> */}
                        <OverlayTrigger placement="top" overlay={<Tooltip id="delete-tooltip">Delete</Tooltip>}>
                            <Link
                                className="confirm-text p-2"
                                to="#"
                                onClick={() => showConfirmationAlert(record.casid)}
                            >
                                <Trash2 className="feather-trash-2" />
                            </Link>
                        </OverlayTrigger>
                    </div>
                </div>

            ),
            // sorter: (a, b) => a.createdby.length - b.createdby.length,
        },
    ];

    const MySwal = withReactContent(Swal);

    const showConfirmationAlert = (casid) => {
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
                // MySwal.fire({
                //     title: "Deleted!",
                //     text: "Your file has been deleted.",
                //     className: "btn btn-success",
                //     confirmButtonText: "OK",
                //     customClass: {
                //         confirmButton: "btn btn-success",
                //     },
                // });
                OndeleteCashInvert(casid);
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


    useEffect(() => {
        const handleShortcut = (e) => {
            if (e.ctrlKey && e.key === 'a') {
                e.preventDefault();
                document.querySelector('[data-bs-target="#AddCashInvert"]').click();
            }
            if (e.ctrlKey && e.key === 'e') {
                e.preventDefault();
                navigate(route.CashInvert);
            }
        };

        window.addEventListener('keydown', handleShortcut);

        return () => {
            window.removeEventListener('keydown', handleShortcut);
        };
    }, [navigate]);



    const [CashInvert, setCashInvert] = useState([]);

    useEffect(() => {
        try {
            const payload = {

                "keyword": "%",
                "casid": "%",
                // "companyid": "",
                // "deptid": ""
                companyid: userdetail?.companyID || "",
                deptid: userdetail?.departmentID || "",

            }
            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            axios({
                method: "POST",
                url: baseUrl.Url + "/backend/api/GET_GateCashInvert",
                data: JSON.stringify(payload),
                headers: headers,
            })
                .then((response) => {
                    if (response.status != 200) throw new Error("Failed to Fetching Data");
                    const DATA = response.data;
                    setCashInvert(DATA);
                })

        } catch (error) {
            console.error("Error fetching Access Right Data:", error);
        }
    }, []);

    const OndeleteCashInvert = async (casid) => {
        try {
            const payload = {
                "casid": casid,
                "companyid": "",
                "deptid": "",

            }
            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            axios({
                method: "POST",
                url: baseUrl.Url + "/backend/api/SP_DeleteCashInvert",
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

                            "keyword": "%",
                            "casid": "%",
                            "companyid": "",
                            "deptid": ""

                        }
                        const headers = {
                            "Content-Type": "application/json",
                            Accept: "*/*",
                        };

                        axios({
                            method: "POST",
                            url: baseUrl.Url + "/backend/api/GET_GateCashInvert",
                            data: JSON.stringify(payload),
                            headers: headers,
                        })
                            .then((response) => {
                                if (response.status != 200) throw new Error("Failed to Fetching Data");
                                const DATA = response.data;
                                setCashInvert(DATA);
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
                "casid": "%",
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
                url: baseUrl.Url + "/backend/api/GET_GateCashInvert/_Search",
                data: JSON.stringify(payload),
                headers: headers,
            })

                .then((response) => {
                    if (response.status != 200) throw new Error("Failed to send otp");
                    console.log("response", response.data);
                    setCashInvert(response.data);
                })
        } catch (error) {
            console.error("Error while searching Gate Entry data:", error);
        }
    };


    const generatePDF = (CashInvert) => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        doc.setFontSize(12);
        doc.setFont("Helvetica", "bold");
        const title = "Transaction Report"; // Customize the title as needed
        const titleWidth = doc.getTextWidth(title);

        const borderMargin = 10;
        doc.rect(borderMargin, borderMargin, pageWidth - borderMargin * 2, pageHeight - borderMargin * 2);

        doc.text(title, (pageWidth - titleWidth) / 2, 20);
        doc.setLineWidth(0.5);
        doc.line((pageWidth - titleWidth) / 2, 22, (pageWidth + titleWidth) / 2, 22);

        doc.setFontSize(13);
        doc.setFont("Helvetica", "normal");
        let yPosition = 25;

        // Define table headers and map data
        const tableColumn = [
            "Date",
            "Bank Name",
            "Invert Cash Amount",
            "Action"
        ];

        const tableRows = CashInvert.map((item) => [
            item.casdate,
            item.cbankname,
            item.casinvertcash,
            item.action ? 'Edit / Delete' : '', // Adjust this as needed
        ]);


        const totalRow = [
            { content: "", colSpan: 3 }, // Merge first three columns for summary
            { content: "Total", styles: { fontStyle: "bold" } },
            { content: "", styles: { fontStyle: "bold" } }, // Placeholder for any action summary if needed
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

        doc.save("TransactionReport.pdf");
    };

    const exportToExcel = async () => {
        try {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("नोटांची उलटफेर अहवाल");

            const headingRow = worksheet.addRow(["नोटांची उलटफेर अहवाल"]);
            headingRow.getCell(1).font = { bold: true, size: 16 };
            headingRow.getCell(1).alignment = { horizontal: "center", vertical: "middle" };
            worksheet.mergeCells("A1:C1");

            const headers = ["तारीख", "बँकेचे नाव", "नोटांची रक्कम"];
            const headerRow = worksheet.addRow(headers);

            headerRow.eachCell((cell) => {
                cell.font = { bold: true, color: { argb: "FFFFFF" } };
                cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "808080" } };
                cell.alignment = { horizontal: "center", vertical: "middle" };
            });

            const columnWidths = [20, 20, 20];
            columnWidths.forEach((width, index) => {
                worksheet.getColumn(index + 1).width = width;
            });

            CashInvert.forEach(({ casdate, cbankname, casinvertcash }) => {
                const row = worksheet.addRow([casdate, cbankname, casinvertcash]);
                row.eachCell((cell) => {
                    cell.alignment = { horizontal: "center", vertical: "middle" };
                });
            });

            const buffer = await workbook.xlsx.writeBuffer();
            const data = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
            saveAs(data, "CashInvert Report.xlsx");

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
                            <h3>नोटांची उलटफेर</h3>
                        </div>
                    </div>
                    <ul className="table-top-head">
                        <li>
                            <OverlayTrigger placement="top" overlay={renderTooltip}>
                                <Link onClick={() => generatePDF(CashInvert)}>
                                    <ImageWithBasePath src="assets/img/icons/pdf.svg" alt="img" />
                                </Link>
                            </OverlayTrigger>
                        </li>
                        <li>
                            <OverlayTrigger placement="top" overlay={renderExcelTooltip}  >
                                <Link data-bs-toggle="tooltip" data-bs-placement="top" onClick={exportToExcel} >
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
                        <Link
                            to="#"
                            className="btn btn-added"
                            data-bs-toggle="modal"
                            data-bs-target="#AddCashInvert"
                        >
                            <PlusCircle className="me-2" />
                            नवीन
                        </Link>
                    </div>
                    <div className="page-btn">
                        <Link to={route.FinanceIndex} className="btn btn-secondary">
                            <ArrowLeft className="me-2" />
                            Back to Index
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



                <div className="card table-list-card">
                    <div className="card-body">
                        <div className="table-responsive">
                            <Table columns={columns} dataSource={CashInvert} />
                        </div>
                    </div>
                </div>

                <AddCashInvertModel CASID={selectdata.CASID} />

                <Brand />
            </div>
        </div>
    );
};

export default CashInvert;

