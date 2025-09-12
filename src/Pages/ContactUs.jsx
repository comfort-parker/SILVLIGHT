import React from 'react'
import './ContactUs.css'
import Navbar from '../Components/Navbar/Navbar'
import Footer from '../Components/Footer/Footer'
import Contact from '../Components/Contact/Contact'
import campus from '../Assets/campus.jpg'



const Contactus = () => {
  return (
    <div>
        <Navbar />
        <div
        className="contact-her"
        style={{ backgroundImage: `url(${campus})` }}
      >
        <div className="her-overlay"></div>
        <div className="her-text">
          <h1>Get in Touch</h1>
          <p>
            Have questions about our programs, admissions, or campus life? We’re here to help.
            Send us a message or visit us in person and we’ll get back to you promptly.
          </p>
          <button className="btn">Contact Us</button>
        </div>
      </div>
      <div className='container'><Contact /></div>
      
        <section className="map">
          <h2>Find Us Here</h2>
          <iframe
            title="School Location"
            src="https://www.google.com/maps/embed?pb=YOUR_MAP_EMBED_LINK"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </section>
        <Footer />
    </div>
  )
}

export default Contactus