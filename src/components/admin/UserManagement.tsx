import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Shield, UserX, User, Crown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { formatUGX } from '@/utils/formatUGX';

interface UserProfile {
  id: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  role: string;
  avatar_url?: string;
  is_banned: boolean;
  created_at: string;
  email?: string;
  orders_count?: number;
  total_spent?: number;
}

export function UserManagement() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // Fetch profiles with user emails and order statistics
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Try to get user emails from auth (may fail if not admin)
      let authUsers: any = { users: [] };
      try {
        const result = await supabase.auth.admin.listUsers();
        authUsers = result.data || { users: [] };
      } catch {
        // If fails, continue without emails (user is not admin)
      }
      
      // Get order statistics for each user
      const { data: orderStats, error: orderError } = await supabase
        .from('orders')
        .select(`
          user_id,
          total_amount_ugx,
          status
        `);

      if (orderError) throw orderError;

      // Combine data
      const usersWithStats = profiles?.map(profile => {
        const authUser = authUsers?.users.find(u => u.id === profile.id);
        const userOrders = orderStats?.filter(o => o.user_id === profile.id) || [];
        const completedOrders = userOrders.filter(o => o.status === 'delivered');
        
        return {
          ...profile,
          email: authUser?.email,
          orders_count: userOrders.length,
          total_spent: completedOrders.reduce((sum, order) => sum + (order.total_amount_ugx || 0), 0)
        };
      }) || [];

      setUsers(usersWithStats);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;

      // Log admin action
      await supabase.rpc('log_admin_action', {
        p_action: 'update_user_role',
        p_resource_type: 'user',
        p_resource_id: userId,
        p_details: { new_role: newRole }
      });

      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));

      toast.success('User role updated successfully');
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Failed to update user role');
    }
  };

  const toggleUserBan = async (userId: string, currentBanStatus: boolean) => {
    try {
      const newBanStatus = !currentBanStatus;
      
      const { error } = await supabase
        .from('profiles')
        .update({ is_banned: newBanStatus })
        .eq('id', userId);

      if (error) throw error;

      // Log admin action
      await supabase.rpc('log_admin_action', {
        p_action: newBanStatus ? 'ban_user' : 'unban_user',
        p_resource_type: 'user',
        p_resource_id: userId,
        p_details: { banned: newBanStatus }
      });

      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, is_banned: newBanStatus } : user
      ));

      toast.success(`User ${newBanStatus ? 'banned' : 'unbanned'} successfully`);
    } catch (error) {
      console.error('Error updating user ban status:', error);
      toast.error('Failed to update user ban status');
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Crown className="h-4 w-4" />;
      case 'seller':
        return <Shield className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'destructive';
      case 'seller':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase() || 'U';
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          User Management
        </CardTitle>
        <CardDescription>
          Manage user roles, permissions, and account status
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar_url} />
                        <AvatarFallback className="text-xs">
                          {getInitials(user.first_name, user.last_name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">
                          {user.first_name || user.last_name 
                            ? `${user.first_name || ''} ${user.last_name || ''}`.trim()
                            : 'Unknown User'
                          }
                        </div>
                        {user.phone && (
                          <div className="text-sm text-muted-foreground">
                            {user.phone}
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{user.email || 'N/A'}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getRoleBadgeVariant(user.role)} className="gap-1">
                      {getRoleIcon(user.role)}
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm font-medium">{user.orders_count || 0}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm font-medium">
                      {formatUGX(user.total_spent || 0)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.is_banned ? 'destructive' : 'default'}>
                      {user.is_banned ? 'Banned' : 'Active'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Select
                        value={user.role}
                        onValueChange={(value) => updateUserRole(user.id, value)}
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="seller">Seller</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant={user.is_banned ? 'outline' : 'destructive'}
                        size="sm"
                        onClick={() => toggleUserBan(user.id, user.is_banned)}
                      >
                        {user.is_banned ? (
                          <>
                            <User className="h-3 w-3 mr-1" />
                            Unban
                          </>
                        ) : (
                          <>
                            <UserX className="h-3 w-3 mr-1" />
                            Ban
                          </>
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}