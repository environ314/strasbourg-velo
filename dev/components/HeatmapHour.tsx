import { Counter } from '../lib/types';
import React, { useEffect, useRef } from 'react';
import { TopLevelSpec as VlSpec } from 'vega-lite';
import vegaEmbed from 'vega-embed';
import timeFormatLocale from '../data/locale_fr';
import { None } from 'vega';

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
            "transform": [
                {
                    "calculate": "hours(datum.time) < 3 ? datetime(year(datum.time), month(datum.time), date(datum.time)-1, hours(datum.time)) : datetime(datum.time)",
                    "as": "shifted_time"
                },

                { "timeUnit": "day", "field": "shifted_time", "as": "dayOfWeek" },
                {
                    "joinaggregate": [
                        { "op": "mean", "field": "count", "as": "sum_count_by_day" }
                    ],
                    "groupby": ["dayOfWeek"]
                },
                {
                    "joinaggregate": [
                        { "op": "distinct", "field": "id", "as": "unique_id_count" }
                    ]
                },
                {
                    "joinaggregate": [
                        { "op": "sum", "field": "count", "as": "sum_count_by_day_and_hour" }
                    ],
                    "groupby": ["dayOfWeek", "shifted_time"]
                },
                {
                    "calculate": "24*datum.unique_id_count*datum.sum_count_by_day",
                    "as": "count_by_dayOfWeek"
                },
                {
                    "calculate": "datum.unique_id_count*datum.sum_count_by_day",
                    "as": "count_by_hourOfDay"
                }
            ],
            "hconcat": [
                {
                    "vconcat": [
                        {
                            // GRAPHIQUE 1
                            "width": 300,
                            "title": "Passages du jour en fonction de l'heure",
                            "mark": { "type": "rect" },
                            "encoding": {
                                "x": {
                                    "field": "shifted_time",
                                    "timeUnit": "day",
                                    "type": "ordinal",
                                    "title": "Jour de la semaine"
                                },
                                "y": {
                                    "field": "shifted_time",
                                    "timeUnit": "hours",
                                    "type": "ordinal",
                                    "title": "heures du jour",
                                    "scale": {
                                        "padding": 0,
                                        "domain": [
                                            3,
                                            4,
                                            5,
                                            6,
                                            7,
                                            8,
                                            9,
                                            10,
                                            11,
                                            12,
                                            13,
                                            14,
                                            15,
                                            16,
                                            17,
                                            18,
                                            19,
                                            20,
                                            21,
                                            22,
                                            23,
                                            0,
                                            1,
                                            2
                                        ]
                                    },
                                    "axis": { "format": "%Hh" }
                                },
                                "color": {
                                    "field": "sum_count_by_day_and_hour",
                                    "aggregate": "mean",
                                    "type": "quantitative",
                                    "legend": { "title": "Passages/h" },
                                    "scale": { "scheme": "viridis" }
                                },
                                "tooltip": [
                                    {
                                        "field": "sum_count_by_day_and_hour",
                                        "aggregate": "mean",
                                        "title": "Nombre moyen de passages",
                                        "format": ".0f"
                                    }
                                ]
                            }
                        },
                        {
                            // GRAPHIQUE 3
                            "width": 300,
                            "title": "Nombre moyen de passages par jour",
                            "mark": "bar",
                            "encoding": {
                                "x": {
                                    "field": "shifted_time",
                                    "timeUnit": "day",
                                    "type": "ordinal",
                                    "title": "Jour de la semaine",
                                    "scale": { "padding": 0 }
                                },
                                "y": {
                                    "field": "count_by_dayOfWeek",
                                    "aggregate": "mean",
                                    "type": "quantitative",
                                    "title": "Total",
                                    "scale": {
                                        "padding": 0,
                                        "reverse": true
                                    }
                                },
                                "color": {
                                    "field": "sum_count_by_day_and_hour",
                                    "aggregate": "mean",
                                    "type": "quantitative",
                                    "scale": { "scheme": "" }
                                },
                                "tooltip": [
                                    {
                                        "field": "count_by_hourOfDay",
                                        "title": "et par heure",
                                        "format": ".0f"
                                    }
                                ]
                            }
                        }
                    ],
                    "spacing": 10
                },
                {
                    // GRAPHIQUE 2
                    "title": "Nombre moyen de passages par heure",
                    "mark": { "type": "bar", },
                    "encoding": {
                        "x": {
                            "title": "Total",
                            "field": "sum_count_by_day_and_hour",
                            "aggregate": "mean",
                            "type": "quantitative",
                        },
                        "y": {
                            "field": "shifted_time",
                            "timeUnit": "hours",
                            "type": "ordinal",
                            "title": "",
                            "scale": {
                                "padding": 0,
                                "domain": [
                                    3,
                                    4,
                                    5,
                                    6,
                                    7,
                                    8,
                                    9,
                                    10,
                                    11,
                                    12,
                                    13,
                                    14,
                                    15,
                                    16,
                                    17,
                                    18,
                                    19,
                                    20,
                                    21,
                                    22,
                                    23,
                                    0,
                                    1,
                                    2
                                ]
                            },
                            "axis": { "format": "%Hh" }
                        },
                        "color": {
                            "field": "sum_count_by_day_and_hour",
                            "aggregate": "mean",
                            "type": "quantitative",
                            "legend": { "title": "Passages" },
                            "scale": { "scheme": "viridis" }
                        },
                        "tooltip": [
                            {
                                "field": "sum_count_by_day_and_hour",
                                "aggregate": "mean",
                                "title": "Nombre moyen de passages",
                                "format": ".0f"
                            }
                        ]
                    }
                }
            ],
            "spacing": 10

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
