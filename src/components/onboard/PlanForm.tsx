import { useState } from "react";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/onboard/switch";
import FormWrapper from "./FormWrapper";
import { FormItems } from "@/app/[locale]/(site)/onboard/page";

type stepProps = FormItems & {
  updateForm: (fieldToUpdate: Partial<FormItems>) => void;
};

type Plan = "basic" | "pro" | "premium" | "free";

const PlanForm = ({ updateForm, plan, yearly }: stepProps) => {
  const [yearlyUpdated, setYearlyUpdated] = useState(yearly);
  const [planSelected, setPlanSelected] = useState<"Free" | "advanced" | "pro" | "basic">("Free");

  const handleCheckedChange = (yearlyUpdated: boolean) => {
    setYearlyUpdated(yearlyUpdated);
    updateForm({ yearly: yearlyUpdated });
  };

  const handleValueChange = (planSelected: "Free" | "advanced" | "pro" | "basic") => {
    if (planSelected) {
      setPlanSelected(planSelected);
    }
  };

  return (
    <FormWrapper
      title="Select your plan"
      description="You have the option of monthly or yearly billing."
    >
      <ToggleGroup.Root
        orientation="horizontal"
        className="flex flex-col gap-3 my-2 md:flex-row md:items-center md:justify-between md:gap-0"
        type="single"
        value={planSelected}
        onValueChange={handleValueChange}
      >
        <ToggleGroup.Item
          value="basic"
          className="border border-neutral-600 flex items-start gap-3 p-3 h-24 rounded-md aspect-square data-[state=on]:border-[#77f6aa] data-[state=on]:bg-neutral-900 focus:border-[#77f6aa] outline-none hover:border-[#77f6aa] md:h-44 md:w-[30%] md:flex-col md:justify-between md:gap-0"
        >
          <div className="relative -top-1 flex flex-col items-start md:top-0">
            <p className="text-white font-semibold">Basic</p>
            <p className="text-sm">{yearly ? "$50/yr" : "$5/mo"}</p>
            {yearly && (
              <span className="text-white text-sm">2 months free</span>
            )}
          </div>
        </ToggleGroup.Item>
        <ToggleGroup.Item
          value="pro"
          className="border border-neutral-600 flex items-start gap-3 p-3 h-24 rounded-md aspect-square data-[state=on]:border-[#77f6aa] data-[state=on]:bg-neutral-900 focus:border-[#77f6aa] outline-none hover:border-[#77f6aa] md:h-44 md:w-[30%] md:flex-col md:justify-between md:gap-0"
        >
          <div className="relative -top-1 flex flex-col items-start md:top-0">
            <p className="text-white font-semibold">Pro</p>
            <p className="text-sm">{yearly ? "$100/yr" : "$10/mo"}</p>
            {yearly && (
              <span className="text-white text-sm">2 months free</span>
            )}
          </div>
        </ToggleGroup.Item>
        <ToggleGroup.Item
          value="premium"
          className="border border-neutral-600 flex items-start gap-3 p-3 h-24 rounded-md aspect-square data-[state=on]:border-[#77f6aa] data-[state=on]:bg-neutral-900 focus:border-[#77f6aa] outline-none hover:border-[#77f6aa] md:h-44 md:w-[30%] md:flex-col md:justify-between md:gap-0"
        >
          <div className="relative -top-1 flex flex-col items-start md:top-0">
            <p className="text-white font-semibold">Premium</p>
            <p className="text-sm">{yearly ? "$150/yr" : "$15/mo"}</p>
            {yearly && (
              <span className="text-white text-sm">2 months free</span>
            )}
          </div>
        </ToggleGroup.Item>
        <ToggleGroup.Item
          value="free"
          className="border border-neutral-600 flex items-start gap-3 p-3 h-24 rounded-md aspect-square data-[state=on]:border-[#77f6aa] data-[state=on]:bg-neutral-900 focus:border-[#77f6aa] outline-none hover:border-[#77f6aa] md:h-44 md:w-[30%] md:flex-col md:justify-between md:gap-0"
        >
          <div className="relative -top-1 flex flex-col items-start md:top-0">
            <p className="text-white font-semibold">Free</p>
            <p className="text-sm">N/A</p>
            {yearly && <span className="text-white text-sm">N/A</span>}
          </div>
        </ToggleGroup.Item>
      </ToggleGroup.Root>
      <div className="w-full flex items-center justify-center bg-neutral-900 p-3 rounded-md">
        <div className="flex items-center gap-6">
          <Label
            htmlFor="airplane-mode"
            className={yearly ? "" : "text-[#77f6aa]"}
          >
            Monthly
          </Label>
          <Switch
            id="airplane-mode"
            checked={yearlyUpdated}
            onCheckedChange={handleCheckedChange}
          />
          <Label
            htmlFor="airplane-mode"
            className={yearly ? "text-[#77f6aa]" : ""}
          >
            Yearly
          </Label>
        </div>
      </div>
    </FormWrapper>
  );
};

export default PlanForm;
