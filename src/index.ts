import App from "./App";
import appConfig from "./config/app";

App.listen(appConfig.port, () => {
  console.log(`Server is running on port ${appConfig.port}`);
});
