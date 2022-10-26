import React, { useContext } from 'react';
import ThemeContext from '../../style/themes/ThemeContext';
import ApexChart from 'react-apexcharts';
import styles from './styles';

export function Chart({
  className,
  options,
  series,
  type,
  height,
  colourWrap = null,
  colourWrapRepeat = 4,
  ...props
}) {
  const theme = useContext(ThemeContext);
  const chartColours = theme.chart?.colours || [
    '#F26649',
    '#C44D34',
    '#637073',
    '#FFC557',
    '#B7CD96',
    '#6BDAD5',
    '#003A70',
    '#A191B2',
    '#691C32',
    '#F26649',
    '#C44D34',
    '#637073',
    '#FFC557',
    '#B7CD96',
    '#6BDAD5',
    '#003A70',
    '#A191B2',
    '#691C32',
  ];

  let colours = colourWrap ? [] : chartColours;
  if (colourWrap) {
    for (let wrap = 0; wrap < colourWrapRepeat; wrap += 1) {
      colours = [...colours, ...Array(colourWrap).fill(chartColours[wrap])];
    }
  }

  return (
    <ApexChart
      options={{
        ...(options || {}),
        colors: (series || []).map((_, i) => colours[i]),
        chart: {
          fontFamily: theme.fontFamily,
          ...(options?.chart || {}),
        },
        legend: {
          showForSingleSeries: true,
          ...(options?.legend || {}),
        },
        grid: {
          strokeDashArray: 4,
          ...(options?.grid || {}),
        },
        xaxis: {
          axisBorder: {
            show: false,
            ...(options?.xaxis?.axisBorder || {}),
          },
          axisTicks: {
            show: false,
            ...(options?.xaxis?.axisTicks || {}),
          },
          ...(options?.xaxis || {}),
        },
      }}
      series={series || []}
      type={type}
      height={height || '350'}
    />
  );
}
