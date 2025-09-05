// Hero.tsx
'use client';
import { useRef } from "react";
import { motion, useTransform, useScroll } from "framer-motion";
import { useIsMobile } from "@/context/IsMobileContext";
import { useScroll as useScrollContext } from "@/context/ScrollContext";
import { useInView } from "react-intersection-observer";
import styles from './hero.module.css'

export default function HomePage() {
    return (
        <div>
            <Hero />
            <div className="relative"
                style={{height:`calc(200vh + 100dvh)`}}
            >
                <IntroTextSection />
                <IntroOverlaySection /> 
                
            </div>
            {/* <div className="h-screen"></div> */}
        </div>
    );
}

export const Hero = () => {
    const { isTop } = useScrollContext();
    return (
        <section className="relative w-full h-screen overflow-hidden">
            {/* Background Video */}
            <div className="absolute inset-0 -z-10">
                <video
                    className="w-full h-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                >
                    <source
                        src="https://player.vimeo.com/progressive_redirect/playback/1093082132/rendition/1080p/file.mp4?loc=external&signature=775997462bdcb4b12f7acb1e5bd9607086c1759e37451fa6642dbc131e5da590"
                        type="video/mp4"
                    />
                </video>
            </div>

            {/* Hero Content */}
            <div className={styles['hero-content']}>
                <div className="flex flex-col gap-4">
                    <motion.h1
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className={`text-white font-bold max-w-3xl mx-auto text-center lg:text-left ${styles['text-responsive-heading-1']}`}
                    >
                        Maneuverability when you need it. On demand.
                    </motion.h1>

                    {/* CTA Button */}
                    <motion.a
                        href="#intro" // Link to the IntroTextSection
                        className="mt-6 inline-flex items-center text-white font-medium text-[clamp(0.3rem,3vw,1rem)] group"
                        whileHover={{ x: 5 }}
                    >
                        Learn more
                        <svg
                            className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 12 8"
                            fill="none"
                        >
                            <path
                                d="M11 1L6 6.5L1 1"
                                stroke="currentColor"
                                strokeWidth="1.2"
                                strokeLinecap="round" // Added
                                strokeLinejoin="round" // Added
                            />
                        </svg>
                    </motion.a>
                </div>

                {/* News Highlight Card */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="h-fit w-fit"
                >
                    <div className={styles["card"]}>
                        <div className={styles["card-content"]}>
                            <p className="p-m mb-3">Portal Space Systems Expands Manufacturing Footprint with New 50,000 Sq. Ft. Facility in Bothell, WA </p>
                            <div className={styles["content-bottom"]}><p className="p-m">Read more</p></div>
                        </div>
                        <img src="https://cdn.prod.website-files.com/67f8bd9d630dd52ec429fb93/685545c256fb25811dad7522_Portal%20Space%20Systems%20Expands.avif" loading="lazy" width="97" alt="" className={styles["card-image"]} />
                        <div className={styles["card-overlay"]}>
                        </div>
                        <a href="/news/portal-space-systems-expands-manufacturing-footprint-with-new-50-000-sq-ft-facility-in-bothell-wa" className="abs-link w-inline-block"></a>
                        <a href="#" className="abs-link w-inline-block w-condition-invisible"></a>
                    </div>
                </motion.div>
            </div>

            {/* Scroll Indicator (optional) */}
            {isTop && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white"
                >
                    <span className="animate-bounce">↓ Scroll</span>
                </motion.div>
            )}
        </section>
    );
};

const words = "Space has changed, but spacecraft haven't. Static vehicles can't meet the demands of a dynamic environment. Chemical propulsion can't sustain maneuver, electric propulsion doesn't have the speed. We need a better spacecraft for this modern domain.".split(' ');
export const IntroTextSection = () => {
    const { isMobile } = useIsMobile();
    const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: false });
    const containerRef = useRef<HTMLDivElement>(null); // Added type assertion
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    // Parallax effect for the text
    const y = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]);

    return (
        <section
            id="intro" // Added ID for navigation
            ref={containerRef}
            className="relative w-full min-h-[200vh] flex flex-col items-center z-20 justify-center px-6 py-20 bg-white"
        >
            <motion.div
                className="sticky top-1/2 -translate-y-1/2"
                style={{ y }}
            >
                <h2
                    ref={ref}
                    className={`font-bold text-gray-900 ${isMobile ? "text-2xl" : "text-5xl"
                        } leading-snug max-w-5xl text-center`}
                >
                    {words.map((word, i) => (
                        <motion.span
                            key={i}
                            initial={{ opacity: 0.2 }}
                            animate={{ opacity: inView ? 1 : 0.2 }}
                            transition={{ delay: i * 0.05, duration: 0.4 }}
                            className="inline-block mx-1"
                        >
                            {word}
                        </motion.span>
                    ))}
                </h2>
            </motion.div>
        </section>
    );
};

export const IntroOverlaySection = () => {
    const { isMobile } = useIsMobile();
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    // Parallax effect for the background
    const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

    return (
        <section
            ref={containerRef}
            className="sticky bottom-0 w-full min-h-[100vh] flex items-center justify-center text-white px-6 overflow-hidden"
        >
            {/* Section Background Video with parallax */}
            <motion.div
                className="absolute inset-0 -z-10"
                style={{ y }}
            >
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover"
                >
                    <source
                        src="https://player.vimeo.com/progressive_redirect/playback/1094366638/rendition/1080p/file.mp4?loc=external&signature=d2795851fc98bef87acd9c08eef99020413386f385a07709c7cbf3f10b71c49e"
                        type="video/mp4"
                    />
                </video>
                {/* Optional dark overlay for readability */}
                {/* <div className="absolute inset-0 bg-black/50" /> */}
            </motion.div>

            {/* Foreground Content */}
            <div className="relative z-10 grid md:grid-cols-2 gap-10 items-center container mx-auto">
                {/* Text Content */}
                <div>
                    <h2 className={`font-bold ${isMobile ? "text-3xl" : "text-5xl"} mb-5`}>
                        Supernova is our answer
                    </h2>
                    <p className="text-lg text-gray-300 mb-8">
                        A maneuverable, solar-thermal spacecraft engineered for persistent
                        delta-v, on-demand autonomy, and real-time control.
                    </p>
                    <div className="grid grid-cols-3 gap-6">
                        <div>
                            <h3 className="text-xl font-semibold">6 km/s</h3>
                            <p className="text-sm text-gray-400">delta-v</p>
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold">On-Standby</h3>
                            <p className="text-sm text-gray-400">taskable in minutes</p>
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold">&lt;24h</h3>
                            <p className="text-sm text-gray-400">payload swap</p>
                        </div>
                    </div>
                </div>
                
            </div>
        </section>
    );
};