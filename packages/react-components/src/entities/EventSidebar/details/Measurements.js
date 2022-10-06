import React, { useState } from 'react';
import { DataTable, TBody, Td, Th } from "../../../components";
import { Group } from "./Groups";

export function Measurements({ data }) {
    const [from, setFrom] = useState(0);
    let hasMeasurements = false;
    if (data.results.documents.results
        && data.results.documents.results.length > 0
        && data.results.documents.results[0].measurementOrFacts
        && data.results.documents.results[0].measurementOrFacts.length > 0) {
        hasMeasurements = true;
    }

    if (!hasMeasurements) return <></>;

    const results = data.results.documents.results[0].measurementOrFacts;

    const hasField = (prop) => {
        return results.filter((mof) => Boolean(mof[`measurement${prop}`])).length > 0;
    };
    const extraFields = ['Accuracy', 'Method', 'Remarks', 'DeterminedDate'].filter((field) => hasField(field));

    const size = 10;
    const total = results.length;
    const first = () => setFrom(0);
    const prev = () => setFrom(Math.max(from - size, 0));
    const next = () => setFrom(Math.min(from + size, total));

    const getRows = () => {
        const sortedResults = results.sort((a, b) => a.measurementType.localeCompare(b.measurementType));
        const rows = sortedResults.slice(from, from + size).map(row => {
            return <tr key={row}>
                <Td key={`measurementType`}>{row.measurementType}</Td>
                <Td key={`measurementValue`}>{row.measurementValue}{row.measurementUnit === '%' ? '' : ' '}{row.measurementUnit}</Td>
                {extraFields.map(field => (
                    <Td key={`measurement${field}`}>
                        {row[`measurement${field}`]}
                    </Td>
                ))}
            </tr>;
        });
        return rows;
    }

    const headers = [
        <Th key='measurementType'>
            Measurement
        </Th>,
        <Th key='measurementValue'>
            Value
        </Th>,
        ...extraFields.map(field => (
            <Th key={`measurement${field}`}>
                {field}
            </Th>
        ))
    ];

    return <>
        <Group label="eventDetails.groups.measurementsOrFacts">
            <DataTable fixedColumn={true} {...{ first, prev, next, size, from, total }} style={{ height: 300 }}>
                <thead>
                <tr>{headers}</tr>
                </thead>
                <TBody columnCount={2 + extraFields.length}>
                    {getRows()}
                </TBody>
            </DataTable>
        </Group>
    </>
}