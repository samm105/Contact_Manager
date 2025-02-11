import { useState, useEffect } from "react";
import ContactTable from "./ContactTable";

const App = () => {
  const [contactUser, setContactUser] = useState([]);
  const [loading, setLoading] = useState(false);

  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:5000/contacts");
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      const data = await response.json();
      console.log("Contacts:", data);
      setContactUser(data.contacts);
    } catch (error) {
      alert(error.message || "An unexpected Error occured");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      firstName: firstname, // match backend field name
      lastName: lastname, // match backend field name
      email,
    };

    const url = "http://127.0.0.1:5000/create_contact";
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
    try {
      const response = await fetch(url, options);
      if (response.status !== 200 && response.status !== 201) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
      console.log("Contact created successfully!");
      setFirstName("");
      setLastName("");
      setEmail("");
    } catch (error) {
      alert(error.message || "An unexpected error occured");
    }
  };

  return (
    <>
      <div className=" container d-flex flex-column align-items-center justify-content-center mt-5 ms-5">
        <h1> Contact Form </h1>
        <form
          onSubmit={handleSubmit}
          className="d-flex flex-column gap-4 my-4 col-12 col-md-6"
        >
          <input
            type="text"
            className="form-control"
            placeholder="First Name"
            value={firstname}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <input
            type="text"
            className="form-control"
            placeholder="Last Name"
            value={lastname}
            onChange={(e) => setLastName(e.target.value)}
          />
          <input
            type="email"
            className="form-control"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button type="submit" className="btn btn-dark">
            Add
          </button>
        </form>

        {/* Heading for table */}
        <div className="container-fluid my-4">
          <h2 className="text-start"> Available Contacts</h2>
        </div>
        <ContactTable
          contactUser={contactUser}
          setContactUser={setContactUser}
        />
      </div>
    </>
  );
};

export default App;
