import { Card, CardContent } from "@/components/ui/card";
import { UsersRound } from "lucide-react";

export default function Teams() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Teams</h1>
      </div>

      <Card className="bg-white shadow-sm border border-slate-200">
        <CardContent className="p-12 text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <UsersRound className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Teams Management</h2>
          <p className="text-slate-600 max-w-md mx-auto">
            Manage your project teams and collaboration. Features coming soon include team creation, 
            member assignments, project allocations, and team performance tracking.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
