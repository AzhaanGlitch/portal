// about.tsx – Final Fixed Version
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useContent } from "@/context/ContentContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

/* --------------------- TYPE DEFINITIONS --------------------------- */
type Gradient = string[];
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
  clubs?: { 
    title?: string; 
    desc?: string; 
    image?: string; 
    gradient?: Gradient 
  }[];
}
interface Leadership {
  heading?: string;
  summary?: string;
  members?: { 
    name?: string; 
    club?: string; 
    role?: string; 
    image?: string 
  }[];
}
interface AboutPageData {
  hero?: Hero;
  mission?: Mission;
  leadership?: Leadership;
}

/* --------------------- SMALL HELPERS ------------------------------ */
const safeArr = <T,>(v?: T[]): T[] => (Array.isArray(v) ? v : []);
const safeStr = (v?: string): string => (typeof v === "string" ? v : "");

/* --------------------- PAGE SHELL --------------------------------- */
export default function AboutPage() {
  const { content } = useContent();
  const about = content?.aboutpg as AboutPageData | undefined;
  
  if (!about) return null;

  return (
    // FIX: Ensure the entire page has a solid, opaque background and higher z-index to fully cover any underlying video.
    <div className="relative bg-background min-h-screen z-40">
      {/* Additional full-page overlay to block any background video */}
      <div className="fixed inset-0 bg-background z-30" />
      <AboutHeroSection {...(about.hero ?? {})} />
      <MissionSection {...(about.mission ?? {})} />
      <LeadershipSection {...(about.leadership ?? {})} />
    </div>
  );
}

/* --------------------- HERO --------------------------------------- */
const AboutHeroSection = ({ title, subtitle, cta }: Hero) => {
  const titleSafe = safeArr(title);
  const subSafe = safeStr(subtitle);
  const primary = cta?.primary;
  const secondary = cta?.secondary;

  if (!titleSafe.length && !subSafe) return null;

  return (
    <section 
      className="relative w-full h-screen overflow-hidden bg-background z-50"
    >
      {/* Solid opaque background to ensure no video bleeds through */}
      <div className="absolute inset-0 bg-background z-40" />
      <div className="relative z-50 h-full flex flex-col justify-center items-center text-center px-6 text-foreground">
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
                className="bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-500 bg-clip-text text-transparent"
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
            className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto leading-relaxed text-muted-foreground"
          >
            {subSafe}
          </motion.p>
        )}

        {(primary?.label || secondary?.label) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            {primary?.label && (
              <Link href={primary.href ?? "#"}>
                <Button
                  size="lg"
                  className="px-8 py-4 rounded-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white border-blue-500/30 shadow-lg shadow-blue-500/30 hover:shadow-blue-600/40 transition-all duration-300"
                >
                  {primary.label}
                </Button>
              </Link>
            )}

            {secondary?.label && (
              <Link href={secondary.href ?? "#"}>
                <Button
                  variant="outline"
                  size="lg"
                  className="px-8 py-4 rounded-lg font-semibold border-2 transition-all duration-300"
                >
                  {secondary.label}
                </Button>
              </Link>
            )}
          </motion.div>
        )}
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center text-muted-foreground z-60"
      >
        <span className="text-sm mb-2">Scroll to explore</span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-6 h-10 border-2 rounded-full flex justify-center border-border"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-3 rounded-full mt-2 bg-muted-foreground/70"
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

