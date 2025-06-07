import React, { useEffect, useState } from "react";
import { baseUrl, ACSPLGUID } from "../../core/json/custom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  ArrowLeft, Trash2, Edit,
} from "feather-icons-react/build/IconComponents";
const VyapariApprove = ({ baid, onRefresh }) => {
  const navigate = useNavigate();
  const GUID = ACSPLGUID.getNew();
  const MySwal = withReactContent(Swal);

  const [formData, setFormData] = useState({
    baid: "",
    maid: "",
    fname: "",
    btokanno: "",
    date: "",
    weight: "",
    weightminmax: "",
    rate: ""
  });

  const showConfirmationAlert = () => {
    MySwal.fire({
      title: "तुम्हाला खात्री आहे का?",
      text: "तुम्ही हा डेटा जतन करू इच्छिता का?",
      showCancelButton: true,
      confirmButtonColor: "#00ff00",
      confirmButtonText: "जतन करा",
      cancelButtonColor: "#092C4C",
      cancelButtonText: "रद्द करा",
      allowOutsideClick: false,
      allowEscapeKey: false,

    }).then((result) => {
      if (result.isConfirmed) {
        handleButtonClick();
      }
    });
  };

  // const handleSave = async () => {
  //   try {
  //     const payload = {
  //       vaid: baid || GUID,
  //       farmername: formData.maid,
  //       tokennumber: formData.btokanno,
  //       isapporved: true,
  //       jaali: formData.date,
  //       rate: formData.rate,
  //       weight: formData.weight,
  //       weightless: formData.weightminmax,
  //       reasons: "",
  //       companyid: "",
  //       deptid: ""
  //     };

  //     const headers = {
  //       "Content-Type": "application/json",
  //       Accept: "*/*"
  //     };

  //     const response = await axios.post(
  //       `${baseUrl.Url}/backend/api/SP_AddUpdVyapariApproval`,
  //       JSON.stringify(payload),
  //       { headers }
  //     );

  //     Swal.fire({
  //       icon: "success",
  //       title: "जतन झाले!",
  //       text: "डेटा यशस्वीरित्या जतन केला.",
  //       confirmButtonText: "ठीक आहे"
  //     }).then(() => {
  //       navigate("/VApproveMaster");
  //       window.location.reload();
  //     });

  //     console.log("Save API Response:", response.data);
  //   } catch (error) {
  //     console.error("Save Error:", error);
  //     Swal.fire({
  //       icon: "error",
  //       title: "ओह... काहीतरी चुकीचे झाले",
  //       text: "डेटा जतन करताना काहीतरी चुकले.",
  //       confirmButtonText: "ठीक आहे"
  //     });
  //   }
  // };

  const handleButtonClick = async (maid) => {
    const data = tableData.find(item => item.baid == baid);
    try {
      const payload = {
        maid: data.maid,
        isvyapariverified: true,
        companyid: "",
        deptid: ""
      };

      const headers = {
        "Content-Type": "application/json",
        Accept: "*/*"
      };

      const response = await axios.post(
        `${baseUrl.Url}/backend/api/SP_AddUpdVyapariApproveFarmer`,
        JSON.stringify(payload),
        { headers }
      );

      Swal.fire({
        icon: "success",
        title: "मान्यता दिली!",
        text: "शेतकरी यशस्वीरित्या मान्य झाला.",
        confirmButtonText: "ठीक आहे",
        allowOutsideClick: false,
        allowEscapeKey: false,


      }).then(() => {
        const modal = document.getElementById("VyapariApprove");
        if (modal) {
          modal.classList.remove("show");
          modal.style.display = "none";
          modal.setAttribute("aria-hidden", "true");

          const backdrops = document.querySelectorAll(".modal-backdrop");
          backdrops.forEach((backdrop) => {
            backdrop.parentNode.removeChild(backdrop);
          });

          document.body.classList.remove("modal-open");
          document.body.style.overflow = "auto";
          document.body.style.paddingRight = "";
        }
        if (onRefresh) {
          onRefresh();
        }
      });

      console.log("Approve API Response:", response.data);
    } catch (error) {
      console.error("Approval Error:", error);
      Swal.fire({
        icon: "error",
        title: "ओह... काहीतरी चुकीचे झाले",
        text: "मान्यता देताना त्रुटी आली.",
        confirmButtonText: "ठीक आहे",
        allowOutsideClick: false,
        allowEscapeKey: false,

      });
    }
  };
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    if (baid != '') {
      const fetchData = async () => {
        try {
          const payload = {
            baid: baid || "",
            keyword: "%",
            companyid: "",
            deptid: ""
          };

          const headers = {
            "Content-Type": "application/json",
            Accept: "*/*"
          };

          const response = await axios.post(
            `${baseUrl.Url}/backend/api/GET_VyapariApprove`,
            payload,
            { headers }
          );

          if (response.status === 200 && response.data.length > 0) {
            setTableData(response.data)
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchData();
    }
  }, [baid]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const onproccedclick = (bdaid) => {
    const data = tableData.find(item => item.bdaid == bdaid);
    if (!data) {
      console.warn('No matching record found for BAID:', bdaid);
      return;
    }
    setFormData({
      baid: data.baid,
      maid: data.maid,
      fname: data.fname,
      btokanno: data.btokanno,
      date: data.date,
      weight: data.weight,
      weightminmax: data.weightminmax,
      rate: data.rate
    });
  }

  const CloseModel = () => {
    const modal = document.getElementById("VyapariApprove");
    if (modal) {
      modal.classList.remove("show");
      modal.style.display = "none";
      modal.setAttribute("aria-hidden", "true");

      const backdrops = document.querySelectorAll(".modal-backdrop");
      backdrops.forEach((backdrop) => {
        backdrop.parentNode.removeChild(backdrop);
      });

      document.body.classList.remove("modal-open");
      document.body.style.overflow = "auto";
      document.body.style.paddingRight = "";
    }
    if (onRefresh) {
      onRefresh();
    }
    setFormData({
      baid: "",
      maid: "",
      fname: "",
      btokanno: "",
      date: "",
      weight: "",
      weightminmax: "",
      rate: ""
    });
  }
  return (
    <div>
      <div className="modal fade" id="VyapariApprove" data-bs-backdrop="static"
        data-bs-keyboard="false">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content border-0 shadow rounded-4">
            <div className="modal-header bg-primary text-white rounded-top-4 px-4 py-3">
              <h5 className="modal-title">शेतकरी पावती माहिती</h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={CloseModel}
                aria-label="Close"
              ></button>
            </div>

            <div className="modal-body px-4 py-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  showConfirmationAlert();
                }}
              >
                <div className="modal-body-table responsive-no-scroll">
                  <div className="table-responsive">
                    <table className="table table-bordered table-striped mb-0">
                      <thead className="thead-dark bg-dark text-white">
                        <tr>
                          <th>टो.नं.</th>
                          <th>तारीख</th>
                          <th>वजन</th>
                          <th>वजन -/+</th>
                          <th>भाव</th>
                          <th>कृती</th>
                        </tr>
                      </thead>

                      <tbody>
                        {tableData.length > 0 ? (
                          tableData.map((row, index) => (
                            <tr key={row.bdaid}>
                              <td>{row.btokanno}</td>
                              <td>{row.date}</td>
                              <td>{row.weight}</td>
                              <td>{row.weightminmax}</td>
                              <td>{row.rate}</td>
                              <td>
                                <Link
                                  to="#"
                                  onClick={() => { onproccedclick(row.bdaid) }}
                                  className="me-2 p-1"
                                  style={{ color: 'lightblue' }}
                                >
                                  <Edit className="feather-edit" />
                                </Link>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="4" className="text-center">
                              No Data Available
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="row g-3">
                  <div className="col-6 col-lg-4">
                    <label className="form-label fw-semibold">तारीख</label>
                    <input
                      type="text"
                      name="date"
                      className="form-control shadow-sm"
                      value={formData.date}
                      readOnly
                    />
                  </div>

                  <div className="col-6 col-lg-4">
                    <label className="form-label fw-semibold">टोकन नंबर</label>
                    <input
                      type="text"
                      name="btokanno"
                      className="form-control shadow-sm"
                      value={formData.btokanno}
                      readOnly
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-semibold">शेतकरी नाव</label>
                    <input
                      type="text"
                      name="fname"
                      className="form-control shadow-sm"
                      value={formData.fname}
                      readOnly
                    />
                  </div>

                  <div className="col-6 col-lg-4">
                    <label className="form-label fw-semibold">वजन</label>
                    <input
                      type="text"
                      name="weight"
                      className="form-control shadow-sm"
                      value={formData.weight}
                      readOnly
                    />
                  </div>

                  <div className="col-6 col-lg-4">
                    <label className="form-label fw-semibold">वजन कमी/जास्त</label>
                    <input
                      type="text"
                      name="weightminmax"
                      className="form-control shadow-sm"
                      value={formData.weightminmax}
                      readOnly
                    />
                  </div>

                  <div className="col-12 col-lg-4">
                    <label className="form-label fw-semibold">भाव</label>
                    <input
                      type="text"
                      name="rate"
                      className="form-control shadow-sm"
                      value={formData.rate}
                      readOnly
                    />
                  </div>
                </div>

                <div className="mt-4 d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    className="btn btn-success px-4"
                    onClick={() => handleButtonClick(formData.maid)}

                  >
                    मान्यता द्या
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary px-4"
                    onClick={CloseModel}
                  >
                    मागे
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

};

export default VyapariApprove;

