
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
import {

    ChevronUp,
    Edit,
    PlusCircle,
    RotateCcw,
    Trash2,
} from "feather-icons-react/build/IconComponents";
function PendingTokens({ onClose }) {
    const { userdetail } = getUserData();
    const [GateEntry, setGateEntry] = useState([]);

    const refreshData = async () => {
        // setRefreshFlag(prev => !prev);
        try {
            const payload = {
                "dpkid": "%",
                "keyword": "%",
                "companyid": "",
                "deptid": "",
                "date": userdetail.APPDT

            };

            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            const response = await axios.post(
                baseUrl.Url + "/backend/api/GET_GateEntryDetail",
                payload,
                { headers }
            );

            if (response.status !== 200) throw new Error("Failed to fetch data");

            const DATA = response.data;
            setGateEntry(DATA.filter(entry => entry.iscompleted === false));

        } catch (error) {
            console.error("Error fetching Gate Entry Data:", error);
        }
    };
    useEffect(() => {
        refreshData();

        const intervalId = setInterval(() => {
            refreshData();
        }, 5000);

        return () => clearInterval(intervalId);
    }, []);

    const MySwal = withReactContent(Swal);

    const showConfirmationAlert = (dpkid) => {
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
            text: "हे पूर्ववत करता येणार नाही!",
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
                handleDelete(dpkid)
            } else {
                MySwal.close();
            }
        });
    };
    const handleDelete = async (dpkid) => {
        try {
            const payload = {
                dpkid: dpkid,
                companyid: "",
                deptid: ""
            };

            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            const response = await axios.post(
                `${baseUrl.Url}/backend/api/SP_DeleteGateEntryDetail`,
                JSON.stringify(payload),
                { headers }
            );

            if (response.status !== 200) {
                throw new Error("Failed to fetch data");
            }

            MySwal.fire({
                title: response.data[0].responseCode === "FAILURE" ? "हटवणे शक्य नाही" : "हटवले गेले!",
                text: response.data[0].responseMessage,
                icon: response.data[0].responseCode === "FAILURE" ? "error" : "success",
                confirmButtonText: "ठीक आहे",
                customClass: {
                    confirmButton: response.data[0].responseCode === "FAILURE" ? "btn btn-danger" : "btn btn-success",
                },
            });


            try {
                const payload = {
                    "dpkid": "%",
                    "keyword": "%",
                    "companyid": "",
                    "deptid": "",
                    "date": userdetail.APPDT
                }

                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };

                axios({
                    method: "POST",
                    url: baseUrl.Url + "/backend/api/GET_GateEntryDetail",
                    data: JSON.stringify(payload),
                    headers: headers,
                })
                    .then((response) => {
                        if (response.status != 200) throw new Error("Failed to Fetching Data");
                        const DATA = response.data;
                        setGateEntry(DATA.filter(entry => entry.iscompleted === false));
                    })

            } catch (error) {
                console.error("Error fetching Access Right Data:", error);
            }
        } catch (error) {
            console.error("Error deleting GateEntry:", error);
        }
    };
    const columns = [
        {
            title: (
                <div className="d-flex justify-content-center">
                    <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip id="types-tooltip">ट.क्र.</Tooltip>}
                    >
                        <div>ट.क्र.</div>
                    </OverlayTrigger>
                </div>
            ),
            dataIndex: "toknno",
            sorter: (a, b) => a.toknno.localeCompare(b.toknno),
            // Adjusted width
            render: (text) => (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id={`tooltip-${text}`}>{text}</Tooltip>}
                >
                    <div style={{ textAlign: "center" }}>{text}</div>
                </OverlayTrigger>
            ),
        },

        {
            title: (
                <div className="d-flex justify-content-center">
                    <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip id="types-tooltip">दि.</Tooltip>}
                    >
                        <div className="text-center">दि.</div>
                    </OverlayTrigger>
                </div>
            ),
            dataIndex: "date",
            // Adjusted width
            render: (text) => (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id={`tooltip-${text}`}>{text}</Tooltip>}
                >
                    <div style={{ textAlign: "center" }}>{text}</div>
                </OverlayTrigger>
            ),
        },
        {
            title: (
                <div className="d-flex justify-content-center">
                    <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip id="types-tooltip">वा.क्र.</Tooltip>}
                    >
                        <div>वा.क्र.</div>
                    </OverlayTrigger>
                </div>
            ),
            dataIndex: "vehno",
            sorter: (a, b) => a.vehno.localeCompare(b.vehno),
            // Adjusted width
            render: (text) => (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id={`tooltip-${text}`}>{text}</Tooltip>}
                >
                    <div style={{ textAlign: "center" }}>{text}</div>
                </OverlayTrigger>
            ),
        },
        {
            title: (
                <div className="d-flex justify-content-center">
                    <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip id="types-tooltip">स्थिती</Tooltip>}
                    >
                        <div className="text-center w-100">स्थिती</div>
                    </OverlayTrigger>
                </div>
            ),
            dataIndex: "iscompleted",
            sorter: (a, b) => a.iscompleted.localeCompare(b.iscompleted),

            render: (text) => {
                const isCompleted = text === true || text === "true";
                return (
                    <OverlayTrigger
                        placement="top"
                        overlay={
                            <Tooltip id={`tooltip-${text}`}>
                                {isCompleted ? "Complete" : "Pending"}
                            </Tooltip>
                        }
                    >
                        <div style={{ textAlign: "center" }}>
                            <button
                                className={`btn btn-sm ${isCompleted ? "btn-success" : "btn-warning"} text-dark`}
                                style={{ color: "#000" }} // ensures text is black
                                disabled
                            >
                                {isCompleted ? "Completed" : "Pending"}
                            </button>
                        </div>
                    </OverlayTrigger>
                );

            },
        },
        {
            title: (
                <div className="d-flex justify-content-center">
                    <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip id="types-tooltip">कृती </Tooltip>}
                    >
                        <div className="text-center">कृती </div>
                    </OverlayTrigger>
                </div>
            ),
            dataIndex: "action",

            render: (_, record) => (
                <div className="action-table-data">
                    <div className="edit-delete-action">



                        <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip id="delete-tooltip me-2">Delete</Tooltip>}
                        >

                            <Link
                                className="confirm-text p-2 me-2"
                                to="#"
                                onClick={() => showConfirmationAlert(record.dpkid)}
                            >
                                <Trash2 className="feather-trash-2" />
                            </Link>
                        </OverlayTrigger>

                    </div>
                </div>
            ),
        },
    ];

    return (
        <div className="modal fade" id="add-units-PendingTokens">
            <div className="modal-dialog modal-dialog-centered modal-fullscreen">
                <div className="modal-content">
                    {/* Modal Header */}
                    <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
                        <h5 className="mb-0">Todays Total Pending Tokens</h5>
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
                                        dataSource={GateEntry} // Dynamic data
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

export default PendingTokens