/* ------------------- MISSION -------------------------------------- */
const MissionSection = ({ heading, paragraphs, clubs }: Mission) => {
  const headingSafe = safeStr(heading);
  const paraSafe = safeArr(paragraphs);
  const clubsSafe = safeArr(clubs);

  if (!headingSafe && !paraSafe.length && !clubsSafe.length) return null;

  return (
    <section
      id="about"
      className="relative w-full min-h-screen flex items-center justify-center bg-background z-50"
    >
      {/* Solid opaque background to ensure no video bleeds through */}
      <div className="absolute inset-0 bg-background z-40" />
      <div className="relative z-50 px-4 max-w-4xl mx-auto py-20">
        {!!headingSafe && (
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-center mb-12 text-foreground"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <span className="bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
              {headingSafe}
            </span>
          </motion.h2>
        )}

        {!!paraSafe.length && (
          <motion.div
            className="text-lg md:text-xl leading-relaxed text-center mb-12 text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            {paraSafe.map((p, i) => (
              <p key={i} className="mb-6 last:mb-0">
                {p}
              </p>
            ))}
          </motion.div>
        )}

        {!!clubsSafe.length && (
          <>
            <motion.h3
              className="text-3xl md:text-4xl font-bold text-center mb-8 text-foreground"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
                Associated Clubs
              </span>
            </motion.h3>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              {clubsSafe.map((club, index) => {
                const gradientArr = safeArr(club.gradient);
                const gradient = gradientArr.length >= 2
                  ? `from-[${gradientArr[0]}] to-[${gradientArr[1]}]`
                  : "from-blue-500 to-cyan-500";

                return (
                  <Card
                    key={index}
                    className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-blue-400/30 backdrop-blur-sm"
                  >
                    <CardContent className="p-6">
                      <motion.div
                        whileHover={{ y: -5, scale: 1.02 }}
                        className="flex flex-col h-full"
                      >
                        <div
                          className={`w-12 h-12 rounded-lg bg-gradient-to-r ${gradient} mb-4 flex items-center justify-center text-white text-xl overflow-hidden`}
                        >
                          {club.image ? (
                            <img
                              src={club.image}
                              alt={club.title || "Club"}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            "✨"
                          )}
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-blue-600 dark:text-blue-400">
                          {club.title ?? ""}
                        </h3>
                        <p className="text-muted-foreground flex-grow">
                          {club.desc ?? ""}
                        </p>
                      </motion.div>
                    </CardContent>
                  </Card>
                );
              })}
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
};

/* ------------------- LEADERSHIP ----------------------------------- */
const LeadershipSection = ({ heading, summary, members }: Leadership) => {
  const headingSafe = safeStr(heading);
  const summarySafe = safeStr(summary);
  const membersSafe = safeArr(members);

  if (!headingSafe && !membersSafe.length) return null;

  return (
    <section
      id="team"
      className="relative w-full min-h-screen flex items-center justify-center py-20 bg-background z-50"
    >
      {/* Solid opaque background to ensure no video bleeds through */}
      <div className="absolute inset-0 bg-background z-40" />
      <div className="relative z-50 px-4 max-w-6xl mx-auto">
        {!!headingSafe && (
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-center mb-16 text-foreground"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <span className="bg-gradient-to-r from-orange-600 to-pink-600 dark:from-orange-400 dark:to-pink-400 bg-clip-text text-transparent">
              {headingSafe}
            </span>
          </motion.h2>
        )}

        {!!membersSafe.length && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {membersSafe.map((member, index) => (
              <Card
                key={index}
                className="group hover:shadow-lg transition-all duration-300 p-0 border-border/50 hover:border-orange-400/30 backdrop-blur-sm overflow-hidden"
              >
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true, margin: "-100px" }}
                >
                  <div className="h-48 relative overflow-hidden flex items-center justify-center bg-gradient-to-br from-blue-500/10 to-purple-600/10">
                    {member.image ? (
                      <img 
                        src={member.image} 
                        alt={member.name || "Team member"} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="text-6xl text-orange-600/30 dark:text-orange-400/30 font-bold">
                        {(member.name ?? "")
                          .split(" ")
                          .map((n) => n[0] ?? "")
                          .join("")}
                      </div>
                    )}
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-2 text-foreground">
                      {member.name ?? ""}
                    </h3>
                    <Badge variant="secondary" className="mb-2 bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300">
                      {member.role ?? ""}
                    </Badge>
                    <p className="text-sm text-muted-foreground mb-4">
                      {member.club ?? ""}
                    </p>
                  </CardContent>
                </motion.div>
              </Card>
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
            <p className="text-xl max-w-3xl mx-auto text-muted-foreground">{summarySafe}</p>
          </motion.div>
        )}
      </div>
    </section>
  );
};
