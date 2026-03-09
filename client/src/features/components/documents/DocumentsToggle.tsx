import React, { useState } from 'react'
import AddDocumentNo from './AddDocumentNo';
import IncomingDoc from './IncomingDoc';
import UploadDoc from './UploadDoc';
import SearchDoc from './SearchDoc';

const items = [
  'Generate Document Number',
  'Upload Document',
  'Search Document',
  'Incoming Document'
]

const DocumentsToggle = () => {
  // 1. State to track the active index (default to 0)
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  // 2. Helper function to render the correct component
  const renderComponent = () => {
    switch (activeIndex) {
      case 0: return <AddDocumentNo />;
      case 1: return <UploadDoc />;
      case 2: return <SearchDoc />;
      case 3: return <IncomingDoc />;
      default: return null;
    }
  };

  return (
    <div>
      <div className='bg-body-tertiary m-2 side-Toggle-Menu min-height'>
        <div className="list-group">
           {items.map((item, index) => 
           <a key={item} href="#"
           onClick={(e) => {e.preventDefault(); 
            setActiveIndex(index);
           }}
           // 4. Visual feedback for active item
              className={`list-group-item list-group-item-action ${activeIndex === index ? 'active' : ''}`}
            >
              {item}
            </a>
          )} 
        </div>
        <div className='bg-body-tertiary my-4 main-Card min-height-center'>
          {renderComponent()}
        </div>
      </div>
    </div>
  )
}

export default DocumentsToggle