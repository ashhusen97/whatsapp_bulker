import React, { useState, useEffect } from "react";
import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
import { useApp } from "../context/AppContext";
import io from "socket.io-client";

const socket = io("http://localhost:3000"); // ✅ adjust if backend runs elsewhere

function Chat() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { jobs } = useApp();

  const [qrCode, setQrCode] = useState(null);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);

  // ✅ Listen for QR + Connection status
  useEffect(() => {
    console.log("calling UseEffect");
    socket.on("qr", (qr) => {
      console.log("qr", qr);
      setQrCode(qr);
      setConnected(false);
    });

    socket.on("ready", (msg) => {
      console.log("Message", msg);
      setConnected(true);
      setQrCode(null);
    });

    socket.on("disconnected", () => {
      setConnected(false);
      setQrCode(null);
    });

    // 👇 Ask for status immediately after connecting
    socket.emit("getStatus");
    socket.on("ready", (msg) => {
      setConnected(true);
      setQrCode(null);
    });

    socket.on("disconnected", () => {
      setConnected(false);
      setQrCode(null);
    });

    // 👇 Ask for status immediately after connecting
    socket.on("message", (message) => {
      console.log("message from react", message);
      // setConnected(false);
      // setQrCode(null); // clear QR when disconnected
    });

    return () => {
      socket.off("qr");
      socket.off("ready");
      socket.off("disconnected");
      socket.off("message");
    };
  }, []);

  // ✅ Fetch chats when connected

  useEffect(() => {
    fetch("http://localhost:3000/status")
      .then((res) => res.json())
      .then((data) => {
        console.log("Stqtus data", data);
        if (data.qrCodeData && !data.isConnected) {
          setQrCode(data.qrCodeData);
        }
        if (data.isConnected) {
          setStatus("Connected");
        }
      });
  }, []);
  console.log("connected", connected);
  useEffect(() => {
    let interval;
    const fetchChats = async () => {
      try {
        console.log("Called FetchChats");
        const res = await fetch("http://localhost:3000/get-chats");
        if (!res.ok) throw new Error("Not connected");
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        console.error("Error fetching chats:", err.message);
        clearInterval(interval); // stop polling if disconnected
        setConnected(false); // update UI to show "disconnected"
      }
    };

    if (connected) {
      console.log("is connected", connected);
      fetchChats();
      interval = setInterval(fetchChats, 10000); // refresh every 10s
    }

    return () => clearInterval(interval);
  }, [connected]);
  const logout = async () => {
    try {
      await fetch("http://localhost:3000/logout", {
        method: "POST",
      });
      setConnected(false);
      setQrCode(null);
    } catch (err) {
      console.error("Logout failed:", err);
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

        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            {/* Page Header */}
            <div className="sm:flex sm:justify-between sm:items-center mb-8">
              <div className="mb-4 sm:mb-0">
                <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
                  Connect WhatsApp
                </h1>
              </div>
            </div>

            {/* ✅ Connection Status / QR Section */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8 text-center">
              {!connected && qrCode && (
                <>
                  <img
                    src={qrCode}
                    alt="WhatsApp QR Code"
                    className="mx-auto w-64 h-64"
                  />
                  <p className="mt-4 text-gray-600 dark:text-gray-300">
                    Scan this QR code with your WhatsApp app to connect.
                  </p>
                </>
              )}
              {connected && (
                <>
                  <h2 className="text-green-600 font-bold text-xl">
                    ✅ WhatsApp Connected
                  </h2>
                  <button onClick={logout}>Logout</button>
                </>
              )}
            </div>

            {/* ✅ Chats */}
            {connected && (
              <div className="border rounded p-4 h-96 overflow-y-scroll bg-gray-50 dark:bg-gray-900">
                {messages.length ? (
                  messages.map((msg, i) => (
                    <div key={i} className="mb-2">
                      <span className="font-semibold">{msg.name}: </span>
                      <span>{msg.lastMessage?.body}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No chats yet.</p>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Chat;
