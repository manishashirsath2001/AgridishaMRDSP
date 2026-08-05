import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import { all_routes } from "../../Router/all_routes";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { setToogleHeader } from "../../core/redux/action";
import { baseUrl, ACSPLGUID } from "../../core/json/custom";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axios from "axios";
import { getUserData } from "../../Context/UserData";
import { FaEye } from "react-icons/fa";
import { ArrowLeft, ChevronUp } from "feather-icons-react/build/IconComponents";

const AddNotice = () => {
    const location = useLocation();
    const { nid } = location.state || {};
    // const generatedID = ACSPLGUID?.getNew();
    const GUID = ACSPLGUID.getNew()
    const navigate = useNavigate();
    const route = all_routes;
    const dispatch = useDispatch();
    const { userdetail } = getUserData();
    const data = useSelector((state) => state.toggle_header);
    const aDtitleRef = useRef(null);
    const aDimageRef = useRef(null);
    const isactiveRef = useRef(null);

    const MySwal = withReactContent(Swal);
    const [formData, setFormData] = useState({
        nid: "",
        Ntitle: "",
        NLimage: "",
        Description: "",
        isactive: "",
    });
    const [filePreviewUrl, setFilePreviewUrl] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [status, setStatus] = useState([]);

    const renderCollapseTooltip = (props) => (
        <Tooltip id="refresh-tooltip" {...props}>
            Collapse
        </Tooltip>
    );

    useEffect(() => {
        if (aDtitleRef.current) {
            aDtitleRef.current.focus();
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!generatedID) {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Failed to generate unique ID.",
                });
                return;
            }
            const sanitizedFileName = file.name
                .trim()
                .replace(/\s+/g, "_")
                .replace(/[^\w.-]/g, "");
            const finalFileName = `${generatedID}_${sanitizedFileName}`;
            setIsUploading(true);
            const fileUrl = URL.createObjectURL(file);
            setFilePreviewUrl(fileUrl);
            try {
                if (file.type === "application/pdf") {
                    await uploadPdf(file, finalFileName);
                } else {
                    await uploadProfile(file, finalFileName);
                }
                setFormData((prev) => ({ ...prev, NLimage: finalFileName }));
            } catch (error) {
                setFilePreviewUrl(null);
                setFormData((prev) => ({ ...prev, NLimage: "" }));
            } finally {
                setIsUploading(false);
            }
        }
    };

    const uploadProfile = async (fileData, finalFileName) => {
        const formData = new FormData();
        formData.append("Files", fileData);
        formData.append("FileNames", finalFileName);
        formData.append("FileDescription", "Profile Image");

        try {
            const response = await axios.post(
                `${baseUrl.Url}/api/ProfileUpload/Upload`,
                formData,
                {
                    headers: {
                        accept: "*/*",
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            Swal.fire({
                icon: "success",
                title: "Success",
                text: "फोटो यशस्वीरित्या अपलोड झाला!",
                timer: 1500,
            });
            return response.data;
        } catch (error) {
            console.error("Upload Error:", error.message);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "फोटो अपलोड होताना त्रुटी आली.",
            });
            throw error;
        }
    };

    const uploadPdf = async (fileData, finalFileName) => {
        const formData = new FormData();
        formData.append("Files", fileData);
        formData.append("FileNames", finalFileName);
        formData.append("FileDescription", "PDF Document");

        try {
            const response = await axios.post(
                `${baseUrl.Url}/api/PdfUpload/Upload`,
                formData,
                {
                    headers: {
                        accept: "*/*",
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            Swal.fire({
                icon: "success",
                title: "Success",
                text: "PDF यशस्वीरित्या अपलोड झाला!",
                timer: 1500,
            });
            return response.data;
        } catch (error) {
            console.error("PDF Upload Error:", error.message);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "PDF अपलोड होताना त्रुटी आली.",
            });
            throw error;
        } finally {
            setIsUploading(false); // Ensure uploading state is reset
        }
    };

    const handleFormSubmission = async () => {
        try {
            const payload = {
                nid: nid ? nid : GUID,
                noticetitle: formData.Ntitle,
                noticeimage: formData.NLimage,
                description: formData.Description,
                isactive: Boolean(formData.isactive),
                companyid: "COMP123",
            };
            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };
            const response = await axios.post(
                `${baseUrl.Url}/api/SP_UpdNotice`,
                payload,
                { headers }
            );
            if (response.status === 200) {
                Swal.fire({
                    icon: "success",
                    title: "Saved!",
                    text: "Data saved successfully.",
                    confirmButtonText: "OK",
                }).then((result) => {
                    if (result.isConfirmed) {
                        navigate(route.Notice);
                    }
                });
                setFormData({
                    nid: "",
                    Ntitle: "",
                    NLimage: "",
                    Description: "",
                    isactive: "",
                });
                setFilePreviewUrl(null);
            } else {
                throw new Error("Unexpected response status");
            }
        } catch (error) {
            console.error("Submission Error:", error.message);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to save data. Please try again.",
            });
        }
    };

    const checkFormValidity = (e) => {
        const { Ntitle, NLimage, isactive } = formData;
        if (!Ntitle) {
            Swal.fire({
                icon: "error",
                title: "Validation Error",
                text: "शीर्षक आवश्यक आहे",
            }).then(() => {
                aDtitleRef.current.focus();
            });
            return;
        }
        if (!NLimage) {
            Swal.fire({
                icon: "error",
                title: "Validation Error",
                text: "फाइल आवश्यक आहे",
            }).then(() => {
                aDimageRef.current.focus();
            });
            return;
        }
        if (!isactive) {
            Swal.fire({
                icon: "error",
                title: "Validation Error",
                text: "स्थिती आवश्यक आहे",
            }).then(() => {
                isactiveRef.current.focus();
            });
            return;
        }
        handleSubmit(e);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        MySwal.fire({
            title: "तुम्हाला खात्री आहे का?",
            text: "तुम्हाला डेटाला सेव्ह करायचं आहे का?",
            showCancelButton: true,
            confirmButtonColor: "#00ff00",
            confirmButtonText: "सेव्ह करा",
            cancelButtonColor: "#092C4C",
            cancelButtonText: "रद्द करा",
        }).then((result) => {
            if (result.isConfirmed) {
                handleFormSubmission();
            }
        });
    };

    const openModal = () => {
        if (filePreviewUrl) {
            setIsModalOpen(true);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const openModalWithImage = (fileName) => {
        const fileExtension = fileName.split('.').pop().toLowerCase();
        const fileUrl = fileExtension === 'pdf'
            ? `${baseUrl.Url}/Assets/${fileName}`
            : `${baseUrl.Url}/Images/${fileName}`;
        setFilePreviewUrl(fileUrl);
        setIsModalOpen(true);
    };

    useEffect(() => {
        if (!nid) return;
        const fetchMasterData = async () => {
            try {
                const payload = {
                    nid: nid,
                    keyword: "%",
                    companyid: "COMP123",

                };
                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };
                const response = await axios.post(
                    `${baseUrl.Url}/api/GET_Notice`,
                    payload,
                    { headers }
                );
                if (response.status !== 200 || !response.data || response.data.length === 0) {
                    throw new Error("Failed to fetch data");
                }
                const apiData = response.data[0];
                setFormData({
                    Nid: apiData.nid || "",
                    Ntitle: apiData.noticetitle || "",
                    NLimage: apiData.noticeimage || "",
                    Description: apiData.description || "",
                    isactive: String(apiData.isactive || ""), // Ensure string for dropdown
                });
                if (apiData.NLimage) {
                    const fileExtension = apiData.GLimage.split('.').pop().toLowerCase();
                    const fileUrl = fileExtension === 'pdf'
                        ? `${baseUrl.Url}/Assets/${apiData.NLimage}`
                        : `${baseUrl.Url}/Images/${apiData.NLimage}`;
                    setFilePreviewUrl(fileUrl);
                }
            } catch (error) {
                console.error("Error in Master API Call:", error.message);
                MySwal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Failed to fetch data for editing. Please try again.",
                });
            }
        };
        fetchMasterData();
    }, [nid, userdetail]);

    useEffect(() => {
        const fetchAdvertise = async () => {
            try {
                const payload = {
                    implicationGroup: "STATUS",
                };
                const response = await axios.post(
                    `${baseUrl.Url}/api/getImplications`,
                    payload,
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );
                if (response.status === 200 && response.data && Array.isArray(response.data)) {
                    const statusOptions = response.data.map(({ iTitle, iValue }) => ({
                        label: iTitle || "Unknown",
                        value: String(iValue), // Ensure string for consistency
                    }));
                    setStatus(statusOptions);
                    console.log("Fetched Status Options:", statusOptions); // Debugging
                } else {
                    throw new Error("Invalid API response");
                }
            } catch (err) {
                console.error("Error fetching status:", err.message);
                MySwal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Failed to fetch status options. Please try again.",
                });
            }
        };
        fetchAdvertise();
    }, []);

    const handleKeyDown = (e, nextInputRef) => {
        if (e.key === "Enter" || e.key === "Tab") {
            const isDropdownOpen =
                document.activeElement.getAttribute("aria-expanded") === "true";
            if (!isDropdownOpen) {
                e.preventDefault();
                if (nextInputRef && nextInputRef.current) {
                    nextInputRef.current.focus();
                }
            }
        }
    };

    const showExitAlert = () => {
        MySwal.fire({
            title: "तुम्हाला खात्री आहे का?",
            text: "तुम्हाला मागे जायचं आहे का?",
            showCancelButton: true,
            confirmButtonColor: "#00ff00",
            confirmButtonText: "हो",
            cancelButtonColor: "#092C4C",
            cancelButtonText: "नाही",
        }).then((result) => {
            if (result.isConfirmed) {
                navigate(route.Notice);
            }
        });
    };

    useEffect(() => {
        const handleShortcut = (e) => {
            if (e.ctrlKey && e.key === "e") {
                e.preventDefault();
                showExitAlert();
            }
            if (e.ctrlKey && (e.key === "s" || e.key === "S")) {
                e.preventDefault();
                checkFormValidity(e);
            }
        };
        window.addEventListener("keydown", handleShortcut);
        return () => {
            window.removeEventListener("keydown", handleShortcut);
        };
    }, [formData, navigate]);

    return (
        <div className="page-wrapper">
            <div className="content">
                <div className="page-header">
                    <div className="add-item d-flex">
                        <div className="page-title">
                            <h3>{nid ? "नोटिस" : "नवीन नोटिस"}</h3>
                            <h6>{nid ? "नोटिस करणे" : "नवीन नोटिस करणे"}</h6>
                        </div>
                    </div>
                    <ul className="table-top-head">
                        <li>
                            <div className="page-btn">
                                <Link to={route.Notice} className="btn btn-secondary">
                                    <ArrowLeft className="me-2" />
                                    नोटिस मास्टर वर परत जा
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
                                    onClick={() => dispatch(setToogleHeader(!data))}
                                >
                                    <ChevronUp className="feather-chevron-up" />
                                </Link>
                            </OverlayTrigger>
                        </li>
                    </ul>
                </div>

                <div className="card table-list-card">
                    <div className="card-body mbgcolor">
                        <div className="card-body p-4">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3 row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label required">नोटिस शीर्षक :</label>
                                        <input
                                            type="text"
                                            name="Ntitle"
                                            className="form-control"
                                            value={formData.Ntitle}
                                            onChange={handleChange}
                                            ref={aDtitleRef}
                                            onKeyDown={(e) => handleKeyDown(e, aDimageRef)}
                                            required
                                        />
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <div className="mb-0 form-label position-relative">
                                            <label className="form-label">
                                                फाइल (Image/PDF) :
                                                {formData.NLimage && (
                                                    <span
                                                        style={{
                                                            color: "green",
                                                            fontSize: "14px",
                                                            fontWeight: "bold",
                                                            marginLeft: "5px",
                                                        }}
                                                    >
                                                        ✔
                                                    </span>
                                                )}
                                                {formData.NLimage && (
                                                    <span
                                                        className="ms-2"
                                                        style={{
                                                            color: "green",
                                                            fontWeight: "bold",
                                                            cursor: "pointer",
                                                        }}
                                                        onClick={() => openModalWithImage(formData.NLimage)}
                                                    >
                                                        {formData.NLimage.split("_").pop()}
                                                    </span>
                                                )}
                                            </label>
                                            <input
                                                className="form-control pe-5"
                                                type="file"
                                                name="RLimage"
                                                accept="image/*,application/pdf"
                                                onChange={handleFileChange}
                                                ref={aDimageRef}
                                                onKeyDown={(e) => handleKeyDown(e, isactiveRef)}
                                                disabled={isUploading}
                                            />
                                            {isUploading && (
                                                <span
                                                    className="position-absolute"
                                                    style={{
                                                        right: "10px",
                                                        top: "70%",
                                                        transform: "translateY(-50%)",
                                                    }}
                                                >
                                                    Uploading...
                                                </span>
                                            )}
                                            {!isUploading && (
                                                <FaEye
                                                    className="position-absolute"
                                                    style={{
                                                        right: "10px",
                                                        top: "70%",
                                                        transform: "translateY(-50%)",
                                                        cursor: "pointer",
                                                    }}
                                                    onClick={openModal}
                                                />
                                            )}
                                        </div>
                                        {isModalOpen && filePreviewUrl && (
                                            <div
                                                className="modal fade show"
                                                tabIndex="-1"
                                                style={{
                                                    display: "block",
                                                    backdropFilter: "blur(5px)",
                                                    backgroundColor: "rgba(0,0,0,0.5)",
                                                }}
                                            >
                                                <div className="modal-dialog modal-dialog-centered modal-lg">
                                                    <div className="modal-content shadow-lg rounded-3">
                                                        <div className="modal-header bg-primary text-white border-0">
                                                            <h5 className="modal-title">File Preview</h5>
                                                            <button
                                                                type="button"
                                                                className="btn-close text-white"
                                                                onClick={closeModal}
                                                            ></button>
                                                        </div>
                                                        <div className="modal-body p-4">
                                                            {filePreviewUrl.endsWith('.pdf') ? (
                                                                <iframe
                                                                    src={filePreviewUrl}
                                                                    title="PDF Preview"
                                                                    className="img-fluid rounded-3 shadow-sm"
                                                                    style={{ width: '100%', height: '500px' }}
                                                                />
                                                            ) : (
                                                                <img
                                                                    src={filePreviewUrl}
                                                                    alt="Preview"
                                                                    className="img-fluid rounded-3 shadow-sm"
                                                                />
                                                            )}
                                                        </div>
                                                        <div className="modal-footer border-0 bg-light">
                                                            <button
                                                                type="button"
                                                                className="btn btn-secondary"
                                                                onClick={closeModal}
                                                            >
                                                                Close
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">वर्णन</label>
                                        <textarea
                                            type="text"
                                            name="Description"
                                            className="form-control"
                                            value={formData.Description}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="col-lg-6 col-sm-6 col-12">
                                        <label className="form-label required">स्थिती :</label>
                                        <div className="input-blocks add-product">
                                            <Select
                                                name="isactive"
                                                classNamePrefix="react-select"
                                                options={status}
                                                placeholder="Select Status"
                                                title="Please select a valid type of Status."
                                                openMenuOnFocus={true}
                                                value={status.find((option) => option.value === formData.isactive) || null}
                                                onChange={(selectedOption) =>
                                                    setFormData((prevState) => ({
                                                        ...prevState,
                                                        isactive: selectedOption ? selectedOption.value : "",
                                                    }))
                                                }
                                                ref={isactiveRef}
                                                onKeyDown={(e) => handleKeyDown(e, null)}
                                                isSearchable
                                            />
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
                                        <button
                                            type="submit"
                                            className="btn btn-submit"
                                            disabled={isUploading}
                                        >
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
    );
};

export default AddNotice;