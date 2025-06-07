import React from "react";
import { Route, Navigate } from "react-router-dom";
import ProductList from "../feature-module/inventory/productlist";
import Dashboard from "../feature-module/dashboard/Dashboard";
import AddProduct from "../feature-module/inventory/addproduct";
import SalesDashbaord from "../feature-module/dashboard/salesdashbaord";
import BrandList from "../feature-module/inventory/brandlist";
import VariantAttributes from "../feature-module/inventory/variantattributes";
import Warranty from "../feature-module/inventory/warranty";
import PrintBarcode from "../feature-module/inventory/printbarcode";
import Grid from "../feature-module/uiinterface/grid";
import Images from "../feature-module/uiinterface/images";
import Lightboxes from "../feature-module/uiinterface/lightbox";
import Media from "../feature-module/uiinterface/media";
import Modals from "../feature-module/uiinterface/modals";
import Offcanvas from "../feature-module/uiinterface/offcanvas";
import Pagination from "../feature-module/uiinterface/pagination";

import Alert from "../feature-module/uiinterface/alert";
import Accordion from "../feature-module/uiinterface/accordion";
import Avatar from "../feature-module/uiinterface/avatar";
import Badges from "../feature-module/uiinterface/badges";
import Borders from "../feature-module/uiinterface/borders";
import Buttons from "../feature-module/uiinterface/buttons";
import ButtonsGroup from "../feature-module/uiinterface/buttonsgroup";
import Popovers from "../feature-module/uiinterface/popover";

import Breadcrumb from "../feature-module/uiinterface/breadcrumb";
import Cards from "../feature-module/uiinterface/cards";
import Dropdowns from "../feature-module/uiinterface/dropdowns";
import Colors from "../feature-module/uiinterface/colors";
import Carousel from "../feature-module/uiinterface/carousel";
import Spinner from "../feature-module/uiinterface/spinner";
import NavTabs from "../feature-module/uiinterface/navtabs";
import Toasts from "../feature-module/uiinterface/toasts";
import Typography from "../feature-module/uiinterface/typography";
import Video from "../feature-module/uiinterface/video";
import Tooltips from "../feature-module/uiinterface/tooltips";
import DragDrop from "../feature-module/uiinterface/advancedui/dragdrop";
import SweetAlert from "../feature-module/uiinterface/sweetalert";
import Progress from "../feature-module/uiinterface/progress";
import Placeholder from "../feature-module/uiinterface/placeholder";
import Rating from "../feature-module/uiinterface/advancedui/rating";
import TextEditor from "../feature-module/uiinterface/advancedui/texteditor";
import Counter1 from "../feature-module/uiinterface/advancedui/counter";
import Uiscrollbar from "../feature-module/uiinterface/advancedui/uiscrollbar";
import Stickynote from "../feature-module/uiinterface/advancedui/stickynote";
import Timeline from "../feature-module/uiinterface/advancedui/timeline";
import Apexchart from "../feature-module/uiinterface/charts/apexcharts";
import ChartJs from "../feature-module/uiinterface/charts/chartjs";
import RangeSlides from "../feature-module/uiinterface/rangeslider";
import FontawesomeIcons from "../feature-module/uiinterface/icons/fontawesome";
import FeatherIcons from "../feature-module/uiinterface/icons/feathericon";
import IonicIcons from "../feature-module/uiinterface/icons/ionicicons";
import MaterialIcons from "../feature-module/uiinterface/icons/materialicon";
import PE7Icons from "../feature-module/uiinterface/icons/pe7icons";
import SimplelineIcons from "../feature-module/uiinterface/icons/simplelineicon";
import ThemifyIcons from "../feature-module/uiinterface/icons/themify";
import WeatherIcons from "../feature-module/uiinterface/icons/weathericons";
import TypiconIcons from "../feature-module/uiinterface/icons/typicons";
import FlagIcons from "../feature-module/uiinterface/icons/flagicons";

const routes = all_routes;

