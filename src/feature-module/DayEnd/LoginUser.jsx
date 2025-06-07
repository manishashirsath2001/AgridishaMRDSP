

import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "feather-icons-react/build/IconComponents";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import axios from 'axios';
import { getUserData } from "../../Context/UserData";
import { ACSPLGUID, baseUrl } from "../../core/json/custom";
import Table from "../../core/pagination/datatable";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

// import { getUserData } from "../../../Context/UserData";
import {
    ArrowUpRight,
    Trash2,
} from "feather-icons-react/build/IconComponents";
function LoginUser({ onClose }) {

    const [userData, setUserData] = useState([]);
    const { userdetail } = getUserData();
    const [auctionshed, setauctionshed] = useState([]);

    const renderActionTooltip = (props) => (
        <Tooltip id="action-tooltip" {...props}>
            Action
        </Tooltip>
    );

    const MySwal = withReactContent(Swal);
    const showConfirmationAlert = (uaid) => {
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
            title: "तुम्ही लॉगआउट करणार आहात का?",
            text: "एकदा लॉगआउट केल्यावर परत करता येणार नाही!",
            showCancelButton: true,
            confirmButtonColor: "#00ff00",
            confirmButtonText: "हो, लॉगआउट करा!",
            cancelButtonColor: "#ff0000",
            cancelButtonText: "रद्द करा"
        }).then((result) => {
            if (result.isConfirmed) {
                OndeleteUser(uaid);
            } else {
                MySwal.close();
            }
        });
    };

    const fetchUserData = async () => {
        try {
            const payload = {
                uaid: "%",
                keyword: "%"
            };
            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            const response = await axios.post(
                baseUrl.Url + "/backend/api/_GET_UserMasters_/_Search",
                JSON.stringify(payload),
                { headers }
            );

            if (response.status !== 200) throw new Error("Failed to fetch user data");
            console.log("usersssss", response.data)
            setUserData(response.data.filter(user => user.islogin === true && user.uroleid !== "admin"));

        } catch (error) {
            console.error("Error fetching User Master data:", error);
        }
    };

    useEffect(() => {
        fetchUserData();

        const intervalId = setInterval(() => {
            fetchUserData();
        }, 5000);

        return () => clearInterval(intervalId);
    }, []);



    const OndeleteUser = async (uaid) => {
        try {
            const payload = {

                "uaid": uaid

            };
            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            const response = await axios.post(
                baseUrl.Url + "/backend/api/SP_UserLoginUpadate",
                JSON.stringify(payload),
                { headers }
            );

            if (response.status !== 200) throw new Error("Failed to Delete Data");

            const result = response.data[0];

            await MySwal.fire({
                title: "लॉगआउट यशस्वी!",
                text: "आपण यशस्वीरित्या लॉगआउट केले आहे.",
                icon: "success",
                confirmButtonText: "ठीक आहे",
                customClass: {
                    confirmButton: "btn btn-success",
                },
            });

            if (result.responseCode !== "FAILURE") {
                fetchUserData();
            }
        } catch (error) {
            console.error("Error deleting account:", error);
        }
    };


    const columns = [
        {
            title: "वापरकर्त्याचे नाव",
            dataIndex: "uforename",
            sorter: (a, b) => a.uforename.localeCompare(b.uforename),
        },
        {
            title: "ईमेल",
            dataIndex: "uemailaddress",
        },
        {
            title: "फोन",
            dataIndex: "umobilenumber",
        },
        {
            title: "भूमिका",
            dataIndex: "uroleid",
        },
        {
            title: "क्रिया",
            dataIndex: "action",
            render: (_, record) => (
                <div className="action-table-data">
                    <div className="edit-delete-action">
                        <OverlayTrigger placement="top" overlay={<Tooltip id="delete-tooltip">अपडेट करा</Tooltip>}>
                            <Link
                                className="confirm-text p-2"
                                to="#"
                                onClick={() => showConfirmationAlert(record.uaid)}
                            >
                                <ArrowUpRight className="feather-ArrowUpRight" />
                            </Link>
                        </OverlayTrigger>
                    </div>
                </div>
            ),
        },
    ];

    return (
        <div className="modal fade" id="add-units-Userlogin">
            <div className="modal-dialog modal-dialog-centered modal-fullscreen">
                <div className="modal-content">
                    {/* Modal Header */}
                    <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
                        <h5 className="mb-0">Todays User Login </h5>
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
                    <>
                        <style>
                            {`
      /* Ensure continuous borders for the entire table */
      .table-container {
        border: 2px solid #999;
        border-radius: 6px;
        border-collapse: collapse; /* Ensures no gaps between borders */
      }

      /* Apply border to every cell */
      .custom-column-border td, .custom-column-border th {
        border: 1px solid #ccc !important;
        padding: 8px !important;
        text-align: center;
        vertical-align: middle;
      }

      /* Apply border to header cells */
      .ant-table-thead > tr > th {
        background-color: #f0f0f0;
        font-weight: bold;
      }

      /* Alternate row background for better readability */
      .ant-table-tbody > tr:nth-child(odd) > td {
        background-color: #f9f9f9;
      }

      /* Optional: Table outer border style */
      .table-container {
        padding: 10px;
        background-color: #fff;
      }
    `}
                        </style>

                        <div className="modal-body">
                            <div className="table-responsive">
                                <div className="table-container">
                                    <Table
                                        columns={columns}
                                        dataSource={userData} // Dynamic data
                                        pagination={false}
                                        bordered
                                        rowClassName={() => "custom-column-border"} // Apply custom class to each row for border
                                    />
                                </div>
                            </div>
                        </div>
                    </>

                </div>
            </div>
        </div>
    );
}

export default LoginUser;

