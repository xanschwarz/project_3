import React, { useEffect, useState } from "react";
import { Redirect, useParams } from "react-router-dom";
import { QUERY_USER, QUERY_ME } from "../../utils/queries";
import { ADD_125_SCALE } from "../../utils/mutations";
import { useQuery, useMutation } from "@apollo/client";
import Auth from "../../utils/auth";

//sentences listed after the round, stating a win, loss or draw
const successSentences = [
  "Your Spell has Landed, and it was Supper Effective!",
  "A Remarkable shot, The minion has been hurt greatly",
];
const failureSentences = [
  "Your Spell Missed, The minion attacks you!",
  "Concentrate, your poor choice has hurt you",
];
const tieSentences = [
  "Your spell slightly landed, dealing reduced damage ",
  "Your spell was slightly effective",
];

//functions to call the sentences
function showRandomTieSentence() {
  const randomNumber = Math.floor(Math.random() * tieSentences.length);
  return tieSentences[randomNumber];
}

function showRandomSuccessSentence() {
  const randomNumber = Math.floor(Math.random() * successSentences.length);
  return successSentences[randomNumber];
}
function showRandomFailureSentence() {
  const randomNumber = Math.floor(Math.random() * failureSentences.length);
  return failureSentences[randomNumber];
}

//animations for the user and minion
function addMinionDamagedAnimation() {
  document.getElementById("minionIcon").classList.add("animate-wiggle");
}

function removeMinionDamagedAnimation() {
  document.getElementById("minionIcon").classList.remove("animate-wiggle");
}

function addUserDamagedAnimation() {
  document.getElementById("userIcon").classList.add("animate-wiggle");
}

function removeUserDamagedAnimation() {
  document.getElementById("userIcon").classList.remove("animate-wiggle");
}

