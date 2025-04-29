"use client"

import { FC, useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { useUserStore } from "@/stores/user-store"
import { Button } from "@/components/ui/button"
import { Plus, Edit, Trash2 } from "lucide-react"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { User } from "@/interfaces/user"
import { useRouter } from "next/router"
import { useSession } from "next-auth/react"

const UsersTable: FC = () => {
  const { push } = useRouter()
  const { data: session } = useSession()
  const { users, fetchUsers, deleteUser, editUser, addUser } = useUserStore()
  const [search, setSearch] = useState("")
  const [editUserData, setEditUserData] = useState<User | null>(null)
  const [isClient, setIsClient] = useState(false)

  const isAdmin = session?.user?.role === "admin"

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (isClient) {
      fetchUsers()
    }
  }, [isClient, fetchUsers])

  const filteredUsers = users.filter((user) =>
    `${user.firstName} ${user.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase())
  )

  const handleSave = () => {
    if (editUserData) {
      editUser(editUserData)
      setEditUserData(null)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <Input
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-1/2"
        />
        <Button
          onClick={() => {
            const id = Math.floor(Math.random() * 10000)
            addUser({
              id,
              firstName: "New",
              lastName: "User",
              email: `newuser${id}@example.com`,
            })
          }}
          className="bg-green-500 hover:bg-green-600 text-white"
          size="icon"
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            {isAdmin && <TableHead>Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell
                className="cursor-pointer"
                onClick={() => push(`/users/${user.id}`)}
              >
                {user.firstName} {user.lastName}
              </TableCell>
              <TableCell>{user.email}</TableCell>
              {isAdmin && (
                <TableCell className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        className="bg-blue-100 hover:bg-blue-200 text-blue-700"
                        size="icon"
                        onClick={() => setEditUserData(user)}
                      >
                        <Edit className="h-5 w-5" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <div className="flex flex-col gap-4">
                        <Input
                          placeholder="First Name"
                          value={editUserData?.firstName || ""}
                          onChange={(e) =>
                            setEditUserData((prev) =>
                              prev ? { ...prev, firstName: e.target.value } : null
                            )
                          }
                        />
                        <Input
                          placeholder="Last Name"
                          value={editUserData?.lastName || ""}
                          onChange={(e) =>
                            setEditUserData((prev) =>
                              prev ? { ...prev, lastName: e.target.value } : null
                            )
                          }
                        />
                        <Input
                          placeholder="Email"
                          value={editUserData?.email || ""}
                          onChange={(e) =>
                            setEditUserData((prev) =>
                              prev ? { ...prev, email: e.target.value } : null
                            )
                          }
                        />
                        <Button
                          onClick={handleSave}
                          className="bg-blue-500 hover:bg-blue-600 text-white"
                        >
                          Save Changes
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="ghost"
                    className="bg-red-100 hover:bg-red-200 text-red-700"
                    size="icon"
                    onClick={() => deleteUser(user.id)}
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default UsersTable
