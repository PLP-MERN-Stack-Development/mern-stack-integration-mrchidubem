import React, { useEffect, useState } from "react";
import useApi from "../api/useApi";
import { useParams } from "react-router-dom";

export default function SinglePost() {
  const { id } = useParams();
  const { request, loading, error } = useApi();
  const [post, setPost] = useState(null);

  useEffect(()=>{
    request(`/posts/${id}`).then(setPost).catch(()=>{});
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!post) return null;

  return (
    <div>
      <h1 className="text-2xl font-bold">{post.title}</h1>
      {post.featuredImage && <img src={import.meta.env.VITE_API_URL.replace("/api","") + post.featuredImage } alt="" className="my-4 max-w-full"/>}
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
      <h3 className="mt-6">Comments</h3>
      <ul>
        {post.comments.map((c,i)=>(<li key={i}><strong>{c.author}</strong>: {c.text}</li>))}
      </ul>
    </div>
  );
}
