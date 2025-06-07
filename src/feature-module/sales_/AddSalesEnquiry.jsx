import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

import Select from "react-select";

import {
    ArrowLeft, Trash2, Edit,
} from "feather-icons-react/build/IconComponents";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axios from 'axios';
import { all_routes } from "../../Router/all_routes";

import { ACSPLGUID, baseUrl, convertToISODate } from "../../core/json/custom";
// import { getUserData } from "../../../../../ims/src/";

import { getUserData } from "../../Context/UserData";
function AddSalesEnquiry({ SRAID }) {
    console.log(SRAID, "sraid")
    const { userdetail } = getUserData();
    // const navigate = useNavigate();
    const route = all_routes;
    const GUID = ACSPLGUID.getNew();

    const location = useLocation();
    const { PRAID } = location.state || {};
    console.log('primaryKey', PRAID)

    const [category, setcategory] = useState([]);
    const [product, setproduct] = useState([]);
    const [productdata, setproductdata] = useState([]);
    const [vendor, setvendor] = useState([]);
    const [uom, setuom] = useState([]);


    const [formData, setFormData] = useState({
        srdaid: "",
        product: "",
        description: "",
        quantity: "",
        uom: "",
        hsncode: 0,
        IsDeleted: 0,
        productname: "",
        uomtitle: "",
    });

    // if (isAuthenticated == true) {
    //     console.log("user", userdetail);
    //     console.log("getUserData", getUserData);
    // }
    const [tableData, setTableData] = useState([]);

    const [masterData, setMasterData] = useState({
        requisitionnumber: "",
        requisitiondate: new Date().toISOString().split('T')[0], // Current date set here
        enquirynumber: "",
        category: [],
        vendor: "",
        narration: "",
        meetingdate: "",
        expecteddate: "",
        termcondition: "",
        praid: SRAID || "",
    });


    // data fetching for dropdown
    useEffect(() => {

        const fetchCategoryData = async () => {
            try {
                const payload =
                {
                    "companyid": userdetail?.companyID || "",
                    "deptid": userdetail?.departmentID || "",
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

                        const selectedCategories = masterData?.category
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
                        setproductdata(DATA);
                    })

            } catch (error) {
                console.error("Error fetching Access Right Data:", error);
            }

        };

        const fetchVendorData = async () => {
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

        const fetchImplications = async () => {
            try {
                const response = await axios.get(
                    baseUrl.Url + "/backend/api/Implications/SOLID|LIQUID|GAS",
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

        fetchProductData();
        fetchCategoryData();
        fetchVendorData();
        fetchImplications();
    }, []);

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

        if (field === "vendor") {
            // Vendor should have only a single value
            const VENDORID = selectedOptions ? selectedOptions.value : "";
            console.log(VENDORID);
            setMasterData(prevData => ({
                ...prevData,
                vendor: VENDORID,  // Store as a single string
            }));
            return;
        }
        if (field == "category") {

            const CTAID = selectedOptions.map(obj => `${obj.value}`).join(","); // Correct format
            console.log("Selected Categories:", CTAID);

            setMasterData(prevData => ({
                ...prevData,
                category: CTAID, // Save as a string
            }));
            try {
                const payload = {
                    "ctaid": CTAID,
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
                        setproductdata(DATA);
                    })

            } catch (error) {
                console.error("Error fetching Access Right Data:", error);
            }
            try {
                const payload = {
                    "ctaid": CTAID,
                    "companyid": userdetail?.companyID || "",
                    "deptid": userdetail?.departmentID || "",
                    "ctype": '2',
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
            const selectedProduct = productdata.find(p => p.paid === selectedOption.value);
            if (selectedProduct) {
                setFormData(prevData => ({
                    ...prevData,
                    hsncode: selectedProduct.hsncode,
                }));
            }
        }

    };

    const addRecord = (e) => {
        e.preventDefault(); // Prevent form submission

        // Validate each field and add error alert for empty fields or invalid patterns
        if (!formData.product) {
            Swal.fire({
                icon: "error",
                title: "Validation Error of Product",
                text: "Product field is required",
            });
            return;
        }
        if (!formData.quantity || !/^\d+$/.test(formData.quantity)) {
            Swal.fire({
                icon: "error",
                title: "Validation Error of Quantity",
                text: "Please enter the Quantity, Only Digits, Remove space from Start and End",
            });
            return;
        }
        if (!formData.uom) {
            Swal.fire({
                icon: "error",
                title: "Validation Error of UOM",
                text: "Please Select UOM",
            });
            return;
        }
        if (!formData.description || formData.description.trim() === "") {
            Swal.fire({
                icon: "error",
                title: "Validation Error of Product Description",
                text: "Please enter the Product Description, Remove Space from Start",
            });
            return;
        }

        setTableData((prevTableData) => {
            let updatedTableData;

            if (formData.srdaid) {
                // If srdaid exists, update the existing row
                updatedTableData = prevTableData.map((item) =>
                    item.srdaid === formData.srdaid ? { ...item, ...formData } : item
                );
            } else {
                // If srdaid doesn't exist, add a new row
                updatedTableData = [...prevTableData, { ...formData, srdaid: ACSPLGUID.getNew() }];
            }

            return updatedTableData;
        });

        // Show success message
        Swal.fire({
            icon: "success",
            title: "Saved!",
            text: formData.srdaid ? "Data Updated Successfully!" : "Data Added Successfully!",
            confirmButtonText: "OK",
        });

        // Reset formData to clear the form
        setFormData({
            srdaid: "",
            product: "",
            description: "",
            quantity: "",
            uom: "",
            hsncode: "",
            IsDeleted: 0,
            productname: "",
            uomtitle: "",
        });
    };


    const handleDelete = async (srdaid) => {
        try {
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
                            data.srdaid === srdaid ? { ...data, IsDeleted: 1 } : data
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
        } catch (error) {
            console.error("Error:", error);
            await Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to delete. Please try again.",
            });
        }
    };


    const handleEdit = (srdaid) => {
        const filteredProducts = tableData.filter((data) => data.srdaid == srdaid);
        setFormData({
            srdaid: filteredProducts[0].srdaid,
            productname: filteredProducts[0].productname,
            uomtitle: filteredProducts[0].uomtitle,
            product: product.filter((data) => data.value == filteredProducts[0].product)[0].value,
            description: filteredProducts[0].description,
            quantity: filteredProducts[0].quantity,
            uom: uom.filter((data) => data.value == filteredProducts[0].uom)[0].value,
            IsDeleted: filteredProducts[0].IsDeleted,
            hsncode: filteredProducts[0].hsncode
        });
    }


    const handleSubmit = (e) => {
        e.preventDefault();

        // Check if there are records in the details table
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


    // payload 
    const handlePayloadSubmition = async () => {
        console.log("table Data Submitted from  handlePayloadSubmition:", tableData);
        console.log("Master part Submitted from handlePayloadSubmition:", masterData);
        try {
            // Handle multi-selected fields by converting arrays to strings
            const payload1 = {
                sraid: SRAID ? SRAID : GUID,
                srqdate: masterData.requisitiondate || "",
                sreqno: masterData.enquirynumber || "",
                srexpcdate: masterData.expecteddate || "",
                srcategory: masterData.category || "", // Convert array to string
                // srvandorid: Array.isArray(masterData.vendor) ? masterData.vendor.join(",") : "", // Convert array to string
                srvandorid: masterData.vendor || "",
                srnarration: masterData.narration || "",
                companyid: userdetail?.companyID || "",
                deptid: userdetail?.departmentID || "",
                srmdate: masterData.meetingdate || "",
                srtermandcondition: masterData.termcondition || "",
                srno: masterData.requisitionnumber || "",
            };

            console.log("Payload1 after processing arrays:", payload1);

            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            // First API call to save the quotation master
            await axios({
                method: "POST",
                url: baseUrl.Url + "/backend/api/SP_AddUpdSRequisitionMaster",
                data: JSON.stringify(payload1),
                headers: headers,
            });

            // Prepare payload for detail data
            const Payload2 = tableData.map((detail) => ({
                srdaid: detail.srdaid ? detail.srdaid : ACSPLGUID.getNew(),
                sraid: SRAID ? SRAID : GUID,
                srdproduct: detail.product || "",
                srddescription: detail.description || "",
                srdquantity: detail.quantity || 0,
                srduom: detail.uom || "",
                hsncode: detail.hsncode || 0,
                companyid: userdetail?.companyID || "",
                deptid: userdetail?.departmentID || "",
                isDeleted: detail.IsDeleted === 1 || detail.IsDeleted === true ? true : false,
            }));
            console.log("Payload2:", Payload2);


            await axios({
                method: "POST",
                url: baseUrl.Url + "/backend/api/SP_AddUpdSRequisitionDetails",
                data: JSON.stringify(Payload2),
                headers: headers,
            });


            Swal.fire({
                icon: "success",
                title: "Saved!",
                text: "Data saved successfully.",
                confirmButtonText: "OK",
            }).then((result) => {

                // Clear the masterData state
                setMasterData({
                    requisitiondate: "",
                    enquirynumber: "",
                    expecteddate: "",
                    category: "",
                    vendor: "",
                    narration: "",
                    meetingdate: "",
                    termcondition: "",
                    requisitionnumber: ""
                });

                if (result.isConfirmed) {
                    // Navigate to SalesEnquiry after user clicks OK
                    window.location.href = route.SalesEnquiry;
                }
            });
            // navigate(route.SalesEnquiry);
        } catch (error) {
            console.error("Submission Error:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to save data. Please try again.",
            });
        }


    };


    // Handle keyboard shortcuts with validation
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
    }, [masterData, handleSubmit]);

    // validation on C+S only for master inputs
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
                title: "Validation Error of Customer Name",
                text: "Please select a Customer Name",
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
            // Check if the selected meeting date is after the expected date
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
                handlePayloadSubmition(event);
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
                const modal = document.getElementById("AddSalesEnquiry");
                if (modal) {
                    modal.classList.remove("show");
                    modal.style.display = "none";
                    modal.setAttribute("aria-hidden", "true");
                }
                const backdrop = document.querySelector(".modal-backdrop");
                if (backdrop) {
                    backdrop.remove();
                }
            }
        });
    };

    const customStyles = {
        control: (provided) => ({
            ...provided,
            maxHeight: "50px",
            overflowY: "auto",
        }),
        multiValue: (provided) => ({
            ...provided,
            maxWidth: "100%",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
        }),
        menu: (provided) => ({
            ...provided,
            zIndex: 1050,
        }),
    };

    useEffect(() => {
        if (SRAID) {
            try {
                const payload = {
                    sraid: SRAID,
                    keyword: "%",
                    companyid: userdetail?.companyID || "",
                    deptid: userdetail?.departmentID || "",
                }
                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };

                axios({
                    method: "POST",
                    url: baseUrl.Url + "/backend/api/GET_SRequisitionMaster",
                    data: JSON.stringify(payload),
                    headers: headers,
                })
                    .then((response) => {
                        if (response.status != 200) throw new Error("Failed to Fetching Data");
                        const data = response.data[0];
                        setMasterData((prevData) => ({
                            ...prevData,
                            sraid: data.sraid || "",
                            requisitionnumber: data.srno || "",
                            requisitiondate: convertToISODate(data.srqdate) || "",
                            enquirynumber: data.sreqno || "",
                            category: data.srcategory || "",
                            vendor: data.srvandorid || "",
                            narration: data.srnarration || "",
                            meetingdate: convertToISODate(data.srmdate) || "",
                            expecteddate: convertToISODate(data.srexpcdate) || "",
                            termcondition: data.srtermandcondition || "",
                        }));

                    })
            } catch (error) {
                console.error("Error fetching Access Right Data:", error);
            }



            try {
                const payload = {
                    sraid: SRAID,
                    companyid: userdetail?.companyID || "",
                    deptid: userdetail?.departmentID || "",
                }
                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };

                axios({
                    method: "POST",
                    url: baseUrl.Url + "/backend/api/GET_SRequisitionDetailById",
                    data: JSON.stringify(payload),
                    headers: headers,
                })
                    .then((response) => {

                        if (response.status != 200) throw new Error("Failed to Fetching Details Data");

                        const mappedProducts = response.data.map((item) => ({
                            srdaid: item.srdaid || "",
                            sraid: item.sraid || "",
                            product: item.srdproduct || "",
                            description: item.srddescription || "",
                            quantity: item.srdquantity || "",
                            uom: item.srduom || "",
                            hsncode: item.hsncode || 0,
                            IsDeleted: item.isdeleted,
                            uomtitle: "",
                            productname: "",
                        }));

                        console.log("++++++++++1", response.data)
                        console.log("++++++++++2", mappedProducts)
                        // setFormData(mappedProducts);
                        setTableData(mappedProducts)
                    })
            } catch (error) {
                console.error("Error fetching Access Right Data:", error);
            }
        }
    }, [SRAID]);



    return (
        <div>
            <div
                className="modal fade"
                id="AddSalesEnquiry"
                tabIndex={-1}
                aria-labelledby="exampleModalFullscreenXlLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-fullscreen">
                    <div className="modal-content">
                        <div className="page-wrapper-new p-0">
                            <div className="content">
                                <div className="modal-header border-0 custom-modal-header">
                                    <div className="page-title">
                                        <h4>Add Sale Enquiry</h4>
                                    </div>

                                    <div className="page-btn">
                                        {/* <Link className="btn btn-secondary"
                                            data-bs-dismiss="modal"
                                            aria-label="Close">
                                            <ArrowLeft className="me-2" />
                                            Back to Index
                                        </Link> */}
                                        <div className="page-btn">
                                            <button className="btn btn-secondary" onClick={showExitAlert}>
                                                <ArrowLeft className="me-2" />
                                                Back to Index
                                            </button>
                                        </div>

                                    </div>
                                </div>
                                <div className="modal-body custom-modal-body" style={{
                                    overflow: "hidden",
                                }}>
                                    <form onSubmit={handleSubmit}>

                                        <div className="row">
                                            <div className="col-lg-2 col-sm-6 col-12">
                                                <div className="mb-0">
                                                    <label className="form-label required">Requisition Number</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="requisitionnumber"
                                                        name="requisitionnumber"
                                                        value={masterData.requisitionnumber}
                                                        onChange={handleMasterInputChange}
                                                        placeholder="Auto Generate"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-lg-2 col-sm-6 col-12">
                                                <div className="mb-0">
                                                    <label className="form-label required">Enquiry Number</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="enquirynumber"
                                                        name="enquirynumber"
                                                        value={masterData.enquirynumber}
                                                        onChange={handleMasterInputChange}
                                                        pattern="^\d{10}$"
                                                        title="Enquiry Number must contain exactly 10 digits with no spaces or special characters."
                                                        placeholder="Enter 10-digit phone number"
                                                        required
                                                        autoFocus
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-lg-2 col-sm-6 col-12">
                                                <div className="mb-0">
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

                                            <div className="col-lg-3 col-sm-6 col-12">
                                                <div className="mb-0">
                                                    <label className="form-label">Category</label>
                                                    <Select
                                                        classNamePrefix="react-select"
                                                        options={category}
                                                        onChange={(selectedOption) => handleMasterDropdownChange(selectedOption, "category")}
                                                        isMulti={true} // This enables multiple selections
                                                        menuShouldScrollIntoView
                                                        value={category.filter(option => masterData.category.includes(option.value))} // Set the selected values based on masterData.category
                                                        styles={customStyles} // Apply custom styles
                                                    />
                                                </div>
                                            </div>



                                            <div className="col-lg-3 col-sm-6 col-12">
                                                <div className="mb-0">
                                                    <label className="form-label required">Customer Name</label>
                                                    <Select
                                                        classNamePrefix="react-select"
                                                        options={vendor}
                                                        onChange={(selectedOption) => handleMasterDropdownChange(selectedOption, "vendor")}
                                                        value={vendor.filter(option => masterData.vendor.includes(option.value))} // Set the selected values based on masterData.vendor
                                                        required

                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-lg-12 col-sm-6 col-12">
                                                <div className="mb-3">
                                                    <label className="form-label required">Narration</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="narration"
                                                        name="narration"
                                                        value={masterData.narration}
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
                                                        // pattern="^[a-zA-Z0-9\s.,'-]*$"
                                                        title="Narration must not start with space and only include letters, numbers, spaces, and basic punctuation (.,'-)."

                                                    />
                                                </div>
                                            </div>
                                        </div>




                                        {/* start sales Requisition(Detail) */}
                                        <div className="border p-3 rounded shadow-sm mb-4">

                                            <div className="addservice-info">

                                                <div className="row">
                                                    <div className="col-lg-8 col-sm-6 col-12">
                                                        <div className="mb-0">
                                                            <label className="form-label required">Product</label>
                                                            <Select
                                                                classNamePrefix="react-select"
                                                                options={product}
                                                                value={product.find(option => option.value === formData.product) || null} //for reseting dropdown after data inserted in table
                                                                onChange={(selectedOption) => handleDetailDropdownChange(selectedOption, "product")}

                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-lg-2 col-sm-6 col-12">
                                                        <div className="mb-0">
                                                            <label className="form-label required">HSN Code</label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                name="hsncode"
                                                                value={formData.hsncode}
                                                                onChange={handleDetailInputChange}
                                                                readOnly
                                                                placeholder="Auto Map by product"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-lg-2 col-sm-6 col-12">
                                                        <div className="mb-0">
                                                            <label className="form-label required">Qauntity</label>
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
                                                        <div className="mb-0">
                                                            <label className="form-label required">UOM</label>
                                                            <Select
                                                                classNamePrefix="react-select"
                                                                options={uom}
                                                                value={uom.find(option => option.value === formData.uom) || null}
                                                                onChange={(selectedOption) => handleDetailDropdownChange(selectedOption, "uom")}
                                                                placeholder="Select Option"

                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-lg-8 col-sm-6 col-12">
                                                        <div className="mb-0">
                                                            <label className="form-label required">Product Description</label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                name="description"
                                                                value={formData.description}
                                                                onChange={handleDetailInputChange}
                                                                // rows={2}
                                                                placeholder="Enter Product Description"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-lg-1 col-sm-6 col-12">
                                                        <div className="mt-4">
                                                            <button type="button" className="btn btn-primary" onClick={addRecord}>
                                                                Add
                                                            </button>
                                                        </div>
                                                    </div>

                                                </div>

                                            </div>
                                            <div className="col-lg-12">

                                                <div className="modal-body-table overflow-auto max-vh-100" >
                                                    <div className="table-responsive" style={{ height: "calc(40vh - 120px)" }}>
                                                        <table className="table table-bordered table-sm">
                                                            <thead className="thead-dark" style={{ tableLayout: "fixed" }}>
                                                                <tr>
                                                                    <th className="col-3">Product</th>
                                                                    <th className="col-1">Hsn Code</th>
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

                                                                            <td className="col-3">
                                                                                {product.find((option) => option.value === data.product)?.label || "Not Found"}
                                                                            </td>
                                                                            <td className="col-1" >{data.hsncode}</td>
                                                                            <td className="col-1" >{data.quantity}</td>
                                                                            <td className="col-1" >{data.uom}</td>
                                                                            <td className="col-1 text-center">
                                                                                {/* <a
                                                                                    className="me-2 p-2  text-danger "
                                                                                    onClick={() => handleDelete(index)}
                                                                                >
                                                                                    <Trash2 className="feather-trash-2" />
                                                                                </a> */}
                                                                                <Link
                                                                                    className="confirm-text p-1 me-2"
                                                                                    to="#"
                                                                                    style={{ color: 'red' }}
                                                                                    onClick={() => handleDelete(data.srdaid)}
                                                                                >
                                                                                    <Trash2 className="feather-trash-2" />
                                                                                </Link>

                                                                                <Link
                                                                                    to="#"
                                                                                    onClick={() => handleEdit(data.srdaid)}
                                                                                    className="me-2 p-1"
                                                                                    style={{ color: 'lightblue' }}
                                                                                >
                                                                                    <Edit className="feather-edit" />
                                                                                </Link>
                                                                            </td>
                                                                        </tr>
                                                                    ))}
                                                            </tbody>


                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* table part End */}

                                        </div>

                                        <div className="row">
                                            <div className="col-lg-2 col-sm-6 col-12">
                                                <div className="mb-0">
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
                                            <div className="col-lg-2 col-sm-6 col-12">
                                                <div className="mb-0">
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


                                            <div className="col-lg-8 col-sm-6 col-12">
                                                <div className="mb-3">
                                                    <label className="form-label required">Terms And Conditions</label>
                                                    <input
                                                        type="text"
                                                        // rows={1}
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
                                            <button type="submit" className="btn btn-submit"
                                            >
                                                Save Master
                                            </button>

                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}

export default AddSalesEnquiry
