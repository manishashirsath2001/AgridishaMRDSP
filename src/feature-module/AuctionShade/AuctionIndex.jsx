import React, { useEffect, useState } from 'react';
import ImageWithBasePath from '../../core/img/imagewithbasebath';
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import { all_routes } from "../../Router/all_routes";
import { ArrowLeft } from "feather-icons-react/build/IconComponents";

function AuctionIndex() {
    const route = all_routes;
    const navigate = useNavigate();
    const [isDesktop, setIsDesktop] = useState(false);

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

    const cardsData = [
        { title: 'लिलाव', image: 'assets/img/avatar/auction.png', path: '/Auction' },
        { title: 'प्रवेशद्वार', image: 'assets/img/avatar/checkpoint.png', path: '/GateEntryAuction' },
        // { title: 'शेतकरी ', image: 'assets/img/avatar/farmer.png', path: '/Farmers' },
    ];
    return (
        <div className="page-wrapper pagehead">
            <div className="content">
                <div className="page-header">
                    <div className="page-title">
                        <h3>लिलाव सूची</h3>
                    </div>
                    {/* <ul className="table-top-head">
                        <li>
                            <div className="page-btn">
                                <Link to={route.PurchaseIndex} className="btn btn-secondary">
                                    <ArrowLeft className="me-2" />
                                    मागे
                                </Link>
                            </div>
                        </li>
                    </ul> */}
                </div>
                <div className="row">
                    {cardsData.map((card, index) => (
                        <div
                            className="col-6 col-sm-6 col-md-4 col-lg-2 col-xxl-2 mb-3"
                            key={index}
                        >
                            <div className="card text-center" style={{ borderRadius: '20px' }}>
                                <div className="card-header border-bottom-0 pb-0"></div>
                                <div
                                    className="card-body pt-1"
                                    style={{ height: '120px' }}
                                    onClick={() => {
                                        navigate(card.path, { state: { tab: card.title === 'Direct' ? 'add' : 'pickup' } });
                                    }}
                                >
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
        </div>
    )
}

export default AuctionIndex;


