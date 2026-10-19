import { NextResponse } from "next/server"

export async function GET() {
  const key = process.env.API_FOOTBALL_KEY
  if (!key) return NextResponse.json({ error: "API_FOOTBALL_KEY غير مضبوط" }, { status: 503 })

  const response = await fetch("https://v3.football.api-sports.io/fixtures?next=100", {
    headers: { "x-apisports-key": key },
    next: { revalidate: 3600 },
  })
  if (!response.ok) return NextResponse.json({ error: "تعذر تحميل المباريات" }, { status: 502 })
  const payload = await response.json()
  const matches = (payload.response ?? []).map((item: any) => ({
    id: item.fixture.id,
    date: item.fixture.date,
    status: item.fixture.status.short,
    league: item.league.name,
    country: item.league.country,
    home: { name: item.teams.home.name, logo: item.teams.home.logo },
    away: { name: item.teams.away.name, logo: item.teams.away.logo },
  }))
  return NextResponse.json({ matches, updatedAt: new Date().toISOString() })
}
