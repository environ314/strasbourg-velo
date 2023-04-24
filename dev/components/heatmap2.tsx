import { Counter } from '../lib/types';
import React, { useEffect, useRef } from 'react';
import { TopLevelSpec as VlSpec } from 'vega-lite';
import vegaEmbed from 'vega-embed';
import timeFormatLocale from '../data/locale_fr';

type Props = {
    counters: Counter;
};
const HeatmapHour = ({ counters }: Props) => {
    const container = useRef(null);

    useEffect(() => {
        const vegaSpec: VlSpec = {
            $schema: 'https://vega.github.io/schema/vega-lite/v4.json',
            data: {
                values: counters['year_hourly'],
            },
            width: 300,
            title: 'Passages horaires sur la semaine',
            config: { view: { strokeWidth: 0, step: 15 }, axis: { domain: false } },
            mark: { type: 'rect', height: 15 },
            encoding: {
                x: {
                    field: 'time',
                    timeUnit: 'day',
                    type: 'ordinal',
                    title: 'Jour de la semaine',
                },
                y: {
                    field: 'time',
                    timeUnit: 'hours',
                    type: 'ordinal',
                    title: 'Passages par heure',
                    scale: {
                        padding: 0,
                        "domain": [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 0, 1, 2]
                    },
                    axis: { format: "%Hh" }
                },
                color: {
                    field: 'count',
                    aggregate: 'mean',
                    type: 'quantitative',
                    legend: { title: 'Passages' },
                    scale: { scheme: "viridis" }
                },
                "tooltip": [
                    {
                        "field": "count",
                        "aggregate": "mean",
                        "title": "Nombre moyen de passages",
                        "format": ".0f"
                    }
                ]
            },
        };
        vegaEmbed(container.current, vegaSpec, { timeFormatLocale }).then((r) => r);
    }, []);

    return (
        <div
            // eslint-disable-next-line no-return-assign
            ref={(el) => (container.current = el)}
            className="w-full rounded-xl p-6 bg-white mb-3"
        />
    );
};

export default HeatmapHour;
