import React from "react";
import "./Report.css"; // We'll define matching styles here

const sampleData = [
    {
        MemberName: "Ramesh Pawar",
        LoanTitle: "शेती कर्ज",
        INSTDT: "12/05/2025",
        BPAMT: 15000.0
    },
    {
        MemberName: "Sita Patil",
        LoanTitle: "घर कर्ज",
        INSTDT: "01/06/2025",
        BPAMT: 32000.0
    },
    {
        MemberName: "Vikas Jadhav",
        LoanTitle: "शिक्षण कर्ज",
        INSTDT: "25/05/2025",
        BPAMT: 10000.0
    }
];

const Samplereport = () => {
    const grandTotal = sampleData.reduce((sum, item) => sum + item.BPAMT, 0);

    return (
        <div className="report-container" style={{ padding: "20px" }}>
            <div id="idSocietyDetailsBlock">
                <div className="aCenter bold large">सामूहिक संस्था</div>
                <div className="aCenter borderBottom">
                    नोंदणी क्रमांक व दिनांक: 123456 &ensp; 07/06/2025
                </div>
            </div>


            <div id="idReportTitleBlock">
                <div className="aCenter bold medium">थकबाकी येणे यादी</div>
                <div className="aCenter">कालावधी: 01/06/2025 - 07/06/2025</div>
            </div>

            <br />

            <table className="report-table">
                <thead>
                    <tr>
                        <th style={{ width: "40%" }}>सभासदाचे नाव</th>
                        <th style={{ width: "20%" }}>कर्ज प्रकार</th>
                        <th style={{ width: "20%" }}>थकित दिनांक</th>
                        <th style={{ width: "20%" }}>येणे रक्कम</th>
                    </tr>
                </thead>
                <tbody>
                    {sampleData.map((item, index) => (
                        <tr key={index}>
                            <td>{item.MemberName}</td>
                            <td className="aRight">{item.LoanTitle}</td>
                            <td className="aCenter">{item.INSTDT}</td>
                            <td className="aRight">{item.BPAMT.toFixed(2)}</td>
                        </tr>
                    ))}
                    <tr className="tBold aRight borderTop">
                        <td></td>
                        <td></td>
                        <td>एकूण रक्कम</td>
                        <td>{grandTotal.toFixed(2)}</td>
                    </tr>
                </tbody>
            </table>

            <br />

            <div className="signature-block">
                <div className="sign-left">
                    <div className="line"></div>
                    <div className="label">सचिव</div>
                </div>
                <div className="sign-right">
                    <div className="line"></div>
                    <div className="label">चेअरमन</div>
                </div>
            </div>
        </div>
    );
};

export default Samplereport;

