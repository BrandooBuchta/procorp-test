import { User } from "@/interfaces/user"
import { create } from "zustand"
import { toast } from "sonner"
import axios from "axios"

interface UserStore {
  users: User[]
  fetchUsers: () => Promise<void>
  addUser: (user: User) => void
  editUser: (user: User) => void
  deleteUser: (id: number) => void
}

export const useUserStore = create<UserStore>((set) => ({
  users: [],
  fetchUsers: async () => {
    try {
      const { data } = await axios.get("https://dummyjson.com/users")

      const loadedUsers: User[] = data.users.map((user: any) => ({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      }))

      const mockUsers: User[] = [
        { id: 1001, firstName: "Mock", lastName: "UserOne", email: "userone@example.com" },
        { id: 1002, firstName: "Mock", lastName: "UserTwo", email: "usertwo@example.com" },
        { id: 1003, firstName: "Mock", lastName: "UserThree", email: "userthree@example.com" },
      ]

      set({ users: [...loadedUsers, ...mockUsers] })

      toast.success("Users loaded successfully.")
    } catch (error) {
      console.error(error)
      toast.error("Failed to load users.")
    }
  },
  addUser: (user) => set((state) => {
    toast.success("User added successfully.")
    return { users: [...state.users, user] }
  }),
  editUser: (editedUser) => set((state) => {
    toast.success("User updated successfully.")
    return {
      users: state.users.map((user) =>
        user.id === editedUser.id ? editedUser : user
      ),
    }
  }),
  deleteUser: (id) => set((state) => {
    toast.success("User deleted successfully.")
    return {
      users: state.users.filter((user) => user.id !== id),
    }
  }),
}))
