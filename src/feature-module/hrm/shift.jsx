import React, { useState, useEffect } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import ImageWithBasePath from "../../core/img/imagewithbasebath";
import {
  ChevronUp,
  PlusCircle,
  RotateCcw,
  Edit,
  ArrowLeft
} from "feather-icons-react/build/IconComponents";
import { useDispatch, useSelector } from "react-redux";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import Table from "../../core/pagination/datatable.jsx";
import { setToogleHeader } from "../../core/redux/action.jsx";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "../../core/json/custom";
import Addshift from "./Addshift.jsx";
import { all_routes } from "../../Router/all_routes";
import moment from "moment";
import { getUserData } from "../../Context/UserData.js";
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";
const Shift = () => {
  const { userdetail } = getUserData();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const route = all_routes;
  const data = useSelector((state) => state.toggle_header);
  const [shift, setShift] = useState([]);
  const [selectedData, setSelectedData] = useState({ shid: null });

  useEffect(() => {
    try {
      const payload = {
        "shid": "%",
        "companyid": userdetail?.companyID || "",
        "deptid": userdetail?.departmentID || "",
      }

      const headers = {
        "Content-Type": "application/json",
        Accept: "*/*",
      };

      axios({
        method: "POST",
        url: baseUrl.Url + "/backend/api/GET_HRMShiftInfo",
        data: JSON.stringify(payload),
        headers: headers,
      })
        .then((response) => {
          if (response.status != 200) throw new Error("Failed to Fetching Data");
          const DATA = response.data;
          setShift(DATA);
        })

    } catch (error) {
      console.error("Error fetching Access Right Data:", error);
    }
  }, []);



  const handleDelete = async (shid) => {
    try {
      const payload = {
        "shid": shid,
        "companyid": userdetail?.companyID || "",
        "deptid": userdetail?.departmentID || "",
      }
      const headers = {
        "Content-Type": "application/json",
        Accept: "*/*",
      };

      axios({
        method: "POST",
        url: baseUrl.Url + "/backend/api/SP_DeleteHRMShiftInfo",
        data: JSON.stringify(payload),
        headers: headers,
      })

      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Your file has been deleted.",
        confirmButtonText: "OK",
      });
      try {

        const payload = {
          "shid": "%",
          "companyid": userdetail?.companyID || "",
          "deptid": userdetail?.departmentID || "",
        };

        const headers = {
          "Content-Type": "application/json",
          Accept: "*/*",
        };

        axios({
          method: "POST",
          url: baseUrl.Url + "/backend/api/GET_HRMShiftInfo",
          data: JSON.stringify(payload),
          headers: headers,
        })
          .then((response) => {
            const DATA = response.data;
            setShift(DATA);
          });

      } catch (error) {
        console.error('get data Error:', error);
      }


    } catch (error) {
      console.error("Submission Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to save data. Please try again.",
      });
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
  const columns = [
    {
      title: (
        <OverlayTrigger
          placement="top"
          overlay={<Tooltip id="BillNo-tooltip">Shift Name</Tooltip>}
        >
          <span>Shift Name</span>
        </OverlayTrigger>
      ),
      dataIndex: "shname",
      sorter: (a, b) => a.shname.length - b.shname.length,
      width: 50, // Fixed width
      render: (text) => (
        <OverlayTrigger
          placement="top"
          overlay={<Tooltip id="BillNo-cell-tooltip">{text || "No data"}</Tooltip>}
        >
          <span style={{ textAlign: "left", display: "block" }}>{text}</span>
        </OverlayTrigger>
      ),
    },

    {
      title: (
        <OverlayTrigger
          placement="top"
          overlay={<Tooltip id="Time-tooltip">Time</Tooltip>}
        >
          <span>Time</span>
        </OverlayTrigger>
      ),
      dataIndex: "shfromtime",
      sorter: (a, b) => a.shfromtime.length - b.shfromtime.length,
      width: 150, // Fixed width
      // render: (text) => (
      //   <OverlayTrigger
      //     placement="top"
      //     overlay={<Tooltip id="shfromtime-cell-tooltip">{text || "No data"}</Tooltip>}
      //   >
      //     <span style={{ textAlign: "left", display: "block" }}>{text}</span>
      //   </OverlayTrigger>
      // ),
      render: (text) => {
        if (!text) return "N/A";

        const formattedTime = moment(text, "HH:mm:ss").isValid()
          ? moment(text, "HH:mm:ss").format("hh:mm A")
          : "Invalid Date";

        return formattedTime;
      },
    },
    {
      title: (
        <OverlayTrigger
          placement="top"
          overlay={<Tooltip id="types-status">Week Off</Tooltip>}
        >
          <div className='text-center'>Week Off</div>
        </OverlayTrigger>
      ),
      dataIndex: "weekoff",
      sorter: (a, b) => a.weekoff.length - b.weekoff.length,
    },
    {
      title: (
        <OverlayTrigger
          placement="top"
          overlay={<Tooltip id="types-status">Status</Tooltip>}
        >
          <div>Status</div>
        </OverlayTrigger>
      ),
      dataIndex: "shstatus",
      render: (text) => (
        <span className={`badge ${text == 1
          ? "badge-linesuccess" : text == 0
            ? "badge-linedanger" : "badge-warning"}`}>
          <Link to="#"> {text == 1 ? "Active" : text == 0
            ? "Inactive" : "Unknown"}
          </Link>
        </span>

      ),
      sorter: (a, b) => a.shstatus.length - b.shstatus.length,
      width: 50,
    },
    {
      title: (
        <OverlayTrigger
          placement="top"
          overlay={<Tooltip id="types-status">Actions</Tooltip>}
        >
          <div className='text-center'>Actions</div>
        </OverlayTrigger>
      ),
      dataIndex: "actions",
      key: "actions",
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
                data-bs-target="#Addshift"
                onClick={() => openModal(record.shid)}
              >
                <Edit className="feather-edit" />
              </Link>

            </OverlayTrigger>
            <Link className="confirm-text p-2" to="#">
              <i
                data-feather="trash-2"
                className="feather-trash-2"
                onClick={() => showConfirmationAlert(record.shid)}
              ></i>
            </Link>
          </div>
        </div>
      ),
    },
  ];
  useEffect(() => {
    const handleShortcut = (e) => {
      if (e.ctrlKey && e.key === 'a') {
        e.preventDefault();
        navigate(route.Addshift);
      }
      if (e.ctrlKey && e.key === 'e') {
        e.preventDefault();
        navigate(route.MasterIndex);
      }
    };

    window.addEventListener('keydown', handleShortcut);

    return () => {
      window.removeEventListener('keydown', handleShortcut);
    };
  }, [navigate]);

  const openModal = (shid) => {
    setSelectedData({ shid });
    // setModalShow(true);
  };

  const MySwal = withReactContent(Swal);
  const showConfirmationAlert = (shid) => {
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
        handleDelete(shid)
      } else {
        MySwal.close();
      }
    });
  };

  const generatePDF = (ShiftList) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    doc.setFontSize(12);
    doc.setFont("Helvetica", "bold");
    const title = "Sale challan Report";
    const titleWidth = doc.getTextWidth(title);

    const borderMargin = 10;
    doc.rect(borderMargin, borderMargin, pageWidth - borderMargin * 2, pageHeight - borderMargin * 2);

    doc.text(title, (pageWidth - titleWidth) / 2, 20);
    doc.setLineWidth(0.5);
    doc.line((pageWidth - titleWidth) / 2, 22, (pageWidth + titleWidth) / 2, 22);

    doc.setFontSize(13);
    doc.setFont("Helvetica", "normal");
    let yPosition = 15;

    const tableColumn = ["Shift Name", "Time", "Week Off", "Status"];
    const tableRows = ShiftList.map((item) => [
      item.shname,
      item.shfromtime,
      item.weekoff,
      item.shstatus ? "Active" : "Inactive",
    ]);

    autoTable(doc, {
      startY: yPosition + 10,
      head: [tableColumn],
      body: tableRows,
      theme: 'grid',
      styles: { fontSize: 10, halign: "center", lineColor: [0, 0, 0], lineWidth: 0.20 },
      headStyles: { fillColor: [169, 169, 169], textColor: 0, fontStyle: "bold" },
      bodyStyles: { textColor: 0 }, // Black text in table
    });
    doc.save("Report.pdf");
  };


  const exportToExcel = async () => {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("HRM Shift Report");

      const headingRow = worksheet.addRow(["HRM Shift Report"]);
      headingRow.getCell(1).font = { bold: true, size: 16 };
      headingRow.getCell(1).alignment = { horizontal: "center", vertical: "middle" };

      worksheet.mergeCells("A1:D1");

      const headers = ["Shift Name", "Time", "Week Off", "Status"];
      const headerRow = worksheet.addRow(headers);

      headerRow.eachCell((cell) => {
        cell.font = { bold: true, color: { argb: "FFFFFF" } };
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "808080" } };
        cell.alignment = { horizontal: "center", vertical: "middle" };
      });

      const columnWidths = [15, 20, 25, 18]; // Adjust widths as needed
      columnWidths.forEach((width, index) => {
        worksheet.getColumn(index + 1).width = width;
      });

      shift.forEach(({ shname, shfromtime, weekoff, shstatus }) => {
        const row = worksheet.addRow([shname, shfromtime, weekoff, shstatus]);
        row.eachCell((cell) => {
          cell.alignment = { horizontal: "center", vertical: "middle" };
        });
      });

      const buffer = await workbook.xlsx.writeBuffer();
      const data = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      saveAs(data, "ShiftReport.xlsx");

    } catch (error) {
      console.error("Error generating the Excel file:", error);
    }
  };

  return (
    <div>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="add-item d-flex">
              <div className="page-title">
                <h4>Shift</h4>
                <h6>Manage your employees shift</h6>
              </div>
            </div>
            <ul className="table-top-head">
              <li>
                <OverlayTrigger placement="top" overlay={renderTooltip}>
                  <Link onClick={() => generatePDF(shift)}>
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
                data-bs-target="#Addshift"
              >
                <PlusCircle className="me-2" />
                Add New Shift
              </Link>
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
              </div>
              <div >
                <Table columns={columns} dataSource={shift} />
              </div>
            </div>
          </div>
          {/* /product list */}
        </div>
      </div>
      <Addshift SHID={selectedData.shid} />

    </div>
  );
};

export default Shift;
