import React, { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import ImageWithBasePath from "../../core/img/imagewithbasebath";
import Brand from "../../core/modals/inventory/brand";
import AddStoreMaster from "../Masters/AddStoreMaster";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { all_routes } from "../../Router/all_routes";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import Table from "../../core/pagination/datatable";
import { useNavigate } from "react-router-dom";
import { setToogleHeader } from "../../core/redux/action";
import axios from 'axios';
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { baseUrl, ACSPLGUID } from "../../core/json/custom";
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
const Shop = () => {
    const userdetail = getUserData();
    const dispatch = useDispatch();
    const data = useSelector((state) => state.toggle_header);
    const route = all_routes;
    const [ShopMaster, setShopMaster] = useState([]);

    const navigate = useNavigate();
    const [selectedData, setSelectedData] = useState({ storid: null });


    const OnEdit = (storid) => {
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
                setSelectedData({ storid });
                navigate(route.AddShop, { state: { storid } });
            }
        }); // ✅ Missing closing bracket added
    };

    const columns = [



        {
            title: (
                <OverlayTrigger placement="top" overlay={<Tooltip >शॉप नाव </Tooltip>}>
                    <div className="text-center">शॉप नाव</div>
                </OverlayTrigger>
            ),
            dataIndex: "storename",
            sorter: (a, b) => a.storename.length - b.storename.length,
            render: (text) => <div style={{ textAlign: "left" }}>{text}</div>,
            width: "200px",
        },
        {
            title: (
                <OverlayTrigger placement="top" overlay={<Tooltip >तारीख</Tooltip>}>
                    <div className="text-center">तारीख</div>
                </OverlayTrigger>
            ),
            dataIndex: "sdate",
            sorter: (a, b) => a.sdate.length - b.sdate.length,
            render: (text) => <div style={{ textAlign: "left" }}>{text}</div>,
            width: "200px",
        },


        {
            title: (
                <OverlayTrigger placement="top" overlay={<Tooltip >स्थlळ</Tooltip>}>
                    <div className="text-center">स्थlळ</div>
                </OverlayTrigger>
            ),
            dataIndex: "storelocation",
            sorter: (a, b) => a.storelocation.length - b.storelocation.length,
            render: (text) => <div style={{ textAlign: "left" }}>{text}</div>,
            width: "200px",
        },


        {
            title: (
                <OverlayTrigger placement="top" overlay={<Tooltip >भाडे </Tooltip>}>
                    <div className="text-center">भाडे</div>
                </OverlayTrigger>
            ),
            dataIndex: "storerent",
            sorter: (a, b) => a.storerent.length - b.storerent.length,
            render: (text) => <div style={{ textAlign: "right" }}>{text}</div>,
            width: "200px",
        },

        {
            title: (
                <OverlayTrigger placement="top" overlay={<Tooltip >डिपॉजिट</Tooltip>}>
                    <div className="text-center">डिपॉजिट</div>
                </OverlayTrigger>
            ),
            dataIndex: "storedeposit",
            sorter: (a, b) => a.storedeposit.length - b.storedeposit.length,
            render: (text) => <div style={{ textAlign: "right" }}>{text}</div>,
            width: "200px",
        },

        {
            title: (
                <OverlayTrigger placement="top" overlay={<Tooltip >क्षमता</Tooltip>}>
                    <div className="text-center">क्षमता</div>
                </OverlayTrigger>
            ),
            dataIndex: "storecapacity",
            sorter: (a, b) => a.storecapacity.length - b.storecapacity.length,
            render: (text) => <div style={{ textAlign: "right" }}>{text}</div>,
            width: "200px",
        },
        {
            title: (
                <OverlayTrigger placement="top" overlay={<Tooltip >स्थिती</Tooltip>}>
                    <div className="text-center">स्थिती</div>
                </OverlayTrigger>
            ),
            dataIndex: "vstatus",
            sorter: (a, b) => a.vstatus.length - b.vstatus.length,
            render: (text) => <div style={{ textAlign: "left" }}>{text}</div>,
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
                                // to="/AddStoreMaster"
                                className="me-2 p-2"
                                onClick={() => OnEdit(record.storid)}
                            >
                                <i data-feather="edit" className="feather-edit"></i>
                            </a>
                        </OverlayTrigger>

                        <OverlayTrigger placement="top" overlay={renderDeleteTooltip}>
                            <Link className="confirm-text p-2" to="#">
                                <i
                                    data-feather="trash-2"
                                    className="feather-trash-2"
                                    onClick={() => showConfirmationAlert(record.storid)}
                                >

                                </i>

                            </Link>
                        </OverlayTrigger>
                    </div>
                </div>
            ),
        },
    ];

    // const downloadPDF = () => {
    //   const doc = new jsPDF();
    //   const pageWidth = doc.internal.pageSize.getWidth();
    //   const pageHeight = doc.internal.pageSize.getHeight();

    //   doc.setFontSize(12);
    //   doc.setFont("Helvetica", "bold"); Z
    //   const title = "गाळा मास्टर (Report).pdf";
    //   const titleWidth = doc.getTextWidth(title);

    //   const borderMargin = 10;
    //   doc.rect(borderMargin, borderMargin, pageWidth - borderMargin * 2, pageHeight - borderMargin * 2);

    //   doc.text(title, (pageWidth - titleWidth) / 2, 20);
    //   doc.setLineWidth(0.5);
    //   doc.line((pageWidth - titleWidth) / 2, 22, (pageWidth + titleWidth) / 2, 22);

    //   doc.setFontSize(13);
    //   doc.setFont("Helvetica", "normal");
    //   let yPosition = 15;



    //   const tableColumn = ["गाळा नाव", " तारीख", "स्थlळ", "भाड", "डिपॉजिट", "क्षमता", "कृती"];

    //   // Table rowsगाळा नाव  गाळा तारीख गाळा स्थlळ गाळा भाड  गाळा डिपॉजिट  गाळा क्षमता कृती
    //   const tableRows = ShopMaster.map(item => [
    //     item.storename,
    //     item.sdate,
    //     item.storelocation,
    //     item.storerent,
    //     item.storedeposit,
    //     item.storecapacity,
    //     item.vstatus

    //   ]);

    //   autoTable(doc, {
    //     startY: yPosition + 10,
    //     head: [tableColumn],
    //     body: tableRows,
    //     theme: 'grid',
    //     styles: { fontSize: 10, halign: "center", lineColor: [0, 0, 0], lineWidth: 0.20 }, // Dark border lines
    //     headStyles: { fillColor: [169, 169, 169], textColor: 0, fontStyle: "bold" }, // Gray header
    //     bodyStyles: { textColor: 0 }, // Black text in table
    //   });
    //   doc.save("गाळा मास्टर (Report).pdf");
    // };

    const downloadPDF = () => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        doc.setFontSize(12);
        doc.setFont("Helvetica", "bold");
        const title = "शॉप मास्टर (Report)";
        const titleWidth = doc.getTextWidth(title);

        const borderMargin = 10;
        doc.rect(borderMargin, borderMargin, pageWidth - borderMargin * 2, pageHeight - borderMargin * 2);

        doc.text(title, (pageWidth - titleWidth) / 2, 20);
        doc.setLineWidth(0.5);
        doc.line((pageWidth - titleWidth) / 2, 22, (pageWidth + titleWidth) / 2, 22);

        doc.setFontSize(13);
        doc.setFont("Helvetica", "normal");
        let yPosition = 15;



        const tableColumn = ["शॉप नाव", " तारीख", "स्थlळ", "भाड", "डिपॉजिट", "क्षमता", "कृती"];

        // Table rows
        const tableRows = ShopMaster.map(item => [


            item.storename,
            item.sdate,
            item.storelocation,
            item.storerent,
            item.storedeposit,
            item.storecapacity,
            item.vstatus

        ]);


        autoTable(doc, {
            startY: yPosition + 10,
            head: [tableColumn],
            body: tableRows,
            theme: 'grid',
            styles: { fontSize: 10, halign: "center", lineColor: [0, 0, 0], lineWidth: 0.20 }, // Dark border lines
            headStyles: { fillColor: [169, 169, 169], textColor: 0, fontStyle: "bold" }, // Gray header
            bodyStyles: { textColor: 0 }, // Black text in table
        });
        doc.save("शॉप मास्टर (Report).pdf");
    };

    const downloadExcel = async () => {
        try {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("शॉप मास्टर (Report)");

            // **Main Heading Row**
            const headingRow = worksheet.addRow(["शॉप मास्टर(Report)"]);
            headingRow.getCell(1).font = { bold: true, size: 16 };
            headingRow.getCell(1).alignment = { horizontal: "center", vertical: "middle" };

            // Merge heading across all columns
            worksheet.mergeCells("A1:G1");

            // **Header Row**
            const headers = ["शॉप नाव", " तारीख", "स्थlळ", "भाड", "डिपॉजिट", "क्षमता", "कृती"];

            const headerRow = worksheet.addRow(headers);

            headerRow.eachCell((cell) => {
                cell.font = { bold: true, color: { argb: "FFFFFF" } };
                cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "808080" } };
                cell.alignment = { horizontal: "center", vertical: "middle" };
            });

            // **Setting Column Widths**
            const columnWidths = [25, 25, 25, 25, 25, 20, 20]; // Adjust widths as needed
            columnWidths.forEach((width, index) => {
                worksheet.getColumn(index + 1).width = width;
            });

            // **Adding Data Rows**
            ShopMaster.forEach(({ storename, sdate, storelocation, storerent, storedeposit, storecapacity, vstatus }) => {
                const row = worksheet.addRow([storename, sdate, storelocation, storerent, storedeposit, storecapacity, vstatus]);
                row.eachCell((cell) => {
                    cell.alignment = { horizontal: "center", vertical: "middle" };
                });

            });

            // **Generate and Save Excel File**
            const buffer = await workbook.xlsx.writeBuffer();
            const data = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
            saveAs(data, "शॉप मास्टर(Report).xlsx");

        } catch (error) {
            console.error("Error generating the Excel file:", error);
        }
    };


    useEffect(() => {
        const handleShortcut = (e) => {
            if (e.ctrlKey && e.key === 'a' || e.ctrlKey && e.key === 'A') {
                e.preventDefault();
                navigate(route.AddStoreMaster);
            }

        };

        window.addEventListener('keydown', handleShortcut);

        return () => {
            window.removeEventListener('keydown', handleShortcut);
        };
    }, [navigate]);

    useEffect(() => {

        const fetchShopMaster = async () => {
            try {
                const payload =
                {
                    "storid": "%",
                    "keyword": "%",
                    "companyid": userdetail?.companyID ? userdetail.companyID : "",
                    "deptid": userdetail?.departmentID ? userdetail.departmentID : ""

                };


                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };
                const response = await axios.post(
                    `${baseUrl.Url}/backend/api/GET_MarketStore`,

                    payload,
                    { headers }
                );
                if (response.status !== 200)
                    throw new Error("Failed to fetch vendor data");
                console.log("quatation master", response.data)
                setShopMaster(response.data);
            } catch (error) {
                console.error("Error fetching vendor data:", error);
            }
        };

        fetchShopMaster();

    }, []);

    const showConfirmationAlert = (storid) => {
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

                OndeletestockTransfer(storid);
            } else {
                MySwal.close();
            }

        });
    };
    const OndeletestockTransfer = async (storid) => {
        try {
            const payload = {
                "storid": storid,
                "companyid": userdetail?.companyID ? userdetail.companyID : "",
                "deptid": userdetail?.departmentID ? userdetail.departmentID : ""
            };
            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            axios({
                method: "POST",
                url: baseUrl.Url + "/backend/api/SP_DeleteMarketStore",
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
                    });
                    try {
                        const payload = {
                            "storid": "%",
                            "keyword": "%",
                            "companyid": userdetail?.companyID ? userdetail.companyID : "",
                            "deptid": userdetail?.departmentID ? userdetail.departmentID : ""

                        };
                        const headers = {
                            "Content-Type": "application/json",
                            Accept: "*/*",
                        };

                        axios({
                            method: "POST",
                            url: baseUrl.Url + "/backend/api/GET_MarketStore",
                            data: JSON.stringify(payload),
                            headers: headers,
                        })
                            .then((response) => {
                                if (response.status != 200) throw new Error("Failed to Fetching Data");
                                const DATA = response.data;
                                setShopMaster(DATA);
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


    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
        try {
            const payload =

            {
                "storid": "%",
                "keyword": event.target.value,
                "companyid": userdetail?.companyID ? userdetail.companyID : "",
                "deptid": userdetail?.departmentID ? userdetail.departmentID : ""
            }

            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            axios({
                method: "POST",
                url: baseUrl.Url + "/backend/api/GET_MarketStore/_Search",
                data: JSON.stringify(payload),
                headers: headers,
            })

                .then((response) => {
                    if (response.status != 200) throw new Error("Failed to send otp");
                    console.log("response", response.data);
                    setShopMaster(response.data);
                })
        } catch (error) {
            console.error("Error while searching WareHouse data:", error);
        }
    };


    // Empty data source
    const dataSource = [];
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
                            <h3>शॉप मास्टर</h3>
                            <h6>शॉप व्यवस्थापण </h6>
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
                        <Link to={route.AddShop} className="btn btn-added">
                            <PlusCircle className="me-2 iconsize" /> नविन शॉप नोंदवा
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
                            <Table columns={columns} dataSource={ShopMaster} />
                        </div>
                    </div>
                </div>

                <Brand />
                {/* <AddStoreMaster STORID={selectedData.storid} /> */}
            </div>
        </div>
    );
};

export default Shop;

