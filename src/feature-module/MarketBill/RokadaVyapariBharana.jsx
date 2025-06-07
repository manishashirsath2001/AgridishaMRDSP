import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ImageWithBasePath from "../../core/img/imagewithbasebath";
import Brand from "../../core/modals/inventory/brand";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
// import {  useNavigate } from "react-router-dom";
import { baseUrl } from "../../core/json/custom";
import axios from 'axios';
import { all_routes } from "../../Router/all_routes";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import Table from "../../core/pagination/datatable";
import { getUserData } from '../../Context/UserData';
import { setToogleHeader } from "../../core/redux/action";
import marathiFontBase64 from "../../style/fonts/NotoSansDevanagari";
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable'
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";
// import Voucher from "./Voucher";

import {
    ArrowLeft,
    ChevronUp,
    Edit,
    // Eye,

    PlusCircle,
    RotateCcw,


    Trash2,
} from "feather-icons-react/build/IconComponents";
// import RokdaVyapariBharna from "./RokdaVyapariBharna";
// import AddRokadaVyapariBharana from "./AddRokadaVyapariBharana";
// import RokdaVyapariBharna from "./RokdaVyapariBharna";
import AddRokadaVyapariBharana from "./AddRokadaVyapariBharana";


const RokadaVyapariBharana = () => {
    const dispatch = useDispatch();
    const data = useSelector((state) => state.toggle_header);
    const route = all_routes;
    const { userdetail } = getUserData();
    // const navigate = useNavigate();
    const columns = [
        {
            title: "रोकडा व्यापारी नाव ",
            dataIndex: "vname",
            align: "center",
        },

        {
            title: "तारीख ",
            dataIndex: "trndt",
            align: "center",

        },
        {
            title: "रक्कम",
            dataIndex: "bpamt",
            align: "center",

        },

        {
            title: "कृती",
            dataIndex: "action",
            align: "center",
            render: (text, record) => (
                <div className="action-table-data">
                    <div className="edit-delete-action">
                        {/* <Link className="me-2 p-2" to={route.productdetails}>
              <Eye className="feather-view" />
            </Link> */}
                        {/* <a
              className="me-2 p-2"
              data-bs-toggle="modal"
              data-bs-target="#add-units"
              onClick={() => { oneditClick(record.voucherAID) }}
              title="Edit"
            >  <Edit className="feather-edit" />
            </a> */}

                        <Link className="me-2 p-2"
                            to="#"

                            onClick={async (e) => {
                                e.preventDefault();

                                await oneditClick(record.vdaid);
                                const modal = document.getElementById("add-bharna");

                                if (modal) {
                                    modal.classList.add("show");
                                    modal.style.display = "block";
                                    modal.setAttribute("aria-modal", "true");
                                    modal.setAttribute("role", "dialog");
                                    modal.removeAttribute("aria-hidden");

                                    const backdrop = document.createElement("div");
                                    backdrop.className = "modal-backdrop fade show";
                                    document.body.appendChild(backdrop);

                                    document.body.classList.add("modal-open");
                                    document.body.style.overflow = "hidden";
                                    document.body.style.paddingRight = "0px";
                                }

                            }}

                        // data-bs-toggle="modal"
                        // data-bs-target="#Model1"
                        // onClick={() => openModal(record.apkid, record.iscompleted)}
                        >
                            <Edit className="feather-edit" />
                        </Link>

                        {/* <button
                                                    type="button"
                                                    className="btn btn-submit"
                                                    data-bs-toggle="modal"
                                                    data-bs-target="#add-verification"
                                                    onClick={() => openModal(formData.Name, formData.Mobile)}
                                                
                                                    >
                                                    पुष्टीकरण
                                                    </button> */}


                        <Link
                            className="confirm-text p-2"
                            to="#"
                            onClick={() => showConfirmationAlert(record.vdaid)}
                        >
                            <Trash2 className="feather-trash-2" />
                        </Link>
                    </div>
                </div>
            ),

        },
    ];


    const generatePDF = (receiptmaster) => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();

        const cleanBase64 = marathiFontBase64.replace(/^data:font\/ttf;base64,/, "");

        doc.addFileToVFS("NotoSansDevanagari.ttf", cleanBase64);
        doc.addFont("NotoSansDevanagari.ttf", "NotoSansDevanagari", "normal");

        // Title: Marathi font
        doc.setFont("NotoSansDevanagari", "normal");
        doc.setFontSize(16);
        const title = "बिलिंग अहवाल";
        doc.text(title, (pageWidth - doc.getTextWidth(title)) / 2, 20);

        // Table headings in Marathi
        const tableColumn = [["रोकडा व्यापारी नाव", "तारीख", "रक्कम"]];

        // Table body data in English
        const tableRows = receiptmaster.map((item) => {
            // const formattedDate = item.draccename
            //     ? new Date(item.draccename).toLocaleDateString("en-GB")
            //     : "N/A";

            // const formattedVehNo = (item.fname && item.fname.trim())
            //     ? item.fname.trim().replace(/([A-Za-z]{2})(\d{2})([A-Za-z]{1,2})(\d{4})/, "$1 $2 $3 $4")
            //     : "N/A";

            return [
                item.vname,
                item.trndt,
                // formattedDate,
                // formattedVehNo,
                item.bpamt || "",


                // formattedDate,
                // formattedVehNo
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


    const exportToExcel = async () => {
        try {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("Vyapari Report");

            const headingRow = worksheet.addRow(["व्हाउचर अहवाल"]);
            headingRow.getCell(1).font = { bold: true, size: 16 };
            headingRow.getCell(1).alignment = { horizontal: "center", vertical: "middle" };

            worksheet.mergeCells("A1:C1");

            const headers = ["रोकडा व्यापारी नाव", "तारीख", "रक्कम"];
            const headerRow = worksheet.addRow(headers);

            headerRow.eachCell((cell) => {
                cell.font = { bold: true, color: { argb: "FFFFFF" } };
                cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "808080" } };
                cell.alignment = { horizontal: "center", vertical: "middle" };
            });

            const columnWidths = [15, 20, 25,]; // Adjust widths as needed
            columnWidths.forEach((width, index) => {
                worksheet.getColumn(index + 1).width = width;
            });

            Customer.forEach(({ vname, trndt, bpamt, }) => {
                const row = worksheet.addRow([vname, trndt, bpamt,]);
                row.eachCell((cell) => {
                    cell.alignment = { horizontal: "center", vertical: "middle" };
                });
            });

            const buffer = await workbook.xlsx.writeBuffer();
            const data = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
            saveAs(data, "Customer Report.xlsx");
            console.log(marathiFontBase64);

        } catch (error) {
            console.error("Error generating the Excel file:", error);
        }
    };


    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);

        try {
            const payload = {
                "uaid": "%",
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
                url: baseUrl.Url + "/backend/api/GET_RokdaVyapari/_Search",
                data: JSON.stringify(payload),
                headers: headers,
            })

                .then((response) => {
                    if (response.status != 200) throw new Error("Failed to send otp");
                    console.log("response", response.data);
                    setCustomer(response.data);
                })
        } catch (error) {
            console.error("Error while searching Service data:", error);
        }
    };





    useEffect(() => {
        const handleShortcut = (e) => {
            if (e.ctrlKey && (e.key === "a" || e.key === "A")) {
                e.preventDefault();
                oneditClick();
                const modal = document.getElementById("add-bharna");

                if (modal) {
                    modal.classList.add("show");
                    modal.style.display = "block";
                    modal.setAttribute("aria-modal", "true");
                    modal.setAttribute("role", "dialog");
                    modal.removeAttribute("aria-hidden");
                    const backdrop = document.createElement("div");
                    backdrop.className = "modal-backdrop fade show";
                    document.body.appendChild(backdrop);
                    document.body.classList.add("modal-open");
                    document.body.style.overflow = "hidden";
                    document.body.style.paddingRight = "0px";
                }

            }
            // if ((e.ctrlKey && (e.key === 'e' || e.key === 'E'))) {
            //   e.preventDefault();
            //   navigate(route.test);
            // }
        };

        window.addEventListener('keydown', handleShortcut);

        return () => {
            window.removeEventListener('keydown', handleShortcut);
        };
    },);


    const MySwal = withReactContent(Swal);
    const showConfirmationAlert = (vdaid) => {
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

                OndeleteRequisition(vdaid);
            } else {
                MySwal.close();
            }

        });
    };

    const [selectedData, setSelectedData] = useState({ vdaid: null });
    const oneditClick = (vdaid) => {
        setSelectedData({ vdaid })
        // navigate("/AddVoucher", { state: { voucherAID } });
    };


    const [refreshFlag, setRefreshFlag] = useState(false);// for Refresh

    // for Refresh
    const refreshData = () => {
        setRefreshFlag(prev => !prev);
    };

    // for Refresh
    useEffect(() => {
        setSelectedData({ vdaid: '' }); // 👈 Clear after refresh
    }, [refreshFlag]);



    const [Customer, setCustomer] = useState([]);

    useEffect(() => {
        console.log("useEffect triggered");
        const fetchServiceCharge = async () => {
            try {
                const payload =
                {
                    "UAID": "%",
                    "keyword": "%",
                    "companyid": userdetail?.companyID ? userdetail.companyID : "",
                    "deptid": userdetail?.departmentID ? userdetail.departmentID : "",
                };

                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };
                const response = await axios.post(
                    `${baseUrl.Url}/backend/api/GET_RokdaVyapari`,

                    payload,
                    { headers }
                );
                if (response.status !== 200)
                    throw new Error("Failed to fetch vendor data");
                console.log("quatation master", response.data)
                // const filteredData = response.data.filter(item =>  item.isclose != true);
                setCustomer(response.data);
            } catch (error) {
                console.error("Error fetching vendor data:", error);
            }
        };

        fetchServiceCharge();

    }, [refreshFlag]);


    const OndeleteRequisition = async (vdaid) => {
        try {
            const payload = {
                "vdaid": vdaid
            }
            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            axios({
                method: "POST",
                url: baseUrl.Url + "/backend/api/SP_DeleteVyapariDue",
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
                            "UAID": "%",
                            "keyword": "%",
                            "companyid": userdetail?.companyID ? userdetail.companyID : "",
                            "deptid": userdetail?.departmentID ? userdetail.departmentID : "",
                        };;
                        const headers = {
                            "Content-Type": "application/json",
                            Accept: "*/*",
                        };

                        axios({
                            method: "POST",
                            url: baseUrl.Url + "/backend/api/GET_RokdaVyapari",
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


    // Empty data source
    // const dataSource = [];
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
                            <h3>रोकडा व्यापारी भरणा  </h3>
                            <h6>रोकडा व्यापारी भरणा</h6>
                        </div>
                    </div>

                    <ul className="table-top-head">
                        <li>
                            <OverlayTrigger placement="top" overlay={renderTooltip}>
                                <Link
                                    to="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        generatePDF(Customer);
                                    }}
                                >
                                    <ImageWithBasePath src="assets/img/icons/pdf.svg" alt="Download PDF" />
                                </Link>
                            </OverlayTrigger>
                        </li>
                        <li>
                            <OverlayTrigger placement="top" overlay={renderExcelTooltip}>
                                <Link data-bs-toggle="tooltip" data-bs-placement="top" onClick={exportToExcel}>
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
                    {/* <div className="page-btn">
            <Link to={route.AddVoucher} className="btn btn-added">
              <PlusCircle className="me-2 iconsize" /> Add New Voucher
            </Link>
          </div> */}
                    <div className="page-btn">
                        {/* <Link
                            to="#"
                            className="btn btn-added"
                            data-bs-toggle="modal"
                            data-bs-target="#add-units"
                          >
                            <PlusCircle className="me-2" />
                            नवीन व्हाउचर
                          </Link> */}


                        <button className="btn btn-added"
                            onClick={async (e) => {
                                e.preventDefault();

                                await oneditClick();
                                const modal = document.getElementById("add-bharna");

                                if (modal) {
                                    modal.classList.add("show");
                                    modal.style.display = "block";
                                    modal.setAttribute("aria-modal", "true");
                                    modal.setAttribute("role", "dialog");
                                    modal.removeAttribute("aria-hidden");

                                    const backdrop = document.createElement("div");
                                    backdrop.className = "modal-backdrop fade show";
                                    document.body.appendChild(backdrop);

                                    document.body.classList.add("modal-open");
                                    document.body.style.overflow = "hidden";
                                    document.body.style.paddingRight = "0px";
                                }

                            }}
                        >
                            <PlusCircle className="me-2 iconsize" />
                            नवीन भरणा
                        </button>
                    </div>
                    <div className="page-btn">
                        <Link to={route.MarketBillIndex} className="btn btn-secondary">
                            <ArrowLeft className="me-2" />
                            मागे
                        </Link>
                    </div>
                </div>

                <div className="search-container mb-3">
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

                <div className="card table-list-card">
                    <div className="card-body">
                        <div className="table-responsive">
                            <Table columns={columns} dataSource={Customer} />
                        </div>
                    </div>
                </div>

                <Brand />
            </div>
            {/* <Voucher voucherAID={selectedData.voucherAID} onRefresh={refreshData}/> */}
            <AddRokadaVyapariBharana VDAID={selectedData.vdaid} onRefresh={refreshData} />

        </div>
    );
};

export default RokadaVyapariBharana;

