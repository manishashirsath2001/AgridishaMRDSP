import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ImageWithBasePath from "../../core/img/imagewithbasebath";
import Brand from "../../core/modals/inventory/brand";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { all_routes } from "../../Router/all_routes";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import Table from "../../core/pagination/datatable";
import { setToogleHeader } from "../../core/redux/action";
import AddPurchases from "../../core/modals/purchases/addpurchases";

import {
    ArrowLeft,
    ChevronUp,
    Edit,
    PlusCircle,
    RotateCcw,
    Trash2,
} from "feather-icons-react/build/IconComponents";

const AddPurchaseChallanMaster = () => {
    const dispatch = useDispatch();
    const data = useSelector((state) => state.toggle_header);
    const route = all_routes;

    const columns = [
        {
            title: (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id="types-tooltip">चलन क्रमांक</Tooltip>}
                >
                    <div>चलन क्रमांक</div>
                </OverlayTrigger>
            ),
            dataIndex: "challanNo",
            width: 100, // Adjusted width
            sorter: (a, b) => a.service.localeCompare(b.service),
            render: (text) => (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id={`tooltip-${text}`}>{text}</Tooltip>}
                >
                    <div style={{ textAlign: "left" }}>{text}</div>
                </OverlayTrigger>
            ),
        },
        {
            title: (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id="types-tooltip">चलन तारीख</Tooltip>}
                >
                    <div className="text-center">चलन तारीख</div>
                </OverlayTrigger>
            ),
            dataIndex: "Purchasedate",
            width: 130, // Adjusted width
            render: (text) => (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id={`tooltip-${text}`}>{text}</Tooltip>}
                >
                    <div style={{ textAlign: "center" }}>{text}</div>
                </OverlayTrigger>
            ),
        },
        {
            title: (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id="types-tooltip">पुरवठ्याचे ठिकाण</Tooltip>}
                >
                    <div>पुरवठ्याचे ठिकाण</div>
                </OverlayTrigger>
            ),
            dataIndex: "Placeofsupply",
            width: 150, // Adjusted width
            render: (text) => (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id={`tooltip-${text}`}>{text}</Tooltip>}
                >
                    <div style={{ textAlign: "left" }}>{text}</div>
                </OverlayTrigger>
            ),
        },
        {
            title: (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id="types-tooltip">पुरवठादाराचे नाव</Tooltip>}
                >
                    <div>पुरवठादाराचे नाव</div>
                </OverlayTrigger>
            ),
            dataIndex: "Vendor",
            width: 140, // Adjusted width
            render: (text) => (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id={`tooltip-${text}`}>{text}</Tooltip>}
                >
                    <div style={{ textAlign: "left" }}>{text}</div>
                </OverlayTrigger>
            ),
        },
        {
            title: (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id="types-tooltip">करयोग्य रक्कम</Tooltip>}
                >
                    <div className="text-center">करयोग्य रक्कम</div>
                </OverlayTrigger>
            ),
            dataIndex: "TaxableValue",
            width: 110, // Adjusted width
            render: (text) => (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id={`tooltip-${text}`}>{text}</Tooltip>}
                >
                    <div style={{ textAlign: "right" }}>{text}</div>
                </OverlayTrigger>
            ),
        },
        {
            title: (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id="types-tooltip">निव्वळ रक्कम</Tooltip>}
                >
                    <div className="text-center">निव्वळ रक्कम</div>
                </OverlayTrigger>
            ),
            dataIndex: "Total",
            width: 110, // Adjusted width
            render: (text) => (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id={`tooltip-${text}`}>{text}</Tooltip>}
                >
                    <div style={{ textAlign: "right" }}>{text}</div>
                </OverlayTrigger>
            ),
        },
        {
            title: (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id="types-tooltip">क्रिया</Tooltip>}
                >
                    <div className="text-center">क्रिया</div>
                </OverlayTrigger>
            ),
            dataIndex: "action",
            width: 60, // Adjusted width
            render: () => (
                <div className="action-table-data">
                    <div className="edit-delete-action">
                        <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip id="edit-tooltip">Edit</Tooltip>}
                        >
                            <Link className="me-2 p-2" data-bs-toggle="modal" data-bs-target="#AddPurchasechallan">
                                <Edit className="feather-edit" />
                            </Link>
                        </OverlayTrigger>
                        <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip id="delete-tooltip">Delete</Tooltip>}
                        >
                            <Link
                                className="confirm-text p-2 me-2"
                                to="#"
                                onClick={showConfirmationAlert}
                            >
                                <Trash2 className="feather-trash-2" />
                            </Link>
                        </OverlayTrigger>
                    </div>
                </div>
            ),
        },
    ];

    const MySwal = withReactContent(Swal);
    const showConfirmationAlert = () => {
        MySwal.fire({
            title: "तुला खात्री आहे का?",
            text: "आपण हे परत करू शकणार नाही!",
            showCancelButton: true,
            confirmButtonColor: "#00ff00",
            confirmButtonText: "होय, डिलीट करा!",
            cancelButtonColor: "#ff0000",
            cancelButtonText: "रद्द करा",
        }).then((result) => {
            if (result.isConfirmed) {
                MySwal.fire({
                    title: "हटवले!",
                    text: "तुमची फाइल हटवण्यात आली आहे.",
                    className: "btn btn-success",
                    confirmButtonText: "OK",
                    customClass: {
                        confirmButton: "btn btn-success",
                    },
                });
            } else {
                MySwal.close();
            }
        });
    };

    // const dataSource = [];
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

    const dataSourceStatic = [
        {
            key: "1",
            challanNo: "PM345677",
            Purchasedate: "10-jan-2025",
            Placeofsupply: "Maharastra",
            Vendor: "Vendornameee",
            TaxableValue: "509878787878",
            Total: "50",
        },
        {
            key: "2",
            challanNo: "PM345677",
            Purchasedate: "20-jan-2025",
            Placeofsupply: "Maharastra",
            Vendor: "Vendornamee",
            TaxableValue: "500000000009999",
            Total: "50",
        },
    ];

    return (
        <div className="page-wrapper">
            <div className="content">
                <div className="page-header">
                    <div className="add-item d-flex">
                        <div className="page-title">
                            <h3>खरेदी चालान जोडा</h3>
                            <h6>चालान खरेदी व्यवस्थापित करा</h6>
                        </div>
                    </div>
                    <ul className="table-top-head">
                        <li>
                            <OverlayTrigger placement="top" overlay={renderTooltip}>
                                <Link>
                                    <ImageWithBasePath src="assets/img/icons/pdf.svg" alt="img" />
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
                        <button
                            className="btn btn-added"
                            data-bs-toggle="modal"
                            data-bs-target="#AddPurchasechallan"
                        >
                            <PlusCircle className="me-2 iconsize" /> खरेदी चालान जोडा
                        </button>
                    </div>
                    <div className="page-btn">
                        <Link to={route.PurchaseIndex} className="btn btn-secondary">
                            <ArrowLeft className="me-2" />
                            अनुक्रमणिकेकडे परत
                        </Link>
                    </div>
                </div>
                <div className="card table-list-card">
                    <div className="card-body">
                        <div className="table-responsive">
                            <Table columns={columns} dataSource={dataSourceStatic} />
                        </div>
                    </div>
                </div>
                <Brand />
            </div>
            <AddPurchases />
        </div>
    );
};
export default AddPurchaseChallanMaster
    ;
