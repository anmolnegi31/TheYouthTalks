import { useState } from "react";
import {
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Type,
  AlignLeft,
  List,
  Star,
  CheckSquare,
  ChevronDown,
  Save,
  Eye,
  X,
} from "lucide-react";
import Layout from "../components/Layout";
import { useForms, Question, Option } from "../contexts/FormsContext";
import { useNavigate, useSearchParams } from "react-router-dom";

interface FormData {
  title: string;
  description: string;
  author: string;
  headline: string;
  category: string;
  customCategory: string;
  startDate: string;
  endDate: string;
  questions: Question[];
}

export default function CreateForm() {
  const { addForm, updateForm, forms } = useForms();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editFormId = searchParams.get("edit");
  const isEditing = !!editFormId;
  const existingForm = isEditing
    ? forms.find((f) => f.id === editFormId)
    : null;

  const [formData, setFormData] = useState<FormData>(() => {
    if (isEditing && existingForm) {
      return {
        title: existingForm.title,
        description: existingForm.description,
        author: existingForm.author,
        headline: existingForm.headline,
        category: existingForm.category,
        customCategory:
          existingForm.category === "Others" ? existingForm.category : "",
        startDate: existingForm.startDate,
        endDate: existingForm.endDate,
        questions: existingForm.questions,
      };
    }
    return {
      title: "",
      description: "",
      author: "",
      headline: "",
      category: "",
      customCategory: "",
      startDate: "",
      endDate: "",
      questions: [],
    };
  });

  const [activeTab, setActiveTab] = useState<"form" | "questions" | "settings">(
    "form",
  );

  const questionTypes = [
    { type: "short", label: "Short Answer", icon: Type },
    { type: "long", label: "Long Answer", icon: AlignLeft },
    { type: "mcq", label: "Multiple Choice", icon: List },
    { type: "rating", label: "Rating Scale", icon: Star },
    { type: "checkbox", label: "Checkboxes", icon: CheckSquare },
    { type: "dropdown", label: "Dropdown", icon: ChevronDown },
  ];

  const addQuestion = (type: Question["type"]) => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      type,
      title: "",
      required: false,
      ...(["mcq", "checkbox", "dropdown"].includes(type) && {
        options: [
          { id: "1", text: "Option 1" },
          { id: "2", text: "Option 2" },
        ],
      }),
      ...(type === "rating" && { maxRating: 5 }),
    };

    setFormData({
      ...formData,
      questions: [...formData.questions, newQuestion],
    });
  };

  const updateQuestion = (questionId: string, updates: Partial<Question>) => {
    setFormData({
      ...formData,
      questions: formData.questions.map((q) =>
        q.id === questionId ? { ...q, ...updates } : q,
      ),
    });
  };

  const deleteQuestion = (questionId: string) => {
    setFormData({
      ...formData,
      questions: formData.questions.filter((q) => q.id !== questionId),
    });
  };

  const moveQuestion = (questionId: string, direction: "up" | "down") => {
    const currentIndex = formData.questions.findIndex(
      (q) => q.id === questionId,
    );
    if (
      (direction === "up" && currentIndex === 0) ||
      (direction === "down" && currentIndex === formData.questions.length - 1)
    ) {
      return;
    }

    const newQuestions = [...formData.questions];
    const targetIndex =
      direction === "up" ? currentIndex - 1 : currentIndex + 1;
    [newQuestions[currentIndex], newQuestions[targetIndex]] = [
      newQuestions[targetIndex],
      newQuestions[currentIndex],
    ];

    setFormData({ ...formData, questions: newQuestions });
  };

  const addOption = (questionId: string) => {
    const question = formData.questions.find((q) => q.id === questionId);
    if (!question || !question.options) return;

    const newOption: Option = {
      id: Date.now().toString(),
      text: `Option ${question.options.length + 1}`,
    };

    updateQuestion(questionId, {
      options: [...question.options, newOption],
    });
  };

  const updateOption = (questionId: string, optionId: string, text: string) => {
    const question = formData.questions.find((q) => q.id === questionId);
    if (!question || !question.options) return;

    const updatedOptions = question.options.map((opt) =>
      opt.id === optionId ? { ...opt, text } : opt,
    );

    updateQuestion(questionId, { options: updatedOptions });
  };

  const removeOption = (questionId: string, optionId: string) => {
    const question = formData.questions.find((q) => q.id === questionId);
    if (!question || !question.options || question.options.length <= 2) return;

    const updatedOptions = question.options.filter(
      (opt) => opt.id !== optionId,
    );
    updateQuestion(questionId, { options: updatedOptions });
  };

  const handleSaveForm = () => {
    if (
      !formData.title ||
      !formData.author ||
      !formData.category ||
      !formData.startDate ||
      !formData.endDate
    ) {
      alert(
        "Please fill in all required fields (Title, Author, Category, Start Date, End Date)",
      );
      return;
    }

    if (formData.category === "Others" && !formData.customCategory.trim()) {
      alert("Please specify your custom category");
      return;
    }

    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      alert("End date must be after start date");
      return;
    }

    // Use selected category or custom category
    const finalCategory =
      formData.category === "Others"
        ? formData.customCategory
        : formData.category;

    // Generate tags based on category and title
    const categoryTags = {
      "Food and Beverages": ["food", "beverages", "dining"],
      Entertainment: ["entertainment", "media", "leisure"],
      Luxury: ["luxury", "premium", "lifestyle"],
      Logistics: ["logistics", "transportation", "supply"],
      Vehicles: ["vehicles", "automotive", "transport"],
      "NGO's": ["ngo", "nonprofit", "social"],
      Retail: ["retail", "shopping", "commerce"],
      Education: ["education", "learning", "academic"],
      "Fashion and Lifestyle": ["fashion", "lifestyle", "style"],
    };

    const baseTags = categoryTags[formData.category] || ["survey", "custom"];
    const titleTags = [];
    if (formData.title.toLowerCase().includes("customer"))
      titleTags.push("customer");
    if (formData.title.toLowerCase().includes("product"))
      titleTags.push("product");
    if (formData.title.toLowerCase().includes("feedback"))
      titleTags.push("feedback");

    const { customCategory, ...formDataWithoutCustom } = formData;

    const formToSave = {
      ...formDataWithoutCustom,
      category: finalCategory,
      tags: [...baseTags, ...titleTags].slice(0, 5), // Limit to 5 tags
    };

    if (isEditing && editFormId) {
      // Update existing form
      updateForm(editFormId, formToSave);
      alert(`Form "${formData.title}" updated successfully!`);
    } else {
      // Create new form
      addForm(formToSave);
      alert(`Form "${formData.title}" created successfully!`);
    }

    navigate("/forms");
  };

  const tabs = [
    { id: "form", label: "Form Details" },
    { id: "questions", label: "Questions" },
    { id: "settings", label: "Settings" },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto p-4 md:p-6">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm border mb-6">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {isEditing ? "Edit Form" : "Create New Form"}
                  </h1>
                  <p className="text-gray-600 mt-1">
                    {isEditing
                      ? "Update your survey questions and settings"
                      : "Build your survey with custom questions and settings"}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Eye className="w-4 h-4" />
                    Preview
                  </button>
                  <button
                    onClick={handleSaveForm}
                    className="flex items-center gap-2 bg-youth-purple text-white px-4 py-2 rounded-lg hover:bg-youth-purple/90"
                  >
                    <Save className="w-4 h-4" />
                    {isEditing ? "Update Form" : "Save Form"}
                  </button>
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
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
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Form Details Tab */}
          {activeTab === "form" && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Basic Information
              </h2>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Form Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      placeholder="Enter form title"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-youth-purple focus:border-youth-purple"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Author Name *
                    </label>
                    <input
                      type="text"
                      value={formData.author}
                      onChange={(e) =>
                        setFormData({ ...formData, author: e.target.value })
                      }
                      placeholder="Enter author name"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-youth-purple focus:border-youth-purple"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Headline
                  </label>
                  <input
                    type="text"
                    value={formData.headline}
                    onChange={(e) =>
                      setFormData({ ...formData, headline: e.target.value })
                    }
                    placeholder="Enter form headline"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-youth-purple focus:border-youth-purple"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Describe what this form is about..."
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-youth-purple focus:border-youth-purple"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Category *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                    {[
                      "Food and Beverages",
                      "Entertainment",
                      "Luxury",
                      "Logistics",
                      "Vehicles",
                      "NGO's",
                      "Retail",
                      "Education",
                      "Fashion and Lifestyle",
                    ].map((category) => (
                      <label
                        key={category}
                        className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                          formData.category === category
                            ? "border-youth-purple bg-youth-purple/5"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        <input
                          type="radio"
                          name="category"
                          value={category}
                          checked={formData.category === category}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              category: e.target.value,
                              customCategory: "", // Clear custom category when selecting predefined
                            })
                          }
                          className="sr-only"
                        />
                        <span className="text-sm font-medium text-gray-900">
                          {category}
                        </span>
                      </label>
                    ))}

                    {/* Others option */}
                    <label
                      className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                        formData.category === "Others"
                          ? "border-youth-purple bg-youth-purple/5"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      <input
                        type="radio"
                        name="category"
                        value="Others"
                        checked={formData.category === "Others"}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            category: e.target.value,
                          })
                        }
                        className="sr-only"
                      />
                      <span className="text-sm font-medium text-gray-900">
                        Others
                      </span>
                    </label>
                  </div>

                  {/* Custom category input when Others is selected */}
                  {formData.category === "Others" && (
                    <div className="mt-3">
                      <input
                        type="text"
                        value={formData.customCategory}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            customCategory: e.target.value,
                          })
                        }
                        placeholder="Please specify your category"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-youth-purple focus:border-youth-purple"
                      />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date *
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.startDate}
                      onChange={(e) =>
                        setFormData({ ...formData, startDate: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-youth-purple focus:border-youth-purple"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date *
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.endDate}
                      onChange={(e) =>
                        setFormData({ ...formData, endDate: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-youth-purple focus:border-youth-purple"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Questions Tab */}
          {activeTab === "questions" && (
            <div className="space-y-6">
              {/* Add Question Buttons */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Add Questions
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {questionTypes.map(({ type, label, icon: Icon }) => (
                    <button
                      key={type}
                      onClick={() => addQuestion(type as Question["type"])}
                      className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg hover:border-youth-purple hover:bg-youth-purple/5 transition-colors"
                    >
                      <Icon className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium">{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Questions List */}
              <div className="space-y-4">
                {formData.questions.map((question, index) => (
                  <div
                    key={question.id}
                    className="bg-white rounded-lg shadow-sm border p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className="bg-youth-purple/10 text-youth-purple px-2 py-1 rounded text-sm font-medium">
                          Q{index + 1}
                        </span>
                        <span className="text-sm text-gray-600 capitalize">
                          {question.type === "mcq"
                            ? "Multiple Choice"
                            : question.type}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => moveQuestion(question.id, "up")}
                          disabled={index === 0}
                          className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => moveQuestion(question.id, "down")}
                          disabled={index === formData.questions.length - 1}
                          className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                        >
                          <ArrowDown className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteQuestion(question.id)}
                          className="p-1 text-red-400 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Question Title *
                        </label>
                        <input
                          type="text"
                          value={question.title}
                          onChange={(e) =>
                            updateQuestion(question.id, {
                              title: e.target.value,
                            })
                          }
                          placeholder="Enter your question"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-youth-purple focus:border-youth-purple"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description (Optional)
                        </label>
                        <input
                          type="text"
                          value={question.description || ""}
                          onChange={(e) =>
                            updateQuestion(question.id, {
                              description: e.target.value,
                            })
                          }
                          placeholder="Add helpful description"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-youth-purple focus:border-youth-purple"
                        />
                      </div>

                      {/* Rating specific controls */}
                      {question.type === "rating" && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Maximum Rating
                          </label>
                          <select
                            value={question.maxRating || 5}
                            onChange={(e) =>
                              updateQuestion(question.id, {
                                maxRating: parseInt(e.target.value),
                              })
                            }
                            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-youth-purple focus:border-youth-purple"
                          >
                            <option value={3}>3 Stars</option>
                            <option value={4}>4 Stars</option>
                            <option value={5}>5 Stars</option>
                            <option value={10}>10 Points</option>
                          </select>
                        </div>
                      )}

                      {/* Options for MCQ, Checkbox, Dropdown */}
                      {["mcq", "checkbox", "dropdown"].includes(
                        question.type,
                      ) && (
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <label className="block text-sm font-medium text-gray-700">
                              Options
                            </label>
                            <button
                              onClick={() => addOption(question.id)}
                              className="flex items-center gap-1 text-youth-purple text-sm hover:underline"
                            >
                              <Plus className="w-3 h-3" />
                              Add Option
                            </button>
                          </div>
                          <div className="space-y-2">
                            {question.options?.map((option) => (
                              <div
                                key={option.id}
                                className="flex items-center gap-2"
                              >
                                <input
                                  type="text"
                                  value={option.text}
                                  onChange={(e) =>
                                    updateOption(
                                      question.id,
                                      option.id,
                                      e.target.value,
                                    )
                                  }
                                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-youth-purple focus:border-youth-purple"
                                />
                                {question.options!.length > 2 && (
                                  <button
                                    onClick={() =>
                                      removeOption(question.id, option.id)
                                    }
                                    className="p-2 text-red-400 hover:text-red-600"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id={`required-${question.id}`}
                          checked={question.required}
                          onChange={(e) =>
                            updateQuestion(question.id, {
                              required: e.target.checked,
                            })
                          }
                          className="rounded border-gray-300 text-youth-purple focus:ring-youth-purple"
                        />
                        <label
                          htmlFor={`required-${question.id}`}
                          className="ml-2 text-sm text-gray-700"
                        >
                          Required question
                        </label>
                      </div>
                    </div>
                  </div>
                ))}

                {formData.questions.length === 0 && (
                  <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Plus className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No questions yet
                    </h3>
                    <p className="text-gray-600">
                      Add your first question using the buttons above
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Form Settings
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-medium text-gray-900 mb-3">
                    Response Settings
                  </h3>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-youth-purple focus:ring-youth-purple"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Allow multiple responses from same user
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-youth-purple focus:ring-youth-purple"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Require email verification
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="rounded border-gray-300 text-youth-purple focus:ring-youth-purple"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Show progress bar to respondents
                      </span>
                    </label>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-medium text-gray-900 mb-3">
                    Thank You Message
                  </h3>
                  <textarea
                    placeholder="Thank you for your response! We appreciate your time."
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-youth-purple focus:border-youth-purple"
                  />
                </div>

                <div>
                  <h3 className="text-base font-medium text-gray-900 mb-3">
                    Notifications
                  </h3>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="rounded border-gray-300 text-youth-purple focus:ring-youth-purple"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Email me when someone responds
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-youth-purple focus:ring-youth-purple"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Send daily summary reports
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
