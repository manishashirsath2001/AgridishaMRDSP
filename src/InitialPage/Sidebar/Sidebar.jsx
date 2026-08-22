import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import * as FeatherIcons from "react-feather"; // Import all icons dynamically
import { getUserData } from "../../Context/UserData";

const Sidebar = () => {
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const { userdetail } = getUserData();
  console.log(userdetail, "userdetailuserdetail")
  const isRestricted = userdetail?.LANGUAGE === "en";
  useEffect(() => {
    const storedSubmenu = localStorage.getItem("activeSubmenu");
    if (storedSubmenu) {
      setActiveSubmenu(storedSubmenu);
    }
  }, []);

  const toggleSubmenu = (submenuName) => {
    const newActiveSubmenu = activeSubmenu === submenuName ? null : submenuName;
    setActiveSubmenu(newActiveSubmenu);
    localStorage.setItem("activeSubmenu", newActiveSubmenu || "");
  };

  const renderIcon = (iconName) => {
    const IconComponent = FeatherIcons[iconName]; // Get icon dynamically
    return IconComponent ? <IconComponent /> : null;
  };
  const accessPolicy = userdetail?.accessPolicy || "";
  // Convert accessPolicy to uppercase for normalization.
  const normalizedAccess =
    typeof accessPolicy === "string"
      ? accessPolicy.toUpperCase().split(",")
      : Array.isArray(accessPolicy)
        ? accessPolicy.map((a) => a.toUpperCase())
        : [];

  const hasAccess = (requiredAccess) => {
    if (!requiredAccess) return true;
    return normalizedAccess.includes(requiredAccess.toUpperCase());
  };

  const handleRestrictedClick = (e) => {
    e.preventDefault();
    setModalMessage("You do not have access rights to open this page.");
    setShowModal(true);
  };


  return (
    <div className="sidebar" style={{ backgroundColor: "#E5E1DA" }}>


      {hasAccess("APPADMIN") && (
        <div className="submenu-items">
          <div className="submenu-item">
            <Link to="/AppAdminIndex" onClick={() => toggleSubmenu("AppAdmin")} className="menu-link">
              <div className="menu-text">
                {renderIcon("ShoppingCart")} <span>ॲप ॲडमिन</span>
              </div>
              <div className="arrow">
                {activeSubmenu === "AppAdmin" ? renderIcon("ChevronDown") : renderIcon("ChevronRight")}
              </div>
            </Link>
            {activeSubmenu === "AppAdmin" && (
              <div className="submenu">
                {hasAccess("NOTIFICATION") && <Link to="/AppNotification">{renderIcon("ClipboardList")} सूचना</Link>}
                {hasAccess("NOTIFICATION") && <Link to="/VideoMaster">{renderIcon("ClipboardList")} विडियो अपलोड</Link>}
                {hasAccess("NOTIFICATION") && <Link to="/Advertise">{renderIcon("ClipboardList")} जाहिरात</Link>}
                {hasAccess("NOTIFICATION") && <Link to="/GrapesVariety">{renderIcon("ClipboardList")} द्राक्षांच्या व्हरायटी</Link>}
                {hasAccess("NOTIFICATION") && <Link to="/RateList">{renderIcon("ClipboardList")} रेट लिस्ट</Link>}
                {hasAccess("NOTIFICATION") && <Link to="/Annexure">{renderIcon("ClipboardList")} ॲनेक्स्चर फाइल</Link>}
                {hasAccess("NOTIFICATION") && <Link to="GrapeList">{renderIcon("ClipboardList")} द्राक्ष वूत्त</Link>}
                {hasAccess("NOTIFICATION") && <Link to="/Notice">{renderIcon("ClipboardList")} नोटिस</Link>}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Purchases Section */}
      {/* {hasAccess("PURCHASES") && (
        <div className="submenu-items">
          <div className="submenu-item">
            <Link to="/purchaseindex" onClick={() => toggleSubmenu("purchases")} className="menu-link">
              <div className="menu-text">
                {renderIcon("ShoppingCart")} <span>खरेदी</span>
              </div>
              <div className="arrow">
                {activeSubmenu === "purchases" ? renderIcon("ChevronDown") : renderIcon("ChevronRight")}
              </div>
            </Link>
            {activeSubmenu === "purchases" && (
              <div className="submenu">
                {hasAccess("PREQUISITION") && <Link to="/RequisitionMaster">{renderIcon("ClipboardList")}खरेदी मागणी</Link>}
                {hasAccess("PQUOTATION") && <Link to="/QuatationMaster">{renderIcon("FileText")}खरेदी कोटेशन</Link>}
                {hasAccess("PORDER") && <Link to="/PurchaseOrderMaster">{renderIcon("FilePlus")}खरेदी ऑर्डर</Link>}
                {hasAccess("PCHALLAN") && <Link to="/ChallanIndex">{renderIcon("Truck")}खरेदी चलन</Link>}
                {hasAccess("PBILL") && <Link to="/PurchaseBill">{renderIcon("CreditCard")}खरेदी बिल</Link>}
                {hasAccess("PRETURN") && <Link to="/ReturnIndex">{renderIcon("CreditCard")}खरेदी परतावे</Link>}
              </div>
            )}
          </div>
        </div>
      )} */}
    </div>
  );
};

export default Sidebar;
