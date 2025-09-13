"use client";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2, ShieldCheck, UserPlus, Search, Filter, Loader2, AlertCircle, Edit, Save, X, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";

interface User {
  id: number;
  username: string;
  email: string;
  is_staff: boolean;
  is_superuser: boolean;
  date_joined?: string;
  last_login?: string;
}

const AssignAccess: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [adminDialogOpen, setAdminDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [userToModify, setUserToModify] = useState<User | null>(null);
  const [editingUser, setEditingUser] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({
    is_staff: false,
    is_superuser: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    is_staff: false,
    is_superuser: false,
  });
  const [formErrors, setFormErrors] = useState({
    username: "",
    email: "",
    password: "",
    is_staff: false,
    is_superuser: false,
  });

  // Fetch users
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<User[]>("/adminpanel/list-users/");
      setUsers(res.data);
      setFilteredUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to load users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users based on search query and role filter
  useEffect(() => {
    let result = users;

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(user =>
        user.username.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
      );
    }

    // Apply role filter
    if (roleFilter !== "all") {
      if (roleFilter === "superadmin") {
        result = result.filter(user => user.is_superuser);
      } else if (roleFilter === "admin") {
        result = result.filter(user => user.is_staff && !user.is_superuser);
      } else if (roleFilter === "user") {
        result = result.filter(user => !user.is_staff && !user.is_superuser);
      }
    }

    setFilteredUsers(result);
  }, [searchQuery, roleFilter, users]);

  // Handle form input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // Clear error when user types
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors({ ...formErrors, [name]: "" });
    }
  };

  // Handle edit form input
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Validate form
  const validateForm = () => {
    let valid = true;
    const newErrors = { username: "", email: "", password: "", is_staff: false, is_superuser: false };

    if (!form.username.trim()) {
      newErrors.username = "Username is required";
      valid = false;
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Email is invalid";
      valid = false;
    }

    if (!form.password) {
      newErrors.password = "Password is required";
      valid = false;
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      valid = false;
    }

    setFormErrors(newErrors);
    return valid;
  };

  // Create Admin
  const handleCreateAdmin = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError(null);
    try {
      await api.post("/adminpanel/create-admin/", form);
      setSuccess("Admin created successfully");
      setForm({ username: "", email: "", password: "", is_staff: false, is_superuser: false });
      fetchUsers();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || "Failed to create admin";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Start editing a user
  const startEditing = (user: User) => {
    setEditingUser(user.id);
    setEditForm({
      is_staff: user.is_staff,
      is_superuser: user.is_superuser,
    });
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingUser(null);
    setEditForm({
      is_staff: false,
      is_superuser: false,
    });
  };

  // Save edited user
  const saveEditedUser = async (userId: number) => {
    setLoading(true);
    setError(null);
    try {
      await api.patch(`/adminpanel/update-user/${userId}/`, editForm);
      setSuccess("User updated successfully");
      setEditingUser(null);
      fetchUsers();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (error: any) {
      console.error("Error updating user:", error);
      setError(error.response?.data?.error || "Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  // Toggle Admin Access
  const handleToggleAdmin = async (user: User) => {
    setUserToModify(user);
    setAdminDialogOpen(true);
  };

  const confirmToggleAdmin = async () => {
    if (!userToModify) return;

    setLoading(true);
    setError(null);
    try {
      await api.patch(`/adminpanel/update-user/${userToModify.id}/`, {
        is_staff: !userToModify.is_staff,
        is_superuser: userToModify.is_superuser,
      });
      setSuccess(`User ${!userToModify.is_staff ? 'promoted to admin' : 'demoted to regular user'} successfully`);
      fetchUsers();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error("Error updating user:", error);
      setError("Failed to update user. Please try again.");
    } finally {
      setLoading(false);
      setAdminDialogOpen(false);
      setUserToModify(null);
    }
  };

  // Delete User
  const handleDeleteUser = async (user: User) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;

    setLoading(true);
    setError(null);
    try {
      await api.delete(`/adminpanel/delete-user/${userToDelete.id}/`);
      setSuccess("User deleted successfully");
      setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error("Error deleting user:", error);
      setError("Failed to delete user. Please try again.");
    } finally {
      setLoading(false);
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  const getUserRole = (user: User) => {
    if (user.is_superuser) return "Superadmin";
    if (user.is_staff) return "Admin";
    return "User";
  };

  const getRoleVariant = (user: User) => {
    if (user.is_superuser) return "destructive";
    if (user.is_staff) return "default";
    return "outline";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">Super Admin – Manage user roles and permissions</p>
        </div>
        <Button onClick={fetchUsers} variant="outline" className="flex items-center gap-2">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          Refresh
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert variant="default" className="bg-green-800 text-green-50 border-green-200">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Create New Admin</CardTitle>
          <CardDescription>Add a new administrator to the system</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Username"
                className={formErrors.username ? "border-red-500" : ""}
              />
              {formErrors.username && <p className="text-red-500 text-xs">{formErrors.username}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                className={formErrors.email ? "border-red-500" : ""}
              />
              {formErrors.email && <p className="text-red-500 text-xs">{formErrors.email}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Password"
                className={formErrors.password ? "border-red-500" : ""}
              />

              {formErrors.password && <p className="text-red-500 text-xs">{formErrors.password}</p>}
            </div>

            <div className="flex flex-row gap-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`staff`}
                  name="is_staff"
                  checked={form.is_staff}
                  onChange={handleChange}
                  className="h-4 w-4"
                />
                <Label htmlFor={`staff`} className="text-sm">Staff</Label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`superuser`}
                  name="is_superuser"
                  checked={form.is_superuser}
                  onChange={handleChange}
                  className="h-4 w-4"
                />
                <Label htmlFor={`superuser`} className="text-sm">Superadmin</Label>
              </div>
            </div>

            </div>
            <Button onClick={handleCreateAdmin} disabled={loading} className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Create Admin
            </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>User Management</CardTitle>
            <CardDescription>
              {filteredUsers.length} {filteredUsers.length === 1 ? 'user' : 'users'} found
            </CardDescription>
          </div>
          <div className="flex flex-col gap-2 md:flex-row">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                className="pl-8 w-full md:w-[200px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full md:w-[140px]">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <SelectValue placeholder="Filter by role" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="superadmin">Superadmin</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      {user.username}
                    </TableCell>
                    <TableCell>
                      {user.email}
                    </TableCell>
                    <TableCell>
                      {editingUser === user.id ? (
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id={`staff-${user.id}`}
                              name="is_staff"
                              checked={editForm.is_staff}
                              onChange={handleEditChange}
                              className="h-4 w-4"
                            />
                            <Label htmlFor={`staff-${user.id}`} className="text-sm">Staff</Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id={`superuser-${user.id}`}
                              name="is_superuser"
                              checked={editForm.is_superuser}
                              onChange={handleEditChange}
                              className="h-4 w-4"
                            />
                            <Label htmlFor={`superuser-${user.id}`} className="text-sm">Superadmin</Label>
                          </div>
                        </div>
                      ) : (
                        <Badge variant={getRoleVariant(user)}>
                          {getUserRole(user)}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {user.date_joined ? new Date(user.date_joined).toLocaleDateString() : 'N/A'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {editingUser === user.id ? (
                          <>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="default"
                                    onClick={() => saveEditedUser(user.id)}
                                    className="flex items-center gap-1"
                                    disabled={loading}
                                  >
                                    <Save className="h-4 w-4" /> Save
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Save changes</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={cancelEditing}
                                    className="flex items-center gap-1"
                                  >
                                    <X className="h-4 w-4" /> Cancel
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Cancel editing</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </>
                        ) : (
                          <>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => startEditing(user)}
                                    className="flex items-center gap-1"
                                  >
                                    <Edit className="h-4 w-4" /> Edit
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Edit user details</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            {!user.is_superuser && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleToggleAdmin(user)}
                                      className="flex items-center gap-1"
                                      disabled={loading}
                                    >
                                      <ShieldCheck className="h-4 w-4" />
                                      {user.is_staff ? "Revoke" : "Make Admin"}
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>{user.is_staff ? "Revoke admin privileges" : "Grant admin privileges"}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                            {!user.is_superuser && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      onClick={() => handleDeleteUser(user)}
                                      className="flex items-center gap-1"
                                      disabled={loading}
                                    >
                                      <Trash2 className="h-4 w-4" /> Delete
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Permanently delete this user</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredUsers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                      {searchQuery || roleFilter !== "all"
                        ? "No users match your filters."
                        : "No users found."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This will permanently delete user <strong>{userToDelete?.username}</strong>.
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button variant="destructive" onClick={confirmDeleteUser} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Admin Toggle Confirmation Dialog */}
      <Dialog open={adminDialogOpen} onOpenChange={setAdminDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Role Change</DialogTitle>
            <DialogDescription>
              {userToModify?.is_staff
                ? `Are you sure you want to revoke admin privileges from ${userToModify?.username}?`
                : `Are you sure you want to grant admin privileges to ${userToModify?.username}?`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={confirmToggleAdmin} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AssignAccess;