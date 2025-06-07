import React, { useState } from "react";
import { Link } from "react-router-dom";
// import { ArrowLeft } from "feather-icons-react/build/IconComponents";
import { baseUrl } from "../../core/json/custom";
import axios from "axios";
import { getUserData } from "../../Context/UserData";
import OnProccedPurchaseOrder from "./OnProccedPurchaseOrder";
import { ArrowLeft, Eye } from "feather-icons-react/build/IconComponents";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
function AddPurchaseOrder() {
    const [Quatetions, setQuatetions] = useState([]);
    const { userdetail } = getUserData();
    const [searchQuery, setSearchQuery] = useState("");

    // // Filter vendors based on vendor name matching the search query
    // const filteredVendors = vendors.filter((vendor) =>
    //     vendor.vendorName.toLowerCase().includes(searchQuery.toLowerCase())
    // );

    const OnSearchClick = (RNUMBER) => {
        const fetchRNOVendors = async () => {
            try {
                const payload = {
                    keyword: RNUMBER,
                    companyid: userdetail?.companyID || "",
                    deptid: userdetail?.departmentID || "",
                };
                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };
                const response = await axios.post(
                    `${baseUrl.Url}/backend/api/GET_QuatationSearchNo`,
                    payload,
                    { headers }
                );
                if (response.status !== 200)
                    throw new Error("Failed to fetch vendor data");
                setQuatetions(response.data);
                console.log("Quatetions", response.data)
            } catch (error) {
                console.error("Error fetching vendor data:", error);
            }
        };

        fetchRNOVendors();
    }

    const [selectedData, setSelectedData] = useState({ vendorid: null, qamaid: null });

    const onVendorEditClick = (vendorid, qamaid) => {
        if (vendorid) {
            // navigate(route.OnProccedQuatation, { state: { praid: praid, caid: caid } });
            setSelectedData({ vendorid, qamaid });
        }
    };

    const MySwal = withReactContent(Swal);
    const showExitAlert = () => {
        MySwal.fire({
            title: "तुला खात्री आहे का?",
            text: "तुम्हाला बाहेर पडायचं आहे का?",
            showCancelButton: true,
            confirmButtonColor: "#00ff00",
            confirmButtonText: "होय",
            cancelButtonColor: "#092C4C",
            cancelButtonText: "नाही",
        }).then((result) => {
            if (result.isConfirmed) {
                const modal = document.getElementById("AddPurchaseorder");
                if (modal) {
                    modal.classList.remove("show");
                    modal.style.display = "none";
                    document.body.classList.remove("modal-open");
                    document.body.style.overflow = "auto";

                    const backdrop = document.querySelector(".modal-backdrop");
                    if (backdrop) {
                        backdrop.remove();
                    }

                    setQuatetions();
                    setSearchQuery("");
                }
                const backdrop = document.querySelector(".modal-backdrop");
                if (backdrop) {
                    backdrop.remove();
                }

            }
        });
    };
    return (
        <div>
            {/* <div
                className="modal fade"
                id="AddPurchaseorder"
                tabIndex={-1}
                aria-labelledby="exampleModalFullscreenLabel"
                aria-hidden="true"
            > */}
            <div
                className="modal fade"
                id="AddPurchaseorder"
                tabIndex={-1}
                aria-labelledby="exampleModalFullscreenLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-fullscreen">
                    <div className="modal-content">
                        <div className="modal-body">
                            <div className="modal-content">
                                <div className="page-wrapper-new p-0">
                                    <div className="content">
                                        <div className="modal-header border-0 custom-modal-header">
                                            <div className="page-title">
                                                <h4>खरेदी संपादित करा</h4>
                                            </div>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <ul className="table-top-head">
                                                    <li>
                                                        <div className="page-btn">
                                                            <button className="btn btn-secondary"
                                                                aria-label="Close"
                                                                // data-bs-dismiss="modal"
                                                                onClick={showExitAlert}>
                                                                <ArrowLeft className="me-2" />
                                                                परत खरेदी ऑर्डर
                                                            </button>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="modal-body custom-modal-body">
                                            <form>
                                                {/* <div className="row">
                      <div className="search-set">
                        <div className="search-input">
                          <input
                            type="text"
                            placeholder="Search Vendor Name"
                            className="form-control formsearch"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                          <Link to="#" className="btn btn-searchset">
                            <i
                              data-feather="search"
                              className="feather-search"
                            />
                          </Link>
                        </div>
                      </div>
                    </div> */}

                                                <div className="row justify-content-center">
                                                    <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-4">
                                                        <div className="search-input d-flex align-items-center">
                                                            <input
                                                                type="text"
                                                                placeholder="Search Rquisition No. or Quatation No."
                                                                className="form-control w-100"
                                                                value={searchQuery}
                                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                            />

                                                            <button
                                                                type="button"
                                                                className="btn btn-primary ms-3 mt-1 mt-sm-0"
                                                                onClick={() => OnSearchClick(searchQuery)}
                                                            >
                                                                शोधणे
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>


                                                {/* Conditionally render the table based on searchQuery */}
                                                {searchQuery && (
                                                    <div className="col-lg-12">
                                                        <div className="modal-body-table">
                                                            <div className="table-responsive">
                                                                <table className="table datanew">
                                                                    <thead>
                                                                        <tr>
                                                                            <th>विक्रेत्याचे नाव</th>
                                                                            <th>विक्रेता संपर्क क्रमांक</th>
                                                                            <th>कोटेशन तारीख</th>
                                                                            <th>कोटेशन अंतिम तारीख </th>
                                                                            <th>क्रिया</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {Quatetions?.length > 0 ? (
                                                                            Quatetions?.map((vendor, index) => (
                                                                                <tr key={index}>
                                                                                    <td>{vendor.vendorname}</td>
                                                                                    <td>{vendor.qvcontact}</td>
                                                                                    <td>{vendor.qdate}</td>
                                                                                    <td>{vendor.qduedate}</td>
                                                                                    {/* <td>{vendor.status}</td> */}
                                                                                    {/* <td>
                                                                                        <Link className="me-2 p-2" to="#" data-bs-toggle="modal" data-bs-target="#add-units">
                                                                                            <i data-feather="eye" className="feather-eye"></i>
                                                                                        </Link>
                                                                                    </td> */}
                                                                                    <td>
                                                                                        <Link
                                                                                            to="#"
                                                                                            className="btn btn-added"
                                                                                            data-bs-toggle="modal"
                                                                                            data-bs-target="#onproceedorder"
                                                                                            onClick={() => onVendorEditClick(vendor.qvaid, vendor.qamaid)}
                                                                                        >
                                                                                            <Eye className="feather-view" />
                                                                                        </Link>
                                                                                    </td>
                                                                                </tr>
                                                                            ))
                                                                        ) : (
                                                                            <tr>
                                                                                <td colSpan="6">कोणतेही विक्रेता आढळले नाहीत</td>
                                                                            </tr>
                                                                        )}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="col-lg-12">
                                                    <div className="modal-footer-btn">
                                                        <button
                                                            type="button"
                                                            className="btn btn-cancel me-2"
                                                            // data-bs-dismiss="modal"
                                                            onClick={showExitAlert}
                                                        >
                                                            बाहेर
                                                        </button>
                                                        <Link to="#" className="btn btn-submit">
                                                            जतन करा
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
            <OnProccedPurchaseOrder
                qamaid={selectedData.qamaid}
                vandorid={selectedData.vendorid}
            />

        </div>
    )
}

export default AddPurchaseOrder
