export interface Event {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  imageUrl: string;
  date: string;
  time: string;
  endTime: string;
  location: string;
  venue: string;
  category: string;
  price: number;
  isFree: boolean;
  availableTickets: number;
  totalTickets: number;
  organizer: {
    name: string;
    email: string;
    avatar: string;
  };
  tags: string[];
  featured: boolean;
  registrationDeadline: string;
}

export const sampleEvents: Event[] = [
  {
    id: "1",
    title: "Tech Summit 2024",
    description:
      "Annual technology conference featuring industry leaders and innovation showcase",
    longDescription:
      "Join us for the most anticipated technology conference of the year. Experience cutting-edge presentations, hands-on workshops, and networking opportunities with industry pioneers. This summit will cover AI, blockchain, cybersecurity, and emerging technologies shaping our future.",
    imageUrl:
      "https://images.pexels.com/photos/2608517/pexels-photo-2608517.jpeg?auto=compress&cs=tinysrgb&w=800",
    date: "2024-02-15",
    time: "09:00",
    endTime: "18:00",
    location: "San Francisco, CA",
    venue: "Convention Center Hall A",
    category: "Technical",
    price: 150,
    isFree: false,
    availableTickets: 45,
    totalTickets: 500,
    organizer: {
      name: "Tech Society",
      email: "hello@techsociety.com",
      avatar:
        "https://images.pexels.com/photos/2381069/pexels-photo-2381069.jpeg?auto=compress&cs=tinysrgb&w=150",
    },
    tags: ["Technology", "AI", "Blockchain", "Networking"],
    featured: true,
    registrationDeadline: "2024-02-10",
  },
  {
    id: "2",
    title: "Spring Music Festival",
    description: "Live performances by popular bands and emerging artists",
    longDescription:
      "Experience an unforgettable evening of music with performances from top artists and emerging talent. The festival features multiple stages, food vendors, and interactive experiences. From rock to electronic, jazz to indie - there's something for every music lover.",
    imageUrl:
      "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=800",
    date: "2024-03-22",
    time: "14:00",
    endTime: "23:00",
    location: "Austin, TX",
    venue: "Outdoor Amphitheater",
    category: "Cultural",
    price: 75,
    isFree: false,
    availableTickets: 150,
    totalTickets: 2000,
    organizer: {
      name: "Music Club",
      email: "events@musicclub.edu",
      avatar:
        "https://images.pexels.com/photos/1181373/pexels-photo-1181373.jpeg?auto=compress&cs=tinysrgb&w=150",
    },
    tags: ["Music", "Live Performance", "Festival", "Outdoor"],
    featured: true,
    registrationDeadline: "2024-03-15",
  },
  {
    id: "3",
    title: "Career Fair 2024",
    description:
      "Connect with leading companies and explore career opportunities",
    longDescription:
      "The largest career fair of the year brings together top employers from various industries. Attend workshops on resume building, interview skills, and professional networking. Perfect opportunity for students and recent graduates to launch their careers.",
    imageUrl:
      "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800",
    date: "2024-02-28",
    time: "10:00",
    endTime: "16:00",
    location: "New York, NY",
    venue: "Student Union Building",
    category: "Academic",
    price: 0,
    isFree: true,
    availableTickets: 200,
    totalTickets: 1000,
    organizer: {
      name: "Career Services",
      email: "career@university.edu",
      avatar:
        "https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=150",
    },
    tags: ["Career", "Professional", "Networking", "Free"],
    featured: false,
    registrationDeadline: "2024-02-25",
  },
  {
    id: "4",
    title: "Basketball Championship",
    description: "Annual inter-college basketball tournament finals",
    longDescription:
      "The most exciting basketball event of the year featuring top college teams competing for the championship title. Experience the thrill of competitive sports with live commentary, cheerleading performances, and interactive fan zones.",
    imageUrl:
      "https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=800",
    date: "2024-03-10",
    time: "18:00",
    endTime: "21:00",
    location: "Los Angeles, CA",
    venue: "Sports Arena",
    category: "Sports",
    price: 25,
    isFree: false,
    availableTickets: 300,
    totalTickets: 5000,
    organizer: {
      name: "Athletic Department",
      email: "sports@college.edu",
      avatar:
        "https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=150",
    },
    tags: ["Basketball", "Sports", "Championship", "Competition"],
    featured: true,
    registrationDeadline: "2024-03-05",
  },
  {
    id: "5",
    title: "Art Exhibition Opening",
    description:
      "Contemporary art showcase featuring student and professional artists",
    longDescription:
      "Discover incredible artwork from talented students and established artists. The exhibition features paintings, sculptures, digital art, and interactive installations. Join us for the opening reception with wine, music, and artist talks.",
    imageUrl:
      "https://images.pexels.com/photos/1194420/pexels-photo-1194420.jpeg?auto=compress&cs=tinysrgb&w=800",
    date: "2024-02-18",
    time: "19:00",
    endTime: "22:00",
    location: "Boston, MA",
    venue: "University Art Gallery",
    category: "Cultural",
    price: 15,
    isFree: false,
    availableTickets: 80,
    totalTickets: 150,
    organizer: {
      name: "Art Department",
      email: "art@university.edu",
      avatar:
        "https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg?auto=compress&cs=tinysrgb&w=150",
    },
    tags: ["Art", "Exhibition", "Culture", "Opening"],
    featured: false,
    registrationDeadline: "2024-02-15",
  },
  {
    id: "6",
    title: "Startup Pitch Competition",
    description:
      "Student entrepreneurs present their innovative business ideas",
    longDescription:
      "Watch as the next generation of entrepreneurs pitch their revolutionary ideas to a panel of industry experts and investors. Winners receive funding, mentorship, and resources to launch their startups. Network with fellow entrepreneurs and industry leaders.",
    imageUrl:
      "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=800",
    date: "2024-03-05",
    time: "13:00",
    endTime: "17:00",
    location: "Seattle, WA",
    venue: "Innovation Hub",
    category: "Technical",
    price: 30,
    isFree: false,
    availableTickets: 120,
    totalTickets: 250,
    organizer: {
      name: "Entrepreneurship Club",
      email: "startup@college.edu",
      avatar:
        "https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=150",
    },
    tags: ["Startup", "Entrepreneurship", "Pitch", "Competition"],
    featured: true,
    registrationDeadline: "2024-03-01",
  },
];

export const categories = [
  "All",
  "Academic",
  "Cultural",
  "Sports",
  "Technical",
  "Social",
  "Workshop",
];
