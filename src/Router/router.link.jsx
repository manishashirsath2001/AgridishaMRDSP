import React from "react";
import { Route, Navigate } from "react-router-dom";
import Dashboard from "../feature-module/dashboard/Dashboard";
import SalesDashbaord from "../feature-module/dashboard/salesdashbaord";
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
import FormWizard from "../feature-module/uiinterface/forms/formelements/form-wizard";
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
// import StoreList from "../core/modals/peoples/storelist";
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

import { all_routes } from "./all_routes";
import BankSettingGrid from "../feature-module/settings/financialsettings/banksettinggrid";
import Sortable from "../feature-module/uiinterface/ui-sortable";
import Swiperjs from "../feature-module/uiinterface/swiperjs";
import FormPikers from "../feature-module/uiinterface/forms/formelements/formpickers";
import Leaflet from "../feature-module/uiinterface/map/leaflet";
import BootstrapIcons from "../feature-module/uiinterface/icons/bootstrapicons";
import RemixIcons from "../feature-module/uiinterface/icons/remixIcons";
import TablerIcon from "../feature-module/uiinterface/icons/tablericon";
import PurchaseIndex from '../feature-module/purchases/PurchaseIndex';
import AddPurchaseInvoice from "../feature-module/purchases/AddPurchaseInvoice";
import AddPurchaseOrder from "../feature-module/purchases/AddPurchaseOrder";
import ClosePurchaseOrder from "../feature-module/purchases/ClosePurchaseOrder";
import ChallanIndex from "../feature-module/purchases/ChallanIndex";
import ReturnIndex from "../feature-module/purchases/ReturnIndex";
import ChallanReturn from "../feature-module/purchases/ChallanReturn";
import AppAdminIndex from "../feature-module/AppAdmin/AppAdminIndex";
import AutoLogout from "../InitialPage/Sidebar/AutoLogoout";
import AddVideo from "../feature-module/AppAdmin/AddVideo";
import VideoMaster from "../feature-module/AppAdmin/VideoMaster";
import AppNotification from "../feature-module/AppAdmin/AppNotification";
import AddAppNotification from "../feature-module/AppAdmin/AddAppNotification";
import Advertise from "../feature-module/AppAdmin/Advertise";
import AddAdvertise from "../feature-module/AppAdmin/AddAdvertise";
import AddCompanyInfo from "../feature-module/AppAdmin/AddCompanyInfo";
import CompanyInfo from "../feature-module/AppAdmin/CompanyInfo";
import DisplayNotification from '../feature-module/AppAdmin/DisplayNotification';
import GrapesVariety from '../feature-module/AppAdmin/GrapesVariety';
import AddGrapesVariety from '../feature-module/AppAdmin/AddGrapesVariety';
import RateList from '../feature-module/AppAdmin/RateList';
import AddRateList from '../feature-module/AppAdmin/AddRateList';
import GrapeList from '../feature-module/AppAdmin/GrapeList';
import AddGrapeList from '../feature-module/AppAdmin/AddGrapeList';
import AddAnnexure from '../feature-module/AppAdmin/AddAnnexure';
import Annexure from "../feature-module/AppAdmin/annexure";
import Notice from "../feature-module/AppAdmin/Notice";
import AddNotice from '../feature-module/AppAdmin/AddNotice';

export const publicRoutes = [
  {
    id: 1,
    path: routes.dashboard,
    name: "home",
    element: <Dashboard />,
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
    id: 10,
    path: routes.alerts,
    name: "alert",
    element: <Alert />,
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
    id: 39,
    path: routes.placeholder,
    name: "placeholder",
    element: <Placeholder />,
    route: Route,
  },
  {
    id: 40,
    path: routes.rating,
    name: "rating",
    element: <Rating />,
  },
  {
    id: 41,
    path: routes.texteditor,
    name: "text-editor",
    element: <TextEditor />,
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
    id: 148,
    path: routes.PurchaseIndex,
    name: "PurchaseIndex",
    element: <PurchaseIndex />,
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
    id: 158,
    path: routes.AddPurchaseOrder,
    name: "AddPurchaseOrder",
    element: <AddPurchaseOrder />,
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
    id: 246,
    path: routes.AddVideo,
    name: "AddVideo",
    element: <AddVideo />,
    route: Route,

  },
  {
    id: 246,
    path: routes.VideoMaster,
    name: "VideoMaster",
    element: <VideoMaster />,
    route: Route,

  },
  {
    id: 246,
    path: routes.AppNotification,
    name: "AppNotification",
    element: <AppNotification />,
    route: Route,

  },
  {
    id: 246,
    path: routes.AddAppNotification,
    name: "AddAppNotification",
    element: <AddAppNotification />,
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
    id: 268,
    path: routes.DisplayNotification,
    name: "DisplayNotification",
    element: <DisplayNotification />,
    route: Route,

  },
  {
    id: 268,
    path: routes.GrapesVariety,
    name: "GrapesVariety",
    element: <GrapesVariety />,
    route: Route,

  },
  {
    id: 268,
    path: routes.AddGrapesVariety,
    name: "AddGrapesVariety",
    element: <AddGrapesVariety />,
    route: Route,

  },
  {
    id: 268,
    path: routes.RateList,
    name: "RateList",
    element: <RateList />,
    route: Route,

  },
  {
    id: 268,
    path: routes.AddRateList,
    name: "AddRateList",
    element: <AddRateList />,
    route: Route,

  },
  {
    id: 268,
    path: routes.GrapeList,
    name: "GrapeList",
    element: <GrapeList />,
    route: Route,

  },
  {
    id: 268,
    path: routes.AddGrapeList,
    name: "AddGrapeList",
    element: <AddGrapeList />,
    route: Route,

  },

  {
    id: 268,
    path: routes.Annexure,
    name: "Annexure",
    element: <Annexure />,
    route: Route,

  },
  {
    id: 268,
    path: routes.AddAnnexure,
    name: "AddAnnexure",
    element: <AddAnnexure />,
    route: Route,

  },
  {
    id: 268,
    path: routes.Notice,
    name: "Notice",
    element: <Notice />,
    route: Route,

  },
  {
    id: 268,
    path: routes.AddNotice,
    name: "AddNotice",
    element: <AddNotice />,
    route: Route,

  },
];
export const posRoutes = [

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
