/** Auth redirect paths */
export const AUTH_REDIRECTS = {
  AFTER_LOGIN: '/dashboard',
  AFTER_SIGNUP: '/dashboard',
  AFTER_LOGOUT: '/login',
  UNAUTHENTICATED: '/login',
} as const;

/** Supported auth providers */
export const AUTH_PROVIDERS = ['github', 'google', 'email'] as const;

/** Public routes that don't require authentication */
export const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/signup',
  '/forgot-password',
  '/reset-password',
  '/privacy',
  '/terms',
  '/share',
] as const;
