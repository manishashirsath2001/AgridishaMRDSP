import React, { useState, useEffect } from 'react'
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import ImageWithBasePath from '../../core/img/imagewithbasebath';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronUp, PlusCircle, RotateCcw, Users, Trash2, Edit } from 'feather-icons-react/build/IconComponents';
import { useDispatch, useSelector } from 'react-redux';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import AddDesignation from './AddDesignation';
import { setToogleHeader } from '../../core/redux/action';
import axios from 'axios';
import { baseUrl } from "../../core/json/custom";
import { all_routes } from "../../Router/all_routes";
import { getUserData } from '../../Context/UserData';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";
const Designation = () => {
  const { userdetail } = getUserData();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const route = all_routes;
  const data = useSelector((state) => state.toggle_header);
  const [designations, setDesignations] = useState([]);


  const [selectedData, setSelectedData] = useState({ daid: null });
  useEffect(() => {
    try {
      const payload = {
        "daid": "%",
        "companyid": userdetail?.companyID || "",
        "deptid": userdetail?.departmentID || "",
      }

      const headers = {
        "Content-Type": "application/json",
        Accept: "*/*",
      };

      axios({
        method: "POST",
        url: baseUrl.Url + "/backend/api/GET_HRMDesignation",
        data: JSON.stringify(payload),
        headers: headers,
      })
        .then((response) => {
          if (response.status != 200) throw new Error("Failed to Fetching Data");
          const DATA = response.data;
          setDesignations(DATA);
        })

    } catch (error) {
      console.error("Error fetching Access Right Data:", error);
    }

  }, []);


  const handleDelete = async (daid) => {
    try {
      const payload = {
        "daid": daid,
        "companyid": userdetail?.companyID || "",
        "deptid": userdetail?.departmentID || "",
      }
      const headers = {
        "Content-Type": "application/json",
        Accept: "*/*",
      };

      axios({
        method: "POST",
        url: baseUrl.Url + "/backend/api/SP_DeleteHRMDesignation",
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
          "daid": "%",
          "companyid": userdetail?.companyID || "",
          "deptid": userdetail?.departmentID || "",
        };

        const headers = {
          "Content-Type": "application/json",
          Accept: "*/*",
        };

        axios({
          method: "POST",
          url: baseUrl.Url + "/backend/api/GET_HRMDesignation",
          data: JSON.stringify(payload),
          headers: headers,
        })
          .then((response) => {
            const DATA = response.data;
            setDesignations(DATA);
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

  const MySwal = withReactContent(Swal);
  const showConfirmationAlert = (daid) => {
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
        handleDelete(daid)
      } else {
        MySwal.close();
      }

    });
  };
  const openModal = (daid) => {
    setSelectedData({ daid });
    // setModalShow(true);
  };

  useEffect(() => {
    const handleShortcut = (e) => {
      if (e.ctrlKey && e.key === 'a') {
        e.preventDefault();
        navigate(route.designation);
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

  const generatePDF = (DesignationList) => {
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

    const tableColumn = ["Designation", "Date", "Status"];
    const tableRows = DesignationList.map((item) => [
      item.dname,
      item.ddate,
      item.dstatus ? "Active" : "Inactive",
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
      const worksheet = workbook.addWorksheet("HRM Designation Report");

      const headingRow = worksheet.addRow(["HRM Designation Report"]);
      headingRow.getCell(1).font = { bold: true, size: 16 };
      headingRow.getCell(1).alignment = { horizontal: "center", vertical: "middle" };

      worksheet.mergeCells("A1:C1");

      const headers = ["Designation", "Date", "Status",];
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

      designations.forEach(({ dname, ddate, dstatus, }) => {
        const row = worksheet.addRow([dname, ddate, dstatus,]);
        row.eachCell((cell) => {
          cell.alignment = { horizontal: "center", vertical: "middle" };
        });
      });

      const buffer = await workbook.xlsx.writeBuffer();
      const data = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      saveAs(data, "DesignationReport.xlsx");

    } catch (error) {
      console.error("Error generating the Excel file:", error);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="add-item d-flex">
            <div className="page-title">
              <h4>Designation</h4>
              <h6>Manage your designation</h6>
            </div>
          </div>
          <ul className="table-top-head">
            <li>
              <OverlayTrigger placement="top" overlay={renderTooltip}>
                <Link onClick={() => generatePDF(designations)}>
                  <ImageWithBasePath src="assets/img/icons/pdf.svg" alt="img" />
                </Link>
              </OverlayTrigger>
            </li>
            <li>
              <OverlayTrigger placement="top" overlay={renderExcelTooltip}>
                <Link data-bs-toggle="tooltip" data-bs-placement="top" onClick={exportToExcel}>
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
            <Link
              to="#"
              className="btn btn-added"
              data-bs-toggle="modal"
              data-bs-target="#Adddesignation"
            >
              <PlusCircle className="me-2" />
              Add New Designation
            </Link>
          </div>
        </div>
        {/* /product list */}
        <div className="card table-list-card">
          <div className="card-body pb-0">
            <div className="table-top table-top-new">
              <div className="search-set mb-0">
                <div className="total-employees">
                  <h6>
                    <Users />
                    Total Employees
                    {/* <span>21</span> */}
                  </h6>
                </div>
                <div className="search-input">
                  <Link to="#" className="btn btn-searchset">
                    <i data-feather="search" className="feather-search" />
                  </Link>
                  <input type="search" className="form-control" />
                </div>
              </div>
            </div>

            <div className="table-responsive">
              <table className="table  datanew">
                <thead>
                  <tr>
                    <th>Designation</th>
                    <th>Date</th>
                    {/* <th>Created On</th> */}
                    {/* <th>Total Members</th> */}
                    <th>Status</th>
                    <th className="no-sort">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {designations.map((item, index) => (
                    <tr key={index}>
                      <td>{item.dname}</td>
                      <td>{item.ddate}</td>
                      {/* <td>{item.createdOn}</td> */}
                      {/* <td>{item.totalMembers}</td> */}
                      <td>
                        <span className={`badge ${item.dstatus === 1 ? "badge-linesuccess" : item.dstatus === 0 ? "badge-linedanger"
                          : "badge-warning"
                          }`}>
                          <Link to="#"> {item.dstatus == 1 ? "Active" : item.dstatus == 0 ? "Inactive" : "Unknown"}</Link>
                        </span>
                      </td>
                      <td className="action-table-data">
                        <div className="edit-delete-action">

                          <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip id="edit-tooltip">Edit</Tooltip>}
                          >
                            <Link className="me-2 p-2"
                              to="#"
                              data-bs-toggle="modal"
                              data-bs-target="#Adddesignation"
                              onClick={() => openModal(item.daid)}
                            >
                              <Edit className="feather-edit" />
                            </Link>
                          </OverlayTrigger>

                          <Link className="confirm-text p-2" to="#">
                            <i
                              data-feather="trash-2"
                              className="feather-trash-2"
                              onClick={() => showConfirmationAlert(item.daid)}
                            ></i>
                            <Trash2 className="feather-trash-2" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          </div>
        </div>
        {/* /product list */}
      </div>
      <AddDesignation DAID={selectedData.daid} />
    </div>

  )
}

export default Designation

