import React, { useCallback, useEffect, useState } from 'react';
import { AboutSection } from './components/AboutSection';
import { CaseStudySection } from './components/CaseStudySection';
import { ContactSection } from './components/ContactSection';
import { CustomCursor } from './components/CustomCursor';
import { Header, NavGroup } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { IntroOverlay, shouldShowPortfolioIntro } from './components/IntroOverlay';
import { LightboxDialog, LightboxState } from './components/LightboxDialog';
import { ProjectExplorerDialog } from './components/ProjectExplorerDialog';
import { StatementSection } from './components/StatementSection';
import { WorkIndexSection } from './components/WorkIndexSection';
import { PROJECTS } from './data/portfolioData';
import { useBackgroundMusic } from './hooks/useBackgroundMusic';
import { prefersReducedMotion, useScrollReveal } from './hooks/useInteractiveEnhancements';

export default function App() {
  const [userSelectedTheme, setUserSelectedTheme] = useState<'light' | 'dark' | null>(null);
  const [systemDark, setSystemDark] = useState<boolean>(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
      : false
  );
  const [introActive, setIntroActive] = useState<boolean>(() => shouldShowPortfolioIntro());
  const [scrolled, setScrolled] = useState(false);
  const [activeNav, setActiveNav] = useState<NavGroup>(null);
  const [explorerProjectIndex, setExplorerProjectIndex] = useState<number | null>(null);
  const [lightbox, setLightbox] = useState<LightboxState | null>(null);

  const music = useBackgroundMusic();
  const night = userSelectedTheme ? userSelectedTheme === 'dark' : systemDark;

  useScrollReveal();

  const handleIntroComplete = useCallback(() => {
    setIntroActive(false);
  }, []);

  // Coordinate body scroll lock across Intro, Explorer, and Lightbox overlays
  useEffect(() => {
    const locked = introActive || explorerProjectIndex !== null || lightbox !== null;
    document.body.style.overflow = locked ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [introActive, explorerProjectIndex, lightbox]);

  // Listen to OS color scheme changes when user hasn't manually overridden
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (e: MediaQueryListEvent) => {
      setSystemDark(e.matches);
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Sync theme attributes and meta[name="theme-color"]
  useEffect(() => {
    const root = document.documentElement;
    if (userSelectedTheme) {
      root.setAttribute('data-theme', userSelectedTheme);
    } else {
      root.removeAttribute('data-theme');
    }
    root.setAttribute('data-night', night ? '1' : '0');

    const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (meta) {
      meta.content = night ? '#1E3127' : '#F1EBDD';
    }
  }, [night, userSelectedTheme]);

  // Header scroll veil
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Active nav highlighting via IntersectionObserver
  useEffect(() => {
    const ids = ['home', 'work', 'about', 'contact', ...PROJECTS.map((p) => p.id)];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.id;
          const group: NavGroup =
            id === 'about' || id === 'contact' ? id : id === 'home' ? null : 'work';
          setActiveNav(group);
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });

    return () => io.disconnect();
  }, []);

  const handleNavigate = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
      const target = document.getElementById(targetId);
      if (!target) return;
      e.preventDefault();

      const reduced = prefersReducedMotion();
      target.scrollIntoView({
        behavior: reduced ? 'auto' : 'smooth',
        block: 'start',
      });

      if (window.history && typeof window.history.replaceState === 'function') {
        window.history.replaceState(null, '', `#${targetId}`);
      }

      if (!reduced) {
        const inner = target.querySelector<HTMLElement>('.wrap') || target;
        inner.classList.remove('section-arriving');
        void inner.offsetWidth;
        inner.classList.add('section-arriving');
        window.setTimeout(() => {
          inner.classList.remove('section-arriving');
        }, 650);
      }
    },
    []
  );

  const handleToggleTheme = useCallback(() => {
    setUserSelectedTheme(night ? 'light' : 'dark');
  }, [night]);

  const handleExploreProject = useCallback((projectIndex: number) => {
    setExplorerProjectIndex(projectIndex);
  }, []);

  const handleCloseExplorer = useCallback(() => {
    setExplorerProjectIndex(null);
  }, []);

  const handleOpenLightbox = useCallback((projectIndex: number, sheetIndex: number) => {
    setLightbox({ projectIndex, itemIndex: sheetIndex + 1 });
  }, []);

  const handleCloseLightbox = useCallback(() => {
    setLightbox(null);
  }, []);

  const handleChangeLightboxIndex = useCallback((nextItemIndex: number) => {
    setLightbox((prev) => (prev ? { ...prev, itemIndex: nextItemIndex } : null));
  }, []);

  return (
    <>
      <CustomCursor />

      {introActive && <IntroOverlay onComplete={handleIntroComplete} />}

      <a className="skip" href="#work">
        Skip to work
      </a>

      <Header
        scrolled={scrolled}
        activeNav={activeNav}
        night={night}
        musicEnabled={music.enabled}
        musicPlaying={music.isPlaying}
        onToggleTheme={handleToggleTheme}
        onToggleMusic={music.toggle}
        onNavigate={handleNavigate}
      />

      <main>
        <HeroSection
          night={night}
          introActive={introActive}
          onNavigate={handleNavigate}
        />
        <StatementSection />
        <WorkIndexSection onNavigate={handleNavigate} />
        <CaseStudySection
          onOpenLightbox={handleOpenLightbox}
          onExploreProject={handleExploreProject}
        />
        <AboutSection />
        <ContactSection onNavigate={handleNavigate} />
      </main>

      <ProjectExplorerDialog
        projectIndex={explorerProjectIndex}
        isLightboxOpen={lightbox !== null}
        musicEnabled={music.enabled}
        musicPlaying={music.isPlaying}
        onToggleMusic={music.toggle}
        onClose={handleCloseExplorer}
        onOpenLightbox={handleOpenLightbox}
      />

      <LightboxDialog
        state={lightbox}
        onClose={handleCloseLightbox}
        onChangeIndex={handleChangeLightboxIndex}
      />
    </>
  );
}
