const sde = document.getElementById('SDE');
const designer = document.getElementById('FDE');


sde.addEventListener('change', ()=>{
    if(document.getElementById('SDE').checked){
        document.getElementById('sde-checkbox').style.display = "block";
    }else{
        document.getElementById('sde-checkbox').style.display = "none";
    }
})


designer.addEventListener('change', ()=>{
    if(document.getElementById('FDE').checked){
        document.getElementById('designer-checkbox').style.display = "block";
    }else{
        document.getElementById('designer-checkbox').style.display = "none";
    }
})
