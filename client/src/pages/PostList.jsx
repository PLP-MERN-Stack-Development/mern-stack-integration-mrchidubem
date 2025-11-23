import React, { useEffect, useState } from "react";
import useApi from "../api/useApi";
import { Link } from "react-router-dom";

export default function PostList() {
  const { request, loading, error } = useApi();
  const [posts, setPosts] = useState([]);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    let mounted = true;
    request(`/posts?page=${page}&limit=6&search=${encodeURIComponent(q)}`)
      .then(res => { if (mounted) { setPosts(res.data); setTotal(res.total); } })
      .catch(()=>{})
    return ()=>{ mounted=false; };
  }, [page, q]);

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <input value={q} onChange={e=>{setQ(e.target.value); setPage(1);}} placeholder="Search..." className="border p-2 flex-1"/>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <ul className="space-y-3">
        {posts.map(p => (
          <li key={p._id} className="border p-3 rounded">
            <Link to={`/posts/${p._id}`} className="font-bold">{p.title}</Link>
            <p className="text-sm text-gray-600">{p.category?.name} • {new Date(p.createdAt).toLocaleDateString()}</p>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex justify-between">
        <button disabled={page===1} onClick={()=>setPage(p=>p-1)}>Prev</button>
        <div>Page {page} • {Math.ceil(total/6)}</div>
        <button onClick={()=>setPage(p=>p+1)}>Next</button>
      </div>
    </div>
  );
}
