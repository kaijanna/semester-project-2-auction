import { HomePage } from "./pages/home.js";
import { RegisterPage } from "./pages/register.js";
import { LoginPage } from "./pages/login.js";

import { setupSearchBar } from "./components/searchBar.js";
import { setupLoginForm } from "./auth/login.js";
import { setupRegisterForm } from "./auth/register.js";
import { ProfilePage } from "./pages/profile.js";
import {
  SingleListingPage,
  setupSingleListingGallery,
  setupSingleListingBidding,
  setupSingleListingCountdown,
} from "./pages/singleListing.js";
import {
  CreateListingPage,
  setupCreateListingForm,
} from "./pages/createListing.js";
import { EditListingPage, setupEditListingForm } from "./pages/editListing.js";
import { MyListingsPage } from "./pages/myListings.js";
import { MyBidsPage } from "./pages/myBids.js";
import { EditProfilePage, setupEditProfileForm } from "./pages/editProfile.js";
import { SellerProfilePage } from "./pages/sellerProfile.js";

const app = document.getElementById("app");

async function render() {
  if (!app) {
    return;
  }

  const hashFromLocation = window.location.hash || "#/";

  let routePart = hashFromLocation;
  let searchText = "";
  let filter = "all";

  const indexOfQuestionMark = hashFromLocation.indexOf("?");

  if (indexOfQuestionMark !== -1) {
    routePart = hashFromLocation.substring(0, indexOfQuestionMark);
    const queryString = hashFromLocation.substring(indexOfQuestionMark + 1);

    const params = new URLSearchParams(queryString);
    const searchFromUrl = params.get("q");
    const filterFromUrl = params.get("filter");

    if (searchFromUrl) {
      searchText = searchFromUrl;
    }

    if (filterFromUrl) {
      filter = filterFromUrl;
    }
  }

  let pageHtml = "";
  let currentRoute = "home";
  let currentListingId = null;

  if (routePart === "#/register") {
    pageHtml = RegisterPage();
    currentRoute = "register";
  } else if (routePart === "#/login") {
    pageHtml = LoginPage();
    currentRoute = "login";
  } else if (routePart === "#/profile") {
    pageHtml = await ProfilePage();
    currentRoute = "profile";
  } else if (routePart === "#/edit-profile") {
    pageHtml = await EditProfilePage();
    currentRoute = "edit-profile";
  } else if (routePart === "#/my-listings") {
    pageHtml = await MyListingsPage();
    currentRoute = "my-listings";
  } else if (routePart === "#/create") {
    pageHtml = CreateListingPage();
    currentRoute = "create";
  } else if (routePart.startsWith("#/edit-listing/")) {
    const listingId = routePart.replace("#/edit-listing/", "");
    pageHtml = await EditListingPage(listingId);
    currentRoute = "edit-listing";
    currentListingId = listingId;
  } else if (routePart.startsWith("#/listing/")) {
    const listingId = routePart.replace("#/listing/", "");
    pageHtml = await SingleListingPage(listingId);
    currentRoute = "listing";
    currentListingId = listingId;
  } else if (routePart === "#/my-bids") {
    pageHtml = await MyBidsPage();
    currentRoute = "my-bids";
  } else if (routePart === "#/search") {
    pageHtml = await HomePage(searchText, filter);
    currentRoute = "search";
  } else if (routePart.startsWith("#/seller/")) {
    const sellerNameFromUrl = routePart.replace("#/seller/", "");
    const sellerName = decodeURIComponent(sellerNameFromUrl);

    pageHtml = await SellerProfilePage(sellerName);
    currentRoute = "seller-profile";
  } else {
    pageHtml = await HomePage("", filter);
    currentRoute = "home";
  }

  app.innerHTML = pageHtml;

  if (currentRoute === "register") {
    setupRegisterForm();
  } else if (currentRoute === "login") {
    setupLoginForm();
  }

  if (currentRoute === "listing") {
    setupSingleListingGallery();
    setupSingleListingBidding(currentListingId);
    setupSingleListingCountdown();
  }
  if (currentRoute === "create") {
    setupCreateListingForm();
  }

  if (currentRoute === "edit-listing") {
    setupEditListingForm(currentListingId);
  }

  if (currentRoute === "edit-profile") {
    setupEditProfileForm();
  }

  if (currentRoute === "home" || currentRoute === "search") {
    setupSearchBar();
  }

  const logoutButton = document.getElementById("logoutButton");
  const logoutButtonMobile = document.getElementById("logoutButtonMobile");

  function handleLogoutClick() {
    localStorage.removeItem("auth");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("profileName");
    window.location.hash = "#/login";
  }

  if (logoutButton) {
    logoutButton.addEventListener("click", handleLogoutClick);
  }

  if (logoutButtonMobile) {
    logoutButtonMobile.addEventListener("click", handleLogoutClick);
  }

  const mobileMenuButton = document.getElementById("mobileMenuButton");
  const mobileMenu = document.getElementById("mobileMenu");

  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener("click", function () {
      const isHidden = mobileMenu.classList.contains("hidden");

      if (isHidden) {
        mobileMenu.classList.remove("hidden");
      } else {
        mobileMenu.classList.add("hidden");
      }
    });
  }
  if (window.lucide && typeof window.lucide.createIcons === "function") {
    window.lucide.createIcons();
  }
}

window.addEventListener("load", function () {
  render();
});

window.addEventListener("hashchange", function () {
  render();
});
