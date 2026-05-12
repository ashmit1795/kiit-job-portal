"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { academicService } from "@/services/academic.service";
import { adminService } from "@/services/admin.service";
import api from "@/lib/api";
import { ApiResponse } from "@/types/api";
import { Program, Branch, Batch } from "@/types/academic";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ConfirmDialog } from "./confirm-dialog";
import { toast } from "sonner";
import { Trash2, Plus, BookOpen, GitBranch, Calendar, Loader2, AlertTriangle } from "lucide-react";

// ── Programs Section ──────────────────────────────────────────────────
function ProgramsSection() {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [level, setLevel] = useState<"UG" | "PG">("UG");
  const [duration, setDuration] = useState("4");
  const [pendingDelete, setPendingDelete] = useState<Program | null>(null);
  const [showForm, setShowForm] = useState(false);

  const { data: programs = [], isLoading } = useQuery({
    queryKey: ["academics", "programs"],
    queryFn: academicService.fetchPrograms,
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const { data } = await api.post<ApiResponse<Program>>("/academics/programs", {
        name,
        level,
        duration_years: parseInt(duration),
      });
      return data.data;
    },
    onSuccess: () => {
      toast.success("Program created");
      queryClient.invalidateQueries({ queryKey: ["academics"] });
      queryClient.invalidateQueries({ queryKey: ["admin"] });
      setName(""); setShowForm(false);
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "Failed to create program"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminService.deleteProgram(id),
    onSuccess: () => {
      toast.success("Program deleted");
      queryClient.invalidateQueries({ queryKey: ["academics"] });
      queryClient.invalidateQueries({ queryKey: ["admin"] });
      setPendingDelete(null);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Cannot delete — branches may depend on it");
      setPendingDelete(null);
    },
  });

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-emerald-400" />
            <CardTitle className="text-base">Programs</CardTitle>
            <Badge className="bg-muted/50 text-muted-foreground border-border/50 text-xs">
              {programs.length}
            </Badge>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="h-7 text-xs border-emerald-700/30 text-emerald-400 hover:bg-emerald-600/10"
            onClick={() => setShowForm(!showForm)}
          >
            <Plus className="h-3.5 w-3.5 mr-1" /> Add
          </Button>
        </div>
        <CardDescription>Degree programs (B.Tech, M.Tech, etc.)</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Add form */}
        {showForm && (
          <div className="p-3 rounded-xl border border-emerald-700/20 bg-emerald-950/10 space-y-3">
            <p className="text-xs font-medium text-emerald-400">New Program</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <Input
                placeholder="Name (e.g. B.Tech)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-muted/30 border-border/50"
              />
              <Select value={level} onValueChange={(v) => setLevel(v as "UG" | "PG")}>
                <SelectTrigger className="bg-muted/30 border-border/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UG">UG</SelectItem>
                  <SelectItem value="PG">PG</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="number"
                placeholder="Duration (years)"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="bg-muted/30 border-border/50"
                min={1} max={6}
              />
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs"
                onClick={() => createMutation.mutate()}
                disabled={!name.trim() || createMutation.isPending}
              >
                {createMutation.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" /> : null}
                Create
              </Button>
              <Button size="sm" variant="ghost" className="text-xs" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* List */}
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-10 rounded-lg bg-muted/30 animate-pulse" />
          ))
        ) : programs.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-4">No programs yet.</p>
        ) : (
          programs.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/10 border border-border/30 hover:bg-muted/20 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="font-medium text-sm">{p.name}</span>
                <Badge className={`text-xs ${p.level === "UG" ? "bg-blue-600/15 text-blue-400 border-blue-700/30" : "bg-purple-600/15 text-purple-400 border-purple-700/30"}`}>
                  {p.level}
                </Badge>
                <span className="text-xs text-muted-foreground">{p.duration_years}y</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-red-400 hover:bg-red-950/20 shrink-0"
                onClick={() => setPendingDelete(p)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))
        )}
      </CardContent>

      <ConfirmDialog
        open={!!pendingDelete}
        onOpenChange={(o) => !o && setPendingDelete(null)}
        title="Delete Program"
        description={`Delete "${pendingDelete?.name}"? All associated branches must be removed first.`}
        confirmLabel="Delete"
        onConfirm={() => pendingDelete && deleteMutation.mutate(pendingDelete.id)}
        loading={deleteMutation.isPending}
        destructive
      />
    </Card>
  );
}

