import { useAppSelector } from '@/store/hooks';
import type { RootState } from '@/store';
import { useConnections, usePendingRequests, useAcceptConnectionRequest, useRejectConnectionRequest, useRemoveConnection } from '@/hooks/useConnections';
import { useSearchUsers } from '@/hooks/useUser';
import { useSendConnectionRequest } from '@/hooks/useConnections';
import { toast } from 'sonner';
import { useState } from 'react';

export default function ConnectionsPage() {
  const user = useAppSelector((state: RootState) => state.auth.user);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { data: connections, isLoading: connectionsLoading } = useConnections();
  const { data: pendingRequests, isLoading: requestsLoading } = usePendingRequests();
  const { data: searchResults } = useSearchUsers({ query: searchQuery });
  
  const acceptRequest = useAcceptConnectionRequest();
  const rejectRequest = useRejectConnectionRequest();
  const sendRequest = useSendConnectionRequest();
  const removeConnection = useRemoveConnection();

  const handleAccept = async (connectionId: string) => {
    try {
      await acceptRequest.mutateAsync(connectionId);
      toast.success('Connection accepted!');
    } catch (error) {
      console.error('Failed to accept request:', error);
    }
  };

  const handleReject = async (connectionId: string) => {
    try {
      await rejectRequest.mutateAsync(connectionId);
      toast.success('Request declined');
    } catch (error) {
      console.error('Failed to reject request:', error);
    }
  };

  const handleConnect = async (userId: string) => {
    try {
      await sendRequest.mutateAsync(userId);
      toast.success('Connection request sent!');
    } catch (error) {
      console.error('Failed to send request:', error);
      toast.error('Failed to send connection request');
    }
  };

  const handleDisconnect = async (connectionId: string) => {
    if (!confirm('Are you sure you want to disconnect?')) return;
    try {
      await removeConnection.mutateAsync(connectionId);
      toast.success('Disconnected successfully');
    } catch (error) {
      console.error('Failed to remove connection:', error);
      toast.error('Failed to disconnect');
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">Connections</h1>
        <p className="page-subtitle">Manage your developer network</p>
      </div>

      {/* Search */}
      <div className="mb-8">
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">⬢</span>
          <input
            type="text"
            placeholder="Search developers by name or skills…"
            className="input-modern pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {searchQuery && searchResults && (
          <div className="mt-3 card-modern divide-y divide-border/30">
            {searchResults.data.map((u) => (
              <div key={u.id} className="p-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  {u.avatarUrl ? (
                    <img src={u.avatarUrl} alt="" className="h-9 w-9 rounded-full object-cover ring-2 ring-primary/20" />
                  ) : (
                    <div className="h-9 w-9 rounded-full gradient-primary flex items-center justify-center text-white text-xs font-bold">
                      {u.firstName[0]}{u.lastName[0]}
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-foreground text-sm">{u.firstName} {u.lastName}</h3>
                    <p className="text-xs text-muted-foreground">{u.email}</p>
                  </div>
                </div>
                {u.skills.length > 0 && (
                  <div className="hidden sm:flex gap-1.5 mx-4">
                    {u.skills.slice(0, 2).map((skill) => (
                      <span key={skill} className="tag-primary">{skill}</span>
                    ))}
                  </div>
                )}
                <button
                  onClick={() => handleConnect(u.id)}
                  className="btn-primary text-xs py-1.5 px-4"
                >
                  Connect
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pending Requests */}
      {!requestsLoading && pendingRequests && pendingRequests.length > 0 && (
        <div className="mb-8">
          <h2 className="section-title mb-4 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
            Pending Requests ({pendingRequests.length})
          </h2>
          <div className="card-modern divide-y divide-border/30">
            {pendingRequests.map((request) => (
              <div key={request.id} className="p-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full gradient-primary flex items-center justify-center text-white text-xs font-bold">
                    {request.sender.firstName[0]}{request.sender.lastName[0]}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-sm">
                      {request.sender.firstName} {request.sender.lastName}
                    </h3>
                    <p className="text-xs text-muted-foreground">wants to connect</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAccept(request.id)}
                    disabled={acceptRequest.isPending}
                    className="btn-primary text-xs py-1.5 px-4"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleReject(request.id)}
                    disabled={rejectRequest.isPending}
                    className="btn-danger text-xs py-1.5 px-4"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* My Connections */}
      <div>
        <h2 className="section-title mb-4">
          My Connections {connections && <span className="text-muted-foreground">({connections.length})</span>}
        </h2>
        
        {connectionsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card-modern p-5 animate-pulse space-y-3">
                <div className="flex gap-3">
                  <div className="h-11 w-11 rounded-full bg-muted" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-2/3 bg-muted rounded" />
                    <div className="h-3 w-1/3 bg-muted rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : connections?.length === 0 ? (
          <div className="card-modern p-12 text-center">
            <div className="text-4xl mb-4">⬢</div>
            <p className="text-foreground font-medium mb-2">No connections yet</p>
            <p className="text-sm text-muted-foreground">Use the search above to find developers to connect with!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {connections?.map((connection) => {
              const displayUser = connection.sender.id === user?.id
                ? connection.receiver
                : connection.sender;
              
              return (
                <div key={connection.id} className="card-modern p-5 flex flex-col justify-between">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-11 w-11 rounded-full gradient-primary flex items-center justify-center text-white font-semibold text-sm">
                      {displayUser.firstName[0]}{displayUser.lastName[0]}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-sm">
                        {displayUser.firstName} {displayUser.lastName}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Connected {new Date(connection.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDisconnect(connection.id)}
                    disabled={removeConnection.isPending}
                    className="btn-danger text-xs py-1.5 w-full"
                  >
                    {removeConnection.isPending ? 'Disconnecting…' : 'Disconnect'}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
