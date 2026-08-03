export function AdomLogo({ className = "w-32", align = "center" }: { className?: string, align?: "left" | "center" | "right" }) {
  const objectPosition = align === "left" ? "object-left" : align === "right" ? "object-right" : "object-center";
  const flexJustify = align === "left" ? "justify-start" : align === "right" ? "justify-end" : "justify-center";
  
  return (
    <div className={`relative flex items-center ${flexJustify} font-bold text-slate-800 ${className}`} style={{ aspectRatio: '4/1' }}>
      <img 
        src="/logo-adom-original-01.jpg" 
        alt="ADOM Logo" 
        className={`absolute inset-0 w-full h-full object-contain ${objectPosition} bg-white`}
      />
    </div>
  );
}

