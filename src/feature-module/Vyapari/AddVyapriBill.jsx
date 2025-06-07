import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { baseUrl, ACSPLGUID } from "../../core/json/custom";
import axios from 'axios';
import {
    ArrowLeft,
    // Trash2, Edit,
} from "feather-icons-react/build/IconComponents";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { getUserData } from "../../Context/UserData";

const AddVyapriBill = ({ vbkid }) => {

    console.log('vbkid ', vbkid)
    const location = useLocation();
    const { } = location.state || {};
    // const { vbkid } = location.state || {};

    const GUID = ACSPLGUID.getNew()
    const DGUID = ACSPLGUID.getNew()
    // const [vbkid,setvbkid]=useState(null);
    console.log('primaryKey', vbkid)
    const [formData, setFormData] = useState({
        vbkid: '',
        Billnumber: '',
        Tarikh: '',
        Fullname: '',
        Mobilenumber: '',
        Bankname: '',
        Accountnumber: '',
        Accountname: '',
        IFSCcode: '',
        Aadhar: '',
        Branchname: '',
        Shortname: '',
        Company: '',
        Remaningamount: '',
        Totalloss: '',
        Totalamount: '',
        Totalweight: '',
        Totaljali: '',
        Jali: '',
        weight: '',
        fname: '',
        weightdifference: '',
        rate: '',
        croptype: '',
        totalamount: '',
        BAKI: "",

    });

    const [farmerData, setfarmerData] = useState({

        vbkid: '',
        fname: '',
        Billnumber: '',
        date: '',
        Fullname: ''

    });
    useEffect(() => {
        const date = new Date();
        const formattedDate = date.toISOString().split('T')[0]; // Extracts only the date part

        setFormData((prevData) => ({
            ...prevData,
            Tarikh: formattedDate,
        }));
    }, []);


    const generateBillNumber = () => {
        return Math.floor(1000 + Math.random() * 9000);
    };


    useEffect(() => {
        const initialBillNumber = generateBillNumber();
        setFormData(prevState => ({
            ...prevState,
            Billnumber: initialBillNumber.toString()
        }));
    }, []);



    const [tableData, setTableData] = useState([]);





    //Dynamically label for seva
    const [serviceData, setServiceData] = useState([]);
    useEffect(() => {
        const fetchFarmersServiceData = async () => {
            try {
                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };

                const payload1 = {
                    "vbkid": vbkid,
                    companyid: "",
                    deptid: "",
                };

                const response = await axios.post(
                    `${baseUrl.Url}/backend/api/GET_FBILLSERVICES`,
                    payload1,
                    { headers }
                );

                if (response.status !== 200) {
                    throw new Error("Failed to fetch farmers service data");
                }

                console.log("Farmers service details", response.data);

                const data = response.data;
                const serviceData = data.map(({ nSERVICETYPETITLE, rate, ratetype, servicetype, sevaValue }) => {


                    return {
                        nSERVICETYPETITLE,
                        rate,
                        ratetype,
                        servicetype,
                        sevaValue
                    };
                });
                setServiceData(serviceData);
            } catch (error) {
                console.error("Error fetching farmers service data:", error);
            }
        };

        fetchFarmersServiceData();
    }, []);

    const payload1 = () => {
        try {
            const payload1 = {
                vbkid: vbkid ? vbkid : "GUID",
                token: '',
                billno: formData.Billnumber || "",
                date: formData.date || "",
                vbkid: '',
                village: '',

                nSERVICETYPETITLE: serviceData
                    .map((service) => {

                        return `${service.servicetype}:${service.rate}`;
                    })
                    .join(", "),
                totaljali: formData.Totaljali || "",
                totalweight: formData.Totalweight || "",
                totalamount: formData.detaiL_TOTALAMOUNT || "",
                remainingamount: formData.BAKI || "",
                companyid: "",
                deptid: "",
            };

            console.log("Constructed Payload:", payload1);
            return payload1;
        } catch (error) {
            console.error("Error constructing payload:", error);
        }
    };


    const handleInputChangeseva = (e, nSERVICETYPETITLE) => {
        const { value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [nSERVICETYPETITLE]: value,
        }));

    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({

            ...formData,
            [name]: value
        });
    };


    const MySwal = withReactContent(Swal);
    const showConfirmationAlert = () => {
        MySwal.fire({
            title: "तुम्हाला खात्री आहे का?",
            text: "तुम्ही हे डेटा जतन करू इच्छिता का?",
            showCancelButton: true,
            confirmButtonColor: "#00ff00",
            confirmButtonText: "जतन करा",
            cancelButtonColor: "#092C4C",
            cancelButtonText: "रद्द करा",
            allowOutsideClick: false,
            allowEscapeKey: false,
        }).then((result) => {
            if (result.isConfirmed) {
                handleSave();
                Swal.fire({
                    icon: "success",
                    title: "जतन केले!",
                    text: "डेटा यशस्वीरीत्या जतन झाला आहे.",
                    confirmButtonText: "ठीक आहे",
                    allowOutsideClick: false,
                    allowEscapeKey: false,

                });
            }
        });
    };


    const handleSubmit = (e) => {
        e.preventDefault(e);
        console.log('formData', formData)
        showConfirmationAlert(e);
    };


    useEffect(() => {
        if (!vbkid) return;
        console.log(" vbkid is not set yet.");
        const fetchDetailsData = async () => {

            try {
                const payload = {
                    vbkid: vbkid,
                    "companyid": "",
                    "deptid": "",
                };

                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*"
                };

                const response = await axios.post(
                    baseUrl.Url + "/backend/api/GET_FARMERBILL",
                    payload,
                    { headers }
                );

                if (response.status !== 200) throw new Error("Failed to fetch details data");

                console.log("Quotation Detail Data:", response.data);

                // set all rows to table
                setTableData(response.data);


                if (response.data.length > 0) {
                    const firstItem = response.data[0];
                    setFormData((prevFormData) => ({
                        ...prevFormData,
                        vbkid: firstItem.vbkid,
                        Billnumber: firstItem.billno,
                        date: firstItem.date,
                        Fullname: firstItem.vname,
                        Shortname: firstItem.vshortname,
                        Company: firstItem.vcompname,
                        Mobilenumber: firstItem.vmoblie,
                        Aadhar: firstItem.vaadhar,
                        Bankname: firstItem.vbankname,
                        Accountnumber: firstItem.vaccountnumber,
                        IFSCcode: firstItem.vifsccode,
                        Accountname: firstItem.vaccountname,
                        Branchname: firstItem.vbranchname,
                        Totaljali: firstItem.totaljaali,
                        Totalweight: firstItem.totalweight,
                        croptype: firstItem.croptype,
                        fname: firstItem.fname,
                        Jali: firstItem.jaali,
                        weight: firstItem.weight,
                        weightdifference: firstItem.weightdiffrence,
                        rate: firstItem.rate,
                        Totalamount: firstItem.totalamount,
                        totalamount: firstItem.detaiL_TOTALAMOUNT || "",
                        Totalloss: firstItem.totalloss || "",
                        Remaningamount: firstItem.remainingamount || "",
                    }))

                }
            } catch (error) {
                console.error("Error fetching details data:", error);
            }
        };


        fetchDetailsData();
    }, [vbkid]);
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
            allowEscapeKey: false,
        }).then((result) => {
            if (result.isConfirmed) {
                const modal = document.getElementById("AddVyapariBill");
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
    return (
        <div>
            {/* master inputs */}
            <div className="modal fade" id="AddVyapariBill">

                <div className="modal-dialog modal-dialog-centered modal-fullscreen">
                    <div className="modal-content mbgcolor">
                        <div className="page-wrapper-new p-0">
                            <div className="content">
                                <div className="modal-header border-0 custom-modal-header">
                                    <div className="page-title">
                                        <h4>व्यापारी बिल</h4>
                                    </div>

                                    <div className="page-btn">
                                        <Link className="btn btn-secondary"
                                            // data-bs-dismiss="modal"
                                            aria-label="Close"
                                            onClick={showExitAlert}>
                                            <ArrowLeft className="me-2" />
                                            मागे
                                        </Link>
                                    </div>
                                </div>
                                <div className="modal-body custom-modal-body" style={{
                                    overflow: "hidden",
                                }}>
                                    <form onSubmit={handleSubmit}>

                                        <div className="row">
                                            <div className="col-lg-2 col-sm-6 col-12">
                                                <div className="mb-0">
                                                    <label className="form-label required">बिल क्रमांक </label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="Billnumber"
                                                        value={formData.Billnumber}
                                                        onChange={handleChange}

                                                    />
                                                </div>
                                            </div>



                                            <div className="col-lg-2 col-sm-6 col-12">
                                                <div className="mb-0">
                                                    <label className="form-label required">तारीख</label>
                                                    <input
                                                        type="date"
                                                        className="form-control"
                                                        name="Tarikh"
                                                        value={formData.Tarikh}

                                                        onChange={handleChange}


                                                    />
                                                </div>
                                            </div>

                                            <div className="col-lg-2 col-sm-6 col-12">
                                                <div className="mb-0">
                                                    <label className="form-label required">व्यापारी नाव </label>
                                                    <input
                                                        type="text"
                                                        className="form-control"

                                                        name="Fullname"
                                                        value={formData.Fullname}
                                                        onChange={handleChange}
                                                        readOnly

                                                    />
                                                </div>
                                            </div>

                                            <div className="col-lg-2 col-sm-6 col-12">
                                                <div className="mb-0">
                                                    <label className="form-label required">उप नाव </label>
                                                    <input
                                                        type="text"
                                                        className="form-control"

                                                        name="Shortname"
                                                        value={formData.Shortname}
                                                        onChange={handleChange}

                                                        readOnly
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-lg-2 col-sm-6 col-12">
                                                <div className="mb-0">
                                                    <label className="form-label required">कंपनीचे नाव </label>
                                                    <input
                                                        type="text"
                                                        className="form-control"

                                                        name="Company"
                                                        value={formData.Company}
                                                        onChange={handleChange}
                                                        readOnly

                                                    />
                                                </div>
                                            </div>



                                            <div className="col-lg-2 col-sm-6 col-12">
                                                <div className="mb-0">
                                                    <label className="form-label required">मोबाइल नंबर</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="Mobilenumber"
                                                        value={formData.Mobilenumber}
                                                        onChange={handleChange}
                                                        readOnly
                                                    />
                                                </div>
                                            </div>


                                            <div className="col-lg-2 col-sm-6 col-12">
                                                <div className="mb-0">
                                                    <label className="form-label required">बँक नाव</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="Bankname"
                                                        value={formData.Bankname}
                                                        onChange={handleChange}
                                                        readOnly
                                                    />
                                                </div>
                                            </div>


                                            <div className="col-lg-2 col-sm-6 col-12">
                                                <div className="mb-0">
                                                    <label className="form-label required">अकाऊंट नंबर</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="Accountnumber"
                                                        value={formData.Accountnumber}
                                                        onChange={handleChange}
                                                        readOnly
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-lg-2 col-sm-6 col-12">
                                                <div className="mb-0">
                                                    <label className="form-label required">अकाऊंट नाव</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="Accountname"
                                                        value={formData.Accountname}
                                                        onChange={handleChange}
                                                        readOnly
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-lg-2 col-sm-6 col-12">
                                                <div className="mb-0">
                                                    <label className="form-label required">शाखेचे नाव</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="Branchname"
                                                        value={formData.Branchname}
                                                        onChange={handleChange}
                                                        readOnly
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-lg-2 col-sm-6 col-12">
                                                <div className="mb-0">
                                                    <label className="form-label required">IFSC नंबर</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="IFSCcode"
                                                        value={formData.IFSCcode}
                                                        onChange={handleChange}
                                                        readOnly
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-lg-2 col-sm-6 col-12">
                                                <div className="mb-0">
                                                    <label className="form-label required">आधार नंबर </label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="Aadhar"
                                                        value={formData.Aadhar}
                                                        onChange={handleChange}
                                                        readOnly

                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        {/* start (Detail) */}
                                        <div className="border p-3 rounded shadow-sm mb-4 mt-3">
                                            <div className="addservice-info">
                                            </div>
                                            <div className="col-lg-12">

                                                <div className="modal-body-table overflow-auto max-vh-100" >
                                                    <div className="table-responsive" style={{ height: "calc(40vh - 120px)" }}>
                                                        <table className="table table-bordered table-sm">
                                                            <thead className="thead-dark" style={{ tableLayout: "fixed" }}>
                                                                <tr>
                                                                    <th className="col-2" style={{ textAlign: 'center' }}>पीक प्रकार </th>
                                                                    <th className="col-2" style={{ textAlign: 'center' }}>शेतकरी नाव </th>
                                                                    <th className="col-1" style={{ textAlign: 'center' }}>जाळी </th>
                                                                    <th className="col-1" style={{ textAlign: 'center' }}>वजन  </th>
                                                                    <th className="col-1" style={{ textAlign: 'center' }}>वजन कमी/जास्त</th>
                                                                    <th className="col-1" style={{ textAlign: 'center' }}>भाव</th>
                                                                    <th className="col-1" style={{ textAlign: 'center' }}>एकूण रक्कम  </th>
                                                                    {/* <th className="col-1 text-center" >कृती </th> */}
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {tableData.map((item, index) => (

                                                                    <tr key={index}>
                                                                        <td>{item.croplabel}</td>
                                                                        <td>{item.fname}</td>
                                                                        <td style={{ textAlign: 'center' }}>{item.jaali}</td>
                                                                        <td style={{ textAlign: 'center' }}>{item.weight}</td>
                                                                        <td style={{ textAlign: 'center' }}>{item.weightdiffrence}</td>
                                                                        <td style={{ textAlign: 'center' }}>{item.rate}</td>
                                                                        <td style={{ textAlign: 'center' }}>{item.detaiL_TOTALAMOUNT}</td>
                                                                        {/* <td className="text-center">
                                                                    <button className="btn btn-primary">Action</button>
                                                                    </td> */}
                                                                    </tr>

                                                                ))}
                                                            </tbody>

                                                        </table>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>


                                        <div className="row">
                                            <div className="col-lg-2 col-sm-6 col-12">
                                                <div className="mb-0">
                                                    <label className="form-label required"> एकूण जाळी</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="Totaljali"
                                                        value={formData.Totaljali}
                                                        onChange={handleChange}
                                                        readOnly
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-lg-2 col-sm-6 col-12">
                                                <div className="mb-0">
                                                    <label className="form-label required"> एकूण वजन  </label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="Totalweight"
                                                        value={formData.Totalweight}
                                                        onChange={handleChange}
                                                        readOnly
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-lg-2 col-sm-6 col-12">
                                                <div className="mb-0">
                                                    <label className="form-label required"> एकूण रक्कम </label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="Totalamount"
                                                        value={formData.Totalamount}
                                                        onChange={handleChange}
                                                        readOnly
                                                    />
                                                </div>
                                            </div>



                                            {serviceData.map((service, index) => (
                                                <div key={index} className="col-6 col-md-6 col-lg-2 mb-3">
                                                    <div className="mb-0 add-product">
                                                        {/* Dynamic Label */}
                                                        <label>{`${service.nSERVICETYPETITLE}`}</label>
                                                        {/* Dynamic Input Field */}
                                                        <input
                                                            type="text"
                                                            className="form-control border"
                                                            name={service.sevaValue}
                                                            value={formData[service.nSERVICETYPETITLE] || service.sevaValue}
                                                            // value={`${service.sevaValue}`} // Default to the rate if no value is provided
                                                            onChange={(e) => handleInputChangeseva(e, service.nSERVICETYPETITLE)} // Pass seva to the handler
                                                        />
                                                    </div>
                                                </div>
                                            ))}

                                            <div className="col-lg-2 col-sm-6 col-12">
                                                <div className="mb-0">
                                                    <label className="form-label required"> एकूण खर्च  </label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="Totalloss"
                                                        value={formData.Totalloss}
                                                        onChange={handleChange}
                                                        readOnly
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-lg-2 col-sm-6 col-12">
                                                <div className="mb-0">
                                                    <label className="form-label required"> बाकी रक्कम </label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="Remaningamount"
                                                        value={formData.Remaningamount}
                                                        onChange={handleChange}
                                                        readOnly
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-lg-12 d-flex justify-content-end mt-2">
                                            <button type="button" onClick={showExitAlert}
                                                className="btn btn-cancel me-2" >
                                                मागे
                                            </button>
                                            <button type="submit" className="btn btn-submit"
                                            >
                                                सेव्ह
                                            </button>
                                        </div>

                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
            {/* <Shetakarisearchpatti /> */}
        </div >

    );
};

export default AddVyapriBill;

