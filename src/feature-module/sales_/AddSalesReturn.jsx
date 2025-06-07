import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../../Router/all_routes";
import withReactContent from "sweetalert2-react-content";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// import { ACSPLGUID } from "../../core/json/custom";
import { baseUrl, ACSPLGUID } from "../../core/json/custom";
import { useLocation } from 'react-router-dom';
import Swal from "sweetalert2";
import {

    ArrowLeft,

} from "feather-icons-react/build/IconComponents";
import { getUserData } from "../../Context/UserData";

const AddSalesReturn = ({ SRAID }) => {
    const { userdetail } = getUserData();
    console.log("SRAID", SRAID)

    const [sbbillno, setsbbillno] = useState();
    const location = useLocation();
    const { CAID } = location.state || {};
    console.log('CAID', CAID)

    const GUID = ACSPLGUID.getNew()
    // const DGUID = ACSPLGUID.getNew()

    const handleSubmit = (e) => {
        e.preventDefault();
        showConfirmationAlert(e);
    };

    const MySwal = withReactContent(Swal);

    const showConfirmationAlert = () => {
        MySwal.fire({
            title: "Are you sure?",
            text: "Do you want to save this data?",
            showCancelButton: true,
            confirmButtonColor: "#00ff00",
            confirmButtonText: "SAVE",
            cancelButtonColor: "#092C4C",
            cancelButtonText: "CANCEL",
        }).then((result) => {
            if (result.isConfirmed) {
                // handleModalConfirm(event);
                handleSave();
            }
        });
    };

    const showExitAlert = () => {
        MySwal.fire({
            title: "Are you sure?",
            text: "Do you want to Exit?",
            showCancelButton: true,
            confirmButtonColor: "#00ff00",
            confirmButtonText: "YES",
            cancelButtonColor: "#092C4C",
            cancelButtonText: "NO",
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = route.SalesReturn;
            }
        });
    };

    const [selectedDate, setSelectedDate] = useState('');
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
        Vendorname: '',
        HSN: '',
        Productname: '',
        UOMtitle: '',
        Batchnumber: '',
        Expirydate: '',
        SRDAID: '',
    });

    const route = all_routes;
    const BillRef = useRef();
    const SearchRef = useRef();
    const VendorRef = useRef();
    const ConsignerRef = useRef();
    const navigate = useNavigate();


    useEffect(() => {
        const fetchData = async () => {
            try {
                // First API call to fetch vendor data
                const payload1 = {
                    "sraid": SRAID,
                    "companyid": userdetail?.companyID || "",
                    "deptid": userdetail?.departmentID || "",
                };
                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };

                const response1 = await axios.post(
                    `${baseUrl.Url}/backend/api/GET_SReturnMaster`,
                    payload1,
                    { headers }
                );
                if (response1.status !== 200)
                    throw new Error("Failed to fetch vendor data");

                console.log("master", response1.data);
                if (response1.data.length > 0) {
                    setFormData(prevState => ({
                        ...prevState,
                        BillNumber: response1.data[0].sbno,
                        Consigner: response1.data[0].srconsigner,
                        Vendor: response1.data[0].sseller,
                        BillDate: response1.data[0].sbdate,
                        Narration: response1.data[0].srnarration,
                    }));
                }

                // Second API call to fetch bill details by ID
                const payload2 = {
                    "sraid": SRAID,
                    "companyid": userdetail?.companyID || "",
                    "deptid": userdetail?.departmentID || "",
                };

                const response2 = await axios.post(
                    `${baseUrl.Url}/backend/api/GET_SReturnDetailsById`,
                    payload2,
                    { headers }
                );
                if (response2.status !== 200)
                    throw new Error("Failed to fetch bill details");

                console.log("Detail", response2.data);
                if (Array.isArray(response2.data) && response2.data.length > 0) {
                    const mappedProducts = response2.data.map((item) => ({
                        Product: item.srdproduct,
                        Productname: item.productname,
                        HSN: item.hsncode,
                        UOM: item.srduom,
                        UOMtitle: item.uomtitle,
                        Batchnumber: item.batchno,
                        Expirydate: item.expirydate,
                        Quantity: item.srdquantity,
                        Total: item.srtdamt,
                        returnQuantity: item.srdquantityreturn,
                        SRDAID: item.srdaid,
                    }));

                    setProducts(mappedProducts);
                }

            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [SRAID]);



    useEffect(() => {
        const handleShortcut = (e) => {
            if (e.ctrlKey && e.key === 'e' || e.ctrlKey && e.key === 'E') {
                e.preventDefault();
                navigate(route.SalesIndex);
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
    }, [formData, navigate]);



    // useEffect(() => {
    //   if (BillRef.current) {
    //     BillRef.current.focus(); 
    //   }
    // }, []);


    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        setSelectedDate(today);
        setFormData((prevFormData) => ({
            ...prevFormData,
            TransactionDate: today,
        }));
    }, []);

    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
    };


    const generateTransactionNumber = () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 6; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            result += characters[randomIndex];
        }
        return result;
    };

    useEffect(() => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            TransactionNumber: generateTransactionNumber(),
        }));
    }, []);


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

        // setFormData((prevFormData) => ({
        //     ...prevFormData,
        //     products: updatedProducts, 
        //   }));
    };

    const handleSave = async () => {

        console.log('products Details', products);

        console.log('formData', formData);
        // handleSave();


        try {

            const payload = {
                "sraid": SRAID ? SRAID : GUID,
                "sbno": formData.BillNumber,
                "sbdate": formData.BillDate,
                "sotrnno": formData.TransactionNumber,
                "sseller": formData.Vendor,
                "srconsigner": formData.Consigner,
                "sbrefewence": "",
                "srnarration": formData.Narration,
                "srdate": formData.TransactionDate,
                "srnamt": 0,
                "srgamt": 0,
                "companyid": userdetail?.companyID || "",
                "deptid": userdetail?.departmentID || "",
            };
            console.log("Master payload ", payload);
            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            axios({
                method: "POST",
                url: baseUrl.Url + "/backend/api/SP_AddUpdSReturnMaster",
                data: JSON.stringify(payload),
                headers: headers,
            })
            Swal.fire({
                icon: "success",
                title: "Saved!",
                text: "Data saved successfully.",
                confirmButtonText: "OK",
            });

            const payload2 = products.map((product) => ({
                "srdaid": product.SRDAID ? product.SRDAID : ACSPLGUID.getNew(),
                "sraid": SRAID ? SRAID : GUID,
                "srdproduct": product.Product,
                "srduom": product.UOM,
                "srdquantity": product.Quantity.toString(),
                "srtdamt": product.Total,
                "srdigst": 0,
                "srdsgst": 0,
                "srdcgst": 0,
                "srdquantityreturn": product.returnQuantity.toString(),
                "hsncode": product.HSN,
                "companyid": userdetail?.companyID || "",
                "deptid": userdetail?.departmentID || "",
                "batchno": product.Batchnumber,
                "expirydate": product.Expirydate
            }));
            console.log("Detail payload2 ", payload2);

            // const headers = {
            //   "Content-Type": "application/json",
            //   Accept: "*/*",
            // };

            axios({
                method: "POST",
                url: baseUrl.Url + "/backend/api/SP_AddUpdSReturnDetails",
                data: JSON.stringify(payload2),
                headers: headers,
            })


            Swal.fire({
                icon: "success",
                title: "Saved!",
                text: "Data saved successfully.",
                confirmButtonText: "OK",
            })
                .then((result) => {
                    if (result.isConfirmed) {
                        // Reload the page when the user clicks "OK"
                        window.location.reload();
                    }
                });


            navigate(route.SalesReturn);

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

        if ((!BillNumber || !/^.{4,}$/.test(BillNumber)) ||
            (!Vendor || !/^[A-Za-z]+( [A-Za-z]+)*$/.test(Vendor)) ||
            (!Consigner || !/^[A-Za-z]+( [A-Za-z]+)*$/.test(Consigner))) {
            Swal.fire({
                icon: "error",
                title: "Validation Error",
                text: "Please fill in all the required fields",
            }).then(() => {
                BillRef.current.focus();
                SearchRef.current.focus();
                VendorRef.current.focus();
                ConsignerRef.current.focus();
            })
            return;
        }
        handleSubmit(e);
    }

    const handleSearch = async (sbbillno) => {
        if (sbbillno) {
            try {
                const payload = {
                    "sbbillno": sbbillno,
                    "companyid": userdetail?.companyID || "",
                    "deptid": userdetail?.departmentID || "",
                }
                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };
                const response = await axios.post(
                    `${baseUrl.Url}/backend/api/GET_SBillNoSearch`,
                    payload,
                    { headers }
                );
                if (response.status !== 200)
                    throw new Error("Failed to fetch vendor data");
                console.log("billnodata", response.data)
                if (response.data.length > 0) {
                    setFormData(prevState => ({
                        ...prevState,

                        BillNumber: response.data[0].sbbillno,
                        Consigner: response.data[0].sbconsigner,
                        Vendor: response.data[0].vendorname,
                        BillDate: response.data[0].sbbilldate,
                        Narration: response.data[0].sbnarration,

                    }));

                    const mappedProducts = response.data.map((item) => ({
                        Product: item.sbproduct,
                        Productname: item.productname,
                        HSN: item.hsncode,
                        UOM: item.sbduom,
                        UOMtitle: item.uomtitle,
                        Batchnumber: item.batchno,
                        Expirydate: item.expirydate,
                        Quantity: item.sbdquantity,
                        Total: item.sbdtamt,
                        returnQuantity: 0,
                        SRDAID: item.srdaid,
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



    return (
        <div>
            {/* {isModalOpen && ( */}
            <div
                className="modal fade"
                id="AddSalesReturn"
                tabIndex={-1}
                aria-labelledby="exampleModalFullscreenLabel"
                aria-hidden="true"
            // data-bs-target="#AddPurchaseorder"
            // data-bs-dismiss="modal"
            >
                <div className="modal-dialog modal-fullscreen">
                    <div className="modal-content">

                        <div className="modal-body">
                            <div className="modal-content">
                                <div className="page-wrapper-new p-0">
                                    <div className="content ">
                                        <form onSubmit={handleSubmit}>
                                            <div className="modal-header border-0 custom-modal-header  ">
                                                {/* <div className="page-title d-flex justify-content-between align-items-center w-75 "> */}
                                                <div className="page-title ">
                                                    <h4>Sales Return Master : </h4>
                                                </div>

                                                <div className="ms-auto">
                                                    {/* <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-4">  */}
                                                    <div className="search-input d-flex flex-column flex-sm-row me-4 ">
                                                        <input
                                                            type="text"
                                                            placeholder="Search Bill Number"
                                                            className="form-control w-100"
                                                            required
                                                            name="BillNumber"
                                                            value={sbbillno || formData.BillNumber}
                                                            onChange={(e) => setsbbillno(e.target.value)}
                                                            pattern="^.{4,}$"
                                                            title="Bill Number Contain Minimum Four Digit Numbers."
                                                            ref={BillRef}
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Enter') {
                                                                    if (/^.{4,}$/.test(sbbillno)) {
                                                                        SearchRef.current.focus();
                                                                    }
                                                                }
                                                            }}
                                                        />

                                                        <button
                                                            type="button"
                                                            onClick={() => handleSearch(sbbillno)}
                                                            className="btn btn-primary ms-3 mt-1 mt-sm-0 "
                                                            ref={SearchRef}
                                                        >
                                                            Search
                                                        </button>
                                                    </div>
                                                </div>
                                                {/* </div> */}
                                                {/* </div> */}

                                                <div className="page-btn">
                                                    <Link className="btn btn-secondary" aria-label="Close" onClick={showExitAlert}>
                                                        <ArrowLeft className="me-2" />
                                                        Back to index
                                                    </Link>
                                                </div>
                                            </div>

                                            <div className="modal-body custom-modal-body"
                                                style={{
                                                    overflow: "hidden",
                                                }}>
                                                {/* <form onSubmit={handleSubmit}> */}
                                                <div className="row ">

                                                    <div className="col-lg-2 col-md-6 col-sm-12">
                                                        <div className="form-label">
                                                            <label >Transaction Number</label>
                                                            <input type="text"
                                                                className="form-control "
                                                                value={formData.TransactionNumber}
                                                                name="Transaction"
                                                                readOnly
                                                                onChange={handleChange}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-lg-2 col-md-6 col-sm-12">
                                                        <div className="input-blocks">
                                                            <label>Transaction Date</label>
                                                            <input
                                                                type="date"
                                                                className="form-control"
                                                                readOnly
                                                                value={selectedDate}
                                                                selected={selectedDate}
                                                                onChange={handleDateChange}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-lg-2 col-md-6 col-sm-12">
                                                        <div className="form-label">
                                                            <label>Bill Number</label>
                                                            <input type="text"
                                                                className="form-control"
                                                                value={formData.BillNumber || ""}
                                                                name="BillNumber"
                                                                pattern="^.{4,}$"
                                                                readOnly
                                                                title="Bill only contain Numbers."
                                                                onChange={handleChange}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-lg-2 col-md-6 col-sm-12">
                                                        <div className="form-label">
                                                            <label>Bill Date</label>
                                                            <input
                                                                // selected={selectedDate}
                                                                value={formData.BillDate || ""}
                                                                // onChange={handleDateChange}
                                                                type="text"
                                                                name="BillDate"
                                                                readOnly
                                                                className="form-control"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-lg-4 col-md-6 col-sm-12">
                                                        <div className=" add-product">
                                                            <label>Customer</label>
                                                            <input type="text"
                                                                className="form-control"
                                                                ref={VendorRef}
                                                                pattern="^[A-Za-z]+( [A-Za-z]+)*$"
                                                                required
                                                                value={formData.Vendor || ""}
                                                                name="Vendor"
                                                                onChange={handleChange}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-lg-4 col-md-6 col-sm-12">
                                                        <div className="form-label">
                                                            <label >Transporter </label>
                                                            <input type="text"
                                                                className="form-control "
                                                                ref={ConsignerRef}
                                                                required
                                                                pattern="^[A-Za-z]+( [A-Za-z]+)*$"
                                                                value={formData.Consigner || ""}
                                                                name="Consigner"
                                                                onChange={handleChange} />
                                                        </div>
                                                    </div>

                                                    <div className="col-lg-8 col-sm-6 col-12">
                                                        <div className="mb-0 add-product form-label">
                                                            <label>Narration</label>
                                                            <input
                                                                className="form-control mb-1"
                                                                value={formData.Narration || ""}
                                                                name="Narration"
                                                                onChange={handleChange}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="row border border-1 p-3">
                                                    <h5>Sales Return Detail :</h5>

                                                    <div className="col-lg-12">
                                                        <div className="modal-body-table overflow-auto max-vh-100" >
                                                            <div className="table-responsive" style={{ height: "calc(60vh - 120px)" }}>
                                                                <table className="table datanew">
                                                                    <table className="table table-bordered table-sm">
                                                                        <thead className="thead-dark" style={{ tableLayout: "fixed" }}>
                                                                            <tr>
                                                                                <th className="col-4">Product</th>
                                                                                <th className="col-1">HSN </th>
                                                                                <th className="col-1">Batch Number </th>
                                                                                <th className="col-1">Expiry Date </th>
                                                                                <th className="col-1">UOM </th>
                                                                                <th className="col-1">Quantity</th>
                                                                                <th className="col-1">Total </th>
                                                                                <th className="col-2">Return Quantity </th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody >
                                                                            {products.map((product, index) => (
                                                                                <tr key={index}>
                                                                                    <td>{product.Product}</td>
                                                                                    <td>{product.HSN}</td>
                                                                                    <td>{product.Batchnumber}</td>
                                                                                    <td>{product.Expirydate}</td>
                                                                                    <td>{product.UOM}</td>
                                                                                    <td>{product.Quantity}</td>
                                                                                    <td>{product.Total}</td>
                                                                                    <td>
                                                                                        <div className="col-lg-10 col-sm-6 col-12">
                                                                                            <input type="number" className=" form-control form-control-sm border-0 border-bottom border-warning"
                                                                                                name="return"
                                                                                                min={0}
                                                                                                value={product.returnQuantity || 0}
                                                                                                onChange={(e) => handleReturnQuantityChange(index, e)}
                                                                                            />
                                                                                        </div>
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

                                                <div className="col-lg-12">
                                                    <div className="modal-footer-btn">
                                                        <button
                                                            type="button"
                                                            className="btn btn-cancel me-2"
                                                            onClick={showExitAlert}
                                                        >
                                                            Cancel
                                                        </button>
                                                        <button className="btn btn-submit" >
                                                            Save Sales
                                                        </button>
                                                    </div>
                                                </div>
                                                {/* </form> */}

                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            {/* )} */}
        </div>
    );
};

export default AddSalesReturn;
