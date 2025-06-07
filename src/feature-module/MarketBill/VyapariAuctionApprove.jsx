import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ImageWithBasePath from "../../core/img/imagewithbasebath";
import Brand from "../../core/modals/inventory/brand";
// import withReactContent from "sweetalert2-react-content";
// import Swal from "sweetalert2";
// import { all_routes } from "../../Router/all_routes";
// import AddCategoryList from "../../core/modals/inventory/addcategorylist";

// import {  useNavigate } from "react-router-dom";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import Table from "../../core/pagination/datatable";
import { setToogleHeader } from "../../core/redux/action";
import { baseUrl } from "../../core/json/custom";
import axios from 'axios';
// import FeatherIcon from "feather-icons-react";
import { getUserData } from '../../Context/UserData';
import {
    ArrowLeft,
    ChevronUp,
    // Edit,
    // Eye,

    //   PlusCircle,
    RotateCcw,


    //   Trash2,
} from "feather-icons-react/build/IconComponents";
import AddVyapariAuctionApprove from "./AddVyapariAuctionApprove";
import { all_routes } from "../../Router/all_routes";
// import VyapariApprove from "./VyapariApprove";

const VyapariAuctionApprove = () => {
    // const MySwal = withReactContent(Swal);
    const dispatch = useDispatch();
    const data = useSelector((state) => state.toggle_header);
    const { userdetail } = getUserData();
    const [Customer, setCustomer] = useState([]);
    const route = all_routes;
    const [refreshFlag, setRefreshFlag] = useState(false);
    useEffect(() => {
        console.log("useEffect triggered");
        const fetchServiceCharge = async () => {
            try {
                const payload =
                {
                    baid: '%',
                    keyword: '%',
                    "companyid": userdetail?.companyID ? userdetail.companyID : "",
                    "deptid": userdetail?.departmentID ? userdetail.departmentID : "",
                };


                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };
                const response = await axios.post(
                    `${baseUrl.Url}/backend/api/GET_VyapariApprove`,

                    payload,
                    { headers }
                );
                if (response.status !== 200)
                    throw new Error("Failed to fetch vendor data");
                const seen = new Set();
                const uniqueData = response.data.filter(item => {
                    const key = item.billno;
                    if (seen.has(key)) return false;
                    seen.add(key);
                    return true;
                });


                console.log("Filtered Unique Data:", uniqueData);
                setCustomer(uniqueData);
            } catch (error) {
                console.error("Error fetching vendor data:", error);
            }
        };

        fetchServiceCharge();

    }, []);


    const [selectedData, setSelectedData] = useState({ baid: null });
    const openModal = (baid) => {
        setSelectedData({ baid: baid })
    }

    const refreshData = () => {
        const fetchServiceCharge = async () => {
            try {
                const payload =
                {
                    baid: '%',
                    keyword: '%',
                    "companyid": userdetail?.companyID ? userdetail.companyID : "",
                    "deptid": userdetail?.departmentID ? userdetail.departmentID : "",
                };


                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };
                const response = await axios.post(
                    `${baseUrl.Url}/backend/api/GET_VyapariApprove`,

                    payload,
                    { headers }
                );
                if (response.status !== 200)
                    throw new Error("Failed to fetch vendor data");
                const seen = new Set();
                const uniqueData = response.data.filter(item => {
                    const key = item.billno;
                    if (seen.has(key)) return false;
                    seen.add(key);
                    return true;
                });


                console.log("Filtered Unique Data:", uniqueData);
                setCustomer(uniqueData);
            } catch (error) {
                console.error("Error fetching vendor data:", error);
            }
        };

        fetchServiceCharge();
    };

    // for Refresh
    useEffect(() => {
        setSelectedData({ baid: null });
    }, [refreshFlag]);

    const columns = [
        {
            title: "बिल नं.",
            dataIndex: "billno",
            align: "left",
        },
        {
            title: "दिनांक",
            dataIndex: "date",
            align: "left",
        },
        {
            title: "व्यापारी नाव",
            dataIndex: "vname",
            align: "center",
        },

        {
            title: "शेतकरी नाव",
            dataIndex: "fname",
            align: "center",
        },

        {
            title: "कार्य",
            dataIndex: "action",
            align: "center",
            render: (text, record) => {


                return (
                    <div className="action-table-data">
                        <div className="edit-delete-action">
                            {record.isvyapariverified === true ? (
                                <button className="btn btn-success px-2 py-2"
                                    data-bs-toggle="modal"
                                    data-bs-target="#Approve"
                                    onClick={() => {
                                        openModal(record.baid);
                                    }}
                                >
                                    Complete
                                </button>
                            ) : (
                                <button
                                    className="btn btn-warning px-2 py-2"
                                    data-bs-toggle="modal"
                                    data-bs-target="#Approve"
                                    onClick={() => {
                                        openModal(record.baid);
                                    }}
                                >
                                    Incomplete
                                </button>
                            )}
                        </div>
                    </div>

                );
            },
        },
    ];


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

    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);



        try {
            const payload = {
                "baid": "%",
                "keyword": event.target.value,
                "companyid": userdetail?.companyID ? userdetail.companyID : "",
                "deptid": userdetail?.departmentID ? userdetail.departmentID : "",
            };
            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            axios({
                method: "POST",
                url: baseUrl.Url + "/backend/api/GET_VyapariApprove/_Search",
                data: JSON.stringify(payload),
                headers: headers,
            })
                .then((response) => {
                    if (response.status != 200) throw new Error("Failed to send otp");
                    console.log("response", response.data);
                    const seen = new Set();
                    const uniqueData = response.data.filter(item => {
                        const key = item.billno;
                        if (seen.has(key)) return false;
                        seen.add(key);
                        return true;
                    });
                    console.log("Filtered Unique Data:", uniqueData);
                    setCustomer(uniqueData);
                })
        } catch (error) {
            console.error("Error while searching Service data:", error);
        }
    };

    return (
        <div className="page-wrapper">
            <div className="content">
                <div className="page-header">
                    <div className="add-item d-flex">
                        <div className="page-title">
                            <h3>शेतकरी माल मान्यता</h3>
                            <h6></h6>
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
                        <Link to={route.MarketBillIndex} className="btn btn-secondary">
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
                        <div className="table-responsive">
                            <Table columns={columns} dataSource={Customer} />
                        </div>
                    </div>
                </div>


                <Brand />
            </div>
            {/* <AddCategoryList /> */}
            <AddVyapariAuctionApprove BAID={selectedData.baid} onRefresh={refreshData} />
        </div>
    );
};

export default VyapariAuctionApprove;

