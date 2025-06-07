import React, { useEffect, useState } from "react";
import ImageWithBasePath from "../../core/img/imagewithbasebath";
import { useDispatch, useSelector } from "react-redux";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";
import { ChevronUp, RotateCcw } from "feather-icons-react/build/IconComponents";
import {
  Box,
  Filter,
  Layout,
  PlusCircle,
  Sliders,
  StopCircle,
  User,

} from "react-feather";
import Select from "react-select";
import { setToogleHeader } from "../../core/redux/action";
import AddLeaveEmployee from "../../core/modals/hrm/addleaveemployee";
import EditLeaveEmployee from "../../core/modals/hrm/editleaveemployee";
import Table from "../../core/pagination/datatable";
import { leavesEmployee } from "../../core/json/leavesemployee";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
// import * as XLSX from "xlsx";
import axios from "axios";
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { baseUrl } from "../../core/json/custom";
const LeavesEmployee = () => {
  const leavesEmployeedata = leavesEmployee;
  const MySwal = withReactContent(Swal);
  const [Customer, setCustomer] = useState([]);
  const [selectedData, setSelectedData] = useState({ elid: null });
  const showConfirmationAlert = () => {
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
        MySwal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          className: "btn btn-success",
          confirmButtonText: "OK",
          customClass: {
            confirmButton: "btn btn-success",
          },
        });
      } else {
        MySwal.close();
      }
    });
  };

  useEffect(() => {

    const fetchVendors1 = async () => {
      try {
        const payload =
        {
          "elid": "%",
          "companyid": "defaultCompanyID",
          "deptid": "defaultDeptID"
        };
        const headers = {
          "Content-Type": "application/json",
          Accept: "*/*",
        };
        const response = await axios.post(
          `${baseUrl.Url}/backend/api/GET_EmployeeLeavesDate`,
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

    fetchVendors1();

  }, []);

  const openModal = (elid) => {
    setSelectedData({ elid })
  }

  const columns = [

    {

      title: "Leaves  type ",
      dataIndex: "leaveType",
      sorter: (a, b) => a.leaveType.length - b.leaveType.length,
      // sorter: (a, b) => a.eldays.localeCompare(b.eldays)

    },
    // {
    //   title: "Type",
    //   dataIndex: "elleavetype",
    //   sorter: (a, b) => a.elleavetype.length - b.elleavetype.length,
    // },

    // {
    //   title: "Date",
    //   dataIndex: "elleavedate",
    //   sorter: (a, b) => a.elleavedate.length - b.elleavedate.length,
    //   align: "center",
    // },
    {
      title: "Day Type",
      dataIndex: "eldaytype",
      sorter: (a, b) => a.eldaytype.length - b.eldaytype.length,
    },
    // {
    //   title: "AppliedOn",
    //   dataIndex: "appliedOn",
    //   sorter: (a, b) => a.appliedOn.length - b.appliedOn.length,
    // },
    // {
    //   title: "Reason",
    //   dataIndex: "elreason",
    //   sorter: (a, b) => a.elreason.length - b.elreason.length,
    // },
    {
      title: "Start Date ",
      dataIndex: "elsdt",
      sorter: (a, b) => a.elsdt.length - b.elsdt.length,
      align: "center",
    },
    {
      title: "End  Date ",
      dataIndex: "eledt",
      sorter: (a, b) => a.eledt.length - b.eledt.length,
      align: "center",
    },
    {
      title: "Total Days  ",
      dataIndex: "eltdays",
      sorter: (a, b) => a.eltdays.length - b.eltdays.length,
    },
    // {
    //   title: "Leave type    ",
    //   dataIndex: "elmleavetype",
    //   sorter: (a, b) => a.elmleavetype.length - b.elmleavetype.length,
    // },
    {
      title: "Approval",
      dataIndex: "approval",
      // sorter: (a, b) => a.approval.length - b.approval.length,
      render: (text) => (
        <span
          className={`${text === "Applied" ? "badge-applied" : text === "Approved" ? "badge-approved" : "badge-reject"
            }`}
        >
          {text}
        </span>
      ),
    },

    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      align: "center",
      render: (_, record) => (
        <div className="action-table-data">
          <div className="edit-delete-action">

            <OverlayTrigger placement="top" overlay={renderEditTooltip}>
              <Link
                className="me-2 p-2" data-bs-toggle="modal" data-bs-target="#add-units" onClick={() => openModal(record.elid)} >
                <i data-feather="edit" className="feather-edit"></i>
              </Link>
            </OverlayTrigger>

            <OverlayTrigger placement="top" overlay={renderDeleteTooltip}>
              <Link className="confirm-text p-2" to="#">
                <i
                  data-feather="trash-2"
                  className="feather-trash-2"
                  onClick={() => showConfirmationAlert(record.elid)}
                ></i>
              </Link>
            </OverlayTrigger>
          </div>
        </div>
      ),
    },

  ];
  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };
  const [searchText, setSearchText] = useState("");
  const filteredData = leavesEmployeedata.filter((entry) => {
    return Object.keys(entry).some((key) => {
      return String(entry[key])
        .toLowerCase()
        .includes(searchText.toLowerCase());
    });
  });
  const dispatch = useDispatch();
  const data = useSelector((state) => state.toggle_header);

  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const toggleFilterVisibility = () => {
    setIsFilterVisible((prevVisibility) => !prevVisibility);
  };
  const [isLayoutVisible, setIsLayoutVisible] = useState(false);
  const handleLayoutClick = () => {
    setIsLayoutVisible(!isLayoutVisible);
  };
  const oldandlatestvalue = [
    { value: "date", label: "Sort by Date" },
    { value: "newest", label: "Newest" },
    { value: "oldest", label: "Oldest" },
  ];
  const leavetype = [
    { value: "Choose Type", label: "Choose Type" },
    { value: "Sick Leave", label: "Sick Leave" },
    { value: "Paternity", label: "Paternity" },
  ];
  const employeename = [
    { value: "Choose Employee", label: "Choose Employee" },
    { value: "Mitchum Daniel", label: "Mitchum Daniel" },
    { value: "Susan Lopez", label: "Susan Lopez" },
  ];
  const leavestatus = [
    { value: "Choose Status", label: "Choose Status" },
    { value: "Approved", label: "Approved" },
    { value: "Rejected", label: "Rejected" },
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

  const downloadExcel = async () => {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Employee Leaves (Report)");

      // **Main Heading Row**
      const headingRow = worksheet.addRow(["Employee Leaves (Report)"]);
      headingRow.getCell(1).font = { bold: true, size: 16 };
      headingRow.getCell(1).alignment = { horizontal: "center", vertical: "middle" };

      // Merge heading across all columns
      worksheet.mergeCells("A1:F1");

      // **Header Row**
      const headers = ["Day type", "Leave Type", "Start date ", "End Date", "Total Days", "Approval"];
      const headerRow = worksheet.addRow(headers);

      headerRow.eachCell((cell) => {
        cell.font = { bold: true, color: { argb: "FFFFFF" } };
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "808080" } };
        cell.alignment = { horizontal: "center", vertical: "middle" };
      });

      // **Setting Column Widths**
      const columnWidths = [15, 20, 25, 30, 18, 18]; // Adjust widths as needed
      columnWidths.forEach((width, index) => {
        worksheet.getColumn(index + 1).width = width;
      });

      // **Adding Data Rows**
      Customer.forEach(({ eldaytype, leaveType, elsdt, eledt, eltdays, approval }) => {
        const row = worksheet.addRow([eldaytype, leaveType, elsdt, eledt, eltdays, approval]);
        row.eachCell((cell) => {
          cell.alignment = { horizontal: "center", vertical: "middle" };
        });
      });

      // **Generate and Save Excel File**
      const buffer = await workbook.xlsx.writeBuffer();
      const data = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      saveAs(data, "Employee_Leaves_(Report).xlsx");

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
    const title = "Employee Leaves  Report";
    const titleWidth = doc.getTextWidth(title);

    const borderMargin = 10;
    doc.rect(borderMargin, borderMargin, pageWidth - borderMargin * 2, pageHeight - borderMargin * 2);

    doc.text(title, (pageWidth - titleWidth) / 2, 20);
    doc.setLineWidth(0.5);
    doc.line((pageWidth - titleWidth) / 2, 22, (pageWidth + titleWidth) / 2, 22);

    doc.setFontSize(13);
    doc.setFont("Helvetica", "normal");
    let yPosition = 15;


    const tableColumn = ["Day type", "Leave Type", "Start date ", "End Date", "Total Days", "Approval"];

    // Table rows
    const tableRows = Customer.map(item => [
      item.eldaytype,
      item.leaveType,
      item.elsdt,
      item.eledt,
      item.eltdays,
      item.approval
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
    doc.save("Employee Leaves (Report).pdf");
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
                    <ImageWithBasePath
                      src="assets/img/icons/pdf.svg"
                      alt="img"
                    />
                  </Link>
                </OverlayTrigger>
              </li>
              <li>
                <OverlayTrigger placement="top" overlay={renderExcelTooltip}>
                  <Link data-bs-toggle="tooltip" data-bs-placement="top" onClick={downloadExcel}>
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
                data-bs-target="#add-units"
              >
                <PlusCircle className="me-2" />
                Apply Leave
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
                      aria-controls="DataTables_Table_0"
                      value={searchText}
                      onChange={handleSearch}
                    />
                    <Link to className="btn btn-searchset">
                      <i data-feather="search" className="feather-search" />
                    </Link>
                  </div>
                </div>
                <div className="search-path">
                  <div className="d-flex align-items-center">
                    <Link
                      className={`btn btn-filter ${isFilterVisible ? "setclose" : ""
                        }`}
                      id="filter_search"
                    >
                      <Filter
                        className="filter-icon"
                        onClick={toggleFilterVisibility}
                      />
                      <span onClick={toggleFilterVisibility}>
                        <ImageWithBasePath
                          src="assets/img/icons/closes.svg"
                          alt="img"
                        />
                      </span>
                    </Link>
                    <div
                      className={`layout-hide-box ${isLayoutVisible ? "layout-show-box" : "layout-hide-box"
                        }`}
                    >
                      <Link
                        to="#"
                        className="me-3 layout-box"
                        onClick={handleLayoutClick}
                      >
                        <Layout />
                      </Link>
                      {isLayoutVisible && (
                        <div className="layout-drop-item card">
                          <div className="drop-item-head">
                            <h5>Want to manage datatable?</h5>
                            <p>
                              Please drag and drop your column to reorder your
                              table and enable see option as you want.
                            </p>
                          </div>
                          <ul>
                            <li>
                              <div className="status-toggle modal-status d-flex justify-content-between align-items-center">
                                <span className="status-label">
                                  <i
                                    data-feather="menu"
                                    className="feather-menu"
                                  />
                                  Shop
                                </span>
                                <input
                                  type="checkbox"
                                  id="option1"
                                  className="check"
                                  defaultChecked="true"
                                />
                                <label
                                  htmlFor="option1"
                                  className="checktoggle"
                                >
                                  {" "}
                                </label>
                              </div>
                            </li>
                            <li>
                              <div className="status-toggle modal-status d-flex justify-content-between align-items-center">
                                <span className="status-label">
                                  <i
                                    data-feather="menu"
                                    className="feather-menu"
                                  />
                                  Product
                                </span>
                                <input
                                  type="checkbox"
                                  id="option2"
                                  className="check"
                                  defaultChecked="true"
                                />
                                <label
                                  htmlFor="option2"
                                  className="checktoggle"
                                >
                                  {" "}
                                </label>
                              </div>
                            </li>
                            <li>
                              <div className="status-toggle modal-status d-flex justify-content-between align-items-center">
                                <span className="status-label">
                                  <i
                                    data-feather="menu"
                                    className="feather-menu"
                                  />
                                  Reference No
                                </span>
                                <input
                                  type="checkbox"
                                  id="option3"
                                  className="check"
                                  defaultChecked="true"
                                />
                                <label
                                  htmlFor="option3"
                                  className="checktoggle"
                                >
                                  {" "}
                                </label>
                              </div>
                            </li>
                            <li>
                              <div className="status-toggle modal-status d-flex justify-content-between align-items-center">
                                <span className="status-label">
                                  <i
                                    data-feather="menu"
                                    className="feather-menu"
                                  />
                                  Date
                                </span>
                                <input
                                  type="checkbox"
                                  id="option4"
                                  className="check"
                                  defaultChecked="true"
                                />
                                <label
                                  htmlFor="option4"
                                  className="checktoggle"
                                >
                                  {" "}
                                </label>
                              </div>
                            </li>
                            <li>
                              <div className="status-toggle modal-status d-flex justify-content-between align-items-center">
                                <span className="status-label">
                                  <i
                                    data-feather="menu"
                                    className="feather-menu"
                                  />
                                  Responsible Person
                                </span>
                                <input
                                  type="checkbox"
                                  id="option5"
                                  className="check"
                                  defaultChecked="true"
                                />
                                <label
                                  htmlFor="option5"
                                  className="checktoggle"
                                >
                                  {" "}
                                </label>
                              </div>
                            </li>
                            <li>
                              <div className="status-toggle modal-status d-flex justify-content-between align-items-center">
                                <span className="status-label">
                                  <i
                                    data-feather="menu"
                                    className="feather-menu"
                                  />
                                  Notes
                                </span>
                                <input
                                  type="checkbox"
                                  id="option6"
                                  className="check"
                                  defaultChecked="true"
                                />
                                <label
                                  htmlFor="option6"
                                  className="checktoggle"
                                >
                                  {" "}
                                </label>
                              </div>
                            </li>
                            <li>
                              <div className="status-toggle modal-status d-flex justify-content-between align-items-center">
                                <span className="status-label">
                                  <i
                                    data-feather="menu"
                                    className="feather-menu"
                                  />
                                  Quantity
                                </span>
                                <input
                                  type="checkbox"
                                  id="option7"
                                  className="check"
                                  defaultChecked="true"
                                />
                                <label
                                  htmlFor="option7"
                                  className="checktoggle"
                                >
                                  {" "}
                                </label>
                              </div>
                            </li>
                            <li>
                              <div className="status-toggle modal-status d-flex justify-content-between align-items-center">
                                <span className="status-label">
                                  <i
                                    data-feather="menu"
                                    className="feather-menu"
                                  />
                                  Actions
                                </span>
                                <input
                                  type="checkbox"
                                  id="option8"
                                  className="check"
                                  defaultChecked="true"
                                />
                                <label
                                  htmlFor="option8"
                                  className="checktoggle"
                                >
                                  {" "}
                                </label>
                              </div>
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="form-sort">
                  <Sliders className="info-img" />
                  <Select
                    className="img-select"
                    classNamePrefix="react-select"
                    options={oldandlatestvalue}
                    placeholder="Newest"
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

                        <Select
                          className="img-select"
                          classNamePrefix="react-select"
                          options={leavetype}
                          placeholder="Newest"
                        />
                      </div>
                    </div>
                    <div className="col-lg-3 col-sm-6 col-12">
                      <div className="input-blocks">
                        <User className="info-img" />

                        <Select
                          className="img-select"
                          classNamePrefix="react-select"
                          options={employeename}
                          placeholder="Newest"
                        />
                      </div>
                    </div>
                    <div className="col-lg-3 col-sm-6 col-12">
                      <div className="input-blocks">
                        <StopCircle className="info-img" />

                        <Select
                          className="img-select"
                          classNamePrefix="react-select"
                          options={leavestatus}
                          placeholder="Newest"
                        />
                      </div>
                    </div>
                    <div className="col-lg-3 col-sm-6 col-12 ms-auto">
                      <div className="input-blocks">
                        <Link className="btn btn-filters ms-auto">
                          {" "}
                          <i
                            data-feather="search"
                            className="feather-search"
                          />{" "}
                          Search{" "}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* /Filter */}
              <div className="table-responsive">
                <Table columns={columns} dataSource={filteredData} />
              </div>
            </div>
          </div>
          {/* /product list */}
        </div>
      </div>
      <AddLeaveEmployee />
      <EditLeaveEmployee ELID={selectedData.elid} />
    </div>
  );
};

export default LeavesEmployee;
