import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ImageWithBasePath from "../../core/img/imagewithbasebath";
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
import { convertToCustomDate } from "../../core/json/custom";
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
// import Model1 from "../मापारी/Model1";
import AddAuction from "./AddAuction";
function Auction() {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const data = useSelector((state) => state.toggle_header);
    const route = all_routes;
    const { userdetail } = getUserData();
    const [auctionshed, setauctionshed] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [today, settoday] = useState("")
    useEffect(() => {
        const result = convertToCustomDate(userdetail.APPDT, 0);
        settoday(result);
    }, []);
    const fetchAuctionShed = async () => {
        const payload = {
            apkid: "%",
            keyword: '%',
            companyid: userdetail?.companyID ?? "",
            deptid: userdetail?.departmentID ?? "",
            date: userdetail.APPDT,
            "userid": userdetail?.uaid || "",
        };

        const headers = {
            "Content-Type": "application/json",
            Accept: "*/*",
        };

        try {
            const response = await axios.post(
                `${baseUrl.Url}/backend/api/GET_AUCTIONSHED`,
                JSON.stringify(payload),
                { headers }
            );

            if (response.status !== 200) {
                throw new Error("Failed to fetch data");
            }

            setauctionshed(response.data);
        } catch (error) {
            console.error("Error fetching auction shed data:", error);
        }
    };

    const [refreshFlag, setRefreshFlag] = useState(false);

    useEffect(() => {

        fetchAuctionShed();
    }, []);


    const handleSearch = (event) => {
        setSearchQuery(event.target.value);


        try {
            const payload = {
                "apkid": "%",
                "keyword": event.target.value,
                "companyid": userdetail?.companyID ? userdetail.companyID : "",
                "deptid": userdetail?.departmentID ? userdetail.departmentID : "",
                "date": userdetail.APPDT,
                "userid": userdetail?.uaid || "",
            }
            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            axios({
                method: "POST",
                url: baseUrl.Url + "/backend/api/GET_AUCTIONSHED/_Search",
                data: JSON.stringify(payload),
                headers: headers,
            })

                .then((response) => {
                    if (response.status != 200) throw new Error("Failed to send otp");
                    console.log("response", response.data);
                    setauctionshed(response.data);
                })
        } catch (error) {
            console.error("Error while searching Service data:", error);
        }
    };


    const [selectedData, setSelectedData] = useState({ apkid: null, iscompleted: null });

    const openModal = (apkid, iscompleted) => {
        setSelectedData({ apkid, iscompleted })

    }

    //Refresh
    // const [refreshFlag, setRefreshFlag] = useState(false);
    const refreshData = () => {
        setRefreshFlag(prev => !prev);
    };

    useEffect(() => {
        fetchAuctionShed();
        setSelectedData({ apkid: null, iscompleted: null });
    }, [refreshFlag]);



    const MySwal = withReactContent(Swal);
    const showConfirmationAlert = (apkid, token, iscompleted) => {
        if (iscompleted === true || iscompleted === 1) {
            Swal.fire({
                icon: "error",
                title: "त्रुटी",
                text: "बिल पूर्ण झाल्यामुळे हे लिलाव हटवता येणार नाही.",
                confirmButtonText: "ठीक आहे",
                allowOutsideClick: false,
                allowEscapeKey: false
            });
            return;
        }


        Swal.fire({
            title: "तुम्हाला खात्री आहे का?",
            text: "हे टोकन कायमचं हटवण्यात येईल.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "हो, हटवा",
            cancelButtonText: "रद्द करा"
        }).then((result) => {
            if (result.isConfirmed) {
                OndeleteQuatation(apkid, token);
            }
        });
    };


    const OndeleteQuatation = async (apkid, token) => {
        // const today = new Date().toISOString().split("T")[0];

        try {

            const payload = {
                apkid: apkid,
                companyid: userdetail?.companyID ? userdetail.companyID : "",
                deptid: userdetail?.departmentID ? userdetail.departmentID : "",
                token: token,
                date: userdetail.APPDT,
            };

            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            const response = await axios.post(
                `${baseUrl.Url}/backend/api/SP_DeleteAuctionMasters`,
                JSON.stringify(payload),
                { headers }
            );


            if (response.status !== 200) {
                throw new Error("Failed to delete auction shed");
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
                apkid: "%",
                keyword: "%",
                companyid: userdetail?.companyID || "",
                deptid: userdetail?.departmentID || "",
                date: userdetail.APPDT,
                // uaid: userdetail?.uaid || "",
                "userid": userdetail?.uaid || "",
            };

            const refreshResponse = await axios.post(
                `${baseUrl.Url}/backend/api/GET_AUCTIONSHED`,
                JSON.stringify(refreshPayload),
                { headers }
            );

            if (refreshResponse.status !== 200) {
                throw new Error("Failed to fetch auction shed data");
            }

            console.log("Quotation master", refreshResponse.data);
            setauctionshed(refreshResponse.data);
        } catch (error) {
            console.error("Error processing deletion:", error);
            MySwal.fire({
                title: "Error",
                text: error.message || "An unexpected error occurred.",
                icon: "error",
                confirmButtonText: "OK",
            });
        }
    };




    const columns = [
        {
            title: (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id="Member_Name-tooltip" style={{ textAlign: "center" }}>ट.क्र</Tooltip>}
                >
                    <span style={{ textAlign: "center" }}>ट.क्र</span>
                </OverlayTrigger>

            ),
            dataIndex: "token",
            render: (text) => <div style={{ textAlign: "right" }}>{text}</div>,
        },
        {
            title: (
                <OverlayTrigger placement="top" overlay={<Tooltip id="Member_Cantact-tooltip" style={{ textAlign: "center" }}>बि.क्र</Tooltip>}>
                    <span style={{ textAlign: "center" }}>बि.क्र</span>
                </OverlayTrigger>
            ),
            dataIndex: "billno",
            render: (text) => <div style={{ textAlign: "right" }}>{text}</div>,
        },
        {
            title: (
                <OverlayTrigger placement="top" overlay={<Tooltip id="Member_Cantact-tooltip" style={{ textAlign: "center" }}>दिनांक</Tooltip>}>
                    <span style={{ textAlign: "center" }}>दिनांक</span>
                </OverlayTrigger>
            ),
            dataIndex: "date",
            render: (text) => <div style={{ textAlign: "center" }}>{text}</div>,
        },
        {
            title: (
                <OverlayTrigger placement="top" overlay={<Tooltip id="Member_Email-tooltip" style={{ textAlign: "center" }}>शेतकऱ्याचे नाव</Tooltip>}>
                    <span style={{ textAlign: "center" }}>शेतकऱ्याचे नाव</span>
                </OverlayTrigger>
            ),
            dataIndex: "fname",
        },

        {
            title: (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id="types-tooltip" style={{ textAlign: "center" }}>स्थिती</Tooltip>}
                >
                    <div className="text-center w-100" style={{ textAlign: "center" }}>स्थिती</div>
                </OverlayTrigger>
            ),
            dataIndex: "iscompleted",
            // sorter: (a, b) => a.iscompleted.localeCompare(b.iscompleted),

            render: (text) => {
                const isCompleted = text === true || text === "true";
                return (
                    <OverlayTrigger
                        placement="top"
                        overlay={
                            <Tooltip id={`tooltip-${text}`}>
                                {isCompleted ? "Complete" : "Pending"}
                            </Tooltip>
                        }
                    >
                        <div style={{ textAlign: "center" }}>
                            <button
                                className={`btn btn-sm ${isCompleted ? "btn-success" : "btn-warning"} text-dark`}
                                style={{ color: "#000" }} // ensures text is black
                                disabled
                            >
                                {isCompleted ? "Completed" : "Pending"}
                            </button>
                        </div>
                    </OverlayTrigger>
                );

            },
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

                            onClick={async (e) => {
                                e.preventDefault();

                                await openModal(record.apkid, record.iscompleted);
                                const modal = document.getElementById("Model1");

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
                            <Edit className="feather-edit" />
                        </Link>

                        <Link
                            className="confirm-text p-2 me-2"
                            to="#"
                            onClick={() => showConfirmationAlert(record.apkid, record.token, record.iscompleted)}
                        >
                            <Trash2 className="feather-trash-2" />
                        </Link>
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
            const worksheet = workbook.addWorksheet("लिलाव शेड (हिशोब)");

            const headingRow = worksheet.addRow(["लिलाव शेड (हिशोब)"]);
            headingRow.getCell(1).font = { bold: true, size: 16 };
            headingRow.getCell(1).alignment = { horizontal: "center", vertical: "middle" };
            worksheet.mergeCells("A1:E1");

            const headers = ["टोकन क्रमांक", "बिल क्रमांक", "तारीख", "शेतकऱ्याचे नाव", "गाव"];
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

            auctionshed.forEach(({ token, billno, date, fname, village }) => {
                const row = worksheet.addRow([token, billno, date, fname, village]);
                row.eachCell((cell) => {
                    cell.alignment = { horizontal: "center", vertical: "middle" };
                });
            });

            const buffer = await workbook.xlsx.writeBuffer();
            const data = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
            saveAs(data, "लिलाव शेड (हिशोब).xlsx");

        } catch (error) {
            console.error("Error generating the Excel file:", error);
        }
    };


    const generatePDF = (Auctionshed) => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();

        const cleanBase64 = marathiFontBase64.replace(/^data:font\/ttf;base64,/, "");


        doc.addFileToVFS("NotoSansDevanagari.ttf", cleanBase64);
        doc.addFont("NotoSansDevanagari.ttf", "NotoSansDevanagari", "normal");


        doc.setFont("NotoSansDevanagari", "normal");
        doc.setFontSize(16);
        const title = "लिलाव शेड";
        doc.text(title, (pageWidth - doc.getTextWidth(title)) / 2, 20);


        const tableColumn = [["टोकन न.", "पावती न.", "तारीख", "शेतकरी नाव", "गाव"]];


        const tableRows = Auctionshed.map((item) => {
            const formattedDate = item.date
                ? new Date(item.date).toLocaleDateString("en-GB")
                : "N/A";

            return [
                item.token || "",
                item.billno || "",
                formattedDate,
                item.fname || "",
                item.village || ""
            ];
        });


        const sanitizedTableRows = tableRows.map(row =>
            row.map(cell => (cell ? cell.toString() : ""))
        );

        autoTable(doc, {
            startY: 30,
            head: tableColumn,
            body: sanitizedTableRows,


            headStyles: {
                font: "NotoSansDevanagari",
                fontSize: 14,
                fontStyle: "normal",
                fillColor: [0, 102, 204],
                textColor: 255,
            },

            styles: {
                font: "helvetica",
                fontSize: 12,
            },

            alternateRowStyles: { fillColor: [240, 240, 240] },
        });
        window.open(doc.output("bloburl"), "_blank");
    };


    useEffect(() => {
        const handleShortcut = async (e) => {
            if (e.ctrlKey && (e.key === "a" || e.key === "A")) {
                e.preventDefault();

                await openModal();
                const modal = document.getElementById("Model1");

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
                                <h3>मापारी</h3>
                            </div>
                        </div>
                        <ul className="table-top-head">
                            <li>
                                <OverlayTrigger placement="top" overlay={renderTooltip}>
                                    <Link
                                        to="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            generatePDF(auctionshed);
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

                        </ul>

                        <div className="col-12 col-md-6">
                            <div className="row g-2 justify-content-md-end mt-2 mt-md-auto">
                                <div className="col-12 col-md-5">
                                    <button
                                        type="button"
                                        className="btn btn-primary w-100"
                                        onClick={async (e) => {
                                            e.preventDefault();

                                            await openModal();
                                            const modal = document.getElementById("Model1");

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
                                        नवीन
                                    </button>
                                </div>
                                <div className="col-12 col-md-5">
                                    <button
                                        type="button"
                                        className="btn btn-secondary w-100"
                                        onClick={() => navigate(route.AuctionIndex)}
                                    >
                                        मागे
                                    </button>
                                </div>
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
                        <div className="card-body p-2">
                            <div className="table-responsive responsive-no-scroll">
                                <Table
                                    columns={columns}
                                    dataSource={auctionshed}
                                    pagination={false}
                                    scroll={false}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            < AddAuction apkid={selectedData.apkid} iscompleted={selectedData.iscompleted} onRefresh={refreshData} />
        </>
    )
}

export default Auction




