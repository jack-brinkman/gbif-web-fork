
import React, { useContext } from 'react';
import ThemeContext from '../../style/themes/ThemeContext';
import ApexChart from "react-apexcharts";
import styles from './styles';

export function Chart({
  className,
  options,
  series,
  type,
  height,
  ...props
}) {
  const theme = useContext(ThemeContext);
  return (
    <ApexChart
      options={{
        ...(options || {}),
        chart: {
          fontFamily: theme.fontFamily,
          ...(options?.chart || {})
        },
        legend: {
          showForSingleSeries: true,
          ...(options?.legend || {})
        },
        grid: {
          strokeDashArray: 4,
          ...(options?.grid || {})
        },
        xaxis: {
          axisBorder: {
            show: false,
            ...(options?.xaxis?.axisBorder || {})
          },
          axisTicks: {
            show: false,
            ...(options?.xaxis?.axisTicks || {})
          },
          ...(options?.xaxis || {})
        },
      }}
      series={series || []}
      type={type}
      height={height || "350"}
    />
  )
};
