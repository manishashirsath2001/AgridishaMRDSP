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
import axios from 'axios';
import { baseUrl, ACSPLGUID } from "../../core/json/custom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import marathiFontBase64 from "../../style/fonts/NotoSansDevanagari";

import {
    ArrowLeft,
    ChevronUp,
    Edit,
    Eye,
    PlusCircle,
    RotateCcw,
    Trash2,
} from "feather-icons-react/build/IconComponents";
import { getUserData } from '../../Context/UserData'
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const Parking = () => {
    const [activeTab, setActiveTab] = useState("inward"); // default is inward

    const userdetail = getUserData();
    const dispatch = useDispatch();
    const data = useSelector((state) => state.toggle_header);
    const route = all_routes;
    const [searchQuery, setSearchQuery] = useState("");
    const [Parking, Setparking] = useState([]);
    const [selectedData, setSelectedData] = useState({ paid: null });

    const navigate = useNavigate();

    const OnEdit = (paid, autoid) => {
        MySwal.fire({
            text: "तुम्हाला या माहितीत बदल करायचा आहे का?",
            showCancelButton: true,
            confirmButtonColor: "#00ff00",
            confirmButtonText: "होय, बदल करा!",
            cancelButtonColor: "#ff0000",
            cancelButtonText: "रद्द करा",
        }).then((result) => {
            if (result.isConfirmed) {
                setSelectedData({ paid, autoid });
                navigate("/AddParking", { state: { paid, autoid } }); // Pass shid to AddGala page

            }
        });
    };


    const handleProceed = (paid) => {
        setSelectedData({ paid: paid });

    };


    const downloadPDF = () => {


        const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        const cleanBase64 = marathiFontBase64.replace(/^data:font\/ttf;base64,/, "");

        doc.addFileToVFS("NotoSansDevanagari.ttf", cleanBase64);
        doc.addFont("NotoSansDevanagari.ttf", "NotoSansDevanagari", "normal");

        doc.setFont("NotoSansDevanagari", "normal");
        doc.setFontSize(16);
        const title = "लिलाव अहवाल";
        const titleWidth = doc.getTextWidth(title);
        doc.text(title, (pageWidth - doc.getTextWidth(title)) / 2, 20);
        const borderMargin = 10;
        doc.rect(borderMargin, borderMargin, pageWidth - borderMargin * 2, pageHeight - borderMargin * 2);
        doc.text(title, (pageWidth - titleWidth) / 2, 20);
        doc.setLineWidth(0.5);
        doc.line((pageWidth - titleWidth) / 2, 22, (pageWidth + titleWidth) / 2, 22);
        const tableColumn = [["ग्राहक", "तृतीय पक्ष", "वस्तू", "प्रकार", "वजन (किलो) ", "तारीख ", "स्थानी"]];

        const tableRows = ColdStorage.map((item) => {


            return [
                item.cname,
                item.thirdpartyname,
                item.product,
                item.typeofvarity,
                item.weightinkg,
                item.date,
                item.rackposition,
            ];
        });

        const sanitizedTableRows = tableRows.map(row =>
            row.map(cell => (cell ? cell.toString() : ""))
        );

        autoTable(doc, {
            startY: 30,
            head: tableColumn,
            body: sanitizedTableRows,
            theme: 'grid',
            // Heading in Marathi
            headStyles: {
                font: "NotoSansDevanagari",
                fontSize: 11,
                fontStyle: "normal",
                fillColor: [169, 169, 169],
                textColor: 0,
            },

            // Body data in English
            styles: {
                font: "helvetica", // English font
                fontSize: 9,
                halign: "center",
                cellPadding: 2,
                overflow: 'linebreak',
            },
            columnStyles: {
                2: {
                    font: "NotoSansDevanagari", // English font
                    fontSize: 12,
                }
            },

            // alternateRowStyles: { fillColor: [240, 240, 240] },
        });

        const blob = doc.output("blob");
        const blobURL = URL.createObjectURL(blob);
        window.open(blobURL, "_blank");
    };



    const downloadExcel = async () => {
        try {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("Cold Storage Report");

            const headingRow = worksheet.addRow(["ColdStorage (Report)"]);
            headingRow.getCell(1).font = { bold: true, size: 16 };
            headingRow.getCell(1).alignment = { horizontal: "center", vertical: "middle" };
            worksheet.mergeCells("A1:G1");

            const headers = ["Customer", " Third Party ", "Item", "Variety", "Weight", "Date", " Position"];
            const headerRow = worksheet.addRow(headers);

            headerRow.eachCell(cell => {
                cell.font = { bold: true, color: { argb: "FFFFFF" } };
                cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "808080" } };
                cell.alignment = { horizontal: "center", vertical: "middle" };
            });

            headers.forEach((_, index) => {
                worksheet.getColumn(index + 1).width = 18;
            });

            ColdStorage.forEach(item => {
                const row = worksheet.addRow([
                    item.cname,
                    item.thirdpartyname,
                    item.product,
                    item.typeofvarity,
                    item.weightinkg,
                    item.date,
                    item.rackposition,
                ]);
                row.eachCell(cell => {
                    cell.alignment = { horizontal: "center", vertical: "middle" };
                });
            });

            const buffer = await workbook.xlsx.writeBuffer();
            const data = new Blob([buffer], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            });
            saveAs(data, "ColdStorage_Report.xlsx");
        } catch (error) {
            console.error("Error generating Excel file:", error);
        }
    };

    useEffect(() => {
        const handleShortcut = (e) => {
            if (e.ctrlKey && e.key === 'a' || e.ctrlKey && e.key === 'A') {
                e.preventDefault();
                navigate(route.AddParking);
            }

        };

        window.addEventListener('keydown', handleShortcut);

        return () => {
            window.removeEventListener('keydown', handleShortcut);
        };
    }, [navigate]);




    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
        try {
            const payload =


            {
                "paid": "%",
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
                url: baseUrl.Url + "/backend/api/GET_PARKING/_Search",
                data: JSON.stringify(payload),
                headers: headers,
            })

                .then((response) => {
                    if (response.status != 200) throw new Error("Failed to send otp");
                    console.log("response", response.data);
                    Setparking(response.data);
                })
        } catch (error) {
            console.error("Error while searching WareHouse data:", error);
        }
    };




    const Ondeleteparking = async (paid) => {
        try {
            const payload = {
                "paid": paid,
                "companyid": userdetail?.companyID ? userdetail.companyID : "",
                "deptid": userdetail?.departmentID ? userdetail.departmentID : "",
            }
            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            axios({
                method: "POST",
                url: baseUrl.Url + "/backend/api/SP_DeleteParking",
                data: JSON.stringify(payload),
                headers: headers,
            })
                .then((response) => {
                    if (response.status !== 200) throw new Error("Failed to Fetching Data");
                    MySwal.fire({
                        title: response.data[0].responseCode === "FAILURE" ? "Deletion Not Allowed" : "रेकॉर्ड हटवले...!",
                        text: response.data[0].responseMessage,
                        icon: response.data[0].responseCode === "FAILURE" ? "error" : "success",
                        confirmButtonText: "OK",
                        customClass: {
                            confirmButton: response.data[0].responseCode === "FAILURE" ? "btn btn-danger" : "btn btn-success",
                        },
                    });
                    try {
                        const payload = {
                            "paid": "%",
                            "keyword": "%",
                            "companyid": userdetail?.companyID ? userdetail.companyID : "",
                            "deptid": userdetail?.departmentID ? userdetail.departmentID : "",
                        }

                        axios({
                            method: "POST",
                            url: baseUrl.Url + "/backend/api/GET_PARKING",
                            data: JSON.stringify(payload),
                            headers: headers,
                        })
                            .then((response) => {
                                if (response.status !== 200) throw new Error("Failed to Fetching Data");
                                const DATA = response.data;
                                Setparking(DATA);
                            });
                    } catch (error) {
                        console.error("Error fetching Access Right Data:", error);
                    }
                });
        } catch (error) {
            console.error("Error fetching Access Right Data:", error);
        }
    };


    const showConfirmationAlert = (paid) => {
        MySwal.fire({
            title: "तुम्हाला खात्री आहे का? ",
            text: "तुम्ही हे बदलू शकणार नाही!",
            showCancelButton: true,
            confirmButtonColor: "#00ff00",
            confirmButtonText: "हो , हटवा !",
            cancelButtonColor: "#ff0000",
            cancelButtonText: "रद्द करा",
        }).then((result) => {
            if (result.isConfirmed) {
                Ondeleteparking(paid);
            } else {
                MySwal.close();
            }
        });
    };


    const renderDeleteTooltip = (props) => (
        <Tooltip id="Edit-tooltip" {...props}>
            हटवा
        </Tooltip>
    );


    const renderEditTooltip = (props) => (
        <Tooltip id="Edit-tooltip" {...props}>
            बदल करा
        </Tooltip>
    );
    const renderproceeTooltip = (props) => (
        <Tooltip id="Edit-tooltip" {...props}>
            प्रोसीड
        </Tooltip>
    );

    const columns = [

        {
            title: "आयडी",
            dataIndex: "autoid",
            sorter: (a, b) => a.autoid.length - b.autoid.length,
        },
        {
            title: (
                <OverlayTrigger placement="top" overlay={<Tooltip >तारीख</Tooltip>}>
                    <div className="text-center">तारीख</div>
                </OverlayTrigger>
            ),
            dataIndex: "date",
            sorter: (a, b) => a.date.length - b.date.length,
            render: (text) => <div style={{ textAlign: "left" }}>{text}</div>,
            width: "150px",
        },
        {
            title: "प्रकार",
            dataIndex: "parktype",
            sorter: (a, b) => a.parktype.length - b.parktype.length,
        },
        {
            title: "वाहन क्रमांक ",
            dataIndex: "vnumber",
            sorter: (a, b) => a.vnumber.length - b.vnumber.length,
        },
        {
            title: "मालकाचे नाव",
            dataIndex: "vownername",
            sorter: (a, b) => a.vownername.length - b.vownername.length,
        },
        {
            title: "वाहन प्रकार ",
            dataIndex: "vtype",
            sorter: (a, b) => a.vtype.length - b.vtype.length,
        },

        {
            title: "शुल्क ",
            dataIndex: "vcharge",
            sorter: (a, b) => a.vcharge.length - b.vcharge.length,
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
                                onClick={() => OnEdit(record.paid, record.autoid)}
                            >
                                <i data-feather="edit" className="feather-edit"></i>
                            </a>
                        </OverlayTrigger>



                        {/* <OverlayTrigger
                            placement="top"
                            overlay={renderproceeTooltip}
                        >
                            <Link className="me-2 p-2"
                                to="#"
                                onClick={() => handleProceed(record.paid)}
                                data-bs-toggle="modal"
                                data-bs-target="#add-units-category"
                                style={{ color: 'green' }}>
                                <i data-feather="arrow-right-circle" className="feather-arrow-right-circle"></i>
                            </Link>
                        </OverlayTrigger> */}

                        <OverlayTrigger placement="top" overlay={renderDeleteTooltip}>
                            <Link className="confirm-text p-2" to="#">
                                <i
                                    data-feather="trash-2"
                                    className="feather-trash-2"
                                    onClick={() => showConfirmationAlert(record.paid)}
                                >
                                </i>
                            </Link>
                        </OverlayTrigger>
                    </div>
                </div>
            ),
        },
    ];



    useEffect(() => {
        const listener = () => {
            console.log("fetchData event received");
            fetchData();
        };

        window.addEventListener("fetchData", listener);
        return () => window.removeEventListener("fetchData", listener);
    }, []);

    useEffect(() => {

        const fetchData = async () => {
            try {
                const payload =
                {
                    "paid": "%",
                    "keyword": "%",
                    "companyid": userdetail?.companyID ? userdetail.companyID : "",
                    "deptid": userdetail?.departmentID ? userdetail.departmentID : "",
                };


                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };
                const response = await axios.post(
                    `${baseUrl.Url}/backend/api/GET_PARKING`,

                    payload,
                    { headers }
                );
                if (response.status !== 200)
                    throw new Error("Failed to fetch vendor data");
                console.log("parking", response.data)
                Setparking(response.data);
            } catch (error) {
                console.error("Error fetching vendor data:", error);
            }
        };
        fetchData();
    }, []);




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
                            <h3>पार्किंग मास्टर</h3>
                            <h6>व्यवस्थापन पार्किंग</h6>
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
                        <Link to={route.AddParking} className="btn btn-added">
                            <PlusCircle className="me-2 iconsize" /> पार्किंग जोडा
                        </Link>
                    </div>
                    <div className="page-btn">
                        <Link to={route.test} className="btn btn-secondary">
                            <ArrowLeft className="me-2" />
                            मागे
                        </Link>
                    </div>
                </div>

                <div className="content">




                    <div className="search-container mb-2 mt-2">
                        <div className="row">
                            <div className="col-lg-6 col-12 ms-auto">
                                <div className="input-group">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="शोधा"
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
                                <Table columns={columns} dataSource={Parking} />
                            </div>
                        </div>
                    </div>


                    <Brand />
                </div>
            </div>
        </div>
    );
};

export default Parking;

