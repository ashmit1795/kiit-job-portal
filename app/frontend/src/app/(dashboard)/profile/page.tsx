"use client";

import { useAuth } from "@/providers/auth-provider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, GraduationCap, Link as LinkIcon, FileText } from "lucide-react";
import { ProfileHeroCard } from "@/components/features/profile/profile-hero-card";
import { StatsOverview } from "@/components/features/profile/stats-overview";
import { AcademicEditForm } from "@/components/features/profile/academic-edit-form";
import { ContactEditForm } from "@/components/features/profile/contact-edit-form";
import { ResumeCard } from "@/components/features/profile/resume-card";

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 pb-10">
      <ProfileHeroCard user={user} />

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="bg-muted/30 border border-border/50 mb-6 flex flex-wrap gap-2 h-auto p-1 justify-start">
          <TabsTrigger value="overview" className="gap-2 data-[state=active]:bg-emerald-600/15 data-[state=active]:text-emerald-400">
            <User className="h-4 w-4" />
            Overview
          </TabsTrigger>
          
          {user.role !== "admin" && (
            <TabsTrigger value="academic" className="gap-2 data-[state=active]:bg-emerald-600/15 data-[state=active]:text-emerald-400">
              <GraduationCap className="h-4 w-4" />
              Academic Details
            </TabsTrigger>
          )}

          <TabsTrigger value="contact" className="gap-2 data-[state=active]:bg-emerald-600/15 data-[state=active]:text-emerald-400">
            <LinkIcon className="h-4 w-4" />
            Contact & Links
          </TabsTrigger>

          {user.role !== "admin" && (
            <TabsTrigger value="resume" className="gap-2 data-[state=active]:bg-emerald-600/15 data-[state=active]:text-emerald-400">
              <FileText className="h-4 w-4" />
              Resume
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="overview" className="mt-0 space-y-6">
          {user.role !== "admin" && (
            <>
              <h3 className="text-lg font-semibold mb-4">At a Glance</h3>
              <StatsOverview user={user} />
            </>
          )}
        </TabsContent>

        {user.role !== "admin" && (
          <TabsContent value="academic" className="mt-0">
            <div className="bg-card border border-border/50 rounded-xl p-6 shadow-sm">
              <AcademicEditForm user={user} />
            </div>
          </TabsContent>
        )}

        <TabsContent value="contact" className="mt-0">
          <div className="bg-card border border-border/50 rounded-xl p-6 shadow-sm">
            <ContactEditForm user={user} />
          </div>
        </TabsContent>

        {user.role !== "admin" && (
          <TabsContent value="resume" className="mt-0">
            <div className="bg-card border border-border/50 rounded-xl p-6 shadow-sm">
              <ResumeCard user={user} />
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
