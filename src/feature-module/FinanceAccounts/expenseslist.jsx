import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ChevronUp,
  PlusCircle,
  RotateCcw,
  ArrowLeft,
  Trash2,
  Edit,
} from "feather-icons-react/build/IconComponents";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import ImageWithBasePath from "../../core/img/imagewithbasebath";
import "react-datepicker/dist/react-datepicker.css";
import { all_routes } from "../../Router/all_routes";
// import { expenselist } from "../../core/json/expenselistdata";
import Table from "../../core/pagination/datatable";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { baseUrl } from "../../core/json/custom";
import axios from "axios";
import AddExpense from "./AddExpense";
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const ExpensesList = () => {
  const [selectedData, setSelectedData] = useState({ expaid: null });
  const [Expense, setExpense] = useState([])
  const MySwal = withReactContent(Swal);
  const route = all_routes;

  useEffect(() => {
    const fetchExpense = async () => {
      try {
        const payload = {
          "expaid": "%",
          "companyid": "",
          "deptid": ""
        }
        const headers = {
          "Content-Type": "application/json",
          Accept: "*/*",
        };

        axios({
          method: "POST",
          url: baseUrl.Url + "/backend/api/GET_Expense",
          data: JSON.stringify(payload),
          headers: headers,
        })
          .then((response) => {
            if (response.status != 200) throw new Error("Failed to Fetching Data");
            const DATA = response.data;
            setExpense(DATA);
          })

      } catch (error) {
        console.error("Error fetching Access Right Data:", error);
      }
    }
    fetchExpense();
  }, []);




  const showConfirmationAlert = (expaid) => {
    MySwal.fire({
      title: "तुम्हाला खात्री आहे का?",
      text: "तुम्ही हे बदलू शकणार नाही!",
      showCancelButton: true,
      confirmButtonColor: "#00ff00",
      confirmButtonText: "हो, हटवा!",
      cancelButtonColor: "#ff0000",
      cancelButtonText: "रद्द करा",
      allowOutsideClick: false,
      allowEscapeKey: false,

    }).then((result) => {
      if (result.isConfirmed) {
        OndeleteExpense(expaid);
      } else {
        MySwal.close();
      }
    });
  };

  const OndeleteExpense = async (expaid) => {
    try {
      const payload = {
        "expaid": expaid,
        "companyid": "",
        "deptid": "",
      }
      const headers = {
        "Content-Type": "application/json",
        Accept: "*/*",
      };

      axios({
        method: "POST",
        url: baseUrl.Url + "/backend/api/SP_DeleteExpensesDomain",
        data: JSON.stringify(payload),
        headers: headers,
      })
        .then((response) => {
          if (response.status != 200) throw new Error("Failed to Fetching Data");
          MySwal.fire({
            title: response.data[0].responseCode === "FAILURE" ? "हटवणे शक्य नाही" : "हटवले गेले!",
            text: response.data[0].responseMessage,
            icon: response.data[0].responseCode === "FAILURE" ? "error" : "success",
            confirmButtonText: "ठीक आहे",
            allowOutsideClick: false,
            allowEscapeKey: false,
            customClass: {
              confirmButton: response.data[0].responseCode === "FAILURE" ? "btn btn-danger" : "btn btn-success",
            },
          });
          try {
            const payload = {
              "expaid": "%",
              "companyid": "",
              "deptid": "",

            }
            const headers = {
              "Content-Type": "application/json",
              Accept: "*/*",
            };

            axios({
              method: "POST",
              url: baseUrl.Url + "/backend/api/GET_Expense",
              data: JSON.stringify(payload),
              headers: headers,
            })
              .then((response) => {
                if (response.status != 200) throw new Error("Failed to Fetching Data");
                const DATA = response.data;
                setExpense(DATA);
              })

          } catch (error) {
            console.error("Error fetching Access Right Data:", error);
          }
        })

    } catch (error) {
      console.error("Error fetching Access Right Data:", error);
    }

  }

  const openEditModal = (expaid) => {
    setSelectedData({ expaid })
  }



  const generatePDF = (Expense) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    doc.setFontSize(12);
    doc.setFont("Helvetica", "bold");
    const title = "Expenses Report";
    const titleWidth = doc.getTextWidth(title);

    const borderMargin = 10;
    doc.rect(borderMargin, borderMargin, pageWidth - borderMargin * 2, pageHeight - borderMargin * 2);
    const drawBorder = () => {
      doc.setDrawColor(100, 100, 100);
      doc.rect(borderMargin, borderMargin, pageWidth - borderMargin * 2, pageHeight - borderMargin * 2);
    };
    drawBorder();
    doc.text(title, (pageWidth - titleWidth) / 2, 20);
    doc.setLineWidth(0.5);
    doc.line((pageWidth - titleWidth) / 2, 22, (pageWidth + titleWidth) / 2, 22);

    doc.setFontSize(13);
    doc.setFont("Helvetica", "normal");
    let yPosition = 15;

    const tableColumn = ["Expense Category", "Expense Date", "ExpenseAmount", "Expense Peference", "Expense For", "Discription"];
    const tableRows = Expense.map((item) => [
      item.expname,
      item.expdate,
      item.expamount,
      item.expreference,
      item.expensefor,
      item.expdescription,

    ]);

    autoTable(doc, {
      startY: yPosition + 10,
      head: [tableColumn],
      body: [...tableRows],
      theme: 'grid',
      styles: { fontSize: 10, halign: "center", lineColor: [0, 0, 0], lineWidth: 0.20 },

      headStyles: { fillColor: [169, 169, 169], textColor: 0, fontStyle: "bold" },
      bodyStyles: { textColor: 0 },

      didDrawPage: () => {
        drawBorder();

      },

    });
    doc.save("Report.pdf");
  };


  const exportToExcel = async () => {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Expense Report");


      const headingRow = worksheet.addRow(["Expense Report"]);
      headingRow.getCell(1).font = { bold: true, size: 16 };
      headingRow.getCell(1).alignment = { horizontal: "center", vertical: "middle" };

      worksheet.mergeCells("A1:F1");

      const headers = ["Expense Category", "Expense Date", "ExpenseAmount", "Expense Peference", "Expense For", "Discription"];
      const headerRow = worksheet.addRow(headers);

      headerRow.eachCell((cell) => {
        cell.font = { bold: true, color: { argb: "FFFFFF" } };
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "808080" } };
        cell.alignment = { horizontal: "center", vertical: "middle" };
      });

      const columnWidths = [25, 20, 25, 30, 18, 40];
      columnWidths.forEach((width, index) => {
        worksheet.getColumn(index + 1).width = width;
      });


      Expense.forEach(({ expname, expdate, expamount, expreference, expensefor, expdescription, }) => {
        const row = worksheet.addRow([expname, expdate, expamount, expreference, expensefor, expdescription,]);
        row.eachCell((cell) => {
          cell.alignment = { horizontal: "center", vertical: "middle" };
        });
      });


      const buffer = await workbook.xlsx.writeBuffer();
      const data = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      saveAs(data, "ExpenseReport.xlsx");

    } catch (error) {
      console.error("Error generating the Excel file:", error);
    }
  };



  const columns = [
    {
      title: "वर्गाचे नाव",
      dataIndex: "expname",
      sorter: (a, b) => a.expname.length - b.expname.length,
    },
    {
      title: "संदर्भ",
      dataIndex: "expreference",
      sorter: (a, b) => a.expreference.length - b.expreference.length,
    },
    {
      title: "तारीख",
      dataIndex: "expdate",
      sorter: (a, b) => a.expdate.length - b.expdate.length,
    },
    {
      title: "रक्कम",
      dataIndex: "expamount",
      sorter: (a, b) => a.expamount.length - b.expamount.length,
    },
    {
      title: "वर्णन",
      dataIndex: "expdescription",
      sorter: (a, b) => a.expdescription.length - b.expdescription.length,
    },
    {
      title: "क्रिया",
      dataIndex: "actions",
      key: "actions",
      render: (_, record) => (
        <div className="action-table-data">
          <div className="edit-delete-action">
            <Link
              className="me-2 p-2 mb-0"
              data-bs-toggle="modal"
              data-bs-target="#AddExpense"
              onClick={() => openEditModal(record.expaid)}
            >
              <Edit className="feather-edit" />
            </Link>
            <Link
              className="me-3 confirm-text p-2 mb-0"
              to="#"
              onClick={() => showConfirmationAlert(record.expaid)}
            >
              <Trash2 className="feather-trash-2" />
            </Link>
          </div>
        </div>
      ),
    },
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
  );



  return (
    <div>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="add-item d-flex">
              <div className="page-title">
                <h4>Expenses List</h4>
                <h6>Manage YourExpenses List</h6>
              </div>
            </div>
            <ul className="table-top-head">
              <li>
                <OverlayTrigger placement="top" overlay={renderTooltip}>
                  <Link onClick={() => generatePDF(Expense)}>
                    <ImageWithBasePath
                      src="assets/img/icons/pdf.svg"
                      alt="img"
                    />
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
                  //className={data ? "active" : ""}
                  // onClick={() => {
                  //   dispatch(setToogleHeader(!data));
                  // }}
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
                data-bs-target="#AddExpense"
              >
                <PlusCircle className="me-2" />
                Add New Expenses
              </Link>
            </div>
            <div className="page-btn">
              <Link to={route.FinanceIndex} className="btn btn-secondary">
                <ArrowLeft className="me-2" />
                Back to Index
              </Link>
            </div>
          </div>
          {/* /product list */}
          <div className="card table-list-card">
            <div className="card-body">

              <div className="table-responsive">
                <Table columns={columns} dataSource={Expense} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <AddExpense EXPAID={selectedData.expaid} />

    </div>
  );
};

export default ExpensesList;
