/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import "../../../assets/styles/ShareDocumentModal.css";
import api from "../../../shared/api";

interface ShareDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentNo: string | null;
  issuanceType: string | null;
}

// Defines the structure of user objects received from the backend
interface User {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
}

const ShareDocumentModal: React.FC<ShareDocumentModalProps> = ({
  isOpen,
  onClose,
  documentNo,
  issuanceType
}) => {

  // Stores the search input used to filter users
  const [search, setSearch] = useState("");

  // Stores users that have been selected to receive the shared document
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  // Stores the full list of employees fetched from the backend
  const [usersEmail, setUsersEmail] = useState<User[]>([]);

  // Fetch all employees from the backend so they can be searched and selected
  const fetchEmployees = async () => {
    const response = await api.get("/aims/employees/allEmployees");
  
    // Some APIs wrap the data inside response.data.users while others return directly
  
   // This fallback ensures the component works with both response formats
    setUsersEmail(response.data.users ?? response.data ?? []);
  }

  useEffect (() =>{
      // eslint-disable-next-line react-hooks/set-state-in-effect
      // Runs only once when the modal component mounts
      // Retrieves the list of employees available for sharing
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchEmployees();
  }, []);

  // If the modal is not open, render nothing
  if (!isOpen) return null;
  // Filters users dynamically based on the search keyword
  // Matches against first name, middle name, last name, or email
  const filteredUsers = usersEmail.filter((user) => {
    const keyword = search.toLowerCase();
      return (
        user.firstName.toLowerCase().includes(keyword) ||
        user.middleName.toLowerCase().includes(keyword) ||
        user.lastName.toLowerCase().includes(keyword) ||
        user.email.toLowerCase().includes(keyword)
      );
  });

  // Adds or removes a user from the selected users list when they are clicked
  const toggleUserSelection = (user: User) => {
    const exists = selectedUsers.find((u) => u.email === user.email);

    if (exists) {
      // If the user is already selected, remove them from the list
      setSelectedUsers(selectedUsers.filter((u) => u.email !== user.email));
    } else {
      // Otherwise add them to the selected users list
      setSelectedUsers([...selectedUsers, user]);
    }
    setSearch(""); // Clear search input after selection to allow new searches
  };

  //Empty the storage after successfully forwarded
  const successForwarded = () => {
    setSearch("");
    setSelectedUsers([]);
  }
  //Handle cancel button or close the modal
  const handleClose = () => {
    setSearch("");
    setSelectedUsers([]);
    onClose();
  };

 const handleShare = async () => {
    // Confirmation for sharing documents
    const confirmed = window.confirm("Are you sure you want to share the document?");
    if(!confirmed) return;

    if(selectedUsers.length === 0){
      alert("Please select at least one user.");
      return;
    }

    try {
      const emails = selectedUsers.map((u) => u.email);

      // Send email notifications — failure here should not block document sharing
      try {
        const emailNotification = await api.post("/aims/emailNotification/sendEmail", {
          emails: emails,
          subject: issuanceType+" No. "+documentNo,
          message: "You have new document forwarded from records section!"
        });
        if(emailNotification.data.success){
          alert(emailNotification.data.message);
        }
      } catch {
        console.warn("Email notification failed, proceeding with share.");
      }

      // Updating share documents model
      const response = await api.post("/aims/documents/shareDocument", {
        emails: emails,
        documentNo: documentNo
      });
      alert(response.data.message);
      if(response.data.success){
        successForwarded();
      }
    } catch (error) {
      console.error("Share failed:", error);
      alert("Something went wrong while sharing the document.");
    }
  };

  return (
    <div className="share-modal-overlay">
      <div className="share-modal-container">
        <h3 className="share-modal-title">Share Document</h3>

        <input
          type="text"
          placeholder="Search users..."
          className="form-control share-modal-search"
          
          // Displays selected user emails as tags-like text
          value={
             selectedUsers.length
            ? selectedUsers.map((u) => u.email).join(", ") + ", " + search
            : search
          }

          // Handles dynamic typing after the last comma
          // Allows multiple users to be selected like email recipients
          onChange={(e) => {
            const value = e.target.value;
            const lastComma = value.lastIndexOf(",");

            if (lastComma !== -1) {
              setSearch(value.substring(lastComma + 1).trim());
            } else {
              setSearch(value);
            }
          }}
          
          // Allows removing the last selected user using backspace 
          onKeyDown={(e) => {
            if (e.key === "Backspace" && search === "" && selectedUsers.length > 0) {
              setSelectedUsers(selectedUsers.slice(0, -1));
            }
          }}
        />

        <div className="share-modal-users">
          {filteredUsers.map((user, index) => (
            <div
              key={index}
              className={`share-modal-user ${
                selectedUsers.some((u) => u.email === user.email) ? "selected" : ""
              }`}
              onClick={() => toggleUserSelection(user)}
            >
              <div>
                <strong>{user.firstName+" "+user.middleName+" "+user.lastName}</strong>
                <div className="share-modal-email">{user.email}</div>
              </div>
            </div>
          ))}
          {filteredUsers.length === 0 && (
            <div className="text-center mt-2">No users found.</div>
          )}
        </div>

        <div className="share-modal-actions">
          <button
            className="btn btn-primary search-btn-cancel"
            onClick={handleClose}
          >
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleShare}>Share</button>
        </div>
      </div>
    </div>
  );
};

export default ShareDocumentModal;
