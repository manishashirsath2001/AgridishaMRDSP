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
import ExcelJS from "exceljs";
import marathiFontBase64 from "../../style/fonts/NotoSansDevanagari"
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

import {
    ArrowLeft,
    ChevronUp,
    Edit,
    Eye,

    PlusCircle,
    RotateCcw,


    Trash2,
} from "feather-icons-react/build/IconComponents";


const Advertise = () => {
    const dispatch = useDispatch();
    const data = useSelector((state) => state.toggle_header);
    const MySwal = withReactContent(Swal);
    const route = all_routes;
    const navigate = useNavigate();
    const onEditClick = (aDid) => {
        navigate(route.AddAdvertise, { state: { aDid: aDid } });
    };

    const columns = [
        {
            title: "फोटो", // Column Title
            dataIndex: "aDimage", // Data index
            render: (imageName) => {
                const fileUrl = `${baseUrl.Url}/Images/${imageName}`; // Construct the image URL
                return (
                    <img
                        src={fileUrl}
                        alt={imageName}
                        style={{ width: 70, height: 70, objectFit: 'cover' }} // Style to make it look nice (resize as needed)
                    />
                );
            },
        },

        {
            title: "शीर्षक",
            dataIndex: "aDtitle",
            // sorter: (a, b) => a.sku.length - b.sku.length,
        },
        {
            title: " स्थिती",
            dataIndex: "isactive",
            // sorter: (a, b) => a.category.length - b.category.length,
        },

        // {
        //     title: "जनरल लेजर",
        //     dataIndex: "glrpid",
        //     // sorter: (a, b) => a.price.length - b.price.length,
        // },


        {
            title: "Action",
            dataIndex: "action",
            render: (_, record) => (
                <div className="action-table-data">
                    <div className="edit-delete-action">
                        <OverlayTrigger placement="top" overlay={<Tooltip id="edit-tooltip">Edit</Tooltip>}>
                            <a className="me-2 p-2" onClick={() => { onEditClick(record.aDid) }}>
                                <Edit className="feather-edit" />
                            </a>
                        </OverlayTrigger>
                        <OverlayTrigger placement="top" overlay={<Tooltip id="delete-tooltip">Delete</Tooltip>}>
                            <Link
                                className="confirm-text p-2"
                                to="#"
                                onClick={() => showConfirmationAlert(record.aDid)}
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

    const [Advertisement, setAdvertisement] = useState([]);
    useEffect(() => {
        try {
            const payload = {
                aDid: "%",
                keyword: '%',
                companyid: "",
                deptid: "",
            }
            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            axios({
                method: "POST",
                url: baseUrl.Url + "/backend/api/GET_Advertisement",
                data: JSON.stringify(payload),
                headers: headers,
            })
                .then((response) => {
                    if (response.status != 200) throw new Error("Failed to Fetching Data");
                    const DATA = response.data;
                    setAdvertisement(DATA);
                })

        } catch (error) {
            console.error("Error fetching Access Right Data:", error);
        }
    }, []);




    const OndeleteAccounts = async (aDid) => {
        try {
            const payload = {
                aDid: aDid,
                companyid: "",
                deptid: "",
            };
            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            // Perform the delete API call
            axios({
                method: "POST",
                url: baseUrl.Url + "/backend/api/SP_DeleteAdvertisement",
                data: JSON.stringify(payload),
                headers: headers,
            })
                .then((response) => {
                    if (response.status !== 200) throw new Error("Failed to Delete Data");

                    // Display success or failure message
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

                    // After deletion, filter out the deleted account from the current state
                    setAdvertisement((prevState) => prevState.filter((Advertisement) => Advertisement.aDid !== aDid));
                })
                .catch((error) => {
                    console.error("Error deleting account:", error);
                });
        } catch (error) {
            console.error("Error deleting account:", error);
        }
    };



    const showConfirmationAlert = (aDid) => {
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
                OndeleteAccounts(aDid);
            } else {
                MySwal.close();
            }
        });
    }


    useEffect(() => {
        const handleShortcut = (e) => {
            if (e.ctrlKey && e.key === 'a') {
                e.preventDefault();
                navigate(route.AddAdvertise);
            }
            if (e.ctrlKey && e.key === 'e') {
                e.preventDefault();
                navigate(route.test);
            }
        };

        window.addEventListener('keydown', handleShortcut);

        return () => {
            window.removeEventListener('keydown', handleShortcut);
        };
    }, [navigate]);

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

    const generatePDF = (Notification) => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();

        const cleanBase64 = marathiFontBase64.replace(/^data:font\/ttf;base64,/, "");

        doc.addFileToVFS("NotoSansDevanagari.ttf", cleanBase64);
        doc.addFont("NotoSansDevanagari.ttf", "NotoSansDevanagari", "normal");
        doc.setFont("NotoSansDevanagari", "normal");
        doc.setFontSize(16);

        console.log(doc.getFontList());

        const title = " सुचना अहवाल";
        doc.text(title, (pageWidth - doc.getTextWidth(title)) / 2, 20);

        const tableColumn = ["शीर्षक", "तारीख", "समाप्ती तारीख"];
        const tableRows = Notification.map((item) => [
            item.notiTitle,
            item.notiSDate,
            item.notiNDate,

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
            const worksheet = workbook.addWorksheet("Acoounts Report");


            const headingRow = worksheet.addRow(["Acoounts Report"]);
            headingRow.getCell(1).font = { bold: true, size: 16 };
            headingRow.getCell(1).alignment = { horizontal: "center", vertical: "middle" };


            worksheet.mergeCells("A1:E1");


            const headers = ["शीर्षक", "तारीख", "समाप्ती तारीख"];
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

            Notification.forEach(({ notiTitle, notiSDate, notiNDate }) => {
                const row = worksheet.addRow([notiTitle, notiSDate, notiNDate]);
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

    return (
        <div className="page-wrapper">
            <div className="content">
                <div className="page-header">
                    <div className="add-item d-flex">
                        <div className="page-title">
                            <h3>जाहिरात मास्टर</h3>
                            <h6>  जाहिरात करणे </h6>
                        </div>
                    </div>
                    <ul className="table-top-head">
                        <li>
                            <OverlayTrigger placement="top" overlay={renderTooltip}>
                                <Link onClick={() => generatePDF(Advertisement)}>
                                    <ImageWithBasePath src="assets/img/icons/pdf.svg" alt="Download PDF" />
                                </Link>
                            </OverlayTrigger>
                        </li>
                        <li>
                            <OverlayTrigger placement="top" overlay={renderExcelTooltip}>
                                <Link onClick={() => exportToExcel(Advertisement)}>
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
                        <Link to={route.AddAdvertise} className="btn btn-added">
                            <PlusCircle className="me-2 iconsize" /> नवीन जाहिरात
                        </Link>
                    </div>
                    <div className="page-btn">
                        <Link to={route.AppAdminIndex} className="btn btn-secondary">
                            <ArrowLeft className="me-2" />
                            परत जा
                        </Link>
                    </div>
                </div>

                <div className="card table-list-card">
                    <div className="card-body">
                        <div className="table-responsive">
                            <Table columns={columns} dataSource={Advertisement} />
                        </div>
                    </div>
                </div>

                <Brand />
            </div>
        </div>
    );
};

export default Advertise;
