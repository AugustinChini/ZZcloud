// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

var appZZcloud = angular.module('starter', ['ionic'])

appZZcloud.run(function($ionicPlatform, $http) {

  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });

});

appZZcloud.config(function($stateProvider, $urlRouterProvider){

    $stateProvider.state('home', {
      url: "/home",
      templateUrl: "templates/home.html"
    });
    
    $stateProvider.state('cloud', {
      url: "/cloud",
      templateUrl: "templates/cloud.html",
      controller: 'getWebDavContent'
    });

    $stateProvider.state('cal', {
      url: "/calendrier",
      templateUrl: "templates/calendrier.html"
    });

    $stateProvider.state('notes', {
      url: "/notes",
      templateUrl: "templates/notes.html"
    });

    $stateProvider.state('profil', {
      url: "/profil",
      templateUrl: "templates/profil.html"
    });

    $stateProvider.state('login', {
      url: "/login",
      templateUrl: "templates/login.html"
    });

    $urlRouterProvider.otherwise("/login");
});