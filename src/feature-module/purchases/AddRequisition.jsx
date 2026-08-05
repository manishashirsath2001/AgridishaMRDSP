import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Select from "react-select";
import { all_routes } from "../../Router/all_routes";
import Addunits from "../../core/modals/inventory/addunits";

import AddBrand from "../../core/modals/addbrand";
import {
    ArrowLeft,
    ChevronDown,
    ChevronUp,
    Info,
    Trash2,
    Edit,
} from "feather-icons-react/build/IconComponents";
import { useDispatch, useSelector } from "react-redux";
import { setToogleHeader } from "../../core/redux/action";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { ACSPLGUID, baseUrl, convertToISODate } from "../../core/json/custom";
import axios from 'axios';
import { getUserData } from "../../Context/UserData";

function AddRequisition() {
    const { isAuthenticated, userdetail } = getUserData();
    const navigate = useNavigate();
    const route = all_routes;
    const dispatch = useDispatch();
    const data = useSelector((state) => state.toggle_header);
    const renderCollapseTooltip = (props) => (<Tooltip id="refresh-tooltip" {...props}> Collapse</Tooltip>);
    const GUID = ACSPLGUID.getNew();
    const location = useLocation();
    const { PRAID, ID } = location.state || {};
    console.log('primaryKey', PRAID, ID)
    const [category, setcategory] = useState([]);
    const [product, setproduct] = useState([]);
    const [productData, setproductData] = useState([]);
    const [vendor, setvendor] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [uom, setuom] = useState([]);
    if (isAuthenticated == true) {
        console.log("user", userdetail);
        console.log("getUserData", getUserData);
    }
    const [UnitData, setUnitData] = useState([]);

    const [masterData, setMasterData] = useState({
        requisitionnumber: "",
        requisitiondate: new Date().toISOString().split('T')[0],
        enquirynumber: "",
        category: [],
        vendor: [],
        narration: "",
        meetingdate: "",
        expecteddate: "",
        termcondition: "",
        praid: PRAID || "",
    });

    const [formData, setFormData] = useState({
        prdaid: "",
        productname: "",
        uomtitle: "",
        product: "",
        description: "",
        quantity: "",
        uom: "",
        IsDeleted: 0,
        phsn: '',
        basequantity: 0,
    });


    useEffect(() => {
        const fetchCategoryData = async () => {
            try {
                const payload = {
                    "companyid": userdetail?.companyID ? userdetail.companyID : "",
                    "deptid": userdetail?.departmentID ? userdetail.departmentID : ""
                }
                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };

                axios({
                    method: "POST",
                    url: baseUrl.Url + "/backend/api/GET_Category",
                    data: JSON.stringify(payload),
                    headers: headers,
                })
                    .then((response) => {
                        if (response.status != 200) throw new Error("Failed to Fetching Data");
                        const DATA = response.data;
                        const formofcategoryata = DATA
                            .map(({ ctname, ctaid }) => ({
                                label: ctname,
                                value: ctaid,
                            }));
                        setcategory(formofcategoryata);


                        const selectedCategories = formData.category
                            .split(",")
                            .map((id) => category.find((cat) => cat.value === id))
                            .filter(Boolean);
                        setMasterData((prevData) => ({
                            ...prevData,
                            category: selectedCategories,
                        }));
                    })

            } catch (error) {
                console.error("Error fetching Access Right Data:", error);
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
                        setproductData(response.data)
                    })

            } catch (error) {
                console.error("Error fetching Access Right Data:", error);
            }

        };
        const fetchVendorData = async () => {
            try {
                const payload = {
                    "ctaid": "%",
                    "companyid": userdetail?.companyID ? userdetail.companyID : "",
                    "deptid": userdetail?.departmentID ? userdetail.departmentID : "",
                    "ctype": '3'
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

                        const selectedVendors = formData.vendor
                            .split(",")
                            .map((id) => vendor.find((vendor) => vendor.value === id))
                            .filter(Boolean);

                        setMasterData((prevData) => ({
                            ...prevData,
                            vendor: selectedVendors,
                        }));
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

        // fetchImplications();
        const fetchUnitData = async () => {
            try {
                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };
                const response = await axios.post(
                    `${baseUrl.Url}/backend/api/GET_UnitMasterData`,
                    { headers }
                );
                if (response.status !== 200)
                    throw new Error("Failed to fetch vendor data");
                console.log("requisition setails", response.data)
                setUnitData(response.data);
            } catch (error) {
                console.error("Error fetching vendor data:", error);
            }
        };
        fetchUnitData();
        fetchVendorData();
        fetchProductData();
        fetchCategoryData();
    }, []);

    useEffect(() => {
        if (PRAID) {
            try {
                const payload = {
                    "praid": PRAID,
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
                    url: baseUrl.Url + "/backend/api/GET_PRequisitionMaster",
                    data: JSON.stringify(payload),
                    headers: headers,
                })
                    .then((response) => {
                        if (response.status != 200) throw new Error("Failed to Fetching Data");
                        const DATA = response.data[0];
                        setMasterData((prevData) => ({
                            ...prevData,
                            requisitionnumber: DATA.prno,
                            requisitiondate: convertToISODate(DATA.prqdate),
                            enquirynumber: DATA.preqno,
                            category: DATA.prcategory,
                            vendor: DATA.prvandorid,
                            narration: DATA.prnarration,
                            meetingdate: convertToISODate(DATA.prmdate),
                            expecteddate: convertToISODate(DATA.prexpcdate),
                            termcondition: DATA.prtermandcondition,
                        }));
                    })
            } catch (error) {
                console.error("Error fetching Access Right Data:", error);
            }

            try {
                const payload = {
                    "praid": PRAID,
                    "companyid": userdetail?.companyID ? userdetail.companyID : "",
                    "deptid": userdetail?.departmentID ? userdetail.departmentID : ""
                }
                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };

                axios({
                    method: "POST",
                    url: baseUrl.Url + "/backend/api/GET_PRequisitionDetailData",
                    data: JSON.stringify(payload),
                    headers: headers,
                })
                    .then((response) => {
                        if (response.status != 200) throw new Error("Failed to Fetching Data");
                        const mappedProducts = response.data.map((item) => ({
                            prdaid: item.prdaid,
                            productname: item.productname,
                            uomtitle: item.uomtitle,
                            product: item.prdproduct,
                            description: item.prddescription,
                            quantity: item.prdquantity,
                            basequantity: item.prbaseqty,
                            uom: item.prduom,
                            IsDeleted: item.isdeleted,
                            phsn: item.hsncode,
                        }));
                        // setFormData(mappedProducts);
                        setTableData(mappedProducts)
                    })
            } catch (error) {
                console.error("Error fetching Access Right Data:", error);
            }
        }
    }, [PRAID]);



    const handleMasterInputChange = (e) => {
        const { name, value } = e.target;
        setMasterData({
            ...masterData,
            [name]: value
        });
    };

    const handleMasterDropdownChange = (selectedOptions, field) => {
        const values = Array.isArray(selectedOptions)
            ? selectedOptions.map(option => option.value)
            : selectedOptions ? [selectedOptions.value] : [];

        setMasterData(prevData => ({
            ...prevData,
            [field]: values,
        }));
        if (field == "vendor") {
            const VENDORID = selectedOptions.map(obj => `${obj.value}`).join(",");
            console.log(VENDORID);
            setMasterData(prevData => ({
                ...prevData,
                [field]: VENDORID,
            }));
        }
        if (field == "category") {
            const CTAID = selectedOptions.map(obj => `${obj.value}`).join(",");
            console.log(CTAID);
            setMasterData(prevData => ({
                ...prevData,
                [field]: CTAID,
            }));
            try {
                const payload = {
                    "ctaid": CTAID,
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
                    })

            } catch (error) {
                console.error("Error fetching Access Right Data:", error);
            }
            try {
                const payload = {
                    "ctaid": CTAID,
                    "companyid": userdetail?.companyID ? userdetail.companyID : "",
                    "deptid": userdetail?.departmentID ? userdetail.departmentID : "",
                    "ctype": '3',
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
        }
    };


    const handleDetailInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleDetailDropdownChange = (selectedOption, field) => {
        setFormData(prevData => ({
            ...prevData,
            [field]: selectedOption ? selectedOption.value : "",
        }));

        if (field == 'product') {
            const selectedProduct = productData.find(p => p.paid === selectedOption.value);
            if (selectedProduct) {
                setFormData(prevData => ({
                    ...prevData,
                    phsn: selectedProduct.hsncode,
                }));
            }



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

        if (field == 'uom') {
            const product = productData ? productData.find(data => data.paid === formData.product) : null;
            const unitData = UnitData ? UnitData.find(data => data.tofsale === product?.psales) : null;


            let quantityFactor = 1;
            if (unitData) {
                switch (selectedOption.value) {
                    case '0': quantityFactor = unitData?.quintal || 1; break;
                    case '1': quantityFactor = unitData?.kilograms || 1; break;
                    case '2': quantityFactor = unitData?.grams || 1; break;
                    case '3': quantityFactor = unitData?.tonne || 1; break;
                    case '4': quantityFactor = unitData?.liter || 1; break;
                    case '5': quantityFactor = unitData?.mililiter || 1; break;
                    case '6': quantityFactor = unitData?.kilograms || 1; break;
                    case '7': quantityFactor = unitData?.liter || 1; break;
                    case '8': quantityFactor = unitData?.unitsale || 1; break;
                    default: quantityFactor = 1;
                }
            }


            setFormData(prevData => ({
                ...prevData,
                basequantity: quantityFactor * parseFloat(formData.quantity || 0)
            }));

        }



    };

    // const handleDetailDropdownChange = (selectedOption, field) => {
    //     setFormData(prevData => {
    //         let updatedData = {
    //             ...prevData,
    //             [field]: selectedOption ? selectedOption.value : ""
    //         };

    //         if (field === 'product' && selectedOption) {
    //             const selectedProduct = product.find(p => p.value === selectedOption.value);
    //             if (selectedProduct) {
    //                 updatedData.phsn = selectedProduct.hsncode;
    //             }
    //         }

    //     });
    // };


    // const addRecord = (e) => {
    //     e.preventDefault();
    //     if (!formData.product) {
    //         Swal.fire({
    //             icon: "error",
    //             title: "Validation Error of Product",
    //             text: "Product field is required",
    //         });
    //         return;
    //     }
    //     if (!formData.description || formData.description.trim() === "") {
    //         Swal.fire({
    //             icon: "error",
    //             title: "Validation Error of Product Description",
    //             text: "Please enter the Product Description, remove space from start",
    //         });
    //         return;
    //     }
    //     if (!formData.quantity || !/^\d+$/.test(formData.quantity)) {
    //         Swal.fire({
    //             icon: "error",
    //             title: "Validation Error of Quantity",
    //             text: "Please enter the Quantity, only digits, remove space from start and end",
    //         });
    //         return;
    //     }
    //     if (!formData.uom) {
    //         Swal.fire({
    //             icon: "error",
    //             title: "Validation Error of UOM",
    //             text: "Please select UOM",
    //         });
    //         return;
    //     }

    //     let updatedTableData;

    //     if (formData.prdaid) {
    //         updatedTableData = tableData.map((item) =>
    //             item.prdaid === formData.prdaid ? { ...item, ...formData } : item
    //         );
    //     } else {
    //         updatedTableData = [...tableData, { ...formData, prdaid: ACSPLGUID.getNew() }];
    //     }

    //     setTableData(updatedTableData);

    //     Swal.fire({
    //         icon: "success",
    //         title: formData.prdaid ? "Updated!" : "Saved!",
    //         text: formData.prdaid
    //             ? "Record updated successfully!"
    //             : "Data added to table successfully!",
    //         confirmButtonText: "OK",
    //     });

    //     // Reset formData
    //     setFormData({
    //         prdaid: "",
    //         productname: "",
    //         uomtitle: "",
    //         product: "",
    //         description: "",
    //         quantity: "",
    //         uom: "",
    //         IsDeleted: 0,
    //     });

    //     console.log("addrow", formData)
    // };
    const addRecord = (e) => {
        try {
            const payload = {
                "praid": (masterData.praid == undefined || masterData.praid == "") ? "" : masterData.praid,
                "companyid": userdetail?.companyID ? userdetail.companyID : "",
                "deptid": userdetail?.departmentID ? userdetail.departmentID : ""
            }
            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            axios({
                method: "POST",
                url: baseUrl.Url + "/backend/api/SP_MeassagePRequisition",
                data: JSON.stringify(payload),
                headers: headers,
            })
                .then((response) => {
                    if (response.status !== 200) {
                        throw new Error("Failed to Fetch Data");
                    }
                    if (response.data[0].responseMessage === "Edit is not allowed because the next transaction has been successfully completed.") {
                        Swal.fire({
                            icon: 'warning',
                            title: 'Edit Not Allowed',
                            text: response.data[0].responseMessage,
                            confirmButtonText: 'OK'
                        });
                    } else {
                        e.preventDefault();

                        if (!formData.product) {
                            Swal.fire({ icon: "error", title: "Validation Error", text: "Product field is required" });
                            return;
                        }
                        if (!formData.description || formData.description.trim() === "") {
                            Swal.fire({ icon: "error", title: "Validation Error", text: "Enter Product Description" });
                            return;
                        }
                        if (!formData.quantity || !/^\d+$/.test(formData.quantity)) {
                            Swal.fire({ icon: "error", title: "Validation Error", text: "Enter a valid numeric Quantity" });
                            return;
                        }
                        if (!formData.uom) {
                            Swal.fire({ icon: "error", title: "Validation Error", text: "Please select UOM" });
                            return;
                        }

                        let updatedTableData;
                        if (formData.prdaid) {
                            updatedTableData = tableData.map((item) =>
                                item.prdaid === formData.prdaid ? { ...item, ...formData } : item
                            );
                        } else {
                            updatedTableData = [...tableData, { ...formData, prdaid: ACSPLGUID.getNew() }];
                        }

                        setTableData(updatedTableData);

                        Swal.fire({
                            icon: "success",
                            title: formData.prdaid ? "Updated!" : "Saved!",
                            text: formData.prdaid ? "Record updated successfully!" : "Data added successfully!",
                            confirmButtonText: "OK",
                        });

                        setFormData({
                            prdaid: "",
                            productname: "",
                            uomtitle: "",
                            product: "",
                            description: "",
                            basequantity: 0,
                            quantity: "",
                            uom: "",
                            IsDeleted: 0,
                        });

                        console.log("addrow", formData);
                    }

                })
                .catch((error) => {
                    console.error("Error fetching Access Right Data:", error);
                });

        } catch (error) {
            console.error("Error fetching Access Right Data:", error);
        }
    };


    const handleDelete = async (praid) => {
        try {
            const payload = {
                "praid": (masterData.praid == undefined || masterData.praid == "") ? "" : masterData.praid,
                "companyid": userdetail?.companyID || "",
                "deptid": userdetail?.departmentID || ""
            };

            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            const response = await axios.post(
                `${baseUrl.Url}/backend/api/SP_MeassagePRequisition`,
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

            } else {
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
                        setTableData((prevData) =>
                            prevData.map((data) =>
                                data.prdaid === praid ? { ...data, IsDeleted: 1 } : data
                            )
                        );

                        Swal.fire({
                            icon: "success",
                            title: "Deleted!",
                            text: "Record marked as deleted",
                            confirmButtonText: "OK",
                        });
                    }
                });
            }
        } catch (error) {
            console.error("Submission Error:", error);
            await Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to save data. Please try again.",
            });
        }

    };


    const handleEdit = (praid) => {
        const filteredProducts = tableData.filter((data) => data.prdaid == praid);
        setFormData({
            prdaid: filteredProducts[0].prdaid,
            productname: filteredProducts[0].productname,
            uomtitle: filteredProducts[0].uomtitle,
            product: product.filter((data) => data.value == filteredProducts[0].product)[0].value,
            description: filteredProducts[0].description,
            quantity: filteredProducts[0].quantity,
            uom: uom.filter((data) => data.value == filteredProducts[0].uom)[0].value,
            IsDeleted: 0,
            phsn: filteredProducts[0].hsncode
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (tableData.length === 0) {
            Swal.fire({
                icon: "error",
                title: "Validation Error of Detail Table",
                text: "Please add at least one record in the details table before saving",
            })
            return;
        }
        showConfirmationAlert(e);
        console.log("table Data Submitted:", tableData);
        console.log("Master part Submitted:", masterData);
    };

    const handlePayloadSubmition = async () => {
        try {
            const payload1 = {
                "praid": (masterData.praid == undefined || masterData.praid == "") ? GUID : masterData.praid,
                "prqdate": masterData.requisitiondate,
                "preqno": masterData.enquirynumber,
                "prexpcdate": masterData.expecteddate,
                "prcategory": masterData.category,
                "prvandorid": masterData.vendor,
                "prnarration": masterData.narration,
                "companyid": userdetail?.companyID || "",
                "deptid": userdetail?.departmentID || "",
                "prmdate": masterData.meetingdate,
                "prtermandcondition": masterData.termcondition,
                "prno": masterData.requisitionnumber,
            };

            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            // First API Call
            const response1 = await axios.post(
                `${baseUrl.Url}/backend/api/AddUpdPRequisitionMaster`,
                JSON.stringify(payload1),
                { headers }
            );

            if (response1.status === 200) {
                const Payload2 = tableData.map(detail => ({
                    "prdaid": detail.prdaid,
                    "praid": (!masterData.praid || masterData.praid === "") ? GUID : masterData.praid,
                    "prdproduct": detail.product,
                    "prddescription": detail.description,
                    "prbaseqty": detail.basequantity || 0,
                    "prdquantity": (detail.quantity || "0").toString(),
                    "prduom": detail.uom,
                    "companyid": userdetail?.companyID || "",
                    "deptid": userdetail?.departmentID || "",
                    "isdeleted": detail.IsDeleted === 1 || detail.IsDeleted === true,
                    "hsncode": detail.phsn,

                }));

                const response2 = await axios.post(
                    `${baseUrl.Url}/backend/api/AddUpdPRequisitionDetails`,
                    JSON.stringify(Payload2),
                    { headers }
                );

                if (response2.status === 200) {
                    Swal.fire({
                        icon: "success",
                        title: masterData.praid ? "Updated!" : "Saved!",
                        text: masterData.praid ? "Record updated successfully!" : "Data saved successfully!",
                        confirmButtonText: "OK",
                    }).then(() => {
                        navigate(route.RequisitionMaster);
                    });
                }
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


    useEffect(() => {
        const handleShortcut = (e) => {
            if (e.ctrlKey && (e.key === 'e' || e.key === 'E')) {
                e.preventDefault();
                showExitAlert();
            }
            if (e.ctrlKey && (e.key === 's' || e.key === 'S')) {
                e.preventDefault();
                validateinput();
            }
        };

        window.addEventListener('keydown', handleShortcut);

        return () => {
            window.removeEventListener('keydown', handleShortcut);
        };
    }, [masterData, route.RequisitionMaster, handleSubmit]);


    const validateinput = () => {

        const enquirynumber = document.getElementById("enquirynumber").value;
        if (!enquirynumber || !/^\d{10}$/.test(enquirynumber)) {
            Swal.fire({
                icon: "error",
                title: "Validation Error of Enquiry Number",
                text: "Enquiry Number must contain only 10 Digits. do not accept spaces and characters and symbols",
            })
            return;
        }

        const { vendor } = masterData;
        if (!vendor || vendor.length === 0) {
            Swal.fire({
                icon: "error",
                title: "Validation Error of Vendor",
                text: "Please select a Vendor",
            })
            return false;
        }

        const narration = document.getElementById("narration").value;
        if (!narration || !/^(?!\s*$)[a-zA-Z0-9\s.,'-]+$/.test(narration)) {
            Swal.fire({
                icon: "error",
                title: "Validation Error of Narration",
                text: "Narration must not start with a space, can only include letters, numbers, spaces, and basic punctuation (.,'-).",
            })
            return;
        }

        const expecteddate = document.getElementById("expecteddate").value;
        if (!expecteddate) {
            Swal.fire({
                icon: "error",
                title: "Validation Error of expecteddate",
                text: "please select Expected Date",
            })
            return;
        }


        const meetingdate = document.getElementById("meetingdate").value;
        if (meetingdate) {
            if (new Date(meetingdate) <= new Date(expecteddate)) {
                Swal.fire({
                    icon: "error",
                    title: "Validation Error of Meeting Date",
                    text: "Meeting Date must be Greater than the Expected Date.",
                });
                return;
            }
        }

        const termcondition = document.getElementById("termcondition").value;
        if (!termcondition || !/^(?!\s*$)[a-zA-Z0-9\s.,'-]+$/.test(termcondition)) {
            Swal.fire({
                icon: "error",
                title: "Validation Error of Terms And Condition",
                text: "Terms And Condition must not start with a space and only include letters, numbers, spaces, and basic punctuation (.,'-).",
            })
            return;
        }

        handleSubmit(event);
    }
    const MySwal = withReactContent(Swal);
    // const showConfirmationAlert = async (event) => {
    //     MySwal.fire({
    //         title: "Are you sure?",
    //         text: "Do you want to save this data?",
    //         showCancelButton: true,
    //         confirmButtonColor: "#00ff00",
    //         confirmButtonText: "SAVE",
    //         cancelButtonColor: "#092C4C",
    //         cancelButtonText: "CANCLE",
    //     }).then((result) => {
    //         if (!result.isConfirmed) return;
    //         try {
    //             const payload = {
    //                 "praid": (masterData.praid == undefined || masterData.praid == "") ? "" : masterData.praid,
    //                 "companyid": userdetail?.companyID ? userdetail.companyID : "",
    //                 "deptid": userdetail?.departmentID ? userdetail.departmentID : ""
    //             };

    //             const headers = {
    //                 "Content-Type": "application/json",
    //                 Accept: "*/*",
    //             };
    //             const response = await axios.post(
    //                 `${baseUrl.Url}/backend/api/SP_MeassagePRequisition`,
    //                 JSON.stringify(payload),
    //                 { headers }
    //             );
    //             const response = await axios({
    //                 method: "POST",
    //                 url: baseUrl.Url + "/backend/api/SP_MeassagePRequisition",
    //                 data: JSON.stringify(payload),
    //                 headers: headers,
    //             });

    //             if (response.status !== 200) {
    //                 throw new Error("Failed to Fetch Data");
    //             }

    //             if (response.data[0].responseMessage === "Edit is not allowed because the next transaction has been successfully completed.") {
    //                 Swal.fire({
    //                     icon: 'warning',
    //                     title: 'Edit Not Allowed',
    //                     text: response.data[0].responseMessage,
    //                     confirmButtonText: 'OK'
    //                 });
    //                 return;
    //             }
    //         } catch (error) {
    //             console.error("Submission Error:", error);
    //             Swal.fire({
    //                 icon: "error",
    //                 title: "Error",
    //                 text: "Failed to save data. Please try again.",
    //             });
    //         }
    //         handlePayloadSubmition(event);

    //     });
    // };

    const showConfirmationAlert = async (event) => {
        try {
            const payload = {
                "praid": (masterData.praid == undefined || masterData.praid == "") ? "" : masterData.praid,
                "companyid": userdetail?.companyID || "",
                "deptid": userdetail?.departmentID || ""
            };

            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            const response = await axios.post(
                `${baseUrl.Url}/backend/api/SP_MeassagePRequisition`,
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
            const result = await MySwal.fire({
                title: "Are you sure?",
                text: "Do you want to save this data?",
                showCancelButton: true,
                confirmButtonColor: "#00ff00",
                confirmButtonText: "SAVE",
                cancelButtonColor: "#092C4C",
                cancelButtonText: "CANCEL",
            });

            if (!result.isConfirmed) return;

            handlePayloadSubmition(event);

        } catch (error) {
            console.error("Submission Error:", error);
            await Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to save data. Please try again.",
            });
        }
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
                navigate(route.RequisitionMaster)
            }
        });
    };

    return (
        <div className="page-wrapper">
            <div className="content">
                <div className="page-header">
                    <div className="add-item d-flex">
                        <div className="page-title">
                            <h4>Purchase Requisition/Enquiry</h4>
                            <h6>Create Purchase Requisition/Enquiry</h6>
                        </div>
                    </div>
                    <ul className="table-top-head">
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
                    <div className="page-btn">
                        <Link className="btn btn-secondary" onClick={showExitAlert}>
                            <ArrowLeft className="me-2" />
                            Back to Requisition
                        </Link>
                    </div>
                </div>

                {/* /add */}
                <form onSubmit={handleSubmit}>
                    <div className="card mbgcolor">
                        <div className="card-body add-product pb-0 mbgcolor">

                            <div
                                className="accordion-card-one accordion"
                                id="accordionExample"
                            >
                                <div className="accordion-item mbgcolor">
                                    <div className="" id="headingOne">
                                        <div
                                            className=""
                                            data-bs-toggle="collapse"
                                            data-bs-target="#collapseOne"
                                            aria-controls="collapseOne"
                                        >
                                            <div className="addproduct-icon ">
                                                <h5 >
                                                    <Info className="add-info" />

                                                    <span>Purchase Requisition/Enquiry(Master)</span>
                                                </h5>
                                                <Link to="#">
                                                    <ChevronDown className="chevron-down-add" />
                                                </Link>
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
                                                <div className="col-lg-3 col-sm-6 col-12">
                                                    <div className="mb-3">
                                                        <label className="form-label required">Requisition Number</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            id="requisitionnumber"
                                                            name="requisitionnumber"
                                                            value={masterData.requisitionnumber}
                                                            onChange={handleMasterInputChange}
                                                            required
                                                            placeholder="Auto Generate"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-3 col-sm-6 col-12">
                                                    <div className="mb-3">
                                                        <label className="form-label required">Enquiry Number</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            id="enquirynumber"
                                                            name="enquirynumber"
                                                            value={masterData.enquirynumber}
                                                            onChange={handleMasterInputChange}
                                                            // pattern="^\d{10}$"
                                                            title="Enquiry Number required"
                                                            placeholder="Enter 10-digit phone number"
                                                            required

                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-3 col-sm-6 col-12">
                                                    <div className="mb-3">
                                                        <label className="form-label required">Requisition Date</label>
                                                        <input
                                                            type="date"
                                                            className="form-control"
                                                            name="requisitiondate"
                                                            value={masterData.requisitiondate}
                                                            onChange={handleMasterInputChange} // Handle the change event (even though it's readonly, for other fields)
                                                            readOnly // Makes the field readonly
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="row">
                                                <div className="col-lg-12 col-sm-6 col-12">
                                                    <div className="mb-3">
                                                        <label className="form-label">Category</label>
                                                        <Select
                                                            classNamePrefix="react-select"
                                                            options={category}
                                                            onChange={(selectedOption) => handleMasterDropdownChange(selectedOption, "category")}
                                                            isMulti={true} // This enables multiple selections
                                                            value={category.filter(option => masterData.category.includes(option.value))} // Set the selected values based on masterData.category
                                                            openMenuOnFocus={true}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="row">
                                                <div className="col-lg-12 col-sm-6 col-12">
                                                    <div className="mb-3">
                                                        <label className="form-label required">Seller/Vendor</label>
                                                        <Select
                                                            classNamePrefix="react-select"
                                                            options={vendor}
                                                            onChange={(selectedOption) => handleMasterDropdownChange(selectedOption, "vendor")}
                                                            isMulti={true} // This enables multiple selections
                                                            value={vendor.filter(option => masterData.vendor.includes(option.value))} // Set the selected values based on masterData.vendor
                                                            required
                                                            openMenuOnFocus={true}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-lg-12 col-sm-6 col-12">
                                                    <div className="mb-3">
                                                        <label className="form-label required">Narration</label>
                                                        <textarea
                                                            type="text"
                                                            rows={4}
                                                            className="form-control"
                                                            id="narration"
                                                            name="narration"
                                                            value={masterData.narration || ""}
                                                            // onChange={handleMasterInputChange}
                                                            onChange={(e) => {
                                                                const value = e.target.value;

                                                                // Prevent leading spaces and allow only letters, numbers, spaces, and allowed punctuation
                                                                if (/^[a-zA-Z0-9\s.,'-]*$/.test(value) && !/^\s/.test(value)) {
                                                                    handleMasterInputChange(e);
                                                                }
                                                            }}
                                                            required
                                                            placeholder="Enter Narration"
                                                            pattern="^[a-zA-Z0-9\s.,'-]*$"
                                                            title="Narration must not start with space and only include letters, numbers, spaces, and basic punctuation (.,'-)."
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </div>

                                </div>
                            </div>

                            {/* start Purchase Requisition(Detail) */}
                            <div className="border p-3 rounded shadow-sm mb-4 dbgcolor">
                                <div className="col-lg-12">

                                    <div className="modal-body-table">
                                        <div className="table-responsive">
                                            <table className="table table-bordered">
                                                <thead className="thead-dark">
                                                    <tr>
                                                        <th className="col-3">Product</th>
                                                        <th className="col-1">HSN Code</th>
                                                        <th className="col-1">Quantity</th>
                                                        <th className="col-1">UOM</th>
                                                        <th className="col-1 text-center" >Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {tableData
                                                        .filter((data) => data.IsDeleted == 0)
                                                        .map((data, index) => (
                                                            <tr key={index}>
                                                                <td className="col-3" style={{ padding: '5px 10px' }}>
                                                                    {product.find((option) => option.value == data.product)?.label || "Not Found"}
                                                                </td>
                                                                <td className="col-1" style={{ padding: '5px 10px' }}>{data.phsn}</td>
                                                                <td className="col-1" style={{ padding: '5px 10px' }}>{data.quantity}</td>
                                                                <td className="col-1" style={{ padding: '5px 10px' }}>
                                                                    {/* {uom.find((option) => option.value == data.uom)?.label || "Not Found"} */}
                                                                    {data.uomtitle}
                                                                </td>
                                                                <td className="col-1 text-center">
                                                                    <div className="edit-delete-action">
                                                                        <Link
                                                                            to="#"
                                                                            onClick={() => handleEdit(data.prdaid)}
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
                                                                            onClick={() => handleDelete(data.prdaid)}
                                                                        >
                                                                            <Trash2 className="feather-trash-2" />
                                                                        </Link>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    id="collapseTwo"
                                    className="accordion-collapse collapse show"
                                    aria-labelledby="headingTwo"
                                    data-bs-parent="#accordionExample2"
                                >
                                    <div className="addservice-info">
                                        {/* <div className="row">
                                            <div className="col-lg-12 col-sm-6 col-12">
                                                <div className="mb-3">
                                                    <label className="form-label required">Product</label>
                                                    <Select
                                                        classNamePrefix="react-select"
                                                        options={product}
                                                        value={product.find(option => option.value === formData.product) || null}
                                                        onChange={(selectedOption) => handleDetailDropdownChange(selectedOption, "product")}
                                                    />
                                                </div>
                                            </div>
                                        </div> */}
                                        <div className="row align-items-end">
                                            <div className="col-lg-8 col-sm-6 col-12">
                                                <div className="mb-3">
                                                    <label className="form-label required">Product</label>
                                                    <Select
                                                        classNamePrefix="react-select"
                                                        options={product}
                                                        value={product.find(option => option.value === formData.product) || null}
                                                        onChange={(selectedOption) => handleDetailDropdownChange(selectedOption, "product")}
                                                        openMenuOnFocus={true}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-lg-4 col-sm-6 col-12">
                                                <div className="mb-3">
                                                    <label className="form-label">HSN Code</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={formData.phsn || ""}
                                                        readOnly
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-lg-12 col-sm-6 col-12">
                                                <div className="mb-3">
                                                    <label className="form-label required">Product Description</label>
                                                    <textarea
                                                        type="text"
                                                        className="form-control"
                                                        name="description"
                                                        value={formData.description}
                                                        onChange={handleDetailInputChange}

                                                        placeholder="Enter Product Description"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-lg-3 col-sm-6 col-12">
                                                <div className="mb-3">
                                                    <label className="form-label required">Quantity</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="quantity"
                                                        value={formData.quantity}
                                                        onChange={handleDetailInputChange}
                                                        placeholder="Enter Quantity"
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-lg-3 col-sm-6 col-12">
                                                <div className="mb-3">
                                                    <label className="form-label required">UOM</label>
                                                    <Select
                                                        classNamePrefix="react-select"
                                                        options={uom}
                                                        value={uom.find(option => option.value === formData.uom) || null}
                                                        onChange={(selectedOption) => handleDetailDropdownChange(selectedOption, "uom")}
                                                        placeholder="Select Option"
                                                        openMenuOnFocus={true}

                                                    />
                                                </div>
                                            </div>
                                            <div className="col-lg-3 col-sm-6 col-12">
                                                <div className="mb-3">
                                                    <label className="form-label required">Base Quantity</label>
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        name="basequantity"
                                                        value={formData.basequantity}
                                                        onChange={handleDetailInputChange}
                                                        placeholder="Enter Quantity"
                                                        readOnly
                                                    />
                                                </div>
                                            </div>

                                            <div className="d-flex justify-content-end">
                                                <div className="mb-3">
                                                    <button type="button" className="btn btn-primary" onClick={addRecord}  >
                                                        Add
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-lg-3 col-sm-6 col-12">
                                    <div className="mb-3">
                                        <label className="form-label required">Expected Date</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            id="expecteddate"
                                            name="expecteddate"
                                            value={masterData.expecteddate}
                                            onChange={handleMasterInputChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-6 col-12">
                                    <div className="mb-3">
                                        <label className="form-label">Meeting Date</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            id="meetingdate"
                                            name="meetingdate"
                                            value={masterData.meetingdate}
                                            onChange={handleMasterInputChange}
                                            min={
                                                masterData.expecteddate
                                                    ? new Date(new Date(masterData.expecteddate).getTime() + 86400000).toISOString().split('T')[0]
                                                    : undefined // No restriction if expecteddate is not set
                                            }
                                        />
                                    </div>
                                </div>

                            </div>

                            <div className="row">
                                <div className="col-lg-12 col-sm-6 col-12">
                                    <div className="mb-3">
                                        <label className="form-label required">Terms And Conditions</label>
                                        <textarea
                                            type="text"
                                            rows={4}
                                            className="form-control"
                                            id="termcondition"
                                            name="termcondition"
                                            value={masterData.termcondition}
                                            // onChange={handleMasterInputChange}
                                            onChange={(e) => {
                                                const value = e.target.value;

                                                // Prevent leading spaces and allow only letters, numbers, spaces, and allowed punctuation
                                                if (/^[a-zA-Z0-9\s.,'-]*$/.test(value) && !/^\s/.test(value)) {
                                                    handleMasterInputChange(e);
                                                }
                                            }}
                                            pattern="^(?!\s*$)[a-zA-Z0-9\s.,'-]+$"
                                            title="Enter the  Terms And Conditions. "
                                            placeholder="Enter Terms And Conditions"
                                            required
                                        />
                                    </div>

                                </div>
                            </div>

                            <div className="col-lg-12 d-flex justify-content-end mb-4">

                                <button type="button" className="btn btn-cancel me-2" onClick={showExitAlert}>
                                    Exit
                                </button>
                                <button type="submit" className="btn btn-submit">
                                    Save Master
                                </button>

                            </div>

                        </div>
                    </div>
                </form>
                {/* /add */}
            </div>
            <Addunits />
            {/* <AddCategory /> */}
            <AddBrand />
        </div>
    )
}

export default AddRequisition
