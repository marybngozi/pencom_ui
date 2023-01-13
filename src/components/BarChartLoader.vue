<template>
  <div class="wrapper">
    <div class="container-top">
      <div class="bar"></div>
      <div class="bar"></div>
      <div class="bar"></div>
      <div class="bar"></div>
      <div class="bar"></div>
      <div class="bar"></div>
      <div class="bar"></div>
      <div class="bar"></div>
      <div class="bar"></div>
      <div class="bar"></div>
      <div class="bar"></div>
      <div class="bar"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "BarChartLoader",
};
</script>

<style scoped>
.wrapper {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: baseline;
  background: rgb(255, 255, 255);
}

.container-top {
  width: 400px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  transform: scale(0.7) scaleY(0.4);
  /* margin-top: -80px; */
  height: 200px;
}
.bar {
  flex: 0 7 1.625rem;
  height: 100%;
  background-color: #a6b0b6;
  border-radius: 2px;
}
.bar:nth-child(even) {
  background-color: #c7c7c7;
}

.bar:nth-of-type(1) {
  height: 60px;
  animation: graph1 1s ease-in-out infinite;
}
.bar:nth-of-type(2) {
  height: 90px;
  animation: graph2 1s ease-in-out infinite;
  animation-delay: 50ms;
}
.bar:nth-of-type(3) {
  height: 75px;
  animation: graph3 1s ease-in-out infinite;
  animation-delay: 100ms;
}
.bar:nth-of-type(4) {
  height: 2.5rem;
  animation: graph4 1s ease-in-out infinite;
  animation-delay: 150ms;
}
.bar:nth-of-type(5) {
  height: 120px;
  animation: graph5 1s ease-in-out infinite;
  animation-delay: 200ms;
}
.bar:nth-of-type(6) {
  height: 180px;
  animation: graph6 1s ease-in-out infinite;
  animation-delay: 250ms;
}
.bar:nth-of-type(7) {
  height: 145px;
  animation: graph7 1s ease-in-out infinite;
  animation-delay: 300ms;
}
.bar:nth-of-type(8) {
  height: 170px;
  animation: graph8 1s ease-in-out infinite;
  animation-delay: 350ms;
}
.bar:nth-of-type(9) {
  height: 160px;
  animation: graph9 1s ease-in-out infinite;
  animation-delay: 400ms;
}
.bar:nth-of-type(10) {
  height: 80px;
  animation: graph10 1s ease-in-out infinite;
  animation-delay: 450ms;
}
.bar:nth-of-type(11) {
  height: 70px;
  animation: graph11 1s ease-in-out infinite;
  animation-delay: 500ms;
}
.bar:nth-of-type(12) {
  height: 85px;
  animation: graph12 1s ease-in-out infinite;
  animation-delay: 550ms;
}

@keyframes graph1 {
  0% {
    height: 60px;
  }
  25% {
    height: 120px;
  }
}

@keyframes graph2 {
  0% {
    height: 90px;
  }
  25% {
    height: 180px;
  }
}

@keyframes graph3 {
  0% {
    height: 75px;
  }
  25% {
    height: 150px;
  }
}

@keyframes graph4 {
  0% {
    height: 2.5rem;
  }
  25% {
    height: 80px;
  }
}

@keyframes graph5 {
  0% {
    height: 120px;
  }
  25% {
    height: 240px;
  }
}

@keyframes graph6 {
  0% {
    height: 180px;
  }
  25% {
    height: 360px;
  }
}

@keyframes graph7 {
  0% {
    height: 145px;
  }
  25% {
    height: 290px;
  }
}

@keyframes graph8 {
  0% {
    height: 170px;
  }
  25% {
    height: 340px;
  }
}

@keyframes graph9 {
  0% {
    height: 160px;
  }
  25% {
    height: 320px;
  }
}

@keyframes graph10 {
  0% {
    height: 80px;
  }
  25% {
    height: 160px;
  }
}

@keyframes graph11 {
  0% {
    height: 70px;
  }
  25% {
    height: 140px;
  }
}

@keyframes graph12 {
  0% {
    height: 85px;
  }
  25% {
    height: 170px;
  }
}
</style>
