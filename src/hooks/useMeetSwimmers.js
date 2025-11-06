import { useQuery } from "@tanstack/react-query";

export function useMeetSwimmers(meetId) {
  const { data: swimmersData, isLoading: loadingSwimmers } = useQuery({
    queryKey: ["meet-swimmers", meetId],
    queryFn: async () => {
      if (!meetId) return { swimmers: [] };
      const response = await fetch(`/api/meets/${meetId}/swimmers`);
      if (!response.ok) {
        throw new Error("Failed to fetch swimmers");
      }
      return response.json();
    },
    enabled: !!meetId,
  });

  return {
    swimmers: swimmersData?.swimmers || [],
    loadingSwimmers,
  };
}
