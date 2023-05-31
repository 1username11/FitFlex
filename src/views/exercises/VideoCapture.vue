<template>
  <div id="app">
    <video ref="videoRef" src="https://qmkeigkuramlfzjmpxug.supabase.co/storage/v1/object/public/exercises/0.7932975692670219.mp4" autoplay loop/><br>
    <button @click="capture">Play and Capture</button>
    <div>------------------Show captured thumbnail below -----------------</div>
    <canvas ref="canvasRef" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const videoRef = ref<HTMLVideoElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)

const capture = () => {
  if (videoRef.value && canvasRef.value) {
    const ctx = canvasRef.value.getContext('2d')
    ctx?.drawImage(videoRef.value, 0, 0, videoRef.value.videoWidth, videoRef.value.videoHeight)
    const image = canvasRef.value.toDataURL()
    console.log(image)
  }
}
</script>

<style>
#canvas {
  display: inline-block;
  top: 4px;
  position: relative;
  border: dotted 1px #ccc;
  padding: 2px;
  width: 100%;
}
</style>
