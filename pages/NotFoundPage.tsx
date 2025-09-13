
import React from 'react';
// FIX: Changed import to wildcard to bypass potential module resolution issues for react-router-dom.
import * as ReactRouterDOM from 'react-router-dom';
import usePageTitle from '../hooks/usePageTitle';

const NotFoundPage: React.FC = () => {
    usePageTitle('Not Found');
    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-144px)] bg-coffee-light text-center px-4">
            <div>
                 <h1 className="text-9xl font-extrabold text-coffee-brown tracking-widest">404</h1>
                 <div className="bg-coffee-gold px-2 text-sm rounded rotate-12 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    Page Not Found
                 </div>
                 <p className="mt-4 text-lg text-gray-600">
                    Oops! The page you’re looking for doesn’t exist.
                 </p>
                 {/* FIX: Changed to use namespaced import. */}
                 <ReactRouterDOM.Link 
                    to="/"
                    className="mt-8 inline-block bg-coffee-brown text-white font-bold py-3 px-8 rounded-lg hover:bg-coffee-dark transition duration-300"
                 >
                    Go Back Home
                 </ReactRouterDOM.Link>
            </div>
        </div>
    );
};

export default NotFoundPage