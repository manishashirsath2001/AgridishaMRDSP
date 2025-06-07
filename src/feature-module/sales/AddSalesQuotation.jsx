import React, { useState, useEffect, useRef } from "react";
import {
    ArrowLeft,
    Trash2,
    Edit
} from "feather-icons-react/build/IconComponents";
import { Link } from "react-router-dom";
// import TextEditor from "../../../feature-module/inventory/texteditor";
// import ImageWithBasePath from "../../img/imagewithbasebath";
import Select from "react-select";
// import { DatePicker } from "antd";
// import { Calendar } from "feather-icons-react/build/IconComponents";
import { useNavigate } from "react-router-dom";
// import { ACSPLGUID, baseUrl, convertToISODate } from '../../json/custom';
import { baseUrl, ACSPLGUID, convertToISODate } from "../../core/json/custom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axios from 'axios';
// import { all_routes } from "../../../Router/all_routes";
import { getUserData } from "../../Context/UserData";
import { all_routes } from "../../Router/all_routes";
const AddSaleQuotation = ({ SQAMAID }) => {
    const { userdetail } = getUserData();
    console.log(SQAMAID, "sqamaid")
    const route = all_routes;
    const MySwal = withReactContent(Swal);
    const navigate = useNavigate();
    const [states, setstates] = useState([]);
    const [customer, setcustomer] = useState([]);
    const [transporter, settransporter] = useState([]);
    const [product, setproduct] = useState([]);
    const [HSNDATA, setHSNDATA] = useState([]);

    // const [SPRNO, setSPRNO] = useState([]);
    const [uom, setuom] = useState([]);
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
    const [Data, setData] = useState([]);
    const [Tdata, setTdata] = useState([]);
    const SQCCONTACTRef = useRef(null);
    const SQCAIDRef = useRef(null);
    const SPRNORef = useRef(null);
    const SQPRODUCTRef = useRef(null);
    const SQUOMRef = useRef(null);
    const SQQUANTITYRef = useRef(null);
    const SQRATERef = useRef(null);
    const SQTAMTRef = useRef(null);
    const SQCGSTRef = useRef(null);
    const SQSGSTRef = useRef(null);
    const SQIGSTRef = useRef(null);
    // const [showForm, setShowForm] = useState(false);

    const [rows, setRows] = useState([]);

    const [productData, setProductData] = useState({
        sqamdaid: '',
        SQPRODUCT: '',
        SQUOM: '',
        SQQUANTITY: '',
        SQRATE: 0,
        SQTAMT: 0,
        SQCGST: 0,
        SQSGST: 0,
        SQIGST: 0,
        SQMNAMT: 0,
        HSNCODE: 0,
        IsDeleted: 0,
        SQTAXBALEAMOUNT: 0
    });

    const [formData, setFormData] = useState({
        SQAMAID: '',
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

                const modal = document.getElementById("AddSaleQuotation");
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
                "sqamdaid": row.sqamdaid ? row.sqamdaid : ACSPLGUID.getNew(),
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
                "sqtaxbaleamount": row.SQTAXBALEAMOUNT,
                "companyid": userdetail?.companyID || "",
                "deptid": userdetail?.departmentID || "",
                "isDeleted": row.IsDeleted === 1 || row.IsDeleted === true ? true : false,
                "statusid": '1'

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
                    window.location.href = route.QuotationMaster;
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

    const handleDetailDropdownChange = (selectedOption, field) => {
        setProductData(prevData => ({
            ...prevData,
            [field]: selectedOption ? selectedOption.value : "",
        }));
        // if (field == 'product') {
        //     const selectedProduct = hsnData(response.data).find(p => p.paid === selectedOption.value);
        //     if (selectedProduct) {
        //         setProductData(prevData => ({
        //             ...prevData,
        //             HSNCODE: selectedProduct.hsncode,
        //         }));

        //     }

        // }


    };

    const onproductchange = (selectedOption) => {
        const selectedProduct = HSNDATA.find(p => p.paid === selectedOption.value);
        if (selectedProduct) {
            setProductData(prevData => ({
                ...prevData,
                HSNCODE: selectedProduct.hsncode,
            }));

            try {
                const payload = {
                    "psale": selectedProduct.psales,

                }
                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };

                axios({
                    method: "POST",
                    url: baseUrl.Url + "/backend/api/GET_UOMImplication",
                    data: JSON.stringify(payload),
                    headers: headers,
                })
                    .then((response) => {
                        if (response.status != 200) throw new Error("Failed to Fetching Data");
                        const data = response.data;
                        const implicationsDropdown = data.map(({ iTitle, iValue }) => ({
                            label: iTitle,
                            value: iValue,
                        }));

                        setuom(implicationsDropdown);
                    })

            } catch (error) {
                console.error("Error fetching Access Right Data:", error);
            }
        }

    }

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
        const fetchProductData = async () => {
            try {
                const payload = {
                    "ctaid": "%",
                    "companyid": userdetail?.companyID || "",
                    "deptid": userdetail?.departmentID || "",
                }
                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };

                axios({
                    method: "POST",
                    url: baseUrl.Url + "/backend/api/GET_CategoryProduct",
                    data: JSON.stringify(payload),
                    headers: headers,
                })
                    .then((response) => {
                        if (response.status != 200) throw new Error("Failed to Fetching Data");
                        const DATA = response.data;
                        const formofproductData = DATA
                            .map(({ pname, paid }) => ({
                                label: pname,
                                value: paid,
                            }));
                        setproduct(formofproductData);
                        setHSNDATA(response.data);
                    })

            } catch (error) {
                console.error("Error fetching Access Right Data:", error);
            }

        };

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
                        setData(DATA);
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
        fetchProductData();
        // fetchImplications();

    }, []);




    useEffect(() => {
        if (!SQAMAID) return;
        try {
            const payload1 = {
                "sqamaid": SQAMAID,
                "keyword": "%",
                "statusid": '1',
                "companyid": userdetail?.companyID || "",
                "deptid": userdetail?.departmentID || "",
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
                        companyid: userdetail?.companyID || "",
                        deptid: userdetail?.departmentID || "",
                        srreff: "",


                    }));


                    console.log("quatation master data", apiData)
                    const selectedProduct = Data.find(p => p.caid == apiData.sqcaid);

                    if (selectedProduct) {
                        setFormData(prevData => ({
                            ...prevData,
                            SQCADDRESS: selectedProduct.sstatename,
                            SQCEMAIL: selectedProduct.cemail,
                            SQCCONTACT: selectedProduct.ccontactpersonmobile,
                        }));
                    }
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
                companyid: userdetail?.companyID || "",
                deptid: userdetail?.departmentID || "",
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

    const handleAddProduct = () => {
        if (!productData.SQPRODUCT || !productData.SQUOM || !productData.SQQUANTITY) {
            MySwal.fire({
                title: "Error!",
                text: "Please fill in all the product fields before adding.",
                icon: "error",
            });
            return;
        }

        const newProduct = {
            ...productData,
            PRODUCTNAME: product.find((item) => item.value === productData.SQPRODUCT)?.label || "",
            UOMTITLE: uom.find((item) => item.value === productData.SQUOM)?.label || "",
            SQTAXBALEAMOUNT: productData.SQQUANTITY * productData.SQRATE,
            SQTAMT: (productData.SQQUANTITY * productData.SQRATE) + productData.SQCGST + productData.SQSGST + productData.SQIGST,
        };

        setRows((prevRows) => {
            const existingIndex = prevRows.findIndex((row) => row.sqamdaid === productData.sqamdaid);

            if (existingIndex !== -1) {
                const updatedRows = [...prevRows];
                updatedRows[existingIndex] = newProduct;
                return updatedRows;
            } else {
                // Add new row
                return [...prevRows, { ...newProduct, sqamdaid: ACSPLGUID.getNew() }];
            }
        });

        setProductData({
            SQPRODUCT: '',
            HSNCODE: 0,
            SQUOM: '',
            SQQUANTITY: '',
            SQRATE: 0,
            SQTAMT: 0,
            SQCGST: 0,
            SQSGST: 0,
            SQIGST: 0,
            SQTAXBALEAMOUNT: 0,
            IsDeleted: 0,
        });
    };

    const handleProductChange = (e) => {
        const { name, value } = e.target;

        setProductData((prevData) => {
            const updatedData = { ...prevData, [name]: parseFloat(value) || 0 };


            if (name === "SQQUANTITY" || name === "SQRATE") {
                updatedData.SQTAXBALEAMOUNT = (updatedData.SQQUANTITY || 0) * (updatedData.SQRATE || 0);
                updatedData.SQTAMT = updatedData.SQTAXBALEAMOUNT + (prevData.SQCGST || 0) + (prevData.SQSGST || 0) + (prevData.SQIGST || 0);
            }

            // Recalculate SCDTAMT when GST values change
            if (name === "SQCGST" || name === "SQSGST" || name === "SQIGST") {
                updatedData.SQTAMT = (prevData.SQTAXBALEAMOUNT || 0) + (updatedData.SQCGST || 0) + (updatedData.SQSGST || 0) + (updatedData.SQIGST || 0);
            }


            return updatedData;
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
            SQTRANSPORTTERMS,
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
        //         text: "Quotation validity Date is required and must be a valid date.",
        //     }).then(() => {
        //         SQDUEDATERef.current.focus();
        //     });
        //     return;
        // }

        // if (!SCVNO) {
        //     Swal.fire({
        //         icon: "error",
        //         title: "Validation Error",
        //         text: "Vehicle No is required",
        //     }).then(() => {
        //         SCVNORef.current.focus();
        //     });
        //     return;
        // }

        // if (!SCPOSUPPLY) {
        //     Swal.fire({
        //         icon: "error",
        //         title: "Validation Error",
        //         text: "Place of Supply is required",
        //     }).then(() => {
        //         SCPOSUPPLYRef.current.focus();
        //     });
        //     return;
        // }

        // if (!SCSELLER) {
        //     Swal.fire({
        //         icon: "error",
        //         title: "Validation Error",
        //         text: "Supplier is required",
        //     }).then(() => {
        //         SCSELLERRef.current.focus();
        //     });
        //     return;
        // }

        // if (!SCCONSIGNER) {
        //     Swal.fire({
        //         icon: "error",
        //         title: "Validation Error",
        //         text: "Consigner is required",
        //     }).then(() => {
        //         SCCONSIGNERRef.current.focus();
        //     });
        //     return;
        // }

        if (!SQTRANSPORTTERMS) {
            Swal.fire({
                icon: "error",
                title: "Validation Error",
                text: "वाहनतत्राची अट आवश्यक आहे",
            }).then(() => {
                SQTRANSPORTTERMSRef.current.focus();
            });
            return;
        }

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



    const handleEdit = (sqamdaid) => {
        console.log("editttttt");
        const filteredProducts = rows.filter((row) => row.sqamdaid === sqamdaid);
        setProductData({
            sqamdaid: filteredProducts[0].sqamdaid,
            SQPRODUCT: product.filter((data) => data.value == filteredProducts[0].SQPRODUCT)[0].value,
            SQUOM: uom.filter((data) => data.value == filteredProducts[0].SQUOM)[0].value,
            PRODUCTNAME: filteredProducts[0].PRODUCTNAME,
            UOMTITLE: filteredProducts[0].UOMTITLE,
            HSNCODE: filteredProducts[0].HSNCODE,
            SQQUANTITY: filteredProducts[0].SQQUANTITY,
            SQRATE: filteredProducts[0].SQRATE,
            SQTAXBALEAMOUNT: filteredProducts[0].SQTAXBALEAMOUNT,
            SQCGST: filteredProducts[0].SQCGST,
            SQSGST: filteredProducts[0].SQSGST,
            SQIGST: filteredProducts[0].SQIGST,
            SQTAMT: filteredProducts[0].SQTAMT,
            IsDeleted: filteredProducts[0].IsDeleted
        });
    };

    const handleDelete = (sqamdaid) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel",
        }).then((result) => {
            if (result.isConfirmed) {
                setRows((prevData) =>
                    prevData.map((row) =>
                        row.sqamdaid === sqamdaid ? { ...row, IsDeleted: 1 } : row
                    )
                );
                Swal.fire(
                    'Deleted!',
                    'Your item has been deleted.',
                    'success'
                );
            }
        }).catch((error) => {
            console.error("Error during deletion:", error);
            Swal.fire(
                'Error!',
                'There was an error deleting the item.',
                'error'
            );
        });
    };

    const handleKeyDown = (e, nextInputRef) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (nextInputRef && nextInputRef.current) {
                nextInputRef.current.focus();
            }
        }
    };



    const OnCustomerChange = (selectedOption) => {
        const selectedProduct = Data.find(p => p.caid == selectedOption.value);
        console.log("Selected Product:", selectedProduct);
        if (selectedProduct) {
            setFormData(prevData => ({
                ...prevData,
                SQCADDRESS: selectedProduct.sstatename,
                SQCEMAIL: selectedProduct.cemail,
                SQCCONTACT: selectedProduct.ccontactpersonmobile,
            }));
        }

    }

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




    return (
        <div>
            <div className="modal fade" id="AddSaleQuotation">
                <div className="modal-dialog modal-dialog-centered modal-fullscreen">
                    <div className="modal-content">
                        <div className="page-wrapper-new p-0">
                            <div className="content">
                                <div className="modal-header border-0 custom-modal-header">
                                    <div className="page-title">
                                        <h4>विक्री कोटेशन</h4>
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


                                <div className="modal-body custom-modal-body">

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
                                                    <label className="form-label">रिक्विसिशन क्रमांक</label>
                                                    <input
                                                        name="SPRNO"
                                                        className="form-control"
                                                        value={formData.SPRNO}
                                                        onChange={handleChange}
                                                        onKeyDown={(e) => handleKeyDown(e, SQDATERef)}
                                                        ref={SPRNORef}
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-lg-2 col-md-3 col-12">
                                                <div>
                                                    <label className="form-label">कोटेशन तारीख</label>
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
                                                    <label>ग्राहकाचे नाव</label>
                                                    <Select
                                                        classNamePrefix="react-select"
                                                        options={customer}
                                                        placeholder="Choose Customer"
                                                        value={customer.find((option) => option.value === formData.SQCAID) || null}
                                                        onChange={(selectedOption) => {
                                                            setFormData((prevData) => ({
                                                                ...prevData,
                                                                SQCAID: selectedOption ? selectedOption.value : '',
                                                            }));
                                                            OnCustomerChange(selectedOption);
                                                        }}
                                                        ref={SQCAIDRef}
                                                        onKeyDown={(e) => handleKeyDown(e, SQCCONTACTRef)}
                                                        openMenuOnFocus={true}
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-lg-2 col-md-3 col-12">
                                                <div className="form-label">
                                                    <label>ग्राहकाचा संपर्क</label>
                                                    <input
                                                        type="number"
                                                        name="SQCCONTACT"
                                                        className="form-control"
                                                        value={formData.SQCCONTACT}
                                                        readOnly
                                                        onChange={handleChange}
                                                        onKeyDown={(e) => handleKeyDown(e, SQCEMAILRef)}
                                                        ref={SQCCONTACTRef}
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-lg-2 col-md-3 col-12">
                                                <div className="form-label">
                                                    <label>ग्राहकाचा ईमेल</label>
                                                    <input
                                                        type="email"
                                                        name="SQCEMAIL"
                                                        className="form-control"
                                                        value={formData.SQCEMAIL}
                                                        readOnly
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
                                                    <label>राज्य</label>
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
                                                    <label>वाहकाचे नाव</label>

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
                                                    <label>वाहकाचा संपर्क</label>
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
                                                    <label>वाहकाचे राज्य</label>
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
                                                    <label>वाहतूक अटी</label>
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

                                        <div className="border p-3 rounded shadow-sm mb-0">
                                            <div className="row mt-0  aliceblue-background">
                                                <div className="row">
                                                    <div className="col-lg-4 col-sm-6 col-12">
                                                        <div className="mb-0 add-product form-label">
                                                            <label>उत्पादन / सेवा</label>
                                                            <Select
                                                                ref={SQPRODUCTRef}
                                                                classNamePrefix="react-select"
                                                                options={product}
                                                                value={product.find(option => option.value === productData.SQPRODUCT) || null}
                                                                onChange={(selectedOption) => {
                                                                    setProductData((prevData) => ({
                                                                        ...prevData,
                                                                        SQPRODUCT: selectedOption ? selectedOption.value : '',
                                                                    })); onproductchange(selectedOption);

                                                                }}
                                                                openMenuOnFocus={true}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-2 col-md-6 col-sm-12">
                                                        <div className="mb-0 add-product form-label">
                                                            <label>HSN कोड</label>
                                                            <input
                                                                type="number"
                                                                className="form-control no-arrows"
                                                                name="HSNCODE"
                                                                value={productData.HSNCODE || ""}
                                                                readOnly
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-lg-2 col-sm-6 col-12">
                                                        <div className="mb-0 add-product form-label">
                                                            <label>UOM</label>
                                                            <Select
                                                                ref={SQUOMRef}
                                                                classNamePrefix="react-select"
                                                                name="SQUOM"
                                                                options={uom}
                                                                value={uom.find(option => option.value === productData.SQUOM) || null}
                                                                onChange={(selectedOption) => handleDetailDropdownChange(selectedOption, "SQUOM")}
                                                                placeholder="Select Option"
                                                                openMenuOnFocus={true}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-lg-1 col-md-6 col-sm-12">
                                                        <div className="mb-0 add-product form-label">
                                                            <label>प्रमाण</label>
                                                            <input
                                                                ref={SQQUANTITYRef}

                                                                className="form-control no-arrows"
                                                                name="SQQUANTITY"
                                                                value={productData.SQQUANTITY}
                                                                onChange={handleProductChange}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-lg-1 col-md-6 col-sm-12">
                                                        <div className="mb-0  add-product form-label">
                                                            <label>दर</label>
                                                            <input
                                                                ref={SQRATERef}
                                                                // type="number"
                                                                className="form-control no-arrows"
                                                                name="SQRATE"
                                                                value={productData.SQRATE}
                                                                onChange={handleProductChange}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-lg-2 col-md-6 col-sm-12">
                                                        <div className="mb-0  add-product form-label">
                                                            <label>रक्कम</label>
                                                            <input
                                                                ref={SQTAMTRef}
                                                                // type="number"
                                                                className="form-control no-arrows"
                                                                name="SQTAXBALEAMOUNT"
                                                                value={productData.SQTAXBALEAMOUNT}
                                                                readOnly />
                                                        </div>
                                                    </div>

                                                </div>

                                                <div className="col-lg-2 col-md-6 col-sm-12">
                                                    <div className="mb-0 add-product form-label">
                                                        <label>CGST</label>
                                                        <input
                                                            ref={SQCGSTRef}
                                                            type="number"
                                                            className="form-control no-arrows"
                                                            name="SQCGST"
                                                            value={productData.SQCGST}
                                                            onChange={handleProductChange}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-lg-2 col-md-6 col-sm-12">
                                                    <div className="mb-0  add-product form-label">
                                                        <label>SGST</label>
                                                        <input
                                                            ref={SQSGSTRef}
                                                            type="number"
                                                            className="form-control no-arrows"
                                                            name="SQSGST"
                                                            value={productData.SQSGST}
                                                            onChange={handleProductChange}
                                                        />

                                                    </div>
                                                </div>

                                                <div className="col-lg-2 col-md-6 col-sm-12">
                                                    <div className="mb-0  add-product form-label">
                                                        <label>IGST</label>
                                                        <input
                                                            ref={SQIGSTRef}
                                                            type="number"
                                                            className="form-control no-arrows"
                                                            name="SQIGST"
                                                            value={productData.SQIGST}
                                                            onChange={handleProductChange}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-lg-2 col-md-6 col-sm-12">
                                                    <div className="mb-0 add-product form-label">
                                                        <label>एकूण</label>
                                                        <input
                                                            type="number"
                                                            className="form-control no-arrows"
                                                            name="SQTAMT"
                                                            value={productData.SQTAMT}
                                                            readOnly
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-lg-1 col-md-6 col-sm-12 mt-3 ">
                                                    <div className="me-2">
                                                        <button
                                                            type="button"
                                                            className="btn btn-primary custom-btn"
                                                            onClick={handleAddProduct}
                                                        >
                                                            Add
                                                        </button>
                                                    </div>
                                                </div>

                                            </div>

                                            <div className="row">
                                                <div className="col-lg-12">
                                                    <div className="modal-body-table">
                                                        <div
                                                            className="table-responsive"
                                                            // ref={scrollableRef}
                                                            style={{
                                                                height: "calc(62vh - 120px)",
                                                                overflowY: "auto",
                                                                overflowX: "auto",
                                                            }}
                                                        >
                                                            <table className="table table-bordered">
                                                                <thead className="thead-dark">
                                                                    <tr>
                                                                        <th className="col-3" style={{ position: 'sticky', top: 0 }}>उत्पादन</th>
                                                                        <th className="col-1" style={{ position: 'sticky', top: 0 }}>एचएसएन</th>
                                                                        <th className="col-1" style={{ position: 'sticky', top: 0 }}>मोजणी एकक (UOM)</th>
                                                                        <th className="col-1" style={{ position: 'sticky', top: 0 }}>प्रमाण</th>
                                                                        <th className="col-1" style={{ position: 'sticky', top: 0 }}>दर</th>
                                                                        <th className="col-1" style={{ position: 'sticky', top: 0 }}>कर मूल्य</th>
                                                                        <th className="col-1" style={{ position: 'sticky', top: 0 }}>CGST</th>
                                                                        <th className="col-1" style={{ position: 'sticky', top: 0 }}>SGST</th>
                                                                        <th className="col-1" style={{ position: 'sticky', top: 0 }}>IGST</th>
                                                                        <th className="col-1" style={{ position: 'sticky', top: 0 }}>एकूण</th>
                                                                        <th className="col-1" style={{ position: 'sticky', top: 0 }}>कृती</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {rows.filter((row) => row.IsDeleted == 0).length > 0 ? (
                                                                        rows
                                                                            .filter((row) => row.IsDeleted == 0)
                                                                            .map((row, index) => (
                                                                                <tr key={row.SQAMAID || index}>
                                                                                    <td>{row.PRODUCTNAME}</td>
                                                                                    <td>{row.HSNCODE}</td>
                                                                                    <td>{row.UOMTITLE}</td>
                                                                                    <td>{row.SQQUANTITY}</td>
                                                                                    <td>{row.SQRATE}</td>
                                                                                    <td>{row.SQTAXBALEAMOUNT}</td>
                                                                                    <td>{row.SQCGST}</td>
                                                                                    <td>{row.SQSGST}</td>
                                                                                    <td>{row.SQIGST}</td>
                                                                                    <td>{row.SQTAMT}</td>
                                                                                    <td>
                                                                                        <Link
                                                                                            className="confirm-text p-2 me-2"
                                                                                            to="#"
                                                                                            onClick={() => handleDelete(row.sqamdaid)}
                                                                                        >
                                                                                            <Trash2 className="feather-trash-2" />
                                                                                        </Link>

                                                                                        <Link
                                                                                            to="#"
                                                                                            onClick={() => handleEdit(row.sqamdaid)} // corrected here
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
                                                                            <td colSpan="12">No data available</td>
                                                                        </tr>
                                                                    )}


                                                                </tbody>
                                                                <tfoot>
                                                                    <tr>
                                                                        <td colSpan="4"></td>
                                                                        <td><strong>Total:</strong></td>
                                                                        <td>
                                                                            <span className="form-control form-control-sm border-0 border-bottom border-warning">
                                                                                {formData.SQGAMT}
                                                                            </span>
                                                                        </td>
                                                                        <td colSpan="2"></td>
                                                                        <td></td>
                                                                        <td>
                                                                            <span className="form-control form-control-sm border-0 border-bottom border-warning">
                                                                                {formData.SQMNAMT}
                                                                            </span>
                                                                        </td>
                                                                        <td></td>
                                                                    </tr>
                                                                </tfoot>
                                                            </table>
                                                        </div>
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
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddSaleQuotation;

