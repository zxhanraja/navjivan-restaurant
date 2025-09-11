import React from 'react';

interface AIChefButtonProps {
  onClick: () => void;
}

const AIChefButton: React.FC<AIChefButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-11 h-11 rounded-full bg-coffee-gold text-coffee-dark shadow-lg flex items-center justify-center transition-all duration-300 transform hover:scale-110 hover:bg-amber-500"
      aria-label="Ask AI Chef for recommendations"
      title="Ask AI Chef"
    >
      <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6">
        <path d="M10 22V10L22 22V10" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  );
};

export default AIChefButton;