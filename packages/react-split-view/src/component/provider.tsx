import React from 'react';
import { IContext } from '../interface';

export const Context = React.createContext<IContext>({
  panels: [],
  panelMap: {},
  contentMap: {},
});
