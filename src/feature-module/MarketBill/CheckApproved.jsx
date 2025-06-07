import React, { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ImageWithBasePath from "../../core/img/imagewithbasebath";
import Brand from "../../core/modals/inventory/brand";
import { all_routes } from "../../Router/all_routes";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import Table from "../../core/pagination/datatable";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import marathiFontBase64 from "../../style/fonts/NotoSansDevanagari";
import { baseUrl } from "../../core/json/custom";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { toWords } from "number-to-words";
dayjs.extend(utc);


import {
    ArrowLeft,
    ChevronUp,
    RotateCcw,
} from "feather-icons-react/build/IconComponents";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";
import { getUserData } from "../../Context/UserData";
// import AddChequeApproved from "./AddChequeApproved";
import AddCheckApproved from "./AddCheckApproved";
import AddCheckAprovv from "./AddCheckAprovv";

const CheckApproved = () => {
    const navigate = useNavigate();

    const inputRefs = useRef([]);
    const dispatch = useDispatch();
    const data = useSelector((state) => state.toggle_header);
    const { isAuthenticated, userdetail } = getUserData();
    if (isAuthenticated == true) {
        console.log("user", userdetail);
        console.log("getUserData", getUserData);
    }
    const route = all_routes;
    const [CheckApproved, setCheckApproved] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const handlePrint3 = () => {
        const printContent = printRef.current.innerHTML;
        const win = window.open("", "_blank");
        win.document.write(`
            <html>
            <head>
                <title>Print Cheque</title>
                <style>
                @media print {
                    html, body {
                    margin: 0;
                    padding: 0;
                    width: 9cm;
                    height: 20.2cm;
                    overflow: hidden;
                    }

                    body {
                    transform: rotate(-90deg);
                    transform-origin: top left;
                    width: 20.2cm;
                    height: 9cm;
                    position: absolute;
                    top: 0;
                    left: -19cm; /* Moves the rotated content back into view */
                 
                    }
                }

                .cheque-layout {
                    width: 20.2cm;
                    height: 9cm;
                    position: relative;
                    font-family: Arial, sans-serif;
                    font-size: 14px;
                    box-sizing: border-box;
                }

                .field {
                    position: absolute;
                    white-space: nowrap;
                }

                .name {
                    top: 1.5cm;
                    left: 2.5cm;
                }

                .amount-words {
                    top: 2.5cm;
                    left: 2.5cm;
                    width: 14cm;
                    overflow: hidden;
                }

                .amount-numeric {
                    top: 3.3cm;
                    right: 2cm;
                }

                .cheque-date {
                    top: 0.5cm;
                    right: 0.1cm;
                    letter-spacing: 2px;
                }
                </style>
            </head>
            <body>${printContent}</body>
            </html>
        `);
        win.document.close();
        win.focus();
        win.print();
        win.close();
    };


    const generatePDF = (CheckApproved) => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();

        const cleanBase64 = marathiFontBase64.replace(/^data:font\/ttf;base64,/, "");

        doc.addFileToVFS("NotoSansDevanagari.ttf", cleanBase64);
        doc.addFont("NotoSansDevanagari.ttf", "NotoSansDevanagari", "normal");


        doc.setFont("NotoSansDevanagari", "normal");
        doc.setFontSize(16);
        const title = "चेक अहवाल";
        doc.text(title, (pageWidth - doc.getTextWidth(title)) / 2, 20);


        const tableColumn = [["शेतकरी नाव", "बँकेची तपशील ", "चेक नं ", "चेक तारीख ", "चेक रक्कम", "पेमेंटचे अपडेट"]];


        const tableRows = CheckApproved.map((item) => {
            const formatDate = (dateString) => {
                try {
                    const date = new Date(dateString);
                    if (isNaN(date)) return "-";
                    const day = String(date.getDate()).padStart(2, '0');
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const year = date.getFullYear();
                    return `${day}/${month}/${year}`;
                } catch {
                    return "-";
                }
            };

            const bankInfo = `${item.fbankname || ''}\n${item.fifsccode || ''}\n${item.faccountno || ''}`;
            return [
                item.fullname || "",
                bankInfo,
                item.chequeno || "",
                formatDate(item.chequedate),
                item.chequeamount || "",
                item.status === true ? "Complete" : "Pending"

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

    const exportToExcel = async () => {
        try {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("चेक अहवाल");


            const headingRow = worksheet.addRow(["चेक अहवाल"]);
            headingRow.getCell(1).font = { bold: true, size: 16 };
            headingRow.getCell(1).alignment = { horizontal: "center", vertical: "middle" };
            worksheet.mergeCells("A1:F1");


            const headers = ["शेतकरी नाव", "बँकेची तपशील ", "चेक नं ", "चेक तारीख", "चेक रक्कम", "पेमेंटचे अपडेट"];
            const headerRow = worksheet.addRow(headers);
            headerRow.eachCell((cell) => {
                cell.font = { bold: true, color: { argb: "FFFFFF" } };
                cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "808080" } };
                cell.alignment = { horizontal: "center", vertical: "middle" };
            });


            const columnWidths = [20, 40, 20, 20, 20, 20];
            columnWidths.forEach((width, index) => {
                worksheet.getColumn(index + 1).width = width;
            });


            const formatDate = (dateString) => {
                try {
                    const date = new Date(dateString);
                    if (isNaN(date)) return "-";
                    const day = String(date.getDate()).padStart(2, '0');
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const year = date.getFullYear();
                    return `${day}/${month}/${year}`;
                } catch {
                    return "-";
                }
            };


            CheckApproved.forEach(({ fullname, fbankname, fifsccode, faccountno, chequeno, chequedate, chequeamount, status }) => {
                const bankInfo = `${fbankname || ""}\n${fifsccode || ""}\n${faccountno || ""}`;
                const paymentStatus = status === true ? "Complete" : "Pending";
                const row = worksheet.addRow([
                    fullname || "",
                    bankInfo,
                    chequeno || "",
                    formatDate(chequedate),
                    chequeamount || "",
                    paymentStatus,
                ]);

                row.height = 40;
                row.eachCell((cell) => {
                    cell.alignment = { horizontal: "left", vertical: "middle", wrapText: true };
                });
            });


            const buffer = await workbook.xlsx.writeBuffer();
            const data = new Blob([buffer], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            saveAs(data, "चेक_अहवाल.xlsx");
        } catch (error) {
            console.error("Error generating the Excel file:", error);
        }
    };

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
        try {

            const payload = {
                "pkid": "%",
                "keyword": event.target.value,
                companyid: userdetail?.companyID ? userdetail.companyID : "",
                deptid: userdetail?.departmentID ? userdetail.departmentID : ""
            }
            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            axios({
                method: "POST",
                url: baseUrl.Url + "/backend/api/GET_CashCounterMatchData/_Search",
                data: JSON.stringify(payload),
                headers: headers,
            })

                .then((response) => {
                    if (response.status != 200) throw new Error("Failed to send otp");
                    console.log("response", response.data);
                    setCheckApproved(response.data);
                })
        } catch (error) {
            console.error("Error while searching Gate Entry data:", error);
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

    ;

    const generateChequePDF = (chequeList) => {
        const doc = new jsPDF("landscape", "mm", [205, 76]);



        const formatDate = (dateString) => {
            const date = new Date(dateString);
            return isNaN(date)
                ? "DD/MM/YYYY"
                : `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
        };


        const toAmountInWords = (amount) => {
            const value = parseFloat(amount);
            if (isNaN(value)) return "Zero Rupees Only";

            const rupees = Math.floor(value);
            const paise = Math.round((value - rupees) * 100);

            let words = `${toWords(rupees)} Rupees`;
            if (paise > 0) words += ` and ${toWords(paise)} Paise`;

            return words.charAt(0).toUpperCase() + words.slice(1) + "Only";
        };


        chequeList.forEach((data, index) => {
            const chequeDate = formatDate(data.chequedate);
            const payeeName = data.fullname || "__________________";
            const amount = parseFloat(data.chequeamount);
            const amountStr = isNaN(amount) ? "0.00" : amount.toFixed(2);
            const amountWords = toAmountInWords(amount);

            doc.setFont("helvetica", "bold");
            doc.setFontSize(10);



            drawDateInBoxes(doc, chequeDate, 165, 3.8); //3.6
            doc.text(payeeName, 25, 17);
            doc.text(amountWords, 29, 23);
            doc.text(`₹ ${amountStr}`, 160, 32);       //31 


            if (index < chequeList.length - 1) {
                doc.addPage();
            }
        });


        doc.autoPrint();
        window.open(doc.output("bloburl"), "_blank");
    };


    const drawDateInBoxes = (doc, dateStr, startX, startY) => {
        const dateChars = dateStr.replace(/\//g, "").split("");
        const boxSpacing = 4.7;

        dateChars.forEach((char, index) => {
            doc.text(char, startX + index * boxSpacing, startY);
        });
    };

    const handlePrintCheque = async () => {
        try {
            const payload = {
                pkid: "%",
                keyword: "%",
                companyid: userdetail?.companyID ? userdetail.companyID : "",
                deptid: userdetail?.departmentID ? userdetail.departmentID : ""
            };

            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*"
            };


            const response = await axios({
                method: "POST",
                url: baseUrl.Url + "/backend/api/GET_CashCounterMatchData",
                data: JSON.stringify(payload),
                headers: headers,
            });


            if (response.status !== 200) {
                throw new Error("Failed to fetch cheque data");
            }


            console.log("Fetched cheque Counter Data:", response.data);


            const chequeList = Array.isArray(response.data) ? response.data : [response.data];
            generateChequePDF(chequeList);
        } catch (error) {
            console.error("Error fetching cheque data:", error);
            alert("Error fetching cheque data: " + error.message);
        }
    };


    useEffect(() => {
        try {
            const payload = {
                "pkid": "%",
                "keyword": "%",
                companyid: userdetail?.companyID ? userdetail.companyID : "",
                deptid: userdetail?.departmentID ? userdetail.departmentID : ""
            };

            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            axios({
                method: "POST",
                url: baseUrl.Url + "/backend/api/GET_CashCounterMatchData",
                data: JSON.stringify(payload),
                headers: headers,
            })
                .then((response) => {

                    if (response.status !== 200) throw new Error("Failed to Fetching Data");
                    setCheckApproved(response.data);
                    console.log("Fetched cheque Counter Data:", response.data);
                });

        } catch (error) {
            console.error("Error fetching cheque Counter Data:", error);
        }
    }, []);


    const [selectedData, setSelectedData] = useState({ pkid: null, baid: null });

    const openModal = (pkid, baid) => {
        setSelectedData({ pkid, baid })
        setTimeout(() => {
            setSelectedData(pkid, baid);

        }, 10);

    }

    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState({ pkid: null });

    const openEditModal = (pkid) => {
        setSelectedRecord({ pkid });
        setShowEditModal(true);
        setTimeout(() => {
            setSelectedRecord(pkid);

        }, 10);
    };
    const columns = [

        {
            title: (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id="types-tooltip">शेतकऱ्याचे नाव</Tooltip>}
                >
                    <div>शेतकऱ्याचे नाव</div>
                </OverlayTrigger>
            ),
            dataIndex: "fullname",
            width: "4%",
            render: (text, record, index) => (
                <input
                    type="text"

                    ref={(el) => inputRefs.current[`fullname-${index}`] = el}
                    value={record.chequeapproved || record.fullname}
                    onChange={(e) => handleFullnameChange(e.target.value, index)}
                    onKeyDown={(e) => handleFullnameEnterSave(e, index, 'chequeno')}
                    style={{
                        width: "100%",
                        height: "40px",
                        padding: "8px 12px",
                        borderRadius: "3px",
                        border: "1px solid #ccc",
                        fontSize: "1rem",
                        boxSizing: "border-box",
                    }}
                />
            )
        },

        {
            title: (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id="types-tooltip">बँकेची माहिती</Tooltip>}
                >
                    <div className="text-center">बँकेची माहिती</div>
                </OverlayTrigger>
            ),
            dataIndex: "fbankname",
            width: "8%",
            render: (text, record) => {
                const { fbankname, fifsccode, faccountno } = record;
                return (
                    <OverlayTrigger
                        placement="top"
                        overlay={
                            <Tooltip id={`tooltip-${record.pkid}`}>
                                {fbankname}<br />{fifsccode}<br />{faccountno}
                            </Tooltip>
                        }
                    >
                        <div style={{ textAlign: "left", padding: "0 5px", whiteSpace: "pre-line" }}>
                            <strong>{fbankname}</strong><br />
                            {fifsccode}<br />
                            {faccountno}
                        </div>
                    </OverlayTrigger>
                );
            },
        },

        {
            title: (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id="types-tooltip">चेक क्र.</Tooltip>}
                >
                    <div className="text-center w-100">चेक क्र.</div>
                </OverlayTrigger>
            ),
            dataIndex: "chequeno",
            width: "5%",
            render: (text, record, index) => (
                <input
                    type="text"
                    ref={(el) => inputRefs.current[`chequeno-${index}`] = el}
                    value={record.chequeno || ""}
                    onChange={(e) => handleChequeNoChange(e.target.value, index)}
                    onKeyDown={(e) => handleFullnameEnterSave(e, index, 'chequedate')}
                    style={{
                        width: "150%",
                        height: "40px",
                        padding: "8px 12px",
                        borderRadius: "3px",
                        border: "1px solid #ccc",
                        fontSize: "1rem",
                        boxSizing: "border-box",
                    }}
                />
            )
        },

        {
            title: (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id="types-tooltip">चेक दिनांक</Tooltip>}
                >
                    <div className="text-center w-100">चेक दिनांक</div>
                </OverlayTrigger>
            ),
            dataIndex: "chequedate",
            width: "1%",
            render: (text, record, index) => (
                <input
                    id={`chequedate-${index}`}
                    type="date"
                    ref={(el) => inputRefs.current[`chequedate-${index}`] = el}
                    value={
                        record.chequedate
                            ? formatDateToYYYYMMDD(record.chequedate)
                            : ""
                    }

                    onChange={(e) => handleChequeDateChange(e.target.value, index)}
                    onKeyDown={(e) => handleFullnameEnterSave(e, index + 1, 'fullname')}
                    style={{
                        width: "80%",
                        height: "40px",
                        padding: "8px 12px",
                        borderRadius: "3px",
                        border: "1px solid #ccc",
                        fontSize: "1rem",
                        boxSizing: "border-box",
                    }}
                />
            )
        },



        {
            title: (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id="types-tooltip">चेक रक्कम</Tooltip>}
                >
                    <div className="text-center w-100">चेक रक्कम</div>
                </OverlayTrigger>
            ),
            dataIndex: "chequeamount",
            width: "2%",
            render: (text) => (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id={`tooltip-${text}`}>{text}</Tooltip>}
                >
                    <div style={{ textAlign: "left", padding: "0 5px" }}>{text}</div>
                </OverlayTrigger>
            ),
        },
        {
            title: (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id="types-tooltip">पेमेंटचे अपडेट</Tooltip>}
                >
                    <div className="text-center w-75">पेमेंटचे अपडेट</div>
                </OverlayTrigger>
            ),
            dataIndex: "status",
            width: "3%",
            render: (status) => {
                const isComplete = status == 1;
                const badgeClass = isComplete
                    ? "bg-success text-white"
                    : "bg-warning text-dark";

                const label = isComplete ? "Complete" : "Pending";

                return (
                    <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip id={`tooltip-${label}`}>{label}</Tooltip>}
                    >
                        <span
                            className={`badge ${badgeClass} d-flex justify-content-center`}
                            style={{ padding: "7px 12px", fontSize: "0.875rem" }}
                        >
                            {label}
                        </span>
                    </OverlayTrigger>
                );
            }
        },

        {
            title: (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id="types-tooltip">बिल </Tooltip>}
                >
                    <div className="text-center">बिल </div>
                </OverlayTrigger>
            ),
            dataIndex: "action",
            width: "3%",
            render: (_, record) => (
                <div className="action-table-data">
                    <div className="edit-delete-action">
                        <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip id="delete-tooltip me-2">View</Tooltip>}
                        >
                            <Link
                                className="me-2 p-2"
                                to="#" data-bs-toggle="modal"
                                data-bs-target="#print-receipt"
                                style={{ color: 'orange' }}
                                onClick={() => openModal(record.pkid, record.baid)}
                            >

                                <i data-feather="eye" className="feather-eye"></i>
                            </Link>
                        </OverlayTrigger>
                        {/* Edit Button */}
                        <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip id="edit-tooltip">Edit</Tooltip>}
                        >
                            <Link
                                className="p-2"
                                to="#" data-bs-toggle="modal"
                                data-bs-target="#AddCheckAprovv"
                                style={{ color: 'blue' }}
                                onClick={() => openEditModal(record.pkid)}
                            >
                                <i data-feather="edit" className="feather-edit"></i>
                            </Link>
                        </OverlayTrigger>
                    </div>
                </div>
            ),
        },
    ];




    const handleFullnameEnterSave = async (e, index, nextFieldKey) => {
        if (e.key === "Enter") {
            e.preventDefault();

            const row = CheckApproved[index];

            const payload = {
                pkid: row.pkid,
                baid: "",
                faid: "",
                tokenno: "",
                billno: "",
                tarikh: "",
                fullname: row.fullname || "",
                vehicleno: "",
                amount: 0,
                billamount: 0,
                cashamount: 0,
                chequeamount: 0,
                onlineamount: 0,
                remainingamount: 0,
                status: 0,
                Chequeapproved: row.chequeapproved || "",
                companyid: userdetail?.companyID ? userdetail.companyID : "",
                deptid: userdetail?.departmentID ? userdetail.departmentID : "",
                ischecked: true,
                chequedate: row.chequedate || "",
                chequeno: row.chequeno || "",
            };

            try {
                const response = await axios.post(
                    `${baseUrl.Url}/backend/api/SP_AddUpdCashCounterName`,
                    payload
                );

                if (response.status === 200) {
                    console.log(`Row ${row.pkid} updated successfully`);
                    const nextKey = `${nextFieldKey}-${index}`;
                    setTimeout(() => {
                        inputRefs.current[nextKey]?.focus();
                    }, 0);

                } else {
                    console.error(`Failed to update row ${row.pkid}`);
                }
            } catch (error) {
                console.error(`Error updating row ${row.pkid}:`, error);
            }
        }
    };
    const handleChequeNoChange = async (value, index) => {
        const updatedData = [...CheckApproved];
        updatedData[index].chequeno = value;
        setCheckApproved(updatedData);


        const row = updatedData[index];

        const payload = {
            pkid: row.pkid,
            baid: "",
            faid: "",
            tokenno: "",
            billno: "",
            tarikh: "",
            fullname: row.fullname || "",
            vehicleno: "",
            amount: 0,
            billamount: 0,
            cashamount: 0,
            chequeamount: 0,
            onlineamount: 0,
            remainingamount: 0,
            status: 0,
            Chequeapproved: row.chequeapproved || "",
            companyid: userdetail?.companyID ? userdetail.companyID : "",
            deptid: userdetail?.departmentID ? userdetail.departmentID : "",
            ischecked: true,
            chequedate: row.chequedate || "",
            chequeno: value,
        };

        try {
            const response = await axios.post(
                `${baseUrl.Url}/backend/api/SP_AddUpdCashCounterName`,
                payload
            );

            if (response.status === 200) {
                console.log(`Row ${row.pkid} updated successfully`);
                const nextKey = `${nextFieldKey}-${index}`;
                setTimeout(() => {
                    inputRefs.current[nextKey]?.focus();
                }, 0);
            } else {
                console.error(`Failed to update row ${row.pkid}`);
            }
        } catch (error) {
            console.error(`Error updating row ${row.pkid}:`, error);
        }
    };
    const formatDateToYYYYMMDD = (dateString) => {
        return dayjs(dateString).format("YYYY-MM-DD");
    };

    const handleChequeDateChange = async (value, index) => {
        const updatedData = [...CheckApproved];
        updatedData[index].chequedate = value;
        setCheckApproved(updatedData);


        const formattedDate = formatDateToYYYYMMDD(value);
        const row = updatedData[index];

        const payload = {
            pkid: row.pkid,
            baid: "",
            faid: "",
            tokenno: "",
            billno: "",
            tarikh: "",
            fullname: row.fullname || "",
            vehicleno: "",
            amount: 0,
            billamount: 0,
            cashamount: 0,
            chequeamount: 0,
            onlineamount: 0,
            remainingamount: 0,
            status: 0,
            Chequeapproved: row.chequeapproved || "",
            companyid: userdetail?.companyID ? userdetail.companyID : "",
            deptid: userdetail?.departmentID ? userdetail.departmentID : "",
            ischecked: true,
            chequedate: formattedDate,
            chequeno: row.chequeno || "",
        };

        try {
            const response = await axios.post(
                `${baseUrl.Url}/backend/api/SP_AddUpdCashCounterName`,
                payload
            );

            if (response.status === 200) {
                console.log(`Cheque date for row ${row.pkid} saved successfully`);
            } else {
                console.error(`Failed to save cheque date for row ${row.pkid}`);
            }
        } catch (error) {
            console.error(`Error saving cheque date for row ${row.pkid}:`, error);
        }

        // handleFullnameEnterSave(value, index);
    };
    const handleFullnameChange = async (value, index) => {

        const updatedData = [...CheckApproved];
        updatedData[index].chequeapproved = value;
        setCheckApproved(updatedData);


        const row = updatedData[index];

        const payload = {
            pkid: row.pkid,
            baid: "",
            faid: "",
            tokenno: "",
            billno: "",
            tarikh: "",
            fullname: row.fullname || "",
            vehicleno: "",
            amount: 0,
            billamount: 0,
            cashamount: 0,
            chequeamount: 0,
            onlineamount: 0,
            remainingamount: 0,
            status: 0,
            Chequeapproved: row.chequeapproved || "",
            companyid: userdetail?.companyID ? userdetail.companyID : "",
            deptid: userdetail?.departmentID ? userdetail.departmentID : "",
            ischecked: true,
            chequedate: row.chequedate || "",
            chequeno: row.chequeno || "",
        };


        try {
            const response = await axios.post(
                `${baseUrl.Url}/backend/api/SP_AddUpdCashCounterName`,
                payload
            );

            if (response.status === 200) {
                console.log(`Row ${row.pkid} updated successfully`);
            } else {
                console.error(`Failed to update row ${row.pkid}`);
            }
        } catch (error) {
            console.error(`Error updating row ${row.pkid}:`, error);
        }
    };

    useEffect(() => {
        const handleShortcut = (e) => {

            if (e.ctrlKey && e.key === "e" || e.ctrlKey && e.key === 'E') {
                e.preventDefault();
                navigate("/test");
            }
        };

        window.addEventListener("keydown", handleShortcut);

        return () => {
            window.removeEventListener("keydown", handleShortcut);
        };
    }, [navigate]);

    return (
        <div className="page-wrapper">
            <div className="content">
                <div className="page-header">
                    <div className="add-item d-flex">
                        <div className="page-title">
                            <h3 className="mb-2">चेक अहवाल</h3>
                            <h6>चेक अहवाल</h6>
                        </div>
                    </div>
                    <ul className="table-top-head">
                        <li>
                            <li>
                                <OverlayTrigger placement="top" overlay={renderTooltip}>
                                    <Link
                                        to="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            generatePDF(CheckApproved);
                                        }}
                                    >
                                        <ImageWithBasePath src="assets/img/icons/pdf.svg" alt="Download PDF" />
                                    </Link>
                                </OverlayTrigger>
                            </li>

                        </li>
                        <li>
                            <OverlayTrigger placement="top" overlay={<Tooltip id="cheque-print-tooltip">चेक प्रिंट</Tooltip>}>
                                <Link
                                    to="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handlePrintCheque();
                                    }}
                                >
                                    <img src="assets/img/icons/credit-card.svg" alt="Cheque Print" />
                                </Link>
                            </OverlayTrigger>
                        </li>

                        <li>
                            <OverlayTrigger placement="top" overlay={renderExcelTooltip}>
                                <Link data-bs-toggle="tooltip"
                                    data-bs-placement="top"
                                    onClick={() => exportToExcel(CheckApproved)}
                                >
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
                        <Link to={route.MarketBillIndex} className="btn btn-secondary">
                            <ArrowLeft className="me-2" />
                            मागे
                        </Link>

                    </div>
                </div>
                <div className="search-container mb-3">
                    <div className="row justify-content-end ">

                        <div className="col-lg-8 col-md-10 col-12">
                            <div className="d-flex justify-content-end">

                                <div className="input-group me-3" style={{ maxWidth: '400px' }}>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Search"
                                        value={searchQuery}
                                        onChange={handleSearch}
                                        style={{ height: '35px', padding: '5px' }}
                                    />
                                    {searchQuery && (
                                        <span
                                            className="input-group-text"
                                            style={{ cursor: 'pointer', height: '35px', padding: '5px' }}
                                            onClick={() => setSearchQuery('')}
                                        >
                                            <i className="fa fa-times"></i>
                                        </span>
                                    )}
                                    <span className="input-group-text" style={{ height: '35px', padding: '5px' }}>
                                        <i className="fa fa-search"></i>
                                    </span>
                                </div>


                                <button className="btn btn-primary" onClick={handlePrint3}>
                                    <i className="feather-printer me-1"></i> प्रिंट करा
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card table-list-card">
                    <div className="card-body">
                        <div className="table-responsive" id="print-section">
                            <Table
                                columns={columns}
                                dataSource={CheckApproved}
                                style={{
                                    tableLayout: 'fixed',
                                    overflowX: 'auto',
                                    padding: 0,
                                }}
                                className="table-sm no-cell-space"
                                pagination={false}
                            />
                        </div>
                    </div>
                </div>
                <Brand />
            </div>
            <AddCheckApproved pkid={selectedData.pkid} baid={selectedData.baid} />
            {showEditModal && (
                <AddCheckAprovv
                    pkid={selectedRecord.pkid}
                />
            )}

        </div>
    );
};
export default CheckApproved;

