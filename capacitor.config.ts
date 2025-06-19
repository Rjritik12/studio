
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.eduverse.app',
  appName: 'EduVerse',
  webDir: 'out', // For Next.js static export
  // bundledWebRuntime: false, // This line is deprecated and removed
  server: {
    // For local development with live reload, if you want to use a dev server.
    // For production builds, Capacitor typically bundles the web assets.
    // url: 'http://192.168.YOUR_IP.YOUR_PORT', // Example, replace with your local IP and Next.js dev port
    // cleartext: true, // If using HTTP for local dev server
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      // launchAutoHide: true, // Default is true
      // backgroundColor: "#ffffffff", // Optional: Set splash screen background color
      // androidSplashResourceName: "splash", // Optional: If you have custom splash drawables
      // androidScaleType: "CENTER_CROP", // Optional
      // showSpinner: true, // Optional: Shows a spinner
      // androidSpinnerStyle: "large", // Optional: "small", "large", "inverse", "smallInverse", "largeInverse"
      // iosSpinnerStyle: "small", // Optional: "small", "large", "white", "whiteLarge"
      // spinnerColor: "#999999", // Optional
    },
    Keyboard: {
      resize: 'native', // 'body', 'ionic', 'native', 'none'
      // style: 'dark', // 'light', 'dark' (Experimental)
      // resizeOnFullScreen: true
    }
  }
};

export default config;
