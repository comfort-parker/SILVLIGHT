import React from 'react'
import './About.css'
import sg from '../../assets/skincare.avif'
import play from '../../assets/play.png'
const About = ({setPlayState}) => {
  return (
    <div className='about'>
        <div className='about-left'>
            <img src={sg} alt="" className='about-img'/>
            <img src={play} alt="" className='play-icon'  onClick={()=>{setPlayState(true)}} />
        </div>
        <div className='about-right'>
            <h3>About Silvlight Products</h3>
            <h2>Explore more for Varieties</h2>
            <p>Westfield Bridge College is a dynamic educational institution committed to nurturing academic 
                excellence and personal growth. With a dedicated team of experienced educators, the school offers a well-rounded curriculum that blends strong academics, extracurricular activities, and character 
                development. Its supportive environment and modern facilities equip students with the skills, confidence, and values needed to thrive in higher education and beyond.</p>
            <p>Westfield Bridge College is a dynamic educational institution committed to nurturing 
                academic excellence and personal growth. With a dedicated team of experienced educators, the school offers a well-rounded curriculum that blends strong academics, extracurricular activities, and character development. Its supportive environment and modern facilities equip students with the
                 skills, confidence, and values needed to thrive in higher education and beyond.</p>
            <p>Westfield Bridge College is a dynamic educational institution committed to nurturing 
                academic excellence and personal growth. With a dedicated team of experienced educators, the school offers a well-rounded curriculum that blends strong academics, extracurricular activities, and character development. Its supportive environment and modern facilities equip students with the
                 skills, confidence, and values needed to thrive in higher education and beyond.</p>
            
        </div>

    </div>
  )
}

export default About