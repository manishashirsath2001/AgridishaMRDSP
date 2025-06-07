import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import { ACSPLGUID, baseUrl } from "../../core/json/custom";
import { getUserData } from '../../Context/UserData';
const RokdaAddCash = ({ onRefresh, onClose, TOTALAMOUNT }) => {

    console.log("SSSSSSSSSSSSSSSSSSSSSSS", TOTALAMOUNT)

    const [Result, setResult] = useState();
    const { userdetail } = getUserData();
    const location = useLocation();
    const navigate = useNavigate();
    const { CASID } = location.state || {};
    const GUID = ACSPLGUID.getNew();

    const [formData, setFormData] = useState({
        CASBANKNAME: '',
        CASDATE: '',
        invertCashAmount: 800
    });


    const BankNameRef = useRef(null);
    const CoinsRef = useRef(null);

    const [currentDate, setCurrentDate] = useState('');

    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        setCurrentDate(today);
        BankNameRef?.current?.focus()
    }, []);

    const [bankname, setBankName] = useState([]);
    console.log(bankname)
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
            (acc, cash, index) => acc + Number(cash || 0) * multipliers[index],
            0
        );
        const coinTotal = coinMultipliers.reduce(
            (acc, coin) => acc + Number(coin || 0),
            0
        );
        return cashTotal + coinTotal;

    };

    const handleMultiplierChange = (e, index) => {
        const value = Math.max(0, parseInt(e.target.value) || 0);
        const updatedMultipliers = [...multipliers];
        updatedMultipliers[index] = value;
        setMultipliers(updatedMultipliers);
        setResult(e.target.value)
    };

    const handleCoinMultiplierChange = (e, index) => {
        const value = Math.max(0, parseInt(e.target.value) || 0);
        const updated = [...coinMultipliers];
        updated[index] = value;
        setCoinMultipliers(updated);
        setResult(e.target.value)
    };


    const [totalAmount, setTotalAmount] = useState(null);
    console.log("totalAmounttotalAmounttotalAmounttotalAmounttotalAmount", totalAmount)

    const [dataExists, setDataExists] = useState([]);

    useEffect(() => {
        const checkIfDataExists = async () => {
            try {
                const payload = {
                    "companyid": userdetail?.companyID ? userdetail.companyID : "",
                    "deptid": userdetail?.departmentID ? userdetail.departmentID : "",
                };
                const headers = {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                };
                const response = await axios({
                    method: "POST",
                    url: `${baseUrl.Url}/backend/api/GET_GateCashSummary`,
                    data: JSON.stringify(payload),
                    headers: headers,
                });
                if (response.status === 200) {
                    setDataExists(response.data);
                } else {
                    setDataExists([]);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        checkIfDataExists();
    }, []);



    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('Form submitted:', formData);
        console.log("ResultResultResultResultResultResultResultResultResult", Result)
        if (Result > 0) {
            showConfirmationAlert(event);
        } else {
            Swal.fire({
                icon: "warning",
                title: "त्रुटी!",
                html: `कृपया रक्कम प्रविष्ट करा.`,
                confirmButtonText: "ठीक आहे",
            });
        }
        // showConfirmationAlert(event);
    };

    const handleFormSubmission = async (event) => {
        event.preventDefault();
        console.log("summry data", dataExists);
        const finalTotal = calculateTotal();
        console.log("finalTotalfinalTotalfinalTotalfinalTotalfinalTotal", finalTotal)
        setTotalAmount(finalTotal);


        if (finalTotal != TOTALAMOUNT) {
            Swal.fire({
                icon: 'warning',
                title: 'जास्त रक्कम',
                text: 'एकूण रक्कम आणी एकूण जमा रक्कम सारखी पाहिजेत .',
                confirmButtonText: 'ठीक आहे',
            });
            return;
        }

        try {
            const payload = {
                casid: CASID ? CASID : GUID,
                casdate: currentDate,
                casbankname: dataExists[0].casbankname,
                casinvertcash: parseFloat(dataExists[0].casinvertcash),
                cas2000: multipliers[0] || 0,
                cas500: multipliers[1] || 0,
                cas200: multipliers[2] || 0,
                cas100: multipliers[3] || 0,
                cas50: multipliers[4] || 0,
                cas20: multipliers[5] || 0,
                cas10: multipliers[6] || 0,
                cascoins: coinMultipliers[0] || 0,
                castotal: finalTotal,
                "companyid": userdetail?.companyID ? userdetail.companyID : "",
                "deptid": userdetail?.departmentID ? userdetail.departmentID : "",
                uaid: userdetail?.uaid || "",
            };

            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            const response = await axios({
                method: "POST",
                url: `${baseUrl.Url}/backend/api/SP_AddCashInvert`,
                data: JSON.stringify(payload),
                headers: headers,
            });

            console.log('API Response:', response);

            if (response.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Data submitted successfully!',
                    confirmButtonText: 'OK',
                });

                const cashSummaryPayload = {
                    casid: dataExists[0].casid,
                    casdate: dataExists[0].casdate,
                    casbankname: dataExists[0].casbankname,
                    casinvertcash: parseFloat(dataExists[0].casinvertcash),
                    caS2000: parseFloat(dataExists[0].caS2000) + parseFloat(multipliers[0]) || 0,
                    caS500: parseFloat(dataExists[0].caS500) + parseFloat(multipliers[1]) || 0,
                    caS200: parseFloat(dataExists[0].caS200) + parseFloat(multipliers[2]) || 0,
                    caS100: parseFloat(dataExists[0].caS100) + parseFloat(multipliers[3]) || 0,
                    caS50: parseFloat(dataExists[0].caS50) + parseFloat(multipliers[4]) || 0,
                    caS20: parseFloat(dataExists[0].caS20) + parseFloat(multipliers[5]) || 0,
                    caS10: parseFloat(dataExists[0].caS10) + parseFloat(multipliers[6]) || 0,
                    cascoins: parseFloat(dataExists[0].cascoins) + parseFloat(coinMultipliers[0]) || 0,
                    castotal: parseFloat(dataExists[0].castotal) + parseFloat(finalTotal),
                    "companyid": userdetail?.companyID ? userdetail.companyID : "",
                    "deptid": userdetail?.departmentID ? userdetail.departmentID : "",
                };

                console.log(cashSummaryPayload, "cashSummaryPayload");
                const summaryResponse = await axios({
                    method: "POST",
                    url: `${baseUrl.Url}/backend/api/SP_AddUpdCashSummary`,
                    data: JSON.stringify(cashSummaryPayload),
                    headers: headers,
                });

                if (summaryResponse.status === 200) {
                    Swal.fire({
                        icon: 'success',
                        title: 'सारांश यशस्वीरित्या जतन केला गेला!',
                        text: 'रोख रक्कम यशस्वीरित्या जोडली गेली आहे!',
                        confirmButtonText: 'ठीक आहे',
                    }).then(() => {
                        onClose({
                            success: true,
                            amount: finalTotal
                        });
                        const modal = document.getElementById("Rokda");
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
                        multipliers[0] = '',
                            multipliers[1] = '',
                            multipliers[2] = '',
                            multipliers[3] = '',
                            multipliers[4] = '',
                            multipliers[5] = '',
                            multipliers[6] = '',
                            coinMultipliers[0] = ''
                    })
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
                title: 'त्रुटी',
                text: 'कृपया सर्व फील्ड भरावेत.',
                confirmButtonText: 'ठीक आहे',
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
                // validateinput(e);
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
                        companyid: userdetail?.companyID ? userdetail.companyID : "",
                        deptid: userdetail?.departmentID ? userdetail.departmentID : "",
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
            title: "आपल्याला खात्री आहे का?",
            text: "आपण ही माहिती जतन करू इच्छिता?",
            showCancelButton: true,
            confirmButtonColor: "#00ff00",
            confirmButtonText: "जतन करा",
            cancelButtonColor: "#092C4C",
            cancelButtonText: "रद्द करा",
        }).then((result) => {
            if (result.isConfirmed) {
                handleFormSubmission(event);
            }
        });
    };
    const showExitAlert = () => {
        MySwal.fire({
            title: "आपल्याला खात्री आहे का?",
            text: "आपण प्रणालीमधून बाहेर पडू इच्छिता?",
            showCancelButton: true,
            confirmButtonColor: "#00ff00",
            confirmButtonText: "होय",
            cancelButtonColor: "#092C4C",
            cancelButtonText: "रद्द करा",
        }).then((result) => {
            if (result.isConfirmed) {
                setResult('')
                const modal = document.getElementById("Rokda");
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
                multipliers[0] = '',
                    multipliers[1] = '',
                    multipliers[2] = '',
                    multipliers[3] = '',
                    multipliers[4] = '',
                    multipliers[5] = '',
                    multipliers[6] = '',
                    coinMultipliers[0] = ''
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

    const saveButtonRef = useRef(null);
    const MultiplierRefs = useRef([]);
    MultiplierRefs.current = cashValues.map((_, index) => MultiplierRefs.current[index] || React.createRef());


    useEffect(() => {

        if (MultiplierRefs.current[0]?.current) {
            setTimeout(() => {
                MultiplierRefs.current[0].current.focus();
            }, 0);
        }
    }, []);


    return (
        <div>
            {/* Add Category */}
            <div className="modal fade" id="Rokda">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content shadow-lg border-0 rounded-4 mbgcolor">
                        {/* Header */}
                        <div className="p-4 bg-primary rounded-top">
                            <h5 className="mb-0 text-white fw-bold">💰 रोख माहिती</h5>
                        </div>

                        {/* Table */}
                        <div className="table-responsive px-4 pt-3">
                            <table className="table table-bordered table-striped table-hover shadow-sm rounded text-center align-middle">
                                <thead className="thead-dark bg-dark text-white">
                                    <tr>
                                        <th className="text-white">नगदी मूल्य</th>
                                        <th className="text-white">गुणक</th>
                                        <th className="text-white">एकूण रक्कम</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cashValues.map((cash, index) => (
                                        <tr key={index}>
                                            <td className="bg-light fw-semibold">{cash}</td>
                                            <td>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    className="form-control text-center border-primary bg-white shadow-sm"
                                                    value={multipliers[index]}
                                                    onChange={(e) => handleMultiplierChange(e, index)}
                                                    ref={MultiplierRefs.current[index]}
                                                    onKeyDown={(e) => handleEnterKey(e, MultiplierRefs.current[index + 1] || CoinsRef)}
                                                />
                                            </td>
                                            <td className="bg-light fw-semibold">{cash * multipliers[index]}</td>
                                        </tr>
                                    ))}

                                    <tr className="bg-warning bg-opacity-25">
                                        <td className="fw-bold text-dark">🪙 नाणी</td>
                                        <td>
                                            <input
                                                type="number"
                                                min="0"
                                                className="form-control text-center border-warning bg-white shadow-sm"
                                                value={coinMultipliers[0]}
                                                onChange={(e) => handleCoinMultiplierChange(e, 0)}
                                                ref={CoinsRef}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        saveButtonRef.current?.focus();
                                                    }
                                                }}
                                            />
                                        </td>
                                        <td className="fw-semibold text-dark">{coinMultipliers[0]}</td>
                                    </tr>

                                    <tr className="bg-success text-white fw-bold">
                                        <td>💵 एकूण रक्कम</td>
                                        <td></td>
                                        <td>{calculateTotal()}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>


                        {/* Buttons */}
                        <div className="text-end px-4 mt-2 pb-4">
                            <button
                                type="button"
                                className="btn  btn-secondary me-2 px-4"
                                onClick={showExitAlert}
                            >
                                मागे
                            </button>
                            <button
                                type="submit"
                                ref={saveButtonRef}
                                className="btn btn-success px-4 fw-semibold"
                                onClick={handleSubmit}
                            >
                                सेव्ह
                            </button>
                        </div>
                    </div>
                </div>
            </div>



            {/* /Add Category */}
        </div>
    )
}

export default RokdaAddCash;

