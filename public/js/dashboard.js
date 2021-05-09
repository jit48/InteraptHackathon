// const search = document.getElementById('find');
// const empSearch = document.getElementById('empSearch');
// const projSearch = document.getElementById('projSearch');
// const projResults = document.getElementById('projResults');
// const empResults = document.getElementById('empResults');
// const Results = document.getElementById('Results');
// let searchText = search.value;
// window.addEventListener('load',()=>{
//     data();
// })
   
// // search.addEventListener('click',()=>{
// //     search.classList.toggle('extendWidth');
// // })

// empSearch.addEventListener('click', ()=>{
//     empResults.classList.remove('displayNone')
//     projResults.classList.add('displayNone')
//     empData();
//     matches = [];
//     async function getEmpData(searchText){
//         const res = await fetch('http://localhost:3000/employees');
//         const data = await res.json();
//         let matches = data.filter(d => {
//             const regex = new RegExp(`^${searchText.toString()}`,'gi');
//             return d.username.match(regex) ||  d._id.match(regex) || d.location.match(regex) || d.vendor.match(regex) 
//         })
//         Results.classList.add('displayNone');
//         outputHtml(matches);
//     }
    
//     search.addEventListener('input', ()=>{
//         getEmpData(search.value)});

// })

// projSearch.addEventListener('click', ()=>{
//     projResults.classList.remove('displayNone');
//     empResults.classList.add('displayNone');
//     matches = []
//     async function getProjData(searchText){
//         console.log(searchText);
//         const res = await fetch('http://localhost:3000/projectData');
//         const data = await res.json();
//         let matches = data.filter(d => {
//             const regex = new RegExp(`^${searchText.toString()}`,'gi');
//             return d.projectName.match(regex) || d.projectId.match(regex) || d.location.match(regex)
//         })
//         console.log(matches);
//         Results.classList.add('displayNone');
//         outputHtmlProject(matches);
//     }
//     search.addEventListener('input', ()=>{
//         betterFunction()});

//         const getDebouncedData = function(fn,d){
//             let timer
//             return function(){
//                  clearInterval(timer)
//                 timer = setTimeout(()=>{
//                      getProjData(search.value)
//                  },d)
//             }
//         }
//     const betterFunction = getDebouncedData(getProjData,300)
 
// })


// function outputHtml(matches){
//     if(matches.length > 0){
//         const html = matches.map(match => (
//             `<div class="projectCard">
//                 <div class="projectDetails">
//                     <p>${match.username}</p>
//                     <p>${match.location}</p>
//                 </div>
//                 <div class="projectStartDate">
//                     <p>${match.role}</p>
//                 </div>
//                 <div class="button">
//                     <a href="/employees/${match._id}">explore</a>
//                 </div>
//             </div>`
//         )).join('');
//         empResults.innerHTML = html;
//     }else{
//         const html = '';
//         empResults.innerHTML = html;
//     }
// }
// function outputHtmlProject(matches){
//     if(matches.length > 0){
//         const html = matches.map(match => (
//             `<div class="projectCard">
//                 <div class="projectDetails">
//                     <p><b>${match.projectName}</b></p>
//                     <p><b>${match.location}</b></p>
//                 </div>
//                 <div class="projectStartDate">
//                     <p>${match.startDate}</p>
//                 </div>
//                 <div class="button">
//                     <a href="/projects/${match.projectId}">explore</a>
//                 </div>
//             </div>`
//         )).join('');
//         projResults.innerHTML = html;
//     }else{
//         const html = '';
//         projResults.innerHTML = html;
//     }
// }
// async function data(){
//     const res = await fetch('http://localhost:3000/projectData');
//     let data = await res.json();
//     data = data.splice(0,6);
//     console.log(data);
//     const html = data.map(d => (
//         `<div class="projectCard">
//             <div class="projectDetails">
//                 <p><b>${d.projectName}</b></p>
//                 <p><b>${d.location}</b></p>
//             </div>
//             <div class="projectStartDate">
//                 <p>${d.startDate}</p>
//             </div>
//             <div class="button">
//                 <a href="/projects/${d.projectId}">explore</a>
//             </div>
//         </div>`
//     )).join('');
//         Results.innerHTML = html
// }
// async function empData(){
//     const res = await fetch('http://localhost:3000/employees');
//      data = await res.json();
//         data = data.splice(0,6);

//     console.log(data);
//     const html = data.map(d => (
//         `<div class="projectCard">
//         <div class="projectDetails">
//             <p>${d.username}</p>
//             <p>${d.location}</p>
//         </div>
//         <div class="projectStartDate">
//             <p>${d.role}</p>
//         </div>
//         <div class="button">
//             <a href="/employees/${d._id}">explore</a>
//         </div>
//     </div>`
// )).join('');
//     Results.innerHTML = html
// }

