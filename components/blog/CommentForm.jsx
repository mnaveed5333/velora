export default function CommentForm() {
  return (
    <div className="mt-10 rounded-2xl border border-slate-200 p-6">
      <h2 className="mb-1 text-xl font-bold text-ink">Leave a Comment</h2>
      <p className="mb-5 text-xs text-slate-400">
        Your email address will not be published. Required fields are marked *
      </p>

      <textarea
        placeholder="Type here..."
        rows={5}
        className="mb-4 w-full rounded-xl border border-slate-200 p-3 text-sm text-ink outline-none focus:border-primary"
      />

      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <input
          type="text"
          placeholder="Name*"
          className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary"
        />
        <input
          type="email"
          placeholder="Email*"
          className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary"
        />
        <input
          type="url"
          placeholder="Website"
          className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary"
        />
      </div>

      <div className="mb-5 flex items-center gap-2">
        <input type="checkbox" id="save-info" className="h-4 w-4" />
        <label htmlFor="save-info" className="text-xs text-slate-500">
          Save my name, email, and website in this browser for the next time I comment.
        </label>
      </div>

      <button className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary/90">
        POST COMMENT
      </button>
    </div>
  );
}