import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  User,
  Calendar,
  CheckCircle,
  Star,
  ChevronDown,
} from "lucide-react";
import { useForms, Question } from "../contexts/FormsContext";

interface SurveyResponse {
  questionId: string;
  answer: string | string[] | number;
}

export default function SurveyView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { forms, submitSurveyResponse, incrementViews } = useForms();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [startTime] = useState(new Date());
  const viewsIncrementedRef = useRef(false);

  const survey = forms.find((form) => form.id === id);

  useEffect(() => {
    if (!survey) {
      navigate("/forms");
      return;
    }
    // Increment view count when survey is loaded (only once)
    if (!viewsIncrementedRef.current) {
      incrementViews(survey.id);
      viewsIncrementedRef.current = true;
    }
  }, [survey, navigate, incrementViews]);

  if (!survey) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Survey Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The survey you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate("/forms")}
            className="bg-youth-purple text-white px-6 py-2 rounded-lg hover:bg-youth-purple/90"
          >
            Back to Forms
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = survey.questions[currentQuestionIndex];
  const totalQuestions = survey.questions.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  const getQuestionResponse = (questionId: string) => {
    return responses.find((r) => r.questionId === questionId);
  };

  const updateResponse = (
    questionId: string,
    answer: string | string[] | number,
  ) => {
    setResponses((prev) => {
      const existingIndex = prev.findIndex((r) => r.questionId === questionId);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = { questionId, answer };
        return updated;
      }
      return [...prev, { questionId, answer }];
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    const endTime = new Date();
    const timeTaken = Math.round(
      (endTime.getTime() - startTime.getTime()) / 1000 / 60,
    ); // minutes

    // Submit survey response using context
    if (id) {
      submitSurveyResponse({
        surveyId: id,
        responses,
        timeTaken,
      });
    }

    setIsSubmitted(true);
  };

  const renderQuestionInput = (question: Question) => {
    const response = getQuestionResponse(question.id);
    const currentAnswer = response?.answer;

    switch (question.type) {
      case "short":
        return (
          <input
            type="text"
            value={(currentAnswer as string) || ""}
            onChange={(e) => updateResponse(question.id, e.target.value)}
            placeholder="Type your answer here..."
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-youth-purple focus:border-youth-purple text-lg"
          />
        );

      case "long":
        return (
          <textarea
            value={(currentAnswer as string) || ""}
            onChange={(e) => updateResponse(question.id, e.target.value)}
            placeholder="Type your detailed answer here..."
            rows={5}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-youth-purple focus:border-youth-purple text-lg resize-none"
          />
        );

      case "mcq":
        return (
          <div className="space-y-3">
            {question.options?.map((option) => (
              <label
                key={option.id}
                className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                  currentAnswer === option.text
                    ? "border-youth-purple bg-youth-purple/5"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={option.text}
                  checked={currentAnswer === option.text}
                  onChange={(e) => updateResponse(question.id, e.target.value)}
                  className="sr-only"
                />
                <div
                  className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                    currentAnswer === option.text
                      ? "border-youth-purple bg-youth-purple"
                      : "border-gray-300"
                  }`}
                >
                  {currentAnswer === option.text && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
                <span className="text-lg">{option.text}</span>
              </label>
            ))}
          </div>
        );

      case "checkbox":
        return (
          <div className="space-y-3">
            {question.options?.map((option) => {
              const selectedOptions = (currentAnswer as string[]) || [];
              const isSelected = selectedOptions.includes(option.text);

              return (
                <label
                  key={option.id}
                  className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                    isSelected
                      ? "border-youth-purple bg-youth-purple/5"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => {
                      const currentSelections =
                        (currentAnswer as string[]) || [];
                      if (e.target.checked) {
                        updateResponse(question.id, [
                          ...currentSelections,
                          option.text,
                        ]);
                      } else {
                        updateResponse(
                          question.id,
                          currentSelections.filter(
                            (item) => item !== option.text,
                          ),
                        );
                      }
                    }}
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 border-2 mr-3 flex items-center justify-center rounded ${
                      isSelected
                        ? "border-youth-purple bg-youth-purple"
                        : "border-gray-300"
                    }`}
                  >
                    {isSelected && (
                      <CheckCircle className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <span className="text-lg">{option.text}</span>
                </label>
              );
            })}
          </div>
        );

      case "dropdown":
        return (
          <div className="relative">
            <select
              value={(currentAnswer as string) || ""}
              onChange={(e) => updateResponse(question.id, e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-youth-purple focus:border-youth-purple text-lg appearance-none bg-white"
            >
              <option value="">Select an option...</option>
              {question.options?.map((option) => (
                <option key={option.id} value={option.text}>
                  {option.text}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        );

      case "rating":
        const maxRating = question.maxRating || 5;
        const currentRating = (currentAnswer as number) || 0;

        return (
          <div className="flex items-center justify-center space-x-2">
            {Array.from({ length: maxRating }, (_, index) => {
              const rating = index + 1;
              return (
                <button
                  key={rating}
                  onClick={() => updateResponse(question.id, rating)}
                  className={`p-2 transition-colors ${
                    rating <= currentRating
                      ? "text-yellow-400"
                      : "text-gray-300 hover:text-yellow-200"
                  }`}
                >
                  <Star
                    className={`w-8 h-8 ${
                      rating <= currentRating ? "fill-current" : ""
                    }`}
                  />
                </button>
              );
            })}
            <span className="ml-4 text-lg text-gray-600">
              {currentRating > 0
                ? `${currentRating}/${maxRating}`
                : "Rate this"}
            </span>
          </div>
        );

      default:
        return <div>Unsupported question type</div>;
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-youth-purple/10 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Thank You!</h2>
          <p className="text-gray-600 mb-6">
            Your response has been submitted successfully. We appreciate your
            time and feedback.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => navigate("/forms")}
              className="w-full bg-youth-purple text-white py-3 rounded-lg hover:bg-youth-purple/90 transition-colors"
            >
              Back to Forms
            </button>
            <button
              onClick={() => window.location.reload()}
              className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Take Survey Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-youth-purple/5 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate("/forms")}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Forms
            </button>

            <div className="text-center">
              <h1 className="text-xl font-semibold text-gray-900">
                {survey.title}
              </h1>
              <p className="text-sm text-gray-600">
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </p>
            </div>

            <div className="text-sm text-gray-600">
              {Math.round(progress)}% Complete
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-youth-purple h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Survey Content */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Survey Info */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              {survey.headline || survey.title}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>{survey.author}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>
                Created {new Date(survey.createdDate).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>~{Math.ceil(totalQuestions * 0.5)} min</span>
            </div>
          </div>

          {survey.description && (
            <p className="text-gray-700">{survey.description}</p>
          )}
        </div>

        {/* Question Card */}
        {currentQuestion && (
          <div className="bg-white rounded-lg shadow-sm border p-8">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {currentQuestion.title}
                {currentQuestion.required && (
                  <span className="text-red-500 ml-1">*</span>
                )}
              </h3>
              {currentQuestion.description && (
                <p className="text-gray-600">{currentQuestion.description}</p>
              )}
            </div>

            <div className="mb-8">{renderQuestionInput(currentQuestion)}</div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </button>

              {currentQuestionIndex === totalQuestions - 1 ? (
                <button
                  onClick={handleSubmit}
                  className="flex items-center gap-2 bg-youth-purple text-white px-8 py-3 rounded-lg hover:bg-youth-purple/90 transition-colors"
                >
                  <CheckCircle className="w-4 h-4" />
                  Submit Survey
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 bg-youth-purple text-white px-6 py-3 rounded-lg hover:bg-youth-purple/90 transition-colors"
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Question Navigation */}
        {totalQuestions > 1 && (
          <div className="mt-6 bg-white rounded-lg shadow-sm border p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              Question Navigation
            </h4>
            <div className="flex flex-wrap gap-2">
              {survey.questions.map((_, index) => {
                const isAnswered = responses.some(
                  (r) => r.questionId === survey.questions[index].id,
                );
                const isCurrent = index === currentQuestionIndex;

                return (
                  <button
                    key={index}
                    onClick={() => setCurrentQuestionIndex(index)}
                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                      isCurrent
                        ? "bg-youth-purple text-white"
                        : isAnswered
                          ? "bg-green-100 text-green-800 border border-green-200"
                          : "bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200"
                    }`}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
