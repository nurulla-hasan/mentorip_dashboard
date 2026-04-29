/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
import "./tiptap-editor.css";

import { useEditor, EditorContent, ReactNodeViewRenderer, NodeViewWrapper } from "@tiptap/react";
import { Node, Mark, mergeAttributes } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { X } from "lucide-react";

interface CloudinaryUploadResult {
  url: string;
  publicId: string;
  resourceType: string;
}

const generateSignature = async (publicId: string, timestamp: number, apiSecret: string) => {
  const str = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
  const msgUint8 = new TextEncoder().encode(str);
  const hashBuffer = await crypto.subtle.digest("SHA-1", msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
};

const deleteFromCloudinary = async (publicId: string, resourceType: string = "image") => {
  try {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
    const apiSecret = process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      console.warn("Cloudinary credentials missing. Deleting from editor only.");
      return;
    }

    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = await generateSignature(publicId, timestamp, apiSecret);

    const formData = new FormData();
    formData.append("public_id", publicId);
    formData.append("signature", signature);
    formData.append("api_key", apiKey);
    formData.append("timestamp", timestamp.toString());

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/destroy`,
      {
        method: "POST",
        body: formData,
      }
    );

    const result: unknown = await response.json();
    if ((result as { result?: string }).result === "ok") {
      console.log(`Successfully deleted ${resourceType} from Cloudinary:`, publicId);
    } else {
      console.error(`Failed to delete ${resourceType} from Cloudinary:`, result);
    }
  } catch (error: unknown) {
    console.error("Cloudinary delete error:", error);
  }
};

const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      publicId: {
        default: null,
        rendered: false,
      },
      resourceType: {
        default: "image",
        rendered: false,
      },
    };
  },
  renderHTML({ HTMLAttributes }) {
    return ["img", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)];
  },
  addNodeView() {
    return ReactNodeViewRenderer(({ node, HTMLAttributes, deleteNode }) => {
      return (
        <NodeViewWrapper className="relative inline-block group my-4">
          <img {...HTMLAttributes} className="rounded-lg border border-border" alt={HTMLAttributes.alt || ""} />
          <button
            onClick={(e) => {
              e.preventDefault();
              if (node.attrs.publicId) deleteFromCloudinary(node.attrs.publicId, node.attrs.resourceType);
              deleteNode();
            }}
            className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md z-10"
          >
            <X size={14} />
          </button>
        </NodeViewWrapper>
      );
    });
  },
});

// Custom Video Extension
// const Video = Node.create({
//   name: "video",
//   group: "block",
//   selectable: true,
//   draggable: true,
//   atom: true,

//   addAttributes() {
//     return {
//       src: {
//         default: null,
//       },
//       controls: {
//         default: true,
//       },
//       publicId: {
//         default: null,
//         rendered: false,
//       },
//       resourceType: {
//         default: "video",
//         rendered: false,
//       },
//     };
//   },

//   parseHTML() {
//     return [
//       {
//         tag: "video",
//       },
//     ];
//   },

//   renderHTML({ HTMLAttributes }: { HTMLAttributes: Record<string, any> }) {
//     return [
//       "video",
//       mergeAttributes(HTMLAttributes, {
//         controls: true,
//         class: "rounded-lg border border-border my-4",
//       }),
//     ];
//   },

//   addNodeView() {
//     return ReactNodeViewRenderer(({ node, HTMLAttributes, deleteNode }) => {
//       return (
//         <NodeViewWrapper className="relative inline-block group my-4">
//           <video {...HTMLAttributes} className="rounded-lg border border-border" controls />
//           <button
//             onClick={(e) => {
//               e.preventDefault();
//               if (node.attrs.publicId) deleteFromCloudinary(node.attrs.publicId, node.attrs.resourceType);
//               deleteNode();
//             }}
//             className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md z-10"
//           >
//             <X size={14} />
//           </button>
//         </NodeViewWrapper>
//       );
//     });
//   },
// });

// Custom Audio Extension
const Audio = Node.create({
  name: "audio",
  group: "block",
  selectable: true,
  draggable: true,
  atom: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      controls: {
        default: true,
      },
      publicId: {
        default: null,
        rendered: false,
      },
      resourceType: {
        default: "video",
        rendered: false,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "audio",
      },
    ];
  },

  renderHTML({ HTMLAttributes }: { HTMLAttributes: Record<string, any> }) {
    return [
      "audio",
      mergeAttributes(HTMLAttributes, {
        class: "w-full my-4",
      }),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(({ node, HTMLAttributes, deleteNode }) => {
      return (
        <NodeViewWrapper className="relative block group my-4">
          <audio {...HTMLAttributes} className="w-full" controls />
          <button
            onClick={(e) => {
              e.preventDefault();
              if (node.attrs.publicId) deleteFromCloudinary(node.attrs.publicId, node.attrs.resourceType);
              deleteNode();
            }}
            className="absolute -top-2 -right-2 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md z-10"
          >
            <X size={14} />
          </button>
        </NodeViewWrapper>
      );
    });
  },
});

// Custom File Attachment Extension
const FileAttachment = Node.create({
  name: "fileAttachment",
  group: "block",
  selectable: true,
  draggable: true,
  atom: true,

  addAttributes() {
    return {
      href: {
        default: null,
      },
      fileName: {
        default: "Download File",
      },
      fileSize: {
        default: "",
      },
      publicId: {
        default: null,
        rendered: false,
      },
      resourceType: {
        default: "raw",
        rendered: false,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="file-attachment"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }: { HTMLAttributes: Record<string, any> }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "data-type": "file-attachment",
        class: "relative group",
      }),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(({ node, deleteNode }) => {
      return (
        <NodeViewWrapper className="relative group my-4">
          <a
            href={node.attrs.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 border border-border rounded-lg no-underline hover:bg-muted transition-colors w-full"
          >
            <span className="p-2 bg-primary/10 rounded-md text-primary text-2xl">
              📄
            </span>
            <div className="flex flex-col gap-1 overflow-hidden">
              <span className="font-medium text-foreground truncate max-w-50 md:max-w-md">
                {node.attrs.fileName}
              </span>
              <span className="text-xs text-muted-foreground">
                {node.attrs.fileSize}
              </span>
            </div>
          </a>
          <button
            onClick={(e) => {
              e.preventDefault();
              if (node.attrs.publicId) deleteFromCloudinary(node.attrs.publicId, node.attrs.resourceType);
              deleteNode();
            }}
            className="absolute -top-2 -right-2 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md z-10"
          >
            <X size={14} />
          </button>
        </NodeViewWrapper>
      );
    });
  },
});

// Custom Youtube Extension
const Youtube = Node.create({
  name: "youtube",
  group: "block",
  selectable: true,
  draggable: true,
  atom: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "iframe[src*='youtube.com'], iframe[src*='youtu.be']",
      },
    ];
  },

  renderHTML({ HTMLAttributes }: { HTMLAttributes: Record<string, any> }) {
    return [
      "div",
      { class: "youtube-container my-4" },
      [
        "iframe",
        mergeAttributes(HTMLAttributes, {
          allowfullscreen: "true",
          frameborder: "0",
          class: "rounded-lg shadow-md",
        }),
      ],
    ];
  },
});

const InlineHeading = Mark.create({
  name: "inlineHeading",
  addAttributes() {
    return {
      level: {
        default: 1,
        parseHTML: (element: HTMLElement) => {
          const value = element.getAttribute("data-inline-heading");
          const parsed = value ? parseInt(value, 10) : 1;
          return Number.isNaN(parsed) ? 1 : parsed;
        },
        renderHTML: (attributes: { level?: number }) => {
          const level = attributes.level ?? 1;
          return {
            "data-inline-heading": String(level),
            class: `inline-heading inline-heading-${level}`,
          };
        },
      },
    };
  },
  parseHTML() {
    return [
      {
        tag: "span[data-inline-heading]",
      },
    ];
  },
  renderHTML({ HTMLAttributes }: { HTMLAttributes: Record<string, any> }) {
    return ["span", HTMLAttributes, 0];
  },
});

import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Quote,
  Undo,
  Redo,
  Link as LinkIcon,
  Upload,
  Code as CodeIcon,
  Table as TableIcon,
  Plus,
  Trash,
  Columns,
  Rows,
  Spline,
  Youtube as YoutubeIcon,
  Music,
} from "lucide-react";
import { useRef, useState } from "react";
import { Toggle } from "@/components/ui/toggle";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { FontFamily } from "@tiptap/extension-font-family";
import { TextStyle } from "@tiptap/extension-text-style";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface TiptapEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const TiptapEditor = ({ value, onChange, placeholder }: TiptapEditorProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const uploadFile = async (file: File): Promise<CloudinaryUploadResult> => {
    setIsUploading(true);

    try {
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

      if (!cloudName || !uploadPreset) {
        throw new Error("Cloudinary cloud name or upload preset is missing in environment variables.");
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        await response.json();
        throw new Error("Upload failed");
      }

      const data: unknown = await response.json();
      const typed = data as { secure_url: string; public_id: string; resource_type: string };
      setIsUploading(false);

      return {
        url: typed.secure_url,
        publicId: typed.public_id,
        resourceType: typed.resource_type,
      };
    } catch (error: unknown) {
      setIsUploading(false);
      console.error("Upload error:", error);
      throw error;
    }
  };

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        link: {
          openOnClick: false,
          HTMLAttributes: {
            class: "text-blue-500 underline",
          },
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      InlineHeading,
      CustomImage,
      // Video,
      Audio,
      Youtube,
      FileAttachment,
      Placeholder.configure({
        placeholder: placeholder || "Type here…",
        includeChildren: true,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableCell,
      TableHeader,
      TextStyle,
      FontFamily,
    ],
    content: value,
    editorProps: {
      attributes: {
        class: "max-w-none outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    immediatelyRender: false,
  });

  if (!editor) {
    return null;
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const addAudioLink = () => {
    const url = window.prompt("Enter Audio URL");
    if (url) {
      editor.chain().focus().insertContent(`<audio src="${url}" controls></audio>`).run();
    }
  };

  const addYoutubeLink = () => {
    const url = window.prompt("Enter YouTube URL (e.g., https://www.youtube.com/watch?v=...)");
    if (url) {
      // Basic conversion of watch?v= to embed/
      let embedUrl = url;
      if (url.includes("watch?v=")) {
        embedUrl = url.replace("watch?v=", "embed/");
      } else if (url.includes("youtu.be/")) {
        embedUrl = url.replace("youtu.be/", "youtube.com/embed/");
      }
      editor.chain().focus().insertContent({
        type: "youtube",
        attrs: { src: embedUrl }
      }).run();
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const { url, publicId, resourceType } = await uploadFile(file);
      const fileSize = (file.size / 1024).toFixed(1) + " KB";

      if (file.type.startsWith("image/")) {
        editor.chain().focus().insertContent({
          type: "image",
          attrs: { src: url, publicId: publicId, resourceType: resourceType }
        }).run();
      } else if (file.type.startsWith("video/")) {
        editor.chain().focus().insertContent({
          type: "video",
          attrs: { src: url, publicId: publicId, resourceType: resourceType }
        }).run();
      } else if (file.type.startsWith("audio/")) {
        editor.chain().focus().insertContent({
          type: "audio",
          attrs: { src: url, publicId: publicId, resourceType: resourceType }
        }).run();
      } else {
        // For PDF, ZIP, etc.
        editor
          .chain()
          .focus()
          .insertContent({
            type: "fileAttachment",
            attrs: {
              href: url,
              fileName: file.name,
              fileSize: fileSize,
              publicId: publicId,
              resourceType: resourceType,
            },
          })
          .run();
      }
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload file. Please try again.");
    }

    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*,application/pdf"
        onChange={handleFileUpload}
      />
      <TooltipProvider>
        {/* --- TOOLBAR --- */}
        <div className="border border-input bg-transparent rounded-md p-1 flex flex-wrap gap-1 items-center">
          {/* Undo */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().chain().focus().undo().run()}
                className="h-8 w-8 p-0"
              >
                <Undo className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Undo</TooltipContent>
          </Tooltip>

          {/* Redo */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().chain().focus().redo().run()}
                className="h-8 w-8 p-0"
              >
                <Redo className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Redo</TooltipContent>
          </Tooltip>

          <div className="w-px bg-border mx-1 h-6" />

          {/* Bold */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                pressed={editor.isActive("bold")}
                onPressedChange={() =>
                  editor.chain().focus().toggleBold().run()
                }
              >
                <Bold className="h-4 w-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Bold</TooltipContent>
          </Tooltip>

          {/* Italic */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                pressed={editor.isActive("italic")}
                onPressedChange={() =>
                  editor.chain().focus().toggleItalic().run()
                }
              >
                <Italic className="h-4 w-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Italic</TooltipContent>
          </Tooltip>

          {/* Underline */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                pressed={editor.isActive("underline")}
                onPressedChange={() =>
                  editor.chain().focus().toggleUnderline().run()
                }
              >
                <UnderlineIcon className="h-4 w-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Underline</TooltipContent>
          </Tooltip>

          {/* Strikethrough */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                pressed={editor.isActive("strike")}
                onPressedChange={() =>
                  editor.chain().focus().toggleStrike().run()
                }
              >
                <Strikethrough className="h-4 w-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Strikethrough</TooltipContent>
          </Tooltip>

          <div className="w-px bg-border mx-1 h-6" />

          {/* Align Left */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                pressed={editor.isActive({ textAlign: "left" })}
                onPressedChange={() =>
                  editor.chain().focus().setTextAlign("left").run()
                }
              >
                <AlignLeft className="h-4 w-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Align Left</TooltipContent>
          </Tooltip>

          {/* Align Center */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                pressed={editor.isActive({ textAlign: "center" })}
                onPressedChange={() =>
                  editor.chain().focus().setTextAlign("center").run()
                }
              >
                <AlignCenter className="h-4 w-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Align Center</TooltipContent>
          </Tooltip>

          {/* Align Right */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                pressed={editor.isActive({ textAlign: "right" })}
                onPressedChange={() =>
                  editor.chain().focus().setTextAlign("right").run()
                }
              >
                <AlignRight className="h-4 w-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Align Right</TooltipContent>
          </Tooltip>

          {/* Justify */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                pressed={editor.isActive({ textAlign: "justify" })}
                onPressedChange={() =>
                  editor.chain().focus().setTextAlign("justify").run()
                }
              >
                <AlignJustify className="h-4 w-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Justify</TooltipContent>
          </Tooltip>

          <div className="w-px bg-border mx-1 h-6" />

          {/* Heading 1 */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                pressed={editor.isActive("inlineHeading", { level: 1 })}
                onPressedChange={() =>
                  editor
                    .chain()
                    .focus()
                    .toggleMark("inlineHeading", { level: 1 })
                    .run()
                }
              >
                <Heading1 className="h-4 w-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Heading 1</TooltipContent>
          </Tooltip>

          {/* Heading 2 */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                pressed={editor.isActive("inlineHeading", { level: 2 })}
                onPressedChange={() =>
                  editor
                    .chain()
                    .focus()
                    .toggleMark("inlineHeading", { level: 2 })
                    .run()
                }
              >
                <Heading2 className="h-4 w-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Heading 2</TooltipContent>
          </Tooltip>

          {/* Heading 3 */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                pressed={editor.isActive("inlineHeading", { level: 3 })}
                onPressedChange={() =>
                  editor
                    .chain()
                    .focus()
                    .toggleMark("inlineHeading", { level: 3 })
                    .run()
                }
              >
                <Heading3 className="h-4 w-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Heading 3</TooltipContent>
          </Tooltip>

          <div className="w-px bg-border mx-1 h-6" />

          {/* Bullet List */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                pressed={editor.isActive("bulletList")}
                onPressedChange={() =>
                  editor.chain().focus().toggleBulletList().run()
                }
              >
                <List className="h-4 w-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Bullet List</TooltipContent>
          </Tooltip>

          {/* Ordered List */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                pressed={editor.isActive("orderedList")}
                onPressedChange={() =>
                  editor.chain().focus().toggleOrderedList().run()
                }
              >
                <ListOrdered className="h-4 w-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Ordered List</TooltipContent>
          </Tooltip>

          {/* Blockquote */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                pressed={editor.isActive("blockquote")}
                onPressedChange={() =>
                  editor.chain().focus().toggleBlockquote().run()
                }
              >
                <Quote className="h-4 w-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Blockquote</TooltipContent>
          </Tooltip>

          {/* Code */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                pressed={editor.isActive("code")}
                onPressedChange={() =>
                  editor.chain().focus().toggleCode().run()
                }
              >
                <CodeIcon className="h-4 w-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Inline Code</TooltipContent>
          </Tooltip>

          {/* Links & Media */}
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Toggle
                  size="sm"
                  pressed={editor.isActive("link")}
                  onPressedChange={setLink}
                >
                  <LinkIcon className="h-4 w-4" />
                </Toggle>
              </TooltipTrigger>
              <TooltipContent>Text Link</TooltipContent>
            </Tooltip>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Plus className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-2" align="start">
                <div className="grid gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="justify-start gap-2 h-9"
                    onClick={addAudioLink}
                  >
                    <Music className="h-4 w-4" />
                    Audio Link
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="justify-start gap-2 h-9"
                    onClick={addYoutubeLink}
                  >
                    <YoutubeIcon className="h-4 w-4" />
                    YouTube Embed
                  </Button>
                  <div className="h-px bg-border my-1" />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="justify-start gap-2 h-9"
                    onClick={triggerFileUpload}
                    disabled={isUploading}
                  >
                    <Upload className={`h-4 w-4 ${isUploading ? "animate-bounce" : ""}`} />
                    {isUploading ? "Uploading..." : "Upload File"}
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Table */}
          <Popover>
            <Tooltip>
              <TooltipTrigger asChild>
                <PopoverTrigger asChild>
                  <Toggle size="sm" pressed={editor.isActive("table")}>
                    <TableIcon className="h-4 w-4" />
                  </Toggle>
                </PopoverTrigger>
              </TooltipTrigger>
              <TooltipContent>Table Options</TooltipContent>
            </Tooltip>

            <PopoverContent className="w-56 p-2" align="start">
              <div className="flex flex-col gap-1">
                <p className="text-xs font-semibold text-muted-foreground px-2 py-1">
                  Table Controls
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="justify-start h-8"
                  onClick={() =>
                    editor
                      .chain()
                      .focus()
                      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                      .run()
                  }
                >
                  <Plus className="mr-2 h-4 w-4" /> Insert Table (3x3)
                </Button>
                {editor.isActive("table") && (
                  <>
                    <div className="h-px bg-border my-1" />

                    <Button
                      variant="ghost"
                      size="sm"
                      className="justify-start h-8"
                      onClick={() =>
                        editor.chain().focus().addColumnAfter().run()
                      }
                    >
                      <Columns className="mr-2 h-4 w-4" /> Add Column
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="justify-start h-8"
                      onClick={() =>
                        editor.chain().focus().deleteColumn().run()
                      }
                    >
                      <Trash className="mr-2 h-4 w-4 text-red-500" /> Delete
                      Column
                    </Button>

                    <div className="h-px bg-border my-1" />

                    <Button
                      variant="ghost"
                      size="sm"
                      className="justify-start h-8"
                      onClick={() => editor.chain().focus().addRowAfter().run()}
                    >
                      <Rows className="mr-2 h-4 w-4" /> Add Row
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="justify-start h-8"
                      onClick={() => editor.chain().focus().deleteRow().run()}
                    >
                      <Trash className="mr-2 h-4 w-4 text-red-500" /> Delete Row
                    </Button>

                    <div className="h-px bg-border my-1" />

                    <Button
                      variant="ghost"
                      size="sm"
                      className="justify-start h-8"
                      onClick={() => editor.chain().focus().mergeCells().run()}
                    >
                      <Spline className="mr-2 h-4 w-4" /> Merge Cells
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="justify-start h-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => editor.chain().focus().deleteTable().run()}
                    >
                      <Trash className="mr-2 h-4 w-4" /> Delete Table
                    </Button>
                  </>
                )}
              </div>
            </PopoverContent>
          </Popover>

          {/* Font Family */}
          <Select
            value={editor.getAttributes("textStyle").fontFamily || "Inter"}
            onValueChange={(value) => {
              if (value === "Inter") {
                editor.chain().focus().unsetFontFamily().run();
              } else {
                editor.chain().focus().setFontFamily(value).run();
              }
            }}
          >
            <SelectTrigger className="w-fit" size="sm">
              <SelectValue placeholder="Font" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Inter" style={{ fontFamily: "Inter" }}>
                Inter
              </SelectItem>
              <SelectItem
                value="Comic Sans MS, Comic Sans"
                style={{ fontFamily: "Comic Sans MS" }}
              >
                Comic Sans
              </SelectItem>
              <SelectItem value="serif" style={{ fontFamily: "serif" }}>
                Serif
              </SelectItem>
              <SelectItem value="monospace" style={{ fontFamily: "monospace" }}>
                Monospace
              </SelectItem>
              <SelectItem value="cursive" style={{ fontFamily: "cursive" }}>
                Cursive
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </TooltipProvider>

      {/* --- EDITOR CONTENT --- */}
      <EditorContent editor={editor} />
    </div>
  );
};

export default TiptapEditor;
