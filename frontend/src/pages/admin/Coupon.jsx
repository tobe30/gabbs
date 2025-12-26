import React, { useState } from "react";
import { Trash2, Plus } from "lucide-react";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query"; 
import { addCoupon, deleteCouponApi, getCoupons } from "../../lib/api";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/clerk-react";

export default function Coupons() {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  const { data, isPending, isError } = useQuery({
    queryKey: ["coupons"],
    queryFn: async () => {
      const token = await getToken();
      return getCoupons(token);
    },
  })

  const coupons = data?.coupons || [];


  
  const [showAdd, setShowAdd] = useState(false);

  const isExpired = (date) => new Date(date) < new Date();

  // ✅ Use isLoading instead of isPending
  const { mutate: createCoupon, isLoading } = useMutation({
      mutationFn: addCoupon,
      onSuccess: () => {
        toast.success("Coupon added successfully");
        queryClient.invalidateQueries(["coupons"]);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "An error occurred during coupon creation");
        console.error("Add Coupon Error:", error);
      },
  });
  
  const handleAdd = async (e) => {
    e.preventDefault();
    const token = await getToken();
    const f = new FormData(e.target);

    // ✅ Map frontend fields to backend schema
    const userType = f.get("userType");//
    const coupon = {
      code: f.get("code").toUpperCase(),
      description: f.get("description"),
      discount: Number(f.get("discount")),
      expiresAt: f.get("expiryDate"), // match backend
      forNewUser: userType === "new" || userType === "all",
      forMember: userType === "member" || userType === "all",
    };

    createCoupon(
      { coupon, token },
      {
        onSuccess: () => {
          setShowAdd(false);// Close modal
          e.target.reset();// Reset form after successful submission
        },
      }
    );
  };

  // delete mutation
const deleteMutation = useMutation({
  mutationFn: async (code) => {
    const token = await getToken();
    return deleteCouponApi(code, token);
  },
  onSuccess: () => {
    queryClient.invalidateQueries(["coupons"]); // reload coupons
    toast.success("Coupon deleted successfully");
  },
  onError: (err) =>
    toast.error(err.response?.data?.message || "Failed to delete coupon"),
});



  const handleDelete = (code) => {
    deleteMutation.mutate(code);
  };

  if (isPending) return <p className="p-6 text-center">Loading orders...</p>;
  if (isError) return <p className="p-6 text-center text-red-500">Failed to load orders.</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Coupons</h1>
          <p className="text-gray-500 text-sm">
            Create and manage discount coupons
          </p>
        </div>

        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90"
        >
          <Plus size={18} /> Add Coupon
        </button>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-xl shadow border border-gray-200 overflow-hidden"> 
        <div className="overflow-x-auto">
          <table className="min-w-[900px] w-full">
            <thead className="bg-gray-100">
              <tr className="text-sm font-semibold text-gray-700">
                <th className="p-3 text-left">Code</th>
                <th className="p-3 text-left">Description</th>
                <th className="p-3 text-left">Discount (%)</th>
                <th className="p-3 text-left">User</th>
                <th className="p-3 text-left">Expiry</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((c) => (
                <tr key={c.id} className="border-t border-gray-200 text-sm hover:bg-gray-50">
                  <td className="p-3 font-mono">{c.code}</td>
                  <td className="p-3">{c.description}</td>
                  <td className="p-3">{c.discount}%</td>
                  <td className="p-3 capitalize">
  {c.forNewUser && c.forMember
    ? "All Users"
    : c.forNewUser
    ? "New Users"
    : c.forMember
    ? "Members"
    : "—"}
</td>

                  <td className="p-3">
                  {new Date(c.expiresAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>

                  <td className="p-3">
                    {isExpired(c.expiresAt) ? (
                      <span className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded">
                        Expired
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">
                        Active
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => handleDelete(c.code)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="grid gap-4 md:hidden">
        {coupons.map((c) => (
          <div key={c.id} className="bg-white rounded-xl shadow border p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-mono font-semibold">{c.code}</span>
              <span
                className={`text-xs ${isExpired(c.expiryDate) ? "text-red-600" : "text-green-600"}`}
              >
                {isExpired(c.expiryDate) ? "Expired" : "Active"}
              </span>
            </div>

            <div className="text-sm text-gray-600 space-y-1">
              <p>{c.description}</p>
              <p>Discount: {c.discount}%</p>
              <p>
                User: {c.forNewUser && c.forMember
                  ? "All Users"
                  : c.forNewUser
                  ? "New Users"
                  : c.forMember
                  ? "Members"
                  : "—"}
              </p>

              <p>
              Expiry: {new Date(c.expiresAt).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>

            </div>

            <div className="flex justify-end mt-3">
              <button
                  onClick={() => handleDelete(c.code)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 size={18} />
                </button>

            </div>
          </div>
        ))}
      </div>

      {showAdd && (
        <Modal title="Create Coupon" onClose={() => setShowAdd(false)}>
          <CouponForm onSubmit={handleAdd} isPending={isLoading} />
        </Modal>
      )}
    </div>
  );
}

/* -------------------- Components -------------------- */

const Modal = ({ title, children, onClose }) => (
  <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">{title}</h2>
        <button onClick={onClose}>✕</button>
      </div>
      {children}
    </div>
  </div>
);

const CouponForm = ({ onSubmit, isPending }) => (
  <form onSubmit={onSubmit} className="space-y-4">
    <InputLabel label="Coupon Code" name="code" placeholder="WELCOME10" />
    <InputLabel label="Discount (%)" name="discount" type="number" placeholder="10" />
    <InputLabel label="Description" name="description" placeholder="Welcome discount" />
    <InputLabel label="Expiry Date" name="expiryDate" type="date" />
    <SelectLabel label="User Type" name="userType">
      <option value="new">New Users</option>
      <option value="member">Members</option>
      <option value="all">All Users</option>
    </SelectLabel>

    <button className="w-full bg-primary text-white py-2 rounded-lg" disabled={isPending}>
      {isPending ? "Creating..." : "Creating Coupon"}
    </button>
  </form>
);

const InputLabel = ({ label, ...props }) => (
  <div>
    <label className="text-sm font-medium">{label}</label>
    <input
      {...props}
      required
      className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-black outline-none"
    />
  </div>
);

const SelectLabel = ({ label, children, ...props }) => (
  <div>
    <label className="text-sm font-medium">{label}</label>
    <select
      {...props}
      className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-black outline-none"
    >
      {children}
    </select>
  </div>
);
