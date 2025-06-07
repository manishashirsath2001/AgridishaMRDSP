import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../../Router/all_routes";
import withReactContent from "sweetalert2-react-content";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ACSPLGUID, baseUrl, convertToISODate } from "../../core/json/custom";
import Swal from "sweetalert2";
import {
    ArrowLeft,
} from "feather-icons-react/build/IconComponents";
import { getUserData } from "../../Context/UserData";
function AddChallanReturn({ PRAID }) {
    const { userdetail } = getUserData();
    const [showForm, setShowForm] = useState(false);
    const [PchallanNO, setPchallanNO] = useState();
    const GUID = ACSPLGUID.getNew()
    const route = all_routes;
    const BillRef = useRef();
    const VendorRef = useRef();
    const ConsignerRef = useRef();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [formData, setFormData] = useState({
        BillNumber: '',
        TransactionNumber: '',
        Consigner: '',
        Narration: '',
        Vendor: '',
        BillDate: '',
        TransactionDate: '',
        Product: '',
        UOM: '',
        Quantity: '',
        Total: '',
        returnQuantity: '',
        netAMT: 0,
        PCAID: '',
        PMODE: '',
        Vendorname: '',
        REFF: '',
    });

    useEffect(() => {
        const handleShortcut = (e) => {
            if (e.ctrlKey && e.key === "s" || e.ctrlKey && e.key === "S") {
                e.handleSubmit();
            }

            if (e.ctrlKey && e.key === "e" || e.ctrlKey && e.key === "E") {
                e.preventDefault();
                showExitAlert();

            }

        };

        window.addEventListener("keydown", handleShortcut);

        return () => {
            window.removeEventListener("keydown", handleShortcut);
        };
    }, [formData]);


    useEffect(() => {
        if (!PRAID) return;

        const fetchMasters = async () => {
            try {
                const payload = {
                    praid: PRAID,
                    companyid: userdetail?.companyID || "",
                    deptid: userdetail?.departmentID || "",
                };

                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };

                const response = await axios.post(
                    `${baseUrl.Url}/backend/api/GET_PReturnDataByID`,
                    payload,
                    { headers }
                );

                if (response.status !== 200) throw new Error("Failed to fetch data");

                if (response.data.length > 0) {
                    const Data = response.data[0];

                    setFormData({
                        BillNumber: Data.pbno,
                        TransactionNumber: Data.potrnno,
                        Consigner: Data.prconsigner,
                        Narration: Data.prnarration,
                        Vendor: Data.pseller,
                        BillDate: convertToISODate(Data.pbdate),
                        TransactionDate: Data.prdate,
                        PMODE: Data.paymentmode,
                        Vendorname: Data.vendorname,
                        REFF: Data.pbreference
                    });

                    const mappedProducts = response.data.map((item) => ({
                        ProductName: item.productname,
                        Product: item.prdproduct,
                        UOM: item.prduom,
                        UOMtitle: item.uomtitle,
                        Quantity: item.prdquantity,
                        Total: item.prtdamt,
                        returnQuantity: item.prdquantityreturn,
                        prdigst: item.prdigst,
                        prdsgst: item.prdsgst,
                        prdcgst: item.prdcgst,
                        prdaid: item.prdaid,
                        batchno: item.batchno,
                        expirydate: convertToISODate(item.expirydate),
                    }));

                    setProducts(mappedProducts);
                    setShowForm(true);
                }
            } catch (error) {
                console.error("Error fetching vendor data:", error);
            }
        };

        fetchMasters();
    }, [PRAID, userdetail]);

    useEffect(() => {
        const handleShortcut = (e) => {
            if ((e.ctrlKey && e.key.toLowerCase() === 'e')) {
                e.preventDefault();
                navigate(route.PurchaseIndex);
            }
            if ((e.ctrlKey && e.key.toLowerCase() === 's')) {
                e.preventDefault();
                validateinput(e);
            }
        };

        window.addEventListener('keydown', handleShortcut);
        return () => {
            window.removeEventListener('keydown', handleShortcut);
        };
    }, [formData, navigate]);

    useEffect(() => {
        if (BillRef.current) {
            BillRef.current.focus();
        }
    }, []);
    const getTodayDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };
    const [selectedDate, setSelectedDate] = useState(getTodayDate());
    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
        setFormData(prevData => ({
            ...prevData,
            TransactionDate: event.target.value,
        }));
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleReturnQuantityChange = (index, event) => {
        const updatedProducts = [...products];
        updatedProducts[index].returnQuantity = event.target.value;
        setProducts(updatedProducts);
    };

    const handleSubmit = (event) => {
        showConfirmationAlert(event);
    };

    const MySwal = withReactContent(Swal);
    const showConfirmationAlert = () => {
        MySwal.fire({
            title: "तुम्ही खात्री आहे का?",
            text: "तुम्हाला हि डेटा जतन करायचा आहे का?",
            showCancelButton: true,
            confirmButtonColor: "#00ff00",
            confirmButtonText: "जतन करा",
            cancelButtonColor: "#092C4C",
            cancelButtonText: "रद्द करा",
        }).then((result) => {
            if (result.isConfirmed) {
                validateinput();
            }
        });
    };

    const handleSave = async () => {
        console.log("Products Details", products);
        console.log("FormData", formData);

        try {
            const payload = {
                "praid": PRAID ? PRAID : GUID,
                "pbno": formData.BillNumber,
                "pbdate": formData.BillDate,
                "potrnno": formData.TransactionNumber,
                "pseller": formData.Vendor,
                "prconsigner": formData.Consigner,
                "pbrefewence": formData.PCAID ? formData.PCAID : formData.REFF,
                "prnarration": formData.Narration,
                "prdate": formData.TransactionDate,
                "prnamt": formData.netAMT,
                "prgamt": 0,
                "companyid": userdetail?.companyID || "",
                "deptid": userdetail?.departmentID || "",
                "rtype": 2,
                "paymentmode": formData.PMODE,
            };

            console.log("Master Payload", payload);

            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            // First API Call - Add/Update Purchase Return Master
            const response1 = await axios.post(`${baseUrl.Url}/backend/api/AddUpdPReturnMaster`, payload, { headers });

            if (response1.status === 200) {
                const payload2 = products.map((product) => ({
                    "prdaid": product.prdaid ? product.prdaid : ACSPLGUID.getNew(),
                    "praid": PRAID ? PRAID : GUID,
                    "prdproduct": product.Product,
                    "prduom": product.UOM,
                    "prdquantity": product.Quantity,
                    "prdquantityreturn": product.returnQuantity.toString(),
                    "prtdamt": product.Total,
                    "prdigst": product.prdigst,
                    "prdsgst": product.prdsgst,
                    "prdcgst": product.prdcgst,
                    "companyid": userdetail?.companyID || "",
                    "deptid": userdetail?.departmentID || "",
                    "batchno": product.batchno || '',
                    "expirydate": product.expirydate || ''
                }));

                console.log("Detail Payload", payload2);

                // Second API Call - Add/Update Purchase Return Details
                const response2 = await axios.post(`${baseUrl.Url}/backend/api/AddUpdPReturnDetails`, payload2, { headers });

                if (response2.status === 200) {
                    Swal.fire({
                        icon: "success",
                        title: "Saved!",
                        text: "Data saved successfully.",
                        confirmButtonText: "OK",
                    }).then((result) => {
                        if (result.isConfirmed) {
                            const modal = document.getElementById("Challlanreturn");
                            if (modal) {
                                if (modal) {
                                    modal.classList.remove("show");
                                    modal.style.display = "none";
                                    document.body.classList.remove("modal-open");
                                    document.body.style.overflow = "auto";

                                    const backdrop = document.querySelector(".modal-backdrop");
                                    if (backdrop) {
                                        backdrop.remove();
                                    }
                                }
                                setFormData({
                                    BillNumber: '',
                                    TransactionNumber: '',
                                    Consigner: '',
                                    Narration: '',
                                    Vendor: '',
                                    BillDate: '',
                                    TransactionDate: '',
                                    Product: '',
                                    UOM: '',
                                    Quantity: '',
                                    Total: '',
                                    returnQuantity: '',
                                    netAMT: 0,
                                    PCAID: '',
                                    PMODE: '',
                                    Vendorname: '',
                                    REFF: '',
                                });

                                setPchallanNO("");
                                setProducts([]);

                            }

                            const backdrop = document.querySelector(".modal-backdrop");
                            if (backdrop) {
                                backdrop.remove();
                            }
                        }
                    });
                } else {
                    throw new Error("Failed to save purchase return details.");
                }
            } else {
                throw new Error("Failed to save purchase return master.");
            }
        } catch (error) {
            console.error("Submission Error:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to save data. Please try again.",
            });
        }
    };


    const validateinput = (e) => {
        const { BillNumber, Vendor, Consigner } = formData;
        if ((!BillNumber || !/^\d{4,}$/.test(BillNumber)) ||
            (!Vendor || !/^[A-Za-z]+( [A-Za-z]+)*$/.test(Vendor)) ||
            (!Consigner || !/^[A-Za-z]+( [A-Za-z]+)*$/.test(Consigner))) {
            Swal.fire({
                icon: "error",
                title: "Validation Error",
                text: "Please fill in all the required fields",
            }).then(() => {
                BillRef.current.focus();
                VendorRef.current.focus();
                ConsignerRef.current.focus();
            })
            return;
        }
        handleSave(e);
    }
    const handleSearch = async (PchallanNO) => {
        if (PchallanNO) {
            setShowForm(true);
            try {
                const payload = {
                    pctrnno: PchallanNO,
                    companyid: userdetail?.companyID || "",
                    deptid: userdetail?.departmentID || "",
                };
                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };
                const response = await axios.post(
                    `${baseUrl.Url}/backend/api/GET_PChallanNoSearch`,
                    payload,
                    { headers }
                );
                if (response.status !== 200)
                    throw new Error("Failed to fetch vendor data");
                console.log("billnodata", response.data)
                if (response.data.length > 0) {
                    setFormData(prevState => ({
                        ...prevState,
                        BillNumber: response.data[0].pctrnno,
                        Consigner: response.data[0].pcconsigner,
                        Vendor: response.data[0].pcseller,
                        Vendorname: response.data[0].vendorname,
                        BillDate: convertToISODate(response.data[0].pcdate),
                        netAMT: response.data[0].pcnamt,
                        PBAID: response.data[0].pcaid,
                        PMODE: response.data[0].paymentmode,
                    }));
                    const mappedProducts = response.data.map((item) => ({
                        ProductName: item.productname,
                        Product: item.pcdproduct,
                        UOM: item.pcduom,
                        UOMtitle: item.producttitle,
                        Quantity: item.pcdquantity,
                        Total: item.pcdtamt,
                        returnQuantity: 0,
                        prdigst: item.pbdigst,
                        prdsgst: item.pbdsgst,
                        prdcgst: item.pbdcgst,
                        batchno: item.batchno,
                        expirydate: convertToISODate(item.expirydate)
                    }));
                    setProducts(mappedProducts);
                }
            } catch (error) {
                console.error("Error fetching vendor data:", error);
            }
        } else {
            Swal.fire({
                icon: "error",
                title: "Validation Error",
                text: "Please fill the Bill Number ",
            }).then(() => {
                BillRef.current.focus();
            })
        }
    };

    // const MySwal = withReactContent(Swal);
    const showExitAlert = () => {
        MySwal.fire({
            title: "तुम्ही खात्री आहे का?",
            text: "तुम्हाला बाहेर पडायचं आहे का?",
            showCancelButton: true,
            confirmButtonColor: "#00ff00",
            confirmButtonText: "होय",
            cancelButtonColor: "#092C4C",
            cancelButtonText: "नाही",
        }).then((result) => {
            if (result.isConfirmed) {
                const modal = document.getElementById("Challlanreturn");
                if (modal) {
                    if (modal) {
                        modal.classList.remove("show");
                        modal.style.display = "none";
                        document.body.classList.remove("modal-open");
                        document.body.style.overflow = "auto";

                        const backdrop = document.querySelector(".modal-backdrop");
                        if (backdrop) {
                            backdrop.remove();
                        }
                    }

                    setFormData({
                        BillNumber: '',
                        TransactionNumber: '',
                        Consigner: '',
                        Narration: '',
                        Vendor: '',
                        BillDate: '',
                        TransactionDate: '',
                        Product: '',
                        UOM: '',
                        Quantity: '',
                        Total: '',
                        returnQuantity: '',
                        netAMT: 0,
                        PCAID: '',
                        PMODE: '',
                        Vendorname: '',
                        REFF: '',
                    });
                    setPchallanNO("");
                    setProducts();
                }
                const backdrop = document.querySelector(".modal-backdrop");
                if (backdrop) {
                    backdrop.remove();
                }

            }
        });
    };
    return (
        <div>
            <div
                className="modal fade"
                id="Challlanreturn"
                tabIndex={-1}
                aria-labelledby="exampleModalFullscreenLabel"
                aria-hidden="true">
                <div className="modal-dialog modal-fullscreen">
                    <div className="modal-content">
                        <div className="modal-body">
                            <div className="modal-content">
                                <div className="page-wrapper-new p-0">
                                    <div className="content ">
                                        <form onSubmit={handleSubmit}>
                                            <div className="modal-header border-0 custom-modal-header  ">
                                                <div className="page-title d-flex justify-content-between align-items-center w-75 ">
                                                    <div className="page-title ">
                                                        <h4>खरेदी चलन परत :</h4>
                                                    </div>
                                                </div>
                                                <div className="page-btn">
                                                    <Link className="btn btn-secondary"
                                                        aria-label="Close"
                                                        // data-bs-dismiss="modal"
                                                        onClick={showExitAlert}>

                                                        <ArrowLeft className="me-2" />
                                                        परत अनुक्रमणिकेकडे
                                                    </Link>
                                                </div>
                                            </div>
                                            {!showForm && (
                                                <div className="row justify-content-center m-1">
                                                    <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-4">
                                                        <div className="search-input d-flex align-items-center">
                                                            <input
                                                                type="text"
                                                                placeholder="Search challan No"
                                                                className="form-control w-100"
                                                                value={PchallanNO}
                                                                onChange={(e) => setPchallanNO(e.target.value)}
                                                                ref={BillRef}
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => handleSearch(PchallanNO)}
                                                                className="btn btn-primary ms-3 mt-1 mt-sm-0"
                                                            >
                                                                शोधा
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            <div className="modal-body custom-modal-body">
                                                {showForm && (
                                                    <div>
                                                        <div className="row">
                                                            <div className="col-lg-3 col-md-6 col-sm-12">
                                                                <div className="form-label">
                                                                    <label className="form-label required">व्यवहार क्रमांक :</label>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        value={formData.TransactionNumber || ""}
                                                                        name="TransactionNumber"
                                                                        onChange={handleChange}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="col-lg-3 col-md-6 col-sm-12">
                                                                <div className="input-blocks">
                                                                    <label className="form-label required">व्यवहार दिनांक:</label>
                                                                    <div className="input-groupicon calender-input">
                                                                        <input
                                                                            type="date"
                                                                            className="form-control"
                                                                            value={selectedDate}
                                                                            placeholder="Choose Date"
                                                                            onChange={handleDateChange}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-lg-3 col-md-6 col-sm-12">
                                                                <div className="">
                                                                    <label className="form-label required">चलन क्रमांक:</label>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        value={formData.BillNumber || ""}
                                                                        readOnly
                                                                        title="Bill only contains Numbers."
                                                                        onChange={handleChange}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="col-lg-3 col-md-6 col-sm-12">
                                                                <div className="input-blocks">
                                                                    <label className="form-label required">चलन क्रमांक:</label>
                                                                    <div className="input-groupicon calender-input">
                                                                        <input
                                                                            type="date"
                                                                            className="form-control"
                                                                            value={formData.BillDate}
                                                                            placeholder="Choose Date"
                                                                            onChange={(e) =>
                                                                                setFormData({
                                                                                    ...formData,
                                                                                    BillDate: e.target.value,
                                                                                })
                                                                            }
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-lg-5 col-md-6 col-sm-12">
                                                                <div className="add-product">
                                                                    <label className="form-label required">पुरवठादार:</label>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        ref={VendorRef}
                                                                        required
                                                                        value={formData.Vendorname || ""}
                                                                        name="Vendorname"
                                                                        onChange={handleChange}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="col-lg-4 col-md-6 col-sm-12">
                                                                <div className="form-label">
                                                                    <label className="form-label required">प्रेषक:</label>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        ref={ConsignerRef}
                                                                        required
                                                                        value={formData.Consigner || ""}
                                                                        name="Consigner"
                                                                        onChange={handleChange}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="col-lg-3 col-md-6 col-sm-12">
                                                                <div className="form-label">
                                                                    <label className="form-label required">पेमेंट पद्धती:</label>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        required
                                                                        value={formData.PMODE || ""}
                                                                        name="PMODE"
                                                                        onChange={handleChange}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="col-lg-12 col-sm-6 col-12">
                                                                <div className="mb-5">
                                                                    <label className="form-label">वर्णन:</label>
                                                                    <textarea
                                                                        className="form-control mb-1"
                                                                        value={formData.Narration || ""}
                                                                        name="Narration"
                                                                        onChange={handleChange}
                                                                        rows={2}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {/* <div className="row border border-1 p-3">
                                                            <h5>Purchase Challan Return Detail:</h5>
                                                            <div className="col-lg-12">
                                                                <div className="modal-body-table" style={{ maxHeight: "200px", overflowY: "auto" }}>
                                                                    <div className="table-responsive">
                                                                        <table className="table table-bordered" style={{ borderCollapse: "collapse", width: "100%" }}>
                                                                            <thead className="thead-dark"
                                                                                style={{
                                                                                    position: "sticky",
                                                                                    top: 0,
                                                                                    zIndex: 2,
                                                                                    backgroundColor: "#343a40",
                                                                                    color: "white"
                                                                                }}
                                                                            >
                                                                                <tr>
                                                                                    <th>Product</th>
                                                                                    <th>Batch No.</th>
                                                                                    <th>Expiry date</th>
                                                                                    <th>UOM</th>
                                                                                    <th>Quantity</th>
                                                                                    <th>Total</th>
                                                                                    <th>Return Quantity</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody>
                                                                                {products && products.length > 0 ? (
                                                                                    products.map((product, index) => (
                                                                                        <tr key={index}>
                                                                                            <td>{product.ProductName}</td>
                                                                                            <td>{product.batchno}</td>
                                                                                            <td>{product.expirydate}</td>
                                                                                            <td>{product.UOMtitle}</td>
                                                                                            <td>{product.Quantity}</td>
                                                                                            <td>{product.Total}</td>
                                                                                            <td>
                                                                                                <input
                                                                                                    type="number"
                                                                                                    className="form-control form-control-sm"
                                                                                                    name="returnQuantity"
                                                                                                    required
                                                                                                    min={0}
                                                                                                    value={product.returnQuantity || 0}
                                                                                                    onChange={(e) => handleReturnQuantityChange(index, e)}
                                                                                                />
                                                                                            </td>
                                                                                        </tr>
                                                                                    ))
                                                                                ) : (
                                                                                    <tr>
                                                                                        <td colSpan="5" className="text-center">
                                                                                            No Products Available
                                                                                        </td>
                                                                                    </tr>
                                                                                )}
                                                                            </tbody>
                                                                        </table>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div> */}
                                                        <div className="row border border-1 p-3">
                                                            <h5>खरेदी चलन परतफेड तपशील :</h5>
                                                            <div className="col-lg-12">
                                                                <div className="table-responsive" style={{ maxHeight: "200px", overflowY: "auto" }}>
                                                                    <table className="table table-bordered" style={{ borderCollapse: "collapse" }}>
                                                                        <thead className="thead-dark"
                                                                            style={{
                                                                                position: "sticky",
                                                                                top: 0,
                                                                                zIndex: 2,
                                                                                backgroundColor: "#343a40",
                                                                                color: "white"
                                                                            }}
                                                                        >
                                                                            <tr>
                                                                                <th>उत्पादन</th>
                                                                                <th>बैच क्रमांक.</th>
                                                                                <th>अखेरची तारीख</th>
                                                                                <th>माप युनिट</th>
                                                                                <th>प्रमाण</th>
                                                                                <th>एकूण</th>
                                                                                <th>परत करण्याचे प्रमाण</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {products && products.length > 0 ? (
                                                                                products.map((product, index) => (
                                                                                    <tr key={index}>
                                                                                        <td>{product.ProductName}</td>
                                                                                        <td>{product.batchno}</td>
                                                                                        <td>{product.expirydate}</td>
                                                                                        <td>{product.UOMtitle}</td>
                                                                                        <td>{product.Quantity}</td>
                                                                                        <td>{product.Total}</td>
                                                                                        <td>
                                                                                            <input
                                                                                                type="number"
                                                                                                className="form-control form-control-sm"
                                                                                                name="returnQuantity"
                                                                                                required
                                                                                                min={0}
                                                                                                value={product.returnQuantity || 0}
                                                                                                onChange={(e) => handleReturnQuantityChange(index, e)}
                                                                                            />
                                                                                        </td>
                                                                                    </tr>
                                                                                ))
                                                                            ) : (
                                                                                <tr>
                                                                                    <td colSpan="7" className="text-center">
                                                                                        उत्पादने उपलब्ध नाहीत
                                                                                    </td>
                                                                                </tr>
                                                                            )}
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-12">
                                                            <div className="modal-footer-btn">
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-cancel me-2"
                                                                    // data-bs-dismiss="modal"
                                                                    onClick={showExitAlert}
                                                                >
                                                                    रद्द करा
                                                                </button>
                                                                <button className="btn btn-submit">
                                                                    खरेदी जतन करा
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </div >
    )
}
export default AddChallanReturn
