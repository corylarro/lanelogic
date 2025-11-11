import { getSwimmerById, updateSwimmer, deleteSwimmer } from "../../../../data/mockDB";

export async function GET(request, { params }) {
    try {
        const { id } = await params;
        const swimmer = getSwimmerById(id);

        if (!swimmer) {
            return Response.json(
                { error: "Swimmer not found" },
                { status: 404 }
            );
        }

        return Response.json(swimmer);
    } catch (error) {
        return Response.json(
            { error: "Failed to fetch swimmer" },
            { status: 500 }
        );
    }
}

export async function PUT(request, { params }) {
    try {
        const { id } = await params;
        const swimmerData = await request.json();

        const updatedSwimmer = updateSwimmer(id, swimmerData);

        if (!updatedSwimmer) {
            return Response.json(
                { error: "Swimmer not found" },
                { status: 404 }
            );
        }

        return Response.json(updatedSwimmer);
    } catch (error) {
        return Response.json(
            { error: "Failed to update swimmer" },
            { status: 500 }
        );
    }
}

export async function DELETE(request, { params }) {
    try {
        const { id } = await params;
        const success = deleteSwimmer(id);

        if (!success) {
            return Response.json(
                { error: "Swimmer not found" },
                { status: 404 }
            );
        }

        return Response.json({ success: true });
    } catch (error) {
        return Response.json(
            { error: "Failed to delete swimmer" },
            { status: 500 }
        );
    }
}