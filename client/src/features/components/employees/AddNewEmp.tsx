import { useState, useEffect } from 'react'
import { X, Save, Edit2 } from "lucide-react";
import "../../../assets/styles/AddNewEmp.css";
import axios from 'axios';

const AddNewEmp = () => {
  // Create states for user inputs
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [users, setUsers] = useState<any[]>([]);
  const [userID, setEmployeeID] = useState("")
  const [fname, setFname] = useState("");
  const [mname, setMname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
    
  const fetchEmployees = async () => {
    const response = await axios.get("http://localhost:8080/aims/employees/allEmployees");
    setUsers(response.data.users ?? response.data ?? []);
  }
  useEffect (() =>{
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchEmployees();
  }, []);

//To empty input Fields
  function emptyInputComponents() {
    setEmployeeID("");
    setFname("");
    setMname("");
    setLname("");
    setEmail("");
    setUserName("");
    setPassword("");
    setRole("");
    setEditingId(null);
  }
  const handleUpdate = (index: number)=>{
    const selectedUser = users[index];
    setEditingId(selectedUser.userID);
    setEmployeeID(selectedUser.userID); 
    setFname(selectedUser.firstName);
    setMname(selectedUser.middleName);
    setLname(selectedUser.lastName);
    setEmail(selectedUser.email);
    setUserName(selectedUser.username);
    setPassword(selectedUser.password);
    setRole(selectedUser.role);
  }

  const handlebtnDelete = async() => {
    try{
      const response = await axios.delete(`http://localhost:8080/aims/employees/deleteEmployee/${userID}`);
      alert(response.data.message);
      fetchEmployees();
      setShowModal(false);
    }catch(error){
      alert(error);
    }
  }
    const handlebtnRegister= async () => {
    try{
      if(editingId === null){
        const response = await axios.post("http://localhost:8080/aims/employees/addEmployee", {
        userID: userID,
        fname: fname,
        mname: mname,
        lname: lname,
        email: email,
        userName: userName, 
        password: password,
        role: role
      });
      if(response.data.success){
        setUsers(response.data.users);
        alert(response.data.message);
        fetchEmployees();
        emptyInputComponents();
      }
      }else{
        alert(userID);
        const response = await axios.put(`http://localhost:8080/aims/employees/updateEmployee/${userID}`, {
          fname: fname,
          mname: mname,
          lname: lname,
          email: email,
          userName: userName, 
          password: password,
          role: role
        });
        alert(response.data.message);
        fetchEmployees();
        emptyInputComponents();
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }catch(error: any){
      // Axios throws an error for 401/500 status codes
      alert(error.response?.data?.message || "Failed to Add New Employee!");
    }

  }
  return (
    <div className="bg-body-tertiary m-2 main-Card min-height-center">

      {/* <!-- Modal --> */}
      {showModal && (
  <>
    {/* backdrop */}
    <div className="modal-backdrop fade show"></div>

    {/* modal */}
    <div
      className={`modal fade ${showModal ? "show" : ""}`}
      tabIndex={-1}
      aria-labelledby="staticBackdropLabel"
      aria-hidden={!showModal}
      style={{ display: showModal ? "block" : "none" }} // ensures visibility
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="staticBackdropLabel">
              Confirm to DELETE employee
            </h1>
            <button
              type="button"
              className="btn-close"
              onClick={() => setShowModal(false)}
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            Are you sure you want to delete this employee with ID No. <b>{userID}</b>?
          </div>
          <div className="modal-footer d-flex justify-content-center">
            <button type="button" className="btn btn-primary btn-yes" onClick={handlebtnDelete}>
              Yes
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </>
  )}

      <div className="add-emp">
        <h2 className="title">New Employee</h2>

        <div className="form-grid">
          <div className="form-group">
              <label>Employee ID</label>
              <input 
                type="text"
                autoComplete='off'
                value={userID}
                onChange={(e) => setEmployeeID(e.target.value)}/>
            </div>

          <div className="form-group">
            <label>Email</label>
            <input 
              type="email"
              autoComplete='off'
              value={email}
              onChange={(e) => setEmail(e.target.value)}/>
          </div>

          <div className="form-group">
            <label>First Name</label>
            <input 
              type="text"
              autoComplete='off'
              value={fname}
              onChange={(e) => setFname(e.target.value)}/>
          </div>
        
          <div className="form-group">
            <label>Username</label>
            <input 
              type="text"
              autoComplete='off'
              value={userName}
              onChange={(e) => setUserName(e.target.value)}/>
          </div>

          <div className="form-group">
            <label>Middle Name</label>
            <input 
              type="text"
              autoComplete='off'
              value={mname}
              onChange={(e) => setMname(e.target.value)}/>
          </div>

          <div className="form-group">
            <label>Temp Password</label>
            <input 
              type="password"
              autoComplete='off'
              value={password}
              onChange={(e) => setPassword(e.target.value)}/>
          </div>

          <div className="form-group">
            <label>Last Name</label>
            <input 
              type="text"
              autoComplete='off'
              value={lname}
              onChange={(e) => setLname(e.target.value)}/>
          </div>

          <div className="form-group">
            <label>Role</label>
            <select 
              value={role}
              onChange={(e) => setRole(e.target.value)}>
              <option></option>  
              <option value="Employee">Employee</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
        </div>

        <div className="actions">
          <button className="btn save {${editingId} " onClick={handlebtnRegister}>
            <Save size={18} /> {editingId ? "Update" : "Add"}
          </button>
          <button className="btn cancel" onClick={emptyInputComponents}>
            <X size={18} /> Cancel
          </button>
        </div>
      </div>

      <div className='row'>
      <div className='col-12 w-100'>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th className="w-13">Employee ID</th>
              <th className='w-13'>First Name</th>
              <th className='w-10'>Middle Name</th>
              <th className='w-13'>Last Name</th>
              <th className='w-13'>Email</th>
              <th className='w-13'>Username</th>
              <th className='w-13'>Temp Password</th>
              <th className='w-13'>Role</th>
              <th className='w-13'></th>
            </tr>
          </thead>
          <tbody>
          {!Array.isArray(users) || users.length === 0 ? (
            <tr>
              <td colSpan={9} className="text-center">
                No users found
              </td>
            </tr>
          ) : (
            users.map((user, index) => (
              <tr key={user._id}>
                <td>{user.userID}</td>
                <td>{user.firstName}</td>
                <td>{user.middleName}</td>
                <td>{user.lastName}</td>
                <td>{user.email}</td>
                <td>{user.username}</td>
                <td>{user.password}</td>
                <td>{user.role}</td>
                <td>
                  <div className='d-flex gap-3'>
                  <button className="btn-edit" onClick={() => handleUpdate(index)}>
                    <Edit2 size={18} />
                  </button>
                  <button type="button" className="btn-delete" onClick={() =>{
                    setEmployeeID(user.userID);
                    setShowModal(true);
                  }}>
                    <X size={18} />
                  </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
        </table>
      </div>
      </div>
    </div>
  );
};

export default AddNewEmp;