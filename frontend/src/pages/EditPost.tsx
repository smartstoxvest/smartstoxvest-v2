/// <reference types="react" />
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import toast from "react-hot-toast";

interface Post {
  title: string;
  slug: string;
  tags: string;
  content: string;
  author?: string;
}

const ADMIN_TOKEN = localStorage.getItem("token");
const TOKEN_EXPIRY_MINUTES = 30;

// Fix toolbar typing issue by defining as "any"
const customOptions: any = {
  spellChecker: false,
  toolbar: [
    "bold", "italic", "heading", "|",
    "quote", "unordered-list", "ordered-list", "|",
    {
      name: "upload-image",
      action: async function customImageUpload(editor: any) {
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

const EditPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [title, setTitle] = useState<string>("");
  const [slugInput, setSlugInput] = useState<string>("");
  const [tags, setTags] = useState<string>("");
  const [author, setAuthor] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch(`http://localhost:8000/api/posts/${slug}`)
      .then(res => res.json())
      .then((data: Post) => {
        setTitle(data.title);
        setSlugInput(data.slug);
        setTags(data.tags);
        setAuthor(data.author || "");
        setContent(data.content);
        setLoading(false);
      });
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const loginTime = localStorage.getItem("loginTime");
    if (loginTime && Date.now() - parseInt(loginTime, 10) > TOKEN_EXPIRY_MINUTES * 60 * 1000) {
      toast.error("🔒 Session expired. Please log in again.");
      localStorage.removeItem("token");
      localStorage.removeItem("loginTime");
      window.location.href = "/admin/login";
      return;
    }

    const updatedPost: Post = {
      title,
      slug: slugInput,
      tags: tags.trim(),
      content,
      author: author.trim() || "SmartStoxVest Team"
    };

    const res = await fetch(`http://localhost:8000/api/posts/${slug}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${ADMIN_TOKEN}`,
      },
      body: JSON.stringify(updatedPost),
    });

    if (res.ok) {
      toast.success("✅ Post updated!");
      navigate("/blog");
    } else {
      const error = await res.json();
      toast.error(`❌ ${error.detail || "Update failed"}`);
    }
  };

  if (loading) return <div className="p-6">Loading post...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">✏️ Edit Blog Post</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={title}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          value={slugInput}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSlugInput(e.target.value)}
          placeholder="Slug"
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          value={tags}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTags(e.target.value)}
          placeholder="Tags"
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          value={author}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAuthor(e.target.value)}
          placeholder="Author"
          className="w-full p-2 border rounded"
        />
        <SimpleMDE value={content} onChange={setContent} options={customOptions} />
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditPost;
