import React, { useState, useEffect } from 'react';
import CountUp from "react-countup";
import { all_routes } from "../../Router/all_routes";
import "./Dashboard.css";
import { Pie } from "react-chartjs-2";
import 'react-circular-progressbar/dist/styles.css';
import { Link } from "react-router-dom";
import { ArrowRight } from "react-feather";
import axios from "axios";
import { baseUrl } from "../../core/json/custom";
import { Modal, Button } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import { FaMoneyBillWave, FaUniversity, FaFileInvoiceDollar } from 'react-icons/fa';
import 'chart.js/auto';
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import { Chart as ChartJS, CategoryScale, ArcElement, LinearScale, Tooltip, BarElement, Legend, Title } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
ChartJS.register(CategoryScale, ArcElement, BarElement, LinearScale, Tooltip, Legend, Title, ChartDataLabels); // Register everything

const Dashboard = () => {
  const [showModal, setShowModal] = useState(false);
  const [showModalvyapari, setShowModalvyapari] = useState(false);
  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);
  const handleCloseModalvyapari = () => setShowModalvyapari(false);
  const route = all_routes;
  const [selectedDate, setSelectedDate] = useState("");

  // api calling for set count total farmer and total carets  एकूण आवक(crates)एकूण शेतकरी
  const [counts, setCounts] = useState({
    totalJali: 0,
    totalFarmer: 0,
  });


  useEffect(() => {
    const fetchDashboardCounts = async () => {
      const payload = {
        "companyid": "",
        "deptid": "",
      };

      const headers = {
        "Content-Type": "application/json",
        Accept: "*/*",
      };

      try {
        const response = await axios.post(
          `${baseUrl.Url}/backend/api/GET_DashboardCount`,
          JSON.stringify(payload),
          { headers }
        );

        if (response.status !== 200) {
          throw new Error("Failed to fetch dashboard counts");
        }

        console.log("Dashboard Count Response:", response.data);
        setCounts(response.data[0]);
      } catch (error) {
        console.error("Error fetching dashboard count:", error);
      }
    };

    fetchDashboardCounts();
  }, []);


  //api calling for piechart
  const [show, setShow] = useState(null);
  const [priceData, setPriceData] = useState({
    कमालदर: { labels: [], values: [] },
    किमानदर: { labels: [], values: [] },
    सरासरीदर: { labels: [], values: [] },
  });

  const handleClose = () => setShow(null);
  const handleShow = (type) => setShow(type);

  useEffect(() => {
    const fetchData = async () => {
      const headers = {
        "Content-Type": "application/json",
        Accept: "*/*",
      };

      try {
        const response = await axios.post(
          `${baseUrl.Url}/backend/api/GET_DashBoardRateAuction`,
          {},
          { headers }
        );

        if (response.status !== 200) throw new Error("Failed to fetch data");

        const data = response.data;
        const max = data.filter(item => item.ratE_TYPE === 'MAX');
        const min = data.filter(item => item.ratE_TYPE === 'MIN');
        const avg = data.filter(item => item.ratE_TYPE === 'MID');


        setPriceData({
          कमालदर: {
            labels: max.map(item => item.itemnm),
            values: max.map(item => item.rate),
          },
          किमानदर: {
            labels: min.map(item => item.itemnm),
            values: min.map(item => item.rate),
          },
          सरासरीदर: {
            labels: avg.map(item => item.itemnm),
            values: avg.map(item => item.rate),
          },
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);


  const getPieData = (type) => {
    if (!type || !priceData[type]) return { labels: [], datasets: [] };

    const { labels, values } = priceData[type];

    const seen = new Set();
    const filteredLabels = [];
    const filteredValues = [];

    labels.forEach((label, index) => {
      const key = label;
      if (!seen.has(key)) {
        seen.add(key);
        filteredLabels.push(label);
        filteredValues.push(values[index]);
      }
    });


    return {
      labels: filteredLabels,
      datasets: [
        {
          data: filteredValues,
          backgroundColor: [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
            '#F7464A', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          color: '#000',
          font: {
            size: 14,
            weight: 'bold',
          },
        },
      },

      datalabels: {
        color: 'black',
        display: function (context) {
          const value = context.dataset.data[context.dataIndex];
          const total = context.dataset.data.reduce((a, b) => a + b, 0);
          const percentage = (value / total) * 100;
          return percentage > 3;
        },
        formatter: function (value, context) {
          const label = context.chart.data.labels[context.dataIndex];
          return `${label}\n₹${value}`;
        },
        font: {
          size: 12,
          weight: 'bold'
        },
        clamp: true,
        clip: true,
      },

      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.label || '';
            let value = context.parsed || 0;
            return `${label}: ₹${value}`;
          },
        },
      },
    },
  };


  //get data आजची खरेदी  from AuctionShed
  const [totalAmountSum, setTotalAmountSum] = useState(0);
  const [totalJaliSum, setTotalJaliSum] = useState(0);
  const [itemCount, setItemCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const today = new Date().toISOString().split("T")[0];

      const payload = {
        apkid: "%",
        keyword: "%",
        companyid: "COMP123456789",
        deptid: "D001",
        date: today,
      };

      const headers = {
        "Content-Type": "application/json",
        Accept: "*/*",
      };

      try {
        const response = await axios.post(
          `${baseUrl.Url}/backend/api/GET_AUCTIONSHED`,
          JSON.stringify(payload),
          { headers }
        );

        if (response.status !== 200) {
          throw new Error("Failed to fetch data");
        }

        const data = response.data || [];
        const totalAmount = data.reduce((acc, item) => acc + (parseFloat(item.totalamount) || 0), 0);
        const totalJali = data.reduce((acc, item) => acc + (parseFloat(item.totaljali) || 0), 0);

        setItemCount(data.length);
        setTotalAmountSum(totalAmount);
        setTotalJaliSum(totalJali);
      } catch (error) {
        setTotalAmountSum(0);
        setTotalJaliSum(0);
        setItemCount(0);
      }
    };

    fetchData();
  }, [selectedDate]);

  //Graph data
  const colorPalette = ['#7c89d8', '#0d6efd', '#28a745', '#ff6347'];
  const [view, setView] = useState('weekly');
  const [weekStartDate, setWeekStartDate] = useState('');
  const [selectedYear, setSelectedYear] = useState('2025');
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });


  const getWeekLabels = (startDate) =>
    Array.from({ length: 7 }, (_, i) =>
      moment(startDate).add(i, 'days').format('YYYY-MM-DD')
    );


  const getMonthLabels = () =>
    Array.from({ length: 12 }, (_, i) => moment().month(i).format('MMM'));


  const groupWeeklyData = (apiData, labels) => {
    const crops = [...new Set(apiData.map((item) => item.crop_label))];

    const datasets = crops
      .map((crop, index) => {
        const cropData = labels.map((date) => {
          const found = apiData.find(
            (item) =>
              moment(item.entry_date).format('YYYY-MM-DD') === date &&
              item.crop_label === crop
          );
          return found ? found.total_carets : 0;
        });

        if (cropData.every((value) => value === 0)) return null;

        return {
          label: crop,
          data: cropData,
          backgroundColor: colorPalette[index % colorPalette.length],
          barThickness: 15,
        };
      })
      .filter(Boolean);

    return { labels, datasets };
  };

  const groupMonthlyData = (apiData, labels) => {
    const normalizedData = apiData.map((item) => ({
      ...item,
      month_name: moment().month(item.month_value - 1).format('MMM'),
    }));

    const crops = [...new Set(normalizedData.map((item) => item.crop_label))];

    const datasets = crops
      .map((crop, index) => {
        const cropData = labels.map((month) => {
          const found = normalizedData.find(
            (item) =>
              item.crop_label === crop &&
              item.month_name.toLowerCase() === month.toLowerCase()
          );
          return found ? found.monthly_count : 0;
        });

        if (cropData.every((value) => value === 0)) return null;

        return {
          label: crop,
          data: cropData,
          backgroundColor: colorPalette[index % colorPalette.length],
          barThickness: 20,
        };
      })
      .filter(Boolean);

    return { labels, datasets };
  };

  const fetchWeeklyData = async (startDate) => {
    const endDate = moment(startDate).add(6, 'days').format('YYYY-MM-DD');
    const payload = { startDate, endDate };

    try {
      const response = await axios.post(
        `${baseUrl.Url}/backend/api/GET_CropWeekData`,
        JSON.stringify(payload),
        { headers: { 'Content-Type': 'application/json' } }
      );
      const labels = getWeekLabels(startDate);
      const data = groupWeeklyData(response.data || [], labels);
      setChartData(data);
      setWeekStartDate(startDate);
    } catch (error) {
      console.error('❌ Weekly Data Error:', error);
    }
  };

  const fetchMonthlyData = async () => {
    const payload = { month: '5', year: parseInt(selectedYear) };

    try {
      const response = await axios.post(
        `${baseUrl.Url}/backend/api/GET_CropMonthData`,
        JSON.stringify(payload),
        { headers: { 'Content-Type': 'application/json' } }
      );
      const labels = getMonthLabels();
      const data = groupMonthlyData(response.data || [], labels);
      setChartData(data);
    } catch (error) {
      console.error('❌ Monthly Data Error:', error);
    }
  };


  useEffect(() => {
    const currentMonday = moment().startOf('isoWeek').format('YYYY-MM-DD');
    fetchWeeklyData(currentMonday);
  }, []);


  useEffect(() => {
    if (view === 'monthly') {
      fetchMonthlyData();
    }
  }, [view, selectedYear]);


  const barOptions = {
    responsive: true,
    maintainAspectRatio: false, // 👈 important for mobile height fit
    plugins: {
      legend: { position: 'top' },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (tooltipItem) => {
            const label = tooltipItem.dataset.label || '';
            const value = tooltipItem.raw;
            return `${label}: ${value}`;
          },
        },
      },
      datalabels: {
        display: false,
      },
    },
    scales: {
      y: { beginAtZero: true, ticks: { display: true } },
      x: { ticks: { display: true }, grid: { display: false } },
    },
    categoryPercentage: 0.7,
    barPercentage: 0.5,
    grouped: true,
  };


  //get data Cashier Balance
  const [cashierBalance, setCashierBalance] = useState(0);

  useEffect(() => {
    const getCashierBalance = async () => {
      const payload = {};

      const headers = {
        "Content-Type": "application/json",
        Accept: "*/*",
      };

      const fullUrl = `${baseUrl.Url}/backend/api/GET_Cashier_Balance`;
      console.log("API Full URL =>", fullUrl);

      try {
        const response = await axios.post(fullUrl, payload, { headers });

        console.log("API Raw Response:", response);

        if (response.status === 200 && response.data && response.data[0]) {
          console.log("Cashier Balance =>", response.data[0].cashierBalance);
          setCashierBalance(response.data[0].cashierBalance);
        } else {
          console.warn("⚠️ Unexpected API response format:", response.data);
        }
      } catch (error) {

        if (error.response) {
          console.log("📄 Response Error Data:", error.response.data);
          console.log("🔢 Status Code:", error.response.status);
        }
      }
    };

    getCashierBalance();
  }, []);



  const tableData = [
    { name: "Ganesh Agencies", limit: "₹15,000", used: "15666", status: "Pending" },
    { name: "Yash Agro", limit: "₹18,000", used: "5678", status: "Paid" },
    { name: "Om Traders", limit: "₹10,000", used: "4566", status: "Pending" },
    { name: "Nirmal Seeds", limit: "₹12,000", used: "44567", status: "Paid" },
    { name: "Krushi Udyog", limit: "₹20,000", used: "56788", status: "Pending" },
    { name: "Ganesh Agencies", limit: "₹15,000", used: "13455", status: "Pending" },
    { name: "Yash Agro", limit: "₹18,000", used: "3456", status: "Paid" },
    { name: "Om Traders", limit: "₹10,000", used: "3456", status: "Pending" },
    { name: "Nirmal Seeds", limit: "₹12,000", used: "456567", status: "Paid" },
    { name: "Krushi Udyog", limit: "₹20,000", used: "14567", status: "Pending" }
  ];

  //api calling for top farmer based on carets(Top Farmers)

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredCrateFarmers, setFilteredCrateFarmers] = useState([]);
  const [filteredTopPriceFarmers, setFilteredTopPriceFarmers] = useState([]);
  const [topCrateFarmers, setTopCrateFarmers] = useState([]);
  const [topPriceFarmers, setTopPriceFarmers] = useState([]);

  const today = new Date().toISOString().split("T")[0];

  const headers = {
    "Content-Type": "application/json",
    Accept: "*/*",
  };

  const fetchInitialData = async () => {
    const payload = {
      dpkid: "%",
      keyword: "%",
      companyid: "",
      deptid: "",
      fromdate: today,
      todate: today,
    };

    const pricePayload = {
      apkid: "%",
      fromdate: today,
      todate: today,
    };

    try {
      const crateResponse = await axios.post(

        `${baseUrl.Url}/backend/api/GET_TopFarmerOnCrates`,
        JSON.stringify(payload),
        { headers }

      );
      if (crateResponse.status === 200) {
        const sorted = crateResponse.data.sort(
          (a, b) => Number(b.caretS_COUNT) - Number(a.caretS_COUNT)
        );
        setTopCrateFarmers(sorted);
      }


      const priceResponse = await axios.post(

        `${baseUrl.Url}/backend/api/GET_TopfarmerOnPrice`,
        JSON.stringify(pricePayload),
        { headers }
      );
      if (priceResponse.status === 200) {
        const sorted = priceResponse.data
          .map((item) => ({
            fname: item.fname,
            highestPrice: item.totalamount,
          }))
          .sort((a, b) => Number(b.highestPrice) - Number(a.highestPrice));
        setTopPriceFarmers(sorted);
      }
    } catch (error) {
      console.error("Initial fetch error", error);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);


  const handleDateFilter = async () => {
    if (!startDate || !endDate) {
      alert("Please select both start and end dates.");
      return;
    }

    const cratePayload = {
      dpkid: "%",
      keyword: "%",
      companyid: "",
      deptid: "",
      fromdate: startDate,
      todate: endDate,
    };

    const pricePayload = {
      apkid: "%",
      fromdate: startDate,
      todate: endDate,
    };

    try {
      const crateResponse = await axios.post(
        `${baseUrl.Url}/backend/api/GET_TopFarmerOnCrates`,
        JSON.stringify(cratePayload),
        { headers }
      );

      if (crateResponse.status === 200) {
        const sortedCrates = crateResponse.data.sort(
          (a, b) => Number(b.caretS_COUNT) - Number(a.caretS_COUNT)
        );
        setFilteredCrateFarmers(sortedCrates || []);
      }

      const priceResponse = await axios.post(
        `${baseUrl.Url}/backend/api/GET_TopfarmerOnPrice`,
        JSON.stringify(pricePayload),
        { headers }
      );

      if (priceResponse.status === 200) {
        const priceData = priceResponse.data.map((item) => ({
          fname: item.fname,
          highestPrice: item.totalamount,
        }));

        const sortedPrices = priceData.sort(
          (a, b) => Number(b.highestPrice) - Number(a.highestPrice)
        );

        setFilteredTopPriceFarmers(sortedPrices || []);
      }
    } catch (error) {
      console.error("Error fetching filtered data", error);
    }
  };


  //Top Farmer and Top vayapri based on date
  const currentDate = new Date().toLocaleDateString('en-IN');
  const [todayDate, setTodayDate] = useState('');

  useEffect(() => {
    const today = new Date();
    const formatted = today.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    setTodayDate(formatted);
  }, []);

  const [expenses, setExpenses] = useState({
    daily: 12345,
    total: 12344,
    profitToday: 1000,
    totalProfit: 50000
  });


  //get datta top vyapari on carets and price
  const [vyapariStartDate, setVyapariStartDate] = useState("");
  const [vyapariEndDate, setVyapariEndDate] = useState("");
  const [crateVyapari, setCrateVyapari] = useState([]);
  const [topPriceVyapari, setTopPriceVyapari] = useState([]);


  const top4Crates = crateVyapari.slice(0, 4);
  const top4Prices = topPriceVyapari.slice(0, 4);


  const fetchVyapariData = async (from = "", to = "") => {
    const payload = {
      vbkid: "%",
      keyword: "%",
      companyid: "",
      deptid: "",
      fromdate: "1 may 2025",
      todate: "18 may 2025",
    };

    const headers = {
      "Content-Type": "application/json",
      Accept: "*/*",
    };

    try {
      const response = await axios.post(
        `${baseUrl.Url}/backend/api/GET_TopVyapariOnCrates`,
        JSON.stringify(payload),
        { headers }
      );

      if (response.status !== 200) throw new Error("Failed to fetch data");

      const data = response.data || [];

      const sortedCrates = [...data].sort((a, b) => b.totaljaali - a.totaljaali);
      const sortedPrices = [...data].sort((a, b) => parseFloat(b.totalamount) - parseFloat(a.totalamount));

      setCrateVyapari(sortedCrates);
      setTopPriceVyapari(sortedPrices);
    } catch (error) {
      console.error("Error fetching vyapari data", error);

    }
  };


  // Load default today's data (initially from/to empty)
  useEffect(() => {
    fetchVyapariData();
  }, []);

  const handleVyapariDateFilter = () => {
    if (!vyapariStartDate || !vyapariEndDate) {
      alert("Please select both start and end dates.");
      return;
    }
    fetchVyapariData(vyapariStartDate, vyapariEndDate);
  };


  return (

    <div style={{
      backgroundColor: 'rgb(124, 138, 138)',
      padding: '2rem',
      minHeight: '100vh',
    }}>
      <div
        className="content"
      >
        <div className="container-fluid">

          <div className="row mt-5">
            <div className="col-md-3 col-sm-6 d-flex">
              <div className="dash-widget compact-card card-blue w-100 d-flex align-items-center justify-content-center" style={{ height: "100px", borderRadius: "10px" }}>
                <div className="text-center">
                  <h5 className="text-black" style={{ fontSize: "20px" }}>
                    <CountUp start={0} end={counts.totalJali} duration={3} />
                  </h5>
                  <h6 className="text-black" style={{ fontSize: "15px" }}>
                    एकूण आवक(crates)
                  </h6>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="col-md-3 col-sm-6 d-flex">
              <div className="dash-widget compact-card card-green w-100 d-flex align-items-center justify-content-center" style={{ height: "100px", borderRadius: "10px" }}>
                <div className="text-center">
                  <h5 className="text-black" style={{ fontSize: "20px" }}>
                    <CountUp start={0} end={counts.totalFarmer} duration={3} />
                  </h5>
                  <h6 className="text-black" style={{ fontSize: "15px" }}>
                    एकूण शेतकरी
                  </h6>
                </div>
              </div>
            </div>



            <div className="col-md-6 col-sm-12">
              <div
                className="card p-3 shadow-sm"
                style={{
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #43cea2 0%,rgb(72, 139, 206) 100%)',
                  color: 'rgb(15, 23, 42)',
                  minHeight: '100px',
                }}
              >
                <div className="row text-center align-items-center">
                  <div className="col-4 border-end border-dark-subtle">
                    <p className="fw-semibold mb-1" style={{ fontSize: '16px' }}>कमाल दर</p>
                    <Button variant="dark" size="sm" onClick={() => handleShow('कमालदर')}>
                      View Chart
                    </Button>
                  </div>
                  <div className="col-4 border-end border-dark-subtle">
                    <p className="fw-semibold mb-1" style={{ fontSize: '16px' }}>किमान दर</p>
                    <Button variant="dark" size="sm" onClick={() => handleShow('किमानदर')}>
                      View Chart
                    </Button>
                  </div>

                  <div className="col-4">
                    <p className="fw-semibold mb-1" style={{ fontSize: '16px' }}>सरासरी दर</p>
                    <Button variant="dark" size="sm" onClick={() => handleShow('सरासरीदर')}>
                      View Chart
                    </Button>
                  </div>
                </div>
              </div>


              <Modal
                show={!!show}
                onHide={handleClose}
                centered
                dialogClassName="custom-modal-width"
              >
                <Modal.Header closeButton>
                  <Modal.Title className="fs-4 text-uppercase fw-bold text-center w-100">
                    {show}
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div className="d-flex justify-content-center align-items-center mb-3" style={{ height: '300px' }}>
                    {show && (
                      <Pie
                        data={getPieData(show)}
                        options={pieOptions}
                        plugins={[ChartDataLabels]}
                      />
                    )}
                  </div>
                </Modal.Body>
              </Modal>
            </div>
          </div>

          <div
            className="p-3 d-flex justify-content-center"
            style={{
              background: "linear-gradient(135deg, #f3f4f6,rgb(182, 212, 164))",
              borderRadius: "13px",
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
              height: "auto",
            }}
          >
            <div
              className="d-flex flex-wrap justify-content-center gap-5"
              style={{ maxWidth: "1200px", width: "100%" }}
            >
              {/* Card 1 */}
              <div
                style={{
                  // background: "#fb6340",
                  background: "#FF8243",
                  borderRadius: "12px",
                  padding: "12px",
                  flex: "1 1 220px",
                  color: "#ffffff",
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
                  height: "100px",
                  maxWidth: "250px",
                }}
              >
                <p className="fw-semibold mb-1" style={{ fontSize: "16px", color: "black" }}>
                  आजची खरेदी
                </p>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontSize: "15px", fontWeight: "bold" }}>जाळी</p>
                    <h5 style={{ fontSize: "16px", fontWeight: "bold", margin: 0 }}>
                      <CountUp start={0} end={totalJaliSum} duration={2} />
                    </h5>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontSize: "15px", fontWeight: "bold" }}>रक्कम</p>
                    <h5 style={{ fontSize: "16px", fontWeight: "bold", margin: 0 }}>
                      ₹<CountUp start={0} end={totalAmountSum} duration={2} />
                    </h5>
                  </div>
                </div>
              </div>

              {/* Card 2 */}
              <div
                style={{
                  // background: "#f5365c",
                  background: "#c95a72",
                  borderRadius: "12px",
                  padding: "12px",
                  flex: "1 1 220px",
                  color: "#ffffff",
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
                  height: "100px",
                  maxWidth: "250px",
                }}
              >
                <p className="fw-semibold mb-1" style={{ fontSize: "16px", color: "black" }}>
                  एकूण खरेदी
                </p>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontSize: "15px", fontWeight: "bold" }}>जाळी</p>
                    <h5 style={{ fontSize: "16px", fontWeight: "bold", margin: 0 }}>
                      <CountUp start={0} end={7000} duration={2} />
                    </h5>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontSize: "15px", fontWeight: "bold" }}>रक्कम</p>
                    <h5 style={{ fontSize: "16px", fontWeight: "bold", margin: 0 }}>
                      ₹<CountUp start={0} end={7000} duration={2} />
                    </h5>
                  </div>
                </div>
              </div>

              {/* Card 3 */}
              <div
                style={{
                  background: "#5e72e4",
                  borderRadius: "12px",
                  padding: "20px",
                  flex: "1 1 220px",
                  color: "#ffffff",
                  textAlign: "center",
                  height: "100px",
                  maxWidth: "250px",
                }}
              >
                <p className="fw-semibold mb-1" style={{ fontSize: "15px", color: "black" }}>
                  आजचे उत्पन्न
                </p>
                <h4 style={{ fontSize: "22px", fontWeight: "bold" }}>
                  ₹<CountUp start={0} end={2150} duration={2} />
                </h4>
              </div>

              {/* Card 4 */}
              <div
                style={{
                  background: "#2dce89",
                  borderRadius: "12px",
                  padding: "20px",
                  flex: "1 1 220px",
                  color: "#ffffff",
                  textAlign: "center",
                  height: "100px",
                  maxWidth: "250px",
                }}
              >
                <p className="fw-semibold mb-1" style={{ fontSize: "15px", color: "black" }}>
                  आज अखेर उत्पन्न
                </p>
                <h4 style={{ fontSize: "22px", fontWeight: "bold" }}>
                  ₹<CountUp start={0} end={3500} duration={2} />
                </h4>
              </div>
            </div>
          </div>

          <div className="row mt-4">
            <div className="col-12 col-md-8">
              <div className="col-12 mx-auto">
                <div className="card p-3 p-md-4 shadow rounded-4">
                  <h4 className="text-center mb-4">📊 Crop Data Analysis</h4>

                  <div className="row justify-content-center mb-3 g-2">
                    <div className="col-12 col-sm-6 col-md-5">
                      <select
                        className="form-select form-select-sm py-0"
                        value={view}
                        onChange={(e) => setView(e.target.value)}
                      >
                        <option value="weekly">Weekly View</option>
                        <option value="monthly">Monthly View</option>
                      </select>
                    </div>

                    {view === 'weekly' && (
                      <div className="col-12 col-sm-6 col-md-5">
                        <input
                          type="date"
                          className="form-control form-control-sm"
                          value={weekStartDate}
                          onChange={(e) => fetchWeeklyData(e.target.value)}
                        />
                      </div>
                    )}

                    {view === 'monthly' && (
                      <div className="col-12 col-sm-6 col-md-5">
                        <select
                          className="form-select form-select-sm py-0"
                          value={selectedYear}
                          onChange={(e) => setSelectedYear(e.target.value)}
                        >
                          <option value="2023">2023</option>
                          <option value="2024">2024</option>
                          <option value="2025">2025</option>
                        </select>
                      </div>
                    )}
                  </div>

                  <div style={{ height: '280px', minHeight: '220px' }}>
                    <Bar data={chartData} options={barOptions} />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div
                className="p-4"
                style={{
                  background: "linear-gradient(145deg, #f8f9fa, rgb(117, 138, 221))",
                  borderRadius: "20px",
                  boxShadow: "0 8px 25px rgba(0, 0, 0, 0.1)",
                  border: "1px solid #e0e0e0",
                  color: "#333",
                  fontFamily: "'Segoe UI', sans-serif",
                  minHeight: "420px",
                }}
              >
                <h6
                  className="text-center mb-2"
                  style={{
                    fontWeight: "600",
                    color: "#2c3e50",
                    borderBottom: "3px solid #e74c3c",
                    paddingBottom: "5px",
                  }}
                >
                  💼 Daily Business Summary
                </h6>
                <div
                  className="text-center mb-4"
                  style={{
                    fontSize: "0.9rem",
                    color: "#2c3e50",
                  }}
                >
                </div>
                <div
                  style={{
                    background: "#ffffff",
                    borderRadius: "12px",
                    padding: "15px",
                    boxShadow: "inset 0 0 5px rgba(0,0,0,0.05)",
                    minHeight: "320px",
                  }}
                >
                  <div className="mb-4 d-flex justify-content-between">
                    <span style={{ fontSize: "15px" }}>👨‍💼 व्यापारी येणे :</span>
                    <span style={{ fontWeight: "600" }}>₹25,000</span>
                  </div>

                  <div className="mb-4 d-flex justify-content-between">
                    <span style={{ fontSize: "15px" }}>🏦 बँकेतील शिल्लक :</span>
                    <span style={{ fontWeight: "600" }}>₹5,000</span>
                  </div>

                  <div className="mb-4 d-flex justify-content-between">
                    <span style={{ fontSize: "15px" }}>👨‍🌾 शेतकरी देणे:</span>
                    <span style={{ fontWeight: "600" }}>₹10,000</span>
                  </div>
                  <div
                    className="text-center my-3"
                    style={{
                      fontWeight: "600",
                      fontSize: "1rem",
                      color: "#2c3e50",
                      borderTop: "2px dashed #2c3e50",
                      paddingTop: "10px",
                    }}
                  >
                    <span style={{ color: "#2980b9" }}>
                      ₹25,000 + ₹5,000 – ₹10,000
                    </span>
                  </div>

                  <div
                    className="text-center p-3 mb-3"
                    style={{
                      background: "#ecf0f1",
                      borderRadius: "10px",
                      fontWeight: "bold",
                      fontSize: "15px",
                      borderTop: "3px solid #27ae60",
                    }}
                  >
                    अंतिम रक्कम : <span style={{ color: "#27ae60" }}>₹20,000</span>
                  </div>
                </div>
              </div>
            </div>


            {/* Left Table - Vyapari Limit Balance */}
            <div className="col-md-6 mt-2">
              <div className="card border-0 shadow">
                <div className="card-header d-flex justify-content-between align-items-center bg-primary-subtle text-white">

                  <p className="fw-semibold mb-1" style={{ fontSize: '15px', color: 'black' }}>
                    व्यापारी मर्यादा शिल्लक(Limit)
                  </p>
                </div>

                <div className="card-body">
                  <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
                    <table className="table table-hover text-center">
                      <thead style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: '#f8f9fa' }}>
                        <tr>
                          <th>Name</th>
                          <th>Limit</th>
                          <th>Used</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>

                        {tableData.map((row, index) => (
                          <tr key={index}>
                            <td>{row.name}</td>
                            <td>{row.limit}</td>
                            <td>{row.used}</td>
                            <td>
                              <span
                                className={`badge ${row.status === "Pending" ? "bg-warning" : "bg-success"}`}
                              >
                                {row.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>


            {/* Right Table - Udhari Yadi */}
            <div className="col-md-6 mt-2">
              <div className="card border-0 shadow">
                <div className="card-header d-flex justify-content-between align-items-center bg-primary-subtle text-white">
                  <p className="fw-semibold mb-1" style={{ fontSize: '15px', color: 'black' }}>
                    उधारी यादी
                  </p>
                </div>


                <div className="card-body">
                  <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
                    <table className="table table-hover text-center">
                      <thead style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: '#f8f9fa' }}>
                        <tr>
                          <th>Name</th>
                          <th>Limit</th>
                          <th>Used</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>

                        {tableData.map((row, index) => (
                          <tr key={index}>
                            <td>{row.name}</td>
                            <td>{row.limit}</td>
                            <td>{row.used}</td>
                            <td>
                              <span
                                className={`badge ${row.status === "Pending" ? "bg-warning" : "bg-success"}`}
                              >
                                {row.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>


          <div className="row">
            <div className="col-md-4">
              {/* Cashier Balance Card */}
              <div
                className="p-3 rounded-4 shadow-sm text-center text-white mb-3"
                style={{
                  background: "linear-gradient(135deg, #00796B 0%, #26A69A 100%)",
                  minHeight: "90px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <FaMoneyBillWave size={20} className="mb-1 mx-auto" />
                <div>
                  <small style={{ fontSize: "16px", fontWeight: "500" }}>
                    Cashier Balance
                  </small>
                </div>
                <div className="fw-bold">
                  ₹<CountUp start={0} end={cashierBalance} duration={2} />
                </div>
              </div>


              {/* Bank Balance Card */}
              <div
                className="p-3 rounded-4 shadow-sm text-center text-white mb-3"
                style={{
                  background: 'linear-gradient(135deg, #8E2DE2 0%,rgb(105, 77, 161) 100%)',
                  minHeight: '90px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <FaUniversity size={20} className="mb-1 mx-auto" />
                <div>
                  <small style={{ fontSize: '16px', fontWeight: '500' }}>Bank Balance</small>
                </div>
                <div className="fw-bold">₹<CountUp end={125000} /></div>
              </div>

              {/* Check Bill Card */}
              <div
                className="p-3 rounded-4 shadow-sm text-center text-white"
                role="button"
                data-bs-toggle="modal"
                data-bs-target="#checkBillModal"
                style={{
                  background: 'linear-gradient(135deg,rgb(206, 129, 35) 0%,rgb(212, 134, 38) 100%)',
                  minHeight: '90px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <FaFileInvoiceDollar size={20} className="mb-1 mx-auto" />
                <div><small>Check Bill</small></div>
                <div className="fw-bold">₹<CountUp end={125000} /></div>
              </div>



              <div
                className="modal fade"
                id="checkBillModal"
                tabIndex="-1"
                aria-labelledby="checkBillModalLabel"
                aria-hidden="true"
              >
                <div className="modal-dialog modal-lg modal-dialog-centered">
                  <div className="modal-content">
                    <div className="modal-header bg-primary text-white">
                      <h5 className="modal-title" id="checkBillModalLabel">Check Bill Details</h5>
                      <button
                        type="button"
                        className="btn-close btn-close-white"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      ></button>
                    </div>
                    <div className="modal-body">
                      <h6 className="text-center mb-3">आजची तारीख: {currentDate}</h6>
                      <table className="table table-bordered table-hover">
                        <thead className="table-primary">
                          <tr>
                            <th>Farmer Name</th>
                            <th>Bank Name</th>
                            <th>Check Date</th>
                            <th>Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>Ramesh Patil</td>
                            <td>SBI</td>
                            <td>{currentDate}</td>
                            <td>123567</td>
                          </tr>
                          <tr>
                            <td>Suresh Jadhav</td>
                            <td>HDFC</td>
                            <td>{currentDate}</td>
                            <td>24567</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xl-4 col-lg-12 col-md-12 mb-4 mt-2">
              <div className="card h-100">
                <div className="card-header d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
                  <h4 className="card-title mb-2 mb-md-0">Top Farmers</h4>
                  <Button variant="link" className="p-0" onClick={handleShowModal}>
                    View All <ArrowRight className="feather-16 ms-1" />
                  </Button>
                </div>

                <div className="card-body">
                  <div className="nav nav-tabs w-100 overflow-auto flex-nowrap mb-3" id="farmerTabs" role="tablist">
                    <li className="nav-item flex-fill me-2" role="presentation">
                      <button className="nav-link active w-100 btn btn-outline-primary py-2" data-bs-toggle="tab" data-bs-target="#crates" type="button">
                        Crates
                      </button>
                    </li>
                    <li className="nav-item flex-fill" role="presentation">
                      <button className="nav-link w-100 btn btn-outline-success py-2" data-bs-toggle="tab" data-bs-target="#price" type="button">
                        Highest Price
                      </button>
                    </li>
                  </div>

                  <div className="tab-content mt-3">
                    <div className="tab-pane fade show active" id="crates">
                      <div className="table-responsive">
                        <table className="table table-sm table-bordered">
                          <thead className="table-light">
                            <tr>
                              <th>No</th>
                              <th>Farmer</th>
                              <th>No. of Crates</th>
                            </tr>
                          </thead>
                          <tbody>
                            {topCrateFarmers.slice(0, 4).map((item, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item.fullname}</td>
                                <td>{item.caretS_COUNT}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="tab-pane fade" id="price">
                      <div className="table-responsive">
                        <table className="table table-sm table-bordered">
                          <thead className="table-light">
                            <tr>
                              <th>No</th>
                              <th>Farmer</th>
                              <th>Highest Price</th>
                            </tr>
                          </thead>
                          <tbody>
                            {topPriceFarmers.slice(0, 4).map((item, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item.fname}</td>
                                <td>{item.highestPrice}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>


                <Modal show={showModal} onHide={handleCloseModal} size="lg">
                  <Modal.Header closeButton>
                    <Modal.Title>All Farmer Data</Modal.Title>
                  </Modal.Header>
                  <Modal.Body style={{ maxHeight: "500px", overflowY: "auto" }}>
                    <div className="d-flex flex-column flex-md-row justify-content-center gap-2 flex-wrap mb-3">
                      <div>
                        <label>From</label>
                        <input
                          type="date"
                          className="form-control form-control-sm"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                        />
                      </div>
                      <div>
                        <label>To</label>
                        <input
                          type="date"
                          className="form-control form-control-sm"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                        />
                      </div>
                      <div className="align-self-end">
                        <button className="btn btn-sm btn-dark px-3" onClick={handleDateFilter}>
                          Filter
                        </button>
                      </div>
                    </div>

                    <ul className="nav nav-tabs w-100 mb-3 overflow-auto flex-nowrap">
                      <li className="nav-item flex-fill me-2">
                        <button className="nav-link active w-100 btn btn-outline-primary" data-bs-toggle="tab" data-bs-target="#crates-modal">
                          Crates
                        </button>
                      </li>
                      <li className="nav-item flex-fill">
                        <button className="nav-link w-100 btn btn-outline-success" data-bs-toggle="tab" data-bs-target="#price-modal">
                          Highest Price
                        </button>
                      </li>
                    </ul>

                    <div className="tab-content">
                      <div className="tab-pane fade show active" id="crates-modal">
                        <div className="table-responsive">
                          <table className="table table-sm table-bordered">
                            <thead className="table-light">
                              <tr>
                                <th>No</th>
                                <th>Farmer</th>
                                <th>No. of Crates</th>
                              </tr>
                            </thead>
                            <tbody>
                              {filteredCrateFarmers.map((item, index) => (
                                <tr key={index}>
                                  <td>{index + 1}</td>
                                  <td>{item.fullname}</td>
                                  <td>{item.caretS_COUNT}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div className="tab-pane fade" id="price-modal">
                        <div className="table-responsive">
                          <table className="table table-sm table-bordered">
                            <thead className="table-light">
                              <tr>
                                <th>No</th>
                                <th>Farmer</th>
                                <th>Highest Price</th>
                              </tr>
                            </thead>
                            <tbody>
                              {filteredTopPriceFarmers.map((item, index) => (
                                <tr key={index}>
                                  <td>{index + 1}</td>
                                  <td>{item.fname}</td>
                                  <td>{item.highestPrice}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </Modal.Body>
                </Modal>
              </div>

            </div>


            <div className="col-xl-4 col-lg-12 col-md-12 mb-4">
              <div className="card h-100">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h4 className="card-title mb-0">Top Vyapari</h4>
                  <Link
                    to="#"
                    className="btn btn-link p-0"
                    onClick={() => setShowModalvyapari(true)}
                  >
                    View All <ArrowRight className="feather-16 ms-1" />
                  </Link>
                </div>

                <div className="card-body">
                  <ul className="nav nav-tabs w-100" id="vayapariTabs" role="tablist">
                    <li className="nav-item flex-fill" role="presentation">
                      <button
                        className="nav-link active w-100 btn btn-outline-primary py-2"
                        id="crates-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#vayapari-crates"
                        type="button"
                        role="tab"
                      >
                        Crates
                      </button>
                    </li>
                    <li className="nav-item flex-fill" role="presentation">
                      <button
                        className="nav-link w-100 btn btn-outline-success py-2"
                        id="price-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#vayapari-price"
                        type="button"
                        role="tab"
                      >
                        Highest Price
                      </button>
                    </li>
                  </ul>

                  <div className="mt-4 tab-content" id="vayapariTabsContent">
                    <div className="tab-pane fade show active" id="vayapari-crates" role="tabpanel">
                      <table className="table table-sm table-bordered">
                        <thead className="table-light">
                          <tr>
                            <th>#</th>
                            <th>Vyapari</th>
                            <th>No. of Crates</th>
                          </tr>
                        </thead>
                        <tbody>
                          {top4Crates.map((item, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{item.vshortname}</td>
                              <td>{item.totaljaali}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="tab-pane fade" id="vayapari-price" role="tabpanel">
                      <table className="table table-sm table-bordered">
                        <thead className="table-light">
                          <tr>
                            <th>#</th>
                            <th>Vyapari</th>
                            <th>Highest Price</th>
                          </tr>
                        </thead>
                        <tbody>
                          {top4Prices.map((item, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{item.vshortname}</td>
                              <td>{item.totalamount}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal */}
              <Modal show={showModalvyapari} onHide={handleCloseModalvyapari} size="lg">
                <Modal.Header closeButton>
                  <Modal.Title>All Vyapari Data</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ maxHeight: "500px", overflowY: "auto" }}>
                  <div className="d-flex justify-content-center align-items-end gap-2 my-2 flex-wrap">
                    <div>
                      <label className="form-label mb-1">From</label>
                      <input
                        type="date"
                        className="form-control form-control-sm"
                        value={vyapariStartDate}
                        onChange={(e) => setVyapariStartDate(e.target.value)}
                        style={{ minWidth: "140px" }}
                      />
                    </div>

                    <div>
                      <label className="form-label mb-1">To</label>
                      <input
                        type="date"
                        className="form-control form-control-sm"
                        value={vyapariEndDate}
                        onChange={(e) => setVyapariEndDate(e.target.value)}
                        style={{ minWidth: "140px" }}
                      />
                    </div>

                    <div className="align-self-end">
                      <button
                        className="btn btn-sm btn-dark px-3 py-1"
                        onClick={handleVyapariDateFilter}
                      >
                        Filter
                      </button>
                    </div>
                  </div>

                  <ul className="nav nav-tabs w-100 my-2" id="vyapariTabs" role="tablist">
                    <li className="nav-item flex-fill" role="presentation">
                      <button
                        className="nav-link active w-100 btn btn-outline-primary py-1"
                        id="crates-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#crates-modal"
                        type="button"
                        role="tab"
                      >
                        Crates
                      </button>
                    </li>
                    <li className="nav-item flex-fill" role="presentation">
                      <button
                        className="nav-link w-100 btn btn-outline-success py-1"
                        id="price-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#price-modal"
                        type="button"
                        role="tab"
                      >
                        Highest Price
                      </button>
                    </li>
                  </ul>

                  <div className="tab-content mt-4" id="vyapariTabsContent">
                    <div className="tab-pane fade show active" id="crates-modal" role="tabpanel">
                      <div className="table-responsive" style={{ maxHeight: "300px", overflowY: "auto" }}>
                        <table className="table table-sm table-bordered">
                          <thead className="table-light" style={{ position: "sticky", top: 0, zIndex: 1 }}>
                            <tr>
                              <th>No</th>
                              <th>Vyapari</th>
                              <th>No. of Crates</th>
                            </tr>
                          </thead>
                          <tbody>
                            {crateVyapari.map((item, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item.vshortname}</td>
                                <td>{item.totaljaali}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="tab-pane fade" id="price-modal" role="tabpanel">
                      <div className="table-responsive" style={{ maxHeight: "300px", overflowY: "auto" }}>
                        <table className="table table-sm table-bordered">
                          <thead className="table-light" style={{ position: "sticky", top: 0, zIndex: 1 }}>
                            <tr>
                              <th>No</th>
                              <th>Vyapari</th>
                              <th>Highest Price</th>
                            </tr>
                          </thead>
                          <tbody>
                            {topPriceVyapari.map((item, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item.vshortname}</td>
                                <td>{item.totalamount}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </Modal.Body>
              </Modal>
            </div>


            <div className="container mt-3">
              <div className="row g-4">
                {[
                  {
                    title: "Daily Expenses",
                    value: expenses.daily,
                    bg: "#e3f2fd",
                    textColor: "#0d47a1",
                    icon: "💸",
                  },
                  {
                    title: "Total Expenses",
                    value: expenses.total,
                    bg: "#fffde7",
                    textColor: "#f57f17",
                    icon: "📊",
                  },
                  {
                    title: "Today's Profit",
                    value: expenses.profitToday,
                    bg: "#e8f5e9",
                    textColor: "#1b5e20",
                    icon: "🚀",
                  },
                  {
                    title: "Total Profit",
                    value: expenses.totalProfit,
                    bg: "#f3e5f5",
                    textColor: "#4a148c",
                    icon: "💰",
                  },
                ].map((item, index) => (
                  <div className="col-md-3 col-6" key={index}>
                    <div
                      className="card shadow-sm border-0 rounded-4 p-3"
                      style={{
                        backgroundColor: item.bg,
                        height: "140px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                        overflow: "hidden",

                        transition: "transform 0.3s ease",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                    >
                      <div className="text-center">
                        <div
                          className="mx-auto mb-2 d-flex justify-content-center align-items-center"
                          style={{

                            width: "55px",
                            height: "55px",
                            borderRadius: "50%",
                            fontSize: "26px",
                            color: "white",
                            boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
                          }}
                        >
                          {item.icon}
                        </div>
                        <h6 style={{ fontSize: "16px", fontWeight: "600", color: "#333" }}>
                          {item.title}
                        </h6>
                        <p className="m-0 fw-bold" style={{ fontSize: "20px", color: item.textColor }}>
                          {item.value}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
};

export default Dashboard;
