import React, { useRef, useEffect, useState } from "react";
import { ArrowLeft } from "feather-icons-react/build/IconComponents";
// import { Modal } from "react-bootstrap";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import axios from 'axios';
// import { useLocation } from 'react-router-dom';
import { ACSPLGUID, baseUrl, convertToISODate } from "../../core/json/custom";
import Select from "react-select";
import { getUserData } from "../../Context/UserData";
function EditChallanPickUp({ PCAID, poaid, vendorid }) {
    const { userdetail } = getUserData();
    // console.log(poaid, vendorid)
    // let poaid = '';
    // let vendorid = '';
    // const location = useLocation();
    // const { PCAID } = location.state || {};
    // const { PCDAID } = location.state || {};
    console.log("primarykey", PCAID);
    const GUID = ACSPLGUID.getNew()
    const PCTRNNORef = useRef(null);
    const PCDATERef = useRef(null);
    const PCVNORef = useRef(null);
    const PCPOSUPPLYRef = useRef(null);
    const PCVENDORRef = useRef(null);
    const PCCONSIGNERRef = useRef(null);
    const PCNARRATIONRef = useRef(null);
    const REQNNOref = useRef(null);
    const [states, setstates] = useState([]);
    const [REQNNO, setREQNNO] = useState()
    const [showForm, setShowForm] = useState(false);
    const [paymentmode, setpaymentmode] = useState([]);
    const [formData, setFormData] = useState({
        PCTRNNO: '',
        PCDATE: '',
        PCVNO: '',
        PCPOSUPPLY: '',
        PCVENDOR: '',
        PCCONSIGNER: '',
        PCNARRATION: '',
        PCNATE: 0,
        PCGATE: 0,
        PVENDORNAME: '',
        PCVEMAIL: '',
        PCVCONTACT: '',
        POREFF: '',
        PMODE: '',
    });

    const [rows, setRows] = useState([]);

    // const [showModal, setShowModal] = useState(false);

    const MySwal = withReactContent(Swal);


    useEffect(() => {
        if (poaid || vendorid || PCAID) {
            setShowForm(true);
        }
    }, [poaid, vendorid, PCAID]);


    useEffect(() => {
        if (PCAID) {
            const fetchMasterData = async () => {
                try {
                    const payload = {
                        pcaid: PCAID,
                        keyword: "%",
                        companyid: userdetail?.companyID || "",
                        deptid: userdetail?.departmentID || "",
                        statusid: "2",
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
                        PCPOSUPPLY: states.find((state) => state.value == Data.pcposupply)?.value || "",
                        PCVENDOR: Data.pcseller,
                        PCCONSIGNER: Data.pcconsigner,
                        PCNARRATION: Data.pcnarration,
                        PCNATE: Data.pcnamt,
                        PCGATE: Data.pcgamt,
                        PVENDORNAME: Data.vendorname,
                        PCVEMAIL: Data.vendoremail,
                        PCVCONTACT: Data.vendorcontact,
                        POREFF: Data.poreff,
                    });
                } catch (error) {
                    console.error("Error fetching vendor data:", error);
                }
            };
            const fetchDetailData = async () => {
                try {
                    const payload = {
                        pcaid: PCAID,
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
                            EXPIRTYDATE: convertToISODate(item.expirydate),
                            HSNCODE: item.hsncode,
                            PCDTAMT: item.pcdtamt,
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
    }, [PCAID]);

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
        if (poaid) {
            const fetchorderdata = async () => {
                try {
                    const payload = {
                        poaid: poaid,
                        companyid: userdetail?.companyID || "",
                        deptid: userdetail?.departmentID || "",
                    };
                    const headers = {
                        "Content-Type": "application/json",
                        Accept: "*/*",
                    };
                    const response = await axios.post(
                        `${baseUrl.Url}/backend/api/GET_PurchaseOrderDataById`,
                        payload,
                        { headers }
                    );
                    if (response.status !== 200)
                        throw new Error("Failed to fetch vendor data");
                    console.log("venderos", response.data)
                    if (response.data.length > 0) {
                        setFormData(prevState => ({
                            ...prevState,
                            PCPOSUPPLY: states.find((state) => state.value == response.data[0].poplace)?.value || "",
                        }));
                        const mappedProducts = response.data.map((item) => ({
                            PRODUCTNAME: item.pname,
                            UOMTITLE: item.uomtitle,
                            PCDPRODUCT: item.podproduct,
                            PCDUOM: item.poduom,
                            PCDQUANTITY: item.podquantity,
                            PCDRATE: item.podrate,
                            PCDTAXABLE: item.podtamt,
                            PCDCGST: item.podcgst,
                            PCDSGST: item.podsgst,
                            PCDIGST: item.podigst,
                            total: item.podtamt + item.podcgst + item.podsgst + item.podigst,
                            PCDAID: item.pcdaid,
                            HSNCODE: item.hsncode,
                            PCDTAMT: item.pcdtamt,
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

            fetchorderdata();
        }
    }, [poaid, userdetail]);

    useEffect(() => {
        if (vendorid) {
            const fetchVendors = async () => {
                try {
                    const payload = {
                        praid: "%",
                        caid: vendorid,
                        companyid: userdetail?.companyID || "",
                        deptid: userdetail?.departmentID || "",
                    };
                    const headers = {
                        "Content-Type": "application/json",
                        Accept: "*/*",
                    };
                    const response = await axios.post(
                        `${baseUrl.Url}/backend/api/GET_CustomerDetails`,
                        payload,
                        { headers }
                    );
                    if (response.status !== 200)
                        throw new Error("Failed to fetch vendor data");
                    console.log("venderos", response.data)
                    if (response.data.length > 0) {
                        setFormData(prevState => ({
                            ...prevState,
                            PVENDORNAME: response.data[0].ccompanyname,
                            PCVEMAIL: response.data[0].cemail,
                            PCVCONTACT: response.data[0].ccontactpersonmobile,
                            PCVENDOR: response.data[0].caid,
                        }));
                    }

                } catch (error) {
                    console.error("Error fetching vendor data:", error);
                }
            };

            fetchVendors();
        }
    }, [vendorid, userdetail]);


    // const handleInputChange = (event, index, field) => {
    //     const updatedRows = [...rows];
    //     updatedRows[index][field] = event.target.value;

    //     if (field === 'PCDQUANTITY' || field === 'PCDRATE') {
    //         const quantity = parseFloat(updatedRows[index].PCDQUANTITY || 0) || 0;
    //         const rate = parseFloat(updatedRows[index].PCDRATE || 0) || 0;
    //         const taxableValue = quantity * rate;
    //         const cgst = (taxableValue * 9) / 100;
    //         const sgst = (taxableValue * 9) / 100;
    //         const igst = (taxableValue * 18) / 100;
    //         const PCDTAMT = taxableValue + cgst + sgst + igst;

    //         updatedRows[index].PCDTAXABLE = taxableValue.toFixed(2);
    //         updatedRows[index].PCDCGST = cgst.toFixed(2);
    //         updatedRows[index].PCDSGST = sgst.toFixed(2);
    //         updatedRows[index].PCDIGST = igst.toFixed(2);
    //         updatedRows[index].PCDTAMT = PCDTAMT.toFixed(2);
    //     }

    //     setRows(updatedRows);
    // };
    const handleInputChange = (event, index, field) => {
        const updatedRows = [...rows];
        updatedRows[index][field] = event.target.value;

        if (field === 'PCDQUANTITY' || field === 'PCDRATE') {
            const quantity = parseFloat(updatedRows[index].PCDQUANTITY || 0) || 0;
            const rate = parseFloat(updatedRows[index].PCDRATE || 0) || 0;
            const taxableValue = quantity * rate; // PCDTAXABLE = Quantity * Rate

            // Get tax values from rows
            const cgst = parseFloat(updatedRows[index].PCDCGST || 0) || 0;
            const sgst = parseFloat(updatedRows[index].PCDSGST || 0) || 0;
            const igst = parseFloat(updatedRows[index].PCDIGST || 0) || 0;

            const PCDTAMT = taxableValue + cgst + sgst + igst; // Total = Taxable + Taxes

            updatedRows[index].PCDTAXABLE = taxableValue.toFixed(2);
            updatedRows[index].PCDTAMT = PCDTAMT.toFixed(2);
        }

        setRows(updatedRows);
    };


    const showConfirmationAlert = () => {
        MySwal.fire({
            title: "Are you sure?",
            text: "Do you want to save this data?",
            showCancelButton: true,
            confirmButtonColor: "#00ff00",
            confirmButtonText: "SAVE",
            cancelButtonColor: "#092C4C",
            cancelButtonText: "CANCEL",
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
        // setShowModal(false);
    };

    // const handleModalClose = () => setShowModal(false);
    const handleSubmit = (event) => {
        event.preventDefault();

        const form = event.target.closest("form");
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        showConfirmationAlert();
    };

    const handleFormSubmission = async () => {
        try {
            const payload1 = {
                "pcaid": GUID,
                "pctrnno": formData.PCTRNNO,
                "pcseller": formData.PCVENDOR,
                "pcconsigner": formData.PCCONSIGNER,
                "pcvno": formData.PCVNO,
                "pcposupply": formData.PCPOSUPPLY,
                "pcnarration": formData.PCNARRATION,
                "pcdate": formData.PCDATE,
                "pcnamt": formData.PCNATE,
                "pcgamt": formData.PCGATE,
                "companyid": userdetail?.companyID || "",
                "deptid": userdetail?.departmentID || "",
                "poreff": formData.POREFF ? formData.POREFF : poaid,
                "statusid": "2",
                "paymentmode": formData.PMODE,
            };

            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            // **First API Call - Master Data**
            const response1 = await axios.post(
                baseUrl.Url + "/backend/api/AddUpdPChallanMaster",
                payload1,
                { headers }
            );

            console.log("payload1", payload1);

            if (response1.status === 200) {
                const payload2 = rows?.map((row) => ({
                    "pcdaid": ACSPLGUID.getNew(),
                    "pcaid": GUID,
                    "pcdproduct": row.PCDPRODUCT,
                    "pcduom": row.PCDUOM,
                    "pcdquantity": row.PCDQUANTITY,
                    "pcdrate": parseFloat(row.PCDRATE),
                    "pcdtamt": parseFloat(row.PCDTAMT),
                    "pcdtaxable": row.PCDTAXABLE,
                    "pcdigst": parseFloat(row.PCDIGST),
                    "pcdsgst": parseFloat(row.PCDSGST),
                    "pcdcgst": parseFloat(row.PCDCGST),
                    "companyid": userdetail?.companyID || "",
                    "deptid": userdetail?.departmentID || "",
                    "expirydate": row.EXPIRTYDATE,
                    "hsncode": row.HSNCODE,
                    "batchno": row.BATCHNO,
                }));

                console.log("payload2", payload2);

                // **Second API Call - Details Data**
                const response2 = await axios.post(
                    baseUrl.Url + "/backend/api/AddUpdPChallanDetails",
                    payload2,
                    { headers }
                );

                if (response2.status === 200) {
                    Swal.fire({
                        icon: "success",
                        title: "Saved!",
                        text: "Data saved successfully.",
                        confirmButtonText: "OK",
                    }).then((result) => {
                        if (result.isConfirmed) {
                            const modal = document.getElementById("EditPurchasechallan");
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

                            // Reset Form Data
                            setFormData({
                                PCTRNNO: '',
                                PCDATE: '',
                                PCVNO: '',
                                PCPOSUPPLY: '',
                                PCVENDOR: '',
                                PCCONSIGNER: '',
                                PCNARRATION: '',
                                PCNATE: 0,
                                PCGATE: 0,
                                PVENDORNAME: '',
                                PCVEMAIL: '',
                                PCVCONTACT: '',
                                POREFF: '',
                                PMODE: '',
                            });

                            setREQNNO("");
                            setRows([]);

                            // Remove modal backdrop
                            const backdrop = document.querySelector(".modal-backdrop");
                            if (backdrop) {
                                backdrop.remove();
                            }
                        }
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
        const handleKeydown = (event) => {
            if (event.ctrlKey && event.key === 's') {
                event.preventDefault();
                handleSubmit(event);
            }
            if (event.ctrlKey && event.key === 'e') {

                console.log("Ctrl+E Pressed");
            }
        };
        document.addEventListener('keydown', handleKeydown);
        return () => {
            document.removeEventListener('keydown', handleKeydown);
        };
    }, [rows, formData]);


    useEffect(() => {
        if (rows && rows.length > 0) {
            const totalTaxable = rows.reduce((acc, row) => acc + parseFloat(row.PCDTAXABLE || 0), 0).toFixed(2);
            const totalAmount = rows.reduce((acc, row) => acc + parseFloat(row.PCDTAMT || 0), 0).toFixed(2);

            setFormData({
                ...formData,
                PCGATE: totalTaxable,
                PCNATE: totalAmount,
            });
        }
    }, [rows]);

    const handleKeyDown = (e, nextRef) => {
        if (e.key === 'Enter' && nextRef.current) {
            nextRef.current.focus();
            e.preventDefault();
        }
    };

    const handleChange1 = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value.trimStart(),
        }));
    };

    const handleDropdownChange = (selectedOption, field) => {
        setFormData(prevData => ({
            ...prevData,
            [field]: selectedOption ? selectedOption.value : "",
        }));
    }

    const handleSearch = async (REQNNO) => {
        if (REQNNO) {
            setShowForm(true);
            try {
                const payload = {
                    potranno: REQNNO,
                    companyid: userdetail?.companyID || "",
                    deptid: userdetail?.departmentID || "",
                };
                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };
                const response = await axios.post(
                    `${baseUrl.Url}/backend/api/GET_POrderNoSearch`,
                    payload,
                    { headers }
                );
                if (response.status !== 200)
                    throw new Error("Failed to fetch vendor data");
                console.log("billnodata", response.data)

                if (response.data.length > 0) {
                    const mappedProducts = response.data.map((item) => ({
                        PRODUCTNAME: item.pname,
                        UOMTITLE: item.uomtitle,
                        PCDPRODUCT: item.podproduct,
                        PCDUOM: item.poduom,
                        PCDQUANTITY: item.podquantity,
                        PCDRATE: item.podrate,
                        PCDTAXABLE: item.podtamt,
                        PCDCGST: item.podcgst,
                        PCDSGST: item.podsgst,
                        PCDIGST: item.podigst,
                        total: item.podtamt + item.podcgst + item.podsgst + item.podigst,
                    }));
                    setRows(mappedProducts);
                    const totalTaxable = mappedProducts.reduce((acc, row) => acc + parseFloat(row.PCDTAXABLE || 0), 0).toFixed(2);
                    const totalAmount = mappedProducts.reduce((acc, row) => acc + parseFloat(row.total || 0), 0).toFixed(2);
                    setFormData(prevState => ({
                        ...prevState,
                        PVENDORNAME: response.data[0].vendorname,
                        PCVEMAIL: response.data[0].email,
                        PCVCONTACT: response.data[0].contactnumber,
                        PCVENDOR: response.data[0].povendorid,
                        PCPOSUPPLY: states.find((state) => state.value == response.data[0].poplace)?.value || "",
                        PCGATE: totalTaxable?.toFixed(2),
                        PCNATE: totalAmount?.toFixed(2),
                    }));
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
                REQNNOref.current.focus();
            })
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
                const modal = document.getElementById("EditPurchasechallan");
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
                        PCVENDOR: '',
                        PCCONSIGNER: '',
                        PCNARRATION: '',
                        PCNATE: 0,
                        PCGATE: 0,
                        PVENDORNAME: '',
                        PCVEMAIL: '',
                        PCVCONTACT: '',
                        POREFF: '',
                        PMODE: '',
                    })
                    setREQNNO("");
                    setRows();
                }
                const backdrop = document.querySelector(".modal-backdrop");
                if (backdrop) {
                    backdrop.remove();
                }

            }
        });
    };

    return (
        <div>
            <div
                className="modal fade"
                id="EditPurchasechallan"
                tabIndex={-1}
                aria-labelledby="exampleModalFullscreenLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-fullscreen mbgcolor">
                    <div className="modal-content mbgcolor">
                        <div className="modal-content mbgcolor">
                            <div className="page-wrapper-new p-0 mbgcolor">
                                <div className="content mbgcolor">
                                    <div className="modal-header border-0 custom-modal-header">
                                        <div className="page-title">
                                            <h4>Edit Purchase Challan Pickup</h4>
                                        </div>
                                        <div className="page-btn">
                                            <Link className="btn btn-secondary"
                                                aria-label="Close"
                                                // data-bs-dismiss="modal"
                                                onClick={showExitAlert}
                                            >
                                                <ArrowLeft className="me-2" />
                                                Back to index
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
                                                        value={REQNNO}
                                                        onChange={(e) => setREQNNO(e.target.value)}
                                                        pattern="^\d+$"
                                                        title="Must contain only numbers"
                                                        ref={REQNNOref}
                                                    />
                                                    <button
                                                        type="button"
                                                        className="btn btn-primary ms-3 mt-1 mt-sm-0"
                                                        onClick={() => handleSearch(REQNNO)}
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
                                                <div className="row">
                                                    <div className="col-lg-3 col-md-3 col-sm-12">
                                                        <div className="mb-3 add-product form-label">
                                                            <label className="form-label text-dark">Challan No</label>
                                                            <input
                                                                ref={PCTRNNORef}
                                                                type="text"
                                                                className="form-control border"
                                                                name="PCTRNNO"
                                                                value={formData.PCTRNNO}
                                                                onChange={handleChange1}
                                                                onKeyDown={(e) => handleKeyDown(e, PCDATERef)}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-3 col-sm-3 col-12">
                                                        <div className="input-blocks">
                                                            <label>Challan Date</label>
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
                                                                    onKeyDown={(e) => handleKeyDown(e, PCVNORef)}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-3 col-sm-3 col-12">
                                                        <div className="input-blocks">
                                                            <label>Payment Mode</label>
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
                                                <div className="row">
                                                    <div className="col-lg-4 col-md-4 col-sm-12">
                                                        <div className="input-blocks add-product">
                                                            <label>vendor name</label>
                                                            <input
                                                                ref={PCVENDORRef}
                                                                type="text"
                                                                className="form-control border"
                                                                name="PVENDORNAME"
                                                                value={formData.PVENDORNAME}
                                                                onChange={handleChange1}
                                                                readOnly
                                                            // onKeyDown={(e) => handleKeyDown(e, PCPOSUPPLYRef)}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-4 col-md-4 col-sm-12">
                                                        <div className="input-blocks add-product">
                                                            <label>vendor Email</label>
                                                            <input
                                                                ref={PCVENDORRef}
                                                                type="text"
                                                                className="form-control border"
                                                                name="PCVEMAIL"
                                                                value={formData.PCVEMAIL}
                                                                onChange={handleChange1}
                                                                readOnly
                                                            // onKeyDown={(e) => handleKeyDown(e, PCPOSUPPLYRef)}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-4 col-md-4 col-sm-12">
                                                        <div className="input-blocks add-product">
                                                            <label>vendor contact</label>
                                                            <input
                                                                ref={PCVENDORRef}
                                                                type="text"
                                                                className="form-control border"
                                                                name="PCVCONTACT"
                                                                value={formData.PCVCONTACT}
                                                                readOnly
                                                                onChange={handleChange1}
                                                            // onKeyDown={(e) => handleKeyDown(e, PCPOSUPPLYRef)}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-4 col-md-4 col-sm-12">
                                                        <div className="input-blocks add-product">
                                                            <label className="form-label text-dark">Consigner</label>
                                                            <input
                                                                ref={PCCONSIGNERRef}
                                                                type="text"
                                                                className="form-control border"
                                                                name="PCCONSIGNER"
                                                                value={formData.PCCONSIGNER}
                                                                onChange={handleChange1}
                                                            // onKeyDown={(e) => handleKeyDown(e, PCPOSUPPLYRef)}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-4 col-md-4 col-sm-12">
                                                        <div className="mb-3 add-product form-label">
                                                            <label className="form-label text-dark">Vehicle No</label>
                                                            <input
                                                                ref={PCVNORef}
                                                                type="text"
                                                                className="form-control border"
                                                                name="PCVNO"
                                                                value={formData.PCVNO}
                                                                onChange={handleChange1}
                                                                onKeyDown={(e) => handleKeyDown(e, PCPOSUPPLYRef)}
                                                            />
                                                        </div>

                                                    </div>

                                                    <div className="col-lg-4 col-md-4 col-sm-12">
                                                        <div className="mb-3 add-product form-label">
                                                            <label className="form-label text-dark">Place of supply</label>
                                                            {/* <input
                                                            ref={PCPOSUPPLYRef}
                                                            type="text"
                                                            className="form-control border"
                                                            name="PCPOSUPPLY"
                                                            value={formData.PCPOSUPPLY}
                                                            onChange={handleChange1}
                                                            onKeyDown={(e) => handleKeyDown(e, PCVENDORRef)}
                                                        /> */}
                                                            <Select
                                                                ref={PCPOSUPPLYRef}
                                                                classNamePrefix="react-select"
                                                                options={states}
                                                                openMenuOnFocus={true}
                                                                value={states.find(option => option.value == formData.PCPOSUPPLY) || null}
                                                                onChange={(selectedOption) => handleDropdownChange(selectedOption, "PCPOSUPPLY")}
                                                            />
                                                        </div>
                                                    </div>

                                                </div>
                                                <div className="row">
                                                    <div className="col-12">
                                                        <div className="form-label add-product form-label">
                                                            <label className="form-label text-dark">Narration</label>
                                                            <textarea
                                                                ref={PCNARRATIONRef}
                                                                rows={2}
                                                                cols={2}
                                                                className="form-control border text-secondary"
                                                                placeholder="Enter text here"
                                                                name="PCNARRATION"
                                                                value={formData.PCNARRATION}
                                                                onChange={handleChange1}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="border p-3 rounded shadow-sm mb-4 mt-5">
                                                    <div className="row">
                                                        <div className="col-lg-12">
                                                            <div className="modal-body-table">
                                                                <div className="table-responsive">
                                                                    <table className="table datanew">
                                                                        <table className="table table-bordered">
                                                                            <thead className="thead-dark">
                                                                                <tr>
                                                                                    <th className="col-3">Product</th>
                                                                                    <th className="col-1">UOM</th>
                                                                                    <th className="col-1">HSN Code</th>
                                                                                    <th className="col-2">BATCH NO</th>
                                                                                    <th className="col-1">EXPIRY DATE</th>
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
                                                                                        <td><span>{row.PRODUCTNAME}</span></td>
                                                                                        <td><span>{row.UOMTITLE}</span></td>
                                                                                        <td><span>{row.HSNCODE}</span></td>
                                                                                        <td>
                                                                                            <input
                                                                                                type="text"
                                                                                                className="form-control form-control-sm border-0 border-bottom border-warning"
                                                                                                value={row.BATCHNO}
                                                                                                onChange={(e) => handleInputChange(e, index, 'BATCHNO')}
                                                                                                required
                                                                                            />
                                                                                        </td>
                                                                                        <td>
                                                                                            <input
                                                                                                type="date"
                                                                                                className="form-control form-control-sm border-0 border-bottom border-warning"
                                                                                                value={row.EXPIRTYDATE}
                                                                                                onChange={(e) => handleInputChange(e, index, 'EXPIRTYDATE')}
                                                                                                required
                                                                                            />
                                                                                        </td>
                                                                                        <td>
                                                                                            <input
                                                                                                type="number"
                                                                                                className="form-control form-control-sm border-0 border-bottom border-warning"
                                                                                                value={row.PCDQUANTITY}
                                                                                                onChange={(e) => handleInputChange(e, index, 'PCDQUANTITY')}
                                                                                                required
                                                                                            />
                                                                                        </td>
                                                                                        <td><span>{row.PCDRATE}</span></td>
                                                                                        <td><span>{row.PCDTAXABLE}</span></td>
                                                                                        <td><span>{row.PCDCGST}</span></td>
                                                                                        <td><span>{row.PCDSGST}</span></td>
                                                                                        <td><span>{row.PCDIGST}</span></td>
                                                                                        <td><span>{row.total}</span></td>
                                                                                    </tr>
                                                                                ))}
                                                                            </tbody>
                                                                            <tfoot>
                                                                                <tr>
                                                                                    <td colSpan="6"></td> {/* Empty cells for alignment */}
                                                                                    <td><strong>Total Taxable:</strong></td>
                                                                                    <td>
                                                                                        <input
                                                                                            type="text"
                                                                                            className="form-control form-control-sm border-0 border-bottom border-warning"
                                                                                            name="PCGATE"
                                                                                            value={Number(formData.PCGATE).toFixed(2) || '0.00'}
                                                                                            readOnly
                                                                                        />
                                                                                    </td>
                                                                                    <td colSpan="3"></td>
                                                                                    <td><strong>Total:</strong></td>
                                                                                    <td>
                                                                                        <input
                                                                                            type="text"
                                                                                            className="form-control form-control-sm border-0 border-bottom border-warning"
                                                                                            name="PCNATE"
                                                                                            value={Number(formData.PCNATE).toFixed(2) || '0.00'}
                                                                                            readOnly
                                                                                        />
                                                                                    </td>
                                                                                </tr>
                                                                            </tfoot>
                                                                        </table>

                                                                    </table>
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
                                                            Exit
                                                        </button>
                                                        <button
                                                            type="submit"
                                                            className="btn btn-submit"
                                                        >
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
                        {/* </div> */}

                        {/* Confirmation Modal */}
                        {/* <Modal show={showModal} onHide={handleModalClose} centered>
                            <Modal.Header closeButton>
                                <Modal.Title>Confirm Submission</Modal.Title>
                            </Modal.Header>
                            <Modal.Body style={{ color: "green" }}>
                                <h4>Do you want to save the purchase data?</h4>
                            </Modal.Body>
                            <Modal.Footer>
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    // onClick={handleModalClose}
                                    onClick={showExitAlert}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={handleModalConfirm}
                                >
                                    Save
                                </button>
                            </Modal.Footer>
                        </Modal> */}
                    </div>
                </div>
            </div>
        </div >
    )
}

export default EditChallanPickUp

