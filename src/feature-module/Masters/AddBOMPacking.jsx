
// import { Calendar } from "feather-icons-react/build/IconComponents";
import { useNavigate } from 'react-router-dom';
import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
// import { useLocation } from 'react-router-dom';

import {
    ArrowLeft,
    Trash2,
} from "feather-icons-react/build/IconComponents";
import { ACSPLGUID, baseUrl } from "../../core/json/custom";
import axios from "axios";
import { all_routes } from "../../Router/all_routes";
import { getUserData } from "../../Context/UserData";
function AddBOMPacking({ BAID }) {
    const { userdetail } = getUserData();
    // const routes = all_routes;
    const route = all_routes;
    // const location = useLocation();
    // const { BAID } = location.state || {};
    // const Location = useLocation();
    const navigate = useNavigate();
    // const GUAID = ACSPLGUID.getNew()
    // const GUID = ACSPLGUID.getNew();

    const PAIDRef = useRef(null);
    const UOMRef = useRef(null);
    const QUANTITYRef = useRef(null);
    const BOMPACKINGRef = useRef(null);
    const PCAIDRef = useRef(null);

    const [product, setproduct] = useState([]);
    const [uom, setuom] = useState([]);
    const [packing, setpacking] = useState([]);
    const [rows, setRows] = useState([]);

    const [productData, setProductData] = useState({
        BAID: '',
        PAID: '',
        PCAID: '',
        BOMPACKING: '',
        BRAWPRODUCTQUANTITYUOM: '',
        BRAWPRODUCTQUANTITY: '',

    });

    const handleProductChange = (e) => {
        const { name, value } = e.target;

        setProductData((prevData) => {
            const updatedData = { ...prevData, [name]: parseFloat(value) || 0 };

            return updatedData;
        });
    };

    const MySwal = withReactContent(Swal);
    const handleAddProduct = () => {
        // Validate each field and add error alert for empty fields
        if (!productData.PAID) {
            MySwal.fire({
                icon: "error",
                title: "उत्पादनाची पडताळणी त्रुटी",
                text: "कृपया उत्पादन निवडा.",
                allowOutsideClick: false,
                allowEscapeKey: false,
            });
            return;
        }
        if (!productData.PCAID || !/^\d+$/.test(productData.PCAID)) {
            MySwal.fire({
                icon: "error",
                title: "प्रमाणाची पडताळणी त्रुटी",
                text: "कृपया वैध पॅकिंग आयडी प्रविष्ट करा. फक्त अंक असू शकतात.",
                allowOutsideClick: false,
                allowEscapeKey: false,
            });
            return;
        }
        if (!productData.BOMPACKING) {
            MySwal.fire({
                icon: "error",
                title: "पॅकिंगची पडताळणी त्रुटी",
                text: "कृपया पॅकिंग पर्याय निवडा.",
                allowOutsideClick: false,
                allowEscapeKey: false,
            });
            return;
        }
        if (!productData.BRAWPRODUCTQUANTITY || !/^\d+$/.test(productData.BRAWPRODUCTQUANTITY)) {
            MySwal.fire({
                icon: "error",
                title: "प्रमाणाची पडताळणी त्रुटी",
                text: "कृपया वैध प्रमाण प्रविष्ट करा. फक्त अंक असू शकतात.",
                allowOutsideClick: false,
                allowEscapeKey: false,
            });
            return;
        }
        if (!productData.BRAWPRODUCTQUANTITYUOM) {
            MySwal.fire({
                icon: "error",
                title: "मोजमापाची युनिटची पडताळणी त्रुटी",
                text: "कृपया मोजमापाची युनिट (UOM) निवडा.",
                allowOutsideClick: false,
                allowEscapeKey: false,
            });
            return;
        }


        // Find label for the selected product and UOM from their respective arrays
        const productLabel = product.find(item => item.value === productData.PAID)?.label || '';
        const uomLabel = uom.find(item => item.value === productData.BRAWPRODUCTQUANTITYUOM)?.label || '';
        const packingLabel = packing.find(item => item.value === productData.BOMPACKING)?.label || '';

        // Add product data with labels to rows state
        setRows([
            ...rows,
            {
                ...productData,
                PAID_LABEL: productLabel, // Add the product label
                BRAWPRODUCTQUANTITYUOM_LABEL: uomLabel, // Add the UOM label
                BOMPACKING_LABEL: packingLabel, // Add the Packing label
            }
        ]);

        // Show success message
        MySwal.fire({
            icon: "success",
            title: "उत्पादन यशस्वीरित्या जोडले!",
            text: "उत्पादन यादीमध्ये यशस्वीरित्या जोडले गेले आहे.",
            allowOutsideClick: false,
            allowEscapeKey: false,
        });

        // Reset the productData state
        setProductData({
            PAID: '',
            PCAID: '',
            BOMPACKING: '',
            BRAWPRODUCTQUANTITYUOM: '',
            BRAWPRODUCTQUANTITY: '',

        });
    };

    useEffect(() => {
        if (BAID) {
            const fetchData = async () => {
                try {
                    const payload = {
                        "pkid": BAID,
                        "companyid": userdetail?.companyID || "",
                        "deptid": userdetail?.departmentID || "",
                    }
                    const headers = {
                        "Content-Type": "application/json",
                        Accept: "*/*",
                    };

                    axios({
                        method: "POST",
                        url: baseUrl.Url + "/backend/api/GET_BOMPacking/getByID",
                        data: JSON.stringify(payload),
                        headers: headers,
                    })
                        .then((response) => {
                            if (response.status != 200) throw new Error("Failed fetching BOMPacking Data");
                            const DATA = response.data[0];
                            setProductData({
                                PAID: product.find((product) => product.value == DATA.paid)?.value || "",
                                PCAID: DATA.pcaid,
                                BOMPACKING: packing.find((packing) => packing.value == DATA.bompacking)?.value || "",
                                BRAWPRODUCTQUANTITYUOM: uom.find((uom) => uom.value == DATA.brawproductquantityuom)?.value || "",
                                BRAWPRODUCTQUANTITY: DATA.brawproductquantity,

                            });

                        })

                } catch (error) {
                    console.error("Error fetching BOMPacking Data:", error);
                }

            };
            fetchData();
        }
    }, [BAID]);


    const handleSubmit = (e) => {
        e.preventDefault();
        const form = e.target.closest("form");
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        showConfirmationAlert();
        // console.log("table Data Submitted:", productData);
    };


    const showConfirmationAlert = () => {
        MySwal.fire({
            title: 'तुम्हाला खात्री आहे का?',
            text: 'तुम्ही हा डेटा जतन करू इच्छिता का?',
            showCancelButton: true,
            confirmButtonColor: '#00ff00',
            confirmButtonText: 'जतन करा',
            cancelButtonColor: '#092C4C',
            cancelButtonText: 'रद्द करा',
            allowOutsideClick: false,
            allowEscapeKey: false,
        }).then((result) => {
            if (result.isConfirmed) {
                handleFormSubmission();
                // handleModalConfirm();
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
            allowEscapeKey: false,
        }).then((result) => {
            if (result.isConfirmed) {
                // Reset formData
                setProductData({
                    BAID: '',
                    PAID: '',
                    PCAID: '',
                    BOMPACKING: '',
                    BRAWPRODUCTQUANTITYUOM: '',
                    BRAWPRODUCTQUANTITY: '',

                });

                // Close Modal
                const modal = document.getElementById("AddBOMPacking");
                if (modal) {
                    modal.classList.remove("show");
                    modal.style.display = "none";
                    modal.setAttribute("aria-hidden", "true");

                    const modalBackdrop = document.querySelector(".modal-backdrop");
                    if (modalBackdrop) {
                        modalBackdrop.remove();
                    }
                    document.body.classList.remove("modal-open");
                    document.body.style.overflow = "auto";
                }
            }
        });
    };

    useEffect(() => {
        firstInputRef?.current.focus();
        const fetchProductData = async () => {
            try {
                const payload = {
                    "ctaid": "%",
                    "companyid": userdetail?.companyID || "",
                    "deptid": userdetail?.departmentID || "",
                }
                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };

                axios({
                    method: "POST",
                    url: baseUrl.Url + "/backend/api/GET_CategoryProduct",
                    data: JSON.stringify(payload),
                    headers: headers,
                })
                    .then((response) => {
                        if (response.status != 200) throw new Error("Failed to Fetching Data");
                        const DATA = response.data;
                        const formofproductData = DATA
                            .map(({ pname, paid }) => ({
                                label: pname,
                                value: paid.toString(),
                            }));
                        setproduct(formofproductData);
                    })

            } catch (error) {
                console.error("Error fetching Access Right Data:", error);
            }

        };

        const fetchImplications = async () => {
            try {
                const response = await axios.get(
                    baseUrl.Url + "/backend/api/Implications/SOLID|LIQUID|GAS|",
                    // "http://adsvr:78/api/Implications/SOLID|LIQUID|GAS"
                );

                if (response.status !== 200) throw new Error("Failed to fetch implications data");

                const data = response.data;

                // Combine all implications into one array
                const implicationsDropdown = data.map(({ iTitle, iValue }) => ({
                    label: iTitle,
                    value: iValue,
                }));

                setuom(implicationsDropdown);
            } catch (error) {
                console.error("Error fetching implications:", error);
            }
        };
        const fetchImplications1 = async () => {
            try {
                const response = await axios.get(
                    baseUrl.Url + "/backend/api/Implications/PACKING",
                    // "http://adsvr:78/api/Implications/SOLID|LIQUID|GAS"
                );

                if (response.status !== 200) throw new Error("Failed to fetch implications data");

                const data = response.data;

                const PackingDropdown = data.map(({ iTitle, iValue }) => ({
                    label: iTitle,
                    value: iValue,
                }));
                setpacking(PackingDropdown);

            } catch (error) {
                console.error("Error fetching implications:", error);
            }
        };
        fetchImplications();
        fetchImplications1();
        fetchProductData();

    }, []);

    useEffect(() => {
        const handleShortcut = (e) => {
            if (e.ctrlKey && e.key === "s" || e.ctrlKey && e.key === 'S') {
                e.preventDefault();
                checkFormValidity(e);

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
    }, [productData, navigate, route.HSNMaster, handleSubmit]);

    const firstInputRef = useRef(null);

    useEffect(() => {
        if (firstInputRef.current) {
            firstInputRef.current.focus();
        }
    }, []);
    const checkFormValidity = (e) => {
        const { PAID, PCAID, BOMPACKING, BRAWPRODUCTQUANTITY, BRAWPRODUCTQUANTITYUOM } = productData;

        // Check for each field and show validation errors
        if (!PAID) {
            Swal.fire({
                icon: "error",
                title: "चूक आहे",
                text: "कृपया उत्पादन निवडा.",
                allowOutsideClick: false,
                allowEscapeKey: false,
            }).then(() => {
                PAIDRef.current.focus();
            });
            return;
        }
        if (!PCAID) {
            Swal.fire({
                icon: "error",
                title: "चूक आहे",
                text: "कृपया पॅकिंग आयडी टाका.",
                allowOutsideClick: false,
                allowEscapeKey: false,
            }).then(() => {
                PCAIDRef.current.focus();
            });
            return;
        }
        if (!BOMPACKING) {
            Swal.fire({
                icon: "error",
                title: "चूक आहे",
                text: "कृपया BOM पॅकिंग निवडा.",
                allowOutsideClick: false,
                allowEscapeKey: false,
            }).then(() => {
                BOMPACKINGRef.current.focus();
            });
            return;
        }
        if (!BRAWPRODUCTQUANTITY) {
            Swal.fire({
                icon: "error",
                title: "चूक आहे",
                text: "कृपया प्रमाण टाका.",
                allowOutsideClick: false,
                allowEscapeKey: false,
            }).then(() => {
                QUANTITYRef.current.focus();
            });
            return;
        }
        if (!BRAWPRODUCTQUANTITYUOM) {
            Swal.fire({
                icon: "error",
                title: "चूक आहे",
                text: "कृपया मापनाची एकक निवडा.",
                allowOutsideClick: false,
                allowEscapeKey: false,
            }).then(() => {
                UOMRef.current.focus();
            });
            return;
        }
        if (rows.length === 0) {
            Swal.fire({
                icon: "error",
                title: "चूक आहे",
                text: "कृपया जतन करण्यापूर्वी किमान एक उत्पादन जोडा.",
                allowOutsideClick: false,
                allowEscapeKey: false,
            });
            return;
        }

        handleSubmit(e);
    };

    const handleFormSubmission = async () => {
        try {

            const payload = rows.map((row) => ({
                "baid": row.BAID ? row.BAID : ACSPLGUID.getNew(),
                "paid": row.PAID,
                "pcaid": row.PCAID.toString(),
                "bompacking": row.BOMPACKING,
                "brawproductquantity": row.BRAWPRODUCTQUANTITY.toString(),
                "brawproductquantityuom": row.BRAWPRODUCTQUANTITYUOM,
                "productname": "",
                "companyid": userdetail?.companyID || "",
                "deptid": userdetail?.departmentID || "",

            }));
            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };
            const response = await axios({
                method: "POST",
                url: baseUrl.Url + "/backend/api/BOMPacking",
                data: JSON.stringify(payload),
                headers: headers,
            });

            if (response.status === 200) {
                Swal.fire({
                    icon: "success",
                    title: "जतन झाले!",
                    text: "माहिती यशस्वीपणे जतन झाली आहे.",
                    confirmButtonText: "ठीक आहे",
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                }).then((result) => {
                    if (result.isConfirmed) {
                        // Reset formData
                        setProductData({
                            BAID: '',
                            PAID: '',
                            PCAID: '',
                            BOMPACKING: '',
                            BRAWPRODUCTQUANTITYUOM: '',
                            BRAWPRODUCTQUANTITY: '',
                        });
                        // Close Modal
                        const modal = document.getElementById("AddBOMPacking");
                        if (modal) {
                            modal.classList.remove("show");
                            modal.style.display = "none";
                            modal.setAttribute("aria-hidden", "true");

                            const modalBackdrop = document.querySelector(".modal-backdrop");
                            if (modalBackdrop) {
                                modalBackdrop.remove();
                            }
                            document.body.classList.remove("modal-open");
                            document.body.style.overflow = "auto";
                        }
                        // fetchBOMPacking();
                    }
                });
            } else {
                throw new Error("Failed to save master data.");
            }
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


    const handleDelete = (index) => {
        const newRows = [...rows];
        newRows.splice(index, 1);
        setRows(newRows);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();

            const form = e.target.form;

            if (!form) {
                console.warn("Form not found.");
                return;
            }

            const focusableElements = Array.from(form.querySelectorAll("input, select, textarea, button:not([disabled]):not([readonly])"));

            const currentIndex = focusableElements.indexOf(e.target);

            if (currentIndex !== -1 && currentIndex + 1 < focusableElements.length) {
                focusableElements[currentIndex + 1].focus();
            } else {
                focusableElements[0].focus();
            }
        }
    };
    return (
        <div
            className="modal fade"
            id="AddBOMPacking"
            tabIndex={-1}
            aria-labelledby="exampleModalFullscreenLabel"
            aria-hidden="true"
            style={{ display: "none" }}
        >
            <div className="modal-dialog modal-fullscreen">
                <div className="modal-content mbgcolor">
                    <div className="page-wrapper-new p-0">
                        <div className="content">
                            <div className="modal-header border-0 custom-modal-header modlheadr">
                                <div className="page-title ps-5">
                                    <h4>BOM पॅकिंग</h4>
                                </div>
                                <div className="page-btn">
                                    <Link className="btn btn-secondary" aria-label="Close"
                                        // data-bs-dismiss="modal"
                                        onClick={showExitAlert}>
                                        <ArrowLeft className="me-2" />
                                        निर्देशांकाकडे परत जा
                                    </Link>
                                </div>
                            </div>
                            <div className="modal-body custom-modal-body pt-0 pb-0" style={{
                                overflow: "hidden",
                            }}>
                                <form onSubmit={handleSubmit}>
                                    <div className="border p-1 rounded shadow-sm mb-2 mt-2 mbgcolor">
                                        <div className="row mt-5 d-flex align-items-end mb-3">
                                            {/* Product Select */}
                                            <div className="col-lg-4 col-sm-6 col-12">
                                                <div className="mb-0 add-product form-label">
                                                    <label className='required form-label'>उत्पादन</label>
                                                    <Select
                                                        ref={firstInputRef}
                                                        onKeyDown={handleKeyDown}
                                                        classNamePrefix="react-select"
                                                        options={product}
                                                        value={product.find((option) => option.value === productData.PAID) || null}
                                                        onChange={(selectedOption) => {
                                                            setProductData((prevData) => ({
                                                                ...prevData,
                                                                PAID: selectedOption ? selectedOption.value : '',
                                                            }));
                                                        }}
                                                        openMenuOnFocus={true}
                                                        styles={{
                                                            menu: (base) => ({
                                                                ...base,
                                                                zIndex: 1050,
                                                            }),
                                                        }}
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-lg-1 col-md-6 col-sm-12">
                                                <div className="mb-0 add-product form-label">
                                                    <label className="form-label required d-flex align-items-center">पॅकिंग आयडी</label>
                                                    <input
                                                        ref={PCAIDRef}
                                                        type="text"
                                                        onKeyDown={handleKeyDown}
                                                        className="form-control"
                                                        name="PCAID"
                                                        value={productData.PCAID}
                                                        onChange={handleProductChange}
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-lg-2 col-sm-6 col-12">
                                                <div className="mb-0 add-product form-label">
                                                    <label className='form-label required'>पॅकिंग</label>
                                                    <Select
                                                        ref={BOMPACKINGRef}
                                                        classNamePrefix="react-select"
                                                        placeholder="पॅकिंग निवडा"
                                                        onKeyDown={handleKeyDown}
                                                        options={packing}
                                                        value={packing.find((option) => option.value === productData.BOMPACKING) || null}
                                                        onChange={(selectedOption) => {
                                                            setProductData((prevData) => ({
                                                                ...prevData,
                                                                BOMPACKING: selectedOption ? selectedOption.value : '',
                                                            }));
                                                        }}
                                                        openMenuOnFocus={true}
                                                        styles={{
                                                            menu: (base) => ({
                                                                ...base,
                                                                zIndex: 1050,
                                                            }),
                                                        }}
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-lg-1 col-md-6 col-sm-12">
                                                <div className="mb-0 add-product form-label">
                                                    <label className='form-label required'>प्रमाण</label>
                                                    <input
                                                        ref={QUANTITYRef}
                                                        type="text"
                                                        onKeyDown={handleKeyDown}
                                                        className="form-control"
                                                        name="BRAWPRODUCTQUANTITY"
                                                        value={productData.BRAWPRODUCTQUANTITY}
                                                        onChange={handleProductChange}
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-lg-2 col-sm-6 col-12">
                                                <div className="mb-0 add-product form-label">
                                                    <label className='form-label required'>मोजमाप युनिट</label>
                                                    <Select
                                                        ref={UOMRef}
                                                        classNamePrefix="react-select"
                                                        onKeyDown={handleKeyDown}
                                                        options={uom}
                                                        value={uom.find((option) => option.value === productData.BRAWPRODUCTQUANTITYUOM) || null}
                                                        onChange={(selectedOption) => {
                                                            setProductData((prevData) => ({
                                                                ...prevData,
                                                                BRAWPRODUCTQUANTITYUOM: selectedOption ? selectedOption.value : '',
                                                            }));
                                                        }}
                                                        styles={{
                                                            menu: (base) => ({
                                                                ...base,
                                                                zIndex: 1050,
                                                            }),
                                                        }}
                                                        openMenuOnFocus={true}
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-lg-2 col-md-6 col-sm-12">
                                                <button
                                                    type="button"
                                                    className="btn btn-primary"
                                                    onClick={handleAddProduct}
                                                >
                                                    उत्पादन जोडा
                                                </button>
                                            </div>
                                        </div>

                                        <div className="row mb-2">
                                            <div className="col-lg-12">
                                                <div className="modal-body-table">
                                                    <div className="table-responsive"
                                                        style={{ height: "calc(60vh - 120px)" }}>
                                                        <table className="table datanew">
                                                            <table className="table table-bordered"
                                                                style={{ tableLayout: "fixed" }}>
                                                                <thead className="thead-dark"
                                                                    style={{
                                                                        tablelayout: 'fixed',
                                                                        position: 'sticky',
                                                                        top: 0,
                                                                        zIndex: 1
                                                                    }}>
                                                                    <tr>
                                                                        <th className="col-2" style={{ width: "3%" }}>क्र.सं.</th>
                                                                        <th className="col-2">उत्पादन</th>
                                                                        <th className="col-1">पॅकिंग आयडी</th>
                                                                        <th className="col-1">पॅकिंग</th>
                                                                        <th className="col-1">प्रमाण</th>
                                                                        <th className="col-1">मोजमाप युनिट</th>
                                                                        <th className="col-1">क्रिया</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {rows.map((row, index) => (
                                                                        <tr key={index}>
                                                                            <td>{index + 1}</td>
                                                                            <td>{row.PAID_LABEL}</td> {/* Displaying label */}
                                                                            <td>{row.PCAID}</td>
                                                                            <td>{row.BOMPACKING_LABEL}</td>
                                                                            <td>{row.BRAWPRODUCTQUANTITY}</td>
                                                                            <td>{row.BRAWPRODUCTQUANTITYUOM_LABEL}</td> {/* Displaying label */}

                                                                            <td>
                                                                                <Link
                                                                                    className="confirm-text p-2"
                                                                                    to="#"
                                                                                    onClick={() => handleDelete(index)}
                                                                                >
                                                                                    <Trash2 className="feather-trash-2 text-danger" />
                                                                                </Link>
                                                                            </td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>

                                                            </table>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-12">
                                        <div className="text-end">
                                            <button
                                                type="button"
                                                className="btn btn-cancel me-2"
                                                // data-bs-dismiss="modal"
                                                onClick={showExitAlert}
                                            >
                                                बाहेर पडा
                                            </button>
                                            <button
                                                type="submit"
                                                className="btn btn-submit"
                                            >
                                                जतन करा
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

    )
}

export default AddBOMPacking


