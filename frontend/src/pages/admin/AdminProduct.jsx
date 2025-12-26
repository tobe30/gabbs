import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Upload,
  X,
  ImagePlus,
} from "lucide-react";
import { useAuth } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../../lib/api";

const categories = ["Electronics", "Fashion", "Home", "Books", "Sports", "Toys", "Beauty"];

const AdminProduct = () => {
  const navigate = useNavigate();
  const { getToken } = useAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 5;

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editImages, setEditImages] = useState([]);

  // 🔥 Fetch products
  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const token = await getToken();
      return getProducts(token);
    },
  });

  const products = data?.products || [];

  // 🔍 Search
  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 📄 Pagination
  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirst,
    indexOfLast
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const getDiscountPercentage = (mrp, price) =>
    Math.round(((mrp - price) / mrp) * 100);

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setEditImages(product.images || []);
    setIsEditOpen(true);
  };

  // 📸 Image handlers
  const handleEditFileChange = (e) => {
    const files = e.target.files;
    if (!files) return;

    const remainingSlots = 5 - editImages.length;
    Array.from(files)
      .slice(0, remainingSlots)
      .forEach((file) => {
        const reader = new FileReader();
        reader.onload = (ev) => {
          if (ev.target?.result) {
            setEditImages((prev) => [...prev, ev.target.result]);
          }
        };
        reader.readAsDataURL(file);
      });

    e.target.value = "";
  };

  const handleRemoveEditImage = (index) => {
    setEditImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleEditProduct = (e) => {
    e.preventDefault();
    setIsEditOpen(false);
    setEditingProduct(null);
    setEditImages([]);
    alert("UI updated. Connect API mutation next 🚀");
  };

  if (isLoading) return <p className="p-6 text-center">Loading products...</p>;
  if (isError)
    return (
      <p className="p-6 text-center text-red-500">
        Failed to load products
      </p>
    );

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6 md:px-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Manage Products</h1>
            <p className="text-gray-500">
              {products.length} products in your store
            </p>
          </div>
          <button
            onClick={() => navigate("/admin/add-product")}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg"
          >
            <Plus size={16} /> Add Product
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-6 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-10 p-2 border rounded-lg"
          />
        </div>

        {/* Table */}
        {/* Table */}
{/* Table */}
<div className="hidden lg:block bg-white rounded-xl overflow-x-auto shadow-sm">
  <table className="w-full min-w-max border-collapse">
    <thead className="bg-gray-100">
      <tr>
        <th className="p-3 text-left text-gray-600 font-medium">Image</th>
        <th className="p-3 text-left text-gray-600 font-medium">Name</th>
        <th className="p-3 text-left text-gray-600 font-medium">Category</th>
        <th className="p-3 text-gray-600 font-medium">MRP</th>
        <th className="p-3 text-gray-600 font-medium">Price</th>
        <th className="p-3 text-gray-600 font-medium">Discount</th>
        <th className="p-3 text-right text-gray-600 font-medium">Actions</th>
      </tr>
    </thead>
    <tbody>
      {currentProducts.map((product) => (
        <tr
          key={product._id}
          className="border-b border-gray-200 hover:bg-gray-50 transition"
        >
          <td className="p-2">
            <div className="w-14 h-14 bg-gray-100 rounded overflow-hidden">
              {product.images?.[0] && (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          </td>
          <td className="p-2 text-gray-700">{product.name}</td>
          <td className="p-2 text-gray-700">{product.category}</td>
          <td className="p-2 text-gray-400 line-through">₦{product.mrp}</td>
          <td className="p-2 font-semibold text-gray-800">₦{product.price}</td>
          <td className="p-2 text-gray-700">
            {getDiscountPercentage(product.mrp, product.price)}%
          </td>
          <td className="p-2 flex justify-end gap-2">
            <button
              onClick={() => handleEditClick(product)}
              className="p-2 hover:bg-gray-100 rounded"
            >
              <Pencil size={16} />
            </button>
            <button className="p-2 text-red-600 hover:bg-gray-100 rounded">
              <Trash2 size={16} />
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>



        {/* ✏️ EDIT MODAL */}
       {isEditOpen && editingProduct && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 relative shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Edit Product</h2>

      <form onSubmit={handleEditProduct} className="space-y-4">
        {/* Product Name */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Product Name *</label>
          <input
            name="name"
            defaultValue={editingProduct.name}
            required
            className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-300 focus:outline-none"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Description *</label>
          <textarea
            name="description"
            defaultValue={editingProduct.description}
            rows={3}
            required
            className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-300 focus:outline-none"
          />
        </div>

        {/* MRP & Price */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">MRP (₦) *</label>
            <input
              type="number"
              step="0.01"
              name="mrp"
              defaultValue={editingProduct.mrp}
              required
              className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-300 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Selling Price (₦) *</label>
            <input
              type="number"
              step="0.01"
              name="price"
              defaultValue={editingProduct.price}
              required
              className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-300 focus:outline-none"
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Category *</label>
          <select
            name="category"
            defaultValue={editingProduct.category}
            className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-300 focus:outline-none"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Images Upload */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">Product Images</label>
          <label className="flex flex-col items-center justify-center h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition">
            <Upload className="h-6 w-6 mb-1 text-gray-400" />
            <span className="text-xs text-gray-500">Click to upload (Max 5)</span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleEditFileChange}
              className="hidden"
            />
          </label>

          {editImages.length > 0 && (
            <div className="grid grid-cols-3 md:grid-cols-5 gap-2 mt-2">
              {editImages.map((img, idx) => (
                <div key={idx} className="relative aspect-square rounded-lg overflow-hidden group border border-gray-200">
                  <img src={img} alt={`Product ${idx + 1}`} className="w-full h-full object-cover" />
                  {idx === 0 && (
                    <span className="absolute top-1 left-1 bg-blue-600 text-white text-[10px] px-1 rounded">Main</span>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveEditImage(idx)}
                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex flex-col md:flex-row gap-2 mt-4">
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition"
          >
            Update Product
          </button>
          <button
            type="button"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
            onClick={() => setIsEditOpen(false)}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
)}


      </div>
    </div>
  );
};

export default AdminProduct;
