import type { Preview } from '@storybook/react';
import React from 'react';

// Global styles
import '@excalidraw/excalidraw/index.css';
import '../src/components/canvas/excalidraw-custom.css';
import '../src/styles/index.css';

// Provide any global decorators if needed (e.g., themes, routers)
const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  decorators: [(Story) => <Story />],
};

export default preview;
