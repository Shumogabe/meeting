import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'vn.gov.monremeeting',
  appName: 'Monre Meeting',
  webDir: 'www',
  plugins: {
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
    Camera: {
      permissions: {
        camera: "Camera",
        microphone: "Microphone"
      }
    },
    MediaCapture: {
      permissions: {
        audio: "Microphone"
      }
    },
    CapacitorHttp: {
      enabled: false
    },
  },
  server: {
    cleartext: true, // Allow HTTP traffic
    hostname: 'localhost',
    iosScheme: 'capacitor',
    androidScheme: 'https',
    allowNavigation: [
      "hoptructuyen.monre.gov.vn",
      "meeting-mobileapi.monre.gov.vn",
    ]
  }

};

export default config;
