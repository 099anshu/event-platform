import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Gallery = () => {
  const [winners, setWinners] = useState([]);
  
  useEffect(() => {
    // Replace with your API endpoint
    axios.get('/api/gallery')
      .then(response => {
        setWinners(response.data);
      })
      .catch(error => {
        console.error('Error fetching gallery data:', error);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 py-12 px-6">
      <h2 className="text-4xl font-bold text-center text-indigo-800 mb-12">
        Past Winners Gallery
      </h2>
      
      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
        {winners.map(winner => (
          <div 
            key={winner._id} 
            className="transform hover:scale-105 transition duration-300 ease-in-out bg-white shadow-xl rounded-lg overflow-hidden"
          >
            <img
              src={winner.imageUrl} // Assuming the image URL is stored in the database
              alt={winner.name}
              className="w-full h-56 object-cover transform hover:scale-110 transition duration-300 ease-in-out"
            />
            <div className="p-6">
              <h3 className="text-2xl font-semibold text-gray-800 hover:text-purple-700 transition duration-200">{winner.name}</h3>
              <p className="text-sm text-gray-600 mt-2">{winner.event}</p>
              <p className="text-sm text-gray-600 mt-1">{winner.position}</p>
            </div>
          </div>
        ))}
      </div>
      
    </div>
  );
};

export default Gallery;
