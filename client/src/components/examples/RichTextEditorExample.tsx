import { useState } from "react";
import RichTextEditor from "../RichTextEditor";

export default function RichTextEditorExample() {
  const [content, setContent] = useState("<p>Escreva sua notícia aqui...</p>");

  return (
    <div className="max-w-2xl">
      <RichTextEditor
        content={content}
        onChange={setContent}
        placeholder="Escreva o conteúdo da notícia..."
      />
    </div>
  );
}
