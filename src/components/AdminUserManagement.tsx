import { useState } from "react";
import { useAdminUsers, useBlockUser, useUnblockUser, useUserDetails } from "@/hooks/admin/useAdminUsers";
import { useDebounce } from "@/hooks/useDebounce";
import { Button } from "@/components/User/button";
import { Input } from "@/components/User/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/User/card";
import { Eye, Ban, CheckCircle, Search } from "lucide-react";

export function AdminUserManagement() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const debouncedSearch = useDebounce(search, 400);

  const { data, isLoading, error } = useAdminUsers({
    page,
    limit,
    search: debouncedSearch || undefined,
  });

  const { data: userDetails } = useUserDetails(selectedUserId);
  const blockUser = useBlockUser();
  const unblockUser = useUnblockUser();

  const handleBlock = async (userId: string) => {
    await blockUser.mutateAsync(userId);
  };

  const handleUnblock = async (userId: string) => {
    await unblockUser.mutateAsync(userId);
  };

  const handleViewDetails = (userId: string) => {
    setSelectedUserId(userId);
  };

  const handleCloseDetails = () => {
    setSelectedUserId(null);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] p-6">
      <div className="max-w-7xl mx-auto">
        <Card className="bg-white/80 backdrop-blur-sm border-cream-200 shadow-lg">
          <CardHeader className="border-b border-cream-200">
            <CardTitle className="text-2xl font-bold text-gray-800">
              User Management
            </CardTitle>
          </CardHeader>

          <CardContent className="p-6">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search by name, email, or phone..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1); // Reset to first page on new search
                  }}
                  className="pl-10 bg-cream-50 border-cream-300 focus:border-cream-500"
                />
              </div>
            </div>

            {/* User Details Modal */}
            {selectedUserId && userDetails && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <Card className="bg-white max-w-2xl w-full">
                  <CardHeader className="flex justify-between items-center">
                    <CardTitle>User Details</CardTitle>
                    <Button
                      variant="ghost"
                      onClick={handleCloseDetails}
                      className="h-8 w-8 p-0"
                    >
                      ×
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Name</p>
                        <p className="font-semibold">
                          {userDetails.firstName} {userDetails.lastName}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-semibold">{userDetails.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-semibold">{userDetails.phone || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Role</p>
                        <p className="font-semibold">{userDetails.role}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Status</p>
                        <p
                          className={`font-semibold ${
                            userDetails.isBlocked ? "text-red-600" : "text-green-600"
                          }`}
                        >
                          {userDetails.isBlocked ? "Blocked" : "Active"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="text-center py-12">
                <p className="text-gray-500">Loading users...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-12">
                <p className="text-red-500">
                  {(error as { message?: string })?.message || "Failed to load users"}
                </p>
              </div>
            )}

            {/* Users Table */}
            {data && !isLoading && (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-cream-100 border-b border-cream-200">
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                          Name
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                          Email
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                          Phone
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.users.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                            No users found
                          </td>
                        </tr>
                      ) : (
                        data.users.map((user) => (
                          <tr
                            key={user.id}
                            className="border-b border-cream-100 hover:bg-cream-50 transition-colors"
                          >
                            <td className="px-4 py-3 text-sm text-gray-800">
                              {user.firstName} {user.lastName}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-700">{user.email}</td>
                            <td className="px-4 py-3 text-sm text-gray-700">
                              {user.phone || "N/A"}
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  user.isBlocked
                                    ? "bg-red-100 text-red-800"
                                    : "bg-green-100 text-green-800"
                                }`}
                              >
                                {user.isBlocked ? "Blocked" : "Active"}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleViewDetails(user.id)}
                                  className="h-8"
                                >
                                  <Eye className="w-4 h-4 mr-1" />
                                  View
                                </Button>
                                {user.isBlocked ? (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleUnblock(user.id)}
                                    disabled={unblockUser.isPending}
                                    className="h-8 text-green-600 hover:text-green-700"
                                  >
                                    <CheckCircle className="w-4 h-4 mr-1" />
                                    Unblock
                                  </Button>
                                ) : (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleBlock(user.id)}
                                    disabled={blockUser.isPending}
                                    className="h-8 text-red-600 hover:text-red-700"
                                  >
                                    <Ban className="w-4 h-4 mr-1" />
                                    Block
                                  </Button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {data.totalPages > 1 && (
                  <div className="mt-6 flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      Showing {(page - 1) * limit + 1} to{" "}
                      {Math.min(page * limit, data.total)} of {data.total} users
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                      >
                        Previous
                      </Button>
                      <div className="flex items-center gap-2">
                        {Array.from({ length: data.totalPages }, (_, i) => i + 1)
                          .filter(
                            (p) =>
                              p === 1 ||
                              p === data.totalPages ||
                              (p >= page - 1 && p <= page + 1)
                          )
                          .map((p, idx, arr) => (
                            <div key={p} className="flex items-center gap-1">
                              {idx > 0 && arr[idx - 1] !== p - 1 && (
                                <span className="px-2">...</span>
                              )}
                              <Button
                                variant={page === p ? "default" : "outline"}
                                size="sm"
                                onClick={() => setPage(p)}
                                className="min-w-[40px]"
                              >
                                {p}
                              </Button>
                            </div>
                          ))}
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                        disabled={page === data.totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

