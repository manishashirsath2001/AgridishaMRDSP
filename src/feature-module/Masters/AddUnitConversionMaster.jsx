import React, { useEffect, useState, useRef } from 'react';
import Select from "react-select";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ChevronUp, ArrowLeft } from "feather-icons-react/build/IconComponents";
import { useDispatch, useSelector } from "react-redux";
import { setToogleHeader } from "../../core/redux/action";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { all_routes } from "../../Router/all_routes";
import { ACSPLGUID, baseUrl } from "../../core/json/custom";
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from "sweetalert2-react-content";
import { getUserData } from "../../Context/UserData";

function AddUnitConversionMaster() {
    const location = useLocation();
    const { UAID } = location.state || {};
    const route = all_routes; // Ensure this is declared
    const dispatch = useDispatch();
    const data = useSelector((state) => state.toggle_header);
    const navigate = useNavigate();
    const { isAuthenticated, userdetail } = getUserData();
    if (isAuthenticated == true) {
        console.log("user", userdetail);
        console.log("getUserData", getUserData);
    }

    const renderCollapseTooltip = (props) => (
        <Tooltip id="refresh-tooltip" {...props}>
            Collapse
        </Tooltip>
    );

    const GUID = ACSPLGUID.getNew(); // Generate GUID

    const [implications, setImplications] = useState({
        SOLID: [],
        LIQUID: [],
        GAS: [],
    });

    const [formData, setFormData] = useState({
        UAID: GUID,
        FROMUNITQUANTITY: "",
        FROMUNITUOM: "",
        TOUNITQUANTITY: "",
        TOUNITUOM: "",
    });


    const UAIDRef = useRef();
    const FROMUNITQUANTITYRef = useRef();
    const FROMUNITUOMRef = useRef();
    const TOUNITQUANTITYRef = useRef();
    const TOUNITUOMRef = useRef();
    const [activeTab, setActiveTab] = useState("solid");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    useEffect(() => {
        if (UAID) {
            const fetchData = async () => {
                try {
                    const payload = {
                        "pkid": UAID
                        , "keyword": "%"
                        , "companyid": userdetail?.companyID ? userdetail.companyID : "",
                        "deptid": userdetail?.departmentID ? userdetail.departmentID : ""
                    }
                    const headers = {
                        "Content-Type": "application/json",
                        Accept: "*/*",
                    };

                    axios({
                        method: "POST",
                        url: baseUrl.Url + "/backend/api/_GET_UnitConversionMasters_/getByID",
                        data: JSON.stringify(payload),
                        headers: headers,
                    })
                        .then((response) => {
                            if (response.status != 200) throw new Error("Failed to  Unit Conversion");
                            const DATA = response.data[0];
                            setFormData({
                                UAID: DATA.uaid,
                                FROMUNITQUANTITY: DATA.fromunitquantity,
                                FROMUNITUOM: DATA.fromunituom,
                                TOUNITQUANTITY: DATA.tounitquantity,
                                TOUNITUOM: DATA.tounituom
                            });
                        })

                } catch (error) {
                    console.error("Error fetching Unit Conversion data:", error);
                }

            };
            fetchData();
        }
    }, [UAID]);

    useEffect(() => {
        // Focus on the Warehouse ID input field
        if (UAIDRef.current) {
            UAIDRef.current.focus();
        }
    }, []); // Runs only on the initial render

    const handleUnitFromChange = (selectedOption) => {
        // setUnitFrom(selectedOption);
        setFormData((prevData) => ({
            ...prevData,
            FROMUNITUOM: selectedOption.value,
        }));
    };

    const HandleUnitToChange = (selectedOption) => {
        setFormData((prevData) => ({
            ...prevData,
            TOUNITUOM: selectedOption.value,
        }));
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        // setUnitFrom(null);
        // setUnitTo(null);

    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // setShowModal(true);
        showConfirmationAlert(event);
    };

    const validateinput = (e) => {

        const { FROMUNITQUANTITY } = formData;
        if (!FROMUNITQUANTITY || !/^\d+$/.test(FROMUNITQUANTITY)) {
            Swal.fire({
                icon: "error",
                title: "त्रुटी",
                text: "स्टोर कोडमध्ये फक्त संख्या असाव्यात",
                allowOutsideClick: false,
                allowEscapeKey: false,
            }).then(() => {
                FROMUNITQUANTITY.current.focus();
            });
            return;
        }
        const { TOUNITQUANTITY } = formData;
        if (!TOUNITQUANTITY || !/^\d+$/.test(TOUNITQUANTITY)) {
            Swal.fire({
                icon: "error",
                title: "त्रुटी",
                text: "स्टोर कोडमध्ये फक्त संख्या असाव्यात",
                allowOutsideClick: false,
                allowEscapeKey: false,
            }).then(() => {
                TOUNITQUANTITY.current.focus();
            });
            return;
        }

        handleSubmit(e);
    }




    const handleModalConfirm = async () => {

        try {
            const payload = {
                "uaid": UAID ? UAID : GUID,
                "formunitquantity": formData.FROMUNITQUANTITY,
                "fromunituom": formData.FROMUNITUOM,
                "toumitquantity": formData.TOUNITQUANTITY,
                "tounituom": formData.TOUNITUOM,
                "utype": activeTab,
                "companyid": userdetail?.companyID ? userdetail.companyID : "",
                "deptid": userdetail?.departmentID ? userdetail.departmentID : ""
            };

            console.log("unit conversion", payload);

            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            axios({
                method: "POST",
                url: baseUrl.Url + "/backend/api/UnitConversion",
                data: JSON.stringify(payload),
                headers: headers,
            })

            Swal.fire({
                icon: "success",
                title: "Saved!",
                text: "Data saved successfully.",
                confirmButtonText: "OK",
                allowOutsideClick: false,
                allowEscapeKey: false,
            });


            navigate(route.UnitConversionMaster);
        } catch (error) {
            console.error("Submission Error:", error);
            Swal.fire({
                icon: "error",
                title: "त्रुटी",
                text: "डेटा जतन करण्यात अयशस्वी. कृपया पुन्हा प्रयत्न करा.",
                allowOutsideClick: false,
                allowEscapeKey: false,
            });
        }

    };
    const MySwal = withReactContent(Swal);

    const showConfirmationAlert = (event) => {
        MySwal.fire({
            title: "आपल्याला खात्री आहे का?",
            text: "आपण हा डेटा जतन करू इच्छिता का?",
            showCancelButton: true,
            confirmButtonColor: "#00ff00",
            confirmButtonText: "जतन करा",
            cancelButtonColor: "#092C4C",
            cancelButtonText: "रद्द करा",
            allowOutsideClick: false,
            allowEscapeKey: false,
        }).then((result) => {
            if (result.isConfirmed) {
                handleModalConfirm(event); // Proceed with form submission
            }
        });
    };
    const showExitAlert = () => {
        MySwal.fire({
            title: "आपल्याला खात्री आहे का?",
            text: "आपण बाहेर पडू इच्छिता का?",
            showCancelButton: true,
            confirmButtonColor: "#00ff00",
            confirmButtonText: "होय",
            cancelButtonColor: "#092C4C",
            cancelButtonText: "नाही",
            allowOutsideClick: false,
            allowEscapeKey: false,
        }).then((result) => {
            if (result.isConfirmed) {
                showExitAlert();
            }
        });
    };
    useEffect(() => {
        const fetchImplications = async () => {
            try {
                const response = await axios.get(
                    baseUrl.Url + "/backend/api/Implications/SOLID|LIQUID|GAS"
                );

                if (response.status !== 200) throw new Error("Failed to fetch implications data");

                const data = response.data;

                const solid = data
                    .filter((item) => item.iGroup === "SOLID")
                    .map(({ iTitle, iValue }) => ({
                        label: iTitle,
                        value: iValue,
                    }));

                const liquid = data
                    .filter((item) => item.iGroup === "LIQUID")
                    .map(({ iTitle, iValue }) => ({
                        label: iTitle,
                        value: iValue,
                    }));

                const gas = data
                    .filter((item) => item.iGroup === "GAS")
                    .map(({ iTitle, iValue }) => ({
                        label: iTitle,
                        value: iValue,
                    }));

                setImplications({
                    SOLID: solid,
                    LIQUID: liquid,
                    GAS: gas,
                });
            } catch (error) {
                console.error("Error fetching implications:", error);
            }
        };

        fetchImplications();
    }, []);

    useEffect(() => {
        const handleShortcut = (e) => {

            if (e.ctrlKey && e.key === 'e') {
                e.preventDefault();
                navigate(route.UnitConversionMaster);
            }
            if (e.ctrlKey && e.key === 's' || e.ctrlKey && e.key === 'S') {
                e.preventDefault();
                validateinput(e);

            }
        };

        window.addEventListener('keydown', handleShortcut);

        return () => {
            window.removeEventListener('keydown', handleShortcut);
        };
    }, [navigate, formData]);

    return (
        <div>
            <div className="page-wrapper pagehead">
                <div className="content">
                    <div className="page-header">
                        <div className="add-item d-flex">
                            <div className="page-title">
                                <h4>युनिट रूपांतरण व्यवस्थापित करा</h4>
                                <h6>युनिट रूपांतरण करा</h6>
                            </div>
                        </div>
                        <ul className="table-top-head">
                            <li>
                                <OverlayTrigger placement="top" overlay={renderCollapseTooltip}>
                                    <Link
                                        data-bs-toggle="tooltip"
                                        data-bs-placement="top"
                                        title="संकुचित करा"
                                        id="collapse-header"
                                        className={data ? "active" : ""}
                                        onClick={() => {
                                            dispatch(setToogleHeader(!data));
                                        }}
                                    >
                                        <ChevronUp className="feather-chevron-up" />
                                    </Link>
                                </OverlayTrigger>
                            </li>
                        </ul>
                        <div className="page-btn">
                            <Link to={route.UnitConversionMaster} className="btn btn-secondary">
                                <ArrowLeft className="me-2" />
                                युनिटकडे परत जा
                            </Link>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-12 d-flex justify-content-center ">
                            <ul className="nav nav-pills">
                                <li className="nav-item">
                                    <button
                                        className={`nav-link ${activeTab === "solid" ? "active" : ""} btn btn-outline-primary rounded-pill px-4 py-2`}
                                        onClick={() => handleTabChange("solid")}
                                    >
                                        घन (Solid)
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button
                                        className={`nav-link ${activeTab === "liquid" ? "active" : ""} btn btn-outline-primary rounded-pill px-4 py-2`}
                                        onClick={() => handleTabChange("liquid")}
                                    >
                                        द्रव (Liquid)
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button
                                        className={`nav-link ${activeTab === "gas" ? "active" : ""} btn btn-outline-primary rounded-pill px-4 py-2`}
                                        onClick={() => handleTabChange("gas")}
                                    >
                                        वायू (Gas)
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="container py-2 min-vh-90 d-flex justify-content-center ">
                    <div className="col-12 col-sm-8 col-md-9 col-lg-10 col-xl-11">
                        <div className="card min-vh-90 w-100">
                            <div className="card-body mbgcolor">
                                {/* Main Container for Conversion Form */}
                                <form onSubmit={handleSubmit}>
                                    <div className="row g-1">
                                        <div className="col-md-6 d-flex justify-content-end">
                                            <div className="card w-100 dbgcolor">
                                                <div className="card-header">
                                                    <h5 className="card-title">मूल प्रमाण आणि युनिट्स</h5>
                                                </div>
                                                <div className="card-body p-3">
                                                    <div className="mb-3">
                                                        <label className="required form-label">प्रमाण (From):</label>
                                                        <input
                                                            type="text"
                                                            name="FROMUNITQUANTITY"
                                                            className="form-control"
                                                            value={formData.FROMUNITQUANTITY}
                                                            onChange={handleChange}
                                                            ref={FROMUNITQUANTITYRef}
                                                            required
                                                            pattern="^\d+$"
                                                            title="स्टोर कोडमध्ये फक्त अंक असावेत"
                                                            autoFocus
                                                        />
                                                    </div>

                                                    {/* Dynamic Tab Rendering */}
                                                    {activeTab === "solid" && (
                                                        <div className="mb-3">
                                                            <label className="required form-label">युनिट (घन):</label>
                                                            <Select
                                                                classNamePrefix="react-select"
                                                                options={implications.SOLID}
                                                                value={implications.SOLID.find(option => option.value === formData.FROMUNITUOM) || null}
                                                                onChange={handleUnitFromChange}
                                                                placeholder="घन युनिट निवडा"
                                                                isSearchable
                                                                ref={FROMUNITUOMRef}
                                                                openMenuOnFocus={true}
                                                            />
                                                        </div>
                                                    )}

                                                    {activeTab === "liquid" && (
                                                        <div className="mb-3">
                                                            <label className="required form-label">युनिट (द्रव):</label>
                                                            <Select
                                                                classNamePrefix="react-select"
                                                                options={implications.LIQUID}
                                                                value={implications.LIQUID.find(option => option.value === formData.FROMUNITUOM) || null}
                                                                onChange={handleUnitFromChange}
                                                                placeholder="द्रव युनिट निवडा"
                                                                isSearchable
                                                                openMenuOnFocus={true}
                                                            />
                                                        </div>
                                                    )}

                                                    {activeTab === "gas" && (
                                                        <div className="mb-3">
                                                            <label className="required form-label">युनिट (वायू):</label>
                                                            <Select
                                                                classNamePrefix="react-select"
                                                                options={implications.GAS}
                                                                value={implications.GAS.find(option => option.value === formData.FROMUNITUOM) || null}
                                                                onChange={handleUnitFromChange}
                                                                placeholder="वायू युनिट निवडा"
                                                                isSearchable
                                                                openMenuOnFocus={true}
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Conversion Column */}
                                        <div className="col-md-6">
                                            <div className="card w-100 dbgcolor">
                                                <div className="card-header">
                                                    <h5 className="card-title">रूपांतरित प्रमाण आणि युनिट्स</h5>
                                                </div>
                                                <div className="card-body p-3">
                                                    {/* Dynamic Tab Rendering */}
                                                    {activeTab === "solid" && (
                                                        <div className="mb-3">
                                                            <label className="required form-label">प्रमाण (To) (घन):</label>
                                                            <input
                                                                type="text"
                                                                name="TOUNITQUANTITY"
                                                                className="form-control"
                                                                value={formData.TOUNITQUANTITY}
                                                                onChange={handleChange}
                                                                ref={TOUNITQUANTITYRef}
                                                                required
                                                                pattern="^\d+$"
                                                                title="स्टोर कोडमध्ये फक्त अंक असावेत"
                                                            />
                                                        </div>
                                                    )}

                                                    {activeTab === "liquid" && (
                                                        <div className="mb-3">
                                                            <label className="required form-label">प्रमाण (To) (द्रव):</label>
                                                            <input
                                                                type="text"
                                                                name="TOUNITQUANTITY"
                                                                className="form-control"
                                                                value={formData.TOUNITQUANTITY}
                                                                onChange={handleChange}
                                                                required
                                                                pattern="^\d+$"
                                                                title="स्टोर कोडमध्ये फक्त अंक असावेत"
                                                            />
                                                        </div>
                                                    )}

                                                    {activeTab === "gas" && (
                                                        <div className="mb-3">
                                                            <label className="required form-label">प्रमाण (To) (वायू):</label>
                                                            <input
                                                                type="text"
                                                                name="TOUNITQUANTITY"
                                                                className="form-control"
                                                                value={formData.TOUNITQUANTITY}
                                                                onChange={handleChange}
                                                                required
                                                                pattern="^\d+$"
                                                                title="स्टोर कोडमध्ये फक्त अंक असावेत"
                                                            />
                                                        </div>
                                                    )}

                                                    <div className="mb-3">
                                                        <label className="required form-label">युनिट (To):</label>
                                                        <Select
                                                            classNamePrefix="react-select"
                                                            options={
                                                                activeTab.toUpperCase() === "SOLID"
                                                                    ? implications.SOLID
                                                                    : activeTab.toUpperCase() === "LIQUID"
                                                                        ? implications.LIQUID
                                                                        : implications.GAS
                                                            }
                                                            value={
                                                                (implications[activeTab.toUpperCase()]?.find(option => option.value === formData.TOUNITUOM))
                                                                || (() => {
                                                                    console.warn(`Value not found in ${activeTab} options for TOUNITUOM: ${formData.TOUNITUOM}`);
                                                                    return null;
                                                                })()
                                                            }
                                                            onChange={HandleUnitToChange}
                                                            ref={TOUNITUOMRef}
                                                            placeholder={`${activeTab} युनिट निवडा`}
                                                            isSearchable
                                                            openMenuOnFocus={true}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-12">
                                        <div className="btn-addproduct mb-4">
                                            <button
                                                type="button"
                                                onClick={showExitAlert}
                                                className="btn btn-cancel me-2"
                                            >
                                                मागे
                                            </button>

                                            <button type="submit" className="btn btn-submit">
                                                सेव्ह
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

    );
}

export default AddUnitConversionMaster;
