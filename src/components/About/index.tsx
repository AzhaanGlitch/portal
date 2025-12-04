// index.tsx (The About Page - Complete Fixed File)
"use client";

import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useContent } from "@/context/ContentContext"; 
import { useState, useEffect, useMemo } from "react";
import BackgroundVideo from "../animations/BackgroundVideo/BackgroundVideo"; 

/* --------------------- TYPE DEFINITIONS --------------------------- */
type Gradient = string;
interface Hero {
  title?: string[];
  subtitle?: string;
  cta?: {
    primary?: { label?: string; href?: string };
    secondary?: { label?: string; href?: string };
  };
}
interface Mission {
  heading?: string;
  paragraphs?: string[];
  pillars?: {
    title?: string;
    desc?: string;
    icon?: string;
    gradient?: Gradient;
  }[];
}
interface Values {
  heading?: string;
  summary?: string;
  cards?: {
    title?: string;
    desc?: string;
    icon?: string;
    gradient?: Gradient;
  }[];
}
interface Timeline {
  heading?: string;
  milestones?: { year?: string; event?: string }[];
}
interface Leadership {
  heading?: string;
  summary?: string;
  members?: { name?: string; role?: string; bio?: string }[];
}
interface AboutPageData {
  hero?: Hero;
  mission?: Mission;
  values?: Values;
  timeline?: Timeline;
  leadership?: Leadership;
}
// Team types from TeamSection
interface TeamMember {
  name: string;
  role: string;
  image?: string;
  club?: string;
}
interface TeamData {
  core_members?: TeamMember[];
  ps_tl_members?: TeamMember[];
  e_cell_members?: TeamMember[];
  bec_members?: TeamMember[];
}


/* --------------------- SMALL HELPERS ------------------------------ */
const safeArr = <T,>(v?: T[]): T[] => (Array.isArray(v) ? v : []);
const safeStr = (v?: string): string => (typeof v === "string" ? v : "");


/* --------------------- PAGE SHELL --------------------------------- */
export default function AboutPage() {
  const { content } = useContent();
  const about = content?.aboutpg as AboutPageData | undefined;
  if (!about) return null; // still loading or missing

  return (
    <div className="relative">
      <AboutHeroSection {...(about.hero ?? {})} />
      <MissionSection {...(about.mission ?? {})} />
      <ValuesSection {...(about.values ?? {})} />
      <HistorySection {...(about.timeline ?? {})} />
      <TeamSection />
    </div>
  );
}

