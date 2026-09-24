import React from 'react';
import { useEffect, useId, useRef, useState } from 'react';
import { Img } from '../basic/Img';
import { ColorSchemeMode, getResolvedColorScheme, readColorScheme, setColorScheme } from '../../colorScheme';

function element<T extends keyof React.JSX.IntrinsicElements>(tag: T) {
  return React.forwardRef<HTMLElement, React.ComponentPropsWithoutRef<T>>(({ className = '', children, ...props }, ref) =>
    React.createElement(tag, { ...props, ref, className }, children));
}

const A = element('a');
const Button = element('button');
const Div = element('div');
const Header = element('header');
const Nav = element('nav');
const Span = element('span');

export interface KnowledgeNavItem {
  label: string;
  href: string;
}

export interface KnowledgeHeaderProps {
  brandName?: string;
  navItems?: KnowledgeNavItem[];
  loginLabel?: string;
  registerLabel?: string;
  accountLabel?: string;
  logoutLabel?: string;
  adminLabel?: string;
  languageLabel?: string;
  languageOptionsLabel?: Record<string, string>;
  themeLabel?: string;
  themeSystemLabel?: string;
  themeLightLabel?: string;
  themeDarkLabel?: string;
  navigationLabel?: string;
  nickname?: string | null;
  name?: string | null;
  avatar?: string | null;
  isAdmin?: boolean;
  authenticated?: boolean;
  onLogout?: () => void;
  className?: string;
  editorAttrs?: Record<string, unknown>;
  id?: string;
}

const currentPath = () => typeof window === 'undefined' ? '/' : window.location.pathname.replace(/\/$/, '') || '/';

