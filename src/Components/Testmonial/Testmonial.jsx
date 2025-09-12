import React, { useRef } from 'react'
import './Testmonial.css'
import next from '../../Assets/next.png'
import back from '../../Assets/back.png'
import as from '../../Assets/as.jpeg'
import ass from '../../Assets/ass.jpeg'
import assett from '../../Assets/assett.jpeg'
import sg from '../../assets/sg.jpg'

const Testmonial = () => {
  const slider =useRef();
  let tx = 0;

const slideFoward = () =>{
if(tx>-50)
  {tx -= 25;

  }
  slider.current.style.transform = `translateX(${tx}%)`
}
const slideBackward = () =>{
  if(tx<0)
  {tx += 25;

  }
  slider.current.style.transform = `translateX(${tx}%)`

}
  return (
    <div className='testmonial'>
        <img src={next} alt="" className='next-btn' onClick={slideFoward}/>
        <img src={back} alt="" className='back-btn' onClick={slideBackward}/>
        <div className='slider'>
            <ul ref={slider}>
              <li>
                <div className='slide'>
                  <div className="userinfo">
                    <img src={as} alt="" />
                    <div>
                      <h3>Comfort Parker</h3>
                      <span>Brain hills</span>
                    </div>
                  </div>
                  <p>"Comfort is an amazing professional. Her attention to detail 
                    and dedication are unmatched.", "Working with Comfort has been a game-changer. 
                    She consistently delivers quality work on time.",
                      "I highly recommend Comfort for any IT project. Her skills and 
                      professionalism are outstanding."</p>
                </div>
              </li>
              <li>
                <div className='slide'>
                  <div className="userinfo">
                    <img src={sg} alt="" />
                    <div>
                      <h3>Comfort Parker</h3>
                      <span>Brain hills</span>
                    </div>
                  </div>
                  <p>"Comfort is an amazing professional. Her attention to detail 
                    and dedication are unmatched.", "Working with Comfort has been a game-changer. 
                    She consistently delivers quality work on time.",
                      "I highly recommend Comfort for any IT project. Her skills and 
                      professionalism are outstanding."</p>
                </div>
              </li>
              <li>
                <div className='slide'>
                  <div className="userinfo">
                    <img src={assett} alt="" />
                    <div>
                      <h3>Comfort Parker</h3>
                      <span>Brain hills</span>
                    </div>
                  </div>
                  <p>"Comfort is an amazing professional. Her attention to detail 
                    and dedication are unmatched.", "Working with Comfort has been a game-changer. 
                    She consistently delivers quality work on time.",
                      "I highly recommend Comfort for any IT project. Her skills and 
                      professionalism are outstanding."</p>
                </div>
              </li>
              <li>
                <div className='slide'>
                  <div className="userinfo">
                    <img src={ass} alt="" />
                    <div>
                      <h3>Comfort Parker</h3>
                      <span>Brain hills</span>
                    </div>
                  </div>
                  <p>"Comfort is an amazing professional. Her attention to detail 
                    and dedication are unmatched.", "Working with Comfort has been a game-changer. 
                    She consistently delivers quality work on time.",
                      "I highly recommend Comfort for any IT project. Her skills and 
                      professionalism are outstanding."</p>
                </div>
              </li>
            </ul>
        </div>
    </div>
  )
}

export default Testmonial