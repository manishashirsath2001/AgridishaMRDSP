import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import { ChevronDown, ChevronUp, Info, ArrowLeft, Filter } from "feather-icons-react/build/IconComponents";
import { useDispatch, useSelector } from "react-redux";
import { setToogleHeader } from "../../core/redux/action";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { all_routes } from "../../Router/all_routes";
import withReactContent from "sweetalert2-react-content";
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { baseUrl, ACSPLGUID, convertToISODate } from "../../core/json/custom";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { getUserData } from '../../Context/UserData'

// import AddCash from "../Masters/AddCash";




import {

    Edit,
    Eye,
    RefreshCcw,
    PlusCircle,
    RotateCcw,


    Trash2,
} from "feather-icons-react/build/IconComponents";
import AddCashParking from "./AddCashParking";


const AddParking = () => {

    const [isCashModalHandled, setIsCashModalHandled] = useState(false);
    const [ShopLocation, setShopLocation] = useState([]);
    const GUID = ACSPLGUID.getNew();
    const GUID1 = ACSPLGUID.getNew();
    const route = all_routes;
    const MySwal = withReactContent(Swal)
    const navigate = useNavigate();
    const location = useLocation();
    const userdetail = getUserData();
    const [Customerdata, setCustomerdata] = useState([]);
    const { paid, autoid } = location.state || {};
    console.log("Received storeidstoreidstoreid:", autoid);
    const [ParkingID, setParkingID] = useState("");
    const [type1, setType] = useState([]);
    const [txnmodeall, settxnmodeall] = useState([]);
    const [StartDate, setStartDate] = useState(() => {
        const today = new Date();
        return today.toISOString().split("T")[0]; // Format: YYYY-MM-DD
    });


    const [formData, setFormData] = useState({
        ParkingID: "",
        Date: "",
        typeParking: "",
        TotalJali: "",
        VehicleNo: "",
        VehicleName: "",
        VehicleType: "",
        ParkingCharge: "",
        NAVEKHATE: "",
        txnmode: "",

    });

    const VehicleNoRef = useRef(null);
    const VehicleTypeRef = useRef(null);
    const OwnerNameRef = useRef(null);
    const ParkingChargeRef = useRef(null);
    const TypeRef = useRef(null);
    const SaveRef = useRef(null);
    const TotaljaliRef = useRef(null);
    const NavekhateRef = useRef(null);
    const Refvyavarmode = useRef(null);




    useEffect(() => {
        if (TypeRef.current) {
            TypeRef.current.focus();
        }
    }, []);

    const generateUniqueStoreID = () => {
        const timestamp = Date.now().toString().slice(-6); // Last 6 digits of current timestamp
        const randomPart = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit random number
        return timestamp + randomPart; // Concatenating both for uniqueness
    };

    useEffect(() => {
        setParkingID(generateUniqueStoreID());
    }, []);


    const handleKeyDown = (e, nextRef, isLastField = false) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (isLastField) {
                SaveRef.current?.click(); // Save
            } else {
                nextRef?.current?.focus();
            }

        }
    };

    useEffect(() => {
        const handleShortcut = (e) => {

            if (e.ctrlKey && e.key === 'e' || e.ctrlKey && e.key === 'E') {
                e.preventDefault();
                // navigate(route.Parking);
                handleExit();
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



    const handleSubmit = (e) => {
        e.preventDefault();
        validateinput(e);



    };


    const showConfirmationAlert = () => {
        MySwal.fire({
            // title: "Are you sure?",
            text: "तुम्हाला ही माहिती  जतन करायची आहे का?",
            showCancelButton: true,
            confirmButtonColor: "#00ff00",
            confirmButtonText: 'जतन करा',
            cancelButtonColor: "#092C4C",
            cancelButtonText: 'रद्द करा',
        }).then((result) => {
            if (result.isConfirmed) {
                // handleModalConfirm(event);
                handleSave();

            }
        });
    };


    // const handleChange = (e) => {
    //     const { name, value } = e.target;
    //     setFormData(prev => ({
    //         ...prev,
    //         [name]: value
    //     }));
    // };

    const handleChange = (e) => {
        const { name, value } = e.target;
        const updated = { ...formData, [name]: value };

        // Recalculate on change of weight fields
        if (name === "GrossWeight" || name === "NetWeight") {
            const newFormData = updateNetWeightToKg(updated);
            setFormData(newFormData);
        } else {
            setFormData(updated);
        }
    };







    const handleExit = () => {
        MySwal.fire({
            text: "तुम्हाला फॉर्ममधून बाहेर पडून मास्टर फॉर्ममध्ये जायचे आहे का?",
            showCancelButton: true,
            confirmButtonColor: "#00ff00",
            confirmButtonText: "होय, बाहेर पडा!",
            cancelButtonColor: "#ff0000",
            cancelButtonText: "रद्द करा",
        }).then((result) => {
            if (result.isConfirmed) {

                navigate("/Parking")
            }
        });
    };
    const selectedDate = new Date(formData.Date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);  // normalize time for comparison


    const handleModalClose = (result) => {
        handleSave();
        console.log("Modal resultModal resultModal resultModal resultModal result:", result);

    };


    const validateinput = (e) => {
        const {
            typeParking,
            VehicleNo,
            VehicleType,
            VehicleName,
            TotalJali,
            ParkingCharge,
        } = formData;

        if (!typeParking) {
            Swal.fire({
                icon: "error",
                title: "त्रुटी",
                text: " कृपया प्रकार निवडा .",
            }).then(() => {
                setTimeout(() => document.getElementById('typeParking')?.focus(), 100);
            });
            return;
        }

        if (formData.typeParking == 2) {
            if (!TotalJali) {
                Swal.fire({
                    icon: "error",
                    title: "त्रुटी",
                    text: "कृपया एकूण जाळी भरा  .",
                }).then(() => {
                    setTimeout(() => document.getElementById('VehicleType')?.focus(), 100);
                });
                return;
            }
        }

        if (!VehicleNo || !/^[A-Z]{2}[0-9]{2}\s?[A-Z]{1,2}\s?[0-9]{1,4}$/.test(VehicleNo.toUpperCase())) {
            Swal.fire({
                icon: "error",
                title: "त्रुटी",
                text: "कृपया वैध वाहन क्रमांक टाका. उदा: MH12 AB 1234",
            }).then(() => {
                setTimeout(() => document.getElementById('VehicleNo')?.focus(), 100);
            });
            return;
        }

        if (!VehicleName || !/^[a-zA-Z\s]{3,50}$/.test(VehicleName.trim())) {
            Swal.fire({
                icon: "error",
                title: "त्रुटी",
                text: "वाहन मालकाचे नाव 3 ते 50 अक्षरे असले पाहिजे व फक्त अक्षरे आणि स्पेस असावेत.",
            }).then(() => {
                setTimeout(() => document.getElementById('VehicleName')?.focus(), 100);
            });
            return;
        }


        if (!VehicleType || !/^[a-zA-Z\s]{3,50}$/.test(VehicleType.trim())) {
            Swal.fire({
                icon: "error",
                title: "त्रुटी",
                text: "कृपया वाहन प्रकार  भरा  .",
            }).then(() => {
                setTimeout(() => document.getElementById('VehicleType')?.focus(), 100);
            });
            return;
        }
        if (!ParkingCharge) {
            Swal.fire({
                icon: "error",
                title: "त्रुटी",
                text: "कृपया शुल्क भरा .",
            }).then(() => {
                setTimeout(() => document.getElementById('ParkingCharge')?.focus(), 100);
            });
            return;
        }

        if (!formData.txnmode) {
            Swal.fire({
                icon: "error",
                title: "त्रुटी",
                text: "कृपया व्यवहार मोड निवडा.",
            }).then(() => {
                setTimeout(() => document.getElementById('txnmode')?.focus(), 1000);
            });
            return;
        }

        if (formData.txnmode === "0") {
            if (!formData.NAVEKHATE) {
                Swal.fire({
                    icon: "error",
                    title: "त्रुटी",
                    text: "कृपया नावे खाते निवडा.",
                }).then(() => {
                    setTimeout(() => document.getElementById('NAVEKHATE')?.focus(), 1000);
                });
                return;
            }
        }

        if (formData.txnmode === "1") {
            // Only show modal if it hasn't been handled yet

            const modal = document.getElementById("Cash");
            if (modal) {
                modal.classList.add("show");
                modal.style.display = "block";
                modal.setAttribute("aria-modal", "true");
                modal.setAttribute("role", "dialog");
                modal.removeAttribute("aria-hidden");

                if (!document.querySelector('.modal-backdrop')) {
                    const backdrop = document.createElement("div");
                    backdrop.className = "modal-backdrop fade show";
                    document.body.appendChild(backdrop);
                }

                document.body.classList.add("modal-open");
                document.body.style.overflow = "hidden";
                document.body.style.paddingRight = "0px";
            }

            // Set the modal as handled so it won't open again
            setIsCashModalHandled(true);

            // ✅ Automatically call handleSubmit here if you want data to save right after showing modal:

        }

        if (formData.txnmode === "0") {
            showConfirmationAlert(e);
        }

        // showConfirmationAlert(e);
        // handleModalClose();
    };



    useEffect(() => {
        const fetchData = async () => {

            try {

                const payload1 = {


                    "paid": paid,
                    "keyword": "%",
                    "companyid": userdetail?.companyID ? userdetail.companyID : "",
                    "deptid": userdetail?.departmentID ? userdetail.departmentID : "",
                };
                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };

                const response1 = await axios.post(
                    `${baseUrl.Url}/backend/api/GET_PARKING`,
                    payload1,
                    { headers }
                );
                if (response1.status !== 200)
                    throw new Error("Failed to fetch vendor data");

                console.log("GET_PARKING", response1.data);
                if (response1.data.length > 0) {
                    setFormData(prevState => ({
                        ...prevState,


                        // ParkingID: response1.data[0].coldstorageid,

                        // ParkingID: response1.data[0].autoid,
                        Date: convertToISODate(response1.data[0].date),
                        typeParking: response1.data[0].type,
                        TotalJali: response1.data[0].totaljali,
                        VehicleNo: response1.data[0].vnumber,
                        VehicleType: response1.data[0].vtype,
                        VehicleName: response1.data[0].vownername,
                        ParkingCharge: response1.data[0].vcharge,
                        NAVEKHATE: response1.data[0].navekhate,
                        txnmode: response1.data[0].transactionmode,

                    }));
                    setParkingID(response1.data[0].autoid);
                    console.log("Get:", response1);
                    console.log('set', response1.data)
                }



            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [paid]);


    const handleSave = async () => {


        try {
            const payload =
            {


                "paid": paid ? paid : GUID,
                "autoid": autoid ? autoid : ParkingID,
                "date": StartDate,
                "type": formData.typeParking,
                "totaljali": formData.TotalJali || 0,
                "vnumber": formData.VehicleNo,
                "vownername": formData.VehicleName,
                "vtype": formData.VehicleType,
                "vcharge": formData.ParkingCharge,
                "transactionmode": formData.txnmode || 0,
                "navekhate": formData.NAVEKHATE || '',
                "status": false,
                "companyid": userdetail?.companyID ? userdetail.companyID : "",
                "deptid": userdetail?.departmentID ? userdetail.departmentID : "",
                "uaid": userdetail?.uaid ? userdetail.uaid : "",
            };


            console.log("Data payload:", payload);

            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            const response = await axios.post(
                `${baseUrl.Url}/backend/api/SP_AddUpdParking`,
                JSON.stringify(payload),
                { headers }
            );

            let TRNTYPE = '';
            if (formData.txnmode == '0') {
                TRNTYPE = '2'
            }
            if (formData.txnmode == '1') {
                TRNTYPE = '0'
            }

            if (formData.txnmode == '2') {
                TRNTYPE = '1'
            }

            console.log(TRNTYPE, 'formData.txnmodeTRNTYPE')



            // ✅ 3. Save Transaction Voucher
            // const voucherPayload = {
            //     voucherAID: CAID?.csid,
            //     uaid: userdetail?.uaid || "",
            //     organizationID: userdetail?.companyID || "",
            //     divisionID: userdetail?.departmentID || "",
            //     voucherTID: "TR",
            //     voucherDate: new Date().toISOString().split("T")[0],
            //     yapariacc: Accounts.COLDACC,
            //     cashacc: Accounts.CASHACC,
            //     checkacc: Accounts.CHECKACC,
            //     onlineacc: formData.NAVEKHATE || '',
            //     voucherAmount: totalAmount || 0,
            //     referenceTID: "",
            //     referenceKey: formData.CustomerName,
            //     narration:formData.Narration || '',
            //     grpkey: CAID?.csid,
            //     oid: "60",
            //     trntype: TRNTYPE,
            //     vctype: "10"

            // };

            const voucherPayload = [{
                voucherAID: paid ? paid : GUID,
                uaid: userdetail?.uaid || "",
                organizationID: userdetail?.companyID || "",
                divisionID: userdetail?.departmentID || "",
                voucherTID: "CR",
                voucherDate: new Date().toISOString().split("T")[0],
                yapariacc: "PK002",
                cashacc: "string",
                checkacc: "string",
                onlineacc: formData.NAVEKHATE || '',
                voucherAmount: formData.ParkingCharge,
                referenceTID: "",
                referenceKey: paid ? paid : GUID,
                narration: 'PARKING ',
                grpkey: paid ? paid : GUID,
                oid: "70",
                trntype: TRNTYPE,
                vctype: "10"

            }];

            const response3 = await axios.post(
                `${baseUrl.Url}/backend/api/SP_TransectionVoucher`,
                JSON.stringify(voucherPayload),
                { headers }
            );

            if (response3.status !== 200) {
                throw new Error("Failed to save SP_TransectionVoucher data.");
            }
            console.log("response3response3", response3.data)


            Swal.fire({
                icon: "success",
                title: "साठवले!",
                text: "माहिती यशस्वीरित्या सेव झाली",
                confirmButtonText: "OK",
            }).then(() => {

                setFormData({
                    ParkingID: "",
                    Date: "",
                    typeParking: "",
                    TotalJali: "",
                    VehicleNo: "",
                    VehicleName: "",
                    VehicleType: "",
                    ParkingCharge: ""
                });
                const newStoreID = generateUniqueStoreID();
                setParkingID(newStoreID);
                setTimeout(() => {
                    if (TypeRef.current) {
                        TypeRef.current.focus();
                    }
                }, 100);
            });


            console.log("API Response:", response.data);

        } catch (error) {
            console.error("Submission Error:", error);
            Swal.fire({
                icon: "error",
                title: "त्रुटी",
                text: "माहिती जतन करताना काहीतरी चूक झाली.",
                confirmButtonText: "OK",
            });

        }
    };


    useEffect(() => {
        const FetchType = async () => {
            try {
                const response = await axios.get(
                    baseUrl.Url + "/backend/api/Implications/PARKTYPE|",

                );

                if (response.status !== 200) throw new Error("Failed to fetch implications data");

                const data = response.data;
                const implicationsDropdown = data.map(({ iTitle, iValue }) => ({
                    label: iTitle,
                    value: iValue,
                }));

                setType(implicationsDropdown);
            } catch (error) {
                console.error("Error fetching implications:", error);
            }
        };
        FetchType();
    }, [])

    const [BankName, setBankName] = useState([]);
    useEffect(() => {
        const fetchBankName = async () => {
            try {
                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };

                const payload = {
                    companyid: "",
                    deptid: "",
                };

                const response = await axios.post(
                    `${baseUrl.Url}/backend/api/GET_BankName`,
                    payload,
                    { headers }
                );

                if (response.status !== 200)
                    throw new Error("Failed to fetch vendor data");

                console.log("requisition details", response.data);

                const data = response.data;

                // ✅ Exclude bankid === 2
                const conuterData = data
                    .filter(({ bankid }) => bankid !== 2)
                    .map(({ bankname, bankid }) => ({
                        label: bankname,
                        value: bankid
                    }));

                setBankName(conuterData);
            } catch (error) {
                console.error("Error fetching vendor data:", error);
            }
        };

        fetchBankName();
    }, []);


    useEffect(() => {
        const TRANSTYPE = async () => {
            try {
                const response = await axios.get(
                    baseUrl.Url + "/backend/api/Implications/TRANSTYPE"
                );

                if (response.status !== 200) throw new Error("Failed to fetch implications data");

                const data = response.data;
                const implicationsDropdown = data.map(({ iTitle, iValue }) => ({
                    label: iTitle,
                    value: iValue,
                }));

                settxnmodeall(implicationsDropdown);
            } catch (error) {
                console.error("Error fetching implications transaction mode:", error);
            }
        };

        TRANSTYPE();
    }, []);




    const customStyles = {
        control: (provided) => ({
            ...provided,
            maxHeight: "50px", // Fixed height for the input box
            overflowY: "auto", // Enable scrolling for selected options
        }),
        multiValue: (provided) => ({
            ...provided,
            maxWidth: "100%",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
        }),
        menu: (provided) => ({
            ...provided,
            zIndex: 1050, // Ensure dropdown appears above other elements
        }),
        menuList: (provided) => ({
            ...provided,
            maxHeight: "200px",
            overflowY: "auto",
        }),
    };


    return (
        <div className="page-wrapper">
            <div className="content">
                <div className="page-header">
                    <div className="add-ParkingCharge d-flex">
                        <div className="page-title">
                            <h5 className="mb-1"> पार्किंग</h5>
                            <h6>व्यवस्थापन  पार्किंग</h6>
                        </div>
                    </div>

                    <div className="page-btn">
                        <a
                            onClick={handleExit}
                            className="btn btn-secondary">
                            <ArrowLeft className="me-2" />
                            मागे
                        </a>
                    </div>
                </div>

                {/* success massage */}

                <form onSubmit={handleSubmit}>
                    <div className="card ">
                        <div className="card-body add-product">
                            <div className="accordion-card-one accordion" id="accordionExample">
                                <div className="accordion-ParkingCharge">
                                    <div className="accordion-header" id="headingOne">
                                        <div
                                            className="accordion-button"
                                            data-bs-toggle="collapse"
                                            data-bs-target="#collapseOne"
                                            aria-controls="collapseOne"
                                        >
                                            <div className="addproduct-icon">
                                                <h5>
                                                    <Info className="add-info" />
                                                    <span> पार्किंग</span>
                                                </h5>

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
                                                <div className="col-lg-3 col-md-6 mb-3">
                                                    <label htmlFor="shopId" className="form-label ">  आयडी </label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Auto Genrated"
                                                        name="ParkingID"
                                                        value={ParkingID}
                                                        required
                                                        readOnly

                                                    />
                                                </div>

                                                <div className="col-lg-2 col-md-6 mb-3">
                                                    <label htmlFor="shopDate" className="form-label  required"> तारीख</label>
                                                    <input

                                                        type="date"
                                                        id="shopDate"
                                                        className="form-control"
                                                        name="Date"
                                                        onChange={(e) =>
                                                            setFormData((prev) => ({ ...prev, Date: e.target.value }))
                                                        }
                                                        value={StartDate}

                                                        readOnly

                                                    />
                                                </div>

                                                <div className="col-lg-4 col-md-6 mb-3">
                                                    <label htmlFor="typeParking" className="form-label required">प्रकार</label>

                                                    <Select
                                                        ref={TypeRef}
                                                        classNamePrefix="react-select"
                                                        name="typeParking"
                                                        placeholder="निवडा"
                                                        options={type1}
                                                        autoFocus
                                                        openMenuOnFocus={true}
                                                        value={type1.find(option => option.value === formData.typeParking) || null}
                                                        onChange={(selectedOption) => {
                                                            const selectedValue = selectedOption.value;


                                                            setFormData((prev) => ({
                                                                ...prev,
                                                                typeParking: selectedValue,
                                                                TotalJali: selectedValue === 2 ? prev.TotalJali : ""
                                                            }));
                                                            setTimeout(() => {
                                                                if (selectedValue == 2) {
                                                                    TotaljaliRef.current?.focus();
                                                                }
                                                                else {
                                                                    VehicleNoRef.current?.focus();
                                                                }
                                                            }, 100);


                                                        }}
                                                    />

                                                </div>

                                                {formData.typeParking == 2 && (
                                                    <div className="col-lg-3 col-md-6 mb-3">
                                                        <label htmlFor="TotalJali" className="form-label required">एकूण जाळी</label>
                                                        <input
                                                            type="number"
                                                            ref={TotaljaliRef}
                                                            className="form-control"
                                                            id="TotalJali"
                                                            defaultValue={0}
                                                            name="TotalJali"
                                                            placeholder="एकूण जाळी प्रविष्ट करा"
                                                            value={formData.TotalJali || ''}
                                                            onChange={(e) =>
                                                                setFormData((prev) => ({ ...prev, TotalJali: e.target.value }))

                                                            }
                                                            onKeyDown={(e) => handleKeyDown(e, VehicleNoRef)}
                                                        />
                                                    </div>
                                                )}



                                            </div>

                                            <div className="row">
                                                <div className="col-lg-3 col-md-6 mb-3">
                                                    <label htmlFor="shopDate" className="form-label  required">वाहन क्रमांक </label>
                                                    <input
                                                        ref={VehicleNoRef}
                                                        type="text"
                                                        id="VehicleNo"
                                                        className="form-control"
                                                        placeholder="वाहन क्रमांक प्रविष्ट करा"
                                                        name="VehicleNo"
                                                        onChange={(e) =>
                                                            setFormData((prev) => ({ ...prev, VehicleNo: e.target.value }))
                                                        }
                                                        value={formData.VehicleNo}
                                                        onKeyDown={(e) => handleKeyDown(e, OwnerNameRef)}

                                                    />
                                                </div>
                                                <div className="col-lg-4 col-md-6 mb-3">
                                                    <div className="mb-0 add-product form-label">
                                                        <div className="d-flex justify-content-between align-ParkingCharges-center">
                                                            <label htmlFor="shopLocation" className="form-label ">वाहन मालकाचे नाव</label>
                                                            <Link
                                                                to="#"
                                                                data-bs-toggle="modal"
                                                                data-bs-target="#add-units-category"
                                                                className="ms-2"
                                                            >
                                                            </Link>
                                                        </div>

                                                        <div className="position-relative">
                                                            <input
                                                                id="VehicleName"
                                                                ref={OwnerNameRef}
                                                                type="text"
                                                                className="form-control"
                                                                placeholder="वाहन मालकाचे नाव प्रविष्ट करा"
                                                                name="VehicleName"
                                                                onChange={handleChange}
                                                                value={formData.VehicleName}
                                                                onKeyDown={(e) => handleKeyDown(e, VehicleTypeRef)}

                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="col-lg-3 col-md-6 mb-3">
                                                    <label htmlFor="shopName" className="form-label  required">वाहन प्रकार  </label>


                                                    <input
                                                        ref={VehicleTypeRef}
                                                        type="text"
                                                        className="form-control"

                                                        name="VehicleType"
                                                        value={formData.VehicleType}
                                                        onChange={(e) => setFormData((prev) => ({ ...prev, VehicleType: e.target.value }))}

                                                        placeholder="वाहन प्रकार प्रविष्ट करा"
                                                        onKeyDown={(e) => handleKeyDown(e, ParkingChargeRef)}
                                                    />


                                                </div>

                                                <div className="col-lg-2 col-md-6 mb-3">
                                                    <label htmlFor="shopRent" className="form-label required"> शुल्क </label>
                                                    <input
                                                        ref={ParkingChargeRef}
                                                        type="number"
                                                        id="ParkingCharge"
                                                        name="ParkingCharge"
                                                        className="form-control"
                                                        placeholder="शुल्क प्रविष्ट करा"
                                                        value={formData.ParkingCharge}
                                                        onChange={(e) => setFormData((prev) => ({ ...prev, ParkingCharge: e.target.value }))}
                                                        onKeyDown={(e) => handleKeyDown(e, Refvyavarmode)}
                                                    />


                                                </div>
                                            </div>


                                            <div className="row">
                                                <div className="col-lg-2 col-sm-6 col-12">
                                                    <div className="mb-0">
                                                        <label className="form-label required">व्यवहार मोड</label>
                                                        <Select
                                                            ref={Refvyavarmode}
                                                            placeholder="Select Counter"
                                                            classNamePrefix="react-select"
                                                            options={txnmodeall}
                                                            value={txnmodeall.find(option => option.value == formData.txnmode) || null}
                                                            // autoFocus
                                                            openMenuOnFocus={true}
                                                            onChange={(selectedOption) => {
                                                                const selectedValue = selectedOption ? selectedOption.value : '';

                                                                setFormData(prevState => ({
                                                                    ...prevState,
                                                                    txnmode: selectedValue,
                                                                }));

                                                                // Delay focus slightly to ensure conditional rendering has occurred
                                                                setTimeout(() => {
                                                                    if (selectedValue == "0") {
                                                                        NavekhateRef.current?.focus();
                                                                    }
                                                                    else {
                                                                        SaveRef.current?.focus();
                                                                    }
                                                                }, 100);
                                                            }}
                                                            styles={{
                                                                menu: (provided) => ({
                                                                    ...provided,
                                                                    zIndex: 9999,
                                                                    position: 'absolute',
                                                                }),
                                                            }}

                                                            title="Please Select txnmode "
                                                        />
                                                    </div>
                                                </div>




                                                {formData.txnmode !== "" && formData.txnmode === "0" && (

                                                    <div className="col-md-5 mb-2">
                                                        <label className="form-label required">नावे खाते </label>
                                                        <Select
                                                            ref={NavekhateRef}
                                                            classNamePrefix="react-select"
                                                            options={BankName}
                                                            placeholder="निवडा"
                                                            name="Deposit1"
                                                            openMenuOnFocus={true}
                                                            // ref={Deposit1Ref}
                                                            value={BankName.find(option => option.value === formData.NAVEKHATE) || null}
                                                            onChange={(selectedOption) => {
                                                                // setSelectedRelid(selectedOption?.name || "")
                                                                setFormData(prevState => ({
                                                                    ...prevState,
                                                                    NAVEKHATE: selectedOption ? selectedOption.value : '',
                                                                }));
                                                                if (SaveRef.current) {
                                                                    SaveRef.current.focus();
                                                                }

                                                            }}
                                                            styles={customStyles}
                                                        // styles={{
                                                        //     menu: (provided) => ({
                                                        //         ...provided,
                                                        //         zIndex: 9999,
                                                        //         position: 'absolute',
                                                        //     }),

                                                        // }}
                                                        />
                                                    </div>
                                                )}



                                            </div>


                                            <div className="col-lg-12">
                                                <div className="btn-addproduct mb-4">
                                                    <button type="button"
                                                        className="btn btn-cancel me-2"
                                                        onClick={handleExit}
                                                    >
                                                        मागे
                                                    </button>
                                                    <button type="submit"
                                                        className="btn btn-submit"
                                                        ref={SaveRef}
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
            </div >
            <AddCashParking
                totalAmount1={formData.ParkingCharge}
                onClose={handleModalClose}
            />
        </div >

    );
};

export default AddParking;
