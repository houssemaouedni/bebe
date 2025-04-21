import * as React from "react";

import { useState } from "react"
import { Baby, Clock, Droplet } from "../icons"
import useBottleStore from "../stores/bottleStore"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Alert, AlertDescription } from "./ui/alert"

const BottleForm = () => {
  const [volume, setVolume] = useState("")
  const [timestamp, setTimestamp] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const addBottle = useBottleStore((state) => state.addBottle)
  const loading = useBottleStore((state) => state.loading)
  const storeError = useBottleStore((state) => state.error)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    setSuccess(false)

    try {
      const newBottle = {
        volume: Number.parseInt(volume),
        timestamp: timestamp  ?? new Date().toISOString(),
      }

      await addBottle(newBottle)

      setVolume("")
      setTimestamp("")
      setSuccess(true)

      // Masquer le message de succès après 3 secondes
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err.message || "Erreur lors de l'ajout du biberon")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Baby className="h-5 w-5 text-primary" />
          Enregistrer un biberon
        </CardTitle>
        <CardDescription>Ajoutez un nouveau biberon au suivi</CardDescription>
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
            <AlertDescription>Biberon ajouté avec succès!</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="volume" className="flex items-center gap-1">
              <Droplet className="h-3.5 w-3.5" />
              Volume (ml)
            </Label>
            <Input
              type="number"
              id="volume"
              value={volume}
              onChange={(e) => setVolume(e.target.value)}
              required
              min="0"
              disabled={submitting || loading}
              placeholder="ex: 120"
            />
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
        <Button onClick={handleSubmit} className="w-full" disabled={submitting || loading || !volume}>
          {submitting || loading ? "Enregistrement en cours..." : "Enregistrer"}
        </Button>
      </CardFooter>
    </Card>
  )
}

export default BottleForm
