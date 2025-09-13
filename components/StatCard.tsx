
import React from 'react';
// FIX: Changed import to wildcard to bypass potential module resolution issues for react-router-dom.
import * as ReactRouterDOM from 'react-router-dom';

interface StatCardProps {
    icon: React.ReactNode;
    title: string;
    value: string | number;
    linkTo?: string;
    linkLabel?: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, linkTo, linkLabel = "View" }) => {
    const content = (
        <>
            <div className="flex-shrink-0 text-coffee-gold">{icon}</div>
            <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 truncate">{title}</p>
                <p className="text-3xl font-semibold text-coffee-dark">{value}</p>
            </div>
        </>
    );

    const cardClasses = "bg-white p-5 rounded-lg shadow-lg flex items-center transition-all duration-300 transform hover:-translate-y-1";

    if (linkTo) {
        return (
            // FIX: Changed to use namespaced import.
            <ReactRouterDOM.Link to={linkTo} className={`${cardClasses} hover:shadow-xl`}>
                {content}
            </ReactRouterDOM.Link>
        );
    }

    return (
        <div className={cardClasses}>
            {content}
        </div>
    );
};

export default React.memo(StatCard);
