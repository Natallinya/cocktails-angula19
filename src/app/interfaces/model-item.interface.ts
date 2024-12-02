import { State } from '../enums';

export interface IModelItem<T> {
  item?: T;
  state: State;
}