/* --------------------- HERO --------------------------------------- */
const AboutHeroSection = ({ title, subtitle, cta }: Hero) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const titleSafe = safeArr(title);
  const subSafe = safeStr(subtitle);
  const primary = cta?.primary;
  const secondary = cta?.secondary;

  if (!titleSafe.length && !subSafe) return null;

  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* BackgroundVideo component ensures the video is correctly positioned */}
      <BackgroundVideo opacity={0.3} />

      <div
        className={`relative z-10 h-full flex flex-col justify-center items-center text-center px-6 ${
          isDark ? "text-white" : "text-gray-900"
        }`}
      >
        {!!titleSafe.length && (
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-bold text-5xl md:text-6xl lg:text-7xl mb-6"
          >
            {titleSafe.map((chunk, i) => (
              <span
                key={i}
                className={`bg-gradient-to-r ${
                  isDark
                    ? "from-blue-400 to-purple-600"
                    : "from-blue-600 to-purple-700"
                } bg-clip-text text-transparent`}
              >
                {chunk}
                {i < titleSafe.length - 1 && " "}
              </span>
            ))}
          </motion.h1>
        )}

        {!!subSafe && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className={`text-xl md:text-2xl mb-10 max-w-3xl mx-auto leading-relaxed ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}
          >
            {subSafe}
          </motion.p>
        )}

        {(primary?.label || secondary?.label) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mt-8"
          >
            {primary?.label && (
              <Link href={primary.href ?? "#"}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-8 py-4 rounded-lg font-semibold transition-all duration-300 border ${
                    isDark
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white border-blue-400/30 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
                      : "bg-gradient-to-r from-blue-600 to-purple-700 text-white border-blue-500/30 shadow-lg shadow-blue-500/30 hover:shadow-blue-600/40"
                  }`}
                >
                  {primary.label}
                </motion.button>
              </Link>
            )}

            {secondary?.label && (
              <Link href={secondary.href ?? "#"}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-8 py-4 rounded-lg font-semibold border transition-all duration-300 ${
                    isDark
                      ? "bg-transparent text-white border-white/30 hover:bg-white/10"
                      : "bg-transparent text-gray-800 border-gray-400 hover:bg-gray-100/50"
                  }`}
                >
                  {secondary.label}
              </motion.button>
              </Link>
            )}
          </motion.div>
        )}
      </div>

      {/* scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center ${
          isDark ? "text-white" : "text-gray-600"
        }`}
      >
        <span className="text-sm mb-2">Scroll to explore</span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className={`w-6 h-10 border-2 rounded-full flex justify-center ${
            isDark ? "border-white/50" : "border-gray-400"
          }`}
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className={`w-1 h-3 rounded-full mt-2 ${
              isDark ? "bg-white/70" : "bg-gray-600"
            }`}
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

/* ------------------- MISSION -------------------------------------- */
const MissionSection = ({ heading, paragraphs, pillars }: Mission) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const headingSafe = safeStr(heading);
  const paraSafe = safeArr(paragraphs);
  const pillarSafe = safeArr(pillars);

  const sectionBg = isDark
    ? "bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900"
    : "bg-gradient-to-br from-gray-50 via-blue-50/50 to-gray-50";
  const cardBg = isDark
    ? "bg-white/5 backdrop-blur-sm border-white/10 hover:border-blue-400/30"
    : "bg-white/80 backdrop-blur-sm border-gray-200 hover:border-blue-400/30";
  const titleColor = isDark ? "text-white" : "text-gray-900";
  const textColor = isDark ? "text-gray-300" : "text-gray-700";
  const accentColor = isDark ? "text-blue-400" : "text-blue-600";

  if (!headingSafe && !paraSafe.length && !pillarSafe.length) return null;

  return (
    <section
      id="mission"
      className={`relative w-full min-h-screen flex items-center justify-center ${sectionBg}`}
    >
      <div className="relative z-10 px-4 max-w-4xl mx-auto">
        {!!headingSafe && (
          <motion.h2
            className={`text-4xl md:text-5xl font-bold text-center mb-12 ${titleColor}`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            Our{" "}
            <span
              className={`bg-gradient-to-r ${
                isDark
                  ? "from-blue-400 to-cyan-400"
                  : "from-blue-600 to-cyan-600"
              } bg-clip-text text-transparent`}
            >
              {headingSafe}
            </span>
          </motion.h2>
        )}

        {!!paraSafe.length && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true, margin: "-100px" }}
            className={`text-lg md:text-xl leading-relaxed text-center mb-12 ${textColor}`}
          >
            {paraSafe.map((p, i) => (
              <p key={i} className="mb-6 last:mb-0">
                {p}
              </p>
            ))}
          </motion.div>
        )}

        {!!pillarSafe.length && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"
          >
            {pillarSafe.map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5, scale: 1.02 }}
                className={`rounded-2xl p-6 border transition-all duration-300 ${cardBg}`}
              >
                <div
                  className={`w-12 h-12 rounded-lg bg-gradient-to-r ${
                    item.gradient ?? "from-blue-500 to-cyan-500"
                  } mb-4 flex items-center justify-center text-white text-xl`}
                >
                  {item.icon ?? "✨"}
                </div>
                <h3 className={`text-xl font-bold mb-3 ${accentColor}`}>
                  {item.title ?? ""}
                </h3>
                <p className={textColor}>{item.desc ?? ""}</p>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

