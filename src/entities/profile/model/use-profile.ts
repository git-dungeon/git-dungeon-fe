import { useQuery } from "@tanstack/react-query";
import { profileQueryOptions } from "@/entities/profile/model/profile-query";

export function useProfile() {
  return useQuery(profileQueryOptions);
}
