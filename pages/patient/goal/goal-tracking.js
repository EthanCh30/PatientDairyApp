import { AjaxRequest } from "../../../database_api/common.js";

const ajax = new AjaxRequest();
const DESTINATION = "./goal-tracking.php";

let Goals = [];

document.addEventListener("DOMContentLoaded", () => {
  getGoals();
});

function getGoals() {
  const patientId = 1;
  console.log("Pateint ID:".patientId);

  ajax
    .sendRequest(DESTINATION, { patientId, getGoals: true }, "POST")

    .then((response) => {
      if (response.isSuccess) {
        Goals = response.result_data;
        displayGoals(Goals);
      } else {
        console.error("There is no goals set yet.");
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

function displayGoals(goals) {
  if (goals.length > 0) {
    // some goals set by user already

    goals.forEach((goal) => {
      const week = goal.Week;
      const sleepHours = goal.Sleep;
      const exerciseHours = goal.Exercise;
      const eatFood = goal.Eating;

      // add a container
      const weekContainer = document.createElement("div");
      weekContainer.classList.add("week-container");

      const weekTitle = document.createElement("h3");
      weekTitle.textContent = `Week: ${week}`;
      weekContainer.appendChild(weekTitle);

      if (sleepHours) {
        const sleepItem = document.createElement("p");
        sleepItem.textContent = `Sleeping Hours: ${sleepHours}`;
        weekContainer.appendChild(sleepItem);
      }

      if (exerciseHours) {
        const exerciseItem = document.createElement("p");
        exerciseItem.textContent = `Exercise Hours: ${exerciseHours}`;
        weekContainer.appendChild(exerciseItem);
      }

      if (eatFood.length > 0) {
        const foodTitle = document.createElement("p");
        foodTitle.textContent = "Eating Habits:";
        weekContainer.appendChild(foodTitle);

        const foodList = document.createElement("ul");
        const arrFood = goal.Eating.split(" & ");
        arrFood.forEach((food) => {
          const foodItem = document.createElement("li");
          foodItem.textContent = food;
          foodList.appendChild(foodItem);
        });

        weekContainer.appendChild(foodList);
      }

      if (goal.state == 1) {
        // ** create a completeGoal button wrapper
        const completeGoalWrapper = document.createElement("div");
        completeGoalWrapper.classList.add("complete-goal-wrapper");

        // create the button
        const completeButton = document.createElement("button");
        completeButton.textContent = "Complete";
        completeButton.classList.add("complete-button");

        // add a click event listener to  completeButton
        completeButton.addEventListener("click", () => {
          const goalId = goal.GoalID;
          completeGoal(goalId);
        });

        completeGoalWrapper.appendChild(completeButton);
        weekContainer.appendChild(completeGoalWrapper);
      }

      // add the goals to the display container
      goalListContainer.appendChild(weekContainer);
    });
  } else {
    // no goals set by user yet
    const noGoalsMessage = document.createElement("p");
    noGoalsMessage.textContent = "No goals set yet.";
    goalListContainer.appendChild(noGoalsMessage);
  }
}

function completeGoal(goalId) {
  ajax
    .sendRequest(DESTINATION, { goalId, completeGoal: true }, "POST")
    .then((response) => {
      if (response.isSuccess) {
        window.parent.postMessage("goalsUpdated", "*");
      } else {
        alert("Fail to delete goal\n" + response.message);
      }
    })
    .catch((error) => {
      console.error("AN error occured");
    });
}
