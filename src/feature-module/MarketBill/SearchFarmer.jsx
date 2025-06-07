import React, { useState, useEffect } from "react";
import axios from "axios";
import { getUserData } from "../../Context/UserData";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import { baseUrl } from "../../core/json/custom";
import AddFarmerBill from "./AddFarmerBill";
import { ArrowLeft, Eye } from "feather-icons-react/build/IconComponents";
// import BillPopup from "./BillPopup";

function SearchFarmer() {

    const [searchQuery, setSearchQuery] = useState("");

    const [auctionshed, setauctionshed] = useState([]);


    const MySwal = withReactContent(Swal);
    const navigate = useNavigate(); // Declare the navigate hook here

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
                // Close the modal by removing the 'show' class and setting display to 'none'
                const modal = document.getElementById("searchbill"); // Get the modal element by ID
                if (modal) {
                    modal.classList.remove("show");  // Remove the 'show' class that makes it visible
                    modal.style.display = "none";  // Ensure it's hidden
                    modal.setAttribute("aria-hidden", "true");  // Update the aria-hidden attribute for accessibility
                }

                // Remove the backdrop (if any) that appears behind the modal
                const backdrop = document.querySelector(".modal-backdrop");
                if (backdrop) {
                    backdrop.remove();  // Remove the backdrop
                }

                // Navigate to the "Bills" page after confirmation
                navigate('/AddFarmerBill');  // Navigate to the Bills page



                setSearchQuery('');
            } else {
                // If the user clicks "Cancel", nothing happens and the modal remains open
            }
        });
    };


    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
        try {
            const payload = {
                // "apkid": "%",
                // "keyword": event.target.value,
                // "companyid": "",
                // "deptid": "",

                "companyid": "",
                "deptid": "",
                "keyword": event.target.value,
            }
            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            axios({
                method: "POST",
                url: baseUrl.Url + "/backend/api/GET_AuctionDataSearch/_Search",
                data: JSON.stringify(payload),
                headers: headers,
            })

                .then((response) => {
                    if (response.status != 200) throw new Error("Failed to send otp");
                    console.log("response", response.data);
                    setauctionshed(response.data);
                })
        } catch (error) {
            console.error("Error while searching Service data:", error);
        }
    };


    const [selectedData, setSelectedData] = useState({ token: null }); // Store selected row data

    const handleProceed = (apkid) => {
        setSelectedData({ apkid: apkid });
        // const modal = new bootstrap.Modal(document.getElementById("AddSalesEnquiry"));
        // modal.show();
    };

    // console.log("+++++++++++++++++++++++++++++++++", selectedData)



    return (
        <div>
            {/* <div
                className="modal fade"
                id="shetakarisearchpatti"
                tabIndex={-1}
                aria-labelledby="exampleModalFullscreenLabel"
                aria-hidden="true"
            > */}
            <div
                className="modal fade"
                id="shetakarisearchpatti"
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
                                                            नवीन बिल तयार करा
                                                        </button>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="modal-body custom-modal-body">
                                            <form>
                                                <div className="row justify-content-center mb-3">
                                                    <div className="col-12 col-sm-10 col-md-8 col-lg-8 ">
                                                        {/* <label className="formlabel" >टोकन नंबर / शेतकरी नाव / मोबाइल नंबर / आधार नंबर</label> */}
                                                        <div className="search-input d-flex align-items-center">
                                                            <input
                                                                type="text"
                                                                className="form-control w-100"
                                                                placeholder="टोकन नंबर / शेतकरी नाव / मोबाइल नंबर / आधार नंबर"
                                                                value={searchQuery}
                                                                onChange={handleSearch}
                                                            />
                                                            <button
                                                                type="button"
                                                                className="btn btn-primary ms-3 mt-1 mt-sm-0"
                                                                onClick={() => handleSearch(searchQuery)}
                                                            >
                                                                Search
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="col-lg-12">
                                                    <div className="modal-body-table">
                                                        <div className="table-responsive">
                                                            <table className="table datanew">
                                                                <thead>
                                                                    <tr>
                                                                        <th>टोकन नंबर</th>
                                                                        <th>तारीख</th>
                                                                        <th>शेतकरी नाव</th>
                                                                        <th>मोबाइल नंबर</th>
                                                                        <th>आधार नंबर</th>
                                                                        <th>MAID</th>
                                                                        <th>कृती</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {auctionshed.length > 0 ? (
                                                                        auctionshed.map((data, index) => (
                                                                            <tr key={index}>
                                                                                <td>{data.token}</td>
                                                                                <td>{data.date}</td>
                                                                                <td>{data.fname}</td>
                                                                                <td>{data.faddharno}</td>
                                                                                <td>{data.fcontactno}</td>
                                                                                <td>{data.maid}</td>


                                                                                <td>


                                                                                    Proceed Button
                                                                                    <Link className="me-2 p-2"
                                                                                        to="#"
                                                                                        data-bs-toggle="modal"
                                                                                        onClick={() => handleProceed(data.apkid)} // Pass data when clicked
                                                                                        data-bs-target="#AddSalesEnquiry"
                                                                                        style={{ color: 'green' }}>
                                                                                        <i data-feather="arrow-right-circle" className="feather-arrow-right-circle"></i>
                                                                                    </Link>

                                                                                </td>


                                                                            </tr>
                                                                        ))
                                                                    ) : (
                                                                        <tr>
                                                                            <td colSpan="9">कोणताही रेकॉर्ड मिळाला नाही</td>
                                                                        </tr>
                                                                    )}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </div>


                                                <div className="col-lg-12">
                                                    <div className="modal-footer-btn">
                                                        <button
                                                            type="button"
                                                            className="btn btn-cancel me-2"
                                                            // data-bs-dismiss="modal"
                                                            onClick={showExitAlert}
                                                        >
                                                            मागे
                                                        </button>

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
                {/* <div className="modal-dialog modal-fullscreen">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title" id="exampleModalFullscreenLabel">
                                नवीन बिल तयार करा
                            </h4>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            />
                        </div>
                        <div className="modal-body custom-modal-body">
                            <form>

                                <div className="row">

                                    {/* <div className="search-container mb-3">
                                        <div className="row">
                                            <div className="col-lg-6 col-12 ms-auto">
                                                <div className="input-group">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Search"
                                                    // value={searchQuery}
                                                    // onChange={handleSearch}
                                                    />
                                                    <span className="input-group-text">
                                                        <i className="fa fa-search"></i>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div> 

                                    <div className="col-lg-4 col-sm-6 col-12">
                                        <div className="mb-0">
                                            <label className="form-label required">टोकन नंबर / शेतकरी नाव / मोबाइल नंबर / आधार नंबर  </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Search"
                                                value={searchQuery}
                                                onChange={handleSearch}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-lg-1  col-sm-6 col-12 d-flex align-items-center mt-4">
                                        <button type="button" className="btn btn-submit" onClick={handleSearch}>
                                            Search
                                        </button>


                                    </div>




                                </div>


                                <div className="col-lg-12">
                                    <div className="modal-body-table">
                                        <div className="table-responsive">
                                            <table className="table datanew">
                                                <thead>
                                                    <tr>
                                                        <th>टोकन नंबर</th>
                                                        <th>तारीख</th>
                                                        <th>शेतकरी नाव</th>
                                                        <th>मोबाइल नंबर</th>
                                                        <th>आधार नंबर</th>
                                                        <th>MAID</th>
                                                        <th>कृती</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {auctionshed.length > 0 ? (
                                                        auctionshed.map((data, index) => (
                                                            <tr key={index}>
                                                                <td>{data.token}</td>
                                                                <td>{data.date}</td>
                                                                <td>{data.fname}</td>
                                                                <td>{data.faddharno}</td>
                                                                <td>{data.fcontactno}</td>
                                                                <td>{data.maid}</td>


                                                                <td>


                                                                    Proceed Button
                                                                    <Link className="me-2 p-2"
                                                                        to="#"
                                                                        data-bs-toggle="modal"
                                                                        onClick={() => handleProceed(data.apkid)} // Pass data when clicked
                                                                        data-bs-target="#AddSalesEnquiry"
                                                                        style={{ color: 'green' }}>
                                                                        <i data-feather="arrow-right-circle" className="feather-arrow-right-circle"></i>
                                                                    </Link>

                                                                </td>


                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan="9">कोणताही रेकॉर्ड मिळाला नाही</td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-lg-12">
                                    <div className="modal-footer-btn">
                                        <button
                                            type="button"
                                            className="btn btn-cancel me-2"
                                            onClick={showExitAlert} // Exit button click
                                        >
                                            Exit
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-save me-2"
                                            onClick={showExitAlert} // Exit button click
                                        >
                                            Save
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div> */}
            </div>
            <AddFarmerBill
                APKID={selectedData.apkid}
            />
        </div>
    );
}

export default SearchFarmer;

