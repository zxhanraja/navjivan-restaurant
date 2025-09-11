import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import AnimatedSection from '../components/AnimatedSection';
import usePageTitle from '../hooks/usePageTitle';

const FAQPage: React.FC = () => {
    const { faqs } = useData();
    usePageTitle('FAQ');
    const [openId, setOpenId] = useState<number | null>(faqs.length > 0 ? faqs[0].id : null);

    const toggleFaq = (id: number) => {
        setOpenId(openId === id ? null : id);
    };

    return (
        <div className="bg-coffee-light py-12 min-h-screen">
            <div className="container mx-auto px-4">
                <h1 className="text-4xl font-bold text-center text-coffee-brown font-display mb-10 animate-[fadeIn_1s_ease-in-out]">
                    Frequently Asked Questions
                </h1>
                <AnimatedSection className="max-w-3xl mx-auto space-y-4">
                    {faqs.map(faq => (
                        <div key={faq.id} className="border-b border-gray-200">
                            <button
                                onClick={() => toggleFaq(faq.id)}
                                className="w-full text-left flex justify-between items-center py-5 px-6 focus:outline-none"
                                aria-expanded={openId === faq.id}
                                aria-controls={`faq-answer-${faq.id}`}
                            >
                                <span className="text-lg font-semibold text-coffee-dark">{faq.question}</span>
                                <span className={`transform transition-transform duration-300 ${openId === faq.id ? 'rotate-180' : 'rotate-0'}`}>
                                    <svg className="w-6 h-6 text-coffee-brown" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </span>
                            </button>
                            <div
                                id={`faq-answer-${faq.id}`}
                                className={`overflow-hidden transition-all duration-500 ease-in-out ${openId === faq.id ? 'max-h-96' : 'max-h-0'}`}
                            >
                                <p className="text-gray-700 leading-relaxed px-6 pb-5">
                                    {faq.answer}
                                </p>
                            </div>
                        </div>
                    ))}
                </AnimatedSection>
            </div>
        </div>
    );
};

export default FAQPage;