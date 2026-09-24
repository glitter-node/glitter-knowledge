export type ColorSchemeMode = 'auto' | 'light' | 'dark';
export type ResolvedColorScheme = 'light' | 'dark';

const STORAGE_KEY = 'g7_color_scheme';
const DARK_MEDIA_QUERY = '(prefers-color-scheme: dark)';
const validModes: ColorSchemeMode[] = ['auto', 'light', 'dark'];

export const readColorScheme = (): ColorSchemeMode => {
  if (typeof window === 'undefined') return 'auto';
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved && validModes.includes(saved as ColorSchemeMode) ? saved as ColorSchemeMode : 'auto';
  } catch {
    return 'auto';
  }
};

export const resolveColorScheme = (mode: ColorSchemeMode): ResolvedColorScheme => mode === 'auto'
  ? (window.matchMedia(DARK_MEDIA_QUERY).matches ? 'dark' : 'light')
  : mode;

export const applyColorScheme = (mode: ColorSchemeMode): void => {
  if (typeof document === 'undefined') return;
  const effective = resolveColorScheme(mode);
  document.documentElement.dataset.theme = effective;
  document.documentElement.classList.toggle('dark', effective === 'dark');
};

export const setColorScheme = (mode: ColorSchemeMode): void => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, mode);
  applyColorScheme(mode);
};

export const initializeColorScheme = (): void => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  const mediaQuery = window.matchMedia(DARK_MEDIA_QUERY);
  const sync = () => applyColorScheme(readColorScheme());
  const onMediaChange = () => { if (readColorScheme() === 'auto') sync(); };
  const onStorage = (event: StorageEvent) => { if (event.key === STORAGE_KEY) sync(); };
  sync();
  mediaQuery.addEventListener('change', onMediaChange);
  window.addEventListener('storage', onStorage);
};

export const getResolvedColorScheme = (): ResolvedColorScheme => resolveColorScheme(readColorScheme());
