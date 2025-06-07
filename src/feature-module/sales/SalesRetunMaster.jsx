import React, { useState, useEffect } from "react";
import ImageWithBasePath from "../../core/img/imagewithbasebath";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import axios from "axios";
import { baseUrl } from "../../core/json/custom";
import { Link } from "react-router-dom";
import { ArrowLeft } from "feather-icons-react/build/IconComponents";
import {
    ChevronUp,
    PlusCircle,
    RotateCcw,
} from "feather-icons-react/build/IconComponents";
import { setToogleHeader } from "../../core/redux/action";
import { useDispatch, useSelector } from "react-redux";
// import Select from "react-select";
// import ImportPurchases from "../../core/modals/purchases/importpurchases";
// import EditPurchases from "../../core/modals/purchases/editpurchases";
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import Table from "../../core/pagination/datatable";
import AddSalesReturn from "./addSalesReturn";
import { all_routes } from "../../Router/all_routes";
import { getUserData } from "../../Context/UserData";

function SalesRetunMaster() {
    const [Customer, setCustomer] = useState([]);
    const route = all_routes;
    const { userdetail } = getUserData();
    const [searchQuery, setSearchQuery] = useState("");
    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
        try {
            const payload = {
                "sraid": "%",
                "keyword": event.target.value,
                "companyid": userdetail?.companyID || "",
                "deptid": userdetail?.departmentID || "",
            }
            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            axios({
                method: "POST",
                url: baseUrl.Url + "/backend/api/GET_SReturnMaster/_Search",
                data: JSON.stringify(payload),
                headers: headers,
            })

                .then((response) => {
                    if (response.status != 200) throw new Error("Failed to send otp");
                    console.log("response", response.data);
                    setCustomer(response.data);
                })
        } catch (error) {
            console.error("Error while searching Challan data:", error);
        }
    };

    useEffect(() => {

        const fetchVendors = async () => {
            try {
                const payload = {
                    "sraid": "%",
                    "keyword": "%",
                    "companyid": userdetail?.companyID || "",
                    "deptid": userdetail?.departmentID || "",
                };
                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };
                const response = await axios.post(
                    `${baseUrl.Url}/backend/api/GET_SReturnMaster`,
                    payload,
                    { headers }
                );
                if (response.status !== 200)
                    throw new Error("Failed to fetch vendor data");
                console.log("quatation master", response.data)
                setCustomer(response.data);
            } catch (error) {
                console.error("Error fetching vendor data:", error);
            }
        };

        fetchVendors();

    }, []);



    const [selectedData, setSelectedData] = useState({ sraid: null });

    const openModal = (sraid) => {
        setSelectedData({ sraid })
    }

    const columns = [

        {
            title: () => (<OverlayTrigger plcement="top"
                overlay={renderSellerTooltip}>
                <div style={{ textAlign: "center" }}>
                    <span>Bill Number</span>
                </div>
            </OverlayTrigger>),
            dataIndex: "sbno",

            render: (text) => (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id={`tooltip-${text}`}>{text}</Tooltip>}>
                    <div style={{ textAlign: "center" }}>{text}</div>
                </OverlayTrigger>
            ),
            sorter: (a, b) => a.sbno.length - b.sbno.length,
        },

        {
            title: () => (<OverlayTrigger placement="top"
                overlay={renderSellerTooltip}>
                <div style={{ textAlign: "center" }}>
                    <span>बिल तारीख</span>
                </div>
            </OverlayTrigger>),
            dataIndex: "sbdate",

            render: (text) => (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id={'tooltip-${text}'}>{text}</Tooltip>}>
                    <div style={{ textAlign: "center" }}>{text}</div>
                </OverlayTrigger>
            ),
            sorter: (a, b) => a.sbdate.length - b.sbdate.length,
        },

        {
            title: () => (<OverlayTrigger placement="top"
                overlay={renderTransactionTooltip}>
                <div style={{ textAlign: "center" }}>
                    <span>लेनदेन क्रमांक</span>
                </div>
            </OverlayTrigger>),
            dataIndex: "sotrnno",

            render: (text) => (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id={'tooltip-${text}'}>{text}</Tooltip>}>
                    <div style={{ textAlign: "center" }}>{text}</div>
                </OverlayTrigger>
            )
        },

        {
            title: () => (<OverlayTrigger placement="top"
                overlay={renderTransactiondateTooltip}>
                <div style={{ textAlign: "center" }}>
                    <span>लेनदेन तारीख</span>
                </div>
            </OverlayTrigger>),
            dataIndex: "srdate",

            render: (text) => (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id={'tooltip -${text}'}>{text}</Tooltip>}>
                    <div style={{ textAlign: "center" }}>{text}</div>
                </OverlayTrigger>
            )
        },

        {
            title: () => (<OverlayTrigger placement="top"
                overlay={renderActionTooltip}>
                <div style={{ textAlign: "center" }}>
                    <span>कृती</span>
                </div>
            </OverlayTrigger>),
            dataIndex: "actions",
            key: "actions",

            render: (_, record) => (
                <div className="action-table-data">
                    <div className="edit-delete-action">

                        <OverlayTrigger placement="top" overlay={renderEditTooltip}>
                            <Link
                                className="me-2 p-2" data-bs-toggle="modal" data-bs-target="#AddSalesReturn" onClick={() => openModal(record.sraid)} >
                                <i data-feather="edit" className="feather-edit"></i>
                            </Link>
                        </OverlayTrigger>

                        <OverlayTrigger placement="top" overlay={renderDeleteTooltip}>
                            <Link className="confirm-text me-2 p-2" to="#" onClick={() => showConfirmationAlert(record.sraid)}>
                                <i data-feather="trash-2" className="feather-trash-2"></i>
                            </Link>
                        </OverlayTrigger>

                    </div>
                </div>
            ),
        },
    ];
    const dispatch = useDispatch();
    const data = useSelector((state) => state.toggle_header);

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

    const renderDeleteTooltip = (props) => (
        <Tooltip id="Delete-tooltip" {...props}>
            Delete
        </Tooltip>
    );
    const renderEditTooltip = (props) => (
        <Tooltip id="Edit-tooltip" {...props}>
            Edit
        </Tooltip>
    );
    const renderActionTooltip = (props) => (
        <Tooltip id="Action-tooltip" {...props}>
            Action
        </Tooltip>
    );
    const renderSellerTooltip = (props) => (
        <Tooltip id="Seller-tooltip" {...props}>
            Seller
        </Tooltip>
    );
    const renderTransactionTooltip = (props) => (
        <Tooltip id="Transaction-tooltip" {...props}>
            Transaction Number
        </Tooltip>
    );
    const renderTransactiondateTooltip = (props) => (
        <Tooltip id="Transcationdate-Tooltip" {...props}>
            Transaction Date
        </Tooltip>
    )

    const MySwal = withReactContent(Swal);

    const showConfirmationAlert = (sraid) => {
        MySwal.fire({
            title: 'Are you sure?',
            text: 'You won\'t be able to revert this!',
            showCancelButton: true,
            confirmButtonColor: '#00ff00',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonColor: '#ff0000',
            cancelButtonText: 'Cancel',
        }).then((result) => {
            if (result.isConfirmed) {

                OndeleteRequisition(sraid);
            } else {
                MySwal.close();
            }

        });
    };


    const OndeleteRequisition = async (sraid) => {
        try {
            const payload = {
                "sraid": sraid,
                "companyid": userdetail?.companyID || "",
                "deptid": userdetail?.departmentID || "",
            }
            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            axios({
                method: "POST",
                url: baseUrl.Url + "/backend/api/SP_DeleteSReturn",
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
                            "sraid": "%",
                            "keyword": "%",
                            "companyid": userdetail?.companyID || "",
                            "deptid": userdetail?.departmentID || "",
                        }
                        const headers = {
                            "Content-Type": "application/json",
                            Accept: "*/*",
                        };

                        axios({
                            method: "POST",
                            url: baseUrl.Url + "/backend/api/GET_SReturnMaster",
                            data: JSON.stringify(payload),
                            headers: headers,
                        })
                            .then((response) => {
                                if (response.status != 200) throw new Error("Failed to Fetching Data");
                                const DATA = response.data;
                                setCustomer(DATA);
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
        <div>
            <div className="page-wrapper">
                <div className="content">
                    <div className="page-header transfer">
                        <div className="add-item d-flex">
                            <div className="page-title">
                                <h4>Sales Return</h4>
                                <h6>Manage Sales Return</h6>
                            </div>
                        </div>
                        <ul className="table-top-head">
                            <li>
                                <OverlayTrigger placement="top" overlay={renderTooltip}>
                                    <Link>
                                        <ImageWithBasePath
                                            src="assets/img/icons/pdf.svg"
                                            alt="img"
                                        />
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
                                        onClick={() => {
                                            dispatch(setToogleHeader(!data));
                                        }}
                                    >
                                        <ChevronUp />
                                    </Link>
                                </OverlayTrigger>
                            </li>
                        </ul>
                        <div className="d-flex purchase-pg-btn">
                            <div className="page-btn">
                                <Link
                                    to="#"
                                    className="btn btn-added"
                                    data-bs-toggle="modal"
                                    data-bs-target="#add-units"
                                >
                                    <PlusCircle className="me-2" />
                                   	नवीन विक्री परतावा जोडा
                                </Link>
                            </div>
                            <div className="page-btn">
                                <Link to={route.SalesIndex} className="btn btn-secondary">
                                    <ArrowLeft className="me-2" />
                             		      मागे
                                </Link>
                            </div>

                        </div>
                    </div>
                    <div className="search-container mb-3">
                        <div className="row">
                            <div className="col-lg-6 col-12 ms-auto">
                                <div className="input-group">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Search"
                                        value={searchQuery}
                                        onChange={handleSearch}

                                    />
                                    <span className="input-group-text">
                                        <i className="fa fa-search"></i>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* /product list */}
                    <div className="card table-list-card">
                        <div className="card-body">

                            <div className="table-responsive product-list">
                                <Table columns={columns} dataSource={Customer} />
                            </div>

                        </div>
                    </div>

                    {/* /product list */}
                </div>
            </div>
            <AddSalesReturn SRAID={selectedData.sraid} />
            {/* <ImportPurchases />
            <EditPurchases /> */}
        </div>
    )
}

export default SalesRetunMaster
