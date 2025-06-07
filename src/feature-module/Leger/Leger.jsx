import React from "react";
import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
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
import { Link, useNavigate } from "react-router-dom";

import {
    ArrowLeft,
    ChevronUp,
    Edit,
    Eye,

    PlusCircle,
    RotateCcw,


    Trash2,
} from "feather-icons-react/build/IconComponents";
import { getUserData } from "../../Context/UserData";
const Leger = () => {
    const dispatch = useDispatch();
    const data = useSelector((state) => state.toggle_header);
    const MySwal = withReactContent(Swal);
    const route = all_routes;
    const navigate = useNavigate();
    const { userdetail } = getUserData();
    const onEditClick = (accaid) => {
        navigate(route.AddLeger, { state: { accaid: accaid } });
    };
    const [searchQuery, setSearchQuery] = useState("");
    useEffect(() => {
        const handleKeyPress = (event) => {
            if (event.ctrlKey && event.key === "a") {
                event.preventDefault();
                navigate(route.AddLeger);
            }
        };

        document.addEventListener("keydown", handleKeyPress);
        return () => {
            document.removeEventListener("keydown", handleKeyPress);
        };
    }, [navigate]);
    const columns = [

        {
            title: "खाते क्रमांक",
            dataIndex: "accgid",
            // sorter: (a, b) => a.sku.length - b.sku.length,
        },
        {
            title: "मुख्य गट",
            dataIndex: "maingroup",
            // sorter: (a, b) => a.category.length - b.category.length,
        },
        {
            title: "उप गट",
            dataIndex: "subgroup",
            // sorter: (a, b) => a.brand.length - b.brand.length,
        },
        // {
        //     title: "जनरल लेजर",
        //     dataIndex: "generalacc",
        //     // sorter: (a, b) => a.price.length - b.price.length,
        // },
        {
            title: "जनरल लेजर",
            dataIndex: "acctm",
            // sorter: (a, b) => a.price.length - b.price.length,
        },


        {
            title: "कृती",
            dataIndex: "action",
            render: (_, record) => (
                <div className="action-table-data">
                    <div className="edit-delete-action">
                        <OverlayTrigger placement="top" overlay={<Tooltip id="edit-tooltip">Edit</Tooltip>}>
                            <a className="me-2 p-2" onClick={() => { onEditClick(record.accaid) }}>
                                <Edit className="feather-edit" />
                            </a>
                        </OverlayTrigger>
                        {/* <OverlayTrigger placement="top" overlay={<Tooltip id="delete-tooltip">Delete</Tooltip>}>
                            <Link
                                className="confirm-text p-2"
                                to="#"
                                onClick={() => showConfirmationAlert(record.accaid)}
                            >
                                <Trash2 className="feather-trash-2" />
                            </Link>
                        </OverlayTrigger> */}
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



        },
    ];

    const [Account, setAccount] = useState([]);
    useEffect(() => {
        try {
            const payload = {
                "accaid": "%",
                "keyword": '%',
                "companyid": userdetail?.companyID ? userdetail.companyID : "",
            }
            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            axios({
                method: "POST",
                url: baseUrl.Url + "/backend/api/GET_ACCOUNT",
                data: JSON.stringify(payload),
                headers: headers,
            })
                .then((response) => {
                    if (response.status != 200) throw new Error("Failed to Fetching Data");
                    const DATA = response.data;
                    setAccount(DATA);
                })

        } catch (error) {
            console.error("Error fetching Access Right Data:", error);
        }
    }, []);




    const OndeleteAccounts = async (accaid) => {
        try {
            const payload = {
                accaid: accaid,
            };
            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            // Perform the delete API call
            axios({
                method: "POST",
                url: baseUrl.Url + "/backend/api/SP_DeleteAccounts",
                data: JSON.stringify(payload),
                headers: headers,
            })
                .then((response) => {
                    if (response.status !== 200) throw new Error("Failed to Delete Data");

                    // Display success or failure message
                    MySwal.fire({
                        title: response.data[0].responseCode === "FAILURE" ? "डिलीट करणे शक्य नाही" : "डिलीट केले!",
                        text: response.data[0].responseMessage,
                        icon: response.data[0].responseCode === "FAILURE" ? "error" : "success",
                        confirmButtonText: "ठीक आहे",
                        customClass: {
                            confirmButton: response.data[0].responseCode === "FAILURE" ? "btn btn-danger" : "btn btn-success",
                        },
                        allowOutsideClick: false,
                        allowEscapeKey: false,

                    });

                    // After deletion, filter out the deleted account from the current state
                    setAccount((prevState) => prevState.filter((account) => account.accaid !== accaid));
                })
                .catch((error) => {
                    console.error("Error deleting account:", error);
                });
        } catch (error) {
            console.error("Error deleting account:", error);
        }
    };



    const showConfirmationAlert = (accaid) => {
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
                OndeleteAccounts(accaid);
            } else {
                MySwal.close();
            }
        });
    }


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

    const generatePDF = (Account) => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        doc.setFontSize(12);
        doc.setFont("Helvetica", "bold");
        const title = "Sale challan Report";
        const titleWidth = doc.getTextWidth(title);

        const borderMargin = 10;
        doc.rect(borderMargin, borderMargin, pageWidth - borderMargin * 2, pageHeight - borderMargin * 2);

        doc.text(title, (pageWidth - titleWidth) / 2, 20);
        doc.setLineWidth(0.5);
        doc.line((pageWidth - titleWidth) / 2, 22, (pageWidth + titleWidth) / 2, 22);

        doc.setFontSize(13);
        doc.setFont("Helvetica", "normal");
        let yPosition = 15;

        const tableColumn = ["खाते क्रमांक", "मुख्य गट", "उप गट", "जनरल लेजर"];
        const tableRows = Account.map((item) => [
            item.accgid,
            item.mgrpid,
            item.sgrpid,
            item.glrpid,
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
            const worksheet = workbook.addWorksheet("Acoounts Report");


            const headingRow = worksheet.addRow(["Acoounts Report"]);
            headingRow.getCell(1).font = { bold: true, size: 16 };
            headingRow.getCell(1).alignment = { horizontal: "center", vertical: "middle" };


            worksheet.mergeCells("A1:D1");


            const headers = ["खाते क्रमांक", "मुख्य गट", "उप गट", "जनरल लेजर"];
            const headerRow = worksheet.addRow(headers);

            headerRow.eachCell((cell) => {
                cell.font = { bold: true, color: { argb: "FFFFFF" } };
                cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "808080" } };
                cell.alignment = { horizontal: "center", vertical: "middle" };
            });

            const columnWidths = [40, 40, 40, 40];
            columnWidths.forEach((width, index) => {
                worksheet.getColumn(index + 1).width = width;
            });

            Account.forEach(({ accgid, mgrpid, sgrpid, glrpid }) => {
                const row = worksheet.addRow([accgid, mgrpid, sgrpid, glrpid]);
                row.eachCell((cell) => {
                    cell.alignment = { horizontal: "center", vertical: "middle" };
                });
            });

            const buffer = await workbook.xlsx.writeBuffer();
            const data = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
            saveAs(data, "Acoounts.xlsx");

        } catch (error) {
            console.error("Error generating the Excel file:", error);
        }
    };

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
        try {
            const payload = {
                "accaid": "%",
                "keyword": event.target.value,
                "companyid": userdetail?.companyID ? userdetail.companyID : "",
            }
            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            axios({
                method: "POST",
                url: baseUrl.Url + "/backend/api/GET_ACCOUNT/_Search",
                data: JSON.stringify(payload),
                headers: headers,
            })
                .then((response) => {
                    if (response.status != 200) throw new Error("Failed to Fetching Data");
                    const DATA = response.data;
                    setAccount(DATA);
                })

        } catch (error) {
            console.error("Error fetching Access Right Data:", error);
        }
    };


    return (
        <div className="page-wrapper">
            <div className="content">
                <div className="page-header">
                    <div className="add-item d-flex">
                        <div className="page-title">
                            <h3>लेजर</h3>
                            <h6>नवीन लेजर बनवा </h6>
                        </div>
                    </div>
                    <ul className="table-top-head">
                        <li>
                            <OverlayTrigger placement="top" overlay={renderTooltip}>
                                <Link onClick={() => generatePDF(Account)}>
                                    <ImageWithBasePath src="assets/img/icons/pdf.svg" alt="Download PDF" />
                                </Link>
                            </OverlayTrigger>
                        </li>
                        <li>
                            <OverlayTrigger placement="top" overlay={renderExcelTooltip}>
                                <Link onClick={() => exportToExcel(Account)}>
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
                        <Link to={route.AddLeger} className="btn btn-added">
                            <PlusCircle className="me-2 iconsize" /> लेजर नोंदवा
                        </Link>
                    </div>
                    <div className="page-btn">
                        <Link to={route.LegerIndex} className="btn btn-secondary">
                            <ArrowLeft className="me-2" />
                            मागे
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
                            <Table columns={columns} dataSource={Account} />
                        </div>
                    </div>
                </div>

                <Brand />
            </div>
        </div>
    );
};

export default Leger;

