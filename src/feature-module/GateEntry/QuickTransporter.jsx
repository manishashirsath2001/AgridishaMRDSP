import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";

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
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Link, useNavigate } from "react-router-dom";
import { saveAs } from 'file-saver';
import ExcelJS from "exceljs";
import marathiFontBase64 from "../../style/fonts/NotoSansDevanagari"

import {
    ArrowLeft,
    ChevronUp,
    Edit,
    Eye,

    PlusCircle,
    RotateCcw,


    Trash2,
} from "feather-icons-react/build/IconComponents";

const QuickTransporter = () => {
    // const [selectedData, setSelectedData] = useState({ taid: null });
    // const openPage = (taid) => {
    //   setSelectedData({ taid });
    // };
    const navigate = useNavigate();
    const onEditClick = (taid) => {
        navigate(route.AddTransporter, { state: { TAID: taid, ID: '102' } });
    };
    const onAddClick = () => {
        navigate(route.AddTransporter, { state: { ID: '102' } });
    };
    const [Transporters, setTransporters] = useState([]);
    const dispatch = useDispatch();
    const data = useSelector((state) => state.toggle_header);
    const route = all_routes;

    const columns = [

        {
            title: "पूर्ण नाव",
            dataIndex: "tname",
            // sorter: (a, b) => a.sku.length - b.sku.length,
        },
        {
            title: "मोबाईल क्रमांक",
            dataIndex: "tcantactno",
            // sorter: (a, b) => a.category.length - b.category.length,
        },
        // {
        //   title: "वाहन क्रमांक",
        //   dataIndex: "vehicalno",
        //   // sorter: (a, b) => a.brand.length - b.brand.length,
        // },
        // {
        //   title: "वाहन प्रकार",
        //   dataIndex: "vehicaltype",
        //   // sorter: (a, b) => a.price.length - b.price.length,
        // },
        {
            title: "दिनांक",
            dataIndex: "tdate",
            // sorter: (a, b) => a.category.length - b.category.length,
        },


        {
            title: "Action",
            dataIndex: "action",
            render: (_, record) => (
                <div className="action-table-data">
                    <div className="edit-delete-action">
                        <OverlayTrigger placement="top" overlay={<Tooltip id="edit-tooltip">Edit</Tooltip>}>
                            <a className="me-2 p-2" onClick={() => { onEditClick(record.taid) }}>
                                <Edit className="feather-edit" />
                            </a>
                        </OverlayTrigger>
                        <OverlayTrigger placement="top" overlay={<Tooltip id="delete-tooltip">Delete</Tooltip>}>
                            <Link
                                className="confirm-text p-2"
                                to="#"
                                onClick={() => showConfirmationAlert(record.taid)}
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



        },
    ];

    const MySwal = withReactContent(Swal);




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

    useEffect(() => {
        try {
            const payload = {
                "taid": "%",
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
                url: baseUrl.Url + "/backend/api/GET_Transporters",
                data: JSON.stringify(payload),
                headers: headers,
            })
                .then((response) => {
                    if (response.status != 200) throw new Error("Failed to Fetching Data");
                    const DATA = response.data;
                    setTransporters(DATA);
                })

        } catch (error) {
            console.error("Error fetching Access Right Data:", error);
        }
    }, []);






    const OndeleteTransporter = async (taid) => {
        try {
            const payload = {
                "taid": taid,
                "companyid": "",
                "deptid": "",

            }
            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            axios({
                method: "POST",
                url: baseUrl.Url + "/backend/api/SP_DeleteTransporter",
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
                            "taid": "%",
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
                            url: baseUrl.Url + "/backend/api/GET_Transporters",
                            data: JSON.stringify(payload),
                            headers: headers,
                        })
                            .then((response) => {
                                if (response.status != 200) throw new Error("Failed to Fetching Data");
                                const DATA = response.data;
                                setTransporters(DATA);
                            })

                    } catch (error) {
                        console.error("Error fetching Access Right Data:", error);
                    }
                })

        } catch (error) {
            console.error("Error fetching Access Right Data:", error);
        }

    }

    const showConfirmationAlert = (taid) => {
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
                OndeleteTransporter(taid);
            } else {
                MySwal.close();
            }
        });
    };



    useEffect(() => {
        const handleShortcut = (e) => {
            if (e.ctrlKey && e.key === 'a') {
                e.preventDefault();
                navigate(route.AddTransporter);
            }
            if (e.ctrlKey && e.key === 'e') {
                e.preventDefault();
                navigate(route.GateEntryIndex);
            }
        };

        window.addEventListener('keydown', handleShortcut);

        return () => {
            window.removeEventListener('keydown', handleShortcut);
        };
    }, [navigate]);



    const generatePDF = (Transporters) => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();

        const cleanBase64 = marathiFontBase64.replace(/^data:font\/ttf;base64,/, "");

        doc.addFileToVFS("NotoSansDevanagari.ttf", cleanBase64);
        doc.addFont("NotoSansDevanagari.ttf", "NotoSansDevanagari", "normal");
        doc.setFont("NotoSansDevanagari", "normal");
        doc.setFontSize(16);

        console.log(doc.getFontList());

        const title = " वाहक नोंदणी अहवाल";
        doc.text(title, (pageWidth - doc.getTextWidth(title)) / 2, 20);

        const tableColumn = [["वाहक नाव", "मोबाईल नंबर", "तारीख"]];

        const tableRows = Transporters.map((item) => [
            item.tname,
            item.tcantactno,
            item.tdate,
        ]);

        autoTable(doc, {
            startY: 30,
            head: tableColumn,
            body: tableRows,
            styles: { font: "NotoSansDevanagari", fontStyle: "normal", fontSize: 12 },
            headStyles: { fontStyle: "normal", fillColor: [0, 102, 204], textColor: 255, fontSize: 14 },
            alternateRowStyles: { fillColor: [240, 240, 240] },
        });

        window.open(doc.output("bloburl"), "_blank");
    };



    const exportToExcel = async () => {
        try {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("वाहक नोंदणी अहवाल");


            const headingRow = worksheet.addRow(["वाहक नोंदणी अहवाल"]);
            headingRow.getCell(1).font = { bold: true, size: 16 };
            headingRow.getCell(1).alignment = { horizontal: "center", vertical: "middle" };


            worksheet.mergeCells("A1:C1");


            const headers = ["पूर्ण नाव", "मोबाईल क्रमांक", "दिनांक"];
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

            Transporters.forEach(({ tname, tcantactno, tdate }) => {
                const row = worksheet.addRow([tname, tcantactno, tdate]);
                row.eachCell((cell) => {
                    cell.alignment = { horizontal: "center", vertical: "middle" };
                });
            });

            const buffer = await workbook.xlsx.writeBuffer();
            const data = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
            saveAs(data, "वाहक नोंदणी अहवाल.xlsx");

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
                            <h3>वाहतूक नोंदणी</h3>
                            <h6>वाहतूक नोंदणी</h6>
                        </div>
                    </div>
                    <ul className="table-top-head">
                        <li>
                            <OverlayTrigger placement="top" overlay={renderTooltip}>
                                <Link onClick={() => generatePDF(Transporters)}>
                                    <ImageWithBasePath src="assets/img/icons/pdf.svg" alt="Download PDF" />
                                </Link>
                            </OverlayTrigger>
                        </li>
                        <li>
                            <OverlayTrigger placement="top" overlay={renderExcelTooltip}>
                                <Link onClick={() => exportToExcel(Transporters)}>
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
                        <Link to="#" onClick={(e) => {
                            e.preventDefault();
                            onAddClick();
                        }} className="btn btn-added">
                            <PlusCircle className="me-2 iconsize" /> नवीन
                        </Link>

                    </div>
                    <div className="page-btn">
                        <Link to={route.GateEntryIndex} className="btn btn-secondary">
                            <ArrowLeft className="me-2" />
                            मागे
                        </Link>
                    </div>
                </div>

                {/* <div className="card table-list-card">
                    <div className="card-body">
                        <div className="table-responsive">
                            <Table columns={columns} dataSource={Transporters} />
                        </div>
                    </div>
                </div> */}

                <div className="card table-list-card">
                    <div className="card-body p-2">
                        <div className="table-responsive responsive-no-scroll">
                            <Table
                                columns={columns}
                                dataSource={Transporters}
                                pagination={false}
                                scroll={false} // ensure ant-table doesn't enforce horizontal scroll
                            />
                        </div>
                    </div>
                </div>

                <Brand />
            </div>

        </div>
    );
};

export default QuickTransporter;

