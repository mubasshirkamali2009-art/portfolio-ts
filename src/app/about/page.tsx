"use client"

import { useRef, useState, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import type { Variants } from "motion/react"
import Image from "next/image"
import Link from "next/link"

// Relative imports for images from /src/resourece/
import techImage from "../../resourece/just-fun-pic-apiderman-filter.jpeg"
import gymImage from "../../resourece/gym.jpeg"
import rooftopImage from "../../resourece/rooftop-restorent.jpeg"
import travelImage from "../../resourece/relaxing-on-dextop-chair.jpeg"
import prof from "../../resourece/prof.jpg"

import CVSection from "@/components/CoverLettar"

interface CardProps {
  imgSrc: any;
  caption: string;
  hueA: number;
  hueB: number;
  i: number;
}

// Lines for Section 3 Hardware & Engineering animation
const hardwareLines: React.ReactNode[] = [
  <div key="badge" className="flex items-center gap-2">
    <span className="font-mono text-xs bg-blue-950 text-blue-400 border border-blue-900/50 px-2.5 py-1 rounded-md">
      CORE SKILL #2
    </span>
    <span className="text-xs font-bold uppercase tracking-widest text-blue-400 font-mono">
      Hardware & Electronics
    </span>
  </div>,
  <h2 key="title" className="text-2xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
    Practical Hardware Engineering & Device Diagnostics
  </h2>,
  <p key="certification" className="text-slate-200 text-base md:text-xl leading-relaxed">
    Certified by <strong className="text-blue-400">Bangladesh Gov Youth Development</strong> with an <strong className="text-emerald-400">A+ Grade Certification</strong> in Motherboard Architecture & Intermediate Mobile Engineering.
  </p>,
  <p key="projects" className="text-slate-300 text-sm md:text-lg leading-relaxed">
    Since age 15, engineered custom electronic projects like <span className="text-white font-semibold">voltage converters, rechargeable fans, emergency light setups</span>, mastering tools like <span className="text-white font-semibold">soldering irons and multi-meters</span>.
  </p>,
  <p key="repairs" className="text-slate-300 text-sm md:text-lg leading-relaxed">
    Capable of board-level troubleshooting, mechanical keyboard repairs, and precision circuit soldering.
  </p>,
  <div key="tags" className="flex flex-wrap gap-2 pt-1">
    <span className="text-xs font-mono bg-blue-900/40 border border-blue-700/60 text-blue-200 px-3 py-1 rounded-full">Motherboard Diagnostics</span>
    <span className="text-xs font-mono bg-blue-900/40 border border-blue-700/60 text-blue-200 px-3 py-1 rounded-full">Mobile Hardware Repair</span>
    <span className="text-xs font-mono bg-blue-900/40 border border-blue-700/60 text-blue-200 px-3 py-1 rounded-full">Precision Soldering</span>
    <span className="text-xs font-mono bg-blue-900/40 border border-blue-700/60 text-blue-200 px-3 py-1 rounded-full">Circuit Prototyping</span>
  </div>,
]

const LINE_DURATION_MS = 2200

function AnimatedHardwareIntro() {
  const [index, setIndex] = useState(0)
  const [showStatic, setShowStatic] = useState(false)

  useEffect(() => {
    if (showStatic) return

    if (index >= hardwareLines.length - 1) {
      const finalTimer = setTimeout(() => setShowStatic(true), LINE_DURATION_MS)
      return () => clearTimeout(finalTimer)
    }

    const timer = setTimeout(() => setIndex((prev) => prev + 1), LINE_DURATION_MS)
    return () => clearTimeout(timer)
  }, [index, showStatic])

  if (showStatic) {
    return <StaticHardwareContent />
  }

  return (
    <div className="space-y-4">
      <div className="min-h-[140px] md:min-h-[180px] flex items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1.04 }}
            exit={{ opacity: 0, y: -20, scale: 0.96 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="w-full space-y-2 origin-left"
          >
            {hardwareLines[index]}
          </motion.div>
        </AnimatePresence>
      </div>

      <button
        onClick={() => setShowStatic(true)}
        className="text-xs font-mono text-blue-400/80 hover:text-blue-300 border border-blue-900/60 hover:border-blue-500 bg-blue-950/40 px-3 py-1 rounded-lg transition-all cursor-pointer"
      >
        Skip Animation
      </button>
    </div>
  )
}

function StaticHardwareContent() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="font-mono text-xs bg-blue-950 text-blue-400 border border-blue-900/50 px-2.5 py-1 rounded-md">
          CORE SKILL #2
        </span>
        <span className="text-xs font-bold uppercase tracking-widest text-blue-400 font-mono">
          Hardware & Electronics Engineering
        </span>
      </div>

      <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
        Practical Hardware Engineering & Device Diagnostics
      </h2>

      <p className="text-slate-300 text-sm md:text-base leading-relaxed">
        Certified by <strong className="text-blue-400">Bangladesh Gov Youth Development</strong> with an <strong className="text-emerald-400">A+ Grade Certification</strong> in Motherboard Architecture & Intermediate Mobile Engineering.
      </p>

      <div className="space-y-2 text-slate-400 text-sm">
        <p>
          Since age 15, I have actively engineered custom electronic projects like <span className="text-slate-200 font-medium">voltage converters, rechargeable fans, emergency light setups</span>, mastering equipment like <span className="text-slate-200 font-medium">soldering irons and multi-meters</span>.
        </p>
        <p>
          Capable of board-level troubleshooting, repairing mechanical keyboards, and precision circuit soldering.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 pt-1">
        <span className="text-xs font-mono bg-blue-900/30 border border-blue-800/50 text-blue-300 px-3 py-1 rounded-full">Motherboard Diagnostics</span>
        <span className="text-xs font-mono bg-blue-900/30 border border-blue-800/50 text-blue-300 px-3 py-1 rounded-full">Mobile Hardware Repair</span>
        <span className="text-xs font-mono bg-blue-900/30 border border-blue-800/50 text-blue-300 px-3 py-1 rounded-full">Precision Soldering</span>
        <span className="text-xs font-mono bg-blue-900/30 border border-blue-800/50 text-blue-300 px-3 py-1 rounded-full">Circuit Prototyping</span>
      </div>
    </div>
  )
}

export default function AboutPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isMuted, setIsMuted] = useState(true);

  // Auto play/pause video when visible on screen
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.4 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <section className="min-h-screen bg-[#020617] text-slate-100 py-12 px-4 md:px-8 overflow-hidden selection:bg-blue-500/30">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* SECTION 1: Intro / Header (Static Layout) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center border-b border-blue-950/60 pb-12">
          <div className="lg:col-span-7 space-y-6 order-2 lg:order-1">
            <div className="space-y-2">
              <p className="text-blue-500 font-semibold tracking-wider uppercase text-xs md:text-sm">
                MERN Stack Developer & Hardware Innovator
              </p>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-white via-blue-100 to-blue-500 bg-clip-text text-transparent">
                Mubasshir Rohman Kamali
              </h1>
              <p className="text-slate-400 text-lg md:text-xl">
                17-Year-Old Full-Stack Engineer focused on building fast, production-ready web architectures and custom electronics.
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

        {/* SECTION 2: Cover Letter / CV Section */}
        <CVSection />

        {/* SECTION 3: Hardware & Engineering Showcase (Video Left, Animated Content Right, Reduced Height) */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="border border-blue-900/40 bg-slate-950/40 rounded-2xl p-4 md:p-6"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* LEFT SIDE: Bigger Video Player */}
            <div className="lg:col-span-7 relative rounded-xl overflow-hidden border border-blue-900/50 group bg-slate-900 min-h-[300px] md:min-h-[420px] w-full flex items-center justify-center">
              <video
                ref={videoRef}
                src="/v.mp4"
                playsInline
                loop
                muted={isMuted}
                className="w-full h-full object-cover absolute inset-0"
              />
              
              {/* Mute / Unmute Control Button */}
              <button
                onClick={toggleMute}
                className="absolute bottom-3 right-3 bg-slate-950/80 hover:bg-blue-600 text-white text-xs font-mono px-3 py-1.5 rounded-lg border border-blue-500/30 backdrop-blur-md transition-all shadow-md z-10 cursor-pointer"
              >
                {isMuted ? "🔇 Unmute" : "🔊 Mute"}
              </button>
            </div>

            {/* RIGHT SIDE: Animated Hardware Content */}
            <div className="lg:col-span-5">
              <AnimatedHardwareIntro />
            </div>

          </div>
        </motion.div>

        {/* SECTION 4: Scroll Triggered Alternating Visual Story Section */}
        <div className="space-y-24 py-8">
          {portfolioStories.map((item, i) => {
            const isEven = i % 2 === 0;
            return (
              <div 
                key={i} 
                className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-10 justify-between`}
              >
                {/* Image Container */}
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

                {/* Narrative Text Container */}
                <div className="w-full lg:w-1/2 space-y-3 max-w-xl order-2">
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
    title: "Rooftop Workspace",
    description:
      "Captured on Jan 3, 2024. A serene workspace environment that fosters deep work, focus, and strategic problem-solving.",
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