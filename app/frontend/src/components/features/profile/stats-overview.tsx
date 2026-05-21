import { User } from "@/types/user";
import { GraduationCap, FileText, BookOpen, Award } from "lucide-react";

interface StatsOverviewProps {
  user: User;
}

export function StatsOverview({ user }: StatsOverviewProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="text-center p-4 flex flex-col justify-center rounded-xl bg-emerald-900/10 border border-emerald-700/20 shadow-sm hover:shadow-md transition-shadow">
        <GraduationCap className="h-6 w-6 mx-auto text-emerald-500 mb-3" />
        <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">CGPA</p>
        <p className="text-3xl font-bold text-emerald-400 mt-2">{user.cgpa ?? "–"}</p>
      </div>
      
      <div className="text-center p-4 flex flex-col justify-center rounded-xl bg-card border border-border/50 shadow-sm hover:shadow-md transition-shadow">
        <BookOpen className="h-6 w-6 mx-auto text-muted-foreground/60 mb-3" />
        <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">12th %</p>
        <p className="text-3xl font-bold mt-2">{user.twelfth_percentage ?? "–"}</p>
      </div>
      
      <div className="text-center p-4 flex flex-col justify-center rounded-xl bg-card border border-border/50 shadow-sm hover:shadow-md transition-shadow">
        <Award className="h-6 w-6 mx-auto text-muted-foreground/60 mb-3" />
        <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">10th %</p>
        <p className="text-3xl font-bold mt-2">{user.tenth_percentage ?? "–"}</p>
      </div>

      <div className={`text-center p-4 flex flex-col justify-center rounded-xl shadow-sm hover:shadow-md transition-shadow border ${user.resume_url ? 'bg-blue-900/10 border-blue-700/20' : 'bg-card border-border/50'}`}>
        <FileText className={`h-6 w-6 mx-auto mb-3 ${user.resume_url ? 'text-blue-500' : 'text-muted-foreground/60'}`} />
        <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Resume</p>
        <p className={`text-xl font-bold mt-2 ${user.resume_url ? 'text-blue-400' : 'text-muted-foreground'}`}>
          {user.resume_url ? "Uploaded" : "Missing"}
        </p>
      </div>
    </div>
  );
}
