import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import { all_routes } from "../../Router/all_routes";
// import { setToogleHeader } from "../../core/redux/action";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { setToogleHeader } from "../../core/redux/action";
import { baseUrl, ACSPLGUID, convertToISODate } from "../../core/json/custom";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axios from 'axios';
import { getUserData } from '../../Context/UserData';
import { FaEye } from "react-icons/fa";


import {
    ArrowLeft,

    ChevronUp,

} from "feather-icons-react/build/IconComponents";
const AddAdvertise = () => {
    const location = useLocation();
    const { aDid } = location.state || {};
    console.log('aDid  ', aDid)
    const generatedID = ACSPLGUID?.getNew();
    const navigate = useNavigate();
    const route = all_routes;
    const dispatch = useDispatch();
    const GUID = ACSPLGUID.getNew()
    const logtypeRef = useRef(null);
    const aDtitleRef = useRef(null);
    const aDimageRef = useRef(null);
    const isactiveRef = useRef(null);
    const userdetail = getUserData();


    const data = useSelector((state) => state.toggle_header);
    const renderCollapseTooltip = (props) => (
        <Tooltip id="refresh-tooltip" {...props}>
            Collapse
        </Tooltip>
    );
    const nameInputRef = useRef(null);
    useEffect(() => {
        if (nameInputRef.current) {
            nameInputRef.current.focus(); // Focus the input element
        }
    }, []);

    const MySwal = withReactContent(Swal);



    const [formData, setFormData] = useState({
        aDid: "",
        logtype: "",
        aDtitle: "",
        aDimage: "",
        isactive: "",



    });



    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };




    const handleSelectChange = (selectedOption, field) => {
        console.log('selecteddropdown', selectedOption.value)
        setFormData(prevData => ({
            ...prevData,
            [field]: selectedOption ? selectedOption.value : '',
        }));
    };

    const handleSubmit = (e, event) => {
        e.preventDefault();
        console.log('Form Data:', formData);
        showConfirmationAlert(event);
    };

    const showConfirmationAlert = () => {
        MySwal.fire({
            title: 'तुम्हाला खात्री आहे का?',
            text: 'तुम्हाला डेटाला सेव्ह करायचं आहे का?',
            showCancelButton: true,
            confirmButtonColor: '#00ff00',
            confirmButtonText: 'सेव्ह करा',
            cancelButtonColor: '#092C4C',
            cancelButtonText: 'रद्द करा',
        }).then((result) => {
            if (result.isConfirmed) {
                handleFormSubmission();

            }
        });
    };


    const [selectedFile, setSelectedFile] = useState(null);
    const handleFormSubmission = async () => {
        try {
            const payload = {
                aDid: aDid ? aDid : GUID,
                logtype: formData.logtype,
                aDtitle: formData.aDtitle,
                aDimage: formData.aDimage,
                isactive: formData.isactive,
                companyid: userdetail?.companyID ? userdetail.companyID : "",
                deptid: userdetail?.departmentID ? userdetail.departmentID : "",
                uaid: userdetail?.uaid ? userdetail.uaid : "",
            };

            console.log("payload", payload);
            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            await axios({
                method: "POST",
                url: baseUrl.Url + "/backend/api/SP_AddUpdAdvertisement",
                data: JSON.stringify(payload),
                headers: headers,
            });

            Swal.fire({
                icon: "success",
                title: "Saved!",
                text: "Data saved successfully.",
                confirmButtonText: "OK",
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate(route.Advertise);
                }
            });

            // Reset the form data after submission
            setFormData({
                aDid: "",
                logtype: "",
                aDtitle: "",
                aDimage: "",
                isactive: "",
            });

        } catch (error) {
            console.error("Submission Error:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to save data. Please try again.",
            });
        }
    };


    const uploadProfile = async (fileData, finalFileName) => {
        const formData = new FormData();
        formData.append("Files", fileData);
        formData.append("FileNames", finalFileName);
        formData.append("FileSizeInBytes", fileData.size);
        formData.append("FilePath", `/Images/${finalFileName}`);
        formData.append("FileDescription", "Profile Image");

        const messageContainer = document.getElementById("messageContainer");

        try {
            const response = await axios.post(
                `${baseUrl.Url}/backend/api/ProfileUpload/Upload`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
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


    const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!generatedID) {
                console.error("Error: Failed to generate unique ID.");
                return;
            }
            console.log("Generated ID:", generatedID);

            const sanitizedFileName = file.name
                .trim()
                .replace(/\s+/g, '_')
                .replace(/[^\w.-]/g, '');
            let finalFileName = `${generatedID}_${sanitizedFileName}`;


            console.log("Final File Name:", finalFileName);

            setSelectedFile(file);
            setFormData({ ...formData, aDimage: finalFileName });

            const fileUrl = URL.createObjectURL(file);
            setImagePreviewUrl(fileUrl);

            uploadProfile(file, finalFileName);
        }
    };


    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const openModalWithImage = (imageName) => {

        const fileUrl = `${baseUrl.Url}/Images/${imageName}`;
        console.log("Image URL:", fileUrl);
        setImagePreviewUrl(fileUrl);
        setIsModalOpen(true);
    };



    useEffect(() => {
        if (!aDid) return;
        const fetchMasterData = async () => {
            try {
                const payload1 = {
                    "aDid": aDid,
                    "keyword": "%",
                    "companyid": userdetail?.companyID ? userdetail.companyID : "",
                    "deptid": userdetail?.departmentID ? userdetail.departmentID : "",

                }

                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*"
                };

                const response = await axios.post(
                    baseUrl.Url + "/backend/api/GET_Advertisement",
                    payload1,
                    { headers }
                );

                if (response.status !== 200) throw new Error("Failed to fetch data");
                let apiData = response.data[0];
                setFormData((prev) => ({
                    ...prev,
                    aDid: apiData.aDid,
                    logtype: apiData.logtype,
                    aDtitle: apiData.aDtitle,
                    aDimage: apiData.aDimage,
                    isactive: apiData.isactive,

                }));


                console.log(" Master Data:", apiData);
            } catch (error) {
                console.error("Error in Master API Call:", error);
            }
        };
        fetchMasterData();
    }, [aDid]);

    const [status, setstatus] = useState([]);
    const [LOGTYPE, setLOGTYPE] = useState([]);

    useEffect(() => {
        const fetchServiceTypes = async () => {
            try {
                const response = await axios.get(
                    baseUrl.Url + "/backend/api/Implications/LOGTYPE",

                );

                if (response.status !== 200) throw new Error("Failed to fetch implications data");

                const data = response.data;
                const implicationsDropdown = data.map(({ iTitle, iValue }) => ({
                    label: iTitle,
                    value: iValue,
                }));

                setLOGTYPE(implicationsDropdown);
            } catch (error) {
                console.error("Error fetching implications:", error);
            }
        };

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
        fetchServiceTypes()

    }, []);


    const checkFormValidity = (e) => {
        const {
            logtype,
            aDtitle,
            aDimage,
            isactive,
        } = formData;

        if (!logtype) {
            Swal.fire({
                icon: "error",
                title: "Validation Error",
                text: "प्रकार आवश्यक आहे",
            }).then(() => {
                logtypeRef.current.focus();
            });
            return;
        }


        if (!aDtitle) {
            Swal.fire({
                icon: "error",
                title: "Validation Error",
                text: "शीर्षक आवश्यक आहे",
            }).tMaihen(() => {
                aDtitleRef.current.focus();
            });
            return;
        }

        if (!aDimage) {
            Swal.fire({
                icon: "error",
                title: "Validation Error",
                text: "फोटो आवश्यक आहे",
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
                navigate(route.Advertise)
            }
        });
    };


    const handleKeyDown = (e, nextInputRef) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (nextInputRef && nextInputRef.current) {
                nextInputRef.current.focus();
            }
        }
    };
    return (
        <>
            <div className="page-wrapper">
                <div className="content">
                    <div className="page-header">
                        <div className="add-item d-flex">
                            <div className="page-title">

                                <h3>नवीन जाहिरात </h3>
                                <h6>नवीन जाहिरात करणे </h6>
                            </div>
                        </div>
                        <ul className="table-top-head">
                            <li>
                                <div className="page-btn">
                                    <Link to={route.Advertise} className="btn btn-secondary">
                                        <ArrowLeft className="me-2" />
                                        जाहिरात मास्टर वर परत जा
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

                    <div className="card table-list-card">
                        <div className="card-body mbgcolor">
                            <div className="card-body p-4">
                                <form onSubmit={handleSubmit} >
                                    <div className="mb-3 row">
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label required">प्रकार :</label>

                                            <Select
                                                name="logtype"
                                                classNamePrefix="react-select"
                                                options={LOGTYPE}
                                                placeholder="Select"
                                                title="Please select a valid type ."
                                                openMenuOnFocus={true}
                                                value={LOGTYPE.find(option => option.value === formData.logtype) || null}
                                                onChange={(selectedOption) =>
                                                    setFormData(prevState => ({
                                                        ...prevState,
                                                        logtype: selectedOption ? selectedOption.value : null
                                                    }))
                                                }
                                                autoFocus
                                                required
                                            />
                                        </div>
                                        <div className="col-md-8 mb-3">
                                            <label className="form-label required">
                                                शीर्षक :
                                            </label>
                                            <input
                                                type="text"
                                                name="aDtitle"
                                                className="form-control"
                                                value={formData.aDtitle}
                                                onChange={handleChange}
                                                accept="image/*"
                                                multiple={false}
                                                ref={aDtitleRef}
                                                onKeyDown={(e) => handleKeyDown(e, aDimageRef)}
                                                required
                                            />
                                        </div>

                                        <div className="col-md-8 mb-3">
                                            <div className="mb-0 form-label position-relative">
                                                <label className="form-label">
                                                    फोटो :
                                                    {formData.aDimage && (
                                                        <span style={{ color: 'green', fontSize: '14px', fontWeight: 'bold', marginLeft: '5px' }}>
                                                            ✔
                                                        </span>
                                                    )}
                                                    {formData.aDimage && (
                                                        <span
                                                            className="ms-2"
                                                            style={{ color: 'green', fontWeight: 'bold', cursor: 'pointer' }}
                                                            onClick={() => openModalWithImage(formData.aDimage)} // Trigger modal on filename click
                                                        >
                                                            {formData.aDimage.split('\\').pop().split('_').pop()}
                                                        </span>
                                                    )}

                                                </label>
                                                <input
                                                    className="form-control pe-5"
                                                    type="file"
                                                    name="aDimage"
                                                    onChange={handleFileChange}

                                                />
                                                <i
                                                    className="fas fa-eye position-absolute"
                                                    style={{
                                                        right: '10px',
                                                        top: '70%',
                                                        transform: 'translateY(-50%)',
                                                        cursor: 'pointer',
                                                    }}
                                                    onClick={openModal}
                                                ></i>
                                            </div>

                                            {isModalOpen && imagePreviewUrl && (
                                                <div
                                                    className="modal fade show"
                                                    tabIndex="-1"
                                                    style={{
                                                        display: 'block',
                                                        backdropFilter: 'blur(5px)',
                                                        backgroundColor: 'rgba(0,0,0,0.5)',
                                                    }}
                                                >
                                                    <div className="modal-dialog modal-dialog-centered modal-lg">
                                                        <div className="modal-content shadow-lg rounded-3">
                                                            <div className="modal-header bg-primary text-white border-0">
                                                                <h5 className="modal-title">Image Preview</h5>
                                                                <button
                                                                    type="button"
                                                                    className="btn-close text-white"
                                                                    onClick={closeModal}
                                                                ></button>
                                                            </div>
                                                            <div className="modal-body p-4">
                                                                <img
                                                                    src={imagePreviewUrl}
                                                                    alt="Preview"
                                                                    className="img-fluid rounded-3 shadow-sm"
                                                                />
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


                                        <div className="col-lg-4 col-sm-6 col-12">

                                            <label className="form-label required">
                                                स्थिती :
                                            </label>
                                            <div className="input-blocks add-product">

                                                <Select
                                                    name="isactive"
                                                    classNamePrefix="react-select"
                                                    options={status}
                                                    placeholder="Select"
                                                    title="Please select a valid type of Status."
                                                    openMenuOnFocus={true}
                                                    value={status.find(option => option.value === formData.isactive) || null}
                                                    onChange={(selectedOption) =>
                                                        setFormData(prevState => ({
                                                            ...prevState,
                                                            isactive: selectedOption ? selectedOption.value : null
                                                        }))
                                                    }
                                                    ref={isactiveRef}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-lg-12">
                                        <div className="btn-addproduct mb-4">
                                            <button type="button" onClick={showExitAlert} className="btn btn-cancel me-2">
                                                मागे
                                            </button>
                                            <button type="submit" className="btn btn-submit"> सेव्ह</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </>
    );
};
export default AddAdvertise;

