import type { Teacher } from "@/types";

export const filterTeachers = (teachers: Teacher[], search: string) => {
  if (!search.trim()) return teachers;

  const searchLower = search.toLowerCase();

  return teachers.filter(
    (t) =>
      t.fullName.toLowerCase().includes(searchLower) ||
      t.email.toLowerCase().includes(searchLower) ||
      t.phoneNumber.includes(search),
  );
};
