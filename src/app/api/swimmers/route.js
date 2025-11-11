import { getAllSwimmers } from "../../../data/mockDB";

export async function GET() {
    try {
        const swimmers = getAllSwimmers();
        return Response.json(swimmers);
    } catch (error) {
        return Response.json(
            { error: "Failed to fetch swimmers" },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        const swimmerData = await request.json();

        // Import the addSwimmer function
        const { addSwimmer } = await import("../../../data/mockDB");

        const newSwimmer = addSwimmer(swimmerData);
        return Response.json(newSwimmer, { status: 201 });
    } catch (error) {
        return Response.json(
            { error: "Failed to create swimmer" },
            { status: 500 }
        );
    }
}