
import React, { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ImageWithBasePath from "../../core/img/imagewithbasebath";
import Brand from "../../core/modals/inventory/brand";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { all_routes } from "../../Router/all_routes";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import Table from "../../core/pagination/datatable";
import { setToogleHeader } from "../../core/redux/action";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { baseUrl } from "../../core/json/custom";

import {
    ArrowLeft,
    ChevronUp,
    Edit,
    Eye,

    PlusCircle,
    RotateCcw,


    Trash2,
} from "feather-icons-react/build/IconComponents";
const VideoMaster = () => {
    const dispatch = useDispatch();
    const data = useSelector((state) => state.toggle_header);
    const route = all_routes;
    const navigate = useNavigate();
    const [selectedVideoName, setSelectedVideoName] = useState("");
    const [PlotDetails, setPlotDetails] = useState([]);
    // const [videoPreview, setVideoPreview] = useState(null); 
    // const [selectedFile, setSelectedFile] = useState(null);
    const onEditClick = (vid) => {

        navigate(route.AddVideo, { state: { vid: vid } });
    };
    const columns = [
        {
            title: "व्हिडिओ", // "Video" in Hindi
            dataIndex: "video", // This should be the path to the video
            render: (selectedVideoName) => {
                // Ensure the video path is correct
                // Combine baseUrl with the video path

                return (
                    <div>
                        <video
                            width="160" // Adjust the size as per your need
                            height="90"
                            controls
                            style={{ objectFit: 'cover' }} // Optional styling to fit within bounds
                        >
                            <source src={`${baseUrl.Url}/Images/${selectedVideoName}`} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </div>
                );
            },
            sorter: (a, b) => a.video.length - b.video.length,
        },
        {
            title: "शीर्षक",
            dataIndex: "vtitle",
            sorter: (a, b) => a.vtitle.length - b.vtitle.length,
        },
        {
            title: "स्थिती",
            dataIndex: "isactive",
            width: "5px",
            render: (status) => {
                const isactive = status == 1; // फक्त 1 म्हणजेच Complete
                const badgeClass = isactive
                    ? "bg-danger text-white"
                    : "bg-success text-white";

                const label = isactive ? "inactive" : "active";
                return (
                    <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip id={`tooltip-${label}`}>{label}</Tooltip>}
                    >
                        <span
                            className={`badge ${badgeClass} d-flex justify-content-center`}
                            style={{ padding: "7px 12px", fontSize: "0.875rem" }}
                        >
                            {label}
                        </span>
                    </OverlayTrigger>
                );
            }
        },
        {
            title: "कृती",
            dataIndex: "action",
            render: (_, record) => (
                <div className="action-table-data">
                    <div className="edit-delete-action">
                        <OverlayTrigger placement="top" overlay={<Tooltip id="edit-tooltip">Edit</Tooltip>}>
                            <a className="me-2 p-2" onClick={() => { onEditClick(record.vid) }}>
                                <Edit className="feather-edit" />
                            </a>
                        </OverlayTrigger>
                        <OverlayTrigger placement="top" overlay={<Tooltip id="delete-tooltip">Delete</Tooltip>}>
                            <Link
                                className="confirm-text p-2"
                                to="#"
                                onClick={() => showConfirmationAlert(record.vid)}
                            >
                                <Trash2 className="feather-trash-2" />
                            </Link>
                        </OverlayTrigger>
                        {/* <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip id="approve-tooltip">Proceed </Tooltip>}
                  >
                      <Link className="me-2 p-2" to="#" data-bs-toggle="modal" data-bs-target="#AddSaleQuotation" style={{ color: 'green' }}>
                          <i data-feather="arrow-right-circle" className="feather-arrow-right-circle"></i>
                      </Link>
                  </OverlayTrigger> */}
                    </div>
                </div>
            ),
            sorter: (a, b) => a.createdby.length - b.createdby.length,
        },
    ];
    const MySwal = withReactContent(Swal);

    const showConfirmationAlert = (vid) => {
        MySwal.fire({
            title: "तुम्हाला खात्री आहे का?",
            text: "तुम्ही हे बदलू शकणार नाही!",
            showCancelButton: true,
            confirmButtonColor: "#00ff00",
            confirmButtonText: "हो,ते हटवा!",
            cancelButtonColor: "#ff0000",
            cancelButtonText: "रद्द करा",
        }).then((result) => {
            if (result.isConfirmed) {
                OndeletePlotDetails(vid);
            } else {
                MySwal.close();
            }
        });
    };
    const dataSource = [];
    const renderTooltip = (props) => (
        <Tooltip id="pdf-tooltip" {...props}>
            Pdf
        </Tooltip>
    );
    const renderExcelTooltip = (props) => (
        <Tooltip id="excel-tooltip" {...props}>
            Excel
        </Tooltip>
    );
    const renderPrinterTooltip = (props) => (
        <Tooltip id="printer-tooltip" {...props}>
            Printer
        </Tooltip>
    );
    const renderRefreshTooltip = (props) => (
        <Tooltip id="refresh-tooltip" {...props}>
            Refresh
        </Tooltip>
    );
    const renderCollapseTooltip = (props) => (
        <Tooltip id="refresh-tooltip" {...props}>
            Collapse
        </Tooltip>
    );
    //shorkey
    useEffect(() => {
        const handleShortcut = (e) => {
            if (e.ctrlKey && e.key.toLowerCase() === "a") {
                e.preventDefault();
                navigate("/AddVideo");
            }
            if (e.ctrlKey && e.key === 'e') {
                e.preventDefault();
                navigate(route.test);
            }

        };

        window.addEventListener("keydown", handleShortcut);

        return () => {
            window.removeEventListener("keydown", handleShortcut);
        };
    }, [navigate]);
    //get data
    useEffect(() => {
        try {
            const payload = {
                "vid": "%",
                "keyword": "%",
                "companyid": "",
                "deptid": ""
            }

            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            axios({
                method: "POST",
                url: baseUrl.Url + "/backend/api/GET_AdminVideo",
                data: JSON.stringify(payload),
                headers: headers,
            })
                .then((response) => {
                    if (response.status != 200) throw new Error("Failed to Fetching Data");
                    const DATA = response.data;
                    setPlotDetails(DATA);
                })

        } catch (error) {
            console.error("Error fetching Access Right Data:", error);
        }
    }, []);
    //delete
    const OndeletePlotDetails = async (vid) => {
        try {
            const payload = {
                "vid": vid,
                "companyid": "",
                "deptid": "",

            }
            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            axios({
                method: "POST",
                url: baseUrl.Url + "/backend/api/SP_DeleteAdminVideo",
                data: JSON.stringify(payload),
                headers: headers,
            })
                .then((response) => {
                    if (response.status != 200) throw new Error("Failed to Fetching Data");
                    MySwal.fire({
                        title: response.data[0].responseCode === "FAILURE" ? "Deletion Not Allowed" : "Deleted!",
                        text: response.data[0].responseCode === "FAILURE"
                            ? response.data[0].responseMessage
                            : response.data[0].responseMessage,
                        icon: response.data[0].responseCode === "FAILURE" ? "error" : "success",
                        confirmButtonText: "OK",
                        customClass: {
                            confirmButton: response.data[0].responseCode === "FAILURE" ? "btn btn-danger" : "btn btn-success",
                        },
                    });
                    try {
                        const payload = {
                            "vid": "%",
                            "companyid": "",
                            "deptid": "",

                        }
                        const headers = {
                            "Content-Type": "application/json",
                            Accept: "*/*",
                        };

                        axios({
                            method: "POST",
                            url: baseUrl.Url + "/backend/api/GET_AdminVideo",
                            data: JSON.stringify(payload),
                            headers: headers,
                        })
                            .then((response) => {
                                if (response.status != 200) throw new Error("Failed to Fetching Data");
                                const DATA = response.data;
                                setPlotDetails(DATA);
                            })

                    } catch (error) {
                        console.error("Error fetching Access Right Data:", error);
                    }
                })

        } catch (error) {
            console.error("Error fetching Access Right Data:", error);
        }
    }
    return (
        <div className="page-wrapper">
            <div className="content">
                <div className="page-header">
                    <div className="add-item d-flex">
                        <div className="page-title">
                            <h3>Video Master</h3>
                            <h6>Manage your Data</h6>
                        </div>

                    </div>

                    <ul className="table-top-head">
                        <li>
                            <OverlayTrigger placement="top" overlay={renderTooltip}>
                                <Link>
                                    <ImageWithBasePath src="assets/img/icons/pdf.svg" alt="img" />
                                </Link>
                            </OverlayTrigger>
                        </li>
                        <li>
                            <OverlayTrigger placement="top" overlay={renderExcelTooltip}>
                                <Link data-bs-toggle="tooltip" data-bs-placement="top">
                                    <ImageWithBasePath
                                        src="assets/img/icons/excel.svg"
                                        alt="img"
                                    />
                                </Link>
                            </OverlayTrigger>
                        </li>
                        <li>
                            <OverlayTrigger placement="top" overlay={renderPrinterTooltip}>
                                <Link data-bs-toggle="tooltip" data-bs-placement="top">
                                    <i data-feather="printer" className="feather-printer" />
                                </Link>
                            </OverlayTrigger>
                        </li>
                        <li>
                            <OverlayTrigger placement="top" overlay={renderRefreshTooltip}>
                                <Link data-bs-toggle="tooltip" data-bs-placement="top">
                                    <RotateCcw />
                                </Link>
                            </OverlayTrigger>
                        </li>
                        <li>
                            <OverlayTrigger placement="top" overlay={renderCollapseTooltip}>
                                <Link
                                    data-bs-toggle="tooltip"
                                    data-bs-placement="top"
                                    id="collapse-header"
                                    className={data ? "active" : ""}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        dispatch(setToogleHeader(!data));
                                    }}
                                >
                                    <ChevronUp />
                                </Link>
                            </OverlayTrigger>
                        </li>
                    </ul>
                    <div className="page-btn">
                        <Link to={route.AddVideo} className="btn btn-added">
                            <PlusCircle className="me-2 iconsize" /> नवीन
                        </Link>
                    </div>
                    <div className="page-btn">
                        <Link to={route.AppAdminIndex} className="btn btn-secondary">
                            <ArrowLeft className="me-2" />
                            मागे
                        </Link>
                    </div>
                </div>
                {/* Add this alert message here */}
                <div className="alert alert-warning" role="alert">
                    ⚠️ तुम्ही एकाच वेळी एकच व्हिडिओ सक्रिय ठेवू शकता. जर तुम्हाला नवीन व्हिडिओ जोडायचा असेल, तर तुम्हाला आधीच्या व्हिडिओला निष्क्रिय करणे आवश्यक आहे.
                </div>
                <div className="card table-list-card">
                    <div className="card-body">
                        <div className="table-responsive">
                            <Table columns={columns} dataSource={PlotDetails} />
                        </div>
                    </div>
                </div>

                <Brand />
            </div>
        </div>
    );
};



export default VideoMaster;
