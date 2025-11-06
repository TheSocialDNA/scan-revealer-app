import { AdMob, BannerAdOptions, BannerAdSize, BannerAdPosition, AdLoadInfo, AdMobRewardItem } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';

// معرفات إعلانات الاختبار (استبدلها بمعرفاتك الحقيقية من AdMob)
const TEST_IDS = {
  android: {
    banner: 'ca-app-pub-3940256099942544/6300978111',
    interstitial: 'ca-app-pub-3940256099942544/1033173712',
    rewarded: 'ca-app-pub-3940256099942544/5224354917'
  },
  ios: {
    banner: 'ca-app-pub-3940256099942544/2934735716',
    interstitial: 'ca-app-pub-3940256099942544/4411468910',
    rewarded: 'ca-app-pub-3940256099942544/1712485313'
  }
};

class AdMobService {
  private isInitialized = false;
  private platform: 'android' | 'ios' | 'web' = 'web';

  constructor() {
    this.platform = Capacitor.getPlatform() as 'android' | 'ios' | 'web';
  }

  async initialize() {
    if (this.isInitialized || this.platform === 'web') {
      console.log('AdMob: Skipping initialization (web platform or already initialized)');
      return;
    }

    try {
      await AdMob.initialize({
        testingDevices: [], // أضف معرفات أجهزة الاختبار هنا
        initializeForTesting: true, // استخدم true أثناء التطوير
      });
      this.isInitialized = true;
      console.log('AdMob initialized successfully');
    } catch (error) {
      console.error('AdMob initialization error:', error);
    }
  }

  async showBanner() {
    if (this.platform === 'web') {
      console.log('AdMob: Banner ads not available on web');
      return;
    }

    try {
      const options: BannerAdOptions = {
        adId: TEST_IDS[this.platform].banner,
        adSize: BannerAdSize.BANNER,
        position: BannerAdPosition.BOTTOM_CENTER,
        margin: 0,
      };

      await AdMob.showBanner(options);
      console.log('Banner ad shown');
    } catch (error) {
      console.error('Error showing banner ad:', error);
    }
  }

  async hideBanner() {
    if (this.platform === 'web') return;

    try {
      await AdMob.hideBanner();
      console.log('Banner ad hidden');
    } catch (error) {
      console.error('Error hiding banner ad:', error);
    }
  }

  async showInterstitial() {
    if (this.platform === 'web') {
      console.log('AdMob: Interstitial ads not available on web');
      return;
    }

    try {
      // تحميل الإعلان
      await AdMob.prepareInterstitial({
        adId: TEST_IDS[this.platform].interstitial,
      });
      
      // عرض الإعلان
      await AdMob.showInterstitial();
      console.log('Interstitial ad shown');
    } catch (error) {
      console.error('Error showing interstitial ad:', error);
    }
  }

  async showRewardedAd() {
    if (this.platform === 'web') {
      console.log('AdMob: Rewarded ads not available on web');
      return;
    }

    try {
      // تحميل الإعلان
      await AdMob.prepareRewardVideoAd({
        adId: TEST_IDS[this.platform].rewarded,
      });
      
      // عرض الإعلان
      const result = await AdMob.showRewardVideoAd();
      
      if (result) {
        console.log('User earned reward:', result);
        return result;
      }
    } catch (error) {
      console.error('Error showing rewarded ad:', error);
    }
  }

  async removeBanner() {
    if (this.platform === 'web') return;

    try {
      await AdMob.removeBanner();
      console.log('Banner ad removed');
    } catch (error) {
      console.error('Error removing banner ad:', error);
    }
  }
}

export const adMobService = new AdMobService();