/* ------------------- VALUES --------------------------------------- */
const ValuesSection = ({ heading, summary, cards }: Values) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const headingSafe = safeStr(heading);
  const summarySafe = safeStr(summary);
  const cardsSafe = safeArr(cards);

  const sectionBg = isDark
    ? "bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900"
    : "bg-gradient-to-br from-purple-50/80 via-pink-50/50 to-rose-50/80";
  const cardBg = isDark
    ? "bg-white/5 backdrop-blur-sm border-white/10 hover:border-purple-400/30"
    : "bg-white/80 backdrop-blur-sm border-gray-200 hover:border-purple-400/30";
  const titleColor = isDark ? "text-white" : "text-gray-900";
  const textColor = isDark ? "text-gray-300" : "text-gray-700";
  const accentColor = isDark ? "text-purple-400" : "text-purple-600";

  if (!headingSafe && !cardsSafe.length) return null;

  return (
    <section
      className={`relative w-full min-h-screen flex items-center justify-center ${sectionBg}`}
    >
      <div className="relative z-10 px-4 max-w-6xl mx-auto">
        {!!headingSafe && (
          <motion.h2
            className={`text-4xl md:text-5xl font-bold text-center mb-16 ${titleColor}`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            Our{" "}
            <span
              className={`bg-gradient-to-r ${
                isDark
                  ? "from-purple-400 to-pink-400"
                  : "from-purple-600 to-pink-600"
              } bg-clip-text text-transparent`}
            >
              {headingSafe}
            </span>
          </motion.h2>
        )}

        {!!cardsSafe.length && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {cardsSafe.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true, margin: "-100px" }}
                className={`rounded-2xl p-8 border transition-all duration-300 hover:shadow-lg ${cardBg}`}
              >
                <div
                  className={`w-12 h-12 rounded-lg bg-gradient-to-r ${
                    value.gradient ?? "from-purple-500 to-pink-500"
                  } mb-6 flex items-center justify-center text-white text-xl`}
                >
                  {value.icon ?? "✨"}
                </div>
                <h3 className={`text-2xl font-bold mb-3 ${accentColor}`}>
                  {value.title ?? ""}
                </h3>
                <p className={`text-lg ${textColor}`}>{value.desc ?? ""}</p>
              </motion.div>
            ))}
          </div>
        )}

        {!!summarySafe && (
          <motion.div
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <p className={`text-xl max-w-3xl mx-auto ${textColor}`}>
              {summarySafe}
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

/* ------------------- TIMELINE ------------------------------------- */
const HistorySection = ({ heading, milestones }: Timeline) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const headingSafe = safeStr(heading);
  const milestonesSafe = safeArr(milestones);

  const sectionBg = isDark
    ? "bg-gradient-to-br from-slate-900 via-green-900/20 to-slate-900"
    : "bg-gradient-to-br from-green-50/80 via-cyan-50/50 to-blue-50/80";
  const cardBg = isDark
    ? "bg-white/5 backdrop-blur-sm border-white/10 hover:border-green-400/30"
    : "bg-white/80 backdrop-blur-sm border-gray-200 hover:border-green-400/30";
  const titleColor = isDark ? "text-white" : "text-gray-900";
  const textColor = isDark ? "text-gray-300" : "text-gray-700";
  const accentColor = isDark ? "text-green-400" : "text-green-600";

  if (!headingSafe && !milestonesSafe.length) return null;

  return (
    <section
      className={`relative w-full min-h-screen flex items-center justify-center pt-20 ${sectionBg}`}
    >
      <div className="relative z-10 px-4 max-w-6xl mx-auto">
        {!!headingSafe && (
          <motion.h2
            className={`text-4xl md:text-5xl font-bold text-center mb-16 ${titleColor}`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            Our{" "}
            <span
              className={`bg-gradient-to-r ${
                isDark
                  ? "from-green-400 to-cyan-400"
                  : "from-green-600 to-cyan-600"
              } bg-clip-text text-transparent`}
            >
              {headingSafe}
            </span>
          </motion.h2>
        )}

        {!!milestonesSafe.length && (
          <div className="relative">
            <div
              className={`absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b ${
                isDark
                  ? "from-green-500/30 via-cyan-500/30 to-blue-500/30"
                  : "from-green-400/50 via-cyan-400/50 to-blue-400/50"
              } transform -translate-x-1/2 hidden md:block`}
            />
            {milestonesSafe.map((m, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true, amount: 0.5 }}
                className={`relative flex flex-col md:flex-row items-center mb-12 md:mb-0 ${
                  index % 2 === 0 ? "md:flex-row-reverse" : ""
                }`}
              >
                <div
                  className={`w-full md:w-1/2 p-4 ${
                    index % 2 === 0
                      ? "md:pl-8 md:text-left"
                      : "md:pr-8 md:text-right"
                  }`}
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className={`rounded-2xl p-6 border transition-all duration-300 ${cardBg}`}
                  >
                    <h3 className={`text-2xl font-bold mb-2 ${accentColor}`}>
                      {m.year ?? ""}
                    </h3>
                    <p className={textColor}>{m.event ?? ""}</p>
                  </motion.div>
                </div>

                <div
                  className={`hidden md:flex w-12 h-12 rounded-full bg-gradient-to-r ${
                    isDark
                      ? "from-green-500 to-cyan-600"
                      : "from-green-600 to-cyan-700"
                  } items-center justify-center relative z-10 border-4 ${
                    isDark ? "border-slate-900" : "border-white"
                  } mx-4 shadow-lg ${
                    isDark ? "shadow-green-500/20" : "shadow-green-500/30"
                  }`}
                >
                  <div className="w-3 h-3 rounded-full bg-white" />
                </div>

                <div className="w-full md:w-1/2 p-4 hidden md:block" />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

/* ------------------- LEADERSHIP ----------------------------------- */
const TeamSection = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  // 💥 FIX: Removed 'refetch' from destructuring to fix TypeScript error
  const { content, loading, error } = useContent(); 
  const [activeClub, setActiveClub] = useState("core");
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Initialize active club once data is loaded
  useEffect(() => {
    if (!loading && content.full_team && !isInitialized) {
      const teamData = content.full_team as TeamData;
      
      const clubs = [
        { key: "core", members: teamData.core_members },
        { key: "ps_tl", members: teamData.ps_tl_members },
        { key: "e_cell", members: teamData.e_cell_members },
        { key: "bec", members: teamData.bec_members },
      ];

      const firstValidClub = clubs.find(
        (club) => club.members && club.members.length > 0
      );
      // Only update if a valid club is found and it's different from current
      if (firstValidClub && firstValidClub.key !== activeClub) { 
        setActiveClub(firstValidClub.key);
      } else if (!firstValidClub && activeClub !== "core") {
         // Fallback if the default 'core' is set but there's no data
         setActiveClub("core");
      }
      setIsInitialized(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, content.full_team, isInitialized]); 

  // Safe data access with fallbacks
  const teamData = useMemo(
    // Ensure content.full_team is treated as TeamData, defaulting to empty object
    () => (content.full_team as TeamData) || {},
    [content.full_team]
  );

  const core_members = teamData.core_members || [];
  const ps_tl_members = teamData.ps_tl_members || [];
  const e_cell_members = teamData.e_cell_members || [];
  const bec_members = teamData.bec_members || [];

  const hasNoData = useMemo(
    () =>
      core_members.length === 0 &&
      ps_tl_members.length === 0 &&
      e_cell_members.length === 0 &&
      bec_members.length === 0,
    [core_members, ps_tl_members, e_cell_members, bec_members]
  );

  // Club configuration
  const clubConfig = useMemo(
    () => ({
      core: {
        gradient: "from-cyan-500 to-blue-600",
        displayName: "I2EDC Core Team",
        tabLabel: "I2EDC Core",
        members: core_members,
      },
      ps_tl: {
        gradient: "from-purple-500 to-pink-600",
        displayName: "ProtoSpace & Tinkering Lab",
        tabLabel: "ProtoSpace & TL",
        members: ps_tl_members,
      },
      e_cell: {
        gradient: "from-green-500 to-emerald-600",
        displayName: "Entrepreneurship Cell",
        tabLabel: "E-Cell",
        members: e_cell_members,
      },
      bec: {
        gradient: "from-orange-500 to-red-600",
        displayName: "Budding Entrepreneur Club",
        tabLabel: "BEC",
        members: bec_members,
      },
    }),
    [core_members, ps_tl_members, e_cell_members, bec_members]
  );

  // Available tabs with members
  const clubTabs = useMemo(
    () =>
      Object.entries(clubConfig)
        .filter(([_, config]) => config.members.length > 0)
        .map(([key, config]) => ({
          key,
          label: config.tabLabel,
          members: config.members,
          gradient: config.gradient,
          displayName: config.displayName,
        })),
    [clubConfig]
  );

  // Current team members
  const currentTeam = useMemo(
    () => clubConfig[activeClub as keyof typeof clubConfig]?.members || [],
    [activeClub, clubConfig]
  );

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    const target = e.target as HTMLImageElement;
    target.style.display = "none";

    const parent = target.parentElement;
    if (parent && !parent.querySelector(".fallback-avatar")) {
      const fallback = document.createElement("div");
      fallback.className =
        "fallback-avatar w-full h-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg";
      fallback.textContent = target.alt?.charAt(0) || "?";
      parent.appendChild(fallback);
    }
  };

  const renderTeam = (members: TeamMember[], delayBase = 0) => {
    if (!members || members.length === 0) {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center py-8"
        >
          <p
            className={`text-lg ${isDark ? "text-gray-400" : "text-gray-500"}`}
          >
            No members found for this team
          </p>
        </motion.div>
      );
    }

    return (
      <div className="flex flex-wrap justify-center gap-6 mb-8">
        {members.map((member, index) => (
          <motion.div
            key={`${member.name}-${index}-${member.role}`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: delayBase + index * 0.1 }}
            className={`${
              isDark
                ? "bg-white/10 border-white/20 hover:border-cyan-400/40"
                : "bg-black/5 border-black/10 hover:border-cyan-600/40"
            } backdrop-blur-md p-6 rounded-xl border flex flex-col items-center group w-64 transition-all duration-300 hover:shadow-lg`}
          >
            <div className="w-32 h-32 mb-4 overflow-hidden rounded-full border-2 border-white/30 relative">
              {member.image ? (
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={handleImageError}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-2xl">
                  {member.name?.charAt(0) || "?"}
                </div>
              )}
            </div>

            <h3
              className={`text-lg font-bold text-center ${
                isDark ? "text-white" : "text-gray-900"
              } mb-1`}
            >
              {member.name || "Unknown Member"}
            </h3>

            <div className="text-center mb-2">
              <span
                className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  isDark
                    ? "bg-cyan-500/20 text-cyan-300"
                    : "bg-cyan-500/20 text-cyan-700"
                }`}
              >
                {member.club || "I2EDC"}
              </span>
            </div>

            <p
              className={`${
                isDark ? "text-slate-300" : "text-gray-600"
              } text-sm text-center`}
            >
              {member.role || "Team Member"}
            </p>
          </motion.div>
        ))}
      </div>
    );
  };

  // Loading state
  if (loading && !content.full_team) {
    return <LoadingState isDark={isDark} message="Loading team..." />;
  }

  // Error state
  if (error && !content.full_team) {
    // FIX: Use window.location.reload as fallback since refetch isn't typed
    return <ErrorState isDark={isDark} onRetry={() => window.location.reload()} />; 
  }

  // No data state
  if (hasNoData) {
    // FIX: Use window.location.reload as fallback since refetch isn't typed
    return <NoDataState isDark={isDark} onRetry={() => window.location.reload()} />; 
  }

  // No tabs available
  if (clubTabs.length === 0) {
    // FIX: Use window.location.reload as fallback since refetch isn't typed
    return <NoDataState isDark={isDark} onRetry={() => window.location.reload()} />;
  }

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden py-16">
      <div className="relative z-2 text-center px-4 max-w-7xl mx-auto w-full">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className={`text-3xl md:text-4xl lg:text-5xl font-bold ${
            isDark ? "text-white" : "text-gray-900"
          } mb-12 font-serif`}
        >
          Meet Our Team
        </motion.h2>

        {/* Club Navigation Tabs */}
        {clubTabs.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-4 mb-12"
          >
            {clubTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveClub(tab.key)}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  activeClub === tab.key
                    ? `bg-gradient-to-r ${tab.gradient} text-white shadow-lg`
                    : isDark
                    ? "bg-white/10 text-white/70 hover:bg-white/20"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {tab.label} ({tab.members.length})
              </button>
            ))}
          </motion.div>
        )}

        {/* Active Club Title - FIXED: Only one instance */}
        <motion.h3
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className={`text-2xl md:text-3xl font-bold mb-8 bg-gradient-to-r ${
            clubConfig[activeClub as keyof typeof clubConfig]?.gradient ||
            "from-gray-500 to-gray-600"
          } bg-clip-text text-transparent`}
        >
          {clubConfig[activeClub as keyof typeof clubConfig]?.displayName ||
            "Team"}
        </motion.h3>

        {/* Team Members Grid */}
        <motion.div
          key={activeClub} // This ensures re-animation on club change
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {renderTeam(currentTeam)}
        </motion.div>

        {/* Club Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className={`mt-12 p-6 rounded-2xl backdrop-blur-sm ${
            isDark
              ? "bg-white/10 border-white/20"
              : "bg-black/5 border-black/10"
          } border`}
        >
          <h4
            className={`text-xl font-bold mb-4 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Team Overview
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {clubTabs.map((tab) => (
              <div key={tab.key} className="text-center">
                <div
                  className={`text-2xl font-bold bg-gradient-to-r ${tab.gradient} bg-clip-text text-transparent`}
                >
                  {tab.members.length}
                </div>
                <div
                  className={`text-sm ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {tab.label} Members
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Extracted components for better organization
const LoadingState = ({
  isDark,
  message,
}: {
  isDark: boolean;
  message: string;
}) => (
  <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
      <p className={`text-lg ${isDark ? "text-gray-300" : "text-gray-700"}`}>
        {message}
      </p>
    </div>
  </section>
);

const ErrorState = ({
  isDark,
  onRetry,
}: {
  isDark: boolean;
  onRetry: () => void;
}) => (
  <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
    <div className="text-center">
      <p className="text-lg text-red-500 mb-4">Error loading team content</p>
      <button
        onClick={onRetry}
        className={`px-6 py-3 rounded-lg font-semibold ${
          isDark
            ? "bg-white/10 text-white border border-white/30"
            : "bg-gray-100 text-gray-800 border border-gray-300"
        }`}
      >
        Retry
      </button>
    </div>
  </section>
);

const NoDataState = ({
  isDark,
  onRetry,
}: {
  isDark: boolean;
  onRetry: () => void;
}) => (
  <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
    <div className="text-center">
      <p
        className={`text-lg ${isDark ? "text-gray-300" : "text-gray-700"} mb-4`}
      >
        No team data available
      </p>
      <button
        onClick={onRetry}
        className={`px-6 py-3 rounded-lg font-semibold ${
          isDark
            ? "bg-white/10 text-white border border-white/30"
            : "bg-gray-100 text-gray-800 border border-gray-300"
        }`}
      >
        Retry
      </button>
    </div>
  </section>
);