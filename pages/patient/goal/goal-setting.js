import { AjaxRequest } from "../../../database_api/common.js";

const ajax = new AjaxRequest();
const DESTINATION = "./goal-setting.php";

let savedGoalData = null;

// set the goals objects
const goals = {
  goalID: -1,
  patientId: -1,
  week: "",
  sleepHours: "",
  exerciseHours: "",
  eatFood: [],
};

const saveGoalsButton = document.getElementById("saveGoals");
let selectedGoal = null;

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const sleepInput = document.querySelector(
    'input[name="Hours"][list="markers"]'
  );
  const exerciseInput = document.querySelector(
    'input[name="Hours"][list="exercise-markers"]'
  );

  const weekInput = document.querySelector("#goalWeek");

  // get .food-item elements from the html
  const foodItems = document.querySelectorAll(".food-item");

  //const saveButton = document.querySelector("#saveGoals");

  getGoals();

  document
    .getElementById("goalWeek")
    .addEventListener("change", function (event) {
      const selectedWeek = event.target.value;
      console.log("Display week ", selectedWeek);

      init();

      if (savedGoalData !== null) {
        for (let i = 0; i < savedGoalData.length; i++) {
          if (savedGoalData[i].Week == selectedWeek) {
            selectedGoal = savedGoalData[i];
            setGoal(selectedGoal);

            saveGoalsButton.textContent = "Update Goals";
            break;
          }
        }
      }
      // TODO: dispaly the goal if its already stored in the database
    });

  // listen when user clicks on food items
  foodItems.forEach((item) => {
    item.addEventListener("click", () => {
      const foodType = item.querySelector("p").textContent;

      if (goals.eatFood.includes(foodType)) {
        // remove if the item is in the list
        goals.eatFood = goals.eatFood.filter((food) => food !== foodType);
        item.classList.remove("selected");
      } else {
        // add item
        goals.eatFood.push(foodType);
        item.classList.add("selected");
      }
    });
  });

  saveGoalsButton.addEventListener("click", (event) => {
    console.log("Save button clicked");

    event.preventDefault();

    // check if the user has selected any goal by .check
    const sleepGoalChecked = document.querySelector("#sleepGoal").checked;
    const exerciseGoalChecked = document.querySelector("#exerciseGoal").checked;
    const foodGoalChecked = document.querySelector("#foodGoal").checked;

    // input the data to the goals object
    if (sleepGoalChecked) {
      goals.sleepHours = sleepInput.value;
    } else {
      goals.sleepHours = "";
    }

    if (exerciseGoalChecked) {
      goals.exerciseHours = exerciseInput.value;
    } else {
      goals.exerciseHours = "";
    }

    if (!foodGoalChecked) {
      goals.eatFood = [];
    }

    // if user not choose any week, alert and stop.
    if (!weekInput.value) {
      alert("Please enter a week number.");
      EventTarget.stopPropagation(); // another options is "stopDefault()""
    }
    goals.week = weekInput.value;

    console.log(goals);

    if (selectedGoal == null || selectedGoal == "") {
      //save the goals to the database
      saveGoalToDatabase(goals, false);
    } else {
      // Update goal
      saveGoalToDatabase(goals, true);
    }

    // update the goal.html window
    // window.parent.postMessage("goalsUpdated", "*");
  });
});

