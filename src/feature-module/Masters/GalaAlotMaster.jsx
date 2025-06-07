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
import { setToogleHeader } from "../../core/redux/action";
import { getUserData } from '../../Context/UserData'
import axios from 'axios';
import { baseUrl, ACSPLGUID } from "../../core/json/custom";
import { useLocation } from "react-router-dom";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
// import { jsPDF } from 'jspdf';
// import autoTable from 'jspdf-autotable';
// import marathiFontBase64 from "../../style/fonts/NotoSansDevanagari";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import marathiFontBase64 from "../../style/fonts/NotoSansDevanagari"; // This should export a base64 string

import {
    ArrowLeft,
    ChevronUp,
    Edit,
    Eye,

    PlusCircle,
    RotateCcw,


    Trash2,
} from "feather-icons-react/build/IconComponents";
import { useNavigate } from "react-router-dom";
const GalaAlotMaster = () => {
    const navigate = useNavigate();
    const userdetail = getUserData();
    const [fetch, setfetch] = useState([]);
    const dispatch = useDispatch();
    const data = useSelector((state) => state.toggle_header);
    const route = all_routes;

    const location = useLocation();
    const { shid } = location.state || {};
    console.log("Received shid:", shid);


    const downloadPDF = (e) => {
        e.preventDefault();

        const doc = new jsPDF();


        const cleanBase64 = marathiFontBase64.replace(/^data:font\/ttf;base64,/, "");
        doc.addFileToVFS("NotoSansDevanagari.ttf", cleanBase64);
        doc.addFont("NotoSansDevanagari.ttf", "NotoSansDevanagari", "normal");
        doc.setFont("NotoSansDevanagari", "normal");
        doc.setFontSize(12);

        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        const title = "शॉप वाटप";
        const titleWidth = doc.getTextWidth(title);
        const borderMargin = 10;

        doc.rect(borderMargin, borderMargin, pageWidth - borderMargin * 2, pageHeight - borderMargin * 2);
        doc.text(title, (pageWidth - titleWidth) / 2, 20);
        doc.setLineWidth(0.5);
        doc.line((pageWidth - titleWidth) / 2, 22, (pageWidth + titleWidth) / 2, 22);

        let yPosition = 25;

        const tableColumn = ["व्यापारी नाव", "शॉप नाव", "शॉप सुरू", "शॉप समाप्ती", "डिपॉजिट", "भाडे"];
        const tableRows = fetch.map(item => [
            item.vapname,
            item.shopn,
            item.sdate,
            item.edate,
            item.deposit,
            item.rent,
        ]);

        autoTable(doc, {
            startY: yPosition,
            head: [tableColumn],
            body: tableRows,
            theme: 'grid',
            styles: {
                font: "NotoSansDevanagari",
                fontStyle: "normal",
                fontSize: 10,
                halign: "center",
                lineColor: [0, 0, 0],
                lineWidth: 0.20
            },
            headStyles: {
                font: "NotoSansDevanagari",
                fontStyle: "bold",
                fillColor: [169, 169, 169],
                textColor: 0
            },
            bodyStyles: {
                font: "NotoSansDevanagari",
                fontStyle: "normal",
                textColor: 0
            }
        });

        doc.save("शॉप वाटप.pdf");
    };
    const downloadExcel = async () => {
        try {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("शॉप वाटप(Report)");


            const headingRow = worksheet.addRow(["शॉप वाटप(Report)"]);
            headingRow.getCell(1).font = { bold: true, size: 16 };
            headingRow.getCell(1).alignment = { horizontal: "center", vertical: "middle" };


            worksheet.mergeCells("A1:F1");


            const headers = ["व्यापारी नाव ", "शॉप नाव ", "शॉप सुरू", "शॉप समाप्ती", "डिपॉजिट", "भाडे"]

            const headerRow = worksheet.addRow(headers);

            headerRow.eachCell((cell) => {
                cell.font = { bold: true, color: { argb: "FFFFFF" } };
                cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "808080" } };
                cell.alignment = { horizontal: "center", vertical: "middle" };
            });


            const columnWidths = [25, 25, 25, 25, 25, 20];
            columnWidths.forEach((width, index) => {
                worksheet.getColumn(index + 1).width = width;
            });


            fetch.forEach(({ vapname, shopn, sdate, edate, deposit, rent }) => {
                const row = worksheet.addRow([vapname, shopn, sdate, edate, deposit, rent]);
                row.eachCell((cell) => {
                    cell.alignment = { horizontal: "center", vertical: "middle" };
                });

            });

            // **Generate and Save Excel File**
            const buffer = await workbook.xlsx.writeBuffer();
            const data = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
            saveAs(data, "शॉप वाटप(Report).xlsx");

        } catch (error) {
            console.error("Error generating the Excel file:", error);
        }
    };

    useEffect(() => {
        const handleShortcut = (e) => {
            if (e.ctrlKey && e.key === 'a' || e.ctrlKey && e.key === 'A') {
                e.preventDefault();
                navigate(route.AddGala);
            }

        };

        window.addEventListener('keydown', handleShortcut);

        return () => {
            window.removeEventListener('keydown', handleShortcut);
        };
    }, [navigate]);

    const [selectedData, setSelectedData] = useState({ shid: null });

    const OnEdit = (shid) => {
        MySwal.fire({
            text: "तुम्हाला या माहितीत बदल करायचा आहे का?",
            showCancelButton: true,
            confirmButtonColor: "#00ff00",
            confirmButtonText: "होय, बदल करा!",
            cancelButtonColor: "#ff0000",
            cancelButtonText: "रद्द करा",
            allowOutsideClick: false,
            allowEscapeKey: false,
        }).then((result) => {
            if (result.isConfirmed) {
                setSelectedData({ shid });
                navigate("/AddGalaAlot", { state: { shid } });

            }
        });
    };
    useEffect(() => {

        const fetchShopAlot = async () => {
            try {
                const payload =


                {

                    "shid": "%",
                    "keyword": "%",
                    "vyapariname": "%",
                    "shopname": "",
                    "shopid": "",
                    "sdate": "",
                    "edate": "",
                    "deposit": true,
                    "rent": 0,
                    "companyid": userdetail?.companyID ? userdetail.companyID : "",
                    "deptid": userdetail?.departmentID ? userdetail.departmentID : "",
                };


                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };
                const response = await axios.post(
                    `${baseUrl.Url}/backend/api/GET_ShopAlot`,

                    payload,
                    { headers }
                );
                if (response.status !== 200)
                    throw new Error("Failed to fetch vendor data");
                console.log("quatation master", response.data)
                setfetch(response.data);
            } catch (error) {
                console.error("Error fetching vendor data:", error);
            }
        };

        fetchShopAlot();

    }, []);

    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
        try {
            const payload =


            {
                "shid": "%",
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
                url: baseUrl.Url + "/backend/api/GET_ShopAlot/_Search",
                data: JSON.stringify(payload),
                headers: headers,
            })

                .then((response) => {
                    if (response.status != 200) throw new Error("Failed to send otp");
                    console.log("response", response.data);
                    setfetch(response.data);
                })
        } catch (error) {
            console.error("Error while searching WareHouse data:", error);
        }
    };


    const showConfirmationAlert1 = (shid) => {
        MySwal.fire({
            // title: 'तुम्हाला खात्री आहे का?',
            text: 'तुम्हाला हि  माहिती  हटवाची आहे का ?',
            showCancelButton: true,
            confirmButtonColor: '#00ff00',
            confirmButtonText: 'होय, हे हटवा!',
            cancelButtonColor: '#ff0000',
            cancelButtonText: 'रद्द करा',
            allowOutsideClick: false,
            allowEscapeKey: false,
        }).then((result) => {
            if (result.isConfirmed) {

                GalaAlot(shid);
            } else {
                MySwal.close();
            }

        });
    };


    const GalaAlot = async (shid) => {
        try {
            const payload = {
                "shid": shid,

                "companyid": userdetail?.companyID ? userdetail.companyID : "",
                "deptid": userdetail?.departmentID ? userdetail.departmentID : "",
            };
            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            axios({
                method: "POST",
                url: baseUrl.Url + "/backend/api/SP_DeleteShopAlot",
                data: JSON.stringify(payload),
                headers: headers,
            })
                .then((response) => {
                    if (response.status != 200) throw new Error("Failed to Fetching Data");
                    MySwal.fire({
                        title: response.data[0].responseCode === "अपयश" ? "हटवणे अनुमत नाही" : "हटवले!",
                        text: response.data[0].responseCode === "FAILURE"
                            ? response.data[0].responseMessage
                            : response.data[0].responseMessage,
                        icon: response.data[0].responseCode === "FAILURE" ? "error" : "success",
                        confirmButtonText: "ठीक आहे",
                        customClass: {
                            confirmButton: response.data[0].responseCode === "FAILURE" ? "btn btn-danger" : "btn btn-success",
                        },
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                    });
                    try {
                        const payload = {
                            "shid": "%",
                            "keyword": "%",
                            "vyapariname": "%",
                            "shopname": "",
                            "shopid": "",
                            "sdate": "",
                            "edate": "",
                            "deposit": true,
                            "rent": 0,
                            "companyid": userdetail?.companyID ? userdetail.companyID : "",
                            "deptid": userdetail?.departmentID ? userdetail.departmentID : "",
                        };
                        const headers = {
                            "Content-Type": "application/json",
                            Accept: "*/*",
                        };

                        axios({
                            method: "POST",
                            url: baseUrl.Url + "/backend/api/GET_ShopAlot",
                            data: JSON.stringify(payload),
                            headers: headers,
                        })
                            .then((response) => {
                                if (response.status != 200) throw new Error("Failed to Fetching Data");
                                const DATA = response.data;
                                setfetch(DATA);
                            })

                    } catch (error) {
                        console.error("Error fetching Access Right Data:", error);
                    }
                })

        } catch (error) {
            console.error("Error fetching Access Right Data:", error);
        }

    }

    const columns = [



        {
            title: (
                <OverlayTrigger placement="top" overlay={<Tooltip >व्यापारी</Tooltip>}>
                    <div className="text-center">व्यापारी</div>
                </OverlayTrigger>
            ),
            dataIndex: "vapname",
            sorter: (a, b) => a.vapname.length - b.vapname.length,
            render: (text) => <div style={{ textAlign: "left" }}>{text}</div>,
            width: "200px",
        },
        {
            title: (
                <OverlayTrigger placement="top" overlay={<Tooltip >शॉप</Tooltip>}>
                    <div className="text-center">शॉप</div>
                </OverlayTrigger>
            ),
            dataIndex: "shopn",
            sorter: (a, b) => a.shopn.length - b.shopn.length,
            render: (text) => <div style={{ textAlign: "left" }}>{text}</div>,
            width: "200px",
        },

        {
            title: (
                <OverlayTrigger placement="top" overlay={<Tooltip >शॉप सुरू</Tooltip>}>
                    <div className="text-center">शॉप सुरू</div>
                </OverlayTrigger>
            ),
            dataIndex: "sdate",
            sorter: (a, b) => a.sdate.length - b.sdate.length,
            render: (text) => <div style={{ textAlign: "center" }}>{text}</div>,
            width: "200px",
        },


        {
            title: (
                <OverlayTrigger placement="top" overlay={<Tooltip >शॉप समाप्ती</Tooltip>}>
                    <div className="text-center">शॉप समाप्ती </div>
                </OverlayTrigger>
            ),
            dataIndex: "edate",
            sorter: (a, b) => a.edate.length - b.edate.length,
            render: (text) => <div style={{ textAlign: "center" }}>{text}</div>,
            width: "200px",
        },
        {
            title: (
                <OverlayTrigger placement="top" overlay={<Tooltip > डिपॉजिट </Tooltip>}>
                    <div className="text-center">डिपॉजिट</div>
                </OverlayTrigger>
            ),
            dataIndex: "deposit",
            sorter: (a, b) => a.deposit.length - b.deposit.length,
            render: (text) => <div style={{ textAlign: "right" }}>{text}</div>,
            width: "200px",
        },

        {
            title: (
                <OverlayTrigger placement="top" overlay={<Tooltip >भाडे</Tooltip>}>
                    <div className="text-center">भाडे</div>
                </OverlayTrigger>
            ),
            dataIndex: "rent",
            sorter: (a, b) => a.rent.length - b.rent.length,
            render: (text) => <div style={{ textAlign: "right" }}>{text}</div>,
            width: "200px",
        },

        {
            title: (
                <div className="text-center">कृती</div>
            ),

            dataIndex: "actions",
            key: "actions",
            width: "100px",
            render: (_, record) => (
                <div className="action-table-data">
                    <div className="edit-delete-action">

                        <OverlayTrigger
                            placement="top"
                            overlay={renderEditTooltip}
                        >
                            <a

                                className="me-2 p-2"
                                onClick={() => OnEdit(record.shid)}
                            >
                                <i data-feather="edit" className="feather-edit"></i>
                            </a>
                        </OverlayTrigger>

                        <OverlayTrigger placement="top" overlay={renderDeleteTooltip}>
                            <Link className="confirm-text p-2" to="#">
                                <i
                                    data-feather="trash-2"
                                    className="feather-trash-2"
                                    onClick={() => showConfirmationAlert1(record.shid)}
                                >

                                </i>

                            </Link>
                        </OverlayTrigger>
                    </div>
                </div>
            ),
        },
    ];


    const renderDeleteTooltip = (props) => (
        <Tooltip id="Edit-tooltip" {...props}>
            Delete
        </Tooltip>
    );


    const renderEditTooltip = (props) => (
        <Tooltip id="Edit-tooltip" {...props}>
            Edit
        </Tooltip>
    );


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

    return (
        <div className="page-wrapper">
            <div className="content">
                <div className="page-header">
                    <div className="add-item d-flex">
                        <div className="page-title">
                            <h3>गाळा वाटप</h3>
                            <h6>गाळ्यांचे व्यवस्थापन</h6>
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
                                <Link onClick={downloadExcel}>
                                    <ImageWithBasePath src="assets/img/icons/excel.svg" alt="img" />
                                </Link>
                            </OverlayTrigger>
                        </li>;
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
                        <Link to={route.AddGalaAlot} className="btn btn-added">
                            <PlusCircle className="me-2 iconsize" />गाळा जोडा
                        </Link>
                    </div>
                    <div className="page-btn">
                        <Link to={route.MasterIndex} className="btn btn-secondary">
                            <ArrowLeft className="me-2" />
                            मागे
                        </Link>
                    </div>
                </div>

                <div className="card table-list-card">
                    <div className="search-container mb-2 mt-2">
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
                    <div className="card-body">
                        <div className="table-responsive">
                            <Table columns={columns} dataSource={fetch} />

                        </div>
                    </div>
                </div>

                <Brand />
            </div>
        </div>
    );
};

export default GalaAlotMaster;

