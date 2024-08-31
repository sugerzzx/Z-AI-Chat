import { extendTheme } from '@mui/joy/styles';
import { Inter, Source_Code_Pro } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  adjustFontFallback: false, // prevent NextJS from adding its own fallback font
  fallback: ['var(--joy-fontFamily-fallback)'], // use Joy UI's fallback font
  display: 'swap',
});

const sourceCodePro = Source_Code_Pro({
  subsets: ['latin'],
  adjustFontFallback: false, // prevent NextJS from adding its own fallback font
  fallback: [
    // the default theme's fallback for monospace fonts
    'ui-monospace',
    'SFMono-Regular',
    'Menlo',
    'Monaco',
    'Consolas',
    'Liberation Mono',
    'Courier New',
    'monospace',
  ],
  display: 'swap',
});

const theme = extendTheme({
  fontFamily: {
    body: inter.style.fontFamily,
    display: inter.style.fontFamily,
    code: sourceCodePro.style.fontFamily,
  },
  components: {
    JoyTooltip: {
      styleOverrides: {
        root: {
          borderRadius: '0.5rem',
          padding: '0.5rem 0.75rem',
          fontWeight: 600,
          fontSize: '0.9rem',
          backgroundColor: '#0d0d0d',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
      },
    },
    JoyMenu: {
      styleOverrides: {
        root: {
          borderRadius: '0.5rem',
          padding: '0.5rem 0',
          backgroundColor: 'var(--main-surface-primary)',
          border: '1px solid var(--border-light)',
        },
      }
    }
  },
});

export default theme;