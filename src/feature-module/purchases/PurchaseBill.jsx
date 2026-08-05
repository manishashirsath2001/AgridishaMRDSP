
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
import axios from "axios";
import { baseUrl } from "../../core/json/custom";
import { getUserData } from "../../Context/UserData";
// import AddPurchases from "../../core/modals/purchases/addpurchases";
// import EditPurchases from "../../core/modals/purchases/editpurchases"
// import AddPurchaseBill from "./AddPurchaseBill";

import {
    ArrowLeft,
    ChevronUp,
    PlusCircle,
    RotateCcw,
    Trash2,
} from "feather-icons-react/build/IconComponents";
import AddPurchaseInvoice from "./AddPurchaseInvoice";
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
const PurchaseBill = () => {
    const dispatch = useDispatch();
    const data = useSelector((state) => state.toggle_header);
    const route = all_routes;
    const { userdetail } = getUserData();
    // const navigate = useNavigate();
    const [billdata, setbilldata] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    // const primaryKey = 'PK123456';
    // const oneditClick = () => {
    //     navigate("/AddStateCodeMaster", { state: { SCAID: "pko1" } });
    // };


    // useEffect(() => {
    //     // Temporary mock data
    //     const mockData = [
    //         {
    //             BillNo: "B001",
    //             BillDate: "2025-01-10",
    //             ChallanNo: "C001",
    //             VendorName: "ABC Supplies",
    //             NetAmount: "5000",
    //             action: "view",
    //         },
    //         {
    //             BillNo: "B002",
    //             BillDate: "2025-01-09",
    //             ChallanNo: "C002",
    //             VendorName: "XYZ Traders",
    //             NetAmount: "3000",
    //             action: "view",
    //         },
    //         {
    //             BillNo: "B003",
    //             BillDate: "2025-01-08",
    //             ChallanNo: "C003",
    //             VendorName: "PQR Enterprises",
    //             NetAmount: "7000",
    //             action: "view",
    //         },
    //     ];


    //     setStateList(mockData);


    // }, []);

    useEffect(() => {
        if (userdetail) {
            const fetchVendors = async () => {
                try {
                    const payload = {
                        pbaid: "%",
                        keyword: "%",
                        companyid: userdetail?.companyID || "",
                        deptid: userdetail?.departmentID || "",
                    };
                    const headers = {
                        "Content-Type": "application/json",
                        Accept: "*/*",
                    };
                    const response = await axios.post(
                        `${baseUrl.Url}/backend/api/GET_PBillMaster`,
                        payload,
                        { headers }
                    );
                    if (response.status !== 200)
                        throw new Error("Failed to fetch vendor data");
                    console.log("quatation master", response.data)
                    setbilldata(response.data);
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
                pbaid: "%",
                keyword: "%",
                companyid: userdetail?.companyID || "",
                deptid: userdetail?.departmentID || "",
            };
            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };
            const response = await axios.post(
                `${baseUrl.Url}/backend/api/GET_PBillMaster`,
                payload,
                { headers }
            );
            if (response.status !== 200)
                throw new Error("Failed to fetch vendor data");
            console.log("quatation master", response.data)
            setbilldata(response.data);
        } catch (error) {
            console.error("Error fetching vendor data:", error);
        }
    }

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
        try {
            const payload = {
                "pbaid": "%",
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
                url: baseUrl.Url + "/backend/api/GET_PBillMaster/_Search",
                data: JSON.stringify(payload),
                headers: headers,
            })

                .then((response) => {
                    if (response.status != 200) throw new Error("Failed to send otp");
                    console.log("response", response.data);
                    setbilldata(response.data);
                })
        } catch (error) {
            console.error("Error while searching Service data:", error);
        }
    };

    const [selectedData, setSelectedData] = useState({ pbaid: null });
    const openModal = (pbaid) => {
        setSelectedData({ pbaid });
        // setModalShow(true);
    };

    const columns = [
        {
            title: "Bill No",
            dataIndex: "pbbillno",
            sorter: (a, b) => a.pbbillno.length - b.pbbillno.length,
        },
        {
            title: "Bill Date",
            dataIndex: "pbdate",
            sorter: (a, b) => a.pbdate.length - b.pbdate.length,
        },
        {
            title: "Challan No",
            dataIndex: "pbchallanno",
            sorter: (a, b) => a.pbchallanno.length - b.pbchallanno.length,
        },
        {
            title: "Vendor Name",
            dataIndex: "pbvendorid",
            sorter: (a, b) => a.pbvendorid.length - b.pbvendorid.length,
        },
        {
            title: "Net Amount",
            dataIndex: "pbnetamount",
            sorter: (a, b) => a.pbnetamount.length - b.pbnetamount.length,
        },

        {
            title: "Action",
            dataIndex: "action",
            render: (_, record) => (
                <div className="action-table-data">
                    <div className="edit-delete-action">
                        <Link
                            to="#"
                            className="me-2 p-2"
                            data-bs-toggle="modal"
                            data-bs-target="#AddPurchaseInvoice"
                            onClick={() => openModal(record.pbaid)}>
                            <i data-feather="edit" className="feather-edit"></i>
                        </Link>



                        <Link
                            className="confirm-text p-2"
                            to="#"
                            onClick={() => showConfirmationAlert(record.pbaid)}
                        >
                            <Trash2 className="feather-trash-2" />
                        </Link>
                    </div>
                </div>
            ),
        },
    ];

    const MySwal = withReactContent(Swal);

    const showConfirmationAlert = (pbaid) => {
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
                OndeletePurchaseChallan(pbaid)
            } else {
                MySwal.close();
            }
        });
    };


    const OndeletePurchaseChallan = async (pbaid) => {
        try {
            const payload = {
                pbaid: pbaid,
                companyid: userdetail?.companyID || "",
                deptid: userdetail?.departmentID || ""
            };

            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            // First API call to delete the purchase challan
            const response = await axios.post(
                `${baseUrl.Url}/backend/api/SP_DeletePBill`,
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

            try {
                const payload = {
                    pbaid: "%",
                    keyword: "%",
                    companyid: userdetail?.companyID || "",
                    deptid: userdetail?.departmentID || "",
                };
                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };
                const response = await axios.post(
                    `${baseUrl.Url}/backend/api/GET_PBillMaster`,
                    payload,
                    { headers }
                );
                if (response.status !== 200)
                    throw new Error("Failed to fetch vendor data");
                console.log("quatation master", response.data)
                setbilldata(response.data);
            } catch (error) {
                console.error("Error fetching vendor data:", error);
            }

        } catch (error) {
            console.error("Error during delete or fetching data:", error);
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
        <Tooltip id="collapse-tooltip" {...props}>
            Collapse
        </Tooltip>
    );

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
            item.pbbillno,
            item.pbdate,
            item.pbchallanno,
            item.pbvendorid,
            item.pbnetamount,

        ]);

        let totalpbmnamt = billdata.reduce((sum, item) => sum + parseFloat(item.pbnetamount || 0), 0);

        const totalRow = [
            { content: "", colSpan: 3 },
            { content: "Total", styles: { fontStyle: "bold" } },
            { content: totalpbmnamt.toFixed(2), styles: { fontStyle: "bold" } },

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
            const worksheet = workbook.addWorksheet("Purchase Bill Report");


            const headingRow = worksheet.addRow(["Purchase Bill Report"]);
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


            billdata.forEach(({ pbbillno, pbdate, pbchallanno, pbvendorid, pbnetamount }) => {
                const row = worksheet.addRow([pbbillno, pbdate, pbchallanno, pbvendorid, pbnetamount]);
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
        <div className="page-wrapper">
            <div className="content">
                <div className="page-header">
                    <div className="add-item d-flex">
                        <div className="page-title">
                            <h3>Purchase Bill Master</h3>
                            <h6>Manage your Purchase Bill Master</h6>
                        </div>
                    </div>
                    <ul className="table-top-head">
                        <li>
                            <OverlayTrigger placement="top" overlay={renderTooltip}>
                                <Link onClick={() => generatePDF(billdata)}>
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
                        <Link
                            to="#"
                            className="btn btn-added"
                            data-bs-toggle="modal"
                            data-bs-target="#AddPurchaseInvoice"
                        >
                            <PlusCircle className="me-2" />
                            Add New Purchase
                        </Link>
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
                            <Table columns={columns} dataSource={billdata} />
                        </div>
                    </div>
                </div>

                <Brand />
            </div>
            {/* <AddPurchaseBill /> */}
            <AddPurchaseInvoice
                PBAID={selectedData.pbaid}
            />
        </div>
    );
};

export default PurchaseBill;















