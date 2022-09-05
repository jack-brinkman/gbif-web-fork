import React from 'react';
import {DataTable, TBody, Td, Th, Button} from "../../../components";
import {Group} from "./Groups";

export function Overview ({ data }) {
    let hasMeasurements = false;
    if (data.results.documents.results
        && data.results.documents.results.length > 0
        && data.results.documents.results[0].measurementOrFacts
        && data.results.documents.results[0].measurementOrFacts.length > 0) {
        hasMeasurements = true;
    }

    if (!hasMeasurements){
        return <></>
    }

    console.log(data)

    const results = data.results.documents.results[0].measurementOrFacts;

    const getRows = () => {
        const rows = results.map(row => {
            return <tr key={row}>
                <Td key={`measurementType`}>{row.measurementType}</Td>
                <Td key={`measurementValue`}>{row.measurementValue}{row.measurementUnit}</Td>
            </tr>;
        });
        return rows;
    }

    const headers = [
        <Th key='measurementType'>
            Measurement
        </Th>,
        <Th key='measurementValue'>
            value
        </Th>
    ];

    const first = () => { };
    const prev = () => { };
    const next = () => { };
    const size = 10;
    const from = 0;
    const total = results.length;
    return <Group label="eventDetails.groups.overview">
            <DataTable fixedColumn={true} {...{ first, prev, next, size, from, total }} style={{ height: 300 }}>
                <thead>
                <tr>{headers}</tr>
                </thead>
                <TBody columnCount={2}>
                    {getRows()}
                </TBody>
            </DataTable>
            {/* <Button look="primaryOutline" style={{ marginTop: '20px', fontSize: '11px' }}>
          View events related to this thing
        </Button> */}
        </Group>
}