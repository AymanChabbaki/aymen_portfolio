import { useEffect, useState } from "react";
import { FiMapPin, FiZap, FiBriefcase } from "react-icons/fi";
import { HiOutlineAcademicCap } from "react-icons/hi";
import { useLanguage } from "../../contexts/LanguageContext";
import { getTranslation } from "../../locales/translations";

const GITHUB_USERNAME = "AymanChabbaki";

const relativeTime = (dateString, language) => {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const minutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const rtf = new Intl.RelativeTimeFormat(language === "fr" ? "fr" : "en", {
    numeric: "auto",
  });
  if (days > 0) return rtf.format(-days, "day");
  if (hours > 0) return rtf.format(-hours, "hour");
  return rtf.format(-Math.max(minutes, 1), "minute");
};

// Thin live ticker between the hero and the about section.
const NowStrip = () => {
  const { language } = useLanguage();
  const [commit, setCommit] = useState(null);
  const [localTime, setLocalTime] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    fetch(`https://api.github.com/users/${GITHUB_USERNAME}/events/public`, {
      signal: controller.signal,
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((events) => {
        if (!Array.isArray(events)) return;
        const push = events.find(
          (e) => e.type === "PushEvent" && e.payload?.commits?.length
        );
        if (push) {
          setCommit({
            repo: push.repo.name.split("/")[1],
            message: push.payload.commits[push.payload.commits.length - 1]
              .message.split("\n")[0]
              .slice(0, 60),
            date: push.created_at,
          });
        }
      })
      .catch(() => {});

    return () => controller.abort();
  }, []);

  useEffect(() => {
    const update = () =>
      setLocalTime(
        new Intl.DateTimeFormat(language === "fr" ? "fr-FR" : "en-US", {
          timeZone: "Africa/Casablanca",
          hour: "2-digit",
          minute: "2-digit",
        }).format(new Date())
      );

    update();
    const intervalId = setInterval(update, 30000);
    return () => clearInterval(intervalId);
  }, [language]);

  const items = [
    <span key="available" className="flex items-center gap-2">
      <span className="w-2 h-2 rounded-full bg-green pulse-dot flex-none" />
      {getTranslation(language, "availableForWork")}
    </span>,
    <span key="location" className="flex items-center gap-2">
      <FiMapPin className="text-indigo-light w-4 h-4 flex-none" />
      {getTranslation(language, "basedIn")}
      {localTime && ` · ${localTime}`}
    </span>,
    ...(commit
      ? [
          <span key="commit" className="flex items-center gap-2">
            <FiZap className="text-indigo-light w-4 h-4 flex-none" />
            {getTranslation(language, "latestCommit")}:{" "}
            <span className="text-indigo-light">{commit.repo}</span> —{" "}
            {commit.message} · {relativeTime(commit.date, language)}
          </span>,
        ]
      : []),
    <span key="study" className="flex items-center gap-2">
      <HiOutlineAcademicCap className="text-indigo-light w-4 h-4 flex-none" />
      {getTranslation(language, "currentlyStudying")}
    </span>,
    <span key="work" className="flex items-center gap-2">
      <FiBriefcase className="text-indigo-light w-4 h-4 flex-none" />
      {getTranslation(language, "buildingAt")}
    </span>,
  ];

  const track = items.map((item, i) => (
    <span
      key={i}
      className="flex items-center gap-3 whitespace-nowrap px-8 font-mono text-sm text-gray-light-3"
    >
      {item}
      <span
        className="w-1.5 h-1.5 rounded-full bg-indigo-light/50 flex-none"
        aria-hidden="true"
      />
    </span>
  ));

  return (
    <div
      className="marquee w-full border-y border-gray-dark-2 bg-gray-dark-5/60 py-3 select-none"
      style={{ "--marquee-duration": "45s" }}
      aria-hidden="true"
    >
      <div className="marquee-track">
        <div className="flex">{track}</div>
        <div className="flex">{track}</div>
      </div>
    </div>
  );
};

export default NowStrip;
