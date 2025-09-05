"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

export default function MissionSection() {
  const sectionRef = useRef(null);

  // Track scroll progress inside section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"], // watch full section
  });

  // Animate slider entrance (parallax)
  const sliderY = useTransform(scrollYProgress, [0.2, 0.9], ["100%", "0%"]);
  const sliderOpacity = useTransform(scrollYProgress, [0.2, 0.4], [0, 1]);

  return (
    <section
      ref={sectionRef}
      className="relative bg-white overflow-hidden min-h-fit"
    >
      {/* Background
      <div className="absolute inset-0 z-0">
        <canvas className="w-full h-full" data-engine="three.js r176" />
      </div> */}

      {/* Intro text (sticks until slider is in place) */}
      <div className="sticky bottom-0 lg:mt-[10rem]  z-10 flex flex-col items-center px-6 py-20">
        <motion.div
          initial={{ y: "20%", opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: false, amount: 0.3 }}
          className="w-full max-w-[120rem] mx-auto px-3 sm:px-6 lg:px-20"
        >
          <div className="w-[clamp(24.8125rem,32.81%,35rem)] text-black">
            <h2 className="h1 mb-5">
              Trans-orbital freedom.<br />Mission-ready capability.
            </h2>
            <p className="p-m">
              Supernova delivers sustained maneuverability across orbits, from
              LEO to Cislunar space and back, with a multi-year life for
              persistent responsiveness.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Slider (slides up & fades in, stops under intro text) */}
      <motion.div
        style={{ y: sliderY, opacity: sliderOpacity }}
        className="sticky top-0 z-0 px-6 pb-20"
      >
        <Slider />
      </motion.div>
    </section>
  );
}



function Slider() {
    const [sliderRef] = useKeenSlider<HTMLDivElement>({
        loop: true,
        slides: {
            perView: 1,
            spacing: 20,
        },
        breakpoints: {
            "(min-width: 768px)": {
                slides: { perView: 2, spacing: 24 },
            },
            "(min-width: 1280px)": {
                slides: { perView: 3, spacing: 32 },
            },
        },
    });
    return (

        <div ref={sliderRef} className="keen-slider">
            {/* Slide 1 */}
            <div className="keen-slider__slide">
                <CardComponent
                    title="For National Security"
                    description="Respond fast. Shadow threats. Extend reach across orbital regimes."
                    list={[
                        "Cislunar logistics & tactical mobility",
                        "Rapid-response capabilities",
                        "Space Domain Awareness (SDA)",
                    ]}
                    image="https://cdn.prod.website-files.com/67f63bba45bedf535e3bc4c4/681b12286dceaa7c0ab43a4d_card%202%20%E2%80%93%20science%20%2B%20exp.avif"
                />
            </div>

            {/* Slide 2 */}
            <div className="keen-slider__slide">
                <CardComponent
                    title="Science & Exploration"
                    description="Deliver payloads. Hit tighter timelines. Push deeper into space."
                    list={[
                        "Low-cost lunar insertion",
                        "Experimental platform deliver",
                        "Sustainable mission architectures",
                    ]}
                    video="https://player.vimeo.com/progressive_redirect/playback/1093082316/rendition/1080p/file.mp4?loc=external&signature=23bbc392b7db6c1d83bad6f156dcb7250a67ebe3d1651645d154004fecf94566"
                    image="https://cdn.prod.website-files.com/67f63bba45bedf535e3bc4c4/681b1228bf753dff85a66ae3_card%203%20%E2%80%93%20science%20%2B%20exp.avif"
                />
            </div>

            {/* Slide 3 */}
            <div className="keen-slider__slide">
                <CardComponent
                    title="Commercial Applications"
                    description="Enable next-gen space economy with transport and logistics."
                    list={[
                        "Orbital transport services",
                        "Commercial outpost support",
                        "Scalable fleet architecture",
                    ]}
                    image="https://via.placeholder.com/588x743"
                    video="https://player.vimeo.com/progressive_redirect/playback/1093082338/rendition/1080p/file.mp4?loc=external&signature=b548635fa4c57a45cbaf80bce3d4825b6e310b5245e2d97691f7ffe9cdcfbf4a"
                />
            </div>
        </div>

    )
}


type CardProps = {
    title: string;
    description: string;
    list: string[];
    image?: string;
    video?: string;
};

export function CardComponent({
    title,
    description,
    list,
    image,
    video,
}: CardProps) {
    return (
        <div
            className="
        aspect-[588/743] sm:aspect-[4/5] md:aspect-[3/4]
        bg-gray-800 text-gray-50 
        select-none h-full flex relative overflow-hidden
        px-4 sm:px-6 md:px-7
        pt-4 sm:pt-5 md:pt-6
        pb-4 sm:pb-6 md:pb-7
        rounded-2xl shadow-lg
      "
        >
            {/* Content */}
            <div className="z-[2] whitespace-pre-wrap flex flex-col justify-between items-start w-full relative">
                <h3 className="h3 font-semibold text-lg sm:text-xl md:text-2xl">
                    {title}
                </h3>

                <div className="mt-4">
                    <p className="p text-sm sm:text-base md:text-lg text-white">{description}</p>
                    <ul role="list" className="mt-5 pl-5 list-disc space-y-2">
                        {list.map((item, index) => (
                            <li className="p text-sm sm:text-base text-white" key={index}>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Background Media */}
            {image && (
                <img
                    src={image}
                    alt={title}
                    className="pointer-events-none align-bottom object-cover w-full h-full transition-transform duration-200 absolute inset-0"
                    loading="lazy"
                />
            )}

            {video && (
                <video
                    className="z-[1] pointer-events-none align-bottom object-cover w-full h-full transition-transform duration-200 absolute inset-0"
                    autoPlay
                    loop
                    muted
                    playsInline
                >
                    <source src={video} type="video/mp4" />
                </video>
            )}
        </div>
    );
}
