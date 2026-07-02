import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/lib/auth-context";
import { api, type IncubationRecord } from "@/lib/api";
import { useLocation } from "wouter";
import { AppNav } from "@/components/AppNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Pencil, Trash2, Loader2, Egg, Thermometer } from "lucide-react";

const STATUSES = ["incubating", "hatched", "failed"] as const;

const numField = z.union([z.coerce.number(), z.literal("")]).optional().nullable();

const incubationSchema = z.object({
  batchName: z.string().min(1, "Batch name is required"),
  breed: z.string().optional(),
  eggsSetCount: z.coerce.number().int().min(0),
  setDate: z.string().min(1, "Set date is required"),
  incubatorType: z.string().optional(),
  temperatureC: numField,
  humidityPercent: numField,
  expectedHatchDate: z.string().optional().nullable(),
  day7FertileCount: numField,
  day7InfertileCount: numField,
  day14FertileCount: numField,
  day14InfertileCount: numField,
  day18FertileCount: numField,
  day18InfertileCount: numField,
  actualHatchDate: z.string().optional().nullable(),
  hatchedCount: numField,
  unhatchedCount: numField,
  deadInShellCount: numField,
  cullCount: numField,
  status: z.enum(STATUSES),
  notes: z.string().optional().nullable(),
});
type IncubationFormValues = z.infer<typeof incubationSchema>;

