import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import ImageWithBasePath from "../../core/img/imagewithbasebath";
import { useDispatch, useSelector } from "react-redux";
import Brand from "../../core/modals/inventory/brand";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { all_routes } from "../../Router/all_routes";
import { baseUrl, ACSPLGUID } from "../../core/json/custom";
import axios from "axios";
import Select from "react-select"; // Ensure Select is imported
import Table from "../../core/pagination/datatable";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { setToogleHeader } from "../../core/redux/action";
import { useNavigate } from "react-router-dom";
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import marathiFontBase64 from "../../style/fonts/NotoSansDevanagari";
import {
    Edit,
    RotateCcw,
    Trash2,
} from "feather-icons-react/build/IconComponents";
import { getUserData } from "../../Context/UserData";

const Carets = () => {
    const dispatch = useDispatch();
    const GUID = ACSPLGUID.getNew();
    const userdetail = getUserData();
    const route = all_routes;
    const [formdata, setFormData] = useState({
        CaretDate: "",
        CaretSize: "",
        Status1: "",
    });
    //declear ref
    const CaretDateRef = useRef(null);
    const CaretSizeRef = useRef(null);
    const statusRef = useRef(null);
    const saveRef = useRef(null);

    // Tooltip for delete action
    const renderDeleteTooltip = (props) => (
        <Tooltip id="Delete-tooltip" {...props}>
            Delete
        </Tooltip>
    );



    const downloadPDFCaret = () => {

        const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();



        const cleanBase64 = marathiFontBase64.replace(/^data:font\/ttf;base64,/, "");

        doc.addFileToVFS("NotoSansDevanagari.ttf", cleanBase64);
        doc.addFont("NotoSansDevanagari.ttf", "NotoSansDevanagari", "normal");

        doc.setFont("NotoSansDevanagari", "normal");
        doc.setFontSize(16);
        const title = "जाळी अहवाल";
        const titleWidth = doc.getTextWidth(title);
        doc.text(title, (pageWidth - doc.getTextWidth(title)) / 2, 20);
        const borderMargin = 10;
        doc.rect(borderMargin, borderMargin, pageWidth - borderMargin * 2, pageHeight - borderMargin * 2);
        doc.text(title, (pageWidth - titleWidth) / 2, 20);
        doc.setLineWidth(0.5);
        doc.line((pageWidth - titleWidth) / 2, 22, (pageWidth + titleWidth) / 2, 22);
        const tableColumn = ["तारीख ", "जाळी आकार", "स्थिती"];

        const tableRows = Caret.map(item => [
            item.date,
            item.size,
            item.status === "0" ? "Active" : "InActive",
        ]);


        const sanitizedTableRows = tableRows.map(row =>
            row.map(cell => (cell ? cell.toString() : ""))
        );

        autoTable(doc, {
            startY: 30,
            head: [tableColumn],
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

        });

        const blob = doc.output("blob");
        const blobURL = URL.createObjectURL(blob);
        window.open(blobURL, "_blank");
    };
    const formatDateForInput = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        if (isNaN(date)) return "";
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const onEditClick = (selectedData) => {
        setFormData({
            caid: selectedData.caid,
            CaretDate: formatDateForInput(selectedData.date),
            CaretSize: selectedData.size,
            Status1: selectedData.status,
        });

        if (CaretDateRef.current) {
            CaretDateRef.current.focus();
        }
    };

    // Tooltip for action column
    const renderActionTooltip = (props) => (
        <Tooltip id="action-tooltip" {...props}>
            Action
        </Tooltip>
    );

    // Search Record Master List
    const [searchQuery, setSearchQuery] = useState("");

    const [Caret, setCaret] = useState([]);

    // const dataSource = [];
    const columns = [
        {
            title: "तारीख  ",
            dataIndex: "date",
            render: (text) => (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id="requisitionnumber-tooltip">{text}</Tooltip>}
                >
                    <div>{text}</div>
                </OverlayTrigger>
            ),
            sorter: (a, b) => a.date.length - b.date.length,
        },
        {
            title: "जाळी आकार ",
            dataIndex: "size",
            render: (text) => (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id="requisitionnumber-tooltip">{text}</Tooltip>}
                >
                    <div>{text}</div>
                </OverlayTrigger>
            ),
            sorter: (a, b) => a.size.length - b.size.length,
        },

        {
            title: "स्थिती",
            dataIndex: "status",
            render: (text) => (
                <OverlayTrigger
                    placement="top"
                    overlay={
                        <Tooltip id="requisitionnumber-tooltip">
                            {text === "0" ? "Active" : "InActive"}
                        </Tooltip>
                    }
                >
                    <div
                        style={{
                            backgroundColor: text === "0" ? "green" : "red",
                            color: "white",
                            borderRadius: "5px",
                            textAlign: "center", // Center text horizontally
                            display: "flex", // Use flexbox for vertical centering
                            alignItems: "center", // Vertically center the text
                            justifyContent: "center", // Horizontally center the text
                            height: "30px",
                            width: "100px", // Adjust height to make sure text is vertically centered
                        }}
                    >
                        {text === "0" ? "Active" : "InActive"}
                    </div>
                </OverlayTrigger>
            ),
            sorter: (a, b) => a.status.length - b.status.length,
        },
        {
            title: (
                <OverlayTrigger placement="top" overlay={renderActionTooltip}>
                    <div className="d-flex justify-content-center">कृती</div>
                </OverlayTrigger>
            ),
            dataIndex: "action",
            render: (text, formdata) => (
                <div className="action-table-data">
                    <div className="edit-delete-action">
                        <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
                            <a className="me-2 p-2" onClick={() => onEditClick(formdata)}>
                                <Edit />
                            </a>
                        </OverlayTrigger>

                        <OverlayTrigger placement="top" overlay={renderDeleteTooltip}>
                            <Link
                                className="confirm-text p-2"
                                to="#"
                                onClick={() => ConfirmationAlert(formdata.caid)}
                            >
                                <Trash2 className="feather-trash-2" />
                            </Link>
                        </OverlayTrigger>
                    </div>
                </div>
            ),
            sorter: (a, b) => a.createdby.length - b.createdby.length,
        },
    ];

    // delete Record in master list
    const OndeleteCaret = async (caid) => {
        try {
            const payload = {
                caid: caid,
                companyid: "",
                deptid: "",
            };
            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            axios({
                method: "POST",
                url: baseUrl.Url + "/backend/api/SP_DeleteCaret",
                data: JSON.stringify(payload),
                headers: headers,
            }).then((response) => {
                if (response.status !== 200) throw new Error("Failed to Fetching Data");
                MySwal.fire({
                    title:
                        response.data[0].responseCode === "FAILURE"
                            ? "हटविणे अनुमत नाही"
                            : "रेकॉर्ड यशस्वीरित्या हटवले गेले!",
                    text: response.data[0].responseMessage,
                    icon: response.data[0].responseCode === "FAILURE" ? "error" : "success",
                    confirmButtonText: "ठीक आहे",
                    customClass: {
                        confirmButton:
                            response.data[0].responseCode === "FAILURE"
                                ? "btn btn-danger"
                                : "btn btn-success",
                    },
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                });
                try {
                    const payload = {
                        caid: "%",
                        keyword: "%",
                        companyid: "",
                        deptid: "",
                    };

                    axios({
                        method: "POST",
                        url: baseUrl.Url + "/backend/api/GET_Caret",
                        data: JSON.stringify(payload),
                        headers: headers,
                    }).then((response) => {
                        if (response.status !== 200)
                            throw new Error("Failed to Fetching Data");
                        const DATA = response.data;
                        setCaret(DATA);
                    });
                } catch (error) {
                    console.error("Error fetching Access Right Data:", error);
                }
            });
        } catch (error) {
            console.error("Error fetching Access Right Data:", error);
        }
    };
    const ConfirmationAlert = (caid) => {
        MySwal.fire({
            title: "तुम्हाला खात्री आहे का? ",
            text: "तुम्ही हे बदलू शकणार नाही!",
            showCancelButton: true,
            confirmButtonColor: "#00ff00",
            confirmButtonText: "हो , हटवा !",
            cancelButtonColor: "#ff0000",
            cancelButtonText: "रद्द करा",
            allowOutsideClick: false,
            allowEscapeKey: false,
        }).then((result) => {
            if (result.isConfirmed) {
                OndeleteCaret(caid);
            } else {
                MySwal.close();
            }
        });
    };

    useEffect(() => {
        const fetchCaret = async () => {
            try {
                const payload = {
                    caid: "%",
                    keyword: "%",
                    companyid: "",
                    deptid: "",
                };
                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };
                const response = await axios.post(
                    `${baseUrl.Url}/backend/api/GET_Caret`,
                    payload,
                    { headers }
                );
                if (response.status !== 200)
                    throw new Error("Failed to fetch vendor data");
                console.log("quatation master", response.data);
                setCaret(response.data);
            } catch (error) {
                console.error("Error fetching vendor data:", error);
            }
        };

        fetchCaret();
        if (CaretDateRef.current) {
            CaretDateRef.current.focus();
        }
    }, []);

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
        try {
            const payload = {
                caid: "%",
                keyword: event.target.value,
                companyid: userdetail?.companyID ? userdetail.companyID : "",
                deptid: userdetail?.departmentID ? userdetail.departmentID : "",
            };

            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            axios({
                method: "POST",
                url: baseUrl.Url + "/backend/api/GET_Caret/_Search",
                data: JSON.stringify(payload),
                headers: headers,
            }).then((response) => {
                if (response.status !== 200) throw new Error("Failed to send otp");
                console.log("response", response.data);
                setCaret(response.data);
            });
        } catch (error) {
            console.error("Error while searching WareHouse data:", error);
        }
    };

    const handleSave = async () => {
        if (!formdata.CaretDate) {
            Swal.fire({
                icon: "warning",
                title: "कृपया तारीख भरा",
                confirmButtonText: "ठीक आहे",
                allowOutsideClick: false,
                allowEscapeKey: false,
            }).then(() => {
                setTimeout(() => {
                    if (CaretDateRef.current) CaretDateRef.current.focus();
                }, 500); // Delay ensures DOM is ready
            });
            return;
        }

        if (!formdata.CaretSize) {
            Swal.fire({
                icon: "warning",
                title: "कृपया जाळी आकार भरा",
                confirmButtonText: "ठीक आहे",
                allowOutsideClick: false,
                allowEscapeKey: false,
            }).then(() => {
                setTimeout(() => {
                    if (CaretSizeRef.current) CaretSizeRef.current.focus();
                }, 500);
            });
            return;
        }

        if (!formdata.Status1) {
            Swal.fire({
                icon: "warning",
                title: "कृपया स्थिती निवडा",
                confirmButtonText: "ठीक आहे",
                allowOutsideClick: false,
                allowEscapeKey: false,
            }).then(() => {
                setTimeout(() => {
                    if (statusRef.current) statusRef.current.focus();
                }, 500);
            });
            return;
        }

        try {
            const payload = {
                caid: formdata.caid ? formdata.caid : GUID,
                date: formdata.CaretDate,
                size: formdata.CaretSize,
                status: formdata.Status1,
                companyid: "",
                uaid: "",
                deptid: "",
            };

            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            const response = await axios.post(
                `${baseUrl.Url}/backend/api/SP_AddUpdCaret`,
                JSON.stringify(payload),
                { headers }
            );

            Swal.fire({
                icon: "success",
                title: "साठवले!",
                text: "माहिती यशस्वीरित्या सेव झाली",
                confirmButtonText: "OK",
                allowOutsideClick: false,
                allowEscapeKey: false,
            }).then(() => {
                setFormData({
                    CaretDate: "",
                    CaretSize: "",
                    Status1: "",
                    caid: "",
                });

                setTimeout(() => {
                    if (CaretDateRef.current) CaretDateRef.current.focus();
                }, 500);
            });

            const refreshPayload = {
                caid: "%",
                keyword: "%",
                companyid: "",
                deptid: "",
            };

            const refreshResponse = await axios.post(
                `${baseUrl.Url}/backend/api/GET_Caret`,
                refreshPayload,
                { headers }
            );

            setCaret(refreshResponse.data);
            console.log("API Response:", response.data);
        } catch (error) {
            console.error("Submission Error:", error);
            Swal.fire({
                icon: "error",
                title: "त्रुटी",
                text: "माहिती जतन करताना काहीतरी चूक झाली.",
                confirmButtonText: "OK",
                allowOutsideClick: false,
                allowEscapeKey: false,
            });
        }
    };

    const navigate = useNavigate();
    const showExitAlert = () => {
        MySwal.fire({
            title: "आपण बाहेर पडू इच्छिता का?",
            showCancelButton: true,
            confirmButtonColor: "#00ff00",
            confirmButtonText: "होय",
            cancelButtonColor: "#092C4C",
            cancelButtonText: "नाही",
            allowOutsideClick: false,
            allowEscapeKey: false,
        }).then((result) => {
            if (result.isConfirmed) {
                const modal = document.getElementById("");
                if (modal) {
                    modal.classList.remove("show");
                    modal.style.display = "none";
                    modal.setAttribute("aria-hidden", "true");
                }

                const backdrop = document.querySelector(".modal-backdrop");
                if (backdrop) {
                    backdrop.remove();
                }

                navigate("/MasterIndex");
            }
        });
    };

    const MySwal = withReactContent(Swal);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };
    const [Status, setStatus] = useState([]);

    useEffect(() => {
        const RateType = async () => {
            try {
                const response = await axios.get(
                    baseUrl.Url + "/backend/api/Implications/STATUS"
                );

                if (response.status !== 200)
                    throw new Error("Failed to fetch implications data");

                const data = response.data;
                const implicationsDropdown = data.map(({ iTitle, iValue }) => ({
                    label: iTitle,
                    value: iValue,
                }));

                setStatus(implicationsDropdown);
            } catch (error) {
                console.error("Error fetching implications:", error);
            }
        };

        RateType();
    }, []);

    //enter handleForm input
    const handleKeyDown = (e, nextRef, isLast = false) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (isLast) {
                handleSave(); // Trigger save when it's the last field
            } else if (nextRef && nextRef.current) {
                nextRef.current.focus();
            }
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


    return (
        <div className="page-wrapper">
            <div className="content">


                <div className="page-header">

                    <div className="add-item d-flex">
                        <div className="page-title">
                            <h3>जाळी माहिती </h3>
                            <h6></h6>
                        </div>
                    </div>
                    <ul className="table-top-head ">
                        <li>
                            <OverlayTrigger placement="top" overlay={renderTooltip}>

                                <Link onClick={downloadPDFCaret}>
                                    <ImageWithBasePath src="assets/img/icons/pdf.svg" alt="img" />
                                </Link>
                            </OverlayTrigger>
                        </li>
                        <li>
                            <OverlayTrigger placement="top" overlay={renderExcelTooltip}>
                                <Link data-bs-toggle="tooltip" data-bs-placement="top">
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


                </div>

                <div className="row">
                    <div className="col-xl-12">
                        <div className="card mbgcolor">
                            <div className="card-header justify-content-between">
                                <div className="card-title">जाळी माहिती व्यवस्थापन</div>
                            </div>
                            <div className="card-body">
                                <form className="row gx-3 gy-2 align-items-center mt-0">
                                    <div className="col-sm-2 ">
                                        <label htmlFor="cropId">तारीख </label>
                                        <input
                                            type="date"
                                            className="form-control "
                                            name="CaretDate"
                                            value={formdata.CaretDate}
                                            onChange={handleInputChange}
                                            required
                                            ref={CaretDateRef}
                                            onKeyDown={(e) => handleKeyDown(e, CaretSizeRef)}
                                        />
                                    </div>
                                    <div className="col-sm-3">
                                        <label htmlFor="cropName">जाळी आकार </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="CaretSize"
                                            placeholder="जाळी आकार  "
                                            value={formdata.CaretSize}
                                            onChange={handleInputChange}
                                            ref={CaretSizeRef}
                                            onKeyDown={(e) => handleKeyDown(e, statusRef)}
                                            required
                                        />
                                    </div>

                                    <div className="col-sm-3">
                                        <label htmlFor="field-1" className="form-label">
                                            स्थिती
                                        </label>
                                        <div
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    e.preventDefault();
                                                    if (saveRef.current) {
                                                        saveRef.current.focus();
                                                    }
                                                }
                                            }}
                                        >
                                            <Select
                                                classNamePrefix="react-select"
                                                options={Status}
                                                ref={statusRef}
                                                value={
                                                    Status.find(
                                                        (option) => option.value === formdata.Status1
                                                    ) || null
                                                }
                                                onChange={(selectedOption) => {
                                                    setFormData((prevState) => ({
                                                        ...prevState,
                                                        Status1: selectedOption
                                                            ? selectedOption.value
                                                            : null,
                                                    }));
                                                    setTimeout(() => {
                                                        if (saveRef.current) {
                                                            saveRef.current.focus();
                                                        }
                                                    }, 100); // give react-select time to close its dropdown
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div className="text-end">
                                        <div className="d-flex justify-content-end gap-2 ">
                                            <Link
                                                className="btn btn-primary "
                                                ref={saveRef}
                                                onClick={handleSave}
                                            >
                                                जतन करा
                                            </Link>

                                            <Link
                                                className="btn btn-primary btn-dark "
                                                onClick={showExitAlert}
                                            >
                                                बाहेर पडा
                                            </Link>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="search-container mb-3">
                    <div className="row">
                        <div className="col-lg-6 col-md-8 col-10 ms-auto">
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
                            <Table columns={columns} dataSource={Caret} />
                        </div>
                    </div>
                </div>
                <Brand />
            </div>
        </div>
    );
};

export default Carets;

