import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/lib/auth-context";
import { api, type SalesRecord } from "@/lib/api";
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
import { Plus, Pencil, Trash2, Loader2, ReceiptText, TrendingUp } from "lucide-react";

const PRODUCT_TYPES = [
  { value: "fertile_eggs", label: "Fertile Eggs", unit: "pcs" },
  { value: "table_eggs", label: "Table Eggs", unit: "trays" },
  { value: "live_chickens", label: "Live Chickens", unit: "heads" },
] as const;

const PAYMENT_METHODS = ["cash", "gcash", "bank_transfer"];
const PAYMENT_STATUSES = ["paid", "pending", "partial"];
const DELIVERY_METHODS = ["pickup", "delivery"];

const saleSchema = z.object({
  saleDate: z.string().min(1, "Sale date is required"),
  productType: z.enum(["fertile_eggs", "table_eggs", "live_chickens"]),
  breed: z.string().optional(),
  quantity: z.coerce.number().int().min(0),
  unit: z.string().min(1),
  unitPrice: z.coerce.number().min(0),
  buyerName: z.string().min(1, "Buyer name is required"),
  buyerContact: z.string().optional(),
  deliveryMethod: z.enum(["pickup", "delivery"]),
  deliveryAddress: z.string().optional().nullable(),
  paymentMethod: z.enum(["cash", "gcash", "bank_transfer"]),
  paymentStatus: z.enum(["paid", "pending", "partial"]),
  amountPaid: z.coerce.number().min(0).optional(),
  notes: z.string().optional().nullable(),
});
type SaleFormValues = z.infer<typeof saleSchema>;

