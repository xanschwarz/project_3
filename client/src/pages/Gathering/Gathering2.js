import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { QUERY_USER, QUERY_ME } from "../../utils/queries";
import { ADD_10_ARCANA } from "../../utils/mutations";
import { useQuery, useMutation } from "@apollo/client";
import Auth from "../../utils/auth";
import ModalContainer from "../../components/Modal/ModalContainer";
import { setArcana } from "../../components/StatsBar";
import { useTimer } from "use-timer";

//animation section
function addGatherAnimation() {
  document.getElementById("arcanaImage").classList.add("animate-spin");
}

function removeGatherAnimation() {
  document.getElementById("arcanaImage").classList.remove("animate-spin");
}
function addSunAnimation() {
  document.getElementById("sunImage").classList.add("animate-reverseSpin");
}

function removeSunAnimation() {
  document.getElementById("sunImage").classList.remove("animate-reverseSpin");
}

function addButtonAnimation() {
  document.getElementById("gatherButton").classList.add("hidden");
}

function removeButtonAnimation() {
  document.getElementById("gatherButton").classList.remove("hidden");
}
function removeTimer() {
  document.getElementById("timer").classList.add("hidden");
}

function addTimer() {
  document.getElementById("timer").classList.remove("hidden");
}
const reset = () => {
  window.location.reload();
};

const Gathering = () => {
  const { time, start } = useTimer({
    initialTime: 60,
    timerType: "DECREMENTAL",
    endTime: 0,
  });
  const [arcana, setArcana] = useState();
  const { username: userParam } = useParams();

  // Query for mageAttributes
  const { data } = useQuery(userParam ? QUERY_USER : QUERY_ME, {
    variables: { username: userParam },
    onCompleted: (data) => setArcana(data.me.arcana),
  });

  const [addArcana, { error }] = useMutation(ADD_10_ARCANA);
  // console.log(addArcana);
  useEffect(() => {
    setArcana(data?.me.arcana || 0);
  }, [data]);
  // console.log(data);
  // Create handler for button
  const handleClick = async (event) => {
    const currentArcanaId = data.me._id;
    event.preventDefault();

    try {
      const { data } = await setTimeout(() => {
        addArcana({
          variables: {
            id: currentArcanaId,
          },
        });
        setArcana(data.addArcana.arcana);
      }, 59500);
      addTimer();
      setTimeout(() => {
        removeTimer();
      }, 60000);
      start();
      addGatherAnimation();
      setTimeout(() => {
        removeGatherAnimation();
      }, 60000);
      addSunAnimation();
      setTimeout(() => {
        removeSunAnimation();
      }, 60000);
      addButtonAnimation();
      setTimeout(() => {
        removeButtonAnimation();
      }, 60000);
      setTimeout(() => {
        reset();
      }, 59500);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {Auth.loggedIn() ? (
        <div className="gathering">
          <div className="relative mb-20">
            <img
              id="sunImage"
              className="relative mx-auto mt-5 h-64 w-64 rounded-full"
              src="https://bn1303files.storage.live.com/y4mcahFzKSTtMkd3-_wBOKjblncCylU2gyD00Yqs4JEAiZ_p6ABNIqb1vxTvtWwoboFY7RpuEG52GhqxdvIfLnKP05edra9T9R2LxG7uJQBUlFuHN5IEitqVWk-RqDlxfzNYnElmqBAZm5ZgESXcSzoPfrC6hVuQIhU4SNEaJydJ1pacLFGJQJtzK9ApmfR4ilRlIC7wXYGL5KXuQmxMdYoog/SpellBook06_10.png?psid=1&width=256&height=256&cropMode=center"
              alt="Arcana"
            />
            <img
              id="arcanaImage"
              className="relative mx-auto -mt-52 h-40 w-40  rounded-full "
              src="https://bn1303files.storage.live.com/y4mi-qA6kfZAs6o9xBqmYSwI1HqaYYYM-A1CeqiHgzcBkn_V9g-AzMQmkRN64M9pkLahLxIQ7CEy3ZyMCEDjxCsM8tCZR7Nc1NXa4GQUnQSdrwAdHhQbd4kgb8kdl5UtSxsqiPqZUCT9-y_cjQkJ4KQ4gE6HnOj7FK34a7vSENdrMVKsb-2JeOC_8BuSUnzQAAOV9OaU2F3lZNXg4hatQxkkg/SpellBook06_103.png?psid=1&width=174&height=174&cropMode=center"
              alt=""
            />
          </div>

          <div
            id="gatherButton"
            className="mb-5 button-div flex justify-center"
          >
            <button
              type="button"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={handleClick}
            >
              Gather Arcana
            </button>
          </div>
          <div className="flex justify-center">
            <span
              id="timer"
              className="text-center flex align-center justify-center  px-6 mb-5 py-3 border border-transparent font-medium rounded-md shadow-sm text-white bg-indigo-600  hidden
          "
            >
              {" "}
              {time}
            </span>
          </div>
        </div>
      ) : (
        <div>
          <ModalContainer />
        </div>
      )}
    </div>
  );
};

export default Gathering;
