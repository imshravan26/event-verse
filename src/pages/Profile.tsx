import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../lib/firebase";
import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";

interface RegisteredEvent {
  id: string;
  title: string;
  date: string;
  image: string;
  location: string;
}

const Profile = () => {
  const [user] = useAuthState(auth);
  const [registeredEvents, setRegisteredEvents] = useState<RegisteredEvent[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRegisteredEvents = async () => {
      if (!user) return;

      try {
        const registrationsRef = collection(db, "registrations");
        const q = query(registrationsRef, where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);

        const eventsData: RegisteredEvent[] = [];

        for (const regDoc of querySnapshot.docs) {
          const { eventId } = regDoc.data();
          const eventRef = doc(db, "events", eventId);
          const eventSnap = await getDoc(eventRef);

          if (eventSnap.exists()) {
            const event = eventSnap.data();
            eventsData.push({
              id: eventId,
              title: event.title,
              date: event.date,
              image: event.image,
              location: event.location,
            });
          }
        }

        setRegisteredEvents(eventsData);
      } catch (err) {
        console.error("Error fetching registered events:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRegisteredEvents();
  }, [user]);
  if (!user)
    return (
      <div className="text-center py-10">
        Please log in to view your profile.
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Your Registered Events</h1>

      {loading ? (
        <p>Loading...</p>
      ) : registeredEvents.length === 0 ? (
        <p>You haven't registered for any events yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {registeredEvents.map((event) => (
            <a
              key={event.id}
              href={`/event/${event.id}`}
              className="border rounded-lg p-4 hover:shadow-lg transition"
            >
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-40 object-cover rounded"
              />
              <h2 className="text-xl font-semibold mt-2">{event.title}</h2>
              <p className="text-sm text-gray-600">
                {new Date(event.date).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-500">{event.location}</p>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;
