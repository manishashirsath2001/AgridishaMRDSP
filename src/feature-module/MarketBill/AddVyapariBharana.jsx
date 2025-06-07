import React, { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import Select from "react-select";
import "bootstrap/dist/css/bootstrap.min.css";
import {
    ArrowLeft,
    FilePlus
} from "feather-icons-react/build/IconComponents";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axios from 'axios';
import { all_routes } from "../../Router/all_routes"
import { ACSPLGUID, baseUrl, convertToISODate } from "../../core/json/custom";

import {
    PlusCircle,
    Trash2,
    Edit
} from "feather-icons-react/build/IconComponents";
import { getUserData } from "../../Context/UserData"
import AddCashVyaparibharana from "./AddCashVyaparibharana";
// import AddCash from "./AddCash";


const AddVyapariJama = ({ onRefresh }) => {



    const MySwal = withReactContent(Swal);
    const { userdetail } = getUserData();
    const navigate = useNavigate();
    const route = all_routes;
    const GUID = ACSPLGUID.getNew();

    const vyapariRef = useRef(null);
    const txnmodeRef = useRef(null);
    const bharlelirakkamRef = useRef(null);
    const descriptionRef = useRef(null);
    const chequedateRef = useRef(null);
    const chequenumberRef = useRef(null);
    const khateRef = useRef(null);



    const [tableData, setTableData] = useState([]);

    const [txnmodeall, settxnmodeall] = useState([]);
    const [vyapari, setvyapari] = useState([]);
    const [BankName, setBankName] = useState([]);
    const [vyapariDueData, setVyapariDueData] = useState([]);



    // const [cashmodel, setCashmodel] = useState(false);

    const [masterData, setMasterData] = useState({
        vyapari: "",
        txnmode: "",
        khate: "",
        chequedate: "",
        chequenumber: "",
        vyapariname: "",
        phonenumber: "",
        companyname: "",
        GSTnumber: "",
        ekunyenerakkam: "",
        bharlelirakkam: "",
        urvaritrakkam: "",
        description: "",

    });


    // const handleMasterInputChange = (e) => {
    //     const { name, value } = e.target;
    //     const trimmedValue = value.trim();

    //     if (name === "bharlelirakkam" || name === "ekunyenerakkam") {
    //         const total = parseFloat(String(masterData.ekunyenerakkam).trim()) || 0;
    //         const paid = name === "bharlelirakkam"
    //             ? parseFloat(trimmedValue) || 0
    //             : parseFloat(String(masterData.bharlelirakkam).trim()) || 0;

    //         // Show error if paid > total
    //         if (paid > total) {
    //             Swal.fire({
    //                 icon: 'error',
    //                 title: 'Error',
    //                 text: `भरलेली रक्कम (${paid}) ही  एकूण येणे रक्कम (${total}) पेक्षा मोठी नसावी .`,
    //                 confirmButtonText: 'OK',
    //             });
    //             return; // stop further processing
    //         }

    //         const remaining = Math.round(total - paid);

    //         if (name === "bharlelirakkam" && tableData.length > 0) {
    //             let remainingPaid = paid;

    //             // First, calculate yenebaki for each row
    //             let updatedTable = tableData.map(row => {
    //                 const bpamt = Number(row.bpamt || 0);
    //                 const vapasI_AMT = Number(row.vapasI_AMT || 0);
    //                 const yenebaki = bpamt - vapasI_AMT;
    //                 return {
    //                     ...row,
    //                     yenebaki,
    //                     bharnarakkam: 0 // reset
    //                 };
    //             });

    //             while (remainingPaid > 0) {
    //                 // Get rows still having due
    //                 const pendingRows = updatedTable.filter(r => r.bharnarakkam < r.yenebaki);

    //                 if (pendingRows.length === 0) break;

    //                 const splitAmount = Math.floor(remainingPaid / pendingRows.length);
    //                 if (splitAmount === 0) {
    //                     // Distribute 1 rupee at a time if amount left is less than rows
    //                     for (let i = 0; i < remainingPaid; i++) {
    //                         const row = pendingRows[i];
    //                         const rowIndex = updatedTable.findIndex(r => r === row);
    //                         if (row.bharnarakkam < row.yenebaki) {
    //                             updatedTable[rowIndex].bharnarakkam += 1;
    //                         }
    //                     }
    //                     remainingPaid = 0;
    //                 } else {
    //                     // Distribute splitAmount
    //                     for (let row of pendingRows) {
    //                         const rowIndex = updatedTable.findIndex(r => r === row);
    //                         const dueLeft = row.yenebaki - row.bharnarakkam;
    //                         const toPay = Math.min(splitAmount, dueLeft);

    //                         updatedTable[rowIndex].bharnarakkam += toPay;
    //                         remainingPaid -= toPay;
    //                     }
    //                 }
    //             }

    //             setTableData(updatedTable);
    //         }


    //         setMasterData(prevData => ({
    //             ...prevData,
    //             [name]: trimmedValue,
    //             urvaritrakkam: remaining
    //         }));
    //     } else {
    //         setMasterData(prevData => ({
    //             ...prevData,
    //             [name]: value
    //         }));
    //     }
    // };

    const handleMasterInputChange = (e) => {
        const { name, value } = e.target;

        // Temporary updated data
        const updatedData = {
            ...masterData,
            [name]: value
        };

        // Parse values safely
        // 👇 Instead of using ekunyenerakkam from masterData, calculate it directly from tableData
        const liveEkunyenerakkam = tableData.reduce((sum, row) => {
            const roundedTotal = Math.round(parseFloat(row.total) || 0);
            return sum + roundedTotal;
        }, 0);
        // const ekunyenerakkam = parseFloat(updatedData.ekunyenerakkam) || 0;
        const bharlelirakkam = parseFloat(updatedData.bharlelirakkam) || 0;

        // Step 3: Validation
        if (bharlelirakkam > liveEkunyenerakkam) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: `भरलेली रक्कम (${bharlelirakkam}) ही एकूण येणे रक्कम (${liveEkunyenerakkam}) पेक्षा मोठी नसावी.`,
                confirmButtonText: 'OK',
            });
            return;
        }

        // Calculate difference only if either of those fields changed
        if (name === "ekunyenerakkam" || name === "bharlelirakkam") {
            updatedData.urvaritrakkam = (liveEkunyenerakkam - bharlelirakkam);
        }

        // // 🔁 Clear manual overrides if bharlelirakkam was changed
        // if (name === "bharlelirakkam") {
        //     setCustomBharnaValues({}); // <<<< Clear user-modified values
        // }

        // Update state
        setMasterData(updatedData);

    };


    // Only For All Reguler Vyapari Dropdown
    useEffect(() => {
        const RegulerVaypariName = async () => {
            try {
                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };
                const payload = {
                    companyid: userdetail?.companyID ? userdetail.companyID : "",
                    deptid: userdetail?.departmentID ? userdetail.departmentID : "",
                };

                const response = await axios.post(
                    `${baseUrl.Url}/backend/api/GET_RegulerVaypariName`,
                    payload,
                    { headers }
                );
                if (response.status !== 200)
                    throw new Error("Failed to fetch GET_RegulerVaypariName data");

                const data = response.data;
                console.log("GET_RegulerVaypariName", data)
                const conuterData = data
                    .map(({ vname, vpaid }) => ({
                        label: vname,
                        value: vpaid
                    }));

                setvyapari(conuterData);
            } catch (error) {
                console.error("Error fetching GET_RegulerVaypariName:", error);
            }
        };
        RegulerVaypariName();
    }, []);

    // Only For bank dropdown 
    useEffect(() => {
        const fetchBankName = async () => {
            try {
                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };

                const payload = {
                    companyid: userdetail?.companyID ? userdetail.companyID : "",
                    deptid: userdetail?.departmentID ? userdetail.departmentID : "",
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

    // To fetch and Set VyaparijamaByVyapariDroDown
    const handleSelect = async (vshortname) => {
        if (vshortname) {
            try {
                const payload = {

                    companyid: userdetail?.companyID ? userdetail.companyID : "",
                    deptid: userdetail?.departmentID ? userdetail.departmentID : "",
                    vshortname: vshortname,
                };
                const headers = {
                    'Content-Type': 'application/json',
                    Accept: '*/*',
                };
                const response = await axios.post(
                    `${baseUrl.Url}/backend/api/GET_VyaparijamaByVyapariDroDown`,
                    payload,
                    { headers }
                );
                if (response.status !== 200) throw new Error("Failed to fetch data");
                const apiData = response.data[0];

                setMasterData((prev) => ({
                    ...prev,

                    "vpaid": apiData?.vpaid || "",
                    "vyapariname": apiData?.vname || "",
                    "phonenumber": apiData?.vmoblie || "",
                    "companyname": apiData?.vcompname || "",
                    "GSTnumber": apiData?.vgstin || "",


                }));
                // ✅ Trigger the next fetch using new vpaid
                await fetchVyapariBharnaData(apiData.vpaid);



                console.log("GET_VyaparijamaByVyapariDroDown  Data:", masterData);
            } catch (error) {
                console.error('Error fetching GET_VyaparijamaByVyapariDroDown data:', error);
            }
        }
    };

    // fetchVyapariBharnaData 
    const fetchVyapariBharnaData = async (vpaid,) => {
        try {
            const payload = {
                "vpaid": vpaid,
                // "TRNDATE": new Date().toISOString().split('T')[0],
                "TRNDATE": userdetail.APPDT,
            }

            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };
            const response = await axios.post(
                `${baseUrl.Url}/backend/api/GET_VyapariBharanaData`,

                payload,
                { headers }
            );
            if (response.status !== 200)
                throw new Error("Failed to fetch fetchVyapariBharnaData data");
            console.log("fetchVyapariBharnaData", response.data)
            setTableData(response.data);

        } catch (error) {
            console.error("Error fetching fetchVyapariBharnaData data:", error);
        }
    };


    // fetch Get_VyapariDueData Data 
    console.log(vyapariDueData, "vyapariDueData check here++++++++++++++++++");
    useEffect(() => {

        const fetchVyapariDueData = async () => {
            try {
                const payload = {
                    "vdaid": "%",
                };
                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };
                const response = await axios.post(
                    `${baseUrl.Url}/backend/api/GET_VYAPARIDUEDATA`,
                    payload,
                    { headers }
                );
                if (response.status !== 200)
                    throw new Error("Failed to fetch ");
                console.log("Get_VyapariDueData", response.data)
                setVyapariDueData(response.data);
            } catch (error) {
                console.error("Error fetching Get_VyapariDueData data:", error);
            }
        };
        fetchVyapariDueData();

    }, []);

    //to calculate the yenerakkam column TotalAmount  
    useEffect(() => {
        const totalAAMT = tableData.reduce((sum, row) => {
            const roundedTotal = Math.round(parseFloat(row.total) || 0);
            return sum + roundedTotal;
        }, 0);

        setMasterData((prev) => ({
            ...prev,
            ekunyenerakkam: totalAAMT
        }));
    }, [tableData]);


    // For TRANSTYPE txnmode 
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


    const handleSubmit = (e) => {
        e.preventDefault(e);

        // // For the एकूण येणे रक्कम Alway greater than  भरलेली रक्कम validation
        // const total = parseFloat(masterData.ekunyenerakkam || 0);
        // const paid = parseFloat(masterData.bharlelirakkam || 0);

        // if (paid > total) {
        //     Swal.fire({
        //         icon: 'error',
        //         title: 'Invalid Amount',
        //         html: `भरलेली रक्कम (<b>${paid}</b>) ही  एकूण येणे रक्कम पेक्षा मोठी नसावी  (<b>${total}</b>).`,
        //         confirmButtonText: 'OK',
        //     });
        //     return;
        // }

        // Compare selectedOption.value with 1
        if (masterData.txnmode === "1") {

            const modal = document.getElementById("Cash");
            if (modal) {
                modal.classList.add("show");
                modal.style.display = "block";
                modal.setAttribute("aria-modal", "true");
                modal.setAttribute("role", "dialog");
                modal.removeAttribute("aria-hidden");

                // Prevent duplicate backdrops
                if (!document.querySelector('.modal-backdrop')) {
                    const backdrop = document.createElement("div");
                    backdrop.className = "modal-backdrop fade show";
                    document.body.appendChild(backdrop);
                }
                document.body.classList.add("modal-open");
                document.body.style.overflow = "hidden";
                document.body.style.paddingRight = "0px";
            }

        }
        else {
            showConfirmationAlert(e);
        }
        console.log("Master part Submitted:", masterData);
    };

    //confirmation Box for save
    const showConfirmationAlert = (event) => {
        MySwal.fire({
            title: "Are you sure?",
            text: "Do you want to save this data?",
            showCancelButton: true,
            confirmButtonColor: "#00ff00",
            confirmButtonText: "SAVE",
            cancelButtonColor: "#092C4C",
            cancelButtonText: "CANCLE",
        })
            .then((result) => {
                if (result.isConfirmed) {
                    handlePayloadSubmition(event); // Proceed with form submission
                }
            });
    };


    // const handlePayloadSubmition = async () => {

    //     console.log("Master part Submitted from handlePayloadSubmition:", masterData);
    //     try {
    //         // Prepare payload for detail tableData
    //         const Payload1 = tableData.map((detail, index) => {


    //             let tempRemaining = Math.round(parseFloat(masterData.bharlelirakkam || 0));
    //             // Step 1: Calculate bharnarakkam (useAmount)
    //             let useAmount = 0;
    //             for (let i = 0; i <= index; i++) {
    //                 const rowTotal = Math.round(parseFloat(tableData[i].total || 0));
    //                 const amt = Math.min(tempRemaining, rowTotal);
    //                 if (i === index) {
    //                     useAmount = amt;
    //                 }
    //                 tempRemaining -= amt;
    //             }

    //             // Step 2: Calculate  अदा वापसी (covered)
    //             let remaining = Math.round(parseFloat(masterData.bharlelirakkam || 0)); // declared here
    //             let totalTillRow = 0;
    //             for (let i = 0; i <= index; i++) {
    //                 totalTillRow += Math.round(parseFloat(tableData[i].total || 0));
    //             }

    //             let covered = 0;
    //             if (remaining >= totalTillRow) {
    //                 covered = Math.round(detail.vapasI_AMT || 0);
    //             }

    //             const BPAMT = Math.round(Number((detail.vapasI_AMT + detail.total) - (useAmount + covered))) || 0;

    //             return {
    //                 vdaid: ACSPLGUID.getNew(),
    //                 trndt: userdetail.APPDT,
    //                 tamt: (useAmount + covered) || 0,
    //                 bpamt: Math.round(Number((detail.vapasI_AMT + detail.total) - (useAmount + covered))) || 0,
    //                 fduedt: detail.fduedt || "",
    //                 sduedt: detail.sduedt || "",
    //                 vpaid: detail.vpaid || "",
    //                 tid: detail.tid || "",
    //                 stid: detail.stid || "",
    //                 // trntid: (masterData.bharlelirakkam == detail.vapasI_AMT) ? "30" : "20",
    //                 trntid: BPAMT === 0 ? "30" : "20",
    //                 isclose: BPAMT === 0 ? true : false,
    //                 trnsr: "",
    //                 refkey: "",
    //                 uaid: userdetail?.uaid ? userdetail.uaid : "",
    //                 isdeleted: detail.IsDeleted === 1 || detail.IsDeleted === true ? true : false,
    //                 vreff: "",
    //                 reff: detail.vdaid || "",
    //                 vtype: "0",
    //                 vapasi: covered || 0,
    //                 trntype: masterData.txnmode,
    //                 grpid: detail?.grpid || ""
    //             }
    //         });

    //         console.log("Payload:", Payload1);
    //         const headers = {
    //             "Content-Type": "application/json",
    //             Accept: "*/*",
    //         };
    //         await axios({
    //             method: "POST",
    //             url: baseUrl.Url + "/backend/api/SP_AddUpdVyapariJama", // SP_AddUpdVyapariJama
    //             data: JSON.stringify(Payload1),
    //             headers: headers,
    //         }).then(async (response) => {
    //             if (response.status === 200) {
    //                 // Filter where bpamt === 0
    //                 const dueUpdatePayload = Payload1.filter(p => p.bpamt === 0)
    //                     .map(p => ({
    //                         grpid: p.grpid || ""
    //                     }));

    //                 if (dueUpdatePayload.length > 0) {
    //                     await axios({
    //                         method: "POST",
    //                         url: baseUrl.Url + "/backend/api/SP_UpdateVyapariDue",
    //                         data: JSON.stringify(dueUpdatePayload),
    //                         headers: headers,
    //                     });
    //                 }
    //                 Swal.fire({
    //                     icon: "success",
    //                     title: "Saved!",
    //                     text: "payload2 get  saved successfully.",
    //                     confirmButtonText: "OK",
    //                 })
    //             }
    //         })

    //         Swal.fire({
    //             icon: "success",
    //             title: "Saved!",
    //             text: "Data saved successfully.",
    //             confirmButtonText: "OK",
    //         }).then(() => {

    //             setMasterData({
    //                 ...masterData, // Keep existing token number if needed
    //                 vyapari: "",
    //                 txnmode: "",
    //                 khate: "",
    //                 chequedate: "",
    //                 chequenumber: "",
    //                 vyapariname: "",
    //                 phonenumber: "",
    //                 companyname: "",
    //                 GSTnumber: "",
    //                 ekunyenerakkam: "",
    //                 bharlelirakkam: "",
    //                 urvaritrakkam: "",
    //             });
    //             setTableData([]);
    //         });

    //     } catch (error) {
    //         console.error("Submission Error:", error);
    //         Swal.fire({
    //             icon: "error",
    //             title: "Error",
    //             text: "Failed to save data. Please try again.",
    //         });
    //     }
    // };
    const handlePayloadSubmition = async () => {

        console.log("Master part Submitted from handlePayloadSubmition:", masterData);
        try {
            const Payload1 = tableData.map((detail, index) => {
                let tempRemaining = Math.round(parseFloat(masterData.bharlelirakkam || 0));
                let useAmount = 0;
                for (let i = 0; i <= index; i++) {
                    const rowTotal = Math.round(parseFloat(tableData[i].total || 0));
                    const amt = Math.min(tempRemaining, rowTotal);
                    if (i === index) useAmount = amt;
                    tempRemaining -= amt;
                }

                let remaining = Math.round(parseFloat(masterData.bharlelirakkam || 0));
                let totalTillRow = 0;
                for (let i = 0; i <= index; i++) {
                    totalTillRow += Math.round(parseFloat(tableData[i].total || 0));
                }

                let covered = 0;
                if (remaining >= totalTillRow) {
                    covered = Math.round(detail.vapasI_AMT || 0);
                }

                const AMT = Math.round(detail.vapasI_AMT) + Math.round(detail.total)
                const AMT1 = Math.round(useAmount) + Math.round(covered)
                const BPAMT = Math.round(AMT - AMT1) || 0;

                return {
                    vdaid: ACSPLGUID.getNew(),
                    trndt: userdetail.APPDT,
                    tamt: (useAmount + covered) || 0,
                    bpamt: BPAMT,
                    fduedt: detail.fduedt || "",
                    sduedt: detail.sduedt || "",
                    vpaid: detail.vpaid || "",
                    tid: detail.tid || "",
                    stid: detail.stid || "",
                    trntid: BPAMT === 0 ? "30" : "20",
                    isclose: BPAMT === 0,
                    trnsr: "",
                    refkey: "",
                    uaid: userdetail?.uaid || "",
                    isdeleted: detail.IsDeleted === 1 || detail.IsDeleted === true,
                    vreff: "",
                    reff: detail.vdaid || "",
                    vtype: "0",
                    vapasi: covered || 0,
                    trntype: masterData.txnmode,
                    grpid: detail?.grpid || ""
                };
            });

            const dueUpdatePayload = Payload1.filter(p => p.bpamt === 0).map(p => ({
                vdaid: p.grpid || ""
            }));

            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            console.log(dueUpdatePayload, "dueUpdatePayload");
            console.log(Payload1, "Payload1");

            const res1 = await axios.post(baseUrl.Url + "/backend/api/SP_AddUpdVyapariJama", Payload1, { headers });

            let res2;
            if (dueUpdatePayload.length > 0) {
                res2 = await axios.post(baseUrl.Url + "/backend/api/SP_UpdateVyapariDue", dueUpdatePayload, { headers });
            }

            if (res1.status === 200 && (!res2 || res2.status === 200)) {
                Swal.fire({
                    icon: "success",
                    title: "Saved!",
                    text: "Data saved successfully.",
                    confirmButtonText: "OK",
                }).then(() => {
                    setMasterData({
                        ...masterData,
                        vyapari: "",
                        txnmode: "",
                        khate: "",
                        chequedate: "",
                        chequenumber: "",
                        vyapariname: "",
                        phonenumber: "",
                        companyname: "",
                        GSTnumber: "",
                        ekunyenerakkam: "",
                        bharlelirakkam: "",
                        urvaritrakkam: "",
                    });
                    setTableData([]);
                });
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
                setMasterData({
                    ...masterData,
                    vyapari: "",
                    txnmode: "",
                    vyapariname: "",
                    phonenumber: "",
                    companyname: "",
                    GSTnumber: "",
                    ekunyenerakkam: "",
                    bharlelirakkam: "",
                    urvaritrakkam: "",
                    description: "",
                    chequedate: "",
                    chequenumber: "",
                });


                const modal = document.getElementById("AddVyapariJama");
                if (modal) {
                    modal.classList.remove("show");
                    modal.style.display = "none";
                    modal.setAttribute("aria-hidden", "true");

                    const modalBackdrop = document.querySelector(".modal-backdrop");
                    if (modalBackdrop) {
                        modalBackdrop.remove();
                    }

                    modal.removeAttribute("aria-modal");
                    modal.removeAttribute("role");

                    document.body.classList.remove("modal-open");
                    document.body.style.overflow = "";
                    document.body.style.paddingRight = "";
                }

                if (onRefresh) {
                    onRefresh();
                }

            }
        });
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


    // validation by C+S 
    const validateinput = (e) => {

        if (!masterData.vyapari) {
            Swal.fire({
                icon: "error",
                title: "Validation Error",
                text: "please select vyapari .",
            }).then(() => {
                vyapariRef.current.focus();
            });
            return;
        }

        if (!masterData.txnmode) {
            Swal.fire({
                icon: "error",
                title: "Validation Error",
                text: "please select txnmode .",
            }).then(() => {
                txnmodeRef.current.focus();
            });
            return;
        }

        if (!masterData.bharlelirakkam || !/^\d+(\.\d{1,2})?$/.test(masterData.bharlelirakkam)) {
            Swal.fire({
                icon: "error",
                title: "Validation Error",
                text: "please enter bharlelirakkam .",
            }).then(() => {
                bharlelirakkamRef.current.focus();
            });
            return;
        }

        if (!masterData.description || !/^(?!\s*$).+/.test(masterData.description)) {
            Swal.fire({
                icon: "error",
                title: "Validation Error",
                text: "please enter description .",
            }).then(() => {
                descriptionRef.current.focus();
            });
            return;
        }
        console.log(masterData.txnmode, "transcation mode $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");

        if (Number(masterData.txnmode) === 2) {
            if (!masterData.chequedate) {
                Swal.fire({
                    icon: "error",
                    title: "Validation Error",
                    text: "please select chequedate",
                }).then(() => {
                    chequedateRef.current.focus();
                });
                return;
            }
            if (!masterData.chequenumber || !/^\d{6}$/.test(masterData.chequenumber)) {
                Swal.fire({
                    icon: "error",
                    title: "Validation Error",
                    text: "please enter Corect ChequeNumber .",
                }).then(() => {
                    chequenumberRef.current.focus();
                });
                return;
            }

        }

        if (Number(masterData.txnmode) === 0) {
            if (!masterData.khate) {
                Swal.fire({
                    icon: "error",
                    title: "Validation Error",
                    text: "please select khate",
                }).then(() => {
                    khateRef.current.focus();
                });
                return;
            }
            if (!masterData.chequenumber || !/^\d{6}$/.test(masterData.chequenumber)) {
                Swal.fire({
                    icon: "error",
                    title: "Validation Error",
                    text: "please enter Corect ChequeNumber .",
                }).then(() => {
                    chequenumberRef.current.focus();
                });
                return;
            }

        }


        handleSubmit(event);
    };

    // addcash model manage
    const handleModalClose = (result) => {
        handlePayloadSubmition();
        console.log("Modal resultModal resultModal resultModal resultModal result:", result);

    };


    /////////
    // // State
    // const [customBharnaValues, setCustomBharnaValues] = useState({});
    // const [touchedRows, setTouchedRows] = useState({});

    // // Auto-fill bharna only if user hasn't typed anything yet
    // useEffect(() => {
    //     if (
    //         tableData.length > 0 &&
    //         masterData.bharlelirakkam &&
    //         Object.keys(customBharnaValues).length === 0
    //     ) {
    //         let remaining = Math.round(parseFloat(masterData.bharlelirakkam));
    //         const autoValues = {};

    //         tableData.forEach((row, index) => {
    //             const rowTotal = Math.round(parseFloat(row.total || 0));
    //             const useAmount = Math.min(remaining, rowTotal);
    //             autoValues[index] = useAmount;
    //             remaining -= useAmount;
    //         });

    //         setCustomBharnaValues(autoValues);
    //     }
    // }, [tableData, masterData.bharlelirakkam]);

    // // when user enter slab amount from table inputs.
    // const handleBharnaChange = (index, value) => {
    //     const parsedValue = Math.round(parseFloat(value));

    //     // Step 1: Show swal if previous slabs aren't filled
    //     for (let i = 0; i < index; i++) {
    //         const prevRow = tableData[i];
    //         const prevTotal = Math.round(parseFloat(prevRow.total || 0));
    //         const prevValue = Math.round(parseFloat(customBharnaValues[i] || 0));

    //         if (isNaN(prevValue) || prevValue < Math.min(prevTotal, parseFloat(prevRow.yenebaki || prevTotal))) {
    //             Swal.fire({
    //                 icon: "warning",
    //                 title: "स्लॅब पूर्ण करा",
    //                 text: `कृपया वरील स्लॅब (${i + 1}) आधी भरा.`,
    //             });
    //             return;
    //         }
    //     }

    //     const updatedValues = { ...customBharnaValues };
    //     const updatedTouched = { ...touchedRows };

    //     // Step 2: If user clears the value
    //     if (value === "" || isNaN(parsedValue)) {
    //         delete updatedValues[index];
    //         delete updatedTouched[index];

    //         // Also reset all below untouched rows
    //         for (let i = index + 1; i < tableData.length; i++) {
    //             if (!touchedRows[i]) {
    //                 delete updatedValues[i];
    //             }
    //         }
    //     } else {

    //         const yenebaki = Math.round(parseFloat(tableData[index].total || 0));


    //         // Only show warning if user tries to enter amount more than  yenebaki
    //         if (parsedValue > yenebaki) {
    //             Swal.fire({
    //                 icon: "warning",
    //                 title: "अधिक रक्कम",
    //                 text: `भरलेली रक्कम स्लॅब मर्यादेपेक्षा जास्त आहे.`,
    //             });
    //             return;
    //         }

    //         // Step 3: User typed a valid number
    //         updatedValues[index] = value;
    //         updatedTouched[index] = true;
    //     }

    //     // Step 4: Recalculate totals
    //     const totalCustomBharna = Object.values(updatedValues).reduce((sum, val) => {
    //         const num = parseFloat(val);
    //         return sum + (isNaN(num) ? 0 : num);
    //     }, 0);

    //     const ekunyenerakkam = parseFloat(masterData.ekunyenerakkam) || 0;

    //     setCustomBharnaValues(updatedValues);
    //     setTouchedRows(updatedTouched);
    //     setMasterData((prev) => ({
    //         ...prev,
    //         bharlelirakkam: Math.round(totalCustomBharna * 100) / 100,
    //         urvaritrakkam: Math.round((ekunyenerakkam - totalCustomBharna) * 100) / 100,
    //     }));
    // };

    // when user edit Andaje vapsi
    const handleVapasiChange = (e, index) => {
        const updatedValue = Math.round(parseFloat(e.target.value)) || 0; // keep 2 decimal places
        const updatedData = [...tableData];
        updatedData[index].vapasI_AMT = updatedValue;

        const bpamt = Math.round(updatedData[index].bpamt || 0);
        updatedData[index].total = bpamt - updatedValue;

        setTableData(updatedData);
        handleMasterInputChange(e);
    };




    return (
        <div>
            {/* master inputs */}
            <div className="modal fade" id="AddVyapariJama">

                <div className="modal-dialog modal-dialog-centered modal-fullscreen">
                    <div className="modal-content">
                        <div className="page-wrapper-new p-0">
                            <div className="content">
                                <div className="modal-header border-0 custom-modal-header">
                                    <div className="page-title">
                                        <h4>व्यापारी जमा </h4>
                                    </div>
                                    <div className="page-btn">
                                        <Link className="btn btn-secondary"
                                            onClick={showExitAlert}
                                        >
                                            <ArrowLeft className="me-2" />
                                            मागे
                                        </Link>
                                    </div>
                                </div>

                                <div className="modal-body custom-modal-body" style={{
                                    overflow: "hidden",
                                }}>
                                    <form onSubmit={handleSubmit}>

                                        <div className="row">

                                            <div className="col-lg-6 col-sm-6 col-12">
                                                <div className="mb-0">
                                                    <label className='required'>व्यापारी</label>
                                                    <Select
                                                        placeholder="Select"
                                                        classNamePrefix="react-select"
                                                        options={vyapari}
                                                        value={vyapari.find(option => option.value === masterData.vyapari) || null}
                                                        openMenuOnFocus={true}
                                                        onChange={(selectedOption) => {
                                                            const selectedLabel = selectedOption ? selectedOption.label : '';

                                                            setMasterData(prevState => ({
                                                                ...prevState,
                                                                vyapari: selectedOption ? selectedOption.value : '',
                                                            }));
                                                            // Auto-trigger your API function with selected label
                                                            handleSelect(selectedLabel);

                                                        }}
                                                        styles={{
                                                            menu: (provided) => ({
                                                                ...provided,
                                                                zIndex: 9999,
                                                                position: 'absolute',
                                                            }),
                                                        }}
                                                        required
                                                        title="Please Select vyapari "
                                                        ref={vyapariRef}
                                                        autoFocus
                                                    />
                                                </div>
                                            </div>




                                            <div className="col-lg-2 col-sm-6 col-12">
                                                <div className="mb-0">
                                                    <label className='required'>व्यवहार मोड</label>
                                                    <Select

                                                        placeholder="Select"
                                                        classNamePrefix="react-select"
                                                        options={txnmodeall}
                                                        value={txnmodeall.find(option => option.value == masterData.txnmode) || null}
                                                        autoFocus
                                                        openMenuOnFocus={true}
                                                        onChange={(selectedOption) => {
                                                            setMasterData(prevState => ({
                                                                ...prevState,
                                                                txnmode: selectedOption ? selectedOption.value : '',
                                                            }));
                                                        }}
                                                        styles={{
                                                            menu: (provided) => ({
                                                                ...provided,
                                                                zIndex: 9999,
                                                                position: 'absolute',
                                                            }),
                                                        }}
                                                        required
                                                        title="Please Select txnmode "
                                                    />
                                                </div>
                                            </div>
                                            {/* Conditionally Rendered Fields: खाते  */}

                                            {/* {masterData.txnmode == 0 && ( */}
                                            {masterData.txnmode !== '' && masterData.txnmode == 0 && (
                                                <>
                                                    <div className="col-lg-3 col-sm-6 col-12">
                                                        <label className="form-label required">खाते </label>
                                                        <Select
                                                            placeholder="निवडा"
                                                            classNamePrefix="react-select"
                                                            options={BankName}

                                                            name="khate"
                                                            openMenuOnFocus={true}
                                                            value={BankName.find(option => option.value === masterData.khate) || null}
                                                            onChange={(selectedOption) => {

                                                                setMasterData(prevState => ({
                                                                    ...prevState,
                                                                    khate: selectedOption ? selectedOption.value : '',
                                                                }));
                                                            }}
                                                            ref={khateRef}
                                                            required
                                                            title="Please Select khate "
                                                        />
                                                    </div>

                                                </>
                                            )}

                                            {/* Conditionally Rendered Fields: चेक तारीक & चेक नंबर */}
                                            {masterData.txnmode == 2 && (
                                                <>
                                                    <div className="col-lg-2 col-sm-6 col-12">
                                                        <div className="mb-0">
                                                            <label className="form-label required">चेक तारीक</label>
                                                            <input
                                                                type="Date"
                                                                className="form-control"
                                                                id="chequedate"
                                                                name="chequedate"
                                                                value={masterData.chequedate}
                                                                onChange={handleMasterInputChange}
                                                                title="Please select Date."
                                                                required
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-2 col-sm-6 col-12">
                                                        <div className="mb-0">
                                                            <label className="form-label required">चेक नंबर</label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                id="chequenumber"
                                                                name="chequenumber"
                                                                value={masterData.chequenumber}
                                                                onChange={handleMasterInputChange}
                                                                pattern="^\d{6}$"
                                                                title="Only Digits. Field cannot be empty or just spaces."
                                                                required
                                                            />
                                                        </div>
                                                    </div>
                                                </>
                                            )}


                                        </div>

                                        <div className="row">
                                            <div className="col-lg-3 col-sm-6 col-12">
                                                <div className="mb-0">
                                                    <label className="form-label required">व्यापारी नाव</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="vyapariname"
                                                        name="vyapariname"

                                                        value={masterData.vyapariname}
                                                        onChange={handleMasterInputChange}
                                                        readOnly
                                                    // required
                                                    // ref={vyaparinameRef}
                                                    // onKeyDown={(e) => handleKeyDown(e, descriptionRef)}
                                                    />
                                                </div>
                                            </div>



                                            <div className="col-lg-3 col-sm-6 col-12">
                                                <div className="mb-0">
                                                    <label className="form-label required">फोन नंबर </label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="phonenumber"
                                                        name="phonenumber"
                                                        value={masterData.phonenumber}
                                                        onChange={handleMasterInputChange}
                                                        readOnly
                                                    // required
                                                    // ref={phonenumberRef}
                                                    // onKeyDown={(e) => handleKeyDown(e, descriptionRef)}
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-lg-3 col-sm-6 col-12">
                                                <div className="mb-0">
                                                    <label className="form-label required">कंपनी नाव</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="companyname"
                                                        name="companyname"
                                                        value={masterData.companyname}
                                                        onChange={handleMasterInputChange}
                                                        readOnly
                                                    // required
                                                    // ref={companynameRef}
                                                    // onKeyDown={(e) => handleKeyDown(e, descriptionRef)}
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-lg-3 col-sm-6 col-12">
                                                <div className="mb-0">
                                                    <label className="form-label required">GSTN क्रमांक </label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="GSTnumber"
                                                        name="GSTnumber"
                                                        value={masterData.GSTnumber}
                                                        onChange={handleMasterInputChange}
                                                        readOnly
                                                    // required
                                                    // ref={GSTnumberRef}
                                                    // onKeyDown={(e) => handleKeyDown(e, descriptionRef)}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-lg-4 col-sm-6 col-12">
                                                <div className="mb-0">
                                                    <label className="form-label required">एकूण येणे रक्कम</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="ekunyenerakkam"
                                                        name="ekunyenerakkam"
                                                        value={masterData.ekunyenerakkam}
                                                        onChange={handleMasterInputChange}
                                                        readOnly
                                                    // required
                                                    // ref={ekunyenerakkamRef}
                                                    // onKeyDown={(e) => handleKeyDown(e, descriptionRef)}
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-lg-4 col-sm-6 col-12">
                                                <div className="mb-0">
                                                    <label className="form-label required">भरलेली रक्कम </label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="bharlelirakkam"
                                                        name="bharlelirakkam"
                                                        value={masterData.bharlelirakkam}
                                                        onChange={handleMasterInputChange}
                                                        required
                                                        pattern="^\d+(\.\d{1,2})?$"
                                                        title="Only Digits are allowed. Field cannot be empty or just spaces."

                                                    // ref={bharlelirakkamRef}
                                                    // onKeyDown={(e) => handleKeyDown(e, descriptionRef)}
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-lg-4 col-sm-6 col-12">
                                                <div className="mb-0">
                                                    <label className="form-label required">उर्वरित रक्कम </label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="urvaritrakkam"
                                                        name="urvaritrakkam"
                                                        value={masterData.urvaritrakkam}
                                                        onChange={handleMasterInputChange}
                                                        readOnly
                                                        required
                                                    // ref={urvaritrakkamRef}
                                                    // onKeyDown={(e) => handleKeyDown(e, descriptionRef)}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-lg-12 col-sm-6 col-12">
                                                <div className="mb-0">
                                                    <label className="form-label required">संदर्भ </label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="description"
                                                        name="description"
                                                        value={masterData.description}
                                                        onChange={handleMasterInputChange}
                                                        pattern="^(?!\s*$).+"
                                                        title="Only letters and spaces are allowed. Field cannot be empty or just spaces."
                                                        required
                                                    // ref={descriptionRef}
                                                    // onKeyDown={(e) => handleKeyDown(e, descriptionRef)}
                                                    />
                                                </div>
                                            </div>

                                        </div>




                                        {/* start (Detail) */}
                                        <div className="border p-3 rounded shadow-sm mb-4 mt-3">


                                            <div className="row ">
                                                <div className="col-lg-12">
                                                    <div className="modal-body-table">
                                                        <div className="table-responsive">
                                                            <div > {/* Adjust height as needed */}

                                                                <table className="table datanew table-bordered" style={{ tableLayout: "fixed", width: "100%" }}>
                                                                    <thead className="thead-dark" style={{ position: "sticky", top: 0, backgroundColor: "#343a40", color: "white", zIndex: 1000 }}>
                                                                        <tr>
                                                                            <th className="text-center">तारीक</th>
                                                                            <th className="text-center">बिल रक्कम </th>
                                                                            <th className="text-center">अंदाजे वापसी</th>
                                                                            <th className="text-center">येणे बाकी</th>
                                                                            <th className="text-center">भरणा रक्कम</th>
                                                                            <th className="text-center">अदा वापसी</th>
                                                                            <th className="text-center">शिल्लक</th>
                                                                        </tr>

                                                                    </thead>
                                                                    <tbody>
                                                                        {tableData.length > 0 ? (
                                                                            tableData.map((row, index) => {


                                                                                return (
                                                                                    <tr key={index}>
                                                                                        <td className="text-center">{row.slaB_RANGE}</td>
                                                                                        <td className="text-center">{Math.round(row.bpamt)}</td>
                                                                                        <td className="text-center">
                                                                                            {/* {Math.round(row.vapasI_AMT)} */}
                                                                                            <input
                                                                                                type="text"
                                                                                                className="form-control text-center"
                                                                                                value={Math.round(row.vapasI_AMT) || 0}
                                                                                                onChange={(e) => handleVapasiChange(e, index)}
                                                                                            />
                                                                                        </td>

                                                                                        <td className="text-center">{Math.round(row.total)}</td>
                                                                                        <td className="text-center">
                                                                                            <>
                                                                                                {(() => {
                                                                                                    let remaining = Math.round(parseFloat(masterData.bharlelirakkam || 0));
                                                                                                    for (let i = 0; i <= index; i++) {
                                                                                                        const rowTotal = Math.round(parseFloat(tableData[i].total || 0));
                                                                                                        const useAmount = Math.min(remaining, rowTotal);
                                                                                                        if (i === index) return useAmount;
                                                                                                        remaining -= useAmount;
                                                                                                    }
                                                                                                    return 0;
                                                                                                })()}

                                                                                            </>
                                                                                        </td>
                                                                                        <td className="text-center">
                                                                                            {(() => {
                                                                                                let remaining = Math.round(parseFloat(masterData.bharlelirakkam || 0));
                                                                                                let totalTillRow = 0;
                                                                                                let covered = false;

                                                                                                for (let i = 0; i <= index; i++) {
                                                                                                    const rowTotal = Math.round(parseFloat(tableData[i].total || 0));
                                                                                                    totalTillRow += rowTotal;
                                                                                                }

                                                                                                // If total amount paid so far is >= total till current row
                                                                                                if (remaining >= totalTillRow) {
                                                                                                    covered = true;
                                                                                                }

                                                                                                return covered ? Math.round(row.vapasI_AMT || 0) : 0;
                                                                                            })()}
                                                                                        </td>
                                                                                        <td className="text-center">
                                                                                            {(() => {
                                                                                                let remaining = Math.round(parseFloat(masterData.bharlelirakkam || 0));
                                                                                                let useAmount = 0;

                                                                                                // Calculate useAmount up to this row
                                                                                                for (let i = 0; i <= index; i++) {
                                                                                                    const rowTotal = Math.round(parseFloat(tableData[i].total || 0));
                                                                                                    const currentUse = Math.min(remaining, rowTotal);
                                                                                                    if (i === index) useAmount = currentUse;
                                                                                                    remaining -= currentUse;
                                                                                                }

                                                                                                // Calculate covered
                                                                                                let covered = 0;
                                                                                                let totalTillRow = 0;
                                                                                                for (let i = 0; i <= index; i++) {
                                                                                                    totalTillRow += Math.round(parseFloat(tableData[i].total || 0));
                                                                                                }
                                                                                                if (Math.round(parseFloat(masterData.bharlelirakkam || 0)) >= totalTillRow) {
                                                                                                    covered = Math.round(parseFloat(row.vapasI_AMT || 0));
                                                                                                }

                                                                                                const vapasI_AMT = Math.round(parseFloat(row.vapasI_AMT || 0));
                                                                                                const total = Math.round(parseFloat(row.total || 0));

                                                                                                const shillak = (vapasI_AMT + total) - (useAmount + covered);
                                                                                                return shillak;
                                                                                            })()}
                                                                                        </td>

                                                                                    </tr>
                                                                                );
                                                                            })
                                                                        ) : (
                                                                            <tr>
                                                                                <td colSpan="6" className="text-center">No Data Available</td>
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
                                        {/* end (Detail) */}

                                        {/* sum imputs of(Master) */}





                                        <div className="col-lg-12 d-flex justify-content-end mt-2">

                                            <Link className="btn btn-secondary me-2"
                                                onClick={showExitAlert}
                                            >
                                                मागे
                                            </Link>

                                            <button
                                                // ref={saveRef}
                                                type="submit"
                                                className="btn btn-submit"
                                            // onClick={handleSubmit}  // Trigger form submit handler

                                            >
                                                सेव्ह
                                            </button>
                                        </div>



                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >

            <AddCashVyaparibharana onClose={handleModalClose}
                BHARALELIRAKKAM={masterData.bharlelirakkam} />
        </div >

    );
};

export default AddVyapariJama;





