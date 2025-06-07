import { useNavigate } from 'react-router-dom';
import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
// import { useLocation } from 'react-router-dom';
import { ArrowLeft, Trash2, Edit } from "feather-icons-react/build/IconComponents";
// import { ACSPLGUID, baseUrl, convertToISODate } from "../../core/json/custom";
import { ACSPLGUID, baseUrl, convertToISODate } from '../../core/json/custom';
import axios from "axios";
// import { all_routes } from "../../../Router/all_routes";
import { getUserData } from '../../Context/UserData';
function AddDirectsalechallan({ SCAID, sqamaid }) {
    const { userdetail } = getUserData();
    console.log(SCAID, "scaid")
    // const route = all_routes;
    // const location = useLocation();
    // const { SCAID } = location.state || {};
    // const { SCDAID } = location.state || {};
    // const GUAID = ACSPLGUID.getNew()
    const GUID = ACSPLGUID.getNew();
    const SCTRNNORef = useRef(null);
    const SCDATERef = useRef(null);
    const SCVNORef = useRef(null);
    const SCPOSUPPLYRef = useRef(null);
    const SCCONSIGNERRef = useRef(null);
    const SCNARRATIONRef = useRef(null);
    const SCSELLERRef = useRef(null);
    const SCDPRODUCTRef = useRef(null);
    const SHSNref = useRef(null);
    const SCDUOMRef = useRef(null);
    const SCDQUANTITYRef = useRef(null);
    const SCDRATERef = useRef(null);
    const SCDTAXABLERef = useRef(null);
    const SCDCGSTRef = useRef(null);
    const SCDSGSTRef = useRef(null);
    const SCDIGSTRef = useRef(null);
    const [product, setproduct] = useState([]);
    const [uom, setuom] = useState([]);
    const [states, setstates] = useState([]);
    const [transpoter, settranspoter] = useState([]);
    const [customer, setcustomer] = useState([]);
    const MySwal = withReactContent(Swal);
    const [productData, setproductData] = useState([]);//HSN data set
    const [paymentmode, setpaymentmode] = useState([]);//payment dropdown

    useEffect(() => {
        if (sqamaid) {
            // setShowForm(true);
            const fetchData = async () => {
                try {
                    const payload = {
                        sqamaid: sqamaid,
                        companyid: "",
                        deptid: "",
                    };
                    const headers = {
                        "Content-Type": "application/json",
                        Accept: "*/*",
                    };
                    const response = await axios.post(
                        `${baseUrl.Url}/backend/api/GET_SQuatationDataByID`,
                        payload,
                        { headers }
                    );

                    if (response.status !== 200)
                        throw new Error("Failed to fetch  get SRequisition Data By ID data");

                    console.log("Reqnodata", response.data);
                    // setProductData
                    if (response.data.length > 0) {
                        const mappedProducts = response.data.map((item) => ({
                            SCDPRODUCT: item.sqproduct,
                            CAID: "",
                            SCDUOM: item.squom,
                            SHSN: item.hsncode,
                            SCDQUANTITY: item.sqquantity,
                            SCDRATE: item.sqrate,
                            SCDTAMT: item.sqtamt,
                            SCDIGST: item.sqigst,
                            SCDSGST: item.sqsgst,
                            SCDCGST: item.sqcgst,
                            SCDTAXABLE: item.sqtaxbaleamount,
                            UOMTITLE: item.uomtitle,
                            PRODUCTNAME: item.productname,


                        }));
                        setRows(mappedProducts);

                        // const totalTaxable = mappedProducts
                        //     .reduce((acc, row) => acc + parseFloat(row.SCDTAXABLE || 0), 0)
                        //     .toFixed(2);
                        // const totalAmount = mappedProducts
                        //     .reduce((acc, row) => acc + parseFloat(row.SQTAMT || 0), 0)
                        //     .toFixed(2);

                        setFormData((prevState) => ({
                            ...prevState,
                            SCSELLERid: response.data[0].sqcaid,
                            qno: response.data[0].sqno,
                            SCCONSIGNERid: response.data[0].sqtransportid,
                            CUSTOMERNAME: response.data[0].vendorname,
                            SCCONSIGNER: response.data[0].transportname,

                        }));
                    }
                } catch (error) {
                    console.error("Error fetching vendor data:", error);
                }
            };

            fetchData();
        }
    }, [sqamaid]);
    const isValidDate = (dateString) => {
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateString || !regex.test(dateString)) return false;

        const date = new Date(dateString);
        return date instanceof Date && !isNaN(date);
    };

    const [rows, setRows] = useState([]);
    const [formData, setFormData] = useState({
        SCAID: '',
        SCTRNNO: '',
        SCSELLER: '',
        SCPOSUPPLY: '',
        SCCONSIGNER: '',
        SCVNO: '',
        SCDATE: '',
        SCNAMT: '',
        SCGAMT: '',
        PAYMENTMODE: '',
        CUSTOMERNAME: '',
        SCNARRATION: '',
        qno: '',
    });

    const [DetailData, setDetailData] = useState({
        SCDAID: '',
        SCAID: '',
        SCDPRODUCT: '',
        SCDUOM: '',
        SCDQUANTITY: '',
        SCDRATE: 0,
        SHSN: '',
        SCDTAMT: 0,
        SCDTAXABLE: 0,
        SCDIGST: 0,
        SCDSGST: 0,
        SCDCGST: 0,
        SBATCHNO: '',
        SEXPIRYDATE: '',
        IsDeleted: 0,
        UOMTITLE: '',
    });

    useEffect(() => {
        //transpoter api dropdown
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
                    })

            } catch (error) {
                console.error("Error fetching vendor data:", error);
            }
        };
        //place of supply dropdown
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
        //product dropdown
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
                        setproductData(response.data)
                    })

            } catch (error) {
                console.error("Error fetching Access Right Data:", error);
            }

        };
        //uom dropdown
        const fetchImplications = async () => {
            try {
                const response = await axios.get(
                    baseUrl.Url + "/backend/api/Implications/SOLID|LIQUID|GAS|",

                );

                if (response.status !== 200) throw new Error("Failed to fetch implications data");

                const data = response.data;
                const implicationsDropdown = data.map(({ iTitle, iValue }) => ({
                    label: iTitle,
                    value: iValue,
                }));

                setuom(implicationsDropdown);
            } catch (error) {
                console.error("Error fetching implications:", error);
            }
        };

        //paymenntmode dropdwon
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



    //Edit code
    useEffect(() => {
        if (!SCAID) return;
        const fetchMasterData = async () => {
            try {
                const payload1 = {
                    scaid: SCAID,
                    companyid: userdetail?.companyID || "",
                    deptid: userdetail?.departmentID || "",
                };

                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*"
                };

                const response = await axios.post(
                    baseUrl.Url + "/backend/api/GET_SChallanMaster",
                    payload1,
                    { headers }
                );

                if (response.status !== 200) throw new Error("Failed to fetch data");
                let apiData = response.data[0];
                setFormData((prev) => ({
                    ...prev,
                    SCTRNNO: apiData.sctrnno,
                    SCVNO: apiData.scvno,
                    SCDATE: convertToISODate(apiData.scdate),
                    SCPOSUPPLY: apiData.scposupply,
                    SCCONSIGNER: apiData.scconsigner,
                    SCSELLER: apiData.scseller,
                }));

                console.log("Sale Bill Master Data:", apiData);
            } catch (error) {
                console.error("Error in Master API Call:", error);
            }
        };

        const fetchDetailsData = async () => {
            try {

                const payload = {
                    scaid: SCAID,
                    companyid: userdetail?.companyID || "",
                    deptid: userdetail?.departmentID || "",
                };

                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*"
                };

                const response = await axios.post(
                    baseUrl.Url + "/backend/api/GET_SChallanDetailsById",
                    payload,
                    { headers }
                );

                if (response.status !== 200) throw new Error("Failed to fetch details data");

                console.log("Quotation Detail Data:", response.data);

                if (response.data.length > 0) {
                    const mappedProducts = response.data.map((item) => ({
                        SCDAID: item.scdaid,
                        PRODUCTNAME: item.productname,
                        UOMTITLE: item.uomtitle,
                        SCDPRODUCT: item.scdproduct,
                        SCDUOM: item.scduom,
                        SHSN: item.hsncode,
                        SCDQUANTITY: item.scdquantity,
                        SCDRATE: item.scdrate,
                        SCDTAXABLE: item.scdtaxable,
                        SCDCGST: item.scdcgst,
                        SCDSGST: item.scdsgst,
                        SCDIGST: item.scdigst,
                        SCDTAMT: item.scdtamt,
                        SBATCHNO: item.batchno || "",
                        SEXPIRYDATE: item.expirydate || "",
                        IsDeleted: item.isdeleted,
                    }));

                    setRows(mappedProducts);
                }
            } catch (error) {
                console.error("Error fetching details data:", error);
            }
        };

        fetchMasterData();
        fetchDetailsData();
    }, [SCAID]);



    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value.trimStart(),
        }));
    };

    const handleProductChange = (e) => {
        const { name, value } = e.target;

        setDetailData((prevData) => {
            const updatedData = { ...prevData, [name]: parseFloat(value) || 0 };
            if (name === "SCDQUANTITY" || name === "SCDRATE") {
                updatedData.SCDTAXABLE = updatedData.SCDQUANTITY * updatedData.SCDRATE;
            }
            if (name === "SCDCGST" || name === "SCDSGST" || name === "SCDIGST") {
                updatedData.SCDTAMT =
                    updatedData.SCDTAXABLE + updatedData.SCDCGST + updatedData.SCDSGST + updatedData.SCDIGST;
            }
            return updatedData;
        });
    };


    const handleAddProduct = () => {
        if (!DetailData.SCDPRODUCT || !DetailData.SCDUOM || !DetailData.SCDQUANTITY) {
            MySwal.fire({
                title: "Error!",
                text: "Please fill in all the product fields before adding.",
                icon: "error",
            });
            return;
        }

        const selectedProduct = product.find((item) => item.value === DetailData.SCDPRODUCT);
        const selectedUOM = uom.find((item) => item.value === DetailData.SCDUOM);

        const newProduct = {
            ...DetailData,
            PRODUCTNAME: selectedProduct?.label || "", // Store product label
            UOMTITLE: selectedUOM?.label || "", // Store UOM label (Fix applied here)
            SCDTAXABLE: DetailData.SCDQUANTITY * DetailData.SCDRATE,
            SCDTAMT: (DetailData.SCDQUANTITY * DetailData.SCDRATE) + DetailData.SCDCGST + DetailData.SCDSGST + DetailData.SCDIGST,
        };

        setRows((prevRows) => {
            const existingIndex = prevRows.findIndex((row) => row.SCDAID === DetailData.SCDAID);

            if (existingIndex !== -1) {
                const updatedRows = [...prevRows];
                updatedRows[existingIndex] = newProduct;
                return updatedRows;
            } else {
                return [...prevRows, { ...newProduct, SCDAID: ACSPLGUID.getNew() }];
            }
        });

        setDetailData({
            SCDAID: "",
            SCDPRODUCT: "",
            SCDUOM: "",
            UOMTITLE: "", // Reset label after adding
            SHSN: "",
            SCDQUANTITY: "",
            SCDRATE: 0,
            SCDTAXABLE: 0,
            SCDCGST: 0,
            SCDSGST: 0,
            SCDIGST: 0,
            SCDTAMT: 0,
            SBATCHNO: "",
            SEXPIRYDATE: "",
            IsDeleted: 0,
        });
    };
    useEffect(() => {
        console.log("Updated Table Data:", rows);
    }, [rows]);


    const handleSubmit = (e) => {
        e.preventDefault();
        const form = e.target.closest("form");

        if (rows.length === 0) {
            MySwal.fire({
                title: "Error!",
                text: "Please add at least one product before saving.",
                icon: "error",
            });
            return;
        }
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        showConfirmationAlert();
    };

    const showConfirmationAlert = () => {
        MySwal.fire({
            title: 'Are you sure?',
            text: 'Do you want to save this data?',
            showCancelButton: true,
            confirmButtonColor: '#00ff00',
            confirmButtonText: 'SAVE',
            cancelButtonColor: '#092C4C',
            cancelButtonText: 'CANCEL',
        }).then((result) => {
            if (result.isConfirmed) {
                handleFormSubmission();
                handleModalConfirm();
            }
        });
    };

    const handleModalConfirm = () => {
        console.log('Form Data:', formData);
        console.log('Rows Data:', rows);
    };

    const navigate = useNavigate();
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
                const modal = document.querySelector('.modal.show');
                if (modal) {
                    const closeButton = modal.querySelector('[data-bs-dismiss="modal"]');
                    closeButton?.click();
                }
                setTimeout(() => {
                    console.log("exit ");

                }, 300);
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
        if (rows.length > 0) {
            setFormData((prevFormData) => ({
                ...prevFormData,
                SCGAMT: rows.reduce((acc, row) => acc + parseFloat(row.SCDTAXABLE || 0), 0).toFixed(2),
                SCNAMT: rows.reduce((acc, row) => acc + parseFloat(row.SCDTAMT || 0), 0).toFixed(2),
            }));
        }
    }, [rows]);

    const checkFormValidity = (e) => {
        const { SCTRNNO, SCDATE, SCVNO, SCPOSUPPLY, SCSELLER, SCCONSIGNER, SCNARRATION, } = formData;
        if (!SCTRNNO) {
            Swal.fire({
                icon: "error",
                title: "Validation Error",
                text: "Challan No is required",
            }).then(() => {
                SCTRNNORef.current.focus();
            });
            return;
        }

        if (!SCDATE || !isValidDate(SCDATE)) {
            Swal.fire({
                icon: "error",
                title: "Validation Error",
                text: "Challan Date is required and must be a valid date.",
            }).then(() => {
                SCDATERef.current.focus();
            });
            return;
        }

        if (!SCVNO) {
            Swal.fire({
                icon: "error",
                title: "Validation Error",
                text: "Vehicle No is required",
            }).then(() => {
                SCVNORef.current.focus();
            });
            return;
        }

        if (!SCPOSUPPLY) {
            Swal.fire({
                icon: "error",
                title: "Validation Error",
                text: "Place of Supply is required",
            }).then(() => {
                SCPOSUPPLYRef.current.focus();
            });
            return;
        }

        if (!SCSELLER) {
            Swal.fire({
                icon: "error",
                title: "Validation Error",
                text: "Supplier is required",
            }).then(() => {
                SCSELLERRef.current.focus();
            });
            return;
        }

        if (!SCCONSIGNER) {
            Swal.fire({
                icon: "error",
                title: "Validation Error",
                text: "Consigner is required",
            }).then(() => {
                SCCONSIGNERRef.current.focus();
            });
            return;
        }

        if (!SCNARRATION) {
            Swal.fire({
                icon: "error",
                title: "Validation Error",
                text: "Narration is required",
            }).then(() => {
                SCNARRATIONRef.current.focus();
            });
            return;
        }

        if (rows.length === 0) {
            Swal.fire({
                icon: "error",
                title: "Validation Error",
                text: "Please add at least one product before saving.",
            });
            return;
        }
        handleSubmit(e);
    };

    const handleFormSubmission = async () => {
        try {
            const payload1 = {
                "scaid": SCAID ? SCAID : GUID,
                "sctrnno": formData.SCTRNNO,
                "scseller": formData.SCSELLER,
                "scconsigner": formData.SCCONSIGNER,
                "scvno": formData.SCVNO,
                "scposupply": formData.SCPOSUPPLY,
                "scnarration": formData.SCNARRATION,
                "scdate": formData.SCDATE,
                "scnamt": formData.SCNAMT,
                "scgamt": formData.SCGAMT,
                "soreff": "",
                "companyid": userdetail?.companyID || "",
                "deptid": userdetail?.departmentID || "",
                "paymentmode": formData.PAYMENTMODE,
            }
            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            axios({
                method: "POST",
                url: baseUrl.Url + "/backend/api/SP_AddUpdSChallanMaster",
                data: JSON.stringify(payload1),
                headers: headers,
            })
            console.log("payload1", payload1);

            Swal.fire({
                icon: "success",
                title: "Saved!",
                text: "Data saved successfully.",
                confirmButtonText: "OK",
            });

            const payload2 = rows.map((row) => ({
                "scdaid": row.SCDAID ? row.SCDAID : ACSPLGUID.getNew(),
                "scaid": SCAID ? SCAID : GUID,
                "scdproduct": row.SCDPRODUCT,
                "hsncode": row.SHSN,
                "scduom": row.SCDUOM,
                "scdquantity": row.SCDQUANTITY.toString(),
                "scdrate": row.SCDRATE,
                "scdtamt": row.SCDTAMT,
                "scdtaxable": row.SCDTAXABLE.toString(),
                "scdigst": row.SCDIGST,
                "scdsgst": row.SCDSGST,
                "scdcgst": row.SCDCGST,
                "batchno": row.SBATCHNO,
                "expirydate": row.SEXPIRYDATE,
                "companyid": userdetail?.companyID || "",
                "deptid": userdetail?.departmentID || "",
                "isDeleted": row.IsDeleted === 1 || row.IsDeleted === true ? true : false,
            }));

            const response = await axios({
                method: "POST",
                url: baseUrl.Url + "/backend/api/SP_AddUpdSChallanDetails",
                data: JSON.stringify(payload2),
                headers: headers,
            });

            console.log("Payload Sent:", payload2);
            console.log("Response Received:", response.data);
            Swal.fire({
                icon: "success",
                title: "Saved!",
                text: "Data saved successfully.",
                confirmButtonText: "OK",
            }).then(() => {

                const modal = document.querySelector('.modal.show');
                if (modal) {
                    const closeButton = modal.querySelector('[data-bs-dismiss="modal"]');
                    closeButton?.click();
                }
            });
            // navigate(route.HSNMaster);
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
        setDetailData(prevData => ({
            ...prevData,
            [field]: selectedOption ? selectedOption.value : "",
        }));

        if (field == 'SCDPRODUCT') {
            const selectedProduct = productData.find(p => p.paid === selectedOption.value);
            if (selectedProduct) {
                setDetailData(prevData => ({
                    ...prevData,
                    SHSN: selectedProduct.hsncode,
                }));
            }
        }

    };

    const handleEdit = (scdaid) => {
        console.log("edittttt")
        const filteredProducts = rows.filter((row) => row.SCDAID === scdaid)[0];

        setDetailData({
            SCDAID: filteredProducts.SCDAID,
            PRODUCTNAME: filteredProducts.PRODUCTNAME,
            UOMTITLE: filteredProducts.UOMTITLE,
            SCDPRODUCT: product.find((row) => row.value === filteredProducts.SCDPRODUCT)?.value || "",
            SHSN: filteredProducts.SHSN,
            SCDUOM: uom.find((row) => row.value === filteredProducts.SCDUOM)?.value || "",
            SCDQUANTITY: filteredProducts.SCDQUANTITY,
            SCDRATE: filteredProducts.SCDRATE,
            SCDTAXABLE: filteredProducts.SCDTAXABLE,
            SCDCGST: filteredProducts.SCDCGST,
            SCDSGST: filteredProducts.SCDSGST,
            SCDIGST: filteredProducts.SCDIGST,
            SCDTAMT: filteredProducts.SCDTAMT,
            SBATCHNO: filteredProducts.SBATCHNO || "",
            SEXPIRYDATE: filteredProducts.SEXPIRYDATE || "",
            IsDeleted: 0,
        });
    };

    const handleDelete = (scdaid) => {
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
                setRows((prevRows) => {
                    const updatedRows = prevRows.map((row) =>
                        row.SCDAID === scdaid ? { ...row, IsDeleted: 1 } : row
                    );

                    console.log("Updated Rows:", updatedRows);

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
    };


    const handleKeyDown = (e, nextRef) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (nextRef && nextRef.current) {
                nextRef.current.focus();
            }
        }
    };

    return (
        <div
            className="modal fade"
            id="AddDirectsalechallan"
            tabIndex={-1}
            aria-labelledby="exampleModalFullscreenLabel"
            aria-hidden="true"
            style={{ display: "none" }}
        >
            <div className="modal-dialog modal-fullscreen">
                <div className="modal-content">
                    <div className="page-wrapper-new p-0">
                        <div className="content">
                            <div className="modal-header border-0 custom-modal-header modlheadr">
                                <div className="page-title ps-3">
                                    <h4> Direct Sale challan</h4>
                                </div>
                                <div className="page-btn">
                                    <Link
                                        className="btn btn-secondary"
                                        aria-label="Close"
                                        data-bs-dismiss="modal"
                                        onClick={() => {
                                            // **Form Reset**
                                            setFormData({
                                                SCTRNNO: "",
                                                SCDATE: "",
                                                SCVNO: "",
                                                SCSELLER: "",
                                                SCCONSIGNER: "",
                                                SCPOSUPPLY: "",
                                                SCNARRATION: "",
                                            });

                                            setRows([]); // **Table Rows Reset**

                                            // **Modal Close**
                                            const modal = document.querySelector('.modal.show');
                                            if (modal) {
                                                const closeButton = modal.querySelector('[data-bs-dismiss="modal"]');
                                                closeButton?.click();
                                            }
                                        }}
                                    >
                                        <ArrowLeft className="me-2" />
                                        Back to index
                                    </Link>
                                </div>


                            </div>
                            <div className="modal-body custom-modal-body pt-0 pb-0" style={{
                                overflow: "hidden",
                            }}>
                                <form onSubmit={handleSubmit}>
                                    <div className="row custom-background">
                                        <div className="col-lg-2 col-md-6 col-sm-12">
                                            <div className="mb-0 add-product form-label">
                                                <label className='required'>Challan No</label>
                                                <input
                                                    ref={SCTRNNORef}
                                                    type="text"
                                                    className="form-control border"
                                                    name="SCTRNNO"
                                                    value={formData.SCTRNNO}
                                                    onChange={handleChange}
                                                    required
                                                    onKeyDown={(e) => handleKeyDown(e, SCDATERef)} // Move focus to Date input
                                                />
                                            </div>
                                        </div>
                                        <div className="col-lg-2 col-sm-6 col-12">
                                            <div className=" mb-0 add-product form-label">
                                                <label className='required'> challan Date</label>
                                                <div >
                                                    <input
                                                        ref={SCDATERef}
                                                        type="date"
                                                        className="form-control"
                                                        value={formData.SCDATE}
                                                        placeholder="Choose Date"
                                                        onChange={(e) =>
                                                            setFormData({
                                                                ...formData,
                                                                SCDATE: e.target.value,
                                                            })
                                                        }
                                                        onKeyDown={(e) => handleKeyDown(e, SCVNORef)}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-2 col-md-4 col-sm-12">
                                            <div className="mb-0 add-product form-label">
                                                <label >Vehicle No</label>
                                                <input
                                                    ref={SCVNORef}
                                                    type="text"
                                                    className="form-control border"
                                                    name="SCVNO"
                                                    value={formData.SCVNO}
                                                    onChange={handleChange}
                                                    onKeyDown={(e) => handleKeyDown(e, SCPOSUPPLYRef)}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="col-lg-2 col-md-4 col-sm-12">
                                            <div className="mb-0 add-product form-label">
                                                <label className='required'>Place of supply</label>
                                                <Select
                                                    ref={SCPOSUPPLYRef}
                                                    classNamePrefix="react-select"
                                                    options={states}
                                                    placeholder="Choose"
                                                    value={states.find((option) => option.value === formData.SCPOSUPPLY) || null}
                                                    onChange={(selectedOption) => {
                                                        setFormData((prevData) => ({
                                                            ...prevData,
                                                            SCPOSUPPLY: selectedOption ? selectedOption.value : '',
                                                        }));
                                                    }}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="col-lg-4 col-md-4 col-sm-12">
                                            <div className="mb-0 add-product form-label">
                                                <label className='required'>Transpoter</label>
                                                <Select
                                                    classNamePrefix="react-select"
                                                    options={transpoter}
                                                    placeholder="Choose"
                                                    value={transpoter.find((option) => option.value === formData.SCCONSIGNER) || null}
                                                    onChange={(selectedOption) => {
                                                        setFormData((prevData) => ({
                                                            ...prevData,
                                                            SCCONSIGNER: selectedOption ? selectedOption.value : '',
                                                        }));
                                                    }}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row custom-background">
                                        <div className="col-lg-4 col-md-4 col-sm-12">
                                            <div className="mb-0 add-product form-label">
                                                <label className='required'>Customer name</label>
                                                <Select
                                                    classNamePrefix="react-select"
                                                    options={customer}
                                                    placeholder="Choose"
                                                    value={customer.find((option) => option.value === formData.SCSELLER) || null}
                                                    onChange={(selectedOption) => {
                                                        setFormData((prevData) => ({
                                                            ...prevData,
                                                            SCSELLER: selectedOption ? selectedOption.value : '',
                                                        }));
                                                    }}
                                                    required
                                                />

                                            </div>
                                        </div>
                                        <div className="col-lg-2 col-md-4 col-sm-12">
                                            <div className="mb-0 add-product form-label">
                                                <label>Payment Mode</label>
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

                                        <div className="col-6">
                                            <div className="mb-0 add-product form-label">
                                                <label >Narration</label>
                                                <textarea
                                                    ref={SCNARRATIONRef}
                                                    rows={1}
                                                    cols={1}
                                                    className="form-control border text-secondary"
                                                    name="SCNARRATION"
                                                    onChange={handleChange}
                                                    onKeyDown={(e) => handleKeyDown(e, SCDPRODUCTRef)}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Table for Products */}
                                    <div className="border p-3 rounded shadow-sm mb-4 mt-4">
                                        <div className="row mt-1">
                                            <div className="col-lg-4 col-sm-6 col-12">
                                                <div className="mb-0 add-product form-label">
                                                    <label className='required'>Product</label>
                                                    <Select
                                                        ref={SCDPRODUCTRef}
                                                        classNamePrefix="react-select"
                                                        options={product}
                                                        value={product.find(option => option.value === DetailData.SCDPRODUCT) || null}
                                                        onChange={(selectedOption) => handleDetailDropdownChange(selectedOption, "SCDPRODUCT")}
                                                        onKeyDown={(e) => handleKeyDown(e, SCDPRODUCTRef)}
                                                        styles={{
                                                            menu: (base) => ({
                                                                ...base,
                                                                zIndex: 1050,
                                                            }),
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-lg-1 col-md-6 col-sm-12">
                                                <div className="mb-0 add-product form-label">
                                                    <label>HSN Code</label>
                                                    <input
                                                        ref={SHSNref}
                                                        type="text"
                                                        className="form-control"
                                                        value={DetailData.SHSN || ""}
                                                        readOnly
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-lg-2 col-sm-6 col-12">
                                                <div className="mb-0 add-product form-label">
                                                    <label>Unit of Measurement</label>
                                                    <Select
                                                        ref={SCDUOMRef}
                                                        classNamePrefix="react-select"
                                                        options={uom}
                                                        value={uom.find((option) => option.value === DetailData.SCDUOM) || null}
                                                        onChange={(selectedOption) => {
                                                            setDetailData((prevData) => ({
                                                                ...prevData,
                                                                SCDUOM: selectedOption ? selectedOption.value : "",
                                                                UOMTITLE: selectedOption ? selectedOption.label : "", // Store label as well
                                                            }));
                                                        }}
                                                        styles={{
                                                            menu: (base) => ({
                                                                ...base,
                                                                zIndex: 1050,
                                                            }),
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-lg-1 col-md-6 col-sm-12">
                                                <div className="mb-0 add-product form-label">
                                                    <label>Quantity</label>
                                                    <input
                                                        ref={SCDQUANTITYRef}
                                                        type="number"
                                                        className="form-control"
                                                        name="SCDQUANTITY"
                                                        value={DetailData.SCDQUANTITY}
                                                        onChange={handleProductChange}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-lg-2 col-md-6 col-sm-12">
                                                <div className="mb-0  add-product form-label">
                                                    <label>Rate</label>
                                                    <input
                                                        ref={SCDRATERef}
                                                        type="number"
                                                        className="form-control"
                                                        name="SCDRATE"
                                                        value={DetailData.SCDRATE}
                                                        onChange={handleProductChange}
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-lg-2 col-md-6 col-sm-12">
                                                <div className="mb-0  add-product form-label">
                                                    <label>Amount</label>
                                                    <input
                                                        ref={SCDTAXABLERef}
                                                        type="number"
                                                        className="form-control"
                                                        name="SCDTAXABLE"
                                                        value={DetailData.SCDTAXABLE}
                                                        readOnly
                                                    />
                                                </div>
                                            </div>

                                            <div className="row">
                                                <div className="col-lg-1 col-md-6 col-sm-12">
                                                    <div className="mb-0 add-product form-label">
                                                        <label>CGST</label>
                                                        <input
                                                            ref={SCDCGSTRef}
                                                            type="number"
                                                            className="form-control"
                                                            name="SCDCGST"
                                                            value={DetailData.SCDCGST}
                                                            onChange={handleProductChange}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-1 col-md-6 col-sm-12">
                                                    <div className="mb-0  add-product form-label">
                                                        <label>SGST</label>
                                                        <input
                                                            ref={SCDSGSTRef}
                                                            type="number"
                                                            className="form-control"
                                                            name="SCDSGST"
                                                            value={DetailData.SCDSGST}
                                                            onChange={handleProductChange}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-2 col-md-6 col-sm-12">
                                                    <div className="mb-0  add-product form-label">
                                                        <label>IGST</label>
                                                        <input
                                                            ref={SCDIGSTRef}
                                                            type="number"
                                                            className="form-control"
                                                            name="SCDIGST"
                                                            value={DetailData.SCDIGST}
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
                                                            value={DetailData.SCDTAMT}

                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-lg-2 col-md-6 col-sm-12">
                                                    <div className="mb-0 add-product form-label">
                                                        <label>Batch No</label>
                                                        <input
                                                            type="text"
                                                            className="form-control border"
                                                            name="SBATCHNO"
                                                            value={DetailData.SBATCHNO}
                                                            onChange={(e) =>
                                                                setDetailData({
                                                                    ...DetailData,
                                                                    SBATCHNO: e.target.value,
                                                                })
                                                            }
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-lg-2 col-md-6 col-sm-12">
                                                    <div className="mb-0 add-product form-label">
                                                        <label>Expairy Date</label>
                                                        <input
                                                            type="date"
                                                            className="form-control"
                                                            value={DetailData.SEXPIRYDATE}
                                                            placeholder="Choose Date"
                                                            onChange={(e) =>
                                                                setDetailData({
                                                                    ...DetailData,
                                                                    SEXPIRYDATE: e.target.value,
                                                                })
                                                            }
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-lg-2 col-md-6 col-sm-12 mt-3">
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

                                        <div className="row mt-4">
                                            <div className="col-lg-12">
                                                <div className="modal-body-table">
                                                    <div className="table-responsive" style={{ height: "calc(60vh - 120px)" }}>
                                                        <table className="table datanew">
                                                            <table className="table table-bordered" style={{ tableLayout: "fixed" }}>
                                                                <thead className="thead-dark"
                                                                    style={{
                                                                        tablelayout: 'fixed',
                                                                        position: 'sticky',
                                                                        top: 0,
                                                                        zIndex: 1
                                                                    }}>
                                                                    <tr>
                                                                        <th className="col-3">Product</th>
                                                                        <th className="col-1">HSN</th>
                                                                        <th className="col-1">UOM</th>
                                                                        <th className="col-1">Batch No</th>
                                                                        <th className="col-1">Ex.Date</th>
                                                                        <th className="col-1">Quantity</th>
                                                                        <th className="col-1">Rate</th>
                                                                        <th className="col-1">Taxable T.</th>
                                                                        <th className="col-1">CGST</th>
                                                                        <th className="col-1">SGST</th>
                                                                        <th className="col-1">IGST</th>
                                                                        <th className="col-1">Total</th>
                                                                        <th className="col-1">Action</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {rows.filter((row) => row.IsDeleted == 0).length > 0 ? (
                                                                        rows
                                                                            .filter((row) => row.IsDeleted == 0)
                                                                            .map((row, index) => (
                                                                                <tr key={row.SCDAID || index}>
                                                                                    <td>{row.PRODUCTNAME}</td>
                                                                                    <td>{row.SHSN}</td>
                                                                                    <td>{row.UOMTITLE}</td> {/* Use UOM label here */}
                                                                                    <td>{row.SBATCHNO || '-'}</td>
                                                                                    <td>{row.SEXPIRYDATE || '-'}</td>
                                                                                    <td>{row.SCDQUANTITY}</td>
                                                                                    <td>{row.SCDRATE}</td>
                                                                                    <td>{row.SCDTAXABLE}</td>
                                                                                    <td>{row.SCDCGST}</td>
                                                                                    <td>{row.SCDSGST}</td>
                                                                                    <td>{row.SCDIGST}</td>
                                                                                    <td>{row.SCDTAMT}</td>
                                                                                    <td>
                                                                                        <Link
                                                                                            to="#"
                                                                                            onClick={() => handleEdit(row.SCDAID)}
                                                                                            className="me-2 p-1"
                                                                                            style={{ color: 'lightblue' }}
                                                                                        >
                                                                                            <Edit className="feather-edit" />
                                                                                        </Link>
                                                                                        <Link
                                                                                            className="confirm-text p-2"
                                                                                            to="#"
                                                                                            onClick={() => handleDelete(row.SCDAID)}
                                                                                        >
                                                                                            <Trash2 className="feather-trash-2 text-danger" />
                                                                                        </Link>
                                                                                    </td>
                                                                                </tr>
                                                                            ))
                                                                    ) : (
                                                                        <tr>
                                                                            {/* <td colSpan="13" className="text-center">No Data Available</td> */}
                                                                        </tr>
                                                                    )}
                                                                </tbody>

                                                                <tfoot>
                                                                    <td colSpan="6"></td>
                                                                    <td><strong>Total Taxable:</strong></td>
                                                                    <td>
                                                                        <input
                                                                            type="text"
                                                                            className="form-control form-control-sm border-0 border-bottom border-warning"
                                                                            name="SCGAMT"
                                                                            value={formData.SCGAMT || '0'}
                                                                            readOnly
                                                                        />
                                                                    </td>
                                                                    <td colSpan="2"></td>
                                                                    <td><strong>Total:</strong></td>
                                                                    <td>
                                                                        <input
                                                                            type="text"
                                                                            className="form-control form-control-sm border-0 border-bottom border-warning"
                                                                            name="SCNAMT"
                                                                            value={formData.SCNAMT || '0'}
                                                                            readOnly
                                                                        />
                                                                    </td>
                                                                    <td></td>
                                                                    <td></td>
                                                                    <td></td>
                                                                    <td></td>
                                                                </tfoot>
                                                            </table>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-lg-12">
                                        <div className="text-end">
                                            <button
                                                type="button"
                                                className="btn btn-cancel me-2"
                                                onClick={showExitAlert} // Call the confirmation function
                                            >
                                                Exit
                                            </button>

                                            <button
                                                type="submit"
                                                className="btn btn-submit"
                                                onClick={handleSubmit}
                                            >
                                                Save
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

export default AddDirectsalechallan;

