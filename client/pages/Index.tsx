import Layout from "../components/Layout";
import { Heart, Share2, Plus, Calendar, Download } from "lucide-react";
import { Link } from "react-router-dom";
import { useForms } from "../contexts/FormsContext";

interface FormCard {
  id: string;
  title: string;
  category: string;
  timing: string;
  likes: number;
  shares: number;
  status: "draft" | "live" | "upcoming" | "closed";
}

/* const formData: FormCard[] = [
  {
    id: "1",
    title: "Customer Satisfaction Survey",
    category: "Retail",
    timing: "2 days left",
    likes: 24,
    shares: 8,
    status: "live",
  },
  {
    id: "2",
    title: "Product Feedback Form",
    category: "Technology",
    timing: "5 days left",
    likes: 18,
    shares: 5,
    status: "live",
  },
  {
    id: "3",
    title: "Event Planning Survey",
    category: "Entertainment",
    timing: "Draft",
    likes: 0,
    shares: 0,
    status: "draft",
  },
  {
    id: "4",
    title: "Food Preference Study",
    category: "Food & Beverages",
    timing: "Starts in 3 days",
    likes: 12,
    shares: 3,
    status: "upcoming",
  },
  {
    id: "5",
    title: "Market Research Survey",
    category: "Business",
    timing: "Ended 2 days ago",
    likes: 45,
    shares: 15,
    status: "closed",
    },
]; */

const FormCard = ({ form }: { form: FormCard }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "live":
        return "text-green-600 bg-green-50";
      case "draft":
        return "text-orange-600 bg-orange-50";
      case "upcoming":
        return "text-blue-600 bg-blue-50";
      case "closed":
        return "text-gray-600 bg-gray-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {form.title}
          </h3>
          <p className="text-sm text-gray-500">{form.category}</p>
        </div>
        <button className="bg-youth-purple text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-opacity-90 transition-colors">
          Edit
        </button>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(form.status)}`}
          >
            {form.timing}
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1 text-gray-500">
            <Heart className="h-4 w-4" />
            <span className="text-sm">{form.likes}</span>
          </div>
          <div className="flex items-center space-x-1 text-gray-500">
            <Share2 className="h-4 w-4" />
            <span className="text-sm">{form.shares}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const SectionHeader = ({ title, count }: { title: string; count: number }) => (
  <div className="flex items-center justify-between mb-6">
    <div className="flex items-center space-x-3">
      <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
        {count}
      </span>
    </div>
    <Link
      to="/create-form"
      className="flex items-center space-x-2 bg-youth-purple text-white px-4 py-2 rounded-md font-medium hover:bg-opacity-90 transition-colors"
    >
      <Plus className="h-4 w-4" />
      <span>Create New</span>
    </Link>
  </div>
);

export default function Index() {
  const { forms } = useForms();

  // Convert forms to FormCard format for display
  const convertToFormCard = (form: any): FormCard => ({
    id: form.id,
    title: form.title,
    category: form.category,
    timing:
      form.status === "live"
        ? `${form.responses} responses`
        : form.status === "draft"
          ? "Draft"
          : form.status === "upcoming"
            ? "Upcoming"
            : "Closed",
    likes: Math.floor(form.responses * 0.15) || 0,
    shares: Math.floor(form.responses * 0.05) || 0,
    status: form.status,
  });

  const formData = forms.map(convertToFormCard);
  const draftForms = formData.filter((form) => form.status === "draft");
  const liveForms = formData.filter((form) => form.status === "live");
  const upcomingForms = formData.filter((form) => form.status === "upcoming");
  const closedForms = formData.filter((form) => form.status === "closed");

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Manage Your Survey Forms
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Create, manage, and analyze your survey forms with powerful
                insights
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/create-form"
                  className="bg-youth-purple text-white px-8 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors"
                >
                  Create New Survey
                </Link>
                <Link
                  to="/create-form"
                  className="flex items-center justify-center space-x-2 border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  <Calendar className="h-5 w-5" />
                  <span>Schedule Survey</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="container mx-auto px-4 py-8">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Forms
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {formData.length}
                  </p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Live Forms
                  </p>
                  <p className="text-3xl font-bold text-green-600">
                    {liveForms.length}
                  </p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="h-6 w-6 bg-green-600 rounded-full"></div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Responses
                  </p>
                  <p className="text-3xl font-bold text-youth-purple">1,234</p>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <Heart className="h-6 w-6 text-youth-purple" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Downloads</p>
                  <p className="text-3xl font-bold text-orange-600">89</p>
                </div>
                <div className="bg-orange-50 p-3 rounded-lg">
                  <Download className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Drafts Section */}
          <section className="mb-12">
            <SectionHeader title="Drafts" count={draftForms.length} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {draftForms.map((form) => (
                <FormCard key={form.id} form={form} />
              ))}
            </div>
          </section>

          {/* Live Forms Section */}
          <section className="mb-12">
            <SectionHeader title="Live Forms" count={liveForms.length} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {liveForms.map((form) => (
                <FormCard key={form.id} form={form} />
              ))}
            </div>
          </section>

          {/* Upcoming Forms Section */}
          <section className="mb-12">
            <SectionHeader
              title="Upcoming Forms"
              count={upcomingForms.length}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingForms.map((form) => (
                <FormCard key={form.id} form={form} />
              ))}
            </div>
          </section>

          {/* Closed Forms Section */}
          <section className="mb-12">
            <SectionHeader title="Closed Forms" count={closedForms.length} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {closedForms.map((form) => (
                <FormCard key={form.id} form={form} />
              ))}
            </div>
          </section>
        </div>

        {/* Mobile App CTA Section */}
        <div className="bg-youth-purple">
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto text-center text-white">
              <h2 className="text-3xl font-bold mb-4">
                Take Your Surveys Mobile
              </h2>
              <p className="text-xl mb-8 text-purple-100">
                Download our mobile app to manage surveys on the go
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-youth-purple px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  Download for iOS
                </button>
                <button className="bg-white text-youth-purple px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  Download for Android
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
