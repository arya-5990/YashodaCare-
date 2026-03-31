export default function TrustBar() {
  return (
    <section className="bg-surface-container-low py-10">
      <div className="max-w-7xl mx-auto px-5 md:px-8 flex flex-wrap justify-between items-center gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
        <span className="text-label-md md:text-title-lg font-semibold text-surface-tint uppercase tracking-[0.25em]">
          HEALTHSURE
        </span>
        <span className="text-label-md md:text-title-lg font-semibold text-surface-tint uppercase tracking-[0.25em]">
          DENTAGRID
        </span>
        <span className="text-label-md md:text-title-lg font-semibold text-surface-tint uppercase tracking-[0.25em]">
          MEDICORE
        </span>
        <span className="text-label-md md:text-title-lg font-semibold text-surface-tint uppercase tracking-[0.25em]">
          PRIMECARE
        </span>
      </div>
    </section>
  );
}
