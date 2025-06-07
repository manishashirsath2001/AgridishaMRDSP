import { useNavigate } from 'react-router-dom';
import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { useLocation } from 'react-router-dom';
import { ArrowLeft, Trash2, Edit } from "feather-icons-react/build/IconComponents";
import axios from "axios";
import { ACSPLGUID, baseUrl, convertToISODate } from "../../core/json/custom";
import { getUserData } from '../../Context/UserData';
import { convertToCustomDate, formatDate, formatToDateTimeLocal } from '../../core/json/custom';
import { all_routes } from '../../Router/all_routes';


function AddAuction({ apkid, iscompleted, onRefresh }) {
    console.log(iscompleted, "iscompleted")
    console.log(apkid, "apkid")

    const { userdetail } = getUserData();
    const route = all_routes;
    const GUID = ACSPLGUID.getNew();
    const MySwal = withReactContent(Swal);
    const TOKENRef = useRef(null);
    const BillRef = useRef(null);
    const FARMERNAMERef = useRef(null);
    const VILLAGERef = useRef(null);
    const DATERef = useRef(null);
    const VyaparinameRef = useRef(null);
    const jaliRef = useRef(null);
    const weightkamiRef = useRef(null);
    const weightjastRef = useRef(null);
    const weightRef = useRef(null);
    const rateRef = useRef(null);
    const navigate = useNavigate();
    const [payloadType, setPayloadType] = useState('payload1');
    const [tokenTimeout, setTokenTimeout] = useState(null);
    const [JALI, setJALI] = useState(null);
    console.log("userdetail.APPDT", formatToDateTimeLocal(userdetail.APPDT))
    const [ISCOMPLETED_, setISCOMPLITED] = useState(iscompleted || "");


    //For Mastertable
    const [formData, setFormData] = useState({
        baid: '',
        apkid: '',
        dpkid: '',
        TOKEN: '',
        BILLNO: '',
        DATE: formatToDateTimeLocal(userdetail.APPDT),
        MAID: '',
        FARMERNAME: '',
        VILLAGE: '',
        SEVA: '',
        HAMALI: '',
        TOLAI: '',
        LEVHI: '',
        TOTALJALII: '',
        TOTALWEIGHT: '',
        TOTALAMOUNT: '',
        TOTALKHARCH: '',
        BAKI: '',
        vayapriBAKI: 0,
        ISCOMPLETED: 0
    });


    useEffect(() => {
        if (userdetail.APPDT) {
            setFormData((prev) => ({
                ...prev,
                DATE: formatToDateTimeLocal(userdetail.APPDT),
            }));
        }
    }, [userdetail.APPDT]);



    //For DetailTable
    const [rows, setRows] = useState([]);
    const [detailData, setDetailData] = useState({
        dpkid: '',
        apkid: '',
        vyapariName: '',
        carrot: '0',
        weight: '0',
        rate: '0',
        finalweight: '',
        jast: '',
        kami: 'kami',
        isdeleted: 0,
        croP_TYPE: '',
        vbkid: '',
    });



    //save input for vayparibilltable
    const [formdatavyapri, setformdatavyapri] = useState({
        MAID: '',
        vyapariName: '',
    });



    const prevTokenRef = useRef("");
    // useEffect(() => {
    //     if (formData.TOKEN) {
    //         prevTokenRef.current = formData.TOKEN;
    //     }
    // }, [formData.TOKEN]);

    const isFormInitialized = useRef(false);
    useEffect(() => {
        if (formData.TOKEN && !isFormInitialized.current) {
            prevTokenRef.current = formData.TOKEN;
            isFormInitialized.current = true; // form initialized once
        }
    }, [formData.TOKEN]);




    //Edit code for master and Detail

    useEffect(() => {
        if (!apkid) return;
        const fetchMasterData = async () => {
            try {
                const payload1 = {
                    apkid: apkid,
                    keyword: '%',
                    companyid: userdetail?.companyID ? userdetail.companyID : "",
                    deptid: userdetail?.departmentID ? userdetail.departmentID : "",
                    date: userdetail.APPDT,
                    uaid: userdetail?.uaid || "",
                    userid: "",
                };

                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*"
                };

                const response = await axios.post(
                    baseUrl.Url + "/backend/api/GET_AUCTIONSHED",
                    payload1,
                    { headers }
                );

                if (response.status !== 200) throw new Error("Failed to fetch data");
                let apiData = response.data[0];


                setFormData((prev) => ({
                    ...prev,
                    TOKEN: apiData.token,
                    BILLNO: apiData.billno,
                    DATE: formatDate(apiData.date),
                    MAID: apiData.maid,
                    VILLAGE: apiData.village,
                    SEVA: apiData.seva,
                    TOTALJALII: apiData.totaljali,
                    TOTALWEIGHT: apiData.totalweight,
                    TOTALAMOUNT: apiData.totalamount,
                    BAKI: apiData.baki,
                    ISCOMPLETED: apiData.iscompleted,
                    apkid: apiData.apkid

                }));

                console.log("Sale Bill Master Data:", apiData, formatDate(apiData.date));
            } catch (error) {
                console.error("Error in Master API Call:", error);
            }
        };


        const fetchDetailsData = async () => {
            try {
                const payload = {
                    apkid: apkid,
                    companyid: userdetail?.companyID ? userdetail.companyID : "",
                    deptid: userdetail?.departmentID ? userdetail.departmentID : "",
                };

                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*"
                };

                const response = await axios.post(
                    baseUrl.Url + "/backend/api/GET_AuctionDetailsById",
                    payload,
                    { headers }
                );

                if (response.status !== 200) throw new Error("Failed to fetch details data");

                console.log("Quotation Detail Data:", response.data);

                if (response.data.length > 0) {
                    const mappedProducts = response.data.map((item) => ({
                        dpkid: item.dpkid,
                        vyapariName: item.vyapari,
                        carrot: item.jaali,
                        weight: item.weight,
                        finalweight: item.weightless,
                        rate: item.rate,
                        isdeleted: item.isdeleted,
                    }));

                    setRows(mappedProducts);
                }
            } catch (error) {
                console.error("Error fetching details data:", error);
            }
        };

        fetchMasterData();
        fetchDetailsData();
    }, [apkid]);




    useEffect(() => {
        const today = userdetail.APPDT;
        setFormData((prev) => ({ ...prev, DATE: formatDate(today) }));
    }, []);



    //Get vyapridata for vbkid generate
    const [vbkid, setVbKid] = useState([]);
    useEffect(() => {
        if (!apkid) return;
        const fetchVyapariBillMaster = async () => {
            try {
                const payload = { "vbkid": apkid };

                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };

                const response = await axios.post(
                    `${baseUrl.Url}/backend/api/GET_VyapariBillMasterAuction`,
                    payload,
                    { headers }
                );

                if (response.status !== 200)
                    throw new Error("Failed to fetch");

                console.log("GET_VyapariBillMaster", response.data);
                setVbKid(response.data);
            } catch (error) {
                console.error("Error fetching GET_VyapariBillMaster data:", error);
            }
        };

        fetchVyapariBillMaster();
    }, [apkid]);



    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name in formData) {
            setFormData({
                ...formData,
                [name]: value,
            });
        } else {
            setDetailData({
                ...detailData,
                [name]: value,
            });
        }
    };


    // Insert table row in detail table
    const handleAddDetail = () => {

        if (iscompleted === true || iscompleted === 1) {
            Swal.fire({
                icon: "error",
                title: "त्रुटी",
                text: "लिलाव पूर्ण झाल्यामुळे हे टोकन हटवता येणार नाही.",
                confirmButtonText: "ठीक आहे",
                allowOutsideClick: false,
                allowEscapeKey: false
            });
            return;
        }


        if (!detailData.vyapariName) {

            VyaparinameRef.current?.focus();
            Swal.fire({

                icon: "error",
                title: "सूचना",
                text: "कृपया व्यापारी निवडा.",
                confirmButtonText: "ठीक आहे",
                allowOutsideClick: false,
                allowEscapeKey: false
            })

            return;

        }



        if (!detailData.carrot) {
            Swal.fire({
                icon: "error",
                title: "सूचना",
                text: "कृपया जाळी निवडा.",
                confirmButtonText: "ठीक आहे",
                allowOutsideClick: false,
                allowEscapeKey: false
            });
            return;
        }


        if (!detailData.kami && !detailData.jast) {
            Swal.fire({
                icon: "error",
                title: "सूचना",
                text: "कृपया 'कमी' किंवा 'जास्त' यापैकी एक पर्याय निवडा.",
                confirmButtonText: "ठीक आहे",
                allowOutsideClick: false,
                allowEscapeKey: false
            });
            return;
        }

        if (detailData.weight === undefined || detailData.weight === null || detailData.weight === "") {
            Swal.fire({
                icon: "error",
                title: "सूचना",
                text: "कृपया ‘कमी’ किंवा ‘जास्त’ यातील योग्य मूल्य भरा. नसेल तर ‘0’ भरा.",
                confirmButtonText: "ठीक आहे",
                allowOutsideClick: false,
                allowEscapeKey: false
            });
            return;
        }


        if (parseFloat(detailData.weight) > 0 && !detailData.kami && !detailData.jast) {
            Swal.fire({
                icon: "error",
                title: "सूचना",
                text: "कृपया ‘कमी’ किंवा ‘जास्त’ यापैकी एक पर्याय निवडा.",
                confirmButtonText: "ठीक आहे",
                allowOutsideClick: false,
                allowEscapeKey: false
            });
            return;
        }

        if (
            !detailData.rate ||
            !/^\d+(\.\d{1,2})?$/.test(detailData.rate) ||
            parseFloat(detailData.rate) <= 0
        ) {
            Swal.fire({
                icon: "error",
                title: "सूचना",
                text: "दर 0 पेक्षा जास्त असावा. फक्त संख्या भरा, अक्षरं किंवा चिन्हं, स्पेस  नको.",
                confirmButtonText: "ठीक आहे",
                allowOutsideClick: false,
                allowEscapeKey: false
            });
            return;
        }


        let updatedRows;
        if (detailData.dpkid) {
            updatedRows = rows.map(row =>
                row.dpkid === detailData.dpkid
                    ? { ...row, ...detailData }
                    : row
            );
        } else {

            updatedRows = [...rows, { ...detailData, dpkid: ACSPLGUID.getNew(), vbkid: ACSPLGUID.getNew() }];
        }

        setRows(updatedRows);
        console.log("Updated Rows:", updatedRows);
        setDetailData({
            dpkid: '',
            vyapariName: '',
            carrot: '0',
            weight: '0',
            finalweight: '',
            rate: '0',
            isdeleted: 0,
            jast: '',
            kami: 'kami',
        });
        calculateTotals();
    };


    //Save Token in Gatentrytable

    const saveGateEntryData = async () => {
        const Newtoken = isTokenGenerated ? ACSPLGUID.getNew() : dpkid;

        if (isTokenGenerated || Newtoken) {
            const payloadtokn = {
                dpkid: Newtoken,
                maid: formData.MAID,
                toknno: formData.TOKEN ? String(formData.TOKEN) : "",
                village: formData.VILLAGE,
                fullname: '',
                caretS_COUNT: '',
                vehno: '',
                aadharno: '',
                mobileno: '',
                croP_TYPE: '',
                companyid: '',
                deptid: '',
                date: formData.DATE || formatDate(userdetail.APPDT),
                isdeleted: false,
                iscompleted: true,
                uid: '',
                uaid: userdetail?.uaid || "",
            };

            try {
                const response7 = await axios.post(
                    `${baseUrl.Url}/backend/api/SP_AddUpdGateEntryDetailISCOMPLETED`,
                    payloadtokn
                );
                console.log("Gate entry saved successfully", response7.data);
                return response7.data;
            } catch (error) {
                console.error("Error saving gate entry data:", error);
            }
        } else {
            console.error("Token was not generated. Please generate a token before saving.");
        }
    };



    const handleSave = () => {
        console.log('Form Data:', formData);
        console.log('Detail Data:', rows);

        if (iscompleted == true || iscompleted == 1) {
            Swal.fire({
                icon: "error",
                title: "त्रुटी",
                text: "लिलाव पूर्ण झाला आहे, त्यामुळे हे टोकन हटवता येणार नाही.",
                confirmButtonText: "ठीक आहे",
                allowOutsideClick: false,
                allowEscapeKey: false
            });
        } else {
            saveGateEntryData();
            handleFormSubmission();
        }

    };



    //Calculate Service rate Based on tblStandingInstruction
    const calculateServiceRate = (service, formData) => {
        let calculatedRate = 0;

        if (service.ratetype === "1" || service.ratetype === "3") {
            if (service.ratetype === "1") {
                calculatedRate = (service.newrate / 100) * parseFloat(formData.TOTALAMOUNT);
            } else if (service.ratetype === "3") {
                calculatedRate = service.newrate * parseFloat(formData.TOTALJALII);
            }
        } else if (service.ratetype === "0") {
            calculatedRate = service.newrate;
        }

        return Math.round(calculatedRate);
    };


    //Calculateserviceratefor Vayapri
    const calculateServiceRatevyapri = (service, totalAmount, carrot) => {
        let calculatedRate = 0;

        if (service.ratetype === "1" || service.ratetype === "3") {
            if (service.ratetype === "1") {
                calculatedRate = (service.newrate / 100) * totalAmount;
            } else if (service.ratetype === "3") {
                calculatedRate = service.newrate * carrot;
            }
        } else if (service.ratetype === "0") {
            calculatedRate = service.newrate;
        }

        return calculatedRate;
    };


    // Rollback Master Delete 
    const rollbackDelete = async (apkid) => {
        try {
            const payload = {
                apkid: apkid,
                companyid: userdetail?.companyID || "",
                deptid: userdetail?.departmentID || "",
                date: formData.DATE || formatDate(userdetail.APPDT),
                token: formData.TOKEN ? String(formData.TOKEN) : "",
            };

            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            await axios.post(`${baseUrl.Url}/backend/api/SP_DeleteAuctionMasters`, JSON.stringify(payload), { headers });

        } catch (error) {
            console.error("Rollback Error:", error);
            Swal.fire({
                icon: "error",
                title: "त्रुटी",
                text: "डेटा रोलबॅक करण्यात अयशस्वी.",
                confirmButtonText: "ठीक आहे",
                allowOutsideClick: false,
                allowEscapeKey: false
            });
        }
    };


    // Main Save Function
    const handleFormSubmission = async () => {

        let apkidToRollback = null;
        let auctionShedDetailPayload = [];
        let DetailsPayload = [];
        let vyapariBillDetailPayload = [];

        const headers = {
            "Content-Type": "application/json",
            Accept: "*/*",
        };

        try {
            // Step 1 - Master Insert
            const payload1 = {
                apkid: formData.apkid ? formData.apkid : ACSPLGUID.getNew(),
                token: formData.TOKEN ? String(formData.TOKEN) : "",
                billno: 0,
                date: formData.DATE || formatDate(userdetail.APPDT),
                maid: formData.MAID,
                village: formData.VILLAGE,
                seva: serviceData.map((s) => `${s.pkid}_${calculateServiceRate(s, formData).toFixed(2)}`).join(", "),
                totaljali: formData.TOTALJALII,
                totalweight: formData.TOTALWEIGHT,
                totalamount: Math.round(formData.TOTALAMOUNT),
                remainingamount: Math.round(formData.BAKI),
                companyid: userdetail?.companyID ? userdetail.companyID : "",
                deptid: userdetail?.departmentID ? userdetail.departmentID : "",
                uaid: userdetail?.uaid || "",
            };

            const response1 = await axios.post(`${baseUrl.Url}/backend/api/SP_AddUpdAuctionshedMaster`, payload1, { headers });
            if (response1.status !== 200) throw new Error("Failed to save Auction Shed Master.");


            console.log("response1?.data[0].billCode", response1?.data[0].billCode)
            apkidToRollback = payload1.apkid;

            // Step 2 - Auction Shed Details
            auctionShedDetailPayload = rows.map((row) => {

                let weight = row.kami === "kami" ? "-" + Math.abs(row.weight) : row.jast === "jast" ? "+" + Math.abs(row.weight) : row.weight;

                return {
                    dpkid: row.dpkid || ACSPLGUID.getNew(),
                    apkid: apkidToRollback,
                    vyapari: row.vyapariName,
                    jaali: row.carrot,
                    weight: weight.toString(),
                    token: '',
                    farmername: '',
                    maid: '',
                    village: '',
                    weightless: row.finalweight,
                    rate: row.rate,
                    crop_type: croP_TYPE,
                    companyid: userdetail?.companyID ? userdetail.companyID : "",
                    deptid: userdetail?.departmentID ? userdetail.departmentID : "",
                    isdeleted: row.isdeleted === 1 || row.isdeleted === true ? true : false,
                };
            });


            const response2 = await axios.post(`${baseUrl.Url}/backend/api/SP_AddUpdAuctionShedDeatil`, auctionShedDetailPayload, { headers });
            if (response2.status !== 200) throw new Error("Failed to save Auction Shed Detail.");

            const totalLoss = serviceData.reduce((sum, s) => sum + calculateServiceRate(s, formData), 0);
            console.log("response1?.data[0].billCode", response1?.data[0].billCode)

            // Step 3 - Receipt Master
            const receiptPayload = {
                baid: apkidToRollback,
                billno: response1?.data[0].billCode || 0,
                btokanno: formData.TOKEN ? String(formData.TOKEN) : "",
                date: formData.DATE || formatDate(userdetail.APPDT),
                fullname: '',
                maid: formData.MAID,
                villagename: formData.VILLAGE,
                phonenumber: '',
                vehicleno: '',
                bankname: '',
                accno: '',
                accname: '',
                ifsccode: '',
                aadharno: '',
                seva: serviceData.map((s) => `${s.pkid}_${calculateServiceRate(s, formData).toFixed(2)}`).join(", "),
                totalcarets: formData.TOTALJALII,
                totalweight: formData.TOTALWEIGHT,
                vehicalrent: 0,
                totalamount: Math.round(formData.TOTALAMOUNT),
                totalcost: Math.round(totalLoss),
                remainingamount: Math.round(formData.BAKI),
                companyid: userdetail?.companyID ? userdetail.companyID : "",
                deptid: userdetail?.departmentID ? userdetail.departmentID : "",
                uid: userdetail?.uid || "",
                trntid: '',
                apkid: apkidToRollback,
                uaid: userdetail?.uaid || "",
                ischecked: "",
                isvyapariverified: true
            };


            const response3 = await axios.post(`${baseUrl.Url}/backend/api/SP_AddUpdRECEIPTMasterAddAuction`, receiptPayload, { headers });
            if (response3.status !== 200) throw new Error("Failed to save Receipt Master.");


            // Step 4 - Receipt Details
            DetailsPayload = rows.map((row) => {

                let weight = row.kami === "kami" ? "-" + Math.abs(row.weight) : row.jast === "jast" ? "+" + Math.abs(row.weight) : row.weight;
                const totalAmount = (row.rate / 20) * row.finalweight;

                return {
                    bdaid: row.dpkid || ACSPLGUID.getNew(),
                    baid: apkidToRollback,
                    croptype: croP_TYPE,
                    vyapariname: row.vyapariName,
                    jali: row.carrot,
                    weightminmax: weight.toString(),
                    amount: Math.round(totalAmount),
                    weight: row.finalweight,
                    rate: row.rate,
                    companyid: userdetail?.companyID ? userdetail.companyID : "",
                    deptid: userdetail?.departmentID ? userdetail.departmentID : "",
                    isdeleted: row.isdeleted === 1 || row.isdeleted === true ? true : false,
                    uaid: userdetail?.uaid || "",
                };
            });


            const response4 = await axios.post(`${baseUrl.Url}/backend/api/SP_AddUpdRECEIPTDetails`, DetailsPayload, { headers });
            if (response4.status !== 200) throw new Error("Failed to save Receipt Details.");


            // Step 5 - Vyapari Bill Master
            const payload3 = rows.map((row) => {

                const existingEntry = vbkid.find(bill =>
                    bill.apkid === formData?.apkid &&
                    bill.billno === response1?.data[0].billCode &&
                    bill.vyapariname === row.vyapariName &&
                    bill.vbkid == rows.dpkid
                );

                const generatedVbKid = existingEntry ? existingEntry.vbkid : row.dpkid;

                // const generatedVbKid = vbkid.length > index ? vbkid[index].vbkid : ACSPLGUID.getNew();
                const totalAmount = (row.rate / 20) * row.finalweight;
                const totalLoss = vayapriserviceData.reduce((sum, s) => sum + calculateServiceRatevyapri(s, totalAmount, row.carrot), 0);

                return {
                    vbkid: generatedVbKid || ACSPLGUID.getNew(),
                    billno: response1?.data[0].billCode || 0,
                    date: formData.DATE || formatDate(userdetail.APPDT),
                    vyapariname: row.vyapariName,
                    shortname: '',
                    companyname: '',
                    phone: '',
                    aadhar: '',
                    bankname: '',
                    accountnumber: '',
                    ifsccode: '',
                    accountname: '',
                    branchname: '',
                    totaljaali: row.carrot,
                    totalweight: row.finalweight,
                    seva: vayapriserviceData.map((s) => `${s.pkid}_${calculateServiceRatevyapri(s, totalAmount, row.carrot).toFixed(2)}`).join(", "),
                    totalamount: Math.round(totalAmount),
                    totalloss: Math.round(totalLoss),
                    remainingamount: Math.round(totalAmount + totalLoss),
                    companyid: userdetail?.companyID ? userdetail.companyID : "",
                    deptid: userdetail?.departmentID ? userdetail.departmentID : "",
                    apkid: apkidToRollback,
                    isdeleted: row.isdeleted === 1 || row.isdeleted === true ? true : false,
                    uaid: userdetail?.uaid || "",
                };
            });


            const response5 = await axios.post(`${baseUrl.Url}/backend/api/SP_AddUpdVyapariBillMasterSaveAuction`, payload3, { headers });
            if (response5.status !== 200) throw new Error("Failed to save Vyapari Bill Master.");

            // Step 6 - Vyapari Bill Details
            vyapariBillDetailPayload = rows.map((row, index) => {

                const weight = row.kami === "kami" ? -Math.abs(row.weight) : row.jast === "jast" ? Math.abs(row.weight) : row.weight;
                const totalAmount = (row.rate / 20) * row.finalweight;

                const vbkid = payload3[index].vbkid;

                return {
                    dvbid: row.dpkid ? row.dpkid : ACSPLGUID.getNew(),
                    vbkid: vbkid,
                    croptype: croP_TYPE,
                    farmername: formdatavyapri.MAID,
                    jaali: row.carrot,
                    weight: row.finalweight,
                    weightdiffrence: weight.toString(),
                    rate: row.rate,
                    totalamount: Math.round(totalAmount),
                    companyid: userdetail?.companyID ? userdetail.companyID : "",
                    deptid: userdetail?.departmentID ? userdetail.departmentID : "",
                    isdeleted: row.isdeleted === 1 || row.isdeleted === true ? true : false,
                };
            });

            const response6 = await axios.post(`${baseUrl.Url}/backend/api/SP_AddUpdVyapariBillDetailAuction`, vyapariBillDetailPayload, { headers });
            if (response6.status !== 200) throw new Error("Failed to save Vyapari Bill Detail.");

            if (response6.status == 200) {
                Swal.fire({
                    icon: "success",
                    title: "सेव्ह झाले!",
                    text: "डेटा यशस्वीरित्या सेव्ह केला गेला.",
                    confirmButtonText: "ठीक आहे",
                    allowOutsideClick: false,
                    allowEscapeKey: false
                }).then(() => {
                    setFormData({
                        apkid: ACSPLGUID.getNew(),
                        TOKEN: '',
                        BILLNO: '',
                        DATE: '',
                        FARMERNAME: '',
                        VILLAGE: '',
                        SEVA: '',
                        TOTALJALII: '',
                        TOTALWEIGHT: '',
                        TOTALAMOUNT: '',
                        TOTALKHARCH: '',
                        BAKI: ''
                    });

                    setDetailData({
                        dpkid: '',
                        apkid: '',
                        vyapariName: '',
                        carrot: '0',
                        weight: '0',
                        rate: '0',
                        finalweight: '',
                        jast: '',
                        kami: 'kami',
                        isdeleted: 0,
                        croP_TYPE: '',
                    });

                    setRows([]);
                    setJALI();
                    // handleNewBill();
                });
            }
        } catch (error) {
            console.error("Form Submission Error:", error);
            if (apkidToRollback) {
                await rollbackDelete(apkidToRollback);  // 🔁 Rollback
            }

            Swal.fire({
                icon: "error",
                title: "त्रुटी",
                text: "डेटा जतन करण्यात अयशस्वी. कृपया पुन्हा प्रयत्न करा.",
                confirmButtonText: "ठीक आहे",
                allowOutsideClick: false,
            });
        }
    };


    const handleInputChangeseva = (e, seva) => {
        const { value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [seva]: value,
        }));
        calculateTotals();
    };



    const handleInputChange1 = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };


    //To fetch and Set RECEiptDataBillByToken
    const handleSearchtoken = async (token) => {
        const today = userdetail.APPDT;

        if (token == "") {
            setFormData({
                TOKEN: "",
                BILLNO: "",
                DATE: "",
                MAID: "",
                VILLAGE: "",
                SEVA: "",
                TOTALJALII: "",
                TOTALWEIGHT: "",
                TOTALAMOUNT: "",
                BAKI: "",
                ISCOMPLETED: false
            });

            setRows([]);
            return false;
        }

        try {
            const payload = {
                companyid: userdetail?.companyID ? userdetail.companyID : "",
                deptid: userdetail?.departmentID ? userdetail.departmentID : "",
                "token": token,
                "date": userdetail.APPDT
            };

            const headers = {
                'Content-Type': 'application/json',
                Accept: '*/*',
            };

            const response = await axios.post(
                `${baseUrl.Url}/backend/api/GET_AuctionDataByToken`,
                payload,
                { headers }
            );

            if (response.status !== 200 || response.data.length === 0) {

                return false;
            }

            let apiData = response.data[0];

            setFormData((prev) => ({
                ...prev,
                TOKEN: apiData.token,
                BILLNO: apiData.billno,
                DATE: formatDate(apiData.date),
                MAID: apiData.maid,
                VILLAGE: apiData.village,
                SEVA: apiData.seva,
                TOTALJALII: apiData.totaljali,
                TOTALWEIGHT: apiData.totalweight,
                TOTALAMOUNT: apiData.totalamount,
                BAKI: apiData.remainingamount,
                ISCOMPLETED: apiData.iscompleted,
                apkid: apiData.apkid
            }));
            setJALI(apiData.totaljali)
            if (response.data.length > 0) {
                const mappedProducts = response.data.map((item) => ({
                    dpkid: item.dpkid,
                    vyapariName: item.vyapari,
                    carrot: item.jaali,
                    weight: item.weight,
                    finalweight: item.weightless,
                    rate: item.rate,
                    isdeleted: item.isdeletedm,
                }));

                setRows(mappedProducts);
            }
            if (response.data.length == 0) {
                Swal.fire({
                    title: "अवैध टोकन",
                    text: "हा टोकन वैध नाही. कृपया योग्य टोकन प्रविष्ट करा.",
                    icon: "warning",
                    confirmButtonText: "ठीक आहे",
                    allowOutsideClick: false,
                    allowEscapeKey: false,

                });
            }
            return true;
        } catch (error) {
            console.error('Error fetching vendor data:', error);
            return false;
        }
    };



    const [croP_TYPE, setCropType] = useState('');
    const [dpkid, setdpkid] = useState('');
    const [caretsCount, setCaretsCount] = useState(0);
    const handleSearch = async (token) => {
        const today = userdetail.APPDT;

        if (token) {
            try {
                const payload = {
                    toknno: token,
                    companyid: userdetail?.companyID || "",
                    deptid: userdetail?.departmentID || "",
                    date: userdetail.APPDT,
                };

                const headers = {
                    'Content-Type': 'application/json',
                    Accept: '*/*',
                };

                const response = await axios.post(
                    `${baseUrl.Url}/backend/api/GET_TOKENNoSearch`,
                    payload,
                    { headers }
                );

                if (response.status === 200 && response.data.length > 0) {
                    const farmerData = response.data[0];

                    if (farmerData.maid) {
                        setFormData((prev) => ({
                            ...prev,
                            MAID: farmerData.maid,
                            VILLAGE: farmerData.village,

                        }));
                        setJALI(farmerData.caretS_COUNT)

                        setformdatavyapri((prev) => ({
                            ...prev,
                            MAID: farmerData.maid,
                            vyapariName: farmerData.fullname,
                        }));
                        setISCOMPLITED(farmerData.iscomplited);

                        setCropType(farmerData.croP_TYPE || '');
                        setdpkid(farmerData.dpkid || '');
                        setCaretsCount(parseFloat(farmerData.caretS_COUNT || 0));
                        return true;
                    }
                }

                Swal.fire({
                    title: "अवैध टोकन",
                    text: "हा टोकन वैध नाही. कृपया प्रथम गेटवर नोंदणी व मंजुरी करा.",
                    icon: "warning",
                    confirmButtonText: "ठीक आहे",
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                });

            } catch (err) {
                console.error(err);
            }
        }


        setFormData((prev) => ({ ...prev, MAID: '', VILLAGE: '' }));
        setformdatavyapri((prev) => ({ ...prev, MAID: '', vyapariName: '' }));
        setCropType('');
        setdpkid('');
        return false;
    };

    useEffect(() => {
        if (formData?.TOKEN) {
            handleSearch(formData.TOKEN);
        }
    }, [formData.TOKEN]);


    const handleEdit = (dpkid) => {
        const filteredProducts = rows.find((row) => row.dpkid === dpkid);

        const weightValue = filteredProducts.weight || '';
        const isKami = weightValue.includes('-');
        // const isJast = !isKami && /^\d+(\.\d+)?$/.test(weightValue);
        const isJast = weightValue.includes('+') || (!isKami && /^\d+(\.\d+)?$/.test(weightValue));

        const cleanWeight = weightValue.replace(/[+-]/g, '');

        const updatedDetail = {
            dpkid: filteredProducts.dpkid,
            vyapariName: filteredProducts.vyapariName,
            carrot: filteredProducts.carrot,
            weight: cleanWeight,
            finalweight: filteredProducts.finalweight,
            rate: filteredProducts.rate,
            isdeleted: 0,
            kami: isKami ? 'kami' : '',
            jast: isJast ? 'jast' : '',
        };

        updatedDetail.finalweight = calculateFinalWeight(updatedDetail);

        setDetailData(updatedDetail);
        setTimeout(() => {
            if (isKami) {
                weightkamiRef.current?.focus();
            } else if (isJast) {
                weightjastRef.current?.focus();
            }
        }, 0);
    };


    const handleDelete = (dpkid, vbkid) => {
        // Check if either dpkid or vbkid is valid

        Swal.fire({
            title: "तुम्हाला खात्री आहे का?",
            text: "तुम्ही हे बदलू शकणार नाही!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "हो, ते हटवा!",
            cancelButtonText: "रद्द करा",
            allowOutsideClick: false,
            allowEscapeKey: false
        }).then((result) => {
            if (result.isConfirmed) {
                setRows((prevRows) => {
                    const updatedRows = prevRows.map((row) =>
                        (row.dpkid === dpkid && row.vbkid === vbkid)
                            ? { ...row, isdeleted: 1 }
                            : row
                    );
                    console.log("Updated Rows:", updatedRows);
                    return updatedRows;
                });

                Swal.fire({
                    icon: "success",
                    title: "हटवले!",
                    text: "रेकॉर्ड यशस्वीरित्या हटवले गेले आहे!",
                    confirmButtonText: "ठीक आहे",
                    allowOutsideClick: false,
                    allowEscapeKey: false
                });

                calculateTotals();
            }
        });
    };


    const [isTokenGenerated, setIsTokenGenerated] = useState();
    const handleNewTokenClick = async () => {
        const today = userdetail.APPDT;
        try {
            const payload = {
                date: convertToCustomDate(userdetail.APPDT, 0)
            };

            const headers = {
                'Content-Type': 'application/json',
                Accept: '*/*',
            };

            const response = await axios.post(
                `${baseUrl.Url}/backend/api/GET_GenrateTokenNO`,
                payload,
                { headers }
            );

            const currentCount = response.data[0].cnt;
            setFormData({
                ...formData,
                TOKEN: currentCount
            });
            setIsTokenGenerated(true);

            console.log('Generated new token:', currentCount);

        } catch (error) {
            console.error('Error generating new token:', error);
        }
    };



    const [vyapari, setvyapari] = useState([]);
    useEffect(() => {
        const fetchCounter = async () => {
            try {
                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };

                const payload = {
                    "companyid": "",
                    "deptid": "",
                };

                const response = await axios.post(
                    `${baseUrl.Url}/backend/api/GET_VaypariName`,
                    payload,
                    { headers }
                );
                if (response.status !== 200)
                    throw new Error("Failed to fetch vendor data");
                console.log("requisition setails", response.data)
                const data = response.data;
                const conuterData = data
                    .map(({ vname, vpaid }) => ({
                        label: vname,
                        value: vpaid
                    }));

                setvyapari(conuterData);
            } catch (error) {
                console.error("Error fetching vendor data:", error);
            }
        };
        fetchCounter();
    }, []);



    const [farmer, setfarmer] = useState([]);
    useEffect(() => {
        const fetchCounter = async () => {
            try {
                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };

                const payload = {
                    companyid: "",
                };

                const response = await axios.post(
                    `${baseUrl.Url}/backend/api/GET_FarmerName`,
                    payload,
                    { headers }
                );
                if (response.status !== 200)
                    throw new Error("Failed to fetch vendor data");
                console.log("requisition setails", response.data)
                const data = response.data;
                const conuterData = data
                    .map(({ fname, faid }) => ({
                        label: fname,
                        value: faid
                    }));

                setfarmer(conuterData);
            } catch (error) {
                console.error("Error fetching vendor data:", error);
            }
        };
        fetchCounter();
    }, []);


    const closeModal = () => {
        const modal = document.getElementById("Model1");
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
            onRefresh();
        }
    };

    window.addEventListener("popstate", (event) => {
        const modal = document.getElementById("Model1");
        if (modal && modal.classList.contains("show")) {
            closeModal();
            navigate(route.Auction)

            history.pushState(null, "", window.location.href);
        }
    });


    useEffect(() => {
        const handlePopState = (event) => {
            const modal = document.getElementById("Model1");
            if (modal && modal.classList.contains("show")) {
                closeModal();
            }
        };

        window.addEventListener("popstate", handlePopState);
        return () => window.removeEventListener("popstate", handlePopState);
    }, []);


    const showExitAlert = () => {
        setFormData({
            apkid: '',
            dpkid: '',
            TOKEN: '',
            BILLNO: '',
            DATE: '',
            FARMERNAME: '',
            VILLAGE: '',
            SEVA: '',
            HAMALI: '',
            TOLAI: '',
            LEVHI: '',
            TOTALJALII: '',
            TOTALAMOUNT: '',
            TOTALKHARCH: '',
            BAKI: '',
        });


        setDetailData({
            dpkid: '',
            apkid: '',
            vyapariName: '',
            carrot: '0',
            weight: '0',
            rate: '0',
            finalweight: '',
            jast: '',
            kami: 'kami',
            isdeleted: 0,
            croP_TYPE: '',
        });

        setRows([]);

        if (onRefresh) onRefresh();

        const modal = document.getElementById("Model1");
        if (modal) {
            modal.classList.remove("show");
            modal.style.display = "none";
            modal.setAttribute("aria-hidden", "true");


            document.querySelectorAll(".modal-backdrop").forEach(backdrop => {
                backdrop.remove();
            });


            document.body.classList.remove("modal-open");
            document.body.style.overflow = "";
            document.body.style.paddingRight = "";
        }
    };


    useEffect(() => {
        const handlePopState = () => {
            setFormData({
                apkid: '',
                dpkid: '',
                TOKEN: '',
                BILLNO: '',
                DATE: '',
                FARMERNAME: '',
                VILLAGE: '',
                SEVA: '',
                HAMALI: '',
                TOLAI: '',
                LEVHI: '',
                TOTALJALII: '',
                TOTALAMOUNT: '',
                TOTALKHARCH: '',
                BAKI: '',
            });

            setRows([]);
            const modal = document.getElementById("Model1");
            if (modal) {
                modal.classList.remove("show");
                modal.style.display = "none";
                modal.setAttribute("aria-hidden", "true");

                const backdrop = document.querySelector(".modal-backdrop");
                if (backdrop) backdrop.remove();

                document.body.classList.remove("modal-open");
                document.body.style.overflow = "auto";
            }
            navigate("/Auction");
        };

        window.onpopstate = handlePopState;


        return () => {
            window.onpopstate = null;
        };
    }, [navigate]);




    const [serviceData, setServiceData] = useState([]);
    useEffect(() => {
        const fetchFarmersServiceData = async () => {
            try {
                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };

                const payload = {
                    shid: "",
                    companyid: userdetail?.companyID ? userdetail.companyID : "",
                    deptid: userdetail?.departmentID ? userdetail.departmentID : "",
                };

                const response = await axios.post(
                    `${baseUrl.Url}/backend/api/GET_FARMERSERVICE`,
                    payload,
                    { headers }
                );

                if (response.status !== 200) {
                    throw new Error("Failed to fetch farmers service data");
                }

                console.log("Farmers service details:", response.data);

                const data = response.data;
                const serviceData = data.map(({ servicetypetitle, newrate, ratetype, pkid, ratetypetitle }) => {
                    return {
                        servicetypetitle,
                        pkid,
                        newrate,
                        ratetype,
                        ratetypetitle
                    };
                });
                setServiceData(serviceData);
            } catch (error) {
                console.error("Error fetching farmers service data:", error);
            }
        };

        fetchFarmersServiceData();
    }, []);



    const [vayapriserviceData, setvayapriServiceData] = useState([]);
    useEffect(() => {
        const fetchvyapriServiceData = async () => {
            try {
                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };

                const payload = {
                    shid: "",
                    companyid: userdetail?.companyID ? userdetail.companyID : "",
                    deptid: userdetail?.departmentID ? userdetail.departmentID : "",
                };

                const response = await axios.post(
                    `${baseUrl.Url}/backend/api/GET_VapariStandingInstrcution`,
                    payload,
                    { headers }
                );

                if (response.status !== 200) {
                    throw new Error("Failed to fetch farmers service data");
                }

                console.log("Farmers service details:", response.data);

                const data = response.data;
                const vayapriserviceData = data.map(({ pkid, newrate, servicetype, ratetype }) => {
                    return {
                        pkid,
                        newrate,
                        servicetype,
                        ratetype,
                    };
                });
                setvayapriServiceData(vayapriserviceData);
            } catch (error) {
                console.error("Error fetching farmers service data:", error);
            }
        };

        fetchvyapriServiceData();
    }, []);


    //change tokkn number
    const handleInputChangetoken = async (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));

        if (value == "") {
            setFormData({
                TOKEN: "",
                BILLNO: "",
                DATE: "",
                MAID: "",
                VILLAGE: "",
                SEVA: "",
                TOTALJALII: "",
                TOTALWEIGHT: "",
                TOTALAMOUNT: "",
                BAKI: "",
                ISCOMPLETED: false
            });

            setRows([]);
            return false;
        }

    };

    const handleInputChangejali = (e) => {
        const jaliValue = parseFloat(e.target.value) || 0;
        const calculatedWeight = jaliValue * 20;

        let totalJaliUsed = 0;
        rows.forEach(row => {
            if (detailData.dpkid && row.dpkid === detailData.dpkid) {
                return;
            }
            totalJaliUsed += parseFloat(row.carrot || 0);
        });


        const limit = parseFloat(caretsCount) + 10;

        const totalAfterUpdate = totalJaliUsed + jaliValue;

        if (totalAfterUpdate > limit) {
            // const remainingJali = limit - totalJaliUsed;
            const remainingJali = Math.max(0, limit - totalJaliUsed);

            Swal.fire({
                icon: "error",
                title: "त्रुटी",
                text: `${remainingJali} जाळ्या उपलब्ध आहेत, तुम्ही त्यापेक्षा जास्त टाकू शकत नाही.`,
                confirmButtonText: "ठीक आहे",
                allowOutsideClick: false,
                allowEscapeKey: false
            });
            return;
        }

        setDetailData((prevData) => ({
            ...prevData,
            carrot: jaliValue,
            finalweight: calculatedWeight,
        }));
    };

    const handleRadioChange = (e) => {
        const { name, value } = e.target;

        let updatedData = {
            ...detailData,
            kami: name === "kami" ? value : '',
            jast: name === "jast" ? value : '',
        };

        // Keep weight if already entered, else set to 0
        const weightValue = parseFloat(detailData.weight) || 0;
        const baseWeight = (parseFloat(detailData.carrot) || 0) * 20;

        if (updatedData.kami === "kami") {
            updatedData.finalweight = baseWeight - weightValue;
        } else if (updatedData.jast === "jast") {
            updatedData.finalweight = baseWeight + weightValue;
        } else {
            updatedData.finalweight = baseWeight;
        }

        setDetailData(updatedData);
    };



    const handleWeightChange = (e) => {
        const inputValue = e.target.value;
        const weightValue = parseFloat(inputValue) || 0;

        const carrotValue = parseFloat(detailData.carrot) || 0;
        const baseWeight = carrotValue * 20;

        // Validation for both kami and jast if weight > 19
        if ((detailData.kami === "kami" || detailData.jast === "jast") && weightValue > 19) {
            Swal.fire({
                icon: "error",
                title: "चूक",
                text: " वजन 19 पेक्षा जास्त करू शकत नाही.",
                confirmButtonText: "ठीक आहे",
                allowOutsideClick: false,
                allowEscapeKey: false
            });

            setDetailData((prevData) => ({
                ...prevData,
                weight: '',
                finalweight: baseWeight
            }));
            return;
        }

        let newFinalWeight = baseWeight;

        if (detailData.kami === "kami") {
            newFinalWeight -= weightValue;

        } else if (detailData.jast === "jast") {
            newFinalWeight += weightValue;

        }

        setDetailData((prevData) => ({
            ...prevData,
            weight: inputValue,
            finalweight: newFinalWeight,
        }));
    };



    const calculateFinalWeight = (data) => {
        const jaliValue = parseFloat(data.carrot) || 0;
        const baseWeight = jaliValue * 20;
        const weightValue = parseFloat(data.weight) || 0;

        let finalWeight = baseWeight;

        if (data.kami) {
            finalWeight -= weightValue;
        } else if (data.jast) {
            finalWeight += weightValue;
        }

        return finalWeight;
    };


    //calculation for farmer
    const calculateTotals = () => {
        let totalJali = 0;
        let totalWeight = 0;
        let totalAmount = 0;
        let totalServiceRate = 0;
        let baki = 0;


        rows.forEach((row) => {
            if (row.isdeleted === 0 || row.isdeleted === false) {
                totalJali += parseInt(row.carrot) || 0;
                totalWeight += parseFloat(row.finalweight) || 0;
                const rowTotalPrice = (parseFloat(row.rate) / 20) * parseFloat(row.finalweight);
                totalAmount += rowTotalPrice;
            }
        });

        serviceData.forEach((service) => {
            const calculatedRate = calculateServiceRate(service, formData);
            totalServiceRate += calculatedRate;
        });

        baki = parseFloat(formData.TOTALAMOUNT) - totalServiceRate;
        setFormData((prevFormData) => {
            const updatedData = {
                ...prevFormData,
                TOTALJALII: totalJali,
                TOTALWEIGHT: Math.round(totalWeight),
                TOTALAMOUNT: Math.round(totalAmount),
                BAKI: Math.round(baki),
            };

            console.log("Updated Form Data:", updatedData);
            return updatedData;
        });

    };


    useEffect(() => {
        calculateTotals();
    }, [rows, serviceData, formData.TOTALAMOUNT, formData.TOTALJALII]);


    // const handleKeyDown = (e, nextRef) => {
    //     if (e.key === "Enter") {
    //         // e.preventDefault();
    //         if (nextRef && nextRef.current) {
    //             nextRef.current.focus();
    //         }
    //     }
    // };

    const handleKeyDown = async (e, nextRef) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const isValid = await handleSearch(e.target.value);

            if (!isValid) {

                if (TOKENRef.current) {
                    TOKENRef.current.focus();
                }
                return;
            }

            if (nextRef && nextRef.current) {
                nextRef.current.focus();
            }
        }
    };

    useEffect(() => {
        const handleShortcut = (e) => {
            if (e.ctrlKey && e.key.toLowerCase() === "e") {
                e.preventDefault();

                if (iscompleted === true || iscompleted === 1) {
                    Swal.fire({
                        icon: "error",
                        title: "त्रुटी",
                        text: "लिलाव पूर्ण झाला आहे, त्यामुळे हे टोकन हटवू शकत नाही.",
                        confirmButtonText: "ठीक आहे",
                        allowOutsideClick: false,
                        allowEscapeKey: false
                    });
                    return;
                }

                showExitAlert();
            }

            if (e.ctrlKey && e.key.toLowerCase() === "s") {
                e.preventDefault();
                checkFormValidity(e);
            }
        };

        window.addEventListener("keydown", handleShortcut);

        return () => {
            window.removeEventListener("keydown", handleShortcut);
        };
    }, [formData, rows, iscompleted]);



    const checkFormValidity = (e) => {
        const { TOKEN, BILLNO, MAID } = formData;
        if (iscompleted === true || iscompleted === 1) {
            Swal.fire({
                icon: "error",
                title: "त्रुटी",
                text: "लिलाव पूर्ण झाल्यामुळे हे टोकन हटवता येणार नाही.",
                confirmButtonText: "ठीक आहे",
                allowOutsideClick: false,
                allowEscapeKey: false
            });
            return;
        }
        if (!TOKEN || isNaN(TOKEN)) {
            Swal.fire({
                icon: "error",
                title: "वैधता त्रुटी",
                text: "कृपया वैध टोकन नंबर प्रविष्ट करा. (टोकन नंबर फक्त अंक असावा.)",
                confirmButtonText: "ठीक आहे",
                allowOutsideClick: false,
                allowEscapeKey: false
            }).then(() => {
                TOKENRef.current.focus();
            });
            return;
        }


        if (!MAID) {
            Swal.fire({
                icon: "error",
                title: "वैधता त्रुटी",
                text: "कृपया शेतकऱ्याचे नाव आवश्यक आहे.",
                confirmButtonText: "ठीक आहे",
                allowOutsideClick: false,
                allowEscapeKey: false
            }).then(() => {
                FARMERNAMERef.current.focus();
            });
            return;
        }

        if (rows.length === 0) {
            Swal.fire({
                icon: "error",
                title: "वैधता त्रुटी",
                text: "कृपया सेव्ह करण्यापूर्वी किमान एक उत्पादन नक्की जोडा.",
                confirmButtonText: "ठीक आहे",
                allowOutsideClick: false,
                allowEscapeKey: false
            });
            return;
        }
        handleSave(e);
    };


    useEffect(() => {
        return () => {
            if (tokenTimeout) clearTimeout(tokenTimeout);
        };
    }, [tokenTimeout]);


    const handleWeightBlur = () => {
        if (detailData.weight === "") {
            setDetailData((prevData) => ({
                ...prevData,
                weight: "0",
            }));
        }
    };


    const handleFocus = (e) => {
        const { name } = e.target;
        if (detailData[name] === "0") {
            setDetailData(prevData => ({
                ...prevData,
                [name]: ""
            }));
        }
    };


    return (

        <div
            className="modal fade"
            id="Model1"
            // show={showModal} onHide={() => setShowModal(false)}
            tabIndex={-1}
            aria-labelledby="exampleModalFullscreenLabel"
            aria-hidden="true"
            style={{ display: "none" }}
        >
            <div className="modal-dialog modal-fullscreen mbgcolor">
                <div className="modal-content mbgcolor">
                    <div className="page-wrapper-new p-0">
                        <div className="content  mbgcolor">
                            <div className="modal-header border-0 custom-modal-header modlheadr">
                                <h6 className="modal-title" id="exampleModalFullscreenLabel">
                                    शेतकरी हिशोब पट्टी
                                </h6>
                                <div className="page-btn">
                                    <Link
                                        className="btn btn-secondary"
                                        aria-label="Close"
                                        // data-bs-dismiss="modal"
                                        onClick={showExitAlert}
                                    >
                                        <ArrowLeft className="me-2" />
                                        मागे
                                    </Link>
                                </div>
                            </div>

                            <div className="modal-body custom-modal-body pt-0 pb-0" style={{
                                overflow: "hidden",
                            }}>
                                <form>
                                    <div className="row">
                                        <div className="col-lg-2 col-md-6 col-sm-6 col-6">
                                            <div className="mb-0">
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <label className="required">टोकन क्रमांक</label>
                                                </div>
                                                <div className="d-flex">
                                                    <input
                                                        ref={TOKENRef}
                                                        type="tel"
                                                        className="form-control"
                                                        name="TOKEN"
                                                        value={formData.TOKEN}
                                                        onChange={async (e) => {
                                                            const value = e.target.value;
                                                            const prevToken = prevTokenRef.current;


                                                            const isTokenChanged = value !== prevToken;

                                                            if (isTokenChanged && isFormInitialized.current) {
                                                                const hasValidRow = rows.some(row => row.isdeleted === 0 || row.isdeleted === false);

                                                                if (hasValidRow) {
                                                                    if (iscompleted === true || iscompleted === 1) {
                                                                        Swal.fire({
                                                                            icon: "error",
                                                                            title: "त्रुटी",
                                                                            text: "लिलाव पूर्ण झाला आहे, त्यामुळे टोकन क्रमांक बदलता येणार नाही.",
                                                                            confirmButtonText: "ठीक आहे",
                                                                            allowOutsideClick: false,
                                                                            allowEscapeKey: false
                                                                        });
                                                                        return;
                                                                    } else {
                                                                        const result = await Swal.fire({
                                                                            icon: "warning",
                                                                            title: "टोकन क्रमांक हटविणार आहात?",
                                                                            text: "टोकन हटवायचं का? की माहिती सेव्ह करायची?",
                                                                            showCancelButton: true,
                                                                            confirmButtonText: "हटवा",
                                                                            cancelButtonText: "सेव्ह करा",
                                                                            allowOutsideClick: false,
                                                                            allowEscapeKey: false
                                                                        });

                                                                        if (result.isConfirmed) {
                                                                            setFormData({
                                                                                TOKEN: "",
                                                                                VILLAGE: "",
                                                                                FARMERNAME: "",
                                                                                ADDRESS: "",
                                                                            });

                                                                            setDetailData({
                                                                                dpkid: '',
                                                                                apkid: '',
                                                                                vyapariName: '',
                                                                                carrot: '0',
                                                                                weight: '0',
                                                                                rate: '0',
                                                                                finalweight: '',
                                                                                jast: '',
                                                                                kami: 'kami',
                                                                                isdeleted: 0,
                                                                                croP_TYPE: '',
                                                                            });

                                                                            setRows([]);
                                                                            prevTokenRef.current = "";
                                                                            isFormInitialized.current = false;
                                                                        } else {
                                                                            handleSave();
                                                                        }
                                                                        return;
                                                                    }
                                                                }
                                                            }


                                                            handleInputChangetoken(e);


                                                            prevTokenRef.current = value;
                                                        }}



                                                        onBlur={() => {
                                                            const value = formData.TOKEN.trim();
                                                            if (value) {
                                                                handleSearchtoken(value);
                                                            }
                                                        }}

                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') {
                                                                handleSearchtoken(e.target.value);
                                                                handleKeyDown(e, VyaparinameRef);
                                                            }
                                                        }}
                                                        style={{
                                                            fontWeight: "900",
                                                            backgroundColor: "#ffeb3b",
                                                            border: "2px solid #ff9800",
                                                            textAlign: "center"
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>


                                        <div className="col-lg-3 col-md-4 col-sm-12">
                                            <div className="mb-0">
                                                <label className="required">शेतकऱ्याचे नाव</label>
                                                <input
                                                    ref={FARMERNAMERef}
                                                    type="text"
                                                    className="form-control"
                                                    name="MAID"
                                                    value={
                                                        farmer.find(option => option.value === formData.MAID)?.label || ''
                                                    }
                                                    readOnly
                                                    onKeyDown={(e) => handleKeyDown(e, VILLAGERef)}

                                                />
                                            </div>
                                        </div>

                                        <div className="col-6 col-md-6 col-lg-3 mb-3">
                                            <div className="mb-0 add-product">
                                                <label className="required">गाव</label>
                                                <input
                                                    ref={VILLAGERef}
                                                    type="text"
                                                    className="form-control"
                                                    name="VILLAGE"
                                                    value={formData.VILLAGE}
                                                    onChange={handleInputChange1}
                                                    readOnly
                                                    onKeyDown={(e) => handleKeyDown(e, VyaparinameRef)}
                                                />
                                            </div>
                                        </div>

                                        <div className="col-6 col-md-6 col-lg-2 mb-3">
                                            <div className="mb-0 add-product">
                                                <label>तारीख</label>

                                                <input
                                                    ref={DATERef}
                                                    type="datetime-local"
                                                    className="form-control"
                                                    name="DATE"
                                                    value={formatToDateTimeLocal(userdetail.APPDT)}
                                                    onChange={handleInputChange}
                                                    onKeyDown={(e) => handleKeyDown(e, VyaparinameRef)}
                                                    required
                                                    readOnly
                                                />

                                            </div>
                                        </div>
                                    </div>

                                    <div className="modal-body-table responsive-no-scroll">
                                        <div className="table-responsive">
                                            <table className="table table-bordered">
                                                <thead className="thead-dark bg-dark text-white">
                                                    <tr>
                                                        <th style={{ width: "20%" }}>व्या.</th>
                                                        <th style={{ width: "10%" }}>जा.</th>
                                                        <th style={{ width: "10%" }}>+/-</th>
                                                        <th style={{ width: "15%" }}>वजन</th>
                                                        <th style={{ width: "15%" }}>रेट</th>
                                                        <th style={{ width: "20%" }}>कृती</th>
                                                    </tr>
                                                </thead>
                                            </table>
                                        </div>

                                        <div className="table-responsive">
                                            <table className="table table-bordered datanew table-striped w-100 mb-0">
                                                <tbody>
                                                    {rows.filter((row) => row.isdeleted == 0 || row.isdeleted == false).length > 0 ? (
                                                        rows
                                                            .filter((row) => row.isdeleted == 0)
                                                            .sort((a, b) => parseFloat(b.rate) - parseFloat(a.rate))
                                                            .map((row, index) => (
                                                                <tr key={row.dpkid || index}>
                                                                    <td style={{ width: "20%" }} className="desktop-col col-token">
                                                                        {vyapari.find((option) => option.value === row.vyapariName)?.label || "N/A"}
                                                                    </td>
                                                                    <td style={{ width: "10%" }} className="desktop-col col-name">{row.carrot}</td>
                                                                    <td style={{ width: "10%" }} className="desktop-col col-name">
                                                                        {row.jast === "jast" && <span> +</span>}
                                                                        {row.kami === "kami" && <span> -</span>}
                                                                        {row.weight}
                                                                    </td>
                                                                    <td style={{ width: "15%" }} className="desktop-col col-name">{row.finalweight}</td>
                                                                    <td style={{ width: "15%" }} className="desktop-col col-name">{row.rate}</td>
                                                                    <td style={{ width: "20%" }} className="desktop-col col-action">
                                                                        <Link to="#" onClick={() => handleEdit(row.dpkid)} className="me-2 p-1" style={{ color: "lightblue" }}>
                                                                            <Edit className="feather-edit" />
                                                                        </Link>
                                                                        <Link to="#" className="confirm-text p-1 text-danger" onClick={() => handleDelete(row.dpkid, row.vbkid)}>
                                                                            <Trash2 className="feather-trash-2" />
                                                                        </Link>
                                                                    </td>
                                                                </tr>
                                                            ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan="6" className="text-center">No Data Available</td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    <div className="border p-3 rounded shadow-sm mb-1 mt-1">
                                        <div className="row mt-1">
                                            <div className="col-lg-3 col-md-6 col-sm-12">
                                                <div className="mb-0">
                                                    <label className='required'>व्यापारी</label>
                                                    <Select
                                                        ref={VyaparinameRef}
                                                        placeholder="Select Counter"
                                                        classNamePrefix="react-select"
                                                        openMenuOnFocus={true}
                                                        options={vyapari}
                                                        value={vyapari.find(option => option.value === detailData.vyapariName) || null}
                                                        onChange={(selectedOption) => {
                                                            const selectedVyapariName = selectedOption ? selectedOption.value : '';


                                                            setDetailData(prevState => ({
                                                                ...prevState,
                                                                vyapariName: selectedVyapariName,
                                                            }));


                                                            setformdatavyapri(prevState => ({
                                                                ...prevState,
                                                                vyapariName: selectedVyapariName,
                                                            }));


                                                            if (jaliRef.current) {
                                                                jaliRef.current.focus();
                                                            }
                                                        }}
                                                        styles={{
                                                            menu: (base) => ({
                                                                ...base,
                                                                zIndex: 1050,
                                                            }),

                                                        }}
                                                    />

                                                </div>
                                            </div>

                                            <div className="col-lg-1 col-md-6 col-sm-12">
                                                <div className="mb-0">
                                                    <label className="required">जाळी</label>
                                                    <input
                                                        ref={jaliRef}
                                                        type="tel"
                                                        className="form-control"
                                                        name="carrot"
                                                        value={detailData.carrot}
                                                        onChange={handleInputChangejali}
                                                        onKeyDown={(e) => handleKeyDown(e, weightkamiRef)}
                                                        onFocus={handleFocus}
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-lg-2 col-md-6 col-sm-12">
                                                <div className="mb-0">
                                                    <label className="required">वजन</label>
                                                    <div className="form-check form-check-inline">
                                                        <input
                                                            ref={weightkamiRef}
                                                            className="form-check-input"
                                                            type="radio"
                                                            name="kami"
                                                            id="kmi"
                                                            value="kami"
                                                            checked={detailData.kami === 'kami'}
                                                            onChange={handleRadioChange}
                                                            onKeyDown={(e) => handleKeyDown(e, weightjastRef)}
                                                        />
                                                        <label className="form-check-label" htmlFor="kmi">कमी</label>
                                                    </div>
                                                    <div className="form-check form-check-inline">
                                                        <input
                                                            ref={weightjastRef}
                                                            className="form-check-input"
                                                            type="radio"
                                                            name="jast"
                                                            id="jast"
                                                            value="jast"
                                                            checked={detailData.jast === 'jast'}
                                                            onChange={handleRadioChange}
                                                            onKeyDown={(e) => handleKeyDown(e, weightRef)}
                                                        />
                                                        <label className="form-check-label" htmlFor="jast">जास्त</label>
                                                    </div>


                                                    <input
                                                        ref={weightRef}
                                                        type="tel"
                                                        className="form-control"
                                                        name="weight"
                                                        value={detailData.weight}
                                                        onChange={handleWeightChange}
                                                        onKeyDown={(e) => handleKeyDown(e, rateRef)}
                                                        onBlur={handleWeightBlur}
                                                        onFocus={handleFocus}
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-lg-2 col-md-6 col-sm-12">
                                                <div className="mb-0">
                                                    <label className="required">वजन</label>
                                                    <input
                                                        type="tel"
                                                        className="form-control"
                                                        name="finalweight"
                                                        value={detailData.finalweight}
                                                        onChange={handleInputChangejali}
                                                        onKeyDown={(e) => handleKeyDown(e, rateRef)}
                                                        readOnly
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-lg-2 col-md-6 col-sm-12">
                                                <div className="mb-0">
                                                    <label className='required'>रेट</label>
                                                    <input type="tel"
                                                        ref={rateRef}
                                                        className="form-control"
                                                        name="rate"
                                                        value={detailData.rate}
                                                        onChange={handleInputChange}
                                                        onFocus={handleFocus}
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-12 col-md-6 col-lg-2 mb-3 mt-4 d-flex justify-content-center align-items-center">
                                                <div className="w-100 w-md-auto">
                                                    <button
                                                        type="button"
                                                        className="btn btn-submit w-100 w-md-auto"
                                                        onClick={handleAddDetail}
                                                    >
                                                        वक्कल
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                    </div>




                                    <div className="row custom-background">
                                        <div className="col-6 col-md-6 col-lg-2 mb-3">
                                            <div className="mb-0 add-product">
                                                <label>एकुण जाळी</label>
                                                <input
                                                    type="tel"
                                                    className="form-control"
                                                    name="TOTALJALII"
                                                    value={formData.TOTALJALII}
                                                    onChange={handleInputChange}
                                                    readOnly
                                                />
                                            </div>
                                        </div>

                                        <div className="col-6 col-md-6 col-lg-2 mb-3">
                                            <div className="mb-0 add-product">
                                                <label>एकुण वजन</label>
                                                <input
                                                    type="tel"
                                                    className="form-control"
                                                    name="TOTALWEIGHT"
                                                    value={formData.TOTALWEIGHT}
                                                    onChange={handleInputChange}
                                                    readOnly
                                                />
                                            </div>
                                        </div>

                                        <div className="col-6 col-md-6 col-lg-2 mb-3">
                                            <div className="mb-0 add-product">
                                                <label>एकुण रक्कम</label>
                                                <input
                                                    type="tel"
                                                    className="form-control"
                                                    name="TOTALAMOUNT"
                                                    value={formData.TOTALAMOUNT}
                                                    onChange={handleInputChange}
                                                    readOnly

                                                />
                                            </div>
                                        </div>


                                        {/* Dynamically label for farmer service */}
                                        {serviceData.map((service, index) => {
                                            let calculatedRate;
                                            if (!formData[service.servicetypetitle]) {
                                                if (service.ratetype === "1" || service.ratetype === "3") {
                                                    if (service.ratetype === "1") {
                                                        calculatedRate = (service.newrate / 100) * parseFloat(formData.TOTALAMOUNT).toFixed(2);
                                                    } else if (service.ratetype === "3") {
                                                        calculatedRate = service.newrate * parseFloat(formData.TOTALJALII);
                                                    }
                                                } else if (service.ratetype === "0") {
                                                    calculatedRate = service.newrate;
                                                }
                                            }
                                            return (
                                                <div key={index} className="col-6 col-md-6 col-lg-2 mb-3">
                                                    <div className="mb-0 add-product">
                                                        <label>{`${service.servicetypetitle}`}</label>
                                                        <input
                                                            type="tel"
                                                            className="form-control"
                                                            name={service.seva}
                                                            value={formData[service.seva] || (calculatedRate !== undefined ? Math.round(calculatedRate) : '')}
                                                            onChange={(e) => handleInputChangeseva(e, service.seva)}
                                                            readOnly
                                                        />
                                                    </div>
                                                </div>

                                            );
                                        })}



                                        <div className="col-6 col-md-6 col-lg-2 mb-3">
                                            <div className="mb-0 add-product">
                                                <label>बाकी रक्कम</label>
                                                <input
                                                    type="tel"
                                                    className="form-control"
                                                    name="BAKI"
                                                    value={payloadType === 'payload1' ? formData.BAKI : formData.vayapriBAKI}  // Dynamically switch between BAKI and vayapriBAKI
                                                    onChange={handleInputChange}
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                    </div>


                                    {/* Vypari Label and calculation */}

                                    {/* {vayapriserviceData.map((service, index) => {
                                        let calculatedRate;

                                        if (!formData[service.servicetype]) {
                                            if (service.ratetype === "1" || service.ratetype === "3") {
                                                if (service.ratetype === "1") {
                                                    calculatedRate = (service.newrate / 100) * parseFloat(formData.TOTALAMOUNT).toFixed(2);
                                                } else if (service.ratetype === "3") {
                                                    calculatedRate = service.newrate * parseFloat(formData.TOTALJALII);
                                                }
                                            } else if (service.ratetype === "0") {
                                                calculatedRate = service.newrate;
                                            }
                                        }

                                        return (
                                            <div key={index} className="col-6 col-md-6 col-lg-3 mb-3">
                                                <div className="mb-0 add-product">
                                                    <label>{`${service.servicetype}`} ({`${service.newrate}`} {`${service.ratetype}`})</label>
                                                    <input
                                                        type="text"
                                                        className="form-control border"
                                                        name={service.seva}
                                                        value={formData[service.seva] || (calculatedRate !== undefined ? calculatedRate.toFixed(2) : '')}
                                                        onChange={(e) => handleInputChangeseva(e, service.seva)}
                                                    />
                                                </div>
                                            </div>

                                        );
                                    })} */}


                                    <div className="col-lg-12">
                                        <div className="text-end">
                                            <div className="row justify-content-end">
                                                <div className="col-4 col-md-1 mb-2">
                                                    <button
                                                        type="button"
                                                        className="btn btn-cancel w-100"
                                                        // data-bs-dismiss="modal"
                                                        onClick={showExitAlert}
                                                    >
                                                        मागे
                                                    </button>
                                                </div>

                                                <div className="col-4 col-md-1">
                                                    <button
                                                        type="button"
                                                        className="btn btn-submit w-100"
                                                        // onClick={(e) => checkFormValidity(e)}
                                                        onClick={() => {
                                                            if (formData.ISCOMPLETED === true || formData.ISCOMPLETED === 1) {
                                                                Swal.fire({
                                                                    icon: "error",
                                                                    title: "लिलाव पूर्ण झाला आहे",
                                                                    text: "लिलाव पूर्ण झाल्यामुळे हे टोकन हटवता येणार नाही.",
                                                                    confirmButtonText: "ठीक आहे",
                                                                    allowOutsideClick: false,
                                                                    allowEscapeKey: false
                                                                });
                                                            } else {
                                                                checkFormValidity(); // or handleSave();
                                                            }
                                                        }}

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
                </div>
            </div>
        </div>
    )
}


export default AddAuction;




