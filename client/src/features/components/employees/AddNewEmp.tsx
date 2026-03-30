/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react'
import { X, Save, Edit2 } from "lucide-react";
import "../../../assets/styles/AddNewEmp.css";
import api from '../../../shared/api';

const AddNewEmp = () => {
  // Create states for user inputs
  // Controls visibility of the delete confirmation modal
  const [showModal, setShowModal] = useState(false);

  // Stores the ID of the employee currently being edited (null means creating a new employee) 
  const [editingId, setEditingId] = useState<string | null>(null);

  // Stores the list of employees retrieved from the backend API
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [users, setUsers] = useState<any[]>([]);

  // Form input states
  const [userID, setEmployeeID] = useState("")
  const [fname, setFname] = useState("");
  const [mname, setMname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  // Validation error state
  const [errors, setErrors] = useState<any>({});
    
  const fetchEmployees = async () => {
   
    // Fetch all employees from backend API 
    const response = await api.get("/aims/employees/allEmployees");
    setUsers(response.data.users ?? response.data ?? []);
    const userID = await api.get("/aims/employees/newEmployee");
    setEmployeeID(userID.data.nextID);
  }

  useEffect (() =>{
    // Runs only once when the component mounts to initially load employees
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchEmployees();
  }, []);

  // Clears all form fields and resets editing mode
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
    setErrors({});
    fetchEmployees();
  }

  // Frontend validation
  const validateForm = () => {

    const newErrors:any = {};

    if(!fname.trim()){
      newErrors.fname = "First name is required";
    }

    if(!lname.trim()){
      newErrors.lname = "Last name is required";
    }

    if(!email.trim()){
      newErrors.email = "Email is required";
    } else if(!/\S+@\S+\.\S+/.test(email)){
      newErrors.email = "Invalid email format";
    }

    if(!userName.trim()){
      newErrors.userName = "Username is required";
    }

    if(!password.trim()){
      newErrors.password = "Password is required";
    } else if(password.length < 6){
      newErrors.password = "Password must be at least 6 characters";
    }

    if(!role){
      newErrors.role = "Please select a role";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  const handleUpdate = (index: number)=>{

    // Retrieve selected employee from table based on index and store in selectedUser variable
    const selectedUser = users[index];

    // Switch component to editing mode by setting editingId to the selected employee's ID and populating form fields with their data
    setEditingId(selectedUser.userID);
    
    // Populate form fields with selected employee data to allow user to edit existing employee information
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

      // Send DELETE request to backend to remove employee by ID
      const response = await api.delete(`/aims/employees/deleteEmployee/${userID}`);
      alert(response.data.message);
      
      // Refresh employee list after deletion
      fetchEmployees();

      // Close confirmation modal
      setShowModal(false);
    }catch(error){
      alert(error);
    }
  }

  const handlebtnRegister= async () => {
    // Run frontend validation before submitting
    if(!validateForm()){
      return;
    }

    // Confirmation UI
    const confirmAction = window.confirm(editingId ? "Update this employee?" : "Create this employee?");
    if(!confirmAction){
      return;
    }

    try{

      // If editingId is null → create a new employee
      if(editingId === null){
        const response = await api.post("/aims/employees/addEmployee", {
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

        // Update local employee list with the newly created employee (handles different response formats) 
        setUsers(response.data.users);

        alert(response.data.message);

        // Refresh employee table from server after successful creation to ensure data consistency (handles different response formats)
        fetchEmployees();
        
        // Clear form inputs and reset editing mode after successful creation
        emptyInputComponents();
      }

      }else{
        
        // If editingId exists → update existing employee
        const response = await api.put(`/aims/employees/updateEmployee/${userID}`, {
          fname: fname,
          mname: mname,
          lname: lname,
          email: email,
          userName: userName, 
          password: password,
          role: role
        });

        alert(response.data.message);
        
        // Refresh employee list after update to reflect changes (handles different response formats)
        fetchEmployees();

        // Reset form and exit editing mode after successful update  
        emptyInputComponents();
      }
      
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }catch(error: any){
      // Handles backend errors Axios throws an error for (401, 500, validation errors, etc.)
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
                disabled
                autoComplete='off'
                value={userID}
                onChange={(e) => setEmployeeID(e.target.value)}/>
              {errors.userID && <small className="text-danger">{errors.userID}</small>}
            </div>

          <div className="form-group">
            <label>Email</label>
            <input 
              type="email"
              autoComplete='off'
              value={email}
              onChange={(e) => setEmail(e.target.value)}/>
            {errors.email && <small className="text-danger">{errors.email}</small>}
          </div>

          <div className="form-group">
            <label>First Name</label>
            <input 
              type="text"
              autoComplete='off'
              value={fname}
              onChange={(e) => setFname(e.target.value)}/>
            {errors.fname && <small className="text-danger">{errors.fname}</small>}
          </div>
        
          <div className="form-group">
            <label>Username</label>
            <input 
              type="text"
              autoComplete='off'
              value={userName}
              onChange={(e) => setUserName(e.target.value)}/>
            {errors.userName && <small className="text-danger">{errors.userName}</small>}
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
            {errors.password && <small className="text-danger">{errors.password}</small>}
          </div>

          <div className="form-group">
            <label>Last Name</label>
            <input 
              type="text"
              autoComplete='off'
              value={lname}
              onChange={(e) => setLname(e.target.value)}/>
            {errors.lname && <small className="text-danger">{errors.lname}</small>}
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
            {errors.role && <small className="text-danger">{errors.role}</small>}
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