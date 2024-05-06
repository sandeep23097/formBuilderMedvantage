import React, { FunctionComponent, useEffect, useState } from "react";

interface ReportBuilderPageProps {}

const ReportBuilderPage: FunctionComponent<ReportBuilderPageProps> = () => {
    return (
        <a
                href="/queryBuilder"
                className="logo vcenter"
                data-src-dark="/img/img-logo.png"
                style={{ fontFamily: "Cassannet", fontSize: "16px" }}
              >
               
                Query Builder
              </a>
      )
}

export default ReportBuilderPage;