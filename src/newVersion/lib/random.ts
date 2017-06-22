export function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

export function randomString(len, charSet) {
    // other solution btoa(Math.random().toString(8).substr(2))
    charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';
    for (let i = len; i--;) {
        let randomPoz = Math.floor(Math.random() * charSet.length);
        randomString += charSet.substring(randomPoz,randomPoz+1);
    }
    return randomString;
}
/**
 *
 * @param vector
 * @return {ArrayBuffer}
 * @test let floatArray = new Float64Array(vector);
 *       for ( let i = vector.byteLength / 4; i--;){
 *          floatArray[i] = Math.random();
 *       }
 *       let uintArr = new Uint8Array(vector).sort( (a,b)=>a-b )
 */
export function randomVector(vector: ArrayBuffer) {
    let floatArray = new Float64Array(vector);
    for ( let i = vector.byteLength / 4; i--;){
        floatArray[i] = Math.random();
    }
    return vector;
}
