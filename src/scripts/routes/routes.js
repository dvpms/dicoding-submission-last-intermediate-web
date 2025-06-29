// routes.js
import HomePage from "../pages/home/home-page";
import AboutPage from "../pages/about/about-page";
import LoginPage from "../pages/auth/login-page";
import AddStoryPage from "../pages/addstory/add-story-page";
import RegisterPage from "../pages/auth/register-page";
import SavedStoriesPage from "../pages/saved/save-stories-page";

const routes = {
  "/": new HomePage(),
  "/about": new AboutPage(),
  "/login": new LoginPage(),
  "/register": new RegisterPage(),
  "/add-story": new AddStoryPage(),
  "/saved": new SavedStoriesPage(),
};

export default routes;
