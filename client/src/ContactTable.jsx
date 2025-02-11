import { useState } from "react";

const ContactTable = ({ contactUser, setContactUser }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingContact, setEditingContact] = useState(null);

  const openModal = (contact) => {
    setShowModal(true);
    setEditingContact(contact);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingContact(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingContact((prev) => ({ ...prev, [name]: value }));
  };

  const saveChanges = async () => {
    if (!editingContact) {
      alert("Invalid contact id");
      return;
    }

    console.log(editingContact);
    console.log("Editing contact ID:", editingContact?.id);

    try {
      const response = await fetch(
        `http://127.0.0.1:5000/updatecontact/${editingContact.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(editingContact),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
      //  const updated_contact = await response.json();

      setContactUser((prev) =>
        prev.map((contact) =>
          contact.id == editingContact.id
            ? { ...contact, ...editingContact }
            : contact
        )
      );
      closeModal();
    } catch (error) {
      alert(error.message || "Failed to update contact");
    }
  };

  return (
    <>
      <div className="container flex-column mt-3 ms-5   ">
        <table className="table table-bordered mx-auto table-responsive">
          <thead>
            <tr>
              <th scope="col">First Name</th>
              <th scope="col">Last Name</th>
              <th scope="col">Email</th>
              <th className="w-25" scope="col">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {contactUser.map((contact) => (
              <tr key={contact.id}>
                <td>{contact.firstName}</td>
                <td>{contact.lastName}</td>
                <td>{contact.email}</td>
                <td className="w-25 p-2">
                  {/* Modal opening button */}
                  <button
                    onClick={() => openModal(contact)}
                    className="btn btn-dark me-2"
                  >
                    Update
                  </button>

                  {/* Modal */}
                  {showModal && (
                    <>
                      <div
                        className="modal show d-block"
                        tabIndex="-1"
                        aria-labelledby="staticBackdropLabel"
                        aria-hidden="true"
                      >
                        {/* Modal Header */}
                        <div className="modal-dialog modal-dialog-centered">
                          <div className="modal-content">
                            <div className="modal-header">
                              <h1
                                className="modal-title fs-5"
                                id="staticBackdropLabel"
                              >
                                Update Contact
                              </h1>
                              <button
                                onClick={closeModal}
                                className="btn-close"
                                aria-label="Close"
                              ></button>
                            </div>
                            {/* Modal body */}
                            <div className="modal-body">
                              <form className=" container d-flex flex-column gap-4 my-4">
                                <input
                                  type="text"
                                  placeholder="FirstName"
                                  name="firstName"
                                  className="form-control"
                                  value={editingContact.firstName}
                                  onChange={handleInputChange}
                                />
                                <input
                                  type="text"
                                  placeholder="LastName"
                                  name="lastName"
                                  className="form-control"
                                  value={editingContact.lastName}
                                  onChange={handleInputChange}
                                />
                                <input
                                  type="email"
                                  placeholder="Email"
                                  name="email"
                                  className="form-control"
                                  value={editingContact.email}
                                  onChange={handleInputChange}
                                />
                              </form>
                            </div>

                            {/* Modal Footer */}
                            <div className="modal-footer">
                              <button
                                onClick={closeModal}
                                className="btn btn-dark"
                              >
                                Close
                              </button>

                              <button
                                onClick={saveChanges}
                                className="btn btn-dark"
                              >
                                Submit
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Backdrop */}
                      <div className="modal-backdrop bg-dark bg-opacity-50"></div>
                    </>
                  )}

                  <button type="button" className="btn btn-dark">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ContactTable;
