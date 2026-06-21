import AdminHeader from "@/components/admin/AdminHeader";
import AdminBlogForm from "@/components/admin/AdminBlogForm";

export default function NewBlogPostPage() {
  return (
    <>
      <AdminHeader />
      <div className="px-4 py-12">
        <h1 className="mb-8 text-center text-2xl font-semibold text-gray-900">
          New Blog Post
        </h1>
        <AdminBlogForm />
      </div>
    </>
  );
}
