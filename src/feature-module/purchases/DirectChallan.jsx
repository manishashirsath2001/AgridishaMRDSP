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
// import AddPurchases from "../../core/modals/purchases/addpurchases";
import AddPurchaseChallan from "./AddPurchasechallan";
import { baseUrl } from "../../core/json/custom";
import axios from "axios";
import { getUserData } from "../../Context/UserData";
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
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

function DirectChallan() {
    const { userdetail } = getUserData();
    const dispatch = useDispatch();
    const data = useSelector((state) => state.toggle_header);
    const route = all_routes;
    const [challandata, setchallandata] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    useEffect(() => {
        const fetchVendors = async () => {
            try {
                const payload = {
                    pcaid: "%",
                    keyword: "%",
                    companyid: userdetail?.companyID || "",
                    deptid: userdetail?.departmentID || "",
                    statusid: "1",
                };
                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };
                const response = await axios.post(
                    `${baseUrl.Url}/backend/api/GET_PChallanMaster`,
                    payload,
                    { headers }
                );
                if (response.status !== 200)
                    throw new Error("Failed to fetch vendor data");
                console.log("venderos", response.data)
                setchallandata(response.data)
            } catch (error) {
                console.error("Error fetching vendor data:", error);
            }
        };

        fetchVendors();
    }, [userdetail]);

    const OnReloadData = async () => {
        try {
            const payload = {
                pcaid: "%",
                keyword: "%",
                companyid: userdetail?.companyID || "",
                deptid: userdetail?.departmentID || "",
                statusid: "1",
            };
            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };
            const response = await axios.post(
                `${baseUrl.Url}/backend/api/GET_PChallanMaster`,
                payload,
                { headers }
            );
            if (response.status !== 200)
                throw new Error("Failed to fetch vendor data");
            console.log("venderos", response.data)
            setchallandata(response.data)
        } catch (error) {
            console.error("Error fetching vendor data:", error);
        }
    }

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
        try {
            const payload = {
                "pcaid": "%",
                "statusid": "1",
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
                url: baseUrl.Url + "/backend/api/GET_PChallanMaster/_Search",
                data: JSON.stringify(payload),
                headers: headers,
            })

                .then((response) => {
                    if (response.status != 200) throw new Error("Failed to send otp");
                    console.log("response", response.data);
                    setchallandata(response.data);
                })
        } catch (error) {
            console.error("Error while searching Service data:", error);
        }
    };

    const statusID = "1";
    const [selectedData, setSelectedData] = useState({ vendorid: null, pcaid: null, statusID: "1" });

    const openModal = (pcaid, vendorid) => {
        if (vendorid) {
            setSelectedData({ vendorid, pcaid, statusID });
        }
        if (pcaid) {
            setSelectedData({ vendorid, pcaid, statusID });
        }

    };

    console.log(selectedData);

    const columns = [
        {
            title: (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id="types-tooltip">Challan No</Tooltip>}
                >
                    <div>Challan No</div>
                </OverlayTrigger>
            ),
            dataIndex: "pctrnno",
            width: 100,
            sorter: (a, b) => a.service.localeCompare(b.service),
            render: (text) => (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id={`tooltip-${text}`}>{text}</Tooltip>}
                >
                    <div style={{ textAlign: "left" }}>{text}</div>
                </OverlayTrigger>
            ),
        },
        {
            title: (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id="types-tooltip">Challan Date</Tooltip>}
                >
                    <div className="text-center">Challan Date</div>
                </OverlayTrigger>
            ),
            dataIndex: "pcdate",
            width: 130, // Adjusted width
            render: (text) => (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id={`tooltip-${text}`}>{text}</Tooltip>}
                >
                    <div style={{ textAlign: "center" }}>{text}</div>
                </OverlayTrigger>
            ),
        },
        {
            title: (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id="types-tooltip">Place of Supply</Tooltip>}
                >
                    <div>Place of Supply</div>
                </OverlayTrigger>
            ),
            dataIndex: "statename",
            width: 150, // Adjusted width
            render: (text) => (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id={`tooltip-${text}`}>{text}</Tooltip>}
                >
                    <div style={{ textAlign: "left" }}>{text}</div>
                </OverlayTrigger>
            ),
        },
        {
            title: (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id="types-tooltip">Vendor Name</Tooltip>}
                >
                    <div>Vendor Name</div>
                </OverlayTrigger>
            ),
            dataIndex: "vendorname",
            width: 140, // Adjusted width
            render: (text) => (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id={`tooltip-${text}`}>{text}</Tooltip>}
                >
                    <div style={{ textAlign: "left" }}>{text}</div>
                </OverlayTrigger>
            ),
        },
        {
            title: (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id="types-tooltip">Taxable Amount</Tooltip>}
                >
                    <div className="text-center">Taxable Amount</div>
                </OverlayTrigger>
            ),
            dataIndex: "pcgamt",
            width: 110, // Adjusted width
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
                    overlay={<Tooltip id="types-tooltip">Net Amount</Tooltip>}
                >
                    <div className="text-center">Net Amount</div>
                </OverlayTrigger>
            ),
            dataIndex: "pcnamt",
            width: 110, // Adjusted width
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
            width: 60, // Adjusted width
            render: (_, record) => (
                <div className="action-table-data">
                    <div className="edit-delete-action">
                        <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip id="edit-tooltip">Edit</Tooltip>}
                        >
                            <Link to="#"
                                className="btn btn-added me-2"
                                data-bs-toggle="modal"
                                data-bs-target="#AddPurchasechallan"
                                onClick={() => openModal(record.pcaid)} >
                                <Edit className="feather-edit" />
                            </Link>
                        </OverlayTrigger>
                        <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip id="delete-tooltip">Delete</Tooltip>}
                        >
                            <Link
                                className="confirm-text p-2 me-2"
                                to="#"
                                onClick={() => showConfirmationAlert(record.pcaid)}
                            >
                                <Trash2 className="feather-trash-2" />
                            </Link>
                        </OverlayTrigger>
                        <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip id="procced-tooltip">procced</Tooltip>}
                        >
                            <Link className="me-2 p-2" to="#" data-bs-toggle="modal" onClick={() => openModal(record.pcaid, record.pcseller)} data-bs-target="#AddGRN" style={{ color: 'green' }}>
                                <i data-feather="arrow-right-circle" className="feather-arrow-right-circle"></i>
                            </Link>
                        </OverlayTrigger>
                    </div>
                </div>
            ),
        },
    ];

    const MySwal = withReactContent(Swal);
    const showConfirmationAlert = (pcaid) => {
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
                OndeletePurchaseChallan(pcaid)
            } else {
                MySwal.close();
            }
        });
    };

    const OndeletePurchaseChallan = async (pcaid) => {
        try {
            const payload = {
                pcaid: pcaid,
                companyid: userdetail?.companyID || "",
                deptid: userdetail?.departmentID || ""
            };

            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            // First API call to delete the purchase challan
            const response = await axios.post(
                `${baseUrl.Url}/backend/api/SP_DeletePChallan`,
                JSON.stringify(payload),
                { headers }
            );

            if (response.status !== 200) {
                throw new Error("Failed to delete purchase challan");
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

            const refreshPayload = {
                pcaid: "%",
                keyword: "%",
                companyid: userdetail?.companyID || "",
                deptid: userdetail?.departmentID || "",
                statusid: "1",
            };

            const refreshResponse = await axios.post(
                `${baseUrl.Url}/backend/api/GET_PChallanMaster`,
                JSON.stringify(refreshPayload),
                { headers }
            );

            if (refreshResponse.status !== 200) {
                throw new Error("Failed to fetch updated purchase challans");
            }

            console.log("Updated purchase challans", refreshResponse.data);
            setchallandata(refreshResponse.data);

        } catch (error) {
            console.error("Error during delete or fetching data:", error);
        }
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

    const generatePDF = (challandata) => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const borderMargin = 10;

        doc.setFontSize(12);
        doc.setFont("Helvetica", "bold");
        const title = "Purchase Challan Report";
        const titleWidth = doc.getTextWidth(title);

        // Function to draw a faint border on each page
        const drawBorder = () => {
            doc.setDrawColor(100, 100, 100);
            doc.rect(borderMargin, borderMargin, pageWidth - borderMargin * 2, pageHeight - borderMargin * 2);
        };
        drawBorder();

        doc.setDrawColor(0, 0, 0);
        doc.text(title, (pageWidth - titleWidth) / 2, 20);
        doc.setLineWidth(0.5);
        doc.line((pageWidth - titleWidth) / 2, 22, (pageWidth + titleWidth) / 2, 22);

        const tableColumn = ["Challan No", "Challan Date", "Place of Supply", "Vendor Name", "Taxable Amount", "Net Amount"];
        const tableRows = challandata.map((item) => [
            item.pctrnno,
            item.pcdate,
            item.statename,
            item.vendorname,
            item.pcgamt,
            item.pcnamt,
        ]);

        // Calculate Totals
        let totalScgamt = challandata.reduce((sum, item) => sum + parseFloat(item.scgamt || 0), 0);
        let totalScnamt = challandata.reduce((sum, item) => sum + parseFloat(item.scnamt || 0), 0);

        // Add Total Row
        const totalRow = [
            { content: "", colSpan: 3 },
            { content: "Total", styles: { fontStyle: "bold" } },
            { content: totalScgamt.toFixed(2), styles: { fontStyle: "bold" } },
            { content: totalScnamt.toFixed(2), styles: { fontStyle: "bold" } }
        ];

        autoTable(doc, {
            startY: 30,
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
            const worksheet = workbook.addWorksheet("Purchase Challan Report");

            // **Main Heading Row**
            const headingRow = worksheet.addRow(["Purchase Challan Report"]);
            headingRow.getCell(1).font = { bold: true, size: 16 };
            headingRow.getCell(1).alignment = { horizontal: "center", vertical: "middle" };
            worksheet.mergeCells("A1:F1");

            // **Header Row**
            const headers = ["Challan No", "Challan Date", "State Name", "Vendor Name", "Taxable Amount", "Net Amount"];
            const headerRow = worksheet.addRow(headers);

            headerRow.eachCell((cell) => {
                cell.font = { bold: true, color: { argb: "FFFFFF" } };
                cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "808080" } };
                cell.alignment = { horizontal: "center", vertical: "middle" };
            });

            // **Setting Column Widths**
            const columnWidths = [15, 20, 25, 30, 18, 18];
            columnWidths.forEach((width, index) => {
                worksheet.getColumn(index + 1).width = width;
            });


            challandata.forEach(({ pctrnno, pcdate, statename, vendorname, pcgamt, pcnamt }) => {
                const row = worksheet.addRow([pctrnno, pcdate, statename, vendorname, pcgamt, pcnamt]);
                row.eachCell((cell) => {
                    cell.alignment = { horizontal: "center", vertical: "middle" };
                });
            });

            const buffer = await workbook.xlsx.writeBuffer();
            const data = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
            saveAs(data, "challanReport.xlsx");

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
                            <h3>Add Purchase Challan</h3>
                        </div>
                    </div>
                    <ul className="table-top-head">
                        <li>
                            <OverlayTrigger placement="top" overlay={renderTooltip}>
                                <Link onClick={() => generatePDF(challandata)}>
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
                            data-bs-target="#AddPurchasechallan"
                        >
                            <PlusCircle className="me-2 iconsize" /> Add Purchase Challan
                        </button>
                    </div>
                    <div className="page-btn">
                        <Link to={route.ChallanIndex} className="btn btn-secondary">
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
                            <Table columns={columns} dataSource={challandata} />
                        </div>
                    </div>
                </div>
                <Brand />
            </div>
            <AddPurchaseChallan
                pcaid={selectedData.pcaid}
                vendorid={selectedData.vendorid}
                statusID={selectedData.statusID}
            />
        </div>
    )
}

export default DirectChallan
