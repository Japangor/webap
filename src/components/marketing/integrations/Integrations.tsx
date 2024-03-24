import GradientText from "@/components/core/gradient-text/GradientText";
import { Section } from "@/components/core/section/Section";
import { SectionHeader } from "@/components/core/section/SectionHeader";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ActivityIcon, BarChart2Icon, Car, DatabaseIcon, GlassWater, SettingsIcon, ShieldIcon } from "lucide-react";

export default function Integrations() {
  return (
    <div className="max-w-6xl mx-auto">
      <Section size="md">
        <SectionHeader
          title={
            <>
              Innovative features for <br />
              societal impact.
            </>
          }
          description={
            <p>
              Empower yourself to make a difference with these integrated features and services.
            </p>
          }
        />
        <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-6">
          <Card className="relative flex overflow-hidden md:grid-cols-1 lg:col-span-2 bg-background/70 backdrop-blur-sm border-border/20">
            <div className="absolute w-[170px] h-[170px] bg-purple-600/30 rounded-full -top-7 -left-7 z-[0] blur-2xl" />
            <div className="rounded-lg bg-gradient-to-br from-blue-600/20 via-indigo-500/10 to-transparent">
              <CardHeader className="relative">
                <BarChart2Icon className="h-14 mb-2 text-white" />
                <CardTitle className="text-white text-md">
                  Community Impact Analytics
                </CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <p>
                  Use advanced analytics to understand community needs and plan impactful projects.
                </p>
              </CardContent>
            </div>
          </Card>

          <Card className="relative flex overflow-hidden md:grid-cols-1 lg:col-span-2 bg-background/70 backdrop-blur-sm border-border/20">
            <div className="absolute w-[170px] h-[170px] bg-purple-600/30 rounded-full -top-7 -left-7 z-[0] blur-2xl" />
            <div className="rounded-lg bg-gradient-to-br from-blue-600/20 via-indigo-500/10 to-transparent">
              <CardHeader className="relative">
                <SettingsIcon className="h-14 mb-2 text-white" />
                <CardTitle className="text-white text-md">
                  Volunteer Matching
                </CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <p>
                  Connect with volunteer opportunities that align with your skills and interests.
                </p>
              </CardContent>
            </div>
          </Card>

          <Card className="relative flex overflow-hidden md:grid-cols-1 lg:col-span-2 bg-background/70 backdrop-blur-sm border-border/20">
            <div className="absolute w-[170px] h-[170px] bg-purple-600/30 rounded-full -top-7 -left-7 z-[0] blur-2xl" />
            <div className="rounded-lg bg-gradient-to-br from-blue-600/20 via-indigo-500/10 to-transparent">
              <CardHeader className="relative">
                <ActivityIcon className="h-14 mb-2 text-white" />
                <CardTitle className="text-white text-md">
                  Community Project Management
                </CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <p>
                  Organize and manage community projects efficiently to drive positive change.
                </p>
              </CardContent>
            </div>
          </Card>

          <Card className="relative flex overflow-hidden md:grid-cols-1 lg:col-span-2 bg-background/70 backdrop-blur-sm border-border/20">
            <div className="absolute w-[170px] h-[170px] bg-purple-600/30 rounded-full -top-7 -left-7 z-[0] blur-2xl" />
            <div className="rounded-lg bg-gradient-to-br from-blue-600/20 via-indigo-500/10 to-transparent">
              <CardHeader className="relative">
                <DatabaseIcon className="h-14 mb-2 text-white" />
                <CardTitle className="text-white text-md">
                  Civic Engagement Platform
                </CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <p>
                  Engage with your community and government for collaborative decision-making.
                </p>
              </CardContent>
            </div>
          </Card>

          <Card className="relative flex overflow-hidden md:grid-cols-1 lg:col-span-2 bg-background/70 backdrop-blur-sm border-border/20">
            <div className="absolute w-[170px] h-[170px] bg-purple-600/30 rounded-full -top-7 -left-7 z-[0] blur-2xl" />
            <div className="rounded-lg bg-gradient-to-br from-blue-600/20 via-indigo-500/10 to-transparent">
              <CardHeader className="relative">
                <ShieldIcon className="h-14 mb-2 text-white" />
                <CardTitle className="text-white text-md">
                  Social Impact Tracking
                </CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <p>
                  Track and measure the impact of your social initiatives on your community.
                </p>
              </CardContent>
            </div>
          </Card>

          <Card className="relative flex overflow-hidden md:grid-cols-1 lg:col-span-2 bg-background/70 backdrop-blur-sm border-border/20">
            <div className="absolute w-[170px] h-[170px] bg-purple-600/30 rounded-full -top-7 -left-7 z-[0] blur-2xl" />
            <div className="rounded-lg bg-gradient-to-br from-blue-600/20 via-indigo-500/10 to-transparent">
              <CardHeader className="relative">
                <SettingsIcon className="h-14 mb-2 text-white" />
                <CardTitle className="text-white text-md">
                  Community Resources Directory
                </CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <p>
                  Access a directory of community resources and services to support your initiatives.
                </p>
              </CardContent>
            </div>
          </Card>

          {/* Add more innovative features for societal impact here */}

        </div>
      </Section>
    </div>
  );
}