// send the data to the database
function saveGoalToDatabase(goalData, isUpdate) {
  const patientID = 1; //based on Derric's login data

  const week = goalData.week;
  const sleepHours = goalData.sleepHours;
  const exerciseHours = goalData.exerciseHours;
  const arrayEatFoods = goalData.eatFood;

  let eatFoods = "";
  arrayEatFoods.forEach((element, index) => {
    if (eatFoods !== "") {
      eatFoods += " & ";
    }
    eatFoods += element.toLowerCase();
  });

  console.log(
    "patientId = " +
      patientID +
      "week = " +
      week +
      " , sleepHours = " +
      sleepHours +
      " exerciseHours = " +
      exerciseHours +
      " eatFoods = " +
      eatFoods
  );

  let requestData = {
    patientID,
    week,
    sleepHours,
    exerciseHours,
    eatFoods,
    add: true,
  };

  if (isUpdate == true) {
    const goalID = selectedGoal.GoalID;

    requestData = {
      goalID,
      patientID,
      week,
      sleepHours,
      exerciseHours,
      eatFoods,
      update: true,
    };
  }
  // Send Ajzx request to the database
  ajax
    .sendRequest(DESTINATION, requestData, "POST")
    .then((response) => {
      if (response.isSuccess) {
        window.parent.postMessage("goalsUpdated", "*");

        //alert("Goals saved successfully");
      } else {
        alert("Failed to save goals");
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

function init() {
  const saveGoalsButton = document.getElementById("saveGoals");
  saveGoalsButton.textContent = "Save Goals";
  saveGoalsButton.disabled = false; // Enable the button

  const sleepCheckbox = document.querySelector("#sleepGoal");
  sleepCheckbox.checked = false; // Uncheck the checkbox if no sleep hours

  const exerciseCheckbox = document.querySelector("#exerciseGoal");
  exerciseCheckbox.checked = false; // Uncheck the checkbox if no exercise hours

  const foodCheckbox = document.querySelector("#foodGoal");
  foodCheckbox.checked = false; // Uncheck the checkbox if no checked foods

  // Update the food items
  const foodItems = document.querySelectorAll(".food-item");
  foodItems.forEach((item) => {
    item.classList.remove("selected");
  });
}

function getGoals() {
  const patientID = 1;
  console.log("Pateint ID:".patientID);

  ajax
    .sendRequest(DESTINATION, { patientID, getGoals: true }, "POST")

    .then((response) => {
      if (response.isSuccess) {
        savedGoalData = response.result_data;
        console.log("Saved goal data", savedGoalData);
        // displayGoals(Goals);
      } else {
        console.error("There is no goals set yet.");
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

function setGoal(savedGoal) {
  const week = savedGoal.Week;
  const sleepHours = savedGoal.Sleep;
  const exerciseHours = savedGoal.Exercise;
  const eatFoods = savedGoal.Eating.split(" & "); // Split the string into an array
  const state = savedGoal.state;

  const saveGoalsButton = document.getElementById("saveGoals");

  if (state === 1) {
    saveGoalsButton.textContent = "Update Goals";
    saveGoalsButton.disabled = false; // Enable the button
  } else if (state === 2) {
    saveGoalsButton.textContent = "Goals were completed";
    saveGoalsButton.disabled = true; // Disable the button
  }

  console.log(
    "Selected goal data: week = " +
      week +
      ", sleepHours = " +
      sleepHours +
      ", exerciseHours = " +
      exerciseHours +
      ", eat foods = " +
      eatFoods.join(", ")
  );

  // Update the week input field
  const weekInput = document.querySelector("#goalWeek");
  weekInput.value = week; // Set the value of the week input

  // Update the sleep input
  const sleepInput = document.querySelector(
    'input[name="Hours"][list="markers"]'
  );
  sleepInput.value = sleepHours; // Set the value for the sleep range input
  const sleepCheckbox = document.querySelector("#sleepGoal");
  if (sleepHours) {
    sleepCheckbox.checked = true; // Select the checkbox if sleep hours are provided
  } else {
    sleepCheckbox.checked = false; // Uncheck the checkbox if no sleep hours
  }

  // Update the exercise input
  const exerciseInput = document.querySelector(
    'input[name="Hours"][list="exercise-markers"]'
  );
  exerciseInput.value = exerciseHours; // Set the value for the exercise range input
  const exerciseCheckbox = document.querySelector("#exerciseGoal");
  if (exerciseHours) {
    exerciseCheckbox.checked = true; // Select the checkbox if exercise hours are provided
  } else {
    exerciseCheckbox.checked = false; // Uncheck the checkbox if no exercise hours
  }

  const foodCheckbox = document.querySelector("#foodGoal");
  if (eatFoods != null && eatFoods != "" && eatFoods.length > 0) {
    foodCheckbox.checked = true; // Select the checkbox if foods are provided
    goals.eatFood = [];

    eatFoods.forEach((foodItem) => {
      // Normalize food item for case-insensitive comparison
      const normalizedFoodItem = foodItem.toLowerCase();

      if (normalizedFoodItem === "whole grains") {
        goals.eatFood.push("Whole grains");
        document.getElementById("wholeGrains").classList.add("selected");
      }

      if (normalizedFoodItem === "fruits") {
        goals.eatFood.push("Fruits");
        document.getElementById("fruits").classList.add("selected");
      }

      if (normalizedFoodItem === "vegetables") {
        goals.eatFood.push("Vegetables");
        document.getElementById("vegetables").classList.add("selected");
      }

      if (normalizedFoodItem === "fish, eggs, meat") {
        goals.eatFood.push("Fish, Eggs, Meat");
        document.getElementById("fishEggsMeet").classList.add("selected");
      }

      if (normalizedFoodItem === "oils, fats, nuts") {
        goals.eatFood.push("Oils, Fats, Nuts");
        document.getElementById("oilsFatsNuts").classList.add("selected");
      }

      if (normalizedFoodItem === "dairy products") {
        goals.eatFood.push("Dairy products");
        document.getElementById("dairyProducts").classList.add("selected");
      }
    });
  } else {
    goals.eatFood = [];
    foodCheckbox.checked = false;
  }
}
