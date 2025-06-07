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

const WarehouseMaster = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const data = useSelector((state) => state.toggle_header);
  const route = all_routes;
  const { isAuthenticated, userdetail } = getUserData();
  if (isAuthenticated == true) {
    console.log("user", userdetail);
    console.log("getUserData", getUserData);
  }
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
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
        url: baseUrl.Url + "/backend/api/_GET_WarehouseMaster_/Serch",
        data: JSON.stringify(payload),
        headers: headers,
      })

        .then((response) => {
          if (response.status != 200) throw new Error("Failed to send otp"); console.log("response", response.data); setWarehouses(response.data);
        })
    } catch (error) {
      console.error("Error while searching WareHouse data:", error);
    }
  };
  useEffect(() => {
    const handleShortcut = (e) => {
      if (e.ctrlKey && e.key === 'a') {
        e.preventDefault();
        navigate(route.AddWarehouseForm);
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
          url: baseUrl.Url + "/backend/api/_GET_WarehouseMaster_/getByID",
          data: JSON.stringify(payload),
          headers: headers,
        })
          .then((response) => {
            if (response.status != 200) throw new Error("Failed to send Data");
            setWarehouses(response.data);
          })

      } catch (error) {
        console.error("Error fetching  WareHoue Data:", error);
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
        url: baseUrl.Url + "/backend/api/_GET_WarehouseMaster_/getByID",
        data: JSON.stringify(payload),
        headers: headers,
      })
        .then((response) => {
          if (response.status != 200) throw new Error("Failed to send Data");
          setWarehouses(response.data);
        })

    } catch (error) {
      console.error("Error fetching  WareHoue Data:", error);
    } finally {
      setLoading(false);
    }
  }

  const onEditClick = (waid) => {
    navigate(route.AddWarehouseForm, { state: { WAID: waid } });
  };

  const columns = [
    {
      title: (
        <OverlayTrigger
          placement="top"
          overlay={<Tooltip id="types-tooltip">गोदामाचे नाव</Tooltip>}
        >
          <div className="text-center">गोदामाचे नाव</div>
        </OverlayTrigger>
      ),
      dataIndex: "wname",
      sorter: (a, b) => a.wname.length - b.wname.length,
      width: 300,
      render: (text) => (
        <OverlayTrigger
          placement="top"
          overlay={<Tooltip id={`tooltip-${text}`}>{text}</Tooltip>}
        >
          <div style={{ textAlign: "left" }}>{text}</div>
        </OverlayTrigger>
      ),
    },

    {
      title: (
        <OverlayTrigger
          placement="top"
          overlay={<Tooltip id="types-tooltip">इंटरकॉम एक्सटेन्शन</Tooltip>}
        >
          <div className="text-center">इंटरकॉम एक्सटेन्शन</div>
        </OverlayTrigger>
      ),
      dataIndex: "wintercomextension",
      width: 300,
      render: (text) => (
        <OverlayTrigger
          placement="top"
          overlay={<Tooltip id={`tooltip-${text}`}>{text}</Tooltip>}
        >
          <div style={{ textAlign: "left" }}>{text}</div>
        </OverlayTrigger>
      ),
    },

    {
      title: (
        <OverlayTrigger
          placement="top"
          overlay={<Tooltip id="types-tooltip">शहर</Tooltip>}
        >
          <div className="text-center">शहर</div>
        </OverlayTrigger>
      ),
      dataIndex: "wcity",
      sorter: (a, b) => a.wcity.length - b.wcity.length,
      width: 500,
      render: (text) => (
        <OverlayTrigger
          placement="top"
          overlay={<Tooltip id={`tooltip-${text}`}>{text}</Tooltip>}
        >
          <div style={{ textAlign: "left" }}>{text}</div>
        </OverlayTrigger>
      ),
    },

    {
      title: (
        <OverlayTrigger
          placement="top"
          overlay={<Tooltip id="types-tooltip">राज्य</Tooltip>}
        >
          <div className="text-center">राज्य</div>
        </OverlayTrigger>
      ),
      dataIndex: "wstate",
      sorter: (a, b) => a.wstate.length - b.wstate.length,
      width: 500,
      render: (text) => (
        <OverlayTrigger
          placement="top"
          overlay={<Tooltip id={`tooltip-${text}`}>{text}</Tooltip>}
        >
          <div style={{ textAlign: "left" }}>{text}</div>
        </OverlayTrigger>
      ),
    },

    {
      title: (
        <OverlayTrigger
          placement="top"
          overlay={<Tooltip id="types-tooltip">पिनकोड</Tooltip>}
        >
          <div className="text-center">पिनकोड</div>
        </OverlayTrigger>
      ),
      dataIndex: "wpincode",
      width: 300,
      className: "w-20",
      render: (text) => (
        <OverlayTrigger
          placement="top"
          overlay={<Tooltip id={`tooltip-${text}`}>{text}</Tooltip>}
        >
          <div style={{ textAlign: "left" }}>{text}</div>
        </OverlayTrigger>
      ),
    },

    {
      title: (
        <OverlayTrigger
          placement="top"
          overlay={<Tooltip id="types-tooltip">क्रिया</Tooltip>}
        >
          <div className="text-center">क्रिया</div>
        </OverlayTrigger>
      ),
      dataIndex: "action",
      render: (_, record) => (
        <div className="action-table-data">
          <div className="edit-delete-action">
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip id="edit-tooltip">संपादन करा</Tooltip>}
            >
              <a
                className="me-2 p-2"
                onClick={() => {
                  onEditClick(record.waid);
                }}
              >
                <Edit className="feather-edit" />
              </a>
            </OverlayTrigger>

            <OverlayTrigger
              placement="top"
              overlay={<Tooltip id="delete-tooltip">हटवा</Tooltip>}
            >
              <Link
                className="confirm-text p-2"
                to="#"
                onClick={() => showConfirmationAlert(record.waid)}
              >
                <Trash2 className="feather-trash-2" />
              </Link>
            </OverlayTrigger>
          </div>
        </div>
      ),
    },
  ];


  //   {
  //     title: (
  //       <div className="text-center">WareHouse Name</div>
  //     ),

  //     dataIndex: "wname",
  //     sorter: (a, b) => a.wname.length - b.wname.length,
  //     width: 300,
  //     className: "w-20",
  //     render: (text) => <div style={{ whiteSpace: 'nowrap' }}>{text}</div>
  //   },
  //   {
  //     title: (
  //       <div className="text-center">Intercom Extension</div>
  //     ),

  //     dataIndex: "wintercomextension",
  //     width: 300,
  //     className: "text-end w-20",
  //     render: (text) => <div style={{ whiteSpace: 'nowrap' }}>{text}</div> // Prevent text wrapping
  //   },
  //   {
  //     title: (
  //       <div className="text-center">City</div>
  //     ),
  //     dataIndex: "wcity",
  //     sorter: (a, b) => a.wcity.length - b.wcity.length,
  //     width: 500,
  //     className: "w-30",
  //   },
  //   {
  //     title: (
  //       <div className="text-center">State</div>
  //     ),
  //     dataIndex: "wstate",
  //     sorter: (a, b) => a.wstate.length - b.wstate.length,
  //     width: 500,
  //     className: "w-30",
  //   },
  //   {
  //     title: (
  //       <div className="text-center">pincode</div>
  //     ),
  //     dataIndex: "wpincode",
  //     width: 300,
  //     className: "w-20",
  //     render: (text) => <div style={{ textAlign: "right" }}>{text}</div>,


  //   },

  //   {
  //     title: (
  //       <div className="text-center">Action</div>
  //     ),

  //     dataIndex: "action",
  //     render: (_, record) => (
  //       <div className="action-table-data">
  //         <div className="edit-delete-action">
  //           {/* <Link className="me-2 p-2" to={route.AddWarehouseForm}>
  //             <Eye className="feather-view" />
  //           </Link> */}
  //           <a
  //             className="me-2 p-2"
  //             onClick={() => { onEditClick(record.waid) }}
  //           >  <Edit className="feather-edit" /></a>
  //           <Link
  //             className="confirm-text p-2"
  //             to="#"
  //             onClick={() => showConfirmationAlert(record.waid)}
  //           >
  //             <Trash2 className="feather-trash-2" />
  //           </Link>
  //         </div>
  //       </div>
  //     ),
  //   },
  // ];

  const MySwal = withReactContent(Swal);

  const showConfirmationAlert = () => {
    MySwal.fire({
      title: "तुम्हाला खात्री आहे का?",
      text: "हे पूर्ववत करता येणार नाही!",
      showCancelButton: true,
      confirmButtonColor: "#00ff00",
      confirmButtonText: "हो, हटवा!",
      cancelButtonColor: "#ff0000",
      cancelButtonText: "रद्द करा",
      allowOutsideClick: false,
      allowEscapeKey: false,

    }).then((result) => {
      if (result.isConfirmed) {
        MySwal.fire({
          title: "हटवले गेले!",
          text: "तुमची फाईल हटवण्यात आली आहे.",
          className: "btn btn-success",
          confirmButtonText: "ठीक आहे",
          customClass: {
            confirmButton: "btn btn-success",
          },
          allowOutsideClick: false,
          allowEscapeKey: false,

        });
      } else {
        MySwal.close();
      }
    });
  };

  // Empty data source
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
              <h3>गोडाऊन नोंदवा </h3>
              {/* <h6>Manage your WareHouse</h6> */}
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
            <Link to={route.AddWarehouseForm} className="btn btn-added">
              <PlusCircle className="me-2 iconsize" />गोडाउन नोंदवा
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
                <Table columns={columns} dataSource={warehouses} />
              </div>
            )}
          </div>
        </div>


        <Brand />
      </div>
    </div>
  );
};

export default WarehouseMaster;
