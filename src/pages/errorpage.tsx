// src/pages/NotFound.tsx
import React from 'react';
import { Link } from 'react-router-dom';

export interface ErrorPageProps {
    error: any;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ error }) => {
    return (
        <div className="text-center text-white p-8">
            <h1 className="text-4xl font-bold mb-4">{String(error)}</h1>

            <Link to="/" className="text-blue-400 underline">Go back home</Link>
            <img src="https://lh3.googleusercontent.com/d/1meKLp6XtamNEFUOFTjCxOSImlCOeuJv_"
                className="w-full m-8 mx-auto max-w-sm"></img>
        </div>
    );
};

export default ErrorPage;
