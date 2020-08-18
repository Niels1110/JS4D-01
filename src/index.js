// Lists of words 
let adverbs;
let activities;
let names;
let descriptions;
let occupations;


// Array to hold all stories
let stories = [];

// Keep track of current story
let currentStory = 0;


// Fetch data and convert it to JSON
const fetchWords = async () => {

    let adverbResp = await fetch("/data/data_adverbs.json"); // Make a promise
    let adverbs2JSON = await adverbResp.json(); // Convert the result of the promise to JSON

    let activityResp = await fetch("/data/data_activities.json"); 
    let activities2JSON = await activityResp.json();

    let nameResp = await fetch("/data/data_firstnames.json");
    let names2JSON = await nameResp.json();

    let descriptionResp = await fetch("/data/data_descriptions.json");
    let descriptions2JSON = await descriptionResp.json();

    let occupationResp = await fetch("/data/data_occupation.json");
    let occupations2JSON = await occupationResp.json();



    return {
        listOfAdverbs: adverbs2JSON,
        listOfActivities: activities2JSON,
        listOfNames: names2JSON,
        listOfDescriptions: descriptions2JSON,
        listOfOccupations: occupations2JSON
    }
}

// When the JSON files has been converted, take the results and...
fetchWords().then(results => {
    // ...Assign the results to variables
    adverbs = results.listOfAdverbs;
    activities = results.listOfActivities;
    names = results.listOfNames;
    descriptions = results.listOfDescriptions;
    occupations = results.listOfOccupations;


    let filteredActivities = activities.categories.filter(function(example) {
        return example.examples !== undefined;
        });
    activities = filteredActivities;
    
    // Run first story
    updateStory(createStory());
    
    
    // And add 1 to the story counter
    currentStory = currentStory + 1;
    
})


// Want to filter in 'categories' -> activities.categories | Filter out all the 'examples' keys



// Receive all the arguments as an objects 
let updateStory = ({ adverb, activity, verbTense, name, description, occupation, color }) => {

    // And then use that data to update dom elemetns
    document.getElementById("adverb").textContent = adverb
    document.getElementById("activity").textContent = activity;
    document.getElementById("verb-tense").textContent = verbTense;
    document.getElementById("name").textContent = name;
    document.getElementById("description").textContent = description;
    document.getElementById("occupation").textContent = occupation;
    document.getElementById("main-scene").style.backgroundColor = color;
    
}

let logStory = ({ adverb, activity, name, description, occupation, color }) => {
    let loggedStory = {
        adverb: adverb,
        activity: activity,
        verbTense: 'was ',
        name: name,
        description: description,
        occupation: occupation,
        color: color
    }

    stories.push(loggedStory);
}

let createStory = () => {

    //  Call the functions that randomly pick an item
    //  from their lists and return them
    let adverb = newAdverb();
    let activity = newActivity();
    let verbTense = "is "
    let name = newName();
    let description = newDescription();
    let occupation = newOccupation();
    let color = newColor()

    // Log the story based on the returned data from newXYZ
    logStory({ adverb, activity, verbTense, name, description, occupation, color })

    document.getElementById("time").textContent = "Right now, "


    // Return the values created by newXYZ so updateStory()
    // can use them
    return {
        adverb,
        activity,
        verbTense,
        name,
        description,
        occupation,
        color
    }
}

let changeStory = (currentStory) => {
    let adverb = stories[currentStory].adverb
    let activity = stories[currentStory].activity
    let verbTense = stories[currentStory].verbTense
    let name = stories[currentStory].name
    let description = stories[currentStory].description
    let occupation = stories[currentStory].occupation
    let color = stories[currentStory].color

    return {
        adverb,
        activity,
        verbTense,
        name,
        description,
        occupation,
        color
    }
}


// Picking random words

let newAdverb = () => {
    let adverbsList = adverbs.adverbs.length;
    let randomAdverb = Math.floor(Math.random() * adverbsList);
    let adverb = adverbs.adverbs[randomAdverb];
    
    return adverb;
}




let newActivity = () => {

    // Pick random object from list of all objects
    let randomActivityObject = activities[Math.floor(Math.random() * activities.length)]

    // Then pick a random item from the list of 
    // the object's examples
    let randomExample = randomActivityObject.examples[Math.floor(Math.random() * randomActivityObject.examples.length)]

    let activity = randomExample;

    return activity;
}

let newName = () => {
    let namesList = names.firstNames.length;
    let randomName = Math.floor(Math.random() * namesList);
    let name = names.firstNames[randomName];

    return name;
}

let newDescription = () => {
    let descriptionsList = descriptions.descriptions.length;
    let description = descriptions.descriptions[Math.floor(Math.random() * descriptionsList)];

    return description
}

let newOccupation = () => {
    let occupationsList = occupations.occupations.length;
    let randomOccupation = Math.floor(Math.random() * occupationsList);
    let occupation = occupations.occupations[randomOccupation];
    console.log(occupation)

    return occupation
}


let newColor = () => {
    // Call randomVal() to return a random
    // number between the range provided
    let hue = randomVal(0, 360);
    let saturation = randomVal(30, 95);
    let lightness = randomVal(30, 80);
  
    // Combine the values into a single variable
    let color = `hsl(${hue}, ${saturation}%, ${lightness}%)`

    return color;
}

// Picks a random number
// between a min and max value
let randomVal = (min, max) => {

  return Math.floor(Math.random() * (max - min) + 1) + min;
}



// User interactions
const leftBtn = document.querySelector(".control.left")
const rightBtn = document.querySelector(".control.right")

leftBtn.addEventListener('click', function(){
    console.log('Click Left')
    if(currentStory < 1) {
        currentStory = 0;
        console.log('End of story')
    } else {
        currentStory = currentStory - 1;
        updateStory(changeStory(currentStory));
    }
})

rightBtn.addEventListener('click', function(){
    currentStory = currentStory + 1;
        if (currentStory < stories.length) {
            updateStory(changeStory(currentStory));
        } else {
            updateStory(createStory());
        }
})




// Key events
document.addEventListener("keyup", event => {
    let key = event.key;
    if (key === "ArrowRight") {
        currentStory = currentStory + 1;
        if (currentStory < stories.length) {
            document.getElementById("time").textContent = "After that, "
            updateStory(changeStory(currentStory));
        } else {
            updateStory(createStory());
        }
    }
    if (key === "ArrowLeft") {
        
        if(currentStory < 1) {
            currentStory = 0;
            console.log('End of story')
        } else {
            currentStory = currentStory - 1;
            document.getElementById("time").textContent = "Before that, "

            updateStory(changeStory(currentStory));
        }
    }
  });