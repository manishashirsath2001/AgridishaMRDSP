import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import ImageWithBasePath from "../../core/img/imagewithbasebath";
import Brand from "../../core/modals/inventory/brand";
// import withReactContent from "sweetalert2-react-content";
// import Swal from "sweetalert2";
import { all_routes } from "../../Router/all_routes";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import Table from "../../core/pagination/datatable";
import { setToogleHeader } from "../../core/redux/action";
import { baseUrl } from "../../core/json/custom";
import axios from 'axios';
import { useState, useEffect } from "react";
import { getUserData } from "../../Context/UserData";
import {
  ArrowLeft,
  ChevronUp,
  Edit,

  PlusCircle,
  RotateCcw,

} from "feather-icons-react/build/IconComponents";

const StateCodeMaster = () => {
  const { isAuthenticated, userdetail } = getUserData();
  const dispatch = useDispatch();
  const data = useSelector((state) => state.toggle_header);
  const route = all_routes;
  const [statesList, setStatesList] = useState([]);
  // const [error, setError] = useState(null);
  if (isAuthenticated == true) {
    console.log("user", userdetail);
    console.log("getUserData", getUserData);
  }


  const navigate = useNavigate();
  useEffect(() => {
    const handleShortcut = (e) => {
      if (e.ctrlKey && e.key === 'a') {
        e.preventDefault();
        navigate(route.AddStateCodeMaster);
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
    const fetchStates = async () => {
      try {
        const payload = {
          "pkid": "%"
          , "keyword": "%"

        }
        const headers = {
          "Content-Type": "application/json",
          Accept: "*/*",
        };

        axios({
          method: "POST",
          url: baseUrl.Url + "/backend/api/_GET_StateCodeMasters_/getByID",
          data: JSON.stringify(payload),
          headers: headers,
        })
          .then((response) => {
            if (response.status != 200) throw new Error("Failed to send Data");
            setStatesList(response.data);
          })

      } catch (error) {
        console.error("Error fetching State Code Master data:", error);
      }

    };
    fetchStates();
  }, []);

  const OnReloadData = () => {
    try {
      const payload = {
        "pkid": "%"
        , "keyword": "%"

      }
      const headers = {
        "Content-Type": "application/json",
        Accept: "*/*",
      };

      axios({
        method: "POST",
        url: baseUrl.Url + "/backend/api/_GET_StateCodeMasters_/getByID",
        data: JSON.stringify(payload),
        headers: headers,
      })
        .then((response) => {
          if (response.status != 200) throw new Error("Failed to send Data");
          setStatesList(response.data);
        })

    } catch (error) {
      console.error("Error fetching State Code Master data:", error);
    }
  }

  const onEditClick = (scaid) => {
    navigate(route.AddService, { state: { SCAID: scaid } });
  };
  const columns = [

    {
      title: "राज्य",
      dataIndex: "sstatename",
      sorter: (a, b) => a.sstatename.length - b.sstatename.length,
    },
    {
      title: "राज्य कोड",
      dataIndex: "sstatecode",
    },

    {
      title: "क्रिया",
      dataIndex: "action",
      render: (_, record) => (
        <div className="action-table-data">
          <div className="edit-delete-action">
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip id="edit-tooltip">संपादित करा</Tooltip>}>
              <a
                className="me-2 p-2"
                onClick={() => { onEditClick(record.scaid) }}
              >  <Edit className="feather-edit" /></a>
            </OverlayTrigger>
            {/* <Link className="confirm-text p-2" to="#" onClick={() => showConfirmationAlert(record.scaid)}>
              <Trash2 className="feather-trash-2" />
            </Link> */}
          </div>
        </div>
      ),
    },


  ];

  // const MySwal = withReactContent(Swal);
  // const handleDelete = async (scaid) => {
  //   try {
  //     const payload = {
  //       "scaid": scaid,
  //     }
  //     const headers = {
  //       "Content-Type": "application/json",
  //       Accept: "*/*",
  //     };

  //     axios({
  //       method: "POST",
  //       url: baseUrl.Url + "/backend/api/_SP_DeleteStateCodeMasters_",
  //       data: JSON.stringify(payload),
  //       headers: headers,
  //     })

  //     Swal.fire({
  //       icon: "success",
  //       title: "Deleted!",
  //       text: "Your file has been deleted.",
  //       confirmButtonText: "OK",
  //     });
  //     try {
  //       const payload = {
  //         "pkid": "%"
  //         , "keyword": "%"
  //       }
  //       const headers = {
  //         "Content-Type": "application/json",
  //         Accept: "*/*",
  //       };

  //       axios({
  //         method: "POST",
  //         url: baseUrl.Url + "/backend/api/_GET_StateCodeMasters_/getByID",
  //         data: JSON.stringify(payload),
  //         headers: headers,
  //       })
  //         .then((response) => {
  //           if (response.status != 200) throw new Error("Failed to send Data");
  //           setStatesList(response.data);
  //         })

  //     } catch (error) {
  //       console.error("Error fetching State Code Master data:", error);
  //     }


  //   } catch (error) {
  //     console.error("Submission Error:", error);
  //     Swal.fire({
  //       icon: "error",
  //       title: "Error",
  //       text: "Failed to save data. Please try again.",
  //     });
  //   }
  // }
  // const showConfirmationAlert = (scaid) => {
  //   MySwal.fire({
  //     title: "Are you sure?",
  //     text: "You won't be able to revert this!",
  //     showCancelButton: true,
  //     confirmButtonColor: "#00ff00",
  //     confirmButtonText: "Yes, delete it!",
  //     cancelButtonColor: "#ff0000",
  //     cancelButtonText: "Cancel",
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       handleDelete(scaid);
  //     } else {
  //       MySwal.close();
  //     }
  //   });
  // };

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
  const [searchQuery, setSearchQuery] = useState("");
  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    try {
      const payload = {
        "pkid": "%",
        "keyword": event.target.value

      }
      const headers = {
        "Content-Type": "application/json",
        Accept: "*/*",
      };

      axios({
        method: "POST",
        url: baseUrl.Url + "/backend/api/_GET_StateCodeMasters_/Serch",
        data: JSON.stringify(payload),
        headers: headers,
      })

        .then((response) => {
          if (response.status != 200) throw new Error("Failed to send data");
          console.log("response", response.data);
          setStatesList(response.data);
        })
    } catch (error) {
      console.error("Error while searching State code data:", error);
    }
  };
  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="add-item d-flex">
            <div className="page-title">
              <h3>राज्य कोड मास्टर</h3>
              <h6>राज्य कोड व्यवस्थापित करा</h6>
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
            <Link to={route.AddStateCodeMaster} className="btn btn-added">
              <PlusCircle className="me-2 iconsize" /> राज्य कोड जोडा
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
                  placeholder="शोधा"
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
              <Table
                columns={columns}
                dataSource={statesList.length ? statesList : []}
                rowKey="SCAID"
                locale={{
                  emptyText: 'कोणतीही माहिती मिळाली नाह' // Custom message when there is no data
                }}
              />

            </div>
          </div>
        </div>

        <Brand />
      </div>
    </div>
  );
};

export default StateCodeMaster;

