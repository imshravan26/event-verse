import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { db, auth } from "../lib/firebase";

interface EventType {
  image: string;
  title: string;
  date: string;
  description: string;
  location: string;
}

const Event: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<EventType | null>(null);
  const [user] = useAuthState(auth);
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch event data
  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return;
      const docRef = doc(db, "events", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setEvent(docSnap.data() as EventType);
      } else {
        console.log("No such event with ID:", id);
      }
    };

    fetchEvent();
  }, [id]);

  // Check registration
  useEffect(() => {
    const checkRegistration = async () => {
      if (!user || !id) return;

      const registrationsRef = collection(db, "registrations");
      const q = query(
        registrationsRef,
        where("userId", "==", user.uid),
        where("eventId", "==", id)
      );
      const querySnapshot = await getDocs(q);
      setIsRegistered(!querySnapshot.empty);
    };

    checkRegistration();
  }, [user, id]);

  // Register button handler
  const handleRegister = async () => {
    if (!user || !id) return alert("Please log in to register.");
    if (isRegistered) return;

    try {
      await addDoc(collection(db, "registrations"), {
        userId: user.uid,
        eventId: id,
        registeredAt: new Date(),
      });
      setIsRegistered(true);
      alert("✅ Registered successfully!");
    } catch (err) {
      console.error("Registration error:", err);
      alert("Something went wrong during registration.");
    }
  };

  if (!event) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto mt-6 p-4">
      <img
        src={event.image}
        alt={event.title}
        className="rounded-lg w-full h-64 object-cover"
      />
      <h1 className="text-3xl font-bold mt-4">{event.title}</h1>
      <p className="text-gray-500">{new Date(event.date).toLocaleString()}</p>
      <p className="mt-4 text-lg">{event.description}</p>
      <p className="mt-2 text-sm text-gray-600">Location: {event.location}</p>

      <button
        onClick={handleRegister}
        disabled={isRegistered}
        className={`mt-6 px-6 py-2 text-white rounded ${
          isRegistered
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {isRegistered ? "Already Registered" : "Register"}
      </button>
    </div>
  );
};

export default Event;
