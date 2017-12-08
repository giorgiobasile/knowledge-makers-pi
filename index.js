var Gpio = require('onoff').Gpio,
    buzzer = new Gpio(18, 'out'),
    pir = new Gpio(17, 'in', 'both');

pir.watch(function(err, value) {
    if (err) exit();
    buzzer.writeSync(value);
    console.log('Intruder detected');
    if(value === 1){
        console.log("You should do something");
    }
});

console.log('Knowledge Makers Pi Bot deployed successfully!');
console.log('Guarding the Magic door...');

function exit() {
    buzzer.unexport();
    pir.unexport();
    process.exit();
}