import { Section } from "@/components/core/section/Section";
import { SectionHeader } from "@/components/core/section/SectionHeader";
import Pill from "@/components/core/pill/Pill";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NextintlLogo from "@/components/logos/nextintl";
import { CommandMenu } from "../databases/command-menu";


export default function International() {
  return (
    <div className="max-w-4xl mx-auto">
      <Section size="md">
        <SectionHeader
          title={
            <>
              Explore powerful insights
            </>
          }
        />
        <div className="grid max-w-5xl gap-6 mx-auto md:grid-cols-2">
          <div className="flex order-2 overflow-hidden md:order-1">
            <div className="flex flex-col w-full border rounded-lg bg-gradient-to-b from-slate-800/60 to-card/20 backdrop-blur-sm border-border/20">
             <CommandMenu/>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center order-1 gap-6 md:order-2">
            <div>
              <img src="/logo3.png" alt="Logo" width={100} height={100} />
            </div>
            <div className="flex flex-wrap justify-center gap-3 p-4">
  <Pill>
    <b className="text-white font-poppins">Chart Integration</b>
  </Pill>
  <Pill>
    <b className="text-white font-poppins">Data Visualization</b>
  </Pill>
  <Pill>
    <b className="text-white font-poppins">Vehicle Data Providers</b>
  </Pill>
  <Pill>
    <b className="text-white font-poppins">Map Integration</b>
  </Pill>
  {/* Add more feature pills as needed */}
</div>

          </div>
        </div>
      </Section>
    </div>
  );
}
