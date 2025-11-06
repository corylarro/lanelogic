import { useState, useEffect } from "react";

export function useHeatBuilder(totalLanes, selectedEvent) {
  const [currentHeat, setCurrentHeat] = useState(1);
  const [laneAssignments, setLaneAssignments] = useState({});
  const [draggedSwimmer, setDraggedSwimmer] = useState(null);
  const [dragOverLane, setDragOverLane] = useState(null);

  useEffect(() => {
    if (selectedEvent) {
      const initialLanes = {};
      for (let i = 1; i <= totalLanes; i++) {
        initialLanes[i] = null;
      }
      setLaneAssignments(initialLanes);
      setCurrentHeat(1);
    }
  }, [selectedEvent, totalLanes]);

  const handleDragStart = (e, swimmer) => {
    setDraggedSwimmer(swimmer);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e, laneNumber) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverLane(laneNumber);
  };

  const handleDragLeave = () => {
    setDragOverLane(null);
  };

  const handleDrop = (e, laneNumber) => {
    e.preventDefault();
    setDragOverLane(null);

    if (!draggedSwimmer) return;

    const currentLaneAssignments = { ...laneAssignments };
    Object.keys(currentLaneAssignments).forEach((lane) => {
      if (currentLaneAssignments[lane]?.id === draggedSwimmer.id) {
        currentLaneAssignments[lane] = null;
      }
    });

    currentLaneAssignments[laneNumber] = draggedSwimmer;
    setLaneAssignments(currentLaneAssignments);
    setDraggedSwimmer(null);
  };

  const removeSwimmerFromLane = (laneNumber) => {
    setLaneAssignments((prev) => ({
      ...prev,
      [laneNumber]: null,
    }));
  };

  const clearHeat = () => {
    const emptyLanes = {};
    for (let i = 1; i <= totalLanes; i++) {
      emptyLanes[i] = null;
    }
    setLaneAssignments(emptyLanes);
  };

  const autoAssignLanes = (unassignedSwimmers) => {
    const unassigned = [...unassignedSwimmers].sort(
      (a, b) => parseFloat(a.seedTime) - parseFloat(b.seedTime),
    );

    const newAssignments = { ...laneAssignments };
    const centerLanes = [4, 5, 3, 6, 2, 7, 1, 8];

    for (let i = 1; i <= totalLanes; i++) {
      newAssignments[i] = null;
    }

    unassigned.forEach((swimmer, index) => {
      if (index < totalLanes) {
        const laneNumber = centerLanes[index] || index + 1;
        newAssignments[laneNumber] = swimmer;
      }
    });

    setLaneAssignments(newAssignments);
  };

  return {
    currentHeat,
    setCurrentHeat,
    laneAssignments,
    draggedSwimmer,
    dragOverLane,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    removeSwimmerFromLane,
    clearHeat,
    autoAssignLanes,
  };
}
