import React from "react";
import { useNavigate } from "react-router-dom";
import "./AboutUs.css";
import Facility from "../Components/Facility/Facility";
import { FaBullseye, FaEye, FaLightbulb } from "react-icons/fa";
import Title from "../Components/Title/Title";
import Footer from "../Components/Footer/Footer";
import Navbar from "../Components/Navbar/Navbar";
import About from "../Components/About/About";
import campu from "../assets/groceries.gif";
import as from '../assets/ass.jpeg';
import Video from "../Components/Video/Video";

const AboutUs = () => {
  const [playState, setPlayState] = React.useState(false);
  const navigate = useNavigate();

  const handleShopNow = () => {
    const token = localStorage.getItem("token"); // or however you store auth
    if (!token) {
      alert("Please login first to continue");
      navigate("/login?redirect=/products"); // pass redirect
    } else {
      navigate("/products");
    }
  };

  return (
    <div className="about-container">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <div
        className="contact-hero"
        style={{ backgroundImage: `url(${campu})` }}
      >
        <div className="hero-overlay"></div>
        <div className="hero-text">
          <h1>Know more about us</h1>
          <p>
            Have questions about our programs, admissions, or campus life?
            We’re here to help. Send us a message or visit us in person
            and we’ll get back to you promptly.
          </p>
          <button className="btn" onClick={handleShopNow}>🛒 Shop Now</button>
        </div>
      </div>

      {/* About Intro Section */}
      <About setPlayState={setPlayState} />

      {/* Mission, Vision, Values */}
      <Title subTitle="Our Mission and Values" title="Why Choose Bright Future" />

      <div className="head-message">
        <p>
          Welcome to our school! We are proud of our tradition of excellence
          in academics, sports, and character building. <br /> Every child has
          the potential to succeed, and we are dedicated to guiding them along
          their journey.
        </p>
      </div>

      <section className="about-mvv">
        <div className="mvv-card">
          <FaBullseye size={50} color="#e63946" />
          <h3>Mission</h3>
          <p>
            Our mission is to empower our students to become global citizens
            with well-developed critical thinking skills and the self-confidence
            to attain their full potential. We foster a nurturing environment
            that encourages curiosity, resilience, and a lifelong love for learning.
          </p>
        </div>

        <div className="mvv-card">
          <FaEye size={50} color="#457b9d" />
          <h3>Vision</h3>
          <p>
            Westfield Bridge seeks to continuously improve through innovation.
            We aim to be recognized as the leading international school in Ghana,
            moulding students to lead with integrity, to open minds, and to
            transform Africa and the world.
          </p>
        </div>

        <div className="mvv-card">
          <FaLightbulb size={50} color="#f4a261" />
          <h3>Core Values</h3>
          <p>
            Our enhanced teaching and learning setup integrates IT tools into
            daily instruction. With computers, online content, and Google
            Classroom, students and teachers access a wide range of resources.
            Children gain hands-on skills in MS Office or G-Suite by creating
            documents, charts, and presentations—building valuable skills for
            university and the workplace from an early age.
          </p>
        </div>
      </section>

      <section className="principal-section">
        <div className="principal-container">
          {/* Principal Message */}
          <div className="principal-message">
            <h2>Message from the Principal</h2>
            <p>
              At Westfield Bridge College, we believe education is more than just 
              academics—it is about nurturing well-rounded individuals who are 
              confident, compassionate, and globally minded. Our commitment is to 
              provide an enabling environment where every student can discover 
              their potential and prepare for the challenges of tomorrow.
            </p>
            <p>
              As Principal, I am proud of the resilience and creativity of our 
              students and staff. Together, we are shaping future leaders who 
              will make meaningful contributions to Ghana and beyond.
            </p>
            <p className="principal-name">– Principal, Westfield Bridge College</p>
          </div>

          {/* Principal Image */}
          <div className="principal-image">
            <img src={as} alt="Principal of Westfield Bridge College" />
          </div>
        </div>
      </section>

      {/* Facilities Section */}
      <Facility />

      {/* Footer */}
      <Footer />
      <Video playState={playState} setPlayState={setPlayState} />
    </div>
  );
};

export default AboutUs;
