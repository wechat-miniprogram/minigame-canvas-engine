import { IStyle } from "./style";
import { IDataset } from "../types";

export interface IElementOptions {
  style?: IStyle;
  idName?: string;
  className?: string;
  id?: number;
  dataset?: IDataset;
}