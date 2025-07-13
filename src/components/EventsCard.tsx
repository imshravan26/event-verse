import { Calendar, MapPin, Users, Clock, Star } from "lucide-react";
import { Link } from "react-router-dom";

interface Event {
  id: string;
  image: string;
  title: string;
  category: string;
  price: string;
  description: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  rating: number;
  tags: string[];
}

interface EventCardProps {
  event: Event;
}

export const EventCard = ({ event }: EventCardProps) => (
  <div
    className="rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 
      dark:bg-gray-800 dark:text-white bg-white text-gray-800"
  >
    <div className="relative">
      <img
        src={event.image}
        alt={event.title}
        className="w-full h-48 object-cover"
      />
      <div className="absolute top-4 right-4">
        <span
          className="px-3 py-1 rounded-full text-xs font-semibold 
            dark:bg-blue-600 dark:text-white bg-blue-100 text-blue-800"
        >
          {event.category}
        </span>
      </div>
      <div className="absolute bottom-4 left-4">
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold ${
            event.price === "Free"
              ? "bg-green-500 text-white"
              : "bg-orange-500 text-white"
          }`}
        >
          {event.price}
        </span>
      </div>
    </div>

    <div className="p-6">
      <h3 className="text-xl font-bold mb-2 line-clamp-2">{event.title}</h3>
      <p
        className="text-sm mb-4 line-clamp-2
          dark:text-gray-300 dakr:text-gray-600"
      >
        {event.description}
      </p>

      <div className="flex items-center mb-3">
        <Calendar className="w-4 h-4 mr-2 text-blue-500" />
        <span className="text-sm">{event.date}</span>
        <Clock className="w-4 h-4 ml-4 mr-2 text-blue-500" />
        <span className="text-sm">{event.time}</span>
      </div>

      <div className="flex items-center mb-3">
        <MapPin className="w-4 h-4 mr-2 text-red-500" />
        <span className="text-sm">{event.location}</span>
      </div>

      <div className="flex items-center mb-4">
        <Users className="w-4 h-4 mr-2 text-green-500" />
        <span className="text-sm">{event.attendees} attendees</span>
        <Star className="w-4 h-4 ml-4 mr-1 text-yellow-500" />
        <span className="text-sm">{event.rating}</span>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {event.tags.slice(0, 3).map((tag, index) => (
          <span
            key={index}
            className="px-2 py-1 rounded-full text-xs dark:bg-gray-700 dark:text-gray-300 bg-gray-100 text-gray-600"
          >
            {tag}
          </span>
        ))}
      </div>
      <Link to={`/event/${event.id}`}>
        <button className="w-full py-3 rounded-lg font-semibold transition-all duration-200 bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 active:scale-95">
          Explore
        </button>
      </Link>
    </div>
  </div>
);
