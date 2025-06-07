import { Link } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";
import Select from "react-select";
import { Trash2, Edit } from "feather-icons-react/build/IconComponents";
import { baseUrl, ACSPLGUID, Accounts } from "../../core/json/custom";
import axios from 'axios';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { getUserData } from '../../Context/UserData';
import AddCash from "./AddCash";
// import Verification from "../../core/modals/inventory/verification";

const AddVoucher = ({ voucherAID, onRefresh }) => {

    const GUID = ACSPLGUID.getNew()
    console.log(GUID)
    const { userdetail } = getUserData();
    console.log('vmkid  ', voucherAID)


    const DepositRef = useRef(null);
    const ReferenceRef = useRef(null);
    const AmountRef = useRef(null);
    const Deposit1Ref = useRef(null);
    const msgRef = useRef(null);
    const Reference1Ref = useRef(null);
    const Amount1Ref = useRef(null);
    const msg1Ref = useRef(null);
    const Deposit2Ref = useRef(null);
    const Reference2Ref = useRef(null);
    const Amount2Ref = useRef(null);
    const msg2Ref = useRef(null);
    const DepositnameRef = useRef(null);
    const Depositname1Ref = useRef(null);


    const handleKeyDown = (e, nextRef) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (nextRef && nextRef.current) {
                nextRef.current.focus();
            }
        }
    };

    const [formData, setFormData] = useState({
        Deposit: '',
        Reference: '',
        Amount: '',
        msg: '',
        Deposit1: '',
        Reference1: '',
        Amount1: '',
        msg1: '',
        Depositname: '',
        Deposit2: '',
        Reference2: '',
        Amount2: '',
        msg2: '',
        VMKID: '',
        Date: '',


    });

    // const [status, setStatus] = useState('निष्क्रिय');
    const [exit, setexit] = useState(false);
    const [activeTab, setActiveTab] = useState('nav-cart-justified');
    const [selectedRelid, setSelectedRelid] = useState("");
    const [tableData, setTableData] = useState([]);
    const [tableData1, setTableData1] = useState([]);
    const [tableData2, setTableData2] = useState([]);


    const handleTabClick = async (tabName) => {
        if (activeTab !== tabName) {
            setActiveTab(tabName);
            setexit(prev => !prev)

        }

        setFormData({

            Deposit: '',
            Amount: '',
            msg: '',
            Reference: '',
            Deposit1: '',
            Amount1: '',
            msg1: '',
            Reference1: '',
            Deposit2: '',
            Amount2: '',
            msg2: '',
            Reference2: '',
        });
    };


    const [voucherNumber, setVoucherNumber] = useState("");
    const generateVoucherNumber = () => {
        const number = Math.floor(100 + Math.random() * 900);
        return `VN${number}`;

    };

    const handleModalClose = (result) => {
        handleSucess();
        console.log("Modal resultModal resultModal resultModal resultModal result:", result);

    };



    useEffect(() => {

        if (activeTab === 'nav-products-justified') {

            if (DepositRef.current) {
                DepositRef.current.focus();
            }
        } else if (activeTab === 'nav-cart-justified') {
            if (Deposit1Ref.current) {
                Deposit1Ref.current.focus();
            }
        } else if (activeTab === 'nav-orders-justified') {
            if (DepositnameRef.current) {
                DepositnameRef.current.focus();
            }
        }
    }, [onRefresh, activeTab]);

    useEffect(() => {
        const newVoucher = generateVoucherNumber();
        setVoucherNumber(newVoucher);
    }, [exit]);

    useEffect(() => {
        const tabs = [
            'nav-products-justified',
            'nav-cart-justified',
            'nav-orders-justified'
        ];

        const handleShortcut = (e) => {
            if (e.ctrlKey && e.key === 'e' || e.ctrlKey && e.key === 'E') {
                e.preventDefault();
                showExitAlert();
            }
            if (e.ctrlKey && e.key === 's' || e.ctrlKey && e.key === 'S') {
                e.preventDefault();
                validateinput(e);
            }
            if (e.ctrlKey && e.key === 'm' || e.ctrlKey && e.key === 'M') {
                e.preventDefault();
                const currentIndex = tabs.indexOf(activeTab);
                const nextIndex = (currentIndex + 1) % tabs.length;
                setActiveTab(tabs[nextIndex]);
            }

        };

        window.addEventListener('keydown', handleShortcut);

        return () => {
            window.removeEventListener('keydown', handleShortcut);
        };
    },);

    const validateinput = (e) => {
        if (activeTab === 'nav-products-justified') {
            const { Deposit, Reference, Amount } = formData;

            if ((!Deposit || Deposit === '') ||
                (!Reference || Reference === '') ||
                (!Amount || !/^\d+(\.\d+)?$/.test(Amount))
            ) {
                Swal.fire({
                    icon: "error",
                    title: "सत्यापन त्रुटी",
                    text: "कृपया सर्व आवश्यक फील्ड भरा",
                    confirmButtonText: "ठीक आहे",
                }).then(() => {
                    DepositRef.current.focus();
                    AmountRef.current.focus();
                    ReferenceRef.current.focus();

                })
                return;
            }
            handleSubmit(e);
        } else if (activeTab === 'nav-cart-justified') {
            const { Deposit1, Reference1, Amount1 } = formData;

            if ((!Deposit1 || Deposit1 === '') ||
                (!Reference1 || Reference1 === '') ||
                (!Amount1 || !/^\d+(\.\d+)?$/.test(Amount1))
            ) {
                Swal.fire({
                    icon: "error",
                    title: "सत्यापन त्रुटी",
                    text: "कृपया सर्व आवश्यक फील्ड भरा",
                    confirmButtonText: "ठीक आहे",
                }).then(() => {
                    Deposit1Ref.current.focus();
                    Amount1Ref.current.focus();
                    Reference1Ref.current.focus();

                })
                return;
            }
            handleSubmit(e);
        } else if (activeTab === 'nav-orders-justified') {
            const { Deposit2, Reference2, Amount2 } = formData;

            if ((!Deposit2 || Deposit2 === '') ||
                (!Reference2 || Reference2 === '') ||
                (!Amount2 || !/^\d+(\.\d+)?$/.test(Amount2))
            ) {
                Swal.fire({
                    icon: "error",
                    title: "सत्यापन त्रुटी",
                    text: "कृपया सर्व आवश्यक फील्ड भरा",
                    confirmButtonText: "ठीक आहे",
                }).then(() => {
                    Deposit2Ref.current.focus();
                    Amount2Ref.current.focus();
                    Reference2Ref.current.focus();

                })
                return;
            }
            handleSubmit(e);
        }
    }

    const [currentDate, setCurrentDate] = useState('');

    useEffect(() => {

        const today = new Date();
        const formattedDate = userdetail.APPDT;
        setCurrentDate(formattedDate);
        setFormData(prev => ({
            ...prev,
            Date: formattedDate
        }));
    }, [exit]);
    console.log('DateDateDate', formData.Date)
    console.log('currentDate', currentDate)


    // const [farmer, setfarmer] = useState([]);
    // useEffect(() => {
    //     const fetchCounter = async () => {
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
    //                 throw new Error("Failed to fetch vendor data");
    //             console.log("requisition setails", response.data)
    //             const data = response.data;
    //             const conuterData = data
    //                 .map(({ fname, faid }) => ({
    //                     label: fname,
    //                     value: faid
    //                 }));

    //             setfarmer(conuterData);
    //         } catch (error) {
    //             console.error("Error fetching vendor data:", error);
    //         }
    //     };
    //     fetchCounter();
    // }, []);


    // for refresh

    // useEffect(() => {
    //     console.log("useEffect triggered");
    //     const fetchServiceCharge = async () => {
    //         try {
    //             const payload =
    //             {
    //                 "voucherAID": "%",
    //                 "organizationID": userdetail?.companyID ? userdetail.companyID : "",
    //                 "divisionID": userdetail?.departmentID ? userdetail.departmentID : "",
    //             };

    //             const headers = {
    //                 "Content-Type": "application/json",
    //                 Accept: "*/*",
    //             };
    //             const response = await axios.post(
    //                 `${baseUrl.Url}/backend/api/GET_VoucherJama`,

    //                 payload,
    //                 { headers }
    //             );
    //             if (response.status !== 200)
    //                 throw new Error("Failed to fetch vendor data");
    //             console.log("quatation master", response.data)
    //             setTableData(response.data);
    //         } catch (error) {
    //             console.error("Error fetching vendor data:", error);
    //         }
    //     };

    //     fetchServiceCharge();

    // }, []);






    // useEffect(() => {
    //     console.log("useEffect triggered");
    //     const fetchServiceCharge = async () => {
    //         try {
    //             const payload =
    //             {
    //                 "voucherAID": "%",
    //                 "organizationID": userdetail?.companyID ? userdetail.companyID : "",
    //                 "divisionID": userdetail?.departmentID ? userdetail.departmentID : "",
    //             };

    //             const headers = {
    //                 "Content-Type": "application/json",
    //                 Accept: "*/*",
    //             };
    //             const response = await axios.post(
    //                 `${baseUrl.Url}/backend/api/GET_VoucherNave`,

    //                 payload,
    //                 { headers }
    //             );
    //             if (response.status !== 200)
    //                 throw new Error("Failed to fetch vendor data");
    //             console.log("quatation master", response.data)
    //             setTableData1(response.data);
    //         } catch (error) {
    //             console.error("Error fetching vendor data:", error);
    //         }
    //     };

    //     fetchServiceCharge();

    // }, []);



    // useEffect(() => {
    //     console.log("useEffect triggered");
    //     const fetchServiceCharge = async () => {
    //         try {
    //             const payload =
    //             {
    //                 "voucherAID": "%",
    //                 "organizationID": userdetail?.companyID ? userdetail.companyID : "",
    //                 "divisionID": userdetail?.departmentID ? userdetail.departmentID : "",
    //             };

    //             const headers = {
    //                 "Content-Type": "application/json",
    //                 Accept: "*/*",
    //             };
    //             const response = await axios.post(
    //                 `${baseUrl.Url}/backend/api/GET_VoucherJamaNave`,

    //                 payload,
    //                 { headers }
    //             );
    //             if (response.status !== 200)
    //                 throw new Error("Failed to fetch vendor data");
    //             console.log("quatation master", response.data)
    //             setTableData2(response.data);
    //         } catch (error) {
    //             console.error("Error fetching vendor data:", error);
    //         }
    //     };

    //     fetchServiceCharge();

    // }, []);



    // for edit

    useEffect(() => {
        console.log("useEffect triggered");
        const fetchServiceCharge = async () => {
            try {
                const payload =
                {
                    "voucherAID": voucherAID ? voucherAID.toString() : "%",
                    "organizationID": userdetail?.companyID ? userdetail.companyID : "",
                    "divisionID": userdetail?.departmentID ? userdetail.departmentID : "",
                };

                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };
                const response = await axios.post(
                    `${baseUrl.Url}/backend/api/GET_VoucherNave`,

                    payload,
                    { headers }
                );
                if (response.status !== 200)
                    throw new Error("Failed to fetch vendor data");
                console.log("quatation master", response.data)
                let filteredData = response.data;

                // Only filter if voucherAID is not provided
                if (!voucherAID) {
                    filteredData = response.data.filter(item => item.status == 0 && item.cracc != "PK0034");
                }

                setTableData1(filteredData);
            } catch (error) {
                console.error("Error fetching vendor data:", error);
            }
        };

        fetchServiceCharge();

    }, [voucherAID]);


    useEffect(() => {
        console.log("useEffect triggered");
        const fetchServiceCharge = async () => {
            try {
                const payload =
                {
                    "voucherAID": voucherAID ? voucherAID.toString() : "%",
                    "organizationID": userdetail?.companyID ? userdetail.companyID : "",
                    "divisionID": userdetail?.departmentID ? userdetail.departmentID : "",
                };

                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };
                const response = await axios.post(
                    `${baseUrl.Url}/backend/api/GET_VoucherJama`,

                    payload,
                    { headers }
                );
                if (response.status !== 200)
                    throw new Error("Failed to fetch vendor data");
                console.log("quatation master", response.data)
                let filteredData = response.data;

                // Only filter if voucherAID is not provided
                if (!voucherAID) {
                    filteredData = response.data.filter(item => item.status == 0 && item.dracc != "PK0034");
                }

                setTableData(filteredData);
            } catch (error) {
                console.error("Error fetching vendor data:", error);
            }
        };

        fetchServiceCharge();

    }, [voucherAID]);


    useEffect(() => {
        console.log("useEffect triggered");
        const fetchServiceCharge = async () => {
            try {
                const payload =
                {
                    "voucherAID": voucherAID ? voucherAID : "%",
                    "organizationID": userdetail?.companyID ? userdetail.companyID : "",
                    "divisionID": userdetail?.departmentID ? userdetail.departmentID : "",
                };

                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };
                const response = await axios.post(
                    `${baseUrl.Url}/backend/api/GET_VoucherJamaNave`,

                    payload,
                    { headers }
                );
                if (response.status !== 200)
                    throw new Error("Failed to fetch vendor data");
                console.log("quatation master", response.data)
                let filteredData = response.data;

                // Only filter if voucherAID is not provided
                if (!voucherAID) {
                    filteredData = response.data.filter(item => item.status == 0);
                }

                setTableData2(filteredData);
            } catch (error) {
                console.error("Error fetching vendor data:", error);
            }
        };

        fetchServiceCharge();

    }, [voucherAID]);

    // for refrence

    const [farmer, setfarmer] = useState([]);
    const [jamaname, setIamaame] = useState([]);
    useEffect(() => {
        const fetchCounter = async () => {
            try {
                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };
                const payload = {
                };
                const response = await axios.post(
                    `${baseUrl.Url}/backend/api/GET_AccountACCTM`,
                    payload,
                    { headers }
                );
                if (response.status !== 200)
                    throw new Error("Failed to fetch vendor data");
                console.log("requisition setails", response.data)
                const data = response.data;
                const conuterData = data
                    .map(({ acctm, sglrpid, relid }) => ({
                        label: acctm,
                        value: sglrpid,
                        name: relid
                    }));

                setIamaame(conuterData);

            } catch (error) {
                console.error("Error fetching vendor data:", error);
            }
        };
        fetchCounter();
    }, []);


    useEffect(() => {
        if (selectedRelid.length > 0) {
            console.log("selectedRelidselectedRelid", selectedRelid)

            if (selectedRelid == 1) {
                setfarmer([]);
            }
            else if (selectedRelid == 2) {
                fetchFarmer();
            }
            else if (selectedRelid == 3) {
                fetchCustomerName();
            }
            else if (selectedRelid == 8) {
                fetchCustomerName();
            }
            else if (selectedRelid == 7) {
                fetchAllDropdownOptions();
            }
            else if (selectedRelid == 6) {
                fetchBankName();
            }
            else {
                setfarmer([]);
            }
        }
    }, [selectedRelid]);


    const fetchFarmer = async () => {
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


    const fetchCustomerName = async () => {
        try {
            const payload = {
                "ctaid": "%",
                "companyid": "COMP123456789",
                "deptid": "D001",
                "ctype": '2'
            }
            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            axios({
                method: "POST",
                url: baseUrl.Url + "/backend/api/GET_CategoryCustomer",
                data: JSON.stringify(payload),
                headers: headers,
            })
                .then((response) => {
                    if (response.status != 200) throw new Error("Failed to Fetching Data");
                    const DATA = response.data;
                    const formofvendorData = DATA
                        .map(({ ccompanyname, caid }) => ({
                            label: ccompanyname,
                            value: caid,
                        }));
                    setfarmer(formofvendorData);
                })

        } catch (error) {
            console.error("Error fetching Access Right Data:", error);
        }

    };




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
            console.log("requisition setails", response.data)
            const data = response.data;
            const conuterData = data
                .map(({ bankname, bankid }) => ({
                    label: bankname,
                    value: bankid
                }));

            setfarmer(conuterData);
        } catch (error) {
            console.error("Error fetching vendor data:", error);
        }
    };

    const fetchAllDropdownOptions = async () => {
        try {
            const [farmerList, bankList, customerList] = await Promise.all([
                getFarmerList(),
                getBankList(),
                getCustomerList()
            ]);

            const combinedList = [...farmerList, ...bankList, ...customerList];
            setfarmer(combinedList); // Now all in one dropdown
        } catch (error) {
            console.error("Error fetching combined dropdown options:", error);
        }
    };


    const getFarmerList = async () => {
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
            throw new Error("Failed to fetch farmer data");

        return response.data.map(({ fname, faid }) => ({
            label: fname,
            value: faid
        }));
    };

    const getBankList = async () => {
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
            throw new Error("Failed to fetch bank data");

        return response.data.map(({ bankname, bankid }) => ({
            label: bankname,
            value: bankid
        }));
    };

    const getCustomerList = async () => {
        const headers = {
            "Content-Type": "application/json",
            Accept: "*/*",
        };

        const payload = {
            "ctaid": "%",
            "companyid": "COMP123456789",
            "deptid": "D001",
            "ctype": '2'
        };

        const response = await axios.post(
            `${baseUrl.Url}/backend/api/GET_CategoryCustomer`,
            payload,
            { headers }
        );

        if (response.status !== 200)
            throw new Error("Failed to fetch customer data");

        return response.data.map(({ ccompanyname, caid }) => ({
            label: ccompanyname,
            value: caid
        }));
    };



    const [ServiceType, setServiceType] = useState([]);
    useEffect(() => {
        const fetchServiceTypes = async () => {
            try {
                const response = await axios.get(
                    baseUrl.Url + "/backend/api/Implications/GERNALTYPE",
                );
                if (response.status !== 200) throw new Error("Failed to fetch implications data");
                const data = response.data;
                const implicationsDropdown = data.map(({ iTitle, iValue }) => ({
                    label: iTitle,
                    value: iValue,
                }));
                setServiceType(implicationsDropdown);
            } catch (error) {
                console.error("Error fetching implications:", error);
            }
        };
        fetchServiceTypes();
    }, []);



    const [editingVmkid, setEditingVmkid] = useState(null);

    // const handleEdit = (vmkid) => {
    //     const rowToEdit = tableData.find(row => row.vmkid === vmkid);

    //     if (rowToEdit) {

    //         setVoucherNumber(rowToEdit.voucherNumber)
    //         setFormData({
    //             Deposit: jamaname.find(option => option.label === rowToEdit.depositename)?.value || '',
    //             Reference: farmer.find(option => option.label === rowToEdit.reference)?.value || '',
    //             Amount: rowToEdit.amount,
    //             msg: rowToEdit.remark,
    //             Depositname: ServiceType.find(option => option.label === rowToEdit.jamanave)?.value || '',
    //         });

    //         // Optionally, you can store the vmkid to distinguish between adding and editing
    //         setEditingVmkid(vmkid);
    //     }
    // };

    // const handleEdit1 = (vmkid) => {
    //     const rowToEdit = tableData1.find(row => row.vmkid === vmkid);

    //     if (rowToEdit) {

    //         setVoucherNumber(rowToEdit.voucherNumber)
    //         setFormData({
    //             Deposit1: jamaname.find(option => option.label === rowToEdit.depositename)?.value || '',
    //             Reference1: farmer.find(option => option.label === rowToEdit.reference)?.value || '',
    //             Amount1: rowToEdit.amount,
    //             msg1: rowToEdit.remark,
    //             Depositname: ServiceType.find(option => option.label === rowToEdit.jamanave)?.value || '',


    //         });

    //         setEditingVmkid(vmkid);
    //     }
    // };

    const handleEdit = async (voucherAID) => {
        console.log('voucherAIDvoucherAID', voucherAID);
        try {
            const payload1 = {
                "voucherAID": voucherAID.toString(),
                "keyword": "%",
                "organizationID": userdetail?.companyID || "",
                "divisionID": userdetail?.departmentID || "",
            };

            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            const response1 = await axios.post(
                `${baseUrl.Url}/backend/api/GET_Voucher`,
                payload1,
                { headers }
            );

            if (response1.status !== 200) throw new Error("Failed to fetch voucher data");

            console.log("Fetched voucher data:", response1.data);

            if (response1.data.length > 0) {
                const row = response1.data[0];

                setFormData(prevState => ({
                    ...prevState,
                    mkid: row.voucherAID,
                    Deposit: row.jamanave == 0 ? row.dracc : row.cracc,
                    Amount: row.voucherAmount,
                    msg: row.narration,
                    Reference: row.referenceKey,
                }));

                setEditingVmkid(row.voucherAID);
                setVoucherNumber(row.voucherNumber);
                setCurrentDate(row.voucherDate);
                setSelectedRelid(row.referenceTID)

                console.log('voucherAmount', row.voucherAmount);
            }


        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };


    const handleEdit1 = async (voucherAID) => {
        console.log('voucherAIDvoucherAID', voucherAID);
        try {
            const payload1 = {
                "voucherAID": voucherAID.toString(),
                "keyword": "%",
                "organizationID": userdetail?.companyID || "",
                "divisionID": userdetail?.departmentID || "",
            };

            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            const response1 = await axios.post(
                `${baseUrl.Url}/backend/api/GET_Voucher`,
                payload1,
                { headers }
            );

            if (response1.status !== 200) throw new Error("Failed to fetch voucher data");

            console.log("Fetched voucher data:", response1.data);

            if (response1.data.length > 0) {
                const row = response1.data[0];

                setFormData(prevState => ({
                    ...prevState,
                    mkid: row.voucherAID,
                    Deposit1: row.jamanave == 1 ? row.cracc : row.dracc,
                    Amount1: row.voucherAmount,
                    msg1: row.narration,
                    Reference1: row.referenceKey,
                }));

                setEditingVmkid(row.voucherAID);
                setVoucherNumber(row.voucherNumber);
                setCurrentDate(row.voucherDate);
                setSelectedRelid(row.referenceTID)

                console.log('voucherAmount', row.voucherAID);
            }


        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };


    const handleEdit2 = async (voucherAID) => {
        console.log('voucherAIDvoucherAID', voucherAID);
        try {
            const payload1 = {
                "voucherAID": voucherAID.toString(),
                "keyword": "%",
                "organizationID": userdetail?.companyID || "",
                "divisionID": userdetail?.departmentID || "",
            };

            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            const response1 = await axios.post(
                `${baseUrl.Url}/backend/api/GET_Voucher`,
                payload1,
                { headers }
            );

            if (response1.status !== 200) throw new Error("Failed to fetch voucher data");

            console.log("Fetched voucher data:", response1.data);

            if (response1.data.length > 0) {
                const row = response1.data[0];

                setFormData(prevState => ({
                    ...prevState,
                    mkid: row.voucherAID,
                    // Deposit2: row.jamanave == 0 ? row.dracc : row.dracc,
                    Deposit2: row.jamanave == 0 ? row.dracc : row.cracc,
                    Amount2: row.voucherAmount,
                    msg2: row.narration,
                    Reference2: row.referenceKey,
                    Depositname: row.jamanave,
                }));

                setEditingVmkid(row.voucherAID);
                setVoucherNumber(row.voucherNumber);
                setCurrentDate(row.voucherDate);
                setSelectedRelid(row.referenceTID)

                console.log('voucherAmount', row.voucherAmount);
            }


        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };




    // const handleEdit2 = (vmkid) => {
    //     const rowToEdit = tableData2.find(row => row.vmkid === vmkid);

    //     if (rowToEdit) {

    //         setVoucherNumber(rowToEdit.voucherNumber)
    //         setFormData({
    //             Deposit2: jamaname.find(option => option.label === rowToEdit.depositename)?.value || '',
    //             Reference2: farmer.find(option => option.label === rowToEdit.reference)?.value || '',
    //             Amount2: rowToEdit.amount,
    //             msg2: rowToEdit.remark,
    //             Depositname: ServiceType.find(option => option.label === rowToEdit.jamanave)?.value || '',
    //         });

    //         setEditingVmkid(vmkid);
    //     }
    // };

    const handleDel = (voucherAID) => {
        showConfirmationDelete(voucherAID);
    }
    const showConfirmationDelete = (voucherAID) => {
        MySwal.fire({
            title: 'Are you sure?',
            text: 'You won\'t be able to revert this!',
            showCancelButton: true,
            confirmButtonColor: '#00ff00',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonColor: '#ff0000',
            cancelButtonText: 'Cancel',
        }).then((result) => {
            if (result.isConfirmed) {

                handleDelete(voucherAID);
            } else {
                MySwal.close();
            }

        });
    };

    const handleDel1 = (voucherAID) => {
        showConfirmationDelete1(voucherAID);
    }
    const showConfirmationDelete1 = (voucherAID) => {
        MySwal.fire({
            title: 'Are you sure?',
            text: 'You won\'t be able to revert this!',
            showCancelButton: true,
            confirmButtonColor: '#00ff00',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonColor: '#ff0000',
            cancelButtonText: 'Cancel',
        }).then((result) => {
            if (result.isConfirmed) {

                handleDelete1(voucherAID);
            } else {
                MySwal.close();
            }

        });
    };


    const handleDel2 = (voucherAID) => {
        showConfirmationDelete2(voucherAID);
    }
    const showConfirmationDelete2 = (voucherAID) => {
        MySwal.fire({
            title: 'Are you sure?',
            text: 'You won\'t be able to revert this!',
            showCancelButton: true,
            confirmButtonColor: '#00ff00',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonColor: '#ff0000',
            cancelButtonText: 'Cancel',
        }).then((result) => {
            if (result.isConfirmed) {

                handleDelete2(voucherAID);
            } else {
                MySwal.close();
            }

        });
    };

    // const handleDelete = (vmkid) => {

    //     const updatedTableData = tableData.filter(row => row.vmkid !== vmkid);
    //     setTableData(updatedTableData); 

    //     try {
    //         const payload = {
    //             "voucherAID": vmkid,
    //             "organizationID":userdetail?.companyID ? userdetail.companyID : "",
    //             "divisionID": userdetail?.departmentID ? userdetail.departmentID : "",
    //           }
    //         const headers = {
    //             "Content-Type": "application/json",
    //             Accept: "*/*",
    //         };

    //         axios({
    //             method: "POST",
    //             url: baseUrl.Url + "/backend/api/SP_DeleteVoucher",
    //             data: JSON.stringify(payload),
    //             headers: headers,
    //         })
    //             .then((response) => {
    //                 if (response.status != 200) throw new Error("Failed to Fetching Data");
    //                 MySwal.fire({
    //                     title: response.data[0].responseCode === "FAILURE" ? "Deletion Not Allowed" : "Deleted!",
    //                     text: response.data[0].responseCode === "FAILURE"
    //                         ? response.data[0].responseMessage
    //                         : response.data[0].responseMessage,
    //                     icon: response.data[0].responseCode === "FAILURE" ? "error" : "success",
    //                     confirmButtonText: "OK",
    //                     customClass: {
    //                         confirmButton: response.data[0].responseCode === "FAILURE" ? "btn btn-danger" : "btn btn-success",
    //                     },
    //                 });
    //                 // try {
    //                 //     const payload =  {
    //                 //         "vmkid": "%",
    //                 //         "companyid": "",
    //                 //         "deptid": ""
    //                 //     };
    //                 //     const headers = {
    //                 //         "Content-Type": "application/json",
    //                 //         Accept: "*/*",
    //                 //     };

    //                 //     axios({
    //                 //         method: "POST",
    //                 //         url: baseUrl.Url + "/backend/api/GET_VoucherMasterJama",
    //                 //         data: JSON.stringify(payload),
    //                 //         headers: headers,
    //                 //     })
    //                 //         .then((response) => {
    //                 //             if (response.status != 200) throw new Error("Failed to Fetching Data");
    //                 //             const DATA = response.data;
    //                 //             setTableData(DATA);
    //                 //         })

    //                 // } catch (error) {
    //                 //     console.error("Error fetching Access Right Data:", error);
    //                 // }
    //             })

    //     } catch (error) {
    //         console.error("Error fetching Access Right Data:", error);
    //     }

    // };


    // const handleDelete1 = (vmkid) => {
    //     const updatedTableData = tableData1.filter(row => row.vmkid !== vmkid);
    //     setTableData1(updatedTableData); 

    //     try {
    //         const payload = {
    //             "voucherAID": vmkid,
    //             "organizationID":userdetail?.companyID ? userdetail.companyID : "",
    //             "divisionID": userdetail?.departmentID ? userdetail.departmentID : "",
    //           }
    //         const headers = {
    //             "Content-Type": "application/json",
    //             Accept: "*/*",
    //         };

    //         axios({
    //             method: "POST",
    //             url: baseUrl.Url + "/backend/api/SP_DeleteVoucher",
    //             data: JSON.stringify(payload),
    //             headers: headers,
    //         })
    //             .then((response) => {
    //                 if (response.status != 200) throw new Error("Failed to Fetching Data");
    //                 MySwal.fire({
    //                     title: response.data[0].responseCode === "FAILURE" ? "Deletion Not Allowed" : "Deleted!",
    //                     text: response.data[0].responseCode === "FAILURE"
    //                         ? response.data[0].responseMessage
    //                         : response.data[0].responseMessage,
    //                     icon: response.data[0].responseCode === "FAILURE" ? "error" : "success",
    //                     confirmButtonText: "OK",
    //                     customClass: {
    //                         confirmButton: response.data[0].responseCode === "FAILURE" ? "btn btn-danger" : "btn btn-success",
    //                     },
    //                 });

    //             })

    //     } catch (error) {
    //         console.error("Error fetching Access Right Data:", error);
    //     }
    // };

    const handleDelete = (voucherAID) => {

        try {
            const payload = {
                "voucherAID": voucherAID.toString(),
                "organizationID": userdetail?.companyID ? userdetail.companyID : "",
                "divisionID": userdetail?.departmentID ? userdetail.departmentID : "",
            }
            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            axios({
                method: "POST",
                url: baseUrl.Url + "/backend/api/SP_DeleteVoucher",
                data: JSON.stringify(payload),
                headers: headers,
            })
                .then((response) => {
                    if (response.status != 200) throw new Error("Failed to Fetching Data");
                    MySwal.fire({
                        title: response.data[0].responseCode === "FAILURE" ? "Deletion Not Allowed" : "Deleted!",
                        text: response.data[0].responseCode === "FAILURE"
                            ? response.data[0].responseMessage
                            : response.data[0].responseMessage,
                        icon: response.data[0].responseCode === "FAILURE" ? "error" : "success",
                        confirmButtonText: "OK",
                        customClass: {
                            confirmButton: response.data[0].responseCode === "FAILURE" ? "btn btn-danger" : "btn btn-success",
                        },
                    });

                    const fetchVoucherList = async () => {

                        try {
                            const payload =
                            {
                                "voucherAID": "%",
                                "organizationID": userdetail?.companyID ? userdetail.companyID : "",
                                "divisionID": userdetail?.departmentID ? userdetail.departmentID : "",
                            };

                            const headers = {
                                "Content-Type": "application/json",
                                Accept: "*/*",
                            };
                            const response = await axios.post(
                                `${baseUrl.Url}/backend/api/GET_VoucherJama`,

                                payload,
                                { headers }
                            );
                            if (response.status !== 200)
                                throw new Error("Failed to fetch vendor data");
                            console.log("quatation master", response.data)
                            const filteredData = response.data.filter(item => item.status != 1 && item.dracc != 'PK0034');
                            setTableData(filteredData);
                        } catch (error) {
                            console.error("Error fetching vendor data:", error);
                        }
                    };
                    fetchVoucherList()
                })

        } catch (error) {
            console.error("Error fetching Access Right Data:", error);
        }
    };

    const handleDelete1 = (voucherAID) => {

        try {
            const payload = {
                "voucherAID": voucherAID.toString(),
                "organizationID": userdetail?.companyID ? userdetail.companyID : "",
                "divisionID": userdetail?.departmentID ? userdetail.departmentID : "",
            }
            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            axios({
                method: "POST",
                url: baseUrl.Url + "/backend/api/SP_DeleteVoucher",
                data: JSON.stringify(payload),
                headers: headers,
            })
                .then((response) => {
                    if (response.status != 200) throw new Error("Failed to Fetching Data");
                    MySwal.fire({
                        title: response.data[0].responseCode === "FAILURE" ? "Deletion Not Allowed" : "Deleted!",
                        text: response.data[0].responseCode === "FAILURE"
                            ? response.data[0].responseMessage
                            : response.data[0].responseMessage,
                        icon: response.data[0].responseCode === "FAILURE" ? "error" : "success",
                        confirmButtonText: "OK",
                        customClass: {
                            confirmButton: response.data[0].responseCode === "FAILURE" ? "btn btn-danger" : "btn btn-success",
                        },
                    });

                    const fetchVoucherList = async () => {

                        try {
                            const payload =
                            {
                                "voucherAID": "%",
                                "organizationID": userdetail?.companyID ? userdetail.companyID : "",
                                "divisionID": userdetail?.departmentID ? userdetail.departmentID : "",
                            };

                            const headers = {
                                "Content-Type": "application/json",
                                Accept: "*/*",
                            };
                            const response = await axios.post(
                                `${baseUrl.Url}/backend/api/GET_VoucherNave`,

                                payload,
                                { headers }
                            );
                            if (response.status !== 200)
                                throw new Error("Failed to fetch vendor data");
                            console.log("quatation master", response.data)
                            const filteredData = response.data.filter(item => item.status != 1 && item.cracc != 'PK0034');
                            setTableData1(filteredData);
                        } catch (error) {
                            console.error("Error fetching vendor data:", error);
                        }
                    };
                    fetchVoucherList()
                })

        } catch (error) {
            console.error("Error fetching Access Right Data:", error);
        }
    };

    const handleDelete2 = (voucherAID) => {

        try {
            const payload = {
                "voucherAID": voucherAID.toString(),
                "organizationID": userdetail?.companyID ? userdetail.companyID : "",
                "divisionID": userdetail?.departmentID ? userdetail.departmentID : "",
            }
            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            axios({
                method: "POST",
                url: baseUrl.Url + "/backend/api/SP_DeleteVoucher",
                data: JSON.stringify(payload),
                headers: headers,
            })
                .then((response) => {
                    if (response.status != 200) throw new Error("Failed to Fetching Data");
                    MySwal.fire({
                        title: response.data[0].responseCode === "FAILURE" ? "Deletion Not Allowed" : "Deleted!",
                        text: response.data[0].responseCode === "FAILURE"
                            ? response.data[0].responseMessage
                            : response.data[0].responseMessage,
                        icon: response.data[0].responseCode === "FAILURE" ? "error" : "success",
                        confirmButtonText: "OK",
                        customClass: {
                            confirmButton: response.data[0].responseCode === "FAILURE" ? "btn btn-danger" : "btn btn-success",
                        },
                    });

                    const fetchVoucherList = async () => {

                        try {
                            const payload =
                            {
                                "voucherAID": "%",
                                "organizationID": userdetail?.companyID ? userdetail.companyID : "",
                                "divisionID": userdetail?.departmentID ? userdetail.departmentID : "",
                            };

                            const headers = {
                                "Content-Type": "application/json",
                                Accept: "*/*",
                            };
                            const response = await axios.post(
                                `${baseUrl.Url}/backend/api/GET_VoucherJamaNave`,

                                payload,
                                { headers }
                            );
                            if (response.status !== 200)
                                throw new Error("Failed to fetch vendor data");
                            console.log("quatation master", response.data)
                            const filteredData = response.data.filter(item => item.status != 1);
                            setTableData2(filteredData);
                        } catch (error) {
                            console.error("Error fetching vendor data:", error);
                        }
                    };
                    fetchVoucherList()
                })

        } catch (error) {
            console.error("Error fetching Access Right Data:", error);
        }
    };


    // const handleDelete2 = (vmkid) => {
    //     const updatedTableData = tableData2.filter(row => row.vmkid !== vmkid);
    //     setTableData2(updatedTableData); 

    //     try {
    //         const payload = {
    //             "voucherAID": vmkid,
    //             "organizationID":userdetail?.companyID ? userdetail.companyID : "",
    //             "divisionID": userdetail?.departmentID ? userdetail.departmentID : "",
    //           }
    //         const headers = {
    //             "Content-Type": "application/json",
    //             Accept: "*/*",
    //         };

    //         axios({
    //             method: "POST",
    //             url: baseUrl.Url + "/backend/api/SP_DeleteVoucher",
    //             data: JSON.stringify(payload),
    //             headers: headers,
    //         })
    //             .then((response) => {
    //                 if (response.status != 200) throw new Error("Failed to Fetching Data");
    //                 MySwal.fire({
    //                     title: response.data[0].responseCode === "FAILURE" ? "Deletion Not Allowed" : "Deleted!",
    //                     text: response.data[0].responseCode === "FAILURE"
    //                         ? response.data[0].responseMessage
    //                         : response.data[0].responseMessage,
    //                     icon: response.data[0].responseCode === "FAILURE" ? "error" : "success",
    //                     confirmButtonText: "OK",
    //                     customClass: {
    //                         confirmButton: response.data[0].responseCode === "FAILURE" ? "btn btn-danger" : "btn btn-success",
    //                     },
    //                 });

    //             })

    //     } catch (error) {
    //         console.error("Error fetching Access Right Data:", error);
    //     }
    // };


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };


    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('formData', formData);

        const isDepositInvalid = !formData.Deposit;
        const isReferenceInvalid = !formData.Reference;
        const isAmountInvalid = !formData.Amount;
        const isMsgInvalid = !formData.msg;

        const isDepositInvalid1 = !formData.Deposit1;
        const isReferenceInvalid1 = !formData.Reference1;
        const isAmountInvalid1 = !formData.Amount1;
        const isMsgInvalid1 = !formData.msg1;

        const isDepositInvalid2 = !formData.Deposit2;
        const isReferenceInvalid2 = !formData.Reference2;
        const isAmountInvalid2 = !formData.Amount2;
        const isMsgInvalid2 = !formData.msg2;
        const isDepositname = !formData.Depositname;


        if (activeTab === 'nav-products-justified') {
            const shouldCheckReference = selectedRelid != 1 && selectedRelid != 4;
            if (isDepositInvalid || (shouldCheckReference && isReferenceInvalid) || isAmountInvalid || isMsgInvalid) {
                // if (isDepositname) {
                //     Depositname1Ref.current?.focus();
                // } else
                if (isDepositInvalid) {
                    DepositRef.current?.focus();
                    Swal.fire({
                        icon: "warning",
                        title: "त्रुटी !",
                        text: "कृपया नावे खाते निवडा.",
                        confirmButtonText: "ठीक आहे",
                    });
                } else if (shouldCheckReference && isReferenceInvalid) {
                    ReferenceRef.current?.focus();
                    Swal.fire({
                        icon: "warning",
                        title: "त्रुटी !",
                        text: "कृपया संदर्भ निवडा.",
                        confirmButtonText: "ठीक आहे",
                    });
                } else if (isAmountInvalid) {
                    AmountRef.current?.focus();
                    Swal.fire({
                        icon: "warning",
                        title: "त्रुटी !",
                        text: "कृपया रक्कम टाका .",
                        confirmButtonText: "ठीक आहे",
                    })
                } else if (isMsgInvalid) {
                    msgRef.current?.focus();
                    Swal.fire({
                        icon: "warning",
                        title: "त्रुटी !",
                        text: "कृपया शेरा द्या.",
                        confirmButtonText: "ठीक आहे",
                    });
                }
            } else {
                showConfirmationAlert(event);
            }

        } else if (activeTab === 'nav-cart-justified') {
            const shouldCheckReference = selectedRelid != 1 && selectedRelid != 4;

            if (isDepositInvalid1 || (shouldCheckReference && isReferenceInvalid1) || isAmountInvalid1 || isMsgInvalid1) {
                // if (isDepositname) {
                //     Depositname1Ref.current?.focus();
                // } else 
                if (isDepositInvalid1) {
                    Deposit1Ref.current?.focus();
                    Swal.fire({
                        icon: "warning",
                        title: "त्रुटी !",
                        text: "कृपया नावे खाते निवडा.",
                        confirmButtonText: "ठीक आहे",
                    });
                } else if (shouldCheckReference && isReferenceInvalid1) {
                    Reference1Ref.current?.focus();
                    Swal.fire({
                        icon: "warning",
                        title: "त्रुटी !",
                        text: "कृपया संदर्भ निवडा.",
                        confirmButtonText: "ठीक आहे",
                    });
                } else if (isAmountInvalid1) {
                    Amount1Ref.current?.focus();
                    Swal.fire({
                        icon: "warning",
                        title: "त्रुटी !",
                        text: "कृपया रक्कम टाका .",
                        confirmButtonText: "ठीक आहे",
                    })
                } else if (isMsgInvalid1) {
                    msg1Ref.current?.focus();
                    Swal.fire({
                        icon: "warning",
                        title: "त्रुटी !",
                        text: "कृपया शेरा द्या.",
                        confirmButtonText: "ठीक आहे",
                    });
                }
            } else {

                showConfirmationAlert(event);
            }
        } else if (activeTab === 'nav-orders-justified') {
            const shouldCheckReference = selectedRelid != 1 && selectedRelid != 4;

            if (isDepositInvalid2 || (shouldCheckReference && isReferenceInvalid2) || isAmountInvalid2 || isMsgInvalid2 || isDepositname) {
                if (isDepositname) {
                    DepositnameRef.current?.focus();
                    Swal.fire({
                        icon: "warning",
                        title: "त्रुटी !",
                        text: "कृपया जमा/ नावे  निवडा.",
                        confirmButtonText: "ठीक आहे",
                    });
                } else if (isDepositInvalid2) {
                    Deposit2Ref.current?.focus();
                    Swal.fire({
                        icon: "warning",
                        title: "त्रुटी !",
                        text: "कृपया खाते निवडा.",
                        confirmButtonText: "ठीक आहे",
                    });
                } else if (shouldCheckReference && isReferenceInvalid2) {
                    Reference2Ref.current?.focus();
                    Swal.fire({
                        icon: "warning",
                        title: "त्रुटी !",
                        text: "कृपया संदर्भ निवडा.",
                        confirmButtonText: "ठीक आहे",
                    });
                } else if (isAmountInvalid2) {
                    Amount2Ref.current?.focus();
                    Swal.fire({
                        icon: "warning",
                        title: "त्रुटी !",
                        text: "कृपया रक्कम टाका .",
                        confirmButtonText: "ठीक आहे",
                    })
                } else if (isMsgInvalid2) {
                    msg2Ref.current?.focus();
                    Swal.fire({
                        icon: "warning",
                        title: "त्रुटी !",
                        text: "कृपया शेरा द्या.",
                        confirmButtonText: "ठीक आहे",
                    });
                }
            } else {
                showConfirmationAlert(event);
            }
        }
    };


    const MySwal = withReactContent(Swal);
    const showConfirmationAlert = () => {
        MySwal.fire({
            title: "तुम्हाला खात्री आहे का?",
            text: "तुम्ही हे डेटा जतन करू इच्छिता का?",
            showCancelButton: true,
            confirmButtonColor: "#00ff00",
            confirmButtonText: "SAVE",
            cancelButtonColor: "#092C4C",
            cancelButtonText: "CANCEL",
        }).then((result) => {
            if (result.isConfirmed) {
                handleSave();
                // Swal.fire({
                //     icon: "success",
                //     title: "Saved!",
                //     text: "Data saved successfully.",
                //     confirmButtonText: "ठीक आहे",

                // });
                setexit(prev => !prev)
            }
        });
    };


    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log('voucherAIDvoucherAI ', voucherAID)
                const payload1 = {
                    "voucherAID": voucherAID.toString(),
                    "keyword": "%",
                    "organizationID": userdetail?.companyID ? userdetail.companyID : "",
                    "divisionID": userdetail?.departmentID ? userdetail.departmentID : "",
                };
                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };
                const response1 = await axios.post(
                    `${baseUrl.Url}/backend/api/GET_Voucher`,
                    payload1,
                    { headers }
                );
                if (response1.status !== 200)
                    throw new Error("Failed to fetch vendor data");
                console.log("master", response1.data);
                if (response1.data.length > 0) {
                    setFormData(prevState => ({
                        ...prevState,
                        // VMKID: response1.data[0].voucherAID,
                        // Deposit: response1.data[0].dracc,
                        // Amount: response1.data[0].voucherAmount,
                        // msg: response1.data[0].narration,
                        // Reference: response1.data[0].referenceKey,

                        // mkid: response1.data[0].voucherAID,
                        // Deposit1: response1.data[0].jamanave == 1 ? response1.data[0].cracc : response1.data[0].dracc,
                        // Amount1: response1.data[0].voucherAmount,
                        // msg1: response1.data[0].narration,
                        // Reference1: response1.data[0].referenceKey,

                        // Deposit2: response1.data[0].jamanave == 0 ? response1.data[0].dracc : response1.data[0].cracc,
                        // Depositname: response1.data[0].jamanave,
                        // Amount2: response1.data[0].voucherAmount,
                        // msg2: response1.data[0].narration,
                        // Reference2: response1.data[0].referenceKey,



                    }));

                    console.log('response1.data[0].voucherAID', response1.data[0].voucherAID)

                    // setEditingVmkid(response1.data[0].voucherAID,);
                    // setCurrentDate(response1.data[0].voucherDate,);
                    // setVoucherNumber(response1.data[0].voucherNumber,);

                    if (response1.data[0].vouchertype == 0) {
                        setActiveTab("nav-products-justified");
                    } else if (response1.data[0].vouchertype == 1) {
                        setActiveTab("nav-cart-justified");
                    } else if (response1.data[0].vouchertype == 2) {
                        setActiveTab("nav-orders-justified");

                    }
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, [voucherAID]);
    console.log('Deposit2DepoDeposit2Deposit2Deposit2Deposit2Deposit2Deposit2sit2Deposit2', formData.Deposit1)

    const handleSave = async () => {

        if (activeTab === 'nav-products-justified') { //jama
            // const newRow = {
            //     depositename: jamaname.find(option => option.value === formData.Deposit)?.label || '',
            //     amount: formData.Amount,
            //     remark: formData.msg,
            //     reference: farmer.find(option => option.value === formData.Reference)?.label || '',
            //     vmkid: editingVmkid ? editingVmkid : GUID, 
            //     jamanave: ServiceType.find(option => option.value === formData.Depositname)?.label || '',
            //     voucherNumber: voucherNumber,
            //     status: 'Pending'   
            // };

            // if (editingVmkid) {

            //     setTableData(prevData =>
            //         prevData.map(row =>
            //             row.vmkid === editingVmkid ? { ...row, ...newRow } : row

            //         )

            //     );
            // } else {

            //     setTableData(prevData => [...prevData, newRow]);
            // }

            setFormData({
                Deposit: '',
                Reference: '',
                Amount: '',
                msg: '',
                Depositname: '',
            });
            setEditingVmkid(null);



            try {
                const commonPayload = {
                    voucherAID: editingVmkid ? editingVmkid : 0,
                    organizationID: userdetail?.companyID || "",
                    divisionID: userdetail?.departmentID || "",
                    voucherTID: "CR",
                    serialNumber: "",
                    voucherDate: currentDate,
                    voucherAmount: formData.Amount,
                    referenceTID: selectedRelid,
                    referenceKey: formData.Reference,
                    narration: formData.msg,
                    grpkey: editingVmkid ? editingVmkid.toString() : GUID,
                    batchkey: editingVmkid ? editingVmkid.toString() : GUID,
                    oid: "10",
                    vouchertype: "0",
                    jamanave: "0",
                    vouchernumber: voucherNumber,
                    status: false,
                    uaid: userdetail?.UAID || "",
                };

                // Create both rows in one array
                // const payload = [
                //     {
                //         ...commonPayload,
                //         dracc: formData.Deposit,
                //         cracc: "PKACC00000000000"
                //     },
                //     {
                //         ...commonPayload,
                //         dracc: Accounts.CASHACC,
                //         cracc: "PKACC00000000000"
                //     }
                // ];



                const payload = editingVmkid
                    ? [
                        {
                            ...commonPayload,
                            dracc: formData.Deposit,
                            cracc: "PKACC00000000000"
                        },
                    ]
                    : [
                        {
                            ...commonPayload,
                            dracc: formData.Deposit,
                            cracc: "PKACC00000000000"
                        },
                        {
                            ...commonPayload,
                            dracc: Accounts.CASHACC,
                            cracc: "PKACC00000000000"
                        },
                    ];

                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };

                // Single API call with both rows
                const res = await axios.post(
                    `${baseUrl.Url}/backend/api/SP_AddVoucher`,
                    JSON.stringify(payload),
                    { headers }
                );

                Swal.fire({
                    icon: "success",
                    title: "Saved!",
                    text: "Data saved successfully.",
                    confirmButtonText: "OK",
                }).then(async () => {
                    try {
                        const fetchPayload = {
                            voucherAID: "%",
                            organizationID: userdetail?.companyID || "",
                            divisionID: userdetail?.departmentID || "",
                        };

                        const response = await axios.post(
                            `${baseUrl.Url}/backend/api/GET_VoucherJama`,
                            fetchPayload,
                            { headers }
                        );

                        if (response.status !== 200)
                            throw new Error("Failed to fetch voucher data");

                        const filteredData = response.data.filter(item => item.status != 1 && item.dracc != "PK0034");
                        setTableData(filteredData);
                    } catch (fetchError) {
                        console.error("Error fetching voucher data:", fetchError);
                    }
                });

                console.log("Voucher Entries Submitted");
            } catch (error) {
                console.error("Submission Error:", error);
                Swal.fire({
                    icon: "error",
                    title: "ओह... काहीतरी चुकीचे झाले",
                    text: "डेटा जतन करताना काहीतरी चुकले.",
                    confirmButtonText: "ठीक आहे",
                });
            }



        } else if (activeTab === 'nav-cart-justified') { //nave
            // const newRow = {
            //     depositename: jamaname.find(option => option.value === formData.Deposit1)?.label || '',
            //     amount: formData.Amount1,
            //     remark: formData.msg1,
            //     reference: farmer.find(option => option.value === formData.Reference1)?.label || '',
            //     vmkid: editingVmkid ? editingVmkid : GUID, 
            //     jamanave: ServiceType.find(option => option.value === formData.Depositname)?.label || '',
            //     voucherNumber: voucherNumber,

            // };

            // if (editingVmkid) {

            //     setTableData1(prevData =>
            //         prevData.map(row =>
            //             row.vmkid === editingVmkid ? { ...row, ...newRow } : row

            //         )

            //     );
            // } else {

            //     setTableData1(prevData => [...prevData, newRow]);
            // }

            setFormData({
                Deposit1: '',
                Reference1: '',
                Amount1: '',
                msg1: '',
                Depositname: '',
            });
            setEditingVmkid(null);



            try {
                const combined = {
                    "voucherAID": editingVmkid ? editingVmkid : 0,
                    "organizationID": userdetail?.companyID ? userdetail.companyID : "",
                    "divisionID": userdetail?.departmentID ? userdetail.departmentID : "",
                    "voucherTID": "CP",
                    "serialNumber": "",
                    "voucherDate": currentDate,
                    "voucherAmount": formData.Amount1,
                    "referenceTID": selectedRelid,
                    "referenceKey": formData.Reference1,
                    "narration": formData.msg1,
                    "grpkey": editingVmkid ? editingVmkid.toString() : GUID,
                    "batchkey": editingVmkid ? editingVmkid.toString() : GUID,
                    "oid": "10",
                    "vouchertype": "1",
                    "jamanave": "1",
                    "vouchernumber": voucherNumber,
                    "status": false,
                    "uaid": userdetail?.UAID ? userdetail.UAID : "",
                };

                // const payload = [
                //     {
                //         ...combined,
                //         "dracc": "PKACC00000000000",
                //         "cracc": formData.Deposit1,
                //     },
                //     {
                //         ...combined,
                //         dracc: "PKACC00000000000",
                //         cracc: Accounts.CASHACC
                //     }
                // ];

                const payload = editingVmkid
                    ? [
                        {
                            ...combined,
                            dracc: "PKACC00000000000",
                            cracc: formData.Deposit1,
                        },
                    ]
                    : [
                        {
                            ...combined,
                            dracc: "PKACC00000000000",
                            cracc: formData.Deposit1,
                        },
                        {
                            ...combined,
                            dracc: "PKACC00000000000",
                            cracc: Accounts.CASHACC,
                        },
                    ];


                console.log("Data payload1:", payload);

                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };

                const response = await axios.post(
                    `${baseUrl.Url}/backend/api/SP_AddVoucher`,
                    JSON.stringify(payload),
                    { headers }
                );

                Swal.fire({
                    icon: "success",
                    title: "Saved!",
                    text: "Data saved successfully.",
                    confirmButtonText: "OK",
                }).then(async () => {

                    try {
                        const payload =
                        {
                            "voucherAID": "%",
                            "organizationID": userdetail?.companyID ? userdetail.companyID : "",
                            "divisionID": userdetail?.departmentID ? userdetail.departmentID : "",
                        };

                        const headers = {
                            "Content-Type": "application/json",
                            Accept: "*/*",
                        };
                        const response = await axios.post(
                            `${baseUrl.Url}/backend/api/GET_VoucherNave`,

                            payload,
                            { headers }
                        );
                        if (response.status !== 200)
                            throw new Error("Failed to fetch vendor data");
                        console.log("quatation master", response.data)
                        const filteredData = response.data.filter(item => item.status != 1 && item.cracc != 'PK0034');
                        setTableData1(filteredData);
                    } catch (error) {
                        console.error("Error fetching vendor data:", error);
                    }



                });
                console.log("API Response:", response.data);


            } catch (error) {
                console.error("Submission Error:", error);
                Swal.fire({
                    icon: "error",
                    title: "ओह... काहीतरी चुकीचे झाले",
                    text: "डेटा जतन करताना काहीतरी चुकले.",
                    confirmButtonText: "ठीक आहे",
                });

            }


        } else if (activeTab === 'nav-orders-justified') { //jenral

            // const newRow = {
            //     depositename: jamaname.find(option => option.value === formData.Deposit2)?.label || '',
            //     amount: formData.Amount2,
            //     remark: formData.msg2,
            //     reference: farmer.find(option => option.value === formData.Reference2)?.label || '',
            //     vmkid: editingVmkid ? editingVmkid : GUID, 
            //     jamanave: ServiceType.find(option => option.value === formData.Depositname)?.label || '',
            //     voucherNumber: voucherNumber

            // };

            // if (editingVmkid) {

            //     setTableData2(prevData =>
            //         prevData.map(row =>
            //             row.vmkid === editingVmkid ? { ...row, ...newRow } : row

            //         )

            //     );
            // } else {

            //     setTableData2(prevData => [...prevData, newRow]);
            // }

            setFormData({
                Deposit2: '',
                Reference2: '',
                Amount2: '',
                msg2: '',
                Depositname: '',
            });
            setEditingVmkid(null);



            try {
                const payload = [{
                    "voucherAID": editingVmkid ? editingVmkid : 0,
                    "organizationID": userdetail?.companyID ? userdetail.companyID : "",
                    "divisionID": userdetail?.departmentID ? userdetail.departmentID : "",
                    "voucherTID": "TR",
                    "serialNumber": "",
                    "voucherDate": currentDate,
                    "dracc": formData.Depositname == 0 ? formData.Deposit2 : "PKACC00000000000",
                    "cracc": formData.Depositname == 1 ? formData.Deposit2 : "PKACC00000000000",
                    "voucherAmount": formData.Amount2,
                    "referenceTID": selectedRelid,
                    "referenceKey": formData.Reference2,
                    "narration": formData.msg2,
                    "grpkey": editingVmkid ? editingVmkid.toString() : GUID,
                    "batchkey": editingVmkid ? editingVmkid.toString() : GUID,
                    "oid": "10",
                    "vouchertype": "2",
                    "jamanave": formData.Depositname,
                    "vouchernumber": voucherNumber,
                    "status": false,
                    "uaid": userdetail?.UAID ? userdetail.UAID : "",
                }];

                console.log("Data payload2:", payload);

                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };

                const response = await axios.post(
                    `${baseUrl.Url}/backend/api/SP_AddVoucher`,
                    JSON.stringify(payload),
                    { headers }
                );

                Swal.fire({
                    icon: "success",
                    title: "Saved!",
                    text: "Data saved successfully.",
                    confirmButtonText: "OK",
                }).then(async () => {

                    try {
                        const payload =
                        {
                            "voucherAID": "%",
                            "organizationID": userdetail?.companyID ? userdetail.companyID : "",
                            "divisionID": userdetail?.departmentID ? userdetail.departmentID : "",
                        };

                        const headers = {
                            "Content-Type": "application/json",
                            Accept: "*/*",
                        };
                        const response = await axios.post(
                            `${baseUrl.Url}/backend/api/GET_VoucherJamaNave`,

                            payload,
                            { headers }
                        );
                        if (response.status !== 200)
                            throw new Error("Failed to fetch vendor data");
                        console.log("quatation master", response.data)
                        const filteredData = response.data.filter(item => item.status != 1);
                        setTableData2(filteredData);
                    } catch (error) {
                        console.error("Error fetching vendor data:", error);
                    }


                });
                console.log("API Response:", response.data);


            } catch (error) {
                console.error("Submission Error:", error);
                Swal.fire({
                    icon: "error",
                    title: "ओह... काहीतरी चुकीचे झाले",
                    text: "डेटा जतन करताना काहीतरी चुकले.",
                    confirmButtonText: "ठीक आहे",
                });
            }
        }
    }
    const [Amount, setAmount] = useState()
    const [selectedData, setSelectedData] = useState({ activeTab: null });
    const handlePending = () => {
        if ((activeTab === 'nav-products-justified') || (activeTab === 'nav-cart-justified')) {
            // handleSucess();
            setSelectedData({ activeTab })

            if (activeTab === 'nav-products-justified') {
                setAmount(totalAmount)
            } else {

                setAmount(totalAmount1)
            }
        } else {
            showConfirmationAlertSuccess()
        }
        // handleSucess();
        // showConfirmationAlertSuccess()


    }

    const [refreshFlag, setRefreshFlag] = useState(false);// for Refresh

    // for Refresh
    const refreshData = () => {
        setRefreshFlag(prev => !prev);
    };

    // for Refresh
    useEffect(() => {
        setSelectedData({ activeTab: null }); // 👈 Clear after refresh
    }, [refreshFlag]);

    const showConfirmationAlertSuccess = () => {
        MySwal.fire({
            title: "तुम्हाला खात्री आहे का?",
            text: "तुम्ही हे डेटा जतन करू इच्छिता का?",
            showCancelButton: true,
            confirmButtonColor: "#00ff00",
            confirmButtonText: "SAVE",
            cancelButtonColor: "#092C4C",
            cancelButtonText: "CANCEL",
        }).then((result) => {
            if (result.isConfirmed) {
                handleSucess();
                // Swal.fire({
                //     icon: "success",
                //     title: "Saved!",
                //     text: "Data saved successfully.",
                //     confirmButtonText: "ठीक आहे",

                // });
                setexit(prev => !prev)
            }
        });
    };

    const handleSucess = async () => {

        if (activeTab === 'nav-products-justified') { //jama
            try {
                const payloadList = tableData.map(row => ({
                    voucherAID: String(row.vmkid || row.voucherAID || 0),
                    organizationID: userdetail?.companyID || "",
                    divisionID: userdetail?.departmentID || "",
                    voucherTID: "CR",
                    serialNumber: "",
                    voucherDate: row.voucherDate,
                    dracc: Accounts.CASHACC,
                    cracc: "PKACC00000000000",
                    voucherAmount: row.amount || row.voucherAmount,
                    referenceTID: row.reftid || row.referenceTID || '',
                    referenceKey: row.referenceKey || '',
                    narration: row.remark || row.narration,
                    grpkey: String(row.vmkid || row.voucherAID || GUID),
                    batchkey: String(row.vmkid || row.voucherAID || GUID),
                    oid: "10",
                    vouchertype: "0",
                    jamanave: row.jamanave || "0",
                    vouchernumber: row.voucherNumber,
                    status: true,
                    uaid: userdetail?.UAID || "",
                }));

                console.log('payloadList:', payloadList);

                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };

                const response = await axios.post(
                    `${baseUrl.Url}/backend/api/SP_AddVoucher`,
                    JSON.stringify(payloadList),
                    { headers }
                );

                if (response.status === 200 || response.status === 201) {
                    try {
                        const fetchPayload = {
                            voucherAID: "%",
                            organizationID: userdetail?.companyID || "",
                            divisionID: userdetail?.departmentID || "",
                        };

                        const response = await axios.post(
                            `${baseUrl.Url}/backend/api/GET_VoucherJama`,
                            fetchPayload,
                            { headers }
                        );

                        if (response.status !== 200)
                            throw new Error("Failed to fetch vendor data");

                        console.log("Fetched vouchers:", response.data);
                        const filteredData = response.data.filter(item => item.status != 1 && item.dracc != 'PK0034');
                        setTableData(filteredData);
                    } catch (fetchError) {
                        console.error("Error fetching voucher data:", fetchError);
                    }

                    console.log("Save response:", response.data);
                } else {
                    throw new Error("Unexpected response status: " + response.status);
                }
            } catch (error) {
                console.error("Error saving voucher data:", error);
                Swal.fire({
                    icon: "error",
                    title: "त्रुटी",
                    text: "डेटा जतन करताना काहीतरी चुकले.",
                    confirmButtonText: "ठीक आहे",
                });
            }

        } else if (activeTab === 'nav-cart-justified') {


            try {

                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };

                const payloadList = tableData1.map(row => ({
                    voucherAID: String(row.vmkid || row.voucherAID || 0),
                    organizationID: userdetail?.companyID || "",
                    divisionID: userdetail?.departmentID || "",
                    voucherTID: "CR",
                    serialNumber: "",
                    voucherDate: row.voucherDate,
                    dracc: Accounts.FARMERACC, //farmer acc
                    cracc: row.cracc,
                    voucherAmount: row.amount || row.voucherAmount,
                    referenceTID: row.reftid || row.referenceTID || '',
                    referenceKey: row.referenceKey || '',
                    narration: row.remark || row.narration,
                    grpkey: String(row.vmkid || row.voucherAID || GUID),
                    batchkey: String(row.vmkid || row.voucherAID || GUID),
                    oid: "10",
                    vouchertype: "1",
                    jamanave: row.jamanave || "1",
                    vouchernumber: row.voucherNumber,
                    status: true,
                    uaid: userdetail?.UAID ? userdetail.UAID : "",
                }));
                console.log('payloadListpayloadListpayloadListpayloadList22', payloadList)
                console.log('payloadListpayloadListpayloadListpayloadList22', voucherNumber)

                const response = await axios.post(
                    `${baseUrl.Url}/backend/api/SP_AddVoucher`,
                    JSON.stringify(payloadList), // this is an array!
                    { headers }
                );

                if (response.status === 200 || response.status === 201) {
                    // Swal.fire({
                    //     icon: "success",
                    //     title: "यशस्वी!",
                    //     text: "सर्व डेटा यशस्वीरित्या जतन केला गेला.",
                    //     confirmButtonText: "ठीक आहे",
                    // })
                    // .then(async() => {

                    try {
                        const payload =
                        {
                            "voucherAID": "%",
                            "organizationID": userdetail?.companyID ? userdetail.companyID : "",
                            "divisionID": userdetail?.departmentID ? userdetail.departmentID : "",
                        };

                        const headers = {
                            "Content-Type": "application/json",
                            Accept: "*/*",
                        };
                        const response = await axios.post(
                            `${baseUrl.Url}/backend/api/GET_VoucherNave`,

                            payload,
                            { headers }
                        );
                        if (response.status !== 200)
                            throw new Error("Failed to fetch vendor data");
                        console.log("quatation master", response.data)
                        const filteredData = response.data.filter(item => item.status != 1 && item.cracc != 'PK0034');
                        setTableData1(filteredData);
                    } catch (error) {
                        console.error("Error fetching vendor data:", error);
                    }


                    //   });
                    console.log("Response data:", response.data);
                } else {
                    throw new Error("Unexpected response status: " + response.status);
                }

            } catch (error) {
                console.error("Error saving all data:", error);
                Swal.fire({
                    icon: "error",
                    title: "त्रुटी",
                    text: "डेटा जतन करताना काहीतरी चुकले.",
                    confirmButtonText: "ठीक आहे",
                });
            }


        } else if (activeTab === 'nav-orders-justified') {

            const jamaCount = tableData2.filter(row => row.jamanave == 0).length;
            console.log("Total Jama Rows:", jamaCount);
            const naveCount = tableData2.filter(row => row.jamanave == 1).length;
            console.log("Total Nave Rows:", naveCount);

            const totalJamaAmount = tableData2
                .filter(row => row.jamanave == 0)
                .reduce((sum, row) => sum + (parseFloat(row.amount || row.voucherAmount) || 0), 0);

            const totalNaveAmount = tableData2
                .filter(row => row.jamanave == 1)
                .reduce((sum, row) => sum + (parseFloat(row.amount || row.voucherAmount) || 0), 0);

            // const totaljamanave = totalJamaAmount - totalNaveAmount;
            console.log("Total Jama Amount:", totalJamaAmount);
            console.log("Total Nave Amount:", totalNaveAmount);

            if (jamaCount == naveCount) {



                if (totalJamaAmount != totalNaveAmount) {
                    Swal.fire({
                        icon: "info",
                        title: "माहिती",
                        text: `जमा रक्कम (₹${totalJamaAmount}) आणि नावे रक्कम (₹${totalNaveAmount}) दोंन्ही सारखी पाहिजेत .`,
                        confirmButtonText: "ठीक आहे",
                    });
                    return;
                }


                try {

                    const headers = {
                        "Content-Type": "application/json",
                        Accept: "*/*",
                    };

                    const payloadList = tableData2.map(row => ({
                        voucherAID: String(row.vmkid || row.voucherAID || 0),
                        organizationID: userdetail?.companyID || "",
                        divisionID: userdetail?.departmentID || "",
                        voucherTID: "CR",
                        serialNumber: "",
                        voucherDate: row.voucherDate,
                        dracc: row.jamanave == 0 ? row.dracc : Accounts.FARMERACC, //farmer acc
                        cracc: row.jamanave == 1 ? row.cracc : "PKACC00000000000",
                        voucherAmount: row.amount || row.voucherAmount,
                        referenceTID: row.reftid || row.referenceTID || '',
                        referenceKey: row.referenceKey || '',
                        narration: row.remark || row.narration,
                        grpkey: String(row.vmkid || row.voucherAID || GUID),
                        batchkey: String(row.vmkid || row.voucherAID || GUID),
                        oid: "10",
                        vouchertype: "2",
                        jamanave: row.jamanave,
                        vouchernumber: row.voucherNumber,
                        status: true,
                        uaid: userdetail?.UAID ? userdetail.UAID : "",
                    }));

                    const response = await axios.post(
                        `${baseUrl.Url}/backend/api/SP_AddVoucher`,
                        JSON.stringify(payloadList), // this is an array!
                        { headers }
                    );


                    if (response.status === 200 || response.status === 201) {
                        Swal.fire({
                            icon: "success",
                            title: "यशस्वी!",
                            text: "सर्व डेटा यशस्वीरित्या जतन केला गेला.",
                            confirmButtonText: "ठीक आहे",
                        })
                        // .then(async() => {

                        try {
                            const payload =
                            {
                                "voucherAID": "%",
                                "organizationID": userdetail?.companyID ? userdetail.companyID : "",
                                "divisionID": userdetail?.departmentID ? userdetail.departmentID : "",
                            };

                            const headers = {
                                "Content-Type": "application/json",
                                Accept: "*/*",
                            };
                            const response = await axios.post(
                                `${baseUrl.Url}/backend/api/GET_VoucherJamaNave`,

                                payload,
                                { headers }
                            );
                            if (response.status !== 200)
                                throw new Error("Failed to fetch vendor data");
                            console.log("quatation master", response.data)
                            const filteredData = response.data.filter(item => item.status != 1);
                            setTableData2(filteredData);
                        } catch (error) {
                            console.error("Error fetching vendor data:", error);
                        }


                        //   });
                        console.log("Response data:", response.data);
                    } else {
                        throw new Error("Unexpected response status: " + response.status);
                    }

                } catch (error) {
                    console.error("Error saving all data:", error);
                    Swal.fire({
                        icon: "error",
                        title: "त्रुटी",
                        text: "डेटा जतन करताना काहीतरी चुकले.",
                        confirmButtonText: "ठीक आहे",
                    });
                }
            } else {
                Swal.fire({
                    icon: "info",
                    title: "माहिती",
                    text: `डेटा सेव्ह करताना समस्या आली. जमा रेकॉर्ड्स (${jamaCount}) आणि नावे रेकॉर्ड्स (${naveCount}) यांची संख्या जुळत नाही.`,
                    confirmButtonText: "ठीक आहे",
                });
            }

        }



    };


    const handleExit = () => {
        showExitAlert()
        // setFormData({
        //     Deposit1: '', 
        //     Reference1: '',
        //     Amount1: '', 
        //     msg1: '',
        //     Depositname: '',
        //     Deposit2: '', 
        //     Reference2: '',
        //     Amount2: '', 
        //     msg2: '',
        //     VMKID: '',
        //     Date: ''
        //   });

        //   setVoucherNumber('');
        //   setCurrentDate('');
        //   setexit(prev => !prev)


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
                setFormData({
                    Deposit: '',
                    Reference: '',
                    Amount: '',
                    msg: '',
                    Deposit1: '',
                    Reference1: '',
                    Amount1: '',
                    msg1: '',
                    Depositname: '',
                    Deposit2: '',
                    Reference2: '',
                    Amount2: '',
                    msg2: '',
                    VMKID: '',
                    Date: ''
                });
                setVoucherNumber('')
                setVoucherNumber('');
                setCurrentDate('');
                setexit(prev => !prev)

                const modal = document.getElementById("add-units");
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
                    onRefresh(); // refreshReceiptData from Bills.jsx
                }

            }
        });
    };

    const totalAmount = tableData.reduce((sum, row) => {
        const amount = parseFloat(row.voucherAmount || row.amount) || 0;
        return sum + amount;
    }, 0);


    const totalAmount1 = tableData1.reduce((sum, row) => {
        const amount = parseFloat(row.voucherAmount || row.amount) || 0;
        return sum + amount;
    }, 0);

    const totalAmount2 = tableData2.reduce((sum, row) => {
        const amount = parseFloat(row.voucherAmount || row.amount) || 0;
        return sum + amount;
    }, 0);

    const totalJamaAmount = tableData2
        .filter(row => row.jamanave == 0)
        .reduce((sum, row) => sum + (parseFloat(row.amount || row.voucherAmount) || 0), 0);

    const totalNaveAmount = tableData2
        .filter(row => row.jamanave == 1)
        .reduce((sum, row) => sum + (parseFloat(row.amount || row.voucherAmount) || 0), 0);

    const totaljamanave = totalJamaAmount - totalNaveAmount;



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
    };


    return (
        <div>
            {/* Add Purchase */}
            <div className="modal fade" id="add-units">
                <div className="modal-dialog  modal-dialog-centered modal-fullscreen mbgcolor">
                    <div className="modal-content mbgcolor">
                        <div className="mbgcolor page-wrapper-new p-0 " style={{ overflow: 'hidden', height: '100vh' }}>
                            <div className="content mbgcolor">

                                <form onSubmit={handleSubmit}>


                                    <div className="col-xl-12">
                                        <div className="card">

                                            <div className="card-body mbgcolor">
                                                <nav className="nav nav-pills mb-4 nav-justified d-sm-flex d-block gap-2">
                                                    <Link
                                                        className={`nav-link fw-bold py-2 px-3 rounded-pill shadow-sm transition 
                                                                ${activeTab === "nav-products-justified"
                                                                ? "bg-primary text-white border border-primary"
                                                                : "bg-white text-primary border border-primary"}`}
                                                        data-bs-toggle="tab"
                                                        role="tab"
                                                        to="#nav-products-justified"
                                                        aria-selected={activeTab === 'nav-products-justified' ? 'true' : 'false'}
                                                        onClick={() => handleTabClick('nav-products-justified')}
                                                    >
                                                        <span style={{ fontWeight: 'bold', fontSize: "1rem" }}>रोख जमा</span>
                                                    </Link>

                                                    <Link
                                                        className={`nav-link fw-bold py-2 px-3 rounded-pill shadow-sm transition 
                                                                 ${activeTab === "nav-cart-justified"
                                                                ? "bg-primary text-white border border-primary"
                                                                : "bg-white text-primary border border-primary"}`}
                                                        data-bs-toggle="tab"
                                                        role="tab"
                                                        to="#nav-cart-justified"
                                                        aria-selected={activeTab === 'nav-cart-justified' ? 'true' : 'false'}
                                                        onClick={() => handleTabClick('nav-cart-justified')}
                                                    >
                                                        <span style={{ fontWeight: 'bold', fontSize: "1rem" }}>रोख नावे</span>
                                                    </Link>

                                                    <Link
                                                        className={`nav-link fw-bold py-2 px-3 rounded-pill shadow-sm transition 
                                                                 ${activeTab === "nav-orders-justified"
                                                                ? "bg-primary text-white border border-primary"
                                                                : "bg-white text-primary border border-primary"}`}
                                                        data-bs-toggle="tab"
                                                        role="tab"
                                                        to="#nav-orders-justified"
                                                        aria-selected={activeTab === 'nav-orders-justified' ? 'true' : 'false'}
                                                        onClick={() => handleTabClick('nav-orders-justified')}
                                                    >
                                                        <span style={{ fontWeight: 'bold', fontSize: "1rem" }}>जर्नल</span>
                                                    </Link>
                                                </nav>



                                                <div className="tab-content mbgcolor">

                                                    <div className={`tab-pane ${activeTab === 'nav-products-justified' ? 'show active' : ''}`} id="nav-products-justified" role="tabpanel">
                                                        <div className="row">
                                                            <div className="col-md-2 mb-2">
                                                                <label className="form-label required">व्हाउचर नंबर  </label>
                                                                <input
                                                                    type="text"
                                                                    name="Vouchernumber"
                                                                    className="form-control"
                                                                    readOnly
                                                                    value={voucherNumber}
                                                                    onChange={handleInputChange}

                                                                />
                                                            </div>

                                                            <div className="col-md-2 mb-2">
                                                                <label className="form-label required">तारीख </label>
                                                                <input
                                                                    value={currentDate}
                                                                    name="Date"
                                                                    readOnly
                                                                    className="form-control"
                                                                />
                                                            </div>

                                                            <div className="col-md-3 mb-2">
                                                                <label className="form-label required">जमा  </label>
                                                                <input
                                                                    // classNamePrefix="react-select"
                                                                    // options={ServiceType}
                                                                    type="text"
                                                                    className="form-control"
                                                                    placeholder="निवडा"
                                                                    readOnly
                                                                    name="Depositname"
                                                                    defaultValue={'जमा'}
                                                                    ref={Depositname1Ref}
                                                                // value={ServiceType.find(option => option.value === formData.Depositname) || null}
                                                                //     onChange={(selectedOption) => {
                                                                //         setFormData(prevState => ({
                                                                //             ...prevState,
                                                                //             Depositname: selectedOption ? selectedOption.value : '',
                                                                //         }));
                                                                //         if (Deposit2Ref.current) {
                                                                //             Deposit2Ref.current.focus();
                                                                //         }
                                                                //     }}
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="row">
                                                            <div className="col-md-5 mb-2">
                                                                <label className="form-label required">जमा खाते </label>
                                                                <Select
                                                                    classNamePrefix="react-select"
                                                                    options={jamaname}
                                                                    placeholder="निवडा"
                                                                    // openMenuOnFocus={true}
                                                                    name="Deposit"
                                                                    ref={DepositRef}
                                                                    styles={customStyles}
                                                                    value={jamaname.find(option => option.value === formData.Deposit) || null}
                                                                    onChange={(selectedOption) => {
                                                                        setSelectedRelid(selectedOption?.name || "")
                                                                        setFormData(prevState => ({
                                                                            ...prevState,
                                                                            Deposit: selectedOption ? selectedOption.value : '',
                                                                        }));
                                                                        if (ReferenceRef.current) {
                                                                            ReferenceRef.current.focus();
                                                                        }
                                                                    }}
                                                                />
                                                            </div>

                                                            <div className="col-md-5 mb-2">
                                                                <label className="form-label required">संदर्भ</label>
                                                                <Select
                                                                    placeholder="निवडा"
                                                                    classNamePrefix="react-select"
                                                                    options={farmer}
                                                                    openMenuOnFocus={true}
                                                                    name="Reference"
                                                                    ref={ReferenceRef}
                                                                    styles={customStyles}
                                                                    value={farmer.find(option => option.value === formData.Reference) || null}
                                                                    onChange={(selectedOption) => {
                                                                        setFormData(prevState => ({
                                                                            ...prevState,
                                                                            Reference: selectedOption ? selectedOption.value : '',
                                                                        }));
                                                                        if (AmountRef.current) {
                                                                            AmountRef.current.focus();
                                                                        }
                                                                    }}
                                                                />
                                                            </div>

                                                            <div className="col-md-2 mb-2">
                                                                <label className="form-label"></label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control mt-2"
                                                                    defaultValue={0}
                                                                    readOnly
                                                                    style={{
                                                                        backgroundColor: '#f8f85c ',
                                                                        border: 'none',
                                                                    }}
                                                                />
                                                            </div>

                                                        </div>

                                                        <div className="row">

                                                            <div className="col-md-2 mb-2">
                                                                <label className="form-label required">रक्कम</label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"

                                                                    name="Amount"
                                                                    pattern="^\d+(\.\d+)?$"
                                                                    ref={AmountRef}
                                                                    value={formData.Amount}
                                                                    onChange={handleInputChange}
                                                                    onKeyDown={(e) => handleKeyDown(e, msgRef)}
                                                                />
                                                            </div>

                                                            <div className="col-md-9 mb-2">
                                                                <label className="form-label required">शेरा</label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"

                                                                    name="msg"

                                                                    ref={msgRef}
                                                                    value={formData.msg}
                                                                    onChange={handleInputChange}
                                                                />
                                                            </div>

                                                            <div className="col-lg-1">
                                                                <div className="btn-addproduct mt-4">
                                                                    <button type="submit" className="btn btn-submit">
                                                                        जतन करा
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>


                                                        {/* <div className="col-md-2 offset-md-2 d-flex">
                                                            <label className="form-label mt-3 me-2" style={{ whiteSpace: 'nowrap' }}>एकूण जमा </label>
                                                            <input
                                                                type="text"
                                                                className="form-control mt-2"
                                                                defaultValue={0}
                                                                value={totalAmount}
                                                                readOnly
                                                                style={{
                                                                    backgroundColor: '#f8f85c ',
                                                                    border: 'none',
                                                                }}
                                                            />
                                                        </div> */}

                                                        <div className="col-3 text-end">
                                                            <div className="card shadow-sm border-0" style={{ minWidth: '280px' }}>
                                                                <div className="card-body rounded d-flex justify-content-between align-items-center p-2"
                                                                    style={{
                                                                        backgroundColor: '#e3f2fd',  // Light Blue
                                                                        border: '2px solid #2196f3', // Blue
                                                                    }}>
                                                                    <span className="fw-bold text-secondary" style={{ fontSize: '1rem' }}>
                                                                        एकूण जमा :
                                                                    </span>
                                                                    <span className="fw-bold text-primary" style={{ fontSize: '1rem' }}>
                                                                        <span style={{ color: 'red' }}> {totalAmount} </span>
                                                                    </span>
                                                                </div>
                                                            </div>

                                                        </div>

                                                        <div className="col-lg-12">
                                                            <div className="modal-body-table overflow-auto max-vh-100" >
                                                                <div className="table-responsive" style={{ height: "100%" }}>
                                                                    <table className="table table-bordered ">
                                                                        <thead className="thead-dark" style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: '#343a40' }}>
                                                                            <tr>
                                                                                <th className="col-2" style={{ textAlign: 'center' }}>जमा खाते  </th>
                                                                                <th className="col-1" style={{ textAlign: 'center' }}>रक्कम  </th>
                                                                                <th className="col-3" style={{ textAlign: 'center' }}>शेरा  </th>
                                                                                <th className="col-1" style={{ textAlign: 'center' }}>स्थिती</th>
                                                                                <th className="col-1" style={{ textAlign: 'center' }}>क्रुती</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {tableData.map((row, index) => (
                                                                                <tr key={index}>
                                                                                    <td style={{ textAlign: 'center' }}>{row.draccename || row.dracc}</td>
                                                                                    <td style={{ textAlign: 'center' }}>{row.amount || row.voucherAmount}</td>
                                                                                    <td style={{ textAlign: 'center' }}>{row.remark || row.narration}</td>
                                                                                    <td style={{ textAlign: 'center' }}>
                                                                                        <span className={`badge ${row.status == 1 ? 'badge-success' : 'badge-warning'}`}>
                                                                                            <Link to="#" style={{ color: "white", textDecoration: "none" }}>
                                                                                                {row.status == 1 ? 'Completed' : 'Pending'}
                                                                                            </Link>
                                                                                        </span>
                                                                                    </td>
                                                                                    <td style={{ textAlign: 'center' }}>
                                                                                        <Link
                                                                                            to="#"
                                                                                            className="confirm-text p-2"
                                                                                        >
                                                                                            <Trash2 className="feather-trash-2 text-danger"
                                                                                                onClick={() => handleDel(row.voucherAID)}
                                                                                            />
                                                                                        </Link>
                                                                                        <Link
                                                                                            to="#"
                                                                                            className="me-2 p-1"
                                                                                            style={{ color: 'lightblue' }}
                                                                                        >
                                                                                            <Edit className="feather-edit"
                                                                                                onClick={() => handleEdit(row.voucherAID)}
                                                                                            />
                                                                                        </Link>
                                                                                    </td>

                                                                                </tr>
                                                                            ))}
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* <div className="d-flex justify-content-center my-3">
                                                            <div
                                                                className="fw-bold text-center d-flex align-items-center justify-content-center"
                                                                style={{
                                                                    backgroundColor: '#d6f2f7',
                                                                    border: 'blue',
                                                                    borderRadius: '8px',
                                                                    maxWidth: '700px',
                                                                    width: '100%',
                                                                    height: '60px',
                                                                    fontSize: '1.2rem',
                                                                    color: '#333',
                                                                }}
                                                            >
                                                                एकूण जमा : <span style={{ color: 'red' }}> {totalAmount} </span>
                                                            </div>
                                                        </div> */}

                                                        <div className="col-lg-12">
                                                            <div className="btn-addproduct mb-4">
                                                                <button type="button" className="btn btn-cancel me-2" onClick={handleExit}>
                                                                    मागे
                                                                </button>
                                                                <button type="button" className="btn btn-submit"
                                                                    onClick={() => {
                                                                        // handlePending()
                                                                        // const myModal = new window.bootstrap.Modal(document.getElementById('Cash'));
                                                                        // myModal.show();


                                                                        handlePending();
                                                                        if (totalAmount > 0) {


                                                                            const modal = document.getElementById("Cash");

                                                                            if (modal) {
                                                                                modal.classList.add("show");
                                                                                modal.style.display = "block";
                                                                                modal.setAttribute("aria-modal", "true");
                                                                                modal.setAttribute("role", "dialog");
                                                                                modal.removeAttribute("aria-hidden");

                                                                                const backdrop = document.createElement("div");
                                                                                backdrop.className = "modal-backdrop fade show";
                                                                                document.body.appendChild(backdrop);

                                                                                document.body.classList.add("modal-open");
                                                                                document.body.style.overflow = "hidden";
                                                                                document.body.style.paddingRight = "0px";
                                                                            }
                                                                        } else {
                                                                            Swal.fire({
                                                                                icon: "warning",
                                                                                title: "त्रुटी!",
                                                                                text: "कृपया एकूण रक्कम जमा करा.",
                                                                                confirmButtonText: "ठीक आहे",
                                                                            });
                                                                        }

                                                                    }}
                                                                // onClick={handlePending}
                                                                >
                                                                    सेव्ह करा
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className={`tab-pane ${activeTab === 'nav-cart-justified' ? 'show active' : ''}`} id="nav-cart-justified" role="tabpanel">
                                                        <div className="row">
                                                            <div className="col-md-2 mb-2">
                                                                <label className="form-label required">व्हाउचर नंबर  </label>
                                                                <input
                                                                    type="text"
                                                                    name="Vouchernumber"
                                                                    className="form-control"
                                                                    readOnly
                                                                    value={voucherNumber}
                                                                    onChange={handleInputChange}

                                                                />
                                                            </div>

                                                            <div className="col-md-2 mb-2">
                                                                <label className="form-label required">तारीख </label>
                                                                <input
                                                                    value={currentDate}
                                                                    name="Date"
                                                                    readOnly
                                                                    className="form-control"
                                                                />
                                                            </div>

                                                            <div className="col-md-3 mb-2">
                                                                <label className="form-label required">नावे  </label>
                                                                <input
                                                                    // classNamePrefix="react-select"
                                                                    // options={ServiceType}
                                                                    type="text"
                                                                    placeholder="निवडा"
                                                                    name="Depositname"
                                                                    className="form-control"
                                                                    defaultValue={'नावे'}
                                                                    readOnly
                                                                    ref={Depositname1Ref}
                                                                // value={ServiceType.find(option => option.value === formData.Depositname) || null}
                                                                //     onChange={(selectedOption) => {
                                                                //         setFormData(prevState => ({
                                                                //             ...prevState,
                                                                //             Depositname: selectedOption ? selectedOption.value : '',
                                                                //         }));
                                                                //         if (Deposit2Ref.current) {
                                                                //             Deposit2Ref.current.focus();
                                                                //         }
                                                                //     }}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-md-5 mb-2">
                                                                <label className="form-label required">नावे खाते </label>
                                                                <Select
                                                                    classNamePrefix="react-select"
                                                                    options={jamaname}
                                                                    placeholder="निवडा"
                                                                    name="Deposit1"
                                                                    styles={customStyles}
                                                                    // openMenuOnFocus={true}
                                                                    ref={Deposit1Ref}
                                                                    value={jamaname.find(option => option.value === formData.Deposit1) || null}
                                                                    onChange={(selectedOption) => {
                                                                        setSelectedRelid(selectedOption?.name || "")
                                                                        setFormData(prevState => ({
                                                                            ...prevState,
                                                                            Deposit1: selectedOption ? selectedOption.value : '',
                                                                        }));
                                                                        if (Reference1Ref.current) {
                                                                            Reference1Ref.current.focus();
                                                                        }
                                                                    }}
                                                                />
                                                            </div>
                                                            <div className="col-md-5 mb-2">
                                                                <label className="form-label required">संदर्भ</label>
                                                                <Select
                                                                    placeholder="निवडा"
                                                                    classNamePrefix="react-select"
                                                                    options={farmer}
                                                                    openMenuOnFocus={true}
                                                                    ref={Reference1Ref}
                                                                    name="Reference1"
                                                                    styles={customStyles}
                                                                    value={farmer.find(option => option.value === formData.Reference1) || null}
                                                                    onChange={(selectedOption) => {
                                                                        setFormData(prevState => ({
                                                                            ...prevState,
                                                                            Reference1: selectedOption ? selectedOption.value : '',
                                                                        }));
                                                                        if (Amount1Ref.current) {
                                                                            Amount1Ref.current.focus();
                                                                        }
                                                                    }}
                                                                />
                                                            </div>


                                                            <div className="col-md-2 mb-2">
                                                                <label className="form-label"></label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control mt-2"
                                                                    defaultValue={0}
                                                                    readOnly
                                                                    style={{
                                                                        backgroundColor: '#f8f85c ',
                                                                        border: 'none',
                                                                    }}
                                                                />
                                                            </div>

                                                        </div>

                                                        <div className="row">
                                                            <div className="col-md-2 mb-2">
                                                                <label className="form-label required">रक्कम</label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    ref={Amount1Ref}

                                                                    pattern="^\d+(\.\d+)?$"
                                                                    name="Amount1"
                                                                    value={formData.Amount1}
                                                                    onChange={handleInputChange}
                                                                    onKeyDown={(e) => handleKeyDown(e, msg1Ref)}
                                                                />
                                                            </div>
                                                            <div className="col-md-9 mb-2">
                                                                <label className="form-label required">शेरा</label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    name="msg1"
                                                                    ref={msg1Ref}
                                                                    value={formData.msg1}
                                                                    onChange={handleInputChange}
                                                                />
                                                            </div>

                                                            <div className="col-lg-1">
                                                                <div className="btn-addproduct mt-4">
                                                                    <button type="submit" className="btn btn-submit">
                                                                        जतन करा
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>


                                                        {/* <div className="col-md-2  offset-md-3 d-flex align-items-center"> */}
                                                        {/* <div className="col-md-2 offset-md-2 d-flex">
                                                            <label className="form-label mt-3 me-2" style={{ whiteSpace: 'nowrap' }}>एकूण जमा </label>
                                                            <input
                                                                type="text"
                                                                className="form-control mt-2"
                                                                value={totalAmount1}
                                                                defaultValue={0}
                                                                readOnly
                                                                style={{
                                                                    backgroundColor: '#f8f85c ',
                                                                    border: 'none',
                                                                }}
                                                            />
                                                        </div> */}

                                                        <div className="col-3 text-end">
                                                            <div className="card shadow-sm border-0" style={{ minWidth: '280px' }}>
                                                                <div className="card-body rounded d-flex justify-content-between align-items-center p-2"
                                                                    style={{
                                                                        backgroundColor: '#e3f2fd',  // Light Blue
                                                                        border: '2px solid #2196f3', // Blue
                                                                    }}>
                                                                    <span className="fw-bold text-secondary" style={{ fontSize: '1rem' }}>
                                                                        एकूण जमा :
                                                                    </span>
                                                                    <span className="fw-bold text-primary" style={{ fontSize: '1rem' }}>
                                                                        <span style={{ color: 'red' }}> {totalAmount1} </span>
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="col-lg-12">
                                                            <div className="modal-body-table overflow-auto max-vh-100" >
                                                                <div className="table-responsive" style={{ height: "100%" }}>
                                                                    <table className="table table-bordered table-sm">
                                                                        <thead className="thead-dark" style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: '#343a40' }}>
                                                                            <tr>

                                                                                <th className="col-2" style={{ textAlign: 'center' }}>नावे खाते  </th>
                                                                                <th className="col-1" style={{ textAlign: 'center' }}>रक्कम  </th>
                                                                                <th className="col-3" style={{ textAlign: 'center' }}>शेरा  </th>
                                                                                <th className="col-1" style={{ textAlign: 'center' }}>स्थिती</th>
                                                                                <th className="col-1" style={{ textAlign: 'center' }}>क्रुती</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {tableData1.map((row, index) => (
                                                                                <tr key={index}>

                                                                                    <td style={{ textAlign: 'center' }}>{row.draccename || row.dracc}</td>
                                                                                    <td style={{ textAlign: 'center' }}>{row.amount || row.voucherAmount}</td>
                                                                                    <td style={{ textAlign: 'center' }}>{row.remark || row.narration}</td>
                                                                                    <td style={{ textAlign: 'center' }}>
                                                                                        <span className={`badge ${row.status == 1 ? 'badge-success' : 'badge-warning'}`}>
                                                                                            <Link to="#" style={{ color: "white", textDecoration: "none" }}>
                                                                                                {row.status == 1 ? 'Completed' : 'Pending'}
                                                                                            </Link>
                                                                                        </span>
                                                                                    </td>

                                                                                    <td style={{ textAlign: 'center' }}>
                                                                                        <Link
                                                                                            to="#"
                                                                                            className="confirm-text p-2"
                                                                                        >
                                                                                            <Trash2 className="feather-trash-2 text-danger"
                                                                                                onClick={() => handleDel1(row.voucherAID)}
                                                                                            />
                                                                                        </Link>
                                                                                        <Link
                                                                                            to="#"
                                                                                            className="me-2 p-1"
                                                                                            style={{ color: 'lightblue' }}
                                                                                        >
                                                                                            <Edit className="feather-edit"
                                                                                                onClick={() => handleEdit1(row.voucherAID)}
                                                                                            />
                                                                                        </Link>
                                                                                    </td>

                                                                                </tr>
                                                                            ))}
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            </div>

                                                            {/* <div className="d-flex justify-content-center my-3">
                                                                <div
                                                                    className="fw-bold text-center d-flex align-items-center justify-content-center"
                                                                    style={{
                                                                        backgroundColor: '#d6f2f7',
                                                                        border: 'blue',
                                                                        borderRadius: '8px',
                                                                        maxWidth: '700px',
                                                                        width: '100%',
                                                                        height: '60px',
                                                                        fontSize: '1.2rem',
                                                                        color: '#333',
                                                                    }}
                                                                >
                                                                    एकूण जमा : <span style={{ color: 'red' }}> {totalAmount1} </span>
                                                                </div>
                                                            </div> */}

                                                            <div className="col-lg-12">
                                                                <div className="btn-addproduct ">
                                                                    <button type="button" className="btn btn-cancel me-2" onClick={handleExit}>
                                                                        मागे
                                                                    </button>
                                                                    <button type="button"
                                                                        onClick={() => {
                                                                            // handlePending()
                                                                            // const myModal = new window.bootstrap.Modal(document.getElementById('Cash'));
                                                                            // myModal.show();


                                                                            handlePending();
                                                                            if (totalAmount1 > 0) {
                                                                                const modal = document.getElementById("Cash");

                                                                                if (modal) {
                                                                                    modal.classList.add("show");
                                                                                    modal.style.display = "block";
                                                                                    modal.setAttribute("aria-modal", "true");
                                                                                    modal.setAttribute("role", "dialog");
                                                                                    modal.removeAttribute("aria-hidden");

                                                                                    const backdrop = document.createElement("div");
                                                                                    backdrop.className = "modal-backdrop fade show";
                                                                                    document.body.appendChild(backdrop);

                                                                                    document.body.classList.add("modal-open");
                                                                                    document.body.style.overflow = "hidden";
                                                                                    document.body.style.paddingRight = "0px";
                                                                                }
                                                                            } else {
                                                                                Swal.fire({
                                                                                    icon: "warning",
                                                                                    title: "त्रुटी!",
                                                                                    text: "कृपया एकूण रक्कम जमा करा.",
                                                                                    confirmButtonText: "ठीक आहे",
                                                                                });
                                                                            }
                                                                        }}
                                                                        //                 data-bs-toggle="modal"
                                                                        //  data-bs-target="#add-verification"
                                                                        className="btn btn-submit"
                                                                    // onClick={handlePending}



                                                                    >
                                                                        सेव्ह करा
                                                                    </button>
                                                                </div>
                                                            </div>

                                                        </div>
                                                    </div>
                                                    <div className={`tab-pane ${activeTab === 'nav-orders-justified' ? 'show active' : ''}`} id="nav-orders-justified" role="tabpanel">
                                                        <div className="row">
                                                            <div className="col-md-2 mb-2">
                                                                <label className="form-label required">व्हाउचर नंबर  </label>
                                                                <input
                                                                    type="text"
                                                                    name="Vouchernumber"
                                                                    className="form-control"
                                                                    readOnly
                                                                    value={voucherNumber}
                                                                    onChange={handleInputChange}
                                                                />
                                                            </div>

                                                            <div className="col-md-2 mb-2">
                                                                <label className="form-label required">तारीख </label>
                                                                <input
                                                                    value={currentDate}
                                                                    name="Date"
                                                                    readOnly
                                                                    className="form-control"
                                                                />
                                                            </div>

                                                            <div className="col-md-3 mb-2">
                                                                <label className="form-label required">जमा / नावे  </label>
                                                                <Select
                                                                    classNamePrefix="react-select"
                                                                    options={ServiceType}
                                                                    placeholder="निवडा"
                                                                    name="Depositname"
                                                                    openMenuOnFocus={true}
                                                                    ref={DepositnameRef}
                                                                    value={ServiceType.find(option => option.value === formData.Depositname) || null}
                                                                    onChange={(selectedOption) => {
                                                                        setFormData(prevState => ({
                                                                            ...prevState,
                                                                            Depositname: selectedOption ? selectedOption.value : '',
                                                                        }));
                                                                        if (Deposit2Ref.current) {
                                                                            Deposit2Ref.current.focus();
                                                                        }
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-md-5 mb-2">
                                                                <label className="form-label required">खाते </label>
                                                                <Select
                                                                    classNamePrefix="react-select"
                                                                    options={jamaname}
                                                                    placeholder="निवडा"
                                                                    openMenuOnFocus={true}
                                                                    ref={Deposit2Ref}
                                                                    styles={customStyles}
                                                                    name="Deposit2"
                                                                    value={jamaname.find(option => option.value === formData.Deposit2) || null}
                                                                    onChange={(selectedOption) => {
                                                                        setSelectedRelid(selectedOption?.name || "")
                                                                        setFormData(prevState => ({
                                                                            ...prevState,
                                                                            Deposit2: selectedOption ? selectedOption.value : '',
                                                                        }));
                                                                        if (Reference2Ref.current) {
                                                                            Reference2Ref.current.focus();
                                                                        }
                                                                    }}
                                                                />
                                                            </div>
                                                            <div className="col-md-5 mb-2">
                                                                <label className="form-label required">संदर्भ</label>
                                                                <Select
                                                                    placeholder="निवडा"
                                                                    classNamePrefix="react-select"
                                                                    options={farmer}
                                                                    name="Reference2"
                                                                    openMenuOnFocus={true}
                                                                    ref={Reference2Ref}
                                                                    styles={customStyles}
                                                                    value={farmer.find(option => option.value === formData.Reference2) || null}
                                                                    onChange={(selectedOption) => {
                                                                        setFormData(prevState => ({
                                                                            ...prevState,
                                                                            Reference2: selectedOption ? selectedOption.value : '',
                                                                        }));
                                                                        if (Amount2Ref.current) {
                                                                            Amount2Ref.current.focus();
                                                                        }
                                                                    }}
                                                                />
                                                            </div>

                                                            <div className="col-md-2 mb-2">
                                                                <label className="form-label"></label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control mt-2"
                                                                    defaultValue={0}
                                                                    readOnly
                                                                    style={{
                                                                        backgroundColor: '#f8f85c', // Lighter yellow shade
                                                                        border: 'none',  /* Optional: Removes the border */
                                                                    }}
                                                                />
                                                            </div>

                                                        </div>

                                                        <div className="row">
                                                            <div className="col-md-2 mb-2">
                                                                <label className="form-label required">रक्कम</label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"

                                                                    name="Amount2"
                                                                    pattern="^\d+(\.\d+)?$"
                                                                    ref={Amount2Ref}
                                                                    value={formData.Amount2}
                                                                    onChange={handleInputChange}
                                                                    onKeyDown={(e) => handleKeyDown(e, msg2Ref)}
                                                                />
                                                            </div>
                                                            <div className="col-md-9 mb-2">
                                                                <label className="form-label required">शेरा</label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    name="msg2"
                                                                    ref={msg2Ref}
                                                                    value={formData.msg2}
                                                                    onChange={handleInputChange}
                                                                />
                                                            </div>

                                                            <div className="col-lg-1">
                                                                <div className="btn-addproduct mt-4">
                                                                    <button type="submit" className="btn btn-submit">
                                                                        जतन करा
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>


                                                        {/* <div className="col-md-2 offset-md-2 d-flex">
                                                            <label className="form-label mt-3 me-2" style={{ whiteSpace: 'nowrap' }}>एकूण जमा </label>
                                                            <input
                                                                type="text"
                                                                className="form-control mt-2"
                                                                defaultValue={0}
                                                                value={totalAmount2}
                                                                readOnly
                                                                style={{
                                                                    backgroundColor: '#f8f85c ',
                                                                    border: 'none',
                                                                }}
                                                            />
                                                        </div> */}
                                                        <div className="row text-end">
                                                            <div className="col-3 text-end">
                                                                <div className="card shadow-sm border-0" style={{ minWidth: '280px' }}>
                                                                    <div className="card-body rounded d-flex justify-content-between align-items-center p-2"
                                                                        style={{
                                                                            backgroundColor: '#e3f2fd',  // Light Blue
                                                                            border: '2px solid #2196f3', // Blue
                                                                        }}>
                                                                        <span className="fw-bold text-secondary" style={{ fontSize: '1rem' }}>
                                                                            एकूण जमा :
                                                                        </span>
                                                                        <span className="fw-bold text-primary" style={{ fontSize: '1rem' }}>
                                                                            <span style={{ color: 'red' }}> {totalAmount2} </span>
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="col-md-3 offset-md-3">
                                                                <div className="card shadow-sm border-0" style={{ minWidth: '280px' }}>
                                                                    <div className="card-body rounded d-flex justify-content-between align-items-center p-2"
                                                                        style={{
                                                                            backgroundColor: '#e3f2fd',  // Light Blue
                                                                            border: '2px solid #2196f3', // Blue
                                                                        }}>
                                                                        <span className="fw-bold text-secondary" style={{ fontSize: '1rem' }}>
                                                                            एकूण फरक :
                                                                        </span>
                                                                        <span className="fw-bold text-primary" style={{ fontSize: '1rem' }}>
                                                                            <span style={{ color: 'red' }}> {totaljamanave} </span>
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="col-lg-12">
                                                            <div className="modal-body-table overflow-auto max-vh-100" >
                                                                <div className="table-responsive" style={{ height: "100%" }}>
                                                                    <table className="table table-bordered table-sm">
                                                                        <thead className="thead-dark" style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: '#343a40' }}>
                                                                            <tr>
                                                                                <th className="col-1" style={{ textAlign: 'center' }}>व्हाउचर प्रकार</th>
                                                                                <th className="col-2" style={{ textAlign: 'center' }}>खाते</th>
                                                                                <th className="col-1" style={{ textAlign: 'center' }}>रक्कम</th>
                                                                                <th className="col-3" style={{ textAlign: 'center' }}>शेरा</th>
                                                                                <th className="col-1" style={{ textAlign: 'center' }}>स्थिती</th>
                                                                                <th className="col-1" style={{ textAlign: 'center' }}>क्रुती</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {tableData2.map((row, index) => (
                                                                                <tr key={index}>
                                                                                    <td style={{ textAlign: 'center' }}>{row.jamanavename || row.jamanave}</td>
                                                                                    <td style={{ textAlign: 'center' }}>{row.jamanave == 0 ? (row.draccename || row.dracc) : (row.craccename || row.cracc)}</td>
                                                                                    <td style={{ textAlign: 'center' }}>{row.amount || row.voucherAmount}</td>
                                                                                    <td style={{ textAlign: 'center' }}>{row.remark || row.narration}</td>
                                                                                    <td style={{ textAlign: 'center' }}>
                                                                                        <span className={`badge ${row.status == 1 ? 'badge-success' : 'badge-warning'}`}>
                                                                                            <Link to="#" style={{ color: "white", textDecoration: "none" }}>
                                                                                                {row.status == 1 ? 'Completed' : 'Pending'}
                                                                                            </Link>
                                                                                        </span>
                                                                                    </td>
                                                                                    <td style={{ textAlign: 'center' }}>
                                                                                        <Link
                                                                                            to="#"
                                                                                            className="confirm-text p-2"
                                                                                        >
                                                                                            <Trash2 className="feather-trash-2 text-danger"
                                                                                                onClick={() => handleDel2(row.voucherAID)}
                                                                                            />
                                                                                        </Link>
                                                                                        <Link
                                                                                            to="#"
                                                                                            className="me-2 p-1"
                                                                                            style={{ color: 'lightblue' }}
                                                                                        >
                                                                                            <Edit className="feather-edit"
                                                                                                onClick={() => handleEdit2(row.voucherAID)}
                                                                                            />
                                                                                        </Link>
                                                                                    </td>

                                                                                </tr>
                                                                            ))}
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* <div className="d-flex justify-content-center my-3">
                                                            <div
                                                                className="fw-bold text-center d-flex align-items-center justify-content-center"
                                                                style={{
                                                                    backgroundColor: '#d6f2f7',
                                                                    border: 'blue',
                                                                    borderRadius: '8px',
                                                                    maxWidth: '700px',
                                                                    width: '100%',
                                                                    height: '60px',
                                                                    fontSize: '1.2rem',
                                                                    color: '#333',
                                                                }}
                                                            >
                                                                एकूण जमा : <span style={{ color: 'red' }}> {totalAmount2} </span>
                                                            </div>
                                                        </div> */}

                                                        <div className="col-lg-12">
                                                            <div className="btn-addproduct ">
                                                                <button type="button"
                                                                    className="btn btn-cancel me-2"
                                                                    // data-bs-dismiss="modal" 
                                                                    onClick={handleExit}>
                                                                    मागे
                                                                </button>

                                                                <button type="button"
                                                                    className="btn btn-submit"
                                                                    onClick={() => {
                                                                        handlePending()
                                                                        // const myModal = new window.bootstrap.Modal(document.getElementById('Cash'));
                                                                        // myModal.show();



                                                                    }}
                                                                // onClick={() => {
                                                                //     const myModal = new window.bootstrap.Modal(document.getElementById('Cash'));
                                                                //     myModal.show();
                                                                //   }}
                                                                //                data-bs-toggle="modal"
                                                                //  data-bs-target="#add-verification"
                                                                // onClick={handlePending}
                                                                >
                                                                    सेव्ह करा
                                                                </button>
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
                    </div>
                </div>
            </div>
            < AddCash ACTIVETAB={selectedData.activeTab} onRefresh={refreshData} TOTALAMOUNT={Amount} onClose={handleModalClose} />
            {/* <Verification/> */}
        </div>
    );
};

export default AddVoucher;



