import React from 'react';
import { Section } from '@/components/core/section/Section';
import { SectionHeader } from '@/components/core/section/SectionHeader';
import { CommandMenu } from './command-menu';
import Pill from '@/components/core/pill/Pill';
import { Database, MapPin, Truck, Calendar, UserCheck } from "lucide-react";
import Logo from '@/components/core/brand/Logo';

export default function Databases() {
  return (
    <Section size="md">
      <SectionHeader
        title={
          <>
            सरकारी योजनाएं, एक ही जगह।
          </>
        }
      />
      <div className="grid w-full max-w-4xl gap-6 mx-auto md:grid-cols-2">
        <div className="flex flex-col items-center justify-center gap-6">
          <div>
            {/* Replace the logo URL with your actual logo */}
          </div>
          <div className="flex flex-wrap justify-center gap-3 p-4">
            {/* Example of a government scheme */}
            <Pill>
              <Database className="h-4 text-violet-400" />
              <b className="text-white font-poppins">वाहन डेटा प्रबंधन</b>
            </Pill>
            {/* Add more Pill components for each government scheme */}
          </div>
        </div>
        <div className="flex justify-end">
          {/* Add your website logo component here */}
        </div>
      </div>
      <div className="text-center mt-8 text-sm">
        <p>अब सरकारी योजनाओं के लाभ सीधे अपने मोबाइल पर।</p>
        <p>जानिए कैसे आप भी हो सकते हैं इन योजनाओं का लाभुक्ता।</p>
      </div>
    </Section>
  );
}

