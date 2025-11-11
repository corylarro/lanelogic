// Global swimmer roster - separate from meet-specific swimmers
let globalSwimmers = [
  {
    id: "gs1",
    first_name: "Sarah",
    last_name: "Johnson",
    team: "Dolphins",
    gender: "female",
    age: 14,
    birthdate: "2010-05-12",
    seedTime: "24.85",
  },
  {
    id: "gs2",
    first_name: "Mike",
    last_name: "Chen",
    team: "Sharks",
    gender: "male",
    age: 15,
    birthdate: "2009-08-23",
    seedTime: "23.12",
  },
  {
    id: "gs3",
    first_name: "Emma",
    last_name: "Rodriguez",
    team: "Waves",
    gender: "female",
    age: 13,
    birthdate: "2011-03-15",
    seedTime: "25.34",
  },
  {
    id: "gs4",
    first_name: "Alex",
    last_name: "Thompson",
    team: "Tigers",
    gender: "male",
    age: 16,
    birthdate: "2008-11-07",
    seedTime: "22.98",
  },
  {
    id: "gs5",
    first_name: "Jessica",
    last_name: "Lee",
    team: "Dolphins",
    gender: "female",
    age: 12,
    birthdate: "2012-01-30",
    seedTime: "26.12",
  },
];

let swimmerIdCounter = 6;

// Swimmer CRUD operations
export const getAllSwimmers = () => {
  return [...globalSwimmers];
};

export const getSwimmerById = (id) => {
  return globalSwimmers.find((swimmer) => swimmer.id === id);
};

export const addSwimmer = (swimmerData) => {
  const newSwimmer = {
    id: `gs${swimmerIdCounter++}`,
    first_name: swimmerData.first_name,
    last_name: swimmerData.last_name,
    team: swimmerData.team,
    gender: swimmerData.gender,
    age: parseInt(swimmerData.age),
    birthdate: swimmerData.birthdate || "",
    seedTime: swimmerData.seedTime || "",
  };

  globalSwimmers.push(newSwimmer);
  return newSwimmer;
};

export const updateSwimmer = (id, swimmerData) => {
  const index = globalSwimmers.findIndex((swimmer) => swimmer.id === id);
  if (index === -1) return null;

  globalSwimmers[index] = {
    ...globalSwimmers[index],
    first_name: swimmerData.first_name,
    last_name: swimmerData.last_name,
    team: swimmerData.team,
    gender: swimmerData.gender,
    age: parseInt(swimmerData.age),
    birthdate: swimmerData.birthdate || "",
    seedTime: swimmerData.seedTime || "",
  };

  return globalSwimmers[index];
};

export const deleteSwimmer = (id) => {
  const index = globalSwimmers.findIndex((swimmer) => swimmer.id === id);
  if (index === -1) return false;

  globalSwimmers.splice(index, 1);
  return true;
};

