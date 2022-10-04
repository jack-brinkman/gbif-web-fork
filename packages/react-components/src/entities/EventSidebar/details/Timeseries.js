import React, { useContext, useState } from 'react';
import ThemeContext from '../../../style/themes/ThemeContext';
import { FormattedMessage } from 'react-intl';
import * as css from '../styles';
import { Row, Col, Chart } from "../../../components";
import { Header } from './Header';
import { C } from 'apexcharts';

const getNumericalMofs = (event) => event.measurementOrFactTypes.filter((mofType) => {
  const mofOfType = event.measurementOrFacts.find(
    (mof) => mof.measurementType === mofType
      && mof.measurementValue !== null
  );
  return (/^(\d*\.)?\d+$/ig).test(mofOfType?.measurementValue);
});

const compareDates = (a, b) => {
  const diff = (new Date(a)) - (new Date(b));
  if (diff === 0) return 0;
  return diff > 0 ? 1 : -1;
}

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
  const { results } = data.results.documents;
  const numericMofs = [];

  // Split up MoFs with different measurement methods
  let validResults = results.map((result) => ({
    ...result,
    measurementOrFacts: result.measurementOrFacts.map((mof) => ({
      ...mof,
      measurementType: mof.measurementMethod ? mof.measurementMethod : mof.measurementType
    }))
  }));

  // Update the measurementOrFactTypes property accordingly
  validResults = validResults.map((result) => ({
    ...result,
    measurementOrFactTypes: Array.from(new Set(result.measurementOrFacts.map((mof) => mof.measurementType)))
  }));


  // Filter out events that don't have any numerical MoFs
  // or that don't contain temporal information
  validResults = validResults.filter((result) => {
    const mofs = getNumericalMofs(result);

    // Build a list of valid numerical MoFs that we can chart
    mofs.forEach((mof) => {
      if(!numericMofs.includes(mof)) numericMofs.push(mof);
    });

    return mofs.length > 0 && result.temporalCoverage.gte;
  });

  // Then, re-map each valid event & calculate the average MoF value for each
  // measurement or fact
  validResults = validResults.map((result) => {
    const mofs = {};
    numericMofs.forEach((mofType) => {
      // Retrieve all MoFs for each valid type, and filter out
      // bad / NaN values
      const relevantMofs = result.measurementOrFacts.filter((mof) => 
        mof.measurementType === mofType && !Number.isNaN(parseFloat(mof.measurementValue))
      );

      // Calculate the average of the measurement values
      const mofAvg = relevantMofs.reduce((prev, cur) => prev + parseFloat(cur.measurementValue), 0) / relevantMofs.length;
      mofs[mofType] = Math.round(mofAvg * 100) / 100;
    });

    return {
      date: new Date(result.temporalCoverage.gte),
      mofs
    };
  }).sort((a, b) => compareDates(a.date, b.date));

  // console.log('full vs valid', results.sort((a, b) => compareDates(new Date(a.temporalCoverage.gte), new Date(b.temporalCoverage.gte))), validResults);

  const chart = {
    options: {
      chart: {
        id: "basic-bar",
      },
      xaxis: {
        categories: validResults.map(({ date }) => `${date.getDay()}-${date.getMonth()}-${date.getFullYear()}`),
        // type: 'datetime',
      },
      stroke: {
        curve: 'smooth',
      }
    },
    series: numericMofs.map((mof) => ({
      name: mof,
      data: validResults.map((result) => result.mofs[mof] || null)
    }))
    // series: numericMofs.map((mof) => ({
    //   name: mof,
    //   data: validResults.map((result) => [result.date, result.mofs[mof] || null])
    // }))
  };

  return <Row direction="column" wrap="nowrap" style={{ maxHeight: '100%', overflow: 'hidden' }}>
    <Col style={{ padding: '12px 0', paddingBottom: 50, overflow: 'auto' }} grow>
      <Header data={data} error={error} />
      <div style={{ padding: 12, overflow: 'hidden' }}>
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