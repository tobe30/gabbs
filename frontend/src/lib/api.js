import { axiosInstance } from "./axios";



export const getAuthAdmin = async (token) => {
  try {
    const res = await axiosInstance.get("/users/check", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    console.log("Error in getAdmin", error);
    return null;
  }
};


// { headers: { Authorization: `Bearer ${token}` } }

export const addProductApi = async ({ formData, token }) => {
  const response = await axiosInstance.post(
    "/products/add-product",
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const getProducts = async (token) => {
  const res = await axiosInstance.get("/products/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const getOrders = async (token) => {
  const res = await axiosInstance.get("/order/all-orders", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};


export const updateOrderStatus = async (orderId, status, isPaid, token) => {
  const res = await axiosInstance.patch(
    "/order/update-status",
    { orderId, status, isPaid }, // send both
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

export const addCoupon = async ({coupon, token}) => {
  const res = await axiosInstance.post(
    "/coupons/add-coupon",
    coupon,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
}


export const getCoupons = async (token) => {
  const res = await axiosInstance.get("/coupons", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const deleteCouponApi = async (code, token) => {
  const res = await axiosInstance.delete(`/coupons/delete?code=${code}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};


// lib/api.js
export const getProduct = async (category = null) => {
  let url = '/products/all'; // backend endpoint
  if (category) {
    url += `?category=${encodeURIComponent(category)}`;
  }

  const res = await axiosInstance.get(url);
  if (!res.data) throw new Error('Failed to fetch products');

  return res.data; // { products: [...] }
};


// lib/api.js
export const getAllProducts = async () => {
  const res = await axiosInstance.get("/products/all");
  return res.data;
};


export const fetchCart = async (token) => {
  const res = await axiosInstance.get("/cart", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const addToCartApi = async (product, token) => {
  const res = await axiosInstance.post("/cart/update", product, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const removeFromCartApi = async (body, token) => {
  const res = await axiosInstance.delete("/cart/remove", {
    headers: { Authorization: `Bearer ${token}` },
    data: body,  // <-- body goes inside `data`
  });
  return res.data;
};


export const clearCartApi = async (token) => {
  const res = await axiosInstance.post("/cart/clear", {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const addAddress = async ({address, token}) => {
  const res = await axiosInstance.post(
    "/address/add-address",
    address,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
}

export const getUserAddresses = async (token) => {
  const res = await axiosInstance.get("/address", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.addresses; // return the array directly
};

export const verifyCoupon = async (code, token) => {
  const res = await axiosInstance.post(
    "/coupons/verify",
    { code },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  console.log("Axios response:", res.data);
  return res.data;
};


export const getUserOrders = async (token) => {
  const res = await axiosInstance.get("/order", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data; // return the array directly
};