import { getRandomInt } from './utils';
import { DEFAULT_RANGE, default_fitness } from './config';
import { renderMatrix } from './visualization';
import { GeneticAlgorithmEngine } from './engine';

export class Person extends Array {
    private _fitness: number;
    private changes: number;
    private fitnessFn: Function;
    get fitness() {
        return this._fitness ? this._fitness : this.calculateFitness();
    }
    set fitness(newFitness) {
        this._fitness = newFitness;
    }
    constructor( options: number, changes?:number, fitnessFn?:Function );
    constructor( options: any[][], changes?:number, fitnessFn?:Function );
    constructor( options, changes = 1, fitnessFn = default_fitness ){
        super();
        this.fitnessFn = fitnessFn;
        if( options instanceof Array ) {
            options.map( (row, x) => {
                this[x] = row;
            })
        } else {
            for (let x = 0; x < options; x++ ) {
                this.push([]);
                for (let y = 0; y < options; y++ ) {
                    this[x][y] = getRandomInt(0, DEFAULT_RANGE);
                }
            }
        }
        this.changes = changes;
    }
    calculateFitness() {
        this._fitness = this.fitnessFn( this, GeneticAlgorithmEngine.currentPattern );
        return this._fitness;
    }
    /**
     * Функция мутации
     * @param instance
     * @return {Array}
     */
    mutation() {
        /**
         * Шанс мутировать каждого отдельного пикселя
         * @type {number}
         */
        const MUTATION_CHANCE = 100;
        return this.map( (row, x) =>
            row.map(
                (el, y) => {
                    if ( !Math.floor(Math.random() * MUTATION_CHANCE) ) {
                        this[x][y] = !(Math.floor(Math.random() * 2) % 2) ? 0 : DEFAULT_RANGE;
                        // console.log('MUTATION');
                    }
                }
            )
        );
    }
    merge( target ): Person {
        let changes = 0;
        const matrix = this.map( (row, x) =>
            row.map(
                (el, y) => {
                    if ( el !== target[x][y] ) {
                        /**
                         * Выбираем ген
                         */
                        changes++;
                    }
                    return !Math.floor(Math.random() * 2) ? el : target[x][y];
                    // return Math.floor(((el + right[x][y]) / 2) % RANGE);
                }/**/
            )
        );
        return new Person( matrix, changes );
    }
    render(id, parent) {
        renderMatrix(this, id, parent);
        return this;
    }
}