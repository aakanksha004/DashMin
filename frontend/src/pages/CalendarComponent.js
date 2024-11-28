import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Modal from "../components/Modal.js";

const localizer = momentLocalizer(moment);

const CalendarComponent = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [eventStart, setEventStart] = useState("");
  const [eventEnd, setEventEnd] = useState("");
  const [currentView, setCurrentView] = useState(Views.MONTH);

  useEffect(() => {
    loadEventsFromStorage();
  }, []);

  const loadEventsFromStorage = () => {
    try {
      const savedEvents = localStorage.getItem("events");
      if (savedEvents) {
        const parsedEvents = JSON.parse(savedEvents).map(event => ({
          ...event,
          id: event.id || Math.random().toString(36).substr(2, 9),
          // Convert stored ISO strings back to Date objects
          start: moment(event.start).toDate(),
          end: moment(event.end).toDate()
        }));
        setEvents(parsedEvents);
      }
    } catch (error) {
      console.error("Error loading events:", error);
      localStorage.removeItem("events");
      setEvents([]);
    }
  };

  const saveEventsToStorage = (updatedEvents) => {
    try {
      // Convert Date objects to ISO strings for storage
      const eventsToStore = updatedEvents.map(event => ({
        ...event,
        start: moment(event.start).toISOString(),
        end: moment(event.end).toISOString()
      }));
      localStorage.setItem("events", JSON.stringify(eventsToStore));
    } catch (error) {
      console.error("Error saving events:", error);
    }
  };

  const handleSelectSlot = ({ start, end }) => {
    // For month view, set default times (9 AM to 10 AM)
    let startDate = moment(start);
    let endDate = moment(end);

    if (currentView === Views.MONTH) {
      startDate = startDate.hours(9).minutes(0).seconds(0);
      endDate = moment(startDate).add(1, 'hour');
    }

    setEventStart(startDate.toDate());
    setEventEnd(endDate.toDate());
    setSelectedEvent(null);
    setEventTitle("");
    setIsModalOpen(true);
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setEventTitle(event.title);
    setEventStart(event.start);
    setEventEnd(event.end);
    setIsModalOpen(true);
  };

  const handleEventSubmit = () => {
    if (!eventTitle.trim()) {
      alert("Please enter an event title");
      return;
    }

    const startMoment = moment(eventStart);
    const endMoment = moment(eventEnd);

    if (!startMoment.isValid() || !endMoment.isValid()) {
      alert("Please enter valid dates");
      return;
    }

    if (endMoment.isSameOrBefore(startMoment)) {
      alert("End time must be after start time");
      return;
    }

    const newEvent = {
      id: selectedEvent?.id || Math.random().toString(36).substr(2, 9),
      title: eventTitle.trim(),
      start: startMoment.toDate(),
      end: endMoment.toDate()
    };

    let updatedEvents;
    if (selectedEvent) {
      updatedEvents = events.map((e) => (e.id === selectedEvent.id ? newEvent : e));
    } else {
      updatedEvents = [...events, newEvent];
    }

    setEvents(updatedEvents);
    saveEventsToStorage(updatedEvents);
    handleCloseModal();
  };

  const handleDeleteEvent = () => {
    if (!selectedEvent?.id) return;
    
    const updatedEvents = events.filter((e) => e.id !== selectedEvent.id);
    setEvents(updatedEvents);
    saveEventsToStorage(updatedEvents);
    handleCloseModal();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEventTitle("");
    setEventStart("");
    setEventEnd("");
    setSelectedEvent(null);
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  return (
    <div className="flex justify-center ml-8 sm:ml-12 lg:ml-16">
      <div className="w-full sm:w-full lg:w-11/12">
        <h3 className="text-2xl font-bold text-center mb-6">Calendar</h3>
        <div className="w-full h-[75vh] bg-white">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            defaultDate={new Date()}
            views={["month", "week", "day"]}
            defaultView={Views.MONTH}
            onView={handleViewChange}
            view={currentView}
            selectable
            onSelectSlot={handleSelectSlot}
            onSelectEvent={handleSelectEvent}
            toolbar={true}
            style={{ height: "100%" }}
            timeslots={2}
            step={30}
            min={moment().hours(0).minutes(0).toDate()}
            max={moment().hours(23).minutes(59).toDate()}
            formats={{
              timeGutterFormat: 'HH:mm',
              eventTimeRangeFormat: ({ start, end }, culture, localizer) =>
                `${localizer.format(start, 'HH:mm', culture)} - ${localizer.format(end, 'HH:mm', culture)}`
            }}
            eventPropGetter={() => ({
              style: {
                backgroundColor: "#0d9488",
                border: "none",
                borderRadius: "4px",
                color: "white"
              }
            })}
            dayPropGetter={() => ({
              style: {
                backgroundColor: "white"
              }
            })}
          />
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <div className="space-y-4">
          <h4 className="text-xl font-semibold">
            {selectedEvent ? "Edit Event" : "Add New Event"}
          </h4>
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
              onChange={(e) => setEventStart(new Date(e.target.value))}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div>
            <label className="block font-medium">End Time: </label>
            <input
              type="datetime-local"
              value={eventEnd ? moment(eventEnd).format("YYYY-MM-DDTHH:mm") : ""}
              onChange={(e) => setEventEnd(new Date(e.target.value))}
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