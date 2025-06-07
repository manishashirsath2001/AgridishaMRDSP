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
import { baseUrl } from "../../core/json/custom";
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

const RackMaster = () => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.toggle_header);
  const route = all_routes;
  const navigate = useNavigate();
  const [rackData, setRackData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, userdetail } = getUserData();
  if (isAuthenticated == true) {
    console.log("user", userdetail);
    console.log("getUserData", getUserData);
  }

  useEffect(() => {
    const handleShortcut = (e) => {
      if (e.ctrlKey && e.key === 'a') {
        e.preventDefault();
        navigate(route.AddRackMaster);
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

  const onEditClick = (raid) => {
    navigate(route.AddRackMaster, { state: { RAID: raid } });
  };
  const columns = [
    {
      title: (
        <OverlayTrigger placement="top" overlay={<Tooltip id="rcode-tooltip">रॅक कोड</Tooltip>}>
          <span>रॅक कोड</span>
        </OverlayTrigger>
      ),
      dataIndex: "rcode",
      sorter: (a, b) => a.rcode.length - b.rcode.length,
    },
    {
      title: (
        <OverlayTrigger placement="top" overlay={<Tooltip id="rtype-tooltip">रॅक स्थान</Tooltip>}>
          <span>रॅक स्थान</span>
        </OverlayTrigger>
      ),
      dataIndex: "rtype",
      sorter: (a, b) => a.rtype.length - b.rtype.length,
    },
    {
      title: (
        <OverlayTrigger placement="top" overlay={<Tooltip id="rrownumber-tooltip">रॅक रांग क्रमांक</Tooltip>}>
          <span>रॅक रांग क्रमांक</span>
        </OverlayTrigger>
      ),
      dataIndex: "rrownumber",
      // sorter: (a, b) => a.rrownumber.length - b.rrownumber.length,
    },
    {
      title: (
        <OverlayTrigger placement="top" overlay={<Tooltip id="rnumber-tooltip">रॅक क्रमांक</Tooltip>}>
          <span>रॅक क्रमांक</span>
        </OverlayTrigger>
      ),
      dataIndex: "rnumber",
      // sorter: (a, b) => a.rnumber.length - b.rnumber.length,
    },
    {
      title: (
        <OverlayTrigger placement="top" overlay={<Tooltip id="rshelf-tooltip">रॅक शेल्फ</Tooltip>}>
          <span>रॅक शेल्फ</span>
        </OverlayTrigger>
      ),
      dataIndex: "rshelf",
      // sorter: (a, b) => a.rshelf.length - b.rshelf.length,
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
              <a className="me-2 p-2" onClick={() => { onEditClick(record.raid) }}>
                <Edit className="feather-edit" />
              </a>
            </OverlayTrigger>
            <OverlayTrigger placement="top" overlay={<Tooltip id="delete-tooltip">हटवा</Tooltip>}>
              <Link
                className="confirm-text p-2"
                to="#"
                onClick={() => showConfirmationAlert(record.raid)}
              >
                <Trash2 className="feather-trash-2" />
              </Link>
            </OverlayTrigger>
          </div>
        </div>
      ),
      // sorter: (a, b) => a.createdby.length - b.createdby.length,
    },
  ];



  const MySwal = withReactContent(Swal);
  const handleDelete = async (raid) => {
    try {
      const payload = {
        "raid": raid
        , "companyid": userdetail?.companyID ? userdetail.companyID : "",
        "deptid": userdetail?.departmentID ? userdetail.departmentID : ""
      }
      const headers = {
        "Content-Type": "application/json",
        Accept: "*/*",
      };

      axios({
        method: "POST",
        url: baseUrl.Url + "/backend/api/_SP_DeleteRackMaster_",
        data: JSON.stringify(payload),
        headers: headers,
      })

      Swal.fire({
        icon: "success",
        title: "हटवले!",
        text: "आपला फाइल हटवण्यात आला आहे.",
        confirmButtonText: "ठीक आहे",
        allowOutsideClick: false,
        allowEscapeKey: false,

      });
      try {
        const payload = {
          "pkid": "%"
          , "keyword": "%"
          , "companyid": userdetail?.companyID ? userdetail.companyID : "",
          "deptid": userdetail?.departmentID ? userdetail.departmentID : "",
        }
        const headers = {
          "Content-Type": "application/json",
          Accept: "*/*",
        };

        axios({
          method: "POST",
          url: baseUrl.Url + "/backend/api/_GET_RackMaster_/getByID",
          data: JSON.stringify(payload),
          headers: headers,
        })
          .then((response) => {
            if (response.status != 200) throw new Error("Failed to send Data");
            setRackData(response.data);
          })

      } catch (error) {
        console.error("Error fetching  WareHoue Data:", error);
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

  const showConfirmationAlert = (raid) => {
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
        handleDelete(raid)
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
          "deptid": userdetail?.departmentID ? userdetail.departmentID : "",
        }
        const headers = {
          "Content-Type": "application/json",
          Accept: "*/*",
        };

        axios({
          method: "POST",
          url: baseUrl.Url + "/backend/api/_GET_RackMaster_/getByID",
          data: JSON.stringify(payload),
          headers: headers,
        })
          .then((response) => {
            if (response.status != 200) throw new Error("Failed to send Data");
            setRackData(response.data);
          })

      } catch (error) {
        console.error("Error fetching  WareHoue Data:", error);
      } finally {
        setLoading(false);
      }

    };

    fetchRackData();
  }, []);

  const renderTooltip = (props) => <Tooltip id="pdf-tooltip" {...props}>Pdf</Tooltip>;
  const renderExcelTooltip = (props) => <Tooltip id="excel-tooltip" {...props}>Excel</Tooltip>;
  const renderPrinterTooltip = (props) => <Tooltip id="printer-tooltip" {...props}>Printer</Tooltip>;
  const renderRefreshTooltip = (props) => <Tooltip id="refresh-tooltip" {...props}>Refresh</Tooltip>;
  const renderCollapseTooltip = (props) => <Tooltip id="refresh-tooltip" {...props}>Collapse</Tooltip>;
  const [searchQuery, setSearchQuery] = useState("");
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
        url: baseUrl.Url + "/backend/api/_GET_RackMaster_/Serch",
        data: JSON.stringify(payload),
        headers: headers,
      })

        .then((response) => {
          if (response.status != 200) throw new Error("Failed to send otp");
          console.log("response", response.data);
          setRackData(response.data);
        })
    } catch (error) {
      console.error("Error while searching Rack data:", error);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="add-item d-flex">
            <div className="page-title">
              <h3>रॅक  मास्टर </h3>
              <h6>रॅक  मास्टर</h6>
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
                <Link>
                  <ImageWithBasePath src="assets/img/icons/excel.svg" alt="img" />
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
                <Link>
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
            <Link to={route.AddRackMaster} className="btn btn-added">
              <PlusCircle className="me-2 iconsize" />रॅक नोंदवा
            </Link>
          </div>
          <div className="page-btn">
            <Link to={route.CompanyIndex} className="btn btn-secondary">
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
                <Table columns={columns} dataSource={rackData} />
              </div>
            )}
          </div>
        </div>

        <Brand />
      </div>
    </div>
  );
};

export default RackMaster;
