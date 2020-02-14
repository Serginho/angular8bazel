export enum Breakpoint {
  EXTRA_SMALL = 0,
  SMALL = 576,
  MEDIUM = 768,
  LARGE = 992,
  EXTRA_LARGE = 1200,
}

export interface ScreenSize {
  x: number;
  y: number;
  size: Breakpoint;
  breakpoint: string;
}
