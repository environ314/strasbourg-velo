import { Counter } from '../lib/types';
import React, { useEffect, useRef } from 'react';
import { TopLevelSpec as VlSpec } from 'vega-lite';
import vegaEmbed from 'vega-embed';
import timeFormatLocale from '../data/locale_fr';

type Props = {
    counters: Counter;
};
const HeatmapSens = ({ counters }: Props) => {
    const container = useRef(null);

    useEffect(() => {
        const vegaSpec: VlSpec = {
            $schema: 'https://vega.github.io/schema/vega-lite/v4.json',
            data: {
                values: counters['year_hourly'],
            },
            "transform": [
                { "timeUnit": "day", "field": "time", "as": "dayOfWeek" },
                { "timeUnit": "hours", "field": "time", "as": "hour" },
                {
                    "aggregate": [
                        { "op": "sum", "field": "count", "as": "passage_creneau_par_compteur" }
                    ],
                    "groupby": ["dayOfWeek", "hour", "id"]
                },
                {
                    "joinaggregate": [
                        {
                            "op": "sum",
                            "field": "passage_creneau_par_compteur",
                            "as": "passage_creneau"
                        }
                    ],
                    "groupby": ["dayOfWeek", "hour"]
                },
                {
                    "window": [{ "op": "row_number", "as": "id_order" }],
                    "groupby": ["dayOfWeek", "hour"]
                },
                {
                    "joinaggregate": [
                        {
                            "op": "max",
                            "field": "passage_creneau_par_compteur",
                            "as": "max_total_count_for_group"
                        }
                    ],
                    "groupby": ["dayOfWeek", "hour"]
                },
                {
                    "window": [{ "op": "row_number", "as": "rank" }],
                    "sort": [
                        { "field": "passage_creneau_par_compteur", "order": "descending" }
                    ],
                    "groupby": ["dayOfWeek", "hour"]
                },
                {
                    "joinaggregate": [
                        {
                            "op": "argmax",
                            "field": "passage_creneau_par_compteur",
                            "as": "id_max_passage_creneau_par_compteur"
                        }
                    ],
                    "groupby": ["dayOfWeek", "hour"]
                },
                {
                    "calculate": "datum.id_max_passage_creneau_par_compteur.id",
                    "as": "max_id_compteur_pour_creneau"
                },
                {
                    "calculate": "datum.id_order === 1 ? datum.passage_creneau_par_compteur /datum.passage_creneau : 1-datum.passage_creneau_par_compteur /datum.passage_creneau",
                    "as": "rate_brut"
                },
                {
                    "calculate": "1/(1+pow(2.718281828459045, -( 20*(datum.rate_brut - 0.5))))",
                    "as": "rate"
                },
                {
                    "joinaggregate": [
                        { "op": "sum", "field": "count", "as": "total_count_sum" }
                    ],
                    "groupby": ["dayOfWeek", "hour"]
                },
                {
                    "joinaggregate": [
                        { "op": "max", "field": "passage_creneau", "as": "max_passage_creneau" }
                    ],
                    "groupby": []
                },
                {
                    "calculate": "datum.passage_creneau / datum.max_passage_creneau",
                    "as": "opacity_ratio"
                },


            ],
            "width": 300,
            "title": "Sens de Passages horaires sur la semaine",
            "config": { "view": { "strokeWidth": 0, "step": 25 }, "axis": { "domain": false } },
            "mark": { "type": "rect", "height": 20 },
            "encoding": {
                "x": {
                    "field": "dayOfWeek",
                    "timeUnit": "day",
                    "type": "ordinal",
                    "title": "Jour de la semaine"
                },
                "y": {
                    "field": "hour",
                    "timeUnit": "hours",
                    "type": "ordinal",
                    "title": "Passages par heure",
                    "scale": {
                        "padding": -5,
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
                    "field": "rate",
                    "aggregate": "median",
                    "type": "quantitative",
                    "legend": null,
                    "scale": { "scheme": "redblue", "domain": [0, 1], }
                },
                "opacity": {
                    "field": "opacity_ratio",
                    "type": "quantitative",
                    "scale": { "domain": [0, 1], "range": [0, 1] },
                    "legend": { "title": "Passage" }
                },
                "tooltip": [
                    {
                        "field": "rate_brut",
                        "aggregate": "median",
                        "title": "proportion de passages dans un sens",
                        "format": ".0%"
                    },
                    {
                        "field": "opacity_ratio",
                        "aggregate": "median",
                        "title": "intensité des passages",
                        "format": ".1"
                    },
                    {
                        "field": "max_id_compteur_pour_creneau",
                        "title": "déplacements majoritairement"
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

export default HeatmapSens;
