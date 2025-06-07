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
        { title: 'सेवा', image: 'assets/img/avatar/Services.png', path: '/ServicesMaster', access: 'SERVICE' },
        { title: 'एच एस एन ', image: 'assets/img/avatar/hsn.png', path: '/HSNMaster', access: 'HSN' },
        { title: 'उत्पादन', image: 'assets/img/avatar/product.png', path: '/ItemMaster', access: 'PRODUCT' },
        { title: 'राज्य कोड', image: 'assets/img/avatar/state.png', path: '/SateCodeMaster', access: 'STATECODE' },
        { title: 'युनिट रूपांतरण', image: 'assets/img/avatar/unit.png', path: '/UnitConversionMaster', access: 'UNIT CONVERSION' },
        { title: 'वर्ग', image: 'assets/img/avatar/categories.png', path: '/CategoryMaster', access: 'CATEGORY' },
        { title: 'उपवर्ग ', image: 'assets/img/avatar/subcategory.png', path: '/SubCategoryMaster', access: 'SUBCATEGORY' },
        { title: 'हमी', image: 'assets/img/avatar/warranty.png', path: '/WarrantyMaster', access: 'WARRANTY' },
        { title: 'सेवा शुल्क', image: 'assets/img/avatar/service.png', path: '/ServiceCharges', access: 'SERVCHARGES' },
        { title: 'दुकाने', image: 'assets/img/avatar/shop.png', path: '/Shop', access: 'SHOP' },
        { title: 'पीक नोंदणी', image: 'assets/img/avatar/plant.png', path: '/CropMaster', access: 'CROPMASTER' },
        { title: 'स्थायी सूचना', image: 'assets/img/avatar/instruction.png', path: '/SatandingInstruction', access: 'CROPMASTER' },
        { title: 'जाळी नोंदणी', image: 'assets/img/avatar/shopping-basket.png', path: '/Carets', access: 'CROPMASTER' },
        { title: 'प्रीकूलिंग ', image: 'assets/img/avatar/temp.png', path: '/PreCooling ', access: 'CROPMASTER' },
        { title: 'शॉप अलॉट ', image: 'assets/img/avatar/shop.png', path: '/GalaAlotMaster ', access: 'CROPMASTER' },
        { title: 'वापारी स्लॅब मास्टर', image: 'assets/img/avatar/slab.png', path: '/YapariSlabMaster ', access: 'CROPMASTER' },
        { title: 'वापासी स्लॅब तपशील', image: 'assets/img/avatar/vapsi.png', path: '/VVapasiSlabDetail ', access: 'CROPMASTER' },

    ];

    const { userdetail } = getUserData();
    const accessPolicy = userdetail?.accessPolicy || [];
    const normalizedAccess = Array.isArray(accessPolicy)
        ? accessPolicy.map(a => a.toUpperCase())
        : [];

    // Filter cards by access
    const visibleCards = cardsData.filter(card =>
        normalizedAccess.includes(card.access.toUpperCase())
    );

    return (
        <div className="page-wrapper pagehead">
            <div className="content">
                <div className="page-header">
                    <div className="page-title">
                        <h3>मास्टर्स सूची</h3>
                    </div>

                </div>

                <div className="row">
                    {visibleCards.length === 0 ? (
                        <div className="col-12 text-center mt-4">
                            <p>आपल्याकडे कोणत्याही मॉड्यूलसाठी प्रवेश नाही.</p>
                        </div>
                    ) : (
                        visibleCards.map((card, index) => (
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
                                    onClick={() => navigate(card.path)}>
                                    <div className="card-header border-bottom-0 pb-0"></div>
                                    <div className="card-body pt-1" style={{ height: '120px' }}>
                                        <span className="avatar avatar-xl avatar-rounded me-2 mb-2">
                                            <ImageWithBasePath src={card.image} alt={card.title} />
                                        </span>
                                        <div className="fw-semibold fs-16">{card.title}</div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default Test;
