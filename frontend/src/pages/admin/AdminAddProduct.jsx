import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, X } from "lucide-react";
import { useAuth } from "@clerk/clerk-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { addProductApi } from "../../lib/api";

const categories = ["Electronics", "Fashion", "Home & Kitchen", "Books", "Sports", "Toys", "Beauty"];

const AdminAddProduct = () => {
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  const [files, setFiles] = useState([]);      // actual files for backend
  const [previews, setPreviews] = useState([]); // base64 or blob for UI preview

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const remainingSlots = 5 - files.length;
    const filesToAdd = selectedFiles.slice(0, remainingSlots);

    setFiles((prev) => [...prev, ...filesToAdd]);
    const newPreviews = filesToAdd.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...newPreviews]);

    e.target.value = "";
  };

  const handleRemoveImage = (index) => {
    setFiles(files.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
  };

  const { mutate: addProduct, isPending } = useMutation({
    mutationFn:addProductApi,
    onSuccess: () => {
      toast.success("Product added successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "An error occurred during product addition");
      console.error("Add Product Error:", error);
    },
  });

const handleSubmit = async (e) => {
  e.preventDefault();

  const form = e.currentTarget;

  if (
    !form.name.value ||
    !form.description.value ||
    !form.mrp.value ||
    !form.price.value ||
    !form.category.value ||
    files.length === 0
  ) {
    toast.error("Please fill all required fields and upload at least one image");
    return;
  }

  const token = await getToken();

  const formData = new FormData();

  formData.append(
    "productData",//
    JSON.stringify({
      name: form.name.value,
      description: form.description.value,
      mrp: Number(form.mrp.value),
      price: Number(form.price.value),
      category: form.category.value,
    })
  );

  files.forEach((file) => {
    formData.append("images", file);
  });

  // ✅ CORRECT CALL
  addProduct({ formData, token });

  form.reset();
  setFiles([]);
  setPreviews([]);
};




  return (
    <div className="min-h-screen bg-gray-100 p-4 flex justify-center">
      <div className="w-full max-w-4xl">
        <button
          onClick={() => navigate("/admin/product")}
          className="flex items-center gap-2 mb-6 px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Products
        </button>

        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
          <h2 className="text-2xl font-bold mb-2">Add New Product</h2>
          <p className="text-gray-500 mb-6">Fill in the details below to add a new product to your store.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Name */}
            <div className="space-y-2">
              <label htmlFor="name" className="block font-medium text-gray-700">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                id="name"
                required
                placeholder="Enter product name"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 focus:outline-none"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label htmlFor="description" className="block font-medium text-gray-700">
                Description *
              </label>
              <textarea
                name="description"
                id="description"
                rows={4}
                required
                placeholder="Enter product description"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 focus:outline-none"
              />
            </div>

            {/* Price */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="mrp" className="block font-medium text-gray-700">
                  MRP (₦) *
                </label>
                <input
                  type="number"
                  name="mrp"
                  id="mrp"
                  step="0.01"
                  min="0"
                  placeholder="Original price"
                  required
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 focus:outline-none"
                />
                <p className="text-xs text-gray-500">Maximum Retail Price (before discount)</p>
              </div>
              <div className="space-y-2">
                <label htmlFor="price" className="block font-medium text-gray-700">
                  Selling Price (₦) *
                </label>
                <input
                  type="number"
                  name="price"
                  id="price"
                  step="0.01"
                  min="0"
                  placeholder="Discounted price"
                  required
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 focus:outline-none"
                />
                <p className="text-xs text-gray-500">Final price customers will pay</p>
              </div>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label htmlFor="category" className="block font-medium text-gray-700">
                Category *
              </label>
              <select
                name="category"
                id="category"
                required
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 focus:outline-none"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Images */}
            <div className="space-y-2">
              <label className="block font-medium text-gray-700">Product Images *</label>
              <label
                className={`flex flex-col items-center justify-center h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                  files.length >= 5
                    ? "border-gray-300 bg-gray-100 cursor-not-allowed"
                    : "border-blue-300 hover:border-blue-500 hover:bg-blue-50"
                }`}
              >
                <Upload className="h-8 w-8 mb-2 text-gray-400" />
                <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-400">PNG, JPG, WEBP (Max 5 images)</p>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  disabled={files.length >= 5}
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              {previews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-2">
                  {previews.map((img, index) => (
                    <div
                      key={index}
                      className="relative aspect-square rounded-lg border bg-gray-50 overflow-hidden group"
                    >
                      <img src={img} alt={`Product ${index + 1}`} className="w-full h-full object-cover" />
                      {index === 0 && (
                        <span className="absolute top-1 left-1 bg-primary text-white text-xs px-2 py-0.5 rounded">Main</span>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition"
                disabled={isPending}
              >
                {isPending ? "Adding..." : "Add Product"}
              </button>
              <button
                type="button"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                onClick={() => navigate("/admin/product")}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminAddProduct;
