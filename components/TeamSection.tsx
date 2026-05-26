"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { Project, TeamMember } from "@/types"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface TeamSectionProps {
    team: TeamMember[]
    projects: Project[]
    loadingAction: boolean
    onSaveMember: (member: Omit<TeamMember, "userId">, id?: number) => void
    onDeleteMember: (id: number) => void
    getProjectName: (id: number) => string
}

export default function TeamSection({
    team,
    projects,
    loadingAction,
    onSaveMember,
    onDeleteMember,
    getProjectName
}: TeamSectionProps) {
    const [memberDialog, setMemberDialog] = useState(false)
    const [editingMemberId, setEditingMemberId] = useState<number | null>(null)
    const [memberForm, setMemberForm] = useState<Omit<TeamMember, "userId">>({
        role: "developer",
        name: "",
        email: "",
        position: "",
        birthdate: "",
        phone: "",
        projectId: projects[0]?.id ?? 1,
        isActive: true,
    })

    const openCreateMember = () => {
        setEditingMemberId(null)
        setMemberForm({
            role: "developer",
            name: "",
            email: "",
            position: "",
            birthdate: "",
            phone: "",
            projectId: projects[0]?.id ?? 1,
            isActive: true,
        })
        setMemberDialog(true)
    }

    const openEditMember = (member: TeamMember) => {
        setEditingMemberId(member.userId)
        setMemberForm({
            role: member.role,
            name: member.name,
            email: member.email,
            position: member.position,
            birthdate: member.birthdate,
            phone: member.phone,
            projectId: member.projectId,
            isActive: member.isActive,
        })
        setMemberDialog(true)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSaveMember(memberForm, editingMemberId ?? undefined)
        setMemberDialog(false)
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <Button onClick={openCreateMember} disabled={loadingAction}>Nuevo Miembro</Button>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>CRUD de miembros del equipo</CardTitle>
                    <CardDescription>
                        Campos: userId, role, name, email, position, birthdate, phone, projectId e isActive.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Usuario</TableHead>
                                    <TableHead>Rol</TableHead>
                                    <TableHead>Proyecto</TableHead>
                                    <TableHead>Contacto</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead className="text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {team.map((member) => (
                                    <TableRow key={member.userId}>
                                        <TableCell>
                                            <div className="font-medium">{member.name}</div>
                                            <div className="text-sm text-muted-foreground">{member.position}</div>
                                            <div className="text-xs text-muted-foreground">ID: {member.userId}</div>
                                        </TableCell>
                                        <TableCell>{member.role}</TableCell>
                                        <TableCell>{getProjectName(member.projectId)}</TableCell>
                                        <TableCell>
                                            <div>{member.email}</div>
                                            <div className="text-sm text-muted-foreground">{member.phone}</div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={member.isActive ? "default" : "secondary"}>
                                                {member.isActive ? "Activo" : "Inactivo"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="space-x-2 text-right">
                                            <Button size="sm" variant="outline" onClick={() => openEditMember(member)}>Editar</Button>
                                            <Button size="sm" variant="destructive" onClick={() => onDeleteMember(member.userId)} disabled={loadingAction}>Eliminar</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <Dialog open={memberDialog} onOpenChange={setMemberDialog}>
                <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[550px]">
                    <form onSubmit={handleSubmit}>
                        <DialogHeader>
                            <DialogTitle>{editingMemberId ? "Editar miembro" : "Crear miembro"}</DialogTitle>
                            <DialogDescription>
                                Completa la información del miembro del equipo.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label>Nombre completo</Label>
                                <Input
                                    value={memberForm.name}
                                    onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })}
                                    placeholder="Ej: María García"
                                />
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label>Email</Label>
                                    <Input
                                        type="email"
                                        value={memberForm.email}
                                        onChange={(e) => setMemberForm({ ...memberForm, email: e.target.value })}
                                        placeholder="maria@example.com"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Teléfono</Label>
                                    <Input
                                        value={memberForm.phone}
                                        onChange={(e) => setMemberForm({ ...memberForm, phone: e.target.value })}
                                        placeholder="999111222"
                                    />
                                </div>
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label>Rol</Label>
                                    <Select
                                        value={memberForm.role}
                                        onValueChange={(value) => setMemberForm({ ...memberForm, role: value ?? "developer" })}
                                    >
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="admin">Admin</SelectItem>
                                            <SelectItem value="developer">Developer</SelectItem>
                                            <SelectItem value="designer">Designer</SelectItem>
                                            <SelectItem value="devops">DevOps</SelectItem>
                                            <SelectItem value="manager">Manager</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label>Cargo (Position)</Label>
                                    <Input
                                        value={memberForm.position}
                                        onChange={(e) => setMemberForm({ ...memberForm, position: e.target.value })}
                                        placeholder="Frontend Developer"
                                    />
                                </div>
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label>Proyecto asignado</Label>
                                    <Select
                                        value={String(memberForm.projectId)}
                                        onValueChange={(value) => setMemberForm({ ...memberForm, projectId: Number(value ?? 1) })}
                                    >
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {projects.map((p) => (
                                                <SelectItem key={p.id} value={String(p.id)}>{p.title}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label>Fecha de nacimiento</Label>
                                    <Popover>
                                        <PopoverTrigger
                                            render={
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-full justify-start text-left font-normal",
                                                        !memberForm.birthdate && "text-muted-foreground"
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {memberForm.birthdate ? format(new Date(memberForm.birthdate + "T00:00:00"), "PPP") : <span>Seleccionar fecha</span>}
                                                </Button>
                                            }
                                        />
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={memberForm.birthdate ? new Date(memberForm.birthdate + "T00:00:00") : undefined}
                                                onSelect={(date) => setMemberForm({ ...memberForm, birthdate: date ? format(date, "yyyy-MM-dd") : "" })}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>
                            <div className="flex items-center justify-between rounded-lg border p-4">
                                <Label>Estado Activo</Label>
                                <Switch
                                    checked={memberForm.isActive}
                                    onCheckedChange={(checked) => setMemberForm({ ...memberForm, isActive: checked })}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setMemberDialog(false)}>Cancelar</Button>
                            <Button type="submit" disabled={loadingAction}>
                                {loadingAction ? <Spinner className="mr-2 size-4" /> : null}
                                Guardar
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
