/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    safelist: [
        'font-imfell',
    ],
    theme: {
        extend: {
            fontFamily: {
                imfell: ["'IM Fell English'", 'serif'],
            },
        },
    },
    plugins: [],
};
