import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { QUERY_USER, QUERY_ME } from "../../utils/queries";
import { ADD_2_ARCANA } from "../../utils/mutations";
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
    initialTime: 5,
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

  const [addArcana, { error }] = useMutation(ADD_2_ARCANA);
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
      }, 5500);
      addTimer();
      setTimeout(() => {
        removeTimer();
      }, 6000);
      start();
      addGatherAnimation();
      setTimeout(() => {
        removeGatherAnimation();
      }, 6000);
      addSunAnimation();
      setTimeout(() => {
        removeSunAnimation();
      }, 6000);
      addButtonAnimation();
      setTimeout(() => {
        removeButtonAnimation();
      }, 6000);
      setTimeout(() => {
        reset();
      }, 5500);
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
              className="relative mx-auto mt-5 h-60 w-60 rounded-full"
              src="https://bn1303files.storage.live.com/y4mdZi1FKthlGPz9KM9l2UctSec_CBSfrK1DkaJaWlKzKIx6G1CfhfMH_Mv10yQuC1B7ysqapxacM9uUz7fQQG3zy79glSJFIl455UpJpfmMLrtBPvkoaGcBFcoRIoVXDeGQYLvc-s_p2tD3fmMnZe70lCHnzj_xwFXcyCjuiFRvYQJ6dYDzYi6LialEKx9P4o2zHj5zxQmwf5XmQRgVi28FQ/b_39.PNG?psid=1&width=174&height=174&cropMode=center"
              alt="Arcana"
            />
            <img
              id="arcanaImage"
              className="relative mx-auto -mt-52 h-44 w-44  rounded-full "
              src="https://bn1303files.storage.live.com/y4m4aC5V7U5xCwrRaNBavZfxa6Mj8RxliXU5q4PpIGkjoaMWQzTjE98mbOHnOJLl3FhOJqhzI-DFN5iwbb_ALGRZHJ3lZlQ0xVDCb-EGFSbjZ9yH4osWC3No5dAO2iGFv3ACrhAZLli4VPR3cm1tk6K0UaqPlGOP9a3xSV1CSmFRhzBMqb7P-X6gFoFo6faXgrJmqEXRnk3qUNaqrb_sqMiwQ/SpellBook07_18.png?psid=1&width=152&height=152&cropMode=center"
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
