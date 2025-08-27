import React, { useState } from "react";
import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
import { BASE_URL } from "../constants/urls";
import { useApp } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";

function BulkMessager() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [templates, setTemplates] = useState([
    {
      name: "introduction_hamza",
      parameter_format: "POSITIONAL",
      components: [
        {
          type: "BODY",
          text: "Hello, Good Day\nHope you're doing great\n\nThis is Hamza, Sales Agent and auction specialist from Beforward.jp\nI am here to offer you best Japanese cars in much discounted prices.\n\n▪️Extra discounts which only an agent can provide.\n▪️Assistance with the vehicle's condition.\n▪️Shipping on 50% Deposit.\n▪️24/7 availability for any type of query by your side.\n▪️The agent can extend the reservation period which will help you not to lose the vehicle.\n\nAbout payment method, we have several payment methods which are also very easy.\n▪️Pay Via Wire Transfer.\n▪️Pay via PayPal with 0% Transaction Fees.\n▪️Pay via Debit/Credit Card.\n\nPlease do not hesitate to email or call if you have any queries. My details are mentioned below.\nThanks & Regards,\nHamza Baig\nEmail: hamzabeforward.jp@gmail.com\nInstagram: https://www.instagram.com/hamzabeforward.jp/\nSenior Sales Agent",
        },
      ],
      language: "en",
      status: "APPROVED",
      category: "MARKETING",
      sub_category: "CUSTOM",
      id: "2555806784770714",
    },
    {
      name: "promotional",
      parameter_format: "POSITIONAL",
      components: [
        {
          type: "HEADER",
          format: "IMAGE",
          example: {
            header_handle: [
              "https://scontent.whatsapp.net/v/t61.29466-34/518984522_713459708315431_4725083695305926613_n.png?ccb=1-7&_nc_sid=8b1bef&_nc_ohc=wORkFbyt7joQ7kNvwFh7JjQ&_nc_oc=AdlzWOxh-z5C0WAdUtIRliLgn5du-7dm647D9L84QCq5E0t47GLCAB873fgtPaHn66Y&_nc_zt=3&_nc_ht=scontent.whatsapp.net&edm=AH51TzQEAAAA&_nc_gid=OD9siMnZj16GwRa1ACE8OA&oh=01_Q5Aa2QFGmNlQrbTvSgu0WjnWYQlRYwyv6B55rJAxAg-qndTKtw&oe=68D40144",
            ],
          },
        },
        {
          type: "BODY",
          text: "2019 HONDA GRACE HYBRID DX\nAuction Grade 4\n\nMileage:  115,162 km\nModel Code:  DAA-GM4\nEngine Size:  1,490cc\nFuel:  Hybrid(Petrol)\nDrive:  2wheel drive\nTransmission:  Automatic\nExtra Features:  Rear Spoiler, Cruise Control, Push Start\n\nBest Price USD 7,451 C&F Inspect to KINGSTON",
        },
        {
          type: "FOOTER",
          text: "Hamza",
        },
      ],
      language: "en",
      status: "APPROVED",
      category: "MARKETING",
      sub_category: "CUSTOM",
      id: "713459701648765",
    },
    {
      name: "introduction",
      parameter_format: "POSITIONAL",
      components: [
        {
          type: "HEADER",
          format: "TEXT",
          text: "Introductional message",
        },
        {
          type: "BODY",
          text: "Hello, Good Day\nHope you're doing great\n\nThis is Hamza, Sales Agent and auction specialist from Steerstech(beforward)\nI am here to offer you best Japanese cars in much discounted prices.\n\n▪️Extra discounts which only an agent can provide.\n▪️Assistance with the vehicle's condition.\n▪️Shipping on 50% Deposit.\n▪️24/7 availability for any type of query by your side.\n▪️The agent can extend the reservation period which will help you not to lose the vehicle.\n\nAbout payment method, we have several payment methods which are also very easy.\n▪️Pay Via Wire Transfer.\n▪️Pay via PayPal with 0% Transaction Fees.\n▪️Pay via Debit/Credit Card.\n\nPlease do not hesitate to call if you have any queries. My details are mentioned below.\nThanks & Regards,\nHamza Baig",
        },
      ],
      language: "en",
      status: "APPROVED",
      category: "MARKETING",
      sub_category: "CUSTOM",
      id: "1308291924251600",
    },
    {
      name: "hello_world",
      parameter_format: "POSITIONAL",
      components: [
        {
          type: "HEADER",
          format: "TEXT",
          text: "Hello World",
        },
        {
          type: "BODY",
          text: "Welcome and congratulations!! This message demonstrates your ability to send a WhatsApp message notification from the Cloud API, hosted by Meta. Thank you for taking the time to test with us.",
        },
        {
          type: "FOOTER",
          text: "WhatsApp Business Platform sample message",
        },
      ],
      language: "en_US",
      status: "APPROVED",
      category: "UTILITY",
      id: "1959944161407953",
    },
  ]);
  const [selectedFile, setSelectedFile] = useState(null);

  const [selectedTemplate, setSelectedTemplate] = useState("");

  const [campaignName, setCampaignName] = useState("");

  const [progress, setProgress] = useState(0);
  const [stats, setStats] = useState({ total: 0, sent: 0, failed: 0 });

  const handleTemplateChange = (e) => {
    setSelectedTemplate(e.target.value);
  };

  const handleCampaignNameChange = (e) => {
    setCampaignName(e.target.value);
  };
  // ✅ Upload Excel for bulk messaging
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleFileUpload = async (e) => {
    console.log("USAASAS", user);
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append(
      "template",
      templates.filter((x) => x.id == selectedTemplate)[0]?.name
    );
    formData.append("user_id", user);
    formData.append("campaign", campaignName);

    console.log(formData);
    try {
      const response = await fetch(`${BASE_URL}/upload`, {
        method: "POST",
        body: formData,
      });

      console.log(response);
      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      alert("✅ Excel uploaded successfully. Messages are being processed.");
      setSelectedFile(null);
    } catch (err) {
      console.error("Upload failed:", err);
      alert("❌ Failed to upload file.");
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            <div className="w-full p-4 bg-white rounded shadow">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                {/* Campaign Name Input */}
                <div className="flex-1">
                  <label
                    htmlFor="campaign-name"
                    className="block mb-1 text-sm font-medium text-gray-700"
                  >
                    Campaign Name:
                  </label>
                  <input
                    id="campaign-name"
                    type="text"
                    value={campaignName}
                    onChange={handleCampaignNameChange}
                    placeholder="Enter campaign name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Template Dropdown */}
                <div className="flex-1">
                  <label
                    htmlFor="template-select"
                    className="block mb-1 text-sm font-medium text-gray-700"
                  >
                    Choose a Template:
                  </label>
                  <select
                    id="template-select"
                    value={selectedTemplate}
                    onChange={handleTemplateChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white"
                  >
                    <option value="" disabled>
                      Select a template
                    </option>
                    {templates.map((template, index) => (
                      <option key={index} value={template.id}>
                        {template.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* File Upload  */}
                <div className="flex-1">
                  <label
                    htmlFor="file-select"
                    className="block mb-1 text-sm font-medium text-gray-700"
                  >
                    Upload Excel for Bulk Messages
                  </label>
                  <input
                    type="file"
                    accept=".xlsx, .xls, .csv"
                    onChange={handleFileChange}
                    className="border p-2 rounded w-full"
                    aria-label="dsd"
                  />
                </div>
              </div>
              <button
                class="bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition duration-200 mt-5 "
                onClick={handleFileUpload}
              >
                Send Message
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default BulkMessager;
