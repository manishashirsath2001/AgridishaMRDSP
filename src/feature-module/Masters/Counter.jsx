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

const Counter = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, userdetail } = getUserData();

  const navigate = useNavigate();
  const data = useSelector((state) => state.toggle_header);
  const route = all_routes;
  const [ServiesData, setServiesData] = useState([]);
  const onEditClick = (caid) => {
    navigate(route.AddCounter, { state: { CAID: caid } });
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
        "keyword": event.target.value,
        "companyid": userdetail?.companyID ? userdetail.companyID : "",
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
        navigate(route.AddCounter);
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
      title: "काउंटर कोड",
      dataIndex: "ccode",
      sorter: (a, b) => a.sname.length - b.sname.length,
    },
    {
      title: "काउंटर नाव",
      dataIndex: "cname",
      sorter: (a, b) => a.stype.length - b.stype.length,
    },
    {
      title: "प्रभार अधिकारी",
      dataIndex: "empname",
    },
    {
      title: "इंटरकॉम",
      dataIndex: "cintercom",
    },
    {
      title: "विभाग",
      dataIndex: "dname",
    },
    {
      title: "गोडाऊन",
      dataIndex: "wname",
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
                onClick={() => { onEditClick(record.caid) }}
              >  <Edit className="feather-edit" /></a>
            </OverlayTrigger>
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip id="delete-tooltip">हटवा</Tooltip>}>
              <Link className="confirm-text p-2" to="#" onClick={() => showConfirmationAlert(record.caid)}>
                <Trash2 className="feather-trash-2" />
              </Link>
            </OverlayTrigger>
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
        url: baseUrl.Url + "/backend/api/_SP_DeleteCounterMaster_",
        data: JSON.stringify(payload),
        headers: headers,
      })

      Swal.fire({
        icon: "success",
        title: "हटवले गेले!",
        text: "आपली फाइल हटवली गेली आहे.",
        confirmButtonText: "ठीक आहे",
        allowOutsideClick: false,
        allowEscapeKey: false,

      });
      try {

        const payload = {
          "pkid": "%",
          "companyid": userdetail?.companyID ? userdetail.companyID : "",
          "deptid": userdetail?.departmentID ? userdetail.departmentID : "",
        };

        const headers = {
          "Content-Type": "application/json",
          Accept: "*/*",
        };

        axios({
          method: "POST",
          url: baseUrl.Url + "/backend/api/_GET_CounterMaster_",
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
  const showConfirmationAlert = (caid) => {
    MySwal.fire({
      title: "आपली खात्री आहे का?",
      text: "हे पूर्ववत करता येणार नाही!",
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


  useEffect(() => {
    const fetchRackData = async () => {
      try {

        const payload = {
          "pkid": "%",
          "companyid": userdetail?.companyID ? userdetail.companyID : "",
          "deptid": userdetail?.departmentID ? userdetail.departmentID : "",
        };

        const headers = {
          "Content-Type": "application/json",
          Accept: "*/*",
        };

        axios({
          method: "POST",
          url: baseUrl.Url + "/backend/api/_GET_CounterMaster_",
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

  const OnreloadData = () => {
    try {

      const payload = {
        "pkid": "%",
        "companyid": userdetail?.companyID ? userdetail.companyID : "",
        "deptid": userdetail?.departmentID ? userdetail.departmentID : "",
      };

      const headers = {
        "Content-Type": "application/json",
        Accept: "*/*",
      };

      axios({
        method: "POST",
        url: baseUrl.Url + "/backend/api/_GET_CounterMaster_",
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

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="add-item d-flex">
            <div className="page-title">
              <h3>Manage Counter</h3>
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
                <Link onClick={OnreloadData}>
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
            <Link to={route.AddCounter} className="btn btn-added">
              <PlusCircle className="me-2 iconsize" />काऊंटर नोंदवा
            </Link>
          </div>
          <div className="page-btn">
            <Link to={route.CompanyIndex} className="btn btn-secondary">
              <ArrowLeft className="me-2" /> मागे
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

export default Counter;
