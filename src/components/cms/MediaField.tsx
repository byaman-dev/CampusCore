import { useMutation, useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { adminMediaLibrary, adminUpload } from "@/lib/admin-cms.functions";

const field =
  "mt-1 w-full rounded-sm border border-background/20 bg-background/[0.06] px-3 py-2.5 text-sm text-background outline-none transition focus:border-background/50";
const chip =
  "min-h-9 rounded-sm px-2.5 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors disabled:opacity-50 text-background/60 ring-1 ring-background/20 hover:bg-background/10";

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result ?? "");
      const comma = result.indexOf(",");
      resolve(comma >= 0 ? result.slice(comma + 1) : result);
    };
    reader.onerror = () => reject(reader.error ?? new Error("Could not read file"));
    reader.readAsDataURL(file);
  });
}

/** File input that uploads via adminUpload (base64), or lets the admin pick
 * from the media library or paste a URL directly. Value is always a URL string. */
export function MediaField({
  id,
  value,
  onChange,
  bucket = "media",
  kind = "image",
}: {
  id: string;
  value: string;
  onChange: (url: string) => void;
  bucket?: "media" | "documents";
  kind?: "image" | "file";
}) {
  const uploadFn = useServerFn(adminUpload);
  const libraryFn = useServerFn(adminMediaLibrary);
  const inputRef = useRef<HTMLInputElement>(null);
  const [showLibrary, setShowLibrary] = useState(false);

  const library = useQuery({
    queryKey: ["admin-media-library"],
    queryFn: () => libraryFn(),
    enabled: showLibrary,
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const base64 = await fileToBase64(file);
      return uploadFn({ data: { bucket, filename: file.name, contentType: file.type, base64 } });
    },
    onSuccess: (res) => {
      onChange(res.url);
      toast.success("File uploaded");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <input
          id={id}
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https:// or upload below"
          className={field}
        />
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <input
          ref={inputRef}
          type="file"
          accept={kind === "image" ? "image/*" : undefined}
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) uploadMutation.mutate(file);
            e.target.value = "";
          }}
        />
        <button type="button" className={chip} onClick={() => inputRef.current?.click()} disabled={uploadMutation.isPending}>
          {uploadMutation.isPending ? "Uploading…" : "Upload file"}
        </button>
        <button type="button" className={chip} onClick={() => setShowLibrary((v) => !v)}>
          {showLibrary ? "Hide media library" : "Choose from library"}
        </button>
        {value ? (
          <button type="button" className={chip} onClick={() => onChange("")}>
            Clear
          </button>
        ) : null}
      </div>
      {kind === "image" && value ? (
        <img src={value} alt="" className="mt-2 h-20 w-20 rounded-sm object-cover ring-1 ring-background/10" />
      ) : null}
      {showLibrary ? (
        <div className="mt-2 max-h-56 overflow-y-auto rounded-sm ring-1 ring-background/15">
          {library.isLoading ? (
            <p className="p-3 font-mono text-[11px] text-background/50">Loading media…</p>
          ) : (library.data ?? []).length === 0 ? (
            <p className="p-3 font-mono text-[11px] text-background/50">No uploads yet.</p>
          ) : (
            <ul className="divide-y divide-background/10">
              {(library.data ?? []).map((item) => (
                <li key={item["id"] as string}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(item["url"] as string);
                      setShowLibrary(false);
                    }}
                    className="flex w-full min-h-11 items-center gap-2 px-3 py-2 text-left text-sm text-background/80 hover:bg-background/[0.08]"
                  >
                    <span className="truncate">{(item["title"] as string) ?? (item["path"] as string)}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  );
}
