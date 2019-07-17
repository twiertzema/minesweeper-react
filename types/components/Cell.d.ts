import React from "react";
import { CELL_STATE } from "../lib/constants";
import "./Cell.css";
declare type ClickHandler = (x: number, y: number) => void;
interface RenderPropProps {
    handleClick: React.MouseEventHandler;
    handleRightClick: React.MouseEventHandler;
    hasMine: boolean;
    mineCount: number;
    state: CELL_STATE;
}
declare type RenderProp = (props: RenderPropProps) => React.ReactNode;
interface CellProps {
    children: RenderProp;
    hasMine?: boolean;
    mineCount?: number;
    onClick?: ClickHandler;
    onRightClick?: ClickHandler;
    state?: CELL_STATE;
    x: number;
    y: number;
}
export declare class Cell extends React.Component<CellProps> {
    handleClick: (evt: React.MouseEvent<Element, MouseEvent>) => void;
    handleRightClick: (evt: React.MouseEvent<Element, MouseEvent>) => boolean;
    render(): React.ReactNode;
}
interface XPCellProps {
    className?: string;
    hasMine?: boolean;
    mineCount?: number;
    onClick?: ClickHandler;
    onRightClick?: ClickHandler;
    state?: CELL_STATE;
    x?: number;
    y?: number;
    [propName: string]: any;
}
export declare const XPCell: (props: XPCellProps) => JSX.Element;
export default XPCell;
