module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['firebasestorage.googleapis.com', 'assets.vercel.com', 'picsum.photos', 'lh3.googleusercontent.com'],
    formats: ['image/avif', 'image/webp'],
  },
  exportPathMap: async function (defaultPathMap, {dev, dir, outDir, distDir, buildId}) {
    return {
      '/': {page: '/'},
      '/about': {page: '/about'},
      '/contact': {page: '/contact'},
      '/login': {page: '/login'},
      '/projects': {page: '/projects'},
      '/resume': {page: '/resume'},
      '/profile': {page: '/profile'},
    };
  },
};
