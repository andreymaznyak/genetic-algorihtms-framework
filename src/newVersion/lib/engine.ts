import { Population, PopulationOptions } from './population';
import { EventEmitter } from './utils';
import { GeneticEngineEvent, GeneticEngineEvents } from './events';
import { Person } from './person';
import { CROSSOVER_FUNCTIONS } from './config/default';
/**
 * Функция формирует новое поколение
 */
export interface CrossoverFn {
    (population: Population): Population
}
/**
 * Фукнция выбырает особь из популяции
 */
export interface SelectionFn {
    (population: Population): Person
}

export interface GeneticEngineOptions {
    /**
     * @description Опции популяции
     */
    populationOptions: PopulationOptions;
    /**
     * @description Количество популяций, по умолчанию 1
     */
    populationsLength?: number;
    crossoverFn?: CrossoverFn;
}

/**
 * @description Класс эволюционного алгоритма
 */
export class GeneticEngine {
    crossoverFn: CrossoverFn;
    constructor( options: GeneticEngineOptions ) {
        const populationLength = options.populationsLength || 1;
        /**
         * Формируем начальную популяцию
         */
        for( let i = populationLength; i--; ){
            this.populations.push( new Population(options.populationOptions ) );
        }
        /**
         * Регистрируем функции
         */
        this.crossoverFn = options.crossoverFn || CROSSOVER_FUNCTIONS.defaultCrossover;
        this.events.on(GeneticEngineEvents.START_CROSSOVER, () => {
            this.populations.map(
                population => this.crossoverFn(population)
            );
        });
    }
    /**
     * Популяции в алгоритме
     */
    populations: Population[] = [];

    eventsSequence: GeneticEngineEvent[] = [
        GeneticEngineEvents.BEFORE_CROSSOVER,
        GeneticEngineEvents.START_CROSSOVER,
        GeneticEngineEvents.AFTER_CROSSOVER,
    ];

    events: EventEmitter;

    loop() {
        try {
            this.eventsSequence.map(
                event => this.events.emit(event)
            );
        } catch ( e ) {
            console.warn( e );
        }

    }

}