import { NextResponse } from "next/server"

type ApiFixture = { fixture: { id: number; date: string; status: { short: string } }; league: { name: string; country: string }; teams: { home: { name: string; logo: string | null }; away: { name: string; logo: string | null } } }

export async function GET() {
  const key = process.env.API_FOOTBALL_KEY
  if (!key) return NextResponse.json({ error: "API_FOOTBALL_KEY غير مضبوط" }, { status: 503 })

  const today = new Date().toISOString().slice(0, 10)
  const currentSeason = new Date().getUTCFullYear()
  const headers = { "x-apisports-key": key }
  const request = (season: number) => fetch(`https://v3.football.api-sports.io/fixtures?league=233&season=${season}&from=${today}&to=${season + 1}-06-30`, { headers, next: { revalidate: 900 } })
  const response = await request(currentSeason)
  if (!response.ok) return NextResponse.json({ error: "تعذر تحميل المباريات الحقيقية من مزود البيانات" }, { status: 502 })
  let payload = await response.json() as { response?: ApiFixture[]; errors?: Record<string, string> }
  if (payload.errors && Object.keys(payload.errors).length) return NextResponse.json({ error: "رفض مزود البيانات طلب المباريات" }, { status: 502 })
  if (!payload.response?.length) {
    const previousResponse = await request(currentSeason - 1)
    if (previousResponse.ok) payload = await previousResponse.json() as { response?: ApiFixture[]; errors?: Record<string, string> }
  }
  const matches = (payload.response ?? []).filter((item) => new Date(item.fixture.date) >= new Date()).slice(0, 100).map((item) => ({
    id: item.fixture.id,
    date: item.fixture.date,
    status: item.fixture.status.short,
    league: item.league.name,
    country: item.league.country,
    home: { name: item.teams.home.name, logo: item.teams.home.logo ?? "" },
    away: { name: item.teams.away.name, logo: item.teams.away.logo ?? "" },
  }))
  return NextResponse.json({ matches, updatedAt: new Date().toISOString(), source: "api-football" })
}
