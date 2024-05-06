import React from 'react'
import { RouteObject } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import FormBuilderPage from "../pages/FormBuilderPage";
import TemplatesPage from "../pages/TemplatesPage";
import Error404 from '../pages/Error404';
import ReportBuilderPage from '../components/ReportBuilder/ReportBuilder';
import QueryBuilder from '../components/ReportBuilder/QueryBuilder';
import ProcedureBuilderPage from '../components/ReportBuilder/ProcedureBUilder';


const routes: RouteObject[] = [
  {
    path: "/",
    element: <MainLayout />,
    // errorElement: <Error404 />,
    children: [
      {
        path: "formbuilder/:formId",
        element: <FormBuilderPage />,
      },
      {
        path: "/",
        element: <TemplatesPage />,
      },
      {
        path: "reportBuilder",
        element: <ReportBuilderPage />,
      },
      {
        path: "queryBuilder",
        element: <ProcedureBuilderPage />,
      },
    ],
  },
];

export default routes;