import DepartmentGrid from "../feature-module/hrm/departmentgrid";
import DepartmentList from "../feature-module/hrm/departmentlist";
import Designation from "../feature-module/hrm/designation";
import Shift from "../feature-module/hrm/shift";
import AttendanceEmployee from "../feature-module/hrm/attendance-employee";
import ClipBoard from "../feature-module/uiinterface/advancedui/clipboard";
import TablesBasic from "../feature-module/uiinterface/table/tables-basic";
import DataTables from "../feature-module/uiinterface/table/data-tables";
import FormBasicInputs from "../feature-module/uiinterface/forms/formelements/basic-inputs";
import CheckboxRadios from "../feature-module/uiinterface/forms/formelements/checkbox-radios";
import InputGroup from "../feature-module/uiinterface/forms/formelements/input-group";
import GridGutters from "../feature-module/uiinterface/forms/formelements/grid-gutters";
import FormSelect from "../feature-module/uiinterface/forms/formelements/form-select";
import FileUpload from "../feature-module/uiinterface/forms/formelements/fileupload";
import FormMask from "../feature-module/uiinterface/forms/formelements/form-mask";
import FormHorizontal from "../feature-module/uiinterface/forms/formelements/layouts/form-horizontal";
import FormVertical from "../feature-module/uiinterface/forms/formelements/layouts/form-vertical";
import FloatingLabel from "../feature-module/uiinterface/forms/formelements/layouts/floating-label";
import FormValidation from "../feature-module/uiinterface/forms/formelements/layouts/form-validation";
import FormSelect2 from "../feature-module/uiinterface/forms/formelements/layouts/form-select2";
import Ribbon from "../feature-module/uiinterface/advancedui/ribbon";
import Chats from "../feature-module/Application/chat";
import ExpensesList from "../feature-module/FinanceAccounts/expenseslist";
import ExpenseCategory from "../feature-module/FinanceAccounts/expensecategory";
import Calendar from "../feature-module/Application/calendar";
import FormWizard from "../feature-module/uiinterface/forms/formelements/form-wizard";
import ExpiredProduct from "../feature-module/inventory/expiredproduct";
import LowStock from "../feature-module/inventory/lowstock";
import CategoryList from "../feature-module/inventory/categorylist";
import SubCategories from "../feature-module/inventory/subcategories";
import EditProduct from "../feature-module/inventory/editproduct";
import Videocall from "../feature-module/Application/videocall";
import Audiocall from "../feature-module/Application/audiocall";
import Email from "../feature-module/Application/email";
import Callhistory from "../feature-module/Application/callhistory";
import ToDo from "../feature-module/Application/todo";
import QRcode from "../feature-module/inventory/qrcode";
import PurchasesList from "../feature-module/purchases/purchaseslist";
import PurchaseOrderReport from "../feature-module/purchases/purchaseorderreport";
import PurchaseReturns from "../feature-module/purchases/purchasereturns";
import Appearance from "../feature-module/settings/websitesettings/appearance";
import SocialAuthentication from "../feature-module/settings/websitesettings/socialauthentication";
import LanguageSettings from "../feature-module/settings/websitesettings/languagesettings";
import InvoiceSettings from "../feature-module/settings/appsetting/invoicesettings";
import PrinterSettings from "../feature-module/settings/appsetting/printersettings";
import PosSettings from "../feature-module/settings/websitesettings/possettings";
import CustomFields from "../feature-module/settings/websitesettings/customfields";
import EmailSettings from "../feature-module/settings/systemsettings/emailsettings";
import SmsGateway from "../feature-module/settings/systemsettings/smsgateway";
import OtpSettings from "../feature-module/settings/systemsettings/otpsettings";
import GdprSettings from "../feature-module/settings/systemsettings/gdprsettings";
import PaymentGateway from "../feature-module/settings/financialsettings/paymentgateway";
import BankSetting from "../feature-module/settings/financialsettings/banksetting";
import Customers from "../feature-module/people/customers";
import Suppliers from "../feature-module/people/suppliers";
import StoreList from "../core/modals/peoples/storelist";
import Managestock from "../feature-module/stock/managestock";
import StockAdjustment from "../feature-module/stock/stockAdjustment";
import StockTransfer from "../feature-module/stock/stockTransfer";
import SalesReport from "../feature-module/Reports/salesreport";
import PurchaseReport from "../feature-module/Reports/purchasereport";
import InventoryReport from "../feature-module/Reports/inventoryreport";
import Invoicereport from "../feature-module/Reports/invoicereport";
import SupplierReport from "../feature-module/Reports/supplierreport";
import CustomerReport from "../feature-module/Reports/customerreport";
import ExpenseReport from "../feature-module/Reports/expensereport";
import IncomeReport from "../feature-module/Reports/incomereport";
import TaxReport from "../feature-module/Reports/taxreport";
import ProfitLoss from "../feature-module/Reports/profitloss";
import GeneralSettings from "../feature-module/settings/generalsettings/generalsettings";
import SecuritySettings from "../feature-module/settings/generalsettings/securitysettings";
import Notification from "../feature-module/settings/generalsettings/notification";
import ConnectedApps from "../feature-module/settings/generalsettings/connectedapps";
import SystemSettings from "../feature-module/settings/websitesettings/systemsettings";
import CompanySettings from "../feature-module/settings/websitesettings/companysettings";
import LocalizationSettings from "../feature-module/settings/websitesettings/localizationsettings";
import Prefixes from "../feature-module/settings/websitesettings/prefixes";
import Preference from "../feature-module/settings/websitesettings/preference";
import BanIpaddress from "../feature-module/settings/othersettings/ban-ipaddress";
import StorageSettings from "../feature-module/settings/othersettings/storagesettings";
import Pos from "../feature-module/sales/pos";
import AttendanceAdmin from "../feature-module/hrm/attendanceadmin";
import Payslip from "../feature-module/hrm/payslip";
import Holidays from "../feature-module/hrm/holidays";
import SalesList from "../feature-module/sales/saleslist";
import InvoiceReport from "../feature-module/sales/invoicereport";
// import SalesReturn from "../feature-module/sales/salesreturn";
import QuotationList from "../feature-module/sales/quotationlist";
import Notes from "../feature-module/Application/notes";
import FileManager from "../feature-module/Application/filemanager";
import Profile from "../feature-module/pages/profile";
import Signin from "../feature-module/pages/login/signin";
import SigninTwo from "../feature-module/pages/login/signinTwo";
import SigninThree from "../feature-module/pages/login/signinThree";
import RegisterTwo from "../feature-module/pages/register/registerTwo";
import Register from "../feature-module/pages/register/register";
import RegisterThree from "../feature-module/pages/register/registerThree";
import Forgotpassword from "../feature-module/pages/forgotpassword/forgotpassword";
import ForgotpasswordTwo from "../feature-module/pages/forgotpassword/forgotpasswordTwo";
import ForgotpasswordThree from "../feature-module/pages/forgotpassword/forgotpasswordThree";
import Resetpassword from "../feature-module/pages/resetpassword/resetpassword";
import ResetpasswordTwo from "../feature-module/pages/resetpassword/resetpasswordTwo";
import ResetpasswordThree from "../feature-module/pages/resetpassword/resetpasswordThree";
import EmailVerification from "../feature-module/pages/emailverification/emailverification";
import EmailverificationTwo from "../feature-module/pages/emailverification/emailverificationTwo";
import EmailverificationThree from "../feature-module/pages/emailverification/emailverificationThree";
import Twostepverification from "../feature-module/pages/twostepverification/twostepverification";
import TwostepverificationTwo from "../feature-module/pages/twostepverification/twostepverificationTwo";
import TwostepverificationThree from "../feature-module/pages/twostepverification/twostepverificationThree";
import Lockscreen from "../feature-module/pages/lockscreen";
import Error404 from "../feature-module/pages/errorpages/error404";
import Error500 from "../feature-module/pages/errorpages/error500";
import Blankpage from "../feature-module/pages/blankpage";
import Comingsoon from "../feature-module/pages/comingsoon";
import Undermaintainence from "../feature-module/pages/undermaintainence";
import Users from "../feature-module/usermanagement/users";
import RolesPermissions from "../feature-module/usermanagement/rolespermissions";
import Permissions from "../feature-module/usermanagement/permissions";
import DeleteAccount from "../feature-module/usermanagement/deleteaccount";
import EmployeesGrid from "../feature-module/hrm/employeesgrid";
import EditEmployee from "../feature-module/hrm/editemployee";
import AddEmployee from "../feature-module/hrm/addemployee";
import LeavesAdmin from "../feature-module/hrm/leavesadmin";
import LeavesEmployee from "../feature-module/hrm/leavesemployee";
import LeaveTypes from "../feature-module/hrm/leavetypes";
import ProductDetail from "../feature-module/inventory/productdetail";
import { Units } from "../feature-module/inventory/units";
import TaxRates from "../feature-module/settings/financialsettings/taxrates";
import CurrencySettings from "../feature-module/settings/financialsettings/currencysettings";
import WareHouses from "../core/modals/peoples/warehouses";
import Coupons from "../feature-module/coupons/coupons";
import { all_routes } from "./all_routes";
import BankSettingGrid from "../feature-module/settings/financialsettings/banksettinggrid";
import PayrollList from "../feature-module/hrm/payroll-list";
import KanbanView from "../feature-module/Application/kanbanView";
import SocialFeed from "../feature-module/Application/socialfeed";
import Sortable from "../feature-module/uiinterface/ui-sortable";
import Swiperjs from "../feature-module/uiinterface/swiperjs";
import FormPikers from "../feature-module/uiinterface/forms/formelements/formpickers";
import Leaflet from "../feature-module/uiinterface/map/leaflet";
import BootstrapIcons from "../feature-module/uiinterface/icons/bootstrapicons";
import RemixIcons from "../feature-module/uiinterface/icons/remixIcons";
import TablerIcon from "../feature-module/uiinterface/icons/tablericon";
import ReportIndex from "../feature-module/Reports/ReportIndex";
import Reports from "../feature-module/Reports/Reports";
import MasterIndex from "../feature-module/inventory/test"
import ServicesMaster from "../feature-module/Masters/ServicesMaster";
import CustomerMaster from "../feature-module/Masters/CustomerMaster";
import StoreMaster from "../feature-module/Masters/StoreMaster";
import WareHousesMaster from "../feature-module/Masters/WarehouseMaster";
import RackMaster from "../feature-module/Masters/RackMaster"
import HSNMaster from "../feature-module/Masters/HSNMaster"
import SateCodeMaster from "../feature-module/Masters/StateCodeMaster"
import UnitConversionMaster from "../feature-module/Masters/UnitConversionMaster"
import ItemMaster from "../feature-module/Masters/ItemMaster"
import AccessRight from "../feature-module/Masters/AccessRight"
import UserMaster from "../feature-module/Masters/UserMaster"
import AddItem from "../feature-module/Masters/AddItem"
import AddService from "../feature-module/Masters/AddService"
import AddCustomer from "../feature-module/Masters/AddCustomer"
import AddHSNMaster from "../feature-module/Masters/AddHSNMaster"
import AddStoreMaster from "../feature-module/Masters/AddStoreMaster"
import AddWarehouseForm from "../feature-module/Masters/AddWarehouseForm"
import AddRackMaster from "../feature-module/Masters/AddRackMaster"
import AddStateCodeMaster from "../feature-module/Masters/AddStateCodeMaster"
import AddUnitConversionMaster from "../feature-module/Masters/AddUnitConversionMaster"
import VoucherIndex from "../feature-module/Voucher/VoucherIndex";
import Voucher from "../feature-module/Voucher/Voucher";
import AddVoucher from "../feature-module/Voucher/AddVoucher";
import Inventory from "../feature-module/inventory/Inventory"
import AddUserMaster from "../feature-module/Masters/AddUser"
import AddAccessRight from "../feature-module/Masters/AddAccessRight"
import VendorMaster from "../feature-module/Masters/VendorMaster";
import AddVendorMaster from '../feature-module/Masters/AddVendorMaster';
import SuplierMaster from "../feature-module/Masters/SuplierMaster";
import AddSuplierMaster from '../feature-module/Masters/AddSuplierMaster';
import AddTransporterMaster from '../feature-module/Masters/AddTransporterMaster';
import TransporterMaster from '../feature-module/Masters/TransporterMaster'

