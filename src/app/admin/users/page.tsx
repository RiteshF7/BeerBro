'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AdminTable } from '@/components/admin/AdminTable';
import { UserForm } from '@/features/users/UserForm';
import { UserWithId, UserFormData } from '@/features/users/types';
import { getUsers, createUser, updateUser, deleteUser } from '@/features/users/api';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Plus, Users, UserCheck, UserX } from 'lucide-react';
import { toast } from 'sonner';

export default function UsersPage() {
  const [users, setUsers] = useState<UserWithId[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserWithId | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const columns = [
    {
      key: 'photoURL' as keyof UserWithId,
      label: 'Avatar',
      render: (value: unknown, user: UserWithId) => (
        <Avatar className="h-8 w-8">
          <AvatarImage src={value as string} alt={user.displayName || user.email} />
          <AvatarFallback>
            {user.displayName?.charAt(0) || user.email.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      ),
    },
    {
      key: 'displayName' as keyof UserWithId,
      label: 'Name',
      render: (value: unknown, user: UserWithId) => (
        <div>
          <p className="font-medium">{value as string || 'No name'}</p>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
      ),
    },
    {
      key: 'role' as keyof UserWithId,
      label: 'Role',
      render: (value: unknown) => (
        <Badge variant="outline" className="capitalize">
          {value as string}
        </Badge>
      ),
    },
    {
      key: 'isActive' as keyof UserWithId,
      label: 'Status',
      render: (value: unknown) => {
        const isActive = value as boolean;
        return (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              isActive
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {isActive ? 'Active' : 'Inactive'}
          </span>
        );
      },
    },
    {
      key: 'lastLoginAt' as keyof UserWithId,
      label: 'Last Login',
      render: (value: unknown) => (
        <span className="text-sm text-gray-600">
          {value ? (value as Date).toLocaleDateString() : 'Never'}
        </span>
      ),
    },
    {
      key: 'createdAt' as keyof UserWithId,
      label: 'Joined',
      render: (value: unknown) => (value as Date).toLocaleDateString(),
    },
  ];

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleCreateUser = async (data: UserFormData) => {
    try {
      setIsSubmitting(true);
      await createUser(data);
      toast.success('User created successfully');
      await loadUsers();
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error('Failed to create user');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateUser = async (data: UserFormData) => {
    if (!editingUser) return;

    try {
      setIsSubmitting(true);
      await updateUser(editingUser.id, data);
      toast.success('User updated successfully');
      await loadUsers();
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditUser = (user: UserWithId) => {
    setEditingUser(user);
    setIsFormOpen(true);
  };


  const handleDeleteUser = async (user: UserWithId) => {
    if (!confirm(`Are you sure you want to delete user "${user.displayName || user.email}"?`)) {
      return;
    }

    try {
      await deleteUser(user.id);
      toast.success('User deleted successfully');
      await loadUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingUser(null);
  };

  const getStats = () => {
    const totalUsers = users.length;
    const activeUsers = users.filter(u => u.isActive).length;
    const adminUsers = users.filter(u => u.role === 'admin').length;
    
    return { totalUsers, activeUsers, adminUsers };
  };

  const stats = getStats();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-600">Manage user accounts and permissions</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center">
            <UserCheck className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeUsers}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center">
            <UserX className="h-8 w-8 text-orange-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Admin Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats.adminUsers}</p>
            </div>
          </div>
        </div>
      </div>

      <AdminTable
        data={users}
        columns={columns}
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
        isLoading={isLoading}
        emptyMessage="No users found."
      />

      <UserForm
        user={editingUser || undefined}
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={editingUser ? handleUpdateUser : handleCreateUser}
        isLoading={isSubmitting}
      />
    </div>
  );
}
