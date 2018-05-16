import { RDPModel } from "./RDPModel";
import { RDPController } from "./RDPController";
import { RDPView } from "./RDPView";

const view = new RDPView();
const model = new RDPModel();
const controller = new RDPController(model, view);

(<HTMLInputElement>document.getElementById("input-exp"))!.value = '(4+3)';

function start () {
    try{
        var input =(<HTMLInputElement>document.getElementById("input-exp"));
        controller.reinit(input.value);

        document.getElementById('visual')!.style.visibility='visible';
        document.getElementById('next')!.style.visibility='visible';
        
    }catch(e){
        document.getElementById('visual')!.style.visibility='hidden';
        document.getElementById('next')!.style.visibility='hidden';

        let alertMessage ='Please, enter a valid expression!';
        let errorMessage: string = e.message;
        if(errorMessage.indexOf('Expected') != -1) alertMessage += '\n' + errorMessage;
        alert(alertMessage);
    }
}

function next() {
    controller.next();
}

document.addEventListener('keyup', (e):any => {
    //console.log(e.key + '-' + e.keyCode);
    if(e.key == 'ArrowRight') {
        next();
    }else if(e.key == 'ArrowLeft') {
        //visualizer.prev();
    }else if(e.key =='Enter'){
        //start();
    }
});

document.getElementById('start')!.onclick= function() {
    start();
}

document.getElementById('next')!.onclick= function() {
    next();
}