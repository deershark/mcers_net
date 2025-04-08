import { createInstance } from 'i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { initReactI18next } from 'react-i18next';

const i18nInstance = createInstance();

i18nInstance
  .use(initReactI18next)
  .use(resourcesToBackend((language: string, namespace: string) => 
    import(`@/messages/${language}.json`)
  ))
  .init({
    lng: 'zh-CN',
    fallbackLng: 'zh-CN',
    supportedLngs: ['zh-CN', 'en'],
    interpolation: {
      escapeValue: false,
    },
  });

export default i18nInstance;
