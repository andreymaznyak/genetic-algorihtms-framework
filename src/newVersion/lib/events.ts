export declare type GeneticEngineEvent = "beforeCrossover" | "startCrossover" | "afterCrossover" | "beforeSelection" | "afterSelection" | "beforeCheck" | "afterCheck";

export class GeneticEngineEvents {
    static BEFORE_CROSSOVER: GeneticEngineEvent = "beforeCrossover";
    static START_CROSSOVER: GeneticEngineEvent = "startCrossover";
    static AFTER_CROSSOVER: GeneticEngineEvent = "afterCrossover";
    static BEFORE_SELECTION: GeneticEngineEvent = "beforeSelection";
    static AFTER_SELECTION: GeneticEngineEvent = "afterSelection";
    static BEFORE_CHECK: GeneticEngineEvent = "beforeCheck";
    static AFTER_CHECK: GeneticEngineEvent = "afterCheck";
}
