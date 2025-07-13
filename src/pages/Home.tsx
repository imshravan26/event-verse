import Hero from "../components/Hero";
import { useState, useEffect } from "react";
import { Search, ChevronDown } from "lucide-react";
import { collection, getDocs, QueryDocumentSnapshot } from "firebase/firestore";
import type { DocumentData } from "firebase/firestore";
import { EventCard } from "../components/EventsCard";
import { db } from "../lib/firebase";

const techEvents = [
  {
    id: 1,
    title: "AI Revolution Summit 2025",
    category: "AI",
    date: "2025-08-15",
    time: "09:00 AM",
    location: "Silicon Valley Convention Center",
    attendees: 1500,
    price: "Free",
    description:
      "Explore the latest breakthroughs in artificial intelligence and machine learning.",
    image:
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=200&fit=crop",
    organizer: "Tech Innovators Inc",
    tags: ["Machine Learning", "Deep Learning", "Neural Networks"],
    rating: 4.8,
  },
  {
    id: 2,
    title: "Web3 Developers Conference",
    category: "Web3",
    date: "2025-09-22",
    time: "10:00 AM",
    location: "Blockchain Hub, New York",
    attendees: 800,
    price: "$299",
    description:
      "Join the decentralized web revolution with hands-on workshops and expert talks.",
    image:
      "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=200&fit=crop",
    organizer: "Crypto Builders",
    tags: ["Blockchain", "DeFi", "NFTs", "Smart Contracts"],
    rating: 4.6,
  },
  {
    id: 3,
    title: "Cloud Computing Expo",
    category: "Cloud Computing",
    date: "2025-07-30",
    time: "08:30 AM",
    location: "AWS Summit Center, Seattle",
    attendees: 2000,
    price: "$149",
    description:
      "Discover cloud strategies, migration techniques, and cutting-edge services.",
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=200&fit=crop",
    organizer: "Cloud Masters",
    tags: ["AWS", "Azure", "GCP", "DevOps"],
    rating: 4.9,
  },
  {
    id: 4,
    title: "Cybersecurity Defense Summit",
    category: "Cybersecurity",
    date: "2025-10-12",
    time: "09:30 AM",
    location: "Security Center, Washington DC",
    attendees: 1200,
    price: "$399",
    description:
      "Learn advanced security strategies and threat detection techniques.",
    image:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=200&fit=crop",
    organizer: "CyberSec Alliance",
    tags: ["Threat Detection", "Encryption", "Network Security"],
    rating: 4.7,
  },
  {
    id: 5,
    title: "IoT Innovation Workshop",
    category: "IoT",
    date: "2025-08-05",
    time: "11:00 AM",
    location: "Smart City Lab, Austin",
    attendees: 600,
    price: "$199",
    description: "Build the future with connected devices and smart systems.",
    image:
      "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=200&fit=crop",
    organizer: "IoT Pioneers",
    tags: ["Smart Devices", "Sensors", "Edge Computing"],
    rating: 4.5,
  },
  {
    id: 6,
    title: "Data Science Bootcamp",
    category: "Data Science",
    date: "2025-09-08",
    time: "09:00 AM",
    location: "Data Center, San Francisco",
    attendees: 900,
    price: "$249",
    description:
      "Master data analysis, visualization, and predictive modeling.",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop",
    organizer: "DataMinds Academy",
    tags: ["Python", "R", "Statistics", "Machine Learning"],
    rating: 4.8,
  },
  {
    id: 7,
    title: "Mobile Development Conference",
    category: "Mobile",
    date: "2025-11-15",
    time: "10:30 AM",
    location: "Mobile Hub, Los Angeles",
    attendees: 1100,
    price: "$179",
    description:
      "Build next-generation mobile applications for iOS and Android.",
    image:
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=200&fit=crop",
    organizer: "Mobile Makers",
    tags: ["React Native", "Flutter", "iOS", "Android"],
    rating: 4.6,
  },
  {
    id: 8,
    title: "DevOps & Infrastructure Summit",
    category: "DevOps",
    date: "2025-08-28",
    time: "08:00 AM",
    location: "Tech Park, Denver",
    attendees: 1300,
    price: "$329",
    description:
      "Streamline your development pipeline with modern DevOps practices.",
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=200&fit=crop",
    organizer: "DevOps Guild",
    tags: ["CI/CD", "Docker", "Kubernetes", "Automation"],
    rating: 4.7,
  },
];

const categories = [
  "all",
  "AI",
  "Web3",
  "Cloud Computing",
  "Cybersecurity",
  "IoT",
  "Data Science",
  "Mobile",
  "DevOps",
];

interface EventData {
  id: string;
  title: string;
  category: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  price: string;
  description: string;
  image: string;
  organizer: string;
  tags: string[];
  rating: number;
}

const Events = () => {
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "events"));
        const eventData = querySnapshot.docs.map(
          (doc: QueryDocumentSnapshot<DocumentData>) =>
            ({
              id: doc.id,
              ...doc.data(),
            } as EventData)
        );
        setEvents(eventData);
      } catch (error) {
        console.error("error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (event.tags || []).some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesCategory =
      selectedCategory === "all" || event.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl text-wrap font-bold mb-4 dark:text-slate-300 text-slate-700 ">
          Discover amazing tech events
        </h1>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search events, categories, or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 
              dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-400
              bg-white border-gray-200 text-gray-800 placeholder-gray-500"
          />
        </div>

        <div className="relative">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="appearance-none px-4 py-3 pr-10 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 
              
                dark:bg-gray-800 dark:border-gray-700 dark:text-white
                bg-white border-gray-200 text-gray-800"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category === "all" ? "All Categories" : category}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-3 h-5 w-5 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}

      {loading && (
        <div className="text-center py-10 text-gray-500 dark:text-gray-400">
          Loading events...
        </div>
      )}
    </div>
  );
};

function Home() {
  return (
    <div className="relative mx-auto my-10 flex max-w-7xl flex-col items-center justify-center">
      <Hero />
      <Events />
    </div>
  );
}

export default Home;