// Existing mockDB structure
export const mockDB = {
  meets: [
    {
      id: "meet-001",
      name: "Spring Championships 2024",
      date: "2024-03-15",
      venue: "Aquatic Center North",
      poolLength: 50,
      lanes: 8,
      description:
        "Annual spring championship meet featuring all age groups and strokes.",
      status: "upcoming",
      swimmers: [
        {
          id: "s1",
          name: "Sarah Johnson",
          team: "Dolphins",
          seedTime: "24.85",
          gender: "female",
          age: 14,
        },
        {
          id: "s2",
          name: "Mike Chen",
          team: "Sharks",
          seedTime: "23.12",
          gender: "male",
          age: 15,
        },
        {
          id: "s3",
          name: "Emma Rodriguez",
          team: "Waves",
          seedTime: "25.34",
          gender: "female",
          age: 13,
        },
        {
          id: "s4",
          name: "Alex Thompson",
          team: "Tigers",
          seedTime: "22.98",
          gender: "male",
          age: 16,
        },
        {
          id: "s5",
          name: "Jessica Lee",
          team: "Dolphins",
          seedTime: "26.12",
          gender: "female",
          age: 12,
        },
        {
          id: "s6",
          name: "Ryan Murphy",
          team: "Sharks",
          seedTime: "23.67",
          gender: "male",
          age: 14,
        },
        {
          id: "s7",
          name: "Sofia Martinez",
          team: "Waves",
          seedTime: "24.23",
          gender: "female",
          age: 15,
        },
        {
          id: "s8",
          name: "David Kim",
          team: "Tigers",
          seedTime: "25.89",
          gender: "male",
          age: 13,
        },
        {
          id: "s9",
          name: "Olivia Brown",
          team: "Dolphins",
          seedTime: "23.45",
          gender: "female",
          age: 16,
        },
        {
          id: "s10",
          name: "Lucas Wilson",
          team: "Sharks",
          seedTime: "24.56",
          gender: "male",
          age: 12,
        },
      ],
      events: [
        {
          id: "e1",
          name: "50 Freestyle",
          gender: "male",
          ageGroup: "Boys 12-14",
          distance: 50,
          stroke: "Freestyle",
        },
        {
          id: "e2",
          name: "50 Freestyle",
          gender: "female",
          ageGroup: "Girls 12-14",
          distance: 50,
          stroke: "Freestyle",
        },
        {
          id: "e3",
          name: "100 Backstroke",
          gender: "male",
          ageGroup: "Boys 15-17",
          distance: 100,
          stroke: "Backstroke",
        },
        {
          id: "e4",
          name: "100 Backstroke",
          gender: "female",
          ageGroup: "Girls 15-17",
          distance: 100,
          stroke: "Backstroke",
        },
        {
          id: "e5",
          name: "200 Butterfly",
          gender: "male",
          ageGroup: "Boys 13-15",
          distance: 200,
          stroke: "Butterfly",
        },
        {
          id: "e6",
          name: "200 Butterfly",
          gender: "female",
          ageGroup: "Girls 13-15",
          distance: 200,
          stroke: "Butterfly",
        },
      ],
      heats: {
        e1: [
          {
            heatNumber: 1,
            lanes: {
              1: null,
              2: {
                swimmerId: "s10",
                name: "Lucas Wilson",
                team: "Sharks",
                seedTime: "24.56",
              },
              3: {
                swimmerId: "s8",
                name: "David Kim",
                team: "Tigers",
                seedTime: "25.89",
              },
              4: {
                swimmerId: "s6",
                name: "Ryan Murphy",
                team: "Sharks",
                seedTime: "23.67",
              },
              5: {
                swimmerId: "s2",
                name: "Mike Chen",
                team: "Sharks",
                seedTime: "23.12",
              },
              6: null,
              7: null,
              8: null,
            },
          },
        ],
      },
      results: {
        e1: [
          {
            heatNumber: 1,
            results: [
              {
                swimmerId: "s2",
                name: "Mike Chen",
                team: "Sharks",
                lane: 5,
                finalTime: "23.05",
                place: 1,
              },
              {
                swimmerId: "s6",
                name: "Ryan Murphy",
                team: "Sharks",
                lane: 4,
                finalTime: "23.71",
                place: 2,
              },
              {
                swimmerId: "s10",
                name: "Lucas Wilson",
                team: "Sharks",
                lane: 2,
                finalTime: "24.62",
                place: 3,
              },
              {
                swimmerId: "s8",
                name: "David Kim",
                team: "Tigers",
                lane: 3,
                finalTime: "25.91",
                place: 4,
              },
            ],
          },
        ],
      },
    },
    {
      id: "meet-002",
      name: "Summer Invitational 2024",
      date: "2024-06-22",
      venue: "Regional Pool Complex",
      poolLength: 25,
      lanes: 6,
      description: "Mid-season invitational featuring regional club teams.",
      status: "draft",
      swimmers: [
        {
          id: "s11",
          name: "Maya Patel",
          team: "Stingrays",
          seedTime: "27.15",
          gender: "female",
          age: 13,
        },
        {
          id: "s12",
          name: "Connor O'Brien",
          team: "Marlins",
          seedTime: "24.89",
          gender: "male",
          age: 14,
        },
        {
          id: "s13",
          name: "Zoe Martinez",
          team: "Barracudas",
          seedTime: "26.34",
          gender: "female",
          age: 15,
        },
        {
          id: "s14",
          name: "Ethan Brooks",
          team: "Stingrays",
          seedTime: "23.76",
          gender: "male",
          age: 16,
        },
        {
          id: "s15",
          name: "Lily Chang",
          team: "Marlins",
          seedTime: "25.98",
          gender: "female",
          age: 12,
        },
        {
          id: "s16",
          name: "Noah Foster",
          team: "Barracudas",
          seedTime: "24.12",
          gender: "male",
          age: 13,
        },
      ],
      events: [
        {
          id: "e7",
          name: "25 Freestyle",
          gender: "male",
          ageGroup: "Boys 12-14",
          distance: 25,
          stroke: "Freestyle",
        },
        {
          id: "e8",
          name: "25 Freestyle",
          gender: "female",
          ageGroup: "Girls 12-14",
          distance: 25,
          stroke: "Freestyle",
        },
        {
          id: "e9",
          name: "50 Breaststroke",
          gender: "male",
          ageGroup: "Boys 15-17",
          distance: 50,
          stroke: "Breaststroke",
        },
        {
          id: "e10",
          name: "50 Breaststroke",
          gender: "female",
          ageGroup: "Girls 15-17",
          distance: 50,
          stroke: "Breaststroke",
        },
      ],
      heats: {},
      results: {},
    },
    {
      id: "meet-003",
      name: "Fall Classic 2024",
      date: "2024-09-14",
      venue: "Olympic Training Facility",
      poolLength: 50,
      lanes: 10,
      description:
        "Premier fall meet with top competitors from across the region.",
      status: "completed",
      swimmers: [
        {
          id: "s17",
          name: "Isabella Chen",
          team: "Lightning",
          seedTime: "22.87",
          gender: "female",
          age: 17,
        },
        {
          id: "s18",
          name: "Marcus Johnson",
          team: "Thunder",
          seedTime: "21.45",
          gender: "male",
          age: 18,
        },
        {
          id: "s19",
          name: "Aria Kim",
          team: "Storm",
          seedTime: "23.12",
          gender: "female",
          age: 16,
        },
        {
          id: "s20",
          name: "Cameron Davis",
          team: "Lightning",
          seedTime: "22.01",
          gender: "male",
          age: 17,
        },
      ],
      events: [
        {
          id: "e11",
          name: "50 Freestyle",
          gender: "male",
          ageGroup: "Boys 17-19",
          distance: 50,
          stroke: "Freestyle",
        },
        {
          id: "e12",
          name: "50 Freestyle",
          gender: "female",
          ageGroup: "Girls 17-19",
          distance: 50,
          stroke: "Freestyle",
        },
      ],
      heats: {},
      results: {
        e11: [
          {
            heatNumber: 1,
            results: [
              {
                swimmerId: "s18",
                name: "Marcus Johnson",
                team: "Thunder",
                lane: 5,
                finalTime: "21.32",
                place: 1,
              },
              {
                swimmerId: "s20",
                name: "Cameron Davis",
                team: "Lightning",
                lane: 4,
                finalTime: "21.98",
                place: 2,
              },
            ],
          },
        ],
        e12: [
          {
            heatNumber: 1,
            results: [
              {
                swimmerId: "s17",
                name: "Isabella Chen",
                team: "Lightning",
                lane: 5,
                finalTime: "22.76",
                place: 1,
              },
              {
                swimmerId: "s19",
                name: "Aria Kim",
                team: "Storm",
                lane: 4,
                finalTime: "23.05",
                place: 2,
              },
            ],
          },
        ],
      },
    },
  ],
  // Current app state
  activeContext: {
    selectedMeet: null,
    selectedEvent: null,
  },
};

