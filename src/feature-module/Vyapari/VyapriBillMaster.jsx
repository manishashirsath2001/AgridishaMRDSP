import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import ImageWithBasePath from "../../core/img/imagewithbasebath";
import Brand from "../../core/modals/inventory/brand";
// import withReactContent from "sweetalert2-react-content";
// import Swal from "sweetalert2";
import { all_routes } from "../../Router/all_routes";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import Table from "../../core/pagination/datatable";
import { setToogleHeader } from "../../core/redux/action";
import { baseUrl } from "../../core/json/custom";
import axios from 'axios';
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable'
import marathiFontBase64 from "../../style/fonts/NotoSansDevanagari";
import html2canvas from "html2canvas";
import {
    ArrowLeft,
    ChevronUp,
    //   Edit,
    //   Eye,

    PlusCircle,
    RotateCcw,


    //   Trash2,
} from "feather-icons-react/build/IconComponents";
// import VyapariBill from "./VyapariBill";
import AddVyapriBill from "./AddVyapriBill";
import { getUserData } from "../../Context/UserData";
const VyapriBillMaster = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const data = useSelector((state) => state.toggle_header);
    const route = all_routes;
    const { userdetail } = getUserData();

    const [vyapariName, setvyapariName] = useState([]);
    const [Billno, setBillno] = useState([]);
    const [Crop, setCrop] = useState([]);
    const [Date, setDate] = useState([]);
    const [totalAmount, settotalAmount] = useState([]);
    const [totalWeight, settotalWeight] = useState([]);
    const [tabledata, settabledata] = useState([]);
    const [remainingamount, setremainingamount] = useState([]);
    const [totalLoss, settotalLoss] = useState([]);
    const [Services, setServices] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const columns = [
        {
            title: "शेतकरी नाव",
            dataIndex: "fname",

            //   sorter: (a, b) => a.vname.length - b.vname.length,
        },
        {
            title: "बिल क्रमांक ",
            dataIndex: "billno",
            sorter: (a, b) => a.Billnumber.length - b.Billnumber.length,
        },
        {
            title: "तारीख ",
            dataIndex: "date",
            sorter: (a, b) => a.date.length - b.date.length,
        },


        {
            title: "क्रिया",
            dataIndex: "action",
            align: "center",
            render: (text, record) => (
                <div className="action-table-data">
                    <div className="edit-delete-action">
                        <i
                            data-feather="eye"
                            className="feather-eye cursor-pointer"
                            onClick={async () => {
                                const isLoaded = await getBillDetails(record.billno);
                                if (isLoaded) {
                                    const myModal = new window.bootstrap.Modal(document.getElementById('print-receipt'), {
                                        backdrop: 'static',
                                        keyboard: false
                                    });
                                    myModal.show();
                                } else {
                                    alert("Data is not load.");
                                }
                            }}
                        ></i>

                    </div>
                </div>
            ),
            sorter: (a, b) => a.createdby.length - b.createdby.length,
        },
    ];

    const getBillDetails = async (billno) => {
        try {
            const payload = {
                baid: userdetail.uaid || "",
                billno: ""
            };
            const payload1 = {
                baid: userdetail.uaid || "",
                billno: ""
            };

            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            const [billRes, serviceRes] = await Promise.all([
                axios.post(`${baseUrl.Url}/backend/api/GET_CreateFarmerBillVyapari`, payload, { headers }),
                axios.post(`${baseUrl.Url}/backend/api/GET_VyapariBillChargesBill`, payload1, { headers })
            ]);

            if (billRes.status === 200 && Array.isArray(billRes.data) && billRes.data.length > 0) {
                const first = billRes.data[0];
                setvyapariName(first.vname);
                setBillno(first.billno);
                setCrop(first.croplabel);
                setDate(first.date);
                settotalWeight(first.totalweight);
                settotalAmount(first.totalamount);
                settotalLoss(first.totalloss);
                setremainingamount(first.remainingamount);
                settabledata(billRes.data);
            }

            if (serviceRes.status === 200) {
                setServices(serviceRes.data);
            }

            return true;
        } catch (error) {
            console.error("Error fetching bill/service data", error);
            return false;
        }
    };

    // useEffect(() => {
    //     const fetchChequeDetails = async () => {
    //         try {
    //             const payload = {
    //                 baid: vbaid,

    //                 companyid: userdetail?.companyID ? userdetail.companyID : "",
    //                 deptid: userdetail?.departmentID ? userdetail.departmentID : "",
    //             };
    //             const headers = {
    //                 "Content-Type": "application/json",
    //                 Accept: "*/*",
    //             };
    //             const response = await axios.post(`${baseUrl.Url}/backend/api/GET_CreateBill`, payload, { headers });

    //             if (response.status !== 200) throw new Error("Failed to fetch vendor data");

    //             if (Array.isArray(response.data) && response.data.length > 0) {
    //                 const first = response.data[0];
    //                 setfarmeName(first.fullname);
    //                 setBillno(first.billno);
    //                 setBillDate(formatDate(first.date));
    //                 setCrop(first.croplabel);
    //                 settotalWeight(first.totalweight);
    //                 settotalAmount(first.totalamount);
    //                 settotalCost(first.totalcost);
    //                 setremainingamount(first.remainingamount);
    //                 settabledata(response.data);
    //             } else {
    //                 console.warn("GET_CreateBill returned empty or invalid data:", response.data);
    //             }
    //         } catch (error) {
    //             console.error("Error fetching vendor data:", error);
    //         }
    //     };

    //     const fetchServiceCharges = async () => {
    //         try {
    //             const payload = {
    //                 baid: vbaid,
    //                 companyid: userdetail?.companyID ? userdetail.companyID : "",
    //                 deptid: userdetail?.departmentID ? userdetail.departmentID : "",
    //             };
    //             const headers = {
    //                 "Content-Type": "application/json",
    //                 Accept: "*/*",
    //             };
    //             const response = await axios.post(`${baseUrl.Url}/backend/api/GET_FarmerBillCharges`, payload, { headers });

    //             if (response.status !== 200) throw new Error("Failed to fetch Service data");

    //             console.log("Services Charge", response.data);
    //             setServices(response.data);
    //         } catch (error) {
    //             console.error("Error fetching Services Charge data:", error);
    //         }
    //     };
    //     fetchChequeDetails()
    //     fetchServiceCharges()

    // }, []);

    const handlePrintReceipt = () => {
        const printContents = document.getElementById('printableArea').innerHTML;
        const originalContents = document.body.innerHTML;

        document.body.innerHTML = printContents;
        window.print();
        document.body.innerHTML = originalContents;
        window.location.reload(); // Optional: to reload original state
    };


    const generatePDF = (Vyapari) => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();

        const cleanBase64 = marathiFontBase64.replace(/^data:font\/ttf;base64,/, "");

        doc.addFileToVFS("NotoSansDevanagari.ttf", cleanBase64);
        doc.addFont("NotoSansDevanagari.ttf", "NotoSansDevanagari", "normal");
        doc.setFont("NotoSansDevanagari", "normal");
        doc.setFontSize(16);

        console.log(doc.getFontList());

        const title = "व्यापारी बिल अहवाल";
        doc.text(title, (pageWidth - doc.getTextWidth(title)) / 2, 20);

        const tableColumn = [["शेतकरी नाव", "बिल क्रमांक ", "तारीख  "]];

        const tableRows = Vyapari.map((item) => [
            item.fname,
            item.billno,
            item.date,
            // item.vmoblie,

        ]);

        autoTable(doc, {
            startY: 30,
            head: tableColumn,
            body: tableRows,
            styles: { font: "NotoSansDevanagari", fontStyle: "normal", fontSize: 12 },
            headStyles: { fontStyle: "normal", fillColor: [0, 102, 204], textColor: 255, fontSize: 14 },
            alternateRowStyles: { fillColor: [240, 240, 240] },

        });


        window.open(doc.output("bloburl"), "_blank");
    };




    const exportToExcel = async () => {
        try {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("Vyapari Report");

            const headingRow = worksheet.addRow(["व्यापारी बिल अहवाल"]);
            headingRow.getCell(1).font = { bold: true, size: 16 };
            headingRow.getCell(1).alignment = { horizontal: "center", vertical: "middle" };

            worksheet.mergeCells("A1:C1");

            const headers = ["शेतकरी नाव", "बिल क्रमांक ", "तारीख  "];
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

            Vyapari.forEach(({ fname, billno, date, }) => {
                const row = worksheet.addRow([fname, billno, date,]);
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


    const [Vyapari, setVyapari] = useState([]);


    const [selectedData, setSelectedData] = useState({ token: null });
    const handleProceed = (vbkid) => {
        setSelectedData({ vbkid: vbkid });

    };
    //get master data
    useEffect(() => {
        try {
            const payload = {
                "vyapariname": userdetail?.uaid ? userdetail.uaid : "",
                "companyid": "",
                "deptid": "",
                "keyword": "%"
            }

            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            axios({
                method: "POST",
                url: baseUrl.Url + "/backend/api/GET_VyapariBillMasterData",
                data: JSON.stringify(payload),
                headers: headers,
            })
                .then((response) => {
                    if (response.status != 200) throw new Error("Failed to Fetching Data");
                    const DATA = response.data;
                    setVyapari(DATA);
                })

        } catch (error) {
            console.error("Error fetching Access Right Data:", error);
        }
    }, []);

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
        try {
            const payload = {
                "vyapariname": "%",
                "companyid": "",
                "deptid": "",
                "keyword": event.target.value
            }
            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            axios({
                method: "POST",
                url: baseUrl.Url + "/backend/api/GET_VyapariBillMasterData/_Search",
                data: JSON.stringify(payload),
                headers: headers,
            })

                .then((response) => {
                    if (response.status != 200) throw new Error("Failed to send otp");
                    const DATA = response.data;
                    setVyapari(DATA);
                })
        } catch (error) {
            console.error("Error while searching Service data:", error);
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
    const renderCollapseTooltip = (props) => (
        <Tooltip id="refresh-tooltip" {...props}>
            Collapse
        </Tooltip>
    );

    const handleDownload = () => {
        const input = document.getElementById("printableArea");

        html2canvas(input, { scale: 2 }).then((canvas) => {
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4");

            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
            pdf.save(`bill_${Billno || "receipt"}.pdf`);
        });
    };

    return (
        <div className="page-wrapper">
            <div className="content">
                <div className="page-header">
                    <div className="add-item d-flex">
                        <div className="page-title">
                            <h3>व्यापारी बिल मास्टर </h3>
                            <h6> व्यापारी बिल मास्टर</h6>
                        </div>
                    </div>
                    <ul className="table-top-head">
                        <li>
                            <OverlayTrigger placement="top" overlay={renderTooltip}>
                                <Link
                                    to="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        generatePDF(Vyapari);
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
                        <Link
                            to="#"
                            className="btn btn-added"
                            data-bs-toggle="modal"
                            data-bs-target="#AddVyapariBill"
                        >
                            <PlusCircle className="me-2" />
                            बिल नोंदवा
                        </Link>
                    </div> */}
                    {/* <div className="page-btn">
            <Link to={route.RokdaVyapari} className="btn btn-added">
              <PlusCircle className="me-2 iconsize" /> Add Customer
            </Link>
          </div> */}
                    <div className="col-12 col-md-6">
                        <div className="row g-2 justify-content-md-end mt-2 mt-md-auto">
                            <div className="col-12 col-md-5">
                                <button
                                    type="button"
                                    className="btn btn-secondary w-100"
                                    onClick={() => navigate(route.VyapariDashboardIndex)}
                                >
                                    मागे
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* <div className="card table-list-card">
                    <div className="card-body">
                        <div className="table-responsive">
                            <Table columns={columns} dataSource={Vyapari}
                                rowKey={(record) => record.vbkid || record.billno} />
                        </div>
                    </div>
                </div> */}

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
                    <div className="card-body p-2">
                        <div className="table-responsive responsive-no-scroll">
                            <Table
                                columns={columns}
                                dataSource={Vyapari}
                                pagination={false}
                                scroll={false} // ensure ant-table doesn't enforce horizontal scroll
                                rowKey={(record) => record.vbkid || record.billno}
                            />
                        </div>
                    </div>
                </div>

                <Brand />
            </div>
            {/* <AddVyapriBill vbkid={selectedData.vbkid} /> */}
            {/* Print Receipt */}
            <div
                className="modal"
                id="print-receipt"
                aria-labelledby="print-receipt"
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content rounded-4 shadow border border-success" style={{ backgroundColor: "#f0f8ff" }}>

                        <div className="d-flex justify-content-end p-2">
                            <button
                                type="button"
                                className="close p-0"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            >
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>
                        <div className="modal-body" id="printableArea" style={{ backgroundColor: "#f0f8ff" }}>

                            <div className="icon-head text-center mb-3">
                                <h3 className="text-center" style={{ color: 'orange' }}>
                                    {userdetail?.departmentname}
                                </h3>

                            </div>
                            <div className="tax-invoice" style={{ backgroundColor: "#f0f8ff" }}>
                                <h6 className="text-center text-success">व्यापारी  बिल</h6>

                                <div className="row mb-3">
                                    <div className="col-sm-12 col-md-6">
                                        <div className="invoice-user-name">
                                            <span className="bold-text" style={{ color: "#00000" }}>व्यापारी : </span>
                                            <strong> {vyapariName}</strong>
                                        </div>
                                        <div className="invoice-user-name">
                                            <span className="bold-text" style={{ color: "#00000" }}>बिल क्र.: </span>
                                            <strong>{Billno}</strong>
                                        </div>
                                    </div>
                                    <div className="col-sm-12 col-md-6">
                                        {Crop && (
                                            <div className="invoice-user-name">
                                                <span className="bold-text" style={{ color: "#00000" }}>पीक: </span>
                                                <strong>{Crop}</strong>
                                            </div>
                                        )}
                                        <div className="invoice-user-name">
                                            <span className="bold-text" style={{ color: "#00000" }}>दिनांक: </span>
                                            <strong>{Date}</strong>
                                        </div>
                                    </div>
                                </div>
                                {/* </div> */}

                            </div>
                            <table className="table-borderless w-100 table-fit">
                                <thead style={{ backgroundColor: '#add8e6' }}>  {/* light blue background color */}
                                    <tr>
                                        <th className="text-center">अ.क्र.</th>
                                        <th className="text-center">शेतकरी </th>
                                        {/* <th className="text-center">Crop</th> */}
                                        <th className="text-center">वजन </th>
                                        <th className="text-center">भाव </th>
                                        <th className="text-end">रक्कम </th>
                                    </tr>
                                </thead>

                                <tbody>


                                    {tabledata.length > 0 ? (
                                        tabledata.map((row, index) => (
                                            <tr key={index}>
                                                <td className="text-center" style={{ color: '#333' }}><strong>{index + 1}</strong></td> {/* Darker text color */}
                                                <td className="text-center" style={{ color: '#333' }}><strong>{row.fname}</strong></td>
                                                {/* <td className="text-center">{row.croplabel}</td> */}
                                                <td className="text-center" style={{ color: '#333' }}><strong>{row.weight}</strong></td>
                                                <td className="text-center" style={{ color: '#333' }}><strong>{row.rate}</strong></td>
                                                <td className="text-end" style={{ color: '#333' }}><strong>{row.amount}</strong></td>
                                            </tr>

                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="text-center">No Data Available</td>
                                        </tr>
                                    )}


                                    <tr>
                                        <td colSpan={6}>
                                            <table className="table-borderless w-100 table-fit">
                                                <tbody>
                                                    <tr>
                                                        <td><strong>उप एकूण :</strong></td>
                                                        <td className="text-end"><strong>{totalAmount}</strong></td>
                                                    </tr>
                                                    <tr>
                                                        <td><strong>एकूण वजन :</strong></td>
                                                        <td className="text-end"><strong>{totalWeight}</strong></td>
                                                    </tr>
                                                    {Services
                                                        .map((item, index) => (
                                                            <tr key={index}>
                                                                <td style={{ paddingTop: "8px" }}><strong>{item.rateTypeTitle}:</strong></td>
                                                                <td className="text-end" style={{ paddingTop: "8px" }}><strong>{item.totalAmount}</strong></td>
                                                            </tr>
                                                        ))}

                                                    <tr>
                                                        <td><strong>एकूण खर्च :</strong></td>
                                                        <td className="text-end"><strong>{totalLoss}</strong></td>
                                                    </tr>

                                                    <tr>
                                                        <td><strong>एकूण रक्कम  :</strong></td>
                                                        <td className="text-end"><strong>{remainingamount}</strong></td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>

                                </tbody>
                            </table>

                            <div className="text-center invoice-bar mt-3">
                                <Link to="#" className="btn btn-success" onClick={handleDownload}>
                                    Download
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* /Print Receipt */}
        </div >

    );
};

export default VyapriBillMaster;

