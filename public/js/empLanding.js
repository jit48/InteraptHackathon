var showDetails=document.getElementById("showProjDetails");
var empProjDetails=document.getElementById("empProjDetails");
empProjDetails.classList.add('displayNone')

showDetails.addEventListener('click',()=>{
    empProjDetails.classList.toggle('displayNone');
})