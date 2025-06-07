import React, { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ImageWithBasePath from "../../core/img/imagewithbasebath";
import Brand from "../../core/modals/inventory/brand";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { all_routes } from "../../Router/all_routes";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import Table from "../../core/pagination/datatable";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import {
    ArrowLeft,
    ChevronUp,
    Edit,
    PlusCircle,
    RotateCcw,
    Trash2,
} from "feather-icons-react/build/IconComponents";
import { ACSPLGUID, baseUrl, convertToISODate } from "../../core/json/custom";
import Select from "react-select";

import { getUserData } from "../../Context/UserData";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
const AddCheckApproved = ({ pkid, baid }) => {
    const { userdetail } = getUserData();
    console.log(pkid, baid, " pkid, baid")
    const navigate = useNavigate();
    const route = all_routes;
    const MySwal = withReactContent(Swal);
    const GUID = ACSPLGUID.getNew()
    const dispatch = useDispatch();
    const data = useSelector((state) => state.toggle_header);

    const farmerNameRef = useRef(null);
    const bankNameRef = useRef(null);
    const accountNumberRef = useRef(null);
    const ifscCodeRef = useRef(null);
    const cashAmountRef = useRef(null);
    const chequeAmountRef = useRef(null);
    const ChequenameRef = useRef(null);

    const [farmeName, setfarmeName] = useState([]);
    const [Billno, setBillno] = useState([]);
    const [Crop, setCrop] = useState([]);
    const [Date, setDate] = useState([]);
    const [totalAmount, settotalAmount] = useState([]);
    const [totalWeight, settotalWeight] = useState([]);
    const [tabledata, settabledata] = useState([]);
    const [remainingamount, setremainingamount] = useState([]);
    const [totalCost, settotalCost] = useState([]);

    const [formData, setFormData] = useState({
        pkid: "",
        farmerName: "",
        bankName: "",
        accountNumber: "",
        ifscCode: "",
        cashAmount: "",
        chequeAmount: "",
        status: "",
        Chequename: "",
        faid: ""
    });

    const [Services, setServices] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            if (!baid) return;

            await fetchChequeDetails();
            await fetchServiceCharges();
        };

        fetchData();
    }, [baid]);

    const fetchChequeDetails = async () => {
        try {
            const payload = {
                baid: baid,
                keyword: "%",
                companyid: userdetail?.companyID || "",
                deptid: userdetail?.departmentID || "",
            };
            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };
            const response = await axios.post(`${baseUrl.Url}/backend/api/GET_CreateBill`, payload, { headers });

            if (response.status !== 200) throw new Error("Failed to fetch vendor data");
            console.log("Quotation master", response.data);

            if (Array.isArray(response.data) && response.data.length > 0) {
                const first = response.data[0];
                setfarmeName(first.chequeapproved || first.fullname);
                setBillno(first.billno);
                setCrop(first.croplabel);
                setDate(first.date);
                settotalWeight(first.totalweight);
                settotalAmount(first.totalamount);
                settotalCost(first.totalcost);
                setremainingamount(first.remainingamount);
                settabledata(response.data);
            } else {
                console.warn("GET_CreateBill returned empty or invalid data:", response.data);
            }
        } catch (error) {
            console.error("Error fetching vendor data:", error);
        }
    };

    const fetchServiceCharges = async () => {
        try {
            const payload = {
                baid: baid,
                companyid: userdetail?.companyID || "",
                deptid: userdetail?.departmentID || "",
            };
            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };
            const response = await axios.post(`${baseUrl.Url}/backend/api/GET_FarmerBillCharges`, payload, { headers });

            if (response.status !== 200) throw new Error("Failed to fetch Service data");

            console.log("Services Charge", response.data);
            setServices(response.data);
        } catch (error) {
            console.error("Error fetching Services Charge data:", error);
        }
    };


    const handleDownload = () => {
        const input = document.getElementById("printableArea");

        html2canvas(input, { scale: 2 }).then((canvas) => {
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4");

            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
            pdf.save(`bill_${Billno || "receipt"}.pdf`);
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        showConfirmationAlert();
    };


    const showConfirmationAlert = () => {
        MySwal.fire({
            title: 'आपल्याला खात्री आहे का?',
            text: 'आपण ही माहिती जतन करू इच्छिता?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#00ff00',
            confirmButtonText: 'जतन करा',
            cancelButtonColor: '#092C4C',
            cancelButtonText: 'रद्द करा',
            allowOutsideClick: false,
            allowEscapeKey: false
        }).then((result) => {
            if (result.isConfirmed) {
                handleFormSubmission();
            }
        });
    };


    useEffect(() => {
        const modalEl = document.getElementById("AddChequeApproved");

        const handleModalShown = () => {
            setTimeout(() => {
                farmerNameRef.current?.focus();
            }, 200);
        };

        modalEl?.addEventListener("shown.bs.modal", handleModalShown);

        return () => {
            modalEl?.removeEventListener("shown.bs.modal", handleModalShown);
        };
    }, []);

    const handleKeyDown = (e, nextRef) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (nextRef && nextRef.current) {
                nextRef.current.focus();
            }
        }
    };

    useEffect(() => {
        const handleShortcut = (e) => {
            if (e.ctrlKey && e.key === "s" || e.ctrlKey && e.key === 'S') {
                e.preventDefault();
                handleSubmit();

            }

            if (e.ctrlKey && e.key === "e" || e.ctrlKey && e.key === 'E') {
                e.preventDefault();
                showExitAlert();
                // navigate("/GateEntry");
            }

        };

        window.addEventListener("keydown", handleShortcut);

        return () => {
            window.removeEventListener("keydown", handleShortcut);
        };
    }, [formData, navigate, route.Bill, handleSubmit]);

    const showExitAlert = () => {
        MySwal.fire({
            title: "तुम्हाला खात्री आहे का?",
            text: "तुम्हाला मागे जायचं आहे का?",
            showCancelButton: true,
            confirmButtonColor: "#00ff00",
            confirmButtonText: "हो",
            cancelButtonColor: "#092C4C",
            cancelButtonText: "नाही",
            allowOutsideClick: false,
            allowEscapeKey: false
        }).then((result) => {
            if (result.isConfirmed) {

                setFormData({
                    farmerName: "",
                    bankName: "",
                    accountNumber: "",
                    ifscCode: "",
                    cashAmount: "",
                    chequeAmount: "",
                    status: "",
                });

                const modal = document.getElementById("AddChequeApproved");
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
                navigate("/ChequeApproved");
            }
        });
    };

    return (
        <div>
            {/* <div className="page-wrapper pos-pg-wrapper ms-0">
                <div className="content pos-design p-0">
                    <div className="row align-items-start pos-wrapper">
                        <div className="col-md-12 col-lg-8">
                        </div>
                        <div className="col-md-12 col-lg-4 ps-0">
                            <aside className="product-order-list">
                            </aside>
                        </div>
                    </div>
                </div>
            </div> */}
            {/* Print Receipt */}
            <div
                className="modal fade modal-default"
                id="print-receipt"
                aria-labelledby="print-receipt"
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content rounded-4 shadow border border-success" style={{ backgroundColor: "#f0f8ff" }}>

                        <div className="d-flex justify-content-end p-2">
                            <button
                                type="button"
                                className="close p-0"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            >
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>
                        <div className="modal-body" id="printableArea" style={{ backgroundColor: "#f0f8ff" }}>
                            <div className="icon-head text-center mb-3">
                                <h3 className="text-center" style={{ color: 'orange' }}>
                                    {userdetail?.departmentname}
                                </h3>

                            </div>
                            <div className="tax-invoice" style={{ backgroundColor: "#f0f8ff" }}>
                                <h6 className="text-center text-success">शेतकरी बिल</h6>
                                <div className="row mb-3">
                                    <div className="col-sm-12 col-md-6">
                                        <div className="invoice-user-name">
                                            <span className="fw-bold " style={{ fontWeight: 'bold' }}>शेतकरी: </span>
                                            <span style={{ fontWeight: 'bold' }}>{farmeName}</span>
                                        </div>
                                        <div className="invoice-user-name">
                                            <span className="fw-bold ">बिल क्र.: </span>
                                            <span style={{ fontWeight: 'bold' }}>{Billno}</span>
                                        </div>
                                    </div>
                                    <div className="col-sm-12 col-md-6">
                                        {Crop && (
                                            <div className="invoice-user-name">
                                                <span className="fw-bold ">पीक: </span>
                                                <span style={{ fontWeight: 'bold' }}>{Crop}</span>
                                            </div>
                                        )}
                                        <div className="invoice-user-name">
                                            <span className="fw-bold ">दिनांक: </span>
                                            <span style={{ fontWeight: 'bold' }}>{Date}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <table className="table-borderless w-100 table-fit">
                                <thead style={{ backgroundColor: '#add8e6' }}>  {/* light blue background color */}
                                    <tr>
                                        <th className="text-center">अ.क्र.</th>
                                        <th className="text-center">व्यापारी </th>
                                        <th className="text-center">वजन </th>
                                        <th className="text-center">भाव </th>
                                        <th className="text-end">रक्कम </th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {tabledata.length > 0 ? (
                                        tabledata.map((row, index) => (
                                            <tr key={index}>
                                                <td className="text-center" style={{ color: '#333' }}><strong>{index + 1}</strong></td> {/* Darker text color */}
                                                <td className="text-center" style={{ color: '#333' }}><strong>{row.vname}</strong></td>
                                                {/* <td className="text-center">{row.croplabel}</td> */}
                                                <td className="text-center" style={{ color: '#333' }}><strong>{row.weight}</strong></td>
                                                <td className="text-center" style={{ color: '#333' }}><strong>{row.rate}</strong></td>
                                                <td className="text-end" style={{ color: '#333' }}><strong>{row.amount}</strong></td>
                                            </tr>

                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="text-center">No Data Available</td>
                                        </tr>
                                    )}
                                    <tr>
                                        <td colSpan={6}>
                                            <table className="table-borderless w-100 table-fit">
                                                <tbody>
                                                    <tr>
                                                        <td><strong>उप एकूण :</strong></td>
                                                        <td className="text-end"><strong>{totalAmount}</strong></td>
                                                    </tr>
                                                    <tr>
                                                        <td><strong>एकूण वजन :</strong></td>
                                                        <td className="text-end"><strong>{totalWeight}</strong></td>
                                                    </tr>

                                                    {Services
                                                        .filter(item => item.sevaValue && item.nSERVICETYPETITLE.trim())
                                                        .map((item, index) => (
                                                            <tr key={index}>
                                                                <td className="" style={{ paddingTop: "8px" }}>
                                                                    {item.nSERVICETYPETITLE}:
                                                                </td>
                                                                <td className="text-end" style={{ paddingTop: "8px" }}>
                                                                    {item.sevaValue}
                                                                </td>
                                                            </tr>
                                                        ))}

                                                    <tr>
                                                        <td><strong>एकूण खर्च :</strong></td>
                                                        <td className="text-end"><strong>{totalCost}</strong></td>
                                                    </tr>

                                                    <tr>
                                                        <td><strong>एकूण रक्कम  :</strong></td>
                                                        <td className="text-end"><strong>{remainingamount}</strong></td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>

                                </tbody>


                            </table>

                            <div className="text-center invoice-bar mt-3">
                                <Link to="#" className="btn btn-success"
                                    onClick={handleDownload}>
                                    Download
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* /Print Receipt */}



        </div>


    );
};

export default AddCheckApproved;
