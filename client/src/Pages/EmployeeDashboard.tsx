import React, { useState } from "react";
import "../assets/styles/Dashboard.css";
import "../assets/styles/Components.css";

import Navbar from "../shared/components/layout/Navbar";
import Sidebar from "../shared/components/layout/Sidebar";

import EmployeeDocumentsToggle from "../features/components/documents/EmployeeDocumentsToggle";
import DashboardBanner from "../features/components/dashboard/DashboardBanner";
import MyDocuments from '../features/components/mydocuments/MyDocuments'

const EmployeeDashboard = () => {

  const [activeView, setActiveView] = useState<"docs" | "myDocs" | null>(null);

  return (
    <div>

      
      <Navbar />

      <div className="m-1 side-Menu">

        <Sidebar
          showAddUser={false}
          onDocsClick={() => setActiveView("docs")}  // Switch to documents module
          onMyDocsClick={() => setActiveView("myDocs")} // Switch to my documents module
        />

        
        <div className="dashboard-content">
          {activeView === "docs" && <EmployeeDocumentsToggle />}
          {activeView === "myDocs" && <MyDocuments />}

          <div>
            {activeView === null && <DashboardBanner />}
          </div>
          

        </div>

      </div>

    </div>
  );
};

export default EmployeeDashboard;