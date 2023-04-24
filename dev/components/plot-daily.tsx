import { Counter, CounterDetails } from '../lib/types';
import React, { useEffect, useRef } from 'react';
import { TopLevelSpec as VlSpec } from 'vega-lite';
import vegaEmbed from 'vega-embed';
import { DateTime } from 'luxon';
import timeFormatLocale from '../data/locale_fr';

type Props = {
    counters: Counter;
    period: string;
};
const PlotDaily = ({ counters, period }: Props) => {
    const container = useRef(null);
    const timeUnit = {
        day: 'yearmonthdatehours' as const,
        month: 'yearmonthdate' as const,
        year: 'yearweek' as const,
    }[period];

    const timeLabel = {
        day: 'heure',
        month: 'jour',
        year: 'semaine',
    }[period];

    const format = {
        day: '%H:%M',
        month: '%e %b %Y',
        year: 'Semaine %W (%d/%m/%Y)',
    }[period];

    const axis = {
        day: {
            title: '',
            tickCount: 8,
            labelAlign: 'left' as const,
            labelExpr:
                "[timeFormat(datum.value, '%H:%M'), timeFormat(datum.value, '%H') == '00' ? timeFormat(datum.value, '%e %b') : '']",
            labelOffset: 4,
            labelPadding: -24,
            tickSize: 30,
            gridDash: {
                condition: {
                    test: { field: 'value', timeUnit: 'hours' as const, equal: 0 },
                    value: [],
                },
                value: [2, 2],
            },
            tickDash: {
                condition: {
                    test: { field: 'value', timeUnit: 'hours' as const, equal: 0 },
                    value: [],
                },
                value: [2, 2],
            },
        },
        month: {
            formatType: 'time',
            format: '%e %b %Y',
            title: '',
            labelAngle: 30,
        },
        year: {
            title: '',
            tickCount: { interval: 'week' as const, step: 10 },
            labelAngle: 0,
            labelAlign: 'left' as const,
            labelExpr:
                "[timeFormat(datum.value, 'Semaine %W'), timeFormat(datum.value, '%m') == '01' ? timeFormat(datum.value, '%Y') : '']",
            labelOffset: 4,
            labelPadding: -24,
            tickSize: 30,
            gridDash: {
                condition: {
                    test: { field: 'value', timeUnit: 'month' as const, equal: 1 },
                    value: [],
                },
                value: [2, 2],
            },
            tickDash: {
                condition: {
                    test: { field: 'value', timeUnit: 'month' as const, equal: 1 },
                    value: [],
                },
                value: [2, 2],
            },
        },
    }[period];

    useEffect(() => {
        const data: CounterDetails[] = counters[period].map(
            ({ time, count, id }) => ({
                time: DateTime.fromISO(time),
                count,
                id,
            })
        );

        const vegaSpec: VlSpec = {
            $schema: 'https://vega.github.io/schema/vega-lite/v4.json',
            description: 'Nombre de passages de vélo',
            data: {
                values: data,
            },
            transform: [
                {
                    joinaggregate: [
                        {
                            op: 'sum',
                            field: 'count',
                            as: 'total',
                        },
                    ],
                    groupby: ['time'],
                },
                {
                    calculate: "(hours(datum.time)+1 %24) == hours(now())   ? hours(datum.time)+'h ' : ' ' ",
                    as: 'colorAlternativeIndex',
                },
                {
                    calculate: 'toString(datum.colorAlternativeIndex) + datum.id',
                    as: 'champsCombine',
                },
            ],
            width: 600,
            autosize: {
                type: "pad",
                contains: "content"
            },
            mark: 'bar',
            encoding: {
                x: {
                    field: 'time',
                    axis: {
                        title: '',
                        tickCount: 8,
                        labelAlign: 'left',
                        labelExpr: "[timeFormat(datum.value, '%H:%M'), timeFormat(datum.value, '%H') == '00' ? timeFormat(datum.value, '%e %b') : '']",
                        labelOffset: 4,
                        labelPadding: -24,
                        tickSize: 30,
                        gridDash: {
                            condition: {
                                test: { field: 'value', timeUnit: 'hours', equal: 0 },
                                value: [],
                            },
                            value: [2, 2],
                        },
                        tickDash: {
                            condition: {
                                test: { field: 'value', timeUnit: 'hours', equal: 0 },
                                value: [],
                            },
                            value: [2, 2],
                        },
                    },
                    timeUnit: 'yearmonthdatehours',
                },
                y: {
                    field: 'count',
                    type: 'quantitative',
                    axis: { title: 'Passages par heure' },
                },
                color: {
                    field: 'champsCombine',
                    type: 'nominal',
                    legend: { title: 'Compteur' },
                    scale: { range: ['#75CBB7', '#CAE26E', '#5BA896', '#A8C545'] },
                },
                tooltip: [
                    { field: 'id', title: 'Sens' },
                    {
                        field: 'time',
                        title: 'heure',
                        type: 'temporal',
                        format: '%H:%M',
                    },
                    { field: 'count', title: 'Passages' },
                    { field: 'total', title: 'Passages total' },
                ],
            },
        };


        vegaEmbed(container.current, vegaSpec, { timeFormatLocale }).then((r) => r);
    }, []);

    return (
        <div
            // eslint-disable-next-line no-return-assign
            ref={(el) => (container.current = el)}
            className="w-full rounded-xl p-6 bg-white mb-3 plot-svg"
        />
    );
};

export default PlotDaily;
