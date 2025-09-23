-- Create first admin user (run this after creating your first account)
-- Replace 'your-email@example.com' with the actual admin email
UPDATE public.profiles 
SET role = 'admin' 
WHERE id = (
    SELECT id FROM auth.users 
    WHERE email = 'your-email@example.com'
    LIMIT 1
);

-- Verify the admin role was set
SELECT p.id, p.first_name, p.last_name, p.role, u.email
FROM public.profiles p
JOIN auth.users u ON p.id = u.id
WHERE p.role = 'admin';