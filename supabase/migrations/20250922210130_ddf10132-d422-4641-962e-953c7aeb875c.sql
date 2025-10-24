-- First ensure we have authentication working and create admin roles if not exists
-- The profiles table already exists, so let's add role field to it if it doesn't exist

-- Add role field to profiles if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'role') THEN
        ALTER TABLE public.profiles ADD COLUMN role text DEFAULT 'customer';
    END IF;
END $$;

-- Create chat messages table for buyer-seller communication
CREATE TABLE IF NOT EXISTS public.messages (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    sender_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    receiver_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
    content text NOT NULL,
    message_type text DEFAULT 'text',
    is_read boolean DEFAULT false,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS for messages
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for messages
CREATE POLICY "Users can view their own messages" 
ON public.messages 
FOR SELECT 
USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send messages" 
ON public.messages 
FOR INSERT 
WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update read status on messages sent to them" 
ON public.messages 
FOR UPDATE 
USING (auth.uid() = receiver_id)
WITH CHECK (auth.uid() = receiver_id);

-- Create a trigger to update updated_at
CREATE TRIGGER update_messages_updated_at
    BEFORE UPDATE ON public.messages
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create conversation view helper
CREATE OR REPLACE VIEW public.conversations AS
SELECT DISTINCT
    CASE 
        WHEN m.sender_id = auth.uid() THEN m.receiver_id
        ELSE m.sender_id
    END as other_user_id,
    m.product_id,
    p.name as product_name,
    p.image as product_image,
    p.price_ugx as product_price,
    MAX(m.created_at) as last_message_time,
    COUNT(CASE WHEN m.receiver_id = auth.uid() AND NOT m.is_read THEN 1 END) as unread_count
FROM public.messages m
LEFT JOIN public.products p ON m.product_id = p.id
WHERE m.sender_id = auth.uid() OR m.receiver_id = auth.uid()
GROUP BY other_user_id, m.product_id, p.name, p.image, p.price_ugx
ORDER BY last_message_time DESC;

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_messages_participants ON public.messages(sender_id, receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at);
CREATE INDEX IF NOT EXISTS idx_messages_unread ON public.messages(receiver_id, is_read) WHERE NOT is_read;