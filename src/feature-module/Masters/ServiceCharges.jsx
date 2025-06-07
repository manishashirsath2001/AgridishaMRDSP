import React, { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ImageWithBasePath from "../../core/img/imagewithbasebath";
import Brand from "../../core/modals/inventory/brand";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { baseUrl, ACSPLGUID } from "../../core/json/custom";
import { all_routes } from "../../Router/all_routes";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import Table from "../../core/pagination/datatable";
import { setToogleHeader } from "../../core/redux/action";
import Select from "react-select";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import marathiFontBase64 from "../../style/fonts/NotoSansDevanagari";
import axios from 'axios';

import {
    ArrowLeft,
    ChevronUp,
    Edit,
    Eye,
    RefreshCcw,
    PlusCircle,
    RotateCcw,


    Trash2,
} from "feather-icons-react/build/IconComponents";
// import AddServiceType from "../../core/modals/inventory/AddServiceType";
import AddCategory from "../../core/modals/inventory/addcategory";
import { getUserData } from '../../Context/UserData'
const ServiceCharges = () => {
    const { userdetail } = getUserData();
    const GUID = ACSPLGUID.getNew();
    const dispatch = useDispatch();
    const [RateType, setRateType] = useState([]);
    const [ServiceType, setServiceType] = useState([]);
    const [RateApplicable, setRateApplicable] = useState([]);
    const [Customer, setCustomer] = useState([]);
    const data = useSelector((state) => state.toggle_header);
    const route = all_routes;
    const [formData, setFormData] = useState({
        RateApplicable: "",
        SCID: "",
        ServiceType: "",
        Rate: "",
        RateType: "",
        lejar: "",

    });

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

    // const downloadPDF = () => {
    //   const doc = new jsPDF();
    //   const pageWidth = doc.internal.pageSize.getWidth();

    //   const cleanBase64 = marathiFontBase64.replace(/^data:font\/ttf;base64,/, "");

    //   // Add custom font that supports both Marathi and English
    //   doc.addFileToVFS("NotoSansDevanagari.ttf", cleanBase64);
    //   doc.addFont("NotoSansDevanagari.ttf", "NotoSansDevanagari", "normal");
    //   doc.setFont("NotoSansDevanagari", "normal");
    //   doc.setFontSize(16);

    //   const title = "सेवा शुल्क";
    //   doc.text(title, (pageWidth - doc.getTextWidth(title)) / 2, 20);

    //   const tableColumn = [["लागु", "सेवा प्रकार", "दर प्रकार", "दर"]];

    //   const tableRows = Customer.map(item => [
    //     item.rappli,
    //     item.stype,
    //     item.rtype, // English OK here
    //     item.rate
    //   ]);

    //   autoTable(doc, {
    //     startY: 30,
    //     head: tableColumn,
    //     body: tableRows,
    //     styles: {
    //       font: "NotoSansDevanagari",
    //       fontStyle: "normal",
    //       fontSize: 12
    //     },
    //     headStyles: {
    //       fontStyle: "normal",
    //       fillColor: [0, 102, 204],
    //       textColor: 255,
    //       fontSize: 14
    //     },
    //     alternateRowStyles: { fillColor: [240, 240, 240] },
    //   });

    //   window.open(doc.output("bloburl"), "_blank");
    // };

    const downloadPDF = () => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();

        const cleanBase64 = marathiFontBase64.replace(/^data:font\/ttf;base64,/, "");

        doc.addFileToVFS("NotoSansDevanagari.ttf", cleanBase64);
        doc.addFont("NotoSansDevanagari.ttf", "NotoSansDevanagari", "normal");

        // Title: Marathi font
        doc.setFont("NotoSansDevanagari", "normal");
        doc.setFontSize(16);
        const title = "सेवा शुल्क";
        doc.text(title, (pageWidth - doc.getTextWidth(title)) / 2, 20);

        // Table headings in Marathi
        const tableColumn = [["लागु", "सेवा प्रकार", "दर प्रकार", "दर"]];

        // Table body data in English
        const tableRows = Customer.map((item) => {



            return [
                item.rappli,
                item.stype,
                item.rtype, // English OK here
                item.rate

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


    // const downloadPDF = () => {
    //   const doc = new jsPDF();
    //   const pageWidth = doc.internal.pageSize.getWidth();

    //   const cleanBase64 = marathiFontBase64.replace(/^data:font\/ttf;base64,/, "");

    //   // Add custom font that supports both Marathi and English
    //   doc.addFileToVFS("NotoSansDevanagari.ttf", cleanBase64);
    //   doc.addFont("NotoSansDevanagari.ttf", "NotoSansDevanagari", "normal");
    //   doc.setFont("NotoSansDevanagari", "normal");
    //   doc.setFontSize(16);

    //   const title = "सेवा शुल्क";
    //   doc.text(title, (pageWidth - doc.getTextWidth(title)) / 2, 20);

    //   const tableColumn = [["लागु", "सेवा प्रकार", "दर प्रकार", "दर"]];

    //   const tableRows = Customer.map(item => [
    //     item.rappli,
    //     item.stype,
    //     item.rtype, // English OK here
    //     item.rate
    //   ]);
    //   const titleWidth = doc.getTextWidth(title);
    //   const borderMargin = 10;
    //   doc.rect(borderMargin, borderMargin, pageWidth - borderMargin * 2, pageHeight - borderMargin * 2);

    //   doc.text(title, (pageWidth - titleWidth) / 2, 20);
    //   doc.setLineWidth(0.5);
    //   doc.line((pageWidth - titleWidth) / 2, 22, (pageWidth + titleWidth) / 2, 22);

    //   doc.setFontSize(13);
    //   doc.setFont("Helvetica", "normal");
    //   let yPosition = 15;





    //   autoTable(doc, {
    //     startY: yPosition + 10,
    //     head: [tableColumn],
    //     body: tableRows,
    //     theme: 'grid',
    //     styles: { fontSize: 10, halign: "center", lineColor: [0, 0, 0], lineWidth: 0.20 }, // Dark border lines
    //     headStyles: { fillColor: [169, 169, 169], textColor: 0, fontStyle: "bold" }, // Gray header
    //     bodyStyles: { textColor: 0 }, // Black text in table
    //   });
    //   doc.save("सेवा शुल्क (Report).pdf");
    //   window.open(doc.output("bloburl"), "_blank");
    // };



    const downloadExcel = async () => {
        try {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("सेवा शुल्क (Report)");

            // **Main Heading Row**
            const headingRow = worksheet.addRow(["सेवा शुल्क (Report)"]);
            headingRow.getCell(1).font = { bold: true, size: 16 };
            headingRow.getCell(1).alignment = { horizontal: "center", vertical: "middle" };

            // Merge heading across all columns
            worksheet.mergeCells("A1:D1");

            // **Header Row**
            const headers = ["दर लागु", "सेवा प्रकार", "दर प्रकार", "दर"];
            const headerRow = worksheet.addRow(headers);

            headerRow.eachCell((cell) => {
                cell.font = { bold: true, color: { argb: "FFFFFF" } };
                cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "808080" } };
                cell.alignment = { horizontal: "center", vertical: "middle" };
            });

            // **Setting Column Widths**
            const columnWidths = [25, 25, 25, 25, 20]; // Adjust widths as needed
            columnWidths.forEach((width, index) => {
                worksheet.getColumn(index + 1).width = width;
            });

            // **Adding Data Rows**
            Customer.forEach(({ rappli, stype, rtype, rate }) => {
                const row = worksheet.addRow([rappli, stype, rtype, rate]);
                row.eachCell((cell) => {
                    cell.alignment = { horizontal: "center", vertical: "middle" };
                });

            });

            // **Generate and Save Excel File**
            const buffer = await workbook.xlsx.writeBuffer();
            const data = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
            saveAs(data, "सेवा शुल्क (Report).xlsx");

        } catch (error) {
            console.error("Error generating the Excel file:", error);
        }
    };

    const handleStatusToggle = async (row, currentStatus) => {
        try {
            const updatedStatus = !currentStatus; // Toggle status

            const payload1 = {
                scid: row.scid,
                rateapplicable: row.rateapplicable,
                servicetype: row.servicetype,
                rate: row.rate,
                lejar: row.lejar,
                ratetype: row.ratetype,
                isapproval: updatedStatus,
                "companyid": userdetail?.companyID ? userdetail.companyID : "",
                "deptid": userdetail?.departmentID ? userdetail.departmentID : "",
                uaid: userdetail?.uaid || ""
            };

            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            // API Call
            const response1 = await axios.post(baseUrl.Url + "/backend/api/SP_AddUpdServiceCharge", payload1, { headers });

            if (response1.status === 200) {
                // Update only the toggled item in the list
                setProductList((prevList) =>
                    prevList.map((product) =>
                        product.scid === scid ? { ...product, isapproval: updatedStatus } : product
                    )

                );
                try {
                    const payload = {
                        "scid": "%",
                        "keyword": "%",
                        "rateapplicable": "",
                        "servicetype": "",
                        "ratetype": "",
                        "lejar": "",
                        "rate": 0,
                        "companyid": userdetail?.companyID ? userdetail.companyID : "",
                        "deptid": userdetail?.departmentID ? userdetail.departmentID : "",
                    };
                    const headers = {
                        "Content-Type": "application/json",
                        Accept: "*/*",
                    };

                    axios({
                        method: "POST",
                        url: baseUrl.Url + "/backend/api/GET_ServiceCharge",
                        data: JSON.stringify(payload),
                        headers: headers,
                    })
                        .then((response) => {
                            if (response.status != 200) throw new Error("Failed to Fetching Data");
                            const DATA = response.data;
                            setCustomer(DATA);
                        })

                } catch (error) {
                    console.error("Error fetching Access Right Data:", error);
                }

                MySwal.fire({
                    icon: "success",
                    title: "साठवले!",
                    text: "माहिती यशस्वीरित्या सेव झाली.",
                    confirmButtonText: "OK",
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                });
            } else {
                throw new Error("Failed to update status.");
            }
        } catch (error) {
            console.error("Submission Error:", error);
            MySwal.fire({
                icon: "error",
                title: "त्रुटी",
                text: "माहिती सेव करण्यास अपयश. कृपया पुन्हा प्रयत्न करा.",
                allowOutsideClick: false,
                allowEscapeKey: false,
            });
        }
    };








    const columns = [



        {
            title: (
                <OverlayTrigger placement="top" overlay={<Tooltip >दर लागु  </Tooltip>}>
                    <div className="text-center">दर लागु</div>
                </OverlayTrigger>
            ),
            dataIndex: "rappli",
            sorter: (a, b) => a.rappli.length - b.rappli.length,
            render: (text) => <div style={{ textAlign: "left" }}>{text}</div>,
            width: "200px",
        },
        {
            title: (
                <OverlayTrigger placement="top" overlay={<Tooltip >सेवा प्रकार</Tooltip>}>
                    <div className="text-center">सेवा प्रकार</div>
                </OverlayTrigger>
            ),
            dataIndex: "stype",
            sorter: (a, b) => a.stype.length - b.stype.length,
            render: (text) => <div style={{ textAlign: "left" }}>{text}</div>,
            width: "200px",
        },

        {
            title: (
                <OverlayTrigger placement="top" overlay={<Tooltip >दर प्रकार</Tooltip>}>
                    <div className="text-center">दर प्रकार</div>
                </OverlayTrigger>
            ),
            dataIndex: "rtype",
            sorter: (a, b) => a.rtype.length - b.rtype.length,
            render: (text) => <div style={{ textAlign: "left" }}>{text}</div>,
            width: "200px",
        },


        {
            title: (
                <OverlayTrigger placement="top" overlay={<Tooltip >दर </Tooltip>}>
                    <div className="text-center">दर </div>
                </OverlayTrigger>
            ),
            dataIndex: "rate",

            render: (text) => <div style={{ textAlign: "right" }}>{text}</div>,
            width: "200px",
        },
        {
            title: (
                <OverlayTrigger placement="top" overlay={<Tooltip >लेजर </Tooltip>}>
                    <div className="text-center">लेजर </div>
                </OverlayTrigger>
            ),
            dataIndex: "lejarl",
            sorter: (a, b) => a.lejarl.length - b.lejarl.length,
            render: (text) => <div style={{ textAlign: "right" }}>{text}</div>,
            width: "200px",
        },

        {
            title: (
                <OverlayTrigger placement="top" overlay={<Tooltip>स्थिती</Tooltip>}>
                    <div className="text-center">स्थिती</div>
                </OverlayTrigger>
            ),
            dataIndex: "isapproval",
            sorter: (a, b) => a.rate.length - b.rate.length,
            render: (text, record) => (
                <div className="d-flex justify-content-center">
                    <span className={`badge ${record.isapproval ? "badge-success" : "badge-danger"}`}>
                        <Link
                            to="#"
                            style={{ color: "white", textDecoration: "none" }}
                            onClick={() => handleStatusToggle(record, record.isapproval)}
                        >
                            {record.isapproval ? "Active" : "Inactive"}
                        </Link>
                    </span>
                </div>
            ),
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
                            <Link
                                className="me-2 p-2"
                                to="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleEdit(record); // Pass the full record instead of just scid
                                }}
                            >
                                <i data-feather="edit" className="feather-edit"></i>
                            </Link>
                        </OverlayTrigger>
                        <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip id="delete-tooltip me-2">Delete</Tooltip>}
                        >
                            <Link
                                className="confirm-text p-2 me-2"
                                to="#"
                                onClick={() => showConfirmationAlert(record.scid)}
                            >
                                <Trash2 className="feather-trash-2" />
                            </Link>
                        </OverlayTrigger>
                        {/* <OverlayTrigger placement="top" overlay={renderDeleteTooltip}>
                            <Link className="confirm-text p-2" to="#">
                                <i
                                    data-feather="trash-2"
                                    className="feather-trash-2"
                                    onClick={() => showConfirmationAlert(record.scid)}
                                >

                                </i>

                            </Link>
                        </OverlayTrigger> */}
                    </div>
                </div>
            ),
        },
    ];



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

    // const handleSave = (e) => {
    //   e.preventDefault();
    //   console.log("save data", formData);
    //   // if (validateForm()) {
    //   //   // Display success message
    //   //   alert("Form saved successfully!");
    //   // }
    // }
    const [selectedData, setSelectedData] = useState({ stmid: null });
    const openModal = (stmid) => {
        setSelectedData({ stmid })
    }

    useEffect(() => {
        const RateType = async () => {
            try {
                const response = await axios.get(
                    baseUrl.Url + "/backend/api/Implications/PAYTYPE|",

                );

                if (response.status !== 200) throw new Error("Failed to fetch implications data");

                const data = response.data;
                const implicationsDropdown = data.map(({ iTitle, iValue }) => ({
                    label: iTitle,
                    value: iValue,
                }));

                setRateType(implicationsDropdown);
            } catch (error) {
                console.error("Error fetching implications:", error);
            }
        };


        RateType();


    }, []);

    const MySwal = withReactContent(Swal);

    const showConfirmationAlert = (scid) => {
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

                OndeletestockTransfer(scid);
            } else {
                MySwal.close();
            }

        });
    };
    const OndeletestockTransfer = async (scid) => {
        try {
            const payload = {
                "scid": scid,

                "companyid": userdetail?.companyID ? userdetail.companyID : "",
                "deptid": userdetail?.departmentID ? userdetail.departmentID : "",
            };
            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            axios({
                method: "POST",
                url: baseUrl.Url + "/backend/api/SP_DeleteServiceCharge",
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
                            "scid": "%",
                            "keyword": "%",
                            "rateapplicable": "",
                            "servicetype": "",
                            "ratetype": "",
                            "lejar": "",
                            "rate": 0,
                            "companyid": userdetail?.companyID ? userdetail.companyID : "",
                            "deptid": userdetail?.departmentID ? userdetail.departmentID : "",
                        };
                        const headers = {
                            "Content-Type": "application/json",
                            Accept: "*/*",
                        };

                        axios({
                            method: "POST",
                            url: baseUrl.Url + "/backend/api/GET_ServiceCharge",
                            data: JSON.stringify(payload),
                            headers: headers,
                        })
                            .then((response) => {
                                if (response.status != 200) throw new Error("Failed to Fetching Data");
                                const DATA = response.data;
                                setCustomer(DATA);
                            })

                    } catch (error) {
                        console.error("Error fetching Access Right Data:", error);
                    }
                })

        } catch (error) {
            console.error("Error fetching Access Right Data:", error);
        }

    }


    useEffect(() => {
        const ServiceType = async () => {
            try {
                const response = await axios.get(
                    baseUrl.Url + "/backend/api/Implications/RATETYPE",

                );

                if (response.status !== 200) throw new Error("Failed to fetch implications data");

                const data = response.data;
                const implicationsDropdown = data.map(({ iTitle, iValue }) => ({
                    label: iTitle,
                    value: iValue,
                }));

                setServiceType(implicationsDropdown);
            } catch (error) {
                console.error("Error fetching implications:", error);
            }
        };


        ServiceType();


    }, []);
    useEffect(() => {
        const RateApplicable = async () => {
            try {
                const response = await axios.get(
                    baseUrl.Url + "/backend/api/Implications/RAPPLI",

                );

                if (response.status !== 200) throw new Error("Failed to fetch implications data");

                const data = response.data;
                const implicationsDropdown = data.map(({ iTitle, iValue }) => ({
                    label: iTitle,
                    value: iValue,
                }));

                setRateApplicable(implicationsDropdown);
            } catch (error) {
                console.error("Error fetching implications:", error);
            }
            try {
                const response = await axios.get(
                    baseUrl.Url + "/backend/api/Implications/RATETYPE",

                );

                if (response.status !== 200) throw new Error("Failed to fetch implications data");

                const data = response.data;
                const implicationsDropdown = data.map(({ iTitle, iValue }) => ({
                    label: iTitle,
                    value: iValue,
                }));

                setServiceType(implicationsDropdown);
            } catch (error) {
                console.error("Error fetching implications:", error);
            }
        };


        RateApplicable();


    }, []);

    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
        try {
            const payload =


            {
                "scid": "%",
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
                url: baseUrl.Url + "/backend/api/GET_ServiceCharge/_Search",
                data: JSON.stringify(payload),
                headers: headers,
            })

                .then((response) => {
                    if (response.status != 200) throw new Error("Failed to send otp");
                    console.log("response", response.data);
                    setCustomer(response.data);
                })
        } catch (error) {
            console.error("Error while searching WareHouse data:", error);
        }
    };


    useEffect(() => {

        const fetchServiceCharge = async () => {
            try {
                const payload =
                {

                    "scid": "%",
                    "keyword": "%",
                    "rateapplicable": "",
                    "servicetype": "",
                    "ratetype": "",
                    "lejar": "",
                    "rate": 0,
                    "isapproval": true,
                    "companyid": userdetail?.companyID ? userdetail.companyID : "",
                    "deptid": userdetail?.departmentID ? userdetail.departmentID : "",
                };


                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };
                const response = await axios.post(
                    `${baseUrl.Url}/backend/api/GET_ServiceCharge`,

                    payload,
                    { headers }
                );
                if (response.status !== 200)
                    throw new Error("Failed to fetch vendor data");
                console.log("quatation master", response.data)
                setCustomer(response.data);
            } catch (error) {
                console.error("Error fetching vendor data:", error);
            }
        };

        fetchServiceCharge();

    }, []);


    const RateApplicableref = useRef(null);
    const serviceRef = useRef(null);
    const rateTypeRef = useRef(null);
    const lejarref = useRef(null);
    const rateRef = useRef(null);
    const saveButtonRef = useRef(null);


    useEffect(() => {
        if (RateApplicableref.current) {
            RateApplicableref.current.focus();
        }
    }, []);



    const handleKeyDown = (e, nextRef, isLastField = false) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (isLastField) {
                saveButtonRef.current?.click(); // **Trigger Save Button Click**
            } else {
                nextRef?.current?.focus();
            }
        }
    };

    useEffect(() => {
        const listener = () => {
            handleReload();
        };

        window.addEventListener("handleReload", listener);

        return () => {
            window.removeEventListener("handleReload", listener);
        };
    }, []);



    const handleReload = async () => {
        try {
            const response = await axios.get(
                baseUrl.Url + "/backend/api/Implications/RATETYPE",

            );

            if (response.status !== 200) throw new Error("Failed to fetch implications data");

            const data = response.data;
            const implicationsDropdown = data.map(({ iTitle, iValue }) => ({
                label: iTitle,
                value: iValue,
            }));

            setServiceType(implicationsDropdown);
        } catch (error) {
            console.error("Error fetching implications:", error);
        }
    };

    // useEffect(() => {
    //   handleReload();
    // }, []);


    const handleSave = async () => {
        if (!formData.RateApplicable || !formData.ServiceType || !formData.RateType || !formData.Rate) {
            MySwal.fire({
                title: "योग्य माहिती भरा",
                text: "कृपया पुढे जाण्यापुर्वी सर्व आवश्यक माहिती भरा!",
                icon: "error",
                confirmButtonColor: "#ff0000",
                confirmButtonText: "ठीक आहे",
                allowOutsideClick: false,
                allowEscapeKey: false,
            });
            return;
        }

        MySwal.fire({
            text: 'तुम्हाला ही माहिती  जतन करायची आहे का?',
            showCancelButton: true,
            confirmButtonColor: '#00ff00',
            confirmButtonText: 'जतन करा',
            cancelButtonColor: '#092C4C',
            cancelButtonText: 'रद्द करा',
            allowOutsideClick: false,
            allowEscapeKey: false,
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const payload1 = {
                        scid: editId ? editId : GUID,  // ✅ Use editId if updating
                        rateapplicable: formData.RateApplicable,
                        servicetype: formData.ServiceType,
                        rate: formData.Rate,
                        ratetype: formData.RateType,
                        lejar: formData.lejar,
                        isapproval: true,
                        date: userdetail.APPDT,
                        companyid: userdetail?.companyID || "",
                        deptid: userdetail?.departmentID || "",
                        uaid: userdetail?.uaid || "",
                    };

                    const headers = {
                        "Content-Type": "application/json",
                        Accept: "*/*",
                    };

                    const response1 = await axios.post(
                        baseUrl.Url + "/backend/api/SP_AddUpdServiceCharge",
                        payload1,
                        { headers }
                    );

                    if (response1.status === 200) {
                        // ✅ Refresh the customer data
                        const fetchPayload = {
                            scid: "%",
                            keyword: "%",
                            rateapplicable: "",
                            servicetype: "",
                            ratetype: "",
                            lejar: "",
                            date: "",
                            rate: 0,
                            companyid: userdetail?.companyID || "",
                            deptid: userdetail?.departmentID || "",
                        };

                        await axios.post(
                            baseUrl.Url + "/backend/api/GET_ServiceCharge",
                            fetchPayload,
                            { headers }
                        ).then((response) => {
                            if (response.status !== 200) throw new Error("Failed to Fetch Data");
                            const DATA = response.data;
                            setCustomer(DATA);

                            if (editId !== null) {
                                const updatedProducts = productList.map((product) =>
                                    product.scid === editId ? { ...product, ...formData } : product
                                );
                                setProductList(updatedProducts);
                                setEditId(null);
                            } else {
                                setProductList([...productList, { ...formData, scid: GUID }]);
                            }

                            MySwal.fire({
                                icon: "success",
                                title: "साठवले!",
                                text: "माहिती यशस्वीरित्या सेव झाली",
                                confirmButtonText: "OK",
                                allowOutsideClick: false,
                                allowEscapeKey: false,
                            });

                            // ✅ Reset form
                            setFormData({
                                RateApplicable: null,
                                ServiceType: null,
                                RateType: null,
                                Rate: "",
                                lejar: "",
                            });
                        });
                    } else {
                        throw new Error("Failed to save master data.");
                    }
                } catch (error) {
                    console.error("Submission Error:", error);
                    MySwal.fire({
                        icon: "error",
                        title: "त्रुटी",
                        text: "माहिती सेव  करण्यास अपयश. कृपया पुन्हा प्रयत्न करा",
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                    });
                }
            } else {
                MySwal.close();
            }
        });
    };



    const [productList, setProductList] = useState([]); // Stores added rows
    const [editId, setEditId] = useState(null); // Tracks which row is being edited

    const handleEdit = (record) => {

        MySwal.fire({

            text: "तुम्हाला या माहितीत बदल  करायचा आहे का?",
            showCancelButton: true,
            confirmButtonColor: "#00ff00",
            confirmButtonText: "होय, बदल करा!",
            cancelButtonColor: "#ff0000",
            cancelButtonText: "रद्द करा",
            allowOutsideClick: false,
            allowEscapeKey: false,
        }).then((result) => {
            if (result.isConfirmed) {
                console.log("Editing Record:", record);

                if (!record) {
                    console.error("Record is undefined!");
                    MySwal.fire({
                        icon: "error",
                        title: "त्रुटी!",
                        text: "निवडलेला रेकॉर्ड सापडला नाही!",
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                    });
                    return;
                }

                setFormData({
                    ...record,
                    RateApplicable: record.rateapplicable || null,
                    ServiceType: record.servicetype || null,
                    RateType: record.ratetype || null,
                    Rate: record.rate || "",
                    lejar: record.lejar || "",
                });


                setEditId(record.scid);


                setTimeout(() => {
                    if (RateApplicableref.current) {
                        RateApplicableref.current.focus();
                        console.log("Focused on RateApplicableref field");
                    } else {
                        console.warn("RateApplicableref is not available");
                    }
                }, 100);
            }
        });
    };


    // new dropdown code 
    const [lejar, setlejar] = useState([]);
    useEffect(() => {
        const fetchCounter = async () => {
            try {
                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };

                const payload = {

                };

                const response = await axios.post(
                    `${baseUrl.Url}/backend/api/GET_AccountACCTM`,
                    payload,
                    { headers }
                );
                if (response.status !== 200)
                    throw new Error("Failed to fetch vendor data");
                console.log("requisition setails", response.data)
                const data = response.data;
                const conuterData = data
                    .map(({ acctm, sglrpid }) => ({
                        label: acctm,
                        value: sglrpid
                    }));

                setlejar(conuterData);
            } catch (error) {
                console.error("Error fetching vendor data:", error);
            }
        };
        fetchCounter();
    }, []);


    return (
        <div className="page-wrapper">
            <div className="content">
                <div className="page-header">
                    <div className="add-item d-flex">
                        <div className="page-title">
                            <h3>सेवा शुल्क </h3>
                            <h6></h6>
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
                    {/* <div className="page-btn">
                            <Link to={route.AddService} className="btn btn-added">
                            <PlusCircle className="me-2 iconsize" /> Add Services
                            </Link>
                        </div> */}
                    <div className="page-btn">
                        <Link to={route.MasterIndex} className="btn btn-secondary">
                            <ArrowLeft className="me-2" />
                            मागे
                        </Link>
                    </div>
                </div>

                <form>
                    <div className="card mx-auto" >
                        <div className="card-body mbgcolor">
                            <div className="row ">
                                <div className="col-lg-3 col-sm-4 col-12">
                                    <div className=" add-product form-label">
                                        <label htmlFor="serviceName" className="form-label required">
                                            दर लागु
                                        </label>
                                        <Select
                                            ref={RateApplicableref}
                                            classNamePrefix="react-select"
                                            options={RateApplicable}  // Replace with your options array

                                            value={RateApplicable.find(option => option.value == formData.RateApplicable) || null}
                                            openMenuOnFocus={true}
                                            onChange={(selectedOption) => {
                                                setFormData(prevState => ({
                                                    ...prevState,
                                                    RateApplicable: selectedOption ? selectedOption.value : null
                                                }));

                                                if (serviceRef.current) {
                                                    serviceRef.current.focus(); // Move focus after selection
                                                }
                                            }}
                                        />

                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-4 col-12">
                                    <div className="mb-0 add-product form-label">
                                        <div className="add-newplus">
                                            <label htmlFor="serviceName" className="form-label required">
                                                सेवा प्रकार
                                            </label>
                                            <Link
                                                to="#"
                                                data-bs-toggle="modal"
                                                data-bs-target="#add-units-category"
                                            >
                                                <PlusCircle className="plus-down-add" />
                                                <span>नविन  जोडा </span>
                                            </Link>
                                            {/* <RefreshCcw className="reload-icon"
                    onClick={handleReload}
                  /> */}
                                        </div>
                                        <Select
                                            ref={serviceRef}
                                            classNamePrefix="react-select"
                                            options={ServiceType}  // Replace with your options array
                                            value={ServiceType.find(option => option.value === formData.ServiceType) || null}
                                            onChange={(selectedOption) => {
                                                setFormData(prevState => ({
                                                    ...prevState,
                                                    ServiceType: selectedOption ? selectedOption.value : null
                                                }))
                                                if (rateTypeRef.current) {
                                                    rateTypeRef.current.focus(); // Move focus after selection
                                                }
                                            }}
                                            openMenuOnFocus={true}

                                        />
                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-4 col-12">
                                    <div className="mb-0 add-product form-label">
                                        <label htmlFor="serviceName" className="form-label required">
                                            दर प्रकार
                                        </label>
                                        <Select
                                            ref={rateTypeRef}  // Ensure ref is correctly assigned
                                            classNamePrefix="react-select"
                                            options={RateType}
                                            openMenuOnFocus={true}
                                            value={RateType.find(option => option.value === formData.RateType) || null}
                                            onChange={(selectedOption) => {
                                                setFormData(prevState => ({
                                                    ...prevState,
                                                    RateType: selectedOption ? selectedOption.value : null
                                                }))
                                                if (rateRef.current) {
                                                    rateRef.current.focus(); // Move focus after selection
                                                }
                                            }
                                            }


                                        />

                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-4 col-12 mt-1">
                                    <div className="mb-0 add-product form-label">
                                        <label htmlFor="serviceName" className="form-label required">
                                            दर
                                        </label>
                                        <input
                                            ref={rateRef}
                                            type="number"
                                            className="form-control"
                                            value={formData.Rate}
                                            min="0"
                                            onChange={(e) => {
                                                setFormData(prevState => ({
                                                    ...prevState,
                                                    Rate: e.target.value
                                                }));

                                                // if (lejarref.current) {
                                                //   lejarref.current.focus(); // Move focus after selection
                                                // }

                                            }}

                                            onKeyDown={(e) => handleKeyDown(e, lejarref, false)}
                                        />


                                    </div>
                                </div>
                            </div>



                            <div className="row align-items-end">
                                {/* Dropdown */}
                                <div className="col-lg-6 col-md-8 col-sm-8 col-12 mb-3">
                                    <div className="mb-0 add-product form-label">
                                        <label htmlFor="serviceName" className="form-label required">
                                            लेजर
                                        </label>
                                        <Select
                                            ref={lejarref}
                                            classNamePrefix="react-select"
                                            options={lejar}
                                            value={lejar.find(option => option.value === formData.lejar) || null}
                                            onChange={(selectedOption) => {
                                                setFormData(prevState => ({
                                                    ...prevState,
                                                    lejar: selectedOption ? selectedOption.value : null
                                                }));
                                                if (saveButtonRef.current) {
                                                    saveButtonRef.current.focus();
                                                }
                                            }}
                                            openMenuOnFocus={true}
                                        />
                                    </div>
                                </div>

                                {/* Button */}
                                <div className="col-lg-6 col-md-4 col-sm-4 col-12 mb-3 text-end">
                                    <button
                                        type="button"
                                        className="btn btn-submit mt-sm-4 mt-2"
                                        ref={saveButtonRef}
                                        onClick={handleSave}
                                    >
                                        {editId !== null ? "सेवा शुल्क अपडेट" : "सेवा शुल्क जोडा"}
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>

                </form>

                <div className="card table-list-card mbgcolor">
                    <div className="search-container mb-2 mt-2">
                        <div className="row">
                            <div className="col-lg-6 col-12 ms-auto">
                                <div className="input-group me-2">
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
                            <Table columns={columns} dataSource={Customer} />
                        </div>
                    </div>
                </div>
                <AddCategory />
                <Brand />
            </div>
        </div>
    );
};

export default ServiceCharges;

