export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/login', '/leads'],
      },
    ],
    sitemap: 'https://www.turnertechsolutions.com/sitemap.xml',
  };
}
