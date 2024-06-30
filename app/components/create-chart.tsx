import { darkTheme } from '@/app/styles/chart-themes';
import { lightningChart } from '@arction/lcjs';

export const createLineChart = (container: string) => {
  const lc = lightningChart({
    license: process.env.NEXT_PUBLIC_LC_KEY,
    licenseInformation: {
      company: 'xxx',
      appTitle: 'Dashboard'
    }
  });
  const chart = lc.ChartXY({
    container,
    theme: darkTheme,
    defaultAxisX: { type: 'linear-highPrecision' }
  });
  return chart;
};

export const createBarChart = (container: string) => {
  const lc = lightningChart({
    license: process.env.NEXT_PUBLIC_LC_KEY,
    licenseInformation: {
      company: 'xxx',
      appTitle: 'Dashboard'
    }
  });
  const chart = lc.BarChart({ container, theme: darkTheme });
  return chart;
};
