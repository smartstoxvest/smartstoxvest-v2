import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import toast from "react-hot-toast";

const ADMIN_TOKEN = localStorage.getItem("token");
const TOKEN_EXPIRY_MINUTES = 30;

// Shared logic: Markdown editor config with image upload
const customOptions = {
  spellChecker: false,
  toolbar: [
    "bold", "italic", "heading", "|",
    "quote", "unordered-list", "ordered-list", "|",
    {
      name: "upload-image",
      action: async function customImageUpload(editor) {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.onchange = async () => {
          if (!input.files?.length) return;
          const file = input.files[0];
          const formData = new FormData();
          formData.append("file", file);

          try {
            const res = await fetch("http://localhost:8000/api/upload-image", {
              method: "POST",
              body: formData,
            });
            const data = await res.json();
            const url = `http://localhost:8000${data.url}`;
            editor.codemirror.replaceSelection(`![](${url})`);
          } catch (err) {
            toast.error("Image upload failed");
          }
        };
        input.click();
      },
      className: "fa fa-upload",
      title: "Upload Image",
    },
    "|", "preview", "side-by-side", "fullscreen", "|", "guide"
  ]
};

// NEW POST COMPONENT
export const NewPost = () => {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [tags, setTags] = useState("");
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const loginTime = localStorage.getItem("loginTime");
    if (loginTime && Date.now() - parseInt(loginTime, 10) > TOKEN_EXPIRY_MINUTES * 60 * 1000) {
      toast.error("🔒 Session expired. Please log in again.");
      localStorage.removeItem("token");
      localStorage.removeItem("loginTime");
      window.location.href = "/admin/login";
      return;
    }

    const postData = {
      title,
      slug: slug || title.toLowerCase().replace(/\s+/g, "-"),
      tags: tags.trim(),
      content,
      author: author.trim() || "SmartStoxVest Team",
    };
    const res = await fetch("http://localhost:8000/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${ADMIN_TOKEN}`,
      },
      body: JSON.stringify(postData),
    });
    if (res.ok) {
      toast.success("🎉 Post published!");
      setTitle(""); setSlug(""); setTags(""); setAuthor(""); setContent("");
      navigate("/blog");
    } else {
      const error = await res.json();
      toast.error(`❌ ${error.detail || "Failed to publish post"}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">✍️ New Blog Post</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} className="w-full p-2 border rounded" required />
        <input type="text" placeholder="Slug (optional)" value={slug} onChange={e => setSlug(e.target.value)} className="w-full p-2 border rounded" />
        <input type="text" placeholder="Tags (comma separated)" value={tags} onChange={e => setTags(e.target.value)} className="w-full p-2 border rounded" />
        <input type="text" placeholder="Author" value={author} onChange={e => setAuthor(e.target.value)} className="w-full p-2 border rounded" />
        <SimpleMDE value={content} onChange={setContent} options={customOptions} />
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Publish Post</button>
      </form>
    </div>
  );
};

export default NewPost;
