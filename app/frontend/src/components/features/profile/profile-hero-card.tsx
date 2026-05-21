import { User } from "@/types/user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface ProfileHeroCardProps {
  user: User;
}

export function ProfileHeroCard({ user }: ProfileHeroCardProps) {
  const roleBadge = () => {
    if (user.role === "admin") return <Badge className="bg-emerald-600/20 text-emerald-400 border-emerald-700/30">⚡ Admin</Badge>;
    if (user.role === "volunteer") return <Badge className="bg-amber-600/20 text-amber-400 border-amber-700/30">🎯 Volunteer</Badge>;
    return null;
  };

  // Calculate profile completion percentage
  const getCompletionPercentage = () => {
    if (user.role === "admin") return 100; // Admins don't have these details

    const fields = [
      user.cgpa,
      user.tenth_percentage,
      user.twelfth_percentage,
      user.branch,
      user.batch,
      user.resume_url,
      user.phone_number,
      user.linkedin_url,
      user.github_url,
      user.portfolio_url,
      user.personal_email,
    ];
    
    // Core fields (6) + Contact fields (5) = 11 fields
    const filledFields = fields.filter((f) => f !== null && f !== undefined && f !== "").length;
    return Math.round((filledFields / fields.length) * 100);
  };

  const completion = getCompletionPercentage();

  return (
    <div className="rounded-xl bg-gradient-to-br from-emerald-900/40 via-card to-card border border-border/50 p-6 md:p-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
        <Avatar className="h-20 w-20 rounded-xl border border-border/50 shadow-sm">
          {user.avatar_url && <AvatarImage src={user.avatar_url} alt={user.full_name || "User"} className="rounded-xl object-cover" />}
          <AvatarFallback className="h-20 w-20 rounded-xl bg-emerald-600/20 text-emerald-400 text-2xl font-bold">
            {user.full_name ? user.full_name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() : user.email?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold tracking-tight">{user.full_name || user.roll_number || user.email}</h1>
            {roleBadge()}
          </div>
          {user.roll_number && <p className="text-sm font-medium text-muted-foreground mt-1">{user.roll_number}</p>}
          {user.personal_email && <p className="text-sm text-muted-foreground mt-0.5 break-all">{user.personal_email}</p>}
          
          {user.role !== "admin" && (
            <div className="mt-4 max-w-sm">
              <div className="flex justify-between text-xs font-medium mb-1.5">
                <span className="text-muted-foreground">Profile Completion</span>
                <span className={completion === 100 ? "text-emerald-400" : "text-emerald-500"}>{completion}%</span>
              </div>
              <Progress value={completion} className="h-2 bg-muted/50" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
