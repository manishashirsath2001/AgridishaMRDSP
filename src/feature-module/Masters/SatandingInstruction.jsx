import React, { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ImageWithBasePath from "../../core/img/imagewithbasebath";
import Brand from "../../core/modals/inventory/brand";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { baseUrl, ACSPLGUID } from "../../core/json/custom";
import { all_routes } from "../../Router/all_routes";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import Table from "../../core/pagination/datatable";
import { setToogleHeader } from "../../core/redux/action";
import Select from "react-select";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import marathiFontBase64 from "../../style/fonts/NotoSansDevanagari";

import axios from 'axios';

import {
    ArrowLeft,
    ChevronUp,
    Edit,
    RotateCcw,

} from "feather-icons-react/build/IconComponents";

import { getUserData } from '../../Context/UserData'
import AddServiceType from "./AddServiceType";

function StandingInstrution() {

    const { userdetail } = getUserData();
    const GUID = ACSPLGUID.getNew();
    const DGUID = ACSPLGUID.getNew();
    const dispatch = useDispatch();
    const [RateApplicable, setRateApplicable] = useState([]);
    const [Customer, setCustomer] = useState([]);
    const data = useSelector((state) => state.toggle_header);
    const MySwal = withReactContent(Swal);
    const route = all_routes;
    const [tabledata, settabledata] = useState([]);
    const [finaldata, setfinaldata] = useState([]);
    const [finaldata1, setfinaldata1] = useState([]);
    const [farmer, setfarmer] = useState([]);
    const [Shop, setShop] = useState([]);
    const [vyapari, setvyapari] = useState([]);
    const [search, setSearch] = useState("");
    const [fetchNewRate, setFetchNewRate] = useState([]);
    const [tabledata1, settabledata1] = useState([]);
    const [pkid, setpkid] = useState("");
    const RateApplicableref = useRef(null);




    const [formData, setFormData] = useState({
        SCID: "",

        RateApplicable: "",
        NewRate: "",
    });
    const renderTooltip = (props) => (
        <Tooltip id="pdf-tooltip" {...props}>
            Pdf
        </Tooltip>
    );
    useEffect(() => {
        if (RateApplicableref.current) {
            RateApplicableref.current.focus();
        }
    }, []);
    const renderExcelTooltip = (props) => (
        <Tooltip id="excel-tooltip" {...props}>
            Excel
        </Tooltip>
    );
    const renderPrinterTooltip = (props) => (
        <Tooltip id="printer-tooltip" {...props}>
            Printer
        </Tooltip>
    );
    const renderRefreshTooltip = (props) => (
        <Tooltip id="refresh-tooltip" {...props}>
            Refresh
        </Tooltip>
    );
    const renderCollapseTooltip = (props) => (
        <Tooltip id="refresh-tooltip" {...props}>
            Collapse
        </Tooltip>
    );

    const handleSearch1 = (event) => {
        setSearch(event.target.value);

        const selectedValue = formData.RateApplicable; // Get selected value

        // Define common payload structure
        const payload = {
            "keyword": event.target.value,
            "companyid": userdetail?.companyID || "",
            "deptid": userdetail?.departmentID || "",
        };

        const headers = {
            "Content-Type": "application/json",
            Accept: "*/*",
        };

        let url = "";

        // Determine the API endpoint based on the selected value
        switch (selectedValue) {
            case "0":
                url = `${baseUrl.Url}/backend/api/GET_StandingI_RateA_ShopAlot/_Search`;
                payload["shid"] = "%";
                break;
            case "1":
                url = `${baseUrl.Url}/backend/api/GET_StandingI_RateA_Farmer/_Search`;
                payload["maid"] = "%";
                break;
            case "2":
                url = `${baseUrl.Url}/backend/api/GET_StandingI_RateA_Vyapari/_Search`;
                payload["vpaid"] = "%";
                break;
            default:
                console.error("Invalid selection! No API call made.");
                return;
        }

        // Make API call for the selected case
        axios.post(url, JSON.stringify(payload), { headers })
            .then((response) => {
                if (response.status !== 200) throw new Error("Failed to fetch data");
                console.log("Response Data:", response.data);
                settabledata(response.data);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    };


    useEffect(() => {

        const fetchFamerDetail = async () => {
            try {
                const payload =
                {


                    "maid": "%",
                    "keyword": "%",
                    "companyid": "",
                    "deptid": "",
                };


                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };
                const response = await axios.post(
                    `${baseUrl.Url}/backend/api/GET_StandingI_RateA_Farmer`,

                    payload,
                    { headers }
                );
                if (response.status !== 200)
                    throw new Error("Failed to fetch Famer Detail");
                console.log("Famer Detail", response.data)
                setfarmer(response.data);
            } catch (error) {
                console.error("Error fetching Famer Detail:", error);
            }
        };

        const fetchShopAlot = async () => {
            try {
                const payload =
                {
                    "shid": "%",
                    "keyword": "%",
                    "companyid": userdetail?.companyID ? userdetail.companyID : "",
                    "deptid": userdetail?.departmentID ? userdetail.departmentID : "",
                };


                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };
                const response = await axios.post(
                    `${baseUrl.Url}/backend/api/GET_StandingI_RateA_ShopAlot`,

                    payload,
                    { headers }
                );
                if (response.status !== 200)
                    throw new Error("Failed to fetch Shop");
                console.log("Shop", response.data)
                setShop(response.data);
            } catch (error) {
                console.error("Error fetching Shop:", error);
            }
        };

        const fetchVyapariDetail = async () => {
            try {
                const payload =
                {


                    "vpaid": "%",
                    "keyword": "%",
                    "companyid": "",
                    "deptid": "",
                };
                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };
                const response = await axios.post(
                    `${baseUrl.Url}/backend/api/GET_StandingI_RateA_Vyapari`,
                    payload,
                    { headers }
                );
                if (response.status !== 200)
                    throw new Error("Failed to fetch Famer Detail");
                console.log("Famer Detail", response.data)
                setvyapari(response.data);
            } catch (error) {
                console.error("Error fetching Famer Detail:", error);
            }
        };
        fetchFamerDetail();
        fetchShopAlot();
        fetchVyapariDetail();
    }, []);

    useEffect(() => {
        const RateApplicable = async () => {
            try {
                const response = await axios.get(
                    baseUrl.Url + "/backend/api/Implications/RAPPLI",
                );
                if (response.status !== 200) throw new Error("Failed to fetch implications data");

                const data = response.data;
                const implicationsDropdown = data.map(({ iTitle, iValue }) => ({
                    label: iTitle,
                    value: iValue,
                }));
                setRateApplicable(implicationsDropdown);
            } catch (error) {
                console.error("Error fetching implications:", error);
            }
        };


        RateApplicable();


    }, []);


    const [isDataModified, setIsDataModified] = useState(false);

    const handleEdit1 = async (rateapp, pkidd) => {
        try {
            // Step 1: Fetch updated rates
            const fetchPayload = {
                siid: pkidd,
                companyid: userdetail?.companyID || "",
                deptid: userdetail?.departmentID || "",
            };

            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            const fetchResponse = await axios.post(
                `${baseUrl.Url}/backend/api/GET_StandingInstrcution`,
                fetchPayload,
                { headers }
            );

            if (fetchResponse.status !== 200) throw new Error("Failed to fetch new rate data");

            const updatedRates = fetchResponse.data.map(item => ({
                ...item,
                NewRate: item.newrate,
            }));

            setFetchNewRate(updatedRates); // optional - in case you use it somewhere else

            // Step 2: Check if existing data needs to be saved
            if (tabledata1.length > 0) {
                const hasUserEdited = tabledata1.some(row =>
                    row.isEdited &&
                    row.NewRate !== undefined &&
                    row.NewRate !== null &&
                    row.NewRate !== "" &&
                    parseFloat(row.NewRate) !== parseFloat(row.rate)
                );

                if (isDataModified && hasUserEdited) {
                    const result = await MySwal.fire({
                        text: 'तुम्हाला ही माहिती जतन करायची आहे का?',
                        showCancelButton: true,
                        confirmButtonColor: '#00ff00',
                        confirmButtonText: 'जतन करा',
                        cancelButtonColor: '#092C4C',
                        cancelButtonText: 'रद्द करा',
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                    });

                    if (result.isConfirmed) {
                        handleSave();
                        setIsDataModified(false);
                    }

                    return; // Stop here until save is done
                }
            }

            // Step 3: Fetch service charges data
            const payload = {
                companyid: userdetail?.companyID || "",
                deptid: userdetail?.departmentID || "",
                rateapplicable: rateapp
            };

            const serviceResponse = await axios.post(
                `${baseUrl.Url}/backend/api/GET_ServiceChargesById`,
                payload,
                { headers }
            );

            if (serviceResponse.status !== 200) throw new Error("Failed to fetch data");

            const updatedData = serviceResponse.data.map(item => ({
                ...item,
                NewRate: item.rate,
                shid: pkidd
            }));

            const updatedTableData = updatedData.map(existingItem => {
                const matchingItem = updatedRates.find(
                    newItem => newItem.scid === existingItem.scid && newItem.shid === existingItem.shid
                );
                return matchingItem
                    ? { ...existingItem, NewRate: matchingItem.newrate }
                    : existingItem;
            });

            settabledata1(updatedTableData);
            setIsDataModified(true);
            setpkid(pkidd);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };




    const handleSave = async (siid) => {
        console.log(finaldata, "finaldata");
        try {

            const filteredPayload = finaldata.updatedList.map(row1 => ({
                siid: ACSPLGUID.getNew(),
                scid: row1.scid || "",
                shid: row1.shid || "",
                vpaid: row1.vpaid || "",
                name: row1.name || "",
                phone: row1.mobile || "",
                adhar: row1.adhar || "",
                rateapplicable: row1.rateapplicable || "",
                servicetype: row1.servicetype || "",

                ratetype: row1.ratetype || "",
                rate: row1.rate ? parseFloat(row1.rate) : 0.0, // Convert to float if available
                newrate: row1.NewRate ? parseFloat(row1.NewRate) : 0.0, // Convert only if modified
                status: row1.isapproval === true, // Boolean check
                companyid: userdetail?.companyID || "",
                deptid: userdetail?.departmentID || "",
                uaid: userdetail?.uaid || "",
            }));



            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            const response = await axios.post(
                `${baseUrl.Url}/backend/api/SP_AddUpdStandingInstrcution`,
                filteredPayload, // ✅ API expects an array
                { headers }
            );

            Swal.fire({
                icon: "success",
                title: "साठवले!",
                text: "माहिती यशस्वीरित्या सेव झाली",
                confirmButtonText: "OK",
                allowOutsideClick: false,
                allowEscapeKey: false,
            }).then(() => {
                // ✅ Reset only updated rows
                settabledata1((prevList) =>
                    prevList.map((row) => ({
                        ...row,

                    }))
                );

            });

            console.log("API Response:", response.data);

        } catch (error) {
            console.error("Submission Error:", error.response?.data || error);
            Swal.fire({
                icon: "error",
                title: "त्रुटी",
                text: "माहिती जतन करताना काहीतरी चूक झाली.",
                confirmButtonText: "OK",
                allowOutsideClick: false,
                allowEscapeKey: false,
            });
        }
    };

    const handleRateChange = (e, row) => {
        const newRate = e.target.value;

        // Allow only valid numbers or empty input
        if (newRate === "" || /^\d*\.?\d*$/.test(newRate)) {
            settabledata1((prevList) => {
                const updatedList = prevList.map((product) => {
                    if (product.scid === row.scid && product.shid === row.shid) {
                        return {
                            ...product,
                            prevRate: product.NewRate || product.rate,
                            NewRate: newRate,
                            isEdited: true, // 🔥 Mark row as manually edited
                            shid: pkid
                        };
                    }
                    return product;
                });

                setfinaldata1(prevState => ({
                    ...prevState,
                    updatedList
                }));

                setfinaldata(prevState => ({
                    ...prevState,
                    ...finaldata1,
                    updatedList
                }));

                console.log("updatedList", updatedList);

                return updatedList;
            });

            setIsDataModified(true); // Mark that a change was made
        }
    };

    const today = new Date().toISOString().split('T')[0]

    const handleStatusToggle = async (row, currentStatus) => {
        try {
            const updatedStatus = !currentStatus; // Toggle status

            const payload1 = {
                scid: row.scid,
                rateapplicable: row.rateapplicable,
                servicetype: row.servicetype,
                rate: row.rate,
                lejar: row.lejar || "",
                date: today,
                ratetype: row.ratetype,
                isapproval: updatedStatus,
                companyid: userdetail?.companyID || "",
                deptid: userdetail?.departmentID || "",
                uaid: userdetail?.uaid || "",
            };

            console.log("lejar", row.servicetype)

            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            // API Call
            const response1 = await axios.post(`${baseUrl.Url}/backend/api/SP_AddUpdServiceCharge`, payload1, { headers });

            if (response1.status === 200) {
                // ✅ Update only the toggled item in the list
                settabledata1((prevList) =>
                    prevList.map((product) =>
                        product.scid === row.scid ? { ...product, isapproval: updatedStatus } : product
                    )

                );



                // Fetch updated data
                try {
                    const payload = {
                        scid: "%",
                        keyword: "%",
                        rateapplicable: "",
                        servicetype: "",

                        ratetype: "",
                        rate: 0,
                        companyid: userdetail?.companyID || "",
                        deptid: userdetail?.departmentID || "",
                    };

                    const response2 = await axios.post(
                        `${baseUrl.Url}/backend/api/GET_ServiceChargesById`,
                        JSON.stringify(payload),
                        { headers }
                    );

                    if (response2.status === 200) {
                        setCustomer(response2.data);
                    } else {
                        throw new Error("Failed to fetch data");
                    }
                } catch (error) {
                    console.error("Error fetching updated data:", error);
                }

                Swal.fire({
                    icon: "success",
                    title: "साठवले!",
                    text: "माहिती यशस्वीरित्या सेव झाली.",
                    confirmButtonText: "OK",
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                });
            } else {
                throw new Error("Failed to update status.");
            }
        } catch (error) {
            console.error("Submission Error:", error);
            Swal.fire({
                icon: "error",
                title: "त्रुटी",
                text: "माहिती सेव करण्यास अपयश. कृपया पुन्हा प्रयत्न करा.",
                allowOutsideClick: false,
                allowEscapeKey: false,
            });
        }
    };


    const handleSave1 = async () => {
        const hasUserEdited = tabledata1.some(row =>
            row.isEdited &&
            row.NewRate !== undefined &&
            row.NewRate !== null &&
            row.NewRate !== "" &&
            parseFloat(row.NewRate) !== parseFloat(row.rate)
        );

        if (!isDataModified || !hasUserEdited) {
            // Optional: Show info toast or alert to tell user nothing is changed

            MySwal.fire({
                text: "तुम्ही  माहिती मध्ये बदल केला नाही आधी बदल करा मग जतन करा  ",

                confirmButtonColor: "#00ff00",
                confirmButtonText: "होय",
                allowOutsideClick: false,
                allowEscapeKey: false,

            }).then(() => {
                return
            });
            console.log("No changes to save.");
            return;
        }

        // Proceed to save
        try {
            await handleSave(); // Assuming this is your save logic
            setIsDataModified(false);

            // Reset isEdited after successful save
            const resetEdited = tabledata1.map(row => ({
                ...row,
                isEdited: false
            }));
            settabledata1(resetEdited);

        } catch (error) {
            console.error("Error saving data:", error);
        }
    };
    const downloadPDF = () => {

        const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();



        const cleanBase64 = marathiFontBase64.replace(/^data:font\/ttf;base64,/, "");

        doc.addFileToVFS("NotoSansDevanagari.ttf", cleanBase64);
        doc.addFont("NotoSansDevanagari.ttf", "NotoSansDevanagari", "normal");

        doc.setFont("NotoSansDevanagari", "normal");
        doc.setFontSize(16);
        const title = "लिलाव अहवाल";
        const titleWidth = doc.getTextWidth(title);
        doc.text(title, (pageWidth - doc.getTextWidth(title)) / 2, 20);
        const borderMargin = 10;
        doc.rect(borderMargin, borderMargin, pageWidth - borderMargin * 2, pageHeight - borderMargin * 2);
        doc.text(title, (pageWidth - titleWidth) / 2, 20);
        doc.setLineWidth(0.5);
        doc.line((pageWidth - titleWidth) / 2, 22, (pageWidth + titleWidth) / 2, 22);
        const tableColumn = [" दर लागु", " सेवा प्रकार", " दर प्रकार", "दर", "नविन दर", "स्थिती"];

        const tableRows = tabledata1.map((item) => {

            const formattedVehNo = (item.vehno && item.vehno.trim())
                ? item.vehno.trim().replace(/([A-Za-z]{2})(\d{2})([A-Za-z]{1,2})(\d{4})/, "$1 $2 $3 $4")
                : "N/A";

            return [
                item.rappli,
                item.stype,
                item.rtype,
                item.rate,
                item.NewRate,
                item.isapproval,

            ];
        });

        const sanitizedTableRows = tableRows.map(row =>
            row.map(cell => (cell ? cell.toString() : ""))
        );

        autoTable(doc, {
            startY: 30,
            head: tableColumn,
            body: sanitizedTableRows,
            theme: 'grid',
            // Heading in Marathi
            headStyles: {
                font: "NotoSansDevanagari",
                fontSize: 11,
                fontStyle: "normal",
                fillColor: [169, 169, 169],
                textColor: 0,
            },

            // Body data in English
            styles: {
                font: "helvetica", // English font
                fontSize: 9,
                halign: "center",
                cellPadding: 2,
                overflow: 'linebreak',
            },
            columnStyles: {
                2: {
                    font: "NotoSansDevanagari", // English font
                    fontSize: 12,
                }
            },

            // alternateRowStyles: { fillColor: [240, 240, 240] },
        });

        const blob = doc.output("blob");
        const blobURL = URL.createObjectURL(blob);
        window.open(blobURL, "_blank");
    };



    useEffect(() => {
        const fetchRatesData = async () => {
            try {
                const payload = {
                    "siid": "%",
                    "companyid": userdetail?.companyID || "",
                    "deptid": userdetail?.departmentID || "",
                };

                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };

                const response = await axios.post(
                    `${baseUrl.Url}/backend/api/GET_StandingInstrcution`,
                    payload,
                    { headers }
                );

                if (response.status !== 200) throw new Error("Failed to fetch new rate data");

                console.log("new rate", response.data);

                // Set new rate or fallback to rate
                const updatedRates = response.data.map(item => ({
                    ...item,
                    NewRate: item.NewRate || item.rate,  // Ensure NewRate is set properly
                }));

                setFetchNewRate(updatedRates);
            } catch (error) {
                console.error("Error fetching new rate data:", error);
            }
        };

        fetchRatesData(); // Call renamed function
    }, []);

    return (
        <div className="page-wrapper">
            <div className="content">
                <div className="page-header">
                    <div className="add-item d-flex">
                        <div className="page-title">
                            <h3>Standing Instrcutions</h3>
                            <h6></h6>
                        </div>
                    </div>
                    <ul className="table-top-head">
                        <li>
                            <OverlayTrigger placement="top" overlay={renderTooltip}>
                                <Link
                                    onClick={downloadPDF}
                                >
                                    <ImageWithBasePath src="assets/img/icons/pdf.svg" alt="img" />
                                </Link>
                            </OverlayTrigger>
                        </li>
                        <li>
                            <OverlayTrigger placement="top" overlay={renderExcelTooltip}>
                                <Link
                                // onClick={downloadExcel}
                                >
                                    <ImageWithBasePath src="assets/img/icons/excel.svg" alt="img" />
                                </Link>
                            </OverlayTrigger>
                        </li>;
                        <li>
                            <OverlayTrigger placement="top" overlay={renderPrinterTooltip}>
                                <Link data-bs-toggle="tooltip" data-bs-placement="top">
                                    <i data-feather="printer" className="feather-printer" />
                                </Link>
                            </OverlayTrigger>
                        </li>
                        <li>
                            <OverlayTrigger placement="top" overlay={renderRefreshTooltip}>
                                <Link data-bs-toggle="tooltip" data-bs-placement="top">
                                    <RotateCcw />
                                </Link>
                            </OverlayTrigger>
                        </li>
                        <li>
                            <OverlayTrigger placement="top" overlay={renderCollapseTooltip}>
                                <Link
                                    data-bs-toggle="tooltip"
                                    data-bs-placement="top"
                                    id="collapse-header"
                                    className={data ? "active" : ""}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        dispatch(setToogleHeader(!data));
                                    }}
                                >

                                    <ChevronUp />
                                </Link>
                            </OverlayTrigger>
                        </li>
                    </ul>

                    <div className="page-btn">
                        <Link to={route.MasterIndex} className="btn btn-secondary">
                            <ArrowLeft className="me-2" />
                            मागे
                        </Link>
                    </div>
                </div>



                <form

                >
                    <div className="row mb-5">

                        <div className="col-lg-3 col-sm-4 col-12">
                            <div className=" add-product form-label">
                                <label htmlFor="serviceName" className="form-label required">
                                    दर लागु
                                </label>

                                <Select
                                    ref={RateApplicableref}
                                    classNamePrefix="react-select"
                                    options={RateApplicable} // Your options array
                                    value={RateApplicable.find(option => option.value === formData.RateApplicable) || null}
                                    onChange={(selectedOption) => {
                                        const selectedValue = selectedOption ? selectedOption.value : null;

                                        // Set the table data based on selection
                                        switch (selectedValue) {
                                            case "0":
                                                settabledata(Shop);
                                                break;
                                            case "1":
                                                settabledata(farmer);
                                                break;
                                            case "2":
                                                settabledata(vyapari);
                                                break;
                                            default:
                                                alert("Invalid Selection! Please choose a valid option.");
                                        }

                                        setFormData(prevState => ({
                                            ...prevState,
                                            RateApplicable: selectedValue
                                        }));

                                        settabledata1([]);


                                    }}
                                />




                            </div>
                        </div>

                    </div>




                </form>
                <div className="row mb-2">
                    <div className="col-lg-6 col-12 ms-auto">
                        <div className="input-group">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search"
                                value={search}
                                onChange={handleSearch1}
                            />
                            <span className="input-group-text">
                                <i className="fa fa-search"></i>
                            </span>
                        </div>
                    </div>
                </div>
                <div className="row ">
                    <div className="col-lg-12">
                        <div className="modal-body-table">
                            <div className="table-responsive">
                                <div style={{ maxHeight: "325px", overflowY: "auto" }}> {/* Adjust height as needed */}

                                    <table className="table datanew table-bordered" style={{ tableLayout: "fixed", width: "100%" }}>
                                        <thead className="thead-dark" style={{ position: "sticky", top: 0, backgroundColor: "#343a40", color: "white", zIndex: 1000 }}>
                                            <tr>
                                                <th className="text-center">नाव</th>
                                                <th className="text-center">आधार</th>
                                                <th className="text-center">फोन </th>
                                                <th className="text-center">कृती</th>
                                            </tr>

                                        </thead>
                                        <tbody>
                                            {tabledata.length > 0 ? (
                                                tabledata.map((row, index) => (
                                                    <tr key={index}>
                                                        <td className="text-center">{row.name}</td>
                                                        <td className="text-center">{row.adhar}</td>
                                                        <td className="text-center">{row.mobile}</td>
                                                        <td className="text-center">
                                                            <Link
                                                                to="#"
                                                                onClick={() => handleEdit1(formData.RateApplicable, row.pkid)}
                                                                className="me-2 p-1"
                                                                style={{ color: 'lightblue' }}
                                                            >
                                                                <Edit className="feather-edit" />
                                                            </Link>

                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="4" className="text-center">No Data Available</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>



                            </div>
                        </div>
                    </div>
                </div>
                <div className="row ">
                    <div className="col-lg-12">
                        <div className="modal-body-table">
                            <div className="table-responsive">
                                <div style={{ maxHeight: "325px", overflowY: "auto" }}> {/* Adjust height as needed */}

                                    <table className="table datanew table-bordered" style={{ tableLayout: "fixed", width: "100%" }}>
                                        <thead className="thead-dark" style={{ position: "sticky", top: 0, backgroundColor: "#343a40", color: "white", zIndex: 1000 }}>
                                            <tr>
                                                <th className="text-center">दर लागु</th>
                                                <th className="text-center">सेवा प्रकार</th>
                                                <th className="text-center">दर प्रकार</th>
                                                <th className="text-center">दर</th>
                                                <th className="text-center">नविन दर</th>
                                                <th className="text-center">स्थिती</th>

                                            </tr>

                                        </thead>
                                        <tbody>
                                            {tabledata1.length > 0 ? (
                                                tabledata1.map((row, index) => (

                                                    <tr key={index}>
                                                        <td className="text-center">{row.rappli}</td>
                                                        <td className="text-center">{row.stype}</td>
                                                        <td className="text-center">{row.rtype}</td>
                                                        <td className="text-center">{row.rate}</td>
                                                        <td className="text-center">
                                                            <input
                                                                type="number"
                                                                name="NewRate"
                                                                className="form-control text-center"
                                                                value={row.NewRate || ""} // controlled input
                                                                onChange={(e) => handleRateChange(e, row)} // 👈 attach handler
                                                            />



                                                        </td>
                                                        <td className="text-center">
                                                            <div className="d-flex justify-content-center">
                                                                <span className={`badge ${row.isapproval ? "badge-success" : "badge-danger"}`}>
                                                                    <Link
                                                                        to="#"
                                                                        style={{ color: "white", textDecoration: "none" }}
                                                                        onClick={() => handleStatusToggle(row, row.isapproval)}
                                                                    >
                                                                        {row.isapproval ? "Active" : "Inactive"}
                                                                    </Link>
                                                                </span>
                                                            </div>
                                                        </td>

                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="6" className="text-center">No Data Available</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>



                            </div>
                        </div>
                    </div>
                </div>
                <div className="row ">
                    <div className="col-lg-12 col-md-6 col-sm-12 mt-2 mb-2 d-flex justify-content-end">
                        <button type="button" className="btn btn-submit"

                            onClick={() => handleSave1()}
                        >
                            सेव्ह
                        </button>
                    </div>
                </div>


                <AddServiceType />
                <Brand />
            </div>
        </div>
    )
}

export default StandingInstrution