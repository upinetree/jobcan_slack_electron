const fs = require("fs");
const sample = require("lodash.sample");
const axios = require("axios");
const qs = require("querystring");
const yaml = require("js-yaml");

function homePath(relativePath) {
  const key = process.platform == "win32" ? "USERPROFILE" : "HOME";
  return `${process.env[key]}/${relativePath}`;
}

function imagePath(relativePath) {
  return homePath(`jobcan/images/${relativePath}`);
}

async function getLastMessage(channel, token) {
  const endpoint = "https://slack.com/api/conversations.history";
  const query = {
    token: token,
    channel: channel,
    limit: 1
  };

  return await axios
    .get(endpoint, { params: query })
    .then(res => {
      console.log(res);
      return res.data.messages[0].text;
    })
    .catch(err => {
      alert(`Slack request error: ${err}`);
    });
}

async function jobcanCommand(command, channel, token) {
  const endpoint = "https://slack.com/api/chat.command";
  const query = qs.stringify({
    token: token,
    channel: channel,
    command: `/${command}`,
    as_user: "true"
  });

  return await axios
    .post(endpoint, query)
    .then(res => {
      console.log(res);
      if (res.data.error) {
        alert(`Slack request error: ${res.data.error}`);
      }
    })
    .catch(err => {
      alert(`Slack request error: ${err}`);
    });
}

function jobcanTouch(channel, token) {
  return jobcanCommand("jobcan_touch", channel, token);
}

function jobcanWorktime(channel, token) {
  return jobcanCommand("jobcan_worktime", channel, token);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function loadConfig() {
  try {
    return yaml.safeLoad(
      fs.readFileSync(homePath("jobcan/config.yml"), "utf8")
    );
  } catch (e) {
    alert("Failed to laod config.yml");
  }
}

const allowedExtensions = /.+\.(png|jpg|jpeg|gif)/;

const touchStrategy = async ({ channel, token }) => {
  await jobcanTouch(channel, token);
  await jobcanWorktime(channel, token);
  await sleep(3000);
  const state = await getLastMessage(channel, token).then(text =>
    text.match(/勤務中/) ? "start" : "finish"
  );
  return state;
};

const touchStrategyMock = _config => {
  const state = localStorage.getItem("jobcanMockState") || "start";
  const nextState = state === "start" ? "finish" : "start";
  localStorage.setItem("jobcanMockState", nextState);
  alert(`It's dry run!! Switching state to ${nextState}`);
  return state;
};

window.addEventListener("load", async () => {
  const config = loadConfig();
  const touchProcess = config["dryrun"] ? touchStrategyMock : touchStrategy;
  const root = document.querySelector("#root");
  const img = document.createElement("img");

  img.classList.add("result-image");

  const state = await touchProcess(config);

  const imageNames = fs
    .readdirSync(imagePath(state))
    .filter(name => name.match(allowedExtensions));
  img.setAttribute("src", imagePath(`${state}/${sample(imageNames)}`));
  root.appendChild(img);

  await sleep(3000);
  close();
});