import PurchaseIndex from '../feature-module/purchases/PurchaseIndex';
import PurchaseBill from "../feature-module/purchases/PurchaseBill";
// import AddPurchaseBill from "../feature-module/purchases/AddPurchaseBill";
import AddPurchaseChallanMaster from "../feature-module/purchases/AddPurchaseChallanMaster";
import GoodReciptNote from "../feature-module/purchases/GoodReciptNote";
import QuatationMaster from "../feature-module/purchases/QuatationMaster";
// import AddQuatation from "../feature-module/purchases/AddQuatation";
import AddPurchaseInvoice from "../feature-module/purchases/AddPurchaseInvoice";
import RequisitionMaster from "../feature-module/purchases/RequisitionMaster";
import AddRequisition from "../feature-module/purchases/AddRequisition";
import PurchaseOrderMaster from "../feature-module/purchases/PurchaseOrderMaster";
import AddPurchaseOrder from "../feature-module/purchases/AddPurchaseOrder";
import PurchaseReturn from "../feature-module/purchases/PurchaseReturn";
import ClosePurchaseOrder from "../feature-module/purchases/ClosePurchaseOrder";
import ChallanIndex from "../feature-module/purchases/ChallanIndex";
import ReturnIndex from "../feature-module/purchases/ReturnIndex";
import ChallanReturn from "../feature-module/purchases/ChallanReturn";
import DirectChallan from "../feature-module/purchases/DirectChallan";
import InvoiceReturn from "../feature-module/purchases/InvoiceReturn";
import PickupChallan from "../feature-module/purchases/PickupChallan";
// import AddQuatation from "../feature-module/purchases/AddQuatation";
// import OnProccedQuatation from "../feature-module/purchases/OnProccedQuatation";
import SalesIndex from '../feature-module/sales/SalesIndex';
import SalesEnquiry from "../feature-module/sales/SalesEnquiry";
import QuotationIndex from '../feature-module/sales/QuotationIndex';
import QuotationMaster from "../feature-module/sales/QuotationMaster";
import AddSaleQuotation from "../feature-module/sales/AddSalesQuotation";
import PickupQuotationMaster from "../feature-module/sales/PickupQuotationMaster";
import SChallanIndex from "../feature-module/sales/SChallanIndex";
import Directsalechallan from "../feature-module/sales/DirectSaleChallan";
import Picksalechallan from "../feature-module/sales/PickSaleChallan";
import BillIndex from "../feature-module/sales/BillIndex";
import ChallanInvoice from "../feature-module/sales/ChallanInvoice";
import SaleInvoice from "../feature-module/sales/SaleInvoice";
// import AddSalesReturn from "../feature-module/sales/AddSalesReturn";
import SalesRetunMaster from "../feature-module/sales/SalesRetunMaster";
import HrmIndex from "../feature-module/hrm/HrmIndex";
import CompanyMaster from '../feature-module/Masters/CompanyMaster';
import AddCompany from '../feature-module/Masters/AddCompany';
import AddCounter from '../feature-module/Masters/AddCounter';
import Counter from '../feature-module/Masters/Counter';
import BomPacking from "../feature-module/Masters/BomPacking";
import YapariSlabMaster from "../feature-module/Masters/YapariSlabMaster";
// import AddBOMPacking from "../feature-module/Masters/AddBOMPacking";
import AddExpense from "../feature-module/FinanceAccounts/AddExpense";
import AddExpenseCategory from "../feature-module/FinanceAccounts/AddExpenseCategory";
import FinanceIndex from "../feature-module/FinanceAccounts/FinanceIndex";
import BankDetails from "../feature-module/FinanceAccounts/BankDetails";
import AddBankDetails from "../feature-module/FinanceAccounts/AddBankDetails";
import CompanyIndex from "../feature-module/Company/CompanyIndex"
import UserIndex from "../feature-module/usermanagement/UserIndex"
import PeopleIndex from "../feature-module/people/PeopleIndex"
import CategoryMaster from "../feature-module/Masters/CategoryMaster";
import SubCategoryMaster from "../feature-module/Masters/SubCategoryMaster";
import PayrollMaster from "../feature-module/hrm/PayrollMaster";
import WarrantyMaster from "../feature-module/Masters/WarrantyMaster";
import QuatationMaster_1 from "../feature-module/Company/QuatationMaster_1";
import Leger from "../feature-module/Leger/Leger";
import LegerIndex from '../feature-module//Leger/LegerIndex';
import CropPlot from "../feature-module/Farmer/CropPlot";
import FarmerIndex from "../feature-module/Farmer/FarmerIndex";
import Farmers from "../feature-module/Farmer/Farmers";
import AddFarmers from "../feature-module/Farmer/AddFarmers";
import AddCropPlot from "../feature-module/Farmer/AddCropPlot";
import Transporter from "../feature-module/Transpoter/Transporter";
import AddTransporter from "../feature-module/Transpoter/AddTransporter";
import TranporterIndex from '../feature-module/Transpoter/TranporterIndex';
import ServiceCharges from "../feature-module/Masters/ServiceCharges";
import VyapariIndex from "../feature-module/Vyapari/VyapariIndex";
import Vyapari from "../feature-module/Vyapari/Vyapari";
import AddVyapari from "../feature-module/Vyapari/AddVyapari";
import VyapariApprove from "../feature-module/Vyapari/VyapariApprove";
import VApproveMaster from "../feature-module/Vyapari/VApproveMaster";
import VyapriBillMaster from "../feature-module/Vyapari/VyapriBillMaster"
import Shop from "../feature-module/Masters/Shop";
import AddShop from "../feature-module/Masters/AddShop";
import AddLeger from "../feature-module/Leger/AddLeger";
import GateEntry from "../feature-module/GateEntry/GateEntry";
import AddGateEntry from "../feature-module/GateEntry/AddGateEntry";
import GateEntryIndex from "../feature-module/GateEntry/GateEntryIndex";
import Auction from "../feature-module/AuctionShade/Auction";
import AddAuction from "../feature-module/AuctionShade/AddAuction";
import AuctionIndex from "../feature-module/AuctionShade/AuctionIndex";
import QuickFarmer from "../feature-module/GateEntry/QuickFarmer";
import QuickTransporter from "../feature-module/GateEntry/QuickTransporter";
import MarketBillIndex from "../feature-module/MarketBill/MarketBillIndex";
import FarmerBillMaster from "../feature-module/MarketBill/FarmerBillMaster";
import Vyaparilimit from "../feature-module/Vyapari/Vyaparilimit";
import AddAppNotification from "../feature-module/AppAdmin/AddAppNotification";
import AppNotification from "../feature-module/AppAdmin/AppNotification";
import AppAdminIndex from "../feature-module/AppAdmin/AppAdminIndex";
import AutoLogout from "../InitialPage/Sidebar/AutoLogoout";
import CashInvert from "../feature-module/FinanceAccounts/CashInvert";
import AddCashInvert from "../feature-module/FinanceAccounts/AddCashInvert";
import CropMaster from "../feature-module/Masters/CropMaster";
import CashCounter from "../feature-module/MarketBill/CashCounter";
import VyapariDashboardIndex from "../feature-module/VyapariDashboard/VyapariDashboardIndex";
import SatandingInstruction from "../feature-module/Masters/SatandingInstruction";
import CheckApproved from "../feature-module/MarketBill/CheckApproved";
import VideoMaster from "../feature-module/AppAdmin/VideoMaster";
import AddVideo from "../feature-module/AppAdmin/AddVideo";
import Advertise from "../feature-module/AppAdmin/Advertise";
import AddAdvertise from "../feature-module/AppAdmin/AddAdvertise";
import VyapariAuctionApprove from "../feature-module/MarketBill/VyapariAuctionApprove";
import AddCompanyInfo from "../feature-module/AppAdmin/AddCompanyInfo";
import CompanyInfo from "../feature-module/AppAdmin/CompanyInfo";
import ColdStorage from "../feature-module/Cooling/ColdStorage";
import CoolingIndex from "../feature-module/Cooling/CoolingIndex";
import AddColdStorage from "../feature-module/Cooling/AddColdStorage";
import Carets from "../feature-module/Masters/Carets";
import PreCooling from "../feature-module/Masters/PreCooling";
import EmployeeMaster from "../feature-module/hrm/EmployeeMaster";
import GalaAlotMaster from "../feature-module/Masters/GalaAlotMaster";

import AddGalaAlot from "../feature-module/Masters/AddGalaAlot";
import KharchVoucher from "../feature-module/Voucher/KharchVoucher";
import DayEnd from "../feature-module/DayEnd/DayEnd";
import DayEndIndex from "../feature-module/DayEnd/DayEndIndex";
import VVapasiSlabDetail from "../feature-module/Masters/VVapasiSlabDetail";
import VyapriBill from "../feature-module/MarketBill/VyapriBill";
import RokadaVyapariBharana from "../feature-module/MarketBill/RokadaVyapariBharana";
import OnlineCounter from "../feature-module/MarketBill/OnlineCounter";
import VyapariBharana from "../feature-module/MarketBill/VyapariBharana";
import GateEntryAuction from "../feature-module/AuctionShade/GateEntryAuction";
import Samplereport from "../feature-module/Reports/Samplereport";

