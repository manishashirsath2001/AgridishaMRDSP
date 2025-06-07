import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    // ChevronUp,
    // Edit,
    // Eye,
    // PlusCircle,
    // RotateCcw,
    // Trash2,
} from "feather-icons-react/build/IconComponents";
//import { all_routes } from "../../Router/all_routes";
import Swal from "sweetalert2";
//import { ACSPLGUID, baseUrl } from "../../core/json/custom";
import withReactContent from "sweetalert2-react-content";
import axios from 'axios';
// import { all_routes } from "../../Router/all_routes";
import { ACSPLGUID, baseUrl, convertToISODate } from "../../core/json/custom";
import { getUserData } from "../../Context/UserData";
import Select from "react-select";
function AddPurchaseInvoice({ PBAID }) {
    const { userdetail } = getUserData();
    const navigate = useNavigate();
    // const route = all_routes;
    const GUID = ACSPLGUID.getNew();
    // const location = useLocation();
    // const { PBAID, PBDAID } = location.state || {};
    // console.log("PBAID", PBAID, PBDAID)
    // const PBAID = 
    const [PBCHALLANNO, setPBCHALLANNO] = useState('');
    const PBNARRATIONRef = useRef(null);
    const PBTERMANDCONDITIONRef = useRef(null);
    const PBDUEDATERef = useRef(null);
    const [showForm, setShowForm] = useState(false);
    const [states, setstates] = useState([]);
    const [paymentmode, setpaymentmode] = useState([]);
    const [formData, setFormData] = useState({
        PBBILLNO: "",
        PBBILLDATE: new Date().toISOString().split("T")[0],
        PBDUEDATE: "",
        PBVEHICALNO: "",
        PBPOSUPPLY: "",
        PBSUPPLYNAME: "",
        PBCONSIGNER: "",
        PBTRANSPORT: "",
        PBDISCOUNT: "",
        PBNETAMOUNT: "",
        PBTERMANDCONDITION: "",
        PBNARRATION: "",
        PBCHALLANNO: "",
        PBVENDORID: "",
        PBVENDORNAME: "",
        PBVENDORBID: "",
        PBVENDORCONTACT: "",
        PBVENDOREMAIL: "",
        PCAID: "",
        PMODE: "",
    });

    const [data, setData] = useState([]);


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
        fetchstates();
    }, []);


    useEffect(() => {
        if (PBAID) {
            setShowForm(true);
            const fetchMasterData = async () => {
                try {
                    const payload = {
                        pbaid: PBAID,
                        keyword: "%",
                        companyid: userdetail?.companyID || "",
                        deptid: userdetail?.departmentID || "",
                    };
                    const headers = {
                        "Content-Type": "application/json",
                        Accept: "*/*",
                    };
                    const response = await axios.post(
                        `${baseUrl.Url}/backend/api/GET_PBillMaster`,
                        payload,
                        { headers }
                    );
                    if (response.status !== 200)
                        throw new Error("Failed to fetch vendor data");
                    console.log("quatation master", response.data)
                    const Data = response.data[0];
                    setFormData({
                        PBBILLNO: Data.pbbillno,
                        PBBILLDATE: convertToISODate(Data.pbbilldate),
                        PBDUEDATE: convertToISODate(Data.pbduedate),
                        PBVEHICALNO: Data.pbvehicalno,
                        PBPOSUPPLY: states.find(item => item.value === Data.pbposupply)?.value || '',
                        PBSUPPLYNAME: Data.pbposupply,
                        PBCONSIGNER: Data.pbconsigner,
                        PBTRANSPORT: states.find(item => item.value === Data.pbtransport)?.value || '',
                        PBDISCOUNT: Data.pbdiscount,
                        PBNETAMOUNT: Data.pbnetamount,
                        PBTERMANDCONDITION: Data.pbtermandcondition,
                        PBNARRATION: Data.pbnarration,
                        PBCHALLANNO: Data.pbchallanno,
                        PBVENDORID: Data.pbvendorid,
                        PBVENDORNAME: Data.vendorname,
                        PBVENDORBID: Data.vbillno,
                        PBVENDORCONTACT: Data.vendorcontact,
                        PBVENDOREMAIL: Data.vendoremail,
                        PCAID: Data.pcreff,
                        PMODE: paymentmode.find(item => item.value === Data.paymentmode)?.value || '',
                    })

                    setPBCHALLANNO(Data.pbchallanno);
                } catch (error) {
                    console.error("Error fetching vendor data:", error);
                }
            };
            const fetchDetailsData = async () => {
                try {
                    const payload = {
                        pbaid: PBAID,
                        companyid: userdetail?.companyID || "",
                        deptid: userdetail?.departmentID || "",
                    };
                    const headers = {
                        "Content-Type": "application/json",
                        Accept: "*/*",
                    };
                    const response = await axios.post(
                        `${baseUrl.Url}/backend/api/GET_PBillDetailsData`,
                        payload,
                        { headers }
                    );
                    if (response.status !== 200)
                        throw new Error("Failed to fetch vendor data");
                    console.log("quatation master", response.data)
                    const mappedProducts = response.data.map((item) => ({
                        PBPRODUCT: item.pbproduct,
                        PBDQUANTITY: item.pbdquantity,
                        PBDUOM: item.pbduom,
                        PBDUOMTITLE: item.uomtitle,
                        PBDRATE: item.pbdrate,
                        PBDTAMT: item.pbdtamt,
                        PBDCGST: item.pbdcgst,
                        PBDSGST: item.pbdsgst,
                        PBDIGST: item.pbdigst,
                        PRODUCTNAME: item.productname,
                        total: item.pbdtamt,
                        hsncode: item.hsncode,
                        batchno: item.batchno,
                        expirydate: item.expirydate
                    }));

                    setData(mappedProducts);

                } catch (error) {
                    console.error("Error fetching vendor data:", error);
                }
            };
            fetchDetailsData()
            fetchMasterData();
        }
    }, [PBAID]);

    useEffect(() => {
        if (data) {
            const grandTotal = data.reduce((total, product) => total + parseFloat(product.total || 0), 0);
            const transport = parseFloat(formData.PBTRANSPORT || 0);
            const discount = parseFloat(formData.PBDISCOUNT || 0);
            const netAmount = grandTotal + transport - discount;
            setFormData((prev) => ({
                ...prev,
                PBNETAMOUNT: netAmount.toFixed(2),
            }));
        }
    }, [data, formData.PBTRANSPORT, formData.PBDISCOUNT]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        const updatedValue = value.replace(/^\s+/, "");

        setFormData({
            ...formData,
            [name]: updatedValue,
        });
    };

    const handleSearch = async () => {
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
                        PBVEHICALNO: response.data[0].pcvno,
                        PBPOSUPPLY: states.find((state) => state.value == response.data[0].pcposupply)?.value || "",
                        PBCONSIGNER: response.data[0].pcconsigner,
                        PBCHALLANNO: response.data[0].pctrnno,
                        PBVENDORID: response.data[0].pcseller,
                        PBVENDORNAME: response.data[0].vendorname,
                        PBVENDORBID: "",
                        PBVENDORCONTACT: response.data[0].contactnumber,
                        PBVENDOREMAIL: response.data[0].email,
                        PCAID: response.data[0].pcaid,
                        PMODE: paymentmode.find(item => item.value === response.data[0].paymentmode)?.value || '',

                    }));

                    const mappedProducts = response.data.map((item) => ({
                        PBPRODUCT: item.pcdproduct,
                        PBDQUANTITY: item.pcdquantity,
                        PBDUOM: item.pcduom,
                        PBDUOMTITLE: item.producttitle,
                        PBDRATE: item.pcdrate,
                        PBDTAMT: item.pcdtamt,
                        PBDCGST: item.pcdcgst,
                        PBDSGST: item.pcdsgst,
                        PBDIGST: item.pcdigst,
                        PRODUCTNAME: item.productname,
                        total: item.pcdtamt,
                        hsncode: item.hsncode,
                        batchno: item.batchno,
                        expirydate: item.expirydate
                    }));

                    setData(mappedProducts);
                }
            } catch (error) {
                console.error("Error fetching vendor data:", error);
            }

        }
    };

    useEffect(() => {
        const handleShortcut = (e) => {
            if (e.ctrlKey && e.key === 'e') {
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
    }, [formData, navigate]);



    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("Form Data:", formData);
        console.log("Product Table Data:", data);

        const form = event.target.closest("form");
        if (!form.checkValidity()) {
            form.reportValidity();
            setData();
            return;

        }

        showConfirmationAlert(event);
    };


    const handleFormSubmission = async () => {
        try {
            const payload1 = {
                pbaid: PBAID ? PBAID : GUID,
                pbvendorid: formData.PBVENDORID,
                pbconsigner: formData.PBCONSIGNER,
                pbvehicalno: formData.PBVEHICALNO,
                pbposupply: formData.PBPOSUPPLY,
                pbbillno: formData.PBBILLNO,
                pbdate: formData.PBBILLDATE,
                pbduedate: formData.PBDUEDATE,
                pbbilldate: formData.PBBILLDATE,
                pbnarration: formData.PBNARRATION,
                pbtransport: formData.PBTRANSPORT,
                pbtermandcondition: formData.PBTERMANDCONDITION,
                companyid: userdetail?.companyID || "",
                deptid: userdetail?.departmentID || "",
                pbchallanno: formData.PBCHALLANNO,
                pbdiscount: parseFloat(formData.PBDISCOUNT) || 0,
                pbnetamount: parseFloat(formData.PBNETAMOUNT) || 0,
                vbillno: formData.PBVENDORBID,
                qnodays: 0,
                qpaymentterms: "",
                qpduedate: "",
                pcreff: formData.PCAID,
                paymentmode: formData.PMODE
            };

            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            console.log("Payload 1:", payload1);

            // First API Call
            const response1 = await axios.post(baseUrl.Url + "/backend/api/AddUpdPBillMaster", payload1, { headers });

            if (response1.status === 200) {
                if (data.length > 0) {
                    const payload2 = data.map((product) => ({
                        pbdaid: product.PBDAID ? product.PBDAID : ACSPLGUID.getNew(),
                        pbaid: PBAID ? PBAID : GUID,
                        pbproduct: product.PBPRODUCT,
                        pbduom: product.PBDUOM,
                        pbdquantity: product.PBDQUANTITY,
                        pbdrate: product.PBDRATE,
                        pbdtamt: product.PBDTAMT,
                        pbdigst: product.PBDIGST,
                        pbdsgst: product.PBDSGST,
                        pbdcgst: product.PBDCGST,
                        companyid: userdetail?.companyID || "",
                        deptid: userdetail?.departmentID || "",
                        hsncode: product.hsncode,
                        batchno: product.batchno,
                        expirydate: product.expirydate,
                    }));

                    console.log("Payload 2:", payload2);

                    // Second API Call
                    const response2 = await axios.post(baseUrl.Url + "/backend/api/AddUpdPBillDetails", payload2, { headers });

                    if (response2.status === 200) {
                        Swal.fire({
                            icon: "success",
                            title: "Saved!",
                            text: "Data saved successfully.",
                            confirmButtonText: "OK",
                        }).then((result) => {
                            if (result.isConfirmed) {
                                const modal = document.getElementById("AddPurchaseInvoice");
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
                                    PBBILLNO: "",
                                    PBBILLDATE: new Date().toISOString().split("T")[0],
                                    PBDUEDATE: "",
                                    PBVEHICALNO: "",
                                    PBPOSUPPLY: "",
                                    PBSUPPLYNAME: "",
                                    PBCONSIGNER: "",
                                    PBTRANSPORT: "",
                                    PBDISCOUNT: "",
                                    PBNETAMOUNT: "",
                                    PBTERMANDCONDITION: "",
                                    PBNARRATION: "",
                                    PBCHALLANNO: "",
                                    PBVENDORID: "",
                                    PBVENDORNAME: "",
                                    PBVENDORBID: "",
                                    PBVENDORCONTACT: "",
                                    PBVENDOREMAIL: "",
                                    PCAID: "",
                                    PMODE: "",
                                });

                                setData([]);
                            }
                            const backdrop = document.querySelector(".modal-backdrop");
                            if (backdrop) {
                                backdrop.remove();
                            }
                        });
                    }
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



    const MySwal = withReactContent(Swal);
    const showConfirmationAlert = (event) => {
        MySwal.fire({
            title: "तुला खात्री आहे का?",
            text: "तुम्हाला हा डेटा सेव्ह करायचा आहे का?",
            showCancelButton: true,
            confirmButtonColor: "#00ff00",
            confirmButtonText: "जतन करा",
            cancelButtonColor: "#092C4C",
            cancelButtonText: "रद्द करा",
        }).then((result) => {
            if (result.isConfirmed) {
                handleFormSubmission(event);
            }
        });
    };

    const showExitAlert = () => {
        MySwal.fire({
            title: "तुला खात्री आहे का?",
            text: "तुम्हाला बाहेर पडायचं आहे का?",
            showCancelButton: true,
            confirmButtonColor: "#00ff00",
            confirmButtonText: "होय",
            cancelButtonColor: "#092C4C",
            cancelButtonText: "नाही",
        }).then((result) => {
            if (result.isConfirmed) {
                const modal = document.getElementById("AddPurchaseInvoice");
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
                        PBBILLNO: "",
                        PBBILLDATE: new Date().toISOString().split("T")[0],
                        PBDUEDATE: "",
                        PBVEHICALNO: "",
                        PBPOSUPPLY: "",
                        PBSUPPLYNAME: "",
                        PBCONSIGNER: "",
                        PBTRANSPORT: "",
                        PBDISCOUNT: "",
                        PBNETAMOUNT: "",
                        PBTERMANDCONDITION: "",
                        PBNARRATION: "",
                        PBCHALLANNO: "",
                        PBVENDORID: "",
                        PBVENDORNAME: "",
                        PBVENDORBID: "",
                        PBVENDORCONTACT: "",
                        PBVENDOREMAIL: "",
                        PCAID: "",
                        PMODE: "",
                    });

                    setData();

                }
                const backdrop = document.querySelector(".modal-backdrop");
                if (backdrop) {
                    backdrop.remove();
                }
            }
        });
    };
    const checkFormValidity = (e) => {
        const { PBDUEDATE, PBTERMANDCONDITION, PBNARRATION } = formData;

        if (!PBDUEDATE) {
            Swal.fire({
                icon: "error",
                title: "Validation Error",
                text: "कृपया एक वैध तारीख प्रविष्ट करा.",
            }).then(() => {
                PBDUEDATERef.current?.focus();
            });
            return;
        }


        if (!PBTERMANDCONDITION || PBTERMANDCONDITION.trim() === "") {
            Swal.fire({
                icon: "error",
                title: "Validation Error",
                text: "कृपया अटी आणि शर्ती प्रविष्ट करा.",
            }).then(() => {
                PBTERMANDCONDITIONRef.current?.focus();
            });
            return;
        }

        if (!PBNARRATION || PBNARRATION.trim() === "") {
            Swal.fire({
                icon: "error",
                title: "Validation Error",
                text: "कृपया वर्णन प्रविष्ट करा.",
            }).then(() => {
                PBNARRATIONRef.current?.focus();
            });
            return;
        }
        handleSubmit(e);

    };

    const handleDropdownChange = (selectedOption, field) => {
        setFormData(prevData => ({
            ...prevData,
            [field]: selectedOption ? selectedOption.value : "",
        }));
    }
    return (
        <div>
            <div
                className="modal fade"
                id="AddPurchaseInvoice"
                tabIndex={-1}
                aria-labelledby="exampleModalFullscreenLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-fullscreen">
                    <div className="modal-content">

                        <div className="modal-body">
                            <div className="modal-content">
                                <div className="page-wrapper-new p-0">
                                    <div className="content">
                                        <div className="modal-header border-0 custom-modal-header">
                                            <div className="page-title">
                                                <h4>खरेदी बिल</h4>
                                            </div>

                                            <div className="page-btn">
                                                <Link className="btn btn-secondary"
                                                    aria-label="Close"
                                                    //   data-bs-dismiss="modal"
                                                    onClick={showExitAlert}
                                                >
                                                    <ArrowLeft className="me-2" />
                                                    अनुक्रमणिकेकडे परत
                                                </Link>
                                            </div>
                                        </div>

                                        {!showForm && (
                                            <div className="row justify-content-center m-1">
                                                <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-4">
                                                    <div className="search-input d-flex align-items-center">
                                                        <input
                                                            type="number"
                                                            placeholder="Search challan No"
                                                            className="form-control w-100"
                                                            value={PBCHALLANNO}
                                                            onChange={(e) => setPBCHALLANNO(e.target.value)}
                                                            pattern="^\d+$"
                                                            title="Must contain only numbers"
                                                        />
                                                        <button
                                                            type="button"
                                                            className="btn btn-primary ms-3 mt-1 mt-sm-0"
                                                            onClick={handleSearch}
                                                        >
                                                            शोधणे
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <div className="modal-body custom-modal-body">
                                            {showForm && (
                                                <form onSubmit={handleSubmit}>
                                                    <div className="row">
                                                        <div className="col-lg-3 col-md-3 col-12">
                                                            <div className="mb-3 add-product">
                                                                <label className="form-label">बिल क्रमांक</label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    placeholder="Enter Number"
                                                                    name="PBBILLNO"
                                                                    value={formData.PBBILLNO}
                                                                    onChange={handleInputChange}
                                                                    pattern="^\d+$"
                                                                    title="Must contain only numbers"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-3 col-sm-12">
                                                            <div className="mb-3 add-product">
                                                                <label className="form-label ">बिल दिनांक:</label>
                                                                <div className="input-groupicon calender-input">
                                                                    <input
                                                                        type="date"
                                                                        className="form-control"
                                                                        value={formData.PBBILLDATE}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-3 col-sm-12">
                                                            <div className="mb-3 add-product">
                                                                <label className="form-label  required">देय तारीख</label>
                                                                <div className="input-groupicon calender-input">
                                                                    <input
                                                                        type="date"
                                                                        className="form-control"
                                                                        ref={PBDUEDATERef}
                                                                        value={formData.PBDUEDATE}
                                                                        onChange={(e) => setFormData((prev) => ({
                                                                            ...prev,
                                                                            PBDUEDATE: e.target.value,
                                                                        }))}
                                                                        min={
                                                                            formData.PBBILLDATE
                                                                                ? new Date(new Date(formData.PBBILLDATE).getTime() + 86400000).toISOString().split('T')[0]
                                                                                : undefined
                                                                        }
                                                                        required
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-3 col-sm-6 col-12">
                                                            <div className="mb-3 add-product">
                                                                <label className="form-label  ">चालान क्रमांक</label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    placeholder="Enter Number"
                                                                    name="PBCHALLANNO"
                                                                    value={PBCHALLANNO}
                                                                    readOnly
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="accordion-header" id="headingOne">
                                                        <div data-bs-target="#collapseOne" aria-controls="collapseOne">
                                                            <div className="addproduct-icon">
                                                                <h5><span>विक्रेत्याचा तपशील :</span></h5>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {/* <div className="row mb-3">
                                                        <div className="col-lg-3 col-md-3 col-12">
                                                            <div className="mb-3 add-product ">
                                                                <label className="form-label required">Vendor Bill No</label>
                                                                <input
                                                                    type="text"
                                                                    name="PBVENDORID"
                                                                    className="form-control"
                                                                    onChange={handleInputChange}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div> */}
                                                    <div className="row mb-3">
                                                        <div className="col-lg-2 col-md-3 col-12">
                                                            <div className="mb-3 add-product ">
                                                                <label className="form-label required">विक्रेता बिल क्रमांक</label>
                                                                <input
                                                                    type="text"
                                                                    name="PBVENDORBID"
                                                                    className="form-control"
                                                                    onChange={handleInputChange}
                                                                    value={formData.PBVENDORBID}
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="col-lg-3 col-md-3 col-12">
                                                            <div className="form-label ">
                                                                <label >विक्रेत्याचे नाव</label>
                                                                <input
                                                                    type="text"
                                                                    name="PBVENDORNAME"
                                                                    className="form-control"
                                                                    onChange={handleInputChange}
                                                                    value={formData.PBVENDORNAME}
                                                                    readOnly
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="col-lg-2 col-md-3 col-12">
                                                            <div className="form-label">
                                                                <label>विक्रेत्याशी संपर्क</label>
                                                                <input
                                                                    type="number"
                                                                    name="PBVENDORCONTACT"
                                                                    className="form-control"
                                                                    onChange={handleInputChange}
                                                                    value={formData.PBVENDORCONTACT}
                                                                    readOnly
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="col-lg-3 col-md-3 col-12">
                                                            <div className="form-label">
                                                                <label>विक्रेता ईमेल</label>
                                                                <input
                                                                    type="email"
                                                                    name="PBVENDOREMAIL"
                                                                    className="form-control"
                                                                    onChange={handleInputChange}
                                                                    value={formData.PBVENDOREMAIL}
                                                                    readOnly
                                                                />
                                                            </div>
                                                        </div>
                                                        {/* 
                                                        <div className="col-lg-2 col-md-3 col-12">
                                                            <div className="form-label">
                                                                <label>Vendor State</label>
                                                                <input
                                                                    type="text"
                                                                    name="Vendor_State"
                                                                    className="form-control"
                                                                    onChange={handleInputChange}
                                                                />
                                                            </div>
                                                        </div> */}
                                                    </div>


                                                    <div className="row">
                                                        <div className="col-lg-3 col-md-3 col-12">
                                                            <div className="form-label">
                                                                <label>प्रेषक</label>
                                                                <input
                                                                    type="text"
                                                                    name="PBCONSIGNER"
                                                                    value={formData.PBCONSIGNER}
                                                                    className="form-control"
                                                                    onChange={handleInputChange}
                                                                    readOnly
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-3 col-sm-6 col-12">
                                                            <div className="mb-3 add-product">
                                                                <label className="form-label ">वाहन क्रमांक</label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    placeholder="Enter text"
                                                                    pattern="^[A-Z]{2}\s\d{1,2}\s[A-Z]{1,2}\s\d{4}$"
                                                                    title="please enter valid vehicle number (उदा: MH 12 AB 1234)"
                                                                    name="PBVEHICALNO"
                                                                    value={formData.PBVEHICALNO}
                                                                    onChange={handleInputChange}
                                                                    readOnly
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-3 col-md-3 col-12">
                                                            <div className="form-label">
                                                                <label>पुरवठ्याचे ठिकाण</label>
                                                                <Select
                                                                    readOnly
                                                                    classNamePrefix="react-select"
                                                                    options={states}
                                                                    openMenuOnFocus={true}
                                                                    value={states.find(option => option.value == formData.PBPOSUPPLY) || null}
                                                                    onChange={(selectedOption) => handleDropdownChange(selectedOption, "PBPOSUPPLY")}
                                                                />
                                                                {/* <input
                                                                    type="text"
                                                                    name="PBPOSUPPLY"
                                                                    value={formData.PBPOSUPPLY}
                                                                    className="form-control"
                                                                    onChange={handleInputChange}
                                                                /> */}
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-3 col-sm-3 col-12">
                                                            <div className="input-blocks">
                                                                <label>पेमेंट मोड</label>
                                                                <div className="input-groupicon calender-input">
                                                                    <div className="info-img" />
                                                                    <Select
                                                                        classNamePrefix="react-select"
                                                                        options={paymentmode}
                                                                        openMenuOnFocus={true}
                                                                        value={paymentmode.find(option => option.value == formData.PMODE) || null}
                                                                        onChange={(selectedOption) => handleDropdownChange(selectedOption, "PMODE")}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="col-lg-12">
                                                        <div className="border p-3 rounded shadow-sm mb-4">
                                                            <div className="modal-body-table">
                                                                <div className="table-responsive">
                                                                    <table className="table table-bordered">
                                                                        <thead className="thead-dark">
                                                                            <tr>
                                                                                <th className="col-4">उत्पादन</th>
                                                                                <th className="col-1">परिमाण</th>
                                                                                <th className="col-1">माप युनिट</th>
                                                                                <th className="col-1">दर</th>
                                                                                <th className="col-1">करयोग्य मूल्य</th>
                                                                                <th className="col-1">CGST</th>
                                                                                <th className="col-1">SGST</th>
                                                                                <th className="col-1">IGST</th>
                                                                                <th className="col-1">एकूण</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {data?.map((product, index) => (
                                                                                <tr key={index}>
                                                                                    <td className="col-4" style={{ padding: '5px 10px' }}>{product.PRODUCTNAME}</td>
                                                                                    <td className="col-1" style={{ padding: '5px 10px' }}>  {product.PBDQUANTITY} </td>
                                                                                    <td className="col-1" style={{ padding: '5px 10px' }}>{product.PBDUOMTITLE}</td>
                                                                                    <td className="col-1" style={{ padding: '5px 10px' }}> {product.PBDRATE}</td>
                                                                                    <td className="col-1" style={{ padding: '5px 10px' }}> {product.PBDTAMT} </td>
                                                                                    <td className="col-1" style={{ padding: '5px 10px' }}>{product.PBDCGST} </td>
                                                                                    <td className="col-1" style={{ padding: '5px 10px' }}>{product.PBDSGST}</td>
                                                                                    <td className="col-1" style={{ padding: '5px 10px' }}>{product.PBDIGST}</td>
                                                                                    <td className="col-1" style={{ padding: '5px 10px' }}>
                                                                                        <span>{product.total}</span>
                                                                                    </td>
                                                                                </tr>
                                                                            ))}
                                                                        </tbody>
                                                                        <tfoot>
                                                                            <tr>
                                                                                <td colSpan="8" className="text-end">ग्रँड टोटल :</td>
                                                                                <td className="col-1">
                                                                                    <span>
                                                                                        {data?.reduce((total, product) => total + product.total, 0).toFixed(2)}
                                                                                    </span>
                                                                                </td>
                                                                            </tr>
                                                                        </tfoot>
                                                                    </table>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-lg-3 col-sm-6 col-12"></div>
                                                        <div className="col-lg-3 col-sm-6 col-12">
                                                            <div className="mb-3 add-product">
                                                                <label className="form-label">वाहक</label>
                                                                <input
                                                                    type="number"
                                                                    className="form-control"
                                                                    placeholder="Amount"
                                                                    name="PBTRANSPORT"
                                                                    value={formData.PBTRANSPORT}
                                                                    onChange={handleInputChange}
                                                                    pattern="^\d+$"
                                                                    title="Must contain only numbers"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-3 col-sm-6 col-12">
                                                            <div className="mb-3 add-product">
                                                                <label className="form-label">सवलत</label>
                                                                <input
                                                                    type="number"
                                                                    className="form-control"
                                                                    placeholder="Amount"
                                                                    name="PBDISCOUNT"
                                                                    value={formData.PBDISCOUNT}
                                                                    onChange={handleInputChange}
                                                                    pattern="^\d+$"
                                                                    title="Must contain only numbers"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-3 col-sm-6 col-12">
                                                            <div className="mb-3 add-product">
                                                                <label className="form-label">निव्वळ रक्कम</label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    placeholder="Amount"
                                                                    name="PBNETAMOUNT"
                                                                    value={formData.PBNETAMOUNT}
                                                                    onChange={handleInputChange}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>



                                                    <div className="row">
                                                        <div className="col-lg-12 col-md-6 col-sm-12 mb-2">
                                                            <div>
                                                                <label className="form-label required">नियम आणि अटी</label>
                                                                <textarea
                                                                    type="text"
                                                                    className="form-control "
                                                                    name="PBTERMANDCONDITION"
                                                                    value={formData.PBTERMANDCONDITION}
                                                                    onChange={handleInputChange}
                                                                    ref={PBTERMANDCONDITIONRef}
                                                                    required />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-lg-12 col-md-6 col-sm-12 ">
                                                            <div>
                                                                <label className="form-label required">वर्णन</label>
                                                                <textarea
                                                                    ref={PBNARRATIONRef}
                                                                    type="text"
                                                                    className="form-control"
                                                                    name="PBNARRATION"
                                                                    value={formData.PBNARRATION}
                                                                    onChange={handleInputChange}
                                                                    required />
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
                                                                बाहेर जाणे
                                                            </button>
                                                            <button
                                                                type="submit"
                                                                className="btn btn-submit">
                                                                जतन करा
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

export default AddPurchaseInvoice
