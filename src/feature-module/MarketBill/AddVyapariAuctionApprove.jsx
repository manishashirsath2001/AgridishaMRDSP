import React, { useEffect, useRef, useState } from "react";
// import { baseUrl, ACSPLGUID } from "../../core/json/custom";
import { baseUrl } from "../../core/json/custom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Link } from "react-router-dom";
import {
    ArrowLeft, Trash2, Edit,
} from "feather-icons-react/build/IconComponents";
import Select from "react-select";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getUserData } from '../../Context/UserData';
// import { Select } from "antd";
import { all_routes } from "../../Router/all_routes";
import { formatDate } from "../../core/json/custom";
const AddVyapariAuctionApprove = ({ BAID, show, onRefresh }) => {
    const route = all_routes;
    console.log('baibdaidbaibdaidbaid', BAID)
    const navigate = useNavigate();
    const { userdetail } = getUserData();
    const MySwal = withReactContent(Swal);
    const statusref = useRef(null);
    const [tableData, setTableData] = useState([]);
    const [formData, setFormData] = useState({
        baid: "",
        maid: "",
        fname: "",
        btokanno: "",
        date: formatDate(userdetail.APPDT),
        weight: "",
        weightminmax: "",
        rate: "",
        vname: "",
        Status: "1"
    });


    const handleButton = async (baid) => {
        if (!formData.Status) {
            Swal.fire({
                icon: "error",
                title: "मान्यता त्रुटी",
                text: "कृपया व्यापाऱ्याचे नाव निवडा.",
                allowOutsideClick: false,
                allowEscapeKey: false
            }).then(() => {
                statusref.current?.focus();
            });

            return;
        }
        showConfirmationAlert(baid);
    }

    const showConfirmationAlert = (baid) => {
        MySwal.fire({
            title: "तुम्हाला खात्री आहे का?",
            text: "तुम्ही हे डेटा जतन करू इच्छिता का?",
            showCancelButton: true,
            confirmButtonColor: "#00ff00",
            confirmButtonText: "SAVE",
            cancelButtonColor: "#092C4C",
            cancelButtonText: "CANCEL",
            allowOutsideClick: false,
            allowEscapeKey: false
        }).then((result) => {
            if (result.isConfirmed) {
                handleButtonClick(baid);
            }
        });
    };
    // useEffect(() => {

    //     if (statusref.current) {
    //         statusref.current.focus();
    //     }

    // }, []);
    useEffect(() => {
        if (show) {
            setTimeout(() => {
                statusref.current?.focus();
            }, 300); // wait 300ms for modal animation
        }
    }, [show]);


    // const handleSave = async () => {
    //   try {
    //     const payload = {
    //       vaid: baid || GUID,
    //       farmername: formData.maid,
    //       tokennumber: formData.btokanno,
    //       isapporved: true,
    //       jaali: formData.date,
    //       rate: formData.rate,
    //       weight: formData.weight,
    //       weightless: formData.weightminmax,
    //       reasons: "",
    //       companyid: "",
    //       deptid: ""
    //     };

    //     const headers = {
    //       "Content-Type": "application/json",
    //       Accept: "*/*"
    //     };

    //     const response = await axios.post(
    //       `${baseUrl.Url}/backend/api/SP_AddUpdVyapariApproval`,
    //       JSON.stringify(payload),
    //       { headers }
    //     );

    //     Swal.fire({
    //       icon: "success",
    //       title: "जतन झाले!",
    //       text: "डेटा यशस्वीरित्या जतन केला.",
    //       confirmButtonText: "ठीक आहे"
    //     }).then(() => {
    //       navigate("/VApproveMaster");
    //       window.location.reload();
    //     });

    //     console.log("Save API Response:", response.data);
    //   } catch (error) {
    //     console.error("Save Error:", error);
    //     Swal.fire({
    //       icon: "error",
    //       title: "ओह... काहीतरी चुकीचे झाले",
    //       text: "डेटा जतन करताना काहीतरी चुकले.",
    //       confirmButtonText: "ठीक आहे"
    //     });
    //   }
    // };

    const handleButtonClick = async (baid) => {
        console.log(formData.Status)

        try {
            const payload = {
                baid: BAID,
                isvyapariverified: formData.Status,
                companyid: userdetail?.companyID ? userdetail.companyID : "",
                deptid: userdetail?.departmentID ? userdetail.departmentID : "",
            };

            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*"
            };

            const response = await axios.post(
                `${baseUrl.Url}/backend/api/SP_AddUpdVyapariApprove`,
                JSON.stringify(payload),
                { headers }
            );

            Swal.fire({
                icon: "success",
                title: "मान्यता दिली!",
                text: "शेतकरी यशस्वीरित्या मान्य झाला.",
                confirmButtonText: "ठीक आहे",
                allowOutsideClick: false,
                allowEscapeKey: false
            }).then(() => {
                const modal = document.getElementById("Approve");
                if (modal) {
                    modal.classList.remove("show");
                    modal.style.display = "none";
                    modal.setAttribute("aria-hidden", "true");

                    const backdrops = document.querySelectorAll(".modal-backdrop");
                    backdrops.forEach((backdrop) => {
                        backdrop.parentNode.removeChild(backdrop);
                    });

                    document.body.classList.remove("modal-open");
                    document.body.style.overflow = "auto";
                    document.body.style.paddingRight = "";
                }
                if (onRefresh) {
                    onRefresh();
                }
                setFormData({
                    vname: "",
                    baid: "",
                    maid: "",
                    fname: "",
                    btokanno: "",
                    date: "",
                    weight: "",
                    weightminmax: "",
                    rate: "",
                    Status: "1"
                });
                navigate(route.VyapariAuctionApprove);

            });

            console.log("Approve API Response:", response.data);
        } catch (error) {
            console.error("Approval Error:", error);
            Swal.fire({
                icon: "error",
                title: "ओह... काहीतरी चुकीचे झाले",
                text: "मान्यता देताना त्रुटी आली.",
                confirmButtonText: "ठीक आहे",
                allowOutsideClick: false,
                allowEscapeKey: false
            });
        }
    };

    const [ServiceType, setServiceType] = useState([]);


    useEffect(() => {
        const fetchServiceTypes = async () => {
            try {
                const response = await axios.get(
                    baseUrl.Url + "/backend/api/Implications/VATYPE",
                );
                if (response.status !== 200) throw new Error("Failed to fetch implications data");
                const data = response.data;
                const implicationsDropdown = data.map(({ iTitle, iValue }) => ({
                    label: iTitle,
                    value: iValue,
                }));
                setServiceType(implicationsDropdown);
            } catch (error) {
                console.error("Error fetching implications:", error);
            }
        };
        fetchServiceTypes();
    }, []);


    useEffect(() => {
        if (BAID != '' && BAID != null) {
            const fetchData = async () => {
                try {
                    const payload = {
                        baid: BAID,
                        keyword: "%",
                        companyid: userdetail?.companyID ? userdetail.companyID : "",
                        deptid: userdetail?.departmentID ? userdetail.departmentID : "",
                    };

                    const headers = {
                        "Content-Type": "application/json",
                        Accept: "*/*"
                    };

                    const response = await axios.post(
                        `${baseUrl.Url}/backend/api/GET_VyapariApprove`,
                        payload,
                        { headers }
                    );

                    if (response.status === 200 && response.data.length > 0) {
                        setTableData(response.data)

                    }
                } catch (error) {
                    console.error("Error fetching data:", error);
                }
            };

            fetchData();
        }
    }, [BAID]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };


    const closeModal = () => {
        const modal = document.getElementById("Approve");
        if (modal) {
            modal.classList.remove("show");
            modal.style.display = "none";
            modal.setAttribute("aria-hidden", "true");

            const backdrops = document.querySelectorAll(".modal-backdrop");
            backdrops.forEach((backdrop) => {
                backdrop.parentNode.removeChild(backdrop);
            });

            document.body.classList.remove("modal-open");
            document.body.style.overflow = "auto";
            document.body.style.paddingRight = "";
        }
        if (onRefresh) {
            onRefresh(); // refreshReceiptData from Bills.jsx
        }
    };

    window.addEventListener("popstate", () => {
        const modal = document.getElementById("Approve");
        if (modal && modal.classList.contains("show")) {
            closeModal();
        }
    });

    const onproccedclick = (bdaid) => {
        const matchedRow = tableData.find(item => item.bdaid == bdaid);
        if (!matchedRow) {
            console.warn('No matching record found for BAID:', bdaid);
            return;
        }
        const statusValue = matchedRow.isvyapariverified ? 1 : 0;
        console.log('StatusStatusStatus', statusValue);
        setFormData({
            vname: matchedRow.vname,
            baid: matchedRow.baid,
            maid: matchedRow.maid,
            fname: matchedRow.fname,
            btokanno: matchedRow.btokanno,
            date: matchedRow.date,
            weight: matchedRow.weight,
            weightminmax: matchedRow.weightminmax,
            rate: matchedRow.rate,
            Status: statusValue
        });
    };

    const onclosemodel = () => {
        const modal = document.getElementById("Approve");
        if (modal) {
            modal.classList.remove("show");
            modal.style.display = "none";
            modal.setAttribute("aria-hidden", "true");

            const backdrops = document.querySelectorAll(".modal-backdrop");
            backdrops.forEach((backdrop) => {
                backdrop.parentNode.removeChild(backdrop);
            });

            document.body.classList.remove("modal-open");
            document.body.style.overflow = "auto";
            document.body.style.paddingRight = "";
        }
        if (onRefresh) {
            onRefresh();
        }
        setFormData({
            vname: "",
            baid: "",
            maid: "",
            fname: "",
            btokanno: "",
            date: "",
            weight: "",
            weightminmax: "",
            rate: "",
            Status: "1"
        });
    }
    return (
        <div>
            <div className="modal fade" id="Approve" data-bs-backdrop="static"
                data-bs-keyboard="false">
                <div className="modal-dialog modal-dialog-centered modal-fullscreen-sm-down">
                    <div className="modal-content">
                        <div className="page-wrapper-new p-0">
                            <div className="content">
                                <div className="modal-header border-0 custom-modal-header">
                                    <div className="page-title">
                                        <h4>शेतकरी माहिती</h4>
                                    </div>
                                    <button
                                        type="button"
                                        className="close"
                                        aria-label="Close"
                                        onClick={onclosemodel}
                                    >
                                        <span aria-hidden="true">×</span>
                                    </button>
                                </div>
                                <div className="modal-body custom-modal-body">
                                    <div className="modal-body-table responsive-no-scroll">
                                        <div className="table-responsive">
                                            <table className="table table-bordered table-striped mb-0">
                                                <thead className="thead-dark bg-dark text-white">
                                                    <tr>
                                                        <th>बिल.नं.</th>
                                                        <th>तारीख</th>
                                                        <th>वजन</th>
                                                        <th>वजन -/+</th>
                                                        <th>भाव</th>
                                                        <th>कृती</th>
                                                    </tr>
                                                </thead>

                                                <tbody>
                                                    {tableData.length > 0 ? (
                                                        tableData.map((row, index) => (
                                                            <tr key={row.bdaid}>
                                                                <td>{row.billno}</td>
                                                                <td>{row.date}</td>
                                                                <td>{row.weight}</td>
                                                                <td>{row.weightminmax}</td>
                                                                <td>{row.rate}</td>
                                                                <td>
                                                                    <Link
                                                                        to="#"
                                                                        onClick={() => { onproccedclick(row.bdaid) }}
                                                                        className="me-2 p-1"
                                                                        style={{ color: 'lightblue' }}
                                                                    >
                                                                        <Edit className="feather-edit" />
                                                                    </Link>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan="4" className="text-center">
                                                                No Data Available
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    <form onSubmit={(e) => {
                                        e.preventDefault();
                                        showConfirmationAlert();
                                    }}>
                                        <div className="row">

                                            <div className="col-12 mb-3">
                                                <label className="form-label">व्यापारी नाव:</label>
                                                <input
                                                    type="text"
                                                    name="vname"
                                                    className="form-control"
                                                    value={formData.vname}
                                                    onChange={handleChange}
                                                    readOnly
                                                />
                                            </div>

                                            {/* Date */}
                                            <div className="col-6 col-md-6 col-lg-4 mb-3">
                                                <label className="form-label">तारीख:</label>
                                                <input
                                                    type="text"
                                                    name="date"
                                                    className="form-control"
                                                    value={formData.date}
                                                    onChange={handleChange}
                                                    readOnly
                                                />
                                            </div>

                                            {/* Token Number */}
                                            <div className="col-6 col-md-6 col-lg-4 mb-3">
                                                <label className="form-label">टोकन नंबर:</label>
                                                <input
                                                    type="text"
                                                    name="btokanno"
                                                    className="form-control"
                                                    value={formData.btokanno}
                                                    onChange={handleChange}
                                                    readOnly
                                                />
                                            </div>

                                            {/* Farmer Name */}
                                            <div className="col-12 mb-3">
                                                <label className="form-label">शेतकरी नाव:</label>
                                                <input
                                                    type="text"
                                                    name="fname"
                                                    className="form-control"
                                                    value={formData.fname}
                                                    onChange={handleChange}
                                                    readOnly
                                                />
                                            </div>

                                            {/* Weight */}
                                            <div className="col-6 col-md-6 col-lg-4 mb-3">
                                                <label className="form-label">वजन:</label>
                                                <input
                                                    type="text"
                                                    name="weight"
                                                    className="form-control"
                                                    value={formData.weight}
                                                    onChange={handleChange}
                                                    readOnly
                                                />
                                            </div>

                                            {/* Weight Min/Max */}
                                            <div className="col-6 col-md-6 col-lg-4 mb-3">
                                                <label className="form-label">वजन कमी/जास्त:</label>
                                                <input
                                                    type="text"
                                                    name="weightminmax"
                                                    className="form-control"
                                                    value={formData.weightminmax}
                                                    onChange={handleChange}
                                                    readOnly
                                                />
                                            </div>

                                            {/* Rate */}
                                            <div className="col-6 col-md-6 col-lg-4 mb-3">
                                                <label className="form-label">भाव:</label>
                                                <input
                                                    type="text"
                                                    name="rate"
                                                    className="form-control"
                                                    value={formData.rate}
                                                    onChange={handleChange}
                                                    readOnly
                                                />
                                            </div>

                                            <div className="col-md-12 col-lg-12 mb-3 ">
                                                <label className="form-label">स्थिती :</label>
                                                <Select
                                                    name="Status"
                                                    classNamePrefix="react-select"
                                                    options={ServiceType}
                                                    placeholder="Select"
                                                    ref={statusref}
                                                    autoFocus
                                                    openMenuOnFocus={true}
                                                    value={ServiceType.find((option) => option.value === formData.Status)}
                                                    onChange={(selectedOption) => {
                                                        setFormData(prevState => ({
                                                            ...prevState,
                                                            Status: selectedOption ? selectedOption.value : '',
                                                        }));
                                                    }}
                                                />


                                            </div>
                                        </div>

                                        <div className="col-12 mt-3">
                                            <div className="modal-footer-btn d-flex justify-content-end gap-3">
                                                <button
                                                    className="btn btn-primary w-100 w-sm-auto"
                                                    type="button"
                                                    onClick={() => handleButton(formData.baid)}
                                                >
                                                    मान्यता द्या
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

        </div >
    );
};

export default AddVyapariAuctionApprove;

