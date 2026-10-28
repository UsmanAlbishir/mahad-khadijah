"use client";

import React from "react";
import { Clock, BookCheck, UserPlus, ClipboardList, Receipt, Calendar } from "lucide-react";

interface ActivityItem {
  id: string;
  title: string;
  description: string;
  timeAgo: string;
  category: string;
  badge: string;
}

interface RecentActivityProps {
  activities: ActivityItem[];
  isEmpty?: boolean;
}

export function RecentActivityCard({ activities, isEmpty = false }: RecentActivityProps) {
  if (isEmpty || activities.length === 0) {
    return (
      <div className="bg-card text-card-foreground rounded-xl border border-border p-5 shadow-xs flex flex-col justify-center items-center text-center py-12">
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground mb-3">
          <Clock className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-bold text-foreground">No Recent Activity</h4>
        <p className="text-xs text-muted-foreground max-w-xs mt-1">
          Recent events and student memorisation logs will appear here as records are recorded.
        </p>
      </div>
    );
  }

  const getIcon = (category: string) => {
    switch (category) {
      case "memorisation":
        return <BookCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case "student":
        return <UserPlus className="w-4 h-4 text-[#174D3A] dark:text-[#C6A45A]" />;
      case "attendance":
        return <ClipboardList className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      case "payment":
        return <Receipt className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
      default:
        return <Calendar className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="bg-card text-card-foreground rounded-xl border border-border p-5 shadow-xs flex flex-col">
      <div className="flex items-center justify-between pb-3 border-b border-border mb-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#C6A45A]" />
          <h3 className="text-sm font-bold text-foreground">
            Recent Halaqah & School Activity
          </h3>
        </div>
        <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full font-medium">
          Fictional Feed
        </span>
      </div>

      <div className="space-y-3 flex-1 overflow-y-auto">
        {activities.map((act) => (
          <div
            key={act.id}
            className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-muted/50 transition border border-transparent hover:border-border/60"
          >
            <div className="p-2 rounded-lg bg-muted shrink-0 mt-0.5">
              {getIcon(act.category)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-semibold text-foreground truncate">
                  {act.title}
                </p>
                <span className="text-[10px] text-muted-foreground shrink-0 font-medium">
                  {act.timeAgo}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                {act.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
