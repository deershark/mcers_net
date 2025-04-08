'use client'

import { ConfigProvider, App, Layout } from 'antd';
const { Header, Content } = Layout;
import LanguageSwitcher from './LanguageSwitcher';
import type { ReactNode } from 'react';
import { LanguageProvider } from '../context/LanguageContext';

const theme = {
  token: {
    colorPrimary: '#3B8526',
    borderRadius: 0,
    fontFamily: "-apple-system, sans-serif",
    colorBgContainer: '#1E1E1E',
    colorText: '#E0E0E0'
  },
  components: {
    Button: {
      borderRadiusLG: 0,
      controlHeightLG: 40
    },
    Card: {
      borderRadiusLG: 0,
      colorBgContainer: '#2D2D2D'
    }
  }
};

type ClientLayoutProps = {
  children: ReactNode;
};

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <LanguageProvider>
      <ConfigProvider theme={theme}>
        <App>
          <Layout style={{ minHeight: '100vh' }}>
            <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '0 24px' }}>
              <LanguageSwitcher />
            </Header>
            <Content>
              {children}
            </Content>
          </Layout>
        </App>
      </ConfigProvider>
    </LanguageProvider>
  );
}
