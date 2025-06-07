import React, { useState, useEffect, useRef } from 'react';
import Select from "react-select";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ChevronUp, Info, ArrowLeft } from "feather-icons-react/build/IconComponents";
import { useDispatch, useSelector } from "react-redux";
import { setToogleHeader } from "../../core/redux/action";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { all_routes } from "../../Router/all_routes";
import { ACSPLGUID, baseUrl } from "../../core/json/custom";
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from "sweetalert2-react-content";
import { getUserData } from "../../Context/UserData";

const AddRackMaster = () => {

    const { isAuthenticated, userdetail } = getUserData();
    const location = useLocation();
    const { RAID } = location.state || {};

    console.log('ROW ID', RAID);



    const RCODERef = useRef();
    const RROWNUMBERRef = useRef();
    const RNUMBERRef = useRef();
    const RSHELFRef = useRef();
    const RTYPERef = useRef(null);
    const DescriptionRef = useRef(null);
    const submitRef = useRef();

    const route = all_routes;
    const dispatch = useDispatch();
    const data = useSelector((state) => state.toggle_header);
    const GUID = ACSPLGUID.getNew();

    const navigate = useNavigate();

    const renderCollapseTooltip = (props) => (
        <Tooltip id="refresh-tooltip" {...props}>
            Collapse
        </Tooltip>
    );
    if (isAuthenticated == true) {
        console.log("user", userdetail);
        console.log("getUserData", getUserData);
    }

    // const validateinput = (e) => {

    //     const { RCODE } = formData;
    //     if (!RCODE || !/^(?![\s\t\n\r])([A-Za-z0-9\s]+)$/.test(RCODE)) {
    //         Swal.fire({
    //             icon: "error",
    //             title: "Validation Error",
    //             text: "Rack Code must be a valid number without leading spaces.",
    //         }).then(() => {
    //             RCODERef.current.focus();
    //         })
    //         return;
    //     }
    //     const { RTYPE } = formData;
    //     if (!RTYPE || RTYPE === "") {
    //         Swal.fire({
    //             icon: "error",
    //             title: "Validation Error",
    //             text: "Rack Location must be selected.",
    //         }).then(() => {
    //             // Focus on the dropdown select element for the user to correct their selection
    //             RTYPERef.current.focus();
    //         });
    //         return;
    //     }
    //     const { RROWNUMBER } = formData;
    //     if (!RROWNUMBER || !/^(?![\s\t\n\r])([A-Za-z0-9\s]+)$/.test(RROWNUMBER)) {
    //         Swal.fire({
    //             icon: "error",
    //             title: "Validation Error",
    //             text: "Rack Row Number must be a valid number without leading spaces.",
    //         }).then(() => {
    //             RROWNUMBERRef.current.focus();
    //         })
    //         return;
    //     }
    //     const { RNUMBER } = formData;
    //     if (!RNUMBER || !/^(?![\s\t\n\r])([A-Za-z0-9\s]+)$/.test(RNUMBER)) {
    //         Swal.fire({
    //             icon: "error",
    //             title: "Validation Error",
    //             text: "Rack Number must be a valid number without leading spaces.",
    //         }).then(() => {
    //             RNUMBERRef.current.focus();
    //         })
    //         return;
    //     }
    //     handleSubmit(e);
    // }

    const validateinput = (e) => {
        const devanagariRegex = /^[\u0900-\u097F\u0020A-Za-z0-9]+$/; // Marathi + English + space
        const noLeadingWhitespaceRegex = /^(?![\s\t\n\r])/;

        const { RCODE } = formData;
        if (!RCODE || !noLeadingWhitespaceRegex.test(RCODE) || !devanagariRegex.test(RCODE)) {
            Swal.fire({
                icon: "error",
                title: "चूक तपासा",
                text: "रॅक कोड वैध असणे आवश्यक आहे आणि सुरुवातीला रिकामी जागा असू नये.",
                allowOutsideClick: false,
                allowEscapeKey: false,
            }).then(() => {
                RCODERef.current.focus();
            });
            return;
        }

        const { RTYPE } = formData;
        if (!RTYPE || RTYPE === "") {
            Swal.fire({
                icon: "error",
                title: "चूक तपासा",
                text: "कृपया रॅकचे स्थान निवडा.",
                allowOutsideClick: false,
                allowEscapeKey: false,
            }).then(() => {
                RTYPERef.current.focus();
            });
            return;
        }

        const { RROWNUMBER } = formData;
        if (!RROWNUMBER || !noLeadingWhitespaceRegex.test(RROWNUMBER) || !devanagariRegex.test(RROWNUMBER)) {
            Swal.fire({
                icon: "error",
                title: "चूक तपासा",
                text: "रॅक रो क्रमांक वैध असावा आणि सुरुवातीला रिकामी जागा असू नये.",
                allowOutsideClick: false,
                allowEscapeKey: false,
            }).then(() => {
                RROWNUMBERRef.current.focus();
            });
            return;
        }

        const { RNUMBER } = formData;
        if (!RNUMBER || !noLeadingWhitespaceRegex.test(RNUMBER) || !devanagariRegex.test(RNUMBER)) {
            Swal.fire({
                icon: "error",
                title: "चूक तपासा",
                text: "रॅक क्रमांक वैध असावा आणि सुरुवातीला रिकामी जागा असू नये.",
                allowOutsideClick: false,
                allowEscapeKey: false,
            }).then(() => {
                RNUMBERRef.current.focus();
            });
            return;
        }


        handleSubmit(e);
    }




    useEffect(() => {
        // Focus on the Warehouse ID input field
        if (RCODERef.current) {
            RCODERef.current.focus();
        }
    }, []); // Runs only on the initial render


    const [formData, setFormData] = useState({
        RCODE: '',
        RTYPE: '',
        RROWNUMBER: '',
        RNUMBER: '',
        RSHELF: '',
        RDESCRIPTION: '',
    });



    useEffect(() => {
        if (RAID) {
            const fetchData = async () => {
                try {
                    const payload = {
                        "pkid": RAID
                        , "keyword": "%"
                        , "companyid": userdetail?.companyID ? userdetail.companyID : "",
                        "deptid": userdetail?.departmentID ? userdetail.departmentID : "",
                    }
                    const headers = {
                        "Content-Type": "application/json",
                        Accept: "*/*",
                    };

                    axios({
                        method: "POST",
                        url: baseUrl.Url + "/backend/api/_GET_RackMaster_/getByID",
                        data: JSON.stringify(payload),
                        headers: headers,
                    })
                        .then((response) => {
                            if (response.status != 200) throw new Error("Failed to send otp");
                            const Hdata = response.data[0];
                            setFormData({
                                RCODE: Hdata.rcode,
                                RTYPE: Hdata.rtype,
                                RROWNUMBER: Hdata.rrownumber,
                                RNUMBER: Hdata.rnumber,
                                RSHELF: Hdata.rshelf,
                                RDESCRIPTION: Hdata.rdescription,
                            });
                        })

                } catch (error) {
                    console.error("Error fetching HSN data:", error);
                }

            };
            fetchData();
        }
    }, [RAID]);

    // const [successMessage, setSuccessMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));

    };

    // const handleSelectChange = (selectedOption) => {
    //     setFormData((prevData) => ({
    //         ...prevData,
    //         RTYPE: selectedOption ? selectedOption.value : "",
    //     }));

    // };



    const handleSubmit = (event) => {
        event.preventDefault();
        showConfirmationAlert(event);
    };

    const handleFormSubmission = async () => {
        try {
            const payload = {
                "raid": RAID ? RAID : GUID,
                "rtype": formData.RTYPE,
                "rdescription": formData.RDESCRIPTION,
                "rcode": formData.RCODE,
                "rrownumber": formData.RROWNUMBER,
                "rnumber": formData.RNUMBER,
                "rshelf": formData.RSHELF,
                "companyid": userdetail?.companyID ? userdetail.companyID : "",
                "deptid": userdetail?.departmentID ? userdetail.departmentID : "",
            };

            console.log("rack master", payload)
            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            axios({
                method: "POST",
                url: baseUrl.Url + "/backend/api/RackMaster",
                data: JSON.stringify(payload),
                headers: headers,
            })
            // console.log("API Response:", response.data);

            Swal.fire({
                icon: "success",
                title: "साठवले!",
                text: "माहिती यशस्वीरित्या जतन झाली.",
                confirmButtonText: "ठीक आहे",
                allowOutsideClick: false,
                allowEscapeKey: false,
            });


            navigate(route.RackMaster);
        } catch (error) {
            console.error("Submission Error:", error);
            Swal.fire({
                icon: "error",
                title: "त्रुटी",
                text: "माहिती जतन करण्यात अयशस्वी. कृपया पुन्हा प्रयत्न करा.",
                allowOutsideClick: false,
                allowEscapeKey: false,
            });
        }

    };



    const [implications, setImplications] = useState({
        rackTypes: [],
    });



    useEffect(() => {

        const fetchImplications = async () => {
            try {

                const response = await axios.get(
                    baseUrl.Url + "/backend/api/Implications/RACKTYPE"
                );

                if (response.status != 200)
                    throw new Error("Failed to fetch social media data");

                const data = await response.data;

                const rackTypes = data
                    .filter((item) => item.iGroup === "RACKTYPE")
                    .map(({ iTitle, iValue }) => ({
                        label: iTitle,
                        value: iValue,
                    }));

                console.log("rack implication", rackTypes)


                setImplications({
                    rackTypes,

                });
            } catch (error) {
                console.error("Error fetching implications:", error);
            }
        };

        fetchImplications();
    }, []);


    useEffect(() => {
        const handleShortcut = (e) => {

            if (e.ctrlKey && e.key === 'e' || e.ctrlKey && e.key === 'E') {
                e.preventDefault();
                showExitAlert();
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
    const MySwal = withReactContent(Swal);
    const showConfirmationAlert = (event) => {
        MySwal.fire({
            title: "आपण नक्कीच इच्छिता?",
            text: "आपण ही माहिती जतन करू इच्छिता?",
            showCancelButton: true,
            confirmButtonColor: "#00ff00",
            confirmButtonText: "जतन करा",
            cancelButtonColor: "#092C4C",
            cancelButtonText: "रद्द करा",
            allowOutsideClick: false,
            allowEscapeKey: false,
        }).then((result) => {
            if (result.isConfirmed) {
                handleFormSubmission(event); // Proceed with form submission
            }
        });
    };
    const showExitAlert = () => {
        MySwal.fire({
            title: "आपण नक्कीच इच्छिता?",
            text: "आपण बाहेर पडू इच्छिता?",
            showCancelButton: true,
            confirmButtonColor: "#00ff00",
            confirmButtonText: "होय",
            cancelButtonColor: "#092C4C",
            cancelButtonText: "नाही",
            allowOutsideClick: false,
            allowEscapeKey: false,
        }).then((result) => {
            if (result.isConfirmed) {
                navigate(route.RackMaster)
            }
        });
    };


    const handleEnterKey = (e, nextRef) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (nextRef && nextRef.current) {
                nextRef.current.focus();
            }
        }
    };

    return (
        <div className="page-wrapper">
            <div className="content">
                <div className="page-header">
                    <div className="add-item d-flex">
                        <div className="page-title">
                            <h4>रॅक व्यवस्थापन</h4>
                            <h6>रॅक तयार करा</h6>
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
                        <Link to={route.RackMaster} className="btn btn-secondary">
                            <ArrowLeft className="me-2" />
                            मागे
                        </Link>
                    </div>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="card mbgcolor">
                        <div className="card-body add-product">
                            <div className="accordion-card-one accordion" id="accordionExample">
                                <div className="accordion-item mbgcolor">
                                    <div className="accordion-header" id="headingOne">
                                        <div className="" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-controls="collapseOne">
                                            <div className="addproduct-icon">
                                                <h5>
                                                    <Info className="add-info" />
                                                    <span>रॅक व्यवस्थापन</span>
                                                </h5>
                                                <Link to="#">
                                                    <ChevronUp className="chevron-down-add" />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                    <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                                        <div className="accordion-body">
                                            <div className="row">
                                                <div className="col-lg-4 col-sm-6 col-12">
                                                    <div className="mb-3 add-product">
                                                        <label className='required form-label'>रॅक कोड</label>
                                                        <input
                                                            ref={RCODERef}
                                                            type="text"
                                                            className="form-control"
                                                            name="RCODE"
                                                            value={formData.RCODE}
                                                            placeholder="नंबर प्रविष्ट करा"
                                                            onChange={handleChange}
                                                            required
                                                            onKeyDown={(e) => handleEnterKey(e, RTYPERef)}
                                                            pattern="^(?![\s\t\n\r])[\u0900-\u097FA-Za-z0-9\s]+$"
                                                            title="रॅक आयडी वैध असावा आणि सुरुवातीला स्पेस नसावी."
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-4 col-sm-6 col-12">
                                                    <div className="mb-3 add-product">
                                                        <label className='required form-label'>रॅक स्थान</label>
                                                        <Select
                                                            ref={RTYPERef}
                                                            classNamePrefix="react-select"
                                                            options={implications.rackTypes}
                                                            value={implications.rackTypes.find(option => option.value === formData.RTYPE) || null}
                                                            onChange={(selectedOption) => {
                                                                setFormData((prevData) => ({
                                                                    ...prevData,
                                                                    RTYPE: selectedOption ? selectedOption.value : "",
                                                                }));
                                                                if (RROWNUMBERRef.current) {
                                                                    RROWNUMBERRef.current.focus();
                                                                }
                                                            }}
                                                            placeholder="निवडा"
                                                            isSearchable
                                                            required
                                                            openMenuOnFocus={true}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-lg-4 col-sm-6 col-12">
                                                    <div className="mb-3 add-product">
                                                        <label className='required form-label'>रॅक रो क्रमांक</label>
                                                        <input
                                                            ref={RROWNUMBERRef}
                                                            type="text"
                                                            className="form-control"
                                                            name="RROWNUMBER"
                                                            value={formData.RROWNUMBER}
                                                            placeholder="नंबर प्रविष्ट करा"
                                                            onChange={handleChange}
                                                            onKeyDown={(e) => handleEnterKey(e, RNUMBERRef)}
                                                            required
                                                            pattern="^(?![\s\t\n\r])[\u0900-\u097FA-Za-z0-9\s]+$"
                                                            title="रॅक रो क्रमांक वैध असावा आणि सुरुवातीला स्पेस नसावी."
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-lg-4 col-sm-6 col-12">
                                                    <div className="mb-3 add-product">
                                                        <label className='required form-label'>रॅक क्रमांक</label>
                                                        <input
                                                            ref={RNUMBERRef}
                                                            type="text"
                                                            className="form-control"
                                                            name="RNUMBER"
                                                            value={formData.RNUMBER}
                                                            placeholder="नंबर प्रविष्ट करा"
                                                            onChange={handleChange}
                                                            onKeyDown={(e) => handleEnterKey(e, RSHELFRef)}
                                                            required
                                                            pattern="^(?![\s\t\n\r])[\u0900-\u097FA-Za-z0-9\s]+$"
                                                            title="रॅक क्रमांक वैध असावा आणि सुरुवातीला स्पेस नसावी."
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-4 col-sm-6 col-12">
                                                    <div className="mb-3 add-product">
                                                        <label className='form-label'>रॅक शेल्फ</label>
                                                        <input
                                                            ref={RSHELFRef}
                                                            type="text"
                                                            className="form-control"
                                                            name="RSHELF"
                                                            value={formData.RSHELF}
                                                            onChange={handleChange}
                                                            onKeyDown={(e) => handleEnterKey(e, DescriptionRef)}
                                                            placeholder="नंबर प्रविष्ट करा"
                                                            pattern="^(?![\s\t\n\r])[\u0900-\u097FA-Za-z0-9\s]+$"
                                                            title="रॅक शेल्फ वैध असावा आणि सुरुवातीला स्पेस नसावी."
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <div className="add-product mt-2">
                                                    <label className='form-label'>वर्णन</label>
                                                    <textarea
                                                        rows={5}
                                                        cols={5}
                                                        type="text"
                                                        className="form-control"
                                                        name="RDESCRIPTION"
                                                        value={formData.RDESCRIPTION}
                                                        onChange={handleChange}
                                                        placeholder="माहिती लिहा"
                                                        ref={DescriptionRef}
                                                        onKeyDown={(e) => handleEnterKey(e, submitRef)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-lg-12">
                                                <div className="btn-addproduct mt-4">
                                                    <button type="button"
                                                        onClick={showExitAlert}
                                                        className="btn btn-cancel me-2">
                                                        मागे
                                                    </button>
                                                    <button type="submit" className="btn btn-submit"
                                                        ref={submitRef}>
                                                        सेव्ह
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

export default AddRackMaster;
