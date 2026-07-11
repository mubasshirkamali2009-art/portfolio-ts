import FeaturedProjects from "@/components/FututreProjects";
import Hero from "@/components/HeroSection";
import SkillsSection from "@/components/Skills";


export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <Hero/>
 <FeaturedProjects/>
 <SkillsSection></SkillsSection>
    </div>
  );
}
