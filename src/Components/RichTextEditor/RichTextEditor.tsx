// components/RichTextEditor.tsx
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'

import { Bold, Italic, Underline as UnderlineIcon, List, ListOrdered, Heading } from 'lucide-react'

interface Props {
  onChange: (html: string) => void
  placeholder?: string
}

export const RichTextEditor = ({ onChange, placeholder }: Props) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
    ],
    content: '',
    onUpdate({ editor }) {
      onChange(editor.getHTML())
    },
  })

  if (!editor) return null

  return (
    <div className="border rounded-md p-4">
      <div className="flex gap-2 mb-3">
        <button onClick={() => editor.chain().focus().toggleBold().run()}>
          <Bold size={16} />
        </button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()}>
          <Italic size={16} />
        </button>
        <button onClick={() => editor.chain().focus().toggleUnderline().run()}>
          <UnderlineIcon size={16} />
        </button>
        <button onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <List size={16} />
        </button>
        <button onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          <ListOrdered size={16} />
        </button>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          <Heading size={16} />
        </button>
      </div>
      <EditorContent editor={editor} className="prose border rounded" />
    </div>
  )
}
