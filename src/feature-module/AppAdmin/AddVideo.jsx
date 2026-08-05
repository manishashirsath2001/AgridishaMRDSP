
import React, { useState, useEffect, useRef } from 'react';
import { Link } from "react-router-dom";
import Select from "react-select";
import { all_routes } from "../../Router/all_routes";
import { ACSPLGUID, baseUrl } from "../../core/json/custom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axios from 'axios';
import { useNavigate, useLocation } from "react-router-dom";
import { Edit, Trash2 } from "react-feather";
import { FaEye } from "react-icons/fa";
import {
    ArrowLeft,
    ChevronDown,
    ChevronUp,
    Info,
} from "feather-icons-react/build/IconComponents";
import { useDispatch, useSelector } from "react-redux";
import { setToogleHeader } from "../../core/redux/action";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { getUserData } from '../../Context/UserData';

const AddVideo = () => {
    const route = all_routes;
    const dispatch = useDispatch();
    const userdetail = getUserData();
    const location = useLocation();
    const GUID = ACSPLGUID.getNew();
    const VtitleRef = useRef(null);
    const VideoRef = useRef(null);
    const ISACTIVERef = useRef(null);
    const { vid } = location.state || {};
    const [selectedVideoName, setSelectedVideoName] = useState("");
    const MySwal = withReactContent(Swal);
    const navigate = useNavigate();
    const data = useSelector((state) => state.toggle_header);
    const [videoPreview, setVideoPreview] = useState(null);
    const [message, setMessage] = useState("");
    const [messageColor, setMessageColor] = useState("black");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [status, setStatus] = useState([]);

    const [formData, setFormData] = useState({
        vid: vid || GUID,
        Vtitle: "",
        Video: "",
        ISACTIVE: ""
    });

    const renderCollapseTooltip = (props) => (
        <Tooltip id="refresh-tooltip" {...props}>
            Collapse
        </Tooltip>
    );

    // Fetch status options
    useEffect(() => {
        const fetchVariety = async () => {
            try {
                const payload = { implicationGroup: "STATUS" };
                const varietyRes = await axios.post(
                    `${baseUrl.Url}/api/getImplications`,
                    payload,
                    { headers: { "Content-Type": "application/json" } }
                );
                setStatus(varietyRes.data.map(({ iTitle, iValue }) => ({
                    label: iTitle,
                    value: iValue,
                })));
            } catch (err) {
                console.error("Error fetching status:", err);
            }
        };
        fetchVariety();
    }, []);

    // Fetch video details for editing
    useEffect(() => {
        const fetchData = async () => {
            if (vid) {
                try {
                    const payload = {
                        vid: vid,
                        keyword: "%",
                        companyid: "COMP123",
                        deptid: "",
                    };
                    const headers = { "Content-Type": "application/json", Accept: "*/*" };
                    const response = await axios.post(
                        `${baseUrl.Url}/api/GET_AdminVideo`,
                        JSON.stringify(payload),
                        { headers }
                    );
                    if (response.status !== 200) {
                        throw new Error("Failed to Fetch Video Details");
                    }
                    const apiData = response.data[0];
                    setFormData({
                        vid: apiData.vid,
                        Vtitle: apiData.vtitle,
                        Video: apiData.video,
                        ISACTIVE: apiData.isactive
                    });
                    setSelectedVideoName(apiData.video);
                    setVideoPreview(`${baseUrl.Url}/Assets/${apiData.video}`);
                } catch (error) {
                    console.error("Error fetching video data:", error);
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: "Failed to fetch video details.",
                    });
                }
            }
        };
        fetchData();
    }, [vid]);

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    // Handle video file upload
    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const uniqueFileName = `${Date.now()}-${file.name}`;
            setSelectedVideoName(uniqueFileName);
            setVideoPreview(URL.createObjectURL(file)); // Local preview
            await uploadVideo(file, uniqueFileName);
        }
    };

    // Upload video to the server
    const uploadVideo = async (video, uniqueFileName) => {
        const formData = new FormData();
        formData.append("Files", video);
        formData.append("FileNames", uniqueFileName);
        formData.append("fileSizeInBytes", video.size);
        formData.append("filePath", `/Assets/${uniqueFileName}`);

        try {
            const response = await axios.post(
                `${baseUrl.Url}/api/VideoUpload/Upload`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        "accept": "*/*",
                    },
                }
            );
            console.log("✅ Upload Success:", response.data);
            setMessage("Video uploaded successfully!");
            setMessageColor("green");
            // Update formData with the uploaded video's filename
            setFormData((prevState) => ({
                ...prevState,
                Video: uniqueFileName
            }));
        } catch (error) {
            console.error("❌ Upload Error:", error.message);
            setMessage("Failed to upload video.");
            setMessageColor("red");
            setSelectedVideoName("");
            setVideoPreview(null);
        }
    };

    // Handle form submission
    const handleFormSubmission = async () => {
        try {
            const payload = {
                vid: vid ? vid : GUID,
                vtitle: formData.Vtitle,
                video: formData.Video,
                isactive: formData.ISACTIVE,
                date: "",
                uaid: "",
                companyid: "COMP123",
                deptid: ""
            };
            const headers = { "Content-Type": "application/json", Accept: "*/*" };
            const response = await axios.post(
                `${baseUrl.Url}/api/SP_AddUpdAdminVideo`,
                JSON.stringify(payload),
                { headers }
            );
            console.log("Response Received:", response.data);
            Swal.fire({
                icon: "success",
                title: "Saved!",
                text: "Video saved successfully.",
                confirmButtonText: "OK",
            });
            setFormData({
                vid: "",
                Vtitle: "",
                Video: "",
                ISACTIVE: ""
            });
            setSelectedVideoName("");
            setVideoPreview(null);
            navigate(route.VideoMaster);
        } catch (error) {
            console.error("Submission Error:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to save video. Please try again.",
            });
        }
    };

    // Validate form and submit
    const checkFormValidity = (e) => {
        const { Vtitle, Video, ISACTIVE } = formData;
        if (!Vtitle) {
            Swal.fire({
                icon: "error",
                title: "Validation Error",
                text: "Title is required",
            }).then(() => VtitleRef.current.focus());
            return;
        }
        if (!Video) {
            Swal.fire({
                icon: "error",
                title: "Validation Error",
                text: "Video is required",
            }).then(() => VideoRef.current.focus());
            return;
        }
        if (!ISACTIVE) {
            Swal.fire({
                icon: "error",
                title: "Validation Error",
                text: "Status is required",
            }).then(() => ISACTIVERef.current.focus());
            return;
        }
        handleSubmit(e);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const form = e.target.closest("form");
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        MySwal.fire({
            title: "Are you sure?",
            text: "Do you want to save this video?",
            showCancelButton: true,
            confirmButtonColor: "#00ff00",
            confirmButtonText: "Save",
            cancelButtonColor: "#092C4C",
            cancelButtonText: "Cancel",
        }).then((result) => {
            if (result.isConfirmed) {
                handleFormSubmission();
            }
        });
    };

    // Handle keyboard shortcuts
    useEffect(() => {
        const handleShortcut = (e) => {
            if (e.ctrlKey && e.key === "e") {
                e.preventDefault();
                MySwal.fire({
                    title: "Are you sure?",
                    text: "Do you want to exit?",
                    showCancelButton: true,
                    confirmButtonColor: "#00ff00",
                    confirmButtonText: "Yes",
                    cancelButtonColor: "#092C4C",
                    cancelButtonText: "No",
                }).then((result) => {
                    if (result.isConfirmed) {
                        navigate(route.VideoMaster);
                    }
                });
            }
            if (e.ctrlKey && (e.key === "s" || e.key === "S")) {
                e.preventDefault();
                checkFormValidity(e);
            }
        };
        window.addEventListener("keydown", handleShortcut);
        return () => window.removeEventListener("keydown", handleShortcut);
    }, [formData, navigate]);

    // Modal for video preview
    const openModalWithImage = (videoName) => {
        const fileUrl = `${baseUrl.Url}/Assets/${videoName}`;
        console.log("Video URL:", fileUrl);
        setVideoPreview(fileUrl);
        setSelectedVideoName(videoName);
        setIsModalOpen(true);
    };

    return (
        <div className="page-wrapper">
            <div className="content">
                <div className="page-header">
                    <div className="add-item d-flex">
                        <div className="page-title">
                            <h5 className="mb-1">Add Video</h5>
                        </div>
                    </div>
                    <ul className="table-top-head">
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
                    <div className="page-btn">
                        <Link to={route.VideoMaster} className="btn btn-secondary">
                            <ArrowLeft className="me-2" />
                            Back
                        </Link>
                    </div>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="card">
                        <div className="card-body add-product mbgcolor">
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
                                                    <span>Add Video</span>
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
                                                <div className="col-md-12 mb-3">
                                                    <label className="form-label required">Title</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Enter video title"
                                                        name="Vtitle"
                                                        value={formData.Vtitle}
                                                        onChange={handleChange}
                                                        ref={VtitleRef}
                                                        onKeyDown={(e) => handleKeyDown(e, VideoRef)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-8 mb-3">
                                                    <div className="mb-0 form-label position-relative">
                                                        <label className="form-label">
                                                            Video:
                                                            {formData.Video && (
                                                                <span
                                                                    className="ms-2 text-success font-weight-bold"
                                                                    style={{ cursor: 'pointer' }}
                                                                    onClick={() => openModalWithImage(formData.Video)}
                                                                >
                                                                    {' '}✔ Uploaded: {formData.Video.split('-').pop()}
                                                                </span>
                                                            )}
                                                        </label>
                                                        <input
                                                            className="form-control pe-5"
                                                            type="file"
                                                            name="Video"
                                                            accept="video/*"
                                                            onChange={handleFileChange}
                                                            ref={VideoRef}
                                                            onKeyDown={(e) => handleKeyDown(e, ISACTIVERef)}
                                                        />
                                                        <FaEye
                                                            size={20}
                                                            className="position-absolute"
                                                            style={{ right: '10px', top: '70%', transform: 'translateY(-50%)', cursor: 'pointer' }}
                                                            onClick={() => formData.Video && openModalWithImage(formData.Video)}
                                                        />
                                                    </div>
                                                    <div className="text-start mt-3">
                                                        {message && (
                                                            <p style={{ color: messageColor }}>{message}</p>
                                                        )}
                                                        {videoPreview && (
                                                            <video width="300" controls autoPlay muted className="video-preview mt-3">
                                                                <source src={videoPreview} type="video/mp4" />
                                                                Your browser does not support the video tag.
                                                            </video>
                                                        )}
                                                    </div>
                                                    {isModalOpen && (
                                                        <div className="modal d-block" style={{ backdropFilter: 'blur(5px)', backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setIsModalOpen(false)}>
                                                            <div className="modal-dialog modal-dialog-centered modal-lg" onClick={(e) => e.stopPropagation()}>
                                                                <div className="modal-content shadow-lg rounded-3">
                                                                    <div className="modal-header text-white border-0">
                                                                        <h5 className="modal-title">Video Preview</h5>
                                                                        <button type="button" className="btn-close text-white" onClick={() => setIsModalOpen(false)}></button>
                                                                    </div>
                                                                    <div className="modal-body p-4">
                                                                        {videoPreview ? (
                                                                            <video controls autoPlay muted className="w-100">
                                                                                <source src={videoPreview} type="video/mp4" />
                                                                                Your browser does not support the video tag.
                                                                            </video>
                                                                        ) : (
                                                                            <div className="text-center">
                                                                                <p className="text-danger font-weight-bold">🚫 No video available for preview</p>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <div className="modal-footer border-0 bg-light">
                                                                        <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                                                                            Close
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="col-lg-4">
                                                    <div className="mb-0">
                                                        <label className="form-label required">Status</label>
                                                        <Select
                                                            name="ISACTIVE"
                                                            classNamePrefix="react-select"
                                                            options={status}
                                                            placeholder="Select"
                                                            title="Please select a valid status."
                                                            openMenuOnFocus={true}
                                                            value={status.find((option) => option.value === formData.ISACTIVE) || null}
                                                            onChange={(selectedOption) =>
                                                                setFormData((prevState) => ({
                                                                    ...prevState,
                                                                    ISACTIVE: selectedOption ? selectedOption.value : null,
                                                                }))
                                                            }
                                                            ref={ISACTIVERef}
                                                            onKeyDown={(e) => {
                                                                const isDropdownOpen = document.activeElement.getAttribute("aria-expanded") === "true";
                                                                if (e.key === "Enter" && !isDropdownOpen) {
                                                                    e.preventDefault();
                                                                    checkFormValidity(e);
                                                                }
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row mt-3">
                                                <div className="col-lg-12 text-end">
                                                    <button
                                                        type="button"
                                                        className="btn btn-cancel me-3"
                                                        onClick={() => navigate(route.VideoMaster)}
                                                    >
                                                        Back
                                                    </button>
                                                    <button type="submit" className="btn btn-submit">
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
                </form>
            </div>
        </div>
    );
};

export default AddVideo;