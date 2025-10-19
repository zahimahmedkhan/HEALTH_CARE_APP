import React from "react";

const Card = ({ title, value }) => {
  return (
    <div className="bg-gradient-to-br from-white to-blue-50/50 rounded-2xl p-6 shadow-lg border border-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-500 hover:scale-105 group relative overflow-hidden">
  {/* Background decoration */}
  <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-blue-100 rounded-full opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
  
  <h3 className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wide">{title}</h3>
  <p className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent">{value}</p>
  
  {/* Subtle hover effect */}
  <div className="absolute inset-0 border-2 border-transparent bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity duration-300 -z-10"></div>
</div>
  );
};

export default Card;