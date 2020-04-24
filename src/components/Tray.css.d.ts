declare namespace TrayCssModule {
  export interface ITrayCss {
    board: string;
    container: string;
    display: string;
    hud: string;
    slot: string;
  }
}

declare const TrayCssModule: TrayCssModule.ITrayCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: TrayCssModule.ITrayCss;
};

export = TrayCssModule;
