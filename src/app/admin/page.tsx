"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import axios from "@/lib/axios";
import LoadSpinner from "@/components/LoadSpinner";
import InviteUserModal from "@/components/admin/InviteUserModal";
import UserListTable from "@/components/admin/UserListTable";
import UserStatistics from "@/components/admin/UserStatistics";
import { toast } from "react-hot-toast";
import Link from "next/link";
import Image from "next/image";
import ProtectedLayout from "@/components/layouts/ProtectedLayout";


type UserStats = {
  total_users: number;
  active_users: number;
  inactive_users: number;
  admin_users: number;
  regular_users: number;
  pending_invitations: number;
};

export default function AdminDashboard() {
  const { user, token, loading: authLoading } = useAuth();
  const router = useRouter();
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [statistics, setStatistics] = useState<UserStats | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      toast.error('Access denied. Admin only.');
      router.push('/projects');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (token && user?.role === 'admin') {
      fetchStatistics();
    }
  }, [token, user, refreshTrigger]);

  const fetchStatistics = async () => {
    try {
      const res = await axios.get('/admin/users/statistics', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStatistics(res.data.data);
    } catch (err) {
      console.error('Failed to fetch statistics', err);
    }
  };

  const handleUserChange = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  if (authLoading || !user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadSpinner />
      </div>
    );
  }

  if (user.role !== 'admin') {
    return null;
  }

  return (
    <ProtectedLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">          
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <button
            onClick={() => setIsInviteModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition"
          >
            + Invite User
          </button>
        </div>
  
        {statistics && <UserStatistics stats={statistics} />}
  
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h2 className="text-2xl font-semibold mb-4">User Management</h2>
          <UserListTable 
            token={token} 
            onUserChange={handleUserChange}
          />
        </div>
  
        <InviteUserModal
          isOpen={isInviteModalOpen}
          onClose={() => setIsInviteModalOpen(false)}
          token={token}
          onUserInvited={handleUserChange}
        />
      </div>
    </ProtectedLayout>
  );
}
