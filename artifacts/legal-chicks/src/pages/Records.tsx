import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/lib/auth-context";
import { api, type PoultryRecord } from "@/lib/api";
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
import { Plus, Pencil, Trash2, Loader2, ClipboardList } from "lucide-react";

const recordSchema = z.object({
  batchName: z.string().min(1, "Batch name is required"),
  birdType: z.string().optional(),
  breed: z.string().optional(),
  quantity: z.coerce.number().int().min(0).optional(),
  ageWeeks: z.coerce.number().int().min(0).optional().nullable(),
  hatchDate: z.string().optional().nullable(),
  feedNotes: z.string().optional().nullable(),
  healthStatus: z.string().optional().nullable(),
  mortalityCount: z.coerce.number().int().min(0).optional(),
  eggProduction: z.coerce.number().int().min(0).optional().nullable(),
  avgWeightKg: z.string().optional().nullable(),
  freeNotes: z.string().optional().nullable(),
});
type RecordFormValues = z.infer<typeof recordSchema>;

const HEALTH_STATUSES = ["Healthy", "Monitoring", "Sick", "Quarantined", "Recovered"];

function RecordForm({
  defaultValues,
  onSubmit,
  submitting,
}: {
  defaultValues?: Partial<RecordFormValues>;
  onSubmit: (v: RecordFormValues) => Promise<void>;
  submitting: boolean;
}) {
  const form = useForm<RecordFormValues>({
    resolver: zodResolver(recordSchema),
    defaultValues: defaultValues ?? {
      batchName: "",
      birdType: "Rhode Island Red",
      breed: "Dark Mahogany",
      quantity: 0,
      ageWeeks: null,
      hatchDate: null,
      feedNotes: null,
      healthStatus: null,
      mortalityCount: 0,
      eggProduction: null,
      avgWeightKg: null,
      freeNotes: null,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[65vh] overflow-y-auto pr-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField control={form.control} name="batchName" render={({ field }) => (
            <FormItem className="sm:col-span-2">
              <FormLabel>Batch / Flock Name *</FormLabel>
              <FormControl><Input {...field} placeholder="e.g. Batch 2026-A" /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="birdType" render={({ field }) => (
            <FormItem>
              <FormLabel>Bird Type</FormLabel>
              <FormControl><Input {...field} value={field.value ?? ""} placeholder="e.g. Rhode Island Red" /></FormControl>
            </FormItem>
          )} />
          <FormField control={form.control} name="breed" render={({ field }) => (
            <FormItem>
              <FormLabel>Breed / Strain</FormLabel>
              <FormControl><Input {...field} value={field.value ?? ""} placeholder="e.g. Dark Mahogany" /></FormControl>
            </FormItem>
          )} />
          <FormField control={form.control} name="quantity" render={({ field }) => (
            <FormItem>
              <FormLabel>Quantity (birds)</FormLabel>
              <FormControl><Input type="number" min={0} {...field} /></FormControl>
            </FormItem>
          )} />
          <FormField control={form.control} name="ageWeeks" render={({ field }) => (
            <FormItem>
              <FormLabel>Age (weeks)</FormLabel>
              <FormControl><Input type="number" min={0} {...field} value={field.value ?? ""} onChange={e => field.onChange(e.target.value === "" ? null : e.target.valueAsNumber)} /></FormControl>
            </FormItem>
          )} />
          <FormField control={form.control} name="hatchDate" render={({ field }) => (
            <FormItem>
              <FormLabel>Hatch Date</FormLabel>
              <FormControl><Input type="date" {...field} value={field.value ?? ""} /></FormControl>
            </FormItem>
          )} />
          <FormField control={form.control} name="healthStatus" render={({ field }) => (
            <FormItem>
              <FormLabel>Health Status</FormLabel>
              <Select onValueChange={field.onChange} value={field.value ?? ""}>
                <FormControl>
                  <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                </FormControl>
                <SelectContent>
                  {HEALTH_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </FormItem>
          )} />
          <FormField control={form.control} name="mortalityCount" render={({ field }) => (
            <FormItem>
              <FormLabel>Mortality Count</FormLabel>
              <FormControl><Input type="number" min={0} {...field} /></FormControl>
            </FormItem>
          )} />
          <FormField control={form.control} name="eggProduction" render={({ field }) => (
            <FormItem>
              <FormLabel>Egg Production (pcs)</FormLabel>
              <FormControl><Input type="number" min={0} {...field} value={field.value ?? ""} onChange={e => field.onChange(e.target.value === "" ? null : e.target.valueAsNumber)} /></FormControl>
            </FormItem>
          )} />
          <FormField control={form.control} name="avgWeightKg" render={({ field }) => (
            <FormItem>
              <FormLabel>Avg Weight (kg)</FormLabel>
              <FormControl><Input type="number" step="0.01" min={0} {...field} value={field.value ?? ""} /></FormControl>
            </FormItem>
          )} />
          <FormField control={form.control} name="feedNotes" render={({ field }) => (
            <FormItem className="sm:col-span-2">
              <FormLabel>Feed Notes</FormLabel>
              <FormControl><Textarea {...field} value={field.value ?? ""} rows={2} placeholder="Feed type, schedule, ingredients…" /></FormControl>
            </FormItem>
          )} />
          <FormField control={form.control} name="freeNotes" render={({ field }) => (
            <FormItem className="sm:col-span-2">
              <FormLabel>Free Notes</FormLabel>
              <FormControl><Textarea {...field} value={field.value ?? ""} rows={2} placeholder="Any additional observations…" /></FormControl>
            </FormItem>
          )} />
        </div>

        <div className="pt-2 flex justify-end gap-3 sticky bottom-0 bg-white pb-1">
          <Button type="submit" disabled={submitting} className="bg-[#3a0d0d] hover:bg-[#5a1919] text-white">
            {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Save Record
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default function Records() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [records, setRecords] = useState<PoultryRecord[]>([]);
  const [fetching, setFetching] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<PoultryRecord | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<PoultryRecord | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && !user) setLocation("/login");
  }, [user, loading, setLocation]);

  const loadRecords = async () => {
    try {
      const { records } = await api.records.list();
      setRecords(records);
    } catch {}
    finally { setFetching(false); }
  };

  useEffect(() => {
    if (user) loadRecords();
  }, [user]);

  const handleSubmit = async (values: RecordFormValues) => {
    setSubmitting(true);
    try {
      if (editing) {
        const { record } = await api.records.update(editing.id, values as Partial<PoultryRecord>);
        setRecords((prev) => prev.map((r) => (r.id === record.id ? record : r)));
      } else {
        const { record } = await api.records.create(values as Partial<PoultryRecord>);
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
      await api.records.delete(deleteTarget.id);
      setRecords((prev) => prev.filter((r) => r.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const openAdd = () => { setEditing(null); setDialogOpen(true); };
  const openEdit = (r: PoultryRecord) => { setEditing(r); setDialogOpen(true); };

  if (loading || !user) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  const healthColor = (s: string | null) => {
    if (!s) return "bg-muted text-muted-foreground";
    const l = s.toLowerCase();
    if (l.includes("healthy")) return "bg-green-100 text-green-700";
    if (l.includes("sick") || l.includes("quarantined")) return "bg-red-100 text-red-700";
    if (l.includes("monitoring")) return "bg-amber-100 text-amber-700";
    return "bg-blue-100 text-blue-700";
  };

  return (
    <div className="min-h-screen bg-background">
      <AppNav />
      <main className="pt-20 md:pt-16 pb-16 container mx-auto px-4 md:px-6">
        <div className="pt-8 pb-6 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground font-serif">My Records</h1>
            <p className="text-muted-foreground mt-1">
              Add, edit, or remove your flock batches anytime — no approval needed.
            </p>
          </div>
          <Button onClick={openAdd} className="bg-[#3a0d0d] hover:bg-[#5a1919] text-white gap-2">
            <Plus className="w-4 h-4" /> Add Record
          </Button>
        </div>

        {fetching ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : records.length === 0 ? (
          <div className="text-center py-24 bg-muted/30 rounded-3xl border border-border/50">
            <ClipboardList className="w-14 h-14 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No records yet</h3>
            <p className="text-muted-foreground mb-6">Start logging your flock batches freely — no approval required.</p>
            <Button onClick={openAdd} className="bg-[#3a0d0d] text-white gap-2">
              <Plus className="w-4 h-4" /> Add First Record
            </Button>
          </div>
        ) : (
          <div className="rounded-2xl border border-border/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[#3a0d0d] text-white">
                  <tr>
                    {["Batch Name", "Breed", "Qty", "Age (wks)", "Health", "Mortality", "Eggs", "Avg Wt (kg)", "Date", ""].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {records.map((r, i) => (
                    <tr key={r.id} className={`border-b border-border/30 hover:bg-muted/30 transition-colors ${i % 2 === 0 ? "bg-white" : "bg-muted/10"}`}>
                      <td className="px-4 py-3 font-medium text-foreground whitespace-nowrap">{r.batchName}</td>
                      <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{r.breed || r.birdType || "—"}</td>
                      <td className="px-4 py-3 text-center">{r.quantity ?? "—"}</td>
                      <td className="px-4 py-3 text-center">{r.ageWeeks ?? "—"}</td>
                      <td className="px-4 py-3">
                        <Badge className={`text-xs ${healthColor(r.healthStatus)}`}>{r.healthStatus || "—"}</Badge>
                      </td>
                      <td className="px-4 py-3 text-center text-red-600">{r.mortalityCount ?? 0}</td>
                      <td className="px-4 py-3 text-center">{r.eggProduction ?? "—"}</td>
                      <td className="px-4 py-3 text-center">{r.avgWeightKg ?? "—"}</td>
                      <td className="px-4 py-3 text-muted-foreground whitespace-nowrap text-xs">{new Date(r.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
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
          You can freely add, edit, or delete your records at any time. Deleted records are retained by the farm admin for auditing.
        </p>
      </main>

      {/* Add / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) setEditing(null); }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-serif text-[#3a0d0d]">
              {editing ? "Edit Record" : "Add New Poultry Record"}
            </DialogTitle>
          </DialogHeader>
          <RecordForm
            defaultValues={editing ? {
              batchName: editing.batchName,
              birdType: editing.birdType ?? undefined,
              breed: editing.breed ?? undefined,
              quantity: editing.quantity ?? undefined,
              ageWeeks: editing.ageWeeks,
              hatchDate: editing.hatchDate,
              feedNotes: editing.feedNotes,
              healthStatus: editing.healthStatus,
              mortalityCount: editing.mortalityCount ?? undefined,
              eggProduction: editing.eggProduction,
              avgWeightKg: editing.avgWeightKg,
              freeNotes: editing.freeNotes,
            } : undefined}
            onSubmit={handleSubmit}
            submitting={submitting}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => { if (!o) setDeleteTarget(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Record</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove <strong>{deleteTarget?.batchName}</strong> from your records?
              The farm admin will retain a copy of this entry for auditing purposes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={submitting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
