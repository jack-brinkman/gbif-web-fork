import React, { useContext, useState } from 'react';
import ThemeContext from '../../../style/themes/ThemeContext';
import { FormattedMessage } from 'react-intl';
import * as css from '../styles';
import { Row, Col, Chart } from "../../../components";
import { Header } from './Header';

export function Timeseries({
  data,
  loading,
  error,
  className,
  ...props
}) {
  const theme = useContext(ThemeContext);
  const [showAll, setShowAll] = useState(false);

  // Extract the event object from the data
  const { event } = data;
  console.log(data);

  const chart = {
    options: {
      chart: {
        id: "basic-bar",
      },
      xaxis: {
        categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998],
      },
      yaxis: {
        min: 0,
        max: 100
      },
    },
    series: [
      {
        name: "Viability Adjusted Germination (%)",
        data: [100, 97, 91, 79, 55, 45, 43, 40]
      },
      {
        name: "Germination (%)",
        data: [100, 95, 87, 81, 56, 40, 48, 45]
      }
    ]
  };

  return <Row direction="column" wrap="nowrap" style={{ maxHeight: '100%', overflow: 'hidden' }}>
    <Col style={{ padding: '12px 0', paddingBottom: 50, overflow: 'auto' }} grow>
      <Header data={data} error={error} />
      <div style={{ padding: 12 }}>
        <Chart options={chart.options} series={chart.series} type="line" height="350" />
      </div>
    </Col>
    {/* <Col css={css.controlFooter({ theme })} grow={false}>
      <Row justifyContent="flex-end" halfGutter={8}>
        <Col grow={false}>
          <FormattedMessage id={`eventDetails.showAllFields`}/>
          <Switch checked={showAll} onChange={() => setShowAll(!showAll)} direction="top" tip="Shortcut s" />
        </Col>
      </Row>
    </Col> */}
  </Row>
};