import React, { useContext, useState } from 'react';
import ThemeContext from '../../../style/themes/ThemeContext';
import { FormattedMessage } from 'react-intl';
import * as css from '../styles';
import { Row, Col, Chart, Switch } from '../../../components';
import { Header } from './Header';

const getNumericalMofs = (event) =>
  event.measurementOrFactTypes.filter((mofType) => {
    const mofOfType = event.measurementOrFacts.find(
      (mof) => mof.measurementType === mofType && mof.measurementValue !== null
    );
    return /^(\d*\.)?\d+$/gi.test(mofOfType?.measurementValue);
  });

const getDateString = (timestamp) => {
  const date = new Date(timestamp);
  return `${date.getDate()}-${date.getMonth()}-${date.getYear()}`;
};

const compareDates = (a, b) => {
  const diff = a - b;
  if (diff === 0) return 0;
  return diff > 0 ? 1 : -1;
};

export function Timeseries({ data, loading, error, className, ...props }) {
  const theme = useContext(ThemeContext);
  const [showAvg, setShowAvg] = useState(true);
  const [showRaw, setShowRaw] = useState(false);

  // Extract the event object from the data
  const { results } = data.results.documents;
  const numericMofs = [];

  // Split up MoFs with different measurement methods
  let validResults = results.map((result) => ({
    ...result,
    measurementOrFacts: result.measurementOrFacts.map((mof) => ({
      ...mof,
      measurementType: mof.measurementMethod
        ? mof.measurementMethod
        : mof.measurementType,
    })),
  }));

  // Update the measurementOrFactTypes property accordingly
  validResults = validResults.map((result) => ({
    ...result,
    measurementOrFactTypes: Array.from(
      new Set(result.measurementOrFacts.map((mof) => mof.measurementType))
    ),
  }));

  // Filter out events that don't have any numerical MoFs
  // or that don't contain temporal information
  validResults = validResults.filter((result) => {
    const mofs = getNumericalMofs(result);

    // Build a list of valid numerical MoFs that we can chart
    mofs.forEach((mof) => {
      if (!numericMofs.includes(mof)) numericMofs.push(mof);
    });

    return mofs.length > 0 && result.temporalCoverage.gte;
  });

  // Then, re-map each valid event & calculate the average MoF value for each
  // measurement or fact
  const validResultsAvg = validResults
    .reduce((prev, cur, index, arr) => {
      const sameDate = arr.find(
        (item) =>
          getDateString(cur.temporalCoverage.gte) ===
          getDateString(item.temporalCoverage.gte)
      );

      // If an event with this date already exists
      return sameDate
        ? [
            ...prev.filter((item) => item.eventID !== cur.eventID),
            {
              ...sameDate,
              measurementOrFacts: [
                ...sameDate.measurementOrFacts,
                cur.measurementOrFacts,
              ],
            },
          ]
        : [...prev, cur];
    }, [])
    .map((result, i) => {
      const mofs = {};
      const date = new Date(result.temporalCoverage.gte);
      // const date = new Date(1640959200000 + (i * 86400000));
      numericMofs.forEach((mofType) => {
        // Retrieve all MoFs for each valid type, and filter out
        // bad / NaN values
        const relevantMofs = result.measurementOrFacts.filter(
          (mof) =>
            mof.measurementType === mofType &&
            !Number.isNaN(parseFloat(mof.measurementValue))
        );

        // Calculate the average of the measurement values
        const mofAvg =
          relevantMofs.reduce(
            (prev, cur) => prev + parseFloat(cur.measurementValue),
            0
          ) / relevantMofs.length;
        mofs[mofType] = {
          x: date.getTime(),
          y: Math.round(mofAvg * 100) / 100,
        };
      });

      return { date, values: mofs };
    })
    .sort((a, b) => compareDates(a.date, b.date));

  const validResultsScatter = validResults
    .map((result) => {
      const mofs = {};
      const date = new Date(result.temporalCoverage.gte);
      numericMofs.forEach((mofType) => {
        // Retrieve all MoFs for each valid type, and filter out
        // bad / NaN values
        const relevantMofs = result.measurementOrFacts.filter(
          (mof) =>
            mof.measurementType === mofType &&
            !Number.isNaN(parseFloat(mof.measurementValue))
        );

        // Aggregate all MoF values
        const mofIds = [];
        mofs[mofType] = relevantMofs
          .filter((mof) => {
            const ID = `${mof.measurementType}-${mof.measurementMethod}-${mof.measurementValue}`;
            if (mofIds.includes(ID)) return false;

            mofIds.push(ID);
            return true;
          })
          .map((mof) => ({
            x: date.getTime(),
            y: parseFloat(mof.measurementValue),
          }));
      });

      return { date, values: mofs };
    })
    .sort((a, b) => compareDates(a.date, b.date));

  const chart = {
    options: {
      chart: {
        height: 350,
        type: 'scatter',
        zoom: {
          enabled: true,
          type: 'xy',
        },
        animations: {
          enabled: false,
        },
      },
      stroke: {
        curve: 'smooth',
      },
      markers: {
        size: numericMofs
          .map(() =>
            [showRaw ? 6 : null, showAvg ? 4 : null].filter(
              (item) => item !== null
            )
          )
          .flat(),
      },
      tooltip: {
        shared: false,
        intersect: true,
      },
      xaxis: {
        type: 'datetime',
      },
      yaxis: {
        labels: {
          formatter: function (value) {
            return Math.round(value * 100) / 100;
          },
        },
      },
    },
    // series: [
    //   ...(showRaw ? numericMofs : []).map((mof) => ({
    //     type: 'scatter',
    //     name: mof,
    //     data: validResultsScatter.reduce((agg, result) => [...agg, ...result.values[mof]], [])
    //   })),
    //   ...(showAvg ? numericMofs : []).map((mof) => ({
    //     type: 'line',
    //     name: `AVG. ${mof}`,
    //     data: validResultsAvg.map((result) => result.values[mof] || null)
    //   })),
    // ],
    series: numericMofs
      .map((mof) =>
        [
          showRaw
            ? {
                type: 'scatter',
                name: mof,
                data: validResultsScatter.reduce(
                  (agg, result) => [...agg, ...result.values[mof]],
                  []
                ),
              }
            : null,
          showAvg
            ? {
                type: 'line',
                name: `Avg. ${mof}`,
                data: validResultsAvg.map(
                  (result) => result.values[mof] || null
                ),
              }
            : null,
        ].filter((item) => item !== null)
      )
      .flat(),
  };

  const { options, series } = chart;

  return (
    <Row
      direction='column'
      wrap='nowrap'
      style={{ maxHeight: '100%', overflow: 'hidden' }}
    >
      <Col
        style={{ padding: '12px 0', paddingBottom: 50, overflow: 'auto' }}
        grow
      >
        <Header data={data} error={error} />
        <div style={{ padding: 12, overflow: 'hidden' }}>
          <Chart
            options={options}
            series={series}
            type='line'
            height='350'
            colourWrap={showAvg && showRaw ? 2 : null}
            colourWrapRepeat={numericMofs.length}
          />
        </div>
        <div css={css.timeseriesFooter({ theme })}>
          <div style={{ marginRight: 8 }}>
            <Switch
              style={{ marginRight: 8 }}
              checked={showAvg}
              onChange={() => setShowAvg(!showAvg)}
              direction='top'
            />
            <FormattedMessage id={`eventDetails.timeseries.showAvg`} />
          </div>
          <div style={{ marginLeft: 8 }}>
            <Switch
              style={{ marginRight: 8 }}
              checked={showRaw}
              onChange={() => setShowRaw(!showRaw)}
              direction='top'
            />
            <FormattedMessage id={`eventDetails.timeseries.showRaw`} />
          </div>
        </div>
      </Col>
    </Row>
  );
}
