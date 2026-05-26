export type ProjectStatus = "Planificado" | "En progreso" | "En revisión" | "Completado"
export type TaskStatus = "Pendiente" | "En progreso" | "Completado"
export type Priority = "Baja" | "Media" | "Alta" | "Urgente"

export type Project = {
    id: number
    title: string
    description: string
    status: ProjectStatus
    progress: number
    teamMemberIds: number[]
}

export type TeamMember = {
    userId: number
    role: string
    name: string
    email: string
    position: string
    birthdate: string
    phone: string
    projectId: number
    isActive: boolean
}

export type Task = {
    id: number
    description: string
    projectId: number
    status: TaskStatus
    priority: Priority
    userId: number
    dateline: string
}

export type Settings = {
    appName: string
    notifications: boolean
    autoSave: boolean
    defaultView: string
    rowsPerPage: number
}

export type AlertState = {
    type: "success" | "error" | "info"
    title: string
    message: string
} | null
