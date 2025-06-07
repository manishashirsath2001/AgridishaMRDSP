import React, { useRef, useEffect, useState } from "react";
import { ArrowLeft } from "feather-icons-react/build/IconComponents";
import { Modal } from "react-bootstrap";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import axios from 'axios';
// import { useLocation } from 'react-router-dom';
import { ACSPLGUID, baseUrl, convertToISODate } from "../../core/json/custom";
import Select from "react-select";
import { getUserData } from "../../Context/UserData";
function Addpicksale({ SCAID }) {
    // const location = useLocation();
    // const { SCDAID } = location.state || {};
    const { userdetail } = getUserData();
    const GUID = ACSPLGUID.getNew()
    const SCTRNNORef = useRef(null);
    const SCDATERef = useRef(null);
    const SCVNORef = useRef(null);
    const SCPOSUPPLYRef = useRef(null);
    // const SCVENDORRef = useRef(null);
    // const SCCONSIGNERRef = useRef(null);
    // const SCNARRATIONRef = useRef(null);
    const qnoref = useRef(null);
    const [states, setstates] = useState([]);
    const [qno, setqno] = useState()
    const [showForm, setShowForm] = useState(false);
    const [paymentmode, setpaymentmode] = useState([]);//payment dropdown

    const [formData, setFormData] = useState({
        SCTRNNO: '',
        SCDATE: '',
        SCVNO: '',
        SCPOSUPPLY: '',
        SCSELLER: '',
        SCCONSIGNER: '',
        SCNARRATION: '',
        SCNATE: '',
        SCGATE: '',
        qno: '',
        SCDPRODUCT: '',
        SCDUOM: '',
        // SHSN: '',
        SCBATCH: '',
        SCDATEE: '',
        PAYMENTMODE: '',
        CUSTOMERNAME: '',

    });

    const [rows, setRows] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const MySwal = withReactContent(Swal);



    useEffect(() => {
        //place of supply api
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

        //payment mode api
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
        fetchstates();
    }, []);


    const handleSearch = async (qno) => {
        if (qno) {
            setShowForm(true);
            try {
                const payload = {
                    qno: qno,
                    companyid: userdetail?.companyID || "",
                    deptid: userdetail?.departmentID || "",
                };
                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };
                const response = await axios.post(
                    `${baseUrl.Url}/backend/api/GET_SQuatationNoSearch`,
                    payload,
                    { headers }
                );
                if (response.status !== 200)
                    throw new Error("Failed to fetch vendor data");
                console.log("billnodata", response.data)

                if (response.data.length > 0) {
                    const mappedProducts = response.data.map((item) => ({
                        PRODUCTNAME: item.productname,
                        UOMTITLE: item.uomtitle,
                        SCDPRODUCT: item.sqproduct,
                        SCDUOM: item.squom,
                        // SHSN: item.hsncode,
                        SCDQUANTITY: item.qquantity,
                        SCDRATE: item.qrate,
                        SCDTAXABLE: item.qtamt,
                        SCDCGST: item.qcgst,
                        SCDSGST: item.qsgst,
                        SCDIGST: item.qigst,
                        SCDTAMT: item.qtamt + item.qcgst + item.qsgst + item.qigst,
                    }));
                    setRows(mappedProducts);
                    const totalTaxable = mappedProducts.reduce((acc, row) => acc + parseFloat(row.SCDTAXABLE || 0), 0).toFixed(2);
                    const totalAmount = mappedProducts.reduce((acc, row) => acc + parseFloat(row.SCDTAMT || 0), 0).toFixed(2);
                    setFormData(prevState => ({
                        ...prevState,
                        // PVENDORNAME: response.data[0].vendorname,
                        SCSELLER: response.data[0].sqcaid,
                        CUSTOMERNAME: response.data[0].vendorname,
                        SCCONSIGNER: response.data[0].sqtransportid,
                        // PCVENDOR: response.data[0].povendorid,
                        PCPOSUPPLY: states.find((state) => state.value == response.data[0].poplace)?.value || "",
                        SCGATE: totalTaxable,
                        SCNATE: totalAmount,
                        qno: response.data[0].qno,
                    }));
                }

            } catch (error) {
                console.error("Error fetching vendor data:", error);
            }
        }
    };


    //Edit 
    //Edit 
    useEffect(() => {
        if (!SCAID) return;

        setShowForm(true);

        const fetchMasterData = async () => {
            try {
                const payload1 = {
                    // scaid: SCAID,
                    // companyid: userdetail?.companyID || "",
                    // deptid: userdetail?.departmentID || "",

                    "scaid": SCAID,
                    "keyword": "%",
                    "statusid": '2',
                    "companyid": userdetail?.companyID || "",
                    "deptid": userdetail?.departmentID || "",
                };

                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*"
                };

                const response = await axios.post(
                    baseUrl.Url + "/backend/api/GET_SChallanMaster",
                    payload1,
                    { headers });

                if (response.status !== 200)
                    throw new Error("Failed to fetch data");

                let apiData = response.data[0];
                setFormData((prev) => ({
                    ...prev,
                    SCTRNNO: apiData.sctrnno,
                    SCVNO: apiData.scvno,
                    SCDATE: convertToISODate(apiData.scdate),
                    SCPOSUPPLY: apiData.scposupply,
                    SCCONSIGNER: apiData.scconsigner,
                    SCSELLER: apiData.scseller,
                    CUSTOMERNAME: apiData.vendorname,
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
                    { headers });

                if (response.status !== 200) throw new Error("Failed to fetch details data");

                console.log("Quotation Detail Data:", response.data);

                if (response.data.length > 0) {
                    const mappedProducts = response.data.map((item) => ({
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
                        SCDTAMT: item.scdtamt + item.scdcgst + item.scdsgst + item.scdigst,
                        SBATCHNO: item.batchno,
                        SEXPIRYDATE: item.expirydate,
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


    const handleInputChange = (event, index, field) => {
        const updatedRows = [...rows];
        updatedRows[index][field] = event.target.value;

        if (field === 'SCDQUANTITY' || field === 'SCDRATE') {
            const quantity = parseFloat(updatedRows[index].SCDQUANTITY || 0) || 0;
            const rate = parseFloat(updatedRows[index].SCDRATE || 0) || 0;
            const taxableValue = quantity * rate;
            const cgst = (taxableValue * 9) / 100;
            const sgst = (taxableValue * 9) / 100;
            const igst = (taxableValue * 18) / 100;
            const SCDTAMT = taxableValue + cgst + sgst + igst;

            updatedRows[index].SCDTAXABLE = taxableValue.toFixed(2);
            updatedRows[index].SCDCGST = cgst.toFixed(2);
            updatedRows[index].SCDSGST = sgst.toFixed(2);
            updatedRows[index].SCDIGST = igst.toFixed(2);
            updatedRows[index].SCDTAMT = SCDTAMT.toFixed(2);
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
        setShowModal(false);
    };

    const handleModalClose = () => setShowModal(false);
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
                "scaid": SCAID ? SCAID : GUID,
                "sctrnno": formData.SCTRNNO,
                "scseller": formData.SCSELLER,
                "scconsigner": formData.SCCONSIGNER,
                "scvno": formData.SCVNO,
                "scposupply": formData.SCPOSUPPLY,
                "scnarration": formData.SCNARRATION,
                "scdate": formData.SCDATE,
                "scnamt": formData.SCNATE,
                "scgamt": formData.SCGATE,
                "soreff": "",
                "companyid": userdetail?.companyID || "",
                "deptid": userdetail?.departmentID || "",
                "paymentmode": formData.PAYMENTMODE,
                "statusid": '2',
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
                "scdaid": ACSPLGUID.getNew(),
                "scaid": SCAID ? SCAID : GUID,
                "scdproduct": row.SCDPRODUCT,
                "scduom": row.SCDUOM,
                "hsncode": row.SHSN,
                "scdquantity": row.SCDQUANTITY.toString(),
                "scdrate": row.SCDRATE,
                "scdtamt": row.SCDTAMT,
                "scdtaxable": row.SCDTAXABLE.toString(),
                "scdigst": row.SCDIGST,
                "scdsgst": row.SCDSGST,
                "scdcgst": row.SCDCGST,
                "batchno": "",
                "expirydate": "",
                "companyid": userdetail?.companyID || "",
                "deptid": userdetail?.departmentID || "",
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
            const totalTaxable = rows.reduce((acc, row) => acc + parseFloat(row.SCDTAXABLE || 0), 0).toFixed(2);
            const totalAmount = rows.reduce((acc, row) => acc + parseFloat(row.SCDTAMT || 0), 0).toFixed(2);

            setFormData({
                ...formData,
                SCGATE: totalTaxable,
                SCNATE: totalAmount,
            });
        }
    }, [rows]);

    const handleKeyDown = (e, nextRef) => {
        if (e.key === 'Enter' && nextRef.current) {
            nextRef.current.focus();
            e.preventDefault();
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
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

    return (
        <div>
            <div
                className="modal fade"
                id="Addpicksale"
                tabIndex={-1}
                aria-labelledby="exampleModalFullscreenLabel"
                aria-hidden="true"
                style={{ display: "none" }}
            >
                <div className="modal-dialog modal-fullscreen">
                    <div className="modal-content">
                        <div className="modal-content">
                            <div className="page-wrapper-new p-0">
                                <div className="content">
                                    <div className="modal-header border-0 custom-modal-header">
                                        <div className="page-title ps-2">
                                            <h4>Edit Sale Challan</h4>
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
                                                        CUSTOMERNAME: "",
                                                        qno: "",

                                                    });

                                                    setRows([]);

                                                    // **Modal Close**
                                                    const modal = document.querySelector('.modal.show');
                                                    if (modal) {
                                                        const closeButton = modal.querySelector('[data-bs-dismiss="modal"]');
                                                        closeButton?.click();
                                                    }
                                                }}
                                            >
                                                <ArrowLeft className="me-2" />
                                               	 मागे
                                            </Link>
                                        </div>

                                    </div>


                                    {!showForm && (
                                        <div className="row justify-content-center m-1">
                                            <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-4">
                                                <div className="search-input d-flex align-items-center">
                                                    <input
                                                        type="text"
                                                        placeholder="Search challan No"
                                                        className="form-control w-100"
                                                        value={qno}
                                                        onChange={(e) => setqno(e.target.value)}

                                                        ref={qnoref}
                                                    />
                                                    <button
                                                        type="button"
                                                        className="btn btn-primary ms-3 mt-1 mt-sm-0"
                                                        onClick={() => handleSearch(qno)}
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
                                                <div className="row custom-background">
                                                    <div className="col-lg-2 col-md-6 col-sm-12">
                                                        <div className="mb-0 add-product form-label">
                                                            <label className="required">चलन क्रमांक</label>
                                                            <input
                                                                ref={SCTRNNORef}
                                                                type="text"
                                                                className="form-control border"
                                                                name="SCTRNNO"
                                                                value={formData.SCTRNNO}
                                                                onChange={handleChange}
                                                                required
                                                            />

                                                        </div>
                                                    </div>
                                                    <div className="col-lg-2 col-sm-6 col-12">
                                                        <div className=" mb-0 add-product form-label">
                                                            <label className="required"> चलन तारीख</label>
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
                                                            <label >वाहन क्रमांक</label>
                                                            <input
                                                                ref={SCVNORef}
                                                                type="text"
                                                                className="form-control border"
                                                                name="SCVNO"
                                                                value={formData.SCVNO}
                                                                onChange={handleChange}
                                                                required
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-lg-2 col-md-4 col-sm-12">
                                                        <div className="mb-0 add-product form-label">
                                                            <label>कोटेशन क्रमांक</label>
                                                            <input
                                                                type="text"
                                                                className="form-control border"
                                                                name="qno"
                                                                value={qno}
                                                                onChange={(e) => setqno(e.target.value)} // Ensure state is updated
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-4 col-md-4 col-sm-12">
                                                        <div className="mb-0 add-product form-label">
                                                            <label>पुरवठ्याचे ठिकाण</label>
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
                                                                styles={{
                                                                    menu: (base) => ({
                                                                        ...base,
                                                                        zIndex: 1050,
                                                                    }),
                                                                }}
                                                                required
                                                                openMenuOnFocus={true}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-3 col-md-4 col-sm-12">

                                                    </div>
                                                </div>
                                                <div className="row custom-background">
                                                    <div className="col-lg-4 col-md-4 col-sm-12">
                                                        <div className="mb-0 add-product form-label">
                                                            <label>भरणा पद्धती</label>
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
                                                                openMenuOnFocus={true}

                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-4 col-md-4 col-sm-12">
                                                        <div className="mb-0 add-product form-label">
                                                            <label>ग्राहकाचे नाव</label>
                                                            <input

                                                                type="text"
                                                                className="form-control border"
                                                                name="CUSTOMERNAME"
                                                                value={formData.CUSTOMERNAME}
                                                                onChange={handleChange}

                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-lg-4 col-md-4 col-sm-12">
                                                        <div className="mb-0 add-product form-label">
                                                            <label>वाहतूकदार</label>
                                                            <input

                                                                type="text"
                                                                className="form-control border"
                                                                name="SCCONSIGNER"
                                                                value={formData.SCCONSIGNER}
                                                                onChange={handleChange}

                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-8">
                                                        <div className="mb-0 add-product form-label">
                                                            <label >वर्णन</label>
                                                            <textarea
                                                                // ref={SCNARRATIONRef}
                                                                rows={1}
                                                                cols={1}
                                                                className="form-control border text-secondary"
                                                                name="SCNARRATION"
                                                                onChange={handleChange}
                                                                required
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="border p-3 rounded shadow-sm mb-4 mt-5">
                                                    <div className="row">
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
                                                                                    <th className="col-3">उत्पादन</th>
                                                                                    <th className="col-1">HSN</th>
                                                                                    <th className="col-1">मोजणी एकक (UOM)</th>
                                                                                    <th className="col-1">बॅच क्रमांक</th>
                                                                                    <th className="col-1">अंतिम तारीख</th>
                                                                                    <th className="col-1">प्रमाण</th>
                                                                                    <th className="col-1">दर</th>
                                                                                    <th className="col-1">कर मूल्य</th>
                                                                                    <th className="col-1">CGST</th>
                                                                                    <th className="col-1">SGST</th>
                                                                                    <th className="col-1">IGST</th>
                                                                                    <th className="col-1">एकूण</th>

                                                                                    {/* <th className="col-1">Action</th> */}
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody>
                                                                                {rows?.map((row, index) => (
                                                                                    <tr key={index}>
                                                                                        <td><span>{row.PRODUCTNAME}</span></td>
                                                                                        <td><span>{row.SHSN}</span></td>
                                                                                        <td><span>{row.UOMTITLE}</span></td>
                                                                                        <td>
                                                                                            <input
                                                                                                type="text"
                                                                                                className="form-control form-control-sm border-0 border-bottom border-warning"
                                                                                                value={row.SCBATCH}
                                                                                                onChange={(e) => handleInputChange(e, index, 'SCBATCH')}
                                                                                                required
                                                                                            />
                                                                                        </td>

                                                                                        <td>
                                                                                            <input
                                                                                                type="date"
                                                                                                className="form-control form-control-sm border-0 border-bottom border-warning"
                                                                                                value={row.SCDATEE}
                                                                                                onChange={(e) => handleInputChange(e, index, 'SCDATEE')}

                                                                                            />
                                                                                        </td>

                                                                                        <td>
                                                                                            <input
                                                                                                type="number"
                                                                                                className="form-control form-control-sm border-0 border-bottom border-warning"
                                                                                                value={row.SCDQUANTITY}
                                                                                                onChange={(e) => handleInputChange(e, index, 'SCDQUANTITY')}

                                                                                            />
                                                                                        </td>
                                                                                        <td><span>{row.SCDRATE}</span></td>
                                                                                        <td><span>{row.SCDTAXABLE}</span></td>
                                                                                        <td><span>{row.SCDCGST}</span></td>
                                                                                        <td><span>{row.SCDSGST}</span></td>
                                                                                        <td><span>{row.SCDIGST}</span></td>
                                                                                        <td><span>{row.SCDTAMT}</span></td>

                                                                                    </tr>
                                                                                ))}
                                                                            </tbody>
                                                                            <tfoot>

                                                                                <td colSpan="6"></td>
                                                                                <td><strong>एकूण मूल्य</strong></td>
                                                                                <td>
                                                                                    <input

                                                                                        type="text"
                                                                                        className="form-control form-control-sm border-0 border-bottom border-warning"
                                                                                        name="PCGATE"
                                                                                        value={formData.SCGATE || '0'}
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
                                                                                        value={formData.SCNATE || '0'}
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
                                                    <div className="modal-footer-btn">
                                                        <button
                                                            type="button"
                                                            className="btn btn-cancel me-2"
                                                            onClick={showExitAlert}
                                                        >
                                                          	 रद्द करा
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
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* </div> */}

                        {/* Confirmation Modal */}
                        <Modal show={showModal} onHide={handleModalClose} centered>
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
                                    onClick={handleModalClose}
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
                        </Modal>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Addpicksale
