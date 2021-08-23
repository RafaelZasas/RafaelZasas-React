module.exports = {
  reactStrictMode: true,
  images: {
    loader: 'imgix',
    path: 'https://rafaelzasas.imgix.net'
  },
  exportPathMap: async function(
      defaultPathMap,
      {dev, dir,outDir, distDir,buildId}
  ){
    return {
      '/': { page: '/' },
      '/about': { page: '/about' },
      '/contact': { page: '/contact' },
      '/login': { page: '/login' },
      '/projects': { page: '/projects' },
      '/resume': { page: '/resume' },
      '/profile': { page: '/profile' }
    }
  },
}

