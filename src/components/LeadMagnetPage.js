import React, { useState } from 'react';
import { submitLead, trackBehavior } from '../api';
import { ArrowRight, CheckCircle } from 'lucide-react';

const LeadMagnetPage = ({ title, description, benefits, sourceName, intentType }) => {
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await submitLead({ ...formData, source: sourceName, intent: intentType });
        trackBehavior('FORM_SUBMIT', { source: sourceName });
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <div className="bg-white p-10 rounded-xl shadow-lg text-center max-w-lg">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Thank You!</h2>
                    <p className="text-gray-600">Alan Ramirez has received your request and will contact you shortly.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen py-16">
            <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
                {/* Left: Content */}
                <div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-6">{title}</h1>
                    <p className="text-lg text-gray-600 mb-8">{description}</p>
                    
                    <ul className="space-y-4">
                        {benefits.map((b, i) => (
                            <li key={i} className="flex items-center gap-3">
                                <div className="bg-blue-100 text-blue-600 rounded-full p-1">
                                    <CheckCircle size={16} />
                                </div>
                                <span className="text-gray-700 font-medium">{b}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Right: Form */}
                <div className="bg-white p-8 rounded-2xl shadow-xl border-t-4 border-blue-600">
                    <h3 className="text-2xl font-bold mb-6">Get Started</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input type="text" placeholder="Full Name" required className="w-full p-3 border rounded" 
                            onChange={(e) => setFormData({...formData, name: e.target.value})} />
                        <input type="email" placeholder="Email" required className="w-full p-3 border rounded" 
                            onChange={(e) => setFormData({...formData, email: e.target.value})} />
                        <input type="tel" placeholder="Phone" required className="w-full p-3 border rounded" 
                            onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                        <textarea placeholder="Tell us more..." rows="3" className="w-full p-3 border rounded" 
                            onChange={(e) => setFormData({...formData, message: e.target.value})}></textarea>
                        <button className="w-full bg-blue-900 text-white py-4 rounded font-bold text-lg hover:bg-blue-800 flex items-center justify-center gap-2">
                            Submit Request <ArrowRight size={20} />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LeadMagnetPage;