import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
  } from "recharts";
  
  // 🔥 DSS
  import { calculatePercentage, getLevel } from "@/lib/dss";
  
  type Report = {
    severity: string;
    estimated_area: string;
  };
  
  export const StatsChart = ({ reports }: { reports: Report[] }) => {
    // =========================
    // 🔥 HITUNG DISTRIBUSI
    // =========================
    const stats = {
      Rendah: 0,
      Sedang: 0,
      Tinggi: 0,
    };
  
    reports.forEach((r) => {
      const p = calculatePercentage(r.severity, r.estimated_area);
      const level = getLevel(p);
  
      stats[level]++;
    });
  
    const data = [
      { name: "Rendah", value: stats.Rendah },
      { name: "Sedang", value: stats.Sedang },
      { name: "Tinggi", value: stats.Tinggi },
    ];
  
    const COLORS = ["#10b981", "#f59e0b", "#ef4444"];
  
    return (
      <div className="rounded-2xl bg-card p-4 shadow-card">
        <h3 className="font-bold mb-2 text-secondary">
          Distribusi Kerusakan
        </h3>
  
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                outerRadius={80}
                label
              >
                {data.map((_, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
  
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };