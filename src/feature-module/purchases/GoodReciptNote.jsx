import React, { useEffect, useState } from "react";
import ImageWithBasePath from "../../core/img/imagewithbasebath";
// import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";
import { OverlayTrigger, Tooltip, Button } from "react-bootstrap";
import {
    ArrowLeft,
    ChevronUp,
    RotateCcw,
    Edit,
    Trash2,
    PlusCircle,
} from "feather-icons-react/build/IconComponents";
import { setToogleHeader } from "../../core/redux/action";
import { useDispatch, useSelector } from "react-redux";
import ImportPurchases from "../../core/modals/purchases/importpurchases";
import EditPurchases from "../../core/modals/purchases/editpurchases";
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import Table from "../../core/pagination/datatable";
// import { purchaseslist } from "../../core/json/purchaselistdata";
import AddPurchases from "../../core/modals/purchases/addpurchases";
import { all_routes } from "../../Router/all_routes";
import AddGoodReciptNote from "./AddGoodReciptNote";
import { getUserData } from "../../Context/UserData";
import axios from "axios";
import { baseUrl } from "../../core/json/custom";
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
function GoodReciptNote() {
    const route = all_routes;
    // const purchasedata = purchaseslist;
    // const [searchText, setSearchText] = useState("");
    const { userdetail } = getUserData();
    const [GRNData, setGRNData] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    // const filteredData = purchasedata.filter((entry) => {
    //     return Object.keys(entry).some((key) => {
    //         return String(entry[key])
    //             .toLowerCase()
    //             .includes(searchText.toLowerCase());
    //     });
    // });
    // const handleSearch = (e) => {
    //     setSearchText(e.target.value);
    // };

    useEffect(() => {
        if (userdetail) {
            const fetchVendors = async () => {
                try {
                    const payload = {
                        "grnaid": "%",
                        "keyword": "%",
                        "companyid": userdetail?.companyID || "",
                        "deptid": userdetail?.departmentID || "",
                    };
                    const headers = {
                        "Content-Type": "application/json",
                        Accept: "*/*",
                    };
                    const response = await axios.post(
                        `${baseUrl.Url}/backend/api/GET_GoodReceiptNoteMaster`,
                        payload,
                        { headers }
                    );
                    if (response.status !== 200)
                        throw new Error("Failed to fetch vendor data");
                    console.log("setGRNData master", response.data)
                    setGRNData(response.data);
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
                "grnaid": "%",
                "keyword": "%",
                "companyid": userdetail?.companyID || "",
                "deptid": userdetail?.departmentID || "",
            };
            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };
            const response = await axios.post(
                `${baseUrl.Url}/backend/api/GET_GoodReceiptNoteMaster`,
                payload,
                { headers }
            );
            if (response.status !== 200)
                throw new Error("Failed to fetch vendor data");
            console.log("setGRNData master", response.data)
            setGRNData(response.data);
        } catch (error) {
            console.error("Error fetching vendor data:", error);
        }
    }

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
        try {
            const payload = {
                "grnaid": "%",
                "keyword": event.target.value,
                "companyid": userdetail?.companyID || "",
                "deptid": userdetail?.departmentID || "",
            }
            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            axios({
                method: "POST",
                url: baseUrl.Url + "/backend/api/GET_GoodReceiptNoteMaster/_Serch",
                data: JSON.stringify(payload),
                headers: headers,
            })

                .then((response) => {
                    if (response.status != 200) throw new Error("Failed to send otp");
                    console.log("response", response.data);
                    setGRNData(response.data);
                })
        } catch (error) {
            console.error("Error while searching Service data:", error);
        }
    };

    const [selectedData, setSelectedData] = useState({ grnaid: null });
    const openModal = (grnaid) => {
        if (grnaid) {
            // navigate(route.OnProccedQuatation, { state: { praid: praid, caid: caid } });
            setSelectedData({ grnaid });
        }
    };

    const columns = [
        {
            title: (
                <OverlayTrigger placement="top" overlay={<Tooltip >VenderName</Tooltip>}>
                    <div className="text-center">VenderName</div>
                </OverlayTrigger>
            ),
            dataIndex: "vendorname",
            sorter: (a, b) => a.VenderName.length - b.VenderName.length,
            render: (text) => <div style={{ textAlign: "left" }}>{text}</div>,
            width: "200px",
        },
        {
            title: (
                <div className="text-center">InspectedBy</div>
            ),
            dataIndex: "grninspectedby",
            render: (text) => <div style={{ textAlign: "left" }}>{text}</div>,
            width: "150px",
        },
        {
            title: (
                <div className="text-center">Challan No</div>
            ),
            dataIndex: "grnchallanno",
            render: (text) => <div style={{ textAlign: "left" }}>{text}</div>,
            width: "150px",
        },
        {
            title: (
                <div className="text-center">Challan Date</div>
            ),
            dataIndex: "grnchallandate",
            sorter: (a, b) => a.length.Status - b.length.Status,
            render: (text) => <div style={{ textAlign: "left" }}>{text}</div>,
            width: "150px",
        },
        {
            title: (
                <div className="text-center">GRN Date</div>
            ),
            dataIndex: "grndate",
            sorter: (a, b) => a.length.Date - b.length.Date,
            render: (text) => <div style={{ textAlign: "left" }}>{text}</div>,
            width: "150px",
        },
        {
            title: (
                <div className="text-center">Action</div>
            ),
            dataIndex: "action",
            render: (_, record) => (
                <div className="action-table-data">
                    <div className="edit-delete-action">
                        {/* <OverlayTrigger placement="top" overlay={<Tooltip id="view-tooltip">View</Tooltip>}> */}
                        <Button
                            variant="link"
                            className="me-2 p-2"
                        >
                            <Link
                                to="#"
                                className="btn btn-added"
                                data-bs-toggle="modal"
                                data-bs-target="#AddGRN"
                                onClick={() => openModal(record.grnaid)}
                            >
                                <Edit className="feather-view" />
                            </Link>
                        </Button>
                        <Link
                            className="confirm-text p-2 me-2"
                            to="#"
                            onClick={() => showConfirmationAlert()}
                        >
                            <Trash2 className="feather-trash-2" />
                        </Link>
                        {/* </OverlayTrigger> */}
                    </div>
                </div>
            ),
            sorter: (a, b) => a.createdby.length - b.createdby.length,
            // render: (text) => <div style={{ textAlign: "left" }}>{text}</div>,
            width: "150px",
        },
    ];

    const dispatch = useDispatch();
    const data = useSelector((state) => state.toggle_header);
    // const [isFilterVisible, setIsFilterVisible] = useState(false);
    // const toggleFilterVisibility = () => {
    //     setIsFilterVisible((prevVisibility) => !prevVisibility);
    // };
    // const oldandlatestvalue = [
    //     { value: "date", label: "Sort by Date" },
    //     { value: "newest", label: "Newest" },
    //     { value: "oldest", label: "Oldest" },
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
    const MySwal = withReactContent(Swal);

    const showConfirmationAlert = () => {
        MySwal.fire({
            title: 'Are you sure?',
            text: 'You won\'t be able to revert this!',
            showCancelButton: true,
            confirmButtonColor: '#00ff00',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonColor: '#ff0000',
            cancelButtonText: 'Cancel',
        }).then((result) => {
            if (result.isConfirmed) {

                MySwal.fire({
                    title: 'Deleted!',
                    text: 'Your file has been deleted.',
                    className: "btn btn-success",
                    confirmButtonText: 'OK',
                    customClass: {
                        confirmButton: 'btn btn-success',
                    },
                });
            } else {
                MySwal.close();
            }

        });
    };

    const downloadPDF = () => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        doc.setFontSize(12);
        doc.setFont("Helvetica", "bold");
        const title = "Good Receipt Note Report";
        const titleWidth = doc.getTextWidth(title);

        const borderMargin = 10;
        doc.rect(borderMargin, borderMargin, pageWidth - borderMargin * 2, pageHeight - borderMargin * 2);

        doc.text(title, (pageWidth - titleWidth) / 2, 20);
        doc.setLineWidth(0.5);
        doc.line((pageWidth - titleWidth) / 2, 22, (pageWidth + titleWidth) / 2, 22);

        doc.setFontSize(13);
        doc.setFont("Helvetica", "normal");
        let yPosition = 15;


        const tableColumn = ["Vendor Name", "Inspected By", "Challan No", "Challan Date", "GRN Date"];

        // Table rows
        const tableRows = GRNData.map(item => [
            item.vendorname,
            item.grninspectedby,
            item.grnchallanno,
            item.grnchallandate,
            item.grndate
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
        doc.save("GoodReceiptNote_report.pdf");
    };

    const downloadExcel = async () => {
        try {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("Good Receipt Note (Report)");

            // **Main Heading Row**
            const headingRow = worksheet.addRow(["Good Receipt Note (Report)"]);
            headingRow.getCell(1).font = { bold: true, size: 16 };
            headingRow.getCell(1).alignment = { horizontal: "center", vertical: "middle" };

            // Merge heading across all columns
            worksheet.mergeCells("A1:E1");

            // **Header Row**
            const headers = ["Vendor Name", "Inspected By", "Challan No", "Challan Date", "GRN Date"];
            const headerRow = worksheet.addRow(headers);

            headerRow.eachCell((cell) => {
                cell.font = { bold: true, color: { argb: "FFFFFF" } };
                cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "808080" } };
                cell.alignment = { horizontal: "center", vertical: "middle" };
            });

            // **Setting Column Widths**
            const columnWidths = [25, 25, 25, 25, 25]; // Adjust widths as needed
            columnWidths.forEach((width, index) => {
                worksheet.getColumn(index + 1).width = width;
            });

            // **Adding Data Rows**
            GRNData.forEach(({ vendorname, grninspectedby, grnchallanno, grnchallandate, grndate }) => {
                const row = worksheet.addRow([vendorname, grninspectedby, grnchallanno, grnchallandate, grndate]);
                row.eachCell((cell) => {
                    cell.alignment = { horizontal: "center", vertical: "middle" };
                });
            });

            // **Generate and Save Excel File**
            const buffer = await workbook.xlsx.writeBuffer();
            const data = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
            saveAs(data, "Good_Receipt_Note_(Report).xlsx");

        } catch (error) {
            console.error("Error generating the Excel file:", error);
        }
    };
    return (
        <div>
            <div>
                <div className="page-wrapper">
                    <div className="content">
                        <div className="page-header transfer">
                            <div className="add-item d-flex">
                                <div className="page-title">
                                    <h4>Good Recepite Note</h4>
                                </div>
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
                            <div className="d-flex purchase-pg-btn">
                                <div className="page-btn">
                                    <Link
                                        to="#"
                                        className="btn btn-added"
                                        data-bs-toggle="modal"
                                        data-bs-target="#AddGRN"
                                    >
                                        <PlusCircle className="me-2" />
                                        Add Good Recipt Note
                                    </Link>
                                </div>
                                <div className="page-btn">
                                    <Link to={route.PurchaseIndex} className="btn btn-secondary">
                                        <ArrowLeft className="me-2" />
                                        Back to Index
                                    </Link>
                                </div>
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
                                <div className="table-responsive product-list">
                                    <Table columns={columns} dataSource={GRNData} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <AddPurchases />
                <ImportPurchases />
                <EditPurchases />
                <AddGoodReciptNote
                    GRNAID={selectedData.grnaid}
                />
            </div>
        </div>
    )
}

export default GoodReciptNote;
