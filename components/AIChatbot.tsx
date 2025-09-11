import React from 'react';

// This component renders nothing. It exists to fix a module loading error
// caused by having an empty file, while ensuring no chatbot functionality
// is present on the site, as requested.
const AIChatbot: React.FC = () => {
  return null;
};

export default AIChatbot;
