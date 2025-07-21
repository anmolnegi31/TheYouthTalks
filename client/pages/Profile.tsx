import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  Globe,
  Camera,
  Edit2,
  Save,
  X,
  Shield,
  Bell,
  Palette,
  Download,
  Trash2,
} from "lucide-react";
import Layout from "../components/Layout";

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  location: string;
  company: string;
  website: string;
  bio: string;
}

interface BrandProfile {
  companyName: string;
  industry: string;
  description: string;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  website: string;
  socialMedia: {
    twitter: string;
    linkedin: string;
    facebook: string;
  };
}

export default function Profile() {
  const [activeTab, setActiveTab] = useState<"personal" | "brand" | "settings">(
    "personal",
  );
  const [isEditing, setIsEditing] = useState(false);

  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "Sudhansu Kumar",
    email: "sudhansu@youthtalk.in",
    phone: "+91 98765 43210",
    location: "Mumbai, India",
    company: "Youth Talks",
    website: "https://youthtalk.in",
    bio: "Survey specialist focused on youth engagement and market research. Passionate about understanding consumer behavior through data-driven insights.",
  });

  const [brandProfile, setBrandProfile] = useState<BrandProfile>({
    companyName: "Youth Talks",
    industry: "Market Research",
    description:
      "Leading platform for youth-focused surveys and market research, helping brands understand the next generation of consumers.",
    logo: "/logo.png",
    primaryColor: "#947DD1",
    secondaryColor: "#2E2E2E",
    website: "https://youthtalk.in",
    socialMedia: {
      twitter: "@youthtalk",
      linkedin: "youth-talks-research",
      facebook: "youthtalkresearch",
    },
  });

  const tabs = [
    { id: "personal", label: "Personal Info", icon: User },
    { id: "brand", label: "Brand Profile", icon: Building },
    { id: "settings", label: "Settings", icon: Shield },
  ];

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically save to backend
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original values
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
            <p className="text-gray-600">
              Manage your personal information and brand settings
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="bg-white rounded-lg shadow-sm border mb-6">
            <div className="border-b">
              <nav className="flex space-x-8 px-6">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                      activeTab === tab.id
                        ? "border-youth-purple text-youth-purple"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {/* Personal Info Tab */}
              {activeTab === "personal" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Personal Information
                    </h2>
                    <div className="flex items-center gap-2">
                      {isEditing ? (
                        <>
                          <button
                            onClick={handleCancel}
                            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800"
                          >
                            <X className="w-4 h-4" />
                            Cancel
                          </button>
                          <button
                            onClick={handleSave}
                            className="flex items-center gap-2 bg-youth-purple text-white px-4 py-2 rounded-lg hover:bg-youth-purple/90"
                          >
                            <Save className="w-4 h-4" />
                            Save Changes
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => setIsEditing(true)}
                          className="flex items-center gap-2 bg-youth-purple text-white px-4 py-2 rounded-lg hover:bg-youth-purple/90"
                        >
                          <Edit2 className="w-4 h-4" />
                          Edit Profile
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Profile Picture */}
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <div className="w-24 h-24 bg-youth-purple/10 rounded-full flex items-center justify-center">
                        <User className="w-12 h-12 text-youth-purple" />
                      </div>
                      {isEditing && (
                        <button className="absolute -bottom-2 -right-2 bg-youth-purple text-white p-2 rounded-full hover:bg-youth-purple/90">
                          <Camera className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {userProfile.name}
                      </h3>
                      <p className="text-gray-600">{userProfile.email}</p>
                      <p className="text-sm text-gray-500">
                        Member since January 2024
                      </p>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <div className="flex items-center gap-2">
                        <User className="w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={userProfile.name}
                          onChange={(e) =>
                            setUserProfile({
                              ...userProfile,
                              name: e.target.value,
                            })
                          }
                          disabled={!isEditing}
                          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-youth-purple focus:border-youth-purple disabled:bg-gray-50"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <div className="flex items-center gap-2">
                        <Mail className="w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          value={userProfile.email}
                          onChange={(e) =>
                            setUserProfile({
                              ...userProfile,
                              email: e.target.value,
                            })
                          }
                          disabled={!isEditing}
                          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-youth-purple focus:border-youth-purple disabled:bg-gray-50"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <div className="flex items-center gap-2">
                        <Phone className="w-5 h-5 text-gray-400" />
                        <input
                          type="tel"
                          value={userProfile.phone}
                          onChange={(e) =>
                            setUserProfile({
                              ...userProfile,
                              phone: e.target.value,
                            })
                          }
                          disabled={!isEditing}
                          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-youth-purple focus:border-youth-purple disabled:bg-gray-50"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Location
                      </label>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={userProfile.location}
                          onChange={(e) =>
                            setUserProfile({
                              ...userProfile,
                              location: e.target.value,
                            })
                          }
                          disabled={!isEditing}
                          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-youth-purple focus:border-youth-purple disabled:bg-gray-50"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company
                      </label>
                      <div className="flex items-center gap-2">
                        <Building className="w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={userProfile.company}
                          onChange={(e) =>
                            setUserProfile({
                              ...userProfile,
                              company: e.target.value,
                            })
                          }
                          disabled={!isEditing}
                          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-youth-purple focus:border-youth-purple disabled:bg-gray-50"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Website
                      </label>
                      <div className="flex items-center gap-2">
                        <Globe className="w-5 h-5 text-gray-400" />
                        <input
                          type="url"
                          value={userProfile.website}
                          onChange={(e) =>
                            setUserProfile({
                              ...userProfile,
                              website: e.target.value,
                            })
                          }
                          disabled={!isEditing}
                          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-youth-purple focus:border-youth-purple disabled:bg-gray-50"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bio
                    </label>
                    <textarea
                      value={userProfile.bio}
                      onChange={(e) =>
                        setUserProfile({ ...userProfile, bio: e.target.value })
                      }
                      disabled={!isEditing}
                      rows={4}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-youth-purple focus:border-youth-purple disabled:bg-gray-50"
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                </div>
              )}

              {/* Brand Profile Tab */}
              {activeTab === "brand" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Brand Profile
                    </h2>
                    <button className="flex items-center gap-2 bg-youth-purple text-white px-4 py-2 rounded-lg hover:bg-youth-purple/90">
                      <Edit2 className="w-4 h-4" />
                      Edit Brand
                    </button>
                  </div>

                  {/* Brand Logo */}
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-youth-purple/10 rounded-lg flex items-center justify-center">
                      <Building className="w-10 h-10 text-youth-purple" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {brandProfile.companyName}
                      </h3>
                      <p className="text-gray-600">{brandProfile.industry}</p>
                      <button className="text-youth-purple text-sm hover:underline">
                        Upload new logo
                      </button>
                    </div>
                  </div>

                  {/* Brand Colors */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Brand Colors
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Primary Color
                        </label>
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-lg border"
                            style={{
                              backgroundColor: brandProfile.primaryColor,
                            }}
                          ></div>
                          <input
                            type="text"
                            value={brandProfile.primaryColor}
                            className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                            readOnly
                          />
                          <button className="p-2 text-gray-600 hover:text-gray-800">
                            <Palette className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Secondary Color
                        </label>
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-lg border"
                            style={{
                              backgroundColor: brandProfile.secondaryColor,
                            }}
                          ></div>
                          <input
                            type="text"
                            value={brandProfile.secondaryColor}
                            className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                            readOnly
                          />
                          <button className="p-2 text-gray-600 hover:text-gray-800">
                            <Palette className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Brand Info */}
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company Description
                      </label>
                      <textarea
                        value={brandProfile.description}
                        rows={4}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        readOnly
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Social Media
                      </label>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <span className="w-20 text-sm text-gray-600">
                            Twitter:
                          </span>
                          <input
                            type="text"
                            value={brandProfile.socialMedia.twitter}
                            className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                            readOnly
                          />
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="w-20 text-sm text-gray-600">
                            LinkedIn:
                          </span>
                          <input
                            type="text"
                            value={brandProfile.socialMedia.linkedin}
                            className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                            readOnly
                          />
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="w-20 text-sm text-gray-600">
                            Facebook:
                          </span>
                          <input
                            type="text"
                            value={brandProfile.socialMedia.facebook}
                            className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                            readOnly
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === "settings" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Account Settings
                  </h2>

                  {/* Notifications */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Bell className="w-5 h-5 text-gray-600" />
                      <h3 className="text-lg font-medium text-gray-900">
                        Notifications
                      </h3>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">
                            Email Notifications
                          </p>
                          <p className="text-sm text-gray-600">
                            Receive updates about your surveys and responses
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            defaultChecked
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-youth-purple/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-youth-purple"></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">
                            SMS Notifications
                          </p>
                          <p className="text-sm text-gray-600">
                            Get text alerts for urgent updates
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-youth-purple/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-youth-purple"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Data Export */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Download className="w-5 h-5 text-gray-600" />
                      <h3 className="text-lg font-medium text-gray-900">
                        Data Export
                      </h3>
                    </div>
                    <p className="text-gray-600 mb-4">
                      Download your account data and survey responses
                    </p>
                    <button className="bg-youth-purple text-white px-4 py-2 rounded-lg hover:bg-youth-purple/90">
                      Request Data Export
                    </button>
                  </div>

                  {/* Danger Zone */}
                  <div className="bg-red-50 rounded-lg p-6 border border-red-200">
                    <div className="flex items-center gap-3 mb-4">
                      <Trash2 className="w-5 h-5 text-red-600" />
                      <h3 className="text-lg font-medium text-red-900">
                        Danger Zone
                      </h3>
                    </div>
                    <p className="text-red-700 mb-4">
                      Once you delete your account, there is no going back.
                      Please be certain.
                    </p>
                    <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
                      Delete Account
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
