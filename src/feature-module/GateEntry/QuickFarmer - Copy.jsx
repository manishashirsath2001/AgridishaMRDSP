import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import ImageWithBasePath from "../../core/img/imagewithbasebath";
import Brand from "../../core/modals/inventory/brand";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { all_routes } from "../../Router/all_routes";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import Table from "../../core/pagination/datatable";
import { setToogleHeader } from "../../core/redux/action";
import axios from 'axios';
import { baseUrl } from "../../core/json/custom";
import {
    ArrowLeft,
    ChevronUp,
    Edit,
    PlusCircle,
    RotateCcw,
    Trash2,
} from "feather-icons-react/build/IconComponents";
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { saveAs } from 'file-saver';
import ExcelJS from "exceljs";
import { getUserData } from '../../Context/UserData';
import AddQuickFarmer from './AddQuickFarmer';
function QuickFarmer() {
    const userdetail = getUserData();
    const dispatch = useDispatch();
    const data = useSelector((state) => state.toggle_header);
    const route = all_routes;
    const navigate = useNavigate();
    const [selecteddata, setselecteddata] = useState({ faid: "", fname: "", fmobile: "", faadhaar: "" });
    const onEditClick = (faid, name, aadhaar, contact) => {
        setselecteddata({ Faid: faid, fname: name, fmobile: contact, faadhaar: aadhaar });
    };
    const columns = [
        // {
        //   title: "Product",
        //   dataIndex: "product",
        //   render: (text, record) => (
        //     <span className="productimgname">
        //       <Link to="/profile" className="product-img stock-img">
        //         <ImageWithBasePath alt="" src={record.productImage} />
        //       </Link>
        //       <Link to="/profile">{text}</Link>
        //     </span>
        //   ),
        //   sorter: (a, b) => a.product.length - b.product.length,
        // },
        // {
        //   title: "SKU",
        //   dataIndex: "sku",
        //   sorter: (a, b) => a.sku.length - b.sku.length,
        // },
        {
            title: "पूर्ण नाव",
            dataIndex: "fname",

            // sorter: (a, b) => a.category.length - b.category.length,
        },
        {
            title: "आधार क्रमांक",
            dataIndex: "faddharno",

            // sorter: (a, b) => a.brand.length - b.brand.length,
        },



        {
            title: "मोबाईल नंबर",
            dataIndex: "fcontactno",

            // sorter: (a, b) => a.price.length - b.price.length,
        },


        {
            title: (
                <div className="d-flex justify-content-center">
                    <OverlayTrigger placement="top" overlay={<Tooltip id="action-tooltip">Action</Tooltip>}>
                        <span>Action</span>
                    </OverlayTrigger>
                </div>
            ),
            dataIndex: "action",
            render: (_, record) => (

                <div className="action-table-data">
                    <div className="edit-delete-action">
                        <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip id="edit-tooltip">Edit</Tooltip>}
                        >

                            <Link className="me-2 p-2"
                                to="#"
                                data-bs-toggle="modal"
                                data-bs-target="#Farmerfrom"
                                onClick={() => { onEditClick(record.faid, record.fname, record.faddharno, record.fcontactno) }}
                            >
                                <Edit className="feather-edit" />
                            </Link>

                        </OverlayTrigger>
                        {/* <OverlayTrigger placement="top" overlay={<Tooltip id="edit-tooltip">Edit</Tooltip>}>
                            <a className="me-2 p-2" onClick={() => { onEditClick(record.faid) }}>
                                <Edit className="feather-edit" />
                            </a>
                        </OverlayTrigger> */}
                        <OverlayTrigger placement="top" overlay={<Tooltip id="delete-tooltip">Delete</Tooltip>}>
                            <Link
                                className="confirm-text p-2"
                                to="#"
                                onClick={() => showConfirmationAlert(record.faid)}
                            >
                                <Trash2 className="feather-trash-2" />
                            </Link>
                        </OverlayTrigger>
                    </div>
                </div>

            ),
            // sorter: (a, b) => a.createdby.length - b.createdby.length,
        },
    ];

    const MySwal = withReactContent(Swal);

    const showConfirmationAlert = (faid) => {
        MySwal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            showCancelButton: true,
            confirmButtonColor: "#00ff00",
            confirmButtonText: "Yes, delete it!",
            cancelButtonColor: "#ff0000",
            cancelButtonText: "Cancel",
        }).then((result) => {
            if (result.isConfirmed) {
                // MySwal.fire({
                //   title: "Deleted!",
                //   text: "Your file has been deleted.",
                //   className: "btn btn-success",
                //   confirmButtonText: "OK",
                //   customClass: {
                //     confirmButton: "btn btn-success",
                //   },
                // });
                OndeleteFarmer(faid);
            } else {
                MySwal.close();
            }
        });
    };

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

    useEffect(() => {
        const handleShortcut = (e) => {
            if (e.ctrlKey && e.key === 'a') {
                e.preventDefault();
                navigate(route.AddFarmer);
            }
            if (e.ctrlKey && e.key === 'e') {
                e.preventDefault();
                navigate(route.Farmers);
            }
        };

        window.addEventListener('keydown', handleShortcut);

        return () => {
            window.removeEventListener('keydown', handleShortcut);
        };
    }, [navigate]);

    const [farmer, setFarmer] = useState([]);

    useEffect(() => {
        try {
            const payload = {

                "keyword": "%",
                "faid": "%",
                "companyid": userdetail?.companyID ? userdetail.companyID : "",
                "deptid": userdetail?.departmentID ? userdetail.departmentID : "",

            }
            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            axios({
                method: "POST",
                url: baseUrl.Url + "/backend/api/GET_GateFarmer",
                data: JSON.stringify(payload),
                headers: headers,
            })
                .then((response) => {
                    if (response.status != 200) throw new Error("Failed to Fetching Data");
                    const DATA = response.data;
                    setFarmer(DATA);
                })

        } catch (error) {
            console.error("Error fetching Access Right Data:", error);
        }
    }, []);

    const OndeleteFarmer = async (faid) => {
        try {
            const payload = {
                "faid": faid,
                "companyid": userdetail?.companyID ? userdetail.companyID : "",
                "deptid": userdetail?.departmentID ? userdetail.departmentID : "",

            }
            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            axios({
                method: "POST",
                url: baseUrl.Url + "/backend/api/SP_DeleteFarmer",
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

                            "keyword": "%",
                            "faid": "%",
                            "companyid": userdetail?.companyID ? userdetail.companyID : "",
                            "deptid": userdetail?.departmentID ? userdetail.departmentID : "",
                        }
                        const headers = {
                            "Content-Type": "application/json",
                            Accept: "*/*",
                        };

                        axios({
                            method: "POST",
                            url: baseUrl.Url + "/backend/api/GET_GateFarmer",
                            data: JSON.stringify(payload),
                            headers: headers,
                        })
                            .then((response) => {
                                if (response.status != 200) throw new Error("Failed to Fetching Data");
                                const DATA = response.data;
                                setFarmer(DATA);
                            })

                    } catch (error) {
                        console.error("Error fetching Access Right Data:", error);
                    }
                })

        } catch (error) {
            console.error("Error fetching Access Right Data:", error);
        }
    }
    const generatePDF = (farmer) => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        doc.setFontSize(12);
        doc.setFont("Helvetica", "bold");
        const title = "Personal Information Report";
        const titleWidth = doc.getTextWidth(title);

        const borderMargin = 10;
        doc.rect(borderMargin, borderMargin, pageWidth - borderMargin * 2, pageHeight - borderMargin * 2);

        doc.text(title, (pageWidth - titleWidth) / 2, 20);
        doc.setLineWidth(0.5);
        doc.line((pageWidth - titleWidth) / 2, 22, (pageWidth + titleWidth) / 2, 22);

        doc.setFontSize(13);
        doc.setFont("Helvetica", "normal");
        let yPosition = 25;

        // Table headers and data
        const tableColumn = [
            "Farmer Name",
            "Aadhar Number",
            "Pan Number",
            "Mobile Number",
            "Pincode",
            "Action"
        ];

        const tableRows = farmer.map((item) => [
            item.fname,
            item.faddharno,
            item.fpanno,
            item.fcontactno,
            item.fpincode,
            item.action ? 'Edit / Delete' : '',
        ]);


        const totalRow = [
            { content: "", colSpan: 5 },
            { content: "Total", styles: { fontStyle: "bold" } },
            { content: "", styles: { fontStyle: "bold" } },
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

        doc.save("FarmerInformationReport.pdf");
    };




    const exportFarmerDataToExcel = async (farmer) => {
        try {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Farmer Data Report');


            const headingRow = worksheet.addRow(['Farmer Data Report']);
            headingRow.getCell(1).font = { bold: true, size: 16 };
            headingRow.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };


            worksheet.mergeCells('A1:F1');

            const headers = ['Farmer Name', 'Aadhar Number', 'Pan Number', 'Mobile Number', 'Pincode', 'Action'];
            const headerRow = worksheet.addRow(headers);

            headerRow.eachCell((cell) => {
                cell.font = { bold: true, color: { argb: 'FFFFFF' } };
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '808080' } };
                cell.alignment = { horizontal: 'center', vertical: 'middle' };
            });


            const columnWidths = [20, 20, 20, 20, 10, 15];
            columnWidths.forEach((width, index) => {
                worksheet.getColumn(index + 1).width = width;
            });


            farmer.forEach(({ fname, faddharno, fpanno, fcontactno, fpincode, action }) => {
                const row = worksheet.addRow([fname, faddharno, fpanno, fcontactno, fpincode, action ? 'Edit / Delete' : '']);
                row.eachCell((cell) => {
                    cell.alignment = { horizontal: 'center', vertical: 'middle' };
                });
            });


            const buffer = await workbook.xlsx.writeBuffer();
            const data = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            saveAs(data, 'FarmerInformationReport.xlsx');
        } catch (error) {
            console.error('Error generating the Excel file:', error);
        }
    };



    return (
        <div className="page-wrapper">
            <div className="content">
                <div className="page-header">
                    <div className="add-item d-flex">
                        <div className="page-title">
                            <h3>शेतकरी </h3>
                            <h6>नवीन शेतकरी तयार करा.</h6>
                        </div>
                    </div>
                    <ul className="table-top-head">
                        <li>
                            <OverlayTrigger placement="top" overlay={renderTooltip}>
                                <Link onClick={() => generatePDF(farmer)}>
                                    <ImageWithBasePath src="assets/img/icons/pdf.svg" alt="img" />
                                </Link>
                            </OverlayTrigger>
                        </li>
                        <li>
                            <OverlayTrigger placement="top" overlay={renderExcelTooltip}  >
                                <Link data-bs-toggle="tooltip" data-bs-placement="top" onClick={() => exportFarmerDataToExcel(farmer)} >
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
                    <div className="page-btn">
                        <Link
                            to="#"
                            className="btn btn-added"
                            data-bs-toggle="modal"
                            data-bs-target="#Farmerfrom"
                        >
                            <PlusCircle className="me-2" />
                            शेतकरी नोंदवा
                        </Link>
                    </div>
                    <div className="page-btn">
                        <Link to={route.AddFarmers} className="btn btn-added">
                            <PlusCircle className="me-2 iconsize" />शेतकरी नोंदवा
                        </Link>
                    </div>
                    <div className="page-btn">
                        <Link to={route.GateEntryIndex} className="btn btn-secondary">
                            <ArrowLeft className="me-2" />
                            मागे
                        </Link>
                    </div>
                </div>

                <div className="card table-list-card">
                    <div className="card-body">
                        <div className="table-responsive">
                            <Table columns={columns} dataSource={farmer} />
                        </div>
                    </div>
                </div>

                <Brand />
                <AddQuickFarmer
                    FAID={selecteddata.faid}
                    FNAME={selecteddata.fname}
                    FADHAR={selecteddata.faadhaar}
                    FCONTACT={selecteddata.fmobile}
                />
            </div>
        </div>
    );
}

export default QuickFarmer