export function KnowledgeHeader({
  brandName = '', navItems = [], loginLabel = '', registerLabel = '', accountLabel = '', logoutLabel = '', adminLabel = '', languageLabel = '', languageOptionsLabel = {},
  themeLabel = '', themeSystemLabel = '', themeLightLabel = '', themeDarkLabel = '',
  navigationLabel = '',
  nickname, name, avatar, isAdmin = false, authenticated = false, onLogout, className = '', editorAttrs, id,
}: KnowledgeHeaderProps) {
  const [accountOpen, setAccountOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [themeMode, setThemeMode] = useState<ColorSchemeMode>(readColorScheme);
  const [resolvedTheme, setResolvedTheme] = useState(getResolvedColorScheme);
  const [path, setPath] = useState(currentPath);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const themeTriggerRef = useRef<HTMLButtonElement>(null);
  const mobileTriggerRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();
  const identity = nickname?.trim() || name?.trim() || accountLabel;
  const initials = (identity || '?').trim().slice(0, 1).toUpperCase();
  const locales = Object.keys(languageOptionsLabel);
  const currentLocale = (window as any).G7Core?.locale?.current?.() || 'ko';

  useEffect(() => {
    const sync = () => { setPath(currentPath()); setAccountOpen(false); setLanguageOpen(false); setThemeOpen(false); setMobileOpen(false); };
    window.addEventListener('popstate', sync);
    return () => window.removeEventListener('popstate', sync);
  }, []);

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (!(event.target instanceof Element) || (!event.target.closest('.gk-account-menu-wrapper') && !event.target.closest('.gk-theme-menu-wrapper') && !event.target.closest('.gk-mobile-menu-wrapper'))) {
        setAccountOpen(false);
        setLanguageOpen(false);
        setThemeOpen(false);
        setMobileOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      if (mobileOpen) {
        setMobileOpen(false);
        mobileTriggerRef.current?.focus();
      } else if (themeOpen) {
        setThemeOpen(false);
        themeTriggerRef.current?.focus();
      } else if (accountOpen) {
        setAccountOpen(false);
        setLanguageOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [accountOpen, mobileOpen, themeOpen]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const sync = () => setResolvedTheme(getResolvedColorScheme());
    const onStorage = (event: StorageEvent) => { if (event.key === 'g7_color_scheme') { setThemeMode(readColorScheme()); sync(); } };
    mediaQuery.addEventListener('change', sync);
    window.addEventListener('storage', onStorage);
    return () => {
      mediaQuery.removeEventListener('change', sync);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  const closeMenu = () => {
    setAccountOpen(false);
    setLanguageOpen(false);
  };

  const closeMobileMenu = () => setMobileOpen(false);

  const selectTheme = (mode: ColorSchemeMode, closeMobile = false) => {
    setThemeMode(mode);
    setColorScheme(mode);
    setResolvedTheme(getResolvedColorScheme());
    setThemeOpen(false);
    if (closeMobile) setMobileOpen(false);
  };

  const themeOptions: Array<{ mode: ColorSchemeMode; label: string }> = [
    { mode: 'auto', label: themeSystemLabel },
    { mode: 'light', label: themeLightLabel },
    { mode: 'dark', label: themeDarkLabel },
  ];

  const changeLocale = async (locale: string) => {
    closeMenu();
    await (window as any).G7Core?.locale?.change?.(locale);
  };

  const renderThemeOptions = (closeMobile = false) => themeOptions.map(option => <Button key={option.mode} type="button" className={`gk-theme-menu-item ${themeMode === option.mode ? 'is-current' : ''}`} role="menuitemradio" aria-checked={themeMode === option.mode} onClick={() => selectTheme(option.mode, closeMobile)}>
    <Span>{option.label}</Span><Span className="gk-theme-check" aria-hidden="true">{themeMode === option.mode ? '✓' : ''}</Span>
  </Button>);

  return <Header id={id} className={`gk-header ${className}`} {...editorAttrs}>
    <Div className="gk-container gk-header-inner">
      <A href="/knowledge" className="gk-brand" aria-label={brandName}>
        <Span className="gk-brand-name">{brandName}</Span>
      </A>
      <Div className="gk-header-actions">
        <Nav aria-label={brandName} className="gk-nav">
          {navItems.map(item => <A key={item.href} href={item.href} className="gk-nav-link" aria-current={path === item.href ? 'page' : undefined}>{item.label}</A>)}
        </Nav>
        <Div className="gk-theme-menu-wrapper">
          <Button ref={themeTriggerRef} type="button" className="gk-theme-trigger" aria-label={themeLabel} aria-haspopup="menu" aria-expanded={themeOpen} aria-controls={`${menuId}-theme`} onClick={() => { setThemeOpen(value => !value); setAccountOpen(false); setLanguageOpen(false); }}>
            <Span className={`gk-theme-icon gk-theme-icon-${resolvedTheme}`} aria-hidden="true" />
            <Span className="gk-theme-current">{themeMode === 'auto' ? themeSystemLabel : themeMode === 'light' ? themeLightLabel : themeDarkLabel}</Span>
          </Button>
          {themeOpen && <Div id={`${menuId}-theme`} className="gk-theme-menu" role="menu" aria-label={themeLabel}>
            {renderThemeOptions()}
          </Div>}
        </Div>
        {authenticated ? <Div className="gk-account-menu-wrapper">
          <Button
            ref={triggerRef}
            type="button"
            className="gk-account-trigger"
            aria-haspopup="menu"
            aria-expanded={accountOpen}
            aria-controls={menuId}
            onClick={() => { setAccountOpen(value => !value); setLanguageOpen(false); setThemeOpen(false); }}
          >
            {avatar ? <Img src={avatar} alt="" className="gk-account-avatar" /> : <Span className="gk-account-avatar gk-account-avatar-fallback" aria-hidden="true">{initials}</Span>}
            <Span className="gk-account-identity">{identity}</Span>
            <Span className="gk-account-chevron" aria-hidden="true">⌄</Span>
          </Button>
          {accountOpen && <Div id={menuId} className="gk-account-menu" role="menu" aria-label={identity}>
            {isAdmin && <A href="/admin" className="gk-account-menu-link" role="menuitem" onClick={closeMenu}>{adminLabel}</A>}
            <A href="/account" className="gk-account-menu-link" role="menuitem" onClick={closeMenu}>{accountLabel}</A>
            {locales.length > 0 && <Div className="gk-account-language">
              <Button type="button" className="gk-account-menu-link gk-account-language-trigger" role="menuitem" aria-expanded={languageOpen} onClick={() => setLanguageOpen(value => !value)}>
                <Span>{languageLabel}</Span><Span aria-hidden="true">{languageOpen ? '⌃' : '⌄'}</Span>
              </Button>
              {languageOpen && <Div className="gk-account-language-options" role="group" aria-label={languageLabel}>
                {locales.map(locale => <Button key={locale} type="button" className={`gk-account-menu-link gk-account-language-option ${currentLocale === locale ? 'is-current' : ''}`} role="menuitemradio" aria-checked={currentLocale === locale} onClick={() => changeLocale(locale)}>{languageOptionsLabel[locale]}</Button>)}
              </Div>}
            </Div>}
            <Button type="button" className="gk-account-menu-link gk-account-menu-action" role="menuitem" onClick={() => { closeMenu(); onLogout?.(); }}>{logoutLabel}</Button>
          </Div>}
          </Div> : <Div className="gk-auth-links">
          <A href="/login" className="gk-nav-link">{loginLabel}</A>
          <A href="/register" className="gk-auth-register">{registerLabel}</A>
        </Div>}
      </Div>
      <Div className="gk-mobile-menu-wrapper">
        <Button ref={mobileTriggerRef} type="button" className="gk-mobile-trigger" aria-label={navigationLabel || brandName} aria-expanded={mobileOpen} aria-controls={`${menuId}-mobile`} onClick={() => { setMobileOpen(value => !value); setThemeOpen(false); setAccountOpen(false); setLanguageOpen(false); }}>
          <Span className="gk-mobile-trigger-icon" aria-hidden="true"><Span /><Span /><Span /></Span>
        </Button>
        {mobileOpen && <Div id={`${menuId}-mobile`} className="gk-mobile-menu" aria-label={navigationLabel || brandName}>
          <Nav className="gk-mobile-nav" aria-label={navigationLabel || brandName}>
            {navItems.map(item => <A key={item.href} href={item.href} className="gk-mobile-menu-link" aria-current={path === item.href ? 'page' : undefined} onClick={closeMobileMenu}>{item.label}</A>)}
          </Nav>
          <Div className="gk-mobile-section" aria-labelledby={`${menuId}-theme-label`}>
            <Span id={`${menuId}-theme-label`} className="gk-mobile-section-label">{themeLabel}</Span>
            <Div className="gk-mobile-theme-options" role="menu" aria-label={themeLabel}>{renderThemeOptions(true)}</Div>
          </Div>
          {authenticated ? <Div className="gk-mobile-section gk-mobile-account-section" aria-labelledby={`${menuId}-account-label`}>
            <Span id={`${menuId}-account-label`} className="gk-mobile-identity">{identity}</Span>
            {isAdmin && <A href="/admin" className="gk-mobile-menu-link" onClick={closeMobileMenu}>{adminLabel}</A>}
            <A href="/account" className="gk-mobile-menu-link" onClick={closeMobileMenu}>{accountLabel}</A>
            {locales.length > 0 && <Div className="gk-mobile-language" aria-labelledby={`${menuId}-language-label`}>
              <Span id={`${menuId}-language-label`} className="gk-mobile-section-label">{languageLabel}</Span>
              {locales.map(locale => <Button key={locale} type="button" className={`gk-mobile-menu-link gk-mobile-language-option ${currentLocale === locale ? 'is-current' : ''}`} aria-pressed={currentLocale === locale} onClick={() => changeLocale(locale)}>{languageOptionsLabel[locale]}</Button>)}
            </Div>}
            <Button type="button" className="gk-mobile-menu-link gk-mobile-menu-action" onClick={() => { closeMobileMenu(); onLogout?.(); }}>{logoutLabel}</Button>
          </Div> : <Div className="gk-mobile-section gk-mobile-auth-links">
            <A href="/login" className="gk-mobile-menu-link" onClick={closeMobileMenu}>{loginLabel}</A>
            <A href="/register" className="gk-mobile-menu-link gk-mobile-register" onClick={closeMobileMenu}>{registerLabel}</A>
          </Div>}
        </Div>}
      </Div>
    </Div>
  </Header>;
}

KnowledgeHeader.displayName = 'KnowledgeHeader';
