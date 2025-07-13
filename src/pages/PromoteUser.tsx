// PromoteUser.tsx
import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  query,
  limit,
  startAfter,
  where,
  updateDoc,
  doc,
  orderBy,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "../components/ui/pagination";
import { useNavigate } from "react-router-dom";

const USERS_PER_PAGE = 10;

interface User {
  id: string;
  email: string;
  role?: string;
  displayName?: string;
  createdAt?: any;
}

const PromoteUser = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [firstDoc, setFirstDoc] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const [isSearchMode, setIsSearchMode] = useState(false);

  const navigate = useNavigate();

  const fetchUsers = async (
    direction: "next" | "prev" | "initial" = "initial",
    startDoc?: any,
    emailFilter?: string
  ) => {
    setLoading(true);
    try {
      const usersRef = collection(db, "users");
      let q;

      if (emailFilter) {
        // Search mode - simple email filter
        q = query(
          usersRef,
          where("email", ">=", emailFilter),
          where("email", "<=", emailFilter + "\uf8ff"),
          limit(USERS_PER_PAGE + 1)
        );
        setIsSearchMode(true);
      } else {
        setIsSearchMode(false);
        // Pagination mode
        if (direction === "next" && startDoc) {
          q = query(
            usersRef,
            orderBy("email"),
            startAfter(startDoc),
            limit(USERS_PER_PAGE + 1)
          );
        } else if (direction === "prev" && startDoc) {
          q = query(usersRef, orderBy("email"), limit(USERS_PER_PAGE + 1));
        } else {
          q = query(usersRef, orderBy("email"), limit(USERS_PER_PAGE + 1));
        }
      }

      const snapshot = await getDocs(q);
      const docs = snapshot.docs;

      // Check if we have more than the page limit
      const hasMore = docs.length > USERS_PER_PAGE;
      const usersToShow = hasMore ? docs.slice(0, USERS_PER_PAGE) : docs;

      const data = usersToShow.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as User[];

      setUsers(data);

      if (usersToShow.length > 0) {
        setFirstDoc(usersToShow[0]);
        setLastDoc(usersToShow[usersToShow.length - 1]);
      }

      // Set pagination states
      if (emailFilter) {
        setHasNextPage(false);
        setHasPrevPage(false);
      } else {
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
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = () => {
    if (search.trim()) {
      setPage(1);
      fetchUsers("initial", undefined, search.trim());
    }
  };

  const handleClearSearch = () => {
    setSearch("");
    setPage(1);
    setIsSearchMode(false);
    fetchUsers("initial");
  };

  const nextPage = () => {
    if (hasNextPage && lastDoc && !isSearchMode) {
      setPage(page + 1);
      fetchUsers("next", lastDoc);
    }
  };

  const prevPage = () => {
    if (hasPrevPage && page > 1 && !isSearchMode) {
      setPage(page - 1);
      // For prev page, we need to fetch from the beginning and skip
      fetchUsers("prev", firstDoc);
    }
  };

  const promoteToAdmin = async (userId: string, userEmail: string) => {
    try {
      await updateDoc(doc(db, "users", userId), {
        role: "admin",
      });

      // Update the local state
      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, role: "admin" } : user
        )
      );

      alert(`✅ User ${userEmail} promoted to admin successfully`);
    } catch (err) {
      console.error("Error promoting user:", err);
      alert("❌ Failed to promote user. Please try again.");
    }
  };

  const demoteFromAdmin = async (userId: string, userEmail: string) => {
    try {
      await updateDoc(doc(db, "users", userId), {
        role: "user",
      });

      // Update the local state
      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, role: "user" } : user
        )
      );

      alert(`✅ User ${userEmail} demoted from admin successfully`);
    } catch (err) {
      console.error("Error demoting user:", err);
      alert("❌ Failed to demote user. Please try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Promote User to Admin</h1>
        <Button onClick={() => navigate("/admin")} variant="outline">
          Back to Dashboard
        </Button>
      </div>

      {/* Search Section */}
      <div className=" p-4 rounded-lg shadow-md">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search by email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
          <Button onClick={handleSearch} disabled={!search.trim()}>
            Search
          </Button>
          {isSearchMode && (
            <Button onClick={handleClearSearch} variant="outline">
              Clear Search
            </Button>
          )}
        </div>
      </div>

      {/* Loading State */}
      {loading && <p className="text-center py-4">Loading users...</p>}

      {/* No Users Found */}
      {!loading && users.length === 0 && (
        <p className="text-center py-4 text-gray-500">
          {isSearchMode
            ? "No users found matching your search."
            : "No users found."}
        </p>
      )}

      {/* Users List */}
      {!loading && users.length > 0 && (
        <div className="space-y-3">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between border rounded-lg px-4 py-3  shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex-1">
                <p className="font-semibold">{user.email}</p>
                <div className="flex items-center gap-4 mt-1">
                  <span className="text-sm text-gray-600">
                    Role:{" "}
                    <span
                      className={`font-medium ${
                        user.role === "admin"
                          ? "text-green-600"
                          : "text-blue-600"
                      }`}
                    >
                      {user.role || "user"}
                    </span>
                  </span>
                  {user.displayName && (
                    <span className="text-sm text-gray-600">
                      Name: {user.displayName}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                {user.role === "admin" ? (
                  <Button
                    onClick={() => demoteFromAdmin(user.id, user.email)}
                    variant="outline"
                    size="sm"
                  >
                    Demote
                  </Button>
                ) : (
                  <Button
                    onClick={() => promoteToAdmin(user.id, user.email)}
                    size="sm"
                  >
                    Promote
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && users.length > 0 && !isSearchMode && (
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
  );
};

export default PromoteUser;
