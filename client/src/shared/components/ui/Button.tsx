import React from "react"

// Defines the expected properties (props) for the Button component
interface Props {
    children: string; // Text that will appear inside the button
    color: string;  // Determines the button style (ex: primary, danger, success)
    onClick: () => void;
}

// Reusable Button component that receives props and renders a styled button
const Button = ({ children, onClick, color }: Props) => {
  return (
    <div>
      {/* Button element that applies dynamic Bootstrap styling and handles click events */}  
      <button className={'btn btn-' + color} onClick={onClick}>{ children }</button> {/* Displays the text passed into the component */}
    </div>
  )
}

export default Button // Allows this component to be imported and used in other files