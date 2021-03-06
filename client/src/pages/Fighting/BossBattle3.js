import React, { useEffect, useState } from "react";
import Auth from "../../utils/auth";
import ModalContainer from "../../components/Modal/ModalContainer";
import { QUERY_USER, QUERY_ME } from "../../utils/queries";
import { ADD_25_ESSENCE } from "../../utils/mutations";
import { useQuery, useMutation } from "@apollo/client";
import { useParams } from "react-router-dom";

//sentences listed after the round, stating a win, loss or draw
const successSentences = ["You have damaged the Boss", "A Remarkable shot"];
const failureSentences = [
  "Demio Counter attacks",
  "Demio dodges, and Swiftly attacks you",
];
const tieSentences = [
  "Your spell didn't even cause a scratch",
  "The Boss Laughs at you",
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

//animations for the user and boss
function addBossDamagedAnimation() {
  document.getElementById("bossIcon").classList.add("animate-wiggle");
}

function removeBossDamagedAnimation() {
  document.getElementById("bossIcon").classList.remove("animate-wiggle");
}

function addBossLaughAnimation() {
  document.getElementById("bossIcon").classList.add("animate-bounce");
}

function removeBossLaughAnimation() {
  document.getElementById("bossIcon").classList.remove("animate-bounce");
}

function addUserDamagedAnimation() {
  document.getElementById("userIcon").classList.add("animate-wiggle");
}

function removeUserDamagedAnimation() {
  document.getElementById("userIcon").classList.remove("animate-wiggle");
}

const BossBattle3 = () => {
  const { username: userParam } = useParams();

  const { loading, data } = useQuery(userParam ? QUERY_USER : QUERY_ME, {
    variables: { username: userParam },
    onCompleted: (data) => {
      // setAPCoefficient(20 * (Math.pow(5, data?.me.ring) / 5));
      setHealthCoefficient(20 * Math.pow(5, data?.me.cloak));
      setUserHealth(20 * Math.pow(5, data?.me.cloak));
      setAttackPower(20 * (Math.pow(5, data?.me.ring) / 5));
      // console.log("health", 20 * Math.pow(5, data?.me.cloak));
      // console.log("cloak", data?.me.cloak);
    },
  });

  const [userAbility, setUserAbility] = useState(null);
  const [bossAbility, setBossAbility] = useState(null);
  const [healthCoefficient, setHealthCoefficient] = useState(null);
  // const [aPCoefficient, setAPCoefficient] = useState(null);
  const [userHealth, setUserHealth] = useState(null);
  const [bossHealth, setBossHealth] = useState(2500);
  const [turnResult, setTurnResult] = useState(null);
  const [result, setResult] = useState("Battle In Progress");
  const [gameOver, setGameOver] = useState(false);
  const [essence, setEssence] = useState();
  const [attackPower, setAttackPower] = useState(null);
  const choices = ["Bolt", "Blast", "Nova"];

  const [addEssence, { error }] = useMutation(ADD_25_ESSENCE);

  //visual change of user health bar
  function userHpDamaged() {
    let health = document.getElementById("userHealthBar");
    health.value -= 500;
    // console.log(health.value);
    // console.log(userHealth);
  }
  //visual change of boss health bar
  function bossHpDamagedFull() {
    let health = document.getElementById("bossHealthBar");
    health.value -= attackPower;
  }

  const handleClick = (value) => {
    setUserAbility(value);
    generateBossAbility();
  };

  const generateBossAbility = () => {
    const randomChoice = choices[Math.floor(Math.random() * choices.length)];
    setBossAbility(randomChoice);
  };

  const reset = () => {
    window.location.reload();
  };

  useEffect(() => {
    const comboMoves = userAbility + bossAbility;
    //If the User chooses correctly
    if (userHealth > 0 && bossHealth > 0) {
      if (
        comboMoves === "NovaBlast" ||
        comboMoves === "BoltNova" ||
        comboMoves === "BlastBolt"
      ) {
        const bossDamaged = bossHealth - attackPower;
        bossHpDamagedFull();
        setBossHealth(bossDamaged);
        setTurnResult(showRandomSuccessSentence());
        addBossDamagedAnimation();
        setTimeout(() => {
          removeBossDamagedAnimation();
        }, 1000);
        if (bossDamaged === 0) {
          setResult("You have Defeated Demio!");
          const gameOff = true;
          const currentEssenceId = data.me._id;
          try {
            const { data } = addEssence({
              variables: {
                id: currentEssenceId,
              },
            });
            setEssence(data.addEssence.essence);
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
        const userDamaged = userHealth - 500;
        userHpDamaged();
        setUserHealth(userDamaged);
        setTurnResult(showRandomFailureSentence);
        addUserDamagedAnimation();
        setTimeout(() => {
          removeUserDamagedAnimation();
        }, 1000);
        if (userDamaged === 0) {
          setResult("You have been Defeated");
          const gameOff = true;
          setGameOver(gameOff);
        }
      }
      //If its a tie
      if (
        comboMoves === "BlastBlast" ||
        comboMoves === "BoltBolt" ||
        comboMoves === "NovaNova"
      ) {
        addBossLaughAnimation();
        setTimeout(() => {
          removeBossLaughAnimation();
        }, 1000);
        setTurnResult(showRandomTieSentence);
      }
    }
  }, [bossAbility, userAbility]);
  const enemies = [
    {
      name: "Demio",
      pathName: "BossBattle3",
      link: "Battle Demio",
      drop: "5",
      imageUrl:
        "https://bn1303files.storage.live.com/y4mGQjPiuuRVVhWzb9OEu7xLkF1iROyAI2IseY2cU-aeem0LsvIEYaeTVJhrryhPMrBD5RaV0GA5jVaO503waHv_oMMrC1o3bdjVjgggBTc-hv5M9KirVcZj7zxf-hZeAN6z1M_D8wj4lye-u7tgJqygX44v234LRKoQVAx81IEjrDj9uZbR-zMn1ZRKGgOsGnMtttoYK7HdcUofmnCyYoRrQ/SpellBook07_58.png?psid=1&width=256&height=256&cropMode=center",
    },
  ];

  //

  return (
    <div>
      {Auth.loggedIn() ? (
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
                          <span className="text-white align-center px-4 mt-2">
                            VS
                          </span>
                          <div>
                            <progress
                              className="h-10 "
                              id="bossHealthBar"
                              value="2500"
                              max="2500"
                            ></progress>
                            <p className="-mt-9 mb-5 text-white flex justify-center">
                              Health: {bossHealth}
                            </p>

                            <img
                              id="bossIcon"
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
      ) : (
        <div>
          <ModalContainer />
        </div>
      )}
    </div>
  );
};

export default BossBattle3;
