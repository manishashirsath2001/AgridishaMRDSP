import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import { ChevronDown, ChevronUp, Info, ArrowLeft } from "feather-icons-react/build/IconComponents";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import axios from 'axios';
// import { ACSPLGUID } from "../../json/custom";
import { baseUrl, convertToISODate, ACSPLGUID, Accounts } from "../../core/json/custom";
import { getUserData } from "../../Context/UserData";
import { useLocation } from 'react-router-dom';
// import AddCash from "../Voucher/AddCash";
import Coldaddchash from "./Coldaddchash";
const ColdStorageOutword = ({ CAID }) => {

    const location = useLocation();
    const { csid } = location.state || {};
    const { userdetail } = getUserData();
    const [WeightType, setWeightType] = useState([]);
    const [Itemdata, setItem] = useState([]);
    const [Customerdata, setCustomerdata] = useState([]);
    const [EndDate, setEndDate] = useState('');
    const [StartDate, setStartDate] = useState('');

    const MySwal = withReactContent(Swal);
    useEffect(() => {
        getTodayDate();
    }, [CAID]);





    const getTodayDate = () => {
        const today = new Date();
        const formatted = today.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
        setEndDate(formatted);
        console.log('formattedformattedformattedformatted', formatted)
    };


    const [TableData, setTableData] = useState([]);
    const [txnmodeall, settxnmodeall] = useState([]);
    const [formData, setFormData] = useState([
        {
            ColdStoreID: "",
            Date: "",
            EndDate: "",
            LotNo: "",
            CustomerName: "",
            ThirdPartyName: "",
            GrossWeight: "",
            NetWeight: "",
            WeightUnit: "",
            WeightInkg: "",
            CaretWeight: "",
            Item: "",
            TypeofVariety: "",
            RackPosition: "",
            WeightInkg: "",
            Rate: "",
            Amount: "",
            TotalDays: "",
            OutWardStockWeight: "",
            RemainingStockWeight: "",
            txnmode: "",
            NAVEKHATE: "",
            CHEQUEDATE: "",
            CHEQUENO: "",

        }
    ]);


    const [Rate, setRate] = useState([]);

    const GUID = ACSPLGUID.getNew();
    const totalAmount = TableData.reduce((sum, row) => sum + (parseFloat(row.total) || 0), 0).toFixed(2);

    useEffect(() => {
        fetchData();
    }, [CAID]);


    const RefOutWardStockWeight = useRef(null);
    const Refvyavarmode = useRef(null)
    const NavekhateRef = useRef(null);
    const CheckdateRef = useRef(null);
    const CheckNoRef = useRef(null);
    const SaveRef = useRef(null);


    const handleKeyDown = (e, nextRef, isLastField = false) => {
        if (e.key === "Enter") {


            if (isLastField) {
                SaveRef.current?.focus(); // focus Save button
                showConfirmationAlert(e); // ✅ Show modal, do NOT call handleSave directly
            } else {
                nextRef?.current?.focus();
            }
        }
    };



    useEffect(() => {
        const modal = document.getElementById('add-units-category');
        const handleShown = () => {
            RefOutWardStockWeight.current?.focus();
        };

        if (modal) {
            modal.addEventListener('shown.bs.modal', handleShown);
        }

        return () => {
            if (modal) {
                modal.removeEventListener('shown.bs.modal', handleShown);
            }
        };
    }, []);



    // useEffect(() => {
    //     const handleShortcut = (e) => {

    //         if (e.ctrlKey && e.key === 'e' || e.ctrlKey && e.key === 'E') {
    //             e.preventDefault();
    //             navigate(route.StoreMaster);
    //         }
    //         if (e.ctrlKey && e.key === 's' || e.ctrlKey && e.key === 'S') {
    //             e.preventDefault();
    //             validateinput(e);

    //         }
    //     };

    //     window.addEventListener('keydown', handleShortcut);

    //     return () => {
    //         window.removeEventListener('keydown', handleShortcut);
    //     };
    // }, [navigate, formData]);
    const fetchData = async () => {
        try {
            const payload1 = {
                csid: CAID?.csid || "",
                keyword: "%",
                companyid: userdetail?.companyID || "",
                deptid: userdetail?.departmentID || "",
            };

            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            const response1 = await axios.post(
                `${baseUrl.Url}/backend/api/GET_ColdStorageInward`,
                payload1,
                { headers }
            );

            if (response1.status !== 200)
                throw new Error("Failed to fetch ColdStorageInward data");

            if (response1.data.length > 0) {
                const data = response1.data[0];

                setFormData({
                    ColdStoreID: data.coldstorageid,
                    Date: convertToISODate(data.date),
                    LotNo: data.lotno,
                    CustomerName: data.customername,
                    ThirdPartyName: data.thirdpartyname,
                    Item: data.item,
                    GrossWeight: data.grossweight,
                    NetWeight: data.netweight,
                    WeightUnit: data.weightunit,
                    WeightInkg: data.weightinkg,
                    CaretWeight: data.caretweight,
                    TypeofVariety: data.typeofvarity,
                    RackPosition: data.rackposition,
                    RemainingStockWeight: data.weightinkg
                });

                setStartDate(data.date);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };


    const handleSave = (e) => {
        e.preventDefault();


        if (!formData.OutWardStockWeight) {
            MySwal.fire({
                title: "योग्य माहिती भरा",
                text: "कृपया पुढे जाण्यापुर्वी OutWard Stock Weight माहिती भरा!",
                icon: "error",
                confirmButtonColor: "#ff0000",
                confirmButtonText: "ठीक आहे",
                allowEnterKey: false,
                didOpen: () => {
                    const enterHandler = (e) => {
                        if (e.key === "Enter") {
                            document.querySelector(".swal2-confirm")?.click();
                        }
                    };
                    window.addEventListener("keydown", enterHandler);

                    MySwal.getPopup().addEventListener("mouseup", () => {
                        window.removeEventListener("keydown", enterHandler);
                    });
                }
            });
            return;
        }

        if (!formData.txnmode) {
            MySwal.fire({
                title: "योग्य माहिती भरा",
                text: "कृपया पुढे जाण्यापुर्वी व्यवहार मोड माहिती भरा!",
                icon: "error",
                confirmButtonColor: "#ff0000",
                confirmButtonText: "ठीक आहे",
                allowEnterKey: false,
                didOpen: () => {
                    const enterHandler = (e) => {
                        if (e.key === "Enter") {
                            document.querySelector(".swal2-confirm")?.click();
                        }
                    };
                    window.addEventListener("keydown", enterHandler);

                    MySwal.getPopup().addEventListener("mouseup", () => {
                        window.removeEventListener("keydown", enterHandler);
                    });
                }
            });
            return;
        }

        if (formData.txnmode === "2") {
            if (!formData.CHEQUEDATE) {

                MySwal.fire({
                    title: "योग्य माहिती भरा",
                    text: "कृपया पुढे जाण्यापुर्वी चेक तारीक भरा!",
                    icon: "error",
                    confirmButtonColor: "#ff0000",
                    confirmButtonText: "ठीक आहे",
                    allowEnterKey: false,
                    didOpen: () => {
                        const enterHandler = (e) => {
                            if (e.key === "Enter") {
                                document.querySelector(".swal2-confirm")?.click();
                            }
                        };
                        window.addEventListener("keydown", enterHandler);

                        MySwal.getPopup().addEventListener("mouseup", () => {
                            window.removeEventListener("keydown", enterHandler);
                        });
                    }
                });
                return;
            }
        }
        if (formData.txnmode === "2") {
            if (!formData.CHEQUENO) {

                MySwal.fire({
                    title: "योग्य माहिती भरा",
                    text: "कृपया पुढे जाण्यापुर्वी चेक नंबर माहिती भरा!",
                    icon: "error",
                    confirmButtonColor: "#ff0000",
                    confirmButtonText: "ठीक आहे",
                    allowEnterKey: false,
                    didOpen: () => {
                        const enterHandler = (e) => {
                            if (e.key === "Enter") {
                                document.querySelector(".swal2-confirm")?.click();
                            }
                        };
                        window.addEventListener("keydown", enterHandler);

                        MySwal.getPopup().addEventListener("mouseup", () => {
                            window.removeEventListener("keydown", enterHandler);
                        });
                    }
                });
                return;
            }
        }

        if (formData.txnmode === "0") {
            if (!formData.NAVEKHATE) {

                MySwal.fire({
                    title: "योग्य माहिती भरा",
                    text: "कृपया पुढे जाण्यापुर्वी नावे खाते माहिती निवडा !",
                    icon: "error",
                    confirmButtonColor: "#ff0000",
                    confirmButtonText: "ठीक आहे",
                    allowEnterKey: false,
                    didOpen: () => {
                        const enterHandler = (e) => {
                            if (e.key === "Enter") {
                                document.querySelector(".swal2-confirm")?.click();
                            }
                        };
                        window.addEventListener("keydown", enterHandler);

                        MySwal.getPopup().addEventListener("mouseup", () => {
                            window.removeEventListener("keydown", enterHandler);
                        });
                    }
                });
                return;
            }
        }


        if (formData.txnmode === "1") {
            // Only show modal if it hasn't been handled yet

            const modal = document.getElementById("Cash");
            if (modal) {
                modal.classList.add("show");
                modal.style.display = "block";
                modal.setAttribute("aria-modal", "true");
                modal.setAttribute("role", "dialog");
                modal.removeAttribute("aria-hidden");

                if (!document.querySelector('.modal-backdrop')) {
                    const backdrop = document.createElement("div");
                    backdrop.className = "modal-backdrop fade show";
                    document.body.appendChild(backdrop);
                }

                document.body.classList.add("modal-open");
                document.body.style.overflow = "hidden";
                document.body.style.paddingRight = "0px";
            }

            // Set the modal as handled so it won't open again
            setIsCashModalHandled(true);

            // ✅ Automatically call handleSubmit here if you want data to save right after showing modal:

        } else {
            showConfirmationAlert(e);
        }

        console.log("Master part Submitted:", formData);
    };

    const [isCashModalHandled, setIsCashModalHandled] = useState(false);

    //confirmation Box for save
    // const showConfirmationAlert = (event) => {
    //     MySwal.fire({
    //         title: "Are you sure?",
    //         text: "Do you want to save this data?",
    //         showCancelButton: true,
    //         confirmButtonColor: "#00ff00",
    //         confirmButtonText: "SAVE",
    //         cancelButtonColor: "#092C4C",
    //         cancelButtonText: "CANCLE",
    //     })
    //         .then((result) => {
    //             if (result.isConfirmed) {
    //                 handleSubmit(event); // Proceed with form submission
    //             }
    //         });
    // };

    const showConfirmationAlert = (event) => {
        MySwal.fire({
            title: "Are you sure?",
            text: "Do you want to save this data?",
            showCancelButton: true,
            confirmButtonColor: "#00ff00",
            confirmButtonText: "SAVE",
            cancelButtonColor: "#092C4C",
            cancelButtonText: "CANCEL",
            allowEnterKey: false, // prevent default SweetAlert handling
            didOpen: () => {
                // Listen for Enter key manually
                const enterHandler = (e) => {
                    if (e.key === "Enter") {
                        document.querySelector(".swal2-confirm").click();
                    }
                };
                window.addEventListener("keydown", enterHandler);

                // Remove the listener when the alert closes
                MySwal.getPopup().addEventListener("mouseup", () => {
                    window.removeEventListener("keydown", enterHandler);
                });
            }
        }).then((result) => {
            if (result.isConfirmed) {
                handleSubmit(event); // Proceed with form submission
            }
        });
    };


    const handleSubmit = async (e) => {
        try {
            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            // ✅ 1. Save Outward Details
            const payload1 = TableData.map(row => ({
                csowid: ACSPLGUID.getNew(),
                csid: CAID?.csid,
                startdate: row.slabStartDate,
                enddate: row.slabEndDate,
                dayfrom: row.daysFrom,
                dayto: row.daysTo,
                rate: row.rate,
                weightinkg: row.weightinkg,
                dayinslab: row.daysInSlab,
                outwardweight: row.outwardkg,
                remainingweight: formData.RemainingStockWeight || 0,
                amount: totalAmount,
                totalamount: row.total,
                transactionmode: formData.txnmode || 0,
                navekhate: formData.NAVEKHATE || '',
                chequedate: formData.CHEQUEDATE || '',
                chequeno: formData.CHEQUENO || '',
                status: row.remainingweight === 0,
                companyid: userdetail?.companyID || "",
                deptid: userdetail?.departmentID || "",
                uaid: userdetail?.uaid || "",
            }));

            const response1 = await axios.post(
                `${baseUrl.Url}/backend/api/SP_AddUpdColdStorageOutward`,
                payload1,
                { headers }
            );

            if (response1.status !== 200) {
                throw new Error("Failed to save outward data.");
            }
            // const generatedCsowid = response1.data?.csowid || csowid;

            // ✅ 2. Save Inward Details
            const inwardPayload = {
                csid: CAID?.csid,
                coldstorageid: formData.ColdStoreID,
                lotno: formData.LotNo,
                date: formData.Date,
                customername: formData.CustomerName,
                thirdpartyname: formData.ThirdPartyName,
                item: formData.Item,
                grossweight: formData.GrossWeight,
                netweight: formData.NetWeight,
                weightunit: formData.WeightUnit,
                weightinkg: formData.RemainingStockWeight || 0,
                caretweight: formData.CaretWeight,
                typeofvarity: formData.TypeofVariety,
                rackposition: formData.RackPosition,
                status: formData.RemainingStockWeight === "00",
                companyid: userdetail?.companyID || "",
                deptid: userdetail?.departmentID || "",
                uaid: userdetail?.uaid || "",
            };

            const response2 = await axios.post(
                `${baseUrl.Url}/backend/api/SP_AddUpdColdStorageInward`,
                JSON.stringify(inwardPayload),
                { headers }
            );

            if (response2.status !== 200) {
                throw new Error("Failed to save inward data.");
            }


            let TRNTYPE = '';
            if (formData.txnmode == '0') {
                TRNTYPE = '2'
            }
            if (formData.txnmode == '1') {
                TRNTYPE = '0'
            }

            if (formData.txnmode == '2') {
                TRNTYPE = '1'
            }

            console.log(TRNTYPE, 'formData.txnmodeTRNTYPE')



            // ✅ 3. Save Transaction Voucher
            const voucherPayload = [{
                voucherAID: CAID?.csid,
                uaid: userdetail?.uaid || "",
                organizationID: userdetail?.companyID || "",
                divisionID: userdetail?.departmentID || "",
                voucherTID: "TR",
                voucherDate: userdetail.APPDT,
                yapariacc: Accounts.COLDACC,
                cashacc: Accounts.CASHACC,
                checkacc: Accounts.CHECKACC,
                onlineacc: formData.NAVEKHATE || '',
                voucherAmount: parseFloat(totalAmount) || 0,
                referenceTID: "",
                referenceKey: formData.CustomerName,
                narration: "cold storage",
                grpkey: CAID?.csid,
                oid: "60",
                trntype: TRNTYPE,
                vctype: "10"

            }];

            const response3 = await axios.post(
                `${baseUrl.Url}/backend/api/SP_TransectionVoucher`,
                JSON.stringify(voucherPayload),
                { headers }
            );
            console.log("response3response3", response3.data)

            // ✅ Show success and reset form
            MySwal.fire({
                icon: "success",
                title: "जतन झाले!",
                text: "माहिती यशस्वीरित्या सेव झाली.",
                confirmButtonText: "OK",
            }).then(() => {
                setFormData({
                    ColdStoreID: "",
                    Date: "",
                    LotNo: "",
                    CustomerName: "",
                    ThirdPartyName: "",
                    Item: "",
                    GrossWeight: "",
                    NetWeight: "",
                    WeightUnit: "",
                    WeightInkg: "",
                    CaretWeight: "",
                    TypeofVariety: "",
                    RackPosition: "",
                    RemainingStockWeight: "",
                    OutWardStockWeight: "",
                    CHEQUENO: "",
                    CHEQUEDATE: "",
                    txnmode: "",
                    NAVEKHATE: "",
                });

                setTableData([]);
                fetchData();

                const modalEl = document.getElementById("add-units-category");
                const modal = bootstrap.Modal.getInstance(modalEl);
                modal?.hide();
            });

        } catch (error) {
            console.error("Submission Error:", error);
            MySwal.fire({
                icon: "error",
                title: "त्रुटी",
                text: "माहिती जतन करताना काहीतरी चूक झाली.",
                confirmButtonText: "OK",
            });
        }
    };


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

                settxnmodeall(implicationsDropdown);
            } catch (error) {
                console.error("Error fetching implications transaction mode:", error);
            }
        };

        TRANSTYPE();
    }, []);


    useEffect(() => {
        const FetchItemdata = async () => {
            try {
                const response = await axios.get(
                    baseUrl.Url + "/backend/api/Implications/CROP_TYPE|",

                );

                if (response.status !== 200) throw new Error("Failed to fetch implications data");

                const data = response.data;
                const implicationsDropdown = data.map(({ iTitle, iValue }) => ({
                    label: iTitle,
                    value: iValue,
                }));

                setItem(implicationsDropdown);
            } catch (error) {
                console.error("Error fetching implications:", error);
            }
        };


        const WeightType = async () => {
            try {
                const response = await axios.get(
                    baseUrl.Url + "/backend/api/Implications/SOLID|",

                );

                if (response.status !== 200) throw new Error("Failed to fetch implications data");

                const data = response.data;
                const implicationsDropdown = data.map(({ iTitle, iValue }) => ({
                    label: iTitle,
                    value: iValue,
                }));

                setWeightType(implicationsDropdown);
            } catch (error) {
                console.error("Error fetching implications:", error);
            }
        };


        const fetchCustomerName = async () => {
            try {
                const payload = {
                    "ctaid": "%",
                    "companyid": "COMP123456789",
                    "deptid": "D001",
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
                        setCustomerdata(formofvendorData);
                    })

            } catch (error) {
                console.error("Error fetching Access Right Data:", error);
            }

        };


        WeightType();
        FetchItemdata();
        fetchCustomerName();

    }, []);



    const handleModalClose = (result) => {
        handleSubmit();
        console.log("Modal resultModal resultModal resultModal resultModal result:", result);

    };



    useEffect(() => {
        if (StartDate != '' && EndDate != '') {
            const FetchRate = async () => {
                try {

                    const payload1 = {
                        startDate: StartDate?.toString?.() || "",  // make sure it's a string
                        endDate: EndDate?.toString?.() || ""
                    };

                    const headers = {
                        "Content-Type": "application/json",
                        Accept: "*/*",
                    };

                    const response = await axios.post(
                        `${baseUrl.Url}/backend/api/GET_CountPrecooling`,
                        payload1,
                        { headers }
                    );
                    if (response.status !== 200) throw new Error("Failed to fetch farmer data");
                    setRate(response.data[0].rate
                    );
                    console.log("Rate", response.data[0])
                } catch (error) {
                    console.error("Error fetching FarmerReport data:", error);
                }
            };
            FetchRate();
        }
    }, [StartDate, EndDate]);

    useEffect(() => {
        const weight = parseFloat(formData.WeightInkg) || 0;
        const rate = parseFloat(Rate) || 0;

        const amount = (weight * rate).toFixed(2);

        setFormData((prev) => ({
            ...prev,
            Amount: amount
        }));
    }, [formData.WeightInkg, Rate]); // recalculate when either changes




    const [BankName, setBankName] = useState([]);
    useEffect(() => {
        const fetchBankName = async () => {
            try {
                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };

                const payload = {
                    companyid: "",
                    deptid: "",
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
        if (StartDate && EndDate) {
            const start = new Date(StartDate);
            const end = new Date(EndDate);

            const diffTime = end.getTime() - start.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            setFormData((prev) => ({
                ...prev,
                TotalDays: diffDays >= 0 ? diffDays : 0, // Prevent negative
            }));
        }
    }, [StartDate, EndDate]);

    const handleChange = async (e) => {
        const { name, value } = e.target;

        if (name === "OutWardStockWeight") {
            const net = parseFloat(formData.WeightInkg) || 0;
            const out = parseFloat(value) || 0;
            let remaining = net - out;
            if (remaining < 0) remaining = 0;

            // Prevent API call if WeightInkg < OutWardStockWeight
            if (out > net) {
                MySwal.fire({
                    text: 'Outward वजन हे एकूण वजनापेक्षा जास्त असू शकत नाही.',
                    icon: 'error',
                    confirmButtonColor: '#00ff00',
                    confirmButtonText: 'ठीक आहे',
                });
                return; // Do not continue
            }

            if (!value || value.trim() === "") {
                setFormData(prev => ({
                    ...prev,
                    OutWardStockWeight: "",
                    RemainingStockWeight: "",
                }));
                setTableData([]); // << this clears the table
                return;
            }


            const updatedFormData = {
                ...formData,
                OutWardStockWeight: value,
                RemainingStockWeight: remaining === 0 ? "00" : remaining.toFixed(2),
            };

            setFormData(updatedFormData);

            // Call API after validation passes
            await fetchDataTable(value);
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const fetchDataTable = async (outwardWeight) => {
        try {
            const payload1 = {
                startDate: StartDate?.toString?.() || "",
                endDate: EndDate?.toString?.() || "",
                csid: CAID?.csid || "",
                outwardkg: outwardWeight || "",
            };

            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            const response1 = await axios.post(
                `${baseUrl.Url}/backend/api/GET_PrecoolingSlab`,
                payload1,
                { headers }
            );

            if (response1.status !== 200)
                throw new Error("Failed to fetch vendor data");

            console.log("GET_PrecoolingSlabFailed", response1.data);

            if (response1.data.length > 0) {
                setTableData(response1.data);
                // setStartDate(response1.data[0].date);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    return (

        <>
            {/* Add Category */}
            <div className="modal fade" id="add-units-category">
                <div className="modal-dialog modal-dialog-centered modal-fullscreen">

                    <div className="modal-content">
                        <form
                            onSubmit={handleSave}
                        >
                            <div className="card mbgcolor">
                                <div className="card-body add-product mbgcolor">
                                    <div className="accordion-card-one accordion" id="accordionExample">
                                        <div className="accordion-item mbgcolor">
                                            <div className="accordion-header" id="headingOne">
                                                <div className="row">
                                                    <div className="addproduct-icon">
                                                        <h5>
                                                            <Info className="add-info" />
                                                            <span>Cold Storage outward</span>
                                                        </h5>
                                                        <div className="d-flex justify-content-end">
                                                            <button
                                                                type="button"
                                                                className="close p-0"
                                                                data-bs-dismiss="modal"
                                                                aria-label="Close"
                                                            >
                                                                <span aria-hidden="true">×</span>
                                                            </button>
                                                        </div>
                                                    </div>
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
                                                    <div className="col-lg-2 col-md-6 mb-3">
                                                        <label htmlFor="shopId" className="form-label ">Cold Storage Id </label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            placeholder="Auto Genrated"
                                                            name="ColdStoreID"
                                                            value={formData.ColdStoreID}
                                                            required
                                                            readOnly
                                                        />
                                                    </div>

                                                    <div className="col-lg-2 col-md-6 mb-3">
                                                        <label htmlFor="shopDate" className="form-label  required"> Lot No</label>
                                                        <input
                                                            // ref={LotRef}
                                                            type="text"
                                                            id="LotNo"
                                                            className="form-control"
                                                            placeholder="लॉट क्रमांक प्रविष्ट करा"
                                                            name="LotNo"
                                                            onChange={(e) =>
                                                                setFormData((prev) => ({ ...prev, LotNo: e.target.value }))
                                                            }
                                                            value={formData.LotNo}
                                                            // onKeyDown={(e) => handleKeyDown(e, CustomerRef)}
                                                            readOnly
                                                        />
                                                    </div>

                                                    <div className="col-lg-4 col-md-6 mb-3">
                                                        <label htmlFor="shopName" className="form-label  required">Customer Name </label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            name="CustomerName"
                                                            value={
                                                                Customerdata.find(option => option.value === formData.CustomerName)?.label || ''
                                                            }
                                                            readOnly
                                                        />



                                                    </div>
                                                    <div className="col-lg-4 col-md-6 mb-3">
                                                        <div className="mb-0 add-product form-label">
                                                            <div className="d-flex justify-content-between align-items-center">
                                                                <label htmlFor="shopLocation" className="form-label required">Third Party Name</label>
                                                                <Link
                                                                    to="#"
                                                                    data-bs-toggle="modal"
                                                                    data-bs-target="#add-units-category"
                                                                    className="ms-2"
                                                                >
                                                                </Link>
                                                            </div>

                                                            <div className="position-relative">
                                                                <input
                                                                    id="ThirdPartyName"
                                                                    type="text"
                                                                    className="form-control"
                                                                    placeholder=" तीसरा पक्ष नाव प्रविष्ट करा"
                                                                    name="ThirdPartyName"
                                                                    onChange={handleChange}
                                                                    value={formData.ThirdPartyName}
                                                                    readOnly
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>



                                                <div className="row">
                                                    <div className="col-lg-4 col-md-6 mb-3">
                                                        <label htmlFor="shopRent" className="form-label required">Item </label>

                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            name="Item"
                                                            value={
                                                                Itemdata.find(option => option.value === formData.Item)?.label || ''
                                                            }
                                                            readOnly
                                                        />


                                                    </div>

                                                    <div className="col-lg-3 col-md-6 mb-3">
                                                        <label htmlFor="shopCapacity" className="form-label required">Type of Variety</label>

                                                        <input
                                                            id="TypeofVariety"
                                                            type="text"
                                                            className="form-control"
                                                            placeholder="  प्रकार  प्रविष्ट करा"
                                                            name="TypeofVariety"
                                                            onChange={handleChange}
                                                            value={formData.TypeofVariety}
                                                            readOnly
                                                        />
                                                    </div>

                                                    <div className="col-lg-3 col-md-6 mb-3 ">
                                                        <label htmlFor="Status" className="form-label required">Rack Position</label>


                                                        <input
                                                            id="RackPosition"
                                                            type="text"
                                                            className="form-control"
                                                            placeholder="Rack Position नाव प्रविष्ट करा"
                                                            name="RackPosition"
                                                            onChange={handleChange}
                                                            value={formData.RackPosition}
                                                            readOnly
                                                        />

                                                    </div>
                                                    <div className="col-lg-2 col-md-6 mb-3">
                                                        <label htmlFor="Weight" className="form-label required">Weight unit</label>

                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            name="WeightUnit"
                                                            value={
                                                                WeightType.find(option => option.value === formData.WeightUnit)?.label || ''
                                                            }
                                                            readOnly

                                                        />

                                                    </div>
                                                </div>

                                                <div className="row">
                                                    <div className="col-lg-2 col-md-6 mb-3">
                                                        <label htmlFor="GrossWeight" className="form-label required">Gross Weight</label>
                                                        <input
                                                            id="GrossWeight"
                                                            type="number"
                                                            className="form-control"
                                                            placeholder="Gross प्रविष्ट करा"
                                                            name="GrossWeight"
                                                            onChange={handleChange}
                                                            value={formData.GrossWeight}
                                                            readOnly
                                                        />
                                                    </div>

                                                    <div className="col-lg-2 col-md-6 mb-3">
                                                        <label htmlFor="NetWeight" className="form-label required">Net Weight</label>
                                                        <input
                                                            id="NetWeight"
                                                            type="number"
                                                            className="form-control"
                                                            placeholder="Net प्रविष्ट करा"
                                                            name="NetWeight"
                                                            onChange={handleChange}
                                                            value={formData.NetWeight}
                                                            readOnly
                                                        />
                                                    </div>

                                                    <div className="col-lg-2 col-md-6 mb-3">
                                                        <label htmlFor="Weight" className="form-label required">Weight(kg)</label>

                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            name="WeightUnit"
                                                            value={
                                                                formData.WeightInkg
                                                            }
                                                            readOnly

                                                        />

                                                    </div>

                                                    <div className="col-lg-2 col-md-6 mb-3">
                                                        <label htmlFor="shopCapacity" className="form-label required">Caret Weight</label>
                                                        <input
                                                            // ref={CaretLottRef}
                                                            id="Caret"
                                                            type="text"
                                                            className="form-control"
                                                            placeholder="  कॅरेट प्रविष्ट करा"
                                                            name="Caret"
                                                            onChange={handleChange}
                                                            value={formData.CaretWeight}
                                                            // onKeyDown={(e) => handleKeyDown(e, RackPositionRef)}
                                                            readOnly
                                                        />
                                                    </div>
                                                    <div className="col-lg-2 col-md-6 mb-3">
                                                        <label htmlFor="OutWardStockWeight" className="form-label required">OutWard Stock Weight</label>
                                                        <input
                                                            ref={RefOutWardStockWeight}
                                                            id="OutWardStockWeight"
                                                            type="number"
                                                            className="form-control"
                                                            placeholder="  OutWard Stock प्रविष्ट करा"
                                                            name="OutWardStockWeight"
                                                            onChange={handleChange}
                                                            value={formData.OutWardStockWeight}
                                                            onKeyDown={(e) => handleKeyDown(e, Refvyavarmode)}
                                                            min={0}

                                                        />
                                                    </div>
                                                    <div className="col-lg-2 col-md-6 mb-3">
                                                        <label htmlFor="RemainingStockWeight" className="form-label required">Remaining  Stock Weight</label>
                                                        <input

                                                            id="RemainingStockWeight"
                                                            type="text"
                                                            className="form-control"
                                                            placeholder="  कॅरेट प्रविष्ट करा"
                                                            name="RemainingStockWeight"
                                                            onChange={handleChange}
                                                            value={formData.RemainingStockWeight}
                                                            readOnly
                                                        />

                                                    </div>
                                                </div>





                                                <div className="row">
                                                    <div className="col-lg-2 col-sm-6 col-12">
                                                        <div className="mb-0">
                                                            <label className="form-label required">व्यवहार मोड</label>
                                                            <Select
                                                                ref={Refvyavarmode}
                                                                placeholder="Select Counter"
                                                                classNamePrefix="react-select"
                                                                options={txnmodeall}
                                                                value={txnmodeall.find(option => option.value == formData.txnmode) || null}
                                                                autoFocus
                                                                openMenuOnFocus={true}
                                                                onChange={(selectedOption) => {
                                                                    const selectedValue = selectedOption ? selectedOption.value : '';

                                                                    setFormData(prevState => ({
                                                                        ...prevState,
                                                                        txnmode: selectedValue,
                                                                    }));

                                                                    // Delay focus slightly to ensure conditional rendering has occurred
                                                                    setTimeout(() => {
                                                                        if (selectedValue == "0") {
                                                                            NavekhateRef.current?.focus();
                                                                        } else if (selectedValue == "2") {
                                                                            CheckdateRef.current?.focus();
                                                                        } else if (selectedValue == "2") {
                                                                            CheckNoRef.current?.focus();
                                                                        }
                                                                        else {
                                                                            SaveRef.current?.focus();
                                                                        }
                                                                    }, 100);
                                                                }}
                                                                styles={{
                                                                    menu: (provided) => ({
                                                                        ...provided,
                                                                        zIndex: 9999,
                                                                        position: 'absolute',
                                                                    }),
                                                                }}

                                                                title="Please Select txnmode "
                                                            />
                                                        </div>
                                                    </div>



                                                    {formData.txnmode == 2 && (
                                                        <>
                                                            <div className="col-lg-2 col-sm-6 col-12">
                                                                <div className="mb-0">
                                                                    <label className="form-label required">चेक तारीक</label>
                                                                    <input
                                                                        ref={CheckdateRef}
                                                                        type="date"
                                                                        className="form-control"
                                                                        id="chequedate"
                                                                        name="CHEQUEDATE"  // ✅ Match formData key
                                                                        value={formData.CHEQUEDATE}
                                                                        onChange={handleChange}
                                                                        title="Please select Date."
                                                                        onKeyDown={(e) => handleKeyDown(e, CheckNoRef)}

                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="col-lg-2 col-sm-6 col-12">
                                                                <div className="mb-0">
                                                                    <label className="form-label required">चेक नंबर</label>


                                                                    <input
                                                                        ref={CheckNoRef}
                                                                        type="text"
                                                                        className="form-control"
                                                                        id="chequenumber"
                                                                        name="CHEQUENO" // ✅ Match formData key
                                                                        value={formData.CHEQUENO}
                                                                        onChange={handleChange}
                                                                        title="Only Digits. Field cannot be empty or just spaces."
                                                                        onKeyDown={(e) => handleKeyDown(e, SaveRef)}

                                                                    />

                                                                </div>
                                                            </div>
                                                        </>




                                                    )}
                                                    {formData.txnmode == 0 && (

                                                        <div className="col-md-5 mb-2">
                                                            <label className="form-label required">नावे खाते </label>
                                                            <Select
                                                                ref={NavekhateRef}
                                                                classNamePrefix="react-select"
                                                                options={BankName}
                                                                placeholder="निवडा"
                                                                name="Deposit1"
                                                                // openMenuOnFocus={true}
                                                                // ref={Deposit1Ref}
                                                                value={BankName.find(option => option.value === formData.NAVEKHATE) || null}
                                                                onChange={(selectedOption) => {
                                                                    // setSelectedRelid(selectedOption?.name || "")
                                                                    setFormData(prevState => ({
                                                                        ...prevState,
                                                                        NAVEKHATE: selectedOption ? selectedOption.value : '',
                                                                    }));
                                                                    if (SaveRef.current) {
                                                                        SaveRef.current.focus();
                                                                    }

                                                                }}
                                                                styles={{
                                                                    menu: (provided) => ({
                                                                        ...provided,
                                                                        zIndex: 9999,
                                                                        position: 'absolute',
                                                                    }),
                                                                }}
                                                            />
                                                        </div>
                                                    )}

                                                    <div className="col-lg-2 col-sm-6 col-12 ms-auto">
                                                        <div className="mb-0 p-2 border border-warning rounded bg-warning-subtle shadow-sm">
                                                            <label className="form-label required text-warning fw-bold">एकूण रकम</label>
                                                            <input
                                                                type="text"
                                                                className="form-control border-warning fw-bold text-end"
                                                                id="chequenumber"
                                                                name="chequenumber"
                                                                value={totalAmount}
                                                                onChange={handleChange}
                                                                title="Only Digits. Field cannot be empty or just spaces."
                                                                readOnly
                                                            />
                                                        </div>
                                                    </div>

                                                </div>



                                                <div className="border p-2 rounded shadow-sm mb-2  mt-3">
                                                    <div className="row ">
                                                        <div className="col-lg-12">
                                                            <div className="modal-body-table">
                                                                <div className="table-responsive">
                                                                    <div style={{ maxHeight: "325px", overflowY: "auto" }}> {/* Adjust height as needed */}

                                                                        <table className="table datanew table-bordered" style={{ tableLayout: "fixed", width: "100%" }}>
                                                                            <thead className="thead-dark" style={{ position: "sticky", top: 0, backgroundColor: "#343a40", color: "white", zIndex: 1000 }}>
                                                                                <tr>
                                                                                    <th className="text-center">Start Date</th>
                                                                                    <th className="text-center">End Date</th>
                                                                                    {/* <th className="text-center">Days From</th>
                                                                                        <th className="text-center">Days To</th> */}
                                                                                    <th className="text-center">Days In Slab</th>
                                                                                    <th className="text-center">Rate</th>
                                                                                    <th className="text-center">Total WeightIn(kg)</th>
                                                                                    <th className="text-center">Outward WeightIn(kg)</th>

                                                                                    <th className="text-center">Amount</th>
                                                                                </tr>
                                                                            </thead>

                                                                            <tbody>
                                                                                {TableData.length > 0 ? (
                                                                                    <>
                                                                                        {TableData.map((row, index) => (
                                                                                            <tr key={index}>
                                                                                                <td className="text-center">{row.slabStartDate}</td>
                                                                                                <td className="text-center">{row.slabEndDate}</td>
                                                                                                {/* <td className="text-center">{row.daysFrom}</td>
                                                                                                    <td className="text-center">{row.daysTo}</td> */}
                                                                                                <td className="text-center">{row.daysInSlab}</td>
                                                                                                <td className="text-center">{row.rate}</td>
                                                                                                <td className="text-center">{row.weightinkg}</td>
                                                                                                <td className="text-center">{row.outwardkg}</td>
                                                                                                <td className="text-center">{row.total}</td>
                                                                                            </tr>
                                                                                        ))}

                                                                                        {/* Total Row */}
                                                                                        <tr style={{ fontWeight: 'bold', backgroundColor: '#f2f2f2' }}>
                                                                                            <td colSpan="5"></td>
                                                                                            <td className="text-center">Total</td>
                                                                                            <td className="text-center">
                                                                                                {totalAmount}
                                                                                            </td>
                                                                                        </tr>
                                                                                    </>
                                                                                ) : (
                                                                                    <tr>
                                                                                        <td colSpan="7" className="text-center">No Data Available</td>
                                                                                    </tr>
                                                                                )}
                                                                            </tbody>

                                                                        </table>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="col-lg-12">
                                                    <div className="btn-addproduct mb-1 ">
                                                        <button type="button"
                                                            className="btn btn-cancel me-2"
                                                            data-bs-dismiss="modal"
                                                            aria-label="Close"
                                                        >
                                                            मागे
                                                        </button>
                                                        <button type="submit"
                                                            className="btn btn-submit"
                                                            ref={SaveRef}
                                                        >
                                                            जतन करा
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>


                                </div>
                            </div>
                        </form>
                    </div>
                </div >
                <Coldaddchash onClose={handleModalClose} totalAmount1={totalAmount} />
            </div >

        </>
    );
};

export default ColdStorageOutword;


