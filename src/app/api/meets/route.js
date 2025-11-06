import sql from "@/app/api/utils/sql";

// GET /api/meets - List all meets
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    let query = "SELECT * FROM meets";
    let params = [];

    if (status) {
      query += " WHERE status = $1";
      params.push(status);
    }

    query += " ORDER BY date DESC";

    const meets = await sql(query, params);

    // Calculate participants count (placeholder for now)
    const meetsWithStats = meets.map((meet) => ({
      ...meet,
      participants: Math.floor(Math.random() * 200) + 50, // Placeholder
      events: Math.floor(Math.random() * 30) + 10, // Placeholder
    }));

    return Response.json(meetsWithStats);
  } catch (error) {
    console.error("Error fetching meets:", error);
    return Response.json({ error: "Failed to fetch meets" }, { status: 500 });
  }
}

// POST /api/meets - Create a new meet
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, date, venue, poolLength, lanes, description } = body;

    // Validate required fields
    if (!name || !date || !venue || !poolLength || !lanes) {
      return Response.json(
        {
          error:
            "Missing required fields: name, date, venue, poolLength, lanes",
        },
        { status: 400 },
      );
    }

    // Validate data types and ranges
    const poolLengthInt = parseInt(poolLength);
    const lanesInt = parseInt(lanes);

    if (isNaN(poolLengthInt) || poolLengthInt < 10 || poolLengthInt > 100) {
      return Response.json(
        { error: "Pool length must be between 10 and 100 meters" },
        { status: 400 },
      );
    }

    if (isNaN(lanesInt) || lanesInt < 1 || lanesInt > 20) {
      return Response.json(
        { error: "Number of lanes must be between 1 and 20" },
        { status: 400 },
      );
    }

    // Insert the new meet
    const newMeet = await sql`
      INSERT INTO meets (name, date, venue, pool_length, lanes, description, status)
      VALUES (${name}, ${date}, ${venue}, ${poolLengthInt}, ${lanesInt}, ${description || null}, 'draft')
      RETURNING *
    `;

    return Response.json(newMeet[0], { status: 201 });
  } catch (error) {
    console.error("Error creating meet:", error);
    return Response.json({ error: "Failed to create meet" }, { status: 500 });
  }
}
