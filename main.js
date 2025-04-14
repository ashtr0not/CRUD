document.querySelector('button').addEventListener('click', getBodyPart)

async function getBodyPart(){
    let bodyPart = document.querySelector('input').value //getting value from an input
    try{
    const res = await fetch(`http://localhost:8000/api/workout/${bodyPart}`)
    const data = await res.json()
    
    document.querySelector('h2').innerText = 'Body Part: ' + data.muscleGroup
    document.querySelector('h3').innerText = 'Workouts: ' + data.exercise
    document.querySelector('p').innerText = 'Description: ' + data.description

    // if(bodyPart){
    //     document.querySelector('h2').innerText = 'Body Part: ' + data.muscleGroup
    //     document.querySelector('h3').innerText = 'Workouts: ' + data.exercise
    // }
    // else{
    //     // document.querySelector('h2').innerText = data['unknown'].muscleGroup
    // }

    // if(!bodyPart){
    //     document.querySelector('h2').innerText = 'Body Part: ' + data['unknown'].muscleGroup
    //     document.querySelector('h3').innerText = 'Workouts: ' + data['unknown'].exercise
    // }
    console.log(data.bodyPart)
    }catch(err){
        console.log(err)
    }
}