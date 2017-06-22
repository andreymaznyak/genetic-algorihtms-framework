import { Population } from '../population';
import { Person } from '../person';
import { getRandomInt } from '../random';

export const CROSSOVER_FUNCTIONS = {
    /**
     * @description Формируем новую популяцию, такого же размера как и старая,
     *              одну особь выбираем методом рулетки, другую турнирным
     * @param populate
     */
    defaultCrossover: ( populate: Population ) => {
        populate.persons = populate.persons.map(
            () => SELECTION_FUNCTIONS
                    .tournamentSelection(populate)
                    .merge(SELECTION_FUNCTIONS.fitnessProportionateSelection(populate))
        );
        return populate;
    },
    simplexCrossover: ( populate: Population ) => {

    },

};
export const SELECTION_FUNCTIONS = {
    /**
     * @description  C начала случайно выбираем две особи, а затем из них выбираем особь
     *               с лучшим значением функции приспособленности
     * @param populate
     * @return {Person}
     */
    tournamentSelection: ( populate: Population ) => {
        const first = populate.persons[getRandomInt(populate.persons.length)],
              second = populate.persons[getRandomInt(populate.persons.length)];
        return first.fitness > second.fitness ? first : second;
    },
    /**
     * @description Алгоритм рулетки, суть посчитаем сумму фитнесс функции всех элементов
     *              фитнес функция каждого, деленная на общую сумму - это вероятность быть выбранным
     * @param populate
     * @return person
     */
    fitnessProportionateSelection: ( populate: Population ) => {
        let fitnessSum = populate.persons.reduce( (fitnessSum, person) => fitnessSum + person.fitness, 0 );

        let val = Math.random() * fitnessSum;
        let index = populate.sort( (a, b) => a.fitness - b.fitness ).persons.findIndex( person => (val -= person.fitness) < 0 );
        return populate[index > 0 ? index : populate.persons.length]

    },
    boltzmannSelection: ( populate: Population ) => {

    },
    /**
     * @description Метод ранжирования - вероятность выбора зависит от места в списке особей отсортированном
     *              по значению функции приспособленности:
     *              pi = 1/N * (a-(a-b) * (i - 1)/(N - 1))
     *              где a = [1...2], b = 2 - a, i - порядковый номер особи в списке особей отсортированном
     *              по значению функции приспособленности
     * @param populate
     */
    rankSelection: ( populate: Population ) => {

    },
    steadyStateSelection: ( populate: Population ) => {

    },
    /**
     * @description Сигма отсечение для предотвращения преждевременной сходимости генетического алгоритма
     *              используются методы, масштабирующие значение целевой функции. Вероятность выбора особи тем больше,
     *              чем оптимальнее значение масштабируемой целевой функции:
     *              pi = Fi/(F1 + ... + Fn) где Fi=1+(fi + f сред)/2q
     *              f - среднее значение целевой функции для всей популяции
     *              q - среднеквадратичное отклонение значения целевой функции
     * @param populate
     * @return person
     */
    truncationSelection: ( populate: Population ) => {

    },
    localSelection: ( populate: Population ) => {

    },
};