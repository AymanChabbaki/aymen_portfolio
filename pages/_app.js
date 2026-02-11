import { calibre, jetbrains_mono } from "public/fonts";
import { GoogleAnalytics } from "@next/third-parties/google";
import Meta from "@/components/Meta/Meta";
import AnalyticsTracker from "@/components/AnalyticsTracker/AnalyticsTracker";
import SoundEffects from "@/components/SoundEffects/SoundEffects";
import ScrollingChatbot from "@/components/ScrollingChatbot/ScrollingChatbot";
import ScrollToTop from "@/components/ScrollToTop/ScrollToTop";
import usePortfolioAnalytics from "../hooks/usePortfolioAnalytics";
import "../styles/globals.scss";
import { Analytics } from "@vercel/analytics/next"
import { GTAG } from "constants";
import { LanguageProvider } from "../contexts/LanguageContext";
import { useKonamiCode } from "../hooks/useKonamiCode";
import { useConfetti } from "../hooks/useConfetti";
import { useState } from "react";
import { useRouter } from "next/router";

const App = ({ Component, pageProps }) => {
  const { fireRocket } = useConfetti();
  const [konamiActive, setKonamiActive] = useState(false);
  const { trackEvent } = usePortfolioAnalytics(); // New comprehensive analytics
  const router = useRouter();
  const isHiddenPage = router.pathname === '/hidden';

  useKonamiCode(() => {
    console.log("🎮 Konami Code Activated! 🎮");
    setKonamiActive(true);
    fireRocket();
    
    // Rainbow animation
    document.body.style.animation = "rainbow 2s linear infinite";
    
    setTimeout(() => {
      document.body.style.animation = "";
      setKonamiActive(false);
    }, 5000);
  });

  return (
    <LanguageProvider>
      <Meta />
      <main
        className={`${calibre.variable} font-sans ${jetbrains_mono.variable} font-mono`}
        style={{
          filter: konamiActive ? "hue-rotate(360deg)" : "none",
          transition: konamiActive ? "filter 2s linear" : "none",
        }}
      >
        <Component {...pageProps} />
        <AnalyticsTracker />
        <SoundEffects />
        {!isHiddenPage && (
          <>
            <ScrollingChatbot />
            <ScrollToTop />
          </>
        )}
        <GoogleAnalytics gaId={GTAG} />
        <Analytics />
        
        {konamiActive && (
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontSize: "3rem",
              fontWeight: "bold",
              color: "#fff",
              textShadow: "0 0 20px rgba(102, 126, 234, 0.8)",
              zIndex: 99999,
              animation: "bounce 0.5s ease infinite alternate",
            }}
          >
            🎮 KONAMI CODE! 🎮
          </div>
        )}
      </main>
    </LanguageProvider>
  );
};

export default App;
