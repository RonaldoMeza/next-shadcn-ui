"use client"

import { useState, useMemo } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import OverviewSection from "@/components/OverviewSection"
import ProjectSection from "@/components/ProjectSection"
import TeamSection from "@/components/TeamSection"
import TaskSection from "@/components/TaskSection"
import SettingsSection from "@/components/SettingsSection"
import { Project, TeamMember, Task, Settings, AlertState } from "@/types"

const initialProjects: Project[] = [
    {
        id: 1,
        title: "E-commerce Platform",
        description: "Plataforma de comercio electrónico con Next.js",
        status: "En progreso",
        progress: 65,
        teamMemberIds: [1, 2],
    },
    {
        id: 2,
        title: "Mobile App",
        description: "Aplicación móvil con React Native",
        status: "En revisión",
        progress: 90,
        teamMemberIds: [3],
    },
    {
        id: 3,
        title: "Dashboard Analytics",
        description: "Panel de análisis con visualizaciones",
        status: "Planificado",
        progress: 20,
        teamMemberIds: [4, 5],
    },
]

const initialTeam: TeamMember[] = [
    {
        userId: 1,
        role: "admin",
        name: "María García",
        email: "maria@example.com",
        position: "Frontend Developer",
        birthdate: "1998-05-12",
        phone: "999111222",
        projectId: 1,
        isActive: true,
    },
    {
        userId: 2,
        role: "developer",
        name: "Juan Pérez",
        email: "juan@example.com",
        position: "Backend Developer",
        birthdate: "1997-09-18",
        phone: "999222333",
        projectId: 1,
        isActive: true,
    },
    {
        userId: 3,
        role: "designer",
        name: "Ana López",
        email: "ana@example.com",
        position: "UI/UX Designer",
        birthdate: "1999-02-23",
        phone: "999333444",
        projectId: 2,
        isActive: false,
    },
    {
        userId: 4,
        role: "devops",
        name: "Carlos Ruiz",
        email: "carlos@example.com",
        position: "DevOps Engineer",
        birthdate: "1996-11-04",
        phone: "999444555",
        projectId: 3,
        isActive: true,
    },
    {
        userId: 5,
        role: "manager",
        name: "Laura Martínez",
        email: "laura@example.com",
        position: "Project Manager",
        birthdate: "1995-07-29",
        phone: "999555666",
        projectId: 3,
        isActive: true,
    },
]

const initialTasks: Task[] = [
    {
        id: 1,
        description: "Implementar autenticación",
        projectId: 1,
        status: "En progreso",
        priority: "Alta",
        userId: 1,
        dateline: "2026-06-10",
    },
    {
        id: 2,
        description: "Diseñar pantalla de perfil",
        projectId: 2,
        status: "Pendiente",
        priority: "Media",
        userId: 3,
        dateline: "2026-06-15",
    },
    {
        id: 3,
        description: "Configurar CI/CD",
        projectId: 3,
        status: "Completado",
        priority: "Alta",
        userId: 4,
        dateline: "2026-06-05",
    },
    {
        id: 4,
        description: "Optimizar queries SQL",
        projectId: 1,
        status: "En progreso",
        priority: "Urgente",
        userId: 2,
        dateline: "2026-06-12",
    },
    {
        id: 5,
        description: "Documentar API endpoints",
        projectId: 3,
        status: "Pendiente",
        priority: "Baja",
        userId: 5,
        dateline: "2026-06-20",
    },
]

