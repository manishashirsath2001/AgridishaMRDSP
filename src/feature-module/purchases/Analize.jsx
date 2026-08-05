import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import ReactApexChart from "react-apexcharts";
import { getUserData } from "../../Context/UserData";
import { baseUrl, ACSPLGUID } from "../../core/json/custom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

function Analize({ praid }) {
    const { userdetail } = getUserData();

    const [categories, setCategories] = useState([]);
    const [seriesData, setSeriesData] = useState([]);
    const [checkboxes, setCheckboxes] = useState([]);

    useEffect(() => {
        if (praid) {
            const fetchGrafData = async () => {
                try {
                    const payload = {
                        praid: praid,
                        companyid: userdetail?.companyID || "",
                        deptid: userdetail?.departmentID || "",
                    };
                    const headers = {
                        "Content-Type": "application/json",
                        Accept: "*/*",
                    };

                    const response = await axios.post(
                        `${baseUrl.Url}/backend/api/GET_AnalyzeData`,
                        JSON.stringify(payload),
                        { headers }
                    );

                    if (response.status !== 200) {
                        throw new Error("Failed to fetch data");
                    }

                    const data = response.data;
                    setCategories(data.map((item) => item.vendorname));
                    setSeriesData(data.map((item) => item.qmnamt));
                    setCheckboxes(
                        data.map((item) => ({
                            id: item.qamaid,
                            isApproved: item.isapproved,
                            aaid: ACSPLGUID.getNew(),
                            vaid: item.qvaid,
                            netamt: item.qmnamt,
                            vname: item.vendorname,
                        }))
                    );
                } catch (error) {
                    console.error("Error fetching analyze data:", error);
                }
            };

            fetchGrafData();
        }
    }, [praid, userdetail]);

    const handleCheckboxChange = (id, isChecked) => {
        setCheckboxes((prev) =>
            prev.map((checkbox) =>
                checkbox.id === id ? { ...checkbox, isApproved: isChecked } : checkbox
            )
        );
    };

    const MySwal = withReactContent(Swal);

    const showConfirmationAlert = () => {
        MySwal.fire({
            title: "Are you sure?",
            text: "Do you want to save this data?",
            showCancelButton: true,
            confirmButtonColor: "#00ff00",
            confirmButtonText: "SAVE",
            cancelButtonColor: "#092C4C",
            cancelButtonText: "CANCLE",
        }).then((result) => {
            if (result.isConfirmed) {
                handleSave();
            }
        });
    };

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
                const modal = document.getElementById("analize");
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
                setCategories([]);
                setSeriesData([]);
                setCheckboxes([]);

            }
        });
    };


    const handleSave = async () => {
        try {
            const payload = checkboxes.map((checkbox) => ({
                aaid: checkbox.aaid,
                qamaid: checkbox.id,
                vaid: checkbox.vaid,
                praid: praid,
                netamt: checkbox.netamt,
                isapproved: checkbox.isApproved ? true : false,
                companyid: userdetail?.companyID || "",
                deptid: userdetail?.departmentID || "",
            }));

            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            const response = await axios.post(
                `${baseUrl.Url}/backend/api/AddAnalysis`,
                // `http://adsvr:78/api/AddAnalys`,
                JSON.stringify(payload),
                { headers }
            );

            if (response.status === 200) {
                Swal.fire({
                    icon: "success",
                    title: "Saved!",
                    text: "Data saved successfully.",
                    confirmButtonText: "OK",
                });

                // alert("Data saved successfully!");
            } else {
                throw new Error("Failed to save data");
            }
        } catch (error) {
            console.error("Error saving analyze data:", error);
            alert("An error occurred while saving the data.");
        }
    };

    const sBar = {
        chart: {
            height: "100%",
            type: "bar",
            toolbar: {
                show: false,
            },
        },
        plotOptions: {
            bar: {
                horizontal: true,
                position: "end",
            },
        },
        dataLabels: {
            enabled: true,
            formatter: (val) => `${val}`,
            style: {
                fontSize: "12px",
                colors: ["#000"],
            },
            offsetX: 60,
            position: "end",
        },
        series: [
            {
                data: seriesData,
            },
        ],
        xaxis: {
            categories,
        },
    };

    return (
        <div className="modal fade" id="analize">
            <div className="modal-dialog modal-dialog-centered modal-fullscreen">
                <div className="modal-content mbgcolor">
                    <div className="page-wrapper-new p-0 mbgcolor">
                        <div className="content mbgcolor">
                            <div className="modal-header border-0 custom-modal-header">
                                <div className="page-title">
                                    <h4>Add Stock</h4>
                                </div>
                                <button
                                    type="button"
                                    className="close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                    // data-bs-dismiss="modal"
                                    data-bs-target="#addquatation"
                                    data-bs-toggle="modal"
                                    onClick={showExitAlert}
                                >
                                    <span aria-hidden="true">×</span>
                                </button>
                            </div>
                            <div className="modal-body custom-modal-body">
                                <div className="d-flex flex-column flex-md-row align-items-start">
                                    {/* Graph Section */}
                                    <div
                                        className="flex-grow-1 mb-3 mb-md-0 position-relative"
                                        style={{ flexBasis: "80%" }}
                                    >
                                        <ReactApexChart
                                            options={sBar}
                                            series={sBar.series}
                                            type="bar"
                                            height={450}
                                        />

                                        {/* Checkboxes Section */}
                                        <div
                                            className="position-absolute"
                                            style={{
                                                top: "7%",
                                                left: "94%",
                                                transform: "translateX(10px)",
                                                flexBasis: "20%",
                                            }}
                                        >
                                            <div className="d-flex flex-column">
                                                {checkboxes.map((checkbox) => (
                                                    <div
                                                        key={checkbox.id}
                                                        className="mb-3 d-flex align-items-center"
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            id={`approve_${checkbox.id}`}
                                                            name={`approve-${checkbox.id}`}
                                                            className="form-check-input me-2"
                                                            style={{ transform: "scale(1.1)" }}
                                                            checked={checkbox.isApproved}
                                                            onChange={(e) =>
                                                                handleCheckboxChange(
                                                                    checkbox.id,
                                                                    e.target.checked
                                                                )
                                                            }
                                                        />
                                                        <label
                                                            htmlFor={`approve_${checkbox.id}`}
                                                            style={{ marginBottom: "0" }}
                                                        >
                                                            Approve
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-lg-12">
                                    <div className="modal-footer-btn">
                                        <button
                                            type="button"
                                            className="btn btn-cancel me-3"
                                            // data-bs-dismiss="modal"
                                            onClick={showExitAlert}
                                        >
                                            Exit
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-submit me-3"
                                            onClick={showConfirmationAlert}
                                        >
                                            Save
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

Analize.propTypes = {
    praid: PropTypes.string.isRequired,
};

export default Analize;
