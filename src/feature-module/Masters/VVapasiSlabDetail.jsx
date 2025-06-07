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
import { baseUrl } from "../../core/json/custom"
import marathiFontBase64 from "../../style/fonts/NotoSansDevanagari";
import { useNavigate } from 'react-router-dom';

import {
    ArrowLeft,
    ChevronUp,
    RotateCcw,
    Edit,
    Trash2,
    PlusCircle,
}
    from "feather-icons-react/build/IconComponents";
import { getUserData } from "../../Context/UserData";
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

// import AddVyapariSlab from "./AddVyapariSlab";
import AddVVapasiSlabDetail from "./AddVVapasiSlabDetail";

function VVapasiSlabDetail() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const data = useSelector((state) => state.toggle_header);
    const route = all_routes;
    const { userdetail } = getUserData();
    const [vyapari, setvyapari] = useState([]);
    // const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        try {
            const payload = {
                vpid: "%",
                companyid: "",
                deptid: "",
            }
            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            axios({
                method: "POST",
                url: baseUrl.Url + "/backend/api/GET_VyapariVapasiDetails",
                data: JSON.stringify(payload),
                headers: headers,
            })
                .then((response) => {
                    if (response.status != 200) throw new Error("Failed to Fetching Data");
                    setvyapari(response.data);
                })

        } catch (error) {
            console.error("Error fetching Access Right Data:", error);
        }
    }, []);


    // const handleSearch = (event) => {
    //     setSearchQuery(event.target.value);
    //     try {
    //         const payload = {
    //             "apkid": "%",
    //             "keyword": event.target.value,
    //             "companyid": "",
    //             "deptid": "",
    //         }
    //         const headers = {
    //             "Content-Type": "application/json",
    //             Accept: "*/*",
    //         };

    //         axios({
    //             method: "POST",
    //             url: baseUrl.Url + "/backend/api/GET_AUCTIONSHED/_Search",
    //             data: JSON.stringify(payload),
    //             headers: headers,
    //         })

    //             .then((response) => {
    //                 if (response.status != 200) throw new Error("Failed to send otp");
    //                 console.log("response", response.data);
    //                 setauctionshed(response.data);
    //             })
    //     } catch (error) {
    //         console.error("Error while searching Service data:", error);
    //     }
    // };


    const [selectedData, setSelectedData] = useState({ vpid: null });
    const openModal = (vpid) => {
        setSelectedData({ vpid })
        document.getElementById("openModalBtn").click();
    }

    const MySwal = withReactContent(Swal);

    useEffect(() => {
        const handleShortcut = (e) => {
            if (e.ctrlKey && e.key === 'a') {
                e.preventDefault();
                navigate(route.AddVyapariSlab);
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

    const showConfirmationAlert = (vpid) => {
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
                OndeleteVyapari(vpid)
            } else {
                MySwal.close();
            }
        });
    };


    const OndeleteVyapari = async (vpid) => {
        try {
            const payload = {
                vpid: vpid,
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
                url: baseUrl.Url + "/backend/api/SP_DeleteVyapariVapasiDetails",
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
                    setvyapari((prevState) => prevState.filter((vyapari) => vyapari.vpid !== vpid));
                })
                .catch((error) => {
                    console.error("Error deleting account:", error);
                });
        } catch (error) {
            console.error("Error deleting account:", error);
        }
    };


    const columns = [

        {
            title: (
                <OverlayTrigger placement="top" overlay={<Tooltip id="Member_Cantact-tooltip">थकबाकीपासून दिवस</Tooltip>}>
                    <span>थकबाकीपासून दिवस</span>
                </OverlayTrigger>
            ),
            dataIndex: "duE_DAY",
            render: (text) => <div >{text}</div>,
        },



        {
            title: (
                <OverlayTrigger placement="top" overlay={<Tooltip id="Member_Email-tooltip">पर्यंत दिवस</Tooltip>}>
                    <span>पर्यंत दिवस</span>
                </OverlayTrigger>
            ),
            dataIndex: "tO_DAY",
        },


        {
            title: (
                <OverlayTrigger placement="top" overlay={<Tooltip id="Member_Email-tooltip">वापसी(%)</Tooltip>}>
                    <span>वापसी(%)</span>
                </OverlayTrigger>
            ),
            dataIndex: "vapasi",
        },




        {
            title: (
                <div className="d-flex justify-content-center">
                    <OverlayTrigger placement="top" overlay={<Tooltip id="action-tooltip">कृती</Tooltip>}>
                        <span>कृती</span>
                    </OverlayTrigger>
                </div>
            ),
            dataIndex: "action",
            render: (_, record) => (

                <div className="action-table-data">
                    <div className="edit-delete-action">
                        <Link className="me-2 p-2"
                            to="#"
                            data-bs-toggle="modal"
                            data-bs-target="#AddVyapariSlab"
                            onClick={() => openModal(record.vpid)}
                        >
                            <Edit className="feather-edit" />
                        </Link>
                        {/* Delete Button */}
                        <Link
                            className="confirm-text p-2 me-2"
                            to="#"
                            onClick={() => showConfirmationAlert(record.vpid)}
                        >
                            <Trash2 className="feather-trash-2" />
                        </Link>
                        {/* Proceed Button */}
                        {/* <Link className="me-2 p-2"
                            to="#"
                            data-bs-toggle="modal"
                            onClick={() => openModal(record.vsaid)}
                            data-bs-target="#AddVyapariSlab"
                            style={{ color: 'green' }}>
                            <i data-feather="arrow-right-circle" className="feather-arrow-right-circle"></i>
                        </Link> */}

                    </div>
                </div>
            ),
        },
    ];


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

    const downloadExcel = async () => {
        try {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("व्यापारी स्तर");

            const headingRow = worksheet.addRow(["व्यापारी स्तर"]);
            headingRow.getCell(1).font = { bold: true, size: 16 };
            headingRow.getCell(1).alignment = { horizontal: "center", vertical: "middle" };
            worksheet.mergeCells("A1:D1");

            const headers = ["सुरूवातीची दिनांक", "अंतिम दिनांक", "वापसी(%)", "कालावधी"];
            const headerRow = worksheet.addRow(headers);

            headerRow.eachCell((cell) => {
                cell.font = { bold: true, color: { argb: "FFFFFF" } };
                cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "808080" } };
                cell.alignment = { horizontal: "center", vertical: "middle" };
            });


            const columnWidths = [25, 25, 25, 25, 25, 18];
            columnWidths.forEach((width, index) => {
                worksheet.getColumn(index + 1).width = width;
            });

            vyapari.forEach(({ due_day, to_day, vapasi, kalavadhi }) => {
                const row = worksheet.addRow([due_day, to_day, vapasi, kalavadhi]);
                row.eachCell((cell) => {
                    cell.alignment = { horizontal: "center", vertical: "middle" };
                });
            });

            const buffer = await workbook.xlsx.writeBuffer();
            const data = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
            saveAs(data, "व्यापारी स्तर.xlsx");

        } catch (error) {
            console.error("Error generating the Excel file:", error);
        }
    };



    const generatePDF = (vyapari) => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();

        const cleanBase64 = marathiFontBase64.replace(/^data:font\/ttf;base64,/, "");

        doc.addFileToVFS("NotoSansDevanagari.ttf", cleanBase64);
        doc.addFont("NotoSansDevanagari.ttf", "NotoSansDevanagari", "normal");
        doc.setFont("NotoSansDevanagari", "normal");
        doc.setFontSize(16);

        console.log(doc.getFontList());

        const title = " व्यापारी स्तर अहवाल";
        doc.text(title, (pageWidth - doc.getTextWidth(title)) / 2, 20);

        const tableColumn = [["सुरूवातीची तारीख", "शेवटची तारीख", "वापसी(%)", "कालावधी"]];

        const tableRows = vyapari.map((item) => [
            item.due_day,
            item.to_day,
            item.vapasi,
            item.kalavadhi,
        ]);

        autoTable(doc, {
            startY: 30,
            head: tableColumn,
            body: tableRows,
            styles: { font: "NotoSansDevanagari", fontStyle: "normal", fontSize: 12 },
            headStyles: { fontStyle: "normal", fillColor: [0, 102, 204], textColor: 255, fontSize: 14 },
            alternateRowStyles: { fillColor: [240, 240, 240] },
            columnStyles: {
                0: {
                    font: "normal", // Marathi font for "नाव"
                    fontSize: 12
                },
                1: {
                    font: "normal", // Marathi font for "तारीख"
                    fontSize: 12
                },
                2: {
                    font: "normal", // Marathi font for "तक्रारीचे शीर्षक"
                    fontSize: 12
                }
            }
        });

        window.open(doc.output("bloburl"), "_blank");
    };


    useEffect(() => {
        const handleShortcut = (e) => {
            if (e.ctrlKey && (e.key === "a" || e.key === "A")) {
                e.preventDefault();

                // Ensure the modal trigger element exists before trying to click
                const modalTrigger = document.querySelector('[data-bs-target="#AddVyapariSlab"]');
                if (modalTrigger) {
                    modalTrigger.click();
                }
            }
        };

        window.addEventListener("keydown", handleShortcut);

        return () => {
            window.removeEventListener("keydown", handleShortcut);
        };
    }, []);


    return (
        <>
            <div className="page-wrapper">
                <div className="content">
                    <div className="page-header">
                        <div className="add-item d-flex">
                            <div className="page-title">
                                <h3> व्यापारी स्तर</h3>
                                {/* <h6>Manage Quotation</h6> */}
                            </div>
                        </div>
                        <ul className="table-top-head">
                            <li>
                                <OverlayTrigger placement="top" overlay={renderTooltip}>
                                    <Link
                                        to="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            generatePDF(vyapari);
                                        }}
                                    >
                                        <ImageWithBasePath src="assets/img/icons/pdf.svg" alt="Download PDF" />
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
                            <button
                                className="btn btn-added"
                                data-bs-toggle="modal"
                                data-bs-target="#AddVyapariSlab"
                            >
                                <PlusCircle className="me-2 iconsize" />
                                नवीन
                            </button>

                        </div>
                        <div className="page-btn">
                            <Link to={route.MasterIndex} className="btn btn-secondary">
                                <ArrowLeft className="me-2" />
                                मागे
                            </Link>
                        </div>
                    </div>
                    {/* <div className="search-container mb-3">
                        <div className="row">
                            <div className="col-lg-6 col-12 ms-auto">
                                <div className="input-group">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Search"
                                    // value={searchQuery}
                                    // onChange={handleSearch}
                                    />
                                    <span className="input-group-text">
                                        <i className="fa fa-search"></i>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div> */}
                    <div className="card table-list-card">
                        <div className="card-body">
                            <div className="table-responsive">
                                <Table columns={columns} dataSource={vyapari} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            < AddVVapasiSlabDetail vpid={selectedData.vpid} />

        </>
    )
}

export default VVapasiSlabDetail


