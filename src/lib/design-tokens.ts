// Design tokens for HealthyME application
export const designTokens = {
  // Color system
  colors: {
    // Primary brand colors
    primary: {
      50: 'hsl(142, 76%, 96%)',
      100: 'hsl(142, 76%, 86%)',
      200: 'hsl(142, 76%, 76%)',
      300: 'hsl(142, 76%, 66%)',
      400: 'hsl(142, 76%, 56%)',
      500: 'hsl(142, 76%, 46%)',
      600: 'hsl(142, 76%, 36%)', // Main primary
      700: 'hsl(142, 76%, 26%)',
      800: 'hsl(142, 76%, 16%)',
      900: 'hsl(142, 76%, 6%)',
    },
    
    // Health-specific colors
    health: {
      green: 'hsl(142, 76%, 36%)',
      greenLight: 'hsl(142, 76%, 56%)',
      orange: 'hsl(25, 95%, 53%)',
      blue: 'hsl(221, 83%, 53%)',
      red: 'hsl(0, 84%, 60%)',
      yellow: 'hsl(48, 96%, 53%)',
    },
    
    // Nutrition-specific colors
    nutrition: {
      protein: 'hsl(220, 70%, 50%)',
      carbs: 'hsl(25, 95%, 53%)',
      fat: 'hsl(48, 96%, 53%)',
      fiber: 'hsl(142, 76%, 36%)',
      sugar: 'hsl(0, 84%, 60%)',
      sodium: 'hsl(280, 65%, 60%)',
    },
    
    // Semantic colors for myth-busting
    mythBusting: {
      true: 'hsl(142, 76%, 36%)',
      false: 'hsl(0, 84%, 60%)',
      partial: 'hsl(48, 96%, 53%)',
    },
    
    // Status colors
    status: {
      success: 'hsl(142, 76%, 36%)',
      warning: 'hsl(48, 96%, 53%)',
      error: 'hsl(0, 84%, 60%)',
      info: 'hsl(221, 83%, 53%)',
    },
  },
  
  // Typography scale
  typography: {
    fontSizes: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem', // 36px
      '5xl': '3rem',    // 48px
      '6xl': '4rem',    // 64px
    },
    
    fontWeights: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
    
    lineHeights: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
    
    letterSpacing: {
      tight: '-0.025em',
      normal: '0',
      wide: '0.025em',
    },
  },
  
  // Spacing scale
  spacing: {
    px: '1px',
    0: '0',
    0.5: '0.125rem',  // 2px
    1: '0.25rem',     // 4px
    1.5: '0.375rem',  // 6px
    2: '0.5rem',      // 8px
    2.5: '0.625rem',  // 10px
    3: '0.75rem',     // 12px
    3.5: '0.875rem',  // 14px
    4: '1rem',        // 16px
    5: '1.25rem',     // 20px
    6: '1.5rem',      // 24px
    7: '1.75rem',     // 28px
    8: '2rem',        // 32px
    9: '2.25rem',     // 36px
    10: '2.5rem',     // 40px
    11: '2.75rem',    // 44px
    12: '3rem',       // 48px
    14: '3.5rem',     // 56px
    16: '4rem',       // 64px
    20: '5rem',       // 80px
    24: '6rem',       // 96px
    28: '7rem',       // 112px
    32: '8rem',       // 128px
    36: '9rem',       // 144px
    40: '10rem',      // 160px
    44: '11rem',      // 176px
    48: '12rem',      // 192px
    52: '13rem',      // 208px
    56: '14rem',      // 224px
    60: '15rem',      // 240px
    64: '16rem',      // 256px
    72: '18rem',      // 288px
    80: '20rem',      // 320px
    96: '24rem',      // 384px
  },
  
  // Border radius
  borderRadius: {
    none: '0',
    sm: '0.125rem',   // 2px
    DEFAULT: '0.25rem', // 4px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '0.75rem',    // 12px
    '2xl': '1rem',    // 16px
    '3xl': '1.5rem',  // 24px
    full: '9999px',
  },
  
  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  },
  
  // Breakpoints
  breakpoints: {
    xs: '475px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  
  // Z-index scale
  zIndex: {
    auto: 'auto',
    0: 0,
    10: 10,
    20: 20,
    30: 30,
    40: 40,
    50: 50,
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modal: 1040,
    popover: 1050,
    tooltip: 1060,
  },
  
  // Animations
  animations: {
    durations: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
    },
    
    easings: {
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },
  
  // Component variants
  variants: {
    // Button variants
    button: {
      sizes: {
        sm: {
          height: '2rem',
          padding: '0 0.75rem',
          fontSize: '0.875rem',
        },
        md: {
          height: '2.5rem',
          padding: '0 1rem',
          fontSize: '1rem',
        },
        lg: {
          height: '3rem',
          padding: '0 1.5rem',
          fontSize: '1.125rem',
        },
      },
      
      variants: {
        primary: {
          backgroundColor: 'hsl(var(--primary))',
          color: 'hsl(var(--primary-foreground))',
          borderColor: 'hsl(var(--primary))',
        },
        secondary: {
          backgroundColor: 'hsl(var(--secondary))',
          color: 'hsl(var(--secondary-foreground))',
          borderColor: 'hsl(var(--secondary))',
        },
        outline: {
          backgroundColor: 'transparent',
          color: 'hsl(var(--foreground))',
          borderColor: 'hsl(var(--border))',
        },
        ghost: {
          backgroundColor: 'transparent',
          color: 'hsl(var(--foreground))',
          borderColor: 'transparent',
        },
      },
    },
    
    // Card variants
    card: {
      variants: {
        default: {
          backgroundColor: 'hsl(var(--card))',
          borderColor: 'hsl(var(--border))',
          color: 'hsl(var(--card-foreground))',
        },
        nutrition: {
          backgroundColor: 'hsl(var(--card))',
          borderColor: 'hsl(var(--primary))',
          color: 'hsl(var(--card-foreground))',
        },
        myth: {
          backgroundColor: 'hsl(var(--card))',
          borderColor: 'hsl(221, 83%, 53%)',
          color: 'hsl(var(--card-foreground))',
        },
      },
    },
  },
} as const

// Type definitions for design tokens
export type DesignTokens = typeof designTokens
export type ColorTokens = typeof designTokens.colors
export type TypographyTokens = typeof designTokens.typography
export type SpacingTokens = typeof designTokens.spacing

// Utility functions for accessing design tokens
export const getColor = (path: string) => {
  const keys = path.split('.')
  let value: any = designTokens.colors
  
  for (const key of keys) {
    value = value[key]
    if (value === undefined) break
  }
  
  return value
}

export const getSpacing = (key: keyof SpacingTokens['spacing']) => {
  return designTokens.spacing[key]
}

export const getTypography = (category: keyof TypographyTokens, key: string) => {
  return designTokens.typography[category][key as keyof typeof designTokens.typography[typeof category]]
}

export default designTokens


