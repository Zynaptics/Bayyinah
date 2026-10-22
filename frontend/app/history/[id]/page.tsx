import Link from "next/link";
import { notFound } from "next/navigation";
import DeleteButton from "@/components/DeleteButton";
import LocalTime from "@/components/LocalTime";
import ResultView from "@/components/ResultView";
import { MODALITY_LABEL } from "@/lib/labels";
import { backend } from "@/lib/server";
import type { DetectionResult } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function Detail({ params }: { params: { id: string } }) {
  const { data, error } = await backend<{ created_at: string; label: string; result: DetectionResult }>(
    `/api/history/${encodeURIComponent(params.id)}`);
  if (!data) {
    if (error && error.includes("no longer exists")) notFound();
    return <main className="page"><p role="alert" className="error">{error}</p></main>;
  }
  const { result } = data;
  return (
    <main className="page">
      <p><Link href="/history">Back to history</Link></p>
      <header className="page-head">
        <div>
          <h1 className="page-title">{data.label}</h1>
          <p className="sub">{MODALITY_LABEL[result.modality]} check, <LocalTime iso={data.created_at} />. The original was not stored.</p>
        </div>
        <DeleteButton id={params.id} label="Delete" />
      </header>
      <ResultView result={result} source={null} />
    </main>
  );
}
