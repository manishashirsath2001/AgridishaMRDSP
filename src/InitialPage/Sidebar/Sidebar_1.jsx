import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import * as FeatherIcons from "react-feather"; // Import all icons dynamically

const Sidebar = () => {
  const [activeSubmenu, setActiveSubmenu] = useState(null);

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

  return (
    <div className="sidebar">
      {/* Main Section */}
      <div className="submenu-items">
        <div className="submenu-item">
          <Link to="/admin-dashboard" onClick={() => toggleSubmenu("main")} className="menu-link">
            <div className="menu-text">
              {renderIcon("Grid")} <span>Main</span>
            </div>
            <div className="arrow">
              {activeSubmenu === "main" ? renderIcon("ChevronDown") : renderIcon("ChevronRight")}
            </div>
          </Link>
          {activeSubmenu === "main" && (
            <div className="submenu">
              <Link to="/admin-dashboard">{renderIcon("Grid")} Admin Dashboard</Link>
              <Link to="/sales-dashboard">{renderIcon("Grid")} Sales Dashboard</Link>
              <Link to="/chat">{renderIcon("Smartphone")} Chat</Link>
              <Link to="/video-call">{renderIcon("Video")} Video Call</Link>
              <Link to="/audio-call">{renderIcon("Headphones")} Audio Call</Link>
            </div>
          )}
        </div>
      </div>

      {/* Masters Section */}
      {/* <div className="submenu-items">
        <div className="submenu-item">
          <Link to="/testindex" onClick={() => toggleSubmenu("masters")} className="menu-link">
            <div className="menu-text">
              {renderIcon("Database")} <span>Masters</span>
            </div>
            <div className="arrow">
              {activeSubmenu === "masters" ? renderIcon("ChevronDown") : renderIcon("ChevronRight")}
            </div>
          </Link>
          {activeSubmenu === "masters" && (
            <div className="submenu">
              <Link to="/ServicesMaster">{renderIcon("Settings")} Services Master</Link>
              <Link to="/HSNMaster">{renderIcon("Building")} HSN Master</Link>
              <Link to="/SateCodeMaster">{renderIcon("MapPin")} StateCode Master</Link>
              <Link to="/UnitConversionMaster">{renderIcon("RefreshCw")} Unit Conversion</Link>
            </div>
          )}
        </div>
      </div> */}

      {/* Company Section */}
      <div className="submenu-items">
        <div className="submenu-item">
          <Link to="/companyindex" onClick={() => toggleSubmenu("company")} className="menu-link">
            <div className="menu-text">
              {renderIcon("Briefcase")} <span>Company</span>
            </div>
            <div className="arrow">
              {activeSubmenu === "company" ? renderIcon("ChevronDown") : renderIcon("ChevronRight")}
            </div>
          </Link>
          {activeSubmenu === "company" && (
            <div className="submenu">
              <Link to="/CompanyMaster">{renderIcon("User")} Company Master</Link>
              <Link to="/StoreMaster">{renderIcon("Users")} Department</Link>
              <Link to="/WareHousesMaster">{renderIcon("Home")} Warehouse</Link>
            </div>
          )}
        </div>
      </div>

      {/* Purchases Section */}
      {/* <div className="submenu-items">
        <div className="submenu-item">
          <Link to="/purchaseindex" onClick={() => toggleSubmenu("purchases")} className="menu-link">
            <div className="menu-text">
              {renderIcon("ShoppingCart")} <span>Purchases</span>
            </div>
            <div className="arrow">
              {activeSubmenu === "purchases" ? renderIcon("ChevronDown") : renderIcon("ChevronRight")}
            </div>
          </Link>
          {activeSubmenu === "purchases" && (
            <div className="submenu">
              <Link to="/RequisitionMaster">{renderIcon("FileText")} Requisition</Link>
              <Link to="/QuatationMaster">{renderIcon("FileMinus")} Quotation</Link>
              <Link to="/PurchaseOrderMaster">{renderIcon("FilePlus")} Purchase Order</Link>
            </div>
          )}
        </div>
      </div> */}

      {/* Sales Section */}
      <div className="submenu-items">
        <div className="submenu-item">
          <Link to="/salesindex" onClick={() => toggleSubmenu("sales")} className="menu-link">
            <div className="menu-text">
              {renderIcon("BarChart2")} <span>Sales</span>
            </div>
            <div className="arrow">
              {activeSubmenu === "sales" ? renderIcon("ChevronDown") : renderIcon("ChevronRight")}
            </div>
          </Link>
          {activeSubmenu === "sales" && (
            <div className="submenu">
              <Link to="/sales-list">{renderIcon("ShoppingBag")} Sales Enquiry</Link>
              <Link to="/invoice-report">{renderIcon("FileText")} Quotation</Link>
              <Link to="/sales-returns">{renderIcon("ArrowLeftCircle")} Sales Order</Link>
            </div>
          )}
        </div>
      </div>
      {/* People Section */}
      <div className="submenu-items">
        <div className="submenu-item">
          <Link to="/PeopleIndex" onClick={() => toggleSubmenu("people")} className="menu-link">
            <div className="menu-text">
              {renderIcon("Users")} <span>People</span>
            </div>
            <div className="arrow">
              {activeSubmenu === "people" ? renderIcon("ChevronDown") : renderIcon("ChevronRight")}
            </div>
          </Link>
          {activeSubmenu === "people" && (
            <div className="submenu">
              <Link to="/CustomerMaster">{renderIcon("User")} Customers</Link>
              <Link to="/VendorMaster">{renderIcon("Users")} Vendors</Link>
              <Link to="/TransporterMaster">{renderIcon("Home")} Transporters</Link>
            </div>
          )}
        </div>
      </div>

      {/* Finance & Accounts Section */}
      <div className="submenu-items">
        <div className="submenu-item">
          <Link to="/financeindex" onClick={() => toggleSubmenu("finance")} className="menu-link">
            <div className="menu-text">
              {renderIcon("DollarSign")} <span>Finance & Accounts</span>
            </div>
            <div className="arrow">
              {activeSubmenu === "finance" ? renderIcon("ChevronDown") : renderIcon("ChevronRight")}
            </div>
          </Link>
          {activeSubmenu === "finance" && (
            <div className="submenu">
              <Link to="/expense-list">{renderIcon("CreditCard")} Expenses</Link>
              <Link to="/expense-category">{renderIcon("Tag")} Expense Categories</Link>
            </div>
          )}
        </div>
      </div>

      {/* HRM Section */}
      <div className="submenu-items">
        <div className="submenu-item">
          <Link to="/hrmindex" onClick={() => toggleSubmenu("hrm")} className="menu-link">
            <div className="menu-text">
              {renderIcon("Users")} <span>HRM</span>
            </div>
            <div className="arrow">
              {activeSubmenu === "hrm" ? renderIcon("ChevronDown") : renderIcon("ChevronRight")}
            </div>
          </Link>
          {activeSubmenu === "hrm" && (
            <div className="submenu">
              <Link to="/employees-grid">{renderIcon("UserCheck")} Employees</Link>
              <Link to="/shift">{renderIcon("Calendar")} Shifts</Link>
              <Link to="/attendance-employee">{renderIcon("Clock")} Attendance</Link>
            </div>
          )}
        </div>
      </div>

      {/* Reports Section */}
      <div className="submenu-items">
        <div className="submenu-item">
          <Link to="#" onClick={() => toggleSubmenu("reports")} className="menu-link">
            <div className="menu-text">
              {renderIcon("FileText")} <span>Reports</span>
            </div>
            <div className="arrow">
              {activeSubmenu === "reports" ? renderIcon("ChevronDown") : renderIcon("ChevronRight")}
            </div>
          </Link>
          {activeSubmenu === "reports" && (
            <div className="submenu">
              <Link to="/sales-report">{renderIcon("BarChart2")} Sales Report</Link>
              <Link to="/purchase-report">{renderIcon("PieChart")} Purchase Report</Link>
            </div>
          )}
        </div>
      </div>

      {/* User Management Section */}
      <div className="submenu-items">
        <div className="submenu-item">
          <Link to="#" onClick={() => toggleSubmenu("userManagement")} className="menu-link">
            <div className="menu-text">
              {renderIcon("UserCheck")} <span>User Management</span>
            </div>
            <div className="arrow">
              {activeSubmenu === "userManagement" ? renderIcon("ChevronDown") : renderIcon("ChevronRight")}
            </div>
          </Link>
          {activeSubmenu === "userManagement" && (
            <div className="submenu">
              <Link to="/UserMaster">{renderIcon("Users")} Users</Link>
              <Link to="/AccessRight">{renderIcon("Lock")} Roles & Permissions</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
