import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PostList from "./pages/PostList";
import SinglePost from "./pages/SinglePost";
import PostForm from "./pages/PostForm";
import Login from "./pages/Login";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PostList />} />
        <Route path="/posts/:id" element={<SinglePost />} />
        <Route path="/create" element={<PostForm />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);
