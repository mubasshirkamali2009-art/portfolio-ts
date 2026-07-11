import CVSection from "@/components/CoverLettar";
import DeveloperLife from "@/components/DepolopersLife";
import FeaturedProjects from "@/components/FututreProjects";
import Hero from "@/components/HeroSection";
import MyJourney from "@/components/MyJourny";
import SkillsSection from "@/components/Skills";
import StatsSection from "@/components/Stats";


export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <Hero/>
 <FeaturedProjects/>
 <SkillsSection></SkillsSection>
 <StatsSection></StatsSection>
 <MyJourney></MyJourney>
 <DeveloperLife></DeveloperLife>
 <CVSection></CVSection>
    </div>
  );
}
