import { shadeHexColor, shadeBlend } from './utils';
import defaultTheme from '../themes/light';

const themeBuilder = theme => {
  let fullTheme = { ...defaultTheme, ...theme }
  const direction = fullTheme.darkTheme ? -1 : 1;

  fullTheme.primary500 = theme.primary;
  fullTheme.primary600 = shadeHexColor(fullTheme.primary, -0.05);
  fullTheme.primary700 = shadeHexColor(fullTheme.primary, -0.1);
  fullTheme.primary400 = shadeHexColor(fullTheme.primary, 0.05);
  fullTheme.primary300 = shadeHexColor(fullTheme.primary, 0.1);

  fullTheme.transparentInk40 = `${fullTheme.color}40`;
  fullTheme.transparentInk60 = `${fullTheme.color}60`;
  fullTheme.transparentInk20 = `${fullTheme.color}20`;
  fullTheme.transparentInk80 = `${fullTheme.color}80`;
  fullTheme.transparentInk50 = `${fullTheme.color}50`;

  [1, 2, 3, 4, 5, 6, 7, 8, 9].forEach(x => {
    fullTheme[`color${10 - x}00`] = shadeBlend(-1 * direction * x * 0.075, fullTheme.color, fullTheme.paperBackground);
  });

  // GENERATE PAPER BACKGROUNDS
  // lighter paper colors are used to indicate elevation/focus
  // 500 is considered neutral standard color, 400 is darker and indicate secondary content
  // 600 is brighter and indicate elevation (used for dark themes)
  [1, 2, 3, 4].forEach(x => {
    //darken
    fullTheme[`paperBackground${5 + x}00`] = shadeBlend(-x * 0.25, fullTheme.paperBackground, fullTheme.background);
    //lighten
    // paper colors above 500 might be capped if there are no diff to paperBackgroundElevated (e.g. is already white)
    fullTheme[`paperBackground${5 - x}00`] = shadeBlend(x * 0.25, fullTheme.paperBackground, fullTheme.paperBackgroundElevated);
    // neutral
    fullTheme[`paperBackground500`] = fullTheme.paperBackground;
  });

  fullTheme.darkPaperBackground = fullTheme.darkTheme ? '#000010' : '#4e4e52';
  
  const brightMapColors = [
    "#fed976",
    "#fd8d3c",
    "#fd8d3c",
    "#f03b20",
    "#bd0026"
  ];
  const darkMapColors = brightMapColors;//['#ffd300', '#f4b456', '#e9928a', '#d96cc1', '#b93bff'];
  
  fullTheme.mapDensityColors = fullTheme.darkTheme ? darkMapColors : brightMapColors;
  return fullTheme;
}

export default themeBuilder;