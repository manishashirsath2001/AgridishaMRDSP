import React, { useState, useEffect } from "react";
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
import { baseUrl } from "../../core/json/custom";
import { getUserData } from "../../Context/UserData";
import axios from "axios";
import {
  ArrowLeft,
  ChevronUp,
  Edit,
  PlusCircle,
  RotateCcw,
  Trash2,
} from "feather-icons-react/build/IconComponents";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
const ServicesMaster = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, userdetail } = getUserData();

  const navigate = useNavigate();
  const data = useSelector((state) => state.toggle_header);
  const route = all_routes;
  const [ServiesData, setServiesData] = useState([]);
  const onEditClick = (said) => {
    navigate(route.AddService, { state: { SAID: said } });
  };
  const [searchQuery, setSearchQuery] = useState("");

  if (isAuthenticated == true) {
    console.log("user", userdetail);
    console.log("getUserData", getUserData);
  }

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    try {
      const payload = {
        "pkid": "%",
        "keyword": event.target.value
        , "companyid": userdetail?.companyID ? userdetail.companyID : "",
        "deptid": userdetail?.departmentID ? userdetail.departmentID : "",
      }
      const headers = {
        "Content-Type": "application/json",
        Accept: "*/*",
      };

      axios({
        method: "POST",
        url: baseUrl.Url + "/backend/api/_GET_ServicesMaster_/Serch",
        data: JSON.stringify(payload),
        headers: headers,
      })

        .then((response) => {
          if (response.status != 200) throw new Error("Failed to send otp"); console.log("response", response.data); setServiesData(response.data);
        })
    } catch (error) {
      console.error("Error while searching Service data:", error);
    }
  };

  useEffect(() => {
    const handleShortcut = (e) => {
      if (e.ctrlKey && e.key === 'a') {
        e.preventDefault();
        navigate(route.AddService);
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

  const columns = [
    {
      title: "सेवा नाव",
      dataIndex: "sname",
      sorter: (a, b) => a.sname.length - b.sname.length,
    },
    {
      title: "सेवा प्रकार",
      dataIndex: "srname",
      sorter: (a, b) => a.srname.length - b.srname.length,
    },
    {
      title: "वर्ग",
      dataIndex: "ctname",
      sorter: (a, b) => a.ctname.length - b.ctname.length,
    },
    {
      title: "उप-वर्ग",
      dataIndex: "sctname",
      sorter: (a, b) => a.sctname.length - b.sctname.length,
    },
    {
      title: (<div className="text-center">HSN कोड</div>),
      dataIndex: "shsn",
      sorter: (a, b) => a.shsn.length - b.shsn.length,
    },

    {
      title: (<div className="text-center">क्रिया</div>),
      dataIndex: "action",
      render: (_, record) => (
        <div className="action-table-data">
          <div className="edit-delete-action">
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip id="edit-tooltip">संपादित करा</Tooltip>}>
              <a
                className="me-2 p-2"
                onClick={() => { onEditClick(record.said) }}
              >  <Edit className="feather-edit" /></a>
            </OverlayTrigger>
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip id="delete-tooltip">हटवा</Tooltip>}>
              <Link className="confirm-text p-2" to="#" onClick={() => showConfirmationAlert(record.said)}>
                <Trash2 className="feather-trash-2" />
              </Link>
            </OverlayTrigger>
          </div>
        </div>
      ),
    },
  ];

  // const columns = [

  //   {
  //     title: (
  //       <OverlayTrigger placement="top" overlay={<Tooltip >Service Name</Tooltip>}>
  //         <div className="text-center">Service Name</div>
  //       </OverlayTrigger>
  //     ),
  //     dataIndex: "Service Name",
  //     sorter: (a, b) => a.ServiceName.length - b.ServiceName.length,
  //     render: (text) => <div style={{ textAlign: "left" }}>{text}</div>,
  //     width: "200px",
  //   },

  //   {
  //     title: (
  //       <div className="text-center">Type-Service</div>
  //     ),

  //     dataIndex: "stype",
  //     sorter: (a, b) => a.Type - stype.length - b.Type - stype.length,
  //     render: (text) => <div style={{ textAlign: "left" }}>{text}</div>,
  //     width: "150px",
  //   },
  //   {
  //     title: (
  //       <OverlayTrigger placement="top" overlay={<Tooltip >Category</Tooltip>}>
  //         <div className="text-center">Category</div>
  //       </OverlayTrigger>
  //     ),
  //     title: "Category",
  //     dataIndex: "category",
  //     render: (text) => <div style={{ textAlign: "left" }}>{text}</div>,
  //     width: "150px",
  //   },
  //   {
  //     title: (
  //       <OverlayTrigger placement="top" overlay={<Tooltip >Sub-Category</Tooltip>}>
  //         <div className="text-center">Sub-Category</div>
  //       </OverlayTrigger>
  //     ),
  //     title: (
  //       <div className="text-center">Sub-Category</div>
  //     ),
  //     dataIndex: "subcategory",
  //     render: (text) => <div style={{ textAlign: "left" }}>{text}</div>,
  //     width: "150px",
  //   },
  //   {
  //     title: (
  //       <div className="text-center">HSN Code</div>
  //     ),
  //     dataIndex: "hsnCode",
  //     sorter: (a, b) => a.hsnCode.length - b.hsnCode.length,
  //     render: (text) => <div style={{ textAlign: "right" }}>{text}</div>,
  //     width: "150px",
  //   },

  //   {
  //     title: (
  //       <div className="text-center">Action</div>
  //     ),

  //     dataIndex: "action",
  //     render: (text) => <div style={{ textAlign: "right" }}>{text}</div>,
  //     width: "150px",
  //     render: () => (
  //       <div className="action-table-data">
  //         <div className="edit-delete-action">
  //           {/* <OverlayTrigger placement="top" overlay={<Tooltip id="view-tooltip">View</Tooltip>}>
  //             <a className="me-2 p-2"
  //               onClick={() => { oneyeClick() }}>
  //               <Eye className="feather-view" />

  //             </a>
  //           </OverlayTrigger> */}

  //           <OverlayTrigger placement="top" overlay={<Tooltip id="view-tooltip">Edit</Tooltip>}>
  //             <a

  //               className="me-2 p-2"
  //               onClick={() => onEditClick(record.said)}>
  //               <Edit className="feather-edit" />
  //             </a>
  //           </OverlayTrigger>

  //           <OverlayTrigger placement="top" overlay={<Tooltip id="view-tooltip">Delete</Tooltip>}>
  //             <Link
  //               className="confirm-text p-2"
  //               to="#"
  //               onClick={() => showConfirmationAlert(record.said)}
  //             >
  //               <Trash2 className="feather-trash-2" />
  //             </Link>
  //           </OverlayTrigger>
  //         </div>
  //       </div >
  //     ),
  //   },
  // ];

  const MySwal = withReactContent(Swal);
  const handleDelete = async (said) => {
    try {
      const payload = {
        "said": said,
        "companyid": userdetail?.companyID ? userdetail.companyID : "",
        "deptid": userdetail?.departmentID ? userdetail.departmentID : ""
      }
      const headers = {
        "Content-Type": "application/json",
        Accept: "*/*",
      };

      axios({
        method: "POST",
        url: baseUrl.Url + "/backend/api/_SP_DeleteServiceMaster_",
        data: JSON.stringify(payload),
        headers: headers,
      })

      Swal.fire({
        icon: "success",
        title: "हटविले!",
        text: "आपला फाईल हटविला गेला आहे.",
        confirmButtonText: "ठीक आहे",
        allowOutsideClick: false,
        allowEscapeKey: false,

      });
      try {

        const payload = {
          "pkid": "%",
          "keyword": "%"
          , "companyid": userdetail?.companyID ? userdetail.companyID : "",
          "deptid": userdetail?.departmentID ? userdetail.departmentID : "",
        };

        const headers = {
          "Content-Type": "application/json",
          Accept: "*/*",
        };

        axios({
          method: "POST",
          url: baseUrl.Url + "/backend/api/_GET_ServicesMaster_/getByID",
          data: JSON.stringify(payload),
          headers: headers,
        })
          .then((response) => {
            const data = response.data;
            setServiesData(data);
          });

      } catch (error) {
        console.error('get data Error:', error);
      }


    } catch (error) {
      console.error("Submission Error:", error);
      Swal.fire({
        icon: "error",
        title: "त्रुटी",
        text: "डेटा जतन करण्यात अयशस्वी. कृपया पुन्हा प्रयत्न करा.",
        allowOutsideClick: false,
        allowEscapeKey: false,

      });
    }

  };
  const showConfirmationAlert = (said) => {
    MySwal.fire({
      title: "तुम्हाला नक्की आहे का?",
      text: "हे तुम्ही परत करू शकणार नाही!",
      showCancelButton: true,
      confirmButtonColor: "#00ff00",
      confirmButtonText: "होय, हटवा!",
      cancelButtonColor: "#ff0000",
      cancelButtonText: "रद्द करा",
      allowOutsideClick: false,
      allowEscapeKey: false,

    }).then((result) => {
      if (result.isConfirmed) {
        handleDelete(said)
      } else {
        MySwal.close();
      }
    });
  };


  useEffect(() => {
    const fetchRackData = async () => {
      try {

        const payload = {
          "pkid": "%",
          "keyword": "%"
          , "companyid": userdetail?.companyID ? userdetail.companyID : "",
          "deptid": userdetail?.departmentID ? userdetail.departmentID : "",
        };

        const headers = {
          "Content-Type": "application/json",
          Accept: "*/*",
        };

        axios({
          method: "POST",
          url: baseUrl.Url + "/backend/api/_GET_ServicesMaster_/getByID",
          data: JSON.stringify(payload),
          headers: headers,
        })
          .then((response) => {
            const data = response.data;
            setServiesData(data);
          });

      } catch (error) {
        console.error('get data Error:', error);
      }

    };

    fetchRackData();
  }, []);

  const OnReloadData = () => {
    try {

      const payload = {
        "pkid": "%",
        "keyword": "%"
        , "companyid": userdetail?.companyID ? userdetail.companyID : "",
        "deptid": userdetail?.departmentID ? userdetail.departmentID : "",
      };

      const headers = {
        "Content-Type": "application/json",
        Accept: "*/*",
      };

      axios({
        method: "POST",
        url: baseUrl.Url + "/backend/api/_GET_ServicesMaster_/getByID",
        data: JSON.stringify(payload),
        headers: headers,
      })
        .then((response) => {
          const data = response.data;
          setServiesData(data);
        });

    } catch (error) {
      console.error('get data Error:', error);
    }
  }


  const renderTooltip = (props) => (
    <Tooltip id="tooltip-pdf" {...props}>
      Pdf
    </Tooltip>
  );
  const renderExcelTooltip = (props) => (
    <Tooltip id="tooltip-excel" {...props}>
      Excel
    </Tooltip>
  );
  const renderPrinterTooltip = (props) => (
    <Tooltip id="tooltip-printer" {...props}>
      Printer
    </Tooltip>
  );
  const renderRefreshTooltip = (props) => (
    <Tooltip id="tooltip-refresh" {...props}>
      Refresh
    </Tooltip>
  );
  const renderCollapseTooltip = (props) => (
    <Tooltip id="tooltip-collapse" {...props}>
      Collapse
    </Tooltip>
  );

  const downloadExcel = async () => {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Service (Report)");

      const headingRow = worksheet.addRow(["Service (Report)"]);
      headingRow.getCell(1).font = { bold: true, size: 16 };
      headingRow.getCell(1).alignment = { horizontal: "center", vertical: "middle" };

      // Merge heading across all columns
      worksheet.mergeCells("A1:E1");

      // **Header Row**
      const headers = ["Service Name", "Type-Service", "Category", "subcategory", "hsnCode",];
      const headerRow = worksheet.addRow(headers);

      headerRow.eachCell((cell) => {
        cell.font = { bold: true, color: { argb: "FFFFFF" } };
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "808080" } };
        cell.alignment = { horizontal: "center", vertical: "middle" };
      });

      // **Setting Column Widths**
      const columnWidths = [25, 25, 25, 25, 25, 18]; // Adjust widths as needed
      columnWidths.forEach((width, index) => {
        worksheet.getColumn(index + 1).width = width;
      });

      // **Adding Data Rows**
      ServiesData.forEach(({ sname, stype, scategory, ssubcategory, shsn }) => {
        const row = worksheet.addRow([sname, stype, scategory, ssubcategory, shsn,]);
        row.eachCell((cell) => {
          cell.alignment = { horizontal: "center", vertical: "middle" };
        });
      });

      // **Generate and Save Excel File**
      const buffer = await workbook.xlsx.writeBuffer();
      const data = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      saveAs(data, "Service_(Report).xlsx");

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
    const title = "Service Report";
    const titleWidth = doc.getTextWidth(title);

    const borderMargin = 10;
    doc.rect(borderMargin, borderMargin, pageWidth - borderMargin * 2, pageHeight - borderMargin * 2);

    doc.text(title, (pageWidth - titleWidth) / 2, 20);
    doc.setLineWidth(0.5);
    doc.line((pageWidth - titleWidth) / 2, 22, (pageWidth + titleWidth) / 2, 22);

    doc.setFontSize(13);
    doc.setFont("Helvetica", "normal");
    let yPosition = 15;


    const tableColumn = ["Service Name", "Type Service", "'Category", "sub-category", "Hsn Code"];

    // Table rows
    const tableRows = ServiesData.map(item => [
      item.sname,
      item.stype,
      item.scategory,
      item.ssubcategory,
      item.shsn,

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
    doc.save("Service_(Report).pdf");
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="add-item d-flex">
            <div className="page-title">
              <h3>Manage Service Master</h3>
            </div>
          </div>
          <ul className="table-top-head">
            <li>
              <OverlayTrigger placement="top" overlay={renderTooltip}>
                <Link onClick={downloadPDF}>
                  <ImageWithBasePath src="assets/img/icons/pdf.svg" alt="img" />
                </Link>
              </OverlayTrigger>
            </li>
            <li>
              <OverlayTrigger placement="top" overlay={renderExcelTooltip}>
                <Link onClick={downloadExcel}>
                  <ImageWithBasePath
                    src="assets/img/icons/excel.svg"
                    alt="img"
                  />
                </Link>
              </OverlayTrigger>
            </li>
            <li>
              <OverlayTrigger placement="top" overlay={renderPrinterTooltip}>
                <Link>
                  <i data-feather="printer" className="feather-printer" />
                </Link>
              </OverlayTrigger>
            </li>
            <li>
              <OverlayTrigger placement="top" overlay={renderRefreshTooltip}>
                <Link onClick={OnReloadData}>
                  <RotateCcw />
                </Link>
              </OverlayTrigger>
            </li>
            <li>
              <OverlayTrigger placement="top" overlay={renderCollapseTooltip}>
                <Link
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
            <Link to={route.AddService} className="btn btn-added">
              <PlusCircle className="me-2 iconsize" /> सर्विस नोंदवा
            </Link>
          </div>
          <div className="page-btn">
            <Link to={route.MasterIndex} className="btn btn-secondary">
              <ArrowLeft className="me-2" />मागे
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
              <Table columns={columns} dataSource={ServiesData} />
            </div>
          </div>
        </div>

        <Brand />
      </div>
    </div>
  );
};

export default ServicesMaster;
