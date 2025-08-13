import { create } from "zustand"

interface UserProfile {
  id: string
  fullname?: string
  full_name?: string
  phone: string
  role?: "teacher" | "student" | string
}

interface ProfileState {
  profile: UserProfile | null
  setProfile: (user: UserProfile) => void
  clearProfile: () => void
}

export const useProfileStore = create<ProfileState>((set) => ({
  profile: null,
  setProfile: (user) => {
    const name = user.fullname || user.full_name || ""
    const role = user.role || "user"

    localStorage.setItem("fullname", name)
    localStorage.setItem("phone", user.phone)
    localStorage.setItem("role", role)
    localStorage.setItem("id", user.id)

    set({
      profile: {
        id: user.id,
        fullname: name,
        phone: user.phone,
        role: role as "teacher" | "student" | string
      }
    })
  },
  clearProfile: () => {
    localStorage.removeItem("fullname")
    localStorage.removeItem("phone")
    localStorage.removeItem("role")
    localStorage.removeItem("id")
    set({ profile: null })
  }
}))
