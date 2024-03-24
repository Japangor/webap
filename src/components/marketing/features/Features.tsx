import { SectionHeader } from "@/components/core/section/SectionHeader";
import { Section } from "@/components/core/section/Section";
import Pill from "@/components/core/pill/Pill";

import { Car, Settings, Map, TruckIcon, CalendarCheck2Icon, UserCheck2Icon, DatabaseBackupIcon, MapIcon } from "lucide-react";
import Logo from "@/components/core/brand/Logo";

export default function Features() {
  return (
    <Section size="md">
      <SectionHeader
        title={
          <>
            सरकारी योजनाओं और जन सहायक सुविधाओं से लाभ उठाएं
            <br />
            Benefit from Government Schemes and Public Welfare Features
          </>
        }
      />
      <div className="grid max-w-3xl grid-cols-1 gap-6 mx-auto sm:grid-cols-3">
        <div className="flex flex-col items-center justify-center gap-2">
          <Pill>
            <DatabaseBackupIcon className="h-4 text-violet-400" />
            <b className="text-white font-poppins">सरकारी योजनाओं की सूची</b>
            <br />
            <b className="text-white font-poppins">List of Government Schemes</b>
          </Pill>
          <Pill>
            <MapIcon className="h-4 text-violet-400" />
            <b className="text-white font-poppins">नजदीकी सरकारी ऑफिसों का मार्गदर्शन</b>
            <br />
            <b className="text-white font-poppins">Guidance to Nearby Government Offices</b>
          </Pill>
          <Pill>
            <TruckIcon className="h-4 text-violet-400" />
            <b className="text-white font-poppins">सार्वजनिक परिवहन की सुविधाएं</b>
            <br />
            <b className="text-white font-poppins">Public Transportation Facilities</b>
          </Pill>
          <Pill>
            <CalendarCheck2Icon className="h-4 text-violet-400" />
            <b className="text-white font-poppins">योजना की अंतिम तिथि और आवेदन प्रक्रिया</b>
            <br />
            <b className="text-white font-poppins">Scheme Deadline and Application Process</b>
          </Pill>
          <Pill>
            <UserCheck2Icon className="h-4 text-violet-400" />
            <b className="text-white font-poppins">योजना के लाभ की पात्रता की जांच</b>
            <br />
            <b className="text-white font-poppins">Check Eligibility for Scheme Benefits</b>
          </Pill>
        </div>
        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center justify-center w-[178px] h-[178px] rounded-full bg-transparent border-2 border-border/60 backdrop-blur-sm shadow-[0_0_80px_0_theme(colors.indigo.500/20%)]">
          </div>
        </div>
        <div className="flex flex-col items-center justify-center gap-2">
          <Pill>
            <b className="text-white font-poppins">आवास योजनाओं की जानकारी</b>
            <br />
            <b className="text-white font-poppins">Information on Housing Schemes</b>
          </Pill>
          <Pill>
            <Settings className="h-4 text-violet-400" />
            <b className="text-white font-poppins">सरकारी योजनाओं के लिए आवेदन करें</b>
            <br />
            <b className="text-white font-poppins">Apply for Government Schemes</b>
          </Pill>
          <Pill>
            <Car className="h-4 text-violet-400" />
            <b className="text-white font-poppins">स्वास्थ्य सुविधाओं की जानकारी</b>
            <br />
            <b className="text-white font-poppins">Information on Health Facilities</b>
          </Pill>
          <Pill>
            <div className="text-violet-400">कानूनी सहायता</div>
            <b className="text-white font-poppins">निःशुल्क कानूनी सलाह</b>
            <br />
            <b className="text-white font-poppins">Free Legal Advice</b>
          </Pill>
        </div>
      </div>
    </Section>
  );
}
