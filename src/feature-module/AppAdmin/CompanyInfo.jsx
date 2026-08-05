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
const CompanyInfo = () => {
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
                navigate(route.AddCompanyInfo);
            }
            if (e.ctrlKey && e.key === 'e') {
                e.preventDefault();
                navigate(route.AppAdminIndex);
            }
        };
        window.addEventListener('keydown', handleShortcut);
        return () => {
            window.removeEventListener('keydown', handleShortcut);
        };
    }, [navigate]);
    const onEditClick = (cinfoid) => {
        navigate(route.AddCompanyInfo, { state: { CINFOID: cinfoid } });
    };
    const columns = [
        {
            title: "Company ID",
            dataIndex: "companyid",
        },
        {
            title: "Comapny Name",
            dataIndex: "cname",
            sorter: (a, b) => a.cname.localeCompare(b.cname),
        },
        {
            title: "GST NO.",
            dataIndex: "cgstno",
        },
        {
            title: "PAN",
            dataIndex: "cpan",
        },
        {
            title: "Phone",
            dataIndex: "ccontact",
        },
        {
            title: "Action",
            dataIndex: "action",
            render: (_, record) => (
                <div className="action-table-data">
                    <div className="edit-delete-action">
                        <OverlayTrigger placement="top" overlay={<Tooltip id="edit-tooltip">Edit</Tooltip>}>
                            <a
                                className="me-2 p-2"
                                onClick={() => { onEditClick(record.cinfoid) }}
                            >  <Edit className="feather-edit" /></a>
                        </OverlayTrigger>
                        <OverlayTrigger placement="top" overlay={<Tooltip id="delete-tooltip">Delete</Tooltip>}>
                            <Link className="confirm-text p-2" to="#" onClick={() => showConfirmationAlert(record.cinfoid)}>
                                <Trash2 className="feather-trash-2" />
                            </Link>
                        </OverlayTrigger>
                    </div>
                </div>
            ),
        },
    ];
    const MySwal = withReactContent(Swal);
    const handleDelete = async (cinfoid) => {
        try {
            const payload = {
                "cinfoid": cinfoid,
            }
            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };
            axios({
                method: "POST",
                url: baseUrl.Url + "/backend/api/SP_DeleteCompanyInfo",
                data: JSON.stringify(payload),
                headers: headers,
            })
            Swal.fire({
                icon: "success",
                title: "Deleted!",
                text: "Your file has been deleted.",
                confirmButtonText: "OK",
            });
            try {
                const payload =
                {
                    "cinfoid": "%",
                    "keyword": "%"
                }
                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };
                axios({
                    method: "POST",
                    url: baseUrl.Url + "/backend/api/GET_CompanyInfo",
                    data: JSON.stringify(payload),
                    headers: headers,
                })
                    .then((response) => {
                        if (response.status != 200) throw new Error("Failed to send otp");
                        setCustomer(
                            response.data.map((item) => ({
                                cinfoid: item.cinfoid,
                                ccompanyname: item.ccompanyname,
                                cbusinesstype: item.cbusinesstype,
                                ccontactpersonmobile: item.ccontactpersonmobile,
                                companyid: item.companyid,
                                cname: item.cname,
                                ccontact: item.ccontact,
                                ctelephone: item.ctelephone,
                                cemail: item.cemail,
                                caddress: item.caddress,
                                carea: item.carea,
                                clandmark: item.clandmark,
                                ccity: item.ccity,
                                cstate: item.cstate,
                                cpincode: item.cpincode,
                                cregno: item.cregno,
                                cregdate: item.cregdate,
                                cpan: item.cpan,
                                cgstno: item.cgstno,
                                cstatus: item.cstatus,
                                cifsc: item.cifsc,
                                caccountname: item.caccountname,
                                caccountnumber: item.caccountnumber,
                                cbankname: item.cbankname,
                                cbranchname: item.cbranchname
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
                title: "Error",
                text: "Failed to save data. Please try again.",
            });
        }
    };
    const showConfirmationAlert = (cinfoid) => {
        MySwal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            showCancelButton: true,
            confirmButtonColor: "#00ff00",
            confirmButtonText: "Yes, delete it!",
            cancelButtonColor: "#ff0000",
            cancelButtonText: "Cancel",
        }).then((result) => {
            if (result.isConfirmed) {
                handleDelete(cinfoid)
            } else {
                MySwal.close();
            }
        });
    };
    const [Customer, setCustomer] = useState([]);
    const [loading, setLoading] = useState(true);
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
                    "cinfoid": "%",
                    "keyword": "%"
                }
                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };
                axios({
                    method: "POST",
                    url: baseUrl.Url + "/backend/api/GET_CompanyInfo",
                    data: JSON.stringify(payload),
                    headers: headers,
                })
                    .then((response) => {
                        if (response.status != 200) throw new Error("Failed to send otp");
                        setCustomer(
                            response.data.map((item) => ({
                                cinfoid: item.cinfoid,
                                ccompanyname: item.ccompanyname,
                                cbusinesstype: item.cbusinesstype,
                                ccontactpersonmobile: item.ccontactpersonmobile,
                                companyid: item.companyid,
                                cname: item.cname,
                                ccontact: item.ccontact,
                                ctelephone: item.ctelephone,
                                cemail: item.cemail,
                                caddress: item.caddress,
                                carea: item.carea,
                                clandmark: item.clandmark,
                                ccity: item.ccity,
                                cstate: item.cstate,
                                cpincode: item.cpincode,
                                cregno: item.cregno,
                                cregdate: item.cregdate,
                                cpan: item.cpan,
                                cgstno: item.cgstno,
                                cstatus: item.cstatus,
                                cifsc: item.cifsc,
                                caccountname: item.caccountname,
                                caccountnumber: item.caccountnumber,
                                cbankname: item.cbankname,
                                cbranchname: item.cbranchname,
                                facebookid: item.facebookid,
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
    const [searchQuery, setSearchQuery] = useState("");
    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
        try {
            const payload = {
                "cinfoid": "%",
                "keyword": event.target.value
            }
            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };
            axios({
                method: "POST",
                url: baseUrl.Url + "/backend/api/GET_CompanyInfo/_Search",
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
                            <h3>Manage Company Details</h3>
                        </div>
                    </div>
                    <div className="page-btn">
                        <Link to={route.AppAdminIndex} className="btn btn-secondary">
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
export default CompanyInfo;
