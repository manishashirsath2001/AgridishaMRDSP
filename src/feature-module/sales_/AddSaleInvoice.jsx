import React, { useState, useEffect, useRef } from "react";

import Select from "react-select";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Link, useNavigate } from "react-router-dom";
import { all_routes } from "../../Router/all_routes";
// import { Calendar } from "feather-icons-react/build/IconComponents";
import axios from "axios";
// import { ACSPLGUID, baseUrl, convertToISODate } from "../../core/json/custom";
import { ACSPLGUID, baseUrl, convertToISODate } from "../../core/json/custom";
import { getUserData } from "../../Context/UserData";
import {
    ArrowLeft
} from "feather-icons-react/build/IconComponents";

const AddSaleInvoice = ({ SBAID, scaid }) => {
    const { userdetail } = getUserData();
    console.log(scaid, "scaid")
    console.log(SBAID, "SBAID")
    const route = all_routes;
    const navigate = useNavigate();
    //const SBNARRATIONRef=useRef(null);
    const VBILLNORef = useRef(null);
    const SBTERMANDCONDITIONRef = useRef(null);
    const SBDUEDATERef = useRef(null);
    const GUID = ACSPLGUID.getNew();
    const [states, setstates] = useState([]);
    // const location = useLocation();
    //const { SBAID,SBDAID} = location.state || {};
    const [paymentmode, setpaymentmode] = useState([]);//payment dropdown
    const [SBCHALLANNO, setSBCHALLANNO] = useState('');
    const [transpoter, settranspoter] = useState([]);
    const [customer, setcustomer] = useState([]);

    // const [product, setproduct] = useState([]);
    // const [HSNDATA, setHSNDATA] = useState([]);
    // const [products, setProducts] = useState();
    // const [uom, setuom] = useState([]);
    const [Data, setData] = useState([]);

    const [formData, setFormData] = useState({
        SBAID: "",
        SBVENDORID: "",
        SBCONSIGNER: "",
        SBVEHICALNO: "",
        SBPOSUPPLY: "",
        SBBILLNO: "",
        SBDATE: "",
        SBBILLDATE: new Date().toISOString().split("T")[0],
        SBDUEDATE: "",
        SBNARRATION: "",
        SBTRANSPORT: "",
        SBTERMANDCONDITION: "",
        SBCHALLANNO: "",
        SBDISCOUNT: 0,
        SBNETAMOUNT: 0,
        VBILLNO: "",
        QNODAYS: 0,
        QPAYMENTTERMS: "",
        QPDUEDATE: "",
        CUSTOMERSTATE: "",
        CUSTOMEREMAIL: "",
        CUSTOMERCONTACT: "",
        SBVENDORIDid: "",
        SBCONSIGNERid: "",
        PAYMENTMODE: "",
        SBILLTOTAL: 0,
        SBGROSSAMT: 0,




    });
    const [rows, setRows] = useState([]);
    // const [productData, setProductData] = useState({
    //     sbdaid: '',
    //     SBPRODUCT: '',
    //     SBDUOM: '',
    //     SBDQUANTITY: '',
    //     SBDRATE: 0,
    //     SBDTAMT: 0,
    //     SBDIGST: 0,
    //     SBDSGST: 0,
    //     SBDCGST: 0,
    //     HSNCODE: 0,
    //     BATCHNO: '',
    //     EXPIRYDATE: '',
    //     SBDTOTAL: 0,
    //     IsDeleted: 0,
    // });

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
                console.log(" sale :", response.data)
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

        const fetchtranspoter = async () => {
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
                        const formoftranspoterData = DATA
                            .map(({ ccompanyname, caid }) => ({
                                label: ccompanyname,
                                value: caid,
                            }));
                        settranspoter(formoftranspoterData);
                    })

            } catch (error) {
                console.error("Error fetching vendor data:", error);
            }
        };


        const fetchcustomer = async () => {
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
                console.error("Error fetching vendor data:", error);
            }
        };
        // const fetchProductData = async () => {
        //     try {
        //         const payload = {
        //             "ctaid": "%",
        //             "companyid": "COMP123456789",
        //             "deptid": "D001"
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
        //                 setHSNDATA(response.data);

        //             })

        //     } catch (error) {
        //         console.error("Error fetching Access Right Data:", error);
        //     }

        // };

        // const fetchImplications = async () => {
        //     try {
        //         const response = await axios.get(
        //             baseUrl.Url + "/backend/api/Implications/SOLID|LIQUID|GAS|",
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


        const fetchpaymentmodes = async () => {
            try {
                const response = await axios.get(
                    baseUrl.Url + "/backend/api/Implications/PAYMENT",

                );

                if (response.status !== 200) throw new Error("Failed to fetch implications data");

                const data = response.data;
                const implicationsDropdown = data.map(({ iTitle, iValue }) => ({
                    label: iTitle,
                    value: iValue,
                }));

                setpaymentmode(implicationsDropdown);
            } catch (error) {
                console.error("Error fetching implications:", error);
            }
        };

        fetchpaymentmodes();
        // fetchImplications();
        // fetchProductData();
        fetchstates();
        fetchtranspoter();
        fetchcustomer();

    }, []);


    const handleFormSubmission = async () => {
        try {
            const payload = {
                "sbaid": SBAID ? SBAID : GUID,
                "sbvendorid": formData.SBVENDORIDid,
                "sbconsigner": formData.SBCONSIGNERid,
                "sbvehicalno": formData.SBVEHICALNO,
                "sbposupply": formData.SBPOSUPPLY,
                "sbbillno": formData.SBBILLNO,
                "sbdate": "",
                "sbbilldate": formData.SBBILLDATE,
                "sbduedate": formData.SBDUEDATE,
                "sbnarration": "",
                "sbtransport": formData.SBTRANSPORT,
                "sbtermandcondition": formData.SBTERMANDCONDITION,
                "sbchallanno": formData.SBCHALLANNO,
                "sbdiscount": formData.SBDISCOUNT,
                "sbnetamount": formData.SBNETAMOUNT,
                "vbillno": formData.VBILLNO,
                "qnodays": 0,
                "qpaymentterms": "",
                "qpduedate": "",
                "companyid": userdetail?.companyID || "",
                "deptid": userdetail?.departmentID || "",
                "screff": "",
                "paymentmode": formData.PAYMENTMODE,
                "sbgrossamt": formData.SBGROSSAMT,
                "sbilltotal": formData.SBILLTOTAL,

            }
            console.log(payload);
            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            axios({
                method: "POST",
                url: baseUrl.Url + "/backend/api/SP_AddUpdSBillMaster",
                data: JSON.stringify(payload),
                headers: headers,
            })

            const payload1 = rows.map(product => ({
                "sbdaid": product.sbdaid ? product.sbdaid : ACSPLGUID.getNew(),
                "sbaid": SBAID ? SBAID : GUID,
                "sbproduct": product.SBPRODUCT,
                "sbduom": product.SBDUOM,
                "sbdquantity": product.SBDQUANTITY.toString(),
                "sbdrate": product.SBDRATE,
                "sbdtamt": product.SBDTAMT,
                "sbdigst": product.SBDIGST,
                "sbdsgst": product.SBDSGST,
                "sbdcgst": product.SBDCGST,
                "companyid": userdetail?.companyID || "",
                "deptid": userdetail?.departmentID || "",
                "hsncode": product.HSNCODE,
                "batchno": product.BATCHNO,
                "expirydate": product.EXPIRYDATE,
                "sbdtotal": product.SBDTOTAL,
                "isdeleted": product.IsDeleted === 1 || product.IsDeleted === true ? true : false,
            }));

            console.log(payload1);

            axios({
                method: "POST",
                url: baseUrl.Url + "/backend/api/SP_AddUpdSBillDetails",
                data: JSON.stringify(payload1),
                headers: headers,
            })

            // console.log("API Response:", response.data);

            Swal.fire({
                icon: "success",
                title: "Saved!",
                text: "Data saved successfully.",
                confirmButtonText: "OK",
            });
            setFormData({
                SBVENDORID: "",
                SBCONSIGNER: "",
                SBVEHICALNO: "",
                SBPOSUPPLY: "",
                SBBILLNO: "",
                SBDATE: "",
                SBBILLDATE: new Date().toISOString().split("T")[0],
                SBDUEDATE: "",
                SBNARRATION: "",
                SBTRANSPORT: "",
                SBTERMANDCONDITION: "",
                SBCHALLANNO: "",
                SBDISCOUNT: 0,
                SBNETAMOUNT: 0,
                VBILLNO: "",
                QNODAYS: 0,
                QPAYMENTTERMS: "",
                QPDUEDATE: "",
                CUSTOMERSTATE: "",
                CUSTOMEREMAIL: "",
                CUSTOMERCONTACT: "",
                PAYMENTMODE: "",
                SBILLTOTAL: 0,
                SBGROSSAMT: 0
                // SBVENDORIDid:"",
                // SBCONSIGNERid:"",

            })
            setRows([]);
            navigate(route.SaleInvoice);
        } catch (error) {
            console.error("Submission Error:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to save data. Please try again.",
            });
        }

    };


    useEffect(() => {
        if (SBAID) {
            try {
                const payload1 = {
                    sbaid: SBAID,
                    companyid: userdetail?.companyID || "",
                    deptid: userdetail?.departmentID || "",
                }
                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };

                axios({
                    method: "POST",
                    url: baseUrl.Url + "/backend/api/GET_SBillMaster",
                    data: JSON.stringify(payload1),
                    headers: headers,
                })
                    .then((response) => {
                        if (response.status != 200) throw new Error("Failed to Fetching Data");
                        let apiData = response.data[0];


                        setFormData(prev => ({
                            ...prev,
                            SBAID: apiData.sbaid,
                            SBVENDORID: customer.find((state) => state.value == apiData.sbvendorid)?.label || "",
                            SBCONSIGNER: transpoter.find((state) => state.value == apiData.sbconsigner)?.label || "",
                            SBVEHICALNO: apiData.sbvehicalno,
                            SBPOSUPPLY: states.find((state) => state.value == apiData.sbposupply)?.value || "",
                            SBBILLNO: apiData.sbbillno,
                            SBDATE: convertToISODate(apiData.sbdate),
                            SBBILLDATE: convertToISODate(apiData.sbbilldate),
                            SBDUEDATE: convertToISODate(apiData.sbduedate),
                            SBNARRATION: apiData.sbnarration,
                            SBTRANSPORT: apiData.sbtransport,
                            SBTERMANDCONDITION: apiData.sbtermandcondition,
                            SBCHALLANNO: apiData.sbchallanno,
                            SBDISCOUNT: apiData.sbdiscount,
                            SBNETAMOUNT: apiData.sbnetamount,
                            VBILLNO: apiData.vbillno,
                            QNODAYS: 0,
                            QPAYMENTTERMS: "",
                            QPDUEDATE: "",
                            CUSTOMERSTATE: "",
                            CUSTOMEREMAIL: "",
                            CUSTOMERCONTACT: "",
                            PAYMENTMODE: apiData.paymentmode,
                            SBGROSSAMT: apiData.sbgrossamt,
                            SBILLTOTAL: apiData.sbilltotal,
                            // SBVENDORIDid:"",
                            // SBCONSIGNERid:"",
                        }));

                        console.log("sale Bill  master data", apiData)
                        const selectedProduct = Data.find(p => p.caid == apiData.sbvendorid);
                        if (selectedProduct) {
                            setFormData(prevData => ({
                                ...prevData,
                                CUSTOMERSTATE: selectedProduct.sstatename,
                                CUSTOMEREMAIL: selectedProduct.cemail,
                                CUSTOMERCONTACT: selectedProduct.ccontactpersonmobile,
                            }));
                        }
                    })

            } catch (error) {
                console.error("Error fetching Access Right Data:", error);
            }


            try {
                const payload = {
                    sbaid: SBAID,
                    companyid: userdetail?.companyID || "",
                    deptid: userdetail?.departmentID || "",
                }
                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };

                axios({
                    method: "POST",
                    url: baseUrl.Url + "/backend/api/GET_SBillDetailsById",
                    data: JSON.stringify(payload),
                    headers: headers,
                })
                    .then((response) => {

                        if (response.status != 200) throw new Error("Failed to Fetching Details Data");
                        if (response.data.length > 0) {
                            const mappedProducts = response.data.map((item) => ({
                                sbdaid: item.sbdaid || "",
                                SBPRODUCT: item.sbproduct,
                                SBDUOM: item.sbduom,
                                PRODUCTNAME: item.productname,
                                UOMTITLE: item.uomtitle,
                                HSNCODE: item.hsncode,
                                EXPIRYDATE: convertToISODate(item.expirydate),
                                BATCHNO: item.batchno,
                                SBDQUANTITY: parseFloat(item.sbdquantity) || 0,
                                SBDRATE: parseFloat(item.sbdrate) || 0,
                                SBDTAMT: parseFloat(item.sbdtamt) || 0,
                                SBDCGST: parseFloat(item.sbdcgst) || 0,
                                SBDSGST: parseFloat(item.sbdsgst) || 0,
                                SBDIGST: parseFloat(item.sbdigst) || 0,
                                SBDTOTAL: item.sbdtotal + item.sbdcgst + item.sbdsgst + item.sbdigst,
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
        }
    }, [SBAID]);

    const handleSearch = async () => {
        if (SBCHALLANNO) {

            try {
                const payload = {
                    "sctrnno": SBCHALLANNO,
                    "companyid": userdetail?.companyID || "",
                    "deptid": userdetail?.departmentID || "",
                };
                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };
                const response = await axios.post(
                    `${baseUrl.Url}/backend/api/GET_SChallanNoSearch`,
                    payload,
                    { headers }
                );
                if (response.status !== 200)
                    throw new Error("Failed to fetch vendor data");
                console.log("venderos", response.data)
                if (response.data.length > 0) {
                    setFormData(prevState => ({
                        ...prevState,
                        SBVEHICALNO: response.data[0].scvno,
                        SBPOSUPPLY: states.find((state) => state.value == response.data[0].scposupply)?.value || "",
                        // PBCONSIGNER: transporter.find((transporter) => transporter.value == response.data[0].scposupply)?.value || "",
                        SBCHALLANNO: response.data[0].sctrnno,
                        SBCONSIGNER: response.data[0].vendorname,
                        SBVENDORID: response.data[0].trnasporter,
                        PBVENDORBID: "",
                        CUSTOMERCONTACT: response.data[0].contactnumber,
                        CUSTOMEREMAIL: response.data[0].email,
                        SBVENDORIDid: response.data[0].scseller,
                        SBCONSIGNERid: response.data[0].scconsigner,
                        PAYMENTMODE: response.data[0].paymentmode,

                    }));

                    const mappedProducts = response.data.map((item) => ({
                        SBPRODUCT: item.scdproduct,
                        SBDQUANTITY: parseFloat(item.scdquantity) || 0,
                        SBDUOM: item.scduom,
                        HSNCODE: item.hsncode,
                        EXPIRYDATE: item.expirydate,
                        BATCHNO: item.batchno,
                        SBDRATE: parseFloat(item.scdrate) || 0,
                        SBDTAMT: parseFloat(item.scdtaxable) || 0,
                        SBDCGST: parseFloat(item.scdcgst) || 0,
                        SBDSGST: parseFloat(item.scdsgst) || 0,
                        SBDIGST: parseFloat(item.scdigst) || 0,
                        SBDTOTAL: parseFloat(item.scdtamt) || 0,
                        PRODUCTNAME: item.productname,
                        UOMTITLE: item.uomtitle,
                    }));

                    // टेबल अपडेट करण्यासाठी डेटा सेट करा
                    setRows(mappedProducts);
                }
            } catch (error) {
                console.error("Error fetching vendor data:", error);
            }

        }
    };



    useEffect(() => {
        if (rows.length > 0) {
            setFormData((prevFormData) => ({
                ...prevFormData,
                SBGROSSAMT: rows.reduce((acc, row) => acc + parseFloat(row.SBDTAMT || 0), 0).toFixed(2),
                SBILLTOTAL: rows.reduce((acc, row) => acc + parseFloat(row.SBDTOTAL || 0), 0).toFixed(2),
            }));
        }
    }, [rows]);


    useEffect(() => {
        if (rows.length > 0) {
            let totalSBDTAMT = 0;
            let totalSBDTOTAL = 0;

            rows.forEach((row) => {
                totalSBDTAMT += parseFloat(row.SBDTAMT || 0);
                totalSBDTOTAL += parseFloat(row.SBDTOTAL || 0);
            });

            const netAmount = totalSBDTOTAL - parseFloat(formData.SBDISCOUNT || 0);
            const transportAmount = parseFloat(formData.SBTRANSPORT || 0);

            setFormData((prevFormData) => ({
                ...prevFormData,
                SBGROSSAMT: totalSBDTAMT.toFixed(2),
                SBILLTOTAL: totalSBDTOTAL.toFixed(2),
                SBNETAMOUNT: (netAmount + transportAmount).toFixed(2),
            }));
        }
    }, [rows, formData.SBDISCOUNT, formData.SBTRANSPORT]);  // Dependencies



    useEffect(() => {
        console.log("Updated Table Data:", rows);
    }, [rows]);


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
    }, [formData, rows, navigate, route.SaleInvoice]);

    const checkFormValidity = (e) => {
        const { VBILLNO, SBDUEDATE, SBTERMANDCONDITION } = formData;

        if (!SBDUEDATE) {
            Swal.fire({
                icon: "error",
                title: "Validation Error",
                text: "Please enter a valid date.",
            }).then(() => {
                setTimeout(() => {
                    SBDUEDATERef.current?.focus();
                }, 1000);
            });
            return;
        }
        if (!VBILLNO || !/^[a-zA-Z0-9]+$/.test(VBILLNO)) {
            Swal.fire({
                icon: "error",
                title: "Validation Error",
                text: "VBILLNO should only contain letters and numbers.",
            }).then(() => {
                setTimeout(() => {
                    VBILLNORef.current?.focus();
                }, 1000);
            });
            return;
        }

        if (!SBTERMANDCONDITION || SBTERMANDCONDITION.trim() === "") {
            Swal.fire({
                icon: "error",
                title: "Validation Error",
                text: "Please Enter Terms And Condition.",
            }).then(() => {
                setTimeout(() => {

                    SBTERMANDCONDITIONRef.current?.focus();
                }, 1000);
            });
            return;
        }

        // if (!SBNARRATION || SBNARRATION.trim() === "") {
        //   Swal.fire({
        //     icon: "error",
        //     title: "Validation Error",
        //     text: "Please Enter Narration.",
        //   }).then(() => {
        //     setTimeout(() => {
        //       SBNARRATIONRef.current?.focus();
        //     }, 1000);
        //   });
        //   return ;

        // }
        handleSubmit(e);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        showConfirmationAlert(e);
        console.log("Form Data Submitted: ", formData);
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
        })
            .then((result) => {
                if (result.isConfirmed) {
                    handleFormSubmission(event); // Proceed with form submission
                }
            });
    };



    const handleInputChange = (event) => {
        const { name, value } = event.target;
        const updatedValue = value.replace(/^\s+/, "");

        setFormData({
            ...formData,
            [name]: updatedValue,
        });
    };

    const handleDropdownChange = (selectedOption, field) => {
        setFormData(prevData => ({
            ...prevData,
            [field]: selectedOption ? selectedOption.value : "",
        }));
    }


    const MySwal = withReactContent(Swal);
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
                navigate(route.salesreturn);
            }
        });
    };


    // const handleResetForm = (e) => {
    //     e.preventDefault(); // Prevent Bootstrap modal dismissal interference

    //     // Reset form state
    //     setFormState({
    //         SBAID: "",
    //         SBVENDORID: "",
    //         SBCONSIGNER: "",
    //         SBVEHICALNO: "",
    //         SBPOSUPPLY: "",
    //         SBBILLNO: "",
    //         SBDATE: "",
    //         SBBILLDATE: new Date().toISOString().split("T")[0],
    //         SBDUEDATE: "",
    //         SBNARRATION: "",
    //         SBTRANSPORT: "",
    //         SBTERMANDCONDITION: "",
    //         SBCHALLANNO: "",
    //         SBDISCOUNT: 0,
    //         SBNETAMOUNT: 0,
    //         VBILLNO: "",
    //         QNODAYS: 0,
    //         QPAYMENTTERMS: "",
    //         QPDUEDATE: "",
    //         CUSTOMERSTATE: "",
    //         CUSTOMEREMAIL: "",
    //         CUSTOMERCONTACT: "",
    //         SBVENDORIDid: "",
    //         SBCONSIGNERid: "",
    //         PAYMENTMODE: "",
    //         SBILLTOTAL: 0,
    //         SBGROSSAMT: 0,
    //     });

    //     // Clear table data
    //     setRows([]);

    //     // Navigate to the index route
    //     navigate(route.salesreturn);
    // };
    // const onproductchange = (selectedOption) => {
    //     const selectedProduct = HSNDATA.find(p => p.paid === selectedOption.value);
    //       if (selectedProduct) {
    //         setProductData(prevData => ({
    //               ...prevData,
    //               HSNCODE: selectedProduct.hsncode,
    //           }));
    //       }

    // }



    //setchallanadata
    useEffect(() => {
        if (!scaid) return;
        const fetchData = async () => {
            try {
                const payload = {
                    scaid: scaid,
                    companyid: userdetail?.companyID || "",
                    deptid: userdetail?.departmentID || "",
                };

                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };

                const response = await axios.post(
                    `${baseUrl.Url}/backend/api/GET_SChallanDataByID`,
                    payload,
                    { headers }
                );

                if (response.status !== 200 || !response.data) {
                    console.error("Failed response:", response);
                    throw new Error("Failed to fetch SChallan data");
                }

                console.log("Fetched Data:", response.data);

                if (Array.isArray(response.data) && response.data.length > 0) {
                    const firstItem = response.data[0];

                    setFormData(prevState => ({
                        ...prevState,
                        SBVEHICALNO: firstItem?.scvno || "",
                        SBPOSUPPLY: states.find(state => state.value === firstItem?.scposupply)?.value || "",
                        // PBCONSIGNER: transporter.find(transporter => transporter.value === firstItem?.scposupply)?.value || "",
                        SBCHALLANNO: firstItem?.sctrnno || "",
                        CUSTOMERCONTACT: firstItem?.contactnumber || "",
                        SBVENDORIDid: firstItem?.scseller || "",
                        SBCONSIGNERid: firstItem?.scconsigner || "",
                        PAYMENTMODE: firstItem?.paymentmode || "",
                    }));

                    // Map product details
                    const mappedProducts = response.data.map(item => ({
                        SBPRODUCT: item?.scdproduct || "",
                        SBDQUANTITY: parseFloat(item?.scdquantity) || 0,
                        SBDUOM: item?.scduom || "",
                        HSNCODE: item?.hsncode || "",
                        EXPIRYDATE: item?.expirydate || "",
                        BATCHNO: item?.batchno || "",
                        SBDRATE: parseFloat(item?.scdrate) || 0,
                        SBDTAMT: parseFloat(item?.scdtaxable) || 0,
                        SBDCGST: parseFloat(item?.scdcgst) || 0,
                        SBDSGST: parseFloat(item?.scdsgst) || 0,
                        SBDIGST: parseFloat(item?.scdigst) || 0,
                        SBDTOTAL: parseFloat(item?.scdtamt) || 0,
                        PRODUCTNAME: item?.productname || "",
                        UOMTITLE: item?.uomtitle || "",
                    }));

                    setRows(mappedProducts);
                }
            } catch (error) {
                console.error("Error fetching vendor data:", error);
            }
        };

        fetchData();
    }, [scaid]);


    return (
        <div>
            <div className="modal fade" id="AddSaleInvoice">
                <div className="modal-dialog modal-dialog-centered modal-fullscreen">
                    <div className="modal-content">
                        <div className="page-wrapper-new p-0">
                            <div className="content">
                                <div className="modal-header border-0 custom-modal-header">
                                    <div className="page-title">
                                        <h4>Add Sale Invoice</h4>
                                    </div>
                                    {!SBAID && (
                                        <div className="row justify-content-center">
                                            <div className="col-12">
                                                <div className="search-input d-flex flex-column flex-sm-row align-items-stretch">
                                                    {/* Search Input */}
                                                    <input
                                                        type="text"
                                                        placeholder="Search challan No"
                                                        className="form-control w-100 mb-sm-0"
                                                        value={SBCHALLANNO.trim()}
                                                        onChange={(e) => setSBCHALLANNO(e.target.value)}
                                                    />

                                                    {/* Search Button */}
                                                    <button
                                                        type="button"
                                                        className="btn btn-primary w-75 d-sm-none ms-2"
                                                        onClick={handleSearch}
                                                    >
                                                        Search
                                                    </button>

                                                    {/* Button for larger views */}
                                                    <button
                                                        type="button"
                                                        className="btn btn-primary ms-3 d-none d-sm-inline"
                                                        onClick={handleSearch}
                                                    >
                                                        Search
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="page-btn">
                                        <Link className="btn btn-secondary" aria-label="Close" data-bs-dismiss="modal"  >
                                            <ArrowLeft className="" />
                                            Back to Index
                                        </Link>
                                    </div>
                                </div>
                                <div className="modal-body custom-modal-body" style={{
                                    overflowY: "hidden",
                                }}>
                                    <form onSubmit={handleSubmit}>
                                        <div className="row">
                                            <div className="col-lg-1 col-md-3 col-12">
                                                <div className="mb-0 add-product form-label">
                                                    <label>Bill No</label>
                                                    <input
                                                        type="text"
                                                        className="form-control border"
                                                        placeholder="Bill No"
                                                        name="SBBILLNO"
                                                        value={formData.SBBILLNO}
                                                        onChange={handleInputChange}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-3 col-sm-12 col-lg-2">
                                                <div className="mb-0 add-product form-label">
                                                    <label>Bill Date</label>
                                                    <div className="input-groupicon calender-input">
                                                        <input
                                                            type="date"
                                                            name="SBBILLDATE"
                                                            className="form-control border"
                                                            value={formData.SBBILLDATE}

                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-md-3 col-sm-12 col-lg-2">
                                                <div className="mb-0 add-product form-label">
                                                    <label>Due Date</label>
                                                    <div className="input-groupicon calender-input">
                                                        <input
                                                            type="date"
                                                            className="form-control border"
                                                            name="SBDUEDATE"
                                                            ref={SBDUEDATERef}
                                                            value={formData.SBDUEDATE}
                                                            onChange={(e) =>
                                                                setFormData((prev) => ({
                                                                    ...prev,
                                                                    SBDUEDATE: e.target.value,
                                                                }))
                                                            }
                                                            min={
                                                                formData.SBBILLDATE
                                                                    ? new Date(new Date(formData.SBBILLDATE).getTime() + 86400000)
                                                                        .toISOString()
                                                                        .split("T")[0]
                                                                    : undefined
                                                            }
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-lg-1 col-md-3 col-12">
                                                <div className="mb-0 add-product form-label">
                                                    <label >Challan No</label>
                                                    <input
                                                        type="text"
                                                        className="form-control border"
                                                        placeholder="Challan No"
                                                        name="SBCHALLANNO"
                                                        value={formData.SBCHALLANNO}
                                                        readOnly
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-lg-2 col-md-3 col-12">
                                                <div className="mb-0 add-product form-label">
                                                    <label className="required">Transporter</label>

                                                    <input
                                                        type="text"
                                                        className="form-control border"
                                                        placeholder="Transporter"
                                                        name="SBCONSIGNER"
                                                        value={formData.SBCONSIGNER}
                                                        onChange={handleInputChange}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-lg-2 col-md-3 col-12">
                                                <div className="mb-0 add-product form-label">
                                                    <label>Vehicle No</label>
                                                    <input
                                                        type="text"
                                                        className="form-control border"
                                                        placeholder="Vehicle No"
                                                        //pattern="^[A-Z]{2}\s\d{1,2}\s[A-Z]{1,2}\s\d{4}$"
                                                        //title="please enter valid vehicle number (उदा: MH 12 AB 1234)"
                                                        name="SBVEHICALNO"
                                                        value={formData.SBVEHICALNO}
                                                        onChange={handleInputChange}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-lg-2 col-md-3 col-12">
                                                <div className="mb-0 add-product form-label">
                                                    <label>Place of Supply</label>

                                                    <Select
                                                        classNamePrefix="react-select"
                                                        options={states}
                                                        readOnly
                                                        value={states.find(option => option.value == formData.SBPOSUPPLY) || null}
                                                        onChange={(selectedOption) => handleDropdownChange(selectedOption, "SBPOSUPPLY")}
                                                        styles={{
                                                            menu: (base) => ({
                                                                ...base,
                                                                zIndex: 9999,
                                                            }),
                                                        }}
                                                    />
                                                </div>
                                            </div>

                                        </div>

                                        <div className="row ">
                                            <div className="col-lg-2 col-md-3 col-12">
                                                <div className="mb-0 add-product form-label">
                                                    <label className=" required ">Customer Bill No</label>
                                                    <input
                                                        type="text"
                                                        className="form-control border"
                                                        ref={VBILLNORef}
                                                        placeholder="Enter Customer Bill No"
                                                        name="VBILLNO"
                                                        value={formData.VBILLNO}
                                                        onChange={handleInputChange}
                                                        title="Please Enter Valid Number"
                                                        required
                                                    />
                                                </div>

                                            </div>
                                            <div className="col-lg-2 col-md-3 col-12">
                                                <div className="mb-0 add-product form-label">
                                                    <label className=" required ">Payment Mode</label>
                                                    <Select
                                                        classNamePrefix="react-select"
                                                        options={paymentmode}
                                                        placeholder="Choose"
                                                        value={paymentmode.find((option) => option.value === formData.PAYMENTMODE) || null}
                                                        onChange={(selectedOption) => {
                                                            setFormData((prevData) => ({
                                                                ...prevData,
                                                                PAYMENTMODE: selectedOption ? selectedOption.value : '',
                                                            }));
                                                        }}
                                                        required
                                                    />
                                                </div>

                                            </div>
                                            <div className="col-lg-2 col-md-3 col-12">
                                                <div className=" mb-0 add-product form-label">
                                                    <label className="required">Customer Name</label>

                                                    <input
                                                        type="text"
                                                        className="form-control border"
                                                        placeholder="Customer Name"
                                                        name="SBVENDORID"
                                                        value={formData.SBVENDORID}
                                                        onChange={handleInputChange}

                                                    />
                                                </div>
                                            </div>
                                            <div className="col-lg-2 col-md-3 col-12">
                                                <div className="mb-0 add-product form-label">
                                                    <label>Customer Email</label>
                                                    <input
                                                        type="email"
                                                        className="form-control border"
                                                        placeholder="Email"
                                                        name="CUSTOMEREMAIL"
                                                        value={formData.CUSTOMEREMAIL}
                                                        onChange={handleInputChange}

                                                    />
                                                </div>
                                            </div>
                                            <div className="col-lg-2 col-md-3 col-12">
                                                <div className="mb-0 add-product form-label">
                                                    <label>Customer Contact</label>
                                                    <input
                                                        type="number"
                                                        className="form-control border"
                                                        placeholder="contact"
                                                        name="CUSTOMERCONTACT"
                                                        value={formData.CUSTOMERCONTACT}
                                                        onChange={handleInputChange}

                                                    />
                                                </div>
                                            </div>

                                            <div className="col-lg-2 col-md-3 col-12">
                                                <div className="mb-0 add-product form-label">
                                                    <label> Customer State</label>
                                                    <Select
                                                        classNamePrefix="react-select"

                                                        options={states}
                                                        readOnly
                                                        value={states.find(option => option.value == formData.CUSTOMERSTATE) || null}
                                                        onChange={(selectedOption) => handleDropdownChange(selectedOption, "CUSTOMERSTATE")}
                                                        styles={{
                                                            menu: (base) => ({
                                                                ...base,
                                                                zIndex: 9999,
                                                            }),
                                                        }}
                                                    />

                                                </div>
                                            </div>
                                        </div>
                                        <div className="row mb-3">

                                        </div>
                                        <div className="row">
                                            {/* Table for Products */}
                                            <div className="border p-3 rounded shadow-sm mb-4 mt-4">


                                                <div className="row">
                                                    <div className="col-lg-12">
                                                        <div className="modal-body-table">
                                                            <div className="table-responsive">
                                                                <table className="table datanew">
                                                                    <table className="table table-bordered">
                                                                        <thead className="thead-dark">
                                                                            <tr>
                                                                                <th className="col-3">Product</th>
                                                                                <th className="col-1">HSN Code</th>
                                                                                <th className="col-1">UOM</th>
                                                                                <th className="col-1">Batch No</th>
                                                                                <th className="col-1">Expiry Date</th>
                                                                                <th className="col-1">Quantity</th>
                                                                                <th className="col-1">Rate</th>
                                                                                <th className="col-1">Taxable Value</th>
                                                                                <th className="col-1">CGST</th>
                                                                                <th className="col-1">SGST</th>
                                                                                <th className="col-1">IGST</th>
                                                                                <th className="col-1">Total</th>

                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {rows?.map((row, index) => (
                                                                                <tr key={index}>
                                                                                    <td>{row.PRODUCTNAME}</td> {/* Displaying label */}
                                                                                    <td>{row.HSNCODE}</td>
                                                                                    <td>{row.UOMTITLE}</td> {/* Displaying label */}
                                                                                    <td>{row.BATCHNO}</td>
                                                                                    <td>{row.EXPIRYDATE}</td>
                                                                                    <td>{row.SBDQUANTITY}</td>
                                                                                    <td>{row.SBDRATE}</td>
                                                                                    <td>{row.SBDTAMT}</td>
                                                                                    <td>{row.SBDCGST}</td>
                                                                                    <td>{row.SBDSGST}</td>
                                                                                    <td>{row.SBDIGST}</td>
                                                                                    <td>{row.SBDTOTAL}</td>

                                                                                </tr>
                                                                            ))}
                                                                        </tbody>
                                                                        <tfoot>

                                                                            <td colSpan="6"></td> {/* Empty cells for alignment */}
                                                                            <td><strong>Total Taxable:</strong></td>
                                                                            <td>
                                                                                <input
                                                                                    type="text"
                                                                                    className="form-control form-control-sm border-0 border-bottom border-warning"
                                                                                    name="SBGROSSAMT"
                                                                                    value={formData.SBGROSSAMT}
                                                                                    readOnly
                                                                                />
                                                                            </td>
                                                                            <td colSpan="2"></td>
                                                                            <td><strong>Total:</strong></td>
                                                                            <td>
                                                                                <input
                                                                                    type="text"
                                                                                    className="form-control form-control-sm border-0 border-bottom border-warning"
                                                                                    name="SBILLTOTAL"
                                                                                    value={formData.SBILLTOTAL}
                                                                                    readOnly
                                                                                />
                                                                            </td>
                                                                            <td></td>

                                                                        </tfoot>
                                                                    </table>
                                                                </table>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-lg-8 col-md-12 col-sm-12 ">
                                                    <div className="mb-0 add-product form-label">
                                                        <label className=" required">Terms And Conditions</label>
                                                        <textarea
                                                            type="text"
                                                            className="form-control border "
                                                            name="SBTERMANDCONDITION"
                                                            value={formData.SBTERMANDCONDITION}
                                                            placeholder="Enter Text"
                                                            onChange={handleInputChange}
                                                            ref={SBTERMANDCONDITIONRef}
                                                            //onKeyDown={(e) => handleKeyDown(e, PBNARRATIONRef)}
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-1 col-md-6 col-sm-12 mt-2">
                                                    <div className="mb-0 add-product form-label">
                                                        <label>Transport</label>
                                                        <input
                                                            type="number"
                                                            className="form-control border"
                                                            name="SBTRANSPORT"
                                                            placeholder="Transport"
                                                            value={formData.SBTRANSPORT}
                                                            onChange={handleInputChange}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-1 col-md-6 col-sm-12 mt-2">
                                                    <div className="mb-0 add-product form-label">
                                                        <label>Discount</label>
                                                        <input
                                                            type="number"
                                                            className="form-control border"
                                                            name="SBDISCOUNT"
                                                            placeholder="Discount"
                                                            value={formData.SBDISCOUNT}
                                                            onChange={handleInputChange}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-2 col-md-6 col-sm-12 mt-2">
                                                    <div className="mb-0 add-product form-label">
                                                        <label>Net Amount</label>
                                                        <input
                                                            type="number"
                                                            name="SBNETAMOUNT"
                                                            className="form-control border"
                                                            value={formData.SBNETAMOUNT} />
                                                    </div>
                                                </div>

                                            </div>


                                        </div>


                                        <div className="modal-footer-btn">
                                            <button
                                                type="button"
                                                className="btn btn-cancel me-2"
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

export default AddSaleInvoice;
