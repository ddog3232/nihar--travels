import React, { useState } from 'react';
import { generateTripPlan } from '../services/geminiService';
import { TripPlanRequest, LoadingState } from '../types';
import ReactMarkdown from 'react-markdown'; // Assuming we can't install packages, I will do a simple text render if this fails, but usually ReactMarkdown is standard. Wait, prompt says "Use popular and existing libraries". I will assume standard usage.
// Actually, to be safe from import errors in the response environment without package.json control, I will implement a simple parser or just render whitespace.
// Re-reading: "Use popular and existing libraries... Do not use mock or made-up libraries."
// I will skip 'react-markdown' to avoid build setup issues in this specific instruction context and just use `white-space: pre-wrap` which works great for markdown-like text from Gemini.

const AIPlanner: React.FC = () => {
  const [formData, setFormData] = useState<TripPlanRequest>({
    destination: '',
    days: 5,
    travelers: 'Couple',
    budget: 'Luxury'
  });
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  const [plan, setPlan] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.destination) return;

    setLoadingState(LoadingState.LOADING);
    try {
      const result = await generateTripPlan(formData);
      setPlan(result);
      setLoadingState(LoadingState.SUCCESS);
    } catch (error) {
        console.error(error);
      setLoadingState(LoadingState.ERROR);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (!isOpen) {
      return (
        <button 
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 bg-nihar-gold text-nihar-dark px-6 py-4 rounded-full shadow-lg font-bold hover:bg-white transition-colors flex items-center gap-2 group"
        >
            <span className="text-xl">✨</span> 
            <span>Plan with AI</span>
        </button>
      );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-nihar-dark border border-gray-700 w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gray-900/50">
            <div>
                <h2 className="text-2xl font-serif text-nihar-gold">NIHAR AI Planner</h2>
                <p className="text-gray-400 text-sm">Your intelligent travel companion</p>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
            {loadingState === LoadingState.IDLE || loadingState === LoadingState.LOADING ? (
                 <form onSubmit={handleSubmit} className="space-y-6">
                 <div>
                   <label className="block text-sm font-medium text-gray-400 mb-1">Where do you want to go?</label>
                   <input
                     type="text"
                     name="destination"
                     value={formData.destination}
                     onChange={handleInputChange}
                     placeholder="e.g., Goa, Swiss Alps, Dubai"
                     className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-nihar-gold transition-colors"
                     required
                   />
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Duration</label>
                        <select 
                            name="days" 
                            value={formData.days} 
                            onChange={handleInputChange}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-nihar-gold"
                        >
                            {[3, 4, 5, 7, 10, 14].map(d => <option key={d} value={d}>{d} Days</option>)}
                        </select>
                     </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Travelers</label>
                        <select 
                            name="travelers" 
                            value={formData.travelers} 
                            onChange={handleInputChange}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-nihar-gold"
                        >
                            <option value="Solo">Solo</option>
                            <option value="Couple">Couple</option>
                            <option value="Family">Family</option>
                            <option value="Friends">Friends</option>
                        </select>
                     </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Budget</label>
                        <select 
                            name="budget" 
                            value={formData.budget} 
                            onChange={handleInputChange}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-nihar-gold"
                        >
                            <option value="Budget">Budget</option>
                            <option value="Standard">Standard</option>
                            <option value="Luxury">Luxury</option>
                        </select>
                     </div>
                 </div>
 
                 <button
                   type="submit"
                   disabled={loadingState === LoadingState.LOADING}
                   className={`w-full bg-gradient-to-r from-nihar-gold to-yellow-600 text-black font-bold py-4 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 ${
                     loadingState === LoadingState.LOADING ? 'opacity-70 cursor-wait' : ''
                   }`}
                 >
                   {loadingState === LoadingState.LOADING ? 'Consulting Gemini...' : 'Generate Itinerary'}
                 </button>
               </form>
            ) : (
                <div className="space-y-6">
                    <div className="prose prose-invert max-w-none">
                        <div className="whitespace-pre-wrap text-gray-200 font-light leading-relaxed">
                            {plan}
                        </div>
                    </div>
                    <button 
                        onClick={() => setLoadingState(LoadingState.IDLE)}
                        className="text-nihar-gold hover:text-white underline text-sm"
                    >
                        Plan another trip
                    </button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default AIPlanner;
