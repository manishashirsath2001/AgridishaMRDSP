
import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "feather-icons-react/build/IconComponents";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import axios from 'axios';
import Table from "../../core/pagination/datatable";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
// import { getUserData } from "../../Context/UserData";
import { getUserData } from "../../Context/UserData";
import { ACSPLGUID, baseUrl } from "../../core/json/custom";
import {

    ChevronUp,
    Edit,
    PlusCircle,
    RotateCcw,
    Trash2,
} from "feather-icons-react/build/IconComponents";
function PendingAuction({ onClose }) {


    const { userdetail } = getUserData();
    const [auctionshed, setauctionshed] = useState([]);

    const fetchAuctionShed = async () => {
        const payload = {
            "apkid": "%",
            "keyword": "%",
            companyid: userdetail?.companyID ? userdetail.companyID : "",
            deptid: userdetail?.departmentID ? userdetail.departmentID : "",
            "date": userdetail.APPDT,
            "userid": userdetail.uaid
        };

        const headers = {
            "Content-Type": "application/json",
            Accept: "*/*",
        };

        try {
            const response = await axios.post(
                `${baseUrl.Url}/backend/api/GET_AUCTIONSHED`,
                JSON.stringify(payload),
                { headers }
            );

            if (response.status !== 200) {
                throw new Error("Failed to fetch data");
            }

            setauctionshed(response.data);
        } catch (error) {
            console.error("Error fetching auction shed data:", error);
        }
    };


    useEffect(() => {
        fetchAuctionShed();

        const intervalId = setInterval(() => {
            fetchAuctionShed();
        }, 5000);

        return () => clearInterval(intervalId);
    }, []);


    const renderActionTooltip = (props) => (
        <Tooltip id="action-tooltip" {...props}>
            Action
        </Tooltip>
    );

    const MySwal = withReactContent(Swal);
    const showConfirmationAlert = (apkid) => {
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
        MySwal.fire({
            title: "तुम्हाला खात्री आहे का?",
            text: "हे आपण पूर्ववत करू शकणार नाही!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#00ff00",
            confirmButtonText: "होय, हटवा!",
            cancelButtonColor: "#ff0000",
            cancelButtonText: "रद्द करा",
            allowOutsideClick: false,
            allowEscapeKey: false,
        }).then((result) => {
            if (result.isConfirmed) {
                OndeleteQuatation(apkid)
            } else {
                MySwal.close();
            }
        });
    };


    const OndeleteQuatation = async (apkid) => {
        try {
            const payload = {
                apkid: apkid,
                companyid: userdetail?.companyID || "",
                deptid: userdetail?.departmentID || "",
            };
            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            // DELETE API call
            const deleteResponse = await axios.post(
                `${baseUrl.Url}/backend/api/SP_DeleteAuctionshed`,
                JSON.stringify(payload),
                { headers }
            );

            const result = deleteResponse.data[0];

            // Show alert after deletion
            await MySwal.fire({
                title: result.responseCode === "अपयश" ? "हटवणे अनुमत नाही" : "हटवले!",
                text: result.responseMessage,
                icon: result.responseCode === "FAILURE" ? "error" : "success",
                confirmButtonText: "ठीक आहे",
                customClass: {
                    confirmButton: result.responseCode === "FAILURE" ? "btn btn-danger" : "btn btn-success",
                },
            });


            if (result.responseCode !== "FAILURE") {
                const getPayload = {
                    "apkid": "%",
                    "keyword": "%",
                    companyid: userdetail?.companyID ? userdetail.companyID : "",
                    deptid: userdetail?.departmentID ? userdetail.departmentID : "",
                    "date": userdetail.APPDT,
                    "userid": userdetail.uaid
                };

                const getResponse = await axios.post(
                    `${baseUrl.Url}/backend/api/GET_AUCTIONSHED`,
                    JSON.stringify(getPayload),
                    { headers }
                );

                if (getResponse.status === 200) {
                    setauctionshed(getResponse.data);
                } else {
                    throw new Error("Failed to refresh auction shed data");
                }
            }
        } catch (error) {
            console.error("Error in OndeleteQuatation:", error);
        }
    };


    const columns = [
        {
            title: (
                <div className="d-flex justify-content-center">
                    <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip id="Member_Name-tooltip" style={{ textAlign: "center" }}>ट.क्र</Tooltip>}

                    >

                        <span>ट.क्र</span>
                    </OverlayTrigger>
                </div>

            ),
            dataIndex: "token",
            render: (text) => <div style={{ textAlign: "center" }}>{text}</div>,
        },
        {
            title: (
                <div className="d-flex justify-content-center">
                    <OverlayTrigger placement="top" overlay={<Tooltip id="Member_Cantact-tooltip" style={{ textAlign: "center" }}>बि.क्र</Tooltip>}>
                        <span >बि.क्र</span>
                    </OverlayTrigger>
                </div>
            ),
            dataIndex: "billno",
            render: (text) => <div style={{ textAlign: "center" }}>{text}</div>,
        },
        {
            title: (
                <div className="d-flex justify-content-center">
                    <OverlayTrigger placement="top" overlay={<Tooltip id="Member_Cantact-tooltip">दि.</Tooltip>}>
                        <span>दि.</span>
                    </OverlayTrigger>
                </div>
            ),
            dataIndex: "date",
            render: (text) => <div style={{ textAlign: "center" }}>{text}</div>,
        },
        {
            title: (
                <div className="d-flex justify-content-center">
                    <OverlayTrigger placement="top" overlay={<Tooltip id="Member_Email-tooltip">शेतकऱ्याचे नाव</Tooltip>}>
                        <span>शेतकऱ्याचे नाव</span>
                    </OverlayTrigger>
                </div>
            ),
            dataIndex: "fname",
            render: (text) => <div style={{ textAlign: "center" }}>{text}</div>,
        },



        {
            title: (
                <div className="d-flex justify-content-center">
                    <OverlayTrigger placement="top" overlay={<Tooltip id="action-tooltip">कृती</Tooltip>}>
                        <span>कृती</span>
                    </OverlayTrigger>
                </div>
            ),
            dataIndex: "action",
            render: (_, record) => (

                <div className="action-table-data">
                    <div className="edit-delete-action">


                        <Link
                            className="confirm-text p-2 me-2"
                            to="#"
                            onClick={() => showConfirmationAlert(record.apkid)}
                        >
                            <Trash2 className="feather-trash-2" />
                        </Link>
                    </div>
                </div>
            ),
        },
    ];
    return (
        <div className="modal fade" id="add-units-PendingAuction">
            <div className="modal-dialog modal-dialog-centered modal-fullscreen">
                <div className="modal-content">
                    {/* Modal Header */}
                    <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
                        <h5 className="mb-0">Todays Pending Auction </h5>
                        <button
                            type="button"
                            className="btn btn-secondary d-flex align-items-center"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                            onClick={onClose}
                        >
                            <ArrowLeft className="me-2" />
                            मागे
                        </button>
                    </div>

                    {/* Modal Body Placeholder */}


                    <div className="card table-list-card">
                        <div className="card-body p-2">
                            <div className="table-responsive responsive-no-scroll">
                                <Table
                                    columns={columns}
                                    dataSource={auctionshed}
                                    pagination={false}
                                    scroll={false} // ensure ant-table doesn't enforce horizontal scroll
                                />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default PendingAuction;

