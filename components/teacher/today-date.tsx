"use client";

import { useEffect, useState } from "react";
import { formatDate, localDateValue } from "@/components/teacher/teacher-demo-data";

export function TodayDate() {
  const [date, setDate] = useState("");

  useEffect(() => {
    setDate(localDateValue());
  }, []);

  return <>{date ? formatDate(date, { dateStyle: "full" }) : "Loading date"}</>;
}