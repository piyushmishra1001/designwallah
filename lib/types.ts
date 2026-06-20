export type FlowStep = {
  order: number;
  name: string;
  user_action: string;
  system_response: string;
  state: "happy_path" | "decision_point";
};

export type EdgeCase = {
  category:
    | "empty_state"
    | "error_state"
    | "permissions_auth"
    | "network_offline"
    | "concurrency_timing"
    | "accessibility";
  title: string;
  scenario: string;
  suggested_handling: string;
  severity: "low" | "medium" | "high";
};

export type OpenQuestion = {
  question: string;
  why_it_matters: string;
};

export type GenerationResult = {
  feature_summary: string;
  flow: FlowStep[];
  edge_cases: EdgeCase[];
  open_questions: OpenQuestion[];
};
