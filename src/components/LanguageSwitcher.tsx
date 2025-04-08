'use client'

import { useTranslation } from 'react-i18next';
import { Select } from 'antd';
import { useLanguage } from '../context/LanguageContext';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const { language, setLanguage } = useLanguage();

  const handleChange = (value: string) => {
    setLanguage(value as 'zh-CN' | 'en');
    i18n.changeLanguage(value);
  };

  return (
    <Select
      value={language}
      style={{ width: 120 }}
      onChange={handleChange}
      options={[
        { value: 'zh-CN', label: '中文' },
        { value: 'en', label: 'English' }
      ]}
    />
  );
}
