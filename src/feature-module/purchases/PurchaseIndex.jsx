import React, { useEffect, useState } from 'react';
import ImageWithBasePath from '../../core/img/imagewithbasebath';
import { useNavigate, Link } from 'react-router-dom';
import { all_routes } from "../../Router/all_routes";
import { ArrowLeft } from "feather-icons-react/build/IconComponents";
import { getUserData } from '../../Context/UserData';

function PurchaseIndex() {
    const route = all_routes;
    const navigate = useNavigate();
    const [isDesktop, setIsDesktop] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsDesktop(window.innerWidth >= 992);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);


    const { userdetail } = getUserData();
    const accessPolicy = userdetail?.accessPolicy || "";
    console.log(userdetail, "userdetails");
    const normalizedAccess = typeof accessPolicy === "string"
        ? accessPolicy.toUpperCase().split(",")
        : Array.isArray(accessPolicy)
            ? accessPolicy.map(a => a.toUpperCase())
            : [];


    const cardsData = [
        { title: 'खरेदी मागणी', image: 'assets/img/avatar/requisition.png', path: '/RequisitionMaster', access: 'PREQUISITION' },
        { title: 'खरेदी कोटेशन', image: 'assets/img/avatar/quotation.png', path: '/QuatationMaster', access: 'PQUOTATION' },
        { title: 'खरेदी ऑर्डर', image: 'assets/img/avatar/order.png', path: '/PurchaseOrderMaster', access: 'PORDER' },
        { title: 'खरेदी चलन', image: 'assets/img/avatar/challan.png', path: '/ChallanIndex', access: 'PCHALLAN' },
        { title: 'खरेदी पावतीची नोंद', image: 'assets/img/avatar/note.png', path: '/GoodReciptNote', access: 'PGRN' },
        { title: 'खरेदी बिल', image: 'assets/img/avatar/bill.png', path: '/PurchaseBill', access: 'PBILL' },
        { title: 'खरेदी परतावे', image: 'assets/img/avatar/return.png', path: '/ReturnIndex', access: 'PRETURN' },
        { title: 'खरेदी ऑर्डर बंद', image: 'assets/img/avatar/close.png', path: '/ClosePurchaseOrder', access: 'CLOSE_PO' },
    ];

    // Handler that checks access before navigating.
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
                        <h3>खरेदी सूची </h3>
                    </div>
                    <ul className="table-top-head">
                        {/* <li>
                            <div className="page-btn">
                                <Link to={route.PurchaseIndex} className="btn btn-secondary">
                                    <ArrowLeft className="me-2" />
                                    Back to Home
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
                                        रद्द करा
                                    </button>
                                    <button type="button" className="btn btn-primary" onClick={() => setShowModal(false)}>
                                        ठीक आहे
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

export default PurchaseIndex;
