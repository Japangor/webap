import { Section } from "@/components/core/section/Section";
import { SectionHeader } from "@/components/core/section/SectionHeader";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQs() {
  return (
    <div className="max-w-4xl mx-auto">
      <Section size="md">
        <SectionHeader
          title={
            <>
              Sarkari Yojnaon <br />
              se judi aam sawalon ke jawab...
            </>
          }
        />
        <Accordion
          type="single"
          collapsible
          className="w-full max-w-2xl mx-auto"
        >
          <AccordionItem
            value="item-1"
            className="mb-2 border rounded-lg bg-gradient-to-br from-background to-foreground/10 border-border/20 backdrop-blur-sm"
          >
            <AccordionTrigger className="p-4 text-left text-white text-balance">
              Kaise main sarkari yojnaon ka labh utha sakta hoon?
            </AccordionTrigger>
            <AccordionContent className="px-4 text-base">
              Sarkari yojnaon ka labh uthane ke liye, apne area ke concerned government department ya online portal par visit karein aur eligibility criteria ke mutabik apply karein.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem
            value="item-2"
            className="mb-2 border rounded-lg bg-gradient-to-br from-background to-foreground/10 border-border/20 backdrop-blur-sm"
          >
            <AccordionTrigger className="p-4 text-left text-white text-balance">
              Kya sarkari yojnaon ka labh lene ke liye koi registration ki zaroorat hai?
            </AccordionTrigger>
            <AccordionContent className="px-4 text-base">
              Haan, kuch sarkari yojnaon ke liye registration ki zaroorat hoti hai. Aapko apne area ke government office ya online portal par jakar registration process complete karna hoga.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem
            value="item-3"
            className="mb-2 border rounded-lg bg-gradient-to-br from-background to-foreground/10 border-border/20 backdrop-blur-sm"
          >
            <AccordionTrigger className="p-4 text-left text-white text-balance">
              Kya sarkari yojnaon ka labh uthane ke liye koi documents ki zaroorat hai?
            </AccordionTrigger>
            <AccordionContent className="px-4 text-base">
              Haan, sarkari yojnaon ka labh uthane ke liye aapko kuch documents ki zaroorat ho sakti hai jaise income certificate, Aadhar card, bank account details, aur anya zaroori documents.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem
            value="item-4"
            className="mb-2 border rounded-lg bg-gradient-to-br from-background to-foreground/10 border-border/20 backdrop-blur-sm"
          >
            <AccordionTrigger className="p-4 text-left text-white text-balance">
              Kya main sarkari yojnaon ke updates aur notifications ke liye subscribe kar sakta hoon?
            </AccordionTrigger>
            <AccordionContent className="px-4 text-base">
              Haan, aap apne email ya phone number ke through sarkari yojnaon ke updates aur notifications ke liye subscribe kar sakte hain. Iske liye concerned government department ya online portal par visit karein.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Section>
    </div>
  );
}
