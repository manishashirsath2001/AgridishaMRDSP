

import React, { useState, useEffect, useRef } from 'react';
import { Link } from "react-router-dom";
import Select from "react-select";
import { all_routes } from "../../Router/all_routes";
import Addunits from "../../core/modals/inventory/addunits";
import AddCategory from "../../core/modals/inventory/addcategory";
import AddBrand from "../../core/modals/addbrand";
import { ACSPLGUID, baseUrl, convertToISODate } from "../../core/json/custom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axios from 'axios';
import { useNavigate, useLocation } from "react-router-dom";
import { Edit, Trash2 } from "react-feather";
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

const AddCropPlot = () => {
    const route = all_routes;
    const dispatch = useDispatch();
    const userdetail = getUserData();
    const location = useLocation();
    const FARMERRef = useRef(null);
    const VILLAGERef = useRef(null);
    const plotNoRef = useRef(null);
    const AddRef = useRef(null);
    const plotAreaRef = useRef(null);
    const plotTypeRef = useRef(null);
    const plotVarietyRef = useRef(null);
    const pronningDateRef = useRef(null);
    const geo_locationRef = useRef(null);
    const noOfPlantsRef = useRef(null);
    const nooffruitRef = useRef(null);
    const harvestingDateRef = useRef(null);
    const daysharvestRef = useRef(null);
    const remarkRef = useRef(null);
    const expturnRef = useRef(null);
    const latLongRef = useRef(null);
    const photoref = useRef(null);
    const registrationDateRef = useRef(null);
    const { pltaid } = location.state || {};
    const GUID = ACSPLGUID.getNew();
    const MySwal = withReactContent(Swal);
    const navigate = useNavigate();
    const data = useSelector((state) => state.toggle_header);
    const renderCollapseTooltip = (props) => (
        <Tooltip id="refresh-tooltip" {...props}>
            Collapse
        </Tooltip>
    );

    const warehouse = [
        { value: "choose", label: "Choose" },
        { value: "Customer", label: "Customer" },
        { value: "Supplier", label: "Supplier" },
        { value: "Transporter", label: "Transporter" },
    ];

    const sellingtype = [
        { value: "choose", label: "Choose" },
        { value: "transactionalSelling", label: "Transactional selling" },
        { value: "solutionSelling", label: "Solution selling" },
    ];

    // const [selectedType, setSelectedType] = useState(null);
    // const [selectedcity, setselectedcity] = useState(null);
    // const [selectedstate, setselectedstate] = useState(null);
    // const [selectedTradecity, setselectedTradecity] = useState(null);
    // const [name, setName] = useState('');
    // const [phone, setPhone] = useState('');
    // const [Teliphone, setTeliphone] = useState('');
    // const [Email, setEmail] = useState('');
    // const [Pincode, setPincode] = useState('');
    // const [PAN, setPAN] = useState('');
    // const [Building, setBuilding] = useState('');
    // const [Area, setArea] = useState('');
    // const [Landmark, setLandmark] = useState('');
    // const [TradeName, setTradeName] = useState('');
    // const [TradePincode, setTradePincode] = useState('');
    // const [TradeBuilding, setTradeBuilding] = useState('');
    // const [TradeArea, setTradeArea] = useState('');
    // const [TradeLandmark, setTradeLandmark] = useState('');
    // const [GSTIN, setGSTIN] = useState('');

    const [Pdata, setPdata] = useState([]);
    const [PlotDetails, setPlotDetails] = useState({
        pltdaid: '',
        pltaid: '',
        plotNo: '',
        plotArea: '',
        plotVariety: '',
        noOfPlants: '',
        plotType: '',
        latLong: '',
        pronningDate: '',
        harvestingDate: '',
        nooffruit: '',
        expturn: '',
        noofdays_harvest: '',
        remark: '',
        plot_photo: '',
        geo_location: '',
        isdeleted: 0,

    });
    //console data
    const [formData, setFormData] = useState({
        pltaid: '',
        farmer: '',
        registrationDate: ''

    });
    const [Crop_TYPE, setCrop_TYPE] = useState([]);
    useEffect(() => {
        if (FARMERRef.current) {
            FARMERRef.current.focus();
        }
    }, [formData]);

    useEffect(() => {
        const fetchImplications = async () => {
            try {
                const response = await axios.get(
                    baseUrl.Url + "/backend/api/Implications/CROP_TYPE"
                );

                if (response.status !== 200) throw new Error("Failed to fetch implications data");

                const data = response.data;

                const implicationsDropdown = data.map(({ iTitle, iValue }) => ({
                    label: iTitle,
                    value: iValue,
                }));

                setCrop_TYPE(implicationsDropdown);

            } catch (error) {
                console.error("Error fetching implications:", error);
            }
        };

        fetchImplications();
    }, []);

    useEffect(() => {
        if (Crop_TYPE.length > 0) {
            const defaultOption = Crop_TYPE.find(option => option.label === "डाळिंब") || Crop_TYPE[0];
            setPlotDetails(prev => ({ ...prev, plotType: defaultOption.value }));
        }
    }, [Crop_TYPE]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (Pdata.length > 0) {
            showConfirmationAlert();
        }
        else {
            Swal.fire({
                icon: 'error',
                title: 'डेटा नाही',
                text: 'कृपया सेव करण्यापूर्वी किमान एक प्लॉट जोडा.',
                allowOutsideClick: false,
                allowEscapeKey: false,
            });
        }
    };
    const handleKeyDown = (e, nextInputRef) => {
        if (e.key === 'Enter' || e.key === 'Tab') {
            const isDropdownOpen = document.activeElement.getAttribute('aria-expanded') === 'true';
            if (!isDropdownOpen) {
                e.preventDefault();
                if (nextInputRef && nextInputRef.current) {
                    nextInputRef.current.focus();
                }
            }
        }
    };

    const showConfirmationAlert = () => {
        MySwal.fire({
            title: 'तुम्हाला खात्री आहे का?',
            text: 'तुम्हाला हा डेटा सेव करायचा आहे का?',
            showCancelButton: true,
            confirmButtonColor: '#00ff00',
            confirmButtonText: 'सेव',
            cancelButtonColor: '#092C4C',
            cancelButtonText: 'नाही',
        }).then((result) => {
            if (result.isConfirmed) {
                handleFormSubmission();
            }
        });
    };

    const handleFormSubmission = async () => {
        try {
            const payload = {
                "pltaid": formData.pltaid || GUID,
                "farmername": formData.farmer,
                "regdate": formData.registrationDate || "",
                "companyid": userdetail?.companyID ? userdetail.companyID : "",
                "deptid": userdetail?.departmentID ? userdetail.departmentID : "",
                "isdeleted": data.isdeleted === 1 || data.isdeleted === true ? true : false,
                "uaid": userdetail?.uaid ? userdetail.uaid : "",
            };

            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };


            // First API Call
            const response1 = await axios.post(baseUrl.Url + "/backend/api/SP_AddUpdPlotMaster", payload, { headers });

            if (response1.status === 200) {
                const payload1 = Pdata.map((data) => ({
                    "pltdaid": data.pltdaid ? data.pltdaid : ACSPLGUID.getNew(),
                    "pltaid": formData.pltaid || GUID,
                    "plotno": data.plotNo,
                    "plotarea": data.plotArea,
                    "plotvariety": data.plotVariety,
                    "noofplants": data.noOfPlants,
                    "plottype": data.plotType,
                    "latlong": data.latLong,
                    "prondt": data.pronningDate,
                    "harvestdt": data.harvestingDate,
                    "nooffruit": data.nooffruit,
                    "expturn": data.expturn,
                    "daysharvest": data.noofdays_harvest,
                    "remark": data.remark,
                    "plotphoto": data.plot_photo || "",
                    "geolocation": data.geo_location || "",
                    "companyid": userdetail?.companyID ? userdetail.companyID : "",
                    "deptid": userdetail?.departmentID ? userdetail.departmentID : "",
                    "isdeleted": data.isdeleted === 1 || data.isdeleted === true ? true : false,
                    "uaid": userdetail?.uaid ? userdetail.uaid : "",
                }));

                const response3 = await axios.post(baseUrl.Url + "/backend/api/SP_AddUpdPlotDetails", payload1, { headers });

                if (response3.status === 200) {
                    Swal.fire({
                        icon: "success",
                        title: "सेव्ह झाले!",
                        text: "डेटा यशस्वीपणे सेव्ह झाला.",
                        confirmButtonText: "ठीक आहे",
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                    }).then((result) => {
                        if (result.isConfirmed) {

                            setFormData({
                                pltaid: '',
                                farmer: '',
                                registrationDate: ''

                            });
                            setPdata([]);
                        }
                    });
                } else {
                    throw new Error("प्लॉटचे तपशील सेव अयशस्वी.");
                }

            } else {
                throw new Error("मास्टर डेटा सेव अयशस्वी");
            }
        } catch (error) {
            console.error("Submission Error:", error);
            Swal.fire({
                icon: "error",
                title: "त्रुटी",
                text: "डेटा सेव अयशस्वी. कृपया पुन्हा प्रयत्न करा.",
                allowOutsideClick: false,
                allowEscapeKey: false,
            });
        }
    };
    // const handleChange = (e) => {
    //     const { name, value } = e.target;
    //     setFormData({ ...formData, [name]: value });

    // };


    // const handleSelectChange = (selectedOption, { name }) => {
    //         setFormData({ ...formData, [name]: selectedOption?.value || '' });

    //     };
    const handleSelectChange = (selectedOption) => {
        setPlotDetails(prevState => ({
            ...prevState,
            plotType: selectedOption ? selectedOption.value : null
        }));
    };

    const handleSelectChanges = (selectedOption) => {
        setPlotDetails({ ...PlotDetails, plotType: selectedOption.value || '' });
    };
    //keybord shortkey
    useEffect(() => {
        const handleShortcut = (e) => {
            if ((e.ctrlKey && e.key === "s") || (e.ctrlKey && e.key === "S")) {
                e.preventDefault();

                if (isFormValid()) {
                    showConfirmationAlert();
                } else {

                    if (!formData.farmer) {
                        Swal.fire({
                            icon: 'error',
                            title: 'शेतकरी आवश्यक आहे',
                            text: 'कृपया शेतकरी भरा.',
                            allowOutsideClick: false,
                            allowEscapeKey: false,
                        });
                    }

                    if (!formData.registrationDate) {
                        Swal.fire({
                            icon: 'error',
                            title: 'नोंदणी तारीख आवश्यक आहे',
                            text: 'कृपया नोंदणी तारीख भरा.',
                            allowOutsideClick: false,
                            allowEscapeKey: false,
                        });
                    }
                }
            }

            if (e.ctrlKey && e.key === "e") {
                e.preventDefault();
                showExitAlert();
            }
        };

        window.addEventListener("keydown", handleShortcut);


        return () => {
            window.removeEventListener("keydown", handleShortcut);
        };
    }, [formData]);
    const isFormValid = () => {
        const { farmer, registrationDate } = formData;

        return farmer && registrationDate;
    };

    //exit alert
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
                navigate(route.CropPlot)
            }
        });
    };

    //master data get
    useEffect(() => {
        if (!pltaid) return;
        const fetchMasterData = async () => {
            try {
                const payload1 = {
                    "pltaid": pltaid,
                    "keyword": "%",
                    "companyid": userdetail?.companyID ? userdetail.companyID : "",
                    "deptid": userdetail?.departmentID ? userdetail.departmentID : "",

                }

                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*"
                };

                const response = await axios.post(
                    baseUrl.Url + "/backend/api/GET_PlotMaster",
                    payload1,
                    { headers }
                );

                if (response.status !== 200) throw new Error("Failed to fetch data");
                let apiData = response.data[0];
                setFormData((prev) => ({
                    ...prev,
                    pltaid: apiData.pltaid,
                    farmer: apiData.farmername,
                    registrationDate: convertToISODate(apiData.regdate),

                }));

                console.log(" Master Data:", apiData);
            } catch (error) {
                console.error("Error in Master API Call:", error);
            }
        };

        const fetchPlotData = async () => {
            try {

                const payload = {
                    "pltaid": pltaid,
                    "companyid": userdetail?.companyID ? userdetail.companyID : "",
                    "deptid": userdetail?.departmentID ? userdetail.departmentID : "",

                };

                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*"
                };

                const response = await axios.post(
                    baseUrl.Url + "/backend/api/GET_PlotDetailsById",
                    payload,
                    { headers }
                );

                if (response.status !== 200) throw new Error("Failed to fetch details data");

                console.log(" Detail Data:", response.data);

                if (response.data.length > 0) {
                    const mappedProducts = response.data.map((item) => ({
                        pltdaid: item.pltdaid,
                        pltaid: item.pltaid,
                        plotNo: item.plotno,
                        plotArea: item.plotarea,
                        plotVariety: item.plotvariety,
                        noOfPlants: item.noofplants,
                        plotType: item.plottype,
                        latLong: item.latlong,
                        pronningDate: item.prondt,
                        harvestingDate: item.harvestdt,
                        nooffruit: item.nooffruit,
                        expturn: item.expturn,
                        noofdays_harvest: item.daysharvest,
                        remark: item.remark,
                        plot_photo: item.plotphoto,
                        geo_location: item.geolocation,
                        isdeleted: 0,
                    }));

                    setPdata(mappedProducts);
                }
            } catch (error) {
                console.error("Error fetching details data:", error);
            }
        };
        fetchMasterData();
        fetchPlotData();
    }, [pltaid]);


    const handleInputChange = (event) => {
        const { name, value } = event.target;

        if (name in formData) {
            setFormData({
                ...formData,
                [name]: value,

            });
        } else {
            // Handle other fields as normal (e.g., text inputs)
            setPlotDetails({
                ...PlotDetails,
                [name]: value,
            });
        }
    };

    //data add button
    const handleAddPlot = () => {
        if (!PlotDetails.plotNo || !PlotDetails.plotArea || !PlotDetails.plotVariety || !PlotDetails.harvestingDate) {
            Swal.fire({
                icon: "error",
                title: "प्रमाणीकरण त्रुटी",
                text: "कृपया सर्व फील्ड पूर्णपणे भरा.",
                allowOutsideClick: false,
                allowEscapeKey: false,

            });
            return;
        }

        if (PlotDetails.pltdaid) {
            const updatedRows = Pdata.map(row =>
                row.pltdaid === PlotDetails.pltdaid
                    ? { ...row, ...PlotDetails }
                    : row
            );
            setPdata(updatedRows);
        } else {

            setPdata([...Pdata, { ...PlotDetails, pltdaid: ACSPLGUID.getNew() }]);
        }

        console.log(Pdata, "deatil rows");

        // Reset plot details
        setPlotDetails({
            pltdaid: '',
            pltaid: '',
            plotNo: '',
            plotArea: '',
            plotVariety: '',
            noOfPlants: '',
            plotType: '',
            latLong: '',
            pronningDate: '',
            harvestingDate: '',
            nooffruit: '',
            expturn: '',
            noofdays_harvest: '',
            remark: '',
            plot_photo: '',
            geo_location: '',
            isdeleted: 0,
        });
    };


    //edit
    //PlotDetails
    const handlePlotEdit = (pltdaid) => {
        console.log("Editing row with pltdaid:", pltdaid);

        const filteredProduct = Pdata.find((row) => row.pltdaid === pltdaid);

        if (filteredProduct) {
            const formattedPronningDate = new Date(filteredProduct.pronningDate).toISOString().split("T")[0];
            const formattedHarvestingDate = new Date(filteredProduct.harvestingDate).toISOString().split("T")[0];
            setPlotDetails({
                pltdaid: filteredProduct.pltdaid,
                pltaid: filteredProduct.pltaid,
                plotNo: filteredProduct.plotNo,
                plotArea: filteredProduct.plotArea,
                plotVariety: filteredProduct.plotVariety,
                noOfPlants: filteredProduct.noOfPlants,
                plotType: filteredProduct.plotType,
                latLong: filteredProduct.latLong,
                pronningDate: formattedPronningDate,
                harvestingDate: formattedHarvestingDate,
                nooffruit: filteredProduct.nooffruit,
                expturn: filteredProduct.expturn,
                noofdays_harvest: filteredProduct.noofdays_harvest,
                remark: filteredProduct.remark,
                plot_photo: filteredProduct.plot_photo,
                geo_location: filteredProduct.geo_location,
                isdeleted: 0,
            });
        }
    };

    // const checkFormValidity = (e) => {
    //     const {
    //     farmer,
    //     registrationDate

    //     } = formData;

    //     // Check for each field and show validation errors
    //     if (!farmer) {
    //         Swal.fire({
    //             icon: "error",
    //             title: "Validation Error",
    //             text: " शेतकरी आवश्यक आहे ",
    //         }).then(() => {
    //             FARMERRef.current.focus();
    //         });
    //         return;
    //     }

    //     if (!registrationDate) {
    //         Swal.fire({
    //             icon: "error",
    //             title: "Validation Error",
    //             text: "नोंदणी तारीख आवश्यक आहे",

    //         }).then(() => {
    //             registrationDateRef.current.focus();
    //         });
    //         return;
    //     }

    //  handleSubmit(e);
    // };




    //delete
    const handlePlotDelete = (pltdaid) => {
        Swal.fire({
            title: "आपल्याला नक्कीच खात्री आहे का?",
            text: "हे बदल परत करता येणार नाही!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "हो, हटवा!",
            cancelButtonText: "रद्द करा",

        }).then((result) => {
            if (result.isConfirmed) {
                setPdata((prevRows) => {
                    const updatedRows = prevRows.map((row) =>
                        row.pltdaid === pltdaid ? { ...row, isdeleted: 1 } : row
                    );
                    console.log("Updated Rows:", updatedRows);
                    return updatedRows;
                });

                Swal.fire({
                    icon: "success",
                    title: "रेकॉर्ड हटवला गेला!",
                    text: "रेकॉर्ड यशस्वीरित्या हटवला गेला आहे.",
                    confirmButtonText: "ठीक आहे",
                });
            }
        });
    };
    //set farmer dropdown
    const [farmer, setfarmer] = useState([]);
    useEffect(() => {
        const fetchCounter = async () => {
            try {
                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };

                const payload = {
                    companyid: "",
                };

                const response = await axios.post(
                    `${baseUrl.Url}/backend/api/GET_FarmerName`,
                    payload,
                    { headers }
                );
                if (response.status !== 200)
                    throw new Error("Failed to fetch vendor data");
                console.log("requisition setails", response.data)
                const data = response.data;
                const conuterData = data
                    .map(({ fname, faid }) => ({
                        label: fname,
                        value: faid
                    }));

                setfarmer(conuterData);
            } catch (error) {
                console.error("Error fetching vendor data:", error);
            }
        };
        fetchCounter();
    }, []);

    //upload

    const uploadProfile = async (fileData, finalFileName) => {
        const PlotDetails = new FormData();
        PlotDetails.append("Files", fileData);
        PlotDetails.append("FileNames", finalFileName);
        PlotDetails.append("FileSizeInBytes", fileData.size);
        PlotDetails.append("FilePath", `/Images/${finalFileName}`);
        PlotDetails.append("FileDescription", "Profile Image");

        const messageContainer = document.getElementById("messageContainer");

        try {
            const response = await axios.post(
                `${baseUrl.Url}/backend/api/ProfileUpload/Upload`,
                PlotDetails,
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

    const generatedID = ACSPLGUID?.getNew();
    const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };
    const openModalWithImage = (imageName) => {
        // Assuming the base URL points to where images are stored on the server
        const fileUrl = `${baseUrl.Url}/Images/${imageName}`;
        console.log("Image URL:", fileUrl); // Make sure the file path is correct
        setImagePreviewUrl(fileUrl);
        setIsModalOpen(true);
    };


    const [selectedFile, setSelectedFile] = useState(null);
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

            setPlotDetails({ ...PlotDetails, plot_photo: finalFileName });

            const fileUrl = URL.createObjectURL(file);
            setImagePreviewUrl(fileUrl);

            uploadProfile(file, finalFileName);
        }
    };
    return (
        <div className="page-wrapper">
            <div className="content">
                <div className="page-header">
                    <div className="add-item d-flex">
                        <div className="page-title">
                            <h4>प्लॉट तपशील</h4>
                            <h6>नवीन प्लॉट तपशील तयार करा</h6>
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
                        <Link onClick={showExitAlert} className="btn btn-secondary">
                            <ArrowLeft className="me-2" />
                            मागे
                        </Link>
                    </div>
                </div>
                {/* /add */}

                <form onSubmit={handleSubmit}>
                    <div className="card">
                        <div className="card-body add-product mbgcolor">
                            <div className="accordion-card-one accordion" id="accordionExample">


                                <div className="accordion-item mbgcolor">
                                    <div className="" id="headingOne">
                                        <div
                                            className=""
                                            data-bs-toggle="collapse"
                                            data-bs-target="#collapseOne"
                                            aria-controls="collapseOne"
                                        >
                                            <div className="addproduct-icon ">
                                                <h5 >
                                                    <Info className="add-info" />

                                                    <span>Plot(Master)</span>
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

                                            <div className='row'>
                                                <div className="col-lg-4 col-md-3 col-sm-6 mb-3">
                                                    <div className="mb-0 form-label">
                                                        <label className='required'>शेतकरी
                                                        </label>
                                                        {/* <Select
                                                            ref={FARMERRef}
                                                            placeholder="Select Counter"
                                                            className="react-select"
                                                            options={farmer}  // Your options for vyapari
                                                            name="farmer"
                                                            openMenuOnFocus={true}
                                                            value={farmer.find(option => option.label === formData.farmer) || null}  // Find based on value
                                                            onChange={(selectedOption) => {
                                                                // Update the vyapariName in the detailData state
                                                                setFormData(prevState => ({
                                                                    ...prevState,
                                                                    pltaid: selectedOption ? selectedOption.value : '',
                                                                    farmer: selectedOption ? selectedOption.label : '',
                                                                }));

                                                                //Move focus to the next field(SCDQUANTITYRef)
                                                                if (registrationDateRef.current) {
                                                                    registrationDateRef.current.focus();
                                                                }
                                                            }}

                                                        /> */}

                                                        <Select
                                                            ref={FARMERRef}
                                                            placeholder="Select Counter"
                                                            classNamePrefix="react-select"
                                                            options={farmer}
                                                            value={farmer.find(option => option.label === formData.farmer) || null}  // Find based on value
                                                            onChange={(selectedOption) => {

                                                                setFormData(prevState => ({
                                                                    ...prevState,
                                                                    pltaid: selectedOption ? selectedOption.value : '',
                                                                    farmer: selectedOption ? selectedOption.label : '',
                                                                }));


                                                                if (registrationDateRef.current) {
                                                                    registrationDateRef.current.focus();
                                                                }
                                                            }}
                                                            onKeyDown={(e) => handleKeyDown(e, registrationDateRef)}
                                                            openMenuOnFocus={true}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-3 col-md-3 col-sm-6">
                                                    <label className='form-label required'>नोंदणी तारीख</label>
                                                    <input
                                                        type="date"
                                                        className="form-control"
                                                        name="registrationDate"
                                                        value={formData.registrationDate}
                                                        onChange={handleInputChange}
                                                        ref={registrationDateRef}
                                                        onKeyDown={(e) => handleKeyDown(e, plotNoRef)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>



                                {/* start Purchase Requisition(Detail) */}
                                <div className="container border p-4 rounded shadow-sm dbgcolor">
                                    {/* Table Section */}
                                    <div className="modal-body-table mb-4">
                                        <div className="table-responsive">
                                            <table className="table table-bordered">
                                                <thead className="thead-dark">
                                                    <tr>
                                                        <th className="col-3" style={{ position: 'sticky', top: 0 }} >प्लॉट क्रमांक/नाव </th>
                                                        <th className="col-1" style={{ position: 'sticky', top: 0 }}>प्लॉट क्षेत्र</th>
                                                        <th className="col-1" style={{ position: 'sticky', top: 0 }}>प्लॉट व्हरायटी </th>
                                                        <th className="col-1" style={{ position: 'sticky', top: 0 }}>कापणी दिनांक</th>
                                                        <th className="col-1 text-center" style={{ position: 'sticky', top: 0 }}>कृती</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {Pdata.filter((row) => row.isdeleted == 0 || row.isdeleted == false).length > 0 ? (
                                                        Pdata
                                                            .filter((row) => row.isdeleted == 0)
                                                            .map((row, index) => (
                                                                <tr key={row.pltdaid || index}>
                                                                    <td>{row.plotNo}</td>
                                                                    <td>{row.plotArea}</td>
                                                                    <td>{row.plotVariety}</td>
                                                                    <td>{row.harvestingDate}</td>

                                                                    <td>
                                                                        <Link
                                                                            to="#"
                                                                            onClick={() => handlePlotEdit(row.pltdaid)}
                                                                            className="me-2 p-1"
                                                                            style={{ color: 'lightblue' }}
                                                                        >
                                                                            <Edit className="feather-edit" />
                                                                        </Link>
                                                                        <Link
                                                                            className="confirm-text p-2"
                                                                            to="#"
                                                                            onClick={() => handlePlotDelete(row.pltdaid)}
                                                                        >
                                                                            <Trash2 className="feather-trash-2 text-danger" />
                                                                        </Link>
                                                                    </td>
                                                                </tr>
                                                            ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan="5">डेटा उपलब्ध नाही</td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    {/* Form Section */}
                                    {/* <form onSubmit={handleSubmit}> */}

                                    <div className="accordion-card-one accordion" id="accordionExample">

                                        <div className="row">


                                            <div className="col-lg-5 col-md-3 col-sm-6 mb-3">
                                                <div className="mb-0 add-product form-label">
                                                    <label className='form-label required'>प्लॉट क्रमांक/नाव </label>
                                                    <input
                                                        type="text"
                                                        className="form-control border"
                                                        name="plotNo"
                                                        value={PlotDetails.plotNo}
                                                        onChange={handleInputChange}
                                                        ref={plotNoRef}
                                                        onKeyDown={(e) => handleKeyDown(e, plotAreaRef)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-lg-2 col-md-3 col-sm-6 mb-3">
                                                <div className="mb-0 add-product form-label">
                                                    <label className='form-label required'>प्लॉट क्षेत्र</label>
                                                    <input type="text" className="form-control border"
                                                        name="plotArea"
                                                        value={PlotDetails.plotArea}
                                                        onChange={handleInputChange}
                                                        ref={plotAreaRef}
                                                        onKeyDown={(e) => handleKeyDown(e, plotVarietyRef)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-lg-3 col-md-3 col-sm-6 mb-3">
                                                <div className="mb-0 add-product form-label">
                                                    <label className='form-label required'>प्लॉट व्हरायटी </label>
                                                    <input type="text" className="form-control border"
                                                        name="plotVariety" value={PlotDetails.plotVariety}
                                                        onChange={handleInputChange}
                                                        ref={plotVarietyRef}
                                                        onKeyDown={(e) => handleKeyDown(e, noOfPlantsRef)} />
                                                </div>
                                            </div>
                                            <div className="col-lg-2 col-md-3 col-sm-6">
                                                <div className="mb-0 add-product form-label">
                                                    <label className='form-label'>रोपांची संख्या</label>
                                                    <input type="text" className="form-control border"
                                                        name="noOfPlants"
                                                        value={PlotDetails.noOfPlants}
                                                        onChange={handleInputChange}
                                                        ref={noOfPlantsRef}
                                                        onKeyDown={(e) => handleKeyDown(e, plotTypeRef)} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className='row'>


                                            {/* <div className="col-lg-4 col-md-3 col-sm-6 mb-3">
                                                <div className="mb-3">
                                                    <label className="form-label required">प्लॉट प्रकार</label>
                                                    <Select
                                                        classNamePrefix="react-select"
                                                        placeholder="Choose"
                                                        openMenuOnFocus={true}
                                                        name="plotType"
                                                        value={{
                                                            value: PlotDetails.plotType,
                                                            label: PlotDetails.plotType || 'Choose'
                                                        }}
                                                        onChange={handleSelectChanges}
                                                        options={[
                                                            { value: 'Traditional Orchard Plot', label: 'Traditional Orchard Plot' },
                                                            { value: 'High-Density Plantation Plot', label: 'High-Density Plantation Plot' },
                                                            { value: 'Organic Farming Plot', label: 'Organic Farming Plot' }
                                                        ]}
                                                        className="react-select-container"
                                                        ref={plotTypeRef}
                                                        onKeyDown={(e) => handleKeyDown(e, expturnRef)}
                                                    />
                                                </div>
                                            </div> */}
                                            <div className="col-lg-4 col-md-3 col-sm-6 mb-3">
                                                <div className="mb-3">
                                                    <label className="form-label required">प्लॉट प्रकार</label>

                                                    <Select
                                                        // ref={CROP_TYPERef}
                                                        classNamePrefix="react-select"
                                                        options={Crop_TYPE}
                                                        ref={plotTypeRef}
                                                        onKeyDown={(e) => handleKeyDown(e, expturnRef)}
                                                        // value={Crop_TYPE.find(option => option.value == detailData.crop_type) || null}
                                                        value={Crop_TYPE.find(option => String(option.value) === String(PlotDetails.plotType)) || null}
                                                        onChange={(selectedOption) => {
                                                            handleSelectChange(selectedOption);
                                                            setPlotDetails(prev => ({
                                                                ...prev,
                                                                plotType: selectedOption?.value || ""
                                                            }));

                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-lg-2 col-md-3 col-sm-6">
                                                <div className="mb-0 add-product form-label">
                                                    <label className='form-label'>अपेक्षित उत्पन्न </label>
                                                    <input type="text" className="form-control border"
                                                        name="expturn"
                                                        value={PlotDetails.expturn}

                                                        onChange={handleInputChange}
                                                        ref={expturnRef}
                                                        onKeyDown={(e) => handleKeyDown(e, pronningDateRef)} />
                                                </div>
                                            </div>
                                            <div className="col-lg-2 col-sm-6 col-12 mb-3">
                                                <div className="mb-0 add-product form-label">
                                                    <label className='form-labelrequired'>छाटणी तारीख</label>
                                                    <input type="date" className="form-control"
                                                        name="pronningDate"
                                                        value={PlotDetails.pronningDate}
                                                        ref={pronningDateRef}
                                                        onChange={(e) => setPlotDetails({ ...PlotDetails, pronningDate: e.target.value })}
                                                        onKeyDown={(e) => handleKeyDown(e, harvestingDateRef)} />
                                                </div>
                                            </div>
                                            <div className="col-lg-2   col-sm-6 col-12 mb-3">
                                                <div className="mb-0 add-product form-label">
                                                    <label className='form-labelrequired'>कापणी तारीख</label>
                                                    <input type="date" className="form-control"
                                                        name="harvestingDate"
                                                        value={PlotDetails.harvestingDate}
                                                        ref={harvestingDateRef}
                                                        onChange={(e) => setPlotDetails({ ...PlotDetails, harvestingDate: e.target.value })}
                                                        onKeyDown={(e) => handleKeyDown(e, nooffruitRef)} />
                                                </div>
                                            </div>
                                            <div className="col-lg-2 col-md-3 col-sm-6">
                                                <div className="mb-0 add-product form-label">
                                                    <label className='form-label'>रोपावरील फळसंख्या</label>
                                                    <input type="text" className="form-control border"
                                                        name="nooffruit"
                                                        value={PlotDetails.nooffruit}
                                                        ref={nooffruitRef}
                                                        onChange={handleInputChange}
                                                        onKeyDown={(e) => handleKeyDown(e, daysharvestRef)} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className='row'>
                                            <div className="col-lg-3 col-md-3 col-sm-6 mb-3">
                                                <div className="mb-0 add-product form-label">
                                                    <label className='form-label'>काढणीसाठी आवश्यक दिवस</label>
                                                    <input type="text" className="form-control border"
                                                        name="noofdays_harvest"
                                                        value={PlotDetails.noofdays_harvest}
                                                        ref={daysharvestRef}
                                                        onChange={handleInputChange}
                                                        onKeyDown={(e) => handleKeyDown(e, remarkRef)} />
                                                </div>
                                            </div>
                                            <div className="col-lg-9 col-md-3 col-sm-6 mb-3">
                                                <div className="mb-0 add-product form-label">
                                                    <label className='form-label'>निरीक्षण </label>
                                                    <input type="text" className="form-control "
                                                        name="remark"
                                                        value={PlotDetails.remark}
                                                        ref={remarkRef}
                                                        onChange={handleInputChange}
                                                        onKeyDown={(e) => handleKeyDown(e, geo_locationRef)}
                                                    />
                                                </div>
                                            </div>
                                        </div>


                                        <div className="row">
                                            <div className="col-lg-6 col-md-3 col-sm-6 mb-3">
                                                <div className="mb-0 add-product form-label">
                                                    <label className='form-label'>भौगोलिक स्थान</label>
                                                    <input type="text" className="form-control border"
                                                        name="geo_location"
                                                        value={PlotDetails.geo_location}
                                                        ref={geo_locationRef}
                                                        onChange={handleInputChange}
                                                        onKeyDown={(e) => handleKeyDown(e, photoref)} />
                                                </div>
                                            </div>
                                            <div className="col-lg-6 mb-3">
                                                <div className="mb-0 add-product form-label">
                                                    <label className="form-label">
                                                        प्लॉटचा फोटो
                                                        {PlotDetails.plot_photo && (
                                                            <span style={{ color: 'green', fontSize: '14px', fontWeight: 'bold', marginLeft: '5px' }}>
                                                                ✔ Uploaded:
                                                            </span>
                                                        )}
                                                        {PlotDetails.plot_photo && (
                                                            <span
                                                                className="ms-2"
                                                                style={{ color: 'green', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline' }}
                                                                onClick={() => openModalWithImage(PlotDetails.plot_photo)} // Trigger modal on filename click
                                                            >

                                                                {PlotDetails.plot_photo.split('\\').pop().split('_').pop()}
                                                            </span>
                                                        )}
                                                    </label>

                                                    <input
                                                        className="form-control border"
                                                        type="file"
                                                        name="plot_photo"
                                                        ref={photoref}
                                                        onKeyDown={(e) => handleKeyDown(e, latLongRef)}
                                                        onChange={handleFileChange}
                                                    />
                                                    <i
                                                        className="fas fa-eye position-absolute"
                                                        style={{
                                                            right: '55px',

                                                            top: '68%',
                                                            transform: 'translateY(-50%)',
                                                            cursor: 'pointer',
                                                        }}
                                                        onClick={openModal}
                                                    ></i>
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
                                            </div>
                                        </div>
                                        <div className="col-lg-12 col-md-3 col-sm-6 mb-3">
                                            <div className="mb-0 add-product form-label">
                                                <label className='form-label'>रेखांश/अक्षांश </label>
                                                <input type="text" className="form-control border"
                                                    name="latLong"
                                                    value={PlotDetails.latLong}
                                                    onChange={handleInputChange}
                                                    ref={latLongRef}
                                                    onKeyDown={(e) => {
                                                        const isDropdownOpen = document.activeElement.getAttribute('aria-expanded') === 'true';


                                                        if (e.key === 'Enter' && !isDropdownOpen) {
                                                            e.preventDefault();
                                                            handleAddPlot(); // Trigger form submission or add plot
                                                            showConfirmationAlert(e);
                                                        }
                                                    }} />
                                            </div>
                                        </div>

                                    </div>
                                    <div className="d-flex justify-content-end">
                                        <div className="mb-3">
                                            <button type="button" className="btn btn-primary" onClick={handleAddPlot} ref={AddRef}>
                                                जोडा
                                            </button>
                                        </div>
                                    </div>
                                    {/* </form> */}

                                </div>

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
                                            सेव्ह
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
                {/* /add */}
            </div>
            <Addunits />
            <AddCategory />
            <AddBrand />
        </div>



    );
};

export default AddCropPlot;
