import { type FC, type ReactNode } from "react";
import { FaWhatsapp, FaPaperPlane, FaReply, FaThLarge } from "react-icons/fa";

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  color: string;
}

const StatCard: FC<StatCardProps> = ({ icon, label, value, color }) => (
  <div className={`flex items-center gap-4 p-4 rounded-xl text-white ${color}`}>
    <div className="text-3xl">{icon}</div>
    <div>
      <p className="text-lg font-bold">{value}</p>
      <p className="text-sm opacity-80">{label}</p>
    </div>
  </div>
);

const Dashboard: FC = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-60 bg-white shadow-lg flex flex-col">
        <div className="p-4 text-xl font-bold border-b">Goyral</div>
        <nav className="flex-1 p-4">
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-center gap-2 cursor-pointer hover:text-blue-600">
              📊 Dashboard
            </li>
            <li className="flex items-center gap-2 cursor-pointer hover:text-blue-600">
              📱 Device
            </li>
            <li className="flex items-center gap-2 cursor-pointer hover:text-blue-600">
              🔄 Auto Reply
            </li>
            <li className="flex items-center gap-2 cursor-pointer hover:text-blue-600">
              📑 Templates
            </li>
            <li className="flex items-center gap-2 cursor-pointer hover:text-blue-600">
              ✉️ Send Message
            </li>
            <li className="flex items-center gap-2 cursor-pointer hover:text-blue-600">
              💬 Messages
            </li>
            <li className="flex items-center gap-2 cursor-pointer hover:text-blue-600">
              📄 API Documentation
            </li>
            <li className="flex items-center gap-2 cursor-pointer hover:text-blue-600">
              📝 Feedback
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="flex justify-between items-center p-4 bg-white shadow-sm">
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <div className="w-10 h-10 bg-gray-300 rounded-full" />
        </header>

        {/* Stats Section */}
        <section className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={<FaWhatsapp />}
            label="Whatsapp Instance"
            value="1"
            color="bg-green-500"
          />
          <StatCard
            icon={<FaPaperPlane />}
            label="Messages Sent"
            value="2"
            color="bg-blue-900"
          />
          <StatCard
            icon={<FaReply />}
            label="Auto Reply"
            value="0"
            color="bg-sky-500"
          />
          <StatCard
            icon={<FaThLarge />}
            label="Templates"
            value="0"
            color="bg-purple-500"
          />
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
