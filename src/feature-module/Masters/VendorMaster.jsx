import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import ImageWithBasePath from "../../core/img/imagewithbasebath";
import Brand from "../../core/modals/inventory/brand";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { all_routes } from "../../Router/all_routes";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import Table from "../../core/pagination/datatable";
import { setToogleHeader } from "../../core/redux/action";
import axios from "axios";
import {
    ArrowLeft,
    ChevronUp,
    Edit,

    PlusCircle,
    RotateCcw,


    Trash2,
} from "feather-icons-react/build/IconComponents";
import { baseUrl } from "../../core/json/custom";
import { getUserData } from "../../Context/UserData";

const VendorMaster = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const data = useSelector((state) => state.toggle_header);
    const route = all_routes;
    const { isAuthenticated, userdetail } = getUserData();
    if (isAuthenticated == true) {
        console.log("user", userdetail);
        console.log("getUserData", getUserData);
    }

    useEffect(() => {
        const handleShortcut = (e) => {
            if (e.ctrlKey && e.key === 'a') {
                e.preventDefault();
                navigate(route.AddVendorMaster);
            }
            if (e.ctrlKey && e.key === 'e') {
                e.preventDefault();
                navigate(route.MasterIndex);
            }
        };

        window.addEventListener('keydown', handleShortcut);

        return () => {
            window.removeEventListener('keydown', handleShortcut);
        };
    }, [navigate]);

    const onEditClick = (caid) => {
        navigate(route.AddVendorMaster, { state: { CAID: caid } });
    };
    const columns = [
        {
            title: "नाव",
            dataIndex: "ccompanyname",
            sorter: (a, b) => a.ccompanyname.localeCompare(b.ccompanyname),
        },
        {
            title: "प्रकार",
            dataIndex: "cbusinesstype",
            sorter: (a, b) => a.cbusinesstype.localeCompare(b.cbusinesstype),
        },
        {
            title: "फोन",
            dataIndex: "ccontactpersonmobile",
        },
        {
            title: "शहर",
            dataIndex: "ccity",
            sorter: (a, b) => a.ccity.localeCompare(b.ccity),
        },
        {
            title: "राज्य",
            dataIndex: "cstate",
            sorter: (a, b) => a.cstate.localeCompare(b.cstate),
        },
        {
            title: "व्यवसायाचे नाव",
            dataIndex: "ctradename",
            sorter: (a, b) => a.ctradename.localeCompare(b.ctradename),
        },
        {
            title: "क्रिया",
            dataIndex: "action",
            render: (_, record) => (
                <div className="action-table-data">
                    <div className="edit-delete-action">
                        <OverlayTrigger placement="top" overlay={<Tooltip id="edit-tooltip">संपादित करा</Tooltip>}>
                            <a
                                className="me-2 p-2"
                                onClick={() => { onEditClick(record.caid) }}
                            >
                                <Edit className="feather-edit" />
                            </a>
                        </OverlayTrigger>
                        <OverlayTrigger placement="top" overlay={<Tooltip id="delete-tooltip">हटवा</Tooltip>}>
                            <Link className="confirm-text p-2" to="#" onClick={() => showConfirmationAlert(record.caid)}>
                                <Trash2 className="feather-trash-2" />
                            </Link>
                        </OverlayTrigger>
                    </div>
                </div>
            ),
        },
    ];

    const MySwal = withReactContent(Swal);
    const handleDelete = async (caid) => {
        try {
            const payload = {
                "caid": caid
                , "companyid": userdetail?.companyID ? userdetail.companyID : "",
                "deptid": userdetail?.departmentID ? userdetail.departmentID : ""
            }
            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            axios({
                method: "POST",
                url: baseUrl.Url + "/backend/api/_SP_DeleteCustomersPartners_",
                data: JSON.stringify(payload),
                headers: headers,
            })

            Swal.fire({
                icon: "success",
                title: "हटवले!",
                text: "तुमची फाईल यशस्वीरित्या हटवली आहे.",
                confirmButtonText: "ठीक आहे",

            });
            try {
                const payload = {
                    "pkid": "%"
                    , "keyword": "%"
                    , "ctype": "3"
                    , "companyid": userdetail?.companyID ? userdetail.companyID : "",
                    "deptid": userdetail?.departmentID ? userdetail.departmentID : ""
                };
                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };
                axios({
                    method: "POST",
                    url: baseUrl.Url + "/backend/api/_GET_CustomersPartners_/getByID",
                    data: JSON.stringify(payload),
                    headers: headers,
                })
                    .then((response) => {
                        if (response.status != 200) throw new Error("Failed to send otp");
                        setCustomer(
                            response.data.map((item) => ({
                                caid: item.caid,
                                ccompanyname: item.ccompanyname,
                                cbusinesstype: item.cbusinesstype,
                                ccontactpersonmobile: item.ccontactpersonmobile,
                                ccity: item.ccity,
                                cstate: item.cstate,
                                ctradename: item.ctradename,
                            }))

                        );
                    })

            } catch (error) {
                console.error("Error fetching Customer Data:", error);
            } finally {
                setLoading(false);
            }

        } catch (error) {
            console.error("Submission Error:", error);
            Swal.fire({
                icon: "error",
                title: "त्रुटी",
                text: "डेटा सेव्ह करण्यात अयशस्वी. कृपया पुन्हा प्रयत्न करा.",

            });
        }

    };
    const showConfirmationAlert = (caid) => {
        MySwal.fire({
            title: "तुम्हाला खात्री आहे का?",
            text: "हे कृती उलटवता येणार नाही!",
            showCancelButton: true,
            confirmButtonColor: "#00ff00",
            confirmButtonText: "होय, हटवा!",
            cancelButtonColor: "#ff0000",
            cancelButtonText: "रद्द करा",
            allowOutsideClick: false,
            allowEscapeKey: false,

        }).then((result) => {
            if (result.isConfirmed) {
                handleDelete(caid)
            } else {
                MySwal.close();
            }
        });
    };
    const [Customer, setCustomer] = useState([]);
    const [loading, setLoading] = useState(true);

    // Empty data source
    // const dataSource = [Customer];
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


    useEffect(() => {
        const fetchCustomer = async () => {
            try {
                const payload = {
                    "pkid": "%"
                    , "keyword": "%"
                    , "ctype": "3"
                    , "companyid": userdetail?.companyID ? userdetail.companyID : "",
                    "deptid": userdetail?.departmentID ? userdetail.departmentID : ""
                };
                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };

                axios({
                    method: "POST",
                    url: baseUrl.Url + "/backend/api/_GET_CustomersPartners_/getByID",
                    data: JSON.stringify(payload),
                    headers: headers,
                })
                    .then((response) => {
                        if (response.status != 200) throw new Error("Failed to send otp");
                        setCustomer(
                            response.data.map((item) => ({
                                caid: item.caid,
                                ccompanyname: item.ccompanyname,
                                cbusinesstype: item.cbusinesstype,
                                ccontactpersonmobile: item.ccontactpersonmobile,
                                ccity: item.ccity,
                                cstate: item.cstate,
                                ctradename: item.ctradename,
                            }))

                        );
                    })
            } catch (error) {
                console.error("Error fetching Customer Data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCustomer();
    }, []);

    const OnReloadData = () => {
        try {
            const payload = {
                "pkid": "%"
                , "keyword": "%"
                , "ctype": "3"
                , "companyid": userdetail?.companyID ? userdetail.companyID : "",
                "deptid": userdetail?.departmentID ? userdetail.departmentID : ""
            };
            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            axios({
                method: "POST",
                url: baseUrl.Url + "/backend/api/_GET_CustomersPartners_/getByID",
                data: JSON.stringify(payload),
                headers: headers,
            })
                .then((response) => {
                    if (response.status != 200) throw new Error("Failed to send otp");
                    setCustomer(
                        response.data.map((item) => ({
                            caid: item.caid,
                            ccompanyname: item.ccompanyname,
                            cbusinesstype: item.cbusinesstype,
                            ccontactpersonmobile: item.ccontactpersonmobile,
                            ccity: item.ccity,
                            cstate: item.cstate,
                            ctradename: item.ctradename,
                        }))

                    );
                })
        } catch (error) {
            console.error("Error fetching Customer Data:", error);
        } finally {
            setLoading(false);
        }
    }

    const [searchQuery, setSearchQuery] = useState("");
    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
        try {
            const payload = {
                "pkid": "%",
                "ctype": "3",
                "keyword": event.target.value
                , "companyid": userdetail?.companyID ? userdetail.companyID : "",
                "deptid": userdetail?.departmentID ? userdetail.departmentID : ""
            }
            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            axios({
                method: "POST",
                url: baseUrl.Url + "/backend/api/_GET_CustomersPartners_/Serch",
                data: JSON.stringify(payload),
                headers: headers,
            })

                .then((response) => {
                    if (response.status != 200) throw new Error("Failed to send ");
                    console.log("response", response.data);
                    setCustomer(response.data);
                })
        } catch (error) {
            console.error("Error while searching  data:", error);
        }
    };

    return (
        <div className="page-wrapper">
            <div className="content">
                <div className="page-header">
                    <div className="add-item d-flex">
                        <div className="page-title">
                            <h3>विक्रेता मास्टर व्यवस्थापित करा</h3>

                            {/* <h6>Manage Vendor</h6> */}
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
                                <Link data-bs-toggle="tooltip" data-bs-placement="top" onClick={OnReloadData}>
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
                        <Link to={route.AddVendorMaster} className="btn btn-added">
                            <PlusCircle className="me-2 iconsize" />विक्रेता नोंदवा

                        </Link>
                    </div>
                    <div className="page-btn">
                        <Link to={route.PeopleIndex} className="btn btn-secondary">
                            <ArrowLeft className="me-2" />
                            मागे
                        </Link>
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
                <div className="card table-list-card">
                    <div className="card-body">
                        {loading ? (
                            <p>Loading...</p>
                        ) : (
                            <div className="table-responsive">
                                <Table columns={columns} dataSource={Customer} />
                            </div>
                        )}
                    </div>
                </div>


                <Brand />
            </div>
        </div>
    );
};

export default VendorMaster;
