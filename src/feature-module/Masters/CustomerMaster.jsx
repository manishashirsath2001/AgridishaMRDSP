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
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  ArrowLeft,
  ChevronUp,
  Edit,
  PlusCircle,
  RotateCcw,
  Trash2,
} from "feather-icons-react/build/IconComponents";
import { baseUrl } from "../../core/json/custom";
import { getUserData } from "../../Context/UserData";
const CustomerMaster = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const data = useSelector((state) => state.toggle_header);
  const { isAuthenticated, userdetail } = getUserData();
  const route = all_routes;
  const [Customer, setCustomer] = useState([]);
  const [loading, setLoading] = useState(true);
  if (isAuthenticated == true) {
    console.log("user", userdetail);
    console.log("getUserData", getUserData);
  }
  useEffect(() => {
    const handleShortcut = (e) => {
      if (e.ctrlKey && e.key === 'a') {
        e.preventDefault();
        navigate(route.AddCustomer);
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

  const onEditClick = (caid) => {
    navigate(route.AddCustomer, { state: { CAID: caid } });
  };
  // ccompanyname,cbusinesstype,ccontactpersonmobile,ccity,cstate,ctradename
  const columns = [
    {
      title: "नाव",
      dataIndex: "ccompanyname",
      sorter: (a, b) => a.ccompanyname.localeCompare(b.ccompanyname),
    },
    {
      title: "प्रकार",
      dataIndex: "cbusinesstype",
      sorter: (a, b) => a.cbusinesstype.localeCompare(b.cbusinesstype),
    },
    {
      title: "फोन",
      dataIndex: "ccontactpersonmobile",
    },
    {
      title: "शहर",
      dataIndex: "ccity",
      sorter: (a, b) => a.ccity.localeCompare(b.ccity),
    },
    {
      title: "राज्य",
      dataIndex: "cstate",
      sorter: (a, b) => a.cstate.localeCompare(b.cstate),
    },
    {
      title: "व्यवसाय नाव",
      dataIndex: "ctradename",
      sorter: (a, b) => a.ctradename.localeCompare(b.ctradename),
    },
    {
      title: "कृती ",
      dataIndex: "action",
      render: (_, record) => (
        <div className="action-table-data">
          <div className="edit-delete-action">
            <a className="me-2 p-2"
              onClick={() => { onEditClick(record.caid) }}
            >  <Edit className="feather-edit" /></a>
            <Link className="confirm-text p-2" to="#" onClick={() => showConfirmationAlert(record.caid)}>
              <Trash2 className="feather-trash-2" />
            </Link>
          </div>
        </div>
      ),
    },
  ];

  const MySwal = withReactContent(Swal);
  const handleDelete = async (caid) => {
    try {
      const payload = {
        "caid": caid,
        "companyid": userdetail?.companyID ? userdetail.companyID : "",
        "deptid": userdetail?.departmentID ? userdetail.departmentID : ""
      }
      const headers = {
        "Content-Type": "application/json",
        Accept: "*/*",
      };

      axios({
        method: "POST",
        url: baseUrl.Url + "/backend/api/_SP_DeleteCustomersPartners_",
        data: JSON.stringify(payload),
        headers: headers,
      })

      Swal.fire({
        icon: "success",
        title: "हटवले!",
        text: "आपला फाइल यशस्वीरित्या हटवला गेला आहे.",
        confirmButtonText: "ठीक आहे",
        allowOutsideClick: false,
        allowEscapeKey: false,

      });
      try {
        const payload = {
          "pkid": "%"
          , "keyword": "%"
          , "ctype": "2",
          "companyid": userdetail?.companyID ? userdetail.companyID : "",
          "deptid": userdetail?.departmentID ? userdetail.departmentID : ""
        };
        const headers = {
          "Content-Type": "application/json",
          Accept: "*/*",
        };
        axios({
          method: "POST",
          url: baseUrl.Url + "/backend/api/_GET_CustomersPartners_/getByID",
          data: JSON.stringify(payload),
          headers: headers,
        })
          .then((response) => {
            if (response.status != 200) throw new Error("Failed to send otp");
            setCustomer(
              response.data.map((item) => ({
                caid: item.caid,
                ccompanyname: item.ccompanyname,
                cbusinesstype: item.cbusinesstype,
                ccontactpersonmobile: item.ccontactpersonmobile,
                ccity: item.ccity,
                cstate: item.cstate,
                ctradename: item.ctradename,
              }))
            );
          })
        // const response = await axios.post(
        //   method: "POST",
        //   url: baseUrl.Url + "/backend/api/_GET_CustomersPartners_/getByID",
        //   data: JSON.stringify(payload),
        //   headers: headers,
        // );

        // if (response.status !== 200) {
        //   throw new Error("Failed to fetch data");
        // }


      } catch (error) {
        console.error("Error fetching Customer Data:", error);
      } finally {
        setLoading(false);
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
  const showConfirmationAlert = (caid) => {
    MySwal.fire({
      title: "तुम्हाला खात्री आहे का?",
      text: "ही क्रिया पूर्ववत करता येणार नाही!",
      showCancelButton: true,
      confirmButtonColor: "#00ff00",
      confirmButtonText: "होय, हटवा!",
      cancelButtonColor: "#ff0000",
      cancelButtonText: "रद्द करा",
      allowOutsideClick: false,
      allowEscapeKey: false,

    }).then((result) => {
      if (result.isConfirmed) {
        handleDelete(caid)
      } else {
        MySwal.close();
      }
    });
  };


  // Empty data source
  // const dataSource = [Customer];
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


  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const payload = {
          "pkid": "%"
          , "keyword": "%"
          , "ctype": "2",
          "companyid": userdetail?.companyID ? userdetail.companyID : "",
          "deptid": userdetail?.departmentID ? userdetail.departmentID : ""
        };
        const headers = {
          "Content-Type": "application/json",
          Accept: "*/*",
        };

        axios({
          method: "POST",
          url: baseUrl.Url + "/backend/api/_GET_CustomersPartners_/getByID",
          data: JSON.stringify(payload),
          headers: headers,
        })
          .then((response) => {
            if (response.status != 200) throw new Error("Failed to send otp");
            setCustomer(
              response.data.map((item) => ({
                caid: item.caid,
                ccompanyname: item.ccompanyname,
                cbusinesstype: item.cbusinesstype,
                ccontactpersonmobile: item.ccontactpersonmobile,
                ccity: item.ccity,
                cstate: item.cstate,
                ctradename: item.ctradename,
              }))
            );
          })
      } catch (error) {
        console.error("Error fetching Customer Data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, []);

  const OnReloadData = () => {
    try {
      const payload = {
        "pkid": "%"
        , "keyword": "%"
        , "ctype": "2",
        "companyid": userdetail?.companyID ? userdetail.companyID : "",
        "deptid": userdetail?.departmentID ? userdetail.departmentID : ""
      };
      const headers = {
        "Content-Type": "application/json",
        Accept: "*/*",
      };

      axios({
        method: "POST",
        url: baseUrl.Url + "/backend/api/_GET_CustomersPartners_/getByID",
        data: JSON.stringify(payload),
        headers: headers,
      })
        .then((response) => {
          if (response.status != 200) throw new Error("Failed to send otp");
          setCustomer(
            response.data.map((item) => ({
              caid: item.caid,
              ccompanyname: item.ccompanyname,
              cbusinesstype: item.cbusinesstype,
              ccontactpersonmobile: item.ccontactpersonmobile,
              ccity: item.ccity,
              cstate: item.cstate,
              ctradename: item.ctradename,
            }))
          );
        })
    } catch (error) {
      console.error("Error fetching Customer Data:", error);
    } finally {
      setLoading(false);
    }
  }


  const [searchQuery, setSearchQuery] = useState("");
  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    try {
      const payload = {
        "pkid": "%",
        "ctype": "2",
        "keyword": event.target.value,
        "companyid": userdetail?.companyID ? userdetail.companyID : "",
        "deptid": userdetail?.departmentID ? userdetail.departmentID : ""
      }
      const headers = {
        "Content-Type": "application/json",
        Accept: "*/*",
      };

      axios({
        method: "POST",
        url: baseUrl.Url + "/backend/api/_GET_CustomersPartners_/Serch",
        data: JSON.stringify(payload),
        headers: headers,
      })

        .then((response) => {
          if (response.status != 200) throw new Error("Failed to send ");
          console.log("response", response.data);
          setCustomer(response.data);
        })
    } catch (error) {
      console.error("Error while searching  data:", error);
    }
  };


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

      const headers = ["Company Name", "BusinessType", "Phone Mo.", "City", "State", "Trade Name"];
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
      Customer.forEach(({ ccompanyname, cbusinesstype, ccontactpersonmobile, ccity, cstate, ctradename }) => {
        const row = worksheet.addRow([ccompanyname, cbusinesstype, ccontactpersonmobile, ccity, cstate, ctradename]);
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
    const tableRows = Customer.map(item => [
      // ccompanyname, cbusinesstype, ccontactpersonmobile, ccity, cstate, ctradename 
      item.ccompanyname,
      item.cbusinesstype,
      item.ccontactpersonmobile,
      item.ccity,
      item.cstate,
      item.ctradename,

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
    doc.save("Customer_(Report).pdf");
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="add-item d-flex">
            <div className="page-title">
              <h3>कस्टमर नोंदणी </h3>
              {/* <h6>Manage Customer</h6> */}
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
            <Link to={route.AddCustomer} className="btn btn-added">
              <PlusCircle className="me-2 iconsize" /> Add Customer
            </Link>
          </div>
          <div className="page-btn">
            <Link to={route.PeopleIndex} className="btn btn-secondary">
              <ArrowLeft className="me-2" />
              Back to Index
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
            {loading ? (
              <p>Loading...</p>
            ) : (
              <div className="table-responsive">
                <Table columns={columns} dataSource={Customer} />
              </div>
            )}
          </div>
        </div>


        <Brand />
      </div>
    </div>
  );
};

export default CustomerMaster;
