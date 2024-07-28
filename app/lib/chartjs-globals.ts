import Chart from 'chart.js/auto';

export const chartjsGlobals = {
  setGlobalChartOptions: () => {
    Chart.defaults.font.size = 14;
    Chart.defaults.font.family = 'Nunito Sans, sans-serif';
    Chart.defaults.color = '#e6e6e6';
    Chart.defaults.borderColor = '#4d4d4d';
    Chart.defaults.responsive = true;
  }
};
