import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { QUERY_USER, QUERY_ME } from "../../utils/queries";
import { ADD_75_ARCANA } from "../../utils/mutations";
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
    initialTime: 900,
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

  const [addArcana, { error }] = useMutation(ADD_75_ARCANA);
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
      }, 895000);
      addTimer();
      setTimeout(() => {
        removeTimer();
      }, 900000);
      start();
      addGatherAnimation();
      setTimeout(() => {
        removeGatherAnimation();
      }, 900000);
      addSunAnimation();
      setTimeout(() => {
        removeSunAnimation();
      }, 900000);
      addButtonAnimation();
      setTimeout(() => {
        removeButtonAnimation();
      }, 900000);
      setTimeout(() => {
        reset();
      }, 895000);
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
              src="https://bn1303files.storage.live.com/y4mjQTiRRZsr_O5w8dmzO38NtmU5NTg0t9tW8gFdmXqOExmxqDn2-WOb-XCHutU0NHrCMZYbe0MovwRce0IAlDjmNhyOI8zHD1CNuouUc9gpLSatgibda4DaqAGxscI8mu4-84ZI8fvPBVVxQyIA4ASnpMDnudIccnyFdpczRns7IWnd8H0tvtve4vHRIZSH93z38UAhNP5HjAz6y7EEqmBRw/SpellBook06_80.png?psid=1&width=140&height=140&cropMode=center"
              alt="Arcana"
            />
            <img
              id="arcanaImage"
              className="relative mx-auto -mt-52 h-40 w-40  rounded-full "
              src="https://bn1303files.storage.live.com/y4mpEkUg_IgL0IQHIWL9k1h9MrIErk-3mGdoFMh0rlvxISZs7BYHE4NTQx_0TmVKyUagNWeTyS9KRxZogPxSkHHROFOVJfQFvuWcMjiFybcuxVFffyYBR1eP2lmAy_Tt9k3NfKT5OW5Y1PCkJtBAwlxts14BnGWV8MO_5pCLxjv0M4oUaOiKAhJK_jMaj71nDfN1xM7L-DAwV3kJfobEg5fwg/SpellBookPage09_01.PNG?psid=1&width=140&height=140&cropMode=center"
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
