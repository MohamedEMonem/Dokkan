import { UploadCloud, Plus } from "lucide-react";

interface ImageSlotProps {
  index: number;
  src?: string;
  isMain?: boolean;
  onUpload: (index: number) => void;
}

export const ImageSlot = ({ index, src, isMain, onUpload }: ImageSlotProps) => (
  <div className={`relative group ${!isMain && "aspect-square"}`}>
    {src ? (
      <div className={`relative ${isMain ? "h-64 w-full" : "h-full w-full"} rounded-${isMain ? "2xl" : "xl"} overflow-hidden border border-accent-light bg-accent-light/10 shadow-sm`}>
        <img
          src={src}
          alt={isMain ? "الصورة الأساسية" : `صورة ${index}`}
          className={`w-full h-full object-contain transition-transform ${isMain ? "duration-500 group-hover:scale-105" : "duration-300 group-hover:scale-110"}`}
        />
        <div
          onClick={() => onUpload(index)}
          className={`absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all ${isMain ? "duration-300 flex-col gap-2" : "duration-200"} flex items-center justify-center cursor-pointer`}
        >
          <div className={`${isMain ? "p-3" : "p-2"} bg-white/90 text-primary rounded-full shadow-md transition-transform hover:scale-110`}>
            <UploadCloud className={isMain ? "w-6 h-6" : "w-4 h-4"} />
          </div>
          {isMain && <span className="text-white text-sm font-medium">تغيير الصورة</span>}
        </div>
        {isMain && (
          <div className="absolute top-4 right-4 bg-primary text-white text-[10px] px-3 py-1 rounded-full font-bold shadow-sm">
            الصورة الأساسية
          </div>
        )}
      </div>
    ) : (
      <div
        onClick={() => onUpload(index)}
        className={`${isMain ? "h-64 flex-col" : "h-full w-full"} border-2 border-dashed border-accent-light bg-[#fbf9f4] rounded-${isMain ? "2xl" : "xl"} flex items-center justify-center text-text-muted hover:border-primary hover:bg-primary/5 transition-all cursor-pointer group`}
      >
        {isMain ? (
          <>
            <div className="p-4 bg-white rounded-full shadow-sm mb-4 group-hover:scale-110 transition-transform">
              <UploadCloud className="w-10 h-10 text-primary" />
            </div>
            <p className="font-medium text-text-dark">اسحب الصورة الأساسية هنا أو انقر للاختيار</p>
            <p className="text-xs mt-1 opacity-70">PNG, JPG, JPEG</p>
          </>
        ) : (
          <Plus className="w-6 h-6 group-hover:scale-110 group-hover:text-primary transition-all" />
        )}
      </div>
    )}
  </div>
);
