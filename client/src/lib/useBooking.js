import { useState, useCallback } from "react";
import apiRequest from "../lib/apiRequest";

export const useBooking = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const createBooking = useCallback(async (bookingData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiRequest.post("/bookings", bookingData);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Rezervarea a eșuat";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const cancelBooking = useCallback(async (bookingId) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiRequest.delete(`/bookings/${bookingId}`);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Anularea a eșuat";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getUserBookings = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiRequest.get("/bookings/user-bookings");
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Nu s-au putut încărca rezervările";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getBookedDates = useCallback(async (postId) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiRequest.get(`/bookings/booked-dates/${postId}`);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Nu s-au putut încărca datele rezervate";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const checkAvailability = useCallback(
    async (postId, checkInDate, checkOutDate) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await apiRequest.get(
          `/bookings/check-availability/${postId}?checkInDate=${checkInDate}&checkOutDate=${checkOutDate}`
        );
        return { success: true, data: response.data };
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Verificarea disponibilității a eșuat";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    isLoading,
    error,
    createBooking,
    cancelBooking,
    getUserBookings,
    getBookedDates,
    checkAvailability,
  };
};
