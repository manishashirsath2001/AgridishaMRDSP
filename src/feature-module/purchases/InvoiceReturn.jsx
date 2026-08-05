import React, { useEffect, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";
import ImageWithBasePath from "../../core/img/imagewithbasebath";
import { all_routes } from "../../Router/all_routes";
import {
    ChevronUp,
    // Mail,
    RotateCcw,
    // Sliders,
    PlusCircle,
    ArrowLeft,
    Edit,
    Trash2,
} from "feather-icons-react/build/IconComponents";
import { useDispatch, useSelector } from "react-redux";
import { setToogleHeader } from "../../core/redux/action";
// import Select from "react-select";
// import { Filter } from "react-feather";
import EditLowStock from "../../core/modals/inventory/editlowstock";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import Table from "../../core/pagination/datatable";
// import AddPurchases from "../../core/modals/purchases/addpurchases";
import AddPurchaseReturn from "./AddPurchaseReturn";
import { getUserData } from "../../Context/UserData";
import axios from "axios";
import { baseUrl } from "../../core/json/custom";
import EditPurchaseReturn from "./EditPurchaseReturn";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
const InvoiceReturn = () => {
    const { userdetail } = getUserData();
    const dispatch = useDispatch();
    const data = useSelector((state) => state.toggle_header);
    // const dataSource = useSelector((state) => state.lowstock_data);
    const [challanreturndata, setchallanreturndata] = useState();
    const route = all_routes;
    const [searchQuery, setSearchQuery] = useState("");


    // const renderExcelTooltip = (props) => (
    //   <Tooltip id="excel-tooltip" {...props}>
    //     Excel
    //   </Tooltip>
    // );
    const renderPrinterTooltip = (props) => (
        <Tooltip id="printer-tooltip" {...props}>
            Printer
        </Tooltip>
    );
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
    const renderUOMTooltip = (props) => (
        <Tooltip id="refresh-tooltip" {...props}>
            Transaction Number
        </Tooltip>
    );
    const renderQuantityTooltip = (props) => (
        <Tooltip id="refresh-tooltip" {...props}>
            Transaction Date
        </Tooltip>
    );
    // const renderReturnQuantityTooltip = (props) => (
    //   <Tooltip id="refresh-tooltip" {...props}>
    //     Return Quantity
    //   </Tooltip>
    // );

    useEffect(() => {
        if (userdetail) {
            const fetchVendors = async () => {
                try {
                    const payload = {
                        praid: "%",
                        rtype: 1,
                        keyword: "%",
                        companyid: userdetail?.companyID || "",
                        deptid: userdetail?.departmentID || "",
                    };
                    const headers = {
                        "Content-Type": "application/json",
                        Accept: "*/*",
                    };
                    const response = await axios.post(
                        `${baseUrl.Url}/backend/api/GET_PReturnMaster`,
                        payload,
                        { headers }
                    );
                    if (response.status !== 200)
                        throw new Error("Failed to fetch vendor data");
                    console.log("quatation master", response.data)
                    setchallanreturndata(response.data);
                } catch (error) {
                    console.error("Error fetching vendor data:", error);
                }
            };

            fetchVendors();
        }
    }, [userdetail]);

    const OnReloadData = async () => {
        try {
            const payload = {
                praid: "%",
                rtype: 1,
                keyword: "%",
                companyid: userdetail?.companyID || "",
                deptid: userdetail?.departmentID || "",
            };
            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };
            const response = await axios.post(
                `${baseUrl.Url}/backend/api/GET_PReturnMaster`,
                payload,
                { headers }
            );
            if (response.status !== 200)
                throw new Error("Failed to fetch vendor data");
            console.log("quatation master", response.data)
            setchallanreturndata(response.data);
        } catch (error) {
            console.error("Error fetching vendor data:", error);
        }
    }

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
        try {
            const payload = {
                praid: "%",
                rtype: 1,
                "keyword": event.target.value
                , "companyid": userdetail?.companyID ? userdetail.companyID : "",
                "deptid": userdetail?.departmentID ? userdetail.departmentID : "",
            }
            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            axios({
                method: "POST",
                url: baseUrl.Url + "/backend/api/GET_PReturnMaster/Keyword",
                data: JSON.stringify(payload),
                headers: headers,
            })

                .then((response) => {
                    if (response.status != 200) throw new Error("Failed to send otp");
                    console.log("response", response.data);
                    setchallanreturndata(response.data);
                })
        } catch (error) {
            console.error("Error while searching Service data:", error);
        }
    };

    const [selectedData1, setSelectedData1] = useState({ praid: null });
    const openModal1 = (praid) => {
        setSelectedData1({ praid })
    }

    const columns = [
        {
            title: "Challan Number ",
            dataIndex: "pbno",
            render: (text) => (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id={`tooltip-${text}`}>{text}</Tooltip>}
                >
                    <div style={{ textAlign: "right" }}>{text}</div>
                </OverlayTrigger>
            ),
            sorter: (a, b) => a.pbno.length - b.pbno.length,

        },

        {
            title: () => (
                <OverlayTrigger placement="top" overlay={renderUOMTooltip}>
                    <span>Transaction Number</span>
                </OverlayTrigger>
            ),
            dataIndex: "potrnno",
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
            title: () => (
                <OverlayTrigger placement="top" overlay={renderQuantityTooltip}>
                    <span>Transaction Date</span>
                </OverlayTrigger>
            ),
            dataIndex: "prdate",
            render: (text) => (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id={`tooltip-${text}`}>{text}</Tooltip>}
                >
                    <div style={{ textAlign: "Center" }}>{text}</div>
                </OverlayTrigger>
            ),

        },
        {
            title: "Vendor",
            dataIndex: "vendorname",
            render: (text) => (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id={`tooltip-${text}`}>{text}</Tooltip>}
                >
                    <div style={{ textAlign: "left" }}>{text}</div>
                </OverlayTrigger>
            ),

            sorter: (a, b) => a.vendorname.length - b.vendorname.length,
            width: "25%",
        },
        {
            title: "Actions",
            dataIndex: "actions",
            key: "actions",
            render: (_, record) => (
                <div className="action-table-data">
                    <div className="edit-delete-action">
                        <Link
                            className="me-2 p-2"
                            to="#"
                            data-bs-toggle="modal"
                            data-bs-target="#EditPurchaseReturn"
                        >
                            <Edit className="feather-edit"
                                onClick={() => openModal1(record.praid)}
                            />
                        </Link>
                        {/* <a className="me-2 p-2" to="#" data-bs-toggle="modal" data-bs-target="#AddPurchaseReturn" onClick={() => { oneditClick() }}>

                            <i data-feather="eye" className="feather-eye"></i>
                        </a> */}

                        <Link
                            className="confirm-text me-2 p-2"
                            to="#"
                            onClick={() => showConfirmationAlert()}
                        >
                            <Trash2 className="feather-trash-2" />
                        </Link>
                    </div>
                </div>
            ),
        },
    ];
    const MySwal = withReactContent(Swal);

    const showConfirmationAlert = () => {
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
                MySwal.fire({
                    title: "Deleted!",
                    text: "Your file has been deleted.",
                    className: "btn btn-success",
                    confirmButtonText: "OK",
                    customClass: {
                        confirmButton: "btn btn-success",
                    },
                });
            } else {
                MySwal.close();
            }
        });
    };


    const downloadExcel = async () => {
        try {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("PurchaseInvoiceReturn_ (Report)");

            const headingRow = worksheet.addRow(["PurchaseInvoiceReturn_ (Report)"]);
            headingRow.getCell(1).font = { bold: true, size: 16 };
            headingRow.getCell(1).alignment = { horizontal: "center", vertical: "middle" };

            // Merge heading across all columns
            worksheet.mergeCells("A1:E1");

            // **Header Row**
            const headers = ["Challan Number", "Transaction Number", "Transaction Date", "Vendor Name"];
            const headerRow = worksheet.addRow(headers);

            headerRow.eachCell((cell) => {
                cell.font = { bold: true, color: { argb: "FFFFFF" } };
                cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "808080" } };
                cell.alignment = { horizontal: "center", vertical: "middle" };
            });

            // **Setting Column Widths**
            const columnWidths = [25, 25, 25, 25, 25, 18]; // Adjust widths as needed
            columnWidths.forEach((width, index) => {
                worksheet.getColumn(index + 1).width = width;
            });

            // **Adding Data Rows**
            challanreturndata.forEach(({ pbno, potrnno, prdate, vendorname }) => {
                const row = worksheet.addRow([pbno, potrnno, prdate, vendorname]);
                row.eachCell((cell) => {
                    cell.alignment = { horizontal: "center", vertical: "middle" };
                });
            });

            // **Generate and Save Excel File**
            const buffer = await workbook.xlsx.writeBuffer();
            const data = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
            saveAs(data, "PurchaseInvoiceReturn__(Report).xlsx");

        } catch (error) {
            console.error("Error generating the Excel file:", error);
        }
    };




    const downloadPDF = () => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        doc.setFontSize(12);
        doc.setFont("Helvetica", "bold");
        const title = "Purchase Invoice Return Report";
        const titleWidth = doc.getTextWidth(title);

        const borderMargin = 10;
        doc.rect(borderMargin, borderMargin, pageWidth - borderMargin * 2, pageHeight - borderMargin * 2);

        doc.text(title, (pageWidth - titleWidth) / 2, 20);
        doc.setLineWidth(0.5);
        doc.line((pageWidth - titleWidth) / 2, 22, (pageWidth + titleWidth) / 2, 22);

        doc.setFontSize(13);
        doc.setFont("Helvetica", "normal");
        let yPosition = 15;


        const tableColumn = ["Challan Number", "Transaction Number", "Transaction Date", "Vendor Name"];

        // Table rows
        const tableRows = challanreturndata.map(item => [
            item.pbno,
            item.potrnno,
            item.prdate,
            item.vendorname,
        ]);


        autoTable(doc, {
            startY: yPosition + 10,
            head: [tableColumn],
            body: tableRows,
            theme: 'grid',
            styles: { fontSize: 10, halign: "center", lineColor: [0, 0, 0], lineWidth: 0.20 }, // Dark border lines
            headStyles: { fillColor: [169, 169, 169], textColor: 0, fontStyle: "bold" }, // Gray header
            bodyStyles: { textColor: 0 }, // Black text in table
        });
        doc.save("PurchaseInvoiceReturn_(Report).pdf");
    };

    return (
        <div>
            <div className="page-wrapper">
                <div className="content">
                    <div className="page-header">
                        <div className="page-title me-auto">
                            <h4>Purchase Return</h4>
                            <h6>Manage Purchase Return</h6>
                        </div>
                        <ul className="table-top-head">
                            <li>
                                <OverlayTrigger placement="top" overlay={renderTooltip}>
                                    <Link onClick={downloadPDF}>
                                        <ImageWithBasePath
                                            src="assets/img/icons/pdf.svg"
                                            alt="img"
                                        />
                                    </Link>
                                </OverlayTrigger>
                            </li>
                            <li>
                                <OverlayTrigger placement="top" overlay={renderExcelTooltip}>
                                    <Link data-bs-toggle="tooltip" data-bs-placement="top" onClick={downloadExcel}>
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
                            <Link
                                to="#"
                                className="btn btn-added"
                                data-bs-toggle="modal"
                                data-bs-target="#AddPurchaseReturn"
                            >
                                <PlusCircle className="me-2" />
                                Add New Purchase Return
                            </Link>
                        </div>
                        <div className="page-btn">
                            <Link to={route.ReturnIndex} className="btn btn-secondary">
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
                                    />
                                    <span className="input-group-text">
                                        <i className="fa fa-search"></i>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="table-tab">

                        <div className="tab-content" id="pills-tabContent">
                            <div
                                className="tab-pane fade show active"
                                id="pills-home"
                                role="tabpanel"
                                aria-labelledby="pills-home-tab"
                            >
                                {/* /product list */}
                                <div className="card table-list-card">
                                    <div className="card-body">
                                        <div className="table-responsive">
                                            <Table columns={columns} dataSource={challanreturndata} />
                                        </div>
                                    </div>
                                </div>
                                {/* /product list */}
                            </div>
                            <div
                                className="tab-pane fade"
                                id="pills-profile"
                                role="tabpanel"
                                aria-labelledby="pills-profile-tab"
                            >
                                {/* /product list */}
                                <div className="card table-list-card">
                                    <div className="card-body">
                                        <div className="table-responsive">
                                            <Table columns={columns} dataSource={challanreturndata} />
                                        </div>
                                    </div>
                                </div>
                                {/* /product list */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <AddPurchaseReturn
                PRAID={selectedData1.praid}
            />
            {/* <AddPurchases /> */}
            <EditLowStock />
            <EditPurchaseReturn
                PRAID={selectedData1.praid}
            />
        </div>
    );
};

export default InvoiceReturn;
