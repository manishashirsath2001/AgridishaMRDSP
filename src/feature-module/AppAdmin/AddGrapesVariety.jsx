
// import React, { useEffect, useState } from "react";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import Select from "react-select";
// import { all_routes } from "../../Router/all_routes";
// import { OverlayTrigger, Tooltip } from "react-bootstrap";
// import { useDispatch, useSelector } from "react-redux";
// import { setToogleHeader } from "../../core/redux/action";
// import { baseUrl, ACSPLGUID } from "../../core/json/custom";
// import Swal from "sweetalert2";
// import withReactContent from "sweetalert2-react-content";
// import axios from "axios";
// import { getUserData } from "../../Context/UserData";
// import { ArrowLeft, ChevronUp } from "feather-icons-react/build/IconComponents";

// const AddGrapesVariety = () => {
//   const location = useLocation();
//   const Vid = location.state?.Vid || null;
//   const navigate = useNavigate();
//   const route = all_routes;
//   const dispatch = useDispatch();
//   const GUID = ACSPLGUID.getNew();
//   const userdetail = getUserData();
//   const data = useSelector((state) => state.toggle_header);
//   const MySwal = withReactContent(Swal);

//   const [varietyOptions, setVarietyOptions] = useState([]);
//   const [subVarietyOptions, setSubVarietyOptions] = useState([]);
//   const [formData, setFormData] = useState({
//     vid: "",
//     varietyName: "",
//     varietyType: null,
//     subVarietyType: null,
//     description: "",
//     vstatus: false,
//     companyid: "COMP123",
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // Fetch variety and sub-variety options
//   useEffect(() => {
//     const fetchVariety = async () => {
//       try {
//         const payload = { implicationGroup: "VARIETY" };
//         const res = await axios.post(`${baseUrl.Url}/api/getImplications`, payload, {
//           headers: { "Content-Type": "application/json" },
//         });
//         setVarietyOptions(
//           res.data.map(({ iTitle, iValue }) => ({
//             label: iTitle,
//             value: iValue,
//           }))
//         );
//       } catch (err) {
//         console.error("Error fetching variety:", err);
//         setError("Failed to fetch variety options.");
//       }
//     };

//     const fetchSubVariety = async () => {
//       try {
//         const payload = { implicationGroup: "GSUBTYPE" };
//         const res = await axios.post(`${baseUrl.Url}/api/getImplications`, payload, {
//           headers: { "Content-Type": "application/json" },
//         });
//         setSubVarietyOptions(
//           res.data.map(({ iTitle, iValue }) => ({
//             label: iTitle,
//             value: iValue,
//           }))
//         );
//       } catch (err) {
//         console.error("Error fetching sub-variety:", err);
//         setError("Failed to fetch sub-variety options.");
//       }
//     };

//     fetchVariety();
//     fetchSubVariety();
//   }, []);

//   // Fetch data for editing
//   useEffect(() => {
//     if (!Vid || !varietyOptions.length || !subVarietyOptions.length) return;

//     const fetchMasterData = async () => {
//       setLoading(true);
//       try {
//         const payload = {
//           vid: Vid,
//           companyid: "COMP123",
//         };
//         const headers = {
//           "Content-Type": "application/json",
//           Accept: "*/*",
//         };
//         const response = await axios.post(`${baseUrl.Url}/api/GET_Variety`, payload, { headers });
//         if (response.status !== 200 || !response.data[0]) {
//           throw new Error("No variety data found");
//         }

//         const apiData = response.data[0];
//         console.log("API Data:", apiData); // Debugging: Log full API response

//         // Match against label instead of value
//         const matchedVariety = varietyOptions.find(
//           (opt) => opt.label.toString().toUpperCase() === (apiData.varityType || "").toString().toUpperCase()
//         ) || null;

//         const matchedSubVariety = subVarietyOptions.find(
//           (opt) => opt.label.toString().toUpperCase() === (apiData.subVarityType || "").toString().toUpperCase()
//         ) || null;

