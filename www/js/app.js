// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

var appZZcloud = angular.module('starter', ['ionic', 'ngCordova', 'hljs'])

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

appZZcloud.config(function($stateProvider, $urlRouterProvider, hljsServiceProvider){

    $stateProvider.state('side', {
      url: "/side",
      abstract: true,
      templateUrl: "templates/side.html"
    });

    $stateProvider.state('container', {
      url: "/container",
      abstract: true,
      templateUrl: "templates/container.html"
    });

    $stateProvider.state('side.home', {
      url: "/home",
      views: {
        'home-side': {
          templateUrl: "templates/home.html"
        }
      }
    });

    $stateProvider.state('side.cloud', {
      url: "/cloud",
      views: {
        'home-side': {
          templateUrl: "templates/cloud.html",
          controller: 'cloudController'
        }
      }
    });

    $stateProvider.state('side.share', {
      url: "/share",
      views: {
        'share-side': {
          templateUrl: "templates/share.html",
          controller: 'shareController'
        }
      }
    });

    $stateProvider.state('side.calendar', {
      url: "/calendar",
      views: {
        'home-side': {
          templateUrl: "templates/calendar.html"
        }
      }
    });

    $stateProvider.state('side.notes', {
      url: "/notes",
      views: {
        'home-side': {
          templateUrl: "templates/notes.html"
        }
      }
    });

    $stateProvider.state('side.profile', {
      url: "/profile",
      views: {
        'home-side': {
          templateUrl: "templates/profile.html",
          controller: "profileController"
        }
      }
    });

    $stateProvider.state('side.textReader', {
      url: "/textReader",
      params: {'txt': "Error this page need text entry ..."},
      views: {
        'home-side': {
          templateUrl: "templates/textReader.html",
          controller: "textReaderController"
        }
      }
    });

    $stateProvider.state('side.imgReader', {
      url: "/imgReader",
      params: {'img': "img/ionic.png"},
      views: {
        'home-side': {
          templateUrl: "templates/imgReader.html",
          controller: "imgReaderController"
        }
      }
    });

    $stateProvider.state('container.login', {
      url: "/login",
      views: {
        'container-login': {
          templateUrl: "templates/login.html",
          controller: "loginController"
        }
      }
    });

    $urlRouterProvider.otherwise("/container/login");

    // text editor config
    hljsServiceProvider.setOptions({
      // replace tab with 2 spaces
      tabReplace: '    '
    });

});