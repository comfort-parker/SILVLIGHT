import React from 'react'
import './Contact.css'
import chat from '../../assets/chat.png'
import telephone from '../../assets/telephone.png'
import loc from '../../assets/loc.png'
import letter from '../../assets/letter.png'
import right from '../../assets/right.png'

const Contact = () => {
  const [result, setResult] = React.useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    setResult("Sending....");
    const formData = new FormData(event.target);

    formData.append("access_key", "397e3a6d-83e6-4c51-9ec3-61531a109c99");

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData
    });

    const data = await response.json();

    if (data.success) {
      setResult("Form Submitted Successfully ");
      event.target.reset();
    } else {
      console.log("Error", data);
      setResult("Something went wrong ");
    }
  };

  return (
    <div className="contact">
      {/* Left Column */}
      <div className="contact-col card">
        <h3>Contact Us <img src={chat} alt="" /></h3>
        <p>
          We’d love to hear from you! Whether you have questions, feedback, 
          or simply want to say hello, feel free to reach out.
        </p>
        <ul>
          <li><img src={letter} alt="" /> comforttparker@gmail.com</li>
          <li><img src={telephone} alt="" /> 0557396276</li>
          <li><img src={loc} alt="" /> Kasoa Street, Weija <br /> Ga South 312</li>
        </ul>
      </div>

      {/* Right Column */}
      <div className="contact-col card">
        <form onSubmit={onSubmit}>
          <label htmlFor="name">Full Name *</label>
          <input type="text" name="name" placeholder="Enter your name" required />

          <label htmlFor="phone">Phone *</label>
          <input type="tel" name="phone" placeholder="Enter your phone number" required />

          <label htmlFor="message">Message *</label>
          <textarea 
            name="message" 
            rows="6" 
            placeholder="Write your message here..." 
            required
          ></textarea>

          <button type="submit" className="btn">
            Send Message <img src={right} alt="" />
          </button>
        </form>
        <span className="form-result">{result}</span>
      </div>
    </div>
  )
}

export default Contact