//         if (!matchedVariety) {
//           console.warn(`No matching variety found for: ${apiData.varityType}`);
//           // setError(`No matching variety found for: ${apiData.varityType || "undefined"}`);
//         }
//         if (!matchedSubVariety) {
//           console.warn(`No matching sub-variety found for: ${apiData.subVarityType}`);
//           // setError(`No matching sub-variety found for: ${apiData.subVarityType || "undefined"}`);
//         }

//         setFormData({
//           vid: apiData.vid || "",
//           varietyName: apiData.varietyName || "",
//           varietyType: matchedVariety,
//           subVarietyType: matchedSubVariety,
//           description: apiData.description || "",
//           vstatus: apiData.vstatus ?? false,
//           companyid: apiData.companyid || "COMP123",
//         });
//       } catch (error) {
//         console.error("Error in Master API Call:", error);
//         setError("Failed to fetch variety data.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMasterData();
//   }, [Vid, varietyOptions, subVarietyOptions]);

//   // Handle input changes
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   // Handle form submission
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!formData.varietyName || !formData.varietyType || !formData.subVarietyType) {
//       MySwal.fire({
//         icon: "error",
//         title: "Error",
//         text: "Please fill all required fields.",
//       });
//       return;
//     }
//     showConfirmationAlert();
//   };

//   // Confirm alert
//   const showConfirmationAlert = () => {
//     MySwal.fire({
//       title: "तुम्हाला खात्री आहे का?",
//       text: "तुम्हाला डेटाला सेव्ह करायचं आहे का?",
//       showCancelButton: true,
//       confirmButtonColor: "#00ff00",
//       confirmButtonText: "सेव्ह करा",
//       cancelButtonColor: "#092C4C",
//       cancelButtonText: "रद्द करा",
//     }).then((result) => {
//       if (result.isConfirmed) {
//         handleFormSubmission();
//       }
//     });
//   };

//   // Save API call
//   const handleFormSubmission = async () => {
//     try {
//       const payload = {
//         vid: formData.vid || GUID,
//         varityType: formData.varietyType?.label || "", // Use label to match API expectation
//         subVarityType: formData.subVarietyType?.label || "",
//         VarietyName: formData.varietyName,
//         Description: formData.description,
//         vstatus: formData.vstatus ?? false,
//         companyid: "COMP123",
//       };

//       const headers = {
//         "Content-Type": "application/json",
//         Accept: "*/*",
//       };

//       await axios.post(`${baseUrl.Url}/api/SP_AddUpdVarity`, JSON.stringify(payload), { headers });

//       MySwal.fire({
//         icon: "success",
//         title: "Saved!",
//         text: "Data saved successfully.",
//         confirmButtonText: "OK",
//       }).then(() => navigate(route.GrapesVariety));
//     } catch (error) {
//       console.error("Submission Error:", error);
//       MySwal.fire({
//         icon: "error",
//         title: "Error",
//         text: "Failed to save data. Please try again.",
//       });
//     }
//   };

//   return (
//     <div className="page-wrapper">
//       <div className="content">
//         <div className="page-header">
//           <div className="add-item d-flex">
//             <div className="page-title">
//               <h3>{Vid ? "द्राक्षाची विविधता संपादित करा" : "नवीन द्राक्षाची विविधता"}</h3>
//             </div>
//           </div>
//           <ul className="table-top-head">
//             <li>
//               <div className="page-btn">
//                 <Link to={route.GrapesVariety} className="btn btn-secondary">
//                   <ArrowLeft className="me-2" />
//                   मागे
//                 </Link>
//               </div>
//             </li>
//             <li>
//               <OverlayTrigger placement="top" overlay={<Tooltip>Collapse</Tooltip>}>
//                 <Link
//                   id="collapse-header"
//                   className={data ? "active" : ""}
//                   onClick={() => dispatch(setToogleHeader(!data))}
//                 >
//                   <ChevronUp className="feather-chevron-up" />
//                 </Link>
//               </OverlayTrigger>
//             </li>
//           </ul>
//         </div>

//         <div className="card table-list-card">
//           <div className="card-body p-4">
//             {loading && <p>Loading...</p>}
//             {error && <p className="text-danger">{error}</p>}
//             <form onSubmit={handleSubmit}>
//               <div className="row mb-3">
//                 {/* Variety */}
//                 <div className="col-md-5 mb-3">
//                   <label className="form-label required">द्राक्षाची व्हरायटी</label>
//                   <Select
//                     name="varietyType"
//                     classNamePrefix="react-select"
//                     options={varietyOptions}
//                     placeholder="Select Variety"
//                     value={formData.varietyType}
//                     onChange={(selectedOption) =>
//                       setFormData((prev) => ({
//                         ...prev,
//                         varietyType: selectedOption,
//                       }))
//                     }
//                     openMenuOnFocus={true}
//                     isClearable
//                   />
//                 </div>

//                 {/* Sub-Variety */}
//                 <div className="col-md-5 mb-3">
//                   <label className="form-label required">द्राक्षाची उप-व्हरायटी</label>
//                   <Select
//                     name="subVarietyType"
//                     classNamePrefix="react-select"
//                     options={subVarietyOptions}
//                     placeholder="Select Sub-Variety"
//                     value={formData.subVarietyType}
//                     onChange={(selectedOption) =>
//                       setFormData((prev) => ({
//                         ...prev,
//                         subVarietyType: selectedOption,
//                       }))
//                     }
//                     openMenuOnFocus={true}
//                     isClearable
//                   />
//                 </div>

//                 {/* Name */}
//                 <div className="col-md-5 mb-3">
//                   <label className="form-label required">नाव</label>
//                   <input
//                     type="text"
//                     name="varietyName"
//                     className="form-control"
//                     value={formData.varietyName}
//                     onChange={handleChange}
//                     required
//                   />
//                 </div>

//                 {/* Description */}
//                 <div className="col-md-5 mb-3">
//                   <label className="form-label">वर्णन</label>
//                   <textarea
//                     type="text"
//                     name="description"
//                     className="form-control"
//                     value={formData.description}
//                     onChange={handleChange}
//                   />
//                 </div>
//               </div>

//               <div className="row mb-3">
//                 <div className="col-md-12 d-flex justify-content-end">
//                   <button
//                     type="button"
//                     onClick={() => navigate(route.GrapesVariety)}
//                     className="btn btn-cancel me-2"
//                   >
//                     मागे
//                   </button>
//                   <button type="submit" className="btn btn-submit">
//                     सेव्ह
//                   </button>
//                 </div>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddGrapesVariety;

import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Select from "react-select";
import { all_routes } from "../../Router/all_routes";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { setToogleHeader } from "../../core/redux/action";
import { baseUrl, ACSPLGUID } from "../../core/json/custom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axios from "axios";
import { getUserData } from "../../Context/UserData";
import { ArrowLeft, ChevronUp } from "feather-icons-react/build/IconComponents";

const AddGrapesVariety = () => {
  const location = useLocation();
  const Vid = location.state?.Vid || null;
  const navigate = useNavigate();
  const route = all_routes;
  const dispatch = useDispatch();
  const GUID = ACSPLGUID.getNew();
  const userdetail = getUserData();
  const data = useSelector((state) => state.toggle_header);
  const MySwal = withReactContent(Swal);

  const [varietyOptions, setVarietyOptions] = useState([]);
  const [subVarietyOptions, setSubVarietyOptions] = useState([]);
  const [formData, setFormData] = useState({
    vid: "",
    varietyName: "",
    varietyType: null,
    subVarietyType: null,
    description: "",
    vstatus: false,
    companyid: "COMP123",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Normalize string for comparison
  const normalizeString = (str) => (str || "").toString().trim().toUpperCase();

  // Fetch variety and sub-variety options
  useEffect(() => {
    const fetchVariety = async () => {
      try {
        const payload = { implicationGroup: "VARIETY" };
        const res = await axios.post(`${baseUrl.Url}/api/getImplications`, payload, {
          headers: { "Content-Type": "application/json" },
        });
        const options = res.data.map(({ iTitle, iValue }) => ({
          label: iTitle,
          value: iValue,
        }));
        setVarietyOptions(options);
        console.log("varietyOptions fetched:", JSON.stringify(options, null, 2));
      } catch (err) {
        console.error("Error fetching variety:", err);
        setError("Failed to fetch variety options.");
      }
    };

    const fetchSubVariety = async () => {
      try {
        const payload = { implicationGroup: "GSUBTYPE" };
        const res = await axios.post(`${baseUrl.Url}/api/getImplications`, payload, {
          headers: { "Content-Type": "application/json" },
        });
        const options = res.data.map(({ iTitle, iValue }) => ({
          label: iTitle,
          value: iValue,
        }));
        setSubVarietyOptions(options);
        console.log("subVarietyOptions fetched:", JSON.stringify(options, null, 2));
      } catch (err) {
        console.error("Error fetching sub-variety:", err);
        setError("Failed to fetch sub-variety options.");
      }
    };

    fetchVariety();
    fetchSubVariety();
  }, []);

  // Fetch data for editing
  useEffect(() => {
    if (!Vid || varietyOptions.length === 0 || subVarietyOptions.length === 0) {
      if (Vid && (varietyOptions.length === 0 || subVarietyOptions.length === 0)) {
        // setError("Variety or sub-variety options are not loaded yet. Please wait.");
      }
      return;
    }

    const fetchMasterData = async () => {
      setLoading(true);
      try {
        const payload = {
          vid: Vid,
          companyid: "COMP123",
        };
        const headers = {
          "Content-Type": "application/json",
          Accept: "*/*",
        };
        const response = await axios.post(`${baseUrl.Url}/api/GET_Variety`, payload, { headers });
        if (response.status !== 200 || !response.data[0]) {
          throw new Error("No variety data found");
        }

        const apiData = response.data[0];
        console.log("API Data:", apiData);
        console.log("varityType from API:", apiData.varityType);
        console.log("subVarityType from API:", apiData.subVarityType);
        console.log("varietyOptions:", JSON.stringify(varietyOptions, null, 2));
        console.log("subVarietyOptions:", JSON.stringify(subVarietyOptions, null, 2));

        const matchedVariety = varietyOptions.find(
          (opt) => normalizeString(opt.label) === normalizeString(apiData.varityType)
        ) || null;

        const matchedSubVariety = subVarietyOptions.find(
          (opt) => normalizeString(opt.label) === normalizeString(apiData.subVarityType)
        ) || null;

        console.log("Matched Variety:", matchedVariety);
        console.log("Matched Sub-Variety:", matchedSubVariety);

        if (!matchedVariety && apiData.varityType) {
          setError(`No matching variety found for: ${apiData.varityType}. Please select a valid variety.`);
        }
        if (!matchedSubVariety && apiData.subVarityType) {
          setError(`No matching sub-variety found for: ${apiData.subVarityType}. Please select a valid sub-variety.`);
        }

        setFormData({
          vid: apiData.vid || "",
          varietyName: apiData.varietyName || "",
          varietyType: matchedVariety,
          subVarietyType: matchedSubVariety,
          description: apiData.description || "",
          vstatus: apiData.vstatus ?? false,
          companyid: apiData.companyid || "COMP123",
        });
      } catch (error) {
        console.error("Error in Master API Call:", error);
        setError("Failed to fetch variety data.");
      } finally {
        setLoading(false);
      }
    };

    fetchMasterData();
  }, [Vid, varietyOptions, subVarietyOptions]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.varietyName || !formData.varietyType || !formData.subVarietyType) {
      MySwal.fire({
        icon: "error",
        title: "Error",
        text: "Please fill all required fields.",
      });
      return;
    }
    showConfirmationAlert();
  };

  // Confirm alert
  const showConfirmationAlert = () => {
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

  // Save API call
  const handleFormSubmission = async () => {
    try {
      const payload = {
        vid: formData.vid || GUID,
        varityType: formData.varietyType?.label || "", // Use label as per API requirement
        subVarityType: formData.subVarietyType?.label || "", // Use label as per API requirement
        varietyName: formData.varietyName,
        description: formData.description,
        vstatus: formData.vstatus ?? false,
        companyid: "COMP123",
      };

      const headers = {
        "Content-Type": "application/json",
        Accept: "*/*",
      };

      await axios.post(`${baseUrl.Url}/api/SP_AddUpdVarity`, JSON.stringify(payload), { headers });

      MySwal.fire({
        icon: "success",
        title: "Saved!",
        text: "Data saved successfully.",
        confirmButtonText: "OK",
      }).then(() => navigate(route.GrapesVariety));
    } catch (error) {
      console.error("Submission Error:", error);
      MySwal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to save data. Please try again.",
      });
    }
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="add-item d-flex">
            <div className="page-title">
              <h3>{Vid ? "द्राक्षाची विविधता संपादित करा" : "नवीन द्राक्षाची विविधता"}</h3>
            </div>
          </div>
          <ul className="table-top-head">
            <li>
              <div className="page-btn">
                <Link to={route.GrapesVariety} className="btn btn-secondary">
                  <ArrowLeft className="me-2" />
                  मागे
                </Link>
              </div>
            </li>
            <li>
              <OverlayTrigger placement="top" overlay={<Tooltip>Collapse</Tooltip>}>
                <Link
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
          <div className="card-body p-4">
            {loading && <p>Loading...</p>}
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="row mb-3">
                {/* Variety */}
                <div className="col-md-5 mb-3">
                  <label className="form-label required">द्राक्षाची व्हरायटी</label>
                  <Select
                    name="varietyType"
                    classNamePrefix="react-select"
                    options={varietyOptions}
                    placeholder="Select Variety"
                    value={formData.varietyType}
                    onChange={(selectedOption) =>
                      setFormData((prev) => ({
                        ...prev,
                        varietyType: selectedOption,
                      }))
                    }
                    openMenuOnFocus={true}
                    isClearable
                  />
                </div>

                {/* Sub-Variety */}
                <div className="col-md-5 mb-3">
                  <label className="form-label required">द्राक्षाची उप-व्हरायटी</label>
                  <Select
                    name="subVarietyType"
                    classNamePrefix="react-select"
                    options={subVarietyOptions}
                    placeholder="Select Sub-Variety"
                    value={formData.subVarietyType}
                    onChange={(selectedOption) =>
                      setFormData((prev) => ({
                        ...prev,
                        subVarietyType: selectedOption,
                      }))
                    }
                    openMenuOnFocus={true}
                    isClearable
                  />
                </div>

                {/* Name */}
                <div className="col-md-5 mb-3">
                  <label className="form-label required">नाव</label>
                  <input
                    type="text"
                    name="varietyName"
                    className="form-control"
                    value={formData.varietyName}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Description */}
                <div className="col-md-5 mb-3">
                  <label className="form-label">वर्णन</label>
                  <textarea
                    type="text"
                    name="description"
                    className="form-control"
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-12 d-flex justify-content-end">
                  <button
                    type="button"
                    onClick={() => navigate(route.GrapesVariety)}
                    className="btn btn-cancel me-2"
                  >
                    मागे
                  </button>
                  <button type="submit" className="btn btn-submit">
                    सेव्ह
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddGrapesVariety;