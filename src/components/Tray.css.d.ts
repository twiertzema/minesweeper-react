declare namespace TrayCssModule {
  export interface ITrayCss {
    board: string;
    container: string;
    cool: string;
    dead: string;
    display: string;
    hud: string;
    scared: string;
    slot: string;
    smileyButton: string;
    smileyImage: string;
  }
}

declare const TrayCssModule: TrayCssModule.ITrayCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: TrayCssModule.ITrayCss;
};

export = TrayCssModule;
