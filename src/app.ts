import { GeneticAlgorithmEngine } from './lib/engine';
export const app = new Promise( res => {
    console.log('listen');
    res();
    document.addEventListener('DOMContentLoaded', () => res() );
})
.then( () => {
    console.log('started');
    const canvas = document.getElementById("myCanvas") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");
    const imageObj = new Image();
    imageObj.src = 'images/troll_face.png';
    return new Promise( res => imageObj.onload = function() {
        ctx.drawImage(imageObj,0,0, 64, 64);
        res(ctx);
    });
} )
.then( (ctx: CanvasRenderingContext2D) => {
    const width = 64, height = 64;
    const imgData = ctx.getImageData(0,0,width,height);
    // console.log(imgData);
    const res = []; let currentRow = [];
    for ( let i = 0; i < imgData.data.length; i+=4 ) {
        if ( (i%256) === 252 ) {
            // console.log(currentRow);
            res.push(currentRow);
            currentRow = [];
        }
        currentRow.push(imgData.data[i]);
        // console.log(currentRow);
    }
    // console.log(res);
    return res;
}).then( (res) => {
    GeneticAlgorithmEngine.addPattern(res);
    const engine = new GeneticAlgorithmEngine();
    engine.start();
})
.catch( err => {
    console.error(err);
});