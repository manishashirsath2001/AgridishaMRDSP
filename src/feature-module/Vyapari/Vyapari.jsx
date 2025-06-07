import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ImageWithBasePath from "../../core/img/imagewithbasebath";
import Brand from "../../core/modals/inventory/brand";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { all_routes } from "../../Router/all_routes";
import AddCategoryList from "../../core/modals/inventory/addcategorylist";

import { useNavigate } from "react-router-dom";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import Table from "../../core/pagination/datatable";
import { getUserData } from "../../Context/UserData";
import { setToogleHeader } from "../../core/redux/action";
import { baseUrl } from "../../core/json/custom";
import axios from 'axios';

import {
    ArrowLeft,
    ChevronUp,
    Edit,
    // Eye,

    PlusCircle,
    RotateCcw,


    Trash2,
} from "feather-icons-react/build/IconComponents";
// import VyapariVerification from "./VyapariVerification";
// import { getUserData } from "../../Context/UserData";
const Vyapari = () => {
    const { userdetail } = getUserData();
    const dispatch = useDispatch();
    const data = useSelector((state) => state.toggle_header);
    const route = all_routes;
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [Customer, setCustomer] = useState([]);
    // const oneditClick = (vpaid) => {

    //   console.log('vpaid',vpaid)

    //  navigate("/AddVyapari", { state: { vpaid } });
    // };
    const oneditClick = (vpaid) => {
        navigate(route.AddVyapari, { state: { vpaid } });
    };

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
        try {
            const payload = {
                "vpaid": "%",
                "keyword": event.target.value,
                "companyid": "",
                "deptid": ""
            }
            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            axios({
                method: "POST",
                url: baseUrl.Url + "/backend/api/GET_VyapariMaster/_Search",
                data: JSON.stringify(payload),
                headers: headers,
            })

                .then((response) => {
                    if (response.status != 200) throw new Error("Failed to send otp");
                    console.log("response", response.data);
                    setCustomer(response.data);
                })
        } catch (error) {
            console.error("Error while searching Gate Entry data:", error);
        }
    };

    useEffect(() => {
        const handleShortcut = (e) => {
            if ((e.ctrlKey && (e.key === 'a' || e.key === 'A'))) {
                e.preventDefault();
                navigate(route.AddVyapari);
            }
            if ((e.ctrlKey && (e.key === 'e' || e.key === 'E'))) {
                e.preventDefault();
                navigate(route.VyapariIndex);
            }
        };

        window.addEventListener('keydown', handleShortcut);

        return () => {
            window.removeEventListener('keydown', handleShortcut);
        };
    },);


    const MySwal = withReactContent(Swal);

    const showConfirmationAlert = (vpaid) => {
        MySwal.fire({
            title: 'तुम्हाला खात्री आहे का?',
            text: 'हे तुम्ही परत करू शकणार नाही!',
            showCancelButton: true,
            confirmButtonColor: '#00ff00',
            confirmButtonText: 'होय, हटवा!',
            cancelButtonColor: '#ff0000',
            cancelButtonText: 'रद्द करा',
            allowOutsideClick: false,
            allowEscapeKey: false,

        }).then((result) => {
            if (result.isConfirmed) {

                OndeleteRequisition(vpaid);
            } else {
                MySwal.close();
            }

        });
    };


    const OndeleteRequisition = async (vpaid) => {
        try {
            const payload = {
                "vpaid": vpaid,
                "companyid": userdetail?.companyID ? userdetail.companyID : "",
                "deptid": userdetail?.departmentID ? userdetail.departmentID : ""
            }
            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            axios({
                method: "POST",
                url: baseUrl.Url + "/backend/api/SP_DeleteVyapariMaster",
                data: JSON.stringify(payload),
                headers: headers,
            })
                .then((response) => {
                    if (response.status != 200) throw new Error("Failed to Fetching Data");
                    MySwal.fire({
                        title: response.data[0].responseCode === "FAILURE" ? "हटवणे शक्य नाही" : "हटविले!",
                        text: response.data[0].responseMessage,
                        icon: response.data[0].responseCode === "FAILURE" ? "error" : "success",
                        confirmButtonText: "ठीक आहे",
                        customClass: {
                            confirmButton: response.data[0].responseCode === "FAILURE" ? "btn btn-danger" : "btn btn-success",
                        },
                        allowOutsideClick: false,
                        allowEscapeKey: false,

                    });
                    try {
                        const payload = {
                            "vpaid": "%",
                            "keyword": "%",
                            "companyid": userdetail?.companyID ? userdetail.companyID : "",
                            "deptid": userdetail?.departmentID ? userdetail.departmentID : ""
                        };
                        const headers = {
                            "Content-Type": "application/json",
                            Accept: "*/*",
                        };

                        axios({
                            method: "POST",
                            url: baseUrl.Url + "/backend/api/GET_VyapariMaster",
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


    const columns = [

        {
            title: "व्यापारी नाव",
            dataIndex: "vname",
            sorter: (a, b) => a.vname.length - b.vname.length,
        },
        {
            title: "व्यापारी प्रकार",
            dataIndex: "vyaparitype",
            sorter: (a, b) => a.vyaparitype.length - b.vyaparitype.length,
        },
        {
            title: "कंपनीचे नाव ",
            dataIndex: "vcompname",
            sorter: (a, b) => a.vcompname.length - b.vcompname.length,
        },
        {
            title: "मोबाईल नंबर",
            dataIndex: "vmoblie",
            sorter: (a, b) => a.vmoblie.length - b.vmoblie.length,
        },
        // {
        //   title: " Status",
        //   dataIndex: "vstatus",
        //   sorter: (a, b) => a.vstatus.length - b.vstatus.length,
        // },
        // {
        //   title: "स्थिती",
        //   dataIndex: "vstatus",
        //   render: (text) => (
        //     <span
        //       className={`badges ${text === true  ? "status-badge" : "badge-bgdanger"}`}
        //     >
        //       {text === true  ? "Active" : "Inactive"} {/* Display the text based on vstatus */}
        //     </span>
        //   ),
        //   sorter: (a, b) => a.vstatus - b.vstatus, // Sort by the numeric value of vstatus
        // },

        {
            title: "स्थिती",
            dataIndex: "vstatus",
            align: "center",
            render: (text) => (
                <span className={`badge ${text == false ? "badge-success" : "badge-danger"}`}>
                    <Link to="#" style={{ color: "white", textDecoration: "none" }}>
                        {text == false ? "सक्रिय " : "निष्क्रिय"}
                    </Link>
                </span>
            ),
            sorter: (a, b) => a.vstatus - b.vstatus, // Sort by the numeric value of vstatus
        },


        {
            title: "क्रिया",
            dataIndex: "action",
            render: (text, record) => (
                <div className="action-table-data">
                    <div className="edit-delete-action">
                        {/* <Link className="me-2 p-2" to={route.productdetails}>
              <Eye className="feather-view" />
            </Link> */}
                        {/* <Link className="me-2 p-2"  onClick={() => { oneditClick(record.vpaid) }}>
              <Edit className="feather-edit" />
            </Link> */}

                        <a
                            className="me-2 p-2"
                            onClick={() => { oneditClick(record.vpaid) }}
                            title="Edit"
                        >  <Edit className="feather-edit" />
                        </a>

                        <Link
                            className="confirm-text p-2"
                            to="#"
                            onClick={() => showConfirmationAlert(record.vpaid)}
                        >
                            <Trash2 className="feather-trash-2" />
                        </Link>
                    </div>
                </div>
            ),

        },
    ];

    // const MySwal = withReactContent(Swal);

    // const showConfirmationAlert = () => {
    //   MySwal.fire({
    //     title: "Are you sure?",
    //     text: "You won't be able to revert this!",
    //     showCancelButton: true,
    //     confirmButtonColor: "#00ff00",
    //     confirmButtonText: "Yes, delete it!",
    //     cancelButtonColor: "#ff0000",
    //     cancelButtonText: "Cancel",
    //   }).then((result) => {
    //     if (result.isConfirmed) {
    //       MySwal.fire({
    //         title: "Deleted!",
    //         text: "Your file has been deleted.",
    //         className: "btn btn-success",
    //         confirmButtonText: "OK",
    //         customClass: {
    //           confirmButton: "btn btn-success",
    //         },
    //       });
    //     } else {
    //       MySwal.close();
    //     }
    //   });
    // };


    // Empty data source
    // const dataSource = [];
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
        console.log("useEffect triggered");
        const fetchServiceCharge = async () => {
            try {
                const payload =
                {
                    "vpaid": "%",
                    "keyword": "%",
                    "companyid": "COMP123456789",
                    "deptid": "D001",
                    // "companyid": userdetail?.companyID ? userdetail.companyID : "",
                    // "deptid": userdetail?.departmentID ? userdetail.departmentID : ""
                };


                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };
                const response = await axios.post(
                    `${baseUrl.Url}/backend/api/GET_VyapariMaster`,

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

        fetchServiceCharge();

    }, []);

    return (
        <div className="page-wrapper">
            <div className="content">
                <div className="page-header">
                    <div className="add-item d-flex">
                        <div className="page-title">
                            <h3>व्यापारी मास्टर</h3>
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
                        <Link to={route.AddVyapari} className="btn btn-added">
                            <PlusCircle className="me-2 iconsize" /> नवीन
                        </Link>
                    </div>

                    {/* <div className="page-btn">
                        <Link
                            to="#"
                            className="btn btn-added"
                            data-bs-toggle="modal"
                            data-bs-target="#VyapariVerification"
                        >
                            <PlusCircle className="me-2" />
                            नवीन व्यापारी जोडा
                        </Link>
                    </div> */}
                    {/* <div className="page-btn">

                        <button className="btn btn-added"
                            onClick={(e) => {
                                e.preventDefault();


                                const modal = document.getElementById("add-verification");

                                if (modal) {
                                    modal.classList.add("show");
                                    modal.style.display = "block";
                                    modal.setAttribute("aria-modal", "true");
                                    modal.setAttribute("role", "dialog");
                                    modal.removeAttribute("aria-hidden");

                                    const backdrop = document.createElement("div");
                                    backdrop.className = "modal-backdrop fade show";
                                    document.body.appendChild(backdrop);

                                    document.body.classList.add("modal-open");
                                    document.body.style.overflow = "hidden";
                                    document.body.style.paddingRight = "0px";
                                }

                            }}
                        >
                            <PlusCircle className="me-2 iconsize" />
                            नवीन
                        </button>

                    </div> */}


                    <div className="page-btn">
                        <Link to={route.VyapariIndex} className="btn btn-secondary">
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
                                    style={{ height: '35px', padding: '5px' }}
                                />
                                {searchQuery && (
                                    <span className="input-group-text" style={{ cursor: 'pointer', height: '35px', padding: '5px' }}
                                        onClick={() => setSearchQuery('')}>
                                        <i className="fa fa-times"></i>
                                    </span>
                                )}
                                <span className="input-group-text" style={{ height: '35px', padding: '5px' }}>
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
            {/* <VyapariVerification /> */}
        </div>
    );
};

export default Vyapari;

