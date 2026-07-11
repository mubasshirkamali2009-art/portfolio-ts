"use client"

import * as motion from "motion/react-client"
import type { Variants } from "motion/react"
import Image from "next/image"
import { 
  SiReact, 
  SiNodedotjs, 
  SiExpress, 
  SiTypescript, 
  SiMongodb, 
  SiStripe 
} from "react-icons/si"
import { MdVerifiedUser } from "react-icons/md"

export default function AboutPage() {
  return (
    <section className="min-h-screen bg-[#030712] text-white py-16 px-4 md:px-8 overflow-hidden">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Side (Sticky Info Column): Avatar & Professional Details */}
        <div className="lg:col-span-6 space-y-8 lg:sticky lg:top-8">
          
          {/* Main Avatar: Cream Color Shirt Photo */}
          <div className="relative w-full max-w-[400px] h-[400px] rounded-2xl overflow-hidden border border-gray-800 shadow-2xl mx-auto lg:mx-0">
            <Image 
              src="/avatar-cream-shirt.jpeg" // আপনার মেইন ক্রিম কালার শার্টের পিকচারটি public/ ফোল্ডারে এই নামে রাখুন
              alt="Mubasshir Rohman Kamali" 
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="space-y-3 text-center lg:text-left">
            <p className="text-red-500 font-semibold tracking-wider uppercase text-sm">
              MERN Stack Developer
            </p>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
              Mubasshir Rohman Kamali
            </h1>
            <p className="text-gray-400 text-base md:text-lg max-w-xl">
              17-Year-Old Full-Stack Engineer from Sylhet building scalable web apps with Next.js & Node.js.
            </p>
          </div>

          <div className="border-t border-gray-800 my-4" />

          {/* Bio Text for Lifestyle and Gym */}
          <div className="bg-[#0d1117] p-5 rounded-xl border border-gray-800 space-y-2">
            <h3 className="text-red-500 font-bold text-sm uppercase tracking-wider">Fitness & Lifestyle</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              আমি নিজেকে ফিট এবং হেলদি রাখতে অনেক পছন্দ করি। জিম ও রেগুলার ওয়ার্কআউট আমার লাইফস্টাইলের একটি অন্যতম অংশ। 
              এর পাশাপাশি আমি স্বাধীনভাবে নতুন নতুন জায়গায় ট্রাভেল করতে খুব ভালোবাসি।
            </p>
          </div>

          {/* Personal Info Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-300">
            <div>
              <span className="text-gray-500 block">Born</span>
              <strong>29 March 2009</strong>
            </div>
            <div>
              <span className="text-gray-500 block">Contact</span>
              <strong>01328287689</strong>
            </div>
            <div>
              <span className="text-gray-500 block">Education</span>
              <strong>Shahjalal Uposhahar, Sylhet (SSC 2026)</strong>
            </div>
            <div>
              <span className="text-gray-500 block">Hometown</span>
              <strong>Shaharpara, Jagannathpur, Sunamganj, Sylhet</strong>
            </div>
            <div>
              <span className="text-gray-500 block">Parents</span>
              <strong>Mijanur Rohman Kamalee & Nurjahan Begum</strong>
            </div>
            <div>
              <span className="text-gray-500 block">Email</span>
              <strong className="break-all">mubasshirpov@gmail.com</strong>
            </div>
          </div>

          {/* Profile Action Buttons */}
          <div className="pt-2 flex flex-wrap gap-4 justify-center lg:justify-start">
            <a 
              href="mailto:mubasshirpov@gmail.com" 
              className="bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-2.5 rounded-lg transition-colors text-center w-full sm:w-auto"
            >
              Email Me
            </a>
            <a 
              href="https://www.linkedin.com/in/mubasshir-rohman" 
              target="_blank" 
              rel="noreferrer"
              className="border border-gray-700 hover:border-gray-500 text-gray-300 px-6 py-2.5 rounded-lg transition-colors text-center w-full sm:w-auto"
            >
              LinkedIn Profile
            </a>
          </div>
        </div>

        {/* Right Side: Your Requested Framer Motion Card Animation Setup */}
        <div className="lg:col-span-6 flex flex-col items-center w-full pt-12 lg:pt-0">
          <div className="text-center mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-200">Core Tech Stacks</h2>
            <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Scroll down to view animations</p>
          </div>

          <div style={container} className="w-full max-w-[340px] md:max-w-[420px]">
            {techStackData.map(([IconComponent, label, hueA, hueB], i) => (
              <Card 
                key={label} 
                i={i} 
                icon={IconComponent} 
                label={label} 
                hueA={hueA} 
                hueB={hueB} 
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}

interface CardProps {
  icon: React.ComponentType<any>
  label: string
  hueA: number
  hueB: number
  i: number
}

function Card({ icon: Icon, label, hueA, hueB, i }: CardProps) {
  const background = `linear-gradient(306deg, ${hue(hueA)}, ${hue(hueB)})`

  return (
    <motion.div
      className={`card-container-${i}`}
      style={cardContainer}
      initial="offscreen"
      whileInView="onscreen"
      viewport={{ amount: 0.8, once: false }}
    >
      {/* Dynamic Colored Splash Shape */}
      <div style={{ ...splash, background }} className="opacity-60 group-hover:opacity-80 transition-opacity" />
      
      {/* Scroll Triggered Card Structure */}
      <motion.div style={card} variants={cardVariants} className="card bg-[#0d1117] border border-gray-800 text-white flex-col justify-between p-8">
        <div className="w-full flex justify-between items-center text-xs font-mono text-gray-500">
          <span>MERN STACK</span>
          <span>0{i + 1}</span>
        </div>
        
        {/* Rendered Technology Icon logo inside the card */}
        <div className="text-7xl md:text-8xl my-auto py-4 flex items-center justify-center">
          <Icon />
        </div>
        
        <div className="text-center w-full space-y-1">
          <h4 className="text-lg font-bold tracking-wide">{label}</h4>
          <p className="text-xs text-gray-400">Production Ready Architecture</p>
        </div>
      </motion.div>
    </motion.div>
  )
}

// Framer Motion Animation Logic provided by you
const cardVariants: Variants = {
  offscreen: {
    y: 300,
  },
  onscreen: {
    y: 50,
    rotate: -10,
    transition: {
      type: "spring",
      bounce: 0.4,
      duration: 0.8,
    },
  },
}

const hue = (h: number) => `hsl(${h}, 100%, 50%)`

/**
 * ==============   Styles   ================
 */
const container: React.CSSProperties = {
  margin: "0 auto",
  paddingBottom: 120,
  width: "100%",
}

const cardContainer: React.CSSProperties = {
  overflow: "hidden",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  position: "relative",
  paddingTop: 40,
  marginBottom: -80,
}

const splash: React.CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  clipPath: `path("M 0 303.5 C 0 292.454 8.995 285.101 20 283.5 L 460 219.5 C 470.085 218.033 480 228.454 480 239.5 L 500 430 C 500 441.046 491.046 450 480 450 L 20 450 C 8.954 450 0 441.046 0 430 Z")`,
}

const card: React.CSSProperties = {
  width: 300,
  height: 400,
  display: "flex",
  borderRadius: 20,
  boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
  transformOrigin: "10% 60%",
}

/**
 * ==============   MERN Data & Hues   ================
 */
const techStackData: [React.ComponentType<any>, string, number, number][] = [
  [SiTypescript, "TypeScript", 210, 240],
  [SiReact, "React / Next.js", 190, 210],
  [SiNodedotjs, "Node.js Engine", 120, 150],
  [SiExpress, "Express.js", 340, 20],
  [SiMongodb, "MongoDB Cluster", 140, 170],
  [MdVerifiedUser, "Better Auth Secure", 270, 310],
  [SiStripe, "Stripe Payments", 240, 260],
]