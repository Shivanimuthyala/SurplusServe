// Updated ReceiverPage.js to replace alert messages with modal messages
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import useNavigate
import logo from './assets/Images/Surplus3.png'; 
import Modal from './Modal'; // Import the Modal component
import './assets/styles/Receiver.css';

const ReceiverPage = () => {
  const [formData, setFormData] = useState({
    receiverName: '',
    phoneNumber: '',
    location: '',
    category: '',
    donorId: '',
    requiredQuantity: '',
    date: '',
  });
  const [donors, setDonors] = useState([]);
  const [errors, setErrors] = useState({
    receiverName: '',
    phoneNumber: '',
  });
  const [noFoodMessage, setNoFoodMessage] = useState(''); // State for displaying no food message
  const [modalMessage, setModalMessage] = useState(''); // State for modal message
  const [showModal, setShowModal] = useState(false); // State to show/hide modal

  const receiverNameRegex = /^[^\d][a-zA-Z\s]{2,}$/; // Regex for valid receiver name
  const phoneNumberRegex = /^[6-9]\d{9}$/; // Regex for valid phone number

  // Validation function
  const validateForm = () => {
    let formErrors = {};

    // Validate receiver name
    if (!receiverNameRegex.test(formData.receiverName)) {
      formErrors.receiverName = 'Name should be at least 2 characters and not start with a number';
    }

    // Validate phone number
    if (!phoneNumberRegex.test(formData.phoneNumber)) {
      formErrors.phoneNumber = 'Phone number must be 10 digits and start with 6-9';
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0; // Return true if no errors
  };

  // Fetch donors based on category
  const fetchDonors = async (category) => {
    try {
      const response = await axios.get('http://localhost:5000/api/receiver/donors', {
        params: { category },
      });

      const availableDonors = response.data.filter((donor) => donor.availableQuantity > 0);

      if (availableDonors.length === 0) {
        setNoFoodMessage('No food available for this category at the moment');
      } else {
        setNoFoodMessage(''); // Clear the message if donors are available
      }

      setDonors(availableDonors);
    } catch (error) {
      console.error('Error fetching donors:', error);
      setModalMessage('Error fetching donors!');
      setShowModal(true);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'category') {
      setFormData({ ...formData, [name]: value, donorId: '', requiredQuantity: '' });
      fetchDonors(value);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) return; // Prevent submission if there are errors

    try {
      await axios.post('http://localhost:5000/api/receiver', formData);
      setModalMessage('Receiver details submitted successfully!');
      setShowModal(true);
      setFormData({
        receiverName: '',
        phoneNumber: '',
        location: '',
        category: '',
        donorId: '',
        requiredQuantity: '',
        date: '',
      });
      setDonors([]);
      setNoFoodMessage(''); // Clear the message after successful submission
      setErrors({}); // Reset errors
    } catch (error) {
      console.error('Error submitting receiver details:', error);
      setModalMessage('Error submitting receiver details!');
      setShowModal(true);
    }
  };

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  return (
    <div>
      {/* Navbar Section */}
      <nav className="navbar navbar-expand-lg navbar-light">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            <img src={logo} alt="SurplusServe Logo" className="logo" />
          </Link>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ml-auto"> 
              <li className="nav-item">
                <Link className="nav-link" to="/">Logout</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div className="receiver-container">
        <div className="receiver-box">
          <h2>Receiver Form</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <input
                type="text"
                name="receiverName"
                value={formData.receiverName}
                onChange={handleChange}
                placeholder="Enter receiver's name"
                required
              />
              {errors.receiverName && <div className="error">{errors.receiverName}</div>}
            </div>
            <div>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Enter phone number"
                required
              />
              {errors.phoneNumber && <div className="error">{errors.phoneNumber}</div>}
            </div>
            <div>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Enter location"
                required
              />
            </div>
            <div>
              <select name="category" value={formData.category} onChange={handleChange} required>
                <option value="">Select category</option>
                <option value="consumption">For Consumption</option>
                <option value="animals">For Animals</option>
                <option value="compost">For Compost</option>
              </select>
            </div>
            {noFoodMessage && <p>{noFoodMessage}</p>} {/* Display the message if no food is available */}
            <div>
              <select
                name="donorId"
                value={formData.donorId}
                onChange={handleChange}
                required
              >
                <option value="">Select Donor</option>
                {donors.length > 0
                  ? donors.map((donor) => (
                      <option key={donor._id} value={donor._id}>
                        {donor.donorName} (Available: {donor.availableQuantity}
                        {formData.category === 'consumption' ? ' persons' : ' kgs'})
                      </option>
                    ))
                  : <option value="" disabled>No donors available</option>}
              </select>
            </div>
            <div>
              <input
                type="number"
                name="requiredQuantity"
                value={formData.requiredQuantity}
                onChange={handleChange}
                min="1"
                max={
                  donors.find((donor) => donor._id === formData.donorId)?.availableQuantity || 0
                }
                placeholder="Enter required quantity"
                required
              />
            </div>
            <div>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                min={today} // Restrict past dates
                placeholder="Select a date"
                required
              />
            </div>
            <button type="submit" disabled={!formData.donorId || !formData.requiredQuantity}>
              Submit
            </button>
          </form>
        </div>
      </div>

      {/* Modal Component */}
      {showModal && (
        <Modal
          message={modalMessage}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default ReceiverPage;
