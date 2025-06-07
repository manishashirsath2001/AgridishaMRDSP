import React, { useState, useEffect } from 'react'
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import ImageWithBasePath from '../../core/img/imagewithbasebath';
import { ChevronUp, PlusCircle, RotateCcw, ArrowLeft } from 'feather-icons-react/build/IconComponents';
import { setToogleHeader } from '../../core/redux/action';
import { Box, Filter, Sliders, StopCircle } from 'react-feather';
import Select from 'react-select';
import Table from '../../core/pagination/datatable.jsx'
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import AddLeaveType from './AddLeaveType.jsx';
import axios from "axios";
import { baseUrl } from "../../core/json/custom";
import { getUserData } from '../../Context/UserData.js';

import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { all_routes } from '../../Router/all_routes.jsx';
const LeaveTypes = () => {
    const route = all_routes;
    const dispatch = useDispatch();
    const data = useSelector((state) => state.toggle_header);
    // const dataSource = useSelector((state) => state.leavetypes_data);
    const { userdetail } = getUserData();
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const toggleFilterVisibility = () => {
        setIsFilterVisible((prevVisibility) => !prevVisibility);
    };
    const [Customer, setCustomer] = useState([]);
    const [selectedData, setSelectedData] = useState({ ltid: null });
    const openModal = (ltid) => {
        setSelectedData({ ltid })
    }

    useEffect(() => {

        const fetchVendors = async () => {
            try {
                const payload =
                {
                    "ltid": "%",
                    "companyid": userdetail?.companyID || "",
                    "deptid": userdetail?.departmentID || "",
                };
                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };
                const response = await axios.post(
                    `${baseUrl.Url}/backend/api/GET_LeaveType`,

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

        fetchVendors();

    }, []);

    const oldandlatestvalue = [
        { value: 'date', label: 'Sort by Date' },
        { value: 'newest', label: 'Newest' },
        { value: 'oldest', label: 'Oldest' },
    ];
    const leavetype = [
        { value: 'Choose Type', label: 'Choose Type' },
        { value: 'Maternity', label: 'Maternity' },
        { value: 'Sick Leave', label: 'Sick Leave' },
    ];
    const status = [
        { value: 'Choose Status', label: 'Choose Status' },
        { value: 'Active', label: 'Active' },
    ];

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
    )
    const renderEditTooltip = (props) => (
        <Tooltip id="Edit-tooltip" {...props}>
            Edit
        </Tooltip>
    );
    const renderDeleteTooltip = (props) => (
        <Tooltip id="Edit-tooltip" {...props}>
            Delete
        </Tooltip>
    );
    const columns = [
        {
            title: "Name",
            dataIndex: "lname",
            sorter: (a, b) => a.lname.length - b.lname.length,
        },
        {
            title: "LeaveQuota",
            dataIndex: "lleavequota",
            sorter: (a, b) => a.lleavequota.length - b.lleavequota.length,
        },
        {
            title: "Created On",
            dataIndex: "lcreateddate",
            sorter: (a, b) => new Date(a.lcreateddate) - new Date(b.lcreateddate),
            align: "center",
        },

        {
            title: "Status",
            dataIndex: "lstatus",
            render: (text) => (
                <span className="badge badge-linesuccess">
                    <Link to="#"> {text}</Link>
                </span>
            ),
            // sorter: (a, b) => a.lstatus.length - b.lstatus.length,
        },
        // {
        //     title: "Status",
        //     dataIndex: "lstatus",
        //     render: (text) => {
        //         const status = text ? text.toString().toLowerCase() : ""; // Ensure text is a string
        //         return (
        //             <span className={`badge ${status === "true" ? "badge-success" : "badge-danger"}`}>
        //                 <Link to="#">{text}</Link>
        //             </span>
        //         );
        //     },
        //     sorter: (a, b) => (a.lstatus || "").localeCompare(b.lstatus || ""),
        // },



        {
            title: "Actions",
            dataIndex: "actions",
            key: "actions",
            render: (_, record) => (
                <div className="action-table-data">
                    <div className="edit-delete-action">

                        <OverlayTrigger placement="top" overlay={renderEditTooltip}>
                            <Link
                                className="me-2 p-2" data-bs-toggle="modal" data-bs-target="#add-units" onClick={() => openModal(record.ltid)} >
                                <i data-feather="edit" className="feather-edit"></i>
                            </Link>
                        </OverlayTrigger>
                        <OverlayTrigger placement="top" overlay={renderDeleteTooltip}>
                            <Link className="confirm-text p-2" to="#">
                                <i
                                    data-feather="trash-2"
                                    className="feather-trash-2"
                                    onClick={() => showConfirmationAlert(record.ltid)}
                                ></i>
                            </Link>
                        </OverlayTrigger>
                    </div>
                </div>
            ),
        },
    ];

    const MySwal = withReactContent(Swal);
    // const showConfirmationAlert = () => {
    //     MySwal.fire({
    //         title: 'Are you sure?',
    //         text: 'You won\'t be able to revert this!',
    //         showCancelButton: true,
    //         confirmButtonColor: '#00ff00',
    //         confirmButtonText: 'Yes, delete it!',
    //         cancelButtonColor: '#ff0000',
    //         cancelButtonText: 'Cancel',
    //     }).then((result) => {
    //         if (result.isConfirmed) {

    //             MySwal.fire({
    //                 title: 'Deleted!',
    //                 text: 'Your file has been deleted.',
    //                 className: "btn btn-success",
    //                 confirmButtonText: 'OK',
    //                 customClass: {
    //                     confirmButton: 'btn btn-success',
    //                 },
    //             });
    //         } else {
    //             MySwal.close();
    //         }

    //     });
    // };
    const showConfirmationAlert = (ltid) => {
        MySwal.fire({
            title: 'Are you sure?',
            text: 'You won\'t be able to revert this!',
            showCancelButton: true,
            confirmButtonColor: '#00ff00',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonColor: '#ff0000',
            cancelButtonText: 'Cancel',
        }).then((result) => {
            if (result.isConfirmed) {

                OndeleteRequisition(ltid);
            } else {
                MySwal.close();
            }

        });
    };


    const OndeleteRequisition = async (ltid) => {
        try {
            const payload = {
                "ltid": ltid,
                "companyid": userdetail?.companyID || "",
                "deptid": userdetail?.departmentID || "",
            };
            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            axios({
                method: "POST",
                url: baseUrl.Url + "/backend/api/SP_DeleteLeaveType",
                data: JSON.stringify(payload),
                headers: headers,
            })
                .then((response) => {
                    if (response.status != 200) throw new Error("Failed to Fetching Data");
                    MySwal.fire({
                        title: response.data[0].responseCode === "FAILURE" ? "Deletion Not Allowed" : "Deleted!",
                        text: response.data[0].responseCode === "FAILURE"
                            ? response.data[0].responseMessage
                            : response.data[0].responseMessage,
                        icon: response.data[0].responseCode === "FAILURE" ? "error" : "success",
                        confirmButtonText: "OK",
                        customClass: {
                            confirmButton: response.data[0].responseCode === "FAILURE" ? "btn btn-danger" : "btn btn-success",
                        },
                    });
                    try {
                        const payload = {
                            "ltid": "%",
                            "companyid": userdetail?.companyID || "",
                            "deptid": userdetail?.departmentID || "",
                        };
                        const headers = {
                            "Content-Type": "application/json",
                            Accept: "*/*",
                        };

                        axios({
                            method: "POST",
                            url: baseUrl.Url + "/backend/api/GET_LeaveType",
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

    const downloadExcel = async () => {
        try {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("Employee Type (Report)");

            // **Main Heading Row**
            const headingRow = worksheet.addRow(["Employee Type (Report)"]);
            headingRow.getCell(1).font = { bold: true, size: 16 };
            headingRow.getCell(1).alignment = { horizontal: "center", vertical: "middle" };

            // Merge heading across all columns
            worksheet.mergeCells("A1:D1");

            // **Header Row**
            const headers = ["Leave Name", "Leave Quota", "Created Date", "Status"];
            const headerRow = worksheet.addRow(headers);

            headerRow.eachCell((cell) => {
                cell.font = { bold: true, color: { argb: "FFFFFF" } };
                cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "808080" } };
                cell.alignment = { horizontal: "center", vertical: "middle" };
            });

            // **Setting Column Widths**
            const columnWidths = [25, 25, 25, 25,]; // Adjust widths as needed
            columnWidths.forEach((width, index) => {
                worksheet.getColumn(index + 1).width = width;
            });

            // **Adding Data Rows**
            Customer.forEach(({ lname, lleavequota, lcreateddate, lstatus }) => {
                const row = worksheet.addRow([lname, lleavequota, lcreateddate, lstatus]);
                row.eachCell((cell) => {
                    cell.alignment = { horizontal: "center", vertical: "middle" };
                });
            });

            // **Generate and Save Excel File**
            const buffer = await workbook.xlsx.writeBuffer();
            const data = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
            saveAs(data, "Employee_Type_(Report).xlsx");

        } catch (error) {
            console.error("Error generating the Excel file:", error);
        }
    };

    const downloadPDF = () => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        doc.setFontSize(12);
        doc.setFont("Helvetica", "bold");
        const title = "Employee Type  Report";
        const titleWidth = doc.getTextWidth(title);

        const borderMargin = 10;
        doc.rect(borderMargin, borderMargin, pageWidth - borderMargin * 2, pageHeight - borderMargin * 2);

        doc.text(title, (pageWidth - titleWidth) / 2, 20);
        doc.setLineWidth(0.5);
        doc.line((pageWidth - titleWidth) / 2, 22, (pageWidth + titleWidth) / 2, 22);

        doc.setFontSize(13);
        doc.setFont("Helvetica", "normal");
        let yPosition = 15;


        const tableColumn = ["Leave Name", "Leave Quota", "Created Date", "Status"];

        // Table rows
        const tableRows = Customer.map(item => [
            item.lname,
            item.lleavequota,
            item.lcreateddate,
            item.lstatus

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
        doc.save("Employee Type (Report).pdf");
    };

    return (
        <div>
            <div className="page-wrapper">
                <div className="content">
                    <div className="page-header">
                        <div className="add-item d-flex">
                            <div className="page-title">
                                <h4>Leaves</h4>
                                <h6>Manage your Leaves</h6>
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
                                    <Link data-bs-toggle="tooltip" data-bs-placement="top" onClick={downloadExcel}>
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
                                        onClick={() => { dispatch(setToogleHeader(!data)) }}
                                    >
                                        <ChevronUp />
                                    </Link>
                                </OverlayTrigger>
                            </li>
                        </ul>
                        <div className="page-btn">
                            <a
                                to="#"
                                className="btn btn-added"
                                data-bs-toggle="modal"
                                data-bs-target="#add-units"
                            >
                                <PlusCircle className="me-2" />
                                Add Leave type
                            </a>
                        </div>
                        <div className="page-btn">
                            <Link to={route.HrmIndex} className="btn btn-secondary">
                                <ArrowLeft className="me-2" /> Back to Index
                            </Link>
                        </div>
                    </div>
                    {/* /product list */}
                    <div className="card table-list-card">
                        <div className="card-body">
                            <div className="table-top">
                                <div className="search-set">
                                    <div className="search-input">
                                        <input
                                            type="text"
                                            placeholder="Search"
                                            className="form-control form-control-sm formsearch"
                                        />
                                        <Link to className="btn btn-searchset">
                                            <i data-feather="search" className="feather-search" />
                                        </Link>
                                    </div>
                                </div>
                                <div className="search-path">
                                    <div className="d-flex align-items-center">
                                        <Link className={`btn btn-filter ${isFilterVisible ? "setclose" : ""}`} id="filter_search">
                                            <Filter
                                                className="filter-icon"
                                                onClick={toggleFilterVisibility}
                                            />
                                            <span onClick={toggleFilterVisibility}>
                                                <ImageWithBasePath src="assets/img/icons/closes.svg" alt="img" />
                                            </span>
                                        </Link>
                                    </div>
                                </div>
                                <div className="form-sort">
                                    <Sliders className="info-img" />
                                    <Select className="img-select"
                                        classNamePrefix="react-select"
                                        options={oldandlatestvalue}
                                        placeholder="Newest"
                                        openMenuOnFocus={true}
                                    />
                                </div>
                            </div>
                            {/* /Filter */}
                            <div
                                className={`card${isFilterVisible ? " visible" : ""}`}
                                id="filter_inputs"
                                style={{ display: isFilterVisible ? "block" : "none" }}
                            >
                                <div className="card-body pb-0">
                                    <div className="row">
                                        <div className="col-lg-3 col-sm-6 col-12">
                                            <div className="input-blocks">

                                                <Box className="info-img" />

                                                <Select className="img-select"
                                                    options={leavetype}
                                                    classNamePrefix="react-select"
                                                    placeholder="ChooseType"
                                                    openMenuOnFocus={true}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-lg-3 col-sm-6 col-12">
                                            <div className="input-blocks">
                                                <i data-feather="stop-circle" className="info-img" />
                                                <StopCircle className="info-img" />

                                                <Select className="img-select"
                                                    options={status}
                                                    classNamePrefix="react-select"
                                                    placeholder="Choose Status"
                                                    openMenuOnFocus={true}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-lg-3 col-sm-6 col-12 ms-auto">
                                            <div className="input-blocks">
                                                <a className="btn btn-filters ms-auto">
                                                    {" "}
                                                    <i data-feather="search" className="feather-search" />{" "}
                                                    Search{" "}
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* /Filter */}
                            <div className="table-responsive">
                                <Table columns={columns} dataSource={Customer} />
                            </div>
                        </div>
                    </div>
                    {/* /product list */}
                </div>
            </div>
            <AddLeaveType LTID={selectedData.ltid} />

        </div>
    )
}

export default LeaveTypes
