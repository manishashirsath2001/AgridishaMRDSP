import React, { useState, useEffect } from 'react'
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import ImageWithBasePath from "../../core/img/imagewithbasebath";
import {
  ChevronUp, RotateCcw,
  Edit,
  Trash2,
} from "feather-icons-react/build/IconComponents";
import { setToogleHeader } from "../../core/redux/action";
import {
  PlusCircle,

} from "react-feather";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import Table from "../../core/pagination/datatable.jsx";
import AddHolidays from './AddHolidays.jsx';

// import EditHolidays from "../../core/modals/hrm/editholidays.jsx";
import { baseUrl } from "../../core/json/custom";
import { all_routes } from "../../Router/all_routes";
import axios from "axios";
import { getUserData } from '../../Context/UserData.js';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";

const Holidays = () => {
  const { userdetail } = getUserData();
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [holiday, setHoliday] = useState([]);
  const route = all_routes;
  const dispatch = useDispatch();
  const data = useSelector((state) => state.toggle_header);


  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };
  const [selectedData, setSelectedData] = useState({ haid: null });

  useEffect(() => {
    try {
      const payload = {
        "haid": "%",
        "companyid": userdetail?.companyID || "",
        "deptid": userdetail?.departmentID || "",
      }

      const headers = {
        "Content-Type": "application/json",
        Accept: "*/*",
      };

      axios({
        method: "POST",
        url: baseUrl.Url + "/backend/api/GET_HRM_Holiday",
        data: JSON.stringify(payload),
        headers: headers,
      })
        .then((response) => {
          if (response.status != 200) throw new Error("Failed to Fetching Data");
          const DATA = response.data;
          setHoliday(DATA);
        })

    } catch (error) {
      console.error("Error fetching Access Right Data:", error);
    }
  }, []);



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
          overlay={<Tooltip id="types-status">Name</Tooltip>}
        >
          <div className='text-center'>Name</div>
        </OverlayTrigger>
      ),
      dataIndex: "addholiday",
      sorter: (a, b) => a.addholiday.length - b.addholiday.length,
      // sorter: (a, b) => a.addholiday.localeCompare(b.addholiday),
    },
    {
      title: (
        <OverlayTrigger
          placement="top"
          overlay={<Tooltip id="types-status">date</Tooltip>}
        >
          <div className='text-center'>Date</div>
        </OverlayTrigger>
      ),
      dataIndex: "sdate",
      sorter: (a, b) => a.sdate.length - b.sdate.length,
      align: "center",
    },
    {
      title: (
        <OverlayTrigger
          placement="top"
          overlay={<Tooltip id="types-status">duration</Tooltip>}
        >
          <div className='text-center'>Duration</div>
        </OverlayTrigger>
      ),
      dataIndex: "nodays",
      sorter: (a, b) => a.nodays.length - b.nodays.length,
      // sorter: (a, b) => parseInt(a.nodays) - parseInt(b.nodays),
      width: 90,
      render: (text) => (
        <OverlayTrigger
          placement="top"
          overlay={<Tooltip id={`tooltip-${text}`}>{text}</Tooltip>}
        >
          <div style={{ textAlign: "right" }}>{text}</div>
        </OverlayTrigger>
      ),
    },
    {
      title: (
        <OverlayTrigger
          placement="top"
          overlay={<Tooltip id="types-status">Status</Tooltip>}
        >
          <div className='text-center'>Status</div>
        </OverlayTrigger>
      ),
      dataIndex: "hastatus",
      render: (text) => (
        <span className={`badge ${text == true
          ? "badge-linesuccess" : text == false
            ? "badge-linedanger" : "badge-warning"}`}>
          <Link to="#"> {text == true ? "Active" : text == false
            ? "Inactive" : "Unknown"}
          </Link>
        </span>

      ),
      sorter: (a, b) => a.hastatus.length - b.hastatus.length,
      align: "center",
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
                data-bs-target="#AddHolidays"
                onClick={() => openModal(record.haid)}
              >
                <Edit className="feather-edit" />
              </Link>
            </OverlayTrigger>
            <Link className="confirm-text p-2" to="#">
              <i
                data-feather="trash-2"

                onClick={() => showConfirmationAlert(record.haid)}
              ></i>
              <Trash2 className="feather-trash-2" />
            </Link>
          </div>
        </div>
      ),
    },
  ];

  const openModal = (haid) => {
    setSelectedData({ haid });
    // setModalShow(true);
  };
  const MySwal = withReactContent(Swal);
  const showConfirmationAlert = (haid) => {
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
        handleDelete(haid)
      } else {
        MySwal.close();
      }
    });
  };

  const handleDelete = async (haid) => {
    try {
      const payload = {
        "haid": haid,
        "companyid": userdetail?.companyID || "",
        "deptid": userdetail?.departmentID || "",
      }
      const headers = {
        "Content-Type": "application/json",
        Accept: "*/*",
      };

      axios({
        method: "POST",
        url: baseUrl.Url + "/backend/api/SP_DeleteHRMHoliday",
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
          "haid": "%",
          "companyid": userdetail?.companyID || "",
          "deptid": userdetail?.departmentID || "",
        };

        const headers = {
          "Content-Type": "application/json",
          Accept: "*/*",
        };

        axios({
          method: "POST",
          url: baseUrl.Url + "/backend/api/GET_HRM_Holiday",
          data: JSON.stringify(payload),
          headers: headers,
        })
          .then((response) => {
            const DATA = response.data;
            setHoliday(DATA);
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

  useEffect(() => {
    const handleShortcut = (e) => {
      if (e.ctrlKey && e.key === 'a') {
        e.preventDefault();
        navigate(route.AddHolidays);
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

  const generatePDF = (HolidayList) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    doc.setFontSize(12);
    doc.setFont("Helvetica", "bold");
    const title = "Holiday Report";
    const titleWidth = doc.getTextWidth(title);

    const borderMargin = 10;
    doc.rect(borderMargin, borderMargin, pageWidth - borderMargin * 2, pageHeight - borderMargin * 2);

    doc.text(title, (pageWidth - titleWidth) / 2, 20);
    doc.setLineWidth(0.5);
    doc.line((pageWidth - titleWidth) / 2, 22, (pageWidth + titleWidth) / 2, 22);

    doc.setFontSize(13);
    doc.setFont("Helvetica", "normal");
    let yPosition = 15;

    const tableColumn = ["Name", "Date", "Duration", "Status"];
    const tableRows = HolidayList.map((item) => [
      item.addholiday,
      item.sdate,
      item.nodays,
      item.hastatus ? "Active" : "Inactive",

    ]);

    autoTable(doc, {
      startY: yPosition + 10,
      head: [tableColumn],
      body: tableRows,
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
      const worksheet = workbook.addWorksheet("HRM Hoilday Report");

      const headingRow = worksheet.addRow(["HRM Hoilday Report"]);
      headingRow.getCell(1).font = { bold: true, size: 16 };
      headingRow.getCell(1).alignment = { horizontal: "center", vertical: "middle" };

      worksheet.mergeCells("A1:D1");

      const headers = ["Name", "Date", "Duration", "Status",];
      const headerRow = worksheet.addRow(headers);

      headerRow.eachCell((cell) => {
        cell.font = { bold: true, color: { argb: "FFFFFF" } };
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "808080" } };
        cell.alignment = { horizontal: "center", vertical: "middle" };
      });

      const columnWidths = [15, 20, 25, 30,]; // Adjust widths as needed
      columnWidths.forEach((width, index) => {
        worksheet.getColumn(index + 1).width = width;
      });

      holiday.forEach(({ addholiday, sdate, nodays, hastatus, }) => {
        const row = worksheet.addRow([addholiday, sdate, nodays, hastatus,]);
        row.eachCell((cell) => {
          cell.alignment = { horizontal: "center", vertical: "middle" };
        });
      });

      const buffer = await workbook.xlsx.writeBuffer();
      const data = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      saveAs(data, "HolidayReport.xlsx");

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
                <h4>Holiday</h4>
                <h6>Manage your Holiday</h6>
              </div>
            </div>
            <ul className="table-top-head">
              <li>
                <OverlayTrigger placement="top" overlay={renderTooltip}>
                  <Link onClick={() => generatePDF(holiday)}>
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
                to=""
                className="btn btn-added"
                data-bs-toggle="modal"
                data-bs-target="#AddHolidays"
              >
                <PlusCircle className="me-2" />
                Add New Holiday
              </Link>
            </div>
          </div>
          {/* /product list */}
          <div className="card table-list-card">
            <div className="card-body pb-0">
              <div className="table-top">
                <div className="input-blocks search-set mb-0">
                  <div className="search-input">
                    <Link to="#" className="btn btn-searchset">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={24}
                        height={24}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="feather feather-search"
                      >
                        <circle cx={11} cy={11} r={8} />
                        <line x1={21} y1={21} x2="16.65" y2="16.65" />
                      </svg>
                    </Link>
                    <div
                      id="DataTables_Table_0_filter"
                      className="dataTables_filter"
                    >
                      <label>
                        {" "}
                        <input
                          type="search"
                          className="form-control form-control-sm"
                          placeholder="Search"
                          aria-controls="DataTables_Table_0"
                          value={searchText}
                          onChange={handleSearch}
                        />
                      </label>
                    </div>
                  </div>
                </div>

              </div>

              {/* product list */}
              <div >
                <Table columns={columns} dataSource={holiday} />
              </div>
              {/* /product list   dataSource={filteredData} */}
            </div>
          </div>
        </div>
      </div>
      <AddHolidays HAID={selectedData.haid} />
      {/* <EditHolidays /> */}
    </div>
  );
};

export default Holidays;
