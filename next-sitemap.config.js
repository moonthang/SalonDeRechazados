/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://salon-de-rechazados.vercel.app',
  generateRobotsTxt: true, 
  sitemapSize: 7000,
};
