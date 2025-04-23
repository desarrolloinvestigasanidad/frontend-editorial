// app/impersonate/page.tsx   ← **no** "use client"
import ImpersonateReceiver from "./ImpersonateReceiver";

export default function ImpersonatePage({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  // `searchParams` is available at build time, no Suspense needed here.
  return <ImpersonateReceiver token={searchParams.token} />;
}
