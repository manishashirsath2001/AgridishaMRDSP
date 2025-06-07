import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ImageWithBasePath from '../../core/img/imagewithbasebath'
import { RefreshCcw, RotateCw, ShoppingCart } from 'feather-icons-react/build/IconComponents'
import { Check, CheckCircle, Edit, MoreVertical, Trash2, UserPlus } from 'react-feather'
import Select from 'react-select'
import PlusCircle from 'feather-icons-react/build/IconComponents/PlusCircle'
import MinusCircle from 'feather-icons-react/build/IconComponents/MinusCircle'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Table from "../../core/pagination/datatable";
import axios from 'axios';
import { baseUrl, ACSPLGUID } from "../../core/json/custom";

const Hrutik_1 = () => {
    const [vyapariName, setvyapariName] = useState([]);
    const [Billno, setBillno] = useState([]);
    const [Crop, setCrop] = useState([]);
    const [Date, setDate] = useState([]);
    const [totalAmount, settotalAmount] = useState([]);
    const [totalWeight, settotalWeight] = useState([]);
    const [tabledata, settabledata] = useState([]);
    const [remainingamount, setremainingamount] = useState([]);
    const [totalLoss, settotalLoss] = useState([]);
    const [Services, setServices] = useState([]);

    const fetchBillData = async () => {
        try {
            const payload =
            {
                "vyapariname": "PK16C40B253E1191042030",
                "billno": "16",
                "companyid": "",
                "deptid": ""
            }


            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };
            const response = await axios.post(
                `${baseUrl.Url}/backend/api/GET_CreateBill_Vyapari`,

                payload,
                { headers }
            );
            if (response.status !== 200)
                throw new Error("Failed to fetch vendor data");
            console.log("quatation master", response.data)
            setvyapariName(response.data[0].vname);
            setBillno(response.data[0].billno);
            setCrop(response.data[0].croplabel);
            setDate(response.data[0].date);
            settotalWeight(response.data[0].totalweight);
            settotalAmount(response.data[0].totalamount);
            settotalLoss(response.data[0].totalloss);
            setremainingamount(response.data[0].remainingamount);
            settabledata(response.data);

        } catch (error) {
            console.error("Error fetching vendor data:", error);
        }
        try {
            const payload =
            {
                "vyapariname": "PK16C40B253E1191042030",
                "billno": "16",
                "companyid": "",
                "deptid": ""
            }


            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };
            const response = await axios.post(
                `${baseUrl.Url}/backend/api/GET_VyapariBillCharges`,

                payload,
                { headers }
            );
            if (response.status !== 200)
                throw new Error("Failed to fetch vendor data");
            console.log("Services Charge", response.data)

            setServices(response.data);

        } catch (error) {
            console.error("Error fetching Services Charge data:", error);
        }
    };


    const handlePrintReceipt = () => {
        const printContents = document.getElementById('printableArea').innerHTML;
        const originalContents = document.body.innerHTML;

        document.body.innerHTML = printContents;
        window.print();
        document.body.innerHTML = originalContents;
        window.location.reload(); // Optional: to reload original state
    };


    return (
        <div>
            <div className="page-wrapper pos-pg-wrapper ms-0">
                <div className="content pos-design p-0">
                    <div className="row align-items-start pos-wrapper">
                        <div className="col-md-12 col-lg-8">
                        </div>
                        <div className="col-md-12 col-lg-4 ps-0">
                            <aside className="product-order-list">
                                <div className="btn-row d-sm-flex align-items-center justify-content-between">
                                    <Link
                                        to="#"
                                        className="btn btn-success btn-icon flex-fill"
                                        data-bs-toggle="modal"
                                        data-bs-target="#payment-completed"
                                    >
                                        <span className="me-1 d-flex align-items-center">
                                            <i data-feather="credit-card" className="feather-16" />
                                        </span>
                                        Payment
                                    </Link>
                                </div>
                            </aside>
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment Completed */}
            <div
                className="modal fade modal-default"
                id="payment-completed"
                aria-labelledby="payment-completed"
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-body text-center">
                            <form>
                                <div className="icon-head">
                                    <Link to="#">
                                        <CheckCircle className="feather-40" />
                                    </Link>
                                </div>
                                <h4>Payment Completed</h4>
                                <p className="mb-0">
                                    Do you want to Print Receipt for the Completed Order
                                </p>
                                <div className="modal-footer d-sm-flex justify-content-between">
                                    <button
                                        type="button"
                                        className="btn btn-primary flex-fill me-1"
                                        data-bs-toggle="modal"
                                        data-bs-target="#print-receipt"
                                        onClick={fetchBillData}
                                    >
                                        Print Receipt
                                    </button>
                                    <Link to="#" className="btn btn-secondary flex-fill">
                                        Next Order
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            {/* /Payment Completed */}
            {/* Print Receipt */}
            <div
                className="modal fade modal-default"
                id="print-receipt"
                aria-labelledby="print-receipt"
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="d-flex justify-content-end">
                            <button
                                type="button"
                                className="close p-0"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            >
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>
                        <div className="modal-body" id='printableArea'>
                            <div className="icon-head text-center">
                                <Link to="#">
                                    <ImageWithBasePath
                                        src="assets/img/logo.png"
                                        width={100}
                                        height={30}
                                        alt="Receipt Logo"
                                    />
                                </Link>
                            </div>
                            {/* <div className="text-center info text-center"
              >
                <h6>Dreamguys Technologies Pvt Ltd.,</h6>
                <p className="mb-0">Phone Number: +1 5656665656</p>
                <p className="mb-0">
                  Email: <Link to="mailto:example@gmail.com">example@gmail.com</Link>
                </p>
              </div> */}
                            <div className="tax-invoice">
                                <h6 className="text-center">Tax Invoice</h6>
                                <div className="row">
                                    <div className="col-sm-12 col-md-6">
                                        <div className="invoice-user-name">
                                            <span>Vyapari: </span>
                                            <span>{vyapariName}</span>
                                        </div>
                                        <div className="invoice-user-name">
                                            <span>Bill No: </span>
                                            <span>{Billno}</span>
                                        </div>
                                    </div>
                                    <div className="col-sm-12 col-md-6">
                                        {Crop && (
                                            <div className="invoice-user-name">
                                                <span>Crop: </span>
                                                <span>{Crop}</span>
                                            </div>
                                        )}
                                        <div className="invoice-user-name">
                                            <span>Date: </span>
                                            <span>{Date}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <table className="table-borderless w-100 table-fit">
                                <thead>
                                    <tr>
                                        <th className="text-center">Sr</th>
                                        <th className="text-center">Farmer</th>
                                        {/* <th className="text-center">Crop</th> */}
                                        <th className="text-center">Weight</th>
                                        <th className="text-center">Rate</th>

                                        <th className="text-end">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>


                                    {tabledata.length > 0 ? (
                                        tabledata.map((row, index) => (
                                            <tr key={index}>
                                                <td className="text-center">{index + 1}</td>
                                                <td className="text-center">{row.fname}</td>
                                                {/* <td className="text-center">{row.croplabel}</td> */}
                                                <td className="text-center">{row.weight}</td>
                                                <td className="text-center">{row.rate}</td>
                                                <td className="text-end">   {row.amount}</td>
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
                                                        <td>Sub Total :</td>
                                                        <td className="text-end">{totalAmount}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Total Weight :</td>
                                                        <td className="text-end">{totalWeight}</td>
                                                    </tr>


                                                    {Services
                                                        .filter(item => item.sevaValue && item.nSERVICETYPETITLE.trim())
                                                        .map((item, index) => (
                                                            <tr key={index}>
                                                                <td style={{ paddingTop: "8px" }}>{item.nSERVICETYPETITLE}:</td>
                                                                <td className="text-end" style={{ paddingTop: "8px" }}>{item.sevaValue}</td>
                                                            </tr>
                                                        ))}

                                                    <tr>
                                                        <td>Total Loss :</td>
                                                        <td className="text-end">{totalLoss}</td>
                                                    </tr>

                                                    <tr>
                                                        <td>Total Payable :</td>
                                                        <td className="text-end"><span>{remainingamount}</span></td>
                                                    </tr>
                                                </tbody>
                                            </table>

                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            <div className="text-center invoice-bar">
                                {/* <p>
                  **VAT against this challan is payable through central
                  registration. Thank you for your business!
                </p>
                <Link to="#">
                  <ImageWithBasePath src="assets/img/barcode/barcode-03.jpg" alt="Barcode" />
                </Link>
                <p>Sale 31</p>
                <p>Thank You For Shopping With Us. Please Come Again</p> */}
                                <Link to="#" className="btn btn-primary"
                                    onClick={handlePrintReceipt}>
                                    Download
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* /Print Receipt */}



        </div>
    )
}

export default Hrutik_1
