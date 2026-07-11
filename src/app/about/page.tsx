"use client"

import * as motion from "motion/react-client"
import type { Variants } from "motion/react"
import Image from "next/image"
import Link from "next/link"

// Correct relative imports for images in /public folder
import techImage from "../../resourece/just-fun-pic-apiderman-filter.jpeg"
import gymImage from "../../resourece/gym.jpeg"
import rooftopImage from "../../resourece/rooftop-restorent.jpeg"
import travelImage from "../../resourece/relaxing-on-dextop-chair.jpeg"
import prof from "../../resourece/prof.jpg"

interface CardProps {
  imgSrc: any;
  caption: string;
  hueA: number;
  hueB: number;
  i: number;
}

export default function AboutPage() {
  return (
    <section className="min-h-screen bg-[#020617] text-slate-100 py-16 px-4 md:px-8 overflow-hidden selection:bg-blue-500/30">
      <div className="max-w-6xl mx-auto space-y-24">
        
        {/* Intro Section / Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center border-b border-blue-950/60 pb-16">
          <div className="lg:col-span-7 space-y-6 order-2 lg:order-1">
            <div className="space-y-2">
              <p className="text-blue-500 font-semibold tracking-wider uppercase text-xs md:text-sm">
                MERN Stack Developer
              </p>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-white via-blue-100 to-blue-500 bg-clip-text text-transparent">
                Mubasshir Rohman Kamali
              </h1>
              <p className="text-slate-400 text-lg md:text-xl">
                17-Year-Old Full-Stack Engineer focused on building fast, production-ready web architectures.
              </p>
            </div>

            {/* Personal Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-300 pt-2">
              <div><span className="text-blue-400/60 block font-mono text-xs uppercase">Born</span><strong>29 March 2009</strong></div>
              <div><span className="text-blue-400/60 block font-mono text-xs uppercase">Contact</span><strong>01328287689</strong></div>
              <div><span className="text-blue-400/60 block font-mono text-xs uppercase">Education</span><strong>Shahjalal Uposhahar, Sylhet (SSC 2026)</strong></div>
              <div><span className="text-blue-400/60 block font-mono text-xs uppercase">Hometown</span><strong>Shaharpara, Sunamganj, Sylhet</strong></div>
              <div><span className="text-blue-400/60 block font-mono text-xs uppercase">Parents</span><strong>Mijanur Rohman Kamalee & Nurjahan Begum</strong></div>
              <div><span className="text-blue-400/60 block font-mono text-xs uppercase">Email</span><strong className="break-all text-blue-300">mubasshirpov@gmail.com</strong></div>
            </div>

            <div className="pt-2 flex flex-wrap gap-4">
              <Link href="https://github.com/mubasshirkamali2009-art" className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-500/20 text-center w-full sm:w-auto">
                Github
              </Link>
              <Link href="https://www.linkedin.com/in/mubasshir-rohman" target="_blank" rel="noreferrer" className="border border-blue-900/60 hover:border-blue-500 bg-blue-950/30 hover:bg-blue-950/60 text-blue-300 px-6 py-2.5 rounded-xl transition-all text-center w-full sm:w-auto">
                LinkedIn Profile
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center order-1 lg:order-2">
            <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-2 border-blue-500/30 shadow-[0_0_50px_rgba(59,130,246,0.15)] bg-slate-900">
              <Image 
                src={prof}
                alt="Mubasshir Rohman Kamali" 
                fill 
                className="object-cover scale-105 transform origin-top"
                priority
              />
            </div>
          </div>
        </div>

        {/* Scroll Triggered Alternating Visual Story Section */}
        <div className="space-y-32 py-12">
          {portfolioStories.map((item, i) => {
            const isEven = i % 2 === 0;
            return (
              <div 
                key={i} 
                className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12 justify-between`}
              >
                {/* Image Container (Always 1st on mobile due to flex ordering logic) */}
                <div className="w-full lg:w-1/2 flex justify-center items-center order-1">
                  <div style={container} className="!my-0">
                    <Card 
                      i={i} 
                      imgSrc={item.imgSrc} 
                      caption={item.title} 
                      hueA={item.hueA} 
                      hueB={item.hueB} 
                    />
                  </div>
                </div>

                {/* Narrative Text Container (Always 2nd on mobile due to flex ordering logic) */}
                <div className="w-full lg:w-1/2 space-y-4 max-w-xl order-2">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs bg-blue-950 text-blue-400 border border-blue-900/50 px-2.5 py-1 rounded-md">
                      STORY 0{i + 1}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-widest text-blue-400 font-mono">
                      {item.tag}
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight text-white">
                    {item.title}
                  </h2>
                  <p className="text-slate-400 text-sm md:text-base leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  )
}

function Card({ imgSrc, caption, hueA, hueB, i }: CardProps) {
  const background = `linear-gradient(306deg, ${hue(hueA)}, ${hue(hueB)})`

  return (
    <motion.div
      className={`card-container-${i}`}
      style={cardContainer}
      initial="offscreen"
      whileInView="onscreen"
      viewport={{ amount: 0.3 }}
    >
      <div style={{ ...splash, background }} className="opacity-25 mix-blend-screen" />
      
      <motion.div style={card} variants={cardVariants} className="card relative group overflow-hidden bg-[#090d16] border border-blue-900/40 rounded-[24px]">
        <Image 
          src={imgSrc} 
          alt={caption} 
          fill 
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent flex flex-col justify-end p-6 md:p-8">
          <span className="text-xs font-mono text-blue-400">0{i + 1}</span>
          <h4 className="text-base font-bold tracking-wide text-slate-200 mt-1 uppercase">{caption}</h4>
        </div>
      </motion.div>
    </motion.div>
  )
}

const cardVariants: Variants = {
  offscreen: { y: 150, opacity: 0 },
  onscreen: {
    y: 0,
    opacity: 1,
    rotate: -4,
    transition: {
      type: "spring",
      bounce: 0.3,
      duration: 0.8,
    },
  },
}

const hue = (h: number) => `hsl(${h}, 100%, 35%)`

const container: React.CSSProperties = {
  maxWidth: 480,
  width: "100%",
  position: "relative"
}

const cardContainer: React.CSSProperties = {
  overflow: "hidden",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  position: "relative",
  paddingTop: 20,
  paddingBottom: 20,
}

const splash: React.CSSProperties = {
  position: "absolute",
  top: -10,
  left: -20,
  right: -20,
  bottom: -10,
  clipPath: `path("M 0 320 C 0 300 10 280 25 280 L 480 210 C 495 205 510 220 510 235 L 530 450 C 530 470 515 480 500 480 L 25 480 C 10 480 0 470 0 450 Z")`,
}

const card: React.CSSProperties = {
  width: 340,   
  height: 460,  
  display: "flex",
  boxShadow: "0 40px 80px rgba(0,0,0,0.7), 0 0 50px rgba(59, 130, 246, 0.1)",
  transformOrigin: "15% 70%",
}

const portfolioStories = [
  {
    imgSrc: techImage,
    tag: "Identity & Focus",
    title: "The Tech & Clean Aesthetic",
    description:
      "A clean and focused portrait representing my identity as a MERN Stack developer. It reflects professionalism, structured thinking, and the mindset I bring to building scalable web applications.",
    hueA: 200,
    hueB: 220,
  },
  {
    imgSrc: gymImage,
    tag: "Fitness Lifestyle",
    title: "Gym & Strength Discipline",
    description:
      "Regular gym training keeps me disciplined, mentally resilient, and consistent. The same persistence I apply in fitness helps me tackle challenging software engineering problems.",
    hueA: 215,
    hueB: 235,
  },
  {
    imgSrc: rooftopImage,
    tag: "Workspace & Mindset",
    title: "Rooftop ",
    description:
      "2024 jan 3  ",
    hueA: 230,
    hueB: 250,
  },
  {
    imgSrc: travelImage,
    tag: "Exploration",
    title: "Learning Beyond Screens",
    description:
      "Exploring different places and environments broadens my perspective. Every new experience improves adaptability, problem-solving, and the confidence to work independently.",
    hueA: 245,
    hueB: 270,
  },
];