// Helper functions for working with mock data
export const getMeets = () => mockDB.meets;

export const getMeetById = (id) => mockDB.meets.find((meet) => meet.id === id);

export const getSwimmersForMeet = (meetId) => {
  const meet = getMeetById(meetId);
  return meet ? meet.swimmers : [];
};

export const getEventsForMeet = (meetId) => {
  const meet = getMeetById(meetId);
  return meet ? meet.events : [];
};

export const getSwimmersForEvent = (meetId, eventId) => {
  const meet = getMeetById(meetId);
  if (!meet) return [];

  const event = meet.events.find((e) => e.id === eventId);
  if (!event) return [];

  return meet.swimmers.filter((swimmer) => {
    if (event.gender !== swimmer.gender) return false;
    // Simple age filtering - in real app this would be more sophisticated
    return true;
  });
};

export const saveHeatAssignments = (
  meetId,
  eventId,
  heatNumber,
  assignments,
) => {
  const meet = getMeetById(meetId);
  if (!meet) return false;

  if (!meet.heats[eventId]) {
    meet.heats[eventId] = [];
  }

  const heatIndex = meet.heats[eventId].findIndex(
    (h) => h.heatNumber === heatNumber,
  );
  const heatData = {
    heatNumber,
    lanes: assignments,
  };

  if (heatIndex >= 0) {
    meet.heats[eventId][heatIndex] = heatData;
  } else {
    meet.heats[eventId].push(heatData);
  }

  return true;
};

export const getHeatAssignments = (meetId, eventId, heatNumber) => {
  const meet = getMeetById(meetId);
  if (!meet || !meet.heats[eventId]) return null;

  const heat = meet.heats[eventId].find((h) => h.heatNumber === heatNumber);
  return heat ? heat.lanes : null;
};

export const saveResults = (meetId, eventId, heatNumber, results) => {
  const meet = getMeetById(meetId);
  if (!meet) return false;

  if (!meet.results[eventId]) {
    meet.results[eventId] = [];
  }

  const heatIndex = meet.results[eventId].findIndex(
    (h) => h.heatNumber === heatNumber,
  );
  const resultData = {
    heatNumber,
    results,
  };

  if (heatIndex >= 0) {
    meet.results[eventId][heatIndex] = resultData;
  } else {
    meet.results[eventId].push(resultData);
  }

  return true;
};

export const getResults = (meetId, eventId) => {
  const meet = getMeetById(meetId);
  if (!meet || !meet.results[eventId]) return [];

  return meet.results[eventId];
};