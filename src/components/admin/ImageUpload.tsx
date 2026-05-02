import { useRef, useState } from "react";
import { Upload, Loader2, X, ImageIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Props = {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  compact?: boolean;
};

const ImageUpload = ({ value, onChange, label = "Image", compact }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }
    setUploading(true);
    const ext = file.name.split(".").pop() || "jpg";
    const path = `cars/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await supabase.storage.from("car-images").upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });
    if (error) {
      setUploading(false);
      return toast.error(error.message);
    }
    const { data } = supabase.storage.from("car-images").getPublicUrl(path);
    onChange(data.publicUrl);
    setUploading(false);
    toast.success("Image uploaded");
  };

  return (
    <div>
      <label className={`block font-medium mb-1 ${compact ? "text-xs text-muted-foreground" : "text-sm"}`}>{label}</label>
      <div className="flex items-center gap-3">
        <div className="relative w-20 h-20 rounded-xl border border-border bg-secondary overflow-hidden shrink-0 flex items-center justify-center">
          {value ? (
            <>
              <img src={value} alt="preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => onChange("")}
                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-background/90 border border-border flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground transition-colors"
                aria-label="Remove image"
              >
                <X className="w-3 h-3" />
              </button>
            </>
          ) : (
            <ImageIcon className="w-6 h-6 text-muted-foreground" />
          )}
        </div>

        <div className="flex-1 space-y-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-2 px-4 h-9 rounded-lg bg-secondary border border-border text-sm font-semibold hover:bg-secondary/70 disabled:opacity-60 w-full sm:w-auto justify-center"
          >
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {uploading ? "Uploading…" : "Upload image"}
          </button>
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="…or paste image URL"
            className="w-full h-9 px-3 rounded-lg bg-background border border-border text-xs focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
            e.target.value = "";
          }}
        />
      </div>
    </div>
  );
};

export default ImageUpload;
