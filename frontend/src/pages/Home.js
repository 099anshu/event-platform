import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Home = () => {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [gallery, setGallery] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get('/api/events/upcoming?limit=3');
        setUpcomingEvents(res.data);
        console.log('Upcoming Events in Frontend:', res.data);  // Debugging line
      } catch (err) {
        console.error('Error fetching events:', err);
      }
    };
  
    fetchEvents();

  

    const fetchGallery = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/gallery/latest');
        if (Array.isArray(res.data)) {
          setGallery(res.data);
        } else {
          console.warn('Unexpected gallery format:', res.data);
        }
      } catch (err) {
        console.error('❌ Error fetching gallery:', err.message || err);
      }
    };

  
    fetchGallery();
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-start items-center bg-black text-white relative overflow-hidden before:content-[''] before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_5%_40%,#ff69b4_2%,transparent_15%),radial-gradient(circle_at_80%_55%,#ff69b4_5%,transparent_35%),radial-gradient(circle_at_10%_90%,#00ff9f_5%,transparent_35%),radial-gradient(circle_at_90%_10%,#00ff9f_5%,transparent_20%)] before:opacity-20 before:pointer-events-none">
      
      {/* Hero Section */}
      <div className="text-center mt-20 mb-12">
        <h1 className="text-5xl font-bold mb-4">Welcome to the Event Platform</h1>
        <p className="text-xl">Discover exciting events and explore past winners.</p>
      </div>

      {/* Upcoming Events Preview */}
      <div className="w-full max-w-4xl mx-auto text-center mb-12">
        <h2 className="text-3xl font-semibold mb-6">Upcoming Events</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
  {upcomingEvents.length === 0 ? (
    <p className="text-lg">No upcoming events at the moment.</p>
  ) : (
    upcomingEvents.map((event) => (
      <div key={event._id} className="bg-white text-black rounded-lg p-4 shadow-lg">
        <h3 className="text-xl font-semibold mb-2">{event.name}</h3>
        <p className="text-md mb-4">{new Date(event.date).toLocaleDateString()}</p> {/* Format date */}
        <p>{event.description}</p>
      </div>
    ))
  )}
</div>

      </div>

      {/* Explore Events Button */}
      <div className="flex justify-center gap-8 mb-12">
        <a href="/events">
          <button className="bg-gradient-to-r from-purple-600 to-pink-500 text-white py-3 px-8 rounded-lg text-lg font-semibold hover:scale-105 transform transition">
            Explore Events
          </button>
        </a>
      </div>

      {/* Gallery Preview */}
      <div className="w-full max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-semibold mb-6">Gallery of Past Winners</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {gallery.length === 0 ? (
            <p className="text-lg">No gallery items yet.</p>
          ) : (
            gallery.map((item) => (
              <div key={item._id} className="bg-white text-black rounded-lg p-4 shadow-lg">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="text-sm">{item.description}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* View Gallery Button */}
      <div className="flex justify-center gap-8 mb-12">
        <a href="/gallery">
          <button className="bg-gradient-to-r from-green-400 to-teal-500 text-white py-3 px-8 rounded-lg text-lg font-semibold hover:scale-105 transform transition">
            View Gallery
          </button>
        </a>
      </div>
    </div>
  );
};

export default Home;
