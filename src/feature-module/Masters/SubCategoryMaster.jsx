import React, { useState, useEffect } from 'react';
import ImageWithBasePath from "../../core/img/imagewithbasebath";
import { Link, useNavigate } from "react-router-dom";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

import {
    ChevronUp,
    PlusCircle,
    Edit,
    Trash2,
    RotateCcw,
} from "feather-icons-react/build/IconComponents";
import { useDispatch, useSelector } from "react-redux";
import { setToogleHeader } from "../../core/redux/action";
import Select from "react-select";
import AddSubcategory from "../../core/modals/inventory/addsubcategory";
import EditSubcategories from "./AddSubCategory";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import Table from "../../core/pagination/datatable";
import { baseUrl } from "../../core/json/custom";
import axios from 'axios';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
// import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import ExcelJS from "exceljs";
import { getUserData } from '../../Context/UserData';

const SubCategoryMaster = () => {
    const { userdetail } = getUserData();
    const navigate = useNavigate();
    const [selectedData, setSelectedData] = useState({ ctaid: null });
    const openModal = (ctaid) => {
        setSelectedData({ ctaid })
    }
    const [formData, setFormData] = useState({
        CTID: '',
        CTNAME: '',
        CSTATUS: false
    });

    const [SubCategories, setSubCategories] = useState([]);
    const [categories, setcategories] = useState([]);

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const payload = {
                    companyid: userdetail?.companyID || "",
                    deptid: userdetail?.departmentID || "",
                };
                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };

                const response = await axios({
                    method: "POST",
                    url: baseUrl.Url + "/backend/api/GET_CategoryDropdown",
                    data: JSON.stringify(payload),
                    headers: headers,
                });

                if (response.status !== 200) throw new Error("Failed to Fetch Categories");

                const DATA = response.data;
                const formExpenseData = DATA.map(({ categoryname, ctid }) => ({
                    label: categoryname,
                    value: ctid,
                }));

                setcategories(formExpenseData);
            } catch (error) {
                console.error("Error fetching category data:", error);
            }
        };

        fetchCategory();
    }, []);


    useEffect(() => {
        if (!formData.CTID || formData.CTID.length === 0) return;

        const fetchSubCategories = async () => {
            try {
                const payload1 = {
                    ctaid: "%",
                    ctid: formData.CTID.join(","),
                    companyid: userdetail?.companyID || "",
                    deptid: userdetail?.departmentID || "",
                };

                const response = await axios({
                    method: "POST",
                    url: baseUrl.Url + "/backend/api/GET_SubCategoryMaster",
                    data: JSON.stringify(payload1),
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "*/*",
                    },
                });

                if (response.status !== 200) throw new Error("Failed to Fetch Subcategories");

                const formattedData = response.data.map((subCategory) => ({
                    ctaid: subCategory.ctaid,
                    subcategoryname: subCategory.subcategoryname,
                    categoryname: subCategory.categoryname,
                    cstatus: subCategory.cstatus,
                }));

                setSubCategories(formattedData);
            } catch (error) {
                console.error("Error fetching subcategory data:", error);
            }
        };

        fetchSubCategories();
    }, [formData.CTID]);



    const OndeleteCategory = async (ctaid) => {

        try {
            const payload = {
                "ctaid": ctaid,
                companyid: userdetail?.companyID || "",
                deptid: userdetail?.departmentID || "",

            }

            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            axios({
                method: "POST",
                url: baseUrl.Url + "/backend/api/SP_DeleteCategory",
                data: JSON.stringify(payload),
                headers: headers,
            })
                .then((response) => {
                    if (response.status != 200) throw new Error("Failed to Fetching Data");
                    MySwal.fire({
                        title: response.data[0].responseCode === "FAILURE" ? "हटविणे अनुमत नाही" : "हटवले!",
                        text: response.data[0].responseMessage,
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
                            ctaid: "%",
                            ctid: formData.CTID.join(","),
                            companyid: userdetail?.companyID || "",
                            deptid: userdetail?.departmentID || "",
                        };
                        const headers = {
                            "Content-Type": "application/json",
                            Accept: "*/*",
                        };

                        axios({
                            method: "POST",
                            url: baseUrl.Url + "/backend/api/GET_SubCategoryMaster",
                            data: JSON.stringify(payload),
                            headers: headers,
                        })
                            .then((response) => {
                                if (response.status != 200) throw new Error("Failed to Fetching Data");
                                const DATA = response.data;
                                setSubCategories(DATA);
                            })



                    } catch (error) {
                        console.error("Error fetching Access Right Data:", error);
                    }
                })

        } catch (error) {
            console.error("Error fetching Access Right Data:", error);
        }

    }

    const generatePDF = (setSubCategories) => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        doc.setFontSize(12);
        doc.setFont("Helvetica", "bold");
        const title = "SubCategory Report";
        const titleWidth = doc.getTextWidth(title);

        const borderMargin = 10;
        doc.rect(borderMargin, borderMargin, pageWidth - borderMargin * 2, pageHeight - borderMargin * 2);

        doc.text(title, (pageWidth - titleWidth) / 2, 20);
        doc.setLineWidth(0.5);
        doc.line((pageWidth - titleWidth) / 2, 22, (pageWidth + titleWidth) / 2, 22);

        doc.setFontSize(13);
        doc.setFont("Helvetica", "normal");
        let yPosition = 15;

        const tableColumn = ["Sub Category", "Category", "Status"];
        const tableRows = setSubCategories.map((item) => [
            item.subcategoryname,
            item.categoryname,
            item.cstatus,


        ]);

        let totalsqmnamt = setSubCategories.reduce((sum, item) => sum + parseFloat(item.sqmnamt || 0), 0);

        const totalRow = [
            { content: "", colSpan: 3 },
            { content: "Total", styles: { fontStyle: "bold" } },
            { content: totalsqmnamt.toFixed(2), styles: { fontStyle: "bold" } },

        ];

        autoTable(doc, {
            startY: yPosition + 10,
            head: [tableColumn],
            body: [...tableRows, totalRow],
            theme: 'grid',
            styles: { fontSize: 10, halign: "center", lineColor: [0, 0, 0], lineWidth: 0.20 },
            headStyles: { fillColor: [169, 169, 169], textColor: 0, fontStyle: "bold" },
            bodyStyles: { textColor: 0 },
        });
        doc.save("Report.pdf");
    };


    const exportToExcel = async () => {
        try {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("SubCategory Report");


            const headingRow = worksheet.addRow(["SubCategory Report"]);
            headingRow.getCell(1).font = { bold: true, size: 16 };
            headingRow.getCell(1).alignment = { horizontal: "center", vertical: "middle" };


            worksheet.mergeCells("A1:C1");


            const headers = ["Sub Category", "Category", "Status"];
            const headerRow = worksheet.addRow(headers);

            headerRow.eachCell((cell) => {
                cell.font = { bold: true, color: { argb: "FFFFFF" } };
                cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "808080" } };
                cell.alignment = { horizontal: "center", vertical: "middle" };
            });

            const columnWidths = [40, 40, 40];
            columnWidths.forEach((width, index) => {
                worksheet.getColumn(index + 1).width = width;
            });

            SubCategories.forEach(({ subcategoryname, categoryname, cstatus }) => {
                const row = worksheet.addRow([subcategoryname, categoryname, cstatus]);
                row.eachCell((cell) => {
                    cell.alignment = { horizontal: "center", vertical: "middle" };
                });
            });

            const buffer = await workbook.xlsx.writeBuffer();
            const data = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
            saveAs(data, "SubCategory.xlsx");

        } catch (error) {
            console.error("Error generating the Excel file:", error);
        }
    };



    const dispatch = useDispatch();
    const data = useSelector((state) => state.toggle_header);
    // const dataSource = useSelector((state) => state.subcategory_data);

    const customStyles = {
        control: (provided) => ({
            ...provided,
            maxHeight: "60px",
            overflowY: "auto",
        }),
        multiValue: (provided) => ({
            ...provided,
            maxWidth: "100%",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
        }),
        menu: (provided) => ({
            ...provided,
            zIndex: 1050,
        }),
    };
    // const [isFilterVisible, setIsFilterVisible] = useState(false);
    // const toggleFilterVisibility = () => {
    //     setIsFilterVisible((prevVisibility) => !prevVisibility);
    // };

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
    const columns = [

        {
            title: "उपवर्ग",
            dataIndex: "subcategoryname",
            // sorter: (a, b) => a.category.length - b.category.length,
        },
        {
            title: "वर्ग",
            dataIndex: "categoryname",
            // sorter: (a, b) => a.parentcategory.length - b.parentcategory.length,
        },
        {
            title: (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id="types-status">स्थिती</Tooltip>}
                >
                    <div>स्थिती</div>
                </OverlayTrigger>
            ),
            dataIndex: "cstatus",
            render: (text) => (
                <span className={`badge ${text === true
                    ? "badge-linesuccess"
                    : text === false
                        ? "badge-linedanger"
                        : "badge-warning"
                    }`}>
                    <Link to="#">
                        {text === true ? "सक्रिय" : text === false ? "निष्क्रिय" : "अज्ञात"}
                    </Link>
                </span>
            ),
            // sorter: (a, b) => a.cstatus.length - b.cstatus.length,
            width: 200,
        },
        {
            title: "क्रिया",
            dataIndex: "actions",
            key: "actions",
            render: (_, record) => (
                <div className="action-table-data">
                    <div className="edit-delete-action">
                        <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip id="edit-tooltip">संपादित करा</Tooltip>}
                        >
                            <Link
                                className="me-2 p-2"
                                to="#"
                                data-bs-toggle="modal"
                                data-bs-target="#add-category"
                                onClick={() => openModal(record.ctaid)}
                            >
                                <Edit className="feather-edit" />
                            </Link>
                        </OverlayTrigger>

                        <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip id="delete-tooltip">हटवा</Tooltip>}
                        >
                            <Link
                                className="confirm-text p-2 me-2"
                                to="#"
                                onClick={() => showConfirmationAlert(record.ctaid)}
                            >
                                <Trash2 className="feather-trash-2" />
                            </Link>
                        </OverlayTrigger>
                    </div>
                </div>
            ),
        },
    ];

    const MySwal = withReactContent(Swal);


    const showConfirmationAlert = (ctaid) => {
        MySwal.fire({
            title: "तुम्हाला खात्री आहे का?",
            text: "हे बदल पूर्ववत करू शकणार नाहीत!",
            showCancelButton: true,
            confirmButtonColor: "#00ff00",
            confirmButtonText: "होय, हटवा!",
            cancelButtonColor: "#ff0000",
            cancelButtonText: "रद्द करा",
            allowOutsideClick: false,
            allowEscapeKey: false,

        }).then((result) => {
            if (result.isConfirmed) {
                OndeleteCategory(ctaid);
            } else {
                MySwal.close();
            }
        });
    };

    useEffect(() => {
        const handleShortcut = (e) => {

            if (e.ctrlKey && (e.key === "a" || e.key === "A")) {
                e.preventDefault();
                const modalTrigger = document.querySelector('[data-bs-target="#add-category"]');
                if (modalTrigger) {
                    modalTrigger.click();
                }
            }
            if (e.ctrlKey && (e.key === 'e' || e.key === 'E')) {
                e.preventDefault();
                navigate("/Test");
            }
        };

        window.addEventListener("keydown", handleShortcut);

        return () => {
            window.removeEventListener("keydown", handleShortcut);
        };
    }, [navigate]);

    return (
        <div>
            <div className="page-wrapper">
                <div className="content">
                    <div className="page-header">
                        <div className="add-item d-flex">
                            <div className="page-title">
                                <h4>सब-कॅटेगरी यादी</h4>
                                <h6>आपल्या सब-कॅटेगरी व्यवस्थापित करा</h6>
                            </div>
                        </div>
                        <ul className="table-top-head">
                            <li>
                                <OverlayTrigger placement="top" overlay={renderTooltip}>
                                    <Link onClick={() => generatePDF(SubCategories)}>
                                        <ImageWithBasePath src="assets/img/icons/pdf.svg" alt="Download PDF" />
                                    </Link>
                                </OverlayTrigger>
                            </li>
                            <li>
                                <OverlayTrigger placement="top" overlay={renderExcelTooltip}>
                                    <Link onClick={() => exportToExcel(SubCategories)}>
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
                                        onClick={() => {
                                            dispatch(setToogleHeader(!data));
                                        }}
                                    >
                                        <ChevronUp />
                                    </Link>
                                </OverlayTrigger>
                            </li>
                        </ul>
                        <div className="page-btn">
                            <Link
                                to="#"
                                className="btn btn-added"
                                data-bs-toggle="modal"
                                data-bs-target="#add-category"
                            >
                                <PlusCircle className="me-2" />
                                सब-कॅटेगरी जोडा
                            </Link>
                        </div>
                    </div>
                    {/* /product list */}
                    <div className="card table-list-card">
                        <div className="card-body">
                            <div className="table-top">
                                <div className="mb-3 col-lg-6">
                                    <label className="form-label">पॅरेंट कॅटेगरी</label>
                                    <Select
                                        classNamePrefix="react-select"
                                        options={categories}
                                        placeholder="निवडा"
                                        value={categories.filter((option) => formData.CTID.includes(option.value))}
                                        onChange={(selectedOptions) => {
                                            setFormData((prevData) => ({
                                                ...prevData,
                                                CTID: selectedOptions ? selectedOptions.map(option => option.value) : [],
                                            }));
                                        }}
                                        isMulti
                                        styles={customStyles}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="table-responsive">
                                <Table columns={columns} dataSource={SubCategories} />
                            </div>
                        </div>
                    </div>
                    {/* /product list */}
                </div>
            </div>

            <AddSubcategory CTAID={selectedData.ctaid} />
            <EditSubcategories />
        </div>

    );
};

export default SubCategoryMaster
