declare namespace CellCssModule {
  export interface ICellCss {
    boom: string;
    cell: string;
    eight: string;
    five: string;
    flagged: string;
    four: string;
    one: string;
    revealed: string;
    seven: string;
    six: string;
    three: string;
    two: string;
  }
}

declare const CellCssModule: CellCssModule.ICellCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: CellCssModule.ICellCss;
};

export = CellCssModule;
