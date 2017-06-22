import { Person } from './person';
import { renderMatrix } from './visualization';
import { getRandomInt } from './utils';
import { DEFAULT_SELECTION_COUNT, DEFAULT_POPULATION_LENGTH, DEFAULT_RANGE } from './config';
import { GeneticAlgorithmEngine } from './engine';
export class Population extends Array {

    private populationLength: number;
    private selectionCount: number;

    /**
     * Генерируем случаный особей до нужного размера
     * @return {Population}
     */
    init() {
        for ( let i = 0; this.length < this.populationLength; i++) {
            let person = new Person(GeneticAlgorithmEngine.currentPattern.length);
            this.push(person);
        }
        return this;
    }

    get changes() {
        return this.reduce( ( previous, current ) => previous + +current.changes, 0);
    }

    constructor(length = DEFAULT_POPULATION_LENGTH, selectionCount = DEFAULT_SELECTION_COUNT){
        super();
        this.populationLength = length;
        this.selectionCount = selectionCount;
        // this.init();
        for ( let i = 0; this.length < this.populationLength; i++) {
            let person = new Person(GeneticAlgorithmEngine.currentPattern.length);
            this.push(person);
        }
    }


    selection() {
        // const happiness = [];
        // for ( let i = 0; i < HAPPINESS_COUNT; i++ ) {
        //     happiness.push(this[getRandomInt(SELECTION_COUNT + 1, this.length)]);
        // }
        Array.prototype.splice.call(this, 0, this.selectionCount).map(
            (val, i) => this[i] = val
        );
        // happiness.map(
        //     val => this.push(val)
        // );
        // this.length = SELECTION_COUNT;
        return this;
    }

    mutation() {
        // this.filter( (...args) => args[1] > this.length / 2 ).map(
        //     el => el.mutation()
        // );
        this.init();
        return this;
    }
    crossing() {
        let childs = [];
        for ( let i = 0; childs.length < this.populationLength; i = (i + 1) % this.length ) {
            let pairsOne = i;
            while(pairsOne === i) pairsOne = getRandomInt(0, this.length);
            let child = this[i].merge(this[pairsOne]);
            childs.push(child);
        }
        childs = childs.sort(
            (l, r) => l.fitness - r.fitness
        ).splice(0, this.populationLength)
            .map(
                (el, i) => this[i] = el
            );
        this.length = childs.length;
        return this;
    }

    differentialEvolution() {
        let count = 0;
        this.map( (person, index) => {
            const pairs1 = this[Population.generateRandomIndex(index, this.length)],
                  pairs2 = this[Population.generateRandomIndex(index, this.length)],
                  pairs3 = this[Population.generateRandomIndex(index, this.length)],
                  F = 1;
            /**
             * v = v1 + F * (v2 - v3)
             */
            let v = person.map( () => [] );
            for ( let i = person.length; i--; ) {
                for( let j = person.length; j--; ) {
                    v[i][j] = Math.floor(pairs1[i][j] + F * (pairs2[i][j] - pairs3[i][j])) % DEFAULT_RANGE;
                }
            }
            let mutated = new Person( v );
            if ( mutated.fitness < person.fitness ) {
                mutated = person.merge(mutated);
                if ( mutated.fitness < person.fitness ) {
                    this[index] = mutated;
                    count++;
                }
            }
        });
        // console.log('BestElementCount', count);
        return this;
    }

    render(idPrefix = '', parent = document.body) {
        // for ( let i = 0; i < this.length; i++ ) {
        //
        // }
        renderMatrix(
                this[0],
                `${idPrefix}P${0+1}`,
                parent
            );
        return this;
    }
    sort(sortFn) {
        Array.prototype.sort.call(this, sortFn).map(
            (val, i) => this[i] = val
        );
        return this;
    }

    static generateRandomIndex( originIndex, maximum ) {
        let randomIndex = originIndex;
        while(randomIndex === originIndex) randomIndex = getRandomInt(0, maximum);
        return randomIndex;
    }
}