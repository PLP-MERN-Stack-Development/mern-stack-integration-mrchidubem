import React, { useState, useContext } from "react";
import useApi from "../api/useApi";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function PostForm({ existing }) {
  const { request } = useApi();
  const { token } = useContext(AuthContext);
  const [title, setTitle] = useState(existing?.title || "");
  const [content, setContent] = useState(existing?.content || "");
  const [category, setCategory] = useState(existing?.category?._id || "");
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    try {
      const form = new FormData();
      form.append("title", title);
      form.append("content", content);
      if (category) form.append("category", category);
      if (file) form.append("featuredImage", file);
      const options = { method: existing ? "PUT" : "POST", headers: { Authorization: `Bearer ${token}` }, body: form };
      const path = existing ? `/posts/${existing._id}` : "/posts";
      const res = await fetch((import.meta.env.VITE_API_URL || "/api") + path, options);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error");
      navigate(`/posts/${data._id || data._id}`);
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" className="w-full border p-2"/>
      <textarea value={content} onChange={e=>setContent(e.target.value)} placeholder="Content" className="w-full border p-2 h-40"/>
      <input type="file" onChange={e=>setFile(e.target.files[0])}/>
      <button className="bg-blue-600 text-white px-3 py-2 rounded">{existing ? "Update" : "Create"}</button>
    </form>
  );
}
