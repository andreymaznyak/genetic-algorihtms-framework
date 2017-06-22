/**
 * @deprecated СТАРЫЙ ФАЙЛ НАРАБОТОК, НЕ ИСПОЛЬЗОВАТЬ!!!
 */

class Person extends Array{
    get fitness() {
        return this._fitness ? this._fitness : this.calculateFitness();
    }
    constructor( matrix, changes = 1 ){
        super();
        if( matrix instanceof Array ) {
            matrix.map( (row, x) => {
                this[x] = row;
            })
        } else {
            for (let x = 0; x < currentPattern.length; x++ ) {
                this.push([]);
                for (let y = 0; y < currentPattern.length; y++ ) {
                    this[x][y] = getRandomInt(0, RANGE + 1);
                }
            }
        }
        this.changes = changes;
    }
    calculateFitness() {
        this._fitness = fitness(this, currentPattern);
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
                        this[x][y] = !(Math.floor(Math.random() * 2) % 2) ? 0 : RANGE;
                        // console.log('MUTATION');
                    }
                }
            )
        );
    }
    merge( target ) {
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


const RANGE = 1;
const PATTERNS = [new Person([
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, RANGE, RANGE, 0, 0, 0, 0, 0, 0],
        [0, RANGE, RANGE, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
    ]),
    new Person([
        [0, RANGE, 0, 0, 0, 0, 0, 0],
        [0, 0, RANGE, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, RANGE, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, RANGE, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, RANGE, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, RANGE, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, RANGE, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, RANGE],
    ]),
    new Person([
        [0, RANGE, 0, 0, 0, 0, 0, RANGE],
        [0, 0, RANGE, 0, 0, 0, RANGE, 0, 0],
        [0, 0, 0, RANGE, 0, RANGE, 0, 0, 0],
        [0, 0, 0, 0, RANGE, 0, 0, 0, 0],
        [0, 0, 0, RANGE, 0, RANGE, 0, 0, 0],
        [0, 0, RANGE, 0, 0, 0, RANGE, 0, 0],
        [0, RANGE, 0, 0, 0, 0, 0, RANGE, 0],
        [RANGE, 0, 0, 0, 0, 0, 0, 0, RANGE],
    ]),
];
let currentPattern = PATTERNS[0];

const POPULATION_LENGTH = 100;
const SELECTION_COUNT = 50;
const POPULATION_COUNT = 100;
const HAPPINESS_COUNT = 2;

new Promise( res => {
    document.addEventListener('DOMContentLoaded', function () {
        res();
    });
})
.then( () => {
    renderMatrix(
        currentPattern,
        'pattern',
        document.getElementById('patternContainer')
    );
    let population = new Population()
        .sort(
            (l, r) => l.fitness - r.fitness
        ).render();
    tick(population);
} )
.catch( err => {
    console.error(err);
});

function tick(population) {
    // let div = document.createElement('div');
    console.log('CHANGES', population.changes);
    /**
     * Если изменений нет популяция выродилась :( нужна встряска
     * Размер встряски должен зависеть от нашей фитнесс функции
     * Чем дальше результат тем больше встряска
     */
    if ( population.changes < POPULATION_LENGTH * 2 ) {
        console.warn('Нужна встряска');
        population.mutation().mutation().mutation().selection().crossing().render(''/*, div*/);
    } else {
        population.selection().crossing().render(''/*, div*/);
    }

    // document.body.appendChild(div);
    if ( !!population[0].fitness ) {
        setTimeout(
            () => tick(population),
            50
        )
    } else {
        console.log("REREMDER");
        currentPattern = PATTERNS[(PATTERNS.indexOf(currentPattern) + 1) % PATTERNS.length].render('pattern', document.getElementById('patternContainer'));
        setTimeout(
            () => tick(population),
            5000
        )
    }
}

class Population extends Array {

    get changes() {
        return this.reduce( ( previous, current ) => previous + +current.changes, 0);
    }

    constructor(length = POPULATION_LENGTH){
        super();
        this.init();
    }

    /**
     * Генерируем случаный особей до нужного размера
     * @return {Population}
     */
    init() {
        for ( let i = 0; this.length < POPULATION_LENGTH; i++) {
            let person = new Person();
            this.push(person);
        }
        return this;
    }
    render(idPrefix = '', parent = document.body) {
        for ( let i = 0; i < this.length; i++ ) {
            renderMatrix(
                this[i],
                `${idPrefix}P${i+1}`,
                parent
            );
        }
        return this;
    }
    sort(sortFn) {
        Array.prototype.sort.call(this, sortFn).map(
            (val, i) => this[i] = val
        );
        return this;
    }
    selection() {
        // const happiness = [];
        // for ( let i = 0; i < HAPPINESS_COUNT; i++ ) {
        //     happiness.push(this[getRandomInt(SELECTION_COUNT + 1, this.length)]);
        // }
        Array.prototype.splice.call(this, 0, SELECTION_COUNT).map(
            (val, i) => this[i] = val
        );
        // happiness.map(
        //     val => this.push(val)
        // );
        // this.length = SELECTION_COUNT;
        return this;
    }
    mutation() {
        this.filter( (...args) => args[1] > this.length / 2 ).map(
            el => el.mutation()
        );
        return this;
    }
    crossing() {
        let childs = [];
        for ( let i = 0; childs.length < POPULATION_LENGTH; i = (i + 1) % this.length ) {
            let pairsOne = i;
            while(pairsOne === i) pairsOne = getRandomInt(0, this.length);
            let child = this[i].merge(this[pairsOne]);
            childs.push(child);
        }
        childs = childs.sort(
            (l, r) => l.fitness - r.fitness
        ).splice(0, POPULATION_LENGTH)
        .map(
            (el, i) => this[i] = el
        );
        this.length = childs.length;
        return this;
    }
}
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * Скрещиваем двух особей
 * @param left левый потомок
 * @param right правый потомок
 */
function merge( left, right ) {
    return left.map( (row, x) =>
        row.map(
            (el, y) => {
                if ( el !== right[x][y] ) {
                /**
                 * Выбираем ген
                 */
                console.log('CHANGES');
                }
                return !Math.floor(Math.random() * 2) ? el : right[x][y];
                // return Math.floor(((el + right[x][y]) / 2) % RANGE);
            }/**/
        )
    )
}


/**
 * Функция определяет лучших особей
 * Считает количество различных пикселей
 * Чем меньше результат тем лучше
 *
 * @param instance Экзепляр
 * @param pattern Эталонный шаблон
 * @return {number}
 */
function fitness( instance, pattern ) {
    let result = 0;

    instance.map( (row, x) =>
       row.map(
           (el, y) => result += Math.abs((el - pattern[x][y]) * RANGE)
       )
    );
    // console.log('FITNESS', result);
    return result;
}

/**
 * Функция визуализации матрицы, создает canvas и рендерит попиксельно матрицу
 * Пиксели в данном случае это некие квадраты имеющие свою ширину
 * @param matrix
 * @param id Идентификатор Матрицы
 * @param parent Родительский элемент куда рендерить
 */
function renderMatrix( matrix, id = 'Эталон', parent = document.body ) {
    /**
     * x и y размерность матрицы (картинки)
     */
    const COUNT_X = matrix.length, COUNT_Y = matrix.length;
    /**
     * размерность пикселя
     * @type {number}
     */
    const WIDTH = 10;
    /**
     * площадь пикселя
     * @type {number}
     */
    const Q_WIDTH = WIDTH * WIDTH;
    let c = document.getElementById(id);
    /**
     * Если не нашли елемент на странице, создадим его
     */
    if ( !(c instanceof HTMLElement) ) {
        let div=document.createElement('div');
        div.className = "person";
        div.innerHTML = `<p>${id}</p><p id="p${id}"></p>`;
        c=document.createElement('canvas');
        div.appendChild(c);
        parent.appendChild(div);
    }
    document.getElementById('p'+id).innerText = matrix.fitness;
    c.id = id;
    c.width = COUNT_X * WIDTH + 10;
    c.height = COUNT_Y * WIDTH + 10;
    const ctx=c.getContext("2d");
    const imgData=ctx.createImageData(COUNT_X *  WIDTH, COUNT_Y *  WIDTH);

    /**
     *  цикл по строкам
     */
    for ( let x = 0; x < COUNT_X; x++ ) {
        /**
         * Создадим по буфферу на каждую строку, один пиксель кодируется 4мя байтами
         * @type {Int32Array}
         */
        let arr = new Int32Array(imgData.data.buffer, x * 4 * Q_WIDTH * COUNT_X, /*4 * */Q_WIDTH * COUNT_X);
        // цикл по столбцам
        for ( let y = 0; y < COUNT_Y; y++ ) {
            //Рендерим x,y пиксель
            /**
             * Число отвечающий за цвет
             * цвет нужно брать из из оригинальной матрицы
             * @type {number}
             */
            let colorNumber = matrix[x][y] * 255/RANGE; // let rand1 = Math.random() > 0.5 ? 255 : 0;
            /**
             *  32 бита RGBA число
              * @type {number} 8 бит RED, 8 бит GREEN, 8 бит BLUE, 8 бит ALPHA( прозразность )
             */
            let color = colorNumber | colorNumber << 8 | colorNumber << 16 | 255 << 24;
            // let color = 255 | rand1 << 8 | rand2 << 16 | 255 << 24;
            /**
             * Заполняем оригинальный буффер строки пискселей
             */
            for ( let j = 0; j < WIDTH; j++) {
                for ( let i = y * WIDTH; i < (y+1)*WIDTH; i++ ) {
                    arr[i + (j*WIDTH*COUNT_X)] = color;
                }
            }
        }
    }
    ctx.putImageData(imgData, COUNT_X, COUNT_Y);

}