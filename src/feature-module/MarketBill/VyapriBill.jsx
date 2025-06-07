
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import ImageWithBasePath from "../../core/img/imagewithbasebath";
import Brand from "../../core/modals/inventory/brand";
import { all_routes } from "../../Router/all_routes";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import Table from "../../core/pagination/datatable";
import { setToogleHeader } from "../../core/redux/action";
import { baseUrl } from "../../core/json/custom";
import axios from 'axios';
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";

import autoTable from 'jspdf-autotable'
import marathiFontBase64 from "../../style/fonts/NotoSansDevanagari";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

import {

    ChevronUp,
    RotateCcw,


    //   Trash2,
} from "feather-icons-react/build/IconComponents";
// import VyapariBill from "./VyapariBill";
// import AddVyapriBill from "./AddVyapriBill";
import { getUserData } from "../../Context/UserData";
const VyapriBill = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const data = useSelector((state) => state.toggle_header);
    const route = all_routes;
    const { userdetail } = getUserData();
    const [searchQuery, setSearchQuery] = useState("");

    const [vyapariName, setvyapariName] = useState([]);
    const [Billno, setBillno] = useState([]);
    const [Crop, setCrop] = useState([]);
    const [Date, setDate] = useState([]);
    const [totalAmount, settotalAmount] = useState([]);
    const [totalWeight, settotalWeight] = useState([]);
    const [tabledata, settabledata] = useState([]);
    const [remainingamount, setremainingamount] = useState([]);
    const [totalLoss, settotalLoss] = useState([]);
    const [Services, setServices] = useState([]);


    const [Tarikh, setTarikh] = useState("");



    // Separate function to format date to yyyy-mm-dd
    function formatDateToYMD(dateString) {
        if (!dateString) return "";
        const date = new window.Date(dateString);
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, "0");
        const dd = String(date.getDate()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd}`;
    }

    useEffect(() => {
        if (userdetail?.APPDT) {
            const formattedDate = formatDateToYMD(userdetail.APPDT);
            setTarikh(formattedDate);
        }
    }, [userdetail]);

    const columns = [
        {
            title: "बिल क्रमांक ",
            dataIndex: "vbillno",
            sorter: (a, b) => a.vbillno.length - b.vbillno.length,
        },

        {
            title: "तारीख ",
            dataIndex: "date",
            // sorter: (a, b) => a.date.length - b.date.length,
        },

        {
            title: "व्यापाऱ्याचे नाव",
            dataIndex: "vname",

            //   sorter: (a, b) => a.vname.length - b.vname.length,
        },
        {
            title: "एकूण रक्कम",
            dataIndex: "total",

            //   sorter: (a, b) => a.vname.length - b.vname.length,
        },

        {
            title: "क्रिया",
            dataIndex: "action",
            align: "center",
            render: (text, record) => (
                <div className="action-table-data">
                    <div className="edit-delete-action p-2">
                        <i
                            data-feather="eye"
                            className="feather-eye cursor-pointer me-2"
                            onClick={async () => {
                                const isLoaded = await getBillDetails(record.vbillno, record.vyapariname);
                                if (isLoaded) {

                                    const myModal = new window.bootstrap.Modal(document.getElementById('print-receipt'), {
                                        backdrop: 'static',
                                        keyboard: false
                                    });
                                    myModal.show();
                                } else {
                                    alert("Data is not load.");
                                }
                            }}
                        ></i>
                        <OverlayTrigger placement="top" overlay={renderPrinterTooltip} className="p-2">
                            <Link data-bs-toggle="tooltip " data-bs-placement="top " >
                                <i
                                    data-feather="printer"
                                    className="feather-printer cursor-pointer"
                                    onClick={async () => {
                                        const isLoaded = await getBillDetails(record.vbillno, record.vyapariname);
                                        if (isLoaded) {
                                            setTimeout(() => {
                                                handlePrint2();
                                            }, 500); // allow React to update DOM
                                        } else {
                                            alert("Data could not be loaded.");
                                        }
                                    }}
                                ></i>


                            </Link>
                        </OverlayTrigger>



                    </div>
                </div>
            ),
            sorter: (a, b) => a.createdby.length - b.createdby.length,
        },
    ];


    const handlePrint2 = () => {
        const printSection2 = document.getElementById("printSection2");


        // Temporarily show section for printing
        printSection2.style.display = "block";

        const printContents = printSection2.innerHTML;
        const printWindow = window.open('', '', 'height=800,width=800');

        printWindow.document.write('<html><head><title>Print</title>');

        printWindow.document.write(`
        <style>
         @media print {
            #printSection2 {
                display: block !important;
                margin-left: 1.5cm;
                margin-right: 1.8cm;
            }

            @page {
                size: 15cm 30.5cm;
                
                margin: 0;
            }

            body {
                margin: 0;
                padding: 0;
            }
            }
    

            html, body {
                height: auto !important;
            }

            * {
                box-sizing: border-box;
            }
        </style>
    `);

        printWindow.document.write('</head><body>');
        printWindow.document.write(`<div class="template-container">${printContents}</div>`);
        printWindow.document.write('</body></html>');
        printWindow.document.close();

        printWindow.focus();
        printWindow.print();
        printWindow.close();

        // Hide again after print
        printSection2.style.display = "none";
    };



    const getBillDetails = async (billno, vyapariname) => {
        console.log(Tarikh, "tarikhssss");
        const formattedDate = formatToReadableDate(Tarikh);
        try {
            const payload = {
                baid: vyapariname,
                billno: billno.toString(),
                date: formattedDate || userdetail?.APPDT
            };
            const payload1 = {
                baid: vyapariname,
                billno: billno.toString(),
                date: formattedDate || userdetail?.APPDT
            };

            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            const [billRes, serviceRes] = await Promise.all([
                axios.post(`${baseUrl.Url}/backend/api/GET_CreateFarmerBillVyapari`, payload, { headers }),
                axios.post(`${baseUrl.Url}/backend/api/GET_VyapariBillChargesBill`, payload1, { headers })
            ]);

            const totalWeightSum = billRes.data.reduce((sum, item) => sum + Number(item.totalweight || 0), 0);
            const totalAmountSum = billRes.data.reduce((sum, item) => sum + Number(item.totalamount || 0), 0);

            settotalWeight(Math.round(totalWeightSum));
            settotalAmount(Math.round(totalAmountSum));


            if (billRes.status === 200 && Array.isArray(billRes.data) && billRes.data.length > 0) {
                const first = billRes.data[0];
                setvyapariName(first.vname);
                setBillno(first.billno);
                setCrop(first.croplabel);
                setDate(first.date);
                // settotalWeight(first.totalweight);
                // settotalAmount(first.totalamount);


                settabledata(billRes.data);
            }

            if (serviceRes.status === 200) {
                setServices(serviceRes.data);
                const totalSum = serviceRes.data.reduce((sum, item) => sum + (item.totalAmount || 0), 0);
                console.log(totalSum);
                settotalLoss(totalSum);
                const RAMT = totalAmountSum - totalSum;
                setremainingamount(Math.round(RAMT));
            }

            return true;
        } catch (error) {
            console.error("Error fetching bill/service data", error);
            return false;
        }
    };

    const generatePDF = (Vyapari) => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();

        const cleanBase64 = marathiFontBase64.replace(/^data:font\/ttf;base64,/, "");

        doc.addFileToVFS("NotoSansDevanagari.ttf", cleanBase64);
        doc.addFont("NotoSansDevanagari.ttf", "NotoSansDevanagari", "normal");
        doc.setFont("NotoSansDevanagari", "normal");
        doc.setFontSize(16);

        console.log(doc.getFontList());

        const title = "व्यापारी बिल अहवाल";
        doc.text(title, (pageWidth - doc.getTextWidth(title)) / 2, 20);

        const tableColumn = [["शेतकरी नाव", "बिल क्रमांक ", "तारीख  "]];

        const tableRows = Vyapari.map((item) => [
            item.fname,
            item.billno,
            item.date,
            // item.vmoblie,

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
            const worksheet = workbook.addWorksheet("Vyapari Report");

            const headingRow = worksheet.addRow(["व्यापारी बिल अहवाल"]);
            headingRow.getCell(1).font = { bold: true, size: 16 };
            headingRow.getCell(1).alignment = { horizontal: "center", vertical: "middle" };

            worksheet.mergeCells("A1:C1");

            const headers = ["शेतकरी नाव", "बिल क्रमांक ", "तारीख  "];
            const headerRow = worksheet.addRow(headers);

            headerRow.eachCell((cell) => {
                cell.font = { bold: true, color: { argb: "FFFFFF" } };
                cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "808080" } };
                cell.alignment = { horizontal: "center", vertical: "middle" };
            });

            const columnWidths = [15, 20, 25,]; // Adjust widths as needed
            columnWidths.forEach((width, index) => {
                worksheet.getColumn(index + 1).width = width;
            });

            Vyapari.forEach(({ fname, billno, date, }) => {
                const row = worksheet.addRow([fname, billno, date,]);
                row.eachCell((cell) => {
                    cell.alignment = { horizontal: "center", vertical: "middle" };
                });
            });

            const buffer = await workbook.xlsx.writeBuffer();
            const data = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
            saveAs(data, "Customer Report.xlsx");
            console.log(marathiFontBase64);

        } catch (error) {
            console.error("Error generating the Excel file:", error);
        }
    };


    const [Vyapari, setVyapari] = useState([]);


    const [selectedData, setSelectedData] = useState({ token: null });
    const handleProceed = (vbkid) => {
        setSelectedData({ vbkid: vbkid });

    };
    //get master data

    const formatToReadableDate = (inputDateStr) => {
        const date = new window.Date(inputDateStr);
        const options = { day: '2-digit', month: 'long', year: 'numeric' };
        return date.toLocaleDateString('en-GB', options); // e.g., "31 May 2025"
    };

    const fetchVyapariData = (selectedDate) => {
        const formattedDate = formatToReadableDate(selectedDate);

        const payload = {
            vyapariname: "%",
            companyid: userdetail?.companyID || "",
            deptid: userdetail?.departmentID || "",
            keyword: "%",
            date: formattedDate,
        };

        const headers = {
            "Content-Type": "application/json",
            Accept: "*/*",
        };

        axios.post(`${baseUrl.Url}/backend/api/GET_VyapariBillMasterData`, payload, { headers })
            .then((response) => {
                if (response.status !== 200) throw new Error("Failed to fetch data");
                setVyapari(response.data);
            })
            .catch((error) => {
                console.error("Error fetching Vyapari data:", error);
            });
    };

    const handleSearch = (event) => {
        const keyword = event.target.value;
        setSearchQuery(keyword);
        const formattedDate = formatToReadableDate(Tarikh);
        const payload = {
            vyapariname: "%",
            companyid: userdetail?.companyID || "",
            deptid: userdetail?.departmentID || "",
            keyword: keyword,
            date: formattedDate || userdetail?.APPDT
        };

        const headers = {
            "Content-Type": "application/json",
            Accept: "*/*",
        };

        axios.post(`${baseUrl.Url}/backend/api/GET_VyapariBillMasterData`, payload, { headers })
            .then((response) => {
                if (response.status === 200) {
                    setVyapari(response.data);
                }
            })
            .catch((error) => {
                console.error("Error during search:", error);
            });
    };


    useEffect(() => {
        if (userdetail?.APPDT) {
            fetchVyapariData(userdetail?.APPDT);
        }
    }, [userdetail]);


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


    const handleDownload = () => {
        const input = document.getElementById("printableArea");

        html2canvas(input, { scale: 2 }).then((canvas) => {
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4");

            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
            pdf.save(`bill_${Billno || "receipt"}.pdf`);
        });
    };


    return (
        <div className="page-wrapper">
            <div className="content">
                <div className="page-header">
                    <div className="add-item d-flex">
                        <div className="page-title">
                            <h3>व्यापारी बिल मास्टर </h3>
                            <h6> व्यापारी बिल मास्टर</h6>
                        </div>
                    </div>
                    <ul className="table-top-head">
                        <li>
                            <OverlayTrigger placement="top" overlay={renderTooltip}>
                                <Link
                                    to="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        generatePDF(Vyapari);
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
                    <div className="col-12 col-md-6">
                        <div className="row g-2 justify-content-md-end mt-2 mt-md-auto">
                            <div className="col-12 col-md-5">
                                <button
                                    type="button"
                                    className="btn btn-secondary w-100"
                                    onClick={() => navigate(route.MarketBillIndex)}
                                >
                                    मागे
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row align-items-end mb-3">
                    {/* तारीख in col-3 */}
                    <div className="col-md-2 col-12">
                        <label className="form-label required">तारीख</label>
                        <input
                            type="date"
                            className="form-control"
                            id="tarikh"
                            name="tarikh"
                            value={Tarikh}
                            onChange={(e) => {
                                const newDate = e.target.value;
                                setTarikh(newDate);
                                fetchVyapariData(newDate); // fetch data on date change
                            }}
                        />
                    </div>


                    {/* Search input in col-5 aligned right */}
                    <div className="col-md-5 col-12 ms-auto">
                        <label className="form-label invisible">Search</label> {/* keeps height consistent */}
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



                <div className="card table-list-card">
                    <div className="card-body p-2">
                        <div className="table-responsive responsive-no-scroll">
                            <Table
                                columns={columns}
                                dataSource={Vyapari}
                                pagination={false}
                                scroll={false} // ensure ant-table doesn't enforce horizontal scroll
                                rowKey={(record) => record.vbkid || record.billno}
                            />
                        </div>
                    </div>
                </div>

                <Brand />
            </div>
            {/* <AddVyapriBill vbkid={selectedData.vbkid} /> */}
            {/* Print Receipt */}
            <div
                className="modal"
                id="print-receipt"
                aria-labelledby="print-receipt">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content rounded-4 shadow border border-success" style={{ backgroundColor: "#f0f8ff" }}>

                        <div className="d-flex justify-content-end p-2">
                            <button
                                type="button"
                                className="close p-0"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            >
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>
                        <div className="modal-body" id="printableArea" style={{ backgroundColor: "#f0f8ff" }}>

                            <div className="icon-head text-center mb-3">
                                <h3 className="text-center" style={{ color: 'orange' }}>
                                    {userdetail?.departmentname}
                                </h3>

                            </div>
                            <div className="tax-invoice" style={{ backgroundColor: "#f0f8ff" }}>
                                <h6 className="text-center text-success">व्यापारी  बिल</h6>

                                <div className="row mb-3">
                                    <div className="col-sm-12 col-md-6">
                                        <div className="invoice-user-name">
                                            <span className="bold-text" style={{ color: "#00000" }}>व्यापारी : </span>
                                            <strong> {vyapariName}</strong>
                                        </div>
                                        <div className="invoice-user-name">
                                            <span className="bold-text" style={{ color: "#00000" }}>बिल क्र.: </span>
                                            <strong>{Billno}</strong>
                                        </div>
                                    </div>
                                    <div className="col-sm-12 col-md-6">
                                        {Crop && (
                                            <div className="invoice-user-name">
                                                <span className="bold-text" style={{ color: "#00000" }}>पीक: </span>
                                                <strong>{Crop}</strong>
                                            </div>
                                        )}
                                        <div className="invoice-user-name">
                                            <span className="bold-text" style={{ color: "#00000" }}>दिनांक: </span>
                                            <strong>{Date}</strong>
                                        </div>
                                    </div>
                                </div>
                                {/* </div> */}

                            </div>
                            <table className="table-borderless w-100 table-fit">
                                <thead style={{ backgroundColor: '#add8e6' }}>  {/* light blue background color */}
                                    <tr>
                                        <th className="text-center">अ.क्र.</th>
                                        <th className="text-center">शेतकरी </th>
                                        {/* <th className="text-center">Crop</th> */}
                                        <th className="text-center">वजन </th>
                                        <th className="text-center">भाव </th>
                                        <th className="text-end">रक्कम </th>
                                    </tr>
                                </thead>

                                <tbody>


                                    {tabledata.length > 0 ? (
                                        tabledata.map((row, index) => (
                                            <tr key={index}>
                                                <td className="text-center" style={{ color: '#333' }}><strong>{index + 1}</strong></td> {/* Darker text color */}
                                                <td className="text-center" style={{ color: '#333' }}><strong>{row.fname}</strong></td>
                                                {/* <td className="text-center">{row.croplabel}</td> */}
                                                <td className="text-center" style={{ color: '#333' }}><strong>{row.weight}</strong></td>
                                                <td className="text-center" style={{ color: '#333' }}><strong>{row.rate}</strong></td>
                                                <td className="text-end" style={{ color: '#333' }}><strong>{row.amount}</strong></td>
                                            </tr>

                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="text-center">No Data Available</td>
                                        </tr>
                                    )}


                                    <tr>
                                        <td colSpan={6}>
                                            <table className="table-borderless w-100 table-fit">
                                                <tbody>
                                                    <tr>
                                                        <td><strong>उप एकूण :</strong></td>
                                                        <td className="text-end"><strong>{totalAmount}</strong></td>
                                                    </tr>
                                                    <tr>
                                                        <td><strong>एकूण वजन :</strong></td>
                                                        <td className="text-end"><strong>{totalWeight}</strong></td>
                                                    </tr>

                                                    {Services
                                                        .map((item, index) => (
                                                            <tr key={index}>
                                                                <td style={{ paddingTop: "8px" }}><strong>{item.rateTypeTitle}:</strong></td>
                                                                <td className="text-end" style={{ paddingTop: "8px" }}><strong>{item.totalAmount}</strong></td>
                                                            </tr>
                                                        ))}

                                                    <tr>
                                                        <td><strong>एकूण खर्च :</strong></td>
                                                        <td className="text-end"><strong>{totalLoss}</strong></td>
                                                    </tr>

                                                    <tr>
                                                        <td><strong>एकूण रक्कम  :</strong></td>
                                                        <td className="text-end"><strong>{remainingamount}</strong></td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>

                                </tbody>
                            </table>

                            <div className="text-center invoice-bar mt-3">
                                <Link to="#" className="btn btn-success" onClick={handleDownload}>
                                    Download
                                </Link>
                            </div>
                        </div>
                        {/* Print BILL */}
                        <div id="printSection2" style={{ display: 'none' }}>
                            <div
                                style={{
                                    width: "15.2cm",
                                    height: "30.5m",
                                    backgroundSize: "cover",
                                    fontFamily: "sans-serif",
                                    fontSize: "12pt",
                                    color: "#000",
                                    fontWeight: "bold"
                                }}>
                                {/* Header Details */}
                                <div style={{ position: "absolute", top: "3.6cm", left: "3.7cm", whiteSpace: "nowrap" }}>
                                    <strong>{vyapariName}</strong>
                                </div>
                                <div style={{ position: "absolute", top: "4.5cm", left: "9.5cm", whiteSpace: "nowrap" }}>
                                    <strong>{Date}</strong>
                                </div>
                                <div style={{ position: "absolute", top: "4.5cm", left: "3.3cm", whiteSpace: "nowrap" }}>
                                    <strong>{Billno}</strong>
                                </div>
                                {/* {Crop && (
                                    <div style={{ position: "absolute", top: "1.5cm", left: "11.9cm", whiteSpace: "nowrap" }}>
                                        <strong>{Crop}</strong>
                                    </div>
                                )} */}


                                {/* Farmer Table */}
                                {tabledata.length > 0 && (
                                    <div style={{ position: "relative", height: "17cm" }}>
                                        {tabledata.map((row, index) => {
                                            const rowTop = 6.6 + index * 0.6;
                                            return (
                                                <React.Fragment key={index}>
                                                    <div style={{ position: "absolute", top: `${rowTop}cm`, left: "2cm", fontSize: "11pt" }}>
                                                        {row.fname}
                                                    </div>
                                                    <div style={{ position: "absolute", top: `${rowTop}cm`, left: "6.3cm", fontSize: "12pt" }}>
                                                        {row.totaljaail}
                                                    </div>
                                                    <div style={{ position: "absolute", top: `${rowTop}cm`, left: "7.8cm", fontSize: "12pt" }}>
                                                        {row.rate}
                                                    </div>
                                                    <div style={{ position: "absolute", top: `${rowTop}cm`, left: "10.3cm", fontSize: "12pt" }}>
                                                        {Math.round(row.amount)}
                                                    </div>

                                                </React.Fragment>
                                            );
                                        })}
                                    </div>
                                )}


                                {/* Totals */}
                                <div className="mt-2">
                                    <div style={{ position: "absolute", top: "24.8cm", left: "10.4cm", whiteSpace: "nowrap" }}>
                                        {Math.round(Number(totalAmount))}
                                    </div>

                                    <div style={{ position: "absolute", top: "24.8cm", left: "6.4cm", whiteSpace: "nowrap" }}>
                                        {totalWeight}</div>
                                </div>

                                {/* Services List */}

                                {/* First Column (Left 3cm) - First 5 rows */}
                                {Services.slice(0, 5).map((item, index) => {
                                    const rowTop = 25.6 + index * 0.42;
                                    return (
                                        <div
                                            key={index}
                                            style={{
                                                position: "absolute",
                                                top: `${rowTop}cm`,
                                                left: "1.6cm", // Start at far left
                                                fontSize: "10pt",
                                                display: "flex",
                                                width: "2.8cm",
                                            }}
                                        >
                                            <div style={{ width: "1.5cm", overflow: "hidden", whiteSpace: "nowrap" }}>{item.rateTypeTitle}</div>
                                            <div style={{ width: "1.5cm", overflow: "hidden", textAlign: "right" }}>{item.totalAmount}</div>
                                        </div>
                                    );
                                })}

                                {/* Second Column (Right 3cm) - Remaining rows */}
                                {Services.slice(5).map((item, index) => {
                                    const rowTop = 25.6 + index * 0.42;
                                    return (
                                        <div
                                            key={index + 5}
                                            style={{
                                                position: "absolute",
                                                top: `${rowTop}cm`,
                                                left: "4.5cm", // Start 3cm from left (right half)
                                                fontSize: "10pt",
                                                display: "flex",
                                                width: "2.8cm",
                                            }}
                                        >
                                            <div style={{ width: "1.5cm", overflow: "hidden", whiteSpace: "nowrap" }}>{item.rateTypeTitle}</div>
                                            <div style={{ width: "1.5cm", overflow: "hidden", textAlign: "right" }}>{item.totalAmount}</div>
                                        </div>
                                    );
                                })}




                                {/* Final Totals */}

                                <div style={{ position: "absolute", top: "25.5cm", left: "9.3cm", fontSize: "14pt", whiteSpace: "nowrap" }}>
                                    {Math.round(Number(totalLoss))}
                                </div>

                                <div style={{ position: "absolute", top: "26.9cm", left: "9.2cm", fontSize: "14pt", whiteSpace: "nowrap" }}>
                                    {Math.round(Number(remainingamount))}
                                </div>

                            </div>
                        </div>



                    </div>
                </div>
            </div>


            {/* /Print Receipt */}

        </div >

    );
};

export default VyapriBill;

