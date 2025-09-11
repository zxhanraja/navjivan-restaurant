import React, { useState, useEffect } from 'react';

const Preloader: React.FC<{ isLoaded: boolean }> = ({ isLoaded }) => {
    const [progress, setProgress] = useState(0);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        let interval: number;
        if (!isLoaded) {
            // Simulate loading progress
            interval = window.setInterval(() => {
                setProgress(prev => {
                    if (prev >= 95) {
                        clearInterval(interval);
                        return prev;
                    }
                    return prev + Math.floor(Math.random() * 5) + 1;
                });
            }, 100);
        } else {
            // When site is loaded, jump to 100%
            setProgress(100);
            // Start fading out after a short delay to show 100%
            const fadeTimer = setTimeout(() => setIsVisible(false), 500);
            return () => clearTimeout(fadeTimer);
        }

        return () => clearInterval(interval);
    }, [isLoaded]);

    return (
        <div className={`fixed inset-0 bg-coffee-dark flex flex-col items-center justify-center z-[100] transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="w-64 text-center">
                <svg className="h-20 w-20 mx-auto" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="16" cy="16" r="16" fill="#D4AF37"/>
                    <path d="M10 22V10L22 22V10" stroke="#3A2412" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <p className="text-coffee-gold mt-4 text-lg font-display tracking-widest">
                    Loading...
                </p>
                <div className="w-full bg-coffee-brown/30 rounded-full h-2.5 mt-4">
                    <div className="bg-coffee-gold h-2.5 rounded-full" style={{ width: `${progress}%`, transition: 'width 0.5s ease-out' }}></div>
                </div>
                <p className="text-coffee-light mt-2 text-sm font-sans">{progress}%</p>
            </div>
        </div>
    );
};

export default Preloader;