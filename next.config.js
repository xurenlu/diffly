/** @type {import('next').NextConfig} */
let backend = process.env.BACKEND || 'http://localhost:3388'
const nextConfig = {
    rewrites: async () => {
        return [
            {
                source: '/api/:path*',
                destination: `http://localhost:3388/api/:path*`,
                //destination: `${backend}/api/:path*`,

            },
        ]
    }
}

module.exports = nextConfig