function addDays(dateStr: string, days: number) {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function NumInput({ field }: { field: any }) {
  return (
    <Input
      type="number"
      min={0}
      value={field.value ?? ""}
      onChange={(e) => field.onChange(e.target.value === "" ? null : e.target.valueAsNumber)}
    />
  );
}

function IncubationForm({
  defaultValues,
  onSubmit,
  submitting,
}: {
  defaultValues?: Partial<IncubationFormValues>;
  onSubmit: (v: IncubationFormValues) => Promise<void>;
  submitting: boolean;
}) {
  const form = useForm<IncubationFormValues>({
    resolver: zodResolver(incubationSchema),
    defaultValues: defaultValues ?? {
      batchName: "",
      breed: "Rhode Island Red",
      eggsSetCount: 0,
      setDate: new Date().toISOString().slice(0, 10),
      incubatorType: "",
      temperatureC: 37.5,
      humidityPercent: 55,
      expectedHatchDate: null,
      day7FertileCount: null,
      day7InfertileCount: null,
      day14FertileCount: null,
      day14InfertileCount: null,
      day18FertileCount: null,
      day18InfertileCount: null,
      actualHatchDate: null,
      hatchedCount: null,
      unhatchedCount: null,
      deadInShellCount: null,
      cullCount: null,
      status: "incubating",
      notes: null,
    },
  });

  const setDate = form.watch("setDate");
  const eggsSetCount = form.watch("eggsSetCount") || 0;
  const hatchedCount = form.watch("hatchedCount") || 0;
  const hatchRate = eggsSetCount > 0 ? ((hatchedCount / eggsSetCount) * 100).toFixed(1) : "0.0";

  useEffect(() => {
    if (setDate && !defaultValues?.expectedHatchDate) {
      form.setValue("expectedHatchDate", addDays(setDate, 21));
    }
  }, [setDate]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 max-h-[65vh] overflow-y-auto pr-1">
        <div>
          <h4 className="text-sm font-semibold text-[#3a0d0d] mb-3 uppercase tracking-wide">Batch Details</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField control={form.control} name="batchName" render={({ field }) => (
              <FormItem className="sm:col-span-2"><FormLabel>Batch Name *</FormLabel><FormControl><Input {...field} placeholder="e.g. Incubation Batch 2026-05" /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="breed" render={({ field }) => (
              <FormItem><FormLabel>Breed / Strain</FormLabel><FormControl><Input {...field} value={field.value ?? ""} placeholder="e.g. Dark Mahogany" /></FormControl></FormItem>
            )} />
            <FormField control={form.control} name="eggsSetCount" render={({ field }) => (
              <FormItem><FormLabel>Eggs Set *</FormLabel><FormControl><Input type="number" min={0} {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="setDate" render={({ field }) => (
              <FormItem><FormLabel>Set Date *</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="expectedHatchDate" render={({ field }) => (
              <FormItem><FormLabel>Expected Hatch Date</FormLabel><FormControl><Input type="date" {...field} value={field.value ?? ""} /></FormControl></FormItem>
            )} />
            <FormField control={form.control} name="incubatorType" render={({ field }) => (
              <FormItem><FormLabel>Incubator Type</FormLabel><FormControl><Input {...field} value={field.value ?? ""} placeholder="e.g. Automatic 528-egg" /></FormControl></FormItem>
            )} />
            <FormField control={form.control} name="status" render={({ field }) => (
              <FormItem><FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                  <SelectContent>
                    {STATUSES.map((s) => <SelectItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>)}
                  </SelectContent>
                </Select>
              </FormItem>
            )} />
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-[#3a0d0d] mb-3 uppercase tracking-wide flex items-center gap-2">
            <Thermometer className="w-4 h-4" /> Environment
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField control={form.control} name="temperatureC" render={({ field }) => (
              <FormItem><FormLabel>Temperature (°C)</FormLabel><FormControl><Input type="number" step="0.1" {...field} value={field.value ?? ""} onChange={(e) => field.onChange(e.target.value === "" ? null : e.target.valueAsNumber)} /></FormControl></FormItem>
            )} />
            <FormField control={form.control} name="humidityPercent" render={({ field }) => (
              <FormItem><FormLabel>Humidity (%)</FormLabel><FormControl><Input type="number" step="0.1" {...field} value={field.value ?? ""} onChange={(e) => field.onChange(e.target.value === "" ? null : e.target.valueAsNumber)} /></FormControl></FormItem>
            )} />
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-[#3a0d0d] mb-3 uppercase tracking-wide">Candling Results</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <FormField control={form.control} name="day7FertileCount" render={({ field }) => (
              <FormItem><FormLabel className="text-xs">Day 7 Fertile</FormLabel><FormControl><NumInput field={field} /></FormControl></FormItem>
            )} />
            <FormField control={form.control} name="day7InfertileCount" render={({ field }) => (
              <FormItem><FormLabel className="text-xs">Day 7 Infertile</FormLabel><FormControl><NumInput field={field} /></FormControl></FormItem>
            )} />
            <div className="hidden sm:block" />
            <FormField control={form.control} name="day14FertileCount" render={({ field }) => (
              <FormItem><FormLabel className="text-xs">Day 14 Fertile</FormLabel><FormControl><NumInput field={field} /></FormControl></FormItem>
            )} />
            <FormField control={form.control} name="day14InfertileCount" render={({ field }) => (
              <FormItem><FormLabel className="text-xs">Day 14 Infertile</FormLabel><FormControl><NumInput field={field} /></FormControl></FormItem>
            )} />
            <div className="hidden sm:block" />
            <FormField control={form.control} name="day18FertileCount" render={({ field }) => (
              <FormItem><FormLabel className="text-xs">Day 18 Fertile</FormLabel><FormControl><NumInput field={field} /></FormControl></FormItem>
            )} />
            <FormField control={form.control} name="day18InfertileCount" render={({ field }) => (
              <FormItem><FormLabel className="text-xs">Day 18 Infertile</FormLabel><FormControl><NumInput field={field} /></FormControl></FormItem>
            )} />
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-[#3a0d0d] mb-3 uppercase tracking-wide flex items-center gap-2">
            <Egg className="w-4 h-4" /> Hatch Results
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField control={form.control} name="actualHatchDate" render={({ field }) => (
              <FormItem><FormLabel>Actual Hatch Date</FormLabel><FormControl><Input type="date" {...field} value={field.value ?? ""} /></FormControl></FormItem>
            )} />
            <FormField control={form.control} name="hatchedCount" render={({ field }) => (
              <FormItem><FormLabel>Hatched Count</FormLabel><FormControl><NumInput field={field} /></FormControl></FormItem>
            )} />
            <FormField control={form.control} name="unhatchedCount" render={({ field }) => (
              <FormItem><FormLabel>Unhatched Count</FormLabel><FormControl><NumInput field={field} /></FormControl></FormItem>
            )} />
            <FormField control={form.control} name="deadInShellCount" render={({ field }) => (
              <FormItem><FormLabel>Dead-in-Shell Count</FormLabel><FormControl><NumInput field={field} /></FormControl></FormItem>
            )} />
            <FormField control={form.control} name="cullCount" render={({ field }) => (
              <FormItem><FormLabel>Culled Count</FormLabel><FormControl><NumInput field={field} /></FormControl></FormItem>
            )} />
          </div>
          <div className="mt-4 bg-[#3a0d0d]/5 rounded-xl p-4 flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Hatch Rate</span>
            <span className="text-2xl font-bold text-[#3a0d0d] font-serif">{hatchRate}%</span>
          </div>
        </div>

        <FormField control={form.control} name="notes" render={({ field }) => (
          <FormItem><FormLabel>Notes</FormLabel><FormControl><Textarea {...field} value={field.value ?? ""} rows={2} placeholder="Turning schedule, candling observations, anomalies…" /></FormControl></FormItem>
        )} />

        <div className="pt-2 flex justify-end gap-3 sticky bottom-0 bg-white pb-1">
          <Button type="submit" disabled={submitting} className="bg-[#3a0d0d] hover:bg-[#5a1919] text-white">
            {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Save Batch
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default function Incubation() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [records, setRecords] = useState<IncubationRecord[]>([]);
  const [fetching, setFetching] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<IncubationRecord | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<IncubationRecord | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && !user) setLocation("/login");
  }, [user, loading, setLocation]);

  const loadRecords = async () => {
    try {
      const { records } = await api.incubation.list();
      setRecords(records);
    } catch {}
    finally { setFetching(false); }
  };

  useEffect(() => {
    if (user) loadRecords();
  }, [user]);

  const handleSubmit = async (values: IncubationFormValues) => {
    setSubmitting(true);
    try {
      const payload = {
        ...values,
        temperatureC: values.temperatureC != null && values.temperatureC !== "" ? String(values.temperatureC) : null,
        humidityPercent: values.humidityPercent != null && values.humidityPercent !== "" ? String(values.humidityPercent) : null,
      };
      if (editing) {
        const { record } = await api.incubation.update(editing.id, payload as Partial<IncubationRecord>);
        setRecords((prev) => prev.map((r) => (r.id === record.id ? record : r)));
      } else {
        const { record } = await api.incubation.create(payload as Partial<IncubationRecord>);
        setRecords((prev) => [record, ...prev]);
      }
      setDialogOpen(false);
      setEditing(null);
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setSubmitting(true);
    try {
      await api.incubation.delete(deleteTarget.id);
      setRecords((prev) => prev.filter((r) => r.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const openAdd = () => { setEditing(null); setDialogOpen(true); };
  const openEdit = (r: IncubationRecord) => { setEditing(r); setDialogOpen(true); };

  if (loading || !user) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  const statusColor = (s: string) => {
    if (s === "hatched") return "bg-green-100 text-green-700";
    if (s === "failed") return "bg-red-100 text-red-700";
    return "bg-amber-100 text-amber-700";
  };

  const hatchRateOf = (r: IncubationRecord) =>
    r.eggsSetCount > 0 && r.hatchedCount != null ? `${((r.hatchedCount / r.eggsSetCount) * 100).toFixed(1)}%` : "—";

  return (
    <div className="min-h-screen bg-background">
      <AppNav />
      <main className="pt-20 md:pt-16 pb-16 container mx-auto px-4 md:px-6">
        <div className="pt-8 pb-6 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground font-serif">Incubation Log</h1>
            <p className="text-muted-foreground mt-1">
              Track egg batches from set date through hatch — freely, no approval needed.
            </p>
          </div>
          <Button onClick={openAdd} className="bg-[#3a0d0d] hover:bg-[#5a1919] text-white gap-2">
            <Plus className="w-4 h-4" /> New Batch
          </Button>
        </div>

        {fetching ? (
          <div className="flex items-center justify-center py-24"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>
        ) : records.length === 0 ? (
          <div className="text-center py-24 bg-muted/30 rounded-3xl border border-border/50">
            <Egg className="w-14 h-14 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No incubation batches yet</h3>
            <p className="text-muted-foreground mb-6">Start tracking your egg incubation batches freely.</p>
            <Button onClick={openAdd} className="bg-[#3a0d0d] text-white gap-2">
              <Plus className="w-4 h-4" /> Add First Batch
            </Button>
          </div>
        ) : (
          <div className="rounded-2xl border border-border/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[#3a0d0d] text-white">
                  <tr>
                    {["Batch", "Breed", "Eggs Set", "Set Date", "Exp. Hatch", "Actual Hatch", "Hatched", "Hatch Rate", "Status", ""].map((h) => (
                      <th key={h} className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {records.map((r, i) => (
                    <tr key={r.id} className={`border-b border-border/30 hover:bg-muted/30 transition-colors ${i % 2 === 0 ? "bg-white" : "bg-muted/10"}`}>
                      <td className="px-3 py-3 font-medium text-foreground whitespace-nowrap">{r.batchName}</td>
                      <td className="px-3 py-3 text-muted-foreground whitespace-nowrap text-xs">{r.breed || "—"}</td>
                      <td className="px-3 py-3 text-center">{r.eggsSetCount}</td>
                      <td className="px-3 py-3 text-xs whitespace-nowrap">{new Date(r.setDate).toLocaleDateString()}</td>
                      <td className="px-3 py-3 text-xs whitespace-nowrap">{r.expectedHatchDate ? new Date(r.expectedHatchDate).toLocaleDateString() : "—"}</td>
                      <td className="px-3 py-3 text-xs whitespace-nowrap">{r.actualHatchDate ? new Date(r.actualHatchDate).toLocaleDateString() : "—"}</td>
                      <td className="px-3 py-3 text-center">{r.hatchedCount ?? "—"}</td>
                      <td className="px-3 py-3 text-center font-semibold text-[#3a0d0d]">{hatchRateOf(r)}</td>
                      <td className="px-3 py-3"><Badge className={`text-xs ${statusColor(r.status)}`}>{r.status}</Badge></td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-1">
                          <Button size="sm" variant="ghost" onClick={() => openEdit(r)} className="gap-1 text-muted-foreground hover:text-primary h-8 px-2">
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => setDeleteTarget(r)} className="gap-1 text-muted-foreground hover:text-red-600 h-8 px-2">
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <p className="text-xs text-muted-foreground mt-4 text-center">
          You can freely add, edit, or delete your incubation batches at any time. Deleted entries are retained by the farm admin for auditing.
        </p>
      </main>

      <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) setEditing(null); }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle className="font-serif text-[#3a0d0d]">{editing ? "Edit Incubation Batch" : "New Incubation Batch"}</DialogTitle></DialogHeader>
          <IncubationForm
            defaultValues={editing ? {
              batchName: editing.batchName,
              breed: editing.breed,
              eggsSetCount: editing.eggsSetCount,
              setDate: editing.setDate,
              incubatorType: editing.incubatorType,
              temperatureC: editing.temperatureC != null ? parseFloat(editing.temperatureC) : null,
              humidityPercent: editing.humidityPercent != null ? parseFloat(editing.humidityPercent) : null,
              expectedHatchDate: editing.expectedHatchDate,
              day7FertileCount: editing.day7FertileCount,
              day7InfertileCount: editing.day7InfertileCount,
              day14FertileCount: editing.day14FertileCount,
              day14InfertileCount: editing.day14InfertileCount,
              day18FertileCount: editing.day18FertileCount,
              day18InfertileCount: editing.day18InfertileCount,
              actualHatchDate: editing.actualHatchDate,
              hatchedCount: editing.hatchedCount,
              unhatchedCount: editing.unhatchedCount,
              deadInShellCount: editing.deadInShellCount,
              cullCount: editing.cullCount,
              status: editing.status,
              notes: editing.notes,
            } : undefined}
            onSubmit={handleSubmit}
            submitting={submitting}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => { if (!o) setDeleteTarget(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Incubation Batch</AlertDialogTitle>
            <AlertDialogDescription>
              Remove <strong>{deleteTarget?.batchName}</strong>? The farm admin retains a copy for auditing.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={submitting} className="bg-red-600 hover:bg-red-700 text-white">
              {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null} Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
