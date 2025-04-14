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
      radius: '4px',
      // No color by default, individual buttons can specify color
      width: '1px'
    },
    default: {
      color: 'text',
      // Add padding to maintain consistent sizing even without borders
      padding: {
        horizontal: 'medium',
        vertical: 'small'
      }
    },
    primary: {
      // Let primary buttons display their borders when specified
      border: {
        color: 'brand',
        width: undefined
      }
    },
    hover: {
      background: { color: 'light-2' },
      // Add subtle border on hover for better UX
      border: { color: 'light-4' }
    },
    focus: {
      outline: { color: 'transparent', size: '0px' },
      shadow: { color: 'transparent', size: '0px' }
    },
    // Custom variant for buttons with borders
    bordered: {
      border: {
        color: 'brand',
        width: '1px'
      }
    }
  },
  // Make sure Page component doesn't block the background
  page: {
    background: 'transparent'
  }
});

export default customTheme;