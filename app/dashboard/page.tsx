"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabse";
import { useRouter } from "next/navigation";

type Bookmark = {
  id: string;
  title: string;
  url: string;
};

export default function Dashboard() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchBookmarks();

    const channel = supabase
      .channel("bookmarks")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bookmarks" },
        () => fetchBookmarks()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.push("/");
      }
    };

    checkUser();
  }, [router]);

  const fetchBookmarks = async () => {
    const { data } = await supabase
      .from("bookmarks")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) setBookmarks(data);
  };

  //   const addBookmark = async () => {
  //     const {
  //       data: { user },
  //     } = await supabase.auth.getUser();

  //     if (!user) return;

  //     await supabase.from("bookmarks").insert({
  //       title,
  //       url,
  //       user_id: user.id,
  //     });

  //     setTitle("");
  //     setUrl("");
  //   };

  const addBookmark = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from("bookmarks")
      .insert({
        title,
        url,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) {
      console.error(error);
      return;
    }

    // 🔥 Update UI immediately
    setBookmarks((prev) => [data, ...prev]);

    setTitle("");
    setUrl("");
  };

  const deleteBookmark = async (id: string) => {
    await supabase.from("bookmarks").delete().eq("id", id);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold tracking-tight">🔖 My Bookmarks</h1>

          <button
            onClick={async () => {
              await supabase.auth.signOut();
              window.location.href = "/";
            }}
            className="text-sm bg-red-500/20 hover:bg-red-500/30 px-4 py-2 rounded-lg transition"
          >
            Logout
          </button>
        </div>

        {/* Add Bookmark Card */}
        <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/10 mb-8">
          <h2 className="text-lg font-semibold mb-4">Add New Bookmark</h2>

          <div className="flex flex-col gap-4">
            <input
              className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <input
              className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />

            <button
              onClick={addBookmark}
              className="bg-blue-600 hover:bg-blue-700 transition rounded-lg py-2 font-medium"
            >
              Add Bookmark
            </button>
          </div>
        </div>

        {/* Bookmarks List */}
        <div className="space-y-4">
          {bookmarks.length === 0 && (
            <p className="text-gray-400 text-center mt-10">
              No bookmarks yet. Add your first one 🚀
            </p>
          )}

          {bookmarks.map((bookmark) => (
            <div
              key={bookmark.id}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 flex justify-between items-center hover:bg-white/10 transition"
            >
              <div>
                <a
                  href={bookmark.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline text-lg font-medium"
                >
                  {bookmark.title}
                </a>

                <p className="text-sm text-gray-400 truncate max-w-md">
                  {bookmark.url}
                </p>
              </div>

              <div className="">
                <button
                  onClick={() => deleteBookmark(bookmark.id)}
                  className="text-sm bg-red-500/20 hover:bg-red-500/30 px-2.5 py-1.5 rounded-xl"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
