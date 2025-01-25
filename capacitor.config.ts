import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.login.project',
  appName: 'login',
  webDir: 'www',
  plugins: {
    GoogleAuth:{
      scopes:["profile","email"],
      serverClientId:"737088378705-m33oiiq715e8ob6ht5ksuc8hli2l47ob.apps.googleusercontent.com",
      forceCodeForRefreshToken:true
    }
     // This enables mixed content on Android
  }
};

export default config;
