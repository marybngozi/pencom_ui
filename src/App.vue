<template>
  <router-view />
</template>

<style>
body {
  overflow: hidden;
}
@font-face {
  font-family: "CircularStd";
  src: url("./assets/font/CircularStd-Book.ttf");
  font-weight: 400;
  font-style: normal;
}
@font-face {
  font-family: "CircularStd";
  src: url("./assets/font/CircularStd-BlackItalic.ttf");
  font-weight: normal;
  font-style: italic;
}
@font-face {
  font-family: "CircularStd";
  src: url("./assets/font/CircularStd-Bold.ttf");
  font-weight: bold;
  font-style: normal;
}
@font-face {
  font-family: "CircularStd";
  src: url("./assets/font/CircularStd-Medium.ttf");
  font-weight: 500;
  font-style: normal;
}
@font-face {
  font-family: "CircularStd";
  src: url("./assets/font/CircularStd-MediumItalic.ttf");
  font-weight: 500;
  font-style: italic;
}
* {
  font-family: "CircularStd", sans-serif;
}
.fs-6 {
  font-size: 0.975rem;
}
.fs-7 {
  font-size: 0.875rem;
}
.fs-8 {
  font-size: 0.813rem;
}
.fs-9 {
  font-size: 0.7rem;
}

.swal2-confirm {
  background: #ed342b !important;
  padding: 0.5rem 1.5rem !important;
}
</style>
