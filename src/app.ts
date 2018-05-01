import { RDPModel } from "./RDPModel";
import { RDPController } from "./RDPController";
import { RDPView } from "./RDPView";

const view = new RDPView();
const model = new RDPModel();
const controller = new RDPController(model, view);

document.addEventListener('keyup', (e):any => {
    //console.log(e.key + '-' + e.keyCode);
    if(e.key == 'ArrowRight') {
        controller.next();
    }else if(e.key == 'ArrowLeft') {
        //visualizer.prev();
    }
});


document.getElementById('start')!.onclick= function() {
    try{
        var input =(<HTMLInputElement>document.getElementById("inputExpression")).value;
        controller.reinit(input);

        var visual = document.getElementById('visual')!.style.visibility='visible';
        window.location.href='#code';
    }catch(e){
        var visual = document.getElementById('visual')!.style.visibility='hidden';
    }
    
}