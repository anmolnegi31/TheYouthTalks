import { useState } from "react";
import {
  Calendar,
  Clock,
  Users,
  Target,
  ChevronLeft,
  ChevronRight,
  Plus,
} from "lucide-react";
import Layout from "../components/Layout";
import { Link } from "react-router-dom";
import { useForms } from "../contexts/FormsContext";

interface FormEvent {
  id: string;
  title: string;
  time: string;
  type: "draft" | "live" | "upcoming" | "closed";
  responses?: number;
}

interface CalendarDay {
  date: number;
  events: FormEvent[];
  isToday?: boolean;
  isOtherMonth?: boolean;
}

export default function Dashboard() {
  const { forms } = useForms();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Generate calendar days for current month
  const generateCalendarDays = (): CalendarDay[] => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days: CalendarDay[] = [];
    const today = new Date();

    // Generate events from forms context
    const formEvents: { [key: string]: FormEvent[] } = {};

    forms.forEach((form) => {
      // Process start date
      if (form.startDate) {
        const startDate = new Date(form.startDate);
        if (
          startDate.getFullYear() === year &&
          startDate.getMonth() === month
        ) {
          const day = startDate.getDate().toString();
          const time = startDate.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          });

          if (!formEvents[day]) formEvents[day] = [];
          formEvents[day].push({
            id: form.id,
            title: form.title,
            time: time,
            type: form.status,
            responses: form.responses,
          });
        }
      }

      // Process end date for closed forms
      if (form.endDate && form.status === "closed") {
        const endDate = new Date(form.endDate);
        if (endDate.getFullYear() === year && endDate.getMonth() === month) {
          const day = endDate.getDate().toString();
          const time = endDate.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          });

          if (!formEvents[day]) formEvents[day] = [];
          // Only add if not already added for start date
          const existingEvent = formEvents[day].find((e) => e.id === form.id);
          if (!existingEvent) {
            formEvents[day].push({
              id: form.id + "_end",
              title: form.title + " (Ends)",
              time: time,
              type: form.status,
              responses: form.responses,
            });
          }
        }
      }
    });

    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);

      const dateNumber = date.getDate();
      const isToday = date.toDateString() === today.toDateString();
      const isOtherMonth = date.getMonth() !== month;

      days.push({
        date: dateNumber,
        events: formEvents[dateNumber.toString()] || [],
        isToday,
        isOtherMonth,
      });
    }

    return days;
  };

  const calendarDays = generateCalendarDays();

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
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

  // Calculate real stats from forms
  const activeForms = forms.filter(
    (form) => form.status === "live" || form.status === "upcoming",
  ).length;
  const totalResponses = forms.reduce((sum, form) => sum + form.responses, 0);
  const upcomingForms = forms.filter(
    (form) => form.status === "upcoming",
  ).length;
  const thisMonthForms = forms.filter((form) => {
    const formDate = new Date(form.createdDate);
    const now = new Date();
    return (
      formDate.getMonth() === now.getMonth() &&
      formDate.getFullYear() === now.getFullYear()
    );
  }).length;

  const stats = [
    {
      icon: Target,
      label: "Active Forms",
      value: activeForms.toString(),
      change: `${forms.filter((form) => form.status === "live").length} live forms`,
      color: "text-green-600",
    },
    {
      icon: Users,
      label: "Total Responses",
      value: totalResponses.toLocaleString(),
      change: `From ${forms.length} forms`,
      color: "text-blue-600",
    },
    {
      icon: Clock,
      label: "Upcoming Surveys",
      value: upcomingForms.toString(),
      change: upcomingForms > 0 ? "Ready to launch" : "No upcoming forms",
      color: "text-youth-purple",
    },
    {
      icon: Calendar,
      label: "This Month",
      value: thisMonthForms.toString(),
      change: "Forms created",
      color: "text-orange-600",
    },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600">
              Manage your survey schedule and track performance
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-sm border p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`p-2 rounded-lg ${stat.color.replace("text-", "bg-").replace("-600", "-100")}`}
                  >
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 mb-1">
                    {stat.value}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className={`text-xs ${stat.color}`}>{stat.change}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Calendar */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-6 border-b">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Form Schedule
                    </h2>
                    <Link
                      to="/create-form"
                      className="flex items-center gap-2 bg-youth-purple text-white px-4 py-2 rounded-lg hover:bg-youth-purple/90 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Schedule Form
                    </Link>
                  </div>

                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">
                      {months[currentMonth.getMonth()]}{" "}
                      {currentMonth.getFullYear()}
                    </h3>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigateMonth("prev")}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <ChevronLeft className="w-5 h-5 text-gray-600" />
                      </button>
                      <button
                        onClick={() => navigateMonth("next")}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <ChevronRight className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  {/* Calendar Header */}
                  <div className="grid grid-cols-7 gap-1 mb-4">
                    {daysOfWeek.map((day) => (
                      <div
                        key={day}
                        className="text-center text-sm font-medium text-gray-500 py-2"
                      >
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map((day, index) => (
                      <div
                        key={index}
                        className={`min-h-[100px] p-2 border rounded-lg ${
                          day.isToday
                            ? "bg-youth-purple/10 border-youth-purple"
                            : day.isOtherMonth
                              ? "bg-gray-50 text-gray-400"
                              : "bg-white hover:bg-gray-50"
                        } transition-colors cursor-pointer`}
                      >
                        <div
                          className={`text-sm font-medium mb-1 ${
                            day.isToday ? "text-youth-purple" : ""
                          }`}
                        >
                          {day.date}
                        </div>
                        <div className="space-y-1">
                          {day.events.map((event) => (
                            <div
                              key={event.id}
                              className={`text-xs p-1 rounded border ${getEventTypeColor(event.type)} truncate`}
                              title={event.title}
                            >
                              {event.title}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-6 border-b">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Today's Schedule
                  </h3>
                </div>
                <div className="p-6 space-y-4">
                  {(() => {
                    const today = new Date();
                    const todayForms = forms.filter((form) => {
                      if (!form.startDate) return false;
                      const formDate = new Date(form.startDate);
                      return formDate.toDateString() === today.toDateString();
                    });

                    if (todayForms.length === 0) {
                      return (
                        <div className="text-center py-8">
                          <p className="text-gray-500">
                            No forms scheduled for today
                          </p>
                        </div>
                      );
                    }

                    return todayForms.map((form) => {
                      const startTime = new Date(
                        form.startDate,
                      ).toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      });

                      const getStatusColor = (status: string) => {
                        switch (status) {
                          case "live":
                            return "bg-green-50 border-green-200";
                          case "upcoming":
                            return "bg-youth-purple/5 border-youth-purple/20";
                          case "draft":
                            return "bg-yellow-50 border-yellow-200";
                          case "closed":
                            return "bg-gray-50 border-gray-200";
                          default:
                            return "bg-gray-50 border-gray-200";
                        }
                      };

                      const getDotColor = (status: string) => {
                        switch (status) {
                          case "live":
                            return "bg-green-500";
                          case "upcoming":
                            return "bg-youth-purple";
                          case "draft":
                            return "bg-yellow-500";
                          case "closed":
                            return "bg-gray-500";
                          default:
                            return "bg-gray-500";
                        }
                      };

                      const getStatusText = (status: string) => {
                        switch (status) {
                          case "live":
                            return `${form.responses} responses so far`;
                          case "upcoming":
                            return "Starting soon";
                          case "draft":
                            return "Draft - needs publishing";
                          case "closed":
                            return "Completed";
                          default:
                            return "";
                        }
                      };

                      const getTextColor = (status: string) => {
                        switch (status) {
                          case "live":
                            return "text-green-600";
                          case "upcoming":
                            return "text-youth-purple";
                          case "draft":
                            return "text-yellow-600";
                          case "closed":
                            return "text-gray-600";
                          default:
                            return "text-gray-600";
                        }
                      };

                      return (
                        <div
                          key={form.id}
                          className={`flex items-start gap-3 p-3 rounded-lg border ${getStatusColor(form.status)}`}
                        >
                          <div
                            className={`w-2 h-2 rounded-full mt-2 ${getDotColor(form.status)}`}
                          ></div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">
                              {form.title}
                            </p>
                            <p className="text-sm text-gray-600">
                              {startTime} -{" "}
                              {form.status.charAt(0).toUpperCase() +
                                form.status.slice(1)}
                            </p>
                            <p
                              className={`text-sm ${getTextColor(form.status)}`}
                            >
                              {getStatusText(form.status)}
                            </p>
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-6 border-b">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Quick Actions
                  </h3>
                </div>
                <div className="p-6 space-y-3">
                  <Link
                    to="/create-form"
                    className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className="w-8 h-8 bg-youth-purple/10 rounded-lg flex items-center justify-center">
                      <Plus className="w-4 h-4 text-youth-purple" />
                    </div>
                    <span className="font-medium text-gray-900">
                      Create New Form
                    </span>
                  </Link>

                  <Link
                    to="/create-form"
                    className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="font-medium text-gray-900">
                      Schedule Survey
                    </span>
                  </Link>

                  <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <Users className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="font-medium text-gray-900">
                      View Analytics
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
