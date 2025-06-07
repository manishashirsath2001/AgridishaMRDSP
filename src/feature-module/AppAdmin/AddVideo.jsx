import React, { useState, useEffect, useRef } from 'react';
import { Link } from "react-router-dom";
import Select from "react-select";
import { all_routes } from "../../Router/all_routes";
// import Addunits from "../../core/modals/inventory/addunits";
// import AddCategory from "../../core/modals/inventory/addcategory";
// import AddBrand from "../../core/modals/addbrand";
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
    LifeBuoy,
    List,



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
    const [videoPreview, setVideoPreview] = useState(null); // For video preview
    const [videoDetails, setVideoDetails] = useState({ name: "", size: "" }); // For video details
    const [Video, setVideo] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const generatedID = ACSPLGUID?.getNew();


    const renderCollapseTooltip = (props) => (
        <Tooltip id="refresh-tooltip" {...props}>
            Collapse
        </Tooltip>
    );

    const [formData, setFormData] = useState({
        vid: "",
        Vtitle: "",
        Video: "",
        ISACTIVE: ""

    });
    const handleFormSubmission = async () => {
        try {
            const payload = {
                "vid": vid ? vid : GUID,
                "vtitle": formData.Vtitle,
                "video": formData.Video,
                "isactive": formData.ISACTIVE,
                "date": "",
                "uaid": "",
                "companyid": "",
                "deptid": ""
            };

            console.log("payload", payload);
            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };


            const response = await axios({
                method: "POST",
                url: baseUrl.Url + "/backend/api/SP_AddUpdAdminVideo",
                data: JSON.stringify(payload),
                headers: headers,
            });

            console.log("Response Received:", response.data);
            Swal.fire({
                icon: "success",
                title: "Saved!",
                text: "Data saved successfully.",
                confirmButtonText: "OK",
            });

            setFormData({
                vid: "",
                Vtitle: "",
                Video: "",
                ISACTIVE: " "
            });
            navigate(route.VideoMaster);
        } catch (error) {
            console.error("Submission Error:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to save data. Please try again.",
            });
        }
    };

    //edit
    useEffect(() => {
        const fetchData = async () => {
            if (vid) {
                try {
                    const payload = {
                        vid: vid,
                        keyword: "%",
                        companyid: "",
                        deptid: "",
                    }

                    const headers = {
                        "Content-Type": "application/json",
                        Accept: "*/*",
                    };


                    const response = await axios({
                        method: "POST",
                        url: baseUrl.Url + "/backend/api/GET_AdminVideo",
                        data: JSON.stringify(payload),
                        headers: headers,
                    });

                    if (response.status !== 200) {
                        throw new Error("Failed to Fetch  Plot Details Data");
                    }

                    let apiData = response.data[0];
                    setFormData((prev) => ({
                        ...prev,
                        vid: apiData.vid,
                        Vtitle: apiData.vtitle,
                        Video: apiData.video,
                        ISACTIVE: apiData.isactive
                    }));

                } catch (error) {
                    console.error("Error fetching Access Right Data:", error);
                }
            }
        };

        fetchData();
    }, [vid]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));


        // const file = e.target.files ? e.target.files[0] : null;

        // if (file) {
        //     if (file.type.startsWith("video/")) {
        //         const videoUrl = URL.createObjectURL(file);
        //         setVideoPreview(videoUrl); 
        //         setVideoDetails({ name: file.name }); 
        //     } else {
        //         alert("Please select a valid video file");
        //     }
        // } else {

        //     console.log("No file selected");
        // }
    };



    //   const openModal = () => {
    //     setVideo(videoPreview); 
    //     setIsModalOpen(true); 
    //     document.body.classList.remove('modal-open', 'blurred');
    //   };


    //   const closeModal = () => {
    //     setIsModalOpen(false);
    //     setVideo(null); 
    //     document.body.classList.add('modal-open', 'blurred'); 
    //   };
    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const openModalWithImage = (selectedVideoName) => {
        // Assuming the base URL points to where images are stored on the server
        const fileUrl = `${baseUrl.Url}/Images/${selectedVideoName}`;
        console.log("Video URL:", fileUrl); // Make sure the file path is correct
        setVideoPreview(fileUrl);
        setSelectedVideoName(file.name);
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const form = e.target.closest("form");
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        showConfirmationAlert();
    };




    const showExitAlert = () => {
        MySwal.fire({
            title: "तुम्हाला खात्री आहे का?",
            text: "तुम्ही नक्कीच बाहेर जाऊ इच्छिता का?",
            showCancelButton: true,
            confirmButtonColor: "#00ff00",
            confirmButtonText: "होय",
            cancelButtonColor: "#092C4C",
            cancelButtonText: "नाही",
        }).then((result) => {
            if (result.isConfirmed) {
                navigate(route.VideoMaster)
            }
        });
    };
    const showConfirmationAlert = (event) => {
        MySwal.fire({
            title: "तुम्हाला खात्री आहे का?",
            text: "तुम्ही हा डेटा सेव करू इच्छिता का?",
            showCancelButton: true,
            confirmButtonColor: "#00ff00",
            confirmButtonText: "सेव",
            cancelButtonColor: "#092C4C",
            cancelButtonText: "रद्द करा",
        }).then((result) => {
            if (result.isConfirmed) {
                handleFormSubmission(event);
            }
        });
    };

    const checkFormValidity = (e) => {
        const {

            Vtitle,
            Video,
            ISACTIVE

        } = formData;


        if (!Vtitle) {
            Swal.fire({
                icon: "त्रुटी",
                title: "Validation Error",
                text: "शीर्षक आवश्यक आहे ",
            }).then(() => {
                VtitleRef.current.focus();
            });
            return;
        }
        if (!Video) {
            Swal.fire({
                icon: "त्रुटी",
                title: "Validation Error",
                text: "व्हिडिओ आवश्यक आहे",
            }).then(() => {
                VideoRef.current.focus();
            });
            return;
        }



        if (!ISACTIVE) {
            Swal.fire({
                icon: "त्रुटी",
                title: "Validation Error",
                text: "स्थिती प्रविष्ट करा",
            }).then(() => {
                ISACTIVERef.current.focus();
            });
            return;
        }

        handleSubmit(e);
    };

    const handleKeyDown = (e, nextInputRef) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (nextInputRef && nextInputRef.current) {
                nextInputRef.current.focus();
            }
        }
    };
    //shortkey
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
    //upload 
    const uploadVideo = async (video, uniqueFileName) => {
        const formData = new FormData();

        // Append video file data and additional parameters
        formData.append("Files", video);
        formData.append("FileNames", uniqueFileName);
        formData.append("fileSizeInBytes", video.size);
        formData.append("filePath", `/Images/${uniqueFileName}`);

        try {
            const response = await axios.post(
                `${baseUrl.Url}/backend/api/VideoUpload/Upload`, // Update your endpoint accordingly
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        "accept": "*/*",
                    },
                }
            );

            console.log("✅ Upload Success:", response.data);
            messageContainer.innerHTML = "फोटो यशस्वीरित्या अपलोड झाला!";
            messageContainer.style.color = "green";
        } catch (error) {
            console.error("❌ Upload Error:", error.message);
            messageContainer.innerHTML = "फोटो अपलोड होताना त्रुटी आली.";
            messageContainer.style.color = "red";
        }
    };
    const [selectedFile, setSelectedFile] = useState(null);
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Set selected file and video name
            setSelectedFile(file);
            const finalFileName = `${file.name}`;
            setFormData({ ...formData, Video: finalFileName });

            // Create video preview URL
            const fileUrl = URL.createObjectURL(file);
            setVideoPreview(fileUrl);
            setSelectedVideoName(finalFileName);
            uploadVideo(file, finalFileName); // Assuming uploadVideo handles the server upload logic
        }
    };
    //dropdown set
    const [status, setstatus] = useState();
    useEffect(() => {

        const fetchStatus = async () => {
            try {
                const response = await axios.get(
                    baseUrl.Url + "/backend/api/Implications/STATUS",

                );

                if (response.status !== 200) throw new Error("Failed to fetch implications data");

                const data = response.data;
                const implicationDropdown = data.map(({ iTitle, iValue }) => ({
                    label: iTitle,
                    value: iValue,
                }));

                setstatus(implicationDropdown);
            } catch (error) {
                console.error("Error fetching implications:", error);
            }
        };

        fetchStatus();


    }, []);
    return (
        <div className="page-wrapper">
            <div className="content">
                <div className="page-header">
                    <div className="add-item d-flex">
                        <div className="page-title">
                            <h5 className="mb-1">Video Master</h5>
                            <h6>Add Video </h6>
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
                        <Link to={route.VideoMaster} className="btn btn-secondary">
                            <ArrowLeft className="me-2" />
                            मागे
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
                                                    <span>Video Master</span>
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
                                                <div className="col-md-12  mb-3">
                                                    <label className="form-label required">शीर्षक</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Enter your video name"
                                                        name="Vtitle"
                                                        value={formData.Vtitle}
                                                        onChange={handleChange}
                                                        ref={VtitleRef}
                                                        onKeyDown={(e) => handleKeyDown(e, VideoRef)}

                                                    />
                                                </div>
                                                <div className="col-md-10 mb-3">
                                                    <div className="mb-0 form-label position-relative">
                                                        <label className="form-label">
                                                            व्हिडिओ :
                                                            {formData.Video && (
                                                                <span
                                                                    className="ms-2 text-success font-weight-bold"
                                                                    style={{ cursor: 'pointer' }}
                                                                    onClick={() => openModalWithImage(formData.Video)} // Open modal with video preview
                                                                >{' '}✔ Uploaded: {selectedVideoName}
                                                                    {formData.Video.split('\\').pop().split('_').pop()}
                                                                </span>
                                                            )}
                                                        </label>
                                                        <input
                                                            className="form-control pe-5"
                                                            type="file"
                                                            name="Video"
                                                            accept="video/*" // Accept only video files
                                                            onChange={handleFileChange}
                                                            ref={VideoRef}
                                                            onKeyDown={(e) => handleKeyDown(e, ISACTIVERef)}
                                                        />
                                                        <FaEye
                                                            size={20}
                                                            className="position-absolute"
                                                            style={{ right: '10px', top: '70%', transform: 'translateY(-50%)', cursor: 'pointer' }}
                                                            onClick={() => setIsModalOpen(true)} // Opens the modal
                                                        />
                                                    </div>

                                                    <div className="text-start mt-3">
                                                        {videoPreview ? (

                                                            <video width="300" controls autoPlay muted className="video-preview mt-3">
                                                                <source src={videoPreview} type="video/mp4" />
                                                                Your browser does not support the video tag.
                                                            </video>
                                                        ) : selectedVideoName ? (
                                                            <video width="300" controls className="video-preview mt-3" onError={(e) => { e.target.style.display = 'none'; }}>
                                                                <source src={`${baseUrl.Url}/Images/${selectedVideoName}`} type="video/mp4" />
                                                                Your browser does not support the video tag.
                                                            </video>
                                                        ) : (
                                                            <p className="text-danger font-weight-bold"></p>
                                                        )}
                                                    </div>

                                                    {/* Modal for Video Preview */}
                                                    {isModalOpen && (
                                                        <div className="modal d-block" style={{ backdropFilter: 'blur(5px)', backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setIsModalOpen(false)}>
                                                            <div className="modal-dialog modal-dialog-centered modal-lg" onClick={(e) => e.stopPropagation()}>
                                                                <div className="modal-content shadow-lg rounded-3">
                                                                    <div className="modal-header  text-white border-0">
                                                                        <h5 className="modal-title">Video Preview</h5>
                                                                        <button type="button" className="btn-close text-white" onClick={() => setIsModalOpen(false)}></button>
                                                                    </div>
                                                                    <div className="modal-body p-4">
                                                                        {videoPreview ? (
                                                                            <video controls autoPlay muted className="w-100">
                                                                                <source src={`${baseUrl.Url}/Images/${formData.Video}`} type="video/mp4" />
                                                                                Your browser does not support the video tag.
                                                                            </video>
                                                                        ) : selectedVideoName ? (
                                                                            <video controls autoPlay muted className="w-100">
                                                                                <source src={`${baseUrl.Url}/Images/${selectedVideoName}`} type="video/mp4" />
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
                                            </div>
                                            <div className="col-lg-4 col-sm-6 col-12">
                                                <label className="form-label required">
                                                    स्थिती
                                                </label>
                                                <div className="input-blocks add-product">

                                                    <Select
                                                        name="ISACTIVE"
                                                        classNamePrefix="react-select"
                                                        options={status || []}
                                                        placeholder="Select"
                                                        title="Please select a valid type of Status."
                                                        openMenuOnFocus={true}
                                                        value={status && status.find(option => option.value === formData.ISACTIVE) || null}
                                                        onChange={(selectedOption) =>
                                                            setFormData(prevState => ({
                                                                ...prevState,
                                                                ISACTIVE: selectedOption ? selectedOption.value : null
                                                            }))
                                                        }
                                                        ref={ISACTIVERef}
                                                        // onKeyDown={(e) => handleKeyDown(e, VtitleRef)}
                                                        onKeyDown={(e) => {
                                                            const isDropdownOpen = document.activeElement.getAttribute('aria-expanded') === 'true';
                                                            if (e.key === 'Enter' && !isDropdownOpen) {
                                                                e.preventDefault();
                                                                checkFormValidity(e); // Save the form
                                                            }
                                                        }}
                                                        required


                                                    />
                                                </div>
                                            </div>

                                            {/* save and cancel button */}
                                            <div className="row mt-3">
                                                <div className="col-lg-12 text-end">
                                                    <button
                                                        type="button"
                                                        className="btn btn-cancel me-3"
                                                        onClick={showExitAlert}
                                                    >
                                                        मागे
                                                    </button>

                                                    <button
                                                        type="submit"
                                                        className="btn btn-submit"
                                                    >
                                                        जतन करा
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
