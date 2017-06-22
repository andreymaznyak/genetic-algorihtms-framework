import { randomVector, getRandomInt } from './random';

export interface FitnessFn {
    ( vector: ArrayBuffer ): number
}

export interface PersonOptions {
    vectorLength?: number;
    vector?: ArrayBuffer;
    fitnessFn: FitnessFn;
}

/**
 * @description Класс особи, имеет набор генов, к нему применяется
 *              функция фитнеса
 */
export class Person {
    /**
     * @description Фитнес функция
     */
    fitnessFn: FitnessFn;
    constructor(options: PersonOptions) {
        this.fitnessFn = options.fitnessFn;
        if ( options.vector instanceof ArrayBuffer ) {
            this.vector = options.vector;
        } else {
            if (!options.vectorLength) {
                throw 'EMPTY PERSON VECTOR';
            }
            /**
             * Генерируем новый вектор если не задан
             */
            this.vector = new ArrayBuffer(options.vectorLength);
            randomVector(this.vector);
        }
        /**
         * Посчитаем фитнес функцию
         * @type {number}
         */
        this.fitness = this.fitnessFn(this.vector);
    }
    /**
     * @description вектор генов
     */
    vector: ArrayBuffer;
    /**
     * @description значение приспособленности
     */
    fitness: number;

    /**
     * @description Функция рекомбинации генов двух особей
     * TODO: По хорошему рекомбинировать каждый бит(сейчас побайтно рекомбинируются)
     * @param fatherParent
     * @return {Person} Новая особь
     */
    merge( fatherParent: Person ) {
        const mother = new Uint32Array(this.vector),
              father = new Uint32Array(fatherParent.vector),
              childVector  = new ArrayBuffer(this.vector.byteLength),
              child  = new Uint32Array(childVector);
        /**
         * Самый интересный момент рекомбинация генов нужно взять часть генов от одного родителя и часть
         * от другого
         */
        for ( let i = this.vector.byteLength; i--;) {
            child[i] = !Math.floor(Math.random() * 2) ? father[i] : mother[i];
        }
        return new Person({ fitnessFn: this.fitnessFn, vector: childVector });
    }

    /**
     * @description Функция мутации выбирает случайный байт из вектора и заполняет его слуйчаным числом
     * TODO: По хорошему менять не байт, а бит.
     * @param mutationCount Количество мутаций, по умолчанию 1
     * @return {Person} Текущая особь
     */
    mutation( mutationCount = 1 ) {
        for( let i = mutationCount; i--;){
            new Uint8Array(this.vector)[getRandomInt(this.vector.byteLength)] = getRandomInt(256);
        }
        return this;
    }
}