import { supabase } from '../supabase';
import type { CustomOrder, CustomOrderFormData, StockRequest } from '../types';

// Create a new custom order request
export async function createCustomOrder(
    orderData: CustomOrderFormData,
    referenceImages?: File[]
): Promise<CustomOrder | null> {
    let imageUrls: string[] = [];

    // Upload reference images if provided
    if (referenceImages && referenceImages.length > 0) {
        for (const file of referenceImages) {
            const url = await uploadReferenceImage(file);
            if (url) imageUrls.push(url);
        }
    }

    const insertData = {
        user_email: orderData.user_email,
        user_name: orderData.user_name,
        user_phone: orderData.user_phone || null,
        description: orderData.description,
        budget_range: orderData.budget_range || null,
        deadline: orderData.deadline || null,
        reference_images: imageUrls.length > 0 ? imageUrls : null,
        status: 'pending',
    };

    const { data, error } = await supabase
        .from('custom_orders')
        .insert(insertData as never)
        .select()
        .single();

    if (error) {
        console.error('Error creating custom order:', error);
        return null;
    }

    return data as CustomOrder;
}

// Get all custom orders (for admin)
export async function getAllCustomOrders(): Promise<CustomOrder[]> {
    const { data, error } = await supabase
        .from('custom_orders')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching custom orders:', error);
        return [];
    }

    return (data as CustomOrder[]) || [];
}

// Get pending custom orders
export async function getPendingCustomOrders(): Promise<CustomOrder[]> {
    const { data, error } = await supabase
        .from('custom_orders')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching pending custom orders:', error);
        return [];
    }

    return (data as CustomOrder[]) || [];
}

// Get custom orders by email
export async function getCustomOrdersByEmail(email: string): Promise<CustomOrder[]> {
    const { data, error } = await supabase
        .from('custom_orders')
        .select('*')
        .eq('user_email', email)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching custom orders:', error);
        return [];
    }

    return (data as CustomOrder[]) || [];
}

// Update custom order (for admin)
export async function updateCustomOrder(
    id: string,
    updates: {
        status?: CustomOrder['status'];
        admin_notes?: string;
        quoted_price?: number;
    }
): Promise<boolean> {
    const { error } = await supabase
        .from('custom_orders')
        .update(updates as never)
        .eq('id', id);

    if (error) {
        console.error('Error updating custom order:', error);
        return false;
    }

    return true;
}

// Upload reference image for custom orders
async function uploadReferenceImage(file: File): Promise<string | null> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `custom-orders/${fileName}`;

    const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

    if (uploadError) {
        console.error('Error uploading reference image:', uploadError);
        return null;
    }

    const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

    return publicUrl;
}

// ============================================
// Stock Request Functions
// ============================================

// Create stock request
export async function createStockRequest(
    productId: string,
    userEmail: string,
    userName: string,
    quantity: number = 1
): Promise<StockRequest | null> {
    const insertData = {
        product_id: productId,
        user_email: userEmail,
        user_name: userName,
        quantity,
        status: 'pending',
    };

    const { data, error } = await supabase
        .from('stock_requests')
        .insert(insertData as never)
        .select()
        .single();

    if (error) {
        console.error('Error creating stock request:', error);
        return null;
    }

    return data as StockRequest;
}

// Get all stock requests (for admin)
export async function getAllStockRequests(): Promise<(StockRequest & { product_name?: string })[]> {
    const { data, error } = await supabase
        .from('stock_requests')
        .select(`
      *,
      products (name)
    `)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching stock requests:', error);
        return [];
    }

    interface StockRequestWithProduct extends StockRequest {
        products?: { name?: string };
    }

    // Flatten the product name
    return ((data as StockRequestWithProduct[]) || []).map((req) => ({
        ...req,
        product_name: req.products?.name,
    }));
}

// Update stock request status
export async function updateStockRequestStatus(
    id: string,
    status: StockRequest['status']
): Promise<boolean> {
    const { error } = await supabase
        .from('stock_requests')
        .update({ status } as never)
        .eq('id', id);

    if (error) {
        console.error('Error updating stock request status:', error);
        return false;
    }

    return true;
}
