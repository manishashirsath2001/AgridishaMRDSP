import React, { useState, useEffect } from "react";
import Breadcrumbs from "../../core/breadcrumbs";
import Select from 'react-select';
import axios from 'axios';
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { baseUrl } from "../../core/json/custom";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import marathiFontBase64 from "../../style/fonts/NotoSansDevanagari";
const Reports = () => {
    const [Auction, setAuction] = useState([]);
    const [Vyapari, setVyapari] = useState([]);

    const [Farmer, setFarmer] = useState([]);
    const [dates, setDates] = useState("");
    const MySwal = withReactContent(Swal);
    const [formData, setformData] = useState({
        product: "",
        payment: "",
        cate: "",
        Enddate: "",
        Startdate: "",
    });

    const isValidDate = (date) => date && !isNaN(new Date(date).getTime());
    //auction Report
    const AuctionReport = async () => {
        const { Startdate, Enddate } = dates;

        if (!isValidDate(Startdate) || !isValidDate(Enddate)) {
            return;
        }



        try {
            const payload =
            {
                "startdate": Startdate,
                "endtdate": Enddate,
                "companyid": "",
                "deptid": ""
            }

            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };
            const response = await axios.post(
                `${baseUrl.Url}/backend/api/GET_Report_Auction`,

                payload,
                { headers }
            );
            if (response.status !== 200)
                throw new Error("Failed to fetch vendor data");
            console.log("Auction Report", response.data)
            setAuction(response.data);
        } catch (error) {
            console.error("Error fetching AuctionReport data:", error);
        }
    };
    useEffect(() => {
        if (dates.Startdate && dates.Enddate) {
            AuctionReport();
        }
    }, [dates]);

    const downloadPDFAuction = () => {


        const today = new Date();
        const startDate = new Date(dates.Startdate);
        const endDate = new Date(dates.Enddate);

        // 🔒 Validate input dates
        if (!isValidDate(dates.Startdate) || !isValidDate(dates.Enddate)) {
            MySwal.fire({
                title: "योग्य तारीख निवडा",
                text: "कृपया सुरुवातीची व शेवटची तारीख योग्य प्रकारे निवडा.",
                icon: "error",
                confirmButtonColor: "#ff0000",
                confirmButtonText: "ठीक आहे",
            });
            return;
        }

        if (startDate > endDate) {
            MySwal.fire({
                title: "चूक तारीख",
                text: "सुरुवातीची तारीख शेवटच्या तारखेपेक्षा जास्त असू शकत नाही.",
                icon: "warning",
                confirmButtonColor: "#ff0000",
                confirmButtonText: "ठीक आहे",
            });
            return;
        }

        if (endDate > today) {
            MySwal.fire({
                title: "चूक तारीख",
                text: "शेवटची तारीख आजच्या तारखेपेक्षा जास्त असू शकत नाही.",
                icon: "warning",
                confirmButtonColor: "#ff0000",
                confirmButtonText: "ठीक आहे",
            });
            return;
        }
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
        const tableColumn = [["टोकन नं.", "शेतकरी", "पिक", "मोबाईल नं.", "जाळी", "गाव", "वाहन नं."]];

        const tableRows = Auction.map((item) => {

            const formattedVehNo = (item.vehno && item.vehno.trim())
                ? item.vehno.trim().replace(/([A-Za-z]{2})(\d{2})([A-Za-z]{1,2})(\d{4})/, "$1 $2 $3 $4")
                : "N/A";

            return [
                item.toknno || "",
                item.farmername || "",

                item.croplabel,
                item.mobileno,
                item.caretS_COUNT,
                item.village,
                formattedVehNo
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
    const downloadExcelAuction = async () => {
        const isValidDate = (date) => date && !isNaN(new Date(date).getTime());

        const today = new Date();
        const startDate = new Date(dates.Startdate);
        const endDate = new Date(dates.Enddate);


        if (!isValidDate(dates.Startdate) || !isValidDate(dates.Enddate)) {
            MySwal.fire({
                title: "योग्य तारीख निवडा",
                text: "कृपया सुरुवातीची व शेवटची तारीख योग्य प्रकारे निवडा.",
                icon: "error",
                confirmButtonColor: "#ff0000",
                confirmButtonText: "ठीक आहे",
            });
            return;
        }


        if (startDate > endDate) {
            MySwal.fire({
                title: "चूक तारीख",
                text: "सुरुवातीची तारीख शेवटच्या तारखेपेक्षा जास्त असू शकत नाही.",
                icon: "warning",
                confirmButtonColor: "#ff0000",
                confirmButtonText: "ठीक आहे",
            });
            return;
        }


        if (endDate > today) {
            MySwal.fire({
                title: "चूक तारीख",
                text: "शेवटची तारीख आजच्या तारखेपेक्षा जास्त असू शकत नाही.",
                icon: "warning",
                confirmButtonColor: "#ff0000",
                confirmButtonText: "ठीक आहे",
            });
            return;
        }
        try {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("लिलाव अहवाल)");


            const headingRow = worksheet.addRow(["Auction (Report)"]);
            headingRow.getCell(1).font = { bold: true, size: 16 };
            headingRow.getCell(1).alignment = { horizontal: "center", vertical: "middle" };


            worksheet.mergeCells("A1:G1");


            const headers = ["टोकन नं.", "शेतकरी", "पिक", "मोबाईल नं.", "जाळी", "गाव", "वाहन नं."];
            const headerRow = worksheet.addRow(headers);

            headerRow.eachCell((cell) => {
                cell.font = { bold: true, color: { argb: "FFFFFF" } };
                cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "808080" } };
                cell.alignment = { horizontal: "center", vertical: "middle" };
            });


            const columnWidths = [15, 15, 15, 15, 15, 15, 15, 20, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 20]; // Adjust widths as needed
            columnWidths.forEach((width, index) => {
                worksheet.getColumn(index + 1).width = width;
            });




            Auction.forEach(({ toknno, farmername, croplabel, mobileno,
                caretS_COUNT, village, vehno }) => {
                const row = worksheet.addRow([toknno, farmername, croplabel, mobileno,
                    caretS_COUNT, village, vehno]);
                row.eachCell((cell) => {
                    cell.alignment = { horizontal: "center", vertical: "middle" };
                });

            });


            const buffer = await workbook.xlsx.writeBuffer();
            const data = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
            saveAs(data, "Auction(Report).xlsx");

        } catch (error) {
            console.error("Error generating the Excel file:", error);
        }
    };


    //farmer report
    const fetchFarmerReport = async () => {
        const { Startdate, Enddate } = dates;

        if (!isValidDate(Startdate) || !isValidDate(Enddate)) {
            return;
        }

        try {
            const payload = {
                startdate: Startdate,
                endtdate: Enddate,
                companyid: "",
                deptid: ""
            };

            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };

            const response = await axios.post(
                `${baseUrl.Url}/backend/api/GET_Report_farmer`,
                payload,
                { headers }
            );

            if (response.status !== 200) throw new Error("Failed to fetch farmer data");

            setFarmer(response.data);
        } catch (error) {
            console.error("Error fetching FarmerReport data:", error);
        }
    };

    useEffect(() => {
        if (dates.Startdate && dates.Enddate) {
            fetchFarmerReport();
        }
    }, [dates]);

    const handleDateChange = (event) => {
        const { name, value } = event.target;
        setDates((prevDates) => ({
            ...prevDates,
            [name]: value,
        }));
    };



    const downloadPDFfarmer = () => {
        const today = new Date();
        const startDate = new Date(dates.Startdate);
        const endDate = new Date(dates.Enddate);

        if (!isValidDate(dates.Startdate) || !isValidDate(dates.Enddate)) {
            MySwal.fire({
                title: "योग्य तारीख निवडा",
                text: "कृपया सुरुवातीची व शेवटची तारीख योग्य प्रकारे निवडा.",
                icon: "error",
                confirmButtonColor: "#ff0000",
                confirmButtonText: "ठीक आहे",
            });
            return;
        }

        if (startDate > endDate) {
            MySwal.fire({
                title: "चूक तारीख",
                text: "सुरुवातीची तारीख शेवटच्या तारखेपेक्षा जास्त असू शकत नाही.",
                icon: "warning",
                confirmButtonColor: "#ff0000",
                confirmButtonText: "ठीक आहे",
            });
            return;
        }

        if (endDate > today) {
            MySwal.fire({
                title: "चूक तारीख",
                text: "शेवटची तारीख आजच्या तारखेपेक्षा जास्त असू शकत नाही.",
                icon: "warning",
                confirmButtonColor: "#ff0000",
                confirmButtonText: "ठीक आहे",
            });
            return;
        }

        const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        // Load and register Marathi font
        const cleanBase64 = marathiFontBase64.replace(/^data:font\/ttf;base64,/, "");
        doc.addFileToVFS("NotoSansDevanagari.ttf", cleanBase64);
        doc.addFont("NotoSansDevanagari.ttf", "NotoDeva", "normal");

        // Set Marathi title
        doc.setFont("NotoDeva");
        doc.setFontSize(14);
        const title = "शेतकरी अहवाल"; // Marathi title
        const titleWidth = doc.getTextWidth(title);

        const borderMargin = 10;
        doc.rect(borderMargin, borderMargin, pageWidth - borderMargin * 2, pageHeight - borderMargin * 2);
        doc.text(title, (pageWidth - titleWidth) / 2, 20);
        doc.setLineWidth(0.5);
        doc.line((pageWidth - titleWidth) / 2, 22, (pageWidth + titleWidth) / 2, 22);

        // Table headers in Marathi
        const tableColumn = [
            "शेतकरी", "बिल नं.", "तारीख", "दर", "जाळी",
            "वजन", "रक्कम", "केरेट्स", "एकूण वजन", "एकूण रक्कम", "खर्च", "शिल्लक रक्कम", "व्यापारी"
        ];

        // Table data
        const tableRows = Farmer.map(item => [
            item.farmername || "",

            item.billno || "",
            item.date || "",
            item.rate || "",
            item.jali || "",
            item.weight || "",
            item.amount || "",
            item.totalcarets || "",
            item.totalweight || "",
            item.totalamount || "",
            item.totalcost || "",
            item.remainingamount || "",
            item.vyapariname || "",
        ]);

        autoTable(doc, {
            startY: 25,
            head: [tableColumn],
            body: tableRows,
            theme: 'grid',
            styles: {
                font: 'helvetica', // English for body
                fontSize: 9,
                halign: "center",
                cellPadding: 2,
                overflow: 'linebreak',
            },
            headStyles: {
                font: "NotoDeva", // Marathi for header
                fontSize: 11,
                fontStyle: "normal",
                fillColor: [169, 169, 169],
                textColor: 0,
            }

        });

        const blob = doc.output("blob");
        const blobURL = URL.createObjectURL(blob);
        window.open(blobURL, "_blank");
    };
    const downloadExcelfarmer = async () => {
        const today = new Date();
        const startDate = new Date(dates.Startdate);
        const endDate = new Date(dates.Enddate);

        if (!isValidDate(dates.Startdate) || !isValidDate(dates.Enddate)) {
            MySwal.fire({
                title: "योग्य तारीख निवडा",
                text: "कृपया सुरुवातीची व शेवटची तारीख योग्य प्रकारे निवडा.",
                icon: "error",
                confirmButtonColor: "#ff0000",
                confirmButtonText: "ठीक आहे",
            });
            return;
        }

        // Check if start date is after end date
        if (startDate > endDate) {
            MySwal.fire({
                title: "चूक तारीख",
                text: "सुरुवातीची तारीख शेवटच्या तारखेपेक्षा जास्त असू शकत नाही.",
                icon: "warning",
                confirmButtonColor: "#ff0000",
                confirmButtonText: "ठीक आहे",
            });
            return;
        }

        // Check if end date is in the future
        if (endDate > today) {
            MySwal.fire({
                title: "चूक तारीख",
                text: "शेवटची तारीख आजच्या तारखेपेक्षा जास्त असू शकत नाही.",
                icon: "warning",
                confirmButtonColor: "#ff0000",
                confirmButtonText: "ठीक आहे",
            });
            return;
        }

        try {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("Farmer Report");

            const headingRow = worksheet.addRow(["Farmer (Report)"]);
            headingRow.getCell(1).font = { bold: true, size: 16 };
            headingRow.getCell(1).alignment = { horizontal: "center", vertical: "middle" };
            worksheet.mergeCells("A1:N1");

            // const headers = [
            //     "Farmer", "Vyapari", "Bill No", "Tarik", "Rate",
            //     "Jali", "Weight", "WeightMinMax", "Amount",
            //     "Total Carets", "Total Weight", "Total Amount", "Total Cost", "Remaining Amount"
            // ];
            const headers = [
                "शेतकरी", "बिल नं.", "तारीख", "दर", "जाळी", "वजन", "रक्कम", "केरेट्स", "एकूण वजन", "एकूण रक्कम", "खर्च", "शिल्लक रक्कम", "व्यापारी"
            ];
            const headerRow = worksheet.addRow(headers);

            headerRow.eachCell(cell => {
                cell.font = { bold: true, color: { argb: "FFFFFF" } };
                cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "808080" } };
                cell.alignment = { horizontal: "center", vertical: "middle" };
            });

            headers.forEach((_, index) => {
                worksheet.getColumn(index + 1).width = 18;
            });

            Farmer.forEach(item => {
                const row = worksheet.addRow([
                    item.farmername, item.vyapariname, item.billno, item.date, item.rate,
                    item.jali, item.weight, item.weightminmax, item.amount,
                    item.totalcarets, item.totalweight, item.totalamount, item.totalcost, item.remainingamount
                ]);
                row.eachCell(cell => {
                    cell.alignment = { horizontal: "center", vertical: "middle" };
                });
            });

            const buffer = await workbook.xlsx.writeBuffer();
            const data = new Blob([buffer], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            });
            saveAs(data, "Farmer (Report).xlsx");

        } catch (error) {
            console.error("Error generating Excel file:", error);
        }
    };


    //vyapari Report




    const VyapariReport = async () => {
        const { Startdate, Enddate } = dates;

        if (!isValidDate(Startdate) || !isValidDate(Enddate)) {
            return;
        }

        try {
            const payload = {
                startdate: Startdate,
                endtdate: Enddate,
                companyid: "",
                deptid: ""
            };

            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };


            const response = await axios.post(
                `${baseUrl.Url}/backend/api/GET_Report_Vyapari`,
                payload,
                { headers }
            );

            if (response.status !== 200) throw new Error("Failed to fetch farmer data");

            setVyapari(response.data);
        } catch (error) {
            console.error("Error fetching FarmerReport data:", error);
        }
    };

    useEffect(() => {
        if (dates.Startdate && dates.Enddate) {
            VyapariReport();
        }
    }, [dates]);


    const downloadPDFVyapari = () => {


        const today = new Date();
        const startDate = new Date(dates.Startdate);
        const endDate = new Date(dates.Enddate);

        // 🔒 Validate input dates
        if (!isValidDate(dates.Startdate) || !isValidDate(dates.Enddate)) {
            MySwal.fire({
                title: "योग्य तारीख निवडा",
                text: "कृपया सुरुवातीची व शेवटची तारीख योग्य प्रकारे निवडा.",
                icon: "error",
                confirmButtonColor: "#ff0000",
                confirmButtonText: "ठीक आहे",
            });
            return;
        }

        if (startDate > endDate) {
            MySwal.fire({
                title: "चूक तारीख",
                text: "सुरुवातीची तारीख शेवटच्या तारखेपेक्षा जास्त असू शकत नाही.",
                icon: "warning",
                confirmButtonColor: "#ff0000",
                confirmButtonText: "ठीक आहे",
            });
            return;
        }

        if (endDate > today) {
            MySwal.fire({
                title: "चूक तारीख",
                text: "शेवटची तारीख आजच्या तारखेपेक्षा जास्त असू शकत नाही.",
                icon: "warning",
                confirmButtonColor: "#ff0000",
                confirmButtonText: "ठीक आहे",
            });
            return;
        }
        const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();



        const cleanBase64 = marathiFontBase64.replace(/^data:font\/ttf;base64,/, "");

        doc.addFileToVFS("NotoSansDevanagari.ttf", cleanBase64);
        doc.addFont("NotoSansDevanagari.ttf", "NotoSansDevanagari", "normal");

        doc.setFont("NotoSansDevanagari", "normal");
        doc.setFontSize(16);
        const title = "व्यापारी  अहवाल";
        const titleWidth = doc.getTextWidth(title);
        doc.text(title, (pageWidth - doc.getTextWidth(title)) / 2, 20);
        const borderMargin = 10;
        doc.rect(borderMargin, borderMargin, pageWidth - borderMargin * 2, pageHeight - borderMargin * 2);
        doc.text(title, (pageWidth - titleWidth) / 2, 20);
        doc.setLineWidth(0.5);
        doc.line((pageWidth - titleWidth) / 2, 22, (pageWidth + titleWidth) / 2, 22);
        const tableColumn = ["शेतकरी", "व्यापारी ", "बिल क्रमांक", "दिनांक", "पिक", "जाळी", "वजन", "दर", "रक्कम", "कर", "उर्वरित रक्कम"];

        const tableRows = Vyapari.map(item => [
            item.fname,
            item.vname,
            item.billno,
            item.date,
            item.croplabel,
            item.totaljaali,
            item.totalweight,
            item.rate,
            item.totalamount,
            item.totalloss,
            item.remainingamount,
        ]);

        const sanitizedTableRows = tableRows.map(row =>
            row.map(cell => (cell ? cell.toString() : ""))
        );

        autoTable(doc, {
            startY: 30,
            head: [tableColumn],
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
            // columnStyles: {
            //   2:{
            //   font: "NotoSansDevanagari", // English font
            //   fontSize: 12,
            //   }
            // },

            // alternateRowStyles: { fillColor: [240, 240, 240] },
        });

        const blob = doc.output("blob");
        const blobURL = URL.createObjectURL(blob);
        window.open(blobURL, "_blank");
    };

    const downloadExcelVyapari = async () => {
        const today = new Date();
        const startDate = new Date(dates.Startdate);
        const endDate = new Date(dates.Enddate);

        if (!isValidDate(dates.Startdate) || !isValidDate(dates.Enddate)) {
            MySwal.fire({
                title: "योग्य तारीख निवडा",
                text: "कृपया सुरुवातीची व शेवटची तारीख योग्य प्रकारे निवडा.",
                icon: "error",
                confirmButtonColor: "#ff0000",
                confirmButtonText: "ठीक आहे",
            });
            return;
        }

        // Check if start date is after end date
        if (startDate > endDate) {
            MySwal.fire({
                title: "चूक तारीख",
                text: "सुरुवातीची तारीख शेवटच्या तारखेपेक्षा जास्त असू शकत नाही.",
                icon: "warning",
                confirmButtonColor: "#ff0000",
                confirmButtonText: "ठीक आहे",
            });
            return;
        }

        // Check if end date is in the future
        if (endDate > today) {
            MySwal.fire({
                title: "चूक तारीख",
                text: "शेवटची तारीख आजच्या तारखेपेक्षा जास्त असू शकत नाही.",
                icon: "warning",
                confirmButtonColor: "#ff0000",
                confirmButtonText: "ठीक आहे",
            });
            return;
        }

        try {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("व्यापारी Report");

            const headingRow = worksheet.addRow(["व्यापारी (Report)"]);
            headingRow.getCell(1).font = { bold: true, size: 16 };
            headingRow.getCell(1).alignment = { horizontal: "center", vertical: "middle" };
            worksheet.mergeCells("A1:K1");

            const headers = ["शेतकरी", "व्यापारी ", "बिल क्रमांक", "दिनांक", "पिक", "जाळी", "वजन", "दर", "रक्कम", "कर", "उर्वरित रक्कम"];
            const headerRow = worksheet.addRow(headers);

            headerRow.eachCell(cell => {
                cell.font = { bold: true, color: { argb: "FFFFFF" } };
                cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "808080" } };
                cell.alignment = { horizontal: "center", vertical: "middle" };
            });

            headers.forEach((_, index) => {
                worksheet.getColumn(index + 1).width = 18;
            });

            Vyapari.forEach(item => {
                const row = worksheet.addRow([
                    item.fname,
                    item.vname,
                    item.billno,
                    item.date,
                    item.croplabel,
                    item.totaljaali,
                    item.totalweight,
                    item.rate,
                    item.totalamount,
                    item.totalloss,
                    item.remainingamount,
                ]);
                row.eachCell(cell => {
                    cell.alignment = { horizontal: "center", vertical: "middle" };
                });
            });

            const buffer = await workbook.xlsx.writeBuffer();
            const data = new Blob([buffer], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            });
            saveAs(data, "व्यापारी (Report).xlsx");

        } catch (error) {
            console.error("Error generating Excel file:", error);
        }
    };

    return (

        <div className="page-wrapper">
            <div className="content">
                <Breadcrumbs
                    maintitle="Sales Report"
                    subtitle=" Manage Your Sales Report"
                />
                <div className="">
                    {/* <div className="card table-list-card"> */}
                    <div className="card-body pt-3">
                        <div className="d-flex">
                            <div className="w-100 ">

                                <div className="row ">
                                    <div className="col-lg-4 col-md-6 col-sm-12">
                                        <div className="form-label">
                                            <label className="form-label">Start Date </label>
                                            <input type="date"
                                                className="form-control "
                                                name="Startdate"
                                                value={dates.Startdate}
                                                onChange={handleDateChange}

                                            />
                                        </div>
                                    </div>

                                    <div className="col-lg-2 col-md-6 col-sm-12">
                                        <div className="form-label">
                                            <label className="form-label">To  </label>
                                        </div>
                                    </div>

                                    <div className="col-lg-4 col-md-6 col-sm-12">
                                        <div className="form-label">
                                            <label className="form-label">End Date</label>
                                            <input type="date"
                                                className="form-control "
                                                name="Enddate"
                                                value={dates.Enddate}
                                                onChange={handleDateChange}
                                            />
                                        </div>
                                    </div>
                                </div>

                            </div>


                            <div className="w-100 me-5">
                                <div className="row">
                                    <div className="col-lg-6 col-md-6 col-sm-12 pb-3">
                                        <div className="form-label d-flex align-items-center">
                                            <label className="me-2 mt-3 mt-2">
                                                <img alt="img" src="/assets/img/icons/pdf.svg" />
                                            </label>
                                            <button
                                                className="form-control btn btn-primary"
                                                style={{ width: '230px', height: '35px' }}
                                                onClick={downloadPDFfarmer}
                                            >
                                                Farmer PDF
                                            </button>

                                        </div>
                                    </div>

                                    <div className="col-lg-6 col-md-6 col-sm-12 ">
                                        <div className="form-label d-flex align-items-center">
                                            <label className="me-2 mt-3 mt-2">
                                                <img alt="img" src="/assets/img/icons/excel.svg" />
                                            </label>
                                            <button className="form-control btn-primary dbgcolor"
                                                onClick={downloadExcelfarmer}
                                                style={{ width: '230px', height: '35px' }}
                                            >
                                                farmer  Excel
                                            </button>
                                        </div>
                                    </div>
                                </div>


                                <div className="row">
                                    <div className="col-lg-6 col-md-6 col-sm-12 pb-3">
                                        <div className="form-label d-flex align-items-center">
                                            <label className="me-2 mt-3 mt-2">
                                                <img alt="img" src="/assets/img/icons/pdf.svg" />
                                            </label>
                                            <button className="form-control btn-primary dbgcolor "
                                                onClick={downloadPDFAuction}
                                                style={{ width: '230px', height: '35px' }}
                                            >
                                                Auction PDF
                                            </button>
                                        </div>
                                    </div>

                                    <div className="col-lg-6 col-md-6 col-sm-12 ">
                                        <div className="form-label d-flex align-items-center">
                                            <label className="me-2 mt-3 mt-2">
                                                <img alt="img" src="/assets/img/icons/excel.svg" />
                                            </label>
                                            <button className="form-control btn-primary dbgcolor "
                                                onClick={downloadExcelAuction}
                                                style={{ width: '230px', height: '35px' }}
                                            >
                                                Auction Excel
                                            </button>
                                        </div>
                                    </div>
                                </div>


                                <div className="row">
                                    <div className="col-lg-6 col-md-6 col-sm-12 pb-3">
                                        <div className="form-label d-flex align-items-center">
                                            <label className="me-2 mt-3 mt-2">
                                                <img alt="img" src="/assets/img/icons/pdf.svg" />
                                            </label>
                                            <button className="form-control btn-primary dbgcolor "
                                                onClick={downloadPDFVyapari}
                                                style={{ width: '230px', height: '35px' }}
                                            >
                                                Vyapari PDF
                                            </button>
                                        </div>
                                    </div>

                                    <div className="col-lg-6 col-md-6 col-sm-12 ">
                                        <div className="form-label d-flex align-items-center">
                                            <label className="me-2 mt-3 mt-2">
                                                <img alt="img" src="/assets/img/icons/excel.svg" />
                                            </label>
                                            <button className="form-control btn-primary dbgcolor "
                                                onClick={downloadExcelVyapari}
                                                style={{ width: '230px', height: '35px' }}
                                            >
                                                Vyapari Excel
                                            </button>
                                        </div>
                                    </div>
                                </div>


                                <div className="row">
                                    <div className="col-lg-6 col-md-6 col-sm-12 pb-3">
                                        <div className="form-label d-flex align-items-center">
                                            <label className="me-2 mt-3 mt-2">
                                                <img alt="img" src="/assets/img/icons/pdf.svg" />
                                            </label>
                                            <button className="form-control btn-primary dbgcolor " style={{ width: '230px', height: '35px' }}>
                                                PDF
                                            </button>
                                        </div>
                                    </div>

                                    <div className="col-lg-6 col-md-6 col-sm-12 ">
                                        <div className="form-label d-flex align-items-center">
                                            <label className="me-2 mt-3 mt-2">
                                                <img alt="img" src="/assets/img/icons/excel.svg" />
                                            </label>
                                            <button className="form-control btn-primary dbgcolor " style={{ width: '230px', height: '35px' }}>
                                                Excel
                                            </button>
                                        </div>
                                    </div>
                                </div>


                                <div className="row">
                                    <div className="col-lg-6 col-md-6 col-sm-12 pb-3">
                                        <div className="form-label d-flex align-items-center">
                                            <label className="me-2 mt-3 mt-2">
                                                <img alt="img" src="/assets/img/icons/pdf.svg" />
                                            </label>
                                            <button className="form-control btn-primary dbgcolor " style={{ width: '230px', height: '35px' }}>
                                                PDF
                                            </button>
                                        </div>
                                    </div>

                                    <div className="col-lg-6 col-md-6 col-sm-12 ">
                                        <div className="form-label d-flex align-items-center">
                                            <label className="me-2 mt-3 mt-2">
                                                <img alt="img" src="/assets/img/icons/excel.svg" />
                                            </label>
                                            <button className="form-control btn-primary dbgcolor " style={{ width: '230px', height: '35px' }}>
                                                Excel
                                            </button>
                                        </div>
                                    </div>
                                </div>


                                <div className="row">
                                    <div className="col-lg-6 col-md-6 col-sm-12 pb-3">
                                        <div className="form-label d-flex align-items-center">
                                            <label className="me-2 mt-3 mt-2">
                                                <img alt="img" src="/assets/img/icons/pdf.svg" />
                                            </label>
                                            <button className="form-control btn-primary dbgcolor " style={{ width: '230px', height: '35px' }}>
                                                PDF
                                            </button>
                                        </div>
                                    </div>

                                    <div className="col-lg-6 col-md-6 col-sm-12 ">
                                        <div className="form-label d-flex align-items-center">
                                            <label className="me-2 mt-3 mt-2">
                                                <img alt="img" src="/assets/img/icons/excel.svg" />
                                            </label>
                                            <button className="form-control btn-primary dbgcolor " style={{ width: '230px', height: '35px' }}>
                                                Excel
                                            </button>
                                        </div>
                                    </div>
                                </div>


                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;

