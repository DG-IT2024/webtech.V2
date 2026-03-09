/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import "../../../assets/styles/ShareDocumentModal.css";
import axios from "axios";

interface ShareDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface User {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
}

const ShareDocumentModal: React.FC<ShareDocumentModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [search, setSearch] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [usersEmail, setUsersEmail] = useState<User[]>([]);

  const fetchEmployees = async () => {
    const response = await axios.get("http://localhost:8080/aims/employees/allEmployees");
    setUsersEmail(response.data.users ?? response.data ?? []);
  }

  useEffect (() =>{
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchEmployees();
  }, []);

  if (!isOpen) return null;

  const filteredUsers = usersEmail.filter((user) => {
    const keyword = search.toLowerCase();
      return (
        user.firstName.toLowerCase().includes(keyword) ||
        user.middleName.toLowerCase().includes(keyword) ||
        user.lastName.toLowerCase().includes(keyword) ||
        user.email.toLowerCase().includes(keyword)
      );
  });

  const toggleUserSelection = (user: User) => {
    const exists = selectedUsers.find((u) => u.email === user.email);

    if (exists) {
      setSelectedUsers(selectedUsers.filter((u) => u.email !== user.email));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
    setSearch(""); // clear search so user can search again
  };

  const handleShare = async () => {
    const emails = selectedUsers.map((u) => u.email);
    await axios.post("http://localhost:8080/aims/email/sendEmail", {
      emails: emails,
      subject: "Document Shared With You",
      message: "A document has been shared with you. Please check the system."
    });

    alert("Email notifications sent!");
  };

  return (
    <div className="share-modal-overlay">
      <div className="share-modal-container">
        <h3 className="share-modal-title">Share Document</h3>
        <input
          type="text"
          placeholder="Search users..."
          className="form-control share-modal-search"
          value={
             selectedUsers.length
            ? selectedUsers.map((u) => u.email).join(", ") + ", " + search
            : search
          }
          onChange={(e) => {
            const value = e.target.value;
            const lastComma = value.lastIndexOf(",");

            if (lastComma !== -1) {
              setSearch(value.substring(lastComma + 1).trim());
            } else {
              setSearch(value);
            }
          }}
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
            onClick={onClose}
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
