import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ImageWithBasePath from "../../core/img/imagewithbasebath";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import {
    ChevronUp,
    PlusCircle,
    RotateCcw,
    Trash2,
    Edit,
} from "feather-icons-react/build/IconComponents";


// import { useDispatch } from "react-redux";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import Table from "../../core/pagination/datatable";
// import AddSaleInvoice from "./AddSaleInvoice";
import AddDirectInvoice from "./AddDirectInvoice";
import axios from "axios";
import { baseUrl } from "../../core/json/custom";
import { getUserData } from "../../Context/UserData";
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const SaleInvoice = () => {
    // const dispatch = useDispatch();
    const { userdetail } = getUserData();
    const [selectedData, setSelectedData] = useState({ sbaid: null });




    //   const data = useSelector((state) => state.toggle_header);
    //   const dataSource = useSelector((state) => state.quotationlist_data);
    const [billdata, setbilldata] = useState([]);
    // const [isFilterVisible, setIsFilterVisible] = useState(false);
    // const toggleFilterVisibility = () => {
    //     setIsFilterVisible((prevVisibility) => !prevVisibility);
    // };

    // const oldandlatestvalue = [
    //     { value: "date", label: "Sort by Date" },
    //     { value: "newest", label: "Newest" },
    //     { value: "oldest", label: "Oldest" },
    // ];
    // const products = [
    //     { value: "Choose product", label: "Choose product" },
    //     { value: "Bold V3.2", label: "Bold V3.2" },
    //     { value: "Apple Series 5 Watch", label: "Apple Series 5 Watch" },
    // ];
    // const status = [
    //     { value: "Choose product", label: "Choose Status" },
    //     { value: "Ordered", label: "Ordered" },
    //     { value: "Sent", label: "Sent" },
    // ];
    // const customername = [
    //     { value: "Choose Custmer", label: "Choose Customer" },
    //     { value: "walk-in-customer", label: "walk-in-customer" },
    //     { value: "John Smith", label: "John Smith" },
    // ];

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

        const fetchVendors = async () => {
            try {
                const payload = {
                    "sbaid": "%",
                    "companyid": userdetail?.companyID ? userdetail.companyID : "",
                    "deptid": userdetail?.departmentID ? userdetail.departmentID : ""

                }
                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };

                axios({
                    method: "POST",
                    url: baseUrl.Url + "/backend/api/GET_SBillMaster",
                    data: JSON.stringify(payload),
                    headers: headers,
                })
                    .then((response) => {
                        if (response.status != 200) throw new Error("Failed to Fetching Data");
                        const DATA = response.data;
                        setbilldata(DATA);
                    })

            } catch (error) {
                console.error("Error fetching Access Right Data:", error);
            }
        }

        fetchVendors();

    }, []);







    const openModal = (sbaid) => {
        setSelectedData({ sbaid })
    }

    const columns = [
        {
            title: (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id="BillNo-tooltip">Bill No</Tooltip>}
                >
                    <span>Bill No</span>
                </OverlayTrigger>
            ),
            dataIndex: "sbbillno",
            sorter: (a, b) => a.sbbillno.length - b.sbbillno.length,
            width: 150, // Fixed width
            render: (text) => (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id="BillNo-cell-tooltip">{text || "No data"}</Tooltip>}
                >
                    <span style={{ textAlign: "left", display: "block" }}>{text}</span>
                </OverlayTrigger>
            ),
        },
        {
            title: (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id="BillDate-tooltip">Bill Due Date</Tooltip>}
                >
                    <span>Bill Due Date</span>
                </OverlayTrigger>
            ),
            dataIndex: "sbduedate",
            sorter: (a, b) => new Date(a.sbduedate) - new Date(b.sbduedate),
            width: 150,
            render: (text) => (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id="BillDueDate-cell-tooltip">{text || "No data"}</Tooltip>}
                >
                    <span style={{ textAlign: "center", display: "block" }}>{text}</span>
                </OverlayTrigger>

            ),
        },
        {
            title: (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id="ChallanNo-tooltip">Challan No</Tooltip>}
                >
                    <span>Challan No</span>
                </OverlayTrigger>
            ),
            dataIndex: "sbchallanno",
            sorter: (a, b) => a.sbchallanno.length - b.sbchallanno.length,
            width: 150,
            render: (text) => (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id="ChallanNo-cell-tooltip">{text || "No data"}</Tooltip>}
                >
                    <span style={{ textAlign: "left", display: "block" }}>{text}</span>
                </OverlayTrigger>
            ),
        },
        {
            title: (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id="VendorName-tooltip">Customer Name</Tooltip>}
                >
                    <span>Customer Name</span>
                </OverlayTrigger>
            ),
            dataIndex: "vendorname",
            width: 150,
            render: (text) => (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id="VendorName-cell-tooltip">{text || "No data"}</Tooltip>}
                >
                    <span style={{ textAlign: "left", display: "block" }}>{text}</span>
                </OverlayTrigger>
            ),

        },

        {
            title: (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id="NetAmount-tooltip">Net Amount</Tooltip>}
                >
                    <span>Net Amount</span>
                </OverlayTrigger>
            ),
            dataIndex: "sbnetamount",
            width: 100,
            render: (text) => (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id="NetAmount-cell-tooltip">{text || "No data"}</Tooltip>}
                >
                    <span style={{ textAlign: "right", display: "block" }}>{text}</span>
                </OverlayTrigger>
            ),
        },
        {
            title: (
                <div className="d-flex justify-content-center">
                    <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip id="action-tooltip">Action</Tooltip>}
                    >
                        <span>Action</span>
                    </OverlayTrigger>
                </div>
            ),
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
                                data-bs-target="#AddDirectInvoice"
                                onClick={() => openModal(record.sbaid)}
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
                                onClick={() => showConfirmationAlert(record.sbaid)}

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

    const MySwal = withReactContent(Swal);



    const showConfirmationAlert = (sbaid) => {
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
                OndeleteBill(sbaid);
            } else {
                MySwal.close();
            }
        });
    };


    const OndeleteBill = async (sbaid) => {
        try {
            const payload = {
                "sbaid": sbaid,
                "companyid": userdetail?.companyID ? userdetail.companyID : "",
                "deptid": userdetail?.departmentID ? userdetail.departmentID : ""

            }
            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            axios({
                method: "POST",
                url: baseUrl.Url + "/backend/api/SP_DeleteSBill",
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
                            "sbaid": "%",
                            "companyid": userdetail?.companyID ? userdetail.companyID : "",
                            "deptid": userdetail?.departmentID ? userdetail.departmentID : ""

                        }
                        const headers = {
                            "Content-Type": "application/json",
                            Accept: "*/*",
                        };

                        axios({
                            method: "POST",
                            url: baseUrl.Url + "/backend/api/GET_SBillMaster",
                            data: JSON.stringify(payload),
                            headers: headers,
                        })
                            .then((response) => {
                                if (response.status != 200) throw new Error("Failed to Fetching Data");
                                const DATA = response.data;
                                setbilldata(DATA);
                            })

                    } catch (error) {
                        console.error("Error fetching Access Right Data:", error);
                    }
                })

        } catch (error) {
            console.error("Error fetching Access Right Data:", error);
        }

    }

    const generatePDF = (billdata) => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();


        doc.setFontSize(12);
        doc.setFont("Helvetica", "bold");
        const title = "Sale Bill Report";
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

        const tableColumn = ["Bill No", "Bill Due Date", "Challan No", "Customer Name", "Net Amount"];
        const tableRows = billdata.map((item) => [
            item.sbbillno,
            item.sbduedate,
            item.sbchallanno,
            item.vendorname,
            item.sbnetamount,

        ]);

        let totalsbmnamt = billdata.reduce((sum, item) => sum + parseFloat(item.sbnetamount || 0), 0);

        const totalRow = [
            { content: "", colSpan: 3 },
            { content: "Total", styles: { fontStyle: "bold" } },
            { content: totalsbmnamt.toFixed(2), styles: { fontStyle: "bold" } },

        ];

        autoTable(doc, {
            startY: yPosition + 10,
            head: [tableColumn],
            body: [...tableRows, totalRow],
            theme: 'grid',
            styles: { fontSize: 10, halign: "center", lineColor: [0, 0, 0], lineWidth: 0.20 },
            headStyles: { fillColor: [169, 169, 169], textColor: 0, fontStyle: "bold" },
            bodyStyles: { textColor: 0 },
            didDrawPage: () => {
                drawBorder();
            },

        });
        doc.save("Report.pdf");
    };


    const exportToExcel = async () => {
        try {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("Sale Bill Report");


            const headingRow = worksheet.addRow(["Sale Bill Report"]);
            headingRow.getCell(1).font = { bold: true, size: 16 };
            headingRow.getCell(1).alignment = { horizontal: "center", vertical: "middle" };


            worksheet.mergeCells("A1:E1");


            const headers = ["Bill No", "Bill Due Date", "Challan No", "Customer Name", "Net Amount"];
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


            billdata.forEach(({ sbbillno, sbduedate, sbchallanno, vendorname, sbnetamount }) => {
                const row = worksheet.addRow([sbbillno, sbduedate, sbchallanno, vendorname, sbnetamount]);
                row.eachCell((cell) => {
                    cell.alignment = { horizontal: "center", vertical: "middle" };
                });
            });


            const buffer = await workbook.xlsx.writeBuffer();
            const data = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
            saveAs(data, "BillReport.xlsx");

        } catch (error) {
            console.error("Error generating the Excel file:", error);
        }
    };

    return (
        <div>
            <div className="page-wrapper">
                <div className="content">
                    <div className="page-header">
                        <div className="add-item d-flex">
                            <div className="page-title">
                                <h4>Sale Invoice List</h4>
                                <h6>Manage Your Invoice</h6>
                            </div>
                        </div>
                        <ul className="table-top-head">
                            <li>
                                <OverlayTrigger placement="top" overlay={renderTooltip}>
                                    <Link onClick={() => generatePDF(billdata)}>
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
                                    //className={data ? "active" : ""}
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
                                data-bs-target="#AddDirectInvoice"
                            >
                                <PlusCircle className="me-2" />
                                Add New Invoice
                            </Link>
                        </div>
                    </div>
                    {/* /product list */}
                    <div className="card table-list-card">
                        <div className="card-body">
                            <div className="table-responsive">
                                <Table columns={columns} dataSource={billdata} />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <AddDirectInvoice
                SBAID={selectedData.sbaid} />
        </div>
    );
};

export default SaleInvoice;
