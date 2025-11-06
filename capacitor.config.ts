import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.c9ee73f92c524997bc20c586315c5fa4',
  appName: 'فاحص المنتجات الذكي',
  webDir: 'dist',
  server: {
    url: 'https://c9ee73f9-2c52-4997-bc20-c586315c5fa4.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    AdMob: {
      testMode: true, // استخدم وضع الاختبار أثناء التطوير
      // سيتم تعيين IDs الحقيقية لاحقاً
    },
    Camera: {
      allowEditing: false,
      quality: 90,
      source: 'CAMERA',
      resultType: 'base64'
    }
  }
};

export default config;
