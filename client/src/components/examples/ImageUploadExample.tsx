import { useState } from "react";
import ImageUpload from "../ImageUpload";

export default function ImageUploadExample() {
  const [images, setImages] = useState<File[]>([]);

  return (
    <div className="max-w-xl">
      <ImageUpload
        images={images}
        onImagesChange={setImages}
        maxImages={3}
        maxSizeMB={15}
      />
    </div>
  );
}
