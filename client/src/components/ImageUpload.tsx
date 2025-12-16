import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, ImageIcon } from "lucide-react";

interface ImageUploadProps {
  images: File[];
  onImagesChange: (images: File[]) => void;
  maxImages?: number;
  maxSizeMB?: number;
}

export default function ImageUpload({
  images,
  onImagesChange,
  maxImages = 3,
  maxSizeMB = 15,
}: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = useCallback(
    (file: File): boolean => {
      if (!file.type.startsWith("image/")) {
        setError("Por favor, selecione apenas arquivos de imagem.");
        return false;
      }
      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(`O arquivo deve ter no máximo ${maxSizeMB}MB.`);
        return false;
      }
      return true;
    },
    [maxSizeMB]
  );

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return;
      setError(null);

      const newFiles: File[] = [];
      const remainingSlots = maxImages - images.length;

      for (let i = 0; i < Math.min(files.length, remainingSlots); i++) {
        if (validateFile(files[i])) {
          newFiles.push(files[i]);
        }
      }

      if (files.length > remainingSlots) {
        setError(`Máximo de ${maxImages} imagens permitidas.`);
      }

      if (newFiles.length > 0) {
        onImagesChange([...images, ...newFiles]);
      }
    },
    [images, maxImages, onImagesChange, validateFile]
  );

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const removeImage = useCallback(
    (index: number) => {
      const newImages = [...images];
      newImages.splice(index, 1);
      onImagesChange(newImages);
      setError(null);
    },
    [images, onImagesChange]
  );

  return (
    <div className="space-y-4">
      {images.length < maxImages && (
        <div
          className={`relative border-2 border-dashed rounded-md p-8 text-center transition-colors ${
            dragActive
              ? "border-primary bg-primary/5"
              : "border-input hover:border-primary/50"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleFiles(e.target.files)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            data-testid="input-image-upload"
          />
          <div className="flex flex-col items-center gap-2">
            <div className="p-3 bg-primary/10 rounded-full">
              <Upload className="h-6 w-6 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">
              Arraste imagens aqui ou clique para selecionar
            </p>
            <p className="text-xs text-muted-foreground">
              Máximo {maxImages} imagens, até {maxSizeMB}MB cada
            </p>
          </div>
        </div>
      )}

      {error && (
        <p className="text-sm text-destructive" data-testid="text-upload-error">
          {error}
        </p>
      )}

      {images.length > 0 && (
        <div className="flex flex-wrap gap-4">
          {images.map((file, index) => (
            <div
              key={index}
              className="relative group w-28 h-28 rounded-md overflow-hidden border border-border"
              data-testid={`image-preview-${index}`}
            >
              <img
                src={URL.createObjectURL(file)}
                alt={`Preview ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeImage(index)}
                data-testid={`button-remove-image-${index}`}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
          {images.length < maxImages && (
            <div className="relative w-28 h-28 rounded-md border-2 border-dashed border-input flex items-center justify-center hover:border-primary/50 transition-colors cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFiles(e.target.files)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <ImageIcon className="h-6 w-6 text-muted-foreground" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
