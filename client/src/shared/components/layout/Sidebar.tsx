import React from 'react'
import '../../../assets/styles/Components.css'

interface SidebarProps {
  onDocsClick: () => void;
  onAddUserClick: () => void;
}
const Sidebar = ({ onDocsClick, onAddUserClick }: SidebarProps) => {
  
  return (
    <div>
        <div className="side-Bar min-height bg-body-tertiary my-2">
            <div>
                <img src="/doc.png" className="sidebar-Icons mx-5 mt-5" alt='User' onClick={onDocsClick} style={{cursor: 'pointer'}} />
                <img src="/add-user.png" className="sidebar-Icons mx-5 mt-5" alt='User' onClick={onAddUserClick} style={{cursor: 'pointer'}} />
            </div>
            
        </div>
        
        
    </div>
  )
}

export default Sidebar