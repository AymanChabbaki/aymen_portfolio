import { calibre, jetbrains_mono } from "public/fonts";
import { GoogleAnalytics } from "@next/third-parties/google";
import Meta from "@/components/Meta/Meta";
import AnalyticsTracker from "@/components/AnalyticsTracker/AnalyticsTracker";
import "../styles/globals.scss";
import { GTAG } from "constants";
import { LanguageProvider } from "../contexts/LanguageContext";

const App = ({ Component, pageProps }) => {
  return (
    <LanguageProvider>
      <Meta />
      <main
        className={`${calibre.variable} font-sans ${jetbrains_mono.variable} font-mono`}
      >
        <Component {...pageProps} />
        <AnalyticsTracker />
        <GoogleAnalytics gaId={GTAG} />
      </main>
    </LanguageProvider>
  );
};

export default App;
