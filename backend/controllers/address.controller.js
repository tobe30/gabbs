import Address from "../models/Address.js";

export const addAddress = async (req, res) => {
  try {
    const userId = req.auth.userId;
    if (!userId) return res.status(401).json({ error: "Not authorized" });

    const address  = req.body;
    if (!address) return res.status(400).json({ message: "Address data is required" });

    const newAddress = await Address.create({
      userId,
      ...address // destructure address fields
    });

    return res.status(201).json({
      newAddress,
      message: "Address added successfully"
    });

  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: error.message });
  }
};

export const getUserAddresses = async (req, res) => {
    try {
        const userId = req.auth.userId;
        if (!userId) return res.status(401).json({ error: "Not authorized" });

        const addresses = await Address.find({ userId }).sort({ createdAt: -1 });

        return res.status(200).json({ addresses });
    } catch (error) {
    console.error(error);
    return res.status(400).json({ error: error.message });
    }
}
