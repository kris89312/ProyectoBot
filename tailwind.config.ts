import type { Config } from 'tailwindcss';
const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#1A56DB', dark: '#1E429F' },
        sidebar: { DEFAULT: '#1F2937', text: '#D1D5DB' },
        surface: '#FFFFFF',
        border: '#E5E7EB',
        muted: '#6B7280',
        success: '#16A34A',
        warning: '#D97706',
        destructive: '#DC2626',
        info: '#2563EB',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};
export default config;
