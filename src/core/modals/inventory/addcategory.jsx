import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../../../Router/all_routes";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import axios from 'axios';
import { baseUrl } from "../../json/custom";
import { ACSPLGUID } from "../../json/custom";
import {
  ArrowLeft
} from "feather-icons-react/build/IconComponents";
const AddCategory = () => {
  const route = all_routes;
  const MySwal = withReactContent(Swal);
  const [formData, setformData] = useState({
    TITLE: "",
  });
  const [ImplicationCNT, setImplicationCNT] = useState('');
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setformData(prevState => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value
    }));
  };


  const handleSubmit = async () => {

    if (!formData.TITLE) {
      MySwal.fire({
        title: "योग्य माहिती भरा",
        text: "कृपया पुढे जाण्यापूर्वी सर्व आवश्यक माहिती भरा!",
        icon: "error",
        confirmButtonColor: "#ff0000",
        confirmButtonText: "ठीक आहे",
      });
      return;
    }



    MySwal.fire({
      title: 'तुम्हाला खात्री आहे का?',
      text: 'तुम्हाला ही माहिती सेव  करायची आहे का?',
      showCancelButton: true,
      confirmButtonColor: '#00ff00',
      confirmButtonText: 'SAVE',
      cancelButtonColor: '#092C4C',
      cancelButtonText: 'रद्द करा',
    })
      .then(async (result) => {
        if (result.isConfirmed) {
          try {
            const payload1 = {
              "implicationAutoID": ACSPLGUID.getNew(),
              "implicationTitle": formData.TITLE,
              "implicationValue": String(ImplicationCNT + 1),
              "implicationGroup": "RATETYPE",
              "implicationOrder": ImplicationCNT + 1,
              "isSystemDefined": true,
              "isIgnored": false

            };



            const headers = {
              "Content-Type": "application/json",
              Accept: "*/*",
            };

            // API Call
            const response1 = await axios.post(baseUrl.Url + "/backend/api/SP_AddUpdST_Implication", payload1, { headers });

            if (response1.status === 200) {


              MySwal.fire({
                icon: "success",
                title: "साठवले!",
                text: "माहिती यशस्वीरित्या सेव  केली",
                confirmButtonText: "OK",
              }).then(() => {
                const modalElement = document.getElementById("add-units-category");
                const modalInstance = bootstrap.Modal.getInstance(modalElement);
                if (modalInstance) {
                  modalInstance.hide();
                }

                MySwal.close();
                window.dispatchEvent(new Event("handleReload"));


                setformData({ TITLE: "" });



              });
            } else {
              throw new Error("Failed to save master data.");
            }
          }
          catch (error) {
            console.error("Submission Error:", error);
            MySwal.fire({
              icon: "error",
              title: "त्रुटी",
              text: "माहिती सेव  करण्यास अपयश. कृपया पुन्हा प्रयत्न करा",
            });
          }
        } else {
          MySwal.close(); // Close Swal if Cancel is clicked
        }
      });
  };




  useEffect(() => {

    const fetchImplication = async () => {
      try {
        const payload =
        {
          "cnt": 0
        }


        const headers = {
          "Content-Type": "application/json",
          Accept: "*/*",
        };
        const response = await axios.post(
          `${baseUrl.Url}/backend/api/GET_ST_Implication_ServiceCharge`,

          payload,
          { headers }
        );
        if (response.status !== 200)
          throw new Error("Failed to fetch vendor data");
        console.log("Implication", response.data)
        console.log("Implication", response.data[0].cnt)
        setImplicationCNT(response.data[0].cnt);
      } catch (error) {
        console.error("Error fetching Implication data:", error);
      }
    };

    fetchImplication();

  }, []);
  return (

    <>
      {/* Add Category */}
      <div className="modal fade" id="add-units-category">
        <div className="modal-dialog modal-dialog-centered custom-modal-two">
          <div className="modal-content">
            <div className="page-wrapper-new p-0">
              <div className="content">
                <div className="modal-header border-0 custom-modal-header">
                  <div className="page-title">
                    <h4> नविन  सेवा  प्रकार </h4>
                  </div>
                  <button
                    type="button"
                    className="close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    onClick={() => window.dispatchEvent(new Event("handleReload"))}
                  >
                    <span aria-hidden="true">×</span>
                  </button>
                </div>
                <div className="modal-body custom-modal-body">
                  <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input
                      type="text"
                      className="form-control"
                      name="TITLE"  // ✅ Add this
                      value={formData.TITLE}
                      onChange={handleChange}
                    />

                  </div>
                  <div className="modal-footer-btn">
                    <Link
                      to="#"
                      className="btn btn-cancel me-2"
                      data-bs-dismiss="modal"
                      onClick={() => window.dispatchEvent(new Event("handleReload"))}

                    >
                      रद्द करा
                    </Link>
                    <Link
                      className="btn btn-submit"
                      onClick={() => {
                        handleSubmit();
                      }}
                    >
                      सबमिट करा
                    </Link>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Add Category */}
    </>
  );
};

export default AddCategory;

