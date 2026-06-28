const PostSkeleton = () => {
  return (
    <div className="mx-auto max-w-xl space-y-6 py-6">
      {[1, 2, 3].map((item) => (
        <div key={item} className="animate-pulse space-y-4 rounded-2xl border bg-white p-4">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gray-200"></div>

            <div className="space-y-2">
              <div className="h-4 w-32 rounded bg-gray-200"></div>
              <div className="h-3 w-20 rounded bg-gray-200"></div>
            </div>
          </div>

          {/* Image */}
          <div className="h-96 w-full rounded-xl bg-gray-200"></div>

          {/* Actions */}
          <div className="flex gap-4">
            <div className="h-6 w-6 rounded-full bg-gray-200"></div>
            <div className="h-6 w-6 rounded-full bg-gray-200"></div>
            <div className="h-6 w-6 rounded-full bg-gray-200"></div>
          </div>

          {/* Caption */}
          <div className="space-y-2">
            <div className="h-4 w-3/4 rounded bg-gray-200"></div>
            <div className="h-4 w-1/2 rounded bg-gray-200"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostSkeleton;