import type { Theme } from '@arction/lcjs';
import { ColorHEX, isSolidFill } from '@arction/lcjs';
import { makeCustomTheme } from '@arction/lcjs-themes';

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

const dark = makeCustomTheme({
  isDark: true,
  gradients: false,
  fontFamily: 'Segoe UI, -apple-system, Verdana, Helvetica',
  backgroundColor: ColorHEX('#12121200'),
  textColor: ColorHEX('#ffffff'),
  dataColors: dataColorsDark,
  axisColor: ColorHEX('#4d4d4d'),
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

export { darkTheme };
