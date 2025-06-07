import React, { useState, useEffect, useRef } from "react";

import Select from "react-select";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Link, useNavigate } from "react-router-dom";
import { all_routes } from "../../Router/all_routes";
import axios from "axios";
import { ACSPLGUID, baseUrl, convertToISODate } from "../../core/json/custom";
import { getUserData } from "../../Context/UserData";
import {
    ArrowLeft,
    Trash2,
    Edit

} from "feather-icons-react/build/IconComponents";
const AddDirectInvoice = ({ SBAID }) => {
    const { userdetail } = getUserData();
    console.log(SBAID, "SBAID")
    const route = all_routes;
    const navigate = useNavigate();
    //const SBNARRATIONRef=useRef(null);
    const VBILLNORef = useRef(null);
    const SBTERMANDCONDITIONRef = useRef(null);
    const SBDUEDATERef = useRef(null);
    const GUID = ACSPLGUID.getNew();
    const [states, setstates] = useState([]);
    //const { SBAID,SBDAID} = location.state || {};
    const [paymentmode, setpaymentmode] = useState([]);
    const [transpoter, settranspoter] = useState([]);
    const [customer, setcustomer] = useState([]);
    const SBDPRODUCTRef = useRef(null);
    const SBDUOMRef = useRef(null);
    const SBDQUANTITYRef = useRef(null);
    const SBDRATERef = useRef(null);
    const SBDTAXABLERef = useRef(null);
    const SBDCGSTRef = useRef(null);
    const SBDSGSTRef = useRef(null);
    const SBDIGSTRef = useRef(null);
    const [product, setproduct] = useState([]);
    const [HSNDATA, setHSNDATA] = useState([]);
    const [uom, setuom] = useState([]);
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
        SBGROSSAMT: 0


    });
    const [rows, setRows] = useState([]);
    const [productData, setProductData] = useState({
        sbdaid: '',
        SBPRODUCT: '',
        SBDUOM: '',
        SBDQUANTITY: '',
        SBDRATE: 0,
        SBDTAMT: 0,
        SBDIGST: 0,
        SBDSGST: 0,
        SBDCGST: 0,
        HSNCODE: 0,
        BATCHNO: '',
        EXPIRYDATE: '',
        SBDTOTAL: 0,
        IsDeleted: 0,
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

        const fetchImplications = async () => {
            try {
                const response = await axios.get(
                    baseUrl.Url + "/backend/api/Implications/SOLID|LIQUID|GAS|",
                    // "http://adsvr:78/api/Implications/SOLID|LIQUID|GAS"
                );

                if (response.status !== 200) throw new Error("Failed to fetch implications data");

                const data = response.data;

                // Combine all implications into one array
                const implicationsDropdown = data.map(({ iTitle, iValue }) => ({
                    label: iTitle,
                    value: iValue,
                }));

                setuom(implicationsDropdown);
            } catch (error) {
                console.error("Error fetching implications:", error);
            }
        };

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
        fetchImplications();
        fetchProductData();
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

            const payload2 = {
                "scaid": SBAID ? SBAID : GUID,
                "sctrnno": ACSPLGUID.getNew(),
                "scseller": formData.SBVENDORIDid,
                "scconsigner": formData.SBCONSIGNERid,
                "scvno": formData.SBVEHICALNO,
                "scposupply": formData.SBPOSUPPLY,
                "scnarration": "",
                "scdate": "",
                "scnamt": formData.SBILLTOTAL,
                "scgamt": formData.SBGROSSAMT,
                "soreff": "",
                "companyid": userdetail?.companyID || "",
                "deptid": userdetail?.departmentID || "",
                "paymentmode": formData.PAYMENTMODE,
            }


            axios({
                method: "POST",
                url: baseUrl.Url + "/backend/api/SP_AddUpdSChallanMaster",
                data: JSON.stringify(payload2),
                headers: headers,
            })
            console.log("payload2", payload2);

            const payload3 = rows.map((row) => ({
                "scdaid": product.sbdaid ? product.sbdaid : ACSPLGUID.getNew(),
                "scaid": SBAID ? SBAID : GUID,
                "scdproduct": row.SBPRODUCT,
                "scduom": row.SBDUOM,
                "hsncode": row.HSNCODE,
                "scdquantity": row.SBDQUANTITY.toString(),
                "scdrate": row.SBDRATE,
                "scdtamt": row.SBDTOTAL,
                "scdtaxable": row.SBDTAMT.toString(),
                "scdigst": row.SBDIGST,
                "scdsgst": row.SBDSGST,
                "scdcgst": row.SBDCGST,
                "batchno": row.BATCHNO,
                "expirydate": row.EXPIRYDATE,
                "companyid": userdetail?.companyID || "",
                "deptid": userdetail?.departmentID || "",
                "isdeleted": row.IsDeleted === 1 || row.IsDeleted === true ? true : false,
            }));

            const response = await axios({
                method: "POST",
                url: baseUrl.Url + "/backend/api/SP_AddUpdSChallanDetails",
                data: JSON.stringify(payload3),
                headers: headers,
            });

            console.log("Payload Sent:", payload3);
            console.log("Response Received:", response.data);
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
                            SBVENDORIDid: apiData.sbvendorid,
                            SBCONSIGNERid: apiData.sbconsigner,
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


    const handleProductChange = (e) => {
        const { name, value } = e.target;

        setProductData((prevData) => {
            const updatedData = { ...prevData, [name]: parseFloat(value) || 0 };
            if (name === "SBDQUANTITY" || name === "SBDRATE") {
                updatedData.SBDTAMT = updatedData.SBDQUANTITY * updatedData.SBDRATE;
            }
            if (name === "SBDCGST" || name === "SBDSGST" || name === "SBDIGST") {
                updatedData.SBDTOTAL =
                    updatedData.SBDTAMT + updatedData.SBDCGST + updatedData.SBDSGST + updatedData.SBDIGST;
            }
            return updatedData;
        });
    };

    const handleAddProduct = () => {
        if (!productData.SBPRODUCT || !productData.SBDUOM || !productData.SBDQUANTITY || !productData.SBDRATE || !productData.EXPIRYDATE || !productData.BATCHNO) {
            MySwal.fire({
                title: "Error!",
                text: "Please fill in all the product fields before adding.",
                icon: "error",
            });
            return;
        }

        const newProduct = {
            ...productData,
            PRODUCTNAME: product.find((item) => item.value === productData.SBPRODUCT)?.label || "",
            UOMTITLE: uom.find((item) => item.value === productData.SBDUOM)?.label || "",
            SBDTAMT: productData.SBDQUANTITY * productData.SBDRATE,
            SBDTOTAL: (productData.SBDQUANTITY * productData.SBDRATE) + productData.SBDCGST + productData.SBDSGST + productData.SBDIGST,
        };

        setRows((prevRows) => {
            const existingIndex = prevRows.findIndex((row) => row.sbdaid === productData.sbdaid);

            if (existingIndex !== -1) {
                // Update existing row
                const updatedRows = [...prevRows];
                updatedRows[existingIndex] = newProduct;
                return updatedRows;
            } else {
                // Add new row
                return [...prevRows, { ...newProduct, sbdaid: ACSPLGUID.getNew() }];
            }
        });
        MySwal.fire({
            icon: "success",
            title: productData.sbdaid ? "Updated!" : "Saved!",
            text: productData.sbdaid ? "Record updated successfully!" : "Data added successfully!",
            confirmButtonText: "OK",
        });

        // let updatedTableData;
        // if (productData.sbdaid) {
        //     updatedTableData = rows.map((item) =>
        //         item.sbdaid === productData.sbdaid ? { ...item, ...productData } : item
        //     );
        // } else {
        //     updatedTableData = [...rows, { ...productData, sbdaid: ACSPLGUID.getNew() }];
        // }

        // // Update the table data
        // setRows(updatedTableData);


        setProductData({
            SBPRODUCT: '',
            SBDUOM: '',
            SBDQUANTITY: '',
            SBDRATE: 0,
            SBDTAMT: 0,
            SBDIGST: 0,
            SBDSGST: 0,
            SBDCGST: 0,
            HSNCODE: 0,
            BATCHNO: '',
            EXPIRYDATE: '',
            SBDTOTAL: 0,
            IsDeleted: 0,
        });
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
                navigate(route.SaleInvoice);
            }
        });
    };
    const onproductchange = (selectedOption) => {
        const selectedProduct = HSNDATA.find(p => p.paid === selectedOption.value);
        if (selectedProduct) {
            setProductData(prevData => ({
                ...prevData,
                HSNCODE: selectedProduct.hsncode,
            }));
        }

    }

    const handleEdit = (sbdaid) => {
        console.log("editttttt");
        const filteredProducts = rows.filter((row) => row.sbdaid === sbdaid);


        setProductData({
            sbdaid: filteredProducts[0].sbdaid,
            SBPRODUCT: product.filter((data) => data.value == filteredProducts[0].SBPRODUCT)[0].value,
            SBDUOM: uom.filter((data) => data.value == filteredProducts[0].SBDUOM)[0].value,
            PRODUCTNAME: filteredProducts[0].PRODUCTNAME,
            UOMTITLE: filteredProducts[0].UOMTITLE,
            HSNCODE: filteredProducts[0].HSNCODE,
            EXPIRYDATE: convertToISODate(filteredProducts[0].EXPIRYDATE),
            BATCHNO: filteredProducts[0].BATCHNO,
            SBDQUANTITY: filteredProducts[0].SBDQUANTITY,
            SBDRATE: filteredProducts[0].SBDRATE,
            SBDTAMT: filteredProducts[0].SBDTAMT,
            SBDCGST: filteredProducts[0].SBDCGST,
            SBDSGST: filteredProducts[0].SBDSGST,
            SBDIGST: filteredProducts[0].SBDIGST,
            SBDTOTAL: filteredProducts[0].SBDTOTAL,
            IsDeleted: filteredProducts[0].IsDeleted,

        });
    };

    const handleDelete = (sbdaid) => {
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
                        row.sbdaid === sbdaid ? { ...row, IsDeleted: 1 } : row
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

    const OnCustomerChange = (selectedOption) => {
        const selectedProduct = Data.find(p => p.caid == selectedOption.value);
        if (selectedProduct) {
            setFormData(prevData => ({
                ...prevData,
                CUSTOMERSTATE: selectedProduct.sstatename,
                CUSTOMEREMAIL: selectedProduct.cemail,
                CUSTOMERCONTACT: selectedProduct.ccontactpersonmobile,
            }));
        }

    }


    return (
        <div>
            <div className="modal fade" id="AddDirectInvoice">
                <div className="modal-dialog modal-dialog-centered modal-fullscreen">
                    <div className="modal-content">
                        <div className="page-wrapper-new p-0">
                            <div className="content">
                                <div className="modal-header border-0 custom-modal-header">
                                    <div className="page-title">
                                        <h4>Add Sale Invoice</h4>
                                    </div>

                                    <div className="page-btn">
                                        <Link className="btn btn-secondary" aria-label="Close" data-bs-dismiss="modal" onClick={showExitAlert} >
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

                                                    <Select
                                                        classNamePrefix="react-select"
                                                        options={transpoter}
                                                        placeholder="Choose"
                                                        value={transpoter.find((option) => option.value === formData.SBCONSIGNERid) || null}
                                                        onChange={(selectedOption) => {
                                                            setFormData((prevData) => ({
                                                                ...prevData,
                                                                SBCONSIGNERid: selectedOption ? selectedOption.value : '',
                                                            }));
                                                        }}
                                                        required
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

                                                    <Select
                                                        classNamePrefix="react-select"
                                                        options={customer}
                                                        placeholder="Choose"
                                                        value={customer.find((option) => option.value === formData.SBVENDORIDid) || null}
                                                        onChange={(selectedOption) => {
                                                            setFormData((prevData) => ({
                                                                ...prevData,
                                                                SBVENDORIDid: selectedOption ? selectedOption.value : '',
                                                            }));
                                                            OnCustomerChange(selectedOption);
                                                        }}
                                                        required
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
                                                <div className="row mt-1">
                                                    <div className="col-lg-3 col-sm-6 col-12">
                                                        <div className="mb-0 add-product form-label">
                                                            <label className='required'>Product</label>

                                                            <Select
                                                                ref={SBDPRODUCTRef}
                                                                classNamePrefix="react-select"
                                                                options={product}
                                                                value={product.find((option) => option.value === productData.SBPRODUCT) || null}
                                                                onChange={(selectedOption) => {
                                                                    setProductData((prevData) => ({
                                                                        ...prevData,
                                                                        SBPRODUCT: selectedOption ? selectedOption.value : '',
                                                                    })); onproductchange(selectedOption);

                                                                }}
                                                            />



                                                        </div>
                                                    </div>
                                                    <div className="col-lg-1 col-sm-6 col-12">
                                                        <div className="mb-3  add-product form-label">
                                                            <label>HSN Code</label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                value={productData.HSNCODE || ""}
                                                                readOnly
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-2 col-sm-6 col-12">
                                                        <div className="mb-0 add-product form-label">
                                                            <label>Unit of Measurement</label>
                                                            <Select
                                                                ref={SBDUOMRef}
                                                                classNamePrefix="react-select"
                                                                options={uom}
                                                                value={uom.find((option) => option.value === productData.SBDUOM) || null}
                                                                onChange={(selectedOption) => {
                                                                    setProductData((prevData) => ({
                                                                        ...prevData,
                                                                        SBDUOM: selectedOption ? selectedOption.value : '',
                                                                    }));
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-2 col-md-6 col-sm-12">
                                                        <div className="mb-0 add-product form-label">
                                                            <label>Quantity</label>
                                                            <input
                                                                ref={SBDQUANTITYRef}
                                                                type="number"
                                                                className="form-control"
                                                                name="SBDQUANTITY"
                                                                value={productData.SBDQUANTITY}
                                                                onChange={handleProductChange}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-2 col-md-6 col-sm-12">
                                                        <div className="mb-0  add-product form-label">
                                                            <label>Rate</label>
                                                            <input
                                                                ref={SBDRATERef}
                                                                type="number"
                                                                className="form-control"
                                                                name="SBDRATE"
                                                                value={productData.SBDRATE}
                                                                onChange={handleProductChange}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-lg-2 col-md-6 col-sm-12">
                                                        <div className="mb-0  add-product form-label">
                                                            <label> Taxable Amount</label>
                                                            <input
                                                                ref={SBDTAXABLERef}
                                                                type="number"
                                                                className="form-control"
                                                                name="SBDTAMT"
                                                                value={productData.SBDTAMT}
                                                                readOnly
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="row">
                                                        <div className="col-lg-2 col-md-6 col-sm-12">
                                                            <div className="mb-0 add-product form-label">
                                                                <label>CGST</label>
                                                                <input
                                                                    ref={SBDCGSTRef}
                                                                    type="number"
                                                                    className="form-control"
                                                                    name="SBDCGST"
                                                                    value={productData.SBDCGST}
                                                                    onChange={handleProductChange}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-2 col-md-6 col-sm-12">
                                                            <div className="mb-0  add-product form-label">
                                                                <label>SGST</label>
                                                                <input
                                                                    ref={SBDSGSTRef}
                                                                    type="number"
                                                                    className="form-control"
                                                                    name="SBDSGST"
                                                                    value={productData.SBDSGST}
                                                                    onChange={handleProductChange}
                                                                />

                                                            </div>
                                                        </div>
                                                        <div className="col-lg-2 col-md-6 col-sm-12">
                                                            <div className="mb-0  add-product form-label">
                                                                <label>IGST</label>
                                                                <input
                                                                    ref={SBDIGSTRef}
                                                                    type="number"
                                                                    className="form-control"
                                                                    name="SBDIGST"
                                                                    value={productData.SBDIGST}
                                                                    onChange={handleProductChange}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-2 col-md-6 col-sm-12">
                                                            <div className="mb-0 add-product form-label">
                                                                <label>Total</label>
                                                                <input
                                                                    type="number"
                                                                    className="form-control"
                                                                    name="SCDTAMT"
                                                                    value={productData.SBDTOTAL}
                                                                    readOnly
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-2 col-md-6 col-sm-12">
                                                            <div className="mb-0  add-product form-label">
                                                                <label>Batch No</label>
                                                                <input
                                                                    //ref={SBDSGSTRef}
                                                                    type="text"
                                                                    className="form-control"
                                                                    name="BATCHNO"
                                                                    value={productData.BATCHNO}
                                                                    onChange={(e) =>
                                                                        setProductData({
                                                                            ...productData,
                                                                            BATCHNO: e.target.value,
                                                                        })
                                                                    }
                                                                />

                                                            </div>
                                                        </div>
                                                        <div className="col-lg-2 col-md-6 col-sm-12">
                                                            <div className="mb-0 add-product form-label">
                                                                <label>Expiry date</label>
                                                                <input
                                                                    // ref={SBDSGSTRef}
                                                                    type="date"
                                                                    className="form-control  border"
                                                                    name="EXPIRYDATE"
                                                                    value={productData.EXPIRYDATE}
                                                                    onChange={(e) =>
                                                                        setProductData({
                                                                            ...productData,
                                                                            EXPIRYDATE: e.target.value,
                                                                        })
                                                                    }
                                                                />


                                                            </div>
                                                        </div>
                                                        <div className="d-flex justify-content-end">
                                                            <div className="col-lg-2 col-md-6 col-sm-12 mt-4 ">
                                                                <div className="text-end">

                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-submit"
                                                                        onClick={handleAddProduct}
                                                                    >
                                                                        Add product
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

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
                                                                                <th className="col-1">Action</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {rows.length > 0 ? (
                                                                                rows
                                                                                    .filter((data) => data.IsDeleted == 0)
                                                                                    .map((row, index) => (
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
                                                                                            <td className="col-1 text-center">
                                                                                                <div className="edit-delete-action">
                                                                                                    <Link
                                                                                                        to="#"
                                                                                                        onClick={() => handleEdit(row.sbdaid)}
                                                                                                        className="me-2 p-1"
                                                                                                        style={{ color: 'lightblue' }}
                                                                                                    >
                                                                                                        <Edit className="feather-edit" />
                                                                                                    </Link>

                                                                                                    {/* Delete Button */}
                                                                                                    <Link
                                                                                                        className="confirm-text p-1 me-2"
                                                                                                        to="#"
                                                                                                        style={{ color: 'red' }}
                                                                                                        onClick={() => handleDelete(row.sbdaid)}
                                                                                                    >
                                                                                                        <Trash2 className="feather-trash-2" />
                                                                                                    </Link>
                                                                                                </div>
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

                                            {/* <div className="row ">
                          <div className="addproduct-icon">
                            <h5>
                              <span>Payment Details :</span>
                            </h5>
                          </div>
                      
                          <div className="col-lg-3 col-sm-6 col-12">
                              <div className="mb-0 add-product form-label">
                                  <label>Payment Due Date</label>
                                  <input
                                      type="text"
                                      className="form-control border"
                                      placeholder="select"
                                      name="QPDUEDATE"
                                      value={formData.QPDUEDATE}
                                      onChange={handleInputChange}
                                  />
                              </div>
                          </div>
                          <div className="col-lg-3 col-sm-6 col-12">
                              <div className="mb-0 add-product form-label">
                                  <label >Number Of Days</label>
                                  <input
                                      type="number"
                                      className="form-control border"
                                      placeholder="Number of Days"
                                      name="QNODAYS"
                                      value={formData.QNODAYS}
                                      onChange={handleInputChange}
                                  />
                              </div>
                          </div>
                          <div className="col-lg-6 col-md-12 col-sm-12 ">
                              <div className="mb-0 add-product form-label">
                              <label>Payment Terms</label>
                              <input 
                                type="text"
                                className="form-control border"
                                name="QPAYMENTTERMS"
                                placeholder="Enter Text"
                                value={formData.QPAYMENTTERMS}
                                onChange={handleInputChange}
                            />
                              </div>
                          </div>
                          
                      </div> */}
                                            {/* <div className="row">
                          <div className="col-lg-12 col-md-12 col-sm-12 ">
                              <div className="mb-0 add-product form-label">
                              <label className=" required">Narration</label>
                              <input 
                                ref={SBNARRATIONRef}
                                type="text"
                                className="form-control border"
                                name="SBNARRATION"
                                placeholder="Enter Text"
                                value={formData.SBNARRATION}
                                onChange={handleInputChange}
                                required 
                              />
                              </div>
                          </div>
                      </div> */}
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
}

export default AddDirectInvoice;
