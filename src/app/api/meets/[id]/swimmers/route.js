import sql from "@/app/api/utils/sql";

export async function GET(request, { params }) {
  try {
    const { id } = params;

    // Get all swimmers for this meet
    // For now, we'll get all swimmers and filter by event on the frontend
    // In a real app, you might have a meet_registrations table to link swimmers to specific meets
    const swimmers = await sql`
      SELECT 
        s.id,
        s.first_name,
        s.last_name,
        s.gender,
        s.team,
        s.date_of_birth
      FROM swimmers s
      ORDER BY s.last_name, s.first_name
    `;

    // For demo purposes, add some seed times
    const swimmersWithSeedTimes = swimmers.map((swimmer) => ({
      ...swimmer,
      seedTime: (Math.random() * 30 + 20).toFixed(2), // Random seed time between 20-50 seconds
    }));

    return Response.json({ swimmers: swimmersWithSeedTimes });
  } catch (error) {
    console.error("Error fetching swimmers:", error);
    return Response.json(
      { error: "Failed to fetch swimmers" },
      { status: 500 },
    );
  }
}
