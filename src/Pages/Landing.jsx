import React from "react";
import "./Landing.css";
import '../index.css'
import Navbar from "../Components/Navbar/Navbar";
import Hero from "../Components/Hero/Hero";
import Category from "../Components/Category/Category";
import Footer from "../Components/Footer/Footer";
import About from "../Components/About/About";
import Contact from "../Components/Contact/Contact";
import Title from "../Components/Title/Title";
import Video from "../Components/Video/Video";
import Testmonial from "../Components/Testmonial/Testmonial";
const LandingPage = () => {
    const [playState, setPlayState] = React.useState(false);
  return (
    <><Navbar />
        <Hero />
        <div className='container'>
        <About setPlayState={setPlayState}/>
        <Category />
        <Title subTitle='Contact us' title='Get in touch with us for further enquiries'/>
        <Contact />
         <Title subTitle='Testomonials' title='What our customers say about us'/>
        <Testmonial/> 
        </div>
        <Footer />
        <Video playState={playState} setPlayState={setPlayState}/>

    <div className="landing-container">
          
      </div></>
  );
};

export default LandingPage;
