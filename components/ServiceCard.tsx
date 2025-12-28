import React from 'react';
import { AgencyService } from '../types';

interface ServiceCardProps {
  service: AgencyService;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  return (
    <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors group cursor-default">
      <div className="w-14 h-14 bg-nihar-gold/20 rounded-full flex items-center justify-center mb-4 text-3xl group-hover:scale-110 transition-transform duration-300">
        {service.icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-nihar-gold transition-colors">{service.title}</h3>
      <p className="text-gray-400 leading-relaxed text-sm">
        {service.description}
      </p>
    </div>
  );
};

export default ServiceCard;