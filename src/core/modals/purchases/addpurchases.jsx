import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "feather-icons-react/build/IconComponents";
import { all_routes } from "../../../Router/all_routes";
import Swal from "sweetalert2";
import { baseUrl, ACSPLGUID } from "../../json/custom";
import withReactContent from "sweetalert2-react-content";
import axios from "axios";
const AddPurchases = () => {
  const route = all_routes;
  const navigate = useNavigate();
  const GUID = ACSPLGUID.getNew();
  const location = useLocation();
  const { PBAID, PBDAID } = location.state || {};
  console.log("PBAID", PBAID)
  const [PBCHALLANNO, setPBCHALLANNO] = useState('');
  const PBNARRATIONRef = useRef(null);
  const PBTERMANDCONDITIONRef = useRef(null);
  const PBDUEDATERef = useRef(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    PBBILLNO: "",
    PBBILLDATE: new Date().toISOString().split("T")[0],
    PBDUEDATE: "",
    PBVEHICALNO: "",
    PBPOSUPPLY: "",
    PBCONSIGNER: "",
    PBTRANSPORT: "",
    PBDISCOUNT: "",
    PBAMOUNT: "",
    PBTERMANDCONDITION: "",
    PBNARRATION: "",
    PBCHALLANNO: "",
    PBVENDORID: ""
  });
  const [data, setData] = useState([
    {
      "product": "Product1",
      "quantity": 0,
      "uom": "kg",
      "rate": 0,
      "taxableValue": 0,
      "cgst": 0,
      "sgst": 0,
      "igst": 0,
      "total": 0
    },
    {
      "product": "Product2",
      "quantity": 5,
      "uom": "pcs",
      "rate": 50,
      "taxableValue": 250,
      "cgst": 12,
      "sgst": 12,
      "igst": 0,
      "total": 274
    },
    {
      "product": "Product3",
      "quantity": 10,
      "uom": "kg",
      "rate": 100,
      "taxableValue": 1000,
      "cgst": 18,
      "sgst": 18,
      "igst": 0,
      "total": 1180
    },
    {
      "product": "Product4",
      "quantity": 3,
      "uom": "ltr",
      "rate": 30,
      "taxableValue": 90,
      "cgst": 5,
      "sgst": 5,
      "igst": 0,
      "total": 100
    }
  ]);
  useEffect(() => {
    const grandTotal = data.reduce((total, product) => total + parseFloat(product.total || 0), 0);
    const transport = parseFloat(formData.PBTRANSPORT || 0);
    const discount = parseFloat(formData.PBDISCOUNT || 0);
    const netAmount = grandTotal + transport - discount;
    setFormData((prev) => ({
      ...prev,
      PBAMOUNT: netAmount.toFixed(2),
    }));
  }, [data, formData.PBTRANSPORT, formData.PBDISCOUNT]);
  const handleDueDateChange = (e) => {
    const dueDate = e.target.value;
    const billDate = formData.PBBILLDATE;

    // Validation Logic
    if (new Date(dueDate) < new Date(billDate)) {
      setErrorMessage("Due Date cannot be earlier than Bill Date."); // Set error message
    } else {
      setErrorMessage(""); // Clear error message
      setFormData({
        ...formData,
        PBDUEDATE: dueDate,
      });
    }
  };
  const handleInputChange = (e, index = null, field = null) => {
    if (index !== null && field) {
      const newData = [...data];
      newData[index][field] = e.target.value;
      newData[index].total =
        (parseFloat(newData[index].quantity || 0) * parseFloat(newData[index].rate || 0)) +
        parseFloat(newData[index].cgst || 0) +
        parseFloat(newData[index].sgst || 0) +
        parseFloat(newData[index].igst || 0);
      setData(newData);
    } else {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };
  const handleSearch = () => {
    if (PBCHALLANNO) {
      setShowForm(true);
    }
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
  }, [navigate,]);
  useEffect(() => {
    const handleShortcut = (e) => {
      if (e.ctrlKey && e.key === 'e') {
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
  }, [formData, navigate]);
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Form Data:", formData);
    console.log("Product Table Data:", data);
    const form = event.target.closest("form");
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    showConfirmationAlert(event);
  };
  const handleFormSubmission = async () => {
    try {
      const payload1 = {

        "pbaid": PBAID ? PBAID : GUID,
        "pbvendorid": formData.PBVENDORID,
        "pbconsigner": formData.PBCONSIGNER,
        "pbvehicalno": formData.PBVEHICALNO,
        "pbposupply": formData.PBPOSUPPLY,
        "pbbillno": formData.PBBILLNO,
        "pbdate": "",
        "pbduedate": formData.PBDUEDATE,
        "pbbilldate": formData.PBBILLDATE,
        "pbnarration": formData.PBNARRATION,
        "pbtransport": formData.PBTRANSPORT,
        "pbternandcondition": formData.PBTERMANDCONDITION,
        "companyid": "",
        "deptid": ""

      }
      const headers = {
        "Content-Type": "application/json",
        Accept: "*/*",
      };

      axios({
        method: "POST",
        url: baseUrl.Url + "/backend/api/AddUpdPBillMaster",
        data: JSON.stringify(payload1),
        headers: headers,
      })
      Swal.fire({
        icon: "success",
        title: "Saved!",
        text: "Data saved successfully.",
        confirmButtonText: "OK",
      });

      const payload2 = data.map((product) => ({
        "pbdaid": PBDAID ? PBDAID : GUID,
        "pbaid": PBAID,
        "pbproduct": product.product,
        "pbduom": product.uom,
        "pbdquantity": product.quantity,
        "pbdrate": product.rate,
        "pbdtamt": product.taxableValue,
        "pbdigst": product.igst,
        "pbdsgst": product.sgst,
        "pbdcgst": product.cgst,
        "companyid": 0,
        "deptid": 0,
      }));


      console.log(payload2);



      axios({
        method: "POST",
        url: baseUrl.Url + "/backend/api/AddUpdPBillMaster",
        data: JSON.stringify(payload2),
        headers: headers,
      })
      Swal.fire({
        icon: "success",
        title: "Saved!",
        text: "Data saved successfully.",
        confirmButtonText: "OK",
      });
      navigate(route.HSNMaster);
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
      title: "Are you sure?",
      text: "Do you want to save this data?",
      showCancelButton: true,
      confirmButtonColor: "#00ff00",
      confirmButtonText: "SAVE",
      cancelButtonColor: "#092C4C",
      cancelButtonText: "CANCLE",
    }).then((result) => {
      if (result.isConfirmed) {
        handleFormSubmission(event); // Proceed with form submission
      }
    });
  };
  const showExitAlert = () => {
    MySwal.fire({
      title: "Are you sure?",
      text: "Do you want to Exit?",
      showCancelButton: true,
      confirmButtonColor: "#00ff00",
      confirmButtonText: "YES",
      cancelButtonColor: "#092C4C",
      cancelButtonText: "NO",
    }).then((result) => {
      if (result.isConfirmed) {
        //navigate(route.HSNMaster) 
        console.log("exit ")
      }
    });
  };
  const checkFormValidity = (e) => {
    const { PBDUEDATE, PBTERMANDCONDITION, PBNARRATION } = formData;
    if (!PBDUEDATE) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please enter a valid date.",
      }).then(() => {
        PBDUEDATERef.current?.focus();
      });
      return;
    }
    if (!PBTERMANDCONDITION || PBTERMANDCONDITION.trim() === "") {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please enter  terms and condition.",
      }).then(() => {
        PBTERMANDCONDITIONRef.current?.focus();
      });
      return;
    }
    if (!PBNARRATION || PBNARRATION.trim() === "") {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please enter  Narration.",
      }).then(() => {
        PBNARRATIONRef.current?.focus();
      });
      return;
    }
    handleSubmit(e);
  };

  return (
    <div>
      {/* Add Purchase */}
      <div className="modal fade" id="add-units">
        {/* <div className="modal-dialog purchase modal-dialog-centered modal-fullscreen"> */}
        <div className="modal-dialog modal-dialog-centered modal-fullscreen">
          <div className="modal-content">
            <div className="page-wrapper-new p-0">
              <div className="content">
                <div className="modal-header border-0 custom-modal-header">
                  <div className="page-title">
                    <h4>Purchase Bill</h4>
                  </div>

                  <div className="page-btn">
                    <Link className="btn btn-secondary" aria-label="Close" data-bs-dismiss="modal">
                      <ArrowLeft className="me-2" />
                      Back to Index
                    </Link>
                  </div>
                </div>


                <div className="row justify-content-center m-1">
                  <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-4">
                    <div className="search-input d-flex align-items-center">
                      <input
                        type="number"
                        placeholder="Search challan No"
                        className="form-control w-100"
                        value={PBCHALLANNO}
                        onChange={(e) => setPBCHALLANNO(e.target.value)}
                        pattern="^\d+$"
                        title="Must contain only numbers"
                      />

                      <button
                        type="button"
                        className="btn btn-primary ms-3 mt-1 mt-sm-0"
                        onClick={handleSearch}
                      >
                        Search
                      </button>
                    </div>
                  </div>
                </div>


                <div className="modal-body custom-modal-body">
                  {showForm && (
                    <form onSubmit={handleSubmit}>
                      <div className="row">
                        <div className="col-lg-3 col-md-3 col-12">
                          <div className="mb-3 add-product">
                            <label className="form-label required">Bill No</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter Number"
                              name="PBBILLNO"
                              value={formData.PBBILLNO}
                              onChange={handleInputChange}
                              pattern="^\d+$"
                              title="Must contain only numbers"
                            />
                          </div>
                        </div>
                        <div className="col-md-3 col-sm-12">
                          <div className="mb-3 add-product">
                            <label className="form-label  required">Bill Date</label>
                            <div className="input-groupicon calender-input">
                              <input
                                type="date"
                                className="form-control"
                                value={formData.PBBILLDATE}

                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-md-3 col-sm-12">
                          <div className="mb-3 add-product">
                            <label className="form-label  required">Due Date</label>
                            <div className="input-groupicon calender-input">
                              <input
                                type="date"
                                className="form-control"
                                ref={PBDUEDATERef}
                                value={formData.PBDUEDATE}
                                onChange={handleDueDateChange}
                                required
                              />
                              {errorMessage && (
                                <div className="error-message" style={{ color: "red", fontSize: "0.9rem" }}>
                                  {errorMessage}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="col-md-3 col-sm-6 col-12">
                          <div className="mb-3 add-product">
                            <label className="form-label  required">Challan No</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter Number"
                              name="PBCHALLANNO"
                              value={PBCHALLANNO}

                              readOnly
                            />
                          </div>
                        </div>
                      </div>

                      <div className="accordion-header" id="headingOne">
                        <div data-bs-target="#collapseOne" aria-controls="collapseOne">
                          <div className="addproduct-icon">
                            <h5><span>Vender Details :</span></h5>
                          </div>
                        </div>
                      </div>
                      <div className="row mb-3">
                        <div className="col-lg-3 col-md-3 col-12">
                          <div className="form-label ">
                            <label className="required">Vendor Name:</label>
                            <input
                              type="text"
                              name="PBVENDORID"
                              className="form-control"
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>

                        <div className="col-lg-3 col-md-3 col-12">
                          <div className="form-label">
                            <label>Vendor Contact:</label>
                            <input
                              type="number"
                              name="Vendor_Contact"
                              className="form-control"
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>

                        <div className="col-lg-3 col-md-3 col-12">
                          <div className="form-label">
                            <label>Vendor Email:</label>
                            <input
                              type="email"
                              name="Vendor_Email"
                              className="form-control"
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>

                        <div className="col-lg-3 col-md-3 col-12">
                          <div className="form-label">
                            <label>Vendor State:</label>
                            <input
                              type="text"
                              name="Vendor_State"
                              className="form-control"
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                      </div>


                      <div className="row">
                        <div className="col-lg-3 col-md-3 col-12">
                          <div className="form-label">
                            <label className="required">Consigner:</label>
                            <input
                              type="text"
                              name="PBCONSIGNER"
                              className="form-control"
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                        <div className="col-md-3 col-sm-6 col-12">
                          <div className="mb-3 add-product">
                            <label className="form-label  required">Vehicle Number</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter text"
                              pattern="^[A-Z]{2}\s\d{1,2}\s[A-Z]{1,2}\s\d{4}$"
                              title="please enter valid vehicle number (उदा: MH 12 AB 1234)"
                              name="PBVEHICALNO"
                              value={formData.PBVEHICALNO}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                        <div className="col-lg-3 col-md-3 col-12">
                          <div className="form-label">
                            <label className="required">Place Of Supply</label>
                            <input
                              type="text"
                              name="PBPOSUPPLY"
                              value={formData.PBPOSUPPLY}
                              className="form-control"
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="col-lg-12">
                        <div className="border p-3 rounded shadow-sm mb-4">
                          <div className="modal-body-table">
                            <div className="table-responsive">
                              <table className="table table-bordered">
                                <thead className="thead-dark">
                                  <tr>
                                    <th className="col-4">Product</th>
                                    <th className="col-1">Quantity</th>
                                    <th className="col-1">UOM</th>
                                    <th className="col-1">Rate</th>
                                    <th className="col-1">Taxable Value</th>
                                    <th className="col-1">CGST</th>
                                    <th className="col-1">SGST</th>
                                    <th className="col-1">IGST</th>
                                    <th className="col-1">Total</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {data.map((product, index) => (
                                    <tr key={index}>
                                      <td className="col-4" style={{ padding: '5px 10px' }}>{product.product}</td>
                                      <td className="col-1" style={{ padding: '5px 10px' }}>
                                        <input
                                          type="number"
                                          value={product.quantity}
                                          className="form-control form-control-sm border-0 border-bottom border-primary"
                                          onChange={(e) => handleInputChange(e, index, 'quantity')}
                                          style={{ height: '30px' }}
                                        />
                                      </td>
                                      <td className="col-1" style={{ padding: '5px 10px' }}>{product.uom}</td>
                                      <td className="col-1" style={{ padding: '5px 10px' }}>
                                        <input
                                          type="number"
                                          value={product.rate}
                                          className="form-control form-control-sm border-0 border-bottom border-primary"
                                          onChange={(e) => handleInputChange(e, index, 'rate')}
                                          style={{ height: '30px' }}
                                        />
                                      </td>
                                      <td className="col-1" style={{ padding: '5px 10px' }}>
                                        {product.taxableValue}
                                      </td>
                                      <td className="col-1" style={{ padding: '5px 10px' }}>
                                        <input
                                          type="number"
                                          value={product.cgst}
                                          className="form-control form-control-sm border-0 border-bottom border-primary"
                                          onChange={(e) => handleInputChange(e, index, 'cgst')}
                                          style={{ height: '30px' }}
                                        />
                                      </td>
                                      <td className="col-1" style={{ padding: '5px 10px' }}>
                                        <input
                                          type="number"
                                          value={product.sgst}
                                          className="form-control form-control-sm border-0 border-bottom border-primary"
                                          onChange={(e) => handleInputChange(e, index, 'sgst')}
                                          style={{ height: '30px' }}
                                        />
                                      </td>
                                      <td className="col-1" style={{ padding: '5px 10px' }}>
                                        <input
                                          type="number"
                                          value={product.igst}
                                          className="form-control form-control-sm border-0 border-bottom border-primary"
                                          onChange={(e) => handleInputChange(e, index, 'igst')}
                                          style={{ height: '30px' }}
                                        />
                                      </td>
                                      <td className="col-1" style={{ padding: '5px 10px' }}>
                                        <span>{product.total}</span>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                                <tfoot>
                                  <tr>
                                    <td colSpan="8" className="text-end">Grand Total:</td>
                                    <td className="col-1">
                                      <span>
                                        {data.reduce((total, product) => total + product.total, 0).toFixed(2)}
                                      </span>
                                    </td>
                                  </tr>
                                </tfoot>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-lg-3 col-sm-6 col-12"></div>
                        <div className="col-lg-3 col-sm-6 col-12">
                          <div className="mb-3 add-product">
                            <label className="form-label">Transport</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Amount"
                              name="PBTRANSPORT"
                              value={formData.PBTRANSPORT}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                        <div className="col-lg-3 col-sm-6 col-12">
                          <div className="mb-3 add-product">
                            <label className="form-label">discount</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Amount"
                              name="PBDISCOUNT"
                              value={formData.PBDISCOUNT}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                        <div className="col-lg-3 col-sm-6 col-12">
                          <div className="mb-3 add-product">
                            <label className="form-label">Net Amount</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Amount"
                              name="PBAMOUNT"
                              value={formData.PBAMOUNT}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-lg-12 col-md-6 col-sm-12 mb-2">
                          <div>
                            <label className="form-label required">Terms And Conditions</label>
                            <textarea
                              type="text"
                              className="form-control "
                              name="PBTERMANDCONDITION"
                              value={formData.PBTERMANDCONDITION}
                              onChange={handleInputChange}
                              ref={PBTERMANDCONDITIONRef}
                              required />
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-lg-12 col-md-6 col-sm-12 ">
                          <div>
                            <label className="form-label required">Narration</label>
                            <textarea
                              ref={PBNARRATIONRef}
                              type="text"
                              className="form-control"
                              name="PBNARRATION"
                              value={formData.PBNARRATION}
                              onChange={handleInputChange}
                              required />
                          </div>
                        </div>
                      </div>

                      <div className="col-lg-12">
                        <div className="modal-footer-btn">
                          <button
                            type="button"
                            className="btn btn-cancel me-2"
                            data-bs-dismiss="modal"
                            onClick={showExitAlert}
                          >
                            Exit
                          </button>
                          <button
                            type="submit"
                            className="btn btn-submit">
                            Save
                          </button>
                        </div>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Add Purchase */}
    </div>
  );
};

export default AddPurchases;
