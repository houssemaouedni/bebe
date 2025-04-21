import * as React from "react";

import { useState, useEffect } from "react"
import { Calendar, Download, Baby, Droplet, Pill } from "../icons"
import useBottleStore from "../stores/bottleStore"
import useMedicationStore from "../stores/medicationStore"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { ScrollArea } from "./ui/scroll-area"
import { Skeleton } from "./ui/skeleton"
import { Alert, AlertDescription } from "./ui/alert"
import { formatDate, formatTime } from "../lib/utils"

const DailyReport = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [bottles, setBottles] = useState([])
  const [medications, setMedications] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [stats, setStats] = useState({ totalBottles: 0, totalVolume: 0 })

  const getBottlesByDate = useBottleStore((state) => state.getBottlesByDate)
  const getMedicationsByDate = useMedicationStore((state) => state.getMedicationsByDate)
  const bottlesLoading = useBottleStore((state) => state.loading)
  const medsLoading = useMedicationStore((state) => state.loading)
  const bottlesError = useBottleStore((state) => state.error)
  const medsError = useMedicationStore((state) => state.error)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const bottlesData = await getBottlesByDate(new Date(selectedDate))
        const medsData = await getMedicationsByDate(new Date(selectedDate))

        setBottles(bottlesData)
        setMedications(medsData)

        const totalBottles = bottlesData.length
        const totalVolume = bottlesData.reduce((sum, b) => sum + b.volume, 0)
        setStats({ totalBottles, totalVolume })
      } catch (err) {
        setError("Erreur lors du chargement des données")
        console.error("Erreur de chargement:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [selectedDate, getBottlesByDate, getMedicationsByDate])

  const generateCSV = () => {
    let csv = "Type,Nom,Heure,Quantité,Unité\n"

    bottles.forEach((bottle) => {
      csv += `Biberon,,${formatTime(bottle.timestamp)},${bottle.volume},ml\n`
    })

    medications.forEach((med) => {
      csv += `Médicament,${med.name},${formatTime(med.timestamp)},${med.dose},${med.unit}\n`
    })

    return csv
  }

  const downloadCSV = () => {
    const csv = generateCSV()
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `rapport-${selectedDate}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (loading || bottlesLoading || medsLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Rapport quotidien
          </CardTitle>
          <CardDescription>Consultez les données par jour</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-6 w-48 mx-auto" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || bottlesError || medsError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Rapport quotidien
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error || bottlesError || medsError}</AlertDescription>
          </Alert>
          <Button onClick={() => window.location.reload()} variant="outline" className="w-full">
            Réessayer
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Rapport quotidien
        </CardTitle>
        <CardDescription>Consultez les données par jour</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <label htmlFor="date" className="text-sm font-medium mb-2 block">
            Sélectionner une date
          </label>
          <Input type="date" id="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
        </div>

        <div className="text-center">
          <h3 className="text-lg font-medium">Rapport du {formatDate(selectedDate)}</h3>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-sm font-medium text-primary mb-1">
                <Baby className="h-4 w-4" />
                Nombre de biberons
              </div>
              <p className="text-3xl font-bold">{stats.totalBottles}</p>
            </CardContent>
          </Card>
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-sm font-medium text-primary mb-1">
                <Droplet className="h-4 w-4" />
                Volume total
              </div>
              <p className="text-3xl font-bold">
                {stats.totalVolume} <span className="text-sm font-normal">ml</span>
              </p>
            </CardContent>
          </Card>
        </div>

        <div>
          <h4 className="text-sm font-medium flex items-center gap-2 mb-3">
            <Baby className="h-4 w-4 text-muted-foreground" />
            Biberons
          </h4>
          <Card>
            <ScrollArea className="h-40">
              <CardContent className="p-3">
                {bottles.length > 0 ? (
                  bottles
                    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
                    .map((bottle) => (
                      <div key={bottle.id} className="flex justify-between py-2 border-b border-border last:border-0">
                        <span className="text-muted-foreground">{formatTime(bottle.timestamp)}</span>
                        <span className="font-medium">{bottle.volume} ml</span>
                      </div>
                    ))
                ) : (
                  <div className="flex justify-center items-center h-32 text-muted-foreground">
                    Aucun biberon ce jour
                  </div>
                )}
              </CardContent>
            </ScrollArea>
          </Card>
        </div>

        <div>
          <h4 className="text-sm font-medium flex items-center gap-2 mb-3">
            <Pill className="h-4 w-4 text-muted-foreground" />
            Médicaments
          </h4>
          <Card>
            <ScrollArea className="h-40">
              <CardContent className="p-3">
                {medications.length > 0 ? (
                  medications
                    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
                    .map((med) => (
                      <div key={med.id} className="flex justify-between py-2 border-b border-border last:border-0">
                        <div>
                          <span className="font-medium">{med.name}</span>
                          <span className="ml-2 text-xs text-muted-foreground">({formatTime(med.timestamp)})</span>
                        </div>
                        <span className="text-muted-foreground">
                          {med.dose} {med.unit}
                        </span>
                      </div>
                    ))
                ) : (
                  <div className="flex justify-center items-center h-32 text-muted-foreground">
                    Aucun médicament ce jour
                  </div>
                )}
              </CardContent>
            </ScrollArea>
          </Card>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={downloadCSV} className="w-full" variant="default">
          <Download className="h-4 w-4 mr-2" />
          Exporter en CSV
        </Button>
      </CardFooter>
    </Card>
  )
}

export default DailyReport
