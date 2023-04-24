import _ from 'lodash';
import { CounterMetadata, CounterSummary, CounterStat } from './types';

export const parseCoord = (coord: string): [number, number] => {
  const parts = coord.split(',');
  return [Number(parts[1]), Number(parts[0])];
};

const transform = (metadatas: { [id: string]: CounterMetadata }) => (
  counter: CounterSummary,
  id: string
): CounterStat => {
  const metadata = metadatas[id];
  const minDate = counter.minDate;
  const maxDate = counter.maxDate;

  const days = Math.round(maxDate.diff(minDate, 'day').days);
  return {
    id,
    label: metadata.nom_compteur,
    strippedLabel: strip(metadata.nom_compteur),
    days,
    total: counter.total,
    yesterday: counter.yesterday,
    currentDay : counter.currentDay,
    month: counter.month,
    week: counter.week,
    year: counter.year,
    daysThisYear: counter.daysThisYear,
    included: [],
    coordinates: parseCoord(metadata.coordinates),
  };
};

const merge = (counters: CounterStat[], id: string): CounterStat => ({
  id,
  label: id,
  strippedLabel: id,
  days: _.sumBy(counters, 'days')/counters.length,
  total: _.sumBy(counters, 'total'),
  yesterday: _.sumBy(counters, 'yesterday'),
  currentDay: _.sumBy(counters, 'currentDay'),
  month: _.sumBy(counters, 'month'),
  week: _.sumBy(counters, 'week'),
  year: _.sumBy(counters, 'year'),
  daysThisYear: counters[0].daysThisYear,
  included: _.map(counters, 'label'),
  coordinates: counters[0].coordinates,
});

export const strip = (name) => {
  const num = /^\d+/;
  const direction = /[NESO]+-[NESO]+/g;
  return fix(name)
    .replace(num, '')
    .replace(direction, '')
    .trim()
    .replace(/^\w/, (c) => c.toUpperCase());
};

const dedup = (name) => {
  const first = name.substr(0, name.length / 2).trim();
  const second = name.substr(name.length / 2, name.length).trim();
  if (first === second) {
    return first;
  } else {
    return name;
  }
};

const fix = (name) => {
  const fixed = name
    .replace('Totem ', '')
    .replace('Face au ', '')
    .replace('Face ', '')
    .replace('Menilmontant', 'Ménilmontant')
    .replace('8 boulevard d\'Indochine 8 boulevard d\'Indochine', 'Boulevard d’Indochine')
    .replace('(prêt)', '')
    .replace('Logger_IN', '')
    .replace('Logger_OUT', '')
    .replace('[Bike IN]', '')
    .replace('[Bike OUT]', '')
    .replace('Piétons IN', '')
    .replace('Piétons OUT', '')
    .replace('IN', '')
    .replace('OUT', '')
    .replace('[Bike]', '')
    .replace('[Velos]', '')
    .replace('porte', 'Porte')
    .replace('Vélos', '')
    .replace("'", '’')
    .replace('D’', 'd’')
    .replace(/  /g, ' ')
    .replace(/#./, '')
    .trim();

  return dedup(fixed);
};

export const prepareStats = (
  counts: { [id: string]: CounterSummary },
  metadata: { [id: string]: CounterMetadata }
): CounterStat[] =>
  _(counts)
    .map(transform(metadata))
    .groupBy('strippedLabel')
    .map(merge)
    .sortBy('yesterday')
    .reverse()
    .toArray()
    .value();
