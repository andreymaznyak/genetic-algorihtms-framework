import { Person, PersonOptions } from './person';
import { getRandomInt } from './random';

export interface PopulationOptions {
    /**
     * @description Количество особей
     */
    length: number;
    /**
     * @description Массив начальных особей, если не задан генерируется новый
     */
    persons?: Person[];
    /**
     * @description Если не задан массив начальных особей для генерации новых нужны опции
     */
    personOptions?: PersonOptions;

}
/**
 * @description Популяция, состоит из множества особей
 */
export class Population {
    constructor(options: PopulationOptions) {
        // если не заданы особи генерируем новые
        if ( options.persons instanceof Array ) {
            this.persons = options.persons;
        } else {
            this.persons = [];
            for ( let i = options.length; i--;) {
                this.persons.push(new Person(options.personOptions))
            }
        }
    }
    persons: Person[];
    mutation( mutationPersonsCount = 1, mutationGenesCount = 1 ) {
        for( let i = mutationPersonsCount; i--;){
            this.persons[getRandomInt(this.persons.length)].mutation( mutationGenesCount );
        }
        return this;
    }
    // TODO: Сделать механизм смешивания популяций
    merge( otherPopulation: Population ) {

    }
    sort(sortFn) {
        this.persons = this.persons.sort(sortFn);
        return this;
    }

}