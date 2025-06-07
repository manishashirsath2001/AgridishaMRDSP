import React, { useEffect, useState } from 'react';
import ImageWithBasePath from '../../core/img/imagewithbasebath';
import { useNavigate, Link } from 'react-router-dom';
import { all_routes } from "../../Router/all_routes";
import { ArrowLeft } from "feather-icons-react/build/IconComponents";
import { getUserData } from '../../Context/UserData';

function Test() {
    const route = all_routes;
    const navigate = useNavigate();
    const [isDesktop, setIsDesktop] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [showModal, setShowModal] = useState(false);

    // Check if the screen width is >= 992px (desktop)
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

    // Cards Data with required access
    const cardsData = [
        { title: 'सेवा', image: 'assets/img/avatar/Services.png', path: '/ServicesMaster', access: 'SERVICE' },
        { title: 'एच एस एन ', image: 'assets/img/avatar/hsn.png', path: '/HSNMaster', access: 'HSN' },
        { title: 'उत्पादन', image: 'assets/img/avatar/product.png', path: '/ItemMaster', access: 'PRODUCT' },
        { title: 'राज्य कोड', image: 'assets/img/avatar/state.png', path: '/SateCodeMaster', access: 'STATECODE' },
        { title: 'युनिट रूपांतरण', image: 'assets/img/avatar/unit.png', path: '/UnitConversionMaster', access: 'UNIT CONVERSION' },
        { title: 'वर्ग', image: 'assets/img/avatar/categories.png', path: '/CategoryMaster', access: 'CATEGORY' },
        { title: 'उपवर्ग ', image: 'assets/img/avatar/subcategory.png', path: '/SubCategoryMaster', access: 'SUBCATEGORY' },
        { title: 'हमी', image: 'assets/img/avatar/warranty.png', path: '/WarrantyMaster', access: 'WARRANTY' },
        { title: 'सेवा शुल्क', image: 'assets/img/avatar/service.png', path: '/ServiceCharges', access: 'SERVCHARGES' },
        { title: 'दुकाने', image: 'assets/img/avatar/store.png', path: '/Shop', access: 'SHOP' },
        { title: 'बँक तपशील', image: 'assets/img/avatar/bank.png', path: '/BankDetails', access: 'BANKDETAILS' },
    ];

    // Get the user's access policy from context.
    const { userdetail } = getUserData();
    const accessPolicy = userdetail?.accessPolicy || [];

    // Normalize accessPolicy to uppercase array
    const normalizedAccess = Array.isArray(accessPolicy)
        ? accessPolicy.map(a => a.toUpperCase())
        : [];

    // Handle card click with access check
    const handleCardClick = (card) => {
        const requiredAccess = card.access.toUpperCase();
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
                        <h3> मास्टर्स सूची</h3>
                    </div>
                    <ul className="table-top-head">
                        <li>
                            <div className="page-btn">
                                <Link to={route.dashboard} className="btn btn-secondary">
                                    <ArrowLeft className="me-2" />
                                    मागे
                                </Link>
                            </div>
                        </li>
                    </ul>
                </div>

                <div className="row">
                    {cardsData.map((card, index) => (
                        <div
                            className="col-6 col-sm-6 col-md-4 col-lg-2 col-xxl-2 mb-3"
                            key={index}
                        >
                            <div
                                className="card text-center"
                                style={{
                                    borderRadius: '20px',
                                    cursor: 'pointer'
                                }}
                                onClick={() => handleCardClick(card)}
                            >
                                <div className="card-header border-bottom-0 pb-0"></div>
                                <div className="card-body pt-1" style={{ height: '120px' }}>
                                    <span className="avatar avatar-xl avatar-rounded me-2 mb-2">
                                        <ImageWithBasePath src={card.image} alt={card.title} />
                                    </span>
                                    <div className="fw-semibold fs-16">{card.title}</div>
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

export default Test;
