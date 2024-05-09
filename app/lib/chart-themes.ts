import {
  ColorHEX,
  ColorRGBA,
  GlowEffect,
  isSolidFill,
  SolidFill
} from '@arction/lcjs';
import { makeFlatTheme } from '@arction/lcjs-themes';
import type { Theme } from '@arction/lcjs';

export const dataColorsLight = [
  ColorHEX('#6730bf'),
  ColorHEX('#16a889'),
  ColorHEX('#bf7a30'),
  ColorHEX('#d93695'),
  ColorHEX('#3649d9'),
  ColorHEX('#72a322'),
  ColorHEX('#a336d9'),
  ColorHEX('#219fb8'),
  ColorHEX('#bf5843'),
  ColorHEX('#ba25ba'),
  ColorHEX('#1d79bf'),
  ColorHEX('#a89519')
];

export const dataColorsDark = [
  ColorHEX('#8b5cd6'),
  ColorHEX('#2be3bb'),
  ColorHEX('#d69b5c'),
  ColorHEX('#e268b0'),
  ColorHEX('#6877e2'),
  ColorHEX('#9cd63d'),
  ColorHEX('#ba68e2'),
  ColorHEX('#45c4dd'),
  ColorHEX('#cf8172'),
  ColorHEX('#db4cdb'),
  ColorHEX('#429de3'),
  ColorHEX('#e0c931')
];

export const dataColors = {
  0: { light: '#6730bf', dark: '#8b5cd6' },
  1: { light: '#16a889', dark: '#2be3bb' },
  2: { light: '#bf7a30', dark: '#d69b5c' },
  3: { light: '#d93695', dark: '#e268b0' },
  4: { light: '#3649d9', dark: '#6877e2' },
  5: { light: '#72a322', dark: '#9cd63d' },
  6: { light: '#a336d9', dark: '#ba68e2' },
  7: { light: '#219fb8', dark: '#45c4dd' },
  8: { light: '#bf5843', dark: '#cf8172' },
  9: { light: '#ba25ba', dark: '#db4cdb' },
  10: { light: '#1d79bf', dark: '#429de3' },
  11: { light: '#a89519', dark: '#e0c931' }
};

const light = makeFlatTheme({
  isDark: false,
  fontFamily: "'GT-Eesti-Light', sans-serif",
  backgroundColor: ColorHEX('#ffffff00'),
  textColor: ColorHEX('#121212'),
  dataColors: dataColorsLight,
  axisColor: ColorHEX('#2b2b2b'),
  gridLineColor: ColorHEX('#e6e6e6'),
  uiBackgroundColor: ColorHEX('#e6e6e6'),
  uiBorderColor: ColorHEX('#121212'),
  dashboardSplitterColor: ColorHEX('#2b2b2b')
});

const lightTheme: Theme = {
  ...light,
  yAxisNumericTicks: light.yAxisNumericTicks.setMinorTickStyle((minor) =>
    minor.setLabelFillStyle((fill) =>
      isSolidFill(fill) ? fill.setA(128) : fill
    )
  )
};

const dark = makeFlatTheme({
  isDark: true,
  fontFamily: "'GT-Eesti-Light', sans-serif",
  backgroundColor: ColorHEX('#12121200'),
  textColor: ColorHEX('#ffffff'),
  dataColors: dataColorsDark,
  axisColor: ColorHEX('#000000'),
  gridLineColor: ColorHEX('#4d4d4d'),
  uiBackgroundColor: ColorHEX('#262626'),
  uiBorderColor: ColorHEX('#e6e6e6'),
  dashboardSplitterColor: ColorHEX('#4d4d4d')
});

const darkTheme: Theme = {
  ...dark,
  yAxisNumericTicks: dark.yAxisNumericTicks.setMinorTickStyle((minor) =>
    minor.setLabelFillStyle((fill) =>
      isSolidFill(fill) ? fill.setA(128) : fill
    )
  )
};

export { lightTheme, darkTheme };
