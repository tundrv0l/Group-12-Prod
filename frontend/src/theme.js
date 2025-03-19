import { grommet } from 'grommet';
import { deepMerge } from 'grommet/utils';

const customTheme = deepMerge(grommet, {
  global: {
    focus: {
      border: {
        color: 'transparent'
      },
      outline: {
        color: 'transparent',
        size: '0px'
      },
      shadow: {
        color: 'transparent',
        size: '0px'
      }
    },
    // Make sure backgrounds are transparent by default
    colors: {
      background: 'transparent',
      'background-back': 'transparent',
      'background-front': 'transparent',
      'background-contrast': 'transparent',
    }
  },
  accordion: {
    border: {
      color: 'transparent'
    },
    hover: {
      heading: {
        color: 'brand'
      }
    },
    panel: {
      focus: {
        outline: "none",
        border: { color: "transparent" }
      }
    }
  },
  button: {
    border: {
      radius: '4px'
    },
    default: {
      color: 'text',
    },
    hover: {
      background: { color: 'light-2' },
    },
    focus: {
      outline: { color: 'transparent', size: '0px' },
      shadow: { color: 'transparent', size: '0px' }
    }
  },
  // Make sure Page component doesn't block the background
  page: {
    background: 'transparent'
  }
});

export default customTheme;