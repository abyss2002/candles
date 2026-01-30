import { supabase } from '../supabase';
import type { Product, ProductFormData } from '../types';

// Get all active products
export async function getProducts(category?: 'candle' | 'quilling'): Promise<Product[]> {
    let query = supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

    if (category) {
        query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching products:', error);
        return [];
    }

    return (data as Product[]) || [];
}

// Get all products for admin (including inactive)
export async function getAllProducts(): Promise<Product[]> {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching all products:', error);
        return [];
    }

    return (data as Product[]) || [];
}

// Get bestseller products
export async function getBestsellers(): Promise<Product[]> {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .eq('is_bestseller', true)
        .order('created_at', { ascending: false })
        .limit(6);

    if (error) {
        console.error('Error fetching bestsellers:', error);
        return [];
    }

    return (data as Product[]) || [];
}

// Get single product by ID
export async function getProductById(id: string): Promise<Product | null> {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching product:', error);
        return null;
    }

    return data as Product;
}

// Create new product
export async function createProduct(product: ProductFormData, imageFile?: File): Promise<Product | null> {
    let imageUrl: string | null = null;

    // Upload image if provided
    if (imageFile) {
        imageUrl = await uploadProductImage(imageFile);
    }

    const insertData = {
        name: product.name,
        price: product.price,
        description: product.description || null,
        category: product.category,
        fragrance_type: product.fragrance_type || null,
        stock: product.stock,
        is_bestseller: product.is_bestseller,
        is_active: product.is_active,
        image_url: imageUrl,
    };

    const { data, error } = await supabase
        .from('products')
        .insert(insertData as never)
        .select()
        .single();

    if (error) {
        console.error('Error creating product:', error);
        return null;
    }

    return data as Product;
}

// Update product
export async function updateProduct(id: string, product: Partial<ProductFormData>, imageFile?: File): Promise<Product | null> {
    const updateData: Record<string, unknown> = {};

    if (product.name !== undefined) updateData.name = product.name;
    if (product.price !== undefined) updateData.price = product.price;
    if (product.description !== undefined) updateData.description = product.description || null;
    if (product.category !== undefined) updateData.category = product.category;
    if (product.fragrance_type !== undefined) updateData.fragrance_type = product.fragrance_type || null;
    if (product.stock !== undefined) updateData.stock = product.stock;
    if (product.is_bestseller !== undefined) updateData.is_bestseller = product.is_bestseller;
    if (product.is_active !== undefined) updateData.is_active = product.is_active;

    // Upload new image if provided
    if (imageFile) {
        const imageUrl = await uploadProductImage(imageFile);
        if (imageUrl) {
            updateData.image_url = imageUrl;
        }
    }

    const { data, error } = await supabase
        .from('products')
        .update(updateData as never)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating product:', error);
        return null;
    }

    return data as Product;
}

// Delete product (soft delete by setting is_active to false)
export async function deleteProduct(id: string): Promise<boolean> {
    const { error } = await supabase
        .from('products')
        .update({ is_active: false })
        .eq('id', id);

    if (error) {
        console.error('Error deleting product:', error.message);
        return false;
    }

    return true;
}

// Hard delete product
export async function hardDeleteProduct(id: string): Promise<boolean> {
    const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error hard deleting product:', error);
        return false;
    }

    return true;
}

// Update stock
export async function updateStock(id: string, stock: number): Promise<boolean> {
    const { error } = await supabase
        .from('products')
        .update({ stock } as never)
        .eq('id', id);

    if (error) {
        console.error('Error updating stock:', error);
        return false;
    }

    return true;
}

// Upload product image
export async function uploadProductImage(file: File): Promise<string | null> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `products/${fileName}`;

    const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

    if (uploadError) {
        console.error('Error uploading image:', uploadError);
        return null;
    }

    const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

    return publicUrl;
}
