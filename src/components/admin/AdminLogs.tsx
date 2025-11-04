import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Search, Activity, User, Package, ShoppingCart, MessageSquare } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface AdminLog {
  id: string;
  admin_id: string;
  action: string;
  resource_type: string;
  resource_id?: string;
  details?: any;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
  admin_profile?: {
    first_name?: string;
    last_name?: string;
  };
}

export function AdminLogs() {
  const [logs, setLogs] = useState<AdminLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const { data: logsData, error } = await supabase
        .from('admin_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      // Fetch profiles separately
      const adminIds = [...new Set(logsData?.map(log => log.admin_id) || [])];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, first_name, last_name')
        .in('id', adminIds);

      // Merge profiles with logs
      const logsWithProfiles = logsData?.map(log => ({
        ...log,
        ip_address: log.ip_address as string || '',
        admin_profile: profiles?.find(p => p.id === log.admin_id)
      })) || [];

      setLogs(logsWithProfiles as AdminLog[]);
    } catch (error) {
      console.error('Error fetching admin logs:', error);
      toast.error('Failed to fetch admin logs');
    } finally {
      setLoading(false);
    }
  };

  const getResourceIcon = (resourceType: string) => {
    switch (resourceType) {
      case 'product':
        return <Package className="h-4 w-4" />;
      case 'order':
        return <ShoppingCart className="h-4 w-4" />;
      case 'user':
        return <User className="h-4 w-4" />;
      case 'message':
        return <MessageSquare className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getActionBadgeVariant = (action: string) => {
    if (action.includes('create') || action.includes('add')) return 'default';
    if (action.includes('update') || action.includes('edit')) return 'secondary';
    if (action.includes('delete') || action.includes('ban')) return 'destructive';
    return 'outline';
  };

  const filteredLogs = logs.filter(log => {
    const matchesFilter = filter === 'all' || log.resource_type === filter;
    const matchesSearch = !search || 
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.resource_type.toLowerCase().includes(search.toLowerCase()) ||
      (log.admin_profile?.first_name?.toLowerCase() || '').includes(search.toLowerCase()) ||
      (log.admin_profile?.last_name?.toLowerCase() || '').includes(search.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const formatAdminName = (log: AdminLog) => {
    if (log.admin_profile?.first_name || log.admin_profile?.last_name) {
      return `${log.admin_profile.first_name || ''} ${log.admin_profile.last_name || ''}`.trim();
    }
    return `Admin ${log.admin_id.slice(0, 8)}`;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Admin Activity Logs</CardTitle>
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
          <Activity className="h-5 w-5" />
          Admin Activity Logs
        </CardTitle>
        <CardDescription>
          Track all administrative actions and changes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search logs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by resource" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Resources</SelectItem>
              <SelectItem value="product">Products</SelectItem>
              <SelectItem value="order">Orders</SelectItem>
              <SelectItem value="user">Users</SelectItem>
              <SelectItem value="message">Messages</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Admin</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Resource</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    <div className="font-medium text-sm">
                      {formatAdminName(log)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getActionBadgeVariant(log.action)}>
                      {log.action.replace(/_/g, ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getResourceIcon(log.resource_type)}
                      <span className="capitalize">{log.resource_type}</span>
                      {log.resource_id && (
                        <code className="text-xs bg-muted px-1 rounded">
                          {log.resource_id.slice(0, 8)}
                        </code>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-muted-foreground max-w-xs">
                      {log.details ? (
                        <details className="cursor-pointer">
                          <summary className="hover:text-foreground">
                            View details
                          </summary>
                          <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-auto">
                            {JSON.stringify(log.details, null, 2)}
                          </pre>
                        </details>
                      ) : (
                        'No additional details'
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {format(new Date(log.created_at), 'MMM dd, yyyy')}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {format(new Date(log.created_at), 'HH:mm:ss')}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredLogs.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No admin logs found matching your criteria.
          </div>
        )}
      </CardContent>
    </Card>
  );
}