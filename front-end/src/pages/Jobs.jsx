import React, { useEffect, useMemo, useRef, useState } from "react";
import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
import { useApp } from "../context/AppContext";
import { BASE_URL } from "../constants/urls";
import { useAuth } from "../context/AuthContext";

export default function Jobs() {
  const { jobs } = useApp();
  const { user } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const listRef = useRef(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filePreview, setFilePreview] = useState(null);

  // Filter contacts by search
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return jobs;
    return jobs.filter((c) =>
      [c.name, c.phone_number].some((v) => String(v).toLowerCase().includes(q))
    );
  }, [search, jobs]);

  // Fetch messages when selected contact changes
  useEffect(() => {
    if (!selected) return;
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        if (selected?.conversation_id) {
          const res = await fetch(
            `${BASE_URL}/messages/${selected.conversation_id}`
          );
          if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
          const data = await res.json();
          if (!cancelled) setMessages(Array.isArray(data) ? data : []);
          // scroll to bottom
          // requestAnimationFrame(() => {
          //   listRef.current?.lastElementChild?.scrollIntoView({
          //     behavior: "auto",
          //   });
          // });
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();

    const t = setInterval(load, 5000);
    return () => {
      cancelled = true;
      clearInterval(t);
    };
  }, [selected]);

  // Send message
  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    const formData = new FormData();
    formData.append("user_id", user.user_id);
    formData.append("phone", selected.phone_number);
    formData.append("message", text);
    formData.append("file", file);

    setSending(true);
    try {
      const res = await fetch(`${BASE_URL}/send-message`, {
        method: "POST",
        body: formData,
      });
      const result = await res.json();
      console.log("API SEND RESULT", result);
      setText("");
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  function onKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  }

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);

    if (selectedFile.type.startsWith("image/")) {
      setFilePreview(URL.createObjectURL(selectedFile));
    } else {
      setFilePreview(selectedFile.name);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main content */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/* Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <div
          className=" bg-neutral-100 text-neutral-900"
          style={{ height: "calc(100vh - 64px)" }}
        >
          <div className="flex h-full  md:p-10 gap-2 md:gap-5">
            {/* LEFT: Contacts */}
            <aside
              className={`border-r border-neutral-200 bg-white flex-col rounded-lg shadow-sm
                w-full md:w-1/3 lg:w-1/4
                ${selected ? "hidden md:flex" : "flex"}
              `}
            >
              <div className="p-4">
                <h1 className="text-2xl font-bold">Chats</h1>
                <div className="mt-3">
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search name or number"
                    className="w-full rounded-xl border border-neutral-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-300"
                  />
                </div>
              </div>
              <div className="overflow-y-auto px-2 pb-2 flex-1">
                {filtered.map((c) => (
                  <button
                    key={c.conversation_id}
                    onClick={() => setSelected(c)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl mb-2 transition shadow-sm hover:shadow ${
                      selected?.conversation_id === c.conversation_id
                        ? "bg-neutral-100 border border-neutral-200"
                        : "bg-white border border-transparent"
                    }`}
                  >
                    <div className="text-left">
                      <div className="text-sm font-medium">
                        {c.name || c.phone_number}
                      </div>
                      <div className="text-xs text-neutral-500 leading-tight">
                        {c.phone_number}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </aside>

            {/* RIGHT: Chat */}
            <main
              className={`flex-col h-full bg-white flex-grow rounded-lg shadow-sm
                ${!selected ? "hidden md:flex" : "flex"}
              `}
            >
              {selected ? (
                <>
                  {/* Chat Header */}
                  <div className="flex items-center gap-3 p-4 border-b border-neutral-200 bg-white">
                    {/* Back button (mobile only) */}
                    <button
                      onClick={() => setSelected(null)}
                      className="md:hidden text-neutral-600 mr-2"
                    >
                      ←
                    </button>
                    <Avatar name={selected?.name || "#"} />
                    <div>
                      <div className="font-semibold">
                        {selected?.name || selected?.phone_number}
                      </div>
                      <div className="text-xs text-neutral-500">
                        {selected?.phone_number}
                      </div>
                    </div>
                    <div className="ml-auto text-xs text-neutral-500">
                      {loading ? "Syncing…" : "Synced"}
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 bg-[url('https://upload.wikimedia.org/wikipedia/commons/4/44/Whatsapp_background.png')] bg-cover">
                    <div ref={listRef} className=" mx-auto">
                      {!messages.length && (
                        <div className="text-center text-neutral-500 text-sm py-12">
                          No messages yet. Say hello 👋
                        </div>
                      )}
                      {messages.map((m) => (
                        <MessageBubble key={m.id} message={m} />
                      ))}
                    </div>
                  </div>

                  {/* Composer */}
                  <div className="p-3 border-t border-neutral-200 bg-white">
                    {/* File preview if selected */}
                    {filePreview && (
                      <div className="mb-2 p-2 border border-neutral-200 rounded-lg flex items-center gap-2 bg-neutral-50">
                        {filePreview.startsWith("blob:") ? (
                          <img
                            src={filePreview}
                            alt="Preview"
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        ) : (
                          <span className="text-sm text-neutral-700">
                            {filePreview}
                          </span>
                        )}
                        <button
                          onClick={() => setFilePreview(null)}
                          className="text-red-500 text-sm ml-auto"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                    <div className="mx-auto flex items-end gap-2">
                      {/* Textarea */}
                      <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={onKeyDown}
                        placeholder="Type a message"
                        rows={1}
                        className="flex-1 resize-none rounded-2xl border border-neutral-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-neutral-300"
                      />

                      {/* Attachment Button */}
                      <div className="relative">
                        <input
                          type="file"
                          id="file-upload"
                          className="hidden"
                          onChange={handleFileSelect} // define this function
                        />
                        <label
                          htmlFor="file-upload"
                          className="cursor-pointer flex items-center justify-center rounded-2xl px-4 py-3 border border-neutral-200 bg-neutral-100 hover:bg-neutral-200"
                        >
                          📎
                        </label>
                      </div>

                      {/* Send Button */}
                      <button
                        onClick={handleSend}
                        // disabled={sending || !text.trim()}
                        className="rounded-2xl px-4 py-3 border border-neutral-200 bg-neutral-900 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {sending ? "Sending…" : "Send"}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col h-full items-center justify-center text-center p-6">
                  <h1 className="text-2xl font-bold">No Conversations Yet</h1>
                  <p className="text-sm text-neutral-500 mt-2">
                    To start a conversation, select a contact or upload a CSV
                  </p>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ message }) {
  const isMine = message.sender_type === "agent";
  console.log(`https://steerstech.com/whatsapp-php/uploads/${message.content}`);
  return (
    <div
      className={`flex ${isMine ? "justify-end" : "justify-start"} mb-2 px-2`}
    >
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-2 shadow-sm border text-sm whitespace-pre-wrap ${
          isMine
            ? "bg-neutral-900 text-white border-neutral-900 rounded-br-sm"
            : "bg-white border-neutral-200 rounded-bl-sm"
        }`}
      >
        {message?.message_type?.trim().toLowerCase() === "image" ? (
          <img
            src={`https://steerstech.com/whatsapp-php/uploads/${message.content}`}
            alt="Uploaded"
            style={{ maxWidth: "200px", borderRadius: "8px" }}
          />
        ) : (
          <div>{message.content}</div>
        )}

        <div className="text-[10px] mt-1 opacity-70 text-right">
          {formatTime(message.sent_at)}
        </div>
      </div>
    </div>
  );
}

function Avatar({ name = "?" }) {
  const initials = (name || "?")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <div className="h-10 w-10 flex items-center justify-center rounded-full bg-neutral-900 text-white font-semibold">
      {initials}
    </div>
  );
}

function formatTime(iso) {
  try {
    const d = new Date(iso);
    const now = new Date();
    const sameDay =
      d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth() &&
      d.getDate() === now.getDate();
    return sameDay
      ? d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : d.toLocaleDateString();
  } catch {
    return "";
  }
}
