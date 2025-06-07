import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "feather-icons-react/build/IconComponents";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import axios from 'axios';
import Table from "../../core/pagination/datatable";
import { getUserData } from "../../Context/UserData";
import { ACSPLGUID, baseUrl } from "../../core/json/custom";
function PendingCashRTGS() {
    const { userdetail } = getUserData();
    const [PendingReceipts, setPendingReceipts] = useState([]);

    const fetchPendingReceipts = async () => {
        try {
            const payload = {
                "baid": "%",
                "date": userdetail.APPDT,
                "keyword": "%",
                "companyid": "",
                "deptid": "",
            };
            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };
            const response = await axios.post(
                `${baseUrl.Url}/backend/api/GET_RECEIPTMaster`,
                payload,
                { headers }
            );
            if (response.status !== 200)
                throw new Error("Failed to fetch ");
            console.log("receipt master", response.data)
            setPendingReceipts(response.data);
        } catch (error) {
            console.error("Error fetching Receipt Master data:", error);
        }
    };

    useEffect(() => {
        fetchPendingReceipts();

        const intervalId = setInterval(() => {
            fetchPendingReceipts();
        }, 5000);

        return () => clearInterval(intervalId);
    }, []);

    const renderActionTooltip = (props) => (
        <Tooltip id="action-tooltip" {...props}>
            Action
        </Tooltip>
    );


    const columns = [

        {

            title: (
                <div className="d-flex justify-content-center" style={{ backgroundColor: "#f1f1f1", padding: "8px" }}>
                    <OverlayTrigger placement="top" overlay={<Tooltip id="tokanno-tooltip">टो.नं</Tooltip>}>
                        <span style={{ cursor: "pointer" }}>टो.नं</span>
                    </OverlayTrigger>
                </div>
            ),

        },

        {
            title: (
                <div className="d-flex justify-content-center">
                    <OverlayTrigger placement="top" overlay={<Tooltip id="billno-tooltip">बि.नं</Tooltip>}>
                        <span style={{ cursor: "pointer" }}>बि.नं</span>
                    </OverlayTrigger>
                </div>
            ),
            dataIndex: "billno",
            // sorter: (a, b) => a.billno.length - b.billno.length,
            render: (text) => (
                <OverlayTrigger placement="top" overlay={<Tooltip id="billno-tooltip">{text}</Tooltip>}>
                    <div style={{ textAlign: "center" }}>{text}</div>
                </OverlayTrigger>
            ),
        },

        {
            title: (
                <div className="d-flex justify-content-center">
                    <OverlayTrigger placement="top" overlay={<Tooltip id="date-tooltip">तारीख</Tooltip>}>
                        <span style={{ cursor: "pointer" }}>तारीख</span>
                    </OverlayTrigger>
                </div>
            ),
            dataIndex: "date",
            render: (text) => (
                <OverlayTrigger placement="top" overlay={<Tooltip id="date-tooltip">{text}</Tooltip>}>
                    <div style={{ textAlign: "center" }}>{text}</div>
                </OverlayTrigger>
            ),
        },

        {
            title: (
                <div className="d-flex justify-content-center">
                    <OverlayTrigger placement="top" overlay={<Tooltip id="fname-tooltip">शेतकरी नाव</Tooltip>}>
                        <span style={{ cursor: "pointer" }}>शेतकरी नाव</span>
                    </OverlayTrigger>
                </div>
            ),
            dataIndex: "fname",
            // sorter: (a, b) => a.fname.length - b.fname.length,
            render: (text) => (
                <OverlayTrigger placement="top" overlay={<Tooltip id="fname-tooltip">{text}</Tooltip>}>
                    <div style={{ textAlign: "center" }}>{text}</div>
                </OverlayTrigger>
            ),
        },

        {
            title: (
                <div className="d-flex justify-content-center">
                    <OverlayTrigger placement="top" overlay={<Tooltip id="faddharno-tooltip">आधार नंबर</Tooltip>}>
                        <span style={{ cursor: "pointer" }}>आधार नंबर</span>
                    </OverlayTrigger>
                </div>
            ),
            dataIndex: "faddharno",
            // sorter: (a, b) => a.faddharno.length - b.faddharno.length,
            render: (text) => (
                <OverlayTrigger placement="top" overlay={<Tooltip id="faddharno-tooltip">{text}</Tooltip>}>
                    <div style={{ textAlign: "center" }}>{text}</div>
                </OverlayTrigger>
            ),
        },
        {
            title: (
                <div className="d-flex justify-content-center">
                    <OverlayTrigger placement="top" overlay={<Tooltip id="fcontactno-tooltip">मोबाइल नंबर</Tooltip>}>
                        <span style={{ cursor: "pointer" }}>मोबाइल नंबर</span>
                    </OverlayTrigger>
                </div>
            ),
            dataIndex: "fcontactno",
            // sorter: (a, b) => a.fcontactno.length - b.fcontactno.length,
            render: (text) => (
                <OverlayTrigger placement="top" overlay={<Tooltip id="fcontactno-tooltip">{text}</Tooltip>}>
                    <div style={{ textAlign: "center" }}>{text}</div>
                </OverlayTrigger>
            ),
        },
        {
            title: (
                <div className="d-flex justify-content-center">
                    <OverlayTrigger placement="top" overlay={<Tooltip id="vehno-tooltip">गाडी नंबर</Tooltip>}>
                        <span style={{ cursor: "pointer" }}>गाडी नंबर</span>
                    </OverlayTrigger>
                </div>
            ),
            dataIndex: "vehno",
            // sorter: (a, b) => a.vehno.length - b.vehno.length,
            render: (text) => (
                <OverlayTrigger placement="top" overlay={<Tooltip id="vehno-tooltip">{text}</Tooltip>}>
                    <div style={{ textAlign: "center" }}>{text}</div>
                </OverlayTrigger>
            ),
        },


    ];
    return (
        <div className="modal fade" id="add-units-PendingReceipts">
            <div className="modal-dialog modal-dialog-centered modal-fullscreen">
                <div className="modal-content">
                    {/* Modal Header */}
                    <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
                        <h5 className="mb-0">Todays Total Tokens</h5>
                        <button
                            type="button"
                            className="btn btn-secondary d-flex align-items-center"
                            data-bs-dismiss="modal"
                            aria-label="Close"
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
                                        dataSource={PendingReceipts} // Dynamic data
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

export default PendingCashRTGS;

