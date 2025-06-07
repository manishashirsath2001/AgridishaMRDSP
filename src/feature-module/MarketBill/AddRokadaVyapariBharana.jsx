

import React, { useState, useEffect, useRef } from "react";
import { baseUrl } from "../../core/json/custom";
import axios from 'axios';
import Select from "react-select";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { all_routes } from "../../Router/all_routes";
import { useNavigate } from 'react-router-dom';
import { ACSPLGUID } from "../../core/json/custom";
import { Accounts } from "../../core/json/custom";
import { getUserData } from '../../Context/UserData';
import RokdaAddCash from "./RokdaAddCash";

const AddRokadaVyapariBharana = ({ VDAID, onRefresh }) => {

    console.log("VDAID", VDAID)
    const { userdetail } = getUserData();
    const GUID = ACSPLGUID.getNew()
    console.log(GUID)
    const UserRef = useRef(null);
    const TotaldepositRef = useRef(null);
    const TransactionRef = useRef(null);
    const BankRef = useRef(null);
    const navigate = useNavigate();
    const route = all_routes;

    const [formData, setFormData] = useState({
        User: '',
        Transaction: '',
        Reamaining: '',
        Totalamount: '',
        Totaldeposit: '',
        Description: '',
        Bank: '',
    });

    console.log("formData.Transaction", formData.Transaction)
    console.log("formData.Bank", formData.Bank)
    const [tableData, setTableData] = useState([]);
    // const [PreviusData, setPreviusData] = useState([]);
    const [farmer, setfarmer] = useState([]);
    const [TransctionType, setTransctionType] = useState([]);
    const [cashInputs, setCashInputs] = useState({});
    const [onlineInputs, setOnlineInputs] = useState({});
    const [BankName, setBankName] = useState([]);
    const [currentDate, setCurrentDate] = useState('');

    const handleKeyDown = (e, nextRef) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (nextRef && nextRef.current) {
                nextRef.current.focus();
            }
        }
    };

    useEffect(() => {
        if (UserRef.current) {
            UserRef.current.focus();
        }
    }, [onRefresh]);


    useEffect(() => {
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];
        setCurrentDate(formattedDate);
    }, []);


    useEffect(() => {
        const handleShortcut = (e) => {
            if (e.ctrlKey && e.key === 'e' || e.ctrlKey && e.key === 'E') {
                e.preventDefault();
                navigate(route.VyapariBharnaMaster);
                handleExit();
            }
            if (e.ctrlKey && e.key === 's' || e.ctrlKey && e.key === 'S') {
                e.preventDefault();
                handleSubmit(e);
                // validateinput(e);
            }
        };
        window.addEventListener('keydown', handleShortcut);
        return () => {
            window.removeEventListener('keydown', handleShortcut);
        };
    },);


    useEffect(() => {
        const fetchBankName = async () => {
            try {
                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };

                const payload = {
                    "companyid": userdetail?.companyID ? userdetail.companyID : "",
                    "deptid": userdetail?.departmentID ? userdetail.departmentID : "",
                };

                const response = await axios.post(
                    `${baseUrl.Url}/backend/api/GET_BankName`,
                    payload,
                    { headers }
                );
                if (response.status !== 200)
                    throw new Error("Failed to fetch vendor data");
                console.log("requisition setails", response.data)
                const data = response.data;
                const conuterData = data
                    .map(({ bankname, bankid }) => ({
                        label: bankname,
                        value: bankid
                    }));

                setBankName(conuterData);
            } catch (error) {
                console.error("Error fetching vendor data:", error);
            }
        };
        fetchBankName();
    }, []);


    useEffect(() => {
        const TRANSTYPE = async () => {
            try {
                const response = await axios.get(
                    baseUrl.Url + "/backend/api/Implications/TRANSTYPE"
                );
                if (response.status !== 200) throw new Error("Failed to fetch implications data");
                const data = response.data;
                const implicationsDropdown = data.map(({ iTitle, iValue }) => ({
                    label: iTitle,
                    value: iValue,
                }));
                setTransctionType(implicationsDropdown);
            } catch (error) {
                console.error("Error fetching implications transaction mode:", error);
            }
        };

        TRANSTYPE();
    }, []);


    useEffect(() => {
        const fetchCounter = async () => {
            console.log("runnnnnnnnnnnnnnnnnnn")
            try {
                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };
                const payload = {
                    "companyid": userdetail?.companyID ? userdetail.companyID : "",
                    "deptid": userdetail?.departmentID ? userdetail.departmentID : "",
                };
                const response = await axios.post(
                    `${baseUrl.Url}/backend/api/GET_AuctionUser`,
                    payload,
                    { headers }
                );
                if (response.status !== 200)
                    throw new Error("Failed to fetch vendor data");
                console.log("requisition setails", response.data)
                const data = response.data;
                const conuterData = data
                    .map(({ uforename, uaid }) => ({
                        label: uforename,
                        value: uaid
                    }));
                setfarmer(conuterData);
            } catch (error) {
                console.error("Error fetching vendor data:", error);
            }
        };
        fetchCounter();
    }, []);


    useEffect(() => {
        if (!formData.User) return;

        fetchServiceCharge(formData.User);

    }, [formData.User]);
    const fetchServiceCharge = async (USER) => {
        try {
            const payload = {
                "UAID": USER,
                "keyword": "%",
                "companyid": userdetail?.companyID ? userdetail.companyID : "",
                "deptid": userdetail?.departmentID ? userdetail.departmentID : "",
            }

            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };
            const response = await axios.post(
                `${baseUrl.Url}/backend/api/GET_RokdaVyapari`,

                payload,
                { headers }
            );
            if (response.status !== 200)
                throw new Error("Failed to fetch vendor data");
            console.log("quatation master", response.data)
            // const filteredData = response.data.filter(item =>  item.isclose != true);
            // const allReffValues = response.data.map(item => item.reff);

            // const filteredData = response.data.filter(item => {
            // return item.isclose != 'true' && !allReffValues.includes(item.vdaid);
            // });
            // setTableData(filteredData);
            setTableData(response.data);
        } catch (error) {
            console.error("Error fetching vendor data:", error);
        }
    };



    // for edit 
    useEffect(() => {
        const fetchServiceCharge = async () => {
            try {
                const payload = {

                    "vdaid": VDAID,
                };

                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };
                const response = await axios.post(
                    `${baseUrl.Url}/backend/api/GET_VyapariDue`,

                    payload,
                    { headers }
                );
                if (response.status !== 200)
                    throw new Error("Failed to fetch vendor data");
                console.log("quatation master", response.data)
                const data = response.data;
                setTableData(data);
            } catch (error) {
                console.error("Error fetching vendor data:", error);
            }
        };

        fetchServiceCharge();
    }, [VDAID]);



    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        if (name === 'Totaldeposit') {

            if (value == 0) {
                setCashInputs({});
            }

            if (value > RA) {
                Swal.fire({
                    icon: "error",
                    title: "त्रुटी",
                    text: "एकूण भरणा रक्कम जास्त आहे.",
                    confirmButtonText: "ठीक आहे",
                });
                return;
            }

            const numericValue = parseInt(value, 10);

            if (isNaN(numericValue) || value === "") {
                const resetTable = tableData.map(row => ({
                    ...row,
                    cash: 0,
                    online: '0.00'
                }));
                setTableData(resetTable);
                return;
            }

            if (numericValue > totalAmount) {
                Swal.fire({
                    icon: "error",
                    title: "त्रुटी",
                    text: "एकूण भरणा रक्कम जास्त आहे.",
                    confirmButtonText: "ठीक आहे",
                });
                return;
            }

            let remaining = numericValue;
            let allocations = [];
            const rowCount = tableData.length;

            for (let i = 0; i < rowCount; i++) {
                const online = parseFloat(onlineInputs?.[i]) || 0;
                const capacity = (tableData[i].bpamt || 0) - online;

                if (remaining >= capacity) {
                    allocations[i] = capacity;   // fill up to bpamt - online
                    remaining -= capacity;
                } else {
                    allocations[i] = remaining;  // fill whatever is left
                    remaining = 0;
                }
            }

            // If remaining > 0 here, it means Totaldeposit > sum of (bpamt - online) but you handled that above

            const updatedTable = tableData.map((row, index) => ({
                ...row,
                cash: allocations[index] || 0,
                online: onlineInputs?.[index] || '0.00'
            }));

            setTableData(updatedTable);
            setCashInputs(allocations);
        }
    };




    //for previous data

    // useEffect(() => {
    //     console.log("useEffect triggered");
    //     const fetchServiceCharge = async () => {
    //         try {
    //         const payload =
    //         {
    //             "vdaid": "%",
    //         };

    //         const headers = {
    //             "Content-Type": "application/json",
    //             Accept: "*/*",
    //         };
    //         const response = await axios.post(
    //             `${baseUrl.Url}/backend/api/GET_VyapariDue`,

    //             payload,
    //             { headers }
    //         );
    //         if (response.status !== 200)
    //         throw new Error("Failed to fetch vendor data");
    //         console.log("quatation master", response.data)

    //         const data = response.data;

    //         const filtered = Array.isArray(data)
    //         ? data.filter((item) => item.vtype == 0 && item.trntid != 30)
    //         : [];

    //     const lastRecord = filtered.length > 0
    //         ? filtered[filtered.length - 1]
    //         : null;

    //     setPreviusData(lastRecord);
    //     } catch (error) {
    //         console.error("Error fetching vendor data:", error);
    //     }
    //     };

    //     fetchServiceCharge();

    // },[]);

    const [Amount, setAmount] = useState()

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("AAAAAAAAAAAAAAAAAAAA", formData.Totaldeposit)

        if (!VDAID) {
            Swal.fire({
                icon: "error",
                title: "ओह... काहीतरी चुकीचे झाले",
                text: "कृपया लिलाव वापरकर्ता निवडा.",
                confirmButtonText: "ठीक आहे",
            });
        }

        // showConfirmationAlert(e);
        if (totalCash <= 0 && tableData.length > 0) {

            if (totalOnline <= 0) {
                Swal.fire({
                    icon: "error",
                    title: "ओह... काहीतरी चुकीचे झाले",
                    text: "कृपया कॅश किंवा ऑनलाइन रक्कम भरा.",
                    confirmButtonText: "ठीक आहे",
                });
            } else {
                showConfirmationAlert(e);
            }
            // showConfirmationAlert(e);
        }
    }

    const [refreshFlag, setRefreshFlag] = useState(false);

    const refreshData = () => {
        setRefreshFlag(prev => !prev);

    };

    useEffect(() => {
        // setSelectedData({ activeTab: null });
    }, [refreshFlag]);

    const handleModalClose = () => {
        handleSave();
    }


    const handleSave = async () => {
        try {
            const invalidRow = tableData.find((row, index) => {
                const cash = parseFloat(cashInputs[index]) || 0;
                const online = parseFloat(onlineInputs[index]) || 0;
                const total = cash + online
                return total > row.bpamt;
            });

            if (invalidRow) {
                await Swal.fire({
                    icon: "error",
                    title: "ओह... काहीतरी चुकीचे झाले",
                    text: "कॅश + ऑनलाइन रक्कम ही रक्कम पेक्षा जास्त आहे.",
                    confirmButtonText: "ठीक आहे",
                });
                return;
            }

            const payload = tableData.map((row, index) => {
                const cash = parseFloat(cashInputs[index]) || 0;
                const online = parseFloat(onlineInputs[index]) || 0;
                const total = cash + online

                return {
                    vdaid: VDAID ? VDAID : ACSPLGUID.getNew(),
                    trndt: currentDate,
                    tamt: total || 0,
                    bpamt: Math.round((row.bpamt - (total || 0)) * 100) / 100,
                    fduedt: row.trndt,
                    sduedt: "",
                    vpaid: row.vpaid,
                    tid: row.tid,
                    stid: row.stid,
                    trntid: total == row.bpamt ? "30" : "20",
                    trnsr: "",
                    refkey: "",
                    uaid: row.uaid,
                    vreff: "",
                    reff: row.vdaid,
                    vtype: "1",
                    isclose: total == row.bpamt ? true : false,
                };
            });

            console.log("Submitting batch payload:", payload);

            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            const response = await axios.post(
                `${baseUrl.Url}/backend/api/SP_AddUpdRokdaVyapariBharna`,
                JSON.stringify(payload),
                { headers }
            );

            if (!VDAID) {
                const payload2 = tableData.map(row => {
                    return {
                        "vdaid": row.vdaid,
                        "isclose": true,
                    };
                });

                const response2 = await axios.post(
                    `${baseUrl.Url}/backend/api/SP_AddUpdRokdaBharnaCompleted`,
                    JSON.stringify(payload2),
                    { headers }
                );
                console.log("API Response:", response2.data);
            }


            const payload1 = tableData.map(row => {
                return {
                    "voucherAID": VDAID ? VDAID : ACSPLGUID.getNew(),
                    "uaid": row.uaid,
                    "organizationID": userdetail?.companyID ? userdetail.companyID : "",
                    "divisionID": userdetail?.departmentID ? userdetail.departmentID : "",
                    "voucherTID": "CR",
                    "voucherDate": currentDate,
                    "yapariacc": Accounts.VYAPARIACC,
                    "cashacc": Accounts.CASHACC,
                    "checkacc": Accounts.CHECKACC,
                    "onlineacc": formData.Bank,
                    "voucherAmount": row.bpamt,
                    "referenceTID": "",
                    "referenceKey": row.vpaid,
                    "narration": formData.Description,
                    "grpkey": ACSPLGUID.getNew(),
                    "oid": "30",
                    "trntype": formData.Totaldeposit ? "1" : "0",
                    "vctype": ""
                };
            });

            const response1 = await axios.post(
                `${baseUrl.Url}/backend/api/SP_TransectionVoucher`,
                JSON.stringify(payload1),
                { headers }
            );

            Swal.fire({
                icon: "success",
                title: "Saved!",
                text: "All data saved successfully.",
                confirmButtonText: "OK",
            }).then(async () => {

                try {
                    const payload = {
                        "UAID": formData.User ? formData.User : tableData.uaid,
                        "keyword": "%",
                        "companyid": userdetail?.companyID ? userdetail.companyID : "",
                        "deptid": userdetail?.departmentID ? userdetail.departmentID : "",
                    }

                    const headers = {
                        "Content-Type": "application/json",
                        Accept: "*/*",
                    };
                    const response = await axios.post(
                        `${baseUrl.Url}/backend/api/GET_RokdaVyapari`,

                        payload,
                        { headers }
                    );
                    if (response.status !== 200)
                        throw new Error("Failed to fetch vendor data");
                    console.log("quatation master", response.data)
                    // const filteredData = response.data.filter(item =>  item.isclose != true);
                    // const allReffValues = response.data.map(item => item.reff);

                    // const filteredData = response.data.filter(item => {
                    // return item.isclose != 'true' && !allReffValues.includes(item.vdaid);
                    // });
                    // setTableData(filteredData);
                    setTableData(response.data);
                } catch (error) {
                    console.error("Error fetching vendor data:", error);
                }


            })


            console.log("API Response:", response.data);
            console.log("API Response:", response1.data);


        } catch (error) {
            console.error("Submission Error:", error);
            Swal.fire({
                icon: "error",
                title: "ओह... काहीतरी चुकीचे झाले",
                text: "डेटा जतन करताना काहीतरी चुकले.",
                confirmButtonText: "ठीक आहे",
            });
        }
    }


    const MySwal = withReactContent(Swal);
    const showConfirmationAlert = () => {
        MySwal.fire({
            title: "तुम्हाला खात्री आहे का?",
            text: "तुम्ही हे डेटा जतन करू इच्छिता का?",
            showCancelButton: true,
            confirmButtonColor: "#00ff00",
            confirmButtonText: "SAVE",
            cancelButtonColor: "#092C4C",
            cancelButtonText: "CANCEL",
        }).then((result) => {
            if (result.isConfirmed) {
                handleSave();
            }
        });
    };


    const totalAmount = tableData.reduce((sum, row) => {
        const amount = parseFloat(row.bpamt) || 0;
        return sum + amount;
    }, 0);

    const totalOnline = Object.values(onlineInputs).reduce((sum, val) => sum + (parseFloat(val) || 0), 0);

    const totalCash = Object.values(cashInputs).reduce((sum, val) => sum + (parseFloat(val) || 0), 0);

    console.log("totalCashtotalCashtotalCashtotalCash", totalCash)

    const remaningAmount = totalAmount - formData.Totaldeposit - totalOnline
    const RA = totalAmount - totalOnline

    const handleExit = () => {
        showExitAlert()
    }

    const showExitAlert = () => {

        MySwal.fire({
            title: "तुम्हाला खात्री आहे का?",
            text: "तुम्हाला मागे जायचं आहे का?",
            showCancelButton: true,
            confirmButtonColor: "#00ff00",
            confirmButtonText: "हो",
            cancelButtonColor: "#092C4C",
            cancelButtonText: "नाही",
        }).then((result) => {
            if (result.isConfirmed) {

                setTableData([]);

                setFormData({
                    User: '',
                    Totaldeposit: '',
                    Reamaining: '',
                    Transaction: '',
                    Totalamount: '',
                    Description: '',
                    Bank: '',
                });
                setTableData([])
                setCashInputs([]);
                setOnlineInputs([]);

                const modal = document.getElementById("add-bharna");
                if (modal) {
                    modal.classList.remove("show");
                    modal.style.display = "none";
                    modal.setAttribute("aria-hidden", "true");

                    const modalBackdrop = document.querySelector(".modal-backdrop");
                    if (modalBackdrop) {
                        modalBackdrop.remove();
                    }
                    document.body.classList.remove("modal-open");
                    document.body.style.overflow = "auto";
                }
                if (onRefresh) {
                    onRefresh();
                }

            }
        });
    };



    //     setFormData({
    //         User: '000', 

    //     });
    //     const modal = document.getElementById("add-bharna");
    //     if (modal) {
    //         modal.classList.remove("show");
    //         modal.style.display = "none";
    //         modal.setAttribute("aria-hidden", "true");

    //         const modalBackdrop = document.querySelector(".modal-backdrop");
    //         if (modalBackdrop) {
    //             modalBackdrop.remove();
    //         }
    //         document.body.classList.remove("modal-open");
    //         document.body.style.overflow = "auto";
    //     }
    //     if (onRefresh) {
    //         onRefresh(); // refreshReceiptData from Bills.jsx
    //     }
    // }

    const customStyles = {
        control: (provided) => ({
            ...provided,
            maxHeight: "50px", // Fixed height for the input box
            overflowY: "auto", // Enable scrolling for selected options
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
            zIndex: 1050, // Ensure dropdown appears above other elements
        }),
        menuList: (provided) => ({
            ...provided,
            maxHeight: "200px",
            overflowY: "auto",
        }),
    };



    const processTotalDeposit = (value) => {
        if (value > RA) {
            Swal.fire({
                icon: "error",
                title: "त्रुटी",
                text: "एकूण भरणा रक्कम जास्त आहे.",
                confirmButtonText: "ठीक आहे",
            });
            return;
        }

        const numericValue = parseInt(value, 10);
        if (isNaN(numericValue) || value === "") {
            const resetTable = tableData.map(row => ({
                ...row,
                cash: 0,
                online: '0.00'
            }));
            setTableData(resetTable);
            return;
        }

        if (numericValue > totalAmount) {
            Swal.fire({
                icon: "error",
                title: "त्रुटी",
                text: "एकूण भरणा रक्कम जास्त आहे.",
                confirmButtonText: "ठीक आहे",
            });
            return;
        }

        let remaining = numericValue;
        let allocations = [];
        const rowCount = tableData.length;

        for (let i = 0; i < rowCount; i++) {
            const online = parseFloat(onlineInputs?.[i]) || 0;
            const capacity = (tableData[i].bpamt || 0) - online;

            if (remaining >= capacity) {
                allocations[i] = capacity;
                remaining -= capacity;
            } else {
                allocations[i] = remaining;
                remaining = 0;
            }
        }

        const updatedTable = tableData.map((row, index) => ({
            ...row,
            cash: allocations[index] || 0,
            online: onlineInputs?.[index] || '0.00'
        }));

        setTableData(updatedTable);
        setCashInputs(allocations);
    };

    useEffect(() => {
        if (formData.Totaldeposit !== "") {
            processTotalDeposit(formData.Totaldeposit);
        }
    }, [onlineInputs, formData.Totaldeposit]);

    return (
        <div>
            {/* Add Purchase */}
            <div className="modal fade" id="add-bharna">
                <div className="modal-dialog  modal-dialog-centered modal-fullscreen">
                    <div className="modal-content mbgcolor">
                        <div className="mbgcolor page-wrapper-new p-0 " style={{ overflow: 'hidden', height: '100vh' }}>
                            <div className="content ms-4 me-4 mbgcolor">
                                <div className="modal-header border-0 custom-modal-header mbgcolor">
                                    <div className="page-title">
                                        <h4>रोकडा व्यापारी भरणा </h4>
                                    </div>
                                    <button type="button"
                                        className="btn btn-cancel me-2"
                                        // data-bs-dismiss="modal" 
                                        onClick={handleExit}
                                    >मागे
                                    </button>
                                </div>
                                <form onSubmit={handleSubmit}>

                                    <div className="row mb-3">
                                        <div className="col-md-3 mb-2 mx-auto">
                                            <label className="form-label required">लिलाव वपेरकर्ता</label>
                                            <Select
                                                placeholder="निवडा"
                                                classNamePrefix="react-select"
                                                options={farmer}
                                                openMenuOnFocus={true}
                                                styles={customStyles}
                                                name="User"
                                                ref={UserRef}
                                                value={farmer.find(option => option.value === formData.User) || null}
                                                onChange={(selectedOption) => {
                                                    setFormData(prevState => ({
                                                        ...prevState,
                                                        User: selectedOption ? selectedOption.value : '',
                                                    }));
                                                    fetchServiceCharge(selectedOption.value);
                                                    // for clear data
                                                    setCashInputs([]);
                                                    setOnlineInputs([]);
                                                    setTableData([]);
                                                    setFormData(prevState => ({
                                                        ...prevState,
                                                        Bank: '',
                                                        Totaldeposit: '',
                                                    }));

                                                    if (TotaldepositRef.current) {
                                                        TotaldepositRef.current.focus();
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div className="row mt-3">
                                        <div className="col-md-2 mb-2">
                                            <label className="form-label required">एकूण रक्कम </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                readOnly
                                                name="Totalamount"
                                                // ref={msgRef}
                                                value={totalAmount}
                                                onChange={handleInputChange}
                                            />
                                        </div>

                                        <div className="col-md-2 mb-2">
                                            <label className="form-label required">एकूण टोटल जमा </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="Totaldeposit"
                                                ref={TotaldepositRef}
                                                value={formData.Totaldeposit}
                                                onKeyDown={(e) => handleKeyDown(e, TransactionRef)}
                                                // value={grandTotal}
                                                onChange={handleInputChange}
                                            />
                                        </div>

                                        <div className="col-md-2 mb-2">
                                            <label className="form-label required">उर्वरित रक्कम</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="Reamaining"
                                                readOnly
                                                // ref={msgRef}
                                                value={remaningAmount}
                                                onChange={handleInputChange}
                                            />
                                        </div>

                                        {/* <div className="col-md-3 mb-2">
                                                <label className="form-label required">व्यवहार प्रकार</label>
                                                <Select
                                                    placeholder="निवडा"
                                                    classNamePrefix="react-select"
                                                    options={TransctionType}
                                                    openMenuOnFocus={true}
                                                    name="Transaction"
                                                    required
                                                    ref={TransactionRef}
                                                    value={TransctionType.find(option => option.value === formData.Transaction) || null}
                                                    onChange={(selectedOption) => {
                                                        setFormData(prevState => ({
                                                            ...prevState,
                                                            Transaction: selectedOption ? selectedOption.value : '',
                                                        }));
                                                        if (BankRef.current) {
                                                            BankRef.current.focus();
                                                        }
                                                    }}
                                                />
                                            </div> */}

                                        <div className="col-md-6 mb-2">
                                            <label className="form-label required">बँक नाव </label>
                                            <Select
                                                placeholder="निवडा"
                                                classNamePrefix="react-select"
                                                options={BankName}
                                                openMenuOnFocus={true}
                                                styles={customStyles}
                                                name="Bank"
                                                required
                                                ref={BankRef}
                                                value={BankName.find(option => option.value === formData.Bank) || null}
                                                onChange={(selectedOption) => {
                                                    setFormData(prevState => ({
                                                        ...prevState,
                                                        Bank: selectedOption ? selectedOption.value : '',
                                                    }));
                                                    // if (AmountRef.current) {
                                                    //     AmountRef.current.focus();
                                                    // }
                                                }}
                                            />
                                        </div>

                                        <div className="col-md-12 mb-2">
                                            <label className="form-label">स्पष्टीकरण </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="Description"
                                                // ref={msgRef}
                                                value={formData.Description}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-lg-12">
                                        <div className="modal-body-table overflow-auto max-vh-100" >
                                            <div className="table-responsive" style={{ height: "calc(40vh - 120px)" }}>
                                                <table className="table table-bordered table-sm">
                                                    <thead className="thead-dark" style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: '#343a40' }}>
                                                        <tr>
                                                            <th className="col-2" style={{ textAlign: 'center' }}>व्यापारी नावे </th>
                                                            <th className="col-1" style={{ textAlign: 'center' }}>दिनांक</th>
                                                            <th className="col-1" style={{ textAlign: 'center' }}>रक्कम  </th>
                                                            <th className="col-1" style={{ textAlign: 'center' }}>कॅश रक्कम</th>
                                                            <th className="col-1" style={{ textAlign: 'center' }}>ऑनलाइन रक्कम</th>
                                                            {/* <th className="col-1" style={{ textAlign: 'center' }}>क्रुती</th> */}
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {tableData.map((row, index) => (
                                                            <tr key={index}>
                                                                <td style={{ textAlign: 'center' }}>{row.vname}</td>
                                                                <td style={{ textAlign: 'center' }}>{row.trndt}</td>
                                                                <td style={{ textAlign: 'center' }}>{row.bpamt}</td>
                                                                <td style={{ textAlign: 'center' }}>
                                                                    <input
                                                                        type="text"
                                                                        value={cashInputs[index] || row.cash || ""}
                                                                        readOnly
                                                                        onChange={(e) => {
                                                                            const value = parseFloat(e.target.value) || 0;
                                                                            setCashInputs((prev) => ({ ...prev, [index]: value }));
                                                                        }}
                                                                        className="form-control form-control-sm border-0 border-bottom border-warning text-center"
                                                                    />
                                                                </td>
                                                                <td style={{ textAlign: 'center' }}>
                                                                    <input
                                                                        type="text"
                                                                        value={onlineInputs[index] || ""}
                                                                        onBlur={() => {
                                                                            const enteredValue = parseFloat(onlineInputs[index]) || 0;

                                                                            if (enteredValue > row.bpamt) {
                                                                                Swal.fire({
                                                                                    icon: "error",
                                                                                    title: "त्रुटी",
                                                                                    text: "ऑनलाइन रक्कम ही रक्कम जास्त आहे.",
                                                                                    confirmButtonText: "ठीक आहे",
                                                                                }).then(() => {
                                                                                    setOnlineInputs(prev => ({ ...prev, [index]: "" }));
                                                                                })
                                                                            }
                                                                        }}
                                                                        onChange={(e) => {
                                                                            const value = parseFloat(e.target.value) || 0;

                                                                            // Save online value
                                                                            setOnlineInputs((prev) => ({ ...prev, [index]: e.target.value }));

                                                                            // Get original cash from row or cashInputs
                                                                            const originalCash = row.cash ?? 0;

                                                                            // If cash is 0, don't subtract
                                                                            if (originalCash === 0) return;

                                                                            // If field is cleared, restore original cash
                                                                            if (e.target.value === "") {
                                                                                setCashInputs((prev) => ({ ...prev, [index]: originalCash }));
                                                                                //   processTotalDeposit(formData.Totaldeposit);
                                                                                return;
                                                                            }

                                                                            // Otherwise, subtract online from original cash
                                                                            const newCash = originalCash - value;

                                                                            setCashInputs((prev) => ({ ...prev, [index]: newCash }));

                                                                        }}
                                                                        className="form-control form-control-sm border-0 border-bottom border-warning text-center"
                                                                    />
                                                                </td>


                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>





                                    <div className="col-lg-12 mt-3">
                                        <div className="btn-addproduct ">
                                            <button type="button"
                                                className="btn btn-cancel me-2"
                                                // data-bs-dismiss="modal" 
                                                onClick={handleExit}
                                            >मागे
                                            </button>

                                            <button type="submit"
                                                className="btn btn-submit"
                                                onClick={() => {
                                                    if (totalCash > 0 && formData.Bank) {
                                                        setAmount(totalCash)
                                                        const modal = document.getElementById("Rokda");
                                                        if (modal) {
                                                            modal.classList.add("show");
                                                            modal.style.display = "block";
                                                            modal.setAttribute("aria-modal", "true");
                                                            modal.setAttribute("role", "dialog");
                                                            modal.removeAttribute("aria-hidden");
                                                            const backdrop = document.createElement("div");
                                                            backdrop.className = "modal-backdrop fade show";
                                                            document.body.appendChild(backdrop);
                                                            document.body.classList.add("modal-open");
                                                            document.body.style.overflow = "hidden";
                                                            document.body.style.paddingRight = "0px";
                                                        }
                                                    }
                                                }}
                                            >सेव्ह
                                            </button>
                                        </div>
                                    </div>

                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <RokdaAddCash onRefresh={refreshData} TOTALAMOUNT={Amount} onClose={handleModalClose} />
        </div>
    );
};

export default AddRokadaVyapariBharana;

