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
const AddCashInvert = () => {
    const { userdetail } = getUserData();
    const location = useLocation();
    const route = all_routes;
    const navigate = useNavigate();
    const { CASID } = location.state || {};
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
        BankNameRef?.current?.focus()
    }, []);

    const [bankname, setBankName] = useState([]);
    const fetchBankName = async () => {
        try {
            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            const payload = {
                "companyid": "",
                "deptid": ""
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

    const handleMultiplierChange = (e, index) => {
        const updatedMultipliers = [...multipliers];
        updatedMultipliers[index] = Number(e.target.value);
        setMultipliers(updatedMultipliers);
    };

    const handleCoinMultiplierChange = (e, index) => {
        const updatedMultipliers = [...coinMultipliers];
        updatedMultipliers[index] = Number(e.target.value);
        setCoinMultipliers(updatedMultipliers);
    };



    const [totalAmount, setTotalAmount] = useState(null);

    const handleInvertCashAmountChange = (e) => {
        const enteredAmount = e.target.value;
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


    const compareAmounts = () => {
        if (!formData.invertCashAmount) {
            Swal.fire({
                icon: 'warning',
                title: 'इनपुट आवश्यक आहे',
                text: 'कृपया इनव्हर्ट रोख रक्कम भरा',
                confirmButtonText: 'ठीक आहे',
                allowOutsideClick: false,
                allowEscapeKey: false,

            });
            return false;
        }

        if (Number(formData.invertCashAmount) <= totalAmount) {
            return true;

        } else {
            // Condition is false, show warning
            Swal.fire({
                icon: 'warning',
                title: 'अवैध रक्कम',
                text: 'इनव्हर्ट रोख रक्कम एकूण रक्कमेपेक्षा जास्त नसावी.',
                confirmButtonText: 'ठीक आहे',
                allowOutsideClick: false,
                allowEscapeKey: false,

            });
            return false;
        }

        return false;
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
                    "companyid": "",
                    "deptid": ""
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


    const handleFormSubmission = async (event) => {


        console.log("summry data", dataExists);
        const finalTotal = calculateTotal();
        setTotalAmount(finalTotal);
        // showConfirmationAlert(event);

        if (compareAmounts()) {
            try {
                // Payload for the first API call
                const payload = {
                    casid: CASID ? CASID : GUID,
                    casdate: currentDate,
                    casbankname: formData.CASBANKNAME,
                    casinvertcash: Number(formData.invertCashAmount),
                    cas2000: multipliers[0],
                    cas500: multipliers[1],
                    cas200: multipliers[2],
                    cas100: multipliers[3],
                    cas50: multipliers[4],
                    cas20: multipliers[5],
                    cas10: multipliers[6],
                    cascoins: coinMultipliers[0],
                    castotal: finalTotal,
                    "companyid": userdetail?.companyID ? userdetail.companyID : "",
                    "deptid": userdetail?.departmentID ? userdetail.departmentID : "",
                    uaid: userdetail?.uaid || "",
                };

                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };

                // First API call to /backend/api/SP_AddCashInvert
                const response = await axios({
                    method: "POST",
                    url: `${baseUrl.Url}/backend/api/SP_AddCashInvert`,
                    data: JSON.stringify(payload),
                    headers: headers,
                });

                console.log('API Response:', response);

                if (response.status === 200) {
                    // Success message for the first API
                    Swal.fire({
                        icon: 'success',
                        title: 'यशस्वी!',
                        text: 'डेटा यशस्वीरीत्या सादर केला गेला!',
                        confirmButtonText: 'ठीक आहे',
                        allowOutsideClick: false,
                        allowEscapeKey: false,

                    });

                    // Second API call to /api/SP_AddUpdCashSummary
                    const cashSummaryPayload = {
                        casid: dataExists[0].casid,
                        casdate: dataExists[0].casdate,
                        casbankname: dataExists[0].casbankname,
                        casinvertcash: parseFloat(dataExists[0].casinvertcash) + Number(formData.invertCashAmount),
                        caS2000: parseFloat(dataExists[0].caS2000) + parseFloat(multipliers[0]),
                        caS500: parseFloat(dataExists[0].caS500) + parseFloat(multipliers[1]),
                        caS200: parseFloat(dataExists[0].caS200) + parseFloat(multipliers[2]),
                        caS100: parseFloat(dataExists[0].caS100) + parseFloat(multipliers[3]),
                        caS50: parseFloat(dataExists[0].caS50) + parseFloat(multipliers[4]),
                        caS20: parseFloat(dataExists[0].caS20) + parseFloat(multipliers[5]),
                        caS10: parseFloat(dataExists[0].caS10) + parseFloat(multipliers[6]),
                        cascoins: parseFloat(dataExists[0].cascoins) + parseFloat(coinMultipliers[0]),
                        castotal: parseFloat(dataExists[0].castotal) + parseFloat(finalTotal),
                        "companyid": userdetail?.companyID ? userdetail.companyID : "",
                        "deptid": userdetail?.departmentID ? userdetail.departmentID : "",
                    };

                    console.log(cashSummaryPayload, "cashSummaryPayload");
                    // Send data to /backend/api/SP_AddUpdCashSummary
                    const summaryResponse = await axios({
                        method: "POST",
                        url: `${baseUrl.Url}/backend/api/SP_AddUpdCashSummary`,
                        data: JSON.stringify(cashSummaryPayload),
                        headers: headers,
                    });

                    // Handle the response from the second API call
                    if (summaryResponse.status === 200) {
                        Swal.fire({
                            icon: 'success',
                            title: 'सारांश अद्यतनित!',
                            text: 'कॅश  सारांश यशस्वीरीत्या जोडला किंवा अद्यतनित केला गेला!',
                            confirmButtonText: 'ठीक आहे',
                            allowOutsideClick: false,
                            allowEscapeKey: false,

                        });
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'सारांश अद्यतन अयशस्वी',
                            text: 'कॅश सारांश अद्यतन करण्यात अयशस्वी. कृपया नंतर पुन्हा प्रयत्न करा.',
                            confirmButtonText: 'ठीक आहे',
                            allowOutsideClick: false,
                            allowEscapeKey: false,

                        });
                    }
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'सादरीकरण अयशस्वी',
                        text: 'डेटा सादर करण्यात अयशस्वी. कृपया नंतर पुन्हा प्रयत्न करा.',
                        confirmButtonText: 'ठीक आहे',
                        allowOutsideClick: false,
                        allowEscapeKey: false,

                    });
                }
            } catch (error) {
                console.error("Error submitting data:", error);
                Swal.fire({
                    icon: 'error',
                    title: 'त्रुटी',
                    text: 'डेटा सादर करताना त्रुटी आली आहे.',
                    confirmButtonText: 'ठीक आहे',
                    allowOutsideClick: false,
                    allowEscapeKey: false,

                });
            }
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

    useEffect(() => {
        const fetchData = async () => {
            if (CASID) {
                try {
                    const payload = {
                        casid: CASID,
                        keyword: "%",
                        companyid: "",
                        deptid: "",
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
            title: "तुम्हाला खात्री आहे का?",
            text: "ही माहिती जतन करू इच्छिता?",
            showCancelButton: true,
            confirmButtonColor: "#00ff00",
            confirmButtonText: "जतन करा",
            cancelButtonColor: "#092C4C",
            cancelButtonText: "रद्द करा",
            allowOutsideClick: false,
            allowEscapeKey: false,

        }).then((result) => {
            if (result.isConfirmed) {
                handleFormSubmission(event);
            }
        });
    };
    const showExitAlert = () => {
        MySwal.fire({
            title: "तुम्हाला खात्री आहे का?",
            text: "तुम्हाला बाहेर पडायचे आहे का?",
            showCancelButton: true,
            confirmButtonColor: "#00ff00",
            confirmButtonText: "होय",
            cancelButtonColor: "#092C4C",
            cancelButtonText: "नाही",
            allowOutsideClick: false,
            allowEscapeKey: false,

        }).then((result) => {
            if (result.isConfirmed) {
                navigate(route.CashInvert)
            }
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
        <div className="page-wrapper">
            <div className="content">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h1 className="card-title m-0">नोटांची नोंदणी </h1>
                    <ul className="table-top-head d-flex justify-content-end mb-0">
                        <li>
                            <div className="page-btn">
                                <Link to={route.CashInvert} className="btn btn-secondary">
                                    <ArrowLeft className="me-1" />
                                    मागे
                                </Link>
                            </div>
                        </li>
                    </ul>
                </div>

                <div className="card mx-auto" >
                    <div className="card-body mbgcolor">
                        <div className="row">
                            <div className="col-lg-2 col-sm-6 col-12">
                                <div className="mb-3 add-product">
                                    <label className="form-label">तारीख</label>
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
                                    <label className="form-label">बँकेचे नाव</label>
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
                                    <label className="form-label">नोटांची रक्कम</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter amount"
                                        value={formData.invertCashAmount}
                                        onChange={handleInvertCashAmountChange} // Correct handler
                                        min="0"
                                        ref={InvertCashRef}
                                        onKeyDown={(e) => handleEnterKey(e, MultiplierRefs.current[0])}
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

                        {/* <div className="text-center mt-3">
                            <button type="submit" className="btn btn-primary" onClick={handleSubmit}>Submit</button>
                        </div> */}
                        <div className="text-end mt-2">
                            <button
                                type="button"
                                className="btn btn-cancel me-2"
                                data-bs-dismiss="modal"
                                onClick={showExitAlert}
                            >
                                मागे
                            </button>
                            <button type="submit" className="btn btn-submit" onClick={handleSubmit}>
                                सेव्ह
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddCashInvert;
