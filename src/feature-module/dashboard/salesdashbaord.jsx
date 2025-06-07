import React, { useState, useEffect } from "react";
import CountUp from "react-countup";
import {
  File,
  User,
  UserCheck,
} from "feather-icons-react/build/IconComponents";
import Chart from "react-apexcharts";
import { Link } from "react-router-dom";
import ImageWithBasePath from "../../core/img/imagewithbasebath";
import { ArrowRight } from "react-feather";
import { all_routes } from "../../Router/all_routes";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import ReactApexChart from 'react-apexcharts';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBus, faBirthdayCake } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { baseUrl } from "../../core/json/custom";

const SalesDashbaord = () => {
  const route = all_routes;


  const [counts, setCounts] = useState({
    transporterCount: 0,
    farmerCount: 0,
    vyapariCount: 0
  });

  useEffect(() => {
    const fetchCounts = async () => {

      try {
        const response = await axios.post(
          `${baseUrl.Url}/backend/api/GET_DashCount`,
        );

        console.log("API Response:", response.data);
        setCounts({
          transporterCount: response.data.transporterCount || 0,
          farmerCount: response.data.farmerCount || 0,
          vyapariCount: response.data.vyapariCount || 0
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchCounts();
  }, []);

  // सर्वोत्तम शेतकरी

  var sBar = {
    chart: {
      height: 350,
      type: "bar",
      toolbar: {
        show: false,
      },
    },
    //colors: ['#4361ee'],
    plotOptions: {
      bar: {
        horizontal: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    series: [
      {
        data: [400, 430, 448, 470, 540, 580, 690, 1100],
      },
    ],
    xaxis: {
      categories: [

        "Farmer7",
        "Farmer6",
        "Farmer5",
        "Farmer4",
        "Farmer3",
        "Farmer2",
        "Farmer1",
      ],
    },
  };



  //शेतकऱ्याचे साप्ताहिक दर
  var sline = {
    chart: {
      height: 350,
      type: "line",
      zoom: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
    },
    colors: ['#4361ee'],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "straight",
    },
    series: [
      {
        name: "Rate",
        data: [10, 41, 35, 51, 49, 62, 69, 91, 148],
      },
    ],

    grid: {
      row: {
        colors: ["#f1f2f3", "transparent"],
        opacity: 0.5,
      },
    },
    xaxis: {
      categories: [
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "sat",
        "sun",

      ],
    },
  };

  //व्यापारी साप्ताहिक दर
  const weeklyRates = [
    { day: 'Mon', rate: 120 },
    { day: 'Tue', rate: 150 },
    { day: 'Wed', rate: 140 },
    { day: 'Thur', rate: 130 },
    { day: 'Fri', rate: 160 },
    { day: 'Sat', rate: 155 },
    { day: 'Sun', rate: 170 },
  ];

  const rates = weeklyRates.map(rate => rate.rate);
  const days = weeklyRates.map(rate => rate.day);

  const donutChart = {
    chart: {
      type: 'donut',
    },
    labels: days,
    series: rates,
    plotOptions: {
      pie: {
        donut: {
          size: '60%',
        },
      },
    },
  };

  //  सर्वोत्तम व्यापारी 
  const [selectedDate, setSelectedDate] = useState('02/2/2025');
  const [chartData, setChartData] = useState({
    series: [
      {
        name: "Rate",
        data: [300, 280, 250, 220, 200, 100, 67, 50],
      },
    ],
  });

  const handleDateChange = (date) => {
    setSelectedDate(date);
    const newData = {
      '02/2/2025': [300, 280, 250, 220, 200],
      '01/2/2025': [310, 270, 240, 210, 190],
      '31/1/2025': [280, 260, 230, 200, 210],
    };

    setChartData({
      series: [
        {
          name: "Rate",
          data: newData[date],
        },
      ],
    });
  };

  const chartOptions = {
    series: chartData.series,
    colors: ["#28C76F", "#EA5455"],
    chart: {
      type: "bar",
      height: 320,
      stacked: false,
      zoom: {
        enabled: true,
      },
    },
    responsive: [
      {
        breakpoint: 280,
        options: {
          legend: {
            position: "bottom",
            offsetY: 0,
          },
        },
      },
    ],
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 2,
      },
    },
    dataLabels: {
      enabled: false,
    },
    yaxis: {
      min: 0,
      max: 350,
      tickAmount: 5,
    },
    xaxis: {
      categories: [
        "Farmer 1",
        "Farmer 2",
        "Farmer 3",
        "Farmer 4",
        "Farmer 5",
        "Farmer 6",
        "Farmer 7",
        "Farmer 8",
      ],
    },
    legend: { show: false },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return `$${val}`;
        },
      },
    },
  };

  const [activeEvent, setActiveEvent] = useState(1); // Start by showing the first event
  // Sample event data
  const events = [
    {
      id: 1,
      name: "Farmer Meet-up",
      date: "02/05/2025",
      location: "Village Hall, Farmer District",
      type: "Farmer",
      icon: "fas fa-tractor",
      // color: "bg-success",
      // color: "rgb(232, 247, 232)",

    },
    {
      id: 2,
      name: "Trade Conference",
      date: "05/05/2025",
      location: "Trade Center, City Center",
      type: "Trader",
      icon: "fas fa-handshake",
      // color: "bg-warning",
      // color: "rgb(241, 231, 224)",
    },
    {
      id: 3,
      name: "Transporters Meetup",
      date: "10/05/2025",
      location: "Logistics Park, Industrial Area",
      type: "Transporter",
      icon: "fas fa-truck",
      // color: "bg-info",
      // color: "rgb(240, 245, 247)",
    },
    {
      id: 4,
      name: "Farmer & Trader Collaboration",
      date: "15/05/2025",
      location: "Market Square",
      type: "Farmer/Trader",
      icon: "fas fa-users",
      // color: "bg-secondary",
      // color: "rgb(243, 242, 242)",
    }
  ];


  const eventToShow = events.find(event => event.id === activeEvent);

  return (
    <div>
      <div className="page-wrapper">
        <div className="content">
          <div className="row">
            <div className="col-xl-3 col-sm-6 col-12 d-flex">
              <div className="dash-widget dash1 w-100">
                <div className="dash-widgetimg">
                  <span>
                    <ImageWithBasePath
                      src="assets/img/icons/dash2.svg"
                      alt="img"
                    />
                  </span>
                </div>
                <div className="dash-widgetcontent">
                  <h5>

                    <CountUp
                      start={0}
                      end={4385}
                      duration={3}
                    />
                  </h5>
                  <h6>एकूण बजेट</h6>
                </div>
              </div>
            </div>

            <div className="col-xl-3 col-sm-6 col-12 d-flex">
              <div className="dash-widget dash1 w-100">
                <div className="dash-widgetimg">
                  <span>
                    <ImageWithBasePath
                      src="assets/img/icons/dash2.svg"
                      alt="img"
                    />
                  </span>
                </div>
                <div className="dash-widgetcontent">
                  <h5>

                    <CountUp
                      start={0}
                      end={4385}
                      duration={3}
                    />
                  </h5>
                  <h6>खर्च बजेट</h6>
                </div>
              </div>
            </div>



            <div className="col-xl-3 col-sm-6 col-12 d-flex">
              <div className="dash-widget dash1 w-100">
                <div className="dash-widgetimg">
                  <span>
                    <ImageWithBasePath
                      src="assets/img/icons/dash2.svg"
                      alt="img"
                    />
                  </span>
                </div>
                <div className="dash-widgetcontent">
                  <h5>

                    <CountUp
                      start={0}
                      end={4685}
                      duration={3}
                    />
                  </h5>
                  <h6>शिल्लक बजेट</h6>
                </div>
              </div>
            </div>

            <div className="col-xl-3 col-sm-6 col-12 d-flex">
              <div className="dash-widget dash1 w-100">
                <div className="dash-widgetimg">
                  <span>
                    <ImageWithBasePath
                      src="assets/img/icons/dash2.svg"
                      alt="img"
                    />
                  </span>
                </div>
                <div className="dash-widgetcontent">
                  <h5>

                    <CountUp
                      start={0}
                      end={4685}
                      duration={3}
                    />
                  </h5>
                  <h6>Total Expense Amount</h6>
                </div>
              </div>
            </div>


            <div className="row">
              {/* Transporter */}
              <div className="col-xl-4 col-sm-6 col-12 d-flex">
                <div className="dash-count">
                  <div className="dash-counts">
                    <h4>{counts.transporterCount}</h4>
                    <h5>वाहतूक</h5>
                  </div>
                  <FontAwesomeIcon
                    icon={faBus}
                    className="fs-1"
                    data-bs-toggle="tooltip"
                    title="Transporter Icon"
                  />
                </div>
              </div>

              {/* Farmer */}
              <div className="col-xl-4 col-sm-6 col-12 d-flex">
                <div className="dash-count das1">
                  <div className="dash-counts">
                    <h4>{counts.farmerCount}</h4>
                    <h5>शेतकरी</h5>
                  </div>
                  <div className="dash-imgs">
                    <UserCheck />
                  </div>
                </div>
              </div>

              {/* Vyapari */}
              <div className="col-xl-4 col-sm-6 col-12 d-flex">
                <div className="dash-count das2">
                  <div className="dash-counts">
                    <h4>{counts.vyapariCount}</h4>
                    <h5>व्यापारी</h5>
                  </div>
                  <div className="dash-imgs">
                    <UserCheck />
                  </div>
                </div>
              </div>
            </div>


          </div>


          <div className="row">
            <div className="col-xl-7 col-sm-12 col-12 d-flex">

              <div className="card flex-fill">
                <div
                  className="card-header d-flex justify-content-between align-items-center"
                  style={{ backgroundColor: 'rgb(210, 231, 255)' }}
                >
                  <h5 className="card-title mb-0">सर्वोत्तम शेतकरी</h5>
                </div>

                <div className="card-body">
                  <div id="s-bar" />
                  <ReactApexChart
                    options={sBar}
                    series={sBar.series}
                    type="bar"
                    height={350}
                  />
                </div>
              </div>
            </div>


            <div className="col-xl-5 col-sm-12 col-12 d-flex">
              <div className="card flex-fill default-cover mb-4">

                <div
                  className="card-header d-flex justify-content-between align-items-center"
                  style={{ backgroundColor: 'rgb(223, 219, 238)' }}
                >
                  <h5 className="card-title mb-0">शेतकऱ्याचे साप्ताहिक दर</h5>
                </div>
                <div className="card-body">
                  <div id="s-line-area" />
                  <ReactApexChart
                    options={sline}
                    series={sline.series}
                    type="area"
                    height={350}
                  />
                </div>
              </div>
            </div>
          </div>



          <div className="row">
            <div className="col-xl-7 col-sm-12 col-12 d-flex">

              <div className="card flex-fill">

                <div
                  className="card-header d-flex justify-content-between align-items-center"
                  style={{ backgroundColor: 'rgb(208, 245, 225)' }}
                >
                  <h5 className="card-title mb-0">सर्वोत्तम व्यापारी</h5>
                </div>

                <div className="card-body">
                  <div id="sales_charts" />
                  <Chart
                    options={chartOptions}
                    series={chartOptions.series}
                    type="bar"
                    height={320}
                  />
                </div>
              </div>
            </div>

            <div className="col-xl-5 col-sm-12 col-12 d-flex">
              <div className="card flex-fill default-cover mb-4">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h4 className="card-title mb-0">व्यापारी साप्ताहिक दर</h4>

                </div>
                <div id="donut-chart" />
                <ReactApexChart
                  options={donutChart}
                  series={donutChart.series}
                  type="donut"
                  height={350}
                />
              </div>
            </div>
          </div>

          <div className="card shadow-sm rounded-lg p-4">
            <div className="card-header text-white text-center" style={{ backgroundColor: 'rgb(242, 234, 247)' }}>
              <h4 className="card-title" style={{ color: 'black' }}>Upcoming Event</h4>

            </div>
            <div className="card-body p-4">
              {/* Event Card */}
              <div className="card border-0" style={{ backgroundColor: eventToShow.color, color: 'rgb(0, 0, 0)' }}>
                <div className="card-body text-center">
                  <div className="d-flex justify-content-center align-items-center mb-3">
                    <i className={`${eventToShow.icon} fa-2x mr-3`} style={{ color: 'rgb(0, 0, 0)' }}></i>
                    <h5 className="card-title" style={{ color: 'rgb(0, 0, 0)' }}>{eventToShow.name}</h5>
                  </div>
                  <p><strong>Date:</strong> {eventToShow.date}</p>
                  <p><strong>Location:</strong> {eventToShow.location}</p>
                  <p>
                    <strong>Event Type:</strong>
                    <span
                      className={`badge badge-light`}
                      style={{ backgroundColor: 'rgb(224, 158, 59)' }} // RGB light gray for the background
                    >
                      {eventToShow.type}
                    </span>
                  </p>

                </div>
              </div>

              {/* Buttons to switch between events */}
              <div className="d-flex justify-content-around mt-4">
                <button onClick={() => setActiveEvent(1)} className="btn btn-outline-secondary btn-sm">Farmer Meet-up</button>
                <button onClick={() => setActiveEvent(2)} className="btn btn-outline-secondary btn-sm">Trade Conference</button>
                <button onClick={() => setActiveEvent(3)} className="btn btn-outline-secondary btn-sm">Transporters Meetup</button>
                <button onClick={() => setActiveEvent(4)} className="btn btn-outline-secondary btn-sm">Farmer/Trader Collaboration</button>
              </div>
            </div>
          </div>


          {/* <div className="row g-3">

            <div className="col-md-6">
              <div className="card">
                <Link to="#" className="card-anchor" />
                <div className="row g-0">
                  <div className="col-md-8">
                    <div className="card-body">
                      <h6 className="card-title mb-2 fw-semibold">
                        Happy Birthday...!!
                      </h6>

                      <h5>Monika Jadhav</h5>
                      <p className="card-text mb-0">
                        This is a wild animal with supporting tactics and are very
                        efficient at killing, they are very Dangerous.
                      </p>
                    </div>
                    <div className="card-footer">
                      <p className="card-text">
                        <small className="text-muted">
                          Last updated 3 mins ago
                        </small>
                      </p>
                    </div>
                  </div>
                  <div className="col-md-4 d-flex justify-content-end align-items-center">
                    <FontAwesomeIcon
                      icon={faBirthdayCake}
                      className="fa-4x" // You can adjust the size here (fa-2x, fa-3x, etc.)
                      style={{ color: 'rgb(202, 95, 252)', marginRight: '70px' }} // Right margin added for spacing
                      data-bs-toggle="tooltip"
                      title="Birthday Cake"
                    />
                  </div>
                </div>
              </div>
            </div>




            <div className="col-md-6">
              <div className="card">
                <Link to="#" className="card-anchor" />
                <div className="row g-0">
                  <div className="col-md-8">
                    <div className="card-body">
                      <h6 className="card-title mb-2 fw-semibold">
                        Happy Annivarsary...!!
                      </h6>
                      <h5>Monika jadhav</h5>
                      <p className="card-text mb-0">
                        This is a wild animal with supporting tactics and are very
                        efficient at killing, they are very Dangerous.
                      </p>

                    </div>
                    <div className="card-footer">
                      <p className="card-text">
                        <small className="text-muted">
                          Last updated 3 mins ago
                        </small>
                      </p>
                    </div>
                  </div>
                  <div className="col-md-4 d-flex justify-content-end align-items-center">
                    <FontAwesomeIcon
                      icon={faBirthdayCake}
                      className="fa-4x" // You can adjust the size here (fa-2x, fa-3x, etc.)
                      style={{ color: 'rgb(202, 95, 252)', marginRight: '70px' }} // Right margin added for spacing
                      data-bs-toggle="tooltip"
                      title="Birthday Cake"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div> */}


        </div>




      </div>
    </div>
  );
};

export default SalesDashbaord;
