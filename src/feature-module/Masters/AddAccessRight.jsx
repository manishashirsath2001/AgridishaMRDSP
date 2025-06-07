import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { all_routes } from "../../Router/all_routes";
import Addunits from "../../core/modals/inventory/addunits";
import AddCategory from "../../core/modals/inventory/addcategory";
import AddBrand from "../../core/modals/addbrand";
import { ACSPLGUID, baseUrl } from "../../core/json/custom";
import axios from 'axios';
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import {
    ArrowLeft,
    ChevronDown,
    ChevronUp,
    Info,
} from "feather-icons-react/build/IconComponents";
import { useDispatch, useSelector } from "react-redux";
import { setToogleHeader } from "../../core/redux/action";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

const AddAccessRight = () => {
    const navigate = useNavigate();
    const route = all_routes;
    const dispatch = useDispatch();
    const GUID = ACSPLGUID.getNew()
    const location = useLocation();
    const { AccessRightsAutoID1 } = location.state || {};

    const data = useSelector((state) => state.toggle_header);

    const renderCollapseTooltip = (props) => (
        <Tooltip id="refresh-tooltip" {...props}>
            Collapse
        </Tooltip>
    );

    useEffect(() => {
        const handleShortcut = (e) => {
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                handleSubmit(e)
            }
            if (e.ctrlKey && e.key === 'e') {
                e.preventDefault();
                showExitAlert();
            }
        };

        window.addEventListener('keydown', handleShortcut);

        return () => {
            window.removeEventListener('keydown', handleShortcut);
        };
    }, [navigate]);

    const [formData, setFormData] = useState({
        accessRightsAutoID1: "",
        accessRightID: "",
        accessRightTitle: "",
        accessRightDescription: "",
        applicationGroup: "",
        accessRightGroup: "",
        isAdminRight: false,

    });

    useEffect(() => {
        if (AccessRightsAutoID1) {
            const fetchData = async () => {
                try {
                    const payload = {
                        "pkid": AccessRightsAutoID1
                        , "keyword": "%"
                    }
                    const headers = {
                        "Content-Type": "application/json",
                        Accept: "*/*",
                    };

                    axios({
                        method: "POST",
                        url: baseUrl.Url + "/backend/api/GET_AccessRights_/getByID",
                        data: JSON.stringify(payload),
                        headers: headers,
                    })
                        .then((response) => {
                            if (response.status != 200) throw new Error("Failed to Fetching Data");
                            const DATA = response.data[0];
                            setFormData({
                                accessRightsAutoID1: DATA.accessRightsAutoID1,
                                accessRightID: DATA.accessRightID,
                                accessRightTitle: DATA.accessRightTitle,
                                accessRightDescription: DATA.accessRightDescription,
                                applicationGroup: DATA.applicationGroup,
                                accessRightGroup: DATA.accessRightGroup,
                                isAdminRight: DATA.isAdminRight,

                            });
                        })

                } catch (error) {
                    console.error("Error fetching Access Right Data:", error);
                }

            };
            fetchData();
        }
    }, [AccessRightsAutoID1]);
    const handleInputChange = (field, value) => {
        setFormData((prevState) => ({
            ...prevState,
            [field]: value,
        }));
    };
    const handleSubmit = (event) => {
        event.preventDefault();
        showConfirmationAlert(event);
    };

    const handleFormSubmission = async () => {
        try {
            const payload = {
                "accessRightsAutoID1": AccessRightsAutoID1 ? AccessRightsAutoID1 : GUID,
                "accessRightID": formData.accessRightID,
                "accessRightTitle": formData.accessRightTitle,
                "accessRightDescription": formData.accessRightDescription,
                "applicationGroup": formData.applicationGroup,
                "accessRightGroup": formData.accessRightGroup,
                "isAdminRight": formData.isAdminRight ? 1 : 0, // Convert boolean to 1 or 0 for database
            };


            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            axios({
                method: "POST",
                url: baseUrl.Url + "/backend/api/AccessRights",
                data: JSON.stringify(payload),
                headers: headers,
            })
            Swal.fire({
                icon: "success",
                title: "जतन केले!",
                text: "डेटा यशस्वीरित्या जतन झाला आहे.",
                confirmButtonText: "ठीक आहे",
                allowOutsideClick: false,
                allowEscapeKey: false
            });
            navigate(route.AccessRight);
        } catch (error) {
            console.error("Submission Error:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to save data. Please try again.",
            });
        }
    };
    const MySwal = withReactContent(Swal);

    const showConfirmationAlert = (event) => {
        MySwal.fire({
            title: "तुम्हाला खात्री आहे का?",
            text: "तुम्ही हे डेटा जतन करू इच्छिता का?",
            showCancelButton: true,
            confirmButtonColor: "#00ff00",
            confirmButtonText: "जतन करा",
            cancelButtonColor: "#092C4C",
            cancelButtonText: "रद्द करा",
            allowOutsideClick: false,
            allowEscapeKey: false
        }).then((result) => {
            if (result.isConfirmed) {
                handleFormSubmission(event);
            }
        });
    };
    const showExitAlert = () => {
        MySwal.fire({
            title: "तुम्हाला खात्री आहे का?",
            text: "तुम्ही बाहेर पडू इच्छिता का?",
            showCancelButton: true,
            confirmButtonColor: "#00ff00",
            confirmButtonText: "होय",
            cancelButtonColor: "#092C4C",
            cancelButtonText: "नाही",
            allowOutsideClick: false,
            allowEscapeKey: false
        }).then((result) => {
            if (result.isConfirmed) {
                navigate(route.AccessRight)
            }
        });
    };
    return (
        <div className="page-wrapper">
            <div className="content">
                <div className="page-header">
                    <div className="add-item d-flex">
                        <div className="page-title">
                            <h4>नवीन प्रवेश अधिकार</h4>
                            <h6>नवीन प्रवेश अधिकार तयार करा</h6>
                        </div>
                    </div>
                    <ul className="table-top-head">
                        <li>
                            <div className="page-btn">
                                <Link to={route.AccessRight} className="btn btn-secondary">
                                    <ArrowLeft className="me-2" />
                                    प्रवेश अधिकारांकडे परत जा
                                </Link>
                            </div>
                        </li>
                        <li>
                            <OverlayTrigger placement="top" overlay={renderCollapseTooltip}>
                                <Link
                                    data-bs-toggle="tooltip"
                                    data-bs-placement="top"
                                    title="Collapse"
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
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="card mbgcolor">
                        <div className="card-body add-product pb-0">
                            <div className="accordion-card-one accordion" id="accordionExample">
                                <div className="accordion-item mbgcolor">
                                    <div className="accordion-header" id="headingOne">
                                        <div
                                            className=""
                                            data-bs-toggle="collapse"
                                            data-bs-target="#collapseOne"
                                            aria-controls="collapseOne"
                                        >
                                            <div className="addproduct-icon">
                                                <h5>
                                                    <Info className="add-info" />
                                                    <span>
                                                        प्रवेश माहिती: वापरकर्ता प्रवेश अधिकार आणि परवानग्या प्रभावीपणे व्यवस्थापित करा.
                                                    </span>
                                                </h5>
                                                <Link to="#">
                                                    <ChevronDown className="chevron-down-add" />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        id="collapseOne"
                                        className="accordion-collapse collapse show"
                                        aria-labelledby="headingOne"
                                        data-bs-parent="#accordionExample"
                                    >
                                        <div className="accordion-body">
                                            <div className="row">
                                                <div className="col-lg-6 col-sm-6 col-12">
                                                    <div className="mb-3 add-User">
                                                        <label className="form-label">प्रवेश अधिकार आयडी</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            value={formData.accessRightID}
                                                            onChange={(e) =>
                                                                handleInputChange("accessRightID", e.target.value)
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-6 col-sm-6 col-12">
                                                    <div className="mb-3 add-User">
                                                        <label className="form-label">प्रवेश अधिकार शीर्षक</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            value={formData.accessRightTitle}
                                                            onChange={(e) =>
                                                                handleInputChange("accessRightTitle", e.target.value)
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-lg-12">
                                                <div>
                                                    <label className="form-label">वर्णन</label>
                                                    <textarea
                                                        className="form-control h-100"
                                                        rows={5}
                                                        value={formData.accessRightDescription}
                                                        onChange={(e) =>
                                                            handleInputChange("accessRightDescription", e.target.value)
                                                        }
                                                    />
                                                    <p className="mt-1">कमाल 60 अक्षरे</p>
                                                </div>
                                            </div>

                                            <div className="row">
                                                <div className="col-lg-3 col-sm-6 col-12">
                                                    <div className="mb-3 add-User">
                                                        <label className="form-label">अ‍ॅप्लिकेशन ग्रुप</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            value={formData.applicationGroup}
                                                            onChange={(e) =>
                                                                handleInputChange("applicationGroup", e.target.value)
                                                            }
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-lg-3 col-sm-6 col-12">
                                                    <div className="mb-3 add-User">
                                                        <label className="form-label">प्रवेश अधिकार ग्रुप</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            value={formData.accessRightGroup}
                                                            onChange={(e) =>
                                                                handleInputChange("accessRightGroup", e.target.value)
                                                            }
                                                        />
                                                    </div>
                                                </div>

                                                <div className="mt-4 col-lg-3 col-sm-6 col-12">
                                                    <div className=" add-User d-flex align-items-center">
                                                        <input
                                                            type="checkbox"
                                                            id="isAdminRight"
                                                            className="form-check-input me-2"
                                                            checked={formData.isAdminRight}
                                                            onChange={(e) =>
                                                                handleInputChange("isAdminRight", e.target.checked)
                                                            }
                                                        />
                                                        <label
                                                            className="form-label mb-0"
                                                            htmlFor="isAdminRight"
                                                        >
                                                            अ‍ॅडमिन अधिकार आहे का
                                                        </label>
                                                    </div>
                                                </div>
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
                                        बाहेर पडा
                                    </button>
                                    <button type="submit" className="btn btn-submit">
                                        जतन करा
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>

                <Addunits />
                <AddCategory />
                <AddBrand />
            </div>
        </div>

    );
};

export default AddAccessRight;
