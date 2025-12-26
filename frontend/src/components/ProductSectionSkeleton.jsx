const ProductSectionSkeleton = () => {
  return (
    <section className="py-12">
      {/* Section header skeleton */}
      <div className="flex items-center justify-between mb-6">
        <div className="h-9 w-64 bg-gray-200 rounded-md animate-pulse" />
        <div className="h-6 w-20 bg-gray-200 rounded-md animate-pulse" />
      </div>

      {/* Product cards skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-xl border border-gray-200 overflow-hidden"
          >
            <div className="aspect-square w-full bg-gray-200 animate-pulse" />
            <div className="p-3 space-y-3">
              <div className="h-4 w-full bg-gray-200 rounded-md animate-pulse" />
              <div className="h-4 w-3/4 bg-gray-200 rounded-md animate-pulse" />
              <div className="flex items-center gap-1">
                <div className="h-3 w-3 rounded-full bg-gray-200 animate-pulse" />
                <div className="h-3 w-8 bg-gray-200 rounded-md animate-pulse" />
              </div>
              <div className="h-6 w-16 bg-gray-200 rounded-md animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductSectionSkeleton;
