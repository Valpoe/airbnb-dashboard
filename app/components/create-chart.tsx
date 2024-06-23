import { LicenseData } from '@/app/lib/definitions';
import { darkTheme } from '@/app/styles/chart-themes';
import { lightningChart } from '@arction/lcjs';

// export const getLicense = async (): Promise<LicenseData> => {
//   try {
//     const response = await fetch('/api/license');
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }
//     const data: LicenseData = await response.json();
//     return data;
//   } catch (error) {
//     console.error('Error fetching license:', error);
//     throw error;
//   }
// };

export const createLineChart = (container: string) => {
  // const { license, licenseInformation } = await getLicense();
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

// export const createDataGrid = async (container: 'chart-container') => {
//   const { license, licenseInformation } = await getLicense();
//   const lc = lightningChart({
//     license,
//     licenseInformation
//   });
//   const chart = lc.DataGrid({ container, theme: darkTheme });
//   return chart;
// };
