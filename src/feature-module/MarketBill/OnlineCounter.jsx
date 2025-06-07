import React, { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ImageWithBasePath from "../../core/img/imagewithbasebath";
import Brand from "../../core/modals/inventory/brand";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { all_routes } from "../../Router/all_routes";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import Table from "../../core/pagination/datatable";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import marathiFontBase64 from "../../style/fonts/NotoSansDevanagari";
import { ACSPLGUID, baseUrl } from "../../core/json/custom";
import {
    ArrowLeft,
    ChevronUp,
    Edit,
    PlusCircle,
    RotateCcw,
    Trash2,
} from "feather-icons-react/build/IconComponents";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";
import { getUserData } from "../../Context/UserData";
import { convertToISODate, formatDate } from "../../core/json/custom";
// import AddOnlineAmount from "./AddOnlineAmount";


const OnlineCounter = () => {
    const navigate = useNavigate();
    const GUID = ACSPLGUID.getNew()

    const dispatch = useDispatch();
    const data = useSelector((state) => state.toggle_header);
    const { isAuthenticated, userdetail } = getUserData();
    if (isAuthenticated == true) {
        console.log("user", userdetail);
        console.log("getUserData", getUserData);
    }
    const route = all_routes;
    const [OnlineAmount, setOnlineAmount] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");


    const generatePDF = (OnlineAmount) => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();

        const cleanBase64 = marathiFontBase64.replace(/^data:font\/ttf;base64,/, "");

        doc.addFileToVFS("NotoSansDevanagari.ttf", cleanBase64);
        doc.addFont("NotoSansDevanagari.ttf", "NotoSansDevanagari", "normal");

        doc.setFont("NotoSansDevanagari", "normal");
        doc.setFontSize(16);
        const title = "ऑनलाईन अहवाल";
        doc.text(title, (pageWidth - doc.getTextWidth(title)) / 2, 20);

        const tableColumn = [["शेतकरी नाव", "मोबाइल नंबर", "पावती नं.", "खाते नं", "आयएफएससी कोड", "पैसे", "ऑनलाईन पैसे",]];

        const tableRows = OnlineAmount.map((item) => {

            return [
                item.fname || "",
                item.phonenumber || "",
                item.billno || "",
                item.accno || "",
                item.ifsccode || "",
                item.remainingamount || "",
                item.onlineamount || "",

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


    const exportToExcel1 = async () => {
        try {
            const headers = {
                "Content-Type": "application/json",
                Accept: "application/json",
            };

            const payloadForGetRTGS = {
                rtgsaid: "%",
                keyword: "%",
                companyid: userdetail?.companyID ? userdetail.companyID : "",
                deptid: userdetail?.departmentID ? userdetail.departmentID : ""
            };

            const existingRTGSResponse = await axios.post(`${baseUrl.Url}/backend/api/GET_GetRTGS`, payloadForGetRTGS, { headers });
            const existingRTGSList = existingRTGSResponse.data || [];

            for (const item of OnlineAmount) {
                const existing = existingRTGSList.find(x =>
                    x.benE_ACC_NO === item.accno &&
                    x.bnF_NAME?.toLowerCase() === item.fname?.toLowerCase() &&
                    x.amount == item.remainingamount &&
                    x.mobilE_NUM === item.phonenumber
                );

                const rtgsaid = existing?.rtgsaid || ACSPLGUID.getNew();

                const payload = {
                    rtgsaid,
                    pymT_PROD_TYPE_CODE: "NEFT",
                    pymT_MODE: "ONLINE",
                    debiT_ACC_NO: item.DEBIT_ACC_NO || "",
                    bnF_NAME: item.fname || "",
                    benE_ACC_NO: item.accno || "",
                    benE_IFSC: item.ifsccode || "",
                    amount: item.remainingamount || 0,
                    debiT_NARR: item.DEBIT_NARR || "",
                    crediT_NARR: item.CREDIT_NARR || "",
                    mobilE_NUM: item.phonenumber || "",
                    emaiL_ID: item.EMAIL_ID || "",
                    remark: "Pending",
                    pymT_DATE: formatDate(userdetail.APPDT),
                    reF_NO: item.REF_NO || "",
                    addL_INFO1: item.ADDL_INFO1 || "",
                    addL_INFO2: item.ADDL_INFO2 || "",
                    addL_INFO3: item.ADDL_INFO3 || "",
                    addL_INFO4: item.ADDL_INFO4 || "",
                    addL_INFO5: item.ADDL_INFO5 || "",
                    uaid: userdetail?.uaid ? userdetail.uaid : "",
                    isdeleted: true,
                    companyid: userdetail?.companyID ? userdetail.companyID : "",
                    deptid: userdetail?.departmentID ? userdetail.departmentID : ""
                };

                await axios.post(`${baseUrl.Url}/backend/api/SP_AddUpdRTGS`, payload, { headers });
            }

            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("RTGS Report");

            const headingRow = worksheet.addRow(["RTGS Report"]);
            headingRow.getCell(1).font = { bold: true, size: 15 };
            headingRow.getCell(1).alignment = { horizontal: "center", vertical: "middle" };
            worksheet.mergeCells("A1:T1");

            const excelHeaders = [
                "PYMT_PROD_TYPE_CODE", "PYMT_MODE", "DEBIT_ACC_NO", "BNF_NAME", "BENE_ACC_NO", "BENE_IFSC",
                "AMOUNT", "DEBIT_NARR", "CREDIT_NARR", "MOBILE_NUM", "EMAIL_ID", "REMARK",
                "PYMT_DATE", "REF_NO", "ADDL_INFO1", "ADDL_INFO2", "ADDL_INFO3", "ADDL_INFO4", "ADDL_INFO5"
            ];

            const headerRow = worksheet.addRow(excelHeaders);
            headerRow.eachCell((cell) => {
                cell.font = { bold: true, color: { argb: "FFFFFF" } };
                cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "808080" } };
                cell.alignment = { horizontal: "center", vertical: "middle" };
            });

            excelHeaders.forEach((_, index) => {
                const col = index + 1;
                worksheet.getColumn(col).width = col === 4 || col === 8 || col === 9 ? 25 : 15;
            });

            OnlineAmount.forEach((item) => {
                const rowData = [
                    "NEFT",
                    "ONLINE",
                    item.DEBIT_ACC_NO || "",
                    item.fname || "",
                    item.accno || "",
                    item.ifsccode || "",
                    item.remainingamount || "",
                    item.DEBIT_NARR || "",
                    item.CREDIT_NARR || "",
                    item.phonenumber || "",
                    item.EMAIL_ID || "",
                    "Pending",
                    formatDate(userdetail.APPDT),
                    item.REF_NO || "",
                    item.ADDL_INFO1 || "",
                    item.ADDL_INFO2 || "",
                    item.ADDL_INFO3 || "",
                    item.ADDL_INFO4 || "",
                    item.ADDL_INFO5 || ""
                ];

                const row = worksheet.addRow(rowData);
                row.eachCell((cell) => {
                    cell.alignment = { horizontal: "center", vertical: "middle" };
                });
            });

            const buffer = await workbook.xlsx.writeBuffer();
            const data = new Blob([buffer], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            saveAs(data, "RTGS (Report).xlsx");

        } catch (error) {
            console.error("Error generating the Excel file or saving data:", error);
            alert("Failed to export RTGS report. See console for details.");
        }
    };


    //Search Data
    const handleSearch = (event) => {
        const today = new Date().toISOString().split('T')[0];
        setSearchQuery(event.target.value);
        try {

            const payload = {
                "baid": "%",
                "keyword": event.target.value,
                "companyid": userdetail?.companyID ? userdetail.companyID : "",
                "deptid": userdetail?.departmentID ? userdetail.departmentID : "",
                "date": userdetail.APPDT
            }
            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            axios({
                method: "POST",
                url: baseUrl.Url + "/backend/api/GET_OnlineAmount/_Search",
                data: JSON.stringify(payload),
                headers: headers,
            })

                .then((response) => {
                    if (response.status != 200) throw new Error("Failed to Get Online Amount");
                    console.log("response", response.data);
                    setOnlineAmount(response.data);
                })
        } catch (error) {
            console.error("Error while searching Online Counter data:", error);
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

    //Get Data
    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        try {
            const payload = {
                "baid": "%",
                "keyword": "%",
                "companyid": userdetail?.companyID ? userdetail.companyID : "",
                "deptid": userdetail?.departmentID ? userdetail.departmentID : "",
                // "date": today
                "date": userdetail.APPDT
            };

            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            axios({
                method: "POST",
                url: baseUrl.Url + "/backend/api/GET_OnlineAmount",
                data: JSON.stringify(payload),
                headers: headers,
            })
                .then((response) => {
                    if (response.status !== 200) throw new Error("Failed to Fetching Data Online Counter");
                    setOnlineAmount(response.data);
                    console.log("Fetched Online Counter Data:", response.data);
                });

        } catch (error) {
            console.error("Error fetching Online Counter Data:", error);
        }
    }, []);


    const [selectedData, setSelectedData] = useState({ pkid: null, baid: null });

    const openModal = (pkid, baid) => {
        setSelectedData({ pkid, baid })
        setTimeout(() => {
            setSelectedData(pkid, baid);

        }, 10);

    }

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
            dataIndex: "fname",
            width: "5%",
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
                    overlay={<Tooltip id="types-tooltip">मोबाइल नंबर</Tooltip>}
                >
                    <div className="text-center w-100">मोबाइल नंबर</div>
                </OverlayTrigger>
            ),
            dataIndex: "phonenumber",
            width: "5%",
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
                    overlay={<Tooltip id="types-tooltip">बिल क्रमांक</Tooltip>}
                >
                    <div className="text-center">बिल क्रमांक</div>
                </OverlayTrigger>
            ),
            dataIndex: "billno",
            width: "5%",
            render: (text) => (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id={`tooltip-${text}`}>{text}</Tooltip>}
                >
                    <div style={{ textAlign: "center", padding: "0 5px" }}>{text}</div>
                </OverlayTrigger>
            ),
        },
        {
            title: (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id="types-tooltip">खाते क्रमांक</Tooltip>}
                >
                    <div className="text-center w-100">खाते क्रमांक</div>
                </OverlayTrigger>
            ),
            dataIndex: "accno",
            width: "5%",
            render: (text) => (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id={`tooltip-${text}`}>{text}</Tooltip>}
                >
                    <div style={{ textAlign: "center", padding: "0 5px" }}>{text}</div>
                </OverlayTrigger>
            ),
        },
        {
            title: (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id="types-tooltip">आयएफएससी कोड</Tooltip>}
                >
                    <div className="text-center w-100">आयएफएससी कोड</div>
                </OverlayTrigger>
            ),
            dataIndex: "ifsccode",
            width: "5%",
            render: (text) => (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id={`tooltip-${text}`}>{text}</Tooltip>}
                >
                    <div style={{ textAlign: "center", padding: "0 5px" }}>{text}</div>
                </OverlayTrigger>
            ),
        },
        {
            title: (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id="types-tooltip">रक्कम</Tooltip>}
                >
                    <div className="text-center w-100">रक्कम</div>
                </OverlayTrigger>
            ),
            dataIndex: "remainingamount",
            width: "5%",
            render: (text) => (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id={`tooltip-${text}`}>{text}</Tooltip>}
                >
                    <div style={{ textAlign: "left", padding: "0.5px" }}>{text}</div>
                </OverlayTrigger>
            ),
        },

        {
            title: (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id="types-tooltip">ऑनलाईन रक्कम</Tooltip>}
                >
                    <div className="text-center w-100">ऑनलाईन रक्कम</div>
                </OverlayTrigger>
            ),
            dataIndex: "onlineamount",
            width: "5%",
            render: (text) => (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id={`tooltip-${text}`}>{text}</Tooltip>}
                >
                    <div style={{ textAlign: "center", padding: "0 5px" }}>{text}</div>
                </OverlayTrigger>
            ),
        },

    ];


    return (
        <div className="page-wrapper">
            <div className="content">
                <div className="page-header">
                    <div className="add-item d-flex">
                        <div className="page-title">
                            <h3 className="mb-2">RTGS काऊंटर </h3>
                            <h6>RTGS काऊंटर</h6>
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
                                            generatePDF(OnlineAmount);

                                        }}
                                    >
                                        <ImageWithBasePath src="assets/img/icons/pdf.svg" alt="Download PDF" />
                                    </Link>
                                </OverlayTrigger>
                            </li>

                        </li>
                        {/* <li>
                            <OverlayTrigger placement="top" overlay={renderExcelTooltip}>
                                <Link data-bs-toggle="tooltip"
                                    data-bs-placement="top"
                                    onClick={() => exportToExcel(OnlineAmount)}
                                >
                                    <ImageWithBasePath
                                        src="assets/img/icons/excel.svg"
                                        alt="img"
                                    />
                                </Link>
                            </OverlayTrigger>
                        </li> */}
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
                    <div className="d-flex justify-content-end align-items-center flex-wrap gap-2">
                        <div className="d-flex align-items-center">
                            <label className="me-3 mt-3">
                                <img alt="img" src="/assets/img/icons/excel.svg" />
                            </label>
                            <button className=" form-control bg-secondary"
                                style={{ width: '230px', height: '35px' }}
                                onClick={exportToExcel1}>
                                Excel
                            </button>
                        </div>
                        <div className="input-group" style={{ width: '300px' }}>
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

                <div className="card table-list-card">
                    <div className="card-body">
                        <div className="table-responsive" id="print-section"> {/* Wrap for print */}
                            <Table
                                columns={columns}
                                dataSource={OnlineAmount}
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

            {/* <AddOnlineAmount pkid={selectedData.pkid} baid={selectedData.baid} /> */}

        </div>
    );
};
export default OnlineCounter;

