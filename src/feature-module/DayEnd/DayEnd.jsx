
import CountUp from 'react-countup';
import React, { useRef, useEffect, useState } from "react";
// import PendingReceipts from "../../core/modals/inventory/PendingReceipts";
// import PendingTokens from "../../core/modals/inventory/PendingTokens";
// import PendingAuction from "../../core/modals/inventory/PendingAuction";
// import Userlogin from "../../core/modals/inventory/Userlogin";
import axios from 'axios';
import moment from "moment";
import { baseUrl } from '../../core/json/custom';
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import PendingAuction from './PendingAuction';
import LoginUser from './LoginUser';
import PendingTokens from './PendingTokens';
import { getUserData } from '../../Context/UserData';
import { formatDate } from '@fullcalendar/core/index.js';
import { all_routes } from '../../Router/all_routes';
import { useNavigate } from 'react-router-dom';
function DayEnd() {
    const route = all_routes;
    const navigate = useNavigate();
    const [PendingToken, setPendingToken] = useState([]);
    const [LoggedInUsers, setLoggedInUsers] = useState([]);
    const [PendingReceiptss, setPendingReceipts] = useState([]);
    const [PendingAuctionSheds, setPendingAuctionSheds] = useState([]);
    const [isChecked, setIsChecked] = useState(false);
    const initialDate = moment();
    const [dayOffset, setDayOffset] = useState(0);
    const currentDate = moment(initialDate).add(dayOffset, 'days');
    const MySwal = withReactContent(Swal);
    const [updateddate, setupdateddate] = useState();
    const { userdetail } = getUserData()
    // const handleAddDay = () => {
    //     if (dayOffset < 1) {
    //         setDayOffset(prev => prev + 1);
    //     }
    // };

    const handleSubDay = () => {
        if ((dayOffset === 0) || (dayOffset === 1 && dayOffset > -2)) {
            setDayOffset(prev => prev - 1);
        }
    };

    const fetchSalesRequisition = async () => {
        try {
            const payload =

            {
                "date": userdetail.APPDT
            }


            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };
            const response = await axios.post(
                `${baseUrl.Url}/backend/api/GET_DayEndInfo`,
                payload,
                { headers }
            );
            if (response.status !== 200)
                throw new Error("Failed to fetch farmer count data");
            console.log("Pending Token", response.data[0].pendingTokens);
            console.log("loggedInUsers", response.data[0].loggedInUsers);
            console.log("PendingReceipts", response.data[0].pendingReceipts);
            console.log("Pending Auction Sheds", response.data[0].pendingAuctionSheds);
            setPendingToken(response.data[0].pendingTokens);
            setLoggedInUsers(response.data[0].loggedInUsers);
            setPendingReceipts(response.data[0].pendingReceipts);
            setPendingAuctionSheds(response.data[0].pendingAuctionSheds);
        } catch (error) {
            console.error("Error fetching vendor data:", error);
        }
    };
    useEffect(() => {
        const interval = setInterval(() => {
            fetchSalesRequisition();
        }, 10000);

        fetchSalesRequisition();

        return () => clearInterval(interval);
    }, []);



    const handleModalClose = (result) => {
        fetchSalesRequisition();

        console.log("Modal resultModal resultModal resultModal resultModal result:", result);

    };

    // const handleSave = async () => {


    //     MySwal.fire({
    //         text: 'तुम्हाला ही माहिती  जतन करायची आहे का?',
    //         showCancelButton: true,
    //         confirmButtonColor: '#00ff00',
    //         confirmButtonText: 'जतन करा',
    //         cancelButtonColor: '#092C4C',
    //         cancelButtonText: 'रद्द करा',
    //     }).then(async (result) => {
    //         if (result.isConfirmed) {
    //             try {
    //                 const payload1 = {
    //                     "date": "6 may 2025"
    //                 };

    //                 const headers = {
    //                     "Content-Type": "application/json",
    //                     Accept: "*/*",
    //                 };

    //                 const response1 = await axios.post(
    //                     baseUrl.Url + "/backend/api/SP_DayEnd",
    //                     payload1,
    //                     { headers }
    //                 );

    //                 if (response1.status === 200) {

    //                 } else {
    //                     throw new Error("Failed to save master data.");
    //                 }
    //             } catch (error) {
    //                 console.error("Submission Error:", error);
    //                 MySwal.fire({
    //                     icon: "error",
    //                     title: "त्रुटी",
    //                     text: "माहिती सेव  करण्यास अपयश. कृपया पुन्हा प्रयत्न करा",
    //                 });
    //             }
    //         } else {
    //             MySwal.close();
    //         }
    //     });
    // };

    const handleAddDay = () => {
        setDayOffset(prev => prev + 1);
        const inputDate = new Date(userdetail.APPDT);
        inputDate.setDate(inputDate.getDate() + 1);

        const formattedDate = inputDate.toLocaleDateString("en-GB", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });

        console.log(formattedDate); // "16 May 2025"

        setupdateddate(formattedDate)
    };

    const handleSave = async () => {
        if (userdetail.ROLEID !== 'admin') {
            Swal.fire({
                icon: 'warning',
                title: 'कृपया लक्ष द्या!',
                text: 'ही प्रवेश अनुमती फक्त अडमिनकडे आहे.',
                confirmButtonText: 'ठीक आहे',
                allowOutsideClick: false,
                allowEscapeKey: false,
            });


            return;
        }
        if (!isChecked) {
            Swal.fire({
                icon: 'warning',
                title: 'कृपया लक्ष द्या!',
                text: 'पुढील दिवस सुरू करण्याआधी सर्व व्यवहार तपासल्याची खात्री करण्यासाठी चेकबॉक्स निवडा.',
                confirmButtonText: 'ठीक आहे',
                allowOutsideClick: false,
                allowEscapeKey: false,
            });

            return;
        }

        MySwal.fire({
            text: 'तुम्हाला ही माहिती जतन करायची आहे का?',
            showCancelButton: true,
            confirmButtonColor: '#00ff00',
            confirmButtonText: 'जतन करा',
            cancelButtonColor: '#092C4C',
            cancelButtonText: 'रद्द करा',
            allowOutsideClick: false,
            allowEscapeKey: false,
        }).then(async (result) => {
            if (result.isConfirmed) {
                const inputDate = new Date(userdetail.APPDT);
                inputDate.setDate(inputDate.getDate() + 1);

                const formattedDate = inputDate.toLocaleDateString("en-GB", {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                });
                try {
                    const payload1 = {
                        "date": updateddate || formattedDate
                    }

                    const headers = {
                        "Content-Type": "application/json",
                        Accept: "*/*",
                    };

                    const response1 = await axios.post(
                        baseUrl.Url + "/backend/api/SP_DayEnd",
                        payload1,
                        { headers }
                    );

                    if (response1.status === 200) {
                        const message = response1.data[0]?.responseMessage || "ऑपरेशन पूर्ण झाले.";
                        MySwal.fire({
                            icon: response1.data[0]?.isSuccessful == 0 ? "warning" : "success",
                            title: response1.data[0]?.isSuccessful == 0 ? "कृपया लक्ष द्या!" : "यशस्वी",
                            text: response1.data[0]?.responseMessage || message,
                            confirmButtonText: "OK",
                            allowOutsideClick: false,
                            allowEscapeKey: false,
                        });

                        if (response1.data[0]?.isSuccessful == 1) {
                            try {
                                if (userdetail.uaid) {
                                    await axios.post(`${baseUrl.Url}/backend/api/SP_UpadateUserLogin`, {
                                        uaid: userdetail.uaid,
                                        islogin: false,
                                    });
                                }
                            } catch (error) {
                                console.error("❌ Logout API error:", error);
                            }
                        }

                        console.log("message", response1.data)
                    } else {
                        throw new Error("Failed to save master data.");
                    }
                } catch (error) {
                    console.error("Submission Error:", error);
                    MySwal.fire({
                        icon: "error",
                        title: "त्रुटी",
                        text: "माहिती सेव  करण्यास अपयश. कृपया पुन्हा प्रयत्न करा",
                    });
                }
            } else {
                MySwal.close();
            }
        });
    };



    const handleSubtractDay = () => {
        setDayOffset(prev => prev - 1);
    };

    const getAdjustedDate = () => {
        const baseDate = new Date(userdetail.APPDT);
        baseDate.setDate(baseDate.getDate() + dayOffset);
        return baseDate;
    };

    return (
        <div className='mbgcolor'>
            <style>
                {`
                    .dash-widget {
                        background: #fff;
                        padding: 20px;
                        border-radius: 10px;
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        text-align: center;
                    }

                    .dash-widgetcontent {
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        height: 50px;
                    }

                    .card-blue {
                        background: linear-gradient(135deg,rgb(85, 167, 255), #7dc9d6);
                        color: white;
                    }
                    .card-red{
                        background: linear-gradient(135deg,rgb(248, 179, 152),rgb(245, 163, 109));
                        color: white;
                    }

                    .card-green {
                        background: linear-gradient(135deg,rgb(134, 233, 157), #abdab7);
                        color: white;
                    }

                    .card-orange {
                        background: linear-gradient(135deg,rgb(235, 210, 72), #d3c270);
                        color: white;
                    }

                    .dash-widget:hover {
                        transform: translateY(-5px);
                        transition: 0.3s;
                    }

                    @media (max-width: 767px) {
                        .dash-widget {
                            padding: 15px;
                        }

                        .dash-widgetcontent h5 {
                            font-size: 20px;
                        }

                        .dash-widgetcontent h6 {
                            font-size: 14px;
                        }
                    }
                `}
            </style>
            <div className="page-wrapper mbgcolor">
                <div className="content mbgcolor">
                    <div className="row">
                        <div className="row align-items-center justify-content-between mb-3">
                            <div className="col">
                                <h3 className="page-title m-0">दैनंदिन समाप्ती (आजची)</h3>
                            </div>
                            <div className="col-auto">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => navigate(route.DayEndIndex)}
                                >
                                    मागे
                                </button>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-2 col-sm-6 d-flex">

                                <div
                                    className="dash-widget compact-card card-blue w-100 d-flex align-items-center justify-content-center"
                                    style={{ height: "100px", borderRadius: "10px" }}
                                    data-bs-toggle="modal"
                                    data-bs-target="#add-units-PendingTokens"
                                >
                                    <div className="text-center">
                                        <h5 className="text-black" style={{ fontSize: "20px" }}>
                                            <CountUp start={0} end={PendingToken} duration={3} />
                                        </h5>
                                        <h6 className="text-black" style={{ fontSize: "15px" }}>
                                            प्रलंबित टोकन्स
                                        </h6>
                                    </div>
                                </div>
                            </div>


                            <div className="col-md-2 col-sm-6 d-flex">
                                <div
                                    className="dash-widget compact-card card-red w-100 d-flex align-items-center justify-content-center"
                                    style={{ height: "100px", borderRadius: "10px" }}
                                    data-bs-toggle="modal"
                                    data-bs-target="#add-units-PendingAuction"
                                >
                                    <div className="text-center">
                                        <h5 className="text-black" style={{ fontSize: "20px" }}>
                                            <CountUp start={0} end={PendingAuctionSheds} duration={3} />
                                        </h5>
                                        <h6 className="text-black" style={{ fontSize: "15px" }}>
                                            प्रलंबित लिलाव
                                        </h6>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-2 col-sm-6 d-flex">
                                <div
                                    className="dash-widget compact-card card-blue w-100 d-flex align-items-center justify-content-center"
                                    style={{ height: "100px", borderRadius: "10px" }}
                                    data-bs-toggle="modal"
                                    data-bs-target="#add-units-PendingReceipts"
                                >
                                    <div className="text-center">
                                        <h5 className="text-black" style={{ fontSize: "20px" }}>
                                            <CountUp start={0} end={PendingReceiptss} duration={3} />
                                        </h5>
                                        <h6 className="text-black" style={{ fontSize: "15px" }}>
                                            प्रलंबित रोख / चेक / आरटीजीएस
                                        </h6>
                                    </div>
                                </div>
                            </div>




                            <div className="col-md-2 col-sm-6 d-flex">
                                <div className="dash-widget compact-card card-orange w-100 d-flex align-items-center justify-content-center"
                                    style={{ height: "100px", borderRadius: "10px" }}>
                                    <div className="text-center"
                                        data-bs-toggle="modal"
                                        data-bs-target="#add-units-Userlogin">
                                        <h5 className="text-black mb-1" style={{ fontSize: "20px" }}>
                                            <CountUp start={0} end={LoggedInUsers} duration={3} />
                                        </h5>
                                        <h6 className="text-black mb-0" style={{ fontSize: "15px" }}>
                                            वापरकर्ता लॉगिन
                                        </h6>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-4 col-sm-12">
                                <div
                                    className="card p-3 shadow-sm"
                                    style={{
                                        borderRadius: "12px",
                                        background: "linear-gradient(to right, rgb(16, 185, 129), rgb(94, 234, 212))",
                                        color: "rgb(15, 23, 42)",
                                        minHeight: "100px",
                                    }}
                                >
                                    <div className="row text-center align-items-center">
                                        <div className="col-4 border-end border-dark-subtle">
                                            <h4 className="fw-bold mb-1" style={{ fontSize: "20px" }}>
                                                <CountUp start={0} end={6789} duration={3} />
                                            </h4>
                                            <p className="fw-semibold mb-0" style={{ fontSize: "16px" }}>Highest Price</p>
                                        </div>
                                        <div className="col-4 border-end border-dark-subtle">
                                            <h4 className="fw-bold mb-1" style={{ fontSize: "20px" }}>
                                                <CountUp start={0} end={1234} duration={3} />
                                            </h4>
                                            <p className="fw-semibold mb-0" style={{ fontSize: "16px" }}>Lowest Price</p>
                                        </div>
                                        <div className="col-4">
                                            <h4 className="fw-bold mb-1" style={{ fontSize: "20px" }}>
                                                <CountUp start={0} end={4567} duration={3} />
                                            </h4>
                                            <p className="fw-semibold mb-0" style={{ fontSize: "16px" }}>Average Price</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row mt-5 py-4" style={{
                        background: "linear-gradient(to right,rgb(248, 179, 152),rgb(238, 177, 85))",
                        borderRadius: "10px"
                    }}
                    >
                        <div className="col-md-4 d-flex justify-content-end align-items-center">
                            {/* <button
                                onClick={handleSubtractDay}
                                className="btn btn-danger"
                                style={{
                                    fontSize: "40px",
                                    lineHeight: "30px",
                                    borderRadius: "50%",
                                    width: "60px",
                                    height: "60px",
                                    padding: "0",
                                }}
                                title="Advance by one day"
                                disabled={dayOffset <= -1}
                            >
                                -
                            </button> */}
                        </div>

                        <div className="col-md-4 d-flex justify-content-center align-items-center">
                            <h1 className="fw-bold mb-0" style={{ fontSize: "24px" }}>
                                {getAdjustedDate().toLocaleDateString("en-GB", {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric"
                                })}

                            </h1>
                        </div>

                        <div className="col-md-4 d-flex justify-content-start align-items-center">
                            <button
                                onClick={handleAddDay}
                                className="btn btn-success"
                                style={{
                                    fontSize: "40px",
                                    lineHeight: "30px",
                                    borderRadius: "50%",
                                    width: "60px",
                                    height: "60px",
                                    padding: "0",
                                }}
                                title="Advance by one day"
                                disabled={dayOffset >= 1}
                            >
                                +
                            </button>
                        </div>
                    </div>

                    <div
                        className="row mt-5 py-4 px-3"
                        style={{
                            background: "linear-gradient(135deg,rgb(235, 210, 72), #d3c270)", // light yellow
                            border: "2px solidrgba(255, 224, 102, 0.73)", // golden border
                            borderRadius: "10px",
                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"
                        }}
                    >
                        <div className="col-12">
                            <div className="form-check d-flex align-items-start mt-3">
                                <input
                                    className="form-check-input me-2 mt-1"
                                    type="checkbox"
                                    id="confirmDayChange"
                                    checked={isChecked}
                                    onChange={() => setIsChecked(!isChecked)}
                                    style={{ transform: "scale(1.5)" }}
                                />
                                <label
                                    className="form-check-label fw-semibold ms-2"
                                    htmlFor="confirmDayChange"
                                    style={{ fontSize: "15px", textAlign: "start", maxWidth: "1200px" }}
                                >
                                    पुढील दिवस सुरु करण्या पूर्वी मी सर्व व्यवहार तपासलेले आहेत. मला कल्पना आहे की, दिवस बदलल्यावर मागील माहितीत कोणताही बदल करता येत नाही.
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="row mt-5">

                        <div className="col-12 d-flex justify-content-end">
                            <button
                                type="button"
                                className="btn btn-submit mt-sm-4 mt-2"
                                onClick={handleSave}
                            >
                                व्यावहार दिनाक बदला
                            </button>

                        </div>
                    </div>


                </div>
            </div>
            {/* < /> */}
            <PendingTokens onClose={handleModalClose} />
            <PendingAuction onClose={handleModalClose} />
            <LoginUser onClose={handleModalClose} />
        </div>
    );
}

export default DayEnd;

