import { ActantType, ActantStatus, Language, Certainty, Elvl, Logic, Mood, MoodVariant, Operator, Partitivity, Virtuality } from "../enums";


export interface IProp {
    id: string;
    elvl: Elvl;
    certainty: Certainty;
    logic: Logic;
    mood: Mood[];
    moodvariant: MoodVariant;
    operator: Operator;
    bundleStart: boolean;
    bundleEnd: boolean;
  
    childOf?: string;
  
    type: {
      id: string;
      elvl: Elvl;
      logic: Logic;
      virtuality: Virtuality;
      partitivity: Partitivity;
    };
    value: {
      id: string;
      elvl: Elvl;
      logic: Logic;
      virtuality: Virtuality;
      partitivity: Partitivity;
    };
  }