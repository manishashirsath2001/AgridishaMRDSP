import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import { ChevronUp, ArrowLeft, Trash2, Edit } from "feather-icons-react/build/IconComponents";
import { useDispatch, useSelector } from "react-redux";
import { setToogleHeader } from "../../core/redux/action";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import axios from 'axios';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Accounts, ACSPLGUID, baseUrl, convertToISODate } from "../../core/json/custom";
import { all_routes } from "../../Router/all_routes";
import { useNavigate, useLocation } from "react-router-dom";
import ImageWithBasePath from "../../core/img/imagewithbasebath";
import { getUserData } from "../../Context/UserData";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
const AddCashCounter = ({ baid, pkid, isclose, onRefresh }) => {
    const MySwal = withReactContent(Swal);
    const route = all_routes;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const data = useSelector((state) => state.toggle_header);
    const GUID = ACSPLGUID.getNew()
    const location = useLocation();
    // const { pkid } = location.state || {};
    const { userdetail } = getUserData();

    const [Services, setServices] = useState([]);
    const [dataExists, setDataExists] = useState([]);
    const SEARCHREF = useRef(null);

    const [farmeName, setfarmeName] = useState([]);
    const [Billno, setBillno] = useState([]);
    const [Crop, setCrop] = useState([]);
    const [BillDate, setBillDate] = useState("");
    const [cashamount, setCashAmount] = useState([]);
    const [chequeamount, setChequeAmount] = useState([]);
    const [onlineamount, setonlineAmount] = useState([]);
    const [totalAmount, settotalAmount] = useState([]);
    const [totalWeight, settotalWeight] = useState([]);
    const [tabledata, settabledata] = useState([]);
    const [remainingamount, setremainingamount] = useState([]);
    const [totalCost, settotalCost] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const inputRefs = useRef([]);
    const ChequeRefs = useRef([]);
    const OnlineRefs = useRef([]);
    const EditRefs = useRef([]);
    const saveRef = useRef(null);
    const [modalData, setModalData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [customNotes, setCustomNotes] = useState({});
    const [totalSeva, setTotalSeva] = useState(0);
    const [lastEditedNote, setLastEditedNote] = useState(null);
    const [isFormDisabled, setIsFormDisabled] = useState(false);

    const [formData, setFormData] = useState({
        baid: '',
        faid: '',
        pkid: '',
        btokanno: '',
        BillNo: '',
        date: '',
        fullname: '',
        vehicleno: '',
        amount: '',
        billamount: '',
        totalCashAmount: '',
        hamali: '',
        chequeAmount: '',
        onlineAmount: '',
        remaining: '',
        status: '',
        fname: '',
        maid: '',
        chequeno: ''
    });

    useEffect(() => {
        const modal = document.getElementById("AddCash");

        if (modal) {
            const handleShown = () => {

                SEARCHREF.current?.focus();
            };

            modal.addEventListener("shown.bs.modal", handleShown);


            return () => {
                modal.removeEventListener("shown.bs.modal", handleShown);
            };
        }
    }, []);


    const handleKeyDown = (e, nextFieldRef) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            nextFieldRef.current.focus();
        }
    };

    const handleKeyDown1 = (e, nextRef) => {
        if (e.key === 'Enter' && nextRef) {
            e.preventDefault();
            nextRef.focus();
        }
    };


    const onKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            setTimeout(() => {
                if (EditRefs.current[0]) {
                    EditRefs.current[0].focus();
                } else {
                    console.log("EditRefs[0] is undefined");
                }
            }, 100);
        }
    };

    useEffect(() => {
        if (!baid) return;

        const fetchBillData = async () => {
            try {
                const payload1 = {
                    baid: baid,
                    keyword: "%",
                    date: userdetail.APPDT,
                    companyid: userdetail?.companyID || "",
                    deptid: userdetail?.departmentID || "",
                };

                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };

                const response = await axios.post(
                    baseUrl.Url + "/backend/api/GET_RECEIPTMasterDataMatch",
                    payload1,
                    { headers }
                );

                if (response.status !== 200) throw new Error("Failed to fetch data");

                let apiData = response.data;

                const mappedData = apiData.map((item) => {
                    const isClosed =
                        item.isclose === true ||
                        item.isclose === "true" ||
                        item.isclose === 1;

                    return {
                        ...item,
                        cashAmount: item.cashamount?.toString() || "0",
                        chequeAmount: item.chequeamount?.toString() || "0",
                        onlineAmount: item.onlineamount?.toString() || "0",
                        isDisabled: isClosed,
                    };
                });

                setTableData(mappedData);

                if (mappedData.length > 0) {
                    const firstRow = mappedData[0];

                    const isClosed =
                        firstRow.isclose === true ||
                        firstRow.isclose === "true" ||
                        firstRow.isclose === 1;

                    setFormData((prev) => ({
                        ...prev,
                        baid: firstRow.baid,
                        btokanno: firstRow.btokanno,
                        BillNo: firstRow.billno,
                        date: convertToISODate(firstRow.date),
                        fullname: firstRow.fname,
                        maid: firstRow.maid,
                        vehicleno: firstRow.vehno,
                        hamali:
                            Number(firstRow.sevaValue) % 1 === 0
                                ? Number(firstRow.sevaValue)
                                : parseFloat(Number(firstRow.sevaValue).toFixed(2)),
                        amount: firstRow.remainingamount,
                        billamount: Math.round(Number(firstRow.remainingamount)),
                        cashamount: firstRow.cashAmount,
                        chequeamount: firstRow.chequeAmount,
                        onlineamount: firstRow.onlineAmount,
                        isclose: isClosed,
                        status: firstRow.cashstatus === true || firstRow.cashstatus === "true" ? "1" : "0",
                        pkid: firstRow.pkid,
                    }));
                    setIsFormDisabled(true);
                    // if (mappedData.length === 1 && !isClosed) {
                    //     setIsFormDisabled(false);
                    // } else if (isClosed) {
                    //     Swal.fire({
                    //         icon: "info",
                    //         title: "सूचना",
                    //         text: "ही नोंद पूर्ण झाली आहे, त्यामुळे तुम्ही माहिती बदलू शकत नाही.",
                    //         confirmButtonText: "ठीक आहे",
                    //     });

                    //     setIsFormDisabled(true);
                    // } 

                }
                else {
                    setIsFormDisabled(false);
                }
            } catch (error) {
                console.error("Error in GET_CashCounter API Call:", error);
            }
        };

        fetchBillData();
    }, [baid]);

    const detectField = (value) => {

        let payload = {
            btokanno: '',
            fname: '',
            vehicleno: '',
            keyword: '%',
            companyid: userdetail?.companyID ? userdetail.companyID : "",
            deptid: userdetail?.departmentID ? userdetail.departmentID : ""

        };

        if (/^[A-Z]{2}\d{1,2}[A-Z]{0,2}\d{3,4}$/i.test(value)) {
            // Softer vehicle no check
            payload.vehicleno = value;
        } else if (/^\d+$/.test(value)) {
            // Pure digits - Token Number
            payload.btokanno = value;
        } else {
            // Otherwise - it's name
            payload.fname = value;
        }

        return payload;
    };

    const formatDate = (inputDate) => {
        const date = new Date(inputDate);
        const year = date.getFullYear();
        const month = (`0${date.getMonth() + 1}`).slice(-2);
        const day = (`0${date.getDate()}`).slice(-2);
        return `${year}-${month}-${day}`;
    };

    const handleSearch1 = async (ID) => {
        const trimmedID = ID.trim();

        if (!trimmedID) {
            setTableData([]);
            setShowModal(false);
            return;
        }

        const payload = detectField(trimmedID);

        try {
            const response = await axios.post(
                `${baseUrl.Url}/backend/api/GET_BillNoSearch`,
                payload,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: '*/*',
                    },
                }
            );

            if (response.status === 200 && response.data.length > 0) {
                const updatedData = response.data.map((row, index) => {
                    const billAmt = parseFloat(row.remainingamount || 0);
                    const sevaAmt = parseFloat(row.sevaValue || 0);
                    const isClosed = row.isclose === true || row.isclose === "true" || row.isclose === 1;

                    return {
                        ...row,
                        cashAmount1: Math.round(billAmt + sevaAmt).toString(),
                        cashAmount: row.cashamount != null ? row.cashamount.toString() : '0',
                        chequeAmount: row.chequeamount != null ? row.chequeamount.toString() : '0',
                        onlineAmount: row.onlineamount != null ? row.onlineamount.toString() : '0',
                        isDisabled: isClosed,
                    };
                });


                if ((payload.vehicleno || response.data.length === 1) && !updatedData[0].isDisabled) {
                    const farmerData = updatedData[0];
                    if (farmerData.isDisabled) {
                        Swal.fire({
                            icon: 'info',
                            title: 'सूचना',
                            text: 'हा व्यवहार आधीच पूर्ण झाला आहे,त्यामुळे तुम्ही माहिती बदलू शकत नाही.',
                            confirmButtonText: 'ठीक आहे',
                        });
                        return;
                    }

                    setFormData({
                        fullname: farmerData.fname || '',
                        btokanno: farmerData.btokanno || '',
                        date: farmerData.date ? formatDate(farmerData.date) : '',
                        vehicleno: farmerData.vehicleno || '',
                        billamount: farmerData.remainingamount || '',
                        amount: farmerData.remainingamount || '',
                        hamaali: Math.round(Number(farmerData.sevaValue || 0)),
                        status: farmerData.status || '',
                        // cashAmount: farmerData.cashAmount || '0',
                        // chequeAmount: farmerData.chequeAmount || '0',
                        // onlineAmount: farmerData.onlineAmount || '0',
                        isclose: farmerData.isclose || false,
                    });

                    updatedData[0].isDisabled = false;

                    setTableData(updatedData);
                    setShowModal(false);
                } else {
                    setModalData(updatedData);
                    setShowModal(true);
                }
            }

        } catch (error) {
            console.error('Error fetching Bill data:', error);
        }
    };

    useEffect(() => {
        if (!showModal) return;

        let firstEnterHandled = false;

        const handleKeyDown = (e) => {
            if (e.key === 'ArrowDown') {
                setSelectedIndex((prev) =>
                    prev < modalData.length - 1 ? prev + 1 : prev
                );
            } else if (e.key === 'ArrowUp') {
                setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
            } else if (e.key === 'Enter') {
                if (firstEnterHandled) {
                    const item = modalData[selectedIndex];
                    if (item) {
                        setFormData({
                            fullname: item.fname || '',
                            btokanno: item.btokanno || '',
                            date: item.date ? formatDate(item.date) : '',
                            vehicleno: item.vehicleno || '',
                            billamount: item.remainingamount || '',
                            amount: item.remainingamount || '',
                            hamaali: item.sevaValue || '',
                            status: item.status || '',
                        });
                        setTableData([item]);
                        setShowModal(false);
                    }
                } else {

                    firstEnterHandled = true;
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [showModal, selectedIndex, modalData]);


    const handleAmountChange = (e, index, key) => {
        let value = e.target.value.replace(/[^0-9]/g, "");

        if (value.length > 1 && value.startsWith("0")) {
            value = value.replace(/^0+/, '') || "0";
        }

        const updated = [...tableData];
        const maxAmount = Number(updated[index].cashAmount1);
        const inputVal = Number(value || 0);

        let cash = Number(updated[index].cashAmount || 0);
        let cheque = Number(updated[index].chequeAmount || 0);
        let online = Number(updated[index].onlineAmount || 0);

        if (key === "cashAmount") {
            cash = inputVal;

            if (!value || inputVal === 0) {
                cheque = 0;
                online = 0;
                setCustomNotes({});
            } else {
                const remaining = maxAmount - cash;
                cheque = remaining >= 0 ? remaining : 0;
                online = 0;
            }
        } else if (key === "chequeAmount") {
            cheque = inputVal;
            const remaining = maxAmount - (cash + cheque);
            online = remaining >= 0 ? remaining : 0;
        } else if (key === "onlineAmount") {
            online = inputVal;
            const remaining = maxAmount - (cash + online);
            cheque = remaining >= 0 ? remaining : 0;
        }

        const total = cash + cheque + online;
        if (total > maxAmount) {
            Swal.fire({
                icon: "error",
                title: "चूक",
                text: `एकूण रक्कम ₹${maxAmount} पेक्षा जास्त असू शकत नाही.`,
            });
            return;
        }

        updated[index] = {
            ...updated[index],
            cashAmount: cash.toString(),
            chequeAmount: cheque.toString(),
            onlineAmount: online.toString(),
        };

        setTableData(updated);
    };


    useEffect(() => {
        const updated = tableData.map(row => {
            if (!row.cashAmount1 || row.cashAmount1 === "") {
                const billAmt = parseFloat(row.remainingamount || 0);
                const sevaAmt = parseFloat(row.sevaValue || 0);
                return {
                    ...row,
                    cashAmount1: Math.round(billAmt + sevaAmt).toString()
                };
            }
            return row;
        });
        setTableData(updated);
    }, [tableData.length]);


    useEffect(() => {

        const totalCash = tableData.reduce((sum, row) => {
            const cash = parseFloat(row.cashAmount || 0);
            return sum + cash;
        }, 0);

        if (totalCash > 0) {
            fetchCashDetails(totalCash);
        } else {
            setCashDetails([]);
        }
    }, [tableData]);


    const cashValues = [2000, 500, 200, 100, 50, 20, 10];
    const [cashDetails, setCashDetails] = useState([]);

    const fetchCashDetails = async (cashAmount) => {
        const payload = {
            amount: parseInt(cashAmount) || 0,
        };

        try {
            const response = await axios.post(baseUrl.Url + "/backend/api/GET_CashDetailsNearbyCash", payload, {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "*/*"
                }
            });

            setCashDetails(response.data);
        } catch (err) {
            console.error("Failed to fetch cash details:", err);
        }
    };

    const totalCash = tableData.reduce((sum, row) => {
        const cash = parseFloat(row.cashAmount || 0);
        return sum + cash;
    }, 0);


    const getNoteCount = (noteValue) => {
        return (cashDetails.find(note => note.note === noteValue)?.noteCount || 0);
    };

    const getNoteTotal = (noteValue) => {
        return getNoteCount(noteValue) * parseInt(noteValue);
    };


    const handleSubmit = (e) => {
        e.preventDefault();

        const form = e.target.closest("form");

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        if (formData.isclose === true) {
            Swal.fire({
                icon: "warning",
                title: "सूचना",
                text: "हा व्यवहार आधीच पूर्ण झाला आहे.त्यामुळे तुम्ही माहिती बदलू शकत नाही.",
            });
            return;
        }
        if (tableData.length === 0) {
            Swal.fire({
                icon: "warning",
                title: "डेटा सापडला नाही",
                text: "कृपया आधी रेकॉर्ड Search करा.",
            });
            return;
        }
        handleFormSubmission();
    };


    const showConfirmationAlert = () => {
        MySwal.fire({
            title: "तुम्हाला खात्री आहे का?",
            text: "तुम्हाला मागे जायचं आहे का?",
            showCancelButton: true,
            confirmButtonColor: "#00ff00",
            confirmButtonText: "हो",
            cancelButtonColor: "#092C4C",
            cancelButtonText: "नाही",
            allowOutsideClick: false,
            backdrop: true
        }).then((result) => {
            if (result.isConfirmed) {
                handleFormSubmission();
            }
        });
    };

    const safePlus = (a, b) => {
        return (parseInt(a) || 0) + (parseInt(b) || 0);
    };

    const safeMinus = (a, b) => {
        return (parseInt(a) || 0) - (parseInt(b) || 0);
    };

    const handleFormSubmission = async () => {

        const isCashInvalid = tableData.some(row => !row.cashAmount || parseFloat(row.cashAmount) <= 0);
        if (isCashInvalid) {
            Swal.fire({
                icon: "info",
                title: "सूचना",
                text: "कृपया रक्कम भरा.",
            });
            return;
        }
        const cashamount = (parseFloat(totalCash) + parseFloat(totalSeva)).toFixed(2);
        const totalChequeAmount = tableData.reduce((sum, row) => sum + parseFloat(row.chequeAmount || 0), 0);
        const totalOnlineAmount = tableData.reduce((sum, row) => sum + parseFloat(row.onlineAmount || 0), 0);

        try {
            const payload = {
                pkid: formData.pkid ? formData.pkid : GUID,
                tokenno: formData.btokanno,
                baid: formData.baid || "",
                faid: formData.maid || "",
                billno: String(formData.BillNo || ""),
                tarikh: formData.date,
                fullname: formData.fullname || "",
                vehicleno: formData.vehicleno,
                amount: parseFloat(formData.amount) || "",
                billamount: parseFloat(formData.billamount) || "",
                cashamount: cashamount,
                chequeamount: totalChequeAmount,
                onlineamount: totalOnlineAmount,
                hamali: parseFloat(formData.hamali) || 0,
                remainingamount: parseFloat(formData.remaining) || 0,
                chequeno: 0,
                status: 1,
                isclose: true,
                ischecked: false,
                companyid: userdetail?.companyID || "",
                deptid: userdetail?.departmentID || ""
            };

            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            const response = await axios.post(
                baseUrl.Url + "/backend/api/SP_AddUpdCashCounter",
                payload,
                { headers }
            );

            if (response.status === 200) {
                const totalSum = cashDetails.reduce((sum, item) => sum + item.total, 0);

                const noteMap = {};
                cashDetails.forEach(item => {
                    noteMap[item.note] = item.noteCount;
                });

                const getSummaryPayload = {
                    companyid: userdetail?.companyID || "",
                    deptid: userdetail?.departmentID || ""
                };

                const summaryResponse = await axios.post(
                    `${baseUrl.Url}/backend/api/GET_GateCashSummary`,
                    getSummaryPayload,
                    { headers }
                );

                if (summaryResponse.status === 200 && summaryResponse.data.length > 0) {
                    const data = summaryResponse.data[0];

                    const updatedPayload = {
                        casid: data.casid,
                        casdate: data.casdate,
                        casbankname: data.casbankname,
                        casinvertcash: parseFloat(data.casinvertcash) || 0,

                        caS2000: safeMinus(data.caS2000, noteMap[2000]),
                        caS500: safeMinus(data.caS500, noteMap[500]),
                        caS200: safeMinus(data.caS200, noteMap[200]),
                        caS100: safeMinus(data.caS100, noteMap[100]),
                        caS50: safeMinus(data.caS50, noteMap[50]),
                        caS20: safeMinus(data.caS20, noteMap[20]),
                        caS10: safeMinus(data.caS10, noteMap[10]),
                        cascoins: safeMinus(data.cascoins, noteMap[1]),

                        castotal: safeMinus(data.castotal, totalSum),
                        companyid: userdetail?.companyID || "",
                        deptid: userdetail?.departmentID || ""
                    };

                    await axios.post(`${baseUrl.Url}/backend/api/SP_AddUpdCashSummary`, updatedPayload, { headers });

                    const noteMapManual = {
                        2000: customNotes[2000] || 0,
                        500: customNotes[500] || 0,
                        200: customNotes[200] || 0,
                        100: customNotes[100] || 0,
                        50: customNotes[50] || 0,
                        20: customNotes[20] || 0,
                        10: customNotes[10] || 0,
                        1: customNotes[1] || 0,
                    };

                    const totalSumManual = Object.keys(noteMapManual).reduce((acc, note) => {
                        return acc + (parseInt(note) * parseInt(noteMapManual[note] || 0));
                    }, 0);

                    const intermediateSummary = {
                        caS2000: updatedPayload.caS2000,
                        caS500: updatedPayload.caS500,
                        caS200: updatedPayload.caS200,
                        caS100: updatedPayload.caS100,
                        caS50: updatedPayload.caS50,
                        caS20: updatedPayload.caS20,
                        caS10: updatedPayload.caS10,
                        cascoins: updatedPayload.cascoins,
                        castotal: updatedPayload.castotal,
                    };

                    const updatedPayload1 = {
                        casid: data.casid,
                        casdate: data.casdate,
                        casbankname: data.casbankname,
                        casinvertcash: parseFloat(data.casinvertcash) || 0,

                        caS2000: safePlus(intermediateSummary.caS2000, noteMapManual[2000]),
                        caS500: safePlus(intermediateSummary.caS500, noteMapManual[500]),
                        caS200: safePlus(intermediateSummary.caS200, noteMapManual[200]),
                        caS100: safePlus(intermediateSummary.caS100, noteMapManual[100]),
                        caS50: safePlus(intermediateSummary.caS50, noteMapManual[50]),
                        caS20: safePlus(intermediateSummary.caS20, noteMapManual[20]),
                        caS10: safePlus(intermediateSummary.caS10, noteMapManual[10]),
                        cascoins: safePlus(intermediateSummary.cascoins, noteMapManual[1]),

                        castotal: safePlus(intermediateSummary.castotal, totalSumManual),
                        companyid: userdetail?.companyID || "",
                        deptid: userdetail?.departmentID || ""
                    };

                    await axios.post(`${baseUrl.Url}/backend/api/SP_AddUpdCashSummary`, updatedPayload1, { headers });

                    await checkIfDataExists();
                }


                const voucherPayload = {
                    uaid: userdetail.uaid || "",
                    organizationID: userdetail?.companyID || "",
                    divisionID: userdetail?.departmentID || "",
                    voucherDate: userdetail.APPDT,
                    farmeracc: Accounts.FARMERACC || "",
                    cashacc: Accounts.CASHACC || "",
                    voucherAmount: parseFloat(cashamount) || 0,
                    referenceKey: formData.baid || "",
                    vreff: formData.pkid ? formData.pkid : GUID,
                    isDeleted: true
                };

                await axios.post(`${baseUrl.Url}/backend/api/SP_CashCounterVoucher`, voucherPayload, { headers });

                Swal.fire({
                    icon: "success",
                    title: "जतन केले!",
                    text: "डेटा यशस्वीरित्या जतन करण्यात आला आहे.",
                    confirmButtonText: "ठीक आहे",
                }).then(() => {
                    settabledata({
                        btokanno: '',
                        fullname: '',
                        billamount: '',
                        cashAmount: '',
                        chequeAmount: '',
                        onlineAmount: '',
                        fname: "",
                        hamali: "",
                    });
                    setTableData([]);
                    setCustomNotes({
                        2000: 0,
                        500: 0,
                        200: 0,
                        100: 0,
                        50: 0,
                        20: 0,
                        10: 0,
                        1: 0,
                    });
                    setSearchInput('');
                    const modalElement = document.getElementById('AddCash');
                    const modalInstance = bootstrap.Modal.getInstance(modalElement);
                    if (modalInstance) modalInstance.hide();
                });

                navigate(route.CashCounter);
            } else {
                throw new Error("Cash Summary save failed");
            }
        } catch (error) {
            console.error("Submission Error:", error);
            Swal.fire({
                icon: "error",
                title: "चूक",
                text: "डेटा जतन करण्यात अयशस्वी. कृपया पुन्हा प्रयत्न करा.",
            });
        }
    };


    useEffect(() => {
        const fetchData = async () => {
            if (!baid) return;

            await fetchChequeDetails();
            await fetchServiceCharges();
        };

        fetchData();
    }, [baid]);

    const fetchChequeDetails = async () => {
        try {
            const payload = {
                baid: baid,
                companyid: userdetail?.companyID ? userdetail.companyID : "",
                deptid: userdetail?.departmentID ? userdetail.departmentID : ""
            };
            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };
            const response = await axios.post(`${baseUrl.Url}/backend/api/GET_CreateBill`, payload, { headers });

            if (response.status !== 200) throw new Error("Failed to fetch vendor data");

            if (Array.isArray(response.data) && response.data.length > 0) {
                const first = response.data[0];
                setfarmeName(first.fullname);
                setBillno(first.billno);
                setBillDate(convertToISODate(first.date));
                setCrop(first.croplabel);
                settotalWeight(first.totalweight);
                settotalAmount(first.totalamount);
                settotalCost(first.totalcost);
                // setremainingamount(first.remainingamount);
                setremainingamount(Math.round(Number(first.remainingamount)));
                setCashAmount(first.cashamount);
                setChequeAmount(first.chequeamount);
                setonlineAmount(first.onlineamount);
                settabledata(response.data);

            } else {
                console.warn("GET_CreateBill returned empty or invalid data:", response.data);
            }
        } catch (error) {
            console.error("Error fetching vendor data:", error);
        }
    };

    const fetchServiceCharges = async () => {
        try {
            const payload = {
                baid: baid,
                companyid: userdetail?.companyID ? userdetail.companyID : "",
                deptid: userdetail?.departmentID ? userdetail.departmentID : ""
            };
            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };
            const response = await axios.post(`${baseUrl.Url}/backend/api/GET_FarmerBillCharges`, payload, { headers });

            if (response.status !== 200) throw new Error("Failed to fetch Service data");

            console.log("Services Charge", response.data);
            setServices(response.data);
        } catch (error) {
            console.error("Error fetching Services Charge data:", error);
        }
    };

    const showExitAlert = () => {
        MySwal.fire({
            title: "तुम्हाला खात्री आहे का?",
            text: "तुम्हाला मागे जायचं आहे का?",
            showCancelButton: true,
            confirmButtonColor: "#00ff00",
            confirmButtonText: "हो",
            cancelButtonColor: "#092C4C",
            cancelButtonText: "नाही",
            allowOutsideClick: false,
            backdrop: true
        }).then((result) => {
            if (result.isConfirmed) {
                settabledata({
                    btokanno: '',
                    fullname: '',
                    billamount: '',
                    cashAmount: '',
                    chequeAmount: '',
                    onlineAmount: '',
                    fname: "",
                    hamali: "",
                });

                setFormData({});
                setTableData([]);
                setShowModal(false);
                const modal = document.getElementById("AddCash");
                if (modal) {
                    modal.classList.remove("show");
                    modal.style.display = "none";
                    modal.setAttribute("aria-hidden", "true");

                    const backdrops = document.querySelectorAll(".modal-backdrop");
                    backdrops.forEach((backdrop) => {
                        backdrop.parentNode.removeChild(backdrop);
                    });

                    document.body.classList.remove("modal-open");
                    document.body.style.overflow = "auto";
                    document.body.style.paddingRight = "";
                }

                if (onRefresh) {
                    onRefresh();
                }
            }
        });
    };

    useEffect(() => {
        const handleShortcut = (e) => {
            const isCtrlE = e.ctrlKey && (e.key === 'e' || e.key === 'E');
            const isCtrlS = e.ctrlKey && (e.key === 's' || e.key === 'S');

            if (isCtrlE) {
                e.preventDefault();
                e.stopPropagation();
                showExitAlert();
            }

            if (isCtrlS) {
                e.preventDefault();
                if (formData.isclose === true) {
                    Swal.fire({
                        icon: "warning",
                        title: "सूचना",
                        text: "हा व्यवहार आधीच पूर्ण झाला आहे. त्यामुळे तुम्ही माहिती बदलू शकत नाही.",
                    });
                    return;
                } else {
                    handleFormSubmission();
                }
            }
        };

        window.addEventListener('keydown', handleShortcut, true);

        return () => {
            window.removeEventListener('keydown', handleShortcut, true);
        };
    }, [formData, handleFormSubmission, showExitAlert]);


    const closeModal = () => {
        const modal = document.getElementById("AddCash");

        setFormData({});
        setTableData([]);
        setShowModal(false);
        if (modal) {
            modal.classList.remove("show");
            modal.style.display = "none";
            modal.setAttribute("aria-hidden", "true");

            const backdrops = document.querySelectorAll(".modal-backdrop");
            backdrops.forEach((backdrop) => {
                backdrop.parentNode.removeChild(backdrop);
            });

            document.body.classList.remove("modal-open");
            document.body.style.overflow = "auto";
            document.body.style.paddingRight = "";
        }

        if (window.history.state === "modal-open") {

            history.back();
        }

        if (onRefresh) {
            onRefresh(); // Refresh if needed
        }
    };

    window.addEventListener("popstate", (event) => {
        const modal = document.getElementById("AddCash");
        if (modal && modal.classList.contains("show")) {
            closeModal();
            navigate(route.CashCounter)

            // Push the state back to prevent navigating away
            history.pushState(null, "", window.location.href);
        }
    });

    const formatDate1 = (dateStr) => {
        const date = new Date(dateStr);
        if (isNaN(date)) return "";
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        }); // e.g., "17 Apr 2025"
    };
    const getBillDetails = async (baid) => {
        try {
            const payload = {
                baid,
                date: userdetail.APPDT,
                btokanno: '',
                fname: '',
                vehicleno: '',
                keyword: '%',
                companyid: userdetail?.companyID ? userdetail.companyID : "",
                deptid: userdetail?.departmentID ? userdetail.departmentID : ""
            };
            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            const [billRes, serviceRes] = await Promise.all([
                axios.post(`${baseUrl.Url}/backend/api/GET_CreateBill`, payload, { headers }),
                axios.post(`${baseUrl.Url}/backend/api/GET_FarmerBillCharges`, payload, { headers })
            ]);

            if (billRes.status === 200 && Array.isArray(billRes.data) && billRes.data.length > 0) {
                const first = billRes.data[0];
                setfarmeName(first.fullname);
                setBillno(first.billno);
                setBillDate(formatDate1(first.date));
                setCrop(first.croplabel);
                settotalWeight(first.totalweight);
                settotalAmount(first.totalamount);
                settotalCost(Math.round(Number(first.totalcost)));
                // setremainingamount(first.remainingamount);
                setremainingamount(Math.round(Number(first.remainingamount)));
                settabledata(billRes.data);
                setCashAmount(first.cashamount);
                setChequeAmount(first.chequeamount);
                setonlineAmount(first.onlineamount);
            }

            if (serviceRes.status === 200) {
                setServices(serviceRes.data);
            }

            return true;
        } catch (error) {
            console.error("Error fetching bill/service data", error);
            return false;
        }
    };

    const totalRemaining = tableData.reduce((sum, row) => sum + (parseFloat(row.remainingamount) || 0), 0);

    const handleCustomNoteChange = (note, value) => {
        const parsedValue = parseInt(value);
        setCustomNotes(prev => ({
            ...prev,
            [note]: isNaN(parsedValue) ? "" : parsedValue
        }));
    };


    useEffect(() => {
        const totalNoteAmount = cashDetails.reduce((sum, note) => sum + (note.total || 0), 0);
        const remainingCash = parseFloat(
            (() => {
                const msg = cashDetails[0]?.remainingAmountMSG || "";
                const match = msg.match(/Remaining cash:\s?\₹?([\d.]+)/);
                return match ? match[1] : "0";
            })()
        );

        const grandTotal = totalNoteAmount + remainingCash;
        const expectedTotal = parseFloat(totalCash) + parseFloat(totalSeva);
        const extraAmount = grandTotal - expectedTotal;

        if (extraAmount > 0 && lastEditedNote !== null) {
            Swal.fire({
                icon: 'warning',
                title: 'जास्त रक्कम',
                text: `आपण जास्त ₹${extraAmount.toFixed(2)} रक्कम भरली आहे.`,
            }).then(() => {
                const updatedDetails = cashDetails.map(note =>
                    note.note === lastEditedNote
                        ? { ...note, noteCount: 0, total: 0 }
                        : note
                );
                setCashDetails(updatedDetails);
            });
        }
    }, [cashDetails, totalCash, totalSeva]);


    const getAvailableNoteCount = (note) => {
        const found = dataExists.find(item => item.note === note);
        return found ? found.noteCount : 0;
    };

    const getEditableNoteCount1 = (noteValue) => {

        const val = customNotes[noteValue];
        if (val === undefined || val === "" || isNaN(parseInt(val)) || parseInt(val) === 0) {
            return 0;
        }

        const count = parseInt(val);
        return count * noteValue;
    };

    const checkIfDataExists = async () => {
        try {
            const payload = {
                companyid: userdetail?.companyID || "",
                deptid: userdetail?.departmentID || ""
            };

            const headers = {
                "Content-Type": "application/json",
                Accept: "application/json",
            };

            const response = await axios.post(`${baseUrl.Url}/backend/api/GET_GateCashSummaryCashCount`, payload, { headers });

            if (response.status === 200 && response.data.length > 0) {
                const row = response.data[0];

                const formatted = [
                    { note: 2000, noteCount: row.cnT2000 || 0 },
                    { note: 500, noteCount: row.cnT500 || 0 },
                    { note: 200, noteCount: row.cnT200 || 0 },
                    { note: 100, noteCount: row.cnT100 || 0 },
                    { note: 50, noteCount: row.cnT50 || 0 },
                    { note: 20, noteCount: row.cnT20 || 0 },
                    { note: 10, noteCount: row.cnT10 || 0 },
                    { note: 1, noteCount: row.cntcoins || 0 },
                ];

                setDataExists(formatted);
            } else {
                setDataExists([]);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };


    useEffect(() => {
        checkIfDataExists();
    }, []);

    const handleDownload = () => {
        const input = document.getElementById("printableArea");

        html2canvas(input, { scale: 2 }).then((canvas) => {
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4");

            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
            pdf.save(`bill_${Billno || "receipt"}.pdf`);
        });
    };


    const getEditableRowDifference = () => {
        const editableTotal = [...cashValues, 1].reduce((sum, val) => sum + getEditableNoteCount1(val), 0);

        const remainingMsg = cashDetails[0]?.remainingAmountMSG || "";
        const match = remainingMsg.match(/Remaining cash:\s?\₹?([\d.]+)/);
        const remainingFromMsg = parseFloat(match ? match[1] : "0");

        const totalEntered = cashValues.reduce((sum, val) => sum + getNoteTotal(val), 0) + getNoteTotal(1);
        const expectedTotal = parseInt(totalCash) + parseInt(totalSeva);

        const originalDifference = (totalEntered + remainingFromMsg) - expectedTotal;

        const finalDifference = originalDifference - editableTotal;

        const sign = finalDifference > 0 ? "+" : finalDifference < 0 ? "-" : "";
        return `${sign}${Math.abs(finalDifference).toFixed(2)}`;
    };

    return (
        <>
            <div
                className="modal fade"
                id="AddCash"
                tabIndex="-1"
                aria-labelledby="exampleModalFullscreenLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-fullscreen">
                    <div className="modal-content">

                        <div className="modal-header border-0 custom-modal-header">
                            <div className="page-title d-flex align-items-center">
                                <h4 className="me-1">कॅश काऊंटर </h4>
                            </div>
                            <div className="col-12 col-md-auto">
                                <button
                                    type="button"
                                    className="btn btn-secondary w-100"
                                    onClick={showExitAlert}>

                                    मागे
                                </button>

                            </div>
                        </div>

                        <div className="modal-body mbgcolor">
                            <div className="content">
                                <form onSubmit={handleSubmit}>
                                    <div className="container-fluid mbgcolor">
                                        <div className="row mb-4 justify-content-center mbgcolor">
                                            {/* Token No Label + Input */}
                                            <div className="col-lg-5 col-md-6 col-sm-12 d-flex align-items-center">
                                                <label className="form-label me-2 mb-0 text-nowrap">
                                                    टोकन नंबर / शेतकऱ्याचे नाव / गाडी नंबर
                                                </label>
                                                <input
                                                    ref={SEARCHREF}
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Enter value"
                                                    value={searchInput}
                                                    onChange={(e) => { setSearchInput(e.target.value), handleSearch1(e.target.value) }}
                                                    onKeyDown={(e) => handleKeyDown1(e, inputRefs.current[0])}
                                                />
                                            </div>

                                            {/* Search Button */}
                                            <div className="col-lg-2 col-md-4 col-sm-12 mt-2 mt-md-0">
                                                <button
                                                    className="btn btn-primary w-600 text-center"
                                                    // onClick={handleSearch}
                                                    type="button"
                                                >
                                                    शोधा (Search)
                                                </button>
                                            </div>
                                        </div>
                                        <div className="mbgcolor">
                                            <div className="modal-body-table mbgcolor">
                                                {/* Billing Table */}
                                                <div style={{ maxHeight: '400px', overflowY: 'auto' }} mb-3>
                                                    <div className="table-responsive">
                                                        <div className="table-responsive mb-3" style={{ maxHeight: '400px', overflowY: 'auto' }}>

                                                            <table className="table table-bordered table-striped" style={{ width: '98%', tableLayout: 'fixed' }}>
                                                                <thead className="thead-dark text-white" style={{ position: 'sticky', top: 0, zIndex: 2 }}>
                                                                    <tr>
                                                                        <th style={{ width: '45px' }}>दि.</th>
                                                                        <th style={{ width: '25px' }}>टो.नं.</th>
                                                                        <th style={{ width: '65px' }}>शेतकरी</th>
                                                                        <th style={{ width: '35px' }}>बिल ₹</th>
                                                                        <th style={{ width: '35px' }}>हमाली</th>
                                                                        <th style={{ width: '36px' }}>बिल + हमाली</th>
                                                                        <th style={{ width: '35px' }}>Cash ₹</th>
                                                                        <th style={{ width: '35px' }}>चेक ₹</th>
                                                                        <th style={{ width: '35px' }}>ऑनलाईन ₹</th>
                                                                        <th style={{ width: '25px' }}>बिल बघा</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {tableData.length > 0 ? (
                                                                        <>
                                                                            {tableData.map((row, index) => (
                                                                                <tr key={index}>
                                                                                    <td className="text-nowrap">{row.date}</td>
                                                                                    <td className="text-nowrap">{row.btokanno}</td>
                                                                                    <td className="text-nowrap">{row.fname}</td>
                                                                                    <td className="text-nowrap">
                                                                                        ₹{row.remainingamount ? Math.round(Number(row.remainingamount)) : 0}
                                                                                    </td>

                                                                                    <td className="text-nowrap">₹{parseInt(row.sevaValue || 0).toFixed(2)}</td>
                                                                                    <td className="text-nowrap">{row.cashAmount1}</td>
                                                                                    {/* <td>
                                                                                        <input
                                                                                            type="text"
                                                                                            inputMode="numeric"
                                                                                            className="form-control"
                                                                                            name="cashAmount"
                                                                                            value={row.cashAmount1 || ''}
                                                                                        // onChange={(e) => handleInputChange(e, index, row)}
                                                                                        />
                                                                                    </td> */}
                                                                                    <td>
                                                                                        <input
                                                                                            ref={(el) => inputRefs.current[index] = el}
                                                                                            type="text"
                                                                                            className="form-control"
                                                                                            name="cashAmount"
                                                                                            value={row.cashAmount}
                                                                                            onChange={(e) => handleAmountChange(e, index, "cashAmount")}
                                                                                            // disabled={isFormDisabled}
                                                                                            disabled={row.isDisabled}
                                                                                            onKeyDown={(e) => {
                                                                                                const allowedKeys = [
                                                                                                    "Backspace", "Tab", "ArrowLeft", "ArrowRight", "Delete", "Home", "End"
                                                                                                ];
                                                                                                if (!/[0-9]/.test(e.key) && !allowedKeys.includes(e.key)) {
                                                                                                    e.preventDefault();
                                                                                                }
                                                                                                handleKeyDown(e, ChequeRefs);
                                                                                            }}
                                                                                            onPaste={(e) => {
                                                                                                const paste = e.clipboardData.getData('text');
                                                                                                if (!/^\d+$/.test(paste)) {
                                                                                                    e.preventDefault();
                                                                                                }
                                                                                            }}
                                                                                        />
                                                                                    </td>
                                                                                    <td>
                                                                                        <input
                                                                                            ref={ChequeRefs}
                                                                                            type="text"
                                                                                            className="form-control"
                                                                                            name="chequeAmount"
                                                                                            value={row.chequeAmount}
                                                                                            onChange={(e) => handleAmountChange(e, index, "chequeAmount")}
                                                                                            // disabled={isFormDisabled}
                                                                                            disabled={row.isDisabled}
                                                                                            onKeyDown={(e) => {
                                                                                                const allowedKeys = [
                                                                                                    "Backspace", "Tab", "ArrowLeft", "ArrowRight", "Delete", "Home", "End"
                                                                                                ];
                                                                                                if (!/[0-9]/.test(e.key) && !allowedKeys.includes(e.key)) {
                                                                                                    e.preventDefault();
                                                                                                }
                                                                                                handleKeyDown(e, OnlineRefs);
                                                                                            }}
                                                                                            onPaste={(e) => {
                                                                                                const paste = e.clipboardData.getData('text');
                                                                                                if (!/^\d+$/.test(paste)) {
                                                                                                    e.preventDefault();
                                                                                                }
                                                                                            }}
                                                                                        />
                                                                                    </td>
                                                                                    <td>
                                                                                        <input
                                                                                            ref={OnlineRefs}
                                                                                            type="text"
                                                                                            className="form-control"
                                                                                            name="onlineAmount"
                                                                                            value={row.onlineAmount}
                                                                                            onChange={(e) => handleAmountChange(e, index, "onlineAmount")}
                                                                                            // disabled={isFormDisabled}
                                                                                            disabled={row.isDisabled}
                                                                                            onPaste={(e) => {
                                                                                                const paste = e.clipboardData.getData('text');
                                                                                                if (!/^\d+$/.test(paste)) {
                                                                                                    e.preventDefault();
                                                                                                }
                                                                                            }}
                                                                                            onKeyDown={onKeyDown}
                                                                                        />
                                                                                    </td>

                                                                                    <td className="text-center">
                                                                                        <i
                                                                                            data-feather="eye"
                                                                                            className="feather-eye cursor-pointer"
                                                                                            onClick={async () => {
                                                                                                const isLoaded = await getBillDetails(row.baid);
                                                                                                if (isLoaded) {
                                                                                                    const myModal = new window.bootstrap.Modal(document.getElementById('print-receipt'), {
                                                                                                        backdrop: 'static',
                                                                                                        keyboard: false
                                                                                                    });
                                                                                                    myModal.show();
                                                                                                } else {
                                                                                                    alert("Data is not load.");
                                                                                                }
                                                                                            }}
                                                                                        ></i>
                                                                                    </td>
                                                                                </tr>
                                                                            ))}
                                                                        </>
                                                                    ) : (
                                                                        <tr>
                                                                            <td colSpan="10" className="text-center">No data found</td>
                                                                        </tr>
                                                                    )}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>

                                                </div>
                                                <div className="d-flex justify-content-end align-items-start flex-wrap gap-3 me-4">
                                                    <div className="card shadow-sm border-0" style={{ minWidth: '280px' }}>
                                                        <div className="card-body rounded d-flex justify-content-between align-items-center p-2"
                                                            style={{
                                                                backgroundColor: '#e3f2fd',  // Light Blue
                                                                border: '2px solid #2196f3', // Blue
                                                            }}>
                                                            <span className="fw-bold text-secondary" style={{ fontSize: '1rem' }}>
                                                                एकूण कॅश:
                                                            </span>
                                                            <span className="fw-bold text-primary" style={{ fontSize: '1rem' }}>
                                                                ₹{Math.round(parseFloat(totalCash) + parseFloat(totalSeva)).toFixed(2)}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="card shadow-sm border-0" style={{ minWidth: '280px' }}>
                                                        <div className="card-body rounded d-flex justify-content-between align-items-center p-2"
                                                            style={{
                                                                backgroundColor: '#f1f1f1',
                                                                border: '2px solid #90caf9',
                                                            }}>
                                                            <span className="fw-bold text-secondary" style={{ fontSize: '1rem' }}>
                                                                उर्वरित एकूण:
                                                            </span>
                                                            <span className="fw-bold text-danger" style={{ fontSize: '1rem' }}>
                                                                ₹{
                                                                    (
                                                                        (
                                                                            cashDetails.reduce((sum, note) => sum + (note.total || 0), 0) +
                                                                            parseInt((() => {
                                                                                const msg = cashDetails[0]?.remainingAmountMSG || "";
                                                                                const match = msg.match(/Remaining cash:\s?\₹?([\d.]+)/);
                                                                                return match ? match[1] : "0";
                                                                            })())
                                                                        )
                                                                        - (parseInt(totalCash) + parseInt(totalSeva))
                                                                    ).toFixed(2)
                                                                }
                                                            </span>

                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="modal-body-table" style={{ overflowX: 'auto', overflowY: 'hidden' }}>
                                                    <div
                                                        style={{
                                                            minWidth: '800px',
                                                            maxWidth: '100%',
                                                            overflowX: 'auto',
                                                            WebkitOverflowScrolling: 'touch',
                                                        }}
                                                    >
                                                        <table className="table table-bordered table-striped table-sm text-center"
                                                            style={{
                                                                borderCollapse: 'collapse',
                                                                border: '1px solid black',
                                                                width: '100%',
                                                                tableLayout: 'fixed'
                                                            }}>
                                                            <thead className="thead-dark bg-dark text-white">
                                                                <tr>
                                                                    <th>नोट</th>
                                                                    {cashValues.map((cash, idx) => (
                                                                        <th key={idx}>{cash}</th>
                                                                    ))}
                                                                    <th>नाणी</th>
                                                                    <th>एकूण रक्कम</th>
                                                                    <th>शिल्लक</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {/* Available Notes */}
                                                                <tr className="fw-bold align-middle" style={{ height: "50px", border: "2px solid #ff9800", }}>
                                                                    <td className="fw-bold bg-light align-middle" style={{ border: '2px solid #333' }}>उपलब्ध नोट्स</td>
                                                                    {["2000", "500", "200", "100", "50", "20", "10", "1"].map((note, idx) => (
                                                                        <td key={idx} style={{ fontWeight: "bold", backgroundColor: "#ffeb3b", border: "2px solid #ff9800", verticalAlign: "middle" }}>
                                                                            {getAvailableNoteCount(parseInt(note))}
                                                                        </td>
                                                                    ))}
                                                                    <td></td>
                                                                </tr>
                                                                {/* संख्या */}
                                                                <tr className="fw-bold align-middle" style={{ height: "50px", border: "2px solid #ff9800" }}>
                                                                    <td className="fw-bold bg-light align-middle" style={{ border: '2px solid #333' }}>संख्या</td>
                                                                    {cashValues.map((cash, idx) => (
                                                                        <td key={idx} style={{
                                                                            fontWeight: "bold",
                                                                            backgroundColor: "#ffeb3b",
                                                                            border: "2px solid #ff9800",
                                                                            verticalAlign: "middle"
                                                                        }}>
                                                                            {getNoteCount(cash)}
                                                                        </td>
                                                                    ))}
                                                                    {/* ₹1 note */}
                                                                    <td style={{
                                                                        fontWeight: "bold",
                                                                        backgroundColor: "#ffeb3b",
                                                                        border: "2px solid #ff9800",
                                                                        verticalAlign: "middle"
                                                                    }}>
                                                                        {getNoteCount(1)}
                                                                    </td>
                                                                    <td></td>
                                                                </tr>

                                                                <tr style={{ height: "50px" }}>
                                                                    <td className="fw-bold bg-light align-middle" style={{ border: '2px solid #333' }}>एकूण रक्कम</td>
                                                                    {cashValues.map((cash, idx) => (
                                                                        <td key={idx} className="align-middle">
                                                                            ₹{getNoteTotal(cash)}
                                                                        </td>
                                                                    ))}
                                                                    <td className="align-middle">₹{getNoteTotal(1)}</td>

                                                                    {/* एकूण टोटल */}
                                                                    <td>
                                                                        ₹{(
                                                                            cashValues.reduce((sum, val) => sum + getNoteTotal(val), 0) +
                                                                            getNoteTotal(1) +
                                                                            parseFloat(
                                                                                (() => {
                                                                                    const msg = cashDetails[0]?.remainingAmountMSG || "";
                                                                                    const match = msg.match(/Remaining cash:\s?\₹?([\d.]+)/);
                                                                                    return match ? match[1] : "0";
                                                                                })()
                                                                            )
                                                                        ).toFixed(2)}
                                                                    </td>

                                                                    {/* शिल्लक */}
                                                                    <td>
                                                                        ₹{
                                                                            (() => {
                                                                                const remainingMsg = cashDetails[0]?.remainingAmountMSG || "";
                                                                                const match = remainingMsg.match(/Remaining cash:\s?\₹?([\d.]+)/);
                                                                                const remainingFromMsg = parseFloat(match ? match[1] : "0");

                                                                                const totalEntered = cashValues.reduce((sum, val) => sum + getNoteTotal(val), 0) + getNoteTotal(1);
                                                                                const expectedTotal = parseInt(totalCash) + parseInt(totalSeva);
                                                                                const diff = (totalEntered + remainingFromMsg) - expectedTotal;

                                                                                const sign = diff > 0 ? "+" : "";
                                                                                return `${sign}${diff.toFixed(2)}`;
                                                                            })()
                                                                        }
                                                                    </td>
                                                                </tr>

                                                                {/* Editable Row */}
                                                                <tr style={{ height: "50px", border: "2px solid #2196f3" }}>
                                                                    <td className="fw-bold bg-light align-middle" style={{ border: "2px solid #2196f3" }}>बदल करण्यासाठी</td>
                                                                    {cashValues.map((cash, idx) => (
                                                                        <td key={idx}>
                                                                            <input
                                                                                ref={el => EditRefs.current[idx] = el}
                                                                                type="text"
                                                                                className="form-control text-center"
                                                                                value={customNotes[cash] || ""}
                                                                                onChange={(e) => handleCustomNoteChange(cash, e.target.value)}
                                                                                onKeyDown={(e) => {
                                                                                    if (e.key === "Enter") {
                                                                                        e.preventDefault();
                                                                                        if (EditRefs.current[idx + 1]) {
                                                                                            EditRefs.current[idx + 1].focus();
                                                                                        }
                                                                                    }
                                                                                }}
                                                                                // readOnly={isFormDisabled}
                                                                                readOnly={formData.isclose === 1 || formData.isclose === true}

                                                                            />
                                                                        </td>
                                                                    ))}

                                                                    <td style={{ border: "2px solid #2196f3", verticalAlign: "middle" }}>
                                                                        <input
                                                                            ref={el => EditRefs.current[cashValues.length] = el}
                                                                            type="text"
                                                                            className="form-control form-control-sm text-center"
                                                                            placeholder="0"
                                                                            style={{ backgroundColor: "#e3f2fd" }}
                                                                            name="note_1"
                                                                            value={customNotes[1] || ""}
                                                                            onChange={(e) => handleCustomNoteChange(1, e.target.value)}
                                                                            onFocus={(e) => {
                                                                                if (e.target.value === "0") {
                                                                                    e.target.value = "";
                                                                                }
                                                                            }}
                                                                            // readOnly={isFormDisabled}
                                                                            readOnly={formData.isclose === 1 || formData.isclose === true}

                                                                        />
                                                                    </td>
                                                                    {/* Column to show editable total only */}
                                                                    <td className="text-success fw-bold text-center align-middle">
                                                                        ₹{
                                                                            [...cashValues, 1].reduce((sum, val) => sum + getEditableNoteCount1(val), 0)
                                                                        }

                                                                    </td>
                                                                    {/* Editable शिल्लक */}
                                                                    <td>
                                                                        ₹{
                                                                            getEditableRowDifference()
                                                                        }
                                                                    </td>

                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                    {cashDetails?.length > 0 &&
                                                        cashDetails.every(item => item.noteCount === 0) &&
                                                        cashDetails[0]?.remainingAmountMSG?.trim() !== '' && (
                                                            <div className="d-flex justify-content-center my-3">
                                                                <div
                                                                    className="fw-bold text-center d-flex align-items-center justify-content-center"
                                                                    style={{
                                                                        backgroundColor: '#fff9c4',
                                                                        border: '1px solid #f0e68c',
                                                                        borderRadius: '8px',
                                                                        maxWidth: '700px',
                                                                        width: '100%',
                                                                        height: '60px',
                                                                        fontSize: '1.2rem',
                                                                        color: '#333',
                                                                    }}
                                                                >
                                                                    {cashDetails[0]?.remainingAmountMSG}
                                                                </div>
                                                            </div>
                                                        )}

                                                </div>
                                                <div className="col-lg-12 mt-2 d-flex justify-content-end">
                                                    <button
                                                        type="button"
                                                        className="btn btn-cancel me-2"
                                                        // data-bs-dismiss="modal"
                                                        aria-label="Close"
                                                        onClick={showExitAlert}
                                                    >
                                                        मागे
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="btn btn-submit"
                                                        onClick={handleSubmit}
                                                    >
                                                        सेव्ह
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div >
            </div >
            <div>

                <div
                    className="modal fade modal-default"
                    id="print-receipt"
                    aria-labelledby="print-receipt"
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content rounded-4 shadow border border-success" style={{ backgroundColor: "#f0f8ff" }}>

                            <div className="d-flex justify-content-end p-2">
                                <button
                                    type="button"
                                    className="close p-0"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                >
                                    <span aria-hidden="true">×</span>
                                </button>
                            </div>
                            <div className="modal-body" id="printableArea" style={{ backgroundColor: "#f0f8ff" }}>
                                <div className="icon-head text-center mb-3">
                                    <h3 className="text-center" style={{ color: 'orange' }}>
                                        {userdetail?.departmentname}
                                    </h3>

                                </div>
                                <div className="tax-invoice" style={{ backgroundColor: "#f0f8ff" }}>
                                    <h6 className="text-center text-success">शेतकरी बिल</h6>
                                    <div className="row mb-3">
                                        <div className="col-sm-12 col-md-6">
                                            <div className="invoice-user-name">
                                                <span className="fw-bold " style={{ fontWeight: 'bold' }}>शेतकरी: </span>
                                                <span style={{ fontWeight: 'bold' }}>{farmeName}</span>
                                            </div>
                                            <div className="invoice-user-name">
                                                <span className="fw-bold ">बिल क्र.: </span>
                                                <span style={{ fontWeight: 'bold' }}>{Billno}</span>
                                            </div>
                                        </div>
                                        <div className="col-sm-12 col-md-6">
                                            {Crop && (
                                                <div className="invoice-user-name">
                                                    <span className="fw-bold ">पीक: </span>
                                                    <span style={{ fontWeight: 'bold' }}>{Crop}</span>
                                                </div>
                                            )}
                                            <div className="invoice-user-name">
                                                <span className="fw-bold ">दिनांक: </span>
                                                <span style={{ fontWeight: 'bold' }}>{BillDate}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <table className="table-borderless w-100 table-fit">
                                    <thead style={{ backgroundColor: '#add8e6' }}>
                                        <tr>
                                            <th className="text-center">अ.क्र.</th>
                                            <th className="text-center">व्यापारी </th>
                                            <th className="text-center">वजन </th>
                                            <th className="text-center">भाव </th>
                                            <th className="text-end">रक्कम </th>

                                        </tr>``

                                    </thead>
                                    <tbody>
                                        {tabledata.length > 0 ? (
                                            tabledata.map((row, index) => (
                                                <tr key={index}>
                                                    <td className="text-center" style={{ color: '#333' }}><strong>{index + 1}</strong></td> {/* Darker text color */}
                                                    <td className="text-center" style={{ color: '#333' }}><strong>{row.vname}</strong></td>
                                                    {/* <td className="text-center">{row.croplabel}</td> */}
                                                    <td className="text-center" style={{ color: '#333' }}><strong>{row.weight}</strong></td>
                                                    <td className="text-center" style={{ color: '#333' }}><strong>{row.rate}</strong></td>
                                                    <td className="text-end" style={{ color: '#333' }}><strong>{row.amount}</strong></td>
                                                </tr>

                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="text-center">No Data Available</td>
                                            </tr>
                                        )}
                                        <tr>
                                            <td colSpan={6}>
                                                <table className="table-borderless w-100 table-fit">
                                                    <tbody>
                                                        <tr>
                                                            <td><strong>रोख रक्कम :</strong></td>
                                                            <td className="text-end"><strong>{cashamount}</strong></td>
                                                        </tr>
                                                        <tr>
                                                            <td><strong>चेक रक्कम :</strong></td>
                                                            <td className="text-end"><strong>{chequeamount}</strong></td>
                                                        </tr>
                                                        <tr>
                                                            <td><strong>ऑनलाइन रक्कम :</strong></td>
                                                            <td className="text-end"><strong>{onlineamount}</strong></td>
                                                        </tr>
                                                        <tr>
                                                            <td><strong>उप एकूण :</strong></td>
                                                            <td className="text-end"><strong>{totalAmount}</strong></td>
                                                        </tr>
                                                        <tr>
                                                            <td><strong>एकूण वजन :</strong></td>
                                                            <td className="text-end"><strong>{totalWeight}</strong></td>
                                                        </tr>

                                                        {Services
                                                            .filter(item => item.sevaValue && item.nSERVICETYPETITLE.trim())
                                                            .map((item, index) => (
                                                                <tr key={index}>
                                                                    <td className="" style={{ paddingTop: "8px" }}>
                                                                        {item.nSERVICETYPETITLE}:
                                                                    </td>
                                                                    <td className="text-end" style={{ paddingTop: "8px" }}>
                                                                        {item.sevaValue}
                                                                    </td>
                                                                </tr>
                                                            ))}

                                                        <tr>
                                                            <td><strong>एकूण खर्च :</strong></td>
                                                            <td className="text-end"><strong>{totalCost}</strong></td>
                                                        </tr>

                                                        <tr>
                                                            <td><strong>एकूण रक्कम  :</strong></td>
                                                            <td className="text-end"><strong>{remainingamount}</strong></td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>

                                    </tbody>


                                </table>

                                <div className="text-center invoice-bar mt-3">
                                    <Link to="#" className="btn btn-success"
                                        onClick={handleDownload}>
                                        Download
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* /Print Receipt */}

                {showModal && (
                    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <div className="modal-dialog modal-lg">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">रिकॉर्ड निवडा</h5>
                                    <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                                </div>
                                <div className="modal-body">
                                    <table className="table table-bordered">
                                        <thead>
                                            <tr>
                                                <th>Token No</th>
                                                <th>नाव</th>
                                                <th>गाडी क्र.</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {modalData.map((item, idx) => (
                                                <tr
                                                    key={idx}
                                                    style={{
                                                        backgroundColor: idx === selectedIndex ? '#f8f9fa' : '',
                                                        border: idx === selectedIndex ? "2px solid #ff9800" : '', // Blue border for selected row
                                                    }}
                                                >

                                                    <td>{item.btokanno}</td>
                                                    <td>{item.fname}</td>
                                                    <td>{item.vehicleno}</td>
                                                    <td>
                                                        <button
                                                            className="btn btn-primary btn-sm"
                                                            onClick={() => {
                                                                setFormData({
                                                                    fullname: item.fname || '',
                                                                    btokanno: item.btokanno || '',
                                                                    date: item.date ? formatDate(item.date) : '',
                                                                    vehicleno: item.vehicleno || '',
                                                                    billamount: item.remainingamount || '',
                                                                    amount: item.remainingamount || '',
                                                                    hamaali: item.sevaValue || '',
                                                                    status: item.status || '',
                                                                });
                                                                setTableData([item]);
                                                                setShowModal(false);
                                                            }}
                                                        >
                                                            निवडा
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                )}


            </div>

        </>

    );
};

export default AddCashCounter;
