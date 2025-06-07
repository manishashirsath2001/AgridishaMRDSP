import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Brand from "../../core/modals/inventory/brand";
// import withReactContent from "sweetalert2-react-content";
// import Swal from "sweetalert2";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { all_routes } from "../../Router/all_routes";
import Table from "../../core/pagination/datatable";
import axios from "axios";
import ImageWithBasePath from "../../core/img/imagewithbasebath";
import { Edit, PlusCircle, ArrowLeft, RotateCcw, ChevronUp } from "feather-icons-react/build/IconComponents";
import { baseUrl } from "../../core/json/custom"
import { useDispatch } from "react-redux";
import { setToogleHeader } from "../../core/redux/action";
const HSNMaster = () => {
  const route = all_routes;
  const [hsnData, setHsnData] = useState([]);
  const navigate = useNavigate();
  const data = useSelector((state) => state.toggle_header);
  const [searchQuery, setSearchQuery] = useState("");
  const dispatch = useDispatch();
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
        url: baseUrl.Url + "/backend/api/_GET_HSNMasters_/Serch",
        data: JSON.stringify(payload),
        headers: headers,
      })

        .then((response) => {
          if (response.status != 200) throw new Error("Failed to send otp");
          console.log("response", response.data);
          setHsnData(response.data);
        })
    } catch (error) {
      console.error("Error while searching HSN data:", error);
    }
  };

  useEffect(() => {
    const handleShortcut = (e) => {
      if (e.ctrlKey && e.key === 'a') {
        e.preventDefault();
        navigate(route.AddHSNMaster);
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
        }
        const headers = {
          "Content-Type": "application/json",
          Accept: "*/*",
        };

        axios({
          method: "POST",
          url: baseUrl.Url + "/backend/api/_GET_HSNMasters_/getByID",
          data: JSON.stringify(payload),
          headers: headers,
        })
          .then((response) => {
            if (response.status != 200) throw new Error("Failed to send otp");
            console.log("response", response.data);
            const DATA = response.data;
            setHsnData(DATA);
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
      }
      const headers = {
        "Content-Type": "application/json",
        Accept: "*/*",
      };

      axios({
        method: "POST",
        url: baseUrl.Url + "/backend/api/_GET_HSNMasters_/getByID",
        data: JSON.stringify(payload),
        headers: headers,
      })
        .then((response) => {
          if (response.status != 200) throw new Error("Failed to send otp");
          console.log("response", response.data);
          const DATA = response.data;
          setHsnData(DATA);
        })

    } catch (error) {
      console.error("Error fetching HSN data:", error);
    }
  }

  const onEditClick = (haid) => {
    navigate(route.AddHSNMaster, { state: { HAID: haid } });
  };


  const columns = [
    {
      title: (
        <div className="text-center">प्रकार</div>
      ),
      dataIndex: "implicationTitle",
      sorter: (a, b) => a.implicationTitle.length - b.implicationTitle.length,
      render: (text) => <div style={{ textAlign: "left" }}>{text}</div>,
      width: "200px",
    },
    {
      title: (
        <div className="text-center">HSN कोड</div>
      ),
      dataIndex: "hcode",
      sorter: (a, b) => a.hcode.length - b.hcode.length,
      render: (text) => <div style={{ textAlign: "right" }}>{text}</div>,
      width: "200px",
    },


    {
      title: (
        <div className="text-center">क्रिया</div>
      ),
      dataIndex: "action",
      width: "200px",
      render: (_, record) => (
        <div className="action-table-data">
          <div className="edit-delete-action">

            <OverlayTrigger
              placement="top"
              overlay={<Tooltip id="edit-tooltip">संपादित करा</Tooltip>}>
              <a
                className="me-2 p-2"
                onClick={() => { onEditClick(record.haid) }}
              >  <Edit className="feather-edit" /></a>
            </OverlayTrigger>

          </div>
        </div>
      ),
    },
  ];

  // const MySwal = withReactContent(Swal);

  // const handleDelete = async (haid) => {
  //   try {
  //     const payload = {
  //       "haid": haid,
  //     }
  //     const headers = {
  //       "Content-Type": "application/json",
  //       Accept: "*/*",
  //     };

  //     axios({
  //       method: "POST",
  //       url: baseUrl.Url + "/backend/api/_SP_DeleteHSNMaster_",
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
  //         url: baseUrl.Url + "/backend/api/_GET_HSNMasters_/getByID",
  //         data: JSON.stringify(payload),
  //         headers: headers,
  //       })
  //         .then((response) => {
  //           if (response.status != 200) throw new Error("Failed to send otp");
  //           console.log("response", response.data);
  //           const DATA = response.data;
  //           setHsnData(DATA);
  //         })

  //     } catch (error) {
  //       console.error("Error fetching HSN data:", error);
  //     }

  //   } catch (error) {
  //     console.error("Submission Error:", error);
  //     Swal.fire({
  //       icon: "error",
  //       title: "Error",
  //       text: "Failed to save data. Please try again.",
  //     });
  //   }

  // };

  // const showConfirmationAlert = (haid) => {
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
  //       handleDelete(haid);
  //     }
  //   });
  // };
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
  // const renderTooltip = (props) => <Tooltip id="tooltip" {...props}>Tooltip Text</Tooltip>;

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="add-item d-flex">
            <div className="page-title">
              <h3 className="mb-1">HSN मास्टर व्यवस्थापित करा</h3>
              {/* <h6>Manage HSN Code</h6> */}
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
            <Link to={route.AddHSNMaster} className="btn btn-added">
              <PlusCircle className="me-2 iconsize" /> HSN जोडा
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
              {/* Pass hsnData to dataSource */}
              <Table columns={columns} dataSource={hsnData} />
            </div>
          </div>
        </div>
        <Brand />
      </div>
    </div>
  );
};

export default HSNMaster;
