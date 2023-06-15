import i18next from 'i18next';
import de from '../assets/locales/de';

type LanguageInfo = {
  id: string;
  name: string;
};

export const supportedLanguages: LanguageInfo[] = [
  { id: 'de', name: 'Deutsch' },
];

export const defaultNS = 'main';
export const resources = {
  de,
} as const;

const initI18next = (escapeValue = false) => {
  i18next.init({
    resources,
    fallbackLng: 'de',
    defaultNS,
    supportedLngs: supportedLanguages.map((x) => x.id),
    interpolation: {
      escapeValue,
    },
  });
};

export default initI18next;
