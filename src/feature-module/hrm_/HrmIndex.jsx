import React, { useEffect, useState } from 'react';
import ImageWithBasePath from '../../core/img/imagewithbasebath';
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import { all_routes } from "../../Router/all_routes";
import {
    ArrowLeft

} from "feather-icons-react/build/IconComponents";
function HrmIndex() {
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
       
        { title: 'Employee', image: 'assets/img/avatar/employee.png', path: '/ServicesMaster' },
        { title: 'Designation', image: 'assets/img/avatar/designation.png', path: '/designation' },
        { title: 'Shifts', image: 'assets/img/avatar/shift.png', path: '/shift' },
        { title: 'Attendance', image: 'assets/img/avatar/attendance.png', path: '/ItemMaster' },
        { title: 'Leaves', image: 'assets/img/avatar/leave.png', path: '/leave-types' },
        { title: 'Holiday', image: 'assets/img/avatar/holiday.png', path: '/holidays' },
        { title: 'Payroll', image: 'assets/img/avatar/payroll.png', path: '/RackMaster' },
    ];

    return (
        <div className="page-wrapper pagehead">
            <div className="content">
                <div className="page-header">
                    <div className="page-title">
                        <h3>Sales</h3>
                    </div>
                    <ul className="table-top-head">
                        <li>
                            <div className="page-btn">
                                <Link to={route.PurchaseIndex} className="btn btn-secondary">
                                    <ArrowLeft className="me-2" />
                                    Back to Home
                                </Link>
                            </div>
                        </li>

                    </ul>
                </div>
                <div className="row">
                    {cardsData.map((card, index) => (
                        <div className="col-xxl-2 col-lg-2 col-md-4 col-sm-6 mb-3" key={index} style={{
                            width: isDesktop ? '200px' : '180px'
                        }} >
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

export default HrmIndex;
