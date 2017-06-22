import { DEFAULT_RANGE } from './config';
/**
 * Функция визуализации матрицы, создает canvas и рендерит попиксельно матрицу
 * Пиксели в данном случае это некие квадраты имеющие свою ширину
 * @param matrix
 * @param id Идентификатор Матрицы
 * @param parent Родительский элемент куда рендерить
 */
export function renderMatrix( matrix, id = 'Эталон', parent = document.body ) {
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
    let c = document.getElementById(id) as HTMLCanvasElement;
    /**
     * Если не нашли елемент на странице, создадим его
     */
    if ( !(c instanceof HTMLCanvasElement) ) {
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
            let colorNumber = matrix[x][y]; // let rand1 = Math.random() > 0.5 ? 255 : 0;
            /**
             *  32 бита RGBA число
             * @type {number} 8 бит RED, 8 бит GREEN, 8 бит BLUE, 8 бит ALPHA( прозразность )
             */
            let color = colorNumber | colorNumber << 8 | colorNumber << 16 | (255 << 24);
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