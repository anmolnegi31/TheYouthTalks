import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

export interface SurveyResponse {
  id: string;
  surveyId: string;
  respondentId?: string;
  responses: {
    questionId: string;
    answer: string | string[] | number;
  }[];
  submittedAt: string;
  timeTaken: number; // in minutes
}

export interface FormData {
  id: string;
  title: string;
  description: string;
  author: string;
  headline: string;
  startDate: string;
  endDate: string;
  status: "draft" | "live" | "upcoming" | "closed";
  responses: number;
  views: number;
  createdDate: string;
  lastModified: string;
  category: string;
  scheduledDate?: string;
  tags: string[];
  questions: Question[];
  surveyResponses?: SurveyResponse[]; // Store actual survey responses
}

export interface Question {
  id: string;
  type: "short" | "long" | "mcq" | "rating" | "checkbox" | "dropdown";
  title: string;
  description?: string;
  required: boolean;
  options?: Option[];
  maxRating?: number;
}

export interface Option {
  id: string;
  text: string;
}

interface FormsContextType {
  forms: FormData[];
  addForm: (
    form: Omit<
      FormData,
      "id" | "responses" | "views" | "createdDate" | "lastModified" | "status"
    >,
  ) => void;
  updateForm: (id: string, updates: Partial<FormData>) => void;
  deleteForm: (id: string) => void;
  getFormsByStatus: (status: FormData["status"]) => FormData[];
  submitSurveyResponse: (
    response: Omit<SurveyResponse, "id" | "submittedAt">,
  ) => void;
  getSurveyResponses: (surveyId: string) => SurveyResponse[];
  incrementViews: (formId: string) => void;
}

const FormsContext = createContext<FormsContextType | undefined>(undefined);

// Initial mock data
const initialForms: FormData[] = [
  {
    id: "1",
    title: "Customer Satisfaction Survey",
    description:
      "Comprehensive feedback collection for our latest product launch",
    author: "Sudhansu Kumar",
    headline: "Help us improve our service",
    startDate: "2024-01-15T09:00",
    endDate: "2024-02-15T18:00",
    status: "live",
    responses: 156,
    views: 1240,
    createdDate: "2024-01-15",
    lastModified: "2024-01-20",
    category: "Retail",
    tags: ["customer", "satisfaction", "feedback"],
    questions: [],
  },
  {
    id: "2",
    title: "Product Feedback Form",
    description: "Quarterly customer satisfaction and loyalty assessment",
    author: "Sudhansu Kumar",
    headline: "Share your thoughts on our products",
    startDate: "2024-01-25T10:00",
    endDate: "2024-02-25T17:00",
    status: "upcoming",
    responses: 0,
    views: 45,
    createdDate: "2024-01-10",
    lastModified: "2024-01-18",
    category: "Technology",
    scheduledDate: "2024-01-25",
    tags: ["product", "feedback", "development"],
    questions: [],
  },
  {
    id: "3",
    title: "Brand Awareness Campaign Survey",
    description: "Measuring brand recognition and market positioning",
    author: "Sudhansu Kumar",
    headline: "How well do you know our brand?",
    startDate: "2023-12-01T08:00",
    endDate: "2024-01-05T20:00",
    status: "closed",
    responses: 892,
    views: 3420,
    createdDate: "2023-12-01",
    lastModified: "2024-01-05",
    category: "Marketing",
    tags: ["brand", "awareness", "marketing"],
    questions: [],
  },
  {
    id: "4",
    title: "Employee Wellness Check",
    description: "Internal survey for employee satisfaction and wellbeing",
    author: "Sudhansu Kumar",
    headline: "Tell us about your workplace experience",
    startDate: "2024-01-30T09:00",
    endDate: "2024-02-28T17:00",
    status: "draft",
    responses: 0,
    views: 12,
    createdDate: "2024-01-18",
    lastModified: "2024-01-19",
    category: "HR",
    tags: ["wellness", "internal", "hr"],
    questions: [],
  },
  {
    id: "5",
    title: "Market Research - Fashion Trends",
    description: "Understanding youth preferences in fashion and lifestyle",
    author: "Sudhansu Kumar",
    headline: "What fashion trends interest you?",
    startDate: "2024-01-12T11:00",
    endDate: "2024-03-12T19:00",
    status: "live",
    responses: 234,
    views: 890,
    createdDate: "2024-01-12",
    lastModified: "2024-01-17",
    category: "Fashion & Lifestyle",
    tags: ["fashion", "trends", "youth"],
    questions: [],
  },
  {
    id: "6",
    title: "Food Delivery Preferences",
    description: "Survey about food ordering habits and preferences",
    author: "Sudhansu Kumar",
    headline: "Share your food delivery preferences",
    startDate: "2024-01-28T12:00",
    endDate: "2024-02-28T22:00",
    status: "upcoming",
    responses: 0,
    views: 67,
    createdDate: "2024-01-16",
    lastModified: "2024-01-19",
    category: "Food & Beverages",
    scheduledDate: "2024-01-28",
    tags: ["food", "delivery", "preferences"],
    questions: [],
  },
];

