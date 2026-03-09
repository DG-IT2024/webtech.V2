import React, { useState } from 'react'
import '../assets/styles/Dashboard.css'
import '../assets/styles/Components.css'
import Navbar from '../shared/components/layout/Navbar'
import Sidebar from '../shared/components/layout/Sidebar'
import DocumentsToggle from '../features/components/documents/DocumentsToggle'
// import AddDocumentNo from '../components/AddDocumentNo'
import AddNewEmp from '../features/components/employees/AddNewEmp'
import DashboardBanner from '../features/components/dashboard/DashboardBanner'

const Dashboard = () => {
const [activeView, setActiveView] = useState<"docs" | "addUser" | null>(null);

  return (
    <div>
        <Navbar />
        <div className='m-1 side-Menu'>
          <Sidebar
            onDocsClick={() => setActiveView("docs")}
            onAddUserClick={() => setActiveView("addUser")}
          />
          <div className="dashboard-content">
            {activeView === "docs" && <DocumentsToggle />}
            {activeView === "addUser" && <AddNewEmp />}
            <div>
                {activeView === null && <DashboardBanner />}

            </div>
            
          </div>
            {/* <AddDocumentNo /> */}
        </div>
    </div>
  )
}

export default Dashboard