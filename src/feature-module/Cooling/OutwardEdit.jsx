
import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import { ChevronDown, ChevronUp, Info, ArrowLeft } from "feather-icons-react/build/IconComponents";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import axios from 'axios';
import { baseUrl, convertToISODate, ACSPLGUID } from "../../core/json/custom";
import { getUserData } from "../../Context/UserData";
import { useLocation } from 'react-router-dom';

const OutwardEdit = ({ CSOWID }) => {
    // console.log("CSOWID", CSOWID)
    const location = useLocation();
    // const { CSOWID } = location.state || {};
    const { userdetail } = getUserData();
    const [WeightType, setWeightType] = useState([]);
    const [Itemdata, setItem] = useState([]);
    const [Customerdata, setCustomerdata] = useState([]);
    const [Tabledata, setTabledata] = useState([]);
    const [EndDate, setEndDate] = useState('');
    const [StartDate, setStartDate] = useState('');

    const MySwal = withReactContent(Swal);





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



    const RefOutWardStockWeight = useRef(null);
    const RefRemainingStockWeight = useRef(null);
    const SaveRef = useRef(null);

    const [TableData, setTableData] = useState([]);
    const [formData, setFormData] = useState([
        {
            ColdStoreID: "",
            Date: "",
            EndDate: "",
            LotNo: "",
            CustomerName: "",
            ThirdPartyName: "",
            GrossWeight: "",
            NetWeight: "",
            WeightUnit: "",
            WeightInkg: "",
            CaretWeight: "",
            Item: "",
            TypeofVariety: "",
            RackPosition: "",
            WeightInkg: "",
            Rate: "",
            Amount: "",
            TotalDays: "",
            OutWardStockWeight: "",
            RemainingStockWeight: "",
        }
    ]);


    const [Rate, setRate] = useState([]);


    useEffect(() => {
        const FetchItemdata = async () => {
            try {
                const response = await axios.get(
                    baseUrl.Url + "/backend/api/Implications/CROP_TYPE|",

                );

                if (response.status !== 200) throw new Error("Failed to fetch implications data");

                const data = response.data;
                const implicationsDropdown = data.map(({ iTitle, iValue }) => ({
                    label: iTitle,
                    value: iValue,
                }));

                setItem(implicationsDropdown);
            } catch (error) {
                console.error("Error fetching implications:", error);
            }
        };


        const WeightType = async () => {
            try {
                const response = await axios.get(
                    baseUrl.Url + "/backend/api/Implications/SOLID|",

                );

                if (response.status !== 200) throw new Error("Failed to fetch implications data");

                const data = response.data;
                const implicationsDropdown = data.map(({ iTitle, iValue }) => ({
                    label: iTitle,
                    value: iValue,
                }));

                setWeightType(implicationsDropdown);
            } catch (error) {
                console.error("Error fetching implications:", error);
            }
        };


        const fetchCustomerName = async () => {
            try {
                const payload = {
                    "ctaid": "%",
                    "companyid": userdetail?.companyID || "",
                    "deptid": userdetail?.departmentID || "",
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
                        setCustomerdata(formofvendorData);
                    })

            } catch (error) {
                console.error("Error fetching Access Right Data:", error);
            }

        };


        WeightType();
        FetchItemdata();
        fetchCustomerName();

    }, []);


    const handleChange = async (e) => {
        const { name, value } = e.target;

        if (name === "OutWardStockWeight") {
            const net = parseFloat(formData.WeightInkg) || 0;
            const out = parseFloat(value) || 0;
            let remaining = net - out;
            if (remaining < 0) remaining = 0;

            if (out > net) {
                MySwal.fire({
                    text: 'Outward वजन हे एकूण वजनापेक्षा जास्त असू शकत नाही.',
                    icon: 'error',
                    confirmButtonColor: '#00ff00',
                    confirmButtonText: 'ठीक आहे',
                });
                return;
            }

            if (!value || value.trim() === "") {
                setFormData(prev => ({
                    ...prev,
                    OutWardStockWeight: "",
                    RemainingStockWeight: "",
                }));
                setTabledata([]); // clear table
                return;
            }

            // ✅ Update formData
            setFormData(prev => ({
                ...prev,
                OutWardStockWeight: value,
                RemainingStockWeight: remaining === 0 ? "00" : remaining.toFixed(2),
            }));

            // ✅ Update Tabledata (only first row)
            setTabledata(prev => {
                if (prev.length > 0) {
                    const updatedRow = {
                        ...prev[0],
                        outwardweight: value,
                        remainingweight: remaining === 0 ? "00" : remaining.toFixed(2)
                    };
                    return [updatedRow];
                }
                return prev;
            });

            // Optionally: fetch updated calculations
            await fetchDataTable(value);
        } else {
            // Normal field updates
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };



    useEffect(() => {

        const fetchData = async () => {
            console.log("received", CSOWID)
            try {
                const payload1 =
                {
                    "csid": CSOWID,
                    "companyid": userdetail?.companyID || "",
                    "deptid": userdetail?.departmentID || "",
                }

                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };

                const response1 = await axios.post(
                    `${baseUrl.Url}/backend/api/GET_ColdStorageOutWardById`,
                    payload1,
                    { headers }
                );

                if (response1.status !== 200)
                    throw new Error("Failed to fetch ColdStorageInward data");

                if (response1.data.length > 0) {
                    const data = response1.data[0];


                    console.log("datadatadatadatadatadatadata", data)
                    setFormData({
                        ColdStoreID: data.coldstorageid,
                        Date: convertToISODate(data.date),
                        LotNo: data.lotno,
                        CustomerName: data.customername,
                        ThirdPartyName: data.thirdpartyname,
                        Item: data.item,
                        GrossWeight: data.grossweight,
                        NetWeight: data.netweight,
                        WeightUnit: data.weightunit,
                        WeightInkg: data.weightinkg,
                        CaretWeight: data.caretweight,
                        TypeofVariety: data.typeofvarity,
                        RackPosition: data.rackposition,
                        OutWardStockWeight: data.outwardweight,
                        RemainingStockWeight: data.remainingweight
                    });

                    setStartDate(data.date);
                    setTabledata(response1.data);
                    console.log("response1.data[0]", response1.data[0])
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }

        };
        fetchData();
    }, [CSOWID]);

    // const totalAmount = Tabledata.reduce((sum, row) => sum + (parseFloat(row.totalamount) || 0), 0);


    const handleSubmit = async (e) => {
        e.preventDefault();

        MySwal.fire({
            text: 'तुम्हाला ही माहिती  जतन करायची आहे का?',
            showCancelButton: true,
            confirmButtonColor: '#00ff00',
            confirmButtonText: 'जतन करा',
            cancelButtonColor: '#092C4C',
            cancelButtonText: 'रद्द करा',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    // Save Outward Details
                    const payload1 = TableData.map(row => ({
                        csowid: ACSPLGUID.getNew(),
                        csid: CAID?.csid,
                        startdate: row.slabStartDate,
                        enddate: row.slabEndDate,
                        dayfrom: row.daysFrom,
                        dayto: row.daysTo,
                        rate: row.rate,
                        weightinkg: row.weightinkg,
                        dayinslab: row.daysInSlab,
                        outwardweight: row.outwardkg,
                        remainingweight: formData.RemainingStockWeight || 0,
                        amount: totalAmount,
                        totalamount: row.total,
                        status: row.remainingweight === 0 ? true : false,
                        companyid: userdetail?.companyID || "",
                        deptid: userdetail?.departmentID || "",
                        uaid: userdetail?.uaid || "",
                    }));

                    const headers = {
                        "Content-Type": "application/json",
                        Accept: "*/*",
                    };

                    const response1 = await axios.post(
                        `${baseUrl.Url}/backend/api/SP_AddUpdColdStorageOutward`,
                        payload1,
                        { headers }
                    );

                    if (response1.status === 200) {
                        window.dispatchEvent(new Event("fetchData"));
                        MySwal.fire({
                            icon: "success",
                            title: "जतन झाले!",
                            text: "माहिती यशस्वीरित्या सेव झाली.",
                            confirmButtonText: "OK",
                        });

                        console.log("Outward response:", response1);
                    } else {
                        throw new Error("Failed to save outward data.");
                    }

                    if (response1.status === 200) {
                        MySwal.fire({
                            icon: "success",
                            title: "जतन झाले!",
                            text: "माहिती यशस्वीरित्या सेव झाली.",
                            confirmButtonText: "OK",
                        }).then(() => {

                            // ✅ Reset all form fields

                            setFormData({
                                ColdStoreID: "",
                                Date: "",
                                LotNo: "",
                                CustomerName: "",
                                ThirdPartyName: "",
                                Item: "",
                                GrossWeight: "",
                                NetWeight: "",
                                WeightUnit: "",
                                WeightInkg: "",
                                CaretWeight: "",
                                TypeofVariety: "",
                                RackPosition: "",
                                RemainingStockWeight: "",
                                OutWardStockWeight: "",
                            });

                            // ✅ Clear the table
                            setTableData([]);


                            // ✅ Close the modal programmatically
                            const modalEl = document.getElementById("add-units-category");
                            const modal = bootstrap.Modal.getInstance(modalEl);
                            modal?.hide();


                        });



                        console.log("Outward response:", response1);
                    }


                    // Save Inward Details



                    const payload = {
                        csid: CAID?.csid,
                        coldstorageid: formData.ColdStoreID,
                        lotno: formData.LotNo,
                        date: formData.Date,
                        customername: formData.CustomerName,
                        thirdpartyname: formData.ThirdPartyName,
                        item: formData.Item,
                        outwardweight: formData.OutWardStockWeight,
                        weightinkg: formData.RemainingStockWeight || 0,


                        status: formData.RemainingStockWeight === "00" ? true : false,
                        companyid: userdetail?.companyID || "",
                        deptid: userdetail?.departmentID || "",
                        uaid: userdetail?.uaid || "",
                    };



                    console.log("Inward payload:", payload);
                    console.log("formData.RemainingStockWeight:", formData.RemainingStockWeight);


                    const response2 = await axios.post(
                        `${baseUrl.Url}/backend/api/SP_AddUpdColdStorageInward`,
                        JSON.stringify(payload),
                        { headers }
                    );

                    if (response2.status !== 200) {
                        throw new Error("Failed to save inward data.");
                    }

                } catch (error) {
                    console.error("Submission Error:", error);
                    MySwal.fire({
                        icon: "error",
                        title: "त्रुटी",
                        text: "माहिती जतन करताना काहीतरी चूक झाली.",
                        confirmButtonText: "OK",
                    });
                }
            }
        });
    };



    useEffect(() => {
        if (StartDate != '' && EndDate != '') {
            const FetchRate = async () => {
                try {

                    const payload1 = {
                        startDate: StartDate?.toString?.() || "",  // make sure it's a string
                        endDate: EndDate?.toString?.() || ""
                    };

                    const headers = {
                        "Content-Type": "application/json",
                        Accept: "*/*",
                    };

                    const response = await axios.post(
                        `${baseUrl.Url}/backend/api/GET_CountPrecooling`,
                        payload1,
                        { headers }
                    );
                    if (response.status !== 200) throw new Error("Failed to fetch farmer data");
                    setRate(response.data[0].rate
                    );
                    console.log("Rate", response.data[0])
                } catch (error) {
                    console.error("Error fetching FarmerReport data:", error);
                }
            };
            FetchRate();
        }
    }, [StartDate, EndDate]);

    useEffect(() => {
        const weight = parseFloat(formData.WeightInkg) || 0;
        const rate = parseFloat(Rate) || 0;

        const amount = (weight * rate).toFixed(2);

        setFormData((prev) => ({
            ...prev,
            Amount: amount
        }));
    }, [formData.WeightInkg, Rate]); // recalculate when either changes



    useEffect(() => {
        if (StartDate && EndDate) {
            const start = new Date(StartDate);
            const end = new Date(EndDate);

            const diffTime = end.getTime() - start.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            setFormData((prev) => ({
                ...prev,
                TotalDays: diffDays >= 0 ? diffDays : 0, // Prevent negative
            }));
        }
    }, [StartDate, EndDate]);





    const fetchDataTable = async (OutWardStockWeight) => {
        try {
            const payload1 = {
                startDate: StartDate?.toString?.() || "",
                endDate: EndDate?.toString?.() || "",
                csid: CSOWID,
                outwardkg: OutWardStockWeight || "",
            };

            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            const response1 = await axios.post(
                `${baseUrl.Url}/backend/api/GET_PrecoolingSlab`,
                payload1,
                { headers }
            );

            if (response1.status !== 200)
                throw new Error("Failed to fetch vendor data");

            console.log("GET_PrecoolingSlabFailed", response1.data);

            if (response1.data.length > 0) {
                setTableData(response1.data);
                // setStartDate(response1.data[0].date);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    return (

        <>
            {/* Add Category */}
            <div className="modal fade" id="add-units-edit">
                <div className="modal-dialog modal-dialog-centered modal-fullscreen">

                    <div className="modal-content">
                        <form
                            onSubmit={handleSubmit}
                        >
                            <div className="card mbgcolor">
                                <div className="card-body mbgcolor">
                                    <div className="accordion-card-one accordion" id="accordionExample">
                                        <div className="accordion-item mbgcolor">
                                            <div className="accordion-header" id="headingOne">
                                                <div
                                                    className=""
                                                    data-bs-toggle="collapse"
                                                    data-bs-target="#collapseOne"
                                                    aria-controls="collapseOne"
                                                >
                                                    <div className="addproduct-icon">
                                                        <h5>
                                                            <Info className="add-info" />
                                                            <span>Cold Storage outward</span>
                                                        </h5>

                                                    </div>
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


                                                        <div className="col-lg-4 col-md-6 mb-3">
                                                            <label htmlFor="shopDate" className="form-label  required"> Lot No</label>
                                                            <input
                                                                // ref={LotRef}
                                                                type="text"
                                                                id="LotNo"
                                                                className="form-control"
                                                                placeholder="लॉट क्रमांक प्रविष्ट करा"
                                                                name="LotNo"
                                                                onChange={(e) =>
                                                                    setFormData((prev) => ({ ...prev, LotNo: e.target.value }))
                                                                }
                                                                value={formData.LotNo}
                                                                // onKeyDown={(e) => handleKeyDown(e, CustomerRef)}
                                                                readOnly
                                                            />
                                                        </div>

                                                        <div className="col-lg-4 col-md-6 mb-3">
                                                            <label htmlFor="shopName" className="form-label  required">Customer Name </label>


                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                name="CustomerName"
                                                                value={
                                                                    Customerdata.find(option => option.value === formData.CustomerName)?.label || ''
                                                                }
                                                                readOnly
                                                            />



                                                        </div>
                                                        <div className="col-lg-4 col-md-6 mb-3">
                                                            <div className="mb-0 add-product form-label">
                                                                <div className="d-flex justify-content-between align-items-center">
                                                                    <label htmlFor="shopLocation" className="form-label required">Third Party Name</label>
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
                                                                        id="ThirdPartyName"

                                                                        type="text"
                                                                        className="form-control"
                                                                        placeholder=" तीसरा पक्ष नाव प्रविष्ट करा"
                                                                        name="ThirdPartyName"
                                                                        onChange={handleChange}
                                                                        value={formData.ThirdPartyName}
                                                                        readOnly


                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="row">


                                                        <div className="col-lg-4 col-md-6 mb-3">
                                                            <label htmlFor="shopRent" className="form-label required">Item </label>

                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                name="Item"
                                                                value={
                                                                    Itemdata.find(option => option.value === formData.Item)?.label || ''
                                                                }
                                                                readOnly
                                                            />



                                                        </div>

                                                        <div className="col-lg-2 col-md-6 mb-3">
                                                            <label htmlFor="Weight" className="form-label required">Weight(kg)</label>

                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                name="WeightUnit"
                                                                value={
                                                                    formData.WeightInkg
                                                                }
                                                                readOnly

                                                            />

                                                        </div>


                                                        <div className="col-lg-3 col-md-6 mb-3">
                                                            <label htmlFor="OutWardStockWeight" className="form-label required">OutWard Stock Weight</label>
                                                            <input
                                                                ref={RefOutWardStockWeight}
                                                                id="OutWardStockWeight"
                                                                type="number"
                                                                className="form-control"
                                                                placeholder="  OutWard Stock प्रविष्ट करा"
                                                                name="OutWardStockWeight"
                                                                onChange={handleChange}
                                                                value={formData.OutWardStockWeight}
                                                                onKeyDown={(e) => handleKeyDown(e, RefRemainingStockWeight)}

                                                            />
                                                        </div>
                                                        <div className="col-lg-3 col-md-6 mb-3">
                                                            <label htmlFor="RemainingStockWeight" className="form-label required">Remaining  Stock Weight</label>
                                                            <input
                                                                ref={RefRemainingStockWeight}
                                                                id="RemainingStockWeight"
                                                                type="text"
                                                                className="form-control"
                                                                placeholder="  कॅरेट प्रविष्ट करा"
                                                                name="RemainingStockWeight"
                                                                onChange={handleChange}
                                                                value={formData.RemainingStockWeight}
                                                                readOnly
                                                            />

                                                        </div>
                                                    </div>


                                                    <div className="border p-2 rounded shadow-sm mb-4 mt-3">
                                                        <div className="row ">
                                                            <div className="col-lg-12">
                                                                <div className="modal-body-table">
                                                                    <div className="table-responsive">
                                                                        <div style={{ maxHeight: "325px", overflowY: "auto" }}> {/* Adjust height as needed */}

                                                                            <table className="table datanew table-bordered" style={{ tableLayout: "fixed", width: "100%" }}>
                                                                                <thead className="thead-dark" style={{ position: "sticky", top: 0, backgroundColor: "#343a40", color: "white", zIndex: 1000 }}>
                                                                                    <tr>
                                                                                        <th className="text-center">Start Date</th>
                                                                                        <th className="text-center">End Date</th>
                                                                                        {/* <th className="text-center">Days From</th>
                                                                                        <th className="text-center">Days To</th> */}
                                                                                        <th className="text-center">Days In Slab</th>
                                                                                        <th className="text-center">Rate</th>
                                                                                        <th className="text-center">Total WeightIn(kg)</th>
                                                                                        <th className="text-center">Outward WeightIn(kg)</th>

                                                                                        <th className="text-center">Amount</th>
                                                                                    </tr>
                                                                                </thead>

                                                                                <tbody>
                                                                                    {Tabledata.length > 0 ? (
                                                                                        <>
                                                                                            {Tabledata.map((row, index) => (
                                                                                                <tr key={index}>
                                                                                                    <td className="text-center">{row.startdate}</td>
                                                                                                    <td className="text-center">{row.enddate}</td>
                                                                                                    <td className="text-center">{row.dayinslab}</td>
                                                                                                    <td className="text-center">{row.rate}</td>
                                                                                                    <td className="text-center">{row.weightinkg}</td>
                                                                                                    <td className="text-center">{row.outwardweight}</td>
                                                                                                    <td className="text-center">{row.totalamount}</td>
                                                                                                </tr>
                                                                                            ))}

                                                                                            <tr style={{ fontWeight: 'bold', backgroundColor: '#f2f2f2' }}>
                                                                                                <td colSpan="5"></td>
                                                                                                <td className="text-center">Total</td>
                                                                                                <td className="text-center">
                                                                                                    {/* {Tabledata.reduce((sum, r) => sum + (parseFloat(r.amount) || 0), 0)} */}

                                                                                                    {Tabledata.reduce((sum, row) => sum + (parseFloat(row.totalamount) || 0), 0)}
                                                                                                </td>
                                                                                            </tr>
                                                                                        </>
                                                                                    ) : (
                                                                                        <tr>
                                                                                            <td colSpan="7" className="text-center">No Data Available</td>
                                                                                        </tr>
                                                                                    )}
                                                                                </tbody>


                                                                            </table>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="col-lg-12">
                                                        <div className="btn-addproduct mb-4">
                                                            <button type="button"
                                                                className="btn btn-cancel me-2"
                                                                data-bs-dismiss="modal"
                                                                aria-label="Close"
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
                    </div>
                </div>
            </div>
            {/* /Add Category */}
        </>
    );
};

export default OutwardEdit;
