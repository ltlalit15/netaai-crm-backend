import Controllers from "../Models/Model.js";
import { successResponse, errorResponse } from "../Utils/responseHandler.js";

const ProductTable = new Controllers("products");

class ProductController {
    // Create Product
    static async createProduct(req, res) {
        try {
            const {
                name,
                description,
                extended_description,
                tags,
                unit_of_measure,
                unit_price,
                unit_cost,
                sku
            } = req.body;

            if (!name) {
                return errorResponse(res, 400, "Product name is required.");
            }

            const data = {
                name,
                description,
                extended_description,
                tags: JSON.stringify(tags),
                unit_of_measure,
                unit_price,
                unit_cost,
                sku
            };


            const result = await ProductTable.create(data);
            const inserted = await ProductTable.getById(result.insertId);

            return successResponse(res, 201, "Product created successfully", inserted);
        } catch (error) {
            return errorResponse(res, 500, error.message);
        }
    }

    // Get All Products
    static async getAllProducts(req, res) {
        try {
            const result = await ProductTable.getAll();
            return successResponse(res, 200, "Products fetched successfully", result);
        } catch (error) {
            return errorResponse(res, 500, error.message);
        }
    }

    // Get One Product
    static async getProductById(req, res) {
        try {
            const { id } = req.params;
            const product = await ProductTable.getById(id);
            if (!product) {
                return errorResponse(res, 404, "Product not found.");
            }
            return successResponse(res, 200, "Product found", product);
        } catch (error) {
            return errorResponse(res, 500, error.message);
        }
    }

    // Update Product
    static async updateProduct(req, res) {
        try {
            const { id } = req.params;
            const {
                name,
                description,
                extended_description,
                tags,
                unit_of_measure,
                unit_price,
                unit_cost,
                sku
            } = req.body;

            const data = {
                name,
                description,
                extended_description,
                tags: JSON.stringify(tags),
                unit_of_measure,
                unit_price,
                unit_cost,
                sku
            };

            await ProductTable.update(id, data);
            const updated = await ProductTable.getById(id);
            return successResponse(res, 200, "Product updated successfully", updated);
        } catch (error) {
            return errorResponse(res, 500, error.message);
        }
    }

    // Delete Product
    static async deleteProduct(req, res) {
        try {
            const { id } = req.params;
            await ProductTable.delete(id);
            return successResponse(res, 200, "Product deleted successfully");
        } catch (error) {
            return errorResponse(res, 500, error.message);
        }
    }
}

export default ProductController;
