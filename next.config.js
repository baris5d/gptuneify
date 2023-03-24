/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
        SPOTIFY_REDIRECT_URI: process.env.SPOTIFY_REDIRECT_URI,
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "i.scdn.co",
                pathname: "/image/*",
                port: "",
            },
        ],
    },
};

module.exports = nextConfig;
