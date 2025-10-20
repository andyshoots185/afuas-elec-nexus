-- Set admin role for specific email
-- First, we need to get the user_id for the email nakaakawaafuwa@gmail.com
-- Then insert admin role if not exists

-- Create a function to safely add admin role
CREATE OR REPLACE FUNCTION add_admin_role_by_email(admin_email text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  target_user_id uuid;
BEGIN
  -- Get user_id from auth.users
  SELECT id INTO target_user_id
  FROM auth.users
  WHERE email = admin_email;
  
  -- If user exists, add admin role
  IF target_user_id IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (target_user_id, 'admin'::app_role)
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
END;
$$;

-- Add admin role for the specified email
-- This will be executed when the user signs up or already exists
-- For now, create a trigger that will execute this when user signs in

-- Create trigger function to auto-assign admin role on first login
CREATE OR REPLACE FUNCTION auto_assign_admin_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if user email matches admin email
  IF NEW.email = 'nakaakawaafuwa@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin'::app_role)
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger on auth.users (if possible) or use existing handle_new_user_role trigger
-- Since we can't modify auth schema, we'll update the existing trigger function
DROP TRIGGER IF EXISTS on_auth_user_created_assign_admin ON auth.users;
CREATE TRIGGER on_auth_user_created_assign_admin
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION auto_assign_admin_role();