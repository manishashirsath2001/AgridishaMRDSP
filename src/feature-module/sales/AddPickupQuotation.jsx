import React, { useState, useEffect, useRef } from "react";
import {
    ArrowLeft,
} from "feather-icons-react/build/IconComponents";
// import { Link } from "react-router-dom";
// import TextEditor from "../../../feature-module/inventory/texteditor";
// import ImageWithBasePath from "../../img/imagewithbasebath";
import Select from "react-select";
// import { DatePicker } from "antd";
// import { Calendar } from "feather-icons-react/build/IconComponents";
import { useNavigate } from "react-router-dom";
// import { ACSPLGUID, baseUrl, convertToISODate } from '../../json/custom';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axios from 'axios';
// import { all_routes } from "../../../Router/all_routes";
import { getUserData } from "../../Context/UserData";
import { all_routes } from "../../Router/all_routes";
import { ACSPLGUID, baseUrl, convertToISODate } from "../../core/json/custom";
const AddPickupQuotation = ({ SQAMAID }) => {
    const { userdetail } = getUserData();
    console.log(SQAMAID, "sqamaid")
    const route = all_routes;
    const MySwal = withReactContent(Swal);
    const navigate = useNavigate();
    const [states, setstates] = useState([]);
    const [customer, setcustomer] = useState([]);
    const [transporter, settransporter] = useState([]);
    // const [product, setproduct] = useState([]);
    // const [HSNDATA, setHSNDATA] = useState([]);

    const [srno, setsrno] = useState([]);
    // const [uom, setuom] = useState([]);
    // const [REQNNO, setREQNNO] = useState();
    const SQNORef = useRef(null);
    const SQDATERef = useRef(null);
    const SQCEMAILRef = useRef(null);
    const SQCADDRESSRef = useRef(null);
    const SQTRANSPORTTERMSRef = useRef(null);
    const STADDRESSRef = useRef(null);
    const SQTRANSPORTIDRef = useRef(null);
    // const SQTRANSPORTID = useRef(null);
    const SQTCONTACTRef = useRef(null);
    // const [Data, setData] = useState([]);
    const [Tdata, setTdata] = useState([]);
    const SQCCONTACTRef = useRef(null);
    const SQCAIDRef = useRef(null);
    const SPRNORef = useRef(null);
    // const SQPRODUCTRef = useRef(null);
    // const SQUOMRef = useRef(null);
    // const SQQUANTITYRef = useRef(null);
    // const SQRATERef = useRef(null);
    // const SQTAMTRef = useRef(null);
    // const SQCGSTRef = useRef(null);
    // const SQSGSTRef = useRef(null);
    // const SQIGSTRef = useRef(null);
    // const SREQNNOref = useRef(null);
    const srnoref = useRef(null);
    const [showForm, setShowForm] = useState(false);

    const [rows, setRows] = useState([]);

    const [formData, setFormData] = useState({
        SQNO: '',
        SQDATE: '',
        SPRNO: '',
        SQDUEDATE: '',
        SQCAID: '',
        SQCCONTACT: '',
        SQCEMAIL: '',
        SQCADDRESS: '',
        STADDRESS: '',
        CAID: '',
        SQTCONTACT: '',
        Net_Amount: '',
        SQTRANSPORTTERMS: '',
        SQPDUEDATE: '',
        SQNODAYS: '',
        SQPAYMENTTERMS: '',
        SQTRANSPORTID: '',
        SQMNAMT: '',
        SQGAMT: '',
        srno: '',
        CUSTOMERNAME: '',

    });

    const handleSubmit = (e, event) => {
        e.preventDefault();

        console.log('Form Data:', formData);
        showConfirmationAlert(event);

    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

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
                handleFormSubmission(event);
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
                // Reset formData
                setFormData({
                    SQNO: '',
                    SQDATE: new Date().toISOString().split("T")[0],
                    SPRNO: '',
                    SQDUEDATE: '',
                    SQCAID: '',
                    SQCCONTACT: '',
                    SQCEMAIL: '',
                    SQCADDRESS: '',
                    STADDRESS: '',
                    CAID: '',
                    SQTCONTACT: '',
                    Net_Amount: '',
                    SQTRANSPORTTERMS: '',
                    SQPDUEDATE: '',
                    SQNODAYS: '',
                    SQPAYMENTTERMS: '',
                    SQTRANSPORTID: '',
                    SQMNAMT: 0,
                    SQGAMT: 0,
                    srno: '',


                });

                setRows([]);

                const modal = document.getElementById("AddPickupQuotation");
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
            }
        });
    }


    const SQDUEDATERef = useRef(null);
    const SQTRANSPORTTERMRef = useRef(null);
    // const SQPAYMENTTERMSRef = useRef(null);

    // const location = useLocation();
    // const { SQAMAID } = location.state || {};
    // const { SQAMDAID } = location.state || {};
    const GUID = ACSPLGUID.getNew();
    // const GUAID = ACSPLGUID.getNew();

    const handleFormSubmission = async () => {
        try {
            const payload = {
                "sqamaid": SQAMAID ? SQAMAID : GUID,
                "sqcaid": formData.SQCAID,
                "caid": "",
                "sprno": formData.SPRNO,
                "sqmnamt": formData.SQMNAMT,
                "sqgamt": formData.SQGAMT,
                "sqno": formData.SQNO,
                "sqdate": formData.SQDATE,
                "sqduedate": formData.SQDUEDATE,
                "sqtransportterms": formData.SQTRANSPORTTERMS,

                "sqpaymentterms": "",
                "isapproved": true,
                "sqpduedate": "",
                "sqnodays": 0,
                "companyid": userdetail?.companyID || "",
                "deptid": userdetail?.departmentID || "",
                "srreff": "",
                "sqtransportid": formData.SQTRANSPORTID,
                "statusid": '2'

            };

            console.log("payload", payload)
            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            // First API call to save the quotation master
            axios({
                method: "POST",
                // url: "http://adsvr:78/api/AddQuatationMaster",
                url: baseUrl.Url + "/backend/api/SP_AddUpdSQuatationMaster ",
                data: JSON.stringify(payload),
                headers: headers,
            });

            Swal.fire({
                icon: "success",
                title: "Saved!",
                text: "Data saved successfully.",
                confirmButtonText: "OK",
            });

            // Prepare data for second API call
            const payload2 = rows.map((row) => ({
                "sqamdaid": row.SQAMDAID ? row.SQAMDAID : ACSPLGUID.getNew(),
                "sqamaid": SQAMAID ? SQAMAID : GUID,
                "sqproduct": row.SQPRODUCT,
                "sqquantity": row.SQQUANTITY.toString(),
                "squom": row.SQUOM,
                "sqrate": row.SQRATE,
                "sqtamt": row.SQTAMT,
                "sqigst": row.SQIGST,
                "sqsgst": row.SQSGST,
                "sqcgst": row.SQCGST,
                "sqcess": row.SQCESS,
                "hsncode": row.HSNCODE,
                "companyid": userdetail?.companyID || "",
                "deptid": userdetail?.departmentID || "",
            }));

            console.log("payload2", payload2);


            axios({
                method: "POST",
                // url: "http://adsvr:78/api/AddUpdQuatationDetails",
                url: baseUrl.Url + "/backend/api/SP_AddUpdSQuatationDetails",
                data: JSON.stringify(payload2),
                headers: headers,
            });

            Swal.fire({
                icon: "success",
                title: "Saved!",
                text: "Data saved successfully.",
                confirmButtonText: "OK",
            }).then((result) => {
                setFormData({
                    SQAMAID: "",
                    SQNO: "",
                    SQDATE: "",
                    SQDUEDATE: "",
                    CAID: "",
                    SQVCONTACT: "",
                    SQVEMAIL: "",
                    SQVADDRESS: "",
                    SPRNO: "",
                    SQTRANSPORTTERMS: "",
                    QPAYMENTTERM: "",
                    QPDUEDATE: "",
                    QNODAYS: "",
                    SQTRANSPORTID: "",
                });
                if (result.isConfirmed) {
                    // Navigate to SalesEnquiry after user clicks OK
                    window.location.href = route.PickupQuotationmaster;
                }
            });

        } catch (error) {
            console.error("Submission Error:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to save data. Please try again.",
            });
        }
    };



    const handleDropdownChange = (selectedOption, field) => {
        setFormData(prevData => ({
            ...prevData,
            [field]: selectedOption ? selectedOption.value : "",
        }));
    }




    useEffect(() => {

        // const fetchImplications = async () => {
        //     try {
        //         const response = await axios.get(
        //             baseUrl.Url + "/backend/api/Implications/SOLID|LIQUID|GAS",
        //             // "http://adsvr:78/api/Implications/SOLID|LIQUID|GAS"
        //         );

        //         if (response.status !== 200) throw new Error("Failed to fetch implications data");

        //         const data = response.data;

        //         // Combine all implications into one array
        //         const implicationsDropdown = data.map(({ iTitle, iValue }) => ({
        //             label: iTitle,
        //             value: iValue,
        //         }));

        //         setuom(implicationsDropdown);
        //     } catch (error) {
        //         console.error("Error fetching implications:", error);
        //     }
        // };
        // const fetchProductData = async () => {
        //     try {
        //         const payload = {
        //             "ctaid": "%",
        //             "companyid": userdetail?.companyID || "",
        //             "deptid": userdetail?.departmentID || "",
        //         }
        //         const headers = {
        //             "Content-Type": "application/json",
        //             Accept: "*/*",
        //         };

        //         axios({
        //             method: "POST",
        //             url: baseUrl.Url + "/backend/api/GET_CategoryProduct",
        //             data: JSON.stringify(payload),
        //             headers: headers,
        //         })
        //             .then((response) => {
        //                 if (response.status != 200) throw new Error("Failed to Fetching Data");
        //                 const DATA = response.data;
        //                 const formofproductData = DATA
        //                     .map(({ pname, paid }) => ({
        //                         label: pname,
        //                         value: paid,
        //                     }));
        //                 setproduct(formofproductData);
        //                 // setHSNDATA(response.data);
        //             })

        //     } catch (error) {
        //         console.error("Error fetching Access Right Data:", error);
        //     }

        // };

        const fetchCustomerData = async () => {
            try {
                const payload = {
                    "ctaid": "%",
                    "companyid": userdetail?.companyID || "",
                    "deptid": userdetail?.departmentID || "",
                    "ctype": '2'
                }
                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };

                axios({
                    method: "POST",
                    url: baseUrl.Url + "/backend/api/GET_CategoryCustomer",
                    data: JSON.stringify(payload),
                    headers: headers,
                })
                    .then((response) => {
                        if (response.status != 200) throw new Error("Failed to Fetching Data");
                        const DATA = response.data;
                        const formofcustomerData = DATA
                            .map(({ ccompanyname, caid }) => ({
                                label: ccompanyname,
                                value: caid,
                            }));
                        setcustomer(formofcustomerData);
                        // setData(DATA);
                    })

            } catch (error) {
                console.error("Error fetching Access Right Data:", error);
            }

        };

        const fetchTransportorData = async () => {
            try {
                const payload = {
                    "ctaid": "%",
                    "companyid": userdetail?.companyID || "",
                    "deptid": userdetail?.departmentID || "",
                    "ctype": '0'
                }
                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };

                axios({
                    method: "POST",
                    url: baseUrl.Url + "/backend/api/GET_CategoryCustomer",
                    data: JSON.stringify(payload),
                    headers: headers,
                })
                    .then((response) => {
                        if (response.status != 200) throw new Error("Failed to Fetching Data");
                        const DATA = response.data;
                        const formoftransporterData = DATA
                            .map(({ ccompanyname, caid }) => ({
                                label: ccompanyname,
                                value: caid,
                            }));
                        settransporter(formoftransporterData);
                        setTdata(DATA);
                    })

            } catch (error) {
                console.error("Error fetching Access Right Data:", error);
            }

        };


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


        fetchstates();
        fetchCustomerData();
        fetchTransportorData();
        // fetchProductData();
        // fetchImplications();

    }, []);

    useEffect(() => {
        if (!SQAMAID) return;
        setShowForm(true);
        try {
            const payload1 = {
                // sqamaid: SQAMAID,
                // "companyid": userdetail?.companyID || "",
                // "deptid": userdetail?.departmentID || "",
                "sqamaid": SQAMAID,
                "keyword": "%",
                "companyid": userdetail?.companyID || "",
                "deptid": userdetail?.departmentID || "",
                "statusid": '2'
            }
            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            axios({
                method: "POST",
                url: baseUrl.Url + "/backend/api/GET_SQuatationMaster",
                data: JSON.stringify(payload1),
                headers: headers,
            })
                .then((response) => {
                    if (response.status != 200) throw new Error("Failed to Fetching Data");
                    let apiData = response.data[0];
                    setFormData(prev => ({
                        ...prev,
                        SQAMAID: apiData.sqamaid,
                        SQCAID: customer.find((cust) => cust.value == apiData.sqcaid)?.value || "",
                        SPRNO: apiData.sprno,
                        SQMNAMT: apiData.sqmnamt,
                        SQGAMT: apiData.sqgamt,
                        SQNO: apiData.sqno,
                        SQDATE: convertToISODate(apiData.sqdate),
                        SQDUEDATE: convertToISODate(apiData.sqduedate),
                        SQTRANSPORTTERMS: apiData.sqtransportterms,
                        SQTRANSPORTID: transporter.find((trans) => trans.value == apiData.sqtransportid)?.value || "",
                        sqpaymentterms: "",
                        isapproved: true,
                        sqpduedate: "",
                        sqnodays: 0,
                        "companyid": userdetail?.companyID || "",
                        "deptid": userdetail?.departmentID || "",
                        srreff: "",
                    }));

                    console.log("quatation master data", apiData);

                    // const selectedProduct = Data.find(p => p.caid == apiData.sqcaid);
                    // if (selectedProduct) {
                    //     setFormData(prevData => ({
                    //         ...prevData,
                    //         SQCADDRESS: selectedProduct.sstatename,
                    //         SQCEMAIL: selectedProduct.cemail,
                    //         SQCCONTACT: selectedProduct.ccontactpersonmobile,
                    //     }));
                    // }

                    const selectedtransporter = Tdata.find(p => p.caid == apiData.sqtransportid);
                    if (selectedtransporter) {
                        setFormData(prevData => ({
                            ...prevData,
                            STADDRESS: selectedtransporter.sstatename,
                            SQTCONTACT: selectedtransporter.ccontactpersonmobile,
                        }));
                    }
                })

        } catch (error) {
            console.error("Error fetching Access Right Data:", error);
        }

        try {
            const payload = {
                sqamaid: SQAMAID,
                "companyid": userdetail?.companyID || "",
                "deptid": userdetail?.departmentID || "",
            }
            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            axios({
                method: "POST",
                url: baseUrl.Url + "/backend/api/GET_SQuotationDetailById",
                data: JSON.stringify(payload),
                headers: headers,
            })
                .then((response) => {
                    console.log(response.data);

                    if (response.status != 200) throw new Error("Failed to Fetching Details Data");
                    console.log(response.data);
                    if (response.data.length > 0) {
                        const mappedProducts = response.data.map((item) => ({
                            SQAMAID: item.sqamaid,
                            sqamdaid: item.sqamdaid || "",
                            SQPRODUCT: item.sqproduct,
                            SQUOM: item.squom,
                            PRODUCTNAME: item.productname,
                            UOMTITLE: item.uomtitle,
                            HSNCODE: item.hsncode,
                            SQQUANTITY: parseFloat(item.sqquantity) || 0,
                            SQRATE: parseFloat(item.sqrate) || 0,

                            SQTAXBALEAMOUNT: parseFloat(item.sqquantity) * parseFloat(item.sqrate), // Corrected calculation
                            SQCGST: parseFloat(item.sqcgst) || 0,
                            SQSGST: parseFloat(item.sqsgst) || 0,
                            SQIGST: parseFloat(item.sqigst) || 0,

                            SQTAMT: (parseFloat(item.sqquantity) * parseFloat(item.sqrate)) + parseFloat(item.sqcgst) + parseFloat(item.sqsgst) + parseFloat(item.sqigst), // Corrected calculation
                            IsDeleted: item.isdeleted,
                        }));


                        console.log("++++++++++1", response.data)
                        console.log("++++++++++2", mappedProducts)
                        // setFormData(mappedProducts);
                        setRows(mappedProducts)
                    }
                })

        } catch (error) {
            console.error("Error fetching Access Right Data:", error);
        }

    }, [SQAMAID]);

    const handleSearch = async (srno) => {
        if (srno) {
            setShowForm(true);
            try {
                const payload = {
                    srno: srno,
                    "companyid": userdetail?.companyID || "",
                    "deptid": userdetail?.departmentID || "",
                };
                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };
                const response = await axios.post(
                    `${baseUrl.Url}/backend/api/GET_SRequisitionNoSearch`,
                    payload,
                    { headers }
                );
                if (response.status !== 200)
                    throw new Error("Failed to fetch vendor data");
                console.log("Reqnodata", response.data)

                if (response.data.length > 0) {
                    const mappedProducts = response.data.map((item) => ({
                        PRODUCTNAME: item.productname,
                        UOMTITLE: item.uomtitle,
                        SQQUANTITY: item.srdquantity,
                        SQPRODUCT: item.srdproduct,
                        SQUOM: item.srduom,

                    }));
                    setRows(mappedProducts);
                    const totalTaxable = mappedProducts.reduce((acc, row) => acc + parseFloat(row.SQTAXBALEAMOUNT || 0), 0).toFixed(2);
                    const totalAmount = mappedProducts.reduce((acc, row) => acc + parseFloat(row.SQTAMT || 0), 0).toFixed(2);
                    setFormData(prevState => ({
                        ...prevState,
                        CUSTOMERNAME: response.data[0].vendorname,
                        SQCAID: response.data[0].srvandorid,
                        SQCCONTACT: response.data[0].contactnumber,
                        SQCEMAIL: response.data[0].email,
                        SQGAMT: totalTaxable,
                        SQMNAMT: totalAmount,
                        srno: response.data[0].srno,
                    }));
                }

            } catch (error) {
                console.error("Error fetching vendor data:", error);
            }
        } else {
            Swal.fire({
                icon: "error",
                title: "Validation Error",
                text: "Please fill the Requition Number ",
            }).then(() => {
                srnoref.current.focus();
            })
        }
    };

    // const handleDelete = (index) => {
    //     const newRows = [...rows];
    //     newRows.splice(index, 1);
    //     setRows(newRows);
    // };


    const handleInputChange = (e, index, field) => {
        const value = parseFloat(e.target.value) || 0;

        setRows((prevRows) => {
            const updatedRows = [...prevRows];
            const row = updatedRows[index];

            // Update the specific field in the row
            row[field] = value;

            // Recalculate taxable amount and total cost when quantity or rate changes
            if (field === "SQQUANTITY" || field === "SQRATE") {
                row.SQTAXBALEAMOUNT = (row.SQQUANTITY || 0) * (row.SQRATE || 0);
                row.SQTAMT = row.SQTAXBALEAMOUNT + (row.SQCGST || 0) + (row.SQSGST || 0) + (row.SQIGST || 0);
            }

            // Recalculate total amount when GST values change
            if (field === "SQCGST" || field === "SQSGST" || field === "SQIGST") {
                row.SQTAMT = (row.SQTAXBALEAMOUNT || 0) + (row.SQCGST || 0) + (row.SQSGST || 0) + (row.SQIGST || 0);
            }

            // Return the updated rows
            return updatedRows;
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
    }, [formData, rows, navigate]);


    useEffect(() => {
        if (rows && rows.length > 0) {
            setFormData({
                ...formData,
                SQGAMT: rows.reduce((acc, row) => acc + parseFloat(row.SQTAXBALEAMOUNT || 0), 0).toFixed(2),
                SQMNAMT: rows.reduce((acc, row) => acc + parseFloat(row.SQTAMT || 0), 0).toFixed(2),
            });
        }
    }, [rows]);


    // Save button validation
    const checkFormValidity = (e) => {
        const {
            SQNO,
        } = formData;

        // Check for each field and show validation errors
        if (!SQNO) {
            Swal.fire({
                icon: "error",
                title: "Validation Error",
                text: "कोटेशन क्रमांक आवश्यक आहे",
            }).then(() => {
                SQNORef.current.focus();
            });
            return;
        }

        // if (!SQDUEDATE || !isValidDate(SQDUEDATE)) {
        //     Swal.fire({
        //         icon: "error",
        //         title: "Validation Error",
        //         text: "कोटेशन वैधता तारीख आवश्यक आहे आणि ती वैध असावी.",
        //     }).then(() => {
        //         SQDUEDATERef.current.focus();
        //     });
        //     return;
        // }

        // if (!SCVNO) {
        //     Swal.fire({
        //         icon: "error",
        //         title: "Validation Error",
        //         text: "वाहन क्रमांक आवश्यक आहे",
        //     }).then(() => {
        //         SCVNORef.current.focus();
        //     });
        //     return;
        // }

        // if (!SCPOSUPPLY) {
        //     Swal.fire({
        //         icon: "error",
        //         title: "Validation Error",
        //         text: "पुरवठ्याचे ठिकाण आवश्यक आहे",
        //     }).then(() => {
        //         SCPOSUPPLYRef.current.focus();
        //     });
        //     return;
        // }

        // if (!SCSELLER) {
        //     Swal.fire({
        //         icon: "error",
        //         title: "Validation Error",
        //         text: "पुरवठादार आवश्यक आहे",
        //     }).then(() => {
        //         SCSELLERRef.current.focus();
        //     });
        //     return;
        // }

        // if (!SCCONSIGNER) {
        //     Swal.fire({
        //         icon: "error",
        //         title: "Validation Error",
        //         text: "कन्सायनर आवश्यक आहे",
        //     }).then(() => {
        //         SCCONSIGNERRef.current.focus();
        //     });
        //     return;
        // }

        // if (!SCNARRATION) {
        //     Swal.fire({
        //         icon: "error",
        //         title: "Validation Error",
        //         text: "टिप्पणी आवश्यक आहे",
        //     }).then(() => {
        //         SCNARRATIONRef.current.focus();
        //     });
        //     return;
        // }

        if (rows.length === 0) {
            Swal.fire({
                icon: "error",
                title: "Validation Error",
                text: "संचयित करण्यापूर्वी कृपया किमान एक उत्पादन जोडा.",
            });
            return;
        }
        handleSubmit(e);
    };



    const handleKeyDown = (e, nextInputRef) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Prevent default form submission on Enter
            if (nextInputRef && nextInputRef.current) {
                nextInputRef.current.focus(); // Move focus to the next input
            }
        }
    };
    // const OnCustomerChange = (selectedOption) => {
    //     const selectedProduct = Data.find(p => p.caid == selectedOption.value);
    //     console.log("Selected Product:", selectedProduct);
    //     if (selectedProduct) {
    //         setFormData(prevData => ({
    //             ...prevData,
    //             SQCADDRESS: selectedProduct.sstatename,
    //             SQCEMAIL: selectedProduct.cemail,
    //             SQCCONTACT: selectedProduct.ccontactpersonmobile,
    //         }));
    //     }

    // }

    const OnTranspoterChange = (selectedOption) => {
        const selectedProduct = Tdata.find(p => p.caid == selectedOption.value);
        console.log("Selected Product:", selectedProduct);
        if (selectedProduct) {
            setFormData(prevData => ({
                ...prevData,
                STADDRESS: selectedProduct.sstatename,
                SQTCONTACT: selectedProduct.ccontactpersonmobile,
            }));
        }

    }


    useEffect(() => {
        const resetModal = () => {
            setsrno("");
            setShowForm(false);
        };

        const modal = document.getElementById("AddPickupQuotation");
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
    }, []);
    return (
        <div>
            <div className="modal fade" id="AddPickupQuotation">
                <div className="modal-dialog modal-dialog-centered modal-fullscreen">
                    <div className="modal-content">
                        <div className="page-wrapper-new p-0">
                            <div className="content">
                                <div className="modal-header border-0 custom-modal-header">
                                    <div className="page-title">
                                        <h4>Sale Quotation</h4>
                                    </div>
                                    <div className="page-btn">
                                        <button
                                            className="btn btn-secondary"
                                            aria-label="Close"
                                            onClick={showExitAlert}
                                        >
                                            <ArrowLeft className="me-2" />
                                          	मागे
                                        </button>
                                    </div>
                                </div>
                                {!showForm && (
                                    <div className="row justify-content-center m-1">
                                        <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-4">
                                            <div className="search-input d-flex align-items-center">
                                                <input
                                                    type="number"
                                                    placeholder="Search Requisition No"
                                                    className="form-control w-100"
                                                    value={srno}
                                                    onChange={(e) => setsrno(e.target.value)}
                                                    pattern="^\d+$"
                                                    title="Must contain only numbers"
                                                    ref={srnoref}
                                                />
                                                <button
                                                    type="button"
                                                    className="btn btn-primary ms-3 mt-1 mt-sm-0"
                                                    onClick={() => handleSearch(srno)}
                                                >
                                                    Search
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="modal-body custom-modal-body">
                                    {showForm && (
                                        <form onSubmit={handleSubmit}>

                                            <div className="row mb-0 ">
                                                <div className="col-lg-1 col-md-2 col-12  ">
                                                    <div>
                                                        <label className="form-label ">कोटेशन क्रमांक</label>
                                                        <input
                                                            name="SQNO"
                                                            type="number"
                                                            className="form-control"
                                                            value={formData.SQNO}
                                                            onChange={handleChange}
                                                            onKeyDown={(e) => handleKeyDown(e, SPRNORef)}
                                                            ref={SQNORef}

                                                            autoFocus
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-lg-1 col-md-2 col-12">
                                                    <div>
                                                        <label className="form-label">रिक्विसिशन  क्रमांक </label>
                                                        <input
                                                            name="srno"
                                                            className="form-control"
                                                            value={srno}
                                                            onChange={(e) => setsrno(e.target.value)}
                                                            onKeyDown={(e) => handleKeyDown(e, SQDATERef)}

                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-lg-2 col-md-3 col-12">
                                                    <div>
                                                        <label className="form-label">कोटेशन दिनांक</label>
                                                        <input
                                                            type="date"
                                                            name="SQDATE"
                                                            className="form-control"
                                                            value={formData.SQDATE}
                                                            onChange={handleChange}
                                                            onKeyDown={(e) => handleKeyDown(e, SQDUEDATERef)}
                                                            ref={SQDATERef}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-lg-2 col-md-3 col-12">
                                                    <div>
                                                        <label className="form-label">कोटेशन वैधता तारीख</label>
                                                        <input
                                                            type="date"
                                                            name="SQDUEDATE"
                                                            className="form-control"
                                                            value={formData.SQDUEDATE}
                                                            ref={SQDUEDATERef}
                                                            onChange={handleChange}
                                                            onKeyDown={(e) => handleKeyDown(e, SQCAIDRef)}

                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-lg-2 col-md-3 col-12">
                                                    <div className="form-label">
                                                        <label>ग्राहकाचे नाव:</label>
                                                        <input
                                                            type="text"
                                                            name="CUSTOMERNAME"
                                                            className="form-control"
                                                            value={formData.CUSTOMERNAME}
                                                            ref={SQCAIDRef}
                                                            onChange={handleChange}
                                                            onKeyDown={(e) => handleKeyDown(e, SQCCONTACTRef)}

                                                        />
                                                    </div>
                                                </div>


                                                <div className="col-lg-2 col-md-3 col-12">
                                                    <div className="form-label">
                                                        <label>ग्राहकाचा संपर्क:</label>
                                                        <input
                                                            type="number"
                                                            name="SQCCONTACT"
                                                            className="form-control"
                                                            value={formData.SQCCONTACT}
                                                            onChange={handleChange}
                                                            onKeyDown={(e) => handleKeyDown(e, SQCEMAILRef)}
                                                            ref={SQCCONTACTRef}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-lg-2 col-md-3 col-12">
                                                    <div className="form-label">
                                                        <label>ग्राहकाचा इमेल:</label>
                                                        <input
                                                            type="email"
                                                            name="SQCEMAIL"
                                                            className="form-control"
                                                            value={formData.SQCEMAIL}
                                                            onChange={handleChange}
                                                            onKeyDown={(e) => handleKeyDown(e, SQCADDRESSRef)}
                                                            ref={SQCEMAILRef}
                                                        />
                                                    </div>
                                                </div>
                                            </div>


                                            <div className="row mb-0">
                                                <div className="col-lg-2 col-md-2 col-12">
                                                    <div className="form-label">
                                                        <label>राज्य:</label>
                                                        <Select
                                                            classNamePrefix="react-select"
                                                            options={states}
                                                            readOnly
                                                            value={states.find(option => option.value == formData.SQCADDRESS) || null}
                                                            onChange={(selectedOption) => handleDropdownChange(selectedOption, "SQCADDRESS")}
                                                            onKeyDown={(e) => handleKeyDown(e, SQTRANSPORTIDRef)}
                                                            ref={SQCADDRESSRef}
                                                            openMenuOnFocus={true}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-lg-2 col-md-2 col-12">
                                                    <div className="form-label">
                                                        <label>वाहतूकदाराचे नाव:</label>
                                                        {/* <Select
                                                        classNamePrefix="react-select"
                                                        options={transporter}

                                                        readOnly
                                                        value={transporter.find(option => option.value == formData.CAID) || null}
                                                        onChange={(selectedOption) => handleDropdownChange(selectedOption, "CAID")}
                                                        onKeyDown={(e) => handleKeyDown(e, SQTCONTACTRef)}
                                                        ref={SQTRANSPORTIDRef}
                                                    /> */}
                                                        <Select
                                                            classNamePrefix="react-select"
                                                            options={transporter}
                                                            placeholder="Choose"
                                                            value={transporter.find((option) => option.value === formData.SQTRANSPORTID) || null}
                                                            onChange={(selectedOption) => {
                                                                setFormData((prevData) => ({
                                                                    ...prevData,
                                                                    SQTRANSPORTID: selectedOption ? selectedOption.value : '',

                                                                }));
                                                                OnTranspoterChange(selectedOption);
                                                            }}
                                                            onKeyDown={(e) => handleKeyDown(e, SQTCONTACTRef)}
                                                            ref={SQTRANSPORTIDRef}
                                                            required
                                                            openMenuOnFocus={true}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-lg-2 col-md-2 col-12">
                                                    <div className="form-label">
                                                        <label>वाहतूकदाराचा संपर्क:</label>
                                                        <input
                                                            type="number"
                                                            name="SQTCONTACT"
                                                            className="form-control"
                                                            value={formData.SQTCONTACT}
                                                            onChange={handleChange}
                                                            onKeyDown={(e) => handleKeyDown(e, STADDRESSRef)}
                                                            ref={SQTCONTACTRef}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-lg-2 col-md-2 col-12">
                                                    <div className="form-label">
                                                        <label>वाहतूकदाराचे राज्य:</label>
                                                        <Select
                                                            classNamePrefix="react-select"
                                                            options={states}
                                                            readOnly
                                                            value={states.find(option => option.value == formData.STADDRESS) || null}
                                                            onChange={(selectedOption) => handleDropdownChange(selectedOption, "STADDRESS")}
                                                            onKeyDown={(e) => handleKeyDown(e, SQTRANSPORTTERMSRef)}
                                                            ref={STADDRESSRef}
                                                            openMenuOnFocus={true}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-lg-4 col-md-2 col-12">
                                                    <div className="form-label">
                                                        <label>वाहतूक अट:</label>
                                                        <input
                                                            rows="3"
                                                            className="form-control"
                                                            placeholder="Enter text"
                                                            name="SQTRANSPORTTERMS"
                                                            ref={SQTRANSPORTTERMRef}
                                                            value={formData.SQTRANSPORTTERMS}
                                                            onChange={handleChange}
                                                            required

                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-lg-12">
                                                <div className="border p-3 rounded shadow-sm mb-0">
                                                    <div className="modal-body-table">
                                                        <div className="table-responsive">
                                                            <table className="table table-bordered">
                                                                <thead className="thead-dark">
                                                                    <tr>
                                                                        <th className="col-4">उत्पादन</th>
                                                                        <th className="col-1">प्रमाण</th>
                                                                        <th className="col-1">मोजणी एकक (UOM)</th>
                                                                        <th className="col-1">दर</th>
                                                                        <th className="col-1">कर मूल्य</th>
                                                                        <th className="col-1">CGST</th>
                                                                        <th className="col-1">SGST</th>
                                                                        <th className="col-1">IGST</th>
                                                                        <th className="col-1">एकूण रक्कम</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {rows.map((row, index) => (
                                                                        <tr key={index}>
                                                                            <td className="col-4" style={{ padding: '5px 10px' }}>
                                                                                {row.PRODUCTNAME}
                                                                            </td>
                                                                            <td className="col-1" style={{ padding: '5px 10px' }}>
                                                                                {row.SQQUANTITY}
                                                                            </td>
                                                                            <td className="col-1" style={{ padding: '5px 10px' }}>
                                                                                {row.UOMTITLE}
                                                                            </td>
                                                                            <td className="col-1" style={{ padding: '5px 10px' }}>
                                                                                <input
                                                                                    type="number"
                                                                                    className="form-control form-control-sm border-0 border-bottom border-warning"
                                                                                    value={row.SQRATE}
                                                                                    onChange={(e) => handleInputChange(e, index, 'SQRATE')}
                                                                                />
                                                                            </td>
                                                                            <td className="col-1" style={{ padding: '5px 10px' }}>
                                                                                <input
                                                                                    type="number"
                                                                                    className="form-control form-control-sm border-0 border-bottom border-warning"
                                                                                    value={row.SQTAXBALEAMOUNT}
                                                                                    onChange={(e) => handleInputChange(e, index, 'SQTAXBALEAMOUNT')}
                                                                                />
                                                                            </td>
                                                                            <td className="col-1" style={{ padding: '5px 10px' }}>
                                                                                <input
                                                                                    type="number"
                                                                                    className="form-control form-control-sm border-0 border-bottom border-warning"
                                                                                    value={row.SQCGST}
                                                                                    onChange={(e) => handleInputChange(e, index, 'SQCGST')}
                                                                                />
                                                                            </td>
                                                                            <td className="col-1" style={{ padding: '5px 10px' }}>
                                                                                <input
                                                                                    type="number"
                                                                                    className="form-control form-control-sm border-0 border-bottom border-warning"
                                                                                    value={row.SQSGST}
                                                                                    onChange={(e) => handleInputChange(e, index, 'SQSGST')}
                                                                                />
                                                                            </td>
                                                                            <td className="col-1" style={{ padding: '5px 10px' }}>
                                                                                <input
                                                                                    type="number"
                                                                                    className="form-control form-control-sm border-0 border-bottom border-warning"
                                                                                    value={row.SQIGST}
                                                                                    onChange={(e) => handleInputChange(e, index, 'SQIGST')}
                                                                                />
                                                                            </td>
                                                                            <td className="col-1" style={{ padding: '5px 10px' }}>
                                                                                {row.SQTAMT}
                                                                            </td>
                                                                        </tr>
                                                                    ))}
                                                                    <tr>
                                                                        <td colSpan="3"></td>
                                                                        <td className="text-end">
                                                                            <strong>एकूण मुल्य</strong>
                                                                        </td>
                                                                        <td>
                                                                            <input
                                                                                type="text"
                                                                                className="form-control form-control-sm border-0 border-bottom border-warning text-end"
                                                                                value={formData.SQGAMT || '0'}
                                                                                readOnly
                                                                            />
                                                                        </td>

                                                                        <td colSpan="2"></td>
                                                                        <td className="text-end">
                                                                            <strong>एकूण:</strong>
                                                                        </td>
                                                                        <div className="d-flex justify-content-end">
                                                                            <input
                                                                                name="total"
                                                                                value={formData.SQMNAMT || '0'}
                                                                                className="border-0 border-bottom border-warning w-100 text-end"
                                                                                readOnly
                                                                            />
                                                                        </div>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>


                                            <div className="btn-addproduct mb-0 mt-3">
                                                <button type="button" className="btn btn-cancel me-2" onClick={showExitAlert}>
                                           		    रद्द करा
                                                </button>
                                                <button type="submit" className="btn btn-submit">
                                                	  जतन करा
                                                </button>
                                            </div>
                                        </form>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddPickupQuotation;

