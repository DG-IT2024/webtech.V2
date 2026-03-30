import React from 'react'
import { Link } from "react-router-dom"

// Component displayed when the user navigates to a route that does not exist
const NotFoundPage = () => {
  return (
    <div>
      {/* Main message informing the user that the page cannot be found */} 
      <h1>Not Found Page!</h1>

      {/* React Router Link used to redirect the user back to the homepage */}
      <Link to={"/"}>
        
        {/* Button that triggers navigation to the home route */}
        <button>Go back Home</button>
      </Link>
    </div>
  )
}

export default NotFoundPage