
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { Link } from "react-router-dom";
import ImageWithBasePath from "../../core/img/imagewithbasebath";
import Brand from "../../core/modals/inventory/brand";
// import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { all_routes } from "../../Router/all_routes";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import Table from "../../core/pagination/datatable";
import { setToogleHeader } from "../../core/redux/action";
import { useEffect } from "react";

import axios from "axios";
import { baseUrl } from "../../core/json/custom";
import {
    ArrowLeft, ChevronUp, PlusCircle, RotateCcw, CheckCircle, Edit, Trash2,
} from "feather-icons-react/build/IconComponents";

// import BillPopup from "../../feature-module/FinanceAccounts/BillPopup";
// import AddVyaparislab from "../../feature-module/FinanceAccounts/AddVyaparislab"
import withReactContent from "sweetalert2-react-content";


import { useNavigate } from "react-router-dom";
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import marathiFontBase64 from "../../style/fonts/NotoSansDevanagari";
// import AddVyapariJama from "../../feature-module/Masters/AddVyapariJama";
import AddVyapariBharana from "./AddVyapariBharana";




const VyapariBharana = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const data = useSelector((state) => state.toggle_header);
    const route = all_routes;

    const [vyapariJamaMaster, setVyapariJamaMaster] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedData, setSelectedData] = useState({ vaid: null });
    const [refreshFlag, setRefreshFlag] = useState(false);// for Refresh






    // fetch VyapariJamaMaster Master Data 
    useEffect(() => {

        const fetchVyapariJamaMaster = async () => {
            try {
                const payload = {
                    "vjaid": "%",
                    "keyword": "%",
                    "companyid": userdetail?.companyID ? userdetail.companyID : "",
                    "deptid": userdetail?.departmentID ? userdetail.departmentID : "",
                };
                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };
                const response = await axios.post(
                    `${baseUrl.Url}/backend/api/GET_VyapariJamaMaster`,
                    payload,
                    { headers }
                );
                if (response.status !== 200)
                    throw new Error("Failed to fetch ");
                console.log("GET_VyapariJamaMaster", response.data)
                setVyapariJamaMaster(response.data);
            } catch (error) {
                console.error("Error fetching GET_VyapariJamaMaster data:", error);
            }
        };

        fetchVyapariJamaMaster();

    }, []);

    // fetch by Search  VyapariSlabTMasetr Data
    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
        try {
            const payload = {
                "vsaid": "%",
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
                url: baseUrl.Url + "/backend/api/GET_vyapariSlabMaster/_Search",
                data: JSON.stringify(payload),
                headers: headers,
            })

                .then((response) => {
                    if (response.status != 200) throw new Error("Failed to send otp");
                    console.log("response", response.data);
                    setVyapariJamaMaster(response.data);
                })
        } catch (error) {
            console.error("Error while searching Service data:", error);
        }
    };


    //delete Api
    const OndeleteRequisition = async (vsaid) => {
        try {
            const payload = {
                "vsaid": vsaid,
                "companyid": userdetail?.companyID ? userdetail.companyID : "",
                "deptid": userdetail?.departmentID ? userdetail.departmentID : "",
            }
            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            axios({
                method: "POST",
                url: baseUrl.Url + "/backend/api/SP_DeleteVyapariSlabMaster",
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
                            "vsaid": "%",
                            "keyword": "%",
                            "companyid": userdetail?.companyID ? userdetail.companyID : "",
                            "deptid": userdetail?.departmentID ? userdetail.departmentID : "",
                        };
                        const headers = {
                            "Content-Type": "application/json",
                            Accept: "*/*",
                        };

                        axios({
                            method: "POST",
                            url: baseUrl.Url + "/backend/api/GET_VyapariSlabMaster",
                            data: JSON.stringify(payload),
                            headers: headers,
                        })
                            .then((response) => {
                                if (response.status != 200) throw new Error("Failed to Fetching Data");
                                const DATA = response.data;
                                setVyapariJamaMaster(DATA);
                            })

                    } catch (error) {
                        console.error("Error fetching Access Right Data:", error);
                    }
                })

        } catch (error) {
            console.error("Error fetching Access Right Data:", error);
        }

    }

    const MySwal = withReactContent(Swal);

    const showConfirmationAlert = (vsaid) => {
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

                OndeleteRequisition(vsaid);
            } else {
                MySwal.close();
            }
        });
    };



    // for Refresh
    const refreshData = () => {
        setRefreshFlag(prev => !prev);
    };
    // for Refresh
    useEffect(() => {
        setSelectedData({ vsaid: null }); // 👈 Clear after refresh
    }, [refreshFlag]);

    const OnEdit = (vsaid) => {
        setSelectedData({ vsaid: vsaid });

    };


    //dowload excel function
    const exportToExcel = async () => {
        try {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("व्यापारी स्लॅब रीपोर्ट ");

            const headingRow = worksheet.addRow(["व्यापारी स्लॅब रीपोर्ट "]);
            headingRow.getCell(1).font = { bold: true, size: 16 };
            headingRow.getCell(1).alignment = { horizontal: "center", vertical: "middle" };

            worksheet.mergeCells("A1:C1");

            const headers = ["स्कीम नंबर ", "स्कीम दिनांक", "स्कीम नाव", "संदर्भ"];
            const headerRow = worksheet.addRow(headers);

            headerRow.eachCell((cell) => {
                cell.font = { bold: true, color: { argb: "FFFFFF" } };
                cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "808080" } };
                cell.alignment = { horizontal: "center", vertical: "middle" };
            });

            const columnWidths = [20, 20, 20, 20, 20, 20, 20]; // Adjust widths as needed
            columnWidths.forEach((width, index) => {
                worksheet.getColumn(index + 1).width = width;
            });

            vyapariJamaMaster.forEach(({ schemeno, schemedate, schemename, description }) => {
                const row = worksheet.addRow([schemeno, schemedate, schemename, description]);
                row.eachCell((cell) => {
                    cell.alignment = { horizontal: "center", vertical: "middle" };
                });
            });



            const buffer = await workbook.xlsx.writeBuffer();
            const data = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
            saveAs(data, "व्यापारी स्लॅब रीपोर्ट.xlsx");
            // console.log(marathiFontBase64);

        } catch (error) {
            console.error("Error generating the Excel file:", error);
        }
    };


    // dowload pdf function
    const generatePDF = (vyapariJamaMaster) => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();

        const cleanBase64 = marathiFontBase64.replace(/^data:font\/ttf;base64,/, "");

        doc.addFileToVFS("NotoSansDevanagari.ttf", cleanBase64);
        doc.addFont("NotoSansDevanagari.ttf", "NotoSansDevanagari", "normal");

        // Title: Marathi font
        doc.setFont("NotoSansDevanagari", "normal");
        doc.setFontSize(16);
        const title = "व्यापारी स्लॅब अहवाल";
        doc.text(title, (pageWidth - doc.getTextWidth(title)) / 2, 20);

        // Table headings in Marathi
        const tableColumn = [["स्कीम नंबर", "स्कीम दिनांक", "स्कीम नाव", "संदर्भ "]];

        // Table body data in English
        const tableRows = vyapariJamaMaster.map((item) => {
            const formattedDate = item.tarikh
                ? new Date(item.tarikh).toLocaleDateString("en-GB")
                : "N/A";

            const formattedVehNo = (item.vehicleno && item.vehicleno.trim())
                ? item.vehicleno.trim().replace(/([A-Za-z]{2})(\d{2})([A-Za-z]{1,2})(\d{4})/, "$1 $2 $3 $4")
                : "N/A";

            return [
                item.schemeno || "",
                item.schemedate || "",
                item.schemename || "",
                item.description || "",
                formattedDate,
                formattedVehNo
            ];
        });

        const sanitizedTableRows = tableRows.map(row =>
            row.map(cell => (cell ? cell.toString() : ""))
        );

        // Table generation
        autoTable(doc, {
            startY: 30,
            head: tableColumn,
            body: sanitizedTableRows,

            // Heading in Marathi
            headStyles: {
                font: "NotoSansDevanagari",
                fontSize: 14,
                fontStyle: "normal",
                fillColor: [0, 102, 204],
                textColor: 255,
            },

            // Body data in English
            styles: {
                font: "helvetica", // English font
                fontSize: 12,
            },

            alternateRowStyles: { fillColor: [240, 240, 240] },
        });

        window.open(doc.output("bloburl"), "_blank");
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
    const renderEditTooltip = (props) => (
        <Tooltip id="Edit-tooltip" {...props}>
            Edit
        </Tooltip>
    );
    const renderDeleteTooltip = (props) => (
        <Tooltip id="Edit-tooltip" {...props}>
            Delete
        </Tooltip>
    );
    const renderActionTooltip = (props) => (
        <Tooltip id="action-tooltip" {...props}>
            Action
        </Tooltip>
    );




    const columns = [
        {

            title: (
                <div className="d-flex justify-content-center">
                    <OverlayTrigger placement="top" overlay={<Tooltip id="schemeno-tooltip">स्कीम नंबर</Tooltip>}>
                        <span style={{ cursor: "pointer" }}>स्कीम नंबर</span>
                    </OverlayTrigger>
                </div>
            ),
            dataIndex: "schemeno",
            // sorter: (a, b) => a.SCHEMENO.length - b.SCHEMENO.length,
            render: (text) => (
                <OverlayTrigger placement="top" overlay={<Tooltip id="schemeno-tooltip">{text}</Tooltip>}>
                    <div style={{ textAlign: "left" }}>{text}</div>
                </OverlayTrigger>
            ),
        },

        {
            title: (
                <div className="d-flex justify-content-center">
                    <OverlayTrigger placement="top" overlay={<Tooltip id="schemedate-tooltip">स्कीम दिनांक</Tooltip>}>
                        <span style={{ cursor: "pointer" }}>स्कीम दिनांक</span>
                    </OverlayTrigger>
                </div>
            ),
            dataIndex: "schemedate",
            // sorter: (a, b) => a.billno.length - b.billno.length,
            render: (text) => (
                <OverlayTrigger placement="top" overlay={<Tooltip id="schemedate-tooltip">{text}</Tooltip>}>
                    <div style={{ textAlign: "center" }}>{text}</div>
                </OverlayTrigger>
            ),
        },


        {
            title: (
                <div className="d-flex justify-content-center">
                    <OverlayTrigger placement="top" overlay={<Tooltip id="schemename-tooltip">स्कीम नाव</Tooltip>}>
                        <span style={{ cursor: "pointer" }}>स्कीम नाव</span>
                    </OverlayTrigger>
                </div>
            ),
            dataIndex: "schemename",
            // sorter: (a, b) => a.schemename.length - b.schemename.length,
            render: (text) => (
                <OverlayTrigger placement="top" overlay={<Tooltip id="schemename-tooltip">{text}</Tooltip>}>
                    <div style={{ textAlign: "left" }}>{text}</div>
                </OverlayTrigger>
            ),
        },

        // {
        //     title: (
        //         <div className="d-flex justify-content-center">
        //             <OverlayTrigger placement="top" overlay={<Tooltip id="description-tooltip">DESCRIPTION</Tooltip>}>
        //                 <span style={{ cursor: "pointer" }}>DESCRIPTION</span>
        //             </OverlayTrigger>
        //         </div>
        //     ),
        //     dataIndex: "description",
        //     // sorter: (a, b) => a.description.length - b.description.length,
        //     render: (text) => (
        //         <OverlayTrigger placement="top" overlay={<Tooltip id="description-tooltip">{text}</Tooltip>}>
        //             <div style={{ textAlign: "left" }}>{text}</div>
        //         </OverlayTrigger>
        //     ),
        // },

        {
            title: (
                <div className="d-flex justify-content-center">
                    <OverlayTrigger placement="top" overlay={<Tooltip id="status-tooltip">स्थिती </Tooltip>}>
                        <span style={{ cursor: "pointer" }}>स्थिती </span>
                    </OverlayTrigger>
                </div>
            ),
            dataIndex: "status",
            align: "center",
            render: (text) => (
                <span className={`badge ${text == 0 ? "badge-success" : "badge-danger"}`} style={{ cursor: "pointer" }}>
                    <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip id="status-tooltip">{text == 0 ? "ACtive" : "InActive"}</Tooltip>}
                    >
                        <Link to="#" style={{ color: "white", textDecoration: "none" }}>
                            {text == 0 ? "ACtive" : "InActive"}
                        </Link>
                    </OverlayTrigger>
                </span>
            )

        },

        {
            title: (
                <OverlayTrigger placement="top" overlay={renderActionTooltip}>
                    < div className="d-flex justify-content-center" >
                        कृती
                    </div >
                </OverlayTrigger>

            ),
            dataIndex: "action",
            render: (_, record) => (
                <div className="action-table-data">
                    <div className="edit-delete-action">



                        {/* EdIT */}
                        <OverlayTrigger
                            placement="top"
                            overlay={renderEditTooltip}
                        >
                            {/* <Link
                                className="me-2 p-2"
                                to="#"
                                onClick={() => OnEdit(record.vsaid)
                                    
                                }
                                style={{ color: "green" }}
                            >
                                <Edit className="feather-Edit" />
                            </Link> */}
                            <Link
                                className="me-2 p-2"
                                to="#"
                                onClick={() => {
                                    OnEdit(record.vsaid); // your custom logic here

                                    const modal = document.getElementById("AddVyapariJama");

                                    if (modal) {
                                        modal.classList.add("show");
                                        modal.style.display = "block";
                                        modal.setAttribute("aria-modal", "true");
                                        modal.setAttribute("role", "dialog");
                                        modal.removeAttribute("aria-hidden");

                                        const backdrop = document.createElement("div");
                                        backdrop.className = "modal-backdrop fade show";
                                        document.body.appendChild(backdrop);

                                        document.body.classList.add("modal-open");
                                        document.body.style.overflow = "hidden";
                                        document.body.style.paddingRight = "0px";
                                    }
                                }}
                                style={{ color: "green" }}
                            >
                                <Edit className="feather-Edit" />
                            </Link>


                        </OverlayTrigger>

                        {/* Delete */}
                        <OverlayTrigger
                            placement="top"
                            overlay={renderDeleteTooltip}
                        >
                            <Link
                                className="confirm-text p-2"
                                to="#"
                                onClick={() => showConfirmationAlert(record.vsaid)}
                            >
                                <Trash2 className="feather-trash-2" />
                            </Link>
                        </OverlayTrigger>




                    </div>
                </div >
            ),
        },
    ];


    // Empty data source
    // const dataSource = [];

    return (
        <div className="page-wrapper">
            <div className="content">
                <div className="page-header">
                    <div className="add-item d-flex">
                        <div className="page-title">
                            <h3>व्यापारी जमा   </h3>
                            <h6>म्यानेज व्यापारी जमा </h6>
                        </div>
                    </div>
                    <ul className="table-top-head">

                        <li>
                            <OverlayTrigger placement="top" overlay={renderTooltip}>
                                <Link
                                    to="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        generatePDF(vyapariJamaMaster);
                                    }}
                                >
                                    <ImageWithBasePath src="assets/img/icons/pdf.svg" alt="Download PDF" />
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
                            onClick={() => {
                                const modal = document.getElementById("AddVyapariJama");

                                if (modal) {
                                    modal.classList.add("show");
                                    modal.style.display = "block";
                                    modal.setAttribute("aria-modal", "true");
                                    modal.setAttribute("role", "dialog");
                                    modal.removeAttribute("aria-hidden");

                                    const backdrop = document.createElement("div");
                                    backdrop.className = "modal-backdrop fade show";
                                    document.body.appendChild(backdrop);

                                    document.body.classList.add("modal-open");
                                    document.body.style.overflow = "hidden";
                                    document.body.style.paddingRight = "0px";
                                }
                            }}
                        >
                            <PlusCircle className="me-2" />
                            नवीन
                        </button>
                    </div>


                    <div className="page-btn">
                        <Link to={route.MarketBillIndex} className="btn btn-secondary">
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
                            <Table columns={columns} dataSource={vyapariJamaMaster} />
                        </div>
                    </div>
                </div>

                <Brand />
            </div>

            {/* <AddVyaparislab
                VSAID={selectedData.vsaid}
                onRefresh={refreshData}// for refresh
            /> */}

            <AddVyapariBharana />


        </div>
    );
};

export default VyapariBharana;
