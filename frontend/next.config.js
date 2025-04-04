/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove experimental section since optimizeFonts is not a valid experimental option
  onDemandEntries: {
    maxInactiveAge: 60 * 60 * 1000,
    pagesBufferLength: 5,
  },
}

module.exports = nextConfig 