import React, { useState, useEffect, useRef } from "react";
import Select from "react-select";
import { Link } from "react-router-dom";
import { MinusCircle, PlusCircle } from "react-feather";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
// import { ACSPLGUID, baseUrl, convertToISODate } from "../../../core/json/custom";
import { ACSPLGUID, baseUrl, convertToISODate } from "../../core/json/custom";
import axios from "axios";
// import { all_routes } from '../../../Router/all_routes';
import { all_routes } from '../../Router/all_routes';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Trash2,
    Edit
} from "feather-icons-react/build/IconComponents";
// import { getUserData } from "../../Context/UserData";
import { getUserData } from "../../Context/UserData";
import AddQuickFarmer_1 from "./AddQuickFarmer_1";
import AddQuickTrasporter_1 from "./AddQuickTrasporter_1";
import { convertToCustomDate, formatDate, formatToDateTimeLocal } from "../../core/json/custom";
import VehicalFarmers from "./VehicalFarmers";
const AddGateEntry = ({ dpkid, uniqueid, VEHICLENO, iscompleted, onRefresh }) => {
    console.log(dpkid, uniqueid, VEHICLENO, "dpkid,uniqueid, VEHICLENO ")
    console.log(iscompleted, "iscompleted")
    const route = all_routes;
    const GUID = ACSPLGUID.getNew();
    const MySwal = withReactContent(Swal);
    const location = useLocation();
    // const { dpkid } = location.state || {};
    const { isAuthenticated, userdetail } = getUserData();
    const [refreshKey, setRefreshKey] = useState(0);

    if (isAuthenticated == true) {
        console.log("user", userdetail);
        console.log("getUserData", getUserData);
    }

    const navigate = useNavigate();
    const [Crop_TYPE, setCrop_TYPE] = useState([]);
    const [vehicalnum, setvehicalnum] = useState();
    const [, setIsEditMode] = useState(false);
    const TOKANNORef = useRef(null);
    const DATERef = useRef(null);
    const VEHNORef = useRef(null);
    const FULLNAMERef = useRef(null);
    const MOBILENORef = useRef(null);
    const AADHARNORef = useRef(null);
    const VILLAGERef = useRef(null);
    const CROP_TYPERef = useRef(null);
    const CARETS_COUNTRef = useRef(null);
    const AddRef = useRef(null);

    const [uid, setUid] = useState("");
    const [Farmer, setFarmer] = useState([]);
    const [states, setstates] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [gateEntries, setGateEntries] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [farmerMatches, setFarmerMatches] = useState([]);
    const [showFarmerSelect, setShowFarmerSelect] = useState(false)

    // useEffect(() => {
    //     document.body.style.overflow = showModal ? 'hidden' : 'auto';
    //     return () => (document.body.style.overflow = 'auto');
    // }, [showModal]);

    console.log("userdetail.APPDT", userdetail.APPDT)
    console.log("userdetail.APPDT convertToCustomDate", convertToCustomDate(userdetail.APPDT, 0))
    console.log("userdetail.APPDT formatDate", formatDate(userdetail.APPDT))
    console.log("userdetail.APPDT formatToDateTimeLocal", formatToDateTimeLocal(userdetail.APPDT))

    useEffect(() => {
        const timer = setTimeout(() => {
            if (CROP_TYPERef.current) {
                CROP_TYPERef.current.focus();

            }
        }, 100); // Slight delay ensures modal DOM is ready

        const newGuid = ACSPLGUID.getNew();
        setUid(newGuid);

        return () => clearTimeout(timer);
    }, []);


    const [detailData, setDetailData] = useState({
        dpkid: '',
        maid: '',
        vehno: 'MH',
        date: formatToDateTimeLocal(userdetail.APPDT),
        toknno: '',
        mobileno: '',
        aadharno: '',
        fname: '',
        crop_type: '',
        caretS_COUNT: '',
        village: '',
        isdeleted: 0,

    });

    // useEffect(() => {
    //     const fetchFarmer = async () => {
    //         try {
    //             const headers = {
    //                 "Content-Type": "application/json",
    //                 Accept: "*/*",
    //             };

    //             const payload = {
    //                 companyid: "",

    //             };

    //             const response = await axios.post(
    //                 `${baseUrl.Url}/backend/api/GET_FarmerName`,
    //                 payload,
    //                 { headers }
    //             );
    //             if (response.status !== 200)
    //                 throw new Error("Failed to fetch Farmer data");
    //             console.log("Farmer Detail", response.data)
    //             const data = response.data;
    //             const conuterData = data
    //                 .map(({ fname, faid }) => ({
    //                     label: fname,
    //                     value: faid
    //                 }));

    //             setFarmer(conuterData);


    //         } catch (error) {
    //             console.error("Error fetching Farmer data:", error);
    //         }
    //     };
    //     fetchFarmer();
    // }, []);

    const selectedID = localStorage.getItem("selectedID");
    useEffect(() => {
        if (selectedID) {
            const fetchFarmer = async () => {
                try {
                    const payload = {
                        keyword: selectedID,
                    };

                    const headers = {
                        'Content-Type': 'application/json',
                        Accept: '*/*',
                    };

                    const response = await axios.post(
                        `${baseUrl.Url}/backend/api/GET_FarmerDetails`,
                        payload,
                        { headers }
                    );

                    if (response.status === 200 && response.data.length > 0) {
                        const farmerData = response.data[0];
                        console.log("Fetched Farmer Data:", farmerData);
                        const filtered = Farmer?.find(item => item.value === farmerData.faid);
                        setDetailData((prevState) => ({
                            ...prevState,
                            maid: filtered?.value || "",
                            fname: filtered?.label || "",
                            mobileno: farmerData?.fcontactno || "",
                            aadharno: farmerData?.faddharno || "",
                            village: farmerData?.district || "",
                        }));
                        localStorage.removeItem("selectedID");
                    }
                } catch (error) {
                    console.error('Error fetching farmer data:', error);
                }
            }

            fetchFarmer()
        }
    });


    useEffect(() => {
        const fetchFarmer = async () => {
            try {
                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };

                const payload = { companyid: "" };

                const response = await axios.post(
                    `${baseUrl.Url}/backend/api/GET_FarmerName`,
                    payload,
                    { headers }
                );

                if (response.status !== 200) throw new Error("Failed to fetch Farmer data");

                console.log("Farmer Detail", response.data);

                const data = response.data.map(({ fname, faid }) => ({
                    label: fname,
                    value: faid
                }));

                setFarmer(data);

            } catch (error) {
                console.error("Error fetching Farmer data:", error);
            }
        };
        fetchFarmer();
        const interval = setInterval(fetchFarmer, 1000);

        return () => clearInterval(interval);

    }, []);

    const handleFarmerChange = async (selectedOption) => {
        if (selectedOption) {
            console.log("Selected Farmer:", selectedOption.label, "ID:", selectedOption.value);
            try {
                const payload = {
                    faid: selectedOption.value,
                    companyid: '',
                    deptid: '',
                };

                const headers = {
                    'Content-Type': 'application/json',
                    Accept: '*/*',
                };

                const response = await axios.post(
                    `${baseUrl.Url}/backend/api/GET_FarmerSearch`,
                    payload,
                    { headers }
                );

                if (response.status === 200 && response.data.length > 0) {
                    const farmerData = response.data[0];

                    console.log("Fetched Farmer Data:", farmerData);

                    setDetailData((prevState) => ({
                        ...prevState,
                        aadharno: farmerData.faddharno || '',
                        mobileno: farmerData.fcontactno || '',
                    }));

                    setDetailData((prevState) => ({
                        ...prevState,
                        maid: selectedOption.value,
                        fname: selectedOption.label,
                    }));
                } else {
                    console.log("No data found for farmer.");
                    setDetailData((prevState) => ({
                        ...prevState,
                        aadharno: '',
                        mobileno: '',
                    }));

                }

            } catch (error) {
                console.error('Error fetching farmer data:', error);
            }
        }
    };

    useEffect(() => {

    }, [detailData]);


    useEffect(() => {
        const fetchImplications = async () => {
            try {
                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };

                const payload = { "companyid": "", "deptid": "" };

                const response = await axios.post(
                    `${baseUrl.Url}/backend/api/GETItemDropdown`,
                    payload,
                    { headers }
                );

                if (response.status !== 200) throw new Error("Failed to fetch Farmer data");
                const data = response.data;
                const implicationsDropdown = data.map(({ itemaid, itemnm }) => ({
                    label: itemnm,
                    value: itemaid,
                }));

                setCrop_TYPE(implicationsDropdown);
                if (detailData.crop_type != "") {
                    setDetailData(prev => ({
                        ...prev,
                        crop_type: implicationsDropdown.find(item => item.value === detailData.crop_type)?.value || '',
                    }));
                }
            } catch (error) {
                console.error("Error fetching Farmer data:", error);
            }
        };

        fetchImplications();
    }, []);

    useEffect(() => {
        if (Crop_TYPE.length > 0) {
            const defaultOption = Crop_TYPE.find(option => option.label === "डाळिंब") || Crop_TYPE[0];
            setDetailData(prev => ({ ...prev, crop_type: defaultOption.value }));
        }
        // if (detailData.crop_type != "") {
        //     setDetailData(prev => ({
        //         ...prev,
        //         crop_type: Crop_TYPE.find(item => item.value === detailData.crop_type)?.value || '',
        //     }));
        // }
    }, [Crop_TYPE]);


    const handleSelectChange = (selectedOption) => {
        setDetailData(prevState => ({
            ...prevState,
            crop_type: selectedOption ? selectedOption.value : null
        }));
    };



    // const handleInputChange = async (e) => {
    //     const { name, value } = e.target;
    //     if (name in detailData) {
    //         setDetailData({
    //             ...detailData,
    //             [name]: value,
    //         });
    //     }

    //     if ((name === 'mobileno' && value.length == 10) || (name === 'aadharno' && value.length == 12)) {
    //         try {
    //             const payload = {
    //                 keyword: value,
    //             };

    //             const headers = {
    //                 'Content-Type': 'application/json',
    //                 Accept: '*/*',
    //             };

    //             const response = await axios.post(
    //                 `${baseUrl.Url}/backend/api/GET_FarmerDetails`,
    //                 payload,
    //                 { headers }
    //             );

    //             if (response.status === 200 && response.data.length > 0) {
    //                 const farmerData = response.data[0];
    //                 console.log("Fetched Farmer Data:", farmerData);
    //                 const filtered = Farmer.find(item => item.value === farmerData.faid);
    //                 // setFarmer(filtered);
    //                 setDetailData((prevState) => ({
    //                     ...prevState,
    //                     maid: filtered?.value || "",
    //                     fname: filtered?.label || "",
    //                     mobileno: farmerData?.fcontactno || "",
    //                     aadharno: farmerData?.faddharno || "",
    //                     village: farmerData?.district || "",
    //                 }));
    //             } else {
    //                 Swal.fire({
    //                     icon: "error",
    //                     title: "त्रुटी!",
    //                     text: "शेतकऱ्याची नोंद झाली नाही. कृपया प्रथम शेतकरी नोंदवा.",
    //                     confirmButtonText: "ठीक आहे",
    //                     allowOutsideClick: false,
    //                     allowEscapeKey: false,
    //                 }).then((result) => {
    //                     if (result.isConfirmed) {
    //                         localStorage.setItem("aadhar", (name == 'aadharno') ? value : "");
    //                         localStorage.setItem("mobile", (name == 'mobileno' ? value : ""));
    //                         document.querySelector('[data-bs-target="#Farmerfrom_1"]').click();
    //                     }
    //                 });
    //             }
    //         } catch (error) {
    //             console.error('Error fetching farmer data:', error);
    //         }

    //     }

    //     if (name === 'aadharno' && value.length == 4) {
    //         try {
    //             const payload = {
    //                 keyword: value,
    //             };

    //             const headers = {
    //                 'Content-Type': 'application/json',
    //                 Accept: '*/*',
    //             };

    //             const response = await axios.post(
    //                 `${baseUrl.Url}/backend/api/GET_FarmerDetails`,
    //                 payload,
    //                 { headers }
    //             );

    //             if (response.status === 200 && response.data.length > 0) {
    //                 const farmerData = response.data[0];
    //                 console.log("Fetched Farmer Data:", farmerData);
    //                 const filtered = Farmer.find(item => item.value === farmerData.faid);
    //                 // setFarmer(filtered);
    //                 setDetailData((prevState) => ({
    //                     ...prevState,
    //                     maid: filtered?.value || "",
    //                     fname: filtered?.label || "",
    //                     mobileno: farmerData?.fcontactno || "",
    //                     aadharno: farmerData?.faddharno || "",
    //                     village: farmerData?.district || "",
    //                 }));
    //             }
    //         } catch (error) {
    //             console.error('Error fetching farmer data:', error);
    //         }
    //     }
    // };

    const handleInputChange = async (e) => {
        const { name, value } = e.target;
        if (name in detailData) {
            setDetailData({
                ...detailData,
                [name]: value,
            });
        }
        // const { name, value } = e.target;


        if (name === 'mobileno' && value.trim() === "") {
            setDetailData(prev => ({
                ...prev,
                mobileno: "",
                maid: "",
                fname: "",
                aadharno: "",
                village: "",
            }));
            setShowFarmerSelect(false);
            return;
        }

        if (name === 'aadharno' && value.trim() === "") {

            setDetailData(prev => ({
                ...prev,
                aadharno: "",
                maid: "",
                fname: "",
                mobileno: "",
                village: "",

            }));
            setShowFarmerSelect(false);
            return;
        }

        if (name in detailData) {
            setDetailData({
                ...detailData,
                [name]: value,
            });
        }


        if ((name === 'mobileno' && value.length == 10) || (name === 'aadharno' && value.length == 12)) {
            try {
                const payload = {
                    keyword: value,
                };

                const headers = {
                    'Content-Type': 'application/json',
                    Accept: '*/*',
                };

                const response = await axios.post(
                    `${baseUrl.Url}/backend/api/GET_FarmerDetails`,
                    payload,
                    { headers }
                );

                if (response.status === 200 && response.data.length > 0) {
                    if (response.data.length === 1) {
                        // Single match - auto-fill
                        const farmerData = response.data[0];
                        const filtered = Farmer.find(item => item.value === farmerData.faid);
                        setDetailData((prevState) => ({
                            ...prevState,
                            maid: filtered?.value || "",
                            fname: filtered?.label || "",
                            mobileno: farmerData?.fcontactno || "",
                            aadharno: farmerData?.faddharno || "",
                            village: farmerData?.district || "",
                        }));
                        setShowFarmerSelect(false);
                    } else {
                        // Multiple matches - show select
                        const options = response.data.map((item) => {
                            const matched = Farmer.find(f => f.value === item.faid);
                            return {
                                label: matched?.label || item.fname,
                                value: matched?.value || item.faid,
                                data: item,
                            };
                        });
                        setFarmerMatches(options);
                        setShowFarmerSelect(true);
                    }
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "त्रुटी!",
                        text: "शेतकऱ्याची नोंद झाली नाही. कृपया प्रथम शेतकरी नोंदवा.",
                        confirmButtonText: "ठीक आहे",
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                    }).then((result) => {
                        if (result.isConfirmed) {
                            localStorage.setItem("aadhar", (name == 'aadharno') ? value : "");
                            localStorage.setItem("mobile", (name == 'mobileno' ? value : ""));
                            document.querySelector('[data-bs-target="#Farmerfrom_1"]').click();
                        }
                    });
                }
            } catch (error) {
                console.error('Error fetching farmer data:', error);
            }
        }

    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form Data:", detailData);
        console.log('Detail Data:', tableData);
        if (iscompleted == true || iscompleted == 1) {
            Swal.fire({
                icon: "error",
                title: "त्रुटी",
                text: "लिलाव पूर्ण झाला आहे, त्यामुळे हे टोकनची माहिती बदलू शकत नाही.",
            });
        } else {
            handleAddProduct();
        }
    };

    const handleAddProduct = async () => {
        const newUid = ACSPLGUID.getNew();
        if (iscompleted == true || iscompleted == 1) {
            return Swal.fire({
                icon: "error",
                title: "माहिती बदलण्यास परवानगी नाही",
                text: "लिलाव पूर्ण झाल्यामुळे, या टोकनची माहिती आता बदलू शकत नाही.",
                confirmButtonText: "ठीक आहे",
                allowOutsideClick: false,
                allowEscapeKey: false,
            });
        }

        // 🔹 Step 2: Perform Validations
        const vehicleRegex = /^[A-Z]{2}\d{1,2}[A-Z]{1,2}\d{4}$/;

        if (!vehicleRegex.test(detailData.vehno)) {
            return Swal.fire({
                icon: "error",
                title: "प्रमाणीकरण त्रुटी",
                text: "🚗 वाहन क्रमांक 'MH15AS0001' या स्वरूपात असावा!",
                allowOutsideClick: false,
                allowEscapeKey: false,
            }).then(() => VEHNORef?.current?.focus());
        }

        if (!detailData.mobileno) {
            return Swal.fire({
                icon: "error",
                title: "प्रमाणीकरण त्रुटी",
                text: "📞 कृपया वैध 10-अंकी मोबाईल क्रमांक भरा.",
                allowOutsideClick: false,
                allowEscapeKey: false,
            }).then(() => MOBILENORef?.current?.focus());
        }

        if (!detailData.crop_type) {
            return Swal.fire({
                icon: "error",
                title: "प्रमाणीकरण त्रुटी",
                text: "🌾 कृपया पिकाचा प्रकार नक्की निवडा.",
                allowOutsideClick: false,
                allowEscapeKey: false,
            }).then(() => CROP_TYPERef?.current?.focus());
        }

        if (!detailData.maid) {
            return Swal.fire({
                icon: "error",
                title: "प्रमाणीकरण त्रुटी",
                text: "👨‍🌾 कृपया शेतकऱ्याचे नाव नक्की भरा!",
                allowOutsideClick: false,
                allowEscapeKey: false,
            }).then(() => FULLNAMERef?.current?.focus());
        }

        if (!detailData.caretS_COUNT || Number(detailData.caretS_COUNT) <= 0) {
            return Swal.fire({
                icon: "error",
                title: "प्रमाणीकरण त्रुटी",
                text: "📦 पेट्यांची संख्या 0 पेक्षा जास्त असावी, कृपया योग्य संख्या भरा.",
                allowOutsideClick: false,
                allowEscapeKey: false,
            }).then(() => CARETS_COUNTRef?.current?.focus());
        }

        const input = detailData.date;
        const date = new Date(input);

        const formatted = date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });

        console.log(formatted); // Output: "28 May 2025"


        try {
            const checkPayload = {
                vehno: detailData.vehno || "",
                date: formatted || userdetail.APPDT,
                aadharno: detailData.aadharno || "",
                mobileno: detailData.mobileno || "",
                maid: detailData.maid || ""
            };

            const response = await axios.post(
                `${baseUrl.Url}/backend/api/GET_RecentFarmerToken`,
                checkPayload,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: '*/*'
                    }
                }
            );

            if (response.status === 200 && response.data?.length > 0) {
                return Swal.fire({
                    icon: "error",
                    title: "त्रुटी",
                    text: `${response.data[0].token} हा टोकन क्रमांक आणि ${response.data[0].ccnt} जाळी संख्या असलेली नोंद आधीच अस्तित्वात आहे. तुम्हाला ही माहिती बदलायची आहे का?`,
                    showCancelButton: true,
                    confirmButtonText: "हो",
                    cancelButtonText: "नाही",
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        try {
                            const newUid = ACSPLGUID.getNew();

                            const savePayload = {
                                dpkid: response.data[0]?.dpkid || detailData.dpkid || newUid,
                                maid: detailData.maid || "",
                                toknno: '',
                                village: detailData.village || "",
                                fullname: detailData.fname || "",
                                caretS_COUNT: detailData.caretS_COUNT ? String(parseInt(detailData.caretS_COUNT, 10)) : "0",
                                isdeleted: !!detailData.isdeleted,
                                vehno: detailData.vehno,
                                aadharno: detailData.aadharno || "",
                                mobileno: detailData.mobileno || "",
                                croP_TYPE: String(detailData.crop_type || ""),
                                date: convertToCustomDate(detailData.date, 0) || formatDate(userdetail.APPDT),
                                uid: newUid,
                                companyid: "",
                                deptid: "",
                                userid: userdetail?.uaid || "",
                                isverified: true
                            };

                            const saveRes = await axios.post(
                                `${baseUrl.Url}/backend/api/SP_AddUpdGateEntryDetail`,
                                savePayload,
                                {
                                    headers: {
                                        'Content-Type': 'application/json',
                                        Accept: '*/*'
                                    }
                                }
                            );

                            if (saveRes.status === 200) {
                                fetchGateEntryDetails();

                                Swal.fire({
                                    icon: "success",
                                    title: "Saved!",
                                    html: `<b>${saveRes.data[0].responseMessage}</b>`,
                                    allowOutsideClick: false,
                                    allowEscapeKey: false,
                                }).then(() => {
                                    setDetailData((prevData) => ({
                                        ...prevData,
                                        dpkid: ACSPLGUID.getNew(),
                                        maid: "",
                                        date: formatToDateTimeLocal(userdetail.APPDT),
                                        fname: "",
                                        village: "",
                                        mobileno: "",
                                        aadharno: "",
                                        caretS_COUNT: "",

                                    }));
                                    localStorage.removeItem("vehNo");
                                });
                            } else {
                                throw new Error("Failed to save product details.");
                            }
                        } catch (error) {
                            console.error("Submission Error:", error);
                            Swal.fire({
                                icon: "error",
                                title: "त्रुटी",
                                text: "डेटा सेव्ह करण्यात अयशस्वी. कृपया पुन्हा प्रयत्न करा.",
                            });
                        }
                    } else {
                        setDetailData((prevData) => ({
                            ...prevData,
                            dpkid: ACSPLGUID.getNew(),
                            maid: "",
                            date: formatToDateTimeLocal(userdetail.APPDT),
                            fname: "",
                            village: "",
                            mobileno: "",
                            aadharno: "",
                            caretS_COUNT: "",

                        }));
                        localStorage.removeItem("vehNo");
                    }
                });
            } else {
                try {


                    const savePayload = {
                        dpkid: detailData.dpkid || ACSPLGUID.getNew(),
                        maid: detailData.maid || "",
                        toknno: '',
                        village: detailData.village || "",
                        fullname: detailData.fname || "",
                        caretS_COUNT: detailData.caretS_COUNT ? String(parseInt(detailData.caretS_COUNT, 10)) : "0",
                        isdeleted: !!detailData.isdeleted,
                        vehno: detailData.vehno,
                        aadharno: detailData.aadharno || "",
                        mobileno: detailData.mobileno || "",
                        croP_TYPE: String(detailData.crop_type || ""),
                        date: convertToCustomDate(detailData.date, 0) || formatDate(userdetail.APPDT),
                        uid: ACSPLGUID.getNew(),
                        companyid: "",
                        deptid: "",
                        userid: userdetail?.uaid || "",
                        isverified: true
                    };

                    const saveRes = await axios.post(
                        `${baseUrl.Url}/backend/api/SP_AddUpdGateEntryDetail`,
                        savePayload,
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                Accept: '*/*'
                            }
                        }
                    );

                    if (saveRes.status === 200) {
                        fetchGateEntryDetails();

                        Swal.fire({
                            icon: "success",
                            title: "Saved!",
                            html: `<b>${saveRes.data[0].responseMessage}</b>`,
                            allowOutsideClick: false,
                            allowEscapeKey: false,
                        }).then(() => {
                            setDetailData((prevData) => ({
                                ...prevData,
                                dpkid: newUid,
                                maid: "",
                                date: formatToDateTimeLocal(userdetail.APPDT),
                                fname: "",
                                village: "",
                                mobileno: "",
                                aadharno: "",
                                caretS_COUNT: "",
                            }));
                            localStorage.removeItem("vehNo");
                        });
                    } else {
                        throw new Error("Failed to save product details.");
                    }
                } catch (error) {
                    console.error("Submission Error:", error);
                    Swal.fire({
                        icon: "error",
                        title: "त्रुटी",
                        text: "डेटा सेव्ह करण्यात अयशस्वी. कृपया पुन्हा प्रयत्न करा.",
                    });
                }
            }
        } catch (error) {
            console.error("Submission Error:", error);
            Swal.fire({
                icon: "error",
                title: "त्रुटी",
                text: "डेटा सेव्ह करण्यात अयशस्वी. कृपया पुन्हा प्रयत्न करा.",
            });
        }
    };


    const fetchGateEntryDetails = async () => {
        if (detailData.vehno != '') {
            try {
                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*"
                };

                const payload = {
                    "vehno": detailData.vehno,
                    "date": userdetail.APPDT,
                };

                const response = await axios.post(
                    baseUrl.Url + "/backend/api/GET_GateEntryDataByVehno",
                    payload,
                    { headers }
                );

                console.log("API Response2:", response.data);

                if (response.status === 200 && Array.isArray(response.data) && response.data.length > 0) {

                    setTableData(response.data);


                } else {
                    console.warn("डेटा मिळाला नाही किंवा रिकामा आहे!");
                    setTableData([]);
                }
            } catch (error) {

                setTableData([]);
            }
        }
    };

    const fetchGateEntryDetailsByVehno = async (vechiclno) => {
        if (vechiclno != '') {
            try {
                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*"
                };

                const payload = {
                    "vehno": vechiclno,
                    "date": userdetail.APPDT,
                };

                const response = await axios.post(
                    baseUrl.Url + "/backend/api/GET_GateEntryDataByVehno",
                    payload,
                    { headers }
                );

                console.log("API Response2:", response.data);

                if (response.status === 200 && response.data.length > 0) {
                    setTableData(response.data);

                } else {
                    console.warn("डेटा मिळाला नाही किंवा रिकामा आहे!");

                    openModal(vechiclno);

                }
            } catch (error) {
                setTableData([]);
            }
        }
    };

    const fetchGateEntryDetailsdata = async () => {
        if (vehicalnum != '') {
            try {
                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*"
                };

                const payload = {
                    "vehno": vehicalnum,
                    "date": userdetail.APPDT,
                };

                const response = await axios.post(
                    baseUrl.Url + "/backend/api/GET_GateEntryDataByVehno",
                    payload,
                    { headers }
                );

                console.log("API Response2:", response.data);

                setTableData(response.data);


            } catch (error) {
                setTableData([]);
            }
        }
    };
    //Edit
    // useEffect(() => {
    //     const fetchData = async () => {
    //         if (VEHICLENO) {
    //             setDetailData({
    //                 dpkid: '',
    //                 maid: '',
    //                 vehno: 'MH',
    //                 date: formatDate(userdetail.APPDT),
    //                 toknno: '',
    //                 mobileno: '',
    //                 aadharno: '',
    //                 fname: '',
    //                 crop_type: '',
    //                 caretS_COUNT: '',
    //                 village: '',
    //                 isdeleted: 0,
    //                 uid: ''
    //             });

    //             try {
    //                 const payload = {
    //                     "vehno": VEHICLENO || "",
    //                     "uid": uniqueid,
    //                     "companyid": "",
    //                     "deptid": "",
    //                 };

    //                 const headers = {
    //                     "Content-Type": "application/json",
    //                     Accept: "*/*",
    //                 };

    //                 const response = await axios.post(
    //                     baseUrl.Url + "/backend/api/GET_GateEntryDetailById",
    //                     payload,
    //                     { headers }
    //                 );

    //                 if (response.status !== 200) {
    //                     throw new Error("Failed to Fetch GateEntry Data");
    //                 }

    //                 if (response.data.length > 0) {
    //                     let apiData = response.data[0];

    //                     setDetailData({
    //                         dpkid: apiData.dpkid || "",
    //                         maid: Farmer.find((Farmer) => Farmer.value == apiData.maid)?.value || "",
    //                         vehno: apiData.vehno || "",
    //                         toknno: apiData.toknno,
    //                         date: apiData.date ? convertToISODate(apiData.date) : "",
    //                         fullname: apiData.fname || "",
    //                         mobileno: apiData.mobileno || "",
    //                         aadharno: apiData.aadharno || "",
    //                         crop_type: apiData.crop_type ? String(apiData.crop_type) : "",
    //                         village: apiData.village || "",
    //                         caretS_COUNT: apiData.caretS_COUNT || 0,
    //                         uid: uniqueid
    //                     });


    //                     setTableData(response.data);

    //                     console.log("Detail Data Updated:", apiData);
    //                 } else {
    //                     console.log("No data found for given UID.");
    //                 }

    //             } catch (error) {
    //                 console.error("Error fetching Gate Entry Data:", error);
    //             }
    //         }
    //     };

    //     fetchData();
    // }, [uniqueid, VEHICLENO]);

    useEffect(() => {
        const today = formatDate(userdetail.APPDT);
        if (VEHICLENO != "" && VEHICLENO != null || uniqueid != "" && uniqueid != null) {

            const fetchData = async () => {
                try {
                    const payload = {
                        vehno: VEHICLENO,
                        uid: dpkid,
                        companyid: "",
                        deptid: "",
                        date: userdetail.APPDT || ""
                    };

                    const headers = {
                        "Content-Type": "application/json",
                        Accept: "*/*",
                    };

                    const response = await axios.post(
                        baseUrl.Url + "/backend/api/GET_GateEntryDetailById",
                        payload,
                        { headers }
                    );

                    if (response.status !== 200) {
                        throw new Error("Failed to Fetch GateEntry Data");
                    }

                    if (response.data.length > 0) {
                        const apiData = response.data[0];

                        // ✅ crop_type match आता करा


                        // 🔹 Form मध्ये डेटा भरा
                        setDetailData({
                            dpkid: apiData?.dpkid || "",
                            maid: Farmer.find((f) => f.value === apiData?.maid)?.value || "",
                            vehno: apiData?.vehno || "",
                            toknno: apiData?.toknno || "",
                            date: formatToDateTimeLocal(apiData?.date) ? formatToDateTimeLocal(apiData?.date) : formatToDateTimeLocal(userdetail.APPDT),
                            fullname: apiData?.fname || "",
                            mobileno: apiData?.mobileno || "",
                            aadharno: apiData?.aadharno || "",
                            crop_type: Crop_TYPE.find(item => item.value === apiData?.croP_TYPE)?.value || '',
                            village: apiData?.village || "",
                            caretS_COUNT: apiData?.caretS_COUNT || 0,
                            uid: uniqueid,
                            isdeleted: 0
                        });
                        setTableData(response.data)

                        // 🔹 Table ला update करा (add if not present)
                        // setTableData(prev => {
                        //     const existingIndex = prev.findIndex(row => row.dpkid === apiData.dpkid);

                        //     if (existingIndex !== -1) {
                        //         return prev.map((row, idx) =>
                        //             idx === existingIndex
                        //                 ? { ...apiData, isEditing: true }
                        //                 : { ...row, isEditing: false }
                        //         );
                        //     } else {
                        //         return [
                        //             ...prev.map(row => ({ ...row, isEditing: false })),
                        //             { ...apiData, isEditing: true }
                        //         ];
                        //     }
                        // });

                        console.log("Detail Data Updated:", apiData);
                    } else {
                        console.log("No data found for given UID.");
                    }

                } catch (error) {
                    console.error("Error fetching Gate Entry Data:", error);
                }
            };

            fetchData();
        }
    }, [uniqueid, VEHICLENO]);

    const handleEdit = (dpkid) => {
        const filteredProduct = tableData.find((row) => row.dpkid === dpkid);
        setIsEditMode(true);

        if (filteredProduct) {
            const matchedCrop = Crop_TYPE.find(item => item.value === filteredProduct.croP_TYPE)?.value || '';

            console.log("✅ matchedCrop:", matchedCrop);
            setDetailData(prev => ({
                ...prev,
                dpkid: filteredProduct.dpkid || "",
                maid: filteredProduct.maid || "",
                toknno: filteredProduct.toknno || "",
                crop_type: matchedCrop, // ✅ योग्य value assign करा
                caretS_COUNT: filteredProduct.caretS_COUNT || "",
                village: filteredProduct.village || "",
                isdeleted: 0,
            }));

            const selectedFarmer = Farmer.find(f => f.value === filteredProduct.maid);
            if (selectedFarmer) {
                handleFarmerChange(selectedFarmer);
            }

            setTableData((prevData) =>
                prevData.map((row) =>
                    row.dpkid === dpkid
                        ? { ...row, isEditing: true }
                        : { ...row, isEditing: false }
                )
            );

        } else {
            console.warn("संपादित करण्यासाठी डेटामधून काहीही सापडले नाही!");
        }
    };

    const handleDelete = async (dpkid) => {
        Swal.fire({
            title: "तुम्हाला खात्री आहे का?",
            text: "ही क्रिया परत करता येणार नाही. कृपया खात्री करा.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "होय, पुढे जा",
            cancelButtonText: "रद्द करा",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const payload = {
                        dpkid: dpkid,
                        companyid: "",
                        deptid: "",
                    };

                    const headers = {
                        "Content-Type": "application/json",
                        Accept: "*/*",
                    };

                    const response = await axios.post(
                        baseUrl.Url + "/backend/api/SP_DeleteGateEntryDetail",
                        payload,
                        { headers }
                    );

                    console.log("Delete API Response3:", response.data);

                    if (response.status === 200 || response.status === 204) {

                        if (response.data[0].responseCode === "FAILURE") {
                            // setTableData((prevTableData) =>
                            //     prevTableData.filter((row) => row.dpkid !== dpkid)
                            // );
                        } else {
                            setTableData((prevTableData) =>
                                prevTableData.filter((row) => row.dpkid !== dpkid)
                            );
                        }

                        setDetailData({
                            dpkid: '',
                            maid: '',
                            vehno: 'MH',
                            date: formatToDateTimeLocal(userdetail.APPDT),
                            toknno: '',
                            mobileno: '',
                            aadharno: '',
                            fname: '',
                            crop_type: '',
                            caretS_COUNT: '',
                            village: '',
                            isdeleted: 0,
                        });
                        // setTableData([]);
                        // const modal = document.getElementById("AddGateEntry");
                        // if (modal) {
                        //     modal.classList.remove("show");
                        //     modal.style.display = "none";
                        //     modal.setAttribute("aria-hidden", "true");

                        //     const backdrops = document.querySelectorAll(".modal-backdrop");
                        //     backdrops.forEach((backdrop) => {
                        //         backdrop.parentNode.removeChild(backdrop);
                        //     });

                        //     document.body.classList.remove("modal-open");
                        //     document.body.style.overflow = "auto";
                        //     document.body.style.paddingRight = "";
                        // }
                        if (onRefresh) {
                            onRefresh();
                        }
                    } else {
                        throw new Error("Failed to delete record.");
                    }
                } catch (error) {
                    console.error("Delete Error:", error);
                    Swal.fire({
                        icon: "error",
                        title: "त्रुटी",
                        text: "डेटा हटवता आला नाही, कृपया पुन्हा प्रयत्न करा.",
                    });
                }
            }
        });
    };


    useEffect(() => {
        const handleShortcut = (e) => {
            if (e.ctrlKey && e.key === "s" || e.ctrlKey && e.key === 'S') {
                e.preventDefault();
                if (iscompleted == true || iscompleted == 1) {
                    Swal.fire({
                        icon: "error",
                        title: "त्रुटी",
                        text: "लिलाव पूर्ण झाला आहे, त्यामुळे या टोकनची माहिती बदलू शकत नाही.",
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                    });
                } else {
                    handleAddProduct();
                }
            }

            if (e.ctrlKey && e.key === "e" || e.ctrlKey && e.key === 'E') {
                // e.preventDefault();
                setDetailData({
                    dpkid: '',
                    date: formatToDateTimeLocal(userdetail.APPDT),
                    vehno: 'MH',
                    mobileno: '',
                    aadharno: '',
                    crop_type: '',
                    maid: "",
                    fname: "",
                    village: "",
                    toknno: ""
                });
                setTableData([]);

                const modal = document.getElementById("AddGateEntry");
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

                if (onRefresh) {
                    onRefresh();
                }
            }
            if (e.ctrlKey && e.key === "f" || e.ctrlKey && e.key === 'F') {
                e.preventDefault();
                const modalTrigger = document.querySelector('[data-bs-target="#Farmerfrom_1"]');
                if (modalTrigger) {
                    modalTrigger.click();
                }
            }

            if (e.ctrlKey && e.key === "t" || e.ctrlKey && e.key === 'T') {
                e.preventDefault();
                const modalTrigger = document.querySelector('[data-bs-target="#Tranporterfrom_1"]');
                if (modalTrigger) {
                    modalTrigger.click();
                }
            }

        };

        window.addEventListener("keydown", handleShortcut);

        return () => {
            window.removeEventListener("keydown", handleShortcut);
        };
    }, [detailData, navigate, route.GateEntry, handleSubmit]);

    const handleKeyDown = (e, nextRef) => {
        if (e.key === 'Enter' && nextRef.current) {
            nextRef.current.focus();
            e.preventDefault();
        }
    };

    useEffect(() => {
        const today = new Date().toISOString().split("T")[0];
        setDetailData((prev) => ({ ...prev, DATE: today }));
    }, []);


    const handleNewEntry = async () => {
        alert("msg send successfully");
        if (Crop_TYPE.length === 0) {
            console.warn("Crop_TYPE data is not available yet.");
            return;
        }

        const defaultCrop = Crop_TYPE.find(option => option.label === "डाळिंब") || Crop_TYPE[0];
        const today = convertToCustomDate(userdetail.APPDT, 0);
        try {

            const payload = tableData.map(row => ({
                dpkid: row.dpkid
            }));

            const headers = {
                'Content-Type': 'application/json',
                Accept: '*/*',
            };

            const response = await axios.post(
                `${baseUrl.Url}/backend/api/SP_VerifyGateEntry`,
                payload,
                { headers }
            );

            if (response.status === 200) {
                console.log("responce update vrify", response.data)
            }

            const newUid = ACSPLGUID.getNew();
            setUid(newUid);
            setDetailData({
                ...detailData,
                vehno: 'MH',
                date: formatToDateTimeLocal(userdetail.APPDT),
                aadharno: "",
                mobileno: "",
                crop_type: defaultCrop ? defaultCrop.value : "",
                village: "",
                toknno: "",
                uid: newUid,

            });

            // setDetailData({
            //     ...detailData,
            //     toknno: currentCount
            // });

            console.log('Generated new token:', currentCount);

        } catch (error) {
            console.error('Error generating new token:', error);
        }

        setTableData([]);

    };

    // const showExitAlert = () => {
    //     MySwal.fire({
    //         title: "तुम्हाला खात्री आहे का?",
    //         text: "तुम्हाला मागे जायचं आहे का?",
    //         showCancelButton: true,
    //         confirmButtonColor: "#00ff00",
    //         confirmButtonText: "हो",
    //         cancelButtonColor: "#092C4C",
    //         cancelButtonText: "नाही",
    //     }).then((result) => {
    //         if (result.isConfirmed) {
    //             setDetailData({
    //                 dpkid: '',
    //                 date: convertToCustomDate(userdetail.APPDT, 0),
    //                 vehno: 'MH',
    //                 mobileno: '',
    //                 aadharno: '',
    //                 crop_type: '',
    //                 maid: "",
    //                 fname: "",
    //                 village: "",
    //                 toknno: ""
    //             });
    //             setTableData([]);
    //             const modal = document.getElementById("AddGateEntry");
    //             if (modal) {
    //                 const existingModal = bootstrap.Modal.getInstance(modal);
    //                 if (existingModal) {
    //                     existingModal.hide();
    //                     existingModal.dispose();
    //                 }
    //                 modal.classList.remove("show");
    //                 modal.style.display = "none";
    //                 modal.removeAttribute("aria-modal");
    //                 modal.removeAttribute("role");
    //                 modal.setAttribute("aria-hidden", "true");

    //                 const modalBackdrop = document.querySelector(".modal-backdrop");
    //                 if (modalBackdrop) {
    //                     modalBackdrop.remove();
    //                 }

    //                 document.body.classList.remove("modal-open");
    //                 document.body.style.removeProperty("overflow");
    //                 document.body.style.removeProperty("padding-right");
    //             }
    //             if (onRefresh) {
    //                 onRefresh();
    //             }
    //         }
    //     });
    // };
    const closeModal = () => {
        const modal = document.getElementById("AddGateEntry");
        if (modal) {
            modal.classList.remove("show");
            modal.style.display = "none";
            modal.setAttribute("aria-hidden", "true");

            const backdrops = document.querySelectorAll(".modal-backdrop");
            backdrops.forEach((backdrop) => {
                backdrop.parentNode.removeChild(backdrop);
            });

            document.body.classList.remove("modal-open");
            document.body.style.overflow = "auto";
            document.body.style.paddingRight = "";
        }
        if (onRefresh) {
            onRefresh();
        }
    };

    window.addEventListener("popstate", () => {
        const modal = document.getElementById("AddGateEntry");
        if (modal && modal.classList.contains("show")) {
            closeModal();
        }
    });
    const showExitAlert = () => {

        setDetailData({
            dpkid: '',
            maid: '',
            vehno: 'MH',
            date: formatToDateTimeLocal(userdetail.APPDT),
            toknno: '',
            mobileno: '',
            aadharno: '',
            fname: '',
            crop_type: '',
            caretS_COUNT: '',
            village: '',
            isdeleted: 0,
        });
        setTableData([]);

        const modal = document.getElementById("AddGateEntry");
        if (modal) {
            modal.classList.remove("show");
            modal.style.display = "none";
            modal.setAttribute("aria-hidden", "true");

            const backdrops = document.querySelectorAll(".modal-backdrop");
            backdrops.forEach((backdrop) => {
                backdrop.parentNode.removeChild(backdrop);
            });

            document.body.classList.remove("modal-open");
            document.body.style.overflow = "auto";
            document.body.style.paddingRight = "";
        }
        if (onRefresh) {
            onRefresh();
        }

    };


    useEffect(() => {
        const handlePopState = () => {
            setDetailData({
                dpkid: '',
                maid: '',
                vehno: 'MH',
                date: formatToDateTimeLocal(userdetail.APPDT),
                toknno: '',
                mobileno: '',
                aadharno: '',
                fname: '',
                crop_type: '',
                caretS_COUNT: '',
                village: '',
                isdeleted: 0,
            });
            setTableData([]);

            const modal = document.getElementById("AddGateEntry");
            if (modal) {
                modal.classList.remove("show");
                modal.style.display = "none";
                modal.setAttribute("aria-hidden", "true");

                const backdrop = document.querySelector(".modal-backdrop");
                if (backdrop) backdrop.remove();

                document.body.classList.remove("modal-open");
                document.body.style.overflow = "auto";
            }
            navigate("/GateEntry");
        };

        window.onpopstate = handlePopState;


        return () => {
            window.onpopstate = null;
        };
    }, [navigate]);

    // const fetchGateEntries = async (VEHICLENO) => {

    //     try {
    //         if (!VEHICLENO || VEHICLENO.trim() === "") {
    //             console.error("❌ Error: VEHICLENO is missing or empty!");
    //             return;
    //         }

    //         const payload = {
    //             vehno: VEHICLENO.trim(),
    //             companyid: "",
    //             deptid: ""
    //         };

    //         console.log("🚀 Sending request with payload:", JSON.stringify(payload));

    //         const headers = {
    //             "Content-Type": "application/json",
    //             Accept: "*/*",
    //         };

    //         // API CALL
    //         const response = await axios.post(
    //             baseUrl.Url + "/backend/api/GET_GateEntryDetailVehno",
    //             payload,
    //             { headers }
    //         );

    //         console.log(" API Response4:", response.data);

    //         if (response.status === 200 && response.data.length > 0) {
    //             setGateEntries(response.data);


    //             // setShowModal(false);
    //             // setTimeout(() => setShowModal(true), 100);

    //             console.log("showModal set to TRUE");
    //         } else {
    //             console.warn(" No data found, closing modal!");
    //             setTableData([]);
    //             // setShowModal(false);
    //         }
    //     } catch (error) {
    //         console.error("Error fetching gate entries:", error.response?.data || error.message);
    //         setTableData([]);
    //     }
    // };

    useEffect(() => {
        console.log("Modal Open State Changed:", showModal);
    }, [showModal]);


    // const handleCheckboxChange = async (index) => {
    //     try {

    //         // setDetailData({
    //         //     ...detailData,
    //         //     toknno: newToken
    //         // });

    //         setGateEntries((prevEntries) =>
    //             prevEntries.map((entry, i) =>
    //                 i === index ? { ...entry, isChecked: !entry.isChecked, toknno: "" } : entry
    //             )
    //         );
    //         const selectedEntry = gateEntries[index];
    //         const payload = {
    //             dpkid: ACSPLGUID.getNew(),
    //             maid: selectedEntry.maid || "",
    //             toknno: "",
    //             village: selectedEntry.village || "",
    //             fullname: selectedEntry.fullname || "",
    //             caretS_COUNT: "0",
    //             isdeleted: selectedEntry.isdeleted === 1 || selectedEntry.isdeleted === true ? true : false,
    //             vehno: selectedEntry.vehno,
    //             aadharno: selectedEntry.aadharno || "",
    //             mobileno: selectedEntry.mobileno || "",
    //             croP_TYPE: selectedEntry.croP_TYPE || Crop_TYPE.find(option => option.label === "डाळिंब").value,
    //             date: formatDate(userdetail.APPDT),
    //             uid: uid,
    //             "companyid": "",
    //             "deptid": "",
    //             userid: userdetail?.uaid || "",
    //             isverified: true
    //         };
    //         // console.log("payloaddd:", payload)
    //         await axios.post(`${baseUrl.Url}/backend/api/SP_AddUpdGateEntryDetail`, payload,
    //             { headers: { "Content-Type": "application/json", Accept: "*/*" } }
    //         );
    //         // console.log("✅ Data saved successfully with Token check box entry:", newToken);

    //         fetchGateEntryDetails();
    //         // await fetchGateEntryDetails(); // wait for refresh
    //         // setShowModal(false);


    //     } catch (error) {
    //         console.error("❌ Error saving data:", error);
    //     }
    // };

    // const handleCaretCountChange1 = (value, index) => {
    //     const updated = [...gateEntries];
    //     updated[index] = { ...updated[index], caretS_COUNT: value };
    //     setGateEntries(updated);
    // };


    const handleCaretCountChange = async (newValue, row) => {
        const updatedTableData = tableData.map(item =>
            item.uid === row.uid
                ? { ...item, caretS_COUNT: newValue }
                : item
        );
        setTableData(updatedTableData);

        setGateEntries(prevEntries =>
            prevEntries.map(entry =>
                entry.uid === row.uid
                    ? { ...entry, caretS_COUNT: newValue }
                    : entry
            )
        );

        setDetailData(prev => ({
            ...prev,
            caretS_COUNT: newValue
        }));

        const savedEntry = gateEntries.find(entry => entry.uid === row.uid) || row;

        const selectedEntry = {
            ...savedEntry,
            caretS_COUNT: newValue
        };

        const payload = {
            dpkid: selectedEntry.dpkid || "",
            maid: selectedEntry.maid || "",
            toknno: selectedEntry.toknno?.toString() || "",
            village: selectedEntry.village || "",
            fullname: selectedEntry.fullname || "",
            caretS_COUNT: String(parseInt(newValue, 10) || "0"),
            isdeleted: selectedEntry.isdeleted === 1 || selectedEntry.isdeleted === true,
            vehno: selectedEntry.vehno || "",
            aadharno: selectedEntry.aadharno || selectedEntry.AADHARNO || "",
            mobileno: selectedEntry.mobileno || "",
            croP_TYPE: String(selectedEntry.crop_type || ""),
            date: convertToCustomDate(selectedEntry.date, 0) || formatDate(userdetail.APPDT),
            uid: selectedEntry.uid || "",
            "companyid": "",
            "deptid": "",
            userid: userdetail?.uaid || "",
            isverified: true
        };

        console.log(' Payload:', payload);

        try {
            const response = await axios.post(
                `${baseUrl.Url}/backend/api/SP_AddUpdGateEntryDetail`,
                payload,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "*/*",
                    },
                }
            );

            console.log(" Caret count updated successfully. Response:", response.data);

            // await fetchGateEntryDetails(); 

        } catch (error) {
            console.error("❌ Error updating caret count:", error.response?.data || error);
        }
    };

    const getTodayDate = () => {
        const now = new Date();
        return now.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:mm"
    };


    const getTomorrowDate = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:mm"
    };


    // const OnSave = () => {
    //     alert("msg send successfully")
    // }

    const [selectedData, setSelectedData] = useState({ vehno: null, refreshKey: null });

    const openModal = (vehno) => {
        setSelectedData({ vehno });
        setRefreshKey(prev => prev + 1); // force refresh, even with same vehno

        const modal = document.getElementById("FarmerDetail_1");
        const myModal = new bootstrap.Modal(modal);
        myModal.show();
    };


    const checkVehNO = async (ID) => {

        try {
            const vehNo = ID.trim().toUpperCase();

            // Vehicle number format: e.g., MH15AM1213
            const vehicleFormatRegex = /^[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{4}$/;
            if (!vehicleFormatRegex.test(vehNo)) {
                console.log("Please enter vehicle number in format: MH15AM1213")
                setTableData([]);
            } else {
                localStorage.setItem("vehNo", vehNo);
                const payload = { vehicalno: vehNo };
                console.log("🚀 Sending request with payload:", JSON.stringify(payload));

                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };

                // API CALL
                const response = await axios.post(
                    baseUrl.Url + "/backend/api/SP_CheckVehicalNo",
                    payload,
                    { headers }
                );

                console.log("API Response4:", response.data);

                if (response.data[0].isSuccessful == 0) {
                    Swal.fire({
                        icon: "error",
                        title: "त्रुटी!",
                        text: response.data[0].responseMessage,
                        confirmButtonText: "ठीक आहे",
                        allowOutsideClick: false,
                        allowEscapeKey: false,

                    }).then((result) => {
                        if (result.isConfirmed) {
                            setTableData([]);
                            localStorage.setItem("vehNo", vehNo);
                            document.querySelector('[data-bs-target="#Tranporterfrom_1"]').click();
                        }
                    });
                } else {
                    fetchGateEntryDetailsByVehno(vehNo);
                    console.warn("No data found, closing modal!");
                }
            }
        } catch (error) {
            console.error("Error fetching gate entries:", error.response?.data || error.message);
            setTableData([]);
        }
    };

    // useEffect(() => {
    //     const modal = document.getElementById("AddGateEntry");

    //     const handleModalShow = () => {
    //         const vehNo = localStorage.getItem("vehNo");
    //         console.log("Modal opened - vehNo:", vehNo);
    //         if (vehNo) {
    //             setDetailData((prev) => ({
    //                 ...prev,
    //                 vehno: vehNo,
    //             }));

    //         }
    //     };

    //     modal?.addEventListener("show.bs.modal", handleModalShow);

    //     return () => {
    //         modal?.removeEventListener("show.bs.modal", handleModalShow);
    //     };
    // }, []);

    // useEffect(() => {
    //     const modal = document.getElementById("AddGateEntry");

    //     const handleModalShow = () => {
    //         const vehNo = localStorage.getItem("vehNo");
    //         console.log("Modal opened - vehNo:", vehNo);
    //         if (vehNo) {
    //             setDetailData((prev) => ({
    //                 ...prev,
    //                 vehno: vehNo,
    //             }));


    //             localStorage.removeItem("vehNo");
    //         }
    //     };

    //     modal?.addEventListener("show.bs.modal", handleModalShow);

    //     return () => {
    //         modal?.removeEventListener("show.bs.modal", handleModalShow);
    //     };
    // }, []);

    useEffect(() => {
        const modal = document.getElementById("AddGateEntry");

        const handleModalShow = () => {
            const vehNo = localStorage.getItem("vehNo");
            const prevVehNo = localStorage.getItem("prevVehNo");

            if (vehNo) {
                if (vehNo !== prevVehNo) {
                    console.log("🚨 VEHICALNO changed (AddGateEntry), removing mobile & name");
                    localStorage.removeItem("mobile");
                    localStorage.removeItem("name");
                }

                // update prevVehNo
                localStorage.setItem("prevVehNo", vehNo);

                // Set detail data
                setDetailData((prev) => ({
                    ...prev,
                    vehno: vehNo,
                }));

                localStorage.removeItem("vehNo");
            }
        };

        modal?.addEventListener("show.bs.modal", handleModalShow);

        return () => {
            modal?.removeEventListener("show.bs.modal", handleModalShow);
        };
    }, []);

    return (
        <div>
            <div
                div className="modal fade" id="AddGateEntry" tabIndex={-1} aria-labelledby="exampleModalFullscreenLabel" aria-hidden="true" style={{ display: "none" }}
            >
                {/* <div className="modal fade" id="AddGateEntry"> */}

                <div className="modal-dialog modal-dialog-centered modal-fullscreen">
                    <div className="modal-content mbgcolor">
                        <div className="page-wrapper-new p-0">
                            <div className="content">
                                <div className="modal-header border-0 custom-modal-header">
                                    <div className="container-fluid w-100">
                                        <div className="row">
                                            {/* Title - Always full width on mobile, auto on desktop */}
                                            <div className="col-12 col-md-6 mb-2 mb-md-0 d-flex align-items-center">
                                                <h4 className="me-2">जनरेट टोकन</h4>
                                            </div>

                                            {/* Buttons - Stack vertically on mobile, inline on desktop */}
                                            <div className="col-12 col-md-6">
                                                <div className="row g-2 justify-content-md-end">
                                                    <div className="col-6 col-md-auto">
                                                        <button
                                                            type="button"
                                                            className="btn btn-primary w-100"
                                                            data-bs-toggle="modal"
                                                            data-bs-target="#Farmerfrom_1"

                                                        >
                                                            शेतकरी नोंदणी
                                                        </button>
                                                    </div>
                                                    <div className="col-6 col-md-auto">
                                                        <button
                                                            type="button"
                                                            className="btn btn-primary w-100"
                                                            data-bs-toggle="modal"
                                                            data-bs-target="#Tranporterfrom_1"
                                                        >
                                                            वाहन चालक नोंदणी
                                                        </button>
                                                    </div>
                                                    <div className="col-12 col-md-auto">
                                                        <button
                                                            type="button"
                                                            className="btn btn-secondary w-100"
                                                            onClick={showExitAlert}>

                                                            मागे
                                                        </button>
                                                        {/* <Link className="btn btn-secondary"
                                                            onClick={showExitAlert}>

                                                            मागे
                                                        </Link> */}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>


                                <div className="modal-body custom-modal-body">
                                    <form onSubmit={handleSubmit}>
                                        <div className="row container-fluid g-0 g-md-2">
                                            {/* दिनांक */}
                                            <div className="col-6 col-md-6 col-lg-2 mb-2 pe-0">
                                                <label className="form-label required">दिनांक</label>
                                                {/* <input
                                                    ref={DATERef}
                                                    type="date"
                                                    className="form-control"
                                                    name="date"
                                                    value={detailData.date}
                                                    onChange={handleInputChange}
                                                    onKeyDown={(e) => handleKeyDown(e, VEHNORef)}
                                                    min={getTodayDate()}
                                                    max={getTomorrowDate()}
                                                    required
                                                /> */}
                                                <input
                                                    ref={DATERef}
                                                    type="datetime-local"
                                                    className="form-control"
                                                    name="date"
                                                    value={detailData.date}
                                                    onChange={handleInputChange}
                                                    onKeyDown={(e) => handleKeyDown(e, VEHNORef)}
                                                    min={getTodayDate()}
                                                    max={getTomorrowDate()}
                                                    required
                                                />

                                            </div>



                                            {/* पिकाचा प्रकार */}
                                            <div className="col-12 col-md-6 col-lg-4 mb-2 pe-0">
                                                <label className="form-label required">पिकाचा प्रकार</label>
                                                <Select
                                                    openMenuOnFocus={true}
                                                    ref={CROP_TYPERef}
                                                    classNamePrefix="react-select"
                                                    options={Crop_TYPE}
                                                    value={Crop_TYPE.find(option => String(option.value) === String(detailData.crop_type || "डाळिंब")) || null}
                                                    onChange={(selectedOption) => {
                                                        handleSelectChange(selectedOption);
                                                        setDetailData(prev => ({
                                                            ...prev,
                                                            crop_type: selectedOption?.value || ""
                                                        }));
                                                        if (AddRef?.current) AddRef.current.focus();
                                                    }}
                                                />
                                            </div>
                                            {/* वाहन क्रमांक */}
                                            <div className="col-sm-12 col-md-6 col-lg-2 mb-2 pe-0">
                                                <label className="form-label required">वाहन क्रमांक</label>
                                                <input
                                                    ref={VEHNORef}
                                                    type="text"
                                                    className="form-control"
                                                    name="vehno"
                                                    value={detailData.vehno}
                                                    onChange={(e) => {

                                                        let inputValue = e.target.value.toUpperCase();
                                                        if (!inputValue.startsWith("MH")) {
                                                            inputValue = "MH" + inputValue.replace(/^MH\s*/, "");
                                                        }
                                                        inputValue = inputValue.replace(/\s+/g, "").replace(/\//g, "");
                                                        handleInputChange({ target: { name: "vehno", value: inputValue } });

                                                        checkVehNO(inputValue);
                                                        setvehicalnum(inputValue)
                                                    }}
                                                    onKeyDown={(e) => handleKeyDown(e, AADHARNORef)}
                                                    style={{ fontWeight: "900", border: "2px solid #ff9800", fontSize: "1rem" }}
                                                    required
                                                    readOnly={dpkid !== null && iscompleted !== false && dpkid !== undefined && iscompleted !== undefined}
                                                />
                                            </div>
                                            <div className="col-md-3"></div>

                                            {/* टोकन क्रमांक */}
                                            {/* <div className="col-12 col-md-6 col-lg-2 mb-2 pe-0">
                                                <label className="required">टोकन क्रमांक</label>
                                                <div className="d-flex">
                                                    <input
                                                        ref={TOKANNORef}
                                                        type="text"
                                                        className="form-control"
                                                        name="toknno"
                                                        value={detailData.toknno}
                                                        onKeyDown={(e) => handleKeyDown(e, DATERef)}
                                                        readOnly
                                                        style={{ fontWeight: "900", backgroundColor: "#ffeb3b", border: "2px solid #ff9800", textAlign: "center" }}
                                                    />
                                                </div>
                                            </div>*/}

                                            {/* आधार क्रमांक */}
                                            <div className="col-12 col-md-6 col-lg-2 mb-2 pe-0">
                                                <label className="form-label">आधार क्रमांक</label>
                                                <input
                                                    ref={AADHARNORef}
                                                    type="tel"
                                                    className="form-control"
                                                    name="aadharno"
                                                    value={detailData.aadharno}
                                                    onChange={handleInputChange}
                                                    onKeyDown={(e) => handleKeyDown(e, MOBILENORef)}
                                                    inputMode="numeric"
                                                    pattern="[0-9]{12}"
                                                />
                                            </div>

                                            {/* मोबाईल क्रमांक */}
                                            <div className="col-12 col-md-6 col-lg-2 mb-2 pe-0">
                                                <label className="form-label required">मोबाईल क्रमांक</label>
                                                <input
                                                    ref={MOBILENORef}
                                                    type="tel"
                                                    className="form-control"
                                                    name="mobileno"
                                                    value={detailData.mobileno}
                                                    onChange={handleInputChange}
                                                    onKeyDown={(e) => handleKeyDown(e, FULLNAMERef)}
                                                    inputMode="numeric"
                                                    pattern="[0-9]*"
                                                />
                                            </div>

                                            {/* शेतकऱ्याचे नाव
                                            <div className="col-12 col-md-5 col-lg-6 mb-2 pe-0">
                                                <label className="form-label required">शेतकऱ्याचे नाव</label>
                                                <Select
                                                    ref={FULLNAMERef}
                                                    placeholder="Select Farmer"
                                                    classNamePrefix="react-select"
                                                    openMenuOnFocus={true}
                                                    options={Farmer}
                                                    value={Farmer.find((option) => option.value === detailData.maid) || null}
                                                    onChange={(selectedOption) => {
                                                        handleFarmerChange(selectedOption);
                                                        setDetailData(prevState => ({
                                                            ...prevState,
                                                            maid: selectedOption ? selectedOption.value : '',
                                                        }));
                                                        if (CARETS_COUNTRef?.current) CARETS_COUNTRef.current.focus();
                                                    }}
                                                    required
                                                />
                                            </div> */}
                                            {/* शेतकऱ्याचे नाव */}
                                            <div className="col-12 col-md-5 col-lg-6 mb-2 pe-0">
                                                <label className="form-label required">शेतकऱ्याचे नाव</label>
                                                <Select
                                                    ref={FULLNAMERef}
                                                    placeholder="शेतकरी निवडा"
                                                    classNamePrefix="शेतकरी निवडा"
                                                    openMenuOnFocus={true}
                                                    options={
                                                        detailData.mobileno?.length === 0
                                                            ? Farmer
                                                            : showFarmerSelect && farmerMatches.length > 0
                                                                ? farmerMatches
                                                                : Farmer
                                                    }
                                                    value={
                                                        (detailData.mobileno?.length === 0
                                                            ? Farmer.find((option) => option.value === detailData.maid)
                                                            : showFarmerSelect && farmerMatches.length > 0
                                                                ? farmerMatches.find((option) => option.value === detailData.maid)
                                                                : Farmer.find((option) => option.value === detailData.maid)
                                                        ) || null
                                                    }
                                                    // isDisabled={!showFarmerSelect && !!detailData.maid && detailData.mobileno?.length !== 0}
                                                    onChange={(selectedOption) => {
                                                        if (!selectedOption) return;

                                                        const farmerData = selectedOption.data || {};
                                                        handleFarmerChange(selectedOption);
                                                        setDetailData(prevState => ({
                                                            ...prevState,
                                                            maid: selectedOption.value,
                                                            fname: selectedOption.label,
                                                            mobileno: farmerData.fcontactno || "",
                                                            aadharno: farmerData.faddharno || "",
                                                            village: farmerData.district || "",
                                                        }));
                                                        setShowFarmerSelect(false);
                                                        if (CARETS_COUNTRef?.current) CARETS_COUNTRef.current.focus();
                                                    }}
                                                    styles={{
                                                        control: (base) => ({
                                                            ...base,
                                                            minHeight: '31px',
                                                            height: '31px',
                                                            fontSize: '14px',
                                                            border: '1px solid black',
                                                            boxShadow: 'none',
                                                            '&:hover': {
                                                                border: '1px solid black',
                                                            },
                                                        }),
                                                    }}
                                                    required

                                                />

                                            </div>

                                            {/* जाळी संख्या */}
                                            <div className="col-12 col-md-2 col-lg-2 mb-2 pe-0">
                                                <label className="form-label required">जाळी संख्या</label>
                                                <input
                                                    ref={CARETS_COUNTRef}
                                                    type="tel"
                                                    className="form-control"
                                                    name="caretS_COUNT"
                                                    value={detailData.caretS_COUNT}
                                                    onChange={handleInputChange}
                                                    onKeyDown={(e) => handleKeyDown(e, VILLAGERef)}
                                                    inputMode="numeric"
                                                    pattern="[0-9]*"
                                                />
                                            </div>

                                            {/* गावाचे नाव */}
                                            <div className="col-12 col-md-8 col-lg-8 mb-2 pe-0">
                                                <label className="form-label">गावाचे नाव</label>
                                                <input
                                                    ref={VILLAGERef}
                                                    type="text"
                                                    className="form-control"
                                                    name="village"
                                                    value={detailData.village || ""}
                                                    onChange={handleInputChange}
                                                    onKeyDown={(e) => handleKeyDown(e, CROP_TYPERef)}
                                                />
                                            </div>

                                            {/* टोकन नोंदवा */}
                                            <div className="col-12 col-md-6 col-lg-2 mt-3 mb-2 pe-0">
                                                <button
                                                    ref={AddRef}
                                                    type="button"
                                                    className="btn btn-primary mt-3 w-100"
                                                    onClick={handleAddProduct}
                                                >
                                                    टोकन नोंदवा
                                                </button>
                                            </div>
                                        </div>

                                        {/* Data Table */}
                                        <div className="modal-body-table responsive-no-scroll">
                                            <div className="table-responsive">
                                                <table className="table table-bordered table-striped mb-0">
                                                    <thead className="thead-dark bg-dark text-white">
                                                        <tr>
                                                            <th>टो.नं.</th>
                                                            <th>नाव</th>
                                                            <th>जा.सं.</th>
                                                            <th>कृती</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {tableData.length > 0 ? (
                                                            tableData.map((row, index) => (
                                                                <tr key={row.dpkid || row.vehno || index}>
                                                                    <td>{row.toknno ?? "No Token"}</td>
                                                                    <td>{row.fullname ?? row.fname ?? "No Name"}</td>
                                                                    <td>
                                                                        <input
                                                                            type="text"
                                                                            className="form-control"
                                                                            value={row.caretS_COUNT || ""}
                                                                            onChange={(e) => handleCaretCountChange(e.target.value, row)}
                                                                            readOnly={
                                                                                dpkid !== null &&
                                                                                iscompleted !== false &&
                                                                                dpkid !== undefined &&
                                                                                iscompleted !== undefined
                                                                            }
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <Link
                                                                            to="#"
                                                                            onClick={() => handleDelete(row.dpkid)}
                                                                            className="btn btn-sm"
                                                                        >
                                                                            <Trash2 className="feather-trash-2" />
                                                                        </Link>
                                                                        {/* <Link
                                                                            to="#"
                                                                            className="btn btn-sm"
                                                                            onClick={() => handleDelete(row.dpkid)}
                                                                        >
                                                                            <Trash2 className="feather-trash-2" />
                                                                        </Link> */}
                                                                    </td>
                                                                </tr>
                                                            ))
                                                        ) : (
                                                            <tr>
                                                                <td colSpan="4" className="text-center">
                                                                    No Data Available
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>




                                        {/* Save Button */}
                                        <div className="row d-flex justify-content-md-end g-2 mb-2 mt-0">
                                            <div className="col-12 col-md-6 col-lg-2">
                                                <button type="button" className="btn btn-primary w-100" onClick={handleNewEntry}>
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
            </div >

            {/* <div className="container mt-3 p-3">
          
                {showModal && gateEntries.length > 0 && (
                    <>
                        <div
                            className="modal show d-block"
                            tabIndex="-1"
                            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                        >
                            <div className="modal-dialog modal-dialog-centered">
                                <div
                                    className="modal-content"
                                    style={{
                                        width: '500px',
                                        height: '500px',
                                        backgroundColor: '#d0e7f9',
                                        borderRadius: '10px',
                                        overflow: 'hidden',
                                    }}
                                >
                                    <div className="bg-light text-dark d-flex justify-content-between align-items-center p-3 border-bottom" style={{ backgroundColor: '#B3C8CF' }}>
                                        <h4 className="modal-title m-0" >Gate Entry Details</h4>
                                        <button
                                            type="button"
                                            className="btn-close"
                                            onClick={() => setShowModal(false)}
                                        />
                                    </div>

                                    <div className="modal-body p-2">
                                        <div className="table-responsive" style={{ height: '420px', overflowY: 'auto' }}>
                                     
                                            <table className="table table-bordered border-dark mb-0">
                                                <thead className="thead-dark bg-dark text-white text-center">
                                                    <tr>
                                                        <th style={{ width: '15%' }}>निवडा</th>
                                                        <th style={{ width: '85%' }}>शेतकऱ्याचे नाव</th>
                                                    </tr>
                                                </thead>
                                            </table>

                                            <div style={{ maxHeight: 'calc(100% - 40px)', overflowY: 'auto' }}>
                                                <table className="table table-bordered border-dark mb-0">
                                                    <tbody>
                                                        {gateEntries.map((entry, index) => (
                                                            <tr key={index}>
                                                                <td
                                                                    className="text-center align-middle"
                                                                    style={{ width: '15%' }}
                                                                >
                                                                    <input
                                                                        type="checkbox"
                                                                        className="form-check-input"
                                                                        style={{ transform: 'scale(2)', cursor: 'pointer' }}
                                                                        checked={entry.isChecked || false}
                                                                        onChange={() => handleCheckboxChange(index)}
                                                                    />
                                                                </td>
                                                                <td style={{ width: '70%' }}>{entry.fullname}</td>
                                                               
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div
                            className="modal-backdrop show"
                            style={{ backdropFilter: 'blur(5px)' }}
                            onClick={() => setShowModal(false)}
                        ></div>
                    </>
                )}
            </div> */}

            <AddQuickFarmer_1 />
            {/* <AddQuickTrasporter /> */}
            <AddQuickTrasporter_1 />
            <VehicalFarmers VEHICLENO_={selectedData.vehno} refreshKey={refreshKey} onClose={fetchGateEntryDetailsdata} />



        </div >
    );
};

export default AddGateEntry;
