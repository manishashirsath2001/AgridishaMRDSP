import React, { useEffect, useState } from 'react';
import ImageWithBasePath from '../../core/img/imagewithbasebath';
import { useNavigate, Link } from 'react-router-dom';
import { all_routes } from "../../Router/all_routes";
import { ArrowLeft } from "feather-icons-react/build/IconComponents";
import { getUserData } from '../../Context/UserData';

function SalesIndex() {
    const route = all_routes;
    const navigate = useNavigate();
    const [isDesktop, setIsDesktop] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia("(min-width: 992px)");
        const handleResize = () => setIsDesktop(mediaQuery.matches);
        mediaQuery.addListener(handleResize);
        handleResize();
        return () => mediaQuery.removeListener(handleResize);
    }, []);


    const { userdetail } = getUserData();
    const accessPolicy = userdetail?.accessPolicy || "";


    const normalizedAccess = typeof accessPolicy === "string"
        ? accessPolicy.toUpperCase().split(",")
        : Array.isArray(accessPolicy)
            ? accessPolicy.map(a => a.toUpperCase())
            : [];


    const cardsData = [
        { title: 'विक्री मागणी', image: 'assets/img/avatar/requisition.png', path: '/SalesEnquiry', access: 'SREQUISITION' },
        { title: 'विक्री कोटेशन', image: 'assets/img/avatar/quotation.png', path: '/QuotationIndex', access: 'SQUOTATION' },
        { title: 'विक्री चलन', image: 'assets/img/avatar/challan.png', path: '/SChallanIndex', access: 'SCHALLAN' },
        { title: 'विक्री बिल', image: 'assets/img/avatar/bill.png', path: '/BillIndex', access: 'SBILL' },
        { title: 'विक्री परतावे', image: 'assets/img/avatar/return.png', path: '/SalesRetunMaster', access: 'SRETURN' },
    ];


    const handleCardClick = (card) => {
        const requiredAccess = card.access;
        if (!normalizedAccess.includes(requiredAccess)) {
            setModalMessage(`You do not have access rights to open the ${card.title} page.`);
            setShowModal(true);
            return;
        }
        navigate(card.path);
    };

    return (
        <div className="page-wrapper pagehead">
            <div className="content">
                <div className="page-header">
                    <div className="page-title">
                        <h3>विक्री सूची </h3>
                    </div>
                    <ul className="table-top-head">
                        {/* <li>
                            <div className="page-btn">
                                <Link to={route.dashboard} className="btn btn-secondary">
                                    <ArrowLeft className="me-2" />
                                    मागे
                                </Link>
                            </div>
                        </li> */}
                    </ul>
                </div>
                <div className="row">
                    {cardsData.map((card, index) => (
                        <div className="col-6 col-sm-6 col-md-4 col-lg-2 col-xxl-2 mb-3" key={index} >
                            <div className="card text-center" style={{ borderRadius: '20px' }}>
                                <div className="card-header border-bottom-0 pb-0"></div>
                                <div className="card-body pt-1" style={{ height: '120px', cursor: 'pointer' }} onClick={() => handleCardClick(card)}>
                                    <span className="avatar avatar-xl avatar-rounded me-2 mb-2">
                                        <ImageWithBasePath src={card.image} alt={card.title} />
                                    </span>
                                    <div className="fw-semibold fs-16">{card.title}</div>
                                    <p className="mb-4 text-muted fs-11"></p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal for restricted access */}
            {showModal && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(0,0,0,0.5)",
                        zIndex: 1040,
                    }}
                >
                    <div
                        className="modal fade show"
                        style={{ display: "block", marginTop: "6rem" }}
                        tabIndex="-1"
                        role="dialog"
                    >
                        <div className="modal-dialog" role="document" style={{ maxWidth: "500px" }}>
                            <div className="modal-content">
                                <div className="modal-header" style={{ backgroundColor: "red", color: "#fff" }}>
                                    <h5 className="modal-title">Access Restricted</h5>
                                </div>
                                <div className="modal-body">
                                    <p>{modalMessage}</p>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                                        Cancel
                                    </button>
                                    <button type="button" className="btn btn-primary" onClick={() => setShowModal(false)}>
                                        OK
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SalesIndex;
