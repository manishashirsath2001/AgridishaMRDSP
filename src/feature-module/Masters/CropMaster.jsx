import React, { useState, useEffect, useRef } from 'react';
import { Link } from "react-router-dom";
import ImageWithBasePath from "../../core/img/imagewithbasebath";
import Brand from "../../core/modals/inventory/brand";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { all_routes } from "../../Router/all_routes";
import { baseUrl, ACSPLGUID } from "../../core/json/custom";
import axios from "axios";
import Select from 'react-select'; // Ensure Select is imported
import Table from "../../core/pagination/datatable";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "feather-icons-react/build/IconComponents";
import { getUserData } from '../../Context/UserData'
import { PlusCircle } from "react-feather";


const CropMaster = () => {
    const generatedID = ACSPLGUID?.getNew();
    const GUID = ACSPLGUID.getNew();
    const userdetail = getUserData();
    const route = all_routes;
    const [formdata, setFormData] = useState({
        CropPhoto: "",
        CropNum: "",
        CropNameM: "",
        CropNameE: "",
        Status1: "",
    });
    //declear ref
    const CropNumRef = useRef(null);
    const CropNameMRef = useRef(null);
    const CropNameERef = useRef(null);
    const statusref = useRef(null);
    const saveref = useRef(null);

    // Tooltip for delete action
    const renderDeleteTooltip = (props) => (
        <Tooltip id="Delete-tooltip" {...props}>
            Delete
        </Tooltip>
    );

    // Tooltip for action column
    const renderActionTooltip = (props) => (
        <Tooltip id="action-tooltip" {...props}>
            Action
        </Tooltip>
    );

    // Search Record Master List
    const [searchQuery, setSearchQuery] = useState("");
    const [CropItem, setCropItem] = useState([]);
    // const dataSource = [];
    const columns = [
        {
            title: "पीक नंबर ",
            dataIndex: "itemid",
            render: (text) => (
                <OverlayTrigger placement="top" overlay={<Tooltip id="requisitionnumber-tooltip">{text}</Tooltip>}>
                    <div>{text}</div>
                </OverlayTrigger>
            ),
            sorter: (a, b) => a.itemid.length - b.itemid.length,
        },
        {
            title: "पिकाचे मराठी नाव ",
            dataIndex: "itemnm",
            render: (text) => (
                <OverlayTrigger placement="top" overlay={<Tooltip id="requisitionnumber-tooltip">{text}</Tooltip>}>
                    <div>{text}</div>
                </OverlayTrigger>
            ),
            sorter: (a, b) => a.itemnm.length - b.itemnm.length,
        },
        {
            title: "पिकाचे इंग्रजी नाव ",
            dataIndex: "itemne",
            render: (text) => (
                <OverlayTrigger placement="top" overlay={<Tooltip id="requisitionnumber-tooltip">{text}</Tooltip>}>
                    <div>{text}</div>
                </OverlayTrigger>
            ),
            sorter: (a, b) => a.itemne.length - b.itemne.length,
        },
        {
            title: "स्थिती",
            dataIndex: "status",
            render: (text) => (
                <OverlayTrigger placement="top" overlay={<Tooltip id="requisitionnumber-tooltip">{text === "0" ? "Active" : "InActive"}</Tooltip>}>
                    <div
                        style={{
                            backgroundColor: text === "0" ? "green" : "red",
                            color: "white",
                            borderRadius: "5px",
                            textAlign: "center", // Center text horizontally
                            display: "flex", // Use flexbox for vertical centering
                            alignItems: "center", // Vertically center the text
                            justifyContent: "center", // Horizontally center the text
                            height: "30px", // Adjust height to make sure text is vertically centered
                        }}>{text === "0" ? "Active" : "InActive"}</div>
                </OverlayTrigger>
            ),
            sorter: (a, b) => a.status.length - b.status.length,
        },
        {
            title: (
                <OverlayTrigger placement="top" overlay={renderActionTooltip}>
                    <div className="d-flex justify-content-center">कृती</div>
                </OverlayTrigger>
            ),
            dataIndex: "action",
            render: (text, formdata) => (
                <div className="action-table-data">
                    <div className="edit-delete-action">
                        <OverlayTrigger placement="top" overlay={renderDeleteTooltip}>
                            <Link
                                className="confirm-text p-2"
                                to="#"
                                onClick={() => ConfirmationAlert(formdata.itemaid)}
                            >
                                <Trash2 className="feather-trash-2" />
                            </Link>
                        </OverlayTrigger>
                    </div>
                </div>
            ),
            sorter: (a, b) => a.createdby.length - b.createdby.length,
        },
    ];

    // delete Record in master list
    const OndeleteCropItme = async (itemaid) => {
        try {
            const payload = {
                "itemaid": itemaid,
                "companyid": "",
                "deptid": "",
            };
            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            axios({
                method: "POST",
                url: baseUrl.Url + "/backend/api/SP_DeleteCropItemDetails",
                data: JSON.stringify(payload),
                headers: headers,
            })
                .then((response) => {
                    if (response.status !== 200) throw new Error("Failed to Fetching Data");
                    MySwal.fire({
                        title: response.data[0].responseCode === "FAILURE" ? "Deletion Not Allowed" : "रेकॉर्ड हटवले...!",
                        text: response.data[0].responseMessage,
                        icon: response.data[0].responseCode === "FAILURE" ? "error" : "success",
                        confirmButtonText: "OK",
                        customClass: {
                            confirmButton: response.data[0].responseCode === "FAILURE" ? "btn btn-danger" : "btn btn-success",
                        },
                    });
                    try {
                        const payload = {
                            "itemaid": "%",
                            "keyword": "%",
                            "companyid": "",
                            "deptid": "",
                        };

                        axios({
                            method: "POST",
                            url: baseUrl.Url + "/backend/api/GET_CropItem",
                            data: JSON.stringify(payload),
                            headers: headers,
                        })
                            .then((response) => {
                                if (response.status !== 200) throw new Error("Failed to Fetching Data");
                                const DATA = response.data;
                                setCropItem(DATA);
                            });
                    } catch (error) {
                        console.error("Error fetching Access Right Data:", error);
                    }
                });
        } catch (error) {
            console.error("Error fetching Access Right Data:", error);
        }
    };
    const ConfirmationAlert = (itemaid) => {
        MySwal.fire({
            title: "तुम्हाला खात्री आहे का? ",
            text: "तुम्ही हे बदलू शकणार नाही!",
            showCancelButton: true,
            confirmButtonColor: "#00ff00",
            confirmButtonText: "हो , हटवा !",
            cancelButtonColor: "#ff0000",
            cancelButtonText: "रद्द करा",
            allowOutsideClick: false,
            allowEscapeKey: false,
        }).then((result) => {
            if (result.isConfirmed) {
                OndeleteCropItme(itemaid);
            } else {
                MySwal.close();
            }
        });
    };


    useEffect(() => {

        const fetchCropItem = async () => {
            try {
                const payload = {

                    "itemaid": "%",
                    "keyword": "%",
                    "companyid": userdetail?.companyID ? userdetail.companyID : "",
                    "deptid": userdetail?.departmentID ? userdetail.departmentID : "",

                };
                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };
                const response = await axios.post(
                    `${baseUrl.Url}/backend/api/GET_CropItem`,
                    payload,
                    { headers }
                );
                if (response.status !== 200)
                    throw new Error("Failed to fetch vendor data");
                console.log("quatation master", response.data)
                setCropItem(response.data);
            } catch (error) {
                console.error("Error fetching vendor data:", error);
            }
        };

        fetchCropItem();

    }, []);


    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
        try {
            const payload = {
                "itemaid": "%",
                "keyword": event.target.value,
                "companyid": userdetail?.companyID ? userdetail.companyID : "",
                "deptid": userdetail?.departmentID ? userdetail.departmentID : "",

            };

            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            axios({
                method: "POST",
                url: baseUrl.Url + "/backend/api/GET_CropItem/_Search",
                data: JSON.stringify(payload),
                headers: headers,
            })
                .then((response) => {
                    if (response.status !== 200) throw new Error("Failed to send otp");
                    console.log("response", response.data);
                    setCropItem(response.data);
                });
        } catch (error) {
            console.error("Error while searching WareHouse data:", error);
        }
    };

    const handleSave = async () => {
        console.log("save", handleSave)
        try {
            const payload = {
                itemaid: GUID,
                itemid: formdata.CropNum,
                itemphoto: formdata.CropPhoto,
                itemnm: formdata.CropNameM,
                itemne: formdata.CropNameE,
                status: formdata.Status1,
                companyid: userdetail?.companyID ? userdetail.companyID : "",
                deptid: userdetail?.departmentID ? userdetail.departmentID : "",
                uaid: userdetail?.uaid ? userdetail.uaid : ""
            };
            console.log("Data payload:", payload);

            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            const response = await axios.post(
                `${baseUrl.Url}/backend/api/SP_AddUpdCropItem`,
                JSON.stringify(payload),
                { headers }
            );

            Swal.fire({
                icon: "success",
                title: "साठवले!",
                text: "माहिती यशस्वीरित्या सेव झाली",
                confirmButtonText: "OK",
                allowOutsideClick: false,
                allowEscapeKey: false,
            }).then(() => {
                setFormData({
                    CropPhoto: "",
                    CropNum: "",
                    CropNameM: "",
                    CropNameE: "",
                    Status1: "",
                });
            });

            console.log("API Response:", response.data);
        } catch (error) {
            console.error("Submission Error:", error);
            Swal.fire({
                icon: "error",
                title: "त्रुटी",
                text: "माहिती जतन करताना काहीतरी चूक झाली.",
                confirmButtonText: "OK",
                allowOutsideClick: false,
                allowEscapeKey: false,
            });
        }
    };

    const navigate = useNavigate();
    const showExitAlert = () => {
        MySwal.fire({
            title: "आपण बाहेर पडू इच्छिता का?",
            showCancelButton: true,
            confirmButtonColor: "#00ff00",
            confirmButtonText: "होय",
            cancelButtonColor: "#092C4C",
            cancelButtonText: "नाही",
            allowOutsideClick: false,
            allowEscapeKey: false,
        }).then((result) => {
            if (result.isConfirmed) {
                const modal = document.getElementById("");
                if (modal) {
                    modal.classList.remove("show");
                    modal.style.display = "none";
                    modal.setAttribute("aria-hidden", "true");
                }

                const backdrop = document.querySelector(".modal-backdrop");
                if (backdrop) {
                    backdrop.remove();
                }

                navigate('/MasterIndex');
            }
        });
    };


    const MySwal = withReactContent(Swal);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };
    const [Status, setStatus] = useState([]);


    useEffect(() => {
        const RateType = async () => {
            try {
                const response = await axios.get(
                    baseUrl.Url + "/backend/api/Implications/STATUS",
                );

                if (response.status !== 200) throw new Error("Failed to fetch implications data");

                const data = response.data;
                const implicationsDropdown = data.map(({ iTitle, iValue }) => ({
                    label: iTitle,
                    value: iValue,
                }));

                setStatus(implicationsDropdown);
            } catch (error) {
                console.error("Error fetching implications:", error);
            }
        };

        RateType();
    }, []);

    //enter handleForm input
    const handleKeyDown = (e, nextRef, isLast = false) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (isLast) {
                handleSave(); // Trigger save when it's the last field
            } else if (nextRef && nextRef.current) {
                nextRef.current.focus();
            }
        }
    };

    const [selectedFile, setSelectedFile] = useState(null);

    const uploadProfile = async (fileData, uniqueFileName) => {
        const formData = new FormData();
        formData.append("Files", fileData);
        formData.append("FileNames", uniqueFileName);
        formData.append("FileSizeInBytes", fileData.size);
        formData.append("FilePath", `/Images/${uniqueFileName}`);
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
            // alert("फोटो यशस्वीरित्या अपलोड झाला!");
            messageContainer.innerHTML = "फोटो यशस्वीरित्या अपलोड झाला!";
            messageContainer.style.color = "green";
        } catch (error) {
            console.error("❌ Upload Error:", error.message);
            // alert("फोटो अपलोड होताना त्रुटी आली.");
            messageContainer.innerHTML = "फोटो अपलोड होताना त्रुटी आली.";
            messageContainer.style.color = "red";
        }
    };

    // Handle the file selection and set the form data
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {

            if (!generatedID) {
                console.error("Error: Failed to generate unique ID.");
                return;
            }
            console.log("Generated ID:", generatedID);

            // Prepare final file name with unique ID
            let finalFileName = `${generatedID}_${file.name}`;
            console.log("Final File Name:", finalFileName);

            // Set selected file and form data (store unique file name)
            setSelectedFile(file);
            setFormData({ ...formdata, CropPhoto: finalFileName });

            // Call the upload function with the file and updated unique file name
            uploadProfile(file, finalFileName);
        }
    };



    return (
        <div className="page-wrapper">
            <div className="content ">
                <div className="page-header">
                    <div className="add-item d-flex">
                        <div className="page-title">
                            <h3>पिकांची माहिती</h3>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xl-12">
                        <div className="card mbgcolor">
                            <div className="card-header justify-content-between">
                                <div className="card-title">पीक व्यवस्थापन</div>
                            </div>
                            <div className="card-body mbgcolor">
                                <form className="row gx-3 gy-2 align-items-center mt-0">
                                    <div className="col-sm-3 mb-2">
                                        <label className="form-label">पीकाचे चित्र</label>

                                        {/* Flex Container for Box + Button */}
                                        <div className="d-flex align-items-start">
                                            {/* Image Preview Box */}
                                            <div
                                                className="border rounded p-1 d-flex justify-content-center align-items-center"
                                                style={{ width: '100px', height: '100px' }}
                                            >
                                                {selectedFile ? (
                                                    <img
                                                        src={URL.createObjectURL(selectedFile)}
                                                        alt="पीकाचे चित्र"
                                                        className="img-fluid img-thumbnail rounded"
                                                        style={{ maxHeight: '100%', maxWidth: '100%' }}
                                                    />
                                                ) : (
                                                    <div className="text-muted text-center">
                                                        <PlusCircle className="mb-1" />
                                                        <div>पीकाचे चित्र</div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Change Image Button */}
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-primary ms-2 mt-4"
                                                onClick={() => document.getElementById('imageUpload').click()}
                                            >
                                                Change Image
                                            </button>
                                        </div>

                                        {/* Hidden File Input */}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="d-none"
                                            id="imageUpload"
                                        />
                                    </div>

                                    <div className="row">
                                        <div className="col-sm-3">
                                            <label htmlFor="cropId">पीक नंबर </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="CropNum"
                                                placeholder="पीक नंबर"
                                                value={formdata.CropNum}
                                                onChange={handleInputChange}
                                                ref={CropNumRef}
                                                onKeyDown={(e) => handleKeyDown(e, CropNameMRef)}

                                            />
                                        </div>
                                        <div className="col-sm-3">
                                            <label htmlFor="cropName">पिकाचे मराठी नाव </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="CropNameM"
                                                placeholder="पिकाचे मराठी नाव"
                                                value={formdata.CropNameM}
                                                onChange={handleInputChange}
                                                ref={CropNameMRef}
                                                onKeyDown={(e) => handleKeyDown(e, CropNameERef)}
                                            />
                                        </div>
                                        <div className="col-sm-3">
                                            <label htmlFor="cropName">पिकाचे इंग्रजी नाव  </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="CropNameE"
                                                placeholder="पिकाचे इंग्रजी नाव"
                                                value={formdata.CropNameE}
                                                onChange={handleInputChange}
                                                ref={CropNameERef}
                                                onKeyDown={(e) => handleKeyDown(e, statusref)}
                                            />
                                        </div>
                                        <div className="col-sm-3">
                                            <label htmlFor="field-1" className="form-label">
                                                स्थिती
                                            </label>
                                            <Select
                                                classNamePrefix="react-select"
                                                options={Status}
                                                ref={statusref}
                                                value={
                                                    Status.find((option) => option.value === formdata.Status1) || null
                                                }
                                                onChange={(selectedOption) => {
                                                    setFormData((prevState) => ({
                                                        ...prevState,
                                                        Status1: selectedOption ? selectedOption.value : null,
                                                    }));
                                                    if (saveref.current) {
                                                        saveref.current.focus(); // Move focus after selection
                                                    }
                                                }}

                                            />

                                        </div>
                                    </div>
                                    <div className="text-end">
                                        <div className="d-flex justify-content-end gap-2 ">
                                            <Link className="btn btn-primary btn-dark " onClick={showExitAlert}>
                                                मागे
                                            </Link>
                                            <Link className="btn btn-primary "
                                                ref={saveref}
                                                onClick={handleSave}>
                                                सेव्ह
                                            </Link>


                                        </div>


                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="search-container mb-3">
                    <div className="row">
                        <div className="col-lg-6 col-md-8 col-10 ms-auto">
                            <div className="input-group">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search"
                                    value={searchQuery}
                                    onChange={handleSearch}
                                />
                                <span className="input-group-text">
                                    <i className="fa fa-search"></i>
                                </span>
                            </div>
                        </div>
                        <div className=" text-left mt-2">
                            <h4>पिकांची यादी</h4>
                        </div>
                    </div>
                </div>






                <div className="card table-list-card">
                    <div className="card-body">
                        <div className="table-responsive">
                            <Table columns={columns} dataSource={CropItem} />
                        </div>
                    </div>
                </div>
                <Brand />
            </div>
        </div>
    );
};

export default CropMaster;

