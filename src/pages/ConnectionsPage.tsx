import { useAppSelector } from '@/store/hooks';
import type { RootState } from '@/store';
import { useConnections, usePendingRequests, useAcceptConnectionRequest, useRejectConnectionRequest, useRemoveConnection } from '@/hooks/useConnections';
import { useSearchUsers } from '@/hooks/useUser';
import { useSendConnectionRequest } from '@/hooks/useConnections';
import { toast } from 'sonner';
import { useState } from 'react';
import { Users, UserPlus, Search, UserCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ConnectionsPage() {
  const user = useAppSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'my_connections' | 'requests' | 'find'>('my_connections');
  const [searchQuery, setSearchQuery] = useState('');
  
  const { data: connections, isLoading: connectionsLoading } = useConnections();
  const { data: pendingRequests, isLoading: requestsLoading } = usePendingRequests();
  const { data: searchResults, isLoading: searchLoading } = useSearchUsers({ query: searchQuery });
  
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
      toast.error('Failed to send connection request');
    }
  };

  const handleDisconnect = async (connectionId: string) => {
    if (!confirm('Are you sure you want to disconnect?')) return;
    try {
      await removeConnection.mutateAsync(connectionId);
      toast.success('Disconnected successfully');
    } catch (error) {
      toast.error('Failed to disconnect');
    }
  };

  const renderTabs = () => (
    <div className="flex overflow-x-auto gap-2 mb-8 pb-2 border-b border-border/50 hide-scrollbar">
      {[
        { id: 'my_connections', label: `My Connections (${connections?.length || 0})`, icon: UserCheck },
        { id: 'requests', label: `Requests (${pendingRequests?.length || 0})`, icon: UserPlus },
        { id: 'find', label: 'Find Developers', icon: Search },
      ].map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id as any)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
            activeTab === tab.id
              ? 'bg-primary/10 text-primary border border-primary/20'
              : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
          }`}
        >
          <tab.icon className="h-4 w-4" />
          {tab.label}
        </button>
      ))}
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="page-header mb-6">
        <h1 className="page-title">Network</h1>
        <p className="page-subtitle">Manage your connections and discover new developers.</p>
      </div>

      {renderTabs()}

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {/* My Connections Tab */}
        {activeTab === 'my_connections' && (
          <div>
            {connectionsLoading ? (
              <div className="flex justify-center py-12"><span className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" /></div>
            ) : connections && connections.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {connections.map((conn) => {
                  const connectedUser = conn.sender.id === user?.id ? conn.receiver : conn.sender;
                  return (
                    <div key={conn.id} className="card-modern p-5 group flex flex-col items-center text-center hover:shadow-card-hover transition-all">
                      <div className="h-16 w-16 mb-4 rounded-full gradient-primary flex items-center justify-center text-white text-xl font-bold">
                        {connectedUser.firstName[0]}{connectedUser.lastName[0]}
                      </div>
                      <h3 className="font-semibold text-foreground font-heading">
                        {connectedUser.firstName} {connectedUser.lastName}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-1 h-5">{connectedUser.headline || 'Developer'}</p>
                      
                      {connectedUser.skills && connectedUser.skills.length > 0 && (
                        <div className="flex flex-wrap justify-center gap-1 mt-3 mb-4 h-6">
                          {connectedUser.skills.slice(0, 2).map((skill: string) => (
                            <span key={skill} className="tag-primary text-[10px]">{skill}</span>
                          ))}
                        </div>
                      )}

                      <div className="w-full flex gap-2 mt-auto">
                        <button onClick={() => navigate('/chat')} className="flex-1 btn-primary text-xs py-2">Message</button>
                        <button onClick={() => handleDisconnect(conn.id)} disabled={removeConnection.isPending} className="flex-1 btn-secondary text-xs py-2">Remove</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center p-12 card-modern rounded-xl border-dashed">
                <Users className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-1">No connections yet</h3>
                <p className="text-muted-foreground text-sm mb-4">Start building your network to collaborate.</p>
                <button onClick={() => setActiveTab('find')} className="btn-primary px-6">Find Developers</button>
              </div>
            )}
          </div>
        )}

        {/* Requests Tab */}
        {activeTab === 'requests' && (
          <div>
            {requestsLoading ? (
              <div className="flex justify-center py-12"><span className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" /></div>
            ) : pendingRequests && pendingRequests.length > 0 ? (
              <div className="space-y-3">
                {pendingRequests.map((request) => (
                  <div key={request.id} className="card-modern p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full gradient-primary flex items-center justify-center text-white text-sm font-bold">
                        {request.sender.firstName[0]}{request.sender.lastName[0]}
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {request.sender.firstName} {request.sender.lastName}
                        </h3>
                        <p className="text-sm text-muted-foreground">{request.sender.headline || 'Developer'}</p>
                        <p className="text-xs text-muted-foreground mt-1">wants to connect with you</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleReject(request.id)} disabled={rejectRequest.isPending} className="btn-secondary px-6">Decline</button>
                      <button onClick={() => handleAccept(request.id)} disabled={acceptRequest.isPending} className="btn-primary px-6">Accept</button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-12 card-modern rounded-xl border-dashed border-border/50">
                <UserPlus className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                <p className="text-muted-foreground text-sm">You have no pending connection requests.</p>
              </div>
            )}
          </div>
        )}

        {/* Find Developers Tab */}
        {activeTab === 'find' && (
          <div>
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by name, skills, or role..."
                className="input-modern pl-11 py-3 text-base shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {searchLoading ? (
              <div className="flex justify-center py-12"><span className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" /></div>
            ) : searchQuery && searchResults && searchResults.data.length > 0 ? (
              <div className="space-y-3">
                {searchResults.data.map((u) => (
                  <div key={u.id} className="card-modern p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      {u.avatarUrl ? (
                        <img src={u.avatarUrl} alt="" className="h-12 w-12 rounded-full object-cover ring-2 ring-primary/20" />
                      ) : (
                        <div className="h-12 w-12 rounded-full gradient-primary flex items-center justify-center text-white text-sm font-bold">
                          {u.firstName[0]}{u.lastName[0]}
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold text-foreground">{u.firstName} {u.lastName}</h3>
                        <p className="text-sm text-muted-foreground">{u.headline || 'Developer'}</p>
                        {u.skills.length > 0 && (
                          <div className="flex gap-1.5 mt-2">
                            {u.skills.slice(0, 3).map((skill: string) => (
                              <span key={skill} className="tag-primary text-[10px]">{skill}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleConnect(u.id)}
                      className="btn-primary text-sm px-6 h-10 w-full sm:w-auto"
                    >
                      Connect
                    </button>
                  </div>
                ))}
              </div>
            ) : searchQuery && searchResults ? (
              <div className="text-center p-12 bg-muted/20 rounded-xl">
                <p className="text-muted-foreground">No developers found matching "{searchQuery}"</p>
              </div>
            ) : (
              <div className="text-center p-12 bg-muted/20 rounded-xl">
                <p className="text-muted-foreground">Type above to search for people by name or skill tags (e.g. "React").</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
