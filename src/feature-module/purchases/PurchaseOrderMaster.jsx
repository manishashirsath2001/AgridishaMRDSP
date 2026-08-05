import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ImageWithBasePath from "../../core/img/imagewithbasebath";
import Brand from "../../core/modals/inventory/brand";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { all_routes } from "../../Router/all_routes";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import Table from "../../core/pagination/datatable";
import { setToogleHeader } from "../../core/redux/action";
import { getUserData } from "../../Context/UserData";
import {
    ArrowLeft,
    ChevronUp,
    RotateCcw,
    Edit,
    Trash2,
} from "feather-icons-react/build/IconComponents";
import AddPurchaseOrder from "./AddPurchaseOrder";
import OnProccedPurchaseOrder from "./OnProccedPurchaseOrder"
import axios from "axios";
import { baseUrl } from "../../core/json/custom";
import ChallanPikUpForm from "./ChallanPikUpForm";
import OnEditPurchaseOrder from "./OnEditPurchaseOrder";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
function PurchaseOrderMaster() {
    const dispatch = useDispatch();
    const data = useSelector((state) => state.toggle_header);
    const route = all_routes;
    const { userdetail } = getUserData();
    const [orderdata, setorderdata] = useState();
    const [searchQuery, setSearchQuery] = useState("");
    useEffect(() => {
        if (userdetail) {
            const fetchVendors = async () => {
                try {
                    const payload = {
                        poaid: "%",
                        keyword: "%",
                        companyid: userdetail?.companyID || "",
                        deptid: userdetail?.departmentID || "",
                    };
                    const headers = {
                        "Content-Type": "application/json",
                        Accept: "*/*",
                    };
                    const response = await axios.post(
                        `${baseUrl.Url}/backend/api/GET_POrderMaster`,
                        payload,
                        { headers }
                    );
                    if (response.status !== 200)
                        throw new Error("Failed to fetch vendor data");
                    console.log("quatation master", response.data)
                    setorderdata(response.data);
                } catch (error) {
                    console.error("Error fetching vendor data:", error);
                }
            };

            fetchVendors();
        }
    }, [userdetail]);

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
        try {
            const payload = {
                "poaid": "%",
                "keyword": event.target.value,
                "companyid": userdetail?.companyID ? userdetail.companyID : "",
                "deptid": userdetail?.departmentID ? userdetail.departmentID : "",
            }
            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            axios({
                method: "POST",
                url: baseUrl.Url + "/backend/api/GET_POrderMaster/_Search",
                data: JSON.stringify(payload),
                headers: headers,
            })
                .then((response) => {
                    if (response.status != 200) throw new Error("Failed to send otp");
                    console.log("response", response.data);
                    setorderdata(response.data);
                })
        } catch (error) {
            console.error("Error while searching Service data:", error);
        }
    };

    const OnReloadData = async () => {
        try {
            const payload = {
                poaid: "%",
                keyword: "%",
                companyid: userdetail?.companyID || "",
                deptid: userdetail?.departmentID || "",
            };
            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };
            const response = await axios.post(
                `${baseUrl.Url}/backend/api/GET_POrderMaster`,
                payload,
                { headers }
            );
            if (response.status !== 200)
                throw new Error("Failed to fetch vendor data");
            console.log("quatation master", response.data)
            setorderdata(response.data);
        } catch (error) {
            console.error("Error fetching vendor data:", error);
        }
    }

    const [selectedData, setSelectedData] = useState({ poaid: null, vendorid: null });
    const openModal = (poaid, vendorid) => {
        setSelectedData({ poaid, vendorid });
        // setModalShow(true);
    };

    // "Purchase Order No","Purchase Order Date","Delivery Date","Delivery Place","Due Date","Quotation No."
    // potranno,podate,poddate,statename,poduedate,qno
    const columns = [
        {
            title: (
                <OverlayTrigger placement="top" overlay={<Tooltip id="Order_Number-tooltip">Purchase Order No.</Tooltip>}>
                    <span>Purchase Order No</span>
                </OverlayTrigger>
            ),
            dataIndex: "potranno",
        },
        {
            title: (
                <OverlayTrigger placement="top" overlay={<Tooltip id="Order_Date-tooltip">Purchase Order Date</Tooltip>}>
                    <span>Purchase Order Date</span>
                </OverlayTrigger>
            ),
            dataIndex: "podate",
            render: (text) => <div style={{ textAlign: "right" }}>{text}</div>,
        },
        {
            title: (
                <OverlayTrigger placement="top" overlay={<Tooltip id="Delivery_Date-tooltip">Delivery Date</Tooltip>}>
                    <span>Delivery Date</span>
                </OverlayTrigger>
            ),
            dataIndex: "poddate",
            render: (text) => <div style={{ textAlign: "right" }}>{text}</div>,
        },
        {
            title: (
                <OverlayTrigger placement="top" overlay={<Tooltip id="Delivery_Place-tooltip">Delivery Place</Tooltip>}>
                    <span>Delivery Place</span>
                </OverlayTrigger>
            ),
            dataIndex: "statename",
        },

        {
            title: (
                <OverlayTrigger placement="top" overlay={<Tooltip id="Due_Date-tooltip">Due Date</Tooltip>}>
                    <span>Due Date</span>
                </OverlayTrigger>
            ),
            dataIndex: "poduedate",
        },

        {
            title: (
                <OverlayTrigger placement="top" overlay={<Tooltip id="Quotation_No-tooltip">Quotation No.</Tooltip>}>
                    <span>Quotation No.</span>
                </OverlayTrigger>
            ),
            dataIndex: "qno",
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
                        <Link to="#"
                            className="btn btn-added me-2"
                            data-bs-toggle="modal"
                            data-bs-target="#onEditpurchaseorder"
                            onClick={() => openModal(record.poaid, record.povendorid)}>
                            <Edit className="feather-edit" />
                        </Link>
                        {/* Delete Button */}
                        <Link
                            className="confirm-text p-2 me-2"
                            to="#"
                            onClick={() => showConfirmationAlert(record.poaid)}
                        >
                            <Trash2 className="feather-trash-2" />
                        </Link>
                        {/* Proceed Button */}
                        <Link className="me-2 p-2"
                            to="#"
                            data-bs-toggle="modal"
                            onClick={() => openModal(record.poaid, record.povendorid)}
                            data-bs-target="#EditPurchasechallan"
                            style={{ color: 'green' }}>
                            <i data-feather="arrow-right-circle" className="feather-arrow-right-circle"></i>
                        </Link>
                        {/* <Link
                        to="#"
                        className="btn btn-added"
                        data-bs-toggle="modal"
                        data-bs-target="#addquatation"
                        onClick={() => openModal(record.praid, record.prvandorid)}
                    >
                        Proceed
                    </Link> */}
                    </div>
                </div>
                // <div className="action-table-data">
                //     <div className="edit-delete-action">
                //         {/* Tooltip for "View" icon */}
                //         <OverlayTrigger placement="top" overlay={<Tooltip id="view-tooltip">View</Tooltip>}>
                //             <Button
                //                 variant="link"
                //                 className="me-2 p-2"

                //             ><Link
                //                 to="#"
                //                 className="btn btn-added"
                //                 data-bs-toggle="modal"
                //                 data-bs-target="#onproceedorder"
                //             >
                //                     <Eye className="feather-view" />
                //                 </Link>


                //             </Button>
                //         </OverlayTrigger>
                //     </div>
                // </div>
            ),
        },
    ];




    const MySwal = withReactContent(Swal);

    const showConfirmationAlert = (poaid) => {
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
                OndeletePurchaseOrder(poaid)
            } else {
                MySwal.close();
            }
        });
    };


    const OndeletePurchaseOrder = async (poaid) => {
        try {
            const payload = {
                poaid: poaid,
                companyid: userdetail?.companyID || "",
                deptid: userdetail?.departmentID || ""
            };

            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            // First API call to delete the purchase order
            const response = await axios.post(
                `${baseUrl.Url}/backend/api/SP_DeletePOrder`,
                JSON.stringify(payload),
                { headers }
            );

            if (response.status !== 200) {
                throw new Error("Failed to delete purchase order");
            }

            MySwal.fire({
                title: response.data[0].responseCode === "FAILURE" ? "Deletion Not Allowed" : "Deleted!",
                text: response.data[0].responseMessage,
                icon: response.data[0].responseCode === "FAILURE" ? "error" : "success",
                confirmButtonText: "OK",
                customClass: {
                    confirmButton: response.data[0].responseCode === "FAILURE" ? "btn btn-danger" : "btn btn-success",
                },
            });

            // Fetch updated purchase order data
            try {
                const refreshPayload = {
                    poaid: "%",
                    keyword: "%",
                    companyid: userdetail?.companyID || "",
                    deptid: userdetail?.departmentID || "",
                };

                const refreshResponse = await axios.post(
                    `${baseUrl.Url}/backend/api/GET_POrderMaster`,
                    JSON.stringify(refreshPayload),
                    { headers }
                );

                if (refreshResponse.status !== 200) {
                    throw new Error("Failed to fetch updated purchase orders");
                }

                console.log("Purchase order master", refreshResponse.data);
                setorderdata(refreshResponse.data);
            } catch (error) {
                console.error("Error fetching purchase order data:", error);
            }

        } catch (error) {
            console.error("Error deleting purchase order:", error);
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

    // "Purchase Order No","Purchase Order Date","Delivery Date","Delivery Place","Due Date","Quotation No."
    // potranno,podate,poddate,statename,poduedate,qno

    const downloadExcel = async () => {
        try {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("Purchase Order (Report)");

            const headingRow = worksheet.addRow(["Purchase Order (Report)"]);
            headingRow.getCell(1).font = { bold: true, size: 16 };
            headingRow.getCell(1).alignment = { horizontal: "center", vertical: "middle" };

            // Merge heading across all columns
            worksheet.mergeCells("A1:E1");

            // **Header Row**
            const headers = ["Purchase Order No", "Purchase Order Date", "Delivery Date", "Delivery Place", "Due Date", "Quotation No."];
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
            orderdata.forEach(({ potranno, podate, poddate, statename, poduedate, qno }) => {
                const row = worksheet.addRow([potranno, podate, poddate, statename, poduedate, qno]);
                row.eachCell((cell) => {
                    cell.alignment = { horizontal: "center", vertical: "middle" };
                });
            });

            // **Generate and Save Excel File**
            const buffer = await workbook.xlsx.writeBuffer();
            const data = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
            saveAs(data, "Service_(Report).xlsx");

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
        const title = "Purchase Order Report";
        const titleWidth = doc.getTextWidth(title);

        const borderMargin = 10;
        doc.rect(borderMargin, borderMargin, pageWidth - borderMargin * 2, pageHeight - borderMargin * 2);

        doc.text(title, (pageWidth - titleWidth) / 2, 20);
        doc.setLineWidth(0.5);
        doc.line((pageWidth - titleWidth) / 2, 22, (pageWidth + titleWidth) / 2, 22);

        doc.setFontSize(13);
        doc.setFont("Helvetica", "normal");
        let yPosition = 15;


        const tableColumn = ["Purchase Order No", "Purchase Order Date", "Delivery Date", "Delivery Place", "Due Date", "Quotation No."];

        // Table rows
        const tableRows = orderdata.map(item => [
            item.potranno,
            item.podate,
            item.poddate,
            item.statename,
            item.poduedate,
            item.qno

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
        doc.save("PurchaseOrder_(Report).pdf");
    };

    return (
        <div className="page-wrapper">
            <div className="content">
                <div className="page-header">
                    <div className="add-item d-flex">
                        <div className="page-title">
                            <h3>Purchase Order</h3>

                        </div>
                    </div>
                    <ul className="table-top-head">
                        <li>
                            <OverlayTrigger placement="top" overlay={renderTooltip}>
                                <Link onClick={downloadPDF}>
                                    <ImageWithBasePath src="assets/img/icons/pdf.svg" alt="img" />
                                </Link>
                            </OverlayTrigger>
                        </li>
                        <li>
                            <OverlayTrigger placement="top" overlay={renderExcelTooltip}>
                                <Link data-bs-toggle="tooltip" data-bs-placement="top" onClick={downloadExcel}>
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
                    <div className="d-flex purchase-pg-btn">
                        <div className="page-btn">
                            <Link
                                to="#"
                                className="btn btn-added"
                                data-bs-toggle="modal"
                                data-bs-target="#AddPurchaseorder"
                            >

                                Add Purchase Order
                            </Link>
                        </div>
                    </div>
                    <div className="page-btn">
                        <Link to={route.PurchaseIndex} className="btn btn-secondary">
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

                <div className="card table-list-card">
                    <div className="card-body">
                        <div className="table-responsive">
                            <Table columns={columns} dataSource={orderdata} />
                        </div>
                    </div>
                </div>
                <Brand />
            </div>

            {/* <AddPurchases />
            <EditPurchases /> */}
            <AddPurchaseOrder />
            <OnProccedPurchaseOrder
                POAID={selectedData.poaid}
            />
            < ChallanPikUpForm
                poaid={selectedData.poaid}
                vendorid={selectedData.vendorid}
            />
            <OnEditPurchaseOrder
                POAID={selectedData.poaid}
            />

        </div >
    )
}

export default PurchaseOrderMaster
