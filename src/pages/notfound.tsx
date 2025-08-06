// src/pages/NotFound.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';

const NotFound: React.FC = () => {
    return (
        <div className="text-center text-white p-8">
            <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
            <p className="mb-4">The page you are looking for does not exist.</p>
            <NavLink to="/" className="text-blue-400 underline">Go back home</NavLink>
            <img src="https://lh3.googleusercontent.com/d/1meKLp6XtamNEFUOFTjCxOSImlCOeuJv_"
                className="w-full m-8 mx-auto max-w-sm"></img>
        </div>
    );
};

export default NotFound;
