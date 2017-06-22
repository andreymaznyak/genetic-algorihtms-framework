export const DEFAULT_RANGE = 256;
export const DEFAULT_POPULATION_LENGTH = 200;
export const DEFAULT_SELECTION_COUNT = 100;
export const DEFAULT_POPULATION_COUNT = 100;
export const DEFAULT_HAPPINESS_COUNT = 2;

/**
 * Функция определяет лучших особей
 * Считает количество различных пикселей
 * Чем меньше результат тем лучше
 *
 * @param instance Экзепляр
 * @param pattern Эталонный шаблон
 * @return {number}
 */
export function default_fitness( instance, pattern ) {
    let result = 0;

    instance.map( (row, x) =>
        row.map(
            (el, y) => {
                // console.log(result);
                let diff = Math.abs((el - pattern[x][y]));
                result += isNaN(diff) ? 0 : diff;
            }
        )
    );
    // console.log('FITNESS', result);
    return result;
}
