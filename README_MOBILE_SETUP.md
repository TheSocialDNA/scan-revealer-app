# دليل تحويل التطبيق إلى تطبيق محمول مع AdMob

## الخطوة 1: نقل المشروع إلى حاسوبك

1. **انقل المشروع إلى GitHub:**
   - اضغط على زر "Export to Github" في Lovable
   - أنشئ مستودع GitHub جديد

2. **استنسخ المشروع على حاسوبك:**
```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO
```

## الخطوة 2: تثبيت المتطلبات

```bash
# تثبيت الحزم
npm install

# تهيئة Capacitor (إذا لم يتم تلقائياً)
npx cap init
```

## الخطوة 3: إضافة المنصات

### لنظام Android:
```bash
npx cap add android
npx cap update android
```

### لنظام iOS (يتطلب جهاز Mac):
```bash
npx cap add ios
npx cap update ios
```

## الخطوة 4: إعداد AdMob

### الحصول على معرفات AdMob:

1. **إنشاء حساب AdMob:**
   - انتقل إلى: https://admob.google.com
   - سجل الدخول بحساب Google
   - أنشئ تطبيقاً جديداً

2. **الحصول على معرفات الإعلانات:**
   - بعد إنشاء التطبيق، ستحصل على App ID
   - أنشئ وحدات إعلانية (Banner, Interstitial, Rewarded)
   - احفظ معرفات كل نوع إعلان

3. **تحديث المعرفات في الكود:**
   - افتح `src/services/admob.ts`
   - استبدل معرفات الاختبار في `TEST_IDS` بمعرفاتك الحقيقية:

```typescript
const PRODUCTION_IDS = {
  android: {
    banner: 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',
    interstitial: 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',
    rewarded: 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX'
  },
  ios: {
    banner: 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',
    interstitial: 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',
    rewarded: 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX'
  }
};
```

### إعداد AdMob في Android:

1. **افتح ملف `android/app/src/main/AndroidManifest.xml`**
2. **أضف App ID من AdMob:**

```xml
<application>
    ...
    <meta-data
        android:name="com.google.android.gms.ads.APPLICATION_ID"
        android:value="ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX"/>
</application>
```

### إعداد AdMob في iOS:

1. **افتح ملف `ios/App/App/Info.plist`**
2. **أضف App ID:**

```xml
<key>GADApplicationIdentifier</key>
<string>ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX</string>
```

## الخطوة 5: بناء التطبيق

```bash
# بناء مشروع الويب
npm run build

# مزامنة مع المنصات
npx cap sync
```

## الخطوة 6: تشغيل التطبيق

### على Android:
```bash
npx cap run android
```
أو افتح `android/` في Android Studio

### على iOS:
```bash
npx cap open ios
```
ثم قم بتشغيل التطبيق من Xcode

## الخطوة 7: التطوير والمعاينة (Hot Reload)

للتطوير مع معاينة فورية على الهاتف:

1. **تأكد من تحديث `capacitor.config.ts`:**
```typescript
server: {
  url: 'https://c9ee73f9-2c52-4997-bc20-c586315c5fa4.lovableproject.com?forceHideBadge=true',
  cleartext: true
}
```

2. **مزامنة التغييرات:**
```bash
npx cap sync
```

3. **شغل التطبيق** وسيتم تحميل المحتوى مباشرة من Lovable!

## ملاحظات مهمة:

### ⚠️ وضع الاختبار vs الإنتاج:

- **أثناء التطوير:** استخدم `testMode: true` و معرفات الاختبار
- **للنشر:** غيّر إلى `testMode: false` واستخدم معرفاتك الحقيقية

### 📱 الأذونات المطلوبة:

التطبيق يحتاج أذونات الكاميرا - تم إعدادها تلقائياً في:
- Android: `AndroidManifest.xml`
- iOS: `Info.plist`

### 🎯 أنواع الإعلانات المستخدمة:

1. **Banner (بانر):** يظهر في أسفل الشاشة دائماً
2. **Interstitial (بيني):** يظهر بعد كل تحليل منتج ناجح
3. **Rewarded (مكافأة):** يمكن إضافته لميزات إضافية

### 🔧 استكشاف الأخطاء:

**مشكلة: الإعلانات لا تظهر**
- تأكد من صحة معرفات AdMob
- تحقق من تفعيل التطبيق في لوحة AdMob
- قد يستغرق ظهور الإعلانات الحقيقية ساعات بعد النشر

**مشكلة: الكاميرا لا تعمل**
- تحقق من الأذونات في إعدادات الهاتف
- أعد تشغيل التطبيق

## الخطوة 8: النشر

### Android (Google Play):
1. بناء APK للإنتاج
2. التوقيع على APK
3. رفع إلى Google Play Console

### iOS (App Store):
1. بناء IPA للإنتاج
2. رفع إلى App Store Connect

---

## 🎉 تهانينا!

التطبيق الآن جاهز كتطبيق محمول أصلي مع دعم كامل لـ AdMob!

**المميزات:**
- ✅ كاميرا هاتف أصلية
- ✅ إعلانات AdMob (بانر، بيني، مكافأة)
- ✅ واجهة عربية كاملة
- ✅ تحليل ذكي بـ Gemini AI
- ✅ يعمل على Android و iOS

للمساعدة: راجع [دليل Capacitor الرسمي](https://capacitorjs.com/docs)
