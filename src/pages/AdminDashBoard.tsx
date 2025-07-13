// AdminDashboard.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  getDocs,
  orderBy,
  query,
  limit,
  startAfter,
  endBefore,
  limitToLast,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { Button } from "../components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "../components/ui/pagination";
import AdminEventForm from "../components/AdminEventForm";

const EVENTS_PER_PAGE = 10;

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  image: string;
  category: string;
  price: string;
  createdAt: any;
}

const AdminDashboard = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [firstDoc, setFirstDoc] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [hasPrevPage, setHasPrevPage] = useState(false);

  const navigate = useNavigate();

  const fetchEvents = async (
    direction: "next" | "prev" | "initial" = "initial",
    startDoc?: any
  ) => {
    setLoading(true);
    try {
      const eventRef = collection(db, "events");
      let q;

      if (direction === "next" && startDoc) {
        q = query(
          eventRef,
          orderBy("createdAt", "desc"),
          startAfter(startDoc),
          limit(EVENTS_PER_PAGE + 1) // Get one extra to check if there's a next page
        );
      } else if (direction === "prev" && startDoc) {
        q = query(
          eventRef,
          orderBy("createdAt", "desc"),
          endBefore(startDoc),
          limitToLast(EVENTS_PER_PAGE + 1) // Get one extra to check if there's a prev page
        );
      } else {
        q = query(
          eventRef,
          orderBy("createdAt", "desc"),
          limit(EVENTS_PER_PAGE + 1)
        );
      }

      const snapshot = await getDocs(q);
      const docs = snapshot.docs;

      // Check if we have more than the page limit
      const hasMore = docs.length > EVENTS_PER_PAGE;
      const eventsToShow = hasMore ? docs.slice(0, EVENTS_PER_PAGE) : docs;

      const data = eventsToShow.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Event[];

      setEvents(data);

      if (eventsToShow.length > 0) {
        setFirstDoc(eventsToShow[0]);
        setLastDoc(eventsToShow[eventsToShow.length - 1]);
      }

      // Set pagination states
      if (direction === "next") {
        setHasNextPage(hasMore);
        setHasPrevPage(true);
      } else if (direction === "prev") {
        setHasPrevPage(page > 2);
        setHasNextPage(true);
      } else {
        setHasNextPage(hasMore);
        setHasPrevPage(false);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const nextPage = () => {
    if (hasNextPage && lastDoc) {
      setPage(page + 1);
      fetchEvents("next", lastDoc);
    }
  };

  const prevPage = () => {
    if (hasPrevPage && firstDoc) {
      setPage(page - 1);
      fetchEvents("prev", firstDoc);
    }
  };

  const refreshEvents = () => {
    setPage(1);
    setHasPrevPage(false);
    fetchEvents("initial");
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-8">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      {/* Add Event Form */}
      <div className="border-white border-2 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Create New Event</h2>
        <AdminEventForm onEventCreated={refreshEvents} />
      </div>

      {/* Event List */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">All Events</h2>
          <Button onClick={refreshEvents} variant="outline">
            Refresh
          </Button>
        </div>

        {loading && <p className="text-center py-4">Loading events...</p>}

        {!loading && events.length === 0 && (
          <p className="text-center py-4 text-gray-500">No events found.</p>
        )}

        {!loading && events.length > 0 && (
          <div className="grid gap-4">
            {events.map((event) => (
              <div
                key={event.id}
                className="border rounded-lg p-4 shadow hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{event.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {event.description}
                    </p>
                    <div className="flex gap-4 mt-2 text-sm text-gray-500">
                      <span>
                        📅 {new Date(event.date).toLocaleDateString()}
                      </span>
                      <span>📍 {event.location}</span>
                      <span>🏷️ {event.category}</span>
                      <span>💰 {event.price}</span>
                    </div>
                  </div>
                  {event.image && (
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-20 h-20 object-cover rounded-md ml-4"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && events.length > 0 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={prevPage}
                  className={
                    !hasPrevPage
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                  size={undefined}
                />
              </PaginationItem>
              <PaginationItem>
                <span className="px-4 py-2 text-sm">Page {page}</span>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  onClick={nextPage}
                  className={
                    !hasNextPage
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                  size={undefined}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>

      <Button
        onClick={() => navigate("/admin/promote")}
        className="bg-green-600 hover:bg-green-700"
      >
        Make Admin
      </Button>
    </div>
  );
};

export default AdminDashboard;
