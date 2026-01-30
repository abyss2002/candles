// Database types for Supabase

export interface Product {
    id: string;
    name: string;
    price: number;
    description: string | null;
    category: 'candle' | 'quilling';
    fragrance_type: string | null;
    image_url: string | null;
    stock: number;
    is_bestseller: boolean;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface Order {
    id: string;
    user_email: string;
    user_name: string;
    user_phone: string | null;
    shipping_address: string;
    status: 'pending' | 'approved' | 'rejected' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    tracking_link: string | null;
    total_amount: number;
    notes: string | null;
    created_at: string;
    updated_at: string;
}

export interface OrderItem {
    id: string;
    order_id: string;
    product_id: string | null;
    product_name: string;
    product_price: number;
    quantity: number;
    is_custom_request: boolean;
    created_at: string;
}

export interface CustomOrder {
    id: string;
    user_email: string;
    user_name: string;
    user_phone: string | null;
    description: string;
    reference_images: string[] | null;
    budget_range: string | null;
    deadline: string | null;
    status: 'pending' | 'reviewed' | 'quoted' | 'accepted' | 'in_progress' | 'completed' | 'rejected';
    admin_notes: string | null;
    quoted_price: number | null;
    created_at: string;
    updated_at: string;
}

export interface StockRequest {
    id: string;
    product_id: string;
    user_email: string;
    user_name: string;
    quantity: number;
    status: 'pending' | 'notified' | 'fulfilled';
    created_at: string;
}

// Form types for creating/editing
export interface ProductFormData {
    name: string;
    price: number;
    description: string;
    category: 'candle' | 'quilling';
    fragrance_type: string;
    stock: number;
    is_bestseller: boolean;
    is_active: boolean;
}

export interface OrderFormData {
    user_email: string;
    user_name: string;
    user_phone: string;
    shipping_address: string;
    notes: string;
}

export interface CustomOrderFormData {
    user_email: string;
    user_name: string;
    user_phone: string;
    description: string;
    budget_range: string;
    deadline: string;
}

// Cart types
export interface CartItem {
    product: Product;
    quantity: number;
}

// Database schema type for Supabase client
export interface Database {
    public: {
        Tables: {
            products: {
                Row: Product;
                Insert: Omit<Product, 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Omit<Product, 'id' | 'created_at' | 'updated_at'>>;
            };
            orders: {
                Row: Order;
                Insert: Omit<Order, 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Omit<Order, 'id' | 'created_at' | 'updated_at'>>;
            };
            order_items: {
                Row: OrderItem;
                Insert: Omit<OrderItem, 'id' | 'created_at'>;
                Update: Partial<Omit<OrderItem, 'id' | 'created_at'>>;
            };
            custom_orders: {
                Row: CustomOrder;
                Insert: Omit<CustomOrder, 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Omit<CustomOrder, 'id' | 'created_at' | 'updated_at'>>;
            };
            stock_requests: {
                Row: StockRequest;
                Insert: Omit<StockRequest, 'id' | 'created_at'>;
                Update: Partial<Omit<StockRequest, 'id' | 'created_at'>>;
            };
        };
    };
}
