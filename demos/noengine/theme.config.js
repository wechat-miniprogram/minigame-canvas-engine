// Demo-level theme switch (Phase 1 placeholder)
// Keep `false` by default for zero-risk rollout.
export const ENABLE_LOBSTER_THEME = false;

export const activeTheme = ENABLE_LOBSTER_THEME ? 'lobster' : 'classic';

export const palette = activeTheme === 'lobster'
  ? {
      pageBg: '#071b2b',
      primary: '#e4472f',
      textOnPrimary: '#fff6eb',
    }
  : {
      pageBg: '#f3f3f3',
      primary: '#34a123',
      textOnPrimary: '#ffffff',
    };
