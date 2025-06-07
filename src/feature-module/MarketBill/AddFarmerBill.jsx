import React, { useRef, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

import Select from "react-select";
import "bootstrap/dist/css/bootstrap.min.css";
import {
    ArrowLeft, Trash2, Edit,
} from "feather-icons-react/build/IconComponents";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axios from 'axios';
import { all_routes } from "../../Router/all_routes"
import { ACSPLGUID, baseUrl, convertToISODate, formatDate } from "../../core/json/custom";
import { Accounts } from "../../core/json/custom";
import {
    PlusCircle
} from "feather-icons-react/build/IconComponents";
import { getUserData } from "../../Context/UserData"

const AddFarmerBill = ({ BAID, DATE, billno, onRefresh }) => {
    const saveRef = useRef(null);

    console.log(BAID, "baid");
    console.log(DATE, "date");

    const tokennumberRef = useRef(null);
    const banknameRef = useRef(null);
    const accountnumberRef = useRef(null);
    const accountnameRef = useRef(null);
    const ifsccodeRef = useRef(null);
    const AadharRef = useRef(null);
    const croptypeRef = useRef(null);
    const vyaparinameRef = useRef(null);
    const caretsRef = useRef(null);
    const weightkamijastRef = useRef(null);
    const rateRef = useRef(null);
    const addRef = useRef(null);
    const [VyapariData, setVyapariData] = useState([]);

    const { userdetail } = getUserData();
    const navigate = useNavigate();
    const route = all_routes;
    const GUID = ACSPLGUID.getNew();

    const location = useLocation();
    const { PRAID } = location.state || {};
    console.log('primaryKey', PRAID)


    const [checkcaretscount, setCheckcaretscount] = useState(0);
    const [tableData, setTableData] = useState([]);


    const [masterData, setMasterData] = useState({
        baid: "",
        Bill_Kramank: "",
        tokennumber: "",
        tarikh: "",

        maid: "",
        village_name: "",
        mobilenumber: "",
        vehiclenumber: "",
        bankname: "",
        accountnumber: "",
        accountname: "",
        ifsccode: "",
        Aadhar: "",

        ekunjali: "",
        ekunwajan: "",
        gadibhade: "",
        ekunrakkam: "",
        ekunkharch: "",
        bakirakkam: "",
        seva: "",
        trntid: "",
    });

    const handleMasterInputChange = (e) => {
        const { name, value } = e.target;
        setMasterData({
            ...masterData,
            [name]: value
        });

    };

    const [formData, setFormData] = useState({
        croptype: "",
        vyapariname: "",
        carets: "",
        weight: "",
        weightkamijast: "0",
        rate: "",
        amount: "",
        IsDeleted: 0,
        // weightType: "min",

    });

    // use effect for update amount and rate dyanamically
    useEffect(() => {
        const weight = parseFloat(formData.weight) || 0;
        const rate = parseFloat(formData.rate) || 0;

        const updatedAmount = Math.round(weight * (rate / 20))

        let updatedWeightType = formData.weightType;

        if (!updatedWeightType && formData.weightkamijast) {
            if (formData.weightkamijast.startsWith("-")) {
                updatedWeightType = "min";
            } else if (formData.weightkamijast.startsWith("+")) {
                updatedWeightType = "max";
            }
        }

        setFormData((prev) => ({
            ...prev,
            amount: updatedAmount,
            // weightType: updatedWeightType || "min",
            weightType: updatedWeightType || prev.weightType || "min",

        }));
    }, [formData.weight, formData.rate, formData.weightkamijast]);




    // const handleDetailInputChange = (e) => {
    //     const { name, value } = e.target;

    //     if (name === "carets") {
    //         const caretValue = value ? parseFloat(value) : 0;
    //         let updatedWeight = caretValue * 20;

    //         // Get weightkamijast as number without sign
    //         const adjustment = formData.weightkamijast
    //             ? parseFloat(formData.weightkamijast.replace("+", "").replace("-", "")) || 0
    //             : 0;

    //         if (formData.weightType === "min") {
    //             updatedWeight -= adjustment;
    //         } else if (formData.weightType === "max") {
    //             updatedWeight += adjustment;
    //         }

    //         setFormData({
    //             ...formData,
    //             [name]: value,
    //             weight: updatedWeight,
    //         });
    //     } else {
    //         setFormData({
    //             ...formData,
    //             [name]: value,
    //         });
    //     }
    // };





    // To fetch and Set RECEiptDataBill 

    const handleDetailInputChange = (e) => {
        const { name, value } = e.target;


        if (name === "carets") {
            const newCarets = Number(value || 0);

            // Calculate total carets excluding current row if editing
            const currentTotalCarets = tableData.reduce((acc, row) => {
                if (formData.bdaid && row.bdaid === formData.bdaid) return acc;
                return acc + Number(row.carets || 0);
            }, 0);

            const updatedTotalCarets = currentTotalCarets + newCarets;
            const carets = parseInt(checkcaretscount) + 10;
            if (updatedTotalCarets > carets) {
                const remainingCarets = carets - currentTotalCarets;

                Swal.fire({
                    icon: "error",
                    title: "जास्तीत जास्त जाळ्या टाकल्या आहेत",
                    html: `आपण आणखी फक्त ${remainingCarets} जाळ्या टाकू शकता.`,
                    confirmButtonText: "ठीक आहे",
                    allowOutsideClick: false,
                    allowEscapeKey: false
                });

                return; // Don't update formData if invalid
            }
        }

        if (name === "carets") {
            const caretValue = value ? parseFloat(value) : 0;
            let updatedWeight = caretValue * 20;

            // Get weightkamijast as number without sign
            const adjustment = formData.weightkamijast
                ? parseFloat(formData.weightkamijast.replace("+", "").replace("-", "")) || 0
                : 0;

            if (formData.weightType === "min") {
                updatedWeight -= adjustment;
            } else if (formData.weightType === "max") {
                updatedWeight += adjustment;
            }

            setFormData({
                ...formData,
                [name]: value,
                weight: updatedWeight,
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };


    // To fetch and Set RECEiptDataBill By Proceed
    useEffect(() => {

        if (BAID != "" || DATE != "") {
            const fetchReceiptDataBill = async () => {
                try {
                    const payload1 = {
                        "companyid": userdetail?.companyID ? userdetail.companyID : "",
                        "deptid": userdetail?.departmentID ? userdetail.departmentID : "",
                        "baid": BAID,
                        "date": userdetail.APPDT
                    };

                    const headers = {
                        "Content-Type": "application/json",
                        Accept: "*/*"
                    };

                    const response = await axios.post(
                        baseUrl.Url + "/backend/api/GET_RECEIPTDataBill",
                        payload1,
                        { headers }
                    );

                    if (response.status !== 200) throw new Error("Failed to fetch data");
                    let apiData = response.data[0];
                    setMasterData((prev) => ({
                        ...prev,
                        baid: apiData.baid,
                        Bill_Kramank: apiData.billno,
                        tokennumber: apiData.btokanno,
                        tarikh: convertToISODate(apiData.date),

                        maid: apiData.maid || "",
                        village_name: apiData.villagename,
                        mobilenumber: apiData.fcontactno,
                        vehiclenumber: apiData.vehno,
                        bankname: apiData.fbankname,
                        accountnumber: apiData.faccountno,
                        accountname: apiData.facconame,
                        ifsccode: apiData.fifsccode,
                        Aadhar: apiData.faddharno,
                        seva: apiData.seva,
                        ekunjali: apiData.totalcarets,
                        ekunwajan: apiData.totalweight,
                        gadibhade: apiData.vehicalrent,
                        ekunkharch: apiData.totalcost,
                        ekunrakkam: apiData.totalamount,
                        bakirakkam: apiData.remainingamount,

                    }));



                    //Set CARETS_COUNT in use state if validate total carets.
                    setCheckcaretscount(apiData.caretS_COUNT);
                    //Set Form Master Data (Customize based on what you need)

                    if (response.data.length > 0) {
                        const mappedProducts = response.data.map((item) => ({
                            bdaid: item.bdaid,
                            croptype: item.croptype,
                            vyapariname: item.vyapariname,
                            carets: item.jali,
                            weight: item.weight,
                            weightkamijast: item.weightminmax,
                            rate: item.rate,
                            amount: item.amount,
                            IsDeleted: item.isdeleted,

                        }));

                        console.log("Mapped Table Data on proceeedddddd:", mappedProducts);
                        console.log("Mapped Table Data on proceeedddddd:", mappedProducts);


                        setTableData(mappedProducts);
                        console.log('fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff', mappedProducts)
                    }


                    console.log("RECEIPTDataBill  Data:", masterData);
                } catch (error) {
                    console.error("Error in GET_RECEIPTDataBill API Call:", error);
                }
            };

            fetchReceiptDataBill();
        }
    }, [BAID, DATE]);


    // To fetch and Set RECEiptDataBillByToken
    const handleSearch = async (tokennumber) => {
        if (tokennumber) {
            try {
                const payload = {
                    btokanno: tokennumber,
                    date: userdetail.APPDT,
                    "companyid": userdetail?.companyID ? userdetail.companyID : "",
                    "deptid": userdetail?.departmentID ? userdetail.departmentID : "",
                };

                const headers = {
                    'Content-Type': 'application/json',
                    Accept: '*/*',
                };

                const response = await axios.post(
                    `${baseUrl.Url}/backend/api/GET_RECEIPTDataBillByToken`,
                    payload,
                    { headers }
                );

                if (response.status !== 200) throw new Error("Failed to fetch data");

                if (response.data.length === 0) {
                    tokennumberRef.current.focus();
                    Swal.fire({

                        icon: "error",
                        title: "टोकन सापडला नाही",
                        text: `टोकन क्र. ${tokennumber} अस्तित्वात नाही`,
                        allowOutsideClick: false,
                        allowEscapeKey: false

                    });

                    // 🔴 Token not found - clear data
                    setTableData([]);
                    setMasterData((prev) => ({
                        ...prev,
                        baid: "",
                        Bill_Kramank: "",
                        tokennumber: "",
                        tarikh: "",
                        maid: "",
                        village_name: "",
                        mobilenumber: "",
                        vehiclenumber: "",
                        bankname: "",
                        accountnumber: "",
                        accountname: "",
                        ifsccode: "",
                        Aadhar: "",
                        seva: "",
                        ekunjali: "",
                        ekunwajan: "",
                        gadibhade: "",
                        ekunkharch: "",
                        ekunrakkam: "",
                        bakirakkam: "",
                    }));



                    return;
                }

                let apiData = response.data[0];

                if (apiData.isvyapariverified != 1) {
                    Swal.fire({
                        icon: "error",
                        title: "मंजुरी आवश्यक आहे",
                        text: "कृपया व्यापाऱ्याची मंजुरी घ्या.",
                        confirmButtonText: "ठीक आहे",
                        allowOutsideClick: false,
                        allowEscapeKey: false
                    });
                    return;
                }

                setMasterData((prev) => ({
                    ...prev,
                    baid: apiData.baid,
                    Bill_Kramank: apiData.billno,
                    tokennumber: apiData.btokanno,
                    tarikh: convertToISODate(apiData.date),
                    maid: apiData.maid,
                    village_name: apiData.villagename,
                    mobilenumber: apiData.fcontactno,
                    vehiclenumber: apiData.vehno,
                    bankname: apiData.fbankname,
                    accountnumber: apiData.faccountno,
                    accountname: apiData.facconame,
                    ifsccode: apiData.fifsccode,
                    Aadhar: apiData.faddharno,
                    seva: apiData.seva,
                    ekunjali: apiData.totalcarets,
                    ekunwajan: apiData.totalweight,
                    gadibhade: apiData.vehicalrent,
                    ekunkharch: apiData.totalcost,
                    ekunrakkam: apiData.totalamount,
                    bakirakkam: apiData.remainingamount,
                }));
                prevTokenRef.current = tokennumber;
                isFormInitialized.current = true;

                //Set CARETS_COUNT in use state if validate total carets.
                setCheckcaretscount(apiData.caretS_COUNT);

                const mappedProducts = response.data.map((item) => ({
                    bdaid: item.bdaid,
                    croptype: item.croptype,
                    vyapariname: item.vyapariname,
                    carets: item.jali,
                    weight: item.weight,
                    weightkamijast: item.weightminmax,
                    rate: item.rate,
                    amount: item.amount,
                    IsDeleted: item.isdeleted,
                }));

                console.log("Mapped Table Data:", mappedProducts);
                setTableData(mappedProducts);

                console.log("RECEIPTDataBill  Data:", masterData);
            } catch (error) {
                console.error('Error fetching vendor data:', error);
            }
        }
    };


    // // fetch Get_VyapariDueData Data 
    const [vyapariDueData, setVyapariDueData] = useState([]);
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


    // // fetch Get_VyapariBillMaster Data 
    const [vyapariBillMaster, setVyapariBillMaster] = useState([]);

    useEffect(() => {
        if (billno != '') {
            const fetchVyapariBillMaster = async () => {
                try {
                    const payload = {
                        "billno": billno,
                    };
                    const headers = {
                        "Content-Type": "application/json",
                        Accept: "*/*",
                    };
                    const response = await axios.post(
                        `${baseUrl.Url}/backend/api/GET_VyapariBillMaster`,
                        payload,
                        { headers }
                    );
                    if (response.status !== 200)
                        throw new Error("Failed to fetch ");
                    console.log("GET_VyapariBillMaster", response.data)
                    setVyapariBillMaster(response.data);
                } catch (error) {
                    console.error("Error fetching GET_VyapariBillMaster data:", error);
                }
            };

            fetchVyapariBillMaster();
        }

    }, [billno]);
    console.log(vyapariBillMaster, "vyapariBillMaster check here");



    useEffect(() => {
        console.log("Updated masterData:", masterData);
    }, [masterData]);


    //Fetch shetakri as dropdown
    const [Farmer, setFarmer] = useState([]);

    useEffect(() => {
        const fetchFarmer = async () => {
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
                    throw new Error("Failed to fetch Farmer data");
                console.log("Farmer Detail", response.data)
                const data = response.data;
                const conuterData = data
                    .map(({ fname, faid }) => ({
                        label: fname,
                        value: faid
                    }));

                setFarmer(conuterData);


            } catch (error) {
                console.error("Error fetching Farmer data:", error);
            }
        };
        fetchFarmer();
    }, []);


    //fetch vyapari as drodown
    const [vyapari, setvyapari] = useState([]);
    useEffect(() => {
        const fetchCounter = async () => {
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
                setVyapariData(response.data);
            } catch (error) {
                console.error("Error fetching vendor data:", error);
            }
        };
        fetchCounter();
    }, []);


    //fetch croptype as drodown
    const [cropType, setCropType] = useState([]);
    useEffect(() => {

        const fetchImplications = async () => {
            try {
                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };

                const payload = { "companyid": "", "deptid": "" };

                const response = await axios.post(
                    `${baseUrl.Url}/backend/api/GETItemDropdown`,
                    payload,
                    { headers }
                );

                if (response.status !== 200) throw new Error("Failed to fetch Farmer data");
                const data = response.data;

                const implicationsDropdown = data.map(({ itemaid, itemnm }) => ({
                    label: itemnm,
                    value: itemaid,
                }));
                setCropType(implicationsDropdown);
            } catch (error) {
                console.error("Error fetching Farmer data:", error);
            }

        };
        fetchImplications();
    }, []);



    // Add row in details
    const addRecord = (e) => {
        e.preventDefault();

        // Validate each field and add error alert for empty fields or invalid patterns

        if (!formData.vyapariname) {
            vyaparinameRef.current.focus();
            Swal.fire({
                icon: "error",
                title: " व्यापाऱ्याचे पडताळणी त्रुटी",
                text: "कृपया व्यापाऱ्याचे नाव निवडा.",
                confirmButtonText: "ठीक आहे",
                allowOutsideClick: false,
                allowEscapeKey: false
            })
            return;
        }

        if (!formData.carets || !/^\d+$/.test(formData.carets) || formData.carets === "0") {
            caretsRef.current.focus();
            Swal.fire({
                icon: "error",
                title: "जाळ्यांची पडताळणी त्रुटी",
                text: "कृपया फक्त अंक भरावेत. सुरुवात व शेवटी स्पेस काढा.",
                confirmButtonText: "ठीक आहे",
                allowOutsideClick: false,
                allowEscapeKey: false
            })
            return;
        }

        if (!formData.weight || !/^\d+$/.test(formData.weight)) {
            Swal.fire({
                icon: "error",
                title: "वजनाची पडताळणी त्रुटी",
                text: "कृपया वजन फक्त अंकात भरा आणि ते (-)मायनस मधी नको .",
                confirmButtonText: "ठीक आहे",
                allowOutsideClick: false,
                allowEscapeKey: false
            })
            return;
        }

        if (formData.weightkamijast && +formData.weightkamijast > 19) {
            weightkamijastRef.current.focus();
            Swal.fire({
                icon: "error",
                title: "वजन कमी जास्त पडताळणी त्रुटी",
                text: "कृपया वजन कमी जास्त 0 ते 19 दरम्यान भरावे.",
                confirmButtonText: "ठीक आहे",
                allowOutsideClick: false,
                allowEscapeKey: false
            })
            return;
        }


        if (!formData.rate || !/^\d+$/.test(formData.rate) || +formData.rate === 0) {
            rateRef.current.focus();
            Swal.fire({
                icon: "error",
                title: "भाव तपासणी त्रुटी",
                text: "कृपया भाव प्रविष्ट करा, फक्त अंक असावेत, सुरुवातीस आणि शेवटी स्पेस काढा",
                allowOutsideClick: false,
                allowEscapeKey: false
            })
            return;
        }



        // // validation that if total_carets > GateEnry_carets .  
        // // Calculate total carets including current record
        // // Calculate total carets already present, excluding the row being edited (if any)
        // let currentTotalCarets = tableData.reduce((acc, row) => {
        //     // If editing, exclude the row being edited
        //     if (formData.bdaid && row.bdaid === formData.bdaid) return acc;
        //     return acc + Number(row.carets || 0);
        // }, 0);

        // const totalCaret = tableData.reduce((sum, item) => {
        //     return sum + parseInt(item.carets || 0, 10);
        // }, 0);

        // console.log(totalCaret); // Output: 22


        // // Convert form caret value to number
        // const newCarets = Number(formData.carets || 0);
        // const carets = parseInt(totalCaret) + 10;
        // // Check total if we add this row
        // const updatedTotalCarets = totalCaret + newCarets;

        // if (updatedTotalCarets > carets) {
        //     const remainingCarets = carets - totalCaret;

        //     Swal.fire({
        //         icon: "error",
        //         title: "केअरट मर्यादा ओलांडली",
        //         html: `तुम्ही आणखी फक्त ${remainingCarets} जाळ्या टाकू शकता.`,
        //         allowOutsideClick: false,
        //         allowEscapeKey: false
        //     });
        //     return;
        // }



        // Add the record if all fields are valid

        let updatedTableData;
        if (formData.bdaid) {
            updatedTableData = tableData.map((item) =>
                item.bdaid === formData.bdaid ? { ...item, ...formData, IsDeleted: 0 } : item
            );
        } else {
            updatedTableData = [...tableData, { ...formData, bdaid: ACSPLGUID.getNew(), IsDeleted: 0 }];
        }

        setTableData(updatedTableData);


        // If all fields are valid, add a success message
        // If all fields are valid, add a success message
        Swal.fire({
            icon: "success",
            title: "सेव्ह झाले!",
            text: "डेटा यशस्वीरित्या टेबलमध्ये जोडला गेला आहे!",
            confirmButtonText: "ठीक आहे",
            allowOutsideClick: false,
            allowEscapeKey: false
        }).then(() => {
            // Focus on the Save button after the Swal closes
            setTimeout(() => {
                saveRef.current?.focus(); // Set focus after Swal closes
            }, 300); // Ensure focus is applied after some time

            // Add an event listener for Enter key press to trigger save action
            const handleEnterKey = (e) => {
                if (e.key === "Enter") {
                    e.preventDefault(); // Prevent default form submission behavior
                    saveRef.current?.click(); // Simulate a click on the Save button
                }
            };

            // Attach the event listener to the Save button for Enter key press
            if (saveRef.current) {
                saveRef.current.addEventListener("keydown", handleEnterKey);
            }

            // Clean up the event listener when the component is unmounted or after Swal closes
            return () => {
                if (saveRef.current) {
                    saveRef.current.removeEventListener("keydown", handleEnterKey);
                }
            };
        });


        // Reset formData to clear the form, including dropdowns
        setFormData({
            croptype: "",
            vyapariname: "",
            carets: "",
            weight: "",
            weightkamijast: "0",
            rate: "",
            amount: "",
            IsDeleted: 0,

        });
        calculateTotals();
    };


    const handleEdit = (bdaid) => {
        const filteredProducts = tableData.filter((data) => data.bdaid == bdaid);

        // ✅ Define weightType from weightkamijast sign
        const weightType = filteredProducts[0].weightkamijast?.startsWith("+") ? "max" : "min";

        setFormData({
            bdaid: filteredProducts[0].bdaid,
            croptype: filteredProducts[0].croptype,
            vyapariname: filteredProducts[0].vyapariname,
            carets: filteredProducts[0].carets,
            weight: filteredProducts[0].weight,
            weightkamijast: filteredProducts[0].weightkamijast,
            rate: filteredProducts[0].rate,
            amount: filteredProducts[0].amount,
            IsDeleted: 0,
            weightType,
        });
    }

    const handleDelete = (bdaid, vbkid) => {
        Swal.fire({
            title: "तुम्हाला खात्री आहे का?",
            text: "तुम्ही हे बदलू शकणार नाही!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "हो, ते हटवा!",
            cancelButtonText: "रद्द करा",
        }).then((result) => {
            if (result.isConfirmed) {
                setTableData((prevData) => {
                    // const updatedData = prevData.map((data) =>
                    //     data.bdaid === bdaid ? { ...data, IsDeleted: 1 } : data
                    // );
                    const updatedData = prevData.map((data) =>
                        data.bdaid === bdaid && data.vbkid === vbkid
                            ? { ...data, IsDeleted: 1 } : data // Otherwise, keep the data unchanged
                    );


                    console.log("Updated Table Data:", updatedData);
                    return [...updatedData];  // Ensure state updates properly
                });

                Swal.fire({
                    icon: "success",
                    title: "हटवले!",
                    text: "रेकॉर्ड हटवले गेले आहे!",
                    confirmButtonText: "ठीक आहे",
                    allowOutsideClick: false,
                    allowEscapeKey: false
                });

                // Delay calculation to ensure state updates before recalculating
                setTimeout(() => {
                    calculateTotals();
                }, 100);
            }

        });
    };



    // By Reshma For Vyapari Dynamically servicess label 

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


    // By Reshma For Farmer Dynamically servicess label for   
    const [serviceData, setServiceData] = useState([]);
    useEffect(() => {
        const fetchFarmersServiceData = async () => {
            try {
                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };

                const payload = {
                    "shid": "",
                    "companyid": userdetail?.companyID ? userdetail.companyID : "",
                    "deptid": userdetail?.departmentID ? userdetail.departmentID : "",
                };

                const response = await axios.post(
                    `${baseUrl.Url}/backend/api/GET_FARMERSERVICE`, // Replace with actual API endpoint
                    payload,
                    { headers }
                );

                if (response.status !== 200) {
                    throw new Error("Failed to fetch farmers service data");
                }

                console.log("Farmers service details", response.data);

                const data = response.data;
                const serviceData = data.map(({ servicetypetitle, newrate, ratetype, pkid, ratetypetitle }) => {
                    return {
                        servicetypetitle,
                        newrate,
                        ratetype,
                        pkid,
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


    // By reshma calculation
    useEffect(() => {
        calculateTotals();
    }, [tableData, serviceData, masterData.ekunrakkam, masterData.ekunjali]);

    //  By reshma calculate Total
    const calculateTotals = () => {
        let totalJali = 0;
        let totalWeight = 0;
        let totalAmount = 0;
        let totalServiceRate = 0;
        let baki = 0;


        const filteredData = tableData.filter(row => !row.IsDeleted);
        console.log("filteredData", filteredData)
        filteredData.forEach((row) => {
            totalJali += parseInt(row.carets) || 0;
            totalWeight += parseFloat(row.weight) || 0;
            const rowTotalPrice = (parseFloat(row.rate) / 20) * parseFloat(row.weight);
            totalAmount += rowTotalPrice;
        });

        serviceData.forEach((service) => {
            const calculatedRate = calculateServiceRate(service, masterData);
            totalServiceRate += calculatedRate;
        });

        baki = parseFloat(totalAmount) - totalServiceRate;

        console.log("Total Amount:", totalAmount.toFixed(2));
        console.log("Total Service Rate:", totalServiceRate.toFixed(2));
        console.log("Remaining Amount (Baki):", baki.toFixed(2));

        setMasterData((prevFormData) => ({
            ...prevFormData,
            ekunjali: totalJali,
            ekunwajan: Math.round(totalWeight),
            ekunrakkam: Math.round(totalAmount),
            bakirakkam: Math.round(baki),
            ekunkharch: Math.round(totalServiceRate),
        }));
    };


    // //  By reshma service rate calculation
    const calculateServiceRate = (service, masterData) => {
        let calculatedRate = 0;

        if (service.ratetype === "1" || service.ratetype === "3") {
            if (service.ratetype === "1") {
                calculatedRate = (service.newrate / 100) * parseFloat(masterData.ekunrakkam);
            } else if (service.ratetype === "3") {
                calculatedRate = service.newrate * parseFloat(masterData.ekunjali);
            }
        } else if (service.ratetype === "0") {
            calculatedRate = service.newrate;
        }

        return calculatedRate;
    };

    //By Reshma Calculateserviceratefor Vayapri
    const calculateServiceRatevyapri = (service, totalAmount, carets) => {
        let calculatedRate = 0;

        if (service.ratetype === "1" || service.ratetype === "3") {
            if (service.ratetype === "1") {
                calculatedRate = (service.newrate / 100) * totalAmount;
            } else if (service.ratetype === "3") {
                calculatedRate = service.newrate * carets;
            }
        } else if (service.ratetype === "0") {
            calculatedRate = service.newrate;
        }

        return calculatedRate;
    };


    // payload for form Save
    // const handlePayloadSubmition = async () => {
    //     console.log("table Data Submitted from  handlePayloadSubmition:", tableData);
    //     console.log("Master part Submitted from handlePayloadSubmition:", masterData);
    //     try {

    //         // Prepare payload1 for master data save
    //         const payload1 = {
    //             "baid": BAID ? BAID : GUID,
    //             "billno": masterData.Bill_Kramank,
    //             "btokanno": masterData.tokennumber,
    //             "date": masterData.tarikh,

    //             "maid": masterData.maid,
    //             "villagename": masterData.village_name,
    //             "phonenumber": masterData.mobilenumber,
    //             "vehicleno": masterData.vehiclenumber,
    //             "bankname": masterData.bankname,
    //             "accno": masterData.accountnumber,
    //             "accname": masterData.accountname,
    //             "ifsccode": masterData.ifsccode,
    //             "aadharno": masterData.Aadhar,
    //             "seva": serviceData.map((service) => {
    //                 const calculatedRate = calculateServiceRate(service, masterData);
    //                 return `${service.pkid}_${calculatedRate.toFixed(2)}`;
    //                 // return `${service.servicetype}:${calculatedRate.toFixed(2)}`;
    //             }).join(", "),
    //             "totalcarets": masterData.ekunjali,
    //             "totalweight": masterData.ekunwajan,
    //             "vehicalrent": masterData.gadibhade,
    //             "totalamount": masterData.ekunrakkam,
    //             "totalcost": masterData.ekunkharch,
    //             "remainingamount": masterData.bakirakkam,
    //             "trntid": masterData.trntid,
    //             "companyid": userdetail?.companyID ? userdetail.companyID : "",
    //             "deptid": userdetail?.departmentID ? userdetail.departmentID : "",
    //         };

    //         console.log("Payload1 after processing arrays:", payload1);

    //         const headers = {
    //             "Content-Type": "application/json",
    //             Accept: "*/*",
    //         };

    //         // First API call to save the quotation master
    //         await axios({
    //             method: "POST",
    //             url: baseUrl.Url + "/backend/api/SP_AddUpdRECEIPTMaster",
    //             data: JSON.stringify(payload1),
    //             headers: headers,
    //         });

    //         // Prepare payload for detail data
    //         const Payload2 = tableData.map((detail) => ({

    //             "bdaid": detail.bdaid ? detail.bdaid : ACSPLGUID.getNew(),
    //             "baid": BAID ? BAID : GUID,
    //             "croptype": detail.croptype,
    //             "vyapariname": detail.vyapariname,
    //             "jali": detail.carets,
    //             "weight": detail.weight,
    //             "weightminmax": detail.weightkamijast,
    //             "rate": detail.rate,
    //             "amount": detail.weight * (detail.rate / 20),
    //             "isdeleted": detail.IsDeleted === 1 || detail.IsDeleted === true ? true : false,
    //             "companyid": userdetail?.companyID ? userdetail.companyID : "",
    //             "deptid": userdetail?.departmentID ? userdetail.departmentID : "",

    //         }));
    //         console.log("Payload2:", Payload2);


    //         await axios({
    //             method: "POST",
    //             url: baseUrl.Url + "/backend/api/SP_AddUpdRECEIPTDetails",
    //             data: JSON.stringify(Payload2),
    //             headers: headers,
    //         });

    //         // Prepare payload for Auction master  data
    //         const payload3 = {
    //             "apkid": BAID ? BAID : GUID,
    //             "token": masterData.tokennumber,
    //             "billno": masterData.Bill_Kramank,
    //             "date": masterData.tarikh,
    //             "maid": masterData.maid,
    //             "village": masterData.village_name,
    //             "seva": serviceData.map((service) => {
    //                 const calculatedRate = calculateServiceRate(service, masterData);
    //                 return `${service.pkid}_${calculatedRate.toFixed(2)}`;
    //                 // return `${service.servicetype}:${calculatedRate.toFixed(2)}`;
    //             }).join(", "),
    //             "totaljali": masterData.ekunjali,
    //             "totalweight": masterData.ekunwajan,
    //             "totalamount": masterData.ekunrakkam,
    //             "remainingamount": masterData.bakirakkam,
    //             "companyid": userdetail?.companyID ? userdetail.companyID : "",
    //             "deptid": userdetail?.departmentID ? userdetail.departmentID : "",
    //         };

    //         console.log("Payload3 after processing arrays:", payload3);

    //         await axios({
    //             method: "POST",
    //             url: baseUrl.Url + "/backend/api/SP_AddUpdAuctionshedMasterByBill",
    //             data: JSON.stringify(payload3),
    //             headers: headers,
    //         });



    //         // Prepare payload for Auction detail data
    //         const Payload4 = tableData.map((detail) => ({

    //             "dpkid": detail.bdaid ? detail.bdaid : ACSPLGUID.getNew(),
    //             "apkid": BAID ? BAID : GUID,
    //             "vyapari": detail.vyapariname,
    //             "jaali": detail.carets,
    //             "weight": detail.weightkamijast,
    //             "weightless": detail.weight,
    //             "rate": detail.rate,
    //             "isdeleted": detail.IsDeleted === 1 || detail.IsDeleted === true ? true : false,
    //             "companyid": userdetail?.companyID ? userdetail.companyID : "",
    //             "deptid": userdetail?.departmentID ? userdetail.departmentID : "",


    //         }));
    //         console.log("Payload4:", Payload4);


    //         await axios({
    //             method: "POST",
    //             url: baseUrl.Url + "/backend/api/SP_AddUpdAuctionShedDeatilByBill",
    //             data: JSON.stringify(Payload4),
    //             headers: headers,
    //         });


    //         // // Prepare payload for Vyapari Master data

    //         const payload5 = tableData.map((item) => {
    //             const existing = vyapariBillMaster.find(bill =>
    //                 bill.apkid === payload1.baid &&
    //                 bill.billno === masterData.Bill_Kramank &&
    //                 bill.vyapariname === item.vyapariname

    //             );
    //             const totalAmount = (item.rate / 20) * item.weight;
    //             const totalLoss = vayapriserviceData.reduce((sum, s) => sum + calculateServiceRatevyapri(s, totalAmount, item.carets), 0);


    //             console.log("++++++++++vyapariBillMaster", vyapariBillMaster)
    //             console.log("++++++++++existing", existing)
    //             return {
    //                 vbkid: existing ? existing.vbkid : ACSPLGUID.getNew(), // unique per row
    //                 billno: masterData.Bill_Kramank,
    //                 apkid: payload1.baid,
    //                 date: masterData.tarikh,
    //                 Vyapariname: item.vyapariname,
    //                 totaljaali: parseInt(item.carets) || 0,
    //                 totalweight: parseFloat(item.weight),
    //                 totalamount: parseFloat(totalAmount),
    //                 //  seva: vayapriserviceData.map((s) => `${s.pkid}_${calculateServiceRate(s, masterData).toFixed(2)}`).join(", "),
    //                 seva: vayapriserviceData.map((s) => `${s.pkid}_${calculateServiceRatevyapri(s, totalAmount, item.carets).toFixed(2)}`).join(", "),
    //                 totalloss: parseFloat(totalLoss),
    //                 remainingamount: Math.round(totalAmount + totalLoss),
    //                 isdeleted: item.IsDeleted === 1 || item.IsDeleted === true ? true : false,

    //                 companyid: userdetail?.companyID || "",
    //                 deptid: userdetail?.departmentID || "",
    //             };
    //         });

    //         console.log("Payload5 after processing arrays:", payload5);

    //         await axios({
    //             method: "POST",
    //             url: baseUrl.Url + "/backend/api/SP_AddUpdVyapariBillMasterByBill",
    //             data: JSON.stringify(payload5),
    //             headers: headers,
    //         });



    //         // Prepare payload for Vyapari detail data
    //         // const Payload6 = tableData.map((detail) => ({

    //         //     "dvbid": detail.bdaid ? detail.bdaid : ACSPLGUID.getNew(),
    //         //     "vbkid": BAID ? BAID : GUID,
    //         //     "croptype": detail.croptype,
    //         //     "farmername": masterData.maid,
    //         //     "jaali": detail.carets,
    //         //     "weight": detail.weight,
    //         //     "weightdiffrence": detail.weightkamijast,
    //         //     "rate": detail.rate,
    //         //     "totalamount": detail.weight * (detail.rate / 20),
    //         //     "companyid": userdetail?.companyID ? userdetail.companyID : "",
    //         //     "deptid": userdetail?.departmentID ? userdetail.departmentID : "",

    //         // }));

    //         // === Prepare payload for Vyapari Bill Detail ===

    //         const Payload6 = tableData.map((detail) => {
    //             const matchedMaster = payload5.find(master =>
    //                 master.Vyapariname === detail.vyapariname &&
    //                 master.apkid === payload1.baid &&
    //                 master.billno === masterData.Bill_Kramank
    //             );

    //             return {
    //                 dvbid: detail.bdaid ? detail.bdaid : ACSPLGUID.getNew(),
    //                 vbkid: matchedMaster ? matchedMaster.vbkid : ACSPLGUID.getNew(), // correct foreign key
    //                 croptype: detail.croptype,
    //                 farmername: masterData.maid,
    //                 jaali: detail.carets,
    //                 weight: detail.weight,
    //                 weightdiffrence: detail.weightkamijast,
    //                 rate: detail.rate,
    //                 totalamount: detail.weight * (detail.rate / 20),
    //                 isdeleted: detail.IsDeleted === 1 || detail.IsDeleted === true ? true : false,
    //                 companyid: userdetail?.companyID || "",
    //                 deptid: userdetail?.departmentID || "",
    //             };
    //         });
    //         console.log("Payload6:", Payload6);


    //         await axios({
    //             method: "POST",
    //             url: baseUrl.Url + "/backend/api/SP_AddUpdVyapariBillDetailByBill",
    //             data: JSON.stringify(Payload6),
    //             headers: headers,
    //         });


    //         // Prepare payload for tblvyapariDue table data
    //         const payload7 = tableData.map((item) => {


    //             const existing = vyapariDueData.find(due =>
    //                 due.refkey === (BAID ? BAID : GUID) &&
    //                 due.vpaid === item.vyapariname &&
    //                 due.trntid === "10"
    //             );
    //             return {
    //                 vdaid: existing ? existing.vdaid : ACSPLGUID.getNew(), // use existing ID if updating
    //                 trndt: masterData.tarikh,
    //                 tamt: item.amount,
    //                 vpaid: item.vyapariname,
    //                 trnsr: "",
    //                 trntid: "10",
    //                 refkey: BAID ? BAID : GUID,
    //                 isdeleted: item.IsDeleted === 1 || item.IsDeleted === true ? true : false,
    //             }
    //         });
    //         console.log("Payload7", payload7);

    //         await axios({
    //             method: "POST",
    //             url: baseUrl.Url + "/backend/api/SP_InsertVyapariDueData",
    //             data: JSON.stringify(payload7),
    //             headers: headers,
    //         });


    //         Swal.fire({
    //             icon: "success",
    //             title: "Saved!",
    //             text: "Data saved successfully.",
    //             confirmButtonText: "OK",
    //         }).then(() => {

    //             setMasterData({
    //                 ...masterData, // Keep existing token number if needed
    //                 tokennumber: "",
    //                 Bill_Kramank: "",
    //                 tarikh: "",
    //                 maid: "",
    //                 village_name: "",
    //                 mobilenumber: "",
    //                 vehiclenumber: "",
    //                 bankname: "",
    //                 accountnumber: "",
    //                 accountname: "",
    //                 ifsccode: "",
    //                 Aadhar: "",
    //                 ekunjali: "",
    //                 ekunwajan: "",
    //                 gadibhade: "",
    //                 ekunrakkam: "",
    //                 ekunkharch: "",
    //                 bakirakkam: "",
    //                 trntid: "",
    //             });

    //             setFormData({
    //                 ...formData,
    //                 croptype: "",
    //                 vyapariname: "",
    //                 carets: "",
    //                 weight: "",
    //                 weightkamijast: "",
    //                 rate: "",
    //                 amount: "",
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

    // payload for form Save
    const handlePayloadSubmition = async () => {
        console.log("table Data Submitted from  handlePayloadSubmition:", tableData);
        console.log("Master part Submitted from handlePayloadSubmition:", masterData);
        try {
            // Prepare payload1 for master data save
            const payload1 = {
                "baid": masterData.baid ? masterData.baid : ACSPLGUID.getNew(),
                "billno": masterData.Bill_Kramank,
                "btokanno": masterData.tokennumber,
                "date": masterData.tarikh,

                "maid": masterData.maid,
                "villagename": masterData.village_name,
                "phonenumber": masterData.mobilenumber,
                "vehicleno": masterData.vehiclenumber,
                "bankname": masterData.bankname,
                "accno": masterData.accountnumber,
                "accname": masterData.accountname,
                "ifsccode": masterData.ifsccode,
                "aadharno": masterData.Aadhar,
                "seva": serviceData.map((service) => {
                    const calculatedRate = calculateServiceRate(service, masterData);
                    return `${service.pkid}_${Math.round(calculatedRate)}`;
                    // return `${service.servicetype}:${calculatedRate.toFixed(2)}`;
                }).join(", "),
                "totalcarets": masterData.ekunjali,
                "totalweight": masterData.ekunwajan,
                "vehicalrent": masterData.gadibhade,
                "totalamount": Math.round(masterData.ekunrakkam),
                "totalcost": masterData.ekunkharch,
                "remainingamount": masterData.bakirakkam,
                "trntid": masterData.trntid,
                "uaid": userdetail?.uaid ? userdetail.uaid : "",
                "companyid": userdetail?.companyID ? userdetail.companyID : "",
                "deptid": userdetail?.departmentID ? userdetail.departmentID : "",

            };
            console.log("Payload1 after processing arrays:", payload1);
            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };
            // First API call to save the quotation master
            await axios({
                method: "POST",
                url: baseUrl.Url + "/backend/api/SP_AddUpdRECEIPTMaster",
                data: JSON.stringify(payload1),
                headers: headers,
            });
            // Prepare payload for detail data
            const Payload2 = tableData.map((detail) => ({
                "bdaid": detail.bdaid ? detail.bdaid : ACSPLGUID.getNew(),
                "baid": masterData.baid ? masterData.baid : ACSPLGUID.getNew(),
                "croptype": detail.croptype,
                "vyapariname": detail.vyapariname,
                "jali": detail.carets,
                "weight": detail.weight,
                "weightminmax": detail.weightkamijast,
                "rate": detail.rate,
                "amount": Math.round(detail.weight * (detail.rate / 20)),
                "isdeleted": detail.IsDeleted === 1 || detail.IsDeleted === true ? true : false,
                "uaid": userdetail?.uaid ? userdetail.uaid : "",
                "companyid": userdetail?.companyID ? userdetail.companyID : "",
                "deptid": userdetail?.departmentID ? userdetail.departmentID : "",
            }));
            console.log("Payload2:", Payload2);
            await axios({
                method: "POST",
                url: baseUrl.Url + "/backend/api/SP_AddUpdRECEIPTDetails",
                data: JSON.stringify(Payload2),
                headers: headers,
            });
            // Prepare payload for Auction master  data
            const payload3 = {
                "apkid": masterData.baid ? masterData.baid : ACSPLGUID.getNew(),
                "token": masterData.tokennumber,
                "billno": masterData.Bill_Kramank,
                "date": masterData.tarikh,
                "maid": masterData.maid,
                "village": masterData.village_name,
                "seva": serviceData.map((service) => {
                    const calculatedRate = calculateServiceRate(service, masterData);
                    return `${service.pkid}_${Math.round(calculatedRate)}`;
                    // return `${service.servicetype}:${calculatedRate.toFixed(2)}`;
                }).join(", "),
                "totaljali": masterData.ekunjali,
                "totalweight": masterData.ekunwajan,
                "totalamount": Math.round(masterData.ekunrakkam),
                "remainingamount": Math.round(masterData.bakirakkam),
                "uaid": userdetail?.uaid ? userdetail.uaid : "",
                "companyid": userdetail?.companyID ? userdetail.companyID : "",
                "deptid": userdetail?.departmentID ? userdetail.departmentID : "",
            };
            console.log("Payload3 after processing arrays:", payload3);
            await axios({
                method: "POST",
                url: baseUrl.Url + "/backend/api/SP_AddUpdAuctionshedMasterByBill",
                data: JSON.stringify(payload3),
                headers: headers,
            });
            // Prepare payload for Auction detail data
            const Payload4 = tableData.map((detail) => ({
                "dpkid": detail.bdaid ? detail.bdaid : ACSPLGUID.getNew(),
                "apkid": masterData.baid ? masterData.baid : ACSPLGUID.getNew(),
                "vyapari": detail.vyapariname,
                "jaali": detail.carets,
                "weight": detail.weightkamijast,
                "weightless": detail.weight,
                "rate": Math.round(detail.rate),
                "isdeleted": detail.IsDeleted === 1 || detail.IsDeleted === true ? true : false,
                "companyid": userdetail?.companyID ? userdetail.companyID : "",
                "deptid": userdetail?.departmentID ? userdetail.departmentID : "",
            }));
            console.log("Payload4:", Payload4);
            await axios({
                method: "POST",
                url: baseUrl.Url + "/backend/api/SP_AddUpdAuctionShedDeatilByBill",
                data: JSON.stringify(Payload4),
                headers: headers,
            });
            // // Prepare payload for Vyapari Master data
            const payload5 = tableData.map((item) => {
                const existing = vyapariBillMaster.find(bill =>
                    bill.apkid === payload1.baid &&
                    bill.billno === masterData.Bill_Kramank &&
                    bill.vyapariname === item.vyapariname &&
                    bill.vbkid === item.bdaid

                );
                const totalAmount = (item.rate / 20) * item.weight;
                const totalLoss = vayapriserviceData.reduce((sum, s) => sum + calculateServiceRatevyapri(s, totalAmount, item.carets), 0);

                console.log("++++++++++vyapariBillMaster", vyapariBillMaster)
                console.log("++++++++++existing", existing)
                return {
                    vbkid: existing ? existing.vbkid : item.bdaid,
                    billno: masterData.Bill_Kramank,
                    apkid: payload1.baid,
                    date: masterData.tarikh,
                    Vyapariname: item.vyapariname,
                    totaljaali: parseInt(item.carets) || 0,
                    totalweight: parseFloat(item.weight),
                    totalamount: Math.round(parseFloat(totalAmount)),
                    //  seva: vayapriserviceData.map((s) => `${s.pkid}_${calculateServiceRate(s, masterData).toFixed(2)}`).join(", "),
                    seva: vayapriserviceData.map((s) => `${s.pkid}_${Math.round(calculateServiceRatevyapri(s, totalAmount, item.carets))}`).join(", "),
                    totalloss: Math.round(parseFloat(totalLoss)),
                    remainingamount: Math.round(totalAmount + totalLoss),
                    isdeleted: item.IsDeleted === 1 || item.IsDeleted === true ? true : false,
                    uaid: userdetail?.uaid ? userdetail.uaid : "",
                    companyid: userdetail?.companyID || "",
                    deptid: userdetail?.departmentID || "",
                };
            });

            console.log("Payload5 after processing arrays:", payload5);

            await axios({
                method: "POST",
                url: baseUrl.Url + "/backend/api/SP_AddUpdVyapariBillMasterByBill",
                data: JSON.stringify(payload5),
                headers: headers,
            });

            const Payload6 = tableData.map((detail) => {
                const matchedMaster = payload5.find(master =>
                    master.Vyapariname === detail.vyapariname &&
                    master.apkid === payload1.baid &&
                    master.billno === masterData.Bill_Kramank
                );

                return {
                    dvbid: detail.bdaid ? detail.bdaid : ACSPLGUID.getNew(),
                    vbkid: matchedMaster ? matchedMaster.vbkid : ACSPLGUID.getNew(), // correct foreign key
                    croptype: detail.croptype,
                    farmername: masterData.maid,
                    jaali: detail.carets,
                    weight: detail.weight,
                    weightdiffrence: detail.weightkamijast,
                    rate: detail.rate,
                    totalamount: Math.round(detail.weight * (detail.rate / 20)),
                    isdeleted: detail.IsDeleted === 1 || detail.IsDeleted === true ? true : false,
                    companyid: userdetail?.companyID || "",
                    deptid: userdetail?.departmentID || "",
                };
            });
            console.log("Payload6:", Payload6);
            await axios({
                method: "POST",
                url: baseUrl.Url + "/backend/api/SP_AddUpdVyapariBillDetailByBill",
                data: JSON.stringify(Payload6),
                headers: headers,
            });
            const payload7 = tableData.map((item) => {
                const existing = vyapariDueData.find(due =>
                    due.refkey === (masterData.baid ? masterData.baid : ACSPLGUID.getNew()) &&
                    due.vpaid === item.vyapariname &&
                    due.trntid === "10"
                );
                const totalAmount = (item.rate / 20) * item.weight;
                return {
                    vdaid: existing ? existing.vdaid : ACSPLGUID.getNew(), // use existing ID if updating
                    trndt: formatDate(masterData.tarikh),
                    tamt: Math.round(item.amount),
                    vpaid: item.vyapariname,
                    trnsr: "",
                    trntid: "10",
                    refkey: masterData.baid ? masterData.baid : ACSPLGUID.getNew(),
                    isdeleted: item.IsDeleted === 1 || item.IsDeleted === true ? true : false,
                    uaid: userdetail?.uaid ? userdetail.uaid : "",
                    vreff: "",
                    seva: vayapriserviceData.map((s) => `${s.pkid}_${Math.round(calculateServiceRatevyapri(s, totalAmount, item.carets))}`).join(", "),
                }
            });
            console.log("Payload7", payload7);

            await axios({
                method: "POST",
                url: baseUrl.Url + "/backend/api/SP_InsertVyapariDueData",
                data: JSON.stringify(payload7),
                headers: headers,
            });

            const payload8 = {
                "uaid": userdetail?.uaid ? userdetail.uaid : "",
                "VoucherAmount": Math.round(masterData.bakirakkam),
                "VREFF": masterData.baid ? masterData.baid : ACSPLGUID.getNew(),
                "MAID": masterData.maid,
                "OrganizationID": userdetail?.companyID ? userdetail.companyID : "",
                "DivisionID": userdetail?.departmentID ? userdetail.departmentID : "",
                "VoucherDate": new Date().toISOString().split('T')[0],
                "SEVA": serviceData.map((service) => {
                    const calculatedRate = calculateServiceRate(service, masterData);
                    return `${service.pkid}_${Math.round(calculatedRate)}`;
                }).join(", "),
                "OID": "20",
                "farmeracc": Accounts.FARMERACC
            };

            console.log("Payload8", payload8);

            await axios({
                method: "POST",
                url: baseUrl.Url + "/backend/api/SP_FarmerBillVoucher",
                data: JSON.stringify(payload8),
                headers: headers,
            });

            const payload9 = tableData.map((item) => {
                const totalAmount = (item.rate / 20) * item.weight;
                const totalLoss = vayapriserviceData.reduce((sum, s) => sum + calculateServiceRatevyapri(s, totalAmount, item.carets), 0);

                return {
                    "uaid": userdetail?.uaid ? userdetail.uaid : "",
                    "VoucherAmount": Math.round(totalAmount),
                    "VREFF": masterData.baid ? masterData.baid : ACSPLGUID.getNew(),
                    "MAID": item.vyapariname,
                    "OrganizationID": userdetail?.companyID ? userdetail.companyID : "",
                    "DivisionID": userdetail?.departmentID ? userdetail.departmentID : "",
                    "VoucherDate": new Date().toISOString().split('T')[0],
                    "seva": vayapriserviceData.map((s) => `${s.pkid}_${Math.round(calculateServiceRatevyapri(s, totalAmount, item.carets))}`).join(", "),
                    "OID": "30",
                    "vyapariacc": Accounts.VYAPARIACC
                };
            });

            console.log("Payload9", payload9);

            await axios({
                method: "POST",
                url: baseUrl.Url + "/backend/api/SP_VyapariBillVoucher",
                data: JSON.stringify(payload9),
                headers: headers,
            });

            Swal.fire({
                icon: 'success',
                title: 'यशस्वी!',
                text: 'माहिती यशस्वीरित्या जतन झाली आहे.',
                confirmButtonText: 'ठीक आहे'

            }).then(async () => {
                setMasterData({
                    ...masterData,
                    baid: "",
                    tokennumber: "",
                    Bill_Kramank: "",
                    tarikh: "",
                    maid: "",
                    village_name: "",
                    mobilenumber: "",
                    vehiclenumber: "",
                    bankname: "",
                    accountnumber: "",
                    accountname: "",
                    ifsccode: "",
                    Aadhar: "",
                    ekunjali: "",
                    ekunwajan: "",
                    gadibhade: "",
                    ekunrakkam: "",
                    ekunkharch: "",
                    bakirakkam: "",
                    trntid: "",
                });

                setFormData({
                    ...formData,
                    croptype: "",
                    vyapariname: "",
                    carets: "",
                    weight: "",
                    weightkamijast: "",
                    rate: "",
                    amount: "",
                });

                setTableData([]);
                try {
                    const whatsappPayload = tableData.map((item) => {
                        const existing = vyapariBillMaster.find(bill =>
                            bill.apkid === payload1.baid &&
                            bill.billno === masterData.Bill_Kramank &&
                            bill.vyapariname === item.vyapariname &&
                            bill.vbkid === item.bdaid
                        );
                        const totalAmount = (item.rate / 20) * item.weight;
                        const totalLoss = vayapriserviceData.reduce((sum, s) =>
                            sum + calculateServiceRatevyapri(s, totalAmount, item.carets), 0);

                        const vyaparidata = VyapariData.filter(row => row.vpaid == item.vyapariname);

                        return {
                            date: userdetail.APPDT,
                            caretcount: item.carets?.toString() || "0",
                            totalweight: item.weight?.toString() || "0",
                            totalrate: item.rate?.toString() || "0",
                            bankname: vyaparidata[0]?.vbankname || "",
                            accountno: vyaparidata[0]?.vaccountname || "",
                            ifsccode: vyaparidata[0]?.vifsccode || "",
                            accountname: vyaparidata[0]?.vaccountname || "",
                            // mobile: vyaparidata[0]?.vmobile || "8308180550",
                            mobile: "9545809149",
                            vname: vyaparidata[0]?.vname || "vyapari",
                            headerUrl: ""
                        };
                    });

                    // Aggregates from tableData
                    const totalWeight = tableData.reduce((sum, item) => sum + (item.weight || 0), 0);
                    const totalRate = tableData.reduce((sum, item) => sum + (item.rate || 0), 0);
                    const highestRate = Math.max(...tableData.map(item => item.rate || 0));
                    const lowestRate = Math.min(...tableData.map(item => item.rate || 0));
                    const croptype = tableData[0]?.croptype || "";
                    const cropType1 = cropType.find(item => item.value === croptype)?.label || "";


                    const farmerwpmsg = [{
                        croptype: cropType1,
                        date: userdetail.APPDT,
                        totaljali: masterData.ekunjali.toString(),
                        totalweight: totalWeight.toString(),
                        toprate: highestRate.toString(),
                        bottomrate: lowestRate.toString(),
                        totalrate: masterData.ekunrakkam.toString(),
                        mobile: "9545809149", // or use masterData.mobilenumber
                        headerUrl: ""
                    }];

                    console.log("✅ whatsappPayload:", whatsappPayload);
                    console.log("✅ farmerwpmsg:", farmerwpmsg);

                    const whatsappSendRes = await axios.post(
                        `${baseUrl.Url}/backend/billpdf/sendWhatsappMessages`,
                        whatsappPayload,
                        { headers: { "Content-Type": "application/json" } }
                    );

                    const whatsappSendFARMER = await axios.post(
                        `${baseUrl.Url}/backend/api/FarmerBill/sendMessages`,
                        farmerwpmsg,
                        { headers: { "Content-Type": "application/json" } }
                    );

                    if (whatsappSendRes?.status === 200 && whatsappSendFARMER?.status === 200) {
                        console.log("✅ WhatsApp मेसेज यशस्वीरित्या पाठवले.");

                        const fileupdate = tableData.map((item) => {
                            const existing = vyapariBillMaster.find(bill =>
                                bill.apkid === payload1.baid &&
                                bill.billno === masterData.Bill_Kramank &&
                                bill.vyapariname === item.vyapariname &&
                                bill.vbkid === item.bdaid
                            );
                            const vyaparidata = VyapariData.find(row => row.vpaid == item.vyapariname);
                            return {
                                vbkid: existing ? existing.vbkid : item.bdaid,
                                billpdfid: whatsappSendRes?.data?.result?.find(r => r.mobile === vyaparidata?.vmobile)?.pdfLink || ""
                            };
                        });

                        const forbill = [{
                            "baid": masterData.baid ? masterData.baid : ACSPLGUID.getNew(),
                            "billpdfid": whatsappSendFARMER?.data?.result?.[0]?.pdfLink || ""
                        }];

                        const fileupdateRes = await axios.post(
                            `${baseUrl.Url}/backend/api/SP_UpdateVyapariBillMaster`,
                            fileupdate,
                            { headers: { "Content-Type": "application/json" } }
                        );

                        const fileupdateResfarmer = await axios.post(
                            `${baseUrl.Url}/backend/api/SP_UpdateRECEIPTMaster`,
                            forbill,
                            { headers: { "Content-Type": "application/json" } }
                        );

                        if (fileupdateRes?.status === 200 && fileupdateResfarmer?.status === 200) {
                            console.log("✅ फाईल अपडेट यशस्वी");
                        }
                    } else {
                        console.error("❌ WhatsApp API response did not indicate success:", whatsappSendRes.data);
                    }
                } catch (whatsappError) {
                    console.error("❌ WhatsApp मेसेज पाठवण्यात अयशस्वी:", whatsappError.response?.data || whatsappError.message);
                    Swal.fire({
                        icon: 'error',
                        title: 'त्रुटी!',
                        text: 'WhatsApp मेसेज पाठवण्यात अयशस्वी झाला. कृपया पुन्हा प्रयत्न करा.',
                        confirmButtonText: 'ठीक आहे'
                    });
                }
            }).catch((error) => {
                console.error("Submission Error:", error);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Failed to save data. Please try again.",
                });
            });

        } catch (error) {
            console.error("Submission Error:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to save data. Please try again.",
            });
        }

    };

    const handleSubmit = (e) => {
        e.preventDefault(e);

        // Check if there are records in the details table
        if (tableData.length === 0) {
            Swal.fire({
                icon: "error",
                title: "तपशील टेबलची प्रमाणीकरण त्रुटी",
                text: "सेव्ह करण्यापूर्वी तपशील टेबलमध्ये किमान एक नोंद जोडा.",
                allowOutsideClick: false,
                allowEscapeKey: false
            })
            return;
        }

        // checking if GateEntry carets count == forms totla carets. 
        // const totalCaretsOnSave = tableData.reduce((acc, row) => {
        //     return acc + Number(row.carets || 0);
        // }, 0);

        // if (totalCaretsOnSave < checkcaretscount) {
        //     const remainingCarets = checkcaretscount - totalCaretsOnSave;

        //     Swal.fire({
        //         icon: "warning",
        //         title: "Missing Carets",
        //         html: `You have added only <b>${totalCaretsOnSave}</b> carets.<br/><br/>
        //         You are still missing <b>${remainingCarets}</b> carets.`,
        //     });

        //     return; // Stop save
        // }

        showConfirmationAlert(e);

        console.log("table Data Submitted:", tableData);
        console.log("Master part Submitted:", masterData);
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



    // // validation on C+S only for master inputs
    const validateinput = (e) => {
        const { tokennumber, Aadhar, bankname, accountnumber, accountname, ifsccode } = masterData;
        if (!tokennumber) {
            Swal.fire({
                icon: "error",
                title: "प्रमाणीकरण त्रुटी",
                text: "टोकन नंबर आवश्यक आहे.",
                allowOutsideClick: false,
                allowEscapeKey: false
            }).then(() => {
                tokennumberRef.current.focus();
            });
            return;
        }

        if (bankname && !/^(?!\s*$)[A-Za-z\s]+$/.test(bankname)) {

            Swal.fire({
                icon: "error",
                title: "प्रमाणीकरण त्रुटी",
                text: "बँक नाव फक्त अक्षर असावेत.",
            }).then(() => {
                banknameRef.current.focus();
            });
            return;
        }

        if (accountnumber && !/^\d{9,18}$/.test(accountnumber)) {
            Swal.fire({
                icon: "error",
                title: "प्रमाणीकरण त्रुटी",
                text: "अकाऊंट नंबर 9 ते 18 अंकी असावा आणि फक्त अंक असावेत.",
            }).then(() => {
                accountnumberRef.current.focus();
            });
            return;
        }

        if (accountname && !/^[A-Za-z]+(?:\s[A-Za-z]+)*$/.test(accountname)) {
            Swal.fire({
                icon: "error",
                title: "प्रमाणीकरण त्रुटी",
                text: "अकाऊंट नाव फक्त अक्षर असावेत.",
            }).then(() => {
                accountnameRef.current.focus();
            });
            return;
        }

        if (ifsccode && !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsccode)) {
            Swal.fire({
                icon: "error",
                title: "प्रमाणीकरण त्रुटी",
                text: "IFSC code अश्या प्रकारे प्रविष्ट करावा (e.g., SBIN0005943)",
            }).then(() => {
                ifsccodeRef.current.focus();
            });
            return;
        }


        if (!Aadhar || !/^\d{12}$/.test(Aadhar)) {
            Swal.fire({
                icon: "error",
                title: "प्रमाणीकरण त्रुटी",
                text: "आधार नंबर १२ अंकी असावा आणि फक्त अंक असावेत.",
                allowOutsideClick: false,
                allowEscapeKey: false
            }).then(() => {
                AadharRef.current.focus();
            });
            return;
        }

        // तपशील टेबलमध्ये नोंदी आहेत का ते तपासा
        if (tableData.length === 0) {
            Swal.fire({
                icon: "error",
                title: "तपशील टेबल प्रमाणीकरण त्रुटी",
                text: "कृपया सेव्ह करण्यापूर्वी किमान एक उत्पादन जोडा.",
                allowOutsideClick: false,
                allowEscapeKey: false
            });
            return;
        }

        handleSubmit(event);
    };

    const MySwal = withReactContent(Swal);

    const showConfirmationAlert = (event) => {
        MySwal.fire({
            title: "आपल्याला खात्री आहे का?",
            text: "आपण हा डेटा सेव्ह करू इच्छिता?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#00ff00",
            confirmButtonText: "सेव्ह करा",
            cancelButtonColor: "#092C4C",
            cancelButtonText: "रद्द करा",
            allowOutsideClick: false,
            allowEscapeKey: false
        }).then((result) => {
            if (result.isConfirmed) {
                handlePayloadSubmition(event);
            }
        });
    };

    const closeModal = () => {
        const modal = document.getElementById("AddSalesEnquiry");
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
    };

    window.addEventListener("popstate", () => {
        const modal = document.getElementById("AddSalesEnquiry");
        if (modal && modal.classList.contains("show")) {
            closeModal();
        }
    });

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
                const modal = document.getElementById("AddSalesEnquiry");
                // if (modal) {
                //     const existingModal = bootstrap.Modal.getInstance(modal);
                //     if (existingModal) {
                //         existingModal.hide();
                //         existingModal.dispose();
                //     }
                //     modal.classList.remove("show");
                //     modal.style.display = "none";
                //     modal.removeAttribute("aria-modal");
                //     modal.removeAttribute("role");
                //     modal.setAttribute("aria-hidden", "true");

                //     const modalBackdrop = document.querySelector(".modal-backdrop");
                //     if (modalBackdrop) {
                //         modalBackdrop.remove();
                //     }

                //     document.body.classList.remove("modal-open");
                //     document.body.style.removeProperty("overflow");
                //     document.body.style.removeProperty("padding-right");
                // }
                if (modal) {
                    // Hide modal
                    modal.classList.remove("show");
                    modal.style.display = "none";
                    modal.setAttribute("aria-hidden", "true");

                    // Remove backdrop if exists
                    const modalBackdrop = document.querySelector(".modal-backdrop");
                    if (modalBackdrop) {
                        modalBackdrop.remove();
                    }

                    // Clear modal-related attributes (important for fresh open)
                    modal.removeAttribute("aria-modal");
                    modal.removeAttribute("role");

                    // Clean up body classes and styles
                    document.body.classList.remove("modal-open");
                    document.body.style.overflow = "";
                    document.body.style.paddingRight = "";
                }

                setMasterData({
                    baid: "",
                    tokennumber: "",
                    Bill_Kramank: "",
                    tarikh: "",
                    maid: "",
                    village_name: "",
                    mobilenumber: "",
                    vehiclenumber: "",
                    bankname: "",
                    accountnumber: "",
                    accountname: "",
                    ifsccode: "",
                    Aadhar: "",
                    ekunjali: "",
                    ekunwajan: "",
                    gadibhade: "",
                    ekunrakkam: "",
                    ekunkharch: "",
                    bakirakkam: "",
                    trntid: "",
                });
                setFormData({
                    croptype: "",
                    vyapariname: "",
                    carets: "",
                    weight: "",
                    weightkamijast: "",
                    rate: "",
                    amount: "",
                });
                setTableData([]);
                if (onRefresh) {
                    onRefresh();
                }
            }
        });
    };

    // logic of wight calculation and decrease when min max will happen

    // const handleWeightChange = (e) => {
    //     let inputValue = e.target.value.trim();

    //     // If input is empty (user cleared the input), reset related values
    //     if (inputValue === "") {
    //         const carets = formData.carets && !isNaN(formData.carets) ? parseFloat(formData.carets) : 0;
    //         const updatedWeight = carets * 20;
    //         const rate = formData.rate && !isNaN(formData.rate) ? parseFloat(formData.rate) : 0;
    //         const Calculateamount = updatedWeight * (rate / 20);

    //         setFormData({
    //             ...formData,
    //             weightkamijast: "",
    //             weight: updatedWeight,
    //             amount: Calculateamount,
    //         });
    //         return;
    //     }

    //     // If input is not a number, exit
    //     if (isNaN(inputValue)) return;

    //     // Remove any existing sign before parsing
    //     const weightAdjustment = parseFloat(inputValue.replace(/[^0-9.]/g, ""));
    //     const carets = formData.carets && !isNaN(formData.carets) ? parseFloat(formData.carets) : 0;
    //     let updatedWeight = carets * 20;
    //     let signedWeight = "0";

    //     if (formData.weightType === "min") {
    //         updatedWeight -= weightAdjustment;
    //         signedWeight = `-${weightAdjustment}`;
    //     } else if (formData.weightType === "max") {
    //         updatedWeight += weightAdjustment;
    //         signedWeight = `+${weightAdjustment}`;
    //     } else {
    //         if (weightAdjustment === 0) {
    //             setFormData({
    //                 ...formData,
    //                 weightkamijast: "0",
    //             });
    //         } else {
    //             alert("Please select + or - type for weight adjustment.");
    //         }
    //         return;
    //     }

    //     const rate = formData.rate && !isNaN(formData.rate) ? parseFloat(formData.rate) : 0;
    //     const Calculateamount = updatedWeight * (rate / 20);

    //     setFormData({
    //         ...formData,
    //         weightkamijast: signedWeight.toString(),
    //         weight: updatedWeight,
    //         amount: Calculateamount,
    //     });
    // };
    // logic of wight calculation and decrease when min max will happen



    const handleWeightChange = (e) => {
        let inputValue = e.target.value.trim();

        // If empty, set to "0" and calculate weight accordingly
        if (inputValue === "") {
            inputValue = "0";
        }

        // If not a number, stop here
        if (isNaN(inputValue)) return;

        const adjustment = parseFloat(inputValue);
        const carets = parseFloat(formData.carets) || 0;
        const rate = parseFloat(formData.rate) || 0;
        let updatedWeight = carets * 20;
        let signedWeight = "";

        if (formData.weightType === "min") {
            updatedWeight -= adjustment;
            signedWeight = `-${adjustment}`;
        } else if (formData.weightType === "max") {
            updatedWeight += adjustment;
            signedWeight = `+${adjustment}`;
        }

        const Calculateamount = Math.round(updatedWeight * (rate / 20));

        setFormData({
            ...formData,
            weightkamijast: signedWeight,
            weight: updatedWeight,
            amount: Calculateamount,
        });
    };

    const handleWeightTypeChange = (e) => {
        const newWeightType = e.target.value;
        const weightAdjustment = parseFloat(formData.weightkamijast.replace("+", "").replace("-", "")) || 0;
        const carets = parseFloat(formData.carets) || 0;
        let updatedWeight = carets * 20;
        let signedWeight = "0";

        if (newWeightType === "min") {
            updatedWeight -= weightAdjustment;
            signedWeight = `-${weightAdjustment}`;
        } else if (newWeightType === "max") {
            updatedWeight += weightAdjustment;
            signedWeight = `+${weightAdjustment}`;
        }

        const rate = parseFloat(formData.rate) || 0;
        const Calculateamount = updatedWeight * (rate / 20);

        setFormData({
            ...formData,
            weightType: newWeightType,
            weight: updatedWeight,
            weightkamijast: signedWeight,
            amount: Calculateamount,
        });
    };

    const handleKeyDown = (e, nextRef, isLast = false) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (nextRef == 'rateRef') {
                addRecord();
            } else if (nextRef && nextRef.current) {
                nextRef.current.focus();
            }

        }
    };

    const handleInputChangetoken = async (e) => {

        const { name, value } = e.target;
        setMasterData({
            ...masterData,
            [name]: value
        });

        if (value == "") {
            setTableData([]);
            setMasterData((prev) => ({
                ...prev,
                baid: "",
                Bill_Kramank: "",
                tokennumber: "",
                tarikh: "",
                maid: "",
                village_name: "",
                mobilenumber: "",
                vehiclenumber: "",
                bankname: "",
                accountnumber: "",
                accountname: "",
                ifsccode: "",
                Aadhar: "",
                seva: "",
                ekunjali: "",
                ekunwajan: "",
                gadibhade: "",
                ekunkharch: "",
                ekunrakkam: "",
                bakirakkam: "",
            }));
            return false;
        }

    };

    const prevTokenRef = useRef("");

    const isFormInitialized = useRef(false);
    useEffect(() => {
        if (masterData.tokennumber && !isFormInitialized.current) {
            prevTokenRef.current = masterData.tokennumber;
            isFormInitialized.current = true; // form initialized once
        }
    }, [masterData.tokennumber]);

    const FromTokenInput_showConfirmationAlert = (event) => {
        handlePayloadSubmition(event);
    };


    const [serviceData1, setServiceData1] = useState([]);

    const fetchFarmersServiceData = async (baid) => {
        try {
            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            const payload = {
                "baid": baid || "",
                "companyid": userdetail?.companyID || "",
                "deptid": userdetail?.departmentID || "",
            };

            const response = await axios.post(
                `${baseUrl.Url}/backend/api/GET_FarmerBillCharges`,
                payload,
                { headers }
            );

            if (response.status !== 200) {
                throw new Error("Failed to fetch farmers service data");
            }

            const data = response.data;
            const serviceData = data.map(({ nSERVICETYPETITLE, seva, sevaID, sevaValue }) => ({
                nSERVICETYPETITLE,
                seva,
                sevaID,
                sevaValue

            }));

            setServiceData1(serviceData);
            return true; // ✅ indicate success
        } catch (error) {
            console.error("Error fetching farmers service data:", error);
            return false; // ❌ indicate failure
        }
    }

    const handlePrint = async () => {
        const isLoaded = await fetchFarmersServiceData(BAID);
        if (!isLoaded) {
            alert("सेवा माहिती मिळवण्यात अडचण आली. कृपया पुन्हा प्रयत्न करा.");
            return;
        }

        setTimeout(() => {
            const printContents = document.getElementById("printSection1").innerHTML;
            const printWindow = window.open('', '', 'height=600,width=600');

            printWindow.document.write('<html><head><title>Print</title>');
            printWindow.document.write(`
            <style>
                @media print {
                    #printSection1 {
                        display: block !important;
                        margin-left: 1.5cm;
                        margin-right: 2cm;
                    }
                    @page {
                        size: 15.3cm 15.3cm;
                        margin: 0;
                    }
                    body {
                        margin: 0;
                        padding: 0;
                    }
                }
            </style>
        `);
            printWindow.document.write('</head><body>');
            printWindow.document.write(`<div class="template-container">${printContents}</div>`);
            printWindow.document.write('</body></html>');
            printWindow.document.close();

            printWindow.focus();
            printWindow.print();
            printWindow.close();
        }, 300); // Small delay for any rendering
    };

    const rowsPerPage = 11;
    const filteredRows = tableData.filter(d => !d.IsDeleted);


    const chunkedData = [];
    for (let i = 0; i < filteredRows.length; i += rowsPerPage) {
        chunkedData.push(filteredRows.slice(i, i + rowsPerPage));
    }

    const getSevaAmountById = (serviceId) => {
        if (!masterData?.seva) return "";

        const entries = masterData.seva.split(',').map(entry => entry.trim());
        const match = entries.find(item => item.startsWith(`${serviceId}_`));

        if (match) {
            const [, amount] = match.split('_');
            return parseFloat(amount).toFixed(2);
        }

        return "";
    };

    return (
        <div>
            {/* master inputs */}
            <div className="modal fade" id="AddSalesEnquiry">

                <div className="modal-dialog modal-dialog-centered modal-fullscreen">
                    <div className="modal-content mbgcolor">
                        <div className="page-wrapper-new p-0">
                            <div className="content">
                                <div className="modal-header border-0 custom-modal-header" style={{ padding: '5px' }}>
                                    <div className="page-title">
                                        <h3>शेतकरी बिल</h3>
                                    </div>

                                    <div className="page-btn">
                                        {/* <Link className="btn btn-secondary"
                                            data-bs-dismiss="modal"
                                            aria-label="Close">
                                            <ArrowLeft className="me-2" />
                                            Back to Index
                                        </Link> */}
                                        <Link className="btn btn-secondary"
                                            onClick={showExitAlert}>
                                            <ArrowLeft className="me-2" />
                                            मागे
                                        </Link>
                                    </div>
                                </div>
                                <div className="modal-body custom-modal-body" style={{
                                    overflow: "hidden",
                                    padding: '5px'
                                }}>
                                    <form onSubmit={handleSubmit}>

                                        <div className="row">

                                            <div className="col-lg-2 col-sm-6 col-12">
                                                <div className="mb-0">
                                                    <label className="form-label required">टोकन नंबर</label>
                                                    {/* <input
                                                        type="text"
                                                        className="form-control"
                                                        id="tokennumber"
                                                        name="tokennumber"
                                                        value={masterData.tokennumber}
                                                        // onChange={handleMasterInputChange}
                                                        onChange={(e) => {
                                                            handleMasterInputChange(e); // Your existing logic

                                                        }}

                                                        // onBlur={() => handleSearch(masterData.tokennumber)}
                                                        required
                                                        pattern=".*\S.*"  // Ensures at least one non-space character
                                                        title="Please enter Token Number"
                                                        placeholder="कृपया टोकन नंबर द्वारे शोधा   "
                                                        autoFocus
                                                        ref={tokennumberRef}
                                                        // onKeyDown={(e) => handleKeyDown(e, banknameRef)}
                                                        onKeyDown={(e) => {
                                                            if (e.key === "Enter") {
                                                                e.preventDefault(); // Prevent form submit if inside a form
                                                                handleSearch(masterData.tokennumber); // Call your search function

                                                                handleKeyDown(e, banknameRef); // Optional: keep your navigation logic
                                                            }
                                                        }}
                                                    /> */}

                                                    <input
                                                        ref={tokennumberRef}
                                                        type="tel"
                                                        className="form-control"
                                                        name="tokennumber"
                                                        value={masterData.tokennumber}
                                                        onChange={async (e) => {
                                                            const value = e.target.value.trim();
                                                            const hasValidRow = tableData.some(() => true);

                                                            const isTokenChanged = value !== prevTokenRef.current;

                                                            if (isTokenChanged && hasValidRow && isFormInitialized.current) {

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

                                                                    setTableData([]);
                                                                    setFormData({
                                                                        croptype: "",
                                                                        vyapariname: "",
                                                                        carets: "",
                                                                        weight: "",
                                                                        weightkamijast: "0",
                                                                        rate: "",
                                                                        amount: "",
                                                                        IsDeleted: 0,
                                                                    });
                                                                    setMasterData((prev) => ({
                                                                        ...prev,
                                                                        baid: "",
                                                                        Bill_Kramank: "",
                                                                        tokennumber: "",
                                                                        tarikh: "",
                                                                        maid: "",
                                                                        village_name: "",
                                                                        mobilenumber: "",
                                                                        vehiclenumber: "",
                                                                        bankname: "",
                                                                        accountnumber: "",
                                                                        accountname: "",
                                                                        ifsccode: "",
                                                                        Aadhar: "",
                                                                        seva: "",
                                                                        ekunjali: "",
                                                                        ekunwajan: "",
                                                                        gadibhade: "",
                                                                        ekunkharch: "",
                                                                        ekunrakkam: "",
                                                                        bakirakkam: "",
                                                                    }));

                                                                    prevTokenRef.current = "";
                                                                    isFormInitialized.current = false;
                                                                    return;
                                                                } else {
                                                                    // handleSubmit(e);
                                                                    FromTokenInput_showConfirmationAlert();
                                                                    return;
                                                                }
                                                            }

                                                            handleInputChangetoken(e); // token update logic
                                                        }}

                                                        onBlur={() => {
                                                            const value = masterData.tokennumber.trim();
                                                            if (value) {
                                                                handleSearch(value);
                                                            }
                                                        }}

                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') {
                                                                handleSearch(e.target.value);
                                                                handleKeyDown(e, banknameRef);
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

                                            <div className="col-lg-2 col-sm-6 col-12">
                                                <div className="mb-0">
                                                    <label className="form-label required">बिल क्रमांक </label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="Bill_Kramank"
                                                        name="Bill_Kramank"
                                                        value={masterData.Bill_Kramank}
                                                        onChange={handleMasterInputChange}
                                                        readOnly
                                                        pattern=".*\S.*"  // Ensures at least one non-space character
                                                        style={{
                                                            fontWeight: "900",
                                                            backgroundColor: "#ffeb3b",
                                                            border: "2px solid #ff9800",
                                                            textAlign: "center"
                                                        }}
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-lg-2 col-sm-6 col-12">
                                                <div className="mb-0">
                                                    <label className="form-label required">तारीख</label>
                                                    <input
                                                        type="date"
                                                        className="form-control"
                                                        id="tarikh"
                                                        name="tarikh"
                                                        value={masterData.tarikh}
                                                        onChange={handleMasterInputChange}
                                                        readOnly
                                                        pattern=".*\S.*"  // Ensures at least one non-space character

                                                    />
                                                </div>
                                            </div>



                                            {/* <div className="col-lg-2 col-sm-6 col-12">
                                                <label className="form-label required">शेतकऱ्याचे नाव</label>
                                                <Select

                                                    placeholder="Select Farmer"
                                                    classNamePrefix="react-select"
                                                    openMenuOnFocus={true}
                                                    options={Farmer}
                                                    value={Farmer.find((option) => option.value === masterData.maid) || null}
                                                    readOnly
                                                    onChange={(selectedOption) => {
                                                        console.log("Selected Farmer in Select:", selectedOption);

                                                        setMasterData(prevState => ({
                                                            ...prevState,
                                                            maid: selectedOption ? selectedOption.value : '',
                                                        }));
                                                    }}

                                                />
                                            </div> */}

                                            <div className="col-lg-2 col-sm-6 col-12">
                                                <label className="form-label required">शेतकऱ्याचे नाव</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={
                                                        Farmer.find((option) => option.value === masterData.maid)?.label || ''
                                                    }
                                                    readOnly
                                                // style={{ backgroundColor: "#e9ecef", cursor: "default" }}
                                                />
                                            </div>


                                            <div className="col-lg-2 col-sm-6 col-12">
                                                <div className="mb-0">
                                                    <label className="form-label required">गावाचे नाव </label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="village_name"
                                                        value={masterData.village_name}
                                                        onChange={handleMasterInputChange} // Handle the change event (even though it's readonly, for other fields)
                                                        readOnly
                                                        pattern=".*\S.*"
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-lg-2 col-sm-6 col-12">
                                                <div className="mb-0">
                                                    <label className="form-label required">मोबाइल नंबर</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="mobilenumber"
                                                        value={masterData.mobilenumber}
                                                        onChange={handleMasterInputChange} // Handle the change event (even though it's readonly, for other fields)
                                                        readOnly
                                                        pattern=".*\S.*"
                                                    />
                                                </div>
                                            </div>


                                        </div>

                                        <div className="row">


                                            <div className="col-lg-2 col-sm-6 col-12">
                                                <div className="mb-0">
                                                    <label className="form-label required">गाडी नंबर</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="vehiclenumber"
                                                        value={masterData.vehiclenumber}
                                                        onChange={handleMasterInputChange} // Handle the change event (even though it's readonly, for other fields)
                                                        readOnly
                                                        pattern=".*\S.*"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-lg-2 col-sm-6 col-12">
                                                <div className="mb-0">
                                                    <label className="form-label required">बँक नाव</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="bankname"
                                                        value={masterData.bankname}
                                                        onChange={handleMasterInputChange} // Handle the change event (even though it's readonly, for other fields)
                                                        placeholder="कृपया बँकेचे नाव प्रविष्ट करा."
                                                        pattern="^(?!\s*$)[A-Za-z\s]+$"
                                                        title="बँक नाव फक्त अक्षर असावेत."
                                                        ref={banknameRef}
                                                        onKeyDown={(e) => handleKeyDown(e, accountnumberRef)}
                                                    />
                                                </div>
                                            </div>


                                            <div className="col-lg-2 col-sm-6 col-12">
                                                <div className="mb-0">
                                                    <label className="form-label required">अकाऊंट नंबर</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="accountnumber"
                                                        value={masterData.accountnumber}
                                                        onChange={handleMasterInputChange} // Handle the change event (even though it's readonly, for other fields)
                                                        placeholder="कृपया अकाऊंट नंबर प्रविष्ट करा."
                                                        pattern="^\d{9,18}$"
                                                        title="अकाऊंट नंबर 9 ते 18 अंकी असावा आणि फक्त अंक असावेत."
                                                        ref={accountnumberRef}
                                                        onKeyDown={(e) => handleKeyDown(e, accountnameRef)}
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-lg-2 col-sm-6 col-12">
                                                <div className="mb-0">
                                                    <label className="form-label required">अकाऊंट नाव</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="accountname"
                                                        value={masterData.accountname}
                                                        onChange={handleMasterInputChange} // Handle the change event (even though it's readonly, for other fields)
                                                        placeholder="कृपया अकाऊंट नाव प्रविष्ट करा"
                                                        pattern="^[A-Za-z]+(?:\s[A-Za-z]+)*$"
                                                        title="अकाऊंट नाव फक्त अक्षर असावेत."
                                                        ref={accountnameRef}
                                                        onKeyDown={(e) => handleKeyDown(e, ifsccodeRef)}
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-lg-2 col-sm-6 col-12">
                                                <div className="mb-0">
                                                    <label className="form-label required">IFSC नंबर</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="ifsccode"
                                                        value={masterData.ifsccode}
                                                        onChange={handleMasterInputChange} // Handle the change event (even though it's readonly, for other fields)
                                                        placeholder="कृपया IFSC code प्रविष्ट करा"
                                                        pattern="^[A-Z]{4}0[A-Z0-9]{6}$"
                                                        title="IFSC code अश्या प्रकारे प्रविष्ट करावा (e.g., SBIN0005943)"
                                                        maxLength={11}
                                                        style={{ textTransform: "uppercase" }} // to automatically show uppercase
                                                        ref={ifsccodeRef}
                                                        onKeyDown={(e) => handleKeyDown(e, vyaparinameRef)}
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-lg-2 col-sm-6 col-12">
                                                <div className="mb-0">
                                                    <label className="form-label required">आधार नंबर </label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="Aadhar"
                                                        value={masterData.Aadhar}
                                                        onChange={handleMasterInputChange} // Handle the change event (even though it's readonly, for other fields)
                                                        readOnly
                                                    // placeholder="Enter 12-digit Aadhar Number"
                                                    // pattern="^\d{12}$"
                                                    // title="Aadhar Number must contain exactly 12 digits with no spaces or special characters."
                                                    // maxLength="12" // Ensure only 12 digits are entered
                                                    // required
                                                    // ref={AadharRef}
                                                    // onKeyDown={(e) => handleKeyDown(e, vyaparinameRef)}
                                                    />
                                                </div>
                                            </div>


                                        </div>


                                        {/* start (Detail) */}
                                        <div className="border p-3 rounded shadow-sm mt-2">

                                            <div className="addservice-info mb-2" >

                                                <div className="row">

                                                    {/* <div className="col-lg-1 col-sm-6 col-12">
                                                        <div className="mb-0">
                                                            <label className="form-label required">पिकाचा प्रकार</label>
                                                            <Select
                                                                ref={croptypeRef}
                                                                placeholder="Select Counter"
                                                                classNamePrefix="react-select"
                                                                options={cropType}
                                                                value={cropType.find(option => option.value === formData.croptype) || null}
                                                                onChange={(selectedOption) => {

                                                                    setFormData(prevState => ({
                                                                        ...prevState,
                                                                        croptype: selectedOption ? selectedOption.value : '',
                                                                    }));

                                                                    if (vyaparinameRef.current) {
                                                                        vyaparinameRef.current.focus();
                                                                    }
                                                                }}
                                                            />
                                                        </div>
                                                    </div> */}


                                                    <div className="col-lg-3 col-sm-6 col-12">
                                                        <div className="mb-0">
                                                            <label className='required'>व्यापारी</label>
                                                            <Select
                                                                ref={vyaparinameRef}
                                                                placeholder="कृपया व्यापारी सिलेक्ट करा "
                                                                openMenuOnFocus={true}
                                                                classNamePrefix="react-select"
                                                                options={vyapari}  // Your options for vyapari
                                                                value={vyapari.find(option => option.value === formData.vyapariname) || null}
                                                                onChange={(selectedOption) => {
                                                                    // Update the vyapariName in the detailData state
                                                                    setFormData(prevState => ({
                                                                        ...prevState,
                                                                        vyapariname: selectedOption ? selectedOption.value : '',
                                                                    }));

                                                                    if (caretsRef.current) {
                                                                        caretsRef.current.focus();
                                                                    }

                                                                }}
                                                                styles={{
                                                                    menu: (provided) => ({
                                                                        ...provided,
                                                                        zIndex: 9999, // 👈 High z-index to appear above sticky header
                                                                        position: 'absolute',
                                                                    }),
                                                                }}

                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-lg-1 col-sm-6 col-12">
                                                        <div className="mb-0">
                                                            <label className="form-label required">जाळी </label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                name="carets"
                                                                value={formData.carets}
                                                                onChange={(e) => {
                                                                    const value = e.target.value;

                                                                    if (/^\d*$/.test(value)) {
                                                                        handleDetailInputChange(e);
                                                                    } else {
                                                                        Swal.fire({
                                                                            icon: "warning",
                                                                            title: "जाळी पडताळणी करा",
                                                                            text: "कृपया फक्त अंक प्रविष्ट करा.",
                                                                            confirmButtonText: "ठीक आहे",
                                                                            allowOutsideClick: false,
                                                                            allowEscapeKey: false
                                                                        }).then(() => {
                                                                            e.target.value = ""; // optional: clear input
                                                                        });
                                                                    }
                                                                }}

                                                                // onChange={(e) => {
                                                                //     const value = e.target.value;
                                                                //     // Allow only digits
                                                                //     if (/^\d*$/.test(value)) {
                                                                //         handleDetailInputChange(e); // Call your normal handler only if valid
                                                                //     }
                                                                // }}
                                                                placeholder="कृपया जाळी संख्या प्रविष्ट करा"
                                                                ref={caretsRef}
                                                                onKeyDown={(e) => handleKeyDown(e, weightkamijastRef)}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-lg-1 col-sm-6 col-12">
                                                        <div className="mb-0">
                                                            <label className="form-label required">वजन </label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                name="weight"
                                                                value={formData.weight}
                                                                onChange={handleDetailInputChange}
                                                                placeholder="स्वयंचलित प्रक्रिया"
                                                                readOnly

                                                            />
                                                        </div>
                                                    </div>


                                                    <div className="col-lg-2 col-sm-6 col-12">
                                                        <div className="mb-0">
                                                            <label className="form-label required">वजन</label>

                                                            {/* Radio Buttons */}
                                                            <div className="form-check form-check-inline">
                                                                <input
                                                                    className="form-check-input"
                                                                    type="radio"
                                                                    name="weightType"
                                                                    value="min"
                                                                    checked={formData.weightType === "min"}
                                                                    onChange={handleWeightTypeChange}
                                                                />
                                                                <label className="form-check-label">कमी</label>
                                                            </div>
                                                            <div className="form-check form-check-inline">
                                                                <input
                                                                    className="form-check-input"
                                                                    type="radio"
                                                                    name="weightType"
                                                                    value="max"
                                                                    checked={formData.weightType === "max"}
                                                                    onChange={handleWeightTypeChange}


                                                                />
                                                                <label className="form-check-label">जास्त</label>
                                                            </div>

                                                            {/* Weight Input */}
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                name="weightkamijast"
                                                                // value={formData.weightkamijast}
                                                                value={formData.weightkamijast.replace("+", "").replace("-", "") || "0"}
                                                                // onChange={handleWeightChange}
                                                                onChange={(e) => {
                                                                    const value = e.target.value;

                                                                    if (/^\d*$/.test(value)) {
                                                                        handleWeightChange(e);
                                                                    } else {
                                                                        Swal.fire({
                                                                            icon: "warning",
                                                                            title: "कमी जास्त पडताळणी करा",
                                                                            text: "कृपया फक्त अंक प्रविष्ट करा.",
                                                                            confirmButtonText: "ठीक आहे",
                                                                            allowOutsideClick: false,
                                                                            allowEscapeKey: false
                                                                        }).then(() => {
                                                                            e.target.value = ""; // optional: clear input
                                                                        });
                                                                    }
                                                                }}
                                                                placeholder="Enter weight adjustment"
                                                                ref={weightkamijastRef}
                                                                onKeyDown={(e) => handleKeyDown(e, rateRef)}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-lg-2 col-sm-6 col-12">
                                                        <div className="mb-0">
                                                            <label className="form-label required">भाव</label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                name="rate"
                                                                value={formData.rate}
                                                                // onChange={(e) => {
                                                                //     const value = e.target.value;
                                                                //     // Allow only digits
                                                                //     if (/^\d*$/.test(value)) {
                                                                //         handleDetailInputChange(e); // Call your normal handler only if valid
                                                                //     }
                                                                // }}
                                                                onChange={(e) => {
                                                                    const value = e.target.value;

                                                                    if (/^\d*$/.test(value)) {
                                                                        handleDetailInputChange(e);
                                                                    } else {
                                                                        Swal.fire({
                                                                            icon: "warning",
                                                                            title: "भाव पडताळणी करा",
                                                                            text: "कृपया फक्त अंक प्रविष्ट करा.",
                                                                            confirmButtonText: "ठीक आहे",
                                                                            allowOutsideClick: false,
                                                                            allowEscapeKey: false
                                                                        }).then(() => {
                                                                            e.target.value = ""; // optional: clear input
                                                                        });
                                                                    }
                                                                }}

                                                                placeholder="कृपया भाव प्रविष्ट करा"
                                                                ref={rateRef}
                                                                onKeyDown={(e) => handleKeyDown(e, addRef)} // 👈 directly call addRecord



                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-lg-2 col-sm-6 col-12">
                                                        <div className="mb-0">
                                                            <label className="form-label required">किंमत </label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                name="amount"
                                                                value={formData.amount}
                                                                onChange={handleDetailInputChange}
                                                                placeholder="Enter amount"
                                                                readOnly
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-lg-1 col-sm-6 col-12">
                                                        <div className="mt-4">
                                                            <button
                                                                ref={addRef}
                                                                type="button"
                                                                className="btn btn-primary"
                                                                onClick={addRecord}>
                                                                जोडा
                                                            </button>
                                                        </div>

                                                    </div>

                                                </div>

                                            </div>


                                            <div className="col-lg-12">

                                                <div className="modal-body-table overflow-auto max-vh-100" >
                                                    <div className="table-responsive" style={{ height: "calc(40vh - 120px)" }}>
                                                        <table className="table table-bordered table-sm">

                                                            <thead className="thead-dark bg-white" style={{ position: "sticky", top: 0, zIndex: 2 }}>
                                                                <tr>
                                                                    {/* <th className="col-2">पीक प्रकार </th> */}
                                                                    <th className="col-2">व्यापारी नाव </th>
                                                                    <th className="col-1">जाळी </th>
                                                                    <th className="col-1">वजन  </th>
                                                                    <th className="col-1">वजन कमी/जास्त</th>
                                                                    <th className="col-1">भाव</th>
                                                                    <th className="col-1">किंमत </th>
                                                                    {/* <th className="col-1 text-center" >कृती </th> */}
                                                                    <th className="col-1 text-center" >कृती </th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>

                                                                {tableData.filter((data) => !data.IsDeleted).length > 0 ? (
                                                                    tableData

                                                                        .filter((data) => !data.IsDeleted)
                                                                        .sort((a, b) => {
                                                                            const amountA = Math.round(a.rate * (a.weight / 20));
                                                                            const amountB = Math.round(b.rate * (b.weight / 20));
                                                                            return amountB - amountA; // ✅ Sort by amount descending
                                                                        })
                                                                        .map((data, index) => (
                                                                            <tr key={data.bdaid || index}>

                                                                                {/* <td className="col-3">
                                                                                    {cropType.find((option) => option.value === data.croptype)?.label || "Not Found"}
                                                                                </td> */}
                                                                                <td className="col-3">
                                                                                    {vyapari.find((option) => option.value === data.vyapariname)?.label || "Not Found"}
                                                                                </td>
                                                                                <td className="col-1" >{data.carets}</td>
                                                                                <td className="col-1" >{data.weight}</td>
                                                                                <td className="col-1" >{data.weightkamijast}</td>
                                                                                <td className="col-1" >{data.rate}</td>
                                                                                <td className="col-1">{Math.round(data.rate * (data.weight / 20))}</td>

                                                                                {/* <td className="col-1 text-center">
                                                                                    <div className="d-flex justify-content-center">
                                                                                        <Link
                                                                                            to="#"
                                                                                            className="confirm-text p-2"
                                                                                            onClick={() => handleDelete(data.bdaid, data.vbkid)}
                                                                                        >
                                                                                            <Trash2 className="feather-trash-2 text-danger" />
                                                                                        </Link>
                                                                                        <Link
                                                                                            to="#"
                                                                                            onClick={() => handleEdit(data.bdaid)}
                                                                                            className="me-2 p-1"
                                                                                            style={{ color: 'lightblue' }}
                                                                                        >
                                                                                            <Edit className="feather-edit" />
                                                                                        </Link>
                                                                                    </div>
                                                                                </td> */}
                                                                                <td className="col-1 text-center p-0" style={{ minWidth: '110px' }}>
                                                                                    <div className="d-flex" style={{ height: '40px', borderRadius: '6px', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }}>
                                                                                        {/* Left half - DELETE */}
                                                                                        <div
                                                                                            className="w-50 d-flex justify-content-center align-items-center"
                                                                                            style={{
                                                                                                backgroundColor: '#f8d7da',
                                                                                                cursor: 'pointer',
                                                                                                transition: 'background-color 0.3s ease',
                                                                                            }}
                                                                                            onClick={() => handleDelete(data.bdaid, data.vbkid)}
                                                                                            title="Delete"
                                                                                            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f5c6cb')}
                                                                                            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#f8d7da')}
                                                                                        >
                                                                                            <Trash2 className="text-danger" />
                                                                                        </div>

                                                                                        {/* Right half - EDIT */}
                                                                                        <div
                                                                                            className="w-50 d-flex justify-content-center align-items-center"
                                                                                            style={{
                                                                                                backgroundColor: '#d1ecf1',
                                                                                                cursor: 'pointer',
                                                                                                transition: 'background-color 0.3s ease',
                                                                                            }}
                                                                                            onClick={() => handleEdit(data.bdaid)}
                                                                                            title="Edit"
                                                                                            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#bee5eb')}
                                                                                            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#d1ecf1')}
                                                                                        >
                                                                                            <Edit className="text-primary" />
                                                                                        </div>
                                                                                    </div>
                                                                                </td>


                                                                            </tr>
                                                                        ))
                                                                ) : (
                                                                    <tr>
                                                                        <td colSpan="8" className="text-center">No records found</td>
                                                                    </tr>
                                                                )
                                                                }
                                                            </tbody>


                                                        </table>
                                                    </div>
                                                </div>
                                            </div>




                                        </div>
                                        {/* end (Detail) */}

                                        {/* sum imputs of(Master) */}

                                        <div className="row mt-2">
                                            <div className="col-lg-2 col-sm-6 col-12">
                                                <div className="mb-0">
                                                    <label className="form-label required"> एकूण जाळी</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="ekunjali"
                                                        name="ekunjali"
                                                        value={masterData.ekunjali}
                                                        onChange={handleMasterInputChange}
                                                        readOnly
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-lg-2 col-sm-6 col-12">
                                                <div className="mb-0">
                                                    <label className="form-label required"> एकूण वजन  </label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="ekunwajan"
                                                        name="ekunwajan"
                                                        value={masterData.ekunwajan}
                                                        onChange={handleMasterInputChange}
                                                        readOnly
                                                    />
                                                </div>
                                            </div>

                                            {/* <div className="col-lg-2 col-sm-6 col-12">
                                                <div className="mb-0">
                                                    <label className="form-label required"> गाडी भाडे  </label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="gadibhade"
                                                        name="gadibhade"
                                                        value={masterData.gadibhade}
                                                        onChange={handleMasterInputChange}
                                                    />
                                                </div>
                                            </div> */}

                                            <div className="col-lg-2 col-sm-6 col-12">
                                                <div className="mb-0">
                                                    <label className="form-label required"> एकूण रक्कम </label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="ekunrakkam"
                                                        name="ekunrakkam"
                                                        value={masterData.ekunrakkam}
                                                        onChange={handleMasterInputChange}
                                                        readOnly
                                                    />
                                                </div>
                                            </div>

                                            {serviceData.map((service, index) => {
                                                let calculatedRate;
                                                // Calculate the rate if not present in formData
                                                if (!masterData[service.servicetypetitle]) {
                                                    if (service.ratetype === "1" || service.ratetype === "3") {
                                                        if (service.ratetype === "1") {
                                                            calculatedRate = (service.newrate / 100) * parseFloat(masterData.ekunrakkam);
                                                        } else if (service.ratetype === "3") {
                                                            calculatedRate = service.newrate * parseFloat(masterData.ekunjali);
                                                        }
                                                    } else if (service.ratetype === "0") {
                                                        calculatedRate = service.newrate; // Direct rate for type "0"
                                                    }
                                                }

                                                return (
                                                    <div key={index} className="col-2 col-md-6 col-lg-2 mb-3">
                                                        <div className="mb-0 add-product">
                                                            <label className="form-label required">{`${service.servicetypetitle}`}</label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                name={service.seva}
                                                                // value={masterData[service.seva] || (calculatedRate !== undefined ? calculatedRate.toFixed(2) : '')}
                                                                value={masterData[service.seva] || (calculatedRate !== undefined ? Math.round(calculatedRate) : '')}
                                                                onChange={(e) => handleMasterInputChange(e, service.seva)}
                                                                readOnly
                                                            />
                                                        </div>
                                                    </div>
                                                );
                                            })}

                                            <div className="col-lg-2 col-sm-6 col-12">
                                                <div className="mb-0">
                                                    <label className="form-label required"> एकूण खर्च  </label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="ekunkharch"
                                                        name="ekunkharch"
                                                        value={masterData.ekunkharch}
                                                        onChange={handleMasterInputChange}
                                                        readOnly
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-lg-2 col-sm-6 col-12">
                                                <div className="mb-0">
                                                    <label className="form-label required"> बाकी रक्कम </label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="bakirakkam"
                                                        name="bakirakkam"
                                                        value={masterData.bakirakkam}
                                                        onChange={handleMasterInputChange}
                                                        readOnly
                                                    />
                                                </div>
                                            </div>

                                        </div>

                                        <div className="col-lg-12 d-flex justify-content-end mt-2">
                                            {/* <button
                                                type="button"
                                                className="btn btn-cancel me-2"
                                                data-bs-dismiss="modal"
                                                aria-label="Close"
                                            >
                                                Exit
                                            </button> */}
                                            <Link className="btn btn-secondary me-2"
                                                onClick={showExitAlert}>
                                                मागे
                                            </Link>
                                            <button
                                                type="button"
                                                className="btn btn-submit me-2"
                                                onClick={handlePrint}
                                            >
                                                पावती प्रिंट करा
                                            </button>

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
                                    <div id="printSection1" style={{ display: 'none' }}>
                                        {chunkedData.map((pageRows, pageIndex) => (
                                            <div
                                                key={pageIndex}
                                                style={{
                                                    position: "relative",
                                                    width: "12cm",
                                                    height: "13.8cm",
                                                    backgroundImage: "url('/BillPrint.jpg')",
                                                    backgroundSize: "cover",
                                                    fontFamily: "'Baloo 2', sans-serif",
                                                    fontSize: "12pt",
                                                    color: "#000",
                                                    pageBreakAfter: "always", // ensures new page when printing
                                                    fontWeight: "bold" // Global bold font
                                                }}
                                            >
                                                {/* तारीख */}
                                                <div style={{ position: "absolute", top: "1cm", left: "11.9cm", fontSize: "11pt", whiteSpace: "nowrap" }}>
                                                    {userdetail?.APPDT}
                                                </div>

                                                {/* हिशोब पटी नं. */}
                                                <div style={{ position: "absolute", top: "2cm", left: "11.9cm" }}>
                                                    {masterData.Bill_Kramank}
                                                </div>

                                                {/* शेतकरी श्री */}
                                                <div style={{ position: "absolute", top: "3.3cm", left: "1.5cm" }}>
                                                    {Farmer.find(f => f.value === masterData.maid)?.label || ""}
                                                </div>

                                                {/* गाव */}
                                                <div style={{ position: "absolute", top: "3.4cm", left: "11.9cm" }}>
                                                    {masterData.village_name}
                                                </div>

                                                {/* Table rows - only 8 per bill */}
                                                {pageRows.slice(0, 9).map((item, index) => {
                                                    const rowTop = 5.2 + index * 0.6;
                                                    return (
                                                        <React.Fragment key={index}>
                                                            <div style={{ position: "absolute", top: `${rowTop}cm`, left: "1.6cm", fontSize: "10pt" }}>
                                                                {vyapari.find(v => v.value === item.vyapariname)?.label || ""}
                                                            </div>
                                                            <div style={{ position: "absolute", top: `${rowTop}cm`, left: "5.3cm", fontSize: "10pt" }}>
                                                                {item.carets}
                                                            </div>
                                                            <div style={{ position: "absolute", top: `${rowTop}cm`, left: "7cm", fontSize: "10pt" }}>
                                                                {item.weight}
                                                            </div>
                                                            <div style={{ position: "absolute", top: `${rowTop}cm`, left: "9cm", fontSize: "10pt" }}>
                                                                {item.rate}
                                                            </div>
                                                            <div style={{ position: "absolute", top: `${rowTop}cm`, left: "11.5cm", fontSize: "10pt" }}>
                                                                {(item.rate * (item.weight / 20)).toFixed(2)}
                                                            </div>
                                                        </React.Fragment>
                                                    );
                                                })}

                                                {/* Totals only on last page */}
                                                {pageIndex === chunkedData.length - 1 && (
                                                    <>
                                                        {/* एकूण */}
                                                        <div style={{ position: "absolute", top: "11.4cm", left: "11.3cm" }}>
                                                            {masterData.ekunrakkam}
                                                        </div>

                                                        {serviceData1.slice(0, 6).map((item, index) => {
                                                            const rowTop = 12 + index * 0.6;
                                                            return (
                                                                <div
                                                                    key={index}
                                                                    style={{
                                                                        position: "absolute",
                                                                        top: `${rowTop}cm`,
                                                                        left: "1.2cm",
                                                                        fontSize: "11pt",
                                                                        display: "flex",
                                                                        width: "4cm",
                                                                        height: "0.4cm",
                                                                        lineHeight: "0.4cm",
                                                                    }}
                                                                >
                                                                    <div style={{
                                                                        width: "1.6cm",
                                                                        overflow: "hidden",
                                                                        whiteSpace: "nowrap",
                                                                        textOverflow: "ellipsis"
                                                                    }}>
                                                                        {item.nSERVICETYPETITLE}
                                                                    </div>
                                                                    <div style={{
                                                                        width: "2cm",
                                                                        overflow: "hidden",
                                                                        textAlign: "right",
                                                                        whiteSpace: "nowrap"
                                                                    }}>
                                                                        {item.sevaValue}
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}


                                                        {/* एकूण रु. */}
                                                        <div style={{ position: "absolute", top: "14.5cm", left: "2.5cm" }}>
                                                            {masterData.ekunkharch}
                                                        </div>
                                                        {/* एकूण खर्च */}
                                                        <div style={{ position: "absolute", top: "12.5cm", left: "9.5cm" }}>
                                                            {masterData.ekunkharch}
                                                        </div>



                                                        {/* रोख मिळाले */}
                                                        <div style={{ position: "absolute", top: "13cm", left: "9.5cm" }}>
                                                            {masterData.rokh}
                                                        </div>

                                                        {/* बाकी रक्कम */}
                                                        <div style={{ position: "absolute", top: "13.5cm", left: "9.5cm" }}>
                                                            {masterData.bakirakkam}
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >

        </div >

    );
};

export default AddFarmerBill;