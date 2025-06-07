import React, { useEffect, useState } from 'react';
import ImageWithBasePath from '../../core/img/imagewithbasebath';
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import { all_routes } from "../../Router/all_routes";
import {
    ArrowLeft

} from "feather-icons-react/build/IconComponents";
function PeopleIndex() {
    const route = all_routes;
    const navigate = useNavigate();
    const [isDesktop, setIsDesktop] = useState(false);

    // Check if the screen width is greater than or equal to 992px (desktop)
    useEffect(() => {
        const handleResize = () => {
            setIsDesktop(window.innerWidth >= 992); // 992px is a typical desktop breakpoint
        };

        handleResize(); // Check on initial render
        window.addEventListener('resize', handleResize); // Update on window resize

        return () => {
            window.removeEventListener('resize', handleResize); // Cleanup on component unmount
        };
    }, []);
    const cardsData = [
        { title: 'सभासद ', image: 'assets/img/avatar/Customer.png', path: '/CustomerMaster' },
        { title: 'विक्रेता', image: 'assets/img/avatar/vendor.png', path: '/VendorMaster' },
        { title: 'वाहतूकदार', image: 'assets/img/avatar/transport.png', path: '/TransporterMaster' },
    ];

    return (
        <div className="page-wrapper pagehead">
            <div className="content">
                <div className="page-header">
                    <div className="page-title">
                        <h3>सभासद  सूची </h3>
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
                                <div className="card-body pt-1" style={{ height: '120px' }} onClick={() => { navigate(card.path) }}>
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
    );
}

export default PeopleIndex;
