import { Link } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";
import Select from "react-select";
import { Trash2, Edit, ArrowLeft } from "feather-icons-react/build/IconComponents";
import { baseUrl, ACSPLGUID, Accounts } from "../../core/json/custom";
import axios from 'axios';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { getUserData } from '../../Context/UserData';
// import AddCash from "./AddCash";
import AddCash from "../Voucher/AddCash";
// import Verification from "../../core/modals/inventory/verification";

const AddKharchVoucher = ({ voucherAID, onRefresh }) => {

    const GUID = ACSPLGUID.getNew()
    console.log(GUID)
    const { userdetail } = getUserData();
    console.log('vmkid  ', voucherAID)
    const Deposit1Ref = useRef(null);
    const Reference1Ref = useRef(null);
    const Amount1Ref = useRef(null);
    const msg1Ref = useRef(null);
    const Depositname1Ref = useRef(null);

    const handleKeyDown = (e, nextRef) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (nextRef && nextRef.current) {
                nextRef.current.focus();
            }
        }
    };


    const handleModalClose = (result) => {

        handleSucess();
        console.log("Modal resultModal resultModal resultModal resultModal result:", result);

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

    const [tableData1, setTableData1] = useState([]);



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

    useEffect(() => {
        const newVoucher = generateVoucherNumber();
        setVoucherNumber(newVoucher);
    }, [exit]);

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
    },);

    const validateinput = (e) => {
        if (activeTab === 'nav-cart-justified') {
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
        }
    }

    const [currentDate, setCurrentDate] = useState('');

    useEffect(() => {

        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];
        setCurrentDate(formattedDate);
        setFormData(prev => ({
            ...prev,
            Date: formattedDate
        }));
    }, [exit]);
    console.log('DateDateDate', formData.Date)
    console.log('currentDate', currentDate)


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
                    filteredData = response.data.filter(item => item.status == 0 && item.cracc != 'PK0034');
                }

                setTableData1(filteredData);
            } catch (error) {
                console.error("Error fetching vendor data:", error);
            }
        };

        fetchServiceCharge();

    }, [voucherAID]);




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






    const [editingVmkid, setEditingVmkid] = useState(null);



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

                console.log('voucherAmount', row.voucherAmount);
            }


        } catch (error) {
            console.error("Error fetching data:", error);
        }
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


        const isDepositInvalid1 = !formData.Deposit1;
        const isReferenceInvalid1 = !formData.Reference1;
        const isAmountInvalid1 = !formData.Amount1;
        const isMsgInvalid1 = !formData.msg1;




        if (activeTab === 'nav-cart-justified') {
            if (isDepositInvalid1 || isReferenceInvalid1 || isAmountInvalid1 || isMsgInvalid1) {
                // if (isDepositname) {
                //     Depositname1Ref.current?.focus();
                // } else 
                if (isDepositInvalid1) {
                    Deposit1Ref.current?.focus();
                } else if (isReferenceInvalid1) {
                    Reference1Ref.current?.focus();
                } else if (isAmountInvalid1) {
                    Amount1Ref.current?.focus();
                } else if (isMsgInvalid1) {
                    msg1Ref.current?.focus();
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

                    if (response1.data[0].vouchertype == 1) {
                        setActiveTab("nav-cart-justified");
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


        if (activeTab === 'nav-cart-justified') {

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


        }
    }
    const [Amount, setAmount] = useState()
    const [selectedData, setSelectedData] = useState({ activeTab: null });
    const handlePending = () => {
        // handleSucess();
        // showConfirmationAlertSuccess()
        setSelectedData({ activeTab })
        setAmount(totalAmount1)

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


    const handleSucess = async () => {

        if (activeTab === 'nav-cart-justified') {


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
                    grpkey: row.referenceKey || '',
                    batchkey: String(row.vmkid || row.voucherAID || 0),
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
                    // }).then(async() => {

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

                const modal = document.getElementById("add-kharch");
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



    const totalAmount1 = tableData1.reduce((sum, row) => {
        const amount = parseFloat(row.voucherAmount || row.amount) || 0;
        return sum + amount;
    }, 0);



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
            <div className="modal fade" id="add-kharch">
                <div className="modal-dialog  modal-dialog-centered modal-fullscreen">
                    <div className="modal-content mbgcolor">
                        <div className="mbgcolor page-wrapper-new p-0 " style={{ overflow: 'hidden', height: '100vh' }}>
                            <div className="content">
                                <div className="modal-header border-0 custom-modal-header" style={{ padding: '5px' }}>
                                    <div className="page-title">
                                        <h4> रोख नावे</h4>
                                    </div>

                                    <div className="page-btn">
                                        <Link className="btn btn-secondary"
                                            onClick={handleExit}>
                                            <ArrowLeft className="me-2" />
                                            मागे
                                        </Link>
                                    </div>
                                </div>

                                <form onSubmit={handleSubmit}>


                                    <div className="col-xl-12">
                                        <div className="card">

                                            <div className="card-body mbgcolor" >

                                                {/* <Link
                                                    className={`nav-link mb-3 ${activeTab === "nav-cart-justified"}`}
                                                    data-bs-toggle="tab"
                                                    role="tab"
                                                    to="#nav-cart-justified"
                                                    aria-selected={activeTab === 'nav-cart-justified' ? 'true' : 'false'}
                                                    onClick={() => handleTabClick('nav-cart-justified')}
                                                    style={{ fontSize: 18, color: "black" }}
                                                >
                                                    रोख नावे

                                                </Link> */}




                                                <div className="tab-content">



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
                                                                <label className="form-label">तारीख </label>
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
                                                                    openMenuOnFocus={true}
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
                                                                    styles={customStyles}
                                                                    name="Reference1"
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
                                                                <div className="table-responsive" style={{ height: "calc(40vh - 120px)" }}>
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

                                                                            if (totalAmount1 > 0) {
                                                                                handlePending();
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
            < AddCash ACTIVETAB={selectedData.activeTab} onRefresh={refreshData} onClose={handleModalClose} TOTALAMOUNT={Amount} />
            {/* <Verification/> */}
        </div>
    );
};

export default AddKharchVoucher;



