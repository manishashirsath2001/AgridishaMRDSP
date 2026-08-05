import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Eye } from "feather-icons-react/build/IconComponents";
import OnProccedQuatation from "./OnProccedQuatation";
import Analize from "./Analize";
import { baseUrl } from "../../core/json/custom";
import axios from "axios";
import { getUserData } from "../../Context/UserData";
// import { all_routes } from "../../Router/all_routes";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
function AddQuatation({ praid, vandorid }) {
    // const route = all_routes;
    // const navigate = useNavigate();
    const { userdetail } = getUserData();
    const [vendors, setVendors] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    useEffect(() => {
        if (vandorid) {
            const fetchVendors = async () => {
                try {
                    const payload = {
                        caid: vandorid,
                        praid: praid,
                        companyid: userdetail?.companyID || "",
                        deptid: userdetail?.departmentID || "",
                    };
                    const headers = {
                        "Content-Type": "application/json",
                        Accept: "*/*",
                    };
                    const response = await axios.post(
                        `${baseUrl.Url}/backend/api/GET_CustomerDetails`,
                        payload,
                        { headers }
                    );
                    if (response.status !== 200)
                        throw new Error("Failed to fetch vendor data");
                    setVendors(response.data);
                    console.log("venderos", response.data)
                } catch (error) {
                    console.error("Error fetching vendor data:", error);
                }
            };

            fetchVendors();
        }
    }, [vandorid, userdetail]);

    // const filteredVendors = vendors.filter((vendor) =>
    //     vendor.ccompanyname?.toLowerCase().includes(searchQuery.toLowerCase())
    // );

    const [selectedData, setSelectedData] = useState({ caid: null, praid: null, cstate: null });

    const onVendorEditClick = (caid, praidid, cstate) => {
        if (caid) {
            praid = (praidid == undefined) ? praid : praidid;
            // navigate(route.OnProccedQuatation, { state: { praid: praid, caid: caid } });
            setSelectedData({ praid, caid, cstate });
        }
    };

    const OnSearchClick = (RNUMBER) => {
        const fetchRNOVendors = async () => {
            try {
                const payload = {
                    prno: RNUMBER,
                    companyid: userdetail?.companyID || "",
                    deptid: userdetail?.departmentID || "",
                };
                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };
                const response = await axios.post(
                    `${baseUrl.Url}/backend/api/GET_PRequisitionNumberSearch`,
                    payload,
                    { headers }
                );
                if (response.status !== 200)
                    throw new Error("Failed to fetch vendor data");
                setVendors(response.data);
                console.log("venderos", response.data)
                if (praid == undefined || praid == '') {
                    praid = response.data[0].praid;
                }
            } catch (error) {
                console.error("Error fetching vendor data:", error);
            }
        };

        fetchRNOVendors();
    }
    const MySwal = withReactContent(Swal);
    const showExitAlert = () => {
        MySwal.fire({
            title: "Are you sure?",
            text: "Do you want to Exit?",
            showCancelButton: true,
            confirmButtonColor: "#00ff00",
            confirmButtonText: "YES",
            cancelButtonColor: "#092C4C",
            cancelButtonText: "NO",
        }).then((result) => {
            if (result.isConfirmed) {
                const modal = document.getElementById("addquatation");
                if (modal) {
                    modal.classList.remove("show");
                    modal.style.display = "none";
                    document.body.classList.remove("modal-open");
                    document.body.style.overflow = "auto";

                    const backdrop = document.querySelector(".modal-backdrop");
                    if (backdrop) {
                        backdrop.remove();
                    }
                }
                const backdrop = document.querySelector(".modal-backdrop");
                if (backdrop) {
                    backdrop.remove();
                }
                setVendors();
                setSearchQuery('');
            }
        });
    };

    return (
        <div>
            <div
                className="modal fade"
                id="addquatation"
                tabIndex={-1}
                aria-labelledby="exampleModalFullscreenLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-fullscreen">
                    <div className="modal-content mbgcolor">
                        <div className="modal-body mbgcolor">
                            <div className="modal-content mbgcolor">
                                <div className="page-wrapper-new p-0">
                                    <div className="content">
                                        <div className="modal-header border-0 custom-modal-header">
                                            <div className="page-title">
                                                <h4>Search Vendor</h4>
                                            </div>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <ul className="table-top-head">
                                                    <li>
                                                        <button
                                                            className="btn btn-secondary"
                                                            aria-label="Close"
                                                            // data-bs-dismiss="modal"
                                                            onClick={showExitAlert}
                                                        >
                                                            <ArrowLeft className="me-2" />
                                                            Back to Quotation Master
                                                        </button>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="modal-body custom-modal-body">
                                            <form>
                                                <div className="row justify-content-center">
                                                    <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-4">
                                                        <div className="search-input d-flex align-items-center">
                                                            <input
                                                                type="text"
                                                                placeholder="Search Requisition Number"
                                                                className="form-control w-100"
                                                                value={searchQuery}
                                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                            />
                                                            <button
                                                                type="button"
                                                                className="btn btn-primary ms-3 mt-1 mt-sm-0"
                                                                onClick={() => OnSearchClick(searchQuery)}
                                                            >
                                                                Search
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="border p-3 rounded shadow-sm mt-2">
                                                    <div className="col-lg-12">
                                                        <div className="modal-body-table overflow-auto max-vh-100" >
                                                            <div className="table-responsive" style={{ height: "calc(40vh - 120px)" }}>
                                                                <table className="table table-bordered table-sm">
                                                                    <thead className="thead-dark" style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: '#343a40' }}>
                                                                        <tr>
                                                                            <th>Vendor Name</th>
                                                                            <th>Vendor Contact Number</th>
                                                                            <th>Vendor Email</th>
                                                                            <th>Quatation status</th>
                                                                            <th>Action</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {vendors?.length > 0 ? (
                                                                            vendors.map((vendor, index) => (
                                                                                <tr key={index}>
                                                                                    <td>{vendor.ccompanyname}</td>
                                                                                    <td>{vendor.ccontactpersonmobile}</td>
                                                                                    <td>{vendor.cemail}</td>
                                                                                    <td>
                                                                                        <span
                                                                                            className={`badges ${vendor.status === 1 ? "status-badge" : "badge-bgdanger"
                                                                                                }`}
                                                                                        >
                                                                                            {vendor.status === 1 ? "Completed" : "Pending"}
                                                                                        </span>
                                                                                    </td>

                                                                                    <td>
                                                                                        <Link
                                                                                            to="#"
                                                                                            className="btn btn-added"
                                                                                            data-bs-toggle="modal"
                                                                                            data-bs-target="#onprocedquatation"
                                                                                            onClick={() => onVendorEditClick(vendor.caid, vendor.praid, vendor.cstate)}
                                                                                        >
                                                                                            <Eye className="feather-view" />
                                                                                        </Link>
                                                                                    </td>
                                                                                </tr>
                                                                            ))
                                                                        ) : (
                                                                            <tr>
                                                                                <td colSpan="5">No vendors found</td>
                                                                            </tr>
                                                                        )}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="d-flex justify-content-end">
                                                    <Link
                                                        to="#"
                                                        className="btn btn-submit"
                                                        data-bs-toggle="modal"
                                                        data-bs-target="#analize"
                                                    >
                                                        Analyze
                                                    </Link>
                                                </div>

                                                <div className="col-lg-12">
                                                    <div className="modal-footer-btn">
                                                        <button
                                                            type="button"
                                                            className="btn btn-cancel me-2"
                                                            // data-bs-dismiss="modal"
                                                            onClick={showExitAlert}
                                                        >
                                                            Exit
                                                        </button>
                                                        <Link to="#" className="btn btn-submit">
                                                            Save
                                                        </Link>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* <OnProccedQuatation /> */}
            <OnProccedQuatation
                praid={selectedData.praid}
                caid={selectedData.caid}
                CSTATE={selectedData.cstate}
            />
            <Analize
                praid={praid}
            />
        </div>
    );
}

export default AddQuatation;
