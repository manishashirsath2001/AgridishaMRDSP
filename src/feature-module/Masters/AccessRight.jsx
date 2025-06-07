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

const AccessRight = () => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.toggle_header);
  const route = all_routes;
  const [AccessRightData, setAccessRightData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const handleShortcut = (e) => {
      if (e.ctrlKey && e.key === 'a') {
        e.preventDefault();
        navigate(route.AddAccessRight);
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
          "pkid": "%",
          "keyword": "%"
        }
        const headers = {
          "Content-Type": "application/json",
          Accept: "*/*",
        };

        axios({
          method: "POST",
          url: baseUrl.Url + "/backend/api/GET_AccessRights_/getByID",
          data: JSON.stringify(payload),
          headers: headers,
        })
          .then((response) => {
            if (response.status != 200) throw new Error("Failed to fetching Access Right Data");
            const DATA = response.data;
            setAccessRightData(DATA);
          })

      } catch (error) {
        console.error("Error fetching Access Right Data:", error);
      }
    };

    fetchRackData();
  }, []);

  const OnReloadData = () => {
    try {
      const payload = {
        "pkid": "%",
        "keyword": "%"
      }
      const headers = {
        "Content-Type": "application/json",
        Accept: "*/*",
      };

      axios({
        method: "POST",
        url: baseUrl.Url + "/backend/api/GET_AccessRights_/getByID",
        data: JSON.stringify(payload),
        headers: headers,
      })
        .then((response) => {
          if (response.status != 200) throw new Error("Failed to fetching Access Right Data");
          const DATA = response.data;
          setAccessRightData(DATA);
        })

    } catch (error) {
      console.error("Error fetching Access Right Data:", error);
    }
  }

  const onEditClick = (accessRightsAutoID1) => {
    navigate(route.AddAccessRight, { state: { AccessRightsAutoID1: accessRightsAutoID1 } });
  };

  const columns = [
    {
      title: "आयडी", // ID
      dataIndex: "accessRightID",
      sorter: (a, b) => a.accessRightID.length - b.accessRightID.length,
    },
    {
      title: "ऍक्सेस हक्क", // Access Right
      dataIndex: "accessRightTitle",
      sorter: (a, b) => a.accessRightTitle.length - b.accessRightTitle.length,
    },
    {
      title: "वर्णन", // Description
      dataIndex: "accessRightDescription",
      sorter: (a, b) => a.accessRightDescription.length - b.accessRightDescription.length,
    },
    {
      title: "अ‍ॅप ग्रुप", // A.G. = Application Group
      dataIndex: "applicationGroup",
      sorter: (a, b) => a.applicationGroup.length - b.applicationGroup.length,
    },
    {
      title: "वापरकर्ता गट", // U.G. = User Group
      dataIndex: "accessRightGroup",
      sorter: (a, b) => a.accessRightGroup.length - b.accessRightGroup.length,
    },
    {
      title: "क्रिया", // Action
      dataIndex: "action",
      render: (_, record) => (
        <div className="action-table-data">
          <div className="edit-delete-action">
            <button
              className="btn btn-link me-2 p-2"
              onClick={() => onEditClick(record.accessRightsAutoID1)}
            >
              <Edit className="feather-edit" />
            </button>
            <Link
              className="confirm-text p-2"
              to="#"
              onClick={() => showConfirmationAlert(record.accessRightsAutoID1)}
            >
              <Trash2 className="feather-trash-2" />
            </Link>
          </div>
        </div>
      ),
    },
  ];


  const MySwal = withReactContent(Swal);
  const handleDelete = async (accessRightsAutoID1) => {
    try {
      const payload = {
        "caid": accessRightsAutoID1,
      }
      const headers = {
        "Content-Type": "application/json",
        Accept: "*/*",
      };

      axios({
        method: "POST",
        url: baseUrl.Url + "/backend/api/_SP_DeleteAccessRights_",
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
          "accessRightsAutoID1": "%",
          "keyword": "%"
        }
        const headers = {
          "Content-Type": "application/json",
          Accept: "*/*",
        };

        axios({
          method: "POST",
          url: baseUrl.Url + "/backend/api/GET_AccessRights_/getByID",
          data: JSON.stringify(payload),
          headers: headers,
        })
          .then((response) => {
            if (response.status != 200) throw new Error("Failed to fetching Access Right Data");
            const DATA = response.data;
            setAccessRightData(DATA);
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
        title: "त्रुटी",
        text: "डेटा सेव्ह करण्यात अयशस्वी. कृपया पुन्हा प्रयत्न करा.",
        allowOutsideClick: false,
        allowEscapeKey: false
      });
    }

  };
  const showConfirmationAlert = (accessRightsAutoID1) => {
    MySwal.fire({
      title: "तुम्हाला खात्री आहे का?",
      text: "हे कृती उलटवता येणार नाही!",
      showCancelButton: true,
      confirmButtonColor: "#00ff00",
      confirmButtonText: "होय, हटवा!",
      cancelButtonColor: "#ff0000",
      cancelButtonText: "रद्द करा",
      allowOutsideClick: false,
      allowEscapeKey: false
    }).then((result) => {
      if (result.isConfirmed) {
        handleDelete(accessRightsAutoID1);
      } else {
        MySwal.close();
      }
    });
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

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="add-item d-flex">
            <div className="page-title">
              <h3>Access Right Master</h3>
              <h6>Manage Access Right</h6>
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
            <Link to={route.AddAccessRight} className="btn btn-added">
              <PlusCircle className="me-2 iconsize" /> Add AccessRight
            </Link>
          </div>
          <div className="page-btn">
            <Link to={route.UserIndex} className="btn btn-secondary">
              <ArrowLeft className="me-2" />
              Back to Index
            </Link>
          </div>
        </div>

        <div className="card table-list-card">
          <div className="card-body">
            <div className="table-responsive">
              <Table columns={columns} dataSource={AccessRightData} />
            </div>
          </div>
        </div>

        <Brand />
      </div>
    </div>
  );
};

export default AccessRight;
