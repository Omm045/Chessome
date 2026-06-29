'use client';

import { useCurrentUser } from '@/hooks/useCurrentUser';
import { User, Mail, Shield, Activity, Calendar, CheckCircle, XCircle, LogOut } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { user } = useCurrentUser();
  const router = useRouter();

  if (!user) return null; // handled by ProtectedRoute wrapper

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const formatDate = (dateString: string | Date | undefined) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="mx-auto max-w-4xl p-6 md:p-10 text-gray-200">
      <div className="mb-8 flex items-center justify-between border-b border-gray-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Profile</h1>
          <p className="mt-2 text-sm text-gray-400">Manage your account information and identity.</p>
        </div>
        <button 
          onClick={handleSignOut}
          className="flex items-center gap-2 rounded-md bg-gray-800 px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-700 hover:text-white"
        >
          <LogOut size={16} />
          Sign out
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Avatar Section */}
        <div className="md:col-span-1">
          <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6 flex flex-col items-center justify-center text-center">
            <div className="mb-4 flex h-32 w-32 items-center justify-center rounded-full bg-gray-800 border-4 border-gray-700 overflow-hidden">
              {user.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
              ) : (
                <User size={48} className="text-gray-500" />
              )}
            </div>
            <h2 className="text-xl font-bold text-white">{user.displayName || user.username || 'Anonymous User'}</h2>
            {user.username && <p className="text-sm text-gray-400">@{user.username}</p>}
          </div>
        </div>

        {/* Details Section */}
        <div className="md:col-span-2 space-y-6">
          
          <div className="rounded-xl border border-gray-800 bg-gray-900/50 overflow-hidden">
            <div className="border-b border-gray-800 bg-gray-800/20 px-6 py-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Account Details</h3>
            </div>
            <div className="divide-y divide-gray-800">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6">
                <div className="flex items-center gap-3 mb-2 sm:mb-0">
                  <Mail size={18} className="text-gray-500" />
                  <span className="text-sm font-medium text-gray-300">Email Address</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-white">{user.email || 'Not provided'}</span>
                  {user.email && (
                    user.emailVerified ? (
                      <span className="flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-400 border border-green-500/20">
                        <CheckCircle size={12} /> Verified
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 rounded-full bg-yellow-500/10 px-2 py-0.5 text-xs font-medium text-yellow-400 border border-yellow-500/20">
                        <XCircle size={12} /> Unverified
                      </span>
                    )
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6">
                <div className="flex items-center gap-3 mb-2 sm:mb-0">
                  <Shield size={18} className="text-gray-500" />
                  <span className="text-sm font-medium text-gray-300">Role</span>
                </div>
                <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400 border border-blue-500/20">
                  {user.role}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6">
                <div className="flex items-center gap-3 mb-2 sm:mb-0">
                  <Activity size={18} className="text-gray-500" />
                  <span className="text-sm font-medium text-gray-300">Account Status</span>
                </div>
                <span className="flex items-center gap-1.5 text-sm font-medium text-green-400">
                  <span className="h-2 w-2 rounded-full bg-green-500"></span>
                  {user.status}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6">
                <div className="flex items-center gap-3 mb-2 sm:mb-0">
                  <Calendar size={18} className="text-gray-500" />
                  <span className="text-sm font-medium text-gray-300">Member Since</span>
                </div>
                <span className="text-sm text-gray-400">
                  {formatDate(user.createdAt)}
                </span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
