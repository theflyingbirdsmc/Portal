import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { consolePlugin, ConsolePage } from '../src/plugin';

createDevApp()
  .registerPlugin(consolePlugin)
  .addPage({
    element: <ConsolePage />,
    title: 'Root Page',
    path: '/console'
  })
  .render();