// ── Branches Section ──────────────────────────────────────────────────
function BranchesSection() {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [programId, setProgramId] = useState("");
  const [filterProgram, setFilterProgram] = useState("all");
  const [pendingDelete, setPendingDelete] = useState<Branch | null>(null);
  const [showForm, setShowForm] = useState(false);

  const { data: programs = [] } = useQuery({
    queryKey: ["academics", "programs"],
    queryFn: academicService.fetchPrograms,
  });

  const { data: branches = [], isLoading } = useQuery({
    queryKey: ["academics", "branches", filterProgram],
    queryFn: () => academicService.fetchBranches(filterProgram !== "all" ? filterProgram : undefined),
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const { data } = await api.post<ApiResponse<Branch>>("/academics/branches", {
        name,
        code: code.toUpperCase(),
        program_id: programId,
      });
      return data.data;
    },
    onSuccess: () => {
      toast.success("Branch created");
      queryClient.invalidateQueries({ queryKey: ["academics"] });
      queryClient.invalidateQueries({ queryKey: ["admin"] });
      setName(""); setCode(""); setShowForm(false);
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "Failed to create branch"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminService.deleteBranch(id),
    onSuccess: () => {
      toast.success("Branch deleted");
      queryClient.invalidateQueries({ queryKey: ["academics"] });
      queryClient.invalidateQueries({ queryKey: ["admin"] });
      setPendingDelete(null);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Cannot delete — students may be enrolled");
      setPendingDelete(null);
    },
  });

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GitBranch className="h-4 w-4 text-amber-400" />
            <CardTitle className="text-base">Branches</CardTitle>
            <Badge className="bg-muted/50 text-muted-foreground border-border/50 text-xs">
              {branches.length}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Select
              value={filterProgram}
              items={[
                { value: "all", label: "All Programs" },
                ...programs.map((p) => ({ value: p.id, label: p.name })),
              ]}
              onValueChange={(v) => setFilterProgram(v ?? "all")}
            >
              <SelectTrigger className="h-7 w-[140px] text-xs bg-muted/30 border-border/50">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Programs</SelectItem>
                {programs.map((p) => (
                  <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs border-amber-700/30 text-amber-400 hover:bg-amber-600/10"
              onClick={() => setShowForm(!showForm)}
            >
              <Plus className="h-3.5 w-3.5 mr-1" /> Add
            </Button>
          </div>
        </div>
        <CardDescription>Academic branches under each program</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {showForm && (
          <div className="p-3 rounded-xl border border-amber-700/20 bg-amber-950/10 space-y-3">
            <p className="text-xs font-medium text-amber-400">New Branch</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <Select
                value={programId}
                items={programs.map((p) => ({ value: p.id, label: p.name }))}
                onValueChange={(v) => setProgramId(v ?? "")}
              >
                <SelectTrigger className="bg-muted/30 border-border/50">
                  <SelectValue placeholder="Select program" />
                </SelectTrigger>
                <SelectContent>
                  {programs.map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="Branch name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-muted/30 border-border/50"
              />
              <Input
                placeholder="Code (e.g. CSE)"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="bg-muted/30 border-border/50"
              />
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                className="bg-amber-600 hover:bg-amber-700 text-white text-xs"
                onClick={() => createMutation.mutate()}
                disabled={!name.trim() || !code.trim() || !programId || createMutation.isPending}
              >
                {createMutation.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" /> : null}
                Create
              </Button>
              <Button size="sm" variant="ghost" className="text-xs" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-10 rounded-lg bg-muted/30 animate-pulse" />
          ))
        ) : branches.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-4">No branches yet.</p>
        ) : (
          branches.map((b) => (
            <div
              key={b.id}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/10 border border-border/30 hover:bg-muted/20 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <Badge className="bg-amber-600/15 text-amber-400 border-amber-700/30 text-xs font-mono shrink-0">
                  {b.code}
                </Badge>
                <span className="text-sm font-medium truncate">{b.name}</span>
                {b.program && (
                  <span className="text-xs text-muted-foreground hidden sm:block shrink-0">{b.program.name}</span>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-red-400 hover:bg-red-950/20 shrink-0"
                onClick={() => setPendingDelete(b)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))
        )}
      </CardContent>

      <ConfirmDialog
        open={!!pendingDelete}
        onOpenChange={(o) => !o && setPendingDelete(null)}
        title="Delete Branch"
        description={`Delete "${pendingDelete?.name} (${pendingDelete?.code})"? Students enrolled in this branch will be affected.`}
        confirmLabel="Delete"
        onConfirm={() => pendingDelete && deleteMutation.mutate(pendingDelete.id)}
        loading={deleteMutation.isPending}
        destructive
      />
    </Card>
  );
}

// ── Batches Section ───────────────────────────────────────────────────
function BatchesSection() {
  const queryClient = useQueryClient();
  const [year, setYear] = useState("");
  const [pendingDelete, setPendingDelete] = useState<Batch | null>(null);
  const [showForm, setShowForm] = useState(false);

  const { data: batches = [], isLoading } = useQuery({
    queryKey: ["academics", "batches"],
    queryFn: academicService.fetchBatches,
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const { data } = await api.post<ApiResponse<Batch>>("/academics/batches", {
        year: parseInt(year),
      });
      return data.data;
    },
    onSuccess: () => {
      toast.success("Batch created");
      queryClient.invalidateQueries({ queryKey: ["academics"] });
      queryClient.invalidateQueries({ queryKey: ["admin"] });
      setYear(""); setShowForm(false);
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "Failed to create batch"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminService.deleteBatch(id),
    onSuccess: () => {
      toast.success("Batch deleted");
      queryClient.invalidateQueries({ queryKey: ["academics"] });
      queryClient.invalidateQueries({ queryKey: ["admin"] });
      setPendingDelete(null);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Cannot delete — students may belong to this batch");
      setPendingDelete(null);
    },
  });

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-cyan-400" />
            <CardTitle className="text-base">Batches</CardTitle>
            <Badge className="bg-muted/50 text-muted-foreground border-border/50 text-xs">
              {batches.length}
            </Badge>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="h-7 text-xs border-cyan-700/30 text-cyan-400 hover:bg-cyan-600/10"
            onClick={() => setShowForm(!showForm)}
          >
            <Plus className="h-3.5 w-3.5 mr-1" /> Add
          </Button>
        </div>
        <CardDescription>Graduation year batches</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {showForm && (
          <div className="p-3 rounded-xl border border-cyan-700/20 bg-cyan-950/10 space-y-3">
            <p className="text-xs font-medium text-cyan-400">New Batch</p>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Year (e.g. 2027)"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="bg-muted/30 border-border/50 max-w-[180px]"
                min={2020} max={2040}
              />
              <Button
                size="sm"
                className="bg-cyan-600 hover:bg-cyan-700 text-white text-xs"
                onClick={() => createMutation.mutate()}
                disabled={!year || createMutation.isPending}
              >
                {createMutation.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" /> : null}
                Create
              </Button>
              <Button size="sm" variant="ghost" className="text-xs" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-10 rounded-lg bg-muted/30 animate-pulse" />
          ))
        ) : batches.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-4">No batches yet.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {batches.map((b) => (
              <div
                key={b.id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/10 border border-border/30 hover:bg-muted/20 transition-colors"
              >
                <span className="font-semibold text-sm">{b.year}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-muted-foreground hover:text-red-400 hover:bg-red-950/20"
                  onClick={() => setPendingDelete(b)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <ConfirmDialog
        open={!!pendingDelete}
        onOpenChange={(o) => !o && setPendingDelete(null)}
        title="Delete Batch"
        description={`Delete batch "${pendingDelete?.year}"? Students in this batch will be affected.`}
        confirmLabel="Delete"
        onConfirm={() => pendingDelete && deleteMutation.mutate(pendingDelete.id)}
        loading={deleteMutation.isPending}
        destructive
      />
    </Card>
  );
}

// ── Main Academics Tab ────────────────────────────────────────────────
export function AcademicsTab() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold">Academic Structure</h3>
        <p className="text-sm text-muted-foreground mt-0.5">
          Manage programs, branches, and batches used across the portal.
        </p>
      </div>
      <ProgramsSection />
      <BranchesSection />
      <BatchesSection />
    </div>
  );
}
