// types/index.ts

export type Draw = {
  date: string;
  allPlayers: string[];
  teamA: string[];
  teamB: string[];
};

export type ApiParticipator = {
  isComing: "yes" | "no" | string;
  member: {
    firstName: string;
    lastName: string;
  };
};

export type EventOccurrence = {
  participators: ApiParticipator[];
};
