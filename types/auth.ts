/** Supported OAuth providers */
export type OAuthProvider = 'github' | 'google';

/** Application page states (used for non-routed state machines) */
export enum AppState {
  LANDING = 'LANDING',
  INPUT = 'INPUT',
  ANALYZING = 'ANALYZING',
  RESULTS = 'RESULTS',
  ERROR = 'ERROR'
}