export function FormsProvider({ children }: { children: ReactNode }) {
  const [forms, setForms] = useState<FormData[]>(initialForms);

  const addForm = (
    newForm: Omit<
      FormData,
      "id" | "responses" | "views" | "createdDate" | "lastModified" | "status"
    >,
  ) => {
    const now = new Date();
    const currentDate = now.toISOString().split("T")[0];

    // Determine status based on dates
    let status: FormData["status"] = "draft";
    if (newForm.startDate && newForm.endDate) {
      const startDate = new Date(newForm.startDate);
      const endDate = new Date(newForm.endDate);

      if (now >= startDate && now <= endDate) {
        status = "live";
      } else if (now < startDate) {
        status = "upcoming";
      } else if (now > endDate) {
        status = "closed";
      }
    }

    const formWithMetadata: FormData = {
      ...newForm,
      id: Date.now().toString(),
      status,
      responses: 0,
      views: 0,
      createdDate: currentDate,
      lastModified: currentDate,
      ...(status === "upcoming" && { scheduledDate: newForm.startDate }),
    };

    setForms((prev) => [...prev, formWithMetadata]);
  };

  const updateForm = (id: string, updates: Partial<FormData>) => {
    setForms((prev) =>
      prev.map((form) =>
        form.id === id
          ? {
              ...form,
              ...updates,
              lastModified: new Date().toISOString().split("T")[0],
            }
          : form,
      ),
    );
  };

  const deleteForm = (id: string) => {
    setForms((prev) => prev.filter((form) => form.id !== id));
  };

  const getFormsByStatus = (status: FormData["status"]) => {
    return forms.filter((form) => form.status === status);
  };

  const submitSurveyResponse = (
    responseData: Omit<SurveyResponse, "id" | "submittedAt">,
  ) => {
    const newResponse: SurveyResponse = {
      ...responseData,
      id: Date.now().toString(),
      submittedAt: new Date().toISOString(),
    };

    setForms((prev) =>
      prev.map((form) => {
        if (form.id === responseData.surveyId) {
          const existingResponses = form.surveyResponses || [];
          return {
            ...form,
            responses: form.responses + 1,
            surveyResponses: [...existingResponses, newResponse],
            lastModified: new Date().toISOString().split("T")[0],
          };
        }
        return form;
      }),
    );
  };

  const getSurveyResponses = (surveyId: string): SurveyResponse[] => {
    const form = forms.find((f) => f.id === surveyId);
    return form?.surveyResponses || [];
  };

  const incrementViews = useCallback((formId: string) => {
    setForms((prev) =>
      prev.map((form) =>
        form.id === formId ? { ...form, views: form.views + 1 } : form,
      ),
    );
  }, []);

  return (
    <FormsContext.Provider
      value={{
        forms,
        addForm,
        updateForm,
        deleteForm,
        getFormsByStatus,
        submitSurveyResponse,
        getSurveyResponses,
        incrementViews,
      }}
    >
      {children}
    </FormsContext.Provider>
  );
}

export function useForms() {
  const context = useContext(FormsContext);
  if (context === undefined) {
    throw new Error("useForms must be used within a FormsProvider");
  }
  return context;
}
