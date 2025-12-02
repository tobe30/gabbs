import { Pencil, Trash2 } from "lucide-react";
import React, { useState } from "react";

const Coupons = () => {
  const [coupons, setCoupons] = useState([
    {
      id: 1,
      code: "WELCOME10",
      type: "percentage",
      value: 10,
      expiryDate: "2024-12-31",
      userType: "new",
      isActive: true,
    },
    {
      id: 2,
      code: "MEMBER20",
      type: "fixed",
      value: 20,
      expiryDate: "2024-12-31",
      userType: "member",
      isActive: true,
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);

  const isExpired = (date) => {
    return new Date(date) < new Date();
  };

  const handleAddCoupon = (e) => {
    e.preventDefault();
    const form = new FormData(e.target);

    const newCoupon = {
      id: Date.now(),
      code: form.get("code").toUpperCase(),
      type: form.get("type"),
      value: parseFloat(form.get("value")),
      expiryDate: form.get("expiryDate"),
      userType: form.get("userType"),
      isActive: true,
    };

    setCoupons([...coupons, newCoupon]);
    setShowAddModal(false);
  };

  const handleEditCoupon = (e) => {
    e.preventDefault();
    const form = new FormData(e.target);

    const updatedCoupons = coupons.map((c) =>
      c.id === editingCoupon.id
        ? {
            ...c,
            code: form.get("code").toUpperCase(),
            type: form.get("type"),
            value: parseFloat(form.get("value")),
            expiryDate: form.get("expiryDate"),
            userType: form.get("userType"),
          }
        : c
    );

    setCoupons(updatedCoupons);
    setShowEditModal(false);
  };

  const handleDelete = (id) => {
    setCoupons(coupons.filter((c) => c.id !== id));
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Manage Coupons</h1>
          <p className="text-gray-500 mt-1">Create and manage discount coupons</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 bg-primary text-white rounded-lg text-sm hover:opacity-80 transition"
        >
          + Add Coupon
        </button>
      </div>

      {/* Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-4">Code</th>
              <th className="p-4">Type</th>
              <th className="p-4">Value</th>
              <th className="p-4">User Type</th>
              <th className="p-4">Expiry</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {coupons.map((coupon) => (
              <tr key={coupon.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="p-4 font-mono">{coupon.code}</td>
                <td className="p-4 capitalize">{coupon.type}</td>
                <td className="p-4">
                  {coupon.type === "percentage"
                    ? `${coupon.value}%`
                    : `$${coupon.value}`}
                </td>
                <td className="p-4 capitalize">{coupon.userType}</td>
                <td className="p-4">{coupon.expiryDate}</td>

                <td className="p-4">
                  {isExpired(coupon.expiryDate) ? (
                    <span className="px-3 py-1 text-xs bg-red-100 text-red-600 rounded-full">
                      Expired
                    </span>
                  ) : (
                    <span className="px-3 py-1 text-xs bg-green-100 text-green-600 rounded-full">
                      Active
                    </span>
                  )}
                </td>

                <td className="p-4 text-right space-x-4 flex justify-end">
                <button
                    onClick={() => {
                    setEditingCoupon(coupon);
                    setShowEditModal(true);
                    }}
                    className="text-primary hover:text-blue-800 transition"
                    title="Edit"
                >
                    <Pencil className="w-5 h-5" />
                </button>

                <button
                    onClick={() => handleDelete(coupon.id)}
                    className="text-red-600 hover:text-red-800 transition"
                    title="Delete"
                >
                    <Trash2 className="w-5 h-5" />
                </button>
</td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <Modal title="Create New Coupon" onClose={() => setShowAddModal(false)}>
          <form onSubmit={handleAddCoupon} className="space-y-4">
            <InputLabel label="Coupon Code" name="code" placeholder="SAVE10" />
            <SelectLabel label="Discount Type" name="type">
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed Amount ($)</option>
            </SelectLabel>
            <InputLabel label="Value" name="value" type="number" />
            <InputLabel label="Expiry Date" name="expiryDate" type="date" />
            <SelectLabel label="User Type" name="userType">
              <option value="new">New Users</option>
              <option value="member">Members</option>
              <option value="all">All Users</option>
            </SelectLabel>

            <button className="w-full bg-primary text-white py-2.5 rounded-lg mt-2">
              Create Coupon
            </button>
          </form>
        </Modal>
      )}

      {/* Edit Modal */}
      {showEditModal && editingCoupon && (
        <Modal title="Edit Coupon" onClose={() => setShowEditModal(false)}>
          <form onSubmit={handleEditCoupon} className="space-y-4">
            <InputLabel
              label="Coupon Code"
              name="code"
              defaultValue={editingCoupon.code}
            />
            <SelectLabel label="Discount Type" name="type" defaultValue={editingCoupon.type}>
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed Amount ($)</option>
            </SelectLabel>
            <InputLabel
              label="Value"
              name="value"
              type="number"
              defaultValue={editingCoupon.value}
            />
            <InputLabel
              label="Expiry Date"
              name="expiryDate"
              type="date"
              defaultValue={editingCoupon.expiryDate}
            />
            <SelectLabel
              label="User Type"
              name="userType"
              defaultValue={editingCoupon.userType}
            >
              <option value="new">New Users</option>
              <option value="member">Members</option>
              <option value="all">All Users</option>
            </SelectLabel>

            <button className="w-full bg-primary text-white py-2.5 rounded-lg mt-2">
              Update Coupon
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
};

// ----- Reusable Components -----

const Modal = ({ children, title, onClose }) => (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-lg animate-fadeIn">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{title}</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-black">
          ✕
        </button>
      </div>

      {children}
    </div>
  </div>
);

const InputLabel = ({ label, ...props }) => (
  <div>
    <label className="text-sm font-medium">{label}</label>
    <input
      {...props}
      className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-black outline-none"
    />
  </div>
);

const SelectLabel = ({ label, children, ...props }) => (
  <div>
    <label className="text-sm font-medium">{label}</label>
    <select
      {...props}
      className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-black outline-none"
    >
      {children}
    </select>
  </div>
);

export default Coupons;
