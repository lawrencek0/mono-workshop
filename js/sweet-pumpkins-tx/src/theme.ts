import * as styledComponents from 'styled-components';

export interface ThemeInterface {
  primaryColor: string;
  secondaryColor: string;
}

const {
  default: styled,
  css,
  injectGlobal,
  keyframes,
  ThemeProvider
} = styledComponents as styledComponents.ThemedStyledComponentsModule<
  ThemeInterface
>;

export const dayTheme = {
  primaryColor: '#FFE519',
  secondaryColor: '#6F4C30',
  bodyColor: '#FFF'
};

export const nightTheme = {
  primaryColor: '#2F3540',
  secondaryColor: '#778E93'
};

export { css, injectGlobal, keyframes, ThemeProvider };

export default styled;
