import React from 'react';
import { DOMESTIC_PACKAGES, INTERNATIONAL_PACKAGES, AGENCY_SERVICES } from '../constants';
import PackageCard from './PackageCard';
import ServiceCard from './ServiceCard';

export const DomesticView: React.FC = () => (
  <div className="pt-32 pb-20 px-6 md:px-12 max-w-7xl mx-auto min-h-screen">
    <div className="text-center mb-16 animate-fade-in-up">
        <h2 className="text-4xl md:text-6xl font-serif text-white mb-4">Incredible India</h2>
        <p className="text-gray-300 max-w-2xl mx-auto">From the snow-capped Himalayas to the tropical beaches of the south, explore the diversity of our motherland.</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {DOMESTIC_PACKAGES.map(pkg => <PackageCard key={pkg.id} pkg={pkg} />)}
    </div>
  </div>
);

export const InternationalView: React.FC = () => (
  <div className="pt-32 pb-20 px-6 md:px-12 max-w-7xl mx-auto min-h-screen">
    <div className="text-center mb-16 animate-fade-in-up">
        <h2 className="text-4xl md:text-6xl font-serif text-white mb-4">World Awaits</h2>
        <p className="text-gray-300 max-w-2xl mx-auto">Discover exotic cultures, stunning landscapes, and modern marvels across the globe.</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {INTERNATIONAL_PACKAGES.map(pkg => <PackageCard key={pkg.id} pkg={pkg} />)}
    </div>
  </div>
);

export const ServicesView: React.FC = () => (
  <div className="pt-32 pb-20 px-6 md:px-12 max-w-7xl mx-auto min-h-screen">
    <div className="text-center mb-16 animate-fade-in-up">
        <h2 className="text-4xl md:text-6xl font-serif text-white mb-4">Our Services</h2>
        <p className="text-gray-300 max-w-2xl mx-auto">We go beyond just holiday packages. We take care of every little detail of your journey.</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {AGENCY_SERVICES.map(svc => <ServiceCard key={svc.id} service={svc} />)}
    </div>
  </div>
);

export const ContactView: React.FC = () => (
  <div className="pt-32 pb-20 px-6 md:px-12 max-w-4xl mx-auto min-h-screen flex items-center justify-center">
    <div className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl animate-fade-in-up">
        <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-serif text-white mb-2">Get in Touch</h2>
            <p className="text-gray-400">Let's plan your dream vacation today</p>
        </div>

        <div className="flex flex-col md:flex-row gap-12 items-center justify-center">
            {/* Contact Info Card */}
            <div className="bg-gradient-to-br from-nihar-gold/10 to-transparent border border-nihar-gold/30 p-8 rounded-2xl w-full max-w-md relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-nihar-gold/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-nihar-gold/30 transition-colors"></div>
                
                <div className="relative z-10 space-y-6">
                    <div className="border-b border-white/10 pb-6">
                        <h3 className="text-2xl font-serif text-nihar-gold mb-1">NIHAR HOLIDAYS</h3>
                        <p className="text-gray-400 text-sm tracking-wide">Your Gateway to the World</p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-start gap-4">
                             <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0 text-xl">
                                👤
                             </div>
                             <div>
                                 <p className="text-sm text-gray-500 uppercase tracking-wider font-bold">Contact Person</p>
                                 <p className="text-white font-medium text-lg">Nihar Khodiyar</p>
                             </div>
                        </div>

                        <div className="flex items-start gap-4">
                             <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0 text-xl">
                                📞
                             </div>
                             <div>
                                 <p className="text-sm text-gray-500 uppercase tracking-wider font-bold">Mobile</p>
                                 <a href="tel:+919725949113" className="text-white font-medium text-lg hover:text-nihar-gold transition-colors">+91 97259 49113</a>
                             </div>
                        </div>

                        <div className="flex items-start gap-4">
                             <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0 text-xl">
                                ✉️
                             </div>
                             <div>
                                 <p className="text-sm text-gray-500 uppercase tracking-wider font-bold">Email</p>
                                 <a href="mailto:nihartravels1@gmail.com" className="text-white font-medium text-lg hover:text-nihar-gold transition-colors break-all">nihartravels1@gmail.com</a>
                             </div>
                        </div>

                         <div className="flex items-start gap-4">
                             <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0 text-xl">
                                📍
                             </div>
                             <div>
                                 <p className="text-sm text-gray-500 uppercase tracking-wider font-bold">Address</p>
                                 <p className="text-white font-medium leading-relaxed">
                                    Office No 12, 1st Floor, Pooja Avenue,<br/>
                                    Opp. Town Hall, Anjar, Kutch.
                                 </p>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div className="text-center mt-12 pt-8 border-t border-white/5">
            <p className="text-gray-500 text-sm">© {new Date().getFullYear()} NIHAR Holidays. All rights reserved.</p>
        </div>
    </div>
  </div>
);