export default function DashboardPage() {
    const [projects, setProjects] = useState<Project[]>(initialProjects)
    const [team, setTeam] = useState<TeamMember[]>(initialTeam)
    const [tasks, setTasks] = useState<Task[]>(initialTasks)
    const [settings, setSettings] = useState<Settings>({
        appName: "Business Pro Dashboard",
        notifications: true,
        autoSave: false,
        defaultView: "overview",
        rowsPerPage: 3,
    })

    const [alert, setAlert] = useState<AlertState>(null)
    const [loadingAction, setLoadingAction] = useState(false)

    const showAlert = (type: "success" | "error" | "info", title: string, message: string) => {
        setAlert({ type, title, message })
        setTimeout(() => setAlert(null), 3500)
    }

    const simulateBackend = (callback: () => void) => {
        setLoadingAction(true)
        setTimeout(() => {
            callback()
            setLoadingAction(false)
        }, 800)
    }

    const getProjectName = (projectId: number) => {
        return projects.find((p) => p.id === projectId)?.title ?? "Sin proyecto"
    }

    const getMemberName = (userId: number) => {
        return team.find((m) => m.userId === userId)?.name ?? "Sin asignar"
    }

    // Handlers
    const handleSaveProject = (projectData: Omit<Project, "id">, id?: number) => {
        if (!projectData.title.trim() || !projectData.description.trim()) {
            showAlert("error", "Validación", "Nombre y descripción son obligatorios.")
            return
        }
        simulateBackend(() => {
            if (id) {
                setProjects(prev => prev.map(p => p.id === id ? { ...p, ...projectData } : p))
                showAlert("success", "Actualizado", "Proyecto actualizado correctamente.")
            } else {
                setProjects(prev => [{ id: Date.now(), ...projectData }, ...prev])
                showAlert("success", "Creado", "Proyecto creado correctamente.")
            }
        })
    }

    const handleDeleteProject = (id: number) => {
        simulateBackend(() => {
            setProjects(prev => prev.filter(p => p.id !== id))
            setTasks(prev => prev.filter(t => t.projectId !== id))
            showAlert("success", "Eliminado", "Proyecto eliminado.")
        })
    }

    const handleSaveMember = (memberData: Omit<TeamMember, "userId">, id?: number) => {
        if (!memberData.name.trim() || !memberData.email.includes("@")) {
            showAlert("error", "Validación", "Nombre y email válido requeridos.")
            return
        }
        simulateBackend(() => {
            if (id) {
                setTeam(prev => prev.map(m => m.userId === id ? { ...m, ...memberData } : m))
                showAlert("success", "Actualizado", "Miembro actualizado.")
            } else {
                setTeam(prev => [{ userId: Date.now(), ...memberData }, ...prev])
                showAlert("success", "Creado", "Miembro agregado al equipo.")
            }
        })
    }

    const handleDeleteMember = (id: number) => {
        simulateBackend(() => {
            setTeam(prev => prev.filter(m => m.userId !== id))
            showAlert("success", "Eliminado", "Miembro eliminado.")
        })
    }

    const handleSaveTask = (taskData: Omit<Task, "id">, id?: number) => {
        if (!taskData.description.trim() || !taskData.dateline) {
            showAlert("error", "Validación", "Descripción y fecha requeridas.")
            return
        }
        simulateBackend(() => {
            if (id) {
                setTasks(prev => prev.map(t => t.id === id ? { ...t, ...taskData } : t))
                showAlert("success", "Actualizado", "Tarea actualizada.")
            } else {
                setTasks(prev => [{ id: Date.now(), ...taskData }, ...prev])
                showAlert("success", "Creado", "Tarea creada.")
            }
        })
    }

    const handleDeleteTask = (id: number) => {
        simulateBackend(() => {
            setTasks(prev => prev.filter(t => t.id !== id))
            showAlert("success", "Eliminado", "Tarea eliminada.")
        })
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-muted to-accent/20 p-6">
            <div className="mx-auto max-w-7xl space-y-6">
                <div className="flex flex-col justify-between gap-4 rounded-2xl border bg-card/80 p-6 shadow-sm backdrop-blur-md md:flex-row md:items-center">
                    <div>
                        <Badge className="mb-3 bg-primary">Arquitectura Refactorizada</Badge>
                        <h1 className="text-4xl font-bold text-foreground">{settings.appName}</h1>
                        <p className="text-muted-foreground">
                            Gestión modular de proyectos, equipo y tareas.
                        </p>
                    </div>
                    {loadingAction && (
                        <div className="flex items-center gap-2 rounded-lg border bg-card px-4 py-2 text-sm text-muted-foreground">
                            <Spinner className="size-4" />
                            Cargando...
                        </div>
                    )}
                </div>

                {alert && (
                    <Alert variant={alert.type === "error" ? "destructive" : "default"} className="border-primary/20 bg-primary/5">
                        <AlertTitle>{alert.title}</AlertTitle>
                        <AlertDescription>{alert.message}</AlertDescription>
                    </Alert>
                )}

                <Tabs defaultValue={settings.defaultView} className="space-y-4">
                    <TabsList className="bg-white/50 p-1">
                        <TabsTrigger value="overview">Resumen</TabsTrigger>
                        <TabsTrigger value="projects">Proyectos</TabsTrigger>
                        <TabsTrigger value="team">Equipo</TabsTrigger>
                        <TabsTrigger value="tasks">Tareas</TabsTrigger>
                        <TabsTrigger value="settings">Configuración</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview">
                        <OverviewSection 
                            projects={projects} 
                            tasks={tasks} 
                            team={team} 
                            getProjectName={getProjectName} 
                            getMemberName={getMemberName} 
                        />
                    </TabsContent>

                    <TabsContent value="projects">
                        <ProjectSection 
                            projects={projects} 
                            team={team} 
                            loadingAction={loadingAction} 
                            onSaveProject={handleSaveProject} 
                            onDeleteProject={handleDeleteProject}
                            getMemberName={getMemberName}
                        />
                    </TabsContent>

                    <TabsContent value="team">
                        <TeamSection 
                            team={team} 
                            projects={projects} 
                            loadingAction={loadingAction} 
                            onSaveMember={handleSaveMember} 
                            onDeleteMember={handleDeleteMember}
                            getProjectName={getProjectName}
                        />
                    </TabsContent>

                    <TabsContent value="tasks">
                        <TaskSection 
                            tasks={tasks} 
                            projects={projects} 
                            team={team} 
                            rowsPerPage={settings.rowsPerPage} 
                            loadingAction={loadingAction} 
                            onSaveTask={handleSaveTask} 
                            onDeleteTask={handleDeleteTask}
                            getProjectName={getProjectName}
                            getMemberName={getMemberName}
                        />
                    </TabsContent>

                    <TabsContent value="settings">
                        <SettingsSection 
                            settings={settings} 
                            loadingAction={loadingAction} 
                            onSaveSettings={setSettings} 
                        />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
