import React from 'react'

// Declaring array for Type of documents
 const items = [
    '--SELECT--',
    'Administrative Order',
    'Memorandum Circular',
    'Office Circular',
    'Office Memorandum',
    'Office Order',
    'Resolution',
    'CSC Issuance',
    'OLA Opinion',
    'MOA / MOU',
    'Project Contract',
    'Memorandum Order'
  ]; 
  
const AddDocumentNo = () => {
  return (
    <div>
      <div>
        <h2 className='text-center'>Generate Document Number</h2>

        <form className="d-flex align-items-center g-3">
            <div className="row w-75 justify-content-center">
                <div className="col-md-6 mb-3">
                <label htmlFor="inputState" className="form-label">Issuance Type</label>
                <select id="inputState" className="form-select text-center">
                    {items.map(item => (
                    <option key={item}>{item}</option>
                    ))}
                </select>
                </div>
            </div>
            <div className="mb-3 justify-content-center">
              <button type="submit" className="btn btn-primary">Genarate</button>
            </div>
        </form>
      </div>
    </div>
  )
}

export default AddDocumentNo