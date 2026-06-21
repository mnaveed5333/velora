"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Heart, Share2, Check, MessageCircle } from "lucide-react";
import { openAuthModal } from "@/store/slices/authSlice";

export default function BlogEngagement({ slug, title }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const [loading, setLoading] = useState(true);
  const [likeCount, setLikeCount] = useState(0);
  const [likedByMe, setLikedByMe] = useState(false);
  const [likeBusy, setLikeBusy] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [commentBusy, setCommentBusy] = useState(false);
  const [commentError, setCommentError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/blog/${slug}`);
        const data = await res.json();
        if (res.ok) {
          setLikeCount(data.post.likeCount);
          setLikedByMe(data.post.likedByMe);
          setComments(data.post.comments);
        }
      } catch (err) {
        // fail silently — engagement widget is non-critical
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  const requireAuth = () => {
    dispatch(openAuthModal("login"));
  };

  const handleLike = async () => {
    if (!user) {
      requireAuth();
      return;
    }
    if (likeBusy) return;
    setLikeBusy(true);
    try {
      const res = await fetch(`/api/blog/${slug}/like`, { method: "POST" });
      const data = await res.json();

      if (res.status === 401) {
        requireAuth();
        return;
      }
      if (!res.ok) {
        alert(data.error || "Failed to update like.");
        return;
      }

      setLikeCount(data.likeCount);
      setLikedByMe(data.likedByMe);
    } catch (err) {
      alert("Something went wrong.");
    } finally {
      setLikeBusy(false);
    }
  };

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // user dismissed the native share sheet — no action needed
    }
  };

  const handleCommentFocus = () => {
    if (!user) requireAuth();
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setCommentError("");

    if (!user) {
      requireAuth();
      return;
    }
    if (!commentText.trim()) return;

    setCommentBusy(true);
    try {
      const res = await fetch(`/api/blog/${slug}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: commentText.trim() }),
      });
      const data = await res.json();

      if (res.status === 401) {
        requireAuth();
        return;
      }
      if (!res.ok) {
        setCommentError(data.error || "Failed to post comment.");
        setCommentBusy(false);
        return;
      }

      setComments((prev) => [data.comment, ...prev]);
      setCommentText("");
    } catch (err) {
      setCommentError("Something went wrong. Please try again.");
    } finally {
      setCommentBusy(false);
    }
  };

  return (
    <div className="mt-10 border-t border-ink/10 pt-8">
      {/* Like + Share row */}
      <div className="flex items-center gap-6">
        <button
          onClick={handleLike}
          disabled={loading || likeBusy}
          className="group flex items-center gap-2 text-sm tracking-wide text-ink/60 transition-colors hover:text-primary disabled:opacity-50"
        >
          <Heart
            size={17}
            className={likedByMe ? "text-primary" : "text-ink/40 group-hover:text-primary"}
            fill={likedByMe ? "currentColor" : "none"}
            strokeWidth={1.75}
          />
          <span className={likedByMe ? "text-primary" : ""}>
            {likeCount} {likeCount === 1 ? "Like" : "Likes"}
          </span>
        </button>

        <button
          onClick={handleShare}
          className="flex items-center gap-2 text-sm tracking-wide text-ink/60 transition-colors hover:text-primary"
        >
          {copied ? (
            <Check size={17} strokeWidth={1.75} />
          ) : (
            <Share2 size={17} strokeWidth={1.75} className="text-ink/40 group-hover:text-primary" />
          )}
          <span>{copied ? "Link copied" : "Share"}</span>
        </button>
      </div>

      {/* Comments */}
      <div className="mt-10">
        <div className="mb-5 flex items-center gap-2">
          <MessageCircle size={16} strokeWidth={1.75} className="text-ink/40" />
          <h2 className="text-sm font-semibold uppercase tracking-widest text-ink/70">
            {comments.length > 0 ? `Comments (${comments.length})` : "Comments"}
          </h2>
        </div>

        {user ? (
          <form onSubmit={handleCommentSubmit} className="mb-8">
            {commentError && (
              <p className="mb-2 text-xs text-primary">{commentError}</p>
            )}
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Share your thoughts..."
              rows={3}
              className="w-full resize-none border-0 border-b border-ink/15 bg-transparent px-0 py-2 text-sm text-ink outline-none transition-colors placeholder:text-ink/35 focus:border-primary"
            />
            <div className="mt-3 flex justify-end">
              <button
                type="submit"
                disabled={commentBusy || !commentText.trim()}
                className="rounded-full bg-primary px-6 py-2 text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:bg-primary-hover disabled:opacity-50"
              >
                {commentBusy ? "Posting..." : "Post Comment"}
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={handleCommentFocus}
            className="mb-8 block w-full rounded-md bg-bg-secondary px-5 py-4 text-left text-sm text-ink/70 transition-colors hover:bg-bg-secondary/70"
          >
            <span className="font-medium text-primary underline underline-offset-2">
              Sign in
            </span>{" "}
            to like this post or join the conversation.
          </button>
        )}

        {loading ? (
          <p className="text-sm text-ink/40">Loading comments...</p>
        ) : comments.length === 0 ? (
          <p className="text-sm text-ink/40">No comments yet. Be the first to share your thoughts.</p>
        ) : (
          <ul className="space-y-6">
            {comments.map((c) => (
              <li key={c._id} className="flex gap-3.5">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-bg-secondary text-sm font-semibold text-primary">
                  {c.avatarUrl ? (
                    <img src={c.avatarUrl} alt={c.name} className="h-full w-full object-cover" />
                  ) : (
                    c.name?.charAt(0)?.toUpperCase() || "?"
                  )}
                </div>
                <div className="flex-1 border-b border-ink/8 pb-5">
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-semibold text-ink">{c.name}</span>
                    <span className="text-xs text-ink/35">
                      {new Date(c.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-ink/70">{c.text}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}