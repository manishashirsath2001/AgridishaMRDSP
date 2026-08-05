import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowLeft, ChevronUp } from "feather-icons-react/build/IconComponents";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { setToogleHeader } from "../../core/redux/action";
import { all_routes } from "../../Router/all_routes";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { getUserData } from '../../Context/UserData';
import { baseUrl, ACSPLGUID } from "../../core/json/custom";
import axios from 'axios';
const DisplayNotification = () => {
    const location = useLocation();
    const { notiID, selectedTab, snotid } = location.state || {};
    const dispatch = useDispatch();
    const route = all_routes;
    const userdetail = getUserData();
    const data = useSelector((state) => state.toggle_header);
    const GUID = ACSPLGUID.getNew()
    const [notifications, setNotifications] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [selectedNotifications, setSelectedNotifications] = useState([]);
    const MySwal = withReactContent(Swal);
    const [formData, setFormData] = useState({
        notiID: "",
        faid: "",
        snotid: "",
        fname: "",
        fcmtoken: "",
        Date: "",
        maid: "",
        taid: "",
        logtype: "",
        tname: "",
        tdate: "",
        notiTitle: "",
        notiDescription: "",
    });
    const renderCollapseTooltip = (props) => (
        <Tooltip id="refresh-tooltip" {...props}>
            Collapse
        </Tooltip>
    );
    const handleSelectAll = (e) => {
        setSelectAll(e.target.checked);
        if (e.target.checked) {
            setSelectedNotifications(notifications.map((notif) => notif.id));
        } else {
            setSelectedNotifications([]);
        }
    };
    const handleCheckboxChange = (id) => {
        const updatedSelection = selectedNotifications.includes(id)
            ? selectedNotifications.filter((notifId) => notifId !== id)
            : [...selectedNotifications, id];
        setSelectedNotifications(updatedSelection);
        setSelectAll(updatedSelection.length === notifications.length);
    };




    useEffect(() => {
        const fetchMasterData = async () => {
            try {
                const payload1 = {
                    "faid": "%"
                }
                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*"
                };
                const response = await axios.post(
                    baseUrl.Url + "/api/GET_FCMTokenFarmer",
                    payload1,
                    { headers }
                );
                if (response.status !== 200) throw new Error("Failed to fetch data");
                const apiData = response.data;
                setNotifications(apiData)
                console.log(" Master Data:", apiData);
            } catch (error) {
                console.error("Error in Master API Call:", error);
            }
        };
        fetchMasterData();
    }, []);






    // useEffect(() => {
    //     if (!notiID || !selectedTab) return;

    //     const fetchMasterData = async () => {
    //         try {
    //             const payload = {
    //                 notiID: "%",
    //                 companyid: userdetail?.companyID || "",
    //                 deptid: userdetail?.departmentID || "",
    //             };
    //             const headers = {
    //                 "Content-Type": "application/json",
    //                 Accept: "*/*",
    //             };
    //             const apiUrl =
    //                 selectedTab === "Farmer"
    //                     ? baseUrl.Url + "/backend/api/GET_FarmerForNotifications"
    //                     : baseUrl.Url + "/backend/api/GET_TransportersForNotifications";
    //             const response = await axios.post(apiUrl, payload, { headers });
    //             if (response.status !== 200) throw new Error("Failed to fetch data");
    //             const apiData = response.data;
    //             const logtypeValue = selectedTab === "Farmer" ? 6 : 7;
    //             const mappedNotifications = apiData.map((item, index) => ({
    //                 id: index + 1,
    //                 name: selectedTab === "Farmer" ? item.fname : item.tname,
    //                 fcmtoken: item.fcmtoken,
    //                 maid: selectedTab === "Farmer" ? item.faid : item.taid,
    //                 notiID: notiID,
    //                 logtype: logtypeValue, // 6 for Farmer, 7 for Transporter
    //             }));
    //             setNotifications(mappedNotifications);
    //             if (mappedNotifications.length > 0) {
    //                 const first = mappedNotifications[0];
    //                 setFormData((prev) => ({
    //                     ...prev,
    //                     maid: first.maid,
    //                     notiID: first.notiID,
    //                     logtype: first.logtype,
    //                 }));
    //             }
    //         } catch (error) {
    //             console.error("Error fetching data:", error);
    //         }
    //     };
    //     fetchMasterData();
    // }, [notiID, selectedTab, userdetail]);
    const handleSendNotification = async () => {
        const tokensToSend = notifications
            .filter((notif) => selectedNotifications.includes(notif.id) && notif.fcmtoken)
            .map((notif) => notif.fcmtoken);
        if (tokensToSend.length === 0) {
            MySwal.fire("सूचना नाही", "कृपया युजर्स निवडा.", "warning");
            return;
        }
        console.log('fcmtoken', tokensToSend);
        const payload = {
            deviceTokens: tokensToSend,
            title: formData.notiTitle || "Default Title",
            body: formData.notiDescription || "Default Body",
        };
        try {
            const response = await axios.post(
                "http://adsvr:10/backend/api/Notification/send",
                payload,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            console.log('Response:', response);
            if (response.status === 200) {
                MySwal.fire("यशस्वी", "सूचना पाठवली गेली!", "success");
            } else {
                MySwal.fire("त्रुटी", "सूचना पाठवता आली नाही.", "error");
            }
        } catch (error) {
            console.error("Error sending notification:", error);
            MySwal.fire("त्रुटी", "काहीतरी चूक झाली सूचना पाठवताना.", "error");
        }
    };
    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const payload = {
    //                 notiID: notiID || "%",
    //                 keyword: '%',
    //                 companyid: userdetail?.companyID ? userdetail.companyID : "",
    //                 deptid: userdetail?.departmentID ? userdetail.departmentID : "",
    //             };
    //             const headers = {
    //                 "Content-Type": "application/json",
    //                 Accept: "*/*",
    //             };
    //             const url =
    //                 selectedTab === "Transporter"
    //                     ? baseUrl.Url + "/backend/api/GET_AdminNotificationForTransporter"
    //                     : baseUrl.Url + "/backend/api/GET_AdminNotificationForFarmer";
    //             const response = await axios.post(url, payload, { headers });
    //             if (response.status !== 200) {
    //                 throw new Error("Failed to fetch notification data");
    //             }
    //             const data = response.data;
    //             if (Array.isArray(data) && data.length > 0) {
    //                 const notification = data.find((item) => item.notiID === notiID);
    //                 if (notification) {
    //                     setFormData((prevFormData) => ({
    //                         ...prevFormData,
    //                         notiTitle: notification.notiTitle || "",
    //                         notiDescription: notification.notiDescription || "",

    //                     }));
    //                 }
    //             }
    //         } catch (error) {
    //             console.error("Error fetching notification data:", error);
    //         }
    //     };
    //     if (notiID && selectedTab) {
    //         fetchData();
    //     }
    // }, [notiID, selectedTab]);
    const handleFormSubmission = async () => {
        try {
            const currentDateTime = new Date().toISOString();
            const selectedNotificationsData = notifications.filter((notif) =>
                selectedNotifications.includes(notif.id)
            );
            for (let notif of selectedNotificationsData) {
                const individualGUID = ACSPLGUID.getNew();
                const payload = {
                    snotid: snotid ? snotid : individualGUID,
                    maid: notif.maid,
                    notiID: notif.notiID,
                    logtype: notif.logtype,
                    date: currentDateTime,
                    companyid: userdetail?.companyID || "",
                    deptid: userdetail?.departmentID || "",
                };
                console.log("Saving payload: ", payload);
                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };
                await axios.post(
                    baseUrl.Url + "/backend/api/SP_AddUpdSendSaveNotification",
                    payload,
                    { headers }
                );
            }
            Swal.fire({
                icon: "success",
                title: "यशस्वी",
                text: "सर्व निवडलेले डेटा सेव झाले.",
                confirmButtonText: "ठीक आहे",
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate(route.AppNotification);
                }
            });
        } catch (error) {
            console.error("Submission Error:", error);
            Swal.fire({
                icon: "error",
                title: "त्रुटी",
                text: "डेटा सेव करताना काही चूक झाली.",
            });
        }
    };
    const handleBothActions = async () => {
        try {
            await Promise.all([
                handleFormSubmission(),
                handleSendNotification()
            ]);
        } catch (error) {
            console.error("Error in one of the actions", error);
        }
    };
    return (
        <>
            <div className="page-wrapper">
                <div className="content">
                    <div className="page-header">
                        <div className="add-item d-flex">
                            <div className="page-title">
                                <h3>सूचना यादी</h3>
                            </div>
                        </div>
                        <ul className="table-top-head">
                            <li>
                                <div className="page-btn">
                                    <Link to={route.AppNotification} className="btn btn-secondary">
                                        <ArrowLeft className="me-2" />
                                        मागे
                                    </Link>
                                </div>
                            </li>
                            <li>
                                <OverlayTrigger placement="top" overlay={renderCollapseTooltip}>
                                    <Link
                                        data-bs-toggle="tooltip"
                                        data-bs-placement="top"
                                        title="Collapse"
                                        id="collapse-header"
                                        className={data ? "active" : ""}
                                        onClick={() => {
                                            dispatch(setToogleHeader(!data));
                                        }}
                                    >
                                        <ChevronUp className="feather-chevron-up" />
                                    </Link>
                                </OverlayTrigger>
                            </li>
                        </ul>
                    </div>
                    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "10vh", flexDirection: "column" }}>

                        <div className="w-100 text-center" style={{ maxWidth: "800px" }}>
                            <span className="fw-bold text-dark" style={{ fontSize: "1rem" }}>शीर्षक:</span>
                            <span className="ms-2 fw-bold text-primary" style={{ fontSize: "1rem" }}>
                                {formData.notiTitle || "शीर्षक उपलब्ध नाही"}
                            </span>
                            <br />
                            <span className="fw-bold text-dark mt-3" style={{ fontSize: "1rem" }}>माहिती :</span>
                            <span className="ms-2 fw-bold text-primary" style={{ fontSize: "1rem" }}>
                                {formData.notiDescription || "माहिती उपलब्ध नाही"}
                            </span>
                        </div>
                    </div>
                    <div className="card table-list-card">
                        <div className="card-body mbgcolor">
                            <div className="card-body p-4">
                                <div>
                                    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                        <table className="table table-bordered table-hover" style={{ marginBottom: 0 }}>
                                            <thead className="table-light" style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                                                <tr>
                                                    <th style={{ width: '7%', backgroundColor: '#343a40', color: '#fff' }}>
                                                        <input
                                                            type="checkbox"
                                                            checked={selectAll}
                                                            onChange={handleSelectAll}
                                                        />
                                                        <label htmlFor="select-all" className="ms-2">सर्व निवडा</label>
                                                    </th>
                                                    <th style={{ width: '80%', backgroundColor: '#343a40', color: '#fff', textAlign: 'center' }}>
                                                        नाव
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {notifications.map((notification) => (
                                                    <tr key={notification.faid}>
                                                        <td>
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedNotifications.includes(notification.faid)}
                                                                onChange={() => handleCheckboxChange(notification.faid)}
                                                            />
                                                        </td>
                                                        <td style={{ textAlign: 'center' }}>{notification.fname}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="mt-3 text-end">
                                    <button className="btn btn-primary" onClick={handleBothActions}>
                                        सूचना पाठवा
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
export default DisplayNotification;
