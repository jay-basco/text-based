const readline = require("readline");

let newState = "start";
const debug = false;

const log = (entry) => {
  const e = typeof entry === "object" ? JSON.stringify(entry, null, 4) : entry;
  if (debug) console.log(e);
};

const _module = {
  start: {
    tasks: ["character", "shop"],
    question: {
      text: "Would you like to play a game?",
      answers: {
        yes: { type: "nav", value: "stall" },
        no: { type: "nav", value: "end" },
      },
    },
  },
  stall: {
    description:
      "You wake up in what appears to be a public restroom stall.  You have no idea how you got here.",
    question: {
      text: "Would you like to leave the stall?",
      answers: {
        yes: { type: "nav", value: "end" },
        no: { type: "question", value: "question2" },
      },
      question2: {
        text: "Well then, maybe have a pee?",
        answers: {
          yes: { type: "nav", value: "end" },
          no: { type: "nav", value: "pee" },
        },
      },
    },
  },

  pee: {
    statement: { text: "You're spare parts bud...", type: "nav", value: "end" },
  },

  end: {},
};

const getAnswer = (question, answer) => {
  log({ question, answer });
  const { type, value } = question["answers"][answer];
  log({ type, value });

  if (type === "nav") {
    log({ nav: value });
    newState = value;
  }

  if (type === "question") {
    log({ question: question[value] });
    askQuestion(question[value]);
  }
};

const askQuestion = (question) => {
  const { text } = question;
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  log("ask");
  rl.question(`${text} `, (answer) => {
    console.log({ answer });
    rl.close();
    getAnswer(question, answer);
  });
};

const doStatement = ({ text, type, value }) => {
  console.log(text);
  if (type === "nav") {
    log({ nav: value });
    newState = value;
  }
};

const runModule = ({ description, question, statement }) => {
  if (description) {
    console.log(description);
  }
  if (question) {
    askQuestion(question);
  }
  if (statement) {
    doStatement(statement);
  }
};

const checkState = () => {
  let currentState;

  const intervalId = setInterval(() => {
    if (newState === currentState) {
    } else if (newState === "end") {
      console.log("Game Over!!!");
      clearInterval(intervalId);
    } else {
      currentState = newState;
      runModule(_module[newState]);
    }
  }, 200);
};

checkState();