function currency(n: string | number) {
  const v = typeof n === "string" ? parseFloat(n) : n;
  if (isNaN(v)) return "₱0.00";
  return `₱${v.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function SaleForm({
  defaultValues,
  onSubmit,
  submitting,
}: {
  defaultValues?: Partial<SaleFormValues>;
  onSubmit: (v: SaleFormValues) => Promise<void>;
  submitting: boolean;
}) {
  const form = useForm<SaleFormValues>({
    resolver: zodResolver(saleSchema),
    defaultValues: defaultValues ?? {
      saleDate: new Date().toISOString().slice(0, 10),
      productType: "table_eggs",
      breed: "Rhode Island Red",
      quantity: 1,
      unit: "trays",
      unitPrice: 0,
      buyerName: "",
      buyerContact: "",
      deliveryMethod: "pickup",
      deliveryAddress: null,
      paymentMethod: "cash",
      paymentStatus: "paid",
      amountPaid: 0,
      notes: null,
    },
  });

  const productType = form.watch("productType");
  const quantity = form.watch("quantity") || 0;
  const unitPrice = form.watch("unitPrice") || 0;
  const paymentStatus = form.watch("paymentStatus");
  const deliveryMethod = form.watch("deliveryMethod");
  const total = quantity * unitPrice;
  const amountPaid = form.watch("amountPaid") || 0;
  const balance = total - amountPaid;

  useEffect(() => {
    const preset = PRODUCT_TYPES.find((p) => p.value === productType);
    if (preset) form.setValue("unit", preset.unit);
  }, [productType]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFormSubmit = async (values: SaleFormValues) => {
    await onSubmit({
      ...values,
      amountPaid: values.paymentStatus === "paid" ? total : values.amountPaid,
    } as SaleFormValues);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4 max-h-[65vh] overflow-y-auto pr-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField control={form.control} name="saleDate" render={({ field }) => (
            <FormItem><FormLabel>Sale Date *</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="productType" render={({ field }) => (
            <FormItem><FormLabel>Product Type *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                <SelectContent>
                  {PRODUCT_TYPES.map((p) => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </FormItem>
          )} />
          <FormField control={form.control} name="breed" render={({ field }) => (
            <FormItem><FormLabel>Breed / Strain</FormLabel><FormControl><Input {...field} value={field.value ?? ""} placeholder="e.g. Dark Mahogany" /></FormControl></FormItem>
          )} />
          <FormField control={form.control} name="unit" render={({ field }) => (
            <FormItem><FormLabel>Unit</FormLabel><FormControl><Input {...field} placeholder="pcs / trays / heads" /></FormControl></FormItem>
          )} />
          <FormField control={form.control} name="quantity" render={({ field }) => (
            <FormItem><FormLabel>Quantity *</FormLabel><FormControl><Input type="number" min={0} {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="unitPrice" render={({ field }) => (
            <FormItem><FormLabel>Unit Price (₱) *</FormLabel><FormControl><Input type="number" step="0.01" min={0} {...field} /></FormControl><FormMessage /></FormItem>
          )} />

          <div className="sm:col-span-2 bg-[#3a0d0d]/5 rounded-xl p-4 flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Total Amount</span>
            <span className="text-2xl font-bold text-[#3a0d0d] font-serif">{currency(total)}</span>
          </div>

          <FormField control={form.control} name="buyerName" render={({ field }) => (
            <FormItem><FormLabel>Buyer Name *</FormLabel><FormControl><Input {...field} placeholder="Full name" /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="buyerContact" render={({ field }) => (
            <FormItem><FormLabel>Buyer Contact</FormLabel><FormControl><Input {...field} value={field.value ?? ""} placeholder="Phone / FB / WhatsApp" /></FormControl></FormItem>
          )} />

          <FormField control={form.control} name="deliveryMethod" render={({ field }) => (
            <FormItem><FormLabel>Delivery Method</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                <SelectContent>
                  {DELIVERY_METHODS.map((d) => <SelectItem key={d} value={d}>{d === "pickup" ? "Farm Pickup" : "Delivery"}</SelectItem>)}
                </SelectContent>
              </Select>
            </FormItem>
          )} />
          {deliveryMethod === "delivery" && (
            <FormField control={form.control} name="deliveryAddress" render={({ field }) => (
              <FormItem><FormLabel>Delivery Address</FormLabel><FormControl><Input {...field} value={field.value ?? ""} placeholder="Complete address" /></FormControl></FormItem>
            )} />
          )}

          <FormField control={form.control} name="paymentMethod" render={({ field }) => (
            <FormItem><FormLabel>Payment Method</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                <SelectContent>
                  {PAYMENT_METHODS.map((m) => <SelectItem key={m} value={m}>{m === "gcash" ? "GCash" : m === "bank_transfer" ? "Bank Transfer" : "Cash"}</SelectItem>)}
                </SelectContent>
              </Select>
            </FormItem>
          )} />
          <FormField control={form.control} name="paymentStatus" render={({ field }) => (
            <FormItem><FormLabel>Payment Status</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                <SelectContent>
                  {PAYMENT_STATUSES.map((s) => <SelectItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>)}
                </SelectContent>
              </Select>
            </FormItem>
          )} />

          {paymentStatus !== "paid" && (
            <FormField control={form.control} name="amountPaid" render={({ field }) => (
              <FormItem><FormLabel>Amount Paid (₱)</FormLabel><FormControl><Input type="number" step="0.01" min={0} {...field} /></FormControl></FormItem>
            )} />
          )}
          {paymentStatus !== "paid" && (
            <div className="flex flex-col justify-center">
              <span className="text-xs text-muted-foreground mb-1">Balance Due</span>
              <span className="text-lg font-bold text-red-600">{currency(balance)}</span>
            </div>
          )}

          <FormField control={form.control} name="notes" render={({ field }) => (
            <FormItem className="sm:col-span-2">
              <FormLabel>Notes</FormLabel>
              <FormControl><Textarea {...field} value={field.value ?? ""} rows={2} placeholder="Any additional details about this sale…" /></FormControl>
            </FormItem>
          )} />
        </div>

        <div className="pt-2 flex justify-end gap-3 sticky bottom-0 bg-white pb-1">
          <Button type="submit" disabled={submitting} className="bg-[#3a0d0d] hover:bg-[#5a1919] text-white">
            {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Save Sale
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default function Sales() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [records, setRecords] = useState<SalesRecord[]>([]);
  const [fetching, setFetching] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<SalesRecord | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SalesRecord | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [filterProduct, setFilterProduct] = useState<string>("all");

  useEffect(() => {
    if (!loading && !user) setLocation("/login");
  }, [user, loading, setLocation]);

  const loadRecords = async () => {
    try {
      const { records } = await api.sales.list();
      setRecords(records);
    } catch {}
    finally { setFetching(false); }
  };

  useEffect(() => {
    if (user) loadRecords();
  }, [user]);

  const handleSubmit = async (values: SaleFormValues) => {
    setSubmitting(true);
    try {
      const total = (values.quantity || 0) * (values.unitPrice || 0);
      const payload = {
        ...values,
        unitPrice: String(values.unitPrice),
        totalAmount: String(total),
        amountPaid: String(values.amountPaid ?? 0),
        balance: String(total - (values.amountPaid ?? 0)),
      };
      if (editing) {
        const { record } = await api.sales.update(editing.id, payload as Partial<SalesRecord>);
        setRecords((prev) => prev.map((r) => (r.id === record.id ? record : r)));
      } else {
        const { record } = await api.sales.create(payload as Partial<SalesRecord>);
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
      await api.sales.delete(deleteTarget.id);
      setRecords((prev) => prev.filter((r) => r.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const openAdd = () => { setEditing(null); setDialogOpen(true); };
  const openEdit = (r: SalesRecord) => { setEditing(r); setDialogOpen(true); };

  const filteredRecords = useMemo(
    () => (filterProduct === "all" ? records : records.filter((r) => r.productType === filterProduct)),
    [records, filterProduct],
  );

  const totals = useMemo(() => {
    const revenue = filteredRecords.reduce((sum, r) => sum + parseFloat(r.totalAmount || "0"), 0);
    const outstanding = filteredRecords.reduce((sum, r) => sum + parseFloat(r.balance || "0"), 0);
    return { revenue, outstanding, count: filteredRecords.length };
  }, [filteredRecords]);

  if (loading || !user) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  const productLabel = (v: string) => PRODUCT_TYPES.find((p) => p.value === v)?.label ?? v;

  const paymentColor = (s: string) => {
    if (s === "paid") return "bg-green-100 text-green-700";
    if (s === "partial") return "bg-amber-100 text-amber-700";
    return "bg-red-100 text-red-700";
  };

  return (
    <div className="min-h-screen bg-background">
      <AppNav />
      <main className="pt-20 md:pt-16 pb-16 container mx-auto px-4 md:px-6">
        <div className="pt-8 pb-6 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground font-serif">Sales Log</h1>
            <p className="text-muted-foreground mt-1">
              Track fertile eggs, table eggs, and live chicken sales — freely, no approval needed.
            </p>
          </div>
          <Button onClick={openAdd} className="bg-[#3a0d0d] hover:bg-[#5a1919] text-white gap-2">
            <Plus className="w-4 h-4" /> Record Sale
          </Button>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="rounded-2xl border border-border/50 p-5 bg-white">
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1"><ReceiptText className="w-4 h-4" /> Transactions</div>
            <p className="text-2xl font-bold text-foreground">{totals.count}</p>
          </div>
          <div className="rounded-2xl border border-border/50 p-5 bg-white">
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1"><TrendingUp className="w-4 h-4" /> Total Revenue</div>
            <p className="text-2xl font-bold text-green-700">{currency(totals.revenue)}</p>
          </div>
          <div className="rounded-2xl border border-border/50 p-5 bg-white">
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">Outstanding Balance</div>
            <p className="text-2xl font-bold text-red-600">{currency(totals.outstanding)}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm text-muted-foreground">Filter:</span>
          {["all", ...PRODUCT_TYPES.map((p) => p.value)].map((v) => (
            <button
              key={v}
              onClick={() => setFilterProduct(v)}
              className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                filterProduct === v ? "bg-[#3a0d0d] text-white" : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {v === "all" ? "All Products" : productLabel(v)}
            </button>
          ))}
        </div>

        {fetching ? (
          <div className="flex items-center justify-center py-24"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>
        ) : filteredRecords.length === 0 ? (
          <div className="text-center py-24 bg-muted/30 rounded-3xl border border-border/50">
            <ReceiptText className="w-14 h-14 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No sales recorded yet</h3>
            <p className="text-muted-foreground mb-6">Start logging your egg and chicken sales freely.</p>
            <Button onClick={openAdd} className="bg-[#3a0d0d] text-white gap-2">
              <Plus className="w-4 h-4" /> Record First Sale
            </Button>
          </div>
        ) : (
          <div className="rounded-2xl border border-border/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[#3a0d0d] text-white">
                  <tr>
                    {["Date", "Product", "Breed", "Qty", "Unit Price", "Total", "Buyer", "Delivery", "Payment", ""].map((h) => (
                      <th key={h} className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.map((r, i) => (
                    <tr key={r.id} className={`border-b border-border/30 hover:bg-muted/30 transition-colors ${i % 2 === 0 ? "bg-white" : "bg-muted/10"}`}>
                      <td className="px-3 py-3 text-muted-foreground whitespace-nowrap text-xs">{new Date(r.saleDate).toLocaleDateString()}</td>
                      <td className="px-3 py-3 font-medium text-foreground whitespace-nowrap">{productLabel(r.productType)}</td>
                      <td className="px-3 py-3 text-muted-foreground whitespace-nowrap text-xs">{r.breed || "—"}</td>
                      <td className="px-3 py-3 text-center">{r.quantity} {r.unit}</td>
                      <td className="px-3 py-3 whitespace-nowrap">{currency(r.unitPrice)}</td>
                      <td className="px-3 py-3 font-semibold text-[#3a0d0d] whitespace-nowrap">{currency(r.totalAmount)}</td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <p className="text-foreground text-xs font-medium">{r.buyerName}</p>
                        <p className="text-muted-foreground text-xs">{r.buyerContact || "—"}</p>
                      </td>
                      <td className="px-3 py-3 text-xs whitespace-nowrap capitalize">{r.deliveryMethod}</td>
                      <td className="px-3 py-3">
                        <Badge className={`text-xs ${paymentColor(r.paymentStatus)}`}>{r.paymentStatus}</Badge>
                      </td>
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
          You can freely add, edit, or delete your sales at any time. Deleted entries are retained by the farm admin for auditing.
        </p>
      </main>

      <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) setEditing(null); }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle className="font-serif text-[#3a0d0d]">{editing ? "Edit Sale" : "Record New Sale"}</DialogTitle></DialogHeader>
          <SaleForm
            defaultValues={editing ? {
              saleDate: editing.saleDate,
              productType: editing.productType,
              breed: editing.breed,
              quantity: editing.quantity,
              unit: editing.unit,
              unitPrice: parseFloat(editing.unitPrice),
              buyerName: editing.buyerName,
              buyerContact: editing.buyerContact,
              deliveryMethod: editing.deliveryMethod as "pickup" | "delivery",
              deliveryAddress: editing.deliveryAddress,
              paymentMethod: editing.paymentMethod as "cash" | "gcash" | "bank_transfer",
              paymentStatus: editing.paymentStatus as "paid" | "pending" | "partial",
              amountPaid: parseFloat(editing.amountPaid),
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
            <AlertDialogTitle>Remove Sale Record</AlertDialogTitle>
            <AlertDialogDescription>
              Remove this sale to <strong>{deleteTarget?.buyerName}</strong>? The farm admin retains a copy for auditing.
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
