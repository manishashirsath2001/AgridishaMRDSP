import React, { useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";
import ImageWithBasePath from "../../core/img/imagewithbasebath";
import { all_routes } from "../../Router/all_routes";
import {
    Archive,
    Box,
    ChevronUp,
    RotateCcw,
    // Sliders,
    PlusCircle,
    ArrowLeft,

    Zap,
} from "feather-icons-react/build/IconComponents";
import { useDispatch, useSelector } from "react-redux";
import { setToogleHeader } from "../../core/redux/action";
import Select from "react-select";
import { Filter } from "react-feather";
import EditLowStock from "../../core/modals/inventory/editlowstock";
// import withReactContent from "sweetalert2-react-content";
// import Swal from "sweetalert2";
import Table from "../../core/pagination/datatable";
import AddPurchaseReturn from "./AddPurchaseReturn";
// import AddPurchases from "../../core/modals/purchases/addpurchases";

const test = [
    {
        "Vendor": "ABC Corp",
        "Product": "Product 1",
        "UOM": "Box",
        "Quantity": 100,
        "Bill/Challan Number": "BILL12345"
    },
    {
        "Vendor": "XYZ Ltd",
        "Product": "Product 2",
        "UOM": "Kg",
        "Quantity": 50,
        "Bill/Challan Number": "BILL12346"
    },
    {
        "Vendor": "LMN Enterprises",
        "Product": "Product 3",
        "UOM": "Pack",
        "Quantity": 200,
        "Bill/Challan Number": "BILL12347"
    },
    {
        "Vendor": "PQR Inc",
        "Product": "Product 4",
        "UOM": "Liter",
        "Quantity": 75,
        "Bill/Challan Number": "BILL12348"
    },
    {
        "Vendor": "DEF Supplies",
        "Product": "Product 5",
        "UOM": "Piece",
        "Quantity": 150,
        "Bill/Challan Number": "BILL12349"
    }
];


function PurchaseReturn() {
    const dispatch = useDispatch();
    const data = useSelector((state) => state.toggle_header);
    const dataSource = useSelector((state) => state.lowstock_data);
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const toggleFilterVisibility = () => {
        setIsFilterVisible((prevVisibility) => !prevVisibility);
    };
    const route = all_routes;

    // const oldandlatestvalue = [
    //   { value: "date", label: "Sort by Date" },
    //   { value: "newest", label: "Newest" },
    //   { value: "oldest", label: "Oldest" },
    // ];
    const productlist = [
        { value: "chooseProduct", label: "Choose Product" },
        { value: "lenovo3rdGen", label: "Lenovo 3rd Generation" },
        { value: "nikeJordan", label: "Nike Jordan" },
        { value: "amazonEchoDot", label: "Amazon Echo Dot" },
    ];
    const category = [
        { value: "chooseCategory", label: "Choose Category" },
        { value: "laptop", label: "Laptop" },
        { value: "shoe", label: "Shoe" },
        { value: "speaker", label: "Speaker" },
    ];
    const warehouse = [
        { value: "chooseWarehouse", label: "Choose Warehouse" },
        { value: "lavishWarehouse", label: "Lavish Warehouse" },
        { value: "lobarHandy", label: "Lobar Handy" },
        { value: "traditionalWarehouse", label: "Traditional Warehouse" },
    ];
    const renderTooltip = (props) => (
        <Tooltip id="pdf-tooltip" {...props}>
            Pdf
        </Tooltip>
    );
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

    const columns = [
        {
            title: "Vendor",
            dataIndex: "Vendor",

            sorter: (a, b) => a.warehouse.length - b.warehouse.length,
            //   width: "5%",
        },
        {
            title: "Product",
            dataIndex: "Product",
            sorter: (a, b) => a.store.length - b.store.length,
        },
        // {
        //   title: "Product",
        //   dataIndex: "product",
        //   render: (text, record) => (
        //     <span className="productimgname">
        //       <Link to="#" className="product-img stock-img">
        //         <ImageWithBasePath alt="" src={record.img} />
        //       </Link>
        //       {text}
        //     </span>
        //   ),
        //   sorter: (a, b) => a.product.length - b.product.length,
        // },
        {
            title: "UOM",
            dataIndex: "UOM",

        },
        {
            title: "Quantity",
            dataIndex: "Quantity",

        },
        {
            title: "Bill/Challan Number ",
            dataIndex: "Bill/Challan Number",
            sorter: (a, b) => a.qty.length - b.qty.length,
        },
        {
            title: "Return Quantity",
            dataIndex: "ReturnQuantity",
            sorter: (a, b) => a.qtyalert.length - b.qtyalert.length,
        },

        {
            title: "Actions",
            dataIndex: "actions",
            key: "actions",
            render: () => (
                <div className="action-table-data">
                    <div className="edit-delete-action">
                        {/* <Link
                className="me-2 p-2"
                to="#"
                data-bs-toggle="modal"
                data-bs-target="#edit-stock"
              >
                <i data-feather="edit" className="feather-edit"></i>
              </Link> */}
                        <Link className="me-2 p-2" to="#" data-bs-toggle="modal" data-bs-target="#AddPurchaseReturn">
                            <i data-feather="eye" className="feather-eye"></i>
                        </Link>

                        {/* <Link className="confirm-text p-2" to="#">
                <i
                  data-feather="trash-2"
                  className="feather-trash-2"
                  onClick={showConfirmationAlert}
                ></i>
              </Link> */}
                    </div>
                </div>
            ),
        },
    ];
    // const MySwal = withReactContent(Swal);

    // const showConfirmationAlert = () => {
    //   MySwal.fire({
    //     title: "Are you sure?",
    //     text: "You won't be able to revert this!",
    //     showCancelButton: true,
    //     confirmButtonColor: "#00ff00",
    //     confirmButtonText: "Yes, delete it!",
    //     cancelButtonColor: "#ff0000",
    //     cancelButtonText: "Cancel",
    //   }).then((result) => {
    //     if (result.isConfirmed) {
    //       MySwal.fire({
    //         title: "Deleted!",
    //         text: "Your file has been deleted.",
    //         className: "btn btn-success",
    //         confirmButtonText: "OK",
    //         customClass: {
    //           confirmButton: "btn btn-success",
    //         },
    //       });
    //     } else {
    //       MySwal.close();
    //     }
    //   });
    // };
    return (
        <div>
            <div className="page-wrapper">
                <div className="content">
                    <div className="page-header">
                        <div className="page-title me-auto">
                            <h4>Purchase Return</h4>
                            <h6>Manage Purchase Return</h6>
                        </div>
                        <ul className="table-top-head">
                            <li>
                                <OverlayTrigger placement="top" overlay={renderTooltip}>
                                    <Link>
                                        <ImageWithBasePath
                                            src="assets/img/icons/pdf.svg"
                                            alt="img"
                                        />
                                    </Link>
                                </OverlayTrigger>
                            </li>
                            <li>
                                <OverlayTrigger placement="top" overlay={renderExcelTooltip}>
                                    <Link data-bs-toggle="tooltip" data-bs-placement="top">
                                        <ImageWithBasePath
                                            src="assets/img/icons/excel.svg"
                                            alt="img"
                                        />
                                    </Link>
                                </OverlayTrigger>
                            </li>
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
                                        onClick={() => {
                                            dispatch(setToogleHeader(!data));
                                        }}
                                    >
                                        <ChevronUp />
                                    </Link>
                                </OverlayTrigger>
                            </li>
                        </ul>
                        <div className="d-flex purchase-pg-btn">
                            {/* <div className="page-btn"> */}
                            {/* <Link
                                        to="#"
                                        className="btn btn-added"
                                        data-bs-toggle="modal"
                                        data-bs-target="#add-units"
                                    >
                                        <PlusCircle className="me-2" />
                                        Proceed
                                    </Link>
                                </div> */}
                            <div className="page-btn">
                                <Link to={route.PurchaseIndex} className="btn btn-secondary">
                                    <ArrowLeft className="me-2" />
                                    Back to Index
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="table-tab">
                        <ul className="nav nav-pills" id="pills-tab" role="tablist">
                            <li className="nav-item" role="presentation">
                                <button
                                    className="nav-link active"
                                    id="pills-home-tab"
                                    data-bs-toggle="pill"
                                    data-bs-target="#pills-home"
                                    type="button"
                                    role="tab"
                                    aria-controls="pills-home"
                                    aria-selected="true"
                                >
                                    Challan Return
                                </button>
                            </li>
                            <li className="nav-item" role="presentation">
                                <button
                                    className="nav-link"
                                    id="pills-profile-tab"
                                    data-bs-toggle="pill"
                                    data-bs-target="#pills-profile"
                                    type="button"
                                    role="tab"
                                    aria-controls="pills-profile"
                                    aria-selected="false"
                                >
                                    Invoice Purchase Return
                                </button>
                            </li>
                        </ul>
                        <div className="tab-content" id="pills-tabContent">
                            <div
                                className="tab-pane fade show active"
                                id="pills-home"
                                role="tabpanel"
                                aria-labelledby="pills-home-tab"
                            >
                                {/* /product list */}
                                <div className="card table-list-card">
                                    <div className="card-body">
                                        <div className="table-top">
                                            <div className="search-set">
                                                <div className="search-input">
                                                    <input
                                                        type="text"
                                                        placeholder="Search"
                                                        className="form-control form-control-sm formsearch"
                                                    />
                                                    <Link to className="btn btn-searchset">
                                                        <i
                                                            data-feather="search"
                                                            className="feather-search"
                                                        />
                                                    </Link>
                                                </div>
                                            </div>

                                            {/* <div className="page-header"> */}


                                            <Link
                                                className={`btn btn-filter ${isFilterVisible ? "setclose" : ""
                                                    }`}
                                                id="filter_search"
                                            >
                                                <Filter
                                                    className="filter-icon"
                                                    onClick={toggleFilterVisibility}
                                                />
                                                <span onClick={toggleFilterVisibility}>
                                                    <ImageWithBasePath
                                                        src="assets/img/icons/closes.svg"
                                                        alt="img"
                                                    />
                                                </span>
                                            </Link>

                                            {/* <div className="page-btn">
                              <Link
                                to="#"
                                className="btn btn-added"
                                data-bs-toggle="modal"
                                data-bs-target="#add-units"
                              >
                                <PlusCircle className="me-2" />
                              Add New Purchase
                              </Link>
                              </div> */}
                                            {/* <div className="page-btn">
                                                <Link to={route.test} className="btn btn-secondary">
                                                    <ArrowLeft className="me-2" />
                                                    Back to Index
                                                </Link>
                                            </div> */}
                                        </div>

                                        {/* /Filter */}
                                        <div
                                            className={`card${isFilterVisible ? " visible" : ""}`}
                                            id="filter_inputs"
                                            style={{ display: isFilterVisible ? "block" : "none" }}
                                        >
                                            {" "}
                                            <div className="card-body pb-0">
                                                <div className="row">
                                                    <div className="col-lg-3 col-sm-6 col-12">
                                                        <div className="input-blocks">
                                                            <Box className="info-img" />
                                                            <Select
                                                                className="img-select"
                                                                options={productlist}
                                                                classNamePrefix="react-select"
                                                                placeholder="Choose Product"
                                                                openMenuOnFocus={true}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-3 col-sm-6 col-12">
                                                        <div className="input-blocks">
                                                            <i data-feather="zap" className="info-img" />
                                                            <Zap className="info-img" />
                                                            <Select
                                                                className="img-select"
                                                                options={category}
                                                                classNamePrefix="react-select"
                                                                placeholder="Choose Product"
                                                                openMenuOnFocus={true}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-3 col-sm-6 col-12">
                                                        <div className="input-blocks">
                                                            <Archive className="info-img" />
                                                            <Select
                                                                className="img-select"
                                                                options={warehouse}
                                                                classNamePrefix="react-select"
                                                                placeholder="Choose Warehouse"
                                                                openMenuOnFocus={true}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-3 col-sm-6 col-12 ms-auto">
                                                        <div className="input-blocks">
                                                            <Link className="btn btn-filters ms-auto">
                                                                {" "}
                                                                <i
                                                                    data-feather="search"
                                                                    className="feather-search"
                                                                />{" "}
                                                                Search{" "}
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* /Filter */}
                                        <div className="table-responsive">
                                            <Table columns={columns} dataSource={test} />
                                        </div>
                                    </div>
                                </div>
                                {/* /product list */}
                            </div>
                            <div
                                className="tab-pane fade"
                                id="pills-profile"
                                role="tabpanel"
                                aria-labelledby="pills-profile-tab"
                            >
                                {/* /product list */}
                                <div className="card table-list-card">
                                    <div className="card-body">
                                        <div className="table-top">
                                            <div className="search-set">
                                                <div className="search-input">
                                                    <input
                                                        type="text"
                                                        placeholder="Search"
                                                        className="form-control form-control-sm formsearch"
                                                    />
                                                    <Link to className="btn btn-searchset">
                                                        <i
                                                            data-feather="search"
                                                            className="feather-search"
                                                        />
                                                    </Link>
                                                </div>
                                            </div>
                                            <div className="search-path">
                                                {/* <Link
                          className={`btn btn-filter ${
                            isFilterVisible ? "setclose" : ""
                          }`}
                          id="filter_search"
                        > */}
                                                {/* <Filter
                            className="filter-icon"
                            onClick={toggleFilterVisibility}
                          /> */}
                                                {/* <span onClick={toggleFilterVisibility}>
                            <ImageWithBasePath
                              src="assets/img/icons/closes.svg"
                              alt="img"
                            />
                          </span> */}
                                                {/* </Link> */}
                                            </div>
                                            <div className="page-header">
                                                <div className="page-btn">
                                                    <Link
                                                        to="#"
                                                        className="btn btn-added"
                                                        data-bs-toggle="modal"
                                                        data-bs-target="#AddPurchaseReturn"
                                                    >
                                                        <PlusCircle className="me-2" />
                                                        Add New Purchase
                                                    </Link>
                                                </div>
                                                <div className="page-btn">
                                                    <Link to={route.test} className="btn btn-secondary">
                                                        <ArrowLeft className="me-2" />
                                                        Back to Index
                                                    </Link>
                                                </div>
                                            </div>
                                            {/* <div className="form-sort">
                        <Sliders className="info-img" />
                        <Select
                          className="img-select"
                          classNamePrefix="react-select"
                          options={oldandlatestvalue}
                          placeholder="Newest"
                        />
                      </div> */}

                                        </div>
                                        {/* /Filter */}
                                        <div className="card" id="filter_inputs1">
                                            <div className="card-body pb-0">
                                                <div className="row">
                                                    <div className="col-lg-3 col-sm-6 col-12">
                                                        <div className="input-blocks">
                                                            <i data-feather="box" className="info-img" />
                                                            <select className="react-select">
                                                                <option>Choose Product</option>
                                                                <option>Lenovo 3rd Generation </option>
                                                                <option>Nike Jordan</option>
                                                                <option>Amazon Echo Dot </option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-3 col-sm-6 col-12">
                                                        <div className="input-blocks">
                                                            <i data-feather="zap" className="info-img" />
                                                            <select className="react-select">
                                                                <option>Choose Category</option>
                                                                <option>Laptop</option>
                                                                <option>Shoe</option>
                                                                <option>Speaker</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-3 col-sm-6 col-12">
                                                        <div className="input-blocks">
                                                            <i data-feather="archive" className="info-img" />
                                                            <select className="react-select">
                                                                <option>Choose Warehouse</option>
                                                                <option>Lavish Warehouse </option>
                                                                <option>Lobar Handy </option>
                                                                <option>Traditional Warehouse </option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-3 col-sm-6 col-12 ms-auto">
                                                        <div className="input-blocks">
                                                            <Link className="btn btn-filters ms-auto">
                                                                {" "}
                                                                <i
                                                                    data-feather="search"
                                                                    className="feather-search"
                                                                />{" "}
                                                                Search{" "}
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* /Filter */}
                                        <div className="table-responsive">
                                            <Table columns={columns} dataSource={dataSource} />
                                        </div>
                                    </div>
                                </div>
                                {/* /product list */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* <AddPurchases /> */}
            <EditLowStock />
            <AddPurchaseReturn />
        </div>
    )
}

export default PurchaseReturn
