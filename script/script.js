// function toggleBlink(){
//     var nameElement = document.getElementById(`blinking-name`);
//     nameElement.classList.toggle('hidden');
// }setInterval(toggleBlink,500);


function typeEffect(element,speed){
    let text = element.innerHTML;
    element.innerHTML="";
    
    let i= 0;
    let timer = setInterval(function(){
        if(i<text.length){
            element.append(text.charAt(i));
            i++;
        }else{
            clearInterval(timer);
        }
    },speed);
}
const nameElement = document.getElementById('blinking-name');
typeEffect(nameElement,200);