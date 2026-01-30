import { supabase } from '../supabase';
import type { Order, OrderItem, OrderFormData, CartItem } from '../types';

// Create a new order with items
export async function createOrder(
    orderData: OrderFormData,
    items: CartItem[]
): Promise<Order | null> {
    // Calculate total
    const totalAmount = items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
    );

    // Insert order
    const insertData = {
        user_email: orderData.user_email,
        user_name: orderData.user_name,
        user_phone: orderData.user_phone || null,
        shipping_address: orderData.shipping_address,
        notes: orderData.notes || null,
        total_amount: totalAmount,
        status: 'pending',
    };

    const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert(insertData as never)
        .select()
        .single();

    if (orderError || !order) {
        console.error('Error creating order:', orderError);
        return null;
    }

    const typedOrder = order as Order;

    // Insert order items
    const orderItems = items.map((item) => ({
        order_id: typedOrder.id,
        product_id: item.product.id,
        product_name: item.product.name,
        product_price: item.product.price,
        quantity: item.quantity,
        is_custom_request: false,
    }));

    const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems as never[]);

    if (itemsError) {
        console.error('Error creating order items:', itemsError);
        // Rollback order
        await supabase.from('orders').delete().eq('id', typedOrder.id);
        return null;
    }

    return typedOrder;
}

// Get orders by email (for customers)
export async function getOrdersByEmail(email: string): Promise<Order[]> {
    const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_email', email)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching orders:', error);
        return [];
    }

    return (data as Order[]) || [];
}

// Get all orders (for admin)
export async function getAllOrders(): Promise<Order[]> {
    const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching all orders:', error);
        return [];
    }

    return (data as Order[]) || [];
}

// Get pending orders (for admin dashboard)
export async function getPendingOrders(): Promise<Order[]> {
    const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching pending orders:', error);
        return [];
    }

    return (data as Order[]) || [];
}

// Get order by ID with items
export async function getOrderWithItems(id: string): Promise<{ order: Order; items: OrderItem[] } | null> {
    const { data: order, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', id)
        .single();

    if (orderError || !order) {
        console.error('Error fetching order:', orderError);
        return null;
    }

    const { data: items, error: itemsError } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', id);

    if (itemsError) {
        console.error('Error fetching order items:', itemsError);
        return null;
    }

    return { order: order as Order, items: (items as OrderItem[]) || [] };
}

// Update order status
export async function updateOrderStatus(
    id: string,
    status: Order['status'],
    trackingLink?: string
): Promise<boolean> {
    const updateData: Record<string, unknown> = { status };
    if (trackingLink !== undefined) {
        updateData.tracking_link = trackingLink;
    }

    const { error } = await supabase
        .from('orders')
        .update(updateData as never)
        .eq('id', id);

    if (error) {
        console.error('Error updating order status:', error);
        return false;
    }

    return true;
}

// Add tracking link
export async function addTrackingLink(id: string, trackingLink: string): Promise<boolean> {
    const { error } = await supabase
        .from('orders')
        .update({ tracking_link: trackingLink, status: 'shipped' } as never)
        .eq('id', id);

    if (error) {
        console.error('Error adding tracking link:', error);
        return false;
    }

    return true;
}

// Get order stats for admin dashboard
export async function getOrderStats(): Promise<{
    totalOrders: number;
    pendingOrders: number;
    totalRevenue: number;
}> {
    const { data: orders, error } = await supabase
        .from('orders')
        .select('status, total_amount');

    if (error || !orders) {
        console.error('Error fetching order stats:', error);
        return { totalOrders: 0, pendingOrders: 0, totalRevenue: 0 };
    }

    interface OrderStat {
        status: string;
        total_amount: number;
    }

    const typedOrders = orders as OrderStat[];
    const totalOrders = typedOrders.length;
    const pendingOrders = typedOrders.filter((o) => o.status === 'pending').length;
    const totalRevenue = typedOrders
        .filter((o) => o.status !== 'rejected' && o.status !== 'cancelled')
        .reduce((sum, o) => sum + Number(o.total_amount), 0);

    return { totalOrders, pendingOrders, totalRevenue };
}
