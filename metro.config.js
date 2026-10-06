// Learn more https://docs.expo.dev/guides/customizing-metro
const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// The marketing site in site/ is a separate Next.js project; keep it out of the app bundle.
const siteDir = path.join(__dirname, 'site').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
config.resolver.blockList = [new RegExp(`^${siteDir}[\\\\/].*`)];

module.exports = config;
