import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { all_routes } from "../../Router/all_routes";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ImageWithBasePath from "../../core/img/imagewithbasebath";
import {
    Edit,
    Grid,
    List,
    MoreVertical,
    PlusCircle,
    RotateCcw,
    Trash2,
} from "feather-icons-react/build/IconComponents";
import { setToogleHeader } from "../../core/redux/action";
import {
    ChevronUp,
    Filter,
    Sliders,
    StopCircle,
    User,
    Users,
} from "react-feather";
import Select from "react-select";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { baseUrl } from "../../core/json/custom";
import axios from "axios";
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

import { saveAs } from 'file-saver';
import ExcelJS from "exceljs";


const EmployeeMaster = () => {
    const route = all_routes;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const data = useSelector((state) => state.toggle_header);
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const toggleFilterVisibility = () => {
        setIsFilterVisible((prevVisibility) => !prevVisibility);
    };

    // const oldandlatestvalue = [
    //   { value: "date", label: "Sort by Date" },
    //   { value: "newest", label: "Newest" },
    //   { value: "oldest", label: "Oldest" },
    // ];
    // const status = [
    //   { value: "Choose Status", label: "Choose Status" },
    //   { value: "Active", label: "Active" },
    //   { value: "Inactive", label: "Inactive" },
    // ];

    // const names = [
    //   { value: "Choose Name", label: "Choose Name" },
    //   { value: "Mitchum Daniel", label: "Mitchum Daniel" },
    //   { value: "Susan Lopez", label: "Susan Lopez" },
    //   { value: "Robert Grossman", label: "Robert Grossman" },
    //   { value: "Janet Hembre", label: "Janet Hembre" },
    // ];

    // const [empstatus, setEmpStatus] = useState(true);
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
    const MySwal = withReactContent(Swal);
    const showConfirmationAlert = (empid) => {
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
                OndeleteEmployee(empid);
            } else {
                MySwal.close();
            }
        });
    };


    const [employees, setEmployees] = useState([]); // State to store employee data

    useEffect(() => {
        try {
            const payload = {

                "keyword": "%",
                "empid": "%",
                "companyid": "",
                "deptid": ""

            }
            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            axios({
                method: "POST",
                url: baseUrl.Url + "/backend/api/GET_HRMEmployees",
                data: JSON.stringify(payload),
                headers: headers,
            })
                .then((response) => {
                    if (response.status != 200) throw new Error("Failed to Fetching Data");
                    const DATA = response.data;
                    setEmployees(DATA);
                })

        } catch (error) {
            console.error("Error fetching Access Right Data:", error);
        }
    }, []);


    const onEditClick = (empid) => {
        navigate(route.addemployee, { state: { EMPID: empid } });
    };



    const getImageUrl = (imageName) => {
        const imageUrl = `${baseUrl.Url}/backend/api/ProfileUpload/Upload/${imageName}`;
        console.log("Generated Image URL:", imageUrl); // Log the generated URL
        return imageUrl;
    };



    // const employees = [
    //   {
    //     id: "POS001",
    //     name: "Mitchum Daniel",
    //     role: "Designer",
    //     joined: "23 Jul 2023",
    //     department: "UI/UX",
    //     status: "Active",
    //     image: "assets/img/users/user-01.jpg"
    //   },
    //   {
    //     id: "POS002",
    //     name: "Susan Lopez",
    //     role: "Curator",
    //     joined: "30 May 2023",
    //     department: "HR",
    //     status: "Active",
    //     image: "assets/img/users/user-02.jpg"
    //   },
    //   {
    //     id: "POS003",
    //     name: "Robert Grossman",
    //     role: "System Administrator",
    //     joined: "14 Aug 2023",
    //     department: "Admin",
    //     status: "Inactive",
    //     image: "assets/img/users/user-03.jpg"
    //   },
    //   {
    //     id: "POS004",
    //     name: "Janet Hembre",
    //     role: "Administrative Officer",
    //     joined: "17 Jun 2023",
    //     department: "Admin",
    //     status: "Active",
    //     image: "assets/img/users/user-06.jpg"
    //   },
    //   {
    //     id: "POS005",
    //     name: "Russell Belle",
    //     role: "Technician",
    //     joined: "16 Jan 2014",
    //     department: "Technical",
    //     status: "Active",
    //     image: "assets/img/users/user-04.jpg"
    //   },
    //   {
    //     id: "POS006",
    //     name: "Edward K. Muniz",
    //     role: "Office Support Secretary",
    //     joined: "07 Feb 2017",
    //     department: "Support",
    //     status: "Inactive",
    //     image: "assets/img/users/user-05.jpg"
    //   }
    // ];

    const status = [
        { value: "Choose Status", label: "Choose Status" },
        { value: "Active", label: "Active" },
        { value: "Inactive", label: "Inactive" },
    ];


    const OndeleteEmployee = async (empid) => {
        try {
            const payload = {
                "empid": empid,
                "companyid": "",
                "deptid": "",

            }
            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            axios({
                method: "POST",
                url: baseUrl.Url + "/backend/api/SP_DeleteHRMEmployees",
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
                            "empid": "%",
                            "companyid": "",
                            "deptid": ""

                        }
                        const headers = {
                            "Content-Type": "application/json",
                            Accept: "*/*",
                        };

                        axios({
                            method: "POST",
                            url: baseUrl.Url + "/backend/api/GET_HRMEmployees",
                            data: JSON.stringify(payload),
                            headers: headers,
                        })
                            .then((response) => {
                                if (response.status != 200) throw new Error("Failed to Fetching Data");
                                const DATA = response.data;
                                setEmployees(DATA);
                            })

                    } catch (error) {
                        console.error("Error fetching Access Right Data:", error);
                    }
                })

        } catch (error) {
            console.error("Error fetching Access Right Data:", error);
        }

    }




    const generateEmployeePDF = (employees) => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        doc.setFontSize(12);
        doc.setFont("Helvetica", "bold");
        const title = "Employee Report";
        const titleWidth = doc.getTextWidth(title);

        const borderMargin = 10;
        doc.rect(borderMargin, borderMargin, pageWidth - borderMargin * 2, pageHeight - borderMargin * 2);

        doc.text(title, (pageWidth - titleWidth) / 2, 20);
        doc.setLineWidth(0.5);
        doc.line((pageWidth - titleWidth) / 2, 22, (pageWidth + titleWidth) / 2, 22);

        doc.setFontSize(13);
        doc.setFont("Helvetica", "normal");
        let yPosition = 30;

        const tableColumn = ["Emp ID", "Employee Name", "Department", "Join Date", "Status"];
        const tableRows = employees.map((employee) => [
            employee.empcode,
            employee.empname,
            employee.dname,
            employee.empjoindate,
            employee.empstatus,
        ]);

        // Add employee data to the PDF table
        autoTable(doc, {
            startY: yPosition + 10,
            head: [tableColumn],
            body: tableRows,
            theme: 'grid',
            styles: { fontSize: 10, halign: "center", lineColor: [0, 0, 0], lineWidth: 0.20 },
            headStyles: { fillColor: [169, 169, 169], textColor: 0, fontStyle: "bold" },
            bodyStyles: { textColor: 0 },
        });

        // Optionally add employee images (if available)
        employees.forEach((employee, index) => {
            if (employee.image) {
                const imageUrl = employee.image;
                const xPosition = 20;
                const yPositionImage = 50 + (index * 60); // Adjust the Y-position for each image
                doc.addImage(imageUrl, 'JPEG', xPosition, yPositionImage, 30, 30); // Adjust image size if necessary
            }
        });

        // Save the generated PDF
        doc.save("Employee_Report.pdf");
    };



    const exportEmployeeToExcel = async () => {
        try {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("Employee Report");

            // **Main Heading Row**
            const headingRow = worksheet.addRow(["Employee Report"]);
            headingRow.getCell(1).font = { bold: true, size: 16 };
            headingRow.getCell(1).alignment = { horizontal: "center", vertical: "middle" };

            // Merge heading across all columns
            worksheet.mergeCells("A1:E1"); // Update the range to E1

            // **Header Row**
            const headers = ["Emp ID", "Name", "Department", "Join Date", "Status"]; // Removed "Actions"
            const headerRow = worksheet.addRow(headers);

            headerRow.eachCell((cell) => {
                cell.font = { bold: true, color: { argb: "FFFFFF" } };
                cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "808080" } };
                cell.alignment = { horizontal: "center", vertical: "middle" };
            });

            // **Setting Column Widths**
            const columnWidths = [15, 30, 20, 25, 15]; // Adjusted for 5 columns
            columnWidths.forEach((width, index) => {
                worksheet.getColumn(index + 1).width = width;
            });

            // **Adding Data Rows**
            employees.forEach(({ empcode, empname, dname, empjoindate, empstatus }) => {
                const row = worksheet.addRow([
                    empcode, empname, dname, empjoindate, empstatus // No "Edit/Delete"
                ]);
                row.eachCell((cell) => {
                    cell.alignment = { horizontal: "center", vertical: "middle" };
                });
            });

            // **Generate and Save Excel File**
            const buffer = await workbook.xlsx.writeBuffer();
            const data = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
            saveAs(data, "EmployeeReport.xlsx");

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
                                <h4>Employees</h4>
                                <h6>Manage your employees</h6>
                            </div>
                        </div>
                        <ul className="table-top-head">
                            <li>
                                <OverlayTrigger placement="top" overlay={renderTooltip}>
                                    <Link onClick={() => generateEmployeePDF(employees)}>
                                        <ImageWithBasePath
                                            src="assets/img/icons/pdf.svg"
                                            alt="img"
                                        />
                                    </Link>
                                </OverlayTrigger>
                            </li>
                            <li>
                                <OverlayTrigger placement="top" overlay={renderExcelTooltip}>
                                    <Link data-bs-toggle="tooltip" data-bs-placement="top" onClick={() => exportEmployeeToExcel(employees)}>
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
                            <Link to={route.addemployee} className="btn btn-added">
                                <PlusCircle className="me-2" />
                                Add New Employee
                            </Link>
                        </div>
                    </div>
                    {/* /product list */}
                    <div className="card">
                        <div className="card-body pb-0">
                            <div className="table-top table-top-two table-top-new">
                                <div className="search-set mb-0">
                                    <div className="total-employees">
                                        <h6>
                                            <Users />
                                            Total Employees <span>21</span>
                                        </h6>
                                    </div>
                                    <div className="search-input">
                                        <Link to="" className="btn btn-searchset">
                                            <i data-feather="search" className="feather-search" />
                                        </Link>
                                        <input type="search" className="form-control" />
                                    </div>
                                </div>
                                <div className="search-path d-flex align-items-center search-path-new">
                                    <div className="d-flex">
                                        <Link className="btn btn-filter" id="filter_search">
                                            <Filter
                                                className="filter-icon"
                                                onClick={toggleFilterVisibility}
                                            />
                                            <span>
                                                <ImageWithBasePath
                                                    src="assets/img/icons/closes.svg"
                                                    alt="img"
                                                />
                                            </span>
                                        </Link>
                                        <Link to={route.employeelist} className="btn-list">
                                            <List />
                                        </Link>
                                        <Link to={route.employeegrid} className="btn-grid active">
                                            <Grid />
                                        </Link>
                                    </div>
                                    <div className="form-sort">
                                        <Sliders className="info-img" />
                                        <Select
                                            className="img-select"
                                            classNamePrefix="react-select"
                                            // options={oldandlatestvalue}
                                            placeholder="Newest"
                                        />
                                    </div>
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
                                                <User className="info-img" />
                                                <Select
                                                    className="img-select"
                                                    classNamePrefix="react-select"
                                                    // options={names}
                                                    placeholder="Choose Name"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-lg-3 col-sm-6 col-12">
                                            <div className="input-blocks">
                                                <StopCircle className="info-img" />

                                                <Select
                                                    className="img-select"
                                                    classNamePrefix="react-select"
                                                    options={status}
                                                    placeholder="Choose Status"
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
                        </div>
                    </div>
                    {/* /product list */}
                    {/* <div className="employee-grid-widget">
            <div className="row">
              <div className="col-xxl-3 col-xl-4 col-lg-6 col-md-6">
                <div className="employee-grid-profile">
                  <div className="profile-head">
                    <label className="checkboxs">
                      <input type="checkbox" />
                      <span className="checkmarks" />
                    </label>
                    <div className="profile-head-action">
                      <span className="badge badge-linesuccess text-center w-auto me-1">
                        Active
                      </span>
                      <div className="dropdown profile-action">
                        <Link
                          to="#"
                          className="action-icon dropdown-toggle"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          <MoreVertical />
                        </Link>
                        <ul className="dropdown-menu">
                          <li>
                            <Link
                              to={route.editemployee}
                              className="dropdown-item"
                            >
                              <Edit className="info-img" />
                              Edit
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="#"
                              className="dropdown-item confirm-text mb-0"
                              onClick={showConfirmationAlert}
                            >
                              <Trash2 className="info-img" />
                              Delete
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="profile-info">
                    <div className="profile-pic active-profile">
                      <ImageWithBasePath
                        src="assets/img/users/user-01.jpg"
                        alt=""
                      />
                    </div>
                    <h5>EMP ID : POS001</h5>
                    <h4>Mitchum Daniel</h4>
                    <span>Designer</span>
                  </div>
                  <ul className="department">
                    <li>
                      Joined
                      <span>23 Jul 2023</span>
                    </li>
                    <li>
                      Department
                      <span>UI/UX</span>
                    </li>
                  </ul>

                </div>
              </div>
              <div className="col-xxl-3 col-xl-4 col-lg-6 col-md-6">
                <div className="employee-grid-profile">
                  <div className="profile-head">
                    <label className="checkboxs">
                      <input type="checkbox" />
                      <span className="checkmarks" />
                    </label>
                    <div className="profile-head-action">
                      <span className="badge badge-linesuccess text-center w-auto me-1">
                        Active
                      </span>
                      <div className="dropdown profile-action">
                        <Link
                          to="#"
                          className="action-icon dropdown-toggle"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          <MoreVertical />{" "}
                        </Link>
                        <ul className="dropdown-menu">
                          <li>
                            <Link
                              to={route.editemployee}
                              className="dropdown-item"
                            >
                              <Edit className="info-img" />
                              Edit
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="#"
                              className="dropdown-item confirm-text mb-0"
                              onClick={showConfirmationAlert}
                            >
                              <Trash2 className="info-img" />
                              Delete
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="profile-info">
                    <div className="profile-pic active-profile">
                      <ImageWithBasePath
                        src="assets/img/users/user-02.jpg"
                        alt=""
                      />
                    </div>
                    <h5>EMP ID : POS002</h5>
                    <h4>Susan Lopez</h4>
                    <span>Curator</span>
                  </div>
                  <ul className="department">
                    <li>
                      Joined
                      <span>30 May 2023</span>
                    </li>
                    <li>
                      Department
                      <span>HR</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-xxl-3 col-xl-4 col-lg-6 col-md-6">
                <div className="employee-grid-profile">
                  <div className="profile-head">
                    <label className="checkboxs">
                      <input type="checkbox" />
                      <span className="checkmarks" />
                    </label>
                    <div className="profile-head-action">
                      <span className="badge badge-linedanger text-center w-auto me-1">
                        Inactive
                      </span>
                      <div className="dropdown profile-action">
                        <Link
                          to="#"
                          className="action-icon dropdown-toggle"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          <MoreVertical />{" "}
                        </Link>
                        <ul className="dropdown-menu">
                          <li>
                            <Link
                              to={route.editemployee}
                              className="dropdown-item"
                            >
                              <Edit className="info-img" />
                              Edit
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="#"
                              className="dropdown-item confirm-text mb-0"
                              onClick={showConfirmationAlert}
                            >
                              <Trash2 className="info-img" />
                              Delete
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="profile-info">
                    <div className="profile-pic">
                      <ImageWithBasePath
                        src="assets/img/users/user-03.jpg"
                        alt=""
                      />
                    </div>
                    <h5>EMP ID : POS003</h5>
                    <h4>Robert Grossman</h4>
                    <span>System Administrator</span>
                  </div>
                  <ul className="department">
                    <li>
                      Joined
                      <span>14 Aug 2023</span>
                    </li>
                    <li>
                      Department
                      <span>Admin</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-xxl-3 col-xl-4 col-lg-6 col-md-6">
                <div className="employee-grid-profile">
                  <div className="profile-head">
                    <label className="checkboxs">
                      <input type="checkbox" />
                      <span className="checkmarks" />
                    </label>
                    <div className="profile-head-action">
                      <span className="badge badge-linesuccess text-center w-auto me-1">
                        Active
                      </span>
                      <div className="dropdown profile-action">
                        <Link
                          to="#"
                          className="action-icon dropdown-toggle"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          <MoreVertical />
                        </Link>
                        <ul className="dropdown-menu">
                          <li>
                            <Link
                              to={route.editemployee}
                              className="dropdown-item"
                            >
                              <Edit className="info-img" />
                              Edit
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="#"
                              className="dropdown-item confirm-text mb-0"
                              onClick={showConfirmationAlert}
                            >
                              <Trash2 className="info-img" />
                              Delete
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="profile-info">
                    <div className="profile-pic active-profile">
                      <ImageWithBasePath
                        src="assets/img/users/user-06.jpg"
                        alt=""
                      />
                    </div>
                    <h5>EMP ID : POS004</h5>
                    <h4>Janet Hembre</h4>
                    <span>Administrative Officer</span>
                  </div>
                  <ul className="department">
                    <li>
                      Joined
                      <span>17 Jun 2023</span>
                    </li>
                    <li>
                      Department
                      <span>Admin</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-xxl-3 col-xl-4 col-lg-6 col-md-6">
                <div className="employee-grid-profile">
                  <div className="profile-head">
                    <label className="checkboxs">
                      <input type="checkbox" />
                      <span className="checkmarks" />
                    </label>
                    <div className="profile-head-action">
                      <span className="badge badge-linesuccess text-center w-auto me-1">
                        Active
                      </span>
                      <div className="dropdown profile-action">
                        <Link
                          to="#"
                          className="action-icon dropdown-toggle"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          <MoreVertical />
                        </Link>
                        <ul className="dropdown-menu">
                          <li>
                            <Link
                              to={route.editemployee}
                              className="dropdown-item"
                            >
                              <Edit className="info-img" />
                              Edit
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="#"
                              className="dropdown-item confirm-text mb-0"
                              onClick={showConfirmationAlert}
                            >
                              <Trash2 className="info-img" />
                              Delete
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="profile-info">
                    <div className="profile-pic active-profile">
                      <ImageWithBasePath
                        src="assets/img/users/user-04.jpg"
                        alt=""
                      />
                    </div>
                    <h5>EMP ID : POS005</h5>
                    <h4>Russell Belle</h4>
                    <span>Technician</span>
                  </div>
                  <ul className="department">
                    <li>
                      Joined
                      <span>16 Jan 2014</span>
                    </li>
                    <li>
                      Department
                      <span>Technical</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-xxl-3 col-xl-4 col-lg-6 col-md-6">
                <div className="employee-grid-profile">
                  <div className="profile-head">
                    <label className="checkboxs">
                      <input type="checkbox" />
                      <span className="checkmarks" />
                    </label>
                    <div className="profile-head-action">
                      <span className="badge badge-linedanger text-center w-auto me-1">
                        Inactive
                      </span>
                      <div className="dropdown profile-action">
                        <Link
                          to="#"
                          className="action-icon dropdown-toggle"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          <MoreVertical />
                        </Link>
                        <ul className="dropdown-menu">
                          <li>
                            <Link
                              to={route.editemployee}
                              className="dropdown-item"
                            >
                              <Edit className="info-img" />
                              Edit
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="#"
                              className="dropdown-item confirm-text mb-0"
                              onClick={showConfirmationAlert}
                            >
                              <Trash2 className="info-img" />
                              Delete
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="profile-info">
                    <div className="profile-pic">
                      <ImageWithBasePath
                        src="assets/img/users/user-05.jpg"
                        alt=""
                      />
                    </div>
                    <h5>EMP ID : POS006</h5>
                    <h4>Edward K. Muniz</h4>
                    <span>Office Support Secretary</span>
                  </div>
                  <ul className="department">
                    <li>
                      Joined
                      <span>07 Feb 2017</span>
                    </li>
                    <li>
                      Department
                      <span>Support</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-xxl-3 col-xl-4 col-lg-6 col-md-6">
                <div className="employee-grid-profile">
                  <div className="profile-head">
                    <label className="checkboxs">
                      <input type="checkbox" />
                      <span className="checkmarks" />
                    </label>
                    <div className="profile-head-action">
                      <span className="badge badge-linesuccess text-center w-auto me-1">
                        Active
                      </span>
                      <div className="dropdown profile-action">
                        <Link
                          to="#"
                          className="action-icon dropdown-toggle"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          <MoreVertical />
                        </Link>
                        <ul className="dropdown-menu">
                          <li>
                            <Link
                              to={route.editemployee}
                              className="dropdown-item"
                            >
                              <Edit className="info-img" />
                              Edit
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="#"
                              className="dropdown-item confirm-text mb-0"
                              onClick={showConfirmationAlert}
                            >
                              <Trash2 className="info-img" />
                              Delete
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="profile-info">
                    <div className="profile-pic active-profile">
                      <ImageWithBasePath
                        src="assets/img/users/user-07.jpg"
                        alt=""
                      />
                    </div>
                    <h5>EMP ID : POS007</h5>
                    <h4>Susan Moore</h4>
                    <span>Tech Lead</span>
                  </div>
                  <ul className="department">
                    <li>
                      Joined
                      <span>14 Mar 2023</span>
                    </li>
                    <li>
                      Department
                      <span>Engineering</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-xxl-3 col-xl-4 col-lg-6 col-md-6">
                <div className="employee-grid-profile">
                  <div className="profile-head">
                    <label className="checkboxs">
                      <input type="checkbox" />
                      <span className="checkmarks" />
                    </label>
                    <div className="profile-head-action">
                      <span className="badge badge-linesuccess text-center w-auto me-1">
                        Active
                      </span>
                      <div className="dropdown profile-action">
                        <Link
                          to="#"
                          className="action-icon dropdown-toggle"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          <MoreVertical />
                        </Link>
                        <ul className="dropdown-menu">
                          <li>
                            <Link
                              to={route.editemployee}
                              className="dropdown-item"
                            >
                              <Edit className="info-img" />
                              Edit
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="#"
                              className="dropdown-item confirm-text mb-0"
                              onClick={showConfirmationAlert}
                            >
                              <Trash2 className="info-img" />
                              Delete
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="profile-info">
                    <div className="profile-pic active-profile">
                      <ImageWithBasePath
                        src="assets/img/users/user-08.jpg"
                        alt=""
                      />
                    </div>
                    <h5>EMP ID : POS008</h5>
                    <h4>Lance Jackson</h4>
                    <span>Database administrator</span>
                  </div>
                  <ul className="department">
                    <li>
                      Joined
                      <span>23 July 2023</span>
                    </li>
                    <li>
                      Department
                      <span>Admin</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div> */}
                    <div className="employee-grid-widget">
                        <div className="row">
                            {employees.map((employee, index) => (
                                <div key={index} className="col-xxl-3 col-xl-4 col-lg-6 col-md-6">
                                    <div className="employee-grid-profile">
                                        <div className="profile-head">
                                            <label className="checkboxs">
                                                <input type="checkbox"
                                                />
                                                <span className="checkmarks"
                                                />
                                            </label>

                                            <div className="profile-head-action">
                                                {/* <span
                          className={`badge ${employee.empstatus === true ? "badge-linesuccess" : "badge-linedanger"} text-center w-auto me-1`}
                        >
                          {employee.empstatus === true ? "Active" : "Inactive"}
                        </span> */}
                                                {/* <span className="badge badge-linesuccess text-center w-auto me-1">
                          {employee.empstatus}
                        </span> */}
                                                <span className={`badge ${employee.empstatus === 'true'
                                                    ? "badge-linesuccess"
                                                    : employee.empstatus === 'false'
                                                        ? "badge-linedanger"
                                                        : "badge-warning"}`}>
                                                    <Link to="#">
                                                        {employee.empstatus === 'true' ? "Active" : employee.empstatus === 'false' ? "Inactive" : "Unknown"}
                                                    </Link>
                                                </span>



                                                <div className="dropdown profile-action">
                                                    <Link
                                                        to="#"
                                                        className="action-icon dropdown-toggle"
                                                        data-bs-toggle="dropdown"
                                                        aria-expanded="false"
                                                    >
                                                        <MoreVertical />
                                                    </Link>
                                                    <ul className="dropdown-menu">
                                                        {/* <li>
                              <Link
                                to={`/edit-employee/${employee.empid}`}
                                className="dropdown-item"
                              >
                                <Edit className="info-img" />
                                Edit
                              </Link>
                            </li> */}
                                                        <li>
                                                            <OverlayTrigger placement="top" overlay={<Tooltip id="edit-tooltip">Edit</Tooltip>}>
                                                                <a
                                                                    to="#"
                                                                    className="dropdown-item"
                                                                    onClick={() => { onEditClick(employee.empid) }}  // Use the employee.empid for the onClick
                                                                >
                                                                    <Edit className="feather-edit" />
                                                                    Edit
                                                                </a>
                                                            </OverlayTrigger>
                                                        </li>

                                                        <li>
                                                            <Link
                                                                to="#"
                                                                className="dropdown-item confirm-text mb-0"
                                                                onClick={() => showConfirmationAlert(employee.empid)}
                                                            >
                                                                <Trash2 className="info-img" />
                                                                Delete
                                                            </Link>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="profile-info">
                                            {/* <div className={`profile-pic ${employee.empstatus === 1 ? "active-profile" : ""}`}> */}
                                            {/* <ImageWithBasePath
                          src={employee.empphoto}
                          alt=""
                        /> */}
                                            <img
                                                src={employee.empphoto ? getImageUrl(employee.empphoto) : `${baseUrl.Url}/Images/default-image.jpg`}
                                                alt={employee.empphoto}
                                                className="profile-pic"
                                            />


                                            {/* </div> */}
                                            <h5>EMP ID : {employee.empcode}</h5>
                                            <h4>{employee.empname}</h4>
                                            <span>{employee.dsname}</span>
                                        </div>
                                        <ul className="department">
                                            <li>
                                                Joined
                                                <span>{employee.empjoindate}</span>
                                            </li>
                                            <li>
                                                Department
                                                <span>{employee.dname}</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="container-fluid">
                        <div className="row custom-pagination">
                            <div className="col-md-12">
                                <div className="paginations d-flex justify-content-end mb-3">
                                    <span>
                                        <i className="fas fa-chevron-left" />
                                    </span>
                                    <ul className="d-flex align-items-center page-wrap">
                                        <li>
                                            <Link to="#" className="active">
                                                1
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="#">2</Link>
                                        </li>
                                        <li>
                                            <Link to="#">3</Link>
                                        </li>
                                        <li>
                                            <Link to="#">4</Link>
                                        </li>
                                    </ul>
                                    <span>
                                        <i className="fas fa-chevron-right" />
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployeeMaster;
