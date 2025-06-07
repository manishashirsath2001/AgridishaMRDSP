
import React, { useState } from "react";
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
import { useEffect } from "react";
import { baseUrl } from "../../core/json/custom";
import { getUserData } from "../../Context/UserData";
import { ArrowLeft, ChevronUp, Edit, PlusCircle, RotateCcw, Trash2, } from "feather-icons-react/build/IconComponents";
import axios from "axios";

const StoreMaster = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const data = useSelector((state) => state.toggle_header);
  const route = all_routes;
  const [searchQuery, setSearchQuery] = useState("");
  const { isAuthenticated, userdetail } = getUserData();

  const [storeData, setStoreData] = useState([]);

  if (isAuthenticated == true) {
    console.log("user", userdetail);
    console.log("getUserData", getUserData);
  }

  useEffect(() => {
    const handleShortcut = (e) => {
      if (e.ctrlKey && e.key === 'a') {
        e.preventDefault();
        navigate(route.AddStoreMaster);
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

    try {
      const payload = {
        "deptaid": "%",
        "keyword": "%",
        "companyid": userdetail?.companyID ? userdetail.companyID : "",
        "deptid": "%",
      }
      const headers = {
        "Content-Type": "application/json",
        Accept: "*/*",
      };

      axios({
        method: "POST",
        url: baseUrl.Url + "/backend/api/_GET_DepartmentMaster_/getByID",
        data: JSON.stringify(payload),
        headers: headers,
      })
        .then((response) => {
          if (response.status != 200) throw new Error("Failed to get Data"); setStoreData(response.data);
        })

    } catch (error) {
      console.error("Error fetching Store Code Master data:", error);
    }

  }, []);


  const OnReloadData = () => {
    try {
      const payload = {
        "deptaid": "%",
        "keyword": "%",
        "companyid": userdetail?.companyID ? userdetail.companyID : "",
        "deptid": "%",
      }
      const headers = {
        "Content-Type": "application/json",
        Accept: "*/*",
      };

      axios({
        method: "POST",
        url: baseUrl.Url + "/backend/api/_GET_DepartmentMaster_/getByID",
        data: JSON.stringify(payload),
        headers: headers,
      })
        .then((response) => {
          if (response.status != 200) throw new Error("Failed to get Data"); setStoreData(response.data);
        })

    } catch (error) {
      console.error("Error fetching Store Code Master data:", error);
    }
  }

  const onEditClick = (daid) => {
    navigate(route.AddStoreMaster, { state: { DAID: daid } });
  };

  const columns = [
    {
      title: (
        <OverlayTrigger placement="top" overlay={<Tooltip>Unique code for the store</Tooltip>}>
          <div>Department Code</div>
        </OverlayTrigger>
      ),
      dataIndex: "dcode",
      sorter: (a, b) => a.dcode.length - b.dcode.length,
    },
    {
      title: (
        <OverlayTrigger placement="top" overlay={<Tooltip>Full name of the store</Tooltip>}>
          <div>Department Name</div>
        </OverlayTrigger>
      ),
      dataIndex: "dname",
      sorter: (a, b) => a.dname.length - b.dname.length,
    },
    {
      title: (
        <OverlayTrigger placement="top" overlay={<Tooltip>Warehouse ID associated with the store</Tooltip>}>
          <div>Warehouse ID</div>
        </OverlayTrigger>
      ),
      dataIndex: "waid",
      sorter: (a, b) => a.waid.length - b.waid.length,
    },
    {
      title: (
        <OverlayTrigger placement="top" overlay={<Tooltip>Intercom extension for the store</Tooltip>}>
          <div>Intercom Extension</div>
        </OverlayTrigger>
      ),
      dataIndex: "dintercomextension",
    },
    {
      title: (
        <OverlayTrigger placement="top" overlay={<Tooltip>City where the store is located</Tooltip>}>
          <div>Department City</div>
        </OverlayTrigger>
      ),
      dataIndex: "dcity",
    },
    {
      title: (
        <OverlayTrigger placement="top" overlay={<Tooltip>State where the store is located</Tooltip>}>
          <div>Department State</div>
        </OverlayTrigger>
      ),
      dataIndex: "dstate",
    },
    {
      title: (
        <OverlayTrigger placement="top" overlay={<Tooltip>Perform actions like edit or delete</Tooltip>}>
          <div className="d-flex justify-content-center">Action</div>
        </OverlayTrigger>
      ),
      dataIndex: "action",
      render: (_, record) => (
        <div className="action-table-data">
          <div className="edit-delete-action">
            {/* Edit Action */}
            <OverlayTrigger placement="top" overlay={<Tooltip>Edit this Department</Tooltip>}>
              <a
                className="me-2 p-2"
                onClick={() => {
                  onEditClick(record.daid);
                }}
              >
                <Edit className="feather-edit" />
              </a>
            </OverlayTrigger>
            {/* Delete Action */}
            <OverlayTrigger placement="top" overlay={<Tooltip>Delete this Department</Tooltip>}>
              <Link className="confirm-text p-2" to="#" onClick={() => showConfirmationAlert(record.daid)}>
                <Trash2 className="feather-trash-2" />
              </Link>
            </OverlayTrigger>
          </div>
        </div>
      ),
    },
  ];


  const MySwal = withReactContent(Swal);
  const handleDelete = async (daid) => {
    try {
      const payload = {
        "daid": daid
        , "companyid": userdetail?.companyID ? userdetail.companyID : "",
        "deptid": userdetail?.departmentID ? userdetail.departmentID : ""
      }
      const headers = {
        "Content-Type": "application/json",
        Accept: "*/*",
      };

      axios({
        method: "POST",
        url: baseUrl.Url + "/backend/api/_SP_DeleteDepartmentMaster_",
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
          "deptaid": "%",
          "keyword": "%",
          "companyid": userdetail?.companyID ? userdetail.companyID : "",
          "deptid": "%",
        }
        const headers = {
          "Content-Type": "application/json",
          Accept: "*/*",
        };

        axios({
          method: "POST",
          url: baseUrl.Url + "/backend/api/_GET_DepartmentMaster_/getByID",
          data: JSON.stringify(payload),
          headers: headers,
        })
          .then((response) => {
            if (response.status != 200) throw new Error("Failed to get Data");
            setStoreData(response.data);
          })

      } catch (error) {
        console.error("Error fetching Store Code Master data:", error);
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


  const showConfirmationAlert = (daid) => {
    MySwal.fire({
      title: "आपण खात्रीने हटवू इच्छिता?",
      text: "हे क्रियाकलाप पूर्ववत करता येणार नाही!",
      showCancelButton: true,
      confirmButtonColor: "#00ff00",
      confirmButtonText: "होय, हटवा!",
      cancelButtonColor: "#ff0000",
      cancelButtonText: "रद्द करा",
      allowOutsideClick: false,
      allowEscapeKey: false,

    }).then((result) => {
      if (result.isConfirmed) {
        handleDelete(daid)
      } else {
        MySwal.close();
      }
    });
  };


  // Empty data source
  // const dataSource = [storeData];

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


  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    try {
      const payload = {
        "pkid": "%",
        "keyword": event.target.value,
        "companyid": userdetail?.companyID ? userdetail.companyID : "",
        "deptid": "%",
      }
      const headers = {
        "Content-Type": "application/json",
        Accept: "*/*",
      };

      axios({
        method: "POST",
        url: baseUrl.Url + "/backend/api/_GET_DepartmentMaster_/Search",
        data: JSON.stringify(payload),
        headers: headers,
      })

        .then((response) => {
          if (response.status != 200) throw new Error("Failed to send otp");
          console.log("response", response.data);
          setStoreData(response.data);
        })
    } catch (error) {
      console.error("Error while searching Store data:", error);
    }
  };
  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="add-item d-flex">
            <div className="page-title">
              <h3>Department Master</h3>
              <h6>Manage your Department</h6>
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
            <Link to={route.AddStoreMaster} className="btn btn-added">
              <PlusCircle className="me-2 iconsize" />विभाग नोंदवा
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
            <div className="table-responsive">
              <Table columns={columns} dataSource={storeData} />
            </div>
          </div>
        </div>

        <Brand />
      </div>
    </div>
  );
};

export default StoreMaster;