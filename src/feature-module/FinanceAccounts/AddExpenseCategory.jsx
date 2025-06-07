import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import axios from "axios";
import { ACSPLGUID, baseUrl } from "../../core/json/custom";
import { useRef } from "react";
import { ArrowLeft } from "feather-icons-react/build/IconComponents";

const AddExpenseCategory = ({ EXPCAID }) => {
  console.log(EXPCAID);
  const GUID = ACSPLGUID.getNew();
  const [formData, setFormData] = useState({
    EXPCAID: "",
    EXPNAME: "",
    EXPDESCRIPTION: "",
  })
  // const navigate = useNavigate();
  const EXPNAMERef = useRef(null);
  const EXPDESCRIPTIONRef = useRef(null);
  const submitRef = useRef();

  const MySwal = withReactContent(Swal);
  useEffect(() => {
    if (EXPCAID) {
      try {
        const payload1 = {
          "expcaid": EXPCAID,
          "companyid": "",
          "deptid": ""
        }
        const headers = {
          "Content-Type": "application/json",
          Accept: "*/*",
        };

        axios({
          method: "POST",
          url: baseUrl.Url + "/backend/api/GET_ExpenseCategory",
          data: JSON.stringify(payload1),
          headers: headers,
        })
          .then((response) => {
            if (response.status != 200) throw new Error("Failed to Fetching Data");
            let apiData = response.data[0];

            setFormData(prev => ({
              ...prev,
              EXCPAID: apiData.expcaid,
              EXPNAME: apiData.expname,
              EXPDESCRIPTION: apiData.expdescription,

            }));
            console.log("Expense data", apiData);
          })

      } catch (error) {
        console.error("Error fetching Access Right Data:", error);
      }
    }
  }, [EXPCAID]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data Submitted: ", formData);
    const form = e.target.closest("form");
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    showConfirmationAlert();
    console.log("Form Data Submitted: ", formData);
  };

  const showConfirmationAlert = () => {
    MySwal.fire({
      title: 'तुम्हाला खात्री आहे का?',
      text: 'तुम्हाला ही माहिती जतन करायची आहे का?',
      showCancelButton: true,
      confirmButtonColor: '#00ff00',
      confirmButtonText: 'जतन करा',
      cancelButtonColor: '#092C4C',
      cancelButtonText: 'रद्द करा',
      allowOutsideClick: false,
      allowEscapeKey: false,

    }).then((result) => {
      if (result.isConfirmed) {
        handleFormSubmission();
      }
    });
  };

  const handleFormSubmission = async () => {
    try {
      const payload = {
        "expcaid": EXPCAID ? EXPCAID : GUID.getNew(),
        "expname": formData.EXPNAME,
        "expdescription": formData.EXPDESCRIPTION,
        "companyid": "",
        "deptid": ""
      };

      const headers = {
        "Content-Type": "application/json",
        Accept: "*/*",
      };

      const response = await axios({
        method: "POST",
        url: baseUrl.Url + "/backend/api/SP_AddUpdExpenseCategory",
        data: JSON.stringify(payload),
        headers: headers,
      });

      console.log("Response Received:", response.data);

      if (response.status === 200) {

        MySwal.fire({
          icon: "success",
          title: "जतन झाले!",
          text: "माहिती यशस्वीरीत्या जतन झाली.",
          confirmButtonText: "ठीक आहे",
          allowOutsideClick: false,
          allowEscapeKey: false,

        }).then((result) => {
          if (result.isConfirmed) {

            const modal = document.getElementById("AddExpenseCategory");
            if (modal) {
              modal.classList.remove("show");
              modal.style.display = "none";
              modal.setAttribute("aria-hidden", "true");
            }

            const backdrop = document.querySelector(".modal-backdrop");
            if (backdrop) {
              backdrop.remove();
            }

            document.body.classList.remove("modal-open");
            document.body.style.overflow = "auto";

            setFormData({
              EXPNAME: "",
              EXPDESCRIPTION: ""
            });

          }
        });
      }
    } catch (error) {
      console.error("Submission Error:", error);
      MySwal.fire({
        icon: "error",
        title: "त्रुटी",
        text: "डेटा जतन करण्यात अयशस्वी. कृपया पुन्हा प्रयत्न करा.",
        allowOutsideClick: false,
        allowEscapeKey: false,
      });
    }
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  useEffect(() => {
    const handleShortcut = (e) => {
      if (e.ctrlKey && (e.key === 'e' || e.key === 'E')) {
        e.preventDefault();
        showExitAlert();
      }
      if (e.ctrlKey && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        checkFormValidity(e);
      }
    };
    window.addEventListener('keydown', handleShortcut);

    return () => {
      window.removeEventListener('keydown', handleShortcut);
    };
  }, [formData]);

  const checkFormValidity = (e) => {
    const { EXPNAME, EXPDESCRIPTION } = formData;

    if (!EXPNAME || !/^[a-zA-Z0-9]+$/.test(EXPNAME)) {
      Swal.fire({
        icon: "error",
        title: "वैधता त्रुटी",
        text: "कृपया वैध खर्च नाव द्या (फक्त अक्षरे आणि अंक).",
        allowOutsideClick: false,
        allowEscapeKey: false,
      }).then(() => {
        setTimeout(() => {
          EXPNAMERef.current?.focus();
        }, 1000);
      });
      return;
    }

    if (!EXPDESCRIPTION || EXPDESCRIPTION.trim() === "") {
      Swal.fire({
        icon: "error",
        title: "वैधता त्रुटी",
        text: "कृपया वर्णन भरा.",
        allowOutsideClick: false,
        allowEscapeKey: false,
      }).then(() => {
        setTimeout(() => {
          EXPDESCRIPTIONRef.current?.focus();
        }, 1000);
      });
      return;
    }



    handleSubmit(e);
  };


  const showExitAlert = () => {
    MySwal.fire({
      title: "तुम्हाला खात्री आहे का?",
      text: "तुम्हाला बाहेर पडायचे आहे का?",
      showCancelButton: true,
      confirmButtonColor: "#00ff00",
      confirmButtonText: "होय",
      cancelButtonColor: "#092C4C",
      cancelButtonText: "नाही",
      allowOutsideClick: false,
      allowEscapeKey: false,

    }).then((result) => {
      if (result.isConfirmed) {
        // Reset formData
        setFormData({
          EXPNAME: "",
          EXPDESCRIPTION: "",
        });

        const modal = document.getElementById("AddExpenseCategory");
        if (modal) {
          modal.classList.remove("show");
          modal.style.display = "none";
          modal.setAttribute("aria-hidden", "true");

          const modalBackdrop = document.querySelector(".modal-backdrop");
          if (modalBackdrop) {
            modalBackdrop.remove();
          }
          document.body.classList.remove("modal-open");
          document.body.style.overflow = "auto";
        }
      }
    });
  };

  const handleEnterKey = (e, nextRef) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (nextRef && nextRef.current) {
        nextRef.current.focus();
      }
    }
  }


  return (
    <div>
      <div className="modal fade" id="AddExpenseCategory">
        <div className="modal-dialog modal-dialog-centered custom-modal-two">
          <div className="modal-content">
            <div className="page-wrapper-new p-0">
              <div className="content">
                <div className="modal-header border-0 custom-modal-header">
                  <div className="page-title">
                    <h4>खर्च श्रेणी जोडा</h4>
                  </div>
                  <div className="page-btn">
                    <Link
                      className="btn btn-secondary"
                      onClick={showExitAlert}
                    >
                      <ArrowLeft className="" />
                      मागे
                    </Link>
                  </div>
                </div>
                <div className="modal-body custom-modal-body">
                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-lg-12">
                        <div className="mb-3">
                          <label className="form-label">खर्चाचे नाव</label>
                          <input
                            type="text"
                            className="form-control"
                            name="EXPNAME"
                            ref={EXPNAMERef}
                            value={formData.EXPNAME}
                            onChange={handleInputChange}
                            onKeyDown={(e) => handleEnterKey(e, EXPDESCRIPTIONRef)}
                            required
                          />
                        </div>
                      </div>
                      {/* Editor */}
                      <div className="col-md-12">
                        <div className="edit-add card">
                          <div className="edit-add">
                            <label className="form-label">वर्णन</label>
                          </div>
                          <div className="card-body-list input-blocks mb-0">
                            <textarea
                              className="form-control"
                              defaultValue={""}
                              name="EXPDESCRIPTION"
                              ref={EXPDESCRIPTIONRef}
                              value={formData.EXPDESCRIPTION}
                              onChange={handleInputChange}
                              onKeyDown={(e) => handleEnterKey(e, submitRef)}
                              required
                            />
                          </div>

                        </div>
                      </div>
                      {/* /Editor */}
                    </div>
                    <div className="modal-footer-btn">
                      <button
                        type="button"
                        className="btn btn-cancel me-2"
                        onClick={showExitAlert}
                      >
                        रद्द करा
                      </button>
                      <button type="submit" className="btn btn-submit"
                        ref={submitRef}>
                        जतन करा
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddExpenseCategory;