export const publicRoutes = [
  {
    id: 1,
    path: routes.dashboard,
    name: "home",
    element: <Dashboard />,
    route: Route,
  },
  {
    id: 2,
    path: routes.productlist,
    name: "products",
    element: <ProductList />,
    route: Route,
  },
  {
    id: 3,
    path: routes.addproduct,
    name: "products",
    element: <AddProduct />,
    route: Route,
  },
  {
    id: 4,
    path: routes.salesdashboard,
    name: "salesdashboard",
    element: <SalesDashbaord />,
    route: Route,
  },
  {
    id: 5,
    path: routes.brandlist,
    name: "brant",
    element: <BrandList />,
    route: Route,
  },
  {
    id: 6,
    path: routes.units,
    name: "unit",
    element: <Units />,
    route: Route,
  },
  {
    id: 7,
    path: routes.variantyattributes,
    name: "variantyattributes",
    element: <VariantAttributes />,
    route: Route,
  },
  {
    id: 8,
    path: routes.warranty,
    name: "warranty",
    element: <Warranty />,
    route: Route,
  },
  {
    id: 9,
    path: routes.barcode,
    name: "barcode",
    element: <PrintBarcode />,
    route: Route,
  },
  {
    id: 10,
    path: routes.alerts,
    name: "alert",
    element: <Alert />,
    route: Route,
  },
  {
    id: 11,
    path: routes.grid,
    name: "grid",
    element: <Grid />,
    route: Route,
  },

  {
    id: 12,
    path: routes.accordion,
    name: "accordion",
    element: <Accordion />,
    route: Route,
  },
  {
    id: 13,
    path: routes.avatar,
    name: "avatar",
    element: <Avatar />,
    route: Route,
  },
  {
    id: 14,
    path: routes.images,
    name: "images",
    element: <Images />,
    route: Route,
  },

  {
    id: 15,
    path: routes.badges,
    name: "badges",
    element: <Badges />,
    route: Route,
  },
  {
    id: 16,
    path: routes.lightbox,
    name: "lightbox",
    element: <Lightboxes />,
    route: Route,
  },

  {
    id: 17,
    path: routes.borders,
    name: "borders",
    element: <Borders />,
    route: Route,
  },
  {
    id: 18,
    path: routes.media,
    name: "lightbox",
    element: <Media />,
    route: Route,
  },
  {
    id: 19,
    path: routes.buttons,
    name: "borders",
    element: <Buttons />,
    route: Route,
  },
  {
    id: 20,
    path: routes.modals,
    name: "modals",
    element: <Modals />,
    route: Route,
  },
  {
    id: 21,
    path: routes.offcanvas,
    name: "offcanvas",
    element: <Offcanvas />,
    route: Route,
  },
  {
    id: 22,
    path: routes.pagination,
    name: "offcanvas",
    element: <Pagination />,
    route: Route,
  },
  {
    id: 23,
    path: routes.buttonsgroup,
    name: "buttonsgroup",
    element: <ButtonsGroup />,
    route: Route,
  },
  {
    id: 24,
    path: routes.popover,
    name: "buttonsgroup",
    element: <Popovers />,
    route: Route,
  },
  {
    id: 25,
    path: routes.breadcrumb,
    name: "breadcrumb",
    element: <Breadcrumb />,
    route: Route,
  },
  {
    id: 26,
    path: routes.cards,
    name: "cards",
    element: <Cards />,
    route: Route,
  },
  {
    id: 27,
    path: routes.dropdowns,
    name: "dropdowns",
    element: <Dropdowns />,
    route: Route,
  },
  {
    id: 27,
    path: routes.colors,
    name: "colors",
    element: <Colors />,
    route: Route,
  },
  {
    id: 28,
    path: routes.carousel,
    name: "carousel",
    element: <Carousel />,
    route: Route,
  },
  {
    id: 29,
    path: routes.spinner,
    name: "spinner",
    element: <Spinner />,
    route: Route,
  },
  {
    id: 30,
    path: routes.carousel,
    name: "carousel",
    element: <Carousel />,
    route: Route,
  },
  {
    id: 31,
    path: routes.navtabs,
    name: "navtabs",
    element: <NavTabs />,
    route: Route,
  },
  {
    id: 32,
    path: routes.toasts,
    name: "toasts",
    element: <Toasts />,
    route: Route,
  },
  {
    id: 33,
    path: routes.typography,
    name: "typography",
    element: <Typography />,
    route: Route,
  },
  {
    id: 34,
    path: routes.video,
    name: "video",
    element: <Video />,
    route: Route,
  },
  {
    id: 35,
    path: routes.tooltip,
    name: "tooltip",
    element: <Tooltips />,
    route: Route,
  },
  {
    id: 36,
    path: routes.draganddrop,
    name: "draganddrop",
    element: <DragDrop />,
    route: Route,
  },
  {
    id: 37,
    path: routes.sweetalerts,
    name: "sweetalerts",
    element: <SweetAlert />,
    route: Route,
  },
  {
    id: 38,
    path: routes.progress,
    name: "progress",
    element: <Progress />,
    route: Route,
  },
  {
    id: 38,
    path: routes.departmentgrid,
    name: "departmentgrid",
    element: <DepartmentGrid />,
    route: Route,
  },
  {
    id: 39,
    path: routes.placeholder,
    name: "placeholder",
    element: <Placeholder />,
    route: Route,
  },

  {
    id: 39,
    path: routes.departmentlist,
    name: "departmentlist",
    element: <DepartmentList />,
    route: Route,
  },
  {
    id: 40,
    path: routes.rating,
    name: "rating",
    element: <Rating />,
  },

  {
    id: 40,
    path: routes.designation,
    name: "designation",
    element: <Designation />,
    route: Route,
  },
  {
    id: 41,
    path: routes.texteditor,
    name: "text-editor",
    element: <TextEditor />,
    route: Route,
  },

  {
    id: 41,

    path: routes.shift,
    name: "shift",
    element: <Shift />,
    route: Route,
  },
  {
    id: 42,
    path: routes.Counter1,
    name: "Counter1",
    element: <Counter1 />,
    route: Route,
  },
  {
    id: 42,
    path: routes.attendanceemployee,
    name: "attendanceemployee",
    element: <AttendanceEmployee />,
    route: Route,
  },
  {
    id: 43,
    path: routes.scrollbar,
    name: "scrollbar",
    element: <Uiscrollbar />,
    route: Route,
  },
  {
    id: 43,
    path: routes.clipboard,
    name: "clipboard",
    element: <ClipBoard />,
    route: Route,
  },
  {
    id: 44,
    path: routes.stickynote,
    name: "stickynote",
    element: <Stickynote />,
    route: Route,
  },
  {
    id: 44,
    path: routes.tablebasic,
    name: "tablebasic",
    element: <TablesBasic />,
    route: Route,
  },
  {
    id: 45,
    path: routes.timeline,
    name: "timeline",
    element: <Timeline />,
    route: Route,
  },
  {
    id: 45,
    path: routes.datatable,
    name: "datatable",
    element: <DataTables />,
    route: Route,
  },
  {
    id: 46,
    path: routes.apexchart,
    name: "apex-chart",
    element: <Apexchart />,
    route: Route,
  },

  {
    id: 46,
    path: routes.basicinput,
    name: "formbasicinput",
    element: <FormBasicInputs />,
    route: Route,
  },
  {
    id: 47,
    path: routes.chartjs,
    name: "chart-js",
    element: <ChartJs />,
    route: Route,
  },
  {
    id: 47,
    path: routes.checkboxradio,
    name: "checkboxradio",
    element: <CheckboxRadios />,
    route: Route,
  },
  {
    id: 48,
    path: routes.rangeslider,
    name: "range-slider",
    element: <RangeSlides />,
    route: Route,
  },
  {
    id: 49,
    path: routes.fontawesome,
    name: "fontawesome",
    element: <FontawesomeIcons />,
    route: Route,
  },
  {
    id: 50,
    path: routes.feathericon,
    name: "feathericon",
    element: <FeatherIcons />,
    route: Route,
  },
  {
    id: 51,
    path: routes.ionicicons,
    name: "ionicicons",
    element: <IonicIcons />,
    route: Route,
  },
  {
    id: 52,
    path: routes.materialicons,
    name: "materialicons",
    element: <MaterialIcons />,
    route: Route,
  },
  {
    id: 53,
    path: routes.pe7icons,
    name: "pe7icons",
    element: <PE7Icons />,
    route: Route,
  },
  {
    id: 54,
    path: routes.simpleline,
    name: "simpleline",
    element: <SimplelineIcons />,
    route: Route,
  },
  {
    id: 55,
    path: routes.themifyicons,
    name: "themifyicon",
    element: <ThemifyIcons />,
    route: Route,
  },
  {
    id: 56,
    path: routes.iconweather,
    name: "iconweather",
    element: <WeatherIcons />,
    route: Route,
  },
  {
    id: 57,
    path: routes.typicons,
    name: "typicons",
    element: <TypiconIcons />,
    route: Route,
  },
  {
    id: 58,
    path: routes.flagicons,
    name: "flagicons",
    element: <FlagIcons />,
    route: Route,
  },
  {
    id: 58,
    path: routes.inputgroup,
    name: "inputgroup",
    element: <InputGroup />,
    route: Route,
  },
  {
    id: 59,
    path: routes.ribbon,
    name: "ribbon",
    element: <Ribbon />,
    route: Route,
  },
  {
    id: 60,
    path: routes.chat,
    name: "chat",
    element: <Chats />,
    route: Route,
  },
  {
    id: 100,
    path: routes.SocialFeed,
    name: "SocialFeed",
    element: <SocialFeed />,
    route: Route,
  },
  {
    id: 101,
    path: routes.Kanban,
    name: "Kanban",
    element: <KanbanView />,
    route: Route,
  },
  {
    id: 102,
    path: routes.Sortable,
    name: "Sortable",
    element: <Sortable />,
    route: Route,
  },
  {
    id: 103,
    path: routes.SwiperJs,
    name: "SwiperJs",
    element: <Swiperjs />,
    route: Route,
  },
  {
    id: 104,
    path: routes.FormPicker,
    name: "FormPicker",
    element: <FormPikers />,
    route: Route,
  },
  {
    id: 105,
    path: routes.Leaflets,
    name: "Leaflet",
    element: <Leaflet />,
    route: Route,
  },
  {
    id: 106,
    path: routes.remixIcon,
    name: "remixIcon",
    element: <RemixIcons />,
    route: Route,
  },
  {
    id: 107,
    path: routes.BootstrapIcon,
    name: "BootstrapIcon",
    element: <BootstrapIcons />,
    route: Route,
  },
  {
    id: 108,
    path: routes.TablerIcon,
    name: "TablerIcon",
    element: <TablerIcon />,
    route: Route,
  },
  {
    id: 49,
    path: routes.gridgutters,
    name: "gridgutters",
    element: <GridGutters />,
    route: Route,
  },
  {
    id: 50,
    path: routes.gridgutters,
    name: "gridgutters",
    element: <GridGutters />,
    route: Route,
  },
  {
    id: 51,
    path: routes.formselect,
    name: "formselect",
    element: <FormSelect />,
    route: Route,
  },
  {
    id: 52,
    path: routes.fileupload,
    name: "fileupload",
    element: <FileUpload />,
    route: Route,
  },
  {
    id: 53,
    path: routes.formmask,
    name: "formmask",
    element: <FormMask />,
    route: Route,
  },
  {
    id: 54,
    path: routes.formhorizontal,
    name: "formhorizontal",
    element: <FormHorizontal />,
    route: Route,
  },
  {
    id: 54,
    path: routes.formvertical,
    name: "formvertical",
    element: <FormVertical />,
    route: Route,
  },
  {
    id: 55,
    path: routes.floatinglabel,
    name: "floatinglabel",
    element: <FloatingLabel />,
    route: Route,
  },
  {
    id: 56,
    path: routes.formvalidation,
    name: "formvalidation",
    element: <FormValidation />,
    route: Route,
  },
  {
    id: 57,
    path: routes.select2,
    name: "select2",
    element: <FormSelect2 />,
    route: Route,
  },
  {
    id: 58,
    path: routes.wizard,
    name: "wizard",
    element: <FormWizard />,
    route: Route,
  },
  {
    id: 58,
    path: routes.expiredproduct,
    name: "expiredproduct",
    element: <ExpiredProduct />,
    route: Route,
  },
  {
    id: 59,
    path: routes.lowstock,
    name: "lowstock",
    element: <LowStock />,
    route: Route,
  },
  {
    id: 60,
    path: routes.categorylist,
    name: "categorylist",
    element: <CategoryList />,
    route: Route,
  },
  {
    id: 61,
    path: routes.expenselist,
    name: "expenselist",
    element: <ExpensesList />,
    route: Route,
  },
  {
    id: 62,
    path: routes.expensecategory,
    name: "expensecategory",
    element: <ExpenseCategory />,
    route: Route,
  },
  {
    id: 63,
    path: routes.calendar,
    name: "calendar",
    element: <Calendar />,
    route: Route,
  },

  {
    id: 64,
    path: routes.subcategories,
    name: "subcategories",
    element: <SubCategories />,
    route: Route,
  },
  {
    id: 65,
    path: routes.editproduct,
    name: "editproduct",
    element: <EditProduct />,
    route: Route,
  },
  {
    id: 63,
    path: routes.videocall,
    name: "videocall",
    element: <Videocall />,
    route: Route,
  },
  {
    id: 64,
    path: routes.audiocall,
    name: "audiocall",
    element: <Audiocall />,
    route: Route,
  },
  {
    id: 65,
    path: routes.email,
    name: "email",
    element: <Email />,
    route: Route,
  },
  {
    id: 66,
    path: routes.callhistory,
    name: "callhistory",
    element: <Callhistory />,
    route: Route,
  },
  {
    id: 67,
    path: routes.todo,
    name: "todo",
    element: <ToDo />,
    route: Route,
  },
  {
    id: 66,
    path: routes.variantattributes,
    name: "variantattributes",
    element: <VariantAttributes />,
    route: Route,
  },
  {
    id: 67,
    path: routes.qrcode,
    name: "qrcode",
    element: <QRcode />,
    route: Route,
  },
  {
    id: 68,
    path: routes.purchaselist,
    name: "purchaselist",
    element: <PurchasesList />,
    route: Route,
  },
  {
    id: 69,
    path: routes.purchaseorderreport,
    name: "purchaseorderreport",
    element: <PurchaseOrderReport />,
    route: Route,
  },
  {
    id: 70,
    path: routes.purchasereturn,
    name: "purchasereturn",
    element: <PurchaseReturns />,
    route: Route,
  },
  {
    id: 71,
    path: routes.appearance,
    name: "appearance",
    element: <Appearance />,
    route: Route,
  },
  {
    id: 72,
    path: routes.socialauthendication,
    name: "socialauthendication",
    element: <SocialAuthentication />,
    route: Route,
  },
  {
    id: 73,
    path: routes.languagesettings,
    name: "languagesettings",
    element: <LanguageSettings />,
    route: Route,
  },
  {
    id: 74,
    path: routes.invoicesettings,
    name: "invoicesettings",
    element: <InvoiceSettings />,
    route: Route,
  },
  {
    id: 75,
    path: routes.printersettings,
    name: "printersettings",
    element: <PrinterSettings />,
    route: Route,
  },
  {
    id: 76,
    path: routes.possettings,
    name: "possettings",
    element: <PosSettings />,
    route: Route,
  },
  {
    id: 77,
    path: routes.customfields,
    name: "customfields",
    element: <CustomFields />,
    route: Route,
  },
  {
    id: 78,
    path: routes.emailsettings,
    name: "emailsettings",
    element: <EmailSettings />,
    route: Route,
  },
  {
    id: 79,
    path: routes.smssettings,
    name: "smssettings",
    element: <SmsGateway />,
    route: Route,
  },
  {
    id: 80,
    path: routes.otpsettings,
    name: "otpsettings",
    element: <OtpSettings />,
    route: Route,
  },
  {
    id: 81,
    path: routes.gdbrsettings,
    name: "gdbrsettings",
    element: <GdprSettings />,
    route: Route,
  },
  {
    id: 82,
    path: routes.paymentgateway,
    name: "paymentgateway",
    element: <PaymentGateway />,
    route: Route,
  },
  {
    id: 83,
    path: routes.banksettingslist,
    name: "banksettingslist",
    element: <BankSetting />,
    route: Route,
  },
  {
    id: 84,
    path: routes.customers,
    name: "customers",
    element: <Customers />,
    route: Route,
  },
  {
    id: 85,
    path: routes.suppliers,
    name: "suppliers",
    element: <Suppliers />,
    route: Route,
  },
  {
    id: 86,
    path: routes.storelist,
    name: "storelist",
    element: <StoreList />,
    route: Route,
  },
  {
    id: 87,
    path: routes.managestock,
    name: "managestock",
    element: <Managestock />,
    route: Route,
  },
  {
    id: 88,
    path: routes.stockadjustment,
    name: "stockadjustment",
    element: <StockAdjustment />,
    route: Route,
  },
  {
    id: 89,
    path: routes.stocktransfer,
    name: "stocktransfer",
    element: <StockTransfer />,
    route: Route,
  },
  {
    id: 90,
    path: routes.salesreport,
    name: "salesreport",
    element: <SalesReport />,
    route: Route,
  },
  {
    id: 91,
    path: routes.purchasereport,
    name: "purchasereport",
    element: <PurchaseReport />,
    route: Route,
  },
  {
    id: 92,
    path: routes.inventoryreport,
    name: "inventoryreport",
    element: <InventoryReport />,
    route: Route,
  },
  {
    id: 93,
    path: routes.invoicereport,
    name: "invoicereport",
    element: <Invoicereport />,
    route: Route,
  },
  {
    id: 94,
    path: routes.supplierreport,
    name: "supplierreport",
    element: <SupplierReport />,
    route: Route,
  },
  {
    id: 95,
    path: routes.customerreport,
    name: "customerreport",
    element: <CustomerReport />,
    route: Route,
  },
  {
    id: 96,
    path: routes.expensereport,
    name: "expensereport",
    element: <ExpenseReport />,
    route: Route,
  },
  {
    id: 97,
    path: routes.incomereport,
    name: "incomereport",
    element: <IncomeReport />,
    route: Route,
  },
  {
    id: 98,
    path: routes.taxreport,
    name: "taxreport",
    element: <TaxReport />,
    route: Route,
  },
  {
    id: 99,
    path: routes.profitloss,
    name: "profitloss",
    element: <ProfitLoss />,
    route: Route,
  },
  {
    id: 89,
    path: routes.generalsettings,
    name: "generalsettings",
    element: <GeneralSettings />,
    route: Route,
  },
  {
    id: 90,
    path: routes.securitysettings,
    name: "securitysettings",
    element: <SecuritySettings />,
    route: Route,
  },
  {
    id: 91,
    path: routes.notification,
    name: "notification",
    element: <Notification />,
    route: Route,
  },
  {
    id: 92,
    path: routes.connectedapps,
    name: "connectedapps",
    element: <ConnectedApps />,
    route: Route,
  },
  {
    id: 93,
    path: routes.systemsettings,
    name: "systemsettings",
    element: <SystemSettings />,
    route: Route,
  },
  {
    id: 94,
    path: routes.companysettings,
    name: "companysettings",
    element: <CompanySettings />,
    route: Route,
  },
  {
    id: 94,
    path: routes.localizationsettings,
    name: "localizationsettings",
    element: <LocalizationSettings />,
    route: Route,
  },
  {
    id: 95,
    path: routes.prefixes,
    name: "prefixes",
    element: <Prefixes />,
    route: Route,
  },
  {
    id: 99,
    path: routes.preference,
    name: "preference",
    element: <Preference />,
    route: Route,
  },
  {
    id: 99,
    path: routes.banipaddress,
    name: "banipaddress",
    element: <BanIpaddress />,
    route: Route,
  },
  {
    id: 99,
    path: routes.storagesettings,
    name: "storagesettings",
    element: <StorageSettings />,
    route: Route,
  },
  {
    id: 99,
    path: routes.taxrates,
    name: "taxrates",
    element: <TaxRates />,
    route: Route,
  },
  {
    id: 99,
    path: routes.currencysettings,
    name: "currencysettings",
    element: <CurrencySettings />,
    route: Route,
  },
  {
    id: 99,
    path: routes.pos,
    name: "pos",
    element: <Pos />,
    route: Route,
  },
  {
    id: 100,
    path: routes.attendanceadmin,
    name: "attendanceadmin",
    element: <AttendanceAdmin />,
    route: Route,
  },
  {
    id: 101,
    path: routes.payslip,
    name: "payslip",
    element: <Payslip />,
    route: Route,
  },
  {
    id: 102,
    path: routes.saleslist,
    name: "saleslist",
    element: <SalesList />,
    route: Route,
  },
  {
    id: 102,
    path: routes.invoicereport,
    name: "invoicereport",
    element: <InvoiceReport />,
    route: Route,
  },
  {
    id: 102,
    path: routes.holidays,
    name: "holidays",
    element: <Holidays />,
    route: Route,
  },
  // {
  //   id: 102,
  //   path: routes.salesreturn,
  //   name: "salesreturn",
  //   element: <SalesReturn />,
  //   route: Route,
  // },
  {
    id: 103,
    path: routes.quotationlist,
    name: "quotationlist",
    element: <QuotationList />,
    route: Route,
  },
  {
    id: 104,
    path: routes.notes,
    name: "notes",
    element: <Notes />,
    route: Route,
  },
  {
    id: 105,
    path: routes.filemanager,
    name: "filemanager",
    element: <FileManager />,
    route: Route,
  },
  {
    id: 106,
    path: routes.profile,
    name: "profile",
    element: <Profile />,
    route: Route,
  },
  {
    id: 20,
    path: routes.blankpage,
    name: "blankpage",
    element: <Blankpage />,
    route: Route,
  },
  {
    id: 104,
    path: routes.users,
    name: "users",
    element: <Users />,
    route: Route,
  },
  {
    id: 105,
    path: routes.rolespermission,
    name: "rolespermission",
    element: <RolesPermissions />,
    route: Route,
  },
  {
    id: 106,
    path: routes.permissions,
    name: "permissions",
    element: <Permissions />,
    route: Route,
  },
  {
    id: 107,
    path: routes.deleteaccount,
    name: "deleteaccount",
    element: <DeleteAccount />,
    route: Route,
  },
  {
    id: 108,
    path: routes.EmployeesGrid,
    name: "EmployeesGrid",
    element: <EmployeesGrid />,
    route: Route,
  },
  {
    id: 109,
    path: routes.addemployee,
    name: "addemployee",
    element: <AddEmployee />,
    route: Route,
  },
  {
    id: 110,
    path: routes.editemployee,
    name: "editemployee",
    element: <EditEmployee />,
    route: Route,
  },
  {
    id: 111,
    path: routes.leavesadmin,
    name: "leavesadmin",
    element: <LeavesAdmin />,
    route: Route,
  },
  {
    id: 112,
    path: routes.leavesemployee,
    name: "leavesemployee",
    element: <LeavesEmployee />,
    route: Route,
  },
  {
    id: 113,
    path: routes.leavestype,
    name: "leavestype",
    element: <LeaveTypes />,
    route: Route,
  },
  {
    id: 113,
    path: routes.productdetails,
    name: "productdetails",
    element: <ProductDetail />,
    route: Route,
  },
  {
    id: 114,
    path: routes.warehouses,
    name: "warehouses",
    element: <WareHouses />,
    route: Route,
  },
  {
    id: 115,
    path: routes.coupons,
    name: "coupons",
    element: <Coupons />,
    route: Route,
  },
  {
    id: 116,
    path: "*",
    name: "NotFound",
    element: <Navigate to="/" />,
    route: Route,
  },
  {
    id: 117,
    path: '/',
    name: 'Root',
    element: <Navigate to="/signin" />,
    route: Route,
  },
  {
    id: 118,
    path: routes.banksettingsgrid,
    name: "banksettingsgrid",
    element: <BankSettingGrid />,
    route: Route,
  },
  {
    id: 119,
    path: routes.payrollList,
    name: "payroll-list",
    element: <PayrollList />,
    route: Route,
  },
  {
    id: 119,
    path: routes.MasterIndex,
    name: "MasterIndex",
    element: <MasterIndex />,
    route: Route,
  },
  {
    id: 120,
    path: routes.ServicesMaster,
    name: "ServicesMaster",
    element: <ServicesMaster />,
    route: Route,
  },

  {
    id: 121,
    path: routes.CustomerMaster,
    name: "CustomerMaster",
    element: <CustomerMaster />,
    route: Route,
  },
  {
    id: 122,
    path: routes.StoreMaster,
    name: "StoreMaster",
    element: <StoreMaster />,
    route: Route,
  },
  {
    id: 123,
    path: routes.WareHousesMaster,
    name: "WareHousesMaster",
    element: <WareHousesMaster />,
    route: Route,
  },
  {
    id: 124,
    path: routes.RackMaster,
    name: "RackMaster",
    element: <RackMaster />,
    route: Route,
  },
  {
    id: 125,
    path: routes.HSNMaster,
    name: "HSNMaster",
    element: <HSNMaster />,
    route: Route,
  },
  {
    id: 126,
    path: routes.SateCodeMaster,
    name: "SateCodeMaster",
    element: <SateCodeMaster />,
    route: Route,
  },
  {
    id: 127,
    path: routes.UnitConversionMaster,
    name: "UnitConversionMaster",
    element: <UnitConversionMaster />,
    route: Route,
  },
  {
    id: 128,
    path: routes.ItemMaster,
    name: "ItemMaster",
    element: <ItemMaster />,
    route: Route,
  },
  {
    id: 129,
    path: routes.AccessRight,
    name: "AccessRight",
    element: <AccessRight />,
    route: Route,
  },
  {
    id: 130,
    path: routes.UserMaster,
    name: "UserMaster",
    element: <UserMaster />,
    route: Route,
  },
  {
    id: 131,
    path: routes.AddItem,
    name: "AddItem",
    element: <AddItem />,
    route: Route,
  },
  {
    id: 132,
    path: routes.AddService,
    name: "AddService",
    element: <AddService />,
    route: Route,
  },
  {
    id: 133,
    path: routes.AddHSNMaster,
    name: "AddHSNMaster",
    element: <AddHSNMaster />,
    route: Route,
  },
  {
    id: 134,
    path: routes.AddStoreMaster,
    name: "AddStoreMaster",
    element: <AddStoreMaster />,
    route: Route,
  },
  {
    id: 135,
    path: routes.AddWarehouseForm,
    name: "AddWarehouseForm",
    element: <AddWarehouseForm />,
    route: Route,
  },
  {
    id: 136,
    path: routes.AddRackMaster,
    name: "AddRackMaster",
    element: <AddRackMaster />,
    route: Route,
  },
  {
    id: 137,
    path: routes.AddStateCodeMaster,
    name: "AddStateCodeMaster",
    element: <AddStateCodeMaster />,
    route: Route,
  },
  {
    id: 138,
    path: routes.AddUnitConversionMaster,
    name: "AddUnitConversionMaster",
    element: <AddUnitConversionMaster />,
    route: Route,
  },
  {
    id: 139,
    path: routes.AddCustomer,
    name: "AddCustomer",
    element: <AddCustomer />,
    route: Route,
  },
  {
    id: 140,
    path: routes.Inventory,
    name: "Inventory",
    element: <Inventory />,
    route: Route,
  },
  {
    id: 141,
    path: routes.AddUserMaster,
    name: "AddUserMaster",
    element: <AddUserMaster />,
    route: Route,
  },
  {
    id: 141,
    path: routes.AddAccessRight,
    name: "AddAccessRight",
    element: <AddAccessRight />,
    route: Route,
  },
  {
    id: 142,
    path: routes.VendorMaster,
    name: "VendorMaster",
    element: <VendorMaster />,
    route: Route,
  },
  {
    id: 143,
    path: routes.AddVendorMaster,
    name: "AddVendorMaster",
    element: <AddVendorMaster />,
    route: Route,
  },
  {
    id: 144,
    path: routes.TransporterMaster,
    name: "TransporterMaster",
    element: <TransporterMaster />,
    route: Route,
  },
  {
    id: 145,
    path: routes.AddTransporterMaster,
    name: "AddTransporterMaster",
    element: <AddTransporterMaster />,
    route: Route,
  },
  {
    id: 146,
    path: routes.SuplierMaster,
    name: "SuplierMaster",
    element: <SuplierMaster />,
    route: Route,
  },
  {
    id: 147,
    path: routes.AddSuplierMaster,
    name: "AddSuplierMaster",
    element: <AddSuplierMaster />,
    route: Route,
  },
  {
    id: 148,
    path: routes.PurchaseIndex,
    name: "PurchaseIndex",
    element: <PurchaseIndex />,
    route: Route,
  },
  {
    id: 149,
    path: routes.PurchaseBill,
    name: "PurchaseBill",
    element: <PurchaseBill />,
    route: Route,
  },
  {
    id: 150,
    path: routes.AddPurchaseInvoice,
    name: "AddPurchaseInvoice",
    element: <AddPurchaseInvoice />,
    route: Route,
  },
  {
    id: 151,
    path: routes.AddPurchaseChallanMaster,
    name: "AddPurchaseChallanMaster",
    element: <AddPurchaseChallanMaster />,
    route: Route,
  },
  {
    id: 152,
    path: routes.GoodReciptNote,
    name: "GoodReciptNote",
    element: <GoodReciptNote />,
    route: Route,
  },
  {
    id: 153,
    path: routes.QuatationMaster,
    name: "QuatationMaster",
    element: <QuatationMaster />,
    route: Route,
  },
  // {
  //   id: 154,
  //   path: routes.AddQuatation,
  //   name: "AddQuatation",
  //   element: <AddQuatation />,
  //   route: Route,
  // },
  {
    id: 155,
    path: routes.RequisitionMaster,
    name: "RequisitionMaster",
    element: <RequisitionMaster />,
    route: Route,
  },
  {
    id: 156,
    path: routes.AddRequisition,
    name: "AddRequisition",
    element: <AddRequisition />,
    route: Route,
  },
  {
    id: 157,
    path: routes.PurchaseOrderMaster,
    name: "PurchaseOrderMaster",
    element: <PurchaseOrderMaster />,
    route: Route,
  },
  {
    id: 158,
    path: routes.AddPurchaseOrder,
    name: "AddPurchaseOrder",
    element: <AddPurchaseOrder />,
    route: Route,
  },
  {
    id: 159,
    path: routes.PurchaseReturn,
    name: "PurchaseReturn",
    element: <PurchaseReturn />,
    route: Route,
  },
  {
    id: 160,
    path: routes.ClosePurchaseOrder,
    name: "ClosePurchaseOrder",
    element: <ClosePurchaseOrder />,
    route: Route,
  },
  {
    id: 161,
    path: routes.ChallanIndex,
    name: "ChallanIndex",
    element: <ChallanIndex />,
    route: Route,
  },
  {
    id: 162,
    path: routes.ReturnIndex,
    name: "ReturnIndex",
    element: <ReturnIndex />,
    route: Route,
  },
  {
    id: 163,
    path: routes.ChallanReturn,
    name: "ChallanReturn",
    element: <ChallanReturn />,
    route: Route,
  },
  {
    id: 164,
    path: routes.DirectChallan,
    name: "DirectChallan",
    element: <DirectChallan />,
    route: Route,
  },
  {
    id: 165,
    path: routes.InvoiceReturn,
    name: "InvoiceReturn",
    element: <InvoiceReturn />,
    route: Route,
  },
  {
    id: 166,
    path: routes.PickupChallan,
    name: "PickupChallan",
    element: <PickupChallan />,
    route: Route,
  },
  {
    id: 167,
    path: routes.SalesIndex,
    name: "SalesIndex",
    element: <SalesIndex />,
    route: Route,
  },
  {
    id: 168,
    path: routes.SalesEnquiry,
    name: "SalesEnquiry",
    element: <SalesEnquiry />,
    route: Route,
  },
  {
    id: 169,
    path: routes.QuotationIndex,
    name: "QuotationIndex",
    element: <QuotationIndex />,
    route: Route,
  },
  {
    id: 170,
    path: routes.QuotationMaster,
    name: "QuotationMaster",
    element: <QuotationMaster />,
    route: Route,
  },
  {
    id: 171,
    path: routes.AddSaleQuotation,
    name: "AddSaleQuotation",
    element: <AddSaleQuotation />,
    route: Route,
  },
  {
    id: 172,
    path: routes.PickupQuotationMaster,
    name: "PickupQuotationMaster",
    element: <PickupQuotationMaster />,
    route: Route,
  },
  {
    id: 173,
    path: routes.SChallanIndex,
    name: "SChallanIndex",
    element: <SChallanIndex />,
    route: Route,
  },
  {
    id: 174,
    path: routes.Directsalechallan,
    name: "Directsalechallan",
    element: <Directsalechallan />,
    route: Route,
  },
  {
    id: 175,
    path: routes.Picksalechallan,
    name: "Picksalechallan",
    element: <Picksalechallan />,
    route: Route,
  },
  {
    id: 176,
    path: routes.BillIndex,
    name: "BillIndex",
    element: <BillIndex />,
    route: Route,
  },
  {
    id: 177,
    path: routes.ChallanInvoice,
    name: "ChallanInvoice",
    element: <ChallanInvoice />,
    route: Route,
  },
  {
    id: 178,
    path: routes.SaleInvoice,
    name: "SaleInvoice",
    element: <SaleInvoice />,
    route: Route,
  },
  {
    id: 179,
    path: routes.SalesRetunMaster,
    name: "SalesRetunMaster",
    element: <SalesRetunMaster />,
    route: Route,
  },
  {
    id: 180,
    path: routes.HrmIndex,
    name: "HrmIndex",
    element: <HrmIndex />,
    route: Route,
  },
  {
    id: 181,
    path: routes.HrmIndex,
    name: "HrmIndex",
    element: <HrmIndex />,
    route: Route,
  },
  {
    id: 182,
    path: routes.CompanyMaster,
    name: "CompanyMaster",
    element: <CompanyMaster />,
    route: Route,
  },
  {
    id: 183,
    path: routes.AddCompany,
    name: "AddCompany",
    element: <AddCompany />,
    route: Route,
  },
  {
    id: 184,
    path: routes.CompanyMaster,
    name: "CompanyMaster",
    element: <CompanyMaster />,
    route: Route,
  },
  {
    id: 185,
    path: routes.Counter,
    name: "Counter",
    element: <Counter />,
    route: Route,
  },
  {
    id: 186,
    path: routes.AddCounter,
    name: "AddCounter",
    element: <AddCounter />,
    route: Route,
  },
  {
    id: 187,
    path: routes.BomPacking,
    name: "BomPacking",
    element: <BomPacking />,
    route: Route,
  },
  {
    id: 189,
    path: routes.PeopleIndex,
    name: "PeopleIndex",
    element: <PeopleIndex />,
    route: Route,
  },
  {
    id: 190,
    path: routes.AddExpense,
    name: "AddExpense",
    element: <AddExpense />,
    route: Route,
  },
  {
    id: 191,
    path: routes.AddExpenseCategory,
    name: "AddExpenseCategory",
    element: <AddExpenseCategory />,
    route: Route,
  },
  {
    id: 192,
    path: routes.UserIndex,
    name: "UserIndex",
    element: <UserIndex />,
    route: Route,
  },
  {
    id: 193,
    path: routes.CompanyIndex,
    name: "CompanyIndex",
    element: <CompanyIndex />,
    route: Route,
  },
  {
    id: 194,
    path: routes.FinanceIndex,
    name: "FinanceIndex",
    element: <FinanceIndex />,
    route: Route,
  },
  {
    id: 195,
    path: routes.CategoryMaster,
    name: "CategoryMaster",
    element: <CategoryMaster />,
    route: Route,
  },
  {
    id: 196,
    path: routes.SubCategoryMaster,
    name: "SubCategoryMaster",
    element: <SubCategoryMaster />,
    route: Route,
  },
  {
    id: 197,
    path: routes.PayrollMaster,
    name: "PayrollMaster",
    element: <PayrollMaster />,
    route: Route,
  },
  {
    id: 198,
    path: routes.WarrantyMaster,
    name: "WarrantyMaster",
    element: <WarrantyMaster />,
    route: Route,
  },
  {
    id: 199,
    path: routes.QuatationMaster_1,
    name: "QuatationMaster_1",
    element: <QuatationMaster_1 />,
    route: Route,
  },

  {
    id: 200,
    path: routes.LegerIndex,
    name: "LegerIndex",
    element: <LegerIndex />,
    route: Route,
  },
  {
    id: 201,
    path: routes.Leger,
    name: "Leger",
    element: <Leger />,
    route: Route,
  },
  {
    id: 202,
    path: routes.CropPlot,
    name: "CropPlot",
    element: <CropPlot />,
    route: Route,
  },
  {
    id: 203,
    path: routes.FarmerIndex,
    name: "FarmerIndex",
    element: <FarmerIndex />,
    route: Route,
  },

  {
    id: 203,
    path: routes.Farmers,
    name: "Farmers",
    element: <Farmers />,
    route: Route,
  },
  {
    id: 203,
    path: routes.AddFarmers,
    name: "AddFarmers",
    element: <AddFarmers />,
    route: Route,
  },
  {
    id: 204,
    path: routes.AddCropPlot,
    name: "AddCropPlot",
    element: <AddCropPlot />,
    route: Route,
  },
  {
    id: 205,
    path: routes.Transporter,
    name: "Transporter",
    element: <Transporter />,
    route: Route,
  },

  {
    id: 206,
    path: routes.AddTransporter,
    name: "AddTransporter",
    element: <AddTransporter />,
    route: Route,
  },

  {
    id: 207,
    path: routes.TranporterIndex,
    name: "TranporterIndex",
    element: <TranporterIndex />,
    route: Route,
  },
  {
    id: 208,
    path: routes.ServiceCharges,
    name: "ServiceCharges",
    element: <ServiceCharges />,
    route: Route,
  },
  {
    id: 209,
    path: routes.VyapariIndex,
    name: "VyapariIndex",
    element: <VyapariIndex />,
    route: Route,
  },
  {
    id: 210,
    path: routes.Vyapari,
    name: "Vyapari",
    element: <Vyapari />,
    route: Route,
  },
  {
    id: 211,
    path: routes.AddVyapari,
    name: "AddVyapari",
    element: <AddVyapari />,
    route: Route,
  },
  {
    id: 212,
    path: routes.Shop,
    name: "Shop",
    element: <Shop />,
    route: Route,
  },
  {
    id: 213,
    path: routes.AddShop,
    name: "AddShop",
    element: <AddShop />,
    route: Route,
  },
  {
    id: 214,
    path: routes.AddLeger,
    name: "AddLeger",
    element: <AddLeger />,
    route: Route,
  },
  {
    id: 215,
    path: routes.GateEntry,
    name: "GateEntry",
    element: <GateEntry />,
    route: Route,
  },
  {
    id: 216,
    path: routes.AddGateEntry,
    name: "AddGateEntry",
    element: <AddGateEntry />,
    route: Route,
  },
  {
    id: 217,
    path: routes.GateEntryIndex,
    name: "GateEntryIndex",
    element: <GateEntryIndex />,
    route: Route,
  },
  {
    id: 218,
    path: routes.Auction,
    name: "Auction",
    element: <Auction />,
    route: Route,
  },
  {
    id: 219,
    path: routes.AddAuction,
    name: "AddAuction",
    element: <AddAuction />,
    route: Route,
  },
  {
    id: 220,
    path: routes.AuctionIndex,
    name: "AuctionIndex",
    element: <AuctionIndex />,
    route: Route,
  },
  {
    id: 221,
    path: routes.QuickFarmer,
    name: "QuickFarmer",
    element: <QuickFarmer />,
    route: Route,
  },
  {
    id: 222,
    path: routes.QuickTransporter,
    name: "QuickTransporter",
    element: <QuickTransporter />,
    route: Route,
  },
  {
    id: 223,
    path: routes.MarketBillIndex,
    name: "MarketBillIndex",
    element: <MarketBillIndex />,
    route: Route,
  },
  {
    id: 224,
    path: routes.FarmerBillMaster,
    name: "FarmerBillMaster",
    element: <FarmerBillMaster />,
    route: Route,
  },
  {
    id: 225,
    path: routes.BankDetails,
    name: "BankDetails",
    element: <BankDetails />,
    route: Route,
  },
  {
    id: 227,
    path: routes.Vyaparilimit,
    name: "Vyaparilimit",
    element: <Vyaparilimit />,
    route: Route,
  },
  {
    id: 228,
    path: routes.AppNotification,
    name: "AppNotification",
    element: <AppNotification />,
    route: Route,
  },
  {
    id: 229,
    path: routes.AddAppNotification,
    name: "AddAppNotification",
    element: <AddAppNotification />,
    route: Route,
  },
  {
    id: 230,
    path: routes.AppAdminIndex,
    name: "AppAdminIndex",
    element: <AppAdminIndex />,
    route: Route,
  },
  {
    id: 231,
    path: routes.AutoLogout,
    name: "AutoLogout",
    element: <AutoLogout />,
    route: Route,
  },
  {
    id: 232,
    path: routes.CashInvert,
    name: "CashInvert",
    element: <CashInvert />,
    route: Route,
  },
  {
    id: 233,
    path: routes.AddCashInvert,
    name: "AddCashInvert",
    element: <AddCashInvert />,
    route: Route,
  },
  {
    id: 234,
    path: routes.BankDetails,
    name: "BankDetails",
    element: <BankDetails />,
    route: Route,
  },
  {
    id: 234,
    path: routes.AddBankDetails,
    name: "AddBankDetails",
    element: <AddBankDetails />,
    route: Route,
  },

  {
    id: 236,
    path: routes.CropMaster,
    name: "CropMaster",
    element: <CropMaster />,
    route: Route,
  },
  {
    id: 237,
    path: routes.VApproveMaster,
    name: "VApproveMaster",
    element: <VApproveMaster />,
    route: Route,

  },
  {
    id: 238,
    path: routes.VyapariApprove,
    name: "VyapariApprove",
    element: <VyapariApprove />,
    route: Route,

  },
  {
    id: 239,
    path: routes.CashCounter,
    name: "CashCounter",
    element: <CashCounter />,
    route: Route,

  },
  {
    id: 240,
    path: routes.VyapriBillMaster,
    name: "VyapriBillMaster",
    element: <VyapriBillMaster />,
    route: Route,

  },
  {
    id: 241,
    path: routes.VoucherIndex,
    name: "VoucherIndex",
    element: <VoucherIndex />,
    route: Route,

  },
  {
    id: 242,
    path: routes.Voucher,
    name: "Voucher",
    element: <Voucher />,
    route: Route,

  },
  {
    id: 242,
    path: routes.Reports,
    name: "Reports",
    element: <Reports />,
    route: Route,

  },

  {
    id: 243,
    path: routes.AddVoucher,
    name: "AddVoucher",
    element: <AddVoucher />,
    route: Route,

  },
  {
    id: 243,
    path: routes.ReportIndex,
    name: "ReportIndex",
    element: <ReportIndex />,
    route: Route,

  },
  {
    id: 302,
    path: routes.Samplereport,
    name: "Samplereport",
    element: <Samplereport />,
    route: Route,

  },
  {
    id: 244,
    path: routes.VyapariDashboardIndex,
    name: "VyapariDashboardIndex",
    element: <VyapariDashboardIndex />,
    route: Route,

  },
  {
    id: 244,
    path: routes.SatandingInstruction,
    name: "SatandingInstruction",
    element: <SatandingInstruction />,
    route: Route,

  },

  {
    id: 244,
    path: routes.CheckApproved,
    name: "CheckApproved",
    element: <CheckApproved />,
    route: Route,

  },
  {
    id: 245,
    path: routes.VideoMaster,
    name: "VideoMaster",
    element: <VideoMaster />,
    route: Route,

  },
  {
    id: 246,
    path: routes.AddVideo,
    name: "AddVideo",
    element: <AddVideo />,
    route: Route,

  },
  {
    id: 247,
    path: routes.Advertise,
    name: "Advertise",
    element: <Advertise />,
    route: Route,

  },
  {
    id: 248,
    path: routes.AddAdvertise,
    name: "AddAdvertise",
    element: <AddAdvertise />,
    route: Route,

  },
  {
    id: 249,
    path: routes.VyapariAuctionApprove,
    name: "VyapariAuctionApprove",
    element: <VyapariAuctionApprove />,
    route: Route,

  },
  {
    id: 250,
    path: routes.AddCompanyInfo,
    name: "AddCompanyInfo",
    element: <AddCompanyInfo />,
    route: Route,

  },
  {
    id: 251,
    path: routes.CompanyInfo,
    name: "CompanyInfo",
    element: <CompanyInfo />,
    route: Route,

  },
  {
    id: 252,
    path: routes.ColdStorage,
    name: "ColdStorage",
    element: <ColdStorage />,
    route: Route,

  },
  {
    id: 253,
    path: routes.CoolingIndex,
    name: "CoolingIndex",
    element: <CoolingIndex />,
    route: Route,

  },
  {
    id: 253,
    path: routes.AddColdStorage,
    name: "AddColdStorage",
    element: <AddColdStorage />,
    route: Route,

  },
  {
    id: 254,
    path: routes.Carets,
    name: "Carets",
    element: <Carets />,
    route: Route,

  },
  {
    id: 255,
    path: routes.PreCooling,
    name: "PreCooling",
    element: <PreCooling />,
    route: Route,

  },
  {
    id: 256,
    path: routes.EmployeeMaster,
    name: "EmployeeMaster",
    element: <EmployeeMaster />,
    route: Route,

  },
  {
    id: 257,
    path: routes.GalaAlotMaster,
    name: "GalaAlotMaster",
    element: <GalaAlotMaster />,
    route: Route,

  },
  {
    id: 257,
    path: routes.AddGalaAlot,
    name: "AddGalaAlot",
    element: <AddGalaAlot />,
    route: Route,

  },

  {
    id: 259,
    path: routes.KharchVoucher,
    name: "KharchVoucher",
    element: <KharchVoucher />,
    route: Route,

  },
  {
    id: 260,
    path: routes.DayEnd,
    name: "DayEnd",
    element: <DayEnd />,
    route: Route,

  },
  {
    id: 261,
    path: routes.DayEndIndex,
    name: "DayEndIndex",
    element: <DayEndIndex />,
    route: Route,

  },
  {
    id: 262,
    path: routes.VVapasiSlabDetail,
    name: "VVapasiSlabDetail",
    element: <VVapasiSlabDetail />,
    route: Route,

  },
  {
    id: 262,
    path: routes.VyapriBill,
    name: "VyapriBill",
    element: <VyapriBill />,
    route: Route,

  },
  {
    id: 263,
    path: routes.RokadaVyapariBharana,
    name: "RokadaVyapariBharana",
    element: <RokadaVyapariBharana />,
    route: Route,

  },
  {
    id: 264,
    path: routes.OnlineCounter,
    name: "OnlineCounter",
    element: <OnlineCounter />,
    route: Route,

  },
  {
    id: 265,
    path: routes.YapariSlabMaster,
    name: "YapariSlabMaster",
    element: <YapariSlabMaster />,
    route: Route,

  },
  {
    id: 266,
    path: routes.VyapariBharana,
    name: "VyapariBharana",
    element: <VyapariBharana />,
    route: Route,

  },
  {
    id: 267,
    path: routes.GateEntryAuction,
    name: "GateEntryAuction",
    element: <GateEntryAuction />,
    route: Route,

  },




];
export const posRoutes = [
  {
    id: 1,
    path: routes.pos,
    name: "pos",
    element: <Pos />,
    route: Route,
  },
];

