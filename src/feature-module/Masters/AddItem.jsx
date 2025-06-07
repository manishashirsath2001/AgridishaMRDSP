import React, { useRef, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Select from "react-select";
import { all_routes } from "../../Router/all_routes";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { setToogleHeader } from "../../core/redux/action";
import { ACSPLGUID, baseUrl } from "../../core/json/custom";
import axios from 'axios';
import { getUserData } from "../../Context/UserData";
import ImageWithBasePath from "../../core/img/imagewithbasebath";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import {
  ArrowLeft,
  ChevronUp,
  ChevronDown,
  Info,
  PlusCircle,
  X,
  List,
} from "feather-icons-react/build/IconComponents";

const AddProduct = () => {
  const [isImageVisible1, setIsImageVisible1] = useState(true);
  const { isAuthenticated, userdetail } = getUserData();
  const [hsnType, sethsnType] = useState([]);
  const navigate = useNavigate();
  const GUID = ACSPLGUID.getNew()
  const firstInputRef = useRef(null);
  const dispatch = useDispatch();
  const data = useSelector((state) => state.toggle_header);
  const location = useLocation();
  const [hsnInput, sethsnInput] = useState("");
  const [IGSTValue, setIGSTValue] = useState("");
  const [CGSTValue, setCGSTValue] = useState("");
  const [SGSTValue, setSGSTValue] = useState("");
  const [CessValue, setCessValue] = useState("");
  const [FOTYPE, setFOTYPE] = useState([]);
  const [TOSALE, setTOSALE] = useState([]);
  const [category, setcategorydata] = useState([]);
  const [subcategory, setsubcategorydata] = useState([]);
  const [unit, setreorder] = useState([]);
  useEffect(() => {
    if (firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, []);

  if (isAuthenticated == true) {
    console.log("user", userdetail);
    console.log("getUserData", getUserData);
  }

  const route = all_routes;
  const { PAID } = location.state || {};
  console.log('primaryKey', PAID)
  const [formData, setFormData] = useState({
    ProductName: "",
    Category: "",
    SubCategory: "",
    HsnCode: "",
    Reorderlevel: "",
    Sell: "",
    FormProduct: "",
    Description: "",
    ReturnPolicy: "",
    IGST: 0,
    SGST: 0,
    CGST: 0,
    CESS: 0,
    productName1: "",
    category1: "",
    importantField1: "",
  });


  useEffect(() => {
    if (PAID) {
      const fetchData = async () => {
        try {
          const payload = {
            "pkid": PAID,
            "keyword": "%",
            "companyid": userdetail?.companyID ? userdetail.companyID : "",
            "deptid": userdetail?.departmentID ? userdetail.departmentID : ""
          }
          const headers = {
            "Content-Type": "application/json",
            Accept: "*/*",
          };

          axios({
            method: "POST",
            url: baseUrl.Url + "/backend/api/_GET_ProductMaster_/getByID",
            data: JSON.stringify(payload),
            headers: headers,
          })
            .then((response) => {
              if (response.status != 200) throw new Error("Failed to Fetching Data");
              const DATA = response.data[0];
              setFormData({
                ProductName: DATA.pname || "",
                Category: DATA.pcategory || "",
                SubCategory: DATA.psubcategory || "",
                HsnCode: DATA.phsn || "",
                Reorderlevel: DATA.preorderlevel || "",
                Sell: DATA.psales || "",
                FormProduct: DATA.pfromofproduct || "",
                Description: DATA.pdescription || "",
                ReturnPolicy: DATA.preturnpolicy || "",
                IGST: DATA.pigst?.toString() || 0,
                SGST: DATA.psgst?.toString() || 0,
                CGST: DATA.pigst?.toString() || 0,
                CESS: DATA.pcess?.toString() || 0,
                productName1: DATA.pname || "",
                category1: DATA.pcategory || "",
                importantField1: DATA.ptypesofsales || "",
              });
            })

        } catch (error) {
          console.error("Error fetching Access Right Data:", error);
        }

      };
      fetchData();
    }
  }, [PAID]);

  //   { value: "lenovo", label: "Lenovo" },
  //   { value: "electronics", label: "Electronics" },
  // ];

  // const subcategory = [

  //   { value: "lenovo", label: "Lenovo" },
  //   { value: "electronics", label: "Electronics" },
  // ];



  // const unit = [

  //   { value: "kg", label: "Kg" },
  //   { value: "pc", label: "Pc" },
  // ];

  useEffect(() => {
    const fetchImplications = async () => {
      try {
        const response = await axios.get(
          baseUrl.Url + "/backend/api/Implications/MTYPE|RTYPE|ROLAVEL",
          // "http://adsvr:78/api/Implications/SOLID|LIQUID|GAS"
        );

        if (response.status !== 200) throw new Error("Failed to fetch implications data");

        const data = response.data;
        const formofproductData = data
          .filter((item) => item.iGroup === "MTYPE")
          .map(({ iTitle, iValue }) => ({
            label: iTitle,
            value: iValue,
          }));

        const typeofsale = data
          .filter((item) => item.iGroup === "RTYPE")
          .map(({ iTitle, iValue }) => ({
            label: iTitle,
            value: iValue,
          }));

        const reorderlavel = data
          .filter((item) => item.iGroup === "ROLAVEL")
          .map(({ iTitle, iValue }) => ({
            label: iTitle,
            value: iValue,
          }));

        setreorder(reorderlavel);
        setFOTYPE(formofproductData);
        setTOSALE(typeofsale);
      } catch (error) {
        console.error("Error fetching implications:", error);
      }
    };
    const fetchcategory = async () => {
      try {
        const payload = {
          "companyid": userdetail?.companyID ? userdetail.companyID : "",
          "deptid": userdetail?.departmentID ? userdetail.departmentID : "",
        };
        const headers = {
          "Content-Type": "application/json",
          Accept: "*/*",
        };

        axios.post(baseUrl.Url + "/backend/api/GET_CategoryDropdown", payload, { headers })
          .then((response) => {
            if (response.status !== 200) throw new Error("Failed fetching Service Data");
            const data = response.data;

            // Combine all implications into one array
            const implicationsDropdown = data.map(({ ctid, categoryname }) => ({
              label: categoryname,
              value: ctid,
            }));

            setcategorydata(implicationsDropdown);
          });
      } catch (error) {
        console.error("Error fetching Service Data:", error);
      }
    };
    const fetchsubcategory = async () => {
      try {
        const payload = {
          "ctid": '%',
          "companyid": userdetail?.companyID ? userdetail.companyID : "",
          "deptid": userdetail?.departmentID ? userdetail.departmentID : "",
        };
        const headers = {
          "Content-Type": "application/json",
          Accept: "*/*",
        };

        axios.post(baseUrl.Url + "/backend/api/GET_SubCategoryDropdown", payload, { headers })
          .then((response) => {
            if (response.status !== 200) throw new Error("Failed fetching Service Data");
            const data = response.data;

            // Combine all implications into one array
            const implicationsDropdown = data.map(({ ctid, categoryname }) => ({
              label: categoryname,
              value: ctid,
            }));

            setsubcategorydata(implicationsDropdown);
          });
      } catch (error) {
        console.error("Error fetching Service Data:", error);
      }
    };
    fetchsubcategory();
    fetchcategory();
    fetchImplications();
    // const fetchImplications = async () => {
    //   try {
    //     const response = await axios.get(baseUrl.Url + "/backend/api/implications/MTYPE|RTYPE");
    //     if (response.status !== 200) throw new Error("Failed to fetch implications data");
    //     const data = response.data;
    //     const formofproductData = data
    //       .filter((item) => item.iGroup === "MTYPE")
    //       .map(({ iTitle, iValue }) => ({
    //         label: iTitle,
    //         value: iValue,
    //       }));

    //     const typeofsale = data
    //       .filter((item) => item.iGroup === "RTYPE")
    //       .map(({ iTitle, iValue }) => ({
    //         label: iTitle,
    //         value: iValue,
    //       }));

    //     setFOTYPE(formofproductData);
    //     setTOSALE(typeofsale);

    //     // const USTATUSData = data.filter(item => item.iGroup === "USTATUS");
    //     // .map(({ iTitle, iValue }) => ({
    //     //     label: iTitle,
    //     //     value: iValue,
    //     // }));
    //     // setImplications(USTATUSData);

    //   } catch (error) {
    //     console.error("Error fetching data:", error);
    //   }
    // };

    // fetchImplications();
  }, []);

  // const sellingtype = [

  //   { value: "B2B", label: "B2B" },
  //   { value: "B2C", label: "B2C" },
  //   { value: "Direct sales", label: "Direct sales" },
  //   { value: " SaaS", label: " SaaS" },
  // ];

  const handleChange = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSelectChange = (selectedOption, { name }) => {
    setFormData((prevState) => ({
      ...prevState,
      [name]: selectedOption ? selectedOption.value : null,
    }));
    if (name == 'HsnCode') {
      onhsnselect(selectedOption);
    }
  };

  const onhsnselect = (selectedOption) => {
    const haidvalue = selectedOption.value;
    const payload = {
      "haid": haidvalue,
    };

    const headers = {
      "Content-Type": "application/json",
      Accept: "*/*",
    };
    axios({
      method: "POST",
      // url: baseUrl.Url + "/backend/api/_GET_ServicesMaster_",
      url: baseUrl.Url + "/backend/api/HSNGSTDetails",
      data: JSON.stringify(payload),
      headers: headers,
    })
      .then((response) => {
        const { higst, hsgst, hcgst, hcess } = response.data[0];
        setFormData((prevFormData) => ({
          ...prevFormData,
          IGST: higst,
          SGST: hsgst,
          CGST: hcgst,
          CESS: hcess,
        }));

        setIGSTValue(higst)
        setCGSTValue(hcgst)
        setSGSTValue(hsgst)
        setCessValue(hcess)
        console.log('Response Data:', response.data);
      })
      .catch((error) => {
        console.error('Error fetching GST details:', error);
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    showConfirmationAlert(event);
  };

  const handleFormSubmission = async () => {
    if (IGSTValue !== formData.IGST || CGSTValue !== formData.CGST || SGSTValue !== formData.SGST || CessValue !== formData.CESS) {
      try {
        const gstPayload = {
          hcode: formData.HsnCode,
          higst: formData.IGST,
          hsgst: formData.SGST,
          hcgst: formData.CGST,
          hcess: formData.CESS
        };

        console.log("GST Update Payload:", gstPayload);

        const headers = {
          "Content-Type": "application/json",
          Accept: "*/*",
        };

        // First API Call - GST UPDATE
        const gstResponse = await axios.post(baseUrl.Url + "/backend/api/GSTUPDATE", gstPayload, { headers });

        if (gstResponse.status === 200) {
          console.log("GST Update Successful");

          // Proceed with second API call only after first one is successful
          const productPayload = {
            paid: PAID ? PAID : GUID,
            pcode: formData.pcode || "",
            pname: formData.ProductName,
            ptype: formData.ptype || "",
            pcategory: formData.Category,
            psubcategory: formData.SubCategory,
            pdescription: formData.Description,
            psales: formData.Sell,
            ptypesofsales: formData.importantField1,
            ppurchaseuom: "",
            phsn: formData.HsnCode,
            preorderlevel: formData.Reorder,
            pfromofproduct: formData.FormProduct,
            preturnpolicy: formData.ReturnPolicy,
            pproductuse: "",
            pimages: "",
            pigst: formData.IGST,
            psgst: formData.SGST,
            pcess: formData.CESS,
            pcgst: formData.CGST,
            companyid: userdetail?.companyID || "",
            deptid: userdetail?.departmentID || ""
          };

          console.log("Product Payload:", productPayload);

          const productResponse = await axios.post(baseUrl.Url + "/backend/api/ProductMaster", productPayload, { headers });

          if (productResponse.status === 200) {
            console.log("Product Master Update Successful");

            Swal.fire({
              icon: "success",
              title: "साठवले!",
              text: "माहिती यशस्वीरित्या सेव झाली",
              allowOutsideClick: false,
              allowEscapeKey: false,
              confirmButtonText: "OK",
            }).then(() => {
              navigate(route.ItemMaster);
            });
          } else {
            throw new Error(`Unexpected Product Master response: ${productResponse.status}`);
          }
        } else {
          throw new Error(`Unexpected GST Update response: ${gstResponse.status}`);
        }
      } catch (error) {
        console.error("Submission Error:", error);
        Swal.fire({
          icon: "error",
          title: "त्रुटी ",
          text: "माहिती जतन करण्यात अयशस्वी. कृपया पुन्हा प्रयत्न करा.",
          allowOutsideClick: false,
          allowEscapeKey: false,
        });
      }
    } else {
      try {
        const headers = {
          "Content-Type": "application/json",
          Accept: "*/*",
        };

        const productPayload = {
          paid: PAID ? PAID : GUID,
          pcode: formData.pcode || "",
          pname: formData.ProductName,
          ptype: formData.ptype || "",
          pcategory: formData.Category,
          psubcategory: formData.SubCategory,
          pdescription: formData.Description,
          psales: formData.Sell,
          ptypesofsales: formData.importantField1,
          ppurchaseuom: "",
          phsn: formData.HsnCode,
          preorderlevel: formData.Reorder,
          pfromofproduct: formData.FormProduct,
          preturnpolicy: formData.ReturnPolicy,
          pproductuse: "",
          pimages: "",
          pigst: formData.IGST,
          psgst: formData.SGST,
          pcess: formData.CESS,
          pcgst: formData.CGST,
          companyid: userdetail?.companyID || "",
          deptid: userdetail?.departmentID || ""
        };

        console.log("Product Payload:", productPayload);

        const productResponse = await axios.post(baseUrl.Url + "/backend/api/ProductMaster", productPayload, { headers });

        if (productResponse.status === 200) {
          console.log("Product Master Update Successful");

          Swal.fire({
            icon: "success",
            title: "साठवले!",
            text: "माहिती यशस्वीरित्या सेव झाली.",
            confirmButtonText: "OK",
            allowOutsideClick: false,
            allowEscapeKey: false,
          }).then(() => {
            navigate(route.ItemMaster);
          });
        } else {
          throw new Error(`Unexpected Product Master response: ${productResponse.status}`);
        }
      } catch (error) {
        console.error("Submission Error:", error);
        Swal.fire({
          icon: "error",
          title: "त्रुटी ",
          text: "माहिती जतन करण्यात अयशस्वी. कृपया पुन्हा प्रयत्न करा.",
          allowOutsideClick: false,
          allowEscapeKey: false,
        });
      }
    }
  };

  const MySwal = withReactContent(Swal);

  const showConfirmationAlert = (event) => {
    MySwal.fire({
      title: "तुम्हाला खात्री आहे का?",
      text: "तुम्हाला ही माहिती  सेव्ह करायची आहे",
      showCancelButton: true,
      confirmButtonColor: "#00ff00",
      confirmButtonText: "सेव्ह",
      cancelButtonColor: "#092C4C",
      cancelButtonText: "रद्द करा",
      allowOutsideClick: false,
      allowEscapeKey: false,
    }).then((result) => {
      if (result.isConfirmed) {
        handleFormSubmission(event);
      }
    });
  };

  const renderCollapseTooltip = (props) => (
    <Tooltip id="refresh-tooltip" {...props}>
      Collapse
    </Tooltip>
  );

  // const [showModal, setShowModal] = useState(false);
  // const handleSavemodal = () => {
  //   console.log("New Category Details:", formData);
  //   alert("New Category added!");
  //   setShowModal(false);
  //   setFormData({
  //     productName1: "",
  //     category1: "",
  //     importantField1: "",
  //   });
  // };


  // const handleExitmodal = () => {
  //   setShowModal(false);
  // };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRemoveProduct = () => {
    setIsImageVisible(false);
  };
  const [isImageVisible, setIsImageVisible] = useState(true);
  const handleRemoveProduct1 = () => {
    setIsImageVisible1(false);
  };


  const validateinput = (e) => {
    const { ProductName, Category, SubCategory, Sell, FormProduct, Reorder, IGST, SGST, CGST, CESS } = formData;

    if (!ProductName || !/^(?!\s*$)[a-zA-Z\s]{3,50}$/.test(ProductName)) {
      Swal.fire({
        icon: "error",
        title: "त्रुटी ",
        text: "सेवेचे नाव ३ ते ५० अक्षरांचे असावे आणि केवळ अक्षरेच असावीत.",
        allowOutsideClick: false,
        allowEscapeKey: false,
      }).then(() => {
        document.getElementById('ProductName').focus();
      });
      return;
    }

    if (!Category || Category === "Select Category") {
      Swal.fire({
        icon: "error",
        title: "त्रुटी ",
        text: "कृपया श्रेणी निवडा",
        allowOutsideClick: false,
        allowEscapeKey: false,
      }).then(() => {
        document.getElementById('Category').focus();
      });
      return;
    }

    if (!SubCategory || SubCategory === "Select SubCategory") {
      Swal.fire({
        icon: "error",
        title: "त्रुटी ",
        text: "कृपया उपश्रेणी निवडा",
        allowOutsideClick: false,
        allowEscapeKey: false,
      }).then(() => {
        document.getElementById('SubCategory').focus();
      });
      return;
    }

    if (!Sell || Sell === "Select Type Of Sale") {
      Swal.fire({
        icon: "error",
        title: "त्रुटी ",
        text: "कृपया विक्रीचा प्रकार निवडा",
        allowOutsideClick: false,
        allowEscapeKey: false,
      }).then(() => {
        document.getElementById('Sell').focus();
      });
      return;
    }

    if (!FormProduct || FormProduct === "Select Form of Product") {
      Swal.fire({
        icon: "error",
        title: "त्रुटी ",
        text: "कृपया उत्पादनाचा प्रकार निवडा",
        allowOutsideClick: false,
        allowEscapeKey: false,
      }).then(() => {
        document.getElementById('FormProduct').focus();
      });
      return;
    }

    if (!Reorder || Reorder === "Select Reorder level") {
      Swal.fire({
        icon: "error",
        title: "त्रुटी ",
        text: "कृपया पुनःऑर्डर स्तर निवडा",
        allowOutsideClick: false,
        allowEscapeKey: false,
      }).then(() => {
        document.getElementById('Reorder').focus();
      });
      return;
    }

    if (IGST && !/^(100(\.00)?|([1-9]?\d)(\.\d{1,2})?)$/.test(IGST)) {
      Swal.fire({
        icon: "error",
        title: "त्रुटी ",
        text: "IGST दर 0 ते 100 दरम्यान असलेली संख्या असावी आणि कमाल दोन दशांश अंकी असावी.",
        allowOutsideClick: false,
        allowEscapeKey: false,
      }).then(() => {
        document.getElementById('IGST').focus();
      });
      return;
    }

    if (SGST && !/^(100(\.00)?|([1-9]?\d)(\.\d{1,2})?)$/.test(SGST)) {
      Swal.fire({
        icon: "error",
        title: "त्रुटी ",
        text: "SGST दर 0 ते 100 दरम्यान असलेली संख्या असावी आणि कमाल दोन दशांश अंकी असावी.",
        allowOutsideClick: false,
        allowEscapeKey: false,
      }).then(() => {
        document.getElementById('SGST').focus();
      });
      return;
    }

    if (CGST && !/^(100(\.00)?|([1-9]?\d)(\.\d{1,2})?)$/.test(CGST)) {
      Swal.fire({
        icon: "error",
        title: "त्रुटी ",
        text: "CGST दर 0 ते 100 दरम्यान असलेली संख्या असावी आणि कमाल दोन दशांश अंकी असावी.",
        allowOutsideClick: false,
        allowEscapeKey: false,
      }).then(() => {
        document.getElementById('CGST').focus();
      });
      return;
    }

    if (CESS && !/^(100(\.00)?|([1-9]?\d)(\.\d{1,2})?)$/.test(CESS)) {
      Swal.fire({
        icon: "error",
        title: "त्रुटी ",
        text: "CESS दर 0 ते 100 दरम्यान असलेली संख्या असावी आणि कमाल दोन दशांश अंकी असावी.",
        allowOutsideClick: false,
        allowEscapeKey: false,
      }).then(() => {
        document.getElementById('CESS').focus();
      });
      return;
    }
    handleSubmit(e);
  };

  useEffect(() => {
    const handleShortcut = (e) => {

      if (e.ctrlKey && e.key === 'e') {
        e.preventDefault();
        showExitAlert();

      }
      if (e.ctrlKey && e.key === 's' || e.ctrlKey && e.key === 'S') {
        e.preventDefault();
        validateinput(e);

      }
    };

    window.addEventListener('keydown', handleShortcut);

    return () => {
      window.removeEventListener('keydown', handleShortcut);
    };
  }, [navigate, formData]);

  const showExitAlert = () => {
    MySwal.fire({
      text: "आपण बाहेर पडू इच्छिता का?",
      showCancelButton: true,
      confirmButtonColor: "#00ff00",
      confirmButtonText: "होय",
      cancelButtonColor: "#092C4C",
      cancelButtonText: "नाही",
      allowOutsideClick: false,
      allowEscapeKey: false,
    }).then((result) => {
      if (result.isConfirmed) {
        navigate(route.ItemMaster)
      }
    });
  };


  const HSNhandleChange = (HSNCODE) => {
    try {

      const payload = {
        "keyword": HSNCODE
      };

      const headers = {
        "Content-Type": "application/json",
        Accept: "*/*",
      };

      axios({
        method: "POST",
        url: baseUrl.Url + "/backend/api/GET_HSNCode",
        data: JSON.stringify(payload),
        headers: headers,
      })
        .then((response) => {
          const data = response.data;
          const hsnType = data
            .map(({ hcode }) => ({
              label: hcode,
              value: hcode,
            }));
          sethsnType(hsnType)
          console.log('Response Data:', response.data);
        });

    } catch (error) {
      console.error('get data Error:', error);
    }
  }

  const OnCategoryChange = (selectedOption) => {
    try {
      const payload = {
        "ctid": selectedOption.value,
        "companyid": userdetail?.companyID ? userdetail.companyID : "",
        "deptid": userdetail?.departmentID ? userdetail.departmentID : "",
      };
      const headers = {
        "Content-Type": "application/json",
        Accept: "*/*",
      };

      axios.post(baseUrl.Url + "/backend/api/GET_SubCategoryDropdown", payload, { headers })
        .then((response) => {
          if (response.status !== 200) throw new Error("Failed fetching Service Data");
          const data = response.data;

          // Combine all implications into one array
          const implicationsDropdown = data.map(({ ctid, categoryname }) => ({
            label: categoryname,
            value: ctid,
          }));

          setsubcategorydata(implicationsDropdown);
        });
    } catch (error) {
      console.error("Error fetching Service Data:", error);
    }
  }

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="add-item d-flex">
            <div className="page-title">
              <h3>उत्पादने व्यवस्थापन </h3>

            </div>
          </div>
          <ul className="table-top-head">
            <li>
              <div className="page-btn">
                <Link to={route.ItemMaster} className="btn btn-secondary">
                  <ArrowLeft className="me-2" />
                  मागे
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
                  onClick={() => {
                    dispatch(setToogleHeader(!data));
                  }}
                >
                  <ChevronUp className="feather-chevron-up" />
                </Link>
              </OverlayTrigger>
            </li>
          </ul>
        </div>
        {/* /add */}
        <form onSubmit={handleSubmit}>
          <div className="card mbgcolor">
            <div className="card-body add-product pb-0">
              <div
                className="accordion-card-one accordion"
                id="accordionExample"
              >
                <div className="accordion-item mbgcolor">
                  <div className="accordion-header" id="headingOne">
                    <div
                      className=""
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseOne"
                      aria-controls="collapseOne"
                    >
                      <div className="addproduct-icon">
                        <h5>
                          <Info className="add-info" />

                          <span>नवीन उत्पादने जोडा  </span>
                        </h5>

                      </div>
                    </div>
                  </div>
                  <div
                    id="collapseOne"
                    className="accordion-collapse collapse show"
                    aria-labelledby="headingOne"
                    data-bs-parent="#accordionExample"
                  >
                    <div className="accordion-body">

                      <div className="row">
                        <div className="col-lg-12 col-sm-6 col-12">
                          <div className="mb-3 add-product">
                            <label className="form-label required">उत्पादनाचे नाव </label>
                            <input type="text" className="form-control"
                              ref={firstInputRef}
                              name="ProductName"
                              pattern="^(?!\s*$)[a-zA-Z\s]{3,50}$"
                              onChange={handleChange}
                              value={formData.ProductName}
                              title="Service Name must be 3-50 characters long and can only contain letters. Numbers, symbols, and spaces are not allowed."
                              required />
                          </div>
                        </div>


                      </div>
                      <div className="addservice-info">
                        <div className="row">
                          <div className="col-lg-6 col-sm-6 col-12">
                            <div className="mb-3 add-product">
                              <div className="add-newplus">
                                <label className="form-label required">उत्पादनाची श्रेणी</label>
                                {/* <Link
                                  to="#"
                                  data-bs-toggle="modal"
                                  data-bs-target="#add-units-category"
                                  onClick={() => setShowModal(true)}
                                >
                                  <PlusCircle className="plus-down-add" />
                                  <span>Add New</span>
                                </Link> */}
                              </div>
                              {/* {showModal && (
                                <div className="modal fade show" style={{ display: "block" }} tabIndex="-1" role="dialog">
                                  <div className="modal-dialog" role="document">
                                    <div className="modal-content">
                                      <div className="modal-header">
                                        <h5 className="modal-title">Add New Category</h5>
                                        <button
                                          type="button"
                                          className="btn-close"
                                          onClick={handleExitmodal}
                                          aria-label="Close"
                                        />
                                      </div>
                                      <div className="modal-body">
                                        <div className="mb-3">
                                          <label htmlFor="productName" className="form-label">
                                            Product Name
                                          </label>
                                          <input
                                            type="text"
                                            id="productName1"
                                            name="productName1"
                                            value={formData.productName1}
                                            onChange={handleInputChange}
                                            className="form-control"
                                            placeholder="Enter product name"
                                          />
                                        </div>
                                        <div className="mb-3">
                                          <label htmlFor="category2" className="form-label">
                                            Category
                                          </label>
                                          <input
                                            type="text"
                                            id="category1"
                                            name="Category"
                                            value={formData.category1}
                                            onChange={handleInputChange}
                                            className="form-control"
                                            placeholder="Enter category name"
                                          />
                                        </div>
                                        <div className="mb-3">
                                          <label htmlFor="importantField1" className="form-label">
                                            Important Field
                                          </label>
                                          <input
                                            type="text"
                                            id="importantField1"
                                            name="importantField1"
                                            value={formData.importantField1}
                                            onChange={handleInputChange}
                                            className="form-control"
                                            placeholder="Enter important field"
                                          />
                                        </div>
                                      </div>
                                      <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" onClick={handleExitmodal}>
                                          Close
                                        </button>
                                        <button type="button" className="btn btn-primary" onClick={handleSavemodal}>
                                          Save
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )} */}
                              <Select
                                classNamePrefix="react-select"
                                options={category}
                                placeholder="Choose"
                                name="Category"
                                value={category?.find(option => option.value === formData.Category) || null}
                                onChange={(selectedOption) => {
                                  handleSelectChange(selectedOption, { name: "Category" });
                                  OnCategoryChange(selectedOption);
                                }}
                                required
                                openMenuOnFocus={true}
                              />
                            </div>
                          </div>
                          <div className="col-lg-6 col-sm-6 col-12">
                            <div className="mb-3 add-product">
                              <label className="form-label required" >उत्पादनाची उपश्रेणी</label>

                              <Select
                                classNamePrefix="react-select"
                                options={subcategory}
                                placeholder="Choose"
                                name="SubCategory"
                                value={subcategory?.find(option => option.value === formData.SubCategory) || null}
                                onChange={(selectedOption) =>
                                  handleSelectChange(selectedOption, { name: "SubCategory" })
                                }
                                required
                                openMenuOnFocus={true}
                              />
                            </div>
                          </div>

                        </div>
                      </div>
                      <div className="add-product-new">
                        <div className="row">
                          <div className="col-lg-6 col-sm-6 col-12">
                            <div className="mb-3 add-product">
                              <label className="form-label required" >विक्रीचा प्रकार</label>
                              <Select
                                classNamePrefix="react-select"
                                options={FOTYPE}
                                placeholder="Choose"
                                name="Sell"

                                value={FOTYPE?.find(option => option.value === formData.Sell) || null}
                                onChange={(selectedOption) =>
                                  handleSelectChange(selectedOption, { name: "Sell" })
                                }
                                required
                                openMenuOnFocus={true}
                              />
                            </div>
                          </div>


                          <div className="col-lg-6 col-sm-6 col-12">
                            <div className="mb-3 add-product">
                              <label className="form-label required">उत्पादनाचा प्रकार</label>
                              <Select
                                classNamePrefix="react-select"
                                options={TOSALE}
                                placeholder="Choose"
                                name="FormProduct"
                                value={TOSALE?.find(option => option.value === formData.FormProduct) || null}
                                onChange={(selectedOption) =>
                                  handleSelectChange(selectedOption, { name: "FormProduct" })
                                }
                                required
                                openMenuOnFocus={true}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-6 col-sm-6 col-12">
                          <div className="mb-3 add-product">
                            <div className="add-newplus">
                              <label className="form-label required">पुनःऑर्डर स्तर</label>
                              {/* <Link
                                to="#"
                                data-bs-toggle="modal"
                                data-bs-target="#add-unit"
                              >

                              </Link> */}
                            </div>
                            <Select
                              classNamePrefix="react-select"
                              options={unit}
                              placeholder="Choose"
                              name="Reorder"
                              value={unit?.find(option => option.value === formData.Reorder) || null}
                              onChange={(selectedOption) =>
                                handleSelectChange(selectedOption, { name: "Reorder" })
                              }
                              required
                              openMenuOnFocus={true}
                            />
                          </div>
                        </div>

                      </div>
                      <div
                        className="accordion-card-one accordion"
                        id="accordionExample4"
                      >
                        <div className="accordion-item mbgcolor">
                          <div className="accordion-header" id="headingFour">
                            <div
                              className=""
                              data-bs-toggle="collapse"
                              data-bs-target="#collapseFour"
                              aria-controls="collapseFour"
                            >
                              <div className="text-editor add-list">
                                <div className="addproduct-icon list">
                                  <h5>
                                    <List className="add-info" />
                                    <span>HSN  कोड </span>
                                  </h5>
                                  <Link to="#">
                                    <ChevronDown className="chevron-down-add" />
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div
                            id="collapseFour"
                            className="accordion-collapse collapse show"
                            aria-labelledby="headingFour"
                            data-bs-parent="#accordionExample4"
                          >
                            <div className="accordion-body">

                              {/* <div className="custom-filed">
                                <div className="col-lg-4 col-md-3 col-sm-6 col-12">
                                  <div className="mb-3 add-product">
                                    <div className="add-newplus">
                                      <label className="form-label">HSN Code</label>
                                      <a

                                        onClick={() => { navigate(route.AddHSNMaster, { state: { id: '1' } }) }}
                                        data-bs-target="#add-units-category"
                                      >
                                        <PlusCircle className="plus-down-add" />
                                        <span>Add New</span>
                                      </a>

                                    </div>
                                    <Select
                                      classNamePrefix="react-select"
                                      options={hsnType}
                                      placeholder="Choose"
                                      name="HSN"
                                      value={hsnType.find((option) => option.value === formData.HsnCode) || null} // Correctly sets the selected option
                                      onChange={(selectedOption) =>
                                        handleSelectChange(selectedOption, { name: "HsnCode" }) // Update `HsnCode` in formData
                                      }
                                    />

                                  </div>

                                </div>
                              </div> */}
                              <div className="mb-3 row">
                                <div className="col-md-6">
                                  <label htmlFor="hsnCode" className="form-label">
                                    HSN कोड
                                  </label>
                                  <div className="d-flex">
                                    {/* Input Field */}
                                    <div className="position-relative" style={{ width: "150px", marginRight: "10px" }}>
                                      <input
                                        type="text"
                                        id="hsnInput"
                                        name="hsnInput"
                                        value={hsnInput}
                                        onBlur={(e) => HSNhandleChange(e.target.value)}
                                        onChange={(e) => sethsnInput(e.target.value)}
                                        className="form-control"
                                        placeholder="HSN कोड "
                                        required
                                        style={{ paddingLeft: "30px" }}
                                      />

                                      <i
                                        className="bi bi-search position-absolute"
                                        style={{
                                          top: "50%",
                                          left: "8px",
                                          transform: "translateY(-50%)",
                                          color: "#6c757d",
                                        }}
                                      ></i>
                                    </div>

                                    <Select
                                      id="SHSN"
                                      name="hsnCode"
                                      value={hsnType?.find((option) => option.value === formData.HsnCode) || null}
                                      onChange={(selectedOption) =>
                                        handleSelectChange(selectedOption, { name: "HsnCode" })
                                      }
                                      options={hsnType}
                                      classNamePrefix="react-select"
                                      title="योग्य HSN कोड निवडा "
                                      required
                                      className="flex-grow-1"
                                      openMenuOnFocus={true}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="row">



                                <div className="col-lg-3 col-md-3 col-sm-6 col-12">
                                  <label className="form-label">IGST</label>
                                  <input
                                    type="text"
                                    className="form-control border text-dark"
                                    name="IGST"
                                    placeholder="Enter IGST"
                                    value={formData.IGST}
                                    onChange={handleInputChange}
                                    pattern="^(100(\.00)?|([1-9]?\d)(\.\d{1,2})?)$"
                                    title="GST दर 0 ते 100 दरम्यान असलेली संख्या असावी आणि कमाल दोन दशांश अंकी असावी."

                                  />
                                </div>

                                <div className="col-lg-3 col-md-3 col-sm-6 col-12">
                                  <div className="mb-3 add-product form-label ">
                                    <label className="form-label">SGST</label>
                                    <input
                                      type="text"
                                      className="form-control border text-dark"
                                      name="SGST"
                                      placeholder="Enter SGST Rate "
                                      value={formData.SGST}
                                      onChange={handleInputChange}
                                      pattern="^(100(\.00)?|([1-9]?\d)(\.\d{1,2})?)$"
                                      title="SGST दर 0 ते 100 दरम्यान असलेली संख्या असावी आणि जास्तीत जास्त दोन दशांश असावेत."

                                    />
                                  </div>
                                </div>

                                <div className="col-lg-3 col-md-3 col-sm-6 col-12">
                                  <div className="mb-3 add-product form-label">
                                    <label className="form-label">CGST</label>
                                    <input
                                      type="text"
                                      className="form-control border text-dark"
                                      name="CGST"
                                      placeholder="Enter CGST Rate "
                                      value={formData.CGST}
                                      onChange={handleInputChange}
                                      pattern="^(100(\.00)?|([1-9]?\d)(\.\d{1,2})?)$"
                                      title="CGST दर 0 ते 100 दरम्यान असलेली संख्या असावी आणि जास्तीत जास्त दोन दशांश असावेत."

                                    />
                                  </div>
                                </div>

                                <div className="col-lg-3 col-md-3 col-sm-6 col-12">
                                  <div className="mb-3 add-product form-label">
                                    <label className="form-label">CESS</label>
                                    <input
                                      type="text"
                                      className="form-control border text-dark"
                                      name="CESS"
                                      placeholder="Enter CESS Rate"
                                      value={formData.CESS}
                                      onChange={handleInputChange}
                                      pattern="^(100(\.00)?|([1-9]?\d)(\.\d{1,2})?)$"
                                      title="CESS दर 0 ते 100 दरम्यान असलेली संख्या असावी आणि जास्तीत जास्त दोन दशांश असावेत."

                                    />
                                  </div>
                                </div>
                              </div>

                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        className="accordion-card-one accordion"
                        id="accordionExample3"
                      >
                        <div className="accordion-item mbgcolor">
                          <div
                            className="accordion-header"
                            id="headingThree"
                          >
                            <div
                              className=""
                              data-bs-toggle="collapse"
                              data-bs-target="#collapseThree"
                              aria-controls="collapseThree"
                            >
                              <div className="addproduct-icon list">
                                <h5>
                                  <i
                                    data-feather="image"
                                    className="add-info"
                                  />
                                  <span>फोटो</span>
                                </h5>
                                <Link to="#">
                                  <ChevronDown className="chevron-down-add" />
                                </Link>
                              </div>
                            </div>
                          </div>
                          <div
                            id="collapseThree"
                            className="accordion-collapse collapse show"
                            aria-labelledby="headingThree"
                            data-bs-parent="#accordionExample3"
                          >
                            <div className="accordion-body">
                              <div className="text-editor add-list add">
                                <div className="col-lg-12">
                                  <div className="add-choosen">
                                    <div className="input-blocks">
                                      <div className="image-upload">
                                        <input type="file" />
                                        <div className="image-uploads">
                                          <PlusCircle className="plus-down-add me-0" />
                                          <h4>फोटो जोडा  </h4>
                                        </div>
                                      </div>
                                    </div>
                                    {isImageVisible1 && (
                                      <div className="phone-img">
                                        <ImageWithBasePath
                                          src="assets/img/products/phone-add-2.png"
                                          alt="image"
                                        />
                                        <Link to="#">
                                          <X
                                            className="x-square-add remove-product"
                                            onClick={handleRemoveProduct1}
                                          />
                                        </Link>
                                      </div>
                                    )}
                                    {isImageVisible && (
                                      <div className="phone-img">
                                        <ImageWithBasePath
                                          src="assets/img/products/phone-add-1.png"
                                          alt="image"
                                        />
                                        <Link to="#">
                                          <X
                                            className="x-square-add remove-product"
                                            onClick={handleRemoveProduct}
                                          />
                                        </Link>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Editor */}
                      <div className="col-lg-12 col-sm-6">
                        <div className="">
                          <label className="form-label" >माहिती </label>
                          <textarea
                            style={{ fontWeight: '800' }}
                            className="form-control "
                            rows={5}
                            name="Description"
                            onChange={handleChange}
                            value={formData.Description}
                            defaultValue={""}
                          />


                        </div>
                      </div>
                      <div className="col-lg-12">
                        <div className="">
                          <label className="form-label">परतावा धोरण</label>
                          <textarea
                            className="form-control"
                            style={{ fontWeight: '800' }}
                            rows={5}
                            name="ReturnPolicy"
                            onChange={handleChange}
                            value={formData.ReturnPolicy}
                            defaultValue={""}
                          />

                        </div>
                      </div>
                      {/* /Editor */}
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-12">
                <div className="btn-addproduct mb-4">
                  <button type="button"
                    onClick={showExitAlert}
                    className="btn btn-cancel me-2">
                    मागे
                  </button>

                  <button type="submit" className="btn btn-submit " >
                    सेव्ह
                  </button>
                </div>
              </div>
            </div>

          </div>

        </form>
        {/* /add */}
      </div >

    </div >
  );
};

export default AddProduct;

