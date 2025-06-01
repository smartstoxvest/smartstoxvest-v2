/// <reference types="react" />
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import toast from "react-hot-toast";
import TopNavigation from "@/components/TopNavigation";
import { useAuth } from "@/contexts/AuthContext";

const API_URL = import.meta.env.VITE_API_URL;

interface Post {
  title: string;
  slug: string;
  tags: string;
  content: string;
  author?: string;
}

const TOKEN_EXPIRY_MINUTES = 30;

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
            const res = await fetch(`${API_URL}/api/upload-image`, {
              method: "POST",
              body: formData,
            });
            const data = await res.json();
            const url = `${API_URL}${data.url}`;
            editor.codemirror.replaceSelection(`![](${url})`);
          } catch (err) {
            toast.error("❌ Image upload failed");
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
  const { user } = useAuth();
  const isAdmin = user?.email === import.meta.env.VITE_ADMIN_EMAIL;

  const [title, setTitle] = useState("");
  const [slugInput, setSlugInput] = useState("");
  const [tags, setTags] = useState("");
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    fetch(`${API_URL}/api/posts/${slug}`)
      .then(res => res.json())
      .then((data: Post) => {
        setTitle(data.title);
        setSlugInput(data.slug);
        setTags(data.tags);
        setAuthor(data.author || "");
        setContent(data.content);
        setLoading(false);
      })
      .catch(() => {
        toast.error("⚠️ Failed to fetch post");
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
      window.location.href = "/app/admin/login";
      return;
    }

    const updatedPost: Post = {
      title,
      slug: slugInput,
      tags: tags.trim(),
      content,
      author: author.trim() || "SmartStoxVest Team"
    };

    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URL}/api/posts/${slugInput}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedPost),
    });

    if (res.ok) {
      toast.success("✅ Post updated!");
      navigate("/app/blog");
    } else {
      const error = await res.json();
      toast.error(`❌ ${error.detail || "Update failed"}`);
    }
  };

  if (!isAdmin) {
    return (
      <>
        
        <div className="p-6 text-red-600 text-center font-semibold">
          ⛔ You are not authorized to edit blog posts.
        </div>
      </>
    );
  }

  if (loading) {
    return (
      <>
       
        <div className="p-6 text-gray-500">Loading post...</div>
      </>
    );
  }

  return (
    <>
      <TopNavigation />
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-center space-x-2 mb-6">
          <span className="text-3xl">✏️</span>
          <h1 className="text-2xl font-bold">Edit Blog Post</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            value={slugInput}
            onChange={(e) => setSlugInput(e.target.value)}
            placeholder="Slug"
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Tags"
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Author"
            className="w-full p-2 border rounded"
          />
          <SimpleMDE value={content} onChange={setContent} options={customOptions} />
          <button
            type="submit"
            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            ✅ Save Changes
          </button>
        </form>
      </div>
    </>
  );
};

export default EditPost;
