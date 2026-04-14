import { Card3D } from "../components/interactive/Card3D";

export default function Test() {
  return (
    <>
      <div className="absolute w-64 h-96 bg-zinc-900 rounded-3xl border-0 border-primary-500 shadow-[0_0_50px_-12px_rgba(16,185,129,0.3)] z-10 overflow-hidden">
        <div className="absolute inset-0 bg-primary-500/5 mix-blend-overlay" />
        <Card3D />
      </div>
    </>
  );
}
