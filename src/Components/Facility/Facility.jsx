import { useState } from "react";
import "./Facility.css";
import camp from "../../Assets/camp.jpg";
import campu from "../../Assets/campu.jpg";
import vid from "../../Assets/vid.mp4";

const facilities = [
  {
    id: 1,
    frontImg: camp,
    backImg: campu,
    videoUrl: vid,
    title: "Modern Library",
  },
  {
    id: 2,
    frontImg: camp,
    backImg: campu,
    videoUrl: vid,
    title: "Science Lab",
  },
  {
    id: 3,
    frontImg: camp,
    backImg: campu,
    videoUrl: vid,
    title: "Sports Complex",
  },
  {
    id: 4,
    frontImg: camp,
    backImg: campu,
    videoUrl: vid,
    title: "Sports Complex",
  },
  {
    id: 5,
    frontImg: camp,
    backImg: campu,
    videoUrl: vid,
    title: "Sports Complex",
  },
  {
    id: 6,
    frontImg: camp,
    backImg: campu,
    videoUrl: vid,
    title: "Sports Complex",
  },
];

export default function FacilitiesSection() {
  const [activeVideo, setActiveVideo] = useState(null);

  return (
    <section className="facilities-section">
      <h2 className="section-title">Our Facilities</h2>

      {/* Facilities Grid */}
      <div className="facilities-grid">
        {facilities.map((facility) => (
          <div
            key={facility.id}
            className="facility-card"
            onClick={() => setActiveVideo(facility.videoUrl)}
          >
            <div className="facility-inner">
              {/* Front Image */}
              <div className="facility-front">
                <img src={facility.frontImg} alt={facility.title} />
                <h3>{facility.title}</h3>
              </div>

              {/* Back Image */}
              <div className="facility-back">
                <img src={facility.backImg} alt={facility.title} />
                <h3>More Details</h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Video Modal */}
      {activeVideo && (
        <div className="video-modal">
          <div className="video-content">
            <button
              className="close-btn"
              onClick={() => setActiveVideo(null)}
            >
              ✖
            </button>
            <video
              controls
              autoPlay
              onEnded={() => setActiveVideo(null)} // 👈 close modal when video ends
            >
              <source src={activeVideo} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      )}
    </section>
  );
}
