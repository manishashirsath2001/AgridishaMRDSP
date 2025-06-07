import React, { useEffect, useState } from "react";
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
import axios from "axios";
import { baseUrl } from "../../core/json/custom";
import {
  ArrowLeft,
  ChevronUp,
  Edit,

  PlusCircle,
  RotateCcw,


  Trash2,
} from "feather-icons-react/build/IconComponents";
import { getUserData } from "../../Context/UserData";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
const ItemMaster = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const data = useSelector((state) => state.toggle_header);
  const route = all_routes;
  const [ItemData, setItemData] = useState([]);
  const { isAuthenticated, userdetail } = getUserData();
  if (isAuthenticated == true) {
    console.log("user", userdetail);
    console.log("getUserData", getUserData);
  }

  useEffect(() => {
    const handleShortcut = (e) => {
      if (e.ctrlKey && e.key === 'a') {
        e.preventDefault();
        navigate(route.AddItem);
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

  useEffect(() => {
    const fetchRackData = async () => {
      try {
        const payload = {
          "pkid": "%"
          , "keyword": "%"
          , "companyid": userdetail?.companyID ? userdetail.companyID : "",
          "deptid": userdetail?.departmentID ? userdetail.departmentID : ""
        }
        const headers = {
          "Content-Type": "application/json",
          Accept: "*/*",
        };

        axios({
          method: "POST",
          url: baseUrl.Url + "/backend/api/_GET_ProductMaster_/getByID",
          data: JSON.stringify(payload),
          headers: headers,
        })
          .then((response) => {
            if (response.status != 200) throw new Error("Failed to send otp");
            console.log("response", response.data);
            const DATA = response.data;
            setItemData(DATA);
          })

      } catch (error) {
        console.error("Error fetching HSN data:", error);
      }
    };

    fetchRackData();
  }, []);


  const OnReloadData = () => {
    try {
      const payload = {
        "pkid": "%"
        , "keyword": "%"
        , "companyid": userdetail?.companyID ? userdetail.companyID : "",
        "deptid": userdetail?.departmentID ? userdetail.departmentID : ""
      }
      const headers = {
        "Content-Type": "application/json",
        Accept: "*/*",
      };

      axios({
        method: "POST",
        url: baseUrl.Url + "/backend/api/_GET_ProductMaster_/getByID",
        data: JSON.stringify(payload),
        headers: headers,
      })
        .then((response) => {
          if (response.status != 200) throw new Error("Failed to send otp");
          console.log("response", response.data);
          const DATA = response.data;
          setItemData(DATA);
        })

    } catch (error) {
      console.error("Error fetching HSN data:", error);
    }
  }

  const onEditClick = (paid) => {
    navigate(route.AddItem, { state: { PAID: paid } });
  };
  const [searchQuery, setSearchQuery] = useState("");
  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    try {
      const payload = {
        "pkid": "%",
        "keyword": event.target.value
        , "companyid": userdetail?.companyID ? userdetail.companyID : "",
        "deptid": userdetail?.departmentID ? userdetail.departmentID : ""
      }
      const headers = {
        "Content-Type": "application/json",
        Accept: "*/*",
      };

      axios({
        method: "POST",
        url: baseUrl.Url + "/backend/api/_GET_ProductMaster_/Serch",
        data: JSON.stringify(payload),
        headers: headers,
      })

        .then((response) => {
          if (response.status != 200) throw new Error("Failed to send  data"); console.log("response", response.data);
          setItemData(response.data);
        })
    } catch (error) {
      console.error("Error while searching Product data:", error);
    }
  };

  const columns = [

    {
      title: "उत्पादनाचे नाव",
      dataIndex: "pname",
      sorter: (a, b) => a.pname.length - b.pname.length,
    },
    {
      title: "उत्पादनाची श्रेणी",
      dataIndex: "ctname",
      sorter: (a, b) => a.ctname.length - b.ctname.length,
    },
    {
      title: "उत्पादनाची उपश्रेणी",
      dataIndex: "sctname",
      sorter: (a, b) => a.sctname.length - b.sctname.length,
    },
    {
      title: "विक्रीचा प्रकार",
      dataIndex: "ptypesofsales",
      sorter: (a, b) => a.ptypesofsales.length - b.ptypesofsales.length,
    },
    {
      title: "HSN कोड ",
      dataIndex: "phsn",
      sorter: (a, b) => a.phsn.length - b.phsn.length,
    },
    {
      title: "कृती ",
      dataIndex: "action",
      render: (_, record) => (
        <div className="action-table-data">
          <div className="edit-delete-action">
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip id="edit-tooltip">Edit</Tooltip>}>
              <a
                className="me-2 p-2"
                onClick={() => { onEditClick(record.paid) }}
              >  <Edit className="feather-edit" /></a>
            </OverlayTrigger>
            <OverlayTrigger placement="top" overlay={<Tooltip id="delete-tooltip">Delete</Tooltip>}>
              <Link
                className="confirm-text p-2"
                to="#"
                onClick={() => showConfirmationAlert(record.paid)}>
                <Trash2 className="feather-trash-2" />
              </Link>
            </OverlayTrigger>
          </div>
        </div>
      ),
      sorter: (a, b) => a.createdby.length - b.createdby.length,
    },
  ];

  const MySwal = withReactContent(Swal);
  const handleDelete = async (PAID) => {
    try {
      const payload = {
        "paid": PAID
        , "companyid": userdetail?.companyID ? userdetail.companyID : "",
        "deptid": userdetail?.departmentID ? userdetail.departmentID : ""
      }
      const headers = {
        "Content-Type": "application/json",
        Accept: "*/*",
      };

      axios({
        method: "POST",
        url: baseUrl.Url + "/backend/api/_SP_DeleteProductMaster_",
        data: JSON.stringify(payload),
        headers: headers,
      })

      Swal.fire({
        icon: "success",
        title: "हटवले!",
        text: "रेकॉर्ड  हटवण्यात आले आहे.",
        confirmButtonText: "OK",
      });
      try {
        const payload = {
          "pkid": "%"
          , "keyword": "%"
          , "companyid": userdetail?.companyID ? userdetail.companyID : "",
          "deptid": userdetail?.departmentID ? userdetail.departmentID : ""
        }
        const headers = {
          "Content-Type": "application/json",
          Accept: "*/*",
        };

        axios({
          method: "POST",
          url: baseUrl.Url + "/backend/api/_GET_ProductMaster_/getByID",
          data: JSON.stringify(payload),
          headers: headers,
        })
          .then((response) => {
            if (response.status != 200) throw new Error("Failed to send otp");
            console.log("response", response.data);
            const DATA = response.data;
            setItemData(DATA);
          })


      } catch (error) {
        console.error("Error fetching Customer Data:", error);
      } finally {
        // setLoading(false);
      }

    } catch (error) {
      console.error("Submission Error:", error);
      Swal.fire({
        icon: "error",
        title: "त्रुटी ",
        text: "माहिती जतन करण्यात अयशस्वी. कृपया पुन्हा प्रयत्न करा.",
        allowOutsideClick: false,
        allowEscapeKey: false,
      });
    }

  };
  const showConfirmationAlert = (paid) => {
    MySwal.fire({
      title: "तुम्हाला खात्री आहे का?",
      text: "तुम्ही ही माहिती परत मिळवू शकणार नाही!",
      showCancelButton: true,
      confirmButtonColor: "#00ff00",
      confirmButtonText: "हो , हटवा !",
      cancelButtonColor: "#ff0000",
      cancelButtonText: "रद्द करा",
      allowOutsideClick: false,
      allowEscapeKey: false,
    }).then((result) => {
      if (result.isConfirmed) {
        handleDelete(paid)
      } else {
        MySwal.close();
      }
    });
  };


  // Empty data source
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

  const downloadExcel = async () => {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Product (Report)");

      // **Main Heading Row**
      const headingRow = worksheet.addRow(["Employee Type (Report)"]);
      headingRow.getCell(1).font = { bold: true, size: 16 };
      headingRow.getCell(1).alignment = { horizontal: "center", vertical: "middle" };

      // Merge heading across all columns
      worksheet.mergeCells("A1:E1");

      // **Header Row**
      const headers = ["Product Name", "category", "Sub-Category", "Type of Sale", "Hsn Code"];
      const headerRow = worksheet.addRow(headers);

      headerRow.eachCell((cell) => {
        cell.font = { bold: true, color: { argb: "FFFFFF" } };
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "808080" } };
        cell.alignment = { horizontal: "center", vertical: "middle" };
      });

      // **Setting Column Widths**
      const columnWidths = [25, 25, 25, 25, 20]; // Adjust widths as needed
      columnWidths.forEach((width, index) => {
        worksheet.getColumn(index + 1).width = width;
      });

      // **Adding Data Rows**
      dataSource.forEach(({ pname, pcategory, psubcategory, ptypesofsales, phsn }) => {
        const row = worksheet.addRow([pname, pcategory, psubcategory, ptypesofsales, phsn]);
        row.eachCell((cell) => {
          cell.alignment = { horizontal: "center", vertical: "middle" };
        });
      });

      // **Generate and Save Excel File**
      const buffer = await workbook.xlsx.writeBuffer();
      const data = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      saveAs(data, "Product_(Report).xlsx");

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
    const title = "Product Report";
    const titleWidth = doc.getTextWidth(title);

    const borderMargin = 10;
    doc.rect(borderMargin, borderMargin, pageWidth - borderMargin * 2, pageHeight - borderMargin * 2);

    doc.text(title, (pageWidth - titleWidth) / 2, 20);
    doc.setLineWidth(0.5);
    doc.line((pageWidth - titleWidth) / 2, 22, (pageWidth + titleWidth) / 2, 22);

    doc.setFontSize(13);
    doc.setFont("Helvetica", "normal");
    let yPosition = 15;


    const tableColumn = ["उत्पादनाचे नाव", "उत्पादनाची श्रेणी", "उत्पादनाची उपश्रेणी", "विक्रीचा प्रकार", "HSN कोड "];

    // Table rows
    const tableRows = dataSource.map(item => [
      item.pname,
      item.pcategory,
      item.psubcategory,
      item.ptypesofsales,
      item.phsn

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
    doc.save("Product_(Report).pdf");
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="add-item d-flex">
            <div className="page-title">
              <h3>उत्पादनांची माहिती </h3>
              {/* <h6>Manage your products</h6> */}
            </div>
          </div>
          <ul className="table-top-head">
            <li>
              <OverlayTrigger placement="top" overlay={renderTooltip} >
                <Link onClick={downloadPDF}>
                  <ImageWithBasePath src="assets/img/icons/pdf.svg" alt="img" />
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
                <Link data-bs-toggle="tooltip" data-bs-placement="top" onClick={OnReloadData}>
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
            <Link to={route.AddItem} className="btn btn-added">
              <PlusCircle className="me-2 iconsize" /> उत्पादने जोडा
            </Link>
          </div>
          <div className="page-btn">
            <Link to={route.MasterIndex} className="btn btn-secondary">
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
              <Table columns={columns} dataSource={ItemData} />
            </div>
          </div>
        </div>

        <Brand />
      </div>
    </div>
  );
};

export default ItemMaster;
