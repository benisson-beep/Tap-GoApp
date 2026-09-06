import React from "react";
import Image from "next/image";

interface ACMobilityLogoProps {
  className?: string;
  variant?: "full" | "icon" | "image";
  height?: number;
}

export const ACMobilityLogo: React.FC<ACMobilityLogoProps> = ({
  className = "",
  variant = "image",
  height = 36,
}) => {
  if (variant === "image") {
    return (
      <div className={`inline-flex items-center ${className}`}>
        <img
          src="/images/ac-mobility.png"
          alt="AC Mobility - Smart transport redefined"
          className="h-8 sm:h-9 w-auto object-contain"
        />
      </div>
    );
  }

  // Vector render of AC Mobility branding
  return (
    <div className={`inline-flex flex-col items-start ${className}`}>
      <div className="flex items-center gap-1.5">
        {/* The AC Mobility 'a' and 'c' interconnected circle glyph */}
        <div className="relative flex items-center">
          {/* Cyan 'a' outer ring with speed bars inside */}
          <div className="w-8 h-8 rounded-full border-[2.5px] border-[#00A3E0] flex flex-col justify-center items-center gap-0.5 p-1 relative">
            <div className="w-3.5 h-[2px] bg-[#163B82] rounded-full self-start ml-1" />
            <div className="w-4.5 h-[2px] bg-[#163B82] rounded-full self-start ml-0.5" />
            <div className="w-3 h-[2px] bg-[#163B82] rounded-full self-start ml-1" />
          </div>
          {/* Cyan 'c' right crescent */}
          <div className="w-7 h-7 rounded-full border-[2.5px] border-r-transparent border-t-[#00A3E0] border-b-[#00A3E0] border-l-transparent -ml-2 rotate-45" />
        </div>

        {/* 'mobility' in deep royal blue */}
        <span className="font-bold text-xl tracking-tight text-[#163B82] dark:text-cyan-300 font-sans">
          mobility
        </span>
      </div>

      <span className="text-[9px] font-semibold text-[#00A3E0] tracking-wide mt-0.5">
        Smart transport redefined
      </span>
    </div>
  );
};
