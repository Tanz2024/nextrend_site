"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useCallback, useMemo, useState } from "react";

type Props = {
  image: string;
  projectTitle: string;
  index: number;
  blockText?: string;
  photoAddress?: string;
  isEven: boolean;
};

export default function NarrativeGalleryItem({
  image,
  projectTitle,
  index,
  blockText,
  photoAddress,
  isEven,
}: Props) {
  const [isLoaded, setIsLoaded] = useState(false);
  const handleLoad = useCallback(() => setIsLoaded(true), []);

  const containerVariants = useMemo(
    () => ({
      hidden: { opacity: 0, y: 18, filter: "blur(8px)" },
      visible: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: {
          duration: 0.9,
          ease: [0.19, 1, 0.22, 1],
          delay: index * 0.12,
        },
      },
    }),
    [index]
  );

  const imageVariants = useMemo(
    () => ({
      hidden: { opacity: 0, scale: 0.985, x: 0 },
      visible: {
        opacity: 1,
        scale: 1,
        x: 0,
        transition: {
          duration: 1.05,
          ease: [0.19, 1, 0.22, 1],
          delay: index * 0.12 + 0.05,
        },
      },
    }),
    [index]
  );

  const textVariants = useMemo(
    () => ({
      hidden: { opacity: 0, y: 14, filter: "blur(6px)" },
      visible: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: {
          duration: 0.85,
          ease: [0.19, 1, 0.22, 1],
          delay: index * 0.12 + 0.16,
        },
      },
    }),
    [index]
  );

  // text split (safe + avoids undefined vars)
  const body = (blockText ?? "").trim();
  const bodyFirst = body.slice(0, 1);
  const bodyRest = body.slice(1);

  const addr = (photoAddress ?? "").trim();

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.22 }}
      variants={containerVariants}
      className="space-y-7 sm:space-y-9"
    >
      <div
        className={[
          "grid items-center gap-10",
          "grid-cols-1",
          "lg:grid-cols-[1.15fr_0.85fr] lg:gap-12",
          !isEven ? "lg:grid-flow-dense" : "",
        ].join(" ")}
      >
        {/* IMAGE */}
        <motion.figure
          variants={imageVariants}
          className={[
            "relative",
            "overflow-hidden rounded-2xl",
            "bg-transparent ring-0 shadow-none",
            !isEven ? "lg:col-start-2" : "lg:col-start-1",
          ].join(" ")}
        >
          <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3] overflow-hidden rounded-2xl bg-black">
            {!isLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#F5F2EC] to-[#E8E3D6]">
                <div className="h-9 w-9 animate-spin rounded-full border-2 border-[#C6AA76] border-t-transparent" />
              </div>
            )}

            <Image
              src={image}
              alt={`${projectTitle} image ${index + 1}`}
              fill
              sizes="(min-width:1024px) 50vw, 100vw"
              className="object-cover scale-[1.02]"
              quality={92}
              onLoad={handleLoad}
              priority={index === 0}
            />

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/18 via-transparent to-transparent" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/8" />
          </div>

          {/* PHOTO ADDRESS */}
          {addr ? (
            <figcaption className="pt-10 text-center">
              <p className="uppercase text-[#8A8A8A] font-[300] tracking-[0.18em] sm:tracking-[0.32em] text-[0.64rem] sm:text-[0.72rem] lg:text-[0.80rem]">
                {addr}
              </p>
            </figcaption>
          ) : null}
        </motion.figure>

        {/* TEXT */}
        <motion.div
          variants={textVariants}
          className={[
            "flex items-center justify-center",
            "px-2 sm:px-6 lg:px-0",
            "min-h-[160px] sm:min-h-[220px] lg:min-h-[380px]",
            !isEven ? "lg:col-start-1 lg:pr-10" : "lg:col-start-2 lg:pl-10",
          ].join(" ")}
        >
          {body ? (
            <div className="w-full max-w-[34rem] text-center">
              {/* Desktop: premium drop cap with breathing space for the following text */}
              <p
                className={[
                  "hidden lg:block text-left font-serif tracking-[0.08em]",
                  "text-[1.15rem] xl:text-[1.18rem] 2xl:text-[1.2rem]",
                  "leading-[1.95] text-[#1A1919] font-[300]",
                  "text-pretty antialiased italic",
                ].join(" ")}
              >
                <span
                  className={[
                    "float-left select-none",
                    "font-[600] text-[#141414] tracking-[-0.02em]",
                    "text-[2.45em] xl:text-[2.75em] 2xl:text-[2.95em]",
                    "leading-[0.88]",
                    "mr-5 -mt-1",
                  ].join(" ")}
                >
                  {bodyFirst}
                </span>
                <span className="whitespace-pre-wrap">
                  {bodyRest}
                </span>
              </p>

           
<p
className={[
  "lg:hidden text-left font-serif italic",
 "text-[0.98rem] sm:text-[1.08rem]",
  "leading-[2.05] sm:leading-[2.1]",
   "text-[#161616] font-[300]", 
  // FIX: tracking was too wide for mobile body copy
  "tracking-[0.04em] sm:tracking-[0.045em]",
  "text-balance antialiased",
].join(" ")}

>
<span
  className={[
    "inline-block align-baseline select-none",
    "font-[600] text-[#141414]",
    "tracking-[-0.02em]",
    "text-[1.65em] sm:text-[1.75em]",
    "leading-none",
    "mr-[0.06em]",
    "translate-y-[0.08em] sm:translate-y-[0.06em]",
  ].join(" ")}
>
  {bodyFirst}
</span>

<span className="whitespace-pre-wrap align-baseline">{bodyRest}</span>
</p>

            </div>
          ) : null}
        </motion.div>
      </div>
    </motion.section>
  );
}
