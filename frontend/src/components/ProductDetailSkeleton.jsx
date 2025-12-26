const ProductDetailSkeleton = () => {
  return (
    <div className="container mx-auto px-4 py-8 animate-pulse">
      {/* Back link */}
      <div className="h-4 w-32 bg-gray-200 rounded mb-6" />

      <div className="grid md:grid-cols-2 gap-12">
        {/* Image skeleton */}
        <div className="w-full h-[420px] bg-gray-200 rounded-xl" />

        {/* Content skeleton */}
        <div>
          <div className="h-4 w-24 bg-gray-200 rounded mb-3" />

          <div className="h-10 w-3/4 bg-gray-200 rounded mb-6" />

          <div className="flex gap-3 mb-6">
            <div className="h-5 w-32 bg-gray-200 rounded" />
            <div className="h-5 w-24 bg-gray-200 rounded" />
          </div>

          <div className="h-8 w-40 bg-gray-200 rounded mb-3" />
          <div className="h-4 w-24 bg-gray-200 rounded mb-6" />

          <div className="space-y-3 mb-8">
            <div className="h-4 w-full bg-gray-200 rounded" />
            <div className="h-4 w-11/12 bg-gray-200 rounded" />
            <div className="h-4 w-10/12 bg-gray-200 rounded" />
          </div>

          <div className="h-12 w-full bg-gray-300 rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export default ProductDetailSkeleton;
