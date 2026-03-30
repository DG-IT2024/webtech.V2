import React, { useState } from 'react'
import '../assets/styles/Dashboard.css'
import '../assets/styles/Components.css'
import Navbar from '../shared/components/layout/Navbar'
import Sidebar from '../shared/components/layout/Sidebar'
import DocumentsToggle from '../features/components/documents/DocumentsToggle'
// import AddDocumentNo from '../components/AddDocumentNo'
import AddNewEmp from '../features/components/employees/AddNewEmp'
import DashboardBanner from '../features/components/dashboard/DashboardBanner'
import MyDocuments from '../features/components/mydocuments/MyDocuments'



const Dashboard = () => {
const [activeView, setActiveView] = useState<"docs" | "addUser" | "myDocs" | null>(null);
  return (
    <div>

        {/* Top navigation bar displayed across the dashboard */} 
        <Navbar />

        <div className='m-1 side-Menu'>
          
          {/* Sidebar triggers view changes by updating activeView state */}
          <Sidebar
            onDocsClick={() => setActiveView("docs")}  // Switch to documents module
            onAddUserClick={() => setActiveView("addUser")} // Switch to add employee module
            onMyDocsClick={() => setActiveView("myDocs")} // Switch to my documents module
          />

          <div className="dashboard-content">

            {/* Render Documents module when activeView is "docs" */} 
            {activeView === "docs" && <DocumentsToggle />}
          
            {/* Render Add Employee module when activeView is "addUser" */}
            {activeView === "addUser" && <AddNewEmp />}

            {/* Render My Documents module when activeView is "myDocs" */}
            {activeView === "myDocs" && <MyDocuments />}

            <div>
              
                {/* Default dashboard view when no module is selected */}
                {activeView === null && <DashboardBanner />}

            </div>
            
          </div>
                {/* Placeholder for future feature: adding document numbers */}
                {/* <AddDocumentNo /> */}
        </div>
    </div>
  )
}

export default Dashboard