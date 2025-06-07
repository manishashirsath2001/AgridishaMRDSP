import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ImageWithBasePath from "../../core/img/imagewithbasebath";
// import Brand from "../../core/modals/inventory/brand";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { all_routes } from "../../Router/all_routes";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import Table from "../../core/pagination/datatable";
import { setToogleHeader } from "../../core/redux/action";
import axios from "axios";
import { baseUrl } from "../../core/json/custom";
import {
    ArrowLeft,
    ChevronUp,
    RotateCcw,
    Edit,
    Trash2,
    PlusCircle,
} from "feather-icons-react/build/IconComponents";
import { getUserData } from "../../Context/UserData";

import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import Model1 from "../Masters/Model1";
function QuatationMaster_1() {
    // const navigate = useNavigate();
    const dispatch = useDispatch();
    const data = useSelector((state) => state.toggle_header);
    const route = all_routes;
    const { userdetail } = getUserData();
    const [quatation, setquatation] = useState([]);
    const [selectedData, setSelectedData] = useState({ praid: null, vandorid: null, QSTATE: null });
    const [searchQuery, setSearchQuery] = useState("");
    useEffect(() => {
        try {
            const payload = {
                qamaid: "%",
                keyword: '%',
                companyid: userdetail?.companyID || "",
                deptid: userdetail?.departmentID || "",
            }
            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            axios({
                method: "POST",
                url: baseUrl.Url + "/backend/api/GET_QuatationMaster",
                data: JSON.stringify(payload),
                headers: headers,
            })
                .then((response) => {
                    if (response.status != 200) throw new Error("Failed to Fetching Data");
                    setquatation(response.data);
                })

        } catch (error) {
            console.error("Error fetching Access Right Data:", error);
        }
    }, [userdetail]);

    const OnReloadData = () => {
        try {
            const payload = {
                qamaid: "%",
                keyword: '%',
                companyid: userdetail?.companyID || "",
                deptid: userdetail?.departmentID || "",
            }
            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            axios({
                method: "POST",
                url: baseUrl.Url + "/backend/api/GET_QuatationMaster",
                data: JSON.stringify(payload),
                headers: headers,
            })
                .then((response) => {
                    if (response.status != 200) throw new Error("Failed to Fetching Data");
                    setquatation(response.data);
                })

        } catch (error) {
            console.error("Error fetching Access Right Data:", error);
        }
    }

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
        try {
            const payload = {
                "qamaid": "%",
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
                url: baseUrl.Url + "/backend/api/GET_QuatationMaster/_Search",
                data: JSON.stringify(payload),
                headers: headers,
            })

                .then((response) => {
                    if (response.status != 200) throw new Error("Failed to send otp");
                    console.log("response", response.data);
                    setquatation(response.data);
                })
        } catch (error) {
            console.error("Error while searching Service data:", error);
        }
    };

    // const onEditClick = (praid) => {
    //     navigate(route.AddRequisition, {
    //         state: {
    //             PRAID: praid
    //         },
    //     });
    // }

    // "Quotation No","Quotation Date","Payment Duration","Quotation Due Date"
    // qno,qdate,qpduedate,qduedate
    const columns = [
        {
            title: (
                <OverlayTrigger placement="top" overlay={<Tooltip id="Member_Name-tooltip">Quotation No</Tooltip>}>
                    <span>Quotation No</span>
                </OverlayTrigger>
            ),
            dataIndex: "qno",
        },
        {
            title: (
                <OverlayTrigger placement="top" overlay={<Tooltip id="Member_Cantact-tooltip">Quotation Date</Tooltip>}>
                    <span>Quotation Date</span>
                </OverlayTrigger>
            ),
            dataIndex: "qdate",
            render: (text) => <div style={{ textAlign: "right" }}>{text}</div>,
        },
        {
            title: (
                <OverlayTrigger placement="top" overlay={<Tooltip id="Member_Cantact-tooltip">Vendor Name</Tooltip>}>
                    <span>Payment Duration</span>
                </OverlayTrigger>
            ),
            dataIndex: "qpduedate",
            render: (text) => <div style={{ textAlign: "right" }}>{text}</div>,
        },
        {
            title: (
                <OverlayTrigger placement="top" overlay={<Tooltip id="Member_Email-tooltip">Quotation Due Date</Tooltip>}>
                    <span>Quotation Due Date</span>
                </OverlayTrigger>
            ),
            dataIndex: "qduedate",
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
                // <div className="action-table-data">
                //     <div className="edit-delete-action">
                //         {/* Tooltip for "View" icon */}
                //         <OverlayTrigger placement="top" overlay={<Tooltip id="view-tooltip">View</Tooltip>}>
                //             <Button
                //                 variant="link"
                //                 className="me-2 p-2"

                //             >
                //                 <Link
                //                     to="#"
                //                     className="btn btn-added"
                //                     data-bs-toggle="modal"
                //                     data-bs-target="#onprocedquatation"
                //                 >
                //                     <Eye className="feather-view" />
                //                 </Link>

                //             </Button>
                //         </OverlayTrigger>
                //     </div>
                // </div>
                <div className="action-table-data">
                    <div className="edit-delete-action">
                        <Link className="me-2 p-2"
                            to="#"
                            data-bs-toggle="modal"
                            data-bs-target="#onprocedquatationEdit"
                            onClick={() => openModal(record.qamaid, record.qvaid, record.qvaddress)}
                        >
                            <Edit className="feather-edit" />
                        </Link>
                        {/* Delete Button */}
                        <Link
                            className="confirm-text p-2 me-2"
                            to="#"
                            onClick={() => showConfirmationAlert(record.qamaid)}
                        >
                            <Trash2 className="feather-trash-2" />
                        </Link>
                        {/* Proceed Button */}
                        <Link className="me-2 p-2"
                            to="#"
                            data-bs-toggle="modal"
                            onClick={() => openModal(record.qamaid, record.qvaid)}
                            data-bs-target="#onproceedorder"
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
            ),
        },
    ];

    const openModal = (qamaid, qvaid, QSTATE) => {
        setSelectedData({ qamaid, qvaid, QSTATE });
        // setModalShow(true);
    };
    const MySwal = withReactContent(Swal);

    const showConfirmationAlert = (qamaid) => {
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
                OndeleteQuatation(qamaid)
            } else {
                MySwal.close();
            }
        });
    };


    const OndeleteQuatation = async (qamaid) => {
        try {
            const payload = {
                qamaid: qamaid,
                companyid: userdetail?.companyID || "",
                deptid: userdetail?.departmentID || ""
            };

            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            const response = await axios.post(
                `${baseUrl.Url}/backend/api/SP_DeleteQuatation`,
                JSON.stringify(payload),
                { headers }
            );

            if (response.status !== 200) {
                throw new Error("Failed to fetch data");
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
                const refreshPayload = {
                    qamaid: "%",
                    keyword: '%',
                    companyid: userdetail?.companyID || "",
                    deptid: userdetail?.departmentID || "",
                };

                const refreshResponse = await axios.post(
                    `${baseUrl.Url}/backend/api/GET_QuatationMaster`,
                    JSON.stringify(refreshPayload),
                    { headers }
                );

                if (refreshResponse.status !== 200) {
                    throw new Error("Failed to fetch vendor data");
                }

                console.log("Quatation master", refreshResponse.data);
                setquatation(refreshResponse.data);
            } catch (error) {
                console.error("Error fetching vendor data:", error);
            }

        } catch (error) {
            console.error("Error deleting quotation:", error);
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

    // "Quotation No","Quotation Date","Payment Duration","Quotation Due Date"
    // qno,qdate,qpduedate,qduedate

    const downloadExcel = async () => {
        try {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("Purchase Quatation (Report)");

            const headingRow = worksheet.addRow(["Purchase Quatation (Report)"]);
            headingRow.getCell(1).font = { bold: true, size: 16 };
            headingRow.getCell(1).alignment = { horizontal: "center", vertical: "middle" };

            // Merge heading across all columns
            worksheet.mergeCells("A1:E1");

            // **Header Row**
            const headers = ["Quotation No", "Quotation Date", "Payment Duration", "Quotation Due Date"];
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
            quatation.forEach(({ qno, qdate, qpduedate, qduedate }) => {
                const row = worksheet.addRow([qno, qdate, qpduedate, qduedate]);
                row.eachCell((cell) => {
                    cell.alignment = { horizontal: "center", vertical: "middle" };
                });
            });

            // **Generate and Save Excel File**
            const buffer = await workbook.xlsx.writeBuffer();
            const data = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
            saveAs(data, "Purchase Quatation_(Report).xlsx");

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
        const title = "Service Report";
        const titleWidth = doc.getTextWidth(title);

        const borderMargin = 10;
        doc.rect(borderMargin, borderMargin, pageWidth - borderMargin * 2, pageHeight - borderMargin * 2);

        doc.text(title, (pageWidth - titleWidth) / 2, 20);
        doc.setLineWidth(0.5);
        doc.line((pageWidth - titleWidth) / 2, 22, (pageWidth + titleWidth) / 2, 22);

        doc.setFontSize(13);
        doc.setFont("Helvetica", "normal");
        let yPosition = 15;


        const tableColumn = ["Quotation No", "Quotation Date", "Payment Duration", "Quotation Due Date"];

        // Table rows
        const tableRows = quatation.map(item => [
            item.qno,
            item.qdate,
            item.qpduedate,
            item.qduedate,
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
        doc.save("Purchase Quatation_(Report).pdf");
    };

    return (
        <>
            <div className="page-wrapper">
                <div className="content">
                    <div className="page-header">
                        <div className="add-item d-flex">
                            <div className="page-title">
                                <h3>Quotation Master</h3>
                                <h6>Manage Quotation</h6>
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
                                data-bs-target="#firstmodel"
                            >
                                <PlusCircle className="me-2 iconsize" />
                                Add Quotation
                            </button>

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
                                <Table columns={columns} dataSource={quatation} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* <OnProccedPurchaseOrder
                qamaid={selectedData.qamaid}
                vandorid={selectedData.qvaid}
                CSTATE={selectedData.QSTATE}
            />
            <AddQuatation />

            <OnEditQuatation
                QAMAID={selectedData.qamaid}
            /> */}
            < Model1 />
        </>
    )
}

export default QuatationMaster_1
