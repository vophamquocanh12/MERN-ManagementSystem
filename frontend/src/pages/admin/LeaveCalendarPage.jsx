import React, { useEffect, useState } from "react";
import api from "@/services/api";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { toast } from "react-toastify";
import Modal from "react-modal";

Modal.setAppElement("#root");

const LeaveCalendarPage = () => {
  const [leaveEvents, setLeaveEvents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);

  // ✅ Fetch leave events
  const fetchEvents = async () => {
    try {
      const { data } = await api.get("/api/leaves/calendar", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setLeaveEvents(data);
    } catch {
      toast.error("Failed to load calendar data");
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // ✅ Event click handler
  const handleEventClick = (info) => {
    setSelectedLeave(info.event.extendedProps);
    setSelectedLeave((prev) => ({
      ...prev,
      _id: info.event.id,
      title: info.event.title,
      start: info.event.startStr,
      end: info.event.endStr,
    }));
    setModalOpen(true);
  };

  // ✅ Approve/Reject function
  const updateLeaveStatus = async (status) => {
    try {
      await api.put(
        `/api/leaves/${selectedLeave._id}/status`,
        { status },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      toast.success(`Leave ${status.toLowerCase()} successfully`);
      fetchEvents();
      setModalOpen(false);
    } catch {
      toast.error("Failed to update leave status");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">📅 Leave Calendar</h2>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={leaveEvents}
        eventClick={handleEventClick}
        height="auto"
      />

      {/* ✅ Leave Detail Modal */}
      <Modal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        className="bg-white p-6 rounded shadow-md max-w-md mx-auto mt-20"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        {selectedLeave && (
          <>
            <h3 className="text-lg font-bold mb-2">
              {selectedLeave.title}
            </h3>
            <p>
              <strong>Department:</strong> {selectedLeave.department}
            </p>
            <p>
              <strong>Reason:</strong> {selectedLeave.reason}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span className="capitalize">{selectedLeave.status}</span>
            </p>
            <p>
              <strong>Start:</strong> {selectedLeave.start}
            </p>
            <p>
              <strong>End:</strong> {selectedLeave.end}
            </p>

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => updateLeaveStatus("Approved")}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Approve
              </button>
              <button
                onClick={() => updateLeaveStatus("Rejected")}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Reject
              </button>
              <button
                onClick={() => setModalOpen(false)}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
};

export default LeaveCalendarPage;
