import React, { type ReactNode } from 'react'

// Defines the properties the Alert component expects
interface Props{
    children: ReactNode;
    onClose: () => void;
}

const Alert = ({ children, onClose }: Props) => {
  return (
    // Bootstrap alert container with dismissible behavior  
    <div className="alert alert-warning alert-dismissible">{ children }

        {/* Close button triggers the onClose callback to remove/hide the alert */}
        <button type="button" className="btn-close" onClick={onClose} data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
  )
}

export default Alert 