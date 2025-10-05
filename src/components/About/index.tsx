// about.tsx – null-proof, type-safe
"use client";

import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import LiquidEther from "../animations/LiquidEther/LiquidEther";
import Link from "next/link";
import { useContent } from "@/context/ContentContext";

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
  pillars?: { title?: string; desc?: string; icon?: string; gradient?: Gradient }[];
}
interface Values {
  heading?: string;
  summary?: string;
  cards?: { title?: string; desc?: string; icon?: string; gradient?: Gradient }[];
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
      <LeadershipSection {...(about.leadership ?? {})} />
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
      <div className="absolute inset-0 pointer-events-none">
        <LiquidEther autoDemo />
      </div>

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
                isDark ? "from-blue-400 to-cyan-400" : "from-blue-600 to-cyan-600"
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
                  className={`w-12 h-12 rounded-lg bg-gradient-to-r ${item.gradient ?? "from-blue-500 to-cyan-500"
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
                  className={`w-12 h-12 rounded-lg bg-gradient-to-r ${value.gradient ?? "from-purple-500 to-pink-500"
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
            <p className={`text-xl max-w-3xl mx-auto ${textColor}`}>{summarySafe}</p>
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
                viewport={{ once: true, margin: "-100px" }}
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
const LeadershipSection = ({ heading, summary, members }: Leadership) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const headingSafe = safeStr(heading);
  const summarySafe = safeStr(summary);
  const membersSafe = safeArr(members);

  const sectionBg = isDark
    ? "bg-gradient-to-br from-slate-900 via-orange-900/20 to-slate-900"
    : "bg-gradient-to-br from-orange-50/80 via-red-50/50 to-pink-50/80";
  const cardBg = isDark
    ? "bg-white/5 backdrop-blur-sm border-white/10 hover:border-orange-400/30"
    : "bg-white/80 backdrop-blur-sm border-gray-200 hover:border-orange-400/30";
  const titleColor = isDark ? "text-white" : "text-gray-900";
  const textColor = isDark ? "text-gray-300" : "text-gray-700";
  const accentColor = isDark ? "text-orange-400" : "text-orange-600";

  if (!headingSafe && !membersSafe.length) return null;

  return (
    <section
      id="team"
      className={`relative w-full min-h-screen flex items-center justify-center py-20 ${sectionBg}`}
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
            Leadership{" "}
            <span
              className={`bg-gradient-to-r ${
                isDark
                  ? "from-orange-400 to-pink-400"
                  : "from-orange-600 to-pink-600"
              } bg-clip-text text-transparent`}
            >
              {headingSafe}
            </span>
          </motion.h2>
        )}

        {!!membersSafe.length && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {membersSafe.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true, margin: "-100px" }}
                className={`rounded-2xl overflow-hidden border transition-all duration-300 hover:shadow-lg ${cardBg}`}
              >
                <div
                  className={`h-48 bg-gradient-to-r ${
                    isDark
                      ? "from-orange-900/20 to-pink-900/20"
                      : "from-orange-100 to-pink-100"
                  } relative overflow-hidden flex items-center justify-center`}
                >
                  <div
                    className={`text-6xl ${
                      isDark ? "text-orange-400/30" : "text-orange-600/30"
                    }`}
                  >
                    {(member.name ?? "")
                      .split(" ")
                      .map((n) => n[0] ?? "")
                      .join("")}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className={`text-2xl font-bold mb-2 ${titleColor}`}>
                    {member.name ?? ""}
                  </h3>
                  <p className={`mb-4 ${accentColor}`}>{member.role ?? ""}</p>
                  <p className={textColor}>{member.bio ?? ""}</p>
                  <div className="flex mt-4 space-x-3">
                    <button
                      className={`text-sm transition-colors ${
                        isDark
                          ? "text-orange-400 hover:text-orange-300"
                          : "text-orange-600 hover:text-orange-500"
                      }`}
                    >
                      LinkedIn
                    </button>
                    <button
                      className={`text-sm transition-colors ${
                        isDark
                          ? "text-orange-400 hover:text-orange-300"
                          : "text-orange-600 hover:text-orange-500"
                      }`}
                    >
                      Full Bio
                    </button>
                  </div>
                </div>
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
            <p className={`text-xl max-w-3xl mx-auto ${textColor}`}>{summarySafe}</p>
          </motion.div>
        )}
      </div>
    </section>
  );
};