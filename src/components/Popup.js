import React, { useState, useEffect } from 'react';
import { X, Mail } from 'lucide-react';
import { submitLead } from '../api';

const Popup = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [form, setForm] = useState({ name: '', email: '', phone: '' });

    useEffect(() => {
        // Check if popup was already closed in this session
        if(localStorage.getItem('popupClosed')) return;

        const timer = setTimeout(() => {
            setIsOpen(true);
        }, 60000); // 60 Seconds

        return () => clearTimeout(timer);
    }, []);

    const closePopup = () => {
        setIsOpen(false);
        localStorage.setItem('popupClosed', 'true');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await submitLead({ ...form, source: 'Popup Form', intent: 'Other' });
        alert("Thank you! We will contact you shortly.");
        closePopup();
    };

    if(!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8 relative">
                <button onClick={closePopup} className="absolute top-2 right-2 text-gray-500 hover:text-black">
                    <X size={24} />
                </button>
                <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-800">Get Exclusive Market Updates</h3>
                    <p className="text-gray-600 mt-2">Join our VIP list for off-market deals.</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input 
                        type="text" placeholder="Your Name" required
                        className="w-full p-3 border rounded" 
                        onChange={(e) => setForm({...form, name: e.target.value})} 
                    />
                    <input 
                        type="email" placeholder="Email Address" required
                        className="w-full p-3 border rounded" 
                        onChange={(e) => setForm({...form, email: e.target.value})} 
                    />
                    <input 
                        type="tel" placeholder="Phone Number" required
                        className="w-full p-3 border rounded" 
                        onChange={(e) => setForm({...form, phone: e.target.value})} 
                    />
                    <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded font-bold hover:bg-blue-700">
                        Send Me Updates
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Popup;