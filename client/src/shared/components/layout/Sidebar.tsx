import React from 'react'
import '../../../assets/styles/Components.css'

interface SidebarProps {
  onDocsClick?: () => void;
  onAddUserClick?: () => void;
  onMyDocsClick?: () => void;
  showAddUser?: boolean;
  showMyDocs?: boolean;
}
const Sidebar = ({ onDocsClick, onAddUserClick, onMyDocsClick, showAddUser = true, showMyDocs = true }: SidebarProps) => {
  
  return (
    <div>
        <div className="side-Bar min-height bg-body-tertiary my-2">
            <div>
                <img src="/doc.png" className="sidebar-Icons mx-5 mt-5" alt='Documents' onClick={() => onDocsClick && onDocsClick()} style={{cursor: 'pointer'}} />
                {showAddUser && (
                    <img src="/add-user.png" className="sidebar-Icons mx-5 mt-5" alt='Add User' onClick={() => onAddUserClick && onAddUserClick()} style={{cursor: 'pointer'}} />
                )}
                {showMyDocs && (
                    <img src="/my-docs.png" className="sidebar-Icons mx-5 mt-5" alt='My Docs' onClick={() => onMyDocsClick && onMyDocsClick()} style={{cursor: 'pointer'}} />
                )}
            </div>
            
        </div>
        
        
    </div>
  )
}

export default Sidebar