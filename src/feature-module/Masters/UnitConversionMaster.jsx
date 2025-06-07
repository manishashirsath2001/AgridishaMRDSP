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
import { baseUrl } from "../../core/json/custom"
import axios from 'axios';
import {
  ArrowLeft,
  ChevronUp,
  Edit,
  PlusCircle,
  RotateCcw,
  Trash2,
} from "feather-icons-react/build/IconComponents";
import { getUserData } from "../../Context/UserData";

const UnitConversionMaster = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const data = useSelector((state) => state.toggle_header);
  const route = all_routes;

  const [UnitCovData, setUnitCovData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, userdetail } = getUserData();
  if (isAuthenticated == true) {
    console.log("user", userdetail);
    console.log("getUserData", getUserData);
  }
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
        url: baseUrl.Url + "/backend/api/_GET_UnitConversionMasters_/Serch",
        data: JSON.stringify(payload),
        headers: headers,
      })

        .then((response) => {
          if (response.status != 200) throw new Error("Failed to send otp"); console.log("response", response.data); setUnitCovData(response.data);
        })
    } catch (error) {
      console.error("Error while searching data:", error);
    }
  };



  const onEditClick = (uaid) => {
    navigate(route.AddUnitConversionMaster, { state: { UAID: uaid } });
  };

  useEffect(() => {
    const handleShortcut = (e) => {
      if (e.ctrlKey && e.key === 'a') {
        e.preventDefault();
        navigate(route.AddUnitConversionMaster);
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
      title: (
        <OverlayTrigger placement="top" overlay={<Tooltip id="fromunituom-tooltip">युनिट पासून</Tooltip>}>
          <span>युनिट पासून</span>
        </OverlayTrigger>
      ),
      dataIndex: "fromunituom",
    },
    {
      title: (
        <OverlayTrigger placement="top" overlay={<Tooltip id="fromunitquantity-tooltip">प्रमाण पासून</Tooltip>}>
          <span>प्रमाण पासून</span>
        </OverlayTrigger>
      ),
      dataIndex: "fromunitquantity",
    },
    {
      title: (
        <OverlayTrigger placement="top" overlay={<Tooltip id="tounituom-tooltip">युनिट पर्यंत</Tooltip>}>
          <span>युनिट पर्यंत</span>
        </OverlayTrigger>
      ),
      dataIndex: "tounituom",
    },
    {
      title: (
        <OverlayTrigger placement="top" overlay={<Tooltip id="tounitquantity-tooltip">प्रमाण पर्यंत</Tooltip>}>
          <span>प्रमाण पर्यंत</span>
        </OverlayTrigger>
      ),
      dataIndex: "fromunitquantity",
    },
    {
      title: (
        <div className="d-flex justify-content-center">
          <OverlayTrigger placement="top" overlay={<Tooltip id="action-tooltip">क्रिया</Tooltip>}>
            <span>क्रिया</span>
          </OverlayTrigger>
        </div>
      ),
      dataIndex: "action",
      render: (_, record) => (
        <div className="action-table-data">
          <div className="edit-delete-action">
            <OverlayTrigger placement="top" overlay={<Tooltip id="edit-tooltip">संपादित करा</Tooltip>}>
              <a
                className="me-2 p-2"
                onClick={() => { onEditClick(record.uaid) }}
              >
                <Edit className="feather-edit" />
              </a>
            </OverlayTrigger>

            <OverlayTrigger placement="top" overlay={<Tooltip id="delete-tooltip">हटवा</Tooltip>}>
              <Link className="confirm-text p-2" to="#" onClick={() => showConfirmationAlert(record.uaid)}>
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
  const handleDelete = async (uaid) => {
    try {
      const payload = {
        "uaid": uaid
        , "companyid": userdetail?.companyID ? userdetail.companyID : "",
        "deptid": userdetail?.departmentID ? userdetail.departmentID : ""
      }
      const headers = {
        "Content-Type": "application/json",
        Accept: "*/*",
      };

      axios({
        method: "POST",
        url: baseUrl.Url + "/backend/api/DeleteUnitConversionMasters",
        data: JSON.stringify(payload),
        headers: headers,
      })

      Swal.fire({
        icon: "success",
        title: "हटवले गेले!",
        text: "आपल्या फाइल हटवण्यात आली आहे.",
        confirmButtonText: "ठीक आहे",

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
          url: baseUrl.Url + "/backend/api/_GET_UnitConversionMasters_/getByID",
          data: JSON.stringify(payload),
          headers: headers,
        })
          .then((response) => {
            if (response.status != 200) throw new Error("Failed to send Data");
            setUnitCovData(response.data);
          })

      } catch (error) {
        console.error("Error fetching Unit Conversion Date:", error);
      } finally {
        setLoading(false);
      }



    } catch (error) {
      console.error("Submission Error:", error);
      Swal.fire({
        icon: "error",
        title: "त्रुटी",
        text: "डेटा जतन करण्यात अयशस्वी. कृपया पुन्हा प्रयत्न करा.",

      });
    }
  }
  const showConfirmationAlert = (uaid) => {
    MySwal.fire({
      title: "तुम्हाला खात्री आहे का?",
      text: "ही क्रिया उलटवता येणार नाही!",
      showCancelButton: true,
      confirmButtonColor: "#00ff00",
      confirmButtonText: "होय, हटवा!",
      cancelButtonColor: "#ff0000",
      cancelButtonText: "रद्द करा",
      allowOutsideClick: false,
      allowEscapeKey: false,

    }).then((result) => {
      if (result.isConfirmed) {
        handleDelete(uaid)
      } else {
        MySwal.close();
      }
    });
  };

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
          url: baseUrl.Url + "/backend/api/_GET_UnitConversionMasters_/getByID",
          data: JSON.stringify(payload),
          headers: headers,
        })
          .then((response) => {
            if (response.status != 200) throw new Error("Failed to send Data");
            setUnitCovData(response.data);
          })

      } catch (error) {
        console.error("Error fetching Unit Conversion Date:", error);
      } finally {
        setLoading(false);
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
        url: baseUrl.Url + "/backend/api/_GET_UnitConversionMasters_/getByID",
        data: JSON.stringify(payload),
        headers: headers,
      })
        .then((response) => {
          if (response.status != 200) throw new Error("Failed to send Data");
          setUnitCovData(response.data);
        })

    } catch (error) {
      console.error("Error fetching Unit Conversion Date:", error);
    } finally {
      setLoading(false);
    }
  }

  // Empty data source
  // const dataSource = [];
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
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="add-item d-flex">
            <div className="page-title">
              <h3>युनिट रूपांतरण मास्टर</h3>
              <h6>रूपांतरण व्यवस्थापित करा</h6>

            </div>
          </div>
          <ul className="table-top-head">
            <li>
              <OverlayTrigger placement="top" overlay={renderTooltip}>
                <Link>
                  <ImageWithBasePath src="assets/img/icons/pdf.svg" alt="img" />
                </Link>
              </OverlayTrigger>
            </li>
            <li>
              <OverlayTrigger placement="top" overlay={renderExcelTooltip}>
                <Link data-bs-toggle="tooltip" data-bs-placement="top">
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
            <Link to={route.AddUnitConversionMaster} className="btn btn-added">
              <PlusCircle className="me-2 iconsize" />युनिट नोंदवा
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
            {loading ? (
              <p>Loading...</p>
            ) : (
              <div className="table-responsive">
                <Table columns={columns} dataSource={UnitCovData} />
              </div>
            )}
          </div>
        </div>
        <Brand />
      </div>
    </div>
  );
};

export default UnitConversionMaster;
