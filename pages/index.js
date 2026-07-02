import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import Loader from "@/components/Loader/Loader";
import Welcome from "@/components/Welcome/Welcome";
import Header from "@/components/Header/Header";
import Menu from "@/components/Header/Menu/Menu";
import ProgressIndicator from "@/components/ProgressIndicator/ProgressIndicator";
import Cursor from "@/components/Cursor/Cursor";
import VerticalEmail from "@/components/VerticalEmail/VerticalEmail";
import AmbientBackground from "@/components/AmbientBackground/AmbientBackground";
import CommandPalette from "@/components/CommandPalette/CommandPalette";
import Hero from "@/components/Hero/Hero";
import NowStrip from "@/components/NowStrip/NowStrip";
import About1 from "@/components/About/About1";
import Skills from "@/components/Skills/Skills";
import Bento from "@/components/Bento/Bento";
import About2 from "@/components/About/About2";
import Projects from "@/components/Projects/Projects";
import Work from "@/components/Work/Work";
import Testimonials from "@/components/Testimonials/Testimonials";
import Collaboration from "@/components/Collaboration/Collaboration";
import Contact from "@/components/Contact/Contact";
import Feedback from "@/components/Feedback/Feedback";
import Footer from "@/components/Footer/Footer";
import { displayFancyLogs } from "utils/log";

gsap.registerPlugin(ScrollTrigger);
gsap.config({ nullTargetWarn: false });

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(true);
  const [isDesktop, setIsDesktop] = useState(true);
  const [clientHeight, setClientHeight] = useState(0);
  const [clientWidth, setClientWidth] = useState(0);

  useEffect(() => {
    // Returning visitors skip the loader + welcome intro entirely
    if (Cookies.get("visited") === "true") {
      setIsLoading(false);
      setShowWelcome(false);
    } else {
      Cookies.set("visited", "true", { expires: 7 });
      setTimeout(() => {
        setIsLoading(false);
      }, 2600);
    }

    displayFancyLogs();
  }, []);

  const handleWelcomeComplete = () => {
    setShowWelcome(false);
  };

  useEffect(() => {
    const { innerWidth, innerHeight, orientation, history } = window;

    const result =
      typeof orientation === "undefined" &&
      navigator.userAgent.indexOf("IEMobile") === -1;
    history.scrollRestoration = "manual";

    setIsDesktop(result);
    setClientHeight(innerHeight);
    setClientWidth(innerWidth);
  }, [isDesktop]);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : showWelcome ? (
        <Welcome onComplete={handleWelcomeComplete} />
      ) : (
        <>
          <Header>
            <Menu />
          </Header>
          <ProgressIndicator />
          <VerticalEmail />
          <Cursor isDesktop={isDesktop} />
          <CommandPalette />
          <main className="flex flex-col">
            <AmbientBackground />
            <Hero />
            <NowStrip />
            <About1 clientHeight={clientHeight} />
            <Skills />
            <Bento />
            <About2 clientHeight={clientHeight} />
            <Projects isDesktop={isDesktop} clientHeight={clientHeight} />
            <Work isDesktop={isDesktop} />
            <Testimonials />
            <Collaboration clientHeight={clientHeight} />
            <Contact />
            <Feedback />
          </main>
          <Footer />
        </>
      )}
    </>
  );
}
