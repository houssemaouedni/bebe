import * as React from "react";

import { useState } from "react"
import { Pill, Clock, Beaker } from "../icons"
import useMedicationStore from "../stores/medicationStore"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Alert, AlertDescription } from "./ui/alert"

const MedicationForm = () => {
  const [name, setName] = useState("")
  const [dose, setDose] = useState("")
  const [unit, setUnit] = useState("ml")
  const [timestamp, setTimestamp] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const addMedication = useMedicationStore((state) => state.addMedication)
  const loading = useMedicationStore((state) => state.loading)
  const storeError = useMedicationStore((state) => state.error)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    setSuccess(false)

    try {
      const newMedication = {
        name,
        dose: Number.parseFloat(dose),
        unit,
        timestamp: timestamp || new Date().toISOString(),
      }

      await addMedication(newMedication)

      setName("")
      setDose("")
      setUnit("ml")
      setTimestamp("")
      setSuccess(true)

      // Masquer le message de succès après 3 secondes
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err.message || "Erreur lors de l'ajout du médicament")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Pill className="h-5 w-5 text-primary" />
          Enregistrer un médicament
        </CardTitle>
        <CardDescription>Ajoutez un nouveau médicament au suivi</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {storeError && !error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{storeError}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert variant="success" className="mb-4 bg-green-50 text-green-800 border-green-200">
            <AlertDescription>Médicament ajouté avec succès!</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-1">
              <Pill className="h-3.5 w-3.5" />
              Nom du médicament
            </Label>
            <Input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="ex: Calmosine, Doliprane..."
              disabled={submitting || loading}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 space-y-2">
              <Label htmlFor="dose" className="flex items-center gap-1">
                <Beaker className="h-3.5 w-3.5" />
                Dose
              </Label>
              <Input
                type="number"
                id="dose"
                value={dose}
                onChange={(e) => setDose(e.target.value)}
                required
                min="0"
                step="0.1"
                disabled={submitting || loading}
                placeholder="ex: 5"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">Unité</Label>
              <Select value={unit} onValueChange={setUnit} disabled={submitting || loading}>
                <SelectTrigger id="unit">
                  <SelectValue placeholder="Unité" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ml">ml</SelectItem>
                  <SelectItem value="mg">mg</SelectItem>
                  <SelectItem value="gouttes">gouttes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="timestamp" className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              Date et heure (optionnel)
            </Label>
            <Input
              type="datetime-local"
              id="timestamp"
              value={timestamp}
              onChange={(e) => setTimestamp(e.target.value)}
              disabled={submitting || loading}
            />
            <p className="text-xs text-muted-foreground">Si non spécifié, l'heure actuelle sera utilisée</p>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubmit} className="w-full" disabled={submitting || loading || !name || !dose}>
          {submitting || loading ? "Enregistrement en cours..." : "Enregistrer"}
        </Button>
      </CardFooter>
    </Card>
  )
}

export default MedicationForm
