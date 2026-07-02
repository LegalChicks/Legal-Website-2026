import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/lib/auth-context";
import {
  api,
  type Member,
  type AdminRecord,
  type AdminSalesRecord,
  type AdminIncubationRecord,
} from "@/lib/api";
import { useLocation } from "wouter";
import { AppNav } from "@/components/AppNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Users,
  Settings,
  ClipboardList,
  EyeOff,
  ReceiptText,
  Egg,
} from "lucide-react";

function currency(n: string | number) {
  const v = typeof n === "string" ? parseFloat(n) : n;
  if (isNaN(v)) return "₱0.00";
  return `₱${v.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

const SALE_PRODUCT_LABELS: Record<string, string> = {
  fertile_eggs: "Fertile Eggs",
  table_eggs: "Table Eggs",
  live_chickens: "Live Chickens",
};

const createSchema = z.object({
  username: z.string().min(3, "At least 3 characters"),
  password: z.string().min(6, "At least 6 characters"),
  fullName: z.string().min(2, "Full name required"),
  contact: z.string().optional(),
  role: z.enum(["member", "admin"]).default("member"),
});
const editSchema = z.object({
  fullName: z.string().min(2, "Full name required"),
  contact: z.string().optional(),
  role: z.enum(["member", "admin"]),
  password: z.string().optional(),
});
type CreateFormValues = z.infer<typeof createSchema>;
type EditFormValues = z.infer<typeof editSchema>;

function healthColor(s: string | null) {
  if (!s) return "bg-muted text-muted-foreground";
  const l = s.toLowerCase();
  if (l.includes("healthy")) return "bg-green-100 text-green-700";
  if (l.includes("sick") || l.includes("quarantined")) return "bg-red-100 text-red-700";
  if (l.includes("monitoring")) return "bg-amber-100 text-amber-700";
  return "bg-blue-100 text-blue-700";
}

export default function Admin() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();

  const [tab, setTab] = useState<"members" | "records" | "sales" | "incubation" | "settings">("members");

  // Members state
  const [members, setMembers] = useState<Member[]>([]);
  const [membersFetching, setMembersFetching] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Member | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Member | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  // All records state
  const [allRecords, setAllRecords] = useState<AdminRecord[]>([]);
  const [recordsFetching, setRecordsFetching] = useState(true);
  const [showDeleted, setShowDeleted] = useState(true);
  const [filterUser, setFilterUser] = useState<string>("all");

  // All sales state
  const [allSales, setAllSales] = useState<AdminSalesRecord[]>([]);
  const [salesFetching, setSalesFetching] = useState(true);
  const [showDeletedSales, setShowDeletedSales] = useState(true);
  const [filterSalesUser, setFilterSalesUser] = useState<string>("all");

  // All incubation state
  const [allIncubation, setAllIncubation] = useState<AdminIncubationRecord[]>([]);
  const [incubationFetching, setIncubationFetching] = useState(true);
  const [showDeletedIncubation, setShowDeletedIncubation] = useState(true);
  const [filterIncubationUser, setFilterIncubationUser] = useState<string>("all");

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) setLocation("/login");
  }, [user, loading, setLocation]);

  const loadMembers = async () => {
    try {
      const { users } = await api.admin.listUsers();
      setMembers(users);
    } catch {}
    finally { setMembersFetching(false); }
  };

  const loadAllRecords = async () => {
    try {
      const { records } = await api.admin.listAllRecords();
      setAllRecords(records);
    } catch {}
    finally { setRecordsFetching(false); }
  };

  const loadAllSales = async () => {
    try {
      const { records } = await api.admin.listAllSales();
      setAllSales(records);
    } catch {}
    finally { setSalesFetching(false); }
  };

  const loadAllIncubation = async () => {
    try {
      const { records } = await api.admin.listAllIncubation();
      setAllIncubation(records);
    } catch {}
    finally { setIncubationFetching(false); }
  };

  useEffect(() => {
    if (user?.role === "admin") {
      loadMembers();
      loadAllRecords();
      loadAllSales();
      loadAllIncubation();
    }
  }, [user]);

  const createForm = useForm<CreateFormValues>({
    resolver: zodResolver(createSchema),
    defaultValues: { username: "", password: "", fullName: "", contact: "", role: "member" },
  });
  const editForm = useForm<EditFormValues>({
    resolver: zodResolver(editSchema),
    defaultValues: { fullName: "", contact: "", role: "member", password: "" },
  });

  const handleCreate = async (values: CreateFormValues) => {
    setSubmitting(true); setFormError("");
    try {
      const { user: created } = await api.admin.createUser(values);
      setMembers((prev) => [...prev, created]);
      setCreateOpen(false);
      createForm.reset();
    } catch (err) { setFormError((err as Error).message); }
    finally { setSubmitting(false); }
  };

  const openEdit = (m: Member) => {
    setEditTarget(m);
    editForm.reset({ fullName: m.fullName, contact: m.contact, role: m.role as "member" | "admin", password: "" });
    setFormError("");
  };

  const handleEdit = async (values: EditFormValues) => {
    if (!editTarget) return;
    setSubmitting(true); setFormError("");
    try {
      const payload: Parameters<typeof api.admin.updateUser>[1] = {
        fullName: values.fullName,
        contact: values.contact,
        role: values.role,
      };
      if (values.password) payload.password = values.password;
      const { user: updated } = await api.admin.updateUser(editTarget.id, payload);
      setMembers((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
      setEditTarget(null);
    } catch (err) { setFormError((err as Error).message); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setSubmitting(true);
    try {
      await api.admin.deleteUser(deleteTarget.id);
      setMembers((prev) => prev.filter((m) => m.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) { alert((err as Error).message); }
    finally { setSubmitting(false); }
  };

  if (loading || !user) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  // Filter records for display
  const displayedRecords = allRecords.filter((r) => {
    const matchUser = filterUser === "all" || String(r.userId) === filterUser;
    const matchDeleted = showDeleted ? true : !r.deletedAt;
    return matchUser && matchDeleted;
  });

  const activeCount = allRecords.filter((r) => !r.deletedAt).length;
  const deletedCount = allRecords.filter((r) => !!r.deletedAt).length;

  const displayedSales = allSales.filter((r) => {
    const matchUser = filterSalesUser === "all" || String(r.userId) === filterSalesUser;
    const matchDeleted = showDeletedSales ? true : !r.deletedAt;
    return matchUser && matchDeleted;
  });
  const activeSalesCount = allSales.filter((r) => !r.deletedAt).length;
  const deletedSalesCount = allSales.filter((r) => !!r.deletedAt).length;
  const totalRevenue = allSales.filter((r) => !r.deletedAt).reduce((sum, r) => sum + parseFloat(r.totalAmount || "0"), 0);

  const displayedIncubation = allIncubation.filter((r) => {
    const matchUser = filterIncubationUser === "all" || String(r.userId) === filterIncubationUser;
    const matchDeleted = showDeletedIncubation ? true : !r.deletedAt;
    return matchUser && matchDeleted;
  });
  const activeIncubationCount = allIncubation.filter((r) => !r.deletedAt).length;
  const deletedIncubationCount = allIncubation.filter((r) => !!r.deletedAt).length;

  const tabs = [
    { key: "members", label: "Members", icon: <Users className="w-4 h-4" /> },
    { key: "records", label: "All Records", icon: <ClipboardList className="w-4 h-4" /> },
    { key: "sales", label: "All Sales", icon: <ReceiptText className="w-4 h-4" /> },
    { key: "incubation", label: "All Incubation", icon: <Egg className="w-4 h-4" /> },
    { key: "settings", label: "Settings", icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-background">
      <AppNav />
      <main className="pt-20 md:pt-16 pb-16 container mx-auto px-4 md:px-6">
        <div className="pt-8 pb-6">
          <h1 className="text-3xl font-bold text-foreground font-serif">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">Full visibility across all members and records.</p>
        </div>

        <div className="flex gap-2 mb-6">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key as typeof tab)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                tab === t.key
                  ? "bg-[#3a0d0d] text-white shadow"
                  : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* ── MEMBERS TAB ── */}
        {tab === "members" && (
          <Card className="border-border/50">
            <CardHeader className="pb-4 flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Registered Members</CardTitle>
              <Button
                onClick={() => { setCreateOpen(true); setFormError(""); createForm.reset(); }}
                className="bg-[#3a0d0d] hover:bg-[#5a1919] text-white gap-2"
              >
                <Plus className="w-4 h-4" /> Add Member
              </Button>
            </CardHeader>
            <CardContent>
              {membersFetching ? (
                <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-border/50">
                  <table className="w-full text-sm">
                    <thead className="bg-[#3a0d0d] text-white">
                      <tr>
                        {["Name", "Username", "Contact", "Role", "Joined", "Actions"].map((h) => (
                          <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {members.map((m, i) => (
                        <tr key={m.id} className={`border-b border-border/30 hover:bg-muted/30 transition-colors ${i % 2 === 0 ? "bg-white" : "bg-muted/10"}`}>
                          <td className="px-4 py-3 font-medium text-foreground">{m.fullName}</td>
                          <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{m.username}</td>
                          <td className="px-4 py-3 text-muted-foreground">{m.contact || "—"}</td>
                          <td className="px-4 py-3">
                            <Badge className={m.role === "admin" ? "bg-amber-100 text-amber-700" : "bg-muted text-muted-foreground"}>
                              {m.role}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground text-xs whitespace-nowrap">
                            {new Date(m.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <Button size="sm" variant="ghost" onClick={() => openEdit(m)} className="gap-1 text-muted-foreground hover:text-primary h-8">
                                <Pencil className="w-3.5 h-3.5" /> Edit
                              </Button>
                              {m.username !== "admin" && (
                                <Button size="sm" variant="ghost" onClick={() => setDeleteTarget(m)} className="gap-1 text-muted-foreground hover:text-red-600 h-8">
                                  <Trash2 className="w-3.5 h-3.5" /> Delete
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* ── ALL RECORDS TAB ── */}
        {tab === "records" && (
          <Card className="border-border/50">
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-lg">All Member Records</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    <span className="text-green-600 font-medium">{activeCount} active</span>
                    {deletedCount > 0 && (
                      <> · <span className="text-red-500 font-medium">{deletedCount} deleted by users</span> (retained for audit)</>
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {/* Filter by user */}
                  <select
                    value={filterUser}
                    onChange={(e) => setFilterUser(e.target.value)}
                    className="text-sm border border-border/60 rounded-lg px-3 py-1.5 bg-background text-foreground"
                  >
                    <option value="all">All Members</option>
                    {members.map((m) => (
                      <option key={m.id} value={String(m.id)}>{m.fullName}</option>
                    ))}
                  </select>
                  {/* Toggle deleted */}
                  <button
                    onClick={() => setShowDeleted(!showDeleted)}
                    className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg border transition-colors ${
                      showDeleted
                        ? "bg-red-50 border-red-200 text-red-700"
                        : "bg-muted border-border/60 text-muted-foreground"
                    }`}
                  >
                    <EyeOff className="w-3.5 h-3.5" />
                    {showDeleted ? "Hiding none" : "Show deleted"}
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {recordsFetching ? (
                <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
              ) : displayedRecords.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <ClipboardList className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p>No records found.</p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-border/50">
                  <table className="w-full text-sm">
                    <thead className="bg-[#3a0d0d] text-white">
                      <tr>
                        {["Member", "Batch", "Breed", "Qty", "Age", "Health", "Mortality", "Eggs", "Avg Wt", "Logged", "Status"].map((h) => (
                          <th key={h} className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {displayedRecords.map((r, i) => (
                        <tr
                          key={r.id}
                          className={`border-b border-border/30 transition-colors ${
                            r.deletedAt
                              ? "bg-red-50/60 opacity-70"
                              : i % 2 === 0 ? "bg-white hover:bg-muted/20" : "bg-muted/10 hover:bg-muted/30"
                          }`}
                        >
                          <td className="px-3 py-3 whitespace-nowrap">
                            <div>
                              <p className="font-medium text-foreground text-xs">{r.memberName}</p>
                              <p className="text-muted-foreground text-xs font-mono">@{r.memberUsername}</p>
                            </div>
                          </td>
                          <td className="px-3 py-3 font-medium text-foreground whitespace-nowrap">{r.batchName}</td>
                          <td className="px-3 py-3 text-muted-foreground whitespace-nowrap text-xs">{r.breed || r.birdType || "—"}</td>
                          <td className="px-3 py-3 text-center">{r.quantity ?? "—"}</td>
                          <td className="px-3 py-3 text-center text-xs">{r.ageWeeks != null ? `${r.ageWeeks}w` : "—"}</td>
                          <td className="px-3 py-3">
                            <Badge className={`text-xs ${healthColor(r.healthStatus)}`}>{r.healthStatus || "—"}</Badge>
                          </td>
                          <td className="px-3 py-3 text-center text-red-600 text-xs">{r.mortalityCount ?? 0}</td>
                          <td className="px-3 py-3 text-center text-xs">{r.eggProduction ?? "—"}</td>
                          <td className="px-3 py-3 text-center text-xs">{r.avgWeightKg ?? "—"}</td>
                          <td className="px-3 py-3 text-muted-foreground text-xs whitespace-nowrap">
                            {new Date(r.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-3 py-3">
                            {r.deletedAt ? (
                              <Badge className="bg-red-100 text-red-600 text-xs gap-1">
                                <EyeOff className="w-3 h-3" /> Deleted
                              </Badge>
                            ) : (
                              <Badge className="bg-green-100 text-green-700 text-xs">Active</Badge>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {deletedCount > 0 && (
                <p className="text-xs text-muted-foreground mt-3 text-center">
                  <EyeOff className="inline w-3 h-3 mr-1" />
                  Deleted records are hidden from members but permanently retained here for the admin.
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* ── ALL SALES TAB ── */}
        {tab === "sales" && (
          <Card className="border-border/50">
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-lg">All Member Sales</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    <span className="text-green-600 font-medium">{activeSalesCount} active</span>
                    {" · "}
                    <span className="text-[#3a0d0d] font-semibold">{currency(totalRevenue)} total revenue</span>
                    {deletedSalesCount > 0 && (
                      <> · <span className="text-red-500 font-medium">{deletedSalesCount} deleted by users</span> (retained for audit)</>
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <select
                    value={filterSalesUser}
                    onChange={(e) => setFilterSalesUser(e.target.value)}
                    className="text-sm border border-border/60 rounded-lg px-3 py-1.5 bg-background text-foreground"
                  >
                    <option value="all">All Members</option>
                    {members.map((m) => (
                      <option key={m.id} value={String(m.id)}>{m.fullName}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => setShowDeletedSales(!showDeletedSales)}
                    className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg border transition-colors ${
                      showDeletedSales
                        ? "bg-red-50 border-red-200 text-red-700"
                        : "bg-muted border-border/60 text-muted-foreground"
                    }`}
                  >
                    <EyeOff className="w-3.5 h-3.5" />
                    {showDeletedSales ? "Hiding none" : "Show deleted"}
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {salesFetching ? (
                <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
              ) : displayedSales.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <ReceiptText className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p>No sales found.</p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-border/50">
                  <table className="w-full text-sm">
                    <thead className="bg-[#3a0d0d] text-white">
                      <tr>
                        {["Member", "Date", "Product", "Qty", "Total", "Buyer", "Payment", "Status"].map((h) => (
                          <th key={h} className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {displayedSales.map((r, i) => (
                        <tr
                          key={r.id}
                          className={`border-b border-border/30 transition-colors ${
                            r.deletedAt
                              ? "bg-red-50/60 opacity-70"
                              : i % 2 === 0 ? "bg-white hover:bg-muted/20" : "bg-muted/10 hover:bg-muted/30"
                          }`}
                        >
                          <td className="px-3 py-3 whitespace-nowrap">
                            <div>
                              <p className="font-medium text-foreground text-xs">{r.memberName}</p>
                              <p className="text-muted-foreground text-xs font-mono">@{r.memberUsername}</p>
                            </div>
                          </td>
                          <td className="px-3 py-3 text-xs whitespace-nowrap text-muted-foreground">{new Date(r.saleDate).toLocaleDateString()}</td>
                          <td className="px-3 py-3 font-medium text-foreground whitespace-nowrap text-xs">{SALE_PRODUCT_LABELS[r.productType] ?? r.productType}</td>
                          <td className="px-3 py-3 text-center text-xs">{r.quantity} {r.unit}</td>
                          <td className="px-3 py-3 font-semibold text-[#3a0d0d] whitespace-nowrap">{currency(r.totalAmount)}</td>
                          <td className="px-3 py-3 text-xs whitespace-nowrap">{r.buyerName}</td>
                          <td className="px-3 py-3 text-xs capitalize whitespace-nowrap">{r.paymentMethod.replace("_", " ")}</td>
                          <td className="px-3 py-3">
                            {r.deletedAt ? (
                              <Badge className="bg-red-100 text-red-600 text-xs gap-1">
                                <EyeOff className="w-3 h-3" /> Deleted
                              </Badge>
                            ) : (
                              <Badge className="bg-green-100 text-green-700 text-xs">{r.paymentStatus}</Badge>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {deletedSalesCount > 0 && (
                <p className="text-xs text-muted-foreground mt-3 text-center">
                  <EyeOff className="inline w-3 h-3 mr-1" />
                  Deleted sales are hidden from members but permanently retained here for the admin.
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* ── ALL INCUBATION TAB ── */}
        {tab === "incubation" && (
          <Card className="border-border/50">
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-lg">All Member Incubation Batches</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    <span className="text-green-600 font-medium">{activeIncubationCount} active</span>
                    {deletedIncubationCount > 0 && (
                      <> · <span className="text-red-500 font-medium">{deletedIncubationCount} deleted by users</span> (retained for audit)</>
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <select
                    value={filterIncubationUser}
                    onChange={(e) => setFilterIncubationUser(e.target.value)}
                    className="text-sm border border-border/60 rounded-lg px-3 py-1.5 bg-background text-foreground"
                  >
                    <option value="all">All Members</option>
                    {members.map((m) => (
                      <option key={m.id} value={String(m.id)}>{m.fullName}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => setShowDeletedIncubation(!showDeletedIncubation)}
                    className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg border transition-colors ${
                      showDeletedIncubation
                        ? "bg-red-50 border-red-200 text-red-700"
                        : "bg-muted border-border/60 text-muted-foreground"
                    }`}
                  >
                    <EyeOff className="w-3.5 h-3.5" />
                    {showDeletedIncubation ? "Hiding none" : "Show deleted"}
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {incubationFetching ? (
                <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
              ) : displayedIncubation.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Egg className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p>No incubation batches found.</p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-border/50">
                  <table className="w-full text-sm">
                    <thead className="bg-[#3a0d0d] text-white">
                      <tr>
                        {["Member", "Batch", "Breed", "Eggs Set", "Set Date", "Hatched", "Status"].map((h) => (
                          <th key={h} className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {displayedIncubation.map((r, i) => (
                        <tr
                          key={r.id}
                          className={`border-b border-border/30 transition-colors ${
                            r.deletedAt
                              ? "bg-red-50/60 opacity-70"
                              : i % 2 === 0 ? "bg-white hover:bg-muted/20" : "bg-muted/10 hover:bg-muted/30"
                          }`}
                        >
                          <td className="px-3 py-3 whitespace-nowrap">
                            <div>
                              <p className="font-medium text-foreground text-xs">{r.memberName}</p>
                              <p className="text-muted-foreground text-xs font-mono">@{r.memberUsername}</p>
                            </div>
                          </td>
                          <td className="px-3 py-3 font-medium text-foreground whitespace-nowrap text-xs">{r.batchName}</td>
                          <td className="px-3 py-3 text-muted-foreground whitespace-nowrap text-xs">{r.breed || "—"}</td>
                          <td className="px-3 py-3 text-center text-xs">{r.eggsSetCount}</td>
                          <td className="px-3 py-3 text-xs whitespace-nowrap">{new Date(r.setDate).toLocaleDateString()}</td>
                          <td className="px-3 py-3 text-center text-xs">{r.hatchedCount ?? "—"}</td>
                          <td className="px-3 py-3">
                            {r.deletedAt ? (
                              <Badge className="bg-red-100 text-red-600 text-xs gap-1">
                                <EyeOff className="w-3 h-3" /> Deleted
                              </Badge>
                            ) : (
                              <Badge className="bg-green-100 text-green-700 text-xs capitalize">{r.status}</Badge>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {deletedIncubationCount > 0 && (
                <p className="text-xs text-muted-foreground mt-3 text-center">
                  <EyeOff className="inline w-3 h-3 mr-1" />
                  Deleted incubation batches are hidden from members but permanently retained here for the admin.
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* ── SETTINGS TAB ── */}
        {tab === "settings" && (
          <Card className="border-border/50">
            <CardHeader><CardTitle className="text-lg">Farm Settings</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4 max-w-md">
                {[
                  { label: "Farm Name", value: "Legal Chicks Poultry Farm" },
                  { label: "Location", value: "Solana, Cagayan Valley, Philippines" },
                  { label: "WhatsApp Contact", value: "+63 936 967 1213" },
                  { label: "Owner", value: "Froilan Dave A. Lingan" },
                ].map((s) => (
                  <div key={s.label} className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">{s.label}</label>
                    <Input value={s.value} readOnly className="bg-muted/40 text-muted-foreground" />
                  </div>
                ))}
                <p className="text-xs text-muted-foreground pt-2">
                  To update farm settings, contact the system developer.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Create Member Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle className="font-serif text-[#3a0d0d]">Register New Member</DialogTitle></DialogHeader>
          {formError && <div className="px-4 py-2 rounded-lg bg-red-50 text-red-700 text-sm">{formError}</div>}
          <Form {...createForm}>
            <form onSubmit={createForm.handleSubmit(handleCreate)} className="space-y-4">
              <FormField control={createForm.control} name="fullName" render={({ field }) => (
                <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} placeholder="Juan dela Cruz" /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={createForm.control} name="username" render={({ field }) => (
                <FormItem><FormLabel>Username</FormLabel><FormControl><Input {...field} placeholder="juandc" autoComplete="off" /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={createForm.control} name="password" render={({ field }) => (
                <FormItem><FormLabel>Password</FormLabel><FormControl><Input type="password" {...field} placeholder="Min. 6 characters" autoComplete="new-password" /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={createForm.control} name="contact" render={({ field }) => (
                <FormItem><FormLabel>Contact (optional)</FormLabel><FormControl><Input {...field} placeholder="+63 900 000 0000" /></FormControl></FormItem>
              )} />
              <FormField control={createForm.control} name="role" render={({ field }) => (
                <FormItem><FormLabel>Role</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="member">Member</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )} />
              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={submitting} className="bg-[#3a0d0d] text-white">
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null} Register
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Member Dialog */}
      <Dialog open={!!editTarget} onOpenChange={(o) => { if (!o) setEditTarget(null); }}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle className="font-serif text-[#3a0d0d]">Edit Member: {editTarget?.username}</DialogTitle></DialogHeader>
          {formError && <div className="px-4 py-2 rounded-lg bg-red-50 text-red-700 text-sm">{formError}</div>}
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(handleEdit)} className="space-y-4">
              <FormField control={editForm.control} name="fullName" render={({ field }) => (
                <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={editForm.control} name="contact" render={({ field }) => (
                <FormItem><FormLabel>Contact</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
              )} />
              <FormField control={editForm.control} name="role" render={({ field }) => (
                <FormItem><FormLabel>Role</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="member">Member</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )} />
              <FormField control={editForm.control} name="password" render={({ field }) => (
                <FormItem><FormLabel>New Password (leave blank to keep)</FormLabel><FormControl><Input type="password" {...field} placeholder="Leave blank to keep current" autoComplete="new-password" /></FormControl></FormItem>
              )} />
              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setEditTarget(null)}>Cancel</Button>
                <Button type="submit" disabled={submitting} className="bg-[#3a0d0d] text-white">
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null} Save Changes
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => { if (!o) setDeleteTarget(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{deleteTarget?.fullName}</strong> ({deleteTarget?.username})? This will permanently remove their account and all associated records.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={submitting} className="bg-red-600 hover:bg-red-700 text-white">
              {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null} Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
