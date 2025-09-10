import React, { useRef, useState } from "react";
import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
import { BASE_URL } from "../constants/urls";
import { useApp } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";

function Settings() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [token, setToken] = useState("Barry@01");

  const handleTokenChange = (e) => {
    setToken(e.target.value);
  };

  async function updateWhatsAppToken() {
    const res = await fetch(`${BASE_URL}/update-token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `token=${encodeURIComponent(token)}`,
    });

    const data = await res.json();
    console.log("Update Response", data);
  }
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow">
          <div className="h-full bg-gray-50  items-center justify-center p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-6xl">
              {/* Account Settings */}
              <div className="bg-white shadow rounded-xl p-6">
                <h2 className="text-xl font-bold mb-4">Account Setting</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block font-medium">Token</label>
                    <input
                      type="email"
                      value={token}
                      className="w-full border rounded-md p-2"
                      onChange={handleTokenChange}
                    />
                  </div>

                  <div className="flex gap-4">
                    <button
                      className="bg-blue-600 text-white px-4 py-2 rounded-md"
                      onClick={() => updateWhatsAppToken()}
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>

              {/* Social Media */}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Settings;
