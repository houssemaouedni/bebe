import * as React from "react";

import { useEffect, useMemo, useState } from "react"
import { Activity, Baby, Clock, Droplet, Pill } from "../icons"
import useBottleStore from "../stores/bottleStore"
import useMedicationStore from "../stores/medicationStore"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Skeleton } from "./ui/skeleton"
import { ScrollArea } from "./ui/scroll-area"
import { Button } from "./ui/button"
import { Alert, AlertDescription } from "./ui/alert"
import { formatTime } from "../lib/utils"

const Dashboard = () => {
  const {
    todayTotal,
    todayVolume,
    fetchBottles,
    bottles,
    loading: bottlesLoading,
    error: bottlesError,
  } = useBottleStore()

  const { todayMedications, fetchMedications, loading: medsLoading, error: medsError } = useMedicationStore()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      setError(null)
      try {
        await Promise.all([fetchBottles(), fetchMedications()])
      } catch (err) {
        setError("Erreur lors du chargement des données")
        console.error("Erreur de chargement:", err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
    const interval = setInterval(loadData, 60000)
    return () => clearInterval(interval)
  }, [fetchBottles, fetchMedications])

  const bottlesLast24h = useMemo(() => {
    const now = new Date()
    const yesterday = new Date(now)
    yesterday.setDate(yesterday.getDate() - 1)

    return bottles
      .filter((bottle) => new Date(bottle.timestamp) >= yesterday)
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
  }, [bottles])

  if (loading || bottlesLoading || medsLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Tableau de bord
          </CardTitle>
          <CardDescription>Aperçu des activités récentes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <Skeleton className="h-4 w-28 mb-2" />
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <Skeleton className="h-4 w-28 mb-2" />
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          </div>
          <div className="space-y-2 mb-6">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-32 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-32 w-full" />
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
            <Activity className="h-5 w-5 text-primary" />
            Tableau de bord
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
          <Activity className="h-5 w-5 text-primary" />
          Tableau de bord
        </CardTitle>
        <CardDescription>Aperçu des activités récentes</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-sm font-medium text-primary mb-1">
                <Baby className="h-4 w-4" />
                Biberons aujourd'hui
              </div>
              <p className="text-3xl font-bold">{todayTotal}</p>
            </CardContent>
          </Card>
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-sm font-medium text-primary mb-1">
                <Droplet className="h-4 w-4" />
                Volume total
              </div>
              <p className="text-3xl font-bold">
                {todayVolume} <span className="text-sm font-normal">ml</span>
              </p>
            </CardContent>
          </Card>
        </div>

        <div>
          <h3 className="text-sm font-medium flex items-center gap-2 mb-3">
            <Clock className="h-4 w-4 text-muted-foreground" />
            Derniers biberons (24h)
          </h3>
          <Card>
            <ScrollArea className="h-40">
              <CardContent className="p-3">
                {bottlesLast24h.length > 0 ? (
                  bottlesLast24h.map((bottle) => (
                    <div key={bottle.id} className="flex justify-between py-2 border-b border-border last:border-0">
                      <span className="text-muted-foreground">{formatTime(bottle.timestamp)}</span>
                      <span className="font-medium">{bottle.volume} ml</span>
                    </div>
                  ))
                ) : (
                  <div className="flex justify-center items-center h-32 text-muted-foreground">
                    Aucun biberon dans les dernières 24h
                  </div>
                )}
              </CardContent>
            </ScrollArea>
          </Card>
        </div>

        <div>
          <h3 className="text-sm font-medium flex items-center gap-2 mb-3">
            <Pill className="h-4 w-4 text-muted-foreground" />
            Médicaments aujourd'hui
          </h3>
          <Card>
            <CardContent className="p-3">
              {todayMedications.length > 0 ? (
                todayMedications.map((med) => (
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
                <div className="flex justify-center items-center h-16 text-muted-foreground">
                  Aucun médicament aujourd'hui
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  )
}

export default Dashboard
