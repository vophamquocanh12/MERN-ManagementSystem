// src/components/leave/LeaveCalendar.jsx

import React, { useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import Modal from "react-modal";
import api from "@/services/api";
import { format, parse, startOfWeek, getDay } from "date-fns";
import enGB from "date-fns/locale/en-GB";
import "react-big-calendar/lib/css/react-big-calendar.css";
import useAuth from "../../context/AuthContext"; // 👈 Adjust path if needed

const locales = { 'en-GB': enGB };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

const LeaveCalendar = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [modalData, setModalData] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      const res = await api.get("/api/leaves/calendar", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setEvents(res.data);
    };
    fetchEvents();
  }, []);

  const handleEventClick = (event) => {
    setModalData(event);
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      await api.put(`/api/leaves/${modalData.id}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      // Update UI
      setEvents((prev) =>
        prev.map((e) =>
          e.id === modalData.id ? { ...e, status: newStatus } : e
        )
      );
      setModalData(null);
    } catch (err) {
      console.error("Failed to update leave status", err);
    }
  };

  return (
    <div className="bg-white p-4 shadow rounded">
      <h3 className="text-lg font-semibold mb-3">Leave Calendar</h3>

      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        titleAccessor="title"
        style={{ height: 500 }}
        onSelectEvent={handleEventClick}
      />

      <Modal
        isOpen={!!modalData}
        onRequestClose={() => setModalData(null)}
        ariaHideApp={false}
        className="max-w-md mx-auto mt-20 bg-white p-6 rounded shadow"
        overlayClassName="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center"
      >
        {modalData && (
          <>
            <h4 className="text-xl font-semibold mb-2">Leave Details</h4>
            <p><strong>Name:</strong> {modalData.title}</p>
            <p><strong>Status:</strong> {modalData.status}</p>
            <p><strong>Start:</strong> {new Date(modalData.start).toLocaleDateString()}</p>
            <p><strong>End:</strong> {new Date(modalData.end).toLocaleDateString()}</p>
            {modalData.reason && <p><strong>Reason:</strong> {modalData.reason}</p>}
            {modalData.department && <p><strong>Department:</strong> {modalData.department}</p>}

            {/* ✅ Admin Approval Buttons */}
            {user?.role === "admin" && modalData.status === "Pending" && (
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => handleStatusUpdate("Approved")}
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleStatusUpdate("Rejected")}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Reject
                </button>
              </div>
            )}

            <button
              onClick={() => setModalData(null)}
              className="mt-4 px-4 py-2 bg-gray-600 text-white rounded"
            >
              Close
            </button>
          </>
        )}
      </Modal>
    </div>
  );
};

export default LeaveCalendar;
