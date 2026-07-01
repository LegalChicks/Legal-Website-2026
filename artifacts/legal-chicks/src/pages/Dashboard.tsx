import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { api, type PoultryRecord } from "@/lib/api";
import { useLocation } from "wouter";
import { AppNav } from "@/components/AppNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Egg,
  Users,
  ClipboardList,
  TrendingUp,
  ArrowRight,
  Loader2,
} from "lucide-react";

export default function Dashboard() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [records, setRecords] = useState<PoultryRecord[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) setLocation("/login");
  }, [user, loading, setLocation]);

  useEffect(() => {
    if (!user) return;
    api.records
      .list()
      .then(({ records }) => setRecords(records))
      .catch(() => {})
      .finally(() => setFetching(false));
  }, [user]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const totalBirds = records.reduce((s, r) => s + (r.quantity ?? 0), 0);
  const totalEggs = records.reduce((s, r) => s + (r.eggProduction ?? 0), 0);
  const totalMortality = records.reduce((s, r) => s + (r.mortalityCount ?? 0), 0);
  const recentRecords = [...records]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const stats = [
    {
      label: "Total Batches",
      value: records.length,
      icon: <ClipboardList className="w-5 h-5 text-primary" />,
      color: "bg-primary/10",
    },
    {
      label: "Total Birds",
      value: totalBirds.toLocaleString(),
      icon: <Users className="w-5 h-5 text-amber-600" />,
      color: "bg-amber-50",
    },
    {
      label: "Eggs Produced",
      value: totalEggs.toLocaleString(),
      icon: <Egg className="w-5 h-5 text-yellow-600" />,
      color: "bg-yellow-50",
    },
    {
      label: "Mortality",
      value: totalMortality.toLocaleString(),
      icon: <TrendingUp className="w-5 h-5 text-red-500" />,
      color: "bg-red-50",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <AppNav />
      <main className="pt-20 md:pt-16 pb-16 container mx-auto px-4 md:px-6">
        <div className="pt-8 pb-6">
          <h1 className="text-3xl font-bold text-foreground font-serif">
            Welcome back, {user.fullName.split(" ")[0]}!
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's a summary of your flock performance.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <Card key={stat.label} className="border-border/50">
              <CardContent className="p-5">
                <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mb-3`}>
                  {stat.icon}
                </div>
                <p className="text-2xl font-bold text-foreground">{fetching ? "—" : stat.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-border/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center justify-between">
                Recent Batches
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setLocation("/records")}
                  className="text-primary hover:text-primary gap-1"
                >
                  View All <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {fetching ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : recentRecords.length === 0 ? (
                <div className="text-center py-8">
                  <ClipboardList className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-muted-foreground text-sm">No records yet.</p>
                  <Button
                    size="sm"
                    className="mt-4 bg-primary text-white"
                    onClick={() => setLocation("/records")}
                  >
                    Add Your First Record
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentRecords.map((record) => (
                    <div
                      key={record.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-muted/40 hover:bg-muted/60 transition-colors"
                    >
                      <div>
                        <p className="font-medium text-sm text-foreground">{record.batchName}</p>
                        <p className="text-xs text-muted-foreground">
                          {record.breed || record.birdType || "RIR"} · {record.quantity} birds
                        </p>
                      </div>
                      <Badge
                        className={`text-xs ${
                          record.healthStatus?.toLowerCase().includes("healthy")
                            ? "bg-green-100 text-green-700"
                            : record.healthStatus
                            ? "bg-amber-100 text-amber-700"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {record.healthStatus || "No status"}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                {
                  label: "Log a New Batch",
                  desc: "Add poultry record for a new flock or batch",
                  icon: <ClipboardList className="w-5 h-5 text-primary" />,
                  action: () => setLocation("/records"),
                },
                {
                  label: "View All Records",
                  desc: "See the full history of all your farm batches",
                  icon: <TrendingUp className="w-5 h-5 text-amber-600" />,
                  action: () => setLocation("/records"),
                },
                {
                  label: "Public Farm Page",
                  desc: "Visit the LCPF marketing website",
                  icon: <Egg className="w-5 h-5 text-yellow-600" />,
                  action: () => window.open("/", "_blank"),
                },
              ].map((action) => (
                <button
                  key={action.label}
                  onClick={action.action}
                  className="w-full flex items-center gap-4 p-4 rounded-xl border border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-all text-left group"
                >
                  <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    {action.icon}
                  </div>
                  <div>
                    <p className="font-medium text-sm text-foreground">{action.label}</p>
                    <p className="text-xs text-muted-foreground">{action.desc}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground ml-auto group-hover:text-primary transition-colors" />
                </button>
              ))}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
