import React, { useState } from "react";
import IncomingDoc from "./IncomingDoc";
import SearchDoc from "./SearchDoc";

const items = [
  "Search Document",
  "Incoming Document"
];

const EmployeeDocumentsToggle = () => {

  const [activeIndex, setActiveIndex] = useState<number>(-1);

  const renderComponent = () => {
    switch (activeIndex) {
      case 0:
        return <SearchDoc />;
      case 1:
        return <IncomingDoc />;
      default:
        return null;
    }
  };

  return (
    <div>

      <div className="bg-body-tertiary m-2 side-Toggle-Menu min-height">

        <div className="list-group">

          {items.map((item, index) => (
            <a
              key={item}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setActiveIndex(index);
              }}
              className={`list-group-item list-group-item-action ${
                activeIndex === index ? "active" : ""
              }`}
            >
              {item}
            </a>
          ))}

        </div>

        <div className="bg-body-tertiary my-4 main-Card min-height-center">
          {renderComponent()}
        </div>

      </div>

    </div>
  );
};

export default EmployeeDocumentsToggle;