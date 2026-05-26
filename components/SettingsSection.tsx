"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Settings } from "@/types"

interface SettingsSectionProps {
    settings: Settings
    loadingAction: boolean
    onSaveSettings: (settings: Settings) => void
}

export default function SettingsSection({
    settings,
    loadingAction,
    onSaveSettings
}: SettingsSectionProps) {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSaveSettings(settings)
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Configuración simulada</CardTitle>
                <CardDescription>
                    Formulario para simular preferencias del dashboard.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
                    <div className="grid gap-2">
                        <Label>Nombre de la aplicación</Label>
                        <Input
                            defaultValue={settings.appName}
                            onBlur={(e) => onSaveSettings({ ...settings, appName: e.target.value })}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label>Vista inicial</Label>
                        <Select
                            value={settings.defaultView}
                            onValueChange={(value) => onSaveSettings({ ...settings, defaultView: value ?? "overview" })}
                        >
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="overview">Resumen</SelectItem>
                                <SelectItem value="projects">Proyectos</SelectItem>
                                <SelectItem value="team">Equipo</SelectItem>
                                <SelectItem value="tasks">Tareas</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label>Filas por página en tareas</Label>
                        <Select
                            value={String(settings.rowsPerPage)}
                            onValueChange={(value) => onSaveSettings({ ...settings, rowsPerPage: Number(value ?? 3) })}
                        >
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="2">2</SelectItem>
                                <SelectItem value="3">3</SelectItem>
                                <SelectItem value="5">5</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                            <Label>Notificaciones</Label>
                            <p className="text-sm text-muted-foreground">Simula avisos para cambios importantes.</p>
                        </div>
                        <Switch
                            checked={settings.notifications}
                            onCheckedChange={(checked) => onSaveSettings({ ...settings, notifications: checked })}
                        />
                    </div>
                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                            <Label>Auto guardado</Label>
                            <p className="text-sm text-muted-foreground">Simula guardado automático en memoria.</p>
                        </div>
                        <Switch
                            checked={settings.autoSave}
                            onCheckedChange={(checked) => onSaveSettings({ ...settings, autoSave: checked })}
                        />
                    </div>
                    <div className="md:col-span-2">
                        <Button type="submit" disabled={loadingAction}>
                            {loadingAction ? <Spinner className="mr-2 size-4" /> : null}
                            Guardar configuración
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}
