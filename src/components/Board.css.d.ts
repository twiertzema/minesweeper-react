declare namespace BoardCssModule {
  export interface IBoardCss {
    board: string;
  }
}

declare const BoardCssModule: BoardCssModule.IBoardCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: BoardCssModule.IBoardCss;
};

export = BoardCssModule;
