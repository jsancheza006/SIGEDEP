import BentoCard from "./BentoCard";

export default function BentoGridDemo() {
  return (
    <main className="p-6 bg-gray-50 min-h-screen">
      <div className="grid grid-cols-3 grid-rows-[auto_auto_auto] gap-4 max-w-[1300px] mx-auto mt-10">

        {/* FILA 1 - 3 CARDS NORMALES */}
        <BentoCard type="fiscalizacion" />
        <BentoCard type="analisis" />
        <BentoCard type="documentacion" />

        {/* FILA 2 - CARD GRANDE + 1 CARD VERTICAL */}
        <div className="col-span-2 row-span-1">
          <BentoCard type="fases" />
        </div>
        <div className="row-span-2">
          <BentoCard type="calendario" />
        </div>

        {/* FILA 3 - 2 CARDS ÚNICAS */}
        <BentoCard type="reportes" />
        <BentoCard type="reportes" />

      </div>
    </main>
  );
}