export const pagesRoute = [
  {
    id: 1,
    path: routes.signin,
    name: "signin",
    element: <Signin />,
    route: Route,
  },
  {
    id: 2,
    path: routes.signintwo,
    name: "signintwo",
    element: <SigninTwo />,
    route: Route,
  },
  {
    id: 3,
    path: routes.signinthree,
    name: "signinthree",
    element: <SigninThree />,
    route: Route,
  },
  {
    id: 4,
    path: routes.register,
    name: "register",
    element: <Register />,
    route: Route,
  },
  {
    id: 5,
    path: routes.registerTwo,
    name: "registerTwo",
    element: <RegisterTwo />,
    route: Route,
  },
  {
    id: 6,
    path: routes.registerThree,
    name: "registerThree",
    element: <RegisterThree />,
    route: Route,
  },
  {
    id: 7,
    path: routes.forgotPassword,
    name: "forgotPassword",
    element: <Forgotpassword />,
    route: Route,
  },
  {
    id: 7,
    path: routes.forgotPasswordTwo,
    name: "forgotPasswordTwo",
    element: <ForgotpasswordTwo />,
    route: Route,
  },
  {
    id: 8,
    path: routes.forgotPasswordThree,
    name: "forgotPasswordThree",
    element: <ForgotpasswordThree />,
    route: Route,
  },
  {
    id: 9,
    path: routes.resetpassword,
    name: "resetpassword",
    element: <Resetpassword />,
    route: Route,
  },
  {
    id: 10,
    path: routes.resetpasswordTwo,
    name: "resetpasswordTwo",
    element: <ResetpasswordTwo />,
    route: Route,
  },
  {
    id: 11,
    path: routes.resetpasswordThree,
    name: "resetpasswordThree",
    element: <ResetpasswordThree />,
    route: Route,
  },
  {
    id: 12,
    path: routes.emailverification,
    name: "emailverification",
    element: <EmailVerification />,
    route: Route,
  },
  {
    id: 12,
    path: routes.emailverificationTwo,
    name: "emailverificationTwo",
    element: <EmailverificationTwo />,
    route: Route,
  },
  {
    id: 13,
    path: routes.emailverificationThree,
    name: "emailverificationThree",
    element: <EmailverificationThree />,
    route: Route,
  },
  {
    id: 14,
    path: routes.twostepverification,
    name: "twostepverification",
    element: <Twostepverification />,
    route: Route,
  },
  {
    id: 15,
    path: routes.twostepverificationTwo,
    name: "twostepverificationTwo",
    element: <TwostepverificationTwo />,
    route: Route,
  },
  {
    id: 16,
    path: routes.twostepverificationThree,
    name: "twostepverificationThree",
    element: <TwostepverificationThree />,
    route: Route,
  },
  {
    id: 17,
    path: routes.lockscreen,
    name: "lockscreen",
    element: <Lockscreen />,
    route: Route,
  },
  {
    id: 18,
    path: routes.error404,
    name: "error404",
    element: <Error404 />,
    route: Route,
  },
  {
    id: 19,
    path: routes.error500,
    name: "error500",
    element: <Error500 />,
    route: Route,
  },
  {
    id: 20,
    path: routes.comingsoon,
    name: "comingsoon",
    element: <Comingsoon />,
    route: Route,
  },
  {
    id: 21,
    path: routes.undermaintenance,
    name: "undermaintenance",
    element: <Undermaintainence />,
    route: Route,
  },
];
