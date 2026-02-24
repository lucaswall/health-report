// Chart configuration types

export interface ChartImage {
  base64: string; // data:image/png;base64,...
  width: number;
  height: number;
}

export interface SectionCharts {
  [key: string]: ChartImage;
}

export interface AllCharts {
  activity: SectionCharts;
  exercise: SectionCharts;
  heart: SectionCharts;
  sleep: SectionCharts;
  body: SectionCharts;
  vitals: SectionCharts;
  cardio: SectionCharts;
  nutrition: SectionCharts;
  fasting: SectionCharts;
  water: SectionCharts;
}
