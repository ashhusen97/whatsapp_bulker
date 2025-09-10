import React, { useEffect, useMemo, useRef, useState } from "react";
import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
import { BASE_URL } from "../constants/urls";
import DataTable from "react-data-table-component";
export default function Users() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const columns = [
    {
      name: "Name",
      selector: (row) => row.name,
    },
    {
      name: "Email",
      selector: (row) => row.email,
    },
    // {
    //   name: "Action",
    //   cell: (row) => (
    //     <div className="flex flex-row items-center justify-start space-x-2 w-auto bg-amber-100">
    //       <button
    //         onClick={() => console.log("View", row)}
    //         className="px-2 py-1 text-xs rounded bg-blue-500 text-white hover:bg-blue-600"
    //       >
    //         View
    //       </button>
    //       <button
    //         onClick={() => console.log("Edit", row)}
    //         className="px-2 py-1 text-xs rounded bg-green-500 text-white hover:bg-green-600"
    //       >
    //         Edit
    //       </button>
    //     </div>
    //   ),
    //   ignoreRowClick: true,
    //   allowOverflow: true,
    //   button: true,
    // },
  ];

  const filteredCustomers = users.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );
  useEffect(() => {
    let cancelled = false;
    async function getUsers() {
      setLoading(true);
      try {
        const res = await fetch(`${BASE_URL}/get-users`);
        if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
        const data = await res.json();
        if (!cancelled) setUsers(Array.isArray(data) ? data : []);
        // scroll to bottom
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    getUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${BASE_URL}/create-user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add user");
      }

      alert("✅ User added successfully!");
      setIsOpen(false);
      setName("");
      setEmail("");
      setPassword("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/* Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="h-screen  bg-neutral-100 text-neutral-900 ">
          <div className="p-6 bg-gray-50 min-h-screen">
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 mb-4">
              <h1 className="text-2xl font-semibold">Users</h1>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 mb-4">
                {/* Search */}
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search Customer"
                    className="w-full sm:w-64 rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Add Customer */}
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  onClick={() => setIsOpen(true)}
                >
                  + Add Users
                </button>
              </div>
            </div>

            {/* Card */}
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-medium mb-4">Users List</h2>

              <DataTable
                columns={columns}
                data={filteredCustomers}
                selectableRows
                pagination
              />
            </div>
          </div>
        </div>
      </div>
      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Add New User</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Error Message */}
              {error && (
                <p className="text-red-600 text-sm bg-red-50 p-2 rounded">
                  {error}
                </p>
              )}

              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter name"
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email"
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                  required
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3 mt-4">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
