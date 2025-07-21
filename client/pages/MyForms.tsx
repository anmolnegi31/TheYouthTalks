import { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit2,
  Share2,
  Download,
  Trash2,
  Clock,
  Users,
  Calendar,
  BarChart3,
  Copy,
  Play,
  Pause,
  Archive,
} from "lucide-react";
import Layout from "../components/Layout";
import { Link, useNavigate } from "react-router-dom";
import { useForms, FormData } from "../contexts/FormsContext";

export default function MyForms() {
  const { forms, deleteForm } = useForms();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<
    "all" | "draft" | "live" | "upcoming" | "closed"
  >("all");
  const [activeCategoryFilter, setActiveCategoryFilter] =
    useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedForms, setSelectedForms] = useState<string[]>([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [formToDelete, setFormToDelete] = useState<FormData | null>(null);

  // Using forms from context instead of static data
  /* const forms: FormData[] = [
    {
      id: "1",
      title: "Product Feedback Survey 2024",
      description:
        "Comprehensive feedback collection for our latest product launch",
      status: "live",
      responses: 156,
      views: 1240,
      createdDate: "2024-01-15",
      lastModified: "2024-01-20",
      category: "Product Research",
      tags: ["product", "feedback", "2024"],
    },
    {
      id: "2",
      title: "Customer Satisfaction Study",
      description: "Quarterly customer satisfaction and loyalty assessment",
      status: "upcoming",
      responses: 0,
      views: 45,
      createdDate: "2024-01-10",
      lastModified: "2024-01-18",
      category: "Customer Experience",
      scheduledDate: "2024-01-25",
      tags: ["satisfaction", "quarterly", "loyalty"],
    },
    {
      id: "3",
      title: "Brand Awareness Campaign Survey",
      description: "Measuring brand recognition and market positioning",
      status: "closed",
      responses: 892,
      views: 3420,
      createdDate: "2023-12-01",
      lastModified: "2024-01-05",
      category: "Marketing",
      tags: ["brand", "awareness", "marketing"],
    },
    {
      id: "4",
      title: "Employee Wellness Check",
      description: "Internal survey for employee satisfaction and wellbeing",
      status: "draft",
      responses: 0,
      views: 12,
      createdDate: "2024-01-18",
      lastModified: "2024-01-19",
      category: "HR",
      tags: ["wellness", "internal", "hr"],
    },
    {
      id: "5",
      title: "Market Research - Fashion Trends",
      description: "Understanding youth preferences in fashion and lifestyle",
      status: "live",
      responses: 234,
      views: 890,
      createdDate: "2024-01-12",
      lastModified: "2024-01-17",
      category: "Fashion & Lifestyle",
      tags: ["fashion", "trends", "youth"],
    },
    {
      id: "6",
      title: "Food Delivery Preferences",
      description: "Survey about food ordering habits and preferences",
      status: "upcoming",
      responses: 0,
      views: 67,
      createdDate: "2024-01-16",
      lastModified: "2024-01-19",
      category: "Food & Beverages",
      scheduledDate: "2024-01-28",
            tags: ["food", "delivery", "preferences"],
    },
  ]; */

  const tabs = [
    { id: "all", label: "All Forms", count: forms.length },
    {
      id: "draft",
      label: "Drafts",
      count: forms.filter((f) => f.status === "draft").length,
    },
    {
      id: "live",
      label: "Live",
      count: forms.filter((f) => f.status === "live").length,
    },
    {
      id: "upcoming",
      label: "Upcoming",
      count: forms.filter((f) => f.status === "upcoming").length,
    },
    {
      id: "closed",
      label: "Closed",
      count: forms.filter((f) => f.status === "closed").length,
    },
  ];

  // Category filters
  const categories = [
    "Food and Beverages",
    "Entertainment",
    "Luxury",
    "Logistics",
    "Vehicles",
    "NGO's",
    "Retail",
    "Education",
    "Fashion and Lifestyle",
  ];

  const availableCategories = categories.filter((category) =>
    forms.some((form) => form.category === category),
  );

  const categoryTabs = [
    {
      id: "all",
      label: "All Categories",
      count: forms.length,
    },
    ...availableCategories.map((category) => ({
      id: category.toLowerCase().replace(/[^a-z0-9]/g, "-"),
      label: category,
      count: forms.filter((f) => f.category === category).length,
    })),
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "live":
        return "bg-green-100 text-green-800 border-green-200";
      case "upcoming":
        return "bg-youth-purple/10 text-youth-purple border-youth-purple/20";
      case "draft":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "closed":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "live":
        return <Play className="w-3 h-3" />;
      case "upcoming":
        return <Clock className="w-3 h-3" />;
      case "draft":
        return <Edit2 className="w-3 h-3" />;
      case "closed":
        return <Archive className="w-3 h-3" />;
      default:
        return null;
    }
  };

  const filteredForms = forms.filter((form) => {
    const matchesTab = activeTab === "all" || form.status === activeTab;
    const matchesCategory =
      activeCategoryFilter === "all" || form.category === activeCategoryFilter;
    const matchesSearch =
      form.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      form.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      form.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    return matchesTab && matchesCategory && matchesSearch;
  });

  const getCategoryFromId = (categoryId: string) => {
    if (categoryId === "all") return "all";
    return (
      categories.find(
        (cat) => cat.toLowerCase().replace(/[^a-z0-9]/g, "-") === categoryId,
      ) || categoryId
    );
  };

  const handleSelectForm = (formId: string) => {
    setSelectedForms((prev) =>
      prev.includes(formId)
        ? prev.filter((id) => id !== formId)
        : [...prev, formId],
    );
  };

  const handleSelectAll = () => {
    if (selectedForms.length === filteredForms.length) {
      setSelectedForms([]);
    } else {
      setSelectedForms(filteredForms.map((form) => form.id));
    }
  };

  const handleDeleteClick = (form: FormData) => {
    setFormToDelete(form);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (formToDelete) {
      deleteForm(formToDelete.id);
      setDeleteModalOpen(false);
      setFormToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setFormToDelete(null);
  };

  const handleEditForm = (form: FormData) => {
    // Navigate to create-form page with form data for editing
    navigate(`/create-form?edit=${form.id}`);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                My Forms
              </h1>
              <p className="text-gray-600">
                Manage and track all your survey forms
              </p>
            </div>
            <div className="flex items-center gap-3 mt-4 md:mt-0">
              <button className="flex items-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50">
                <Filter className="w-4 h-4" />
                Filters
              </button>
              <Link
                to="/create-form"
                className="flex items-center gap-2 bg-youth-purple text-white px-4 py-2 rounded-lg hover:bg-youth-purple/90"
              >
                <Plus className="w-4 h-4" />
                Create Form
              </Link>
            </div>
          </div>

          {/* Search and Bulk Actions */}
          <div className="bg-white rounded-lg shadow-sm border mb-6">
            <div className="p-6 border-b">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search forms by title, description, or tags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-youth-purple focus:border-youth-purple"
                  />
                </div>
                {selectedForms.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">
                      {selectedForms.length} selected
                    </span>
                    <button className="p-2 text-gray-600 hover:text-gray-800">
                      <Download className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-600 hover:text-gray-800">
                      <Archive className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-red-600 hover:text-red-800">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b">
              <nav className="flex space-x-8 px-6">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? "border-youth-purple text-youth-purple"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab.label}
                    <span
                      className={`ml-2 px-2 py-1 text-xs rounded-full ${
                        activeTab === tab.id
                          ? "bg-youth-purple/10 text-youth-purple"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Category Filters */}
            {availableCategories.length > 0 && (
              <div className="px-6 py-4 border-b bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-gray-700">
                      Filter by Category:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {categoryTabs.map((categoryTab) => (
                        <button
                          key={categoryTab.id}
                          onClick={() =>
                            setActiveCategoryFilter(
                              categoryTab.id === "all"
                                ? "all"
                                : getCategoryFromId(categoryTab.id),
                            )
                          }
                          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                            (activeCategoryFilter === "all" &&
                              categoryTab.id === "all") ||
                            activeCategoryFilter ===
                              getCategoryFromId(categoryTab.id)
                              ? "bg-youth-purple text-white"
                              : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          {categoryTab.label}
                          <span className="ml-1">({categoryTab.count})</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {(activeCategoryFilter !== "all" || activeTab !== "all") && (
                    <button
                      onClick={() => {
                        setActiveCategoryFilter("all");
                        setActiveTab("all");
                      }}
                      className="text-sm text-gray-500 hover:text-gray-700 underline"
                    >
                      Clear all filters
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Forms Table */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b">
                  <tr>
                    <th className="text-left p-4">
                      <input
                        type="checkbox"
                        checked={
                          filteredForms.length > 0 &&
                          selectedForms.length === filteredForms.length
                        }
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 text-youth-purple focus:ring-youth-purple"
                      />
                    </th>
                    <th className="text-left p-4 font-medium text-gray-900">
                      Form
                    </th>
                    <th className="text-left p-4 font-medium text-gray-900">
                      Status
                    </th>
                    <th className="text-left p-4 font-medium text-gray-900">
                      Responses
                    </th>
                    <th className="text-left p-4 font-medium text-gray-900">
                      Views
                    </th>
                    <th className="text-left p-4 font-medium text-gray-900">
                      Last Modified
                    </th>
                    <th className="text-left p-4 font-medium text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredForms.map((form) => (
                    <tr key={form.id} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={selectedForms.includes(form.id)}
                          onChange={() => handleSelectForm(form.id)}
                          className="rounded border-gray-300 text-youth-purple focus:ring-youth-purple"
                        />
                      </td>
                      <td className="p-4">
                        <div>
                          <h3 className="font-medium text-gray-900 mb-1">
                            {form.title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            {form.description}
                          </p>
                          <div className="flex items-center gap-2">
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                              {form.category}
                            </span>
                            {form.tags.slice(0, 2).map((tag) => (
                              <span
                                key={tag}
                                className="text-xs bg-youth-purple/10 text-youth-purple px-2 py-1 rounded"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(form.status)}`}
                        >
                          {getStatusIcon(form.status)}
                          {form.status.charAt(0).toUpperCase() +
                            form.status.slice(1)}
                        </span>
                        {form.scheduledDate && form.status === "upcoming" && (
                          <div className="text-xs text-gray-500 mt-1">
                            Scheduled: {form.scheduledDate}
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span className="font-medium">{form.responses}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4 text-gray-400" />
                          <span>{form.views}</span>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        {form.lastModified}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/survey/${form.id}`}
                            className="p-1 text-gray-600 hover:text-gray-800"
                            title="View/Take Survey"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleEditForm(form)}
                            className="p-1 text-gray-600 hover:text-gray-800"
                            title="Edit Form"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            className="p-1 text-gray-600 hover:text-gray-800"
                            title="Share Form"
                          >
                            <Share2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(form)}
                            className="p-1 text-gray-600 hover:text-red-600"
                            title="Delete Form"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredForms.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No forms found
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchQuery
                    ? "Try adjusting your search terms or filters"
                    : activeTab !== "all" || activeCategoryFilter !== "all"
                      ? "No forms match the selected filters"
                      : "Create your first form to get started"}
                </p>

                {(searchQuery ||
                  activeTab !== "all" ||
                  activeCategoryFilter !== "all") && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setActiveTab("all");
                      setActiveCategoryFilter("all");
                    }}
                    className="text-youth-purple hover:underline text-sm mb-4"
                  >
                    Clear all filters
                  </button>
                )}
                <Link
                  to="/create-form"
                  className="bg-youth-purple text-white px-4 py-2 rounded-lg hover:bg-youth-purple/90"
                >
                  Create New Form
                </Link>
              </div>
            )}
          </div>

          {/* Pagination */}
          {filteredForms.length > 0 && (
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-gray-600">
                Showing 1 to {filteredForms.length} of {filteredForms.length}{" "}
                results
              </p>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                  Previous
                </button>
                <button className="px-3 py-1 bg-youth-purple text-white rounded text-sm">
                  1
                </button>
                <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Delete Form
                </h3>
                <p className="text-sm text-gray-600">
                  This action cannot be undone
                </p>
              </div>
            </div>

            <p className="text-gray-700 mb-6">
              Are you sure you want to delete{" "}
              <span className="font-semibold">"{formToDelete?.title}"</span>?
              This will permanently remove the form and all its responses.
            </p>

            <div className="flex items-center gap-3 justify-end">
              <button
                onClick={handleDeleteCancel}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete Form
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
