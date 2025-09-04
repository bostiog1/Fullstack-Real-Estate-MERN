import React, { useState } from "react";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form data submitted:", formData);
    setShowConfirmation(true);
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <>
      <style>
        {`
          .contactPage {
            display: flex;
            flex-direction: column;
            height: 100%;
          }

          @media (min-width: 768px) {
            .contactPage {
              flex-direction: row;
            }
          }

          .formContainer {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding: 3rem 1rem;
          }
          
          @media (min-width: 768px) {
            .formContainer {
              padding-left: 50px;
              padding-right: 50px;
            }
          }
          @media (min-width: 1024px) {
            .formContainer {
              padding-left: 100px;
              padding-right: 100px;
            }
          }

          .formCard {
            background-color: white;
            padding: 2rem;
            border-radius: 0.75rem;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            border: 1px solid #e5e7eb;
          }

          .formTitle {
            font-size: 1.5rem;
            font-weight: bold;
            color: #1f2937;
            margin-bottom: 1.5rem;
          }

          .formGroup {
            margin-bottom: 1.5rem;
          }

          .formLabel {
            display: block;
            font-size: 0.875rem;
            font-weight: 500;
            color: #374151;
            margin-bottom: 0.5rem;
          }

          .formInput,
          .formTextarea {
            display: block;
            width: 100%;
            padding: 0.5rem 0.75rem;
            border-radius: 0.375rem;
            border: 1px solid #d1d5db;
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
          }

          .formInput:focus,
          .formTextarea:focus {
            outline: 2px solid transparent;
            outline-offset: 2px;
            border-color: #3b82f6;
          }

          .formButton {
            width: 100%;
            padding: 0.75rem 1rem;
            background-color: #3b82f6;
            color: white;
            border: none;
            border-radius: 0.375rem;
            font-weight: 600;
            cursor: pointer;
            transition: background-color 0.3s;
          }

          .formButton:hover {
            background-color: #2563eb;
          }

          .infoContainer {
            flex: 1;
            background-color: #fcf5f3;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 3rem;
          }

          .infoCard {
            width: 100%;
            max-width: 24rem;
            background-color: #3b82f6;
            color: white;
            padding: 2rem;
            border-radius: 0.75rem;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }

          .infoTitle {
            font-size: 1.5rem;
            font-weight: bold;
            margin-bottom: 1.5rem;
          }

          .infoItem {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            margin-bottom: 1rem;
          }

          .infoIcon {
            height: 1.5rem;
            width: 1.5rem;
            fill: currentColor;
          }

          .modalContainer {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: rgba(0, 0, 0, 0.5);
          }

          .modalContent {
            background-color: white;
            padding: 2rem;
            border-radius: 0.5rem;
            box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
            text-align: center;
          }

          .modalTitle {
            font-size: 1.25rem;
            font-weight: bold;
            margin-bottom: 1rem;
          }

          .modalButton {
            margin-top: 1.5rem;
            padding: 0.5rem 1rem;
            background-color: #3b82f6;
            color: white;
            border-radius: 0.375rem;
            cursor: pointer;
            transition: background-color 0.3s;
          }
          
          .modalButton:hover {
            background-color: #2563eb;
          }
        `}
      </style>
      <div className="contactPage">
        {/* Form Container */}
        <div className="formContainer">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-8">
            Contact Us
          </h1>
          <div className="formCard">
            <h2 className="formTitle">Send us a message</h2>
            <form onSubmit={handleSubmit}>
              <div className="formGroup">
                <label htmlFor="name" className="formLabel">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="formInput"
                  required
                />
              </div>
              <div className="formGroup">
                <label htmlFor="email" className="formLabel">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="formInput"
                  required
                />
              </div>
              <div className="formGroup">
                <label htmlFor="message" className="formLabel">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  className="formTextarea"
                  required
                ></textarea>
              </div>
              <button type="submit" className="formButton">
                Send Message
              </button>
            </form>
          </div>
        </div>

        {/* Info Container */}
        <div className="infoContainer">
          <div className="infoCard">
            <h2 className="infoTitle">Our Information</h2>
            <div className="infoItem">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 384 512"
                className="infoIcon"
              >
                <path d="M168.3 499.2C110.4 482.3 0 361.6 0 248 0 111.4 114.6 0 256 0s256 111.4 256 248c0 113.6-110.4 234.3-168.3 251.2-36.8 11.2-76.8 11.2-113.5 0zM256 128c35.3 0 64 28.7 64 64s-28.7 64-64 64-64-28.7-64-64 28.7-64 64-64z" />
              </svg>
              <p>Iulie Maniu 3, Bucharest, 69420</p>
            </div>
            <div className="infoItem">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                className="infoIcon"
              >
                <path d="M164.9 24.6c-7.7-18.6-28-28.8-47.9-28.8s-40.2 10.2-47.9 28.8L73.9 84.5C21.4 199.1 82.5 359.8 196.9 414.7l22.1 10.5c18.3 8.7 39.8 5.7 54.8-6.4l26.6-21.7c8.8-7.2 14.8-17.7 17.5-29.2s-.7-23.4-9.2-32.2l-51.7-52c-8.8-8.9-22.8-11.4-34.4-6.9L164.9 24.6z" />
              </svg>
              <p>+1 (555) 123-4567</p>
            </div>
            <div className="infoItem">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                className="infoIcon"
              >
                <path d="M498.1 5.6C510.9 9.4 518 20.3 512 33.4l-64 256c-6 23.9-30.6 37.9-54.5 34.9l-265-33.1c-24.9-3.1-45.2-22.3-48.4-47.3L1.6 83.2c-3.2-25 15-48.4 39.9-51.5L462.6 1.4c25-3.2 48.4 15 51.5 39.9z" />
              </svg>
              <p>contact@boost.com</p>
            </div>
          </div>
        </div>

        {showConfirmation && (
          <div className="modalContainer">
            <div className="modalContent">
              <h3 className="modalTitle">Message Sent!</h3>
              <p>
                Thank you for your message! We will get back to you shortly.
              </p>
              <button
                className="modalButton"
                onClick={() => setShowConfirmation(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ContactPage;
