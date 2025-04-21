import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-black text-white py-8 mt-1">
      <div className="max-w-screen-xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
        {/* Left Section: College Name */}
        <div className="text-center md:text-left">
          <p className="text-lg font-semibold ">Powered by Fr. Conceicao Rodrigues College of Engineering (FRCRCE)</p>
          <p className="text-lg mt-3">📍Located at</p>
          <p> Fr. Agnel Ashram,Bandstand Promenade,</p>
          <p> Mount Mary, Bandra West,</p>
          <p>Mumbai, Maharashtra 400050</p>
        </div>
       
        {/* Right Section: Contact Info + Social Media */}
       <div className="flex flex-col items-center md:items-end md:pr-5 mt-6 md:mt-0 space-y-3 text-sm">
           <p className="text-white text-lg font-semibold">Contact Us</p>  

           <div className="space-y-1 text-white">
              <p className="text-sm">📧 <a href="mailto:crce@frcrce.ac.in" className="hover:underline">crce@frcrce.ac.in</a></p>
              <p className="text-sm">📞 +91-22-67114000</p>   
           </div>

       <div className="flex space-x-4">
         <a
            href="https://www.linkedin.com/school/fr.-conceicao-rodrigues-college-of-engineering/posts/?feedView=all"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-gray-300"
         >
        <i className="fab fa-linkedin-in text-xl"></i>
        </a>
        <a
            href="https://www.instagram.com/frcrce_official/?hl=en"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-gray-300"
        >
        <i className="fab fa-instagram text-xl"></i>
        </a>
       </div>
    </div>
    </div>
 
     
    </footer>
  );
};

export default Footer;
