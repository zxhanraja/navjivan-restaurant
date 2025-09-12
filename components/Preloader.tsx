import React, { useState, useEffect } from 'react';

const Preloader: React.FC<{ isLoaded: boolean; progress: number }> = ({ isLoaded, progress }) => {
    const [displayProgress, setDisplayProgress] = useState(0);
    const [isVisible, setIsVisible] = useState(true);

    // Smoothly update display progress to match actual progress
    useEffect(() => {
        const interval = setInterval(() => {
            setDisplayProgress(current => {
                if (current < progress) {
                    // Animate towards the target progress
                    return Math.min(current + 1, progress);
                }
                // If we've reached the target, stop the interval
                if(current === progress) clearInterval(interval);
                return current;
            });
        }, 20); // update every 20ms for smooth animation

        return () => clearInterval(interval);
    }, [progress]);

    useEffect(() => {
        if (isLoaded) {
            // When everything is loaded, ensure progress bar hits 100
            const timer = setTimeout(() => setDisplayProgress(100), 100);

            // Start fading out after a short delay to show 100%
            const fadeTimer = setTimeout(() => {
                setIsVisible(false);
            }, 1000); // User wants to see 100%, so let's give it a second.

            return () => {
                clearTimeout(timer);
                clearTimeout(fadeTimer);
            };
        }
    }, [isLoaded]);

    return (
        <div className={`fixed inset-0 bg-coffee-dark flex flex-col items-center justify-center z-[100] transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="w-64 text-center">
                <svg className="h-20 w-20 mx-auto" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="16" cy="16" r="16" fill="#D4AF37"/>
                    <path d="M10 22V10L22 22V10" stroke="#3A2412" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <p className="text-coffee-gold mt-4 text-lg font-display tracking-widest">
                    Loading...
                </p>
                <div className="w-full bg-coffee-brown/30 rounded-full h-2.5 mt-4">
                    <div className="bg-coffee-gold h-2.5 rounded-full" style={{ width: `${Math.floor(displayProgress)}%`, transition: 'width 0.2s linear' }}></div>
                </div>
                <p className="text-coffee-light mt-2 text-sm font-sans">{Math.floor(displayProgress)}%</p>
            </div>
        </div>
    );
};

export default Preloader;