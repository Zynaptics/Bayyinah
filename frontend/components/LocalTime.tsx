"use client";
import { useEffect, useState } from "react";

/** Renders a UTC timestamp in the visitor's own timezone. */
export default function LocalTime({ iso }: { iso: string }) {
  const [text, setText] = useState(iso.slice(0, 16).replace("T", " ") + " UTC");
  useEffect(() => {
    setText(new Date(iso).toLocaleString([], { dateStyle: "medium", timeStyle: "short" }));
  }, [iso]);
  return <time dateTime={iso}>{text}</time>;
}
