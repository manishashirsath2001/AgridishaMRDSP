import React from "react";
import { Route, Navigate } from "react-router-dom";
import { all_routes } from "./all_routes";

const routes = all_routes;

import Signin from "../feature-module/pages/login/signin";

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
  {
    id: 116,
    path: "*",
    name: "NotFound",
    element: <Navigate to="/signin" />,
    route: Route,
  },
  {
    id: 117,
    path: '/',
    name: 'Root',
    element: <Navigate to="/signin" />,
    route: Route,
  },
];

export const posRoutes = [];

export const pagesRoute = [
  {
    id: 1,
    path: routes.signin,
    name: "signin",
    element: <Signin />,
    route: Route,
  },
];
