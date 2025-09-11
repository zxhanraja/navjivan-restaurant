// FIX: Add Vite client types to resolve import.meta.env error.
/// <reference types="vite/client" />

import React, { useState, useCallback } from 'react';
import Modal from './Modal';
import { useData } from '../context/DataContext';
import { GoogleGenAI, Type } from "@google/genai";
import type { AIRecommendation } from '../types';

const AIChefModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const { menuItems } = useData();
    const [prompt, setPrompt] = useState('');
    const [dietary, setDietary] = useState('');
    const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [error, setError] = useState('');

    const handleGetRecommendations = useCallback(async () => {
        // FIX: Access environment variables using import.meta.env for Vite.
        const apiKey = import.meta.env.VITE_API_KEY;

        if (!apiKey) {
            setError("AI Chef is not configured. The API key is missing.");
            setStatus('error');
            return;
        }

        if (!prompt.trim()) {
            setError('Please tell us how you are feeling.');
            return;
        }
        setStatus('loading');
        setError('');
        setRecommendations([]);

        try {
            const ai = new GoogleGenAI({ apiKey });
            
            const menuString = menuItems.map(item => `- ${item.name}: ${item.description}`).join('\n');
            const dietaryInstruction = dietary.trim()
                ? `The user has a critical dietary requirement: "${dietary}". All recommendations MUST adhere to this. If no dishes on the menu fit this requirement, you must state that you cannot find a suitable match in your response.`
                : '';

            const fullPrompt = `A customer describes their mood as: "${prompt}". 
            Based on this mood, recommend exactly 3 dishes from the menu below.
            For each dish, provide a brief, enticing reason (around 15-20 words) explaining why it's a good choice for their mood. 
            Only recommend dishes from the provided list. Do not recommend anything not on the menu.

            ${dietaryInstruction}

            MENU:
            ${menuString}`;

            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: fullPrompt,
                config: {
                    systemInstruction: "You are the AI Chef for Navjivan Restaurant, an expert in Indian cuisine. Your goal is to recommend dishes from the provided menu based on a user's mood and dietary needs. You must be helpful, concise, and only use the data provided. Your response must be in the specified JSON format.",
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            recommendations: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        name: { type: Type.STRING, description: 'The name of the recommended dish, exactly as it appears on the menu.' },
                                        reason: { type: Type.STRING, description: 'A short, enticing reason for the recommendation based on the mood.' },
                                    },
                                }
                            }
                        }
                    },
                }
            });

            const resultJson = JSON.parse(response.text);
            const recommendationsWithNameAndReason = resultJson.recommendations.map((rec: { name: string, reason: string }) => {
                const menuItem = menuItems.find(item => item.name.toLowerCase() === rec.name.toLowerCase());
                return { ...rec, description: menuItem?.description || '' };
            });

            setRecommendations(recommendationsWithNameAndReason);
            setStatus('success');

        } catch (err) {
            console.error("Gemini API error:", err);
            setError("Sorry, our AI Chef is busy. Please try again in a moment.");
            setStatus('error');
        }

    }, [prompt, dietary, menuItems]);
    
    const handleClose = () => {
        setPrompt('');
        setDietary('');
        setRecommendations([]);
        setStatus('idle');
        setError('');
        onClose();
    }

    return (
        <Modal isOpen={isOpen} onClose={handleClose}>
            <div className="p-6">
                <h2 className="text-2xl font-bold text-coffee-dark font-display mb-4 text-center">AI Chef: Mood Matcher</h2>
                {status === 'idle' || status === 'loading' || status === 'error' ? (
                     <>
                        <p className="text-center text-gray-600 mb-6">Tell us your mood, and we'll find the perfect dish to match it!</p>
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="e.g., 'I'm feeling adventurous today' or 'Something comforting and warm'"
                            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-coffee-gold"
                            rows={3}
                            disabled={status === 'loading'}
                        />
                        <div className="mt-4">
                            <label htmlFor="dietary-needs" className="block text-sm font-medium text-gray-700 mb-1">Any dietary needs? (optional)</label>
                            <input
                                id="dietary-needs"
                                type="text"
                                value={dietary}
                                onChange={(e) => setDietary(e.target.value)}
                                placeholder="e.g., vegetarian, gluten-free, no nuts"
                                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-coffee-gold"
                                disabled={status === 'loading'}
                            />
                        </div>
                         {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
                        <button
                            onClick={handleGetRecommendations}
                            disabled={status === 'loading'}
                            className="w-full mt-4 bg-coffee-brown text-white font-bold py-3 px-4 rounded-lg hover:bg-coffee-dark transition duration-300 disabled:bg-gray-400 flex items-center justify-center"
                        >
                            {status === 'loading' ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Finding your perfect dish...
                                </>
                            ) : (
                                'Find My Dish'
                            )}
                        </button>
                     </>
                ) : (
                    <div>
                        <h3 className="text-2xl font-bold text-coffee-dark font-display mb-4 text-center">Our Chef Recommends...</h3>
                        <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                            {recommendations.map((rec, index) => (
                                <div key={index} className="bg-coffee-light p-4 rounded-lg">
                                    <h4 className="font-bold text-lg text-coffee-brown">{rec.name}</h4>
                                    <p className="text-gray-700 mt-1 italic">"{rec.reason}"</p>
                                    <p className="text-sm text-gray-600 mt-2">{rec.description}</p>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={() => { setStatus('idle'); setRecommendations([]); setPrompt(''); setDietary(''); }}
                            className="w-full mt-6 bg-coffee-brown text-white font-bold py-3 px-4 rounded-lg hover:bg-coffee-dark transition duration-300"
                        >
                            Ask Again
                        </button>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default AIChefModal;