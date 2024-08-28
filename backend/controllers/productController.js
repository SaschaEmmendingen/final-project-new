import Product from '../models/Product.js'; // Pfad zu Ihrem Product-Modell

export const addProduct = async (req, res) => {
  const { name, description, price, category, stock } = req.body;

  try {
    const product = new Product({
      name,
      description,
      price,
      category,
      stock,
    });

    const createdProduct = await product.save();

    res.status(201).json(createdProduct);
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ message: 'Server error' });
  }
};