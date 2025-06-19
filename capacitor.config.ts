import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.eduverse.app', // Replace with your unique app ID
  appName: 'EduVerse',       // Replace with your app name
  webDir: 'out',             // Next.js static export output directory
  bundledWebRuntime: false,  // Recommended for modern JS frameworks
  // server: {
  //   androidScheme: 'https', // Can be useful for live reload during development
  // }
};

export default config;
