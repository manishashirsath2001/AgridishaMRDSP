import React, { useState, useEffect, useRef } from 'react';
import Select from "react-select";
import axios from 'axios';
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import {
    ArrowLeft,
    ChevronDown,
    LifeBuoy
} from "feather-icons-react/build/IconComponents";
import withReactContent from "sweetalert2-react-content";
import { all_routes } from "../../Router/all_routes";
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import { ACSPLGUID, baseUrl } from "../../core/json/custom";
import { getUserData } from '../../Context/UserData';
const AddCashInvertModel = ({ CASID, onRefresh }) => {
    const { userdetail } = getUserData();
    const location = useLocation();
    const route = all_routes;
    const navigate = useNavigate();
    // const { CASID } = location.state || {};
    const GUID = ACSPLGUID.getNew();

    const [formData, setFormData] = useState({
        CASBANKNAME: '',
        CASDATE: '',
        invertCashAmount: 0
    });


    const DateRef = useRef(null);
    const BankNameRef = useRef(null);
    const InvertCashRef = useRef(null);
    // const MultiplierRef = useRef(null);
    const CoinsRef = useRef(null);

    const [currentDate, setCurrentDate] = useState('');
    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        setCurrentDate(today);

        if (BankNameRef?.current) {
            BankNameRef.current.focus();
        }

    }, []);

    const [bankname, setBankName] = useState([]);
    const fetchBankName = async () => {
        try {
            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            const payload = {
                companyid: userdetail?.companyID || "",
                deptid: userdetail?.departmentID || "",
            };

            const response = await axios.post(
                `${baseUrl.Url}/backend/api/GET_BankName`,
                payload,
                { headers }
            );
            if (response.status !== 200)
                throw new Error("Failed to fetch data");

            const data = response.data;
            const BankData = data
                .map(({ bankname, bankid }) => ({
                    label: bankname,
                    value: bankid,
                }));
            setBankName(BankData);
        } catch (error) {
            console.error("Error fetching bank data:", error);
        }
    };

    useEffect(() => {
        fetchBankName();
        if (BankNameRef?.current) {
            BankNameRef.current.focus();
        }
    }, []);

    const cashValues = [2000, 500, 200, 100, 50, 20, 10];
    const [multipliers, setMultipliers] = useState(new Array(cashValues.length).fill(''));
    const [coinMultipliers, setCoinMultipliers] = useState([0]);

    const calculateTotal = () => {
        const cashTotal = cashValues.reduce(
            (acc, cash, index) => acc + cash * multipliers[index],
            0
        );
        const coinTotal = coinMultipliers.reduce(
            (acc, coin) => acc + coin,
            0
        );
        return cashTotal + coinTotal;
    };

    // const handleMultiplierChange = (e, index) => {

    //     const value = e.target.value;

    //     // Allow only numbers and optional decimals
    //     if (!/^\d*\.?\d*$/.test(value)) return;

    //     const updatedMultipliers = [...multipliers];
    //     updatedMultipliers[index] = Number(e.target.value);
    //     setMultipliers(updatedMultipliers);
    // };

    // const handleCoinMultiplierChange = (e, index) => {

    //     const value = e.target.value;

    //     // Allow only numbers and optional decimals
    //     if (!/^\d*\.?\d*$/.test(value)) return;


    //     const updatedMultipliers = [...coinMultipliers];
    //     updatedMultipliers[index] = Number(e.target.value);
    //     setCoinMultipliers(updatedMultipliers);
    // };

    const handleMultiplierChange = (e, index) => {
        const value = e.target.value;

        // Allow only numbers and optional decimals
        if (!/^\d*\.?\d*$/.test(value)) return;

        const updatedMultipliers = [...multipliers];
        updatedMultipliers[index] = value === '' ? '' : Number(value);
        setMultipliers(updatedMultipliers);
    };

    const handleCoinMultiplierChange = (e, index) => {
        const value = e.target.value;

        // Allow only numbers and optional decimals
        if (!/^\d*\.?\d*$/.test(value)) return;

        const updatedMultipliers = [...coinMultipliers];
        updatedMultipliers[index] = value === '' ? '' : Number(value);
        setCoinMultipliers(updatedMultipliers);
    };





    const [totalAmount, setTotalAmount] = useState(null);

    const handleInvertCashAmountChange = (e) => {
        const enteredAmount = e.target.value;

        if (!/^\d*$/.test(enteredAmount)) return;

        setFormData(prevData => ({
            ...prevData,
            invertCashAmount: enteredAmount
        }));
    };

    // const compareAmounts = () => {

    //     if (!formData.invertCashAmount) {
    //         Swal.fire({
    //             icon: 'warning',
    //             title: 'Input Required',
    //             text: 'Please enter the Invert Cash Amount',
    //             confirmButtonText: 'OK',
    //         });
    //         return false;
    //     }


    //     if (Number(formData.invertCashAmount) < totalAmount) {
    //         Swal.fire({
    //             icon: 'success',
    //             title: 'valid Amount',
    //             text: 'Invert Cash Amount valid',
    //             confirmButtonText: 'OK',
    //         });
    //         return true;
    //     }

    //     if (Number(formData.invertCashAmount) > totalAmount) {
    //         Swal.fire({
    //             icon: 'warning',
    //             title: 'Invalid Amount',
    //             text: 'Invert Cash Amount cannot be greater than the Total Amount.',
    //             confirmButtonText: 'OK',
    //         });
    //         return false;
    //     }

    //     Swal.fire({
    //         icon: 'success',
    //         title: 'Success!',
    //         text: 'Invert Cash Amount is valid.',
    //         confirmButtonText: 'OK',
    //     });

    //     return true;
    // };


    // const compareAmounts = () => {
    //     if (!formData.invertCashAmount) {
    //         Swal.fire({
    //             icon: 'warning',
    //             title: 'Input Required',
    //             text: 'Please enter the Invert Cash Amount',
    //             confirmButtonText: 'OK',
    //         });
    //         return false;
    //     }

    //     if (Number(formData.invertCashAmount) <= totalAmount) {
    //         return true;

    //     } else {
    //         // Condition is false, show warning
    //         Swal.fire({
    //             icon: 'warning',
    //             title: 'Invalid Amount',
    //             text: 'Invert Cash Amount should not be greater than the Total Amount.',
    //             confirmButtonText: 'OK',
    //         });
    //         return false;
    //     }

    //     return false;
    // };


    const compareAmounts = () => {
        // Check if Invert Cash Amount is empty
        if (!formData.invertCashAmount) {
            Swal.fire({
                icon: 'warning',
                title: 'Input Required',
                text: 'Please enter the Invert Cash Amount',
                confirmButtonText: 'OK',
            });
            return false;
        }


        // const enteredAmount = Number(formData.invertCashAmount);


        // if (enteredAmount > totalAmount) {
        //     Swal.fire({
        //         icon: 'warning',
        //         title: 'Invalid Amount',
        //         text: 'Invert Cash Amount should not be greater than the Total Amount.',
        //         confirmButtonText: 'OK',
        //     });
        //     return false;
        // }

        // Everything is fine, return true
        return true;
    };







    // const handleSubmit = async (event) => {
    //     const finalTotal = calculateTotal();
    //     setTotalAmount(finalTotal);
    //     showConfirmationAlert(event);

    //     if (compareAmounts()) {
    //         try {
    //             const payload = {
    //                 casid: CASID ? CASID : GUID,
    //                 casdate: currentDate,
    //                 casbankname: formData.CASBANKNAME,
    //                 casinvertcash: Number(formData.invertCashAmount),
    //                 cas2000: multipliers[0],
    //                 cas500: multipliers[1],
    //                 cas200: multipliers[2],
    //                 cas100: multipliers[3],
    //                 cas50: multipliers[4],
    //                 cas20: multipliers[5],
    //                 cas10: multipliers[6],
    //                 cascoins: coinMultipliers[0],
    //                 castotal: finalTotal,
    //                 companyid: "",
    //                 deptid: ""
    //             };

    //             const headers = {
    //                 "Content-Type": "application/json",
    //                 Accept: "*/*",
    //             };


    //             const response = await axios({
    //                 method: "POST",
    //                 url: `${baseUrl.Url}/backend/api/SP_AddCashInvert`,
    //                 data: JSON.stringify(payload),
    //                 headers: headers,
    //             });


    //             console.log('API Response:', response);


    //             if (response.status === 200) {
    //                 Swal.fire({
    //                     icon: 'success',
    //                     title: 'Success!',
    //                     text: 'Data submitted successfully!',
    //                     confirmButtonText: 'OK',
    //                 });
    //             } else {
    //                 Swal.fire({
    //                     icon: 'error',
    //                     title: 'Submission Failed',
    //                     text: 'Failed to submit data. Please try again later.',
    //                     confirmButtonText: 'OK',
    //                 });
    //             }
    //         } catch (error) {
    //             console.error("Error submitting data:", error);
    //             Swal.fire({
    //                 icon: 'error',
    //                 title: 'Error',
    //                 text: 'An error occurred while submitting data.',
    //                 confirmButtonText: 'OK',
    //             });
    //         }
    //     }
    // };

    const [dataExists, setDataExists] = useState([]);

    useEffect(() => {
        const checkIfDataExists = async () => {
            try {
                const payload = {
                    companyid: userdetail?.companyID || "",
                    deptid: userdetail?.departmentID || "",
                };

                const headers = {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                };

                // API call to check if data exists
                const response = await axios({
                    method: "POST",
                    url: `${baseUrl.Url}/backend/api/GET_GateCashSummary`, // Your POST API to check for data
                    data: JSON.stringify(payload),  // Send the payload as a JSON string
                    headers: headers,  // Set headers
                });

                // Process response based on status
                if (response.status === 200) {
                    setDataExists(response.data);  // Data exists, meaning we need to update
                } else {
                    setDataExists([]);  // Data doesn't exist, meaning we need to insert
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        // Call the function when CASID changes (or any other state you need)
        checkIfDataExists();
    }, []);



    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('Form submitted:', formData);
        showConfirmationAlert(event);
    };


    // const handleFormSubmission = async (event) => {


    //     console.log("summry data", dataExists);
    //     const finalTotal = calculateTotal();
    //     setTotalAmount(finalTotal);
    //     showConfirmationAlert(event);

    //     if (compareAmounts()) {
    //         try {
    //             // // Payload for the first API call
    //             const payload = {
    //                 casid: CASID ? CASID : GUID,
    //                 casdate: currentDate,
    //                 casbankname: formData.CASBANKNAME,
    //                 casinvertcash: Number(formData.invertCashAmount),
    //                 cas2000: multipliers[0] || 0,
    //                 cas500: multipliers[1] || 0,
    //                 cas200: multipliers[2] || 0,
    //                 cas100: multipliers[3] || 0,
    //                 cas50: multipliers[4] || 0,
    //                 cas20: multipliers[5] || 0,
    //                 cas10: multipliers[6] || 0,
    //                 cascoins: coinMultipliers[0] || 0,
    //                 castotal: finalTotal,
    //                 "companyid": userdetail?.companyID ? userdetail.companyID : "",
    //                 "deptid": userdetail?.departmentID ? userdetail.departmentID : "",
    //                 uaid: userdetail?.uaid || "",
    //             };

    //             const headers = {
    //                 "Content-Type": "application/json",
    //                 Accept: "*/*",
    //             };

    //             // First API call to /backend/api/SP_AddCashInvert
    //             const response = await axios({
    //                 method: "POST",
    //                 url: `${baseUrl.Url}/backend/api/SP_AddCashInvert`,
    //                 data: JSON.stringify(payload),
    //                 headers: headers,
    //             });

    //             console.log('API Response:', response);

    //             if (response.status === 200) {
    //                 // Success message for the first API

    //                 // Second API call to /api/SP_AddUpdCashSummary
    //                 const cashSummaryPayload = {
    //                     casid: dataExists[0].casid,
    //                     casdate: dataExists[0].casdate,
    //                     casbankname: dataExists[0].casbankname,
    //                     casinvertcash: parseFloat(dataExists[0].casinvertcash) + Number(formData.invertCashAmount),
    //                     caS2000: parseFloat(dataExists[0].caS2000) + parseFloat(multipliers[0] || 0),
    //                     caS500: parseFloat(dataExists[0].caS500) + parseFloat(multipliers[1] || 0),
    //                     caS200: parseFloat(dataExists[0].caS200) + parseFloat(multipliers[2] || 0),
    //                     caS100: parseFloat(dataExists[0].caS100) + parseFloat(multipliers[3] || 0),
    //                     caS50: parseFloat(dataExists[0].caS50) + parseFloat(multipliers[4] || 0),
    //                     caS20: parseFloat(dataExists[0].caS20) + parseFloat(multipliers[5] || 0),
    //                     caS10: parseFloat(dataExists[0].caS10) + parseFloat(multipliers[6] || 0),
    //                     cascoins: parseFloat(dataExists[0].cascoins) + parseFloat(coinMultipliers[0] || 0),
    //                     castotal: parseFloat(dataExists[0].castotal) + parseFloat(finalTotal),
    //                     "companyid": userdetail?.companyID ? userdetail.companyID : "",
    //                     "deptid": userdetail?.departmentID ? userdetail.departmentID : "",
    //                 };


    //                 console.log(cashSummaryPayload, "cashSummaryPayload");
    //                 // Send data to /backend/api/SP_AddUpdCashSummary
    //                 const summaryResponse = await axios({
    //                     method: "POST",
    //                     url: `${baseUrl.Url}/backend/api/SP_AddUpdCashSummary`,
    //                     data: JSON.stringify(cashSummaryPayload),
    //                     headers: headers,
    //                 });

    //                 // Handle the response from the second API call
    //                 if (summaryResponse.status === 200) {
    //                     Swal.fire({
    //                         icon: 'success',
    //                         title: 'Success!',
    //                         text: 'Data submitted successfully!',
    //                         confirmButtonText: 'OK',
    //                     }).then(() => {
    //                         // Reset form and state instead of reloading
    //                         setFormData({
    //                             CASBANKNAME: '',
    //                             CASDATE: '',
    //                             invertCashAmount: 0
    //                         });
    //                         setMultipliers(new Array(cashValues.length).fill(''));
    //                         setCoinMultipliers([0]);
    //                         fetchBankName(); // or any data fetch logic again
    //                     });
    //                 } else {
    //                     Swal.fire({
    //                         icon: 'error',
    //                         title: 'Summary Update Failed',
    //                         text: 'Failed to update the cash summary. Please try again later.',
    //                         confirmButtonText: 'OK',
    //                     });
    //                 }
    //             } else {
    //                 Swal.fire({
    //                     icon: 'error',
    //                     title: 'Submission Failed',
    //                     text: 'Failed to submit data. Please try again later.',
    //                     confirmButtonText: 'OK',
    //                 });
    //             }
    //         } catch (error) {
    //             console.error("Error submitting data:", error);
    //             Swal.fire({
    //                 icon: 'error',
    //                 title: 'Error',
    //                 text: 'An error occurred while submitting data.',
    //                 confirmButtonText: 'OK',
    //             });
    //         }
    //     }
    // };

    // const handleFormSubmission = async (event) => {
    //     console.log("Summary data", dataExists);

    //     const finalTotal = calculateTotal();
    //     setTotalAmount(finalTotal);
    //     showConfirmationAlert(event);

    //     if (!compareAmounts()) {
    //         return; // Stop execution if amounts don't match
    //     }

    //     try {
    //         // Payload for Cash Invert API call
    //         const payload = {
    //             casid: CASID ? CASID : GUID,
    //             casdate: currentDate,
    //             casbankname: formData.CASBANKNAME,
    //             casinvertcash: Number(formData.invertCashAmount),
    //             cas2000: multipliers[0] || 0,
    //             cas500: multipliers[1] || 0,
    //             cas200: multipliers[2] || 0,
    //             cas100: multipliers[3] || 0,
    //             cas50: multipliers[4] || 0,
    //             cas20: multipliers[5] || 0,
    //             cas10: multipliers[6] || 0,
    //             cascoins: coinMultipliers[0] || 0,
    //             castotal: finalTotal,
    //             companyid: userdetail?.companyID || "",
    //             deptid: userdetail?.departmentID || "",
    //             uaid: userdetail?.uaid || "",
    //         };

    //         const headers = {
    //             "Content-Type": "application/json",
    //             Accept: "*/*",
    //         };

    //         // 1️⃣ First API Call: Save Cash Invert Data
    //         const response = await axios.post(
    //             `${baseUrl.Url}/backend/api/SP_AddCashInvert`,
    //             JSON.stringify(payload),
    //             { headers }
    //         );

    //         console.log("SP_AddCashInvert Response:", response);

    //         if (response.status === 200) {
    //             // 2️⃣ Proceed to update Cash Summary if existing summary data exists
    //             if (dataExists && dataExists.length > 0 && dataExists[0]) {
    //                 const existing = dataExists[0];

    //                 const cashSummaryPayload = {
    //                     casid: existing.casid, // Use existing casid for update
    //                     casdate: existing.casdate,
    //                     casbankname: existing.casbankname,
    //                     casinvertcash: parseFloat(existing.casinvertcash) + Number(formData.invertCashAmount),
    //                     caS2000: parseFloat(existing.caS2000) + parseFloat(multipliers[0] || 0),
    //                     caS500: parseFloat(existing.caS500) + parseFloat(multipliers[1] || 0),
    //                     caS200: parseFloat(existing.caS200) + parseFloat(multipliers[2] || 0),
    //                     caS100: parseFloat(existing.caS100) + parseFloat(multipliers[3] || 0),
    //                     caS50: parseFloat(existing.caS50) + parseFloat(multipliers[4] || 0),
    //                     caS20: parseFloat(existing.caS20) + parseFloat(multipliers[5] || 0),
    //                     caS10: parseFloat(existing.caS10) + parseFloat(multipliers[6] || 0),
    //                     cascoins: parseFloat(existing.cascoins) + parseFloat(coinMultipliers[0] || 0),
    //                     castotal: parseFloat(existing.castotal) + parseFloat(finalTotal),
    //                     companyid: userdetail?.companyID || "",
    //                     deptid: userdetail?.departmentID || "",
    //                 };

    //                 // Log the summary payload for debugging
    //                 console.log("Cash Summary Payload:", cashSummaryPayload);

    //                 // 2️⃣ API Call: Update Cash Summary Data
    //                 const summaryResponse = await axios.post(
    //                     `${baseUrl.Url}/backend/api/SP_AddUpdCashSummary`,
    //                     JSON.stringify(cashSummaryPayload),
    //                     { headers }
    //                 );

    //                 console.log("SP_AddUpdCashSummary Response:", summaryResponse);

    //                 if (summaryResponse.status === 200) {
    //                     Swal.fire({
    //                         icon: 'success',
    //                         title: 'Success!',
    //                         text: 'Data submitted successfully and summary updated.',
    //                         confirmButtonText: 'OK',
    //                     })
    //                 } else {
    //                     Swal.fire({
    //                         icon: 'error',
    //                         title: 'Summary Update Failed',
    //                         text: 'Failed to update the cash summary. Please try again later.',
    //                         confirmButtonText: 'OK',
    //                     });
    //                 }
    //             } else {
    //                 // Show message if no summary exists to update
    //                 Swal.fire({
    //                     icon: 'warning',
    //                     title: 'No Existing Summary',
    //                     text: 'Cash invert saved, but no summary found to update.',
    //                     confirmButtonText: 'OK',
    //                 });
    //             }
    //         } else {
    //             Swal.fire({
    //                 icon: 'error',
    //                 title: 'Submission Failed',
    //                 text: 'Failed to submit data. Please try again later.',
    //                 confirmButtonText: 'OK',
    //             });
    //         }
    //     } catch (error) {
    //         console.error("Error in handleFormSubmission:", error);
    //         Swal.fire({
    //             icon: 'error',
    //             title: 'Error',
    //             text: 'An error occurred while submitting data.',
    //             confirmButtonText: 'OK',
    //         });
    //     }
    // };

    const handleFormSubmission = async (event) => {
        event.preventDefault();

        console.log("Summary data:", dataExists);
        const finalTotal = calculateTotal();
        setTotalAmount(finalTotal);
        showConfirmationAlert(event);

        if (!compareAmounts()) {
            return; // Do not proceed if amounts don't match
        }

        try {
            const payload = {
                casid: CASID || GUID,
                casdate: currentDate,
                casbankname: formData.CASBANKNAME,
                casinvertcash: Number(formData.invertCashAmount),
                cas2000: multipliers[0] || 0,
                cas500: multipliers[1] || 0,
                cas200: multipliers[2] || 0,
                cas100: multipliers[3] || 0,
                cas50: multipliers[4] || 0,
                cas20: multipliers[5] || 0,
                cas10: multipliers[6] || 0,
                cascoins: coinMultipliers[0] || 0,
                castotal: finalTotal,
                companyid: userdetail?.companyID || "",
                deptid: userdetail?.departmentID || "",
                uaid: userdetail?.uaid || "",
            };

            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            // First API call to insert cash invert
            const response = await axios.post(
                `${baseUrl.Url}/backend/api/SP_AddCashInvert`,
                JSON.stringify(payload),
                { headers }
            );

            console.log('API Response:', response);

            if (response.status === 200) {
                const baseCasId = dataExists.length > 0 ? dataExists[0].casid : (CASID || GUID);
                const baseCasDate = dataExists.length > 0 ? dataExists[0].casdate : currentDate;
                const baseBankName = dataExists.length > 0 ? dataExists[0].casbankname : formData.CASBANKNAME;

                // First ADD call if no previous summary exists
                if (dataExists.length === 0) {
                    const addPayload = {
                        casid: baseCasId,
                        casdate: baseCasDate,
                        casbankname: baseBankName,
                        casinvertcash: Number(formData.invertCashAmount),
                        caS2000: parseFloat(multipliers[0] || 0),
                        caS500: parseFloat(multipliers[1] || 0),
                        caS200: parseFloat(multipliers[2] || 0),
                        caS100: parseFloat(multipliers[3] || 0),
                        caS50: parseFloat(multipliers[4] || 0),
                        caS20: parseFloat(multipliers[5] || 0),
                        caS10: parseFloat(multipliers[6] || 0),
                        cascoins: parseFloat(coinMultipliers[0] || 0),
                        castotal: parseFloat(finalTotal),
                        companyid: userdetail?.companyID || "",
                        deptid: userdetail?.departmentID || "",
                    };

                    await axios.post(
                        `${baseUrl.Url}/backend/api/SP_AddUpdCashSummary`,
                        JSON.stringify(addPayload),
                        { headers }
                    );
                }

                // Then UPDATE existing/added summary
                const updatePayload = {
                    casid: baseCasId,
                    casdate: baseCasDate,
                    casbankname: baseBankName,
                    casinvertcash: (parseFloat(dataExists[0]?.casinvertcash || 0) + Number(formData.invertCashAmount)),
                    caS2000: (parseFloat(dataExists[0]?.caS2000 || 0) + parseFloat(multipliers[0] || 0)),
                    caS500: (parseFloat(dataExists[0]?.caS500 || 0) + parseFloat(multipliers[1] || 0)),
                    caS200: (parseFloat(dataExists[0]?.caS200 || 0) + parseFloat(multipliers[2] || 0)),
                    caS100: (parseFloat(dataExists[0]?.caS100 || 0) + parseFloat(multipliers[3] || 0)),
                    caS50: (parseFloat(dataExists[0]?.caS50 || 0) + parseFloat(multipliers[4] || 0)),
                    caS20: (parseFloat(dataExists[0]?.caS20 || 0) + parseFloat(multipliers[5] || 0)),
                    caS10: (parseFloat(dataExists[0]?.caS10 || 0) + parseFloat(multipliers[6] || 0)),
                    cascoins: (parseFloat(dataExists[0]?.cascoins || 0) + parseFloat(coinMultipliers[0] || 0)),
                    castotal: (parseFloat(dataExists[0]?.castotal || 0) + parseFloat(finalTotal)),
                    companyid: userdetail?.companyID || "",
                    deptid: userdetail?.departmentID || "",
                };

                const summaryResponse = await axios.post(
                    `${baseUrl.Url}/backend/api/SP_AddUpdCashSummary`,
                    JSON.stringify(updatePayload),
                    { headers }
                );

                if (summaryResponse.status === 200) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success!',
                        text: 'Data submitted and summary updated successfully!',
                        confirmButtonText: 'OK',
                    }).then(() => {
                        setFormData({
                            CASBANKNAME: '',
                            CASDATE: '',
                            invertCashAmount: 0,
                        });
                        setMultipliers(new Array(cashValues.length).fill(''));
                        setCoinMultipliers([0]);
                        fetchBankName();
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Summary Update Failed',
                        text: 'Failed to update the cash summary. Please try again later.',
                        confirmButtonText: 'OK',
                    });
                }
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Submission Failed',
                    text: 'Failed to submit data. Please try again later.',
                    confirmButtonText: 'OK',
                });
            }
        } catch (error) {
            console.error("Error submitting data:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'An error occurred while submitting data.',
                confirmButtonText: 'OK',
            });
        }
    };





    useEffect(() => {
        const handleShortcut = (e) => {
            if (e.ctrlKey && e.key === 'e' || e.ctrlKey && e.key === 'E') {
                e.preventDefault();
                showExitAlert();
            }
            if (e.ctrlKey && e.key === 's' || e.ctrlKey && e.key === 'S') {
                e.preventDefault();
                validateinput(e);
            }
        };

        window.addEventListener('keydown', handleShortcut);

        return () => {
            window.removeEventListener('keydown', handleShortcut);
        };
    }, [navigate, formData]);


    const validateinput = (e) => {
        const { CASBANKNAME, invertCashAmount } = formData;

        // Validate Bank Name (from <Select>)
        if (!CASBANKNAME) {
            Swal.fire({
                icon: "error",
                title: "Validation Error",
                text: "कृपया बँकेचे नाव निवडा.",
            }).then(() => {
                BankNameRef.current.focus();
            });
            return;
        }

        // Validate Invert Cash Amount (must be positive integer only)
        if (
            !invertCashAmount ||
            !/^\d*\.?\d*$/.test(invertCashAmount) ||  // Only digits, no decimals
            parseInt(invertCashAmount, 10) <= 0
        ) {
            Swal.fire({
                icon: "error",
                title: "Validation Error",
                text: "कृपया नोटांची वैध रक्कम भरा (पूर्णांक आणि शून्याहून जास्त).",
            }).then(() => {
                InvertCashRef.current.focus();
            });
            return;
        }



        // If all validations pass:
        handleSubmit(e);
    };


    useEffect(() => {
        const fetchData = async () => {
            if (CASID) {
                try {
                    const payload = {
                        casid: CASID,
                        keyword: "%",
                        companyid: userdetail?.companyID || "",
                        deptid: userdetail?.departmentID || "",

                    };

                    const headers = {
                        "Content-Type": "application/json",
                        Accept: "*/*",
                    };

                    const response = await axios({
                        method: "POST",
                        url: baseUrl.Url + "/backend/api/GET_GateCashInvert",
                        data: JSON.stringify(payload),
                        headers: headers,
                    });

                    if (response.status !== 200) {
                        throw new Error("Failed to Fetch bank Data");
                    }

                    let apiData = response.data[0];

                    setFormData((prev) => ({
                        ...prev,
                        CASBANKNAME: apiData.casbankname,
                        invertCashAmount: apiData.casinvertcash,
                    }));

                    setMultipliers([
                        apiData.caS2000,
                        apiData.caS500,
                        apiData.caS200,
                        apiData.caS100,
                        apiData.caS50,
                        apiData.caS20,
                        apiData.caS10,
                    ]);

                    setCoinMultipliers([apiData.cascoins]);

                } catch (error) {
                    console.error("Error fetching Access Right Data:", error);
                }
            }
        };

        fetchData();
    }, [CASID]);



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

    const closeModal = () => {
        const modal = document.getElementById("AddCashInvert");
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
            onRefresh(); // refreshReceiptData from Bills.jsx
        }
    };

    window.addEventListener("popstate", () => {
        const modal = document.getElementById("AddCashInvert");
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
            const modal = document.getElementById("AddCashInvert");
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

            setFormData({
                CASBANKNAME: '',
                CASDATE: '',
                invertCashAmount: 0
            });
            setMultipliers(new Array(cashValues.length).fill(''));
            setCoinMultipliers([0]);
            fetchBankName();
        });
    };





    const handleEnterKey = (e, nextRef) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (nextRef && nextRef.current) {
                nextRef.current.focus();
            }
        }
    };

    const MultiplierRefs = useRef([]);
    MultiplierRefs.current = cashValues.map((_, index) => MultiplierRefs.current[index] || React.createRef());


    return (

        <div
            className="modal fade"
            id="AddCashInvert"
            tabIndex="-1"
            aria-labelledby="exampleModalFullscreenLabel"
            aria-hidden="true"
        >
            <div className="modal-dialog modal-fullscreen">
                <div className="modal-content">

                    <div className="modal-header border-0 custom-modal-header">
                        <div className="page-title d-flex align-items-center">
                            <h4 className="me-1">नोटांची नोंदणी </h4>
                        </div>
                        {/* <button
                            type="button"
                            className="btn-close"
                            // data-bs-dismiss="modal"
                            onClick={showExitAlert}
                            aria-label="Close"
                        ></button> */}
                        <div className="col-12 col-md-auto">
                            <Link
                                className="btn btn-secondary w-100"
                                onClick={showExitAlert}
                            >
                                <ArrowLeft className="me-2" />
                                मागे
                            </Link>
                        </div>
                    </div>

                    <div className="modal-body mbgcolor">
                        <div className="content">
                            <form onSubmit={handleSubmit}>
                                <div className="container-fluid">
                                    <div className="row">
                                        <div className="col-lg-2 col-sm-6 col-12">
                                            <div className="mb-3 add-product">
                                                <label className="form-label required">तारीख</label>
                                                <input
                                                    type="date"
                                                    className="form-control"
                                                    value={currentDate}
                                                    ref={DateRef}
                                                    onKeyDown={(e) => handleEnterKey(e, BankNameRef)}
                                                    readOnly
                                                />
                                            </div>
                                        </div>

                                        <div className="col-lg-7 col-sm-6 col-12">
                                            <div className="mb-3 add-product">
                                                <label className="form-label required">बँकेचे नाव</label>
                                                <Select
                                                    placeholder="Select BankName"
                                                    classNamePrefix="react-select"
                                                    options={bankname}
                                                    value={bankname.find(option => option.value === formData.CASBANKNAME) || null}
                                                    onChange={(selectedOption) => {
                                                        setFormData(prevState => ({
                                                            ...prevState,
                                                            CASBANKNAME: selectedOption ? selectedOption.value : ""
                                                        }))

                                                        if (InvertCashRef.current) {
                                                            InvertCashRef.current.focus();
                                                        }
                                                    }}
                                                    ref={BankNameRef}
                                                    // onKeyDown={(e) => handleEnterKey(e, InvertCashRef)}
                                                    openMenuOnFocus={true}
                                                />
                                            </div>
                                        </div>

                                        <div className="col-lg-3 col-sm-6 col-12">
                                            <div className="mb-3 add-product">
                                                <label className="form-label required">नोटांची रक्कम</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Enter amount"
                                                    value={formData.invertCashAmount}
                                                    onChange={handleInvertCashAmountChange} // Correct handler
                                                    min="0"
                                                    ref={InvertCashRef}
                                                    onKeyDown={(e) => handleEnterKey(e, MultiplierRefs.current[0])}
                                                    inputMode="numeric"
                                                    title="Please enter a valid number."
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="table-responsive  mx-auto " style={{ width: '70%' }}>
                                        <table className="table table-bordered table-striped table-sm ml-5 border-dark">
                                            <thead className="thead-dark bg-dark text-white">
                                                <tr>
                                                    <th className="col-sm-1">नगदी मूल्य</th>
                                                    <th className="col-sm-1">गुणक</th>
                                                    <th className="col-sm-1">एकूण रक्कम</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {cashValues.map((cash, index) => (
                                                    <tr key={index}>
                                                        <td>{cash}</td>
                                                        <td>
                                                            <input
                                                                type="text"
                                                                value={multipliers[index]}
                                                                onChange={(e) => handleMultiplierChange(e, index)}
                                                                className="form-control"
                                                                ref={MultiplierRefs.current[index]}  // Updated to handle multiple refs
                                                                onKeyDown={(e) => handleEnterKey(e, MultiplierRefs.current[index + 1] || CoinsRef)}
                                                                min="0"
                                                                pattern="[0-9]*" // optional HTML hint
                                                            />
                                                        </td>
                                                        <td>{cash * multipliers[index]}</td>
                                                    </tr>
                                                ))}

                                                <tr>
                                                    <td><strong>नाणी</strong></td>
                                                    <td>
                                                        <input
                                                            type="text"
                                                            value={coinMultipliers[0]}
                                                            onChange={(e) => handleCoinMultiplierChange(e, 0)}
                                                            className="form-control"
                                                            ref={CoinsRef}
                                                            min="0"
                                                        />
                                                    </td>
                                                    <td>{coinMultipliers[0]}</td>
                                                </tr>

                                                <tr>
                                                    <td><strong>एकूण रक्कम</strong></td>
                                                    <td></td>
                                                    <td>
                                                        <strong>
                                                            {calculateTotal()}
                                                        </strong>
                                                    </td>
                                                </tr>
                                            </tbody>


                                        </table>
                                    </div>

                                    <div className="text-end mt-2">
                                        <button
                                            type="button"
                                            className="btn btn-cancel me-2"
                                            // data-bs-dismiss="modal"
                                            onClick={showExitAlert}
                                        >
                                            मागे
                                        </button>
                                        <button type="submit" className="btn btn-submit" onClick={handleSubmit}>
                                            सेव्ह
                                        </button>
                                    </div>
                                </div>



                            </form>

                        </div>

                    </div>

                </div>
            </div >
        </div >


    );
};

export default AddCashInvertModel;

