const fs = require("fs");
const core = require("@actions/core");
const yaml = require("yaml");

try {
  // const gaeConfigPath = "./app.yml";
  const gaeConfigPath = core.getInput("path-to-app-yml");
  const fileContents = fs.readFileSync(gaeConfigPath, "utf8");
  const appYmlContent = yaml.parse(fileContents) || {};
  // const secrets = `ewogICJmb28iOiAiYmFyIgp9Cg==`;
  const secrets = core.getInput("gae_variables");
  if (secrets) {
    const secretsBuffer = Buffer.from(secrets, "base64");
    const appYmlContentWithVrs = Object.assign(appYmlContent, {
      env_variables: JSON.parse(secretsBuffer.toString()),
    });
    let yamlStr = yaml.stringify(appYmlContentWithVrs);
    console.log("yamlStr", yamlStr);
    fs.writeFileSync(gaeConfigPath, yamlStr, "utf8");
  }
} catch (error) {
  core.setFailed(error.message);
}
