import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import { Calendar } from "react-feather";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { ArrowLeft } from "feather-icons-react/build/IconComponents";
import { ACSPLGUID, baseUrl, convertToISODate } from "../../core/json/custom";
import axios from "axios";

const AddExpense = ({ EXPAID }) => {
  const GUID = ACSPLGUID.getNew();
  const [selectedDateModal, setSelectedDateModal] = useState(null);
  const [ExpenseCategoryData, setExpenseCategoryData] = useState([]);
  const [formData, setFormData] = useState({
    EXPAID: "",
    EXPCATEGORY: "",
    EXPDATE: "",
    EXPAMOUNT: 0,
    EXPREFERENCE: "",
    EXPENSEFOR: "",
    EXPDESCRIPTION: "",
    EXPCATEGORYid: ""
  })
  // const navigate = useNavigate();
  const MySwal = withReactContent(Swal);
  const EXPCATEGORYRef = useRef(null);
  const EXPDATERef = useState(null);
  const EXPAMOUNTRef = useRef(null);
  const EXPREFERENCERef = useRef(null);
  const EXPENSEFORRef = useRef(null);
  const DescriptionRef = useRef(null);
  const submitRef = useRef();

  useEffect(() => {
    const fetchExpenseCategory = async () => {
      try {
        const payload = {
          "expcaid": "%",
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
          data: JSON.stringify(payload),
          headers: headers,
        })
          .then((response) => {
            if (response.status != 200) throw new Error("Failed to Fetching Data");
            const DATA = response.data;
            const formExpenseData = DATA
              .map(({ expname, expcaid }) => ({
                label: expname,
                value: expcaid,
              }));
            setExpenseCategoryData(formExpenseData);
          })

      } catch (error) {
        console.error("Error fetching vendor data:", error);
      }
    };

    fetchExpenseCategory();

  }, []);


  useEffect(() => {
    if (EXPAID) {
      try {
        const payload1 = {
          "expaid": EXPAID,
          "companyid": "",
          "deptid": ""
        }
        const headers = {
          "Content-Type": "application/json",
          Accept: "*/*",
        };
        axios({
          method: "POST",
          url: baseUrl.Url + "/backend/api/GET_Expense",
          data: JSON.stringify(payload1),
          headers: headers,
        })
          .then((response) => {
            if (response.status != 200) throw new Error("Failed to Fetching Data");
            let apiData = response.data[0];
            setFormData(prev => ({
              ...prev,
              EXPAID: apiData.expaid,
              EXPCATEGORY: ExpenseCategoryData.find((expense) => expense.value == response.data[0].expcategory)?.value || "",
              EXPDATE: convertToISODate(apiData.expdate),
              EXPAMOUNT: apiData.expamount,
              EXPREFERENCE: apiData.expreference,
              EXPENSEFOR: apiData.expensefor,
              EXPDESCRIPTION: apiData.expdescription,

            }));
            console.log("Expense data", apiData);
          })

      } catch (error) {
        console.error("Error fetching Access Right Data:", error);
      }
    }
  }, [EXPAID]);

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
    const { EXPCATEGORY, EXPDATE, EXPAMOUNT, EXPREFERENCE, EXPENSEFOR } = formData;

    if (!EXPCATEGORY) {
      Swal.fire({
        icon: "error",
        title: "वैधता त्रुटी",
        text: "कृपया खर्च प्रकार निवडा.",
        allowOutsideClick: false,
        allowEscapeKey: false,
      }).then(() => {
        setTimeout(() => {
          EXPCATEGORYRef.current?.focus();
        }, 100);
      });
      return;
    }

    if (!EXPDATE) {
      Swal.fire({
        icon: "error",
        title: "वैधता त्रुटी",
        text: "कृपया खर्चाची तारीख निवडा.",
        allowOutsideClick: false,
        allowEscapeKey: false,
      }).then(() => {
        setTimeout(() => {
          EXPDATERef.current?.focus();
        }, 100);
      });
      return;
    }

    if (!EXPAMOUNT || EXPAMOUNT.trim() === "") {
      Swal.fire({
        icon: "error",
        title: "वैधता त्रुटी",
        text: "कृपया रक्कम भरा.",
        allowOutsideClick: false,
        allowEscapeKey: false,
      }).then(() => {
        setTimeout(() => {
          EXPAMOUNTRef.current?.focus();
        }, 100);
      });
      return;
    }

    if (!EXPREFERENCE || EXPREFERENCE.trim() === "") {
      Swal.fire({
        icon: "error",
        title: "वैधता त्रुटी",
        text: "कृपया संदर्भ भरा.",
        allowOutsideClick: false,
        allowEscapeKey: false,
      }).then(() => {
        setTimeout(() => {
          EXPREFERENCERef.current?.focus();
        }, 100);
      });
      return;
    }

    if (!EXPENSEFOR || EXPENSEFOR.trim() === "") {
      Swal.fire({
        icon: "error",
        title: "वैधता त्रुटी",
        text: "कृपया खर्चासाठी व्यक्ती / कारण भरा.",
        allowOutsideClick: false,
        allowEscapeKey: false,
      }).then(() => {
        setTimeout(() => {
          EXPENSEFORRef.current?.focus();
        }, 100);
      });
      return;
    }


    handleSubmit(e);
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
        "expaid": EXPAID ? EXPAID : GUID,
        "expcategory": formData.EXPCATEGORY,
        "expdate": formData.EXPDATE,
        "expamount": formData.EXPAMOUNT,
        "expreference": formData.EXPREFERENCE,
        "expensefor": formData.EXPENSEFOR,
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
        url: baseUrl.Url + "/backend/api/SP_AddUpdExpense",
        data: JSON.stringify(payload),
        headers: headers,
      });

      console.log("Response Received:", response.data);

      if (response.status === 200) {

        Swal.fire({
          icon: "success",
          title: "जतन झाले!",
          text: "माहिती यशस्वीरीत्या जतन झाली.",
          confirmButtonText: "ठीक आहे",
          allowOutsideClick: false,
          allowEscapeKey: false,
        }).then((result) => {
          if (result.isConfirmed) {

            const modal = document.getElementById("AddExpense");
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
              EXPCATEGORY: "",
              EXPDATE: "",
              EXPAMOUNT: 0,
              EXPREFERENCE: "",
              EXPENSEFOR: "",
              EXPDESCRIPTION: "",
              EXPCATEGORYid: ""
            });
          }
        });
      }
    } catch (error) {
      console.error("Submission Error:", error);
      Swal.fire({
        icon: "error",
        title: "त्रुटी",
        text: "डेटा जतन करण्यात अयशस्वी. कृपया पुन्हा प्रयत्न करा.",
        confirmButtonText: "ठीक आहे",
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


  const handleDateChangeModal = (date) => {
    setSelectedDateModal(date);
    setFormData((prevData) => ({
      ...prevData,
      EXPDATE: date ? date.toISOString().split("T")[0] : "",
    }));
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
          EXPCATEGORY: "",
          EXPDATE: "",
          EXPAMOUNT: 0,
          EXPREFERENCE: "",
          EXPENSEFOR: "",
          EXPDESCRIPTION: "",
          EXPCATEGORYid: ""

        });

        const modal = document.getElementById("AddExpense");
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
      {/* Add Expense */}
      <div className="modal fade" id="AddExpense">
        <div className="modal-dialog modal-dialog-centered custom-modal-two">
          <div className="modal-content">
            <div className="page-wrapper-new p-0">
              <div className="content">
                <div className="modal-header border-0 custom-modal-header">
                  <div className="page-title">
                    <h4>खर्च</h4>
                  </div>

                  <div className="page-btn">
                    <Link
                      className="btn btn-secondary"
                      onClick={showExitAlert} >
                      <ArrowLeft className="" />
                      मागे
                    </Link>
                  </div>
                </div>
                <div className="modal-body custom-modal-body">
                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-lg-6">
                        <div className="mb-3">
                          <label className="form-label">खर्च श्रेणी</label>

                          <Select
                            classNamePrefix="react-select"
                            options={ExpenseCategoryData}
                            placeholder="Choose"
                            value={ExpenseCategoryData.find((option) => option.value === formData.EXPCATEGORY) || null}
                            onChange={(selectedOption) => {
                              setFormData((prevData) => ({
                                ...prevData,
                                EXPCATEGORY: selectedOption ? selectedOption.value : '',
                              }));
                              if (EXPDATERef.current) {
                                EXPDATERef.current.focus();
                              }

                            }}
                            ref={EXPCATEGORYRef}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="input-blocks date-group">
                          <Calendar className="info-img" />
                          <div className="input-groupicon">
                            <DatePicker
                              selected={selectedDateModal}
                              onChange={handleDateChangeModal}
                              dateFormat="dd/MM/yyyy"
                              placeholderText="Choose Date"
                              className="datetimepicker"
                              value={formData.EXPDATE}
                              ref={EXPDATERef}
                              onKeyDown={(e) => handleEnterKey(e, EXPAMOUNTRef)}
                              required
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="mb-3">
                          <label className="form-label">रक्कम</label>
                          <input
                            type="number"
                            name="EXPAMOUNT"
                            className="form-control"
                            placeholder="$"
                            value={formData.EXPAMOUNT}
                            onChange={handleInputChange}
                            ref={EXPAMOUNTRef}
                            onKeyDown={(e) => handleEnterKey(e, EXPREFERENCERef)}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="mb-3">
                          <label className="form-label">संदर्भ</label>
                          <input
                            type="text"
                            className="form-control"
                            name="EXPREFERENCE"
                            value={formData.EXPREFERENCE}
                            onChange={handleInputChange}
                            ref={EXPREFERENCERef}
                            onKeyDown={(e) => handleEnterKey(e, EXPENSEFORRef)}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-lg-12">
                        <div className="mb-3">
                          <label className="form-label">खर्चासाठी</label>
                          <input
                            type="text"
                            className="form-control"
                            name="EXPENSEFOR"
                            value={formData.EXPENSEFOR}
                            onChange={handleInputChange}
                            ref={EXPENSEFORRef}
                            onKeyDown={(e) => handleEnterKey(e, DescriptionRef)}
                            required
                          />

                        </div>
                      </div>
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
                              value={formData.EXPDESCRIPTION}
                              onChange={handleInputChange}
                              ref={DescriptionRef}
                              onKeyDown={(e) => handleEnterKey(e, submitRef)}
                            />
                          </div>

                        </div>
                      </div>

                    </div>
                    <div className="modal-footer-btn">
                      <Link
                        to="#"
                        className="btn btn-cancel me-2"
                        onClick={showExitAlert}
                      >
                        मागे
                      </Link>
                      <button
                        type="submit"
                        className="btn btn-submit"
                        ref={submitRef}
                      >
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

export default AddExpense;
