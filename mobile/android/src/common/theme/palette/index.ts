import palette from '@//common/theme/palette/mainTheme';

declare module '@mui/material/styles' {
  interface PaletteColor {
    lighter: string;
    darker: string;
  }

  interface TypeBackground {
    neutral: string;
  }
}

export default palette;
