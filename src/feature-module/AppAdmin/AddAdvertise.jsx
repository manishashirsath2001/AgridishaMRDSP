
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import { all_routes } from "../../Router/all_routes";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { setToogleHeader } from "../../core/redux/action";
import { baseUrl, ACSPLGUID } from "../../core/json/custom";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axios from "axios";
import { getUserData } from "../../Context/UserData";
import { FaEye } from "react-icons/fa";
import { ArrowLeft, ChevronUp } from "feather-icons-react/build/IconComponents";

const AddAdvertise = () => {
  const location = useLocation();
  const { aDid } = location.state || {};
  // const generatedID = ACSPLGUID?.getNew();
  const GUID = ACSPLGUID.getNew()
  const navigate = useNavigate();
  const route = all_routes;
  const dispatch = useDispatch();
  const { userdetail } = getUserData();
  const data = useSelector((state) => state.toggle_header);
  const logtypeRef = useRef(null);
  const aDtitleRef = useRef(null);
  const aDimageRef = useRef(null);
  const isactiveRef = useRef(null);

  const MySwal = withReactContent(Swal);
  const [formData, setFormData] = useState({
    aDid: "",
    logtype: "",
    aDtitle: "",
    aDimage: "",
    isactive: "",
  });
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false); // New state for upload loading
  const [status, setStatus] = useState([]);

  const renderCollapseTooltip = (props) => (
    <Tooltip id="refresh-tooltip" {...props}>
      Collapse
    </Tooltip>
  );

  useEffect(() => {
    if (aDtitleRef.current) {
      aDtitleRef.current.focus();
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSelectChange = (selectedOption, field) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: selectedOption ? selectedOption.value : "",
    }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!generatedID) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to generate unique ID.",
        });
        return;
      }
      const sanitizedFileName = file.name
        .trim()
        .replace(/\s+/g, "_")
        .replace(/[^\w.-]/g, "");
      const finalFileName = `${generatedID}_${sanitizedFileName}`;
      setIsUploading(true); // Set uploading state
      const fileUrl = URL.createObjectURL(file);
      setImagePreviewUrl(fileUrl); // Show preview immediately
      try {
        await uploadProfile(file, finalFileName);
        setFormData((prev) => ({ ...prev, aDimage: finalFileName })); // Update aDimage only on success
      } catch (error) {
        setImagePreviewUrl(null); // Clear preview on failure
        setFormData((prev) => ({ ...prev, aDimage: "" })); // Clear aDimage on failure
      } finally {
        setIsUploading(false); // Reset uploading state
      }
    }
  };

  const uploadProfile = async (fileData, finalFileName) => {
    const formData = new FormData();
    formData.append("Files", fileData);
    formData.append("FileNames", finalFileName);
    formData.append("FileDescription", "Profile Image");

    try {
      const response = await axios.post(
        `${baseUrl.Url}/api/ProfileUpload/Upload`, // Ensure baseUrl.Url is correct
        formData,
        {
          headers: {
            accept: "*/*",
            "Content-Type": "multipart/form-data",
          },
        }
      );
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "फोटो यशस्वीरित्या अपलोड झाला!",
        timer: 1500,
      });
      return response.data;
    } catch (error) {
      console.error("Upload Error:", error.message);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "फोटो अपलोड होताना त्रुटी आली.",
      });
      throw error;
    }
  };

  const handleFormSubmission = async () => {
    try {
      const payload = {
        aDid: aDid ? aDid : GUID,
        logtype: formData.logtype,
        aDtitle: formData.aDtitle,
        aDimage: formData.aDimage,
        isactive: formData.isactive,
        companyid: "COMP123",
        deptid: "",
        uaid: "",
        date: "",
      };
      const headers = {
        "Content-Type": "application/json",
        Accept: "*/*",
      };
      await axios.post(
        `${baseUrl.Url}/api/SP_AddUpdAdvertisement`,
        payload,
        { headers }
      );
      Swal.fire({
        icon: "success",
        title: "Saved!",
        text: "Data saved successfully.",
        confirmButtonText: "OK",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate(route.Advertise);
        }
      });
      setFormData({
        aDid: "",
        logtype: "",
        aDtitle: "",
        aDimage: "",
        isactive: "",
      });
      setImagePreviewUrl(null);
    } catch (error) {
      console.error("Submission Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to save data. Please try again.",
      });
    }
  };

  const checkFormValidity = (e) => {
    const { logtype, aDtitle, aDimage, isactive } = formData;
    if (!logtype) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "प्रकार आवश्यक आहे",
      }).then(() => {
        logtypeRef.current.focus();
      });
      return;
    }
    if (!aDtitle) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "शीर्षक आवश्यक आहे",
      }).then(() => {
        aDtitleRef.current.focus();
      });
      return;
    }
    if (!aDimage) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "फोटो आवश्यक आहे",
      }).then(() => {
        aDimageRef.current.focus();
      });
      return;
    }
    if (!isactive) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "स्थिती आवश्यक आहे",
      }).then(() => {
        isactiveRef.current.focus();
      });
      return;
    }
    handleSubmit(e);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    MySwal.fire({
      title: "तुम्हाला खात्री आहे का?",
      text: "तुम्हाला डेटाला सेव्ह करायचं आहे का?",
      showCancelButton: true,
      confirmButtonColor: "#00ff00",
      confirmButtonText: "सेव्ह करा",
      cancelButtonColor: "#092C4C",
      cancelButtonText: "रद्द करा",
    }).then((result) => {
      if (result.isConfirmed) {
        handleFormSubmission();
      }
    });
  };

  const openModal = () => {
    if (imagePreviewUrl) {
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openModalWithImage = (imageName) => {
    const fileUrl = `${baseUrl.Url}/Assets/${imageName}`;
    setImagePreviewUrl(fileUrl);
    setIsModalOpen(true);
  };

  useEffect(() => {
    if (!aDid) return;
    const fetchMasterData = async () => {
      try {
        const payload1 = {
          aDid: aDid,
          keyword: "%",
          companyid: "COMP123",
          deptid: "",
        };
        const headers = {
          "Content-Type": "application/json",
          Accept: "*/*",
        };
        const response = await axios.post(
          `${baseUrl.Url}/api/GET_Advertisement`,
          payload1,
          { headers }
        );
        if (response.status !== 200) throw new Error("Failed to fetch data");
        let apiData = response.data[0];
        setFormData({
          aDid: apiData.aDid,
          logtype: apiData.logtype,
          aDtitle: apiData.aDtitle,
          aDimage: apiData.aDimage,
          isactive: apiData.isactive,
        });
        if (apiData.aDimage) {
          setImagePreviewUrl(`${baseUrl.Url}/Images/${apiData.aDimage}`);
        }
      } catch (error) {
        console.error("Error in Master API Call:", error);
      }
    };
    fetchMasterData();
  }, [aDid]);

  useEffect(() => {
    const fetchAdvertise = async () => {
      try {
        const payload = {
          implicationGroup: "STATUS",
        };
        const varietyRes = await axios.post(
          `${baseUrl.Url}/api/getImplications`,
          payload,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        setStatus(
          varietyRes.data.map(({ iTitle, iValue }) => ({
            label: iTitle,
            value: iValue,
          }))
        );
      } catch (err) {
        console.error("Error fetching status:", err);
      }
    };
    fetchAdvertise();
  }, []);

  const handleKeyDown = (e, nextInputRef) => {
    if (e.key === "Enter" || e.key === "Tab") {
      const isDropdownOpen =
        document.activeElement.getAttribute("aria-expanded") === "true";
      if (!isDropdownOpen) {
        e.preventDefault();
        if (nextInputRef && nextInputRef.current) {
          nextInputRef.current.focus();
        }
      }
    }
  };

  const showExitAlert = () => {
    MySwal.fire({
      title: "तुम्हाला खात्री आहे का?",
      text: "तुम्हाला मागे जायचं आहे का?",
      showCancelButton: true,
      confirmButtonColor: "#00ff00",
      confirmButtonText: "हो",
      cancelButtonColor: "#092C4C",
      cancelButtonText: "नाही",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate(route.Advertise);
      }
    });
  };

  useEffect(() => {
    const handleShortcut = (e) => {
      if (e.ctrlKey && e.key === "e") {
        e.preventDefault();
        showExitAlert();
      }
      if (e.ctrlKey && (e.key === "s" || e.key === "S")) {
        e.preventDefault();
        checkFormValidity(e);
      }
    };
    window.addEventListener("keydown", handleShortcut);
    return () => {
      window.removeEventListener("keydown", handleShortcut);
    };
  }, [formData, navigate]);

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="add-item d-flex">
            <div className="page-title">
              <h3>नवीन जाहिरात</h3>
              <h6>नवीन जाहिरात करणे</h6>
            </div>
          </div>
          <ul className="table-top-head">
            <li>
              <div className="page-btn">
                <Link to={route.Advertise} className="btn btn-secondary">
                  <ArrowLeft className="me-2" />
                  जाहिरात मास्टर वर परत जा
                </Link>
              </div>
            </li>
            <li>
              <OverlayTrigger placement="top" overlay={renderCollapseTooltip}>
                <Link
                  data-bs-toggle="tooltip"
                  data-bs-placement="top"
                  title="Collapse"
                  id="collapse-header"
                  className={data ? "active" : ""}
                  onClick={() => dispatch(setToogleHeader(!data))}
                >
                  <ChevronUp className="feather-chevron-up" />
                </Link>
              </OverlayTrigger>
            </li>
          </ul>
        </div>

        <div className="card table-list-card">
          <div className="card-body mbgcolor">
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                <div className="mb-3 row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label required">शीर्षक :</label>
                    <input
                      type="text"
                      name="aDtitle"
                      className="form-control"
                      value={formData.aDtitle}
                      onChange={handleChange}
                      ref={aDtitleRef}
                      onKeyDown={(e) => handleKeyDown(e, aDimageRef)}
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <div className="mb-0 form-label position-relative">
                      <label className="form-label">
                        फोटो :
                        {formData.aDimage && (
                          <span
                            style={{
                              color: "green",
                              fontSize: "14px",
                              fontWeight: "bold",
                              marginLeft: "5px",
                            }}
                          >
                            ✔
                          </span>
                        )}
                        {formData.aDimage && (
                          <span
                            className="ms-2"
                            style={{
                              color: "green",
                              fontWeight: "bold",
                              cursor: "pointer",
                            }}
                            onClick={() => openModalWithImage(formData.aDimage)}
                          >
                            {formData.aDimage.split("_").pop()}
                          </span>
                        )}
                      </label>
                      <input
                        className="form-control pe-5"
                        type="file"
                        name="aDimage"
                        onChange={handleFileChange}
                        ref={aDimageRef}
                        onKeyDown={(e) => handleKeyDown(e, isactiveRef)}
                        disabled={isUploading}
                      />
                      {isUploading && (
                        <span
                          className="position-absolute"
                          style={{
                            right: "10px",
                            top: "70%",
                            transform: "translateY(-50%)",
                          }}
                        >
                          Uploading...
                        </span>
                      )}
                      {!isUploading && (
                        <FaEye
                          className="position-absolute"
                          style={{
                            right: "10px",
                            top: "70%",
                            transform: "translateY(-50%)",
                            cursor: "pointer",
                          }}
                          onClick={openModal}
                        />
                      )}
                    </div>
                    {isModalOpen && imagePreviewUrl && (
                      <div
                        className="modal fade show"
                        tabIndex="-1"
                        style={{
                          display: "block",
                          backdropFilter: "blur(5px)",
                          backgroundColor: "rgba(0,0,0,0.5)",
                        }}
                      >
                        <div className="modal-dialog modal-dialog-centered modal-lg">
                          <div className="modal-content shadow-lg rounded-3">
                            <div className="modal-header bg-primary text-white border-0">
                              <h5 className="modal-title">Image Preview</h5>
                              <button
                                type="button"
                                className="btn-close text-white"
                                onClick={closeModal}
                              ></button>
                            </div>
                            <div className="modal-body p-4">
                              <img
                                src={imagePreviewUrl}
                                alt="Preview"
                                className="img-fluid rounded-3 shadow-sm"
                              />
                            </div>
                            <div className="modal-footer border-0 bg-light">
                              <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={closeModal}
                              >
                                Close
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="col-lg-6 col-sm-6 col-12">
                    <label className="form-label required">स्थिती :</label>
                    <div className="input-blocks add-product">
                      <Select
                        name="isactive"
                        classNamePrefix="react-select"
                        options={status}
                        placeholder="Select"
                        title="Please select a valid type of Status."
                        openMenuOnFocus={true}
                        value={
                          status.find(
                            (option) =>
                              String(option.value) === String(formData.isactive)
                          ) || null
                        }
                        onChange={(selectedOption) =>
                          setFormData((prevState) => ({
                            ...prevState,
                            isactive: selectedOption ? selectedOption.value : "",
                          }))
                        }
                        ref={isactiveRef}
                        onKeyDown={(e) => handleKeyDown(e, null)}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-lg-12">
                  <div className="btn-addproduct mb-4">
                    <button
                      type="button"
                      onClick={showExitAlert}
                      className="btn btn-cancel me-2"
                    >
                      मागे
                    </button>
                    <button
                      type="submit"
                      className="btn btn-submit"
                      disabled={isUploading}
                    >
                      सेव्ह
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAdvertise;