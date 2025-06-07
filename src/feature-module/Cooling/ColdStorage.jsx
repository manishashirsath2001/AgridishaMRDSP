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
// import OutwardColdStorage from "../../core/modals/inventory/outwardColdStorage";
// import OutWardOnEdit from "../../core/modals/inventory/OutwardEdit";
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
import OutwardEdit from "./OutwardEdit";
import ColdStorageOutword from "./ColdStorageOutword";
const ColdStorage = () => {
    const [activeTab, setActiveTab] = useState("inward"); // default is inward

    const userdetail = getUserData();
    const dispatch = useDispatch();
    const data = useSelector((state) => state.toggle_header);
    const route = all_routes;
    const [searchQuery, setSearchQuery] = useState("");
    const [searchQuery1, setSearchQuery1] = useState("");
    const [ColdStorage, setColdStorage] = useState([]);
    const [ColdStorageoutward, setColdStorageoutward] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();
    const { csid } = location.state || {};
    const [selectedData, setSelectedData] = useState({ csid: null });
    const [selectedData1, setSelectedData1] = useState({ csid: null });
    const OnEdit = (csid) => {
        MySwal.fire({
            text: "तुम्हाला या माहितीत बदल करायचा आहे का?",
            showCancelButton: true,
            confirmButtonColor: "#00ff00",
            confirmButtonText: "होय, बदल करा!",
            cancelButtonColor: "#ff0000",
            cancelButtonText: "रद्द करा",
        }).then((result) => {
            if (result.isConfirmed) {
                setSelectedData({ csid });
                navigate("/AddColdStorage", { state: { csid } }); // Pass shid to AddGala page

            }
        });
    };


    const handleProceed = (csid) => {
        setSelectedData({ csid: csid });

    };
    const handleOutWardEdit1 = (csid) => {
        setSelectedData1({ csid: csid });

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
                navigate(route.AddColdStorage);
            }

        };

        window.addEventListener('keydown', handleShortcut);

        return () => {
            window.removeEventListener('keydown', handleShortcut);
        };
    }, [navigate]);


    useEffect(() => {

        const fetchColdStorage = async () => {
            try {
                const payload =
                {
                    "csid": "%",
                    "keyword": "%",
                    "companyid": userdetail?.companyID ? userdetail.companyID : "",
                    "deptid": userdetail?.departmentID ? userdetail.departmentID : "",
                };


                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };
                const response = await axios.post(
                    `${baseUrl.Url}/backend/api/GET_ColdStorageInward`,

                    payload,
                    { headers }
                );
                if (response.status !== 200)
                    throw new Error("Failed to fetch vendor data");

                setColdStorage(response.data);
            } catch (error) {
                console.error("Error fetching vendor data:", error);
            }
        };

        fetchColdStorage();

    }, [activeTab]);

    useEffect(() => {

        const fetchColdStorage1 = async () => {
            try {
                const payload =
                {
                    "csid": "%",
                    "keyword": "%",
                    "companyid": userdetail?.companyID ? userdetail.companyID : "",
                    "deptid": userdetail?.departmentID ? userdetail.departmentID : "",
                };


                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };
                const response = await axios.post(
                    `${baseUrl.Url}/backend/api/GET_ColdStorageInward`,

                    payload,
                    { headers }
                );
                if (response.status !== 200)
                    throw new Error("Failed to fetch vendor data");

                setColdStorage(response.data);
            } catch (error) {
                console.error("Error fetching vendor data:", error);
            }
        };

        fetchColdStorage1();
    }, []);
    // useEffect(() => {

    //     const fetchColdStorageoutward = async () => {
    //         try {
    //             const payload =
    //             {
    //                 "csowid": "%",
    //                 "keyword": "%",
    //                 "companyid": userdetail?.companyID ? userdetail.companyID : "",
    //                 "deptid": userdetail?.departmentID ? userdetail.departmentID : "",
    //             };


    //             const headers = {
    //                 "Content-Type": "application/json",
    //                 Accept: "*/*",
    //             };
    //             const response = await axios.post(
    //                 `${baseUrl.Url}/backend/api/GET_ColdStorageOutWard`,

    //                 payload,
    //                 { headers }
    //             );
    //             if (response.status !== 200)
    //                 throw new Error("Failed to fetch vendor data");
    //             console.log("GET_ColdStorageOutWard", response.data)
    //             setColdStorageoutward(response.data);
    //         } catch (error) {
    //             console.error("Error fetching vendor data:", error);
    //         }
    //     };

    //     fetchColdStorageoutward();

    // }, []);

    useEffect(() => {
        if (activeTab === "outward") {
            const fetchColdStorageoutward = async () => {
                try {
                    const payload = {
                        csowid: "%",
                        keyword: "%",
                        companyid: userdetail?.companyID || "",
                        deptid: userdetail?.departmentID || "",
                    };

                    const headers = {
                        "Content-Type": "application/json",
                        Accept: "*/*",
                    };

                    const response = await axios.post(
                        `${baseUrl.Url}/backend/api/GET_ColdStorageOutWard`,
                        payload,
                        { headers }
                    );

                    if (response.status !== 200) throw new Error("Failed to fetch data");

                    console.log("GET_ColdStorageOutWard", response.data);
                    setColdStorageoutward(response.data);
                } catch (error) {
                    console.error("Error fetching cold storage outward data:", error);
                }
            };

            fetchColdStorageoutward(); // Call only if tab is "outward"
        }
    }, [activeTab]); // 👈 dependency to track tab change

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
        try {
            const payload =


            {
                "csid": "%",
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
                url: baseUrl.Url + "/backend/api/GET_ColdStorageInward/_Search",
                data: JSON.stringify(payload),
                headers: headers,
            })

                .then((response) => {
                    if (response.status != 200) throw new Error("Failed to send otp");
                    console.log("response", response.data);
                    setColdStorage(response.data);
                })
        } catch (error) {
            console.error("Error while searching WareHouse data:", error);
        }
    };


    const handleSearch1 = (event) => {
        setSearchQuery1(event.target.value);
        try {
            const payload =


            {
                "csowid": "%",
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
                url: baseUrl.Url + "/backend/api/GET_ColdStorageOutWard/_Search",
                data: JSON.stringify(payload),
                headers: headers,
            })

                .then((response) => {
                    if (response.status != 200) throw new Error("Failed to send otp");
                    console.log("response", response.data);
                    setColdStorageoutward(response.data);
                })
        } catch (error) {
            console.error("Error while searching WareHouse data:", error);
        }
    };

    const OndeleteColdStorage = async (csid) => {
        try {
            const payload = {
                "csid": csid,
                "companyid": userdetail?.companyID ? userdetail.companyID : "",
                "deptid": userdetail?.departmentID ? userdetail.departmentID : "",
            }
            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            axios({
                method: "POST",
                url: baseUrl.Url + "/backend/api/SP_DeleteColdStorageDetails",
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
                            "csid": "%",
                            "keyword": "%",
                            "companyid": userdetail?.companyID ? userdetail.companyID : "",
                            "deptid": userdetail?.departmentID ? userdetail.departmentID : "",
                        }

                        axios({
                            method: "POST",
                            url: baseUrl.Url + "/backend/api/GET_ColdStorageInward",
                            data: JSON.stringify(payload),
                            headers: headers,
                        })
                            .then((response) => {
                                if (response.status !== 200) throw new Error("Failed to Fetching Data");
                                const DATA = response.data;
                                setColdStorage(DATA);
                            });
                    } catch (error) {
                        console.error("Error fetching Access Right Data:", error);
                    }
                });
        } catch (error) {
            console.error("Error fetching Access Right Data:", error);
        }
    };

    const OndeleteColdStorage1 = async (csowid) => {
        try {
            const payload = {
                "csowid": csowid,
                "companyid": userdetail?.companyID ? userdetail.companyID : "",
                "deptid": userdetail?.departmentID ? userdetail.departmentID : "",
            }

            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            axios({
                method: "POST",
                url: baseUrl.Url + "/backend/api/SP_DeleteColdStorageOutward",
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

                            "csowid": "%",
                            "keyword": "%",
                            "companyid": userdetail?.companyID ? userdetail.companyID : "",
                            "deptid": userdetail?.departmentID ? userdetail.departmentID : "",
                        };


                        axios({
                            method: "POST",
                            url: baseUrl.Url + "/backend/api/GET_ColdStorageOutWard",
                            data: JSON.stringify(payload),
                            headers: headers,
                        })
                            .then((response) => {
                                if (response.status !== 200) throw new Error("Failed to Fetching Data");
                                const DATA = response.data;
                                setColdStorageoutward(DATA);
                            });
                    } catch (error) {
                        console.error("Error fetching Access Right Data:", error);
                    }
                });
        } catch (error) {
            console.error("Error fetching Access Right Data:", error);
        }
    };
    const showConfirmationAlert = (csid) => {
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
                OndeleteColdStorage(csid);
            } else {
                MySwal.close();
            }
        });
    };
    const showConfirmationAlert1 = (csowid) => {
        MySwal.fire({
            title: "तुम्हाला खात्री आहे का? ",

            showCancelButton: true,
            confirmButtonColor: "#00ff00",
            confirmButtonText: "हो , हटवा !",
            cancelButtonColor: "#ff0000",
            cancelButtonText: "रद्द करा",
        }).then((result) => {
            if (result.isConfirmed) {
                OndeleteColdStorage1(csowid);
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
            title: "लॉट.क्र",
            dataIndex: "lotno",
            sorter: (a, b) => a.lotno.length - b.lotno.length,
        },
        {
            title: (
                <OverlayTrigger placement="top" overlay={<Tooltip >कस्टमर</Tooltip>}>
                    <div className="text-center">कस्टमर</div>
                </OverlayTrigger>
            ),
            dataIndex: "cname",
            sorter: (a, b) => a.customername.length - b.customername.length,
            render: (text) => <div style={{ textAlign: "left" }}>{text}</div>,
            width: "150px",
        },
        {
            title: "थर्ड पार्टी",
            dataIndex: "thirdpartyname",
            sorter: (a, b) => a.thirdpartyname.length - b.thirdpartyname.length,
        },
        {
            title: "वस्तू",
            dataIndex: "product",
            sorter: (a, b) => a.product.length - b.product.length,
        },

        {
            title: "प्रकार",
            dataIndex: "typeofvarity",
            sorter: (a, b) => a.typeofvarity.length - b.typeofvarity.length,
        },
        {
            title: "वजन (कि.ग्रा.)",
            dataIndex: "weightinkg",
            sorter: (a, b) => a.weightinkg.length - b.vajan.length,
        },

        {
            title: "रॅक पोजिशन",
            dataIndex: "rackposition",
            sorter: (a, b) => a.rackposition.length - b.rackposition.length,
        },
        {
            title: "तारीख",
            dataIndex: "date",
            sorter: (a, b) => a.date.length - b.date.length,
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
                        <Link className="me-2 p-2"
                            to="#"
                            onClick={() => OnEdit(record.csid)}
                        >
                            <Edit className="feather-edit" />
                        </Link>
                        <Link className="me-2 p-2"
                            to="#"
                            onClick={() => handleProceed(record.csid)}
                            data-bs-toggle="modal"
                            data-bs-target="#add-units-category"
                            style={{ color: 'green' }}>
                            <i data-feather="arrow-right-circle" className="feather-arrow-right-circle"></i>
                        </Link>
                        <Link
                            className="confirm-text p-2 me-2"
                            to="#"
                            onClick={() => showConfirmationAlert(record.csid)}
                        >
                            <Trash2 className="feather-trash-2" />
                        </Link>
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
                    "csid": "%",
                    "keyword": "%",
                    "companyid": userdetail?.companyID ? userdetail.companyID : "",
                    "deptid": userdetail?.departmentID ? userdetail.departmentID : "",
                };


                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };
                const response = await axios.post(
                    `${baseUrl.Url}/backend/api/GET_ColdStorageInward`,

                    payload,
                    { headers }
                );
                if (response.status !== 200)
                    throw new Error("Failed to fetch vendor data");
                console.log("quatation1202 master", response.data)
                setColdStorage(response.data);
            } catch (error) {
                console.error("Error fetching vendor data:", error);
            }
        };
        fetchData();
    }, []);


    const Outwardcolumns = [
        {
            title: (
                <OverlayTrigger placement="top" overlay={<Tooltip>लॉट.क्र</Tooltip>}>
                    <div className="text-center">लॉट.क्र</div>
                </OverlayTrigger>
            ),
            dataIndex: "lotno",
            sorter: (a, b) => a.lotno.length - b.lotno.length,
            render: (text) => <div style={{ textAlign: "right" }}>{text}</div>,
        },
        {
            title: (
                <OverlayTrigger placement="top" overlay={<Tooltip>कस्टमर</Tooltip>}>
                    <div className="text-center">कस्टमर</div>
                </OverlayTrigger>
            ),
            dataIndex: "customername",
            sorter: (a, b) => a.customername.length - b.customername.length,
            render: (text) => <div style={{ textAlign: "left" }}>{text}</div>,
        },
        // {
        //     title: (
        //         <OverlayTrigger placement="top" overlay={<Tooltip>थर्ड पार्टी</Tooltip>}>
        //             <div className="text-center">थर्ड पार्टी</div>
        //         </OverlayTrigger>
        //     ),
        //     dataIndex: "thirdpartyname",
        //     sorter: (a, b) => a.thirdpartyname.length - b.thirdpartyname.length,
        //     render: (text) => <div style={{ textAlign: "left" }}>{text}</div>,
        // },
        {
            title: (
                <OverlayTrigger placement="top" overlay={<Tooltip>वजन(kg)</Tooltip>}>
                    <div className="text-center">वजन(kg)</div>
                </OverlayTrigger>
            ),
            dataIndex: "weightinkg",
            sorter: (a, b) => a.weightinkg.length - b.weightinkg.length,
            render: (text) => <div style={{ textAlign: "right" }}>{text}</div>,
        },
        {
            title: (
                <OverlayTrigger placement="top" overlay={<Tooltip> आउटवर्ड(kg)</Tooltip>}>
                    <div className="text-center"> आउटवर्ड(kg)</div>
                </OverlayTrigger>
            ),
            dataIndex: "outwardweight",
            sorter: (a, b) => a.outwardweight.length - b.outwardweight.length,
            render: (text) => <div style={{ textAlign: "right" }}>{text}</div>,
        },
        {
            title: (
                <OverlayTrigger placement="top" overlay={<Tooltip>शिल्लक(kg)</Tooltip>}>
                    <div className="text-center">शिल्लक(kg)</div>
                </OverlayTrigger>
            ),
            dataIndex: "remainingweight",
            sorter: (a, b) => a.outwardweight.length - b.outwardweight.length,
            render: (text) => <div style={{ textAlign: "right" }}>{text}</div>,
        },
        {
            title: (
                <OverlayTrigger placement="top" overlay={<Tooltip>एकूण दि.</Tooltip>}>
                    <div className="text-center">एकूण दि.</div>
                </OverlayTrigger>
            ),
            dataIndex: "dayinslabt",
            sorter: (a, b) => a.dayinslabt.length - b.dayinslabt.length,
            render: (text) => <div style={{ textAlign: "right" }}>{text}</div>,
        },
        {
            title: (
                <OverlayTrigger placement="top" overlay={<Tooltip>समाप्ती ता.</Tooltip>}>
                    <div className="text-center">समाप्ती ता.</div>
                </OverlayTrigger>
            ),
            dataIndex: "enddate",
            sorter: (a, b) => a.enddate.length - b.enddate.length,
            render: (text) => <div style={{ textAlign: "right" }}>{text}</div>,
        },
        {
            title: (
                <OverlayTrigger placement="top" overlay={<Tooltip> रक्कम</Tooltip>}>
                    <div className="text-center"> रक्कम</div>
                </OverlayTrigger>
            ),
            dataIndex: "amount",
            sorter: (a, b) => a.amount.length - b.amount.length,
            render: (text) => <div style={{ textAlign: "right" }}>{text}</div>,
        },
        {
            title: <div className="text-center">कृती</div>,
            dataIndex: "actions",
            key: "actions",
            render: (_, record) => (
                <div className="action-table-data">
                    <div className="edit-delete-action">
                        <Link
                            className="me-2 p-2"
                            to="#"
                            onClick={() => handleOutWardEdit1(record.csid)}
                            data-bs-toggle="modal"
                            data-bs-target="#add-units-edit"
                        >
                            <Edit className="feather-edit" />
                        </Link>
                        <Link
                            className="confirm-text p-2 me-2"
                            to="#"
                            onClick={() => showConfirmationAlert1(record.csowid)}
                        >
                            <Trash2 className="feather-trash-2" />
                        </Link>
                    </div>
                </div>
            ),
        },
    ];


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
                            <h3>कोल्ड स्टोरेज मास्टर</h3>
                            <h6>व्यवस्थापन कोल्ड स्टोरेज</h6>
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
                        <Link to={route.AddColdStorage} className="btn btn-added">
                            <PlusCircle className="me-2 iconsize" /> कोल्ड स्टोरेज जोडा
                        </Link>
                    </div>
                    <div className="page-btn">
                        <Link to={route.CoolingIndex} className="btn btn-secondary">
                            <ArrowLeft className="me-2" />
                            मागे
                        </Link>
                    </div>
                </div>

                <div className="content">

                    <div className="d-flex justify-content-center align-items-center">
                        <div className="btn-group" role="group" aria-label="Cold Storage Tabs">
                            <button
                                type="button"
                                className={`btn px-4 py-2 fs-5 me-2 ${activeTab === "inward" ? "btn-primary" : "btn-outline-primary"}`}
                                onClick={() => setActiveTab("inward")}
                            >
                                <span style={{ fontSize: '1rem' }}>🧊 इनवर्ड</span>
                            </button>
                            <button
                                type="button"
                                className={`btn px-4 py-2 fs-5 ${activeTab === "outward" ? "btn-primary" : "btn-outline-primary"}`}
                                onClick={() => setActiveTab("outward")}
                            >
                                <span style={{ fontSize: '1rem' }}> 📦 आउटवर्ड</span>
                            </button>
                        </div>
                    </div>

                    {activeTab === "inward" && (
                        <>


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
                                        <Table columns={columns} dataSource={ColdStorage} />
                                    </div>
                                </div>
                            </div>
                            <ColdStorageOutword CAID={selectedData} />
                        </>
                    )}

                    {activeTab === "outward" && (
                        <>

                            <div className="search-container mb-2 mt-2">
                                <div className="row">
                                    <div className="col-lg-6 col-12 ms-auto">
                                        <div className="input-group">
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="शोधा"
                                                value={searchQuery1}
                                                onChange={handleSearch1}
                                            />
                                            <span className="input-group-text">
                                                <i className="fa fa-search"></i>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* <div className="card table-list-card">
                                <div className="card-body">
                                    <div className="table-responsive">
                                        <Table columns={Outwardcolumns} dataSource={ColdStorageoutward} />
                                    </div>
                                </div>
                            </div> */}

                            <div className="card table-list-card">
                                <div className="card-body p-2">
                                    <div className="table-responsive" style={{ overflowX: 'auto' }}>
                                        <Table
                                            columns={Outwardcolumns}
                                            dataSource={ColdStorageoutward}
                                            pagination={false}
                                            style={{ width: '100%' }}
                                        />
                                    </div>
                                </div>
                            </div>


                            <OutwardEdit CSOWID={selectedData1.csid} />
                        </>
                    )}


                    <Brand />
                </div>
            </div>
        </div>
    );
};

export default ColdStorage;

