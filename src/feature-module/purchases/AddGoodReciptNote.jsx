import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
// import Select from "react-select";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
// import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { ACSPLGUID, baseUrl, convertToISODate } from "../../core/json/custom";
import {
    ArrowLeft
} from "feather-icons-react/build/IconComponents";
// import { all_routes } from "../../Router/all_routes";
// import { DatePicker } from 'antd';
import { getUserData } from "../../Context/UserData";
import { Link } from "react-router-dom";
function AddGoodReciptNote({ GRNAID, pcaid, vendorid, statusID }) {
    console.log(pcaid, vendorid)
    const { userdetail } = getUserData();
    // const route = all_routes;
    const [showForm, setShowForm] = useState(false);
    const navigate = useNavigate();
    const [PBCHALLANNO, setPBCHALLANNO] = useState('');
    // const [isModalOpen, setIsModalOpen] = useState(true)
    const GRNRef = useRef(null);
    const [products, setproduct] = useState([]);
    const [formData, setFormData] = useState({
        pcaid: pcaid || '',
        GAAID: '',
        vendor: "",
        PCVEMAIL: "",
        PCVCONTACT: "",
        PCCONSIGNER: "",
        Naration: '',
        InspectedBy: '',
        Consigner: '',
        seller: '',
        VechileNo: '',
        Challandate: '',
        ChallanNo: '',
        GRNdate: '',
        GRNNo: '',
        ExcessQty: '',
        RejectedQty: '',
        AcceptedQty: '',
        descriptioncondition1: "",
        descriptioncondition2: "",
        descriptioncondition3: "",
        descriptioncondition4: "",
        checkboxes: {
            condition1: false,
            condition2: false,
            condition3: false,
            condition4: false,
            condition1No: false,
            condition2No: false,
            condition3No: false,
            condition4No: false,
        },
    });

    const PBCHALLANNOref = useRef()
    const GUID = ACSPLGUID.getNew()
    const GUDID = ACSPLGUID.getNew()
    useEffect(() => {
        if (vendorid) {
            setShowForm(true)
            const fetchVendors = async () => {
                try {
                    const payload = {
                        pkid: vendorid,
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
                            vendor: response.data[0].caid,
                            PCVEMAIL: response.data[0].cemail,
                            PCVCONTACT: response.data[0].ccontactpersonmobile,
                            seller: response.data[0].ccompanyname,
                        }));
                    }

                } catch (error) {
                    console.error("Error fetching vendor data:", error);
                }
            };

            fetchVendors();
        }
    }, [vendorid, userdetail]);

    useEffect(() => {
        if (GRNAID) {
            setShowForm(true)
            const fetchMasterData = async () => {
                try {
                    const payload = {
                        "grnaid": GRNAID,
                        "companyid": userdetail?.companyID || "",
                        "deptid": userdetail?.departmentID || "",
                    };
                    const headers = {
                        "Content-Type": "application/json",
                        Accept: "*/*",
                    };
                    const response = await axios.post(
                        `${baseUrl.Url}/backend/api/GET_GoodReceiptNoteDataById`,
                        payload,
                        { headers }
                    );
                    if (response.status !== 200)
                        throw new Error("Failed to fetch vendor data");
                    console.log("setGRNData master", response.data)
                    const Data = response.data[0];
                    setFormData({
                        vendor: Data.grnvendor,
                        PCVEMAIL: Data.email,
                        PCVCONTACT: Data.contactnumber,
                        seller: Data.vendorname,
                        PCCONSIGNER: Data.grnconsigner,
                        Naration: Data.grnnarration,
                        InspectedBy: Data.grninspectedby,
                        Consigner: Data.grnconsigner,
                        VechileNo: Data.grnchallanno,
                        Challandate: Data.grnchallandate,
                        ChallanNo: Data.grnchallanno,
                        GRNdate: Data.grndate,
                        GRNNo: Data.grnnumber,
                        GAAID: Data.gaaid,
                        descriptioncondition1: Data.gaconditiondescription,
                        descriptioncondition2: Data.gaamtdescription,
                        descriptioncondition3: Data.gaexpecteddescription,
                        descriptioncondition4: Data.gapackagedescription,
                        checkboxes: {
                            condition1: Data.gacondition == true ? Data.gacondition : false,
                            condition2: Data.gaamt == true ? Data.gaamt : false,
                            condition3: Data.gaexpected == true ? Data.gaexpected : false,
                            condition4: Data.gapackage == true ? Data.gapackage : false,
                            condition1No: Data.gacondition == false ? true : false,
                            condition2No: Data.gaamt == false ? true : false,
                            condition3No: Data.gaexpected == false ? true : false,
                            condition4No: Data.gapackage == false ? true : false,
                        },

                    })
                    if (Array.isArray(response.data) && response.data.length > 0) {
                        const mappedProducts = response.data.map((item) => ({
                            Product: item.grndproduct,
                            UOM: item.grnduom,
                            challanNo: item.grnvechileno,
                            ExcessQty: item.grndexcessquantity,
                            RejectedQty: item.grndrejectedquantity,
                            AcceptedQty: item.grndacceptedquantity,
                            productname: item.productname,
                            uomtitle: item.uomtitle,
                            batchno: item.batchno,
                            expirydate: item.expirydate,
                            hsncode: item.hsncode,
                            challanquantity: item.grndchallanquantity,
                            grndaid: item.grndaid
                        }));
                        setproduct(mappedProducts);
                    }

                } catch (error) {
                    console.error("Error fetching vendor data:", error);
                }
            };

            fetchMasterData();

        }
    }, [GRNAID, userdetail]);

    useEffect(() => {
        if (pcaid) {
            setShowForm(true)
            const fetchVendors = async () => {
                try {
                    const payload = {
                        pcaid: pcaid,
                        keyword: "%",
                        companyid: userdetail?.companyID || "",
                        deptid: userdetail?.departmentID || "",
                        statusid: statusID,
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
                    if (response.data.length > 0) {
                        setFormData(prevState => ({
                            ...prevState,
                            Consigner: response.data[0].pcconsigner,
                            VechileNo: response.data[0].pcvno,
                            Challandate: response.data[0].pcdate,
                            ChallanNo: response.data[0].pctrnno,
                        }));
                    }
                } catch (error) {
                    console.error("Error fetching vendor data:", error);
                }
            };
            const fetchdetaildata = async () => {
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
                        `${baseUrl.Url}/backend/api/GET_PChallanSearchByID`,
                        payload,
                        { headers }
                    );
                    if (response.status !== 200)
                        throw new Error("Failed to fetch vendor data");
                    console.log("venderos", response.data)
                    if (Array.isArray(response.data) && response.data.length > 0) {
                        const mappedProducts = response.data.map((item) => ({
                            Product: item.pcdproduct,
                            UOM: item.pcduom,
                            challanNo: item.pcdquantity,
                            ExcessQty: item.pcdquantity,
                            RejectedQty: 0,
                            AcceptedQty: item.pcdquantity - 0,
                            productname: item.pname,
                            uomtitle: item.uomtitle,
                            batchno: item.batchno,
                            expirydate: item.expirydate,
                            hsncode: item.hsncode,
                            challanquantity: item.pcdquantity
                        }));
                        setproduct(mappedProducts);
                    } else {
                        console.warn("API returned no data or invalid format");
                        setproduct([]);
                    }

                } catch (error) {
                    console.error("Error fetching vendor data:", error);
                }
            };
            fetchdetaildata();
            fetchVendors();
        }
    }, [pcaid, userdetail]);

    const handleFormSubmission = async () => {
        try {
            const payload = {
                "grnaid": GRNAID ? GRNAID : GUID,
                "grntransactionid": "",
                "pcaid": formData.pcaid || '',
                "grndate": formData.GRNdate,
                "grnnumber": formData.GRNNo,
                "grnchallanno": formData.ChallanNo,
                "grnchallandate": formData.Challandate,
                "grnvechileno": formData.VechileNo,
                "grnvendor": formData.vendor,
                "grnconsigner": formData.Consigner,
                "grninspectedby": formData.InspectedBy,
                "grnnarration": formData.Naration,
                "companyid": userdetail?.companyID || "",
                "deptid": userdetail?.departmentID || "",
                "pcreff": formData.pcaid || '',
            };
            console.log("data payload", payload);

            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            // First API call
            const response1 = await axios.post(
                baseUrl.Url + "/backend/api/AddGoodReceiptNoteMaster",
                JSON.stringify(payload),
                { headers }
            );

            if (response1.status === 200) {
                console.log("Master saved successfully");
            } else {
                throw new Error("Failed to save Master data");
            }

            const payload2 = products?.map((product) => ({
                "grndaid": product.grndaid ? product.grndaid : ACSPLGUID.getNew(),
                "grnaid": GRNAID ? GRNAID : GUID,
                "grndproduct": product.Product,
                "grndepartment": userdetail?.departmentID || "",
                "grnduom": product.UOM,
                "grndchallanquantity": product.challanquantity,
                "grndshortquantity": 0,
                "grndexcessquantity": product.ExcessQty,
                "grndrejectedquantity": product.RejectedQty,
                "grndacceptedquantity": product.AcceptedQty,
                "grndrate": 0,
                "grnddiscount": 0,
                "grndtotalvalue": 0,
                "companyid": userdetail?.companyID || "",
                "deptid": userdetail?.departmentID || "",
                "expirydate": product.expirydate || "",
                "batchno": product.batchno || "",
            }));
            console.log("data payload TABLE2", payload2);

            // Second API call
            const response2 = await axios.post(
                baseUrl.Url + "/backend/api/AddGoodReceiptNoteDetails",
                JSON.stringify(payload2),
                { headers }
            );

            if (response2.status === 200) {
                console.log("Details saved successfully");
            } else {
                throw new Error("Failed to save Details data");
            }

            const payload3 = {
                "gaaid": formData.GAAID ? formData.GAAID : GUDID,
                "qcid": formData.pcaid || '',
                "grnaid": GRNAID ? GRNAID : GUID,
                "gacondition": formData.checkboxes.condition1,
                "gaamt": formData.checkboxes.condition2,
                "gaexpected": formData.checkboxes.condition3,
                "gapackage": formData.checkboxes.condition4,
                "gaconditiondescription": formData.descriptioncondition1,
                "gaamtdescription": formData.descriptioncondition2,
                "gaexpecteddescription": formData.descriptioncondition3,
                "gapackagedescription": formData.descriptioncondition4,
                "companyid": userdetail?.companyID || "",
                "deptid": userdetail?.departmentID || ""
            };
            console.log("data payload TABLE3", payload3);

            // Third API call
            const response3 = await axios.post(
                baseUrl.Url + "/backend/api/AddGoodReceiptNoteAssurance",
                JSON.stringify(payload3),
                { headers }
            );

            if (response3.status === 200) {
                console.log("Assurance saved successfully");

                // If all API calls are successful, show success message
                Swal.fire({
                    icon: "success",
                    title: "Saved!",
                    text: "Data saved successfully.",
                    confirmButtonText: "OK",
                }).then((result) => {
                    if (result.isConfirmed) {
                        const modal = document.getElementById("AddGRN");
                        if (modal) {
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
                            setFormData({
                                pcaid: formData.pcaid || '',
                                GAAID: '',
                                vendor: "",
                                PCVEMAIL: "",
                                PCVCONTACT: "",
                                PCCONSIGNER: "",
                                Naration: '',
                                InspectedBy: '',
                                Consigner: '',
                                seller: '',
                                VechileNo: '',
                                Challandate: '',
                                ChallanNo: '',
                                GRNdate: '',
                                GRNNo: '',
                                ExcessQty: '',
                                RejectedQty: '',
                                AcceptedQty: '',
                                descriptioncondition1: "",
                                descriptioncondition2: "",
                                descriptioncondition3: "",
                                descriptioncondition4: "",
                                checkboxes: {
                                    condition1: false,
                                    condition2: false,
                                    condition3: false,
                                    condition4: false,
                                    condition1No: false,
                                    condition2No: false,
                                    condition3No: false,
                                    condition4No: false,
                                },
                            });
                            setproduct();
                            setShowForm(false);
                            setPBCHALLANNO("");

                            const backdrop = document.querySelector(".modal-backdrop");
                            if (backdrop) {
                                backdrop.remove();
                            }
                        }
                    }
                });
            } else {
                throw new Error("Failed to save Assurance data");
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

    const handleInputChange = (e, productIndex = null, field = null) => {
        const { name, value } = e.target;
        const parsedValue = value === "" ? 0 : isNaN(parseInt(value, 10)) ? value : parseInt(value, 10);

        if (productIndex !== null && field) {
            const updatedProducts = [...products];
            updatedProducts[productIndex][field] = parsedValue;

            const challanNo = updatedProducts[productIndex].challanNo || 0;
            const rejectedQty = updatedProducts[productIndex].RejectedQty || 0;

            updatedProducts[productIndex].AcceptedQty = Math.max(challanNo - rejectedQty, 0);

            setproduct(updatedProducts);
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleFocus = (e, productIndex, field) => {
        if (products[productIndex][field] === 0) {
            const updatedProducts = [...products];
            updatedProducts[productIndex][field] = '';
            setproduct(updatedProducts);
        }
    };

    const handleBlur = (e, productIndex, field) => {
        if (e.target.value === '') {
            const updatedProducts = [...products];
            updatedProducts[productIndex][field] = 0;
            setproduct(updatedProducts);
        }
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        showConfirmationAlert(e);
        console.log("Form Data Submitted: ", formData);

    };


    const validateinput = (e) => {
        const { checkboxes } = formData;
        const {
            condition1,
            condition2,
            condition3,
            condition4,
            condition1No,
            condition2No,
            condition3No,
            condition4No,
        } = checkboxes;

        const validateYesNo = (yes, no, idYes, idNo) => {
            if ((!yes && !no) || (yes && no)) {
                Swal.fire({
                    icon: "error",
                    title: "Validation Error",
                    text: "Please select either Yes or No, but not both.",
                }).then(() => {
                    setTimeout(() => document.getElementById(yes ? idNo : idYes).focus(), 100);
                });
                return false;
            }
            return true;
        };

        if (!validateYesNo(condition1, condition1No, 'condition1', 'condition1No')) {
            return;
        }
        if (!validateYesNo(condition2, condition2No, 'condition2', 'condition2No')) {
            return;
        }
        if (!validateYesNo(condition3, condition3No, 'condition3', 'condition3No')) {
            return;
        }
        if (!validateYesNo(condition4, condition4No, 'condition4', 'condition4No')) {
            return;
        }
        handleSubmit(e);
    };

    useEffect(() => {
        const handleShortcut = (e) => {
            if (e.ctrlKey && (e.key === 'e' || e.key === 'E')) {
                e.preventDefault();
                showExitAlert();
            }
            if (e.ctrlKey && (e.key === 's' || e.key === 'S')) {
                e.preventDefault();
                validateinput(e);
            }
        };

        window.addEventListener('keydown', handleShortcut);

        return () => {
            window.removeEventListener('keydown', handleShortcut);
        };
    }, [navigate, formData]);

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
                const modal = document.getElementById("AddGRN");
                if (modal) {
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

                    setFormData({
                        pcaid: pcaid || '',
                        GAAID: '',
                        vendor: "",
                        PCVEMAIL: "",
                        PCVCONTACT: "",
                        PCCONSIGNER: "",
                        Naration: '',
                        InspectedBy: '',
                        Consigner: '',
                        seller: '',
                        VechileNo: '',
                        Challandate: '',
                        ChallanNo: '',
                        GRNdate: '',
                        GRNNo: '',
                        ExcessQty: '',
                        RejectedQty: '',
                        AcceptedQty: '',
                        descriptioncondition1: "",
                        descriptioncondition2: "",
                        descriptioncondition3: "",
                        descriptioncondition4: "",
                        checkboxes: {
                            condition1: false,
                            condition2: false,
                            condition3: false,
                            condition4: false,
                            condition1No: false,
                            condition2No: false,
                            condition3No: false,
                            condition4No: false,
                        },
                    })
                    setproduct();
                    setPBCHALLANNO("");
                    setShowForm(false);
                }
                const backdrop = document.querySelector(".modal-backdrop");
                if (backdrop) {
                    backdrop.remove();
                }
            }
        });
    };

    const handleSearch = async (PBCHALLANNO) => {
        if (PBCHALLANNO) {
            setShowForm(true);
            try {
                const payload = {
                    pctrnno: PBCHALLANNO,
                    companyid: userdetail?.companyID || "",
                    deptid: userdetail?.departmentID || "",
                };
                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };
                const response = await axios.post(
                    `${baseUrl.Url}/backend/api/GET_PChallanNoSearch`,
                    payload,
                    { headers }
                );
                if (response.status !== 200)
                    throw new Error("Failed to fetch vendor data");
                console.log("venderos", response.data)
                if (response.data.length > 0) {
                    setFormData(prevState => ({
                        ...prevState,
                        vendor: response.data[0].pcseller,
                        PCVEMAIL: response.data[0].email,
                        PCVCONTACT: response.data[0].contactnumber,
                        PCCONSIGNER: response.data[0].pcconsigner,
                        Consigner: response.data[0].pcconsigner,
                        seller: response.data[0].vendorname,
                        VechileNo: response.data[0].pcvno,
                        Challandate: convertToISODate(response.data[0].pcdate),
                        ChallanNo: response.data[0].pctrnno,

                    }));

                    const mappedProducts = response.data.map((item) => ({
                        Product: item.pcdproduct,
                        UOM: item.pcduom,
                        challanNo: item.pctrnno,
                        ExcessQty: 0,
                        RejectedQty: 0,
                        AcceptedQty: 0,
                        productname: item.productname,
                        uomtitle: item.producttitle,
                        batchno: item.batchno,
                        expirydate: item.expirydate,
                        hsncode: item.hsncode,
                        challanquantity: item.pcdquantity
                    }));
                    setproduct(mappedProducts);
                }
            } catch (error) {
                console.error("Error fetching vendor data:", error);
            }
        } else {
            Swal.fire({
                icon: "error",
                title: "Validation Error",
                text: "Please fill the Bill Number ",
            }).then(() => {
                PBCHALLANNOref.current.focus();
            })
        }
    }

    return (
        <div>
            <div
                className="modal fade"
                id="AddGRN"
                tabIndex={-1}
                aria-labelledby="exampleModalFullscreenLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-fullscreen mbgcolor">
                    <div className="modal-content mbgcolor">
                        <div className="modal-body mbgcolor">
                            <div className="modal-content mbgcolor">
                                <div className="page-wrapper-new p-0 mbgcolor " >
                                    <div className="content mbgcolor">
                                        <div className="modal-header border-0 custom-modal-header">
                                            <div className="page-title">
                                                <h3>Good Recepite Note</h3>
                                            </div>
                                            {!showForm && (
                                                <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-4">
                                                    <div className="search-input d-flex flex-column flex-sm-row ">
                                                        <input
                                                            ref={PBCHALLANNOref}
                                                            type="text"
                                                            placeholder="Enter Challan No."
                                                            className="form-control w-100"
                                                            name="challanNo"
                                                            value={PBCHALLANNO}
                                                            title="Bill Number only contains Numbers."
                                                            onChange={(e) => setPBCHALLANNO(e.target.value)}
                                                        />

                                                        <button
                                                            type="button"
                                                            className="btn btn-primary ms-3 mt-1 mt-sm-0"
                                                            onClick={() => handleSearch(PBCHALLANNO)}
                                                        >
                                                            Search
                                                        </button>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="d-flex justify-content-between align-items-center">

                                                <ul className="table-top-head">
                                                    <li>
                                                        <div className="page-btn">
                                                            <Link className="btn btn-secondary"
                                                                aria-label="Close"
                                                                //   data-bs-dismiss="modal"
                                                                onClick={showExitAlert}>
                                                                <ArrowLeft className="me-2" />
                                                                Back to index
                                                            </Link>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="modal-body custom-modal-body">
                                            {showForm && (
                                                <form onSubmit={handleSubmit}>
                                                    <div className="row">
                                                        <div className="col-lg-2 col-md-6 col-sm-12">
                                                            <div >
                                                                <label className="form-label">GRN No</label>
                                                                <input
                                                                    type="number"
                                                                    className="form-control"
                                                                    name="GRNNo"
                                                                    onChange={handleInputChange}
                                                                    value={formData.GRNNo || ''}
                                                                    ref={GRNRef}
                                                                />
                                                            </div>
                                                        </div>


                                                        <div className="col-lg-2 col-md-6 col-sm-12">
                                                            <div >
                                                                <label className="form-label">GRN Date</label>
                                                                <input
                                                                    type="date"
                                                                    className="form-control"
                                                                    value={formData.GRNdate || ''}
                                                                    placeholder="Choose Date"
                                                                    onChange={handleInputChange}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-2 col-md-6 col-sm-12">
                                                            <div >
                                                                <label className="form-label">Challan No</label>
                                                                <input type="text"
                                                                    className="form-control"
                                                                    name="ChallanNo"
                                                                    onChange={handleInputChange}
                                                                    value={formData.ChallanNo || ''}
                                                                    readOnly
                                                                />
                                                            </div>
                                                        </div>


                                                        <div className="col-lg-2 col-md-6 col-sm-12">
                                                            <div >
                                                                <label className="form-label">Challan Date</label>
                                                                <input type="text" className="form-control"
                                                                    name="Challandate"
                                                                    onChange={handleInputChange}
                                                                    value={formData.Challandate || ''}
                                                                    readOnly
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-2 col-md-6 col-sm-12">
                                                            <div >
                                                                <label className="form-label">Vechile No</label>
                                                                <input type="text" className="form-control"
                                                                    name="VechileNo"
                                                                    onChange={handleInputChange}
                                                                    value={formData.VechileNo || ''}
                                                                    readOnly
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="row">
                                                        <div className="col-lg-4 col-md-4 col-sm-12">
                                                            <div className="">
                                                                <label className="form-label">vendor name</label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control border"
                                                                    name="seller"
                                                                    value={formData.seller || ''}
                                                                    onChange={handleInputChange}
                                                                    readOnly
                                                                // onKeyDown={(e) => handleKeyDown(e, PCPOSUPPLYRef)}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-3 col-md-4 col-sm-12">
                                                            <div className="">
                                                                <label className="form-label">vendor Email</label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control border"
                                                                    name="PCVEMAIL"
                                                                    value={formData.PCVEMAIL || ''}
                                                                    onChange={handleInputChange}
                                                                    readOnly
                                                                // onKeyDown={(e) => handleKeyDown(e, PCPOSUPPLYRef)}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-2 col-md-4 col-sm-12">
                                                            <div className="">
                                                                <label className="form-label">vendor contact</label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control border"
                                                                    name="PCVCONTACT"
                                                                    value={formData.PCVCONTACT || ''}
                                                                    onChange={handleInputChange}
                                                                    readOnly
                                                                // onKeyDown={(e) => handleKeyDown(e, PCPOSUPPLYRef)}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-3 col-md-4 col-sm-12">
                                                            <div className="">
                                                                <label className="form-label text-dark">Consigner</label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control border"
                                                                    name="PCCONSIGNER"
                                                                    value={formData.PCCONSIGNER || ''}
                                                                    readOnly
                                                                    onChange={handleInputChange}
                                                                // onKeyDown={(e) => handleKeyDown(e, PCPOSUPPLYRef)}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="row">

                                                        <div className="col-lg-12 col-md-6 col-sm-12">
                                                            <div >
                                                                <label className="form-label">Inspected By </label>
                                                                <input
                                                                    type="text"
                                                                    placeholder="Please enter Inspected Person Name"
                                                                    name="InspectedBy"
                                                                    className="form-control"
                                                                    onChange={handleInputChange}
                                                                    value={formData.InspectedBy || ''}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="col-lg-12">
                                                        <div >
                                                            <label className="form-label">Naration </label>
                                                            <textarea
                                                                placeholder="Please enter Naration"
                                                                name="Naration"
                                                                className="form-control"
                                                                onChange={handleInputChange}
                                                                value={formData.Naration || ''}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-12">
                                                        <div className="border p-3 rounded shadow-sm mb-4">
                                                            <div className="modal-body-table">

                                                                <div className="table-responsive">

                                                                    <table className="table table-bordered">

                                                                        <thead className="thead-dark">
                                                                            <tr>
                                                                                <th className="col-4 " style={{ textAlign: "center" }}>Product</th>
                                                                                <th className="col-1 " style={{ textAlign: "center" }}>HSN Code</th>
                                                                                <th className="col-1 " style={{ textAlign: "center" }}>Batch No</th>
                                                                                <th className="col-1 " style={{ textAlign: "center" }}>Expiry Date</th>
                                                                                <th className="col-1 " style={{ textAlign: "center" }}>UOM</th>
                                                                                <th className="col-1 " style={{ textAlign: "center" }}>Challan Qty</th>

                                                                                <th className="col-1 " style={{ textAlign: "center" }}>Excess Qty</th>
                                                                                <th className="col-1 " style={{ textAlign: "center" }}>Rejected Qty</th>
                                                                                <th className="col-1 " style={{ textAlign: "center" }}>Accepted Qty</th>


                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {Array.isArray(products) && products.map((product, index) => (
                                                                                <tr key={index}>
                                                                                    <td className="col-" style={{ padding: '8px 10px', textAlign: "left" }}>{product.productname}</td>
                                                                                    <td className="col-1" style={{ padding: '8px 10px', textAlign: "left" }}>{product.hsncode}</td>
                                                                                    <td className="col-1" style={{ padding: '8px 10px', textAlign: "left" }}>{product.batchno}</td>
                                                                                    <td className="col-1" style={{ padding: '8px 10px', textAlign: "left" }}>{product.expirydate}</td>
                                                                                    <td className="col-1" style={{ padding: '8px 10px', textAlign: "left" }}>{product.uomtitle}</td>
                                                                                    <td className="col-1" style={{ padding: '8px 10px', textAlign: "right" }}>{product.challanquantity}</td>
                                                                                    <td className="col-1" style={{ padding: '8px 10px', textAlign: "right" }}>
                                                                                        <input
                                                                                            type="number"
                                                                                            value={product.ExcessQty}
                                                                                            className="form-control form-control-sm border-0 border-bottom border-primary"
                                                                                            onChange={(e) => handleInputChange(e, index, 'ExcessQty')}
                                                                                            onFocus={(e) => handleFocus(e, index, 'ExcessQty')}
                                                                                            onBlur={(e) => handleBlur(e, index, 'ExcessQty')}
                                                                                            style={{ height: '30px' }}
                                                                                            min={0}
                                                                                            readOnly
                                                                                        />
                                                                                    </td>
                                                                                    <td className="col-1" style={{ padding: '8px 10px', textAlign: "right" }}>
                                                                                        <input
                                                                                            type="number"
                                                                                            value={product.RejectedQty}
                                                                                            className="form-control form-control-sm border-0 border-bottom border-primary"
                                                                                            onChange={(e) => handleInputChange(e, index, 'RejectedQty')}
                                                                                            onFocus={(e) => handleFocus(e, index, 'RejectedQty')}
                                                                                            onBlur={(e) => handleBlur(e, index, 'RejectedQty')}
                                                                                            style={{ height: '30px' }}
                                                                                            min={0}
                                                                                        />
                                                                                    </td>
                                                                                    <td className="col-1" style={{ padding: '8px 10px', textAlign: "right" }}>
                                                                                        {product.AcceptedQty}
                                                                                    </td>
                                                                                </tr>
                                                                            ))}

                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-12">
                                                        <h4>Quality & Quantity Assurance</h4>
                                                        <div className="border p-3 rounded shadow-sm mb-4">

                                                            <div className="modal-body-table">


                                                                <div className="table-responsive">

                                                                    <table className="table table-bordered">

                                                                        <thead className="thead-dark">
                                                                            <tr>
                                                                                <th className="col-4 "> Check Quality & Quantity</th>
                                                                                <th className="col-1 ">Yes</th>
                                                                                <th className="col-1 ">No</th>
                                                                                <th className="col-4 " style={{ textAlign: "center" }}>Description</th>

                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            <tr>
                                                                                <td>
                                                                                    <label className="form-check-label  form-label required" htmlFor="condition1">
                                                                                        Is the product in good condition without any damage?
                                                                                    </label>
                                                                                </td>
                                                                                <td>

                                                                                    <input
                                                                                        className="form-check-input"
                                                                                        type="radio"
                                                                                        name="condition1"
                                                                                        id="condition1"
                                                                                        required
                                                                                        checked={formData.checkboxes.condition1 || ''}
                                                                                        onChange={() => {
                                                                                            setFormData((prev) => {
                                                                                                const updatedFormData = {
                                                                                                    ...prev,
                                                                                                    checkboxes: {
                                                                                                        ...prev.checkboxes,
                                                                                                        condition1: true,
                                                                                                        condition1No: false, // Uncheck the "No" option
                                                                                                    },
                                                                                                };
                                                                                                console.log(updatedFormData); // Log updated data to console
                                                                                                return updatedFormData;
                                                                                            });
                                                                                        }}
                                                                                    />
                                                                                </td>
                                                                                <td>

                                                                                    <input
                                                                                        className="form-check-input"
                                                                                        type="radio"
                                                                                        name="condition1"
                                                                                        id="condition1No"
                                                                                        required
                                                                                        checked={formData.checkboxes.condition1No || ''}
                                                                                        onChange={() => {
                                                                                            setFormData((prev) => {
                                                                                                const updatedFormData = {
                                                                                                    ...prev,
                                                                                                    checkboxes: {
                                                                                                        ...prev.checkboxes,
                                                                                                        condition1: false,
                                                                                                        condition1No: true,
                                                                                                    },
                                                                                                };
                                                                                                console.log(updatedFormData);
                                                                                                return updatedFormData;
                                                                                            });
                                                                                        }}
                                                                                    />
                                                                                </td>

                                                                                <td>
                                                                                    <textarea
                                                                                        type="text"
                                                                                        className="form-control "
                                                                                        placeholder="Enter description"
                                                                                        value={formData.descriptioncondition1 || ''}
                                                                                        onChange={(e) =>
                                                                                            setFormData((prev) => ({ ...prev, descriptioncondition1: e.target.value }))
                                                                                        }
                                                                                    />
                                                                                </td>

                                                                            </tr>
                                                                            <tr>
                                                                                <td>
                                                                                    <label className="form-check-label form-label required" htmlFor="condition2">
                                                                                        Did you receive the correct amount of items you ordered?
                                                                                    </label>
                                                                                </td>
                                                                                <td>

                                                                                    <input
                                                                                        className="form-check-input"
                                                                                        type="radio"
                                                                                        required
                                                                                        name="condition2Group"  // Same name for both radio buttons
                                                                                        id="condition2"
                                                                                        checked={formData.checkboxes.condition2 || ''}
                                                                                        onChange={() => {
                                                                                            setFormData((prev) => ({
                                                                                                ...prev,
                                                                                                checkboxes: {
                                                                                                    ...prev.checkboxes,
                                                                                                    condition2: true,
                                                                                                    condition2No: false, // Uncheck the "No" radio button
                                                                                                },
                                                                                            }));
                                                                                        }}
                                                                                    />
                                                                                </td>
                                                                                <td>
                                                                                    <input
                                                                                        className="form-check-input"
                                                                                        type="radio"
                                                                                        name="condition2Group"  // Same name for both radio buttons
                                                                                        id="condition2No"
                                                                                        required
                                                                                        checked={formData.checkboxes.condition2No || ''}
                                                                                        onChange={() => {
                                                                                            setFormData((prev) => ({
                                                                                                ...prev,
                                                                                                checkboxes: {
                                                                                                    ...prev.checkboxes,
                                                                                                    condition2: false, // Uncheck the "Yes" radio button
                                                                                                    condition2No: true,
                                                                                                },
                                                                                            }));
                                                                                        }}
                                                                                    />
                                                                                </td>

                                                                                <td>
                                                                                    <textarea
                                                                                        type="text"
                                                                                        className="form-control "
                                                                                        placeholder="Enter description"
                                                                                        value={formData.descriptioncondition2 || ''}
                                                                                        onChange={(e) =>
                                                                                            setFormData((prev) => ({ ...prev, descriptioncondition2: e.target.value }))
                                                                                        }
                                                                                    />
                                                                                </td>

                                                                            </tr>
                                                                            <tr>
                                                                                <td>
                                                                                    <label className="form-check-label form-label required" htmlFor="condition3">
                                                                                        Does everything look and work as expected?
                                                                                    </label>
                                                                                </td>
                                                                                <td>
                                                                                    <input
                                                                                        className="form-check-input"
                                                                                        type="radio"
                                                                                        required
                                                                                        name="condition3Group"
                                                                                        id="condition3"
                                                                                        checked={formData.checkboxes.condition3 || ''}
                                                                                        onChange={() => {
                                                                                            setFormData((prev) => ({
                                                                                                ...prev,
                                                                                                checkboxes: {
                                                                                                    ...prev.checkboxes,
                                                                                                    condition3: true,
                                                                                                    condition3No: false, // Uncheck the "No" checkbox
                                                                                                },
                                                                                            }));
                                                                                        }}
                                                                                    />

                                                                                </td>

                                                                                <td>
                                                                                    <input
                                                                                        className="form-check-input"
                                                                                        type="radio"
                                                                                        name="condition3Group"
                                                                                        id="condition3No"
                                                                                        checked={formData.checkboxes.condition3No || ''}
                                                                                        onChange={() => {
                                                                                            setFormData((prev) => ({
                                                                                                ...prev,
                                                                                                checkboxes: {
                                                                                                    ...prev.checkboxes,
                                                                                                    condition3: false, // Uncheck the "Yes" checkbox
                                                                                                    condition3No: true,
                                                                                                },
                                                                                            }));
                                                                                        }}
                                                                                    />
                                                                                </td>

                                                                                <td>
                                                                                    <textarea
                                                                                        type="text"
                                                                                        className="form-control "
                                                                                        placeholder="Enter description"
                                                                                        value={formData.descriptioncondition3 || ''}
                                                                                        onChange={(e) =>
                                                                                            setFormData((prev) => ({ ...prev, descriptioncondition3: e.target.value }))
                                                                                        }
                                                                                    />
                                                                                </td>

                                                                            </tr>
                                                                            <tr>
                                                                                <td>
                                                                                    <label className="form-check-label form-label required" htmlFor="condition4">
                                                                                        Is the packaging secure and protective for all the items?
                                                                                    </label>
                                                                                </td>
                                                                                <td>
                                                                                    <input
                                                                                        className="form-check-input"
                                                                                        type="radio"
                                                                                        name="condition4Group"
                                                                                        required
                                                                                        id="condition4"
                                                                                        checked={formData.checkboxes.condition4 || ''}
                                                                                        onChange={() => {
                                                                                            setFormData((prev) => ({
                                                                                                ...prev,
                                                                                                checkboxes: {
                                                                                                    ...prev.checkboxes,
                                                                                                    condition4: true,
                                                                                                    condition4No: false, // Uncheck the "No" checkbox
                                                                                                },
                                                                                            }));
                                                                                        }}
                                                                                    />
                                                                                </td>
                                                                                <td>
                                                                                    <input
                                                                                        className="form-check-input"
                                                                                        type="radio"
                                                                                        name="condition4Group"
                                                                                        required
                                                                                        id="condition4No"
                                                                                        checked={formData.checkboxes.condition4No || ''}
                                                                                        onChange={() => {
                                                                                            setFormData((prev) => ({
                                                                                                ...prev,
                                                                                                checkboxes: {
                                                                                                    ...prev.checkboxes,
                                                                                                    condition4: false,
                                                                                                    condition4No: true,
                                                                                                },
                                                                                            }));
                                                                                        }}
                                                                                    />
                                                                                </td>

                                                                                <td>
                                                                                    <textarea
                                                                                        type="text"
                                                                                        className="form-control "
                                                                                        placeholder="Enter description"
                                                                                        value={formData.descriptioncondition4 || ''}
                                                                                        onChange={(e) =>
                                                                                            setFormData((prev) => ({ ...prev, descriptioncondition4: e.target.value }))
                                                                                        }
                                                                                    />
                                                                                </td>

                                                                            </tr>

                                                                        </tbody>
                                                                    </table>

                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="accordion-card-one accordion" id="accordionExample4">
                                                        <div className="accordion-item">
                                                            <div className="accordion-header" id="headingFour">
                                                                <div
                                                                    className=" d-flex justify-content-between align-items-center"
                                                                    data-bs-toggle="collapse"
                                                                    data-bs-target="#collapseFour"
                                                                    aria-controls="collapseFour"
                                                                >

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
                                                                <div className="custom-filed">
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-12">
                                                        <div className="modal-footer-btn">
                                                            <button
                                                                type="button"
                                                                className="btn btn-cancel me-2"

                                                                onClick={showExitAlert}
                                                            >
                                                                Exist
                                                            </button>
                                                            <button type="submit" className="btn btn-submit" >
                                                                Save
                                                            </button>
                                                        </div>
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
            </div>

        </div>
    )
}

export default AddGoodReciptNote
