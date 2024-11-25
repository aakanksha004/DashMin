import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Modal from "../components/Modal.js"; // Assuming you have a modal component

const localizer = momentLocalizer(moment);

const CalendarComponent = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [eventStart, setEventStart] = useState("");
  const [eventEnd, setEventEnd] = useState("");

  // Load events from localStorage when the component mounts
  useEffect(() => {
    const savedEvents = JSON.parse(localStorage.getItem("events")) || [];
    setEvents(savedEvents);
  }, []);

  // Save events to localStorage whenever events change
  useEffect(() => {
    if (events.length) {
      localStorage.setItem("events", JSON.stringify(events));
    }
  }, [events]);

  // Handle selecting a slot to add an event
  const handleSelectSlot = ({ start, end }) => {
    setEventStart(start);
    setEventEnd(end);
    setIsModalOpen(true);
  };

  // Handle selecting an event for editing
  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setEventTitle(event.title);
    setEventStart(event.start);
    setEventEnd(event.end);
    setIsModalOpen(true);
  };

  // Submit the event (either add new or update existing event)
  const handleEventSubmit = () => {
    const newEvent = {
      title: eventTitle,
      start: eventStart,
      end: eventEnd,
    };

    if (selectedEvent) {
      // Edit existing event
      setEvents(events.map((e) => (e === selectedEvent ? newEvent : e)));
    } else {
      // Add new event
      setEvents([...events, newEvent]);
    }

    setIsModalOpen(false);
    setEventTitle("");
    setEventStart("");
    setEventEnd("");
    setSelectedEvent(null);
  };

  // Handle deleting an event
  const handleDeleteEvent = () => {
    const updatedEvents = events.filter((e) => e !== selectedEvent);
    setEvents(updatedEvents);
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  return (
    <div className="flex justify-center ml-8 sm:ml-12 lg:ml-16">
      <div className="w-full sm:w-full lg:w-11/12">
        <h3 className="text-2xl font-bold text-center mb-6">Calendar</h3>
        <div className="w-full">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{
              height: "75vh",
              width: "100%",
            }}
            selectable
            onSelectSlot={handleSelectSlot}
            onSelectEvent={handleSelectEvent}
            eventPropGetter={(event) => ({
              className: "rbc-event-custom",
            })}
          />
        </div>
      </div>

      {/* Modal for adding/editing events */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="space-y-4">
          <h4 className="text-xl font-semibold">{selectedEvent ? "Edit Event" : "Add New Event"}</h4>
          <input
            type="text"
            value={eventTitle}
            onChange={(e) => setEventTitle(e.target.value)}
            placeholder="Event Title"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <div>
            <label className="block font-medium">Start Time: </label>
            <input
              type="datetime-local"
              value={eventStart ? moment(eventStart).format("YYYY-MM-DDTHH:mm") : ""}
              onChange={(e) => setEventStart(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div>
            <label className="block font-medium">End Time: </label>
            <input
              type="datetime-local"
              value={eventEnd ? moment(eventEnd).format("YYYY-MM-DDTHH:mm") : ""}
              onChange={(e) => setEventEnd(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div className="text-center space-x-4">
            <button
              onClick={handleEventSubmit}
              className="bg-teal-600 text-white px-6 py-2 rounded-md hover:bg-teal-700 transition"
            >
              {selectedEvent ? "Update Event" : "Add Event"}
            </button>
            {selectedEvent && (
              <button
                onClick={handleDeleteEvent}
                className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition"
              >
                Delete Event
              </button>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CalendarComponent;


