import { lightningChart, Themes } from '@arction/lcjs';
import { lightTheme, darkTheme } from '@/app/lib/chart-themes';

export const createChart = (
  licenseKey: string,
  container: 'chart-container'
) => {
  const lc = lightningChart({
    license: licenseKey,
    licenseInformation: {
      appTitle: 'Data Dashboard',
      company: 'Housti'
    }
  });

  const chart = lc.ChartXY({
    container,
    theme: darkTheme,
    defaultAxisX: { type: 'linear-highPrecision' }
  });
  return chart;
};

export const createBarChart = (
  licenseKey: string,
  container: 'chart-container'
) => {
  const lc = lightningChart({
    license: licenseKey,
    licenseInformation: {
      appTitle: 'Data Dashboard',
      company: 'Housti'
    }
  });

  const chart = lc.BarChart({ container, theme: darkTheme });
  return chart;
};

export const createDataGrid = (
  licenseKey: string,
  container: 'chart-container'
) => {
  const lc = lightningChart({
    license: licenseKey,
    licenseInformation: {
      appTitle: 'Data Dashboard',
      company: 'Housti'
    }
  });

  const chart = lc.DataGrid({ container, theme: darkTheme });
  return chart;
};
