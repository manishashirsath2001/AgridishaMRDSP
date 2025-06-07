import Select from "react-select";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "feather-icons-react/build/IconComponents";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
// import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { baseUrl, ACSPLGUID } from "../../core/json/custom";
// import { all_routes } from "../../Router/all_routes";
import { getUserData } from "../../Context/UserData";
function OnProccedPurchaseOrder({ POAID, qamaid, vandorid }) {
  console.log(qamaid, vandorid, POAID)
  // const route = all_routes;
  // const location = useLocation();
  const navigate = useNavigate();
  // const { POAID } = location.state || {};
  // const { PODAID } = location.state || {};
  const { userdetail } = getUserData();
  const PODDATERef = useRef();
  const POPLACERef = useRef(null);
  const PODUEDATERef = useRef();
  const PODESCRIPTIONRef = useRef();
  const POTERMSANDCONDITIONRef = useRef();
  const POPDUEDAYSRef = useRef();
  const POPTERMSRef = useRef();
  const [paymentDues, setpaymentDues] = useState([]);
  const GUID = ACSPLGUID.getNew()
  const [states, setstates] = useState([]);
  // const [taxableValue, setTaxableValue] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(true)
  const quantityRef = useRef();
  const cgstRef = useRef();
  const sgstRef = useRef();
  const igstRef = useRef();
  const totalRef = useRef();

  useEffect(() => {
    const currentDate = new Date().toISOString().split('T')[0];
    setFormData({ ...formData, PODATE: currentDate });
  }, []);

  const setDate = (date) => {
    setFormData({ ...formData, PODATE: date });
  };
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    QUOTATIONNO: '',
    QUOTATIONDATE: '',
    POTRANNO: '',
    POVENDORNAME: '',
    POVENDORID: '',
    VENDORCONTACT: '',
    VENDOREMAIL: '',
    VENDORSTATE: '',
    PONARRATION: '',
    PODDATE: '',
    POPLACE: '',
    PODUEDATE: '',
    PODESCRIPTION: '',
    POTERMSANDCONDITION: '',
    POPDUEDAYS: '',
    POPTERMS: '',
    PODATE: '',
    PNODAYS: '',
    POGAMT: 0,
    POGTOTAL: 0,
  });


  useEffect(() => {
    const fetchstates = async () => {
      try {
        const headers = {
          "Content-Type": "application/json",
          Accept: "*/*",
        };
        const response = await axios.post(
          `${baseUrl.Url}/backend/api/GET_StateCodeDistinct`,
          { headers }
        );
        if (response.status !== 200)
          throw new Error("Failed to fetch vendor data");
        console.log("requisition setails", response.data)
        const data = response.data;
        const statesdata = data
          .map(({ sstatename, sstatecode }) => ({
            label: sstatename,
            value: sstatecode,
          }));
        setstates(statesdata);
      } catch (error) {
        console.error("Error fetching vendor data:", error);
      }
    };
    const fetchImplications = async () => {
      try {

        const response = await axios.get(
          baseUrl.Url + "/backend/api/Implications/QTYPE"
        );

        if (response.status != 200)
          throw new Error("Failed to fetch social media data");

        const data = await response.data;

        const rackTypes = data
          .filter((item) => item.iGroup === "QTYPE")
          .map(({ iTitle, iValue }) => ({
            label: iTitle,
            value: iValue,
          }));

        console.log("rack implication", rackTypes)


        setpaymentDues(rackTypes);
      } catch (error) {
        console.error("Error fetching implications:", error);
      }
    };

    fetchImplications();
    fetchstates();
  }, []);

  useEffect(() => {
    if (vandorid) {
      const fetchVendors = async () => {
        try {
          const payload = {
            pkid: vandorid,
            companyid: userdetail?.companyID || "",
            deptid: userdetail?.departmentID || "",
          };
          const headers = {
            "Content-Type": "application/json",
            Accept: "*/*",
          };
          const response = await axios.post(
            `${baseUrl.Url}/backend/api/GET_CustomerDetailsByID`,
            payload,
            { headers }
          );
          if (response.status !== 200)
            throw new Error("Failed to fetch vendor data");
          console.log("venderos", response.data)
          if (response.data.length > 0) {
            setFormData(prevState => ({
              ...prevState,
              POVENDORNAME: response.data[0].ccompanyname,
              POVENDORID: response.data[0].caid,
              VENDORCONTACT: response.data[0].ccontactpersonmobile,
              VENDOREMAIL: response.data[0].cemail,
              VENDORSTATE: states.find((state) => state.value == response.data[0].cstate)?.value || "",
            }));

          }
        } catch (error) {
          console.error("Error fetching vendor data:", error);
        }
      };

      fetchVendors();
    }
  }, [vandorid, userdetail]);

  const convertToISODate = (dateString) => {
    const date = new Date(dateString);
    if (!isNaN(date)) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    }
    return "";
  };

  useEffect(() => {
    if (qamaid) {
      const fetchVendors = async () => {
        try {
          const payload = {
            qamaid: qamaid,
            companyid: userdetail?.companyID || "",
            deptid: userdetail?.departmentID || "",
          };
          const headers = {
            "Content-Type": "application/json",
            Accept: "*/*",
          };
          const response = await axios.post(
            `${baseUrl.Url}/backend/api/GET_QuatationMasterSearch`,
            payload,
            { headers }
          );
          if (response.status !== 200)
            throw new Error("Failed to fetch vendor data");
          console.log("venderos", response.data)
          if (response.data.length > 0) {
            setFormData(prevState => ({
              ...prevState,
              QUOTATIONNO: response.data[0].qno,
              QUOTATIONDATE: convertToISODate(response.data[0].qdate),
              POPTERMS: response.data[0].qpaymentterms,
              POPDUEDAYS: response.data[0].qpduedate,
              PNODAYS: response.data[0].qnodays,
              POTERMSANDCONDITION: response.data[0].qtransportterms,
              POGAMT: response.data.map(item =>
                item.qquantity && item.qrate
                  ? parseFloat(item.qquantity) * parseFloat(item.qrate)
                  : ''
              ),
            }));
            const mappedProducts = response.data.map((item) => ({
              PODPRODUCT: item.qproduct,
              PODUOM: item.quom,
              PODPRODUCTName: item.pname,
              UOMTITLE: item.uomtitle,
              PODQUANTITY: parseFloat(item.qquantity),
              PODRATE: parseFloat(item.qrate),
              PODTAMT: parseFloat(item.qquantity) * parseFloat(item.qrate),
              PODCGST: parseFloat(item.qcgst),
              PODSGST: parseFloat(item.qsgst),
              PODIGST: parseFloat(item.qigst),
              PODTOTAL:
                (parseFloat(item.qquantity) * parseFloat(item.qrate)) +
                parseFloat(item.qcgst) +
                parseFloat(item.qsgst) +
                parseFloat(item.qigst),
            }));
            setProducts(mappedProducts);
            // let grandTotal = 0;
            // mappedProducts.forEach((prod) => {
            //   const productTaxableValue = parseFloat(prod.PODTAMT) || 0;
            //   const productCgst = parseFloat(prod.PODCGST) || 0;
            //   const productSgst = parseFloat(prod.PODSGST) || 0;
            //   const productIgst = parseFloat(prod.PODIGST) || 0;
            //   const productTotal = productTaxableValue + productCgst + productSgst + productIgst;
            //   // grandTotal += productTotal;
            // });

            // setFormData((prevData) => ({
            //   ...prevData,
            //   POGAMT: grandTotal.toFixed(2),
            // }));
          }
        } catch (error) {
          console.error("Error fetching vendor data:", error);
        }
      };

      fetchVendors();
    }
  }, [qamaid, userdetail]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedValue = value.replace(/^\s+/, "");

    setFormData((prevState) => ({
      ...prevState,
      [name]: updatedValue,
    }));
  };

  const handleFormSubmission = async () => {
    try {
      const payload1 = {
        "poaid": GUID,
        "potranno": formData.POTRANNO,
        "povendorid": formData.POVENDORID,
        "poconsigner": "",
        "poposupply": "",
        "poquantity": "",
        "poduedate": formData.PODUEDATE,
        "ponarration": formData.PONARRATION,
        "pogamt": formData.POGTOTAL,
        "ponmt": parseFloat(formData.POGAMT),
        "popduedays": formData.POPDUEDAYS,
        "poddate": formData.PODDATE,
        "qno": formData.QUOTATIONNO,
        "qdate": formData.QUOTATIONDATE,
        "podescription": formData.PODESCRIPTION,
        "poplace": formData.POPLACE,
        "popterms": formData.POPTERMS,
        "potermandcondition": formData.POTERMSANDCONDITION,
        "podate": formData.PODATE,
        "pnodays": formData.PNODAYS,
        "companyid": userdetail?.companyID || "",
        "deptid": userdetail?.departmentID || "",
        "pqreff": qamaid,
      };

      const headers = {
        "Content-Type": "application/json",
        Accept: "*/*",
      };

      // First API Call
      const response1 = await axios.post(
        `${baseUrl.Url}/backend/api/AddUpdPOrderMaster`,
        JSON.stringify(payload1),
        { headers }
      );

      if (response1.status === 200) {
        console.log("payload1", payload1);

        const payload2 = products?.map((product) => ({
          "podaid": ACSPLGUID.getNew(),
          "poaid": GUID,
          "podproduct": product.PODPRODUCT,
          "poduom": product.PODUOM,
          "podquantity": product.PODQUANTITY.toString(),
          "podrate": product.PODRATE,
          "podtamt": product.PODTAMT,
          "podigst": product.PODIGST,
          "podsgst": product.PODSGST,
          "podcgst": product.PODCGST,
          "podtotal": product.PODTOTAL,
          "companyid": userdetail?.companyID || "",
          "deptid": userdetail?.departmentID || "",
        }));
        console.log("payload2", payload2);

        // Second API Call
        const response2 = await axios.post(
          `${baseUrl.Url}/backend/api/SP_AddUpdPOrderDetails`,
          JSON.stringify(payload2),
          { headers }
        );

        if (response2.status === 200) {
          Swal.fire({
            icon: "success",
            title: "Saved!",
            text: "Data saved successfully.",
            confirmButtonText: "OK",
          }).then((result) => {
            if (result.isConfirmed) {
              const modal = document.getElementById("onproceedorder");
              if (modal) {
                modal.classList.remove("show");
                modal.style.display = "none";
                document.body.classList.remove("modal-open");
                document.body.style.overflow = "auto";

                const backdrop = document.querySelector(".modal-backdrop");
                if (backdrop) {
                  backdrop.remove();
                }
              }
              const backdrop = document.querySelector(".modal-backdrop");
              if (backdrop) {
                backdrop.remove();
              }

              setFormData({
                QUOTATIONNO: '',
                QUOTATIONDATE: '',
                POTRANNO: '',
                POVENDORNAME: '',
                POVENDORID: '',
                VENDORCONTACT: '',
                VENDOREMAIL: '',
                VENDORSTATE: '',
                PONARRATION: '',
                PODDATE: '',
                POPLACE: '',
                PODUEDATE: '',
                PODESCRIPTION: '',
                POTERMSANDCONDITION: '',
                POPDUEDAYS: '',
                POPTERMS: '',
                PODATE: '',
                PNODAYS: '',
                POGAMT: 0,
                POGTOTAL: 0,
              });
              setProducts();
              setIsModalOpen(false);
            }
            const backdrop = document.querySelector(".modal-backdrop");
            if (backdrop) {
              backdrop.remove();
            }
          });
        }
      }
    } catch (error) {
      console.error("Submission Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to save data. Please try again.",
      });
    }
  };


  const MySwal = withReactContent(Swal);

  const showConfirmationAlert = (event) => {
    MySwal.fire({
      title: "तुला खात्री आहे का?",
      text: "तुम्हाला हा डेटा सेव्ह करायचा आहे का?",
      showCancelButton: true,
      confirmButtonColor: "#00ff00",
      confirmButtonText: "बचत करणे",
      cancelButtonColor: "#092C4C",
      cancelButtonText: "रद्द करा",
    }).then((result) => {
      if (result.isConfirmed) {
        handleFormSubmission(event);
      }
    });
  };
  const showExitAlert = () => {
    MySwal.fire({
      title: "तुला खात्री आहे का?",
      text: "तुम्हाला बाहेर पडायचे आहे का?",
      showCancelButton: true,
      confirmButtonColor: "#00ff00",
      confirmButtonText: "हो",
      cancelButtonColor: "#092C4C",
      cancelButtonText: "नाही",
    }).then((result) => {
      if (result.isConfirmed) {
        const modal = document.getElementById("onproceedorder");
        if (modal) {
          modal.classList.remove("show");
          modal.style.display = "none";
          document.body.classList.remove("modal-open");
          document.body.style.overflow = "auto";

          const backdrop = document.querySelector(".modal-backdrop");
          if (backdrop) {
            backdrop.remove();
          }

          setFormData({
            QUOTATIONNO: '',
            QUOTATIONDATE: '',
            POTRANNO: '',
            POVENDORNAME: '',
            POVENDORID: '',
            VENDORCONTACT: '',
            VENDOREMAIL: '',
            VENDORSTATE: '',
            PONARRATION: '',
            PODDATE: '',
            POPLACE: '',
            PODUEDATE: '',
            PODESCRIPTION: '',
            POTERMSANDCONDITION: '',
            POPDUEDAYS: '',
            POPTERMS: '',
            PODATE: '',
            PNODAYS: '',
            POGAMT: 0,
            POGTOTAL: 0,
          })
          setProducts()
        }
        const backdrop = document.querySelector(".modal-backdrop");
        if (backdrop) {
          backdrop.remove();
        }
      }
    });
  };


  useEffect(() => {
    const handleShortcut = (e) => {
      if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
        checkFormValidity(e);

      }

      if (e.ctrlKey && e.key === "e") {
        e.preventDefault();
        showExitAlert();
      }
    };

    window.addEventListener("keydown", handleShortcut);

    return () => {
      window.removeEventListener("keydown", handleShortcut);
    };
  }, [formData, navigate]);

  const checkFormValidity = (e) => {

    const { PODDATE } = formData;
    if (!PODDATE) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Delivery Date must be selected.",
      }).then(() => {
        PODDATERef.current.focus();
      });
      return;
    }
    const { POPLACE } = formData;
    if (!POPLACE || POPLACE === "") {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Delivery Place must be selected.",
      }).then(() => {
        POPLACERef.current.focus();
      });
      return;
    }

    const { PODUEDATE } = formData;
    if (!PODUEDATE || PODUEDATE.trim() === "") {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Due Date must be selected.",
      }).then(() => {
        PODUEDATERef.current.focus();
      });
      return;
    }

    const { PODESCRIPTION } = formData;
    if (!PODESCRIPTION || PODESCRIPTION.trim() === "") {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Description cannot be empty.",
      }).then(() => {
        PODESCRIPTIONRef.current.focus();
      });
      return;
    }
    const { POTERMSANDCONDITION } = formData;
    if (!POTERMSANDCONDITION || POTERMSANDCONDITION.trim() === "") {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Terms and Conditions cannot be empty.",
      }).then(() => {
        POTERMSANDCONDITIONRef.current.focus();
      });
      return;
    }
    const { POPDUEDAYS } = formData;
    if (!POPDUEDAYS || POPDUEDAYS.trim() === "") {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please select a Payment Due Date.",
      });
      return;
    }

    const { PNODAYS } = formData;
    if (!PNODAYS || PNODAYS.trim() === "") {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Number of days cannot be empty.",
      });
      return;
    }

    const { POPTERMS } = formData;
    if (!POPTERMS || POPTERMS.trim() === "") {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Payment Terms cannot be empty.",
      }).then(() => {
        POPTERMSRef.current.focus();
      });
      return;
    }

    handleSubmit(e);
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Form Data Saved:', formData);
    console.log('Table data:', products)

    showConfirmationAlert(event);
  };

  const handleDropdownChange = (selectedOption, field) => {
    setFormData(prevData => ({
      ...prevData,
      [field]: selectedOption ? selectedOption.value : "",
    }));
  }


  const handleCalculateTaxableValue = (index, quantity, rate) => {
    const updatedProducts = [...products];
    const quantityValue = parseFloat(quantity) || 0;
    const rateValue = parseFloat(rate) || 0;

    const taxableValue = quantityValue * rateValue;
    updatedProducts[index].PODTAMT = taxableValue.toFixed(2);
    setProducts(updatedProducts);
  };


  const handleCalculateTotal = (index) => {
    const updatedProducts = [...products];
    const product = updatedProducts[index];
    const taxableValue = parseFloat(product.PODTAMT) || 0;
    const cgst = parseFloat(product.PODCGST) || 0;
    const sgst = parseFloat(product.PODSGST) || 0;
    const igst = parseFloat(product.PODIGST) || 0;

    const total = taxableValue + cgst + sgst + igst;
    updatedProducts[index].PODTOTAL = total.toFixed(2);

    let totalTaxableValue = 0;
    let grandTotal = 0;

    updatedProducts.forEach((prod) => {
      const productTaxableValue = parseFloat(prod.PODTAMT) || 0;
      const productCgst = parseFloat(prod.PODCGST) || 0;
      const productSgst = parseFloat(prod.PODSGST) || 0;
      const productIgst = parseFloat(prod.PODIGST) || 0;

      totalTaxableValue += productTaxableValue;

      const productTotal = productTaxableValue + productCgst + productSgst + productIgst;
      grandTotal += productTotal;
    });

    setProducts(updatedProducts);

    setFormData((prevData) => ({
      ...prevData,
      POGTOTAL: totalTaxableValue.toFixed(2),
      POGAMT: grandTotal.toFixed(2),
    }));
  };




  // useEffect(() => {
  //   const calculatedTaxableValue = products.reduce((acc, product) => acc + product.PODTAMT, 0);

  //   setTaxableValue(calculatedTaxableValue);
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     POGTOTAL: calculatedTaxableValue,
  //   }));
  // }, [products]);


  return (
    <div>
      {isModalOpen && (
        <div
          className="modal fade"
          id="onproceedorder"
          tabIndex={-1}
          aria-labelledby="exampleModalFullscreenLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-fullscreen">
            <div className="modal-content">

              <div className="modal-body">
                <div className="modal-content">
                  <div className="page-wrapper-new p-0">
                    <div className="content">
                      <div className="modal-header border-0 custom-modal-header">
                        <div className="page-title">
                          <h4>खरेदी ऑर्डर जोडा</h4>
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                          <ul className="table-top-head">
                            <li>
                              <div className="page-btn">
                                <button
                                  className="btn btn-secondary"
                                  aria-label="Close"
                                  // data-bs-dismiss="modal"
                                  // data-bs-target="#AddPurchaseorder"
                                  // data-bs-toggle="modal"
                                  onClick={showExitAlert}

                                >
                                  <ArrowLeft className="me-2" />
                                  संपादन खरेदीकडे परत जा
                                </button>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>

                      <div className="modal-body custom-modal-body">
                        <form onSubmit={handleSubmit}>
                          <div className="row">
                            <div className="col-md-3 col-sm-6 col-12">
                              <div className="mb-3 add-product">
                                <label className="form-label">कोटेशन संख्या</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Enter Number"
                                  name="QUOTATIONNO"
                                  value={formData.QUOTATIONNO}
                                  onChange={handleInputChange}
                                  readOnly
                                />
                              </div>
                            </div>

                            <div className="col-md-3 col-sm-12">
                              <div className="mb-3 add-product">
                                <label className="form-label">कोटेशन तारीख</label>
                                <div className="input-groupicon calender-input">
                                  <input
                                    type="date"
                                    className="form-control"
                                    name="QUOTATIONDATE"
                                    value={formData.QUOTATIONDATE}
                                    onChange={handleInputChange}
                                    readOnly
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="col-md-3 col-sm-6 col-12">
                              <div className="mb-3 add-product">
                                <label className="form-label ">ऑर्डर नंबर खरेदी करा</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Enter Number"
                                  name="POTRANNO"
                                  value={formData.POTRANNO}
                                  onChange={handleInputChange}
                                />
                              </div>
                            </div>

                            <div className="col-md-3 col-sm-6 col-12">
                              <div className="mb-3 add-product">
                                <label className="form-label ">खरेदी ऑर्डर दिनांक</label>
                                <div className="input-groupicon calender-input">
                                  <input

                                    type="date"
                                    className="form-control"
                                    value={formData.PODATE}
                                    onChange={(e) => setDate(e.target.value)}

                                  />
                                </div>
                              </div>
                            </div>

                            {/* <div className="col-md-3 col-sm-6 col-12">
                        <div className="mb-3 add-product">
                          <label className="form-label">Place of Supply</label>
                          <select className="form-control"
                            name="POPOSUPPLY"
                            value={formData.POPOSUPPLY}
                            onChange={handleInputChange}

                          >
                            <option value="">Select Place of Supply</option>
                            <option value="place1">Place 1</option>
                            <option value="place2">Place 2</option>
                            <option value="place3">Place 3</option>
                          </select>
                        </div>
                      </div>

                      <div className="col-md-3 col-sm-6 col-12">
                        <div className="mb-3 add-product">
                          <label className="form-label">Due Days</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Enter text"
                            name="PODUEDATE"
                            value={formData.PODUEDATE}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div> */}
                          </div>

                          <div className="accordion-header" id="headingOne">
                            <div data-bs-target="#collapseOne" aria-controls="collapseOne">
                              <div className="addproduct-icon">
                                <h5><span>विक्रेत्याचा तपशील</span></h5>
                              </div>
                            </div>
                          </div>
                          <div className="row mb-3">
                            <div className="col-lg-3 col-md-3 col-12">
                              <div className="form-label">
                                <label>विक्रेत्याचे नाव</label>
                                <input
                                  type="text"
                                  name="POVENDORNAME"
                                  value={formData.POVENDORNAME}
                                  className="form-control"
                                  onChange={handleInputChange}
                                  readOnly
                                />
                              </div>
                            </div>

                            <div className="col-lg-3 col-md-3 col-12">
                              <div className="form-label">
                                <label>विक्रेत्याशी संपर्क साधा</label>
                                <input
                                  type="number"
                                  name="VENDORCONTACT"
                                  value={formData.VENDORCONTACT}
                                  className="form-control"
                                  onChange={handleInputChange}
                                  readOnly
                                />
                              </div>
                            </div>

                            <div className="col-lg-3 col-md-3 col-12">
                              <div className="form-label">
                                <label>विक्रेता ईमेल</label>
                                <input
                                  type="email"
                                  name="VENDOREMAIL"
                                  value={formData.VENDOREMAIL}
                                  className="form-control"
                                  onChange={handleInputChange}
                                  readOnly
                                />
                              </div>
                            </div>

                            <div className="col-lg-3 col-md-3 col-12">
                              <div className="form-label">
                                <label>विक्रेता राज्य</label>
                                <Select
                                  readOnly
                                  classNamePrefix="react-select"
                                  options={states}
                                  openMenuOnFocus={true}
                                  value={states.find(option => option.value == formData.VENDORSTATE) || null}
                                  onChange={(selectedOption) => handleDropdownChange(selectedOption, "VENDORSTATE")}
                                />
                                {/* <input
                                type="text"
                                name="VENDORSTATE"
                                value={formData.VENDORSTATE}
                                className="form-control"
                                onChange={handleInputChange}
                              /> */}
                              </div>
                            </div>
                          </div>

                          {/* <div className="col-sm-6 col-12">
                      <div className="mb-3 add-product">
                        <label className="form-label ">Transporter Name</label>
                        <select className="form-control"
                          name="POCONSIGNER"
                          value={formData.POCONSIGNER}
                          onChange={handleInputChange}
                        >
                          <option value="">Select Transporter</option>
                          <option value="consigner1">Transporter 1</option>
                          <option value="consigner2">Transporter 2</option>
                          <option value="consigner3">Transporter 3</option>
                        </select>
                      </div>
                    </div> */}



                          {/* <div className="accordion-header" id="headingOne">
                      <div data-bs-target="#collapseOne" aria-controls="collapseOne">
                        <div className="addproduct-icon">
                          <h5><span>Transporter Details</span></h5>
                        </div>
                      </div>
                    </div>
                    <div className="row mb-3">
                      <div className="col-lg-3 col-md-3 col-12">
                        <div className="form-label">
                          <label>Transporter Name</label>
                          <select className="form-control"
                            name="POCONSIGNER"
                            value={formData.TRNRID}
                            onChange={handleInputChange}
                          >
                            <option value="">Select Transporter</option>
                            <option value="consigner1">Transporter 1</option>
                            <option value="consigner2">Transporter 2</option>
                            <option value="consigner3">Transporter 3</option>
                          </select>
                        </div>
                      </div>

                      <div className="col-lg-3 col-md-3 col-12">
                        <div className="form-label">
                          <label>Transporter Contact</label>
                          <input
                            type="number"
                            name="TRNCONTACT"
                            value={formData.TRNCONTACT}
                            className="form-control"
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>

                      <div className="col-lg-3 col-md-3 col-12">
                        <div className="form-label">
                          <label>Transporter State</label>
                          <input
                            type="text"
                            name="TRNSTATE"
                            value={formData.TRNSTATE}
                            className="form-control"
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                    </div> */}


                          <div className="col-12">
                            <div className="mb-3">
                              <label className="form-label ">वर्णन</label>
                              <textarea
                                rows="5"
                                className="form-control"
                                placeholder="Enter Description"
                                name="PONARRATION"
                                value={formData.PONARRATION}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>

                          <div className="border p-3 rounded shadow-sm mb-4">
                            <div className="col-lg-12">
                              <div className="modal-body-table">
                                <div className="table-responsive">
                                  <table className="table table-bordered">
                                    <thead className="thead-dark">
                                      <tr>
                                        <th className="col-3">उत्पादन</th>
                                        <th className="col-1">माप एकक</th>
                                        <th className="col-1">प्रमाण</th>
                                        <th className="col-1">दर</th>
                                        <th className="col-1">करयोग्य मूल्य</th>
                                        <th className="col-1">CGST</th>
                                        <th className="col-1">SGST</th>
                                        <th className="col-1">IGST</th>
                                        <th className="col-1">एकूण</th>
                                      </tr>
                                    </thead>
                                    {/* <tbody>
                                    {products?.map((product, index) => (
                                      <tr key={index}>
                                        <td className="col-3" style={{ padding: '5px 10px' }}>{product.PODPRODUCTName}</td>
                                        <td className="col-1" style={{ padding: '5px 10px' }}>{product.PODUOM}</td>
                                        <td className="col-1" style={{ padding: '5px 10px' }}>
                                          <div className="d-flex justify-content-end">
                                            <input
                                              name="quantity"
                                              value={product.PODQUANTITY}
                                              className="form-control form-control-sm border-0 border-bottom border-warning w-50 text-end"
                                              onChange={(e) => handleProductChange(e, index, 'PODQUANTITY')}
                                            />
                                          </div>
                                        </td>
                                        <td className="col-1 text-end" style={{ padding: '5px 10px' }}>{product.PODRATE}</td>
                                        <td className="col-1 text-end" style={{ padding: '5px 10px' }}>{product.PODTAMT}</td>
                                        <td className="col-1" style={{ padding: '5px 10px' }}>
                                          <div className="d-flex justify-content-end">
                                            <input
                                              name="cgst"
                                              value={product.PODCGST}
                                              className="form-control form-control-sm border-0 border-bottom border-warning w-50 text-end"
                                              onChange={(e) => handleProductChange(e, index, 'PODCGST')}
                                            />
                                          </div>
                                        </td>
                                        <td className="col-1 text-end" style={{ padding: '5px 10px' }}>
                                          <div className="d-flex justify-content-end">
                                            <input
                                              name="sgst"
                                              value={product.PODSGST}
                                              className="form-control form-control-sm border-0 border-bottom border-warning w-50 text-end"
                                              onChange={(e) => handleProductChange(e, index, 'PODSGST')}
                                            />
                                          </div>
                                        </td>
                                        <td className="col-1" style={{ padding: '5px 10px' }}>
                                          <div className="d-flex justify-content-end">
                                            <input
                                              name="igst"
                                              value={product.PODIGST}
                                              className="form-control form-control-sm border-0 border-bottom border-warning w-50 text-end"
                                              onChange={(e) => handleProductChange(e, index, 'PODIGST')}

                                            />
                                          </div>
                                        </td>
                                        <td className="col-1 text-end" style={{ padding: '5px 10px' }}>{product.PODTOTAL}</td>
                                      </tr>
                                    ))}

                                    <tr>
                                      <td colSpan="8" className="text-end font-weight-bold">Total</td>
                                      <td className="col-1">
                                        <div className="d-flex justify-content-end">
                                          <input
                                            name="total"
                                            // value={total} // use the state variable for total
                                            className="form-control form-control-sm border-0 border-bottom border-warning w-50 text-end"
                                          // onChange={handleTotalChange} // Update total manually if needed
                                          />
                                        </div>
                                      </td>
                                    </tr>



                                  </tbody> */}
                                    <tbody>
                                      {products?.map((product, index) => (

                                        <tr key={index}>
                                          <td className="col-12 col-sm-3" style={{ padding: '5px 10px' }}>{product.PODPRODUCTName}</td>
                                          <td className="col-12 col-sm-1" style={{ padding: '5px 10px' }}>{product.UOMTITLE}</td>
                                          <td className="col-12 col-sm-1" style={{ padding: '5px 10px' }}>
                                            <div className="d-flex justify-content-end">
                                              <input
                                                name="quantity"
                                                value={product.PODQUANTITY}
                                                className="border-0 border-bottom border-warning w-100 text-end"
                                                onChange={(e) => {
                                                  const updatedProducts = [...products];
                                                  updatedProducts[index].PODQUANTITY = e.target.value;
                                                  setProducts(updatedProducts);

                                                  // Auto calculate the taxable value immediately
                                                  handleCalculateTaxableValue(index, e.target.value, product.PODRATE);
                                                }}
                                                // onKeyDown={(e) => handleEnterKey(e, cgstRef)}
                                                ref={quantityRef}

                                              />
                                            </div>
                                          </td>
                                          <td className="col-12 col-sm-1 text-end" style={{ padding: '5px 10px' }}>{product.PODRATE}</td>
                                          <td className="col-12 col-sm-1 text-end" style={{ padding: '5px 10px' }}>{product.PODTAMT}</td>
                                          <td className="col-12 col-sm-1" style={{ padding: '5px 10px' }}>
                                            <div className="d-flex justify-content-end">
                                              <input
                                                name="cgst"
                                                value={product.PODCGST}
                                                className="border-0 border-bottom border-warning w-100 text-end"
                                                onChange={(e) => {
                                                  const updatedProducts = [...products];
                                                  updatedProducts[index].PODCGST = e.target.value;
                                                  setProducts(updatedProducts);
                                                }}
                                                onBlur={() => handleCalculateTotal(index)}
                                                // onKeyDown={(e) => handleEnterKey(e, sgstRef)}
                                                ref={cgstRef}

                                              />
                                            </div>
                                          </td>
                                          <td className="col-12 col-sm-1 text-end" style={{ padding: '5px 10px' }}>
                                            <div className="d-flex justify-content-end">
                                              <input
                                                name="sgst"
                                                value={product.PODSGST}
                                                className="border-0 border-bottom border-warning w-100 text-end"
                                                onChange={(e) => {
                                                  const updatedProducts = [...products];
                                                  updatedProducts[index].PODSGST = e.target.value;
                                                  setProducts(updatedProducts);
                                                }}
                                                onBlur={() => handleCalculateTotal(index)}
                                                // onKeyDown={(e) => handleEnterKey(e, igstRef)}
                                                ref={sgstRef}

                                              />
                                            </div>
                                          </td>
                                          <td className="col-12 col-sm-1 text-end" style={{ padding: '5px 10px' }}>
                                            <div className="d-flex justify-content-end">
                                              <input
                                                name="igst"
                                                value={product.PODIGST}
                                                className="border-0 border-bottom border-warning w-100 text-end"
                                                onChange={(e) => {
                                                  const updatedProducts = [...products];
                                                  updatedProducts[index].PODIGST = e.target.value;
                                                  setProducts(updatedProducts);
                                                }}
                                                onBlur={() => handleCalculateTotal(index)}
                                                // onKeyDown={(e) => handleEnterKey(e, totalRef)}
                                                ref={igstRef}

                                              />
                                            </div>
                                          </td>
                                          <td className="col-12 col-sm-1 text-end" style={{ padding: '5px 10px' }}>
                                            {/* Displaying the calculated total for the row inside an input field */}
                                            <input
                                              type="text"
                                              className="border-0 border-bottom border-warning w-100 text-end"
                                              value={product.PODTOTAL || '0'}

                                            />
                                          </td>
                                        </tr>
                                      ))}

                                      {/* <tr>
                                      <td colSpan="8" className="text-end font-weight-bold">Total</td>
                                      <td className="col-12 col-sm-1">
                                        <div className="d-flex justify-content-end">
                                          <input
                                            name="total"
                                            value={formData.POGAMT || total}
                                            className="border-0 border-bottom border-warning w-100 text-end"
                                            onBlur={handleCalculateTotal}
                                            ref={totalRef}
                                          // onKeyDown={(e) => handleEnterKey(e, PODDATERef)}
                                          />
                                        </div>
                                      </td>
                                    </tr> */}
                                      <tr>
                                        <td colSpan="3"></td>
                                        <td className="text-end">
                                          <strong>एकूण करयोग्य:</strong>
                                        </td>
                                        <td>
                                          <input
                                            type="text"
                                            className="form-control form-control-sm border-0 border-bottom border-warning text-end"
                                            name="POGTOTAL"
                                            value={formData.POGTOTAL}

                                          />
                                        </td>

                                        <td colSpan="2"></td>
                                        <td className="text-end">
                                          <strong>एकूण:</strong>
                                        </td>
                                        <div className="d-flex justify-content-end">
                                          <input
                                            name="total"
                                            value={formData.POGAMT || '0'}
                                            className="border-0 border-bottom border-warning w-100 text-end"
                                            onBlur={handleCalculateTotal} // Trigger total calculation on blur
                                            ref={totalRef}
                                          // onKeyDown={(e) => handleEnterKey(e, PODDATERef)}
                                          />
                                        </div>
                                      </tr>
                                    </tbody>

                                  </table>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="border p-3 rounded shadow-sm mb-4">
                            <h4 className="mb-3">वितरण तपशील</h4>
                            <div className="row">
                              <div className="col-md-3 col-sm-6 col-12">
                                <div className="mb-3 form-label">
                                  <label className="form-label required">वितरण तारीख</label>
                                  <input
                                    type="date"
                                    className="form-control"
                                    name="PODDATE"
                                    value={formData.PODDATE}
                                    onChange={handleInputChange}
                                    ref={PODDATERef}
                                    required
                                  />
                                </div>
                              </div>

                              <div className="col-md-3 col-sm-6 col-12">
                                <div className="mb-3">
                                  <label className="form-label ">वितरण स्थळ</label>
                                  {/* <select className="form-control"
                                  name="POPLACE"
                                  value={formData.POPLACE}
                                  onChange={handleInputChange}
                                  ref={POPLACERef}
                                  required
                                >
                                  <option value="">Select Place</option>
                                  <option value="place1">Place 1</option>
                                  <option value="place2">Place 2</option>
                                  <option value="place3">Place 3</option>
                                </select> */}
                                  <Select
                                    classNamePrefix="react-select"
                                    options={states}
                                    openMenuOnFocus={true}
                                    value={states.find(option => option.value == formData.POPLACE) || null}
                                    onChange={(selectedOption) => handleDropdownChange(selectedOption, "POPLACE")}
                                  />
                                </div>
                              </div>

                              <div className="col-md-3 col-sm-6 col-12">
                                <div className="mb-3 form-label">
                                  <label className="form-label required">नियत तारीख</label>
                                  <input
                                    type="date"
                                    className="form-control"
                                    name="PODUEDATE"
                                    value={formData.PODUEDATE}
                                    ref={PODUEDATERef}
                                    onChange={handleInputChange}
                                    required
                                    min={
                                      formData.PODATE
                                        ? new Date(new Date(formData.PODATE).getTime() + 86400000).toISOString().split('T')[0]
                                        : undefined // No restriction if expecteddate is not set
                                    }
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="col-12">
                              <div className="mb-3">
                                <label className="form-label">वर्णन</label>
                                <textarea
                                  rows="5"
                                  className="form-control"
                                  placeholder="Enter Description"
                                  name="PODESCRIPTION"
                                  value={formData.PODESCRIPTION}
                                  ref={PODESCRIPTIONRef}
                                  onChange={handleInputChange}
                                  required
                                />
                              </div>
                            </div>
                          </div>

                          <div className="border p-3 rounded shadow-sm mb-4">
                            <div className="col-12">
                              <div className="mb-3 form-label">
                                <label className="form-label required">शर्ती आणि अटी</label>
                                <textarea
                                  rows="5"
                                  className="form-control"
                                  placeholder="Enter text"
                                  name="POTERMSANDCONDITION"
                                  value={formData.POTERMSANDCONDITION}
                                  ref={POTERMSANDCONDITIONRef}
                                  onChange={handleInputChange}
                                  required
                                />
                              </div>
                            </div>

                            <div className="row align-items-center">
                              <div className="col-lg-6 col-md-6 col-12">
                                <div className="form-label">
                                  <label className="form-label required">भरणा नियत तारीख:</label>
                                  <Select
                                    ref={POPDUEDAYSRef}
                                    name="POPDUEDAYS"
                                    classNamePrefix="react-select"
                                    options={paymentDues}
                                    value={paymentDues.find((option) => option.value === formData.POPDUEDAYS) || null}
                                    onChange={(selectedOption) => {
                                      setFormData((prevData) => ({
                                        ...prevData,
                                        POPDUEDAYS: selectedOption ? selectedOption.value : "",
                                      }));
                                    }}
                                    placeholder="Choose"
                                    isSearchable
                                    required
                                    openMenuOnFocus={true}
                                  />
                                </div>
                              </div>

                              {formData.POPDUEDAYS === "2" && (
                                <div className="col-lg-6 col-md-6 col-12">
                                  <div className="form-label">
                                    <div className="d-flex align-items-center mt-2">
                                      <label className="mr-2">दिवसांची संख्या प्रविष्ट करा:</label>
                                      <input
                                        type="number"
                                        className="form-control"
                                        name="PNODAYS"
                                        value={formData.PNODAYS}
                                        placeholder="Choose"
                                        onChange={handleInputChange}
                                        required
                                        min={0}
                                      />
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>


                            {/* <div className="row">
                            <div className="col-lg-3 col-md-3 col-12">
                              <div className="form-label">
                                <label>Payment Due Date:</label>
                                <Select
                                  ref={POPDUEDAYSRef}
                                  name="POPDUEDAYS"
                                  classNamePrefix="react-select"
                                  options={paymentDues}
                                  value={paymentDues.find(option => option.value === formData.POPDUEDAYS) || null}
                                  onChange={(selectedOption) => {
                                    setFormData((prevData) => ({
                                      ...prevData,
                                      POPDUEDAYS: selectedOption ? selectedOption.value : "",
                                    }));
                                  }}
                                  placeholder="Choose"
                                  isSearchable
                                  required
                                />
                                {/* <Select
                                  classNamePrefix="react-select"
                                  options={paymentDues}
                                  value={paymentDues.find(option => option.value === formData.POPDUEDAYS) || null}
                                  onChange={(selectedOption) => handleDropdownChange(selectedOption, "POPDUEDAYS")}
                                /> */}
                            {/* <select
                                  name="paymentDueDate"
                                  className="form-control"
                                  onChange={handleInputChange}
                                  required
                                >
                                  <option value="">Select Payment Due Date</option>
                                  <option value="immediatelyAfterDelivery">Immediately After Delivery</option>
                                  <option value="withinDays">Within Days</option>
                                </select> 


                                {formData.POPDUEDAYS === '2' && (
                                  <div className="d-flex mt-2">
                                    <div className="mr-2">
                                      <label>Enter Number of Days:</label>
                                    </div>
                                    <input
                                      type="number"
                                      className="form-control"
                                      name="PNODAYS"
                                      value={formData.PNODAYS}
                                      placeholder="Choose"
                                      onChange={handleInputChange}
                                      required
                                      min={0}
                                    />
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* <div className="col-lg-3 col-md-3 col-12">
                              <div className="form-label">
                                <label>Number Of Days:</label>
                                <input
                                  type="number"
                                  id="PNODAYS"
                                  name="PNODAYS"
                                  onChange={handleInputChange}
                                  className="form-control"
                                  required
                                />
                              </div>
                            </div> 
                          </div> */}


                            <div className="col-12">
                              <div className="mb-3 form-label ">
                                <label className="form-label required">भरणा शर्ती</label>
                                <textarea
                                  rows="5"
                                  className="form-control"
                                  placeholder="Enter text"
                                  name="POPTERMS"
                                  value={formData.POPTERMS}
                                  ref={POPTERMSRef}
                                  onChange={handleInputChange}
                                  required
                                />
                              </div>
                            </div>
                          </div>

                          <div className="col-lg-12">
                            <div className="modal-footer-btn">
                              <button
                                type="button"
                                className="btn btn-cancel me-2"
                                // data-bs-dismiss="modal"
                                onClick={showExitAlert}
                              >
                                बाहेर पडणे
                              </button>
                              <button type="submit" className="btn btn-submit">
                                जतन करा
                              </button>
                            </div>
                          </div>
                        </form>

                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default OnProccedPurchaseOrder