const search = document.getElementById('find');
const empSearch = document.getElementById('empSearch');
const projSearch = document.getElementById('projSearch');
const projResults = document.getElementById('projResults');
const empResults = document.getElementById('empResults');
const Results = document.getElementById('Results');

window.addEventListener('load',()=>{
    data();
})
   
search.addEventListener('click',()=>{
    search.classList.toggle('extendWidth');
})

empSearch.addEventListener('click', ()=>{
    empResults.classList.remove('displayNone')
    projResults.classList.add('displayNone')
    empData();
    matches = [];
    async function getEmpData(searchText){
        const res = await fetch('http://localhost:3000/employees');
        const data = await res.json();
        let matches = data.filter(d => {
            const regex = new RegExp(`^${searchText.toString()}`,'gi');
            return d.username.match(regex) ||  d._id.match(regex) || d.location.match(regex) || d.vendor.match(regex) 
        })
        Results.classList.add('displayNone');
        outputHtml(matches);
    }
    
    search.addEventListener('input', ()=>{
        betterFunction()});
            search.addEventListener('input', ()=>{
        betterFunction()});

        const getDebouncedData = function(fn,d){
            let timer
            return function(){
                 clearInterval(timer)
                timer = setTimeout(()=>{
                     getEmpData(search.value)
                 },d)
            }
        }
    const betterFunction = getDebouncedData(getEmpData,300)


})

projSearch.addEventListener('click', ()=>{
    projResults.classList.remove('displayNone');
    empResults.classList.add('displayNone');
    data();
    matches = []
    async function getProjData(searchText){
        console.log(searchText);
        const res = await fetch('http://localhost:3000/projectData');
        const data = await res.json();
        let matches = data.filter(d => {
            const regex = new RegExp(`^${searchText.toString()}`,'gi');
            return d.projectName.match(regex) || d.projectId.match(regex) || d.location.match(regex)
        })
        console.log(matches);
        Results.classList.add('displayNone');
        outputHtmlProject(matches);
    }
    search.addEventListener('input', ()=>{
        betterFunction()});
            search.addEventListener('input', ()=>{
        betterFunction()});

        const getDebouncedData = function(fn,d){
            let timer
            return function(){
                 clearInterval(timer)
                timer = setTimeout(()=>{
                     getProjData(search.value)
                 },d)
            }
        }
    const betterFunction = getDebouncedData(getProjData,300)

})


function outputHtml(matches){
    if(matches.length > 0){
        const html = matches.map(match => (
            `<div class="projectCard">
                <div class="projectDetails">
                    <p>${match.username}</p>
                    <p>${match.location}</p>
                </div>
                <div class="projectStartDate">
                    <p>${match.role}</p>
                </div>
                <div class="button">
                    <a href="/projects/${match.projectId}">explore</a>
                </div>
            </div>`
        )).join('');
        empResults.innerHTML = html;
    }else{
        const html = '';
        empResults.innerHTML = html;
    }
}
function outputHtmlProject(matches){
    if(matches.length > 0){
        const html = matches.map(match => (
            `<div class="projectCard">
                <div class="projectDetails">
                    <p>${match.projectName}</p>
                    <p>${match.location}</p>
                </div>
                <div class="projectStartDate">
                    <p>${match.startDate}</p>
                </div>
                <div class="button">
                    <a href="/projects/${match.projectId}">explore</a>
                </div>
            </div>`
        )).join('');
        projResults.innerHTML = html;
    }else{
        const html = '';
        projResults.innerHTML = html;
    }
}
async function data(){
    const res = await fetch('http://localhost:3000/projectData');
    const data = await res.json();
    console.log(data);
    const html = data.map(d => (
        `<div class="projectCard">
            <div class="projectDetails">
                <p>${d.projectName}</p>
                <p>${d.location}</p>
            </div>
            <div class="projectStartDate">
                <p>${d.startDate}</p>
            </div>
            <div class="button">
                <a href="/projects/${d.projectId}">explore</a>
            </div>
        </div>`
    )).join('');
        Results.innerHTML = html
}
async function empData(){
    const res = await fetch('http://localhost:3000/employees');
    const data = await res.json();
    console.log(data);
    const html = data.map(d => (
        `<div class="projectCard">
        <div class="projectDetails">
            <p>${d.username}</p>
            <p>${d.location}</p>
        </div>
        <div class="projectStartDate">
            <p>${d.role}</p>
        </div>
        <div class="button">
            <a href="/projects/${d.projectId}">explore</a>
        </div>
    </div>`
)).join('');
    Results.innerHTML = html
}