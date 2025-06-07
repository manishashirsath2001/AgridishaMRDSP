
// import { Calendar } from "feather-icons-react/build/IconComponents";
import { useNavigate } from 'react-router-dom';
import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
// import { useLocation } from 'react-router-dom';
import {
    ArrowLeft,
    Trash2,
    Edit
} from "feather-icons-react/build/IconComponents";
import { ACSPLGUID, baseUrl, convertToISODate } from '../../core/json/custom';
import axios from "axios";
// import { ACSPLGUID, baseUrl } from "../../core/json/custom";
import { getUserData } from '../../Context/UserData';

function AddPurchasechallan({ pcaid }) {
    const { userdetail } = getUserData();
    // const location = useLocation();
    // const { PCAID } = location.state || {};
    // const { PCDAID } = location.state || {};
    // const GUAID = ACSPLGUID.getNew()
    const GUID = ACSPLGUID.getNew();
    const PCTRNNORef = useRef(null);
    const PCDATERef = useRef(null);
    const PCVNORef = useRef(null);
    const PCPOSUPPLYRef = useRef(null);
    const PCCONSIGNERRef = useRef(null);
    const PCNARRATIONRef = useRef(null);
    const PCSELLERRef = useRef(null);
    const PCDPRODUCTRef = useRef(null);
    const PCDUOMRef = useRef(null);
    const PCDQUANTITYRef = useRef(null);
    const PCDRATERef = useRef(null);
    const PCDTAXABLERef = useRef(null);
    const PCDCGSTRef = useRef(null);
    const PCDSGSTRef = useRef(null);
    const PCDIGSTRef = useRef(null);
    const [product, setproduct] = useState([]);
    const [paymentmode, setpaymentmode] = useState([]);
    const [HSNData, setHSNData] = useState([]);
    const [vendor, setvendor] = useState([]);
    const [uom, setuom] = useState([]);
    // const PCSELLER = [
    //     { value: "2", label: "Select Customer" },
    //     { value: "4", label: "Apex Computers" },
    //     { value: "5", label: "Dazzle Shoes" },
    //     { value: "6", label: "Best Accessories" },
    // ];

    const isValidDate = (dateString) => {
        const regex = /^\d{4}-\d{2}-\d{2}$/; // Check if date matches the format YYYY-MM-DD
        if (!dateString || !regex.test(dateString)) return false;

        const date = new Date(dateString);
        return date instanceof Date && !isNaN(date);
    };

    const [rows, setRows] = useState([]);
    const [states, setstates] = useState([]);
    const [formData, setFormData] = useState({
        PCTRNNO: '',
        PCDATE: '',
        PCVNO: '',
        PCPOSUPPLY: '',
        PCSELLER: '',
        PCCONSIGNER: '',
        PCNARRATION: '',
        PCNATE: '',
        PCGATE: '',
        POREFF: '',
        PMODE: '',
        BranchName: '',
        IFSCCode: '',
        AccountNumber: '',
        BankName: '',
        QVADDRESS: '',
        QVEMAIL: '',
        QVCONTACT: ''
    });

    const [productData, setProductData] = useState({
        PCDPRODUCT: '',
        PRODUCTNAME: '',
        UOMTITLE: '',
        PCDUOM: '',
        PCDQUANTITY: 0,
        PCDRATE: 0,
        PCDTAXABLE: 0,
        PCDCGST: 0,
        PCDSGST: 0,
        PCDIGST: 0,
        PCDTAMT: 0,
        BATCHNO: '',
        EXPIRYDATE: '',
        ISDELETED: '',
        PCDAID: '',
        HSNCODE: '',
        PCAID: '',
    });

    useEffect(() => {
        if (pcaid) {
            const fetchMasterData = async () => {
                try {
                    const payload = {
                        pcaid: pcaid,
                        keyword: "%",
                        companyid: userdetail?.companyID || "",
                        deptid: userdetail?.departmentID || "",
                        statusid: "1",
                    };
                    const headers = {
                        "Content-Type": "application/json",
                        Accept: "*/*",
                    };
                    const response = await axios.post(
                        `${baseUrl.Url}/backend/api/GET_PChallanMaster`,
                        payload,
                        { headers }
                    );
                    if (response.status !== 200)
                        throw new Error("Failed to fetch vendor data");
                    console.log("venderos", response.data)
                    // setchallandata(response.data)
                    const Data = response.data[0];
                    setFormData({
                        PCTRNNO: Data.pctrnno,
                        PCDATE: convertToISODate(Data.pcdate),
                        PCVNO: Data.pcvno,
                        PCPOSUPPLY: Data.pcposupply,
                        PCSELLER: vendor.find(item => item.value === Data.pcseller)?.value || '',
                        PCCONSIGNER: Data.pcconsigner,
                        PCNARRATION: Data.pcnarration,
                        PCNATE: Data.pcnamt,
                        PCGATE: Data.pcgamt,
                        PVENDORNAME: Data.vendorname,
                        PCVEMAIL: Data.vendoremail,
                        PCVCONTACT: Data.vendorcontact,
                        POREFF: Data.poreff,
                        PMODE: paymentmode.find(item => item.value === Data.paymentmode)?.value || ''
                    });
                } catch (error) {
                    console.error("Error fetching vendor data:", error);
                }
            };

            const fetchDetailData = async () => {
                try {
                    const payload = {
                        pcaid: pcaid,
                        companyid: userdetail?.companyID || "",
                        deptid: userdetail?.departmentID || "",
                    };
                    const headers = {
                        "Content-Type": "application/json",
                        Accept: "*/*",
                    };
                    const response = await axios.post(
                        `${baseUrl.Url}/backend/api/GET_PChallanDetailsById`,
                        payload,
                        { headers }
                    );
                    if (response.status !== 200)
                        throw new Error("Failed to fetch vendor data");
                    console.log("venderos", response.data)
                    if (response.data.length > 0) {
                        const mappedProducts = response.data.map((item) => ({
                            PRODUCTNAME: item.productname,
                            UOMTITLE: item.uomtitle,
                            PCDPRODUCT: item.pcdproduct,
                            PCDUOM: item.pcduom,
                            PCDQUANTITY: item.pcdquantity,
                            PCDRATE: item.pcdrate,
                            PCDTAXABLE: item.pcdtaxable,
                            PCDCGST: item.pcdcgst,
                            PCDSGST: item.pcdsgst,
                            PCDIGST: item.pcdigst,
                            total: item.pcdtaxable + item.pcdcgst + item.pcdsgst + item.pcdigst,
                            PCDAID: item.pcdaid,
                            ISDELETED: item.isdeleted,
                            BATCHNO: item.batchno,
                            EXPIRYDATE: item.expirydate,
                            PCDTAMT: item.pcdtamt,
                            PCDPRODUCT_LABEL: item.productname,
                            PCDUOM_LABEL: item.uomtitle,
                            PCAID: item.pcaid
                        }));
                        const totalTaxable = mappedProducts.reduce((acc, row) => acc + parseFloat(row.PCDTAXABLE || 0), 0).toFixed(2);
                        const totalAmount = mappedProducts.reduce((acc, row) => acc + parseFloat(row.total || 0), 0).toFixed(2);

                        setFormData({
                            ...formData,
                            PCGATE: totalTaxable,
                            PCNATE: totalAmount,
                        });

                        setRows(mappedProducts);
                    }

                } catch (error) {
                    console.error("Error fetching vendor data:", error);
                }
            };
            fetchDetailData();
            fetchMasterData();
        }
    }, [pcaid]);

    useEffect(() => {
        if (formData.PCSELLER) {
            const fetchVendors = async () => {
                try {
                    const payload = {
                        pkid: formData.PCSELLER,
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
                            PCSELLER: vendor.find(item => item.value === response.data[0].pcseller)?.value || '',
                            QVAID: response.data[0].ccompanyname,
                            QVCONTACT: response.data[0].ccontactpersonmobile,
                            QVEMAIL: response.data[0].cemail,
                            QVADDRESS: states.find((state) => state.value == response.data[0].cstate)?.value || "",
                            BankName: response.data[0].cbankname,
                            AccountNumber: response.data[0].caccountnumber,
                            IFSCCode: response.data[0].cifsc,
                            BranchName: response.data[0].cbranchname
                        }));
                    }
                } catch (error) {
                    console.error("Error fetching vendor data:", error);
                }
            };

            fetchVendors();
        }

    }, [formData.PCSELLER, userdetail]);


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
        const fetchProductData = async () => {
            try {
                const payload = {
                    "ctaid": "%",
                    "companyid": userdetail?.companyID ? userdetail.companyID : "",
                    "deptid": userdetail?.departmentID ? userdetail.departmentID : ""
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
                        setHSNData(response.data);
                    })

            } catch (error) {
                console.error("Error fetching Access Right Data:", error);
            }

        };
        const fetchVendorData = async () => {
            try {
                const payload = {
                    "ctaid": "%",
                    "ctype": "3",
                    "companyid": userdetail?.companyID ? userdetail.companyID : "",
                    "deptid": userdetail?.departmentID ? userdetail.departmentID : ""
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


                        const formofvendorData = DATA
                            .map(({ ccompanyname, caid }) => ({
                                label: ccompanyname,
                                value: caid,
                            }));

                        setvendor(formofvendorData);
                    })

            } catch (error) {
                console.error("Error fetching Access Right Data:", error);
            }

        };

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
        const fetchImplicationsPayamentData = async () => {
            try {
                const response = await axios.get(
                    baseUrl.Url + "/backend/api/Implications/PAYMENT",
                    // "http://adsvr:78/api/Implications/SOLID|LIQUID|GAS"
                );

                if (response.status !== 200) throw new Error("Failed to fetch implications data");

                const data = response.data;

                // Combine all implications into one array
                const implicationsDropdown = data.map(({ iTitle, iValue }) => ({
                    label: iTitle,
                    value: iValue,
                }));

                setpaymentmode(implicationsDropdown);
            } catch (error) {
                console.error("Error fetching implications:", error);
            }
        };
        fetchImplicationsPayamentData()
        // fetchImplications();
        fetchVendorData();
        fetchProductData();
        fetchstates();
    }, []);



    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value.trimStart(),
        }));
    };


    const handleProductChange = (e) => {
        const { name, value } = e.target;
        let numericValue = parseFloat(value) || 0;

        setProductData((prevData) => {
            const updatedData = { ...prevData, [name]: numericValue };

            if (name === "PCDQUANTITY" || name === "PCDRATE") {
                const quantity = parseFloat(updatedData.PCDQUANTITY) || 0;
                const rate = parseFloat(updatedData.PCDRATE) || 0;
                updatedData.PCDTAXABLE = parseFloat((quantity * rate).toFixed(2));
            }

            updatedData.PCDTAMT = parseFloat(
                (updatedData.PCDTAXABLE +
                    (parseFloat(updatedData.PCDCGST) || 0) +
                    (parseFloat(updatedData.PCDSGST) || 0) +
                    (parseFloat(updatedData.PCDIGST) || 0)
                ).toFixed(2)
            );

            return updatedData;
        });
    };


    const handleProductChange1 = (e) => {
        const { name, value } = e.target;

        setProductData((prevData) => {
            const updatedData = { ...prevData, [name]: value };
            return updatedData;
        });
    };

    const MySwal = withReactContent(Swal);

    const handleAddProduct = async () => {

        try {
            const payload = {
                "pcaid": (pcaid == undefined || pcaid == "") ? "" : pcaid,
                "companyid": userdetail?.companyID || "",
                "deptid": userdetail?.departmentID || ""
            };

            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            const response = await axios.post(
                `${baseUrl.Url}/backend/api/SP_MeassagePChallan`,
                JSON.stringify(payload),
                { headers }
            );

            if (response.status !== 200) {
                throw new Error("Failed to Fetch Data");
            }

            const responseMessage = response.data?.[0]?.responseMessage;
            if (responseMessage === "Edit is not allowed because the next transaction has been successfully completed.") {
                await Swal.fire({
                    icon: 'warning',
                    title: 'Edit Not Allowed',
                    text: responseMessage,
                    confirmButtonText: 'OK'
                });
                return;
            }

            if (
                !productData.PCDPRODUCT ||
                !productData.PCDUOM ||
                !productData.PCDQUANTITY
            ) {
                MySwal.fire({
                    title: 'Error!',
                    text: 'Please fill in all the product fields before adding.',
                    icon: 'error',
                });
                return;
            }

            // setRows([
            //     ...rows,
            //     {
            //         ...productData,
            //         PCDPRODUCT_LABEL: product.find(item => item.value === productData.PCDPRODUCT)?.label || '',
            //         PCDUOM_LABEL: uom.find(item => item.value === productData.PCDUOM)?.label || '',
            //     }
            // ]);
            let updatedTableData;
            if (productData.PCDAID) {
                updatedTableData = rows.map((item) =>
                    item.PCDAID === productData.PCDAID ? {
                        ...item, ...productData, PCDPRODUCT_LABEL: product.find(item => item.value === productData.PCDPRODUCT)?.label || '',
                        PCDUOM_LABEL: uom.find(item => item.value === productData.PCDUOM)?.label || '',
                    } : item
                );
            } else {
                updatedTableData = [...rows, {
                    ...productData, PCDAID: ACSPLGUID.getNew(), PCDPRODUCT_LABEL: product.find(item => item.value === productData.PCDPRODUCT)?.label || '',
                    PCDUOM_LABEL: uom.find(item => item.value === productData.PCDUOM)?.label || '',
                }];
            }

            setRows(updatedTableData);

            const totalTaxable = rows.reduce((acc, row) => acc + parseFloat(row.PCDTAXABLE || 0), 0).toFixed(2);
            const totalAmount = rows.reduce((acc, row) => acc + parseFloat(row.total || 0), 0).toFixed(2);

            setFormData({
                ...formData,
                PCGATE: totalTaxable,
                PCNATE: totalAmount,
            });
            // setRows((prevRows) => {
            //     if (pcaid === "" || pcaid === null) {
            //         return [
            //             ...prevRows,
            //             {
            //                 ...productData,
            //                 PCDPRODUCT_LABEL: product.find(item => item.value === productData.PCDPRODUCT)?.label || '',
            //                 PCDUOM_LABEL: uom.find(item => item.value === productData.PCDUOM)?.label || '',
            //             }
            //         ];
            //     } else {
            //         return prevRows.map(row =>
            //             row.PCAID === pcaid
            //                 ? {
            //                     ...row,
            //                     ...productData,
            //                     PCDPRODUCT_LABEL: product.find(item => item.value === productData.PCDPRODUCT)?.label || '',
            //                     PCDUOM_LABEL: uom.find(item => item.value === productData.PCDUOM)?.label || '',
            //                 }
            //                 : row
            //         );
            //     }
            // });

            setProductData({
                PCDPRODUCT: '',
                PRODUCTNAME: '',
                UOMTITLE: '',
                PCDUOM: '',
                PCDQUANTITY: 0,
                PCDRATE: 0,
                PCDTAXABLE: 0,
                PCDCGST: 0,
                PCDSGST: 0,
                PCDIGST: 0,
                PCDTAMT: 0,
                BATCHNO: '',
                EXPIRYDATE: '',
                ISDELETED: '',
                PCDAID: '',
                HSNCODE: '',
                PCAID: '',
            });

        } catch (error) {
            console.error("Submission Error:", error);
            await Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to save data. Please try again.",
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const form = e.target.closest("form");
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        showConfirmationAlert();
    };


    const handleKeyDown = (e, nextRef) => {
        if (e.key === 'Enter' && nextRef.current) {
            nextRef.current.focus();
            e.preventDefault();
        }
    };

    const showConfirmationAlert = async () => {
        try {
            const payload = {
                "pcaid": (pcaid == undefined || pcaid == "") ? "" : pcaid,
                "companyid": userdetail?.companyID || "",
                "deptid": userdetail?.departmentID || ""
            };

            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            const response = await axios.post(
                `${baseUrl.Url}/backend/api/SP_MeassagePChallan`,
                JSON.stringify(payload),
                { headers }
            );

            if (response.status !== 200) {
                throw new Error("Failed to Fetch Data");
            }

            const responseMessage = response.data?.[0]?.responseMessage;
            if (responseMessage === "Edit is not allowed because the next transaction has been successfully completed.") {
                await Swal.fire({
                    icon: 'warning',
                    title: 'Edit Not Allowed',
                    text: responseMessage,
                    confirmButtonText: 'OK'
                });
                return;
            }
            MySwal.fire({
                title: 'तुम्हाला खात्री आहे का?',
                text: 'तुम्हाला हि डेटा जतन करायचा आहे का?',
                showCancelButton: true,
                confirmButtonColor: '#00ff00',
                confirmButtonText: 'जतन करा',
                cancelButtonColor: '#092C4C',
                cancelButtonText: 'रद्द करा',
            }).then((result) => {
                if (result.isConfirmed) {
                    handleFormSubmission();
                    handleModalConfirm();
                }
            });

        } catch (error) {
            console.error("Submission Error:", error);
            await Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to save data. Please try again.",
            });
        }


    };

    const handleModalConfirm = () => {
        console.log('Form Data:', formData);
        console.log('Rows Data:', rows);
        // setShowModal(false);
    };

    const navigate = useNavigate();
    const showExitAlert = () => {
        MySwal.fire({
            title: "तुम्हाला खात्री आहे का?",
            text: "तुम्हाला बाहेर पडायचं आहे का?",
            showCancelButton: true,
            confirmButtonColor: "#00ff00",
            confirmButtonText: "होय",
            cancelButtonColor: "#092C4C",
            cancelButtonText: "नाही",
        }).then((result) => {
            if (result.isConfirmed) {
                const modal = document.getElementById("AddPurchasechallan");
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
                        PCTRNNO: '',
                        PCDATE: '',
                        PCVNO: '',
                        PCPOSUPPLY: '',
                        PCSELLER: '',
                        PCCONSIGNER: '',
                        PCNARRATION: '',
                        PCNATE: '',
                        PCGATE: '',
                        POREFF: '',
                        PMODE: '',
                    });
                    setProductData({
                        PCDPRODUCT: '',
                        PRODUCTNAME: '',
                        UOMTITLE: '',
                        PCDUOM: '',
                        PCDQUANTITY: 0,
                        PCDRATE: 0,
                        PCDTAXABLE: 0,
                        PCDCGST: 0,
                        PCDSGST: 0,
                        PCDIGST: 0,
                        PCDTAMT: 0,
                        BATCHNO: '',
                        EXPIRYDATE: '',
                        ISDELETED: '',
                        PCDAID: '',
                        HSNCODE: '',
                        PCAID: '',
                    });
                    setRows();
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
            const filteredRows = rows.filter(row => row.ISDELETED !== 1); // Exclude deleted rows

            setFormData((prevFormData) => ({
                ...prevFormData,
                PCGATE: filteredRows
                    .reduce((acc, row) => acc + parseFloat(row.PCDTAXABLE || 0), 0)
                    .toFixed(2),
                PCNATE: filteredRows
                    .reduce((acc, row) => acc + parseFloat(row.PCDTAMT || 0), 0)
                    .toFixed(2),
            }));
        }
    }, [rows]);



    // Save button validation
    const checkFormValidity = (e) => {
        const {
            PCTRNNO,
            PCDATE,
            PCVNO,
            PCPOSUPPLY,
            PCSELLER,
            PCCONSIGNER,
            PCNARRATION,
        } = formData;

        // Check for each field and show validation errors
        if (!PCTRNNO) {
            Swal.fire({
                icon: "error",
                title: "Validation Error",
                text: "चलन क्रमांक आवश्यक आहे",
            }).then(() => {
                PCTRNNORef.current.focus();
            });
            return;
        }

        if (!PCDATE || !isValidDate(PCDATE)) {
            Swal.fire({
                icon: "error",
                title: "Validation Error",
                text: "चलन दिनांक आवश्यक आहे आणि तो वैध दिनांक असावा",
            }).then(() => {
                PCDATERef.current.focus();
            });
            return;
        }

        if (!PCVNO) {
            Swal.fire({
                icon: "error",
                title: "Validation Error",
                text: "वाहन क्रमांक आवश्यक आहे",
            }).then(() => {
                PCVNORef.current.focus();
            });
            return;
        }

        if (!PCPOSUPPLY) {
            Swal.fire({
                icon: "error",
                title: "Validation Error",
                text: "पुरवठ्याचे ठिकाण आवश्यक आहे",
            }).then(() => {
                PCPOSUPPLYRef.current.focus();
            });
            return;
        }

        if (!PCSELLER) {
            Swal.fire({
                icon: "error",
                title: "Validation Error",
                text: "पुरवठादार आवश्यक आहे",
            }).then(() => {
                PCSELLERRef.current.focus();
            });
            return;
        }

        if (!PCCONSIGNER) {
            Swal.fire({
                icon: "error",
                title: "Validation Error",
                text: "प्रेषक आवश्यक आहे",
            }).then(() => {
                PCCONSIGNERRef.current.focus();
            });
            return;
        }

        if (!PCNARRATION) {
            Swal.fire({
                icon: "error",
                title: "Validation Error",
                text: "वर्णन आवश्यक आहे",
            }).then(() => {
                PCNARRATIONRef.current.focus();
            });
            return;
        }

        if (rows.length === 0) {
            Swal.fire({
                icon: "error",
                title: "Validation Error",
                text: "जतन करण्यापूर्वी कृपया किमान एक उत्पादन जोडा.",
            });
            return;
        }
        handleSubmit(e);
    };

    const handleFormSubmission = async () => {

        try {
            const payload = {
                "caid": formData.PCSELLER,
                "ccontactpersonname": formData.QVAID,
                "ccontactpersonmobile": formData.QVCONTACT,
                "cemail": formData.QVEMAIL,
                "cstate": formData.QVADDRESS.toString(),
                "cbankname": formData.BankName,
                "caccountnumber": formData.AccountNumber,
                "cifsc": formData.IFSCCode,
                "cbranchname": formData.BranchName,
                "companyid": userdetail?.companyID || "",
                "deptid": userdetail?.departmentID || "",
            };
            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };
            const response = await axios.post(
                `${baseUrl.Url}/backend/api/SP_UpdateCustomerDetails`,
                payload,
                { headers }
            );
            if (response.status !== 200)
                throw new Error("Failed to fetch vendor data");
        } catch (error) {
            console.error("Error fetching vendor data:", error);
        }

        try {
            const payload1 = {
                "pcaid": pcaid ? pcaid : GUID,
                "pctrnno": formData.PCTRNNO,
                "pcseller": formData.PCSELLER,
                "pcconsigner": formData.PCCONSIGNER,
                "pcvno": formData.PCVNO,
                "pcposupply": formData.PCPOSUPPLY,
                "pcnarration": formData.PCNARRATION,
                "pcdate": formData.PCDATE,
                "pcnamt": formData.PCNATE,
                "pcgamt": formData.PCGATE,
                "companyid": userdetail?.companyID || "",
                "deptid": userdetail?.departmentID || "",
                "poreff": formData.POREFF ? formData.POREFF : "",
                "statusid": "1",
                "paymentmode": formData.PMODE,
            };

            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            // First API Call
            const response1 = await axios.post(baseUrl.Url + "/backend/api/AddUpdPChallanMaster", payload1, { headers });

            if (response1.status === 200) {
                // Ensure rows is an array before calling map()
                const payload2 = rows.map((row) => ({
                    "pcdaid": row.PCDAID ? row.PCDAID : ACSPLGUID.getNew(),
                    "pcaid": pcaid ? pcaid : GUID,
                    "pcdproduct": row.PCDPRODUCT,
                    "pcduom": row.PCDUOM,
                    "pcdquantity": row.PCDQUANTITY.toString(),
                    "pcdrate": parseFloat(row.PCDRATE),
                    "pcdtamt": parseFloat(row.PCDTAMT),
                    "pcdtaxable": row.PCDTAXABLE.toString(),
                    "pcdigst": parseFloat(row.PCDIGST),
                    "pcdsgst": parseFloat(row.PCDSGST),
                    "pcdcgst": parseFloat(row.PCDCGST),
                    "companyid": userdetail?.companyID || "",
                    "deptid": userdetail?.departmentID || "",
                    "isdeleted": row.ISDELETED == 1 || row.ISDELETED == true ? true : false,
                    "batchno": row.BATCHNO,
                    "expirydate": row.EXPIRYDATE
                }));

                // Second API Call
                const response2 = await axios.post(baseUrl.Url + "/backend/api/AddUpdPChallanDetails", payload2, { headers });

                if (response2.status === 200) {
                    Swal.fire({
                        icon: "success",
                        title: "Saved!",
                        text: "Data saved successfully.",
                        confirmButtonText: "OK",
                    }).then((result) => {
                        if (result.isConfirmed) {
                            const modal = document.getElementById("AddPurchasechallan");
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
                                    PCTRNNO: '',
                                    PCDATE: '',
                                    PCVNO: '',
                                    PCPOSUPPLY: '',
                                    PCSELLER: '',
                                    PCCONSIGNER: '',
                                    PCNARRATION: '',
                                    PCNATE: '',
                                    PCGATE: '',
                                    POREFF: '',
                                    PMODE: '',
                                });
                                setProductData({
                                    PCDPRODUCT: '',
                                    PRODUCTNAME: '',
                                    UOMTITLE: '',
                                    PCDUOM: '',
                                    PCDQUANTITY: 0,
                                    PCDRATE: 0,
                                    PCDTAXABLE: 0,
                                    PCDCGST: 0,
                                    PCDSGST: 0,
                                    PCDIGST: 0,
                                    PCDTAMT: 0,
                                    BATCHNO: '',
                                    EXPIRYDATE: '',
                                    ISDELETED: '',
                                    PCDAID: '',
                                    HSNCODE: '',
                                    PCAID: '',
                                });
                                setRows([]);
                            }
                            const backdrop = document.querySelector(".modal-backdrop");
                            if (backdrop) {
                                backdrop.remove();
                            }
                        }
                    });
                } else {
                    throw new Error("Failed to save product details.");
                }
            } else {
                throw new Error("Failed to save master data.");
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


    const handleDelete = async (PCDAID, index) => {
        // try {
        //     const payload = {
        //         "praid": (masterData.praid == undefined || masterData.praid == "") ? "" : masterData.praid,
        //         "companyid": userdetail?.companyID || "",
        //         "deptid": userdetail?.departmentID || ""
        //     };

        //     const headers = {
        //         "Content-Type": "application/json",
        //         Accept: "*/*",
        //     };

        //     const response = await axios.post(
        //         `${baseUrl.Url}/backend/api/SP_MeassagePRequisition`,
        //         JSON.stringify(payload),
        //         { headers }
        //     );

        //     if (response.status !== 200) {
        //         throw new Error("Failed to Fetch Data");
        //     }

        //     const responseMessage = response.data?.[0]?.responseMessage;
        //     if (responseMessage === "Edit is not allowed because the next transaction has been successfully completed.") {
        //         await Swal.fire({
        //             icon: 'warning',
        //             title: 'Edit Not Allowed',
        //             text: responseMessage,
        //             confirmButtonText: 'OK'
        //         });

        //     } else {
        //         Swal.fire({
        //             title: "Are you sure?",
        //             text: "You won't be able to revert this!",
        //             icon: "warning",
        //             showCancelButton: true,
        //             confirmButtonColor: "#d33",
        //             cancelButtonColor: "#3085d6",
        //             confirmButtonText: "Yes, delete it!",
        //             cancelButtonText: "Cancel",
        //         }).then((result) => {
        //             if (result.isConfirmed) {
        //                 setTableData((prevData) =>
        //                     prevData.map((data) =>
        //                         data.prdaid === praid ? { ...data, IsDeleted: 1 } : data
        //                     )
        //                 );

        //                 Swal.fire({
        //                     icon: "success",
        //                     title: "Deleted!",
        //                     text: "Record marked as deleted",
        //                     confirmButtonText: "OK",
        //                 });
        //             }
        //         });
        //     }
        // } catch (error) {
        //     console.error("Submission Error:", error);
        //     await Swal.fire({
        //         icon: "error",
        //         title: "Error",
        //         text: "Failed to save data. Please try again.",
        //     });
        // }

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
                setRows((prevData) => {
                    const updatedRows = prevData.map((data, idx) =>
                        (PCDAID && data.PCDAID === PCDAID) || (PCDAID === "" && idx === index)
                            ? { ...data, ISDELETED: 1 }
                            : data
                    );

                    const filteredRows = updatedRows.filter(row => row.ISDELETED == 0 || row.ISDELETED == false);

                    const totalTaxable = filteredRows
                        .reduce((acc, row) => acc + parseFloat(row.PCDTAXABLE || 0), 0)
                        .toFixed(2);

                    const totalAmount = filteredRows
                        .reduce((acc, row) => acc + parseFloat(row.total || 0), 0)
                        .toFixed(2);

                    setFormData((prevFormData) => ({
                        ...prevFormData,
                        PCGATE: totalTaxable,
                        PCNATE: totalAmount,
                    }));

                    return updatedRows;
                });

                Swal.fire({
                    icon: "success",
                    title: "Deleted!",
                    text: "Record marked as deleted",
                    confirmButtonText: "OK",
                });
            }

        });

        // const newRows = [...rows];
        // newRows.splice(index, 1);
        // setRows(newRows);
    };

    const handleEdit = (PCDAID, index) => {
        let item;

        if (PCDAID) {
            item = rows.find((data) => data.PCDAID == PCDAID);
        } else if (index !== null && index >= 0 && index < rows.length) {
            item = rows[index];
        }

        if (!item) return;

        setProductData({
            PCDPRODUCT: product.find(p => p.value === item.PCDPRODUCT)?.value || '',
            PRODUCTNAME: item.PRODUCTNAME,
            UOMTITLE: item.UOMTITLE,
            PCDUOM: uom.find(u => u.value === item.PCDUOM)?.value || '',
            PCDQUANTITY: item.PCDQUANTITY,
            PCDRATE: item.PCDRATE,
            PCDTAXABLE: item.PCDTAXABLE,
            PCDCGST: item.PCDCGST,
            PCDSGST: item.PCDSGST,
            PCDIGST: item.PCDIGST,
            PCDTAMT: (parseFloat(item.PCDTAXABLE) || 0) +
                (parseFloat(item.PCDCGST) || 0) +
                (parseFloat(item.PCDSGST) || 0) +
                (parseFloat(item.PCDIGST) || 0),
            BATCHNO: item.BATCHNO,
            EXPIRYDATE: convertToISODate(item.EXPIRYDATE),
            ISDELETED: item.ISDELETED,
            PCDAID: item.PCDAID,
            HSNCODE: item.HSNCODE,
            PCAID: item.HSNCODE,
        });



    };



    const OnProductChange = (selectedOption) => {
        const selectedProduct = HSNData.find(p => p.paid === selectedOption.value);
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

    return (
        <div
            className="modal fade"
            id="AddPurchasechallan"
            tabIndex={-1}
            aria-labelledby="exampleModalFullscreenLabel"
            aria-hidden="true"
        >
            <div className="modal-dialog modal-fullscreen">
                <div className="modal-content">
                    {/* <div className="modal-header">
                        <h4
                            className="modal-title"
                            id="exampleModalFullscreenLabel"
                        >
                            Full screen modal
                        </h4>
                        <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                        />
                    </div> */}
                    <div className="modal-body">
                        <div className="content">
                            <div className="modal-header border-0 custom-modal-header">
                                <div className="page-title">
                                    <h4>नवीन खरेदी चलन जोडा</h4>
                                </div>
                                <div className="page-btn">
                                    <Link className="btn btn-secondary"
                                        aria-label="Close"
                                        //  data-bs-dismiss="modal"
                                        onClick={showExitAlert}
                                    >
                                        <ArrowLeft className="me-2" />
                                        अनुक्रमणिकेकडे परत
                                    </Link>
                                </div>
                            </div>
                            <div className="modal-body custom-modal-body">
                                <form onSubmit={handleSubmit}>
                                    {/* Input Fields for Challan No, Vehicle No, etc. */}
                                    <div className="row">
                                        <div className="col-lg-3 col-md-6 col-sm-12">
                                            <div className="mb-3 add-product form-label">
                                                <label className="form-label text-dark required">चलन क्रमांक</label>
                                                <input
                                                    ref={PCTRNNORef}
                                                    type="text"
                                                    className="form-control border"
                                                    name="PCTRNNO"
                                                    value={formData.PCTRNNO}
                                                    onChange={handleChange}
                                                    // onKeyDown={(e) => handleKeyDown(e, PCDATERef)}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="col-lg-3 col-sm-6 col-12">
                                            <div className="input-blocks">
                                                <label className="form-label text-dark required">खरेदी तारीख</label>
                                                <div className="input-groupicon calender-input">
                                                    <div className="info-img" />
                                                    <input
                                                        ref={PCDATERef}
                                                        type="date"
                                                        className="form-control"
                                                        value={formData.PCDATE}
                                                        placeholder="Choose Date"
                                                        onChange={(e) =>
                                                            setFormData({
                                                                ...formData,
                                                                PCDATE: e.target.value,
                                                            })
                                                        }
                                                        required
                                                        onKeyDown={(e) => handleKeyDown(e, PCVNORef)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-3 col-md-4 col-sm-12">
                                            <div className="mb-3 add-product form-label">
                                                <label className="form-label text-dark required">वाहन क्रमांक</label>
                                                <input
                                                    ref={PCVNORef}
                                                    type="text"
                                                    className="form-control border"
                                                    name="PCVNO"
                                                    value={formData.PCVNO}
                                                    onChange={handleChange}
                                                    required
                                                // onKeyDown={(e) => handleKeyDown(e, PCPOSUPPLYRef)}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-lg-3 col-md-4 col-sm-12">
                                            <div className="mb-3 add-product form-label">
                                                <label className="form-label text-dark required">पुरवठ्याचे ठिकाण</label>
                                                <Select
                                                    ref={PCPOSUPPLYRef}
                                                    classNamePrefix="react-select"
                                                    options={states}
                                                    placeholder="Choose"
                                                    value={states.find((option) => option.value === formData.PCPOSUPPLY) || null}
                                                    onChange={(selectedOption) => {
                                                        setFormData((prevData) => ({
                                                            ...prevData,
                                                            PCPOSUPPLY: selectedOption ? selectedOption.value : '',
                                                        }));
                                                    }}
                                                    required
                                                    openMenuOnFocus={true}
                                                />
                                                {/* <input
                                                    ref={PCPOSUPPLYRef}
                                                    type="text"
                                                    className="form-control border"
                                                    name="PCPOSUPPLY"
                                                    onChange={handleChange}
                                                    value={formData.PCPOSUPPLY}
                                                    onKeyDown={(e) => handleKeyDown(e, PCSELLERRef)}
                                                    // onKeyDownCapture={(e) => handleKeyDown(e, PCPOSUPPLYRef) }
                                                    required
                                                /> */}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Supplier and Consigner Selects */}
                                    <div className="row">
                                        <div className="col-lg-5 col-md-4 col-sm-12">
                                            {/* <div className="input-blocks add-product">
                                                <label className="form-label text-dark required">Vendor name</label>
                                                <Select
                                                    ref={PCSELLERRef}
                                                    classNamePrefix="react-select"
                                                    options={vendor}
                                                    placeholder="Choose"
                                                    value={vendor.find((option) => option.value == formData.PCSELLER) || null}
                                                    onChange={(selectedOption) => {
                                                        setFormData((prevData) => ({
                                                            ...prevData,
                                                            PCSELLER: selectedOption ? selectedOption.value : '',
                                                        }));
                                                    }}
                                                    required
                                                    openMenuOnFocus={true}
                                                />
                                            </div> */}
                                        </div>

                                        <div className="row">
                                            {/* Payment Mode - 4 columns */}
                                            <div className='col-lg-4 col-sm-12'>
                                                <label className="form-label text-dark required">भरणा पद्धती</label>
                                                <Select
                                                    classNamePrefix="react-select"
                                                    options={paymentmode}
                                                    placeholder="Choose"
                                                    value={paymentmode.find((option) => option.value === formData.PMODE) || null}
                                                    onChange={(selectedOption) => {
                                                        setFormData((prevData) => ({
                                                            ...prevData,
                                                            PMODE: selectedOption ? selectedOption.value : '',
                                                        }));
                                                    }}
                                                    openMenuOnFocus={true}
                                                />
                                            </div>

                                            {/* Consigner - Remaining 8 columns */}
                                            <div className='col-lg-8 col-sm-12'>
                                                <label className="form-label text-dark">प्रेषक</label>
                                                <input
                                                    ref={PCCONSIGNERRef}
                                                    type="text"
                                                    className="form-control"
                                                    name="PCCONSIGNER"
                                                    onChange={handleChange}
                                                    value={formData.PCCONSIGNER}
                                                    required
                                                />
                                            </div>
                                        </div>



                                        {/* <div className="col-lg-5 col-md-4 col-sm-12">
                                            <div className="input-blocks add-product">
                                                <label className="form-label text-dark">Consigner</label>
                                                <input
                                                    ref={PCCONSIGNERRef}
                                                    type="text"
                                                    className="form-control border"
                                                    name="PCCONSIGNER"
                                                    onChange={handleChange}
                                                    value={formData.PCCONSIGNER}
                                                    // onKeyDownCapture={(e) => handleKeyDown(e, PCPOSUPPLYRef) }
                                                    required
                                                />
                                                {/* <Select
                                                    ref={PCCONSIGNERRef}
                                                    classNamePrefix="react-select"
                                                    options={PCSELLER}
                                                    placeholder="Choose"
                                                    value={PCSELLER.find((option) => option.value === formData.PCCONSIGNER) || null}
                                                    onChange={(selectedOption) => {
                                                        setFormData((prevData) => ({
                                                            ...prevData,
                                                            PCCONSIGNER: selectedOption ? selectedOption.value : '',
                                                        }));
                                                    }}
                                                    required
                                                /> 
                                            </div>
                                        </div> */}
                                    </div>


                                    <div className="row mb-3 mt-3">
                                        <div className="addproduct-icon">
                                            <h5>
                                                <span>पुरवठादाराची माहिती :</span>
                                            </h5>
                                        </div>
                                        <div className="col-lg-3 col-md-3 col-12">
                                            <div className="form-label">
                                                <label className='form-label required'>विक्रेत्याचे नाव:</label>
                                                <Select
                                                    ref={PCSELLERRef}
                                                    classNamePrefix="react-select"
                                                    options={vendor}
                                                    placeholder="Choose"
                                                    value={vendor.find((option) => option.value == formData.PCSELLER) || null}
                                                    onChange={(selectedOption) => {
                                                        setFormData((prevData) => ({
                                                            ...prevData,
                                                            PCSELLER: selectedOption ? selectedOption.value : '',
                                                        }));
                                                    }}
                                                    required
                                                    openMenuOnFocus={true}
                                                />
                                            </div>
                                        </div>

                                        <div className="col-lg-3 col-md-3 col-12">
                                            <div className="form-label">
                                                <label>पुरवठादाराचा संपर्क:</label>
                                                <input
                                                    type="number"
                                                    name="QVCONTACT"
                                                    className="form-control"
                                                    value={formData.QVCONTACT}
                                                    onChange={handleChange}

                                                />
                                            </div>
                                        </div>

                                        <div className="col-lg-3 col-md-3 col-12">
                                            <div className="form-label">
                                                <label>पुरवठादाराचा ईमेल:</label>
                                                <input
                                                    type="email"
                                                    name="QVEMAIL"
                                                    className="form-control"
                                                    value={formData.QVEMAIL}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>


                                        <div className="col-lg-3 col-md-3 col-12">
                                            <div className="form-label">
                                                <label>पुरवठादाराची राज्य:</label>
                                                <Select
                                                    classNamePrefix="react-select"
                                                    options={states}
                                                    openMenuOnFocus={true}
                                                    value={vendor.find((option) => option.value == formData.QVADDRESS) || null}
                                                    onChange={(selectedOption) => {
                                                        setFormData((prevData) => ({
                                                            ...prevData,
                                                            QVADDRESS: selectedOption ? selectedOption.value : '',
                                                        }));
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="accordion-card-one accordion" id="accordionExample">
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
                                                            <span>बँक तपशील :</span>
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
                                                        <div className="col-lg-3 col-sm-6 col-12 mb-3">
                                                            <label className="form-label">बँकेचे नाव:</label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                name="BankName"
                                                                value={formData.BankName}
                                                                onChange={handleChange}
                                                            />
                                                        </div>
                                                        <div className="col-lg-3 col-sm-6 col-12 mb-3">
                                                            <label className="form-label">खाते क्रमांक:</label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                name="AccountNumber"
                                                                value={formData.AccountNumber}
                                                                onChange={handleChange}
                                                            />
                                                        </div>

                                                        <div className="col-lg-3 col-sm-6 col-12 mb-3">
                                                            <label className="form-label">आयएफएससी कोड:</label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                name="IFSCCode"
                                                                value={formData.IFSCCode}
                                                                onChange={handleChange}
                                                            />
                                                        </div>

                                                        <div className="col-lg-3 col-sm-6 col-12 mb-3">
                                                            <label className="form-label">शाखेचे नाव:</label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                name="BranchName"
                                                                value={formData.BranchName}
                                                                onChange={handleChange}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-12">
                                            <div className="form-label add-product form-label">
                                                <label className="form-label text-dark required">वर्णन</label>
                                                <textarea
                                                    ref={PCNARRATIONRef}
                                                    rows={2}
                                                    cols={2}
                                                    className="form-control border text-secondary"
                                                    name="PCNARRATION"
                                                    onChange={handleChange}
                                                    value={formData.PCNARRATION}
                                                    required
                                                    onKeyDown={(e) => handleKeyDown(e, PCDPRODUCTRef)}
                                                // onKeyDownCapture={(e) => handleKeyDown(e, PCDPRODUCTRef)}
                                                />
                                            </div>
                                        </div>
                                    </div>


                                    {/* Table for Products */}
                                    <div className="border p-3 rounded shadow-sm mb-4 mt-5">
                                        <div className="row">
                                            <div className="col-lg-12">
                                                <div className="modal-body-table">
                                                    <div className="table-responsive">
                                                        <table className="table datanew">
                                                            <table className="table table-bordered">
                                                                <thead className="thead-dark">
                                                                    <tr>
                                                                        <th className="col-3">उत्पादन</th>
                                                                        <th className="col-1">माप युनिट</th>
                                                                        <th className="col-1">HSN कोड</th>
                                                                        <th className="col-1">प्रमाण</th>
                                                                        <th className="col-1">दर</th>
                                                                        <th className="col-1">करयोग्य मूल्य</th>
                                                                        <th className="col-1">CGST</th>
                                                                        <th className="col-1">SGST</th>
                                                                        <th className="col-1">IGST</th>
                                                                        <th className="col-1">एकूण</th>
                                                                        <th className="col-1">क्रिया</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {rows && rows
                                                                        .filter((row) => row.ISDELETED == 0) // Filter out deleted rows
                                                                        .map((row, index) => (
                                                                            <tr key={index}>
                                                                                <td>{row.PCDPRODUCT_LABEL}</td> {/* Displaying label */}
                                                                                <td>{row.PCDUOM_LABEL}</td> {/* Displaying label */}
                                                                                <td>{row.HSNCODE}</td>
                                                                                <td>{row.PCDQUANTITY}</td>
                                                                                <td>{row.PCDRATE}</td>
                                                                                <td>{row.PCDTAXABLE}</td>
                                                                                <td>{row.PCDCGST}</td>
                                                                                <td>{row.PCDSGST}</td>
                                                                                <td>{row.PCDIGST}</td>
                                                                                <td>{row.PCDTAMT}</td>
                                                                                <td className="col-1 text-center">
                                                                                    <div className="edit-delete-action">
                                                                                        <Link
                                                                                            to="#"
                                                                                            onClick={() => handleEdit(row.PCDAID, index)}
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
                                                                                            onClick={() => handleDelete(row.PCDAID, index)}
                                                                                        >
                                                                                            <Trash2 className="feather-trash-2" />
                                                                                        </Link>
                                                                                    </div>
                                                                                </td>
                                                                            </tr>
                                                                        ))}
                                                                </tbody>

                                                                <tfoot>

                                                                    <td colSpan="4"></td> {/* Empty cells for alignment */}
                                                                    <td><strong>एकूण करयोग्य:</strong></td>
                                                                    <td>
                                                                        <input
                                                                            type="text"
                                                                            className="form-control form-control-sm border-0 border-bottom border-warning"
                                                                            name="PCGATE"
                                                                            value={formData.PCGATE || '0'}
                                                                            readOnly
                                                                        />
                                                                    </td>
                                                                    <td colSpan="2"></td>
                                                                    <td><strong>एकूण:</strong></td>
                                                                    <td>
                                                                        <input
                                                                            type="text"
                                                                            className="form-control form-control-sm border-0 border-bottom border-warning"
                                                                            name="PCNATE"
                                                                            value={formData.PCNATE || '0'}
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

                                        {/* Add Product Inputs */}
                                        <div className="row mt-5">
                                            <div className="col-lg-7 col-sm-12 col-12">
                                                <div className="mb-3 add-product form-label">
                                                    <label className="form-label text-dark required">उत्पादन / सेवा</label>
                                                    <Select
                                                        ref={PCDPRODUCTRef}
                                                        classNamePrefix="react-select"
                                                        options={product}
                                                        value={product.find((option) => option.value === productData.PCDPRODUCT) || null}
                                                        onChange={(selectedOption) => {
                                                            setProductData((prevData) => ({
                                                                ...prevData,
                                                                PCDPRODUCT: selectedOption ? selectedOption.value : '',
                                                            }));
                                                            OnProductChange(selectedOption);
                                                        }}
                                                        openMenuOnFocus={true}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-lg-2 col-sm-6 col-12">
                                                <div className="mb-2 add-product form-label">
                                                    <label className="form-label text-dark required">HSN कोड</label>
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        name="HSNCODE"
                                                        value={productData.HSNCODE}
                                                        readOnly

                                                    />
                                                </div>
                                            </div>
                                            <div className="col-lg-3 col-sm-6 col-12">
                                                <div className="mb-2 add-product form-label">
                                                    <label className="form-label text-dark required">माप युनिट</label>
                                                    <Select
                                                        ref={PCDUOMRef}
                                                        classNamePrefix="react-select"
                                                        options={uom}
                                                        value={uom.find((option) => option.value === productData.PCDUOM) || null}
                                                        onChange={(selectedOption) => {
                                                            setProductData((prevData) => ({
                                                                ...prevData,
                                                                PCDUOM: selectedOption ? selectedOption.value : '',
                                                            }));
                                                        }}
                                                        openMenuOnFocus={true}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Product Details for quantity, rate, taxable value, etc. */}
                                        <div className="row">
                                            <div className="col-lg-3 col-md-6 col-sm-12">
                                                <div className="mb-3 add-product form-label">
                                                    <label className="form-label text-dark required">प्रमाण</label>
                                                    <input
                                                        ref={PCDQUANTITYRef}
                                                        type="number"
                                                        className="form-control"
                                                        name="PCDQUANTITY"
                                                        value={productData.PCDQUANTITY}
                                                        onChange={handleProductChange}
                                                        onKeyDown={(e) => handleKeyDown(e, PCDRATERef)}
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-lg-3 col-md-6 col-sm-12">
                                                <div className="mb-3 add-product form-label">
                                                    <label className="form-label text-dark">दर</label>
                                                    <input
                                                        ref={PCDRATERef}
                                                        type="number"
                                                        className="form-control"
                                                        name="PCDRATE"
                                                        value={productData.PCDRATE}
                                                        onChange={handleProductChange}
                                                        onKeyDown={(e) => handleKeyDown(e, PCDTAXABLERef)}
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-lg-3 col-md-6 col-sm-12">
                                                <div className="mb-3 add-product form-label">
                                                    <label className="form-label text-dark">करयोग्य मूल्य</label>
                                                    <input
                                                        ref={PCDTAXABLERef}
                                                        type="number"
                                                        className="form-control"
                                                        name="PCDTAXABLE"
                                                        value={productData.PCDTAXABLE}
                                                        readOnly
                                                        // onKeyDown={(e) => handleKeyDown(e, PCDCGSTRef)}
                                                        onKeyDown={(e) => handleKeyDown(e, PCDCGSTRef)}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* More inputs for CGST, SGST, IGST, Total */}
                                        <div className="row">
                                            <div className="col-lg-2 col-md-6 col-sm-12">
                                                <div className="mb-3 add-product form-label">
                                                    <label className="form-label text-dark">CGST</label>
                                                    <input
                                                        ref={PCDCGSTRef}
                                                        type="number"
                                                        className="form-control"
                                                        name="PCDCGST"
                                                        value={productData.PCDCGST}
                                                        onChange={handleProductChange}
                                                        onKeyDown={(e) => handleKeyDown(e, PCDSGSTRef)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-lg-2 col-md-6 col-sm-12">
                                                <div className="mb-3 add-product form-label">
                                                    <label className="form-label text-dark">SGST</label>
                                                    <input
                                                        ref={PCDSGSTRef}
                                                        type="number"
                                                        className="form-control"
                                                        name="PCDSGST"
                                                        value={productData.PCDSGST}
                                                        onChange={handleProductChange}
                                                        onKeyDown={(e) => handleKeyDown(e, PCDIGSTRef)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-lg-2 col-md-6 col-sm-12">
                                                <div className="mb-3 add-product form-label">
                                                    <label className="form-label text-dark">IGST</label>
                                                    <input
                                                        ref={PCDIGSTRef}
                                                        type="number"
                                                        className="form-control"
                                                        name="PCDIGST"
                                                        value={productData.PCDIGST}
                                                        onChange={handleProductChange}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-lg-2 col-md-6 col-sm-12">
                                                <div className="mb-3 add-product form-label">
                                                    <label className="form-label text-dark">एकूण</label>
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        name="PCDTAMT"
                                                        value={productData.PCDTAMT}
                                                        readOnly
                                                    //onkeyDown={(e) => handleKeyDown(e, PCDTAXABLERef)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-lg-2 col-md-6 col-sm-12">
                                                <div className="mb-3 add-product form-label">
                                                    <label className="form-label text-dark">बैच क्रमांक</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="BATCHNO"
                                                        value={productData.BATCHNO}
                                                        onChange={handleProductChange1}

                                                    //onkeyDown={(e) => handleKeyDown(e, PCDTAXABLERef)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-lg-2 col-md-6 col-sm-12">
                                                <div className="mb-3 add-product form-label">
                                                    <label className="form-label text-dark">एकूण</label>
                                                    <input
                                                        type="date"
                                                        className="form-control"
                                                        name="EXPIRYDATE"
                                                        value={productData.EXPIRYDATE}
                                                        onChange={handleProductChange1}
                                                    //onkeyDown={(e) => handleKeyDown(e, PCDTAXABLERef)}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Add and Save buttons */}
                                        <div className="row">
                                            <div className="col-lg-12">
                                                <div className="modal-footer-btn">
                                                    <div className="col-lg-12 mt-3">
                                                        <button
                                                            type="button"
                                                            className="btn btn-primary"
                                                            onClick={handleAddProduct}
                                                        >
                                                            उत्पादन जोडा
                                                        </button>
                                                    </div>
                                                </div>
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
                                                बाहेर पडा
                                            </button>
                                            <button
                                                type="submit"
                                                className="btn btn-submit"
                                            >
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
    )
}

export default AddPurchasechallan
