// AdminEventForm.tsx
import { useForm } from "react-hook-form";
import { collection, doc, setDoc, addDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

interface EventFormData {
  title: string;
  description: string;
  date: string;
  location: string;
  image: string;
  category: string;
  price: string;
}

interface AdminEventFormProps {
  defaultValues?: EventFormData;
  eventId?: string;
  onEventCreated?: () => void; // Callback to refresh the events list
}

const AdminEventForm: React.FC<AdminEventFormProps> = ({
  defaultValues,
  eventId,
  onEventCreated,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EventFormData>({
    defaultValues: defaultValues || {
      title: "",
      description: "",
      date: "",
      location: "",
      image: "",
      category: "",
      price: "Free",
    },
  });

  const onSubmit = async (data: EventFormData) => {
    setIsSubmitting(true);
    try {
      if (eventId) {
        // Editing existing event
        const ref = doc(db, "events", eventId);
        await setDoc(
          ref,
          {
            ...data,
            updatedAt: new Date(),
          },
          { merge: true }
        );
        alert("✅ Event updated successfully");
      } else {
        // Creating new event
        await addDoc(collection(db, "events"), {
          ...data,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        alert("✅ Event created successfully");
        reset(); // Reset form after successful creation
      }

      // Call the callback to refresh the events list
      if (onEventCreated) {
        onEventCreated();
      }
    } catch (error) {
      console.error("❌ Error saving event:", error);
      alert("Failed to save event. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Title *</label>
          <Input
            type="text"
            {...register("title", {
              required: "Title is required",
              minLength: {
                value: 3,
                message: "Title must be at least 3 characters",
              },
            })}
            placeholder="Enter event title"
            className={errors.title ? "border-red-500" : ""}
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Category *</label>
          <Input
            type="text"
            {...register("category", { required: "Category is required" })}
            placeholder="e.g., Music, Sports, Technology"
            className={errors.category ? "border-red-500" : ""}
          />
          {errors.category && (
            <p className="text-red-500 text-sm mt-1">
              {errors.category.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Description *</label>
        <textarea
          {...register("description", {
            required: "Description is required",
            minLength: {
              value: 10,
              message: "Description must be at least 10 characters",
            },
          })}
          placeholder="Describe your event..."
          rows={4}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.description ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Date & Time *
          </label>
          <Input
            type="datetime-local"
            {...register("date", { required: "Date is required" })}
            className={errors.date ? "border-red-500" : ""}
          />
          {errors.date && (
            <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Location *</label>
          <Input
            type="text"
            {...register("location", { required: "Location is required" })}
            placeholder="Event venue or address"
            className={errors.location ? "border-red-500" : ""}
          />
          {errors.location && (
            <p className="text-red-500 text-sm mt-1">
              {errors.location.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Image URL *</label>
          <Input
            type="url"
            {...register("image", {
              required: "Image URL is required",
              pattern: {
                value: /^https?:\/\/.+/,
                message: "Please enter a valid URL",
              },
            })}
            placeholder="https://example.com/image.jpg"
            className={errors.image ? "border-red-500" : ""}
          />
          {errors.image && (
            <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Price *</label>
          <Input
            type="text"
            {...register("price", { required: "Price is required" })}
            placeholder="Free, $10, $25, etc."
            className={errors.price ? "border-red-500" : ""}
          />
          {errors.price && (
            <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
          )}
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? (
          <>
            <span className="mr-2">⏳</span>
            {eventId ? "Updating..." : "Creating..."}
          </>
        ) : eventId ? (
          "Update Event"
        ) : (
          "Create Event"
        )}
      </Button>
    </form>
  );
};

export default AdminEventForm;
