"use client";

import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GraduationCap, Shield, Users } from "lucide-react";

type Role = "student" | "volunteer" | "admin";

interface UserRoleDropdownProps {
  currentRole: Role;
  userId: string;
  onRoleChange: (userId: string, newRole: Role) => void;
  disabled?: boolean;
}

const roleConfig: Record<Role, { label: string; badge: string; icon: React.ElementType }> = {
  student: { label: "Student", badge: "bg-blue-600/15 text-blue-400 border-blue-700/30", icon: GraduationCap },
  volunteer: { label: "Volunteer", badge: "bg-amber-600/15 text-amber-400 border-amber-700/30", icon: Users },
  admin: { label: "Admin", badge: "bg-emerald-600/15 text-emerald-400 border-emerald-700/30", icon: Shield },
};

export function RoleBadge({ role }: { role: Role }) {
  const cfg = roleConfig[role];
  return (
    <Badge className={`${cfg.badge} text-xs font-medium gap-1`}>
      <cfg.icon className="h-3 w-3" />
      {cfg.label}
    </Badge>
  );
}

const ROLE_ITEMS = [
  { value: "student", label: "Student" },
  { value: "volunteer", label: "Volunteer" },
  { value: "admin", label: "Admin" },
] as const;

export function UserRoleDropdown({ currentRole, userId, onRoleChange, disabled }: UserRoleDropdownProps) {
  return (
    <Select
      value={currentRole}
      items={ROLE_ITEMS}
      onValueChange={(val) => onRoleChange(userId, val as Role)}
      disabled={disabled}
    >
      <SelectTrigger className="h-8 w-32 text-xs bg-muted/30 border-border/50">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="student">
          <span className="flex items-center gap-2 text-blue-400">
            <GraduationCap className="h-3.5 w-3.5" /> Student
          </span>
        </SelectItem>
        <SelectItem value="volunteer">
          <span className="flex items-center gap-2 text-amber-400">
            <Users className="h-3.5 w-3.5" /> Volunteer
          </span>
        </SelectItem>
        <SelectItem value="admin">
          <span className="flex items-center gap-2 text-emerald-400">
            <Shield className="h-3.5 w-3.5" /> Admin
          </span>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