const MinionBattle = () => {
  const { username: userParam } = useParams();

  const { loading, data } = useQuery(userParam ? QUERY_USER : QUERY_ME, {
    variables: { username: userParam },
    onCompleted: (data) => {
      setAttackPower(20 * (Math.pow(5, data?.me.ring) / 5));
      setHealthCoefficient(20 * Math.pow(5, data?.me.cloak));
      setUserHealth(20 * Math.pow(5, data?.me.cloak));
    },
  });

  const [userAbility, setUserAbility] = useState(null);
  const [minionAbility, setMinionAbility] = useState(null);
  const [healthCoefficient, setHealthCoefficient] = useState(null);
  const [attackPower, setAttackPower] = useState(null);
  const [userHealth, setUserHealth] = useState(null);
  const [minionHealth, setMinionHealth] = useState(1250);
  const [turnResult, setTurnResult] = useState(null);
  const [result, setResult] = useState("Battle In Progress");
  const [gameOver, setGameOver] = useState(false);
  const [scale, setScale] = useState();
  const choices = ["Bolt", "Blast", "Nova"];

  const [addScale, { error }] = useMutation(ADD_125_SCALE);
  //visual change of user health bar
  function userHpDamaged() {
    let health = document.getElementById("userHealthBar");
    health.value -= 5;
  }

  //visual change of minion health bar
  function minionHpDamagedFull() {
    let health = document.getElementById("minionHealthBar");
    health.value -= attackPower;
  }
  function minionHpDamagedHalf() {
    let health = document.getElementById("minionHealthBar");
    health.value -= attackPower / 2;
  }

  const handleClick = (value) => {
    setUserAbility(value);
    generateMinionAbility();
  };

  const generateMinionAbility = () => {
    const randomChoice = choices[Math.floor(Math.random() * choices.length)];
    setMinionAbility(randomChoice);
  };

  const reset = () => {
    window.location.reload();
  };

  useEffect(() => {
    const comboMoves = userAbility + minionAbility;
    //If the User chooses correctly
    if (userHealth > 0 && minionHealth > 0) {
      if (
        comboMoves === "NovaBlast" ||
        comboMoves === "BoltNova" ||
        comboMoves === "BlastBolt"
      ) {
        const minionDamaged = minionHealth - attackPower;
        // console.log("minionDamaged", minionDamaged);
        minionHpDamagedFull();
        // console.log("minionHpDamagedFull", minionHpDamagedFull);
        setMinionHealth(minionDamaged);
        // console.log("setMinionHealth", setMinionHealth);
        setTurnResult(showRandomSuccessSentence());
        addMinionDamagedAnimation();
        setTimeout(() => {
          removeMinionDamagedAnimation();
        }, 1000);

        if (minionDamaged <= 0) {
          setResult("You have Defeated the Minion!");
          const gameOff = true;
          const currentScaleId = data.me._id;
          try {
            const { data } = addScale({
              variables: {
                id: currentScaleId,
              },
            });
            setScale(data.addScale.scale);
          } catch (error) {
            console.log(error);
          }
          setGameOver(gameOff);
        }
      }
      //If the User chooses incorrectly
      if (
        comboMoves === "BlastNova" ||
        comboMoves === "NovaBolt" ||
        comboMoves === "BoltBlast"
      ) {
        const userDamaged = userHealth - 625;
        // console.log("userDamaged", userDamaged);
        userHpDamaged();
        setUserHealth(userDamaged);
        // console.log("userHealth", userHealth);
        setTurnResult(showRandomFailureSentence());
        addUserDamagedAnimation();
        setTimeout(() => {
          removeUserDamagedAnimation();
        }, 1000);
        if (userDamaged <= 0) {
          setResult("You have been Defeated");
          const gameOff = true;
          // console.log("data", data.me.scale);
          setGameOver(gameOff);
        }
      }
      //If its a tie
      if (
        comboMoves === "BlastBlast" ||
        comboMoves === "BoltBolt" ||
        comboMoves === "NovaNova"
      ) {
        const minionDamaged = minionHealth - attackPower / 2;
        // console.log("minionDamaged", minionDamaged);
        minionHpDamagedHalf();
        setMinionHealth(minionDamaged);
        // console.log("MinionHealth", minionHealth);
        setTurnResult(showRandomTieSentence());
        addMinionDamagedAnimation();
        setTimeout(() => {
          removeMinionDamagedAnimation();
        }, 1000);
        if (minionDamaged <= 0) {
          setResult("You have Defeated the Minion!");
          const gameOff = true;
          const currentScaleId = data.me._id;
          try {
            const { data } = addScale({
              variables: {
                id: currentScaleId,
              },
            });
            setScale(data.addScale.scale);
          } catch (error) {
            console.log(error);
          }
          setGameOver(gameOff);
        }
      }
    }
  }, [minionAbility, userAbility]);
  const enemies = [
    {
      name: "Ghastly's Whisp",
      pathName: "MinionBattle4",
      link: "Battle Ghastly's Whisp",
      drop: "125",
      imageUrl:
        "https://bn1303files.storage.live.com/y4mIX-LLBtSeZWjx3nhQAFW9nxcAnvlfV5xRf6RXucSx-QiDmjaiEI8IAzL6QiPPO1OFJ7gACYRHRpggKDxeuex1jSTNLT0-3iMun4rrbQDkajQm1NZXsKYoRGHrpToDWFjJUHicoMAG96iQPdczMRdH4DU-Gs3bToOq4c7If3kwxwfm4YOzDYMXUGyWCF2V3bfpkyfCj5c7SrFtpM2qwiqLA/SpellBook07_47.png?psid=1&width=256&height=256&cropMode=center",
    },
  ];

  return (
    <div className="bg-gray-900">
      <div className="mx-auto py-6 px-4 max-w-7xl sm:px-6 ">
        <div className="space-y-12">
          <div className="space-y-5 sm:space-y-4 md:max-w-xl lg:max-w-3xl xl:max-w-none">
            <h2 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
            Battle {enemies[0].name}
            </h2>
            <p className="text-xl text-gray-300"></p>
          </div>
          <ul className="space-y-4 ">
            {enemies.map((enemy) => (
              <li
                key={enemy.name}
                className="py-10 px-6 bg-gray-800 text-center align-center rounded-lg "
              >
                <div className="space-y-6 xl:space-y-10">
                  <div className="result">
                    <p className="text-white">{result}</p>
                  </div>
                  <div className="flex justify-center mx-auto">
                    <div className="inline-flex mx-auto">
                      <div>
                        <progress
                          className="h-10 "
                          id="userHealthBar"
                          value={userHealth}
                          max={healthCoefficient}
                        ></progress>
                        <p className="-mt-9 mb-5 text-white flex justify-center">
                          Health: {userHealth}
                        </p>
                        <img
                          id="userIcon"
                          className=" mx-auto h-40 w-40 rounded border-4 border-black xl:w-56 xl:h-56"
                          src="https://bn1303files.storage.live.com/y4mDF-2j2jrwggrF0o66l6ycfkUKqndee3G0p4I1ubnKjVtdmhIPyOsv_HqMEn8BmKFZogtphp3vyWTfjWp2GolArSLHwJELByD3ALz836oczX6KaU1jKonQMEzWb_b_-OCfug6zKEHkFj9zaeEZCZ5cn1LAAgNY2_MEsc4hVR91rtvusrtpthFhFblqZzpwCsvr7k2bP2J4Cb2xJH75wd0eA/Male_18.png?psid=1&width=174&height=174&cropMode=center"
                          alt=""
                        />
                      </div>
                      <a className="text-white align-center px-4 mt-2">VS</a>
                      <div>
                        <progress
                          className="h-10 "
                          id="minionHealthBar"
                          value="1250"
                          max="1250"
                        ></progress>
                        <p className="-mt-9 mb-5 text-white flex justify-center">
                          Health: {minionHealth}
                        </p>

                        <img
                          id="minionIcon"
                          className="mx-auto h-40 w-40 rounded border-4 border-black xl:w-56 xl:h-56"
                          src={enemy.imageUrl}
                          alt=""
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 xl:flex xl:items-center xl:justify-between">
                    <div className="font-medium  break-words text-lg leading-6 space-y-1">
                      <h3 className="text-white">{turnResult}</h3>

                      <div className="button-div">
                        {choices.map((choice, index) => (
                          <button
                            className="inline-flex text-wrap items-center justify-center border w-1/4  mx-2 border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-900 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            key={index}
                            onClick={() => handleClick(choice)}
                            disabled={gameOver}
                          >
                            <div>
                              <img
                                className="flex justify-center mx-auto"
                                src={`../../images/${choice}.png`}
                                alt=""
                              />
                              {choice}
                            </div>
                          </button>
                        ))}
                      </div>

                      <div className="button-div">
                        {gameOver && (
                          <button
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-900 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            onClick={() => reset()}
                          >
                            Again?
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MinionBattle;
