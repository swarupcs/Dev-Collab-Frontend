import { useNavigate } from 'react-router-dom';
import { useConnections, usePendingRequests, useAcceptConnectionRequest, useRejectConnectionRequest } from '@/hooks/useConnections';
import { useSearchUsers } from '@/hooks/useUser';
import { useSendConnectionRequest } from '@/hooks/useConnections';
import { useState } from 'react';

export default function ConnectionsPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  
  const { data: connections, isLoading: connectionsLoading } = useConnections();
  const { data: pendingRequests, isLoading: requestsLoading } = usePendingRequests();
  const { data: searchResults } = useSearchUsers({ query: searchQuery });
  
  const acceptRequest = useAcceptConnectionRequest();
  const rejectRequest = useRejectConnectionRequest();
  const sendRequest = useSendConnectionRequest();

  const handleAccept = async (connectionId: string) => {
    try {
      await acceptRequest.mutateAsync(connectionId);
    } catch (error) {
      console.error('Failed to accept request:', error);
    }
  };

  const handleReject = async (connectionId: string) => {
    try {
      await rejectRequest.mutateAsync(connectionId);
    } catch (error) {
      console.error('Failed to reject request:', error);
    }
  };

  const handleConnect = async (userId: string) => {
    try {
      await sendRequest.mutateAsync(userId);
    } catch (error) {
      console.error('Failed to send request:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Connections</h1>
            <button
              onClick={() => navigate('/dashboard')}
              className="text-indigo-600 hover:text-indigo-700"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Find Developers</h2>
          <input
            type="text"
            placeholder="Search by name or skills..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          
          {searchQuery && searchResults && (
            <div className="mt-4 bg-white rounded-lg shadow divide-y">
              {searchResults.data.map((user) => (
                <div key={user.id} className="p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {user.firstName} {user.lastName}
                    </h3>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    {user.skills.length > 0 && (
                      <div className="flex gap-2 mt-2">
                        {user.skills.slice(0, 3).map((skill) => (
                          <span key={skill} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => handleConnect(user.id)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
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
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Pending Requests ({pendingRequests.length})
            </h2>
            <div className="bg-white rounded-lg shadow divide-y">
              {pendingRequests.map((request) => (
                <div key={request.id} className="p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {request.sender.firstName} {request.sender.lastName}
                    </h3>
                    <p className="text-sm text-gray-600">wants to connect with you</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAccept(request.id)}
                      disabled={acceptRequest.isPending}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleReject(request.id)}
                      disabled={rejectRequest.isPending}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* My Connections */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            My Connections {connections && `(${connections.length})`}
          </h2>
          
          {connectionsLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading connections...</p>
            </div>
          ) : connections?.length === 0 ? (
            <div className="bg-white p-12 rounded-lg shadow text-center">
              <p className="text-gray-600 mb-4">
                You don't have any connections yet.
              </p>
              <p className="text-sm text-gray-500">
                Use the search above to find developers to connect with!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {connections?.map((connection) => {
                // Determine the other user (not the current logged-in user)
                // Since we don't have userId in this component, we'll show both users
                // Or you can pass userId from useAppSelector if needed
                const displayUser = connection.sender;
                
                return (
                  <div key={connection.id} className="bg-white p-6 rounded-lg shadow">
                    <h3 className="font-semibold text-gray-900 text-lg">
                      {displayUser.firstName} {displayUser.lastName}
                    </h3>
                    <p className="text-sm text-gray-600 mt-2">
                      Connected on {new Date(connection.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
