
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ImageWithBasePath from "../../core/img/imagewithbasebath";
import Brand from "../../core/modals/inventory/brand";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { all_routes } from "../../Router/all_routes";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import Table from "../../core/pagination/datatable";
import { setToogleHeader } from "../../core/redux/action";
import axios from "axios";
import { baseUrl } from "../../core/json/custom";
import { Link, useNavigate } from "react-router-dom";
import ExcelJS from "exceljs";
import marathiFontBase64 from "../../style/fonts/NotoSansDevanagari";
import { saveAs } from "file-saver";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { ArrowLeft, ChevronUp, Edit, PlusCircle, RotateCcw, Trash2 } from "feather-icons-react/build/IconComponents";

const GrapesVariety = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const MySwal = withReactContent(Swal);
  const route = all_routes;
  const data = useSelector((state) => state.toggle_header);
  const [variety, setVariety] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Columns for the table
  const columns = [
    {
      title: "नाव",
      dataIndex: "varietyName",
    },
    {
      title: "द्राक्षाची जात",
      dataIndex: "varitylabel",
    },
    {
      title: "द्राक्षाची उप-जात",
      dataIndex: "subvaritylabel",
    },
    {
      title: "कृती",
      dataIndex: "action",
      align: "center",
      render: (_, record) => (
        <div className="action-table-data">
          <div className="edit-delete-action">
            <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
              <a
                className="me-2 p-2"
                onClick={() => navigate(route.AddGrapesVariety, { state: { Vid: record.vid } })}
              >
                <Edit className="feather-edit" />
              </a>
            </OverlayTrigger>
            <OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
              <Link className="confirm-text p-2" to="#" onClick={() => showConfirmationAlert(record.vid)}>
                <Trash2 className="feather-trash-2" />
              </Link>
            </OverlayTrigger>
          </div>
        </div>
      ),
    },
  ];

  // Fetch grape variety data
  useEffect(() => {
    const fetchVarietyData = async () => {
      setLoading(true);
      try {
        const payload = {
          vid: "%",
          keyword: "%",
          companyid: "COMP123",
        };
        const headers = {
          "Content-Type": "application/json",
          Accept: "*/*",
        };
        const response = await axios.post(`${baseUrl.Url}/api/GET_Variety`, payload, { headers });
        if (response.status !== 200) throw new Error("Failed to fetch data");
        setVariety(response.data.map((item) => ({ ...item, id: item.vid })));
      } catch (error) {
        setError("Failed to fetch grape variety data. Please try again later.");
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVarietyData();
  }, []);

  // Delete a variety
  const onDeleteVariety = async (vid) => {
    try {
      const payload = {
        vid,
        companyid: "COMP123",
      };
      const headers = {
        "Content-Type": "application/json",
        Accept: "*/*",
      };
      const response = await axios.post(`${baseUrl.Url}/api/SP_DeleteVarity`, payload, { headers });
      if (response.status !== 200) throw new Error("Failed to delete data");
      const responseData = response.data[0];

      if (responseData.responseCode !== "FAILURE") {
        setVariety((prev) => prev.filter((item) => item.vid !== vid));

        // ✅ Success message
        MySwal.fire({
          title: "Deleted!",
          text: "Variety deleted successfully.",
          icon: "success",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      MySwal.fire({
        title: "Error",
        text: "Failed to delete variety. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
      console.error("Error deleting variety:", error);
    }
  };


  // Show confirmation alert for deletion
  const showConfirmationAlert = (vid) => {
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
        onDeleteVariety(vid);
      }
    });
  };

  // Generate PDF
  const generatePDF = (varietyData) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const cleanBase64 = marathiFontBase64.replace(/^data:font\/ttf;base64,/, "");
    doc.addFileToVFS("NotoSansDevanagari.ttf", cleanBase64);
    doc.addFont("NotoSansDevanagari.ttf", "NotoSansDevanagari", "normal");
    doc.setFont("NotoSansDevanagari");
    doc.setFontSize(16);

    const title = "द्राक्षाची विविधता अहवाल";
    doc.text(title, (pageWidth - doc.getTextWidth(title)) / 2, 20);

    const tableColumn = ["नाव", "द्राक्षाची जात", "द्राक्षाची उप-जात"];
    const tableRows = varietyData.map((item) => [
      item.varietyName,
      item.varitylabel,
      item.subvaritylabel,
    ]);

    autoTable(doc, {
      startY: 30,
      head: [tableColumn],
      body: tableRows,
      styles: { font: "NotoSansDevanagari", fontStyle: "normal", fontSize: 12 },
      headStyles: { fillColor: [0, 102, 204], textColor: 255, fontSize: 14 },
      alternateRowStyles: { fillColor: [240, 240, 240] },
    });

    window.open(doc.output("bloburl"), "_blank");
  };

  // Export to Excel
  const exportToExcel = async (varietyData) => {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Grapes Variety Report");
      const headingRow = worksheet.addRow(["Grapes Variety Report"]);
      headingRow.font = { bold: true, size: 16 };
      headingRow.alignment = { horizontal: "center", vertical: "middle" };
      worksheet.mergeCells("A1:C1");

      const headers = ["नाव", "द्राक्षाची जात", "द्राक्षाची उप-जात"];
      const headerRow = worksheet.addRow(headers);
      headerRow.eachCell((cell) => {
        cell.font = { bold: true, color: { argb: "FFFFFF" } };
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "808080" } };
        cell.alignment = { horizontal: "center", vertical: "middle" };
      });

      worksheet.columns = [
        { key: "varietyName", width: 40 },
        { key: "varityType", width: 40 },
        { key: "subVarityType", width: 40 },
      ];

      varietyData.forEach(({ varietyName, varitylabel, subvaritylabel }) => {
        const row = worksheet.addRow([varietyName, varitylabel, subvaritylabel]);
        row.eachCell((cell) => {
          cell.alignment = { horizontal: "center", vertical: "middle" };
        });
      });

      const buffer = await workbook.xlsx.writeBuffer();
      const data = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      saveAs(data, "GrapesVarietyReport.xlsx");
    } catch (error) {
      console.error("Error generating Excel file:", error);
      MySwal.fire({
        title: "Error",
        text: "Failed to export to Excel. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleShortcut = (e) => {
      if (e.ctrlKey && e.key === "a") {
        e.preventDefault();
        navigate(route.AddGrapesVariety);
      }
      if (e.ctrlKey && e.key === "e") {
        e.preventDefault();
        navigate(route.AppAdminIndex);
      }
    };
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, [navigate]);

  // Tooltip render functions
  const renderTooltip = (props) => <Tooltip {...props}>PDF</Tooltip>;
  const renderExcelTooltip = (props) => <Tooltip {...props}>Excel</Tooltip>;
  const renderRefreshTooltip = (props) => <Tooltip {...props}>Refresh</Tooltip>;
  const renderCollapseTooltip = (props) => <Tooltip {...props}>Collapse</Tooltip>;

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="add-item d-flex">
            <div className="page-title">
              <h3>द्राक्षाची विविधता</h3>
            </div>
          </div>
          <ul className="table-top-head">
            <li>
              <OverlayTrigger placement="top" overlay={renderTooltip}>
                <Link onClick={() => generatePDF(variety)}>
                  <ImageWithBasePath src="assets/img/icons/pdf.svg" alt="Download PDF" />
                </Link>
              </OverlayTrigger>
            </li>
            <li>
              <OverlayTrigger placement="top" overlay={renderExcelTooltip}>
                <Link onClick={() => exportToExcel(variety)}>
                  <ImageWithBasePath src="assets/img/icons/excel.svg" alt="Excel" />
                </Link>
              </OverlayTrigger>
            </li>
            <li>
              <OverlayTrigger placement="top" overlay={renderRefreshTooltip}>
                <Link onClick={() => window.location.reload()}>
                  <RotateCcw />
                </Link>
              </OverlayTrigger>
            </li>
            <li>
              <OverlayTrigger placement="top" overlay={renderCollapseTooltip}>
                <Link
                  id="collapse-header"
                  className={data ? "active" : ""}
                  onClick={() => dispatch(setToogleHeader(!data))}
                >
                  <ChevronUp />
                </Link>
              </OverlayTrigger>
            </li>
          </ul>
          <div className="page-btn">
            <Link to={route.AddGrapesVariety} className="btn btn-added">
              <PlusCircle className="me-2 iconsize" /> नवीन जोडा
            </Link>
          </div>
          <div className="page-btn">
            <Link to={route.AppAdminIndex} className="btn btn-secondary">
              <ArrowLeft className="me-2" />
              परत जा
            </Link>
          </div>
        </div>

        <div className="card table-list-card">
          <div className="card-body">
            {loading && <p>Loading...</p>}
            {error && <p className="text-danger">{error}</p>}
            <div className="table-responsive">
              <Table columns={columns} dataSource={variety} />
            </div>
          </div>
        </div>
        <Brand />
      </div>
    </div>
  );
};

export default GrapesVariety;