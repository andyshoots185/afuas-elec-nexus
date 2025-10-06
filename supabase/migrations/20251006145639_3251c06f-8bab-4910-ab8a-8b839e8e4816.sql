-- Migration: Setup Realtime for Products and Orders
-- Ensure REPLICA IDENTITY is set for realtime updates
ALTER TABLE public.products REPLICA IDENTITY FULL;
ALTER TABLE public.orders REPLICA IDENTITY FULL;